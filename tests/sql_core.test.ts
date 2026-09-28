import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';

import { runSqlLesson, runSqlPractice, SQL_TEXT_PARSERS, type SqlDatabase } from '../src/lib/code/sql/sqlCore';

let db: SqlDatabase;
test.before(async () => {
  db = (await PGlite.create({ parsers: SQL_TEXT_PARSERS })) as unknown as SqlDatabase;
});

test('lesson SQL prints each result as a table, numbers right-aligned', async () => {
  const out = await runSqlLesson(db, `
    CREATE TABLE expenses (item text, amount numeric(8,2));
    INSERT INTO expenses VALUES ('Tea', 20), ('Metro card', 500);
    SELECT item, amount FROM expenses ORDER BY amount DESC;
    SELECT count(*) AS how_many FROM expenses;`);
  assert.equal(out, [
    ' item       | amount',
    '------------+--------',
    ' Metro card | 500.00',
    ' Tea        |  20.00',
    '(2 rows)',
    '',
    ' how_many',
    '----------',
    '        2',
    '(1 row)',
  ].join('\n'));
});

test('every run starts from an empty database, so running twice gives the same result', async () => {
  const code = 'CREATE TABLE t (n int); INSERT INTO t VALUES (1); SELECT count(*) AS c FROM t;';
  assert.equal(await runSqlLesson(db, code), await runSqlLesson(db, code));
});

test('PostgreSQL errors are shown plainly, and SQL without SELECT says so', async () => {
  assert.equal(await runSqlLesson(db, 'SELECT nope FROM missing;'), '[Error] relation "missing" does not exist');
  assert.equal(await runSqlLesson(db, 'CREATE TABLE t (n int);'), 'Done. Nothing to show: add a SELECT to see rows.');
  assert.match(await runSqlLesson(db, 'SELECT NULL AS nothing, true AS yes;'), / NULL {4}\| true/);
});

const setup = `CREATE TABLE products (name text, price numeric);
INSERT INTO products VALUES ('Pen', 10), ('Bag', 900), ('Book', 250);`;
const checks = `
SELECT count(*) = 2 AS ok, 'returns the 2 products under 500' AS msg FROM cheap;
SELECT bool_and(price < 500) AS ok, 'every row costs less than 500' AS msg FROM cheap;`;

test('a practice task passes only when every check passes', async () => {
  const good = await runSqlPractice(db, setup, 'CREATE VIEW cheap AS SELECT * FROM products WHERE price < 500;', checks);
  assert.equal(good.passed, true);
  assert.deepEqual(good.messages, ['PASS returns the 2 products under 500', 'PASS every row costs less than 500']);

  const wrong = await runSqlPractice(db, setup, 'CREATE VIEW cheap AS SELECT * FROM products WHERE price > 5;', checks);
  assert.equal(wrong.passed, false);
  assert.deepEqual(wrong.messages, ['FAIL returns the 2 products under 500', 'FAIL every row costs less than 500']);

  const broken = await runSqlPractice(db, setup, 'CREATE VIEW cheap AS SELEC * FROM products;', checks);
  assert.equal(broken.passed, false);
  assert.match(broken.messages[0], /^\[Error\] syntax error/);
});

test('a single SELECT answer is checked through the view "answer"', async () => {
  const task = `CREATE TABLE products (name text, price numeric);
INSERT INTO products VALUES ('Pen', 10), ('Bag', 900), ('Book', 250);`;
  const checks = `SELECT count(*) = 2 AS ok, 'returns 2 rows' AS msg FROM answer;`;
  const good = await runSqlPractice(db, task, '-- cheap products\nSELECT name FROM products WHERE price < 500;', checks);
  assert.equal(good.passed, true);
  assert.match(good.output, /^ name\n------\n Pen\n Book\n\(2 rows\)$/);
  const wrong = await runSqlPractice(db, task, 'SELECT name FROM products', checks);
  assert.equal(wrong.passed, false);
});

test('a run that leaves a transaction open or prepares a statement does not break the next run', async () => {
  await runSqlLesson(db, "CREATE TABLE t (n int); BEGIN; INSERT INTO t VALUES (1);");
  await runSqlLesson(db, "PREPARE q(int) AS SELECT $1 AS n; CREATE TEMP TABLE tmp (x int);");
  assert.equal(await runSqlLesson(db, "PREPARE q(int) AS SELECT $1 AS n; EXECUTE q(7);"), ' n\n---\n 7\n(1 row)');
  assert.equal(await runSqlLesson(db, "CREATE TEMP TABLE tmp (x int); SELECT count(*) AS c FROM tmp;"), ' c\n---\n 0\n(1 row)');
});

test('dates and times are shown as PostgreSQL text, with the time of day kept', async () => {
  assert.equal(
    await runSqlLesson(db, "SELECT date '2026-09-28' AS d, timestamp '2026-09-28 13:05' AS ts;"),
    ' d          | ts\n------------+---------------------\n 2026-09-28 | 2026-09-28 13:05:00\n(1 row)'
  );
});
