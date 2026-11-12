import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRateSnapshot } from "../lib/rates-snapshot";
import { unitLabel } from "../lib/rates-basis";
import { getSpecsForService, productSpecs } from "../data/specs";
import {
  failureProperties,
  type FailureReason,
} from "../lib/conversion-events";

test("live oil quotes preserve owner prices and per-kg basis together", () => {
  const { groups } = parseRateSnapshot(
    "name,price\noil,142\nrefined,152\nfatty,250\nacid,150",
  );
  const rows = groups
    .flatMap((g) => g.items)
    .filter((i) => /Soya (Crude|Refined|Fatty|Acid) Oil/.test(i.product));
  assert.deepEqual(
    rows.map((i) => i.priceValue),
    [142, 152, 250, 150],
  );
  for (const row of rows) {
    assert.equal(row.unitKg, 1);
    assert.equal(row.unitKey, "kg");
    assert.match(unitLabel(row), /^per kg,/);
  }
});
test("service commercial terms retain owner-confirmed packaging and lead times", () => {
  const terms = getSpecsForService("commodity-trading");
  for (const [slug, pack] of Object.entries({
    soyabean: "50 kg bag",
    jaggery: "10 kg per DAG",
    "cotton-seed-oil-cake": "50 kg bag",
    tamarind: "50 kg bag",
  }))
    assert.equal(terms.find((t) => t.product.slug === slug)?.spec.packs, pack);
  for (const spec of Object.values(productSpecs))
    assert.equal(spec.lead, "1–2 days");
});
test("failure analytics never forward arbitrary errors or response bodies", () => {
  for (const reason of ["http", "provider", "timeout", "network"] as const)
    assert.deepEqual(failureProperties(reason), { reason });
  assert.deepEqual(failureProperties("PRIVATE_MESSAGE" as FailureReason), {});
  assert.deepEqual(failureProperties(), {});
});

import { ratesJsonLd } from "../lib/rates-schema";
test("published offers carry the correct quantity basis without invented availability", () => {
  const { groups } = parseRateSnapshot("name,price\nnormal,65000\noil,142");
  const schema = ratesJsonLd(groups)!;
  const offers = schema.itemListElement.map((row) => row.item.offers);
  assert.equal(offers.length, 2);
  assert.deepEqual(
    offers.map((offer) => offer.priceSpecification.referenceQuantity.value),
    [1000, 1],
  );
  assert.deepEqual(
    offers.map((offer) => offer.price),
    [65000, 142],
  );
  for (const offer of offers) {
    assert.equal("availability" in offer, false);
    assert.equal(offer.priceSpecification.referenceQuantity.unitCode, "KGM");
  }
  assert.equal(
    ratesJsonLd([{ title: "Empty", updatedOn: null, items: [] }]),
    null,
  );
});
