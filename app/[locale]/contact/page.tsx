import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MessageSquareText, PhoneCall } from "lucide-react";
import { company } from "@/data/company";
import { customers } from "@/data/customers";
import { whatsappLink } from "@/lib/whatsapp";
import ContactForm from "@/components/ContactForm";
import MapFacade from "@/components/MapFacade";
import PageIntro from "@/components/PageIntro";
import RatesStrip from "@/components/RatesStrip";
import Reveal from "@/components/Reveal";
import { pageMetadata } from "@/i18n/seo";

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
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

// Embedded map of the Main Plant — the same embed the old site used on its
// contact page. Per-facility links are the real maps.app.goo.gl short URLs
// captured from the old page, now in data/company.ts.
const mapEmbedSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3573.2618516985817!2d76.96019213929655!3d18.404722291779592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcfa7316a5b073d%3A0xbbed1284fff3c23c!2sSachin%20International%20Proteins%20Private%20Limited!5e0!3m2!1sen!2sin!4v1769504515407!5m2!1sen!2sin";

// Muted body copy on white. The `/60` and `/50` tiers this page used
// before sit at 3–4.4:1 against white — under AA for the 14px text they
// carry — so the page reads on one step up throughout.
const MUTED = "text-ink/70";

const PILL_CLASS =
  "inline-flex items-center gap-2 rounded-sm border border-white/35 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-[3px] transition-colors hover:border-wheat-bright/70 hover:bg-white/[0.16] hover:text-wheat-bright";

