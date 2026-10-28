// Run against npm run dev or npm run start with Playwright installed.
// SPLASH_TEST_URL defaults to http://localhost:3100.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.SPLASH_TEST_URL || 'http://localhost:3100';
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    async function visit(name, options = {}) {
      const context = await browser.newContext({ reducedMotion: options.reduced ? 'reduce' : 'no-preference', viewport: { width: options.mobile ? 390 : 1280, height: 800 } });
      if (options.noBundle) await context.route('**/_next/static/**/*.js', route => route.abort());
      if (options.delay) await context.route('**/_next/static/**/*.js', async route => { await new Promise(r => setTimeout(r, 6000)); await route.continue(); });
      await context.addInitScript(({ seen, blocked }) => {
        if (seen) localStorage.setItem('sg-splash-seen', '1');
        if (blocked) { Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new Error('blocked'); }; }
        window.splashFrames = [];
        window.doneCount = 0;
        window.addEventListener('sg-splash-done', () => window.doneCount++);
        setInterval(() => {
          const el = document.querySelector('.sg-splash');
          if (!el) return;
          const css = getComputedStyle(el);
          const animation = el.getAnimations().find(a => a instanceof CSSAnimation && a.animationName === 'sg-splash-out');
          const timeline = animation ? Number(animation.effect.getComputedTiming().endTime) : null;
          window.splashFrames.push({ t: performance.now(), timeline, visible: css.display !== 'none' && css.visibility !== 'hidden', gate: !!document.querySelector('[aria-labelledby="lang-gate-title"]') });
        }, 25);
      }, { seen: options.seen, blocked: options.blocked });
      const page = await context.newPage();
      await page.goto(base + (options.path || '/'), { waitUntil: 'domcontentloaded' });
      if (options.input) { await page.mouse.click(10, 10); await page.keyboard.press('Shift'); }
      await page.waitForTimeout(options.delay ? 10000 : 6000);
      const result = await page.evaluate(() => ({ frames: window.splashFrames, done: window.doneCount }));
      const visible = result.frames.filter(f => f.visible);
      if (options.skip) assert.equal(visible.length, 0, name);
      else {
        assert.ok(visible.length, name + ': visible');
        const duration = visible.at(-1).t - visible[0].t;
        // Assert the browser's actual animation timeline is within the product
        // requirement. Wall-clock sampling gets 800ms of scheduling/first-paint
        // tolerance on shared CI runners; it must still detect a replay/stall.
        const timelines = result.frames.map(f => f.timeline).filter(t => t !== null);
        assert.ok(timelines.length > 0, name + ': CSS animation started');
        assert.ok(timelines.every(t => t >= 4000 && t <= 5000), name + ': 4–5s CSS timeline');
        assert.ok(duration >= 4400 && duration <= 5500, name + ': sampled visible duration ' + duration);
        assert.equal(result.done, 1, name + ': completion once');
        assert.ok(!visible.some(f => f.gate), name + ': language gate waits');
        console.log(name + ': ' + Math.round(duration) + 'ms');
        if (!options.blocked) {
          assert.equal(await page.evaluate(() => localStorage.getItem('sg-splash-seen')), '1');
          await page.reload();
          assert.equal(await page.locator('.sg-splash').isVisible(), false, name + ': reload skips');
        }
      }
      console.log('PASS ' + name);
      await context.close();
    }
    await visit('first visit and incidental input', { input: true });
    await visit('mobile Marathi homepage', { path: '/mr', mobile: true });
    await visit('returning visitor', { seen: true, skip: true });
    await visit('reduced motion', { reduced: true, skip: true });
    await visit('non-homepage', { path: '/about', skip: true });
    await visit('storage blocked', { blocked: true });
    await visit('delayed hydration', { delay: true });
    await visit('JavaScript bundle unavailable', { noBundle: true });
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
