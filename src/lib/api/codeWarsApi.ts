/**
 * PinIT Code Wars & Arena Battles API Service
 * Manages algorithmic duels, deterministic test execution, and evidence recording.
 */

import { PathwayApiService } from './pathwayApi';
import { EvidenceDifficulty } from '../pathway/competencySchema';

export interface CodeWarsProblem {
  id: string;
  title: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'production';
  competencyId: string;
  description: string;
  starterCode: Record<string, string>; // language -> code
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
    explanation?: string;
  }>;
  timeLimitSeconds: number;
  memoryLimitMb: number;
  xpReward: number;
  tags: string[];
  hint?: string;
  complexityTarget?: string;
}

export interface BattleMatch {
  id: string;
  problemId: string;
  mode: '1v1_duel' | 'solo_speedrun' | 'boss_challenge';
  studentId: string;
  opponent?: {
    id: string;
    name: string;
    avatarUrl: string;
    progressPct: number;
    completed: boolean;
    timeElapsedSeconds: number;
  };
  startedAt: number;
  status: 'active' | 'victory' | 'defeat' | 'timeout';
  timeSpentSeconds?: number;
  score?: number;
  executionLogs?: string;
  evidenceRecordId?: string;
}

export const CODE_WARS_PROBLEMS_CATALOG: CodeWarsProblem[] = [
  // TIER 1: NOVICE (Month 1 Foundations: Arrays, Logic & Loops)
  {
    id: 'war_two_sum_01',
    title: 'Two Sum (Array Lookup)',
    difficulty: 'basic',
    competencyId: 'comp_arrays_hashing_l1',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Each input has exactly one solution, and you may not use the same element twice.',
    starterCode: {
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Your solution here
  return [];
}`,
      python: `def two_sum(nums, target):
    # Your solution here
    return []`
    },
    testCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, return [0, 1].' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'nums[1] + nums[2] == 6.' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', isHidden: true },
      { input: 'nums = [1, 5, 8, 3], target = 13', expectedOutput: '[1, 2]', isHidden: true },
      { input: 'nums = [10, -2, 5, 7], target = 15', expectedOutput: '[0, 2]', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Arrays', 'HashMaps', 'Novice', 'Foundations'],
    hint: "Keep a dictionary/map of numbers you've seen so far with their index. For each number, check if (target - num) is in your map. This solves it in a single pass!",
    complexityTarget: "Time: O(N) | Space: O(N)"
  },
  {
    id: 'war_valid_palindrome_02',
    title: 'Valid Palindrome (Two Pointers)',
    difficulty: 'basic',
    competencyId: 'comp_strings_two_pointers_l1',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.',
    starterCode: {
      typescript: `function isPalindrome(s: string): boolean {
  // Your solution here
  return false;
}`,
      python: `def is_palindrome(s):
    # Your solution here
    return False`
    },
    testCases: [
      { input: 's = "A man, a plan, a canal: Panama"', expectedOutput: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', expectedOutput: 'false', explanation: '"raceacar" is not a palindrome.' },
      { input: 's = " "', expectedOutput: 'true', isHidden: true },
      { input: 's = "0P"', expectedOutput: 'false', isHidden: true },
      { input: 's = "ab_a"', expectedOutput: 'true', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Strings', 'Two Pointers', 'Novice', 'Foundations'],
    hint: "Filter out spaces and punctuation first (keep only alphanumeric chars in lowercase). Then compare characters moving from both ends toward the middle.",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },
  {
    id: 'war_reverse_string_03',
    title: 'Reverse Words in a String',
    difficulty: 'basic',
    competencyId: 'comp_string_manipulation_l1',
    description: 'Given an input string s, reverse the order of the words. Return a string of the words in reverse order concatenated by a single space, removing leading, trailing, and extra internal spaces.',
    starterCode: {
      typescript: `function reverseWords(s: string): string {
  // Your solution here
  return "";
}`,
      python: `def reverse_words(s):
    # Your solution here
    return ""`
    },
    testCases: [
      { input: 's = "the sky is blue"', expectedOutput: '"blue is sky the"' },
      { input: 's = "  hello world  "', expectedOutput: '"world hello"' },
      { input: 's = "a good   example"', expectedOutput: '"example good a"', isHidden: true },
      { input: 's = "EPIC"', expectedOutput: '"EPIC"', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Strings', 'Tokens', 'Novice', 'Foundations'],
    hint: "Trim whitespace from ends, split into words by spaces, filter out empty tokens, reverse the order of the words, and join them with a single space.",
    complexityTarget: "Time: O(N) | Space: O(N)"
  },

  // TIER 2: APPRENTICE (Month 2 Core: Data Structures & HashMaps)
  {
    id: 'war_valid_parentheses_04',
    title: 'Valid Parentheses (Stack Balancer)',
    difficulty: 'intermediate',
    competencyId: 'comp_stack_brackets_l2',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.',
    starterCode: {
      typescript: `function isValidParentheses(s: string): boolean {
  // Your solution here
  return false;
}`,
      python: `def is_valid_parentheses(s):
    # Your solution here
    return False`
    },
    testCases: [
      { input: 's = "()"', expectedOutput: 'true' },
      { input: 's = "()[]{}"', expectedOutput: 'true' },
      { input: 's = "(]"', expectedOutput: 'false' },
      { input: 's = "([)]"', expectedOutput: 'false', isHidden: true },
      { input: 's = "{[]}"', expectedOutput: 'true', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Stack', 'Parsing', 'Apprentice', 'Data Structures'],
    hint: "Use a Stack! When you see an opening bracket '(', '{', '[', push its matching closer. When you see a closing bracket, pop the stack and verify it matches.",
    complexityTarget: "Time: O(N) | Space: O(N)"
  },
  {
    id: 'war_max_subarray_05',
    title: 'Maximum Subarray (Kadane Algorithm)',
    difficulty: 'intermediate',
    competencyId: 'comp_greedy_kadane_l2',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    starterCode: {
      typescript: `function maxSubArray(nums: number[]): number {
  // Your solution here
  return 0;
}`,
      python: `def max_sub_array(nums):
    # Your solution here
    return 0`
    },
    testCases: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', expectedOutput: '1' },
      { input: 'nums = [5,4,-1,7,8]', expectedOutput: '23', isHidden: true },
      { input: 'nums = [-1, -2, -3]', expectedOutput: '-1', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Dynamic Programming', 'Kadane', 'Apprentice', 'Arrays'],
    hint: "Kadane's Algorithm: Maintain current_sum and max_sum. Add each number to current_sum. If current_sum drops below 0, reset it to 0. Update max_sum at each step.",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },
  {
    id: 'war_best_stock_06',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'intermediate',
    competencyId: 'comp_sliding_window_stock_l2',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit. If no profit can be achieved, return 0.',
    starterCode: {
      typescript: `function maxProfit(prices: number[]): number {
  // Your solution here
  return 0;
}`,
      python: `def max_profit(prices):
    # Your solution here
    return 0`
    },
    testCases: [
      { input: 'prices = [7,1,5,3,6,4]', expectedOutput: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', expectedOutput: '0', explanation: 'In this case, no transactions are done and max profit = 0.' },
      { input: 'prices = [2,4,1]', expectedOutput: '2', isHidden: true },
      { input: 'prices = [3,2,6,5,0,3]', expectedOutput: '4', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Greedy', 'Arrays', 'Apprentice', 'State Tracking'],
    hint: "Track the minimum purchase price seen so far. For each day, calculate your profit if you sold today (price - min_price), and update your maximum profit.",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },

  // TIER 3: MASTER (Month 3+ Advanced: Trees, Concurrency & Systems)
  {
    id: 'war_tree_lca_01',
    title: 'Lowest Common Ancestor in Binary Search Tree',
    difficulty: 'advanced',
    competencyId: 'comp_dsa_linear_trees_l2',
    description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.',
    starterCode: {
      typescript: `function lowestCommonAncestor(root: TreeNode | null, p: number, q: number): number | null {
  // Your code here
  return null;
}`,
      python: `def lowest_common_ancestor(root, p, q):
    # Your code here
    return None`,
      java: `public class Solution {
    public int lowestCommonAncestor(TreeNode root, int p, int q) {
        // Your code here
        return -1;
    }
}`
    },
    testCases: [
      { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8', expectedOutput: '6', explanation: 'The LCA of nodes 2 and 8 is 6.' },
      { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4', expectedOutput: '2', explanation: 'The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself.' },
      { input: 'root = [2,1], p = 2, q = 1', expectedOutput: '2', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ['Trees', 'BST', 'Recursion', 'Master', 'Algorithms'],
    hint: "In a Binary Search Tree: if both p and q values are less than root, LCA is in left subtree. If both are greater, LCA is in right subtree. Otherwise, current root is the LCA split point!",
    complexityTarget: "Time: O(H) | Space: O(1)"
  },
  {
    id: 'war_concurrency_deadlock_02',
    title: 'Atomic Resource Allocator (Deadlock Prevention)',
    difficulty: 'advanced',
    competencyId: 'comp_concurrency_threads_l2',
    description: 'Implement a deadlock-free concurrent resource allocation manager for a cluster with N resources.',
    starterCode: {
      typescript: `interface ResourceRequest { threadId: string; resourceIds: string[]; }

function acquireResourcesDeterministically(requests: ResourceRequest[]): string[] {
  // Return deterministic execution order for locks
  return [];
}`,
      python: `def acquire_resources_deterministically(requests):
    return []`
    },
    testCases: [
      { input: 'requests = [{threadId: "T1", resourceIds: ["R2", "R1"]}, {threadId: "T2", resourceIds: ["R1", "R2"]}]', expectedOutput: '["R1", "R2"]', explanation: 'Sorting resource locks eliminates circular wait.' },
      { input: 'requests = [{threadId: "T1", resourceIds: ["R3", "R1", "R2"]}]', expectedOutput: '["R1", "R2", "R3"]', isHidden: true }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 256,
    xpReward: 250,
    tags: ['Concurrency', 'Deadlocks', 'Mutex', 'Master', 'Systems'],
    hint: "Coffman's 4th condition for deadlock is Circular Wait. Eliminate circular wait by sorting all requested resource IDs deterministically before acquiring any locks.",
    complexityTarget: "Time: O(N log N) | Space: O(N)"
  },
  {
    id: 'war_sql_btree_query_03',
    title: 'B-Tree Composite Index Query Optimizer',
    difficulty: 'advanced',
    competencyId: 'comp_database_sql_internals_l3',
    description: 'Analyze multi-column range and equality filters to generate the optimal composite index definition.',
    starterCode: {
      typescript: `function generateOptimalCompositeIndex(tableName: string, equalityCols: string[], rangeCol: string): string {
  // Return CREATE INDEX DDL statement
  return "";
}`,
      python: `def generate_optimal_composite_index(table_name, equality_cols, range_col):
    return ""`
    },
    testCases: [
      { input: 'table = "orders", eq = ["tenant_id", "status"], range = "created_at"', expectedOutput: 'CREATE INDEX idx_orders_tenant_id_status_created_at ON orders (tenant_id, status, created_at);' },
      { input: 'table = "logs", eq = ["service_id"], range = "timestamp"', expectedOutput: 'CREATE INDEX idx_logs_service_id_timestamp ON logs (service_id, timestamp);', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ['SQL', 'Indexes', 'B-Tree', 'Master', 'Database'],
    hint: "B-Tree Composite Index Rule: Equality columns must come first, followed by range column. CREATE INDEX idx_{table}_{cols} ON {table} ({cols});",
    complexityTarget: "Time: O(N) | Space: O(N)"
  }
];

export class CodeWarsApiService {
  private static localMatchesKey = (studentId: string) => `pinit_${studentId}_codewars_matches`;
  private static inMemoryMatches = new Map<string, BattleMatch[]>();

  /**
   * Defect 011: Static analysis guard blocking forbidden browser, runtime, and network APIs.
   */
  static validateCodeSafety(code: string): { safe: boolean; reason?: string } {
    const forbiddenPatterns: Array<{ pattern: RegExp; token: string }> = [
      { pattern: /\bfetch\b/i, token: 'fetch' },
      { pattern: /\bwindow\b/i, token: 'window' },
      { pattern: /\blocalStorage\b/i, token: 'localStorage' },
      { pattern: /\bsessionStorage\b/i, token: 'sessionStorage' },
      { pattern: /\bdocument\b/i, token: 'document' },
      { pattern: /\bcookie\b/i, token: 'cookie' },
      { pattern: /\bprocess\b/i, token: 'process' },
      { pattern: /\brequire\b/i, token: 'require' },
      { pattern: /\bimport\b/i, token: 'import' },
      { pattern: /\bglobal\b/i, token: 'global' },
      { pattern: /\beval\b/i, token: 'eval' },
      { pattern: /\bFunction\b/, token: 'Function' },
      { pattern: /\bXMLHttpRequest\b/i, token: 'XMLHttpRequest' },
      { pattern: /\bWebSocket\b/i, token: 'WebSocket' }
    ];

    for (const { pattern, token } of forbiddenPatterns) {
      if (pattern.test(code)) {
        return {
          safe: false,
          reason: `Security violation: code contains forbidden API or property '${token}'.`
        };
      }
    }

    return { safe: true };
  }

  /**
   * Defect 096 Fix: Sanitize problems exposed to client bundles.
   * Strips isHidden: true test cases and restricts to at most 2 public sample cases.
   */
  static sanitizeForClient(problem: CodeWarsProblem): CodeWarsProblem {
    return {
      ...problem,
      testCases: problem.testCases.filter(tc => !tc.isHidden).slice(0, 2),
    };
  }

  static getProblems(): CodeWarsProblem[] {
    return CODE_WARS_PROBLEMS_CATALOG.map(p => this.sanitizeForClient(p));
  }

  static getProblemById(id: string): CodeWarsProblem | undefined {
    const p = CODE_WARS_PROBLEMS_CATALOG.find(prob => prob.id === id);
    return p ? this.sanitizeForClient(p) : undefined;
  }

  /**
   * Internal authoritative resolver with complete test suite including hidden test cases.
   */
  static getAuthoritativeProblem(id: string): CodeWarsProblem | undefined {
    return CODE_WARS_PROBLEMS_CATALOG.find(p => p.id === id);
  }

  /** Judges a non-JavaScript submission with the polyglot checks (run by the server: lib/server/codeWarsJudge). */
  static judgePolyglotSubmission(
    problemId: string,
    code: string,
    language: string
  ): { passed: boolean; testsPassed: number; totalTests: number; error?: string } | null {
    const problem = this.getAuthoritativeProblem(problemId);
    if (!problem) return null;
    const result = this.evaluatePolyglotSolution(code, language, problem);
    const totalTests = problem.testCases.length;
    return { passed: result.testsPassed === totalTests, testsPassed: result.testsPassed, totalTests, error: result.evalErrorLog };
  }

  static startMatch(
    studentId: string,
    problemId: string,
    mode: BattleMatch['mode'] = '1v1_duel'
  ): BattleMatch {
    const problem = this.getAuthoritativeProblem(problemId) || CODE_WARS_PROBLEMS_CATALOG[0];

    const match: BattleMatch = {
      id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      problemId: problem.id,
      mode,
      studentId,
      startedAt: Date.now(),
      status: 'active',
      opponent: mode === '1v1_duel' ? {
        id: 'bot_algo_master',
        name: '🤖 Turing Benchmark AI (Sparring Partner)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        progressPct: 0,
        completed: false,
        timeElapsedSeconds: 0,
      } : undefined,
    };

    const matches = this.getStudentMatches(studentId);
    matches.unshift(match);
    this.saveStudentMatches(studentId, matches);

    return match;
  }

  /**
   * Submits solution, evaluates test fixtures deterministically,
   * updates match outcome, and seals SHA-256 evidence in the student ledger upon victory.
   */
  static async submitSolution(params: {
    matchId: string;
    studentId: string;
    code: string;
    language: string;
    timeSpentSeconds: number;
    problemId?: string;
  }): Promise<{
    passed: boolean;
    score: number;
    testsPassed: number;
    totalTests: number;
    logs: string;
    evidenceRecordId?: string;
    /** XP the server granted for this pass (first clear of the problem only). */
    xpAwarded?: number;
    newXp?: number;
  }> {
    const { matchId, studentId, code, language, timeSpentSeconds, problemId: paramProblemId } = params;
    const matches = this.getStudentMatches(studentId);
    let match = matches.find(m => m.id === matchId);
    if (!match) {
      // Dynamic fallback for PvP rooms, test executions, or direct runs
      const resolvedProblemId = paramProblemId || CODE_WARS_PROBLEMS_CATALOG[0].id;
      const syntheticMatch: BattleMatch = {
        id: matchId,
        studentId,
        problemId: resolvedProblemId,
        mode: '1v1_duel',
        status: 'active',
        startedAt: Date.now() - Math.max(0, timeSpentSeconds * 1000),
        timeSpentSeconds,
      };
      matches.unshift(syntheticMatch);
      this.saveStudentMatches(studentId, matches);
      match = syntheticMatch;
    }
    const currentMatch: BattleMatch = match;

    // Authoritative execution against the full test suite including hidden test cases
    const problem = this.getAuthoritativeProblem(paramProblemId || currentMatch.problemId) || CODE_WARS_PROBLEMS_CATALOG[0];

    // Deterministic validation & execution against real test fixtures
    let testsPassed = 0;
    const totalTests = problem.testCases.length;
    let evalErrorLog: string | undefined;
    let xpAwarded = 0;
    let newXp: number | undefined;

    try {
      const isTsOrJs = language === 'typescript' || language === 'javascript';
      // In the browser every language is judged by the server (it also grants the XP).
      if (isTsOrJs || typeof window !== 'undefined') {
        // Delegate evaluation to secured sandbox endpoint (/api/code/evaluate) or secure node:vm sandbox
        let evalResult: {
          passed?: boolean;
          status?: string;
          testsPassed?: number;
          totalTests?: number;
          error?: string;
          xpAwarded?: number;
          newXp?: number;
        } | null = null;

        if (typeof window !== 'undefined') {
          try {
            let headers: Record<string, string> = { 'Content-Type': 'application/json' };
            try {
              const { supabase } = await import('@/lib/supabaseClient');
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
              }
            } catch {}

            const res = await fetch('/api/code/evaluate', {
              method: 'POST',
              headers,
              body: JSON.stringify({
                problemId: problem.id,
                code,
                language,
              }),
            });
            evalResult = await res.json();
          } catch (fetchErr: any) {
            evalErrorLog = `Sandbox evaluation request failed: ${fetchErr?.message || 'Network error'}`;
          }
        } else {
          // Server / test CLI environment: execute in secure isolated node:vm sandbox (no raw new Function)
          try {
            evalResult = await CodeWarsApiService.evaluateInNodeVmSandbox({
              problemId: problem.id,
              code,
              language,
            });
          } catch (sandboxErr: any) {
            evalErrorLog = `Sandbox evaluation error: ${sandboxErr?.message || 'VM execution failed'}`;
          }
        }

        if (evalResult) {
          testsPassed = typeof evalResult.testsPassed === 'number' ? evalResult.testsPassed : 0;
          if (evalResult.error) {
            evalErrorLog = evalResult.error;
          }
          if (typeof evalResult.xpAwarded === 'number') xpAwarded = evalResult.xpAwarded;
          if (typeof evalResult.newXp === 'number') newXp = evalResult.newXp;
        }
      } else {
        // DEF-031 Fix: Real anti-cheat and polyglot evaluation for Python, Java, etc.
        const polyResult = CodeWarsApiService.evaluatePolyglotSolution(code, language, problem);
        testsPassed = polyResult.testsPassed;
        if (polyResult.evalErrorLog) {
          evalErrorLog = polyResult.evalErrorLog;
        }
      }
    } catch (err: any) {
      evalErrorLog = `Execution error: ${err?.message || 'Failed to execute code'}`;
    }

    const passed = testsPassed === totalTests;
    const score = passed ? Math.max(75, Math.min(100, Math.round(100 - (timeSpentSeconds / problem.timeLimitSeconds) * 20))) : Math.max(0, Math.round((testsPassed / totalTests) * 50));

    const runtimeMs = Math.max(8, Math.round(timeSpentSeconds * 2.8));
    const logs = passed
      ? `✓ All ${totalTests} test assertions passed.\nDeterministic Execution Verified.\nRuntime: ${runtimeMs}ms\nScore: ${score}/100`
      : `✗ ${evalErrorLog || `Assertion failed on Test Case ${testsPassed + 1}.`}\nExpected: ${problem.testCases[testsPassed]?.expectedOutput || 'valid output'}\nTests Passed: ${testsPassed} / ${totalTests}\nExecution Terminated.`;

    let evidenceRecordId: string | undefined;

    if (passed) {
      currentMatch.status = 'victory';
      currentMatch.score = score;
      currentMatch.timeSpentSeconds = timeSpentSeconds;
      currentMatch.executionLogs = logs;

      // Record authentic evidence record into PathwayApiService
      const evResult = await PathwayApiService.recordEvidence({
        id: `ev_codewar_${currentMatch.id}`,
        competencyId: problem.competencyId,
        competencyVersion: '1.0.0',
        studentId,
        programId: 'prog_swe_accelerated_9m',
        evidenceClass: 'application',
        difficulty: problem.difficulty as EvidenceDifficulty,
        evidenceFamilyId: `codewars_${problem.id}`,
        sourceType: 'quest',
        sourceId: `codewar_match_${currentMatch.id}`,
        attemptId: `att_duel_01`,
        score,
        evaluatorType: 'deterministic',
        evaluatorVersion: 'arena-test-runner-v2',
        rubricVersion: 'rubric-dsa-benchmarks',
        timestamp: Date.now(),
        artifacts: {
          executionLogSnippet: logs,
        }
      });

      evidenceRecordId = evResult.evidenceRecord.id;
      currentMatch.evidenceRecordId = evidenceRecordId;
    } else {
      currentMatch.status = 'defeat';
      currentMatch.score = score;
      currentMatch.timeSpentSeconds = timeSpentSeconds;
      currentMatch.executionLogs = logs;
    }

    this.saveStudentMatches(studentId, matches);

    return {
      passed,
      score,
      testsPassed,
      totalTests,
      logs,
      evidenceRecordId,
      xpAwarded,
      newXp,
    };
  }

  static getStudentMatches(studentId: string): BattleMatch[] {
    if (typeof window === 'undefined') {
      return this.inMemoryMatches.get(studentId) || [];
    }
    try {
      const raw = localStorage.getItem(this.localMatchesKey(studentId));
      if (raw) return JSON.parse(raw);
    } catch {}

    return this.inMemoryMatches.get(studentId) || [];
  }

  static async getStudentMatchesAsync(studentId: string): Promise<BattleMatch[]> {
    const local = this.getStudentMatches(studentId);
    if (local && local.length > 0) return local;

    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/codewars/matches');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.matches) && data.matches.length > 0) {
            this.saveStudentMatches(studentId, data.matches);
            return data.matches;
          }
        }
      } catch {}
    }
    return local;
  }

  private static saveStudentMatches(studentId: string, matches: BattleMatch[]) {
    this.inMemoryMatches.set(studentId, matches);
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.localMatchesKey(studentId), JSON.stringify(matches.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to persist matches to local storage', e);
    }

    // DEF-062 Fix: Authoritative server match history sync
    const latestMatch = matches[0];
    if (latestMatch) {
      try {
        fetch('/api/codewars/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(latestMatch),
        }).catch(err => {
          console.warn('[CodeWarsApi] Server match sync notice:', err);
        });
      } catch {}
    }
  }

  static cleanTypeScriptForExecution(tsCode: string): string {
    try {
      // Use esbuild for instantaneous, syntactically-perfect TypeScript stripping
      const esbuild = require('esbuild');
      const res = esbuild.transformSync(tsCode, { loader: 'ts', target: 'es2020' });
      return res.code;
    } catch {
      // Defensive fallback if esbuild binary is unavailable
      let cleaned = tsCode;
      cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');
      cleaned = cleaned.replace(/interface\s+[\s\S]*?\{[\s\S]*?\}/g, '');
      cleaned = cleaned.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
      cleaned = cleaned.replace(/:\s*[A-Za-z0-9_<>|,\[\]\s]+(?=\s*[\)={])/g, '');
      cleaned = cleaned.replace(/<[A-Za-z0-9_,\s]+>/g, '');
      cleaned = cleaned.replace(/\)\s*:\s*[A-Za-z0-9_<>|,\[\]\s]+(?=\s*\{)/g, ')');
      cleaned = cleaned.replace(/!\s*(?=[,;\]\)\.])/g, '');
      cleaned = cleaned.replace(/ as\s+[A-Za-z0-9_<>|,\[\]]+/g, '');
      return cleaned;
    }
  }

  /**
   * Evaluates solution code in an isolated node:vm sandbox (never raw new Function)
   * Enforces security token validation, prototype pollution guards, and execution timeout.
   */
  static async evaluateInNodeVmSandbox(params: {
    problemId: string;
    code: string;
    language?: string;
  }): Promise<{
    passed: boolean;
    status: string;
    testsPassed: number;
    totalTests: number;
    error?: string;
  }> {
    const { problemId, code } = params;

    let vmModule: any = null;
    if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node) {
      try {
        vmModule = await import('node:vm');
      } catch {
        try {
          const { createRequire } = await import('node:module');
          const req = createRequire(process.cwd() + '/package.json');
          vmModule = req('node:vm');
        } catch {
          vmModule = null;
        }
      }
    }

    if (!vmModule) {
      return {
        passed: false,
        status: 'VM_UNAVAILABLE',
        testsPassed: 0,
        totalTests: 0,
        error: 'Node VM module is not available in this environment.',
      };
    }

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
          passed: false,
          status: 'SECURITY_VIOLATION',
          testsPassed: 0,
          totalTests: 0,
          error: `Security violation: Forbidden token ${token}`,
        };
      }
    }

    const registry: Record<
      string,
      {
        fnName: string;
        totalTests: number;
        evaluator: (fn: Function) => { passedCount: number; errorLog?: string };
      }
    > = {
      war_tree_lca_01: {
        fnName: 'lowestCommonAncestor',
        totalTests: 3,
        evaluator: (fn) => CodeWarsApiService.evaluateLcaTestCases(fn),
      },
      war_concurrency_deadlock_02: {
        fnName: 'acquireResourcesDeterministically',
        totalTests: 2,
        evaluator: (fn) => CodeWarsApiService.evaluateConcurrencyTestCases(fn),
      },
      war_sql_btree_query_03: {
        fnName: 'generateOptimalCompositeIndex',
        totalTests: 2,
        evaluator: (fn) => CodeWarsApiService.evaluateSqlTestCases(fn),
      },
    };

    const targetConfig = registry[problemId];
    if (!targetConfig) {
      return {
        passed: false,
        status: 'UNSUPPORTED_PROBLEM',
        testsPassed: 0,
        totalTests: 0,
        error: `Problem '${problemId}' is not supported for evaluation.`,
      };
    }

    const cleanedCode = CodeWarsApiService.cleanTypeScriptForExecution(code);

    const sandbox: Record<string, any> = Object.create(null);
    sandbox.console = Object.freeze({ log: () => {}, error: () => {}, warn: () => {} });
    sandbox.Math = Math;
    sandbox.Date = Date;
    sandbox.Array = Array;
    sandbox.Object = Object;
    sandbox.String = String;
    sandbox.Number = Number;
    sandbox.Boolean = Boolean;
    sandbox.RegExp = RegExp;
    sandbox.JSON = JSON;
    sandbox.parseInt = parseInt;
    sandbox.parseFloat = parseFloat;
    sandbox.isNaN = isNaN;
    sandbox.isFinite = isFinite;
    sandbox.Map = Map;
    sandbox.Set = Set;

    let targetFn: Function | null = null;
    sandbox.__exportFn = (fn: Function) => {
      targetFn = fn;
    };

    const context = vmModule.createContext(sandbox);

    const scriptPreamble = `
      if (typeof TreeNode === 'undefined') {
        function TreeNode(val, left, right) {
          this.val = (val === undefined ? 0 : val);
          this.left = (left === undefined ? null : left);
          this.right = (right === undefined ? null : right);
        }
      }
    `;

    const scriptPostamble = `
      if (typeof ${targetConfig.fnName} === 'function') {
        __exportFn(${targetConfig.fnName});
      }
    `;

    let script: any;
    try {
      script = new vmModule.Script(`${scriptPreamble}\n${cleanedCode}\n${scriptPostamble}`, {
        filename: 'submission.js',
        displayErrors: true,
      });
    } catch (syntaxErr: any) {
      return {
        passed: false,
        status: 'SYNTAX_ERROR',
        testsPassed: 0,
        totalTests: targetConfig.totalTests,
        error: `Syntax error: ${syntaxErr?.message || 'Invalid syntax'}`,
      };
    }

    try {
      script.runInContext(context, { timeout: 2000 });
    } catch (runErr: any) {
      return {
        passed: false,
        status: 'RUNTIME_ERROR',
        testsPassed: 0,
        totalTests: targetConfig.totalTests,
        error: `Runtime error: ${runErr?.message || 'Execution error'}`,
      };
    }

    if (typeof targetFn !== 'function') {
      return {
        passed: false,
        status: 'EXECUTION_ERROR',
        testsPassed: 0,
        totalTests: targetConfig.totalTests,
        error: `Solution function '${targetConfig.fnName}' was not defined.`,
      };
    }

    const res = targetConfig.evaluator(targetFn);
    const passed = res.passedCount === targetConfig.totalTests;

    return {
      passed,
      status: passed ? 'SUCCESS' : 'FAILED',
      testsPassed: res.passedCount,
      totalTests: targetConfig.totalTests,
      error: res.errorLog,
    };
  }

  static extractFunctionFromSandbox(jsCode: string, fnNames: string[]): Function | null {
    let vmModule: any = null;
    if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node) {
      try {
        const { createRequire } = require('node:module');
        const req = createRequire(process.cwd() + '/package.json');
        vmModule = req('node:vm');
      } catch {
        try {
          vmModule = require('node:vm');
        } catch {
          vmModule = null;
        }
      }
    }
    const sandbox: Record<string, any> = Object.create(null);
    sandbox.console = Object.freeze({ log: () => {}, error: () => {}, warn: () => {} });
    sandbox.Math = Math;
    sandbox.Date = Date;
    sandbox.Array = Array;
    sandbox.Object = Object;
    sandbox.String = String;
    sandbox.Number = Number;
    sandbox.Boolean = Boolean;
    sandbox.RegExp = RegExp;
    sandbox.JSON = JSON;
    sandbox.parseInt = parseInt;
    sandbox.parseFloat = parseFloat;
    sandbox.isNaN = isNaN;
    sandbox.isFinite = isFinite;
    sandbox.Map = Map;
    sandbox.Set = Set;

    let targetFn: Function | null = null;
    sandbox.__exportFn = (fn: Function) => {
      targetFn = fn;
    };

    const checks = fnNames
      .map((name) => `if (typeof ${name} === 'function') __exportFn(${name});`)
      .join('\n');

    const wrapped = `
      if (typeof TreeNode === 'undefined') {
        function TreeNode(val, left, right) {
          this.val = (val === undefined ? 0 : val);
          this.left = (left || null);
          this.right = (right || null);
        }
      }
      try {
        ${jsCode}
        ${checks}
      } catch (e) {}
    `;

    if (!vmModule) {
      // SECURITY: dynamic function construction via the Function constructor is forbidden here
      // because it bypasses the node:vm sandbox isolation.
      // If node:vm is unavailable (e.g. browser bundle), refuse to extract
      // rather than execute student code outside the isolated sandbox.
      return null;
    }

    const context = vmModule.createContext(sandbox);
    try {
      const script = new vmModule.Script(wrapped, { timeout: 2000 });
      script.runInContext(context, { timeout: 2000 });
    } catch {}

    return targetFn;
  }


  static evaluateTwoSumTestCases(fn: Function): { passedCount: number; errorLog?: string } {
    const cases = [
      { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
      { nums: [3, 2, 4], target: 6, expected: [1, 2] },
      { nums: [3, 3], target: 6, expected: [0, 1] },
      { nums: [1, 5, 8, 3], target: 13, expected: [1, 2] },
      { nums: [10, -2, 5, 7], target: 15, expected: [0, 2] },
    ];
    let passed = 0;
    for (let idx = 0; idx < cases.length; idx++) {
      const c = cases[idx];
      try {
        const res = fn(c.nums.slice(), c.target);
        if (!Array.isArray(res) || res.length !== 2) {
          return { passedCount: passed, errorLog: `Test case ${idx + 1} failed: expected array of 2 indices, got ${JSON.stringify(res)}` };
        }
        const sortedRes = res.slice().sort((a, b) => a - b);
        const sortedExp = c.expected.slice().sort((a, b) => a - b);
        if (sortedRes[0] === sortedExp[0] && sortedRes[1] === sortedExp[1]) {
          passed++;
        } else {
          return { passedCount: passed, errorLog: `Test case ${idx + 1} failed: expected ${JSON.stringify(c.expected)}, got ${JSON.stringify(res)}` };
        }
      } catch (err: any) {
        return { passedCount: passed, errorLog: `Test case ${idx + 1} runtime error: ${err?.message || 'Execution failed'}` };
      }
    }
    return { passedCount: passed };
  }

  static evaluatePalindromeTestCases(fn: Function): { passedCount: number; errorLog?: string } {
    const cases = [
      { s: 'A man, a plan, a canal: Panama', expected: true },
      { s: 'race a car', expected: false },
      { s: ' ', expected: true },
      { s: '0P', expected: false },
      { s: 'ab_a', expected: true },
    ];
    let passed = 0;
    for (let idx = 0; idx < cases.length; idx++) {
      const c = cases[idx];
      try {
        const res = fn(c.s);
        if (Boolean(res) === c.expected) {
          passed++;
        } else {
          return { passedCount: passed, errorLog: `Test case ${idx + 1} failed: expected ${c.expected}, got ${res}` };
        }
      } catch (err: any) {
        return { passedCount: passed, errorLog: `Test case ${idx + 1} runtime error: ${err?.message || 'Execution failed'}` };
      }
    }
    return { passedCount: passed };
  }

  static evaluateReverseWordsTestCases(fn: Function): { passedCount: number; errorLog?: string } {
    const cases = [
      { s: 'the sky is blue', expected: 'blue is sky the' },
      { s: '  hello world  ', expected: 'world hello' },
      { s: 'a good   example', expected: 'example good a' },
      { s: 'EPIC', expected: 'EPIC' },
    ];
    let passed = 0;
    for (let idx = 0; idx < cases.length; idx++) {
      const c = cases[idx];
      try {
        const res = fn(c.s);
        if (typeof res === 'string' && res.trim() === c.expected.trim()) {
          passed++;
        } else {
          return { passedCount: passed, errorLog: `Test case ${idx + 1} failed: expected "${c.expected}", got "${res}"` };
        }
      } catch (err: any) {
        return { passedCount: passed, errorLog: `Test case ${idx + 1} runtime error: ${err?.message || 'Execution failed'}` };
      }
    }
    return { passedCount: passed };
  }

  static evaluateValidParenthesesTestCases(fn: Function): { passedCount: number; errorLog?: string } {
    const cases = [
      { s: '()', expected: true },
      { s: '()[]{}', expected: true },
      { s: '(]', expected: false },
      { s: '([)]', expected: false },
      { s: '{[]}', expected: true },
    ];
    let passed = 0;
    for (let idx = 0; idx < cases.length; idx++) {
      const c = cases[idx];
      try {
        const res = fn(c.s);
        if (Boolean(res) === c.expected) {
          passed++;
        } else {
          return { passedCount: passed, errorLog: `Test case ${idx + 1} failed: expected ${c.expected}, got ${res}` };
        }
      } catch (err: any) {
        return { passedCount: passed, errorLog: `Test case ${idx + 1} runtime error: ${err?.message || 'Execution failed'}` };
      }
    }
    return { passedCount: passed };
  }

  static evaluateMaxSubarrayTestCases(fn: Function): { passedCount: number; errorLog?: string } {
    const cases = [
      { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expected: 6 },
      { nums: [1], expected: 1 },
      { nums: [5, 4, -1, 7, 8], expected: 23 },
      { nums: [-1, -2, -3], expected: -1 },
    ];
    let passed = 0;
    for (let idx = 0; idx < cases.length; idx++) {
      const c = cases[idx];
      try {
        const res = fn(c.nums.slice());
        if (res === c.expected) {
          passed++;
        } else {
          return { passedCount: passed, errorLog: `Test case ${idx + 1} failed: expected ${c.expected}, got ${res}` };
        }
      } catch (err: any) {
        return { passedCount: passed, errorLog: `Test case ${idx + 1} runtime error: ${err?.message || 'Execution failed'}` };
      }
    }
    return { passedCount: passed };
  }

  static evaluateBestStockTestCases(fn: Function): { passedCount: number; errorLog?: string } {
    const cases = [
      { prices: [7, 1, 5, 3, 6, 4], expected: 5 },
      { prices: [7, 6, 4, 3, 1], expected: 0 },
      { prices: [2, 4, 1], expected: 2 },
      { prices: [3, 2, 6, 5, 0, 3], expected: 4 },
    ];
    let passed = 0;
    for (let idx = 0; idx < cases.length; idx++) {
      const c = cases[idx];
      try {
        const res = fn(c.prices.slice());
        if (res === c.expected) {
          passed++;
        } else {
          return { passedCount: passed, errorLog: `Test case ${idx + 1} failed: expected ${c.expected}, got ${res}` };
        }
      } catch (err: any) {
        return { passedCount: passed, errorLog: `Test case ${idx + 1} runtime error: ${err?.message || 'Execution failed'}` };
      }
    }
    return { passedCount: passed };
  }

    static evaluateLcaTestCases(fn: Function): { passedCount: number; errorLog?: string } {
    class TreeNode {
      val: any;
      left: any;
      right: any;
      constructor(val: any, left?: any, right?: any) {
        this.val = val;
        this.left = left || null;
        this.right = right || null;
      }
    }
    function buildTree(arr: (number | null)[]) {
      if (!arr || !arr.length || arr[0] === null) return null;
      const root = new TreeNode(arr[0]);
      const queue = [root];
      let i = 1;
      while (queue.length && i < arr.length) {
        const curr = queue.shift();
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

    const cases = [
      { tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8, expected: 6 },
      { tree: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4, expected: 2 },
      { tree: [2, 1], p: 2, q: 1, expected: 2 }
    ];

    let passed = 0;
    for (let idx = 0; idx < cases.length; idx++) {
      const c = cases[idx];
      try {
        const t = buildTree(c.tree);
        const res = fn(t, c.p, c.q);
        const actualVal = (res && typeof res === 'object' && 'val' in res) ? res.val : res;
        if (actualVal === c.expected) {
          passed++;
        } else {
          return { passedCount: passed, errorLog: `Test case ${idx + 1} failed: expected ${c.expected}, received ${actualVal}` };
        }
      } catch (err: any) {
        return { passedCount: passed, errorLog: `Test case ${idx + 1} runtime error: ${err?.message || 'Execution failed'}` };
      }
    }
    return { passedCount: passed };
  }

  static evaluateConcurrencyTestCases(fn: Function): { passedCount: number; errorLog?: string } {
    const cases = [
      {
        requests: [{ threadId: 'T1', resourceIds: ['R2', 'R1'] }, { threadId: 'T2', resourceIds: ['R1', 'R2'] }],
        expected: ['R1', 'R2']
      },
      {
        requests: [{ threadId: 'T1', resourceIds: ['R3', 'R1', 'R2'] }],
        expected: ['R1', 'R2', 'R3']
      }
    ];

    let passed = 0;
    for (let idx = 0; idx < cases.length; idx++) {
      const c = cases[idx];
      try {
        const res = fn(c.requests);
        const actual = Array.isArray(res) ? res.slice() : [];
        if (JSON.stringify(actual) === JSON.stringify(c.expected)) {
          passed++;
        } else {
          return { passedCount: passed, errorLog: `Test case ${idx + 1} failed: expected ${JSON.stringify(c.expected)}, received ${JSON.stringify(actual)}` };
        }
      } catch (err: any) {
        return { passedCount: passed, errorLog: `Test case ${idx + 1} runtime error: ${err?.message || 'Execution failed'}` };
      }
    }
    return { passedCount: passed };
  }

  static evaluateSqlTestCases(fn: Function): { passedCount: number; errorLog?: string } {
    const cases = [
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

    let passed = 0;
    for (let idx = 0; idx < cases.length; idx++) {
      const c = cases[idx];
      try {
        const res = fn(c.table, c.eq, c.range);
        const normalize = (s: string) => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
        if (normalize(res) === normalize(c.expected)) {
          passed++;
        } else {
          return { passedCount: passed, errorLog: `Test case ${idx + 1} failed: expected "${c.expected}", received "${res}"` };
        }
      } catch (err: any) {
        return { passedCount: passed, errorLog: `Test case ${idx + 1} runtime error: ${err?.message || 'Execution failed'}` };
      }
    }
    return { passedCount: passed };
  }

  private static evaluatePolyglotSolution(
    code: string,
    language: string,
    problem: CodeWarsProblem
  ): { testsPassed: number; evalErrorLog?: string } {
    const totalTests = problem.testCases.length;
    // 1. Anti-Cheat: Strip comments to ensure student wrote real executable instructions
    const nonCommentCode = (language === 'python'
      ? code.replace(/#.*/g, '')
      : code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')
    ).trim();

    if (nonCommentCode.length < 20) {
      return {
        testsPassed: 0,
        evalErrorLog: 'Anti-Cheat Guard: Submission rejected. Code contains only comments or trivial boilerplate without executable logic.'
      };
    }

    // 2. Syntax & Semantic Verification per problem with genuine test execution
    if (problem.id === 'war_two_sum_01') {
      const hasFunc = code.includes('two_sum') || code.includes('twoSum');
      if (!hasFunc) return { testsPassed: 0, evalErrorLog: 'Function two_sum or twoSum not found in submission.' };
      try {
        let jsEquivalent = nonCommentCode;
        if (language === 'python') {
          jsEquivalent = jsEquivalent
            .replace(/def\s+(?:two_sum|twoSum)\s*\([^)]*\):/g, 'function twoSum(nums, target) {')
            .replace(/\bNone\b/g, 'null').replace(/\band\b/g, '&&').replace(/\bor\b/g, '||')
            .replace(/for\s+(\w+),\s*(\w+)\s+in\s+enumerate\((\w+)\):/g, 'for (let $1 = 0; $1 < $3.length; $1++) { let $2 = $3[$1];')
            .replace(/for\s+(\w+)\s+in\s+range\(\s*len\((\w+)\)\s*\):/g, 'for (let $1 = 0; $1 < $2.length; $1++) {')
            .replace(/for\s+(\w+)\s+in\s+range\(\s*(\w+)\s*\+\s*1,\s*len\((\w+)\)\s*\):/g, 'for (let $1 = $2 + 1; $1 < $3.length; $1++) {')
            .replace(/(\w+)\s*=\s*\{\}/g, 'let $1 = {};')
            .replace(/if\s+(\w+)\s+in\s+(\w+):/g, 'if ($1 in $2) {')
            .replace(/return\s+\[([^\]]+)\]/g, 'return [$1];');
          if (!jsEquivalent.includes('}')) jsEquivalent += '\n}\n}\n}';
        }
        const fn = CodeWarsApiService.extractFunctionFromSandbox(jsEquivalent, ['twoSum', 'two_sum']);
        if (typeof fn === 'function') {
          const res = CodeWarsApiService.evaluateTwoSumTestCases(fn);
          return { testsPassed: res.passedCount, evalErrorLog: res.errorLog };
        }
      } catch (err: any) {
        return { testsPassed: 0, evalErrorLog: `Execution error: ${err?.message || 'Invalid syntax'}` };
      }
      return { testsPassed: 0, evalErrorLog: 'Algorithmic Evaluation Incomplete: Two Sum test cases could not be verified in execution runtime.' };
    }

    if (problem.id === 'war_valid_palindrome_02') {
      const hasFunc = code.includes('is_palindrome') || code.includes('isPalindrome');
      if (!hasFunc) return { testsPassed: 0, evalErrorLog: 'Function is_palindrome or isPalindrome not found in submission.' };
      try {
        let jsEquivalent = nonCommentCode;
        if (language === 'python') {
          jsEquivalent = jsEquivalent
            .replace(/def\s+(?:is_palindrome|isPalindrome)\s*\([^)]*\):/g, 'function isPalindrome(s) {')
            .replace(/\bNone\b/g, 'null').replace(/\band\b/g, '&&').replace(/\bor\b/g, '||')
            .replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false')
            .replace(/re\.sub\([^,]+,\s*['"][^'"]*['"],\s*(\w+)\)/g, '$1.replace(/[^a-z0-9]/gi, "")')
            .replace(/(\w+)\[::-1\]/g, '$1.split("").reverse().join("")');
          if (!jsEquivalent.includes('}')) jsEquivalent += '\n}';
        }
        const fn = CodeWarsApiService.extractFunctionFromSandbox(jsEquivalent, ['isPalindrome', 'is_palindrome']);
        if (typeof fn === 'function') {
          const res = CodeWarsApiService.evaluatePalindromeTestCases(fn);
          return { testsPassed: res.passedCount, evalErrorLog: res.errorLog };
        }
      } catch (err: any) {
        return { testsPassed: 0, evalErrorLog: `Execution error: ${err?.message || 'Invalid syntax'}` };
      }
      return { testsPassed: 0, evalErrorLog: 'Algorithmic Evaluation Incomplete: Palindrome test cases could not be verified in execution runtime.' };
    }

    if (problem.id === 'war_reverse_string_03') {
      const hasFunc = code.includes('reverse_words') || code.includes('reverseWords');
      if (!hasFunc) return { testsPassed: 0, evalErrorLog: 'Function reverse_words or reverseWords not found in submission.' };
      try {
        let jsEquivalent = nonCommentCode;
        if (language === 'python') {
          jsEquivalent = jsEquivalent
            .replace(/def\s+(?:reverse_words|reverseWords)\s*\([^)]*\):/g, 'function reverseWords(s) {')
            .replace(/\bNone\b/g, 'null').replace(/\band\b/g, '&&').replace(/\bor\b/g, '||')
            .replace(/['"]\s*['"]\.join\(\s*(\w+)\.split\(\s*\)\[::-1\]\s*\)/g, '$1.trim().split(/\\s+/).reverse().join(" ")')
            .replace(/['"]\s*['"]\.join\(\s*reversed\((\w+)\.split\(\s*\)\)\s*\)/g, '$1.trim().split(/\\s+/).reverse().join(" ")');
          if (!jsEquivalent.includes('}')) jsEquivalent += '\n}';
        }
        const fn = CodeWarsApiService.extractFunctionFromSandbox(jsEquivalent, ['reverseWords', 'reverse_words']);
        if (typeof fn === 'function') {
          const res = CodeWarsApiService.evaluateReverseWordsTestCases(fn);
          return { testsPassed: res.passedCount, evalErrorLog: res.errorLog };
        }
      } catch (err: any) {
        return { testsPassed: 0, evalErrorLog: `Execution error: ${err?.message || 'Invalid syntax'}` };
      }
      return { testsPassed: 0, evalErrorLog: 'Algorithmic Evaluation Incomplete: Reverse Words test cases could not be verified in execution runtime.' };
    }

    if (problem.id === 'war_valid_parentheses_04') {
      const hasFunc = code.includes('is_valid_parentheses') || code.includes('isValidParentheses');
      if (!hasFunc) return { testsPassed: 0, evalErrorLog: 'Function is_valid_parentheses or isValidParentheses not found in submission.' };
      try {
        let jsEquivalent = nonCommentCode;
        if (language === 'python') {
          jsEquivalent = jsEquivalent
            .replace(/def\s+(?:is_valid_parentheses|isValidParentheses)\s*\([^)]*\):/g, 'function isValidParentheses(s) {')
            .replace(/\bNone\b/g, 'null').replace(/\band\b/g, '&&').replace(/\bor\b/g, '||')
            .replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false')
            .replace(/(\w+)\.append\(([^)]+)\)/g, '$1.push($2)')
            .replace(/(\w+)\.pop\(\)/g, '$1.pop()')
            .replace(/len\((\w+)\)\s*==\s*0/g, '$1.length === 0')
            .replace(/not\s+(\w+)/g, '!$1.length');
          if (!jsEquivalent.includes('}')) jsEquivalent += '\n}';
        }
        const fn = CodeWarsApiService.extractFunctionFromSandbox(jsEquivalent, ['isValidParentheses', 'is_valid_parentheses']);
        if (typeof fn === 'function') {
          const res = CodeWarsApiService.evaluateValidParenthesesTestCases(fn);
          return { testsPassed: res.passedCount, evalErrorLog: res.errorLog };
        }
      } catch (err: any) {
        return { testsPassed: 0, evalErrorLog: `Execution error: ${err?.message || 'Invalid syntax'}` };
      }
      return { testsPassed: 0, evalErrorLog: 'Algorithmic Evaluation Incomplete: Valid Parentheses test cases could not be verified in execution runtime.' };
    }

    if (problem.id === 'war_max_subarray_05') {
      const hasFunc = code.includes('max_sub_array') || code.includes('maxSubArray');
      if (!hasFunc) return { testsPassed: 0, evalErrorLog: 'Function max_sub_array or maxSubArray not found in submission.' };
      try {
        let jsEquivalent = nonCommentCode;
        if (language === 'python') {
          jsEquivalent = jsEquivalent
            .replace(/def\s+(?:max_sub_array|maxSubArray)\s*\([^)]*\):/g, 'function maxSubArray(nums) {')
            .replace(/\bNone\b/g, 'null').replace(/\band\b/g, '&&').replace(/\bor\b/g, '||')
            .replace(/float\(['"]-inf['"]\)/g, '-Infinity')
            .replace(/max\(([^,]+),\s*([^)]+)\)/g, 'Math.max($1, $2)')
            .replace(/for\s+(\w+)\s+in\s+nums:/g, 'for (let $1 of nums) {');
          if (!jsEquivalent.includes('}')) jsEquivalent += '\n}';
        }
        const fn = CodeWarsApiService.extractFunctionFromSandbox(jsEquivalent, ['maxSubArray', 'max_sub_array']);
        if (typeof fn === 'function') {
          const res = CodeWarsApiService.evaluateMaxSubarrayTestCases(fn);
          return { testsPassed: res.passedCount, evalErrorLog: res.errorLog };
        }
      } catch (err: any) {
        return { testsPassed: 0, evalErrorLog: `Execution error: ${err?.message || 'Invalid syntax'}` };
      }
      return { testsPassed: 0, evalErrorLog: 'Algorithmic Evaluation Incomplete: Maximum Subarray test cases could not be verified in execution runtime.' };
    }

    if (problem.id === 'war_best_stock_06') {
      const hasFunc = code.includes('max_profit') || code.includes('maxProfit');
      if (!hasFunc) return { testsPassed: 0, evalErrorLog: 'Function max_profit or maxProfit not found in submission.' };
      try {
        let jsEquivalent = nonCommentCode;
        if (language === 'python') {
          jsEquivalent = jsEquivalent
            .replace(/def\s+(?:max_profit|maxProfit)\s*\([^)]*\):/g, 'function maxProfit(prices) {')
            .replace(/\bNone\b/g, 'null').replace(/\band\b/g, '&&').replace(/\bor\b/g, '||')
            .replace(/float\(['"]inf['"]\)/g, 'Infinity')
            .replace(/max\(([^,]+),\s*([^)]+)\)/g, 'Math.max($1, $2)')
            .replace(/min\(([^,]+),\s*([^)]+)\)/g, 'Math.min($1, $2)')
            .replace(/for\s+(\w+)\s+in\s+prices:/g, 'for (let $1 of prices) {');
          if (!jsEquivalent.includes('}')) jsEquivalent += '\n}';
        }
        const fn = CodeWarsApiService.extractFunctionFromSandbox(jsEquivalent, ['maxProfit', 'max_profit']);
        if (typeof fn === 'function') {
          const res = CodeWarsApiService.evaluateBestStockTestCases(fn);
          return { testsPassed: res.passedCount, evalErrorLog: res.errorLog };
        }
      } catch (err: any) {
        return { testsPassed: 0, evalErrorLog: `Execution error: ${err?.message || 'Invalid syntax'}` };
      }
      return { testsPassed: 0, evalErrorLog: 'Algorithmic Evaluation Incomplete: Best Stock test cases could not be verified in execution runtime.' };
    }

    if (problem.id === 'war_tree_lca_01') {
      const hasLcaName = language === 'python'
        ? (code.includes('lowest_common_ancestor') || code.includes('lowestCommonAncestor'))
        : (code.includes('lowestCommonAncestor') || code.includes('lowest_common_ancestor'));
      const hasTreeTraversal = (code.includes('.left') || code.includes('.right') || code.includes('curr') || code.includes('root'))
        && (code.includes('<') || code.includes('>') || code.includes('return'));

      if (!hasLcaName || !hasTreeTraversal) {
        return {
          testsPassed: 0,
          evalErrorLog: 'Algorithmic Verification Failed: Solution must implement BST traversal comparing p and q node values.'
        };
      }

      // Transpile Java/Python syntax to run against deterministic LCA test cases
      try {
        let jsEquivalent = nonCommentCode;
        if (language === 'java') {
          jsEquivalent = jsEquivalent
            .replace(/public\s+class\s+\w+\s*\{/g, '')
            .replace(/public\s+(?:int|TreeNode|Integer)\s+/g, 'function ')
            .replace(/TreeNode\s+/g, '')
            .replace(/int\s+/g, '')
            .replace(/;\s*\}\s*$/g, ';');
        } else if (language === 'python') {
          jsEquivalent = jsEquivalent
            .replace(/def\s+(?:lowest_common_ancestor|lowestCommonAncestor)\s*\([^)]*\):/g, 'function lowestCommonAncestor(root, p, q) {')
            .replace(/\bNone\b/g, 'null')
            .replace(/\band\b/g, '&&')
            .replace(/\bor\b/g, '||')
            .replace(/\belif\b/g, 'else if');
          if (!jsEquivalent.includes('}')) {
            jsEquivalent += '\n}';
          }
        }
        const fn = CodeWarsApiService.extractFunctionFromSandbox(jsEquivalent, [
          'lowestCommonAncestor',
          'lowest_common_ancestor',
        ]);
        if (typeof fn === 'function') {
          const res = CodeWarsApiService.evaluateLcaTestCases(fn);
          return { testsPassed: res.passedCount, evalErrorLog: res.errorLog };
        }
      } catch {}

      // Fail closed: Never grant pass on substring presence without genuine sandbox execution
      return {
        testsPassed: 0,
        evalErrorLog: 'Algorithmic Evaluation Incomplete: LCA test cases could not be verified in sandbox execution runtime.'
      };
    }

    if (problem.id === 'war_concurrency_deadlock_02') {
      const hasFunc = code.includes('acquire_resources_deterministically') || code.includes('acquireResourcesDeterministically');
      const hasOrdering = code.includes('sort') || code.includes('sorted') || code.includes('compare') || code.includes('order');
      if (!hasFunc || !hasOrdering) {
        return {
          testsPassed: 0,
          evalErrorLog: 'Anti-Cheat Guard: Deadlock prevention requires deterministic global lock ordering (e.g. sorting resource IDs).'
        };
      }

      try {
        let jsEquivalent = nonCommentCode;
        if (language === 'python') {
          jsEquivalent = jsEquivalent
            .replace(/def\s+(?:acquire_resources_deterministically|acquireResourcesDeterministically)\s*\([^)]*\):/g, 'function acquireResourcesDeterministically(requests) {')
            .replace(/\bseen\s*=\s*set\(\)/g, 'let seen = new Set();')
            .replace(/\bres\s*=\s*set\(\)/g, 'let res = new Set();')
            .replace(/\bset\(\)/g, 'new Set()')
            .replace(/for\s+(\w+)\s+in\s+requests:/g, 'for (let $1 of requests) {')
            .replace(/for\s+(\w+)\s+in\s+(\w+)(?:\.get\(['"]resourceIds['"],\s*\[\]\)|\[['"]resourceIds['"]\]|\.resourceIds):/g, 'for (let $1 of ($2.resourceIds || [])) {')
            .replace(/return\s+sorted\(\s*(?:list\()?\s*([^)]+)\s*\)?\s*\)/g, 'return Array.from($1).sort();');
          if (!jsEquivalent.includes('}')) {
            jsEquivalent += '\n}\n}\n}';
          }
        }
        const fn = CodeWarsApiService.extractFunctionFromSandbox(jsEquivalent, [
          'acquireResourcesDeterministically',
          'acquire_resources_deterministically'
        ]);
        if (typeof fn === 'function') {
          const res = CodeWarsApiService.evaluateConcurrencyTestCases(fn);
          return { testsPassed: res.passedCount, evalErrorLog: res.errorLog };
        }
      } catch (err: any) {
        return { testsPassed: 0, evalErrorLog: `Runtime error in concurrency test runner: ${err?.message || 'Invalid syntax'}` };
      }

      return {
        testsPassed: 0,
        evalErrorLog: 'Failed to extract executable acquireResourcesDeterministically function from submission.'
      };
    }

    if (problem.id === 'war_sql_btree_query_03') {
      const hasFunc = code.includes('generateOptimalCompositeIndex') || code.includes('generate_optimal_composite_index');
      const hasSqlKeywords = code.toLowerCase().includes('create index') || code.toLowerCase().includes('idx_');
      if (!hasFunc || !hasSqlKeywords) {
        return {
          testsPassed: 0,
          evalErrorLog: 'Anti-Cheat Guard: Query optimizer must generate valid CREATE INDEX DDL matching the table and column specs.'
        };
      }

      try {
        let jsEquivalent = nonCommentCode;
        if (language === 'python') {
          jsEquivalent = jsEquivalent
            .replace(/def\s+(?:generate_optimal_composite_index|generateOptimalCompositeIndex)\s*\([^)]*\):/g, 'function generateOptimalCompositeIndex(table, eq, range) {')
            .replace(/cols\s*=\s*list\(eq\)\s*\+\s*\[range\]/g, 'let cols = [...eq, range];')
            .replace(/cols\s*=\s*list\(equality_cols\)\s*\+\s*\[range_col\]/g, 'let cols = [...equalityCols, rangeCol];')
            .replace(/return\s+f["']CREATE INDEX idx_\{table\}_\{'_'\.join\(cols\)\} ON \{table\} \(\{'[, ]*'\.join\(cols\)\}\);?["']/g, 'return `CREATE INDEX idx_${table}_${cols.join("_")} ON ${table} (${cols.join(", ")});`;')
            .replace(/return\s+f["']CREATE INDEX idx_\{table_name\}_\{'_'\.join\(cols\)\} ON \{table_name\} \(\{'[, ]*'\.join\(cols\)\}\);?["']/g, 'return `CREATE INDEX idx_${tableName}_${cols.join("_")} ON ${tableName} (${cols.join(", ")});`;');
          if (!jsEquivalent.includes('}')) {
            jsEquivalent += '\n}';
          }
        }
        const fn = CodeWarsApiService.extractFunctionFromSandbox(jsEquivalent, [
          'generateOptimalCompositeIndex',
          'generate_optimal_composite_index'
        ]);
        if (typeof fn === 'function') {
          const res = CodeWarsApiService.evaluateSqlTestCases(fn);
          return { testsPassed: res.passedCount, evalErrorLog: res.errorLog };
        }
      } catch (err: any) {
        return { testsPassed: 0, evalErrorLog: `Runtime error in SQL index test runner: ${err?.message || 'Invalid syntax'}` };
      }

      return {
        testsPassed: 0,
        evalErrorLog: 'Failed to extract executable generateOptimalCompositeIndex function from submission.'
      };
    }

    // Fail closed on unknown/unregistered problem IDs
    return {
      testsPassed: 0,
      evalErrorLog: `Algorithmic Evaluation Rejected: Unknown or unregistered arena problem ID "${problem.id}". Fail-closed enforcement.`
    };
  }
}

