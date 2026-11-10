import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day25 = PYTHON_30_DAYS_CONFIGS[24];

test('Day 25 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day25.eTest), null);
  assert.equal(findForbiddenPython(day25.aTest), null);
});

test('Day 25 Practice 1: summary passes and empty max() crash gets helpful diagnostic', async () => {
  const code = `def summary(expenses):\n    biggest = max(expenses, key=lambda e: e['amount'])['item'] if expenses else None\n    return {'total': sum(e['amount'] for e in expenses), 'count': len(expenses), 'biggest': biggest}`;
  const resPy = await executePythonSuite({ code, testSuite: day25.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day25.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const crashEmpty = `def summary(expenses):\n    biggest = max(expenses, key=lambda e: e['amount'])['item']\n    return {'total': sum(e['amount'] for e in expenses), 'count': len(expenses), 'biggest': biggest}`;
  const resCrash = await executePythonSuite({ code: crashEmpty, testSuite: day25.eTest, timeoutMs: 5000 });
  assert.equal(resCrash.allPassed, false);
  assert.ok((resCrash.error || '').includes('empty'), `Got: ${resCrash.error}`);
});

test('Day 25 Practice 2: category_totals passes and unfinished starter fails', async () => {
  const code = `def category_totals(expenses):\n    totals = {}\n    for e in expenses:\n        totals[e['category']] = totals.get(e['category'], 0) + e['amount']\n    return totals`;
  const resPy = await executePythonSuite({ code, testSuite: day25.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day25.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const resFail = await executePythonSuite({ code: day25.aStarter, testSuite: day25.aTest, timeoutMs: 5000 });
  assert.equal(resFail.allPassed, false);
});
