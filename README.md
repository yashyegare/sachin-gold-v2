# Sachin Gold V2a

The V2 rebuild of sachingold.com: Next.js + TypeScript + Tailwind,
componentized, typed static data layer. The live site at sachingold.com is
untouched until cutover (Phase 10 of `sachin-gold-v2-plan.md`) — everything
here deploys to a separate preview URL.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run images     # Phase 2 batch image converter (see scripts/process-images.mjs)
```

## Contact form setup (Phase 6)

The form posts straight to Web3Forms — no backend code:

1. Create a free access key at web3forms.com using the **client's email**,
   so submissions land somewhere the client actually reads.
2. Copy `.env.local.example` to `.env.local` and set
   `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`.
3. Restart `npm run dev`, submit the form yourself, and confirm the email
   arrives. That end-to-end test is an explicit Phase 6 gate — don't assume,
   don't demo it to the client before you've seen a real submission land.

The key is safe to expose client-side by design: it only routes
submissions to the pre-registered inbox, it doesn't grant API access to
anything else. Until the key is set, the form renders disabled rather
than accepting submissions into the void. Spam protection: honeypot
field, dropped by Web3Forms when filled.

## Design language

Green carries the UI (pine `#0F4C2E`, deepened from the legacy brand
green); gold is a deliberate accent, not a second base color — it appears
in exactly three places: the hero eyebrow, the hero primary CTA, and the
StatsBand numbers. That restraint is what makes it read as premium
rather than decorative, and it's literal to the business: the products
(soya DOC, dal, oil) genuinely are golden/amber.

Type: `Marcellus` for display, `Inter` for body/UI. Both via `next/font`
with `display: swap`.

Contrast variants: raw wheat fails AA on light backgrounds (~3.1:1), so
light-surface gold text uses `wheat-dark` (`#8A6414`, 5.4:1 on white) and
dark-surface gold uses `wheat-bright` (`#D9A93C`, 6.2:1 on pine-deep).
Don't reach for raw `text-wheat` on white/linen.

## Testimonials — deliberately not built

`testimonials.html` on the old site is entirely unedited BootstrapMade
template content — "James Smith" / "Kate Smith" with stock photos and
literal Lorem ipsum text; the page title still reads "Testimonials -
AgriCulture Bootstrap Template". None of it is real (verified during the
Phase 1 content inventory; recorded in `docs/v1-baseline.md`).

Rather than build a component around fake quotes, this needs a decision
with the client: skip testimonials for launch (the StatsBand plus real
facility photography likely carries more trust for a B2B trading
audience than generic-sounding quotes would anyway), or ask 2–3 real
buyers for short quotes. If real quotes materialize, the component is a
small job — but it is gated on that client conversation, not on
markdown. This note is permanent so the reasoning isn't lost later.

## What's here

```text
app/
  layout.tsx                 Root layout — fonts, skip link, metadata, JSON-LD
  page.tsx                   Home: Hero → StatsBand → rates strip → services → products → CTA
  about/page.tsx             Partial copy; full history TODO from client
  services/page.tsx          Services overview from data/services.ts
  services/[slug]/page.tsx   One dynamic route, per-service products + JSON-LD
  rates/page.tsx             Grouped tables; "On request" until real prices
  contact/page.tsx           Details + working form (needs the access key above)
  not-found.tsx              On-brand 404
  sitemap.ts, robots.ts      Generated from the data layer

components/                   Navbar, Footer, Hero, StatsBand, SectionHeading,
                              ServiceCard, ProductCard, CTA, ContactForm

data/                         services, products, rates, company, home, stats,
                              navigation — all typed via lib/types.ts

scripts/process-images.mjs    Phase 2 pipeline: old repo images → optimized
                              WebP/AVIF under public/images/

docs/
  v1-baseline.md              Phase 1 audit template, pre-filled with captures
  phase5-checklist.md         Per-page remaining work

next.config.mjs               301 redirect map from the legacy .html URLs
```

## Deliberate rules (don't break these)

- No invented numbers, quotes, or stats — every figure traces to the
  client's published site or the project's own data files.
- Rates show "On request" until the client supplies real numbers; the
  "Last updated" line stays hidden until a real date exists.
- Gold stays rare (see Design language); eyebrows on light surfaces are
  pine, not gold.
- The legacy `.html` redirect map must keep working — verify against
  `docs/v1-baseline.md` §6 before cutover.

## Still TODO before launch (Phase 5 gate)

Real copy for About/service pages, real photos (run `npm run images`),
confirmed prices + address + second phone number, and the four unverified
legacy filenames in `docs/v1-baseline.md` §6. Tracked in
`docs/phase5-checklist.md`.
