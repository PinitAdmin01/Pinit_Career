import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTaskPrompt,
  FORBIDDEN_WORDS_LIST,
  GeneratedTaskSchema,
} from '../src/lib/internships/generateTask';

describe('internship task prompt builder and schema (T-10)', () => {
  it('buildTaskPrompt contains every listed skill in both system and user prompts', () => {
    const testSkills = ['FastAPI', 'Pydantic', 'pytest', 'Algorithms', 'PostgreSQL'];
    const { system, user } = buildTaskPrompt({
      tier: 't1_job_sim',
      kind: 'bug_fix',
      skills: testSkills,
      companyProfile: {
        name: 'Apex Logistics',
        business: 'Autonomous dispatch systems',
      },
      seed: 'seed-xyz-1234',
    });

    for (const skill of testSkills) {
      assert.ok(
        system.includes(skill),
        `System prompt should contain skill: ${skill}`
      );
      assert.ok(
        user.includes(skill),
        `User prompt should contain skill: ${skill}`
      );
    }
  });

  it('buildTaskPrompt contains the forbidden-word list in the system prompt', () => {
    const { system } = buildTaskPrompt({
      tier: 't1_job_sim',
      kind: 'refactor',
      skills: ['Python'],
      companyProfile: {
        name: 'TestCorp',
        business: 'Testing services',
      },
      seed: 'seed-456',
    });

    for (const word of FORBIDDEN_WORDS_LIST) {
      assert.ok(
        system.includes(word),
        `System prompt should explicitly list forbidden token: ${word}`
      );
    }
  });

  it('GeneratedTaskSchema validates a conforming generated task object', () => {
    const validTask = {
      title: 'Fix customer email validation',
      brief: 'Update the validation function to reject emails with multiple @ signs and ensure proper domain parsing.',
      starter_code: 'def validate_email(email: str) -> bool:\n    pass\n',
      visible_tests: 'assert validate_email("test@example.com") == True\nassert validate_email("invalid@@test.com") == False\n',
      hidden_tests: 'assert validate_email("plainaddress") == False\nassert validate_email("@missingusername.com") == False\nassert validate_email("user@domain..com") == False\n',
      reference_solution: 'def validate_email(email: str) -> bool:\n    if email.count("@") != 1:\n        return False\n    user, domain = email.split("@")\n    return bool(user and domain and "." in domain and not ".." in domain)\n',
      skills: ['Python', 'Functions', 'Strings'],
    };

    const parsed = GeneratedTaskSchema.safeParse(validTask);
    assert.strictEqual(parsed.success, true);
  });

  it('GeneratedTaskSchema rejects tasks violating constraints', () => {
    const invalidShort = {
      title: 'Hi', // too short (<3)
      brief: 'Short', // too short (<20)
      starter_code: 'code',
      visible_tests: 'tests',
      hidden_tests: 'tests',
      reference_solution: 'sol',
      skills: [], // empty skills
    };

    const parsed = GeneratedTaskSchema.safeParse(invalidShort);
    assert.strictEqual(parsed.success, false);
  });

  it('buildTaskPrompt generates a dedicated TypeScript/TSX prompt (F-08)', () => {
    const { system: tsSystem, user: tsUser } = buildTaskPrompt({
      tier: 't1_job_sim',
      kind: 'small_feature',
      skills: ['React Components', 'State Management (useState)'],
      companyProfile: {
        name: 'CloudPulse Analytics',
        business: 'Monitoring telemetry',
      },
      seed: 'seed-ts-123',
      language: 'tsx',
    });

    // Must require export function declarations
    assert.ok(tsSystem.includes('export function'), 'Prompt must instruct export function declarations');
    // Must require assert(...) statement form
    assert.ok(tsSystem.includes('assert('), 'Prompt must instruct assert(...) function call form');
    // Must mention render(...) for TSX
    assert.ok(tsSystem.includes('render('), 'Prompt must instruct render(...) helper for TSX');
    // Must ban jsGuard APIs
    assert.ok(tsSystem.includes('fetch'), 'Prompt must ban fetch');
    assert.ok(tsSystem.includes('eval'), 'Prompt must ban eval');
    assert.ok(tsSystem.includes('Function'), 'Prompt must ban Function');
    assert.ok(tsSystem.includes('process'), 'Prompt must ban process');
    assert.ok(tsSystem.includes('globalThis'), 'Prompt must ban globalThis');
    assert.ok(tsSystem.includes('constructor'), 'Prompt must ban constructor');
    // Must not ask for Python syntax
    assert.ok(!tsSystem.includes('syntactically valid Python/SQL'), 'Must not ask for Python/SQL');
    assert.ok(!tsSystem.includes('assert <expression> == <expected>'), 'Must not ask for Python assert x == y');
  });

  it('validation V1-V7 passes for valid TS task and rejects Python-style task for typescript (F-08)', async () => {
    const { validateGeneratedTask } = await import('../src/lib/internships/validateTask');

    const validTsTask = {
      title: 'Calculate server uptime percentage',
      brief: 'Implement calculateUptime(totalMinutes, downMinutes) returning the uptime percentage rounded to 2 decimals.',
      starter_code: 'export function calculateUptime(totalMinutes: number, downMinutes: number): number {\n  return 0;\n}\n',
      visible_tests: 'assert(calculateUptime(100, 1) === 99);\nassert(calculateUptime(1000, 50) === 95);\n',
      hidden_tests: 'assert(calculateUptime(200, 0) === 100);\nassert(calculateUptime(500, 250) === 50);\nassert(calculateUptime(1000, 1000) === 0);\n',
      reference_solution: 'export function calculateUptime(totalMinutes: number, downMinutes: number): number {\n  if (totalMinutes <= 0) return 0;\n  const up = totalMinutes - downMinutes;\n  return Math.round((up / totalMinutes) * 10000) / 100;\n}\n',
      skills: ['TypeScript', 'Functions'],
    };

    const validRes = await validateGeneratedTask(validTsTask, 'typescript');
    assert.strictEqual(validRes.ok, true, `Valid TS task failed: ${!validRes.ok ? validRes.reason : ''}`);

    const pythonStyleTask = {
      title: 'Calculate server uptime percentage in Python',
      brief: 'Implement calculate_uptime in Python for server stats.',
      starter_code: 'def calculate_uptime(total, down):\n    pass\n',
      visible_tests: 'assert calculate_uptime(100, 1) == 99\nassert calculate_uptime(1000, 50) == 95\n',
      hidden_tests: 'assert calculate_uptime(200, 0) == 100\nassert calculate_uptime(500, 250) == 50\nassert calculate_uptime(1000, 1000) == 0\n',
      reference_solution: 'def calculate_uptime(total, down):\n    return round(((total - down) / total) * 100, 2)\n',
      skills: ['Python'],
    };

    const invalidRes = await validateGeneratedTask(pythonStyleTask, 'typescript');
    assert.strictEqual(invalidRes.ok, false, 'Python task must be rejected for typescript language');
  });
});
