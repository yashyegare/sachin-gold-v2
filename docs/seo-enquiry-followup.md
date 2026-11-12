# SEO and enquiry follow-up — November 2026

Implemented within existing routes:
- About/service metadata retains complete translated descriptions rather than cutting sentences at 155 characters.
- All service pages include translated requirement/quantity/destination guidance and direct links to existing enquiry/rates routes; no product or city pages added.
- Rate offers describe their actual kilogram quantity basis (1 kg oils/dals, 1000 kg DOC), omit unverified stock availability, and exclude unpriced products.
- A translated Skip intro button works through the initial HTML script, before hydration and even when client bundles fail. It finishes the splash once and moves keyboard focus to main content. Full homepage refreshes still play by default; reduced-motion bypass remains.
- Failed form submissions preserve values and offer a WhatsApp handoff carrying only the composed requirement. No automated live submissions or inbox checks were sent.
- New `enquiry_form_start`, `enquiry_quote_submit`, and `enquiry_quote_success` events distinguish engagement, a complete structured requirement and provider acknowledgement. These do not establish that a lead is qualified or that an inbox received it. Error reasons are allowlisted (`http`, `provider`, `timeout`, `network`); response bodies and enquiry contents never enter analytics. Existing privacy opt-outs remain.
- Regression checks protect owner-confirmed oil units/prices, packaging and 1–2 day lead times. Existing page/PDF generators read the same sources.

Deferred until owner involvement:
- Search Console/Bing verification, sitemap submission and indexing/query review.
- Business Profile ownership, listing edits, real customer reviews and directory/association outreach.
- Real mailbox delivery and Zoho restrictions; server-side provider credentials/production configuration.
- Certificates, registration identifiers, testimonials and new business facts.
- Analytics account/plan enablement, dashboards and any paid provider changes.

No new tracking service or dependency, DNS changes, certificate claims, paid upgrades, new pages or ranking guarantees. Production performance still needs real-user field data; a lab-only improvement is not proof of better Core Web Vitals or rankings.

Validation: production build, lint/typecheck, unit tests, existing SEO/UX/browser/splash suites, plus `npm run test:optimization` in CI. External form requests in tests are mocked, and the WhatsApp recovery link is inspected without sending.
