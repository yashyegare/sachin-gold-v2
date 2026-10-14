import type { Customer } from "@/lib/types";

// Real customers, zero invented logos, zero borrowed ones. The first four
// come from the old services.html page's own logo row ("Trusted by leading
// brands across the industry"); the six added in October 2026 were pulled
// from each customer's own website header, so every mark is the artwork
// that company publishes for itself.
//
// Asset note: source quality varied wildly — clean transparent logos, a
// flattened screenshot, one marketing banner. Each was cleaned in place
// (background removed, cropped to just the mark) rather than replaced, so
// these stay the clients' real logos, only isolated properly. SKM's lockup
// sat on a solid yellow banner field: the yellow and the banner's swoosh
// were removed, leaving their red star + wordmark on transparency.
//
// width/height below are chosen display sizes (not the source files'
// native pixels) picked so very different aspect ratios — CP's near-square
// roundel vs. Sneha's wide wordmark — read as similar visual weight side
// by side, not just similar height.
export const customers: Customer[] = [
  { name: "ITC", logo: "/images/customers/itc.webp", width: 84, height: 88 },
  {
    name: "Adani Wilmar",
    logo: "/images/customers/adani.webp",
    width: 102,
    height: 58,
  },
  { name: "ADM", logo: "/images/customers/adm.webp", width: 85, height: 100 },
  {
    name: "Sresta",
    logo: "/images/customers/sresta.webp",
    width: 130,
    height: 42,
  },
  {
    name: "Sneha Group",
    logo: "/images/customers/sneha.webp",
    width: 141,
    height: 32,
  },
  {
    name: "Suguna Foods",
    logo: "/images/customers/suguna.webp",
    width: 75,
    height: 52,
  },
  { name: "DMart", logo: "/images/customers/dmart.webp", width: 131, height: 32 },
  { name: "CP Foods", logo: "/images/customers/cp.webp", width: 49, height: 48 },
  {
    name: "SKM Porna Foods",
    logo: "/images/customers/skm.webp",
    width: 113,
    height: 30,
  },
  { name: "SRS Quails", logo: "/images/customers/srs.webp", width: 48, height: 48 },
  // "Tata Consumer" is deliberately left out — the only source file we
  // have is a flattened banner with an opaque blue background baked into
  // the image itself, which no cleanup can isolate. Showing it as-is
  // would look like a broken gray box next to ten clean logos. Restore it
  // once a proper transparent Tata Consumer Products logo file exists.
  // { name: "Tata Consumer", logo: "/images/customers/tata.webp", width: 0, height: 0 },
];
