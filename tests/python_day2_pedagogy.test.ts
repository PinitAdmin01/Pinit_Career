import test from 'node:test';
import assert from 'node:assert/strict';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const eTest = [
  "_printed = []",
  "_orig_print = print",
  "def _capturing_print(*args, **kwargs):",
  "    _printed.append(' '.join(str(a) for a in args))",
  "    try: _orig_print(*args, **kwargs)",
  "    except Exception: pass",
  "print = _capturing_print",
  "_fn = globals().get('describe_expense')",
  "_val1 = None; _val2 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn('Tea', 20)",
  "        _val2 = _fn('Bus ticket', 45)",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_cap)",
  "_fn_ok = (_val1 == 'Tea costs 20' and _val2 == 'Bus ticket costs 45') or ('Tea costs 20' in _all_text and 'Bus ticket costs 45' in _all_text)",
  "_script_ok = 'Tea costs 20' in _all_text or ('Tea' in _all_text and 'costs' in _all_text and '20' in _all_text)",
  "assert _fn_ok or _script_ok, \"Expected 'Tea costs 20' to be printed or returned\"",
  "print('All checks passed.')"
].join('\n');

const aTest = [
  "_printed = []",
  "_orig_print = print",
  "def _capturing_print(*args, **kwargs):",
  "    _printed.append(' '.join(str(a) for a in args))",
  "    try: _orig_print(*args, **kwargs)",
  "    except Exception: pass",
  "print = _capturing_print",
  "_fn = globals().get('is_big_expense')",
  "_val1 = None; _val2 = None; _val3 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn(1000)",
  "        _val2 = _fn(2500)",
  "        _val3 = _fn(999)",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_var_big = globals().get('is_big')",
  "_all_text = ' '.join(_printed) + ' ' + str(_cap)",
  "_fn_ok = (_val1 is True and _val2 is True and _val3 is False) or (callable(_fn) and 'True' in ' '.join(_printed) and 'False' in ' '.join(_printed))",
  "_script_ok = (_var_big is True or 'True' in _all_text) and ('is_big' in globals() or 'True' in _printed or 'True' in str(_cap))",
  "assert _fn_ok or _script_ok, \"Expected is_big to be True when amount >= 1000\"",
  "print('All checks passed.')"
].join('\n');

test('Day 2 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(eTest), null, 'eTest should not be blocked');
  assert.equal(findForbiddenPython(aTest), null, 'aTest should not be blocked');
});

test('Day 2 Practice 1: beginner script passes in Pyodide', async () => {
  const code = 'item = "Tea"\namount = 20\nprint(item + " costs " + str(amount))';
  const res = await executePythonSuite(code, 'describe_expense', [], 5000, eTest);
  assert.equal(res.allPassed, true, res.error || res.terminalLogs.join('\n'));
});

test('Day 2 Practice 1: beginner script passes in Server Sandbox', async () => {
  const code = 'item = "Tea"\namount = 20\nprint(item + " costs " + str(amount))';
  const res = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(res.passed, true, res.stderr || res.stdout);
});

test('Day 2 Practice 1: student function with print passes in Pyodide', async () => {
  const code = 'def describe_expense(item, amount):\n    print(item + " costs " + str(amount))\n    pass';
  const res = await executePythonSuite(code, 'describe_expense', [], 5000, eTest);
  assert.equal(res.allPassed, true, res.error || res.terminalLogs.join('\n'));
});

test('Day 2 Practice 1: legacy function with return passes in Pyodide and Server', async () => {
  const code = 'def describe_expense(item, amount):\n    return item + " costs " + str(amount)';
  const resPyodide = await executePythonSuite(code, 'describe_expense', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 2 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'item = "Tea"\namount = 20\n# Print "Tea costs 20" below\n';
  const resPyodide = await executePythonSuite(starter, 'describe_expense', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: eTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});

test('Day 2 Practice 2: beginner script passes in Pyodide and Server', async () => {
  const code = 'amount = 1200\nis_big = amount >= 1000\nprint(is_big)';
  const resPyodide = await executePythonSuite(code, 'is_big_expense', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 2 Practice 2: beginner script setting is_big without print passes in Server', async () => {
  const code = 'amount = 1200\nis_big = amount >= 1000';
  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 2 Practice 2: legacy function with return passes in Pyodide and Server', async () => {
  const code = 'def is_big_expense(amount):\n    return amount >= 1000';
  const resPyodide = await executePythonSuite(code, 'is_big_expense', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 2 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'amount = 1200\n# Set is_big below\n';
  const resPyodide = await executePythonSuite(starter, 'is_big_expense', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: aTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});
