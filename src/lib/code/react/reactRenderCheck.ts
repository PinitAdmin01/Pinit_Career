/**
 * React render check helpers (CHK-3 / W-04).
 * Provides DOM-less component rendering via renderToStaticMarkup,
 * and executes TSX component checks in an isolated runtime environment.
 */

import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { findForbiddenJs } from '../js/jsGuard';
import { compileTs } from '../ts/compileTs';

let cachedRuntimeCode: string | null = null;

/**
 * Returns the bundled React runtime code as a string.
 * Loads /sandbox/react-runtime.js in the browser or reads public/sandbox/react-runtime.js in Node.
 */
export async function getReactRuntime(): Promise<string> {
  if (cachedRuntimeCode) return cachedRuntimeCode;

  if (typeof window !== 'undefined') {
    const res = await fetch('/sandbox/react-runtime.js');
    if (!res.ok) {
      throw new Error(`Failed to load React runtime from /sandbox/react-runtime.js (${res.status})`);
    }
    cachedRuntimeCode = await res.text();
    return cachedRuntimeCode;
  }

  // Node environment
  const fs = await import('fs');
  const path = await import('path');
  const runtimePath = path.resolve(process.cwd(), 'public/sandbox/react-runtime.js');
  cachedRuntimeCode = fs.readFileSync(runtimePath, 'utf8');
  return cachedRuntimeCode!;
}

/**
 * Synchronous loader for the React runtime bundle in Node.js environments.
 */
export function getReactRuntimeSync(): string {
  if (cachedRuntimeCode) return cachedRuntimeCode;
  const fs = require('fs');
  const path = require('path');
  const runtimePath = path.resolve(process.cwd(), 'public/sandbox/react-runtime.js');
  cachedRuntimeCode = fs.readFileSync(runtimePath, 'utf8');
  return cachedRuntimeCode!;
}

/**
 * Renders a React component or element to an HTML string without a DOM (CHK-3).
 */
export function render(
  Component: any,
  props: Record<string, any> = {}
): string {
  if (React.isValidElement(Component)) {
    return renderToStaticMarkup(Component);
  }
  return renderToStaticMarkup(React.createElement(Component, props));
}

export interface ReactRenderCheckResult {
  ok: boolean;
  error?: string;
  html?: string;
}

/**
 * Executes a TSX component and its render checks in a secure isolated environment.
 * Guards against forbidden APIs, compiles TSX, and runs test assertions.
 */
export async function runReactRenderCheck(
  studentTsx: string,
  testSuiteJs: string,
  options?: { timeoutMs?: number }
): Promise<ReactRenderCheckResult> {
  const timeoutMs = options?.timeoutMs || 4000;

  // 1. Guard against forbidden APIs (CHK-5)
  const forbiddenStudent = findForbiddenJs(studentTsx);
  if (forbiddenStudent) {
    return { ok: false, error: `Forbidden API detected in component: ${forbiddenStudent}` };
  }
  const forbiddenTests = findForbiddenJs(testSuiteJs);
  if (forbiddenTests) {
    return { ok: false, error: `Forbidden API detected in test suite: ${forbiddenTests}` };
  }

  // 2. Compile TSX to JS
  const compiled = await compileTs(studentTsx, { jsx: true });
  if (!compiled.ok) {
    return {
      ok: false,
      error: `Syntax error on line ${compiled.line ?? '?'}: ${compiled.message}`,
    };
  }

  // 3. In Node environments, run with node:vm
  if (typeof window === 'undefined') {
    const vm = await import('node:vm');
    const runtimeCode = getReactRuntimeSync();

    const sandbox: Record<string, any> = {
      console: {
        log: () => {},
        error: () => {},
        warn: () => {},
      },
      TextEncoder: typeof TextEncoder !== 'undefined' ? TextEncoder : undefined,
      TextDecoder: typeof TextDecoder !== 'undefined' ? TextDecoder : undefined,
      Uint8Array,
      setTimeout,
      clearTimeout,
    };
    vm.createContext(sandbox);

    // Initialize React runtime in the sandbox
    vm.runInContext(runtimeCode, sandbox);

    // Inject render helper
    sandbox.render = function (Component: any, props: Record<string, any> = {}) {
      const R = sandbox.__PINIT_REACT__ || { React: sandbox.React, renderToStaticMarkup: sandbox.renderToStaticMarkup };
      if (!R || !R.renderToStaticMarkup || !R.React) {
        throw new Error('React render runtime is not initialized in sandbox');
      }
      return R.renderToStaticMarkup(R.React.createElement(Component, props));
    };

    try {
      // Normalize exports so code can run as a script inside VM/worker
      const runnableJs = compiled.js
        .replace(/\bexport\s+default\s+/g, '')
        .replace(/\bexport\s+(?=(?:async\s+)?function|const|let|var|class)\b/g, '');

      // Run student code to declare components
      vm.runInContext(runnableJs, sandbox, { timeout: timeoutMs });

      // Run checks inside an async function
      const wrappedChecks = `(async () => {\n${testSuiteJs}\n})()`;
      const promise = vm.runInContext(wrappedChecks, sandbox, { timeout: timeoutMs });
      if (promise && typeof promise.then === 'function') {
        await promise;
      }
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || String(err) };
    }
  }

  // Browser execution would be handled via executeInTwoLayerSandbox or jsTaskScript
  return { ok: true };
}
