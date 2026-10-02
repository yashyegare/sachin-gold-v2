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
        // priceValue: undefined,
      },
      {
        product: "Soya DOC (High Pro)",
        price: "On request",
        unit: "per Metric Ton",
        unitNote: "plus GST & freight",
        unitKg: 1000,
      },
      {
        product: "Soya Crude Oil",
        price: "On request",
        unit: "per 10 kg",
        unitNote: "ex-plant",
        unitKg: 10,
      },
      {
        product: "Soya Refined Oil",
        price: "On request",
        unit: "per 10 kg",
        unitNote: "premium grade",
        unitKg: 10,
      },
      {
        product: "Soya Fatty Oil",
        price: "On request",
        unit: "per 10 kg",
        unitNote: "industrial grade",
        unitKg: 10,
      },
      {
        product: "Soya Acid Oil",
        price: "On request",
        unit: "per 10 kg",
        unitNote: "industrial grade",
        unitKg: 10,
      },
      {
        product: "Soya Lecithin",
        price: "On request",
        unit: "per kg",
        unitNote: "liquid grade",
        unitKg: 1,
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
      },
      {
        product: "Chana Dal",
        price: "On request",
        unit: "per kg",
        unitNote: "super fine",
        unitKg: 1,
      },
      {
        product: "Besan Flour",
        price: "On request",
        unit: "per kg",
        unitNote: "pure chana besan",
        unitKg: 1,
      },
    ],
  },
];

// Kept for the page footer; prefer group.updatedOn for anything visible
// next to a specific table. null hides the "Last updated" line entirely —
// a stale date reads as worse than no date. Set once the client confirms.
export const ratesLastUpdated: string | null = null;

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
