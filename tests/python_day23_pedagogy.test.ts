import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day23 = PYTHON_30_DAYS_CONFIGS[22];

test('Day 23 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day23.eTest), null);
  assert.equal(findForbiddenPython(day23.aTest), null);
});

test('Day 23 Practice 1: sort_by_date passes and in-place .sort() or missing reverse=True get diagnostics', async () => {
  const code = `def sort_by_date(expenses):\n    return sorted(expenses, key=lambda e: e['date'], reverse=True)`;
  const resPy = await executePythonSuite({ code, testSuite: day23.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day23.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const noRev = `def sort_by_date(expenses):\n    return sorted(expenses, key=lambda e: e['date'])`;
  const resNoRev = await executePythonSuite({ code: noRev, testSuite: day23.eTest, timeoutMs: 5000 });
  assert.equal(resNoRev.allPassed, false);
  assert.ok((resNoRev.error || '').includes('reverse=True'), `Got: ${resNoRev.error}`);
});

test('Day 23 Practice 2: group_by_category passes with if-not-in or setdefault, and appending dict gets diagnostic', async () => {
  const ifCode = `def group_by_category(expenses):\n    groups = {}\n    for e in expenses:\n        cat = e['category']\n        if cat not in groups:\n            groups[cat] = []\n        groups[cat].append(e['item'])\n    return groups`;
  const resPy = await executePythonSuite({ code: ifCode, testSuite: day23.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: ifCode, tests: day23.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const badDict = `def group_by_category(expenses):\n    groups = {}\n    for e in expenses:\n        groups.setdefault(e['category'], []).append(e)\n    return groups`;
  const resBad = await executePythonSuite({ code: badDict, testSuite: day23.aTest, timeoutMs: 5000 });
  assert.equal(resBad.allPassed, false);
  assert.ok((resBad.error || '').includes("e['item']"), `Got: ${resBad.error}`);
});
