import { renderProfilePdf, pdfResponse, assertLocale } from "@/lib/pdf-docs";
import { routing } from "@/i18n/routing";

/**
 * /<locale>/profile.pdf — the localized company profile (e.g.
 * /hi/profile.pdf). The locale is a real segment here so the URL matches
 * without any middleware involvement. Delegates to the single renderer
 * in lib/pdf-docs.ts; the bare English URL is served by the top-level
 * app/profile.pdf mount.
 */
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
    await renderProfilePdf(locale),
    "sachin-gold-company-profile.pdf",
    locale,
  );
}
