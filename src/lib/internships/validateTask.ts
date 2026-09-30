import { findForbiddenPython } from '@/lib/code/python/pythonGuard';
import { runPythonInSandbox } from '@/lib/server/pythonSandbox';
import type { GeneratedTask } from './generateTask';

export type ValidationStep = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7';

export interface ValidationSuccess {
  ok: true;
}

export interface ValidationFailure {
  ok: false;
  step: ValidationStep;
  reason: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Validates an AI-generated internship task against pipeline steps V1–V7 (C12).
 * All steps must pass in strict order.
 */
export async function validateGeneratedTask(
  task: GeneratedTask,
  language: 'python' | 'sql' = 'python'
): Promise<ValidationResult> {
  // ── Step V1: Length limits ───────────────────────────────────────────────
  if (task.brief.length > 2000) {
    return { ok: false, step: 'V1', reason: `Brief length (${task.brief.length}) exceeds 2,000 characters limit.` };
  }
  if (task.starter_code.length > 6000) {
    return { ok: false, step: 'V1', reason: `Starter code length (${task.starter_code.length}) exceeds 6,000 characters limit.` };
  }
  if (task.visible_tests.length > 6000) {
    return { ok: false, step: 'V1', reason: `Visible tests length (${task.visible_tests.length}) exceeds 6,000 characters limit.` };
  }
  if (task.hidden_tests.length > 6000) {
    return { ok: false, step: 'V1', reason: `Hidden tests length (${task.hidden_tests.length}) exceeds 6,000 characters limit.` };
  }
  if (task.reference_solution.length > 6000) {
    return { ok: false, step: 'V1', reason: `Reference solution length (${task.reference_solution.length}) exceeds 6,000 characters limit.` };
  }
  if (task.sql_setup && task.sql_setup.length > 6000) {
    return { ok: false, step: 'V1', reason: `SQL setup length (${task.sql_setup.length}) exceeds 6,000 characters limit.` };
  }

  // ── Step V2: Security sandbox check ──────────────────────────────────────
  if (language === 'python') {
    const combinedPython = [
      task.starter_code,
      task.visible_tests,
      task.hidden_tests,
      task.reference_solution,
    ].join('\n');

    const forbidden = findForbiddenPython(combinedPython);
    if (forbidden) {
      return {
        ok: false,
        step: 'V2',
        reason: `Restricted Python pattern found: ${forbidden}`,
      };
    }
  }

  // ── Step V3: Reference solution + visible tests pass ───────────────────────
  if (language === 'python') {
    const v3Res = await runPythonInSandbox({
      code: task.reference_solution,
      tests: task.visible_tests,
      timeoutMs: 4000,
    });
    if (!v3Res.passed) {
      return {
        ok: false,
        step: 'V3',
        reason: `Reference solution failed visible tests: ${v3Res.stderr || v3Res.stdout}`,
      };
    }
  } else {
    const v3Sql = await runSqlVerification(
      task.sql_setup || '',
      task.reference_solution,
      task.visible_tests
    );
    if (!v3Sql.passed) {
      return {
        ok: false,
        step: 'V3',
        reason: `Reference solution failed visible SQL checks: ${v3Sql.error}`,
      };
    }
  }

  // ── Step V4: Reference solution + hidden tests pass ────────────────────────
  if (language === 'python') {
    const v4Res = await runPythonInSandbox({
      code: task.reference_solution,
      tests: task.hidden_tests,
      timeoutMs: 4000,
    });
    if (!v4Res.passed) {
      return {
        ok: false,
        step: 'V4',
        reason: `Reference solution failed hidden tests: ${v4Res.stderr || v4Res.stdout}`,
      };
    }
  } else {
    const v4Sql = await runSqlVerification(
      task.sql_setup || '',
      task.reference_solution,
      task.hidden_tests
    );
    if (!v4Sql.passed) {
      return {
        ok: false,
        step: 'V4',
        reason: `Reference solution failed hidden SQL checks: ${v4Sql.error}`,
      };
    }
  }

  // ── Step V5: Starter code + visible + hidden tests FAIL ───────────────────
  if (language === 'python') {
    const combinedTests = `${task.visible_tests}\n${task.hidden_tests}`;
    const v5Res = await runPythonInSandbox({
      code: task.starter_code,
      tests: combinedTests,
      timeoutMs: 4000,
    });
    if (v5Res.passed) {
      return {
        ok: false,
        step: 'V5',
        reason: 'Starter code already passes tests (task is pre-solved).',
      };
    }
  } else {
    const combinedChecks = `${task.visible_tests}\n${task.hidden_tests}`;
    const v5Sql = await runSqlVerification(
      task.sql_setup || '',
      task.starter_code,
      combinedChecks
    );
    if (v5Sql.passed) {
      return {
        ok: false,
        step: 'V5',
        reason: 'Starter code already passes SQL checks (task is pre-solved).',
      };
    }
  }

  // ── Step V6: Solution leak check ──────────────────────────────────────────
  // The brief does not contain the reference solution (no line of the solution
  // longer than 20 characters appears in the brief).
  const solutionLines = task.reference_solution
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 20);

  for (const line of solutionLines) {
    if (task.brief.includes(line)) {
      return {
        ok: false,
        step: 'V6',
        reason: `Brief leaks reference solution code line: "${line}"`,
      };
    }
  }

  // ── Step V7: Test assertion count check ───────────────────────────────────
  // Hidden tests contain at least 3 assert lines, visible tests at least 2.
  if (language === 'python') {
    const visibleAsserts = countAssertLines(task.visible_tests);
    if (visibleAsserts < 2) {
      return {
        ok: false,
        step: 'V7',
        reason: `Visible tests must contain at least 2 assert statements (found ${visibleAsserts}).`,
      };
    }

    const hiddenAsserts = countAssertLines(task.hidden_tests);
    if (hiddenAsserts < 3) {
      return {
        ok: false,
        step: 'V7',
        reason: `Hidden tests must contain at least 3 assert statements (found ${hiddenAsserts}).`,
      };
    }
  }

  return { ok: true };
}

/**
 * Counts standalone assert statements in a Python test string.
 */
export function countAssertLines(testSource: string): number {
  return testSource
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('assert ') || l.startsWith('assert(')).length;
}

/**
 * Helper to verify SQL tasks against PGlite database.
 */
export async function runSqlVerification(
  setup: string,
  code: string,
  checks: string
): Promise<{ passed: boolean; error?: string }> {
  try {
    const { PGlite } = await import('@electric-sql/pglite');
    const { runSqlPractice, SQL_TEXT_PARSERS } = await import('@/lib/code/sql/sqlCore');
    const db = new PGlite({ parsers: SQL_TEXT_PARSERS });
    try {
      const res = await runSqlPractice(db, setup, code, checks);
      return {
        passed: res.passed,
        error: res.passed ? undefined : res.messages.join(' | '),
      };
    } finally {
      await db.close();
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { passed: false, error: msg };
  }
}
