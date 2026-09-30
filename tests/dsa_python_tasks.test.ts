import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { DSA_PYTHON_30_DAYS_CONFIGS } from '../src/lib/data/dsaPython30DayData';
import { findForbiddenPython } from '../src/lib/code/python/pythonGuard';

const code = (...l: string[]) => l.join('\n');
const LIST_NODE = code('class ListNode:', '    def __init__(self, val=0, next=None):', '        self.val = val', '        self.next = next');
const TREE_NODE = code('class TreeNode:', '    def __init__(self, val=0, left=None, right=None):', '        self.val = val', '        self.left = left', '        self.right = right');
const TRIE = code('class TrieNode:', '    def __init__(self):', '        self.children = {}', '        self.is_end = False', '', '', 'class Trie:', '    def __init__(self):', '        self.root = TrieNode()', '', '    def insert(self, word):', '        node = self.root', '        for ch in word:', '            node = node.children.setdefault(ch, TrieNode())', '        node.is_end = True');

/** A correct answer for every practice task: [Practice 1, Practice 2] per day. */
const SOLUTIONS: [string, string][] = [
  [
    code('def analyze_complexity_tier(step_count):', '    ratio = step_count(2000) / step_count(1000)', "    if ratio < 1.5:", "        return 'O(1)'", '    if ratio < 3:', "        return 'O(N)'", "    return 'O(N^2)'"),
    code('def get_dominant_term(terms):', "    order = ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)']", '    return max(terms, key=order.index)'),
  ],
  [
    code('class DynamicArray:', '    def __init__(self, capacity=2):', '        self._capacity = capacity', '        self._size = 0', '        self._data = [None] * capacity', '', '    def push(self, value):', '        if self._size == self._capacity:', '            self._capacity *= 2', '            bigger = [None] * self._capacity', '            for i in range(self._size):', '                bigger[i] = self._data[i]', '            self._data = bigger', '        self._data[self._size] = value', '        self._size += 1', '', '    def get(self, index):', '        return self._data[index]', '', '    def size(self):', '        return self._size', '', '    def capacity(self):', '        return self._capacity'),
    code('def remove_element(nums, val):', '    k = 0', '    for x in nums:', '        if x != val:', '            nums[k] = x', '            k += 1', '    return k'),
  ],
  [
    code(LIST_NODE, '', '', 'def reverse_list(head):', '    prev = None', '    curr = head', '    while curr:', '        nxt = curr.next', '        curr.next = prev', '        prev = curr', '        curr = nxt', '    return prev'),
    code(LIST_NODE, '', '', 'def has_cycle(head):', '    slow = fast = head', '    while fast and fast.next:', '        slow = slow.next', '        fast = fast.next.next', '        if slow is fast:', '            return True', '    return False'),
  ],
  [
    code('def is_valid_parentheses(s):', "    pairs = {')': '(', ']': '[', '}': '{'}", '    stack = []', '    for ch in s:', "        if ch in '([{':", '            stack.append(ch)', '        elif not stack or stack.pop() != pairs[ch]:', '            return False', '    return not stack'),
    code('def next_greater_elements(nums):', '    result = [-1] * len(nums)', '    stack = []', '    for i, x in enumerate(nums):', '        while stack and nums[stack[-1]] < x:', '            result[stack.pop()] = x', '        stack.append(i)', '    return result'),
  ],
  [
    code('from collections import OrderedDict', '', '', 'class LRUCache:', '    def __init__(self, capacity):', '        self.capacity = capacity', '        self.items = OrderedDict()', '', '    def get(self, key):', '        if key not in self.items:', '            return -1', '        self.items.move_to_end(key)', '        return self.items[key]', '', '    def put(self, key, value):', '        self.items[key] = value', '        self.items.move_to_end(key)', '        if len(self.items) > self.capacity:', '            self.items.popitem(last=False)'),
    code('def run_lru_operations(capacity, ops):', '    cache = {}', '    results = []', '    for op in ops:', "        if op[0] == 'put':", '            _, key, value = op', '            cache.pop(key, None)', '            cache[key] = value', '            if len(cache) > capacity:', '                del cache[next(iter(cache))]', '        else:', '            key = op[1]', '            if key in cache:', '                value = cache.pop(key)', '                cache[key] = value', '                results.append(value)', '            else:', '                results.append(-1)', '    return results'),
  ],
  [
    code('class CircularQueue:', '    def __init__(self, k):', '        self.data = [None] * k', '        self.k = k', '        self.head = 0', '        self.count = 0', '', '    def en_queue(self, value):', '        if self.is_full():', '            return False', '        self.data[(self.head + self.count) % self.k] = value', '        self.count += 1', '        return True', '', '    def de_queue(self):', '        if self.is_empty():', '            return False', '        self.head = (self.head + 1) % self.k', '        self.count -= 1', '        return True', '', '    def front(self):', '        return -1 if self.is_empty() else self.data[self.head]', '', '    def rear(self):', '        return -1 if self.is_empty() else self.data[(self.head + self.count - 1) % self.k]', '', '    def is_empty(self):', '        return self.count == 0', '', '    def is_full(self):', '        return self.count == self.k'),
    code('from collections import deque', '', '', 'class MyStack:', '    def __init__(self):', '        self.q = deque()', '', '    def push(self, x):', '        self.q.append(x)', '        for _ in range(len(self.q) - 1):', '            self.q.append(self.q.popleft())', '', '    def pop(self):', '        return self.q.popleft()', '', '    def top(self):', '        return self.q[0]', '', '    def empty(self):', '        return len(self.q) == 0'),
  ],
  [
    code('class MyHashMap:', '    def __init__(self):', '        self.size = 101', '        self.buckets = [[] for _ in range(self.size)]', '', '    def put(self, key, value):', '        bucket = self.buckets[key % self.size]', '        for pair in bucket:', '            if pair[0] == key:', '                pair[1] = value', '                return', '        bucket.append([key, value])', '', '    def get(self, key):', '        for k, v in self.buckets[key % self.size]:', '            if k == key:', '                return v', '        return -1', '', '    def remove(self, key):', '        i = key % self.size', '        self.buckets[i] = [p for p in self.buckets[i] if p[0] != key]'),
    code('def two_sum(nums, target):', '    seen = {}', '    for i, x in enumerate(nums):', '        if target - x in seen:', '            return [seen[target - x], i]', '        seen[x] = i', '    return []'),
  ],
  [
    code('def max_area(height):', '    left, right = 0, len(height) - 1', '    best = 0', '    while left < right:', '        best = max(best, min(height[left], height[right]) * (right - left))', '        if height[left] < height[right]:', '            left += 1', '        else:', '            right -= 1', '    return best'),
    code('def is_palindrome(s):', '    clean = [ch.lower() for ch in s if ch.isalnum()]', '    left, right = 0, len(clean) - 1', '    while left < right:', '        if clean[left] != clean[right]:', '            return False', '        left += 1', '        right -= 1', '    return True'),
  ],
  [
    code('def length_of_longest_substring(s):', '    last_seen = {}', '    left = 0', '    best = 0', '    for right, ch in enumerate(s):', '        if ch in last_seen and last_seen[ch] >= left:', '            left = last_seen[ch] + 1', '        last_seen[ch] = right', '        best = max(best, right - left + 1)', '    return best'),
    code('def max_sub_array_sum(nums, k):', '    window = sum(nums[:k])', '    best = window', '    for i in range(k, len(nums)):', '        window += nums[i] - nums[i - k]', '        best = max(best, window)', '    return best'),
  ],
  [
    code('def search_rotated(nums, target):', '    lo, hi = 0, len(nums) - 1', '    while lo <= hi:', '        mid = (lo + hi) // 2', '        if nums[mid] == target:', '            return mid', '        if nums[lo] <= nums[mid]:', '            if nums[lo] <= target < nums[mid]:', '                hi = mid - 1', '            else:', '                lo = mid + 1', '        else:', '            if nums[mid] < target <= nums[hi]:', '                lo = mid + 1', '            else:', '                hi = mid - 1', '    return -1'),
    code('def find_min(nums):', '    lo, hi = 0, len(nums) - 1', '    while lo < hi:', '        mid = (lo + hi) // 2', '        if nums[mid] > nums[hi]:', '            lo = mid + 1', '        else:', '            hi = mid', '    return nums[lo]'),
  ],
  [
    code('def subsets(nums):', '    result = []', '    current = []', '', '    def backtrack(start):', '        result.append(current[:])', '        for i in range(start, len(nums)):', '            current.append(nums[i])', '            backtrack(i + 1)', '            current.pop()', '', '    backtrack(0)', '    return result'),
    code('def permute(nums):', '    result = []', '    used = [False] * len(nums)', '    current = []', '', '    def backtrack():', '        if len(current) == len(nums):', '            result.append(current[:])', '            return', '        for i in range(len(nums)):', '            if not used[i]:', '                used[i] = True', '                current.append(nums[i])', '                backtrack()', '                current.pop()', '                used[i] = False', '', '    backtrack()', '    return result'),
  ],
  [
    code('def merge_sort(arr):', '    if len(arr) <= 1:', '        return arr[:]', '    mid = len(arr) // 2', '    return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:]))', '', '', 'def merge(left, right):', '    out = []', '    i = j = 0', '    while i < len(left) and j < len(right):', '        if left[i] <= right[j]:', '            out.append(left[i])', '            i += 1', '        else:', '            out.append(right[j])', '            j += 1', '    return out + left[i:] + right[j:]'),
    code(LIST_NODE, '', '', 'def merge_two_lists(l1, l2):', '    dummy = ListNode()', '    tail = dummy', '    while l1 and l2:', '        if l1.val <= l2.val:', '            tail.next, l1 = l1, l1.next', '        else:', '            tail.next, l2 = l2, l2.next', '        tail = tail.next', '    tail.next = l1 or l2', '    return dummy.next'),
  ],
  [
    code('def find_kth_largest(nums, k):', '    arr = nums[:]', '    target = len(arr) - k', '    lo, hi = 0, len(arr) - 1', '    while True:', '        pivot = arr[hi]', '        p = lo', '        for i in range(lo, hi):', '            if arr[i] < pivot:', '                arr[i], arr[p] = arr[p], arr[i]', '                p += 1', '        arr[p], arr[hi] = arr[hi], arr[p]', '        if p == target:', '            return arr[p]', '        if p < target:', '            lo = p + 1', '        else:', '            hi = p - 1'),
    code('def quick_sort(arr, lo=0, hi=None):', '    if hi is None:', '        hi = len(arr) - 1', '    if lo >= hi:', '        return arr', '    pivot = arr[hi]', '    p = lo', '    for i in range(lo, hi):', '        if arr[i] < pivot:', '            arr[i], arr[p] = arr[p], arr[i]', '            p += 1', '    arr[p], arr[hi] = arr[hi], arr[p]', '    quick_sort(arr, lo, p - 1)', '    quick_sort(arr, p + 1, hi)', '    return arr'),
  ],
  [
    code('def sort_colors(nums):', '    low, mid, high = 0, 0, len(nums) - 1', '    while mid <= high:', '        if nums[mid] == 0:', '            nums[low], nums[mid] = nums[mid], nums[low]', '            low += 1', '            mid += 1', '        elif nums[mid] == 1:', '            mid += 1', '        else:', '            nums[mid], nums[high] = nums[high], nums[mid]', '            high -= 1'),
    code('def counting_sort(arr, max_val):', '    counts = [0] * (max_val + 1)', '    for v in arr:', '        counts[v] += 1', '    out = []', '    for v in range(max_val + 1):', '        out.extend([v] * counts[v])', '    return out'),
  ],
  [
    code('import bisect', '', '', 'class MedianFinder:', '    def __init__(self):', '        self.nums = []', '', '    def add_num(self, num):', '        bisect.insort(self.nums, num)', '', '    def find_median(self):', '        n = len(self.nums)', '        if n % 2:', '            return self.nums[n // 2]', '        return (self.nums[n // 2 - 1] + self.nums[n // 2]) / 2'),
    code('import bisect', '', '', 'def stream_medians(nums):', '    seen = []', '    medians = []', '    for x in nums:', '        bisect.insort(seen, x)', '        n = len(seen)', '        medians.append(seen[n // 2] if n % 2 else (seen[n // 2 - 1] + seen[n // 2]) / 2)', '    return medians'),
  ],
  [
    code(TREE_NODE, '', '', 'def level_order(root):', '    if root is None:', '        return []', '    result = []', '    level = [root]', '    while level:', '        result.append([n.val for n in level])', '        level = [c for n in level for c in (n.left, n.right) if c]', '    return result'),
    code(TREE_NODE, '', '', 'def max_depth(root):', '    if root is None:', '        return 0', '    return 1 + max(max_depth(root.left), max_depth(root.right))'),
  ],
  [
    code(TREE_NODE, '', '', "def is_valid_bst(root, low=float('-inf'), high=float('inf')):", '    if root is None:', '        return True', '    if not (low < root.val < high):', '        return False', '    return is_valid_bst(root.left, low, root.val) and is_valid_bst(root.right, root.val, high)'),
    code(TREE_NODE, '', '', 'def lowest_common_ancestor(root, p, q):', '    node = root', '    while node:', '        if p < node.val and q < node.val:', '            node = node.left', '        elif p > node.val and q > node.val:', '            node = node.right', '        else:', '            return node', '    return None'),
  ],
  [
    code('class MinHeap:', '    def __init__(self):', '        self.data = []', '', '    def push(self, val):', '        self.data.append(val)', '        i = len(self.data) - 1', '        while i > 0 and self.data[(i - 1) // 2] > self.data[i]:', '            p = (i - 1) // 2', '            self.data[p], self.data[i] = self.data[i], self.data[p]', '            i = p', '', '    def pop(self):', '        top = self.data[0]', '        last = self.data.pop()', '        if self.data:', '            self.data[0] = last', '            i = 0', '            n = len(self.data)', '            while True:', '                smallest = i', '                for c in (2 * i + 1, 2 * i + 2):', '                    if c < n and self.data[c] < self.data[smallest]:', '                        smallest = c', '                if smallest == i:', '                    break', '                self.data[i], self.data[smallest] = self.data[smallest], self.data[i]', '                i = smallest', '        return top', '', '    def peek(self):', '        return self.data[0]', '', '    def size(self):', '        return len(self.data)'),
    code('import heapq', '', '', 'def kth_smallest(nums, k):', '    heap = nums[:]', '    heapq.heapify(heap)', '    for _ in range(k):', '        value = heapq.heappop(heap)', '    return value'),
  ],
  [
    code('class TrieNode:', '    def __init__(self):', '        self.children = {}', '        self.is_end = False', '', '', 'class Trie:', '    def __init__(self):', '        self.root = TrieNode()', '', '    def insert(self, word):', '        node = self.root', '        for ch in word:', '            node = node.children.setdefault(ch, TrieNode())', '        node.is_end = True', '', '    def _walk(self, text):', '        node = self.root', '        for ch in text:', '            node = node.children.get(ch)', '            if node is None:', '                return None', '        return node', '', '    def search(self, word):', '        node = self._walk(word)', '        return node is not None and node.is_end', '', '    def starts_with(self, prefix):', '        return self._walk(prefix) is not None'),
    code(TRIE, '', '', 'def find_words_with_prefix(trie, prefix):', '    node = trie.root', '    for ch in prefix:', '        node = node.children.get(ch)', '        if node is None:', '            return []', '    words = []', '', '    def collect(n, text):', '        if n.is_end:', '            words.append(text)', '        for ch, child in n.children.items():', '            collect(child, text + ch)', '', '    collect(node, prefix)', '    return words'),
  ],
  [
    code('from collections import deque', '', '', 'def shortest_path_bfs(graph, start, target):', '    queue = deque([(start, 0)])', '    visited = {start}', '    while queue:', '        node, dist = queue.popleft()', '        if node == target:', '            return dist', '        for nb in graph.get(node, []):', '            if nb not in visited:', '                visited.add(nb)', '                queue.append((nb, dist + 1))', '    return -1'),
    code('def count_components(n, edges):', '    neighbours = [[] for _ in range(n)]', '    for a, b in edges:', '        neighbours[a].append(b)', '        neighbours[b].append(a)', '    seen = [False] * n', '    count = 0', '    for start in range(n):', '        if seen[start]:', '            continue', '        count += 1', '        stack = [start]', '        seen[start] = True', '        while stack:', '            for nb in neighbours[stack.pop()]:', '                if not seen[nb]:', '                    seen[nb] = True', '                    stack.append(nb)', '    return count'),
  ],
  [
    code('class AutocompleteSystem:', '    def __init__(self):', '        self.freq = {}', '', '    def insert(self, word, freq):', '        self.freq[word] = self.freq.get(word, 0) + freq', '', '    def suggest(self, prefix, k=3):', '        matches = [w for w in self.freq if w.startswith(prefix)]', '        return sorted(matches, key=lambda w: (-self.freq[w], w))[:k]'),
    code('def rank_suggestions(words, prefix, k):', '    return sorted((w for w in words if w.startswith(prefix)), key=lambda w: (-words[w], w))[:k]'),
  ],
  [
    code('import heapq', '', '', 'def dijkstra(graph, start):', '    dist = {start: 0}', '    heap = [(0, start)]', '    while heap:', '        d, node = heapq.heappop(heap)', '        if d > dist[node]:', '            continue', '        for nb, w in graph.get(node, []):', "            if d + w < dist.get(nb, float('inf')):", '                dist[nb] = d + w', '                heapq.heappush(heap, (d + w, nb))', '    return dist'),
    code('import heapq', '', '', 'def network_delay_time(times, n, k):', '    graph = {i: [] for i in range(1, n + 1)}', '    for u, v, w in times:', '        graph[u].append((v, w))', '    dist = {k: 0}', '    heap = [(0, k)]', '    while heap:', '        d, node = heapq.heappop(heap)', '        if d > dist[node]:', '            continue', '        for nb, w in graph[node]:', "            if d + w < dist.get(nb, float('inf')):", '                dist[nb] = d + w', '                heapq.heappush(heap, (d + w, nb))', '    if len(dist) < n:', '        return -1', '    return max(dist.values())'),
  ],
  [
    code('from collections import deque', '', '', 'def find_order(num_courses, prerequisites):', '    in_degree = [0] * num_courses', '    next_courses = [[] for _ in range(num_courses)]', '    for course, required in prerequisites:', '        next_courses[required].append(course)', '        in_degree[course] += 1', '    queue = deque(c for c in range(num_courses) if in_degree[c] == 0)', '    order = []', '    while queue:', '        c = queue.popleft()', '        order.append(c)', '        for n in next_courses[c]:', '            in_degree[n] -= 1', '            if in_degree[n] == 0:', '                queue.append(n)', '    return order if len(order) == num_courses else []'),
    code('def can_finish(num_courses, prerequisites):', '    in_degree = [0] * num_courses', '    next_courses = [[] for _ in range(num_courses)]', '    for course, required in prerequisites:', '        next_courses[required].append(course)', '        in_degree[course] += 1', '    ready = [c for c in range(num_courses) if in_degree[c] == 0]', '    taken = 0', '    while ready:', '        c = ready.pop()', '        taken += 1', '        for n in next_courses[c]:', '            in_degree[n] -= 1', '            if in_degree[n] == 0:', '                ready.append(n)', '    return taken == num_courses'),
  ],
  [
    code('class UnionFind:', '    def __init__(self, n):', '        self.parent = list(range(n))', '        self.rank = [0] * n', '', '    def find(self, x):', '        if self.parent[x] != x:', '            self.parent[x] = self.find(self.parent[x])', '        return self.parent[x]', '', '    def union(self, x, y):', '        rx, ry = self.find(x), self.find(y)', '        if rx == ry:', '            return False', '        if self.rank[rx] < self.rank[ry]:', '            rx, ry = ry, rx', '        self.parent[ry] = rx', '        if self.rank[rx] == self.rank[ry]:', '            self.rank[rx] += 1', '        return True', '', '    def connected(self, x, y):', '        return self.find(x) == self.find(y)'),
    code('def find_redundant_connection(edges):', '    parent = {}', '', '    def find(x):', '        parent.setdefault(x, x)', '        if parent[x] != x:', '            parent[x] = find(parent[x])', '        return parent[x]', '', '    for a, b in edges:', '        ra, rb = find(a), find(b)', '        if ra == rb:', '            return [a, b]', '        parent[ra] = rb', '    return []'),
  ],
  [
    code('def rob(nums):', '    prev, curr = 0, 0', '    for x in nums:', '        prev, curr = curr, max(curr, prev + x)', '    return curr'),
    code('def climb_stairs(n):', '    a, b = 1, 1', '    for _ in range(n - 1):', '        a, b = b, a + b', '    return b'),
  ],
  [
    code('def coin_change(coins, amount):', "    best = [0] + [float('inf')] * amount", '    for x in range(1, amount + 1):', '        for c in coins:', '            if c <= x:', '                best[x] = min(best[x], best[x - c] + 1)', "    return -1 if best[amount] == float('inf') else best[amount]"),
    code('def knapsack(weights, values, capacity):', '    best = [0] * (capacity + 1)', '    for w, v in zip(weights, values):', '        for c in range(capacity, w - 1, -1):', '            best[c] = max(best[c], best[c - w] + v)', '    return best[capacity]'),
  ],
  [
    code('def longest_common_subsequence(text1, text2):', '    rows, cols = len(text1) + 1, len(text2) + 1', '    dp = [[0] * cols for _ in range(rows)]', '    for i in range(1, rows):', '        for j in range(1, cols):', '            if text1[i - 1] == text2[j - 1]:', '                dp[i][j] = dp[i - 1][j - 1] + 1', '            else:', '                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])', '    return dp[-1][-1]'),
    code('def min_distance(word1, word2):', '    dp = [[0] * (len(word2) + 1) for _ in range(len(word1) + 1)]', '    for i in range(len(word1) + 1):', '        dp[i][0] = i', '    for j in range(len(word2) + 1):', '        dp[0][j] = j', '    for i in range(1, len(word1) + 1):', '        for j in range(1, len(word2) + 1):', '            if word1[i - 1] == word2[j - 1]:', '                dp[i][j] = dp[i - 1][j - 1]', '            else:', '                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])', '    return dp[-1][-1]'),
  ],
  [
    code('def total_n_queens(n):', '    cols, diag1, diag2 = set(), set(), set()', '', '    def place(row):', '        if row == n:', '            return 1', '        count = 0', '        for col in range(n):', '            if col in cols or row + col in diag1 or row - col in diag2:', '                continue', '            cols.add(col); diag1.add(row + col); diag2.add(row - col)', '            count += place(row + 1)', '            cols.remove(col); diag1.remove(row + col); diag2.remove(row - col)', '        return count', '', '    return place(0)'),
    code('def is_valid_sudoku(board):', '    seen = set()', '    for r in range(9):', '        for c in range(9):', '            d = board[r][c]', "            if d == '.':", '                continue', "            keys = [('row', r, d), ('col', c, d), ('box', r // 3, c // 3, d)]", '            if any(k in seen for k in keys):', '                return False', '            seen.update(keys)', '    return True'),
  ],
  [
    code('def single_number(nums):', '    result = 0', '    for x in nums:', '        result ^= x', '    return result'),
    code('def hamming_weight(n):', '    count = 0', '    while n:', '        n &= n - 1', '        count += 1', '    return count'),
  ],
  [
    code('def find_cheapest_flight(n, flights, src, dst, k):', "    cost = [float('inf')] * n", '    cost[src] = 0', '    for _ in range(k + 1):', '        new = cost[:]', '        for u, v, p in flights:', '            if cost[u] + p < new[v]:', '                new[v] = cost[u] + p', '        cost = new', "    return -1 if cost[dst] == float('inf') else cost[dst]"),
    code('def audit_flight_graph(flights):', '    airports = {a for f in flights for a in f[:2]}', "    return {'routes': len(flights), 'airports': len(airports), 'cheapest': min((f[2] for f in flights), default=None)}"),
  ],
];

