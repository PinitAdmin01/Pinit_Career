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
};

// 60 REFERENCE SOLUTIONS IN PYTHON
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
};

describe('Arena All 60 Questions Deep Audit & Adversarial Verification', () => {
  it('Catalog contains exactly 60 calibrated problems across all 3 tiers', () => {
    assert.strictEqual(CODE_WARS_PROBLEMS_CATALOG.length, 60, 'Catalog must contain 60 problems');
    const basic = CODE_WARS_PROBLEMS_CATALOG.filter(p => p.difficulty === 'basic');
    const intermediate = CODE_WARS_PROBLEMS_CATALOG.filter(p => p.difficulty === 'intermediate');
    const advanced = CODE_WARS_PROBLEMS_CATALOG.filter(p => p.difficulty === 'advanced');
    assert.strictEqual(basic.length, 20, 'Must have 20 basic problems');
    assert.strictEqual(intermediate.length, 20, 'Must have 20 intermediate problems');
    assert.strictEqual(advanced.length, 20, 'Must have 20 advanced problems');
  });

  for (let idx = 0; idx < CODE_WARS_PROBLEMS_CATALOG.length; idx++) {
    const prob = CODE_WARS_PROBLEMS_CATALOG[idx];
    const pid = prob.id;

    it(`[#${idx + 1}/60] [${prob.difficulty.toUpperCase()}] ${prob.title} (${pid})`, async () => {
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
        assert.strictEqual(tsRes.passed, true, `TS solution must pass 100% tests for ${pid}`);
        assert.strictEqual(tsRes.testsPassed, tsRes.totalTests, `TS all tests passed for ${pid}`);
      }

      // 4. Python Reference Solution Evaluation
      const pyCode = PY_SOLUTIONS[pid];
      assert.ok(pyCode, `Python solution must exist for ${pid}`);
      const pyRes = await judgeCodeWarsSubmission(pid, pyCode, 'python');
      assert.strictEqual(pyRes.ok, true, `Python evaluation ok for ${pid}: ${pyRes.error}`);
      if (pyRes.ok) {
        assert.strictEqual(pyRes.passed, true, `Python solution must pass 100% tests for ${pid}`);
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
