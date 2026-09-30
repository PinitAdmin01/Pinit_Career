/**
 * Copies the Pyodide runtime (real Python compiled to WebAssembly) from node_modules into
 * public/pyodide, so lessons can run Python in the browser from PinIT's own site: no outside CDN
 * and no Content-Security-Policy change. Runs before `dev` and `build` (see package.json).
 * public/pyodide is generated, not committed (.gitignore).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'node_modules', 'pyodide');
const DEST = path.join(ROOT, 'public', 'pyodide');
const FILES = ['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'];

if (!fs.existsSync(SRC)) {
  console.error('[copy-pyodide] node_modules/pyodide is missing. Run npm install.');
  process.exit(1);
}
fs.mkdirSync(DEST, { recursive: true });
for (const file of FILES) {
  const from = path.join(SRC, file);
  if (!fs.existsSync(from)) {
    console.error(`[copy-pyodide] ${file} is missing from the pyodide package.`);
    process.exit(1);
  }
  fs.copyFileSync(from, path.join(DEST, file));
}
console.log(`[copy-pyodide] Copied ${FILES.length} Pyodide files to public/pyodide`);
