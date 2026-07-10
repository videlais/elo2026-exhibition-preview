/**
 * Audits the videos actually served by a deployed site against the local
 * source files in public/videos/mp4/.
 *
 * For each local MP4 it sends a HEAD request to the deployed URL and classifies
 * the result:
 *   OK        - server returns video/mp4 with a byte length matching the local file
 *   TRUNCATED - server returns video/mp4 but a smaller byte length (partial upload)
 *   MISSING   - server returns something else (e.g. the SPA index.html fallback),
 *               meaning the file was never uploaded
 *   ERROR     - the request failed (network/HTTP error)
 *
 * Usage:
 *   node scripts/verify-deployed-videos.mjs [baseUrl]
 *
 *   baseUrl defaults to the production host. Override for other deployments:
 *   node scripts/verify-deployed-videos.mjs https://example.org/elo2026/
 *
 * Exit code is non-zero if any file is not OK, so it can gate a deploy check.
 */

import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const localDir = path.join(projectRoot, 'public', 'videos', 'mp4');

const DEFAULT_BASE = 'https://projects.cah.ucf.edu/mediaartsexhibits/elo2026/';
const VIDEO_PATH = 'videos/mp4';

/** Build the absolute URL for a given video filename under the base URL. */
function videoUrl(base, name) {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return new URL(`${VIDEO_PATH}/${name}`, normalizedBase).toString();
}

const MB = (n) => (n / 1048576).toFixed(1);

async function head(url) {
  const res = await fetch(url, {
    method: 'HEAD',
    headers: { 'User-Agent': 'verify-deployed-videos/1.0' },
    redirect: 'follow',
  });
  return {
    status: res.status,
    contentType: (res.headers.get('content-type') || '').split(';')[0].trim(),
    contentLength: Number(res.headers.get('content-length')),
  };
}

async function main() {
  const base = process.argv[2] || DEFAULT_BASE;

  let names;
  try {
    names = (await readdir(localDir)).filter((f) => f.toLowerCase().endsWith('.mp4')).sort();
  } catch {
    console.error(`Could not read local video directory: ${localDir}`);
    process.exit(2);
  }

  if (names.length === 0) {
    console.error(`No .mp4 files found in ${localDir}`);
    process.exit(2);
  }

  console.log(`Auditing ${names.length} videos against ${base}\n`);
  console.log(
    `${'FILE'.padEnd(10)}${'LOCAL'.padStart(11)}${'SERVER'.padStart(11)}  ${'MIME'.padEnd(11)}STATUS`,
  );

  const results = { OK: [], TRUNCATED: [], MISSING: [], ERROR: [] };

  for (const name of names) {
    const localBytes = (await stat(path.join(localDir, name))).size;
    let status;
    let serverBytes = NaN;
    let mime = '-';

    try {
      const { contentType, contentLength } = await head(videoUrl(base, name));
      mime = contentType || '-';
      serverBytes = contentLength;
      if (contentType.startsWith('video/')) {
        status = contentLength === localBytes ? 'OK' : 'TRUNCATED';
      } else {
        status = 'MISSING';
      }
    } catch (err) {
      status = 'ERROR';
      mime = String(err?.message || err).slice(0, 40);
    }

    results[status].push(name);

    const local = `${MB(localBytes)}MB`;
    const server = Number.isFinite(serverBytes) ? `${MB(serverBytes)}MB` : '-';
    console.log(
      `${name.padEnd(10)}${local.padStart(11)}${server.padStart(11)}  ${mime.padEnd(11)}${status}`,
    );
  }

  const bad = results.TRUNCATED.length + results.MISSING.length + results.ERROR.length;
  console.log(
    `\nOK: ${results.OK.length}  ` +
      `TRUNCATED: ${results.TRUNCATED.length}  ` +
      `MISSING: ${results.MISSING.length}  ` +
      `ERROR: ${results.ERROR.length}`,
  );

  for (const key of ['MISSING', 'TRUNCATED', 'ERROR']) {
    if (results[key].length) {
      console.log(`\n${key}:\n  ${results[key].join(', ')}`);
    }
  }

  process.exit(bad > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
