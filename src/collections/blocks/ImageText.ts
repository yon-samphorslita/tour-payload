import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const ImageText: Block = {
  slug: 'imageText',
  labels: { singular: 'Image + Text', plural: 'Image + Text Blocks' },
  fields: [
    { name: 'image', type: 'relationship', relationTo: 'website-media', required: true },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      localized: true,
      required: true,
    },
    {
      name: 'layout',
      type: 'radio',
      defaultValue: 'imageLeft',
      options: [
        { label: 'Image left', value: 'imageLeft' },
        { label: 'Image right', value: 'imageRight' },
      ],
    },
  ],
}
