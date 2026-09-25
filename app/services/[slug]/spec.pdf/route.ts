import { renderSpecPdf, pdfResponse } from "@/lib/pdf-docs";
import { notFound } from "next/navigation";

/**
 * /services/<slug>/spec.pdf — the English spec sheet. Bare dot-URL,
 * top-level mount (outside [locale]); localized mounts live under
 * app/[locale]/services/[slug]/spec.pdf. Both delegate to the single
 * renderer in lib/pdf-docs.ts.
 */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  const bytes = await renderSpecPdf("en", slug);
  if (!bytes) notFound();
  return pdfResponse(bytes, `${slug}-spec.pdf`, "en");
}
