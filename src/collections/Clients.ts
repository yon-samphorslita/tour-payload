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
      name: "companyName",
      type: "text",
      required: true,
    },
    {
      name: "vatNumber",
      type: "text",
      label: "VAT number",
    },
  ],
};