import type { GlobalConfig, TextFieldSingleValidation } from 'payload'

// These render as links/iframes on the public site, so only allow https URLs.
const httpsUrl: TextFieldSingleValidation = (value) =>
  !value || /^https:\/\/[^\s]+$/.test(value) || 'Must be a full https:// link'

// The public site only shows Google's official embed links; older ?output=embed links show a blank map.
const OFFICIAL_MAP_EMBED_PREFIX = 'https://www.google.com/maps/embed?pb='

const MAP_EMBED_ERROR_EN =
  `Paste the link from Google Maps → Share → Embed a map. It starts with ${OFFICIAL_MAP_EMBED_PREFIX}. ` +
  'If you copied the whole <iframe> code, keep only the link inside src="…". Or leave this empty.'
const MAP_EMBED_ERROR_KM =
  `សូមបិទភ្ជាប់តំណពី Google Maps → Share → Embed a map។ តំណត្រូវចាប់ផ្តើមដោយ ${OFFICIAL_MAP_EMBED_PREFIX} ។ ` +
  'បើអ្នកចម្លងកូដ <iframe> ទាំងមូល សូមយកតែតំណនៅក្នុង src="…" ប៉ុណ្ណោះ។ ឬទុកវាលនេះឱ្យនៅទទេ។'

const officialMapEmbedUrl: TextFieldSingleValidation = (value, { previousValue }) => {
  if (!value) return true

  // An unchanged saved value stays valid, so an old link doesn't block saving other settings.
  if (value === previousValue) return true

  const hasOfficialPrefix = value.startsWith(OFFICIAL_MAP_EMBED_PREFIX)
  const hasSpaces = /\s/.test(value)
  if (hasOfficialPrefix && !hasSpaces) return true

  // The admin UI is English-only, so show both languages.
  return `${MAP_EMBED_ERROR_EN}\n${MAP_EMBED_ERROR_KM}`
}

// Public-facing site config for mrl-portfolio — unlike CompanyInfo (which is
// invoicing-related and locked to logged-in users), this is readable by anyone.
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Website content',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'logo', type: 'relationship', relationTo: 'website-media' },
    {
      name: 'navLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'link', type: 'text', required: true },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['facebook', 'instagram', 'telegram', 'tiktok', 'youtube', 'whatsapp'],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
    {
      name: 'telegramUrl',
      type: 'text',
      validate: httpsUrl,
      admin: { description: 'e.g. https://t.me/yourname. Shown as a contact button on every page.' },
    },
    { name: 'address', type: 'textarea', localized: true },
    { name: 'openingHours', type: 'textarea', localized: true },
    { name: 'mapUrl', type: 'text', validate: httpsUrl, admin: { description: 'Google Maps link to the office' } },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      validate: officialMapEmbedUrl,
      admin: {
        description:
          'Google Maps → Share → Embed a map, then paste only the src link (starts with https://www.google.com/maps/embed?pb=). Empty shows the address panel instead.',
      },
    },
    {
      name: 'agencyNotice',
      type: 'textarea',
      localized: true,
      admin: { description: 'Shown on services with "Show agency notice" ticked.' },
    },
  ],
}
