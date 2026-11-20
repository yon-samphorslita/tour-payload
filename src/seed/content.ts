// Seed content for dev databases. Facts come from MRL's old public website; [placeholder] still needs
// real business facts. Khmer text is a draft for review.
import { h2, p, richText } from './richText'

type L<T> = { en: T; km: T }
type Doc = { item: string; note?: string }
type Step = { title: string; description?: string }

export type BlockSeed = {
  blockType: string
  shared?: Record<string, unknown>
  // Image fields as { fieldName: filename } of files staff uploaded to Website Media (IDs differ per database).
  images?: Record<string, string>
  en: Record<string, unknown>
  km: Record<string, unknown>
}
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
    related: ['translation', 'travel-insurance'],
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
    body: {
      en: richText(p('We help foreigners in Cambodia extend their Cambodian visa. Bring your passport to our office and we handle the paperwork.')),
      km: richText(p('យើងជួយជនបរទេសនៅកម្ពុជា បន្តទិដ្ឋាការកម្ពុជារបស់ពួកគេ។ យកលិខិតឆ្លងដែនមកការិយាល័យយើង ហើយយើងរៀបចំឯកសារជូន។')),
    },
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
    body: {
      en: richText(p('We prepare and check your application for a new Cambodian passport or a renewal, and follow it up until it is ready.')),
      km: richText(p('យើងរៀបចំ និងពិនិត្យពាក្យសុំលិខិតឆ្លងដែនកម្ពុជាថ្មី ឬការបន្តរបស់អ្នក ហើយតាមដានរហូតដល់រួចរាល់។')),
    },
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
    body: {
      en: richText(p('We translate documents between Khmer and English, French, Chinese and Thai. Ask us about other languages.')),
      km: richText(p('យើងបកប្រែឯកសាររវាងភាសាខ្មែរ និងភាសាអង់គ្លេស បារាំង ចិន និងថៃ។ សូមសួរយើងអំពីភាសាផ្សេងទៀត។')),
    },
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
    summary: { en: 'Domestic and worldwide flights. Tell us your route and dates.', km: 'ជើងហោះហើរក្នុងស្រុក និងទូទាំងពិភពលោក។ ប្រាប់យើងពីផ្លូវ និងកាលបរិច្ឆេទ។' },
    body: {
      en: richText(
        p('We book domestic and worldwide air tickets and can reconfirm your existing booking. No online booking: we reply with options.'),
        p('Airlines we work with: Air Cambodia, Cambodia Airways, AirAsia Cambodia, Sky Angkor Airlines, EVA Air, Cathay Pacific, Korean Air, Asiana Airlines, Singapore Airlines, Emirates, Qatar Airways and Etihad Airways.'),
      ),
      km: richText(
        p('យើងកក់សំបុត្រយន្តហោះក្នុងស្រុក និងទូទាំងពិភពលោក ហើយអាចបញ្ជាក់ការកក់ដែលអ្នកមានរួចហើយ។ មិនមានការកក់តាមអនឡាញទេ៖ យើងឆ្លើយតបជាមួយជម្រើស។'),
        p('ក្រុមហ៊ុនអាកាសចរណ៍ដែលយើងសហការ៖ Air Cambodia, Cambodia Airways, AirAsia Cambodia, Sky Angkor Airlines, EVA Air, Cathay Pacific, Korean Air, Asiana Airlines, Singapore Airlines, Emirates, Qatar Airways និង Etihad Airways។'),
      ),
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
    body: {
      en: richText(p('Routes include Phnom Penh to Siem Reap, and cross-border buses to Ho Chi Minh City in Vietnam. Ask us for times and fares.')),
      km: richText(p('ផ្លូវរួមមាន ភ្នំពេញ ទៅសៀមរាប និងឡានក្រុងឆ្លងព្រំដែនទៅទីក្រុងហូជីមិញ ប្រទេសវៀតណាម។ សូមសួរយើងអំពីម៉ោង និងតម្លៃ។')),
    },
    documents: ticketDocs,
    processingTime: { en: `${PH} Same-day reply`, km: `${PH} ឆ្លើយតបក្នុងថ្ងៃតែមួយ` },
    priceNote: priceTbc,
    steps: ticketSteps,
    buttonLabel: { en: 'Request a ticket', km: 'ស្នើសុំសំបុត្រ' },
    messagePrefill: { en: '', km: '' },
  },
  {
    // Plans and rates from Forte Insurance's public travel pages, read on 2026-11-20.
    slug: 'travel-insurance',
    icon: 'document',
    order: 7,
    form: 'general',
    related: ['visa-preparation', 'air-tickets'],
    title: { en: 'Travel insurance', km: 'ធានារ៉ាប់រងការធ្វើដំណើរ' },
    summary: {
      en: 'Travel insurance from Forte Insurance, for trips abroad and for visitors to Cambodia.',
      km: 'ធានារ៉ាប់រងការធ្វើដំណើរពី Forte Insurance សម្រាប់ការធ្វើដំណើរទៅក្រៅប្រទេស និងសម្រាប់ភ្ញៀវមកកម្ពុជា។',
    },
    body: {
      en: richText(
        p('We sell Forte Insurance travel plans. Traveller\'s Insurance covers Cambodian residents travelling abroad, with Standard and Super plans for ASEAN, Asia Pacific and Schengen, Worldwide, and USA and Canada. Inbound Traveller\'s Insurance covers visitors to Cambodia.'),
        p('Plans include overseas medical expenses of US$50,000 (Standard) or US$100,000 (Super), 24-hour emergency assistance, trip cancellation, baggage and flight delay cover.'),
        p('Schengen visas ask for at least €30,000 of medical cover. We check that your certificate meets your embassy\'s rules before you apply.'),
      ),
      km: richText(
        p('យើងលក់គម្រោងធានារ៉ាប់រងការធ្វើដំណើររបស់ Forte Insurance។ Traveller\'s Insurance ធានាអ្នករស់នៅកម្ពុជាដែលធ្វើដំណើរទៅក្រៅប្រទេស ដោយមានគម្រោង Standard និង Super សម្រាប់អាស៊ាន អាស៊ីប៉ាស៊ីហ្វិក និង Schengen ទូទាំងពិភពលោក និងអាមេរិក និងកាណាដា។ Inbound Traveller\'s Insurance ធានាភ្ញៀវដែលមកកម្ពុជា។'),
        p('គម្រោងរួមមានការចំណាយវេជ្ជសាស្ត្រនៅបរទេស ៥០,០០០ ដុល្លារ (Standard) ឬ ១០០,០០០ ដុល្លារ (Super) ជំនួយបន្ទាន់ ២៤ ម៉ោង ការលុបចោលការធ្វើដំណើរ ឥវ៉ាន់ និងការពន្យារពេលជើងហោះហើរ។'),
        p('ទិដ្ឋាការ Schengen តម្រូវឱ្យមានការធានាវេជ្ជសាស្ត្រយ៉ាងហោចណាស់ €៣០,០០០។ យើងពិនិត្យថាវិញ្ញាបនបត្ររបស់អ្នកស្របតាមលក្ខខណ្ឌស្ថានទូត មុនពេលអ្នកដាក់ពាក្យ។'),
      ),
    },
    documents: {
      en: [{ item: 'Passport' }, { item: 'Destination and travel dates' }, { item: 'Date of birth of each traveller' }],
      km: [{ item: 'លិខិតឆ្លងដែន' }, { item: 'ទិសដៅ និងកាលបរិច្ឆេទធ្វើដំណើរ' }, { item: 'ថ្ងៃខែឆ្នាំកំណើតរបស់អ្នកធ្វើដំណើរម្នាក់ៗ' }],
    },
    processingTime: { en: 'Same day on working days', km: 'ក្នុងថ្ងៃតែមួយ នៅថ្ងៃធ្វើការ' },
    priceNote: {
      en: 'From US$2 per day for Asia Pacific and Schengen (minimum US$21). Worldwide and USA/Canada cost more. Ask us for an exact quote.',
      km: 'ចាប់ពី ២ ដុល្លារក្នុងមួយថ្ងៃ សម្រាប់អាស៊ីប៉ាស៊ីហ្វិក និង Schengen (អប្បបរមា ២១ ដុល្លារ)។ ទូទាំងពិភពលោក និងអាមេរិក/កាណាដា មានតម្លៃខ្ពស់ជាង។ សូមសួរយើងសម្រាប់តម្លៃជាក់លាក់។',
    },
    steps: {
      en: [
        { title: 'Tell us your trip', description: 'Destination, dates and travellers.' },
        { title: 'Choose a plan', description: 'We compare Standard and Super with you.' },
        { title: 'Get your certificate', description: 'Ready to attach to your visa application.' },
      ],
      km: [
        { title: 'ប្រាប់យើងពីដំណើររបស់អ្នក', description: 'ទិសដៅ កាលបរិច្ឆេទ និងអ្នកធ្វើដំណើរ។' },
        { title: 'ជ្រើសរើសគម្រោង', description: 'យើងប្រៀបធៀប Standard និង Super ជាមួយអ្នក។' },
        { title: 'ទទួលវិញ្ញាបនបត្រ', description: 'រួចរាល់សម្រាប់ភ្ជាប់ជាមួយពាក្យសុំទិដ្ឋាការ។' },
      ],
    },
    buttonLabel: { en: 'Get an insurance quote', km: 'សុំតម្លៃធានារ៉ាប់រង' },
    messagePrefill: { en: 'I need travel insurance for: ', km: 'ខ្ញុំត្រូវការធានារ៉ាប់រងការធ្វើដំណើរសម្រាប់៖ ' },
  },
]

