# Buyer enquiry and interaction improvements

All changes are on existing routes. No new product pages or product claims are introduced.

- `/services`: catalogue search combines with existing category filters, announces result counts, and offers empty/reset states.
- `/rates`: searchable categories, per-product copy with the price unit, update time and indicative-rate disclaimer. Clipboard failures retain selectable text and show recovery guidance.
- `/contact#enquiry`: purchase, storage and transport quote builder. Relevant extra fields appear for storage and transport. WhatsApp requires a known product, positive quantity, unit and destination; storage needs whole days and transport needs pickup city. No name/email is required for WhatsApp. A complete quote makes the email message optional; identity validation, timeout, failure/retry and mail-client fallback remain.
- Existing service product cards offer product-prefilled quote links. Only known product slugs are accepted. Quote values are not persisted or sent to analytics.
- Mobile Call / WhatsApp / Enquire bar respects the language prompt and hero controls, and hides around the form, footer, focused inputs, mobile menu and dialogs. Desktop retains the two existing floating actions.
- PDF links retain native no-JavaScript behavior and modified clicks; enhanced clicks show preparation, actual download-start, and failure/retry states. Starting a download does not claim it was saved.
- Static customer logo roster reduces competing motion. Filters, button presses and FAQ transitions remain subtle and respect reduced-motion settings. The 4.7-second first-visit splash is unchanged.
- New interface strings exist in all six supported locales. Product trade names remain as provided by the existing catalogue.

## Validation

Use Node 22 or later. Build with `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=ci-mocked-access-key` to exercise mocked provider requests without real submissions. Start the production server on port 3100 (or set `SPLASH_TEST_URL`).

Run `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`, `npm run test:ux`, `npm run test:seo`, `npm run test:browser`, and `npm run test:splash`.

The new browser suite covers quote validation and channel payloads, product prefilling, clipboard denial, download failure/retry, mobile dock visibility, responsive widths, all locales and runtime errors. Existing browser tests cover provider rejection, timeout and retry. Enquiry provider requests are mocked and WhatsApp destinations are intercepted; no real enquiries are delivered.

Production routing, email provider credentials, Zoho configuration, prices and commercial terms are unchanged. This branch should be reviewed and merged before production release.

## Interface polish

Shared product/service cards use consistent corners and keyboard focus, persistent service action labels, and restrained touch feedback. Form errors revalidate while correcting an invalid field; the form announces busy state and restores name-field focus when starting another enquiry. Mobile navigation includes keyboard looping, Escape focus return, same-page link closure, desktop-breakpoint scroll unlock, and a reduced-motion-aware opening transition. Repeating download glows and the rate-indicator pulse are removed; customer marquee behavior and splash remain unchanged. `npm run test:polish` covers the new menu and form recovery paths and runs in CI.

## Approved splash revision

Black-and-gold crest and wordmark layout matches the approved revised-motion concept. Original shield/laurel assets assemble, wordmark lines rise through masks, and a single sheen crosses the badge. Content fades before a bottom-to-top curtain reveals the homepage. CSS duration is 4.7 seconds, including the 0.8-second curtain exit. The existing initial-HTML gate, completion event and storage key are unchanged, preserving first-visit-only behavior, reduced-motion bypass and language-prompt sequencing. No video or animation library is loaded. Portrait and short landscape layouts have separate responsive proportions.

Splash playback update: every full homepage load/reload now plays the 4.7-second splash, regardless of the old sg-splash-seen storage marker. Internal client-side navigation does not trigger it; reduced-motion bypass and non-homepage behavior remain unchanged. No storage reads/writes are required for playback.
