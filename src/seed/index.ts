// Seeds placeholder website content. Usage: npm run seed
// Safe to re-run: records are matched by slug and updated.
import { getPayload, type Payload } from 'payload'
import config from '../payload.config'
import { navLinks, pages, services, siteSettings, visaCountries, type PageSeed } from './content'

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
      summary: l === 'en' ? '[placeholder] Requirements change; confirm before applying.' : '[placeholder] លក្ខខណ្ឌអាចផ្លាស់ប្តូរ សូមបញ្ជាក់មុនពេលដាក់ពាក្យ។',
      documents: c.documents[l],
      processingTime: l === 'en' ? '[placeholder] 7–15 working days' : '[placeholder] ៧–១៥ ថ្ងៃធ្វើការ',
      priceNote: l === 'en' ? '[placeholder] Embassy fee plus service fee.' : '[placeholder] ថ្លៃស្ថានទូត បូកថ្លៃសេវា។',
    })
    await upsert(payload, 'visa-countries', c.slug, { ...localized('en'), order: c.order }, localized('km'))
  }
}

async function seedPage(payload: Payload, page: PageSeed) {
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
