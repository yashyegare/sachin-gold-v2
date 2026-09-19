# V1 Baseline — sachingold.com (Phase 1 audit)

Method note: every number below was **measured directly against the live
domain** (`https://sachingold.com`) on 2026-09-19 via HTTP fetches from the
development machine, unless marked otherwise. Nothing here is estimated
from memory.

- Date of audit: 2026-09-19
- Lighthouse (desktop + mobile scores): **NOT YET RUN** — see §2 for the
  exact reason and the 10-minute procedure to finish it. Do not compare
  V2 against this document's performance claims until that section is
  filled; everything else in here is complete.

---

## 1. Page inventory (audit every one)

All URLs confirmed live by HTTP status check, 2026-09-19 (filenames verified
against the old repo and live responses — no more "unconfirmed" rows):

| Page | URL | Status | Audited |
|---|---|---|---|
| Home | `https://sachingold.com/` | 200 | ☑ |
| About | `https://sachingold.com/about.html` | 200 | ☑ |
| Services overview | `https://sachingold.com/services.html` | 200 | ☑ |
| Commodity Trading | `https://sachingold.com/commodity-trading.html` | 200 | ☑ |
| Pulses & Gram Flour | `https://sachingold.com/pulses-processing.html` | 200 | ☑ |
| Oil Seed Extraction & Bulk Soya DOC | `https://sachingold.com/oil-extraction.html` | 200 | ☑ |
| Cold Storage | `https://sachingold.com/cold-storage.html` | 200 | ☑ |
| Logistics & Transportation | `https://sachingold.com/logistics.html` | 200 | ☑ |
| Rates | `https://sachingold.com/rate.html` (NOT `rates.html` — that 404s) | 200 | ☑ |
| Contact | `https://sachingold.com/contact.html` | 200 | ☑ |
| Testimonials (template remnant) | `https://sachingold.com/testimonials.html` | exists | ☑ |

## 2. Lighthouse baseline — **the one open item**

Attempted automatically via the PageSpeed Insights API on 2026-09-19;
the unauthenticated endpoint returned **429 (quota exhausted)** from this
network. Scores were **not** fabricated. To finish this in ~10 minutes:

1. Open https://pagespeed.web.dev/ in an incognito window
2. Run `https://sachingold.com/` (mobile first, then desktop), then repeat
   for the other 9 URLs in §1
3. Paste the four scores + LCP/CLS/INP into the tables below
4. Save — this file is then the Phase 8 comparison target

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Home | _(pending)_ | _(pending)_ | _(pending)_ | _(pending)_ |
| About | | | | |
| Services | | | | |
| …one row per page in §1 | | | | |

## 3. Core Web Vitals baseline

| Page | LCP (s) | CLS | INP (ms) |
|---|---|---|---|
| Home | _(pending — fill with §2)_ | | |
| …one row per page in §1 | | | |

Expected: LCP will be poor — the home page ships a 6.7MB JPEG as a visible
banner; on any throttled connection that alone blows the 2.5s budget.

## 4. Network / bundle audit (measured, 2026-09-19)

**Home page total: ~31 MB** (HTML 52.8 KB + first-party JS/CSS ~592 KB +
19 unique images **~29.4 MB** + third-party Google Translate script).

First-party JS/CSS actually downloaded per page (uncompressed transfer):

| Asset | Size |
|---|---|
| bootstrap.min.css | 227 KB |
| swiper-bundle.min.js | 147 KB |
| main.css | 62 KB |
| bootstrap.bundle.min.js | 78 KB |
| glightbox.min.js | 54 KB |
| aos.js + aos.css | 21 KB |
| main.js | 5 KB |
| php-email-form/validate.js | 2 KB |
| **Total JS+CSS** | **~592 KB** |

Plus, loaded on every page: Google Translate widget script (third-party,
weight varies — render-blocking).

The 19 images loaded by the home page (every one over 400 KB is a defect
the plan's Phase 2 target fixes):

| Image | Size |
|---|---|
| oil_extraction_banner.jpg | 6,715 KB |
| cold_storage_banner_below.jpg | 6,341 KB |
| dal_plat_banner.jpeg | 5,775 KB |
| pulses_unit.png | 3,796 KB |
| oil_extraction_banner2.jpg | 1,942 KB |
| team_img_1.png | 1,367 KB |
| cold_storage_banner1.png | 1,171 KB |
| banner_new_img1/3/4.jpg | 459 KB combined |
| raw_agro.png | 484 KB |
| service_img_5.jpg | 572 KB |
| service_img_6.jpg | 412 KB |
| video_img_2.png | 633 KB |
| sachin_gold_logo2.jpg | 269 KB |
| others (agro_comm_highlevel, img_sq_8, logo, service_img_1) | 198 KB |

`assets/img/` across the whole site: **~69 MB, 49 files** (matches the
plan's figure). **V2's entire migrated set: ~2.5 MB across 40 optimized
WebP/AVIF files** — a ~96% reduction, with no single file over the 400 KB
cap (largest: 218 KB).

## 5. Content inventory (what must survive the migration)

Everything below has been **captured verbatim and migrated into V2's data
layer** unless the line says otherwise. This section doubles as the
"what's done" proof for Phase 5.

- [x] **Home hero / positioning** — copy migrated; "Live Market Rates"
      ticker kept as a link-strip to /rates (no JS widget)
- [x] **About** — full 1969 / Hude Group / Sortex copy, 550 tons/day,
      1.5 lakh farmers via ITC e-Choupal, real team names/photos, the one
      genuine customer quote (Shrikant) + `cust_feedback.mp4` (now
      migrated to `public/videos/`)
- [x] **Services framing** — end-to-end value chain; all five services
      with descriptions, Key Advantages, per-service locations
- [x] **Products** — 20 real products across the three lines:
      commodity-trading.html's own 12-item catalogue (Soyabean, Bajra,
      Jowar, Corn, Jaggery, Cotton Seed Oil Cake, Masoor, Tamarind + the
      dals), the pulses unit's list, and the extraction line (DOC,
      Crude Oil, Refined, Acid, Fatty, Lecithin)
