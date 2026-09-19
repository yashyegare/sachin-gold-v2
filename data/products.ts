import type { Product } from "@/lib/types";

// REAL product list, pulled from each service's own "Traded / Manufactured
// / Extracted Products" catalogue on the live site (not just the About page
// summary — those catalogues listed more distinct products than the About
// page mentioned, e.g. Crude Oil as separate from Refined Oil, and Urad/
// Moong/Jowar Dal alongside Toor/Chana). The trading catalogue is the
// twelve-item list on commodity-trading.html (the _full dal images there
// duplicate the processing products below, so only genuinely new items
// are added here). `service` maps each product to its owning service line
// in data/services.ts so service detail pages show only their own products
// via getProductsByService(). Images are real product photography migrated
// from the old repo via `npm run images`.
export const products: Product[] = [
  // --- Trading: the twelve-item catalogue on commodity-trading.html ---
  {
    name: "Soyabean",
    slug: "soyabean",
    category: "Trading",
    description: "Premium-grade soya, sourced directly from farming networks.",
    image: "/images/products/soyabean.webp",
    service: "commodity-trading",
  },
  {
    name: "Bajra",
    slug: "bajra",
    category: "Trading",
    description: "Bulk pearl millet, quality-checked at multi-tier levels.",
    image: "/images/products/bajra.webp",
    service: "commodity-trading",
  },
  {
    name: "Jowar",
    slug: "jowar",
    category: "Trading",
    description: "Bulk sorghum for food and industrial buyers.",
    image: "/images/products/jowar.webp",
    service: "commodity-trading",
  },
  {
    name: "Corn",
    slug: "corn",
    category: "Trading",
    description: "Bulk maize, scalable volumes for enterprise clients.",
    image: "/images/products/corn.webp",
    service: "commodity-trading",
  },
  {
    name: "Jaggery",
    slug: "jaggery",
    category: "Trading",
    description: "Bulk jaggery, transparent market pricing.",
    image: "/images/products/jaggery.webp",
    service: "commodity-trading",
  },
  {
    name: "Cotton Seed Oil Cake",
    slug: "cotton-seed-oil-cake",
    category: "Trading",
    description: "Bulk cotton seed oil cake for feed and industry.",
    image: "/images/products/cotton-seed-oil-cake.webp",
    service: "commodity-trading",
  },
  {
    name: "Masoor Dal",
    slug: "masoor-dal",
    category: "Trading",
    description: "Whole masoor, direct from the farm gate.",
    image: "/images/products/masoor.webp",
    service: "commodity-trading",
  },
  {
    name: "Tamarind",
    slug: "tamarind",
    category: "Trading",
    description: "Bulk tamarind, sourced across our trading network.",
    image: "/images/products/tamarind.webp",
    service: "commodity-trading",
  },
  {
    name: "Toor Dal",
    slug: "toor-dal",
    category: "Processing",
    description: "Protein-rich, unpolished toor dal processed with precision.",
    image: "/images/products/toor-dal.webp",
    service: "pulses-processing",
  },
  {
    name: "Chana Dal",
    slug: "chana-dal",
    category: "Processing",
    description: "Split chana dal, milled to a consistent, super-fine grade.",
    image: "/images/products/chana-dal.webp",
    service: "pulses-processing",
  },
  {
    name: "Urad Dal",
    slug: "urad-dal",
    category: "Processing",
    description: "Unpolished urad dal, processed for bulk wholesale supply.",
    image: "/images/products/urad-dal.webp",
    service: "pulses-processing",
  },
  {
    name: "Moong Dal",
    slug: "moong-dal",
    category: "Processing",
    description: "Protein-rich moong dal, processed to retain natural essence.",
    image: "/images/products/moong-dal.webp",
    service: "pulses-processing",
  },
  {
    name: "Jowar Dal",
    slug: "jowar-dal",
    category: "Processing",
    description: "Processed jowar, milled for household and industrial buyers.",
    image: "/images/products/jowar-dal.webp",
    service: "pulses-processing",
  },
  {
    name: "Besan / Gram Flour",
    slug: "besan-gram-flour",
    category: "Processing",
    description: "Fine-milled, pure gram flour crafted from high-quality chana dal.",
    image: "/images/products/gram-flour.webp",
    service: "pulses-processing",
  },
  {
    name: "Soya DOC",
    slug: "soya-doc",
    category: "Extraction",
    description: "Normal and high-protein de-oiled cake, balanced for premium feed.",
    image: "/images/products/soya-doc.webp",
    service: "oil-extraction",
  },
  {
    name: "Soya Crude Oil",
    slug: "soya-crude-oil",
    category: "Extraction",
    description: "Ex-plant crude oil, the base stock before refining.",
    image: "/images/products/soya-crude-oil.webp",
    service: "oil-extraction",
  },
  {
    name: "Soya Refined Oil",
    slug: "soya-refined-oil",
    category: "Extraction",
    description: "Ultra-pure, neutral-tasting refined oil for high-smoke-point cooking.",
    image: "/images/products/soya-refined-oil.webp",
    service: "oil-extraction",
  },
  {
    name: "Soya Acid Oil",
    slug: "soya-acid-oil",
    category: "Extraction",
    description: "A versatile industrial byproduct, suited to soap manufacturing and chemicals.",
    image: "/images/products/soya-acid-oil.webp",
    service: "oil-extraction",
  },
  {
    name: "Soya Fatty Oil",
    slug: "soya-fatty-oil",
    category: "Extraction",
    description: "Rich in essential fatty acids, used in cosmetics, paints and industrial formulations.",
    image: "/images/products/soya-fatty-oil.webp",
    service: "oil-extraction",
  },
  {
    name: "Soya Lecithin",
    slug: "soya-lecithin",
    category: "Extraction",
    description: "Premium-grade natural emulsifier for food and pharmaceutical processing.",
    image: "/images/products/soya-lecithin.webp",
    service: "oil-extraction",
  },
];

export function getProductsByService(serviceSlug: string): Product[] {
  return products.filter((product) => product.service === serviceSlug);
}
