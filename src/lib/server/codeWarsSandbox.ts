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
    { pattern: /\bconstructor\b/i, token: 'constructor' },
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
