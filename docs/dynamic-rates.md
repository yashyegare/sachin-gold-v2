# Dynamic prices — the Google Sheet setup

Prices on the site are live from the same Google Sheet the old site fed
through SheetDB (`normal/highpro/oil/...` → the site's product list).
The employee's workflow does not change at all: he edits the sheet, the
site updates. No SheetDB account, no monthly bill, no request caps.

**The sheet:** https://docs.google.com/spreadsheets/d/1BGvvfsJsbqo6Lr-tv_QMro1iZRcRRNVZI9jNRatzdFE/edit

## How it works (two layers)

| Layer | Speed | What it is |
|---|---|---|
| ISR safety net | ≤ 5 min | The site re-fetches the sheet at most every 5 minutes (`RATES_REVALIDATE_SECONDS` in `lib/rates-source.ts`). Always on, zero setup. |
| Instant webhook | seconds | A tiny Apps Script on the sheet pings `/api/revalidate-rates` after every edit; the next visitor gets fresh numbers immediately. One-time setup below. |

If Google is unreachable, slow (the fetch gives up after 8 seconds) or the
sheet is garbled, the site serves the built-in fallback rows and the rates
page says **"Live price feed unavailable"** with a phone number, instead of
quietly showing "On request" for everything. A broken feed can never break
the page, and it can never be mistaken for "we publish no prices". Prices,
the home ticker, the JSON-LD offers and the rate-card PDF all read the same
snapshot, so they can never disagree.

## One-time setup checklist

1. **Sheet sharing** — the sheet must stay "Anyone with the link can
   view" (it already is; that's how the old site read it). Never remove
   that or prices fall back to "On request".

2. **Vercel env var** — add in Vercel → Project → Settings → Environment
   Variables:
   - `RATES_REVALIDATE_SECRET` = any long random string
     (e.g. `openssl rand -hex 24`). This arms the webhook endpoint; with
     it unset the endpoint answers 401 to everything.

3. **Apps Script (instant updates)** — in the sheet:
   Extensions → Apps Script, paste:

   ```javascript
   const SITE = 'https://sachin-gold-v2.vercel.app'; // update at cutover

   function ping_() {
     const secret = PropertiesService.getScriptProperties()
       .getProperty('RATES_REVALIDATE_SECRET');
     // The secret goes in a header, never the URL: query strings are
     // written into access logs at every hop between here and the site.
     return UrlFetchApp.fetch(SITE + '/api/revalidate-rates', {
       method: 'post',
       headers: { 'x-webhook-secret': secret || '' },
       muteHttpExceptions: true,
     }).getResponseCode();
   }

   function onEdit() { ping_(); }        // fires on every edit
   function tick()   { ping_(); }        // safety ping, every 15 min
   ```

   Then **Project properties → Script properties**: add
   `RATES_REVALIDATE_SECRET` with the same value you put in Vercel. Keep
   the value out of the script itself — anyone with *view* access to the
   sheet can read the code.

   Then: clock icon (Triggers) → Add Trigger → function `tick` →
   time-driven → every 15 minutes. `onEdit` fires by itself on every
   edit; the timed `tick` is just belt-and-braces.

   Expect `200` with `{"revalidated":true}`. A `401` means the two secret
   values differ; `405` means something is calling the endpoint with GET
   (only POST is accepted); `{"throttled":true}` is normal when edits
   arrive faster than 10 seconds apart — the 5-minute ISR window still
   catches up on its own.

4. **Update the mapping only if the sheet's product keys change** —
   `KEY_TO_PRODUCT` in `lib/rates-source.ts` maps the sheet's `name`
   column (`normal`, `highpro`, `oil`, `refined`, `fatty`, `acid`,
   `lecithin`, `toor`, `chana`, `besan`) to the site's product names.
   New product rows in the sheet are ignored safely until mapped.

## What the employee should know

Nothing new. Edit `price` (a plain number: `50000` or `140`) and the
`time` column updates — the site shows price as `₹ 50,000` (en-IN
formatting) and "Updated 25 Sep 2026, 07:36 IST" from that timestamp.
Leaving a price cell blank or typing text keeps that row at "On
request" on the site — useful for items he doesn't want to publish.

## Where things live in the code

| File | Role |
|---|---|
| `lib/rates-source.ts` | Sheet fetch + CSV parse + overlay on the static fallback; the only file that knows the sheet's shape |
| `data/rates.ts` | Static fallback + the canonical product/unit structure (unchanged) |
| `app/api/revalidate-rates/route.ts` | The webhook (POST-only, `x-webhook-secret` header, timing-safe compare, 10s throttle) |
| `app/[locale]/rates/page.tsx` | Table page (`revalidate = 300`) |
| `app/[locale]/page.tsx` | Home ticker gate |
| `lib/pdf-docs.ts` | The rate-card PDF reads the same live groups |

## Known trade-offs (deliberate)

- **Publish-to-web is read-only and cacheable** — exactly what we want
  for a public price list; it is not a channel for secrets.
- **Google CSV export has no SLA** — hence the fallback + ISR design;
  worst case is a stale price for a few minutes, never a broken page.
- **`updatedOn` takes the first timestamp found** in the group — the
  sheet's rows share one edit timestamp in practice; if the employee
  ever edits rows at different times, the shown date is the first row's.
