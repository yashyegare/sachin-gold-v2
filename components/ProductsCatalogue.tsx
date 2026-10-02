"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

/**
 * The full 20-product catalogue with a lightweight category filter —
 * chips toggle visibility client-side, no backend, no routing. The whole
 * grid is server-rendered first (SEO/no-JS see every product); the
 * client layer only hides/shows. Chips derive from the data (categories
 * the products actually carry, with live counts), so catalogue growth
 * extends the filter automatically.
 *
 * Category names render as-is (the data layer's English trade terms —
 * same convention as ProductCard's category line and product names). The
 * filter's own chrome — the "All" chip and the group label — is translated.
 */
export default function ProductsCatalogue({
  products,
}: {
  products: Product[];
}) {
  const t = useTranslations("services");
  const categories = [...new Set(products.map((p) => p.category))];
  const [active, setActive] = useState<string | null>(null);

  const visible = active
    ? products.filter((p) => p.category === active)
    : products;

  const chipClass = (selected: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      selected
        ? "border-pine bg-pine text-white"
        : "border-ink/15 bg-white text-ink/70 hover:border-pine/40 hover:text-pine"
    }`;

  return (
    <div>
      <div
        role="group"
        aria-label={t("catalogueFilterAria")}
        className="flex flex-wrap items-center gap-2"
      >
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={chipClass(active === null)}
        >
          {t("catalogueAll")} · {products.length}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            aria-pressed={active === category}
            className={chipClass(active === category)}
          >
            {category} ·{" "}
            {products.filter((p) => p.category === category).length}
          </button>
        ))}
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => (
          <li key={product.slug} className="h-full">
            <ProductCard product={product} termsLabel={t("catalogueTermsLink")} />
          </li>
        ))}
      </ul>
    </div>
  );
}
