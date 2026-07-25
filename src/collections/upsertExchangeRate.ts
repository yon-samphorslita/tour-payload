import type { Payload } from "payload";

// Saves a rate for a date the first time it's seen, so later sales or
// purchases on that same date can reuse it. If a rate is already stored for
// the date, this does nothing — it never overwrites an existing rate.
export async function upsertExchangeRateIfMissing(
  payload: Payload,
  invoiceDate: unknown,
  exchangeRate: unknown
): Promise<void> {
  if (typeof exchangeRate !== "number" || exchangeRate <= 0) return;
  if (typeof invoiceDate !== "string" || !invoiceDate) return;

  const date = invoiceDate.slice(0, 10);

  const existing = await payload.find({
    collection: "exchange-rates",
    where: { date: { equals: date } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs.length === 0) {
    await payload.create({
      collection: "exchange-rates",
      data: { date, rate: exchangeRate },
      overrideAccess: true,
    });
  }
}