export type CountrySeed = {
  slug: string
  order: number
  name: L<string>
  summary: L<string>
  documents: L<Doc[]>
  processingTime: L<string>
  priceNote: L<string>
  notes: L<ReturnType<typeof richText>>
}

// Tourist / family-visit visas for Cambodian passport holders, from embassy and visa-centre
// pages read on 2026-11-20. Fees and rules change often, so every page tells visitors to confirm.
const confirmFirst: L<string> = {
  en: 'Rules and fees change often. We confirm the current requirements before you apply.',
  km: 'លក្ខខណ្ឌ និងថ្លៃសេវាផ្លាស់ប្តូរញឹកញាប់។ យើងបញ្ជាក់លក្ខខណ្ឌបច្ចុប្បន្នមុនពេលអ្នកដាក់ពាក្យ។',
}

export const visaCountries: CountrySeed[] = [
  {
    slug: 'france',
    order: 1,
    name: { en: 'France', km: 'បារាំង' },
    summary: {
      en: 'Short-stay Schengen visa for tourism or family visits, up to 90 days.',
      km: 'ទិដ្ឋាការស្នាក់នៅរយៈពេលខ្លី Schengen សម្រាប់ទេសចរណ៍ ឬលេងសាច់ញាតិ រហូតដល់ ៩០ ថ្ងៃ។',
    },
    documents: {
      en: [
        { item: 'France-Visas online application form', note: 'Printed and signed' },
        { item: 'Passport issued within the last 10 years', note: 'Valid 3+ months after you leave, with 2 blank pages' },
        { item: '2 recent photos, 35 × 45 mm, white background' },
        { item: 'Travel medical insurance', note: 'At least €30,000, valid in all Schengen countries. We can arrange it.' },
        { item: 'Return flight reservation' },
        { item: 'Hotel booking or invitation from your host' },
        { item: 'Bank statements for the last 3 months' },
        { item: 'Employment letter and approved leave', note: 'Or school letter for students' },
        { item: 'Family book and birth certificate' },
      ],
      km: [
        { item: 'ទម្រង់ពាក្យសុំតាមអនឡាញ France-Visas', note: 'បោះពុម្ព និងចុះហត្ថលេខា' },
        { item: 'លិខិតឆ្លងដែនចេញក្នុងរយៈពេល ១០ ឆ្នាំចុងក្រោយ', note: 'នៅមានសុពលភាព ៣ ខែក្រោយពេលចាកចេញ និងមានទំព័រទំនេរ ២' },
        { item: 'រូបថតថ្មីៗ ២ សន្លឹក ទំហំ ៣៥ × ៤៥ មម ផ្ទៃពណ៌ស' },
        { item: 'ធានារ៉ាប់រងសុខភាពពេលធ្វើដំណើរ', note: 'យ៉ាងហោចណាស់ €៣០,០០០ ប្រើបានគ្រប់ប្រទេស Schengen។ យើងអាចរៀបចំជូនបាន។' },
        { item: 'ការកក់សំបុត្រយន្តហោះទៅមក' },
        { item: 'ការកក់សណ្ឋាគារ ឬលិខិតអញ្ជើញពីម្ចាស់ផ្ទះ' },
        { item: 'របាយការណ៍ធនាគារ ៣ ខែចុងក្រោយ' },
        { item: 'លិខិតបញ្ជាក់ការងារ និងការអនុញ្ញាតឈប់សម្រាក', note: 'ឬលិខិតពីសាលាសម្រាប់សិស្ស' },
        { item: 'សៀវភៅគ្រួសារ និងសំបុត្រកំណើត' },
      ],
    },
    processingTime: { en: 'Usually about 15 days. Apply up to 6 months before you travel.', km: 'ជាធម្មតាប្រហែល ១៥ ថ្ងៃ។ អាចដាក់ពាក្យមុនការធ្វើដំណើររហូតដល់ ៦ ខែ។' },
    priceNote: {
      en: 'Embassy fee €90 per adult (paid in USD), €45 for children aged 6–11, plus the TLScontact service fee and our fee.',
      km: 'ថ្លៃស្ថានទូត €៩០ សម្រាប់មនុស្សពេញវ័យ (បង់ជាដុល្លារ) €៤៥ សម្រាប់កុមារអាយុ ៦–១១ ឆ្នាំ បូកថ្លៃសេវា TLScontact និងថ្លៃសេវារបស់យើង។',
    },
    notes: {
      en: richText(
        p('Applications for France are filed online on France-Visas, then handed in at the TLScontact visa centre in Phnom Penh, where your fingerprints and photo are taken. The French Embassy makes the decision.'),
        p('Only use the official visa centre. People outside the centre have posed as embassy staff to scam applicants.'),
        p(confirmFirst.en),
      ),
      km: richText(
        p('ពាក្យសុំទៅប្រទេសបារាំងត្រូវបំពេញតាមអនឡាញនៅ France-Visas បន្ទាប់មកប្រគល់នៅមជ្ឈមណ្ឌលទិដ្ឋាការ TLScontact ក្នុងភ្នំពេញ ដែលគេនឹងស្កេនស្នាមម្រាមដៃ និងថតរូបអ្នក។ ស្ថានទូតបារាំងជាអ្នកសម្រេច។'),
        p('សូមប្រើតែមជ្ឈមណ្ឌលទិដ្ឋាការផ្លូវការប៉ុណ្ណោះ។ មានមនុស្សនៅខាងក្រៅមជ្ឈមណ្ឌលក្លែងខ្លួនជាបុគ្គលិកស្ថានទូត ដើម្បីបោកប្រាស់អ្នកដាក់ពាក្យ។'),
        p(confirmFirst.km),
      ),
    },
  },
  {
    slug: 'germany',
    order: 2,
    name: { en: 'Germany', km: 'អាល្លឺម៉ង់' },
    summary: {
      en: 'Short-stay Schengen visa for tourism or family visits, up to 90 days.',
      km: 'ទិដ្ឋាការស្នាក់នៅរយៈពេលខ្លី Schengen សម្រាប់ទេសចរណ៍ ឬលេងសាច់ញាតិ រហូតដល់ ៩០ ថ្ងៃ។',
    },
    documents: {
      en: [
        { item: 'Schengen VIDEX application form', note: 'Completed and signed' },
        { item: '2 photos, 35 × 45 mm, white background', note: 'No older than 6 months' },
        { item: 'Signed declaration under Section 54 of the Residence Act' },
        { item: 'Passport issued within the last 10 years', note: 'Valid 3+ months after you leave, with 2 blank pages; copy of the data page and past visas' },
        { item: 'Return flight reservation in your name' },
        { item: 'Travel medical insurance', note: 'At least €30,000, valid in all Schengen countries. We can arrange it.' },
        { item: 'Travel plan with hotel bookings', note: 'For tourist visits' },
        { item: 'Invitation letter from your host', note: 'For family visits; add a formal guarantee if your host gives one' },
        { item: 'Proof of income and ties', note: 'e.g. land title, business papers, bank statements for the last 6 months' },
        { item: 'Family record documents', note: 'e.g. birth or marriage certificate' },
        { item: 'Leave letter from your employer or school' },
      ],
      km: [
        { item: 'ទម្រង់ពាក្យសុំ Schengen VIDEX', note: 'បំពេញ និងចុះហត្ថលេខា' },
        { item: 'រូបថត ២ សន្លឹក ទំហំ ៣៥ × ៤៥ មម ផ្ទៃពណ៌ស', note: 'ថតមិនលើសពី ៦ ខែ' },
        { item: 'សេចក្តីប្រកាសចុះហត្ថលេខាតាមមាត្រា ៥៤ នៃច្បាប់ស្នាក់នៅ' },
        { item: 'លិខិតឆ្លងដែនចេញក្នុងរយៈពេល ១០ ឆ្នាំចុងក្រោយ', note: 'នៅមានសុពលភាព ៣ ខែក្រោយពេលចាកចេញ មានទំព័រទំនេរ ២ ថតចម្លងទំព័រព័ត៌មាន និងទិដ្ឋាការចាស់' },
        { item: 'ការកក់សំបុត្រយន្តហោះទៅមកក្នុងឈ្មោះអ្នក' },
        { item: 'ធានារ៉ាប់រងសុខភាពពេលធ្វើដំណើរ', note: 'យ៉ាងហោចណាស់ €៣០,០០០ ប្រើបានគ្រប់ប្រទេស Schengen។ យើងអាចរៀបចំជូនបាន។' },
        { item: 'ផែនការធ្វើដំណើរ និងការកក់សណ្ឋាគារ', note: 'សម្រាប់ទេសចរណ៍' },
        { item: 'លិខិតអញ្ជើញពីម្ចាស់ផ្ទះ', note: 'សម្រាប់លេងសាច់ញាតិ បន្ថែមលិខិតធានាផ្លូវការ ប្រសិនបើម្ចាស់ផ្ទះផ្តល់ឱ្យ' },
        { item: 'ភស្តុតាងចំណូល និងទំនាក់ទំនងនៅកម្ពុជា', note: 'ឧ. ប្លង់ដី ឯកសារអាជីវកម្ម របាយការណ៍ធនាគារ ៦ ខែចុងក្រោយ' },
        { item: 'ឯកសារគ្រួសារ', note: 'ឧ. សំបុត្រកំណើត ឬសំបុត្រអាពាហ៍ពិពាហ៍' },
        { item: 'លិខិតអនុញ្ញាតឈប់សម្រាកពីនិយោជក ឬសាលា' },
      ],
    },
    processingTime: {
      en: 'Usually within 15 days, sometimes up to 45 working days. Apply 15 days to 6 months before you travel.',
      km: 'ជាធម្មតាក្នុងរយៈពេល ១៥ ថ្ងៃ ពេលខ្លះរហូតដល់ ៤៥ ថ្ងៃធ្វើការ។ ដាក់ពាក្យពី ១៥ ថ្ងៃ ដល់ ៦ ខែ មុនការធ្វើដំណើរ។',
    },
    priceNote: {
      en: 'Embassy fee €90 per adult (paid in USD), €45 for children aged 6–11, plus the VFS Global service fee and our fee.',
      km: 'ថ្លៃស្ថានទូត €៩០ សម្រាប់មនុស្សពេញវ័យ (បង់ជាដុល្លារ) €៤៥ សម្រាប់កុមារអាយុ ៦–១១ ឆ្នាំ បូកថ្លៃសេវា VFS Global និងថ្លៃសេវារបស់យើង។',
    },
    notes: {
      en: richText(
        p('Applications for Germany are handed in only at the VFS Global visa centre in Phnom Penh (Morgan Tower, Koh Pich). The German Embassy makes the decision. Incomplete applications are not accepted.'),
        p('The German Embassy in Phnom Penh also handles visas for Austria, Finland, Luxembourg and the Netherlands.'),
        p(confirmFirst.en),
      ),
      km: richText(
        p('ពាក្យសុំទៅប្រទេសអាល្លឺម៉ង់ត្រូវប្រគល់តែនៅមជ្ឈមណ្ឌលទិដ្ឋាការ VFS Global ក្នុងភ្នំពេញ (Morgan Tower កោះពេជ្រ) ប៉ុណ្ណោះ។ ស្ថានទូតអាល្លឺម៉ង់ជាអ្នកសម្រេច។ ពាក្យសុំដែលមិនពេញលេញនឹងមិនត្រូវបានទទួលទេ។'),
        p('ស្ថានទូតអាល្លឺម៉ង់នៅភ្នំពេញ ក៏ទទួលពាក្យសុំទិដ្ឋាការសម្រាប់ប្រទេសអូទ្រីស ហ្វាំងឡង់ លុចសំបួ និងហូឡង់ផងដែរ។'),
        p(confirmFirst.km),
      ),
    },
  },
  {
    slug: 'usa',
    order: 3,
    name: { en: 'United States', km: 'សហរដ្ឋអាមេរិក' },
    summary: {
      en: 'B1/B2 visitor visa for tourism, family visits or business meetings. Every applicant has an interview at the US Embassy in Phnom Penh.',
      km: 'ទិដ្ឋាការភ្ញៀវ B1/B2 សម្រាប់ទេសចរណ៍ លេងសាច់ញាតិ ឬប្រជុំការងារ។ អ្នកដាក់ពាក្យគ្រប់រូបត្រូវសម្ភាសនៅស្ថានទូតអាមេរិកក្នុងភ្នំពេញ។',
    },
    documents: {
      en: [
        { item: 'Passport valid at least 6 months beyond your stay' },
        { item: 'DS-160 confirmation page', note: 'We fill in the online form with you' },
        { item: 'Visa fee payment receipt' },
        { item: 'One photo, 5 × 5 cm, white background' },
        { item: 'Employment letter or business documents' },
        { item: 'Bank statements and property papers' },
        { item: 'Family book and birth certificate' },
        { item: 'Invitation letter from your host', note: 'For family visits' },
      ],
      km: [
        { item: 'លិខិតឆ្លងដែនមានសុពលភាពយ៉ាងហោចណាស់ ៦ ខែ ក្រោយការស្នាក់នៅ' },
        { item: 'ទំព័របញ្ជាក់ DS-160', note: 'យើងជួយបំពេញទម្រង់អនឡាញជាមួយអ្នក' },
        { item: 'បង្កាន់ដៃបង់ថ្លៃទិដ្ឋាការ' },
        { item: 'រូបថត ១ សន្លឹក ទំហំ ៥ × ៥ សង់ទីម៉ែត្រ ផ្ទៃពណ៌ស' },
        { item: 'លិខិតបញ្ជាក់ការងារ ឬឯកសារអាជីវកម្ម' },
        { item: 'របាយការណ៍ធនាគារ និងឯកសារទ្រព្យសម្បត្តិ' },
        { item: 'សៀវភៅគ្រួសារ និងសំបុត្រកំណើត' },
        { item: 'លិខិតអញ្ជើញពីម្ចាស់ផ្ទះ', note: 'សម្រាប់លេងសាច់ញាតិ' },
      ],
    },
    processingTime: {
      en: 'Interview dates can be weeks or months away. Apply as early as you can.',
      km: 'កាលបរិច្ឆេទសម្ភាសអាចឆ្ងាយច្រើនសប្តាហ៍ ឬច្រើនខែ។ សូមដាក់ពាក្យឱ្យបានឆាប់តាមដែលអាចធ្វើបាន។',
    },
    priceNote: {
      en: 'US government fee US$185, not refunded if refused, plus our fee. A new US$250 visa integrity fee has been announced; ask us whether it applies yet.',
      km: 'ថ្លៃរដ្ឋាភិបាលអាមេរិក ១៨៥ ដុល្លារ មិនបង្វិលវិញទេ ប្រសិនបើត្រូវបដិសេធ បូកថ្លៃសេវារបស់យើង។ ថ្លៃ visa integrity ថ្មី ២៥០ ដុល្លារ ត្រូវបានប្រកាស សូមសួរយើងថាតើវាត្រូវអនុវត្តហើយឬនៅ។',
    },
    notes: {
      en: richText(
        p('You fill in the DS-160 online, pay the fee, book an interview and attend it in person. The consular officer decides at the interview whether you have strong ties to Cambodia, such as work, family and property.'),
        p(confirmFirst.en),
      ),
      km: richText(
        p('អ្នកបំពេញ DS-160 តាមអនឡាញ បង់ថ្លៃ កក់ពេលសម្ភាស ហើយទៅសម្ភាសដោយផ្ទាល់។ មន្ត្រីកុងស៊ុលសម្រេចនៅពេលសម្ភាស ថាតើអ្នកមានទំនាក់ទំនងរឹងមាំនៅកម្ពុជាឬអត់ ដូចជាការងារ គ្រួសារ និងទ្រព្យសម្បត្តិ។'),
        p(confirmFirst.km),
      ),
    },
  },
  {
    slug: 'china',
    order: 4,
    name: { en: 'China', km: 'ចិន' },
    summary: {
      en: 'L tourist visa, handed in at the Chinese Visa Application Service Center in Phnom Penh.',
      km: 'ទិដ្ឋាការទេសចរណ៍ L ប្រគល់នៅមជ្ឈមណ្ឌលសេវាដាក់ពាក្យសុំទិដ្ឋាការចិន ក្នុងភ្នំពេញ។',
    },
    documents: {
      en: [
        { item: 'Passport valid at least 6 months, with 2 blank visa pages', note: 'Plus a copy of the data page' },
        { item: 'Online visa application form', note: 'Printed and signed' },
        { item: 'Recent colour photo, 48 × 33 mm, white background' },
        { item: 'Return flight booking and hotel reservation', note: 'Or an invitation letter from someone in China, with a copy of their ID' },
        { item: 'Copy of your last Chinese visa', note: 'If you had one' },
        { item: 'Financial guarantee', note: 'Required for women aged 18–30' },
      ],
      km: [
        { item: 'លិខិតឆ្លងដែនមានសុពលភាពយ៉ាងហោចណាស់ ៦ ខែ និងមានទំព័រទិដ្ឋាការទំនេរ ២', note: 'បូកថតចម្លងទំព័រព័ត៌មាន' },
        { item: 'ទម្រង់ពាក្យសុំទិដ្ឋាការតាមអនឡាញ', note: 'បោះពុម្ព និងចុះហត្ថលេខា' },
        { item: 'រូបថតពណ៌ថ្មីៗ ទំហំ ៤៨ × ៣៣ មម ផ្ទៃពណ៌ស' },
        { item: 'ការកក់សំបុត្រយន្តហោះទៅមក និងសណ្ឋាគារ', note: 'ឬលិខិតអញ្ជើញពីអ្នកនៅប្រទេសចិន ជាមួយថតចម្លងអត្តសញ្ញាណប័ណ្ណរបស់គាត់' },
        { item: 'ថតចម្លងទិដ្ឋាការចិនចុងក្រោយ', note: 'ប្រសិនបើធ្លាប់មាន' },
        { item: 'ការធានាហិរញ្ញវត្ថុ', note: 'តម្រូវសម្រាប់ស្ត្រីអាយុ ១៨–៣០ ឆ្នាំ' },
      ],
    },
    processingTime: {
      en: 'Ready on the 4th working day, or the 3rd working day with express service.',
      km: 'រួចរាល់នៅថ្ងៃធ្វើការទី ៤ ឬថ្ងៃធ្វើការទី ៣ ជាមួយសេវារហ័ស។',
    },
    priceNote: {
      en: 'Single entry US$50 at the visa centre (visa fee plus centre service fee, reduced fee until 31 December 2026), plus our fee.',
      km: 'ចូលម្តង ៥០ ដុល្លារ នៅមជ្ឈមណ្ឌលទិដ្ឋាការ (ថ្លៃទិដ្ឋាការ បូកថ្លៃសេវាមជ្ឈមណ្ឌល តម្លៃបញ្ចុះរហូតដល់ ៣១ ធ្នូ ២០២៦) បូកថ្លៃសេវារបស់យើង។',
    },
    notes: {
      en: richText(
        p('The form and documents are uploaded online first. After the online review, you bring your passport to the visa centre and pay there. Fingerprints are not needed for stays of up to 180 days until 31 December 2026.'),
        p(confirmFirst.en),
      ),
      km: richText(
        p('ទម្រង់ និងឯកសារត្រូវបញ្ចូលតាមអនឡាញជាមុនសិន។ បន្ទាប់ពីការពិនិត្យតាមអនឡាញ អ្នកយកលិខិតឆ្លងដែនទៅមជ្ឈមណ្ឌលទិដ្ឋាការ ហើយបង់ប្រាក់នៅទីនោះ។ មិនចាំបាច់ផ្តិតម្រាមដៃសម្រាប់ការស្នាក់នៅរហូតដល់ ១៨០ ថ្ងៃ រហូតដល់ថ្ងៃទី ៣១ ធ្នូ ២០២៦។'),
        p(confirmFirst.km),
      ),
    },
  },
  {
    slug: 'hong-kong',
    order: 5,
    name: { en: 'Hong Kong', km: 'ហុងកុង' },
    summary: {
      en: 'Cambodian passport holders need a visit visa for Hong Kong. It is issued by the Hong Kong Immigration Department.',
      km: 'អ្នកកាន់លិខិតឆ្លងដែនកម្ពុជាត្រូវការទិដ្ឋាការទេសចរណ៍សម្រាប់ហុងកុង។ វាចេញដោយនាយកដ្ឋានអន្តោប្រវេសន៍ហុងកុង។',
    },
    documents: {
      en: [
        { item: 'Passport valid at least 6 months' },
        { item: 'Visit visa application form' },
        { item: 'Recent passport photo' },
        { item: 'Return flight booking and hotel reservation' },
        { item: 'Bank statements', note: 'To show you can pay for your stay' },
        { item: 'Invitation letter from your host', note: 'For family visits' },
      ],
      km: [
        { item: 'លិខិតឆ្លងដែនមានសុពលភាពយ៉ាងហោចណាស់ ៦ ខែ' },
        { item: 'ទម្រង់ពាក្យសុំទិដ្ឋាការទេសចរណ៍' },
        { item: 'រូបថតលិខិតឆ្លងដែនថ្មីៗ' },
        { item: 'ការកក់សំបុត្រយន្តហោះទៅមក និងសណ្ឋាគារ' },
        { item: 'របាយការណ៍ធនាគារ', note: 'ដើម្បីបង្ហាញថាអ្នកអាចចំណាយលើការស្នាក់នៅ' },
        { item: 'លិខិតអញ្ជើញពីម្ចាស់ផ្ទះ', note: 'សម្រាប់លេងសាច់ញាតិ' },
      ],
    },
    processingTime: { en: `${PH} Allow about 4 weeks.`, km: `${PH} សូមទុកពេលប្រហែល ៤ សប្តាហ៍។` },
    priceNote: { en: `${PH} Ask us for the current fee.`, km: `${PH} សូមសួរយើងអំពីថ្លៃបច្ចុប្បន្ន។` },
    notes: {
      en: richText(
        p('Hong Kong has no embassy in Cambodia. The visa is applied for with the Hong Kong Immigration Department, through a Chinese diplomatic mission or directly by post or through a sponsor in Hong Kong. A Hong Kong visa does not let you enter mainland China.'),
        p(confirmFirst.en),
      ),
      km: richText(
        p('ហុងកុងមិនមានស្ថានទូតនៅកម្ពុជាទេ។ ទិដ្ឋាការត្រូវដាក់ពាក្យជាមួយនាយកដ្ឋានអន្តោប្រវេសន៍ហុងកុង តាមរយៈបេសកកម្មការទូតចិន ឬដោយផ្ទាល់តាមប្រៃសណីយ៍ ឬតាមរយៈអ្នកធានានៅហុងកុង។ ទិដ្ឋាការហុងកុងមិនអនុញ្ញាតឱ្យអ្នកចូលប្រទេសចិនដីគោកទេ។'),
        p(confirmFirst.km),
      ),
    },
  },
  {
    slug: 'japan',
    order: 6,
    name: { en: 'Japan', km: 'ជប៉ុន' },
    summary: {
      en: 'Single-entry tourist visa for stays of up to 90 days. Tourist visas can also be applied for online.',
      km: 'ទិដ្ឋាការទេសចរណ៍ចូលម្តង សម្រាប់ការស្នាក់នៅរហូតដល់ ៩០ ថ្ងៃ។ ទិដ្ឋាការទេសចរណ៍ក៏អាចដាក់ពាក្យតាមអនឡាញបានដែរ។',
    },
    documents: {
      en: [
        { item: 'Passport with at least 2 blank pages' },
        { item: 'A4 copy of the passport data page' },
        { item: 'Signed visa application form' },
        { item: 'One photo, 4.5 × 3.5 cm, white background', note: 'Glued to the form' },
        { item: 'Original bank statement or bankbook', note: 'To show you can pay for the trip' },
        { item: 'Letter of consent from a parent', note: 'For children travelling without one' },
      ],
      km: [
        { item: 'លិខិតឆ្លងដែនមានទំព័រទំនេរយ៉ាងហោចណាស់ ២' },
        { item: 'ថតចម្លងទំព័រព័ត៌មានលិខិតឆ្លងដែន ក្រដាស A4' },
        { item: 'ទម្រង់ពាក្យសុំទិដ្ឋាការដែលបានចុះហត្ថលេខា' },
        { item: 'រូបថត ១ សន្លឹក ទំហំ ៤.៥ × ៣.៥ សង់ទីម៉ែត្រ ផ្ទៃពណ៌ស', note: 'បិទលើទម្រង់' },
        { item: 'របាយការណ៍ធនាគារដើម ឬសៀវភៅធនាគារ', note: 'ដើម្បីបង្ហាញថាអ្នកអាចចំណាយលើការធ្វើដំណើរ' },
        { item: 'លិខិតយល់ព្រមពីឪពុកម្តាយ', note: 'សម្រាប់កុមារដែលធ្វើដំណើរដោយគ្មានឪពុកម្តាយ' },
      ],
    },
    processingTime: {
      en: 'At least 5 working days after you apply; sometimes more than a month.',
      km: 'យ៉ាងហោចណាស់ ៥ ថ្ងៃធ្វើការ ក្រោយពេលដាក់ពាក្យ ពេលខ្លះលើសពីមួយខែ។',
    },
    priceNote: {
      en: `${PH} Embassy fees were raised on 1 July 2026; ask us for the current fee.`,
      km: `${PH} ថ្លៃស្ថានទូតត្រូវបានដំឡើងនៅថ្ងៃទី ១ កក្កដា ២០២៦ សូមសួរយើងអំពីថ្លៃបច្ចុប្បន្ន។`,
    },
    notes: {
      en: richText(
        p('Tourist visas can be applied for online. Business or family-visit visas are applied for at the Embassy of Japan in Phnom Penh or its consular office in Siem Reap. Incomplete applications are not accepted.'),
        p(confirmFirst.en),
      ),
      km: richText(
        p('ទិដ្ឋាការទេសចរណ៍អាចដាក់ពាក្យតាមអនឡាញបាន។ ទិដ្ឋាការអាជីវកម្ម ឬលេងសាច់ញាតិ ត្រូវដាក់ពាក្យនៅស្ថានទូតជប៉ុនក្នុងភ្នំពេញ ឬការិយាល័យកុងស៊ុលនៅសៀមរាប។ ពាក្យសុំដែលមិនពេញលេញនឹងមិនត្រូវបានទទួលទេ។'),
        p(confirmFirst.km),
      ),
    },
  },
  {
    slug: 'south-korea',
    order: 7,
    name: { en: 'South Korea', km: 'កូរ៉េខាងត្បូង' },
    summary: {
      en: 'Short-term tourist visa (C-3-9). Cambodians cannot use K-ETA and must apply for a visa at the Korean Embassy.',
      km: 'ទិដ្ឋាការទេសចរណ៍រយៈពេលខ្លី (C-3-9)។ ជនជាតិកម្ពុជាមិនអាចប្រើ K-ETA បានទេ ហើយត្រូវដាក់ពាក្យសុំទិដ្ឋាការនៅស្ថានទូតកូរ៉េ។',
    },
    documents: {
      en: [
        { item: 'Visa application form' },
        { item: 'One passport photo' },
        { item: 'Passport valid at least 6 months' },
        { item: 'Visa fee payment receipt' },
        { item: 'Bank statements', note: 'The embassy may ask for more documents' },
        { item: 'Employment certificate or school letter', note: 'With company stamp and signature' },
        { item: 'Flight and hotel bookings, and a travel plan' },
      ],
      km: [
        { item: 'ទម្រង់ពាក្យសុំទិដ្ឋាការ' },
        { item: 'រូបថតលិខិតឆ្លងដែន ១ សន្លឹក' },
        { item: 'លិខិតឆ្លងដែនមានសុពលភាពយ៉ាងហោចណាស់ ៦ ខែ' },
        { item: 'បង្កាន់ដៃបង់ថ្លៃទិដ្ឋាការ' },
        { item: 'របាយការណ៍ធនាគារ', note: 'ស្ថានទូតអាចស្នើសុំឯកសារបន្ថែម' },
        { item: 'លិខិតបញ្ជាក់ការងារ ឬលិខិតពីសាលា', note: 'មានត្រា និងហត្ថលេខាក្រុមហ៊ុន' },
        { item: 'ការកក់សំបុត្រយន្តហោះ សណ្ឋាគារ និងផែនការធ្វើដំណើរ' },
      ],
    },
    processingTime: {
      en: `${PH} Often 2–3 weeks; longer if an interview or extra documents are needed.`,
      km: `${PH} ជាធម្មតា ២–៣ សប្តាហ៍ យូរជាងនេះប្រសិនបើត្រូវសម្ភាស ឬត្រូវការឯកសារបន្ថែម។`,
    },
    priceNote: { en: `${PH} Ask us for the current embassy fee.`, km: `${PH} សូមសួរយើងអំពីថ្លៃស្ថានទូតបច្ចុប្បន្ន។` },
    notes: {
      en: richText(
        p('Apply in person at the Korean Embassy in Phnom Penh, 8:00–11:30 on working days, no appointment needed. People living in Siem Reap, Banteay Meanchey, Battambang, Oddar Meanchey, Preah Vihear or Pailin apply at the Korean Consulate in Siem Reap. Check the result on the Korea Visa Portal.'),
        p('False invitations or documents can lead to fines and an entry ban.'),
        p(confirmFirst.en),
      ),
      km: richText(
        p('ដាក់ពាក្យដោយផ្ទាល់នៅស្ថានទូតកូរ៉េក្នុងភ្នំពេញ ម៉ោង ៨:០០–១១:៣០ ថ្ងៃធ្វើការ មិនចាំបាច់ណាត់ជួប។ អ្នករស់នៅខេត្តសៀមរាប បន្ទាយមានជ័យ បាត់ដំបង ឧត្តរមានជ័យ ព្រះវិហារ ឬប៉ៃលិន ដាក់ពាក្យនៅកុងស៊ុលកូរ៉េនៅសៀមរាប។ ពិនិត្យលទ្ធផលនៅលើ Korea Visa Portal។'),
        p('លិខិតអញ្ជើញ ឬឯកសារក្លែងក្លាយ អាចនាំឱ្យមានការពិន័យ និងហាមឃាត់មិនឱ្យចូលប្រទេស។'),
        p(confirmFirst.km),
      ),
    },
  },
  {
    slug: 'australia',
    order: 8,
    name: { en: 'Australia', km: 'អូស្ត្រាលី' },
    summary: {
      en: 'Visitor visa (subclass 600) for tourism or family visits, for stays of up to 3, 6 or 12 months.',
      km: 'ទិដ្ឋាការភ្ញៀវ (subclass 600) សម្រាប់ទេសចរណ៍ ឬលេងសាច់ញាតិ សម្រាប់ការស្នាក់នៅរហូតដល់ ៣ ៦ ឬ ១២ ខែ។',
    },
    documents: {
      en: [
        { item: 'Passport data page and national ID card' },
        { item: 'Bank statements', note: 'To show you can pay for your stay' },
        { item: 'Employment letter with approved leave, or business papers' },
        { item: 'Proof of ties to Cambodia', note: 'e.g. family book, property papers' },
        { item: 'Travel plan' },
        { item: 'Invitation letter from your host', note: 'For family visits' },
        { item: 'Consent from both parents', note: 'For applicants under 18' },
      ],
      km: [
        { item: 'ទំព័រព័ត៌មានលិខិតឆ្លងដែន និងអត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ' },
        { item: 'របាយការណ៍ធនាគារ', note: 'ដើម្បីបង្ហាញថាអ្នកអាចចំណាយលើការស្នាក់នៅ' },
        { item: 'លិខិតបញ្ជាក់ការងារ និងការអនុញ្ញាតឈប់សម្រាក ឬឯកសារអាជីវកម្ម' },
        { item: 'ភស្តុតាងនៃទំនាក់ទំនងនៅកម្ពុជា', note: 'ឧ. សៀវភៅគ្រួសារ ឯកសារទ្រព្យសម្បត្តិ' },
        { item: 'ផែនការធ្វើដំណើរ' },
        { item: 'លិខិតអញ្ជើញពីម្ចាស់ផ្ទះ', note: 'សម្រាប់លេងសាច់ញាតិ' },
        { item: 'ការយល់ព្រមពីឪពុកម្តាយទាំងពីរ', note: 'សម្រាប់អ្នកដាក់ពាក្យអាយុក្រោម ១៨ ឆ្នាំ' },
      ],
    },
    processingTime: {
      en: 'Most tourist applications are decided within about 5 weeks. Do not book travel before the visa is granted.',
      km: 'ពាក្យសុំទេសចរណ៍ភាគច្រើនត្រូវបានសម្រេចក្នុងរយៈពេលប្រហែល ៥ សប្តាហ៍។ កុំកក់ការធ្វើដំណើរមុនពេលទទួលបានទិដ្ឋាការ។',
    },
    priceNote: {
      en: 'Australian government charge about A$250, not refunded if refused, plus the VFS biometrics fee and our fee.',
      km: 'ថ្លៃរដ្ឋាភិបាលអូស្ត្រាលីប្រហែល A$២៥០ មិនបង្វិលវិញទេ ប្រសិនបើត្រូវបដិសេធ បូកថ្លៃស្កេនជីវមាត្រ VFS និងថ្លៃសេវារបស់យើង។',
    },
    notes: {
      en: richText(
        p('The application is lodged online through ImmiAccount. After lodging, you get an email asking you to give your fingerprints and photo at the VFS Global centre in Phnom Penh. Cambodian passport holders cannot use the ETA or eVisitor.'),
        p('The Department of Home Affairs may also ask for a police certificate or a health check.'),
        p(confirmFirst.en),
      ),
      km: richText(
        p('ពាក្យសុំត្រូវដាក់តាមអនឡាញតាមរយៈ ImmiAccount។ បន្ទាប់ពីដាក់ពាក្យ អ្នកនឹងទទួលបានអ៊ីមែលឱ្យទៅផ្តិតម្រាមដៃ និងថតរូបនៅមជ្ឈមណ្ឌល VFS Global ក្នុងភ្នំពេញ។ អ្នកកាន់លិខិតឆ្លងដែនកម្ពុជាមិនអាចប្រើ ETA ឬ eVisitor បានទេ។'),
        p('ក្រសួងកិច្ចការមហាផ្ទៃអូស្ត្រាលីអាចស្នើសុំលិខិតបញ្ជាក់ពីប៉ូលិស ឬការពិនិត្យសុខភាពផងដែរ។'),
        p(confirmFirst.km),
      ),
    },
  },
]

