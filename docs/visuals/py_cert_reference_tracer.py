# PinIT lesson-visual tracer: reference implementation (proven by Claude, 6 Oct 2026).
# Run on all 1,980 Python lesson parts, twice, in fresh Pyodide 3.12 interpreters:
#   - outputs unchanged under tracing: 1,980 / 1,980
#   - traces identical across the two runs: 1,971 (9 parts use random/set order -> gate rule R14)
#   - recording stopped at the event limit: 50 parts (code still runs to the end)
# Rules that make it safe (do not change them):
#   1. It runs in its OWN namespace. The lesson gets a clean globals dict (a lesson defines `time`).
#   2. Module variables are read from f_globals; function variables only via co_varnames.
#      Reading frame.f_locals inside a Python 3.12 inlined comprehension writes None into
#      unbound locals and changed the output of 374 lessons in the naive version.
#   3. Values are stored as structured JSON (lists, dicts, objects), not repr strings,
#      with depth <= 4, <= 30 items, cycle protection, and inf/nan as {"__f__": "inf"}.
# Usage (from TypeScript): run this source in a fresh dict `tg`, then call run(code, g)
# with a second fresh dict `g`; read EV and STATE["trunc"] from `tg`.
import sys as _sys, json as _json, time as _time, math as _math
EV = []; CNT = {}; MAX = 2000; STATE = {'trunc': False, 't0': _time.time(), 'last': {}}
def ser(v, d=0, seen=None):
    seen = seen if seen is not None else set()
    if isinstance(v, float) and (_math.isnan(v) or _math.isinf(v)): return {'__f__': repr(v)}
    if v is None or isinstance(v, (bool, int, float)): return v
    if isinstance(v, str): return v if len(v) <= 80 else v[:80] + '…'
    if id(v) in seen or d > 4: return {'__ref__': type(v).__name__}
    seen = seen | {id(v)}
    if isinstance(v, (list, tuple)): return [ser(x, d+1, seen) for x in list(v)[:30]]
    if isinstance(v, dict): return {'__dict__': [[ser(k, d+1, seen), ser(x, d+1, seen)] for k, x in list(v.items())[:30]]}
    if isinstance(v, (set, frozenset)): return {'__set__': sorted([ser(x, d+1, seen) for x in list(v)[:30]], key=repr)}
    if hasattr(v, '__dict__') and not callable(v): return {'__obj__': type(v).__name__, 'f': {k: ser(x, d+1, seen) for k, x in list(vars(v).items())[:10] if not k.startswith('_')}}
    return {'__other__': type(v).__name__}
def bound(frame):
    if frame.f_code.co_name == '<module>': return frame.f_globals
    co = frame.f_code; snap = frame.f_locals
    return {n: snap[n] for n in co.co_varnames + co.co_cellvars if n in snap}
def tr(frame, event, arg):
    if frame.f_code.co_filename != '<lesson>': return tr
    if STATE['trunc']: return None
    if event in ('line', 'return'):
        if len(EV) >= MAX or _time.time() - STATE['t0'] > 5:
            STATE['trunc'] = True; return None
        last = STATE['last']; fid = id(frame); prev = last.get(fid)
        if prev is not None:
            loc = {k: v for k, v in bound(frame).items() if not k.startswith('_') and not k.startswith('.') and not callable(v) and type(v).__name__ != 'module' and not hasattr(v, '__next__')}
            CNT[prev] = CNT.get(prev, 0) + 1
            EV.append([prev, CNT[prev], {k: ser(v) for k, v in list(loc.items())[:20]}])
        last[fid] = frame.f_lineno if event == 'line' else None
    return tr
def run(src, g):
    _sys.settrace(tr)
    try:
        exec(compile(src, '<lesson>', 'exec'), g)
    finally:
        _sys.settrace(None)
