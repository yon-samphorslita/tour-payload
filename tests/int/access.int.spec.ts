// Access rules and hooks, tested through Payload's Local API on the in-memory database.
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { Enquiries } from '@/collections/Enquiries'
import type { User } from '@/payload-types'
import { beforeAll, describe, expect, it } from 'vitest'
import { TEST_ENQUIRY_API_KEY } from '../helpers/testEnv'

let payload: Payload
let admin: User
let staff: User
let otherStaff: User
let tax: User

// Payload's access functions expect `collection` on the logged-in user.
async function createUser(email: string, role: User['role']): Promise<User> {
  const user = await payload.create({
    collection: 'users',
    data: { email, password: 'test-password', name: email, role },
  })
  return { ...user, collection: 'users' }
}

// A minimal valid sale, so each test only states what it cares about.
function saleData(invoiceNo: string) {
  return {
    invoiceNo,
    customerName: 'Test Customer',
    invoiceDate: '2026-01-15T00:00:00.000Z',
    exchangeRate: 4100,
    lineItems: [
      { description: 'Service Charge', quantity: 2, unitPrice: 10 },
      { description: 'Visa fee', quantity: 1, unitPrice: 30 },
    ],
  }
}

beforeAll(async () => {
  payload = await getPayload({ config: await config })
  admin = await createUser('int-admin@example.test', 'admin')
  staff = await createUser('int-staff@example.test', 'staff')
  otherStaff = await createUser('int-staff-2@example.test', 'staff')
  tax = await createUser('int-tax@example.test', 'tax')
})

describe('users', () => {
  it('hides users from anonymous visitors', async () => {
    await expect(payload.find({ collection: 'users', overrideAccess: false })).rejects.toThrow()
  })

  it('lets staff see only their own record', async () => {
    const result = await payload.find({ collection: 'users', overrideAccess: false, user: staff })
    expect(result.docs.map((doc) => doc.id)).toEqual([staff.id])
  })

  it('does not let staff promote themselves to admin', async () => {
    await payload.update({
      collection: 'users',
      id: staff.id,
      data: { role: 'admin' },
      overrideAccess: false,
      user: staff,
    })
    const reloaded = await payload.findByID({ collection: 'users', id: staff.id })
    expect(reloaded.role).toBe('staff')
  })

  it('only lets admins create users', async () => {
    const newUser = {
      email: 'new@example.test',
      password: 'test-password',
      name: 'New',
      role: 'staff' as const,
    }
    await expect(
      payload.create({ collection: 'users', data: newUser, overrideAccess: false, user: staff }),
    ).rejects.toThrow()
    const created = await payload.create({
      collection: 'users',
      data: newUser,
      overrideAccess: false,
      user: admin,
    })
    expect(created.email).toBe(newUser.email)
  })
})

describe('enquiries', () => {
  // Calls the create rule directly, the way Payload does for a REST request.
  function canCreateWithHeader(headerValue: string | null) {
    const headers = new Headers()
    if (headerValue !== null) headers.set('x-enquiry-key', headerValue)
    return Enquiries.access!.create!({ req: { user: null, headers } } as never)
  }

  it('accepts the shared enquiry key', () => {
    expect(canCreateWithHeader(TEST_ENQUIRY_API_KEY)).toBe(true)
  })

  it('rejects a missing or wrong key', () => {
    expect(canCreateWithHeader(null)).toBe(false)
    expect(canCreateWithHeader('wrong-key')).toBe(false)
    expect(canCreateWithHeader(TEST_ENQUIRY_API_KEY.slice(0, -1) + 'x')).toBe(false)
  })

  it('rejects every request when the server has no key set', () => {
    const savedKey = process.env.ENQUIRY_API_KEY
    delete process.env.ENQUIRY_API_KEY
    try {
      expect(canCreateWithHeader('')).toBe(false)
      expect(canCreateWithHeader(TEST_ENQUIRY_API_KEY)).toBe(false)
    } finally {
      process.env.ENQUIRY_API_KEY = savedKey
    }
  })

  it('shows enquiries to staff but not to anonymous or tax users', async () => {
    await payload.create({ collection: 'enquiries', data: { name: 'Visitor', phone: '012345678' } })

    await expect(payload.find({ collection: 'enquiries', overrideAccess: false })).rejects.toThrow()
    await expect(
      payload.find({ collection: 'enquiries', overrideAccess: false, user: tax }),
    ).rejects.toThrow()

    const staffView = await payload.find({
      collection: 'enquiries',
      overrideAccess: false,
      user: staff,
    })
    expect(staffView.totalDocs).toBeGreaterThan(0)
  })
})

