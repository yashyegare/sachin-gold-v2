import CustomerLogoTrack from "@/components/CustomerLogoTrack";
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
 * Desktop uses a pausable running card strip; phones and reduced-motion
 * visitors get a static grid with each customer shown once.
 */
export default async function CustomerLogos() {
  const t = await getTranslations("home.logos");

  const roster = (duplicate = false) => (
    <ul className="sg-customer-half" aria-hidden={duplicate || undefined}>
      {customers.map((customer) => (
        <li key={customer.name}>
          <Image
            src={customer.logo}
            alt={duplicate ? "" : `${customer.name} logo`}
            width={customer.width}
            height={customer.height}
            className="max-w-full object-contain transition-transform duration-200 hover:scale-105"
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

      <CustomerLogoTrack pauseLabel={t("pause")} playLabel={t("play")}>
        {roster()}
        {roster(true)}
      </CustomerLogoTrack>
    </section>
  );
}
