import type { GlobalConfig } from 'payload'

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
    { name: 'address', type: 'textarea', localized: true },
  ],
}
