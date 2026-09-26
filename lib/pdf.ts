import {
  PDFDocument,
  PDFName,
  PDFString,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
// fontkit's shipped builds reference the regeneratorRuntime global but
// never define it (the babel runtime was left out of the bundle) — Node
// throws "regeneratorRuntime is not defined" the first time its glyph
// iterator runs. Importing the official runtime (tiny, side-effect
// global definition) before fontkit fixes it for both `next start` and
// the build-time prerender workers.
import "regenerator-runtime/runtime.js";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fontkit = require("@pdf-lib/fontkit/dist/fontkit.umd.js") as any;
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { company, siteUrl } from "@/data/company";
import type { Locale } from "@/i18n/routing";

/**
 * Shared drawing kit for the generated PDFs (profile.pdf, spec.pdf,
 * rates.pdf). One kit means every PDF shares the exact same brand
 * system — palette, type scale, masthead, section rhythm, footer —
 * instead of each route re-implementing them with drifting values.
 *
 * CURSOR RULE (the bug this kit exists to prevent): the ONLY cursor is
 * `kit.y`, and EVERY drawing method on the kit both reads and advances
 * it. Routes must never keep a local y variable, and must never draw
 * with page.drawText at hand-computed coordinates — if a primitive is
 * missing, add it to the kit so the cursor stays coherent. The first
 * spec-sheet generation shipped with route code mixing `kit.y` advances
 * against the kit's closure-scoped cursor; every paragraph after the
 * first section piled up at the top of the page on top of each other.
 *
 * Brand palette mirrored from tailwind.config.ts — pdf-lib can't read
 * Tailwind, so the hexes are quoted here with a pointer to the source
 * of truth. Keep in sync manually if the brand palette ever moves.
 */

export const PINE = rgb(0x0f / 255, 0x4c / 255, 0x2e / 255); // pine #0F4C2E
export const PINE_DEEP = rgb(0x0a / 255, 0x36 / 255, 0x20 / 255); // pine-deep #0A3620
export const WHEAT_BRIGHT = rgb(0xd9 / 255, 0xa9 / 255, 0x3c / 255); // wheat-bright #D9A93C (dark surfaces)
export const WHEAT_DARK = rgb(0x8a / 255, 0x64 / 255, 0x14 / 255); // wheat-dark #8A6414 (light surfaces)
export const INK = rgb(0x16 / 255, 0x23 / 255, 0x1c / 255); // ink #16231C
export const LINEN = rgb(0xf6 / 255, 0xf4 / 255, 0xee / 255); // linen #F6F4EE
export const WHITE = rgb(1, 1, 1);

/**
 * fontkit's GPOS mark-positioning crashes on certain Telugu conjuncts
 * ("Cannot read properties of null (reading 'xCoordinate')") — 18 of the
 * Telugu catalog's real strings abort embed/measure/draw entirely, killing
 * the whole document. hi/mr/kn/ta shape 100% clean on the same catalogs;
 * it's a fontkit shaping-engine bug, not a font defect (both Noto Sans and
 * Noto Serif Telugu fail identically, GSUB itself is fine).
 *
 * Guard: degrade the failing anchor to the glyph origin — marks render at
 * base position instead of their attached offset on affected clusters,
 * and the document survives. Verified byte-equivalent output for
 * Kannada/Devanagari/Tamil with the patch in place.
 */
let gposPatched = false;
function patchFontkitGPOS(): void {
  if (gposPatched) return;
  gposPatched = true;
  try {
    // GPOSProcessor lives on the layout-engine instance; reach its class
    // prototype through a throwaway Telugu font (the known-bad script).
    const probe = fontkit.create(loadFont("NotoSansTelugu-Regular.ttf"));
    const proto = Object.getPrototypeOf(
      (probe as { _layoutEngine?: { engine?: { GPOSProcessor?: unknown } } })
        ._layoutEngine?.engine?.GPOSProcessor ?? {},
    ) as { getAnchor?: (...args: unknown[]) => unknown };
    if (typeof proto.getAnchor !== "function") return;
    const orig = proto.getAnchor;
    proto.getAnchor = function (this: unknown, ...args: unknown[]) {
      try {
        const anchor = orig.apply(this, args);
        return anchor ?? { xCoordinate: 0, yCoordinate: 0 };
      } catch {
        return { xCoordinate: 0, yCoordinate: 0 };
      }
    };
  } catch {
    // Fonts not fetched yet (fresh checkout — run scripts/fetch-pdf-fonts.mjs).
    // English PDFs never need this; Indic generation would fail at embed
    // time with a clear error regardless.
  }
}

export const PAGE_W = 595.28; // A4
export const PAGE_H = 841.89;
export const MARGIN = 56;
export const CONTENT_W = PAGE_W - 2 * MARGIN;
// Top-based coordinates (like the site's layout thinking): Y(n) = n pt
// down from the top edge.
export const Y = (fromTop: number) => PAGE_H - fromTop;

export interface PdfKit {
  doc: PDFDocument;
  helv: PDFFont;
  bold: PDFFont;
  oblique: PDFFont;
  page: PDFPage;
  pages: PDFPage[];
  /** The one and only vertical cursor (points from page top). */
  y: number;
  /** Left edge of the current block; setters below scope sections. */
  x0: number;
  /** Usable width from x0; reset by the same setters. */
  w: number;
  /** Scope subsequent drawing to [x, width]; resets the cursor's x. */
  scope: (x: number, width: number) => void;
  /** Back to full-width content. */
  resetScope: () => void;
  newPage: () => void;
  /** Roll to a new page if fewer than `needed` pt remain above the footer zone. */
  ensureSpace: (needed: number) => void;
  text: (
    s: string,
    opts: {
      size: number;
      font: PDFFont;
      color?: ReturnType<typeof rgb>;
      dy?: number;
      opacity?: number;
      /** Draw at an x-offset from x0 for this one call without scoping. */
      dx?: number;
    },
  ) => void;
  /** Greedy word-wrap; calls back per line, advancing y. */
  wrapText: (
    text: string,
    size: number,
    font: PDFFont,
    maxWidth: number,
    draw: (line: string) => void,
    lineHeight?: number,
  ) => void;
  /** Wrapped paragraph at the cursor; advances y by total height. */
  paragraph: (opts: {
    text: string;
    size: number;
    font: PDFFont;
    color?: ReturnType<typeof rgb>;
    lineGap?: number;
    opacity?: number;
    maxW?: number;
    dy?: number;
    dx?: number;
  }) => void;
  /** Thin gold rule + small-caps section title, the site's rhythm. */
  sectionTitle: (title: string) => void;
  /** A bulleted line ("– " in wheat) with hanging indent. */
  bullet: (text: string, opts?: { size?: number; gap?: number }) => void;
  drawFooter: (p: PDFPage) => void;
  /** Pine-deep contact band; call ensureSpace(110) first. */
  contactBand: (heading?: string) => void;
  finish: () => Promise<Uint8Array>;
}

/**
 * Full Noto Sans TTFs (fetched by scripts/fetch-pdf-fonts.mjs into
 * public/fonts/, server-side only) embedded via fontkit. Needed because
 * pdf-lib's standard 14 fonts are Latin-only — Indic text without them
 * renders as blank/garbled. Regular+bold per script; oblique is the
 * regular at reduced opacity (Noto has no true italic).
 */
const FONT_DIR = join(process.cwd(), "public", "fonts");
const fontCache = new Map<string, Uint8Array>();

function loadFont(file: string): Uint8Array {
  let buf = fontCache.get(file);
  if (!buf) {
    buf = new Uint8Array(readFileSync(join(FONT_DIR, file)));
    fontCache.set(file, buf);
  }
  return buf;
}

/** Per-locale font files: Latin + the locale's Indic script.
 *  Falls back to Latin-only for en or unknown locales. */
export function fontsForLocale(locale: string): {
  regular: string | null;
  bold: string | null;
} {
  const script: Partial<Record<Locale, string>> = {
    hi: "Devanagari",
    mr: "Devanagari",
    kn: "Kannada",
    te: "Telugu",
    ta: "Tamil",
  };
  const family = script[locale as Locale];
  if (!family) return { regular: null, bold: null };
  return {
    regular: `NotoSans${family}-Regular.ttf`,
    bold: `NotoSans${family}-Bold.ttf`,
  };
}

/** WhatsApp deep link behind the PDF contact band's tap target: wa.me
 *  opens a chat with a prefilled bulk-quote message, so a mobile reader
 *  goes straight into a quote request instead of copying the number. */
const WHATSAPP_URL = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
  "Hello Sachin Gold, I would like a quote for bulk supply.",
)}`;

/** Attach an invisible-tap link annotation to the kit's current page.
 *  Rect is PDF user space from the bottom-left { x, y, w, h }; no border
 *  or color is painted, so the printed page is pixel-identical — the
 *  annotation only adds the interactive tap/click target. */
function addLinkAnnotation(
  kit: PdfKit,
  rect: { x: number; y: number; w: number; h: number },
  url: string,
): void {
  const context = kit.doc.context;
  const annot = context.obj({
    Type: PDFName.of("Annot"),
    Subtype: PDFName.of("Link"),
    Rect: [rect.x, rect.y, rect.x + rect.w, rect.y + rect.h],
    Border: [0, 0, 0],
    A: context.obj({
      Type: PDFName.of("Action"),
      S: PDFName.of("URI"),
      URI: PDFString.of(url),
    }),
  });
  const ref = context.register(annot);
  const annots = kit.page.node.Annots();
  if (annots) annots.push(ref);
  else kit.page.node.set(PDFName.of("Annots"), context.obj([ref]));
}

export async function createPdfKit(opts: {
  title: string;
  author: string;
  subject: string;
  /** BCP-47 language tag for the document metadata (screen readers,
   *  search indexing). Optional — omit for English defaults. */
  language?: string;
  /** Locale whose script the document body uses. When a non-Latin
   *  locale is given, real Noto Sans fonts are embedded (via fontkit)
   *  so Indic text renders; text-width measurement uses the embedded
   *  font so wrapping stays correct. Latin-only content in an Indic
   *  document renders fine too — Noto covers Latin. */
  locale?: string;
}): Promise<PdfKit> {
  patchFontkitGPOS();
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(opts.title);
  doc.setAuthor(opts.author);
  doc.setSubject(opts.subject);
  if (opts.language) doc.setLanguage(opts.language);

  let helv: PDFFont;
  let bold: PDFFont;
  let oblique: PDFFont;

  const noto = opts.locale
    ? fontsForLocale(opts.locale)
    : { regular: null, bold: null };
  if (noto.regular && noto.bold) {
    helv = await doc.embedFont(loadFont(noto.regular), { subset: true });
    bold = await doc.embedFont(loadFont(noto.bold), { subset: true });
    oblique = helv; // Noto has no italic; opacity does the differentiating
  } else {
    helv = await doc.embedFont(StandardFonts.Helvetica);
    bold = await doc.embedFont(StandardFonts.HelveticaBold);
    oblique = await doc.embedFont(StandardFonts.HelveticaOblique);
  }

  let page = doc.addPage([PAGE_W, PAGE_H]);
  const pages: PDFPage[] = [page];

  const kit: PdfKit = {
    doc,
    helv,
    bold,
    oblique,
    page,
    pages,
    y: MARGIN,
    x0: MARGIN,
    w: CONTENT_W,

    scope(x, width) {
      kit.x0 = x;
      kit.w = width;
    },

    resetScope() {
      kit.x0 = MARGIN;
      kit.w = CONTENT_W;
    },

    newPage() {
      page = doc.addPage([PAGE_W, PAGE_H]);
      pages.push(page);
      kit.page = page;
      kit.y = MARGIN;
    },

    ensureSpace(needed) {
      if (kit.y + needed > PAGE_H - 64) kit.newPage();
    },

    text(s, { size, font, color = INK, dy = 0, opacity, dx = 0 }) {
      page.drawText(s, {
        x: kit.x0 + dx,
        y: Y(kit.y + size + dy),
        size,
        font,
        color,
        ...(opacity !== undefined ? { opacity } : {}),
      });
    },

    wrapText(text, size, font, maxWidth, draw, lineHeight) {
      const lh = lineHeight ?? size;
      const words = text.replace(/\s+/g, " ").trim().split(" ");
      let line = "";
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
          line = candidate;
        } else {
          if (line) draw(line);
          line = word;
        }
      }
      if (line) draw(line);
    },

    paragraph({
      text,
      size,
      font,
      color = INK,
      lineGap = 0,
      opacity,
      maxW,
      dy = 0,
      dx = 0,
    }) {
      kit.y += dy;
      const width = (maxW ?? kit.w) - dx;
      kit.wrapText(text, size, font, width, (line) => {
        kit.text(line, { size, font, color, opacity, dx });
        kit.y += size + lineGap;
      });
    },

    sectionTitle(title) {
      kit.ensureSpace(64);
      kit.y += 16;
      page.drawRectangle({
        x: kit.x0,
        y: Y(kit.y + 2),
        width: 34,
        height: 2,
        color: WHEAT_DARK,
      });
      kit.y += 12;
      kit.text(title.toUpperCase(), { size: 11, font: bold, color: PINE });
      kit.y += 22;
    },

    bullet(text, { size = 9, gap = 5 } = {}) {
      kit.ensureSpace(24);
      kit.text("–", { size, font: bold, color: WHEAT_DARK });
      kit.paragraph({
        text,
        size,
        font: helv,
        color: INK,
        lineGap: 2.5,
        opacity: 0.85,
        dx: 14,
      });
      kit.y += gap;
    },

    drawFooter(p) {
      const line = `${company.name} · ${siteUrl.replace("https://", "")} · ${company.phone}`;
      // PDF user space measures from the BOTTOM. The old code wrapped
      // from-top values in Y() — a double negative that landed in the
      // right zone by accident but inverted the strip's internal order:
      // the gold rule drew ABOVE the text (y=48 vs baseline y=40),
      // stranding the footer against the page edge with a stray line
      // between it and the content above. Correct strip, bottom-up:
      // rule 36 → baseline 44 → 36pt clean page margin.
      p.drawText(line, {
        x: MARGIN,
        y: 44,
        size: 7.5,
        font: helv,
        color: PINE,
        opacity: 0.75,
      });
      p.drawRectangle({
        x: MARGIN,
        y: 36,
        width: CONTENT_W,
        height: 0.6,
        color: WHEAT_DARK,
        opacity: 0.55,
      });
    },

    contactBand(heading = "Talk to us") {
      // Anchored to the PHYSICAL bottom of the current page. The old
      // cursor-drawn band floated mid-page on short documents (rates.pdf,
      // profile.pdf): band ended where content ended, then dead white
      // space, then the footer's gold rule alone near the true bottom.
      // Bottom-anchoring made every document close the same way — but it
      // introduced a second, uglier failure the fix didn't cover: a
      // document whose content spills JUST past the previous section's
      // ensureSpace threshold rolls to a fresh page with almost nothing
      // on it (spec.pdf for any service with a full "Products in this
      // line" list — commodity-trading, pulses-processing, oil-extraction
      // all do this; cold-storage/logistics have no products section and
      // never spill, which is why only those three ever showed it). Force-
      // anchoring the band to the bottom of that near-empty page leaves
      // ~600+pt of blank space above a band stranded at the very bottom —
      // reads as broken, not as a closing CTA.
      //
      // Fix: only bottom-anchor when doing so leaves a reasonable gap
      // (a well-filled page — the case the original fix targeted). When
      // the gap would be excessive, it means we just rolled onto a
      // sparse continuation page — hug the actual content instead of the
      // page edge. Both paths guarantee band + footer fit without
      // collision (see the newPage() guard immediately below).
      const BAND_H = 86;
      // Footer baseline sits 44pt up (drawFooter) and its ascender reaches
      // ~49.6 — 62 leaves ~12pt of air between band and footer text.
      const FOOTER_ZONE = 62;
      const BOTTOM_ANCHOR = PAGE_H - FOOTER_ZONE - BAND_H;
      const MIN_GAP = 28; // content-to-band breathing room when hugging
      const MAX_ANCHOR_GAP = 160; // beyond this, anchoring wastes the page

      if (kit.y + BAND_H + FOOTER_ZONE > PAGE_H) {
        kit.newPage();
        // The band itself caused this page — there is no content above to
        // hug, so present it as a deliberate closing page (bottom-anchored,
        // like every well-filled document's last page) instead of hugging
        // the top edge of an otherwise empty sheet.
        kit.y = BOTTOM_ANCHOR;
      }

      const gapIfAnchored = BOTTOM_ANCHOR - kit.y;
      const bandTop =
        gapIfAnchored > MAX_ANCHOR_GAP ? kit.y + MIN_GAP : BOTTOM_ANCHOR; // from page top
      page.drawRectangle({
        x: 0,
        // pdf-lib rects extend UPWARD from y — pass the band's bottom
        // edge (bandTop + BAND_H from top), exactly like drawMasthead
        // passes Y(MAST_H). The old Y(bandTop) drew the pine box one
        // band-height ABOVE its own text: white heading/phone/email on
        // the white page (invisible), rect floating over real content.
        y: Y(bandTop + BAND_H),
        width: PAGE_W,
        height: BAND_H,
        color: PINE_DEEP,
      });
      const bx = MARGIN;
      page.drawText(heading, {
        x: bx,
        y: Y(bandTop + 26),
        size: 13,
        font: bold,
        color: WHEAT_BRIGHT,
      });
      page.drawText(company.phone, {
        x: bx,
        y: Y(bandTop + 42),
        size: 9.5,
        font: helv,
        color: WHITE,
      });
      // The phone number is the band's one big call-to-action — make the
      // drawn glyphs themselves the WhatsApp tap zone (see WHATSAPP_URL).
      const phoneW = kit.helv.widthOfTextAtSize(company.phone, 9.5);
      addLinkAnnotation(
        kit,
        {
          x: MARGIN - 2,
          y: Y(bandTop + 42) - 3.5,
          w: phoneW + 6,
          h: 13,
        },
        WHATSAPP_URL,
      );
      page.drawText(company.email, {
        x: bx,
        y: Y(bandTop + 57),
        size: 9.5,
        font: helv,
        color: WHITE,
      });
      page.drawText(`${siteUrl.replace("https://", "")}  ·  ${company.legalName}`, {
        x: bx,
        y: Y(bandTop + 72),
        size: 8,
        font: helv,
        color: WHITE,
        opacity: 0.75,
      });
      kit.y = bandTop;
    },

    async finish() {
      for (const p of pages) kit.drawFooter(p);
      return doc.save();
    },
  };

  return kit;
}

/** The shared pine-deep masthead: gold wordmark, optional subline +
 *  tagline, gold tick. All coordinates absolute — independent of y.
 *  Re-anchors the cursor below itself. */
export function drawMasthead(
  kit: PdfKit,
  opts: { tagline: string; subline?: string },
) {
  const { page } = kit;
  const MAST_H = 116;
  page.drawRectangle({
    x: 0,
    y: Y(MAST_H),
    width: PAGE_W,
    height: MAST_H,
    color: PINE_DEEP,
  });
  page.drawText("SACHIN GOLD", {
    x: MARGIN,
    y: Y(58),
    size: 25,
    font: kit.bold,
    color: WHEAT_BRIGHT,
  });
  if (opts.subline) {
    page.drawText(opts.subline, {
      x: MARGIN,
      y: Y(80),
      size: 8.5,
      font: kit.helv,
      color: WHITE,
      opacity: 0.72,
    });
  }
  page.drawText(opts.tagline, {
    x: MARGIN,
    y: Y(100),
    size: 10.5,
    font: kit.helv,
    color: WHITE,
    opacity: 0.9,
  });
  page.drawRectangle({
    x: MARGIN,
    y: Y(MAST_H - 8),
    width: 46,
    height: 2,
    color: WHEAT_BRIGHT,
  });
  kit.y = MAST_H + 26;
}

/** The multi-figure stats band; values/labels must trace to real data.
 *  Absolute placement directly under the masthead, then re-anchors the
 *  cursor below itself. */
export function drawStatsBand(kit: PdfKit, stats: [string, string][]) {
  const MAST_H = 116;
  const STATS_H = 52;
  kit.page.drawRectangle({
    x: 0,
    y: Y(MAST_H + STATS_H),
    width: PAGE_W,
    height: STATS_H,
    color: LINEN,
  });
  const colW = PAGE_W / stats.length;
  stats.forEach(([value, label], i) => {
    const cx = MARGIN / 2 + i * colW;
    kit.page.drawText(value, {
      x: cx,
      y: Y(MAST_H + 22),
      size: 15,
      font: kit.bold,
      color: PINE,
    });
    // Collect wrapped lines first, then stack them in reading order —
    // first line highest. (The original reversed the stack, which
    // printed a wrapping label's lines in the wrong order: "Karnataka"
    // above "Locations across Maharashtra &".)
    const lines: string[] = [];
    kit.wrapText(label, 7, kit.helv, colW - 24, (line) => lines.push(line));
    lines.forEach((line, li) => {
      kit.page.drawText(line, {
        x: cx,
        y: Y(MAST_H + 33 + li * 8.5),
        size: 7,
        font: kit.helv,
        color: INK,
        opacity: 0.7,
      });
    });
  });
  kit.y = MAST_H + STATS_H + 26;
}
