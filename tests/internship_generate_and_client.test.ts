import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'child_process';
import { setLlmJsonTransportForTests } from '../src/lib/server/llmJson';
import { generateValidatedTask } from '../src/lib/internships/generateTask';
import { taskToClient, enrollmentToClient } from '../src/lib/internships/toClient';
import type { InternshipTaskRow, InternshipEnrollmentRow } from '../src/lib/internships/types';

const pythonBin = process.platform === 'win32' ? 'python' : 'python3';
const checkRes = spawnSync(pythonBin, ['--version'], { encoding: 'utf8' });
const hasPython =
  checkRes.status === 0 &&
  !String(checkRes.stderr || '').includes('Python was not found') &&
  !String(checkRes.stdout || '').includes('Python was not found');

describe('generate-and-validate loop & client security boundaries (T-12)', () => {
  afterEach(() => {
    setLlmJsonTransportForTests(null);
  });

  it('taskToClient output strictly excludes hidden tests and reference solution', () => {
    const mockDbRow: InternshipTaskRow = {
      id: 'task-uuid-1',
      internship_enrollment_id: 'enrollment-uuid-1',
      seq: 1,
      week: 1,
      kind: 'bug_fix',
      language: 'python',
      title: 'Fix edge case in payment retry',
      brief: 'Ensure payment gateway retry returns proper enum on network failure.',
      starter_code: 'def retry_payment(): pass',
      visible_tests: 'assert retry_payment() is not None',
      hidden_tests: 'assert retry_payment() == "RETRY_EXHAUSTED"',
      reference_solution: 'def retry_payment(): return "RETRY_EXHAUSTED"',
      sql_setup: null,
      skills: ['Python', 'FastAPI'],
      status: 'open',
      attempts: 2,
      passed_at: null,
      model: 'qwen/qwen-2.5-coder-32b-instruct',
      generation_meta: { seed: 'test-seed-123', temperature: 0.2 },
      created_at: '2026-10-01T12:00:00Z',
    };

    const clientTask = taskToClient(mockDbRow);
    const keys = Object.keys(clientTask);

    // CRITICAL: Prove no hidden data or solution leaves the server
    assert.strictEqual('hidden_tests' in clientTask, false);
    assert.strictEqual('hiddenTests' in clientTask, false);
    assert.strictEqual('reference_solution' in clientTask, false);
    assert.strictEqual('referenceSolution' in clientTask, false);
    assert.strictEqual('model' in clientTask, false);
    assert.strictEqual('generation_meta' in clientTask, false);

    assert.ok(!keys.includes('hidden_tests'));
    assert.ok(!keys.includes('hiddenTests'));
    assert.ok(!keys.includes('reference_solution'));
    assert.ok(!keys.includes('referenceSolution'));
    assert.ok(!keys.includes('model'));
    assert.ok(!keys.includes('generation_meta'));

    // Client fields match
    assert.strictEqual(clientTask.id, 'task-uuid-1');
    assert.strictEqual(clientTask.internshipEnrollmentId, 'enrollment-uuid-1');
    assert.strictEqual(clientTask.title, 'Fix edge case in payment retry');
    assert.strictEqual(clientTask.starterCode, 'def retry_payment(): pass');
    assert.strictEqual(clientTask.visibleTests, 'assert retry_payment() is not None');
  });

  it('enrollmentToClient formats enrollment cleanly', () => {
    const mockEnrollment: InternshipEnrollmentRow = {
      id: 'enr-1',
      student_id: 'stu-1',
      crash_enrollment_id: 'crash-1',
      tier: 't1_job_sim',
      track: 'python_ai',
      status: 'active',
      started_at: '2026-10-01T00:00:00Z',
      due_at: '2026-10-15T00:00:00Z',
      extended: false,
      restarts: 0,
      completed_at: null,
      certificate_id: null,
      company_profile: { name: 'Apex' },
      final_report: null,
      final_report_check: null,
      created_at: '2026-10-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    };

    const clientEnr = enrollmentToClient(mockEnrollment);
    assert.strictEqual(clientEnr.id, 'enr-1');
    assert.strictEqual(clientEnr.studentId, 'stu-1');
    assert.strictEqual(clientEnr.crashEnrollmentId, 'crash-1');
    assert.strictEqual(clientEnr.tier, 't1_job_sim');
    assert.strictEqual(clientEnr.status, 'active');
  });

  it('generateValidatedTask returns ok: false with reasons when all attempts fail', async () => {
    let callCount = 0;
    setLlmJsonTransportForTests(async () => {
      callCount++;
      return 'Not a JSON object';
    });

    const res = await generateValidatedTask({
      tier: 't1_job_sim',
      kind: 'bug_fix',
      skills: ['Python'],
      companyProfile: { name: 'Acme', business: 'Manufacturing' },
      seed: 'seed-fail',
      maxAttempts: 3,
    });

    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.reasons.length, 3);
      assert.strictEqual(callCount, 3);
    }
  });

  it(
    'generateValidatedTask retries on bad output and succeeds on attempt 2',
    { skip: !hasPython && 'python3 not installed' },
    async () => {
      let callCount = 0;
      setLlmJsonTransportForTests(async () => {
        callCount++;
        if (callCount === 1) {
          // Attempt 1: Schema violation (title too short)
          return JSON.stringify({
            title: 'No',
            brief: 'Too short',
            starter_code: 'pass',
            visible_tests: 'assert True',
            hidden_tests: 'assert True',
            reference_solution: 'pass',
            skills: ['Python'],
          });
        }
        // Attempt 2: Fully valid task that passes all V1-V7 checks
        return JSON.stringify({
          title: 'Calculate tax rate',
          brief: 'Implement calculate_tax to apply an 8% tax rate to a given subtotal number.',
          starter_code: 'def calculate_tax(subtotal: float) -> float:\n    pass\n',
          visible_tests: 'assert calculate_tax(100.0) == 8.0\nassert calculate_tax(50.0) == 4.0\n',
          hidden_tests: 'assert calculate_tax(0.0) == 0.0\nassert calculate_tax(200.0) == 16.0\nassert calculate_tax(10.0) == 0.8\n',
          reference_solution: 'def calculate_tax(subtotal: float) -> float:\n    return round(subtotal * 0.08, 2)\n',
          skills: ['Python', 'Math'],
        });
      });

      const res = await generateValidatedTask({
        tier: 't1_job_sim',
        kind: 'new_function',
        skills: ['Python'],
        companyProfile: { name: 'FinCorp', business: 'Accounting SaaS' },
        seed: 'seed-retry',
        maxAttempts: 3,
      });

      assert.strictEqual(res.ok, true);
      if (res.ok) {
        assert.strictEqual(res.attempts, 2);
        assert.strictEqual(res.task.title, 'Calculate tax rate');
      }
    }
  );
});