export const pages: PageSeed[] = [
  {
    slug: 'home',
    title: { en: 'Home', km: 'ទំព័រដើម' },
    layout: [
      {
        blockType: 'hero',
        shared: { ctaLink: '/services' },
        // Independence Monument, Phnom Penh.
        images: { backgroundImage: 'Cover_phnom-penh-travel-guide.jpg' },
        en: { headline: 'Visas, passports and tickets, done right', subheadline: 'A Phnom Penh agency since 2002. We prepare your documents and book your travel.', ctaText: 'See our services' },
        km: { headline: 'ទិដ្ឋាការ លិខិតឆ្លងដែន និងសំបុត្រ ធ្វើបានត្រឹមត្រូវ', subheadline: 'ភ្នាក់ងារនៅភ្នំពេញ តាំងពីឆ្នាំ ២០០២។ យើងរៀបចំឯកសារ និងកក់ការធ្វើដំណើររបស់អ្នក។', ctaText: 'មើលសេវាកម្មរបស់យើង' },
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
        // Royal Palace, in Daun Penh like the office. Seeds as plain rich text if the image isn't uploaded.
        blockType: 'imageText',
        shared: { layout: 'imageRight' },
        images: { image: 'image_processing20220508-4-1uq51b.jpg' },
        en: {
          content: richText(
            h2('About MRL Travel'),
            p('MRL Travel is a Cambodian-owned agency that has been helping customers in Phnom Penh since 2002. We are registered with the Ministry of Commerce and the Ministry of Tourism of Cambodia.'),
            p('From our office on Street 136, near Phsar Kandal, our team prepares visa and passport applications, translates documents and books air and bus tickets.'),
          ),
        },
        km: {
          content: richText(
            h2('អំពី MRL Travel'),
            p('MRL Travel គឺជាភ្នាក់ងារដែលមានម្ចាស់ជាជនជាតិខ្មែរ ហើយបានជួយអតិថិជននៅភ្នំពេញ តាំងពីឆ្នាំ ២០០២។ យើងបានចុះបញ្ជីនៅក្រសួងពាណិជ្ជកម្ម និងក្រសួងទេសចរណ៍នៃព្រះរាជាណាចក្រកម្ពុជា។'),
            p('ពីការិយាល័យរបស់យើងនៅផ្លូវ ១៣៦ ជិតផ្សារកណ្ដាល ក្រុមការងាររបស់យើងរៀបចំពាក្យសុំទិដ្ឋាការ និងលិខិតឆ្លងដែន បកប្រែឯកសារ និងកក់សំបុត្រយន្តហោះ និងឡានក្រុង។'),
          ),
        },
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
  // Contact details as staff set them in dev-db on 2026-11-20.
  contactEmail: 'reservation@mrltours.com',
  contactPhone: '+85512849933',
  telegramUrl: 'https://t.me/mrltravel',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=136+Street+136,+Phsar+Kandal+II,+Daun+Penh,+Phnom+Penh',
  mapEmbedUrl: 'https://www.google.com/maps?q=136+Street+136,+Phsar+Kandal+II,+Daun+Penh,+Phnom+Penh&output=embed',
  socialLinks: [{ platform: 'facebook' as const, url: 'https://www.facebook.com/mrltravelcambodia/' }],
  address: {
    en: 'No. 136, Street 136, Sangkat Phsar Kandal II, Khan Daun Penh, Phnom Penh, Cambodia',
    km: 'ផ្ទះលេខ ១៣៦ ផ្លូវ ១៣៦ សង្កាត់ផ្សារកណ្ដាលទី២ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
  },
  openingHours: { en: 'Mon–Fri 8:00–17:00', km: 'ច័ន្ទ–សុក្រ ៨:០០–១៧:០០' },
  agencyNotice: {
    en: 'MRL Travel is a private agency that helps you prepare applications. We are not a government office, and the final decision is made by the issuing authority.',
    km: 'MRL Travel គឺជាភ្នាក់ងារឯកជន ដែលជួយអ្នករៀបចំពាក្យសុំ។ យើងមិនមែនជាស្ថាប័នរដ្ឋាភិបាលទេ ហើយការសម្រេចចុងក្រោយគឺធ្វើឡើងដោយអាជ្ញាធរដែលចេញឯកសារ។',
  },
}
