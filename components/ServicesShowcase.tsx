import { ArrowRight, Factory, Droplets, Warehouse, Truck, Wheat, type LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import BrandPhoto from "@/components/BrandPhoto";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { services } from "@/data/services";

/**
 * "What We Do" — the five services presented as one continuous value
 * chain: sourcing → processing → extraction → storage → delivery. The
 * chain metaphor is the business explained in one glance, which a grid
 * of five equal cards could never do.
 *
 * Desktop: horizontal chain — numbered stage markers joined by a flow
 * line, photo cards beneath; the hovered card lifts and brightens its
 * image (pure CSS, no JS).
 * Mobile: the same cards stack vertically with the chain line running
 * down the left edge.
 * Reduced motion: the reveal simply lands instantly (global rule), and
 * hover lifts are cosmetic-only.
 */
const stageIcons: Record<string, LucideIcon> = {
  "commodity-trading": Wheat,
  "pulses-processing": Factory,
  "oil-extraction": Droplets,
  "cold-storage": Warehouse,
  logistics: Truck,
};

const slideImages: Record<string, string> = {
  "commodity-trading": "/images/hero/trading.webp",
  "pulses-processing": "/images/services/pulses-processing.webp",
  "oil-extraction": "/images/hero/extraction.webp",
  "cold-storage": "/images/hero/warehousing.webp",
  logistics: "/images/hero/logistics.webp",
};

export default async function ServicesShowcase() {
  const t = await getTranslations("home.showcase");
  const tServices = await getTranslations("services");

  return (
    <section
      className="mx-auto max-w-6xl px-6 py-24 md:py-28"
      aria-labelledby="what-we-do"
    >
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wheat-dark">
          {t("eyebrow")}
        </p>
        <h2
          id="what-we-do"
          className="mt-3 max-w-2xl font-display text-3xl leading-tight text-ink sm:text-4xl"
        >
          {t("title")}
        </h2>
        <p className="mt-4 max-w-xl text-ink/60">{t("subtitle")}</p>
      </Reveal>

      <div className="relative mt-14">
        {/* The chain line — horizontal on desktop, vertical spine on mobile. */}
        <span
          aria-hidden="true"
          className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-pine/40 via-pine/25 to-pine/10 md:left-0 md:right-0 md:top-[27px] md:h-px md:w-auto md:bg-gradient-to-r"
        />

        <ol className="grid gap-10 md:grid-cols-5 md:gap-4">
          {services.map((service, i) => {
            const Icon = stageIcons[service.slug] ?? Wheat;
            return (
              <li key={service.slug} className="relative">
                <Reveal>
                  {/* Stage marker on the chain */}
                  <div className="relative z-10 flex items-center gap-4 md:block">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-pine/25 bg-white font-display text-lg text-pine shadow-[0_6px_16px_-8px_rgba(10,54,32,0.35)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-wheat-dark md:mt-3 md:text-center">
                      {t("stage", { n: i + 1 })}
                    </p>
                  </div>

                  {/* Card */}
                  <Link
                    href={service.href}
                    className="group mt-4 block border border-ink/10 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-pine/40 hover:shadow-[0_18px_40px_-18px_rgba(22,35,28,0.35)] md:mt-5"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <BrandPhoto
                        src={service.image}
                        alt=""
                        sizes="(min-width: 768px) 20vw, 100vw"
                        imageClassName="opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                      <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-pine-deep/80 text-linen backdrop-blur-sm">
                        <Icon size={15} aria-hidden="true" />
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-base leading-snug text-ink transition-colors group-hover:text-pine">
                        {tServices(`items.${service.slug}.title`)}
                      </h3>
                      {/* Fact-led stage note (translated, real figures);
                          falls back to the short description. */}
                      <p className="mt-2 text-[0.7rem] leading-relaxed text-ink/70">
                        {tServices.has(`items.${service.slug}.stageNote`)
                          ? tServices(`items.${service.slug}.stageNote`)
                          : service.shortDescription}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-wheat-dark transition-all group-hover:gap-2 group-hover:text-pine">
                        {t("explore")}
                        <ArrowRight size={11} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>

      <Reveal className="mt-12 text-center">
        <Link
          href="/services"
          className="group inline-flex items-center gap-2 rounded-sm border border-pine px-7 py-3 text-sm font-semibold text-pine transition-colors hover:bg-pine hover:text-white"
        >
          {t("cta")}
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </Reveal>
    </section>
  );
}
