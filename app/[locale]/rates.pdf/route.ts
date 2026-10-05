import { renderRatesPdf, pdfResponse, assertLocale } from "@/lib/pdf-docs";
import { routing } from "@/i18n/routing";

/**
 * /<locale>/rates.pdf — the localized rate card (e.g. /hi/rates.pdf).
 * The locale is a real segment here so the URL matches without any
 * middleware involvement. Delegates to the single renderer in
 * lib/pdf-docs.ts; the bare English URL is served by the top-level
 * app/rates.pdf mount.
 */

/**
 * Same window as the rates page (app/[locale]/rates/page.tsx). The card is
 * rendered from live sheet data via getLiveRateGroups, so without this the
 * PDF is baked at build time and a card downloaded weeks after the last
 * deploy quotes prices the page no longer shows — and this file is the
 * artefact a buyer forwards to their accounts team. The webhook's
 * revalidateTag("rates") refreshes it sooner when configured.
 */
export const revalidate = 300;

/** Match the revalidate window: never let an edge hold the card longer. */
const PDF_CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=300";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: { params: { locale: string } },
) {
  const { locale } = params;
  assertLocale(locale);
  return pdfResponse(
    await renderRatesPdf(locale),
    "sachin-gold-rate-card.pdf",
    locale,
    PDF_CACHE,
  );
}
