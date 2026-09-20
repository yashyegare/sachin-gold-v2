import type { HeroContent, HeroSlide } from "@/lib/types";

// Home hero copy. Lives here (not in the component) so copy edits never
// touch Hero.tsx — same pattern as services/rates/company.
export const homeHero: HeroContent = {
  // Live-site capture: about.html publishes "Since 1969" — the client's own
  // claim, still worth an explicit confirmation in Phase 9.
  eyebrow: "Bulk Agro Commodities, Since 1969",
  headline: "Trusted trading and processing for India's agro commodities",
  subheadline:
    "From bulk sourcing and pulses processing to oil extraction, cold storage and logistics — Sachin Gold moves commodities from field to buyer across Maharashtra and Karnataka, with consistency you can plan around.",
  primaryCta: { label: "Explore Our Services", href: "/services" },
  secondaryCta: { label: "Today's Rates", href: "/rates" },
  // Real photo, migrated from the old repo's hero carousel
  // (banner_new_img1.jpg) via npm run images.
  image: "/images/hero/facility.webp",
};

// The carousel: the old site rotated five background images behind its
// headline. This rebuild keeps the four strongest, most on-brand frames,
// each paired with its own real copy from the old carousel (verbatim,
// lightly trimmed). The first slide is the facility shot, which doubles
// as the standalone-hero image above via next/image priority.
export const heroSlides: HeroSlide[] = [
  {
    image: "/images/hero/facility.webp",
    alt: "Sachin Gold processing facility at dusk",
    eyebrow: "Bulk Agro Commodities, Since 1969",
    // The old site's own hero line — more confident than our literal
    // rewrite of it. Kept verbatim in substance; confirmed in Phase 9.
    headline: "Your trusted partner in bulk agro commodity trading",
    subheadline:
      "An unwavering commitment to quality, innovation and customer satisfaction — from bulk sourcing and pulses processing to oil extraction, cold storage and logistics across Maharashtra and Karnataka.",
  },
  {
    image: "/images/hero/trading.webp",
    alt: "Agro commodity trading operations",
    eyebrow: "Commodity Trading",
    headline: "Straight from the farm gate, quality-checked at every tier",
    subheadline:
      "Directly sourced, premium-grade bulk agricultural commodities — quality-checked at every tier before they enter our supply chain.",
  },
  {
    image: "/images/hero/extraction.webp",
    alt: "Oil seed extraction plant",
    eyebrow: "Oil Seed Extraction",
    headline: "High-efficiency soya extraction & refining",
    subheadline:
      "High-protein Soya DOC, refined oils and lecithin — engineered for feed, food and industrial buyers alike.",
  },
  {
    image: "/images/hero/warehousing.webp",
    alt: "Bulk warehousing infrastructure",
    eyebrow: "Cold Storage & Warehousing",
    headline: "Strategically designed warehouses for bulk storage",
    subheadline:
      "We help farmers, suppliers, exporters and retailers minimize post-harvest losses and keep goods in optimal condition.",
  },
  {
    image: "/images/hero/logistics.webp",
    alt: "Logistics fleet in transit",
    eyebrow: "Logistics",
    headline: "Reliable transportation, delivered on schedule",
    subheadline:
      "A dedicated fleet and an expansive network reaching 1,000+ retail stores and enterprise clients.",
  },
];
