import { ArrowRight, Factory, Droplets, Warehouse, Truck, Wheat, type LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import BrandPhoto from "@/components/BrandPhoto";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { services } from "@/data/services";

/**
 * "What We Do" — the five services presented as one continuous value
 * chain: sourcing → processing → extraction → storage → delivery.
 *
 * One deep-pine band, five stages readable left-to-right in a single
 * glance: a numbered stage rail (connector dots joined by a flow line
 * that starts gold at sourcing and fades toward delivery) above a slim
 * name row, each entry a full-card link. The photography lives in a
 * shared reveal window on the band's right edge — sweep the row and the
 * photo of the stage under the cursor cross-fades in, with a big stage
 * index matching it. The window is pre-seeded with stage 1 so it never
 * sits blank.
 *
 * Why dark: the page rhythm around this section is white (StatsBand)
 * above and linen (statement) below — a light card grid there would be
 * a third pale band in a row. The dark band also earns the hover reveal:
 * photos surfacing out of deep green reads as premium, and it sets the
 * section apart from the (also card-based) products grid further down.
 *
 * The rail→photo pairing is pure CSS (no JS, no state): rows carry
 * `.sg-stage-N`, photos `.sg-photo-N`, index blocks `.sg-index-N`, all
 * under a `.sg-board` wrapper — the `:has()` rules live in globals.css.
 * Touch/keyboard get the same behaviour via :focus-visible; on touch the first tap focuses the row
 * (lifting its photo) and following the link needs a second tap — the
 * standard hover-preview trade-off, and the service pages remain one
 * tap away regardless.
 *
 * Reduced motion: the reveal lands instantly (global rule) and the
 * photo cross-fade degrades to a simple swap.
 */
const stageIcons: Record<string, LucideIcon> = {
  "commodity-trading": Wheat,
  "pulses-processing": Factory,
  "oil-extraction": Droplets,
  "cold-storage": Warehouse,
  logistics: Truck,
};

export default async function ServicesShowcase() {
  const t = await getTranslations("home.showcase");
  const tServices = await getTranslations("services");

  return (
    <section
      className="relative overflow-hidden bg-pine-deep"
      aria-labelledby="what-we-do"
    >
      {/* Aerial-plant texture at a whisper — the same backdrop WhySachinGold
          uses, so the two dark bands read as one family, not two decisions.
          Never a photograph here at full strength: the hover-reveal window
          below is the section's one moment of photography. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12] [filter:saturate(0.8)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/home/aerial-plant.webp"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-deep/60 via-pine-deep/85 to-pine-deep" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Heading is uncapped so the title holds one line on desktop
            (the old max-w-2xl cap forced "…end to end" to wrap); the
            subtitle keeps its own readable measure. display-md below md
            keeps even the long translated titles to one line on tablets. */}
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wheat-bright">
            {t("eyebrow")}
          </p>
          <h2
            id="what-we-do"
            className="mt-3 font-display text-display-md text-white md:text-display-lg"
          >
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-white/65">{t("subtitle")}</p>
        </Reveal>

        {/* The stage rail + shared photo window. On md+ the window rides
            to the right of the rail; below md it doesn't render at all —
            the rail alone carries the five stages (photos of every stage
            already exist on the service pages one tap away). */}
        {/* Column split: the window takes a 35% share (7/20) — the second
            size-down after the aspect change; the rail absorbs the freed
            width, which also gives the one-line stage titles more room. */}
        <div className="sg-board mt-14 grid items-center gap-12 md:mt-16 md:grid-cols-[minmax(0,13fr)_minmax(0,7fr)] md:gap-14">
          <div className="relative">
            {/* The flow line — vertical spine on mobile, horizontal on md+,
                drawn beneath the connector dots. Gold at the sourcing end,
                fading toward delivery: the chain has a direction. */}
            <span
              aria-hidden="true"
              className="absolute left-[11px] top-6 bottom-6 w-px bg-white/15 md:left-[11px] md:right-2 md:top-[11px] md:bottom-auto md:h-px md:w-auto"
            />

            <ol className="grid gap-2 sm:gap-3 md:grid-cols-5 md:gap-3">
              {services.map((service, i) => {
                const Icon = stageIcons[service.slug] ?? Wheat;
                return (
                  <li
                    key={service.slug}
                    className={`sg-stage sg-stage-${i + 1} relative`}
                  >
                    <Reveal
                      style={{ transitionDelay: `${i * 90}ms` }}
                      className="h-full"
                    >
                      {/* Full-card link: connector dot, stage number, name,
                          one-line note — all one tap target. */}
                      <Link
                        href={service.href}
                        className="group block rounded-sm pb-3 pt-4 outline-none transition-transform duration-300 [transition-timing-function:var(--ease-brand)] hover:-translate-y-1 focus-visible:-translate-y-1 md:pb-0 md:pt-0 md:pr-3"
                      >
                        {/* Stage marker on the rail. The dot fills gold on
                            hover — the flow line lights up stage by stage
                            as you sweep across the chain. */}
                        <span className="relative z-10 flex h-[22px] w-[22px] items-center justify-center md:h-6 md:w-6">
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full border border-white/25 bg-pine-deep transition-colors duration-300 [transition-timing-function:var(--ease-brand)] group-hover:border-wheat group-focus-visible:border-wheat"
                          />
                          <span className="relative font-display text-[11px] leading-none text-white/70 transition-colors duration-300 [transition-timing-function:var(--ease-brand)] group-hover:text-wheat-bright group-focus-visible:text-wheat-bright">
                            {i + 1}
                          </span>
                        </span>

                        <span className="mt-3 flex items-center gap-2 md:mt-4">
                          <Icon
                            size={15}
                            strokeWidth={1.75}
                            aria-hidden="true"
                            className="shrink-0 text-wheat-bright/75 transition-colors duration-300 [transition-timing-function:var(--ease-brand)] group-hover:text-wheat-bright"
                          />
                          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                            {t("stage", { n: i + 1 })}
                          </span>
                        </span>

                        <h3 className="mt-1.5 font-display text-base leading-snug text-white transition-colors duration-300 [transition-timing-function:var(--ease-brand)] group-hover:text-wheat-bright md:text-[1.05rem]">
                          {tServices(`items.${service.slug}.title`)}
                        </h3>

                        {/* Fact-led stage note (translated, real figures);
                            falls back to the short description. Hidden on
                            the smallest screens to keep one-glance density. */}
                        <p className="mt-1.5 hidden text-xs leading-relaxed text-white/50 sm:block">
                          {tServices.has(`items.${service.slug}.stageNote`)
                            ? tServices(`items.${service.slug}.stageNote`)
                            : service.shortDescription}
                        </p>

                        <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-white/55 transition-all duration-300 [transition-timing-function:var(--ease-brand)] group-hover:gap-2.5 group-hover:text-wheat-bright group-focus-visible:text-wheat-bright">
                          {t("explore")}
                          <ArrowRight size={12} aria-hidden="true" />
                        </span>
                      </Link>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Shared reveal window. Five photos and five index blocks sit
              stacked in one frame; each row's hover/focus lifts its own
              pair via the globals.css :has() rules. opacity + z-index
              (not visibility) so the cross-fade is a true fade. The 4/3
              landscape frame matches the photos' own orientation — a
              portrait window here stretched the band and dwarfed the
              rail. Centered against the rail's height, it reads as a
              framed panel, not a second column. */}
          <Reveal className="hidden md:block">
            <div className="showcase-window relative aspect-[4/3] overflow-hidden border border-white/10 shadow-elevated-deep">
              {services.map((service, i) => (
                <BrandPhoto
                  key={service.slug}
                  src={service.image}
                  alt=""
                  sizes="(min-width: 1024px) 30vw, 45vw"
                  imageClassName={`sg-photo sg-photo-${i + 1}`}
                />
              ))}
              {/* Static veil — keeps any photo legible against the dark
                  band without dimming the hovered one into mud. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-pine-deep/45 via-transparent to-pine-deep/10"
              />
              {/* Stage number anchor — one number, always at the bottom
                  left of whichever stage photo is showing. All five
                  blocks stack at the same anchor (the old flex row gave
                  each stage its own slot across the bottom, so the
                  number jumped around); the globals.css rules make
                  exactly one visible at a time. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-5 left-5 z-[3]"
              >
                {services.map((service, i) => (
                  <p
                    key={service.slug}
                    className={`sg-index sg-index-${i + 1} absolute bottom-0 left-0 font-display text-display-lg leading-none text-white [text-shadow:0_2px_18px_rgba(6,19,12,0.6)]`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2.5 rounded-sm border border-white/25 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 [transition-timing-function:var(--ease-brand)] hover:border-wheat hover:bg-wheat hover:text-pine-deep"
          >
            {t("cta")}
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 [transition-timing-function:var(--ease-brand)] group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
