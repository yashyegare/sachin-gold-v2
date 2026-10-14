import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Info,
  PhoneCall,
  Share2,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteUrl } from "@/data/company";
import CTA from "@/components/CTA";
import PageIntro from "@/components/PageIntro";
import Reveal from "@/components/Reveal";
import { pageMetadata } from "@/i18n/seo";
import { Link } from "@/i18n/navigation";
import { formatStamp, unitLabel } from "@/lib/rates-basis";
import { getLiveRateGroups } from "@/lib/rates-source";
import type { RateItem } from "@/lib/types";
import type { RateGroupView } from "@/components/RatesTables";

// Published pages refresh in the background when the sheet changes —
// the safety net under the instant /api/revalidate-rates webhook.
export const revalidate = 300;
import { company } from "@/data/company";
import { whatsappLink, whatsappShareLink } from "@/lib/whatsapp";
import RatesFreshness from "@/components/RatesFreshness";
import RatesTables from "@/components/RatesTables";

interface Props {
  params: { locale: string };
}

// Group-heading anchors (photo + icon) live with the table itself in
// components/RatesTables.tsx — they are presentational and the table is a
// client island.

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
  return pageMetadata({
    locale,
    path: "/rates",
    title: t("title"),
    description: t("description"),
  });
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
  // overlaid on the static fallback. A broken feed never breaks the page:
  // the rows keep their "On request" shape and RatesFreshness says out loud
  // that the feed is down, so a buyer can't mistake our outage for "no
  // published prices". Cached 5 min; the /api/revalidate-rates webhook
  // refreshes instantly on sheet edits.
  const { groups: rateGroups, lastUpdated, source } =
    await getLiveRateGroups(locale);
  const jsonLd = ratesJsonLd(rateGroups);

  // Unit + qualifier in the reader's language. data/rates.ts keeps its own
  // English `unit`/`unitNote`/`price` strings because the rate-card PDF
  // prints those — a forwarded trade document stays in one wording — so the
  // two renderers read the same row through different fields on purpose.
  const basisLabel = (item: RateItem): string =>
    unitLabel({
      unit: t(`units.${item.unitKey}`),
      unitNote: item.noteKey ? t(`notes.${item.noteKey}`) : undefined,
    });

  // One-tap forward: WhatsApp prefilled with the day's real prices only
  // (rows the sheet actually prices — never "On request" placeholders),
  // under the same heading the table uses. The stamp carries the pull
  // time in the shared text itself, so the recipient knows exactly how
  // fresh the numbers are when they read it, and the disclaimer travels
  // with them — a forwarded screenshot is the one copy we can't keep
  // attached to the page.
  const istStamp = lastUpdated ? formatStamp(lastUpdated, locale) : null;
  const shareText = (heading: string, lines: string[]): string =>
    `*${company.name} — ${t("title")}*\n\n*${heading}*\n${lines.join("\n")}${
      istStamp ? `\n\n${t("fresh.shareStamp", { time: istStamp })}` : ""
    }\n_${t("disclaimer")}_`;
  // Two buyer populations, two messages: a dal buyer has no use for seven
  // soya DOC lines and vice versa, so each half of the share control sends
  // only its own segment — heading, stamp and disclaimer included. A
  // segment the sheet hasn't priced is omitted rather than shared empty.
  const shareSegments = rateGroups
    .map((group, gi) => {
      const lines = group.items
        .filter((item) => item.priceValue !== undefined)
        .map(
          (item) => `• ${item.product}: ${item.price} (${basisLabel(item)})`,
        );
      return {
        key: gi === 0 ? ("soya" as const) : ("dals" as const),
        labelKey: gi === 0 ? ("shareSoya" as const) : ("shareDals" as const),
        lines,
        message: shareText(t(`groups.${gi === 0 ? "soya" : "dals"}`), lines),
      };
    })
    .filter((segment) => segment.lines.length > 0);
  const trackedCount = rateGroups.reduce(
    (n, group) => n + group.items.length,
    0,
  );

  // Rows for the table island. Every price string and every WhatsApp link
  // is computed here: the client component gets strings, so the pricing
  // maths (and the enquiry copy, and the en-IN number formatting) never
  // exist in two places.
  const rateTables: RateGroupView[] = rateGroups.map((group, gi) => ({
    title: t(`groups.${gi === 0 ? "soya" : "dals"}`),
    updatedOn: group.updatedOn ?? null,
    enquiryHref: enquireLineLink(group.title),
    rows: group.items.map((rate) => ({
      product: rate.product,
      flagship: rate.product.startsWith(FLAGSHIP),
      // An unpriced line says "On request" in the reader's language; the
      // English literal in data/rates.ts is only the PDF's copy.
      quoted: {
        price: rate.priceValue === undefined ? t("onRequest") : rate.price,
        unit: basisLabel(rate),
      },
      enquiryHref: enquireLink(rate.product),
    })),
  }));

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
        {/* Three figures the page can actually attest to, then the actions.
            This band used to hold a lone wordmark on the left with four
            stacked CTAs on the right, which read as ~400px of empty green
            on every desktop viewport. */}
        <div className="flex flex-col gap-9">
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <p className="font-display text-2xl tabular-nums text-wheat">
                {trackedCount}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/55">
                {t("intro.commodities")}
              </p>
            </div>
            <div>
              <p className="font-display text-2xl text-wheat">
                {t("intro.daily")}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/55">
                {t("intro.revisions")}
              </p>
            </div>
            {istStamp && (
              <div>
                <p className="font-display text-2xl tabular-nums text-wheat">
                  {istStamp}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/55">
                  {t("intro.lastUpdated")}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={whatsappLink(
                company.whatsapp,
                "Hi Sachin Gold, I am interested in current bulk rates.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-wheat px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright"
            >
              <PhoneCall size={15} aria-hidden="true" />
              {t("callCta", { phone: company.phone })}
            </a>
            {/* Two buyer populations, two forwards: a dal buyer has no use
                for the soya DOC lines and vice versa, so each half prefills
                WhatsApp with only its own segment. Stacked on phones, side by
                side from sm up. Hidden until the sheet has real numbers. */}
            {shareSegments.length > 0 && (
              <div className="inline-flex flex-col divide-y divide-white/25 overflow-hidden rounded-sm border border-white/25 sm:flex-row sm:divide-x sm:divide-y-0">
                {shareSegments.map((segment) => (
                  <a
                    key={segment.key}
                    href={whatsappShareLink(segment.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-wheat-bright"
                  >
                    <Share2 size={15} aria-hidden="true" />
                    {t(segment.labelKey)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageIntro>

      {/* ————— Freshness: "Updated Xm ago", or the dead-feed band ————— */}
      <RatesFreshness
        lastUpdated={lastUpdated}
        live={source === "sheet"}
        locale={locale}
      />

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

      {/* ————— The tables (client island: shared strings per row) ————— */}
      <section className="mx-auto max-w-4xl px-6 py-16 print:px-0 print:py-0">
        <RatesTables groups={rateTables} />

        {/* The line that keeps every figure above honest. Deliberately not
            print:hidden: this page gets printed at counters, and a paper
            sheet is exactly the copy that outlives the day's rate — it has
            to carry the same wording the screen does. */}
        <div className="mt-10 flex items-start gap-2.5 rounded-sm border border-ink/10 bg-linen px-4 py-3 print:border-ink/25 print:bg-transparent">
          <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-pine" />
          <p className="text-xs leading-relaxed text-ink/65">{t("disclaimer")}</p>
        </div>

        <p className="mt-6 text-xs text-ink/45 print:hidden">
          {t("cannotFind")}{" "}
          <Link
            href="/services"
            className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-pine underline decoration-pine/30 underline-offset-2 transition-colors hover:decoration-pine"
          >
            {t("gradesLink")}
            <ArrowRight size={11} aria-hidden="true" />
          </Link>
        </p>

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

/** The one loud enquiry per group. Uses the English line name (`title` in
 *  data/rates.ts) rather than the translated heading: the desk reads these
 *  messages in English in every locale, same as the product names. */
function enquireLineLink(line: string): string {
  return enquireLink(line.toLowerCase());
}
