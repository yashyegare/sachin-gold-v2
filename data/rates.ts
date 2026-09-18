import type { RateGroup } from "@/lib/types";

// Real category structure and units, pulled from the live rate.html —
// the live site itself still shows placeholder "₹ 00,000" values for
// every row, so real prices have never been published. Every price here
// is "On request" until the client supplies real numbers (never invented,
// never "TODO" — a literal TODO string would render on the page).
// Manual entry to start; API/DB in V2b.
export const rateGroups: RateGroup[] = [
  {
    title: "Soya Derivatives",
    items: [
      { product: "Soya DOC (Normal)", price: "On request", unit: "per Metric Ton + GST & freight" },
      { product: "Soya DOC (High Pro)", price: "On request", unit: "per Metric Ton + GST & freight" },
      { product: "Soya Crude Oil", price: "On request", unit: "per 10kg, ex-plant" },
      { product: "Soya Refined Oil", price: "On request", unit: "per 10kg, premium grade" },
      { product: "Soya Fatty Oil", price: "On request", unit: "per 10kg, industrial grade" },
      { product: "Soya Acid Oil", price: "On request", unit: "per 10kg, industrial grade" },
      { product: "Soya Lecithin", price: "On request", unit: "per kg, liquid grade" },
    ],
  },
  {
    title: "Dals & Flour",
    items: [
      { product: "Toor Dal", price: "On request", unit: "per kg, premium quality" },
      { product: "Chana Dal", price: "On request", unit: "per kg, super fine" },
      { product: "Besan Flour", price: "On request", unit: "per kg, pure chana besan" },
    ],
  },
];

// null hides the "Last updated" line entirely — a stale date reads as worse
// than no date. Set to a real date string once the client confirms prices.
export const ratesLastUpdated: string | null = null;
