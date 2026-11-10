const { findForbiddenPython } = require('../../src/lib/code/python/pythonGuard');

const p1TestSuite = `
_printed = []
_orig_print = print
def _capturing_print(*args, **kwargs):
    _printed.append(" ".join(str(a) for a in args))
    try:
        _orig_print(*args, **kwargs)
    except Exception:
        pass

print = _capturing_print
_fn = globals().get('page_title')
_res = None
try:
    if callable(_fn):
        _res = _fn()
    else:
        _res = globals().get('page_title')
finally:
    print = _orig_print

_cap = globals().get('_captured_stdout_', '')
_all_text = " ".join(_printed) + " " + str(_res or '') + " " + str(_cap)
assert 'My Expense Tracker' in _all_text, "Expected 'My Expense Tracker' to be printed or returned"
print('All checks passed.')
`;

const p2TestSuite = `
_printed = []
_orig_print = print
def _capturing_print(*args, **kwargs):
    _printed.append(" ".join(str(a) for a in args))
    try:
        _orig_print(*args, **kwargs)
    except Exception:
        pass

print = _capturing_print
_fn = globals().get('say_hello')
_val1 = None
_val2 = None
try:
    if callable(_fn):
        _val1 = _fn('Asha')
        _val2 = _fn('Ravi')
finally:
    print = _orig_print

_cap = globals().get('_captured_stdout_', '')
_all_text = " ".join(_printed) + " " + str(_val1 or '') + " " + str(_val2 or '') + " " + str(_cap)
assert (_val1 == 'Hello, Asha' and _val2 == 'Hello, Ravi') or ('Asha' in _all_text and 'Hello' in _all_text), "Expected 'Hello, Asha!' to be printed or returned"
print('All checks passed.')
`;

console.log('P1 security check:', findForbiddenPython(p1TestSuite) ? 'BLOCKED' : 'CLEAN');
console.log('P2 security check:', findForbiddenPython(p2TestSuite) ? 'BLOCKED' : 'CLEAN');
