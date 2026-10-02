import { ArrowRight } from "lucide-react";
import BrandPhoto from "@/components/BrandPhoto";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/lib/types";

/**
 * Same shape as ServiceCard, for individual products rather than service
 * lines. Renders a neutral linen placeholder — the product's initial, in
 * the display font — until a real product photo is added, the same fallback
 * approach Hero uses for the banner image.
 *
 * Links to the product's own row in its service page's commercial-terms
 * table (#spec-<slug>, see data/specs.ts), so a card is a route to a
 * decision — grade, pack size, MOQ, lead time — rather than a dead end. The
 * whole card is the target; the closing line just makes that legible.
 */
export default function ProductCard({
  product,
  termsLabel,
}: {
  product: Product;
  termsLabel: string;
}) {
  const hasImage = product.image.length > 0;

  return (
    <Link
      href={{
        pathname: `/services/${product.service}`,
        hash: `spec-${product.slug}`,
      }}
      className="group flex h-full flex-col border border-ink/10 transition-all hover:-translate-y-0.5 hover:border-pine hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-linen">
        {hasImage ? (
          <BrandPhoto
            src={product.image}
            alt={product.name}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            imageClassName="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center transition-colors group-hover:bg-[#efeadd]">
            <span className="font-display text-3xl text-pine/30 transition-colors group-hover:text-pine/50">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-pine">
          {product.category}
        </p>
        <p className="mt-1 font-display text-lg text-ink">{product.name}</p>
        <p className="mt-2 text-sm text-ink/60">{product.description}</p>
        {/* mt-auto pins the line to the bottom edge, so a row of uneven
            descriptions still lines its calls to action up. */}
        <p className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-pine">
          {termsLabel}
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform duration-200 [transition-timing-function:var(--ease-brand)] group-hover:translate-x-1"
          />
        </p>
      </div>
    </Link>
  );
}
