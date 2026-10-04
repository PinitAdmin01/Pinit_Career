/**
 * Bundles HTML and CSS check helpers into public/sandbox/web-runtime.js (W-05 / CHK-4).
 * Runs before `dev` and `build`.
 * In the worker/iframe sandbox, this script is placed in front of student code
 * so HTML and CSS tasks can be evaluated by parsing and querying ASTs without browser DOM dependencies.
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.join(__dirname, '..', '..');
const outDir = path.join(root, 'public', 'sandbox');
const outFile = path.join(outDir, 'web-runtime.js');

fs.mkdirSync(outDir, { recursive: true });

esbuild.buildSync({
  entryPoints: [path.join(root, 'src', 'lib', 'code', 'web', 'htmlCssChecks.ts')],
  outfile: outFile,
  bundle: true,
  format: 'iife',
  globalName: '__PINIT_WEB_MODULE__',
  footer: {
    js: `
      if (typeof __PINIT_WEB_MODULE__ !== 'undefined') {
        globalThis.__PINIT_WEB__ = __PINIT_WEB_MODULE__;
        for (const [key, val] of Object.entries(__PINIT_WEB_MODULE__)) {
          globalThis[key] = val;
        }
      }
    `,
  },
  platform: 'browser',
  target: 'es2022',
  minify: true,
  logLevel: 'warning',
});

console.log('[build-web-runtime] public/sandbox/web-runtime.js ready');
