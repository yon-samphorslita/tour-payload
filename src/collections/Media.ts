import type { CollectionConfig } from 'payload'

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
  // access: {
  //   read: ({ req }) => req.user?.role === 'admin',
  //   create: ({ req }) => !!req.user,
  //   update: ({ req }) => req.user?.role === 'admin',
  //   delete: ({ req }) => req.user?.role === 'admin',
  // },
  fields: [
    { name: 'alt', type: 'text' },
    {
      name: 'category',
      type: 'select',
      options: ['receipt', 'invoice', 'booking', 'contract', 'photo'],
    },
    { name: 'uploadedBy', type: 'relationship', relationTo: 'users' },
  ],
}
