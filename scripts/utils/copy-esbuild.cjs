/**
 * Copies the esbuild-wasm WebAssembly binary from node_modules into
 * public/esbuild/esbuild.wasm, so browser tasks and lessons can compile TypeScript/TSX
 * locally from PinIT's own origin without external CDNs.
 * Runs before `dev` and `build` (see package.json).
 * public/esbuild is generated, not committed (.gitignore).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'node_modules', 'esbuild-wasm', 'esbuild.wasm');
const DEST_DIR = path.join(ROOT, 'public', 'esbuild');
const DEST_FILE = path.join(DEST_DIR, 'esbuild.wasm');

if (!fs.existsSync(SRC)) {
  console.error('[copy-esbuild] node_modules/esbuild-wasm/esbuild.wasm is missing. Run npm install.');
  process.exit(1);
}

fs.mkdirSync(DEST_DIR, { recursive: true });
fs.copyFileSync(SRC, DEST_FILE);
console.log('[copy-esbuild] Copied esbuild.wasm to public/esbuild/esbuild.wasm');
