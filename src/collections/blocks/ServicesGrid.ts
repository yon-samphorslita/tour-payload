import type { Block } from 'payload'

// Heading/intro only — the grid itself is populated at render time from the
// live `services` collection, not duplicated into page content.
export const ServicesGrid: Block = {
  slug: 'servicesGrid',
  labels: { singular: 'Services Grid', plural: 'Services Grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'intro', type: 'text', localized: true },
  ],
}
