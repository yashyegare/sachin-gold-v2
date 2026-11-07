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
  const ux = useTranslations("buyerUx");
  const [query, setQuery] = useState("");
  const categories = [...new Set(products.map((p) => p.category))];
  const [active, setActive] = useState<string | null>(null);

  const visible = products.filter(
    (p) =>
      (!active || p.category === active) &&
      `${p.name} ${p.category}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );

  const chipClass = (selected: boolean) =>
    `min-h-11 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      selected
        ? "border-pine bg-pine text-white"
        : "border-ink/15 bg-white text-ink/70 hover:border-pine/40 hover:text-pine"
    }`;

  return (
    <div data-product-catalogue>
      <label
        className="mb-5 block max-w-md text-sm font-medium text-ink"
        htmlFor="catalogue-search"
      >
        {ux("searchProducts")}
        <input
          id="catalogue-search"
          type="search"
          maxLength={100}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="sg-search mt-2"
        />
      </label>
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

      <div className="mt-5 flex items-center gap-4 text-sm text-ink/70">
        <p role="status">{ux("results", { count: visible.length })}</p>
        {(query || active) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActive(null);
            }}
            className="min-h-11 font-semibold text-pine underline underline-offset-4"
          >
            {ux("reset")}
          </button>
        )}
      </div>
      {visible.length === 0 && (
        <p className="mt-6 border border-ink/10 bg-linen p-5">{ux("empty")}</p>
      )}
      <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => (
          <li key={product.slug} className="h-full">
            <ProductCard
              product={product}
              termsLabel={t("catalogueTermsLink")}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
