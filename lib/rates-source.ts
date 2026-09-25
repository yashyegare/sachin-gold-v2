import "server-only";
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
 * static fallback from data/rates.ts. A broken feed must never break the
 * page — it degrades to "On request" rows, the exact pre-launch state.
 */

export const RATES_SHEET_ID =
  process.env.RATES_SHEET_ID || "1BGvvfsJsbqo6Lr-tv_QMro1iZRcRRNVZI9jNRatzdFE";
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${RATES_SHEET_ID}/gviz/tq?tqx=out:csv`;

/** Per-item revalidation window (seconds) for the fetch cache. Indicative
 *  prices move slowly; five minutes keeps published pages fresh without
 *  hammering Google. The /api/revalidate-rates webhook can force it lower. */
export const RATES_REVALIDATE_SECONDS = 300;

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

/** "25/09/2026 07:36:21" → "25 Sep 2026, 07:36 IST" (unparseable → null). */
export function formatSheetTime(raw: string): string | null {
  const m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
  if (!m) return null;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${m[1]} ${months[Number(m[2]) - 1]} ${m[3]}, ${m[4]}:${m[5]} IST`;
}

// ————— The overlay: live sheet values on top of the static shape —————

export interface LiveRates {
  groups: RateGroup[];
  /** Where this snapshot came from — dev diagnostics / logging. */
  source: "sheet" | "fallback";
}

export async function getLiveRateGroups(): Promise<LiveRates> {
  try {
    const res = await fetch(SHEET_CSV_URL, {
      next: { revalidate: RATES_REVALIDATE_SECONDS, tags: ["rates"] },
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
        const formatted = formatSheetTime(t);
        if (formatted) {
          updatedOn = formatted;
          break; // sheet rows share one edit timestamp in practice
        }
      }
      return { ...group, items, updatedOn };
    });

    return { groups, source: "sheet" };
  } catch {
    // Google down / sheet private / parse garbage — degrade gracefully.
    return { groups: staticRateGroups, source: "fallback" };
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
