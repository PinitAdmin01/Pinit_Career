import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day18 = PYTHON_30_DAYS_CONFIGS[17];

test('Day 18 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day18.eTest), null);
  assert.equal(findForbiddenPython(day18.aTest), null);
});

test('Day 18 Practice 1: Expense class passes and unfinished starter fails', async () => {
  const code = `class Expense:\n    def __init__(self, item, amount):\n        self.item = item\n        self.amount = amount\n    def label(self):\n        return f'{self.item}: {self.amount}'`;
  const resPy = await executePythonSuite({ code, testSuite: day18.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day18.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const resFail = await executePythonSuite({ code: day18.eStarter, testSuite: day18.eTest, timeoutMs: 5000 });
  assert.equal(resFail.allPassed, false);
});

test('Day 18 Practice 2: Wallet class passes and negative balance trap gets diagnostic', async () => {
  const code = `class Wallet:\n    def __init__(self, balance):\n        self.balance = balance\n    def spend(self, amount):\n        if amount > self.balance:\n            return False\n        self.balance -= amount\n        return True`;
  const resPy = await executePythonSuite({ code, testSuite: day18.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day18.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const badSpend = `class Wallet:\n    def __init__(self, balance):\n        self.balance = balance\n    def spend(self, amount):\n        self.balance -= amount\n        return self.balance >= 0`;
  const resBad = await executePythonSuite({ code: badSpend, testSuite: day18.aTest, timeoutMs: 5000 });
  assert.equal(resBad.allPassed, false);
  assert.ok((resBad.error || '').includes('do not subtract'), `Got: ${resBad.error}`);
});
