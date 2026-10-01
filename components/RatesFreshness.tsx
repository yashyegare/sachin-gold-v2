import { TimerReset } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface Props {
  /** Newest sheet timestamp across all groups (already IST→Date in
   *  lib/rates-source.ts). Null renders nothing. */
  lastUpdated: Date | null;
}

/**
 * The rates page's prominent freshness signal. For a commodities buyer,
 * "how fresh is this price" is the first thing they check — so the age
 * gets its own band instead of a buried caption: "Updated 12 minutes
 * ago", colored by age (pine fresh → amber day-old → neutral stale) with
 * the absolute timestamp in the title tooltip.
 *
 * Server-rendered relative time — the page revalidates every 5 minutes
 * anyway, so no client ticking is needed; a visitor sees an age computed
 * at most 5 minutes old, which is exactly the honest granularity of the
 * underlying data.
 */
export default async function RatesFreshness({ lastUpdated }: Props) {
  if (!lastUpdated) return null;
  const t = await getTranslations("rates");

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

  const absolute = lastUpdated.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <section className="border-b border-ink/10 bg-white print:hidden">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <p
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
