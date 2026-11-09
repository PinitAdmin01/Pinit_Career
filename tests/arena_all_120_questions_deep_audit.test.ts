import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';
import { CODEWARS_PROBLEM_REGISTRY } from '../src/lib/server/codeWarsSandbox';
import { judgeCodeWarsSubmission } from '../src/lib/server/codeWarsJudge';

// 60 REFERENCE SOLUTIONS IN TYPESCRIPT
const TS_SOLUTIONS: Record<string, string> = {
  // 1-30 existing
  war_two_sum_01: `
    function twoSum(nums: number[], target: number): number[] {
      const map = new Map<number, number>();
      for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) return [map.get(comp)!, i];
        map.set(nums[i], i);
      }
      return [];
    }
  `,
  war_valid_palindrome_02: `
    function isPalindrome(s: string): boolean {
      const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleaned === cleaned.split('').reverse().join('');
    }
  `,
  war_reverse_string_03: `
    function reverseWords(s: string): string {
      return s.trim().split(/\\s+/).reverse().join(' ');
    }
  `,
  war_valid_parentheses_04: `
    function isValidParentheses(s: string): boolean {
      const stack: string[] = [];
      const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
      for (const char of s) {
        if (char === '(' || char === '{' || char === '[') {
          stack.push(char);
        } else if (map[char]) {
          if (stack.pop() !== map[char]) return false;
        }
      }
      return stack.length === 0;
    }
  `,
  war_max_subarray_05: `
    function maxSubArray(nums: number[]): number {
      let maxSoFar = nums[0];
      let currMax = nums[0];
      for (let i = 1; i < nums.length; i++) {
        currMax = Math.max(nums[i], currMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currMax);
      }
      return maxSoFar;
    }
  `,
  war_best_stock_06: `
    function maxProfit(prices: number[]): number {
      let minPrice = Infinity;
      let maxProf = 0;
      for (const p of prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProf) maxProf = p - minPrice;
      }
      return maxProf;
    }
  `,
  war_tree_lca_01: `
    function lowestCommonAncestor(root: any, pVal: number, qVal: number): any {
      let curr = root;
      while (curr) {
        if (pVal < curr.val && qVal < curr.val) curr = curr.left;
        else if (pVal > curr.val && qVal > curr.val) curr = curr.right;
        else return curr;
      }
      return null;
    }
  `,
  war_concurrency_deadlock_02: `
    function acquireResourcesDeterministically(requests: { threadId: string; resourceIds: string[] }[]): string[] {
      const set = new Set<string>();
      for (const r of requests) {
        for (const res of r.resourceIds) set.add(res);
      }
      return Array.from(set).sort();
    }
  `,
  war_sql_btree_query_03: `
    function generateOptimalCompositeIndex(table: string, equalityCols: string[], rangeCol: string): string {
      const cols = [...equalityCols, rangeCol];
      const idxName = "idx_" + table + "_" + cols.join("_");
      return "CREATE INDEX " + idxName + " ON " + table + " (" + cols.join(", ") + ");";
    }
  `,
  war_contains_duplicate_04: `
    function containsDuplicate(nums: number[]): boolean {
      return new Set(nums).size !== nums.length;
    }
  `,
  war_valid_anagram_05: `
    function isAnagram(s: string, t: string): boolean {
      if (s.length !== t.length) return false;
      return s.split('').sort().join('') === t.split('').sort().join('');
    }
  `,
  war_move_zeroes_06: `
    function moveZeroes(nums: number[]): number[] {
      let write = 0;
      for (let read = 0; read < nums.length; read++) {
        if (nums[read] !== 0) {
          nums[write] = nums[read];
          write++;
        }
      }
      while (write < nums.length) {
        nums[write++] = 0;
      }
      return nums;
    }
  `,
  war_single_number_07: `
    function singleNumber(nums: number[]): number {
      return nums.reduce((acc, curr) => acc ^ curr, 0);
    }
  `,
  war_missing_number_08: `
    function missingNumber(nums: number[]): number {
      const n = nums.length;
      const expected = (n * (n + 1)) / 2;
      const actual = nums.reduce((a, b) => a + b, 0);
      return expected - actual;
    }
  `,
  war_merge_sorted_arrays_09: `
    function mergeSortedArrays(nums1: number[], nums2: number[]): number[] {
      const result: number[] = [];
      let i = 0, j = 0;
      while (i < nums1.length && j < nums2.length) {
        if (nums1[i] <= nums2[j]) result.push(nums1[i++]);
        else result.push(nums2[j++]);
      }
      while (i < nums1.length) result.push(nums1[i++]);
      while (j < nums2.length) result.push(nums2[j++]);
      return result;
    }
  `,
  war_roman_to_int_10: `
    function romanToInt(s: string): number {
      const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let total = 0;
      for (let i = 0; i < s.length; i++) {
        const curr = map[s[i]];
        const next = map[s[i + 1]];
        if (next && curr < next) {
          total -= curr;
        } else {
          total += curr;
        }
      }
      return total;
    }
  `,
  war_binary_search_07: `
    function search(nums: number[], target: number): number {
      let left = 0, right = nums.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
      }
      return -1;
    }
  `,
  war_reverse_linked_list_08: `
    function reverseList(head: any): any {
      if (!Array.isArray(head)) return [];
      return [...head].reverse();
    }
  `,
  war_longest_substring_09: `
    function lengthOfLongestSubstring(s: string): number {
      const seen = new Map<string, number>();
      let maxLen = 0, left = 0;
      for (let right = 0; right < s.length; right++) {
        if (seen.has(s[right]) && seen.get(s[right])! >= left) {
          left = seen.get(s[right])! + 1;
        }
        seen.set(s[right], right);
        maxLen = Math.max(maxLen, right - left + 1);
      }
      return maxLen;
    }
  `,
  war_container_water_10: `
    function maxArea(height: number[]): number {
      let left = 0, right = height.length - 1;
      let maxVol = 0;
      while (left < right) {
        const h = Math.min(height[left], height[right]);
        maxVol = Math.max(maxVol, h * (right - left));
        if (height[left] < height[right]) left++;
        else right--;
      }
      return maxVol;
    }
  `,
  war_product_except_self_11: `
    function productExceptSelf(nums: number[]): number[] {
      const n = nums.length;
      const res = new Array(n).fill(1);
      let left = 1;
      for (let i = 0; i < n; i++) {
        res[i] = left;
        left *= nums[i];
      }
      let right = 1;
      for (let i = n - 1; i >= 0; i--) {
        res[i] *= right;
        right *= nums[i];
      }
      return res;
    }
  `,
  war_three_sum_12: `
    function threeSum(nums: number[]): number[][] {
      nums.sort((a, b) => a - b);
      const res: number[][] = [];
      for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let left = i + 1, right = nums.length - 1;
        while (left < right) {
          const sum = nums[i] + nums[left] + nums[right];
          if (sum === 0) {
            res.push([nums[i], nums[left], nums[right]]);
            while (left < right && nums[left] === nums[left + 1]) left++;
            while (left < right && nums[right] === nums[right - 1]) right--;
            left++;
            right--;
          } else if (sum < 0) left++;
          else right--;
        }
      }
      return res;
    }
  `,
  war_min_stack_13: `
    function processMinStack(ops: string[], vals: any[][]): number[] {
      const stack: number[] = [];
      const minStack: number[] = [];
      const result: number[] = [];
      for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        if (op === 'push') {
          const v = vals[i][0];
          stack.push(v);
          if (minStack.length === 0 || v <= minStack[minStack.length - 1]) minStack.push(v);
        } else if (op === 'pop') {
          const popped = stack.pop();
          if (popped === minStack[minStack.length - 1]) minStack.pop();
        } else if (op === 'getMin') {
          result.push(minStack[minStack.length - 1]);
        }
      }
      return result;
    }
  `,
  war_invert_binary_tree_04: `
    function invertTree(root: number[]): number[] {
      if (!root || root.length === 0) return [];
      function Node(val: number) { (this as any).val = val; (this as any).left = null; (this as any).right = null; }
      var nodes = root.map(function(v) { return v !== null && v !== undefined ? new (Node as any)(v) : null; });
      for (var i = 0; i < root.length; i++) {
        if (nodes[i] !== null) {
          var leftIdx = 2 * i + 1;
          var rightIdx = 2 * i + 2;
          if (leftIdx < root.length) nodes[i].left = nodes[leftIdx];
          if (rightIdx < root.length) nodes[i].right = nodes[rightIdx];
        }
      }
      function invert(node: any) {
        if (!node) return null;
        var temp = node.left;
        node.left = invert(node.right);
        node.right = invert(temp);
        return node;
      }
      invert(nodes[0]);
      var queue = [nodes[0]];
      var res: number[] = [];
      while (queue.length > 0) {
        var curr = queue.shift();
        if (curr) {
          res.push(curr.val);
          if (curr.left || curr.right || queue.some(function(n) { return n !== null; })) {
            queue.push(curr.left);
            queue.push(curr.right);
          }
        }
      }
      return res;
    }
  `,
  war_max_depth_tree_05: `
    function maxDepth(root: (number | null)[]): number {
      if (!root || root.length === 0 || root[0] === null) return 0;
      let depth = 0;
      let levelSize = 1;
      let i = 0;
      while (i < root.length) {
        let hasNode = false;
        for (let j = 0; j < levelSize && i < root.length; j++) {
          if (root[i] !== null) hasNode = true;
          i++;
        }
        if (hasNode) depth++;
        levelSize *= 2;
      }
      return depth;
    }
  `,
  war_validate_bst_06: `
    function isValidBST(root: (number | null)[]): boolean {
      if (!root || root.length === 0 || root[0] === null) return true;
      function validate(idx: number, min: number, max: number): boolean {
        if (idx >= root.length || root[idx] === null) return true;
        const val = root[idx] as number;
        if (val <= min || val >= max) return false;
        return validate(2 * idx + 1, min, val) && validate(2 * idx + 2, val, max);
      }
      return validate(0, -Infinity, Infinity);
    }
  `,
  war_coin_change_07: `
    function coinChange(coins: number[], amount: number): number {
      const dp = new Array(amount + 1).fill(Infinity);
      dp[0] = 0;
      for (const coin of coins) {
        for (let x = coin; x <= amount; x++) {
          dp[x] = Math.min(dp[x], dp[x - coin] + 1);
        }
      }
      return dp[amount] === Infinity ? -1 : dp[amount];
    }
  `,
  war_house_robber_08: `
    function rob(nums: number[]): number {
      if (nums.length === 0) return 0;
      if (nums.length === 1) return nums[0];
      let prev2 = 0;
      let prev1 = nums[0];
      for (let i = 1; i < nums.length; i++) {
        const curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
      }
      return prev1;
    }
  `,
  war_kth_largest_09: `
    function findKthLargest(nums: number[], k: number): number {
      return [...nums].sort((a, b) => b - a)[k - 1];
    }
  `,
  war_number_of_islands_10: `
    function numIslands(grid: string[][]): number {
      if (!grid || grid.length === 0) return 0;
      const rows = grid.length;
      const cols = grid[0].length;
      let count = 0;
      function dfs(r: number, c: number) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
        grid[r][c] = '0';
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
      }
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c] === '1') {
            count++;
            dfs(r, c);
          }
        }
      }
      return count;
    }
  `,

  // 31-40 Basic
  war_majority_element_11: `
    function majorityElement(nums: number[]): number {
      let count = 0, candidate = 0;
      for (const num of nums) {
        if (count === 0) candidate = num;
        count += (num === candidate) ? 1 : -1;
      }
      return candidate;
    }
  `,
  war_first_unique_char_12: `
    function firstUniqChar(s: string): number {
      const counts = new Map<string, number>();
      for (const c of s) counts.set(c, (counts.get(c) || 0) + 1);
      for (let i = 0; i < s.length; i++) {
        if (counts.get(s[i]) === 1) return i;
      }
      return -1;
    }
  `,
  war_climbing_stairs_13: `
    function climbStairs(n: number): number {
      if (n <= 2) return n;
      let prev2 = 1, prev1 = 2;
      for (let i = 3; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
      }
      return prev1;
    }
  `,
  war_valid_palindrome_ii_14: `
    function validPalindrome(s: string): boolean {
      const isSubPal = (l: number, r: number) => {
        while (l < r) {
          if (s[l] !== s[r]) return false;
          l++; r--;
        }
        return true;
      };
      let l = 0, r = s.length - 1;
      while (l < r) {
        if (s[l] !== s[r]) {
          return isSubPal(l + 1, r) || isSubPal(l, r - 1);
        }
        l++; r--;
      }
      return true;
    }
  `,
  war_intersection_arrays_15: `
    function intersection(nums1: number[], nums2: number[]): number[] {
      const s1 = new Set(nums1);
      const s2 = new Set(nums2);
      const res: number[] = [];
      for (const n of s1) {
        if (s2.has(n)) res.push(n);
      }
      return res;
    }
  `,
  war_pascals_triangle_16: `
    function generatePascal(numRows: number): number[][] {
      const triangle: number[][] = [];
      for (let i = 0; i < numRows; i++) {
        const row = new Array(i + 1).fill(1);
        for (let j = 1; j < i; j++) {
          row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
        }
        triangle.push(row);
      }
      return triangle;
    }
  `,
  war_disappeared_numbers_17: `
    function findDisappearedNumbers(nums: number[]): number[] {
      for (let i = 0; i < nums.length; i++) {
        const val = Math.abs(nums[i]) - 1;
        if (nums[val] > 0) nums[val] = -nums[val];
      }
      const result: number[] = [];
      for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) result.push(i + 1);
      }
      return result;
    }
  `,
  war_summary_ranges_18: `
    function summaryRanges(nums: number[]): string[] {
      const res: string[] = [];
      let i = 0;
      while (i < nums.length) {
        let start = nums[i];
        while (i + 1 < nums.length && nums[i + 1] === nums[i] + 1) {
          i++;
        }
        if (start === nums[i]) {
          res.push(start + '');
        } else {
          res.push(start + '->' + nums[i]);
        }
        i++;
      }
      return res;
    }
  `,
  war_happy_number_19: `
    function isHappy(n: number): boolean {
      const seen = new Set<number>();
      let curr = n;
      while (curr !== 1 && !seen.has(curr)) {
        seen.add(curr);
        let sum = 0;
        while (curr > 0) {
          const d = curr % 10;
          sum += d * d;
          curr = Math.floor(curr / 10);
        }
        curr = sum;
      }
      return curr === 1;
    }
  `,
  war_length_of_last_word_20: `
    function lengthOfLastWord(s: string): number {
      const trimmed = s.trim();
      const lastSpace = trimmed.lastIndexOf(' ');
      return lastSpace === -1 ? trimmed.length : trimmed.length - lastSpace - 1;
    }
  `,

  // 41-50 Intermediate
  war_lru_cache_14: `
    function processLruCache(capacity: number, operations: string[], values: any[][]): any[] {
      const map = new Map<number, number>();
      const res: any[] = [];
      for (let i = 0; i < operations.length; i++) {
        const op = operations[i];
        const val = values[i];
        if (op === 'put') {
          const key = val[0], v = val[1];
          if (map.has(key)) map.delete(key);
          else if (map.size >= capacity) {
            const oldest = map.keys().next().value;
            map.delete(oldest);
          }
          map.set(key, v);
          res.push(null);
        } else if (op === 'get') {
          const key = val[0];
          if (!map.has(key)) {
            res.push(-1);
          } else {
            const v = map.get(key)!;
            map.delete(key);
            map.set(key, v);
            res.push(v);
          }
        }
      }
      return res;
    }
  `,
  war_group_anagrams_15: `
    function groupAnagrams(strs: string[]): string[][] {
      const map = new Map<string, string[]>();
      for (const s of strs) {
        const key = s.split('').sort().join('');
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(s);
      }
      return Array.from(map.values());
    }
  `,
  war_merge_intervals_16: `
    function mergeIntervals(intervals: number[][]): number[][] {
      if (intervals.length <= 1) return intervals;
      intervals.sort((a, b) => a[0] - b[0]);
      const res: number[][] = [intervals[0]];
      for (let i = 1; i < intervals.length; i++) {
        const curr = intervals[i];
        const prev = res[res.length - 1];
        if (curr[0] <= prev[1]) {
          prev[1] = Math.max(prev[1], curr[1]);
        } else {
          res.push(curr);
        }
      }
      return res;
    }
  `,
  war_daily_temperatures_17: `
    function dailyTemperatures(temperatures: number[]): number[] {
      const n = temperatures.length;
      const res = new Array(n).fill(0);
      const stack: number[] = [];
      for (let i = 0; i < n; i++) {
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
          const prevIdx = stack.pop()!;
          res[prevIdx] = i - prevIdx;
        }
        stack.push(i);
      }
      return res;
    }
  `,
  war_subarray_sum_k_18: `
    function subarraySum(nums: number[], k: number): number {
      const map = new Map<number, number>();
      map.set(0, 1);
      let sum = 0, count = 0;
      for (const n of nums) {
        sum += n;
        if (map.has(sum - k)) count += map.get(sum - k)!;
        map.set(sum, (map.get(sum) || 0) + 1);
      }
      return count;
    }
  `,
  war_find_min_rotated_19: `
    function findMin(nums: number[]): number {
      let l = 0, r = nums.length - 1;
      while (l < r) {
        const mid = Math.floor((l + r) / 2);
        if (nums[mid] > nums[r]) {
          l = mid + 1;
        } else {
          r = mid;
        }
      }
      return nums[l];
    }
  `,
  war_top_k_frequent_20: `
    function topKFrequent(nums: number[], k: number): number[] {
      const map = new Map<number, number>();
      for (const n of nums) map.set(n, (map.get(n) || 0) + 1);
      const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
      return sorted.slice(0, k).map(e => e[0]);
    }
  `,
  war_letter_combinations_21: `
    function letterCombinations(digits: string): string[] {
      if (!digits) return [];
      const map: Record<string, string> = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
      };
      const res: string[] = [];
      function backtrack(idx: number, curr: string) {
        if (idx === digits.length) {
          res.push(curr);
          return;
        }
        const letters = map[digits[idx]] || '';
        for (const ch of letters) {
          backtrack(idx + 1, curr + ch);
        }
      }
      backtrack(0, '');
      return res;
    }
  `,
  war_rotate_image_22: `
    function rotateImage(matrix: number[][]): number[][] {
      const n = matrix.length;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const temp = matrix[i][j];
          matrix[i][j] = matrix[j][i];
          matrix[j][i] = temp;
        }
      }
      for (let i = 0; i < n; i++) {
        matrix[i].reverse();
      }
      return matrix;
    }
  `,
  war_decode_string_23: `
    function decodeString(s: string): string {
      const countStack: number[] = [];
      const stringStack: string[] = [];
      let currStr = '';
      let k = 0;
      for (const ch of s) {
        if (ch >= '0' && ch <= '9') {
          k = k * 10 + parseInt(ch, 10);
        } else if (ch === '[') {
          countStack.push(k);
          stringStack.push(currStr);
          currStr = '';
          k = 0;
        } else if (ch === ']') {
          const count = countStack.pop() || 0;
          const prev = stringStack.pop() || '';
          currStr = prev + currStr.repeat(count);
        } else {
          currStr += ch;
        }
      }
      return currStr;
    }
  `,

  // 51-60 Advanced
  war_trapping_rain_water_11: `
    function trap(height: number[]): number {
      let left = 0, right = height.length - 1;
      let leftMax = 0, rightMax = 0;
      let water = 0;
      while (left < right) {
        if (height[left] < height[right]) {
          if (height[left] >= leftMax) leftMax = height[left];
          else water += leftMax - height[left];
          left++;
        } else {
          if (height[right] >= rightMax) rightMax = height[right];
          else water += rightMax - height[right];
          right--;
        }
      }
      return water;
    }
  `,
  war_sliding_window_max_12: `
    function maxSlidingWindow(nums: number[], k: number): number[] {
      const deque: number[] = [];
      const res: number[] = [];
      for (let i = 0; i < nums.length; i++) {
        while (deque.length > 0 && deque[0] < i - k + 1) deque.shift();
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
        deque.push(i);
        if (i >= k - 1) res.push(nums[deque[0]]);
      }
      return res;
    }
  `,
  war_word_break_13: `
    function wordBreak(s: string, wordDict: string[]): boolean {
      const set = new Set(wordDict);
      const dp = new Array(s.length + 1).fill(false);
      dp[0] = true;
      for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < i; j++) {
          if (dp[j] && set.has(s.substring(j, i))) {
            dp[i] = true;
            break;
          }
        }
      }
      return dp[s.length];
    }
  `,
  war_longest_increasing_subsequence_14: `
    function lengthOfLIS(nums: number[]): number {
      if (nums.length === 0) return 0;
      const tails: number[] = [];
      for (const x of nums) {
        let i = 0, j = tails.length;
        while (i < j) {
          const m = Math.floor((i + j) / 2);
          if (tails[m] < x) i = m + 1;
          else j = m;
        }
        tails[i] = x;
      }
      return tails.length;
    }
  `,
  war_course_schedule_15: `
    function canFinish(numCourses: number, prerequisites: number[][]): boolean {
      const inDegree = new Array(numCourses).fill(0);
      const adj: number[][] = Array.from({ length: numCourses }, () => []);
      for (const [course, pre] of prerequisites) {
        adj[pre].push(course);
        inDegree[course]++;
      }
      const queue: number[] = [];
      for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) queue.push(i);
      }
      let count = 0;
      while (queue.length > 0) {
        const node = queue.shift()!;
        count++;
        for (const next of adj[node]) {
          inDegree[next]--;
          if (inDegree[next] === 0) queue.push(next);
        }
      }
      return count === numCourses;
    }
  `,
  war_clone_graph_16: `
    function cloneGraphNodes(adjList: number[][]): number[][] {
      return adjList.map(neighbors => neighbors.slice());
    }
  `,
  war_token_bucket_rate_limiter_17: `
    function simulateRateLimiter(
      capacity: number,
      refillRatePerSec: number,
      requests: Array<{ timestamp: number; tokensRequested: number }>
    ): boolean[] {
      let tokens = capacity;
      let lastTime = requests.length > 0 ? requests[0].timestamp : 0;
      const res: boolean[] = [];
      for (const req of requests) {
        const elapsed = Math.max(0, req.timestamp - lastTime);
        tokens = Math.min(capacity, tokens + elapsed * refillRatePerSec);
        lastTime = req.timestamp;
        if (tokens >= req.tokensRequested) {
          tokens -= req.tokensRequested;
          res.push(true);
        } else {
          res.push(false);
        }
      }
      return res;
    }
  `,
  war_median_data_stream_18: `
    function processMedianStream(operations: string[], values: any[][]): number[] {
      const nums: number[] = [];
      const res: number[] = [];
      for (let i = 0; i < operations.length; i++) {
        const op = operations[i];
        if (op === 'addNum') {
          const val = values[i][0];
          let l = 0, r = nums.length;
          while (l < r) {
            const m = Math.floor((l + r) / 2);
            if (nums[m] < val) l = m + 1;
            else r = m;
          }
          nums.splice(l, 0, val);
        } else if (op === 'findMedian') {
          const n = nums.length;
          if (n % 2 === 1) {
            res.push(nums[Math.floor(n / 2)]);
          } else {
            res.push((nums[n / 2 - 1] + nums[n / 2]) / 2);
          }
        }
      }
      return res;
    }
  `,
  war_word_ladder_19: `
    function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
      const wordSet = new Set(wordList);
      if (!wordSet.has(endWord)) return 0;
      const queue: Array<[string, number]> = [[beginWord, 1]];
      const visited = new Set<string>([beginWord]);
      while (queue.length > 0) {
        const [word, len] = queue.shift()!;
        if (word === endWord) return len;
        for (let i = 0; i < word.length; i++) {
          for (let c = 97; c <= 122; c++) {
            const nextWord = word.substring(0, i) + String.fromCharCode(c) + word.substring(i + 1);
            if (wordSet.has(nextWord) && !visited.has(nextWord)) {
              visited.add(nextWord);
              queue.push([nextWord, len + 1]);
            }
          }
        }
      }
      return 0;
    }
  `,
  war_edit_distance_20: `
    function minDistance(word1: string, word2: string): number {
      const m = word1.length, n = word2.length;
      const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (word1[i - 1] === word2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1];
          } else {
            dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
          }
        }
      }
      return dp[m][n];
    }
  `,

  // 61-70 Basic
  war_plus_one_21: `
    function plusOne(digits: number[]): number[] {
      for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] < 9) {
          digits[i]++;
          return digits;
        }
        digits[i] = 0;
      }
      return [1, ...digits];
    }
  `,
  war_longest_common_prefix_22: `
    function longestCommonPrefix(strs: string[]): string {
      if (!strs.length) return "";
      let prefix = strs[0];
      for (let i = 1; i < strs.length; i++) {
        while (!strs[i].startsWith(prefix)) {
          prefix = prefix.slice(0, -1);
          if (!prefix) return "";
        }
      }
      return prefix;
    }
  `,
  war_remove_duplicates_sorted_23: `
    function removeDuplicates(nums: number[]): number[] {
      if (nums.length === 0) return [];
      const res: number[] = [nums[0]];
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[i - 1]) {
          res.push(nums[i]);
        }
      }
      return res;
    }
  `,
  war_valid_perfect_square_24: `
    function isPerfectSquare(num: number): boolean {
      if (num < 1) return false;
      let left = 1, right = num;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const sq = mid * mid;
        if (sq === num) return true;
        if (sq < num) left = mid + 1;
        else right = mid - 1;
      }
      return false;
    }
  `,
  war_excel_column_number_25: `
    function titleToNumber(columnTitle: string): number {
      let res = 0;
      for (let i = 0; i < columnTitle.length; i++) {
        res = res * 26 + (columnTitle.charCodeAt(i) - 64);
      }
      return res;
    }
  `,
  war_max_average_subarray_26: `
    function findMaxAverage(nums: number[], k: number): number {
      let curr = 0;
      for (let i = 0; i < k; i++) curr += nums[i];
      let max = curr;
      for (let i = k; i < nums.length; i++) {
        curr += nums[i] - nums[i - k];
        if (curr > max) max = curr;
      }
      return max / k;
    }
  `,
  war_can_place_flowers_27: `
    function canPlaceFlowers(flowerbed: number[], n: number): boolean {
      let count = 0;
      for (let i = 0; i < flowerbed.length; i++) {
        if (flowerbed[i] === 0) {
          const prev = i === 0 ? 0 : flowerbed[i - 1];
          const next = i === flowerbed.length - 1 ? 0 : flowerbed[i + 1];
          if (prev === 0 && next === 0) {
            flowerbed[i] = 1;
            count++;
          }
        }
      }
      return count >= n;
    }
  `,
  war_isomorphic_strings_28: `
    function isIsomorphic(s: string, t: string): boolean {
      if (s.length !== t.length) return false;
      const mapS = new Map<string, string>();
      const mapT = new Map<string, string>();
      for (let i = 0; i < s.length; i++) {
        const c1 = s[i], c2 = t[i];
        if ((mapS.has(c1) && mapS.get(c1) !== c2) || (mapT.has(c2) && mapT.get(c2) !== c1)) {
          return false;
        }
        mapS.set(c1, c2);
        mapT.set(c2, c1);
      }
      return true;
    }
  `,
  war_find_pivot_index_29: `
    function pivotIndex(nums: number[]): number {
      const total = nums.reduce((a, b) => a + b, 0);
      let leftSum = 0;
      for (let i = 0; i < nums.length; i++) {
        if (leftSum === total - leftSum - nums[i]) return i;
        leftSum += nums[i];
      }
      return -1;
    }
  `,
  war_symmetric_tree_30: `
    function isSymmetric(root: (number | null)[]): boolean {
      if (!root || root.length === 0) return true;
      class TreeNode {
        val: number;
        left: TreeNode | null = null;
        right: TreeNode | null = null;
        constructor(v: number) { this.val = v; }
      }
      const nodes: (TreeNode | null)[] = root.map(v => v === null ? null : new TreeNode(v));
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node) {
          const leftIdx = 2 * i + 1;
          const rightIdx = 2 * i + 2;
          if (leftIdx < nodes.length) node.left = nodes[leftIdx];
          if (rightIdx < nodes.length) node.right = nodes[rightIdx];
        }
      }
      function isMirror(t1: TreeNode | null, t2: TreeNode | null): boolean {
        if (!t1 && !t2) return true;
        if (!t1 || !t2) return false;
        return t1.val === t2.val && isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
      }
      return isMirror(nodes[0] ? nodes[0].left : null, nodes[0] ? nodes[0].right : null);
    }
  `,

  // 71-80 Intermediate
  war_insert_interval_24: `
    function insertInterval(intervals: number[][], newInterval: number[]): number[][] {
      const result: number[][] = [];
      let i = 0;
      while (i < intervals.length && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
      }
      while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
      }
      result.push(newInterval);
      while (i < intervals.length) {
        result.push(intervals[i]);
        i++;
      }
      return result;
    }
  `,
  war_spiral_matrix_25: `
    function spiralOrder(matrix: number[][]): number[] {
      if (!matrix.length) return [];
      const res: number[] = [];
      let top = 0, bottom = matrix.length - 1;
      let left = 0, right = matrix[0].length - 1;
      while (top <= bottom && left <= right) {
        for (let c = left; c <= right; c++) res.push(matrix[top][c]);
        top++;
        for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
        right--;
        if (top <= bottom) {
          for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);
          bottom--;
        }
        if (left <= right) {
          for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);
          left++;
        }
      }
      return res;
    }
  `,
  war_search_rotated_array_26: `
    function searchRotated(nums: number[], target: number): number {
      let left = 0, right = nums.length - 1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[left] <= nums[mid]) {
          if (nums[left] <= target && target < nums[mid]) right = mid - 1;
          else left = mid + 1;
        } else {
          if (nums[mid] < target && target <= nums[right]) left = mid + 1;
          else right = mid - 1;
        }
      }
      return -1;
    }
  `,
  war_coin_change_ii_27: `
    function change(amount: number, coins: number[]): number {
      const dp = new Array(amount + 1).fill(0);
      dp[0] = 1;
      for (const c of coins) {
        for (let a = c; a <= amount; a++) {
          dp[a] += dp[a - c];
        }
      }
      return dp[amount];
    }
  `,
  war_validate_ip_address_28: `
    function validIPAddress(queryIP: string): string {
      if (queryIP.includes('.')) {
        const parts = queryIP.split('.');
        if (parts.length !== 4) return 'Neither';
        for (const p of parts) {
          if (!p || (p.length > 1 && p[0] === '0') || !/^[0-9]+$/.test(p)) return 'Neither';
          const num = Number(p);
          if (num < 0 || num > 255) return 'Neither';
        }
        return 'IPv4';
      } else if (queryIP.includes(':')) {
        const parts = queryIP.split(':');
        if (parts.length !== 8) return 'Neither';
        for (const p of parts) {
          if (!p || p.length > 4 || !/^[0-9a-fA-F]+$/.test(p)) return 'Neither';
        }
        return 'IPv6';
      }
      return 'Neither';
    }
  `,
  war_level_order_traversal_29: `
    function levelOrder(root: (number | null)[]): number[][] {
      if (!root || root.length === 0) return [];
      class TreeNode {
        val: number;
        left: TreeNode | null = null;
        right: TreeNode | null = null;
        constructor(v: number) { this.val = v; }
      }
      const nodes = root.map(v => v === null ? null : new TreeNode(v));
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node) {
          const leftIdx = 2 * i + 1;
          const rightIdx = 2 * i + 2;
          if (leftIdx < nodes.length) node.left = nodes[leftIdx];
          if (rightIdx < nodes.length) node.right = nodes[rightIdx];
        }
      }
      const res: number[][] = [];
      if (!nodes[0]) return res;
      const queue: TreeNode[] = [nodes[0]];
      while (queue.length > 0) {
        const size = queue.length;
        const level: number[] = [];
        for (let i = 0; i < size; i++) {
          const curr = queue.shift()!;
          level.push(curr.val);
          if (curr.left) queue.push(curr.left);
          if (curr.right) queue.push(curr.right);
        }
        res.push(level);
      }
      return res;
    }
  `,
  war_simplify_path_30: `
    function simplifyPath(path: string): string {
      const parts = path.split('/');
      const stack: string[] = [];
      for (const p of parts) {
        if (!p || p === '.') continue;
        if (p === '..') {
          if (stack.length > 0) stack.pop();
        } else {
          stack.push(p);
        }
      }
      return '/' + stack.join('/');
    }
  `,
  war_partition_labels_31: `
    function partitionLabels(s: string): number[] {
      const last = new Map<string, number>();
      for (let i = 0; i < s.length; i++) last.set(s[i], i);
      const result: number[] = [];
      let start = 0, end = 0;
      for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last.get(s[i])!);
        if (i === end) {
          result.push(end - start + 1);
          start = i + 1;
        }
      }
      return result;
    }
  `,
  war_continuous_subarray_sum_32: `
    function checkSubarraySum(nums: number[], k: number): boolean {
      const map = new Map<number, number>();
      map.set(0, -1);
      let rem = 0;
      for (let i = 0; i < nums.length; i++) {
        rem = (rem + nums[i]) % k;
        if (map.has(rem)) {
          if (i - map.get(rem)! >= 2) return true;
        } else {
          map.set(rem, i);
        }
      }
      return false;
    }
  `,
  war_binary_tree_right_side_33: `
    function rightSideView(root: (number | null)[]): number[] {
      if (!root || root.length === 0) return [];
      class TreeNode {
        val: number;
        left: TreeNode | null = null;
        right: TreeNode | null = null;
        constructor(v: number) { this.val = v; }
      }
      const nodes = root.map(v => v === null ? null : new TreeNode(v));
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node) {
          const leftIdx = 2 * i + 1;
          const rightIdx = 2 * i + 2;
          if (leftIdx < nodes.length) node.left = nodes[leftIdx];
          if (rightIdx < nodes.length) node.right = nodes[rightIdx];
        }
      }
      const res: number[] = [];
      if (!nodes[0]) return res;
      const queue: TreeNode[] = [nodes[0]];
      while (queue.length > 0) {
        const size = queue.length;
        for (let i = 0; i < size; i++) {
          const curr = queue.shift()!;
          if (i === size - 1) res.push(curr.val);
          if (curr.left) queue.push(curr.left);
          if (curr.right) queue.push(curr.right);
        }
      }
      return res;
    }
  `,

  // 81-90 Advanced
  war_merge_k_sorted_lists_21: `
    function mergeKLists(lists: number[][]): number[] {
      const result: number[][] = [];
      for (const list of lists) {
        for (const v of list) (result as any).push(v);
      }
      result.sort((a: any, b: any) => a - b);
      return result as any;
    }
  `,
  war_alien_dictionary_22: `
    function alienOrder(words: string[]): string {
      const adj = new Map<string, Set<string>>();
      const inDegree = new Map<string, number>();
      for (const word of words) {
        for (const c of word) {
          if (!adj.has(c)) adj.set(c, new Set());
          if (!inDegree.has(c)) inDegree.set(c, 0);
        }
      }
      for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i], w2 = words[i + 1];
        if (w1.length > w2.length && w1.startsWith(w2)) return "";
        for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
          if (w1[j] !== w2[j]) {
            if (!adj.get(w1[j])!.has(w2[j])) {
              adj.get(w1[j])!.add(w2[j]);
              inDegree.set(w2[j], inDegree.get(w2[j])! + 1);
            }
            break;
          }
        }
      }
      const queue: string[] = [];
      for (const [c, deg] of inDegree.entries()) {
        if (deg === 0) queue.push(c);
      }
      let res = "";
      while (queue.length > 0) {
        const curr = queue.shift()!;
        res += curr;
        for (const neighbor of adj.get(curr)!) {
          inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
          if (inDegree.get(neighbor) === 0) queue.push(neighbor);
        }
      }
      return res.length === inDegree.size ? res : "";
    }
  `,
  war_longest_valid_parentheses_23: `
    function longestValidParentheses(s: string): number {
      const stack = [-1];
      let maxLen = 0;
      for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
          stack.push(i);
        } else {
          stack.pop();
          if (stack.length === 0) {
            stack.push(i);
          } else {
            maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
          }
        }
      }
      return maxLen;
    }
  `,
  war_serialize_deserialize_tree_24: `
    function roundTripTree(root: (number | null)[]): (number | null)[] {
      function serialize(arr: (number | null)[]): string {
        return JSON.stringify(arr);
      }
      function deserialize(data: string): (number | null)[] {
        return JSON.parse(data);
      }
      return deserialize(serialize(root));
    }
  `,
  war_largest_rectangle_histogram_25: `
    function largestRectangleArea(heights: number[]): number {
      const stack: number[] = [];
      let maxArea = 0;
      const h = heights.concat([0]);
      for (let i = 0; i < h.length; i++) {
        while (stack.length > 0 && h[stack[stack.length - 1]] > h[i]) {
          const height = h[stack.pop()!];
          const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
          maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
      }
      return maxArea;
    }
  `,
  war_min_window_substring_26: `
    function minWindow(s: string, t: string): string {
      if (!s || !t) return "";
      const tMap = new Map<string, number>();
      for (const c of t) tMap.set(c, (tMap.get(c) || 0) + 1);
      let required = tMap.size;
      let left = 0, right = 0, formed = 0;
      const windowCounts = new Map<string, number>();
      let ans: [number, number, number] = [-1, 0, 0];
      while (right < s.length) {
        const c = s[right];
        windowCounts.set(c, (windowCounts.get(c) || 0) + 1);
        if (tMap.has(c) && windowCounts.get(c) === tMap.get(c)) formed++;
        while (left <= right && formed === required) {
          if (ans[0] === -1 || (right - left + 1) < ans[0]) {
            ans = [right - left + 1, left, right];
          }
          const charL = s[left];
          windowCounts.set(charL, windowCounts.get(charL)! - 1);
          if (tMap.has(charL) && windowCounts.get(charL)! < tMap.get(charL)!) {
            formed--;
          }
          left++;
        }
        right++;
      }
      return ans[0] === -1 ? "" : s.substring(ans[1], ans[2] + 1);
    }
  `,
  war_palindrome_partitioning_ii_27: `
    function minCut(s: string): number {
      const n = s.length;
      const isPal = Array.from({ length: n }, () => new Array(n).fill(false));
      for (let r = 0; r < n; r++) {
        for (let l = 0; l <= r; l++) {
          if (s[l] === s[r] && (r - l <= 2 || isPal[l + 1][r - 1])) {
            isPal[l][r] = true;
          }
        }
      }
      const cuts = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        if (isPal[0][i]) {
          cuts[i] = 0;
        } else {
          let minC = i;
          for (let j = 0; j < i; j++) {
            if (isPal[j + 1][i]) {
              minC = Math.min(minC, cuts[j] + 1);
            }
          }
          cuts[i] = minC;
        }
      }
      return cuts[n - 1];
    }
  `,
  war_consistent_hashing_ring_28: `
    function routeRequest(nodes: number[], key: number): number {
      if (!nodes || nodes.length === 0) return 0;
      const sorted = nodes.slice().sort((a, b) => a - b);
      for (const n of sorted) {
        if (n >= key) return n;
      }
      return sorted[0];
    }
  `,
  war_basic_calculator_29: `
    function calculate(s: string): number {
      let res = 0, num = 0, sign = 1;
      const stack: number[] = [];
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c >= '0' && c <= '9') {
          num = num * 10 + (c.charCodeAt(0) - 48);
        } else if (c === '+') {
          res += sign * num;
          num = 0;
          sign = 1;
        } else if (c === '-') {
          res += sign * num;
          num = 0;
          sign = -1;
        } else if (c === '(') {
          stack.push(res);
          stack.push(sign);
          res = 0;
          sign = 1;
        } else if (c === ')') {
          res += sign * num;
          num = 0;
          res *= stack.pop()!;
          res += stack.pop()!;
        }
      }
      res += sign * num;
      return res;
    }
  `,
  war_maximal_square_30: `
    function maximalSquare(matrix: string[][]): number {
      if (!matrix.length || !matrix[0].length) return 0;
      const m = matrix.length, n = matrix[0].length;
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      let maxSide = 0;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (matrix[i - 1][j - 1] === '1') {
            dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
            if (dp[i][j] > maxSide) maxSide = dp[i][j];
          }
        }
      }
      return maxSide * maxSide;
    }
  `,

  // --- 30 NEW TYPESCRIPT REFERENCE SOLUTIONS (91-120) ---
  // war_hamming_weight_31
  war_hamming_weight_31: `
function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n = (n & (n - 1)) >>> 0;
    count++;
  }
  return count;
}
  `,
  // war_strstr_needle_32
  war_strstr_needle_32: `
function strStr(haystack: string, needle: string): number {
  if (needle === "") return 0;
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    if (haystack.substring(i, i + needle.length) === needle) return i;
  }
  return -1;
}
  `,
  // war_backspace_string_compare_33
  war_backspace_string_compare_33: `
function backspaceCompare(s: string, t: string): boolean {
  const build = (str: string) => {
    const stack: string[] = [];
    for (const c of str) {
      if (c === "#") stack.pop();
      else stack.push(c);
    }
    return stack.join("");
  };
  return build(s) === build(t);
}
  `,
  // war_squares_sorted_array_34
  war_squares_sorted_array_34: `
function sortedSquares(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n);
  let left = 0, right = n - 1;
  let pos = n - 1;
  while (left <= right) {
    const leftSq = nums[left] * nums[left];
    const rightSq = nums[right] * nums[right];
    if (leftSq > rightSq) {
      result[pos--] = leftSq;
      left++;
    } else {
      result[pos--] = rightSq;
      right--;
    }
  }
  return result;
}
  `,
  // war_ransom_note_35
  war_ransom_note_35: `
function canConstruct(ransomNote: string, magazine: string): boolean {
  const counts: Record<string, number> = {};
  for (const c of magazine) counts[c] = (counts[c] || 0) + 1;
  for (const c of ransomNote) {
    if (!counts[c]) return false;
    counts[c]--;
  }
  return true;
}
  `,
  // war_maximum_units_truck_36
  war_maximum_units_truck_36: `
function maximumUnits(boxTypes: number[][], truckSize: number): number {
  boxTypes.sort((a, b) => b[1] - a[1]);
  let total = 0;
  for (const [count, units] of boxTypes) {
    const take = Math.min(count, truckSize);
    total += take * units;
    truckSize -= take;
    if (truckSize <= 0) break;
  }
  return total;
}
  `,
  // war_monotonic_array_37
  war_monotonic_array_37: `
function isMonotonic(nums: number[]): boolean {
  let inc = true, dec = true;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] > nums[i+1]) inc = false;
    if (nums[i] < nums[i+1]) dec = false;
  }
  return inc || dec;
}
  `,
  // war_replace_elements_greatest_right_38
  war_replace_elements_greatest_right_38: `
function replaceElements(arr: number[]): number[] {
  const res = arr.slice();
  let maxRight = -1;
  for (let i = res.length - 1; i >= 0; i--) {
    const cur = res[i];
    res[i] = maxRight;
    if (cur > maxRight) maxRight = cur;
  }
  return res;
}
  `,
  // war_kth_missing_positive_39
  war_kth_missing_positive_39: `
function findKthPositive(arr: number[], k: number): number {
  let left = 0, right = arr.length;
  while (left < right) {
    const mid = (left + right) >> 1;
    if (arr[mid] - (mid + 1) < k) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left + k;
}
  `,
  // war_peak_index_mountain_40
  war_peak_index_mountain_40: `
function peakIndexInMountainArray(arr: number[]): number {
  let l = 0, r = arr.length - 1;
  while (l < r) {
    const mid = (l + r) >> 1;
    if (arr[mid] < arr[mid + 1]) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }
  return l;
}
  `,
  // war_gas_station_34
  war_gas_station_34: `
function canCompleteCircuit(gas: number[], cost: number[]): number {
  let totalGas = 0, totalCost = 0;
  let start = 0, tank = 0;
  for (let i = 0; i < gas.length; i++) {
    totalGas += gas[i];
    totalCost += cost[i];
    tank += gas[i] - cost[i];
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return totalGas < totalCost ? -1 : start;
}
  `,
  // war_koko_eating_bananas_35
  war_koko_eating_bananas_35: `
function minEatingSpeed(piles: number[], h: number): number {
  let left = 1, right = Math.max(...piles);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    let hours = 0;
    for (const p of piles) {
      hours += Math.ceil(p / mid);
    }
    if (hours <= h) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}
  `,
  // war_longest_palindromic_substring_36
  war_longest_palindromic_substring_36: `
function longestPalindrome(s: string): string {
  if (s.length < 2) return s;
  let start = 0, maxLen = 0;
  const expand = (left: number, right: number) => {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    const len = right - left - 1;
    if (len > maxLen) {
      maxLen = len;
      start = left + 1;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.substring(start, start + maxLen);
}
  `,
  // war_house_robber_ii_37
  war_house_robber_ii_37: `
function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0];
  const robLinear = (sub: number[]) => {
    let p1 = 0, p2 = 0;
    for (const num of sub) {
      const temp = Math.max(p1, p2 + num);
      p2 = p1;
      p1 = temp;
    }
    return p1;
  };
  return Math.max(
    robLinear(nums.slice(0, nums.length - 1)),
    robLinear(nums.slice(1))
  );
}
  `,
  // war_next_greater_element_ii_38
  war_next_greater_element_ii_38: `
function nextGreaterElements(nums: number[]): number[] {
  const n = nums.length;
  const res = new Array(n).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < 2 * n; i++) {
    const num = nums[i % n];
    while (stack.length > 0 && nums[stack[stack.length - 1]] < num) {
      res[stack.pop()!] = num;
    }
    if (i < n) stack.push(i);
  }
  return res;
}
  `,
  // war_rotting_oranges_39
  war_rotting_oranges_39: `
function orangesRotting(grid: number[][]): number {
  const m = grid.length, n = grid[0].length;
  const queue: [number, number][] = [];
  let fresh = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  if (fresh === 0) return 0;
  let minutes = 0;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while (queue.length > 0 && fresh > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          queue.push([nr, nc]);
        }
      }
    }
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}
  `,
  // war_find_all_anagrams_40
  war_find_all_anagrams_40: `
function findAnagrams(s: string, p: string): number[] {
  if (s.length < p.length) return [];
  const pCount = new Array(26).fill(0);
  const sCount = new Array(26).fill(0);
  const aCode = 97;
  for (let i = 0; i < p.length; i++) {
    pCount[p.charCodeAt(i) - aCode]++;
    sCount[s.charCodeAt(i) - aCode]++;
  }
  const res: number[] = [];
  const matches = () => {
    for (let i = 0; i < 26; i++) if (pCount[i] !== sCount[i]) return false;
    return true;
  };
  if (matches()) res.push(0);
  for (let i = p.length; i < s.length; i++) {
    sCount[s.charCodeAt(i) - aCode]++;
    sCount[s.charCodeAt(i - p.length) - aCode]--;
    if (matches()) res.push(i - p.length + 1);
  }
  return res;
}
  `,
  // war_word_search_41
  war_word_search_41: `
function exist(board: string[][], word: string): boolean {
  const m = board.length, n = board[0].length;
  const dfs = (r: number, c: number, idx: number): boolean => {
    if (idx === word.length) return true;
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;
    const temp = board[r][c];
    board[r][c] = "#";
    const found = dfs(r+1, c, idx+1) || dfs(r-1, c, idx+1) || dfs(r, c+1, idx+1) || dfs(r, c-1, idx+1);
    board[r][c] = temp;
    return found;
  };
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}
  `,
  // war_car_fleet_42
  war_car_fleet_42: `
function carFleet(target: number, position: number[], speed: number[]): number {
  const cars: [number, number][] = position.map((p, i) => [p, speed[i]]);
  cars.sort((a, b) => b[0] - a[0]);
  let fleets = 0;
  let prevTime = 0;
  for (const [p, s] of cars) {
    const time = (target - p) / s;
    if (time > prevTime) {
      fleets++;
      prevTime = time;
    }
  }
  return fleets;
}
  `,
  // war_reorganize_string_43
  war_reorganize_string_43: `
function reorganizeString(s: string): string {
  const counts: Record<string, number> = {};
  for (const c of s) counts[c] = (counts[c] || 0) + 1;
  const maxCount = Math.max(...Object.values(counts));
  if (maxCount > Math.floor((s.length + 1) / 2)) return "";
  const chars = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const res = new Array(s.length);
  let idx = 0;
  for (const c of chars) {
    let count = counts[c];
    while (count > 0) {
      if (idx >= s.length) idx = 1;
      res[idx] = c;
      idx += 2;
      count--;
    }
  }
  return res.join("");
}
  `,
  // war_lfu_cache_31
  war_lfu_cache_31: `
function simulateLFU(capacity: number, operations: string[][]): (number | null)[] {
  const keyVal = new Map<string, number>();
  const keyFreq = new Map<string, number>();
  const freqKeys = new Map<number, Set<string>>();
  let minFreq = 0;
  const results: (number | null)[] = [];
  for (const op of operations) {
    const type = op[0];
    if (type === "get") {
      const key = op[1];
      if (!keyVal.has(key)) {
        results.push(-1);
        continue;
      }
      const val = keyVal.get(key)!;
      const freq = keyFreq.get(key)!;
      keyFreq.set(key, freq + 1);
      freqKeys.get(freq)!.delete(key);
      if (freqKeys.get(freq)!.size === 0) {
        freqKeys.delete(freq);
        if (minFreq === freq) minFreq = freq + 1;
      }
      if (!freqKeys.has(freq + 1)) freqKeys.set(freq + 1, new Set());
      freqKeys.get(freq + 1)!.add(key);
      results.push(val);
    } else if (type === "put") {
      const key = op[1];
      const val = Number(op[2]);
      if (capacity <= 0) {
        results.push(null);
        continue;
      }
      if (keyVal.has(key)) {
        keyVal.set(key, val);
        const freq = keyFreq.get(key)!;
        keyFreq.set(key, freq + 1);
        freqKeys.get(freq)!.delete(key);
        if (freqKeys.get(freq)!.size === 0) {
          freqKeys.delete(freq);
          if (minFreq === freq) minFreq = freq + 1;
        }
        if (!freqKeys.has(freq + 1)) freqKeys.set(freq + 1, new Set());
        freqKeys.get(freq + 1)!.add(key);
      } else {
        if (keyVal.size >= capacity) {
          const evictKeys = freqKeys.get(minFreq)!;
          const evictKey = evictKeys.values().next().value;
          evictKeys.delete(evictKey);
          keyVal.delete(evictKey);
          keyFreq.delete(evictKey);
        }
        keyVal.set(key, val);
        keyFreq.set(key, 1);
        minFreq = 1;
        if (!freqKeys.has(1)) freqKeys.set(1, new Set());
        freqKeys.get(1)!.add(key);
      }
      results.push(null);
    }
  }
  return results;
}
  `,
  // war_wildcard_matching_32
  war_wildcard_matching_32: `
function isMatch(s: string, p: string): boolean {
  const m = s.length, n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === "*") dp[0][j] = dp[0][j - 1];
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
      } else if (p[j - 1] === "?" || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n];
}
  `,
  // war_burst_balloons_33
  war_burst_balloons_33: `
function maxCoins(nums: number[]): number {
  const arr = [1, ...nums, 1];
  const n = arr.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let len = 1; len <= nums.length; len++) {
    for (let i = 1; i <= nums.length - len + 1; i++) {
      const j = i + len - 1;
      for (let k = i; k <= j; k++) {
        const coins = dp[i][k - 1] + arr[i - 1] * arr[k] * arr[j + 1] + dp[k + 1][j];
        if (coins > dp[i][j]) dp[i][j] = coins;
      }
    }
  }
  return dp[1][nums.length];
}
  `,
  // war_n_queens_34
  war_n_queens_34: `
function totalNQueens(n: number): number {
  let count = 0;
  const solve = (row: number, cols: number, diag1: number, diag2: number) => {
    if (row === n) {
      count++;
      return;
    }
    let available = ((1 << n) - 1) & ~(cols | diag1 | diag2);
    while (available > 0) {
      const bit = available & -available;
      available ^= bit;
      solve(row + 1, cols | bit, (diag1 | bit) << 1, (diag2 | bit) >> 1);
    }
  };
  solve(0, 0, 0, 0);
  return count;
}
  `,
  // war_regular_expression_matching_35
  war_regular_expression_matching_35: `
function isRegexMatch(s: string, p: string): boolean {
  const m = s.length, n = p.length;
  const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= n; j += 2) {
    if (p[j - 1] === "*") dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === "*") {
        const noMatch = dp[i][j - 2];
        const matchPrev = (p[j - 2] === "." || p[j - 2] === s[i - 1]) && dp[i - 1][j];
        dp[i][j] = noMatch || matchPrev;
      } else {
        dp[i][j] = (p[j - 1] === "." || p[j - 1] === s[i - 1]) && dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n];
}
  `,
  // war_maximal_rectangle_36
  war_maximal_rectangle_36: `
function maximalRectangle(matrix: string[][]): number {
  if (!matrix.length || !matrix[0].length) return 0;
  const cols = matrix[0].length;
  const heights = new Array(cols).fill(0);
  let maxArea = 0;
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < cols; c++) {
      heights[c] = matrix[r][c] === "1" ? heights[c] + 1 : 0;
    }
    const stack: number[] = [];
    const h = [...heights, 0];
    for (let i = 0; i < h.length; i++) {
      while (stack.length > 0 && h[stack[stack.length - 1]] >= h[i]) {
        const height = h[stack.pop()!];
        const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
        maxArea = Math.max(maxArea, height * width);
      }
      stack.push(i);
    }
  }
  return maxArea;
}
  `,
  // war_network_delay_dijkstra_37
  war_network_delay_dijkstra_37: `
function networkDelayTime(times: number[][], n: number, k: number): number {
  const graph: Record<number, [number, number][]> = {};
  for (let i = 1; i <= n; i++) graph[i] = [];
  for (const [u, v, w] of times) graph[u].push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const visited = new Set<number>();
  for (let i = 0; i < n; i++) {
    let u = -1;
    for (let node = 1; node <= n; node++) {
      if (!visited.has(node) && (u === -1 || dist[node] < dist[u])) {
        u = node;
      }
    }
    if (u === -1 || dist[u] === Infinity) break;
    visited.add(u);
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  let maxDist = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    if (dist[i] > maxDist) maxDist = dist[i];
  }
  return maxDist;
}
  `,
  // war_shortest_palindrome_38
  war_shortest_palindrome_38: `
function shortestPalindrome(s: string): string {
  const rev = s.split("").reverse().join("");
  const combined = s + "#" + rev;
  const pi = new Array(combined.length).fill(0);
  for (let i = 1; i < combined.length; i++) {
    let j = pi[i - 1];
    while (j > 0 && combined[i] !== combined[j]) j = pi[j - 1];
    if (combined[i] === combined[j]) j++;
    pi[i] = j;
  }
  const matchLen = pi[combined.length - 1];
  const suffix = s.substring(matchLen);
  return suffix.split("").reverse().join("") + s;
}
  `,
  // war_swim_in_rising_water_39
  war_swim_in_rising_water_39: `
function swimInWater(grid: number[][]): number {
  const n = grid.length;
  let left = grid[0][0], right = n * n - 1;
  const canReach = (t: number): boolean => {
    if (grid[0][0] > t) return false;
    const visited: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    const queue: [number, number][] = [[0, 0]];
    visited[0][0] = true;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      if (r === n - 1 && c === n - 1) return true;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] <= t) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return false;
  };
  while (left < right) {
    const mid = (left + right) >> 1;
    if (canReach(mid)) right = mid;
    else left = mid + 1;
  }
  return left;
}
  `,
  // war_binary_tree_max_path_sum_40
  war_binary_tree_max_path_sum_40: `
function maxPathSum(rootArr: (number | null)[]): number {
  if (!rootArr.length || rootArr[0] === null) return 0;
  interface TreeNode { val: number; left?: TreeNode; right?: TreeNode; }
  const root: TreeNode = { val: rootArr[0] };
  const queue: TreeNode[] = [root];
  let i = 1;
  while (i < rootArr.length && queue.length > 0) {
    const curr = queue.shift()!;
    if (i < rootArr.length && rootArr[i] !== null) {
      curr.left = { val: rootArr[i]! };
      queue.push(curr.left);
    }
    i++;
    if (i < rootArr.length && rootArr[i] !== null) {
      curr.right = { val: rootArr[i]! };
      queue.push(curr.right);
    }
    i++;
  }
  let globalMax = -Infinity;
  const postOrder = (node?: TreeNode): number => {
    if (!node) return 0;
    const leftGain = Math.max(0, postOrder(node.left));
    const rightGain = Math.max(0, postOrder(node.right));
    const priceNewPath = node.val + leftGain + rightGain;
    if (priceNewPath > globalMax) globalMax = priceNewPath;
    return node.val + Math.max(leftGain, rightGain);
  };
  postOrder(root);
  return globalMax;
}
  `,
};

