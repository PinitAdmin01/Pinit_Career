import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day29 = PYTHON_30_DAYS_CONFIGS[28];

test('Day 29 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day29.eTest), null);
  assert.equal(findForbiddenPython(day29.aTest), null);
});

test('Day 29 Practice 1 & 2: base_url and missing_sections pass and starters fail', async () => {
  const code1 = `def base_url(env):\n    return 'https://expense-api.onrender.com' if env == 'production' else 'http://127.0.0.1:8000'`;
  const resPy1 = await executePythonSuite({ code: code1, testSuite: day29.eTest, timeoutMs: 5000 });
  assert.equal(resPy1.allPassed, true, resPy1.error);
  const resSrv1 = await runPythonInSandbox({ code: code1, tests: day29.eTest, timeoutMs: 5000 });
  assert.equal(resSrv1.passed, true, resSrv1.stderr);

  const code2 = `def missing_sections(readme):\n    needed = ['## About', '## Features', '## Setup']\n    return [s for s in needed if s not in readme]`;
  const resPy2 = await executePythonSuite({ code: code2, testSuite: day29.aTest, timeoutMs: 5000 });
  assert.equal(resPy2.allPassed, true, resPy2.error);
  const resSrv2 = await runPythonInSandbox({ code: code2, tests: day29.aTest, timeoutMs: 5000 });
  assert.equal(resSrv2.passed, true, resSrv2.stderr);

  const fail1 = await executePythonSuite({ code: day29.eStarter, testSuite: day29.eTest, timeoutMs: 5000 });
  assert.equal(fail1.allPassed, false);
  const fail2 = await executePythonSuite({ code: day29.aStarter, testSuite: day29.aTest, timeoutMs: 5000 });
  assert.equal(fail2.allPassed, false);
});
