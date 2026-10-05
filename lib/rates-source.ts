import "server-only";
import type { RateGroup } from "@/lib/types";
import { rateGroups as staticRateGroups } from "@/data/rates";
import { formatStamp } from "@/lib/rates-basis";

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

// ————— Row key → product mapping (the only place sheet keys are known) —————

/** Maps the employee's sheet keys to the canonical product names in
 *  data/rates.ts. A missing key = that product keeps its static value
 *  ("On request"). Unknown keys are ignored — new rows/columns in the
 *  sheet can't break anything. */
const KEY_TO_PRODUCT: Record<string, string> = {
  normal: "Soya DOC (Normal)",
  highpro: "Soya DOC (High Pro)",
  oil: "Soya Crude Oil",
  refined: "Soya Refined Oil",
  fatty: "Soya Fatty Oil",
  acid: "Soya Acid Oil",
  lecithin: "Soya Lecithin",
  toor: "Toor Dal",
  chana: "Chana Dal",
  besan: "Besan Flour",
};

// ————— CSV parsing (RFC 4180 subset: quoted fields, escaped quotes) —————

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function toNumber(v: string): number | undefined {
  if (!v) return undefined;
  const n = Number(v.replace(/[₹,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** "25/09/2026 07:36:21" → Date (unparseable → null).
 *
 *  The sheet writes wall-clock IST, so the offset is folded in by hand
 *  (minus 5:30) instead of letting the server's own timezone shift the
 *  timestamp by hours. Seconds are optional (the employee has written both
 *  shapes), and the match is deliberately not anchored at the end — a
 *  trailing token in the cell must not cost the page its "Updated" line. */
function parseSheetTime(raw: string): Date | null {
  const m = raw.match(
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/,
  );
  if (!m) return null;
  const ist = new Date(
    Date.UTC(
      Number(m[3]),
      Number(m[2]) - 1,
      Number(m[1]),
      Number(m[4]) - 5,
      Number(m[5]) - 30,
      Number(m[6] ?? 0),
    ),
  );
  return Number.isNaN(ist.getTime()) ? null : ist;
}

/** "25/09/2026 07:36:21" → "25 Sept 2026, 07:36 IST" (unparseable → null).
 *  Localised month names, but "en" from the PDF routes (WinAnsi font). */
export function formatSheetTime(raw: string, locale = "en"): string | null {
  const ist = parseSheetTime(raw);
  return ist ? `${formatStamp(ist, locale, true)} IST` : null;
}

// ————— The overlay: live sheet values on top of the static shape —————

export interface LiveRates {
  groups: RateGroup[];
  /** Where this snapshot came from. "fallback" is rendered to visitors as
   *  "live feed unavailable" by RatesFreshness — it is not a dev-only
   *  detail, because the rows it produces look identical to products that
   *  are genuinely quoted on request. */
  source: "sheet" | "fallback";
  /** Newest per-row sheet timestamp across ALL groups, as a Date (null
   *  when the sheet exposes no parseable time). The rates page surfaces
   *  this as its prominent "Updated Xm ago" freshness signal — for a
   *  commodities buyer, price age is the first thing they check. */
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
    const rows = parseCsv(csv);
    if (rows.length < 2) throw new Error("sheet empty");

    const header = (rows[0] ?? []).map((h) => h.trim().toLowerCase());
    const nameCol = header.indexOf("name");
    const priceCol = header.indexOf("price");
    const timeCol = header.indexOf("time");
    if (nameCol === -1 || priceCol === -1) throw new Error("sheet columns");

    const byProduct = new Map<string, { price: string; time: string }>();
    for (const row of rows.slice(1)) {
      const key = (row[nameCol] || "").trim().toLowerCase();
      const product = KEY_TO_PRODUCT[key];
      if (!product) continue;
      byProduct.set(product, {
        price: (row[priceCol] || "").trim(),
        time: timeCol >= 0 ? (row[timeCol] || "").trim() : "",
      });
    }
    if (byProduct.size === 0) throw new Error("no mapped rows");

    // Newest parseable timestamp across all mapped rows — a single
    // Date, independent of the per-group display strings below.
    let lastUpdated: Date | null = null;
    for (const { time } of byProduct.values()) {
      const parsed = parseSheetTime(time);
      if (parsed && (!lastUpdated || parsed > lastUpdated))
        lastUpdated = parsed;
    }

    const groups: RateGroup[] = staticRateGroups.map((group) => {
      const items = group.items.map((item) => {
        const live = byProduct.get(item.product);
        if (!live) return item;
        const priceValue = toNumber(live.price);
        return {
          ...item,
          // A blank or non-numeric cell keeps "On request" — never
          // render "₹ NaN" or an empty price.
          price:
            priceValue !== undefined
              ? `₹ ${priceValue.toLocaleString("en-IN")}`
              : item.price,
          ...(priceValue !== undefined ? { priceValue } : {}),
        };
      });

      // Group "updated" = newest timestamp among items priced this pass.
      let updatedOn: string | null = null;
      for (const item of group.items) {
        const t = byProduct.get(item.product)?.time;
        if (!t) continue;
        const formatted = formatSheetTime(t, locale);
        if (formatted) {
          updatedOn = formatted;
          break; // sheet rows share one edit timestamp in practice
        }
      }
      return { ...group, items, updatedOn };
    });

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
