/**
 * The About page's photo gallery — every real photo the site owns, in
 * one browsable place. Captions are editorial (see the per-photo notes);
 * alt text matches what the photo actually shows. Photos already in use
 * elsewhere on the site are reused deliberately — the gallery is the
 * index, not a duplicate library.
 */
export interface GalleryPhoto {
  src: string;
  /** What the photo actually shows (screen readers, lightbox). */
  alt: string;
  /** Editorial one-liner shown under the photo in the lightbox. */
  caption: string;
  /** Which real service line this photo belongs to — the gallery's
   *  filter chips come from this (truthful labels, translated). */
  service:
    | "trading"
    | "processing"
    | "extraction"
    | "storage"
    | "logistics"
    | "team";
}

export const galleryPhotos: GalleryPhoto[] = [
  // ————— The plant and its people (no filter required to find these) —————
  {
    src: "/images/home/aerial-plant.webp",
    alt: "Aerial view of the Sachin Gold processing plant in Udgir",
    caption:
      "The Udgir plant from above — sourcing, processing, extraction, storage and dispatch on one campus.",
    service: "trading",
  },
  {
    src: "/images/home/team-packaging.webp",
    alt: "The Sachin Gold team with sacks of packaged product",
    caption: "The team behind every consignment — and our own packaging.",
    service: "team",
  },
  {
    src: "/images/home/processing-interior.webp",
    alt: "Interior of the processing hall with Buhler milling machinery",
    caption:
      "Inside the processing hall — 550 tonnes/day on Buhler machinery, unpolished and additive-free.",
    service: "processing",
  },
  {
    src: "/images/home/cold-storage-branded.webp",
    alt: "Branded cold storage facility exterior",
    caption:
      "Cold storage and dry warehousing — engineered to cut post-harvest losses.",
    service: "storage",
  },

  // ————— Hero photography: the facility and the five-stage chain —————
  {
    src: "/images/hero/facility.webp",
    alt: "Sachin Gold facility exterior",
    caption: "The facility — bulk agro commodities since 1969.",
    service: "trading",
  },
  {
    src: "/images/hero/trading.webp",
    alt: "Grain at the farm gate being weighed for trading",
    caption: "Sourced at the farm gate, quality-checked before it moves.",
    service: "trading",
  },
  {
    src: "/images/hero/extraction.webp",
    alt: "Oil seed extraction plant machinery",
    caption:
      "Solvent extraction and refining — Soya DOC through lecithin, all from one line.",
    service: "extraction",
  },
  {
    src: "/images/hero/warehousing.webp",
    alt: "Stacked bulk commodity sacks inside the warehouse",
    caption:
      "High-volume, moisture-controlled warehousing for bulk grains and pulses.",
    service: "storage",
  },
  {
    src: "/images/hero/logistics.webp",
    alt: "Sachin Gold truck loaded for dispatch",
    caption:
      "Our own fleet — priority dispatch to 1,000+ retail stores and enterprise clients.",
    service: "logistics",
  },

  // ————— Product photography: what actually moves through the chain —————
  {
    src: "/images/products/soya-doc.webp",
    alt: "Soya de-oiled cake",
    caption: "Soya DOC (Normal & High Pro) — high-protein de-oiled cake.",
    service: "extraction",
  },
  {
    src: "/images/products/soyabean.webp",
    alt: "Soyabean raw commodity",
    caption: "Premium soya bean — where the extraction line begins.",
    service: "extraction",
  },
  {
    src: "/images/products/toor-dal.webp",
    alt: "Toor dal processed pulses",
    caption: "Toor dal — protein-rich, unpolished, 100% natural.",
    service: "processing",
  },
  {
    src: "/images/products/chana-dal.webp",
    alt: "Chana dal processed pulses",
    caption: "Chana dal — super fine grade, milled in-house.",
    service: "processing",
  },
  {
    src: "/images/products/gram-flour.webp",
    alt: "Besan gram flour",
    caption: "Besan — finely milled from premium chana dal, additive-free.",
    service: "processing",
  },
  {
    src: "/images/products/jowar-dal.webp",
    alt: "Jowar dal processed pulses",
    caption: "Jowar — one of the pulses and grains we trade in bulk.",
    service: "trading",
  },
  {
    src: "/images/products/corn.webp",
    alt: "Maize corn bulk commodity",
    caption: "Maize — part of the bulk commodity trading portfolio.",
    service: "trading",
  },
  {
    src: "/images/products/soya-refined-oil.webp",
    alt: "Soya refined oil",
    caption: "Soya refined oil — ultra-pure, high-smoke-point.",
    service: "extraction",
  },
  {
    src: "/images/products/soya-lecithin.webp",
    alt: "Soya lecithin",
    caption: "Soya lecithin — natural emulsifier for food and pharma.",
    service: "extraction",
  },
];

/** The filter chips, in display order — derived, not hardcoded, so a
 *  photo added with a new service automatically extends the list. */
export const galleryServices: GalleryPhoto["service"][] = [
  ...new Set(galleryPhotos.map((p) => p.service)),
];
