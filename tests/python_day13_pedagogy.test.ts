import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day13 = PYTHON_30_DAYS_CONFIGS[12];

test('Day 13 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day13.eTest), null);
  assert.equal(findForbiddenPython(day13.aTest), null);
});

test('Day 13 Practice 1: f-string with :.2f passes and missing :.2f gets helpful diagnostic', async () => {
  const code = `def money(amount):\n    return f'Rs {amount:.2f}'`;
  const resPy = await executePythonSuite({ code, testSuite: day13.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day13.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const noFmt = `def money(amount):\n    return f'Rs {amount}'`;
  const resNoFmt = await executePythonSuite({ code: noFmt, testSuite: day13.eTest, timeoutMs: 5000 });
  assert.equal(resNoFmt.allPassed, false);
  assert.ok((resNoFmt.error || '').includes(':.2f'), `Got: ${resNoFmt.error}`);
});

test('Day 13 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day13.eStarter, testSuite: day13.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day13.eStarter, tests: day13.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 13 Practice 2: receipt_line with 18 or 19 chars passes and missing alignment gets helpful diagnostic', async () => {
  const code = `def receipt_line(item, amount):\n    return f'{item:<10}{amount:>8.2f}'`;
  const resPy = await executePythonSuite({ code, testSuite: day13.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day13.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const spaceCode = `def receipt_line(item, amount):\n    return f'{item:<10} {amount:>8.2f}'`;
  const resSpace = await executePythonSuite({ code: spaceCode, testSuite: day13.aTest, timeoutMs: 5000 });
  assert.equal(resSpace.allPassed, true, resSpace.error);

  const unaligned = `def receipt_line(item, amount):\n    return f'{item} {amount:.2f}'`;
  const resUnaligned = await executePythonSuite({ code: unaligned, testSuite: day13.aTest, timeoutMs: 5000 });
  assert.equal(resUnaligned.allPassed, false);
  assert.ok((resUnaligned.error || '').includes('<10'), `Got: ${resUnaligned.error}`);
});

test('Day 13 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day13.aStarter, testSuite: day13.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day13.aStarter, tests: day13.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});
