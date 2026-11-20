import type { GlobalConfig, TextFieldSingleValidation } from 'payload'

// These render as links/iframes on the public site, so only allow https URLs.
const httpsUrl: TextFieldSingleValidation = (value) =>
  !value || /^https:\/\/[^\s]+$/.test(value) || 'Must be a full https:// link'

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
      validate: httpsUrl,
      admin: { description: 'Google Maps "Embed a map" src URL, for the Contact Info block' },
    },
    {
      name: 'agencyNotice',
      type: 'textarea',
      localized: true,
      admin: { description: 'Shown on services with "Show agency notice" ticked.' },
    },
  ],
}
