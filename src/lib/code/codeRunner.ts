// src/lib/code/codeRunner.ts
// PinIT Universal In-Browser Multi-Language Code Execution Engine
// Supports: JavaScript, Python (Pyodide WASM), SQL (In-Memory SQLite), Java/C++ (AST verification)

import { CodeLanguage, TestCase, SqlTestCase, SuiteExecutionResult } from './types';
import { executeJavaScriptSuite } from './runners/jsRunner';
import { executeJsTaskScript } from './runners/jsTaskScript';
import { executePythonSuite, loadPyodideRuntime } from './runners/pythonRunner';
import { executeSqlSuite } from './runners/sqlRunner';
import { executeJavaJudgeSuite } from './runners/javaJudgeRunner';
import { executePythonJudgeSuite } from './runners/pythonJudgeRunner';
import { executeTypeScriptTask, executeHtmlCssTask } from './runners/webTaskRunner';
import { executeBashSuite } from './runners/bashRunner';
import { executeCppSuite } from './runners/cppRunner';

export const CODE_RUNNER_VERSION = 'v1.0';

/**
 * Pre-warms the Pyodide WebAssembly runtime in the background to ensure instantaneous subsequent runs
 */
export async function warmUpCodeRuntime(lang: CodeLanguage): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (lang === 'python' || lang === 'sql') {
    try {
      await loadPyodideRuntime();
      return true;
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * Unified public entrypoint to execute code test suites in browser
 */
export async function runTestSuite(
  code: string,
  language: CodeLanguage,
  options?: {
    functionName?: string;
    testCases?: TestCase[];
    testSuite?: string;
    sqlConfig?: SqlTestCase;
    timeoutMs?: number;
    /** Quest ID + XP for the server-authoritative Java completion record (§3.5/§3.6). Java only. */
    questId?: string;
    xp?: number;
  }
): Promise<SuiteExecutionResult> {
  const fnName = options?.functionName || 'solution';
  const testCases = options?.testCases || [];
  const timeoutMs = options?.timeoutMs || 4500;

  switch (language) {
    case 'javascript':
      // Practice tasks carry their checks as a JavaScript test suite instead of input/output cases.
      if (testCases.length === 0 && options?.testSuite?.trim()) {
        return executeJsTaskScript(code, options.testSuite, Math.max(timeoutMs, 8000));
      }
      return executeJavaScriptSuite(code, fnName, testCases, timeoutMs);

    case 'python':
      return executePythonJudgeSuite(code, (options as any)?.testSuite, testCases, timeoutMs);

    case 'sql':
      return executeSqlSuite(code, options?.sqlConfig || { query: code }, timeoutMs, (options as any)?.testSuite);

    case 'java':
      return executeJavaJudgeSuite(code, (options as any)?.testSuite, testCases, timeoutMs, options?.questId, options?.xp);

    case 'typescript':
    case 'tsx':
      return executeTypeScriptTask(code, options?.testSuite || '', Math.max(timeoutMs, 8000), language);

    case 'html':
    case 'css':
      return executeHtmlCssTask(code, options?.testSuite || '', Math.max(timeoutMs, 8000), language);

    case 'bash':
    case 'shell':
      return executeBashSuite(code, testCases, options?.testSuite, timeoutMs);

    case 'cpp':
      return executeCppSuite(code, fnName, testCases, timeoutMs, {
        testSuite: options?.testSuite,
        questId: options?.questId,
        requireCompilerExecution: true,
      });

    default:
      return {
        language: 'javascript',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        allPassed: false,
        status: 'RUNTIME_ERROR',
        totalDurationMs: 0,
        terminalLogs: [`[ERROR] Unsupported programming language: ${language}`],
        testOutcomes: []
      };
  }
}
