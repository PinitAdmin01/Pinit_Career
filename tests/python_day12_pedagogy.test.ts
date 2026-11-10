import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day12 = PYTHON_30_DAYS_CONFIGS[11];

test('Day 12 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day12.eTest), null);
  assert.equal(findForbiddenPython(day12.aTest), null);
});

test('Day 12 Practice 1: set comprehension, for-loop with set.add, and set return all pass', async () => {
  const compCode = `def unique_categories(expenses):\n    return sorted({e['category'] for e in expenses})`;
  const resPy = await executePythonSuite({ code: compCode, testSuite: day12.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: compCode, tests: day12.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const loopCode = `def unique_categories(expenses):\n    cats = set()\n    for e in expenses:\n        cats.add(e['category'])\n    return sorted(cats)`;
  const resLoop = await executePythonSuite({ code: loopCode, testSuite: day12.eTest, timeoutMs: 5000 });
  assert.equal(resLoop.allPassed, true, resLoop.error);

  const setOnlyCode = `def unique_categories(expenses):\n    return {e['category'] for e in expenses}`;
  const resSet = await executePythonSuite({ code: setOnlyCode, testSuite: day12.eTest, timeoutMs: 5000 });
  assert.equal(resSet.allPassed, true, resSet.error);
});

test('Day 12 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day12.eStarter, testSuite: day12.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day12.eStarter, tests: day12.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 12 Practice 2: tuple and list min_max returns both pass', async () => {
  const tupleCode = `def min_max(numbers):\n    return (min(numbers), max(numbers))`;
  const resPy = await executePythonSuite({ code: tupleCode, testSuite: day12.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: tupleCode, tests: day12.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const listCode = `def min_max(numbers):\n    return [min(numbers), max(numbers)]`;
  const resList = await executePythonSuite({ code: listCode, testSuite: day12.aTest, timeoutMs: 5000 });
  assert.equal(resList.allPassed, true, resList.error);
});

test('Day 12 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day12.aStarter, testSuite: day12.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day12.aStarter, tests: day12.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});
