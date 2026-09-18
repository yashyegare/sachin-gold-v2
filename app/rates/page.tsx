import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import CTA from "@/components/CTA";
import { rateGroups, ratesLastUpdated } from "@/data/rates";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Market Rates",
  description:
    "Indicative market rates for Soya DOC, soya oils, lecithin, toor dal, chana dal and besan — updated regularly; confirmed at booking.",
  alternates: { canonical: "/rates" },
};

export default function RatesPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <SectionHeading
          as="h1"
          eyebrow="Live Market Rates"
          title="Current Market Rates"
          description="All rates are indicative and subject to final reconfirmation at the time of booking — commodity markets fluctuate daily."
        />

        {rateGroups.map((group) => (
          <div key={group.title} className="mt-12">
            <h2 className="font-display text-xl text-ink">{group.title}</h2>
            {/* overflow-x wrapper keeps the page from breaking on 320px
                screens when long unit strings wrap badly. */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {group.items.map((rate, index) => (
                    <tr
                      key={rate.product}
                      className={`border-b border-ink/10 ${
                        index % 2 === 1 ? "bg-linen/60" : ""
                      }`}
                    >
                      <td className="px-2 py-3 text-ink/80 first:pl-0">
                        {rate.product}
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 text-right text-ink last:pr-0">
                        {rate.price}{" "}
                        <span className="text-ink/50">{rate.unit}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {ratesLastUpdated && (
          <p className="mt-10 text-xs text-ink/50">
            Last updated: {ratesLastUpdated}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-8">
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
      </section>

      <CTA
        title="Confirm today's rate before you order."
        description="Call or WhatsApp with your requirement and quantity, and we'll confirm the prevailing rate."
      />
    </>
  );
}
