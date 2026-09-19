import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import RatesTicker from "@/components/RatesTicker";
import StatsBand from "@/components/StatsBand";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import ProductCard from "@/components/ProductCard";
import CustomerLogos from "@/components/CustomerLogos";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { hasRealRates } from "@/data/rates";

export const metadata: Metadata = {
  description:
    "Directly sourced, premium-grade bulk agricultural commodities — toor and chana dal, gram flour, Soya DOC, refined oil and lecithin across Maharashtra and Karnataka.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Rates strip, two states driven by one data file:
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

      <StatsBand />

      {/* (Fallback strip sits above the StatsBand, directly under the Hero,
          matching the old site's ticker position.) */}
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

      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow="What We Do"
          title="Bulk agro commodities, handled end to end"
          description="From sourcing through to the buyer's dock — trading, processing, storage and logistics under one roof."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} className={i > 0 ? "" : ""}>
              <div style={{ transitionDelay: `${i * 60}ms` }}>
                <ServiceCard service={service} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Real customer logos from the old services page — strong credibility
          signal at zero cost since the assets already existed. */}
      <CustomerLogos />

      <section className="bg-linen">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="Our Products"
            title="What we trade and process"
            description="A cross-section of what moves through our facilities — full catalog available on request."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <Reveal key={product.slug}>
                <div style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
                  <ProductCard product={product} />
                </div>
              </Reveal>
            ))}
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
