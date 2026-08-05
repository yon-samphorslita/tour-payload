import type { Block } from 'payload'

export const Gallery: Block = {
  slug: 'gallery',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [
    { name: 'heading', type: 'text', localized: true },
    { name: 'images', type: 'relationship', relationTo: 'website-media', hasMany: true, required: true },
  ],
}
