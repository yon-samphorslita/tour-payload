import { timingSafeEqual } from 'node:crypto'
import type { Access, CollectionConfig } from 'payload'
import { canWrite } from '../access/canWrite'

// The public site's server sends the shared key; browsers never see it.
const hasEnquiryKey: Access = ({ req }) => {
  if (req.user) return true
  const expected = process.env.ENQUIRY_API_KEY
  const given = req.headers.get('x-enquiry-key')
  if (!expected || !given || given.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected))
}

// Enquiries submitted from the public site's forms.
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    group: 'Enquiries',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'service', 'status', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    create: hasEnquiryKey,
    // Customer contact details: staff only, not the view-only tax role.
    read: canWrite,
    update: canWrite,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: ['new', 'contacted', 'closed'],
      admin: { position: 'sidebar' },
    },
    {
      name: 'form',
      type: 'select',
      defaultValue: 'general',
      options: ['general', 'ticket'],
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'locale', type: 'select', options: ['en', 'km'], admin: { position: 'sidebar', readOnly: true } },
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'visaCountry', type: 'relationship', relationTo: 'visa-countries' },
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    { name: 'phone', type: 'text', required: true, maxLength: 40 },
    { name: 'telegram', type: 'text', maxLength: 60 },
    { name: 'email', type: 'email' },
    { name: 'message', type: 'textarea', maxLength: 2000 },
    {
      name: 'ticket',
      type: 'group',
      admin: { condition: (data) => data?.form === 'ticket' },
      fields: [
        { name: 'from', type: 'text', maxLength: 120 },
        { name: 'to', type: 'text', maxLength: 120 },
        { name: 'travelDate', type: 'date' },
        { name: 'returnDate', type: 'date' },
        { name: 'passengers', type: 'number', min: 1, max: 50 },
      ],
    },
  ],
}
