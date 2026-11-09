import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';
import { CODEWARS_PROBLEM_REGISTRY } from '../src/lib/server/codeWarsSandbox';
import { judgeCodeWarsSubmission } from '../src/lib/server/codeWarsJudge';

// 30 REFERENCE SOLUTIONS IN TYPESCRIPT
const TS_SOLUTIONS: Record<string, string> = {
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
      for (const c of s) {
        if (c === '(' || c === '{' || c === '[') stack.push(c);
        else if (map[c]) {
          if (stack.pop() !== map[c]) return false;
        }
      }
      return stack.length === 0;
    }
  `,

  war_max_subarray_05: `
    function maxSubArray(nums: number[]): number {
      let cur = nums[0], maxSoFar = nums[0];
      for (let i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        maxSoFar = Math.max(maxSoFar, cur);
      }
      return maxSoFar;
    }
  `,

  war_best_stock_06: `
    function maxProfit(prices: number[]): number {
      let minPrice = Infinity, maxProfit = 0;
      for (const p of prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
      }
      return maxProfit;
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
      let insertPos = 0;
      for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
          nums[insertPos++] = nums[i];
        }
      }
      while (insertPos < nums.length) {
        nums[insertPos++] = 0;
      }
      return nums;
    }
  `,

  war_single_number_07: `
    function singleNumber(nums: number[]): number {
      let res = 0;
      for (const n of nums) res ^= n;
      return res;
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
      let i = 0, j = 0;
      const res: number[] = [];
      while (i < nums1.length && j < nums2.length) {
        if (nums1[i] <= nums2[j]) res.push(nums1[i++]);
        else res.push(nums2[j++]);
      }
      while (i < nums1.length) res.push(nums1[i++]);
      while (j < nums2.length) res.push(nums2[j++]);
      return res;
    }
  `,

  war_roman_to_int_10: `
    function romanToInt(s: string): number {
      const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let total = 0;
      for (let i = 0; i < s.length; i++) {
        const cur = map[s[i]] || 0;
        const next = map[s[i + 1]] || 0;
        if (cur < next) total -= cur;
        else total += cur;
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
    function reverseList(head: number[]): number[] {
      return head.slice().reverse();
    }
  `,

  war_longest_substring_09: `
    function lengthOfLongestSubstring(s: string): number {
      let maxLen = 0, start = 0;
      const seen = new Map<string, number>();
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (seen.has(c) && seen.get(c)! >= start) {
          start = seen.get(c)! + 1;
        }
        seen.set(c, i);
        maxLen = Math.max(maxLen, i - start + 1);
      }
      return maxLen;
    }
  `,

  war_container_water_10: `
    function maxArea(height: number[]): number {
      let left = 0, right = height.length - 1, max = 0;
      while (left < right) {
        const h = Math.min(height[left], height[right]);
        max = Math.max(max, h * (right - left));
        if (height[left] < height[right]) left++;
        else right--;
      }
      return max;
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
      function Node(val: number) { this.val = val; this.left = null; this.right = null; }
      var nodes = root.map(function(v) { return v !== null && v !== undefined ? new Node(v) : null; });
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
      if (!root || !root.length || root[0] === null) return 0;
      function getDepth(idx: number): number {
        if (idx >= root.length || root[idx] === null || root[idx] === undefined) return 0;
        return 1 + Math.max(getDepth(2 * idx + 1), getDepth(2 * idx + 2));
      }
      return getDepth(0);
    }
  `,

  war_validate_bst_06: `
    function isValidBST(root: (number | null)[]): boolean {
      if (!root || !root.length || root[0] === null) return true;
      function validate(idx: number, min: number, max: number): boolean {
        if (idx >= root.length || root[idx] === null || root[idx] === undefined) return true;
        const val = root[idx] as number;
        if (val <= min || val >= max) return false;
        return validate(2 * idx + 1, min, val) && validate(2 * idx + 2, val, max);
      }
      return validate(0, -Infinity, Infinity);
    }
  `,

  war_coin_change_07: `
    function coinChange(coins: number[], amount: number): number {
      const dp = new Array(amount + 1).fill(amount + 1);
      dp[0] = 0;
      for (let i = 1; i <= amount; i++) {
        for (const c of coins) {
          if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
        }
      }
      return dp[amount] > amount ? -1 : dp[amount];
    }
  `,

  war_house_robber_08: `
    function rob(nums: number[]): number {
      if (!nums || nums.length === 0) return 0;
      if (nums.length === 1) return nums[0];
      let prev2 = 0, prev1 = 0;
      for (const n of nums) {
        const temp = Math.max(prev1, prev2 + n);
        prev2 = prev1;
        prev1 = temp;
      }
      return prev1;
    }
  `,

  war_kth_largest_09: `
    function findKthLargest(nums: number[], k: number): number {
      nums.sort((a, b) => b - a);
      return nums[k - 1];
    }
  `,

  war_number_of_islands_10: `
    function numIslands(grid: string[][]): number {
      if (!grid || grid.length === 0) return 0;
      const rows = grid.length, cols = grid[0].length;
      let count = 0;
      function dfs(r: number, c: number) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
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
  `
};

// 30 REFERENCE SOLUTIONS IN PYTHON
const PY_SOLUTIONS: Record<string, string> = {
  war_two_sum_01: `
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []
`,

  war_valid_palindrome_02: `
import re
def is_palindrome(s):
    cleaned = re.sub(r'[^a-zA-Z0-9]', '', s).lower()
    return cleaned == cleaned[::-1]
`,

  war_reverse_string_03: `
def reverse_words(s):
    return " ".join(s.strip().split()[::-1])
`,

  war_valid_parentheses_04: `
def is_valid_parentheses(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in '({[':
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return len(stack) == 0
`,

  war_max_subarray_05: `
def max_sub_array(nums):
    cur = max_so_far = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        max_so_far = max(max_so_far, cur)
    return max_so_far
`,

  war_best_stock_06: `
def max_profit(prices):
    min_p = float('inf')
    max_p = 0
    for p in prices:
        if p < min_p:
            min_p = p
        elif p - min_p > max_p:
            max_p = p - min_p
    return max_p
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
    pos = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[pos] = nums[i]
            pos += 1
    while pos < len(nums):
        nums[pos] = 0
        pos += 1
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
    return (n * (n + 1)) // 2 - sum(nums)
`,

  war_merge_sorted_arrays_09: `
def merge_sorted_arrays(nums1, nums2):
    i, j = 0, 0
    res = []
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
    vals = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    total = 0
    for i in range(len(s)):
        cur = vals.get(s[i], 0)
        nxt = vals.get(s[i+1], 0) if i + 1 < len(s) else 0
        if cur < nxt:
            total -= cur
        else:
            total += cur
    return total
`,

  war_binary_search_07: `
def search(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return -1
`,

  war_reverse_linked_list_08: `
def reverse_list(head):
    return list(reversed(head))
`,

  war_longest_substring_09: `
def length_of_longest_substring(s):
    seen = {}
    max_len = 0
    start = 0
    for i, c in enumerate(s):
        if c in seen and seen[c] >= start:
            start = seen[c] + 1
        seen[c] = i
        max_len = max(max_len, i - start + 1)
    return max_len
`,

  war_container_water_10: `
def max_area(height):
    l, r = 0, len(height) - 1
    max_a = 0
    while l < r:
        h = min(height[l], height[r])
        max_a = max(max_a, h * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_a
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
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s == 0:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]:
                    l += 1
                while l < r and nums[r] == nums[r - 1]:
                    r -= 1
                l += 1
                r -= 1
            elif s < 0:
                l += 1
            else:
                r -= 1
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
        def __init__(self, val):
            self.val = val
            self.left = None
            self.right = None
    nodes = [Node(v) if v is not None else None for v in root]
    for i in range(len(root)):
        if nodes[i]:
            left_i = 2 * i + 1
            right_i = 2 * i + 2
            if left_i < len(root):
                nodes[i].left = nodes[left_i]
            if right_i < len(root):
                nodes[i].right = nodes[right_i]
    def invert(node):
        if not node:
            return None
        node.left, node.right = invert(node.right), invert(node.left)
        return node
    invert(nodes[0])
    queue = [nodes[0]]
    res = []
    while queue:
        curr = queue.pop(0)
        if curr:
            res.append(curr.val)
            if curr.left or curr.right or any(q is not None for q in queue):
                queue.append(curr.left)
                queue.append(curr.right)
    return res
`,

  war_max_depth_tree_05: `
def max_depth(root):
    if not root or root[0] is None:
        return 0
    def get_depth(idx):
        if idx >= len(root) or root[idx] is None:
            return 0
        return 1 + max(get_depth(2 * idx + 1), get_depth(2 * idx + 2))
    return get_depth(0)
`,

  war_validate_bst_06: `
def is_valid_bst(root):
    if not root or root[0] is None:
        return True
    def validate(idx, low, high):
        if idx >= len(root) or root[idx] is None:
            return True
        val = root[idx]
        if val <= low or val >= high:
            return False
        return validate(2 * idx + 1, low, val) and validate(2 * idx + 2, val, high)
    return validate(0, float('-inf'), float('inf'))
`,

  war_coin_change_07: `
def coin_change(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if c <= i:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return -1 if dp[amount] > amount else dp[amount]
`,

  war_house_robber_08: `
def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    prev2, prev1 = 0, 0
    for n in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + n)
    return prev1
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
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)
    return count
`
};

describe('Exhaustive 30-Question Polyglot & Adversarial Test Suite', () => {

  it('Verifies that exactly 30 enterprise problems exist in Catalog and Sandbox Registry', () => {
    assert.strictEqual(CODE_WARS_PROBLEMS_CATALOG.length, 30);
    assert.strictEqual(Object.keys(CODEWARS_PROBLEM_REGISTRY).length, 30);
  });

  for (let idx = 0; idx < CODE_WARS_PROBLEMS_CATALOG.length; idx++) {
    const prob = CODE_WARS_PROBLEMS_CATALOG[idx];
    const pid = prob.id;
    const reg = CODEWARS_PROBLEM_REGISTRY[pid];

    it(`Problem #${idx + 1} [${prob.difficulty.toUpperCase()}] ${pid}: "${prob.title}" passes 100% TS, 100% Py, and rejects adversarial bad code`, async () => {
      // 1. Pedagogical Invariants
      assert.ok(prob.title && prob.title.length >= 5, `${pid}: Title must be valid`);
      assert.ok(prob.description && prob.description.length >= 30, `${pid}: Description must be thorough`);
      assert.ok(prob.hint && prob.hint.length >= 20, `${pid}: Slow-reader strategy hint must be populated`);
      assert.ok(prob.complexityTarget && prob.complexityTarget.includes('O('), `${pid}: Complexity target must contain O(...)`);
      assert.ok(prob.starterCode?.typescript, `${pid}: Must have TS starter code`);
      assert.ok(prob.starterCode?.python, `${pid}: Must have Python starter code`);
      assert.ok(prob.testCases && prob.testCases.length >= 2, `${pid}: Must have at least 2 test cases`);
      assert.ok(reg, `${pid}: Must be registered in codeWarsSandbox`);

      // 2. TypeScript Reference Solution Evaluation
      const tsCode = TS_SOLUTIONS[pid];
      assert.ok(tsCode, `TS solution must exist for ${pid}`);
      const tsRes = await judgeCodeWarsSubmission(pid, tsCode, 'typescript');
      assert.strictEqual(tsRes.ok, true, `TS evaluation ok for ${pid}`);
      if (tsRes.ok) {
        assert.strictEqual(tsRes.passed, true, `TS solution must pass 100% tests for ${pid}`);
        assert.strictEqual(tsRes.testsPassed, tsRes.totalTests, `TS all tests passed for ${pid}`);
      }

      // 3. Python Reference Solution Evaluation
      const pyCode = PY_SOLUTIONS[pid];
      assert.ok(pyCode, `Python solution must exist for ${pid}`);
      const pyRes = await judgeCodeWarsSubmission(pid, pyCode, 'python');
      assert.strictEqual(pyRes.ok, true, `Python evaluation ok for ${pid}`);
      if (pyRes.ok) {
        assert.strictEqual(pyRes.passed, true, `Python solution must pass 100% tests for ${pid}`);
        assert.strictEqual(pyRes.testsPassed, pyRes.totalTests, `Python all tests passed for ${pid}`);
      }

      // 4. Adversarial Rejection (Zero false passes)
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
