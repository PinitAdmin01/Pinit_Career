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
  "_fn = globals().get('add_gst')",
  "_val1 = None; _val2 = None; _val3 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn(100)",
  "        _val2 = _fn(250)",
  "        _val3 = _fn(99.99)",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_var_res = globals().get('add_gst') if not callable(_fn) else None",
  "_var_total = globals().get('total')",
  "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_val3 or '') + ' ' + str(_var_res or '') + ' ' + str(_var_total or '') + ' ' + str(_cap)",
  "_fn_ok = (_val1 == 118.0 and _val2 == 295.0 and _val3 == 117.99) or ('118' in _all_text and '295' in _all_text)",
  "_script_ok = '118.0' in _all_text or '118' in _all_text",
  "assert _fn_ok or _script_ok, \"Expected 118.0 to be printed or returned\"",
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
  "_fn = globals().get('split_bill')",
  "_val1 = None; _val2 = None",
  "try:",
  "    if callable(_fn):",
  "        _val1 = _fn(1000, 4)",
  "        _val2 = _fn(100, 3)",
  "finally:",
  "    print = _orig_print",
  "_cap = globals().get('_captured_stdout_', '')",
  "_var_res = globals().get('split_bill') if not callable(_fn) else None",
  "_var_share = globals().get('share')",
  "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_var_res or '') + ' ' + str(_var_share or '') + ' ' + str(_cap)",
  "_fn_ok = (_val1 == 250.0 and _val2 == 33.33) or ('250' in _all_text and '33.33' in _all_text)",
  "_script_ok = '250.0' in _all_text or '250' in _all_text",
  "assert _fn_ok or _script_ok, \"Expected 250.0 to be printed or returned\"",
  "print('All checks passed.')"
].join('\n');

test('Day 4 Security: test suites pass safety filter', () => {
  assert.equal(findForbiddenPython(eTest), null, 'eTest should not be blocked');
  assert.equal(findForbiddenPython(aTest), null, 'aTest should not be blocked');
});

test('Day 4 Practice 1: beginner script passes in Pyodide', async () => {
  const code = 'price = 100\nprint(round(price * 1.18, 2))';
  const res = await executePythonSuite(code, 'add_gst', [], 5000, eTest);
  assert.equal(res.allPassed, true, res.error || res.terminalLogs.join('\n'));
});

test('Day 4 Practice 1: beginner script passes in Server Sandbox', async () => {
  const code = 'price = 100\nprint(round(price * 1.18, 2))';
  const res = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(res.passed, true, res.stderr || res.stdout);
});

test('Day 4 Practice 1: student function with print passes in Pyodide', async () => {
  const code = 'def add_gst(price):\n    print(round(price * 1.18, 2))\n    pass';
  const res = await executePythonSuite(code, 'add_gst', [], 5000, eTest);
  assert.equal(res.allPassed, true, res.error || res.terminalLogs.join('\n'));
});

test('Day 4 Practice 1: legacy function with return passes in Pyodide and Server', async () => {
  const code = 'def add_gst(price):\n    return round(price * 1.18, 2)';
  const resPyodide = await executePythonSuite(code, 'add_gst', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: eTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 4 Practice 1: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'price = 100\n# Calculate price + 18% GST and print it below\n';
  const resPyodide = await executePythonSuite(starter, 'add_gst', [], 5000, eTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: eTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});

test('Day 4 Practice 2: beginner script passes in Pyodide and Server', async () => {
  const code = 'total = 1000\npeople = 4\nprint(round(total / people, 2))';
  const resPyodide = await executePythonSuite(code, 'split_bill', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 4 Practice 2: beginner script setting share variable passes in Server', async () => {
  const code = 'total = 1000\npeople = 4\nshare = round(total / people, 2)';
  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 4 Practice 2: student function with print passes in Pyodide', async () => {
  const code = 'def split_bill(total, people):\n    print(round(total / people, 2))\n    pass';
  const resPyodide = await executePythonSuite(code, 'split_bill', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));
});

test('Day 4 Practice 2: legacy function with return passes in Pyodide and Server', async () => {
  const code = 'def split_bill(total, people):\n    return round(total / people, 2)';
  const resPyodide = await executePythonSuite(code, 'split_bill', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, true, resPyodide.error || resPyodide.terminalLogs.join('\n'));

  const resServer = await runPythonInSandbox({ code, tests: aTest });
  assert.equal(resServer.passed, true, resServer.stderr || resServer.stdout);
});

test('Day 4 Practice 2: unfinished starter fails in Pyodide and Server', async () => {
  const starter = 'total = 1000\npeople = 4\n# Calculate each share and print it below\n';
  const resPyodide = await executePythonSuite(starter, 'split_bill', [], 5000, aTest);
  assert.equal(resPyodide.allPassed, false, 'Unfinished starter should fail in Pyodide');

  const resServer = await runPythonInSandbox({ code: starter, tests: aTest });
  assert.equal(resServer.passed, false, 'Unfinished starter should fail in Server');
});
