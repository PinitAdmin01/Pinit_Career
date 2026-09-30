import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'child_process';
import { setLlmJsonTransportForTests } from '../src/lib/server/llmJson';
import {
  generateTier1Tasks,
  TIER1_TICKET_KINDS,
  TIER1_MONTH1_PYTHON_SKILLS,
} from '../src/lib/internships/tier1Tickets';
import { taskToClient, enrollmentToClient } from '../src/lib/internships/toClient';
import { checkRateLimit } from '../src/lib/server/rateLimit';

const pythonBin = process.platform === 'win32' ? 'python' : 'python3';
const checkRes = spawnSync(pythonBin, ['--version'], { encoding: 'utf8' });
const hasPython =
  checkRes.status === 0 &&
  !String(checkRes.stderr || '').includes('Python was not found') &&
  !String(checkRes.stdout || '').includes('Python was not found');

describe('internship routes & Tier 1 task generation (T-15)', () => {
  afterEach(() => {
    setLlmJsonTransportForTests(null);
  });

  it('TIER1_TICKET_KINDS has all 5 required ticket types in order', () => {
    assert.deepStrictEqual(TIER1_TICKET_KINDS, [
      'bug_fix',
      'new_function',
      'data_cleaning',
      'refactor',
      'small_feature',
    ]);
  });

  it('TIER1_MONTH1_PYTHON_SKILLS contains core Python fundamentals', () => {
    assert.ok(TIER1_MONTH1_PYTHON_SKILLS.includes('Python Functions'));
    assert.ok(TIER1_MONTH1_PYTHON_SKILLS.includes('Loops and Iteration'));
    assert.ok(TIER1_MONTH1_PYTHON_SKILLS.includes('Error Handling and Exceptions'));
  });

  it('rate limiting restricts internship_start to 1 request per 10 minutes', () => {
    const testKey = `internship_start_test_student_${Date.now()}`;
    const firstCheck = checkRateLimit(testKey, { limit: 1, windowMs: 600_000 });
    assert.strictEqual(firstCheck.allowed, true);

    const secondCheck = checkRateLimit(testKey, { limit: 1, windowMs: 600_000 });
    assert.strictEqual(secondCheck.allowed, false);
    assert.ok(secondCheck.resetSec > 0);
  });

  it(
    'generateTier1Tasks produces all 5 validated tickets with mock AI',
    { skip: !hasPython && 'python3 not installed' },
    async () => {
      let callCount = 0;
      setLlmJsonTransportForTests(async () => {
        callCount++;
        return JSON.stringify({
          title: `Task Ticket ${callCount}`,
          brief: `A ticket brief describing user requirement for task ${callCount} with all necessary constraints and context.`,
          starter_code: `def solution_${callCount}():\n    pass\n`,
          visible_tests: `assert solution_${callCount}() == ${callCount}\nassert solution_${callCount}() > 0\n`,
          hidden_tests: `assert solution_${callCount}() != 0\nassert solution_${callCount}() == ${callCount}\nassert type(solution_${callCount}()) is int\n`,
          reference_solution: `def solution_${callCount}():\n    return ${callCount}\n`,
          skills: ['Python', 'Functions'],
        });
      });

      const res = await generateTier1Tasks({
        companyProfile: {
          name: 'Apex Dispatch',
          industry: 'Route Logistics',
          readme:
            'This is a fictional company created for your internship simulation.',
        },
        seed: 'test-seed-t15',
      });

      assert.strictEqual(res.ok, true);
      if (res.ok) {
        assert.strictEqual(res.tickets.length, 5);
        assert.strictEqual(res.tickets[0].kind, 'bug_fix');
        assert.strictEqual(res.tickets[1].kind, 'new_function');
        assert.strictEqual(res.tickets[2].kind, 'data_cleaning');
        assert.strictEqual(res.tickets[3].kind, 'refactor');
        assert.strictEqual(res.tickets[4].kind, 'small_feature');
      }
    }
  );
});