// WhatsApp leads and is the only filled pill: it is the channel the desk
// actually answers on (same order as the direct-lines trio under the form),
// and three bordered pills of equal weight read as a list, not a choice.
const PILL_PRIMARY_CLASS =
  "inline-flex items-center gap-2 rounded-sm bg-wheat px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-wheat-bright hover:shadow-lg";

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

  // ONE source for both the accordion and the structured data. Google's FAQ
  // markup has to match the text a visitor actually sees, so it is built
  // from this locale's catalog rather than from an English copy that would
  // describe questions the page never asks in that language.
  const faqItems = t.raw("faqs") as { q: string; a: string }[];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      {/* Rates strip FIRST — the same ticker position as the home page. */}
      <RatesStrip />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header band — the shared PageIntro treatment, with the real
          branded cold-storage photo behind it. Quick-contact pills give
          immediate paths above the fold; they carry an icon and a filled
          backdrop because a 1px border on a photograph disappears. */}
      <PageIntro
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        image="/images/home/cold-storage-branded.webp"
      >
        <div className="flex flex-wrap gap-3">
          <a
            href={whatsappLink(
              company.whatsapp,
              "Hi Sachin Gold, I'd like to get in touch.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={PILL_PRIMARY_CLASS}
          >
            <MessageSquareText size={15} aria-hidden="true" />
            {t("pillWhatsapp")}
          </a>
          <a
            href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
            className={PILL_CLASS}
          >
            <PhoneCall size={15} aria-hidden="true" />
            {t("pillCall", { phone: company.phone })}
          </a>
          <a href={`mailto:${company.salesEmail}`} className={PILL_CLASS}>
            <Mail size={15} aria-hidden="true" />
            {t("pillEmail")}
          </a>
        </div>
      </PageIntro>

      {/* Facilities + form */}
      <section className="section-standard mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div>
            <h2 className="font-display text-display-md text-ink">
              {t("facilitiesTitle")}
            </h2>
            <p className={`mt-2 text-sm ${MUTED}`}>{t("facilitiesSubtitle")}</p>

            <div className="mt-8 space-y-4">
              {company.facilities.map((facility) => (
                <Reveal
                  key={facility.name}
                  className="group border border-ink/10 bg-linen/50 p-5 transition-all hover:-translate-y-0.5 hover:border-pine hover:bg-white hover:shadow-elevated"
                >
                  <p className="font-display text-base text-ink">
                    {facility.name}
                    {facility.name === "Main Plant" && (
                      <span className="ml-2.5 inline-block -translate-y-px rounded-full border border-wheat-dark/50 px-2 py-0.5 align-middle text-[0.6rem] font-semibold uppercase tracking-wider text-wheat-dark">
                        {t("headquarters")}
                      </span>
                    )}
                  </p>
                  <p className={`mt-1.5 flex items-start gap-1.5 text-sm ${MUTED}`}>
                    <PinIcon className="mt-0.5 shrink-0 text-pine/75" />
                    {facility.address}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <a
                      href={`tel:${facility.phone.replace(/[^+\d]/g, "")}`}
                      className="font-semibold text-pine tabular-nums decoration-pine/40 underline-offset-4 hover:underline"
                    >
                      {facility.phone}
                    </a>
                    {facility.mapUrl && (
                      <a
                        href={facility.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-wheat-dark transition-colors hover:text-pine"
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

            <div className="mt-8 space-y-1.5 border-t border-ink/10 pt-6 text-sm">
              <p className={MUTED}>
                {t("generalEmail")}{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="font-medium text-pine underline decoration-pine/30 underline-offset-2 transition-colors hover:decoration-pine"
                >
                  {company.email}
                </a>
              </p>
              <p className={MUTED}>
                {t("salesEmail")}{" "}
                <a
                  href={`mailto:${company.salesEmail}`}
                  className="font-medium text-pine underline decoration-pine/30 underline-offset-2 transition-colors hover:decoration-pine"
                >
                  {company.salesEmail}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-display-md text-ink">
              {t("formTitle")}
            </h2>
            <p className={`mt-2 text-sm ${MUTED}`}>{t("formSubtitle")}</p>
            {/* Trust line at the decision point. Names come from the real
                customer list; the sentence wraps them per locale. */}
            <p className="mt-4 border-l-2 border-wheat-dark/50 pl-3 text-sm text-ink/80">
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

      {/* Find us — just the map. The three facility cards above already
          carry the per-facility Google Maps links. The embed sits behind a
          click so its tiles are never something the reader waits on. */}
      <section className="section-standard border-y border-ink/10 bg-linen px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-display-md text-ink">
            {t("findUsTitle")}
          </h2>
          <p className={`mt-2 max-w-2xl text-sm ${MUTED}`}>
            {t("findUsSubtitle")}
          </p>
          <div className="mt-6 overflow-hidden border border-ink/10 bg-white shadow-elevated">
            <MapFacade
              embedSrc={mapEmbedSrc}
              title={t("mapTitle")}
              address={company.facilities[0]?.address}
              loadLabel={t("mapLoad")}
            />
          </div>
        </div>
      </section>

      {/* Real FAQ content — the message catalogs are its only source, in
          every locale, and the JSON-LD above reads the same array. Native
          details/summary keeps it keyboard-accessible with zero JS. The rows
          are boxed and react to hover/open so they read as controls, not as
          a list of sentences that happen to expand. The id is the footer's
          "FAQ" jump target. */}
      <section id="faq" className="section-standard mx-auto max-w-3xl px-6">
        <h2 className="font-display text-display-md text-ink">
          {t("faqTitle")}
        </h2>
        <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          <Reveal>
            {faqItems.map(
              (
                faq: { q: string; a: string },
                index: number,
              ) => (
                <details key={index} className="group -mx-4 px-4 transition-colors hover:bg-linen/70 open:bg-linen/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-base text-ink transition-colors marker:content-none group-open:text-pine">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pine/30 text-lg leading-none text-pine transition-all duration-200 group-open:rotate-45 group-open:border-pine group-open:bg-pine group-open:text-white"
                  >
                    +
                  </span>
                </summary>
                <p className="animate-fade-in -mt-1 mb-5 max-w-2xl pr-10 text-sm leading-relaxed text-ink/80">
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
