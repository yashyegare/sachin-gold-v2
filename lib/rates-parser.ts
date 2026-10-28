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
  if (inQuotes) throw new Error("Unclosed CSV quote");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function toNumber(v: string): number | undefined {
  if (!v) return undefined;
  const n = Number(v.replace(/[₹,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** "25/09/2026 07:36:21" → Date (unparseable → null).
 *
 *  The sheet writes wall-clock IST, so the offset is folded in by hand
 *  (minus 5:30) instead of letting the server's own timezone shift the
 *  timestamp by hours. Seconds are optional; invalid calendar values and future timestamps
 *  are rejected instead of rolling into another day. */
export function parseSheetTime(raw: string, now = Date.now()): Date | null {
  const match = raw.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  const [, d, m, y, h, min, sec = "0"] = match;
  const parts = [Number(y), Number(m), Number(d), Number(h), Number(min), Number(sec)];
  const [year, month, day, hour, minute, second] = parts as [number, number, number, number, number, number];
  const wallClock = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  if (wallClock.getUTCFullYear() !== year || wallClock.getUTCMonth() !== month - 1 ||
      wallClock.getUTCDate() !== day || wallClock.getUTCHours() !== hour ||
      wallClock.getUTCMinutes() !== minute || wallClock.getUTCSeconds() !== second) return null;
  const timestamp = new Date(wallClock.getTime() - 330 * 60000);
  return timestamp.getTime() > now + 5 * 60000 ? null : timestamp;
}

/** The whole list is only as fresh as its oldest priced row. Unknown row
 * timestamps prevent a claim that the entire list was updated recently. */
export function oldestPricedTimestamp(items: { priceValue?: number; updatedAt?: string | null }[]): Date | null {
  const priced = items.filter(item => item.priceValue !== undefined);
  if (!priced.length || priced.some(item => !item.updatedAt)) return null;
  const times = priced.map(item => Date.parse(item.updatedAt!));
  return times.some(Number.isNaN) ? null : new Date(Math.min(...times));
}
