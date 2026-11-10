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
  "_fn = globals().get('grade')",
  "_val1 = None; _val2 = None; _val3 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn(40)",
  "        _val2 = _fn(85)",
  "        _val3 = _fn(39)",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_var_grade = globals().get('grade') if not callable(_fn) else None",
  "_var_result = globals().get('result')",
  "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_val3 or '') + ' ' + str(_var_grade or '') + ' ' + str(_var_result or '') + ' ' + str(_cap)",
  "_fn_ok = (_val1 == 'Pass' and _val2 == 'Pass' and _val3 == 'Fail') or ('Pass' in _all_text and 'Fail' in _all_text)",
  "_script_ok = 'Pass' in _all_text and ('Pass' in _printed or 'Pass' in str(_cap) or _var_grade == 'Pass' or _var_result == 'Pass')",
  "assert _fn_ok or _script_ok, \"Expected 'Pass' to be printed or returned\"",
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
  "_fn = globals().get('delivery_fee')",
  "_val1 = None; _val2 = None; _val3 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn(499)",
  "        _val2 = _fn(1200)",
  "        _val3 = _fn(300)",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_var_fee = globals().get('fee')",
  "_var_del = globals().get('delivery_fee') if not callable(_fn) else None",
  "_all_text = ' '.join(_printed) + ' ' + str(_val1 if _val1 is not None else '') + ' ' + str(_val2 if _val2 is not None else '') + ' ' + str(_val3 if _val3 is not None else '') + ' ' + str(_var_fee if _var_fee is not None else '') + ' ' + str(_var_del if _var_del is not None else '') + ' ' + str(_cap)",
  "_fn_ok = (_val1 == 0 and _val2 == 0 and _val3 == 40) or (callable(_fn) and '0' in _all_text and '40' in _all_text)",
  "_script_ok = ('0' in _all_text or _var_fee == 0 or _var_del == 0) and ('fee' in globals() or '0' in _printed or '0' in str(_cap))",
  "assert _fn_ok or _script_ok, \"Expected delivery fee 0 to be printed or returned\"",
  "print('All checks passed.')"
].join('\n');

test('Day 5 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(eTest), null, 'eTest should not be blocked');
  assert.equal(findForbiddenPython(aTest), null, 'aTest should not be blocked');
});

test('Day 5 Practice 1: beginner script with if/else passes in Pyodide', async () => {
  const code = 'score = 40\nif score >= 40:\n    print("Pass")\nelse:\n    print("Fail")';
  const res = await executePythonSuite(code, 'grade', [], 5000, eTest);
  assert.equal(res.allPassed, true, res.error || res.terminalLogs.join('\n'));
});

test('Day 5 Practice 1: beginner script passes in Server Sandbox', async () => {
  const code = 'score = 40\nif score >= 40:\n    print("Pass")\nelse:\n    print("Fail")';
  const res = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(res.passed, true, res.stderr || res.stdout);
});

test('Day 5 Practice 1: student function with print passes in Pyodide', async () => {
  const code = 'def grade(score):\n    if score >= 40:\n        print("Pass")\n    else:\n        print("Fail")\n    pass';
  const res = await executePythonSuite(code, 'grade', [], 5000, eTest);
  assert.equal(res.allPassed, true, res.error || res.terminalLogs.join('\n'));
});

test('Day 5 Practice 1: legacy function with return passes in Pyodide and Server', async () => {
  const code = 'def grade(score):\n    if score >= 40:\n        return "Pass"\n    return "Fail"';
  const resPyodide = await executePythonSuite(code, 'grade', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 5 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'score = 40\n# Print Pass if score >= 40, otherwise Fail\n';
  const resPyodide = await executePythonSuite(starter, 'grade', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: eTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});

test('Day 5 Practice 2: beginner script passes in Pyodide and Server', async () => {
  const code = 'bill = 499\nif bill >= 499:\n    fee = 0\nelse:\n    fee = 40\nprint(fee)';
  const resPyodide = await executePythonSuite(code, 'delivery_fee', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 5 Practice 2: beginner script setting fee variable without print passes in Server', async () => {
  const code = 'bill = 499\nif bill >= 499:\n    fee = 0\nelse:\n    fee = 40';
  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 5 Practice 2: student function with print passes in Pyodide', async () => {
  const code = 'def delivery_fee(bill):\n    if bill >= 499:\n        print(0)\n    else:\n        print(40)\n    pass';
  const resPyodide = await executePythonSuite(code, 'delivery_fee', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));
});

test('Day 5 Practice 2: legacy function with return passes in Pyodide and Server', async () => {
  const code = 'def delivery_fee(bill):\n    return 0 if bill >= 499 else 40';
  const resPyodide = await executePythonSuite(code, 'delivery_fee', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 5 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'bill = 499\n# Print 0 if bill >= 499, otherwise print 40\n';
  const resPyodide = await executePythonSuite(starter, 'delivery_fee', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: aTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});
