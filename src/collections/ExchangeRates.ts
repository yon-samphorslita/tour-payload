import type { CollectionConfig } from "payload";
import { canWrite } from "../access/canWrite";

export const ExchangeRates: CollectionConfig = {
  slug: "exchange-rates",
  admin: {
    group: "Operations",
    useAsTitle: "date",
    description:
      "Auto-filled from the first sale or purchase entered for each date. Sales and purchases reuse whatever rate is stored here so staff don't have to retype it.",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: canWrite,
    update: canWrite,
    delete: canWrite,
  },
  fields: [
    {
      name: "date",
      type: "text",
      label: "Date",
      required: true,
      unique: true,
      admin: {
        description: 'Stored as "YYYY-MM-DD"',
      },
    },
    {
      name: "rate",
      type: "number",
      label: "Exchange rate (KHR per USD)",
      required: true,
    },
  ],
};
