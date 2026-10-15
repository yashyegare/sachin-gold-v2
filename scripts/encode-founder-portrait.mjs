// Encodes the founder's About-page portrait from the owner's studio JPEG.
//
// The card is a fixed 16:10 box with object-cover, and object-cover on a
// wider-than-tall box always crops vertically — so at the source's full 717px
// width the tallest window that survives is 448px, which ends at the
// shoulders. Showing the chest therefore cannot come from cropping; the
// subject has to shrink and the sides be filled from the same frame.
//
// Foreground: source y=150..750 (head through upper chest), scaled to the
// card height and centred. Background: the same region cover-filled to the
// card and blurred, so the pale studio wall continues behind him instead of
// ending in a hard edge.
//
// Usage: node scripts/encode-founder-portrait.mjs
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC = process.env.FOUNDER_SRC || "C:/Users/Yash Y/Downloads/Shri SH hude.jpeg";
const OUT_DIR = path.join(SCRIPT_DIR, "..", "public", "images", "team");
const CARD_W = 1024;
const CARD_H = 640;
const REGION = { left: 0, top: 150, width: 717, height: 600 };

(async () => {
  const subject = await sharp(SRC)
    .extract(REGION)
    .resize({ height: CARD_H, width: CARD_W, fit: "inside" })
    .toBuffer();
  const subjectMeta = await sharp(subject).metadata();
  const backdrop = await sharp(SRC)
    .extract(REGION)
    .resize({ width: CARD_W, height: CARD_H, fit: "cover" })
    .blur(28)
    .toBuffer();

  const composed = await sharp({
    create: { width: CARD_W, height: CARD_H, channels: 3, background: "#e9ebf5" },
  })
    .composite([
      { input: backdrop, top: 0, left: 0 },
      {
        input: subject,
        top: 0,
        left: Math.round((CARD_W - subjectMeta.width) / 2),
      },
    ])
    .png()
    .toBuffer();

  for (const [name, codec] of [
    ["shri-sh-hude.webp", sharp(composed).webp({ quality: 82 })],
    ["shri-sh-hude.avif", sharp(composed).avif({ quality: 45 })],
  ]) {
    const buf = await codec.toBuffer();
    fs.writeFileSync(path.join(OUT_DIR, name), buf);
    console.log(`${name}  ${buf.length} bytes`);
  }
})();
