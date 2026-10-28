# Reliability, performance and security release

## Runtime and deployment

This branch moves to Next.js 16.4.3 and React 19.3.1. Use Node.js 22 or newer locally and on Vercel. Locale routes and PDF handlers use asynchronous params, the locale middleware is now proxy.ts, and lint uses the ESLint flat configuration.

The production canonical origin defaults to https://sachingold.com. NEXT_PUBLIC_SITE_URL can override it at build time. Before domain cutover, verify that the primary domain serves the same deployment, its TLS certificate is ready, and redirects/canonicals/hreflang/social image links use that one origin. This branch does not modify DNS or Vercel domain bindings.

Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to the inbox's real public routing key for production. The CI key is intentionally fake: browser checks intercept every form submission and never send enquiries. The mailto fallback remains available when no key is configured.

For instant rate updates, follow docs/dynamic-rates.md and install the authorized spreadsheet edit trigger. Merely naming a function onEdit does not authorize URL Fetch. The webhook returns 429 plus Retry-After during its debounce window; the documented installable handler retries a trailing edit once. These external spreadsheet trigger settings are not changed by merging application code.

## Changes

- Fixed hydration mismatches by using the locale-stripped navigation pathname consistently on the server and client.
- Removed unused Marcellus/Noto Serif families and stopped preloading unrelated script fonts. A returning English visit uses two font files instead of eleven in the baseline measurement. The first-visit language prompt can still load fonts needed to show the available language names.
- Reveal sections render visibly without JavaScript. Observer effects opt into animation and have a CSS fail-open fallback.
- The hero uses one timeout, independent explicit-pause/hover/focus state, and manual selectors even under reduced motion. The ticker also preserves explicit pause across focus changes.
- Enquiry requests abort after twelve seconds, reject failed HTTP responses, preserve entered values on failure, and allow explicit retry. Field lengths are bounded.
- Rate parsing rejects malformed CSV, impossible/future timestamps, and invalid numeric quotes. Each product retains its own timestamp. Group/list summaries conservatively use the oldest priced row, and are omitted if a priced row has unknown age. Table, WhatsApp share text and rate PDFs retain product update times. Tickers use “Published rates” rather than an unconditional “Today” claim.
- Invisible floating contact links are excluded from keyboard and accessibility navigation. Language-prompt open/close events prevent the fallback timer from placing contact buttons underneath the card. Dismissing the prompt keeps the current locale.
- Count-up timers clean up on unmount; accessible stat names include units/suffixes.
- Production and development dependency audits are clean. A same-major selector-parser override patches the version pinned by the typography plugin.

## Local checks

1. npm ci
2. npx playwright install chromium
3. npm run lint
4. npm run typecheck
5. npm run test:unit
6. npm audit --audit-level=moderate
7. Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to local-mocked-access-key in the build environment, then run npm run build.
8. Set RATES_REVALIDATE_SECRET and TEST_WEBHOOK_SECRET to the same disposable local test value. Start npm run start -- --port 3100.
9. In another terminal, run npm run test:browser, then npm run test:splash. Set TEST_WEBHOOK_SECRET in the browser-test environment too to exercise authenticated webhook throttling. All Web3Forms requests are mocked; the test access key must never be used for production delivery.

SPLASH_TEST_URL can override the local base URL. Run the full suite against a production build: development injects CSS through scripts, so intentionally delaying JavaScript also delays style availability.

The release-checks workflow performs the same validation on pushes and pull requests and uploads the server log on failure. Browser tests cover the six locales, active navigation, runtime/hydration errors, an English font budget, carousel pause/resume/reduced motion, mocked form failure/retry/success/timeout, PDF/social routes, webhook authentication/throttling, language-card/floating-link coordination, and content with JavaScript disabled. Eight splash scenarios are retained. Unit checks cover CSV, price parsing, IST conversion, invalid/future dates, mixed-age snapshots, and malformed-feed rejection.

## Verified on this branch

Next.js production build generated all 117 static outputs. Lint, type checking, eight unit cases, the production browser suite, and the eight splash cases passed. The full npm dependency audit reported zero known vulnerabilities. Browser checks found no runtime/hydration errors across the key routes and all six locales. A fresh returning English context loaded two font files totaling 134,304 bytes (baseline: eleven files totaling 937,456 bytes). Mobile checks at 390px on English/Marathi home, Marathi rates, and Tamil oil extraction found no horizontal document overflow. These are local production-build measurements, not field performance percentiles.
