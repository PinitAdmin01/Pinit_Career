/**
 * Web Task Runners (CHK-1, CHK-2, CHK-3, CHK-4 / W-06).
 * Routes typescript, tsx, html, and css tasks through compile -> guard -> sandbox.
 * Supports both browser environments (sandboxed iframe / worker) and Node environments (test runner / server).
 * All client evaluation output carries the UNTRUSTED CLIENT OBSERVATION classification.
 */

import { SuiteExecutionResult } from '../types';
import { findForbiddenJs } from '../js/jsGuard';
import { compileTs } from '../ts/compileTs';
import { jsTaskResult, executeJsTaskScript } from './jsTaskScript';
import {
  queryAll,
  attr,
  text,
  cssRules,
  cssValue,
  checkImagesHaveAlt,
  assertImagesHaveAlt,
  checkInputsHaveLabels,
  assertInputsHaveLabels,
  checkHeadingsInOrder,
  assertHeadingsInOrder,
} from '../web/htmlCssChecks';

declare const __non_webpack_require__: ((id: string) => any) | undefined;

function getNodeVm(): any {
  if (typeof __non_webpack_require__ !== 'undefined') {
    return __non_webpack_require__('node:vm');
  }
  const nodeReq = typeof module !== 'undefined' && module.require ? module.require.bind(module) : undefined;
  if (nodeReq) {
    return nodeReq('node:vm');
  }
  return null;
}

export const UNTRUSTED_CLIENT_OBSERVATION_NOTICE =
  '[SECURITY NOTICE] Sandbox output is UNTRUSTED CLIENT OBSERVATION (Formative only).';

/**
 * Executes a TypeScript or TSX practice task with compilation and forbidden API defense.
 */
export async function executeTypeScriptTask(
  code: string,
  testSuite: string,
  timeoutMs: number,
  language: 'typescript' | 'tsx'
): Promise<SuiteExecutionResult> {
  const start = Date.now();

  // 1. Guard against forbidden APIs (CHK-5)
  const forbiddenCode = findForbiddenJs(code);
  if (forbiddenCode) {
    return jsTaskResult(
      false,
      `SecurityError: Forbidden API detected in code: ${forbiddenCode}`,
      '',
      Date.now() - start
    );
  }

  if (testSuite) {
    const forbiddenTest = findForbiddenJs(testSuite);
    if (forbiddenTest) {
      return jsTaskResult(
        false,
        `SecurityError: Forbidden API detected in test suite: ${forbiddenTest}`,
        '',
        Date.now() - start
      );
    }
  }

  // 2. Compile TS/TSX to JavaScript (CHK-2)
  const compiled = await compileTs(code, { jsx: language === 'tsx' });
  if (!compiled.ok) {
    const errorMsg = `Syntax error on line ${compiled.line ?? '?'}: ${compiled.message}`;
    return jsTaskResult(false, errorMsg, '', Date.now() - start);
  }

  // 3. Execution routing
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // In-browser sandbox
    return executeJsTaskScript(compiled.js, testSuite, timeoutMs, { language });
  }

  // Node.js test environment: execute in node:vm
  const vm = getNodeVm();
  const stdoutLogs: string[] = [];

  const sandbox: Record<string, any> = {
    console: {
      log: (...args: any[]) => stdoutLogs.push(args.map(String).join(' ')),
      error: (...args: any[]) => stdoutLogs.push(args.map(String).join(' ')),
      warn: (...args: any[]) => stdoutLogs.push(args.map(String).join(' ')),
    },
    setTimeout,
    clearTimeout,
    Promise,
    URL,
    URLSearchParams,
    TextEncoder: typeof TextEncoder !== 'undefined' ? TextEncoder : undefined,
    TextDecoder: typeof TextDecoder !== 'undefined' ? TextDecoder : undefined,
    Uint8Array,
    crypto: globalThis.crypto,
    atob: typeof atob !== 'undefined' ? atob : undefined,
    btoa: typeof btoa !== 'undefined' ? btoa : undefined,
    Buffer: typeof Buffer !== 'undefined' ? Buffer : undefined,
    assert: (cond: any, msg?: string) => {
      if (!cond) throw new Error(msg || 'Assertion failed');
    },
  };

  if (language === 'tsx') {
    const { getReactRuntimeSync } = await import('../react/reactRuntime');
    const runtime = getReactRuntimeSync();
    vm.createContext(sandbox);
    vm.runInContext(runtime, sandbox);
    sandbox.render = function (Component: any, props: any = {}) {
      const R = sandbox.__PINIT_REACT__ || {
        React: sandbox.React,
        renderToStaticMarkup: sandbox.renderToStaticMarkup,
      };
      if (!R || !R.renderToStaticMarkup || !R.React) {
        throw new Error('React render runtime is not initialized');
      }
      return R.renderToStaticMarkup(R.React.createElement(Component, props));
    };
  } else {
    vm.createContext(sandbox);
  }

  try {
    const runnableJs = compiled.js
      .replace(/\bexport\s+default\s+/g, '')
      .replace(/\bexport\s+(?=(?:async\s+)?function|const|let|var|class)\b/g, '');

    vm.runInContext(runnableJs, sandbox, { timeout: timeoutMs });

    const wrappedChecks = `(async () => {\n${testSuite}\n})()`;
    const promise = vm.runInContext(wrappedChecks, sandbox, { timeout: timeoutMs });
    if (promise && typeof promise.then === 'function') {
      await promise;
    }

    return jsTaskResult(true, null, stdoutLogs.join('\n'), Date.now() - start);
  } catch (err: any) {
    return jsTaskResult(false, err?.message || String(err), stdoutLogs.join('\n'), Date.now() - start);
  }
}

