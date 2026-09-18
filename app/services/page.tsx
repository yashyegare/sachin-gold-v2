import type { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import SectionHeading from "@/components/SectionHeading";
import CTA from "@/components/CTA";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "An end-to-end agro value chain — commodity trading, pulses & gram flour processing, Soya DOC extraction, cold storage and logistics.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          as="h1"
          eyebrow="What we do"
          title="Our Services"
          description="An end-to-end agro value chain, from soil to storefront — sourcing, processing, extraction, storage and dispatch under one roof."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
