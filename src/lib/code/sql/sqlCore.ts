/**
 * Runs SQL lessons and practice tasks on PostgreSQL (PGlite: real PostgreSQL compiled to WebAssembly).
 * The browser uses it inside public/sql/sql-worker.js (built from sqlWorker.ts); tests use it in Node.
 * Both run exactly this code, so what the tests check is what students see.
 */

/** The small part of PGlite this file needs. */
export interface SqlField {
  name: string;
  dataTypeID: number;
}
export interface SqlResult {
  fields: SqlField[];
  rows: Record<string, unknown>[];
}
export interface SqlDatabase {
  exec(sql: string): Promise<SqlResult[]>;
}

/** PostgreSQL type ids of number columns, shown right-aligned like psql does. */
const NUMBER_TYPES = new Set([20, 21, 23, 26, 700, 701, 1700]);

function cellText(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/** One result as a table, for example:
 *   name | price
 *  ------+-------
 *   Bus  | 45.50
 *  (1 row)
 */
export function formatTable(result: SqlResult): string {
  const names = result.fields.map((f) => f.name);
  const rows = result.rows.map((row) => result.fields.map((f) => cellText(row[f.name])));
  const widths = names.map((n, i) => Math.max(n.length, ...rows.map((r) => r[i].length)));
  const isNumber = result.fields.map((f) => NUMBER_TYPES.has(f.dataTypeID));
  const line = (cells: string[], alignNumbers: boolean) =>
    ' ' + cells.map((c, i) => (alignNumbers && isNumber[i] ? c.padStart(widths[i]) : c.padEnd(widths[i]))).join(' | ').replace(/\s+$/, '');
  const out = [line(names, false), '-' + widths.map((w) => '-'.repeat(w)).join('-+-') + '-'];
  for (const r of rows) out.push(line(r, true));
  out.push(`(${rows.length} ${rows.length === 1 ? 'row' : 'rows'})`);
  return out.join('\n');
}

/** Every run starts from an empty database, so pressing Run twice gives the same result. */
export async function resetDatabase(db: SqlDatabase): Promise<void> {
  await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
}

function errorText(err: unknown): string {
  return String((err as Error)?.message ?? err).trim();
}

/**
 * Runs lesson code and returns what the lesson page shows: one table for every statement that
 * returns rows, separated by a blank line, or "[Error] ..." when PostgreSQL rejects a statement.
 */
export async function runSqlLesson(db: SqlDatabase, code: string): Promise<string> {
  await resetDatabase(db);
  try {
    const results = await db.exec(code);
    const tables = results.filter((r) => r.fields.length > 0).map(formatTable);
    return tables.length ? tables.join('\n\n') : 'Done. Nothing to show: add a SELECT to see rows.';
  } catch (err) {
    return `[Error] ${errorText(err)}`;
  }
}

export interface SqlPracticeResult {
  passed: boolean;
  /** One line per check: what was checked, and whether it passed. */
  messages: string[];
  /** The student's own result tables (or error), shown in the terminal. */
  output: string;
}

/**
 * Grades a practice task. `setup` creates the tables and rows, then the student's SQL runs, then
 * each check query runs. A check returns one row with a boolean `ok` and a text `msg`:
 *   SELECT count(*) = 2 AS ok, 'Returns the 2 cheap products' AS msg FROM answer;
 * The task passes only when every check returns ok = true.
 */
export async function runSqlPractice(db: SqlDatabase, setup: string, studentSql: string, checks: string): Promise<SqlPracticeResult> {
  await resetDatabase(db);
  if (setup.trim()) await db.exec(setup);
  let output: string;
  try {
    const results = await db.exec(studentSql);
    output = results.filter((r) => r.fields.length > 0).map(formatTable).join('\n\n') || 'Your SQL ran.';
  } catch (err) {
    const message = `[Error] ${errorText(err)}`;
    return { passed: false, messages: [message], output: message };
  }
  const messages: string[] = [];
  let passed = true;
  let results: SqlResult[];
  try {
    results = await db.exec(checks);
  } catch (err) {
    return { passed: false, messages: [`[Check failed] ${errorText(err)}`], output };
  }
  for (const r of results.filter((x) => x.fields.some((f) => f.name === 'ok'))) {
    const row = r.rows[0] ?? {};
    const ok = row.ok === true;
    passed = passed && ok;
    messages.push(`${ok ? 'PASS' : 'FAIL'} ${cellText(row.msg ?? 'check')}`);
  }
  if (messages.length === 0) return { passed: false, messages: ['[Check failed] no checks ran'], output };
  return { passed, messages, output };
}
