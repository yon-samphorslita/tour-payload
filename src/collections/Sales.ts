import { ValidationError, type CollectionConfig } from 'payload'

function hasRelationshipValue(value: unknown): boolean {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim().length > 0
  }

  if (value && typeof value === 'object' && 'id' in value) {
    return hasRelationshipValue(value.id)
  }

  return false
}

export const Sales: CollectionConfig = {
  slug: 'sales',
  admin: {
    group: 'Operations',
    useAsTitle: 'customerName',
  },
  // Nothing here is public. Every operation requires a logged-in user.
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      label: 'Customer name',
      admin: {
        description: 'Optional when a client is linked',
      },
    },
    {
      name: 'receiptCode',
      type: 'text',
      label: 'Receipt code',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Paid', value: 'paid' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      admin: {
        description: 'Optional — link this sale to a company client',
      },
    },
    {
      name: 'purchase',
      type: 'relationship',
      relationTo: 'purchases',
      admin: {
        description: 'Optional — link or create the purchase order that fulfills this sale',
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Invoices, receipts, contracts, or product photos for this sale',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        const customerName =
          typeof data?.customerName === 'string'
            ? data.customerName.trim()
            : typeof originalDoc?.customerName === 'string'
              ? originalDoc.customerName.trim()
              : ''

        const client = Object.prototype.hasOwnProperty.call(data ?? {}, 'client')
          ? data?.client
          : originalDoc?.client
        const receiptCode =
          typeof data?.receiptCode === 'string'
            ? data.receiptCode.trim()
            : typeof originalDoc?.receiptCode === 'string'
              ? originalDoc.receiptCode.trim()
              : ''

        if (!customerName && !hasRelationshipValue(client)) {
          throw new ValidationError({
            collection: 'sales',
            errors: [
              {
                message: 'Enter a customer name or choose a client.',
                path: 'customerName',
              },
              {
                message: 'Enter a customer name or choose a client.',
                path: 'client',
              },
            ],
            req,
          })
        }

        if (receiptCode) {
          const existingPurchase = await req.payload.find({
            collection: 'purchases',
            depth: 0,
            limit: 1,
            overrideAccess: true,
            pagination: false,
            where: {
              receiptCode: {
                equals: receiptCode,
              },
            },
          })

          if (existingPurchase.docs.length > 0) {
            throw new ValidationError({
              collection: 'sales',
              errors: [
                {
                  message: 'Receipt code already exists on a purchase.',
                  path: 'receiptCode',
                },
              ],
              req,
            })
          }
        }

        return {
          ...data,
          customerName: customerName || undefined,
          receiptCode: receiptCode || data?.receiptCode,
        }
      },
    ],
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}
