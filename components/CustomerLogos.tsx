import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { customers } from "@/data/customers";

/**
 * "Our Customers" trust band — the five real customer logos from the old
 * services.html page, grayscale so the brand palette stays disciplined.
 *
 * Pure-CSS infinite marquee — the old site's own ticker technique, zero JS
 * shipped. The sequence renders twice for a seamless loop. Pauses on hover
 * (desktop) and while any logo has keyboard focus; the global
 * prefers-reduced-motion rule stops it entirely, leaving a static, fully
 * readable row. Duplicated logos are aria-hidden and untabbable so screen
 * readers hear the list exactly once.
 */
export default async function CustomerLogos() {
  const t = await getTranslations("home.logos");

  return (
    <section aria-label={t("tagline")} className="border-y border-ink/10">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
          {t("tagline")}
        </p>
      </div>

      <div
        className="marquee-paused overflow-hidden pb-12"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <ul className="animate-marquee flex w-max items-center gap-16 pr-16">
          {[...customers, ...customers].map((customer, i) => (
            <li
              key={`${customer.name}-${i}`}
              aria-hidden={i >= customers.length}
            >
              <Image
                src={customer.logo}
                alt={i < customers.length ? `${customer.name} logo` : ""}
                width={128}
                height={64}
                className="h-11 w-auto object-contain opacity-60 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0 sm:h-12"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
