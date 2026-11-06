import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const LOGO = path.join(ROOT, "public/brand/databasify-logo-dark.svg");
const SCREEN = path.join(ROOT, "assets/screens-src/dashboard-dark.png");
const TARGET = path.join(ROOT, "public/og.png");

const WIDTH = 1200;
const HEIGHT = 630;
const PAD = 72;
const FONT = "'Instrument Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";

const FRAME = { x: PAD, y: 318, width: WIDTH - PAD * 2, height: HEIGHT - 318 + 40, bar: 34 };
const SHOT_WIDTH = FRAME.width;

async function screenshotDataUri() {
  const png = await sharp(SCREEN).resize({ width: SHOT_WIDTH * 2 }).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

async function logoMarkup() {
  const svg = await readFile(LOGO, "utf8");
  return svg.replace(/<svg[^>]*>/, `<svg x="${PAD}" y="64" width="208" height="38" viewBox="0 0 229 42" fill="none">`);
}

function frameDots() {
  return ["#ff5f57", "#febc2e", "#28c840"]
    .map((color, index) => `<circle cx="${FRAME.x + 20 + index * 18}" cy="${FRAME.y + FRAME.bar / 2}" r="5" fill="${color}" opacity="0.85"/>`)
    .join("");
}

async function ogSvg() {
  const shotHeight = Math.round((SHOT_WIDTH * 1800) / 2880);
  const shotY = FRAME.y + FRAME.bar;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow-top" cx="0.82" cy="0" r="0.75">
      <stop offset="0" stop-color="#363FF9" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#363FF9" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#5c63ff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#8b90ff" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#5c63ff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="accent-text" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7c82ff"/>
      <stop offset="1" stop-color="#5c63ff"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.045"/>
    </pattern>
    <clipPath id="frame-clip">
      <rect x="${FRAME.x}" y="${FRAME.y}" width="${FRAME.width}" height="${FRAME.height}" rx="14"/>
    </clipPath>
    <mask id="frame-fade" maskUnits="userSpaceOnUse" x="0" y="${FRAME.y}" width="${WIDTH}" height="${HEIGHT - FRAME.y}">
      <rect x="0" y="${FRAME.y}" width="${WIDTH}" height="${HEIGHT - FRAME.y}" fill="url(#fade)"/>
    </mask>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#07080d"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow-top)"/>
  ${await logoMarkup()}
  <g font-family="${FONT}" font-weight="600" font-size="66" letter-spacing="-1.6">
    <text x="${PAD - 3}" y="196" fill="#ffffff">Deploy database clusters</text>
    <text x="${PAD - 3}" y="274" fill="url(#accent-text)">without the busywork</text>
  </g>
  <g mask="url(#frame-fade)">
    <g clip-path="url(#frame-clip)">
      <rect x="${FRAME.x}" y="${FRAME.y}" width="${FRAME.width}" height="${FRAME.height}" fill="#0c0d12"/>
      ${frameDots()}
      <image href="${await screenshotDataUri()}" x="${FRAME.x}" y="${shotY}" width="${SHOT_WIDTH}" height="${shotHeight}" preserveAspectRatio="xMidYMin slice"/>
      <line x1="${FRAME.x}" y1="${shotY}" x2="${FRAME.x + FRAME.width}" y2="${shotY}" stroke="#ffffff" stroke-opacity="0.08"/>
    </g>
    <rect x="${FRAME.x + 0.5}" y="${FRAME.y + 0.5}" width="${FRAME.width - 1}" height="${FRAME.height - 1}" rx="14" fill="none" stroke="#5c63ff" stroke-opacity="0.45"/>
    <rect x="${FRAME.x + 120}" y="${FRAME.y}" width="${FRAME.width - 240}" height="1" fill="url(#edge)"/>
  </g>
</svg>`;
}

await sharp(Buffer.from(await ogSvg()))
  .png({ compressionLevel: 9 })
  .toFile(TARGET);
console.log(`wrote ${path.relative(process.cwd(), TARGET)}`);
