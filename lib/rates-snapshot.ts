import type { RateGroup } from "@/lib/types";
import { rateGroups as staticRateGroups } from "@/data/rates";
import { formatStamp } from "@/lib/rates-basis";
import { parseCsv, parseSheetTime, toNumber, oldestPricedTimestamp } from "@/lib/rates-parser";

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

/** Validate and overlay a complete sheet export. Throws for an invalid feed;
 * the IO layer reports failure and supplies the static on-request fallback. */
export function parseRateSnapshot(csv: string, locale = "en", now = Date.now()) {
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
    if (typeof product !== "string") continue;
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
        updatedAt: parseSheetTime(live.time, now)?.toISOString() ?? null,
        // A blank or non-numeric cell keeps "On request" — never
        // render "₹ NaN" or an empty price.
        price:
          priceValue !== undefined
            ? `₹ ${priceValue.toLocaleString("en-IN")}`
            : item.price,
        ...(priceValue !== undefined ? { priceValue } : {}),
      };
    });

    const oldest = oldestPricedTimestamp(items);
    const updatedOn = oldest ? `${formatStamp(oldest, locale, true)} IST` : null;
    return { ...group, items, updatedOn };
  });

  const lastUpdated = oldestPricedTimestamp(groups.flatMap(group => group.items));
  return { groups, lastUpdated };
}
