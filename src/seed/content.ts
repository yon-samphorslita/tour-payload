// Placeholder content for dev databases. Anything marked [placeholder] needs
// real business facts; Khmer text is a draft for review.
import { h2, p, richText } from './richText'

type L<T> = { en: T; km: T }
type Doc = { item: string; note?: string }
type Step = { title: string; description?: string }

export type BlockSeed = { blockType: string; shared?: Record<string, unknown>; en: Record<string, unknown>; km: Record<string, unknown> }
export type PageSeed = { slug: string; title: L<string>; layout: BlockSeed[] }

export type ServiceSeed = {
  slug: string
  icon: string
  order: number
  form: 'general' | 'ticket'
  showAgencyNotice?: boolean
  listsVisaCountries?: boolean
  related?: string[]
  title: L<string>
  summary: L<string>
  body: L<ReturnType<typeof richText>>
  documents: L<Doc[]>
  processingTime: L<string>
  priceNote: L<string>
  steps: L<Step[]>
  buttonLabel: L<string>
  messagePrefill: L<string>
}

const PH = '[placeholder]'
const timeTbc: L<string> = { en: `${PH} 5–7 working days`, km: `${PH} ៥–៧ ថ្ងៃធ្វើការ` }
const priceTbc: L<string> = { en: `${PH} Price depends on the case. Ask us for a quote.`, km: `${PH} តម្លៃអាស្រ័យលើករណី។ សូមសួរតម្លៃពីយើង។` }
const askLabel: L<string> = { en: 'Ask about this service', km: 'សួរអំពីសេវានេះ' }

const enquirySteps: L<Step[]> = {
  en: [
    { title: 'Send an enquiry', description: 'Use the form, Telegram or phone.' },
    { title: 'Bring your documents', description: 'We check everything before submitting.' },
    { title: 'We follow up', description: 'We keep you updated until it is done.' },
  ],
  km: [
    { title: 'ផ្ញើសំណួរ', description: 'តាមរយៈទម្រង់ Telegram ឬទូរស័ព្ទ។' },
    { title: 'យកឯកសាររបស់អ្នកមក', description: 'យើងពិនិត្យគ្រប់យ៉ាងមុនពេលដាក់ពាក្យ។' },
    { title: 'យើងតាមដាន', description: 'យើងជូនដំណឹងអ្នករហូតដល់រួចរាល់។' },
  ],
}

const ticketSteps: L<Step[]> = {
  en: [
    { title: 'Tell us your trip', description: 'Route, date and number of passengers.' },
    { title: 'Get options', description: 'We reply with available times and prices.' },
    { title: 'Confirm and pay', description: 'At our office or as we agree.' },
  ],
  km: [
    { title: 'ប្រាប់យើងពីដំណើររបស់អ្នក', description: 'ផ្លូវ កាលបរិច្ឆេទ និងចំនួនអ្នកដំណើរ។' },
    { title: 'ទទួលជម្រើស', description: 'យើងឆ្លើយតបជាមួយម៉ោង និងតម្លៃដែលមាន។' },
    { title: 'បញ្ជាក់ និងបង់ប្រាក់', description: 'នៅការិយាល័យរបស់យើង ឬតាមការព្រមព្រៀង។' },
  ],
}

const passportDocs: L<Doc[]> = {
  en: [{ item: 'Khmer national ID card' }, { item: 'Family book' }, { item: 'Birth certificate' }, { item: 'Old passport', note: 'For renewals' }],
  km: [{ item: 'អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ' }, { item: 'សៀវភៅគ្រួសារ' }, { item: 'សំបុត្រកំណើត' }, { item: 'លិខិតឆ្លងដែនចាស់', note: 'សម្រាប់ការបន្ត' }],
}

const ticketDocs: L<Doc[]> = {
  en: [{ item: 'Passenger names as in passport or ID' }, { item: 'Passport details', note: 'International trips' }],
  km: [{ item: 'ឈ្មោះអ្នកដំណើរដូចក្នុងលិខិតឆ្លងដែន ឬអត្តសញ្ញាណប័ណ្ណ' }, { item: 'ព័ត៌មានលិខិតឆ្លងដែន', note: 'ដំណើរអន្តរជាតិ' }],
}

