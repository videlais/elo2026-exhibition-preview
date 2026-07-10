/**
 * Re-encodes the largest traversal videos in public/videos/mp4 to slightly
 * smaller files with HandBrakeCLI, so the packaged release zip stays under
 * GitHub's 2 GiB per-asset limit.
 *
 * Strategy: quality-based (constant RF) x264 re-encode. Raising RF from the
 * originals' ~22 to 25 removes ~25-40% of the bytes on high-bitrate files with
 * little visible change. Resolution is capped (default 1080p) and can be lowered
 * to 720p for extra headroom on the biggest outliers.
 *
 * Only files at/above --min-mb are touched, each is encoded to a temp file, and
 * the original is replaced ONLY if the result is actually smaller.
 *
 * Usage:
 *   node scripts/shrink-videos.mjs [--dry-run] [--force]
 *                                  [--min-mb=60] [--rf=25]
 *                                  [--max-height=1080] [--max-width=1920]
 *
 * IMPORTANT: the release workflow pulls videos from the "media-v1" Release, not
 * from your working tree. After re-encoding, upload the smaller files back so CI
 * packages them:
 *   gh release upload media-v1 public/videos/mp4/*.mp4 --clobber
 *
 * Requires HandBrakeCLI (brew install handbrake) and ffprobe (brew install ffmpeg).
 */
import { readdirSync, statSync, existsSync, renameSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const videoDir = resolve(root, "public/videos/mp4");

const GIB = 1073741824;
const MB = (n) => n / 1048576;
const fmtMB = (n) => `${MB(n).toFixed(1)} MB`;

// ── args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, def) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=")[1] : def;
};

const dryRun = flag("dry-run");
const force = flag("force");
const minMB = Number(opt("min-mb", "60"));
const rf = Number(opt("rf", "25"));
const maxHeight = Number(opt("max-height", "1080"));
const maxWidth = Number(opt("max-width", "1920"));
const TARGET_ZIP = 2 * GIB; // GitHub release asset hard limit.

// ── helpers ───────────────────────────────────────────────────────────────
function have(cmd) {
  const r = spawnSync(cmd, ["--version"], { stdio: "ignore" });
  return !r.error;
}

function encode(src, dest) {
  const res = spawnSync(
    "HandBrakeCLI",
    [
      "-i", src,
      "-o", dest,
      "-e", "x264",
      "-q", String(rf),
      "--encoder-preset", "slow",
      "--maxWidth", String(maxWidth),
      "--maxHeight", String(maxHeight),
      "--loose-anamorphic",
      // Preserve exact framing (no auto-crop), matching the archive's other
      // transcode scripts. Pass --autocrop to let HandBrake remove black bars.
      ...(flag("autocrop") ? [] : ["--crop", "0:0:0:0"]),
      "-E", "ca_aac",
      "-B", "128",
      "--audio-fallback", "ca_aac",
      "--optimize",
    ],
    { stdio: "inherit" },
  );
  return res.status === 0;
}

// ── main ──────────────────────────────────────────────────────────────────
if (!have("HandBrakeCLI")) {
  console.error("HandBrakeCLI not found. Install with: brew install handbrake");
  process.exit(2);
}

const files = readdirSync(videoDir)
  .filter((f) => f.toLowerCase().endsWith(".mp4"))
  .map((f) => ({ name: f, path: resolve(videoDir, f), size: statSync(resolve(videoDir, f)).size }))
  .sort((a, b) => b.size - a.size);

const totalBefore = files.reduce((s, f) => s + f.size, 0);
const targets = files.filter((f) => MB(f.size) >= minMB);

console.log(`Video dir: ${videoDir}`);
console.log(`Files: ${files.length} | total ${fmtMB(totalBefore)} (${(totalBefore / GIB).toFixed(3)} GiB)`);
console.log(`2 GiB limit: ${fmtMB(TARGET_ZIP)} — currently ${totalBefore > TARGET_ZIP ? "OVER" : "under"} by ${fmtMB(Math.abs(totalBefore - TARGET_ZIP))} (videos only)\n`);
console.log(`Re-encoding ${targets.length} file(s) >= ${minMB} MB at RF ${rf}, max ${maxWidth}x${maxHeight}${dryRun ? " [DRY RUN]" : ""}:\n`);

let saved = 0;
for (const f of targets) {
  const tmp = f.path.replace(/\.mp4$/i, ".shrink.mp4");
  if (dryRun) {
    console.log(`  [plan] ${f.name.padEnd(9)} ${fmtMB(f.size)}`);
    continue;
  }
  if (existsSync(tmp) && !force) unlinkSync(tmp);
  process.stdout.write(`  ${f.name.padEnd(9)} ${fmtMB(f.size)} -> encoding…\n`);
  if (!encode(f.path, tmp)) {
    console.error(`    FAILED to encode ${f.name}; keeping original.`);
    if (existsSync(tmp)) unlinkSync(tmp);
    continue;
  }
  const newSize = statSync(tmp).size;
  if (newSize < f.size) {
    unlinkSync(f.path);
    renameSync(tmp, f.path);
    saved += f.size - newSize;
    console.log(`    -> ${fmtMB(newSize)} (saved ${fmtMB(f.size - newSize)})`);
  } else {
    unlinkSync(tmp);
    console.log(`    -> re-encode not smaller (${fmtMB(newSize)}); kept original.`);
  }
}

const totalAfter = totalBefore - saved;
console.log(`\nTotal saved: ${fmtMB(saved)}`);
console.log(`New videos total: ${fmtMB(totalAfter)} (${(totalAfter / GIB).toFixed(3)} GiB) — ${totalAfter < TARGET_ZIP ? "under" : "still OVER"} the 2 GiB limit`);
if (!dryRun && saved > 0) {
  console.log(`\nNext: push the smaller files to the release CI pulls from:\n  gh release upload media-v1 public/videos/mp4/*.mp4 --clobber`);
}
