/**
 * Fetches the Noto Sans fonts used by the generated PDFs into
 * public/fonts/ (gitignored-size budget: ~1.5MB total, acceptable for
 * server-side-only assets). Run: node scripts/fetch-pdf-fonts.mjs
 *
 * The site's UI fonts load via next/font (self-hosted by the framework);
 * pdf-lib can't consume those woff2 subsets, so the PDF kit embeds full
 * TTFs from the same Noto families instead.
 */
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// css2 API: request ttf by using a deliberately ancient UA (no woff2
// support) — Google then serves format('truetype') full fonts.
const OUT_DIR = "public/fonts";
mkdirSync(OUT_DIR, { recursive: true });

const OUT = "public/fonts";
mkdirSync(OUT, { recursive: true });

// Google Fonts static TTF endpoints for the regular weights the PDFs
// use. These URLs are version-pinned by Google; if a fetch 404s, re-run
// `curl -I` against fonts.googleapis.com/css2 to discover the current
// URL (the css2 API returns the ttf link when requested with a plain
// UA that doesn't support woff2).
const FONTS = [
  {
    file: "NotoSans-Regular.ttf",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400",
  },
  {
    file: "NotoSans-Bold.ttf",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@700",
  },
  {
    file: "NotoSansDevanagari-Regular.ttf",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400",
  },
  {
    file: "NotoSansDevanagari-Bold.ttf",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@700",
  },
  {
    file: "NotoSansKannada-Regular.ttf",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400",
  },
  {
    file: "NotoSansKannada-Bold.ttf",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@700",
  },
  {
    file: "NotoSansTelugu-Regular.ttf",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400",
  },
  {
    file: "NotoSansTelugu-Bold.ttf",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@700",
  },
  {
    file: "NotoSansTamil-Regular.ttf",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400",
  },
  {
    file: "NotoSansTamil-Bold.ttf",
    css: "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@700",
  },
];

// Verified: css2 requested WITHOUT a browser UA serves
// format('truetype') FULL TTF urls (a browser UA gets woff2 subsets,
// which pdf-lib rejects). No UA header at all is the reliable path.

for (const font of FONTS) {
  const dest = join(OUT_DIR, font.file);
  if (existsSync(dest)) {
    console.log(`skip (exists): ${font.file}`);
    continue;
  }
  const cssRes = await fetch(font.css);
  const css = await cssRes.text();
  // Old-UA css2 responses use `url(https://fonts.gstatic.com/l/font?kit=…)`
  // format('truetype') full fonts (no .ttf extension, no unicode-range).
  const urls = [
    ...css.matchAll(/url\((https:\/\/[^)]+)\)/g),
  ].map((m) => m[1]);
  if (!urls.length) {
    console.error(`NO TTF FOUND for ${font.css}`);
    continue;
  }
  let best = null;
  for (const url of urls) {
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    // Only accept real TrueType files (magic 00 01 00 00) — the css2
    // kit endpoint sometimes serves woff2 anyway, which pdf-lib
    // rejects with "Unknown font format" at build time.
    if (buf.subarray(0, 4).toString("hex") !== "00010000") continue;
    if (!best || buf.length > best.buf.length) best = { url, buf };
  }
  if (!best) {
    console.error(`NO REAL TTF for ${font.file} — keeping none`);
    continue;
  }
  writeFileSync(dest, best.buf);
  console.log(`saved ${font.file}: ${(best.buf.length / 1024).toFixed(0)}KB`);
}
console.log("done");
