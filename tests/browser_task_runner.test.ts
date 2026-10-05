import test from 'node:test';
import assert from 'node:assert/strict';
import { buildJsTaskScript } from '../src/lib/code/runners/jsTaskScript';
import { executeTypeScriptTask, executeHtmlCssTask } from '../src/lib/code/runners/webTaskRunner';

test('F-13 (1): buildJsTaskScript strips export declarations so new Function does not throw SyntaxError', () => {
  const code = `export function computeArea(width, height) {
    return width * height;
  }`;
  const testSuite = `assert(computeArea(4, 5) === 20);`;

  const script = buildJsTaskScript(code, testSuite);

  // Must not contain "export function"
  assert.ok(
    !/\bexport\s+function\b/.test(script),
    'Export keyword must be stripped before executing in browser script mode'
  );

  // Must be parseable by new Function without throwing SyntaxError: Unexpected token 'export'
  let fn: Function | null = null;
  assert.doesNotThrow(() => {
    fn = new Function(script);
  }, 'new Function(script) must not throw SyntaxError for exported functions');

  assert.ok(fn !== null);
});

test('F-13 (2): buildJsTaskScript defines assert helper so assert(...) works in browser sandbox', async () => {
  const code = `function doubleNumber(n) {
    return n * 2;
  }`;
  const testSuite = `assert(doubleNumber(10) === 20, "Must double correctly");`;

  const script = buildJsTaskScript(code, testSuite);

  // Must define assert
  assert.ok(
    script.includes('assert'),
    'Script must define assert function'
  );

  // Running new Function(script)() must execute and pass assert without "assert is not defined"
  const fn = new Function(script);
  const resultPromise = fn();
  await assert.doesNotReject(async () => {
    await resultPromise;
  }, 'Calling assert in browser script must not fail with "assert is not defined"');
});

test('F-13 (3): TS task with export function and assert executes cleanly on the browser-ready script path', async () => {
  const tsCode = `export function greet(name: string): string {
    return "Hello, " + name;
  }`;
  const testSuite = `assert(greet("Alice") === "Hello, Alice");`;

  // Compile TS as executeTypeScriptTask does
  const { compileTs } = await import('../src/lib/code/ts/compileTs');
  const compiled = await compileTs(tsCode, { jsx: false });
  assert.ok(compiled.ok);

  const script = buildJsTaskScript(compiled.js, testSuite);
  const fn = new Function(script);
  await fn(); // should complete without errors
});

test('F-13 (4): HTML/CSS browser runner runs inside sandboxed iframe using web-runtime.js', async () => {
  const fs = await import('fs');
  const path = await import('path');
  const runnerSrc = fs.readFileSync(
    path.resolve(process.cwd(), 'src/lib/code/runners/webTaskRunner.ts'),
    'utf8'
  );

  // The browser branch must NOT use new Function (which skips the sandbox)
  assert.ok(
    !runnerSrc.includes('new Function'),
    'HTML/CSS runner in browser must not use raw new Function'
  );
  assert.ok(
    runnerSrc.includes('web-runtime') || runnerSrc.includes('getWebRuntime'),
    'HTML/CSS runner in browser must load web-runtime.js'
  );
});
