// Pages.ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText' },
  ],
}