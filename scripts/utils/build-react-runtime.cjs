/**
 * Bundles React and react-dom/server into public/sandbox/react-runtime.js (W-04 / CHK-3).
 * Runs before `dev` and `build`.
 * In the worker/iframe sandbox, this script is placed in front of student code
 * so TSX tasks can be evaluated by rendering components to static markup without a DOM.
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.join(__dirname, '..', '..');
const outDir = path.join(root, 'public', 'sandbox');
const outFile = path.join(outDir, 'react-runtime.js');

fs.mkdirSync(outDir, { recursive: true });

const entryCode = `
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

globalThis.React = React;
globalThis.renderToStaticMarkup = renderToStaticMarkup;
globalThis.__PINIT_REACT__ = { React, renderToStaticMarkup };
`;

esbuild.buildSync({
  stdin: {
    contents: entryCode,
    resolveDir: root,
    loader: 'js',
  },
  outfile: outFile,
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  logLevel: 'warning',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

console.log('[build-react-runtime] public/sandbox/react-runtime.js ready');
