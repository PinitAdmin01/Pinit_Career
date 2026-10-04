import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  TIER2_WEB_TASK_SPECS,
  TIER2_WEB_REACT_SKILLS,
  TIER2_WEB_NODE_SKILLS,
  TIER2_SQL_SKILLS,
} from '../src/lib/internships/tier2Tasks';
import {
  getDeterministicWebProductBrief,
  getDeterministicWebTier2Tasks,
} from './fixtures/deterministicInternshipData';
import { validateGeneratedTask } from '../src/lib/internships/validateTask';
import { executeTicketCode } from '../src/lib/internships/submission';
import { ProductBriefSchema } from '../src/lib/internships/productBrief';

describe('Web Virtual Internship Backlog and Tasks (W-132 / Tier 2)', () => {
  it('getDeterministicWebProductBrief conforms to ProductBriefSchema and covers React + Node + PostgreSQL', () => {
    const brief = getDeterministicWebProductBrief('test-web-tier2-seed', false);
    const parsed = ProductBriefSchema.safeParse(brief);
    assert.strictEqual(parsed.success, true);
    assert.ok(brief.productName.length >= 3);
    assert.ok(brief.summary.includes('React'));
    assert.ok(brief.summary.includes('Node.js'));
    assert.ok(brief.summary.includes('PostgreSQL'));
    assert.strictEqual(brief.dataModel.length, 4);
    assert.strictEqual(brief.stories.length, 14);
  });

  it('TIER2_WEB_TASK_SPECS has exactly 8 tasks with 1 TSX/TS + 1 SQL per week', () => {
    assert.strictEqual(TIER2_WEB_TASK_SPECS.length, 8);
    const weeks = TIER2_WEB_TASK_SPECS.map((s) => s.week);
    assert.deepStrictEqual(weeks, [1, 1, 2, 2, 3, 3, 4, 4]);

    const languages = TIER2_WEB_TASK_SPECS.map((s) => s.language);
    assert.deepStrictEqual(languages, [
      'tsx',
      'sql',
      'typescript',
      'sql',
      'tsx',
      'sql',
      'typescript',
      'sql',
    ]);
  });

  it('TIER2_WEB_REACT_SKILLS and TIER2_WEB_NODE_SKILLS contain core Months 1-3 web skills', () => {
    assert.ok(TIER2_WEB_REACT_SKILLS.includes('React Components'));
    assert.ok(TIER2_WEB_REACT_SKILLS.includes('State Management (useState)'));
    assert.ok(TIER2_WEB_NODE_SKILLS.includes('Node.js Request Validation'));
    assert.ok(TIER2_WEB_NODE_SKILLS.includes('HTTP Status Codes and Error Responses'));
  });

  it('getDeterministicWebTier2Tasks generates 8 tasks conforming to specs', () => {
    const brief = getDeterministicWebProductBrief('test-seed');
    const tasks = getDeterministicWebTier2Tasks(brief.stories);
    assert.strictEqual(tasks.length, 8);

    for (let i = 0; i < 8; i++) {
      const t = tasks[i];
      const spec = TIER2_WEB_TASK_SPECS[i];
      assert.strictEqual(t.seq, spec.seq);
      assert.strictEqual(t.week, spec.week);
      assert.strictEqual(t.kind, spec.kind);
      assert.strictEqual(t.language, spec.language);
      assert.ok(t.task.title.length > 5);
      assert.ok(t.task.brief.length > 20);
      assert.ok(t.task.visible_tests.length > 10);
      assert.ok(t.task.hidden_tests.length > 10);
      assert.ok(t.task.reference_solution.length > 10);
    }
  });

  it('each of the 8 web Tier 2 tasks passes V1-V7 validation pipeline', async () => {
    const brief = getDeterministicWebProductBrief('test-seed');
    const tasks = getDeterministicWebTier2Tasks(brief.stories);

    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      const valRes = await validateGeneratedTask(t.task, t.language);
      assert.strictEqual(
        valRes.ok,
        true,
        `Task ${t.seq} (${t.task.title}, ${t.language}) failed validation: ${!valRes.ok ? valRes.reason : ''}`
      );
    }
  });

  it('each of the 8 web Tier 2 tasks passes real server grader with reference solution', async () => {
    const brief = getDeterministicWebProductBrief('test-seed');
    const tasks = getDeterministicWebTier2Tasks(brief.stories);

    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      const execRes = await executeTicketCode({
        language: t.language,
        code: t.task.reference_solution,
        visibleTests: t.task.visible_tests,
        hiddenTests: t.task.hidden_tests,
        sqlSetup: t.task.sql_setup,
      });

      assert.strictEqual(
        execRes.passed,
        true,
        `Task ${t.seq} (${t.task.title}) reference solution should pass: ${execRes.output}`
      );
    }
  });

  it('each of the 8 web Tier 2 tasks fails real server grader with starter code', async () => {
    const brief = getDeterministicWebProductBrief('test-seed');
    const tasks = getDeterministicWebTier2Tasks(brief.stories);

    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      const execRes = await executeTicketCode({
        language: t.language,
        code: t.task.starter_code,
        visibleTests: t.task.visible_tests,
        hiddenTests: t.task.hidden_tests,
        sqlSetup: t.task.sql_setup,
      });

      assert.strictEqual(
        execRes.passed,
        false,
        `Task ${t.seq} (${t.task.title}) starter code must fail tests`
      );
    }
  });
});
