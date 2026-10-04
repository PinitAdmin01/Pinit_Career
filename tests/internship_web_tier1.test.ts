import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  TIER1_WEB_TICKET_KINDS,
  TIER1_WEB_MONTH1_SKILLS,
  WEB_TIER1_SEED_COMPANIES,
  getSeedWebTier1Tasks,
} from '../src/lib/internships/seedCompanies';
import { generateTier1Tasks } from '../src/lib/internships/tier1Tickets';
import { validateGeneratedTask } from '../src/lib/internships/validateTask';
import { executeTicketCode } from '../src/lib/internships/submission';
import { FICTIONAL_COMPANY_PREFIX } from '../src/lib/internships/companyProfile';

describe('Web Job Simulation Tickets (W-131 / Tier 1)', () => {
  it('TIER1_WEB_TICKET_KINDS has all 5 required web ticket kinds in order', () => {
    assert.deepStrictEqual(TIER1_WEB_TICKET_KINDS, [
      'component',
      'component_bug_fix',
      'form_validation',
      'refactor',
      'small_feature',
    ]);
  });

  it('TIER1_WEB_MONTH1_SKILLS contains core React Month 1 fundamentals', () => {
    assert.ok(TIER1_WEB_MONTH1_SKILLS.includes('React Components'));
    assert.ok(TIER1_WEB_MONTH1_SKILLS.includes('JSX and Element Rendering'));
    assert.ok(TIER1_WEB_MONTH1_SKILLS.includes('Props and Typing'));
    assert.ok(TIER1_WEB_MONTH1_SKILLS.includes('State Management (useState)'));
    assert.ok(TIER1_WEB_MONTH1_SKILLS.includes('Event Handling and Form Inputs'));
    assert.ok(TIER1_WEB_MONTH1_SKILLS.includes('Conditional Rendering and Lists'));
  });

  it('WEB_TIER1_SEED_COMPANIES contain mandatory fictional disclosure in readme', () => {
    assert.ok(WEB_TIER1_SEED_COMPANIES.length >= 3);
    for (const company of WEB_TIER1_SEED_COMPANIES) {
      assert.ok(
        company.readme.startsWith(FICTIONAL_COMPANY_PREFIX),
        `Company ${company.name} readme must start with fictional prefix`
      );
      assert.ok(company.industry.length > 2);
    }
  });

  it('getSeedWebTier1Tasks produces 5 complete tasks matching the 5 ticket kinds', () => {
    const company = WEB_TIER1_SEED_COMPANIES[0];
    const tasks = getSeedWebTier1Tasks(company);
    assert.strictEqual(tasks.length, 5);

    for (const task of tasks) {
      assert.ok(task.title.length >= 3);
      assert.ok(task.brief.length >= 20);
      assert.ok(task.starter_code.length >= 10);
      assert.ok(task.visible_tests.length >= 10);
      assert.ok(task.hidden_tests.length >= 10);
      assert.ok(task.reference_solution.length >= 10);
      assert.ok(task.skills.length >= 1);
    }
  });

  it('each of the 5 seed web tasks passes V1-V7 validation pipeline in tsx mode', async () => {
    const company = WEB_TIER1_SEED_COMPANIES[0];
    const tasks = getSeedWebTier1Tasks(company);

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const valRes = await validateGeneratedTask(task, 'tsx');
      assert.strictEqual(
        valRes.ok,
        true,
        `Task ${i + 1} (${task.title}) failed validation: ${!valRes.ok ? valRes.reason : ''}`
      );
    }
  });

  it('each of the 5 seed web tasks passes executeTicketCode with reference solution', async () => {
    const company = WEB_TIER1_SEED_COMPANIES[0];
    const tasks = getSeedWebTier1Tasks(company);

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const execRes = await executeTicketCode({
        language: 'tsx',
        code: task.reference_solution,
        visibleTests: task.visible_tests,
        hiddenTests: task.hidden_tests,
      });

      assert.strictEqual(
        execRes.passed,
        true,
        `Task ${i + 1} (${task.title}) reference solution should pass: ${execRes.output}`
      );
    }
  });

  it('each of the 5 seed web tasks fails executeTicketCode with starter code', async () => {
    const company = WEB_TIER1_SEED_COMPANIES[0];
    const tasks = getSeedWebTier1Tasks(company);

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const execRes = await executeTicketCode({
        language: 'tsx',
        code: task.starter_code,
        visibleTests: task.visible_tests,
        hiddenTests: task.hidden_tests,
      });

      assert.strictEqual(
        execRes.passed,
        false,
        `Task ${i + 1} (${task.title}) starter code must fail tests`
      );
    }
  });

  it('generateTier1Tasks for web_fullstack produces 5 validated tsx tickets', async () => {
    const company = WEB_TIER1_SEED_COMPANIES[0];
    const res = await generateTier1Tasks({
      companyProfile: {
        name: company.name,
        industry: company.industry,
        readme: company.readme,
      },
      seed: 'test-web-tier1-seed',
      track: 'web_fullstack',
      useSeedFallback: true,
    });

    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.strictEqual(res.tickets.length, 5);
      assert.strictEqual(res.tickets[0].kind, 'component');
      assert.strictEqual(res.tickets[1].kind, 'component_bug_fix');
      assert.strictEqual(res.tickets[2].kind, 'form_validation');
      assert.strictEqual(res.tickets[3].kind, 'refactor');
      assert.strictEqual(res.tickets[4].kind, 'small_feature');
    }
  });
});
