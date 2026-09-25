import { notFound } from "next/navigation";
import { company, siteUrl } from "@/data/company";
import { services, getServiceBySlug } from "@/data/services";
import { getProductsByService } from "@/data/products";
import { customers } from "@/data/customers";
import { rateGroups } from "@/data/rates";
import { routing } from "@/i18n/routing";
import {
  createPdfKit,
  drawMasthead,
  drawStatsBand,
  PINE,
  WHEAT_DARK,
  Y,
} from "@/lib/pdf";

/**
 * The three generated documents, as pure render functions over a locale.
 *
 * WHY THIS FILE EXISTS: a PDF route URL contains a dot, and dot segments
 * bypass the next-intl middleware — so the locale can never be rewritten
 * in, it must be IN the URL. Both natural URL shapes had to work:
 *
 *   /profile.pdf                  (bare, English — how the site links it)
 *   /hi/profile.pdf               (prefixed — how a localized visitor lands)
 *   /services/<slug>/spec.pdf     (bare)
 *   /hi/services/<slug>/spec.pdf  (prefixed)
 *
 * Next.js forbids two different dynamic names at one route-tree level and
 * forbids the bare 1-segment URL from matching a route nested under
 * [locale] (verified: it 404s). The resolution: each document has TWO
 * thin route files (top-level + under [locale]) that both delegate to the
 * single renderer here — one drawing implementation, two mounts. The
 * spec sheet keeps its third legacy mount (locale as a catch-all SUFFIX,
 * /services/<slug>/spec.pdf/hi) which was shipped first.
 *
 * Content policy, everywhere: every word traces to the message catalogs
 * or the data files. Nothing invented.
 */

/** Build the PDF Response with per-locale filename prefixing. */
export function pdfResponse(
  bytes: Uint8Array,
  baseFilename: string,
  locale: string,
): Response {
  const prefix = locale === routing.defaultLocale ? "" : `${locale}-`;
  return new Response(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${prefix}${baseFilename}"`,
      "Cache-Control": "public, max-age=86400",
      "Content-Language": locale as string,
    },
  });
}

/** Validate a locale segment coming from a URL; 404s on unknown values. */
export function assertLocale(locale: string): void {
  if (!routing.locales.includes(locale as never)) notFound();
}

// ————————————————————————————————————————————————————————————————————————
// Company profile
// ————————————————————————————————————————————————————————————————————————

export async function renderProfilePdf(locale: string): Promise<Uint8Array> {
  const msgs = (await import(`@/messages/${locale}.json`)).default;
  const L = (ns: Record<string, string>, key: string, en: string) =>
    ns?.[key] || en;

  const kit = await createPdfKit({
    title: `${company.name} — ${L(msgs.about, "processTitle", "Company Profile")}`,
    author: company.legalName,
    subject: company.tagline,
    language: locale,
    locale,
  });

  drawMasthead(kit, {
    subline: company.legalName,
    tagline: company.tagline,
  });
  drawStatsBand(kit, [
    [`${company.yearsOfExperience}+`, L(msgs.home.stats, "years", "Years of experience")],
    [`${company.locations.length}`, L(msgs.home.stats, "locations", "Locations")],
    [`${company.processingCapacityTonsPerDay}`, L(msgs.home.stats, "tons", "Tonnes/day capacity")],
    ["1.5L+", L(msgs.home.stats, "farmers", "Farmers via e-Choupal")],
  ]);

  // ————— About — the founding story (about.p1/p2, localized). ———————
  kit.sectionTitle(L(msgs.about, "ourStoryTitle", "About the company"));
  kit.paragraph({
    text: [msgs.about.p1, msgs.about.p2].filter(Boolean).join(" "),
    size: 9.5,
    font: kit.helv,
    lineGap: 4.5,
    opacity: 0.88,
  });

  // ————— How we work — the localized process stages. ————————————————
  kit.sectionTitle(L(msgs.about, "processTitle", "How we work"));
  const stages: [string, string][] = [
    [msgs.about.process1Title, msgs.about.process1Desc],
    [msgs.about.process2Title, msgs.about.process2Desc],
    [msgs.about.process3Title, msgs.about.process3Desc],
    [msgs.about.process4Title, msgs.about.process4Desc],
  ];
  const pdfLabels: Record<string, string> = msgs.about.pdfLabels ?? {};
  stages.forEach(([title, desc], i) => {
    kit.ensureSpace(70);
    kit.text(String(i + 1).padStart(2, "0"), {
      size: 11,
      font: kit.bold,
      dy: 0,
    });
    kit.text(title, { size: 10.5, font: kit.bold, dx: 26 });
    kit.y += 17;
    kit.paragraph({
      text: desc,
      size: 9,
      font: kit.helv,
      lineGap: 3.5,
      opacity: 0.85,
      dx: 26,
    });
    kit.y += 6;
  });

  // ————— Services — stage titles + one-line summaries. ——————————————
  kit.sectionTitle(L(pdfLabels, "whatWeDo", "What we do"));
  for (const s of services) {
    kit.ensureSpace(88);
    const item = msgs.services.items[s.slug];
    kit.paragraph({
      text: item?.title || s.title,
      size: 10.5,
      font: kit.bold,
    });
    const summary = item?.stageNote || s.stageNote || s.shortDescription;
    kit.paragraph({
      text: summary,
      size: 9,
      font: kit.oblique,
      opacity: 0.8,
      lineGap: 3,
    });
    for (const advantage of (item?.advantages || s.advantages).slice(0, 3)) {
      kit.bullet(advantage);
    }
    kit.y += 8;
  }

  // ————— Customers — exactly the site's logo-strip names. ———————————
  kit.sectionTitle(L(msgs.home.logos ?? {}, "eyebrow", "Trusted by"));
  kit.paragraph({
    text: customers.map((c) => c.name).join("  ·  "),
    size: 9.5,
    font: kit.helv,
    opacity: 0.85,
    lineGap: 4,
  });

  // ————— Facilities. —————————————————————————————————————————————————
  kit.sectionTitle(L(pdfLabels, "facilities", "Our facilities"));
  for (const f of company.facilities) {
    kit.ensureSpace(56);
    kit.paragraph({
      text: f.name,
      size: 9.5,
      font: kit.bold,
    });
    kit.paragraph({
      text: `${f.address} · ${f.phone}`,
      size: 8.5,
      font: kit.helv,
      opacity: 0.8,
      lineGap: 2.5,
    });
    kit.y += 6;
  }

  kit.ensureSpace(110);
  kit.contactBand(L(msgs.about.pdfLabels ?? {}, "talkToUs", "Talk to us"));

  return kit.finish();
}

