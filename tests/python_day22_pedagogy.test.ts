import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day22 = PYTHON_30_DAYS_CONFIGS[21];

test('Day 22 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day22.eTest), null);
  assert.equal(findForbiddenPython(day22.aTest), null);
});

test('Day 22 Practice 1: is_good_commit_message passes and unfinished starter fails', async () => {
  const code = `def is_good_commit_message(msg):\n    return 10 <= len(msg) <= 72`;
  const resPy = await executePythonSuite({ code, testSuite: day22.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day22.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const resFail = await executePythonSuite({ code: day22.eStarter, testSuite: day22.eTest, timeoutMs: 5000 });
  assert.equal(resFail.allPassed, false);
});

test('Day 22 Practice 2: branch_name passes with split/join OR strip/replace', async () => {
  const splitCode = `def branch_name(task):\n    return 'feature/' + '-'.join(task.lower().split())`;
  const resPy = await executePythonSuite({ code: splitCode, testSuite: day22.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: splitCode, tests: day22.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const replaceCode = `def branch_name(task):\n    return 'feature/' + task.strip().lower().replace(' ', '-')`;
  const resRep = await executePythonSuite({ code: replaceCode, testSuite: day22.aTest, timeoutMs: 5000 });
  assert.equal(resRep.allPassed, true, resRep.error);
});
