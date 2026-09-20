import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import RatesTicker from "@/components/RatesTicker";
import StatsBand from "@/components/StatsBand";
import ServicesShowcase from "@/components/ServicesShowcase";
import WhySachinGold from "@/components/WhySachinGold";
import ProductCard from "@/components/ProductCard";
// SectionHeading retained for other pages; home uses inline headings now
// so the two home sections can sit on distinct eyebrow colors (wheat-dark
// on white, pine on linen) without prop threading.
import CustomerLogos from "@/components/CustomerLogos";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import { getFeaturedProducts } from "@/data/products";
import { hasRealRates } from "@/data/rates";

export const metadata: Metadata = {
  description:
    "Directly sourced, premium-grade bulk agricultural commodities — toor and chana dal, gram flour, Soya DOC, refined oil and lecithin across Maharashtra and Karnataka.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Rates strip FIRST, at the very top — the old site's ticker position
          (its "status bar" under the navbar; here directly under the Hero
          because the navbar is shared chrome). One strip, two states driven
          by one data file:
          - Real prices exist (priceValue set in data/rates.ts) → the
            scrolling ticker, pausable by tap/click, not hover-only.
          - No real prices yet → the static link strip below. The old site
            shipped a ticker showing "₹ --" to production; this site never
            will — a placeholder marquee reads as broken, so the ticker is
            data-gated until numbers land. */}
      {hasRealRates() ? (
        <RatesTicker />
      ) : (
        <Link
          href="/rates"
          className="group block border-b border-ink/10 bg-linen transition-colors hover:bg-[#efeadd]"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            <p className="flex items-center gap-2.5 text-sm text-ink/70">
              <span
                aria-hidden="true"
                className="relative flex h-2 w-2"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pine opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-pine" />
              </span>
              <span className="font-semibold uppercase tracking-widest text-pine">
                Live market rates
              </span>
              <span className="hidden sm:inline">
                — Soya DOC, Soya Refined Oil, Toor Dal, Chana Dal
              </span>
            </p>
            <span className="text-sm font-semibold text-pine transition-transform group-hover:translate-x-0.5">
              View current rates →
            </span>
          </div>
        </Link>
      )}

      <Hero />

      <StatsBand />

      {/* What We Do — the five services as one visual value chain. */}
      <ServicesShowcase />

      {/* The one genuinely dark section — the condensed "Why Choose Us"
          narrative the old site put on its homepage, with the real team
          photograph and the real figures. Gives the page its high-contrast
          beat between two light sections. */}
      <WhySachinGold />

      {/* Real customer logos from the old services page — strong credibility
          signal at zero cost since the assets already existed. */}
      <CustomerLogos />

      <section className="bg-linen">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pine">
            Our Products
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-ink sm:text-4xl">
            What we trade and process
          </h2>
          <p className="mt-4 max-w-xl text-ink/60">
            A cross-section of what moves through our facilities — the full
            catalog lives on each service&apos;s page.
          </p>
          {/* Teaser, not the full catalogue: six items spanning all three
              categories. Twenty cards before the CTA worked against the
              restraint everything else follows — the complete list is on
              each service's page via getProductsByService. */}
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
              Browse all products by service
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials deliberately not built: the old site's
          testimonials.html is unedited template content (no real quotes).
          Building one requires the client to supply 2-3 real buyer quotes
          first — see README, "Testimonials — deliberately not built". */}

      <CTA />
    </>
  );
}
