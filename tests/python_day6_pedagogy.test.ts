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
  "_fn = globals().get('total')",
  "_val1 = None; _val2 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn([20, 45, 100])",
  "        _val2 = _fn([])",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_var_res = globals().get('result')",
  "_var_tot = globals().get('total') if not callable(_fn) else None",
  "_all_text = ' '.join(_printed) + ' ' + str(_val1 if _val1 is not None else '') + ' ' + str(_val2 if _val2 is not None else '') + ' ' + str(_var_res if _var_res is not None else '') + ' ' + str(_var_tot if _var_tot is not None else '') + ' ' + str(_cap)",
  "_fn_ok = (_val1 == 165 and _val2 == 0) or (callable(_fn) and '165' in _all_text and '0' in _all_text)",
  "_script_ok = ('165' in _all_text or _var_res == 165 or _var_tot == 165) and ('165' in _printed or '165' in str(_cap) or _var_res == 165)",
  "assert _fn_ok or _script_ok, \"Expected 165 to be printed or returned\"",
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
  "_fn = globals().get('count_above')",
  "_val1 = None; _val2 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn([100, 500, 1200, 50], 400)",
  "        _val2 = _fn([], 10)",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_var_count = globals().get('count')",
  "_var_ca = globals().get('count_above') if not callable(_fn) else None",
  "_all_text = ' '.join(_printed) + ' ' + str(_val1 if _val1 is not None else '') + ' ' + str(_val2 if _val2 is not None else '') + ' ' + str(_var_count if _var_count is not None else '') + ' ' + str(_var_ca if _var_ca is not None else '') + ' ' + str(_cap)",
  "_fn_ok = (_val1 == 2 and _val2 == 0) or (callable(_fn) and '2' in _all_text and '0' in _all_text)",
  "_script_ok = ('2' in _all_text or _var_count == 2 or _var_ca == 2) and ('2' in _printed or '2' in str(_cap) or _var_count == 2)",
  "assert _fn_ok or _script_ok, \"Expected count 2 to be printed or returned\"",
  "print('All checks passed.')"
].join('\n');

test('Day 6 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(eTest), null, 'eTest should not be blocked');
  assert.equal(findForbiddenPython(aTest), null, 'aTest should not be blocked');
});

test('Day 6 Practice 1: beginner script with for loop passes in Pyodide', async () => {
  const code = 'amounts = [20, 45, 100]\nresult = 0\nfor a in amounts:\n    result = result + a\nprint(result)';
  const res = await executePythonSuite(code, 'total', [], 5000, eTest);
  assert.equal(res.allPassed, true, res.error || res.terminalLogs.join('\n'));
});

test('Day 6 Practice 1: beginner script passes in Server Sandbox', async () => {
  const code = 'amounts = [20, 45, 100]\nresult = 0\nfor a in amounts:\n    result = result + a\nprint(result)';
  const res = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(res.passed, true, res.stderr || res.stdout);
});

test('Day 6 Practice 1: student function with print passes in Pyodide', async () => {
  const code = 'def total(amounts):\n    s = sum(amounts)\n    print(s)\n    pass';
  const res = await executePythonSuite(code, 'total', [], 5000, eTest);
  assert.equal(res.allPassed, true, res.error || res.terminalLogs.join('\n'));
});

test('Day 6 Practice 1: legacy function with return passes in Pyodide and Server', async () => {
  const code = 'def total(amounts):\n    result = 0\n    for amount in amounts:\n        result = result + amount\n    return result';
  const resPyodide = await executePythonSuite(code, 'total', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 6 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'amounts = [20, 45, 100]\nresult = 0\n# Loop over amounts\n';
  const resPyodide = await executePythonSuite(starter, 'total', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: eTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});

test('Day 6 Practice 2: beginner script passes in Pyodide and Server', async () => {
  const code = 'amounts = [100, 500, 1200, 50]\nlimit = 400\ncount = 0\nfor a in amounts:\n    if a > limit:\n        count = count + 1\nprint(count)';
  const resPyodide = await executePythonSuite(code, 'count_above', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 6 Practice 2: beginner script setting count variable passes in Server', async () => {
  const code = 'amounts = [100, 500, 1200, 50]\nlimit = 400\ncount = 0\nfor a in amounts:\n    if a > limit:\n        count = count + 1';
  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 6 Practice 2: student function with print passes in Pyodide', async () => {
  const code = 'def count_above(amounts, limit):\n    c = sum(1 for a in amounts if a > limit)\n    print(c)\n    pass';
  const resPyodide = await executePythonSuite(code, 'count_above', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));
});

test('Day 6 Practice 2: legacy function with return passes in Pyodide and Server', async () => {
  const code = 'def count_above(amounts, limit):\n    count = 0\n    for amount in amounts:\n        if amount > limit:\n            count = count + 1\n    return count';
  const resPyodide = await executePythonSuite(code, 'count_above', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 6 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'amounts = [100, 500, 1200, 50]\nlimit = 400\ncount = 0\n# Loop over amounts\n';
  const resPyodide = await executePythonSuite(starter, 'count_above', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: aTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});
