import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day16 = PYTHON_30_DAYS_CONFIGS[15];

test('Day 16 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day16.eTest), null);
  assert.equal(findForbiddenPython(day16.aTest), null);
});

test('Day 16 Practice 1: parse_line passes with or without extra inner strip, and string amount gets diagnostic', async () => {
  const code = `def parse_line(line):\n    item, amount = line.strip().split(',')\n    return (item.strip(), int(amount))`;
  const resPy = await executePythonSuite({ code, testSuite: day16.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day16.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const simpleStrip = `def parse_line(line):\n    item, amount = line.strip().split(',')\n    return (item, int(amount))`;
  const resSimple = await executePythonSuite({ code: simpleStrip, testSuite: day16.eTest, timeoutMs: 5000 });
  assert.equal(resSimple.allPassed, true, resSimple.error);

  const strAmt = `def parse_line(line):\n    return tuple(line.strip().split(','))`;
  const resStr = await executePythonSuite({ code: strAmt, testSuite: day16.eTest, timeoutMs: 5000 });
  assert.equal(resStr.allPassed, false);
  assert.ok((resStr.error || '').includes('int(amount)'), `Got: ${resStr.error}`);
});

test('Day 16 Practice 1: unfinished starter fails', async () => {
  const resPy = await executePythonSuite({ code: day16.eStarter, testSuite: day16.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day16.eStarter, tests: day16.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 16 Practice 2: to_line passes with or without trailing newline', async () => {
  const code = `def to_line(item, amount):\n    return f'{item},{amount}'`;
  const resPy = await executePythonSuite({ code, testSuite: day16.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day16.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const nlCode = `def to_line(item, amount):\n    return f'{item},{amount}\\n'`;
  const resNl = await executePythonSuite({ code: nlCode, testSuite: day16.aTest, timeoutMs: 5000 });
  assert.equal(resNl.allPassed, true, resNl.error);
});

test('Day 16 Practice 2: unfinished starter fails', async () => {
  const resPy = await executePythonSuite({ code: day16.aStarter, testSuite: day16.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day16.aStarter, tests: day16.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});
