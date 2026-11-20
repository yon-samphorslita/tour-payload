// Destinations.ts
import type { CollectionConfig } from 'payload'
import { canWrite } from '../access/canWrite'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  // Shown on the public site, so staff edit it with the other website content.
  admin: { useAsTitle: 'name', group: 'Website content' },
  access: {
    read: () => true,  // public
    create: canWrite,
    update: canWrite,
    delete: canWrite,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'country', type: 'text' },
    { name: 'description', type: 'richText' },
    { name: 'price', type: 'number' },
    { name: 'featuredImage', type: 'relationship', relationTo: 'website-media' },
    { name: 'gallery', type: 'relationship', relationTo: 'website-media', hasMany: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}