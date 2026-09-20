import type { Metadata } from "next";
import Hero from "@/components/Hero";
import RatesTicker from "@/components/RatesTicker";
import StatsBand from "@/components/StatsBand";
import ServicesShowcase from "@/components/ServicesShowcase";
import WhySachinGold from "@/components/WhySachinGold";
import ProductCard from "@/components/ProductCard";
import CustomerLogos from "@/components/CustomerLogos";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/i18n/seo";
import { getFeaturedProducts } from "@/data/products";
import { hasRealRates } from "@/data/rates";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: buildAlternates("/"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <>
      {/* Rates strip FIRST, at the very top — the old site's ticker position.
          One strip, two states driven by one data file:
          - Real prices exist (priceValue set in data/rates.ts) → the
            scrolling ticker, pausable by tap/click, not hover-only.
          - No real prices yet → the static link strip below. The old site
            shipped a ticker showing "₹ --" to production; this site never
            will. */}
      {hasRealRates() ? (
        <RatesTicker />
      ) : (
        <Link
          href="/rates"
          className="group block border-b border-ink/10 bg-linen transition-colors hover:bg-[#efeadd]"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <p className="flex items-center gap-2.5 text-sm text-ink/70">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pine opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pine" />
              </span>
              <span className="font-semibold uppercase tracking-widest text-pine">
                {t("ratesStrip.live")}
              </span>
              <span className="hidden sm:inline">{t("ratesStrip.items")}</span>
            </p>
            <span className="text-sm font-semibold text-pine transition-transform group-hover:translate-x-0.5">
              {t("ratesStrip.view")} →
            </span>
          </div>
        </Link>
      )}

      <Hero />

      <StatsBand />

      {/* What We Do — the five services as one visual value chain. */}
      <ServicesShowcase />

      {/* The one genuinely dark section — the condensed "Why Choose Us"
          narrative with the real team photograph and the real figures. */}
      <WhySachinGold />

      {/* Real customer logos from the old services page — credibility at
          zero cost since the assets already existed. */}
      <CustomerLogos />

      <section className="bg-linen">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pine">
            {t("products.eyebrow")}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-ink sm:text-4xl">
            {t("products.title")}
          </h2>
          <p className="mt-4 max-w-xl text-ink/60">
            {t("products.subtitle")}
          </p>
          {/* Teaser, not the full catalogue: six items spanning all three
              categories; the complete list lives on each service's page. */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getFeaturedProducts().map((product, i) => (
              <Reveal key={product.slug}>
                <div style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
                  <ProductCard product={product} />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-sm border border-pine px-6 py-3 text-sm font-medium text-pine transition-colors hover:bg-pine hover:text-white"
            >
              {t("products.browseAll")}
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials deliberately not built: the old site's
          testimonials.html is unedited template content (no real quotes).
          The one genuine quote lives on the About page. */}

      <CTA />
    </>
  );
}
