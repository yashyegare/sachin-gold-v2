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
import { siteUrl } from "@/data/company";
import CTA from "@/components/CTA";
import PageIntro from "@/components/PageIntro";
import {
  rateGroups,
  ratesLastUpdated,
  hasRealRates,
} from "@/data/rates";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";

// Group-heading anchors: a real product photo (the same treated assets
// from the catalogue) plus the site-wide icon language (Droplets/Wheat,
// as used on the home value chain) — so the one page that is all text
// and tables still reads as part of the same brand.
const groupImages: Record<string, string> = {
  "Soya Derivatives": "/images/products/soya-doc.webp",
  "Dals & Flour": "/images/products/toor-dal.webp",
};

const groupIcons: Record<string, typeof Droplets> = {
  "Soya Derivatives": Droplets,
  "Dals & Flour": Wheat,
};

// The old site's own page title was literally "Bulk Soya DOC Supplier &
// Manufacturer" — a real signal of what the business leads with. Tagged
// sparingly: the DOC rows only, never on every row.
const FLAGSHIP = "Soya DOC";

export const metadata: Metadata = {
  title: "Market Rates",
  description:
    "Indicative market rates for Soya DOC, soya oils, lecithin, toor dal, chana dal and besan — updated regularly; confirmed at booking.",
  alternates: { canonical: "/rates" },
};

// Offer/PriceSpecification structured data — activates automatically the
// moment priceValue fields are filled in data/rates.ts. Deliberately emits
// nothing while every price is "On request": Google must never see
// placeholder pricing. Query this page targets: "soya doc rate today" and
// similar direct commodity-rate searches.
function ratesJsonLd() {
  if (!hasRealRates()) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: rateGroups.flatMap((group, gi) =>
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

/** Per-item WhatsApp micro-CTA — replicates the old oil-extraction page's
 *  "Request Bulk Quote" pattern: prefilled with that exact commodity so
 *  the enquiry needs zero typing. */
function enquireLink(product: string): string {
  return whatsappLink(
    company.whatsapp,
    `Hi Sachin Gold, I am interested in bulk rates for ${product}.`,
  );
}

const trustSignals = [
  {
    icon: TimerReset,
    title: "Rates move with the market",
    text: "Commodity prices shift daily — every figure here is re-checked before booking.",
  },
  {
    icon: ShieldCheck,
    title: "Confirmed in writing",
    text: "What we quote on WhatsApp or email is what you pay. No drift, no surprises.",
  },
  {
    icon: BadgeCheck,
    title: "Scale-friendly pricing",
    text: "Volume slabs for truckload and multi-truckload buyers across all three lines.",
  },
];

export default function RatesPage() {
  const jsonLd = ratesJsonLd();
  const leadGroup = rateGroups[0];

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* ————— Header: the shared PageIntro band (dot texture, one canonical
              treatment across all inner pages) ————— */}
      <PageIntro
        eyebrow="Market Rates"
        title="Current Market Rates"
        description="Indicative rates for our full trading, processing and extraction lines — reconfirmed at booking, quoted in writing when you enquire."
      >
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="font-display text-2xl font-bold tracking-tight text-wheat sm:text-3xl">
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
                Get today&apos;s rate on WhatsApp
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
                Call {company.phone}
              </a>
          </div>
        </div>
      </PageIntro>

      {/* ————— Trust strip: three signals on white ————— */}
      <section
        aria-label="Why our rates are reliable"
        className="border-b border-ink/10 bg-white"
      >
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {trustSignals.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linen text-pine">
                <Icon size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/60">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ————— The tables ————— */}
      <section className="mx-auto max-w-4xl px-6 py-16 print:px-0 print:py-0">
        {rateGroups.map((group, gi) => {
          const GroupIcon = groupIcons[group.title] ?? Wheat;
          const groupImage = groupImages[group.title];
          return (
          <div key={group.title} className={gi > 0 ? "mt-16" : ""}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Anchor image — the same treated product photography as
                    the catalogue, at thumbnail size, so the price list
                    still reads as part of the photo-led brand. */}
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
                  <h2 className="font-display text-2xl text-ink">
                    {group.title}
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
                        Product
                      </th>
                      <th
                        scope="col"
                        className="py-3 pl-2 text-right font-semibold"
                      >
                        Rate
                      </th>
                      <th
                        scope="col"
                        className="py-3 pl-6 text-right font-semibold print:hidden"
                      >
                        <span className="sr-only">Enquire</span>
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
                              Flagship
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
                            aria-label={`Enquire about bulk rates for ${rate.product} on WhatsApp`}
                          >
                            Enquire
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
                            Flagship
                          </span>
                        )}
                      </p>
                      <a
                        href={enquireLink(rate.product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-sm bg-whatsapp/10 px-3 py-1.5 text-xs font-semibold text-whatsapp transition-colors hover:bg-whatsapp hover:text-white"
                        aria-label={`Enquire about bulk rates for ${rate.product} on WhatsApp`}
                      >
                        Enquire
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
                Can&apos;t find a grade or pack size? Message us — the trading
                desk answers with a written quote.
              </p>
            )}
          </div>
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
        <CTA
          title="Confirm today's rate before you order."
          description="Call or WhatsApp with your requirement and quantity, and we'll confirm the prevailing rate — in writing."
        />
      </div>
    </>
  );
}
