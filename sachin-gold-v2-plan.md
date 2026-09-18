# Sachin Gold V2 — End-to-End Build Plan

A step-by-step execution plan, in order. Each phase lists what to do, how to know it's done, and what can go wrong. Nothing here is optional groundwork — skipping a phase is how a "quick migration" turns into a broken live site for a paying client.

**Ground rule for the whole project:** the current site at sachingold.com stays untouched and live until Phase 10 (cutover) — Phase 11 is the post-launch watch that follows it. Everything before that happens in a separate repo/deploy that the client never sees until you choose to show them.

---

## Phase 0 — Setup & guardrails (before writing any component code)

1. Create a new **private Git repo** for V2 (GitHub/GitLab). Do not build V2 inside the old repo's folder structure.
2. Push the scaffold you already have into it as the first commit.
3. Connect the repo to **Vercel** immediately — even with almost nothing built, deploy a "hello world" version to a Vercel preview URL. This validates your deploy pipeline on day one instead of on launch day, when a broken build is expensive to debug under time pressure.
4. Confirm hosting reality: the current site's `CNAME` file means it's on **GitHub Pages**, which only serves static files. V2 needs a Node/serverless host. Vercel is the natural choice for Next.js — first-party support, free tier is enough for this site's traffic.
5. Decide and write down (one paragraph is enough) who owns the domain/DNS — you, or the client. You'll need DNS access in Phase 10 regardless.
6. Decide who owns the **hosting account**, too. A paying client's commercial site should live on the client's own Vercel account (the Hobby tier is non-commercial, and a site on your personal account makes you the portability bottleneck). Transferring a Vercel project between teams is possible but annoying — cheaper to decide now.

**Done when:** empty Next.js app is live on a `*.vercel.app` URL, repo exists, and you know who controls DNS and whose Vercel account the site lives on.

---

## Phase 1 — Audit the current site (get a baseline, or you can't prove you improved anything)

Run and save results for every page (`index`, `about`, `services`, all 5 service pages, `rate`, `contact`):

1. **Lighthouse** (Chrome DevTools or PageSpeed Insights) — record Performance, Accessibility, Best Practices, SEO scores.
2. **Core Web Vitals** — LCP, CLS, INP.
3. **Network waterfall** — total page weight, largest requests, number of requests.
4. **Bundle/asset audit** — you already know images are 69MB total; also note total JS payload (Bootstrap + AOS + Swiper + GLightbox + Google Translate script all loading on every page).
5. **Content inventory** — list every piece of real content that must survive the migration: page copy, product list, testimonials, team photos, certifications, contact details, the actual current market rate numbers.

Save all of this in a `docs/v1-baseline.md` file in the new repo. You'll compare against it in Phase 9. That template already exists and is pre-filled with what could be captured from the live site (confirmed URLs, contact details, hero/about copy excerpts) — fill the measured numbers in on top of it.

**Done when:** you have a saved baseline score for every current page and a checklist of every real piece of content that needs to migrate.

---

## Phase 2 — Asset cleanup (do this before or in parallel with component work, not after)

1. Pull every image out of `assets/img` in the old repo.
2. For each image actually used in V2 (check against Phase 1's content inventory — some are template remnants and won't be used at all):
   - Resize to the **largest size it's actually displayed at** (a hero image doesn't need to be 4000px wide if it displays at 1600px).
   - Convert to **WebP**, with AVIF for the heaviest hero/banner images if time allows.
   - Target: no single image over ~300–400KB after conversion; most should be well under that.
   - Tools: Squoosh (squoosh.app, no install needed) for one-offs, or a `sharp` script if you're batch-processing 50+ images.
