import { test } from "node:test";
import assert from "node:assert/strict";
import { quoteFromForm } from "../lib/enquiry";

function quote(overrides: Record<string, string> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    requirement_type: "purchase",
    product: "Toor Dal",
    quantity: "12.5",
    quantity_unit: "metric tonnes",
    destination: "Pune",
    ...overrides,
  }))
    data.set(key, value);
  return quoteFromForm(data);
}

test("structured quotes preserve product, fractional quantity, unit and destination without identity", () => {
  assert.match(quote()!, /Toor Dal[\s\S]*12.5 metric tonnes[\s\S]*Pune/);
  assert.doesNotMatch(quote()!, /email|phone|undefined/);
});
test("invalid or incomplete quotes cannot open a structured WhatsApp enquiry", () => {
  const invalidCases: Record<string, string>[] = [
    { quantity: "0" },
    { quantity: "-1" },
    { quantity: "Infinity" },
    { quantity: "100000001" },
    { product: "unknown" },
    { destination: " " },
    { requirement_type: "unknown" },
    { quantity_unit: "unknown" },
  ];
  for (const overrides of invalidCases) assert.equal(quote(overrides), null);
});
test("storage and transport require their relevant details and exclude stale fields", () => {
  assert.equal(quote({ requirement_type: "transport" }), null);
  assert.match(
    quote({
      requirement_type: "transport",
      pickup: "Udgir",
      storage_days: "90",
    })!,
    /Pickup: Udgir/,
  );
  assert.doesNotMatch(
    quote({
      requirement_type: "transport",
      pickup: "Udgir",
      storage_days: "90",
    })!,
    /Storage:/,
  );
  assert.equal(
    quote({ requirement_type: "storage", storage_days: "0.5" }),
    null,
  );
  assert.equal(
    quote({ requirement_type: "storage", storage_days: "3651" }),
    null,
  );
  assert.match(
    quote({
      requirement_type: "storage",
      storage_days: "90",
      pickup: "Udgir",
    })!,
    /Storage: 90 days/,
  );
  assert.doesNotMatch(
    quote({
      requirement_type: "purchase",
      storage_days: "90",
      pickup: "Udgir",
    })!,
    /Storage:|Pickup:/,
  );
});
