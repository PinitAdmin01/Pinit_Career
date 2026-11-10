import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day26 = PYTHON_30_DAYS_CONFIGS[25];

test('Day 26 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day26.eTest), null);
  assert.equal(findForbiddenPython(day26.aTest), null);
});

test('Day 26 Practice 1: parse_results passes and KeyError gets diagnostic', async () => {
  const code = `def parse_results(data):\n    return data.get('results', [])`;
  const resPy = await executePythonSuite({ code, testSuite: day26.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day26.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const keyErr = `def parse_results(data):\n    return data['results']`;
  const resErr = await executePythonSuite({ code: keyErr, testSuite: day26.eTest, timeoutMs: 5000 });
  assert.equal(resErr.allPassed, false);
  assert.ok((resErr.error || '').includes('KeyError'), `Got: ${resErr.error}`);
});

test('Day 26 Practice 2: status_message passes with case variations', async () => {
  const code = `def status_message(code):\n    if code == 200: return 'OK'\n    if code == 404: return 'Not Found'\n    return 'Something Went Wrong'`;
  const resPy = await executePythonSuite({ code, testSuite: day26.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day26.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);
});
