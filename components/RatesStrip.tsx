import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import RatesTicker from "@/components/RatesTicker";
import { hasLiveRealRates, getLiveTickerRates } from "@/lib/rates-source";

/**
 * The rates strip FIRST, at the very top — the old site's ticker position.
 * One strip, two states driven by one data file:
 * - Real prices exist (priceValue set by the Google Sheet overlay) → the
 *   scrolling ticker, pausable by tap/click, not hover-only.
 * - No real prices yet → the static link strip below. The old site
 *   shipped a ticker showing "₹ --" to production; this site never
 *   will.
 *
 * Shared by Home, Services and Contact so the strip sits in the same
 * position (top of main, above the page's intro band) on every page that
 * carries it — one fetch (cached 5 min), one markup, one fallback.
 */
export default async function RatesStrip() {
  const t = await getTranslations("home");
  const hasRealRates = await hasLiveRealRates();
  const tickerRates = hasRealRates ? await getLiveTickerRates() : [];

  if (hasRealRates) return <RatesTicker rates={tickerRates} />;

  return (
    <Link
      href="/rates"
      className="group block border-b border-ink/10 bg-linen transition-colors hover:bg-[#efeadd]"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <p className="flex items-center gap-2.5 text-sm text-ink/70">
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pine opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-pine" />
          </span>
          <span className="font-semibold uppercase tracking-widest text-pine">
            {t("ratesStrip.live")}
          </span>
          <span className="hidden sm:inline">{t("ratesStrip.items")}</span>
        </p>
        <span className="text-sm font-semibold text-pine transition-transform group-hover:translate-x-0.5">
          {t("ratesStrip.view")} →
        </span>
      </div>
    </Link>
  );
}
