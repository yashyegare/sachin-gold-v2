import type { Customer } from "@/lib/types";

// Real customers whose logos appear on the old services.html page, with
// names taken from that page's own captions ("Trusted by leading brands
// across the industry"). Zero invented logos, zero borrowed ones.
//
// Asset note: the original files varied wildly in quality — some were
// clean transparent logos, others were flattened screenshots with an
// opaque background or, in one case, a whole marketing banner. Cleaned
// up in place (background removed, cropped to just the mark) rather
// than replaced, so these are still the client's real, original logos —
// just isolated properly. width/height below are chosen display sizes
// (not the source files' native pixel size) picked so very different
// aspect ratios — ITC's near-square mark vs. Sresta's wide wordmark —
// read as similar visual weight side by side, not just similar height.
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
  // "Tata Consumer" is deliberately left out for now — the only source
  // file we have is a flattened banner with an opaque blue background
  // (not a real logo asset), and unlike the four above it can't be
  // cleaned up by removing a plain background: the blue fill is baked
  // into the image itself. Showing it as-is would look like a broken
  // gray box next to four clean logos. Restore it once a proper
  // transparent Tata Consumer Products logo file is available — just
  // uncomment below and add real width/height at that file's ratio.
  // { name: "Tata Consumer", logo: "/images/customers/tata.webp", width: 0, height: 0 },
];
