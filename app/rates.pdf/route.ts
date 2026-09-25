import { renderRatesPdf, pdfResponse } from "@/lib/pdf-docs";

/**
 * /rates.pdf — the English rate card. Bare dot-URL, top-level mount
 * (outside [locale]); localized mounts live under app/[locale]/rates.pdf.
 * Both delegate to the single renderer in lib/pdf-docs.ts.
 */
export async function GET() {
  return pdfResponse(await renderRatesPdf("en"), "sachin-gold-rate-card.pdf", "en");
}