const PY_SOLUTIONS: Record<string, string> = {
  // 1-30 existing
  war_two_sum_01: `
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            return [seen[comp], i]
        seen[num] = i
    return []
  `,
  war_valid_palindrome_02: `
def is_palindrome(s):
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]
  `,
  war_reverse_string_03: `
def reverse_words(s):
    return " ".join(s.strip().split()[::-1])
  `,
  war_valid_parentheses_04: `
def is_valid_parentheses(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in "({[":
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return len(stack) == 0
  `,
  war_max_subarray_05: `
def max_sub_array(nums):
    max_so_far = nums[0]
    curr_max = nums[0]
    for n in nums[1:]:
        curr_max = max(n, curr_max + n)
        max_so_far = max(max_so_far, curr_max)
    return max_so_far
  `,
  war_best_stock_06: `
def max_profit(prices):
    min_price = float('inf')
    max_prof = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > max_prof:
            max_prof = p - min_price
    return max_prof
  `,
  war_tree_lca_01: `
def lowest_common_ancestor(root, p, q):
    curr = root
    while curr:
        if p < curr.val and q < curr.val:
            curr = curr.left
        elif p > curr.val and q > curr.val:
            curr = curr.right
        else:
            return curr.val
    return None
  `,
  war_concurrency_deadlock_02: `
def acquire_resources_deterministically(requests):
    seen = set()
    for r in requests:
        for res in r.get("resourceIds", []):
            seen.add(res)
    return sorted(list(seen))
  `,
  war_sql_btree_query_03: `
def generate_optimal_composite_index(table, equality_cols, range_col):
    cols = list(equality_cols) + [range_col]
    idx_name = f"idx_{table}_{'_'.join(cols)}"
    return f"CREATE INDEX {idx_name} ON {table} ({', '.join(cols)});"
  `,
  war_contains_duplicate_04: `
def contains_duplicate(nums):
    return len(set(nums)) != len(nums)
  `,
  war_valid_anagram_05: `
def is_anagram(s, t):
    return sorted(s) == sorted(t)
  `,
  war_move_zeroes_06: `
def move_zeroes(nums):
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write] = nums[read]
            write += 1
    while write < len(nums):
        nums[write] = 0
        write += 1
    return nums
  `,
  war_single_number_07: `
def single_number(nums):
    res = 0
    for n in nums:
        res ^= n
    return res
  `,
  war_missing_number_08: `
def missing_number(nums):
    n = len(nums)
    expected = (n * (n + 1)) // 2
    return expected - sum(nums)
  `,
  war_merge_sorted_arrays_09: `
def merge_sorted_arrays(nums1, nums2):
    res = []
    i, j = 0, 0
    while i < len(nums1) and j < len(nums2):
        if nums1[i] <= nums2[j]:
            res.append(nums1[i])
            i += 1
        else:
            res.append(nums2[j])
            j += 1
    res.extend(nums1[i:])
    res.extend(nums2[j:])
    return res
  `,
  war_roman_to_int_10: `
def roman_to_int(s):
    val_map = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    total = 0
    for i in range(len(s)):
        curr = val_map[s[i]]
        if i + 1 < len(s) and curr < val_map[s[i+1]]:
            total -= curr
        else:
            total += curr
    return total
  `,
  war_binary_search_07: `
def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
  `,
  war_reverse_linked_list_08: `
def reverse_list(head):
    if not isinstance(head, list):
        return []
    return head[::-1]
  `,
  war_longest_substring_09: `
def length_of_longest_substring(s):
    seen = {}
    max_len = 0
    left = 0
    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1
        seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len
  `,
  war_container_water_10: `
def max_area(height):
    left, right = 0, len(height) - 1
    max_vol = 0
    while left < right:
        h = min(height[left], height[right])
        max_vol = max(max_vol, h * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_vol
  `,
  war_product_except_self_11: `
def product_except_self(nums):
    n = len(nums)
    res = [1] * n
    left = 1
    for i in range(n):
        res[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        res[i] *= right
        right *= nums[i]
    return res
  `,
  war_three_sum_12: `
def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s == 0:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif s < 0:
                left += 1
            else:
                right -= 1
    return res
  `,
  war_min_stack_13: `
def process_min_stack(ops, vals):
    stack = []
    min_stack = []
    res = []
    for op, val in zip(ops, vals):
        if op == "push":
            v = val[0]
            stack.append(v)
            if not min_stack or v <= min_stack[-1]:
                min_stack.append(v)
        elif op == "pop":
            popped = stack.pop()
            if popped == min_stack[-1]:
                min_stack.pop()
        elif op == "getMin":
            res.append(min_stack[-1])
    return res
  `,
  war_invert_binary_tree_04: `
def invert_tree(root):
    if not root:
        return []
    class Node:
        def __init__(self, v):
            self.val = v
            self.left = None
            self.right = None
    nodes = [Node(v) if v is not None else None for v in root]
    for i, n in enumerate(nodes):
        if n:
            l = 2 * i + 1
            r = 2 * i + 2
            if l < len(nodes): n.left = nodes[l]
            if r < len(nodes): n.right = nodes[r]
    def invert(node):
        if not node: return
        node.left, node.right = node.right, node.left
        invert(node.left)
        invert(node.right)
    invert(nodes[0])
    res = []
    q = [nodes[0]]
    while q:
        curr = q.pop(0)
        if curr:
            res.append(curr.val)
            q.append(curr.left)
            q.append(curr.right)
    return res
  `,
  war_max_depth_tree_05: `
def max_depth(root):
    if not root or root[0] is None:
        return 0
    depth = 0
    level_size = 1
    i = 0
    while i < len(root):
        has_node = False
        for _ in range(min(level_size, len(root) - i)):
            if root[i] is not None:
                has_node = True
            i += 1
        if has_node:
            depth += 1
        level_size *= 2
    return depth
  `,
  war_validate_bst_06: `
def is_valid_bst(root):
    if not root or root[0] is None:
        return True
    def validate(idx, min_val, max_val):
        if idx >= len(root) or root[idx] is None:
            return True
        val = root[idx]
        if val <= min_val or val >= max_val:
            return False
        return validate(2 * idx + 1, min_val, val) and validate(2 * idx + 2, val, max_val)
    return validate(0, float('-inf'), float('inf'))
  `,
  war_coin_change_07: `
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
  `,
  war_house_robber_08: `
def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    p2, p1 = 0, nums[0]
    for n in nums[1:]:
        p2, p1 = p1, max(p1, p2 + n)
    return p1
  `,
  war_kth_largest_09: `
def find_kth_largest(nums, k):
    return sorted(nums, reverse=True)[k - 1]
  `,
  war_number_of_islands_10: `
def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count
  `,

  // 31-40 Basic
  war_majority_element_11: `
def majority_element(nums):
    count = 0
    candidate = None
    for n in nums:
        if count == 0:
            candidate = n
        count += 1 if n == candidate else -1
    return candidate
  `,
  war_first_unique_char_12: `
def first_uniq_char(s):
    from collections import Counter
    counts = Counter(s)
    for i, c in enumerate(s):
        if counts[c] == 1:
            return i
    return -1
  `,
  war_climbing_stairs_13: `
def climb_stairs(n):
    if n <= 2:
        return n
    p2, p1 = 1, 2
    for _ in range(3, n + 1):
        p2, p1 = p1, p1 + p2
    return p1
  `,
  war_valid_palindrome_ii_14: `
def valid_palindrome(s):
    def is_pal(l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1
        return True
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return is_pal(l + 1, r) or is_pal(l, r - 1)
        l += 1
        r -= 1
    return True
  `,
  war_intersection_arrays_15: `
def intersection(nums1, nums2):
    return list(set(nums1) & set(nums2))
  `,
  war_pascals_triangle_16: `
def generate_pascal(num_rows):
    triangle = []
    for i in range(num_rows):
        row = [1] * (i + 1)
        for j in range(1, i):
            row[j] = triangle[i - 1][j - 1] + triangle[i - 1][j]
        triangle.append(row)
    return triangle
  `,
  war_disappeared_numbers_17: `
def find_disappeared_numbers(nums):
    for i in range(len(nums)):
        val = abs(nums[i]) - 1
        if nums[val] > 0:
            nums[val] = -nums[val]
    return [i + 1 for i in range(len(nums)) if nums[i] > 0]
  `,
  war_summary_ranges_18: `
def summary_ranges(nums):
    res = []
    i = 0
    n = len(nums)
    while i < n:
        start = nums[i]
        while i + 1 < n and nums[i + 1] == nums[i] + 1:
            i += 1
        if start == nums[i]:
            res.append(str(start))
        else:
            res.append(f"{start}->{nums[i]}")
        i += 1
    return res
  `,
  war_happy_number_19: `
def is_happy(n):
    seen = set()
    curr = n
    while curr != 1 and curr not in seen:
        seen.add(curr)
        curr = sum(int(d) ** 2 for d in str(curr))
    return curr == 1
  `,
  war_length_of_last_word_20: `
def length_of_last_word(s):
    words = s.strip().split()
    return len(words[-1]) if words else 0
  `,

  // 41-50 Intermediate
  war_lru_cache_14: `
def process_lru_cache(capacity, operations, values):
    from collections import OrderedDict
    cache = OrderedDict()
    res = []
    for op, val in zip(operations, values):
        if op == "put":
            k, v = val[0], val[1]
            if k in cache:
                cache.move_to_end(k)
            elif len(cache) >= capacity:
                cache.popitem(last=False)
            cache[k] = v
            res.append(None)
        elif op == "get":
            k = val[0]
            if k not in cache:
                res.append(-1)
            else:
                cache.move_to_end(k)
                res.append(cache[k])
    return res
  `,
  war_group_anagrams_15: `
def group_anagrams(strs):
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())
  `,
  war_merge_intervals_16: `
def merge_intervals(intervals):
    if len(intervals) <= 1:
        return intervals
    intervals.sort(key=lambda x: x[0])
    res = [intervals[0]]
    for curr in intervals[1:]:
        prev = res[-1]
        if curr[0] <= prev[1]:
            prev[1] = max(prev[1], curr[1])
        else:
            res.append(curr)
    return res
  `,
  war_daily_temperatures_17: `
def daily_temperatures(temperatures):
    n = len(temperatures)
    res = [0] * n
    stack = []
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            prev = stack.pop()
            res[prev] = i - prev
        stack.append(i)
    return res
  `,
  war_subarray_sum_k_18: `
def subarray_sum(nums, k):
    from collections import defaultdict
    counts = defaultdict(int)
    counts[0] = 1
    curr = 0
    ans = 0
    for n in nums:
        curr += n
        ans += counts[curr - k]
        counts[curr] += 1
    return ans
  `,
  war_find_min_rotated_19: `
def find_min(nums):
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if nums[mid] > nums[r]:
            l = mid + 1
        else:
            r = mid
    return nums[l]
  `,
  war_top_k_frequent_20: `
def top_k_frequent(nums, k):
    from collections import Counter
    c = Counter(nums)
    return [elem for elem, _ in c.most_common(k)]
  `,
  war_letter_combinations_21: `
def letter_combinations(digits):
    if not digits:
        return []
    mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    res = []
    def backtrack(idx, curr):
        if idx == len(digits):
            res.append(curr)
            return
        for ch in mapping.get(digits[idx], ''):
            backtrack(idx + 1, curr + ch)
    backtrack(0, '')
    return res
  `,
  war_rotate_image_22: `
def rotate_image(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for i in range(n):
        matrix[i].reverse()
    return matrix
  `,
  war_decode_string_23: `
def decode_string(s):
    count_stack = []
    string_stack = []
    curr_str = ""
    k = 0
    for ch in s:
        if ch.isdigit():
            k = k * 10 + int(ch)
        elif ch == '[':
            count_stack.append(k)
            string_stack.append(curr_str)
            curr_str = ""
            k = 0
        elif ch == ']':
            count = count_stack.pop()
            prev = string_stack.pop()
            curr_str = prev + curr_str * count
        else:
            curr_str += ch
    return curr_str
  `,

  // 51-60 Advanced
  war_trapping_rain_water_11: `
def trap(height):
    l, r = 0, len(height) - 1
    l_max, r_max = 0, 0
    water = 0
    while l < r:
        if height[l] < height[r]:
            if height[l] >= l_max:
                l_max = height[l]
            else:
                water += l_max - height[l]
            l += 1
        else:
            if height[r] >= r_max:
                r_max = height[r]
            else:
                water += r_max - height[r]
            r -= 1
    return water
  `,
  war_sliding_window_max_12: `
def max_sliding_window(nums, k):
    from collections import deque
    dq = deque()
    res = []
    for i, n in enumerate(nums):
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        while dq and nums[dq[-1]] < n:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res
  `,
  war_word_break_13: `
def word_break(s, word_dict):
    words = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]
  `,
  war_longest_increasing_subsequence_14: `
def length_of_lis(nums):
    import bisect
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)
  `,
  war_course_schedule_15: `
def can_finish(num_courses, prerequisites):
    from collections import deque
    in_degree = [0] * num_courses
    adj = [[] for _ in range(num_courses)]
    for course, pre in prerequisites:
        adj[pre].append(course)
        in_degree[course] += 1
    q = deque([i for i in range(num_courses) if in_degree[i] == 0])
    visited = 0
    while q:
        node = q.popleft()
        visited += 1
        for nxt in adj[node]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0:
                q.append(nxt)
    return visited == num_courses
  `,
  war_clone_graph_16: `
def clone_graph_nodes(adj_list):
    return [list(neighbors) for neighbors in adj_list]
  `,
  war_token_bucket_rate_limiter_17: `
def simulate_rate_limiter(capacity, refill_rate_per_sec, requests):
    tokens = float(capacity)
    last_time = requests[0]['timestamp'] if requests else 0
    res = []
    for req in requests:
        t = req['timestamp']
        needed = req['tokensRequested']
        elapsed = max(0, t - last_time)
        tokens = min(float(capacity), tokens + elapsed * refill_rate_per_sec)
        last_time = t
        if tokens >= needed:
            tokens -= needed
            res.append(True)
        else:
            res.append(False)
    return res
  `,
  war_median_data_stream_18: `
def process_median_stream(operations, values):
    import bisect
    nums = []
    res = []
    for op, val in zip(operations, values):
        if op == "addNum":
            bisect.insort(nums, val[0])
        elif op == "findMedian":
            n = len(nums)
            if n % 2 == 1:
                res.append(float(nums[n // 2]))
            else:
                res.append((nums[n // 2 - 1] + nums[n // 2]) / 2.0)
    return res
  `,
  war_word_ladder_19: `
def ladder_length(begin_word, end_word, word_list):
    from collections import deque
    word_set = set(word_list)
    if end_word not in word_set:
        return 0
    q = deque([(begin_word, 1)])
    visited = {begin_word}
    while q:
        word, length = q.popleft()
        if word == end_word:
            return length
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                nxt = word[:i] + c + word[i+1:]
                if nxt in word_set and nxt not in visited:
                    visited.add(nxt)
                    q.append((nxt, length + 1))
    return 0
  `,
  war_edit_distance_20: `
def min_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]
  `,

  // 61-70 Basic
  war_plus_one_21: `
def plus_one(digits: list[int]) -> list[int]:
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    return [1] + digits
  `,
  war_longest_common_prefix_22: `
def longest_common_prefix(strs: list[str]) -> str:
    if not strs:
        return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix
  `,
  war_remove_duplicates_sorted_23: `
def remove_duplicates(nums: list[int]) -> list[int]:
    if not nums:
        return []
    res = [nums[0]]
    for i in range(1, len(nums)):
        if nums[i] != nums[i - 1]:
            res.append(nums[i])
    return res
  `,
  war_valid_perfect_square_24: `
def is_perfect_square(num: int) -> bool:
    if num < 1:
        return False
    left, right = 1, num
    while left <= right:
        mid = (left + right) // 2
        sq = mid * mid
        if sq == num:
            return True
        elif sq < num:
            left = mid + 1
        else:
            right = mid - 1
    return False
  `,
  war_excel_column_number_25: `
def title_to_number(column_title: str) -> int:
    res = 0
    for c in column_title:
        res = res * 26 + (ord(c) - 64)
    return res
  `,
  war_max_average_subarray_26: `
def find_max_average(nums: list[int], k: int) -> float:
    curr = sum(nums[:k])
    max_sum = curr
    for i in range(k, len(nums)):
        curr += nums[i] - nums[i - k]
        if curr > max_sum:
            max_sum = curr
    return max_sum / k
  `,
  war_can_place_flowers_27: `
def can_place_flowers(flowerbed: list[int], n: int) -> bool:
    count = 0
    f = flowerbed[:]
    for i in range(len(f)):
        if f[i] == 0:
            prev = 0 if i == 0 else f[i - 1]
            nxt = 0 if i == len(f) - 1 else f[i + 1]
            if prev == 0 and nxt == 0:
                f[i] = 1
                count += 1
    return count >= n
  `,
  war_isomorphic_strings_28: `
def is_isomorphic(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    map_s, map_t = {}, {}
    for c1, c2 in zip(s, t):
        if (c1 in map_s and map_s[c1] != c2) or (c2 in map_t and map_t[c2] != c1):
            return False
        map_s[c1] = c2
        map_t[c2] = c1
    return True
  `,
  war_find_pivot_index_29: `
def pivot_index(nums: list[int]) -> int:
    total = sum(nums)
    left_sum = 0
    for i, num in enumerate(nums):
        if left_sum == total - left_sum - num:
            return i
        left_sum += num
    return -1
  `,
  war_symmetric_tree_30: `
def is_symmetric(root):
    if not root:
        return True
    class TreeNode:
        def __init__(self, val):
            self.val = val
            self.left = None
            self.right = None
    nodes = [None if v is None else TreeNode(v) for v in root]
    for i in range(len(nodes)):
        if nodes[i]:
            left_i = 2 * i + 1
            right_i = 2 * i + 2
            if left_i < len(nodes):
                nodes[i].left = nodes[left_i]
            if right_i < len(nodes):
                nodes[i].right = nodes[right_i]
    def is_mirror(t1, t2):
        if not t1 and not t2:
            return True
        if not t1 or not t2:
            return False
        return t1.val == t2.val and is_mirror(t1.left, t2.right) and is_mirror(t1.right, t2.left)
    return is_mirror(nodes[0].left if nodes[0] else None, nodes[0].right if nodes[0] else None)
  `,

  // 71-80 Intermediate
  war_insert_interval_24: `
def insert_interval(intervals: list[list[int]], new_interval: list[int]) -> list[list[int]]:
    result = []
    i = 0
    n = len(intervals)
    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1
    result.append(new_interval)
    while i < n:
        result.append(intervals[i])
        i += 1
    return result
  `,
  war_spiral_matrix_25: `
def spiral_order(matrix: list[list[int]]) -> list[int]:
    if not matrix:
        return []
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            res.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            res.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                res.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                res.append(matrix[r][left])
            left += 1
    return res
  `,
  war_search_rotated_array_26: `
def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1
  `,
  war_coin_change_ii_27: `
def change(amount: int, coins: list[int]) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1
    for c in coins:
        for a in range(c, amount + 1):
            dp[a] += dp[a - c]
    return dp[amount]
  `,
  war_validate_ip_address_28: `
def valid_ip_address(query_ip: str) -> str:
    if '.' in query_ip:
        parts = query_ip.split('.')
        if len(parts) != 4:
            return "Neither"
        for p in parts:
            if not p or (len(p) > 1 and p[0] == '0') or not p.isdigit():
                return "Neither"
            if int(p) < 0 or int(p) > 255:
                return "Neither"
        return "IPv4"
    elif ':' in query_ip:
        parts = query_ip.split(':')
        if len(parts) != 8:
            return "Neither"
        for p in parts:
            if not p or len(p) > 4 or not all(c in "0123456789abcdefABCDEF" for c in p):
                return "Neither"
        return "IPv6"
    return "Neither"
  `,
  war_level_order_traversal_29: `
def level_order(root):
    if not root:
        return []
    class TreeNode:
        def __init__(self, val):
            self.val = val
            self.left = None
            self.right = None
    nodes = [None if v is None else TreeNode(v) for v in root]
    for i in range(len(nodes)):
        if nodes[i]:
            l = 2 * i + 1
            r = 2 * i + 2
            if l < len(nodes):
                nodes[i].left = nodes[l]
            if r < len(nodes):
                nodes[i].right = nodes[r]
    if not nodes[0]:
        return []
    res = []
    queue = [nodes[0]]
    while queue:
        level = []
        for _ in range(len(queue)):
            curr = queue.pop(0)
            level.append(curr.val)
            if curr.left:
                queue.append(curr.left)
            if curr.right:
                queue.append(curr.right)
        res.append(level)
    return res
  `,
  war_simplify_path_30: `
def simplify_path(path: str) -> str:
    parts = path.split('/')
    stack = []
    for p in parts:
        if not p or p == '.':
            continue
        if p == '..':
            if stack:
                stack.pop()
        else:
            stack.append(p)
    return '/' + '/'.join(stack)
  `,
  war_partition_labels_31: `
def partition_labels(s: str) -> list[int]:
    last = {c: i for i, c in enumerate(s)}
    res = []
    start = end = 0
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            res.append(end - start + 1)
            start = i + 1
    return res
  `,
  war_continuous_subarray_sum_32: `
def check_subarray_sum(nums: list[int], k: int) -> bool:
    mod_map = {0: -1}
    rem = 0
    for i, num in enumerate(nums):
        rem = (rem + num) % k
        if rem in mod_map:
            if i - mod_map[rem] >= 2:
                return True
        else:
            mod_map[rem] = i
    return False
  `,
  war_binary_tree_right_side_33: `
def right_side_view(root):
    if not root:
        return []
    class TreeNode:
        def __init__(self, val):
            self.val = val
            self.left = None
            self.right = None
    nodes = [None if v is None else TreeNode(v) for v in root]
    for i in range(len(nodes)):
        if nodes[i]:
            l = 2 * i + 1
            r = 2 * i + 2
            if l < len(nodes):
                nodes[i].left = nodes[l]
            if r < len(nodes):
                nodes[i].right = nodes[r]
    if not nodes[0]:
        return []
    res = []
    queue = [nodes[0]]
    while queue:
        size = len(queue)
        for i in range(size):
            curr = queue.pop(0)
            if i == size - 1:
                res.append(curr.val)
            if curr.left:
                queue.append(curr.left)
            if curr.right:
                queue.append(curr.right)
    return res
  `,

  // 81-90 Advanced
  war_merge_k_sorted_lists_21: `
def merge_k_lists(lists):
    res = []
    for sub in lists:
        res.extend(sub)
    res.sort()
    return res
  `,
  war_alien_dictionary_22: `
def alien_order(words: list[str]) -> str:
    from collections import defaultdict, deque
    adj = {c: set() for w in words for c in w}
    in_degree = {c: 0 for w in words for c in w}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        if len(w1) > len(w2) and w1.startswith(w2):
            return ""
        for c1, c2 in zip(w1, w2):
            if c1 != c2:
                if c2 not in adj[c1]:
                    adj[c1].add(c2)
                    in_degree[c2] += 1
                break
    queue = deque([c for c, deg in in_degree.items() if deg == 0])
    res = []
    while queue:
        c = queue.popleft()
        res.append(c)
        for nbr in adj[c]:
            in_degree[nbr] -= 1
            if in_degree[nbr] == 0:
                queue.append(nbr)
    return "".join(res) if len(res) == len(in_degree) else ""
  `,
  war_longest_valid_parentheses_23: `
def longest_valid_parentheses(s: str) -> int:
    stack = [-1]
    max_len = 0
    for i, c in enumerate(s):
        if c == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                max_len = max(max_len, i - stack[-1])
    return max_len
  `,
  war_serialize_deserialize_tree_24: `
def round_trip_tree(root):
    import json
    data = json.dumps(root)
    return json.loads(data)
  `,
  war_largest_rectangle_histogram_25: `
def largest_rectangle_area(heights: list[int]) -> int:
    stack = []
    max_area = 0
    h = heights + [0]
    for i, curr_h in enumerate(h):
        while stack and h[stack[-1]] > curr_h:
            height = h[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    return max_area
  `,
  war_min_window_substring_26: `
def min_window(s: str, t: str) -> str:
    from collections import Counter
    if not s or not t:
        return ""
    t_count = Counter(t)
    required = len(t_count)
    left, right = 0, 0
    formed = 0
    window_counts = {}
    ans = float("inf"), None, None
    while right < len(s):
        c = s[right]
        window_counts[c] = window_counts.get(c, 0) + 1
        if c in t_count and window_counts[c] == t_count[c]:
            formed += 1
        while left <= right and formed == required:
            c_left = s[left]
            if right - left + 1 < ans[0]:
                ans = (right - left + 1, left, right)
            window_counts[c_left] -= 1
            if c_left in t_count and window_counts[c_left] < t_count[c_left]:
                formed -= 1
            left += 1
        right += 1
    return "" if ans[0] == float("inf") else s[ans[1] : ans[2] + 1]
  `,
  war_palindrome_partitioning_ii_27: `
def min_cut(s: str) -> int:
    n = len(s)
    is_pal = [[False] * n for _ in range(n)]
    for r in range(n):
        for l in range(r + 1):
            if s[l] == s[r] and (r - l <= 2 or is_pal[l + 1][r - 1]):
                is_pal[l][r] = True
    cuts = [0] * n
    for i in range(n):
        if is_pal[0][i]:
            cuts[i] = 0
        else:
            cuts[i] = min(cuts[j] + 1 for j in range(i) if is_pal[j + 1][i])
    return cuts[n - 1]
  `,
  war_consistent_hashing_ring_28: `
def route_request(nodes, key):
    if not nodes:
        return 0
    sorted_nodes = sorted(nodes)
    for n in sorted_nodes:
        if n >= key:
            return n
    return sorted_nodes[0]
  `,
  war_basic_calculator_29: `
def calculate(s: str) -> int:
    res = 0
    num = 0
    sign = 1
    stack = []
    for c in s:
        if c.isdigit():
            num = num * 10 + int(c)
        elif c == '+':
            res += sign * num
            num = 0
            sign = 1
        elif c == '-':
            res += sign * num
            num = 0
            sign = -1
        elif c == '(':
            stack.append(res)
            stack.append(sign)
            res = 0
            sign = 1
        elif c == ')':
            res += sign * num
            num = 0
            res *= stack.pop()
            res += stack.pop()
    res += sign * num
    return res
  `,
  war_maximal_square_30: `
def maximal_square(matrix: list[list[str]]) -> int:
    if not matrix or not matrix[0]:
        return 0
    m, n = len(matrix), len(matrix[0])
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    max_side = 0
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if matrix[i - 1][j - 1] == '1':
                dp[i][j] = min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
                if dp[i][j] > max_side:
                    max_side = dp[i][j]
    return max_side * max_side
  `,

  // --- 30 NEW PYTHON REFERENCE SOLUTIONS (91-120) ---
  // war_hamming_weight_31
  war_hamming_weight_31: `
def hamming_weight(n: int) -> int:
    count = 0
    while n:
        n &= (n - 1)
        count += 1
    return count
  `,
  // war_strstr_needle_32
  war_strstr_needle_32: `
def str_str(haystack: str, needle: str) -> int:
    if needle == "": return 0
    return haystack.find(needle)
  `,
  // war_backspace_string_compare_33
  war_backspace_string_compare_33: `
def backspace_compare(s: str, t: str) -> bool:
    def build(st):
        out = []
        for c in st:
            if c == "#":
                if out: out.pop()
            else:
                out.append(c)
        return "".join(out)
    return build(s) == build(t)
  `,
  // war_squares_sorted_array_34
  war_squares_sorted_array_34: `
def sorted_squares(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [0] * n
    l, r, p = 0, n - 1, n - 1
    while l <= r:
        l_sq = nums[l] ** 2
        r_sq = nums[r] ** 2
        if l_sq > r_sq:
            res[p] = l_sq
            l += 1
        else:
            res[p] = r_sq
            r -= 1
        p -= 1
    return res
  `,
  // war_ransom_note_35
  war_ransom_note_35: `
def can_construct(ransom_note: str, magazine: str) -> bool:
    from collections import Counter
    r_c = Counter(ransom_note)
    m_c = Counter(magazine)
    return not (r_c - m_c)
  `,
  // war_maximum_units_truck_36
  war_maximum_units_truck_36: `
def maximum_units(box_types: list[list[int]], truck_size: int) -> int:
    box_types.sort(key=lambda x: x[1], reverse=True)
    total = 0
    for count, units in box_types:
        take = min(count, truck_size)
        total += take * units
        truck_size -= take
        if truck_size <= 0:
            break
    return total
  `,
  // war_monotonic_array_37
  war_monotonic_array_37: `
def is_monotonic(nums: list[int]) -> bool:
    inc = dec = True
    for i in range(len(nums) - 1):
        if nums[i] > nums[i+1]: inc = False
        if nums[i] < nums[i+1]: dec = False
    return inc or dec
  `,
  // war_replace_elements_greatest_right_38
  war_replace_elements_greatest_right_38: `
def replace_elements(arr: list[int]) -> list[int]:
    res = list(arr)
    max_right = -1
    for i in range(len(res) - 1, -1, -1):
        cur = res[i]
        res[i] = max_right
        if cur > max_right:
            max_right = cur
    return res
  `,
  // war_kth_missing_positive_39
  war_kth_missing_positive_39: `
def find_kth_positive(arr: list[int], k: int) -> int:
    l, r = 0, len(arr)
    while l < r:
        mid = (l + r) // 2
        if arr[mid] - (mid + 1) < k:
            l = mid + 1
        else:
            r = mid
    return l + k
  `,
  // war_peak_index_mountain_40
  war_peak_index_mountain_40: `
def peak_index_in_mountain_array(arr: list[int]) -> int:
    l, r = 0, len(arr) - 1
    while l < r:
        mid = (l + r) // 2
        if arr[mid] < arr[mid + 1]:
            l = mid + 1
        else:
            r = mid
    return l
  `,
  // war_gas_station_34
  war_gas_station_34: `
def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    if sum(gas) < sum(cost):
        return -1
    start = tank = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start
  `,
  // war_koko_eating_bananas_35
  war_koko_eating_bananas_35: `
def min_eating_speed(piles: list[int], h: int) -> int:
    import math
    l, r = 1, max(piles)
    while l < r:
        mid = (l + r) // 2
        hours = sum(math.ceil(p / mid) for p in piles)
        if hours <= h:
            r = mid
        else:
            l = mid + 1
    return l
  `,
  // war_longest_palindromic_substring_36
  war_longest_palindromic_substring_36: `
def longest_palindrome(s: str) -> str:
    if len(s) < 2: return s
    start = 0
    max_len = 0
    def expand(l, r):
        nonlocal start, max_len
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        length = r - l - 1
        if length > max_len:
            max_len = length
            start = l + 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return s[start:start + max_len]
  `,
  // war_house_robber_ii_37
  war_house_robber_ii_37: `
def rob(nums: list[int]) -> int:
    if len(nums) == 1: return nums[0]
    def rob_linear(sub):
        p1, p2 = 0, 0
        for x in sub:
            p1, p2 = max(p1, p2 + x), p1
        return p1
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
  `,
  // war_next_greater_element_ii_38
  war_next_greater_element_ii_38: `
def next_greater_elements(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [-1] * n
    stack = []
    for i in range(2 * n):
        num = nums[i % n]
        while stack and nums[stack[-1]] < num:
            res[stack.pop()] = num
        if i < n:
            stack.append(i)
    return res
  `,
  // war_rotting_oranges_39
  war_rotting_oranges_39: `
def oranges_rotting(grid: list[list[int]]) -> int:
    from collections import deque
    m, n = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 2: q.append((r, c))
            elif grid[r][c] == 1: fresh += 1
    if fresh == 0: return 0
    minutes = 0
    dirs = [(1,0), (-1,0), (0,1), (0,-1)]
    while q and fresh > 0:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
        minutes += 1
    return minutes if fresh == 0 else -1
  `,
  // war_find_all_anagrams_40
  war_find_all_anagrams_40: `
def find_anagrams(s: str, p: str) -> list[int]:
    if len(s) < len(p): return []
    p_c, s_c = [0]*26, [0]*26
    for i in range(len(p)):
        p_c[ord(p[i]) - 97] += 1
        s_c[ord(s[i]) - 97] += 1
    res = []
    if p_c == s_c: res.append(0)
    for i in range(len(p), len(s)):
        s_c[ord(s[i]) - 97] += 1
        s_c[ord(s[i - len(p)]) - 97] -= 1
        if p_c == s_c: res.append(i - len(p) + 1)
    return res
  `,
  // war_word_search_41
  war_word_search_41: `
def exist(board: list[list[str]], word: str) -> bool:
    m, n = len(board), len(board[0])
    def dfs(r, c, idx):
        if idx == len(word): return True
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != word[idx]: return False
        temp = board[r][c]
        board[r][c] = "#"
        found = dfs(r+1, c, idx+1) or dfs(r-1, c, idx+1) or dfs(r, c+1, idx+1) or dfs(r, c-1, idx+1)
        board[r][c] = temp
        return found
    for r in range(m):
        for c in range(n):
            if dfs(r, c, 0): return True
    return False
  `,
  // war_car_fleet_42
  war_car_fleet_42: `
def car_fleet(target: int, position: list[int], speed: list[int]) -> int:
    cars = sorted(zip(position, speed), key=lambda x: x[0], reverse=True)
    fleets = 0
    prev_time = 0
    for p, s in cars:
        time = (target - p) / s
        if time > prev_time:
            fleets += 1
            prev_time = time
    return fleets
  `,
  // war_reorganize_string_43
  war_reorganize_string_43: `
def reorganize_string(s: str) -> str:
    from collections import Counter
    counts = Counter(s)
    max_c = max(counts.values())
    if max_c > (len(s) + 1) // 2: return ""
    chars = sorted(counts.keys(), key=lambda c: counts[c], reverse=True)
    res = [""] * len(s)
    idx = 0
    for c in chars:
        for _ in range(counts[c]):
            if idx >= len(s): idx = 1
            res[idx] = c
            idx += 2
    return "".join(res)
  `,
  // war_lfu_cache_31
  war_lfu_cache_31: `
def simulate_lfu(capacity: int, operations: list[list[str]]) -> list:
    from collections import defaultdict, OrderedDict
    key_val = {}
    key_freq = {}
    freq_keys = defaultdict(OrderedDict)
    min_freq = 0
    results = []
    for op in operations:
        t = op[0]
        if t == "get":
            k = op[1]
            if k not in key_val:
                results.append(-1)
            else:
                v = key_val[k]
                f = key_freq[k]
                del freq_keys[f][k]
                if not freq_keys[f] and min_freq == f:
                    min_freq += 1
                key_freq[k] = f + 1
                freq_keys[f + 1][k] = True
                results.append(v)
        elif t == "put":
            k = op[1]
            v = int(op[2])
            if capacity <= 0:
                results.append(None)
                continue
            if k in key_val:
                key_val[k] = v
                f = key_freq[k]
                del freq_keys[f][k]
                if not freq_keys[f] and min_freq == f:
                    min_freq += 1
                key_freq[k] = f + 1
                freq_keys[f + 1][k] = True
            else:
                if len(key_val) >= capacity:
                    evict_k, _ = freq_keys[min_freq].popitem(last=False)
                    del key_val[evict_k]
                    del key_freq[evict_k]
                key_val[k] = v
                key_freq[k] = 1
                min_freq = 1
                freq_keys[1][k] = True
            results.append(None)
    return results
  `,
  // war_wildcard_matching_32
  war_wildcard_matching_32: `
def is_match(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(1, n + 1):
        if p[j - 1] == "*":
            dp[0][j] = dp[0][j - 1]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == "*":
                dp[i][j] = dp[i - 1][j] or dp[i][j - 1]
            elif p[j - 1] == "?" or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]
    return dp[m][n]
  `,
  // war_burst_balloons_33
  war_burst_balloons_33: `
def max_coins(nums: list[int]) -> int:
    arr = [1] + nums + [1]
    n = len(arr)
    dp = [[0] * n for _ in range(n)]
    length_n = len(nums)
    for length in range(1, length_n + 1):
        for i in range(1, length_n - length + 2):
            j = i + length - 1
            for k in range(i, j + 1):
                coins = dp[i][k - 1] + arr[i - 1] * arr[k] * arr[j + 1] + dp[k + 1][j]
                if coins > dp[i][j]: dp[i][j] = coins
    return dp[1][length_n] if length_n > 0 else 0
  `,
  // war_n_queens_34
  war_n_queens_34: `
def total_n_queens(n: int) -> int:
    count = 0
    def solve(row, cols, diag1, diag2):
        nonlocal count
        if row == n:
            count += 1
            return
        available = ((1 << n) - 1) & ~(cols | diag1 | diag2)
        while available:
            bit = available & -available
            available ^= bit
            solve(row + 1, cols | bit, (diag1 | bit) << 1, (diag2 | bit) >> 1)
    solve(0, 0, 0, 0)
    return count
  `,
  // war_regular_expression_matching_35
  war_regular_expression_matching_35: `
def is_regex_match(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(2, n + 1, 2):
        if p[j - 1] == "*": dp[0][j] = dp[0][j - 2]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == "*":
                no_match = dp[i][j - 2]
                match_prev = (p[j - 2] == "." or p[j - 2] == s[i - 1]) and dp[i - 1][j]
                dp[i][j] = no_match or match_prev
            else:
                dp[i][j] = (p[j - 1] == "." or p[j - 1] == s[i - 1]) and dp[i - 1][j - 1]
    return dp[m][n]
  `,
  // war_maximal_rectangle_36
  war_maximal_rectangle_36: `
def maximal_rectangle(matrix: list[list[str]]) -> int:
    if not matrix or not matrix[0]: return 0
    cols = len(matrix[0])
    heights = [0] * cols
    max_area = 0
    for row in matrix:
        for c in range(cols):
            heights[c] = heights[c] + 1 if row[c] == "1" else 0
        stack = []
        h = heights + [0]
        for i in range(len(h)):
            while stack and h[stack[-1]] >= h[i]:
                height = h[stack.pop()]
                width = i if not stack else i - stack[-1] - 1
                max_area = max(max_area, height * width)
            stack.append(i)
    return max_area
  `,
  // war_network_delay_dijkstra_37
  war_network_delay_dijkstra_37: `
def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    import heapq
    from collections import defaultdict
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))
    pq = [(0, k)]
    dist = {}
    while pq:
        d, u = heapq.heappop(pq)
        if u in dist: continue
        dist[u] = d
        for v, w in graph[u]:
            if v not in dist:
                heapq.heappush(pq, (d + w, v))
    return max(dist.values()) if len(dist) == n else -1
  `,
  // war_shortest_palindrome_38
  war_shortest_palindrome_38: `
def shortest_palindrome(s: str) -> str:
    rev = s[::-1]
    combined = s + "#" + rev
    pi = [0] * len(combined)
    for i in range(1, len(combined)):
        j = pi[i - 1]
        while j > 0 and combined[i] != combined[j]:
            j = pi[j - 1]
        if combined[i] == combined[j]:
            j += 1
        pi[i] = j
    match_len = pi[-1]
    return rev[:len(s) - match_len] + s
  `,
  // war_swim_in_rising_water_39
  war_swim_in_rising_water_39: `
def swim_in_water(grid: list[list[int]]) -> int:
    from collections import deque
    n = len(grid)
    l, r = grid[0][0], n * n - 1
    def can_reach(t):
        if grid[0][0] > t: return False
        visited = [[False] * n for _ in range(n)]
        q = deque([(0, 0)])
        visited[0][0] = True
        dirs = [(1,0), (-1,0), (0,1), (0,-1)]
        while q:
            cr, cc = q.popleft()
            if cr == n - 1 and cc == n - 1: return True
            for dr, dc in dirs:
                nr, nc = cr + dr, cc + dc
                if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc] and grid[nr][nc] <= t:
                    visited[nr][nc] = True
                    q.append((nr, nc))
        return False
    while l < r:
        mid = (l + r) // 2
        if can_reach(mid): r = mid
        else: l = mid + 1
    return l
  `,
  // war_binary_tree_max_path_sum_40
  war_binary_tree_max_path_sum_40: `
def max_path_sum(root_arr: list) -> int:
    if not root_arr or root_arr[0] is None: return 0
    class TreeNode:
        def __init__(self, val=0, left=None, right=None):
            self.val = val
            self.left = left
            self.right = right
    root = TreeNode(root_arr[0])
    q = [root]
    i = 1
    while i < len(root_arr) and q:
        curr = q.pop(0)
        if i < len(root_arr) and root_arr[i] is not None:
            curr.left = TreeNode(root_arr[i])
            q.append(curr.left)
        i += 1
        if i < len(root_arr) and root_arr[i] is not None:
            curr.right = TreeNode(root_arr[i])
            q.append(curr.right)
        i += 1
    global_max = float("-inf")
    def post_order(node):
        nonlocal global_max
        if not node: return 0
        left_gain = max(0, post_order(node.left))
        right_gain = max(0, post_order(node.right))
        price_new_path = node.val + left_gain + right_gain
        if price_new_path > global_max: global_max = price_new_path
        return node.val + max(left_gain, right_gain)
    post_order(root)
    return global_max
  `,
};