describe('visa countries (drafts)', () => {
  it('shows only published countries to anonymous visitors', async () => {
    await payload.create({
      collection: 'visa-countries',
      data: { name: 'Published Land', slug: 'published-land', _status: 'published' },
    })
    await payload.create({
      collection: 'visa-countries',
      data: { name: 'Draft Land', slug: 'draft-land', _status: 'draft' },
      draft: true,
    })

    const publicView = await payload.find({ collection: 'visa-countries', overrideAccess: false })
    const publicSlugs = publicView.docs.map((doc) => doc.slug)
    expect(publicSlugs).toContain('published-land')
    expect(publicSlugs).not.toContain('draft-land')

    const staffView = await payload.find({
      collection: 'visa-countries',
      overrideAccess: false,
      user: staff,
      draft: true,
    })
    expect(staffView.docs.map((doc) => doc.slug)).toContain('draft-land')
  })
})

describe('sales', () => {
  it('blocks anonymous visitors and the read-only tax role', async () => {
    await expect(payload.find({ collection: 'sales', overrideAccess: false })).rejects.toThrow()
    await expect(
      payload.create({
        collection: 'sales',
        data: saleData('T-TAX-1'),
        overrideAccess: false,
        user: tax,
      }),
    ).rejects.toThrow()
  })

  it('computes totals and records who created the sale', async () => {
    const sale = await payload.create({
      collection: 'sales',
      data: saleData('T-0001'),
      overrideAccess: false,
      user: staff,
    })

    expect(sale.grandTotalUSD).toBe(50)
    expect(sale.grandTotalKHR).toBe(50 * 4100)
    expect(sale.lineItems.map((item) => item.amount)).toEqual([20, 30])
    expect(sale.preparedBy).toBe(staff.name)
    const createdById = typeof sale.createdBy === 'object' ? sale.createdBy?.id : sale.createdBy
    expect(createdById).toBe(staff.id)
  })

  it('requires a customer name or a client', async () => {
    const data = { ...saleData('T-0002'), customerName: '  ' }
    await expect(
      payload.create({ collection: 'sales', data, overrideAccess: false, user: staff }),
    ).rejects.toThrow()
  })

  it('saves the exchange rate for a new date but never overwrites it', async () => {
    await payload.create({
      collection: 'sales',
      data: { ...saleData('T-0003'), invoiceDate: '2026-02-01T00:00:00.000Z' },
      user: staff,
    })
    await payload.create({
      collection: 'sales',
      data: { ...saleData('T-0004'), invoiceDate: '2026-02-01T00:00:00.000Z', exchangeRate: 9999 },
      user: staff,
    })

    const rates = await payload.find({
      collection: 'exchange-rates',
      where: { date: { equals: '2026-02-01' } },
    })
    expect(rates.docs).toHaveLength(1)
    expect(rates.docs[0].rate).toBe(4100)
  })

  it('lets staff delete only their own sales', async () => {
    const othersSale = await payload.create({
      collection: 'sales',
      data: saleData('T-0005'),
      user: otherStaff,
    })
    const ownSale = await payload.create({
      collection: 'sales',
      data: saleData('T-0006'),
      user: staff,
    })

    await expect(
      payload.delete({
        collection: 'sales',
        id: othersSale.id,
        overrideAccess: false,
        user: staff,
      }),
    ).rejects.toThrow()
    await payload.delete({
      collection: 'sales',
      id: ownSale.id,
      overrideAccess: false,
      user: staff,
    })

    await expect(payload.findByID({ collection: 'sales', id: ownSale.id })).rejects.toThrow()
  })
})
