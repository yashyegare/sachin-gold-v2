import type { RateGroup } from "@/lib/types";

// Real category structure and units, pulled from the live rate.html —
// the live site itself still shows placeholder "₹ 00,000" values for
// every row, so real prices have never been published. Every price here
// is "On request" until the client supplies real numbers (never invented,
// never "TODO" — a literal TODO string would render on the page).
//
// ORDER = BUSINESS PRIORITY, not alphabetical. Soya DOC (Normal and
// High-Pro) led the old site's ticker and is the most-asked-about line —
// it leads. Fill priceValue (numeric, INR) at the same time as price:
// the page's schema.org Offers and the home ticker both derive from this
// file, so there is exactly one place prices can ever live.
//
// `unit` is the basis alone and `unitNote` the qualifier, split so the
// rates page can re-express a line in ₹/quintal without dropping
// "ex-plant" or "GST & freight". `unitKg` says how many kilograms one
// unit of `price` covers — the sheet's number is meaningless without it.
//
// `unit`/`unitNote`/`price` here are the ENGLISH copy. Visitor-facing pages
// resolve `unitKey`/`noteKey` against messages/<locale>.json instead; the
// rate-card PDF keeps printing the English strings, because it is the
// document that gets forwarded to buyers and quoted from — one canonical
// trade wording, like the Latin product names on it. Adding a line
// therefore means a row here plus a units/notes key in six message files.
export const rateGroups: RateGroup[] = [
  {
    title: "Soya Derivatives",
    updatedOn: null,
    items: [
      {
        product: "Soya DOC (Normal)",
        price: "On request",
        unit: "per Metric Ton",
        unitNote: "plus GST & freight",
        unitKg: 1000,
        unitKey: "mt",
        noteKey: "gstFreight",
        // priceValue: undefined,
      },
      {
        product: "Soya DOC (High Pro)",
        price: "On request",
        unit: "per Metric Ton",
        unitNote: "plus GST & freight",
        unitKg: 1000,
        unitKey: "mt",
        noteKey: "gstFreight",
      },
      {
        product: "Soya Crude Oil",
        price: "On request",
        unit: "per 10 kg",
        unitNote: "ex-plant",
        unitKg: 10,
        unitKey: "p10kg",
        noteKey: "exPlant",
      },
      {
        product: "Soya Refined Oil",
        price: "On request",
        unit: "per 10 kg",
        unitNote: "premium grade",
        unitKg: 10,
        unitKey: "p10kg",
        noteKey: "premiumGrade",
      },
      {
        product: "Soya Fatty Oil",
        price: "On request",
        unit: "per 10 kg",
        unitNote: "industrial grade",
        unitKg: 10,
        unitKey: "p10kg",
        noteKey: "industrialGrade",
      },
      {
        product: "Soya Acid Oil",
        price: "On request",
        unit: "per 10 kg",
        unitNote: "industrial grade",
        unitKg: 10,
        unitKey: "p10kg",
        noteKey: "industrialGrade",
      },
      {
        product: "Soya Lecithin",
        price: "On request",
        unit: "per kg",
        unitNote: "liquid grade",
        unitKg: 1,
        unitKey: "kg",
        noteKey: "liquidGrade",
      },
    ],
  },
  {
    title: "Dals & Flour",
    updatedOn: null,
    items: [
      {
        product: "Toor Dal",
        price: "On request",
        unit: "per kg",
        unitNote: "premium quality",
        unitKg: 1,
        unitKey: "kg",
        noteKey: "premiumQuality",
      },
      {
        product: "Chana Dal",
        price: "On request",
        unit: "per kg",
        unitNote: "super fine",
        unitKg: 1,
        unitKey: "kg",
        noteKey: "superFine",
      },
      {
        product: "Besan Flour",
        price: "On request",
        unit: "per kg",
        unitNote: "pure chana besan",
        unitKg: 1,
        unitKey: "kg",
        noteKey: "pureChanaBesan",
      },
    ],
  },
];

// --- Single source of truth for anything rate-shaped elsewhere ---

/** The items the home ticker shows once real prices exist: the priority
 *  lead items that have an actual number. Empty until then — the ticker
 *  must not render at all rather than ship placeholder dashes (the exact
 *  failure the old site had). */
export function getTickerRates(): { product: string; price: string }[] {
  return rateGroups
    .flatMap((group) => group.items)
    .filter((item) => item.priceValue !== undefined)
    .map((item) => ({ product: item.product, price: item.price }));
}

/** True when at least one real price exists — gates both the ticker and
 *  the schema.org Offers so neither activates prematurely. */
export function hasRealRates(): boolean {
  return rateGroups.some((group) =>
    group.items.some((item) => item.priceValue !== undefined),
  );
}
