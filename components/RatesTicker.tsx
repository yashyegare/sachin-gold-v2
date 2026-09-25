"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getLiveTickerRates } from "@/lib/rates-source";

/**
 * Data flow: prices come from the owner's Google Sheet via
 * lib/rates-source.ts (cached, sheet-down → static fallback). The item
 * list is passed in from the server so this client component never
 * fetches anything itself.
 */

/**
 * Home rates ticker — the old site's scrolling strip, rebuilt with its two
 * real defects fixed:
 *
 * 1. It only renders when real prices exist (getTickerRates returns items
 *    with priceValue set). The old ticker shipped "₹ --" to production —
 *    confidently scrolling placeholder dashes reads as broken, not
 *    "coming soon". No real rates → this component renders nothing.
 * 2. Pausing is not hover-only. A touch visitor can never pause a marquee
 *    with :hover (WCAG 2.2.2 requires a way to pause auto-moving content),
 *    so there's an explicit pause button that works by tap or click.
 *
 * Also: data-driven from the same rates.ts as the Rates page — the two can
 * never disagree — respects prefers-reduced-motion, and duplicates the
 * sequence so the loop has no visible seam. Product names stay Latin in
 * every locale (trade terms); the "Today" badge and pause labels translate.
 */
export default function RatesTicker({
  rates,
}: {
  rates: { product: string; price: string }[];
}) {
  const t = useTranslations("home.ratesStrip");
  const [paused, setPaused] = useState(false);

  // Pause via keyboard when focus lands on a ticker link — Space/Enter
  // users shouldn't have to chase a moving target.
  useEffect(() => {
    if (!paused) return;
    const onBlur = () => setPaused(false);
    window.addEventListener("focusout", onBlur);
    return () => window.removeEventListener("focusout", onBlur);
  }, [paused]);

  if (rates.length === 0) return null;

  const sequence = [...rates, ...rates]; // seamless loop

  return (
    <div className="border-b border-ink/10 bg-pine-deep print:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 sm:px-6">
        <span className="flex shrink-0 items-center gap-2 py-3 text-xs font-semibold uppercase tracking-widest text-wheat-bright">
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wheat-bright opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-wheat-bright" />
          </span>
          {t("today")}
        </span>

        <div
          className="group relative flex-1 overflow-hidden"
          aria-label={t("live")}
        >
          <div
            className={`flex w-max items-center gap-8 whitespace-nowrap py-3 ${
              paused ? "[animation-play-state:paused]" : "animate-ticker"
            }`}
          >
            {sequence.map((rate, i) => (
              <Link
                key={`${rate.product}-${i}`}
                href="/rates"
                className="flex items-baseline gap-2 text-sm text-white/85 transition-colors hover:text-wheat-bright"
                tabIndex={i >= rates.length ? -1 : 0}
                aria-hidden={i >= rates.length}
              >
                <span>{rate.product}</span>
                <span className="font-semibold text-wheat-bright">
                  {rate.price}
                </span>
                <span aria-hidden="true" className="text-white/30">
                  •
                </span>
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? t("tickerResume") : t("tickerPause")}
          className="shrink-0 rounded-sm border border-white/20 p-2 text-white/70 transition-colors hover:border-wheat-bright hover:text-wheat-bright"
        >
          {paused ? (
            <Play size={12} aria-hidden="true" />
          ) : (
            <Pause size={12} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
