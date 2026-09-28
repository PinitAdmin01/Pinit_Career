import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { LOG_FORMAT_SOURCE, formatLogArgs } from '../src/lib/code/sandbox/logFormat';

// The code runner's worker is JavaScript source nested inside two template literals (the iframe
// document, then the worker script). An escape like '\\n' written in that source turned into a raw
// line break inside a quoted string, so the worker failed to parse and "Run Code" always showed
// "Uncaught SyntaxError: Invalid or unexpected token". This rebuilds the worker source the way the
// browser does and checks that it parses.
test('the sandbox worker script parses after both template literal passes', () => {
  const file = fs.readFileSync(path.join(__dirname, '../src/lib/code/sandbox/sandboxedIframeRunner.ts'), 'utf8');
  const start = file.indexOf('const workerScript = \\`');
  const end = file.indexOf('\\`;', start);
  assert.ok(start > 0 && end > start, 'workerScript not found in sandboxedIframeRunner.ts');
  const rawInOuterTemplate = file.slice(start + 'const workerScript = \\`'.length, end);

  // Pass 1: the TypeScript template literal that builds the iframe document.
  // eslint-disable-next-line no-new-func
  const inIframe = new Function('LOG_FORMAT_SOURCE', 'return `' + rawInOuterTemplate + '`;')(LOG_FORMAT_SOURCE) as string;
  // Pass 2: the template literal inside the iframe's script that holds the worker source.
  // eslint-disable-next-line no-new-func
  const workerSource = new Function('return `' + inIframe + '`;')() as string;

  // Parse only (do not run): throws SyntaxError if the worker source is broken.
  // eslint-disable-next-line no-new-func
  assert.doesNotThrow(() => new Function(workerSource), 'worker script has a syntax error');
});

test('console.log values are shown readably', () => {
  assert.equal(formatLogArgs(['Hello']), 'Hello');
  assert.equal(formatLogArgs([['HTML', 'CSS']]), "[ 'HTML', 'CSS' ]");
  assert.equal(formatLogArgs([{ title: 'Dev', salary: 5, tags: [] }]), "{ title: 'Dev', salary: 5, tags: [] }");
  assert.equal(formatLogArgs(['Total:', 540]), 'Total: 540');
  assert.equal(formatLogArgs([null, undefined, true]), 'null undefined true');
  assert.equal(formatLogArgs([{ Dashboard: 1, 'All jobs': 2 }]), "{ Dashboard: 1, 'All jobs': 2 }");
});