// ————————————————————————————————————————————————————————————————————————
// Rate card
// ————————————————————————————————————————————————————————————————————————

export async function renderRatesPdf(locale: string): Promise<Uint8Array> {
  const msgs = (await import(`@/messages/${locale}.json`)).default;
  const pdfLabels: Record<string, string> = msgs.rates.pdfLabels ?? {};
  const L = (key: string, en: string) => pdfLabels[key] || en;

  const kit = await createPdfKit({
    title: `${company.name} — ${L("docTitle", "Indicative Market Rates")}`,
    author: company.legalName,
    subject: L(
      "docSubject",
      "Indicative rates for soya derivatives, dals and flour — bulk enquiries via WhatsApp or phone",
    ),
    language: locale,
    locale,
  });

  drawMasthead(kit, {
    subline: L("docTitle", "Indicative Market Rates"),
    tagline: L(
      "tagline",
      "Bulk commodity rates — final pricing on request, by volume",
    ),
  });
  kit.y += 4;

  const flagship = (msgs.rates.flagship as string) || "";
  const productHeader = msgs.rates.productHeader || "Product";
  const rateHeader = msgs.rates.rateHeader || "Indicative rate";

  for (const group of rateGroups) {
    kit.sectionTitle(msgs.rates.groups?.[group.title] || group.title);

    // Table header row — small caps, hairline under.
    kit.text(productHeader.toUpperCase(), {
      size: 7.5,
      font: kit.bold,
      opacity: 0.55,
    });
    kit.text(rateHeader.toUpperCase(), {
      size: 7.5,
      font: kit.bold,
      opacity: 0.55,
      dx: kit.w - 170,
    });
    kit.y += 13;
    kit.page.drawRectangle({
      x: kit.x0,
      y: Y(kit.y),
      width: kit.w,
      height: 0.6,
      color: PINE,
      opacity: 0.4,
    });
    kit.y += 7;

    for (const item of group.items) {
      kit.ensureSpace(34);
      const isFlagship = flagship && item.product.includes(flagship);
      // Product name (+ quiet flagship star on the DOC lines).
      kit.text(isFlagship ? `★ ${item.product}` : item.product, {
        size: 9.5,
        font: kit.bold,
      });
      // Price at a fixed right column.
      const price = item.price;
      const priceW = kit.helv.widthOfTextAtSize(price, 9);
      kit.text(price, {
        size: 9,
        font: kit.helv,
        dx: kit.w - Math.min(170, priceW + 4),
        dy: 0.5,
      });
      kit.y += 13;
      // Unit line under the product, muted.
      kit.text(item.unit, {
        size: 7.5,
        font: kit.oblique,
        opacity: 0.65,
        dx: 12,
      });
      kit.y += 11;
      if (isFlagship) {
        kit.text(`★ ${flagship}`, {
          size: 7,
          font: kit.bold,
          opacity: 0.7,
          dx: 12,
        });
        kit.y += 10;
      }
      kit.page.drawRectangle({
        x: kit.x0,
        y: Y(kit.y),
        width: kit.w,
        height: 0.4,
        color: PINE,
        opacity: 0.18,
      });
      kit.y += 7;
    }

    if (group.updatedOn) {
      kit.text(`${L("updated", "Updated")}: ${group.updatedOn}`, {
        size: 7.5,
        font: kit.oblique,
        opacity: 0.6,
      });
      kit.y += 12;
    }
    kit.y += 4;
  }

  // ————— Disclaimer + contact band. ——————————————————————————————————
  kit.ensureSpace(120);
  kit.paragraph({
    text: L(
      "disclaimer",
      "Rates are indicative and subject to market movement. Final pricing depends on volume, grade and delivery terms — call or message us for a firm quote.",
    ),
    size: 8,
    font: kit.helv,
    opacity: 0.7,
    lineGap: 3,
  });
  kit.ensureSpace(110);
  kit.contactBand(msgs.rates.waCta || "Request a quote");

  return kit.finish();
}