export const services: ServiceSeed[] = [
  {
    slug: 'visa-preparation',
    icon: 'visa',
    order: 1,
    form: 'general',
    listsVisaCountries: true,
    related: ['translation'],
    title: { en: 'Visa preparation', km: 'ការរៀបចំទិដ្ឋាការ' },
    summary: {
      en: 'We prepare and check your visa application for travel abroad.',
      km: 'យើងរៀបចំ និងពិនិត្យពាក្យសុំទិដ្ឋាការរបស់អ្នក សម្រាប់ការធ្វើដំណើរទៅក្រៅប្រទេស។',
    },
    body: {
      en: richText(p('Choose your destination country below to see the documents you need.')),
      km: richText(p('ជ្រើសរើសប្រទេសគោលដៅខាងក្រោម ដើម្បីមើលឯកសារដែលអ្នកត្រូវការ។')),
    },
    documents: {
      en: [{ item: 'Passport valid for at least 6 months' }, { item: 'Recent photos', note: 'Size depends on the country' }],
      km: [{ item: 'លិខិតឆ្លងដែនមានសុពលភាពយ៉ាងហោចណាស់ ៦ ខែ' }, { item: 'រូបថតថ្មីៗ', note: 'ទំហំអាស្រ័យលើប្រទេស' }],
    },
    processingTime: { en: `${PH} Depends on the country`, km: `${PH} អាស្រ័យលើប្រទេស` },
    priceNote: priceTbc,
    steps: enquirySteps,
    buttonLabel: { en: 'Ask about a visa', km: 'សួរអំពីទិដ្ឋាការ' },
    messagePrefill: { en: 'I need a visa for: ', km: 'ខ្ញុំត្រូវការទិដ្ឋាការសម្រាប់៖ ' },
  },
  {
    slug: 'cambodia-visa',
    icon: 'document',
    order: 2,
    form: 'general',
    showAgencyNotice: true,
    title: { en: 'Cambodia visa assistance', km: 'ជំនួយទិដ្ឋាការកម្ពុជា' },
    summary: {
      en: 'Help for foreigners applying for or extending a Cambodian visa.',
      km: 'ជំនួយសម្រាប់ជនបរទេស ក្នុងការដាក់ពាក្យសុំ ឬបន្តទិដ្ឋាការកម្ពុជា។',
    },
    body: { en: richText(p(`${PH} Which visa types you handle.`)), km: richText(p(`${PH} ប្រភេទទិដ្ឋាការដែលយើងជួយ។`)) },
    documents: {
      en: [{ item: 'Passport' }, { item: 'Current visa', note: 'For extensions' }, { item: 'Passport photo' }],
      km: [{ item: 'លិខិតឆ្លងដែន' }, { item: 'ទិដ្ឋាការបច្ចុប្បន្ន', note: 'សម្រាប់ការបន្ត' }, { item: 'រូបថតលិខិតឆ្លងដែន' }],
    },
    processingTime: timeTbc,
    priceNote: priceTbc,
    steps: enquirySteps,
    buttonLabel: askLabel,
    messagePrefill: { en: 'I need help with a Cambodian visa.', km: 'ខ្ញុំត្រូវការជំនួយអំពីទិដ្ឋាការកម្ពុជា។' },
  },
  {
    slug: 'passport',
    icon: 'passport',
    order: 3,
    form: 'general',
    showAgencyNotice: true,
    title: { en: 'Passport: new and renewal', km: 'លិខិតឆ្លងដែន៖ ថ្មី និងបន្ត' },
    summary: {
      en: 'We help you prepare a new passport or renewal application.',
      km: 'យើងជួយអ្នករៀបចំពាក្យសុំលិខិតឆ្លងដែនថ្មី ឬបន្ត។',
    },
    body: { en: richText(p(`${PH} What the service includes.`)), km: richText(p(`${PH} អ្វីដែលសេវានេះរួមបញ្ចូល។`)) },
    documents: passportDocs,
    processingTime: timeTbc,
    priceNote: priceTbc,
    steps: enquirySteps,
    buttonLabel: askLabel,
    messagePrefill: { en: 'I need a new passport / passport renewal.', km: 'ខ្ញុំត្រូវការលិខិតឆ្លងដែនថ្មី / បន្តលិខិតឆ្លងដែន។' },
  },
  {
    slug: 'translation',
    icon: 'translation',
    order: 4,
    form: 'general',
    related: ['visa-preparation'],
    title: { en: 'Translation', km: 'ការបកប្រែ' },
    summary: {
      en: 'Document translation, mainly for visa applications.',
      km: 'ការបកប្រែឯកសារ ជាពិសេសសម្រាប់ពាក្យសុំទិដ្ឋាការ។',
    },
    body: { en: richText(p(`${PH} Languages you translate.`)), km: richText(p(`${PH} ភាសាដែលយើងបកប្រែ។`)) },
    documents: { en: [{ item: 'The original documents to translate' }], km: [{ item: 'ឯកសារដើមដែលត្រូវបកប្រែ' }] },
    processingTime: { en: `${PH} 1–3 working days`, km: `${PH} ១–៣ ថ្ងៃធ្វើការ` },
    priceNote: { en: `${PH} Priced per page.`, km: `${PH} គិតតម្លៃតាមទំព័រ។` },
    steps: enquirySteps,
    buttonLabel: askLabel,
    messagePrefill: { en: 'I need these documents translated: ', km: 'ខ្ញុំត្រូវការបកប្រែឯកសារទាំងនេះ៖ ' },
  },
  {
    slug: 'air-tickets',
    icon: 'plane',
    order: 5,
    form: 'ticket',
    title: { en: 'Air tickets', km: 'សំបុត្រយន្តហោះ' },
    summary: { en: 'Tell us your route and dates and we find you a flight.', km: 'ប្រាប់យើងពីផ្លូវ និងកាលបរិច្ឆេទ ហើយយើងរកជើងហោះហើរជូន។' },
    body: {
      en: richText(p('No online booking: we reply with options.')),
      km: richText(p('មិនមានការកក់តាមអនឡាញទេ៖ យើងឆ្លើយតបជាមួយជម្រើស។')),
    },
    documents: ticketDocs,
    processingTime: { en: `${PH} Same-day reply`, km: `${PH} ឆ្លើយតបក្នុងថ្ងៃតែមួយ` },
    priceNote: { en: 'Fares change daily; we quote when you ask.', km: 'តម្លៃប្រែប្រួលរៀងរាល់ថ្ងៃ យើងប្រាប់តម្លៃនៅពេលអ្នកសួរ។' },
    steps: ticketSteps,
    buttonLabel: { en: 'Request a ticket', km: 'ស្នើសុំសំបុត្រ' },
    messagePrefill: { en: '', km: '' },
  },
  {
    slug: 'bus-tickets',
    icon: 'bus',
    order: 6,
    form: 'ticket',
    title: { en: 'Bus tickets', km: 'សំបុត្រឡានក្រុង' },
    summary: { en: 'Domestic and cross-border bus tickets.', km: 'សំបុត្រឡានក្រុងក្នុងស្រុក និងឆ្លងព្រំដែន។' },
    body: { en: richText(p(`${PH} Routes and operators you sell.`)), km: richText(p(`${PH} ផ្លូវ និងក្រុមហ៊ុនដែលយើងលក់។`)) },
    documents: ticketDocs,
    processingTime: { en: `${PH} Same-day reply`, km: `${PH} ឆ្លើយតបក្នុងថ្ងៃតែមួយ` },
    priceNote: priceTbc,
    steps: ticketSteps,
    buttonLabel: { en: 'Request a ticket', km: 'ស្នើសុំសំបុត្រ' },
    messagePrefill: { en: '', km: '' },
  },
]

