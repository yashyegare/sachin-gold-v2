import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BrandPhoto from "@/components/BrandPhoto";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/i18n/seo";
import { routing, type Locale } from "@/i18n/routing";
import { getServiceBySlug, services } from "@/data/services";
import { getProductsByService } from "@/data/products";
import { siteUrl } from "@/data/company";

interface Props {
  params: { locale: string; slug: string };
}

// Static params for every locale × service combination — the whole
// service section renders statically in all six languages.
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  const t = await getTranslations({ locale, namespace: "services" });
  const title = t(`items.${service.slug}.title`);
  const description = t(`items.${service.slug}.description`).slice(0, 155);

  return {
    title,
    description,
    alternates: buildAlternates(`/services/${service.slug}`),
    openGraph: { title, description },
  };
}

/**
 * Service detail page — the depth layer a buyer actually lands on from
 * search/WhatsApp, carrying the same visual weight as the rest of the
 * site: hero (PageIntro, real service photo) → stat strip (real figures,
 * translated, optional per service) → photo + description with numbered
 * advantages → products → locations as chips → other services → CTA.
 * Every figure and word traces to the data layer and message catalogs —
 * nothing invented, only re-composed with components the site already
 * uses. Copy renders in the active locale throughout.
 */
export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!routing.locales.includes(locale as Locale)) notFound();

  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const t = await getTranslations("services");
  const products = getProductsByService(service.slug);
  const otherServices = services.filter((s) => s.slug !== service.slug);

  // Phase 7, item 4 — Service JSON-LD. English source-of-truth (data
  // layer) for now; per-locale schema once translations are reviewed.
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    url: `${siteUrl}${service.href}`,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: ["Maharashtra", "Karnataka"].map((name) => ({
      "@type": "State",
      name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* ————— Hero — the shared dark band + real photo treatment, with
          the back-link styled for the dark surface. */}
      <PageIntro
        eyebrow={t("intro.eyebrow")}
        title={t(`items.${service.slug}.title`)}
        description={t(`items.${service.slug}.description`)}
        image={service.image}
      >
        <Link
          href="/services"
          className="inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-wheat-bright"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 6H2M6 2L2 6l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("backToOverview")}
        </Link>
      </PageIntro>

      {/* ————— Stat strip — only when this service has real, traceable
          figures (values locale-neutral, labels translated). Same
          treatment as StatsBand, scoped to this one service. */}
      {t.raw(`stats.${service.slug}`).length > 0 && (
        <section
          className="border-b border-ink/10 bg-white"
          aria-label={t("detail.atAGlance", {
            title: t(`items.${service.slug}.title`),
          })}
        >
          <div
            className={`mx-auto grid max-w-6xl divide-x divide-ink/10 px-6 ${
              t.raw(`stats.${service.slug}`).length === 1
                ? "grid-cols-1"
                : "grid-cols-2"
            }`}
          >
            {t.raw(`stats.${service.slug}`).map(
              (
                stat: { v: string; l: string },
              ) => (
                <div
                  key={stat.l}
                  className="px-4 py-10 text-center first:pl-0 last:pr-0 sm:py-12"
                >
                  <p className="font-display text-3xl tabular-nums text-wheat-dark sm:text-4xl">
                    {stat.v}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-wide text-ink/60">
                    {stat.l}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {/* ————— Overview — real photo one side, full description and
          advantages the other. Advantages render as a numbered flow (the
          homepage's stage device) instead of a plain bullet checklist. */}
      <section className="section-standard mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden border border-ink/10 shadow-[0_18px_44px_-24px_rgba(10,54,32,0.35)]">
              <BrandPhoto
                src={service.image}
                alt=""
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-pine">
                {t("detail.overview")}
              </p>
              <p className="mt-4 leading-relaxed text-ink/70">
                {t(`items.${service.slug}.description`)}
              </p>

              <ol className="mt-8 space-y-5">
                {t.raw(`items.${service.slug}.advantages`).map(
                  (
                    advantage: string,
                    i: number,
                  ) => (
                    <li key={advantage} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-pine/25 bg-linen font-display text-sm text-pine"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="pt-1 text-ink/75">{advantage}</span>
                    </li>
                  ),
                )}
              </ol>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ————— Products — same cards as elsewhere, proper section
          heading treatment. Product names stay Latin in every locale. */}
      {products.length > 0 && (
        <section className="section-standard border-t border-ink/10 bg-linen/40">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow={t("detail.productsEyebrow")}
                title={t("detail.productsTitle")}
              />
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Reveal key={product.slug}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ————— Locations — chips with a pin icon read as "operational
          network"; translated short form. */}
      <section className="section-standard border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow={t("detail.networkEyebrow")}
              title={t("detail.networkTitle")}
            />
          </Reveal>
          <ul className="mt-8 flex flex-wrap gap-3">
            {t.raw(`items.${service.slug}.locations`).map(
              (
                location: string,
              ) => (
                <li
                  key={location}
                  className="flex items-center gap-2 rounded-full border border-ink/10 bg-linen px-4 py-2 text-sm text-ink/75"
                >
                  <MapPin
                    size={14}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="flex-shrink-0 text-pine"
                  />
                  <span>{location}</span>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* ————— Other services — keeps a buyer exploring instead of
          dead-ending on one page; the same ServiceCard grid. */}
      {otherServices.length > 0 && (
        <section className="section-standard border-t border-ink/10 bg-linen/40">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <SectionHeading
                eyebrow={t("detail.othersEyebrow")}
                title={t("detail.othersTitle")}
              />
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {otherServices.map((s) => (
                <Reveal key={s.slug}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA
        title={t("detail.ctaTitle", {
          service: t(`items.${service.slug}.title`).toLowerCase(),
        })}
        description={t("detail.ctaDescription")}
      />
    </>
  );
}
