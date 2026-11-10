import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day27 = PYTHON_30_DAYS_CONFIGS[26];

test('Day 27 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day27.eTest), null);
  assert.equal(findForbiddenPython(day27.aTest), null);
});

test('Day 27 Practice 1: validate_expense passes and None <= 0 TypeError gets diagnostic', async () => {
  const code = `def validate_expense(data):\n    errors = []\n    if not str(data.get('item', '')).strip():\n        errors.append('item is required')\n    amount = data.get('amount')\n    if not isinstance(amount, (int, float)) or amount <= 0:\n        errors.append('amount must be more than 0')\n    return errors`;
  const resPy = await executePythonSuite({ code, testSuite: day27.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day27.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const noneErr = `def validate_expense(data):\n    errors = []\n    if not data.get('item', '').strip(): errors.append('item is required')\n    if data.get('amount') <= 0: errors.append('amount must be more than 0')\n    return errors`;
  const resErr = await executePythonSuite({ code: noneErr, testSuite: day27.eTest, timeoutMs: 5000 });
  assert.equal(resErr.allPassed, false);
  assert.ok((resErr.error || '').includes('TypeError'), `Got: ${resErr.error}`);
});

test('Day 27 Practice 2: paginate passes and 0-indexed page mistake gets diagnostic', async () => {
  const code = `def paginate(items, page, size):\n    start = (page - 1) * size\n    return items[start:start + size]`;
  const resPy = await executePythonSuite({ code, testSuite: day27.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day27.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const offByOne = `def paginate(items, page, size):\n    start = page * size\n    return items[start:start + size]`;
  const resOff = await executePythonSuite({ code: offByOne, testSuite: day27.aTest, timeoutMs: 5000 });
  assert.equal(resOff.allPassed, false);
  assert.ok((resOff.error || '').includes('(page - 1) * size'), `Got: ${resOff.error}`);
});