3. Drop the converted files into `public/images/` in the new repo, organized to match `data/services.ts` etc. (e.g. `public/images/services/commodity-trading.webp`).
4. Explicitly list and discard: template remnant pages (`blog-details.html`, `testimonials.html` if not real client testimonials), the `google56abaebed30292ca.html` verification file (you'll need a fresh one for the new domain/host anyway), any BootstrapMade template comments/metadata.

**Done when:** every image you'll actually use in V2 exists in `public/images/` under 400KB, and you have a written list of what you deliberately left behind and why.

---

## Phase 3 — Scaffold (mostly done)

You already have this. Remaining setup:

1. `npm install` locally, confirm `npm run dev` runs with no errors.
2. Fill in every `TODO` in `data/company.ts` and `data/rates.ts` with **real, client-confirmed values** — phone, address, years of experience, locations served, current rates. Do not invent numbers, per your own roadmap note.
3. Push, confirm the Vercel preview updates automatically.

**Done when:** `npm run dev` runs clean, no placeholder `TODO` strings remain in `data/`.

---

## Phase 4 — Build components, in this order

Build and manually eyeball each one in isolation (Storybook is overkill for a site this size — just render it on a scratch page) before moving to the next:

1. ~~Navbar~~ — done
2. ~~Footer~~ — done
3. **Hero** — home page banner. First thing a visitor sees; get the headline, primary CTA, and hero image right before anything else.
4. **SectionHeading** — small, reused on every page; do it once so every section title is visually consistent.
5. ~~ServiceCard~~ — done
6. **ProductCard** — for individual dal/oil/commodity products (toor dal, chana dal, etc.), same shape as ServiceCard.
7. **CTA** — the repeated "get in touch" band used at the bottom of service pages.
8. **Testimonials** — only if the old site's testimonials are real client quotes, not template placeholders (check Phase 1 content inventory).
9. **ContactForm** — see Phase 6, item on contact page, this needs a backend decision first.

**Done when:** all 9 components render correctly with real (not lorem ipsum) data from the `data/` layer, at both mobile and desktop widths.

---

## Phase 5 — Build out every page

Go page by page. For each, the checklist is the same:

- [ ] Real copy migrated from the old HTML (not placeholder text)
- [ ] Real images from Phase 2, using `next/image` with explicit `width`/`height`
- [ ] Metadata (`title`, `description`) set via `export const metadata`
- [ ] Mobile width checked (375px) and desktop (1440px)
- [ ] All internal links point to the new route paths, not the old `.html` ones

Pages: Home, About, Services overview, each of the 5 service detail pages, Rates, Contact. (ProductCard from Phase 4 gets no dedicated page — product lists render inside the relevant service pages: toor/chana dal on the pulses page, Soya DOC grades on the oil-extraction page.)

**Home page priority:** this is the highest-leverage page — most traffic lands here. Don't let it stay a placeholder while you polish inner pages.

**Done when:** every page above is checked off and the site is fully navigable end-to-end with real content, on the Vercel preview URL.

---

## Phase 6 — Contact form decision

The old site used a PHP handler (`forms/contact.php`) — that won't run on Vercel as-is. Pick one before building the Contact page fully:

- **Option A:** Next.js API route (`app/api/contact/route.ts`) that sends email via a transactional email service (Resend, SendGrid, or similar). More control, small ongoing cost/complexity.
- **Option B:** A form service (Formspree, Web3Forms) — point the form at their endpoint, zero backend code. Fastest to ship, less control.

For a client site like this, Option B is usually the pragmatic choice for V2a — you can swap to Option A later without changing the page's visual design.

Whichever option wins: enable spam protection (honeypot at minimum, Turnstile/reCAPTCHA if the service offers it) — a public B2B enquiry form gets found by bots within days — and make sure submissions land in an inbox the client can see, not only yours.

**Done when:** submitting the real contact form actually delivers an email/notification somewhere you or the client can see it. Test this yourself before calling it done — don't assume.

---

## Phase 7 — SEO

1. `app/sitemap.ts` — generate from your `data/` files (services, static routes) instead of hand-writing XML.
2. `app/robots.ts`.
3. Open Graph + Twitter card metadata in `layout.tsx` and per-page overrides where it matters (service pages, home).
4. Structured data: `Organization` + `LocalBusiness` JSON-LD in the root layout; `Service` JSON-LD on each service page.
5. Re-verify the site in Google Search Console under the new host (you'll need a new verification method — DNS TXT record is easiest since you already need DNS access for cutover).
6. Canonical URLs — Next.js handles this mostly automatically via `metadataBase`, already set in your scaffold.
7. **Redirect map** — every legacy `.html` URL must 301 to its new route, or the old site's search equity resets at cutover. Already implemented in `next.config.mjs` (`redirects()`), with the verification checklist in `docs/v1-baseline.md` §6. Confirm the unconfirmed legacy filenames against the old repo (Phase 1) and prune the wrong aliases.

**Done when:** `sitemap.xml` and `robots.txt` resolve correctly on the Vercel preview URL, the redirect map covers every legacy URL found in Phase 1, and a structured-data testing tool (Google's Rich Results Test) shows no errors on the home and at least one service page.

---

## Phase 8 — QA pass

Do this on the Vercel preview URL, treating it exactly as if it were already live:

1. **Cross-browser:** Chrome, Safari (important — significant mobile share is iOS Safari), Firefox, Edge.
2. **Cross-device:** an actual phone, not just DevTools responsive mode, if you can.
3. **Accessibility:** keyboard-only navigation through the whole site (Tab/Shift+Tab/Enter/Escape); run axe DevTools or Lighthouse's accessibility audit on every page.
4. **Broken links:** click every nav link, every footer link, every in-content link.
5. **Forms:** submit the contact form for real, confirm delivery.
6. **404 handling:** visit a nonexistent URL, confirm a sane 404 page (Next.js gives you a default — style it minimally, don't ignore it).
7. **Re-run Lighthouse** on every page, compare against your Phase 1 baseline.

Targets to hit before moving on:

```
Lighthouse Performance      90+
Lighthouse Accessibility    95+
Lighthouse Best Practices   95+
Lighthouse SEO              95+
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

If you miss a target, the usual culprits are: an unoptimized hero image (back to Phase 2), a font loading without `display: swap` (already handled in your scaffold via `next/font`), or a third-party script — you should have far fewer of these than the old site already, since Bootstrap/AOS/Swiper/GLightbox/Google Translate are gone.

**Done when:** every item above is checked, and every page beats its Phase 1 baseline score.

---

## Phase 9 — Client review on staging

1. Deploy to a stable, shareable URL — either the Vercel production URL for this project (still not connected to `sachingold.com`) or a subdomain like `v2.sachingold.com` pointed at it, if you want something more "official-looking" for the client to review.
2. Walk the client through it live if possible, rather than just sending a link — you'll catch "that's not right" feedback faster in conversation than over email.
3. Specifically confirm with the client:
   - All contact details, address, rates are correct
   - They're happy with the visual direction (Phase 10's "premium B2B" repositioning)
   - Whether they actually want to self-manage rates/content going forward — this decides if V2b (admin dashboard) happens at all
   - Did visitors rely on the old Google Translate widget (Marathi/Kannada-speaking buyers)? V2 drops it deliberately; if the answer is yes, plan real localization rather than re-adding machine translation
   - How do rates get updated, and how often? The "Last updated" line on /rates must never go stale — agree who updates it and what the fallback is (hide the line rather than show a wrong date)
   - Confirm the second phone number and the full street address — the live-site captures were truncated (see docs/v1-baseline.md §5)
4. Get explicit sign-off before touching DNS. Don't cut over on an assumption that "it's probably fine."

**Done when:** the client has said, in writing (even just a WhatsApp/email "looks good, go ahead"), that they approve the new site.

---

## Phase 10 — Cutover

1. Lower the DNS TTL on `sachingold.com` a day or two in advance, if you have access, so the eventual switch propagates fast.
2. Point the domain's DNS at Vercel (Vercel gives you exact records to add — usually an A record or CNAME depending on whether you're using the apex domain or `www`).
3. Add the domain in the Vercel project settings and let it issue the SSL certificate.
4. Verify `sachingold.com` serves the new site correctly, with HTTPS working, from more than one network/device — and spot-check the redirect map: every legacy `.html` URL in docs/v1-baseline.md §6 must return a 301 to the right new route (`curl -I` is enough).
5. Keep the **old GitHub Pages deployment and repo untouched and accessible** for at least a couple of weeks — this is your rollback path if something unexpected breaks. Don't delete anything.
6. Immediately re-run Lighthouse against the real live domain (scores can differ slightly from preview URLs due to caching/CDN behavior).

**Done when:** `sachingold.com` in a normal browser, on a normal network, shows the new site with a valid HTTPS certificate, and you've kept the old deployment as a fallback.

---

## Phase 11 — Post-launch (first two weeks)

1. Resubmit the sitemap in Google Search Console for the live domain.
2. Watch Search Console for crawl errors over the following days.
3. Verify basic analytics (Google Analytics or a lighter privacy-respecting alternative) — this should already have been wired up in Phase 7/8 so data exists from day one; adding it only after launch forfeits the launch window.
4. Monitor Core Web Vitals in Search Console's field data (this reflects real visitors, not just your Lighthouse runs) over the following weeks.
5. Fix anything that surfaces — broken link a visitor found, a rate that's out of date, etc.

**Done when:** two weeks have passed with no crawl errors and no client-reported issues, and you're confident enough to consider the old repo safe to archive.

---

## Phase 12 — V2b (separate project, only if the client actually wants it)

Do **not** start this until Phase 11 is stable and the client has explicitly said they want to manage rates/content themselves (from the Phase 9 conversation). If they're fine sending you a message twice a week to update a number, skip this entirely — it's real ongoing maintenance burden (auth, database, security patching) that isn't worth it for a site that doesn't need it.

If they do want it:

1. Pick a database (Postgres via Supabase or Neon is a reasonable default, pairs well with Vercel).
2. Build a simple auth-gated `/admin` route (NextAuth or Clerk, don't hand-roll authentication).
3. Start with **just rates management** — the smallest, highest-value slice — before adding products, testimonials, or announcements.
4. Swap `data/rates.ts`'s static export for a fetch from an API route backed by the database; the `Rates` page component doesn't need to change, since you designed it that way in V2a.
5. Re-run the same QA rigor (Phase 8) on the admin flow specifically — broken auth or data loss on a client's live business data is a much worse failure than a CSS bug.

---

## Timeline sanity check

Rough order of magnitude, working solo, part-time alongside other work:

| Phase | Effort |
|---|---|
| 0 — Setup | 1–2 hours |
| 1 — Audit | 2–3 hours |
| 2 — Asset cleanup | 4–8 hours (depends on image count) |
| 3 — Scaffold finishing | 1–2 hours |
| 4 — Components | 1–2 days |
| 5 — Pages | 2–4 days |
| 6 — Contact form | 2–4 hours |
| 7 — SEO | 3–5 hours |
| 8 — QA | 1 day |
| 9 — Client review | depends on client responsiveness |
| 10 — Cutover | 1–2 hours, plus DNS propagation wait |
| 11 — Post-launch watch | 2 weeks calendar time, low active effort |
| 12 — V2b | separate project, scope after Phase 9 conversation |

## Non-negotiables (the "fool-proof" part)

- Never touch DNS before Phase 9 sign-off.
- Never delete the old repo/deployment — archive, don't destroy.
- Never invent a client stat, rate, or testimonial to fill a placeholder.
- Never skip Phase 1 — without a baseline you can't prove the migration actually helped, which weakens both the client pitch and your portfolio story.
- Never combine Phase 12 into the same timeline as Phase 0–11 — it's a different risk profile (real backend, real client data) and deserves its own scoping conversation.
