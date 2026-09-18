import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import CTA from "@/components/CTA";
import SectionHeading from "@/components/SectionHeading";
import { getServiceBySlug, services } from "@/data/services";
import { getProductsByService } from "@/data/products";
import { siteUrl } from "@/data/company";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.title, description: service.shortDescription },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const products = getProductsByService(service.slug);

  // Phase 7, item 4 — Service JSON-LD on each service page.
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
      <section className="mx-auto max-w-3xl px-6 py-20">
        {/* Wayfinding: cheap, obvious way back to the overview. */}
        <Link
          href="/services"
          className="inline-flex items-center gap-1 text-sm text-ink/50 transition-colors hover:text-pine"
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
          All services
        </Link>

        <div className="mt-4">
          <SectionHeading
            as="h1"
            eyebrow="Our Services"
            title={service.title}
            description={service.description}
          />
        </div>

        {service.advantages.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl text-ink">Key advantages</h2>
            <ul className="mt-4 space-y-2.5">
              {service.advantages.map((advantage) => (
                <li
                  key={advantage}
                  className="flex gap-2.5 text-ink/70"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-wheat-dark"
                  />
                  <span>{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {products.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl text-ink">
              Products in this line
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        )}

        {service.locations.length > 0 && (
          <div className="mt-12 border-t border-ink/10 pt-10">
            <h2 className="font-display text-xl text-ink">Where we operate</h2>
            <ul className="mt-4 space-y-2.5">
              {service.locations.map((location) => (
                <li
                  key={location}
                  className="flex gap-2.5 text-ink/70"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pine"
                  />
                  <span>{location}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <CTA
        title={`Need ${service.title.toLowerCase()}?`}
        description="Tell us your requirement and we'll get back with pricing and availability."
      />
    </>
  );
}
