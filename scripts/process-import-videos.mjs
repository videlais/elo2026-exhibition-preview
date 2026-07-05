/**
 * One-off: transcode locally-provided submission videos in ./import-video/<id>.mp4
 * to standardized 1080p H.264 MP4 via HandBrakeCLI, into ./video-dist/<NN>.mp4.
 *
 * IDs are normalized to two-digit, zero-padded work IDs. Files listed in SKIP
 * are ignored. Resumable: skips outputs that already exist unless --force.
 *
 * Usage: node scripts/process-import-videos.mjs [--force]
 */
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const inDir = resolve(root, 'import-video');
const outDir = resolve(root, 'video-dist');
mkdirSync(outDir, { recursive: true });

const force = process.argv.includes('--force');

// Exact source filenames to ignore (e.g. superseded duplicates).
const SKIP = new Set(['3.mp4']);

const HB = 'HandBrakeCLI';
const MB = (n) => (n / 1048576).toFixed(1);

const run = (cmd, args) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('error', rej);
    p.on('close', (code) => (code === 0 ? res() : rej(new Error(`${cmd} exited ${code}`))));
  });

const sources = readdirSync(inDir)
  .filter((f) => f.toLowerCase().endsWith('.mp4') && !SKIP.has(f))
  .map((f) => ({ file: f, id: String(parseInt(f, 10)).padStart(2, '0') }))
  .filter((s) => /^\d{2}$/.test(s.id))
  .sort((a, b) => Number(a.id) - Number(b.id));

console.log(`${sources.length} source videos to process.\n`);

const done = [];
for (const { file, id } of sources) {
  const src = resolve(inDir, file);
  const out = resolve(outDir, `${id}.mp4`);
  if (!force && existsSync(out)) {
    console.log(`[${id}] already done (${MB(statSync(out).size)} MB) — skip`);
    done.push(id);
    continue;
  }
  try {
    console.log(`[${id}] transcoding from ${file} (${MB(statSync(src).size)} MB)…`);
    await run(HB, [
      '-i', src,
      '-o', out,
      '-e', 'x264',
      '-q', '22',
      '--encoder-preset', 'medium',
      '--maxWidth', '1920',
      '--maxHeight', '1080',
      '--loose-anamorphic',
      '--crop', '0:0:0:0',
      '-E', 'ca_aac',
      '-B', '160',
      '--audio-fallback', 'ca_aac',
      '--optimize',
    ]);
    console.log(`[${id}] done → ${MB(statSync(out).size)} MB\n`);
    done.push(id);
  } catch (err) {
    console.error(`[${id}] FAILED: ${err.message}\n`);
  }
}

console.log(`\nTranscoded ${done.length}/${sources.length}: ${done.join(', ')}`);
