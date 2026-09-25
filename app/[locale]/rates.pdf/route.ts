import { renderRatesPdf, pdfResponse, assertLocale } from "@/lib/pdf-docs";
import { routing } from "@/i18n/routing";

/**
 * /<locale>/rates.pdf — the localized rate card (e.g. /hi/rates.pdf).
 * The locale is a real segment here so the URL matches without any
 * middleware involvement. Delegates to the single renderer in
 * lib/pdf-docs.ts; the bare English URL is served by the top-level
 * app/rates.pdf mount.
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
    await renderRatesPdf(locale),
    "sachin-gold-rate-card.pdf",
    locale,
  );
}
