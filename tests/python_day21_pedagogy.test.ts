import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day21 = PYTHON_30_DAYS_CONFIGS[20];

test('Day 21 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day21.eTest), null);
  assert.equal(findForbiddenPython(day21.aTest), null);
});

test('Day 21 Practice 1: is_valid_amount passes with or without bool subclass check', async () => {
  const fullCode = `def is_valid_amount(value):\n    return isinstance(value, (int, float)) and not isinstance(value, bool) and value > 0`;
  const resPy = await executePythonSuite({ code: fullCode, testSuite: day21.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: fullCode, tests: day21.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const simpleCode = `def is_valid_amount(value):\n    return isinstance(value, (int, float)) and value > 0`;
  const resSimple = await executePythonSuite({ code: simpleCode, testSuite: day21.eTest, timeoutMs: 5000 });
  assert.equal(resSimple.allPassed, true, resSimple.error);
});

test('Day 21 Practice 1: unfinished starter fails', async () => {
  const resPy = await executePythonSuite({ code: day21.eStarter, testSuite: day21.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day21.eStarter, tests: day21.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 21 Practice 2: check_equal passes with raise or assert, and swapped message gets diagnostic', async () => {
  const raiseCode = `def check_equal(actual, expected):\n    if actual != expected:\n        raise AssertionError(f'Expected {expected} but got {actual}')\n    return True`;
  const resPy = await executePythonSuite({ code: raiseCode, testSuite: day21.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: raiseCode, tests: day21.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const assertCode = `def check_equal(actual, expected):\n    assert actual == expected, f'Expected {expected} but got {actual}'\n    return True`;
  const resAss = await executePythonSuite({ code: assertCode, testSuite: day21.aTest, timeoutMs: 5000 });
  assert.equal(resAss.allPassed, true, resAss.error);

  const swapped = `def check_equal(actual, expected):\n    if actual != expected:\n        raise AssertionError(f'Expected {actual} but got {expected}')\n    return True`;
  const resSwap = await executePythonSuite({ code: swapped, testSuite: day21.aTest, timeoutMs: 5000 });
  assert.equal(resSwap.allPassed, false);
  assert.ok((resSwap.error || '').includes('swapped'), `Got: ${resSwap.error}`);
});
