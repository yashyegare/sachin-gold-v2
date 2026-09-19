import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import CTA from "@/components/CTA";
import {
  rateGroups,
  ratesLastUpdated,
  hasRealRates,
} from "@/data/rates";
import { company, siteUrl } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";

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

export default function RatesPage() {
  const jsonLd = ratesJsonLd();

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <section className="mx-auto max-w-3xl px-6 py-20 print:px-0 print:py-0">
        <SectionHeading
          as="h1"
          eyebrow="Live Market Rates"
          title="Current Market Rates"
          description="All rates are indicative and subject to final reconfirmation at the time of booking — commodity markets fluctuate daily."
        />

        {rateGroups.map((group) => (
          <div key={group.title} className="mt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl text-ink">{group.title}</h2>
              {group.updatedOn && (
                <p className="text-xs text-ink/50">
                  Updated {group.updatedOn}
                </p>
              )}
            </div>

            {/* Desktop: a real table (md and up, plus print). Mobile:
                each row renders as a stacked card — a price list gets read
                on phones standing at a mandi, so that layout is primary,
                not an afterthought. */}
            <div className="mt-4">
              <div className="hidden md:block print:block">
                <table className="w-full border-collapse text-sm print:text-xs">
                  <tbody>
                    {group.items.map((rate, index) => (
                      <tr
                        key={rate.product}
                        className={`group border-b border-ink/10 print:break-inside-avoid ${
                          index % 2 === 1 ? "bg-linen/60" : ""
                        }`}
                      >
                        <td className="px-2 py-3 text-ink/80 first:pl-0 print:py-2">
                          {rate.product}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-right text-ink last:pr-0 print:py-2">
                          {rate.price}{" "}
                          <span className="text-ink/50">{rate.unit}</span>
                        </td>
                        <td className="w-px py-3 pl-3 pr-0 text-right print:hidden">
                          <a
                            href={enquireLink(rate.product)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-whatsapp transition-colors hover:text-pine"
                            aria-label={`Enquire about bulk rates for ${rate.product} on WhatsApp`}
                          >
                            Enquire
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards — hidden at md+, hidden in print. */}
              <ul className="space-y-2 md:hidden print:hidden">
                {group.items.map((rate) => (
                  <li
                    key={rate.product}
                    className="border border-ink/10 bg-white p-4"
                  >
                    <p className="font-display text-base text-ink">
                      {rate.product}
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <p className="text-sm text-ink">
                        {rate.price}{" "}
                        <span className="text-ink/50">{rate.unit}</span>
                      </p>
                      <a
                        href={enquireLink(rate.product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-sm border border-whatsapp px-3 py-1.5 text-xs font-semibold text-whatsapp transition-colors hover:bg-whatsapp hover:text-white"
                        aria-label={`Enquire about bulk rates for ${rate.product} on WhatsApp`}
                      >
                        Enquire
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {ratesLastUpdated && (
          <p className="mt-10 text-xs text-ink/50 print:mt-4">
            Last updated: {ratesLastUpdated}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-8 print:hidden">
          <p className="text-sm text-ink/70">
            For detailed rates and bulk inquiries, message us on WhatsApp or
            call {company.phone}.
          </p>
          <a
            href={whatsappLink(
              company.whatsapp,
              "Hi Sachin Gold, I am interested in current bulk rates.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border-2 border-whatsapp px-6 py-2 text-sm font-semibold text-whatsapp transition-colors hover:bg-whatsapp hover:text-white"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Print-only footer: the page gets screenshotted/printed at
            counters, so the print view identifies its source. */}
        <p className="mt-8 hidden border-t border-ink/10 pt-4 text-xs text-ink/50 print:block">
          {company.legalName} — {company.phone} — {company.email} —
          {" "}www.sachingold.com
        </p>
      </section>

      <div className="print:hidden">
        <CTA
          title="Confirm today's rate before you order."
          description="Call or WhatsApp with your requirement and quantity, and we'll confirm the prevailing rate."
        />
      </div>
    </>
  );
}
