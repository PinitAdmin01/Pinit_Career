/**
 * The server's Code Wars / arena judge runs the submitted code (audit T3b): a correct solution
 * passes, a wrong or unsafe one does not, and first-clear XP is granted once per problem.
 *
 *   npx tsx scripts/tests/test_code_judge.ts
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { codeWarsScore, grantFirstClearXp, judgeCodeWarsSubmission } from '../../src/lib/server/codeWarsJudge';

const GOOD = `function lowestCommonAncestor(root: TreeNode | null, p: number, q: number): number | null {
  let node = root;
  while (node) {
    if (p < node.val && q < node.val) node = node.left;
    else if (p > node.val && q > node.val) node = node.right;
    else return node.val;
  }
  return null;
}`;
const WRONG = `function lowestCommonAncestor(root: TreeNode | null, p: number, q: number): number | null {
  return null;
}`;

/** xp_ledger + increment_xp in memory. */
function fakeAdmin() {
  const ledger: Array<{ user_id: string; amount: number; reason: string }> = [];
  let xp = 0;
  const from = () => {
    const filters: Array<[string, unknown]> = [];
    const chain = {
      select: () => chain,
      eq: (c: string, v: unknown) => { filters.push([c, v]); return chain; },
      limit: () => chain,
      then: (res: (v: unknown) => unknown) => Promise.resolve({
        data: ledger.filter((r) => filters.every(([c, v]) => (r as Record<string, unknown>)[c] === v)), error: null,
      }).then(res),
    };
    return chain;
  };
  const rpc = async (_name: string, a: { p_user_id: string; p_amount: number; p_reason: string }) => {
    xp += a.p_amount;
    ledger.push({ user_id: a.p_user_id, amount: a.p_amount, reason: a.p_reason });
    return { data: { ok: true, new_xp: xp, new_level: 1 }, error: null };
  };
  return { admin: { from, rpc } as unknown as SupabaseClient, ledger };
}

let pass = 0;
let fail = 0;
async function test(name: string, fn: () => Promise<true | string>) {
  let why: true | string;
  try { why = await fn(); } catch (e) { why = `threw: ${e instanceof Error ? e.message : e}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name} — ${why}`); }
}

(async () => {
  console.log('Code Wars judge (server)\n');

  await test('a correct TypeScript solution passes every test; a wrong one does not', async () => {
    const good = await judgeCodeWarsSubmission('war_tree_lca_01', GOOD, 'typescript');
    const wrong = await judgeCodeWarsSubmission('war_tree_lca_01', WRONG, 'typescript');
    if (!good.ok || !good.passed || good.testsPassed !== good.totalTests) return `good → ${JSON.stringify(good)}`;
    return wrong.ok && !wrong.passed && wrong.testsPassed === 0 ? true : `wrong → ${JSON.stringify(wrong)}`;
  });

  await test('unsafe code and unknown problems are refused', async () => {
    const evil = await judgeCodeWarsSubmission('war_tree_lca_01', 'function lowestCommonAncestor(){ return process.exit(1) }', 'typescript');
    const unknown = await judgeCodeWarsSubmission('no_such_problem', GOOD, 'typescript');
    const empty = await judgeCodeWarsSubmission('war_tree_lca_01', '   ', 'typescript');
    if (evil.ok || evil.error !== 'SECURITY_VIOLATION') return `unsafe → ${JSON.stringify(evil)}`;
    if (unknown.ok || unknown.error !== 'UNSUPPORTED_PROBLEM') return `unknown → ${JSON.stringify(unknown)}`;
    return !empty.ok ? true : 'empty code judged';
  });

  await test('other languages are judged on the server too (a stub does not pass)', async () => {
    const py = await judgeCodeWarsSubmission('war_tree_lca_01', 'def lowest_common_ancestor(root, p, q):\n    return None', 'python');
    return py.ok && !py.passed ? true : `python stub → ${JSON.stringify(py)}`;
  });

  await test('score: a pass is 75–100 by time; a fail is at most 50', async () => {
    const fast = codeWarsScore({ passed: true, testsPassed: 3, totalTests: 3 }, 30, 300);
    const slow = codeWarsScore({ passed: true, testsPassed: 3, totalTests: 3 }, 3000, 300);
    const partial = codeWarsScore({ passed: false, testsPassed: 2, totalTests: 3 }, 30, 300);
    return fast === 98 && slow === 75 && partial === 33 ? true : `fast ${fast}, slow ${slow}, partial ${partial}`;
  });

  await test('first-clear XP: the problem\'s reward, once per student and problem', async () => {
    const { admin, ledger } = fakeAdmin();
    const first = await grantFirstClearXp(admin, 'student-1', 'war_tree_lca_01');
    const second = await grantFirstClearXp(admin, 'student-1', 'war_tree_lca_01');
    const other = await grantFirstClearXp(admin, 'student-2', 'war_tree_lca_01');
    if (first.xpAwarded !== 150 || second.xpAwarded !== 0) return `first ${first.xpAwarded}, second ${second.xpAwarded}`;
    return other.xpAwarded === 150 && ledger.length === 2 ? true : `other ${other.xpAwarded}, ledger ${ledger.length}`;
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
