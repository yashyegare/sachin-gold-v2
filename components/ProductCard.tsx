import Image from "next/image";
import type { Product } from "@/lib/types";

/**
 * Same shape as ServiceCard, for individual products rather than service
 * lines. Renders a neutral linen placeholder — the product's initial, in
 * the display font — until a real product photo is added, the same
 * fallback approach Hero uses for the banner image.
 *
 * Not a Link: products have no detail pages in V2a — they render inside
 * their service's page and the home page grid.
 */
export default function ProductCard({ product }: { product: Product }) {
  const hasImage = product.image.length > 0;

  return (
    <div className="group border border-ink/10 transition-all hover:-translate-y-0.5 hover:border-pine hover:shadow-[0_10px_28px_-14px_rgba(22,35,28,0.25)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-linen">
        {hasImage ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center transition-colors group-hover:bg-[#efeadd]">
            <span className="font-display text-3xl text-pine/30 transition-colors group-hover:text-pine/50">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-pine">
          {product.category}
        </p>
        <p className="mt-1 font-display text-lg text-ink">{product.name}</p>
        <p className="mt-2 text-sm text-ink/60">{product.description}</p>
      </div>
    </div>
  );
}
