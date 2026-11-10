import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day24 = PYTHON_30_DAYS_CONFIGS[23];

test('Day 24 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day24.eTest), null);
  assert.equal(findForbiddenPython(day24.aTest), null);
});

test('Day 24 Practice 1: add_expense passes and missing .strip() gets diagnostic', async () => {
  const code = `def add_expense(expenses, item, amount, category, date):\n    new = {'id': len(expenses) + 1, 'item': item.strip(), 'amount': amount, 'category': category.strip(), 'date': date}\n    return expenses + [new]`;
  const resPy = await executePythonSuite({ code, testSuite: day24.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day24.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const noStrip = `def add_expense(expenses, item, amount, category, date):\n    new = {'id': len(expenses) + 1, 'item': item, 'amount': amount, 'category': category, 'date': date}\n    return expenses + [new]`;
  const resNoStrip = await executePythonSuite({ code: noStrip, testSuite: day24.eTest, timeoutMs: 5000 });
  assert.equal(resNoStrip.allPassed, false);
  assert.ok((resNoStrip.error || '').includes('strip()'), `Got: ${resNoStrip.error}`);
});

test('Day 24 Practice 2: format_expense passes and missing :.2f gets diagnostic', async () => {
  const code = `def format_expense(e):\n    return f"{e['item']} - Rs {e['amount']:.2f} ({e['category']})"`;
  const resPy = await executePythonSuite({ code, testSuite: day24.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day24.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const noFmt = `def format_expense(e):\n    return f"{e['item']} - Rs {e['amount']} ({e['category']})"`;
  const resNoFmt = await executePythonSuite({ code: noFmt, testSuite: day24.aTest, timeoutMs: 5000 });
  assert.equal(resNoFmt.allPassed, false);
  assert.ok((resNoFmt.error || '').includes(':.2f'), `Got: ${resNoFmt.error}`);
});
