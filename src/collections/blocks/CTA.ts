import type { Block } from 'payload'

export const CTA: Block = {
  slug: 'cta',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    { name: 'heading', type: 'text', required: true, localized: true },
    { name: 'buttonText', type: 'text', required: true, localized: true },
    { name: 'buttonLink', type: 'text', required: true },
  ],
}
