import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';
import { DSA_30_DAYS_CONFIGS } from './dsa30DayData';

/**
 * Data Structures & Algorithms in Python (course-dsa-python), for the Python track.
 *
 * The same 30 days, topics and lessons as the JavaScript DSA course (course-dsa-optim), but every
 * practice task is written and checked in Python, and the lesson examples run in Python (Pyodide).
 * Checks are plain `assert` statements run after the student's code; the reference answers live in
 * tests/dsa_python_tasks.test.ts, not here, so students never download them.
 */
const done = "print('All checks passed.')";
const code = (...l: string[]) => l.join('\n');

/** Linked-list and tree node classes given to the tasks that need them. */
const LIST_NODE = code(
  'class ListNode:',
  '    def __init__(self, val=0, next=None):',
  '        self.val = val',
  '        self.next = next',
);
const TREE_NODE = code(
  'class TreeNode:',
  '    def __init__(self, val=0, left=None, right=None):',
  '        self.val = val',
  '        self.left = left',
  '        self.right = right',
);
/** The Trie from Day 19 Practice 1, given to Practice 2. */
const TRIE = code(
  'class TrieNode:',
  '    def __init__(self):',
  '        self.children = {}',
  '        self.is_end = False',
  '',
  '',
  'class Trie:',
  '    def __init__(self):',
  '        self.root = TrieNode()',
  '',
  '    def insert(self, word):',
  '        node = self.root',
  '        for ch in word:',
  '            node = node.children.setdefault(ch, TrieNode())',
  '        node.is_end = True',
);

type Task = { title?: string; desc: string; starter: string; hint: string; test: string };
type Day = { e: Task; a: Task };

