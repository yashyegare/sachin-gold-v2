import type { RateGroup } from "@/lib/types";
import { company, siteUrl } from "@/data/company";

export function ratesJsonLd(groups: RateGroup[]) {
  if (!groups.some((g) => g.items.some((i) => i.priceValue !== undefined)))
    return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: groups
      .flatMap((group) => group.items)
      .filter((item) => item.priceValue !== undefined)
      .map((item, ii) => ({
        "@type": "ListItem",
        position: ii + 1,
        item: {
          "@type": "Product",
          name: `${item.product} — ${company.name}`,
          description: `Bulk ${item.product} (${item.unit}) from ${company.legalName}, Udgir, Maharashtra.`,
          brand: { "@type": "Brand", name: company.name },
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: item.priceValue,
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: item.priceValue,
              priceCurrency: "INR",
              referenceQuantity: {
                "@type": "QuantitativeValue",
                value: item.unitKg,
                unitCode: "KGM",
              },
            },
            areaServed: "IN",
            url: `${siteUrl}/rates`,
          },
        },
      })),
  };
}
