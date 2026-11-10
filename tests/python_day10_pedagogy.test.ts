import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day10 = PYTHON_30_DAYS_CONFIGS[9];

test('Day 10 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day10.eTest), null);
  assert.equal(findForbiddenPython(day10.aTest), null);
});

test('Day 10 Practice 1: make_expense passes and capitalized keys get helpful message', async () => {
  const code = `def make_expense(item, amount, category):\n    return {'item': item, 'amount': amount, 'category': category}`;
  const resPy = await executePythonSuite({ code, testSuite: day10.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day10.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const capCode = `def make_expense(item, amount, category):\n    return {'Item': item, 'Amount': amount, 'Category': category}`;
  const resCap = await executePythonSuite({ code: capCode, testSuite: day10.eTest, timeoutMs: 5000 });
  assert.equal(resCap.allPassed, false);
  assert.ok((resCap.error || '').includes('case-sensitive'), `Got: ${resCap.error}`);
});

test('Day 10 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day10.eStarter, testSuite: day10.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day10.eStarter, tests: day10.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 10 Practice 2: .get(item, 0) and if item in prices both pass', async () => {
  const getCode = `def price_of(prices, item):\n    return prices.get(item, 0)`;
  const resPy = await executePythonSuite({ code: getCode, testSuite: day10.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code: getCode, tests: day10.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const inCode = `def price_of(prices, item):\n    if item in prices:\n        return prices[item]\n    return 0`;
  const resIn = await executePythonSuite({ code: inCode, testSuite: day10.aTest, timeoutMs: 5000 });
  assert.equal(resIn.allPassed, true, resIn.error);
});

test('Day 10 Practice 2: KeyError and missing default 0 get helpful diagnostics', async () => {
  const keyErrCode = `def price_of(prices, item):\n    return prices[item]`;
  const resKey = await executePythonSuite({ code: keyErrCode, testSuite: day10.aTest, timeoutMs: 5000 });
  assert.equal(resKey.allPassed, false);
  assert.ok((resKey.error || '').includes('KeyError'), `Got: ${resKey.error}`);

  const noDefCode = `def price_of(prices, item):\n    return prices.get(item)`;
  const resNoDef = await executePythonSuite({ code: noDefCode, testSuite: day10.aTest, timeoutMs: 5000 });
  assert.equal(resNoDef.allPassed, false);
  assert.ok((resNoDef.error || '').includes('prices.get(item, 0)'), `Got: ${resNoDef.error}`);
});

test('Day 10 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day10.aStarter, testSuite: day10.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  const resSrv = await runPythonInSandbox({ code: day10.aStarter, tests: day10.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});
