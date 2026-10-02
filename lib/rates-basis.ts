import "server-only";
import type { RateItem } from "@/lib/types";

/**
 * Price basis maths for the rates table.
 *
 * The sheet quotes one line per metric ton, another per 10 kg pack and a
 * third per kg, so the published table cannot be scanned as a comparison —
 * ₹ 140 against ₹ 50,000 says nothing about which line is dearer. The
 * quintal (100 kg) is the unit the mandi actually quotes in, so the page
 * offers it as a normalised view over the same numbers.
 */

export const QUINTAL_KG = 100;

/** `unit` and its qualifier as one phrase: "per 10 kg, ex-plant". */
export function unitLabel(
  item: Pick<RateItem, "unit" | "unitNote">,
): string {
  return item.unitNote ? `${item.unit}, ${item.unitNote}` : item.unit;
}

/** ₹ per quintal as a display price — formatted exactly like the live
 *  sheet overlay ("₹ 5,000"), and undefined while the row is "On request"
 *  so an unpriced line never renders a fabricated number. */
export function quintalPrice(item: RateItem): string | undefined {
  if (item.priceValue === undefined) return undefined;
  const value = (item.priceValue * QUINTAL_KG) / item.unitKg;
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return `₹ ${Math.round(value).toLocaleString("en-IN")}`;
}
