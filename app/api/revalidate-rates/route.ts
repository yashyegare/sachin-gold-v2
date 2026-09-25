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
 * The `api` segment is excluded from the i18n middleware matcher, so the
 * dot-free path needs no locale handling.
 */

const TAG = "rates";

function authorized(url: URL, request: Request): boolean {
  const secret = process.env.RATES_REVALIDATE_SECRET;
  if (!secret) return false; // unset secret = endpoint hard-disabled
  const provided =
    url.searchParams.get("secret") ??
    request.headers.get("x-webhook-secret") ??
    "";
  return provided === secret;
}

async function handle(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  if (!authorized(url, request)) {
    return NextResponse.json(
      { revalidated: false, error: "unauthorized" },
      { status: 401 },
    );
  }
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

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
