import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day8 = PYTHON_30_DAYS_CONFIGS[7];

test('Day 8 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day8.eTest), null, 'eTest must not trigger safety filter');
  assert.equal(findForbiddenPython(day8.aTest), null, 'aTest must not trigger safety filter');
});

test('Day 8 Practice 1: standard function returning [items[0], items[-1]] passes in Pyodide and Server', async () => {
  const code = `def first_and_last(items):\n    return [items[0], items[-1]]`;
  const resPy = await executePythonSuite({ code, testSuite: day8.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, `Pyodide failed: ${resPy.error}`);

  const resSrv = await runPythonInSandbox({ code, tests: day8.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, `Server failed: ${resSrv.stderr}`);
});

test('Day 8 Practice 1: tuple return items[0], items[-1] also passes', async () => {
  const code = `def first_and_last(items):\n    return items[0], items[-1]`;
  const resPy = await executePythonSuite({ code, testSuite: day8.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, `Pyodide failed: ${resPy.error}`);
});

test('Day 8 Practice 1: student who prints instead of returns gets helpful error', async () => {
  const code = `def first_and_last(items):\n    print([items[0], items[-1]])`;
  const resPy = await executePythonSuite({ code, testSuite: day8.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  assert.ok((resPy.error || '').includes('return'), `Expected helpful return message, got: ${resPy.error}`);
});

test('Day 8 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day8.eStarter, testSuite: day8.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);

  const resSrv = await runPythonInSandbox({ code: day8.eStarter, tests: day8.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});

test('Day 8 Practice 2: items + [item] and items.copy() pass in Pyodide and Server', async () => {
  const codePlus = `def add_item(items, item):\n    return items + [item]`;
  const resPy = await executePythonSuite({ code: codePlus, testSuite: day8.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, `Pyodide failed: ${resPy.error}`);

  const resSrv = await runPythonInSandbox({ code: codePlus, tests: day8.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, `Server failed: ${resSrv.stderr}`);

  const codeCopy = `def add_item(items, item):\n    new_list = items.copy()\n    new_list.append(item)\n    return new_list`;
  const resCopy = await executePythonSuite({ code: codeCopy, testSuite: day8.aTest, timeoutMs: 5000 });
  assert.equal(resCopy.allPassed, true, `Pyodide copy failed: ${resCopy.error}`);
});

test('Day 8 Practice 2: beginner return items.append(item) trap gets helpful error message', async () => {
  const code = `def add_item(items, item):\n    return items.append(item)`;
  const resPy = await executePythonSuite({ code, testSuite: day8.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  assert.ok((resPy.error || '').includes('append'), `Expected helpful append message, got: ${resPy.error}`);
});

test('Day 8 Practice 2: mutating original list in-place gets helpful error message', async () => {
  const code = `def add_item(items, item):\n    items.append(item)\n    return items`;
  const resPy = await executePythonSuite({ code, testSuite: day8.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);
  assert.ok((resPy.error || '').includes('original list was changed'), `Expected original list changed message, got: ${resPy.error}`);
});

test('Day 8 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const resPy = await executePythonSuite({ code: day8.aStarter, testSuite: day8.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, false);

  const resSrv = await runPythonInSandbox({ code: day8.aStarter, tests: day8.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, false);
});
