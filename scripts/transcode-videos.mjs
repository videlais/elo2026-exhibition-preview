/**
 * One-time: download external traversal videos, transcode to standardized
 * 1080p H.264 MP4 via HandBrakeCLI, into ./video-dist/<NN>.mp4 (gitignored).
 * Resumable: skips works whose final .mp4 already exists.
 *
 * Usage: node scripts/transcode-videos.mjs
 */
import { createWriteStream, existsSync, mkdirSync, statSync, unlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const works = require(resolve(root, 'src/json/works.json'));
const outDir = resolve(root, 'video-dist');
mkdirSync(outDir, { recursive: true });

const HB = 'HandBrakeCLI';
const MB = (n) => (n / 1048576).toFixed(1);

const run = (cmd, args) =>
  new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('error', rej);
    p.on('close', (code) => (code === 0 ? res() : rej(new Error(`${cmd} exited ${code}`))));
  });

async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  await pipeline(Readable.fromWeb(r.body), createWriteStream(dest));
}

const targets = works
  .map((w) => ({ id: String(w.workInformation.workId).padStart(2, '0'), url: w.mediaFilesInformation.traversalVideo }))
  .filter((t) => t.url && /^https?:\/\//.test(t.url));

console.log(`${targets.length} external traversal videos to process.\n`);

for (const { id, url } of targets) {
  const out = resolve(outDir, `${id}.mp4`);
  if (existsSync(out)) {
    console.log(`[${id}] already done (${MB(statSync(out).size)} MB) — skip`);
    continue;
  }
  const srcExt = (url.split('.').pop() || 'src').toLowerCase().slice(0, 4);
  const src = resolve(outDir, `${id}.src.${srcExt}`);
  try {
    console.log(`[${id}] downloading…`);
    if (!existsSync(src)) await download(url, src);
    console.log(`[${id}] downloaded ${MB(statSync(src).size)} MB — transcoding…`);
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
    unlinkSync(src);
    console.log(`[${id}] done → ${MB(statSync(out).size)} MB\n`);
  } catch (err) {
    console.error(`[${id}] FAILED: ${err.message}\n`);
  }
}

console.log('All transcoding complete. Output in ./video-dist/');
