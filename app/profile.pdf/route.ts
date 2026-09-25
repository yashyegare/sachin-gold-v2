import { renderProfilePdf, pdfResponse } from "@/lib/pdf-docs";

/**
 * /profile.pdf — the English company profile. The bare dot-URL bypasses
 * the i18n middleware, so this top-level mount (outside [locale]) is the
 * ONLY way this URL can resolve; the localized mounts live under
 * app/[locale]/profile.pdf. Both delegate to the single renderer in
 * lib/pdf-docs.ts — see there for the full routing rationale.
 */
export async function GET() {
  return pdfResponse(await renderProfilePdf("en"), "sachin-gold-company-profile.pdf", "en");
}
