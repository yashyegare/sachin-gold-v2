# Sachin Gold V2a — scaffold

This is the starting skeleton for the V2a migration described in the
roadmap: Next.js + TypeScript + Tailwind, componentized, static data
layer, no backend yet. It's meant to run locally and be iterated on —
it is not deployed anywhere.

## Running it

You'll need Node.js 18.18+ installed.

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The Navbar, Footer, and a placeholder
home page are wired up, plus stub routes for `/about`, `/services`,
`/services/[slug]`, `/rates`, and `/contact` so you can click around the
real navigation structure immediately.

## What's here

```text
app/
  layout.tsx          Root layout — fonts, <Navbar/>, <Footer/>, base metadata
  page.tsx             Home (placeholder)
  about/page.tsx
  services/page.tsx    Services overview, rendered from data/services.ts
  services/[slug]/page.tsx   One dynamic route for all 5 service pages
  rates/page.tsx
  contact/page.tsx
  globals.css

components/
  Navbar.tsx           <- start here, see below
  Footer.tsx
  ServiceCard.tsx

data/
  services.ts          The 5 services as typed data (was 5 near-duplicate HTML files)
  navigation.ts         Primary nav, derived from services.ts
  company.ts            Phone/email/address/stats — has TODOs, needs real values
  rates.ts               Static for now; swap for an API call in V2b without touching the page

lib/
  types.ts              Shared interfaces (Service, NavLink, CompanyInfo)
```

Everything under `data/` has `TODO` placeholders for real client
numbers (phone, address, years of experience, rates). Fill these in
before this goes anywhere near production — don't ship a placeholder
stat.

`public/images/` is empty on purpose. Nothing has been migrated from
the old site's `assets/img` yet — that's Phase 2 (image cleanup),
which should happen before or alongside this, not after.

## Why Navbar first

It's the one component every page depends on, it's where the
duplicated header markup from the old 10 HTML pages consolidates into
one place, and it exercises most of the patterns the rest of the site
will reuse: typed data from `data/navigation.ts`, `next/link`,
active-route styling, and a fully keyboard/click-outside-accessible
dropdown — patterns `ServiceCard` and later `Hero`/`Testimonials`
will follow.

## Design tokens (`tailwind.config.ts`)

Kept close to the existing brand rather than a from-scratch restyle,
per the roadmap ("I would not completely redesign it"):

- `pine` (#0F4C2E) — primary green, a deepened version of the legacy
  `#116530` accent
- `wheat` (#B68A1E) — muted harvest-gold, used sparingly (not as a
  background wash)
- `slate` (#2D465E) — the legacy heading color, kept for secondary
  structure
- `linen` (#F6F4EE) — warm off-white for alternating sections
- `ink` (#16231C) — near-black body text with a slight green undertone

Type: `Marcellus` for headings (already the brand's display face —
kept, not replaced) paired with `Inter` for body/UI text.

The header uses a hairline bottom border rather than a drop shadow,
and the services dropdown is a short list of real sub-pages rather
than a generic mega-menu — both were deliberate calls to avoid the
"SaaS card kit" look for what's meant to read as a serious B2B
commodities company.

## Suggested next components, in order

1. **Hero** — home page banner; this is the first thing a visitor
   sees, worth getting right before anything else
2. **SectionHeading** — small, but used everywhere; do it once
3. **ProductCard** — for the dal/oil products, similar shape to
   `ServiceCard`
4. **CTA** — the repeated "get in touch" band used on service pages
5. **Testimonials**

## Not in this scaffold yet

- Real images (Phase 2 — optimize before importing)
- Contact form submission (old site used a PHP handler; decide
  whether to keep PHP or move to a Next.js API route / form service)
- SEO metadata beyond the basics in `layout.tsx` (sitemap, OG images,
  structured data — Phase 8 in the roadmap)
- Anything backend: dynamic rates, admin dashboard — that's V2b,
  scoped separately per the client conversation about whether they
  actually want to self-manage content
