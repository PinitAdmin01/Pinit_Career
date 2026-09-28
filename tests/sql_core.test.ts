import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';

import { runSqlLesson, runSqlPractice, type SqlDatabase } from '../src/lib/code/sql/sqlCore';

let db: SqlDatabase;
test.before(async () => {
  db = (await PGlite.create()) as unknown as SqlDatabase;
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
