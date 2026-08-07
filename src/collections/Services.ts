import type { CollectionConfig } from "payload";
import { canWrite } from "../access/canWrite";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    group: "Website content",
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: canWrite,
    update: canWrite,
    delete: canWrite,
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