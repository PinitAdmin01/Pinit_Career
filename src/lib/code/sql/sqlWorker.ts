/// <reference lib="webworker" />
/**
 * Web worker that runs SQL on PGlite. Bundled into public/sql/sql-worker.js by
 * scripts/utils/build-sql-worker.cjs, next to PGlite's .wasm and .data files. One database per
 * worker, reset before every run; the page terminates the worker on a timeout and starts a new one.
 */
import { PGlite } from '@electric-sql/pglite';
import { runSqlLesson, runSqlPractice, SQL_TEXT_PARSERS, type SqlDatabase } from './sqlCore';

export type SqlWorkerRequest =
  | { id: number; kind: 'lesson'; code: string }
  | { id: number; kind: 'practice'; setup: string; code: string; checks: string };

let dbReady: Promise<PGlite> | null = null;

function getDb(): Promise<PGlite> {
  if (!dbReady) dbReady = PGlite.create({ parsers: SQL_TEXT_PARSERS });
  return dbReady;
}

self.onmessage = async (event: MessageEvent<SqlWorkerRequest>) => {
  const request = event.data;
  try {
    const db = (await getDb()) as unknown as SqlDatabase;
    if (request.kind === 'lesson') {
      self.postMessage({ id: request.id, ok: true, output: await runSqlLesson(db, request.code) });
    } else {
      const result = await runSqlPractice(db, request.setup, request.code, request.checks);
      self.postMessage({ id: request.id, ok: true, ...result });
    }
  } catch (err) {
    self.postMessage({ id: request.id, ok: false, error: String((err as Error)?.message ?? err) });
  }
};
