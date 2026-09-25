import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Droplets,
  PhoneCall,
  ShieldCheck,
  TimerReset,
  Wheat,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteUrl } from "@/data/company";
import CTA from "@/components/CTA";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import { buildAlternates } from "@/i18n/seo";
import { ratesLastUpdated } from "@/data/rates";
import { getLiveRateGroups } from "@/lib/rates-source";

// Published pages refresh in the background when the sheet changes —
// the safety net under the instant /api/revalidate-rates webhook.
export const revalidate = 300;
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";
import PdfDownloadButton from "@/components/PdfDownloadButton";

interface Props {
  params: { locale: string };
}

// Group-heading anchors: a real product photo (the same treated assets
// from the catalogue) plus the site-wide icon language (Droplets/Wheat).
// Keyed by group index — the group titles themselves are translated.
const groupImagesByIndex: Record<number, string> = {
  0: "/images/products/soya-doc.webp",
  1: "/images/products/toor-dal.webp",
};

const groupIconsByIndex: Record<number, typeof Droplets> = {
  0: Droplets,
  1: Wheat,
};

// The old site's own page title was literally "Bulk Soya DOC Supplier &
// Manufacturer" — a real signal of what the business leads with. Tagged
// sparingly: the DOC rows only, never on every row. Product names stay
// Latin in every locale — that's how the trade actually talks.
const FLAGSHIP = "Soya DOC";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rates" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/rates"),
  };
}

// Offer/PriceSpecification structured data — activates automatically the
// moment any item has a numeric priceValue (live from the Google Sheet).
// Deliberately emits nothing while prices are "On request": Google must
// never see placeholder pricing. English-only for now (same policy as
// the FAQ schema): the numbers are locale-neutral once real rates land.
function ratesJsonLd(groups: Awaited<ReturnType<typeof getLiveRateGroups>>["groups"]) {
  if (!groups.some((g) => g.items.some((i) => i.priceValue !== undefined)))
    return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: groups.flatMap((group, gi) =>
      group.items
        .filter((item) => item.priceValue !== undefined)
        .map((item, ii) => ({
          "@type": "ListItem",
          position: gi * 10 + ii + 1,
          item: {
            "@type": "Product",
            name: `${item.product} — ${company.name}`,
            description: `Bulk ${item.product} (${item.unit}) from ${company.legalName}, Udgir, Maharashtra.`,
            brand: { "@type": "Brand", name: company.name },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: item.priceValue,
              availability: "https://schema.org/InStock",
              areaServed: "IN",
              url: `${siteUrl}/rates`,
            },
          },
        })),
    ),
  };
}

