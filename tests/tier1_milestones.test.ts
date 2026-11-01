import test from 'node:test';
import assert from 'node:assert/strict';
import { generateTier1Tasks } from '../src/lib/internships/tier1Tickets';
import { validateGeneratedTask } from '../src/lib/internships/validateTask';
import { taskToClient } from '../src/lib/internships/toClient';
import { runPythonInSandbox } from '../src/lib/server/pythonSandbox';
import type { InternshipTaskRow, ClientInternshipTask } from '../src/lib/internships/types';

test('Tier 1 Python 14-Day 5-Milestone Suite', async (t) => {
  await t.test('generateTier1Tasks produces 5 complete milestones for python_ai', async () => {
    const res = await generateTier1Tasks({
      companyProfile: { name: 'ApexRetail', industry: 'E-Commerce', readme: 'Fictional README' },
      seed: 'test-seed-123',
      track: 'python_ai',
    });

    assert.equal(res.ok, true);
    if (!res.ok) return;
    assert.equal(res.tickets.length, 5);

    for (const ticket of res.tickets) {
      // 1. Company customization verification
      assert.match(ticket.task.brief, /ApexRetail/);

      // 2. Full V1-V7 pipeline verification (runs full sandbox checks in test suite)
      const val = await validateGeneratedTask(ticket.task, 'python');
      assert.equal(val.ok, true, `Milestone ${ticket.seq} must pass V1-V7: ${!val.ok ? val.reason : ''}`);

      // 3. Negative check: starter code fails specifically for test reasons, not infrastructure crashes
      const starterRes = await runPythonInSandbox({
        code: ticket.task.starter_code,
        tests: `${ticket.task.visible_tests}\n${ticket.task.hidden_tests}`,
        timeoutMs: 4000,
      });
      assert.equal(starterRes.passed, false, `Milestone ${ticket.seq} starter code must not pass`);
      assert.notEqual(starterRes.status, 'TIMEOUT', 'Must not fail due to sandbox timeout');
      assert.notEqual(starterRes.status, 'ENVIRONMENT_ERROR', 'Must not fail due to environment error');
      assert.notEqual(starterRes.status, 'SECURITY_VIOLATION', 'Must not trigger security guard violations');

      // 4. Client payload privacy: typed verification (no as any)
      const dbRow: InternshipTaskRow = {
        id: `00000000-0000-0000-0000-00000000000${ticket.seq}`,
        internship_enrollment_id: '00000000-0000-0000-0000-000000000099',
        seq: ticket.seq,
        week: 1,
        kind: ticket.kind,
        language: 'python',
        title: ticket.task.title,
        brief: ticket.task.brief,
        starter_code: ticket.task.starter_code,
        visible_tests: ticket.task.visible_tests,
        hidden_tests: ticket.task.hidden_tests,
        reference_solution: ticket.task.reference_solution,
        sql_setup: null,
        skills: ticket.task.skills,
        status: 'open',
        attempts: 0,
        passed_at: null,
        model: ticket.model,
        generation_meta: null,
        created_at: new Date().toISOString(),
      };

      const clientTask: ClientInternshipTask = taskToClient(dbRow);
      const clientRecord = clientTask as unknown as Record<string, unknown>;

      assert.equal(clientRecord['hidden_tests'], undefined);
      assert.equal(clientRecord['hiddenTests'], undefined);
      assert.equal(clientRecord['reference_solution'], undefined);
      assert.equal(clientRecord['referenceSolution'], undefined);
      assert.equal(clientRecord['model'], undefined);
      assert.equal(clientRecord['generation_meta'], undefined);
    }
  });

  await t.test('company profile customization cannot alter code or test contracts', async () => {
    const resA = await generateTier1Tasks({
      companyProfile: { name: 'AlphaCorp', industry: 'Fintech', readme: 'Readme A' },
      seed: 'seed-A',
      track: 'python_ai',
    });
    const resB = await generateTier1Tasks({
      companyProfile: { name: 'BetaLogistics', industry: 'Logistics', readme: 'Readme B' },
      seed: 'seed-B',
      track: 'python_ai',
    });

    assert.equal(resA.ok, true);
    assert.equal(resB.ok, true);
    if (!resA.ok || !resB.ok) return;

    for (let i = 0; i < 5; i++) {
      const taskA = resA.tickets[i].task;
      const taskB = resB.tickets[i].task;

      // Starter code, tests, and solutions are 100% identical regardless of company name
      assert.equal(taskA.starter_code, taskB.starter_code);
      assert.equal(taskA.visible_tests, taskB.visible_tests);
      assert.equal(taskA.hidden_tests, taskB.hidden_tests);
      assert.equal(taskA.reference_solution, taskB.reference_solution);
      assert.deepEqual(taskA.skills, taskB.skills);

      // Only the brief contains the tailored company name
      assert.match(taskA.brief, /AlphaCorp/);
      assert.match(taskB.brief, /BetaLogistics/);
    }
  });

  await t.test('special characters and regex tokens in company profile name do not corrupt the brief', async () => {
    const specialNames = [
      'Apex $100 Bargains',
      'Tech & Co ($& Specials)',
      "O'Reilly & Sons ($1)",
      'Super $$$ Mega Store',
    ];

    for (const name of specialNames) {
      const res = await generateTier1Tasks({
        companyProfile: { name, industry: 'Retail', readme: 'Special chars test' },
        seed: 'seed-special',
        track: 'python_ai',
      });

      assert.equal(res.ok, true);
      if (!res.ok) continue;

      for (const ticket of res.tickets) {
        assert.equal(ticket.task.brief.includes(name), true, `Brief must contain exact name "${name}" without regex corruption`);
      }
    }
  });

  await t.test('Milestone 5 preloaded apply_tiered_promotion matches Milestone 2 case-insensitivity contract', async () => {
    const res = await generateTier1Tasks({
      companyProfile: { name: 'TestCo', industry: 'Retail', readme: 'Test' },
      seed: 'seed-test',
      track: 'python_ai',
    });
    assert.equal(res.ok, true);
    if (!res.ok) return;

    const m5Task = res.tickets[4].task;
    const testSnippet = `
${m5Task.starter_code}
res = apply_tiered_promotion(Decimal("600.00"), is_vip=False, promo_code="tiered")
assert res == Decimal("60.00"), f"Expected 60.00 but got {res}"
`;
    const runRes = await runPythonInSandbox({ code: testSnippet, timeoutMs: 3000 });
    assert.equal(runRes.passed, true, 'Milestone 5 starter code helper must accept lowercase "tiered"');
  });

  await t.test('Milestone 3 build_catalog_index handles None and invalid input gracefully', async () => {
    const res = await generateTier1Tasks({
      companyProfile: { name: 'TestCo', industry: 'Retail', readme: 'Test' },
      seed: 'seed-test',
      track: 'python_ai',
    });
    assert.equal(res.ok, true);
    if (!res.ok) return;

    const m3Task = res.tickets[2].task;
    const testSnippet = `
${m3Task.reference_solution}
assert build_catalog_index(None) == {}
assert build_catalog_index("not_a_list") == {}
assert build_catalog_index([]) == {}
`;
    const runRes = await runPythonInSandbox({ code: testSnippet, timeoutMs: 3000 });
    assert.equal(runRes.passed, true, 'Milestone 3 build_catalog_index must handle None and non-list gracefully');
  });
});
