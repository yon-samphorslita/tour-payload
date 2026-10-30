import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

// Admins can manage everyone; staff/tax can only see and edit their own record.
const isAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return { id: { equals: req.user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Login session length — keep this in sync with COOKIE_MAX_AGE in mrl-admin/app/api/auth/login/route.ts
    tokenExpiration: 60 * 60 * 5, // 5 hours, in seconds
  },
  admin: { useAsTitle: 'email' },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'staff',
      // Only admins can change roles, so staff can't promote themselves.
      access: { update: ({ req }) => req.user?.role === 'admin' },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
        { label: 'Tax', value: 'tax' },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Printed as "Prepared by" on invoice PDFs instead of the email address',
      },
    },
  ],
}
