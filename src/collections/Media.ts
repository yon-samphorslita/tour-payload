import type { CollectionConfig } from 'payload'
import { canWrite } from '../access/canWrite'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: [
      'image/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.*',
    ],
  },
  access: {
    read: () => true,
    create: canWrite,
    update: canWrite,
    delete: canWrite,
  },
  fields: [
    { name: 'alt', type: 'text' },
    {
      name: 'category',
      type: 'select',
      options: ['receipt', 'invoice', 'booking', 'contract', 'photo'],
    },
    {
      name: 'prefix',
      type: 'text',
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    { name: 'uploadedBy', type: 'relationship', relationTo: 'users' },
  ],
}