export type CountrySeed = { slug: string; order: number; name: L<string>; documents: L<Doc[]> }

const visaDocs = (extra: L<Doc[]>): L<Doc[]> => ({
  en: [{ item: 'Passport valid for at least 6 months' }, { item: 'Photos' }, { item: 'Bank statement' }, ...extra.en],
  km: [{ item: 'លិខិតឆ្លងដែនមានសុពលភាពយ៉ាងហោចណាស់ ៦ ខែ' }, { item: 'រូបថត' }, { item: 'របាយការណ៍ធនាគារ' }, ...extra.km],
})

// [placeholder] Which countries you handle, and their real checklists.
export const visaCountries: CountrySeed[] = [
  { slug: 'japan', order: 1, name: { en: 'Japan', km: 'ជប៉ុន' }, documents: visaDocs({ en: [{ item: 'Travel itinerary' }], km: [{ item: 'កាលវិភាគធ្វើដំណើរ' }] }) },
  { slug: 'south-korea', order: 2, name: { en: 'South Korea', km: 'កូរ៉េខាងត្បូង' }, documents: visaDocs({ en: [{ item: 'Employment letter' }], km: [{ item: 'លិខិតបញ្ជាក់ការងារ' }] }) },
  { slug: 'china', order: 3, name: { en: 'China', km: 'ចិន' }, documents: visaDocs({ en: [{ item: 'Hotel booking' }], km: [{ item: 'ការកក់សណ្ឋាគារ' }] }) },
  { slug: 'australia', order: 4, name: { en: 'Australia', km: 'អូស្ត្រាលី' }, documents: visaDocs({ en: [{ item: 'Proof of ties to Cambodia' }], km: [{ item: 'ភស្តុតាងនៃទំនាក់ទំនងនៅកម្ពុជា' }] }) },
]

