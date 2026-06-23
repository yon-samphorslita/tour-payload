import type { CollectionConfig } from "payload";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    group: "Website content",
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
      required: true,
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
  ],
};