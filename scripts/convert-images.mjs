import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SCREENS_DIR = path.resolve(import.meta.dirname, "../public/screens");
const SOURCE_DIR = path.resolve(import.meta.dirname, "../assets/screens-src");
const WIDTHS = [960, 1440, 2880];
const ENCODERS = {
  avif: (image) => image.avif({ quality: 60, effort: 6 }),
  webp: (image) => image.webp({ quality: 82 }),
};

async function writeVariant(source, target, width, format) {
  const resized = sharp(source).resize({ width, withoutEnlargement: true });
  await ENCODERS[format](resized).toFile(target);
  console.log(`wrote ${path.relative(process.cwd(), target)}`);
}

async function convert(file) {
  const source = path.join(SOURCE_DIR, file);
  const name = path.parse(file).name;
  for (const format of Object.keys(ENCODERS)) {
    for (const width of WIDTHS) {
      await writeVariant(source, path.join(SCREENS_DIR, `${name}-${width}.${format}`), width, format);
    }
  }
}

const files = (await readdir(SOURCE_DIR)).filter((file) => file.endsWith(".png"));
for (const file of files) {
  await convert(file);
}
