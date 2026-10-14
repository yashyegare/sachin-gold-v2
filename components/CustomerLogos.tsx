import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { customers } from "@/data/customers";

/**
 * "Our Customers" trust section — a real SectionHeading, a supporting
 * sentence explaining the relationship rather than leaving silent logos
 * to speak for themselves, and its own linen surface so it reads as a
 * deliberate beat in the page.
 *
 * A running marquee now, not a static row: the list grew from four marks
 * to ten, and ten logos in one centered row no longer fit a laptop width
 * without shrinking to illegibility. The strip scrolls edge to edge with
 * faded ends (see .sg-logo-marquee in globals.css), pauses on hover or
 * keyboard focus, and collapses to the old static wrapped row under
 * prefers-reduced-motion and in print. The sequence is rendered twice for
 * the seamless -50% loop; the second copy is aria-hidden and carries empty
 * alt text so screen readers hear each name exactly once.
 */
export default async function CustomerLogos() {
  const t = await getTranslations("home.logos");

  const half = (duplicate: boolean) => (
    <ul className="sg-logo-half" aria-hidden={duplicate || undefined}>
      {customers.map((customer) => (
        <li key={customer.name}>
          <Image
            src={customer.logo}
            alt={duplicate ? "" : `${customer.name} logo`}
            width={customer.width}
            height={customer.height}
            className="w-auto object-contain opacity-70 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
            style={{ width: "auto", height: customer.height }}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="border-y border-ink/10 bg-linen">
      <div className="mx-auto max-w-6xl px-6 pt-16 sm:pt-20">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("tagline")}
            description={t("description")}
            align="center"
          />
        </Reveal>
      </div>

      {/* Full-bleed on purpose: the fades belong at the viewport edges, and
          a contained strip would fade logos against the same linen they
          sit on, reading as a smudge rather than an exit. */}
      <Reveal className="sg-logo-marquee mt-12 pb-16 sm:mt-14 sm:pb-20">
        <div className="sg-logo-track">
          {half(false)}
          {half(true)}
        </div>
      </Reveal>
    </section>
  );
}
