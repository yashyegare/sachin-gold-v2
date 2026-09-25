import { renderSpecPdf, pdfResponse, assertLocale } from "@/lib/pdf-docs";
import { routing } from "@/i18n/routing";
import { services } from "@/data/services";
import { notFound } from "next/navigation";

/**
 * /<locale>/services/<slug>/spec.pdf — the localized per-service spec
 * sheet (e.g. /hi/services/pulses-processing/spec.pdf). Locale and slug
 * are real segments so the URL matches without middleware involvement;
 * the bare English URL is served by app/services/[slug]/spec.pdf, and
 * the legacy locale-suffix mount (…/spec.pdf/hi) by its catch-all.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function GET(
  _request: Request,
  { params }: { params: { locale: string; slug: string } },
) {
  const { locale, slug } = params;
  assertLocale(locale);
  const bytes = await renderSpecPdf(locale, slug);
  if (!bytes) notFound();
  return pdfResponse(bytes, `${slug}-spec.pdf`, locale);
}
