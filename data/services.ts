import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    title: "Agro Commodity Trading",
    slug: "commodity-trading",
    shortDescription: "Bulk sourcing and trading of pulses, grains and oilseeds.",
    description:
      "Bulk sourcing and trading of pulses, grains and oilseeds, connecting growers and processors across Maharashtra and Karnataka.",
    image: "/images/services/commodity-trading.jpg",
    href: "/services/commodity-trading",
  },
  {
    title: "Pulses & Gram Flour Unit",
    slug: "pulses-processing",
    shortDescription: "Toor, chana, moong and urad dal processing.",
    description:
      "Processing of toor, chana, moong and urad dal, plus gram flour milling, to consistent quality and grading standards.",
    image: "/images/services/pulses-processing.jpg",
    href: "/services/pulses-processing",
  },
  {
    title: "Oil Seed Extraction & Bulk Soya DOC",
    slug: "oil-extraction",
    shortDescription: "Soya DOC extraction for bulk buyers.",
    description:
      "Oil seed extraction with a focus on bulk Soya DOC (De-Oiled Cake) supply for feed and industrial buyers.",
    image: "/images/services/oil-extraction.jpg",
    href: "/services/oil-extraction",
  },
  {
    title: "Cold Storage & Warehousing",
    slug: "cold-storage",
    shortDescription: "Temperature-controlled storage for bulk commodities.",
    description:
      "Temperature-controlled storage facilities that protect bulk commodities between processing and dispatch.",
    image: "/images/services/cold-storage.jpg",
    href: "/services/cold-storage",
  },
  {
    title: "Logistics & Transportation",
    slug: "logistics",
    shortDescription: "End-to-end freight for bulk agro shipments.",
    description:
      "End-to-end freight coordination for bulk agro shipments, from mill or storage to the buyer's dock.",
    image: "/images/services/logistics.jpg",
    href: "/services/logistics",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
