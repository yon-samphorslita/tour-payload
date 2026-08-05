import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'headline', type: 'text', required: true, localized: true },
    { name: 'subheadline', type: 'text', localized: true },
    { name: 'backgroundImage', type: 'relationship', relationTo: 'website-media' },
    { name: 'ctaText', type: 'text', localized: true },
    { name: 'ctaLink', type: 'text' },
  ],
}
