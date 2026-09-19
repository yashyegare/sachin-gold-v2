import type { Metadata } from "next";
import { company } from "@/data/company";
import { faqs } from "@/data/faq";
import { whatsappLink } from "@/lib/whatsapp";
import ContactForm from "@/components/ContactForm";

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

// Embedded map of the Main Plant — the same embed the old site used on its
// contact page (the real "Sachin International Proteins Private Limited"
// Google Maps place). Per-facility links are the real maps.app.goo.gl short
// URLs captured from the old page's "Find Us" section, now in data/company.ts.
const mapEmbedSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3573.2618516985817!2d76.96019213929655!3d18.404722291779592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcfa7316a5b073d%3A0xbbed1284fff3c23c!2sSachin%20International%20Proteins%20Private%20Limited!5e0!3m2!1sen!2sin!4v1769504515407!5m2!1sen!2sin";

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 0C5.2 0 3 2.2 3 5c0 3.7 5 11 5 11s5-7.3 5-11c0-2.8-2.2-5-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header band — same pine-deep language as the About intro, so inner
          pages share one voice. Quick-contact pills give immediate paths
          above the fold. */}
      <section className="bg-pine-deep px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wheat-bright">
            Contact
          </p>
          <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-5 leading-relaxed text-white/80">
            Tell us what you need — product, quantity and destination — and
            we&apos;ll get back with the prevailing rate. We respond to form
            submissions and emails within 24 hours.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
              className="rounded-sm border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright"
            >
              Call {company.phone}
            </a>
            <a
              href={whatsappLink(
                company.whatsapp,
                "Hi Sachin Gold, I'd like to get in touch.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright"
            >
              WhatsApp us
            </a>
            <a
              href={`mailto:${company.salesEmail}`}
              className="rounded-sm border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright"
            >
              {company.salesEmail}
            </a>
          </div>
        </div>
      </section>

      {/* Facilities + form */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div>
            <h2 className="font-display text-2xl text-ink">
              Reach the right facility
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              Three locations, one network — each with a dedicated line.
            </p>

            <div className="mt-8 space-y-4">
              {company.facilities.map((facility) => (
                <div
                  key={facility.name}
                  className="group border border-ink/10 p-5 transition-all hover:-translate-y-0.5 hover:border-pine hover:shadow-[0_10px_28px_-14px_rgba(22,35,28,0.25)]"
                >
                  <p className="font-display text-base text-ink">
                    {facility.name}
                  </p>
                  <p className="mt-1.5 flex items-start gap-1.5 text-sm text-ink/60">
                    <PinIcon className="mt-0.5 shrink-0 text-pine/50" />
                    {facility.address}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <a
                      href={`tel:${facility.phone.replace(/[^+\d]/g, "")}`}
                      className="font-medium text-pine hover:underline"
                    >
                      {facility.phone}
                    </a>
                    {facility.mapUrl && (
                      <a
                        href={facility.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-wheat-dark transition-colors hover:text-ink"
                      >
                        Open in Maps
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 10L10 2M10 2H4M10 2v6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-1 border-t border-ink/10 pt-6 text-sm">
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
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink">
              Send an enquiry
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              The fastest route to a quote — include the quantity and
              destination.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Find us — the old site's map-split section, rebuilt with brand
          tokens: facility buttons on the left (real Google Maps links),
          embedded map of the Main Plant on the right. Lazy-loaded iframe:
          zero cost until scrolled near. */}
      <section className="border-y border-ink/10 bg-linen px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid overflow-hidden border border-ink/10 bg-white shadow-[0_10px_36px_-18px_rgba(22,35,28,0.3)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="p-6 sm:p-10">
              <h2 className="font-display text-2xl text-ink">Find us</h2>
              <p className="mt-2 text-sm text-ink/60">
                All three facilities sit within a few kilometres of Udgir,
                Dist. Latur — click any location to open it in Google Maps.
              </p>
              <div className="mt-6 grid gap-3">
                {company.facilities.map((facility) => (
                  <a
                    key={facility.name}
                    href={facility.mapUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink/80 transition-all hover:translate-x-1 hover:border-pine hover:bg-pine hover:text-white"
                  >
                    <PinIcon className="shrink-0 text-wheat-dark transition-colors group-hover:text-wheat-bright" />
                    <span className="flex-1">{facility.name}</span>
                    <span
                      aria-hidden="true"
                      className="text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:text-white/70"
                    >
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <div className="min-h-[320px] border-t border-ink/10 lg:border-l lg:border-t-0">
              <iframe
                src={mapEmbedSrc}
                title="Map — Sachin International Proteins Private Limited, Udgir"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[320px] w-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Real FAQ content — see data/faq.ts. Native details/summary keeps
          it keyboard-accessible with zero JS. */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-display text-2xl text-ink sm:text-3xl">
          Frequently Asked Questions
        </h2>
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
      </section>
    </>
  );
}
