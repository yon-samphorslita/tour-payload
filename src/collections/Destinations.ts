// Destinations.ts
import type { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,  // public
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'country', type: 'text' },
    { name: 'description', type: 'richText' },
    { name: 'price', type: 'number' },
    { name: 'featuredImage', type: 'relationship', relationTo: 'media' },
    { name: 'gallery', type: 'relationship', relationTo: 'media', hasMany: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}