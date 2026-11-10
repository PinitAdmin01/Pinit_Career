import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day20 = PYTHON_30_DAYS_CONFIGS[19];

test('Day 20 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day20.eTest), null);
  assert.equal(findForbiddenPython(day20.aTest), null);
});

test('Day 20 Practice 1: parse_amount passes and uncaught ValueError gets diagnostic', async () => {
  const code = `def parse_amount(text):\n    try:\n        return float(text.strip())\n    except ValueError:\n        return None`;
  const resPy = await executePythonSuite({ code, testSuite: day20.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day20.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const uncaught = `def parse_amount(text):\n    return float(text.strip())`;
  const resUn = await executePythonSuite({ code: uncaught, testSuite: day20.eTest, timeoutMs: 5000 });
  assert.equal(resUn.allPassed, false);
  assert.ok((resUn.error || '').includes('ValueError'), `Got: ${resUn.error}`);
});

test('Day 20 Practice 2: menu_choice passes and returning string instead of int gets diagnostic', async () => {
  const code = `def menu_choice(text):\n    v = text.strip()\n    return int(v) if v in ('1', '2', '3') else None`;
  const resPy = await executePythonSuite({ code, testSuite: day20.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day20.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const strChoice = `def menu_choice(text):\n    v = text.strip()\n    return v if v in ('1', '2', '3') else None`;
  const resStr = await executePythonSuite({ code: strChoice, testSuite: day20.aTest, timeoutMs: 5000 });
  assert.equal(resStr.allPassed, false);
  assert.ok((resStr.error || '').includes('int()'), `Got: ${resStr.error}`);
});
