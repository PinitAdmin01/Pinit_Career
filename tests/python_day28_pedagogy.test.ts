import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day28 = PYTHON_30_DAYS_CONFIGS[27];

test('Day 28 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day28.eTest), null);
  assert.equal(findForbiddenPython(day28.aTest), null);
});

test('Day 28 Practice 1: total_amount bug fix passes and unfixed starter gets diagnostic', async () => {
  const code = `def total_amount(expenses):\n    total = 0\n    for i in range(0, len(expenses)):\n        total = total + expenses[i]['amount']\n    return total`;
  const resPy = await executePythonSuite({ code, testSuite: day28.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day28.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const resStarter = await executePythonSuite({ code: day28.eStarter, testSuite: day28.eTest, timeoutMs: 5000 });
  assert.equal(resStarter.allPassed, false);
  assert.ok((resStarter.error || '').includes('skips index 0'), `Got: ${resStarter.error}`);
});

test('Day 28 Practice 2: first_invalid passes and < 0 instead of <= 0 gets diagnostic', async () => {
  const code = `def first_invalid(expenses):\n    for e in expenses:\n        if e['amount'] <= 0:\n            return e\n    return None`;
  const resPy = await executePythonSuite({ code, testSuite: day28.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day28.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const ltZero = `def first_invalid(expenses):\n    for e in expenses:\n        if e['amount'] < 0:\n            return e\n    return None`;
  const resLt = await executePythonSuite({ code: ltZero, testSuite: day28.aTest, timeoutMs: 5000 });
  assert.equal(resLt.allPassed, false);
  assert.ok((resLt.error || '').includes('<= 0'), `Got: ${resLt.error}`);
});
