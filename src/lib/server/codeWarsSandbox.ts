import vm from 'node:vm';
import { Worker } from 'node:worker_threads';
import { CodeWarsApiService } from '@/lib/api/codeWarsApi';

/**
 * Code Wars sandbox (server only): the problem registry and the isolated worker/vm runner that
 * executes JavaScript/TypeScript submissions against each problem's tests. Used by
 * /api/code/evaluate and the arena room route through lib/server/codeWarsJudge.
 */

export interface EvaluatorResult {
  passed: boolean;
  status: 'SUCCESS' | 'FAILED' | 'SYNTAX_ERROR' | 'RUNTIME_ERROR' | 'EXECUTION_ERROR' | 'TIMEOUT';
  testsPassed: number;
  totalTests: number;
  error?: string;
}

export interface SandboxExecutionParams {
  cleanCode: string;
  functionName: string;
  totalTests: number;
  evaluatorCode: string;
}

export function validateVmCodeSecurity(code: string): { safe: boolean; reason?: string } {
  const forbiddenPatterns = [
    { pattern: /\bprocess\b/i, token: 'process' },
    { pattern: /\brequire\b/i, token: 'require' },
    { pattern: /\bimport\b/i, token: 'import' },
    { pattern: /\bglobal\b/i, token: 'global' },
    { pattern: /\bglobalThis\b/i, token: 'globalThis' },
    { pattern: /\bchild_process\b/i, token: 'child_process' },
    { pattern: /\bfs\b/i, token: 'fs' },
    { pattern: /\bFunction\b/, token: 'Function' },
    { pattern: /\beval\b/i, token: 'eval' },
    { pattern: /(?:\.\s*constructor\b|\[\s*['"`]constructor['"`]\s*\]|\bconstructor\s*\.\s*constructor\b)/i, token: 'constructor property traversal' },
    { pattern: /__proto__/i, token: '__proto__' },
    { pattern: /\bprototype\b/i, token: 'prototype' },
    { pattern: /\bReflect\b/i, token: 'Reflect' },
    { pattern: /\bgetPrototypeOf\b/i, token: 'getPrototypeOf' },
    { pattern: /\bsetPrototypeOf\b/i, token: 'setPrototypeOf' },
  ];

  for (const { pattern, token } of forbiddenPatterns) {
    if (pattern.test(code)) {
      return {
        safe: false,
        reason: `Forbidden token ${token}`,
      };
    }
  }

  return { safe: true };
}

/**
 * Execution timeout wrapper guaranteeing that student code evaluation terminates
 * within the deadline, defending against infinite loops or hanging execution.
 */
export async function executeWithTimeout<T>(
  action: () => Promise<T> | T,
  timeoutMs: number = 2500
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Execution timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    try {
      Promise.resolve(action())
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    } catch (syncErr) {
      clearTimeout(timer);
      reject(syncErr);
    }
  });
}

export interface CodeWarsProblemDefinition {
  functionName: string;
  pythonFunctionName?: string;
  totalTests: number;
  evaluator?: (fn: Function) => { passedCount: number; errorLog?: string };
  evaluatorCode: string;
  pythonTests?: string;
}

export const CODEWARS_PROBLEM_REGISTRY: Record<string, CodeWarsProblemDefinition> = {
  // 1. Two Sum
  war_two_sum_01: {
    functionName: 'twoSum',
    pythonFunctionName: 'two_sum',
    totalTests: 5,
    evaluator: (fn) => {
      const cases = [
        { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
        { nums: [3, 2, 4], target: 6, expected: [1, 2] },
        { nums: [3, 3], target: 6, expected: [0, 1] },
        { nums: [1, 5, 8, 3], target: 13, expected: [1, 2] },
        { nums: [10, -2, 5, 7], target: 15, expected: [0, 2] }
      ];
      let passed = 0;
      for (let i = 0; i < cases.length; i++) {
        try {
          const res = fn(cases[i].nums.slice(), cases[i].target);
          if (Array.isArray(res) && res.slice().sort().join(',') === cases[i].expected.slice().sort().join(',')) {
            passed++;
          } else {
            return { passedCount: passed, errorLog: `Test case ${i+1} failed: expected ${JSON.stringify(cases[i].expected)}, got ${JSON.stringify(res)}` };
          }
        } catch (e: any) {
          return { passedCount: passed, errorLog: `Test case ${i+1} error: ${e?.message || 'Execution error'}` };
        }
      }
      return { passedCount: passed };
    },
    evaluatorCode: `
      var cases = [
        { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
        { nums: [3, 2, 4], target: 6, expected: [1, 2] },
        { nums: [3, 3], target: 6, expected: [0, 1] },
        { nums: [1, 5, 8, 3], target: 13, expected: [1, 2] },
        { nums: [10, -2, 5, 7], target: 15, expected: [0, 2] }
      ];
      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var res = twoSum(c.nums.slice(), c.target);
          if (Array.isArray(res) && res.slice().sort().join(',') === c.expected.slice().sort().join(',')) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected ' + JSON.stringify(c.expected) + ', received ' + JSON.stringify(res)
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('two_sum') or globals().get('twoSum')
assert fn is not None, "Function two_sum or twoSum not found"
cases = [
    ([2, 7, 11, 15], 9, [0, 1]),
    ([3, 2, 4], 6, [1, 2]),
    ([3, 3], 6, [0, 1]),
    ([1, 5, 8, 3], 13, [1, 2]),
    ([10, -2, 5, 7], 15, [0, 2])
]
for idx, (nums, target, expected) in enumerate(cases):
    ans = sorted(list(fn(list(nums), target)))
    assert ans == sorted(expected), f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 2. Valid Palindrome
  war_valid_palindrome_02: {
    functionName: 'isPalindrome',
    pythonFunctionName: 'is_palindrome',
    totalTests: 5,
    evaluator: (fn) => {
      const cases = [
        { s: 'A man, a plan, a canal: Panama', expected: true },
        { s: 'race a car', expected: false },
        { s: ' ', expected: true },
        { s: '0P', expected: false },
        { s: 'ab_a', expected: true }
      ];
      let passed = 0;
      for (let i = 0; i < cases.length; i++) {
        try {
          if (Boolean(fn(cases[i].s)) === cases[i].expected) passed++;
          else return { passedCount: passed, errorLog: `Test case ${i+1} failed` };
        } catch (e: any) {
          return { passedCount: passed, errorLog: e?.message };
        }
      }
      return { passedCount: passed };
    },
    evaluatorCode: `
      var cases = [
        { s: 'A man, a plan, a canal: Panama', expected: true },
        { s: 'race a car', expected: false },
        { s: ' ', expected: true },
        { s: '0P', expected: false },
        { s: 'ab_a', expected: true }
      ];
      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var res = Boolean(isPalindrome(c.s));
          if (res === c.expected) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected ' + c.expected + ', received ' + res
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('is_palindrome') or globals().get('isPalindrome')
assert fn is not None, "Function is_palindrome not found"
cases = [
    ("A man, a plan, a canal: Panama", True),
    ("race a car", False),
    (" ", True),
    ("0P", False),
    ("ab_a", True)
]
for idx, (s, expected) in enumerate(cases):
    ans = bool(fn(s))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 3. Reverse Words in a String
  war_reverse_string_03: {
    functionName: 'reverseWords',
    pythonFunctionName: 'reverse_words',
    totalTests: 4,
    evaluator: (fn) => {
      const cases = [
        { s: 'the sky is blue', expected: 'blue is sky the' },
        { s: '  hello world  ', expected: 'world hello' },
        { s: 'a good   example', expected: 'example good a' },
        { s: 'EPIC', expected: 'EPIC' }
      ];
      let passed = 0;
      for (let i = 0; i < cases.length; i++) {
        try {
          if (String(fn(cases[i].s)).trim() === cases[i].expected) passed++;
          else return { passedCount: passed, errorLog: `Test case ${i+1} failed` };
        } catch (e: any) {
          return { passedCount: passed, errorLog: e?.message };
        }
      }
      return { passedCount: passed };
    },
    evaluatorCode: `
      var cases = [
        { s: 'the sky is blue', expected: 'blue is sky the' },
        { s: '  hello world  ', expected: 'world hello' },
        { s: 'a good   example', expected: 'example good a' },
        { s: 'EPIC', expected: 'EPIC' }
      ];
      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var res = String(reverseWords(c.s) || '').trim();
          if (res === c.expected) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected "' + c.expected + '", received "' + res + '"'
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('reverse_words') or globals().get('reverseWords')
assert fn is not None, "Function reverse_words not found"
cases = [
    ("the sky is blue", "blue is sky the"),
    ("  hello world  ", "world hello"),
    ("a good   example", "example good a"),
    ("EPIC", "EPIC")
]
for idx, (s, expected) in enumerate(cases):
    ans = str(fn(s)).strip()
    assert ans == expected, f"Test case {idx+1} failed: expected '{expected}', got '{ans}'"
`,
  },

  // 4. Valid Parentheses
  war_valid_parentheses_04: {
    functionName: 'isValidParentheses',
    pythonFunctionName: 'is_valid_parentheses',
    totalTests: 5,
    evaluator: (fn) => {
      const cases = [
        { s: '()', expected: true },
        { s: '()[]{}', expected: true },
        { s: '(]', expected: false },
        { s: '([)]', expected: false },
        { s: '{[]}', expected: true }
      ];
      let passed = 0;
      for (let i = 0; i < cases.length; i++) {
        try {
          if (Boolean(fn(cases[i].s)) === cases[i].expected) passed++;
          else return { passedCount: passed, errorLog: `Test case ${i+1} failed` };
        } catch (e: any) {
          return { passedCount: passed, errorLog: e?.message };
        }
      }
      return { passedCount: passed };
    },
    evaluatorCode: `
      var cases = [
        { s: '()', expected: true },
        { s: '()[]{}', expected: true },
        { s: '(]', expected: false },
        { s: '([)]', expected: false },
        { s: '{[]}', expected: true }
      ];
      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var res = Boolean(isValidParentheses(c.s));
          if (res === c.expected) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected ' + c.expected + ', received ' + res
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('is_valid_parentheses') or globals().get('isValidParentheses')
assert fn is not None, "Function is_valid_parentheses not found"
cases = [
    ("()", True),
    ("()[]{}", True),
    ("(]", False),
    ("([)]", False),
    ("{[]}", True)
]
for idx, (s, expected) in enumerate(cases):
    ans = bool(fn(s))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 5. Maximum Subarray
  war_max_subarray_05: {
    functionName: 'maxSubArray',
    pythonFunctionName: 'max_sub_array',
    totalTests: 4,
    evaluator: (fn) => {
      const cases = [
        { nums: [-2,1,-3,4,-1,2,1,-5,4], expected: 6 },
        { nums: [1], expected: 1 },
        { nums: [5,4,-1,7,8], expected: 23 },
        { nums: [-1, -2, -3], expected: -1 }
      ];
      let passed = 0;
      for (let i = 0; i < cases.length; i++) {
        try {
          if (Number(fn(cases[i].nums.slice())) === cases[i].expected) passed++;
          else return { passedCount: passed, errorLog: `Test case ${i+1} failed` };
        } catch (e: any) {
          return { passedCount: passed, errorLog: e?.message };
        }
      }
      return { passedCount: passed };
    },
    evaluatorCode: `
      var cases = [
        { nums: [-2,1,-3,4,-1,2,1,-5,4], expected: 6 },
        { nums: [1], expected: 1 },
        { nums: [5,4,-1,7,8], expected: 23 },
        { nums: [-1, -2, -3], expected: -1 }
      ];
      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var res = Number(maxSubArray(c.nums.slice()));
          if (res === c.expected) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected ' + c.expected + ', received ' + res
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('max_sub_array') or globals().get('maxSubArray')
assert fn is not None, "Function max_sub_array not found"
cases = [
    ([-2,1,-3,4,-1,2,1,-5,4], 6),
    ([1], 1),
    ([5,4,-1,7,8], 23),
    ([-1, -2, -3], -1)
]
for idx, (nums, expected) in enumerate(cases):
    ans = int(fn(list(nums)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 6. Best Time to Buy and Sell Stock
  war_best_stock_06: {
    functionName: 'maxProfit',
    pythonFunctionName: 'max_profit',
    totalTests: 4,
    evaluator: (fn) => {
      const cases = [
        { prices: [7,1,5,3,6,4], expected: 5 },
        { prices: [7,6,4,3,1], expected: 0 },
        { prices: [2,4,1], expected: 2 },
        { prices: [3,2,6,5,0,3], expected: 4 }
      ];
      let passed = 0;
      for (let i = 0; i < cases.length; i++) {
        try {
          if (Number(fn(cases[i].prices.slice())) === cases[i].expected) passed++;
          else return { passedCount: passed, errorLog: `Test case ${i+1} failed` };
        } catch (e: any) {
          return { passedCount: passed, errorLog: e?.message };
        }
      }
      return { passedCount: passed };
    },
    evaluatorCode: `
      var cases = [
        { prices: [7,1,5,3,6,4], expected: 5 },
        { prices: [7,6,4,3,1], expected: 0 },
        { prices: [2,4,1], expected: 2 },
        { prices: [3,2,6,5,0,3], expected: 4 }
      ];
      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var res = Number(maxProfit(c.prices.slice()));
          if (res === c.expected) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected ' + c.expected + ', received ' + res
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('max_profit') or globals().get('maxProfit')
assert fn is not None, "Function max_profit not found"
cases = [
    ([7,1,5,3,6,4], 5),
    ([7,6,4,3,1], 0),
    ([2,4,1], 2),
    ([3,2,6,5,0,3], 4)
]
for idx, (prices, expected) in enumerate(cases):
    ans = int(fn(list(prices)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 7. Lowest Common Ancestor
  war_tree_lca_01: {
    functionName: 'lowestCommonAncestor',
    pythonFunctionName: 'lowest_common_ancestor',
    totalTests: 3,
    evaluator: (fn) => CodeWarsApiService.evaluateLcaTestCases(fn),
    evaluatorCode: `
      function buildTree(arr) {
        if (!arr || !arr.length || arr[0] === null) return null;
        var root = new TreeNode(arr[0]);
        var queue = [root];
        var i = 1;
        while (queue.length && i < arr.length) {
          var curr = queue.shift();
          if (!curr) break;
          if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.left = new TreeNode(arr[i]);
            queue.push(curr.left);
          }
          i++;
          if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.right = new TreeNode(arr[i]);
            queue.push(curr.right);
          }
          i++;
        }
        return root;
      }

      var cases = [
        { tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8, expected: 6 },
        { tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4, expected: 2 },
        { tree: [2, 1], p: 2, q: 1, expected: 2 }
      ];

      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var t = buildTree(c.tree);
          var res = lowestCommonAncestor(t, c.p, c.q);
          var actualVal = (res && typeof res === 'object' && 'val' in res) ? res.val : res;
          if (actualVal === c.expected) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected ' + c.expected + ', received ' + actualVal
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }

      return {
        passed: true,
        status: 'SUCCESS',
        testsPassed: passedCount,
        totalTests: cases.length
      };
    `,
    pythonTests: `
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        curr = queue.pop(0)
        if not curr:
            continue
        if i < len(arr) and arr[i] is not None:
            curr.left = TreeNode(arr[i])
            queue.append(curr.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            curr.right = TreeNode(arr[i])
            queue.append(curr.right)
        i += 1
    return root

fn = globals().get('lowest_common_ancestor') or globals().get('lowestCommonAncestor')
assert fn is not None, "Function lowest_common_ancestor not found"
cases = [
    ([6,2,8,0,4,7,9,None,None,3,5], 2, 8, 6),
    ([6,2,8,0,4,7,9,None,None,3,5], 2, 4, 2),
    ([2,1], 2, 1, 2)
]
for idx, (tree_arr, p, q, expected) in enumerate(cases):
    t = build_tree(tree_arr)
    ans = fn(t, p, q)
    val = ans.val if hasattr(ans, 'val') else ans
    assert val == expected, f"Test case {idx+1} failed: expected {expected}, got {val}"
`,
  },

  // 8. Deadlock Prevention
  war_concurrency_deadlock_02: {
    functionName: 'acquireResourcesDeterministically',
    pythonFunctionName: 'acquire_resources_deterministically',
    totalTests: 2,
    evaluator: (fn) => CodeWarsApiService.evaluateConcurrencyTestCases(fn),
    evaluatorCode: `
      var cases = [
        {
          requests: [{ threadId: 'T1', resourceIds: ['R2', 'R1'] }, { threadId: 'T2', resourceIds: ['R1', 'R2'] }],
          expected: ['R1', 'R2']
        },
        {
          requests: [{ threadId: 'T1', resourceIds: ['R3', 'R1', 'R2'] }],
          expected: ['R1', 'R2', 'R3']
        }
      ];

      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var res = acquireResourcesDeterministically(c.requests);
          var actual = Array.isArray(res) ? res.slice() : [];
          if (JSON.stringify(actual) === JSON.stringify(c.expected)) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected ' + JSON.stringify(c.expected) + ', received ' + JSON.stringify(actual)
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }

      return {
        passed: true,
        status: 'SUCCESS',
        testsPassed: passedCount,
        totalTests: cases.length
      };
    `,
    pythonTests: `
fn = globals().get('acquire_resources_deterministically') or globals().get('acquireResourcesDeterministically')
assert fn is not None, "Function acquire_resources_deterministically not found"
cases = [
    ([{"threadId": "T1", "resourceIds": ["R2", "R1"]}, {"threadId": "T2", "resourceIds": ["R1", "R2"]}], ["R1", "R2"]),
    ([{"threadId": "T1", "resourceIds": ["R3", "R1", "R2"]}], ["R1", "R2", "R3"])
]
for idx, (reqs, expected) in enumerate(cases):
    ans = list(fn(reqs))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 9. B-Tree Composite Index
  war_sql_btree_query_03: {
    functionName: 'generateOptimalCompositeIndex',
    pythonFunctionName: 'generate_optimal_composite_index',
    totalTests: 2,
    evaluator: (fn) => CodeWarsApiService.evaluateSqlTestCases(fn),
    evaluatorCode: `
      var cases = [
        {
          table: 'orders',
          eq: ['tenant_id', 'status'],
          range: 'created_at',
          expected: 'CREATE INDEX idx_orders_tenant_id_status_created_at ON orders (tenant_id, status, created_at);'
        },
        {
          table: 'logs',
          eq: ['service_id'],
          range: 'timestamp',
          expected: 'CREATE INDEX idx_logs_service_id_timestamp ON logs (service_id, timestamp);'
        }
      ];

      var passedCount = 0;
      for (var idx = 0; idx < cases.length; idx++) {
        var c = cases[idx];
        try {
          var res = generateOptimalCompositeIndex(c.table, c.eq, c.range);
          var normalize = function(s) { return String(s || '').trim().replace(/\\s+/g, ' ').toLowerCase(); };
          if (normalize(res) === normalize(c.expected)) {
            passedCount++;
          } else {
            return {
              passed: false,
              status: 'FAILED',
              testsPassed: passedCount,
              totalTests: cases.length,
              error: 'Test case ' + (idx + 1) + ' failed: expected "' + c.expected + '", received "' + res + '"'
            };
          }
        } catch (err) {
          return {
            passed: false,
            status: 'FAILED',
            testsPassed: passedCount,
            totalTests: cases.length,
            error: 'Test case ' + (idx + 1) + ' runtime error: ' + (err && err.message ? err.message : 'Execution failed')
          };
        }
      }

      return {
        passed: true,
        status: 'SUCCESS',
        testsPassed: passedCount,
        totalTests: cases.length
      };
    `,
    pythonTests: `
fn = globals().get('generate_optimal_composite_index') or globals().get('generateOptimalCompositeIndex')
assert fn is not None, "Function generate_optimal_composite_index not found"
cases = [
    ("orders", ["tenant_id", "status"], "created_at", "create index idx_orders_tenant_id_status_created_at on orders (tenant_id, status, created_at);"),
    ("logs", ["service_id"], "timestamp", "create index idx_logs_service_id_timestamp on logs (service_id, timestamp);")
]
for idx, (tbl, eq, rng, expected) in enumerate(cases):
    ans = " ".join(str(fn(tbl, eq, rng)).strip().lower().split())
    exp = " ".join(expected.strip().lower().split())
    assert ans == exp, f"Test case {idx+1} failed: expected '{exp}', got '{ans}'"
`,
  },
  // 10. Contains Duplicate
  war_contains_duplicate_04: {
    functionName: 'containsDuplicate',
    pythonFunctionName: 'contains_duplicate',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [1, 2, 3, 1], expected: true },
        { nums: [1, 2, 3, 4], expected: false },
        { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2], expected: true },
        { nums: [0], expected: false }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = containsDuplicate(cases[i].nums.slice());
          if (Boolean(res) === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('contains_duplicate') or globals().get('containsDuplicate')
assert fn is not None, "Function contains_duplicate not found"
cases = [
    ([1, 2, 3, 1], True),
    ([1, 2, 3, 4], False),
    ([1, 1, 1, 3, 3, 4, 3, 2, 4, 2], True),
    ([0], False)
]
for idx, (nums, expected) in enumerate(cases):
    ans = bool(fn(list(nums)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 11. Valid Anagram
  war_valid_anagram_05: {
    functionName: 'isAnagram',
    pythonFunctionName: 'is_anagram',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: 'anagram', t: 'nagaram', expected: true },
        { s: 'rat', t: 'car', expected: false },
        { s: 'a', t: 'ab', expected: false },
        { s: 'listen', t: 'silent', expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isAnagram(cases[i].s, cases[i].t);
          if (Boolean(res) === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('is_anagram') or globals().get('isAnagram')
assert fn is not None, "Function is_anagram not found"
cases = [
    ("anagram", "nagaram", True),
    ("rat", "car", False),
    ("a", "ab", False),
    ("listen", "silent", True)
]
for idx, (s, t, expected) in enumerate(cases):
    ans = bool(fn(s, t))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 12. Move Zeroes
  war_move_zeroes_06: {
    functionName: 'moveZeroes',
    pythonFunctionName: 'move_zeroes',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [0, 1, 0, 3, 12], expected: [1, 3, 12, 0, 0] },
        { nums: [0], expected: [0] },
        { nums: [1, 2, 3], expected: [1, 2, 3] },
        { nums: [0, 0, 1], expected: [1, 0, 0] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var arr = cases[i].nums.slice();
          var res = moveZeroes(arr) || arr;
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('move_zeroes') or globals().get('moveZeroes')
assert fn is not None, "Function move_zeroes not found"
cases = [
    ([0, 1, 0, 3, 12], [1, 3, 12, 0, 0]),
    ([0], [0]),
    ([1, 2, 3], [1, 2, 3]),
    ([0, 0, 1], [1, 0, 0])
]
for idx, (nums, expected) in enumerate(cases):
    arr = list(nums)
    res = fn(arr)
    ans = list(res if res is not None else arr)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 13. Single Number
  war_single_number_07: {
    functionName: 'singleNumber',
    pythonFunctionName: 'single_number',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [2, 2, 1], expected: 1 },
        { nums: [4, 1, 2, 1, 2], expected: 4 },
        { nums: [1], expected: 1 },
        { nums: [7, 3, 7], expected: 3 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = singleNumber(cases[i].nums.slice());
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('single_number') or globals().get('singleNumber')
assert fn is not None, "Function single_number not found"
cases = [
    ([2, 2, 1], 1),
    ([4, 1, 2, 1, 2], 4),
    ([1], 1),
    ([7, 3, 7], 3)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 14. Missing Number
  war_missing_number_08: {
    functionName: 'missingNumber',
    pythonFunctionName: 'missing_number',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [3, 0, 1], expected: 2 },
        { nums: [0, 1], expected: 2 },
        { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1], expected: 8 },
        { nums: [0], expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = missingNumber(cases[i].nums.slice());
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('missing_number') or globals().get('missingNumber')
assert fn is not None, "Function missing_number not found"
cases = [
    ([3, 0, 1], 2),
    ([0, 1], 2),
    ([9, 6, 4, 2, 3, 5, 7, 0, 1], 8),
    ([0], 1)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 15. Merge Sorted Arrays
  war_merge_sorted_arrays_09: {
    functionName: 'mergeSortedArrays',
    pythonFunctionName: 'merge_sorted_arrays',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { a: [1, 2, 3], b: [2, 5, 6], expected: [1, 2, 2, 3, 5, 6] },
        { a: [1], b: [], expected: [1] },
        { a: [], b: [1], expected: [1] },
        { a: [2, 4], b: [1, 3], expected: [1, 2, 3, 4] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = mergeSortedArrays(cases[i].a.slice(), cases[i].b.slice());
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('merge_sorted_arrays') or globals().get('mergeSortedArrays')
assert fn is not None, "Function merge_sorted_arrays not found"
cases = [
    ([1, 2, 3], [2, 5, 6], [1, 2, 2, 3, 5, 6]),
    ([1], [], [1]),
    ([], [1], [1]),
    ([2, 4], [1, 3], [1, 2, 3, 4])
]
for idx, (a, b, expected) in enumerate(cases):
    ans = list(fn(list(a), list(b)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 16. Roman to Integer
  war_roman_to_int_10: {
    functionName: 'romanToInt',
    pythonFunctionName: 'roman_to_int',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: 'III', expected: 3 },
        { s: 'LVIII', expected: 58 },
        { s: 'MCMXCIV', expected: 1994 },
        { s: 'IX', expected: 9 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = romanToInt(cases[i].s);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('roman_to_int') or globals().get('romanToInt')
assert fn is not None, "Function roman_to_int not found"
cases = [
    ("III", 3),
    ("LVIII", 58),
    ("MCMXCIV", 1994),
    ("IX", 9)
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 17. Binary Search
  war_binary_search_07: {
    functionName: 'search',
    pythonFunctionName: 'search',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [-1, 0, 3, 5, 9, 12], target: 9, expected: 4 },
        { nums: [-1, 0, 3, 5, 9, 12], target: 2, expected: -1 },
        { nums: [5], target: 5, expected: 0 },
        { nums: [1, 3, 5], target: 1, expected: 0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = search(cases[i].nums.slice(), cases[i].target);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('search')
assert fn is not None, "Function search not found"
cases = [
    ([-1, 0, 3, 5, 9, 12], 9, 4),
    ([-1, 0, 3, 5, 9, 12], 2, -1),
    ([5], 5, 0),
    ([1, 3, 5], 1, 0)
]
for idx, (nums, target, expected) in enumerate(cases):
    ans = fn(list(nums), target)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 18. Reverse Linked List
  war_reverse_linked_list_08: {
    functionName: 'reverseList',
    pythonFunctionName: 'reverse_list',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { head: [1, 2, 3, 4, 5], expected: [5, 4, 3, 2, 1] },
        { head: [1, 2], expected: [2, 1] },
        { head: [], expected: [] },
        { head: [42], expected: [42] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = reverseList(cases[i].head.slice());
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('reverse_list') or globals().get('reverseList')
assert fn is not None, "Function reverse_list not found"
cases = [
    ([1, 2, 3, 4, 5], [5, 4, 3, 2, 1]),
    ([1, 2], [2, 1]),
    ([], []),
    ([42], [42])
]
for idx, (head, expected) in enumerate(cases):
    ans = list(fn(list(head)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 19. Longest Substring Without Repeating Characters
  war_longest_substring_09: {
    functionName: 'lengthOfLongestSubstring',
    pythonFunctionName: 'length_of_longest_substring',
    totalTests: 5,
    evaluatorCode: `
      var cases = [
        { s: 'abcabcbb', expected: 3 },
        { s: 'bbbbb', expected: 1 },
        { s: 'pwwkew', expected: 3 },
        { s: '', expected: 0 },
        { s: 'au', expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = lengthOfLongestSubstring(cases[i].s);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('length_of_longest_substring') or globals().get('lengthOfLongestSubstring')
assert fn is not None, "Function length_of_longest_substring not found"
cases = [
    ("abcabcbb", 3),
    ("bbbbb", 1),
    ("pwwkew", 3),
    ("", 0),
    ("au", 2)
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 20. Container With Most Water
  war_container_water_10: {
    functionName: 'maxArea',
    pythonFunctionName: 'max_area',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { h: [1, 8, 6, 2, 5, 4, 8, 3, 7], expected: 49 },
        { h: [1, 1], expected: 1 },
        { h: [4, 3, 2, 1, 4], expected: 16 },
        { h: [1, 2, 1], expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = maxArea(cases[i].h.slice());
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('max_area') or globals().get('maxArea')
assert fn is not None, "Function max_area not found"
cases = [
    ([1, 8, 6, 2, 5, 4, 8, 3, 7], 49),
    ([1, 1], 1),
    ([4, 3, 2, 1, 4], 16),
    ([1, 2, 1], 2)
]
for idx, (h, expected) in enumerate(cases):
    ans = fn(list(h))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 21. Product of Array Except Self
  war_product_except_self_11: {
    functionName: 'productExceptSelf',
    pythonFunctionName: 'product_except_self',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { nums: [1, 2, 3, 4], expected: [24, 12, 8, 6] },
        { nums: [-1, 1, 0, -3, 3], expected: [0, 0, 9, 0, 0] },
        { nums: [2, 3], expected: [3, 2] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = productExceptSelf(cases[i].nums.slice());
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('product_except_self') or globals().get('productExceptSelf')
assert fn is not None, "Function product_except_self not found"
cases = [
    ([1, 2, 3, 4], [24, 12, 8, 6]),
    ([-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]),
    ([2, 3], [3, 2])
]
for idx, (nums, expected) in enumerate(cases):
    ans = list(fn(list(nums)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 22. 3Sum
  war_three_sum_12: {
    functionName: 'threeSum',
    pythonFunctionName: 'three_sum',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { nums: [-1, 0, 1, 2, -1, -4], expected: [[-1, -1, 2], [-1, 0, 1]] },
        { nums: [0, 1, 1], expected: [] },
        { nums: [0, 0, 0], expected: [[0, 0, 0]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = threeSum(cases[i].nums.slice()) || [];
          var normRes = res.map(function(t) { return t.slice().sort(function(a,b){return a-b;}); }).sort();
          var normExp = cases[i].expected.map(function(t) { return t.slice().sort(function(a,b){return a-b;}); }).sort();
          if (JSON.stringify(normRes) === JSON.stringify(normExp)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('three_sum') or globals().get('threeSum')
assert fn is not None, "Function three_sum not found"
cases = [
    ([-1, 0, 1, 2, -1, -4], [[-1, -1, 2], [-1, 0, 1]]),
    ([0, 1, 1], []),
    ([0, 0, 0], [[0, 0, 0]])
]
for idx, (nums, expected) in enumerate(cases):
    res = fn(list(nums)) or []
    ans = sorted([sorted(list(t)) for t in res])
    exp = sorted([sorted(list(t)) for t in expected])
    assert ans == exp, f"Test case {idx+1} failed: expected {exp}, got {ans}"
`,
  },

  // 23. Min Stack
  war_min_stack_13: {
    functionName: 'processMinStack',
    pythonFunctionName: 'process_min_stack',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { ops: ["push", "push", "push", "getMin", "pop", "getMin"], vals: [[-2], [0], [-3], [], [], []], expected: [-3, -2] },
        { ops: ["push", "getMin"], vals: [[5], []], expected: [5] },
        { ops: ["push", "push", "getMin", "pop", "getMin"], vals: [[2], [1], [], [], []], expected: [1, 2] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = processMinStack(cases[i].ops.slice(), cases[i].vals.slice());
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('process_min_stack') or globals().get('processMinStack')
assert fn is not None, "Function process_min_stack not found"
cases = [
    (["push", "push", "push", "getMin", "pop", "getMin"], [[-2], [0], [-3], [], [], []], [-3, -2]),
    (["push", "getMin"], [[5], []], [5]),
    (["push", "push", "getMin", "pop", "getMin"], [[2], [1], [], [], []], [1, 2])
]
for idx, (ops, vals, expected) in enumerate(cases):
    ans = list(fn(list(ops), list(vals)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 24. Invert Binary Tree
  war_invert_binary_tree_04: {
    functionName: 'invertTree',
    pythonFunctionName: 'invert_tree',
    totalTests: 3,
    evaluatorCode: `
      function invertArr(arr) {
        if (!arr || !arr.length) return [];
        var res = arr.slice();
        function swap(idx) {
          var left = 2 * idx + 1;
          var right = 2 * idx + 2;
          if (left < res.length && right < res.length) {
            var temp = res[left];
            res[left] = res[right];
            res[right] = temp;
            swap(left);
            swap(right);
          }
        }
        swap(0);
        return res;
      }
      var cases = [
        { root: [4, 2, 7, 1, 3, 6, 9], expected: [4, 7, 2, 9, 6, 3, 1] },
        { root: [2, 1, 3], expected: [2, 3, 1] },
        { root: [], expected: [] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = invertTree(cases[i].root.slice());
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('invert_tree') or globals().get('invertTree')
assert fn is not None, "Function invert_tree not found"
cases = [
    ([4, 2, 7, 1, 3, 6, 9], [4, 7, 2, 9, 6, 3, 1]),
    ([2, 1, 3], [2, 3, 1]),
    ([], [])
]
for idx, (root, expected) in enumerate(cases):
    ans = list(fn(list(root)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 25. Maximum Depth of Binary Tree
  war_max_depth_tree_05: {
    functionName: 'maxDepth',
    pythonFunctionName: 'max_depth',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { root: [3, 9, 20, null, null, 15, 7], expected: 3 },
        { root: [1, null, 2], expected: 2 },
        { root: [], expected: 0 },
        { root: [1], expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = maxDepth(cases[i].root.slice());
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('max_depth') or globals().get('maxDepth')
assert fn is not None, "Function max_depth not found"
cases = [
    ([3, 9, 20, None, None, 15, 7], 3),
    ([1, None, 2], 2),
    ([], 0),
    ([1], 1)
]
for idx, (root, expected) in enumerate(cases):
    ans = fn(list(root))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 26. Validate Binary Search Tree
  war_validate_bst_06: {
    functionName: 'isValidBST',
    pythonFunctionName: 'is_valid_bst',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { root: [2, 1, 3], expected: true },
        { root: [5, 1, 4, null, null, 3, 6], expected: false },
        { root: [1], expected: true },
        { root: [5, 4, 6, null, null, 3, 7], expected: false }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isValidBST(cases[i].root.slice());
          if (Boolean(res) === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('is_valid_bst') or globals().get('isValidBST')
assert fn is not None, "Function is_valid_bst not found"
cases = [
    ([2, 1, 3], True),
    ([5, 1, 4, None, None, 3, 6], False),
    ([1], True),
    ([5, 4, 6, None, None, 3, 7], False)
]
for idx, (root, expected) in enumerate(cases):
    ans = bool(fn(list(root)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 27. Coin Change
  war_coin_change_07: {
    functionName: 'coinChange',
    pythonFunctionName: 'coin_change',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { coins: [1, 2, 5], amount: 11, expected: 3 },
        { coins: [2], amount: 3, expected: -1 },
        { coins: [1], amount: 0, expected: 0 },
        { coins: [1], amount: 2, expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = coinChange(cases[i].coins.slice(), cases[i].amount);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('coin_change') or globals().get('coinChange')
assert fn is not None, "Function coin_change not found"
cases = [
    ([1, 2, 5], 11, 3),
    ([2], 3, -1),
    ([1], 0, 0),
    ([1], 2, 2)
]
for idx, (coins, amount, expected) in enumerate(cases):
    ans = fn(list(coins), amount)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 28. House Robber
  war_house_robber_08: {
    functionName: 'rob',
    pythonFunctionName: 'rob',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [1, 2, 3, 1], expected: 4 },
        { nums: [2, 7, 9, 3, 1], expected: 12 },
        { nums: [0], expected: 0 },
        { nums: [2, 1, 1, 2], expected: 4 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = rob(cases[i].nums.slice());
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('rob')
assert fn is not None, "Function rob not found"
cases = [
    ([1, 2, 3, 1], 4),
    ([2, 7, 9, 3, 1], 12),
    ([0], 0),
    ([2, 1, 1, 2], 4)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 29. Kth Largest Element
  war_kth_largest_09: {
    functionName: 'findKthLargest',
    pythonFunctionName: 'find_kth_largest',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [3, 2, 1, 5, 6, 4], k: 2, expected: 5 },
        { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4, expected: 4 },
        { nums: [1], k: 1, expected: 1 },
        { nums: [7, 6, 5, 4, 3, 2, 1], k: 5, expected: 3 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findKthLargest(cases[i].nums.slice(), cases[i].k);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('find_kth_largest') or globals().get('findKthLargest')
assert fn is not None, "Function find_kth_largest not found"
cases = [
    ([3, 2, 1, 5, 6, 4], 2, 5),
    ([3, 2, 3, 1, 2, 4, 5, 5, 6], 4, 4),
    ([1], 1, 1),
    ([7, 6, 5, 4, 3, 2, 1], 5, 3)
]
for idx, (nums, k, expected) in enumerate(cases):
    ans = fn(list(nums), k)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 30. Number of Islands
  war_number_of_islands_10: {
    functionName: 'numIslands',
    pythonFunctionName: 'num_islands',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { grid: [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]], expected: 1 },
        { grid: [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]], expected: 3 },
        { grid: [["1"]], expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var clone = cases[i].grid.map(function(row){ return row.slice(); });
          var res = numIslands(clone);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('num_islands') or globals().get('numIslands')
assert fn is not None, "Function num_islands not found"
cases = [
    ([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]], 1),
    ([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]], 3),
    ([["1"]], 1)
]
for idx, (grid, expected) in enumerate(cases):
    clone = [list(r) for r in grid]
    ans = fn(clone)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },
  // 31. Majority Element
  war_majority_element_11: {
    functionName: 'majorityElement',
    pythonFunctionName: 'majority_element',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [3, 2, 3], expected: 3 },
        { nums: [2, 2, 1, 1, 1, 2, 2], expected: 2 },
        { nums: [1], expected: 1 },
        { nums: [6, 5, 5], expected: 5 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = majorityElement(cases[i].nums.slice());
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('majority_element') or globals().get('majorityElement')
assert fn is not None, "Function majority_element not found"
cases = [([3, 2, 3], 3), ([2, 2, 1, 1, 1, 2, 2], 2), ([1], 1), ([6, 5, 5], 5)]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 32. First Unique Character
  war_first_unique_char_12: {
    functionName: 'firstUniqChar',
    pythonFunctionName: 'first_uniq_char',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: 'leetcode', expected: 0 },
        { s: 'loveleetcode', expected: 2 },
        { s: 'aabb', expected: -1 },
        { s: 'z', expected: 0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = firstUniqChar(cases[i].s);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('first_uniq_char') or globals().get('firstUniqChar')
assert fn is not None, "Function first_uniq_char not found"
cases = [('leetcode', 0), ('loveleetcode', 2), ('aabb', -1), ('z', 0)]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 33. Climbing Stairs
  war_climbing_stairs_13: {
    functionName: 'climbStairs',
    pythonFunctionName: 'climb_stairs',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { n: 2, expected: 2 },
        { n: 3, expected: 3 },
        { n: 4, expected: 5 },
        { n: 5, expected: 8 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = climbStairs(cases[i].n);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('climb_stairs') or globals().get('climbStairs')
assert fn is not None, "Function climb_stairs not found"
cases = [(2, 2), (3, 3), (4, 5), (5, 8)]
for idx, (n, expected) in enumerate(cases):
    ans = fn(n)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 34. Valid Palindrome II
  war_valid_palindrome_ii_14: {
    functionName: 'validPalindrome',
    pythonFunctionName: 'valid_palindrome',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: 'aba', expected: true },
        { s: 'abca', expected: true },
        { s: 'abc', expected: false },
        { s: 'deeee', expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = validPalindrome(cases[i].s);
          if (Boolean(res) === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('valid_palindrome') or globals().get('validPalindrome')
assert fn is not None, "Function valid_palindrome not found"
cases = [('aba', True), ('abca', True), ('abc', False), ('deeee', True)]
for idx, (s, expected) in enumerate(cases):
    ans = bool(fn(s))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 35. Intersection of Two Arrays
  war_intersection_arrays_15: {
    functionName: 'intersection',
    pythonFunctionName: 'intersection',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { a: [1, 2, 2, 1], b: [2, 2], expected: [2] },
        { a: [4, 9, 5], b: [9, 4, 9, 8, 4], expected: [4, 9] },
        { a: [1, 2], b: [3, 4], expected: [] },
        { a: [1], b: [1], expected: [1] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = intersection(cases[i].a.slice(), cases[i].b.slice());
          var sortedRes = Array.from(new Set(res || [])).sort(function(x, y){ return x - y; });
          if (JSON.stringify(sortedRes) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(sortedRes) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('intersection')
assert fn is not None, "Function intersection not found"
cases = [
    ([1, 2, 2, 1], [2, 2], [2]),
    ([4, 9, 5], [9, 4, 9, 8, 4], [4, 9]),
    ([1, 2], [3, 4], []),
    ([1], [1], [1])
]
for idx, (a, b, expected) in enumerate(cases):
    ans = sorted(list(set(fn(list(a), list(b)))))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 36. Pascal's Triangle
  war_pascals_triangle_16: {
    functionName: 'generatePascal',
    pythonFunctionName: 'generate_pascal',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { n: 1, expected: [[1]] },
        { n: 2, expected: [[1], [1, 1]] },
        { n: 4, expected: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]] },
        { n: 5, expected: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = generatePascal(cases[i].n);
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('generate_pascal') or globals().get('generatePascal')
assert fn is not None, "Function generate_pascal not found"
cases = [
    (1, [[1]]),
    (2, [[1], [1, 1]]),
    (4, [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]),
    (5, [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]])
]
for idx, (n, expected) in enumerate(cases):
    ans = [list(r) for r in fn(n)]
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 37. Disappeared Numbers
  war_disappeared_numbers_17: {
    functionName: 'findDisappearedNumbers',
    pythonFunctionName: 'find_disappeared_numbers',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [4, 3, 2, 7, 8, 2, 3, 1], expected: [5, 6] },
        { nums: [1, 1], expected: [2] },
        { nums: [2, 2], expected: [1] },
        { nums: [1], expected: [] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findDisappearedNumbers(cases[i].nums.slice());
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('find_disappeared_numbers') or globals().get('findDisappearedNumbers')
assert fn is not None, "Function find_disappeared_numbers not found"
cases = [
    ([4, 3, 2, 7, 8, 2, 3, 1], [5, 6]),
    ([1, 1], [2]),
    ([2, 2], [1]),
    ([1], [])
]
for idx, (nums, expected) in enumerate(cases):
    ans = list(fn(list(nums)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 38. Summary Ranges
  war_summary_ranges_18: {
    functionName: 'summaryRanges',
    pythonFunctionName: 'summary_ranges',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [0, 1, 2, 4, 5, 7], expected: ["0->2", "4->5", "7"] },
        { nums: [0, 2, 3, 4, 6, 8, 9], expected: ["0", "2->4", "6", "8->9"] },
        { nums: [], expected: [] },
        { nums: [-1], expected: ["-1"] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = summaryRanges(cases[i].nums.slice());
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('summary_ranges') or globals().get('summaryRanges')
assert fn is not None, "Function summary_ranges not found"
cases = [
    ([0, 1, 2, 4, 5, 7], ["0->2", "4->5", "7"]),
    ([0, 2, 3, 4, 6, 8, 9], ["0", "2->4", "6", "8->9"]),
    ([], []),
    ([-1], ["-1"])
]
for idx, (nums, expected) in enumerate(cases):
    ans = [str(x) for x in fn(list(nums))]
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 39. Happy Number
  war_happy_number_19: {
    functionName: 'isHappy',
    pythonFunctionName: 'is_happy',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { n: 19, expected: true },
        { n: 2, expected: false },
        { n: 1, expected: true },
        { n: 7, expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isHappy(cases[i].n);
          if (Boolean(res) === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('is_happy') or globals().get('isHappy')
assert fn is not None, "Function is_happy not found"
cases = [(19, True), (2, False), (1, True), (7, True)]
for idx, (n, expected) in enumerate(cases):
    ans = bool(fn(n))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 40. Length of Last Word
  war_length_of_last_word_20: {
    functionName: 'lengthOfLastWord',
    pythonFunctionName: 'length_of_last_word',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: 'Hello World', expected: 5 },
        { s: '   fly me   to   the moon  ', expected: 4 },
        { s: 'luffy is still joyboy', expected: 6 },
        { s: 'a', expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = lengthOfLastWord(cases[i].s);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('length_of_last_word') or globals().get('lengthOfLastWord')
assert fn is not None, "Function length_of_last_word not found"
cases = [
    ('Hello World', 5),
    ('   fly me   to   the moon  ', 4),
    ('luffy is still joyboy', 6),
    ('a', 1)
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 41. LRU Cache
  war_lru_cache_14: {
    functionName: 'processLruCache',
    pythonFunctionName: 'process_lru_cache',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { cap: 2, ops: ["put","put","get","put","get","put","get","get","get"], vals: [[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]], expected: [null, null, 1, null, -1, null, -1, 3, 4] },
        { cap: 1, ops: ["put","get","put","get"], vals: [[2,1],[2],[3,2],[2]], expected: [null, 1, null, -1] },
        { cap: 2, ops: ["get","put","get"], vals: [[2],[2,6],[2]], expected: [-1, null, 6] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = processLruCache(cases[i].cap, cases[i].ops.slice(), cases[i].vals.slice());
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('process_lru_cache') or globals().get('processLruCache')
assert fn is not None, "Function process_lru_cache not found"
cases = [
    (2, ["put","put","get","put","get","put","get","get","get"], [[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]], [None, None, 1, None, -1, None, -1, 3, 4]),
    (1, ["put","get","put","get"], [[2,1],[2],[3,2],[2]], [None, 1, None, -1]),
    (2, ["get","put","get"], [[2],[2,6],[2]], [-1, None, 6])
]
for idx, (cap, ops, vals, expected) in enumerate(cases):
    ans = list(fn(cap, list(ops), [list(v) for v in vals]))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 42. Group Anagrams
  war_group_anagrams_15: {
    functionName: 'groupAnagrams',
    pythonFunctionName: 'group_anagrams',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { strs: ["eat","tea","tan","ate","nat","bat"], expected: [["bat"],["nat","tan"],["ate","eat","tea"]] },
        { strs: [""], expected: [[""]] },
        { strs: ["a"], expected: [["a"]] }
      ];
      function norm(groups) {
        return (groups || []).map(function(g){ return g.slice().sort(); }).sort(function(a, b){ return a.join(',').localeCompare(b.join(',')); });
      }
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = groupAnagrams(cases[i].strs.slice());
          if (JSON.stringify(norm(res)) === JSON.stringify(norm(cases[i].expected))) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('group_anagrams') or globals().get('groupAnagrams')
assert fn is not None, "Function group_anagrams not found"
cases = [
    (["eat","tea","tan","ate","nat","bat"], [["bat"],["nat","tan"],["ate","eat","tea"]]),
    ([""], [[""]]),
    (["a"], [["a"]])
]
def norm(groups):
    return sorted([sorted(list(g)) for g in groups])
for idx, (strs, expected) in enumerate(cases):
    ans = norm(fn(list(strs)))
    exp = norm(expected)
    assert ans == exp, f"Test case {idx+1} failed: expected {exp}, got {ans}"
`,
  },

  // 43. Merge Intervals
  war_merge_intervals_16: {
    functionName: 'mergeIntervals',
    pythonFunctionName: 'merge_intervals',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]], expected: [[1, 6], [8, 10], [15, 18]] },
        { intervals: [[1, 4], [4, 5]], expected: [[1, 5]] },
        { intervals: [[1, 4], [0, 4]], expected: [[0, 4]] },
        { intervals: [[1, 4], [2, 3]], expected: [[1, 4]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var clone = cases[i].intervals.map(function(iv){ return iv.slice(); });
          var res = mergeIntervals(clone);
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('merge_intervals') or globals().get('mergeIntervals')
assert fn is not None, "Function merge_intervals not found"
cases = [
    ([[1, 3], [2, 6], [8, 10], [15, 18]], [[1, 6], [8, 10], [15, 18]]),
    ([[1, 4], [4, 5]], [[1, 5]]),
    ([[1, 4], [0, 4]], [[0, 4]]),
    ([[1, 4], [2, 3]], [[1, 4]])
]
for idx, (ivs, expected) in enumerate(cases):
    ans = [list(x) for x in fn([list(iv) for iv in ivs])]
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 44. Daily Temperatures
  war_daily_temperatures_17: {
    functionName: 'dailyTemperatures',
    pythonFunctionName: 'daily_temperatures',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { temperatures: [73, 74, 75, 71, 69, 72, 76, 73], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
        { temperatures: [30, 40, 50, 60], expected: [1, 1, 1, 0] },
        { temperatures: [30, 60, 90], expected: [1, 1, 0] },
        { temperatures: [80], expected: [0] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = dailyTemperatures(cases[i].temperatures.slice());
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('daily_temperatures') or globals().get('dailyTemperatures')
assert fn is not None, "Function daily_temperatures not found"
cases = [
    ([73, 74, 75, 71, 69, 72, 76, 73], [1, 1, 4, 2, 1, 1, 0, 0]),
    ([30, 40, 50, 60], [1, 1, 1, 0]),
    ([30, 60, 90], [1, 1, 0]),
    ([80], [0])
]
for idx, (t, expected) in enumerate(cases):
    ans = list(fn(list(t)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 45. Subarray Sum Equals K
  war_subarray_sum_k_18: {
    functionName: 'subarraySum',
    pythonFunctionName: 'subarray_sum',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [1, 1, 1], k: 2, expected: 2 },
        { nums: [1, 2, 3], k: 3, expected: 2 },
        { nums: [1, -1, 0], k: 0, expected: 3 },
        { nums: [3], k: 3, expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = subarraySum(cases[i].nums.slice(), cases[i].k);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('subarray_sum') or globals().get('subarraySum')
assert fn is not None, "Function subarray_sum not found"
cases = [
    ([1, 1, 1], 2, 2),
    ([1, 2, 3], 3, 2),
    ([1, -1, 0], 0, 3),
    ([3], 3, 1)
]
for idx, (nums, k, expected) in enumerate(cases):
    ans = fn(list(nums), k)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 46. Find Minimum in Rotated Sorted Array
  war_find_min_rotated_19: {
    functionName: 'findMin',
    pythonFunctionName: 'find_min',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [3, 4, 5, 1, 2], expected: 1 },
        { nums: [4, 5, 6, 7, 0, 1, 2], expected: 0 },
        { nums: [11, 13, 15, 17], expected: 11 },
        { nums: [2, 1], expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findMin(cases[i].nums.slice());
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('find_min') or globals().get('findMin')
assert fn is not None, "Function find_min not found"
cases = [
    ([3, 4, 5, 1, 2], 1),
    ([4, 5, 6, 7, 0, 1, 2], 0),
    ([11, 13, 15, 17], 11),
    ([2, 1], 1)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 47. Top K Frequent Elements
  war_top_k_frequent_20: {
    functionName: 'topKFrequent',
    pythonFunctionName: 'top_k_frequent',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [1, 1, 1, 2, 2, 3], k: 2, expected: [1, 2] },
        { nums: [1], k: 1, expected: [1] },
        { nums: [4, 1, -1, 2, -1, 2, 3], k: 2, expected: [-1, 2] },
        { nums: [1, 2], k: 2, expected: [1, 2] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = topKFrequent(cases[i].nums.slice(), cases[i].k);
          var sortedRes = (res || []).slice().sort(function(a, b){ return a - b; });
          var sortedExp = cases[i].expected.slice().sort(function(a, b){ return a - b; });
          if (JSON.stringify(sortedRes) === JSON.stringify(sortedExp)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(sortedExp) + ', got ' + JSON.stringify(sortedRes) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('top_k_frequent') or globals().get('topKFrequent')
assert fn is not None, "Function top_k_frequent not found"
cases = [
    ([1, 1, 1, 2, 2, 3], 2, [1, 2]),
    ([1], 1, [1]),
    ([4, 1, -1, 2, -1, 2, 3], 2, [-1, 2]),
    ([1, 2], 2, [1, 2])
]
for idx, (nums, k, expected) in enumerate(cases):
    ans = sorted(list(fn(list(nums), k)))
    exp = sorted(list(expected))
    assert ans == exp, f"Test case {idx+1} failed: expected {exp}, got {ans}"
`,
  },

  // 48. Letter Combinations of a Phone Number
  war_letter_combinations_21: {
    functionName: 'letterCombinations',
    pythonFunctionName: 'letter_combinations',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { digits: '23', expected: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"] },
        { digits: '', expected: [] },
        { digits: '2', expected: ["a", "b", "c"] },
        { digits: '7', expected: ["p", "q", "r", "s"] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = letterCombinations(cases[i].digits);
          var s1 = (res || []).slice().sort();
          var s2 = cases[i].expected.slice().sort();
          if (JSON.stringify(s1) === JSON.stringify(s2)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(s2) + ', got ' + JSON.stringify(s1) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('letter_combinations') or globals().get('letterCombinations')
assert fn is not None, "Function letter_combinations not found"
cases = [
    ('23', ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]),
    ('', []),
    ('2', ["a", "b", "c"]),
    ('7', ["p", "q", "r", "s"])
]
for idx, (digits, expected) in enumerate(cases):
    ans = sorted(list(fn(digits)))
    exp = sorted(list(expected))
    assert ans == exp, f"Test case {idx+1} failed: expected {exp}, got {ans}"
`,
  },

  // 49. Rotate Image
  war_rotate_image_22: {
    functionName: 'rotateImage',
    pythonFunctionName: 'rotate_image',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
        { matrix: [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]], expected: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]] },
        { matrix: [[1]], expected: [[1]] },
        { matrix: [[1, 2], [3, 4]], expected: [[3, 1], [4, 2]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var clone = cases[i].matrix.map(function(r){ return r.slice(); });
          var res = rotateImage(clone);
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('rotate_image') or globals().get('rotateImage')
assert fn is not None, "Function rotate_image not found"
cases = [
    ([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[7, 4, 1], [8, 5, 2], [9, 6, 3]]),
    ([[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]], [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]),
    ([[1]], [[1]]),
    ([[1, 2], [3, 4]], [[3, 1], [4, 2]])
]
for idx, (matrix, expected) in enumerate(cases):
    clone = [list(r) for r in matrix]
    ans = [list(r) for r in fn(clone)]
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 50. Decode String
  war_decode_string_23: {
    functionName: 'decodeString',
    pythonFunctionName: 'decode_string',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: '3[a]2[bc]', expected: 'aaabcbc' },
        { s: '3[a2[c]]', expected: 'accaccacc' },
        { s: '2[abc]3[cd]ef', expected: 'abcabccdcdcdef' },
        { s: 'abc', expected: 'abc' }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = decodeString(cases[i].s);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('decode_string') or globals().get('decodeString')
assert fn is not None, "Function decode_string not found"
cases = [
    ('3[a]2[bc]', 'aaabcbc'),
    ('3[a2[c]]', 'accaccacc'),
    ('2[abc]3[cd]ef', 'abcabccdcdcdef'),
    ('abc', 'abc')
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 51. Trapping Rain Water
  war_trapping_rain_water_11: {
    functionName: 'trap',
    pythonFunctionName: 'trap',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], expected: 6 },
        { height: [4, 2, 0, 3, 2, 5], expected: 9 },
        { height: [1, 2, 3, 4], expected: 0 },
        { height: [3, 0, 2, 0, 4], expected: 7 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = trap(cases[i].height.slice());
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('trap')
assert fn is not None, "Function trap not found"
cases = [
    ([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], 6),
    ([4, 2, 0, 3, 2, 5], 9),
    ([1, 2, 3, 4], 0),
    ([3, 0, 2, 0, 4], 7)
]
for idx, (height, expected) in enumerate(cases):
    ans = fn(list(height))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 52. Sliding Window Maximum
  war_sliding_window_max_12: {
    functionName: 'maxSlidingWindow',
    pythonFunctionName: 'max_sliding_window',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3, expected: [3, 3, 5, 5, 6, 7] },
        { nums: [1], k: 1, expected: [1] },
        { nums: [1, -1], k: 1, expected: [1, -1] },
        { nums: [9, 11], k: 2, expected: [11] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = maxSlidingWindow(cases[i].nums.slice(), cases[i].k);
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('max_sliding_window') or globals().get('maxSlidingWindow')
assert fn is not None, "Function max_sliding_window not found"
cases = [
    ([1, 3, -1, -3, 5, 3, 6, 7], 3, [3, 3, 5, 5, 6, 7]),
    ([1], 1, [1]),
    ([1, -1], 1, [1, -1]),
    ([9, 11], 2, [11])
]
for idx, (nums, k, expected) in enumerate(cases):
    ans = list(fn(list(nums), k))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 53. Word Break
  war_word_break_13: {
    functionName: 'wordBreak',
    pythonFunctionName: 'word_break',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: 'leetcode', wordDict: ['leet', 'code'], expected: true },
        { s: 'applepenapple', wordDict: ['apple', 'pen'], expected: true },
        { s: 'catsandog', wordDict: ['cats', 'dog', 'sand', 'and', 'cat'], expected: false },
        { s: 'cars', wordDict: ['car', 'ca', 'rs'], expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = wordBreak(cases[i].s, cases[i].wordDict.slice());
          if (Boolean(res) === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('word_break') or globals().get('wordBreak')
assert fn is not None, "Function word_break not found"
cases = [
    ('leetcode', ['leet', 'code'], True),
    ('applepenapple', ['apple', 'pen'], True),
    ('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'], False),
    ('cars', ['car', 'ca', 'rs'], True)
]
for idx, (s, wordDict, expected) in enumerate(cases):
    ans = bool(fn(s, list(wordDict)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 54. Longest Increasing Subsequence
  war_longest_increasing_subsequence_14: {
    functionName: 'lengthOfLIS',
    pythonFunctionName: 'length_of_lis',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [10, 9, 2, 5, 3, 7, 101, 18], expected: 4 },
        { nums: [0, 1, 0, 3, 2, 3], expected: 4 },
        { nums: [7, 7, 7, 7, 7, 7, 7], expected: 1 },
        { nums: [4, 10, 4, 3, 8, 9], expected: 3 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = lengthOfLIS(cases[i].nums.slice());
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('length_of_lis') or globals().get('lengthOfLIS')
assert fn is not None, "Function length_of_lis not found"
cases = [
    ([10, 9, 2, 5, 3, 7, 101, 18], 4),
    ([0, 1, 0, 3, 2, 3], 4),
    ([7, 7, 7, 7, 7, 7, 7], 1),
    ([4, 10, 4, 3, 8, 9], 3)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 55. Course Schedule
  war_course_schedule_15: {
    functionName: 'canFinish',
    pythonFunctionName: 'can_finish',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { numCourses: 2, prerequisites: [[1, 0]], expected: true },
        { numCourses: 2, prerequisites: [[1, 0], [0, 1]], expected: false },
        { numCourses: 3, prerequisites: [[1, 0], [2, 1]], expected: true },
        { numCourses: 4, prerequisites: [[1, 0], [2, 1], [3, 2], [1, 3]], expected: false }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var pClone = cases[i].prerequisites.map(function(p){ return p.slice(); });
          var res = canFinish(cases[i].numCourses, pClone);
          if (Boolean(res) === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('can_finish') or globals().get('canFinish')
assert fn is not None, "Function can_finish not found"
cases = [
    (2, [[1, 0]], True),
    (2, [[1, 0], [0, 1]], False),
    (3, [[1, 0], [2, 1]], True),
    (4, [[1, 0], [2, 1], [3, 2], [1, 3]], False)
]
for idx, (nc, p, expected) in enumerate(cases):
    ans = bool(fn(nc, [list(x) for x in p]))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 56. Clone Graph
  war_clone_graph_16: {
    functionName: 'cloneGraphNodes',
    pythonFunctionName: 'clone_graph_nodes',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { adjList: [[2, 4], [1, 3], [2, 4], [1, 3]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]] },
        { adjList: [[]], expected: [[]] },
        { adjList: [], expected: [] },
        { adjList: [[2], [1]], expected: [[2], [1]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var clone = cases[i].adjList.map(function(row){ return row.slice(); });
          var res = cloneGraphNodes(clone);
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('clone_graph_nodes') or globals().get('cloneGraphNodes')
assert fn is not None, "Function clone_graph_nodes not found"
cases = [
    ([[2, 4], [1, 3], [2, 4], [1, 3]], [[2, 4], [1, 3], [2, 4], [1, 3]]),
    ([[]], [[]]),
    ([], []),
    ([[2], [1]], [[2], [1]])
]
for idx, (adj, expected) in enumerate(cases):
    ans = [list(r) for r in fn([list(x) for x in adj])]
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 57. Token Bucket Rate Limiter
  war_token_bucket_rate_limiter_17: {
    functionName: 'simulateRateLimiter',
    pythonFunctionName: 'simulate_rate_limiter',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        {
          capacity: 5,
          refillRatePerSec: 1,
          requests: [{ timestamp: 0, tokensRequested: 3 }, { timestamp: 0, tokensRequested: 3 }, { timestamp: 2, tokensRequested: 3 }],
          expected: [true, false, true]
        },
        {
          capacity: 10,
          refillRatePerSec: 2,
          requests: [{ timestamp: 1, tokensRequested: 10 }, { timestamp: 2, tokensRequested: 3 }, { timestamp: 3, tokensRequested: 3 }],
          expected: [true, false, true]
        },
        {
          capacity: 1,
          refillRatePerSec: 0.5,
          requests: [{ timestamp: 0, tokensRequested: 1 }, { timestamp: 1, tokensRequested: 1 }],
          expected: [true, false]
        }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var reqClone = cases[i].requests.map(function(r){ return { timestamp: r.timestamp, tokensRequested: r.tokensRequested }; });
          var res = simulateRateLimiter(cases[i].capacity, cases[i].refillRatePerSec, reqClone);
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('simulate_rate_limiter') or globals().get('simulateRateLimiter')
assert fn is not None, "Function simulate_rate_limiter not found"
cases = [
    (5, 1, [{"timestamp": 0, "tokensRequested": 3}, {"timestamp": 0, "tokensRequested": 3}, {"timestamp": 2, "tokensRequested": 3}], [True, False, True]),
    (10, 2, [{"timestamp": 1, "tokensRequested": 10}, {"timestamp": 2, "tokensRequested": 3}, {"timestamp": 3, "tokensRequested": 3}], [True, False, True]),
    (1, 0.5, [{"timestamp": 0, "tokensRequested": 1}, {"timestamp": 1, "tokensRequested": 1}], [True, False])
]
for idx, (cap, refill, reqs, expected) in enumerate(cases):
    ans = [bool(x) for x in fn(cap, refill, [dict(r) for r in reqs])]
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 58. Find Median from Data Stream
  war_median_data_stream_18: {
    functionName: 'processMedianStream',
    pythonFunctionName: 'process_median_stream',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { ops: ["addNum", "addNum", "findMedian", "addNum", "findMedian"], vals: [[1], [2], [], [3], []], expected: [1.5, 2] },
        { ops: ["addNum", "findMedian"], vals: [[5], []], expected: [5] },
        { ops: ["addNum", "addNum", "addNum", "addNum", "findMedian"], vals: [[6], [10], [2], [8], []], expected: [7] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = processMedianStream(cases[i].ops.slice(), cases[i].vals.slice());
          if (JSON.stringify(res) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(res) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('process_median_stream') or globals().get('processMedianStream')
assert fn is not None, "Function process_median_stream not found"
cases = [
    (["addNum", "addNum", "findMedian", "addNum", "findMedian"], [[1], [2], [], [3], []], [1.5, 2]),
    (["addNum", "findMedian"], [[5], []], [5]),
    (["addNum", "addNum", "addNum", "addNum", "findMedian"], [[6], [10], [2], [8], []], [7])
]
for idx, (ops, vals, expected) in enumerate(cases):
    ans = [float(x) for x in fn(list(ops), [list(v) for v in vals])]
    exp = [float(x) for x in expected]
    assert ans == exp, f"Test case {idx+1} failed: expected {exp}, got {ans}"
`,
  },

  // 59. Word Ladder
  war_word_ladder_19: {
    functionName: 'ladderLength',
    pythonFunctionName: 'ladder_length',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { beginWord: 'hit', endWord: 'cog', wordList: ["hot","dot","dog","lot","log","cog"], expected: 5 },
        { beginWord: 'hit', endWord: 'cog', wordList: ["hot","dot","dog","lot","log"], expected: 0 },
        { beginWord: 'a', endWord: 'c', wordList: ["a","b","c"], expected: 2 },
        { beginWord: 'hot', endWord: 'dog', wordList: ["hot","dog"], expected: 0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = ladderLength(cases[i].beginWord, cases[i].endWord, cases[i].wordList.slice());
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('ladder_length') or globals().get('ladderLength')
assert fn is not None, "Function ladder_length not found"
cases = [
    ('hit', 'cog', ["hot","dot","dog","lot","log","cog"], 5),
    ('hit', 'cog', ["hot","dot","dog","lot","log"], 0),
    ('a', 'c', ["a","b","c"], 2),
    ('hot', 'dog', ["hot","dog"], 0)
]
for idx, (bw, ew, wl, expected) in enumerate(cases):
    ans = fn(bw, ew, list(wl))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 60. Edit Distance
  war_edit_distance_20: {
    functionName: 'minDistance',
    pythonFunctionName: 'min_distance',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { word1: 'horse', word2: 'ros', expected: 3 },
        { word1: 'intention', word2: 'execution', expected: 5 },
        { word1: '', word2: 'a', expected: 1 },
        { word1: 'abc', word2: 'abc', expected: 0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = minDistance(cases[i].word1, cases[i].word2);
          if (res === cases[i].expected) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + cases[i].expected + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('min_distance') or globals().get('minDistance')
assert fn is not None, "Function min_distance not found"
cases = [
    ('horse', 'ros', 3),
    ('intention', 'execution', 5),
    ('', 'a', 1),
    ('abc', 'abc', 0)
]
for idx, (w1, w2, expected) in enumerate(cases):
    ans = fn(w1, w2)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },
};

const EVALUATOR_WORKER_SCRIPT = `
const { parentPort, workerData } = require('node:worker_threads');
const vm = require('node:vm');
const { cleanCode, functionName, totalTests, evaluatorCode } = workerData;

const INIT_REALM = \`
  var console = { log: function(){}, error: function(){}, warn: function(){}, info: function(){} };
  function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }
\`;

try {
  // Context A: student code runs here
  const sandboxA = Object.create(null);
  const contextA = vm.createContext(sandboxA);
  vm.runInContext(INIT_REALM, contextA);

  // 1. Evaluate student script in context A
  try {
    const script = new vm.Script(cleanCode, { filename: 'submission.js' });
    script.runInContext(contextA, { timeout: 1500 });
  } catch (compileErr) {
    parentPort.postMessage({
      passed: false,
      status: compileErr && compileErr.name === 'SyntaxError' ? 'SYNTAX_ERROR' : 'EXECUTION_ERROR',
      testsPassed: 0,
      totalTests: totalTests,
      error: 'syntax or execution error in submitted solution.'
    });
    process.exit(0);
  }

  // 2. Assert that the required function exists in context A
  const fnExists = vm.runInContext('typeof ' + functionName + " === 'function'", contextA);
  if (!fnExists) {
    parentPort.postMessage({
      passed: false,
      status: 'EXECUTION_ERROR',
      testsPassed: 0,
      totalTests: totalTests,
      error: "Solution function '" + functionName + "' was not defined."
    });
    process.exit(0);
  }

  // 3. Run evaluator in a FRESH context B — student code never ran here.
  //    Freeze key built-ins BEFORE injecting the student function so that
  //    student code reaching B's realm via cross-context constructor chains
  //    cannot override JSON.stringify or String used in comparisons.
  const sandboxB = Object.create(null);
  const contextB = vm.createContext(sandboxB);
  vm.runInContext(INIT_REALM, contextB);
  vm.runInContext('Object.freeze(JSON); Object.freeze(String); Object.freeze(Array.prototype);', contextB);
  // Inject the student's function from A into B by reference
  sandboxB[functionName] = sandboxA[functionName];

  const evalScript = new vm.Script('(function() { ' + evaluatorCode + ' })()', { filename: 'evaluator.js' });
  const result = evalScript.runInContext(contextB, { timeout: 1500 });
  parentPort.postMessage({
    passed: Boolean(result && result.passed),
    status: result && result.status ? result.status : (result && result.passed ? 'SUCCESS' : 'FAILED'),
    testsPassed: typeof result?.testsPassed === 'number' ? result.testsPassed : 0,
    totalTests: totalTests,
    error: result && result.error ? String(result.error).slice(0, 200) : undefined
  });
} catch (err) {
  const isTimeout = err && (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || /timed out/i.test(err.message));
  parentPort.postMessage({
    passed: false,
    status: isTimeout ? 'TIMEOUT' : 'EXECUTION_ERROR',
    testsPassed: 0,
    totalTests: totalTests,
    error: isTimeout ? 'Execution timed out (1500ms limit exceeded)' : 'Evaluation runtime failure.'
  });
}
`;

const INIT_REALM_CODE = `
  var console = { log: function(){}, error: function(){}, warn: function(){}, info: function(){} };
  function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }
`;

export function runEvaluationInVmDirectly(data: SandboxExecutionParams): EvaluatorResult {
  try {
    // Context A: student code
    const sandboxA: Record<string, any> = Object.create(null);
    const contextA = vm.createContext(sandboxA);
    vm.runInContext(INIT_REALM_CODE, contextA);

    // 1. Evaluate student script in context A
    try {
      const script = new vm.Script(data.cleanCode, { filename: 'submission.js' });
      script.runInContext(contextA, { timeout: 1500 });
    } catch (compileErr: any) {
      return {
        passed: false,
        status: compileErr && compileErr.name === 'SyntaxError' ? 'SYNTAX_ERROR' : 'EXECUTION_ERROR',
        testsPassed: 0,
        totalTests: data.totalTests,
        error: 'syntax or execution error in submitted solution.',
      };
    }

    // 2. Assert that the required function exists
    const fnExists = vm.runInContext(`typeof ${data.functionName} === 'function'`, contextA);
    if (!fnExists) {
      return {
        passed: false,
        status: 'EXECUTION_ERROR',
        testsPassed: 0,
        totalTests: data.totalTests,
        error: `Solution function '${data.functionName}' was not defined.`,
      };
    }

    // 3. Run evaluator in a FRESH context B so student can't forge built-ins.
    // Freeze key intrinsics before injecting the student function.
    const sandboxB: Record<string, any> = Object.create(null);
    const contextB = vm.createContext(sandboxB);
    vm.runInContext(INIT_REALM_CODE, contextB);
    vm.runInContext('Object.freeze(JSON); Object.freeze(String); Object.freeze(Array.prototype);', contextB);
    sandboxB[data.functionName] = sandboxA[data.functionName];

    const evalScript = new vm.Script(`(function() { ${data.evaluatorCode} })()`, { filename: 'evaluator.js' });
    const result = evalScript.runInContext(contextB, { timeout: 1500 });
    return {
      passed: Boolean(result && result.passed),
      status: result && result.status ? result.status : (result && result.passed ? 'SUCCESS' : 'FAILED'),
      testsPassed: typeof result?.testsPassed === 'number' ? result.testsPassed : 0,
      totalTests: data.totalTests,
      error: result && result.error ? String(result.error).slice(0, 200) : undefined,
    };
  } catch (err: any) {
    const isTimeout = err && (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || /timed out/i.test(err.message));
    return {
      passed: false,
      status: isTimeout ? 'TIMEOUT' : 'EXECUTION_ERROR',
      testsPassed: 0,
      totalTests: data.totalTests,
      error: isTimeout ? 'Execution timed out (1500ms limit exceeded)' : 'Evaluation runtime failure.',
    };
  }
}

export async function runEvaluationInSandbox(data: SandboxExecutionParams): Promise<EvaluatorResult> {
  // Execute inside a dedicated OS Worker Thread for true main-thread isolation
  // against synchronous infinite loops (while(true))
  try {
    return await new Promise<EvaluatorResult>((resolve) => {
      let settled = false;
      let worker: Worker | null = null;

      const timer = setTimeout(async () => {
        if (!settled) {
          settled = true;
          if (worker) {
            try {
              await worker.terminate();
            } catch {}
          }
          resolve({
            passed: false,
            status: 'TIMEOUT',
            testsPassed: 0,
            totalTests: data.totalTests,
            error: 'Execution timed out (2000ms limit exceeded)',
          });
        }
      }, 2500);

      try {
        worker = new Worker(EVALUATOR_WORKER_SCRIPT, {
          eval: true,
          workerData: data,
        });

        worker.on('message', (msg: EvaluatorResult) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve(msg);
          }
        });

        worker.on('error', (err: Error) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve({
              passed: false,
              status: 'RUNTIME_ERROR',
              testsPassed: 0,
              totalTests: data.totalTests,
              error: err?.message || 'Worker thread execution error',
            });
          }
        });

        worker.on('exit', (code: number) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve({
              passed: false,
              status: 'RUNTIME_ERROR',
              testsPassed: 0,
              totalTests: data.totalTests,
              error: `Worker exited unexpectedly with code ${code}`,
            });
          }
        });
      } catch (spawnErr) {
        clearTimeout(timer);
        throw spawnErr;
      }
    });
  } catch {
    // Fallback: direct isolated node:vm execution if worker thread cannot be spawned
    return runEvaluationInVmDirectly(data);
  }
}
