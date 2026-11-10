import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day14 = PYTHON_30_DAYS_CONFIGS[13];

test('Day 14 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day14.eTest), null);
  assert.equal(findForbiddenPython(day14.aTest), null);
});

test('Day 14 Practice 1: except ValueError and bare except both pass, uncaught ValueError gets helpful diagnostic', async () => {
  const code = `def safe_int(text):\n    try:\n        return int(text)\n    except ValueError:\n        return 0`;
  const resPy = await executePythonSuite({ code, testSuite: day14.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day14.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const bareCode = `def safe_int(text):\n    try:\n        return int(text)\n    except:\n        return 0`;
  const resBare = await executePythonSuite({ code: bareCode, testSuite: day14.eTest, timeoutMs: 5000 });
  assert.equal(resBare.allPassed, true, resBare.error);

  const uncaught = `def safe_int(text):\n    return int(text)`;
  const resUncaught = await executePythonSuite({ code: uncaught, testSuite: day14.eTest, timeoutMs: 5000 });
  assert.equal(resUncaught.allPassed, false);
  assert.ok((resUncaught.error || '').includes('ValueError'), `Got: ${resUncaught.error}`);
});

test('Day 14 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day14.eStarter, testSuite: day14.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day14.eStarter, tests: day14.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 14 Practice 2: try/except ZeroDivisionError and if b == 0 both pass, uncaught ZeroDivisionError gets helpful diagnostic', async () => {
  const code = `def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None`;
  const resPy = await executePythonSuite({ code, testSuite: day14.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day14.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const ifCode = `def safe_divide(a, b):\n    if b == 0:\n        return None\n    return a / b`;
  const resIf = await executePythonSuite({ code: ifCode, testSuite: day14.aTest, timeoutMs: 5000 });
  assert.equal(resIf.allPassed, true, resIf.error);

  const uncaught = `def safe_divide(a, b):\n    return a / b`;
  const resUncaught = await executePythonSuite({ code: uncaught, testSuite: day14.aTest, timeoutMs: 5000 });
  assert.equal(resUncaught.allPassed, false);
  assert.ok((resUncaught.error || '').includes('ZeroDivisionError'), `Got: ${resUncaught.error}`);
});

test('Day 14 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day14.aStarter, testSuite: day14.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day14.aStarter, tests: day14.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});