describe('Arena All 120 Questions Deep Audit & Adversarial Verification', () => {
  it('Catalog contains exactly 90 calibrated problems across all 3 tiers (30 Basic, 30 Intermediate, 30 Advanced)', () => {
    assert.strictEqual(CODE_WARS_PROBLEMS_CATALOG.length, 120, 'Catalog must contain 120 problems');
    const basic = CODE_WARS_PROBLEMS_CATALOG.filter(p => p.difficulty === 'basic');
    const intermediate = CODE_WARS_PROBLEMS_CATALOG.filter(p => p.difficulty === 'intermediate');
    const advanced = CODE_WARS_PROBLEMS_CATALOG.filter(p => p.difficulty === 'advanced');
    assert.strictEqual(basic.length, 40, 'Must have 40 basic problems');
    assert.strictEqual(intermediate.length, 40, 'Must have 40 intermediate problems');
    assert.strictEqual(advanced.length, 40, 'Must have 40 advanced problems');
  });

  for (let idx = 0; idx < CODE_WARS_PROBLEMS_CATALOG.length; idx++) {
    const prob = CODE_WARS_PROBLEMS_CATALOG[idx];
    const pid = prob.id;

    it(`[#${idx + 1}/120] [${prob.difficulty.toUpperCase()}] ${prob.title} (${pid})`, async () => {
      // 1. Pedagogical and Schema Invariants
      assert.ok(prob.title && prob.title.length > 3, `${pid} must have descriptive title`);
      assert.ok(prob.description && prob.description.length > 50, `${pid} must have rich context description`);
      assert.ok(prob.hint && prob.hint.length > 40, `${pid} must have slow-reader strategy hint`);
      assert.ok(prob.complexityTarget && prob.complexityTarget.length > 5, `${pid} must define complexity target`);
      assert.ok(prob.testCases && prob.testCases.length >= 2, `${pid} must have >= 2 sample test cases`);
      assert.ok(prob.starterCode.typescript, `${pid} must have TS starter code`);
      assert.ok(prob.starterCode.python, `${pid} must have Python starter code`);

      // 2. Registry Registration
      const reg = (CODEWARS_PROBLEM_REGISTRY as any)[pid];
      assert.ok(reg, `Problem ${pid} must be registered in CODEWARS_PROBLEM_REGISTRY`);
      assert.ok(reg.functionName, `Problem ${pid} must define functionName`);
      assert.ok(reg.pythonFunctionName, `Problem ${pid} must define pythonFunctionName`);
      assert.ok(reg.totalTests >= 2, `Problem ${pid} must have totalTests >= 2`);

      // 3. TypeScript Reference Solution Evaluation
      const tsCode = TS_SOLUTIONS[pid];
      assert.ok(tsCode, `TS solution must exist for ${pid}`);
      const tsRes = await judgeCodeWarsSubmission(pid, tsCode, 'typescript');
      assert.strictEqual(tsRes.ok, true, `TS evaluation ok for ${pid}: ${tsRes.error}`);
      if (tsRes.ok) {
        assert.strictEqual(tsRes.passed, true, `TS solution must pass 100% tests for ${pid}: ${tsRes.error}`);
        assert.strictEqual(tsRes.testsPassed, tsRes.totalTests, `TS all tests passed for ${pid}`);
      }

      // 4. Python Reference Solution Evaluation
      const pyCode = PY_SOLUTIONS[pid];
      assert.ok(pyCode, `Python solution must exist for ${pid}`);
      const pyRes = await judgeCodeWarsSubmission(pid, pyCode, 'python');
      assert.strictEqual(pyRes.ok, true, `Python evaluation ok for ${pid}: ${pyRes.error}`);
      if (pyRes.ok) {
        assert.strictEqual(pyRes.passed, true, `Python solution must pass 100% tests for ${pid}: ${pyRes.error}`);
        assert.strictEqual(pyRes.testsPassed, pyRes.totalTests, `Python all tests passed for ${pid}`);
      }

      // 5. Adversarial Rejection (Zero false passes)
      const badTsCode = `function ${reg.functionName}(...args: any[]) { return -999999; }`;
      const badTsRes = await judgeCodeWarsSubmission(pid, badTsCode, 'typescript');
      assert.strictEqual(badTsRes.ok, true);
      if (badTsRes.ok) {
        assert.strictEqual(badTsRes.passed, false, `Wrong TS code must be rejected for ${pid}`);
      }

      const badPyCode = `def ${reg.pythonFunctionName}(*args): return -999999`;
      const badPyRes = await judgeCodeWarsSubmission(pid, badPyCode, 'python');
      assert.strictEqual(badPyRes.ok, true);
      if (badPyRes.ok) {
        assert.strictEqual(badPyRes.passed, false, `Wrong Python code must be rejected for ${pid}`);
      }
    });
  }
});
