// src/lib/code/runners/cppRunner.ts
// C++ Static Inspector & Fail-Closed Execution Runner for PinIT Career OS.
// Zero fake pass flags: behavioral test suites and coding assessments NEVER pass
// via regex/AST heuristics — they require real C++ compilation & execution or fail closed.

import { TestCase, SuiteExecutionResult, SingleTestOutcome } from '../types';
import { supabase } from '../../supabaseClient';

export interface CppInspectionReport {
  hasValidSignature: boolean;
  hasReturn: boolean;
  detectedFunctionName?: string;
  detectedReturnType?: string;
  hasHeaders: boolean;
  hasLoopsOrRecursion: boolean;
  usesPointersOrReferences: boolean;
  syntaxViolations: string[];
}

export function inspectCppSource(code: string, expectedFnName: string): CppInspectionReport {
  const violations: string[] = [];

  const fnRegex = new RegExp(
    `(?:(?:int|void|double|float|long|bool|char|string|auto|uint8_t|uint16_t|uint32_t|int32_t|vector<[\\w\\s,<>]+>|pair<[\\w\\s,<>]+>)\\s+[*&]?\\s*|class\\s+\\w+\\s*\\{[\\s\\S]*?\\}\\s*;?\\s*)(${expectedFnName})\\s*\\(([^)]*)\\)`,
    'i'
  );
  const fnMatch = code.match(fnRegex);
  const fallbackFnMatch = code.match(/(\w+(?:<[^>]+>)?)\s+([*&]?\s*\w+)\s*\(([^)]*)\)/);

  const hasValidSignature = Boolean(fnMatch || fallbackFnMatch);
  const detectedFunctionName = fnMatch ? fnMatch[1] : fallbackFnMatch ? fallbackFnMatch[2].trim() : undefined;
  const detectedReturnType = fallbackFnMatch ? fallbackFnMatch[1].trim() : undefined;

  const hasReturn = /\breturn\b/.test(code);
  if (!hasReturn && !/\bvoid\s+/.test(code)) {
    violations.push(`Function '${expectedFnName}' lacks an explicit 'return' statement`);
  }

  const hasHeaders = /#include\s*<[\w.]+>/.test(code);
  const hasLoopsOrRecursion = Boolean(
    /\b(for|while)\s*\(/.test(code) ||
      (expectedFnName && new RegExp(`\\b${expectedFnName}\\s*\\(`).test(code.replace(fnRegex, '')))
  );
  const usesPointersOrReferences =
    /[*&]\s*\w+/.test(code) || /\b(unique_ptr|shared_ptr|make_unique|make_shared)\b/.test(code);

  return {
    hasValidSignature,
    hasReturn: hasReturn || /\bvoid\s+/.test(code),
    detectedFunctionName,
    detectedReturnType,
    hasHeaders,
    hasLoopsOrRecursion,
    usesPointersOrReferences,
    syntaxViolations: violations,
  };
}

async function buildDirectAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'X-Pinit-Direct': '1' };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  } catch {
    // Fail-closed on unauthenticated judge requests.
  }
  return headers;
}

function failClosedCppResult(
  testCases: TestCase[],
  logs: string[],
  reason: string,
  startTime: number
): SuiteExecutionResult {
  const outcomes: SingleTestOutcome[] = (testCases.length > 0 ? testCases : [{ input: '', output: '' }]).map(
    (tc, i) => ({
      index: i,
      testCaseName: tc.name || `C++ Test #${i + 1}`,
      input: tc.input || '',
      expectedOutput: tc.output || 'Compiled execution pass',
      actualOutput: 'UNAVAILABLE (no C++ compiler runtime)',
      passed: false,
      error: reason,
      durationMs: 0,
    })
  );

  return {
    language: 'cpp',
    totalTests: outcomes.length,
    passedTests: 0,
    failedTests: outcomes.length,
    allPassed: false,
    status: 'RUNTIME_ERROR',
    totalDurationMs: Date.now() - startTime,
    terminalLogs: [...logs, `[CPP JUDGE FAIL-CLOSED] ${reason}`],
    testOutcomes: outcomes,
    error: reason,
  };
}

