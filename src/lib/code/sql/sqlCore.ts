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

/**
 * Keep dates, times and JSON as the text PostgreSQL sends (like psql shows them), instead of JavaScript
 * Date objects, which drop the time of day and depend on the viewer's time zone.
 * Pass as PGlite.create({ parsers: SQL_TEXT_PARSERS }).
 */
const keepText = (value: string) => value;
export const SQL_TEXT_PARSERS: Record<number, (value: string) => string> = {
  1082: keepText, // date
  1083: keepText, // time
  1114: keepText, // timestamp
  1184: keepText, // timestamptz
  1186: keepText, // interval
  114: keepText, // json
  3802: keepText, // jsonb
};

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

/**
 * Every run starts from an empty database, so pressing Run twice gives the same result: close any
 * transaction the last run left open, forget session state (prepared statements, temporary tables,
 * settings, SET ROLE), remove roles a run created, and drop every table, view and index.
 */
export async function resetDatabase(db: SqlDatabase): Promise<void> {
  await db.exec('ROLLBACK');
  await db.exec('DISCARD ALL');
  // Roles belong to the whole server, not the schema, so remove the ones a lesson created.
  await db.exec(`DO $$
    DECLARE r text;
    BEGIN
      FOR r IN SELECT rolname FROM pg_roles WHERE rolname NOT LIKE 'pg\\_%' AND rolname <> current_user LOOP
        EXECUTE format('DROP OWNED BY %I', r);
        EXECUTE format('DROP ROLE %I', r);
      END LOOP;
    END $$;`);
  await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
}

function errorText(err: unknown): string {
  return String((err as Error)?.message ?? err).trim();
}

/**
 * Splits SQL text into statements at semicolons, ignoring semicolons inside quotes ('...', "..."),
 * dollar quotes ($$...$$, $tag$...$tag$) and comments (-- and /* ... *\/). Empty statements are dropped.
 */
export function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];
    if (ch === '-' && next === '-') {
      const end = sql.indexOf('\n', i);
      const stop = end === -1 ? sql.length : end;
      current += sql.slice(i, stop);
      i = stop;
    } else if (ch === '/' && next === '*') {
      const end = sql.indexOf('*/', i + 2);
      const stop = end === -1 ? sql.length : end + 2;
      current += sql.slice(i, stop);
      i = stop;
    } else if (ch === "'" || ch === '"') {
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === ch && sql[j + 1] === ch) j += 2;
        else if (sql[j] === ch) break;
        else j += 1;
      }
      current += sql.slice(i, j + 1);
      i = j + 1;
    } else if (ch === '$' && /^\$[A-Za-z_]*\$/.test(sql.slice(i))) {
      const tag = sql.slice(i).match(/^\$[A-Za-z_]*\$/)![0];
      const end = sql.indexOf(tag, i + tag.length);
      const stop = end === -1 ? sql.length : end + tag.length;
      current += sql.slice(i, stop);
      i = stop;
    } else if (ch === ';') {
      if (current.trim()) statements.push(current.trim());
      current = '';
      i += 1;
    } else {
      current += ch;
      i += 1;
    }
  }
  if (current.trim()) statements.push(current.trim());
  return statements.filter((s) => s.split('\n').some((line) => line.trim() && !line.trim().startsWith('--')));
}

/**
 * Runs lesson code one statement at a time, like psql running a file (so BEGIN ... ROLLBACK only
 * undoes what came after BEGIN), and returns what the lesson page shows: one table for every
 * statement that returns rows, separated by a blank line. If PostgreSQL rejects a statement, the
 * run stops there and "[Error] ..." is shown after the results so far.
 */
export async function runSqlLesson(db: SqlDatabase, code: string): Promise<string> {
  await resetDatabase(db);
  const shown: string[] = [];
  for (const statement of splitSqlStatements(code)) {
    try {
      const results = await db.exec(statement);
      for (const r of results) if (r.fields.length > 0) shown.push(formatTable(r));
    } catch (err) {
      shown.push(`[Error] ${errorText(err)}`);
      return shown.join('\n\n');
    }
  }
  return shown.length ? shown.join('\n\n') : 'Done. Nothing to show: add a SELECT to see rows.';
}

export interface SqlPracticeResult {
  passed: boolean;
  /** One line per check: what was checked, and whether it passed. */
  messages: string[];
  /** The student's own result tables (or error), shown in the terminal. */
  output: string;
}

/** A practice task's test suite is its setup SQL, this marker line, then its check queries. */
export const SQL_CHECKS_MARKER = '-- CHECKS --';

export function splitSqlTask(testSuite: string | undefined | null): { setup: string; checks: string } | null {
  if (!testSuite || !testSuite.includes(SQL_CHECKS_MARKER)) return null;
  const [setup, checks] = testSuite.split(SQL_CHECKS_MARKER);
  return { setup: setup.trim(), checks: (checks || '').trim() };
}

/** A single SELECT (or WITH ... SELECT) answer, without comments and the final semicolon; otherwise null. */
export function singleSelect(sql: string): string | null {
  const clean = sql
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join('\n')
    .trim()
    .replace(/;\s*$/, '')
    .trim();
  return /^(select|with)\b/i.test(clean) && !clean.includes(';') ? clean : null;
}

/**
 * Grades a practice task. `setup` creates the tables and rows, then the student's SQL runs, then
 * each check query runs. When the student's answer is a single SELECT, it becomes the view
 * `answer`, so checks can look at the rows it returns. A check returns one row with a boolean
 * `ok` and a text `msg`:
 *   SELECT count(*) = 2 AS ok, 'Returns the 2 cheap products' AS msg FROM answer;
 * The task passes only when every check returns ok = true.
 */
export async function runSqlPractice(db: SqlDatabase, setup: string, studentSql: string, checks: string): Promise<SqlPracticeResult> {
  await resetDatabase(db);
  if (setup.trim()) await db.exec(setup);
  let output: string;
  try {
    const select = singleSelect(studentSql);
    if (select) {
      await db.exec(`CREATE VIEW answer AS\n${select}`);
      const [shown] = await db.exec('SELECT * FROM answer');
      output = formatTable(shown);
    } else {
      // One statement at a time, like the lesson runner and psql.
      const tables: string[] = [];
      for (const statement of splitSqlStatements(studentSql)) {
        for (const r of await db.exec(statement)) if (r.fields.length > 0) tables.push(formatTable(r));
      }
      output = tables.join('\n\n') || 'Your SQL ran.';
    }
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
