// Builds the splash's brand layers from the client's gold-foil badge JPG.
//
//   node scripts/prepare-brand-mark.mjs "<path to sachin_gold_logo2.jpg>"
//
// The source is a scalloped near-black seal on white, with the wordmark in
// white and the frame in gold foil. Two things make it unusable as-is on a
// dark panel: the seal is a black box, and the four white corners are opaque.
//
// So: flood-fill from the image border over every low-saturation pixel
// (black, white, and the gray JPEG ringing between them) and knock it out.
// Flood fill rather than a colour key because the "SACHIN" lettering is the
// same white as the corners — only the pixels *reachable* from outside go.
// What survives is the artwork: gold laurel, gold shield frame, white
// lettering, gold stars, floating on whatever is behind it.
//
// Then it splits: the laurel and the shield are emitted as separate layers so
// the splash can bring them in from opposite directions and have them meet.
// The cut is found automatically as the widest empty row band in the top half
// of the trimmed artwork — no hand-picked pixel offsets to go stale.

import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = process.argv[2];
if (!SRC) {
  console.error('usage: node scripts/prepare-brand-mark.mjs "<logo.jpg>"');
  process.exit(1);
}

const OUT = "public/images/brand";
const EXPORT_WIDTH = 900;
// max(ch)-min(ch) below this reads as neutral: the seal is (26,26,24), the
// corners (255,255,255), gold foil is ~150 apart.
const SATURATION_CUT = 30;

const { data: rgb, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: W, height: H } = info;
const pixels = W * H;

// 0 = keep, 1 = knocked out by the flood fill.
const removed = new Uint8Array(pixels);
// Plain index queue: a 4.3M-pixel fill with an array of objects would crawl.
const queue = new Uint32Array(pixels);
let head = 0;
let tail = 0;

const isNeutral = (i) => {
  const r = rgb[i * 4];
  const g = rgb[i * 4 + 1];
  const b = rgb[i * 4 + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max - min <= SATURATION_CUT;
};

const push = (p) => {
  if (removed[p]) return;
  if (!isNeutral(p)) return;
  removed[p] = 1;
  queue[tail++] = p;
};

// Seed from the whole border.
for (let x = 0; x < W; x++) {
  push(x);
  push((H - 1) * W + x);
}
for (let y = 0; y < H; y++) {
  push(y * W);
  push(y * W + W - 1);
}

while (head < tail) {
  const p = queue[head++];
  const x = p % W;
  const y = (p / W) | 0;
  if (x > 0) push(p - 1);
  if (x < W - 1) push(p + 1);
  if (y > 0) push(p - W);
  if (y < H - 1) push(p + W);
}

// Alpha: 255 where the artwork lives, 0 where the seal and corners were.
const alpha = new Uint8ClampedArray(pixels);
for (let p = 0; p < pixels; p++) alpha[p] = removed[p] ? 0 : 255;

// One box blur each way on the alpha channel only. JPEG ringing leaves a
// ragged 1-2px boundary between the knocked-out black and the gold; a hard
// edge there shows up as jaggies on a dark panel, and this is the cheap way
// to soften it without touching colour.
const blurPass = (src) => {
  const out = new Uint8ClampedArray(pixels);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      let sum = src[p] * 2;
      let n = 2;
      for (const q of [p - 1, p + 1, p - W, p + W]) {
        if (q >= 0 && q < pixels) {
          sum += src[q];
          n++;
        }
      }
      out[p] = sum / n;
    }
  }
  return out;
};
let a = blurPass(alpha);
a = blurPass(a);

// Bounding box of what survived, so the export isn't mostly empty canvas.
let minX = W;
let maxX = 0;
let minY = H;
let maxY = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (a[y * W + x] > 12) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;

// Re-pack RGBA for the surviving rectangle.
const rgba = Buffer.alloc(cropW * cropH * 4);
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const s = (minY + y) * W + (minX + x);
    const d = (y * cropW + x) * 4;
    rgba[d] = rgb[s * 4];
    rgba[d + 1] = rgb[s * 4 + 1];
    rgba[d + 2] = rgb[s * 4 + 2];
    rgba[d + 3] = a[s];
  }
}

const fromRgba = () =>
  sharp(rgba, { raw: { width: cropW, height: cropH, channels: 4 } });

await mkdir(OUT, { recursive: true });

// Row occupancy across the trimmed artwork, to find the laurel/shield gap.
const rowFilled = new Uint32Array(cropH);
for (let y = 0; y < cropH; y++) {
  let count = 0;
  for (let x = 0; x < cropW; x++) if (rgba[(y * cropW + x) * 4 + 3] > 12) count++;
  rowFilled[y] = count;
}

let best = { start: 0, end: 0, len: 0 };
let runStart = -1;
const limit = Math.floor(cropH * 0.55);
for (let y = 0; y < limit; y++) {
  const empty = rowFilled[y] === 0;
  if (empty && runStart < 0) runStart = y;
  if ((!empty || y === limit - 1) && runStart >= 0) {
    const len = y - runStart;
    if (len > best.len) best = { start: runStart, end: y, len };
    runStart = -1;
  }
}

const split = best.len > 4 ? Math.round((best.start + best.end) / 2) : -1;

const scale = EXPORT_WIDTH / cropW;
const exportWidth = Math.round(EXPORT_WIDTH);

const write = async (region, file) => {
  const buf = await fromRgba()
    .extract(region)
    .resize({ width: exportWidth })
    .webp({ quality: 92, alphaQuality: 92 })
    .toBuffer();
  await writeFile(`${OUT}/${file}`, buf);
  const height = Math.round(region.height * scale);
  console.log(
    `${file}: ${exportWidth}x${height}  y=${region.top}..${region.top + region.height} of ${cropH}`,
  );
  return { width: exportWidth, height, top: region.top };
};

const full = await write({ left: 0, top: 0, width: cropW, height: cropH }, "sachin-badge.webp");

// The cut the footer loads. Down-sampled from the master with a light unsharp
// mask: shown at 104px CSS (208px at 2x), a straight resize of the 900px seal
// goes soft in the shield's lettering.
const footerBadge = await fromRgba()
  .extract({ left: 0, top: 0, width: cropW, height: cropH })
  .resize({ width: 400 })
  .sharpen({ sigma: 0.4 })
  .webp({ quality: 92, alphaQuality: 92 })
  .toBuffer();
await writeFile(`${OUT}/sachin-badge-lg.webp`, footerBadge);
console.log(
  `sachin-badge-lg.webp: 400x${Math.round(400 * (cropH / cropW))} (sharpened footer cut)`,
);

let layers = null;
if (split > 0) {
  const laurel = await write(
    { left: 0, top: 0, width: cropW, height: split },
    "sachin-laurel.webp",
  );
  const shield = await write(
    { left: 0, top: split, width: cropW, height: cropH - split },
    "sachin-shield.webp",
  );
  layers = {
    splitAt: split,
    laurelPct: ((split / cropH) * 100).toFixed(2),
    shieldTopPct: ((split / cropH) * 100).toFixed(2),
    aspect: (cropW / cropH).toFixed(4),
    laurel,
    shield,
  };
}

console.log(
  JSON.stringify(
    { trimmed: { width: cropW, height: cropH }, full, layers },
    null,
    2,
  ),
);
