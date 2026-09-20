import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { company } from "@/data/company";
import { customers } from "@/data/customers";
import { faqs } from "@/data/faq";
import { whatsappLink } from "@/lib/whatsapp";
import ContactForm from "@/components/ContactForm";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import { buildAlternates } from "@/i18n/seo";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/contact"),
  };
}

// The visible FAQ accordion renders from the message catalogs (translated);
// this JSON-LD stays on the English source-of-truth (data/faq.ts) until
// the translated FAQs are client-reviewed — schema must never outrun the
// page's actual rendered text per locale.
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
// contact page. Per-facility links are the real maps.app.goo.gl short URLs
// captured from the old page, now in data/company.ts.
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

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header band — the shared PageIntro treatment, with the real
          branded cold-storage photo behind it. Quick-contact pills give
          immediate paths above the fold. */}
      <PageIntro
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        image="/images/home/cold-storage-branded.webp"
      >
        <div className="flex flex-wrap gap-3">
          <a
            href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
            className="rounded-sm border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright"
          >
            {t("pillCall", { phone: company.phone })}
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
            {t("pillWhatsapp")}
          </a>
          <a
            href={`mailto:${company.salesEmail}`}
            className="rounded-sm border border-white/25 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright"
          >
            {t("pillEmail")}
          </a>
        </div>
      </PageIntro>

      {/* Facilities + form */}
      <section className="section-standard mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div>
            <h2 className="font-display text-2xl text-ink">
              {t("facilitiesTitle")}
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              {t("facilitiesSubtitle")}
            </p>

            <div className="mt-8 space-y-4">
              {company.facilities.map((facility) => (
                <Reveal
                  key={facility.name}
                  className="group border border-ink/10 p-5 transition-all hover:-translate-y-0.5 hover:border-pine hover:shadow-[0_10px_28px_-14px_rgba(22,35,28,0.25)]"
                >
                  <p className="font-display text-base text-ink">
                    {facility.name}
                    {facility.name === "Main Plant" && (
                      <span className="ml-2.5 inline-block -translate-y-px rounded-full border border-wheat-dark/50 px-2 py-0.5 align-middle text-[0.6rem] font-semibold uppercase tracking-wider text-wheat-dark">
                        {t("headquarters")}
                      </span>
                    )}
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
                    </a>                    {facility.mapUrl && (
                      <a
                        href={facility.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-wheat-dark transition-colors hover:text-ink"
                      >
                        {t("mapsLink")}
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
                </Reveal>
              ))}
            </div>

            <div className="mt-8 space-y-1 border-t border-ink/10 pt-6 text-sm">
              <p className="text-ink/60">
                {t("generalEmail")}{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="text-pine hover:underline"
                >
                  {company.email}
                </a>
              </p>
              <p className="text-ink/60">
                {t("salesEmail")}{" "}
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
              {t("formTitle")}
            </h2>
            <p className="mt-2 text-sm text-ink/60">{t("formSubtitle")}</p>
            {/* Trust line at the decision point. Names come from the real
                customer list; the sentence wraps them per locale. */}
            <p className="mt-4 border-l-2 border-wheat-dark/40 pl-3 text-sm text-ink/70">
              {t("formTrust", {
                names: customers
                  .slice(0, 3)
                  .map((c) => c.name)
                  .join(", "),
              })}
            </p>
            <div className="mt-8">
              <Reveal>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Find us — just the embed. The three facility cards above already
          carry the per-facility Google Maps links. Lazy iframe: zero cost
          until scrolled near. */}
      <section className="section-standard border-y border-ink/10 bg-linen px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl text-ink">
            {t("findUsTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            {t("findUsSubtitle")}
          </p>
          <div className="mt-6 overflow-hidden border border-ink/10 bg-white shadow-[0_10px_36px_-18px_rgba(22,35,28,0.3)]">
            <Reveal>
              <iframe
                src={mapEmbedSrc}
                title={t("mapTitle")}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[380px] w-full border-0"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Real FAQ content — translated verbatim in every catalog; the
          English source stays data/faq.ts. Native details/summary keeps
          it keyboard-accessible with zero JS. */}
      <section className="section-standard mx-auto max-w-3xl px-6">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">
          {t("faqTitle")}
        </h2>
        <div className="mt-8 divide-y divide-ink/10">
          <Reveal>
            {t.raw("faqs").map(
              (
                faq: { q: string; a: string },
                index: number,
              ) => (
                <details key={index} className="group py-5">
                <summary className="cursor-pointer list-none font-display text-base text-ink transition-colors marker:content-none hover:text-pine group-open:text-pine">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span
                      aria-hidden="true"
                      className="text-pine transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="animate-fade-in mt-3 text-sm leading-relaxed text-ink/70">
                  {faq.a}
                </p>
              </details>
              ),
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
