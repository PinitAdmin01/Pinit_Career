import { TestCase, SuiteExecutionResult } from '../types';
import { executePythonSuite } from './pythonRunner';

export async function executePythonJudgeSuite(
  code: string,
  testSuite?: string,
  testCases: TestCase[] = [],
  timeoutMs: number = 3500,
  fnName: string = 'solution'
): Promise<SuiteExecutionResult> {
  const startTime = Date.now();
  const resolvedFnName = (fnName || 'solution').trim() || 'solution';

  // 1. In browser environments (or when running explicit function TestCase suites in Node tests):
  //    execute directly with Pyodide WASM (browser) or isolated local Python (Node) using the exact function name.
  if (typeof window !== 'undefined' || (Array.isArray(testCases) && testCases.length > 0 && !testSuite?.trim())) {
    try {
      return await executePythonSuite(code, resolvedFnName, testCases, timeoutMs, testSuite);
    } catch (e: any) {
      return {
        language: 'python',
        totalTests: testCases.length || 1,
        passedTests: 0,
        failedTests: testCases.length || 1,
        allPassed: false,
        status: 'RUNTIME_ERROR',
        totalDurationMs: Date.now() - startTime,
        terminalLogs: [`[PYODIDE WASM ERROR] ${e?.message || 'Execution failed'}`],
        testOutcomes: [{
          index: 1,
          testCaseName: 'Local Python Execution',
          input: 'Local Code',
          expectedOutput: 'Pass',
          actualOutput: e?.message || 'Error',
          passed: false,
          durationMs: Date.now() - startTime
        }]
      };
    }
  }

  // 2. Headless/server environment fallback
  try {
    const res = await fetch('/api/code/run-python', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        testSuite,
        timeoutMs
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Python judge connection failed' }));
      return {
        language: 'python',
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        allPassed: false,
        status: 'RUNTIME_ERROR',
        totalDurationMs: Date.now() - startTime,
        terminalLogs: [
          `[PYTHON JUDGE GATEWAY] Server execution returned status ${res.status}`,
          errData.error || 'Server error during Python execution.'
        ],
        testOutcomes: [{
          index: 1,
          testCaseName: 'Server Execution',
          input: 'Code submission',
          expectedOutput: 'Clean test pass',
          actualOutput: errData.error || 'Execution failed',
          passed: false,
          durationMs: Date.now() - startTime
        }],
        error: errData.error
      };
    }

    const data: SuiteExecutionResult = await res.json();
    return data;
  } catch (err: any) {
    return {
      language: 'python',
      totalTests: testCases.length || 1,
      passedTests: 0,
      failedTests: testCases.length || 1,
      allPassed: false,
      status: 'RUNTIME_ERROR',
      totalDurationMs: Date.now() - startTime,
      terminalLogs: [`[PYTHON JUDGE ERROR] ${err?.message || 'Execution failed'}`],
      testOutcomes: [{
        index: 1,
        testCaseName: 'Python Execution',
        input: 'Code',
        expectedOutput: 'Pass',
        actualOutput: err?.message || 'Error',
        passed: false,
        durationMs: Date.now() - startTime
      }]
    };
  }
}
