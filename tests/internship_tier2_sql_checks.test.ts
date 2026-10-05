import test from 'node:test';
import assert from 'node:assert/strict';
import { getDeterministicTier2Tasks } from './fixtures/deterministicInternshipData';
import { validateGeneratedTask, runSqlVerification } from '../src/lib/internships/validateTask';

test('W-00-2: Tier 2 SQL tasks compare values strictly and reject lazy/cheat queries', async () => {
  const dummyStories = [
    { id: 'US-01', title: 'Story 1', persona: 'Doctor', description: 'Brief', acceptanceCriteria: ['AC1'] },
    { id: 'US-02', title: 'Story 2', persona: 'Doctor', description: 'Brief', acceptanceCriteria: ['AC1'] },
    { id: 'US-03', title: 'Story 3', persona: 'Doctor', description: 'Brief', acceptanceCriteria: ['AC1'] },
    { id: 'US-04', title: 'Story 4', persona: 'Doctor', description: 'Brief', acceptanceCriteria: ['AC1'] },
  ];

  const tasks = getDeterministicTier2Tasks(dummyStories);
  const sqlTasks = tasks.filter((t) => t.language === 'sql');

  assert.equal(sqlTasks.length, 4, 'There are exactly 4 SQL tasks in Tier 2 deterministic tasks');

  // Table names and cheat queries for each SQL task (seq 2, 4, 6, 8)
  const cheatQueries: Record<number, string> = {
    2: 'SELECT * FROM patients LIMIT 2;',
    4: 'SELECT * FROM doctors LIMIT 2;',
    6: 'SELECT * FROM patients LIMIT 1;',
    8: 'SELECT * FROM transactions LIMIT 2;',
  };

  for (const item of sqlTasks) {
    const { seq, task } = item;
    const combinedTests = `${task.visible_tests}\n${task.hidden_tests}`;

    // 1. validateGeneratedTask(task, 'sql') returns ok
    const valResult = await validateGeneratedTask(task, 'sql');
    assert.equal(
      valResult.ok,
      true,
      `Seq ${seq} task must pass pipeline validation V1-V7 (failed: ${!valResult.ok ? valResult.reason : ''})`
    );

    // 2. Reference solution passes
    const refResult = await runSqlVerification(task.sql_setup || '', task.reference_solution, combinedTests);
    assert.equal(refResult.passed, true, `Seq ${seq} reference solution must pass tests: ${refResult.error}`);

    // 3. Cheat query SELECT * FROM <table> LIMIT n fails
    const cheatSql = cheatQueries[seq];
    assert.ok(cheatSql, `Seq ${seq} must have a cheat query mapped`);
    const cheatResult = await runSqlVerification(task.sql_setup || '', cheatSql, combinedTests);
    assert.equal(cheatResult.passed, false, `Seq ${seq} cheat query '${cheatSql}' must fail`);

    // 4. Starter code fails
    const starterResult = await runSqlVerification(task.sql_setup || '', task.starter_code, combinedTests);
    assert.equal(starterResult.passed, false, `Seq ${seq} starter code must fail`);
  }
});

test('F-10: validateGeneratedTask rejects SQL tasks where lazy query passes weak checks (V8)', async () => {
  const weakTask = {
    title: 'Find expensive products',
    brief: 'Return products with price over 100 in the products table.',
    sql_setup: `
      CREATE TABLE products (id INT, name TEXT, price INT);
      INSERT INTO products VALUES (1, 'Expensive 1', 150), (2, 'Expensive 2', 200), (3, 'Cheap', 10);
    `,
    starter_code: 'SELECT * FROM products WHERE price > 0;',
    visible_tests: "SELECT count(*) = 2 AS ok, 'Count matches' AS msg FROM answer;",
    hidden_tests: "SELECT count(*) = 2 AS ok, 'Count matches' AS msg FROM answer;", // WEAK: count-only!
    reference_solution: 'SELECT * FROM products WHERE price > 100;',
    skills: ['SQL'],
  };

  const res = await validateGeneratedTask(weakTask as any, 'sql');
  assert.equal(res.ok, false, 'Task with weak SQL checks must be rejected');
  if (!res.ok) {
    assert.equal(res.step, 'V8', `Expected failure at V8, got: ${res.step} - ${res.reason}`);
  }
});
