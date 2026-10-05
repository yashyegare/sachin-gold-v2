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
 *  so an unpriced line never renders a fabricated number.
 *
 *  `en-IN` here is deliberate, not an oversight of the i18n pass: the sheet
 *  writes its own prices in en-IN (lib/rates-source.ts), and Indian locale
 *  data does NOT agree on digit grouping — kn-IN renders 12,34,567 as
 *  1,234,567 and mr-IN in devanagari digits. Grouping the derived column by
 *  the viewer's locale would put two different number systems side by side
 *  in one table, which is worse than a consistent Indian one.
 *
 *  Timestamps are the opposite case: a date is read as words, so those DO
 *  follow the viewer (formatStamp). */
export function quintalPrice(item: RateItem): string | undefined {
  if (item.priceValue === undefined) return undefined;
  const value = (item.priceValue * QUINTAL_KG) / item.unitKg;
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return `₹ ${Math.round(value).toLocaleString("en-IN")}`;
}

const STAMP = {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
} as const;

/** A sheet/pull time in the viewer's language: "25 Sept 2026, 07:36" for
 *  en-IN, "25 செப்., 07:36" for ta. Indian locale, `year` only where the
 *  string stands alone (the per-group caption), and always Latin digits —
 *  `-u-nu-latn` because mr-IN would otherwise render ०-style devanagari
 *  digits that match nothing else on the page. No timezone suffix: the copy
 *  that wraps this already says IST.
 *
 *  The PDF routes must leave the locale at "en": the rate card is the
 *  document that gets forwarded and quoted from, so it prints one
 *  canonical English wording (see data/rates.ts). */
export function formatStamp(date: Date, locale: string, year = false): string {
  const tag = locale.includes("-") ? locale : `${locale}-IN-u-nu-latn`;
  return new Intl.DateTimeFormat(
    tag,
    year ? { ...STAMP, year: "numeric" } : STAMP,
  ).format(date);
}
