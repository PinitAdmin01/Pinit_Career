/**
 * Copies the self-contained Mozilla PDF.js runtime from `unpdf` into `public/pdfjs/pdfjs.mjs`,
 * so Proof Vault renders uploaded PDF resumes & certificates directly onto HTML <canvas> elements
 * from PinIT's own origin ('self'): zero external CDN, zero iframe/blob CSP bugs, zero Chrome PDF plugin failures.
 * Runs automatically before `dev`, `build`, and `test` (see package.json & next.config.js).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'node_modules', 'unpdf', 'dist', 'pdfjs.mjs');
const DEST_DIR = path.join(ROOT, 'public', 'pdfjs');
const DEST = path.join(DEST_DIR, 'pdfjs.mjs');

if (!fs.existsSync(SRC)) {
  console.error('[copy-pdfjs] node_modules/unpdf/dist/pdfjs.mjs is missing. Run npm install.');
  process.exit(1);
}

fs.mkdirSync(DEST_DIR, { recursive: true });
fs.copyFileSync(SRC, DEST);
console.log('[copy-pdfjs] Copied Mozilla PDF.js runtime to public/pdfjs/pdfjs.mjs');
