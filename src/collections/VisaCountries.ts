import type { CollectionConfig } from 'payload'
import { canWrite } from '../access/canWrite'
import { publishedOrLoggedIn } from '../access/publishedOrLoggedIn'

// Per-country checklists for the visa preparation service (/en/visa/<slug>).
export const VisaCountries: CollectionConfig = {
  slug: 'visa-countries',
  labels: { singular: 'Visa Country', plural: 'Visa Countries' },
  admin: {
    group: 'Website content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order', '_status'],
  },
  defaultSort: 'order',
  versions: { drafts: true },
  access: {
    read: publishedOrLoggedIn,
    create: canWrite,
    update: canWrite,
    delete: canWrite,
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL part, e.g. "japan" → /en/visa/japan' },
    },
    { name: 'summary', type: 'textarea', localized: true },
    {
      name: 'documents',
      label: 'Required documents',
      type: 'array',
      localized: true,
      fields: [
        { name: 'item', type: 'text', required: true },
        { name: 'note', type: 'text' },
      ],
    },
    { name: 'processingTime', type: 'text', localized: true },
    { name: 'priceFrom', type: 'number', min: 0, admin: { description: 'Starting price in USD (optional)' } },
    { name: 'priceNote', type: 'text', localized: true },
    { name: 'notes', type: 'richText', localized: true },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
