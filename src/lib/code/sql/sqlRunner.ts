'use client';

import type { SqlPracticeResult } from './sqlCore';

/**
 * Runs SQL in the browser on PostgreSQL (PGlite) inside a web worker (public/sql/sql-worker.js).
 * The first run downloads and starts PostgreSQL, which takes a few seconds.
 * A run that takes too long (for example an endless recursive query) is stopped.
 */
let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, (data: any) => void>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker('/sql/sql-worker.js', { type: 'module' });
    worker.onmessage = (event: MessageEvent<any>) => {
      const resolve = pending.get(event.data?.id);
      if (resolve) {
        pending.delete(event.data.id);
        resolve(event.data);
      }
    };
  }
  return worker;
}

function reset(message: string) {
  worker?.terminate();
  worker = null;
  for (const resolve of pending.values()) resolve({ ok: false, error: message });
  pending.clear();
}

function send(payload: Record<string, unknown>, timeoutMs: number): Promise<any> {
  const id = nextId++;
  return new Promise((resolve) => {
    const timer = setTimeout(() => reset('Your SQL took too long and was stopped. Check for a query that never ends.'), timeoutMs);
    pending.set(id, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
    getWorker().postMessage({ id, ...payload });
  });
}

/** Runs lesson SQL and returns the text the lesson shows (tables, or "[Error] ..."). */
export async function runSqlInBrowser(code: string, timeoutMs = 30000): Promise<string> {
  const data = await send({ kind: 'lesson', code }, timeoutMs);
  return data.ok ? data.output : `[Error] ${data.error}`;
}

/** Grades a SQL practice task: setup, then the student's SQL, then the checks. */
export async function gradeSqlInBrowser(setup: string, code: string, checks: string, timeoutMs = 30000): Promise<SqlPracticeResult> {
  const data = await send({ kind: 'practice', setup, code, checks }, timeoutMs);
  if (!data.ok) return { passed: false, messages: [`[Error] ${data.error}`], output: `[Error] ${data.error}` };
  return { passed: data.passed, messages: data.messages, output: data.output };
}
