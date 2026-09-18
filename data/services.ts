import type { Service } from "@/lib/types";

// Real copy, pulled directly from each service's own page on the live
// site — not invented. Confirm figures like "550 tonnes/day" and
// "1,000+ retail stores" with the client before launch (Phase 9).
export const services: Service[] = [
  {
    title: "Agro Commodity Trading",
    slug: "commodity-trading",
    shortDescription:
      "Bulk sourcing and trading of pulses, grains and oilseeds.",
    description:
      "At Sachin Gold, we specialize in the procurement and supply of premium-grade bulk agro commodities. Our deep-rooted relationships with farming communities across Maharashtra and Karnataka allow us to source the finest raw materials directly from the field. We ensure that every grain meets rigorous international quality standards before it enters our supply chain. Our trading portfolio is tailored to meet the massive demands of large-scale retailers, food processors, and international exporters.",
    advantages: [
      "Direct farm-to-business sourcing network",
      "Uncompromising multi-tier quality checks",
      "Scalable volume handling for enterprise clients",
      "Transparent and competitive market pricing",
    ],
    locations: [
      "Udgir, Maharashtra — Headquarters, Sourcing, Trading, Processing & Storage",
      "Latur, Maharashtra — Sourcing, Trading, Processing & Storage",
      "Solapur, Maharashtra — Sourcing, Trading, Processing & Storage",
      "Bhalki, Karnataka — Sourcing & Trading",
      "Bidar, Karnataka — Sourcing & Trading",
    ],
    image: "/images/services/commodity-trading.jpg",
    href: "/services/commodity-trading",
  },
  {
    title: "Pulses & Gram Flour Unit",
    slug: "pulses-processing",
    shortDescription: "Toor, chana and gram flour, processed and milled.",
    description:
      "As one of the leading players in processed pulses, Sachin Gold operates a highly advanced facility with a combined capacity of 550 tonnes per day. By merging traditional sun-drying methods with sophisticated Buhler machinery, we ensure unmatched purity and consistency. Our flagship products, including protein-rich, unpolished Toor and Chana Dal, are processed with absolute precision to retain their natural essence. Our Besan (Gram Flour) is finely milled from premium chana dal, ensuring a pure, aromatic, additive-free product for household and industrial use.",
    advantages: [
      "550 tonnes/day — high-capacity production ensuring uninterrupted supply",
      "Buhler technology — world-class automated machinery for maximum hygiene",
      "Unpolished pulses — 100% natural processing, free from artificial colors",
      "Premium besan — fine-milled purity for culinary and industrial use",
    ],
    locations: [
      "Udgir, Maharashtra — Headquarters & Main Processing Unit",
      "Latur, Maharashtra",
      "Solapur, Maharashtra",
    ],
    image: "/images/services/pulses-processing.jpg",
    href: "/services/pulses-processing",
  },
  {
    title: "Oil Seed Extraction & Bulk Soya DOC",
    slug: "oil-extraction",
    shortDescription:
      "Soya DOC, refined oils and derivatives for feed and industry.",
    description:
      "Our advanced extraction facility transforms premium Soya beans into high-yield, top-tier commodities, carefully preserving their peak nutritional and industrial value. Using advanced solvent extraction and refining processes, we ensure our products meet the requirements of both the food processing and animal feed industries.",
    advantages: [
      "Soya DOC (Normal & High Pro) — high-protein, balanced de-oiled cake for animal and poultry feed",
      "Soya Refined Oil — ultra-pure, neutral-tasting oil for high-smoke-point cooking",
      "Soya Acid Oil — industrial byproduct suited to soap manufacturing and chemicals",
      "Soya Fatty Oil — used in cosmetics, paints and specialized industrial formulations",
      "Soya Lecithin — natural emulsifier for food processing and pharmaceuticals",
    ],
    locations: ["Udgir, Maharashtra - 413517"],
    image: "/images/services/oil-extraction.jpg",
    href: "/services/oil-extraction",
  },
  {
    title: "Cold Storage & Warehousing",
    slug: "cold-storage",
    shortDescription:
      "Dry warehousing and climate-controlled cold storage.",
    description:
      "Agriculture is highly time-sensitive. At Sachin Gold, we offer a dual-infrastructure approach: expansive dry warehousing for bulk grains and pulses, alongside cold storage units for temperature-sensitive agro-commodities. Whether protecting raw seeds from moisture, housing large volumes of goods, or extending the shelf life of perishables, our facilities are engineered to minimize post-harvest losses and maintain peak market value for farmers, suppliers and exporters.",
    advantages: [
      "Dry warehousing — high-volume, moisture-controlled environments for bulk grains and pulses",
      "Cold storage units — precision temperature and humidity management for perishables",
      "Scientific pest management — strict hygiene, ventilation and fumigation protocols",
    ],
    locations: [
      "Solapur, Maharashtra",
      "Latur, Maharashtra",
      "Udgir, Maharashtra",
    ],
    image: "/images/services/cold-storage.jpg",
    href: "/services/cold-storage",
  },
  {
    title: "Logistics & Transportation",
    slug: "logistics",
    shortDescription: "Dedicated fleet and freight for bulk agro shipments.",
    description:
      "A robust supply chain is the backbone of the agro-industry. At Sachin Gold, we provide reliable, efficient transportation services to ensure that bulk commodities, processed pulses, and refined oils reach their destinations seamlessly. With our own dedicated fleet of vehicles and an expansive logistics network, we serve over 1,000+ retail stores and enterprise clients, with every product handled with care and delivered on schedule.",
    advantages: [
      "Dedicated fleet — company-owned vehicles ensuring priority dispatch and handling",
      "Safe handling — specialized transport for sensitive commodities like edible oils and raw grains",
      "Efficient routing — optimized networks to minimize transit times and maintain freshness",
    ],
    locations: ["Across Maharashtra & Karnataka"],
    image: "/images/services/logistics.jpg",
    href: "/services/logistics",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
