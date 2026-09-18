import type { Product } from "@/lib/types";

// REAL product list and descriptions, pulled from the live site's About
// page ("Straight from the Soil to Your Storefront" section) — not
// invented. `service` maps each product to its owning service line in
// data/services.ts so service detail pages show only their own products.
// `image` is empty until real product photos are migrated (npm run
// images); ProductCard shows the linen-initial placeholder until then.
export const products: Product[] = [
  {
    name: "Raw Agro Commodities",
    slug: "raw-agro-commodities",
    category: "Trading",
    description:
      "Directly sourced, premium-grade bulk agricultural commodities.",
    image: "",
    service: "commodity-trading",
  },
  {
    name: "Toor / Chana Dal",
    slug: "toor-chana-dal",
    category: "Processing",
    description:
      "Protein-rich, unpolished split pulses processed with precision.",
    image: "",
    service: "pulses-processing",
  },
  {
    name: "Besan / Gram Flour",
    slug: "besan-gram-flour",
    category: "Processing",
    description:
      "Fine-milled, pure gram flour crafted from high-quality chana dal.",
    image: "",
    service: "pulses-processing",
  },
  {
    name: "High-Protein Soya DOC",
    slug: "soya-doc",
    category: "Extraction",
    description:
      "High-protein de-oiled cake, nutritionally balanced for premium feed.",
    image: "",
    service: "oil-extraction",
  },
  {
    name: "Soya Refined Oil",
    slug: "soya-refined-oil",
    category: "Extraction",
    description:
      "Ultra-pure, heart-healthy refined oil for high-smoke-point cooking.",
    image: "",
    service: "oil-extraction",
  },
  {
    name: "Soya Acid Oil",
    slug: "soya-acid-oil",
    category: "Extraction",
    description:
      "A versatile industrial byproduct, refined for high-efficiency chemical use.",
    image: "",
    service: "oil-extraction",
  },
  {
    name: "Soya Lecithin",
    slug: "soya-lecithin",
    category: "Extraction",
    description:
      "Premium-grade natural emulsifier for food and pharmaceutical processing.",
    image: "",
    service: "oil-extraction",
  },
  {
    name: "Soya Fatty Oil",
    slug: "soya-fatty-oil",
    category: "Extraction",
    description:
      "Rich in essential fatty acids, optimized for heavy industrial processing.",
    image: "",
    service: "oil-extraction",
  },
];

export function getProductsByService(serviceSlug: string): Product[] {
  return products.filter((product) => product.service === serviceSlug);
}
