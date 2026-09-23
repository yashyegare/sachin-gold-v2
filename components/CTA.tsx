import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";

interface CTAProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * The repeated "get in touch" band. Dark pine background so it reads as
 * a clear stopping point at the end of a page, with the same one-CTA
 * restraint as the Hero — WhatsApp and phone as lighter-weight second
 * paths, not competing buttons. All copy translated; callers can override
 * title/description per page (translated by the caller).
 */
export default async function CTA({
  title,
  description,
  ctaLabel,
  ctaHref = "/contact",
}: CTAProps) {
  const t = await getTranslations("home.cta");
  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("description");
  const resolvedCtaLabel = ctaLabel ?? t("button");

  return (
    <section className="relative bg-pine-deep grain-dark">
      <div className="section-airy mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-display-md text-white">
            {resolvedTitle}
          </h2>
          <p className="mt-2 max-w-md text-white/70">{resolvedDescription}</p>
        </div>

        <div className="flex flex-shrink-0 flex-wrap items-center gap-6">
          <a
            href={whatsappLink(
              company.whatsapp,
              "Hi Sachin Gold, I'd like to enquire about bulk rates.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center text-sm text-white/80 hover:text-white"
          >
            {t("whatsapp")}
          </a>
          <a
            href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
            className="inline-flex min-h-[44px] items-center text-sm text-white/80 hover:text-white"
          >
            {company.phone}
          </a>
          <Link
            href={ctaHref}
            className="rounded-sm bg-wheat px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-wheat/90"
          >
            {resolvedCtaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
