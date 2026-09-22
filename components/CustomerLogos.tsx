import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { customers } from "@/data/customers";

/**
 * "Our Customers" trust section — redesigned from a thin, uncaptioned
 * marquee strip into a proper section: a real SectionHeading (this used
 * to be a small caption line with no heading weight at all), a
 * supporting sentence explaining the relationship rather than leaving
 * silent logos to speak for themselves, and its own linen surface so it
 * reads as a deliberate beat in the page rather than a divider between
 * WhySachinGold and the products teaser.
 *
 * Static row, not a loop: with exactly 4 real, usable logos (see
 * data/customers.ts for why it's 4 and not 5 for now), an infinite
 * marquee implies more names than actually exist — a confident, static
 * row that shows every logo at once, sized for real, is the more
 * premium read for a short, genuinely impressive list. Kept center-
 * aligned and wrapping so it holds up from a small phone (2 per row) up
 * to desktop (all 4 in one line).
 */
export default async function CustomerLogos() {
  const t = await getTranslations("home.logos");

  return (
    <section className="border-y border-ink/10 bg-linen">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("tagline")}
            description={t("description")}
            align="center"
          />
        </Reveal>

        <Reveal>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-14 gap-y-10">
            {customers.map((customer) => (
              <li key={customer.name}>
                <Image
                  src={customer.logo}
                  alt={`${customer.name} logo`}
                  width={customer.width}
                  height={customer.height}
                  className="w-auto object-contain opacity-70 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
                  style={{ width: "auto", height: customer.height }}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