const DAYS: Day[] = [
  // Day 1: Big-O
  {
    e: {
      desc: "Write `analyze_complexity_tier(step_count)` where `step_count(n)` returns how many steps an algorithm takes for input size n. Compare n=1000 with n=2000: if the steps stay about the same return 'O(1)', if they about double return 'O(N)', and if they about quadruple return 'O(N^2)'.",
      starter: code('def analyze_complexity_tier(step_count):', '    # ratio = step_count(2000) / step_count(1000)', '    # about 1 -> O(1), about 2 -> O(N), about 4 -> O(N^2)', '    pass'),
      hint: "ratio = step_count(2000) / step_count(1000); use ratio < 1.5 for O(1) and ratio < 3 for O(N).",
      test: code("assert analyze_complexity_tier(lambda n: 5) == 'O(1)', 'A constant number of steps is O(1)'", "assert analyze_complexity_tier(lambda n: 3 * n) == 'O(N)', 'Steps growing with n is O(N)'", "assert analyze_complexity_tier(lambda n: n * n) == 'O(N^2)', 'Steps growing with n squared is O(N^2)'", "assert analyze_complexity_tier(lambda n: 2 * n + 7) == 'O(N)', 'Constants do not change the class: 2n + 7 is O(N)'", done),
    },
    a: {
      desc: "Write `get_dominant_term(terms)` that returns the fastest-growing Big-O term in the list. The order from slowest to fastest is: 'O(1)', 'O(log N)', 'O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)'.",
      starter: code('def get_dominant_term(terms):', "    order = ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)']", '    # Return the term with the highest position in order', '    pass'),
      hint: "return max(terms, key=order.index)",
      test: code("assert get_dominant_term(['O(1)', 'O(N)', 'O(log N)']) == 'O(N)', 'Expected O(N)'", "assert get_dominant_term(['O(N)', 'O(N^2)', 'O(N log N)']) == 'O(N^2)', 'Expected O(N^2)'", "assert get_dominant_term(['O(log N)', 'O(1)']) == 'O(log N)', 'Expected O(log N)'", done),
    },
  },
  // Day 2: arrays
  {
    e: {
      desc: "Build a `DynamicArray` class that grows like Python's list does inside. `__init__(self, capacity=2)` makes room for `capacity` items; `push(value)` adds an item and doubles the capacity when full; `get(index)` returns an item; `size()` returns how many items are stored and `capacity()` how many fit before the next resize.",
      starter: code('class DynamicArray:', '    def __init__(self, capacity=2):', '        self._capacity = capacity', '        self._size = 0', '        self._data = [None] * capacity', '', '    def push(self, value):', '        # If full: make a new list twice as big and copy the items over. Then store value.', '        pass', '', '    def get(self, index):', '        pass', '', '    def size(self):', '        pass', '', '    def capacity(self):', '        pass'),
      hint: "When self._size == self._capacity: self._capacity *= 2; new = [None] * self._capacity; copy the old items; self._data = new.",
      test: code('da = DynamicArray(2)', 'da.push(10)', 'da.push(20)', "assert da.capacity() == 2 and da.size() == 2, 'Two items fit in capacity 2'", 'da.push(30)', "assert da.capacity() == 4 and da.size() == 3, 'The third push must double the capacity to 4'", "assert da.get(0) == 10 and da.get(2) == 30, 'Items must keep their positions'", 'for v in range(4, 10):', '    da.push(v)', "assert da.capacity() == 16 and da.size() == 9, 'Capacity keeps doubling: 4 -> 8 -> 16'", done),
    },
    a: {
      desc: "Write `remove_element(nums, val)` that removes every `val` from the list in place (without making a new list) and returns the new length k. The first k items of nums must be the kept items, in their original order.",
      starter: code('def remove_element(nums, val):', '    k = 0  # where the next kept item goes', '    # Walk through nums; copy every item that is not val to nums[k] and move k on', '    pass'),
      hint: "for x in nums: if x != val: nums[k] = x; k += 1. Then return k.",
      test: code('arr = [3, 2, 2, 3]', 'k = remove_element(arr, 3)', "assert k == 2 and arr[:k] == [2, 2], 'Expected [2, 2] with length 2'", 'arr2 = [0, 1, 2, 2, 3, 0, 4, 2]', 'k2 = remove_element(arr2, 2)', "assert k2 == 5 and arr2[:k2] == [0, 1, 3, 0, 4], 'Kept items must stay in order'", "assert remove_element([], 1) == 0, 'An empty list has length 0'", done),
    },
  },
  // Day 3: linked lists
  {
    e: {
      desc: "Write `reverse_list(head)` that reverses a singly linked list in place and returns the new head. A `ListNode` class (val, next) is already in the editor.",
      starter: code(LIST_NODE, '', '', 'def reverse_list(head):', '    prev = None', '    curr = head', '    # Point each node back to prev, then move prev and curr forward', '    pass'),
      hint: "while curr: nxt = curr.next; curr.next = prev; prev = curr; curr = nxt. Return prev.",
      test: code('def to_list(node):', '    out = []', '    while node:', '        out.append(node.val)', '        node = node.next', '    return out', '', 'head = ListNode(1, ListNode(2, ListNode(3)))', "assert to_list(reverse_list(head)) == [3, 2, 1], 'Expected 3 -> 2 -> 1'", "assert reverse_list(None) is None, 'An empty list stays empty'", "assert to_list(reverse_list(ListNode(7))) == [7], 'A single node stays the same'", done),
    },
    a: {
      desc: "Write `has_cycle(head)` that returns True if the linked list loops back on itself, using Floyd's slow and fast pointers (O(1) extra memory). A `ListNode` class is already in the editor.",
      starter: code(LIST_NODE, '', '', 'def has_cycle(head):', '    slow = fast = head', '    # Move slow 1 step and fast 2 steps; if they ever meet, there is a cycle', '    pass'),
      hint: "while fast and fast.next: slow = slow.next; fast = fast.next.next; if slow is fast: return True. After the loop return False.",
      test: code('a = ListNode(1)', 'b = ListNode(2)', 'a.next = b', "assert has_cycle(a) is False, 'A list that ends is not a cycle'", 'b.next = a', "assert has_cycle(a) is True, 'A list that loops back is a cycle'", "assert has_cycle(None) is False, 'An empty list has no cycle'", done),
    },
  },
  // Day 4: stacks
  {
    e: {
      desc: "Write `is_valid_parentheses(s)` that returns True when every (, [ and { is closed by the matching bracket in the right order.",
      starter: code('def is_valid_parentheses(s):', "    pairs = {')': '(', ']': '[', '}': '{'}", '    stack = []', '    # Push opening brackets; for a closing bracket, pop and check it matches', '    pass'),
      hint: "For a closing bracket: if not stack or stack.pop() != pairs[ch]: return False. At the end return not stack.",
      test: code("assert is_valid_parentheses('()[]{}') is True, 'Expected True for ()[]{}'", "assert is_valid_parentheses('(]') is False, 'Expected False for (]'", "assert is_valid_parentheses('([)]') is False, 'Expected False for ([)]'", "assert is_valid_parentheses('{[]}') is True, 'Expected True for {[]}'", "assert is_valid_parentheses('((') is False, 'Unclosed brackets are not valid'", done),
    },
    a: {
      desc: "Write `next_greater_elements(nums)` returning a list where item i is the first number to the right of nums[i] that is bigger, or -1 if there is none. Use a stack of indexes (O(N)).",
      starter: code('def next_greater_elements(nums):', '    result = [-1] * len(nums)', '    stack = []  # indexes still waiting for a bigger number', '    pass'),
      hint: "for i, x in enumerate(nums): while stack and nums[stack[-1]] < x: result[stack.pop()] = x; then stack.append(i).",
      test: code("assert next_greater_elements([2, 1, 2, 4, 3]) == [4, 2, 4, -1, -1], 'Expected [4, 2, 4, -1, -1]'", "assert next_greater_elements([5, 4, 3]) == [-1, -1, -1], 'A falling list has no greater elements'", "assert next_greater_elements([]) == [], 'An empty list gives an empty list'", done),
    },
  },
  // Day 5: LRU cache
  {
    e: {
      desc: "Build `LRUCache(capacity)` with `get(key)` (the value, or -1 if missing) and `put(key, value)`. When a new key would go over capacity, remove the least recently used key first. Both must be O(1): use a dictionary plus a doubly linked list, or collections.OrderedDict.",
      starter: code('class LRUCache:', '    def __init__(self, capacity):', '        self.capacity = capacity', '        # Keep keys in order of use, most recent last', '', '    def get(self, key):', '        pass', '', '    def put(self, key, value):', '        pass'),
      hint: "With OrderedDict: get moves the key to the end (move_to_end); put sets it, moves it to the end, and if len > capacity: popitem(last=False).",
      test: code('lru = LRUCache(2)', 'lru.put(1, 100)', 'lru.put(2, 200)', "assert lru.get(1) == 100, 'Key 1 must be found'", 'lru.put(3, 300)', "assert lru.get(2) == -1, 'Key 2 was least recently used, so it is removed'", "assert lru.get(3) == 300 and lru.get(1) == 100, 'Keys 1 and 3 must still be there'", 'lru.put(1, 111)', "assert lru.get(1) == 111, 'put on an existing key updates its value'", done),
    },
    a: {
      desc: "Write `run_lru_operations(capacity, ops)` that replays operations on an LRU cache of that capacity and returns the list of results of every 'get'. Each op is ('put', key, value) or ('get', key); a missing key gives -1.",
      starter: code('def run_lru_operations(capacity, ops):', '    results = []', "    # For ('put', k, v) store it (removing the least recently used key if full); for ('get', k) append the value or -1", '    pass'),
      hint: "Use a dict; when you read or write a key, delete it and insert it again so it becomes the most recent. next(iter(cache)) is the least recent key.",
      test: code("assert run_lru_operations(1, [('put', 1, 10), ('put', 2, 20), ('get', 1), ('get', 2)]) == [-1, 20], 'Capacity 1 keeps only the newest key'", "assert run_lru_operations(2, [('put', 1, 1), ('put', 2, 2), ('get', 1), ('put', 3, 3), ('get', 2), ('get', 1)]) == [1, -1, 1], 'Reading key 1 makes key 2 the one to remove'", done),
    },
  },
  // Day 6: queues
  {
    e: {
      desc: "Build `CircularQueue(k)` with `en_queue(value)` and `de_queue()` (True if it worked, False if the queue was full or empty), `front()` and `rear()` (the value, or -1 if empty), `is_empty()` and `is_full()`. Use a fixed list of size k and modulo arithmetic instead of shifting items.",
      starter: code('class CircularQueue:', '    def __init__(self, k):', '        self.data = [None] * k', '        self.k = k', '        self.head = 0', '        self.count = 0', '', '    def en_queue(self, value):', '        pass', '', '    def de_queue(self):', '        pass', '', '    def front(self):', '        pass', '', '    def rear(self):', '        pass', '', '    def is_empty(self):', '        pass', '', '    def is_full(self):', '        pass'),
      hint: "The next free slot is (self.head + self.count) % self.k; de_queue moves head forward with (self.head + 1) % self.k.",
      test: code('cq = CircularQueue(3)', "assert cq.en_queue(1) and cq.en_queue(2) and cq.en_queue(3), 'Three values fit'", "assert cq.is_full() is True and cq.en_queue(4) is False, 'A full queue refuses more'", "assert cq.de_queue() is True and cq.front() == 2, 'After removing 1, the front is 2'", "assert cq.en_queue(4) is True and cq.rear() == 4, 'The freed slot is reused (wrap-around)'", 'cq.de_queue(); cq.de_queue(); cq.de_queue()', "assert cq.is_empty() is True and cq.front() == -1 and cq.de_queue() is False, 'An empty queue returns -1 and False'", done),
    },
    a: {
      desc: "Build `MyStack` (last in, first out) using only a queue: `push(x)`, `pop()` (remove and return the top), `top()` and `empty()`. Use collections.deque and only append on the right and popleft on the left.",
      starter: code('from collections import deque', '', '', 'class MyStack:', '    def __init__(self):', '        self.q = deque()', '', '    def push(self, x):', '        # Append x, then rotate the older items behind it so x is at the front', '        pass', '', '    def pop(self):', '        pass', '', '    def top(self):', '        pass', '', '    def empty(self):', '        pass'),
      hint: "After self.q.append(x), repeat len(self.q) - 1 times: self.q.append(self.q.popleft()).",
      test: code('s = MyStack()', 's.push(1)', 's.push(2)', "assert s.top() == 2 and s.pop() == 2 and s.top() == 1, 'The last value pushed comes out first'", "assert s.empty() is False, 'One value is still there'", 's.pop()', "assert s.empty() is True, 'The stack is empty now'", done),
    },
  },
  // Day 7: hashing
  {
    e: {
      desc: "Build `MyHashMap` without using a Python dict: `put(key, value)`, `get(key)` (the value, or -1) and `remove(key)`. Keep a list of buckets, pick a bucket with key % number_of_buckets, and store [key, value] pairs in each bucket (separate chaining).",
      starter: code('class MyHashMap:', '    def __init__(self):', '        self.size = 101', '        self.buckets = [[] for _ in range(self.size)]', '', '    def put(self, key, value):', '        pass', '', '    def get(self, key):', '        pass', '', '    def remove(self, key):', '        pass'),
      hint: "bucket = self.buckets[key % self.size]; look for a pair with pair[0] == key to update, read or remove.",
      test: code('hm = MyHashMap()', 'hm.put(1, 100)', 'hm.put(2, 200)', "assert hm.get(1) == 100 and hm.get(2) == 200 and hm.get(3) == -1, 'Lookups must work'", 'hm.put(2, 250)', "assert hm.get(2) == 250, 'put on an existing key overwrites it'", 'hm.remove(2)', "assert hm.get(2) == -1, 'A removed key is gone'", 'hm.put(102, 7)', "assert hm.get(1) == 100 and hm.get(102) == 7, 'Keys 1 and 102 share a bucket and both work'", done),
    },
    a: {
      desc: "Write `two_sum(nums, target)` returning the indexes [i, j] of the two numbers that add up to target, in one pass using a dictionary (O(N)).",
      starter: code('def two_sum(nums, target):', '    seen = {}  # number -> its index', '    # For each number, check whether target - number was seen before', '    pass'),
      hint: "for i, x in enumerate(nums): if target - x in seen: return [seen[target - x], i]; seen[x] = i.",
      test: code("assert two_sum([2, 7, 11, 15], 9) == [0, 1], 'Expected [0, 1]'", "assert two_sum([3, 2, 4], 6) == [1, 2], 'Expected [1, 2]'", "assert two_sum([3, 3], 6) == [0, 1], 'Expected [0, 1] for equal numbers'", done),
    },
  },
  // Day 8: two pointers
  {
    e: {
      desc: "Write `max_area(height)` returning the most water a container can hold between two of the lines, in O(N) with two pointers.",
      starter: code('def max_area(height):', '    left, right = 0, len(height) - 1', '    best = 0', '    # Area = min(height[left], height[right]) * (right - left); move the shorter side inward', '    pass'),
      hint: "while left < right: update best; if height[left] < height[right]: left += 1 else: right -= 1.",
      test: code("assert max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49, 'Expected 49'", "assert max_area([1, 1]) == 1, 'Expected 1'", "assert max_area([4, 3, 2, 1, 4]) == 16, 'Expected 16'", done),
    },
    a: {
      desc: "Write `is_palindrome(s)` that ignores upper/lower case and everything that is not a letter or digit, and checks the rest reads the same both ways, using two pointers.",
      starter: code('def is_palindrome(s):', '    clean = [ch.lower() for ch in s if ch.isalnum()]', '    # Compare from both ends moving inward', '    pass'),
      hint: "left, right = 0, len(clean) - 1; while left < right: if clean[left] != clean[right]: return False; move both.",
      test: code("assert is_palindrome('A man, a plan, a canal: Panama') is True, 'This is a palindrome'", "assert is_palindrome('race a car') is False, 'This is not a palindrome'", "assert is_palindrome('') is True, 'An empty string is a palindrome'", done),
    },
  },
  // Day 9: sliding window
  {
    e: {
      desc: "Write `length_of_longest_substring(s)` returning the length of the longest part of s with no repeated character, in O(N) with a sliding window.",
      starter: code('def length_of_longest_substring(s):', '    last_seen = {}  # character -> last index', '    left = 0', '    best = 0', '    pass'),
      hint: "for right, ch in enumerate(s): if ch in last_seen and last_seen[ch] >= left: left = last_seen[ch] + 1; then store the index and update best.",
      test: code("assert length_of_longest_substring('abcabcbb') == 3, 'Expected 3'", "assert length_of_longest_substring('bbbbb') == 1, 'Expected 1'", "assert length_of_longest_substring('pwwkew') == 3, 'Expected 3'", "assert length_of_longest_substring('') == 0, 'Expected 0'", done),
    },
    a: {
      desc: "Write `max_sub_array_sum(nums, k)` returning the biggest sum of any k numbers in a row, sliding the window instead of adding each window again.",
      starter: code('def max_sub_array_sum(nums, k):', '    window = sum(nums[:k])', '    best = window', '    # Slide: add the new number on the right, subtract the one that left on the left', '    pass'),
      hint: "for i in range(k, len(nums)): window += nums[i] - nums[i - k]; best = max(best, window).",
      test: code("assert max_sub_array_sum([2, 1, 5, 1, 3, 2], 3) == 9, 'Expected 9 from [5, 1, 3]'", "assert max_sub_array_sum([1, 9, -1, -2, 7, 3], 2) == 10, 'Expected 10'", done),
    },
  },
  // Day 10: binary search
  {
    e: {
      desc: "Write `search_rotated(nums, target)` returning the index of target in a sorted list that was rotated (like [4, 5, 6, 7, 0, 1, 2]), or -1, in O(log N).",
      starter: code('def search_rotated(nums, target):', '    lo, hi = 0, len(nums) - 1', '    # Each step, one half is sorted: check whether target lies inside that half', '    pass'),
      hint: "If nums[lo] <= nums[mid], the left half is sorted: search it when nums[lo] <= target < nums[mid]; otherwise the right half is sorted.",
      test: code("assert search_rotated([4, 5, 6, 7, 0, 1, 2], 0) == 4, 'Expected index 4'", "assert search_rotated([4, 5, 6, 7, 0, 1, 2], 3) == -1, 'Expected -1'", "assert search_rotated([1, 2, 3, 4, 5], 4) == 3, 'Expected index 3 in a list that was not rotated'", "assert search_rotated([5, 1, 3], 5) == 0, 'Expected index 0'", done),
    },
    a: {
      desc: "Write `find_min(nums)` returning the smallest number in a rotated sorted list in O(log N).",
      starter: code('def find_min(nums):', '    lo, hi = 0, len(nums) - 1', '    # Compare the middle with the right end to find the turning point', '    pass'),
      hint: "while lo < hi: mid = (lo + hi) // 2; if nums[mid] > nums[hi]: lo = mid + 1 else: hi = mid. Return nums[lo].",
      test: code("assert find_min([3, 4, 5, 1, 2]) == 1, 'Expected 1'", "assert find_min([4, 5, 6, 7, 0, 1, 2]) == 0, 'Expected 0'", "assert find_min([11, 13, 15, 17]) == 11, 'Expected 11 when not rotated'", done),
    },
  },
  // Day 11: backtracking
  {
    e: {
      desc: "Write `subsets(nums)` returning all 2^N subsets of nums (in any order), using backtracking.",
      starter: code('def subsets(nums):', '    result = []', '    current = []', '', '    def backtrack(start):', '        # Save a copy of current, then try adding each remaining number', '        pass', '', '    backtrack(0)', '    return result'),
      hint: "result.append(current[:]); for i in range(start, len(nums)): current.append(nums[i]); backtrack(i + 1); current.pop().",
      test: code('s = subsets([1, 2, 3])', "assert len(s) == 8, 'A set of 3 has 8 subsets'", "assert sorted(sorted(x) for x in s) == sorted([[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]), 'Every subset must appear once'", "assert subsets([]) == [[]], 'The empty set has one subset: itself'", done),
    },
    a: {
      desc: "Write `permute(nums)` returning every order (permutation) of the numbers, using backtracking with a record of which numbers are already used.",
      starter: code('def permute(nums):', '    result = []', '    used = [False] * len(nums)', '    current = []', '    # Build each order one number at a time', '    pass'),
      hint: "def backtrack(): if len(current) == len(nums): result.append(current[:]); else try every unused index, mark it, recurse, unmark.",
      test: code('p = permute([1, 2, 3])', "assert len(p) == 6, 'Expected 3! = 6 orders'", "assert sorted(p) == [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]], 'Every order must appear once'", done),
    },
  },
  // Day 12: merge sort
  {
    e: {
      desc: "Write `merge_sort(arr)` returning a new sorted list in O(N log N): split in half, sort each half, then merge them. Do not use sorted() or .sort().",
      starter: code('def merge_sort(arr):', '    if len(arr) <= 1:', '        return arr[:]', '    # Sort both halves, then merge', '    pass', '', '', 'def merge(left, right):', '    # Take the smaller front item each time', '    pass'),
      hint: "mid = len(arr) // 2; return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:])).",
      test: code('data = [38, 27, 43, 3, 9, 82, 10]', "assert merge_sort(data) == [3, 9, 10, 27, 38, 43, 82], 'Merge sort failed'", "assert data == [38, 27, 43, 3, 9, 82, 10], 'Return a new list; do not change the input'", "assert merge_sort([]) == [] and merge_sort([5, 1]) == [1, 5], 'Small lists must work'", done),
    },
    a: {
      desc: "Write `merge_two_lists(l1, l2)` that merges two sorted linked lists into one sorted linked list and returns its head. A `ListNode` class is already in the editor.",
      starter: code(LIST_NODE, '', '', 'def merge_two_lists(l1, l2):', '    dummy = ListNode()', '    tail = dummy', '    # Attach the smaller node each time', '    pass'),
      hint: "while l1 and l2: attach the smaller one and move it forward; tail.next = l1 or l2 at the end; return dummy.next.",
      test: code('def to_list(node):', '    out = []', '    while node:', '        out.append(node.val)', '        node = node.next', '    return out', '', 'a = ListNode(1, ListNode(4))', 'b = ListNode(2, ListNode(3, ListNode(5)))', "assert to_list(merge_two_lists(a, b)) == [1, 2, 3, 4, 5], 'Expected 1 2 3 4 5'", "assert merge_two_lists(None, None) is None, 'Two empty lists give an empty list'", done),
    },
  },
  // Day 13: quick sort
  {
    e: {
      desc: "Write `find_kth_largest(nums, k)` returning the k-th largest number with quickselect (average O(N)), without sorting the whole list.",
      starter: code('def find_kth_largest(nums, k):', '    arr = nums[:]', '    target = len(arr) - k  # index it would have if sorted ascending', '    # Partition around a pivot and keep only the side that holds target', '    pass'),
      hint: "Lomuto partition: pivot = arr[hi]; move smaller items left; put the pivot at p. If p == target return arr[p]; else narrow lo/hi.",
      test: code("assert find_kth_largest([3, 2, 1, 5, 6, 4], 2) == 5, 'The 2nd largest is 5'", "assert find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) == 4, 'The 4th largest is 4'", "assert find_kth_largest([1], 1) == 1, 'One number'", done),
    },
    a: {
      desc: "Write `quick_sort(arr, lo=0, hi=None)` that sorts the list in place with quick sort and returns it.",
      starter: code('def quick_sort(arr, lo=0, hi=None):', '    if hi is None:', '        hi = len(arr) - 1', '    # Partition around arr[hi], then sort the left and right parts', '    pass'),
      hint: "if lo >= hi: return arr. Partition, then quick_sort(arr, lo, p - 1) and quick_sort(arr, p + 1, hi).",
      test: code('a = [5, 2, 9, 1, 7]', 'quick_sort(a)', "assert a == [1, 2, 5, 7, 9], 'The list must be sorted in place'", 'b = [3, 3, 1, 2, 3]', 'quick_sort(b)', "assert b == [1, 2, 3, 3, 3], 'Repeated values must work'", done),
    },
  },
  // Day 14: linear-time sorts
  {
    e: {
      desc: "Write `sort_colors(nums)` that sorts a list of 0s, 1s and 2s in place in one pass (Dutch national flag: low, mid and high pointers). Do not use sort().",
      starter: code('def sort_colors(nums):', '    low, mid, high = 0, 0, len(nums) - 1', '    # 0 -> swap to low, 1 -> leave, 2 -> swap to high', '    pass'),
      hint: "while mid <= high: 0 swaps with low (move both), 1 moves mid, 2 swaps with high (move high only).",
      test: code('a = [2, 0, 2, 1, 1, 0]', 'sort_colors(a)', "assert a == [0, 0, 1, 1, 2, 2], 'Expected [0, 0, 1, 1, 2, 2]'", 'b = [2, 1, 0]', 'sort_colors(b)', "assert b == [0, 1, 2], 'Expected [0, 1, 2]'", done),
    },
    a: {
      desc: "Write `counting_sort(arr, max_val)` that sorts whole numbers from 0 to max_val in O(N + K) by counting how often each value appears. Return a new list.",
      starter: code('def counting_sort(arr, max_val):', '    counts = [0] * (max_val + 1)', '    # Count each value, then write each value out as many times as it was counted', '    pass'),
      hint: "for v in arr: counts[v] += 1; then for v in range(max_val + 1): out.extend([v] * counts[v]).",
      test: code("assert counting_sort([4, 2, 2, 8, 3, 3, 1], 8) == [1, 2, 2, 3, 3, 4, 8], 'Counting sort failed'", "assert counting_sort([], 5) == [], 'An empty list stays empty'", done),
    },
  },
  // Day 15: heaps / median
  {
    e: {
      desc: "Build `MedianFinder` with `add_num(num)` and `find_median()` that returns the median of all numbers added so far (the average of the two middle ones when the count is even). Keep the numbers sorted as you add them (bisect.insort) or use two heaps.",
      starter: code('import bisect', '', '', 'class MedianFinder:', '    def __init__(self):', '        self.nums = []', '', '    def add_num(self, num):', '        pass', '', '    def find_median(self):', '        pass'),
      hint: "bisect.insort(self.nums, num). For the median: n = len(self.nums); odd -> middle item, even -> average of the two middle items.",
      test: code('mf = MedianFinder()', 'mf.add_num(1)', 'mf.add_num(2)', "assert mf.find_median() == 1.5, 'Median of [1, 2] is 1.5'", 'mf.add_num(3)', "assert mf.find_median() == 2, 'Median of [1, 2, 3] is 2'", 'mf.add_num(4)', "assert mf.find_median() == 2.5, 'Median of [1, 2, 3, 4] is 2.5'", done),
    },
    a: {
      desc: "Write `stream_medians(nums)` returning the running median after each number is added.",
      starter: code('import bisect', '', '', 'def stream_medians(nums):', '    seen = []', '    medians = []', '    # Add each number in sorted position, then record the current median', '    pass'),
      hint: "After bisect.insort(seen, x): n = len(seen); median = seen[n // 2] if n % 2 else (seen[n // 2 - 1] + seen[n // 2]) / 2.",
      test: code("assert stream_medians([5, 15, 1, 3]) == [5, 10, 5, 4], 'Expected [5, 10, 5, 4]'", "assert stream_medians([]) == [], 'No numbers, no medians'", done),
    },
  },
  // Day 16: trees and BFS
  {
    e: {
      desc: "Write `level_order(root)` returning the tree's values level by level as a list of lists (breadth-first search). A `TreeNode` class is already in the editor.",
      starter: code(TREE_NODE, '', '', 'def level_order(root):', '    if root is None:', '        return []', '    result = []', '    level = [root]', '    # Record the values of this level, then move on to all their children', '    pass'),
      hint: "while level: result.append([n.val for n in level]); level = [c for n in level for c in (n.left, n.right) if c].",
      test: code('tree = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))', "assert level_order(tree) == [[3], [9, 20], [15, 7]], 'Expected [[3], [9, 20], [15, 7]]'", "assert level_order(None) == [], 'An empty tree gives []'", "assert level_order(TreeNode(42)) == [[42]], 'One node gives [[42]]'", done),
    },
    a: {
      desc: "Write `max_depth(root)` returning the number of levels in the tree. A `TreeNode` class is already in the editor.",
      starter: code(TREE_NODE, '', '', 'def max_depth(root):', '    # 0 for an empty tree, otherwise 1 + the deeper of the two sides', '    pass'),
      hint: "if root is None: return 0; return 1 + max(max_depth(root.left), max_depth(root.right)).",
      test: code("assert max_depth(TreeNode(1, None, TreeNode(2))) == 2, 'Expected 2'", "assert max_depth(None) == 0, 'An empty tree has depth 0'", "assert max_depth(TreeNode(1, TreeNode(2, TreeNode(3)), TreeNode(4))) == 3, 'Expected 3'", done),
    },
  },
  // Day 17: binary search trees
  {
    e: {
      desc: "Write `is_valid_bst(root, low=float('-inf'), high=float('inf'))` returning True when every left value is smaller and every right value is bigger than the node above, all the way down. A `TreeNode` class is already in the editor.",
      starter: code(TREE_NODE, '', '', "def is_valid_bst(root, low=float('-inf'), high=float('inf')):", '    # Each node must lie strictly between low and high; pass tighter limits down', '    pass'),
      hint: "if root is None: return True; if not (low < root.val < high): return False; check left with high=root.val and right with low=root.val.",
      test: code("assert is_valid_bst(TreeNode(2, TreeNode(1), TreeNode(3))) is True, 'A valid BST'", "assert is_valid_bst(TreeNode(5, TreeNode(1), TreeNode(4))) is False, '4 on the right of 5 is invalid'", "assert is_valid_bst(TreeNode(5, TreeNode(4), TreeNode(6, TreeNode(3), TreeNode(7)))) is False, '3 is deep on the right of 5, so invalid'", "assert is_valid_bst(None) is True, 'An empty tree is valid'", done),
    },
    a: {
      desc: "Write `lowest_common_ancestor(root, p, q)` for a binary search tree, returning the lowest node that has both values p and q below it (or is one of them), in O(height). p and q are numbers.",
      starter: code(TREE_NODE, '', '', 'def lowest_common_ancestor(root, p, q):', '    node = root', '    # Both smaller -> go left; both bigger -> go right; otherwise this node is the answer', '    pass'),
      hint: "while node: if p < node.val and q < node.val: node = node.left; elif p > node.val and q > node.val: node = node.right; else: return node.",
      test: code('root = TreeNode(6, TreeNode(2, TreeNode(0), TreeNode(4)), TreeNode(8))', "assert lowest_common_ancestor(root, 2, 8).val == 6, 'LCA of 2 and 8 is 6'", "assert lowest_common_ancestor(root, 0, 4).val == 2, 'LCA of 0 and 4 is 2'", "assert lowest_common_ancestor(root, 2, 4).val == 2, 'A node can be its own ancestor'", done),
    },
  },
  // Day 18: heaps
  {
    e: {
      desc: "Build `MinHeap` yourself (no heapq): `push(val)`, `pop()` (remove and return the smallest), `peek()` and `size()`. Store it in a list where the children of index i are at 2i + 1 and 2i + 2.",
      starter: code('class MinHeap:', '    def __init__(self):', '        self.data = []', '', '    def push(self, val):', '        # Append, then swap upwards while smaller than the parent', '        pass', '', '    def pop(self):', '        # Take data[0], move the last item to the top, then swap it down', '        pass', '', '    def peek(self):', '        pass', '', '    def size(self):', '        pass'),
      hint: "The parent of i is (i - 1) // 2. When sifting down, swap with the smaller child while it is smaller than the item.",
      test: code('h = MinHeap()', 'for v in [10, 4, 15, 1, 8]:', '    h.push(v)', "assert h.peek() == 1 and h.size() == 5, 'The smallest value is on top'", "assert [h.pop() for _ in range(5)] == [1, 4, 8, 10, 15], 'pop must return values smallest first'", "assert h.size() == 0, 'The heap is empty now'", done),
    },
    a: {
      desc: "Write `kth_smallest(nums, k)` returning the k-th smallest number using the heapq module (heapify, then pop k times).",
      starter: code('import heapq', '', '', 'def kth_smallest(nums, k):', '    heap = nums[:]', '    heapq.heapify(heap)', '    # Pop k times; the last one popped is the answer', '    pass'),
      hint: "for _ in range(k): value = heapq.heappop(heap). Return value.",
      test: code("assert kth_smallest([7, 10, 4, 3, 20, 15], 3) == 7, 'The 3rd smallest is 7'", "assert kth_smallest([7, 10, 4, 3, 20, 15], 1) == 3, 'The smallest is 3'", done),
    },
  },
  // Day 19: tries
  {
    e: {
      desc: "Build a `Trie` (prefix tree) with `insert(word)`, `search(word)` (True only for whole words) and `starts_with(prefix)`, each O(length of the word). Each node keeps a dict of children and an is_end flag.",
      starter: code('class TrieNode:', '    def __init__(self):', '        self.children = {}', '        self.is_end = False', '', '', 'class Trie:', '    def __init__(self):', '        self.root = TrieNode()', '', '    def insert(self, word):', '        pass', '', '    def search(self, word):', '        pass', '', '    def starts_with(self, prefix):', '        pass'),
      hint: "Walk the letters, creating nodes on insert (setdefault). search needs the last node to have is_end; starts_with only needs the walk to succeed.",
      test: code('t = Trie()', "t.insert('apple')", "assert t.search('apple') is True, 'apple was inserted'", "assert t.search('app') is False, 'app is only a prefix'", "assert t.starts_with('app') is True, 'app is a prefix of apple'", "assert t.starts_with('b') is False, 'Nothing starts with b'", done),
    },
    a: {
      desc: "Write `find_words_with_prefix(trie, prefix)` returning every inserted word that starts with prefix (any order). The Trie from Practice 1 is already in the editor: start from `trie.root`; each node has `children` (letter -> node) and `is_end`.",
      starter: code(TRIE, '', '', 'def find_words_with_prefix(trie, prefix):', '    # Walk down to the node for the last letter of prefix, then collect every word below it (DFS)', '    pass'),
      hint: "After walking the prefix: def collect(node, text): if node.is_end: words.append(text); for ch, child in node.children.items(): collect(child, text + ch).",
      test: code('t = Trie()', "for w in ['card', 'care', 'cart', 'dog']:", '    t.insert(w)', "assert sorted(find_words_with_prefix(t, 'car')) == ['card', 'care', 'cart'], 'Three words start with car'", "assert find_words_with_prefix(t, 'x') == [], 'No word starts with x'", "assert find_words_with_prefix(t, 'dog') == ['dog'], 'A whole word is its own prefix'", done),
    },
  },
  // Day 20: graphs and BFS
  {
    e: {
      desc: "Write `shortest_path_bfs(graph, start, target)` returning the fewest edges from start to target in an unweighted graph (a dict of node -> list of neighbours), or -1 if target cannot be reached.",
      starter: code('from collections import deque', '', '', 'def shortest_path_bfs(graph, start, target):', '    queue = deque([(start, 0)])', '    visited = {start}', '    pass'),
      hint: "while queue: node, dist = queue.popleft(); if node == target: return dist; add unvisited neighbours with dist + 1. Return -1 at the end.",
      test: code("g = {'A': ['B', 'C'], 'B': ['D'], 'C': ['D'], 'D': ['E'], 'E': []}", "assert shortest_path_bfs(g, 'A', 'E') == 3, 'A to E takes 3 steps'", "assert shortest_path_bfs(g, 'A', 'A') == 0, 'The start itself is 0 steps away'", "assert shortest_path_bfs(g, 'E', 'A') == -1, 'E cannot reach A'", done),
    },
    a: {
      desc: "Write `count_components(n, edges)` returning how many separate groups (connected components) an undirected graph with nodes 0..n-1 has.",
      starter: code('def count_components(n, edges):', '    neighbours = [[] for _ in range(n)]', '    for a, b in edges:', '        neighbours[a].append(b)', '        neighbours[b].append(a)', '    # Start a search from every node not visited yet; each start is one component', '    pass'),
      hint: "seen = [False] * n; for each unseen node: count += 1 and visit everything reachable from it.",
      test: code("assert count_components(5, [[0, 1], [1, 2], [3, 4]]) == 2, 'Expected 2 groups'", "assert count_components(4, []) == 4, 'No edges: every node is its own group'", "assert count_components(3, [[0, 1], [1, 2]]) == 1, 'Everything connected is 1 group'", done),
    },
  },
  // Day 21: autocomplete
  {
    e: {
      desc: "Build `AutocompleteSystem` with `insert(word, freq)` (adds freq to the word's count) and `suggest(prefix, k=3)` returning up to k words that start with prefix, most frequent first, with equal counts in alphabetical order.",
      starter: code('class AutocompleteSystem:', '    def __init__(self):', '        self.freq = {}', '', '    def insert(self, word, freq):', '        pass', '', '    def suggest(self, prefix, k=3):', '        pass'),
      hint: "matches = [w for w in self.freq if w.startswith(prefix)]; sort with key=lambda w: (-self.freq[w], w); return the first k.",
      test: code('ac = AutocompleteSystem()', "ac.insert('react', 100)", "ac.insert('redux', 50)", "ac.insert('reach', 80)", "assert ac.suggest('rea', 2) == ['react', 'reach'], 'Expected [react, reach]'", "assert ac.suggest('r', 5) == ['react', 'reach', 'redux'], 'All three, most frequent first'", "assert ac.suggest('xyz') == [], 'No match gives []'", done),
    },
    a: {
      desc: "Write `rank_suggestions(words, prefix, k)` where words maps each word to how often it was searched. Return the k most searched words that start with prefix, highest count first; equal counts go in alphabetical order.",
      starter: code('def rank_suggestions(words, prefix, k):', '    # Keep words that start with prefix, sort by (-count, word), take the first k', '    pass'),
      hint: "return sorted((w for w in words if w.startswith(prefix)), key=lambda w: (-words[w], w))[:k]",
      test: code("assert rank_suggestions({'avocado': 5, 'apple': 5, 'banana': 9}, 'a', 2) == ['apple', 'avocado'], 'Equal counts go in alphabetical order'", "assert rank_suggestions({'react': 100, 'redux': 50, 'reach': 80, 'vue': 90}, 're', 2) == ['react', 'reach'], 'The 2 most searched re- words'", "assert rank_suggestions({'react': 1}, 'x', 3) == [], 'Nothing starts with x'", done),
    },
  },
  // Day 22: Dijkstra
  {
    e: {
      desc: "Write `dijkstra(graph, start)` returning a dict of the shortest distance from start to every node it can reach. graph maps a node to a list of (neighbour, weight) pairs. Use heapq as the priority queue.",
      starter: code('import heapq', '', '', 'def dijkstra(graph, start):', '    dist = {start: 0}', '    heap = [(0, start)]', '    # Pop the closest node; relax each edge that gives a shorter distance', '    pass'),
      hint: "while heap: d, node = heapq.heappop(heap); skip if d > dist[node]; for nb, w in graph.get(node, []): if d + w < dist.get(nb, inf): update and push.",
      test: code("g = {'A': [('B', 4), ('C', 2)], 'B': [('D', 10)], 'C': [('B', 1), ('D', 5)], 'D': []}", 'dist = dijkstra(g, "A")', "assert dist == {'A': 0, 'B': 3, 'C': 2, 'D': 7}, 'Expected A0 B3 C2 D7'", "assert dijkstra({'X': []}, 'X') == {'X': 0}, 'A lone node is 0 from itself'", done),
    },
    a: {
      desc: "Write `network_delay_time(times, n, k)`: times is a list of [from, to, milliseconds] links between nodes 1..n. Return how long it takes a signal sent from node k to reach every node, or -1 if some node never gets it.",
      starter: code('import heapq', '', '', 'def network_delay_time(times, n, k):', '    graph = {i: [] for i in range(1, n + 1)}', '    for u, v, w in times:', '        graph[u].append((v, w))', '    # Run Dijkstra from k; the answer is the largest distance (or -1)', '    pass'),
      hint: "After Dijkstra: if len(dist) < n: return -1; return max(dist.values()).",
      test: code("assert network_delay_time([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2) == 2, 'Expected 2'", "assert network_delay_time([[1, 2, 1]], 2, 2) == -1, 'Node 1 is never reached from node 2'", done),
    },
  },
  // Day 23: topological sort
  {
    e: {
      desc: "Write `find_order(num_courses, prerequisites)` returning an order to take courses 0..num_courses-1 so every [course, required] pair is respected (Kahn's algorithm), or [] if it is impossible because of a cycle.",
      starter: code('from collections import deque', '', '', 'def find_order(num_courses, prerequisites):', '    in_degree = [0] * num_courses', '    next_courses = [[] for _ in range(num_courses)]', '    for course, required in prerequisites:', '        next_courses[required].append(course)', '        in_degree[course] += 1', '    # Start with courses that need nothing; take them one by one', '    pass'),
      hint: "queue = deque(c for c in range(num_courses) if in_degree[c] == 0); pop, add to order, lower in_degree of the next courses. Return order if it has every course, else [].",
      test: code('order = find_order(4, [[1, 0], [2, 0], [3, 1], [3, 2]])', "assert len(order) == 4 and order[0] == 0 and order[-1] == 3, 'Course 0 first, course 3 last'", "assert find_order(2, [[1, 0], [0, 1]]) == [], 'A cycle makes it impossible'", "assert find_order(1, []) == [0], 'One course'", done),
    },
    a: {
      desc: "Write `can_finish(num_courses, prerequisites)` returning True when all courses can be finished (the prerequisites have no cycle).",
      starter: code('def can_finish(num_courses, prerequisites):', '    # Count how many courses you can take with Kahn\'s algorithm; compare with num_courses', '    pass'),
      hint: "Same as find_order, but return taken == num_courses.",
      test: code("assert can_finish(2, [[1, 0]]) is True, 'A simple chain can be finished'", "assert can_finish(2, [[1, 0], [0, 1]]) is False, 'Two courses that need each other can never be finished'", "assert can_finish(3, [[1, 0], [2, 1]]) is True, 'A chain 0 -> 1 -> 2 can be finished'", done),
    },
  },
  // Day 24: union-find
  {
    e: {
      desc: "Build `UnionFind(n)` for nodes 0..n-1 with `find(x)` (with path compression), `union(x, y)` (joins two groups; returns False if they were already joined) and `connected(x, y)`.",
      starter: code('class UnionFind:', '    def __init__(self, n):', '        self.parent = list(range(n))', '        self.rank = [0] * n', '', '    def find(self, x):', '        pass', '', '    def union(self, x, y):', '        pass', '', '    def connected(self, x, y):', '        pass'),
      hint: "find: if self.parent[x] != x: self.parent[x] = self.find(self.parent[x]); return self.parent[x]. union: attach the lower-rank root under the higher one.",
      test: code('uf = UnionFind(5)', "assert uf.union(0, 1) is True and uf.union(1, 2) is True, 'New joins return True'", "assert uf.connected(0, 2) is True and uf.connected(0, 3) is False, 'Only 0, 1 and 2 are joined'", "assert uf.union(0, 2) is False, 'Joining an existing group returns False'", 'uf.union(3, 4)', "assert uf.connected(3, 4) is True and uf.connected(0, 4) is False, 'Two separate groups'", done),
    },
    a: {
      desc: "Write `find_redundant_connection(edges)` returning the first edge [a, b] that connects two nodes that were already connected (the edge that makes a cycle). Nodes are numbered from 1.",
      starter: code('def find_redundant_connection(edges):', '    parent = {}', '', '    def find(x):', '        parent.setdefault(x, x)', '        if parent[x] != x:', '            parent[x] = find(parent[x])', '        return parent[x]', '', '    # For each edge, join the groups; if they were already the same group, return the edge', '    pass'),
      hint: "for a, b in edges: ra, rb = find(a), find(b); if ra == rb: return [a, b]; parent[ra] = rb.",
      test: code("assert find_redundant_connection([[1, 2], [1, 3], [2, 3]]) == [2, 3], 'Edge [2, 3] closes the cycle'", "assert find_redundant_connection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]) == [1, 4], 'Edge [1, 4] closes the cycle'", done),
    },
  },
  // Day 25: dynamic programming 1
  {
    e: {
      desc: "Write `rob(nums)` returning the most money you can take from houses in a row without taking from two neighbouring houses (dynamic programming, O(1) memory).",
      starter: code('def rob(nums):', '    prev, curr = 0, 0', '    # For each house: best = max(skip it, take it + best from two houses back)', '    pass'),
      hint: "for x in nums: prev, curr = curr, max(curr, prev + x). Return curr.",
      test: code("assert rob([1, 2, 3, 1]) == 4, 'Take houses 1 and 3'", "assert rob([2, 7, 9, 3, 1]) == 12, 'Take 2, 9 and 1'", "assert rob([5]) == 5 and rob([]) == 0, 'One house or none'", done),
    },
    a: {
      desc: "Write `climb_stairs(n)` returning how many different ways there are to climb n steps taking 1 or 2 steps at a time (O(N) time, O(1) memory).",
      starter: code('def climb_stairs(n):', '    a, b = 1, 1  # ways to reach step 0 and step 1', '    pass'),
      hint: "for _ in range(n - 1): a, b = b, a + b. Return b.",
      test: code("assert climb_stairs(5) == 8, '5 steps can be climbed 8 ways'", "assert climb_stairs(1) == 1 and climb_stairs(2) == 2, 'Small cases'", "assert climb_stairs(10) == 89, '10 steps can be climbed 89 ways'", done),
    },
  },
  // Day 26: dynamic programming 2
  {
    e: {
      desc: "Write `coin_change(coins, amount)` returning the fewest coins that add up to amount (each coin can be used many times), or -1 if it is impossible.",
      starter: code('def coin_change(coins, amount):', "    best = [0] + [float('inf')] * amount", '    # best[x] = fewest coins for x; try every coin for every x', '    pass'),
      hint: "for x in range(1, amount + 1): for c in coins: if c <= x: best[x] = min(best[x], best[x - c] + 1). Return -1 if best[amount] is inf.",
      test: code("assert coin_change([1, 2, 5], 11) == 3, '11 = 5 + 5 + 1'", "assert coin_change([2], 3) == -1, '3 cannot be made from 2s'", "assert coin_change([1], 0) == 0, 'Zero needs no coins'", done),
    },
    a: {
      desc: "Write `knapsack(weights, values, capacity)` returning the biggest total value you can carry without going over capacity, using each item at most once (0/1 knapsack).",
      starter: code('def knapsack(weights, values, capacity):', '    best = [0] * (capacity + 1)', '    # For each item, go through capacities from high to low so the item is used once', '    pass'),
      hint: "for w, v in zip(weights, values): for c in range(capacity, w - 1, -1): best[c] = max(best[c], best[c - w] + v). Return best[capacity].",
      test: code("assert knapsack([2, 3, 4, 5], [3, 4, 5, 6], 5) == 7, 'Take the items weighing 2 and 3'", "assert knapsack([1, 1, 1], [10, 20, 30], 2) == 50, 'Take the two most valuable'", "assert knapsack([5], [10], 4) == 0, 'Nothing fits'", done),
    },
  },
  // Day 27: dynamic programming on strings
  {
    e: {
      desc: "Write `longest_common_subsequence(text1, text2)` returning the length of the longest sequence of letters that appears in both texts in the same order (not necessarily next to each other).",
      starter: code('def longest_common_subsequence(text1, text2):', '    rows, cols = len(text1) + 1, len(text2) + 1', '    dp = [[0] * cols for _ in range(rows)]', '    # Same letter -> diagonal + 1; otherwise the best of top and left', '    pass'),
      hint: "for i in range(1, rows): for j in range(1, cols): dp[i][j] = dp[i-1][j-1] + 1 if the letters match else max(dp[i-1][j], dp[i][j-1]).",
      test: code("assert longest_common_subsequence('abcde', 'ace') == 3, 'ace is common'", "assert longest_common_subsequence('abc', 'def') == 0, 'Nothing in common'", "assert longest_common_subsequence('abc', 'abc') == 3, 'Identical texts'", done),
    },
    a: {
      desc: "Write `min_distance(word1, word2)` returning the fewest single-letter inserts, deletes or replacements that turn word1 into word2 (edit distance).",
      starter: code('def min_distance(word1, word2):', '    dp = [[0] * (len(word2) + 1) for _ in range(len(word1) + 1)]', '    # First row and column: turning a word into an empty word; then fill the rest', '    pass'),
      hint: "dp[i][0] = i, dp[0][j] = j; if the letters match dp[i][j] = dp[i-1][j-1], else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).",
      test: code("assert min_distance('horse', 'ros') == 3, 'horse -> ros takes 3 edits'", "assert min_distance('intention', 'execution') == 5, 'intention -> execution takes 5 edits'", "assert min_distance('', 'abc') == 3, 'Three inserts'", done),
    },
  },
  // Day 28: backtracking with pruning
  {
    e: {
      desc: "Write `total_n_queens(n)` returning how many ways n queens can be placed on an n x n board so no two attack each other. Track used columns and both diagonals (row + col and row - col) in sets.",
      starter: code('def total_n_queens(n):', '    cols, diag1, diag2 = set(), set(), set()', '', '    def place(row):', '        # Try each column in this row that is not attacked; count complete boards', '        pass', '', '    return place(0)'),
      hint: "if row == n: return 1; for col in range(n): skip attacked squares; add to the sets; count += place(row + 1); remove from the sets.",
      test: code("assert total_n_queens(4) == 2, '4 queens: 2 solutions'", "assert total_n_queens(1) == 1, '1 queen: 1 solution'", "assert total_n_queens(8) == 92, '8 queens: 92 solutions'", done),
    },
    a: {
      desc: "Write `is_valid_sudoku(board)` returning True when no row, column or 3x3 box of the 9x9 board repeats a digit. Empty cells are '.'. (The board does not need to be solvable.)",
      starter: code('def is_valid_sudoku(board):', '    seen = set()', "    # For each digit remember ('row', r, d), ('col', c, d) and ('box', r // 3, c // 3, d)", '    pass'),
      hint: "If any of the three records is already in seen, return False; otherwise add all three.",
      test: code("empty = [['.'] * 9 for _ in range(9)]", "b = [row[:] for row in empty]", "b[0][0] = '5'", "b[0][1] = '3'", "assert is_valid_sudoku(b) is True, 'A board with 5 and 3 is valid'", "col = [row[:] for row in empty]", "col[0][0] = '5'", "col[4][0] = '5'", "assert is_valid_sudoku(col) is False, 'Two 5s in one column'", "box = [row[:] for row in empty]", "box[0][0] = '7'", "box[2][2] = '7'", "assert is_valid_sudoku(box) is False, 'Two 7s in one 3x3 box'", done),
    },
  },
  // Day 29: bit manipulation
  {
    e: {
      desc: "Write `single_number(nums)` returning the number that appears once when every other number appears twice, in O(N) time and O(1) extra memory, using XOR (^).",
      starter: code('def single_number(nums):', '    result = 0', '    # x ^ x == 0 and x ^ 0 == x, so the pairs cancel out', '    pass'),
      hint: "for x in nums: result ^= x. Return result.",
      test: code("assert single_number([2, 2, 1]) == 1, 'Expected 1'", "assert single_number([4, 1, 2, 1, 2]) == 4, 'Expected 4'", "assert single_number([99]) == 99, 'Expected 99'", done),
    },
    a: {
      desc: "Write `hamming_weight(n)` returning how many 1 bits the whole number n has, using n & (n - 1) to clear the lowest 1 bit each time.",
      starter: code('def hamming_weight(n):', '    count = 0', '    pass'),
      hint: "while n: n &= n - 1; count += 1. Return count.",
      test: code("assert hamming_weight(11) == 3, '11 is 1011: three 1 bits'", "assert hamming_weight(0) == 0, '0 has no 1 bits'", "assert hamming_weight(255) == 8, '255 is eight 1 bits'", done),
    },
  },
  // Day 30: capstone
  {
    e: {
      desc: "Write `find_cheapest_flight(n, flights, src, dst, k)` returning the cheapest price from src to dst with at most k stops, or -1. flights is a list of [from, to, price] between airports 0..n-1. Use Bellman-Ford limited to k + 1 rounds.",
      starter: code('def find_cheapest_flight(n, flights, src, dst, k):', "    cost = [float('inf')] * n", '    cost[src] = 0', '    # Repeat k + 1 times: relax every flight using a copy of the costs from the round before', '    pass'),
      hint: "for _ in range(k + 1): new = cost[:]; for u, v, p in flights: if cost[u] + p < new[v]: new[v] = cost[u] + p; cost = new. Return -1 if cost[dst] is inf.",
      test: code('flights = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]]', "assert find_cheapest_flight(4, flights, 0, 3, 1) == 700, 'With 1 stop: 0 -> 1 -> 3 costs 700'", "assert find_cheapest_flight(4, flights, 0, 3, 2) == 400, 'With 2 stops: 0 -> 1 -> 2 -> 3 costs 400'", "assert find_cheapest_flight(3, [[0, 1, 100], [1, 2, 200]], 0, 2, 0) == -1, 'No direct flight and 0 stops allowed'", done),
    },
    a: {
      desc: "Write `audit_flight_graph(flights)` that summarises a route network: return a dict with 'routes' (number of flights), 'airports' (how many different airports appear) and 'cheapest' (the lowest price, or None when there are no flights). flights is a list of [from, to, price].",
      starter: code('def audit_flight_graph(flights):', "    # Return {'routes': ..., 'airports': ..., 'cheapest': ...}", '    pass'),
      hint: "airports = {a for f in flights for a in f[:2]}; cheapest = min((f[2] for f in flights), default=None).",
      test: code("assert audit_flight_graph([[0, 1, 100], [1, 2, 80], [0, 2, 150]]) == {'routes': 3, 'airports': 3, 'cheapest': 80}, 'Expected 3 routes, 3 airports, cheapest 80'", "assert audit_flight_graph([]) == {'routes': 0, 'airports': 0, 'cheapest': None}, 'An empty network'", done),
    },
  },
];

export const DSA_PYTHON_30_DAYS_CONFIGS: DayConfig[] = DSA_30_DAYS_CONFIGS.map((cfg, i) => {
  const day = DAYS[i];
  return {
    ...cfg,
    eTitle: day.e.title || cfg.eTitle,
    eDesc: day.e.desc,
    eStarter: day.e.starter,
    eHint: day.e.hint,
    eTest: day.e.test,
    aTitle: day.a.title || cfg.aTitle,
    aDesc: day.a.desc,
    aStarter: day.a.starter,
    aHint: day.a.hint,
    aTest: day.a.test,
  };
});

export const DSA_PYTHON_30_DAYS_QUESTS: CourseQuest[] = DSA_PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('dsa-py', idx + 1, cfg)
);
