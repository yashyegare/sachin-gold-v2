import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCsv, parseSheetTime, toNumber, oldestPricedTimestamp } from "../lib/rates-parser";
const now = Date.parse("2026-10-28T12:00:00Z");
test("CSV handles commas, escaped quotes, CRLF, and multiline quoted cells", () => {
  assert.deepEqual(parseCsv('name,price,time\r\n"a,""b""", "50,000","first\nsecond"'),
    [["name", "price", "time"], ['a,"b"', " 50,000", "first\nsecond"]]);
  assert.throws(() => parseCsv('name,price\n"unfinished,10'), /quote/);
});
test("price parsing excludes missing, invalid, zero and negative quotes", () => {
  assert.equal(toNumber("₹ 50,000"), 50000);
  for (const value of ["", " ", "N/A", "0", "-10", "Infinity"]) assert.equal(toNumber(value), undefined);
});
test("sheet wall-clock timestamps use IST, including a UTC date boundary", () => {
  assert.equal(parseSheetTime("28/10/2026 01:00:00", now)?.toISOString(), "2026-10-27T19:30:00.000Z");
  assert.equal(parseSheetTime("28/10/2026 01:00", now)?.toISOString(), "2026-10-27T19:30:00.000Z");
});
test("invalid calendar, trailing garbage, future, and non-leap dates are rejected", () => {
  for (const value of ["31/02/2026 12:00", "29/02/2025 12:00", "28/13/2026 12:00", "28/10/2026 24:00", "28/10/2026 12:99", "28/10/2026 12:00 junk", "29/10/2026 12:00"]) assert.equal(parseSheetTime(value, now), null, value);
  assert.ok(parseSheetTime("29/02/2024 12:00", now));
});
test("a newly edited product cannot make old prices appear fresh", () => {
  const old = "2026-10-01T00:00:00Z", recent = "2026-10-28T00:00:00Z";
  assert.equal(oldestPricedTimestamp([{priceValue: 10, updatedAt: recent}, {priceValue: 20, updatedAt: old}])?.toISOString(), new Date(old).toISOString());
  assert.equal(oldestPricedTimestamp([{priceValue: 10, updatedAt: recent}, {priceValue: 20}]), null);
  assert.equal(oldestPricedTimestamp([{updatedAt: old}, {priceValue: 10, updatedAt: recent}])?.toISOString(), new Date(recent).toISOString());
  assert.equal(oldestPricedTimestamp([]), null);
});

import { parseRateSnapshot } from "../lib/rates-snapshot";
test("sheet snapshots retain per-product age and use oldest priced row", () => {
 const snapshot = parseRateSnapshot('name,price,time\nnormal,50000,28/10/2026 12:00\nhighpro,55000,01/10/2026 12:00', 'en', now);
 const items = snapshot.groups.flatMap(g=>g.items);
 assert.equal(items.find(i=>i.product==='Soya DOC (Normal)')?.priceValue,50000);
 assert.equal(items.find(i=>i.product==='Soya DOC (High Pro)')?.updatedAt,'2026-10-01T06:30:00.000Z');
 assert.equal(snapshot.lastUpdated?.toISOString(),'2026-10-01T06:30:00.000Z');
});
test("invalid feed is rejected for the IO layer to fall back safely", () => {
 for (const csv of ['', 'wrong,columns\nnormal,100', 'name,price\nunknown,100', 'name,price\n__proto__,100', 'name,price\n"normal,100']) assert.throws(()=>parseRateSnapshot(csv,'en',now));
});
test("blank quote stays on request; unknown/future age never claims freshness", () => {
 const blank = parseRateSnapshot('name,price,time\nnormal,,28/10/2026 12:00','en',now);
 assert.equal(blank.groups[0]?.items[0]?.priceValue,undefined);
 for (const stamp of ['', '29/10/2026 12:00', '31/02/2026 12:00']) {
  const parsed = parseRateSnapshot('name,price,time\nnormal,50000,'+stamp,'en',now);
  assert.equal(parsed.lastUpdated,null);
 }
});
