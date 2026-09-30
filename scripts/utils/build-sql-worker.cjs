/* Builds the in-browser SQL runner into public/sql/ (runs before `next dev` and `next build`):
 *   sql-worker.js  - src/lib/code/sql/sqlWorker.ts bundled with PGlite (PostgreSQL in WebAssembly)
 *   pglite.wasm, pglite.data, initdb.wasm - PGlite's files, loaded next to the worker
 * public/sql/ is generated, so it is in .gitignore. */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.join(__dirname, '..', '..');
const outDir = path.join(root, 'public', 'sql');
const pgliteDist = path.join(root, 'node_modules', '@electric-sql', 'pglite', 'dist');

fs.mkdirSync(outDir, { recursive: true });
esbuild.buildSync({
  entryPoints: [path.join(root, 'src', 'lib', 'code', 'sql', 'sqlWorker.ts')],
  outfile: path.join(outDir, 'sql-worker.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  minify: true,
  logLevel: 'warning',
});
for (const file of ['pglite.wasm', 'pglite.data', 'initdb.wasm']) {
  fs.copyFileSync(path.join(pgliteDist, file), path.join(outDir, file));
}
console.log('[build-sql-worker] public/sql ready');
