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
});
