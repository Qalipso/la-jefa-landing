/**
 * One-off: convert source PNG frames to web-optimized WebP.
 * Originals are never modified. Output goes to public/frames/.
 * Usage: node scripts/convert-frames.mjs
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = '/Users/eduardshatalov/Downloads/hf_20260722_054539_1c8106e4-91be-4770-b4f1-83873be1fb15_frames';
const OUT = path.resolve(import.meta.dirname, '../public/frames');
const QUALITY = 75;
const CONCURRENCY = 8;

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /^frame_\d{3}\.png$/.test(f)).sort();
console.log(`Converting ${files.length} frames at q${QUALITY}...`);

let done = 0, bytes = 0;
const queue = [...files];
async function worker() {
  for (;;) {
    const f = queue.shift();
    if (!f) return;
    const out = path.join(OUT, f.replace('.png', '.webp'));
    const info = await sharp(path.join(SRC, f)).webp({ quality: QUALITY, effort: 4 }).toFile(out);
    bytes += info.size;
    if (++done % 20 === 0) console.log(`  ${done}/${files.length}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`Done: ${done} frames, total ${(bytes / 1024 / 1024).toFixed(1)} MB`);
