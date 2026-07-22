import sharp from 'sharp';
const src = '/Users/eduardshatalov/Downloads/hf_20260722_054539_1c8106e4-91be-4770-b4f1-83873be1fb15_frames/frame_061.png';
const out = '/private/tmp/claude-501/-Users-eduardshatalov-Documents-WashingMachine/1732395d-d0d7-4a5e-b850-d8424a627cbc/scratchpad/webptest';
for (const q of [65, 75, 82]) {
  const a = await sharp(src).webp({ quality: q, effort: 4 }).toFile(`${out}/full_q${q}.webp`);
  const b = await sharp(src).resize({ height: 1440 }).webp({ quality: q, effort: 4 }).toFile(`${out}/h1440_q${q}.webp`);
  console.log(`q${q}: full 1080x1920 = ${(a.size/1024).toFixed(0)}KB | h1440 810x1440 = ${(b.size/1024).toFixed(0)}KB`);
}
