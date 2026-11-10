import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day15 = PYTHON_30_DAYS_CONFIGS[14];

test('Day 15 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day15.eTest), null);
  assert.equal(findForbiddenPython(day15.aTest), null);
});

test('Day 15 Practice 1: rounded and unrounded math.pi * r * r both pass', async () => {
  const code = `import math\ndef circle_area(r):\n    return round(math.pi * r * r, 2)`;
  const resPy = await executePythonSuite({ code, testSuite: day15.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day15.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const unrounded = `import math\ndef circle_area(r):\n    return math.pi * (r ** 2)`;
  const resUn = await executePythonSuite({ code: unrounded, testSuite: day15.eTest, timeoutMs: 5000 });
  assert.equal(resUn.allPassed, true, resUn.error);
});

test('Day 15 Practice 1: unfinished starter fails', async () => {
  const resPy = await executePythonSuite({ code: day15.eStarter, testSuite: day15.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day15.eStarter, tests: day15.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 15 Practice 2: days_between passes and missing .days or reversed order gets helpful diagnostic', async () => {
  const code = `from datetime import date\ndef days_between(start, end):\n    return (date.fromisoformat(end) - date.fromisoformat(start)).days`;
  const resPy = await executePythonSuite({ code, testSuite: day15.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day15.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const noDays = `from datetime import date\ndef days_between(start, end):\n    return date.fromisoformat(end) - date.fromisoformat(start)`;
  const resNoDays = await executePythonSuite({ code: noDays, testSuite: day15.aTest, timeoutMs: 5000 });
  assert.equal(resNoDays.allPassed, false);
  assert.ok((resNoDays.error || '').includes('.days'), `Got: ${resNoDays.error}`);
});

test('Day 15 Practice 2: unfinished starter fails', async () => {
  const resPy = await executePythonSuite({ code: day15.aStarter, testSuite: day15.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day15.aStarter, tests: day15.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});
