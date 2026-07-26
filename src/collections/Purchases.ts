import { ValidationError, type CollectionConfig } from "payload";
import { upsertExchangeRateIfMissing } from "./upsertExchangeRate";

export const Purchases: CollectionConfig = {
  slug: "purchases",
  admin: {
    group: "Operations",
    useAsTitle: "receiptCode",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      // Staff can only delete purchases they created themselves.
      return { createdBy: { equals: req.user.id } }
    },
  },
  fields: [
    {
      name: "supplier",
      type: "relationship",
      relationTo: "clients",
      required: true,
      filterOptions: {
        type: { equals: "supplier" },
      },
    },
    {
      name: "receiptCode",
      type: "text",
      label: "Invoice No.",
      required: true,
      unique: true,
    },
    {
      name: "invoiceDate",
      type: "date",
      label: "Invoice date",
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: "lineItems",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "description",
          type: "text",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          defaultValue: 1,
        },
        {
          name: "unitPrice",
          type: "number",
          required: true,
        },
        {
          name: "amount",
          type: "number",
          admin: {
            readOnly: true,
            description: "Auto-computed: quantity × unitPrice",
          },
        },
      ],
    },
    {
      name: "exchangeRate",
      type: "number",
      label: "Exchange rate (KHR per USD)",
    },
    {
      name: "grandTotalUSD",
      type: "number",
      label: "Grand total (USD)",
      admin: {
        readOnly: true,
        description: "Auto-computed and snapshotted on save",
      },
    },
    {
      name: "grandTotalKHR",
      type: "number",
      label: "Grand total (KHR)",
      admin: {
        readOnly: true,
        description: "Auto-computed and snapshotted on save",
      },
    },
    {
      name: "notes",
      type: "textarea",
    },
    {
      name: "images",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: {
        description: "Supplier invoices, receipts, or product photos for this purchase",
      },
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        const receiptCode =
          typeof data?.receiptCode === "string"
            ? data.receiptCode.trim()
            : typeof originalDoc?.receiptCode === "string"
              ? originalDoc.receiptCode.trim()
              : "";

        if (receiptCode) {
          const existingSale = await req.payload.find({
            collection: "sales",
            depth: 0,
            limit: 1,
            overrideAccess: true,
            pagination: false,
            where: {
              invoiceNo: {
                equals: receiptCode,
              },
            },
          });

          if (existingSale.docs.length > 0) {
            throw new ValidationError({
              collection: "purchases",
              errors: [
                {
                  message: "Invoice No already exists as a sale invoice number.",
                  path: "receiptCode",
                },
              ],
              req,
            });
          }
        }

        return {
          ...data,
          receiptCode: receiptCode || data?.receiptCode,
        };
      },
    ],
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === "create" && req.user) {
          data.createdBy = req.user.id;
        }
        return data;
      },
      ({ data }) => {
        if (Array.isArray(data?.lineItems)) {
          let total = 0;
          data.lineItems = data.lineItems.map((item: any) => {
            const amount = (item.quantity ?? 0) * (item.unitPrice ?? 0);
            total += amount;
            return { ...item, amount };
          });
          data.grandTotalUSD = total;
          data.grandTotalKHR = total * (data.exchangeRate ?? 0);
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        await upsertExchangeRateIfMissing(req.payload, doc.invoiceDate, doc.exchangeRate);
        return doc;
      },
    ],
  },
};