- [x] **Oil extraction copy** — migrated with advantages
- [x] **Logistics copy** — migrated incl. the "1,000+ retail stores"
      figure (verbatim from logistics.html; client to confirm currency)
- [x] **Cold storage copy** — migrated
- [x] **Contact details** — three real facilities with addresses +
      dedicated numbers (Main Plant +91 88060 17000, Sandeep Dal Industry
      & Warehouses, SP Cold Storage), info@/sales@ split, +91 94229 52233,
      legal entity (Sachin International Proteins Private Limited),
      WhatsApp 919422952233, the 6 real FAQs
- [x] **Customers** — ITC, Tata Consumer, Adani Wilmar, ADM, Sresta logos
      from services.html ("Trusted by leading brands across the industry")
- [x] **Rates disclaimer copy** — structure and units migrated (per MT /
      per 10kg / per kg); prices stay "On request"
- [x] **Current rate numbers** — confirmed: **the live site has never
      published real prices** (rate.html cells are placeholders there
      too). Still open on the client, not a migration gap
- [x] **Testimonials** — RESOLVED: `testimonials.html` is unedited
      BootstrapMade template content ("James Smith"/"Kate Smith", Lorem
      ipsum). The one real quote lives on About (migrated); README
      documents why no testimonials carousel exists
- [ ] **Certifications / registrations** — none found on the live site;
      ask the client (Phase 9 list)
- [x] **Team & facility photos** — real ones identified and migrated
      (mr_sachin_img, mr_sandeep, pulses_processing_facility etc.);
      `team/anna.jpg` processed but **unwired** pending client
      confirmation (may be the Founder; documented in data/team.ts)

## 6. Redirect map (Phase 7 deliverable, verified 2026-09-19)

All filenames verified against the live domain and the old repo; mirrors
`redirects()` in `next.config.mjs`. Every row confirmed:

| Old URL | New URL | Status |
|---|---|---|
| `/index.html` | `/` | confirmed |
| `/about.html` | `/about` | confirmed |
| `/services.html` | `/services` | confirmed |
| `/contact.html` | `/contact` | confirmed |
| `/oil-extraction.html` | `/services/oil-extraction` | confirmed |
| `/logistics.html` | `/services/logistics` | confirmed |
| `/rate.html` | `/rates` | confirmed (rates.html does not exist) |
| `/commodity-trading.html` | `/services/commodity-trading` | confirmed |
| `/pulses-processing.html` | `/services/pulses-processing` | confirmed |
| `/cold-storage.html` | `/services/cold-storage` | confirmed |
| any other `.html` page | same path, no extension (catch-all) | confirmed |

## 7. Deliberately left behind (Phase 2 deliverable)

Everything consciously NOT migrated, with the reason:

- `google56abaebed30292ca.html` — old host verification file; new
  verification happens via DNS TXT at cutover (Phase 7, item 5)
- `blog-details.html`, `testimonials.html` — CONFIRMED template remnants
  (testimonials verified: unedited BootstrapMade content, no real quotes)
- BootstrapMade template vendor files (AOS, Swiper, GLightbox,
  bootstrap-icons, php-email-form) — replaced by ~0 KB of framework code
  (Next.js handles what little JS the site needs)
- `banner_new_img8 - Copy.jpg` and the unused banner variants — literal
  Windows "Copy" files and carousel slides not used by V2's hero
- `apple-touch-icon.png` duplicates, `favicon.png` variants — V2 uses the
  one `favicon_sachingold.png` as `app/icon.png`
- Template stock photos (`team_img_1.png` — a stock collage, testimonial
  stock portraits) — replaced by real team photos
- `products/chana_dal_full.png`, `toor_dal_full.jpg`, `urad_dal_full.jpg`,
  `moong_dal_full.png` — trading-page variants of dals already covered by
  the processing products (dupes, not distinct items)
- `assets/img/team/anna.jpg` — real photo, **processed and parked** at
  `public/images/team/unconfirmed-anna.webp`, not wired until the client
  says who it is (see data/team.ts)
- `video_img_2.png` — About-page video thumbnail; V2 renders a branded
  play tile instead. Migrate only if the client wants the original look
- `cust_feedback.mp4` — **not** left behind anymore: migrated to
  `public/videos/` and wired click-to-play on the testimonial
