# SEO operations — existing pages only

Later code-only improvements and deferred owner actions are documented in [seo-enquiry-followup.md](seo-enquiry-followup.md). The scope below describes the original technical SEO release.

## Scope

No product pages, location pages, articles, page content, page layouts, navigation or visual components were created or rewritten. Existing page files and translation catalogs are unchanged. Work is limited to metadata/indexing configuration, the machine-readable sitemap, analytics events, tests and this runbook.

## Implemented

- A single validated HTTPS canonical origin shared by metadata, server headers and redirects. The opposite www/apex hostname redirects permanently to the configured canonical origin. Query parameters are not added to canonical URLs.
- Absolute self-canonicals and reciprocal hreflang for all six languages, plus x-default. Middleware no longer emits a competing set of alternate links based on the incoming host.
- All 66 existing localized URLs are explicitly listed in sitemap.xml. This exposes existing pages; it creates no new pages. Artificial build-time lastmod dates were removed instead of claiming the price feed was edited on each deployment.
- Public Vercel aliases receive X-Robots-Tag: noindex, follow. Preview deployments also receive noindex metadata/headers. Canonical production pages remain indexable. Crawlers can still load CSS/JS; there is no broad _next robots block.
- English PDF aliases carry an HTTP canonical Link pointing at the matching bare English PDF.
- Complete localized descriptions are retained rather than clipped at an arbitrary character limit. Social metadata includes the other supported locales; large image/video previews are permitted.
- Optional Google Search Console and Bing verification tags are supported through environment variables. No unverified token is invented or enabled by default.
- Automated SEO tests validate every existing localized URL, canonicals, hreflang reciprocity, metadata, JSON-LD syntax, Organization/LocalBusiness presence and Service/Breadcrumb URL consistency. Existing structured data is preserved; no ratings, stock status, certifications or business locations were invented.

## Account setup still required

These steps require the business owner's Google/Bing/Vercel accounts. They cannot be completed merely by deploying repository code, and were not performed through an unavailable connector.

1. Google Search Console: preferably verify the Domain property `sachingold.com` using the DNS TXT record supplied by Google. If using a URL-prefix property instead, set the exact public `GOOGLE_SITE_VERIFICATION` token in the production environment and rebuild. Do not use a DNS or HTML-file token as a meta-tag token.
2. Submit `https://sachingold.com/sitemap.xml`. Inspect the home page, rates, contact and service URLs; check their selected canonicals and translated alternatives. Review indexing exclusions and search queries after Google recrawls. This code does not submit the sitemap to an account or guarantee indexing/rankings.
3. Bing Webmaster Tools: verify/import the site, submit the same sitemap, and optionally set its `BING_SITE_VERIFICATION` meta token before rebuilding.
4. Vercel Web Analytics: confirm it is enabled for this project and that the team's plan supports custom events. The repository already mounts Analytics and Speed Insights. This work neither purchases a plan upgrade nor configures external dashboards. If the current plan lacks custom events, reporting requires an owner-approved plan/provider decision.

## Lead measurement

Events use only a supported locale, allowlisted public page category, and source placement (header/footer/floating/content/form). They exclude query strings, WhatsApp message text, telephone numbers, email addresses, form values and arbitrary unknown URL paths. Custom events respect Do Not Track and Global Privacy Control. No extra cookies, GA4 scripts or consent UI were introduced.

- `whatsapp_click`, `phone_click`, `email_click`: contact intent, not proof of a sent message, completed call or delivered email.
- `enquiry_click`: an internal link to the existing contact page.
- `pdf_download`: click intent on a PDF link, not proof a download completed.
- `enquiry_form_submit`: a submission that passed client validation.
- `enquiry_form_success`: Web3Forms acknowledged success; inbox delivery is still an external operational check.
- `enquiry_form_error`: rejected/failed/timed-out submission.
- `enquiry_email_handoff`: mail-client handoff when no form-provider key exists; never counted as confirmed delivery.

Use Search Console for organic impressions/clicks and queries, and analytics for contact actions. Compare trends using the same date range. Avoid treating every WhatsApp click as a qualified lead.

## Local business consistency

Use existing verified profiles; do not create duplicate profiles. Public-facing names must match real-world signage. Check eligibility and ownership before adding or editing any listing. The source of truth is data/company.ts:

- Main Plant — 289/1 At- Post Her, Near Karadkhel Pati, Udgir, Dist. Latur, MH - 413517. Facility phone: +91 88060 17000.
- Sandeep Dal Industry & Warehouses — C37Q+5C Loni, MIDC Udgir, Dist. Latur, MH - 413517. Facility phone: +91 85509 64764.
- SP Cold Storage — C38V+VXP, Nanded Road, Somnathpur, Udgir, Dist. Latur, MH - 413517. Facility phone: +91 82085 58227.

Keep the existing website/contact details consistent, use genuine facility/team/product photos, select categories matching the actual operation, and request honest reviews from real customers without incentives. A service area is not proof of a staffed physical location; do not generate profiles for every city in the website's service-area list. No Business Profile listing or review was published by this change.

## Research for existing routes

These are candidate buyer-intent themes, not verified search-volume/ranking claims:

- /services/commodity-trading — bulk agro commodity supplier, wholesale grain/oilseed trading, Maharashtra/Karnataka sourcing.
- /services/pulses-processing — bulk toor/chana dal and besan processing/supply.
- /services/oil-extraction — soya oil extraction, soya DOC and derivatives.
- /services/cold-storage — Udgir cold storage and warehousing.
- /services/logistics — bulk agro commodity transport and logistics.
- /rates — indicative wholesale commodity prices.

Use actual Search Console query data to refine these priorities. Publishing new content or rewriting existing pages is excluded by the owner's instruction. Earn relevant links through real associations, suppliers, customers and business mentions; no purchased links, fabricated reviews, mass city pages or unsolicited outreach was performed.

## Validation

Run `npm run test:unit`, `npm run lint`, `npm run typecheck`, then a production build with a disposable mocked form key. Start the production server on port 3100 and run `npm run test:seo`, `npm run test:browser` and `npm run test:splash`. Web3Forms requests are intercepted in browser tests; no real enquiries are sent. Host-dependent checks use a real HTTP Host header rather than fetch's normalized authority. The release workflow includes the same SEO checks on main pushes and pull requests.

Google guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
Local ranking: https://support.google.com/business/answer/7091
Custom events: https://vercel.com/docs/analytics/custom-events

The pre-deployment audit also identified the newly published GHSA-g3hv-75wg-m249 advisory in the lint-tool dependency tree. A targeted minimatch override patches that development-only dependency without downgrading the framework or changing runtime/page behavior.
