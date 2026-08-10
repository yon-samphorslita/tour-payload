import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Login session length — keep this in sync with COOKIE_MAX_AGE in mrl-admin/app/api/auth/login/route.ts
    tokenExpiration: 60 * 60 * 5, // 5 hours, in seconds
  },
  admin: { useAsTitle: 'email' },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'staff',
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