export default async function RatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rates");
  // Live prices from the owner's Google Sheet (see lib/rates-source.ts),
  // overlaid on the static fallback — a broken feed degrades to "On
  // request" rows, never to a broken page. Cached 5 min; the
  // /api/revalidate-rates webhook refreshes instantly on sheet edits.
  const { groups: rateGroups } = await getLiveRateGroups();
  const jsonLd = ratesJsonLd(rateGroups);
  const leadGroup = rateGroups[0];

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* ————— Header: the shared PageIntro band ————— */}
      <PageIntro
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      >
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="font-display text-display-md font-bold tracking-tight text-wheat">
            {company.name}
          </p>

          <div className="flex flex-col gap-3">
            <a
              href={whatsappLink(
                company.whatsapp,
                "Hi Sachin Gold, I am interested in current bulk rates.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-wheat px-6 py-3 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {t("waCta")}
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <a
              href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/25 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright"
            >
              <PhoneCall size={15} aria-hidden="true" />
              {t("callCta", { phone: company.phone })}
            </a>
            {/* The printable rate card — same data as this page, as a
                forwardable PDF (counter printout / WhatsApp forward). */}
            <PdfDownloadButton
              href="/rates.pdf"
              label={t("pdfCta")}
              hint="PDF"
              variant="solid"
              className="justify-center border-white/25 bg-white/5 text-white shadow-none hover:border-white/40 hover:bg-white/10 hover:shadow-none"
            />
          </div>
        </div>
      </PageIntro>

      {/* ————— Trust strip: three signals on white ————— */}
      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {(["written", "honest", "direct"] as const).map((key) => (
            <Reveal key={key} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linen text-pine">
                {key === "written" ? (
                  <ShieldCheck size={17} aria-hidden="true" />
                ) : key === "honest" ? (
                  <TimerReset size={17} aria-hidden="true" />
                ) : (
                  <BadgeCheck size={17} aria-hidden="true" />
                )}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {t(`trust.${key}.title`)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink/60">
                  {t(`trust.${key}.text`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— The tables ————— */}
      <section className="mx-auto max-w-4xl px-6 py-16 print:px-0 print:py-0">
        {rateGroups.map((group, gi) => {
          const GroupIcon = groupIconsByIndex[gi] ?? Wheat;
          const groupImage = groupImagesByIndex[gi];
          return (
            <Reveal key={gi} className={gi > 0 ? "mt-16" : ""}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {groupImage && (
                    <Image
                      src={groupImage}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-sm border border-ink/10 object-cover [filter:saturate(0.94)_contrast(1.05)_sepia(0.05)]"
                    />
                  )}
                  <div className="flex items-center gap-2.5">
                    <GroupIcon
                      size={20}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="text-pine"
                    />
                    <h2 className="font-display text-display-md text-ink">
                      {t(`groups.${gi === 0 ? "soya" : "dals"}`)}
                    </h2>
                  </div>
                </div>
                {group.updatedOn && (
                  <p className="flex items-center gap-1.5 text-xs text-ink/50">
                    <TimerReset size={13} aria-hidden="true" />
                    Updated {group.updatedOn}
                  </p>
                )}
              </div>

              {/* Desktop: a real table (md and up, plus print). Mobile:
                  stacked cards — a price list gets read on phones standing
                  at a mandi, so that layout is primary, not an afterthought. */}
              <div className="mt-5">
                <div className="hidden md:block print:block">
                  <table className="w-full border-collapse text-sm print:text-xs">
                    <thead>
                      <tr className="border-b border-ink/15 text-left text-[0.7rem] uppercase tracking-widest text-ink/50">
                        <th scope="col" className="py-3 pr-2 font-semibold">
                          {t("productHeader")}
                        </th>
                        <th
                          scope="col"
                          className="py-3 pl-2 text-right font-semibold"
                        >
                          {t("rateHeader")}
                        </th>
                        <th
                          scope="col"
                          className="py-3 pl-6 text-right font-semibold print:hidden"
                        >
                          <span className="sr-only">{t("enquire")}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((rate, index) => (
                        <tr
                          key={rate.product}
                          className={`group border-b border-ink/10 transition-colors hover:bg-linen/70 print:break-inside-avoid ${
                            index % 2 === 1 ? "bg-linen/40" : ""
                          }`}
                        >
                          <td className="px-2 py-4 font-medium text-ink first:pl-0 print:py-2.5">
                            {rate.product}
                            {rate.product.startsWith(FLAGSHIP) && (
                              <span className="ml-2.5 inline-block -translate-y-px rounded-full border border-wheat-dark/50 px-2 py-0.5 align-middle text-[0.6rem] font-semibold uppercase tracking-wider text-wheat-dark print:hidden">
                                {t("flagship")}
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-2 py-4 text-right print:py-2.5">
                            <span className="font-semibold text-ink">
                              {rate.price}
                            </span>{" "}
                            <span className="text-ink/50">{rate.unit}</span>
                          </td>
                          <td className="w-px py-4 pl-6 pr-0 text-right print:hidden">
                            <a
                              href={enquireLink(rate.product)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 whitespace-nowrap rounded-sm border border-whatsapp/60 px-3 py-1.5 text-xs font-semibold text-whatsapp transition-all hover:bg-whatsapp hover:text-white"
                              aria-label={t("enquireAria", {
                                product: rate.product,
                              })}
                            >
                              {t("enquire")}
                              <ArrowRight size={11} aria-hidden="true" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile stacked cards — hidden at md+, hidden in print. */}
                <ul className="space-y-3 md:hidden print:hidden">
                  {group.items.map((rate) => (
                    <li
                      key={rate.product}
                      className="border border-ink/10 bg-white p-4 transition-colors hover:border-pine/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-base text-ink">
                          {rate.product}
                          {rate.product.startsWith(FLAGSHIP) && (
                            <span className="ml-2 inline-block rounded-full border border-wheat-dark/50 px-1.5 py-0.5 align-middle text-[0.6rem] font-semibold uppercase tracking-wider text-wheat-dark">
                              {t("flagship")}
                            </span>
                          )}
                        </p>
                        <a
                          href={enquireLink(rate.product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-sm bg-whatsapp/10 px-3 py-1.5 text-xs font-semibold text-whatsapp transition-colors hover:bg-whatsapp hover:text-white"
                          aria-label={t("enquireAria", {
                            product: rate.product,
                          })}
                        >
                          {t("enquire")}
                        </a>
                      </div>
                      <p className="mt-2 text-sm text-ink">
                        <span className="font-semibold">{rate.price}</span>{" "}
                        <span className="text-ink/50">{rate.unit}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {gi === 0 && leadGroup && (
                <p className="mt-4 hidden text-xs text-ink/40 md:block print:hidden">
                  {t("cannotFind")}
                </p>
              )}
            </Reveal>
          );
        })}

        {ratesLastUpdated && (
          <p className="mt-10 text-xs text-ink/50 print:mt-4">
            Last updated: {ratesLastUpdated}
          </p>
        )}

        {/* Print-only footer: this page gets printed at counters, so the
            print view identifies its source. */}
        <p className="mt-8 hidden border-t border-ink/10 pt-4 text-xs text-ink/50 print:block">
          {company.legalName} — {company.phone} — {company.email} —
          {" "}www.sachingold.com
        </p>
      </section>

      <div className="print:hidden">
        <CTA title={t("ctaTitle")} description={t("ctaDescription")} />
      </div>
    </>
  );
}

/** Per-item WhatsApp micro-CTA — prefilled with that exact commodity so
 *  the enquiry needs zero typing. */
function enquireLink(product: string): string {
  return whatsappLink(
    company.whatsapp,
    `Hi Sachin Gold, I am interested in bulk rates for ${product}.`,
  );
}
