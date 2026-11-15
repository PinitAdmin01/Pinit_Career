/**
 * Prebuild compiler for the 131 MB LongLesson TypeScript corpus.
 *
 * Bundles src/lib/data/longLessons.ts in-memory with esbuild (~1.2s) and emits
 * deduplicated, gzip-compressed per-course archives into src/generated/longLessons/.
 *
 * Why: Compiling 53 multi-megabyte TypeScript curriculum files inside Next.js
 * Webpack/SWC consumes 6-8 GB of AST heap and times out/SIGKILLs Vercel builds.
 * Emitting compact .json.gz (~18 MB total) lets API routes load any requested
 * course in ~3ms with zero Webpack AST compilation.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const Module = require('module');
const esbuild = require('esbuild');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'src', 'lib', 'data');
const OUT_DIR = path.join(ROOT, 'src', 'generated', 'longLessons');
const MANIFEST_PATH = path.join(OUT_DIR, '_manifest.json');

function getLatestSourceMtimeMs() {
  let latest = 0;
  const selfStat = fs.statSync(__filename);
  if (selfStat.mtimeMs > latest) latest = selfStat.mtimeMs;

  const entries = fs.readdirSync(DATA_DIR);
  for (const name of entries) {
    if (name === 'longLessons.ts' || name === 'longLessonTypes.ts' || name.endsWith('LongLessons.ts')) {
      const st = fs.statSync(path.join(DATA_DIR, name));
      if (st.mtimeMs > latest) latest = st.mtimeMs;
    }
  }
  return latest;
}

function isUpToDate() {
  if (process.argv.includes('--force')) return false;
  if (!fs.existsSync(MANIFEST_PATH)) return false;
  try {
    const manifestStat = fs.statSync(MANIFEST_PATH);
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    if (!manifest || !manifest.prefixes || typeof manifest.prefixes !== 'object') return false;
    const files = new Set(Object.values(manifest.prefixes));
    for (const fileKey of files) {
      if (!fs.existsSync(path.join(OUT_DIR, `${fileKey}.json.gz`))) return false;
    }
    return manifestStat.mtimeMs >= getLatestSourceMtimeMs();
  } catch {
    return false;
  }
}

function sanitizeFileKey(prefix) {
  return prefix.replace(/[^a-zA-Z0-9_-]/g, '_');
}

async function buildArchives() {
  if (isUpToDate()) {
    console.log('[long-lessons] Prebuilt archives up-to-date.');
    return;
  }

  const t0 = Date.now();
  const entryPoint = path.join(DATA_DIR, 'longLessons.ts');
  const result = await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node18',
    write: false,
    logLevel: 'warning',
  });

  const code = result.outputFiles[0].text;
  const mod = new Module(entryPoint, module);
  mod.filename = entryPoint;
  mod.paths = Module._nodeModulePaths(DATA_DIR);
  mod._compile(code, entryPoint);

  const sources = mod.exports.LONG_LESSON_SOURCES;
  if (!sources || typeof sources !== 'object') {
    throw new Error('LONG_LESSON_SOURCES export not found in src/lib/data/longLessons.ts');
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Clean stale files before writing fresh set
  for (const existing of fs.readdirSync(OUT_DIR)) {
    if (existing.endsWith('.json.gz') || existing === '_manifest.json') {
      fs.unlinkSync(path.join(OUT_DIR, existing));
    }
  }

  const seenArrays = new Map();
  const prefixes = {};
  let totalBytes = 0;
  let archiveCount = 0;

  for (const [prefix, lessons] of Object.entries(sources)) {
    if (!Array.isArray(lessons)) continue;
    let fileKey = seenArrays.get(lessons);
    if (!fileKey) {
      fileKey = sanitizeFileKey(prefix);
      seenArrays.set(lessons, fileKey);
      const jsonBuf = Buffer.from(JSON.stringify(lessons), 'utf8');
      const gzBuf = zlib.gzipSync(jsonBuf, { level: 6 });
      fs.writeFileSync(path.join(OUT_DIR, `${fileKey}.json.gz`), gzBuf);
      totalBytes += gzBuf.length;
      archiveCount++;
    }
    prefixes[prefix] = fileKey;
  }

  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    archiveCount,
    prefixes,
  };
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  const mb = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log(`[long-lessons] Built ${archiveCount} compressed course archives (${Object.keys(prefixes).length} prefixes, ${mb} MB) in ${elapsed}s.`);
}

buildArchives().catch((err) => {
  console.error('[long-lessons] Archive build failed:', err);
  process.exit(1);
});
