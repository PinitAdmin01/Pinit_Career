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

  it('a good typescript task passes all checks V1 through V7', async () => {
    const task: GeneratedTask = {
      title: 'Format phone numbers in TypeScript',
      brief: 'Implement formatPhone to convert a 10-digit string into the standard format (XXX) XXX-XXXX.',
      starter_code: 'export function formatPhone(digits: string): string {\n  return "";\n}\n',
      visible_tests:
        'assert(formatPhone("1234567890") === "(123) 456-7890");\nassert(formatPhone("9876543210") === "(987) 654-3210");\n',
      hidden_tests:
        'assert(formatPhone("0000000000") === "(000) 000-0000");\nassert(formatPhone("5551234567") === "(555) 123-4567");\nassert(formatPhone("1112223333") === "(111) 222-3333");\n',
      reference_solution:
        'export function formatPhone(digits: string): string {\n  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;\n}\n',
      skills: ['TypeScript', 'Strings'],
    };

    const res = await validateGeneratedTask(task, 'typescript');
    assert.strictEqual(res.ok, true);
  });

  it('a good tsx task passes all checks V1 through V7', async () => {
    const task: GeneratedTask = {
      title: 'Status Badge Component',
      brief: 'Implement a StatusBadge component that renders a span with the label text.',
      starter_code: 'export function StatusBadge({ label }: { label: string }) {\n  return <span>placeholder</span>;\n}\n',
      visible_tests:
        'const h1 = render(StatusBadge, { label: "active" });\nassert(h1.includes("active"));\nassert(h1.includes("span"));\n',
      hidden_tests:
        'const h2 = render(StatusBadge, { label: "pending" });\nassert(h2.includes("pending"));\nconst h3 = render(StatusBadge, { label: "completed" });\nassert(h3.includes("completed"));\nassert(h3.startsWith("<span"));\n',
      reference_solution:
        'export function StatusBadge({ label }: { label: string }) {\n  return <span className="status-badge">{label}</span>;\n}\n',
      skills: ['React', 'TSX'],
    };

    const res = await validateGeneratedTask(task, 'tsx');
    assert.strictEqual(res.ok, true, res.ok ? '' : `Failed at ${res.step}: ${res.reason}`);
  });

  it('fails at V2 when forbidden JavaScript/TypeScript pattern is found', async () => {
    const task: GeneratedTask = {
      title: 'Format phone numbers in TypeScript',
      brief: 'Implement formatPhone with file system access.',
      starter_code: 'const fs = require("fs");\nexport function formatPhone(digits: string): string {\n  return "";\n}\n',
      visible_tests:
        'assert(formatPhone("1234567890") === "(123) 456-7890");\nassert(formatPhone("9876543210") === "(987) 654-3210");\n',
      hidden_tests:
        'assert(formatPhone("0000000000") === "(000) 000-0000");\nassert(formatPhone("5551234567") === "(555) 123-4567");\nassert(formatPhone("1112223333") === "(111) 222-3333");\n',
      reference_solution:
        'export function formatPhone(digits: string): string {\n  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;\n}\n',
      skills: ['TypeScript'],
    };

    const res = await validateGeneratedTask(task, 'typescript');
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.step, 'V2');
      assert.match(res.reason, /Restricted JavaScript\/TypeScript pattern found/);
    }
  });

  it('fails at V4 when TypeScript hidden tests fail against reference solution', async () => {
    const task: GeneratedTask = {
      title: 'Format phone numbers in TypeScript',
      brief: 'Implement formatPhone in TypeScript.',
      starter_code: 'export function formatPhone(digits: string): string {\n  return "";\n}\n',
      visible_tests:
        'assert(formatPhone("1234567890") === "(123) 456-7890");\nassert(formatPhone("9876543210") === "(987) 654-3210");\n',
      hidden_tests:
        'assert(formatPhone("0000000000") === "WRONG");\nassert(formatPhone("5551234567") === "(555) 123-4567");\nassert(formatPhone("1112223333") === "(111) 222-3333");\n',
      reference_solution:
        'export function formatPhone(digits: string): string {\n  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;\n}\n',
      skills: ['TypeScript'],
    };

    const res = await validateGeneratedTask(task, 'typescript');
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.step, 'V4');
      assert.match(res.reason, /Reference solution failed hidden tests/);
    }
  });

  it('fails at V5 when TypeScript starter code already passes tests', async () => {
    const code =
      'export function formatPhone(digits: string): string {\n  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;\n}\n';
    const task: GeneratedTask = {
      title: 'Format phone numbers in TypeScript',
      brief: 'Implement formatPhone in TypeScript.',
      starter_code: code,
      visible_tests:
        'assert(formatPhone("1234567890") === "(123) 456-7890");\nassert(formatPhone("9876543210") === "(987) 654-3210");\n',
      hidden_tests:
        'assert(formatPhone("0000000000") === "(000) 000-0000");\nassert(formatPhone("5551234567") === "(555) 123-4567");\nassert(formatPhone("1112223333") === "(111) 222-3333");\n',
      reference_solution: code,
      skills: ['TypeScript'],
    };

    const res = await validateGeneratedTask(task, 'typescript');
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.step, 'V5');
      assert.match(res.reason, /Starter code already passes tests/);
    }
  });

  it('fails at V7 when assert count in TypeScript tests is insufficient', async () => {
    const task: GeneratedTask = {
      title: 'Format phone numbers in TypeScript',
      brief: 'Implement formatPhone in TypeScript.',
      starter_code: 'export function formatPhone(digits: string): string {\n  return "";\n}\n',
      visible_tests: 'assert(formatPhone("1234567890") === "(123) 456-7890");\n',
      hidden_tests: 'assert(formatPhone("0000000000") === "(000) 000-0000");\n',
      reference_solution:
        'export function formatPhone(digits: string): string {\n  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;\n}\n',
      skills: ['TypeScript'],
    };

    const res = await validateGeneratedTask(task, 'typescript');
    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.step, 'V7');
      assert.match(res.reason, /Visible tests must contain at least 2 assert statements/);
    }
  });
});
