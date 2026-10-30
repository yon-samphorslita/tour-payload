// Destinations.ts
import type { CollectionConfig } from 'payload'
import { canWrite } from '../access/canWrite'
import { hideFromNonAdmins } from '../access/hideFromNonAdmins'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: { useAsTitle: 'name', hidden: hideFromNonAdmins },
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
    { name: 'featuredImage', type: 'relationship', relationTo: 'media' },
    { name: 'gallery', type: 'relationship', relationTo: 'media', hasMany: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}