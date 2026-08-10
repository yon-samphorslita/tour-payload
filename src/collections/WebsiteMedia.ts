import type { CollectionConfig } from 'payload'
import { canWrite } from '../access/canWrite'

// Public marketing/portfolio images — kept in a separate S3 bucket
// (S3_WEBSITE_BUCKET) from the invoicing-related `media` collection
// (receipts, invoices, booking docs), which stays in S3_ADMIN_BUCKET.
export const WebsiteMedia: CollectionConfig = {
  slug: 'website-media',
  admin: {
    group: 'Website content',
    useAsTitle: 'alt',
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
    create: canWrite,
    update: canWrite,
    delete: canWrite,
  },
  fields: [{ name: 'alt', type: 'text' }],
}
