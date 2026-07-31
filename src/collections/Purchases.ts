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
      // Exports filter and sort by this field, so an index keeps those
      // queries fast as the purchases collection grows.
      index: true,
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

        // Only re-check for a clashing sale invoice number when receiptCode is
        // actually being changed. Without this, every save (even ones that
        // only edit lineItems or notes) re-ran this extra database query.
        const receiptCodeChanged = receiptCode !== (originalDoc?.receiptCode ?? "");

        if (receiptCode && receiptCodeChanged) {
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
      async ({ doc, previousDoc, operation, req }) => {
        // Skip the extra database lookup when neither field changed —
        // this hook used to run on every save, even ones that had nothing
        // to do with the exchange rate.
        const invoiceDateChanged = doc.invoiceDate !== previousDoc?.invoiceDate;
        const exchangeRateChanged = doc.exchangeRate !== previousDoc?.exchangeRate;

        if (operation === "create" || invoiceDateChanged || exchangeRateChanged) {
          await upsertExchangeRateIfMissing(req.payload, doc.invoiceDate, doc.exchangeRate);
        }

        return doc;
      },
    ],
  },
};
