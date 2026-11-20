import type { CollectionConfig } from 'payload'
import { canWrite } from '../access/canWrite'

// Turns "visa-photo_2.jpg" into "visa photo 2".
function altFromFilename(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  const nameWithoutExtension = lastDot > 0 ? filename.slice(0, lastDot) : filename
  return nameWithoutExtension.replace(/[-_]+/g, ' ').trim()
}

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
    // Hides "Paste URL": the browser fetch fails for most sites (CORS), so staff upload files instead.
    pasteURL: false,
  },
  access: {
    read: () => true,
    create: canWrite,
    update: canWrite,
    delete: canWrite,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Leave empty to use the file name.' },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        // Staff-typed alt text always wins; only fill it when empty.
        const typedAlt = typeof data.alt === 'string' ? data.alt.trim() : ''
        if (typedAlt) {
          return data
        }
        const filename = data.filename ?? originalDoc?.filename
        if (typeof filename === 'string' && filename) {
          data.alt = altFromFilename(filename)
        }
        return data
      },
    ],
  },
}
