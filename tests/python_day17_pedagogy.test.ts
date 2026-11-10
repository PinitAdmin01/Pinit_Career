import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day17 = PYTHON_30_DAYS_CONFIGS[16];

test('Day 17 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day17.eTest), null);
  assert.equal(findForbiddenPython(day17.aTest), null);
});

test('Day 17 Practice 1: json.dumps and json.dumps with indent=2 both pass', async () => {
  const code = `import json\ndef to_json(expenses):\n    return json.dumps(expenses)`;
  const resPy = await executePythonSuite({ code, testSuite: day17.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day17.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const indentCode = `import json\ndef to_json(expenses):\n    return json.dumps(expenses, indent=2)`;
  const resInd = await executePythonSuite({ code: indentCode, testSuite: day17.eTest, timeoutMs: 5000 });
  assert.equal(resInd.allPassed, true, resInd.error);
});

test('Day 17 Practice 1: unfinished starter fails', async () => {
  const resPy = await executePythonSuite({ code: day17.eStarter, testSuite: day17.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day17.eStarter, tests: day17.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 17 Practice 2: load_expenses passes and missing isinstance(data, list) gets diagnostic', async () => {
  const code = `import json\ndef load_expenses(text):\n    try:\n        data = json.loads(text)\n        return data if isinstance(data, list) else []\n    except ValueError:\n        return []`;
  const resPy = await executePythonSuite({ code, testSuite: day17.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day17.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const noListCheck = `import json\ndef load_expenses(text):\n    try:\n        return json.loads(text)\n    except ValueError:\n        return []`;
  const resNoCheck = await executePythonSuite({ code: noListCheck, testSuite: day17.aTest, timeoutMs: 5000 });
  assert.equal(resNoCheck.allPassed, false);
  assert.ok((resNoCheck.error || '').includes('isinstance(data, list)'), `Got: ${resNoCheck.error}`);
});

test('Day 17 Practice 2: unfinished starter fails', async () => {
  const resPy = await executePythonSuite({ code: day17.aStarter, testSuite: day17.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day17.aStarter, tests: day17.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});
