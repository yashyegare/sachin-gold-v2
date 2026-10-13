import "server-only";
import type { RateItem } from "@/lib/types";

/**
 * Price basis maths for the rates table.
 *
 * The sheet quotes one line per metric ton, another per 10 kg pack and a
 * third per kg. Each row prints the line exactly as the desk quotes it, in
 * the reader's language — `unitLabel` folds the unit and its qualifier into
 * one phrase so a table cell and the WhatsApp share text say the same thing.
 */

/** `unit` and its qualifier as one phrase: "per 10 kg, ex-plant". */
export function unitLabel(
  item: Pick<RateItem, "unit" | "unitNote">,
): string {
  return item.unitNote ? `${item.unit}, ${item.unitNote}` : item.unit;
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
