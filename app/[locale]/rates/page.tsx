import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
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
import { ratesLastUpdated } from "@/data/rates";
import { quintalPrice, unitLabel } from "@/lib/rates-basis";
import { getLiveRateGroups } from "@/lib/rates-source";
import type { RateGroupView } from "@/components/RatesTables";

// Published pages refresh in the background when the sheet changes —
// the safety net under the instant /api/revalidate-rates webhook.
export const revalidate = 300;
import { company } from "@/data/company";
import { whatsappLink, whatsappShareLink } from "@/lib/whatsapp";
import PdfDownloadButton from "@/components/PdfDownloadButton";
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
  // overlaid on the static fallback — a broken feed degrades to "On
  // request" rows, never to a broken page. Cached 5 min; the
  // /api/revalidate-rates webhook refreshes instantly on sheet edits.
  const { groups: rateGroups, lastUpdated } = await getLiveRateGroups();
  const jsonLd = ratesJsonLd(rateGroups);

  // One-tap forward: WhatsApp prefilled with the day's real prices only
  // (rows the sheet actually prices — never "On request" placeholders).
  // The stamp carries the pull time in the shared text itself, so the
  // recipient knows exactly how fresh the numbers are when they read it.
  const istStamp = lastUpdated
    ? lastUpdated.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;
  const pricedItems = rateGroups
    .flatMap((group) => group.items)
    .filter((item) => item.priceValue !== undefined);
  const shareMessage = pricedItems.length
    ? `*${company.name} — ${t("title")}*\n${pricedItems
        .map((item) => `• ${item.product}: ${item.price} (${unitLabel(item)})`)
        .join("\n")}${
        istStamp ? `\n${t("fresh.shareStamp", { time: istStamp })}` : ""
      }`
    : null;
  const trackedCount = rateGroups.reduce(
    (n, group) => n + group.items.length,
    0,
  );

  // Rows for the table island. Both price bases and every WhatsApp link are
  // computed here: the client component gets strings, so the pricing maths
  // (and the enquiry copy, and the en-IN number formatting) never exist in
  // two places. A row the sheet doesn't price has `quintal: null` — the
  // toggle then keeps showing "On request" rather than inventing a number.
  const perQuintal = t("perQuintal");
  const rateTables: RateGroupView[] = rateGroups.map((group, gi) => ({
    title: t(`groups.${gi === 0 ? "soya" : "dals"}`),
    updatedOn: group.updatedOn ?? null,
    enquiryHref: enquireLineLink(group.title),
    rows: group.items.map((rate) => {
      const quintal = quintalPrice(rate);
      return {
        product: rate.product,
        flagship: rate.product.startsWith(FLAGSHIP),
        quoted: { price: rate.price, unit: unitLabel(rate) },
        quintal: quintal
          ? {
              price: quintal,
              unit: unitLabel({ unit: perQuintal, unitNote: rate.unitNote }),
            }
          : null,
        enquiryHref: enquireLink(rate.product),
      };
    }),
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
            {/* The printable rate card — same data as this page, as a
                forwardable PDF (counter printout / WhatsApp forward). */}
            <PdfDownloadButton
              href="/rates.pdf"
              label={t("pdfCta")}
            />
            {/* One-tap forward: the day's real prices prefilled into a
                WhatsApp chat — every rate-checker becomes a distribution
                channel. Hidden until the sheet has real numbers (never
                shares "On request" rows). */}
            {shareMessage && (
              <a
                href={whatsappShareLink(shareMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-sm border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright"
              >
                <Share2 size={15} aria-hidden="true" />
                {t("shareCta")}
              </a>
            )}
          </div>
        </div>
      </PageIntro>

      {/* ————— Freshness signal: "Updated Xm ago", front and center ————— */}
      <RatesFreshness lastUpdated={lastUpdated} />

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

      {/* ————— The tables (client island: the basis switch spans groups) ————— */}
      <section className="mx-auto max-w-4xl px-6 py-16 print:px-0 print:py-0">
        <RatesTables
          groups={rateTables}
          showBasisToggle={rateTables.some((group) =>
            group.rows.some((row) => row.quintal),
          )}
        />

        <p className="mt-12 text-xs text-ink/45 print:hidden">
          {t("cannotFind")}{" "}
          <Link
            href="/services"
            className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-pine underline decoration-pine/30 underline-offset-2 transition-colors hover:decoration-pine"
          >
            {t("gradesLink")}
            <ArrowRight size={11} aria-hidden="true" />
          </Link>
        </p>

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

/** The one loud enquiry per group. Uses the English line name (`title` in
 *  data/rates.ts) rather than the translated heading: the desk reads these
 *  messages in English in every locale, same as the product names. */
function enquireLineLink(line: string): string {
  return enquireLink(line.toLowerCase());
}
