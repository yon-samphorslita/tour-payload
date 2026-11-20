// Seeds placeholder website content. Usage: npm run seed
// Safe to re-run: records are matched by slug and updated.
import { getPayload, type Payload } from 'payload'
import config from '../payload.config'
import { navLinks, pages, services, siteSettings, visaCountries, type BlockSeed, type PageSeed } from './content'

// Refuse anything that doesn't look like a dev database.
function assertDevDatabase() {
  const uri = process.env.DATABASE_URI ?? ''
  const dbName = uri.split('?')[0].split('/').pop() ?? ''
  if (!/dev|test|local/i.test(dbName)) {
    console.error(`Refusing to seed database "${dbName || '(unknown)'}": name must contain dev, test or local.`)
    process.exit(1)
  }
  return dbName
}

// Create or update by slug in English, then write the Khmer fields.
async function upsert(payload: Payload, collection: 'services' | 'visa-countries', slug: string, en: object, km: object) {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true })
  const data = { ...en, slug, _status: 'published' } as never
  const saved = existing.docs[0]
    ? await payload.update({ collection, id: existing.docs[0].id, locale: 'en', data })
    : await payload.create({ collection, locale: 'en', data })
  await payload.update({ collection, id: saved.id, locale: 'km', data: { ...km, _status: 'published' } as never })
  payload.logger.info(`${collection}/${slug}: ${existing.docs[0] ? 'updated' : 'created'}`)
  return saved.id
}

async function seedServices(payload: Payload) {
  const ids: Record<string, string> = {}
  for (const s of services) {
    const localized = (l: 'en' | 'km') => ({
      title: s.title[l],
      summary: s.summary[l],
      body: s.body[l],
      documents: s.documents[l],
      processingTime: s.processingTime[l],
      priceNote: s.priceNote[l],
      steps: s.steps[l],
      enquiry: { form: s.form, buttonLabel: s.buttonLabel[l], messagePrefill: s.messagePrefill[l] },
    })
    ids[s.slug] = await upsert(payload, 'services', s.slug, {
      ...localized('en'),
      icon: s.icon,
      order: s.order,
      showAgencyNotice: Boolean(s.showAgencyNotice),
      listsVisaCountries: Boolean(s.listsVisaCountries),
    }, localized('km'))
  }
  for (const s of services.filter((s) => s.related?.length)) {
    await payload.update({
      collection: 'services',
      id: ids[s.slug],
      data: { relatedServices: s.related!.map((slug) => ids[slug]), _status: 'published' } as never,
    })
  }
}

async function seedVisaCountries(payload: Payload) {
  for (const c of visaCountries) {
    const localized = (l: 'en' | 'km') => ({
      name: c.name[l],
      summary: c.summary[l],
      documents: c.documents[l],
      processingTime: c.processingTime[l],
      priceNote: c.priceNote[l],
      notes: c.notes[l],
    })
    await upsert(payload, 'visa-countries', c.slug, { ...localized('en'), order: c.order }, localized('km'))
  }
}

// Finds an uploaded Website Media file by name, so the seed works on any database.
async function findMediaIdByFilename(payload: Payload, filename: string) {
  const result = await payload.find({ collection: 'website-media', where: { filename: { equals: filename } }, limit: 1, depth: 0 })
  if (!result.docs[0]) {
    payload.logger.warn(`website-media "${filename}" not found; seeding without it`)
    return undefined
  }
  return result.docs[0].id
}

// Swaps image filenames for media IDs. An Image + Text block without its image becomes plain rich text.
async function resolveBlockImages(payload: Payload, block: BlockSeed): Promise<BlockSeed> {
  if (!block.images) return block
  const imageFields: Record<string, string> = {}
  for (const [fieldName, filename] of Object.entries(block.images)) {
    const mediaId = await findMediaIdByFilename(payload, filename)
    if (mediaId) imageFields[fieldName] = mediaId
  }
  if (block.blockType === 'imageText' && !imageFields.image) {
    return { blockType: 'richText', en: block.en, km: block.km }
  }
  return { ...block, shared: { ...block.shared, ...imageFields } }
}

async function seedPage(payload: Payload, pageSeed: PageSeed) {
  const resolvedLayout: BlockSeed[] = []
  for (const block of pageSeed.layout) resolvedLayout.push(await resolveBlockImages(payload, block))
  const page = { ...pageSeed, layout: resolvedLayout }

  const en = { title: page.title.en, layout: page.layout.map((b) => ({ blockType: b.blockType, ...b.shared, ...b.en })) }
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: page.slug } }, limit: 1, depth: 0, draft: true })
  const data = { ...en, slug: page.slug, _status: 'published' } as never
  const saved = existing.docs[0]
    ? await payload.update({ collection: 'pages', id: existing.docs[0].id, locale: 'en', data })
    : await payload.create({ collection: 'pages', locale: 'en', data })
  // Blocks aren't localized as a whole, so Khmer reuses the English block IDs.
  const layout = (saved.layout ?? []).map((block, i) => ({ ...block, ...page.layout[i].km }))
  await payload.update({
    collection: 'pages',
    id: saved.id,
    locale: 'km',
    data: { title: page.title.km, layout, _status: 'published' } as never,
  })
  payload.logger.info(`pages/${page.slug}: ${existing.docs[0] ? 'updated' : 'created'}`)
}

async function seedSiteSettings(payload: Payload) {
  const { address, openingHours, agencyNotice, ...shared } = siteSettings
  const en = await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      ...shared,
      navLinks: navLinks.map(({ link, en }) => ({ link, label: en })),
      address: address.en,
      openingHours: openingHours.en,
      agencyNotice: agencyNotice.en,
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'km',
    data: {
      navLinks: (en.navLinks ?? []).map((item, i) => ({ ...item, label: navLinks[i].km })),
      address: address.km,
      openingHours: openingHours.km,
      agencyNotice: agencyNotice.km,
    },
  })
}

async function main() {
  const dbName = assertDevDatabase()
  const payload = await getPayload({ config })
  payload.logger.info(`Seeding "${dbName}"`)

  await seedServices(payload)
  await seedVisaCountries(payload)
  for (const page of pages) await seedPage(payload, page)
  await seedSiteSettings(payload)

  payload.logger.info('Done.')
}

// Top-level await: `payload run` exits as soon as the import resolves.
await main()