export const pages: PageSeed[] = [
  {
    slug: 'home',
    title: { en: 'Home', km: 'ទំព័រដើម' },
    layout: [
      {
        blockType: 'hero',
        shared: { ctaLink: '/services' },
        en: { headline: 'Visas, passports and tickets, done right', subheadline: 'A Phnom Penh agency that prepares your documents and books your travel.', ctaText: 'See our services' },
        km: { headline: 'ទិដ្ឋាការ លិខិតឆ្លងដែន និងសំបុត្រ ធ្វើបានត្រឹមត្រូវ', subheadline: 'ភ្នាក់ងារនៅភ្នំពេញ ដែលរៀបចំឯកសារ និងកក់ការធ្វើដំណើររបស់អ្នក។', ctaText: 'មើលសេវាកម្មរបស់យើង' },
      },
      {
        blockType: 'servicesGrid',
        en: { heading: 'How can we help?', intro: 'Pick a service to see documents, timing and price.' },
        km: { heading: 'តើយើងអាចជួយអ្វីបាន?', intro: 'ជ្រើសរើសសេវា ដើម្បីមើលឯកសារ រយៈពេល និងតម្លៃ។' },
      },
      {
        blockType: 'cta',
        shared: { buttonLink: '/contact' },
        en: { heading: 'Not sure what you need? Ask us.', buttonText: 'Contact us' },
        km: { heading: 'មិនប្រាកដថាអ្នកត្រូវការអ្វី? សួរយើង។', buttonText: 'ទាក់ទងមកយើង' },
      },
    ],
  },
  {
    slug: 'about',
    title: { en: 'About us', km: 'អំពីយើង' },
    layout: [
      {
        blockType: 'richText',
        en: { content: richText(h2('About MRL Travel'), p(`${PH} Who you are and how long you have been helping customers.`)) },
        km: { content: richText(h2('អំពី MRL Travel'), p(`${PH} អ្នកជានរណា និងរយៈពេលដែលអ្នកបានជួយអតិថិជន។`)) },
      },
    ],
  },
  {
    slug: 'contact',
    title: { en: 'Contact', km: 'ទំនាក់ទំនង' },
    layout: [
      {
        blockType: 'contactInfo',
        shared: { showMap: true },
        en: { heading: 'Visit or message us' },
        km: { heading: 'មកលេង ឬផ្ញើសារមកយើង' },
      },
    ],
  },
]

export const navLinks = [
  { link: '/services', en: 'Services', km: 'សេវាកម្ម' },
  { link: '/visa', en: 'Visa countries', km: 'ប្រទេសទិដ្ឋាការ' },
  { link: '/about', en: 'About', km: 'អំពីយើង' },
  { link: '/contact', en: 'Contact', km: 'ទំនាក់ទំនង' },
]

export const siteSettings = {
  contactEmail: 'hello@example.com',
  contactPhone: '+855 00 000 000',
  telegramUrl: 'https://t.me/',
  mapUrl: 'https://maps.google.com/?q=Phnom+Penh',
  mapEmbedUrl: 'https://www.google.com/maps?q=Phnom+Penh&output=embed',
  socialLinks: [{ platform: 'facebook' as const, url: 'https://www.facebook.com/' }],
  address: { en: `${PH} Street, Phnom Penh, Cambodia`, km: `${PH} ផ្លូវ ភ្នំពេញ កម្ពុជា` },
  openingHours: { en: `${PH} Mon–Sat 8:00–17:00`, km: `${PH} ច័ន្ទ–សៅរ៍ ៨:០០–១៧:០០` },
  agencyNotice: {
    en: 'MRL Travel is a private agency that helps you prepare applications. We are not a government office, and the final decision is made by the issuing authority.',
    km: 'MRL Travel គឺជាភ្នាក់ងារឯកជន ដែលជួយអ្នករៀបចំពាក្យសុំ។ យើងមិនមែនជាស្ថាប័នរដ្ឋាភិបាលទេ ហើយការសម្រេចចុងក្រោយគឺធ្វើឡើងដោយអាជ្ញាធរដែលចេញឯកសារ។',
  },
}
