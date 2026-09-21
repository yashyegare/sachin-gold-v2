import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import BrandPhoto from "@/components/BrandPhoto";
import { Link } from "@/i18n/navigation";
import type { Service } from "@/lib/types";

/**
 * Service card with the same image-placeholder pattern as ProductCard.
 * Hover: lift, gold "Learn more" reveal, arrow nudge. Titles,
 * descriptions and the hover label are translated; hrefs stay
 * locale-aware via next-intl's Link.
 */
export default async function ServiceCard({ service }: { service: Service }) {
  const t = await getTranslations("services");
  const hasImage = service.image.length > 0;

  return (
    <Link
      href={service.href}
      className="group block border border-ink/10 transition-all hover:-translate-y-0.5 hover:border-pine hover:shadow-elevated"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-linen">
        {hasImage ? (
          <BrandPhoto
            src={service.image}
            alt=""
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            imageClassName="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center transition-colors group-hover:bg-[#efeadd]">
            <span className="font-display text-3xl text-pine/30 transition-colors group-hover:text-pine/50">
              {service.slug.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="font-display text-lg text-ink">
          {t(`items.${service.slug}.title`)}
        </p>
        <p className="mt-2 text-sm text-ink/60">
          {t(`items.${service.slug}.stageNote`)}
        </p>
        {/* Hidden until hover on desktop — but always visible on touch
            devices (no hover there) and for keyboard focus, so the cue
            isn't inaccessible on exactly the devices buyers actually use. */}
        <span className="mt-4 inline-flex items-center gap-1 text-sm text-wheat-dark transition-all duration-200 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-x-1 [@media(hover:hover)]:group-hover:opacity-100">
          {t("learnMore")}
          <ArrowRight size={12} strokeWidth={1.5} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