// ————————————————————————————————————————————————————————————————————————
// Per-service spec sheet
// ————————————————————————————————————————————————————————————————————————

export async function renderSpecPdf(
  locale: string,
  slug: string,
): Promise<Uint8Array | null> {
  const service = getServiceBySlug(slug);
  if (!service) return null;

  const products = getProductsByService(slug);
  const msgs = (await import(`@/messages/${locale}.json`)).default;
  const item = msgs.services.items[slug];
  if (!item) return null;

  const labels: Record<string, string> = msgs.services.pdfLabels ?? {};
  const L = (key: string, en: string) => labels[key] || en;

  const kit = await createPdfKit({
    title: `${company.name} — ${item.title} (${L("specTitle", "Spec Sheet")})`,
    author: company.legalName,
    subject: item.stageNote || item.description.slice(0, 120),
    language: locale,
    locale,
  });

  drawMasthead(kit, {
    subline: item.title,
    tagline: item.stageNote || item.description.slice(0, 90),
  });

  // ————— At a glance — real figures. —————————————————————————————————
  const stats = (msgs.services.stats as Record<string, { v: string; l: string }[]>)?.[
    slug
  ];
  if (stats && stats.length > 0) {
    drawStatsBand(kit, stats.map((s) => [s.v, s.l] as [string, string]));
  }

  // ————— Overview. —————————————————————————————————————————————————————
  kit.sectionTitle(L("overview", "Overview"));
  kit.paragraph({
    text: item.description,
    size: 9.5,
    font: kit.helv,
    lineGap: 4.5,
    opacity: 0.88,
  });

  // ————— Key advantages. ————————————————————————————————————————————
  if (item.advantages.length > 0) {
    kit.sectionTitle(L("advantages", "Key advantages"));
    for (const advantage of item.advantages) kit.bullet(advantage);
  }

  // ————— Products in this line — Latin names (site parity), English
  //       one-liners until product copy is translated. ———————————————
  if (products.length > 0) {
    kit.sectionTitle(
      `${L("productsInLine", "Products in this line")} (${products.length})`,
    );
    for (const product of products) {
      kit.ensureSpace(48);
      kit.text(product.name, { size: 9.5, font: kit.bold, color: PINE });
      const catW = kit.oblique.widthOfTextAtSize(product.category, 7.5);
      kit.text(product.category, {
        size: 7.5,
        font: kit.oblique,
        color: WHEAT_DARK,
        dx: kit.w - catW,
      });
      kit.y += 15;
      kit.paragraph({
        text: product.description,
        size: 8.5,
        font: kit.helv,
        lineGap: 2.5,
        opacity: 0.8,
      });
      kit.y += 6;
    }
  }

  // ————— Where we operate. ——————————————————————————————————————————
  if (item.locations?.length > 0) {
    kit.sectionTitle(L("where", "Where we operate"));
    for (const location of item.locations) kit.bullet(location);
  }

  kit.ensureSpace(110);
  kit.contactBand(L("requestQuote", "Request a quote"));

  return kit.finish();
}

// Re-export so thin routes can build filenames without importing elsewhere.
export { siteUrl };
