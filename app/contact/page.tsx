import type { Metadata } from "next";
import { company } from "@/data/company";
import { faqs } from "@/data/faq";
import { whatsappLink } from "@/lib/whatsapp";
import ContactForm from "@/components/ContactForm";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Sachin Gold — three facilities in Udgir, Dist. Latur. Bulk agro commodity enquiries across Maharashtra and Karnataka: call, email or WhatsApp.",
  alternates: { canonical: "/contact" },
};

// FAQPage JSON-LD from the same data that renders the visible accordion —
// schema and page can't drift apart. Only legitimate because every Q&A is
// fully visible on the page (Google's requirement for FAQ markup).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Get in touch"
          description="Tell us what you need — product, quantity and destination — and we'll get back with the prevailing rate. We respond to form submissions and emails within 24 hours."
        />

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div className="space-y-8 text-sm">
            {/* Real facility details — see data/company.ts */}
            {company.facilities.map((facility) => (
              <div key={facility.name}>
                <p className="font-display text-base text-ink">
                  {facility.name}
                </p>
                <p className="mt-1 text-sm text-ink/70">{facility.address}</p>
                <a
                  href={`tel:${facility.phone.replace(/[^+\d]/g, "")}`}
                  className="mt-1 inline-block text-sm text-pine hover:underline"
                >
                  {facility.phone}
                </a>
              </div>
            ))}

            <div className="space-y-1 border-t border-ink/10 pt-6 text-sm">
              <p className="text-ink/60">
                General inquiries:{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-pine hover:underline"
                >
                  {company.email}
                </a>
              </p>
              <p className="text-ink/60">
                Sales &amp; trading:{" "}
                <a
                  href={`mailto:${company.salesEmail}`}
                  className="text-pine hover:underline"
                >
                  {company.salesEmail}
                </a>
              </p>
            </div>

            <a
              href={whatsappLink(
                company.whatsapp,
                "Hi Sachin Gold, I'd like to get in touch.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-sm border-2 border-whatsapp px-6 py-2 text-sm font-semibold text-whatsapp transition-colors hover:bg-whatsapp hover:text-white"
            >
              Chat on WhatsApp
            </a>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Real FAQ content — see data/faq.ts. Native details/summary keeps
          it keyboard-accessible with zero JS. */}
      <section className="border-t border-ink/10 bg-linen px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
          <div className="mt-8 divide-y divide-ink/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer list-none font-display text-base text-ink transition-colors marker:content-none hover:text-pine group-open:text-pine">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span
                      aria-hidden="true"
                      className="text-pine transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="animate-fade-in mt-3 text-sm leading-relaxed text-ink/70">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
