// Pages.ts
import type { CollectionConfig } from 'payload'
import {
  Hero,
  RichTextBlock,
  ImageText,
  ServicesGrid,
  DestinationsGrid,
  Gallery,
  CTA,
  ContactInfo,
} from './blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Website content',
  },
  versions: {
    drafts: true,
  },
  access: {
    // Published docs are public; drafts are only readable by logged-in staff.
    // `req.query.draft=true` (Payload's own preview convention) is how the
    // staff editing UI asks for the draft version.
    read: ({ req }) => {
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Hero, RichTextBlock, ImageText, ServicesGrid, DestinationsGrid, Gallery, CTA, ContactInfo],
    },
  ],
}
