import type { CollectionConfig } from "payload";

export const Clients: CollectionConfig = {
  slug: "clients",
  admin: {
    group: "Operations",
    useAsTitle: "companyName",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "client",
      options: [
        { label: "Client", value: "client" },
        { label: "Supplier", value: "supplier" },
      ],
    },
    {
      name: "companyName",
      type: "text",
      required: true,
    },
    {
      name: "companyNameKH",
      type: "text",
      label: "Company name (Khmer)",
    },
    {
      name: "vatNumber",
      type: "text",
      label: "VAT number",
    },
    {
      name: "address",
      type: "textarea",
    },
    {
      name: "addressKH",
      type: "textarea",
      label: "Address (Khmer)",
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "email",
      type: "text",
    },
  ],
};