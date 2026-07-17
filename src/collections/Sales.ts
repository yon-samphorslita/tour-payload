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
      name: 'invoiceNo',
      type: 'text',
      label: 'Invoice no.',
      required: true,
      unique: true,
      admin: {
        description: 'Customer-facing invoice number printed on the PDF (e.g. "M000053")',
      },
    },
    {
      name: 'invoiceDate',
      type: 'date',
      label: 'Invoice date',
      defaultValue: () => new Date().toISOString(),
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
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      admin: {
        description: 'Optional — link this sale to a company client',
      },
    },
    {
      name: 'customerAddressOverride',
      type: 'textarea',
      label: 'Customer address',
      admin: {
        description: 'Overrides client.address on the invoice; required for one-off customers with no client linked',
      },
    },
    {
      name: 'customerPhoneOverride',
      type: 'text',
      label: 'Customer phone',
      admin: {
        description: 'Overrides client.phone on the invoice',
      },
    },
    {
      name: 'customerEmailOverride',
      type: 'text',
      label: 'Customer email',
      admin: {
        description: 'Overrides client.email on the invoice',
      },
    },
    {
      name: 'customerVatTinOverride',
      type: 'text',
      label: 'Customer VAT/TIN',
      admin: {
        description: 'Overrides client.vatNumber on the invoice',
      },
    },
    {
      name: 'serviceNames',
      type: 'array',
      label: 'Passenger / service names',
      admin: {
        description: 'Renders as "1. NAME  2. NAME..." on the invoice',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'serviceDescription',
      type: 'text',
      label: 'Service description',
      admin: {
        description: 'e.g. "Extension Visa KH 1 Year"',
      },
    },
    {
      name: 'serviceSubAddress',
      type: 'textarea',
      label: 'Service sub-address',
      admin: {
        description: 'Optional line printed under the service description',
      },
    },
    {
      name: 'lineItems',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          admin: {
            description: 'e.g. "Extension Visa KH 1 Year"',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
        },
        {
          name: 'amount',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Auto-computed: quantity × unitPrice',
          },
        },
      ],
    },
    {
      name: 'taxNote',
      type: 'text',
      label: 'Tax note',
      defaultValue: 'Tax is include',
    },
    {
      name: 'exchangeRate',
      type: 'number',
      label: 'Exchange rate (KHR per USD)',
    },
    {
      name: 'grandTotalUSD',
      type: 'number',
      label: 'Grand total (USD)',
      admin: {
        readOnly: true,
        description: 'Auto-computed and snapshotted on save',
      },
    },
    {
      name: 'grandTotalKHR',
      type: 'number',
      label: 'Grand total (KHR)',
      admin: {
        readOnly: true,
        description: 'Auto-computed and snapshotted on save',
      },
    },
    {
      name: 'preparedBy',
      type: 'text',
      label: 'Prepared by',
      admin: {
        description: 'Staff name shown on the invoice footer',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
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

        return {
          ...data,
          customerName: customerName || undefined,
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
      ({ data }) => {
        if (Array.isArray(data?.lineItems)) {
          let total = 0
          data.lineItems = data.lineItems.map((item: any) => {
            const amount = (item.quantity ?? 0) * (item.unitPrice ?? 0)
            total += amount
            return { ...item, amount }
          })
          data.grandTotalUSD = total
          data.grandTotalKHR = total * (data.exchangeRate ?? 0)
        }
        return data
      },
    ],
  },
}
