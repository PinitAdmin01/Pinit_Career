import { loadPyodide, type PyodideInterface } from 'pyodide';
import type { SqlDatabase } from '@/lib/code/sql/sqlCore';
import type { Binding, StepBaseSpec } from '@/lib/types/lessonVisual';
import type { LongLessonPart } from '@/lib/data/longLessonTypes';
import { runPythonTrace } from '../trace/runPythonTrace';
import { runSqlCapture, getSharedSqlDb } from '../trace/runSqlCapture';
import { applyEdit } from './applyEdit';
import { resolveBinding } from './resolveBinding';
import type { FillOptions, FillRunContext, RunResult } from './types';

let sharedPyodidePromise: Promise<PyodideInterface> | null = null;

export function getSharedPyodide(): Promise<PyodideInterface> {
  if (!sharedPyodidePromise) {
    sharedPyodidePromise = loadPyodide();
  }
  return sharedPyodidePromise;
}

export function detectLanguage(part: LongLessonPart, options?: FillOptions): 'python' | 'sql' {
  if (options?.language) return options.language;
  const code = part.code ?? '';
  // Check for SQL statements (avoid matching Python `update = ...` or `with ...:`)
  if (
    /^\s*(SELECT\s+|INSERT\s+INTO\s+|CREATE\s+(?:TEMP\s+|TEMPORARY\s+|UNIQUE\s+)?(?:TABLE|VIEW|INDEX|TRIGGER)\b|UPDATE\s+[A-Za-z_]\w*\s+SET\b|DELETE\s+FROM\s+|DROP\s+(?:TABLE|VIEW|INDEX|TRIGGER)\b|ALTER\s+TABLE\s+|WITH\s+(?:RECURSIVE\s+)?[A-Za-z_]\w*\s+AS\s*\(|BEGIN\s*(?:TRANSACTION|;)|COMMIT\b|ROLLBACK\b|PRAGMA\b|EXPLAIN\b)/im.test(
      code
    ) &&
    !/^\s*(def |class |import |from\s+\w+\s+import\b|print\s*\(|for\s+\w+\s+in\b)/m.test(code)
  ) {
    return 'sql';
  }
  return 'python';
}

export async function createFillRunContext(
  part: LongLessonPart,
  options?: FillOptions
): Promise<FillRunContext> {
  const lang = detectLanguage(part, options);
  const baseCode = part.code ?? '';

  let pyodideInstance: PyodideInterface | undefined = options?.pyodide;
  let dbInstance: SqlDatabase | undefined = options?.db;

  if (lang === 'python' && !pyodideInstance) {
    pyodideInstance = await getSharedPyodide();
  } else if (lang === 'sql' && !dbInstance) {
    dbInstance = await getSharedSqlDb();
  }

  const runCache = new Map<string, RunResult>();

  async function executeCode(code: string): Promise<RunResult> {
    if (runCache.has(code)) {
      return runCache.get(code)!;
    }

    if (lang === 'python') {
      const res = await runPythonTrace(code, pyodideInstance!);
      const result: RunResult = {
        language: 'python',
        output: res.output,
        error: res.error,
        events: res.events,
      };
      runCache.set(code, result);
      return result;
    } else {
      const res = await runSqlCapture(code, dbInstance!);
      const result: RunResult = {
        language: 'sql',
        output: res.output,
        error: res.error,
        tables: res.tables,
      };
      runCache.set(code, result);
      return result;
    }
  }

  let baseRunPromise: Promise<RunResult> | null = null;
  function getBaseRun(): Promise<RunResult> {
    if (!baseRunPromise) {
      baseRunPromise = executeCode(baseCode);
    }
    return baseRunPromise;
  }

  return {
    part,
    options,
    getBaseRun,
    async getRunForStep(step: StepBaseSpec): Promise<RunResult> {
      if (step.edit) {
        const editedCode = applyEdit(baseCode, step.edit);
        return executeCode(editedCode);
      }
      return getBaseRun();
    },
    async runSnippet(code: string): Promise<RunResult> {
      return executeCode(code);
    },
    resolveBinding(binding: Binding, step: StepBaseSpec, runResult?: RunResult): string {
      if (!runResult) {
        throw new Error(
          `Cannot resolve binding without run result at step "${step.at}"`
        );
      }
      return resolveBinding(binding, step, runResult);
    },
  };
}
