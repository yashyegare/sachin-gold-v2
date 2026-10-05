import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * /api/revalidate-rates — the "instant" half of the dynamic-prices setup.
 *
 * An Apps Script trigger on the owner's Google Sheet pings this URL after
 * every edit; we drop the cached sheet fetch ("rates" tag), so the next
 * visitor gets the fresh numbers within seconds instead of waiting out
 * the 5-minute ISR window (the safety net that still applies if this
 * webhook is ever unreachable).
 *
 * SETUP (one-time, docs/dynamic-rates.md has the full walkthrough):
 *   1. Set RATES_REVALIDATE_SECRET in Vercel (any long random string).
 *   2. Paste the Apps Script from the docs into the sheet's
 *      Extensions → Apps Script; it reads the secret from Script
 *      Properties and POSTs here on edit.
 *
 * THE SECRET TRAVELS IN A HEADER ONLY. A query string is copied into
 * every proxy, CDN and platform access log between the sheet and here —
 * and this endpoint's URL is written into a Google Sheet's script, which
 * anyone with view access to the sheet can open. `x-webhook-secret` keeps
 * it out of those logs.
 *
 * POST only: a GET would let the secret leak through the same route (the
 * browser's history, Referer headers, any link that ever points here).
 *
 * The `api` segment is excluded from the i18n middleware matcher, so the
 * dot-free path needs no locale handling.
 */

const TAG = "rates";
const SECRET_HEADER = "x-webhook-secret";

/** Minimum gap between two accepted revalidations. A sheet with a runaway
 *  trigger (or two people editing at once) would otherwise call
 *  `revalidateTag` on every keystroke; the fetch it invalidates is already
 *  rate-limited to one-per-5-minutes by ISR, so extra pings buy nothing.
 *  Per-instance and in-memory — on serverless this is a courtesy limit,
 *  not a global one, which is why it stays generous. */
const MIN_GAP_MS = 10_000;
let lastAcceptedAt = 0;

function authorized(request: Request): boolean {
  const secret = process.env.RATES_REVALIDATE_SECRET;
  if (!secret) return false; // unset secret = endpoint hard-disabled
  const provided = request.headers.get(SECRET_HEADER) ?? "";
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(secret, "utf8");
  // timingSafeEqual throws on length mismatch, so the length gate comes
  // first. It does leak the secret's length to a timing attacker — the
  // standard trade-off for a constant-time compare, and nothing a
  // 32+ char random secret needs to worry about.
  return a.length === b.length && timingSafeEqual(a, b);
}

/** POST /api/revalidate-rates  (header: x-webhook-secret) */
export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json(
      { revalidated: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  const now = Date.now();
  if (now - lastAcceptedAt < MIN_GAP_MS) {
    return NextResponse.json({
      revalidated: false,
      throttled: true,
      retryAfterMs: MIN_GAP_MS - (now - lastAcceptedAt),
    });
  }
  lastAcceptedAt = now;

  try {
    revalidateTag(TAG);
    return NextResponse.json({
      revalidated: true,
      tag: TAG,
      at: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        revalidated: false,
        error: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 },
    );
  }
}
