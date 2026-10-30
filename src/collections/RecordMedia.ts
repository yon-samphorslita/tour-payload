import type { CollectionConfig } from 'payload'
import { hideFromNonAdmins } from '../access/hideFromNonAdmins'

const isStaffOrAdmin = ({ req }: any) =>
  req.user?.role === 'staff' || req.user?.role === 'admin'

export const RecordMedia: CollectionConfig = {
  slug: 'record-media',
  admin: { hidden: hideFromNonAdmins },
  upload: {
    mimeTypes: [
      'image/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.*',
    ],
  },
  access: {
    read: isStaffOrAdmin,
    create: isStaffOrAdmin,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
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