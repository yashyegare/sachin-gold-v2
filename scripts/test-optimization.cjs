const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const en = require("../messages/en.json");
const base = process.env.SPLASH_TEST_URL || "http://localhost:3100";
(async () => {
  const browser = await chromium.launch();
  try {
    for (const noBundle of [false, true]) {
      const context = await browser.newContext({
        reducedMotion: "no-preference",
      });
      if (noBundle)
        await context.route("**/_next/static/**/*.js", (r) => r.abort());
      await context.addInitScript(() => {
        window.doneCount = 0;
        window.addEventListener("sg-splash-done", () => window.doneCount++);
      });
      const page = await context.newPage();
      await page.goto(base, { waitUntil: "domcontentloaded" });
      await page.locator("[data-splash-skip]").click();
      assert.equal(await page.locator(".sg-splash").isVisible(), false);
      assert.equal(await page.locator("[data-splash-skip]").isVisible(), false);
      assert.equal(await page.evaluate(() => window.doneCount), 1);
      assert.equal(
        await page.evaluate(() => document.activeElement.id),
        "main-content",
      );
      await page.waitForTimeout(150);
      assert.equal(await page.evaluate(() => window.doneCount), 1);
      await context.close();
    }
    console.log(
      "PASS splash Skip and focus before hydration and with unavailable bundles",
    );
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(base + "/services/oil-extraction");
    assert.equal(
      await page.locator('meta[name="description"]').getAttribute("content"),
      en.services.items["oil-extraction"].description,
    );
    assert.ok(
      await page
        .getByRole("heading", { name: "Prepare your enquiry" })
        .isVisible(),
    );
    await page.goto(base + "/rates");
    const offers = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) =>
        nodes.flatMap((n) => {
          const d = JSON.parse(n.textContent);
          return (
            d.itemListElement?.map((i) => i.item?.offers).filter(Boolean) || []
          );
        }),
      );
    for (const offer of offers) {
      assert.equal(offer.availability, undefined);
      assert.equal(offer.priceSpecification.referenceQuantity.unitCode, "KGM");
      assert.ok(
        [1, 1000].includes(offer.priceSpecification.referenceQuantity.value),
      );
    }

    console.log(
      "PASS complete service metadata, buyer guidance and unit-aware rate schema without stock claims",
    );
    await page.goto(base + "/contact");
    await page.evaluate(() => {
      window.events = [];
      window.va = (type, event) => {
        if (type === "event") window.events.push(event);
      };
    });
    await page.locator('[name="product"]').selectOption({ label: "Toor Dal" });
    await page.locator('[name="quantity"]').fill("25");
    await page.locator('[name="destination"]').fill("PRIVATE_CITY");
    await page.locator('[name="name"]').fill("PRIVATE_NAME");
    await page.locator('[name="email"]').fill("private@example.invalid");
    await page.route("https://api.web3forms.com/submit", (r) =>
      r.fulfill({ status: 503, body: "PRIVATE_RESPONSE" }),
    );
    await page.locator('form button[type="submit"]').click();
    await page.locator('form [role="alert"]').waitFor();
    const recovery = page.getByRole("link", {
      name: "Send your requirement on WhatsApp",
    });
    assert.match(
      new URL(await recovery.getAttribute("href")).searchParams.get("text"),
      /Toor Dal[\s\S]*25[\s\S]*PRIVATE_CITY/,
    );
    let events = await page.evaluate(() => window.events);
    assert.equal(
      events.filter((e) => e.name === "enquiry_form_start").length,
      1,
    );
    assert.equal(
      events.filter((e) => e.name === "enquiry_quote_submit").length,
      1,
    );
    assert.equal(
      events.find((e) => e.name === "enquiry_form_error").data.reason,
      "http",
    );
    assert.equal(
      events.filter((e) => e.name === "enquiry_quote_success").length,
      0,
    );
    await page.unroute("https://api.web3forms.com/submit");
    await page.route("https://api.web3forms.com/submit", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"success":true}',
      }),
    );
    await page.locator('form button[type="submit"]').click();
    await page.locator("form").waitFor({ state: "detached" });
    events = await page.evaluate(() => window.events);
    assert.equal(
      events.filter((e) => e.name === "enquiry_quote_success").length,
      1,
    );
    assert.ok(
      !/PRIVATE|private@/.test(JSON.stringify(events)),
      "analytics omit enquiry text and identities",
    );
    console.log(
      "PASS form start, structured quote submit/success, categorized failure and WhatsApp recovery; no real submissions",
    );
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
