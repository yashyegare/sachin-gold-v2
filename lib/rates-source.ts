import "server-only";
import { parseRateSnapshot } from "@/lib/rates-snapshot";
import type { RateGroup } from "@/lib/types";
import { rateGroups as staticRateGroups } from "@/data/rates";

/**
 * Live rates from the owner's Google Sheet — the same sheet the old site
 * fed through SheetDB, now read directly.
 *
 * WHY NOT SHEETDB: SheetDB was only ever a middleman turning the sheet
 * into JSON. The sheet's own "publish to web" CSV export does that for
 * free, with no account, no vendor, no request caps. The employee's
 * workflow is unchanged: he edits the same sheet he always edited.
 *
 * SHEET CONTRACT (verified live against the real sheet):
 *   name,price,time  →  normal,highpro,oil,refined,fatty,acid,lecithin,
 *                       toor,chana,besan
 * `time` is a per-row timestamp ("25/09/2026 07:36:21") — the employee's
 * own habit; the source of the "Updated" line on the site.
 *
 * FAILURE POLICY: Google is down / slow / returns garbage → serve the
 * static fallback from data/rates.ts, and say so. A broken feed must never
 * break the page, but it must not wear the same face as "this product is
 * quoted on request" either — those are different facts for a buyer, and
 * only one of them is ours to fix. `source` is what the rates band reads
 * to keep them apart.
 */

export const RATES_SHEET_ID =
  process.env.RATES_SHEET_ID || "1BGvvfsJsbqo6Lr-tv_QMro1iZRcRRNVZI9jNRatzdFE";
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${RATES_SHEET_ID}/gviz/tq?tqx=out:csv`;

/** Per-item revalidation window (seconds) for the fetch cache. Indicative
 *  prices move slowly; five minutes keeps published pages fresh without
 *  hammering Google. The /api/revalidate-rates webhook can force it lower. */
export const RATES_REVALIDATE_SECONDS = 300;

/** Hard ceiling on a single sheet request. Without it a Google endpoint
 *  that accepts the connection and never answers parks every render that
 *  misses cache — the ISR pass, the webhook pass, and whoever is unlucky
 *  enough to be first through the door. Eight seconds is generous for a
 *  ~1 KB CSV and short enough to fail before the platform's own limit. */
const RATES_FETCH_TIMEOUT_MS = 8000;

// ————— The overlay: live sheet values on top of the static shape —————

export interface LiveRates {
  groups: RateGroup[];
  /** Where this snapshot came from. "fallback" is rendered to visitors as
   *  "live feed unavailable" by RatesFreshness — it is not a dev-only
   *  detail, because the rows it produces look identical to products that
   *  are genuinely quoted on request. */
  source: "sheet" | "fallback";
  /** Oldest timestamp across priced rows; null if any priced row lacks a valid timestamp. */
  lastUpdated: Date | null;
}

export async function getLiveRateGroups(
  // Locale for the per-group "Updated" caption (a month name is words, so
  // it follows the reader). The PDF routes leave it at "en" — a forwarded
  // trade document prints one canonical wording. Prices never use this:
  // they stay en-IN by design, see lib/rates-basis.ts.
  locale = "en",
): Promise<LiveRates> {
  try {
    const res = await fetch(SHEET_CSV_URL, {
      next: { revalidate: RATES_REVALIDATE_SECONDS, tags: ["rates"] },
      signal: AbortSignal.timeout(RATES_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`sheet ${res.status}`);
    const csv = await res.text();
    const { groups, lastUpdated } = parseRateSnapshot(csv, locale);
    return { groups, source: "sheet", lastUpdated };
  } catch (error) {
    // Google down / sheet private / parse garbage / timed out — degrade
    // gracefully, but leave a trace. This is the only signal anyone has
    // that the feed is broken: the page itself keeps rendering, and the
    // rates band only says "unavailable" to whoever reads it.
    console.error(
      "[rates] live feed unavailable, serving fallback:",
      error instanceof Error ? error.message : error,
    );
    return { groups: staticRateGroups, source: "fallback", lastUpdated: null };
  }
}

/** Ticker feed: priority items with a real number. Mirrors the static
 *  getTickerRates() contract so the ticker can never render dashes. */
export async function getLiveTickerRates(): Promise<
  { product: string; price: string }[]
> {
  const { groups } = await getLiveRateGroups();
  return groups
    .flatMap((g) => g.items)
    .filter((i) => i.priceValue !== undefined)
    .map(({ product, price }) => ({ product, price }));
}

/** Gates the ticker/JSON-LD exactly like the static hasRealRates(). */
export async function hasLiveRealRates(): Promise<boolean> {
  const { groups } = await getLiveRateGroups();
  return groups.some((g) => g.items.some((i) => i.priceValue !== undefined));
}
