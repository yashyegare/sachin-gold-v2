# Phase 5 remaining work — per-page checklist

The Phase 5 gate: every page below fully checked off = site navigable
end-to-end with real content. Metadata, SEO, components, a11y and the
image pipeline are done (Phases 2/4/6/7 complete). **Real images are now
migrated and wired** (16 sources → WebP/AVIF under the 400KB cap, see
`public/images/`); what remains is client-supplied facts and long-form
copy depth.

Global reminders that apply to every unchecked item:

- [ ] Copy migrated verbatim from the old HTML — never placeholder text
- [ ] Mobile (375px) and desktop (1440px) both eyeballed
- [ ] No internal link points at an old `.html` URL

---

## Done across the site (no longer blockers)

- [x] All 5 service cards, all 13 product cards, hero, and 2 of 3 team
      photos render real migrated images (`next/image`, AVIF negotiated)
- [x] About page rebuilt around the real about.html content: 1969, Hude
      Group, 550 tons/day, 1.5 lakh farmers via ITC e-Choupal, real team,
      the one genuine testimonial
- [x] Contact page: real facilities (Main Plant, Sandeep Dal Industry &
      Warehouses, SP Cold Storage) with addresses/phones, legal entity,
      info@/sales@ split, WhatsApp, 6 real FAQs (+ FAQPage JSON-LD)
- [x] All 5 service pages: real descriptions, "Key advantages", per-service
      locations, Service JSON-LD, per-service product grids
- [x] Rates: real categories/units from the old site; prices "On request"

## Home (`app/page.tsx`) — highest priority

- [ ] Hero headline: confirm with the client ("Trusted trading and
      processing…" vs the live site's tagline phrasing)
- [ ] Stats band: all four values sourced (1969 / 5 locations / 550 tons /
      1.5L farmers) — confirm phrasing the client wants on the founded figure
- [ ] Migrate any remaining home-page paragraph copy from index.html once
      captured in full

## About (`app/about/page.tsx`)

- [ ] Client confirms the About figures are still current (Phase 9 question:
      they may not know this orphaned page existed)
- [ ] Founder photo: no confirmed source photo existed on the old site
      (`data/team.ts` leaves it empty; initials render). The repo has
      `anna.jpg` (unconfirmed-anna.webp) which may be the founder — client
      must confirm before use
- [ ] Product catalogue: now 13 products split from each service's own
      on-page catalogue (Crude Oil distinct from Refined; Urad/Moong/Jowar
      Dal) — worth a final client confirmation that nothing else is missing
- [ ] Facility video tile: migrate `video_img_2.png` + confirm the YouTube
      facility tour URL (youtu.be/v8zIFCYXlDs from the old site)
- [ ] Customer testimonial video (`cust_feedback.mp4`) if the client wants
      it embedded rather than linked

## Service detail pages (`app/services/[slug]/page.tsx` × 5)

- [ ] Long-form copy depth: descriptions/advantages/locations are migrated,
      but the old pages' full narrative sections (process details, grading,
      capacity figures) should be reviewed once more against the old HTML
      for anything substantial that was skipped

## Rates (`app/rates/page.tsx`) — BLOCKED on client

- [ ] Real prices for all 10 rows (currently "On request" — never invented;
      note the live site itself has never shown real prices)
- [ ] Set `ratesLastUpdated` in `data/rates.ts` when real numbers land
- [ ] Client agrees on who updates rates and how often (Phase 9 question)

## Contact (`app/contact/page.tsx`)

- [ ] Form submission end-to-end: add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` to
      `.env.local` and the Vercel project env, then test a real submission
      and confirm the email actually arrives (Phase 6 "done when" — the
      failure path is already verified live)

## Client questions for Phase 9 (accumulated)

- Confirm the About-page figures are current, and ask whether they knew
  about.html / the FAQ / the five service pages existed — three bodies of
  real content sat outside normal navigation on the live site
- Who controls DNS (Phase 0 item, needed for cutover)
- Whether they want V2b (admin dashboard) at all
