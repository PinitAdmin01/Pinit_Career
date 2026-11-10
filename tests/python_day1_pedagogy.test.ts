import test from 'node:test';
import assert from 'node:assert/strict';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';

const day1 = PYTHON_30_DAYS_CONFIGS[0];

test('Day 1 Practice 1 (eTest): beginner print("My Expense Tracker") passes', async () => {
  const code = 'print("My Expense Tracker")';
  const result = await executePythonSuite(code, 'page_title', [], 5000, day1.eTest);
  assert.equal(result.allPassed, true, `Expected pass, got error: ${result.error || result.terminalLogs.join('\n')}`);
});

test('Day 1 Practice 1 (eTest): user screenshot code (def + print) passes without return error', async () => {
  const code = 'def page_title():\n    print("My Expense Tracker")\n    pass';
  const result = await executePythonSuite(code, 'page_title', [], 5000, day1.eTest);
  assert.equal(result.allPassed, true, `Expected pass, got error: ${result.error || result.terminalLogs.join('\n')}`);
});

test('Day 1 Practice 1 (eTest): legacy def + return passes', async () => {
  const code = 'def page_title():\n    return "My Expense Tracker"';
  const result = await executePythonSuite(code, 'page_title', [], 5000, day1.eTest);
  assert.equal(result.allPassed, true, `Expected pass, got error: ${result.error || result.terminalLogs.join('\n')}`);
});

test('Day 1 Practice 1 (eTest): unfinished starter code fails', async () => {
  const result = await executePythonSuite(day1.eStarter || '', 'page_title', [], 5000, day1.eTest);
  assert.equal(result.allPassed, false, 'Unfinished starter code should fail');
});

test('Day 1 Practice 2 (aTest): beginner print("Hello, Asha!") passes', async () => {
  const code = 'print("Hello, Asha!")';
  const result = await executePythonSuite(code, 'say_hello', [], 5000, day1.aTest);
  assert.equal(result.allPassed, true, `Expected pass, got error: ${result.error || result.terminalLogs.join('\n')}`);
});

test('Day 1 Practice 2 (aTest): legacy def say_hello(name) passes', async () => {
  const code = 'def say_hello(name):\n    return "Hello, " + name';
  const result = await executePythonSuite(code, 'say_hello', [], 5000, day1.aTest);
  assert.equal(result.allPassed, true, `Expected pass, got error: ${result.error || result.terminalLogs.join('\n')}`);
});

test('Day 1 Practice 2 (aTest): unfinished starter code fails', async () => {
  const result = await executePythonSuite(day1.aStarter || '', 'say_hello', [], 5000, day1.aTest);
  assert.equal(result.allPassed, false, 'Unfinished starter code should fail');
});
