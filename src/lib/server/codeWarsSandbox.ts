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
    totalTests: 4,
    evaluator: (fn) => CodeWarsApiService.evaluateConcurrencyTestCases(fn),
    evaluatorCode: `
      var cases = [
        {
          requests: [
            { threadId: "T1", resourceIds: ["R2", "R1"] },
            { threadId: "T2", resourceIds: ["R1", "R2"] }
          ],
          expected: ["R1", "R2"]
        },
        {
          requests: [
            { threadId: "T1", resourceIds: ["R3", "R1", "R2"] }
          ],
          expected: ["R1", "R2", "R3"]
        },
        {
          requests: [
            { threadId: "T1", resourceIds: ["R5"] }
          ],
          expected: ["R5"]
        },
        {
          requests: [
            { threadId: "T1", resourceIds: ["R4", "R2"] },
            { threadId: "T2", resourceIds: ["R3", "R1"] }
          ],
          expected: ["R1", "R2", "R3", "R4"]
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
    ([{"threadId": "T1", "resourceIds": ["R3", "R1", "R2"]}], ["R1", "R2", "R3"]),
    ([{"threadId": "T1", "resourceIds": ["R5"]}], ["R5"]),
    ([{"threadId": "T1", "resourceIds": ["R4", "R2"]}, {"threadId": "T2", "resourceIds": ["R3", "R1"]}], ["R1", "R2", "R3", "R4"])
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
    totalTests: 4,
    evaluator: (fn) => CodeWarsApiService.evaluateSqlTestCases(fn),
    evaluatorCode: `
      var cases = [
        {
          table: "orders",
          eq: ["tenant_id", "status"],
          range: "created_at",
          expected: "CREATE INDEX idx_orders_tenant_id_status_created_at ON orders (tenant_id, status, created_at);"
        },
        {
          table: "logs",
          eq: ["service_id"],
          range: "timestamp",
          expected: "CREATE INDEX idx_logs_service_id_timestamp ON logs (service_id, timestamp);"
        },
        {
          table: "users",
          eq: ["org_id", "department_id", "team_id"],
          range: "joined_date",
          expected: "CREATE INDEX idx_users_org_id_department_id_team_id_joined_date ON users (org_id, department_id, team_id, joined_date);"
        },
        {
          table: "trades",
          eq: ["symbol"],
          range: "price",
          expected: "CREATE INDEX idx_trades_symbol_price ON trades (symbol, price);"
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
    ("orders", ["tenant_id", "status"], "created_at", "CREATE INDEX idx_orders_tenant_id_status_created_at ON orders (tenant_id, status, created_at);"),
    ("logs", ["service_id"], "timestamp", "CREATE INDEX idx_logs_service_id_timestamp ON logs (service_id, timestamp);"),
    ("users", ["org_id", "department_id", "team_id"], "joined_date", "CREATE INDEX idx_users_org_id_department_id_team_id_joined_date ON users (org_id, department_id, team_id, joined_date);"),
    ("trades", ["symbol"], "price", "CREATE INDEX idx_trades_symbol_price ON trades (symbol, price);")
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

  // 61. Plus One
  war_plus_one_21: {
    functionName: 'plusOne',
    pythonFunctionName: 'plus_one',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { digits: [1, 2, 3], expected: [1, 2, 4] },
        { digits: [4, 3, 2, 1], expected: [4, 3, 2, 2] },
        { digits: [9], expected: [1, 0] },
        { digits: [9, 9, 9], expected: [1, 0, 0, 0] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = plusOne(cases[i].digits.slice());
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
fn = globals().get('plus_one') or globals().get('plusOne')
assert fn is not None, "Function plus_one not found"
cases = [
    ([1, 2, 3], [1, 2, 4]),
    ([4, 3, 2, 1], [4, 3, 2, 2]),
    ([9], [1, 0]),
    ([9, 9, 9], [1, 0, 0, 0])
]
for idx, (digits, expected) in enumerate(cases):
    ans = list(fn(list(digits)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 62. Longest Common Prefix
  war_longest_common_prefix_22: {
    functionName: 'longestCommonPrefix',
    pythonFunctionName: 'longest_common_prefix',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { strs: ["flower","flow","flight"], expected: "fl" },
        { strs: ["dog","racecar","car"], expected: "" },
        { strs: ["interspecies","interstellar","interstate"], expected: "inters" },
        { strs: ["single"], expected: "single" }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = longestCommonPrefix(cases[i].strs.slice());
          if (res === cases[i].expected) {
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
fn = globals().get('longest_common_prefix') or globals().get('longestCommonPrefix')
assert fn is not None, "Function longest_common_prefix not found"
cases = [
    (["flower","flow","flight"], "fl"),
    (["dog","racecar","car"], ""),
    (["interspecies","interstellar","interstate"], "inters"),
    (["single"], "single")
]
for idx, (strs, expected) in enumerate(cases):
    ans = fn(list(strs))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 63. Remove Duplicates from Sorted Array
  war_remove_duplicates_sorted_23: {
    functionName: 'removeDuplicates',
    pythonFunctionName: 'remove_duplicates',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [1, 1, 2], expected: [1, 2] },
        { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4], expected: [0, 1, 2, 3, 4] },
        { nums: [1], expected: [1] },
        { nums: [5, 5, 5, 5], expected: [5] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = removeDuplicates(cases[i].nums.slice());
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
fn = globals().get('remove_duplicates') or globals().get('removeDuplicates')
assert fn is not None, "Function remove_duplicates not found"
cases = [
    ([1, 1, 2], [1, 2]),
    ([0, 0, 1, 1, 1, 2, 2, 3, 3, 4], [0, 1, 2, 3, 4]),
    ([1], [1]),
    ([5, 5, 5, 5], [5])
]
for idx, (nums, expected) in enumerate(cases):
    ans = list(fn(list(nums)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 64. Valid Perfect Square
  war_valid_perfect_square_24: {
    functionName: 'isPerfectSquare',
    pythonFunctionName: 'is_perfect_square',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { num: 16, expected: true },
        { num: 14, expected: false },
        { num: 1, expected: true },
        { num: 100000000, expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isPerfectSquare(cases[i].num);
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
fn = globals().get('is_perfect_square') or globals().get('isPerfectSquare')
assert fn is not None, "Function is_perfect_square not found"
cases = [
    (16, True),
    (14, False),
    (1, True),
    (100000000, True)
]
for idx, (num, expected) in enumerate(cases):
    ans = bool(fn(num))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 65. Excel Column Number
  war_excel_column_number_25: {
    functionName: 'titleToNumber',
    pythonFunctionName: 'title_to_number',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { title: "A", expected: 1 },
        { title: "AB", expected: 28 },
        { title: "ZY", expected: 701 },
        { title: "FXSHRXW", expected: 2147483647 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = titleToNumber(cases[i].title);
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
fn = globals().get('title_to_number') or globals().get('titleToNumber')
assert fn is not None, "Function title_to_number not found"
cases = [
    ("A", 1),
    ("AB", 28),
    ("ZY", 701),
    ("FXSHRXW", 2147483647)
]
for idx, (title, expected) in enumerate(cases):
    ans = fn(title)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 66. Maximum Average Subarray I
  war_max_average_subarray_26: {
    functionName: 'findMaxAverage',
    pythonFunctionName: 'find_max_average',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [1, 12, -5, -6, 50, 3], k: 4, expected: 12.75 },
        { nums: [5], k: 1, expected: 5.0 },
        { nums: [0, 4, 0, 3, 2], k: 1, expected: 4.0 },
        { nums: [-1], k: 1, expected: -1.0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findMaxAverage(cases[i].nums.slice(), cases[i].k);
          if (Math.abs(res - cases[i].expected) < 1e-4) {
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
fn = globals().get('find_max_average') or globals().get('findMaxAverage')
assert fn is not None, "Function find_max_average not found"
cases = [
    ([1, 12, -5, -6, 50, 3], 4, 12.75),
    ([5], 1, 5.0),
    ([0, 4, 0, 3, 2], 1, 4.0),
    ([-1], 1, -1.0)
]
for idx, (nums, k, expected) in enumerate(cases):
    ans = float(fn(list(nums), k))
    assert abs(ans - expected) < 1e-4, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 67. Can Place Flowers
  war_can_place_flowers_27: {
    functionName: 'canPlaceFlowers',
    pythonFunctionName: 'can_place_flowers',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { flowerbed: [1, 0, 0, 0, 1], n: 1, expected: true },
        { flowerbed: [1, 0, 0, 0, 1], n: 2, expected: false },
        { flowerbed: [0, 0, 1, 0, 1], n: 1, expected: true },
        { flowerbed: [0], n: 1, expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = canPlaceFlowers(cases[i].flowerbed.slice(), cases[i].n);
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
fn = globals().get('can_place_flowers') or globals().get('canPlaceFlowers')
assert fn is not None, "Function can_place_flowers not found"
cases = [
    ([1, 0, 0, 0, 1], 1, True),
    ([1, 0, 0, 0, 1], 2, False),
    ([0, 0, 1, 0, 1], 1, True),
    ([0], 1, True)
]
for idx, (flowerbed, n, expected) in enumerate(cases):
    ans = bool(fn(list(flowerbed), n))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 68. Isomorphic Strings
  war_isomorphic_strings_28: {
    functionName: 'isIsomorphic',
    pythonFunctionName: 'is_isomorphic',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: "egg", t: "add", expected: true },
        { s: "foo", t: "bar", expected: false },
        { s: "paper", t: "title", expected: true },
        { s: "badc", t: "baba", expected: false }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isIsomorphic(cases[i].s, cases[i].t);
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
fn = globals().get('is_isomorphic') or globals().get('isIsomorphic')
assert fn is not None, "Function is_isomorphic not found"
cases = [
    ("egg", "add", True),
    ("foo", "bar", False),
    ("paper", "title", True),
    ("badc", "baba", False)
]
for idx, (s, t, expected) in enumerate(cases):
    ans = bool(fn(s, t))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 69. Find Pivot Index
  war_find_pivot_index_29: {
    functionName: 'pivotIndex',
    pythonFunctionName: 'pivot_index',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [1, 7, 3, 6, 5, 6], expected: 3 },
        { nums: [1, 2, 3], expected: -1 },
        { nums: [2, 1, -1], expected: 0 },
        { nums: [-1, -1, 0, 1, 1, 0], expected: 5 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = pivotIndex(cases[i].nums.slice());
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
fn = globals().get('pivot_index') or globals().get('pivotIndex')
assert fn is not None, "Function pivot_index not found"
cases = [
    ([1, 7, 3, 6, 5, 6], 3),
    ([1, 2, 3], -1),
    ([2, 1, -1], 0),
    ([-1, -1, 0, 1, 1, 0], 5)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 70. Symmetric Tree
  war_symmetric_tree_30: {
    functionName: 'isSymmetric',
    pythonFunctionName: 'is_symmetric',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { root: [1, 2, 2, 3, 4, 4, 3], expected: true },
        { root: [1, 2, 2, null, 3, null, 3], expected: false },
        { root: [1], expected: true },
        { root: [], expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isSymmetric(cases[i].root.slice());
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
fn = globals().get('is_symmetric') or globals().get('isSymmetric')
assert fn is not None, "Function is_symmetric not found"
cases = [
    ([1, 2, 2, 3, 4, 4, 3], True),
    ([1, 2, 2, None, 3, None, 3], False),
    ([1], True),
    ([], True)
]
for idx, (root, expected) in enumerate(cases):
    ans = bool(fn(list(root)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 71. Insert Interval
  war_insert_interval_24: {
    functionName: 'insertInterval',
    pythonFunctionName: 'insert_interval',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { intervals: [[1, 3], [6, 9]], newInterval: [2, 5], expected: [[1, 5], [6, 9]] },
        { intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval: [4, 8], expected: [[1, 2], [3, 10], [12, 16]] },
        { intervals: [], newInterval: [5, 7], expected: [[5, 7]] },
        { intervals: [[1, 5]], newInterval: [2, 3], expected: [[1, 5]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = insertInterval(cases[i].intervals.map(function(r){ return r.slice(); }), cases[i].newInterval.slice());
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
fn = globals().get('insert_interval') or globals().get('insertInterval')
assert fn is not None, "Function insert_interval not found"
cases = [
    ([[1, 3], [6, 9]], [2, 5], [[1, 5], [6, 9]]),
    ([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8], [[1, 2], [3, 10], [12, 16]]),
    ([], [5, 7], [[5, 7]]),
    ([[1, 5]], [2, 3], [[1, 5]])
]
for idx, (intervals, new_int, expected) in enumerate(cases):
    ans = [list(r) for r in fn([list(r) for r in intervals], list(new_int))]
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 72. Spiral Matrix
  war_spiral_matrix_25: {
    functionName: 'spiralOrder',
    pythonFunctionName: 'spiral_order',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
        { matrix: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
        { matrix: [[1]], expected: [1] },
        { matrix: [[1, 2], [3, 4]], expected: [1, 2, 4, 3] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = spiralOrder(cases[i].matrix.map(function(r){ return r.slice(); }));
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
fn = globals().get('spiral_order') or globals().get('spiralOrder')
assert fn is not None, "Function spiral_order not found"
cases = [
    ([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [1, 2, 3, 6, 9, 8, 7, 4, 5]),
    ([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]),
    ([[1]], [1]),
    ([[1, 2], [3, 4]], [1, 2, 4, 3])
]
for idx, (matrix, expected) in enumerate(cases):
    ans = list(fn([list(r) for r in matrix]))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 73. Search in Rotated Sorted Array
  war_search_rotated_array_26: {
    functionName: 'searchRotated',
    pythonFunctionName: 'search_rotated',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [4, 5, 6, 7, 0, 1, 2], target: 0, expected: 4 },
        { nums: [4, 5, 6, 7, 0, 1, 2], target: 3, expected: -1 },
        { nums: [1], target: 0, expected: -1 },
        { nums: [1, 3], target: 3, expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = searchRotated(cases[i].nums.slice(), cases[i].target);
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
fn = globals().get('search_rotated') or globals().get('searchRotated')
assert fn is not None, "Function search_rotated not found"
cases = [
    ([4, 5, 6, 7, 0, 1, 2], 0, 4),
    ([4, 5, 6, 7, 0, 1, 2], 3, -1),
    ([1], 0, -1),
    ([1, 3], 3, 1)
]
for idx, (nums, target, expected) in enumerate(cases):
    ans = fn(list(nums), target)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 74. Coin Change II
  war_coin_change_ii_27: {
    functionName: 'change',
    pythonFunctionName: 'change',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { amount: 5, coins: [1, 2, 5], expected: 4 },
        { amount: 3, coins: [2], expected: 0 },
        { amount: 10, coins: [10], expected: 1 },
        { amount: 0, coins: [7], expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = change(cases[i].amount, cases[i].coins.slice());
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
fn = globals().get('change')
assert fn is not None, "Function change not found"
cases = [
    (5, [1, 2, 5], 4),
    (3, [2], 0),
    (10, [10], 1),
    (0, [7], 1)
]
for idx, (amount, coins, expected) in enumerate(cases):
    ans = fn(amount, list(coins))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 75. Validate IP Address
  war_validate_ip_address_28: {
    functionName: 'validIPAddress',
    pythonFunctionName: 'valid_ip_address',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { queryIP: "172.16.254.1", expected: "IPv4" },
        { queryIP: "2001:0db8:85a3:0:0:8A2E:0370:7334", expected: "IPv6" },
        { queryIP: "256.256.256.256", expected: "Neither" },
        { queryIP: "192.168.01.1", expected: "Neither" }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = validIPAddress(cases[i].queryIP);
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
fn = globals().get('valid_ip_address') or globals().get('validIPAddress')
assert fn is not None, "Function valid_ip_address not found"
cases = [
    ("172.16.254.1", "IPv4"),
    ("2001:0db8:85a3:0:0:8A2E:0370:7334", "IPv6"),
    ("256.256.256.256", "Neither"),
    ("192.168.01.1", "Neither")
]
for idx, (ip, expected) in enumerate(cases):
    ans = fn(ip)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 76. Binary Tree Level Order Traversal
  war_level_order_traversal_29: {
    functionName: 'levelOrder',
    pythonFunctionName: 'level_order',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { root: [3, 9, 20, null, null, 15, 7], expected: [[3], [9, 20], [15, 7]] },
        { root: [1], expected: [[1]] },
        { root: [], expected: [] },
        { root: [1, 2, 3, 4, 5], expected: [[1], [2, 3], [4, 5]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = levelOrder(cases[i].root.slice());
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
fn = globals().get('level_order') or globals().get('levelOrder')
assert fn is not None, "Function level_order not found"
cases = [
    ([3, 9, 20, None, None, 15, 7], [[3], [9, 20], [15, 7]]),
    ([1], [[1]]),
    ([], []),
    ([1, 2, 3, 4, 5], [[1], [2, 3], [4, 5]])
]
for idx, (root, expected) in enumerate(cases):
    ans = [list(r) for r in fn(list(root))]
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 77. Simplify Path
  war_simplify_path_30: {
    functionName: 'simplifyPath',
    pythonFunctionName: 'simplify_path',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { path: "/home/", expected: "/home" },
        { path: "/../", expected: "/" },
        { path: "/home//foo/", expected: "/home/foo" },
        { path: "/a/./b/../../c/", expected: "/c" }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = simplifyPath(cases[i].path);
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
fn = globals().get('simplify_path') or globals().get('simplifyPath')
assert fn is not None, "Function simplify_path not found"
cases = [
    ("/home/", "/home"),
    ("/../", "/"),
    ("/home//foo/", "/home/foo"),
    ("/a/./b/../../c/", "/c")
]
for idx, (path, expected) in enumerate(cases):
    ans = fn(path)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 78. Partition Labels
  war_partition_labels_31: {
    functionName: 'partitionLabels',
    pythonFunctionName: 'partition_labels',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: "ababcbacadefegdehijhklij", expected: [9, 7, 8] },
        { s: "eccbbbbdec", expected: [10] },
        { s: "a", expected: [1] },
        { s: "abcdef", expected: [1, 1, 1, 1, 1, 1] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = partitionLabels(cases[i].s);
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
fn = globals().get('partition_labels') or globals().get('partitionLabels')
assert fn is not None, "Function partition_labels not found"
cases = [
    ("ababcbacadefegdehijhklij", [9, 7, 8]),
    ("eccbbbbdec", [10]),
    ("a", [1]),
    ("abcdef", [1, 1, 1, 1, 1, 1])
]
for idx, (s, expected) in enumerate(cases):
    ans = list(fn(s))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 79. Continuous Subarray Sum
  war_continuous_subarray_sum_32: {
    functionName: 'checkSubarraySum',
    pythonFunctionName: 'check_subarray_sum',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [23, 2, 4, 6, 7], k: 6, expected: true },
        { nums: [23, 2, 6, 4, 7], k: 6, expected: true },
        { nums: [23, 2, 6, 4, 7], k: 13, expected: false },
        { nums: [5, 0, 0, 0], k: 3, expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = checkSubarraySum(cases[i].nums.slice(), cases[i].k);
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
fn = globals().get('check_subarray_sum') or globals().get('checkSubarraySum')
assert fn is not None, "Function check_subarray_sum not found"
cases = [
    ([23, 2, 4, 6, 7], 6, True),
    ([23, 2, 6, 4, 7], 6, True),
    ([23, 2, 6, 4, 7], 13, False),
    ([5, 0, 0, 0], 3, True)
]
for idx, (nums, k, expected) in enumerate(cases):
    ans = bool(fn(list(nums), k))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 80. Binary Tree Right Side View
  war_binary_tree_right_side_33: {
    functionName: 'rightSideView',
    pythonFunctionName: 'right_side_view',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { root: [1, 2, 3, null, 5, null, 4], expected: [1, 3, 4] },
        { root: [1, null, 3], expected: [1, 3] },
        { root: [], expected: [] },
        { root: [1, 2, 3, 4], expected: [1, 3, 4] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = rightSideView(cases[i].root.slice());
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
fn = globals().get('right_side_view') or globals().get('rightSideView')
assert fn is not None, "Function right_side_view not found"
cases = [
    ([1, 2, 3, None, 5, None, 4], [1, 3, 4]),
    ([1, None, 3], [1, 3]),
    ([], []),
    ([1, 2, 3, 4], [1, 3, 4])
]
for idx, (root, expected) in enumerate(cases):
    ans = list(fn(list(root)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 81. Merge K Sorted Lists
  war_merge_k_sorted_lists_21: {
    functionName: 'mergeKLists',
    pythonFunctionName: 'merge_k_lists',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { lists: [[1, 4, 5], [1, 3, 4], [2, 6]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
        { lists: [], expected: [] },
        { lists: [[]], expected: [] },
        { lists: [[1], [0]], expected: [0, 1] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = mergeKLists(cases[i].lists.map(function(r){ return r.slice(); }));
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
fn = globals().get('merge_k_lists') or globals().get('mergeKLists')
assert fn is not None, "Function merge_k_lists not found"
cases = [
    ([[1, 4, 5], [1, 3, 4], [2, 6]], [1, 1, 2, 3, 4, 4, 5, 6]),
    ([], []),
    ([[]], []),
    ([[1], [0]], [0, 1])
]
for idx, (lists, expected) in enumerate(cases):
    ans = list(fn([list(r) for r in lists]))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 82. Alien Dictionary
  war_alien_dictionary_22: {
    functionName: 'alienOrder',
    pythonFunctionName: 'alien_order',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { words: ["wrt", "wrf", "er", "ett", "rftt"], expected: "wertf" },
        { words: ["z", "x"], expected: "zx" },
        { words: ["z", "x", "z"], expected: "" },
        { words: ["abc", "ab"], expected: "" }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = alienOrder(cases[i].words.slice());
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
fn = globals().get('alien_order') or globals().get('alienOrder')
assert fn is not None, "Function alien_order not found"
cases = [
    (["wrt", "wrf", "er", "ett", "rftt"], "wertf"),
    (["z", "x"], "zx"),
    (["z", "x", "z"], ""),
    (["abc", "ab"], "")
]
for idx, (words, expected) in enumerate(cases):
    ans = fn(list(words))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 83. Longest Valid Parentheses
  war_longest_valid_parentheses_23: {
    functionName: 'longestValidParentheses',
    pythonFunctionName: 'longest_valid_parentheses',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: "(()", expected: 2 },
        { s: ")()())", expected: 4 },
        { s: "", expected: 0 },
        { s: "()(()", expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = longestValidParentheses(cases[i].s);
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
fn = globals().get('longest_valid_parentheses') or globals().get('longestValidParentheses')
assert fn is not None, "Function longest_valid_parentheses not found"
cases = [
    ("(()", 2),
    (")()())", 4),
    ("", 0),
    ("()(()", 2)
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 84. Serialize and Deserialize Binary Tree
  war_serialize_deserialize_tree_24: {
    functionName: 'roundTripTree',
    pythonFunctionName: 'round_trip_tree',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { root: [1, 2, 3, null, null, 4, 5], expected: [1, 2, 3, null, null, 4, 5] },
        { root: [], expected: [] },
        { root: [1], expected: [1] },
        { root: [1, 2], expected: [1, 2] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = roundTripTree(cases[i].root.slice());
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
fn = globals().get('round_trip_tree') or globals().get('roundTripTree')
assert fn is not None, "Function round_trip_tree not found"
cases = [
    ([1, 2, 3, None, None, 4, 5], [1, 2, 3, None, None, 4, 5]),
    ([], []),
    ([1], [1]),
    ([1, 2], [1, 2])
]
for idx, (root, expected) in enumerate(cases):
    ans = list(fn(list(root)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 85. Largest Rectangle in Histogram
  war_largest_rectangle_histogram_25: {
    functionName: 'largestRectangleArea',
    pythonFunctionName: 'largest_rectangle_area',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { heights: [2, 1, 5, 6, 2, 3], expected: 10 },
        { heights: [2, 4], expected: 4 },
        { heights: [1], expected: 1 },
        { heights: [2, 1, 2], expected: 3 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = largestRectangleArea(cases[i].heights.slice());
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
fn = globals().get('largest_rectangle_area') or globals().get('largestRectangleArea')
assert fn is not None, "Function largest_rectangle_area not found"
cases = [
    ([2, 1, 5, 6, 2, 3], 10),
    ([2, 4], 4),
    ([1], 1),
    ([2, 1, 2], 3)
]
for idx, (heights, expected) in enumerate(cases):
    ans = fn(list(heights))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 86. Minimum Window Substring
  war_min_window_substring_26: {
    functionName: 'minWindow',
    pythonFunctionName: 'min_window',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: "ADOBECODEBANC", t: "ABC", expected: "BANC" },
        { s: "a", t: "a", expected: "a" },
        { s: "a", t: "aa", expected: "" },
        { s: "ab", t: "b", expected: "b" }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = minWindow(cases[i].s, cases[i].t);
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
fn = globals().get('min_window') or globals().get('minWindow')
assert fn is not None, "Function min_window not found"
cases = [
    ("ADOBECODEBANC", "ABC", "BANC"),
    ("a", "a", "a"),
    ("a", "aa", ""),
    ("ab", "b", "b")
]
for idx, (s, t, expected) in enumerate(cases):
    ans = fn(s, t)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 87. Palindrome Partitioning II
  war_palindrome_partitioning_ii_27: {
    functionName: 'minCut',
    pythonFunctionName: 'min_cut',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: "aab", expected: 1 },
        { s: "a", expected: 0 },
        { s: "ab", expected: 1 },
        { s: "ababbbabbababa", expected: 3 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = minCut(cases[i].s);
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
fn = globals().get('min_cut') or globals().get('minCut')
assert fn is not None, "Function min_cut not found"
cases = [
    ("aab", 1),
    ("a", 0),
    ("ab", 1),
    ("ababbbabbababa", 3)
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 88. Consistent Hashing Ring
  war_consistent_hashing_ring_28: {
    functionName: 'routeRequest',
    pythonFunctionName: 'route_request',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nodes: [10, 50, 100], key: 20, expected: 50 },
        { nodes: [10, 50, 100], key: 100, expected: 100 },
        { nodes: [10, 50, 100], key: 120, expected: 10 },
        { nodes: [25, 75], key: 5, expected: 25 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = routeRequest(cases[i].nodes.slice(), cases[i].key);
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
fn = globals().get('route_request') or globals().get('routeRequest')
assert fn is not None, "Function route_request not found"
cases = [
    ([10, 50, 100], 20, 50),
    ([10, 50, 100], 100, 100),
    ([10, 50, 100], 120, 10),
    ([25, 75], 5, 25)
]
for idx, (nodes, key, expected) in enumerate(cases):
    ans = fn(list(nodes), key)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 89. Basic Calculator
  war_basic_calculator_29: {
    functionName: 'calculate',
    pythonFunctionName: 'calculate',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: "1 + 1", expected: 2 },
        { s: " 2-1 + 2 ", expected: 3 },
        { s: "(1+(4+5+2)-3)+(6+8)", expected: 23 },
        { s: "- (3 + (4 + 5))", expected: -12 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = calculate(cases[i].s);
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
fn = globals().get('calculate')
assert fn is not None, "Function calculate not found"
cases = [
    ("1 + 1", 2),
    (" 2-1 + 2 ", 3),
    ("(1+(4+5+2)-3)+(6+8)", 23),
    ("- (3 + (4 + 5))", -12)
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // 90. Maximal Square
  war_maximal_square_30: {
    functionName: 'maximalSquare',
    pythonFunctionName: 'maximal_square',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { matrix: [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]], expected: 4 },
        { matrix: [["0","1"],["1","0"]], expected: 1 },
        { matrix: [["0"]], expected: 0 },
        { matrix: [["1","1"],["1","1"]], expected: 4 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = maximalSquare(cases[i].matrix.map(function(r){ return r.slice(); }));
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
fn = globals().get('maximal_square') or globals().get('maximalSquare')
assert fn is not None, "Function maximal_square not found"
cases = [
    ([["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]], 4),
    ([["0","1"],["1","0"]], 1),
    ([["0"]], 0),
    ([["1","1"],["1","1"]], 4)
]
for idx, (matrix, expected) in enumerate(cases):
    ans = fn([list(r) for r in matrix])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // --- EXPANSION TO 120 QUESTIONS (30 NEW ENTERPRISE & UNIVERSAL QUESTIONS) ---
  // [BASIC] Number of 1 Bits (Hamming Telemetry Weight)
  war_hamming_weight_31: {
    functionName: 'hammingWeight',
    pythonFunctionName: 'hamming_weight',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { n: 11, expected: 3 },
        { n: 128, expected: 1 },
        { n: 2147483645, expected: 30 },
        { n: 0, expected: 0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = hammingWeight(cases[i].n);
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
fn = globals().get('hamming_weight') or globals().get('hammingWeight')
assert fn is not None, "Function hamming_weight not found"
cases = [
    (11, 3),
    (128, 1),
    (2147483645, 30),
    (0, 0)
]
for idx, (n, expected) in enumerate(cases):
    ans = fn(n)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Implement strStr (Linear Search Needle in Haystack)
  war_strstr_needle_32: {
    functionName: 'strStr',
    pythonFunctionName: 'str_str',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { h: "sadbutsad", n: "sad", expected: 0 },
        { h: "leetcode", n: "leeto", expected: -1 },
        { h: "hello", n: "ll", expected: 2 },
        { h: "pipeline", n: "", expected: 0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = strStr(cases[i].h, cases[i].n);
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
fn = globals().get('str_str') or globals().get('strStr')
assert fn is not None, "Function str_str not found"
cases = [
    ("sadbutsad", "sad", 0),
    ("leetcode", "leeto", -1),
    ("hello", "ll", 2),
    ("pipeline", "", 0)
]
for idx, (h, n, expected) in enumerate(cases):
    ans = fn(h, n)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Backspace String Compare (Editor Keystroke Buffer)
  war_backspace_string_compare_33: {
    functionName: 'backspaceCompare',
    pythonFunctionName: 'backspace_compare',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { s: "ab#c", t: "ad#c", expected: true },
        { s: "ab##", t: "c#d#", expected: true },
        { s: "a#c", t: "b", expected: false },
        { s: "bxj##tw", t: "bxj###tw", expected: false }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = backspaceCompare(cases[i].s, cases[i].t);
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
fn = globals().get('backspace_compare') or globals().get('backspaceCompare')
assert fn is not None, "Function backspace_compare not found"
cases = [
    ("ab#c", "ad#c", True),
    ("ab##", "c#d#", True),
    ("a#c", "b", False),
    ("bxj##tw", "bxj###tw", False)
]
for idx, (s, t, expected) in enumerate(cases):
    ans = fn(s, t)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Squares of a Sorted Array (Two-Pointer Convergence)
  war_squares_sorted_array_34: {
    functionName: 'sortedSquares',
    pythonFunctionName: 'sorted_squares',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [-4,-1,0,3,10], expected: [0,1,9,16,100] },
        { nums: [-7,-3,2,3,11], expected: [4,9,9,49,121] },
        { nums: [0,2,3], expected: [0,4,9] },
        { nums: [-5,-4,-1], expected: [1,16,25] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = sortedSquares(cases[i].nums.slice());
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
fn = globals().get('sorted_squares') or globals().get('sortedSquares')
assert fn is not None, "Function sorted_squares not found"
cases = [
    ([-4,-1,0,3,10], [0,1,9,16,100]),
    ([-7,-3,2,3,11], [4,9,9,49,121]),
    ([0,2,3], [0,4,9]),
    ([-5,-4,-1], [1,16,25])
]
for idx, (nums, expected) in enumerate(cases):
    ans = list(fn(list(nums)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Ransom Note (Character Inventory Validator)
  war_ransom_note_35: {
    functionName: 'canConstruct',
    pythonFunctionName: 'can_construct',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { r: "a", m: "b", expected: false },
        { r: "aa", m: "ab", expected: false },
        { r: "aa", m: "aab", expected: true },
        { r: "secure", m: "rescueme", expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = canConstruct(cases[i].r, cases[i].m);
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
fn = globals().get('can_construct') or globals().get('canConstruct')
assert fn is not None, "Function can_construct not found"
cases = [
    ("a", "b", False),
    ("aa", "ab", False),
    ("aa", "aab", True),
    ("secure", "rescueme", True)
]
for idx, (r, m, expected) in enumerate(cases):
    ans = fn(r, m)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Maximum Units on a Truck (Greedy Cargo Optimization)
  war_maximum_units_truck_36: {
    functionName: 'maximumUnits',
    pythonFunctionName: 'maximum_units',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { b: [[1,3],[2,2],[3,1]], t: 4, expected: 8 },
        { b: [[5,10],[2,5],[4,7],[3,9]], t: 10, expected: 91 },
        { b: [[3,1]], t: 5, expected: 3 },
        { b: [[2,10],[3,20]], t: 0, expected: 0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var bCopy = cases[i].b.map(function(item){ return item.slice(); });
          var res = maximumUnits(bCopy, cases[i].t);
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
fn = globals().get('maximum_units') or globals().get('maximumUnits')
assert fn is not None, "Function maximum_units not found"
cases = [
    ([[1,3],[2,2],[3,1]], 4, 8),
    ([[5,10],[2,5],[4,7],[3,9]], 10, 91),
    ([[3,1]], 5, 3),
    ([[2,10],[3,20]], 0, 0)
]
for idx, (b, t, expected) in enumerate(cases):
    ans = fn([list(x) for x in b], t)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Monotonic Array (Telemetry Drift Consistency)
  war_monotonic_array_37: {
    functionName: 'isMonotonic',
    pythonFunctionName: 'is_monotonic',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [1,2,2,3], expected: true },
        { nums: [6,5,4,4], expected: true },
        { nums: [1,3,2], expected: false },
        { nums: [1,1,1], expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isMonotonic(cases[i].nums.slice());
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
fn = globals().get('is_monotonic') or globals().get('isMonotonic')
assert fn is not None, "Function is_monotonic not found"
cases = [
    ([1,2,2,3], True),
    ([6,5,4,4], True),
    ([1,3,2], False),
    ([1,1,1], True)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Replace Elements with Greatest on Right (Suffix Max Scan)
  war_replace_elements_greatest_right_38: {
    functionName: 'replaceElements',
    pythonFunctionName: 'replace_elements',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { arr: [17,18,5,4,6,1], expected: [18,6,6,6,1,-1] },
        { arr: [400], expected: [-1] },
        { arr: [2,3,1], expected: [3,1,-1] },
        { arr: [5,4,3,2,1], expected: [4,3,2,1,-1] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = replaceElements(cases[i].arr.slice());
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
fn = globals().get('replace_elements') or globals().get('replaceElements')
assert fn is not None, "Function replace_elements not found"
cases = [
    ([17,18,5,4,6,1], [18,6,6,6,1,-1]),
    ([400], [-1]),
    ([2,3,1], [3,1,-1]),
    ([5,4,3,2,1], [4,3,2,1,-1])
]
for idx, (arr, expected) in enumerate(cases):
    ans = list(fn(list(arr)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Kth Missing Positive Number (Ordered Stream Discontinuity)
  war_kth_missing_positive_39: {
    functionName: 'findKthPositive',
    pythonFunctionName: 'find_kth_positive',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { arr: [2,3,4,7,11], k: 5, expected: 9 },
        { arr: [1,2,3,4], k: 2, expected: 6 },
        { arr: [5,6,7,8], k: 1, expected: 1 },
        { arr: [1], k: 1, expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findKthPositive(cases[i].arr.slice(), cases[i].k);
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
fn = globals().get('find_kth_positive') or globals().get('findKthPositive')
assert fn is not None, "Function find_kth_positive not found"
cases = [
    ([2,3,4,7,11], 5, 9),
    ([1,2,3,4], 2, 6),
    ([5,6,7,8], 1, 1),
    ([1], 1, 2)
]
for idx, (arr, k, expected) in enumerate(cases):
    ans = fn(list(arr), k)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Peak Index in a Mountain Array (Unimodal Binary Search)
  war_peak_index_mountain_40: {
    functionName: 'peakIndexInMountainArray',
    pythonFunctionName: 'peak_index_in_mountain_array',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { arr: [0,1,0], expected: 1 },
        { arr: [0,2,1,0], expected: 1 },
        { arr: [0,10,5,2], expected: 1 },
        { arr: [3,4,5,1], expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = peakIndexInMountainArray(cases[i].arr.slice());
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
fn = globals().get('peak_index_in_mountain_array') or globals().get('peakIndexInMountainArray')
assert fn is not None, "Function peak_index_in_mountain_array not found"
cases = [
    ([0,1,0], 1),
    ([0,2,1,0], 1),
    ([0,10,5,2], 1),
    ([3,4,5,1], 2)
]
for idx, (arr, expected) in enumerate(cases):
    ans = fn(list(arr))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Gas Station (Circular Fuel Delivery Circuit)
  war_gas_station_34: {
    functionName: 'canCompleteCircuit',
    pythonFunctionName: 'can_complete_circuit',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { gas: [1,2,3,4,5], cost: [3,4,5,1,2], expected: 3 },
        { gas: [2,3,4], cost: [3,4,3], expected: -1 },
        { gas: [5,1,2,3,4], cost: [4,4,1,5,1], expected: 4 },
        { gas: [3,1,1], cost: [1,2,2], expected: 0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = canCompleteCircuit(cases[i].gas.slice(), cases[i].cost.slice());
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
fn = globals().get('can_complete_circuit') or globals().get('canCompleteCircuit')
assert fn is not None, "Function can_complete_circuit not found"
cases = [
    ([1,2,3,4,5], [3,4,5,1,2], 3),
    ([2,3,4], [3,4,3], -1),
    ([5,1,2,3,4], [4,4,1,5,1], 4),
    ([3,1,1], [1,2,2], 0)
]
for idx, (gas, cost, expected) in enumerate(cases):
    ans = fn(list(gas), list(cost))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Koko Eating Bananas (Binary Search on Feasibility)
  war_koko_eating_bananas_35: {
    functionName: 'minEatingSpeed',
    pythonFunctionName: 'min_eating_speed',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { piles: [3,6,7,11], h: 8, expected: 4 },
        { piles: [30,11,23,4,20], h: 5, expected: 30 },
        { piles: [30,11,23,4,20], h: 6, expected: 23 },
        { piles: [1,1,1,1], h: 4, expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = minEatingSpeed(cases[i].piles.slice(), cases[i].h);
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
fn = globals().get('min_eating_speed') or globals().get('minEatingSpeed')
assert fn is not None, "Function min_eating_speed not found"
cases = [
    ([3,6,7,11], 8, 4),
    ([30,11,23,4,20], 5, 30),
    ([30,11,23,4,20], 6, 23),
    ([1,1,1,1], 4, 1)
]
for idx, (piles, h, expected) in enumerate(cases):
    ans = fn(list(piles), h)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Longest Palindromic Substring (Center Expansion)
  war_longest_palindromic_substring_36: {
    functionName: 'longestPalindrome',
    pythonFunctionName: 'longest_palindrome',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { s: "babad", valid: ["bab", "aba"] },
        { s: "cbbd", valid: ["bb"] },
        { s: "a", valid: ["a"] },
        { s: "racecar", valid: ["racecar"] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = longestPalindrome(cases[i].s);
          if (cases[i].valid.indexOf(res) !== -1) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected one of ' + JSON.stringify(cases[i].valid) + ', got ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('longest_palindrome') or globals().get('longestPalindrome')
assert fn is not None, "Function longest_palindrome not found"
cases = [
    ("babad", ["bab", "aba"]),
    ("cbbd", ["bb"]),
    ("a", ["a"]),
    ("racecar", ["racecar"])
]
for idx, (s, valid) in enumerate(cases):
    ans = fn(s)
    assert ans in valid, f"Test case {idx+1} failed: expected one of {valid}, got {ans}"
`,
  },

  // [INTERMEDIATE] House Robber II (Circular Ring Network Security)
  war_house_robber_ii_37: {
    functionName: 'rob',
    pythonFunctionName: 'rob',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [2,3,2], expected: 3 },
        { nums: [1,2,3,1], expected: 4 },
        { nums: [1,2,3], expected: 3 },
        { nums: [10], expected: 10 }
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
    ([2,3,2], 3),
    ([1,2,3,1], 4),
    ([1,2,3], 3),
    ([10], 10)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Next Greater Element II (Circular Monotonic Buffer)
  war_next_greater_element_ii_38: {
    functionName: 'nextGreaterElements',
    pythonFunctionName: 'next_greater_elements',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [1,2,1], expected: [2,-1,2] },
        { nums: [1,2,3,4,3], expected: [2,3,4,-1,4] },
        { nums: [5,4,3,2,1], expected: [-1,5,5,5,5] },
        { nums: [1], expected: [-1] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = nextGreaterElements(cases[i].nums.slice());
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
fn = globals().get('next_greater_elements') or globals().get('nextGreaterElements')
assert fn is not None, "Function next_greater_elements not found"
cases = [
    ([1,2,1], [2,-1,2]),
    ([1,2,3,4,3], [2,3,4,-1,4]),
    ([5,4,3,2,1], [-1,5,5,5,5]),
    ([1], [-1])
]
for idx, (nums, expected) in enumerate(cases):
    ans = list(fn(list(nums)))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Rotting Oranges (Multi-Source BFS Infection Propagation)
  war_rotting_oranges_39: {
    functionName: 'orangesRotting',
    pythonFunctionName: 'oranges_rotting',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { grid: [[2,1,1],[1,1,0],[0,1,1]], expected: 4 },
        { grid: [[2,1,1],[0,1,1],[1,0,1]], expected: -1 },
        { grid: [[0,2]], expected: 0 },
        { grid: [[1]], expected: -1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var gridCopy = cases[i].grid.map(function(r){ return r.slice(); });
          var res = orangesRotting(gridCopy);
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
fn = globals().get('oranges_rotting') or globals().get('orangesRotting')
assert fn is not None, "Function oranges_rotting not found"
cases = [
    ([[2,1,1],[1,1,0],[0,1,1]], 4),
    ([[2,1,1],[0,1,1],[1,0,1]], -1),
    ([[0,2]], 0),
    ([[1]], -1)
]
for idx, (grid, expected) in enumerate(cases):
    ans = fn([list(r) for r in grid])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Find All Anagrams in a String (Sliding Window Fingerprint)
  war_find_all_anagrams_40: {
    functionName: 'findAnagrams',
    pythonFunctionName: 'find_anagrams',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { s: "cbaebabacd", p: "abc", expected: [0, 6] },
        { s: "abab", p: "ab", expected: [0, 1, 2] },
        { s: "hello", p: "world", expected: [] },
        { s: "aa", p: "a", expected: [0, 1] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findAnagrams(cases[i].s, cases[i].p);
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
fn = globals().get('find_anagrams') or globals().get('findAnagrams')
assert fn is not None, "Function find_anagrams not found"
cases = [
    ("cbaebabacd", "abc", [0, 6]),
    ("abab", "ab", [0, 1, 2]),
    ("hello", "world", []),
    ("aa", "a", [0, 1])
]
for idx, (s, p, expected) in enumerate(cases):
    ans = list(fn(s, p))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Word Search (Grid DFS Backtracking Matrix)
  war_word_search_41: {
    functionName: 'exist',
    pythonFunctionName: 'exist',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "ABCCED", expected: true },
        { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "SEE", expected: true },
        { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "ABCB", expected: false },
        { board: [["A"]], word: "A", expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var bCopy = cases[i].board.map(function(r){ return r.slice(); });
          var res = exist(bCopy, cases[i].word);
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
fn = globals().get('exist')
assert fn is not None, "Function exist not found"
cases = [
    ([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED", True),
    ([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE", True),
    ([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB", False),
    ([["A"]], "A", True)
]
for idx, (board, word, expected) in enumerate(cases):
    ans = fn([list(r) for r in board], word)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Car Fleet (Monotonic Intersection Time)
  war_car_fleet_42: {
    functionName: 'carFleet',
    pythonFunctionName: 'car_fleet',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { t: 12, p: [10,8,0,5,3], s: [2,4,1,1,3], expected: 3 },
        { t: 10, p: [3], s: [3], expected: 1 },
        { t: 100, p: [0,2,4], s: [4,2,1], expected: 1 },
        { t: 10, p: [6,8], s: [3,2], expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = carFleet(cases[i].t, cases[i].p.slice(), cases[i].s.slice());
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
fn = globals().get('car_fleet') or globals().get('carFleet')
assert fn is not None, "Function car_fleet not found"
cases = [
    (12, [10,8,0,5,3], [2,4,1,1,3], 3),
    (10, [3], [3], 1),
    (100, [0,2,4], [4,2,1], 1),
    (10, [6,8], [3,2], 2)
]
for idx, (t, p, s, expected) in enumerate(cases):
    ans = fn(t, list(p), list(s))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Reorganize String (Max-Frequency Heap Buffer)
  war_reorganize_string_43: {
    functionName: 'reorganizeString',
    pythonFunctionName: 'reorganize_string',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { s: "aab", possible: true },
        { s: "aaab", possible: false },
        { s: "vvvlo", possible: true },
        { s: "baaba", possible: true }
      ];
      var passedCount = 0;
      var isValid = function(orig, res) {
        if (res.length !== orig.length) return false;
        var c1 = {}, c2 = {};
        for (var i = 0; i < orig.length; i++) c1[orig[i]] = (c1[orig[i]] || 0) + 1;
        for (var i = 0; i < res.length; i++) c2[res[i]] = (c2[res[i]] || 0) + 1;
        for (var k in c1) if (c1[k] !== c2[k]) return false;
        for (var i = 0; i < res.length - 1; i++) if (res[i] === res[i+1]) return false;
        return true;
      };
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = reorganizeString(cases[i].s);
          if (!cases[i].possible) {
            if (res === "") passedCount++;
            else return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected "", got ' + res };
          } else {
            if (isValid(cases[i].s, res)) passedCount++;
            else return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: invalid rearrangement ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('reorganize_string') or globals().get('reorganizeString')
assert fn is not None, "Function reorganize_string not found"
from collections import Counter
def is_valid(orig, res):
    if len(res) != len(orig): return False
    if Counter(orig) != Counter(res): return False
    for i in range(len(res) - 1):
        if res[i] == res[i+1]: return False
    return True
cases = [
    ("aab", True),
    ("aaab", False),
    ("vvvlo", True),
    ("baaba", True)
]
for idx, (s, possible) in enumerate(cases):
    ans = fn(s)
    if not possible:
        assert ans == "", f"Test case {idx+1} failed: expected empty string, got {ans}"
    else:
        assert is_valid(s, ans), f"Test case {idx+1} failed: invalid rearrangement {ans}"
`,
  },

  // [ADVANCED] LFU Cache (O(1) Frequency Eviction Engine)
  war_lfu_cache_31: {
    functionName: 'simulateLFU',
    pythonFunctionName: 'simulate_lfu',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { cap: 2, ops: [["put","1","1"],["put","2","2"],["get","1"],["put","3","3"],["get","2"],["get","3"],["put","4","4"],["get","1"],["get","3"],["get","4"]], expected: [null,null,1,null,-1,3,null,-1,3,4] },
        { cap: 0, ops: [["put","0","0"],["get","0"]], expected: [null,-1] },
        { cap: 1, ops: [["put","2","1"],["get","2"],["put","3","2"],["get","2"],["get","3"]], expected: [null,1,null,-1,2] },
        { cap: 2, ops: [["get","2"],["put","2","6"],["get","1"],["put","1","5"],["put","1","2"],["get","1"],["get","2"]], expected: [-1,null,-1,null,null,2,6] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var opsCopy = cases[i].ops.map(function(item){ return item.slice(); });
          var res = simulateLFU(cases[i].cap, opsCopy);
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
fn = globals().get('simulate_lfu') or globals().get('simulateLFU')
assert fn is not None, "Function simulate_lfu not found"
cases = [
    (2, [["put","1","1"],["put","2","2"],["get","1"],["put","3","3"],["get","2"],["get","3"],["put","4","4"],["get","1"],["get","3"],["get","4"]], [None,None,1,None,-1,3,None,-1,3,4]),
    (0, [["put","0","0"],["get","0"]], [None,-1]),
    (1, [["put","2","1"],["get","2"],["put","3","2"],["get","2"],["get","3"]], [None,1,None,-1,2]),
    (2, [["get","2"],["put","2","6"],["get","1"],["put","1","5"],["put","1","2"],["get","1"],["get","2"]], [-1,None,-1,None,None,2,6])
]
for idx, (cap, ops, expected) in enumerate(cases):
    ans = fn(cap, [list(o) for o in ops])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Wildcard Matching (2D DP Glob Pattern Matcher)
  war_wildcard_matching_32: {
    functionName: 'isMatch',
    pythonFunctionName: 'is_match',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { s: "aa", p: "a", expected: false },
        { s: "aa", p: "*", expected: true },
        { s: "cb", p: "?a", expected: false },
        { s: "adceb", p: "*a*b", expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isMatch(cases[i].s, cases[i].p);
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
fn = globals().get('is_match') or globals().get('isMatch')
assert fn is not None, "Function is_match not found"
cases = [
    ("aa", "a", False),
    ("aa", "*", True),
    ("cb", "?a", False),
    ("adceb", "*a*b", True)
]
for idx, (s, p, expected) in enumerate(cases):
    ans = fn(s, p)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Burst Balloons (Interval Dynamic Programming)
  war_burst_balloons_33: {
    functionName: 'maxCoins',
    pythonFunctionName: 'max_coins',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [3,1,5,8], expected: 167 },
        { nums: [1,5], expected: 10 },
        { nums: [7], expected: 7 },
        { nums: [1,2,3], expected: 12 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = maxCoins(cases[i].nums.slice());
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
fn = globals().get('max_coins') or globals().get('maxCoins')
assert fn is not None, "Function max_coins not found"
cases = [
    ([3,1,5,8], 167),
    ([1,5], 10),
    ([7], 7),
    ([1,2,3], 12)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] N-Queens (Bitmask Backtracking Placement Engine)
  war_n_queens_34: {
    functionName: 'totalNQueens',
    pythonFunctionName: 'total_n_queens',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { n: 4, expected: 2 },
        { n: 1, expected: 1 },
        { n: 5, expected: 10 },
        { n: 8, expected: 92 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = totalNQueens(cases[i].n);
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
fn = globals().get('total_n_queens') or globals().get('totalNQueens')
assert fn is not None, "Function total_n_queens not found"
cases = [
    (4, 2),
    (1, 1),
    (5, 10),
    (8, 92)
]
for idx, (n, expected) in enumerate(cases):
    ans = fn(n)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Regular Expression Matching (Kleene Star AST DP)
  war_regular_expression_matching_35: {
    functionName: 'isRegexMatch',
    pythonFunctionName: 'is_regex_match',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { s: "aa", p: "a", expected: false },
        { s: "aa", p: "a*", expected: true },
        { s: "ab", p: ".*", expected: true },
        { s: "aab", p: "c*a*b", expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isRegexMatch(cases[i].s, cases[i].p);
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
fn = globals().get('is_regex_match') or globals().get('isRegexMatch')
assert fn is not None, "Function is_regex_match not found"
cases = [
    ("aa", "a", False),
    ("aa", "a*", True),
    ("ab", ".*", True),
    ("aab", "c*a*b", True)
]
for idx, (s, p, expected) in enumerate(cases):
    ans = fn(s, p)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Maximal Rectangle (2D Matrix Monotonic Histogram)
  war_maximal_rectangle_36: {
    functionName: 'maximalRectangle',
    pythonFunctionName: 'maximal_rectangle',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { m: [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]], expected: 6 },
        { m: [["0"]], expected: 0 },
        { m: [["1"]], expected: 1 },
        { m: [["0","0"],["0","0"]], expected: 0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var mCopy = cases[i].m.map(function(r){ return r.slice(); });
          var res = maximalRectangle(mCopy);
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
fn = globals().get('maximal_rectangle') or globals().get('maximalRectangle')
assert fn is not None, "Function maximal_rectangle not found"
cases = [
    ([["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]], 6),
    ([["0"]], 0),
    ([["1"]], 1),
    ([["0","0"],["0","0"]], 0)
]
for idx, (m, expected) in enumerate(cases):
    ans = fn([list(r) for r in m])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Network Delay Time (Dijkstra Shortest Path Router)
  war_network_delay_dijkstra_37: {
    functionName: 'networkDelayTime',
    pythonFunctionName: 'network_delay_time',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { t: [[2,1,1],[2,3,1],[3,4,1]], n: 4, k: 2, expected: 2 },
        { t: [[1,2,1]], n: 2, k: 1, expected: 1 },
        { t: [[1,2,1]], n: 2, k: 2, expected: -1 },
        { t: [[1,2,1],[2,3,2],[1,3,4]], n: 3, k: 1, expected: 3 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var tCopy = cases[i].t.map(function(item){ return item.slice(); });
          var res = networkDelayTime(tCopy, cases[i].n, cases[i].k);
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
fn = globals().get('network_delay_time') or globals().get('networkDelayTime')
assert fn is not None, "Function network_delay_time not found"
cases = [
    ([[2,1,1],[2,3,1],[3,4,1]], 4, 2, 2),
    ([[1,2,1]], 2, 1, 1),
    ([[1,2,1]], 2, 2, -1),
    ([[1,2,1],[2,3,2],[1,3,4]], 3, 1, 3)
]
for idx, (t, n, k, expected) in enumerate(cases):
    ans = fn([list(x) for x in t], n, k)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Shortest Palindrome (KMP Prefix Table Minimizer)
  war_shortest_palindrome_38: {
    functionName: 'shortestPalindrome',
    pythonFunctionName: 'shortest_palindrome',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { s: "aacecaaa", expected: "aaacecaaa" },
        { s: "abcd", expected: "dcbabcd" },
        { s: "", expected: "" },
        { s: "a", expected: "a" }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = shortestPalindrome(cases[i].s);
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
fn = globals().get('shortest_palindrome') or globals().get('shortestPalindrome')
assert fn is not None, "Function shortest_palindrome not found"
cases = [
    ("aacecaaa", "aaacecaaa"),
    ("abcd", "dcbabcd"),
    ("", ""),
    ("a", "a")
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Swim in Rising Water (Minimax Elevation Binary Search)
  war_swim_in_rising_water_39: {
    functionName: 'swimInWater',
    pythonFunctionName: 'swim_in_water',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { g: [[0,2],[1,3]], expected: 3 },
        { g: [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]], expected: 16 },
        { g: [[3]], expected: 3 },
        { g: [[0,1],[3,2]], expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var gCopy = cases[i].g.map(function(r){ return r.slice(); });
          var res = swimInWater(gCopy);
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
fn = globals().get('swim_in_water') or globals().get('swimInWater')
assert fn is not None, "Function swim_in_water not found"
cases = [
    ([[0,2],[1,3]], 3),
    ([[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]], 16),
    ([[3]], 3),
    ([[0,1],[3,2]], 2)
]
for idx, (g, expected) in enumerate(cases):
    ans = fn([list(r) for r in g])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Binary Tree Maximum Path Sum (Post-Order Dynamic Path)
  war_binary_tree_max_path_sum_40: {
    functionName: 'maxPathSum',
    pythonFunctionName: 'max_path_sum',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { r: [1, 2, 3], expected: 6 },
        { r: [-10, 9, 20, null, null, 15, 7], expected: 42 },
        { r: [-3], expected: -3 },
        { r: [2, -1], expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = maxPathSum(cases[i].r.slice());
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
fn = globals().get('max_path_sum') or globals().get('maxPathSum')
assert fn is not None, "Function max_path_sum not found"
cases = [
    ([1, 2, 3], 6),
    ([-10, 9, 20, None, None, 15, 7], 42),
    ([-3], -3),
    ([2, -1], 2)
]
for idx, (r, expected) in enumerate(cases):
    ans = fn(list(r))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // --- EXPANSION TO 150 QUESTIONS (30 MORE UNIVERSAL & INTERVIEW QUESTIONS) ---
  // [BASIC] Counting Bits (Hardware Popcount Array)
  war_counting_bits_41: {
    functionName: 'countBits',
    pythonFunctionName: 'count_bits',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { n: 2, expected: [0,1,1] },
        { n: 5, expected: [0,1,1,2,1,2] },
        { n: 0, expected: [0] },
        { n: 8, expected: [0,1,1,2,1,2,2,3,1] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = countBits(cases[i].n);
          if (Array.isArray(res) && res.join(',') === cases[i].expected.join(',')) {
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
fn = globals().get('count_bits') or globals().get('countBits')
assert fn is not None, "Function count_bits not found"
cases = [
    (2, [0,1,1]),
    (5, [0,1,1,2,1,2]),
    (0, [0]),
    (8, [0,1,1,2,1,2,2,3,1])
]
for idx, (n, expected) in enumerate(cases):
    ans = fn(n)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Reverse Vowels of a String (Speech Obfuscator)
  war_reverse_vowels_42: {
    functionName: 'reverseVowels',
    pythonFunctionName: 'reverse_vowels',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { s: "hello", expected: "holle" },
        { s: "leetcode", expected: "leotcede" },
        { s: "aA", expected: "Aa" },
        { s: "rhythm", expected: "rhythm" }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = reverseVowels(cases[i].s);
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
fn = globals().get('reverse_vowels') or globals().get('reverseVowels')
assert fn is not None, "Function reverse_vowels not found"
cases = [
    ("hello", "holle"),
    ("leetcode", "leotcede"),
    ("aA", "Aa"),
    ("rhythm", "rhythm")
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Summary Ranges (Database Interval Compactor)
  war_summary_ranges_43: {
    functionName: 'summaryRanges',
    pythonFunctionName: 'summary_ranges',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [0,1,2,4,5,7], expected: ["0->2","4->5","7"] },
        { nums: [0,2,3,4,6,8,9], expected: ["0","2->4","6","8->9"] },
        { nums: [], expected: [] },
        { nums: [-1], expected: ["-1"] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = summaryRanges(cases[i].nums.slice());
          if (Array.isArray(res) && res.join(',') === cases[i].expected.join(',')) {
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
    ([0,1,2,4,5,7], ["0->2","4->5","7"]),
    ([0,2,3,4,6,8,9], ["0","2->4","6","8->9"]),
    ([], []),
    ([-1], ["-1"])
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Is Subsequence (Stream Audit Sequence Checker)
  war_is_subsequence_44: {
    functionName: 'isSubsequence',
    pythonFunctionName: 'is_subsequence',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { s: "abc", t: "ahbgdc", expected: true },
        { s: "axc", t: "ahbgdc", expected: false },
        { s: "", t: "ahbgdc", expected: true },
        { s: "b", t: "c", expected: false }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isSubsequence(cases[i].s, cases[i].t);
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
fn = globals().get('is_subsequence') or globals().get('isSubsequence')
assert fn is not None, "Function is_subsequence not found"
cases = [
    ("abc", "ahbgdc", True),
    ("axc", "ahbgdc", False),
    ("", "ahbgdc", True),
    ("b", "c", False)
]
for idx, (s, t, expected) in enumerate(cases):
    ans = fn(s, t)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Find All Numbers Disappeared in an Array (In-Place Index Sign Negation)
  war_find_disappeared_numbers_45: {
    functionName: 'findDisappearedNumbers',
    pythonFunctionName: 'find_disappeared_numbers',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [4,3,2,7,8,2,3,1], expected: [5,6] },
        { nums: [1,1], expected: [2] },
        { nums: [1], expected: [] },
        { nums: [2,2], expected: [1] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findDisappearedNumbers(cases[i].nums.slice());
          if (Array.isArray(res) && res.slice().sort().join(',') === cases[i].expected.slice().sort().join(',')) {
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
    ([4,3,2,7,8,2,3,1], [5,6]),
    ([1,1], [2]),
    ([1], []),
    ([2,2], [1])
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert sorted(ans) == sorted(expected), f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Maximum Product of Three Numbers (Risk Hedging Volatility Triple)
  war_maximum_product_three_46: {
    functionName: 'maximumProduct',
    pythonFunctionName: 'maximum_product',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [1,2,3], expected: 6 },
        { nums: [1,2,3,4], expected: 24 },
        { nums: [-1,-2,-3], expected: -6 },
        { nums: [-100,-98,1,2,3,4], expected: 39200 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = maximumProduct(cases[i].nums.slice());
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
fn = globals().get('maximum_product') or globals().get('maximumProduct')
assert fn is not None, "Function maximum_product not found"
cases = [
    ([1,2,3], 6),
    ([1,2,3,4], 24),
    ([-1,-2,-3], -6),
    ([-100,-98,1,2,3,4], 39200)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Base 7 Conversion (Hardware Bus Radix Transcoder)
  war_base_7_conversion_47: {
    functionName: 'convertToBase7',
    pythonFunctionName: 'convert_to_base7',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { num: 100, expected: "202" },
        { num: -7, expected: "-10" },
        { num: 0, expected: "0" },
        { num: 49, expected: "100" }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = convertToBase7(cases[i].num);
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
fn = globals().get('convert_to_base7') or globals().get('convertToBase7')
assert fn is not None, "Function convert_to_base7 not found"
cases = [
    (100, "202"),
    (-7, "-10"),
    (0, "0"),
    (49, "100")
]
for idx, (num, expected) in enumerate(cases):
    ans = fn(num)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Keyboard Row (Input Ergonomics Sanitizer)
  war_keyboard_row_48: {
    functionName: 'findWords',
    pythonFunctionName: 'find_words',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { words: ["Hello","Alaska","Dad","Peace"], expected: ["Alaska","Dad"] },
        { words: ["omk"], expected: [] },
        { words: ["adsdf","sfd"], expected: ["adsdf","sfd"] },
        { words: ["a","b"], expected: ["a","b"] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findWords(cases[i].words.slice());
          if (Array.isArray(res) && res.join(',') === cases[i].expected.join(',')) {
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
fn = globals().get('find_words') or globals().get('findWords')
assert fn is not None, "Function find_words not found"
cases = [
    (["Hello","Alaska","Dad","Peace"], ["Alaska","Dad"]),
    (["omk"], []),
    (["adsdf","sfd"], ["adsdf","sfd"]),
    (["a","b"], ["a","b"])
]
for idx, (words, expected) in enumerate(cases):
    ans = fn(list(words))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Assign Cookies (Greedy Spot-Instance Dispatcher)
  war_assign_cookies_49: {
    functionName: 'findContentChildren',
    pythonFunctionName: 'find_content_children',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { g: [1,2,3], s: [1,1], expected: 1 },
        { g: [1,2], s: [1,2,3], expected: 2 },
        { g: [3,4], s: [1,2], expected: 0 },
        { g: [10,9,8,7], s: [5,6,7,8], expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findContentChildren(cases[i].g.slice(), cases[i].s.slice());
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
fn = globals().get('find_content_children') or globals().get('findContentChildren')
assert fn is not None, "Function find_content_children not found"
cases = [
    ([1,2,3], [1,1], 1),
    ([1,2], [1,2,3], 2),
    ([3,4], [1,2], 0),
    ([10,9,8,7], [5,6,7,8], 2)
]
for idx, (g, s, expected) in enumerate(cases):
    ans = fn(list(g), list(s))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [BASIC] Relative Sort Array (Custom Priority Dispatcher)
  war_relative_sort_array_50: {
    functionName: 'relativeSortArray',
    pythonFunctionName: 'relative_sort_array',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { a1: [2,3,1,3,2,4,6,7,9,2,19], a2: [2,1,4,3,9,6], expected: [2,2,2,1,4,3,3,9,6,7,19] },
        { a1: [28,6,22,8,44,17], a2: [22,28,8,6], expected: [22,28,8,6,17,44] },
        { a1: [1,2,3], a2: [3,2,1], expected: [3,2,1] },
        { a1: [5,4,3], a2: [], expected: [3,4,5] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = relativeSortArray(cases[i].a1.slice(), cases[i].a2.slice());
          if (Array.isArray(res) && res.join(',') === cases[i].expected.join(',')) {
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
fn = globals().get('relative_sort_array') or globals().get('relativeSortArray')
assert fn is not None, "Function relative_sort_array not found"
cases = [
    ([2,3,1,3,2,4,6,7,9,2,19], [2,1,4,3,9,6], [2,2,2,1,4,3,3,9,6,7,19]),
    ([28,6,22,8,44,17], [22,28,8,6], [22,28,8,6,17,44]),
    ([1,2,3], [3,2,1], [3,2,1]),
    ([5,4,3], [], [3,4,5])
]
for idx, (a1, a2, expected) in enumerate(cases):
    ans = fn(list(a1), list(a2))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Find Peak Element (Logarithmic Unimodal Peak Locator)
  war_find_peak_element_44: {
    functionName: 'findPeakElement',
    pythonFunctionName: 'find_peak_element',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [1,2,3,1], valid: [2] },
        { nums: [1,2,1,3,5,6,4], valid: [1, 5] },
        { nums: [1], valid: [0] },
        { nums: [2,1], valid: [0] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findPeakElement(cases[i].nums.slice());
          if (cases[i].valid.indexOf(res) !== -1) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: returned invalid peak index ' + res };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('find_peak_element') or globals().get('findPeakElement')
assert fn is not None, "Function find_peak_element not found"
cases = [
    ([1,2,3,1], [2]),
    ([1,2,1,3,5,6,4], [1, 5]),
    ([1], [0]),
    ([2,1], [0])
]
for idx, (nums, valid) in enumerate(cases):
    ans = fn(list(nums))
    assert ans in valid, f"Test case {idx+1} failed: returned invalid peak index {ans}"
`,
  },

  // [INTERMEDIATE] Combination Sum (Currency Denominational Payout Engine)
  war_combination_sum_45: {
    functionName: 'combinationSum',
    pythonFunctionName: 'combination_sum',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { c: [2,3,6,7], t: 7, expected: [[2,2,3],[7]] },
        { c: [2,3,5], t: 8, expected: [[2,2,2,2],[2,3,3],[3,5]] },
        { c: [2], t: 1, expected: [] },
        { c: [1], t: 2, expected: [[1,1]] }
      ];
      function canonicalize(arr) {
        return arr.map(function(item){ return item.slice().sort(function(a,b){return a-b;}).join(','); }).sort().join('|');
      }
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = combinationSum(cases[i].c.slice(), cases[i].t);
          if (canonicalize(res) === canonicalize(cases[i].expected)) {
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
fn = globals().get('combination_sum') or globals().get('combinationSum')
assert fn is not None, "Function combination_sum not found"
def canonicalize(arr):
    return sorted([sorted(x) for x in arr])
cases = [
    ([2,3,6,7], 7, [[2,2,3],[7]]),
    ([2,3,5], 8, [[2,2,2,2],[2,3,3],[3,5]]),
    ([2], 1, []),
    ([1], 2, [[1,1]])
]
for idx, (c, t, expected) in enumerate(cases):
    ans = fn(list(c), t)
    assert canonicalize(ans) == canonicalize(expected), f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Partition Equal Subset Sum (Cluster Dual-Node Load Balancer)
  war_partition_equal_subset_sum_46: {
    functionName: 'canPartition',
    pythonFunctionName: 'can_partition',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [1,5,11,5], expected: true },
        { nums: [1,2,3,5], expected: false },
        { nums: [2,2], expected: true },
        { nums: [1,2,5], expected: false }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = canPartition(cases[i].nums.slice());
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
fn = globals().get('can_partition') or globals().get('canPartition')
assert fn is not None, "Function can_partition not found"
cases = [
    ([1,5,11,5], True),
    ([1,2,3,5], False),
    ([2,2], True),
    ([1,2,5], False)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Sort Colors (Line-Rate 3-Tier Packet Triage)
  war_sort_colors_47: {
    functionName: 'sortColors',
    pythonFunctionName: 'sort_colors',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [2,0,2,1,1,0], expected: [0,0,1,1,2,2] },
        { nums: [2,0,1], expected: [0,1,2] },
        { nums: [0], expected: [0] },
        { nums: [1,2,0], expected: [0,1,2] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = sortColors(cases[i].nums.slice());
          if (Array.isArray(res) && res.join(',') === cases[i].expected.join(',')) {
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
fn = globals().get('sort_colors') or globals().get('sortColors')
assert fn is not None, "Function sort_colors not found"
cases = [
    ([2,0,2,1,1,0], [0,0,1,1,2,2]),
    ([2,0,1], [0,1,2]),
    ([0], [0]),
    ([1,2,0], [0,1,2])
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Target Sum (Net Financial Exposure Pathways)
  war_target_sum_48: {
    functionName: 'findTargetSumWays',
    pythonFunctionName: 'find_target_sum_ways',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [1,1,1,1,1], target: 3, expected: 5 },
        { nums: [1], target: 1, expected: 1 },
        { nums: [1], target: 2, expected: 0 },
        { nums: [1,0], target: 1, expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findTargetSumWays(cases[i].nums.slice(), cases[i].target);
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
fn = globals().get('find_target_sum_ways') or globals().get('findTargetSumWays')
assert fn is not None, "Function find_target_sum_ways not found"
cases = [
    ([1,1,1,1,1], 3, 5),
    ([1], 1, 1),
    ([1], 2, 0),
    ([1,0], 1, 2)
]
for idx, (nums, target, expected) in enumerate(cases):
    ans = fn(list(nums), target)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Non-overlapping Intervals (Satellite Downlink Transponder Scheduler)
  war_non_overlapping_intervals_49: {
    functionName: 'eraseOverlapIntervals',
    pythonFunctionName: 'erase_overlap_intervals',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { int: [[1,2],[2,3],[3,4],[1,3]], expected: 1 },
        { int: [[1,2],[1,2],[1,2]], expected: 2 },
        { int: [[1,2],[2,3]], expected: 0 },
        { int: [[1,100],[11,22],[1,11],[2,12]], expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var inputCopy = cases[i].int.map(function(item){ return item.slice(); });
          var res = eraseOverlapIntervals(inputCopy);
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
fn = globals().get('erase_overlap_intervals') or globals().get('eraseOverlapIntervals')
assert fn is not None, "Function erase_overlap_intervals not found"
cases = [
    ([[1,2],[2,3],[3,4],[1,3]], 1),
    ([[1,2],[1,2],[1,2]], 2),
    ([[1,2],[2,3]], 0),
    ([[1,100],[11,22],[1,11],[2,12]], 2)
]
for idx, (intervals, expected) in enumerate(cases):
    ans = fn([list(x) for x in intervals])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Path Sum II (Call Stack Memory Diagnostics Trace)
  war_path_sum_ii_50: {
    functionName: 'pathSum',
    pythonFunctionName: 'path_sum',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { r: [5,4,8,11,null,13,4,7,2,null,null,5,1], t: 22, expected: [[5,4,11,2],[5,8,4,5]] },
        { r: [1,2,3], t: 5, expected: [] },
        { r: [1,2], t: 0, expected: [] },
        { r: [1], t: 1, expected: [[1]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = pathSum(cases[i].r.slice(), cases[i].t);
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
fn = globals().get('path_sum') or globals().get('pathSum')
assert fn is not None, "Function path_sum not found"
cases = [
    ([5,4,8,11,None,13,4,7,2,None,None,5,1], 22, [[5,4,11,2],[5,8,4,5]]),
    ([1,2,3], 5, []),
    ([1,2], 0, []),
    ([1], 1, [[1]])
]
for idx, (r, t, expected) in enumerate(cases):
    ans = fn(list(r), t)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Cheapest Flights Within K Stops (Microservice SLA Hop Router)
  war_cheapest_flights_k_stops_51: {
    functionName: 'findCheapestPrice',
    pythonFunctionName: 'find_cheapest_price',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { n: 4, flights: [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src: 0, dst: 3, k: 1, expected: 700 },
        { n: 3, flights: [[0,1,100],[1,2,100],[0,2,500]], src: 0, dst: 2, k: 1, expected: 200 },
        { n: 3, flights: [[0,1,100],[1,2,100],[0,2,500]], src: 0, dst: 2, k: 0, expected: 500 },
        { n: 2, flights: [[0,1,100]], src: 0, dst: 1, k: 0, expected: 100 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var fCopy = cases[i].flights.map(function(item){ return item.slice(); });
          var res = findCheapestPrice(cases[i].n, fCopy, cases[i].src, cases[i].dst, cases[i].k);
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
fn = globals().get('find_cheapest_price') or globals().get('findCheapestPrice')
assert fn is not None, "Function find_cheapest_price not found"
cases = [
    (4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1, 700),
    (3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1, 200),
    (3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 0, 500),
    (2, [[0,1,100]], 0, 1, 0, 100)
]
for idx, (n, flights, src, dst, k, expected) in enumerate(cases):
    ans = fn(n, [list(x) for x in flights], src, dst, k)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Kth Smallest Element in a BST (B-Tree Rank Index Optimizer)
  war_kth_smallest_bst_52: {
    functionName: 'kthSmallest',
    pythonFunctionName: 'kth_smallest',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { r: [3,1,4,null,2], k: 1, expected: 1 },
        { r: [5,3,6,2,4,null,null,1], k: 3, expected: 3 },
        { r: [2,1,3], k: 2, expected: 2 },
        { r: [1], k: 1, expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = kthSmallest(cases[i].r.slice(), cases[i].k);
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
fn = globals().get('kth_smallest') or globals().get('kthSmallest')
assert fn is not None, "Function kth_smallest not found"
cases = [
    ([3,1,4,None,2], 1, 1),
    ([5,3,6,2,4,None,None,1], 3, 3),
    ([2,1,3], 2, 2),
    ([1], 1, 1)
]
for idx, (r, k, expected) in enumerate(cases):
    ans = fn(list(r), k)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [INTERMEDIATE] Surrounded Regions (Silicon Wafer Micro-Defect Isolation)
  war_surrounded_regions_53: {
    functionName: 'solveRegions',
    pythonFunctionName: 'solve_regions',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { b: [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]], expected: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]] },
        { b: [["X"]], expected: [["X"]] },
        { b: [["O","O"],["O","O"]], expected: [["O","O"],["O","O"]] },
        { b: [["X","O","X"],["X","O","X"],["X","O","X"]], expected: [["X","O","X"],["X","O","X"],["X","O","X"]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var bCopy = cases[i].b.map(function(r){ return r.slice(); });
          var res = solveRegions(bCopy);
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
fn = globals().get('solve_regions') or globals().get('solveRegions')
assert fn is not None, "Function solve_regions not found"
cases = [
    ([["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]], [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]),
    ([["X"]], [["X"]]),
    ([["O","O"],["O","O"]], [["O","O"],["O","O"]]),
    ([["X","O","X"],["X","O","X"],["X","O","X"]], [["X","O","X"],["X","O","X"],["X","O","X"]])
]
for idx, (b, expected) in enumerate(cases):
    ans = fn([list(r) for r in b])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Sliding Window Median (HFT Rolling Volatility Metric)
  war_sliding_window_median_41: {
    functionName: 'medianSlidingWindow',
    pythonFunctionName: 'median_sliding_window',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [1,3,-1,-3,5,3,6,7], k: 3, expected: [1,-1,-1,3,5,6] },
        { nums: [1,2,3,4,2,3,1,4,2], k: 3, expected: [2,3,3,3,2,3,2] },
        { nums: [1,4,2,3], k: 4, expected: [2.5] },
        { nums: [5], k: 1, expected: [5] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = medianSlidingWindow(cases[i].nums.slice(), cases[i].k);
          var match = Array.isArray(res) && res.length === cases[i].expected.length && res.every(function(val, idx){
            return Math.abs(val - cases[i].expected[idx]) < 1e-5;
          });
          if (match) {
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
fn = globals().get('median_sliding_window') or globals().get('medianSlidingWindow')
assert fn is not None, "Function median_sliding_window not found"
cases = [
    ([1,3,-1,-3,5,3,6,7], 3, [1,-1,-1,3,5,6]),
    ([1,2,3,4,2,3,1,4,2], 3, [2,3,3,3,2,3,2]),
    ([1,4,2,3], 4, [2.5]),
    ([5], 1, [5])
]
for idx, (nums, k, expected) in enumerate(cases):
    ans = fn(list(nums), k)
    assert len(ans) == len(expected) and all(abs(a - b) < 1e-5 for a, b in zip(ans, expected)), f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] First Missing Positive (In-Place Cyclic Virtual Page Allocator)
  war_first_missing_positive_42: {
    functionName: 'firstMissingPositive',
    pythonFunctionName: 'first_missing_positive',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { nums: [1,2,0], expected: 3 },
        { nums: [3,4,-1,1], expected: 2 },
        { nums: [7,8,9,11,12], expected: 1 },
        { nums: [1], expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = firstMissingPositive(cases[i].nums.slice());
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
fn = globals().get('first_missing_positive') or globals().get('firstMissingPositive')
assert fn is not None, "Function first_missing_positive not found"
cases = [
    ([1,2,0], 3),
    ([3,4,-1,1], 2),
    ([7,8,9,11,12], 1),
    ([1], 2)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Word Search II (Trie + 2D Backtracking Genomic Motif Engine)
  war_word_search_ii_43: {
    functionName: 'findWordsII',
    pythonFunctionName: 'find_words_ii',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { b: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], w: ["oath","pea","eat","rain"], expected: ["eat","oath"] },
        { b: [["a","b"],["c","d"]], w: ["abcb"], expected: [] },
        { b: [["a"]], w: ["a"], expected: ["a"] },
        { b: [["a","b"],["c","d"]], w: ["ab","ac","bd","ca"], expected: ["ab","ac","bd","ca"] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var bCopy = cases[i].b.map(function(r){ return r.slice(); });
          var res = findWordsII(bCopy, cases[i].w.slice());
          if (Array.isArray(res) && res.slice().sort().join(',') === cases[i].expected.slice().sort().join(',')) {
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
fn = globals().get('find_words_ii') or globals().get('findWordsII')
assert fn is not None, "Function find_words_ii not found"
cases = [
    ([["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"], ["eat","oath"]),
    ([["a","b"],["c","d"]], ["abcb"], []),
    ([["a"]], ["a"], ["a"]),
    ([["a","b"],["c","d"]], ["ab","ac","bd","ca"], ["ab","ac","bd","ca"])
]
for idx, (b, w, expected) in enumerate(cases):
    ans = fn([list(r) for r in b], list(w))
    assert sorted(ans) == sorted(expected), f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Remove Invalid Parentheses (Fault-Tolerant Compiler AST Recovery)
  war_remove_invalid_parentheses_44: {
    functionName: 'removeInvalidParentheses',
    pythonFunctionName: 'remove_invalid_parentheses',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { s: "()())()", expected: ["(())()","()()()"] },
        { s: "(a)())()", expected: ["(a())()","(a)()()"] },
        { s: ")(", expected: [""] },
        { s: "()", expected: ["()"] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = removeInvalidParentheses(cases[i].s);
          if (Array.isArray(res) && res.slice().sort().join(',') === cases[i].expected.slice().sort().join(',')) {
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
fn = globals().get('remove_invalid_parentheses') or globals().get('removeInvalidParentheses')
assert fn is not None, "Function remove_invalid_parentheses not found"
cases = [
    ("()())()", ["(())()","()()()"]),
    ("(a)())()", ["(a())()","(a)()()"]),
    (")(", [""]),
    ("()", ["()"])
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert sorted(ans) == sorted(expected), f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Russian Doll Envelopes (2D LIS Wafer Fabrication Mask Nesting)
  war_russian_doll_envelopes_45: {
    functionName: 'maxEnvelopes',
    pythonFunctionName: 'max_envelopes',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { e: [[5,4],[6,4],[6,7],[2,3]], expected: 3 },
        { e: [[1,1],[1,1],[1,1]], expected: 1 },
        { e: [[4,5],[4,6],[6,7],[2,3],[1,1]], expected: 4 },
        { e: [[10,20]], expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var eCopy = cases[i].e.map(function(item){ return item.slice(); });
          var res = maxEnvelopes(eCopy);
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
fn = globals().get('max_envelopes') or globals().get('maxEnvelopes')
assert fn is not None, "Function max_envelopes not found"
cases = [
    ([[5,4],[6,4],[6,7],[2,3]], 3),
    ([[1,1],[1,1],[1,1]], 1),
    ([[4,5],[4,6],[6,7],[2,3],[1,1]], 4),
    ([[10,20]], 1)
]
for idx, (envelopes, expected) in enumerate(cases):
    ans = fn([list(x) for x in envelopes])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Tiered Cache Hierarchy Simulator (L1 LRU + L2 LFU Controller)
  war_hierarchical_cache_simulator_46: {
    functionName: 'simulateTieredCache',
    pythonFunctionName: 'simulate_tiered_cache',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { l1: 2, l2: 2, ops: [["put",1,10],["put",2,20],["get",1],["put",3,30],["get",2],["get",1]], expected: [10,20,10] },
        { l1: 1, l2: 1, ops: [["put",1,100],["put",2,200],["get",1],["get",2]], expected: [100,200] },
        { l1: 1, l2: 1, ops: [["get",5]], expected: [-1] },
        { l1: 2, l2: 1, ops: [["put",1,1],["put",2,2],["put",3,3],["put",4,4],["get",1]], expected: [-1] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = simulateTieredCache(cases[i].l1, cases[i].l2, cases[i].ops);
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
fn = globals().get('simulate_tiered_cache') or globals().get('simulateTieredCache')
assert fn is not None, "Function simulate_tiered_cache not found"
cases = [
    (2, 2, [["put",1,10],["put",2,20],["get",1],["put",3,30],["get",2],["get",1]], [10,20,10]),
    (1, 1, [["put",1,100],["put",2,200],["get",1],["get",2]], [100,200]),
    (1, 1, [["get",5]], [-1]),
    (2, 1, [["put",1,1],["put",2,2],["put",3,3],["put",4,4],["get",1]], [-1])
]
for idx, (l1, l2, ops, expected) in enumerate(cases):
    ans = fn(l1, l2, [list(x) for x in ops])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Median of Two Sorted Arrays (Logarithmic Dual Partitioning)
  war_median_two_sorted_arrays_47: {
    functionName: 'findMedianSortedArrays',
    pythonFunctionName: 'find_median_sorted_arrays',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { n1: [1,3], n2: [2], expected: 2.0 },
        { n1: [1,2], n2: [3,4], expected: 2.5 },
        { n1: [0,0], n2: [0,0], expected: 0.0 },
        { n1: [], n2: [1], expected: 1.0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findMedianSortedArrays(cases[i].n1.slice(), cases[i].n2.slice());
          if (Math.abs(res - cases[i].expected) < 1e-5) {
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
fn = globals().get('find_median_sorted_arrays') or globals().get('findMedianSortedArrays')
assert fn is not None, "Function find_median_sorted_arrays not found"
cases = [
    ([1,3], [2], 2.0),
    ([1,2], [3,4], 2.5),
    ([0,0], [0,0], 0.0),
    ([], [1], 1.0)
]
for idx, (n1, n2, expected) in enumerate(cases):
    ans = fn(list(n1), list(n2))
    assert abs(ans - expected) < 1e-5, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Shortest Path Visiting All Nodes (Autonomous Robotics Routing)
  war_shortest_path_all_nodes_48: {
    functionName: 'shortestPathLength',
    pythonFunctionName: 'shortest_path_length',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { g: [[1,2,3],[0],[0],[0]], expected: 4 },
        { g: [[1],[0,2,4],[1,3,4],[2],[1,2]], expected: 4 },
        { g: [[]], expected: 0 },
        { g: [[1],[0]], expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var gCopy = cases[i].g.map(function(item){ return item.slice(); });
          var res = shortestPathLength(gCopy);
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
fn = globals().get('shortest_path_length') or globals().get('shortestPathLength')
assert fn is not None, "Function shortest_path_length not found"
cases = [
    ([[1,2,3],[0],[0],[0]], 4),
    ([[1],[0,2,4],[1,3,4],[2],[1,2]], 4),
    ([[]], 0),
    ([[1],[0]], 1)
]
for idx, (g, expected) in enumerate(cases):
    ans = fn([list(x) for x in g])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Palindrome Pairs (Genomic Hairpin & NLP Token Matcher)
  war_palindrome_pairs_49: {
    functionName: 'palindromePairs',
    pythonFunctionName: 'palindrome_pairs',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { w: ["abcd","dcba","lls","s","sssll"], expected: [[0,1],[1,0],[2,4],[3,2]] },
        { w: ["bat","tab","cat"], expected: [[0,1],[1,0]] },
        { w: ["a",""], expected: [[0,1],[1,0]] },
        { w: ["a","b"], expected: [] }
      ];
      function canonicalize(arr) {
        return arr.map(function(item){ return item.join(','); }).sort().join('|');
      }
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = palindromePairs(cases[i].w.slice());
          if (canonicalize(res) === canonicalize(cases[i].expected)) {
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
fn = globals().get('palindrome_pairs') or globals().get('palindromePairs')
assert fn is not None, "Function palindrome_pairs not found"
def canonicalize(arr):
    return sorted(arr)
cases = [
    (["abcd","dcba","lls","s","sssll"], [[0,1],[1,0],[2,4],[3,2]]),
    (["bat","tab","cat"], [[0,1],[1,0]]),
    (["a",""], [[0,1],[1,0]]),
    (["a","b"], [])
]
for idx, (w, expected) in enumerate(cases):
    ans = fn(list(w))
    assert canonicalize(ans) == canonicalize(expected), f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // [ADVANCED] Redundant Connection II (Directed Dependency Graph Sanitizer)
  war_redundant_connection_ii_50: {
    functionName: 'findRedundantDirectedConnection',
    pythonFunctionName: 'find_redundant_directed_connection',
    totalTests: 4,
    evaluatorCode: `
var cases = [
        { e: [[1,2],[1,3],[2,3]], expected: [2,3] },
        { e: [[1,2],[2,3],[3,4],[4,1],[1,5]], expected: [4,1] },
        { e: [[2,1],[3,1],[4,2],[1,4]], expected: [2,1] },
        { e: [[1,2],[2,3],[3,1]], expected: [3,1] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var eCopy = cases[i].e.map(function(item){ return item.slice(); });
          var res = findRedundantDirectedConnection(eCopy);
          if (Array.isArray(res) && res.join(',') === cases[i].expected.join(',')) {
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
fn = globals().get('find_redundant_directed_connection') or globals().get('findRedundantDirectedConnection')
assert fn is not None, "Function find_redundant_directed_connection not found"
cases = [
    ([[1,2],[1,3],[2,3]], [2,3]),
    ([[1,2],[2,3],[3,4],[4,1],[1,5]], [4,1]),
    ([[2,1],[3,1],[4,2],[1,4]], [2,1]),
    ([[1,2],[2,3],[3,1]], [3,1])
]
for idx, (edges, expected) in enumerate(cases):
    ans = fn([list(x) for x in edges])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },
  // --- BATCH EXPANSION: 30 NEW QUESTIONS (151 to 180) ---
  // BASIC 51-60
  war_distribute_candies_51: {
    functionName: 'distributeCandies',
    pythonFunctionName: 'distribute_candies',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { c: [1,1,2,2,3,3], expected: 3 },
        { c: [1,1,2,3], expected: 2 },
        { c: [6,6,6,6], expected: 1 },
        { c: [1,2,3,4,5,6,7,8], expected: 4 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = distributeCandies(cases[i].c.slice());
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
fn = globals().get('distribute_candies') or globals().get('distributeCandies')
assert fn is not None, "Function distribute_candies not found"
cases = [
    ([1,1,2,2,3,3], 3),
    ([1,1,2,3], 2),
    ([6,6,6,6], 1),
    ([1,2,3,4,5,6,7,8], 4)
]
for idx, (c, expected) in enumerate(cases):
    ans = fn(list(c))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_baseball_game_52: {
    functionName: 'calPoints',
    pythonFunctionName: 'cal_points',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { ops: ["5","2","C","D","+"], expected: 30 },
        { ops: ["5","-2","4","C","D","9","+","+"], expected: 27 },
        { ops: ["1","C"], expected: 0 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = calPoints(cases[i].ops.slice());
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
fn = globals().get('cal_points') or globals().get('calPoints')
assert fn is not None, "Function cal_points not found"
cases = [
    (["5","2","C","D","+"], 30),
    (["5","-2","4","C","D","9","+","+"], 27),
    (["1","C"], 0)
]
for idx, (ops, expected) in enumerate(cases):
    ans = fn(list(ops))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_flood_fill_basic_53: {
    functionName: 'floodFill',
    pythonFunctionName: 'flood_fill',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { img: [[1,1,1],[1,1,0],[1,0,1]], sr: 1, sc: 1, color: 2, expected: [[2,2,2],[2,2,0],[2,0,1]] },
        { img: [[0,0,0],[0,0,0]], sr: 0, sc: 0, color: 0, expected: [[0,0,0],[0,0,0]] },
        { img: [[0]], sr: 0, sc: 0, color: 5, expected: [[5]] },
        { img: [[1,0,1],[0,1,0],[1,0,1]], sr: 0, sc: 0, color: 9, expected: [[9,0,1],[0,1,0],[1,0,1]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var imgCopy = cases[i].img.map(function(r){ return r.slice(); });
          var res = floodFill(imgCopy, cases[i].sr, cases[i].sc, cases[i].color);
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
fn = globals().get('flood_fill') or globals().get('floodFill')
assert fn is not None, "Function flood_fill not found"
cases = [
    ([[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2, [[2,2,2],[2,2,0],[2,0,1]]),
    ([[0,0,0],[0,0,0]], 0, 0, 0, [[0,0,0],[0,0,0]]),
    ([[0]], 0, 0, 5, [[5]]),
    ([[1,0,1],[0,1,0],[1,0,1]], 0, 0, 9, [[9,0,1],[0,1,0],[1,0,1]])
]
for idx, (img, sr, sc, color, expected) in enumerate(cases):
    ans = fn([list(r) for r in img], sr, sc, color)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_toeplitz_matrix_54: {
    functionName: 'isToeplitzMatrix',
    pythonFunctionName: 'is_toeplitz_matrix',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { mat: [[1,2,3,4],[5,1,2,3],[9,5,1,2]], expected: true },
        { mat: [[1,2],[2,2]], expected: false },
        { mat: [[1,2,3]], expected: true },
        { mat: [[1],[2],[3]], expected: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = isToeplitzMatrix(cases[i].mat.map(function(r){ return r.slice(); }));
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
fn = globals().get('is_toeplitz_matrix') or globals().get('isToeplitzMatrix')
assert fn is not None, "Function is_toeplitz_matrix not found"
cases = [
    ([[1,2,3,4],[5,1,2,3],[9,5,1,2]], True),
    ([[1,2],[2,2]], False),
    ([[1,2,3]], True),
    ([[1],[2],[3]], True)
]
for idx, (mat, expected) in enumerate(cases):
    ans = fn([list(r) for r in mat])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_jewels_and_stones_55: {
    functionName: 'numJewelsInStones',
    pythonFunctionName: 'num_jewels_in_stones',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { j: "aA", s: "aAAbbbb", expected: 3 },
        { j: "z", s: "ZZ", expected: 0 },
        { j: "abc", s: "aabbccdef", expected: 6 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = numJewelsInStones(cases[i].j, cases[i].s);
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
fn = globals().get('num_jewels_in_stones') or globals().get('numJewelsInStones')
assert fn is not None, "Function num_jewels_in_stones not found"
cases = [
    ("aA", "aAAbbbb", 3),
    ("z", "ZZ", 0),
    ("abc", "aabbccdef", 6)
]
for idx, (j, s, expected) in enumerate(cases):
    ans = fn(j, s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_unique_morse_representations_56: {
    functionName: 'uniqueMorseRepresentations',
    pythonFunctionName: 'unique_morse_representations',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { w: ["gin","zen","gig","msg"], expected: 2 },
        { w: ["a"], expected: 1 },
        { w: ["a","b","c"], expected: 3 },
        { w: ["hello","world","hello"], expected: 2 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = uniqueMorseRepresentations(cases[i].w.slice());
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
fn = globals().get('unique_morse_representations') or globals().get('uniqueMorseRepresentations')
assert fn is not None, "Function unique_morse_representations not found"
cases = [
    (["gin","zen","gig","msg"], 2),
    (["a"], 1),
    (["a","b","c"], 3),
    (["hello","world","hello"], 2)
]
for idx, (w, expected) in enumerate(cases):
    ans = fn(list(w))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_flipping_an_image_57: {
    functionName: 'flipAndInvertImage',
    pythonFunctionName: 'flip_and_invert_image',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { img: [[1,1,0],[1,0,1],[0,0,0]], expected: [[1,0,0],[0,1,0],[1,1,1]] },
        { img: [[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]], expected: [[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]] },
        { img: [[0]], expected: [[1]] },
        { img: [[1,1],[1,1]], expected: [[0,0],[0,0]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var imgCopy = cases[i].img.map(function(r){ return r.slice(); });
          var res = flipAndInvertImage(imgCopy);
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
fn = globals().get('flip_and_invert_image') or globals().get('flipAndInvertImage')
assert fn is not None, "Function flip_and_invert_image not found"
cases = [
    ([[1,1,0],[1,0,1],[0,0,0]], [[1,0,0],[0,1,0],[1,1,1]]),
    ([[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]], [[1,1,0,0],[0,1,1,0],[0,0,0,1],[1,0,1,0]]),
    ([[0]], [[1]]),
    ([[1,1],[1,1]], [[0,0],[0,0]])
]
for idx, (img, expected) in enumerate(cases):
    ans = fn([list(r) for r in img])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_transpose_matrix_58: {
    functionName: 'transpose',
    pythonFunctionName: 'transpose',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { mat: [[1,2,3],[4,5,6],[7,8,9]], expected: [[1,4,7],[2,5,8],[3,6,9]] },
        { mat: [[1,2,3],[4,5,6]], expected: [[1,4],[2,5],[3,6]] },
        { mat: [[1,2,3,4]], expected: [[1],[2],[3],[4]] },
        { mat: [[1],[2],[3],[4]], expected: [[1,2,3,4]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var matCopy = cases[i].mat.map(function(r){ return r.slice(); });
          var res = transpose(matCopy);
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
fn = globals().get('transpose')
assert fn is not None, "Function transpose not found"
cases = [
    ([[1,2,3],[4,5,6],[7,8,9]], [[1,4,7],[2,5,8],[3,6,9]]),
    ([[1,2,3],[4,5,6]], [[1,4],[2,5],[3,6]]),
    ([[1,2,3,4]], [[1],[2],[3],[4]]),
    ([[1],[2],[3],[4]], [[1,2,3,4]])
]
for idx, (mat, expected) in enumerate(cases):
    ans = fn([list(r) for r in mat])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_fair_candy_swap_59: {
    functionName: 'fairCandySwap',
    pythonFunctionName: 'fair_candy_swap',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { a: [1,1], b: [2,2], expected: [1,2] },
        { a: [1,2], b: [2,3], expected: [1,2] },
        { a: [2], b: [1,3], expected: [2,3] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = fairCandySwap(cases[i].a.slice(), cases[i].b.slice());
          if (Array.isArray(res) && res.join(',') === cases[i].expected.join(',')) {
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
fn = globals().get('fair_candy_swap') or globals().get('fairCandySwap')
assert fn is not None, "Function fair_candy_swap not found"
cases = [
    ([1,1], [2,2], [1,2]),
    ([1,2], [2,3], [1,2]),
    ([2], [1,3], [2,3])
]
for idx, (a, b, expected) in enumerate(cases):
    ans = fn(list(a), list(b))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_sort_array_by_parity_60: {
    functionName: 'sortArrayByParity',
    pythonFunctionName: 'sort_array_by_parity',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [3,1,2,4] },
        { nums: [0] },
        { nums: [2,4,6,8] },
        { nums: [1,3,5,7] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = sortArrayByParity(cases[i].nums.slice());
          if (!Array.isArray(res) || res.length !== cases[i].nums.length) {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: invalid array shape' };
          }
          var oddSeen = false;
          var valid = true;
          for (var j = 0; j < res.length; j++) {
            if (res[j] % 2 !== 0) oddSeen = true;
            else if (oddSeen) { valid = false; break; }
          }
          if (valid) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: evens must precede odds' };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('sort_array_by_parity') or globals().get('sortArrayByParity')
assert fn is not None, "Function sort_array_by_parity not found"
cases = [
    [3,1,2,4],
    [0],
    [2,4,6,8],
    [1,3,5,7]
]
for idx, nums in enumerate(cases):
    ans = fn(list(nums))
    assert len(ans) == len(nums), f"Test case {idx+1} failed: length mismatch"
    odd_seen = False
    for x in ans:
        if x % 2 != 0:
            odd_seen = True
        elif odd_seen:
            assert False, f"Test case {idx+1} failed: evens must precede odds in {ans}"
`,
  },

  // INTERMEDIATE 54-63
  war_subsets_54: {
    functionName: 'subsets',
    pythonFunctionName: 'subsets',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [1,2,3], expected: [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]] },
        { nums: [0], expected: [[],[0]] },
        { nums: [1,2], expected: [[],[1],[2],[1,2]] },
        { nums: [9], expected: [[],[9]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = subsets(cases[i].nums.slice());
          if (!Array.isArray(res)) return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Expected array' };
          var canon = res.map(function(s){ return s.slice().sort(function(a,b){ return a-b; }); });
          canon.sort(function(a,b){ return a.length - b.length || a.join(',').localeCompare(b.join(',')); });
          if (JSON.stringify(canon) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(canon) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('subsets')
assert fn is not None, "Function subsets not found"
cases = [
    ([1,2,3], [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]),
    ([0], [[],[0]]),
    ([1,2], [[],[1],[2],[1,2]]),
    ([9], [[],[9]])
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    for s in ans:
        s.sort()
    ans.sort(key=lambda x: (len(x), x))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_permutations_55: {
    functionName: 'permute',
    pythonFunctionName: 'permute',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [1,2,3], expected: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]] },
        { nums: [0,1], expected: [[0,1],[1,0]] },
        { nums: [1], expected: [[1]] },
        { nums: [2,1], expected: [[1,2],[2,1]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = permute(cases[i].nums.slice());
          if (!Array.isArray(res)) return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Expected array' };
          var canon = res.slice().sort(function(a,b){ return a.join(',').localeCompare(b.join(',')); });
          if (JSON.stringify(canon) === JSON.stringify(cases[i].expected)) {
            passedCount++;
          } else {
            return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' failed: expected ' + JSON.stringify(cases[i].expected) + ', got ' + JSON.stringify(canon) };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('permute')
assert fn is not None, "Function permute not found"
cases = [
    ([1,2,3], [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]),
    ([0,1], [[0,1],[1,0]]),
    ([1], [[1]]),
    ([2,1], [[1,2],[2,1]])
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    ans.sort()
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_pacific_atlantic_water_flow_56: {
    functionName: 'pacificAtlantic',
    pythonFunctionName: 'pacific_atlantic',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { h: [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]], expected: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]] },
        { h: [[1]], expected: [[0,0]] },
        { h: [[2,2],[2,2]], expected: [[0,0],[0,1],[1,0],[1,1]] },
        { h: [[1,2],[3,4]], expected: [[0,1],[1,0],[1,1]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var hCopy = cases[i].h.map(function(r){ return r.slice(); });
          var res = pacificAtlantic(hCopy);
          if (Array.isArray(res)) {
            res.sort(function(a,b){ return a[0] - b[0] || a[1] - b[1]; });
          }
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
fn = globals().get('pacific_atlantic') or globals().get('pacificAtlantic')
assert fn is not None, "Function pacific_atlantic not found"
cases = [
    ([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]], [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]),
    ([[1]], [[0,0]]),
    ([[2,2],[2,2]], [[0,0],[0,1],[1,0],[1,1]]),
    ([[1,2],[3,4]], [[0,1],[1,0],[1,1]])
]
for idx, (h, expected) in enumerate(cases):
    ans = fn([list(r) for r in h])
    ans.sort()
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_longest_consecutive_sequence_57: {
    functionName: 'longestConsecutive',
    pythonFunctionName: 'longest_consecutive',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [100,4,200,1,3,2], expected: 4 },
        { nums: [0,3,7,2,5,8,4,6,0,1], expected: 9 },
        { nums: [], expected: 0 },
        (function() {
          var arr = [];
          for (var k = 0; k < 2000; k++) arr.push((k * 7919) % 2000);
          return { nums: arr, expected: 2000 };
        })()
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = longestConsecutive(cases[i].nums.slice());
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
fn = globals().get('longest_consecutive') or globals().get('longestConsecutive')
assert fn is not None, "Function longest_consecutive not found"
cases = [
    ([100,4,200,1,3,2], 4),
    ([0,3,7,2,5,8,4,6,0,1], 9),
    ([], 0),
    ([(k * 7919) % 2000 for k in range(2000)], 2000)
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_evaluate_reverse_polish_notation_58: {
    functionName: 'evalRPN',
    pythonFunctionName: 'eval_rpn',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { t: ["2","1","+","3","*"], expected: 9 },
        { t: ["4","13","5","/","+"], expected: 6 },
        { t: ["10","6","9","3","+","-11","*","/","*","17","+","5","+"], expected: 22 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = evalRPN(cases[i].t.slice());
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
fn = globals().get('eval_rpn') or globals().get('evalRPN')
assert fn is not None, "Function eval_rpn not found"
cases = [
    (["2","1","+","3","*"], 9),
    (["4","13","5","/","+"], 6),
    (["10","6","9","3","+","-11","*","/","*","17","+","5","+"], 22)
]
for idx, (t, expected) in enumerate(cases):
    ans = fn(list(t))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_course_schedule_ii_59: {
    functionName: 'findOrder',
    pythonFunctionName: 'find_order',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { n: 2, pre: [[1,0]], cycle: false },
        { n: 4, pre: [[1,0],[2,0],[3,1],[3,2]], cycle: false },
        { n: 2, pre: [[0,1],[1,0]], cycle: true }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findOrder(cases[i].n, cases[i].pre.map(function(r){ return r.slice(); }));
          if (cases[i].cycle) {
            if (Array.isArray(res) && res.length === 0) passedCount++;
            else return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Cycle should return empty array' };
          } else {
            if (!Array.isArray(res) || res.length !== cases[i].n) {
              return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Invalid order length' };
            }
            var pos = {};
            for (var j = 0; j < res.length; j++) pos[res[j]] = j;
            var valid = true;
            for (var k = 0; k < cases[i].pre.length; k++) {
              var c = cases[i].pre[k][0], p = cases[i].pre[k][1];
              if (pos[p] >= pos[c]) { valid = false; break; }
            }
            if (valid) passedCount++;
            else return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Topological order violated' };
          }
        } catch (e) {
          return { passed: false, status: 'FAILED', testsPassed: passedCount, totalTests: cases.length, error: 'Test case ' + (i+1) + ' error: ' + (e && e.message ? e.message : 'Execution error') };
        }
      }
      return { passed: true, status: 'SUCCESS', testsPassed: passedCount, totalTests: cases.length };
    `,
    pythonTests: `
fn = globals().get('find_order') or globals().get('findOrder')
assert fn is not None, "Function find_order not found"
cases = [
    (2, [[1,0]], False),
    (4, [[1,0],[2,0],[3,1],[3,2]], False),
    (2, [[0,1],[1,0]], True)
]
for idx, (n, pre, cycle) in enumerate(cases):
    ans = fn(n, [list(r) for r in pre])
    if cycle:
        assert ans == [], f"Test case {idx+1} failed: cycle must return empty list"
    else:
        assert len(ans) == n, f"Test case {idx+1} failed: invalid length"
        pos = {c: i for i, c in enumerate(ans)}
        for c, p in pre:
            assert pos[p] < pos[c], f"Test case {idx+1} failed: pre {p} must come before {c}"
`,
  },

  war_task_scheduler_60: {
    functionName: 'leastInterval',
    pythonFunctionName: 'least_interval',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { t: ["A","A","A","B","B","B"], n: 2, expected: 8 },
        { t: ["A","A","A","B","B","B"], n: 0, expected: 6 },
        { t: ["A","A","A","A","A","A","B","C","D","E","F","G"], n: 2, expected: 16 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = leastInterval(cases[i].t.slice(), cases[i].n);
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
fn = globals().get('least_interval') or globals().get('leastInterval')
assert fn is not None, "Function least_interval not found"
cases = [
    (["A","A","A","B","B","B"], 2, 8),
    (["A","A","A","B","B","B"], 0, 6),
    (["A","A","A","A","A","A","B","C","D","E","F","G"], 2, 16)
]
for idx, (t, n, expected) in enumerate(cases):
    ans = fn(list(t), n)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_accounts_merge_61: {
    functionName: 'accountsMerge',
    pythonFunctionName: 'accounts_merge',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        {
          acc: [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]],
          expected: [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["John","johnnybravo@mail.com"],["Mary","mary@mail.com"]]
        },
        {
          acc: [["Gabe","Gabe0@m.co","Gabe3@m.co"],["Kevin","Kevin3@m.co","Kevin5@m.co"],["Gabe","Gabe1@m.co","Gabe2@m.co"],["Gabe","Gabe3@m.co","Gabe4@m.co"]],
          expected: [["Gabe","Gabe0@m.co","Gabe3@m.co","Gabe4@m.co"],["Gabe","Gabe1@m.co","Gabe2@m.co"],["Kevin","Kevin3@m.co","Kevin5@m.co"]]
        },
        {
          acc: [["David","david@mail.com","david01@mail.com"]],
          expected: [["David","david01@mail.com","david@mail.com"]]
        },
        {
          acc: [["Alex","a@mail.com","b@mail.com"],["Alex","b@mail.com","c@mail.com"],["Alex","c@mail.com","d@mail.com"]],
          expected: [["Alex","a@mail.com","b@mail.com","c@mail.com","d@mail.com"]]
        }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var accCopy = cases[i].acc.map(function(r){ return r.slice(); });
          var res = accountsMerge(accCopy);
          if (Array.isArray(res)) {
            res.sort(function(a,b){ return a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]); });
          }
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
fn = globals().get('accounts_merge') or globals().get('accountsMerge')
assert fn is not None, "Function accounts_merge not found"
cases = [
    ([["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]], [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["John","johnnybravo@mail.com"],["Mary","mary@mail.com"]]),
    ([["Gabe","Gabe0@m.co","Gabe3@m.co"],["Kevin","Kevin3@m.co","Kevin5@m.co"],["Gabe","Gabe1@m.co","Gabe2@m.co"],["Gabe","Gabe3@m.co","Gabe4@m.co"]], [["Gabe","Gabe0@m.co","Gabe3@m.co","Gabe4@m.co"],["Gabe","Gabe1@m.co","Gabe2@m.co"],["Kevin","Kevin3@m.co","Kevin5@m.co"]]),
    ([["David","david@mail.com","david01@mail.com"]], [["David","david01@mail.com","david@mail.com"]]),
    ([["Alex","a@mail.com","b@mail.com"],["Alex","b@mail.com","c@mail.com"],["Alex","c@mail.com","d@mail.com"]], [["Alex","a@mail.com","b@mail.com","c@mail.com","d@mail.com"]])
]
for idx, (acc, expected) in enumerate(cases):
    ans = fn([list(r) for r in acc])
    ans.sort(key=lambda x: (x[0], x[1]))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_minimum_size_subarray_sum_62: {
    functionName: 'minSubArrayLen',
    pythonFunctionName: 'min_sub_array_len',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { target: 7, nums: [2,3,1,2,4,3], expected: 2 },
        { target: 4, nums: [1,4,4], expected: 1 },
        { target: 11, nums: [1,1,1,1,1,1,1,1], expected: 0 },
        (function() {
          var arr = [];
          for (var k = 0; k < 3000; k++) arr.push(1);
          return { target: 1500, nums: arr, expected: 1500 };
        })()
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = minSubArrayLen(cases[i].target, cases[i].nums.slice());
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
fn = globals().get('min_sub_array_len') or globals().get('minSubArrayLen')
assert fn is not None, "Function min_sub_array_len not found"
cases = [
    (7, [2,3,1,2,4,3], 2),
    (4, [1,4,4], 1),
    (11, [1,1,1,1,1,1,1,1], 0),
    (1500, [1] * 3000, 1500)
]
for idx, (target, nums, expected) in enumerate(cases):
    ans = fn(target, list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_asteroid_collision_63: {
    functionName: 'asteroidCollision',
    pythonFunctionName: 'asteroid_collision',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { a: [5,10,-5], expected: [5,10] },
        { a: [8,-8], expected: [] },
        { a: [10,2,-5], expected: [10] },
        { a: [-2,-1,1,2], expected: [-2,-1,1,2] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = asteroidCollision(cases[i].a.slice());
          if (Array.isArray(res) && res.join(',') === cases[i].expected.join(',')) {
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
fn = globals().get('asteroid_collision') or globals().get('asteroidCollision')
assert fn is not None, "Function asteroid_collision not found"
cases = [
    ([5,10,-5], [5,10]),
    ([8,-8], []),
    ([10,2,-5], [10]),
    ([-2,-1,1,2], [-2,-1,1,2])
]
for idx, (a, expected) in enumerate(cases):
    ans = fn(list(a))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  // ADVANCED 51-60
  war_the_skyline_problem_51: {
    functionName: 'getSkyline',
    pythonFunctionName: 'get_skyline',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { b: [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]], expected: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]] },
        { b: [[0,2,3],[2,5,3]], expected: [[0,3],[5,0]] },
        { b: [[1,2,1],[3,4,2]], expected: [[1,1],[2,0],[3,2],[4,0]] },
        { b: [[1,5,10],[2,4,5]], expected: [[1,10],[5,0]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var bCopy = cases[i].b.map(function(r){ return r.slice(); });
          var res = getSkyline(bCopy);
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
fn = globals().get('get_skyline') or globals().get('getSkyline')
assert fn is not None, "Function get_skyline not found"
cases = [
    ([[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]], [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]),
    ([[0,2,3],[2,5,3]], [[0,3],[5,0]]),
    ([[1,2,1],[3,4,2]], [[1,1],[2,0],[3,2],[4,0]]),
    ([[1,5,10],[2,4,5]], [[1,10],[5,0]])
]
for idx, (b, expected) in enumerate(cases):
    ans = fn([list(r) for r in b])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_concatenated_words_52: {
    functionName: 'findAllConcatenatedWordsInADict',
    pythonFunctionName: 'find_all_concatenated_words_in_a_dict',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { w: ["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"], expected: ["catsdogcats","dogcatsdog","ratcatdogcat"] },
        { w: ["cat","dog","catdog"], expected: ["catdog"] },
        { w: ["a","b","c"], expected: [] },
        { w: ["a","b","c","ab","abc"], expected: ["ab","abc"] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findAllConcatenatedWordsInADict(cases[i].w.slice());
          if (Array.isArray(res)) res.sort();
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
fn = globals().get('find_all_concatenated_words_in_a_dict') or globals().get('findAllConcatenatedWordsInADict')
assert fn is not None, "Function find_all_concatenated_words_in_a_dict not found"
cases = [
    (["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"], ["catsdogcats","dogcatsdog","ratcatdogcat"]),
    (["cat","dog","catdog"], ["catdog"]),
    (["a","b","c"], []),
    (["a","b","c","ab","abc"], ["ab","abc"])
]
for idx, (w, expected) in enumerate(cases):
    ans = fn(list(w))
    ans.sort()
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_sliding_puzzle_53: {
    functionName: 'slidingPuzzle',
    pythonFunctionName: 'sliding_puzzle',
    totalTests: 3,
    evaluatorCode: `
      var cases = [
        { b: [[1,2,3],[4,0,5]], expected: 1 },
        { b: [[1,2,3],[5,4,0]], expected: -1 },
        { b: [[4,1,2],[5,0,3]], expected: 5 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var bCopy = cases[i].b.map(function(r){ return r.slice(); });
          var res = slidingPuzzle(bCopy);
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
fn = globals().get('sliding_puzzle') or globals().get('slidingPuzzle')
assert fn is not None, "Function sliding_puzzle not found"
cases = [
    ([[1,2,3],[4,0,5]], 1),
    ([[1,2,3],[5,4,0]], -1),
    ([[4,1,2],[5,0,3]], 5)
]
for idx, (b, expected) in enumerate(cases):
    ans = fn([list(r) for r in b])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_critical_connections_network_54: {
    functionName: 'criticalConnections',
    pythonFunctionName: 'critical_connections',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { n: 4, c: [[0,1],[1,2],[2,0],[1,3]], expected: [[1,3]] },
        { n: 2, c: [[0,1]], expected: [[0,1]] },
        { n: 3, c: [[0,1],[1,2],[2,0]], expected: [] },
        { n: 3, c: [[0,1],[1,2]], expected: [[0,1],[1,2]] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var cCopy = cases[i].c.map(function(r){ return r.slice(); });
          var res = criticalConnections(cases[i].n, cCopy);
          if (Array.isArray(res)) {
            res = res.map(function(e){ return e[0] < e[1] ? [e[0], e[1]] : [e[1], e[0]]; });
            res.sort(function(a,b){ return a[0] - b[0] || a[1] - b[1]; });
          }
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
fn = globals().get('critical_connections') or globals().get('criticalConnections')
assert fn is not None, "Function critical_connections not found"
cases = [
    (4, [[0,1],[1,2],[2,0],[1,3]], [[1,3]]),
    (2, [[0,1]], [[0,1]]),
    (3, [[0,1],[1,2],[2,0]], []),
    (3, [[0,1],[1,2]], [[0,1],[1,2]])
]
for idx, (n, c, expected) in enumerate(cases):
    ans = fn(n, [list(r) for r in c])
    ans = [sorted(edge) for edge in ans]
    ans.sort()
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_count_smaller_after_self_55: {
    functionName: 'countSmaller',
    pythonFunctionName: 'count_smaller',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { nums: [5,2,6,1], expected: [2,1,1,0] },
        { nums: [-1], expected: [0] },
        { nums: [-1,-1], expected: [0,0] },
        (function() {
          var arr = [], exp = [];
          for (var k = 0; k < 2000; k++) {
            arr.push(2000 - k);
            exp.push(1999 - k);
          }
          return { nums: arr, expected: exp };
        })()
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = countSmaller(cases[i].nums.slice());
          if (Array.isArray(res) && res.join(',') === cases[i].expected.join(',')) {
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
fn = globals().get('count_smaller') or globals().get('countSmaller')
assert fn is not None, "Function count_smaller not found"
cases = [
    ([5,2,6,1], [2,1,1,0]),
    ([-1], [0]),
    ([-1,-1], [0,0]),
    ([2000 - k for k in range(2000)], [1999 - k for k in range(2000)])
]
for idx, (nums, expected) in enumerate(cases):
    ans = fn(list(nums))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_ipo_capital_maximization_56: {
    functionName: 'findMaximizedCapital',
    pythonFunctionName: 'find_maximized_capital',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { k: 2, w: 0, p: [1,2,3], c: [0,1,1], expected: 4 },
        { k: 3, w: 0, p: [1,2,3], c: [0,1,2], expected: 6 },
        { k: 1, w: 0, p: [1,2,3], c: [1,1,2], expected: 0 },
        { k: 10, w: 5, p: [2,3], c: [1,2], expected: 10 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = findMaximizedCapital(cases[i].k, cases[i].w, cases[i].p.slice(), cases[i].c.slice());
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
fn = globals().get('find_maximized_capital') or globals().get('findMaximizedCapital')
assert fn is not None, "Function find_maximized_capital not found"
cases = [
    (2, 0, [1,2,3], [0,1,1], 4),
    (3, 0, [1,2,3], [0,1,2], 6),
    (1, 0, [1,2,3], [1,1,2], 0),
    (10, 5, [2,3], [1,2], 10)
]
for idx, (k, w, p, c, expected) in enumerate(cases):
    ans = fn(k, w, list(p), list(c))
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_design_in_memory_file_system_57: {
    functionName: 'simulateFileSystem',
    pythonFunctionName: 'simulate_file_system',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        {
          ops: ["ls", "mkdir", "addContentToFile", "ls", "readContentFromFile"],
          args: [["/"], ["/a/b/c"], ["/a/b/c/d", "hello"], ["/"], ["/a/b/c/d"]],
          expected: [[], null, null, ["a"], "hello"]
        },
        {
          ops: ["mkdir", "ls"],
          args: [["/a"], ["/"]],
          expected: [null, ["a"]]
        },
        {
          ops: ["mkdir", "addContentToFile", "addContentToFile", "ls"],
          args: [["/docs"], ["/docs/z.txt", "end"], ["/docs/a.txt", "start"], ["/docs"]],
          expected: [null, null, null, ["a.txt", "z.txt"]]
        },
        {
          ops: ["addContentToFile", "addContentToFile", "readContentFromFile"],
          args: [["/log.txt", "hello "], ["/log.txt", "world"], ["/log.txt"]], expected: [null, null, "hello world"]
        }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = simulateFileSystem(cases[i].ops.slice(), cases[i].args.map(function(r){ return r.slice(); }));
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
fn = globals().get('simulate_file_system') or globals().get('simulateFileSystem')
assert fn is not None, "Function simulate_file_system not found"
cases = [
    (["ls", "mkdir", "addContentToFile", "ls", "readContentFromFile"], [["/"], ["/a/b/c"], ["/a/b/c/d", "hello"], ["/"], ["/a/b/c/d"]], [[], None, None, ["a"], "hello"]),
    (["mkdir", "ls"], [["/a"], ["/"]], [None, ["a"]]),
    (["mkdir", "addContentToFile", "addContentToFile", "ls"], [["/docs"], ["/docs/z.txt", "end"], ["/docs/a.txt", "start"], ["/docs"]], [None, None, None, ["a.txt", "z.txt"]]),
    (["addContentToFile", "addContentToFile", "readContentFromFile"], [["/log.txt", "hello "], ["/log.txt", "world"], ["/log.txt"]], [None, None, "hello world"])
]
for idx, (ops, args, expected) in enumerate(cases):
    ans = fn(list(ops), [list(r) for r in args])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_reconstruct_itinerary_58: {
    functionName: 'findItinerary',
    pythonFunctionName: 'find_itinerary',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { t: [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]], expected: ["JFK","MUC","LHR","SFO","SJC"] },
        { t: [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]], expected: ["JFK","ATL","JFK","SFO","ATL","SFO"] },
        { t: [["JFK","KUL"],["KUL","JFK"]], expected: ["JFK","KUL","JFK"] },
        { t: [["JFK","NRT"],["JFK","KUL"],["KUL","JFK"]], expected: ["JFK","KUL","JFK","NRT"] }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var tCopy = cases[i].t.map(function(r){ return r.slice(); });
          var res = findItinerary(tCopy);
          if (Array.isArray(res) && res.join(',') === cases[i].expected.join(',')) {
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
fn = globals().get('find_itinerary') or globals().get('findItinerary')
assert fn is not None, "Function find_itinerary not found"
cases = [
    ([["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]], ["JFK","MUC","LHR","SFO","SJC"]),
    ([["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]], ["JFK","ATL","JFK","SFO","ATL","SFO"]),
    ([["JFK","KUL"],["KUL","JFK"]], ["JFK","KUL","JFK"]),
    ([["JFK","NRT"],["JFK","KUL"],["KUL","JFK"]], ["JFK","KUL","JFK","NRT"])
]
for idx, (t, expected) in enumerate(cases):
    ans = fn([list(r) for r in t])
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_longest_duplicate_substring_59: {
    functionName: 'longestDupSubstring',
    pythonFunctionName: 'longest_dup_substring',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { s: "banana", expected: "ana" },
        { s: "abcd", expected: "" },
        { s: "aaaaa", expected: "aaaa" },
        { s: "aa", expected: "a" }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var res = longestDupSubstring(cases[i].s);
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
fn = globals().get('longest_dup_substring') or globals().get('longestDupSubstring')
assert fn is not None, "Function longest_dup_substring not found"
cases = [
    ("banana", "ana"),
    ("abcd", ""),
    ("aaaaa", "aaaa"),
    ("aa", "a")
]
for idx, (s, expected) in enumerate(cases):
    ans = fn(s)
    assert ans == expected, f"Test case {idx+1} failed: expected {expected}, got {ans}"
`,
  },

  war_bus_routes_bfs_60: {
    functionName: 'numBusesToDestination',
    pythonFunctionName: 'num_buses_to_destination',
    totalTests: 4,
    evaluatorCode: `
      var cases = [
        { r: [[1,2,7],[3,6,7]], s: 1, t: 6, expected: 2 },
        { r: [[7,12],[4,5,15],[6],[15,19],[9,12,13]], s: 15, t: 12, expected: -1 },
        { r: [[1,2,3]], s: 2, t: 2, expected: 0 },
        { r: [[1,2,3,4]], s: 1, t: 4, expected: 1 }
      ];
      var passedCount = 0;
      for (var i = 0; i < cases.length; i++) {
        try {
          var rCopy = cases[i].r.map(function(row){ return row.slice(); });
          var res = numBusesToDestination(rCopy, cases[i].s, cases[i].t);
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
fn = globals().get('num_buses_to_destination') or globals().get('numBusesToDestination')
assert fn is not None, "Function num_buses_to_destination not found"
cases = [
    ([[1,2,7],[3,6,7]], 1, 6, 2),
    ([[7,12],[4,5,15],[6],[15,19],[9,12,13]], 15, 12, -1),
    ([[1,2,3]], 2, 2, 0),
    ([[1,2,3,4]], 1, 4, 1)
]
for idx, (r, s, t, expected) in enumerate(cases):
    ans = fn([list(row) for row in r], s, t)
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
            // Multi-Option Failover: If OS worker thread fails, fail over to direct isolated VM
            try {
              console.warn(`[codeWarsSandbox] Worker thread error (${err?.message}), failing over to direct VM isolation`);
              resolve(runEvaluationInVmDirectly(data));
            } catch (vmErr: any) {
              resolve({
                passed: false,
                status: 'RUNTIME_ERROR',
                testsPassed: 0,
                totalTests: data.totalTests,
                error: vmErr?.message || err?.message || 'Worker thread execution error',
              });
            }
          }
        });

        worker.on('exit', (code: number) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            // Multi-Option Failover: If worker exited unexpectedly, attempt direct isolated VM before failing
            if (code !== 0) {
              try {
                console.warn(`[codeWarsSandbox] Worker exited with code ${code}, failing over to direct VM isolation`);
                resolve(runEvaluationInVmDirectly(data));
                return;
              } catch {}
            }
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
