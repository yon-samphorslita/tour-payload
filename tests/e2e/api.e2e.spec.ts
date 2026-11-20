// REST API checks against the test server: what anonymous visitors, the public site and staff can reach.
import { expect, test } from '@playwright/test'
import { getApiToken } from '../helpers/login'
import { TEST_ENQUIRY_API_KEY, testUsers } from '../helpers/testEnv'

test.describe('Public REST API', () => {
  test('health endpoint answers without login', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
  })

  test('published website content is public', async ({ request }) => {
    const services = await request.get('/api/services?locale=en&limit=50')
    expect(services.status()).toBe(200)
    const serviceSlugs = (await services.json()).docs.map((doc: { slug: string }) => doc.slug)
    expect(serviceSlugs).toContain('visa-preparation')

    const visaCountries = await request.get(
      '/api/visa-countries?where[slug][equals]=france&locale=km',
    )
    expect((await visaCountries.json()).docs).toHaveLength(1)
  })

  for (const collection of [
    'users',
    'sales',
    'purchases',
    'clients',
    'enquiries',
    'exchange-rates',
  ]) {
    test(`anonymous visitors cannot list ${collection}`, async ({ request }) => {
      const response = await request.get(`/api/${collection}`)
      expect(response.status()).toBe(403)
    })
  }
})

test.describe('Enquiries from the public site', () => {
  const enquiry = { name: 'API Test Visitor', phone: '012 000 111', form: 'general', locale: 'en' }

  test('rejects an enquiry without the shared key', async ({ request }) => {
    const response = await request.post('/api/enquiries', { data: enquiry })
    expect(response.status()).toBe(403)
  })

  test('rejects an enquiry with the wrong key', async ({ request }) => {
    const response = await request.post('/api/enquiries', {
      data: enquiry,
      headers: { 'x-enquiry-key': 'not-the-right-key' },
    })
    expect(response.status()).toBe(403)
  })

  test('stores an enquiry sent with the shared key, readable by staff only', async ({
    request,
  }) => {
    const response = await request.post('/api/enquiries', {
      data: enquiry,
      headers: { 'x-enquiry-key': TEST_ENQUIRY_API_KEY },
    })
    expect(response.status()).toBe(201)

    const staffToken = await getApiToken(request, testUsers.staff)
    const staffView = await request.get(
      `/api/enquiries?where[name][equals]=${encodeURIComponent(enquiry.name)}`,
      {
        headers: { Authorization: `JWT ${staffToken}` },
      },
    )
    expect((await staffView.json()).docs[0]).toMatchObject({ phone: enquiry.phone, status: 'new' })

    const taxToken = await getApiToken(request, testUsers.tax)
    const taxView = await request.get('/api/enquiries', {
      headers: { Authorization: `JWT ${taxToken}` },
    })
    expect(taxView.status()).toBe(403)
  })
})

test.describe('Login', () => {
  test('rejects a wrong password', async ({ request }) => {
    const response = await request.post('/api/users/login', {
      data: { email: testUsers.staff.email, password: 'wrong-password' },
    })
    expect(response.status()).toBe(401)
  })

  test('returns the user without the password hash', async ({ request }) => {
    const response = await request.post('/api/users/login', {
      data: { email: testUsers.staff.email, password: testUsers.staff.password },
    })
    const body = await response.json()
    expect(body.user).toMatchObject({ email: testUsers.staff.email, role: 'staff' })
    expect(body.user.hash).toBeUndefined()
    expect(body.user.salt).toBeUndefined()
  })
})
