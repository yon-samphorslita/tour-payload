import type { Block } from 'payload'

// Heading/intro only — the grid itself is populated at render time from the
// live `destinations` collection, not duplicated into page content.
export const DestinationsGrid: Block = {
  slug: 'destinationsGrid',
  labels: { singular: 'Destinations Grid', plural: 'Destinations Grids' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'intro', type: 'text', localized: true },
    { name: 'featuredOnly', type: 'checkbox', defaultValue: false },
  ],
}
