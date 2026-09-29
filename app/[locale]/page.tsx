import type { Metadata } from "next";
import Hero from "@/components/Hero";
import RatesStrip from "@/components/RatesStrip";
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
      {/* Rates strip FIRST, at the very top — the old site's ticker
          position, now shared with Services and Contact via RatesStrip. */}
      <RatesStrip />

      <Hero />

      <StatsBand />

      {/* What We Do — the five services as one visual value chain. */}
      <ServicesShowcase />

      {/* The pacing break — one full-width, photo-free statement between
          the value chain and the dark Why band. The company's own
          subheadline (translated in all six locales), re-set large and
          given room. There is no other section like it on the site. */}
      <section className="bg-linen">
        <div className="section-airy mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <p
              aria-hidden="true"
              className="font-display text-4xl leading-none text-wheat"
            >
              &ldquo;
            </p>
            <blockquote className="mt-2 font-display text-display-lg leading-snug text-ink">
              {t("statement.quote")}
            </blockquote>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-wheat-dark">
              Sachin Gold, since 1969
            </p>
          </Reveal>
          <div
            aria-hidden="true"
            className="mx-auto mt-10 h-px w-16 bg-wheat"
          />
        </div>
      </section>

      {/* The one genuinely dark section — the condensed "Why Choose Us"
          narrative with the real team photograph and the real figures. */}
      <WhySachinGold />

      {/* Real customer logos from the old services page — credibility at
          zero cost since the assets already existed. */}
      <CustomerLogos />

      <section className="bg-linen">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pine">
              {t("products.eyebrow")}
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-display-lg text-ink">
              {t("products.title")}
            </h2>
            <p className="mt-4 max-w-xl text-ink/60">
              {t("products.subtitle")}
            </p>
          </Reveal>
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
