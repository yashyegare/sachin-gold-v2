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
export const rateGroups: RateGroup[] = [
  {
    title: "Soya Derivatives",
    updatedOn: null,
    items: [
      {
        product: "Soya DOC (Normal)",
        price: "On request",
        unit: "per Metric Ton + GST & freight",
        // priceValue: undefined,
      },
      {
        product: "Soya DOC (High Pro)",
        price: "On request",
        unit: "per Metric Ton + GST & freight",
      },
      {
        product: "Soya Crude Oil",
        price: "On request",
        unit: "per 10kg, ex-plant",
      },
      {
        product: "Soya Refined Oil",
        price: "On request",
        unit: "per 10kg, premium grade",
      },
      {
        product: "Soya Fatty Oil",
        price: "On request",
        unit: "per 10kg, industrial grade",
      },
      {
        product: "Soya Acid Oil",
        price: "On request",
        unit: "per 10kg, industrial grade",
      },
      {
        product: "Soya Lecithin",
        price: "On request",
        unit: "per kg, liquid grade",
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
        unit: "per kg, premium quality",
      },
      {
        product: "Chana Dal",
        price: "On request",
        unit: "per kg, super fine",
      },
      {
        product: "Besan Flour",
        price: "On request",
        unit: "per kg, pure chana besan",
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
