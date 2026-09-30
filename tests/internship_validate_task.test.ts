import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'child_process';
import { validateGeneratedTask } from '../src/lib/internships/validateTask';
import type { GeneratedTask } from '../src/lib/internships/generateTask';

const pythonBin = process.platform === 'win32' ? 'python' : 'python3';
const checkRes = spawnSync(pythonBin, ['--version'], { encoding: 'utf8' });
const hasPython =
  checkRes.status === 0 &&
  !String(checkRes.stderr || '').includes('Python was not found') &&
  !String(checkRes.stdout || '').includes('Python was not found');

const goodPythonTask: GeneratedTask = {
  title: 'Format phone numbers',
  brief: 'Implement format_phone to convert a 10-digit string into the standard format (XXX) XXX-XXXX.',
  starter_code: 'def format_phone(digits: str) -> str:\n    pass\n',
  visible_tests:
    'assert format_phone("1234567890") == "(123) 456-7890"\nassert format_phone("9876543210") == "(987) 654-3210"\n',
  hidden_tests:
    'assert format_phone("0000000000") == "(000) 000-0000"\nassert format_phone("5551234567") == "(555) 123-4567"\nassert format_phone("1112223333") == "(111) 222-3333"\n',
  reference_solution:
    'def format_phone(digits: str) -> str:\n    return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"\n',
  skills: ['Python', 'Strings'],
};

describe('validation pipeline V1-V7 (validateGeneratedTask)', () => {
  it('fails at V1 when brief exceeds length limits', async () => {
    const task: GeneratedTask = {
      ...goodPythonTask,
      brief: 'a'.repeat(2001),
    };
    const res = await validateGeneratedTask(task);
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.step, 'V1');
      assert.match(res.reason, /exceeds 2,000 characters/);
    }
  });

  it('fails at V2 when forbidden Python patterns are found', async () => {
    const task: GeneratedTask = {
      ...goodPythonTask,
      starter_code: 'import os\ndef format_phone(digits: str) -> str:\n    pass\n',
    };
    const res = await validateGeneratedTask(task);
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.step, 'V2');
      assert.match(res.reason, /Restricted Python pattern/);
    }
  });

  it(
    'a good task passes all checks V1 through V7',
    { skip: !hasPython && 'python3 not installed' },
    async () => {
      const res = await validateGeneratedTask(goodPythonTask);
      assert.strictEqual(res.ok, true);
    }
  );

  it(
    'fails at V4 when hidden tests fail against reference solution',
    { skip: !hasPython && 'python3 not installed' },
    async () => {
      const task: GeneratedTask = {
        ...goodPythonTask,
        // Hidden test asserts impossible condition
        hidden_tests:
          'assert format_phone("1234567890") == "WRONG_OUTPUT"\nassert format_phone("0000000000") == "(000) 000-0000"\nassert format_phone("5551234567") == "(555) 123-4567"\n',
      };
      const res = await validateGeneratedTask(task);
      assert.strictEqual(res.ok, false);
      if (!res.ok) {
        assert.strictEqual(res.step, 'V4');
        assert.match(res.reason, /Reference solution failed hidden tests/);
      }
    }
  );

  it(
    'fails at V5 when starter code already passes visible and hidden tests',
    { skip: !hasPython && 'python3 not installed' },
    async () => {
      const task: GeneratedTask = {
        ...goodPythonTask,
        // Starter code is already the solution
        starter_code: goodPythonTask.reference_solution,
      };
      const res = await validateGeneratedTask(task);
      assert.strictEqual(res.ok, false);
      if (!res.ok) {
        assert.strictEqual(res.step, 'V5');
        assert.match(res.reason, /Starter code already passes tests/);
      }
    }
  );

  it(
    'fails at V6 when the brief leaks a solution line longer than 20 characters',
    { skip: !hasPython && 'python3 not installed' },
    async () => {
      const task: GeneratedTask = {
        ...goodPythonTask,
        brief:
          'Implement format_phone. Hint: return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"',
      };
      const res = await validateGeneratedTask(task);
      assert.strictEqual(res.ok, false);
      if (!res.ok) {
        assert.strictEqual(res.step, 'V6');
        assert.match(res.reason, /Brief leaks reference solution/);
      }
    }
  );
});
