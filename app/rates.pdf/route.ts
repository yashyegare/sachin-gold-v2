import { renderRatesPdf, pdfResponse } from "@/lib/pdf-docs";

/**
 * /rates.pdf — the English rate card. Bare dot-URL, top-level mount
 * (outside [locale]); localized mounts live under app/[locale]/rates.pdf.
 * Both delegate to the single renderer in lib/pdf-docs.ts.
 *
 * See app/[locale]/rates.pdf/route.ts for why the card must not be baked
 * at build time — it carries live sheet prices.
 */
export const revalidate = 300;

const PDF_CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=300";

export async function GET() {
  return pdfResponse(
    await renderRatesPdf("en"),
    "sachin-gold-rate-card.pdf",
    "en",
    PDF_CACHE,
  );
}
