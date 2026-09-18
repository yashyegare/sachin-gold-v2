# V1 Baseline — sachingold.com (Phase 1 audit)

Fill this in **before** building pages, and compare against it in Phase 8.
Method: audit the live domain `https://sachingold.com` — not a local copy —
in an incognito window, default throttling, desktop plus one mobile run per
page. Never quote a number you didn't run yourself.

- Date of audit: ______
- Tool versions: Lighthouse ______, Chrome ______

---

## 1. Page inventory (audit every one)

URLs confirmed live (Google index, Sept 2026):

| Page | URL | Audited |
|---|---|---|
| Home | `https://sachingold.com/` | ☐ |
| About | `https://sachingold.com/about.html` | ☐ |
| Services overview | `https://sachingold.com/services.html` | ☐ |
| Oil Seed Extraction & Bulk Soya DOC | `https://sachingold.com/oil-extraction.html` | ☐ |
| Logistics & Transportation | `https://sachingold.com/logistics.html` | ☐ |
| Contact | `https://sachingold.com/contact.html` | ☐ |
| Rates | filename unconfirmed — pull from old repo | ☐ |
| Commodity Trading | filename unconfirmed — pull from old repo | ☐ |
| Pulses & Gram Flour | filename unconfirmed — pull from old repo | ☐ |
| Cold Storage | filename unconfirmed — pull from old repo | ☐ |

## 2. Lighthouse baseline (fill in per page)

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Home | | | | |
| About | | | | |
| Services | | | | |
| …one row per page above | | | | |

## 3. Core Web Vitals baseline

| Page | LCP (s) | CLS | INP (ms) |
|---|---|---|---|
| Home | | | |
| …one row per page above | | | |

## 4. Network / bundle audit

Known facts (verify per page, note variances):

- **Images: ~69 MB total** across the site — the single biggest problem.
- Third-party/template JS loading on every page: Bootstrap, AOS,
  Swiper, GLightbox, Google Translate widget script.

| Page | Total weight | Requests | Largest request |
|---|---|---|---|
| Home | | | |
| …one row per page above | | | |

## 5. Content inventory (what must survive the migration)

Rule: capture **verbatim** from the live pages — the page is the source of
truth, memory is not. Every item below was captured from the live site or
Google index, Sept 2026; expand each to full copy from the page itself.

- [ ] **Home hero** — "Directly sourced, premium-grade bulk agricultural
      commodities. View Details · Processing. Toor / Chana Dal. Protein-rich,
      unpolished split pulses processed with …" (capture the full copy)
- [ ] **Home positioning** — "Trusted partner for bulk agro commodities.
      Specializing in Toor Dal, Soya DOC extraction, and cold storage across
      Maharashtra and Karnataka …" + "Live Market Rates" element (the ticker)
- [ ] **About** — "Since 1969, Hude Group has been serving the nation with the
      finest Sortex quality agro commodities, along with premium finished
      products and …" (capture the full company history; confirm the 1969
      founding and Hude Group relationship with the client)
- [ ] **Services framing** — "An end-to-end agro value chain, from soil to
      storefront. 1. Sourcing Commodity Trading 2. Processing Pulses & Flour
      3. Extraction …" (capture all numbered items)
- [ ] **Products list** — toor dal, chana dal, moong/urad (confirm), gram
      flour, Soya DOC (Normal + High Protein), Soya Refined Oil, Lecithin
- [ ] **Oil extraction copy** — "Leading bulk supplier and manufacturer of
      premium Soya DOC (De-Oiled Cake), Soya Refined Oil, and Lecithin.
      High-protein feed grade DOC …"
- [ ] **Logistics copy** — "Featuring a dedicated fleet servicing Maharashtra
      and Karnataka" (capture fleet size/capacity if stated)
- [ ] **Cold storage copy** — capture capacity, locations, what's stored
- [ ] **Contact details** — info@sachingold.com; sales@… (full address
      truncated in capture); +91 94229 52233; second number starting
      "+91 88060…"; PIN 413517 — pull all from contact.html
- [ ] **Rates disclaimer copy** — "Our dynamic rate ticker and Rates page are
      updated regularly to reflect current market conditions for Soya
      derivatives, Toor Dal, and Chana Dal. However, as …" (capture in full —
      this wording likely needs to survive into V2's Rates page)
- [ ] **Current rate numbers** — every number on the Rates page + ticker
- [x] **Testimonials** — RESOLVED: `testimonials.html` on the old site is
      entirely unedited BootstrapMade template content ("James Smith" /
      "Kate Smith" with stock photos, literal Lorem ipsum, page title still
      "Testimonials - AgriCulture Bootstrap Template"). No real quotes
      exist. Building testimonials requires collecting 2-3 real buyer quotes
      from the client — see README, "Testimonials — deliberately not built"
- [ ] **Certifications / registrations** — list them
- [ ] **Team & facility photos** — which are real vs template stock

## 6. Redirect map (Phase 7 deliverable, verified in Phase 10)

Mirrors `redirects()` in `next.config.mjs`. Verify every "unconfirmed" row
against the old repo, then tick.

| Old URL | New URL | Status |
|---|---|---|
| `/index.html` | `/` | confirmed |
| `/about.html` | `/about` | confirmed |
| `/services.html` | `/services` | confirmed |
| `/contact.html` | `/contact` | confirmed |
| `/oil-extraction.html` | `/services/oil-extraction` | confirmed |
| `/logistics.html` | `/services/logistics` | confirmed |
| `/rate.html` or `/rates.html` | `/rates` | verify filename |
| commodity-trading old filename | `/services/commodity-trading` | verify filename |
| pulses old filename | `/services/pulses-processing` | verify filename |
| cold storage old filename | `/services/cold-storage` | verify filename |
| any other `.html` page | same path, no extension (catch-all) | audit old repo for strays |

## 7. Deliberately left behind (Phase 2 deliverable)

List everything you consciously do NOT migrate, with the reason:

- `google56abaebed30292ca.html` — old host verification file; new
  verification happens via DNS TXT (Phase 7, item 5)
- BootstrapMade template comments/metadata — template remnants
- `blog-details.html` / `testimonials.html` — CONFIRMED template remnants
  (testimonials verified: unedited BootstrapMade content, no real quotes)
- TODO: list other files found in the old repo that stay behind
