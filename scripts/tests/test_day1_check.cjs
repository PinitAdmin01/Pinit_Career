const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'py-test-'));

const p2TestSuite = `
import sys, inspect
_cap = sys.stdout.getvalue() if hasattr(sys.stdout, 'getvalue') else ''
_fn = globals().get('say_hello')
_val1 = None
_val2 = None
if callable(_fn):
    try:
        _val1 = _fn('Asha')
        _val2 = _fn('Ravi')
    except Exception:
        pass
if hasattr(sys.stdout, 'getvalue'):
    _cap += ' ' + sys.stdout.getvalue()
_src = ''
if 'solution' in sys.modules:
    try:
        _src = inspect.getsource(sys.modules['solution'])
    except Exception:
        pass

assert (_val1 == 'Hello, Asha' and _val2 == 'Hello, Ravi') or ('Hello, Asha' in _cap) or ('print' in _src and 'Hello' in _src), "Expected 'Hello, Asha!' to be printed to the screen"
print('All checks passed.')
`;

function testCode(code) {
  fs.writeFileSync(path.join(dir, 'solution.py'), code);
  const indented = p2TestSuite.split('\n').map((line) => '    ' + line).join('\n');
  fs.writeFileSync(path.join(dir, 'runner.py'), `from solution import *
try:
${indented}
    print('PASSED')
except AssertionError as e:
    raise SystemExit(f'AssertionError: {e}')
`);
  const r = spawnSync('python', ['runner.py'], { cwd: dir, encoding: 'utf8', timeout: 5000 });
  return { ok: r.status === 0 && r.stdout.includes('PASSED'), out: `${r.stdout}${r.stderr}` };
}

function testInBrowserSandbox(code) {
  const fullScript = `
import sys, io, json
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()

${code}

# --- Authoritative Test Suite ---
${p2TestSuite}

_stdout_log = sys.stdout.getvalue()
_stderr_log = sys.stderr.getvalue()
_test_passed = 'TRUE'
sys.__stdout__.write(_stdout_log + "\\nSTATUS: " + _test_passed)
`;
  fs.writeFileSync(path.join(dir, 'browser_runner.py'), fullScript);
  const r = spawnSync('python', ['browser_runner.py'], { cwd: dir, encoding: 'utf8', timeout: 5000 });
  return { ok: r.status === 0 && r.stdout.includes('STATUS: TRUE'), out: `${r.stdout}${r.stderr}` };
}

console.log('--- Practice 2: Beginner prints directly: print("Hello, Asha!") ---');
console.log('Server runner:', testCode('print("Hello, Asha!")').ok);
console.log('Browser runner:', testInBrowserSandbox('print("Hello, Asha!")').ok);

console.log('--- Practice 2: Legacy function with return ---');
const legacyP2 = `def say_hello(name):
    return 'Hello, ' + name`;
console.log('Server runner:', testCode(legacyP2).ok);
console.log('Browser runner:', testInBrowserSandbox(legacyP2).ok);

console.log('--- Practice 2: Starter code (MUST FAIL) ---');
const starterP2 = `# Print a greeting to Asha below
`;
console.log('Server runner starter fails?', !testCode(starterP2).ok);
console.log('Browser runner starter fails?', !testInBrowserSandbox(starterP2).ok);

fs.rmSync(dir, { recursive: true, force: true });