const hasPython = spawnSync('python3', ['--version']).status === 0;

/** The browser runs the student's code and then the checks as one program; this does the same. */
function grade(solution: string, testSuite: string) {
  const blocked = findForbiddenPython(`${solution}\n${testSuite}`);
  if (blocked) return { ok: false, out: `blocked by the server safety filter: ${blocked}` };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dsa-py-'));
  try {
    fs.writeFileSync(path.join(dir, 'task.py'), `${solution}\n\n${testSuite}\n`);
    const r = spawnSync('python3', ['task.py'], { cwd: dir, encoding: 'utf8', timeout: 20000 });
    return { ok: r.status === 0 && r.stdout.includes('All checks passed.'), out: `${r.stdout}${r.stderr}` };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/** The starting code with every `pass` replaced by `return value`: a guess, not a solution. */
const lazy = (starter: string, value: string) => starter.replace(/^(\s*)pass$/gm, `$1return ${value}`);

test('the Python DSA course has 30 days and an answer for every practice task', () => {
  assert.equal(DSA_PYTHON_30_DAYS_CONFIGS.length, 30);
  assert.equal(SOLUTIONS.length, 30);
});

test('every Python DSA task: the answer passes, the starting code and lazy guesses fail', { skip: !hasPython && 'python3 not installed' }, () => {
  DSA_PYTHON_30_DAYS_CONFIGS.forEach((cfg, i) => {
    const tasks = [
      { name: 'Practice 1', starter: cfg.eStarter!, check: cfg.eTest!, solution: SOLUTIONS[i][0] },
      { name: 'Practice 2', starter: cfg.aStarter!, check: cfg.aTest!, solution: SOLUTIONS[i][1] },
    ];
    for (const t of tasks) {
      const label = `Day ${i + 1} ${t.name}`;
      const good = grade(t.solution, t.check);
      assert.ok(good.ok, `${label}: the answer fails:\n${good.out}`);
      assert.ok(!grade(t.starter, t.check).ok, `${label}: the starting code already passes`);
      for (const value of ['True', 'False', '0', '1', '-1', '[]', "''", 'None', '{}']) {
        assert.ok(!grade(lazy(t.starter, value), t.check).ok, `${label}: passes when everything returns ${value}`);
      }
    }
  });
});
