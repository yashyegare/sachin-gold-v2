const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.SPLASH_TEST_URL || "http://localhost:3100";
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    permissions: ["clipboard-read", "clipboard-write"],
  });
  await context.addInitScript(() => {
    localStorage.setItem("sg-splash-seen", "1");
    localStorage.setItem("sg-lang-choice", "en");
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.route("https://wa.me/**", (route) => route.abort());
  page.on("popup", (popup) => popup.close().catch(() => {}));
  try {
    await page.goto(base + "/services");
    const catalogue = page.locator("[data-product-catalogue]");
    const total = await catalogue.locator("li").count();
    assert.ok(total > 10);
    await page.locator("#catalogue-search").fill("  TOOR  ");
    await page.waitForFunction(() =>
      document
        .querySelector('[data-product-catalogue] [role="status"]')
        .textContent.includes("1 results"),
    );
    assert.equal(await catalogue.locator("li").count(), 1);
    await page.locator("#catalogue-search").fill("no-such-product");
    assert.equal(await catalogue.locator("li").count(), 0);
    await catalogue.getByRole("button", { name: "Reset", exact: true }).click();
    assert.equal(await catalogue.locator("li").count(), total);
    await catalogue.locator('[role="group"] button').nth(1).click();
    assert.ok((await catalogue.locator("li").count()) < total);
    await catalogue.getByRole("button", { name: "Reset", exact: true }).click();
    console.log(
      "PASS catalogue search, category intersection, empty state and reset",
    );

    await page.goto(base + "/rates");
    await page.locator("#rates-search").fill("toor");
    assert.equal(await page.locator("tbody tr").count(), 1);
    const copy = page.getByRole("button", {
      name: "Copy rate: Toor Dal",
      exact: true,
    });
    await copy.click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    assert.match(copied, /Toor Dal/);
    assert.match(copied, /Indicative rate/);
    assert.match(copied, /per kg/);
    await page
      .locator("[data-rate-search]")
      .getByRole("button", { name: "Reset", exact: true })
      .click();
    assert.equal(await page.locator("tbody tr").count(), 10);
    await context.grantPermissions([]);
    await page.evaluate(() =>
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => {
            throw Error("denied");
          },
        },
      }),
    );
    await page
      .getByRole("button", { name: "Copy rate: Toor Dal", exact: true })
      .click();
    assert.ok(
      await page
        .getByText("Could not copy. Select and copy the rate text.", {
          exact: true,
        })
        .last()
        .isVisible(),
    );
    console.log("PASS rate search, unit-aware copy and clipboard denial");

    await page.goto(base + "/services/pulses-processing");
    await page
      .getByRole("link", { name: "Build your enquiry", exact: true })
      .first()
      .click();
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[name="product"]')?.value),
    );
    assert.ok(new URL(page.url()).searchParams.get("product"));
    console.log("PASS product-prefilled quote links");
    await page.goto(base + "/contact#enquiry");
    const builder = page.locator("[data-enquiry-builder]");
    assert.equal(await builder.count(), 1);
    await builder.getByRole("link", { name: "Continue on WhatsApp" }).click();
    await page.locator('[data-quote-error][role="alert"]').waitFor();
    await page.waitForFunction(() =>
      document.activeElement?.hasAttribute("data-quote-error"),
    );
    await page.locator('[name="product"]').selectOption({ label: "Toor Dal" });
    await page.locator('[name="quantity"]').fill("12.5");
    await page.locator('[name="destination"]').fill("Pune");
    await page.waitForFunction(
      () => !document.querySelector('[name="message"]').required,
    );
    await builder.getByRole("link", { name: "Continue on WhatsApp" }).click();
    let message = new URL(
      await builder.locator("a").getAttribute("href"),
    ).searchParams.get("text");
    assert.match(message, /Toor Dal[\s\S]*12.5 metric tonnes[\s\S]*Pune/);
    await page.locator('[name="requirement_type"]').selectOption("transport");
    assert.equal(await page.locator('[name="pickup"]').count(), 1);
    await page.locator('[name="pickup"]').fill("Udgir");
    await builder.getByRole("link", { name: "Continue on WhatsApp" }).click();
    message = new URL(
      await builder.locator("a").getAttribute("href"),
    ).searchParams.get("text");
    assert.match(message, /Pickup: Udgir/);
    await page.locator('[name="requirement_type"]').selectOption("storage");
    assert.equal(await page.locator('[name="pickup"]').count(), 0);
    await page.locator('[name="storage_days"]').fill("30");
    await builder.getByRole("link", { name: "Continue on WhatsApp" }).click();
    message = new URL(
      await builder.locator("a").getAttribute("href"),
    ).searchParams.get("text");
    assert.match(message, /Storage: 30 days/);
    assert.doesNotMatch(message, /Pickup:/);
    let payload = "";
    await page.route("https://api.web3forms.com/submit", (route) => {
      payload = route.request().postData();
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"success":true}',
      });
    });
    await page.locator('[name="name"]').fill("UX test");
    await page.locator('[name="email"]').fill("test@example.invalid");
    await page.locator('form button[type="submit"]').click();
    await page.locator("form").waitFor({ state: "detached" });
    assert.match(payload, /Storage: 30 days/);
    assert.match(payload, /Toor Dal/);
    await page.waitForFunction(
      () => document.activeElement?.getAttribute("role") === "status",
    );
    console.log(
      "PASS invalid quote recovery; purchase/storage/transport WhatsApp context; mocked email payload and success focus",
    );

    for (const locale of ["en", "hi", "mr", "kn", "te", "ta"]) {
      await page.goto(
        base + (locale === "en" ? "" : "/" + locale) + "/contact",
      );
      assert.equal(await page.locator("[data-enquiry-builder]").count(), 1);
      assert.ok(
        await page.locator("[data-enquiry-builder] legend").textContent(),
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        locale + " horizontal overflow",
      );
    }
    console.log("PASS all six locales and mobile form width");
    await context.clearCookies();

    await page.goto(base + "/about");
    const dock = page.locator(".sg-mobile-contact");
    await page.waitForFunction(
      () =>
        document
          .querySelector(".sg-mobile-contact")
          .getAttribute("aria-hidden") === "false",
    );
    assert.equal(await dock.locator("a").count(), 3);
    await page.locator('button[aria-controls="mobile-nav"]').click();
    await page.waitForFunction(() => document.querySelector(".sg-mobile-contact").getAttribute("aria-hidden") === "true");
    await page.locator('button[aria-controls="mobile-nav"]').click();
    await page.waitForFunction(() => document.querySelector(".sg-mobile-contact").getAttribute("aria-hidden") === "false");
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document
          .querySelector(".sg-mobile-contact")
          .getAttribute("aria-hidden") === "true",
    );
    assert.equal(await dock.evaluate((node) => node.inert), true);
    await page.goto(base + "/contact#enquiry");
    await page.locator('[name="name"]').focus();
    await page.waitForFunction(
      () =>
        document
          .querySelector(".sg-mobile-contact")
          .getAttribute("aria-hidden") === "true",
    );
    console.log("PASS mobile dock, footer avoidance, keyboard/form avoidance");

    await page.goto(base + "/about");
    const pdf = page.locator("a.sg-dl").first();
    await page.waitForFunction(
      () =>
        document
          .querySelector(".sg-mobile-contact")
          .getAttribute("aria-hidden") === "false",
    );
    await page.route("**/profile.pdf", (route) =>
      route.fulfill({ status: 503, body: "unavailable" }),
    );
    await pdf.click();
    await page
      .getByText("Download failed. Please try again.", { exact: true })
      .waitFor();
    await page.unroute("**/profile.pdf");
    const download = page.waitForEvent("download");
    await pdf.click();
    await download;
    await page.getByText("Download started", { exact: true }).waitFor();
    console.log("PASS PDF failure, retry and actual download");

    for (const width of [360, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + "/services");
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        "catalogue width " + width,
      );
      await page.goto(base + "/rates");
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        "rates width " + width,
      );
    }
    await page.goto(base + "/");
    assert.equal(
      await page.locator(".sg-logo-static .sg-logo-half").count(),
      1,
    );
    assert.equal(
      await page
        .locator(".sg-logo-track")
        .evaluate((node) => getComputedStyle(node).animationName),
      "none",
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS responsive widths, static customer roster and no runtime errors",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
