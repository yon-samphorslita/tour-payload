import type { Block } from 'payload'

// Heading only — the actual contact details are rendered from the
// `site-settings` global, not duplicated into page content.
export const ContactInfo: Block = {
  slug: 'contactInfo',
  labels: { singular: 'Contact Info', plural: 'Contact Info Blocks' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'showMap', type: 'checkbox', defaultValue: false },
  ],
}
