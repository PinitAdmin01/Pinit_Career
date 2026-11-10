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
  "_fn = globals().get('average')",
  "_val1 = None; _val2 = None; _val3 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn([10, 20, 30])",
  "        _val2 = _fn([1, 2])",
  "        _val3 = _fn([])",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_all_text = ' '.join(_printed) + ' ' + str(_cap)",
  "if callable(_fn) and _val1 is None and ('20' in _all_text or '20.0' in _all_text):",
  "    assert False, \"average() printed the answer instead of returning it. Use 'return' instead of 'print'!\"",
  "_fn_ok = (_val1 == 20.0 or _val1 == 20) and (_val2 == 1.5) and (_val3 == 0 or _val3 == 0.0)",
  "_script_ok = ('20.0' in _all_text or '20' in _all_text) and not callable(_fn) and ('average' in globals() or 'avg' in globals() or '20' in _printed)",
  "assert _fn_ok or _script_ok, \"Expected average([10, 20, 30]) == 20.0, average([1, 2]) == 1.5, and average([]) == 0\"",
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
  "_fn = globals().get('greet')",
  "_val1 = None; _val2 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn('Asha')",
  "        _val2 = _fn('Ravi', 'Namaste')",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_all_text = ' '.join(_printed) + ' ' + str(_cap)",
  "if callable(_fn) and _val1 is None and ('Hello, Asha!' in _all_text or 'Asha' in _all_text):",
  "    assert False, \"greet() printed the greeting instead of returning it. Use 'return' instead of 'print'!\"",
  "_fn_ok = (_val1 == 'Hello, Asha!') and (_val2 == 'Namaste, Ravi!')",
  "_script_ok = ('Hello, Asha!' in _all_text) and not callable(_fn)",
  "assert _fn_ok or _script_ok, \"Expected greet('Asha') == 'Hello, Asha!' and greet('Ravi', 'Namaste') == 'Namaste, Ravi!'\"",
  "print('All checks passed.')"
].join('\n');

test('Day 7 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(eTest), null, 'eTest should not be blocked');
  assert.equal(findForbiddenPython(aTest), null, 'aTest should not be blocked');
});

test('Day 7 Practice 1: standard function with return passes in Pyodide and Server', async () => {
  const code = 'def average(numbers):\n    if not numbers:\n        return 0\n    return round(sum(numbers) / len(numbers), 2)';
  const resPyodide = await executePythonSuite(code, 'average', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 7 Practice 1: student who prints instead of returns gets helpful error', async () => {
  const code = 'def average(numbers):\n    print(20.0)\n    pass';
  const resPyodide = await executePythonSuite(code, 'average', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, false, 'Should fail because function printed instead of returning');
  assert.match(resPyodide.error || resPyodide.terminalLogs.join('\n'), /printed the answer instead of returning/);
});

test('Day 7 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'def average(numbers):\n    # Handle the empty list first\n    pass';
  const resPyodide = await executePythonSuite(starter, 'average', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: eTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});

test('Day 7 Practice 2: standard function with default parameter passes in Pyodide and Server', async () => {
  const code = "def greet(name, greeting='Hello'):\n    return greeting + ', ' + name + '!'";
  const resPyodide = await executePythonSuite(code, 'greet', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 7 Practice 2: student who prints instead of returns gets helpful error', async () => {
  const code = "def greet(name, greeting='Hello'):\n    print('Hello, Asha!')\n    pass";
  const resPyodide = await executePythonSuite(code, 'greet', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, false, 'Should fail because function printed instead of returning');
  assert.match(resPyodide.error || resPyodide.terminalLogs.join('\n'), /printed the greeting instead of returning/);
});

test('Day 7 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const starter = "def greet(name, greeting='Hello'):\n    # Join greeting\n    pass";
  const resPyodide = await executePythonSuite(starter, 'greet', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: aTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});
