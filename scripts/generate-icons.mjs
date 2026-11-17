// Regenerates app icons from src/app/icon.svg.
// Usage: npm run icons
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const svg = await fs.readFile(path.join(root, "src/app/icon.svg"));

// --- favicon.ico : PNG-compressed 16 / 32 / 48 entries -----------------------
const sizes = [16, 32, 48];
const pngs = [];

for (const size of sizes) {
  pngs.push(
    await sharp(svg, { density: 1200 })
      .resize(size, size, { kernel: "lanczos3" })
      .png()
      .toBuffer(),
  );
}

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type = icon
header.writeUInt16LE(sizes.length, 4);

const entries = [];
let offset = 6 + 16 * sizes.length;

for (let i = 0; i < sizes.length; i++) {
  const size = sizes[i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette count
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngs[i].length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  entries.push(entry);
}

await fs.writeFile(
  path.join(root, "src/app/favicon.ico"),
  Buffer.concat([header, ...entries, ...pngs]),
);

// --- apple-icon.png : 180x180, opaque cream background ----------------------
const appleSize = 180;
const markSize = 122;

const mark = await sharp(svg, { density: 1200 })
  .resize(markSize, markSize, { kernel: "lanczos3" })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: appleSize,
    height: appleSize,
    channels: 4,
    background: { r: 0xf5, g: 0xed, b: 0xe3, alpha: 1 },
  },
})
  .composite([
    {
      input: mark,
      top: Math.round((appleSize - markSize) / 2),
      left: Math.round((appleSize - markSize) / 2),
    },
  ])
  .png()
  .toFile(path.join(root, "src/app/apple-icon.png"));

console.log("✓ regenerated src/app/favicon.ico and src/app/apple-icon.png");