export async function executeCppSuite(
  code: string,
  functionName: string = 'solution',
  testCases: TestCase[] = [],
  timeoutMs: number = 3500,
  options?: { testSuite?: string; questId?: string; requireCompilerExecution?: boolean }
): Promise<SuiteExecutionResult> {
  const startTime = Date.now();
  const cleanCode = (code || '').trim();
  const inspection = inspectCppSource(cleanCode, functionName);

  const terminalLogs: string[] = [
    `[CPP STATIC ANALYZER] Checking syntax & signature for '${functionName}'...`,
  ];
  if (inspection.hasHeaders) {
    terminalLogs.push('[INFO] Detected C++ preprocessor standard headers (#include).');
  }
  if (inspection.usesPointersOrReferences) {
    terminalLogs.push('[INFO] Pointer/reference usage detected.');
  }

  const requiresCompiler =
    testCases.length > 0 ||
    Boolean(options?.testSuite && options.testSuite.trim()) ||
    Boolean(options?.requireCompilerExecution);

  // Never mark behavioral tests or coding assessments as passed without a real compiler.
  if (requiresCompiler) {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/code/run-cpp', {
          method: 'POST',
          headers: await buildDirectAuthHeaders(),
          body: JSON.stringify({
            code: cleanCode,
            functionName,
            testCases,
            testSuite: options?.testSuite,
            timeoutMs,
            questId: options?.questId,
          }),
        });
        if (res.ok) {
          const data: SuiteExecutionResult = await res.json();
          if (typeof data.allPassed === 'boolean') return data;
        }
        const errBody = await res.json().catch(() => ({}));
        const msg = errBody?.error || errBody?.message || `C++ compiler judge unavailable (HTTP ${res.status}).`;
        return failClosedCppResult(testCases, terminalLogs, msg, startTime);
      } catch (err: any) {
        return failClosedCppResult(
          testCases,
          terminalLogs,
          err?.message || 'C++ compiler backend is unreachable; failing closed without fake pass.',
          startTime
        );
      }
    }

    // Server/Node path without an external C++ judge URL must fail closed unless compiled natively.
    return failClosedCppResult(
      testCases,
      terminalLogs,
      'No native C++ compiler (g++/clang++) or CPP_JUDGE_URL is configured; behavioral assertions cannot be verified.',
      startTime
    );
  }

  // Slide preview path ONLY (no test cases / no grading suite): static syntax & signature inspection.
  const isPass = inspection.hasValidSignature && inspection.hasReturn && inspection.syntaxViolations.length === 0;
  const durationMs = Date.now() - startTime;

  terminalLogs.push(
    isPass
      ? `[SUCCESS] Function signature '${functionName}' and control flow verified (static syntax check only — no native C++ binary executed).`
      : `[FAIL] Missing valid function signature or return statement in C++ solution.`
  );

  return {
    language: 'cpp',
    totalTests: 1,
    passedTests: isPass ? 1 : 0,
    failedTests: isPass ? 0 : 1,
    allPassed: isPass,
    status: isPass ? 'SUCCESS' : 'SYNTAX_ERROR',
    totalDurationMs: durationMs,
    terminalLogs,
    testOutcomes: [
      {
        index: 0,
        testCaseName: 'C++ Structural AST Validation (Static Only)',
        input: functionName,
        expectedOutput: `Valid ${functionName} signature`,
        actualOutput: isPass ? 'Static Syntax Verified' : 'Invalid Signature',
        passed: isPass,
        error: isPass ? undefined : inspection.syntaxViolations[0] || 'Structural mismatch',
        durationMs,
      },
    ],
  };
}
