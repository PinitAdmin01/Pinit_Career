import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { judgeCodeWarsSubmission } from '../src/lib/server/codeWarsJudge';
import { CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';

describe('Deep Cross-Language Verification: All 9 Catalog Problems in TS & Python', () => {
  it('confirms all 9 problems exist in CODE_WARS_PROBLEMS_CATALOG with complete starterCode', () => {
    assert.strictEqual(CODE_WARS_PROBLEMS_CATALOG.length, 9);
    for (const prob of CODE_WARS_PROBLEMS_CATALOG) {
      assert.ok(prob.starterCode.typescript, `Missing TS starter code for ${prob.id}`);
      assert.ok(prob.starterCode.python, `Missing Python starter code for ${prob.id}`);
      assert.ok(prob.testCases.length >= 2, `Expected >= 2 test cases for ${prob.id}`);
    }
  });

  // Problem 1: Two Sum
  it('Problem 1 (Two Sum): passes 5/5 in TypeScript and Python', async () => {
    const tsCode = `
      function twoSum(nums: number[], target: number): number[] {
        const m = new Map<number, number>();
        for (let i = 0; i < nums.length; i++) {
          const diff = target - nums[i];
          if (m.has(diff)) return [m.get(diff)!, i];
          m.set(nums[i], i);
        }
        return [];
      }
    `;
    const pyCode = `
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        diff = target - x
        if diff in seen:
            return [seen[diff], i]
        seen[x] = i
    return []
    `;

    const tsRes = await judgeCodeWarsSubmission('war_two_sum_01', tsCode, 'typescript');
    assert.strictEqual(tsRes.ok, true);
    if (tsRes.ok) {
      assert.strictEqual(tsRes.passed, true);
      assert.strictEqual(tsRes.testsPassed, 5);
    }

    const pyRes = await judgeCodeWarsSubmission('war_two_sum_01', pyCode, 'python');
    assert.strictEqual(pyRes.ok, true);
    if (pyRes.ok) {
      assert.strictEqual(pyRes.passed, true);
      assert.strictEqual(pyRes.testsPassed, 5);
    }
  });

  // Problem 2: Valid Palindrome
  it('Problem 2 (Valid Palindrome): passes 5/5 in TypeScript and Python', async () => {
    const tsCode = `
      function isPalindrome(s: string): boolean {
        const c = s.toLowerCase().replace(/[^a-z0-9]/g, '');
        return c === c.split('').reverse().join('');
      }
    `;
    const pyCode = `
def is_palindrome(s: str) -> bool:
    c = ''.join(ch.lower() for ch in s if ch.isalnum())
    return c == c[::-1]
    `;

    const tsRes = await judgeCodeWarsSubmission('war_valid_palindrome_02', tsCode, 'typescript');
    assert.strictEqual(tsRes.ok, true);
    if (tsRes.ok) {
      assert.strictEqual(tsRes.passed, true);
      assert.strictEqual(tsRes.testsPassed, 5);
    }

    const pyRes = await judgeCodeWarsSubmission('war_valid_palindrome_02', pyCode, 'python');
    assert.strictEqual(pyRes.ok, true);
    if (pyRes.ok) {
      assert.strictEqual(pyRes.passed, true);
      assert.strictEqual(pyRes.testsPassed, 5);
    }
  });

  // Problem 3: Reverse Words
  it('Problem 3 (Reverse Words): passes 4/4 in TypeScript and Python', async () => {
    const tsCode = `
      function reverseWords(s: string): string {
        return s.trim().split(/\\s+/).reverse().join(' ');
      }
    `;
    const pyCode = `
def reverse_words(s: str) -> str:
    return ' '.join(s.strip().split()[::-1])
    `;

    const tsRes = await judgeCodeWarsSubmission('war_reverse_string_03', tsCode, 'typescript');
    assert.strictEqual(tsRes.ok, true);
    if (tsRes.ok) {
      assert.strictEqual(tsRes.passed, true);
      assert.strictEqual(tsRes.testsPassed, 4);
    }

    const pyRes = await judgeCodeWarsSubmission('war_reverse_string_03', pyCode, 'python');
    assert.strictEqual(pyRes.ok, true);
    if (pyRes.ok) {
      assert.strictEqual(pyRes.passed, true);
      assert.strictEqual(pyRes.testsPassed, 4);
    }
  });

  // Problem 4: Valid Parentheses
  it('Problem 4 (Valid Parentheses): passes 5/5 in TypeScript and Python', async () => {
    const tsCode = `
      function isValidParentheses(s: string): boolean {
        const stack: string[] = [];
        const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
        for (const ch of s) {
          if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
          else if (stack.pop() !== pairs[ch]) return false;
        }
        return stack.length === 0;
      }
    `;
    const pyCode = `
def is_valid_parentheses(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif not stack or stack.pop() != pairs[ch]:
            return False
    return len(stack) == 0
    `;

    const tsRes = await judgeCodeWarsSubmission('war_valid_parentheses_04', tsCode, 'typescript');
    assert.strictEqual(tsRes.ok, true);
    if (tsRes.ok) {
      assert.strictEqual(tsRes.passed, true);
      assert.strictEqual(tsRes.testsPassed, 5);
    }

    const pyRes = await judgeCodeWarsSubmission('war_valid_parentheses_04', pyCode, 'python');
    assert.strictEqual(pyRes.ok, true);
    if (pyRes.ok) {
      assert.strictEqual(pyRes.passed, true);
      assert.strictEqual(pyRes.testsPassed, 5);
    }
  });

  // Problem 5: Maximum Subarray (Kadane)
  it('Problem 5 (Maximum Subarray): passes 4/4 in TypeScript and Python', async () => {
    const tsCode = `
      function maxSubArray(nums: number[]): number {
        let maxSoFar = nums[0];
        let curr = nums[0];
        for (let i = 1; i < nums.length; i++) {
          curr = Math.max(nums[i], curr + nums[i]);
          maxSoFar = Math.max(maxSoFar, curr);
        }
        return maxSoFar;
      }
    `;
    const pyCode = `
def max_sub_array(nums):
    max_so_far = nums[0]
    curr = nums[0]
    for x in nums[1:]:
        curr = max(x, curr + x)
        max_so_far = max(max_so_far, curr)
    return max_so_far
    `;

    const tsRes = await judgeCodeWarsSubmission('war_max_subarray_05', tsCode, 'typescript');
    assert.strictEqual(tsRes.ok, true);
    if (tsRes.ok) {
      assert.strictEqual(tsRes.passed, true);
      assert.strictEqual(tsRes.testsPassed, 4);
    }

    const pyRes = await judgeCodeWarsSubmission('war_max_subarray_05', pyCode, 'python');
    assert.strictEqual(pyRes.ok, true);
    if (pyRes.ok) {
      assert.strictEqual(pyRes.passed, true);
      assert.strictEqual(pyRes.testsPassed, 4);
    }
  });

  // Problem 6: Best Time to Buy and Sell Stock
  it('Problem 6 (Best Stock): passes 4/4 in TypeScript and Python', async () => {
    const tsCode = `
      function maxProfit(prices: number[]): number {
        let minPrice = Infinity;
        let maxP = 0;
        for (const p of prices) {
          if (p < minPrice) minPrice = p;
          else if (p - minPrice > maxP) maxP = p - minPrice;
        }
        return maxP;
      }
    `;
    const pyCode = `
def max_profit(prices):
    min_price = float('inf')
    max_p = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > max_p:
            max_p = p - min_price
    return max_p
    `;

    const tsRes = await judgeCodeWarsSubmission('war_best_stock_06', tsCode, 'typescript');
    assert.strictEqual(tsRes.ok, true);
    if (tsRes.ok) {
      assert.strictEqual(tsRes.passed, true);
      assert.strictEqual(tsRes.testsPassed, 4);
    }

    const pyRes = await judgeCodeWarsSubmission('war_best_stock_06', pyCode, 'python');
    assert.strictEqual(pyRes.ok, true);
    if (pyRes.ok) {
      assert.strictEqual(pyRes.passed, true);
      assert.strictEqual(pyRes.testsPassed, 4);
    }
  });

  // Problem 7: Lowest Common Ancestor (Tree)
  it('Problem 7 (Lowest Common Ancestor): passes 3/3 in TypeScript and Python', async () => {
    const tsCode = `
      function lowestCommonAncestor(root: any, p: number, q: number): any {
        let curr = root;
        while (curr) {
          if (p < curr.val && q < curr.val) curr = curr.left;
          else if (p > curr.val && q > curr.val) curr = curr.right;
          else return curr;
        }
        return null;
      }
    `;
    const pyCode = `
def lowest_common_ancestor(root, p, q):
    curr = root
    while curr:
        if p < curr.val and q < curr.val:
            curr = curr.left
        elif p > curr.val and q > curr.val:
            curr = curr.right
        else:
            return curr
    return None
    `;

    const tsRes = await judgeCodeWarsSubmission('war_tree_lca_01', tsCode, 'typescript');
    assert.strictEqual(tsRes.ok, true);
    if (tsRes.ok) {
      assert.strictEqual(tsRes.passed, true);
      assert.strictEqual(tsRes.testsPassed, 3);
    }

    const pyRes = await judgeCodeWarsSubmission('war_tree_lca_01', pyCode, 'python');
    assert.strictEqual(pyRes.ok, true);
    if (pyRes.ok) {
      assert.strictEqual(pyRes.passed, true);
      assert.strictEqual(pyRes.testsPassed, 3);
    }
  });

  // Problem 8: Deadlock Prevention (Concurrency)
  it('Problem 8 (Concurrency Deadlock): passes 2/2 in TypeScript and Python', async () => {
    const tsCode = `
      function acquireResourcesDeterministically(requests: any[]): string[] {
        const set = new Set<string>();
        for (const req of requests) {
          for (const r of req.resourceIds) set.add(r);
        }
        return Array.from(set).sort();
      }
    `;
    const pyCode = `
def acquire_resources_deterministically(requests):
    res = set()
    for req in requests:
        for r in req.get('resourceIds', []):
            res.add(r)
    return sorted(list(res))
    `;

    const tsRes = await judgeCodeWarsSubmission('war_concurrency_deadlock_02', tsCode, 'typescript');
    assert.strictEqual(tsRes.ok, true);
    if (tsRes.ok) {
      assert.strictEqual(tsRes.passed, true);
      assert.strictEqual(tsRes.testsPassed, 2);
    }

    const pyRes = await judgeCodeWarsSubmission('war_concurrency_deadlock_02', pyCode, 'python');
    assert.strictEqual(pyRes.ok, true);
    if (pyRes.ok) {
      assert.strictEqual(pyRes.passed, true);
      assert.strictEqual(pyRes.testsPassed, 2);
    }
  });

  // Problem 9: B-Tree Composite Index (Systems/Database)
  it('Problem 9 (SQL B-Tree Composite Index): passes 2/2 in TypeScript and Python', async () => {
    const tsCode = `
      function generateOptimalCompositeIndex(table: string, eqCols: string[], rangeCol: string): string {
        const cols = [...eqCols, rangeCol];
        const name = 'idx_' + table + '_' + cols.join('_');
        return 'CREATE INDEX ' + name + ' ON ' + table + ' (' + cols.join(', ') + ');';
      }
    `;
    const pyCode = `
def generate_optimal_composite_index(table, eq_cols, range_col):
    cols = list(eq_cols) + [range_col]
    name = f"idx_{table}_{'_'.join(cols)}"
    return f"CREATE INDEX {name} ON {table} ({', '.join(cols)});"
    `;

    const tsRes = await judgeCodeWarsSubmission('war_sql_btree_query_03', tsCode, 'typescript');
    assert.strictEqual(tsRes.ok, true);
    if (tsRes.ok) {
      assert.strictEqual(tsRes.passed, true);
      assert.strictEqual(tsRes.testsPassed, 2);
    }

    const pyRes = await judgeCodeWarsSubmission('war_sql_btree_query_03', pyCode, 'python');
    assert.strictEqual(pyRes.ok, true);
    if (pyRes.ok) {
      assert.strictEqual(pyRes.passed, true);
      assert.strictEqual(pyRes.testsPassed, 2);
    }
  });
});
