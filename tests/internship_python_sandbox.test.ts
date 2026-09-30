import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'child_process';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';

const pythonBin = process.platform === 'win32' ? 'python' : 'python3';
const checkRes = spawnSync(pythonBin, ['--version'], { encoding: 'utf8' });
// On Windows, the App Execution Alias for python exits non-zero or prints "Python was not found"
const hasPython =
  checkRes.status === 0 &&
  !String(checkRes.stderr || '').includes('Python was not found') &&
  !String(checkRes.stdout || '').includes('Python was not found');

describe('shared Python sandbox (runPythonInSandbox)', () => {
  it('import os is refused by security guard without running Python', async () => {
    const res = await runPythonInSandbox({
      code: 'import os\nprint(os.getcwd())',
      tests: 'assert True',
    });

    assert.strictEqual(res.passed, false);
    assert.strictEqual(res.isSecurityViolation, true);
    assert.strictEqual(res.status, 'SECURITY_VIOLATION');
    assert.match(res.stderr, /SECURITY GUARD/);
  });

  it(
    'passing code passes and completes cleanly',
    { skip: !hasPython && 'python3 not installed' },
    async () => {
      const res = await runPythonInSandbox({
        code: 'def add(a, b):\n    return a + b\n',
        tests: 'assert add(2, 3) == 5\nassert add(-1, 1) == 0',
      });

      assert.strictEqual(res.passed, true);
      assert.strictEqual(res.status, 'SUCCESS');
      assert.strictEqual(res.timedOut, false);
    }
  );

  it(
    'failing assert fails with ASSERTION_FAILED',
    { skip: !hasPython && 'python3 not installed' },
    async () => {
      const res = await runPythonInSandbox({
        code: 'def add(a, b):\n    return a + b\n',
        tests: 'assert add(2, 3) == 999',
      });

      assert.strictEqual(res.passed, false);
      assert.strictEqual(res.status, 'ASSERTION_FAILED');
      assert.match(res.stderr, /AssertionError/);
    }
  );

  it(
    'an infinite loop times out',
    { skip: !hasPython && 'python3 not installed' },
    async () => {
      const res = await runPythonInSandbox({
        code: 'while True:\n    pass\n',
        timeoutMs: 500,
      });

      assert.strictEqual(res.passed, false);
      assert.strictEqual(res.timedOut, true);
      assert.strictEqual(res.status, 'TIMEOUT');
    }
  );
});
