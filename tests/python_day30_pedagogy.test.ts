import test from 'node:test';
import assert from 'node:assert/strict';
import { PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/python30DayData';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const day30 = PYTHON_30_DAYS_CONFIGS[29];

test('Day 30 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(day30.eTest), null);
  assert.equal(findForbiddenPython(day30.aTest), null);
});

test('Day 30 Practice 1: fizz_buzz passes with str(n) or int n, and wrong condition order gets diagnostic', async () => {
  const code = `def fizz_buzz(n):\n    if n % 15 == 0: return 'FizzBuzz'\n    if n % 3 == 0: return 'Fizz'\n    if n % 5 == 0: return 'Buzz'\n    return str(n)`;
  const resPy = await executePythonSuite({ code, testSuite: day30.eTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day30.eTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const wrongOrder = `def fizz_buzz(n):\n    if n % 3 == 0: return 'Fizz'\n    if n % 5 == 0: return 'Buzz'\n    if n % 15 == 0: return 'FizzBuzz'\n    return str(n)`;
  const resWrong = await executePythonSuite({ code: wrongOrder, testSuite: day30.eTest, timeoutMs: 5000 });
  assert.equal(resWrong.allPassed, false);
  assert.ok((resWrong.error || '').includes('FIRST'), `Got: ${resWrong.error}`);
});

test('Day 30 Practice 2: reverse_words passes and character reversal sentence[::-1] gets diagnostic', async () => {
  const code = `def reverse_words(sentence):\n    return ' '.join(reversed(sentence.split()))`;
  const resPy = await executePythonSuite({ code, testSuite: day30.aTest, timeoutMs: 5000 });
  assert.equal(resPy.allPassed, true, resPy.error);
  const resSrv = await runPythonInSandbox({ code, tests: day30.aTest, timeoutMs: 5000 });
  assert.equal(resSrv.passed, true, resSrv.stderr);

  const charRev = `def reverse_words(sentence):\n    return sentence[::-1]`;
  const resChar = await executePythonSuite({ code: charRev, testSuite: day30.aTest, timeoutMs: 5000 });
  assert.equal(resChar.allPassed, false);
  assert.ok((resChar.error || '').includes('reversed the letters'), `Got: ${resChar.error}`);
});