/**
 * Executes an HTML or CSS practice task with check helpers and AST inspection.
 */
export async function executeHtmlCssTask(
  code: string,
  testSuite: string,
  timeoutMs: number,
  language: 'html' | 'css'
): Promise<SuiteExecutionResult> {
  const start = Date.now();

  // 1. Guard against forbidden APIs (CHK-5)
  const forbiddenCode = findForbiddenJs(code);
  if (forbiddenCode) {
    return jsTaskResult(
      false,
      `SecurityError: Forbidden API detected in code: ${forbiddenCode}`,
      '',
      Date.now() - start
    );
  }

  if (testSuite) {
    const forbiddenTest = findForbiddenJs(testSuite);
    if (forbiddenTest) {
      return jsTaskResult(
        false,
        `SecurityError: Forbidden API detected in test suite: ${forbiddenTest}`,
        '',
        Date.now() - start
      );
    }
  }

  const stdoutLogs: string[] = [];

  // Setup execution environment with HTML/CSS check helpers
  const sandbox: Record<string, any> = {
    console: {
      log: (...args: any[]) => stdoutLogs.push(args.map(String).join(' ')),
      error: (...args: any[]) => stdoutLogs.push(args.map(String).join(' ')),
      warn: (...args: any[]) => stdoutLogs.push(args.map(String).join(' ')),
    },
    code,
    html: code,
    css: code,
    queryAll,
    attr,
    text,
    cssRules,
    cssValue,
    checkImagesHaveAlt,
    assertImagesHaveAlt,
    checkInputsHaveLabels,
    assertInputsHaveLabels,
    checkHeadingsInOrder,
    assertHeadingsInOrder,
    setTimeout,
    clearTimeout,
    Promise,
  };

  if (typeof window === 'undefined') {
    // Node.js environment
    const vm = getNodeVm();
    vm.createContext(sandbox);

    try {
      const wrappedChecks = `(async () => {\n${testSuite}\n})()`;
      const promise = vm.runInContext(wrappedChecks, sandbox, { timeout: timeoutMs });
      if (promise && typeof promise.then === 'function') {
        await promise;
      }

      return jsTaskResult(true, null, stdoutLogs.join('\n'), Date.now() - start);
    } catch (err: any) {
      return jsTaskResult(false, err?.message || String(err), stdoutLogs.join('\n'), Date.now() - start);
    }
  } else {
    // Browser environment: evaluate using sandbox or function execution
    try {
      const fn = new Function(
        'code',
        'html',
        'css',
        'queryAll',
        'attr',
        'text',
        'cssRules',
        'cssValue',
        'checkImagesHaveAlt',
        'assertImagesHaveAlt',
        'checkInputsHaveLabels',
        'assertInputsHaveLabels',
        'checkHeadingsInOrder',
        'assertHeadingsInOrder',
        `return (async () => {\n${testSuite}\n})();`
      );

      const promise = fn(
        code,
        code,
        code,
        queryAll,
        attr,
        text,
        cssRules,
        cssValue,
        checkImagesHaveAlt,
        assertImagesHaveAlt,
        checkInputsHaveLabels,
        assertInputsHaveLabels,
        checkHeadingsInOrder,
        assertHeadingsInOrder
      );

      if (promise && typeof promise.then === 'function') {
        await promise;
      }

      return jsTaskResult(true, null, stdoutLogs.join('\n'), Date.now() - start);
    } catch (err: any) {
      return jsTaskResult(false, err?.message || String(err), stdoutLogs.join('\n'), Date.now() - start);
    }
  }
}
