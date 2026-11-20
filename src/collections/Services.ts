import type { CollectionConfig } from 'payload'
import { canWrite } from '../access/canWrite'
import { publishedOrLoggedIn } from '../access/publishedOrLoggedIn'

// Services shown on the public site (visa, passport, translation, tickets...).
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Website content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', '_status'],
  },
  defaultSort: 'order',
  // Draft/Publish is the "published" flag.
  versions: { drafts: true },
  access: {
    read: publishedOrLoggedIn,
    create: canWrite,
    update: canWrite,
    delete: canWrite,
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL part, e.g. "passport" → /en/services/passport' },
    },
    { name: 'summary', type: 'textarea', required: true, localized: true },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'document',
      options: ['visa', 'passport', 'translation', 'plane', 'bus', 'document'],
    },
    { name: 'image', type: 'relationship', relationTo: 'website-media' },
    { name: 'body', type: 'richText', localized: true },
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
    { name: 'processingTime', type: 'text', localized: true, admin: { description: 'e.g. "5–7 working days"' } },
    { name: 'priceFrom', type: 'number', min: 0, admin: { description: 'Starting price in USD (optional)' } },
    { name: 'priceNote', type: 'text', localized: true },
    {
      name: 'steps',
      label: 'How it works',
      type: 'array',
      localized: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'enquiry',
      type: 'group',
      fields: [
        {
          name: 'form',
          type: 'select',
          defaultValue: 'general',
          options: [
            { label: 'General enquiry', value: 'general' },
            { label: 'Ticket request (route, date, passengers)', value: 'ticket' },
          ],
        },
        { name: 'buttonLabel', type: 'text', localized: true },
        { name: 'messagePrefill', type: 'textarea', localized: true },
      ],
    },
    {
      name: 'showAgencyNotice',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show the "private agency, not a government office" notice (Site Settings).' },
    },
    {
      name: 'listsVisaCountries',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show the Visa Countries list on this service page.' },
    },
    { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
