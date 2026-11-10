import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day19 = PYTHON_30_DAYS_CONFIGS[18];

test('Day 19 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day19.eTest), null);
  assert.equal(findForbiddenPython(day19.aTest), null);
});

test('Day 19 Practice 1: Expense.__str__ passes and printing instead of returning gets helpful diagnostic', async () => {
  const code = `class Expense:\n    def __init__(self, item, amount):\n        self.item = item\n        self.amount = amount\n    def __str__(self):\n        return f'{self.item} (Rs {self.amount})'`;
  const resPy = await executePythonSuite({ code, testSuite: day19.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day19.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const printStr = `class Expense:\n    def __init__(self, item, amount):\n        self.item = item\n        self.amount = amount\n    def __str__(self):\n        print(f'{self.item} (Rs {self.amount})')`;
  const resPrint = await executePythonSuite({ code: printStr, testSuite: day19.eTest, timeoutMs: 5000 });
  assert.equal(resPrint.allPassed, false);
  assert.ok((resPrint.error || '').includes('must return a string'), `Got: ${resPrint.error}`);
});

test('Day 19 Practice 2: Subscription(Expense) passes and unfinished starter fails', async () => {
  const code = `class Expense:\n    def __init__(self, item, amount):\n        self.item = item\n        self.amount = amount\nclass Subscription(Expense):\n    def yearly_cost(self):\n        return self.amount * 12`;
  const resPy = await executePythonSuite({ code, testSuite: day19.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day19.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const resFail = await executePythonSuite({ code: day19.aStarter, testSuite: day19.aTest, timeoutMs: 5000 });
  assert.equal(resFail.allPassed, false);
});
