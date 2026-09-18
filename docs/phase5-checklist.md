# Phase 5 remaining work — per-page checklist

The Phase 5 gate: every page below fully checked off = site navigable
end-to-end with real content. Metadata, SEO and the component set are done
(Phases 4 and 7 complete); what remains is real copy, real images, and
client-supplied facts.

Global reminders that apply to every unchecked item:

- [ ] Copy migrated verbatim from the old HTML — never placeholder text
- [ ] Real images via `next/image` with explicit `width`/`height`, from the
      Phase 2 optimized set in `public/images/`
- [ ] Mobile (375px) and desktop (1440px) both eyeballed
- [ ] No internal link points at an old `.html` URL

---

## Home (`app/page.tsx`) — highest priority

Structure is built (Hero → rates strip → services → products → CTA). Remaining:

- [ ] Hero: decide the hero image; add the Phase 2-optimized WebP next to
      the copy without moving the text off the solid `pine-deep` surface
- [ ] Hero: confirm the headline reads as the client wants ("Bulk Agro
      Commodity Trading & Processing" is the current tagline)
- [ ] Replace the stats band values with client-confirmed figures
      (yearsOfExperience=57 is derived from the client's own "since 1969" —
      confirm the phrasing they want)
- [ ] Home copy sections beyond cards: migrate the old home's paragraph copy
      (the "Directly sourced, premium-grade…" copy) once captured in full

## About (`app/about/page.tsx`)

- [ ] Migrate the full company history from the old about.html
- [ ] Client confirms the Hude Group relationship before it appears in copy
- [ ] Facility/certification photos (Phase 2 images) + any certifications list

## Services overview (`app/services/page.tsx`)

- [ ] Done apart from imagery: add per-card images when Phase 2 lands
      (ServiceCard currently renders text-only by design)

## Service detail pages (`app/services/[slug]/page.tsx` × 5)

- [ ] commodity-trading: long-form copy from the old trading page (filename
      unconfirmed — see docs/v1-baseline.md §1)
- [ ] pulses-processing: long-form copy + process/grading details
- [ ] oil-extraction: long-form copy (the "leading bulk supplier…" copy is
      captured in docs/v1-baseline.md §5; expand from the page)
- [ ] cold-storage: long-form copy — capacity, locations, what's stored
- [ ] logistics: long-form copy — fleet size/capacity if the old page states it
- [ ] Each: service images from Phase 2

## Rates (`app/rates/page.tsx`) — BLOCKED on client

- [ ] Real prices for all 6 rows (currently "On request" — never invented)
- [ ] Set `ratesLastUpdated` in `data/rates.ts` when real numbers land
- [ ] Client agrees on who updates rates and how often (Phase 9 question)

## Contact (`app/contact/page.tsx`)

- [ ] Form submission end-to-end: add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` to
      `.env.local` and the Vercel project env, then test a real submission
      and confirm the email actually arrives (Phase 6 "done when")
- [ ] Full street address replaces the TODO (client/old repo)
- [ ] Second phone number (+91 88060…) if the client wants it listed
