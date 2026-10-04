import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getTierConfig, INTERNSHIP_TIERS } from '../src/lib/internships/tiers';
import { getTicketLanguageInfo } from '../src/app/quests/components/internship/TicketEditorTabs';
import { executeTypeScriptTask } from '../src/lib/code/runners/webTaskRunner';
import { TIER1_WEB_TICKET_KINDS } from '../src/lib/internships/seedCompanies';

describe('Web Internship UI & TSX Editor (W-136)', () => {
  it('INTERNSHIP_TIERS provides web track tier names per C5', () => {
    const t1Web = getTierConfig('t1_job_sim', 'web_fullstack');
    assert.strictEqual(t1Web.name, 'Web Developer Job Simulation');
    assert.strictEqual(t1Web.certificateName, 'Web Developer Job Simulation Certificate');
    assert.ok(t1Web.skills.includes('React'));
    assert.ok(t1Web.skills.includes('TypeScript'));

    const t2Web = getTierConfig('t2_virtual_team', 'web_fullstack');
    assert.strictEqual(t2Web.name, 'Virtual Internship – Full-Stack');
    assert.strictEqual(t2Web.certificateName, 'Virtual Internship – Full-Stack Certificate');
    assert.ok(t2Web.skills.includes('React'));
    assert.ok(t2Web.skills.includes('Node.js'));
    assert.ok(t2Web.skills.includes('PostgreSQL'));
  });

  it('python_ai track retains Python tier names', () => {
    const t1Py = getTierConfig('t1_job_sim', 'python_ai');
    assert.strictEqual(t1Py.name, 'Python Job Simulation');

    const t2Py = getTierConfig('t2_virtual_team', 'python_ai');
    assert.strictEqual(t2Py.name, 'Virtual Internship – Backend');
  });

  it('getTicketLanguageInfo returns correct file names and Monaco language for TSX', () => {
    const tsxInfo = getTicketLanguageInfo('tsx');
    assert.strictEqual(tsxInfo.codeFileName, 'Component.tsx');
    assert.strictEqual(tsxInfo.testFileName, 'test_visible.tsx');
    assert.strictEqual(tsxInfo.label, 'React TSX');
    assert.strictEqual(tsxInfo.monacoLang, 'typescript');
    assert.strictEqual(tsxInfo.indentSize, 2);
  });

  it('getTicketLanguageInfo returns correct file names for TypeScript, SQL, and Python', () => {
    const tsInfo = getTicketLanguageInfo('typescript');
    assert.strictEqual(tsInfo.codeFileName, 'solution.ts');
    assert.strictEqual(tsInfo.testFileName, 'test_visible.ts');
    assert.strictEqual(tsInfo.label, 'TypeScript');
    assert.strictEqual(tsInfo.monacoLang, 'typescript');

    const sqlInfo = getTicketLanguageInfo('sql');
    assert.strictEqual(sqlInfo.codeFileName, 'query.sql');
    assert.strictEqual(sqlInfo.testFileName, 'test_visible.sql');
    assert.strictEqual(sqlInfo.label, 'PostgreSQL');
    assert.strictEqual(sqlInfo.monacoLang, 'sql');

    const pyInfo = getTicketLanguageInfo('python');
    assert.strictEqual(pyInfo.codeFileName, 'main.py');
    assert.strictEqual(pyInfo.testFileName, 'test_visible.py');
    assert.strictEqual(pyInfo.label, 'Python');
    assert.strictEqual(pyInfo.monacoLang, 'python');
    assert.strictEqual(pyInfo.indentSize, 4);
  });

  it('TIER1_WEB_TICKET_KINDS contains all 5 required kinds', () => {
    assert.deepStrictEqual(TIER1_WEB_TICKET_KINDS, [
      'component',
      'component_bug_fix',
      'form_validation',
      'refactor',
      'small_feature',
    ]);
  });

  it('executeTypeScriptTask successfully runs TSX visible tests in sandbox', async () => {
    const tsxCode = `
      interface BadgeProps {
        text: string;
      }
      export function Badge({ text }: BadgeProps) {
        return <span className="badge">{text}</span>;
      }
    `;

    const visibleTests = `
      const html = render(Badge, { text: 'Active' });
      assert(html.includes('Active'), 'Must render active text');
      assert(html.includes('badge'), 'Must include badge class');
    `;

    const res = await executeTypeScriptTask(tsxCode, visibleTests, 8000, 'tsx');
    assert.strictEqual(res.allPassed, true, `Expected pass but got: ${res.error}`);
  });

  it('executeTypeScriptTask fails when TSX assertion fails', async () => {
    const tsxCode = `
      interface BadgeProps {
        text: string;
      }
      export function Badge({ text }: BadgeProps) {
        return <div className="wrong">{text}</div>;
      }
    `;

    const visibleTests = `
      const html = render(Badge, { text: 'Active' });
      assert(html.includes('span'), 'Must be a span element');
    `;

    const res = await executeTypeScriptTask(tsxCode, visibleTests, 8000, 'tsx');
    assert.strictEqual(res.allPassed, false);
  });

  it('executeTypeScriptTask successfully runs TypeScript visible tests in sandbox', async () => {
    const tsCode = `
      export function formatPrice(cents: number): string {
        return '$' + (cents / 100).toFixed(2);
      }
    `;

    const visibleTests = `
      assert(formatPrice(199) === '$1.99', 'Formats 199 cents');
      assert(formatPrice(5000) === '$50.00', 'Formats 5000 cents');
    `;

    const res = await executeTypeScriptTask(tsCode, visibleTests, 8000, 'typescript');
    assert.strictEqual(res.allPassed, true, `Expected pass but got: ${res.error}`);
  });

  it('executeTypeScriptTask fails on invalid TypeScript code or logic error', async () => {
    const tsCode = `
      export function formatPrice(cents: number): string {
        return String(cents);
      }
    `;

    const visibleTests = `
      assert(formatPrice(199) === '$1.99', 'Formats 199 cents');
    `;

    const res = await executeTypeScriptTask(tsCode, visibleTests, 8000, 'typescript');
    assert.strictEqual(res.allPassed, false);
  });
});
