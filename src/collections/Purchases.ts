import { ValidationError, type CollectionConfig } from "payload";

export const Purchases: CollectionConfig = {
  slug: "purchases",
  admin: {
    group: "Operations",
    useAsTitle: "supplierName",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "supplierName",
      type: "text",
      required: true,
    },
    {
      name: "receiptCode",
      type: "text",
      label: "Receipt code",
      required: true,
      unique: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Paid", value: "paid" },
      ],
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
      ],
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
              receiptCode: {
                equals: receiptCode,
              },
            },
          });

          if (existingSale.docs.length > 0) {
            throw new ValidationError({
              collection: "purchases",
              errors: [
                {
                  message: "Receipt code already exists on a sale.",
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
    ],
  },
};
