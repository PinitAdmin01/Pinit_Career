import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day11 = PYTHON_30_DAYS_CONFIGS[10];

test('Day 11 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day11.eTest), null);
  assert.equal(findForbiddenPython(day11.aTest), null);
});

test('Day 11 Practice 1: generator sum and for-loop accumulator both pass', async () => {
  const genCode = `def total_spent(expenses):\n    return sum(e['amount'] for e in expenses)`;
  const resPy = await executePythonSuite({ code: genCode, testSuite: day11.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: genCode, tests: day11.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const loopCode = `def total_spent(expenses):\n    total = 0\n    for e in expenses:\n        total += e['amount']\n    return total`;
  const resLoop = await executePythonSuite({ code: loopCode, testSuite: day11.eTest, timeoutMs: 5000 });
  assert.equal(resLoop.allPassed, true, resLoop.error);
});

test('Day 11 Practice 1: sum(expenses) TypeError trap gets helpful diagnostic', async () => {
  const badCode = `def total_spent(expenses):\n    return sum(expenses)`;
  const resPy = await executePythonSuite({ code: badCode, testSuite: day11.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  assert.ok((resPy.error || '').includes("e['amount']"), `Got: ${resPy.error}`);
});

test('Day 11 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day11.eStarter, testSuite: day11.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day11.eStarter, tests: day11.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 11 Practice 2: returning matching dicts or matching item names both pass', async () => {
  const dictCode = `def by_category(expenses, category):\n    return [e for e in expenses if e['category'] == category]`;
  const resPy = await executePythonSuite({ code: dictCode, testSuite: day11.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: dictCode, tests: day11.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const itemCode = `def by_category(expenses, category):\n    return [e['item'] for e in expenses if e['category'] == category]`;
  const resItem = await executePythonSuite({ code: itemCode, testSuite: day11.aTest, timeoutMs: 5000 });
  assert.equal(resItem.allPassed, true, resItem.error);
});

test('Day 11 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day11.aStarter, testSuite: day11.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day11.aStarter, tests: day11.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});
