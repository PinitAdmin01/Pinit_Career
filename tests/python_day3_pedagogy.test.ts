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
  "_fn = globals().get('shout')",
  "_val1 = None; _val2 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn('sale')",
  "        _val2 = _fn('Hi')",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_var_shout = globals().get('shout') if not callable(_fn) else None",
  "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_var_shout or '') + ' ' + str(_cap)",
  "_fn_ok = (_val1 == 'SALE!' and _val2 == 'HI!') or ('SALE!' in _all_text and 'HI!' in _all_text)",
  "_script_ok = 'SALE!' in _all_text",
  "assert _fn_ok or _script_ok, \"Expected 'SALE!' to be printed or returned\"",
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
  "_fn = globals().get('initials')",
  "_val1 = None; _val2 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn('asha', 'rao')",
  "        _val2 = _fn('Ravi', 'kumar')",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_var_init = globals().get('initials') if not callable(_fn) else None",
  "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_var_init or '') + ' ' + str(_cap)",
  "_fn_ok = (_val1 == 'AR' and _val2 == 'RK') or ('AR' in _all_text and 'RK' in _all_text)",
  "_script_ok = 'AR' in _all_text",
  "assert _fn_ok or _script_ok, \"Expected initials 'AR' to be printed or returned\"",
  "print('All checks passed.')"
].join('\n');

test('Day 3 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(eTest), null, 'eTest should not be blocked');
  assert.equal(findForbiddenPython(aTest), null, 'aTest should not be blocked');
});

test('Day 3 Practice 1: beginner script print(text.upper() + "!") passes in Pyodide', async () => {
  const code = 'text = "sale"\nprint(text.upper() + "!")';
  const res = await executePythonSuite(code, 'shout', [], 5000, eTest);
  assert.equal(res.allPassed, true, res.error || res.terminalLogs.join('\n'));
});

test('Day 3 Practice 1: beginner script passes in Server Sandbox', async () => {
  const code = 'text = "sale"\nprint(text.upper() + "!")';
  const res = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(res.passed, true, res.stderr || res.stdout);
});

test('Day 3 Practice 1: student function with print passes in Pyodide', async () => {
  const code = 'def shout(text):\n    print(text.upper() + "!")\n    pass';
  const res = await executePythonSuite(code, 'shout', [], 5000, eTest);
  assert.equal(res.allPassed, true, res.error || res.terminalLogs.join('\n'));
});

test('Day 3 Practice 1: legacy function with return passes in Pyodide and Server', async () => {
  const code = 'def shout(text):\n    return text.upper() + "!"';
  const resPyodide = await executePythonSuite(code, 'shout', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 3 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'text = "sale"\n# Print text in capital letters with ! at the end\n';
  const resPyodide = await executePythonSuite(starter, 'shout', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: eTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});

test('Day 3 Practice 2: beginner script passes in Pyodide and Server', async () => {
  const code = 'first = "asha"\nlast = "rao"\nprint((first[0] + last[0]).upper())';
  const resPyodide = await executePythonSuite(code, 'initials', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 3 Practice 2: beginner script setting initials variable passes in Server', async () => {
  const code = 'first = "asha"\nlast = "rao"\ninitials = (first[0] + last[0]).upper()';
  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 3 Practice 2: student function with print passes in Pyodide', async () => {
  const code = 'def initials(first, last):\n    print((first[0] + last[0]).upper())\n    pass';
  const resPyodide = await executePythonSuite(code, 'initials', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));
});

test('Day 3 Practice 2: legacy function with return passes in Pyodide and Server', async () => {
  const code = 'def initials(first, last):\n    return (first[0] + last[0]).upper()';
  const resPyodide = await executePythonSuite(code, 'initials', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 3 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'first = "asha"\nlast = "rao"\n# Print the initials in capitals\n';
  const resPyodide = await executePythonSuite(starter, 'initials', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: aTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});
