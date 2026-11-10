import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day9 = PYTHON_30_DAYS_CONFIGS[8];

test('Day 9 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day9.eTest), null);
  assert.equal(findForbiddenPython(day9.aTest), null);
});

test('Day 9 Practice 1: list comprehension and for-loop both pass in Pyodide and Server', async () => {
  const compCode = `def double_all(numbers):\n    return [n * 2 for n in numbers]`;
  const resPy = await executePythonSuite({ code: compCode, testSuite: day9.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: compCode, tests: day9.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const loopCode = `def double_all(numbers):\n    result = []\n    for n in numbers:\n        result.append(n * 2)\n    return result`;
  const resLoop = await executePythonSuite({ code: loopCode, testSuite: day9.eTest, timeoutMs: 5000 });
  assert.equal(resLoop.allPassed, true, resLoop.error);
});

test('Day 9 Practice 1: returning inside loop trap gets helpful diagnostic', async () => {
  const badLoop = `def double_all(numbers):\n    for n in numbers:\n        return n * 2`;
  const resPy = await executePythonSuite({ code: badLoop, testSuite: day9.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  assert.ok((resPy.error || '').includes('single number instead of a list'), `Got: ${resPy.error}`);
});

test('Day 9 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day9.eStarter, testSuite: day9.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day9.eStarter, tests: day9.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 9 Practice 2: list comprehension and for-loop both pass in Pyodide and Server', async () => {
  const compCode = `def above(numbers, limit):\n    return [n for n in numbers if n > limit]`;
  const resPy = await executePythonSuite({ code: compCode, testSuite: day9.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: compCode, tests: day9.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const loopCode = `def above(numbers, limit):\n    res = []\n    for n in numbers:\n        if n > limit:\n            res.append(n)\n    return res`;
  const resLoop = await executePythonSuite({ code: loopCode, testSuite: day9.aTest, timeoutMs: 5000 });
  assert.equal(resLoop.allPassed, true, resLoop.error);
});

test('Day 9 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day9.aStarter, testSuite: day9.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day9.aStarter, tests: day9.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});
