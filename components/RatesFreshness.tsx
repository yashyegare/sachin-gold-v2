import { TimerReset } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { company } from "@/data/company";
import { formatStamp } from "@/lib/rates-basis";

interface Props {
  /** Newest sheet timestamp across all groups (already IST→Date in
   *  lib/rates-source.ts). Null renders nothing while the feed is live. */
  lastUpdated: Date | null;
  /** False when the sheet fetch failed and every row below is the static
   *  placeholder. Without this the band simply vanishes, and "we could not
   *  read our own price list" looks exactly like "these products are
   *  quoted on request" — a different fact, and ours to admit. */
  live: boolean;
  /** Viewer's locale, for the timestamp in the tooltip. */
  locale: string;
}

/**
 * The rates page's prominent freshness signal. For a commodities buyer,
 * "how fresh is this price" is the first thing they check — so the age
 * gets its own band instead of a buried caption: "Updated 12 minutes
 * ago", colored by age (pine fresh → amber day-old → neutral stale) with
 * the absolute timestamp in the title tooltip.
 *
 * The age is always carried in the words, never by the dot's colour alone,
 * and both states sit inside a `role="status"` region so the band is read
 * out rather than only noticed.
 *
 * Server-rendered relative time — the page revalidates every 5 minutes
 * anyway, so no client ticking is needed; a visitor sees an age computed
 * at most 5 minutes old, which is exactly the honest granularity of the
 * underlying data.
 */
export default async function RatesFreshness({
  lastUpdated,
  live,
  locale,
}: Props) {
  const t = await getTranslations("rates");

  if (!live) {
    return (
      <section className="border-b border-ink/10 bg-white print:hidden">
        <div
          role="status"
          className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-6 py-4"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-wheat-dark/40 bg-wheat/10 px-4 py-2 text-sm font-semibold text-wheat-dark">
            <TimerReset size={15} aria-hidden="true" />
            {t("fresh.unavailable")}
          </p>
          <p className="text-sm text-ink/70">
            {t("fresh.unavailableHint")}{" "}
            <a
              href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
              className="font-semibold text-pine underline underline-offset-2 transition-colors hover:text-pine-deep"
            >
              {company.phone}
            </a>
          </p>
        </div>
      </section>
    );
  }

  // Live feed that exposes no parseable row timestamp: nothing honest to say.
  if (!lastUpdated) return null;

  const minutes = Math.max(
    0,
    Math.round((Date.now() - lastUpdated.getTime()) / 60000),
  );

  const ageLabel =
    minutes < 1
      ? t("fresh.justNow")
      : minutes < 60
        ? t("fresh.minutes", { minutes })
        : minutes < 24 * 60
          ? t("fresh.hours", { hours: Math.round(minutes / 60) })
          : t("fresh.days", { days: Math.round(minutes / (24 * 60)) });

  // Staleness color: <60min = fresh (pine), <24h = aging (wheat-dark),
  // older = stale (neutral). The dot alone carries the state at a glance.
  const tone =
    minutes < 60
      ? "border-pine/25 bg-linen text-pine"
      : minutes < 24 * 60
        ? "border-wheat-dark/30 bg-wheat/10 text-wheat-dark"
        : "border-ink/15 bg-linen text-ink/60";

  const absolute = formatStamp(lastUpdated, locale);

  return (
    <section className="border-b border-ink/10 bg-white print:hidden">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <p
          role="status"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${tone}`}
          title={t("fresh.absolute", { time: absolute })}
        >
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
          </span>
          <TimerReset size={15} aria-hidden="true" />
          {t("fresh.updatedAgo", { age: ageLabel })}
        </p>
      </div>
    </section>
  );
}
