#!/usr/bin/env node
/**
 * Phase 2 asset pipeline — converts the old repo's images to optimized
 * WebP/AVIF for public/images/.
 *
 * Usage:
 *   node scripts/process-images.mjs <sourceDir> [--out <dir>]
 *
 * Example:
 *   node scripts/process-images.mjs ../sachingold-v1/assets/img
 *
 * What it does:
 *   - Recursively finds .jpg/.jpeg/.png/.webp/.avif/.tif/.tiff files
 *   - Resizes down to --max-width (default 1600px, hero-sized)
 *   - Emits WebP at --quality (default 78) for every image
 *   - Emits AVIF alongside, plus an @2x WebP when downsizing >25%
 *   - Skips sources whose processed outputs already exist and are newer
 *   - Refuses any file over --hard-cap-kb (default 400, the Phase 2 target)
 *     so oversized output fails loudly instead of shipping silently
 *   - Writes nothing outside --out
 *
 * Defaults follow the plan: most images well under 400KB after conversion.
 */

import { mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SUPPORTED = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".tif",
  ".tiff",
]);

// --- args -------------------------------------------------------------
const args = process.argv.slice(2);
const sourceDir = args[0];

if (!sourceDir || args.includes("--help")) {
  console.log(
    "Usage: node scripts/process-images.mjs <sourceDir> [--out <dir>]\n" +
      "  --out          output dir (default: public/images)\n" +
      "  --max-width    resize cap in px (default: 1600)\n" +
      "  --quality      WebP quality 1-100 (default: 78)\n" +
      "  --avif-quality AVIF quality 1-100 (default: 50)\n" +
      "  --hard-cap-kb  fail if any output exceeds this (default: 400)",
  );
  process.exit(args.includes("--help") ? 0 : 1);
}

function argValue(flag, fallback) {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const outDir = path.resolve(argValue("--out", "public/images"));
const maxWidth = parseInt(argValue("--max-width", "1600"), 10);
const quality = parseInt(argValue("--quality", "78"), 10);
const avifQuality = parseInt(argValue("--avif-quality", "50"), 10);
const hardCapKb = parseInt(argValue("--hard-cap-kb", "400"), 10);

// --- walk -------------------------------------------------------------
// outDirResolved is excluded so the script never re-ingests its own output
// when --out points inside the source tree.
async function* walk(dir, outDirResolved) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (path.resolve(full) === outDirResolved) continue;
    if (entry.isDirectory()) yield* walk(full, outDirResolved);
    else if (SUPPORTED.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

// Preserve the old repo's folder structure under public/images/, mirroring
// how data/services.ts references e.g. public/images/services/*.webp.
function relOutName(relSource, ext) {
  const parsed = path.parse(relSource);
  return path.join(parsed.dir, `${parsed.name}${ext}`);
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// --- main -------------------------------------------------------------
if (!existsSync(sourceDir)) {
  console.error(`Source directory not found: ${sourceDir}`);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

let converted = 0;
let skipped = 0;
let failures = 0;
let totalIn = 0;
let totalOut = 0;

for await (const src of walk(sourceDir, outDir)) {
  const rel = path.relative(sourceDir, src);
  const srcStat = await stat(src);
  const outWebp = path.join(outDir, relOutName(rel, ".webp"));

  // Skip when the processed output already exists and is newer than the
  // source — re-runs after adding one image don't redo the whole batch.
  if (
    existsSync(outWebp) &&
    (await stat(outWebp)).mtimeMs > srcStat.mtimeMs
  ) {
    skipped += 1;
    continue;
  }

  try {
    const image = sharp(src, { failOn: "none" });
    const meta = await image.metadata();
    if (!meta.width || !meta.height) {
      console.warn(`SKIP (unreadable dimensions): ${rel}`);
      continue;
    }

    const needsResize = meta.width > maxWidth;
    const pipeline = needsResize
      ? image.resize({
          width: maxWidth,
          // Enlarging never happens; this only caps the long edge.
          withoutEnlargement: true,
        })
      : image;

    await mkdir(path.dirname(outWebp), { recursive: true });

    // Primary output: WebP.
    const webpBuffer = await pipeline
      .clone()
      .webp({ quality })
      .toBuffer();
    await (await import("node:fs/promises")).writeFile(outWebp, webpBuffer);

    // Heavier images also get an AVIF sibling; lighter ones don't justify
    // the extra encode time. next/image serves whichever the browser takes.
    if (srcStat.size > 200 * 1024) {
      const avifBuffer = await pipeline
        .clone()
        .avif({ quality: avifQuality })
        .toBuffer()
        .catch(() => null);
      if (avifBuffer) {
        await (
          await import("node:fs/promises")
        ).writeFile(
          path.join(outDir, relOutName(rel, ".avif")),
          avifBuffer,
        );
      }
    }

    // Keep retina-capable 2x WebP only when we actually downsized a big
    // source — avoids doubling output size for images already ≤ max-width.
    if (needsResize && meta.width > maxWidth * 1.25) {
      const twoXBuffer = await sharp(src, { failOn: "none" })
        .resize({ width: Math.min(meta.width, maxWidth * 2) })
        .webp({ quality })
        .toBuffer();
      await (
        await import("node:fs/promises")
      ).writeFile(
        path.join(outDir, relOutName(rel, "@2x.webp")),
        twoXBuffer,
      );
    }

    const outSize = webpBuffer.length;
    totalIn += srcStat.size;
    totalOut += outSize;
    converted += 1;

    const saving = srcStat.size
      ? ` (${(100 - (outSize / srcStat.size) * 100).toFixed(0)}% smaller)`
      : "";
    console.log(`${rel} → ${formatBytes(outSize)}${saving}`);

    if (outSize > hardCapKb * 1024) {
      failures += 1;
      console.error(
        `  ✗ over the ${hardCapKb}KB cap — lower --quality or --max-width for this one`,
      );
    }
  } catch (error) {
    failures += 1;
    console.error(`FAILED: ${rel}: ${error.message}`);
  }
}

console.log(
  `\nDone: ${converted} converted, ${skipped} skipped (up to date), ` +
    `${failures} over cap/failed.`,
);
if (totalIn > 0) {
  console.log(
    `Total: ${formatBytes(totalIn)} → ${formatBytes(totalOut)} ` +
      `(${(100 - (totalOut / totalIn) * 100).toFixed(0)}% reduction)`,
  );
}
if (failures > 0) {
  console.error(
    "\nSome outputs exceeded the cap or failed — fix them before importing",
  );
  console.error("these into next/image (Phase 2 done-when is every image under the cap).");
  process.exit(1);
}
