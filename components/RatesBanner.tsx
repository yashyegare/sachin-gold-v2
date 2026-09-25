import { ArrowRight, TimerReset } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface Props {
  items: { product: string; price: string }[];
  /** Newest per-row sheet timestamp among the shown items, already
   *  formatted ("25 Sep 2026, 07:36 IST"). Null hides the line. */
  updatedOn: string | null;
}

/**
 * Live-rate banner for interior pages — the compact sibling of the home
 * ticker (same pine-deep band, same pulsing TODAY badge, same gold
 * prices), but static rather than scrolling: on a service page the
 * prices are content, not ambient motion. Shows only items the caller
 * picked for that page AND only when the sheet has real numbers — like
 * the ticker, it can never render "₹ --" (the old site's failure).
 *
 * Data comes from the caller (server): the component itself fetches
 * nothing, so a page decides its own spotlight items. Currently used on
 * the service detail pages whose products the sheet prices
 * (oil-extraction, pulses-processing); add it elsewhere by passing items.
 */
export default async function RatesBanner({ items, updatedOn }: Props) {
  if (items.length === 0) return null;
  const t = await getTranslations("rates");

  return (
    <section className="bg-pine-deep print:hidden">
      <div className="mx-auto max-w-6xl px-6 py-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-widest text-wheat-bright">
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wheat-bright opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-wheat-bright" />
            </span>
            {t("bannerToday")}
          </span>

          {/* The items list is the flexible middle: it wraps into further
              lines inside its own column when there are many (oil page
              shows all seven), so the right group is never pushed off
              the row or left orphaned below it. */}
          <ul className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-6 gap-y-1.5">
            {items.map((item) => (
              <li
                key={item.product}
                className="flex items-baseline gap-2 text-sm text-white/85"
              >
                <span>{item.product}</span>
                <span className="font-semibold tabular-nums text-wheat-bright">
                  {item.price}
                </span>
              </li>
            ))}
          </ul>

          {/* Updated + CTA: shrink-proof right edge. Stacked on phones,
              inline from sm up — always right-aligned with the band. */}
          <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-5">
            {updatedOn && (
              <p className="flex items-center gap-1.5 text-xs text-white/50">
                <TimerReset size={13} aria-hidden="true" />
                {t("bannerUpdated", { time: updatedOn })}
              </p>
            )}
            <Link
              href="/rates"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors duration-300 [transition-timing-function:var(--ease-brand)] hover:text-wheat-bright"
            >
              {t("bannerCta")}
              <ArrowRight
                size={13}
                aria-hidden="true"
                className="transition-transform duration-300 [transition-timing-function:var(--ease-brand)] group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
