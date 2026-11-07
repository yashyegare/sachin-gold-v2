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
 * A static, wrapped roster keeps customer names legible and avoids competing
 * with the hero and rates ticker.
 */
export default async function CustomerLogos() {
  const t = await getTranslations("home.logos");

  const roster = () => (
    <ul className="sg-logo-half">
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

      {/* A wrapped roster stays readable without automatic motion. */}
      <Reveal className="sg-logo-static mt-10 pb-12 sm:pb-16">
        <div className="sg-logo-track">{roster()}</div>
      </Reveal>
    </section>
  );
}
