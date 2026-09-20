import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { whatsappLink } from "@/lib/whatsapp";
import { company } from "@/data/company";
import BrandPhoto from "@/components/BrandPhoto";
import type { Product } from "@/lib/types";

/**
 * Product card for service detail pages — the same visual as ProductCard
 * but with a per-product WhatsApp micro-CTA (the old oil-extraction page's
 * "Request Bulk Quote" pattern, prefilled with the product name so the
 * enquiry needs zero typing). Product names stay Latin in every locale —
 * that's how the trade actually talks.
 */
export default function ProductEnquiryCard({ product }: { product: Product }) {
  const t = useTranslations("rates");
  const hasImage = product.image.length > 0;

  return (
    <div className="group flex flex-col border border-ink/10 bg-white transition-all hover:-translate-y-0.5 hover:border-pine hover:shadow-[0_10px_28px_-14px_rgba(22,35,28,0.25)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-linen">
        {hasImage ? (
          <BrandPhoto
            src={product.image}
            alt={product.name}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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

        {/* Per-product enquiry — mt-auto pins it to the card's bottom edge
            so buttons align across a row of uneven-height cards. */}
        <a
          href={whatsappLink(
            company.whatsapp,
            `Hi Sachin Gold, I am interested in bulk rates for ${product.name}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex min-h-[44px] items-center gap-1.5 pt-3 text-sm font-semibold text-whatsapp transition-colors hover:text-pine-deep"
          aria-label={t("enquireAria", { product: product.name })}
        >
          {t("enquire")}
          <ArrowRight size={13} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
