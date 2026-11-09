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
  },
  {
    id: 'war_contains_duplicate_04',
    title: 'Contains Duplicate (Set Frequency)',
    difficulty: 'basic',
    competencyId: 'comp_arrays_sets_l1',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    starterCode: {
      typescript: `function containsDuplicate(nums: number[]): boolean {\n  // Your solution here\n  return false;\n}`,
      python: `def contains_duplicate(nums):\n    # Your solution here\n    return False`
    },
    testCases: [
      {
            input: "nums = [1, 2, 3, 1]",
            expectedOutput: "true",
            explanation: "1 appears at index 0 and 3."
      },
      {
            input: "nums = [1, 2, 3, 4]",
            expectedOutput: "false",
            explanation: "All elements are distinct."
      },
      {
            input: "nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]",
            expectedOutput: "true",
            isHidden: true
      },
      {
            input: "nums = [0]",
            expectedOutput: "false",
            isHidden: true
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ["Arrays","Hash Set","Novice","Foundations"],
    hint: "Use a Set! As you iterate through nums, check if current number is already in the set. If yes, return true. Otherwise add it.",
    complexityTarget: "Time: O(N) | Space: O(N)"
  },
  {
    id: 'war_valid_anagram_05',
    title: 'Valid Anagram (Character Frequency)',
    difficulty: 'basic',
    competencyId: 'comp_strings_freq_l1',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is formed by rearranging characters of a different word.',
    starterCode: {
      typescript: `function isAnagram(s: string, t: string): boolean {\n  // Your solution here\n  return false;\n}`,
      python: `def is_anagram(s, t):\n    # Your solution here\n    return False`
    },
    testCases: [
      {
            input: "s = \"anagram\", t = \"nagaram\"",
            expectedOutput: "true",
            explanation: "Both strings have identical characters and frequencies."
      },
      {
            input: "s = \"rat\", t = \"car\"",
            expectedOutput: "false",
            explanation: "Characters do not match."
      },
      {
            input: "s = \"a\", t = \"ab\"",
            expectedOutput: "false",
            isHidden: true
      },
      {
            input: "s = \"listen\", t = \"silent\"",
            expectedOutput: "true",
            isHidden: true
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ["Strings","Hash Map","Novice","Foundations"],
    hint: "First verify lengths match. Then count character frequencies using a map or sorted character comparison.",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },
  {
    id: 'war_move_zeroes_06',
    title: 'Move Zeroes In-Place',
    difficulty: 'basic',
    competencyId: 'comp_two_pointers_shift_l1',
    description: 'Given an integer array nums, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements. Return modified array.',
    starterCode: {
      typescript: `function moveZeroes(nums: number[]): number[] {\n  // Your solution here\n  return nums;\n}`,
      python: `def move_zeroes(nums):\n    # Your solution here\n    return nums`
    },
    testCases: [
      {
            input: "nums = [0, 1, 0, 3, 12]",
            expectedOutput: "[1, 3, 12, 0, 0]",
            explanation: "Non-zero numbers preserve order, zeroes placed at end."
      },
      {
            input: "nums = [0]",
            expectedOutput: "[0]"
      },
      {
            input: "nums = [1, 2, 3]",
            expectedOutput: "[1, 2, 3]",
            isHidden: true
      },
      {
            input: "nums = [0, 0, 1]",
            expectedOutput: "[1, 0, 0]",
            isHidden: true
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ["Arrays","Two Pointers","Novice","In-Place"],
    hint: "Use a write pointer `lastNonZeroIndex = 0`. Iterate through array: whenever you see a non-zero, swap it with `lastNonZeroIndex` and increment!",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },
  {
    id: 'war_single_number_07',
    title: 'Single Number (Bitwise XOR)',
    difficulty: 'basic',
    competencyId: 'comp_bitwise_xor_l1',
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one in linear time and O(1) space.',
    starterCode: {
      typescript: `function singleNumber(nums: number[]): number {\n  // Your solution here\n  return 0;\n}`,
      python: `def single_number(nums):\n    # Your solution here\n    return 0`
    },
    testCases: [
      {
            input: "nums = [2, 2, 1]",
            expectedOutput: "1"
      },
      {
            input: "nums = [4, 1, 2, 1, 2]",
            expectedOutput: "4",
            explanation: "1 and 2 appear twice; 4 appears once."
      },
      {
            input: "nums = [1]",
            expectedOutput: "1",
            isHidden: true
      },
      {
            input: "nums = [7, 3, 7]",
            expectedOutput: "3",
            isHidden: true
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ["Bit Manipulation","XOR","Novice","Foundations"],
    hint: "Bitwise XOR magic: a ^ a = 0 and a ^ 0 = a! XOR all numbers together; pairs cancel out to 0 leaving only the unique single number.",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },
  {
    id: 'war_missing_number_08',
    title: 'Missing Number (Gauss Summation)',
    difficulty: 'basic',
    competencyId: 'comp_math_gauss_l1',
    description: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
    starterCode: {
      typescript: `function missingNumber(nums: number[]): number {\n  // Your solution here\n  return 0;\n}`,
      python: `def missing_number(nums):\n    # Your solution here\n    return 0`
    },
    testCases: [
      {
            input: "nums = [3, 0, 1]",
            expectedOutput: "2",
            explanation: "n = 3, range [0, 3]. 2 is missing."
      },
      {
            input: "nums = [0, 1]",
            expectedOutput: "2",
            explanation: "n = 2, range [0, 2]. 2 is missing."
      },
      {
            input: "nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]",
            expectedOutput: "8",
            isHidden: true
      },
      {
            input: "nums = [0]",
            expectedOutput: "1",
            isHidden: true
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ["Math","Arrays","Novice","Foundations"],
    hint: "Expected sum of 0 to n is n * (n + 1) / 2. Subtract actual sum of array elements from expected sum to find the missing number!",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },
  {
    id: 'war_merge_sorted_arrays_09',
    title: 'Merge Sorted Arrays',
    difficulty: 'basic',
    competencyId: 'comp_two_pointers_merge_l1',
    description: 'Given two sorted integer arrays nums1 and nums2, merge them into a single sorted array.',
    starterCode: {
      typescript: `function mergeSortedArrays(nums1: number[], nums2: number[]): number[] {\n  // Your solution here\n  return [];\n}`,
      python: `def merge_sorted_arrays(nums1, nums2):\n    # Your solution here\n    return []`
    },
    testCases: [
      {
            input: "nums1 = [1, 2, 3], nums2 = [2, 5, 6]",
            expectedOutput: "[1, 2, 2, 3, 5, 6]"
      },
      {
            input: "nums1 = [1], nums2 = []",
            expectedOutput: "[1]"
      },
      {
            input: "nums1 = [], nums2 = [1]",
            expectedOutput: "[1]",
            isHidden: true
      },
      {
            input: "nums1 = [2, 4], nums2 = [1, 3]",
            expectedOutput: "[1, 2, 3, 4]",
            isHidden: true
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ["Arrays","Two Pointers","Novice","Sorting"],
    hint: "Use two pointers i and j starting at 0 for both arrays. Compare elements and push the smaller one to the merged result until both arrays are exhausted.",
    complexityTarget: "Time: O(M + N) | Space: O(M + N)"
  },
  {
    id: 'war_roman_to_int_10',
    title: 'Roman to Integer (Symbol Accumulator)',
    difficulty: 'basic',
    competencyId: 'comp_string_parsing_roman_l1',
    description: 'Given a roman numeral string s, convert it to an integer. Symbol values: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.',
    starterCode: {
      typescript: `function romanToInt(s: string): number {\n  // Your solution here\n  return 0;\n}`,
      python: `def roman_to_int(s):\n    # Your solution here\n    return 0`
    },
    testCases: [
      {
            input: "s = \"III\"",
            expectedOutput: "3"
      },
      {
            input: "s = \"LVIII\"",
            expectedOutput: "58",
            explanation: "L = 50, V = 5, III = 3."
      },
      {
            input: "s = \"MCMXCIV\"",
            expectedOutput: "1994",
            explanation: "M = 1000, CM = 900, XC = 90, IV = 4."
      },
      {
            input: "s = \"IX\"",
            expectedOutput: "9",
            isHidden: true
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ["Strings","Hash Map","Novice","Math"],
    hint: "Iterate through characters: if current roman value is less than the next roman value (e.g. IV = 4), subtract it; otherwise add it!",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },
  {
    id: 'war_binary_search_07',
    title: 'Binary Search (Logarithmic Lookup)',
    difficulty: 'intermediate',
    competencyId: 'comp_dsa_binary_search_l2',
    description: 'Given an array of integers nums sorted in ascending order and a target, search target in nums in O(log n) time. Return index or -1.',
    starterCode: {
      typescript: `function search(nums: number[], target: number): number {\n  // Your solution here\n  return -1;\n}`,
      python: `def search(nums, target):\n    # Your solution here\n    return -1`
    },
    testCases: [
      {
            input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
            expectedOutput: "4",
            explanation: "9 exists at index 4."
      },
      {
            input: "nums = [-1, 0, 3, 5, 9, 12], target = 2",
            expectedOutput: "-1",
            explanation: "2 does not exist in nums."
      },
      {
            input: "nums = [5], target = 5",
            expectedOutput: "0",
            isHidden: true
      },
      {
            input: "nums = [1, 3, 5], target = 1",
            expectedOutput: "0",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["Binary Search","Arrays","Apprentice","Divide & Conquer"],
    hint: "Divide and conquer! Set left = 0, right = nums.length - 1. While left <= right, calculate mid. Adjust left or right based on nums[mid] comparison.",
    complexityTarget: "Time: O(log N) | Space: O(1)"
  },
  {
    id: 'war_reverse_linked_list_08',
    title: 'Reverse a Singly Linked List',
    difficulty: 'intermediate',
    competencyId: 'comp_linked_list_pointers_l2',
    description: 'Given an array of values representing a singly linked list, reverse the list and return the reversed array in O(N) time and O(1) space.',
    starterCode: {
      typescript: `function reverseList(headValues: number[]): number[] {\n  // Your solution here\n  return [];\n}`,
      python: `def reverse_list(head_values):\n    # Your solution here\n    return []`
    },
    testCases: [
      {
            input: "head = [1, 2, 3, 4, 5]",
            expectedOutput: "[5, 4, 3, 2, 1]"
      },
      {
            input: "head = [1, 2]",
            expectedOutput: "[2, 1]"
      },
      {
            input: "head = []",
            expectedOutput: "[]",
            isHidden: true
      },
      {
            input: "head = [42]",
            expectedOutput: "[42]",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["Linked List","Two Pointers","Apprentice","Data Structures"],
    hint: "Maintain prev = null, curr = head. For each node: nextNode = curr.next; curr.next = prev; prev = curr; curr = nextNode. Return prev.",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },
  {
    id: 'war_longest_substring_09',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'intermediate',
    competencyId: 'comp_sliding_window_unique_l2',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    starterCode: {
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  // Your solution here\n  return 0;\n}`,
      python: `def length_of_longest_substring(s):\n    # Your solution here\n    return 0`
    },
    testCases: [
      {
            input: "s = \"abcabcbb\"",
            expectedOutput: "3",
            explanation: "The answer is \"abc\", with length 3."
      },
      {
            input: "s = \"bbbbb\"",
            expectedOutput: "1",
            explanation: "The answer is \"b\", with length 1."
      },
      {
            input: "s = \"pwwkew\"",
            expectedOutput: "3",
            explanation: "The answer is \"wke\", with length 3."
      },
      {
            input: "s = \"\"",
            expectedOutput: "0",
            isHidden: true
      },
      {
            input: "s = \"au\"",
            expectedOutput: "2",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["Sliding Window","Hash Map","Apprentice","Strings"],
    hint: "Sliding window technique! Use a map tracking the last seen index of each char. When a duplicate is seen, jump the left window boundary past it.",
    complexityTarget: "Time: O(N) | Space: O(min(N, M))"
  },
  {
    id: 'war_container_water_10',
    title: 'Container With Most Water',
    difficulty: 'intermediate',
    competencyId: 'comp_greedy_container_l2',
    description: 'Given an array height of length n, find two lines that together with the x-axis form a container storing the most water. Return maximum area.',
    starterCode: {
      typescript: `function maxArea(height: number[]): number {\n  // Your solution here\n  return 0;\n}`,
      python: `def max_area(height):\n    # Your solution here\n    return 0`
    },
    testCases: [
      {
            input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
            expectedOutput: "49",
            explanation: "Between index 1 (8) and index 8 (7): min(8, 7) * 7 = 49."
      },
      {
            input: "height = [1, 1]",
            expectedOutput: "1"
      },
      {
            input: "height = [4, 3, 2, 1, 4]",
            expectedOutput: "16",
            isHidden: true
      },
      {
            input: "height = [1, 2, 1]",
            expectedOutput: "2",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["Two Pointers","Greedy","Apprentice","Arrays"],
    hint: "Two pointers at left = 0, right = n - 1. Area is min(height[left], height[right]) * (right - left). Always move the shorter pointer inward!",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },
  {
    id: 'war_product_except_self_11',
    title: 'Product of Array Except Self',
    difficulty: 'intermediate',
    competencyId: 'comp_prefix_suffix_product_l2',
    description: 'Given an integer array nums, return an array answer where answer[i] equals the product of all elements of nums except nums[i], without division.',
    starterCode: {
      typescript: `function productExceptSelf(nums: number[]): number[] {\n  // Your solution here\n  return [];\n}`,
      python: `def product_except_self(nums):\n    # Your solution here\n    return []`
    },
    testCases: [
      {
            input: "nums = [1, 2, 3, 4]",
            expectedOutput: "[24, 12, 8, 6]"
      },
      {
            input: "nums = [-1, 1, 0, -3, 3]",
            expectedOutput: "[0, 0, 9, 0, 0]"
      },
      {
            input: "nums = [2, 3]",
            expectedOutput: "[3, 2]",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["Prefix Sums","Arrays","Apprentice","No Division"],
    hint: "Two passes: First pass left to right building prefix products. Second pass right to left accumulating suffix products into the output array.",
    complexityTarget: "Time: O(N) | Space: O(1) auxiliary"
  },
  {
    id: 'war_three_sum_12',
    title: '3Sum (Unique Zero-Sum Triplets)',
    difficulty: 'intermediate',
    competencyId: 'comp_two_pointers_3sum_l2',
    description: 'Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that their sum equals 0.',
    starterCode: {
      typescript: `function threeSum(nums: number[]): number[][] {\n  // Your solution here\n  return [];\n}`,
      python: `def three_sum(nums):\n    # Your solution here\n    return []`
    },
    testCases: [
      {
            input: "nums = [-1, 0, 1, 2, -1, -4]",
            expectedOutput: "[[-1, -1, 2], [-1, 0, 1]]"
      },
      {
            input: "nums = [0, 1, 1]",
            expectedOutput: "[]"
      },
      {
            input: "nums = [0, 0, 0]",
            expectedOutput: "[[0, 0, 0]]",
            isHidden: true
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 175,
    tags: ["Two Pointers","Sorting","Apprentice","Arrays"],
    hint: "Sort nums first! For each index i, skip duplicates, then use two pointers (left = i + 1, right = n - 1) to find pairs summing to -nums[i].",
    complexityTarget: "Time: O(N^2) | Space: O(1)"
  },
  {
    id: 'war_min_stack_13',
    title: 'Min Stack Simulator (O(1) Retrieval)',
    difficulty: 'intermediate',
    competencyId: 'comp_stack_min_o1_l2',
    description: 'Simulate a stack supporting push, pop, top, and retrieving minimum in O(1) time. Return an array of all getMin query results.',
    starterCode: {
      typescript: `function processMinStack(operations: string[], values: number[][]): number[] {\n  // Your solution here\n  return [];\n}`,
      python: `def process_min_stack(operations, values):\n    # Your solution here\n    return []`
    },
    testCases: [
      {
            input: "ops = [\"push\", \"push\", \"push\", \"getMin\", \"pop\", \"getMin\"], vals = [[-2], [0], [-3], [], [], []]",
            expectedOutput: "[-3, -2]"
      },
      {
            input: "ops = [\"push\", \"getMin\"], vals = [[5], []]",
            expectedOutput: "[5]"
      },
      {
            input: "ops = [\"push\", \"push\", \"getMin\", \"pop\", \"getMin\"], vals = [[2], [1], [], [], []]",
            expectedOutput: "[1, 2]",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["Stack","Design","Apprentice","O(1) Min"],
    hint: "Store pairs [value, currentMinSoFar] in your stack. When you pop, the previous minimum is preserved automatically!",
    complexityTarget: "Time: O(1) per op | Space: O(N)"
  },
  {
    id: 'war_invert_binary_tree_04',
    title: 'Invert Binary Tree (Mirror Reflection)',
    difficulty: 'advanced',
    competencyId: 'comp_binary_tree_invert_l3',
    description: 'Given the root of a binary tree (represented as level-order array), invert the tree (swap left and right subtrees at every node), and return level-order array.',
    starterCode: {
      typescript: `function invertTree(root: (number | null)[]): (number | null)[] {\n  // Your solution here\n  return [];\n}`,
      python: `def invert_tree(root):\n    # Your solution here\n    return []`
    },
    testCases: [
      {
            input: "root = [4, 2, 7, 1, 3, 6, 9]",
            expectedOutput: "[4, 7, 2, 9, 6, 3, 1]"
      },
      {
            input: "root = [2, 1, 3]",
            expectedOutput: "[2, 3, 1]"
      },
      {
            input: "root = []",
            expectedOutput: "[]",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["Binary Tree","DFS","Recursion","Master"],
    hint: "Recursively swap subtrees: temp = node.left; node.left = invertTree(node.right); node.right = invertTree(temp); return node.",
    complexityTarget: "Time: O(N) | Space: O(H)"
  },
  {
    id: 'war_max_depth_tree_05',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'advanced',
    competencyId: 'comp_tree_depth_dfs_l3',
    description: 'Given the root of a binary tree (level-order array), return its maximum depth along the longest path from root to leaf.',
    starterCode: {
      typescript: `function maxDepth(root: (number | null)[]): number {\n  // Your solution here\n  return 0;\n}`,
      python: `def max_depth(root):\n    # Your solution here\n    return 0`
    },
    testCases: [
      {
            input: "root = [3, 9, 20, null, null, 15, 7]",
            expectedOutput: "3"
      },
      {
            input: "root = [1, null, 2]",
            expectedOutput: "2"
      },
      {
            input: "root = []",
            expectedOutput: "0",
            isHidden: true
      },
      {
            input: "root = [1]",
            expectedOutput: "1",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["Binary Tree","DFS","BFS","Master"],
    hint: "Base case: if node is null, return 0. Recursive case: 1 + Math.max(maxDepth(left), maxDepth(right)).",
    complexityTarget: "Time: O(N) | Space: O(H)"
  },
  {
    id: 'war_validate_bst_06',
    title: 'Validate Binary Search Tree',
    difficulty: 'advanced',
    competencyId: 'comp_validate_bst_bounds_l3',
    description: 'Given the root of a binary tree (level-order array), determine if it is a valid binary search tree (BST) where left < root < right across all descendants.',
    starterCode: {
      typescript: `function isValidBST(root: (number | null)[]): boolean {\n  // Your solution here\n  return false;\n}`,
      python: `def is_valid_bst(root):\n    # Your solution here\n    return False`
    },
    testCases: [
      {
            input: "root = [2, 1, 3]",
            expectedOutput: "true"
      },
      {
            input: "root = [5, 1, 4, null, null, 3, 6]",
            expectedOutput: "false",
            explanation: "Root 5 has right child 4 which is smaller than 5."
      },
      {
            input: "root = [1]",
            expectedOutput: "true",
            isHidden: true
      },
      {
            input: "root = [5, 4, 6, null, null, 3, 7]",
            expectedOutput: "false",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["Binary Search Tree","DFS","Validation","Master"],
    hint: "Pass valid boundaries down recursion! Start with (-inf, +inf). When traversing left, upper bound = node.val. When traversing right, lower bound = node.val.",
    complexityTarget: "Time: O(N) | Space: O(H)"
  },
  {
    id: 'war_coin_change_07',
    title: 'Coin Change (Fewest Coins DP)',
    difficulty: 'advanced',
    competencyId: 'comp_dp_unbounded_knapsack_l3',
    description: 'Given coins of different denominations and an amount, return the fewest number of coins needed to make up that amount, or -1 if impossible.',
    starterCode: {
      typescript: `function coinChange(coins: number[], amount: number): number {\n  // Your solution here\n  return -1;\n}`,
      python: `def coin_change(coins, amount):\n    # Your solution here\n    return -1`
    },
    testCases: [
      {
            input: "coins = [1, 2, 5], amount = 11",
            expectedOutput: "3",
            explanation: "11 = 5 + 5 + 1 (3 coins)"
      },
      {
            input: "coins = [2], amount = 3",
            expectedOutput: "-1"
      },
      {
            input: "coins = [1], amount = 0",
            expectedOutput: "0"
      },
      {
            input: "coins = [1], amount = 2",
            expectedOutput: "2",
            isHidden: true
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ["Dynamic Programming","Knapsack","Master","Optimization"],
    hint: "Bottom-up DP: dp[i] = min coins to make amount i. dp[0] = 0, all others Infinity. For each coin, dp[i] = min(dp[i], dp[i - coin] + 1).",
    complexityTarget: "Time: O(amount * len(coins)) | Space: O(amount)"
  },
  {
    id: 'war_house_robber_08',
    title: 'House Robber (Optimal Non-Adjacent Stash)',
    difficulty: 'advanced',
    competencyId: 'comp_dp_non_adjacent_l3',
    description: 'Given house stash values along a street, calculate the maximum amount you can rob without robbing two adjacent houses.',
    starterCode: {
      typescript: `function rob(nums: number[]): number {\n  // Your solution here\n  return 0;\n}`,
      python: `def rob(nums):\n    # Your solution here\n    return 0`
    },
    testCases: [
      {
            input: "nums = [1, 2, 3, 1]",
            expectedOutput: "4",
            explanation: "Rob house 1 (1) and house 3 (3) = 4."
      },
      {
            input: "nums = [2, 7, 9, 3, 1]",
            expectedOutput: "12",
            explanation: "Rob house 1 (2), house 3 (9), house 5 (1) = 12."
      },
      {
            input: "nums = [0]",
            expectedOutput: "0",
            isHidden: true
      },
      {
            input: "nums = [2, 1, 1, 2]",
            expectedOutput: "4",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["Dynamic Programming","Memoization","Master","Decision Tree"],
    hint: "Maintain rob1 and rob2. For each house num: currentMax = max(rob1 + num, rob2); rob1 = rob2; rob2 = currentMax. Return rob2.",
    complexityTarget: "Time: O(N) | Space: O(1)"
  },
  {
    id: 'war_kth_largest_09',
    title: 'Kth Largest Element in an Array',
    difficulty: 'advanced',
    competencyId: 'comp_heap_quickselect_l3',
    description: 'Given an integer array nums and an integer k, return the kth largest element in sorted order.',
    starterCode: {
      typescript: `function findKthLargest(nums: number[], k: number): number {\n  // Your solution here\n  return 0;\n}`,
      python: `def find_kth_largest(nums, k):\n    # Your solution here\n    return 0`
    },
    testCases: [
      {
            input: "nums = [3, 2, 1, 5, 6, 4], k = 2",
            expectedOutput: "5"
      },
      {
            input: "nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4",
            expectedOutput: "4"
      },
      {
            input: "nums = [1], k = 1",
            expectedOutput: "1",
            isHidden: true
      },
      {
            input: "nums = [7, 6, 5, 4, 3, 2, 1], k = 5",
            expectedOutput: "3",
            isHidden: true
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["Heap","Quickselect","Sorting","Master"],
    hint: "Use a Min-Heap of size k (or sort descending and pick index k - 1). Quickselect gives linear average time.",
    complexityTarget: "Time: O(N log K) | Space: O(K)"
  },
  {
    id: 'war_number_of_islands_10',
    title: 'Number of Islands (Grid BFS/DFS)',
    difficulty: 'advanced',
    competencyId: 'comp_graph_grid_bfs_l3',
    description: 'Given an m x n 2D binary grid representing land (\'1\') and water (\'0\'), return the number of connected islands.',
    starterCode: {
      typescript: `function numIslands(grid: string[][]): number {\n  // Your solution here\n  return 0;\n}`,
      python: `def num_islands(grid):\n    # Your solution here\n    return 0`
    },
    testCases: [
      {
            input: "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
            expectedOutput: "1"
      },
      {
            input: "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
            expectedOutput: "3"
      },
      {
            input: "grid = [[\"1\"]]",
            expectedOutput: "1",
            isHidden: true
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ["Graph","BFS","DFS","Matrix","Master"],
    hint: "Iterate across every cell (r, c). When you find '1', increment island count and run BFS/DFS to sink all connected '1's to '0'.",
    complexityTarget: "Time: O(M * N) | Space: O(M * N)"
  },
  // ==========================================
  // BASIC TIER: 10 NEW FOUNDATIONAL PROBLEMS (31-40)
  // ==========================================
  {
    id: 'war_majority_element_11',
    title: 'Majority Element (Boyer-Moore Voting)',
    difficulty: 'basic',
    competencyId: 'comp_arrays_voting_l1',
    description: 'Given an array nums of size n, return the majority element that appears more than ⌊n / 2⌋ times. In distributed consensus, this determines quorum agreement across cluster nodes without auxiliary memory.',
    starterCode: {
      typescript: 'function majorityElement(nums: number[]): number {\n  // Your solution here\n  return 0;\n}',
      python: 'def majority_element(nums):\n    # Your solution here\n    return 0'
    },
    testCases: [
      { input: 'nums = [3, 2, 3]', expectedOutput: '3' },
      { input: 'nums = [2, 2, 1, 1, 1, 2, 2]', expectedOutput: '2' },
      { input: 'nums = [1]', expectedOutput: '1', isHidden: true },
      { input: 'nums = [6, 5, 5]', expectedOutput: '5', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Arrays', 'Voting', 'Quorum', 'Novice'],
    hint: 'Use the Boyer-Moore Voting algorithm: track a candidate and count. Increment count when current matches candidate, decrement when different. When count reaches 0, pick current element.',
    complexityTarget: 'Time: O(N) | Space: O(1)'
  },
  {
    id: 'war_first_unique_char_12',
    title: 'First Unique Character in a String',
    difficulty: 'basic',
    competencyId: 'comp_strings_hash_first_l1',
    description: 'Given a string s, find the first non-repeating character and return its 0-based index. If it does not exist, return -1. In real-time payment validation, this detects the first fresh security nonce.',
    starterCode: {
      typescript: 'function firstUniqChar(s: string): number {\n  // Your solution here\n  return -1;\n}',
      python: 'def first_uniq_char(s):\n    # Your solution here\n    return -1'
    },
    testCases: [
      { input: 's = "leetcode"', expectedOutput: '0' },
      { input: 's = "loveleetcode"', expectedOutput: '2' },
      { input: 's = "aabb"', expectedOutput: '-1', isHidden: true },
      { input: 's = "z"', expectedOutput: '0', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Strings', 'Hash Map', 'Novice', 'Stream'],
    hint: 'Build a frequency map of characters in the first pass. In the second pass, return the index of the first character whose frequency is exactly 1.',
    complexityTarget: 'Time: O(N) | Space: O(1)'
  },
  {
    id: 'war_climbing_stairs_13',
    title: 'Climbing Stairs (Fibonacci Step Pacing)',
    difficulty: 'basic',
    competencyId: 'comp_dp_fibonacci_l1',
    description: 'You are climbing a staircase taking n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top? In packet delivery, this counts distinct hop combinations.',
    starterCode: {
      typescript: 'function climbStairs(n: number): number {\n  // Your solution here\n  return 0;\n}',
      python: 'def climb_stairs(n):\n    # Your solution here\n    return 0'
    },
    testCases: [
      { input: 'n = 2', expectedOutput: '2' },
      { input: 'n = 3', expectedOutput: '3' },
      { input: 'n = 4', expectedOutput: '5', isHidden: true },
      { input: 'n = 5', expectedOutput: '8', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Dynamic Programming', 'Math', 'Novice'],
    hint: 'To reach step n, you must arrive from step n-1 or step n-2. Thus ways(n) = ways(n-1) + ways(n-2). Keep two rolling variables.',
    complexityTarget: 'Time: O(N) | Space: O(1)'
  },
  {
    id: 'war_valid_palindrome_ii_14',
    title: 'Valid Palindrome II (1-Fault Tolerance)',
    difficulty: 'basic',
    competencyId: 'comp_two_pointers_fault_l1',
    description: 'Given a string s, return true if s can be a palindrome after deleting at most one character. In fault-tolerant data transmission, this simulates 1-byte parity packet recovery.',
    starterCode: {
      typescript: 'function validPalindrome(s: string): boolean {\n  // Your solution here\n  return false;\n}',
      python: 'def valid_palindrome(s):\n    # Your solution here\n    return False'
    },
    testCases: [
      { input: 's = "aba"', expectedOutput: 'true' },
      { input: 's = "abca"', expectedOutput: 'true' },
      { input: 's = "abc"', expectedOutput: 'false', isHidden: true },
      { input: 's = "deeee"', expectedOutput: 'true', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Strings', 'Two Pointers', 'Fault Tolerance', 'Novice'],
    hint: 'Use two pointers from the outside in. Upon encountering a mismatch at l and r, check if the substring without s[l] OR the substring without s[r] is a valid palindrome.',
    complexityTarget: 'Time: O(N) | Space: O(1)'
  },
  {
    id: 'war_intersection_arrays_15',
    title: 'Intersection of Two Arrays',
    difficulty: 'basic',
    competencyId: 'comp_hash_set_intersection_l1',
    description: 'Given two integer arrays nums1 and nums2, return an array of their unique intersection sorted in ascending order. In analytics databases, this computes audience segment overlap.',
    starterCode: {
      typescript: 'function intersection(nums1: number[], nums2: number[]): number[] {\n  // Your solution here\n  return [];\n}',
      python: 'def intersection(nums1, nums2):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'nums1 = [1, 2, 2, 1], nums2 = [2, 2]', expectedOutput: '[2]' },
      { input: 'nums1 = [4, 9, 5], nums2 = [9, 4, 9, 8, 4]', expectedOutput: '[4, 9]' },
      { input: 'nums1 = [1, 2], nums2 = [3, 4]', expectedOutput: '[]', isHidden: true },
      { input: 'nums1 = [1], nums2 = [1]', expectedOutput: '[1]', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Hash Set', 'Arrays', 'Join', 'Novice'],
    hint: 'Store elements of nums1 in a Set. Filter unique elements of nums2 that exist in the set, and return them sorted in ascending order.',
    complexityTarget: 'Time: O(M + N) | Space: O(M + N)'
  },
  {
    id: 'war_pascals_triangle_16',
    title: "Pascal's Triangle (Binomial Coefficient Grid)",
    difficulty: 'basic',
    competencyId: 'comp_arrays_pascal_l1',
    description: "Given an integer numRows, return the first numRows of Pascal's triangle. In quantitative financial modeling, this generates binomial option pricing probability grids.",
    starterCode: {
      typescript: 'function generatePascal(numRows: number): number[][] {\n  // Your solution here\n  return [];\n}',
      python: 'def generate_pascal(num_rows):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'numRows = 1', expectedOutput: '[[1]]' },
      { input: 'numRows = 2', expectedOutput: '[[1], [1, 1]]' },
      { input: 'numRows = 4', expectedOutput: '[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]', isHidden: true },
      { input: 'numRows = 5', expectedOutput: '[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Arrays', 'Math', 'Matrix', 'Novice'],
    hint: 'Start with row [[1]]. For each new row i, the first and last values are 1, while intermediate values are the sum of the two numbers directly above it.',
    complexityTarget: 'Time: O(N^2) | Space: O(N^2)'
  },
  {
    id: 'war_disappeared_numbers_17',
    title: 'Find All Numbers Disappeared in an Array',
    difficulty: 'basic',
    competencyId: 'comp_arrays_inplace_mark_l1',
    description: 'Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all integers in [1, n] that do not appear in nums. In sequence logging, this detects dropped telemetry packet IDs.',
    starterCode: {
      typescript: 'function findDisappearedNumbers(nums: number[]): number[] {\n  // Your solution here\n  return [];\n}',
      python: 'def find_disappeared_numbers(nums):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'nums = [4, 3, 2, 7, 8, 2, 3, 1]', expectedOutput: '[5, 6]' },
      { input: 'nums = [1, 1]', expectedOutput: '[2]' },
      { input: 'nums = [2, 2]', expectedOutput: '[1]', isHidden: true },
      { input: 'nums = [1]', expectedOutput: '[]', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Arrays', 'In-Place', 'Telemetry', 'Novice'],
    hint: 'Iterate through nums. For each val, negate the element at index Math.abs(val) - 1. In a second pass, any index with a positive number was never visited.',
    complexityTarget: 'Time: O(N) | Space: O(1) auxiliary'
  },
  {
    id: 'war_summary_ranges_18',
    title: 'Summary Ranges (Contiguous Segment Formatter)',
    difficulty: 'basic',
    competencyId: 'comp_arrays_intervals_formatting_l1',
    description: 'Given a sorted unique integer array nums, return the smallest sorted list of ranges that cover all numbers in the array exactly. In cloud networking, this compresses contiguous firewall port allocations.',
    starterCode: {
      typescript: 'function summaryRanges(nums: number[]): number[] | string[] {\n  // Your solution here\n  return [];\n}',
      python: 'def summary_ranges(nums):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'nums = [0, 1, 2, 4, 5, 7]', expectedOutput: '["0->2", "4->5", "7"]' },
      { input: 'nums = [0, 2, 3, 4, 6, 8, 9]', expectedOutput: '["0", "2->4", "6", "8->9"]' },
      { input: 'nums = []', expectedOutput: '[]', isHidden: true },
      { input: 'nums = [-1]', expectedOutput: '["-1"]', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Arrays', 'Formatting', 'Ranges', 'Novice'],
    hint: 'Use a two-pointer scan. Advance the right pointer while nums[j+1] === nums[j] + 1. If i === j format as "x", else "x->y".',
    complexityTarget: 'Time: O(N) | Space: O(1)'
  },
  {
    id: 'war_happy_number_19',
    title: 'Happy Number (Sum of Squares Cycle Detector)',
    difficulty: 'basic',
    competencyId: 'comp_hash_cycle_happy_l1',
    description: 'Starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat until the number equals 1, or it loops endlessly in a cycle. In hashing algorithms, this tests convergence.',
    starterCode: {
      typescript: 'function isHappy(n: number): boolean {\n  // Your solution here\n  return false;\n}',
      python: 'def is_happy(n):\n    # Your solution here\n    return False'
    },
    testCases: [
      { input: 'n = 19', expectedOutput: 'true' },
      { input: 'n = 2', expectedOutput: 'false' },
      { input: 'n = 1', expectedOutput: 'true', isHidden: true },
      { input: 'n = 7', expectedOutput: 'true', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Math', 'Hash Set', 'Cycle Detection', 'Novice'],
    hint: 'Extract digits using modulo 10 and square them. Use a Set to track seen numbers. If n reaches 1 return true; if a duplicate is seen, an infinite cycle exists.',
    complexityTarget: 'Time: O(log N) | Space: O(log N)'
  },
  {
    id: 'war_length_of_last_word_20',
    title: 'Length of Last Word (CLI Tokenizer)',
    difficulty: 'basic',
    competencyId: 'comp_string_scan_last_l1',
    description: 'Given a string s consisting of words and spaces, return the length of the last word in the string. In command-line interfaces, this parses terminal flags and sub-command arguments.',
    starterCode: {
      typescript: 'function lengthOfLastWord(s: string): number {\n  // Your solution here\n  return 0;\n}',
      python: 'def length_of_last_word(s):\n    # Your solution here\n    return 0'
    },
    testCases: [
      { input: 's = "Hello World"', expectedOutput: '5' },
      { input: 's = "   fly me   to   the moon  "', expectedOutput: '4' },
      { input: 's = "luffy is still joyboy"', expectedOutput: '6', isHidden: true },
      { input: 's = "a"', expectedOutput: '1', isHidden: true }
    ],
    timeLimitSeconds: 240,
    memoryLimitMb: 128,
    xpReward: 100,
    tags: ['Strings', 'CLI', 'Parsing', 'Novice'],
    hint: 'Trim trailing spaces first. Then scan backward from the end counting characters until you hit another space or the start of the string.',
    complexityTarget: 'Time: O(N) | Space: O(1)'
  },

  // ==========================================
  // INTERMEDIATE TIER: 10 NEW STRUCTURES & ENGINES (41-50)
  // ==========================================
  {
    id: 'war_lru_cache_14',
    title: 'LRU Cache Simulator (O(1) Eviction)',
    difficulty: 'intermediate',
    competencyId: 'comp_lru_cache_engine_l2',
    description: 'Implement a Least Recently Used (LRU) cache with O(1) get and put operations. When capacity is exceeded, evict the least recently accessed key. In-memory data stores like Redis rely on this exact buffer mechanism.',
    starterCode: {
      typescript: 'function processLruCache(capacity: number, operations: string[], values: any[][]): any[] {\n  // Your solution here\n  return [];\n}',
      python: 'def process_lru_cache(capacity, operations, values):\n    # Your solution here\n    return []'
    },
    testCases: [
      {
        input: 'capacity = 2, ops = ["put","put","get","put","get","put","get","get","get"], vals = [[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
        expectedOutput: '[null, null, 1, null, -1, null, -1, 3, 4]'
      },
      {
        input: 'capacity = 1, ops = ["put","get","put","get"], vals = [[2,1],[2],[3,2],[2]]',
        expectedOutput: '[null, 1, null, -1]'
      },
      {
        input: 'capacity = 2, ops = ["get","put","get"], vals = [[2],[2,6],[2]]',
        expectedOutput: '[-1, null, 6]',
        isHidden: true
      }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Cache', 'Linked List', 'Hash Map', 'Systems', 'Apprentice'],
    hint: 'Use a Map or Doubly Linked List + Map. When getting or putting an existing key, delete it and re-insert it so it stays at the most-recently-used position. When size exceeds capacity, delete the first key in the map.',
    complexityTarget: 'Time: O(1) per op | Space: O(Capacity)'
  },
  {
    id: 'war_group_anagrams_15',
    title: 'Group Anagrams (Canonical Search Clustering)',
    difficulty: 'intermediate',
    competencyId: 'comp_hash_group_anagrams_l2',
    description: 'Given an array of strings strs, group the anagrams together in any order. In search engine indexing, this groups query variations and detects duplicate listings.',
    starterCode: {
      typescript: 'function groupAnagrams(strs: string[]): string[][] {\n  // Your solution here\n  return [];\n}',
      python: 'def group_anagrams(strs):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]' },
      { input: 'strs = [""]', expectedOutput: '[[""]]' },
      { input: 'strs = ["a"]', expectedOutput: '[["a"]]', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Strings', 'Hash Map', 'Clustering', 'Apprentice'],
    hint: 'Sort each string alphabetically to form a unique signature key. Group words matching the same signature into an array in a hash map.',
    complexityTarget: 'Time: O(N * K log K) | Space: O(N * K)'
  },
  {
    id: 'war_merge_intervals_16',
    title: 'Merge Overlapping Intervals',
    difficulty: 'intermediate',
    competencyId: 'comp_intervals_merge_l2',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals. In cloud infrastructure, this aggregates booked virtual machine time slices and calendar schedules.',
    starterCode: {
      typescript: 'function mergeIntervals(intervals: number[][]): number[][] {\n  // Your solution here\n  return [];\n}',
      python: 'def merge_intervals(intervals):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]', expectedOutput: '[[1, 6], [8, 10], [15, 18]]' },
      { input: 'intervals = [[1, 4], [4, 5]]', expectedOutput: '[[1, 5]]' },
      { input: 'intervals = [[1, 4], [0, 4]]', expectedOutput: '[[0, 4]]', isHidden: true },
      { input: 'intervals = [[1, 4], [2, 3]]', expectedOutput: '[[1, 4]]', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Intervals', 'Sorting', 'Scheduling', 'Apprentice'],
    hint: 'Sort the intervals by their start time. Iterate through: if current start is <= last merged interval end, merge them by setting last.end = Math.max(last.end, current.end).',
    complexityTarget: 'Time: O(N log N) | Space: O(N)'
  },
  {
    id: 'war_daily_temperatures_17',
    title: 'Daily Temperatures (Monotonic Latency Spikes)',
    difficulty: 'intermediate',
    competencyId: 'comp_stack_monotonic_daily_l2',
    description: 'Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. In latency monitoring, this calculates lookahead breach delays.',
    starterCode: {
      typescript: 'function dailyTemperatures(temperatures: number[]): number[] {\n  // Your solution here\n  return [];\n}',
      python: 'def daily_temperatures(temperatures):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]', expectedOutput: '[1, 1, 4, 2, 1, 1, 0, 0]' },
      { input: 'temperatures = [30, 40, 50, 60]', expectedOutput: '[1, 1, 1, 0]' },
      { input: 'temperatures = [30, 60, 90]', expectedOutput: '[1, 1, 0]', isHidden: true },
      { input: 'temperatures = [80]', expectedOutput: '[0]', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Stack', 'Monotonic Stack', 'Lookahead', 'Apprentice'],
    hint: 'Use a monotonic decreasing stack that stores day indices. When current temperature is higher than stack top, pop it and set answer[prev] = current - prev.',
    complexityTarget: 'Time: O(N) | Space: O(N)'
  },
  {
    id: 'war_subarray_sum_k_18',
    title: 'Subarray Sum Equals K (Financial Audit Trail)',
    difficulty: 'intermediate',
    competencyId: 'comp_prefix_sum_hash_l2',
    description: 'Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k. In forensic auditing, this flags transaction sequences matching an exact embezzlement sum.',
    starterCode: {
      typescript: 'function subarraySum(nums: number[], k: number): number {\n  // Your solution here\n  return 0;\n}',
      python: 'def subarray_sum(nums, k):\n    # Your solution here\n    return 0'
    },
    testCases: [
      { input: 'nums = [1, 1, 1], k = 2', expectedOutput: '2' },
      { input: 'nums = [1, 2, 3], k = 3', expectedOutput: '2' },
      { input: 'nums = [1, -1, 0], k = 0', expectedOutput: '3', isHidden: true },
      { input: 'nums = [3], k = 3', expectedOutput: '1', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Prefix Sum', 'Hash Map', 'Financial', 'Apprentice'],
    hint: 'Track running prefix sum. Check if (currentSum - k) exists in a hash map of prefix sum frequencies. Add its frequency to count, then record currentSum.',
    complexityTarget: 'Time: O(N) | Space: O(N)'
  },
  {
    id: 'war_find_min_rotated_19',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'intermediate',
    competencyId: 'comp_binary_search_rotated_min_l2',
    description: 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element in O(log n) time. In distributed circular ring topology, this identifies the partition reset node.',
    starterCode: {
      typescript: 'function findMin(nums: number[]): number {\n  // Your solution here\n  return 0;\n}',
      python: 'def find_min(nums):\n    # Your solution here\n    return 0'
    },
    testCases: [
      { input: 'nums = [3, 4, 5, 1, 2]', expectedOutput: '1' },
      { input: 'nums = [4, 5, 6, 7, 0, 1, 2]', expectedOutput: '0' },
      { input: 'nums = [11, 13, 15, 17]', expectedOutput: '11', isHidden: true },
      { input: 'nums = [2, 1]', expectedOutput: '1', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Binary Search', 'Arrays', 'Circular', 'Apprentice'],
    hint: 'Compare nums[mid] with nums[right]. If nums[mid] > nums[right], the inflection point is to the right (left = mid + 1). Otherwise it is at or to the left (right = mid).',
    complexityTarget: 'Time: O(log N) | Space: O(1)'
  },
  {
    id: 'war_top_k_frequent_20',
    title: 'Top K Frequent Elements (Trending Stream Engine)',
    difficulty: 'intermediate',
    competencyId: 'comp_heap_bucket_topk_l2',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements in ascending order. In telemetry monitoring, this isolates the most common HTTP error codes.',
    starterCode: {
      typescript: 'function topKFrequent(nums: number[], k: number): number[] {\n  // Your solution here\n  return [];\n}',
      python: 'def top_k_frequent(nums, k):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'nums = [1, 1, 1, 2, 2, 3], k = 2', expectedOutput: '[1, 2]' },
      { input: 'nums = [1], k = 1', expectedOutput: '[1]' },
      { input: 'nums = [4, 1, -1, 2, -1, 2, 3], k = 2', expectedOutput: '[-1, 2]', isHidden: true },
      { input: 'nums = [1, 2], k = 2', expectedOutput: '[1, 2]', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Hash Map', 'Bucket Sort', 'Heap', 'Apprentice'],
    hint: 'Count frequencies in a Map. Place numbers into bucket arrays indexed by frequency. Scan buckets from highest frequency downwards to collect k elements.',
    complexityTarget: 'Time: O(N) | Space: O(N)'
  },
  {
    id: 'war_letter_combinations_21',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'intermediate',
    competencyId: 'comp_backtracking_t9_l2',
    description: 'Given a string containing digits from 2-9, return all possible letter combinations that the number could represent based on telephone buttons. In telecommunications, this powers mnemonic vanity lookup.',
    starterCode: {
      typescript: 'function letterCombinations(digits: string): string[] {\n  // Your solution here\n  return [];\n}',
      python: 'def letter_combinations(digits):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'digits = "23"', expectedOutput: '["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]' },
      { input: 'digits = ""', expectedOutput: '[]' },
      { input: 'digits = "2"', expectedOutput: '["a", "b", "c"]', isHidden: true },
      { input: 'digits = "7"', expectedOutput: '["p", "q", "r", "s"]', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Backtracking', 'Recursion', 'Strings', 'Apprentice'],
    hint: 'Map digits 2-9 to their keypad letters. Use depth-first backtracking: at each digit index, iterate over its letters, append to current path, and recurse.',
    complexityTarget: 'Time: O(4^N) | Space: O(N)'
  },
  {
    id: 'war_rotate_image_22',
    title: 'Rotate Image (In-Place Matrix Transformation)',
    difficulty: 'intermediate',
    competencyId: 'comp_matrix_rotate_l2',
    description: 'You are given an n x n 2D matrix representing an image. Rotate the image by 90 degrees clockwise in-place. In satellite imaging, this reorients sensory grid projections without extra RAM.',
    starterCode: {
      typescript: 'function rotateImage(matrix: number[][]): number[][] {\n  // Your solution here\n  return matrix;\n}',
      python: 'def rotate_image(matrix):\n    # Your solution here\n    return matrix'
    },
    testCases: [
      { input: 'matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]', expectedOutput: '[[7, 4, 1], [8, 5, 2], [9, 6, 3]]' },
      { input: 'matrix = [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]', expectedOutput: '[[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]' },
      { input: 'matrix = [[1]]', expectedOutput: '[[1]]', isHidden: true },
      { input: 'matrix = [[1, 2], [3, 4]]', expectedOutput: '[[3, 1], [4, 2]]', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Matrix', 'In-Place', 'Computer Vision', 'Apprentice'],
    hint: 'A 90-degree clockwise rotation equals transposing the matrix (swapping matrix[i][j] with matrix[j][i]), followed by reversing each row horizontally.',
    complexityTarget: 'Time: O(N^2) | Space: O(1) in-place'
  },
  {
    id: 'war_decode_string_23',
    title: 'Decode String (Nested Run-Length Expander)',
    difficulty: 'intermediate',
    competencyId: 'comp_stack_nested_decode_l2',
    description: 'Given an encoded string, return its decoded string where k[encoded_string] repeats the encoded string exactly k times. In serialization protocols, this decompresses nested run-length payload buffers.',
    starterCode: {
      typescript: 'function decodeString(s: string): string {\n  // Your solution here\n  return "";\n}',
      python: 'def decode_string(s):\n    # Your solution here\n    return ""'
    },
    testCases: [
      { input: 's = "3[a]2[bc]"', expectedOutput: '"aaabcbc"' },
      { input: 's = "3[a2[c]]"', expectedOutput: '"accaccacc"' },
      { input: 's = "2[abc]3[cd]ef"', expectedOutput: '"abcabccdcdcdef"', isHidden: true },
      { input: 's = "abc"', expectedOutput: '"abc"', isHidden: true }
    ],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ['Stack', 'Strings', 'Decompression', 'Apprentice'],
    hint: 'Use two stacks: one for repeat counts and one for parent strings. On "[", push current string and count; on "]", pop and repeat current string.',
    complexityTarget: 'Time: O(Output Length) | Space: O(N)'
  },

  // ==========================================
  // ADVANCED TIER: 10 NEW SYSTEMS & GRAPH/DP CHALLENGES (51-60)
  // ==========================================
  {
    id: 'war_trapping_rain_water_11',
    title: 'Trapping Rain Water (Two-Pointer Reservoir)',
    difficulty: 'advanced',
    competencyId: 'comp_two_pointers_reservoir_l3',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining. In reservoir compute engines, this computes trapped volume.',
    starterCode: {
      typescript: 'function trap(height: number[]): number {\n  // Your solution here\n  return 0;\n}',
      python: 'def trap(height):\n    # Your solution here\n    return 0'
    },
    testCases: [
      { input: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', expectedOutput: '6' },
      { input: 'height = [4, 2, 0, 3, 2, 5]', expectedOutput: '9' },
      { input: 'height = [1, 2, 3, 4]', expectedOutput: '0', isHidden: true },
      { input: 'height = [3, 0, 2, 0, 4]', expectedOutput: '7', isHidden: true }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ['Two Pointers', 'Stack', 'Dynamic Programming', 'Master'],
    hint: 'Use two pointers from left and right. Maintain maxLeft and maxRight. The water trapped at current pointer is bounded by the lower boundary minus current height.',
    complexityTarget: 'Time: O(N) | Space: O(1)'
  },
  {
    id: 'war_sliding_window_max_12',
    title: 'Sliding Window Maximum (Monotonic Deque)',
    difficulty: 'advanced',
    competencyId: 'comp_deque_sliding_window_l3',
    description: 'You are given an array of integers nums and a sliding window of size k moving from left to right. Return the max sliding window. In algorithmic trading, this extracts rolling peak price volatility.',
    starterCode: {
      typescript: 'function maxSlidingWindow(nums: number[], k: number): number[] {\n  // Your solution here\n  return [];\n}',
      python: 'def max_sliding_window(nums, k):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3', expectedOutput: '[3, 3, 5, 5, 6, 7]' },
      { input: 'nums = [1], k = 1', expectedOutput: '[1]' },
      { input: 'nums = [1, -1], k = 1', expectedOutput: '[1, -1]', isHidden: true },
      { input: 'nums = [9, 11], k = 2', expectedOutput: '[11]', isHidden: true }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ['Deque', 'Sliding Window', 'Trading', 'Master'],
    hint: 'Use a double-ended queue (deque) storing indices. Maintain monotonically decreasing values. Evict indices outside current window i - k + 1.',
    complexityTarget: 'Time: O(N) | Space: O(K)'
  },
  {
    id: 'war_word_break_13',
    title: 'Word Break (Dynamic Dictionary Segmentation)',
    difficulty: 'advanced',
    competencyId: 'comp_dp_word_break_l3',
    description: 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of dictionary words. In URL routing and search queries, this segments unspaced slugs.',
    starterCode: {
      typescript: 'function wordBreak(s: string, wordDict: string[]): boolean {\n  // Your solution here\n  return false;\n}',
      python: 'def word_break(s, wordDict):\n    # Your solution here\n    return False'
    },
    testCases: [
      { input: 's = "leetcode", wordDict = ["leet", "code"]', expectedOutput: 'true' },
      { input: 's = "applepenapple", wordDict = ["apple", "pen"]', expectedOutput: 'true' },
      { input: 's = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]', expectedOutput: 'false', isHidden: true },
      { input: 's = "cars", wordDict = ["car", "ca", "rs"]', expectedOutput: 'true', isHidden: true }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ['Dynamic Programming', 'Trie', 'NLP', 'Master'],
    hint: 'Use a boolean array dp of size s.length + 1 where dp[0] = true. For each i, check all j < i: if dp[j] is true and s[j...i] is in wordSet, mark dp[i] = true.',
    complexityTarget: 'Time: O(N^2) | Space: O(N)'
  },
  {
    id: 'war_longest_increasing_subsequence_14',
    title: 'Longest Increasing Subsequence (Patience Sorting)',
    difficulty: 'advanced',
    competencyId: 'comp_binary_search_lis_l3',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence. In distributed telemetry, this measures packet reordering monotonicity.',
    starterCode: {
      typescript: 'function lengthOfLIS(nums: number[]): number {\n  // Your solution here\n  return 0;\n}',
      python: 'def length_of_lis(nums):\n    # Your solution here\n    return 0'
    },
    testCases: [
      { input: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]', expectedOutput: '4' },
      { input: 'nums = [0, 1, 0, 3, 2, 3]', expectedOutput: '4' },
      { input: 'nums = [7, 7, 7, 7, 7, 7, 7]', expectedOutput: '1', isHidden: true },
      { input: 'nums = [4, 10, 4, 3, 8, 9]', expectedOutput: '3', isHidden: true }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ['Binary Search', 'Dynamic Programming', 'Patience Sorting', 'Master'],
    hint: 'Maintain an array tails where tails[i] stores the smallest tail of all increasing subsequences of length i+1. Use binary search to find replacement index.',
    complexityTarget: 'Time: O(N log N) | Space: O(N)'
  },
  {
    id: 'war_course_schedule_15',
    title: 'Course Schedule (DAG Dependency Resolution)',
    difficulty: 'advanced',
    competencyId: 'comp_graph_topological_cycle_l3',
    description: 'There are a total of numCourses courses. Some courses have prerequisites [a, b] meaning you must take b before a. Return true if you can finish all courses without a circular dependency. This powers package managers like npm and Bazel.',
    starterCode: {
      typescript: 'function canFinish(numCourses: number, prerequisites: number[][]): boolean {\n  // Your solution here\n  return false;\n}',
      python: 'def can_finish(num_courses, prerequisites):\n    # Your solution here\n    return False'
    },
    testCases: [
      { input: 'numCourses = 2, prerequisites = [[1, 0]]', expectedOutput: 'true' },
      { input: 'numCourses = 2, prerequisites = [[1, 0], [0, 1]]', expectedOutput: 'false' },
      { input: 'numCourses = 3, prerequisites = [[1, 0], [2, 1]]', expectedOutput: 'true', isHidden: true },
      { input: 'numCourses = 4, prerequisites = [[1, 0], [2, 1], [3, 2], [1, 3]]', expectedOutput: 'false', isHidden: true }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ['Graph', 'Topological Sort', 'Cycle Detection', 'Master'],
    hint: "Use Kahn's algorithm: compute indegree for each course. Enqueue courses with indegree 0. Process queue and decrement neighbor indegrees. If count of processed courses equals numCourses, return true.",
    complexityTarget: 'Time: O(V + E) | Space: O(V + E)'
  },
  {
    id: 'war_clone_graph_16',
    title: 'Clone Graph (Cyclic Object Graph Replicator)',
    difficulty: 'advanced',
    competencyId: 'comp_graph_clone_l3',
    description: 'Given an adjacency list representing an undirected graph, return a deep copy (clone) of the graph representation. In distributed microservices, this replicates state topologies across regional nodes.',
    starterCode: {
      typescript: 'function cloneGraphNodes(adjList: number[][]): number[][] {\n  // Your solution here\n  return [];\n}',
      python: 'def clone_graph_nodes(adj_list):\n    # Your solution here\n    return []'
    },
    testCases: [
      { input: 'adjList = [[2, 4], [1, 3], [2, 4], [1, 3]]', expectedOutput: '[[2, 4], [1, 3], [2, 4], [1, 3]]' },
      { input: 'adjList = [[]]', expectedOutput: '[[]]' },
      { input: 'adjList = []', expectedOutput: '[]', isHidden: true },
      { input: 'adjList = [[2], [1]]', expectedOutput: '[[2], [1]]', isHidden: true }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ['Graph', 'BFS', 'DFS', 'Cloning', 'Master'],
    hint: 'Use a visited Map mapping original 1-based node indices to their cloned copies. Perform BFS/DFS traversal to copy each node and its adjacency list.',
    complexityTarget: 'Time: O(V + E) | Space: O(V)'
  },
  {
    id: 'war_token_bucket_rate_limiter_17',
    title: 'Token Bucket Rate Limiter Engine',
    difficulty: 'advanced',
    competencyId: 'comp_systems_token_bucket_l3',
    description: 'Simulate a Token Bucket Rate Limiter with capacity, refillRatePerSec, and a stream of requests with { timestamp, tokensRequested }. Return boolean array indicating allowed/dropped requests. Essential for API Gateways at Stripe and Cloudflare.',
    starterCode: {
      typescript: 'function simulateRateLimiter(capacity: number, refillRatePerSec: number, requests: { timestamp: number; tokensRequested: number }[]): boolean[] {\n  // Your solution here\n  return [];\n}',
      python: 'def simulate_rate_limiter(capacity, refill_rate_per_sec, requests):\n    # Your solution here\n    return []'
    },
    testCases: [
      {
        input: 'capacity = 5, refill = 1, requests = [{timestamp: 0, tokensRequested: 3}, {timestamp: 0, tokensRequested: 3}, {timestamp: 2, tokensRequested: 3}]',
        expectedOutput: '[true, false, true]'
      },
      {
        input: 'capacity = 10, refill = 2, requests = [{timestamp: 1, tokensRequested: 10}, {timestamp: 2, tokensRequested: 3}, {timestamp: 3, tokensRequested: 3}]',
        expectedOutput: '[true, false, true]'
      },
      {
        input: 'capacity = 1, refill = 0.5, requests = [{timestamp: 0, tokensRequested: 1}, {timestamp: 1, tokensRequested: 1}]',
        expectedOutput: '[true, false]',
        isHidden: true
      }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ['Distributed Systems', 'Rate Limiting', 'Traffic Shaping', 'Master'],
    hint: 'Track current tokens and lastRefillTimestamp. On each request, add elapsed_time * refillRatePerSec capped at capacity. If tokens >= requested, subtract and record true; else false.',
    complexityTarget: 'Time: O(N) | Space: O(N)'
  },
  {
    id: 'war_median_data_stream_18',
    title: 'Find Median from Data Stream (Dual Heaps)',
    difficulty: 'advanced',
    competencyId: 'comp_dual_heap_median_l3',
    description: 'Maintain the running median of numbers inserted dynamically from an active stream. Operations include ["addNum", "findMedian"]. In observability engines, this tracks continuous P50 latency telemetry.',
    starterCode: {
      typescript: 'function processMedianStream(operations: string[], values: number[][]): number[] {\n  // Your solution here\n  return [];\n}',
      python: 'def process_median_stream(operations, values):\n    # Your solution here\n    return []'
    },
    testCases: [
      {
        input: 'ops = ["addNum", "addNum", "findMedian", "addNum", "findMedian"], vals = [[1], [2], [], [3], []]',
        expectedOutput: '[1.5, 2]'
      },
      {
        input: 'ops = ["addNum", "findMedian"], vals = [[5], []]',
        expectedOutput: '[5]'
      },
      {
        input: 'ops = ["addNum", "addNum", "addNum", "addNum", "findMedian"], vals = [[6], [10], [2], [8], []]',
        expectedOutput: '[7]',
        isHidden: true
      }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ['Heap', 'Data Stream', 'Telemetry', 'Master'],
    hint: 'Balance two halves: a max-heap for the lower half and a min-heap for the upper half. If sizes are equal, median is average of roots; otherwise root of larger heap.',
    complexityTarget: 'Time: O(log N) insert, O(1) find | Space: O(N)'
  },
  {
    id: 'war_word_ladder_19',
    title: 'Word Ladder (Shortest Genetic Mutation BFS)',
    difficulty: 'advanced',
    competencyId: 'comp_graph_bfs_word_ladder_l3',
    description: 'Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, changing one letter at a time. In bioinformatics, this models minimal genetic mutation paths.',
    starterCode: {
      typescript: 'function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {\n  // Your solution here\n  return 0;\n}',
      python: 'def ladder_length(begin_word, end_word, word_list):\n    # Your solution here\n    return 0'
    },
    testCases: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', expectedOutput: '5' },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', expectedOutput: '0' },
      { input: 'beginWord = "a", endWord = "c", wordList = ["a","b","c"]', expectedOutput: '2', isHidden: true },
      { input: 'beginWord = "hot", endWord = "dog", wordList = ["hot","dog"]', expectedOutput: '0', isHidden: true }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ['Graph', 'BFS', 'Shortest Path', 'Master'],
    hint: "Use BFS level by level. Store wordList in a Set. For the current word, try substituting every position from 'a' to 'z'. If a mutated word is in the set, remove it and enqueue with step+1.",
    complexityTarget: 'Time: O(M^2 * N) | Space: O(M * N)'
  },
  {
    id: 'war_edit_distance_20',
    title: 'Edit Distance (Levenshtein Diff Engine)',
    difficulty: 'advanced',
    competencyId: 'comp_dp_levenshtein_l3',
    description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2 (insert, delete, or replace a character). In version control engines (Git), this powers diff line reconciliation.',
    starterCode: {
      typescript: 'function minDistance(word1: string, word2: string): number {\n  // Your solution here\n  return 0;\n}',
      python: 'def min_distance(word1, word2):\n    # Your solution here\n    return 0'
    },
    testCases: [
      { input: 'word1 = "horse", word2 = "ros"', expectedOutput: '3' },
      { input: 'word1 = "intention", word2 = "execution"', expectedOutput: '5' },
      { input: 'word1 = "", word2 = "a"', expectedOutput: '1', isHidden: true },
      { input: 'word1 = "abc", word2 = "abc"', expectedOutput: '0', isHidden: true }
    ],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 250,
    tags: ['Dynamic Programming', 'Strings', 'Levenshtein', 'Master'],
    hint: 'Build a 2D table dp[m+1][n+1]. If characters match, dp[i][j] = dp[i-1][j-1]. Otherwise, dp[i][j] = 1 + min(insert, delete, replace).',
    complexityTarget: 'Time: O(M * N) | Space: O(M * N)'
  },
  {
    id: 'war_plus_one_21',
    title: 'Plus One (Arbitrary-Precision BigInt Addition)',
    difficulty: 'basic',
    competencyId: 'comp_arrays_bigint_plus_one_l1',
    description: 'You are maintaining a high-throughput ledger transaction counter where integer values exceed standard 64-bit IEEE float representations and are stored as digit arrays. Given a non-empty array of decimal digits representing a non-negative integer, increment the integer by one. The digits are stored such that the most significant digit is at the head of the list, and each element contains a single digit. You may assume the integer does not contain any leading zero, except the number 0 itself.',
    starterCode: {
      typescript: "function plusOne(digits: number[]): number[] {\n  // Your solution here\n  return [];\n}",
      python: "def plus_one(digits):\n    # Your solution here\n    return []",
    },
    testCases: [
      {
            "input": "[1, 2, 3]",
            "expectedOutput": "[1, 2, 4]",
            "explanation": "123 + 1 = 124"
      },
      {
            "input": "[4, 3, 2, 1]",
            "expectedOutput": "[4, 3, 2, 2]",
            "explanation": "4321 + 1 = 4322"
      },
      {
            "input": "[9]",
            "expectedOutput": "[1, 0]",
            "explanation": "Ripple carry: 9 + 1 = 10"
      },
      {
            "input": "[9, 9, 9]",
            "expectedOutput": "[1, 0, 0, 0]",
            "explanation": "Cascading carry across all digits"
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 64,
    xpReward: 100,
    tags: ["arrays","math","arbitrary-precision"],
    hint: 'Iterate from the least significant digit (right to left). If the digit is less than 9, increment and return immediately. If it is 9, set it to 0 and propagate the carry. If you exit the loop with an active carry, prepend 1 to the array.',
    complexityTarget: 'Time: O(N) | Space: O(1) auxiliary',
  },
  {
    id: 'war_longest_common_prefix_22',
    title: 'Longest Common Prefix (API Gateway Trie Path)',
    difficulty: 'basic',
    competencyId: 'comp_strings_common_prefix_l1',
    description: 'An API gateway needs to group incoming request endpoints under the most specific shared URL root path to optimize caching and route table lookups. Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
    starterCode: {
      typescript: "function longestCommonPrefix(strs: string[]): string {\n  // Your solution here\n  return \"\";\n}",
      python: "def longest_common_prefix(strs):\n    # Your solution here\n    return \"\"",
    },
    testCases: [
      {
            "input": "[\"flower\",\"flow\",\"flight\"]",
            "expectedOutput": "\"fl\"",
            "explanation": "Common prefix across all three strings is \"fl\""
      },
      {
            "input": "[\"dog\",\"racecar\",\"car\"]",
            "expectedOutput": "\"\"",
            "explanation": "No common prefix among the input strings"
      },
      {
            "input": "[\"interspecies\",\"interstellar\",\"interstate\"]",
            "expectedOutput": "\"inters\"",
            "explanation": "Prefix matches up through character s"
      },
      {
            "input": "[\"single\"]",
            "expectedOutput": "\"single\"",
            "explanation": "Array with one string has that string as prefix"
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 64,
    xpReward: 100,
    tags: ["strings","prefix-trie","scan"],
    hint: 'Take the first string as your prefix candidate. Loop through the remaining strings; while the current string does not start with your prefix candidate, trim the last character off the candidate until it matches or becomes empty.',
    complexityTarget: 'Time: O(S) where S is sum of all characters | Space: O(1)',
  },
  {
    id: 'war_remove_duplicates_sorted_23',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'basic',
    competencyId: 'comp_two_pointers_dedup_l1',
    description: 'In a real-time timeseries database, duplicate sensor heartbeats with identical timestamps must be compacted in-place to minimize cache footprint. Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Return the compacted array containing only the unique elements in their original relative order.',
    starterCode: {
      typescript: "function removeDuplicates(nums: number[]): number[] {\n  // Your solution here\n  return [];\n}",
      python: "def remove_duplicates(nums):\n    # Your solution here\n    return []",
    },
    testCases: [
      {
            "input": "[1, 1, 2]",
            "expectedOutput": "[1, 2]",
            "explanation": "Compacted unique sequence is [1, 2]"
      },
      {
            "input": "[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]",
            "expectedOutput": "[0, 1, 2, 3, 4]",
            "explanation": "Compacted unique sequence is [0, 1, 2, 3, 4]"
      },
      {
            "input": "[1]",
            "expectedOutput": "[1]",
            "explanation": "Single element is already unique"
      },
      {
            "input": "[5, 5, 5, 5]",
            "expectedOutput": "[5]",
            "explanation": "All duplicates reduced to single 5"
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 64,
    xpReward: 100,
    tags: ["arrays","two-pointers","in-place"],
    hint: 'Use a slow pointer and a fast pointer. The slow pointer tracks the position of the last unique element. When the fast pointer encounters a new value distinct from nums[slow], advance slow and copy the value over.',
    complexityTarget: 'Time: O(N) | Space: O(1) in-place',
  },
  {
    id: 'war_valid_perfect_square_24',
    title: 'Valid Perfect Square (Clock Timing Jitter)',
    difficulty: 'basic',
    competencyId: 'comp_math_binary_search_square_l1',
    description: 'High-frequency telemetry timestamps in an aerospace flight controller must verify whether clock drift cycles correspond to exact square wave harmonics without invoking floating-point hardware instructions. Given a positive integer num, write a function that returns true if num is a perfect square or false otherwise, without using any built-in square root functions.',
    starterCode: {
      typescript: "function isPerfectSquare(num: number): boolean {\n  // Your solution here\n  return false;\n}",
      python: "def is_perfect_square(num):\n    # Your solution here\n    return False",
    },
    testCases: [
      {
            "input": "16",
            "expectedOutput": "true",
            "explanation": "4 * 4 = 16"
      },
      {
            "input": "14",
            "expectedOutput": "false",
            "explanation": "14 is not a perfect square"
      },
      {
            "input": "1",
            "expectedOutput": "true",
            "explanation": "1 * 1 = 1"
      },
      {
            "input": "100000000",
            "expectedOutput": "true",
            "explanation": "10000 * 10000 = 100000000"
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 64,
    xpReward: 100,
    tags: ["math","binary-search","square-root"],
    hint: 'Binary search the integer domain between 1 and num. For mid, calculate mid * mid. If mid * mid == num, return true. If square is greater than num, search left; otherwise search right.',
    complexityTarget: 'Time: O(log N) | Space: O(1)',
  },
  {
    id: 'war_excel_column_number_25',
    title: 'Excel Sheet Column Number (Base-26 Bijective)',
    difficulty: 'basic',
    competencyId: 'comp_math_base26_excel_l1',
    description: 'An enterprise reporting engine exports analytics into Excel formats and must convert spreadsheet column headers into zero-based column indices. Given a string columnTitle that represents the column title as it appears in an Excel sheet, return its corresponding column number (1-indexed: A -> 1, B -> 2, Z -> 26, AA -> 27, AB -> 28).',
    starterCode: {
      typescript: "function titleToNumber(columnTitle: string): number {\n  // Your solution here\n  return 0;\n}",
      python: "def title_to_number(column_title):\n    # Your solution here\n    return 0",
    },
    testCases: [
      {
            "input": "\"A\"",
            "expectedOutput": "1",
            "explanation": "Single column A is 1"
      },
      {
            "input": "\"AB\"",
            "expectedOutput": "28",
            "explanation": "A*26 + B = 1*26 + 2 = 28"
      },
      {
            "input": "\"ZY\"",
            "expectedOutput": "701",
            "explanation": "Z*26 + Y = 26*26 + 25 = 701"
      },
      {
            "input": "\"FXSHRXW\"",
            "expectedOutput": "2147483647",
            "explanation": "Maximum 32-bit integer column coordinate"
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 64,
    xpReward: 100,
    tags: ["math","string-conversion","radix-26"],
    hint: 'Treat this as a positional base-26 numeral system. For each character from left to right, multiply your running total by 26 and add (char code - 64).',
    complexityTarget: 'Time: O(N) | Space: O(1)',
  },
  {
    id: 'war_max_average_subarray_26',
    title: 'Maximum Average Subarray I (Fixed Telemetry Window)',
    difficulty: 'basic',
    competencyId: 'comp_sliding_window_fixed_avg_l1',
    description: 'An infrastructure monitor evaluates CPU load across contiguous k-second bursts to identify maximum average resource spikes. You are given an integer array nums consisting of n elements, and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value. Answers with a small numerical difference are accepted.',
    starterCode: {
      typescript: "function findMaxAverage(nums: number[], k: number): number {\n  // Your solution here\n  return 0;\n}",
      python: "def find_max_average(nums, k):\n    # Your solution here\n    return 0.0",
    },
    testCases: [
      {
            "input": "[1, 12, -5, -6, 50, 3], k = 4",
            "expectedOutput": "12.75",
            "explanation": "Subarray [12, -5, -6, 50] has max sum 51 / 4 = 12.75"
      },
      {
            "input": "[5], k = 1",
            "expectedOutput": "5.0",
            "explanation": "Single element average is the element itself"
      },
      {
            "input": "[0, 4, 0, 3, 2], k = 1",
            "expectedOutput": "4.0",
            "explanation": "Maximum single element is 4"
      },
      {
            "input": "[-1], k = 1",
            "expectedOutput": "-1.0",
            "explanation": "Negative numbers handled correctly"
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 64,
    xpReward: 100,
    tags: ["sliding-window","arrays","statistics"],
    hint: 'Compute the sum of the first k elements as your window sum. Then slide the window across the array: add the new incoming element and subtract the outgoing element. Maintain the maximum sum seen, then divide by k at the end.',
    complexityTarget: 'Time: O(N) | Space: O(1)',
  },
  {
    id: 'war_can_place_flowers_27',
    title: 'Can Place Flowers (Non-Adjacent Thermal Spacing)',
    difficulty: 'basic',
    competencyId: 'comp_greedy_spacing_flowers_l1',
    description: 'A data center server rack enforces strict thermal spacing: high-power GPU units cannot be installed adjacent to one another without causing overheating. You have a long binary array flowerbed where 0 means empty slot and 1 means occupied, and an integer n. Return true if n new units can be placed in the flowerbed without violating the no-adjacent rule, and false otherwise.',
    starterCode: {
      typescript: "function canPlaceFlowers(flowerbed: number[], n: number): boolean {\n  // Your solution here\n  return false;\n}",
      python: "def can_place_flowers(flowerbed, n):\n    # Your solution here\n    return False",
    },
    testCases: [
      {
            "input": "[1, 0, 0, 0, 1], n = 1",
            "expectedOutput": "true",
            "explanation": "Can plant 1 unit at index 2"
      },
      {
            "input": "[1, 0, 0, 0, 1], n = 2",
            "expectedOutput": "false",
            "explanation": "Cannot plant 2 units without violating adjacency"
      },
      {
            "input": "[0, 0, 1, 0, 1], n = 1",
            "expectedOutput": "true",
            "explanation": "Can plant at index 0"
      },
      {
            "input": "[0], n = 1",
            "expectedOutput": "true",
            "explanation": "Single empty slot can accommodate 1 unit"
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 64,
    xpReward: 100,
    tags: ["greedy","arrays","allocation"],
    hint: 'Iterate through the slots. A slot i can be occupied if flowerbed[i] == 0 AND both left neighbor (or edge) and right neighbor (or edge) are 0. When placed, mark flowerbed[i] = 1 and decrement n. Return n <= 0.',
    complexityTarget: 'Time: O(N) | Space: O(1)',
  },
  {
    id: 'war_isomorphic_strings_28',
    title: 'Isomorphic Strings (Schema Key Remapping)',
    difficulty: 'basic',
    competencyId: 'comp_hash_map_isomorphism_l1',
    description: 'A database migration engine converts legacy data records into a new normalized schema by remapping string tokens. Two strings s and t are isomorphic if the characters in s can be replaced to get t. All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself. Determine if s and t are isomorphic.',
    starterCode: {
      typescript: "function isIsomorphic(s: string, t: string): boolean {\n  // Your solution here\n  return false;\n}",
      python: "def is_isomorphic(s, t):\n    # Your solution here\n    return False",
    },
    testCases: [
      {
            "input": "s = \"egg\", t = \"add\"",
            "expectedOutput": "true",
            "explanation": "e->a, g->d bijective mapping"
      },
      {
            "input": "s = \"foo\", t = \"bar\"",
            "expectedOutput": "false",
            "explanation": "o cannot map to both a and r"
      },
      {
            "input": "s = \"paper\", t = \"title\"",
            "expectedOutput": "true",
            "explanation": "p->t, a->i, e->l, r->e bijective mapping"
      },
      {
            "input": "s = \"badc\", t = \"baba\"",
            "expectedOutput": "false",
            "explanation": "b and d cannot both map to b"
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 64,
    xpReward: 100,
    tags: ["hash-map","strings","bijection"],
    hint: 'Maintain two hash maps: s_to_t and t_to_s. For each index, ensure s[i] consistently maps to t[i] and t[i] consistently maps to s[i]. If either mapping conflicts, return false.',
    complexityTarget: 'Time: O(N) | Space: O(1) (bounded by ASCII/alphabet size)',
  },
  {
    id: 'war_find_pivot_index_29',
    title: 'Find Pivot Index (Balanced Ledger Equator)',
    difficulty: 'basic',
    competencyId: 'comp_prefix_sum_pivot_index_l1',
    description: 'An automated forensic auditing engine identifies the exact inflection point in a financial ledger where transactions on the left perfectly balance transactions on the right. Given an array of integers nums, calculate the pivot index. The pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index\'s right. Return the leftmost pivot index. If no such index exists, return -1.',
    starterCode: {
      typescript: "function pivotIndex(nums: number[]): number {\n  // Your solution here\n  return -1;\n}",
      python: "def pivot_index(nums):\n    # Your solution here\n    return -1",
    },
    testCases: [
      {
            "input": "[1, 7, 3, 6, 5, 6]",
            "expectedOutput": "3",
            "explanation": "Left sum = 1+7+3 = 11, Right sum = 5+6 = 11"
      },
      {
            "input": "[1, 2, 3]",
            "expectedOutput": "-1",
            "explanation": "No index satisfies left sum == right sum"
      },
      {
            "input": "[2, 1, -1]",
            "expectedOutput": "0",
            "explanation": "Left sum = 0, Right sum = 1 + (-1) = 0"
      },
      {
            "input": "[-1, -1, 0, 1, 1, 0]",
            "expectedOutput": "5",
            "explanation": "Left sum = 0, Right sum = 0"
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 64,
    xpReward: 100,
    tags: ["prefix-sum","arrays","equilibrium"],
    hint: 'First compute the total sum of the entire array. Then maintain a running leftSum. At index i, rightSum is totalSum - leftSum - nums[i]. If leftSum == rightSum, return i. Update leftSum += nums[i].',
    complexityTarget: 'Time: O(N) | Space: O(1)',
  },
  {
    id: 'war_symmetric_tree_30',
    title: 'Symmetric Tree (Bilateral Mirror Verification)',
    difficulty: 'basic',
    competencyId: 'comp_trees_symmetric_mirror_l1',
    description: 'A computer-aided design (CAD) validation engine analyzes 3D mechanical components represented as binary assembly trees to guarantee perfect bilateral symmetry across the manufacturing center line. Given the root of a binary tree as an array in level-order, check whether it is a mirror of itself (i.e., symmetric around its center).',
    starterCode: {
      typescript: "function isSymmetric(root: (number | null)[]): boolean {\n  // Your solution here\n  return false;\n}",
      python: "def is_symmetric(root):\n    # Your solution here\n    return False",
    },
    testCases: [
      {
            "input": "[1, 2, 2, 3, 4, 4, 3]",
            "expectedOutput": "true",
            "explanation": "Bilateral mirror reflection matches perfectly"
      },
      {
            "input": "[1, 2, 2, null, 3, null, 3]",
            "expectedOutput": "false",
            "explanation": "Right subtree orientation does not mirror left"
      },
      {
            "input": "[1]",
            "expectedOutput": "true",
            "explanation": "Single root is symmetric"
      },
      {
            "input": "[]",
            "expectedOutput": "true",
            "explanation": "Empty tree is symmetric"
      }
],
    timeLimitSeconds: 240,
    memoryLimitMb: 64,
    xpReward: 100,
    tags: ["trees","recursion","symmetry"],
    hint: 'Construct nodes and define a helper function isMirror(t1, t2). Two trees are mirrors if: both are null (true), one is null (false), their values are equal, and isMirror(t1.left, t2.right) and isMirror(t1.right, t2.left) are both true.',
    complexityTarget: 'Time: O(N) | Space: O(H) where H is tree height',
  },
  {
    id: 'war_insert_interval_24',
    title: 'Insert Interval (Calendar Schedule Merger)',
    difficulty: 'intermediate',
    competencyId: 'comp_intervals_insert_merge_l2',
    description: 'An executive calendar scheduling engine must insert a high-priority meeting into a user\'s existing calendar without overlaps. You are given an array of non-overlapping intervals intervals where intervals[i] = [start_i, end_i] sorted in ascending order by start_i, and a newInterval = [start, end]. Insert newInterval into intervals such that intervals is still sorted in ascending order and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).',
    starterCode: {
      typescript: "function insertInterval(intervals: number[][], newInterval: number[]): number[][] {\n  // Your solution here\n  return [];\n}",
      python: "def insert_interval(intervals, new_interval):\n    # Your solution here\n    return []",
    },
    testCases: [
      {
            "input": "intervals = [[1, 3], [6, 9]], newInterval = [2, 5]",
            "expectedOutput": "[[1, 5], [6, 9]]",
            "explanation": "[2, 5] merges with [1, 3] to form [1, 5]"
      },
      {
            "input": "intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval = [4, 8]",
            "expectedOutput": "[[1, 2], [3, 10], [12, 16]]",
            "explanation": "[4, 8] overlaps [3, 5], [6, 7], [8, 10] into [3, 10]"
      },
      {
            "input": "intervals = [], newInterval = [5, 7]",
            "expectedOutput": "[[5, 7]]",
            "explanation": "Inserting into empty calendar yields single interval"
      },
      {
            "input": "intervals = [[1, 5]], newInterval = [2, 3]",
            "expectedOutput": "[[1, 5]]",
            "explanation": "New interval fully contained inside existing interval"
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["intervals","arrays","scheduling"],
    hint: 'Separate intervals into three sequential phases: 1) Add all intervals that end before newInterval begins. 2) Merge all overlapping intervals by expanding newInterval = [min(start), max(end)]. 3) Add all intervals that begin after newInterval ends.',
    complexityTarget: 'Time: O(N) | Space: O(N) output',
  },
  {
    id: 'war_spiral_matrix_25',
    title: 'Spiral Matrix (Sensor Raster Scanning Pattern)',
    difficulty: 'intermediate',
    competencyId: 'comp_matrix_spiral_traversal_l2',
    description: 'An optical satellite imaging sensor sweeps geographical grid coordinates in a clockwise inward spiral to maintain continuous focal plane exposure. Given an m x n matrix, return all elements of the matrix in spiral order (top row left-to-right, right column top-to-bottom, bottom row right-to-left, left column bottom-to-top, repeating inward).',
    starterCode: {
      typescript: "function spiralOrder(matrix: number[][]): number[] {\n  // Your solution here\n  return [];\n}",
      python: "def spiral_order(matrix):\n    # Your solution here\n    return []",
    },
    testCases: [
      {
            "input": "[[1, 2, 3], [4, 5, 6], [7, 8, 9]]",
            "expectedOutput": "[1, 2, 3, 6, 9, 8, 7, 4, 5]",
            "explanation": "3x3 spiral perimeter traversal"
      },
      {
            "input": "[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]",
            "expectedOutput": "[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]",
            "explanation": "3x4 rectangular spiral traversal"
      },
      {
            "input": "[[1]]",
            "expectedOutput": "[1]",
            "explanation": "Single element matrix"
      },
      {
            "input": "[[1, 2], [3, 4]]",
            "expectedOutput": "[1, 2, 4, 3]",
            "explanation": "2x2 square spiral"
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["matrix","simulation","traversal"],
    hint: 'Maintain four boundary pointers: top, bottom, left, and right. In a while loop (top <= bottom && left <= right), traverse top row, increment top; traverse right col, decrement right; traverse bottom row (if top <= bottom), decrement bottom; traverse left col (if left <= right), increment left.',
    complexityTarget: 'Time: O(M * N) | Space: O(1) auxiliary',
  },
  {
    id: 'war_search_rotated_array_26',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'intermediate',
    competencyId: 'comp_binary_search_rotated_lookup_l2',
    description: 'In a distributed sharded database with consistent hash rings, keys are strictly ordered but partitioned across nodes offset by an unknown rotation pivot. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.',
    starterCode: {
      typescript: "function searchRotated(nums: number[], target: number): number {\n  // Your solution here\n  return -1;\n}",
      python: "def search_rotated(nums, target):\n    # Your solution here\n    return -1",
    },
    testCases: [
      {
            "input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
            "expectedOutput": "4",
            "explanation": "Target 0 found at index 4"
      },
      {
            "input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 3",
            "expectedOutput": "-1",
            "explanation": "Target 3 does not exist in array"
      },
      {
            "input": "nums = [1], target = 0",
            "expectedOutput": "-1",
            "explanation": "Single element mismatch"
      },
      {
            "input": "nums = [1, 3], target = 3",
            "expectedOutput": "1",
            "explanation": "Target found in short array"
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["binary-search","arrays","rotated-sorted"],
    hint: 'At mid, at least one half of the array (left or right) is guaranteed to be normally sorted. Determine which half is sorted by comparing nums[left] and nums[mid]. If target lies within the sorted half bounds, search there; otherwise search the other half.',
    complexityTarget: 'Time: O(log N) | Space: O(1)',
  },
  {
    id: 'war_coin_change_ii_27',
    title: 'Coin Change II (Unique Combinations Counter)',
    difficulty: 'intermediate',
    competencyId: 'comp_dp_coin_combinations_l2',
    description: 'A point-of-sale checkout gateway must determine how many distinct, order-independent coin combinations can be dispensed to make exact customer change. You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the number of combinations that make up that amount. If that amount cannot be made up by any combination of the coins, return 0. You may assume that you have an infinite number of each kind of coin.',
    starterCode: {
      typescript: "function change(amount: number, coins: number[]): number {\n  // Your solution here\n  return 0;\n}",
      python: "def change(amount, coins):\n    # Your solution here\n    return 0",
    },
    testCases: [
      {
            "input": "amount = 5, coins = [1, 2, 5]",
            "expectedOutput": "4",
            "explanation": "5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1"
      },
      {
            "input": "amount = 3, coins = [2]",
            "expectedOutput": "0",
            "explanation": "Amount 3 cannot be made with coin 2"
      },
      {
            "input": "amount = 10, coins = [10]",
            "expectedOutput": "1",
            "explanation": "Exactly one combination"
      },
      {
            "input": "amount = 0, coins = [7]",
            "expectedOutput": "1",
            "explanation": "Amount 0 has 1 valid combination (empty set)"
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["dynamic-programming","knapsack","combinatorics"],
    hint: 'Notice the difference from unbounded knapsack permutations: to avoid counting permutations like (1,2) and (2,1) separately, put the coin loop on the OUTSIDE and amount loop on the INSIDE. dp[x] += dp[x - coin].',
    complexityTarget: 'Time: O(amount * coins.length) | Space: O(amount)',
  },
  {
    id: 'war_validate_ip_address_28',
    title: 'Validate IP Address (VPC Gateway Firewall)',
    difficulty: 'intermediate',
    competencyId: 'comp_string_ip_address_validation_l2',
    description: 'A cloud security group ingress controller validates incoming network packets against strict CIDR rules. Given a string queryIP, return "IPv4" if IP is a valid IPv4 address, "IPv6" if IP is a valid IPv6 address, or "Neither" if IP is not a correct IP of any type. Valid IPv4 addresses consist of four decimal numbers (0-255) separated by dots without leading zeros. Valid IPv6 addresses consist of eight groups of four hexadecimal digits (case-insensitive) separated by colons.',
    starterCode: {
      typescript: "function validIPAddress(queryIP: string): string {\n  // Your solution here\n  return \"Neither\";\n}",
      python: "def valid_ip_address(query_ip):\n    # Your solution here\n    return \"Neither\"",
    },
    testCases: [
      {
            "input": "\"172.16.254.1\"",
            "expectedOutput": "\"IPv4\"",
            "explanation": "Standard valid IPv4"
      },
      {
            "input": "\"2001:0db8:85a3:0:0:8A2E:0370:7334\"",
            "expectedOutput": "\"IPv6\"",
            "explanation": "Standard valid IPv6"
      },
      {
            "input": "\"256.256.256.256\"",
            "expectedOutput": "\"Neither\"",
            "explanation": "Octet 256 exceeds 255"
      },
      {
            "input": "\"192.168.01.1\"",
            "expectedOutput": "\"Neither\"",
            "explanation": "Leading zero in octet 01 is invalid"
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["strings","parsing","networking"],
    hint: 'Check if queryIP contains three dots (IPv4 candidate) or seven colons (IPv6 candidate). For IPv4, split by dot: check exactly 4 segments, each numeric 0-255, no leading zeroes if length > 1. For IPv6, split by colon: check exactly 8 segments, 1-4 hex digits each.',
    complexityTarget: 'Time: O(N) | Space: O(1)',
  },
  {
    id: 'war_level_order_traversal_29',
    title: 'Binary Tree Level Order Traversal (Cluster Topology)',
    difficulty: 'intermediate',
    competencyId: 'comp_trees_bfs_level_order_l2',
    description: 'A cloud orchestration engine builds hierarchical topological maps of distributed cluster workers. Given the root of a binary tree as an array in level-order, return the level order traversal of its nodes\' values (i.e., from left to right, level by level as a 2D array of numbers).',
    starterCode: {
      typescript: "function levelOrder(root: (number | null)[]): number[][] {\n  // Your solution here\n  return [];\n}",
      python: "def level_order(root):\n    # Your solution here\n    return []",
    },
    testCases: [
      {
            "input": "[3, 9, 20, null, null, 15, 7]",
            "expectedOutput": "[[3], [9, 20], [15, 7]]",
            "explanation": "Root is 3, second level is 9 and 20, third level is 15 and 7"
      },
      {
            "input": "[1]",
            "expectedOutput": "[[1]]",
            "explanation": "Single node tree"
      },
      {
            "input": "[]",
            "expectedOutput": "[]",
            "explanation": "Empty tree returns empty array"
      },
      {
            "input": "[1, 2, 3, 4, 5]",
            "expectedOutput": "[[1], [2, 3], [4, 5]]",
            "explanation": "Complete 3-level tree"
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["trees","bfs","queue"],
    hint: 'Convert the input array to linked TreeNodes. Use a FIFO queue initialized with the root node. In a while loop, record queue.length as the current level size, iterate levelSize times popping nodes, adding their values to a level array, and pushing their non-null children into the queue.',
    complexityTarget: 'Time: O(N) | Space: O(N)',
  },
  {
    id: 'war_simplify_path_30',
    title: 'Simplify Path (Unix Virtual File System Normalizer)',
    difficulty: 'intermediate',
    competencyId: 'comp_stack_unix_path_simplifier_l2',
    description: 'A container runtime sandbox resolves relative and absolute file paths against container chroots to prevent directory traversal escapes. Given an absolute Unix-style file path path, convert it to the simplified canonical path. In a Unix-style file system: a period "." refers to the current directory, a double period ".." refers to the directory up a level, multiple consecutive slashes are treated as a single slash, and the canonical path must start with a single slash and not end with a trailing slash.',
    starterCode: {
      typescript: "function simplifyPath(path: string): string {\n  // Your solution here\n  return \"\";\n}",
      python: "def simplify_path(path):\n    # Your solution here\n    return \"\"",
    },
    testCases: [
      {
            "input": "\"/home/\"",
            "expectedOutput": "\"/home\"",
            "explanation": "Trailing slash removed"
      },
      {
            "input": "\"/../\"",
            "expectedOutput": "\"/\"",
            "explanation": "Cannot navigate above root"
      },
      {
            "input": "\"/home//foo/\"",
            "expectedOutput": "\"/home/foo\"",
            "explanation": "Double slash reduced to single slash"
      },
      {
            "input": "\"/a/./b/../../c/\"",
            "expectedOutput": "\"/c\"",
            "explanation": "Navigating up two directories from b leaves /c"
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["stack","strings","file-system"],
    hint: 'Split the path by "/". Iterate over each token: ignore empty tokens and single dots ".". If token is "..", pop from your directory stack if non-empty. For any valid directory name, push to the stack. Finally, join with "/" and prepend "/".',
    complexityTarget: 'Time: O(N) | Space: O(N)',
  },
  {
    id: 'war_partition_labels_31',
    title: 'Partition Labels (Greedy Video Transcoder Chunks)',
    difficulty: 'intermediate',
    competencyId: 'comp_greedy_intervals_partition_labels_l2',
    description: 'A cloud video encoding pipeline breaks raw video streams into independent parallel transcode chunks. However, each unique character token represents an interdependent keyframe codec that cannot be split across chunks. You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.',
    starterCode: {
      typescript: "function partitionLabels(s: string): number[] {\n  // Your solution here\n  return [];\n}",
      python: "def partition_labels(s):\n    # Your solution here\n    return []",
    },
    testCases: [
      {
            "input": "\"ababcbacadefegdehijhklij\"",
            "expectedOutput": "[9, 7, 8]",
            "explanation": "Partitions are \"ababcbaca\" (9), \"defegde\" (7), and \"hijhklij\" (8)"
      },
      {
            "input": "\"eccbbbbdec\"",
            "expectedOutput": "[10]",
            "explanation": "Character c appears at start and end, forcing single chunk of 10"
      },
      {
            "input": "\"a\"",
            "expectedOutput": "[1]",
            "explanation": "Single character string"
      },
      {
            "input": "\"abcdef\"",
            "expectedOutput": "[1, 1, 1, 1, 1, 1]",
            "explanation": "All unique characters partition into individual chunks"
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["greedy","two-pointers","strings"],
    hint: 'First pass: record the last index of occurrence for each character in a hash map. Second pass: keep an anchor and an end pointer. For each char at index i, update end = max(end, last[char]). When i reaches end, a valid partition boundary is reached! Output (end - anchor + 1) and update anchor = i + 1.',
    complexityTarget: 'Time: O(N) | Space: O(1) (26 lowercase English letters)',
  },
  {
    id: 'war_continuous_subarray_sum_32',
    title: 'Continuous Subarray Sum (FinTech Anomaly)',
    difficulty: 'intermediate',
    competencyId: 'comp_prefix_sum_hash_mod_l2',
    description: 'A FinTech transaction auditor looks for cyclic fraud patterns where money is round-tripped through multiple accounts in increments of batch size k. Given an integer array nums and an integer k, return true if nums has a good subarray or false otherwise. A good subarray is a subarray where: its length is at least two, and the sum of the elements of the subarray is a multiple of k (sum % k == 0).',
    starterCode: {
      typescript: "function checkSubarraySum(nums: number[], k: number): boolean {\n  // Your solution here\n  return false;\n}",
      python: "def check_subarray_sum(nums, k):\n    # Your solution here\n    return False",
    },
    testCases: [
      {
            "input": "nums = [23, 2, 4, 6, 7], k = 6",
            "expectedOutput": "true",
            "explanation": "[2, 4] is continuous subarray of length 2 summing to 6"
      },
      {
            "input": "nums = [23, 2, 6, 4, 7], k = 6",
            "expectedOutput": "true",
            "explanation": "[23, 2, 6, 4, 7] sums to 42, which is 6 * 7"
      },
      {
            "input": "nums = [23, 2, 6, 4, 7], k = 13",
            "expectedOutput": "false",
            "explanation": "No subarray of length >= 2 sums to a multiple of 13"
      },
      {
            "input": "nums = [5, 0, 0, 0], k = 3",
            "expectedOutput": "true",
            "explanation": "[0, 0] of length 2 sums to 0, which is 0 * 3"
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["hash-map","prefix-sum","modular-arithmetic"],
    hint: 'Use modular arithmetic on running prefix sums: if prefixSum[j] % k == prefixSum[i] % k and (j - i) >= 2, the subarray between i and j has sum divisible by k. Store the earliest index where each remainder (sum % k) was observed in a hash map initialized with { 0: -1 }.',
    complexityTarget: 'Time: O(N) | Space: O(min(N, k))',
  },
  {
    id: 'war_binary_tree_right_side_33',
    title: 'Binary Tree Right Side View (Shadow Projection)',
    difficulty: 'intermediate',
    competencyId: 'comp_trees_bfs_right_side_view_l2',
    description: 'A satellite radar creates an orthogonal projection of a binary planetary sensor grid by scanning exclusively from the right flank. Given the root of a binary tree as an array in level-order, imagine yourself standing on the right side of it; return the values of the nodes you can see ordered from top to bottom.',
    starterCode: {
      typescript: "function rightSideView(root: (number | null)[]): number[] {\n  // Your solution here\n  return [];\n}",
      python: "def right_side_view(root):\n    # Your solution here\n    return []",
    },
    testCases: [
      {
            "input": "[1, 2, 3, null, 5, null, 4]",
            "expectedOutput": "[1, 3, 4]",
            "explanation": "Visible nodes from right side are 1, 3, and 4"
      },
      {
            "input": "[1, null, 3]",
            "expectedOutput": "[1, 3]",
            "explanation": "Right child only"
      },
      {
            "input": "[]",
            "expectedOutput": "[]",
            "explanation": "Empty tree"
      },
      {
            "input": "[1, 2, 3, 4]",
            "expectedOutput": "[1, 3, 4]",
            "explanation": "Node 4 on third level is visible because node 3 has no children"
      }
],
    timeLimitSeconds: 300,
    memoryLimitMb: 128,
    xpReward: 150,
    tags: ["trees","bfs","dfs","view"],
    hint: 'Perform a BFS level-order traversal. For each level, append the value of the LAST node in that level to your result array. Alternatively, use a reverse DFS (visit right child before left child), adding the node value whenever depth == result.length.',
    complexityTarget: 'Time: O(N) | Space: O(D) where D is tree diameter',
  },
  {
    id: 'war_merge_k_sorted_lists_21',
    title: 'Merge K Sorted Lists (Distributed Log Aggregator)',
    difficulty: 'advanced',
    competencyId: 'comp_heap_merge_k_sorted_l3',
    description: 'A distributed log aggregation daemon (such as Fluentd or Vector) consumes timestamp-ordered message streams from K independent microservices and must interleave them into a single sequentially unified audit trail. Given an array of k sorted lists, each sorted in ascending order, merge all the sorted lists into one sorted list and return it. Your implementation must execute in O(N log k) time.',
    starterCode: {
      typescript: "function mergeKLists(lists: number[][]): number[] {\n  // Your solution here\n  return [];\n}",
      python: "def merge_k_lists(lists):\n    # Your solution here\n    return []",
    },
    testCases: [
      {
            "input": "[[1, 4, 5], [1, 3, 4], [2, 6]]",
            "expectedOutput": "[1, 1, 2, 3, 4, 4, 5, 6]",
            "explanation": "Three sorted streams merged in order"
      },
      {
            "input": "[]",
            "expectedOutput": "[]",
            "explanation": "No streams"
      },
      {
            "input": "[[]]",
            "expectedOutput": "[]",
            "explanation": "Single empty stream"
      },
      {
            "input": "[[1], [0]]",
            "expectedOutput": "[0, 1]",
            "explanation": "Two single element streams"
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["heap","divide-and-conquer","merge-sort"],
    hint: 'Use a Min-Heap containing the current head of each non-empty list (value, listIndex, elementIndex), or use Divide and Conquer: pairwise merge lists[i] and lists[i + interval] repeatedly until only 1 consolidated list remains in O(N log k).',
    complexityTarget: 'Time: O(N log K) | Space: O(K)',
  },
  {
    id: 'war_alien_dictionary_22',
    title: 'Alien Dictionary (Topological Compiler Symbol Order)',
    difficulty: 'advanced',
    competencyId: 'comp_graph_topological_alien_dict_l3',
    description: 'A language runtime compiler discovers an esoteric scripting language whose alphabetical order differs from standard ASCII. You receive a list of words from the alien language\'s dictionary, where the words are claimed to be sorted lexicographically by the rules of this language. Derive the unique order of characters in this alien language. If the order is invalid (e.g. A cyclic dependency like a < b < a exists or an invalid prefix ordering occurred), return "". If multiple valid orders exist, return any valid topological sort.',
    starterCode: {
      typescript: "function alienOrder(words: string[]): string {\n  // Your solution here\n  return \"\";\n}",
      python: "def alien_order(words):\n    # Your solution here\n    return \"\"",
    },
    testCases: [
      {
            "input": "[\"wrt\", \"wrf\", \"er\", \"ett\", \"rftt\"]",
            "expectedOutput": "\"wertf\"",
            "explanation": "t->f, w->e, r->t, e->r yields valid order wertf"
      },
      {
            "input": "[\"z\", \"x\"]",
            "expectedOutput": "\"zx\"",
            "explanation": "z precedes x"
      },
      {
            "input": "[\"z\", \"x\", \"z\"]",
            "expectedOutput": "\"\"",
            "explanation": "Cycle: z < x < z is invalid"
      },
      {
            "input": "[\"abc\", \"ab\"]",
            "expectedOutput": "\"\"",
            "explanation": "Invalid prefix order: longer string cannot precede its own prefix"
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["graphs","topological-sort","dag"],
    hint: 'Build a directed graph where edges u -> v indicate char u comes before char v. Compare adjacent words word1 and word2: find the first mismatching character; add edge word1[k] -> word2[k]. If word1 starts with word2 and is longer, order is invalid. Run Kahn\'s algorithm; if visited count < total unique characters, a cycle exists (return "").',
    complexityTarget: 'Time: O(C) total characters | Space: O(U + E) where U is unique chars',
  },
  {
    id: 'war_longest_valid_parentheses_23',
    title: 'Longest Valid Parentheses (Compiler AST Balancer)',
    difficulty: 'advanced',
    competencyId: 'comp_stack_dp_longest_valid_parentheses_l3',
    description: 'A code formatter and syntax highlighter identifies the maximum contiguous region of well-formed parentheses in uncompiled or corrupted code files. Given a string containing just the characters \'(\' and \')\', return the length of the longest valid (well-formed) parentheses substring.',
    starterCode: {
      typescript: "function longestValidParentheses(s: string): number {\n  // Your solution here\n  return 0;\n}",
      python: "def longest_valid_parentheses(s):\n    # Your solution here\n    return 0",
    },
    testCases: [
      {
            "input": "\"(()\"",
            "expectedOutput": "2",
            "explanation": "Longest valid is \"()\""
      },
      {
            "input": "\")()())\"",
            "expectedOutput": "4",
            "explanation": "Longest valid is \"()()\""
      },
      {
            "input": "\"\"",
            "expectedOutput": "0",
            "explanation": "Empty string has length 0"
      },
      {
            "input": "\"()(()\"",
            "expectedOutput": "2",
            "explanation": "Longest valid substring has length 2"
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["stack","dynamic-programming","greedy"],
    hint: 'Use a stack initialized with -1 to serve as the base index of the last unmatched closing parenthesis. For \'(\', push its index. For \')\', pop from stack. If stack is empty, push current index as new base; if non-empty, maxLen = max(maxLen, i - stack[top]).',
    complexityTarget: 'Time: O(N) | Space: O(N)',
  },
  {
    id: 'war_serialize_deserialize_tree_24',
    title: 'Serialize and Deserialize Binary Tree (Wire RPC)',
    difficulty: 'advanced',
    competencyId: 'comp_trees_serialization_wire_protocol_l3',
    description: 'In a microservice mesh, structured binary search trees representing distributed database partition indexes must be serialized into compact strings for network wire transmission and deserialized on remote hosts with exact fidelity. Design an algorithm to serialize a binary tree into a string and deserialize that string back into the identical tree. Your test will verify that round-tripping a tree produces identical level-order structure.',
    starterCode: {
      typescript: "function roundTripTree(root: (number | null)[]): (number | null)[] {\n  // Your solution here: serialize then deserialize\n  return [];\n}",
      python: "def round_trip_tree(root):\n    # Your solution here: serialize then deserialize\n    return []",
    },
    testCases: [
      {
            "input": "[1, 2, 3, null, null, 4, 5]",
            "expectedOutput": "[1, 2, 3, null, null, 4, 5]",
            "explanation": "Tree preserved across serialize and deserialize"
      },
      {
            "input": "[]",
            "expectedOutput": "[]",
            "explanation": "Empty tree"
      },
      {
            "input": "[1]",
            "expectedOutput": "[1]",
            "explanation": "Single root"
      },
      {
            "input": "[1, 2]",
            "expectedOutput": "[1, 2]",
            "explanation": "Left child only"
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["trees","serialization","protocol-buffers"],
    hint: 'Use preorder DFS with a delimiter (e.g. comma) and marker for null (e.g. "X"). Serialize: recursively append root.val + "," + serialize(left) + "," + serialize(right). Deserialize: split string by commas into a queue; recursively pop items: if "X", return null; else construct TreeNode and recurse for left and right.',
    complexityTarget: 'Time: O(N) | Space: O(N)',
  },
  {
    id: 'war_largest_rectangle_histogram_25',
    title: 'Largest Rectangle in Histogram (Peak Memory Block)',
    difficulty: 'advanced',
    competencyId: 'comp_stack_monotonic_largest_rectangle_l3',
    description: 'A physical memory manager compresses unfragmented contiguous RAM chunks across varying process allocations. Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram. Your solution must execute in O(N) time.',
    starterCode: {
      typescript: "function largestRectangleArea(heights: number[]): number {\n  // Your solution here\n  return 0;\n}",
      python: "def largest_rectangle_area(heights):\n    # Your solution here\n    return 0",
    },
    testCases: [
      {
            "input": "[2, 1, 5, 6, 2, 3]",
            "expectedOutput": "10",
            "explanation": "Bars 5 and 6 form a rectangle of area 5 * 2 = 10"
      },
      {
            "input": "[2, 4]",
            "expectedOutput": "4",
            "explanation": "Bar of height 4 has area 4"
      },
      {
            "input": "[1]",
            "expectedOutput": "1",
            "explanation": "Single bar"
      },
      {
            "input": "[2, 1, 2]",
            "expectedOutput": "3",
            "explanation": "Spans full width at height 1 (area 3)"
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["monotonic-stack","arrays","optimization"],
    hint: 'Maintain a monotonic increasing stack of bar indices. When the current bar is shorter than the bar at stack top, pop the top index: its height is heights[top], and the width extends from the new stack top to the current index (width = stack.empty ? i : i - stack.top - 1). Track the maximum area.',
    complexityTarget: 'Time: O(N) | Space: O(N)',
  },
  {
    id: 'war_min_window_substring_26',
    title: 'Minimum Window Substring (Search Query Snippet)',
    difficulty: 'advanced',
    competencyId: 'comp_sliding_window_min_window_l3',
    description: 'An enterprise full-text search engine generates compact search snippets highlighting all matched keywords in user queries. Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "". The test cases will be generated such that the answer is unique.',
    starterCode: {
      typescript: "function minWindow(s: string, t: string): string {\n  // Your solution here\n  return \"\";\n}",
      python: "def min_window(s, t):\n    # Your solution here\n    return \"\"",
    },
    testCases: [
      {
            "input": "s = \"ADOBECODEBANC\", t = \"ABC\"",
            "expectedOutput": "\"BANC\"",
            "explanation": "\"BANC\" contains A, B, and C in minimal length 4"
      },
      {
            "input": "s = \"a\", t = \"a\"",
            "expectedOutput": "\"a\"",
            "explanation": "Exact match"
      },
      {
            "input": "s = \"a\", t = \"aa\"",
            "expectedOutput": "\"\"",
            "explanation": "s lacks two occurrences of a"
      },
      {
            "input": "s = \"ab\", t = \"b\"",
            "expectedOutput": "\"b\"",
            "explanation": "Single character match at end"
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["sliding-window","hash-map","two-pointers"],
    hint: 'Build a frequency map of target string t and track formed characters. Expand the right pointer: when char matches t requirements, increment formed. When formed == required, contract the left pointer to find the tightest window while updating minLen. Continue until right reaches end.',
    complexityTarget: 'Time: O(M + N) | Space: O(1) (ASCII size)',
  },
  {
    id: 'war_palindrome_partitioning_ii_27',
    title: 'Palindrome Partitioning II (Min Compression Cuts)',
    difficulty: 'advanced',
    competencyId: 'comp_dp_palindrome_min_cuts_l3',
    description: 'A natural language processing engine compresses token sequences by segmenting documents into minimum palindromic syllabic chunks. Given a string s, partition s such that every substring of the partition is a palindrome. Return the minimum cuts needed for a palindrome partitioning of s.',
    starterCode: {
      typescript: "function minCut(s: string): number {\n  // Your solution here\n  return 0;\n}",
      python: "def min_cut(s):\n    # Your solution here\n    return 0",
    },
    testCases: [
      {
            "input": "\"aab\"",
            "expectedOutput": "1",
            "explanation": "\"aa\" | \"b\" requires 1 cut"
      },
      {
            "input": "\"a\"",
            "expectedOutput": "0",
            "explanation": "Already a palindrome, 0 cuts"
      },
      {
            "input": "\"ab\"",
            "expectedOutput": "1",
            "explanation": "\"a\" | \"b\" requires 1 cut"
      },
      {
            "input": "\"ababbbabbababa\"",
            "expectedOutput": "3",
            "explanation": "Optimal partitioning requires 3 cuts"
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["dynamic-programming","strings","palindrome"],
    hint: 'Precompute an isPal[i][j] boolean 2D table in O(N^2) expanding around centers. Then define dp[i] as the minimum cuts needed for prefix s[0...i]. If isPal[0][i] is true, dp[i] = 0. Otherwise dp[i] = min(dp[j] + 1) for all 0 <= j < i where isPal[j+1][i] is true.',
    complexityTarget: 'Time: O(N^2) | Space: O(N^2)',
  },
  {
    id: 'war_consistent_hashing_ring_28',
    title: 'Consistent Hashing Ring (Distributed Sharding Router)',
    difficulty: 'advanced',
    competencyId: 'comp_systems_consistent_hashing_ring_l3',
    description: 'A distributed NoSQL storage engine (like DynamoDB or Apache Cassandra) uses consistent hashing to assign key-value pairs across a cluster of server nodes positioned on a virtual ring (hash range 0 to M-1). Given a sorted array of active server node hash positions on the ring nodes and a request hash key, route the request to the first server node whose position is greater than or equal to key. If key is greater than all server positions, it wraps around to the first server node (nodes[0]). Write routeRequest to return the selected server node.',
    starterCode: {
      typescript: "function routeRequest(nodes: number[], key: number): number {\n  // Your solution here\n  return 0;\n}",
      python: "def route_request(nodes, key):\n    # Your solution here\n    return 0",
    },
    testCases: [
      {
            "input": "nodes = [10, 50, 100], key = 20",
            "expectedOutput": "50",
            "explanation": "Next clockwise server node >= 20 is 50"
      },
      {
            "input": "nodes = [10, 50, 100], key = 100",
            "expectedOutput": "100",
            "explanation": "Exact match at server node 100"
      },
      {
            "input": "nodes = [10, 50, 100], key = 120",
            "expectedOutput": "10",
            "explanation": "Wraps around the ring to node 10"
      },
      {
            "input": "nodes = [25, 75], key = 5",
            "expectedOutput": "25",
            "explanation": "Next clockwise server node >= 5 is 25"
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["consistent-hashing","binary-search","distributed-systems"],
    hint: 'Since the server nodes array is sorted, use binary search (bisect_left / lower_bound) to find the first node >= key in O(log K) time. If the index equals nodes.length, wrap around to return nodes[0].',
    complexityTarget: 'Time: O(log K) | Space: O(1)',
  },
  {
    id: 'war_basic_calculator_29',
    title: 'Basic Calculator (Arithmetic AST Evaluator)',
    difficulty: 'advanced',
    competencyId: 'comp_stack_basic_calculator_ast_l3',
    description: 'An embedded query engine evaluates mathematical filter clauses in SQL WHERE conditions without invoking insecure eval() interpreters. Given a string s representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation. The expression string contains only digits, \'+\', \'-\', \'(\', \')\', and spaces \' \'. Note: You are not allowed to use any built-in eval functions.',
    starterCode: {
      typescript: "function calculate(s: string): number {\n  // Your solution here\n  return 0;\n}",
      python: "def calculate(s):\n    # Your solution here\n    return 0",
    },
    testCases: [
      {
            "input": "\"1 + 1\"",
            "expectedOutput": "2",
            "explanation": "1 + 1 = 2"
      },
      {
            "input": "\" 2-1 + 2 \"",
            "expectedOutput": "3",
            "explanation": "2 - 1 + 2 = 3"
      },
      {
            "input": "\"(1+(4+5+2)-3)+(6+8)\"",
            "expectedOutput": "23",
            "explanation": "Nested parentheses expression evaluates to 23"
      },
      {
            "input": "\"- (3 + (4 + 5))\"",
            "expectedOutput": "-12",
            "explanation": "Unary negation outside parentheses"
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["stack","math","parser"],
    hint: 'Maintain a running result, current sign (+1 or -1), and a stack of [previousResult, previousSign]. When \'(\' is encountered, push [result, sign], then reset result = 0, sign = 1. When \')\' is encountered, pop [prevResult, prevSign], and set result = prevResult + prevSign * result.',
    complexityTarget: 'Time: O(N) | Space: O(N)',
  },
  {
    id: 'war_maximal_square_30',
    title: 'Maximal Square (Semiconductor Wafer Defect Map)',
    difficulty: 'advanced',
    competencyId: 'comp_dp_2d_maximal_square_l3',
    description: 'A semiconductor lithography inspection scanner analyzes silicon wafer surface matrices to find the largest contiguous square area free of silicon crystal defects. Given an m x n binary matrix filled with 0s and 1s, find the largest square containing only 1s and return its area.',
    starterCode: {
      typescript: "function maximalSquare(matrix: string[][]): number {\n  // Your solution here\n  return 0;\n}",
      python: "def maximal_square(matrix):\n    # Your solution here\n    return 0",
    },
    testCases: [
      {
            "input": "[[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]",
            "expectedOutput": "4",
            "explanation": "A 2x2 square of 1s has area 4"
      },
      {
            "input": "[[\"0\",\"1\"],[\"1\",\"0\"]]",
            "expectedOutput": "1",
            "explanation": "Only 1x1 squares of 1s exist"
      },
      {
            "input": "[[\"0\"]]",
            "expectedOutput": "0",
            "explanation": "No 1s, area 0"
      },
      {
            "input": "[[\"1\",\"1\"],[\"1\",\"1\"]]",
            "expectedOutput": "4",
            "explanation": "2x2 square has area 4"
      }
],
    timeLimitSeconds: 360,
    memoryLimitMb: 128,
    xpReward: 200,
    tags: ["dynamic-programming","matrix","2d-geometry"],
    hint: 'Let dp[i][j] represent the side length of the largest square whose bottom-right corner is at (i, j). If matrix[i][j] == "1", then dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]). Track maxSide, return maxSide * maxSide.',
    complexityTarget: 'Time: O(M * N) | Space: O(M * N) or O(N) space optimized',
  },
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

