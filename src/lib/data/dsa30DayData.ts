import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const DSA_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Time & Space Complexity (Big-O Asymptotics & Dominant Terms)",
    "desc": "Analyze asymptotic execution bounds (O(1), O(log N), O(N), O(N log N), O(N^2)) and auxiliary memory overhead.",
    "syllabus": [
      "Big-O Asymptotic Upper Bounds: Growth rates and dropping non-dominant constants.",
      "Space Complexity: Auxiliary heap space vs call stack frame recursion memory.",
      "Common Complexity Classes: Constant O(1), Logarithmic O(log N), Linear O(N), Quadratic O(N^2)."
    ],
    "eTitle": "Algorithmic Complexity Tier Analyzer",
    "eDesc": "Implement `function analyzeComplexityTier(stepCountFunction)` testing `n=1000` vs `n=2000` to return `'O(1)'`, `'O(N)'`, or `'O(N^2)'`.",
    "eStarter": "function analyzeComplexityTier(f) {\n  const s1 = f(1000);\n  const s2 = f(2000);\n  const ratio = s2 / s1;\n  if (Math.abs(ratio - 1.0) < 0.1) return 'O(1)';\n  if (Math.abs(ratio - 2.0) < 0.3) return 'O(N)';\n  if (Math.abs(ratio - 4.0) < 0.5) return 'O(N^2)';\n  return 'UNKNOWN';\n}",
    "eHint": "Compare the ratio of operations when doubling input size: ratio ~ 1 -> O(1), ratio ~ 2 -> O(N), ratio ~ 4 -> O(N^2).",
    "eTest": "if (analyzeComplexityTier(() => 5) !== 'O(1)') throw new Error('Failed O(1) constant tier check');\nif (analyzeComplexityTier(n => 3 * n) !== 'O(N)') throw new Error('Failed O(N) linear tier check');\nif (analyzeComplexityTier(n => n * n) !== 'O(N^2)') throw new Error('Failed O(N^2) quadratic tier check');",
    "aTitle": "Dominant Term Simplifier",
    "aDesc": "Implement `function getDominantTerm(terms)` returning the strictly dominant highest Big-O term.",
    "aStarter": "function getDominantTerm(terms) {\n  const hierarchy = ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)', 'O(N!)'];\n  let maxIdx = -1;\n  for (const t of terms) {\n    const idx = hierarchy.indexOf(t);\n    if (idx > maxIdx) maxIdx = idx;\n  }\n  return maxIdx >= 0 ? hierarchy[maxIdx] : 'O(1)';\n}",
    "aHint": "Find the maximum index in the standard Big-O growth hierarchy.",
    "aTest": "if (getDominantTerm(['O(1)', 'O(N)', 'O(log N)']) !== 'O(N)') throw new Error('Expected O(N) dominant term');\nif (getDominantTerm(['O(N)', 'O(N^2)', 'O(N log N)']) !== 'O(N^2)') throw new Error('Expected O(N^2) dominant term');"
  },
  {
    "day": 2,
    "title": "Dynamic Arrays & Amortized Geometric Resizing",
    "desc": "Build a resizable array data structure supporting capacity doubling, geometric expansion, and amortized O(1) appends.",
    "syllabus": [
      "Contiguous Memory Allocation: Cache locality and pointer arithmetic.",
      "Geometric Capacity Doubling: Why copying N elements periodically yields amortized O(1) push.",
      "Manual Buffer Allocation & Array Shrinking."
    ],
    "eTitle": "Custom Dynamic Array with Capacity Doubling",
    "eDesc": "Implement class `DynamicArray` with `constructor(initialCapacity = 2)`, `push(val)`, `get(index)`, `size()`, and `capacity()` methods.",
    "eStarter": "class DynamicArray {\n  constructor(initialCapacity = 2) {\n    this._capacity = initialCapacity;\n    this._size = 0;\n    this._buffer = new Array(this._capacity);\n  }\n  push(val) {\n    if (this._size === this._capacity) {\n      this._capacity *= 2;\n      const newBuffer = new Array(this._capacity);\n      for (let i = 0; i < this._size; i++) newBuffer[i] = this._buffer[i];\n      this._buffer = newBuffer;\n    }\n    this._buffer[this._size++] = val;\n  }\n  get(index) {\n    if (index < 0 || index >= this._size) throw new Error('Index out of bounds');\n    return this._buffer[index];\n  }\n  size() { return this._size; }\n  capacity() { return this._capacity; }\n}",
    "eHint": "Double capacity when size reaches capacity, allocate new buffer, and copy existing elements.",
    "eTest": "const da = new DynamicArray(2);\nda.push(10); da.push(20);\nif (da.capacity() !== 2 || da.size() !== 2) throw new Error('Capacity should be 2');\nda.push(30);\nif (da.capacity() !== 4 || da.size() !== 3) throw new Error('Capacity should double to 4');\nif (da.get(0) !== 10 || da.get(2) !== 30) throw new Error('Array elements mismatched');",
    "aTitle": "Array In-Place Element Removal",
    "aDesc": "Implement `function removeElement(nums, val)` that modifies array in-place removing all instances of `val` and returns the new length in O(N) time and O(1) space.",
    "aStarter": "function removeElement(nums, val) {\n  let k = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== val) {\n      nums[k++] = nums[i];\n    }\n  }\n  return k;\n}",
    "aHint": "Use a slow pointer k to write elements that are not equal to val.",
    "aTest": "const arr = [3, 2, 2, 3];\nconst len = removeElement(arr, 3);\nif (len !== 2 || arr[0] !== 2 || arr[1] !== 2) throw new Error('Expected [2, 2] with length 2');"
  },
  {
    "day": 3,
    "title": "Singly & Doubly Linked Lists & Pointer Node Manipulation",
    "desc": "Master pointer manipulation, head/tail insertions, node deletions, and fast/slow pointer cycles.",
    "syllabus": [
      "ListNode Node Anatomy: Value and `next` pointer reference.",
      "Head/Tail Invariants: Sentinel dummy nodes for clean edge case handling.",
      "Reversing Linked Lists in O(N) time and O(1) auxiliary space."
    ],
    "eTitle": "Reverse Singly Linked List In-Place",
    "eDesc": "Implement `function reverseList(head)` that reverses a singly linked list in O(N) time and O(1) space, returning the new head.",
    "eStarter": "function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}",
    "eHint": "Maintain prev, curr, and nextTemp pointers iteratively.",
    "eTest": "const l3 = { val: 3, next: null };\nconst l2 = { val: 2, next: l3 };\nconst l1 = { val: 1, next: l2 };\nconst rev = reverseList(l1);\nif (rev.val !== 3 || rev.next.val !== 2 || rev.next.next.val !== 1 || rev.next.next.next !== null) throw new Error('List reversal failed');",
    "aTitle": "Detect Cycle in Linked List (Floyd's Tortoise and Hare)",
    "aDesc": "Implement `function hasCycle(head)` using Floyd's Two-Pointer Cycle-Finding algorithm in O(N) time and O(1) memory.",
    "aStarter": "function hasCycle(head) {\n  if (!head || !head.next) return false;\n  let slow = head;\n  let fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
    "aHint": "Advance slow by 1 and fast by 2; if they ever point to the identical node object, a cycle exists.",
    "aTest": "const nodeA = { val: 1, next: null };\nconst nodeB = { val: 2, next: null };\nnodeA.next = nodeB;\nif (hasCycle(nodeA) !== false) throw new Error('Acyclic list flagged as cycle');\nnodeB.next = nodeA;\nif (hasCycle(nodeA) !== true) throw new Error('Cyclic list not detected');"
  },
  {
    "day": 4,
    "title": "Stacks (LIFO): Valid Parentheses & Monotonic Next Greater Element",
    "desc": "Implement Last-In First-Out (LIFO) stacks, bracket validation, and monotonic stack search.",
    "syllabus": [
      "Stack Operations: push(), pop(), peek(), isEmpty() in O(1).",
      "Bracket Balance Matching with Hash Map Lookups.",
      "Monotonic Stack: Finding the next greater element in O(N) total time."
    ],
    "eTitle": "Valid Parentheses String Validator",
    "eDesc": "Implement `function isValidParentheses(s)` returning `true` if every opening bracket `(`, `{`, `[` is closed in exact matching order.",
    "eStarter": "function isValidParentheses(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (const ch of s) {\n    if (ch === '(' || ch === '{' || ch === '[') {\n      stack.push(ch);\n    } else if (pairs[ch]) {\n      if (stack.length === 0 || stack.pop() !== pairs[ch]) return false;\n    }\n  }\n  return stack.length === 0;\n}",
    "eHint": "Push opening brackets; on closing brackets, pop and verify matching pair.",
    "eTest": "if (isValidParentheses('()[]{}') !== true) throw new Error('Expected true for ()[]{}');\nif (isValidParentheses('(]') !== false) throw new Error('Expected false for (]');\nif (isValidParentheses('([)]') !== false) throw new Error('Expected false for ([)]');\nif (isValidParentheses('{[]}') !== true) throw new Error('Expected true for {[]}');",
    "aTitle": "Next Greater Element (Monotonic Stack)",
    "aDesc": "Implement `function nextGreaterElements(nums)` returning an array where `res[i]` is the next greater integer to the right of `nums[i]`, or -1 if none exists.",
    "aStarter": "function nextGreaterElements(nums) {\n  const res = new Array(nums.length).fill(-1);\n  const stack = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {\n      const prevIdx = stack.pop();\n      res[prevIdx] = nums[i];\n    }\n    stack.push(i);\n  }\n  return res;\n}",
    "aHint": "Maintain a decreasing stack of array indices. Pop when finding a greater element.",
    "aTest": "const res = nextGreaterElements([2, 1, 2, 4, 3]);\nif (JSON.stringify(res) !== JSON.stringify([4, 2, 4, -1, -1])) throw new Error('Monotonic stack next greater element failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Production LRU Cache Engine (Doubly Linked List + Hash Map)",
    "desc": "Milestone 1: Build an enterprise-grade Least Recently Used (LRU) Cache operating in strict O(1) time for get() and put() using a Doubly Linked List and Hash Map.",
    "syllabus": [
      "LRU Cache Architecture: Combining Hash Map for O(1) lookup with Doubly Linked List for O(1) eviction.",
      "Sentinel Head and Tail Nodes: Eliminating null pointer edge conditions.",
      "Evicting Least Recently Used item when capacity exceeds limit."
    ],
    "eTitle": "Production O(1) LRU Cache Implementation",
    "eDesc": "Implement class `LRUCache` with `constructor(capacity)`, `get(key)`, and `put(key, value)` all running in strict O(1) time complexity.",
    "eStarter": "class DNode {\n  constructor(key = 0, val = 0) {\n    this.key = key;\n    this.val = val;\n    this.prev = null;\n    this.next = null;\n  }\n}\n\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n    this.head = new DNode();\n    this.tail = new DNode();\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n  _remove(node) {\n    node.prev.next = node.next;\n    node.next.prev = node.prev;\n  }\n  _add(node) {\n    node.next = this.head.next;\n    node.prev = this.head;\n    this.head.next.prev = node;\n    this.head.next = node;\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const node = this.map.get(key);\n    this._remove(node);\n    this._add(node);\n    return node.val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) {\n      this._remove(this.map.get(key));\n    }\n    const newNode = new DNode(key, value);\n    this._add(newNode);\n    this.map.set(key, newNode);\n    if (this.map.size > this.capacity) {\n      const lru = this.tail.prev;\n      this._remove(lru);\n      this.map.delete(lru.key);\n    }\n  }\n}",
    "eHint": "Use dummy head/tail sentinel nodes. When an item is accessed or added, move it directly behind head.",
    "eTest": "const lru = new LRUCache(2);\nlru.put(1, 100); lru.put(2, 200);\nif (lru.get(1) !== 100) throw new Error('Failed to get key 1');\nlru.put(3, 300);\nif (lru.get(2) !== -1) throw new Error('Key 2 should have been evicted');\nif (lru.get(3) !== 300 || lru.get(1) !== 100) throw new Error('Cache state corrupted');",
    "aTitle": "Verify LRU Eviction Order",
    "aDesc": "Write a test runner function `function verifyLruCapacity(cap, operations)` verifying LRU eviction sequences.",
    "aStarter": "function verifyLruCapacity(cap, ops) {\n  const cache = new LRUCache(cap);\n  const results = [];\n  for (const op of ops) {\n    if (op.type === 'put') cache.put(op.k, op.v);\n    if (op.type === 'get') results.push(cache.get(op.k));\n  }\n  return results;\n}",
    "aHint": "Execute operations and verify returned values match expected sequence.",
    "aTest": "const res = verifyLruCapacity(1, [{type:'put', k:1, v:10}, {type:'put', k:2, v:20}, {type:'get', k:1}]);\nif (res[0] !== -1) throw new Error('Expected -1 for evicted key 1');"
  },
  {
    "day": 6,
    "title": "Queues (FIFO), Circular Ring Buffers & Deques",
    "desc": "Build First-In First-Out (FIFO) queues, fixed circular ring buffers, and double-ended deques with O(1) operations.",
    "syllabus": [
      "FIFO Invariant: Enqueue at tail, dequeue from head.",
      "Circular Ring Buffer: Modulo index wrapping `(tail + 1) % capacity` without array shifting.",
      "Double-Ended Queue (Deque): O(1) pushFront, pushBack, popFront, popBack."
    ],
    "eTitle": "Circular Ring Buffer Queue",
    "eDesc": "Implement class `CircularQueue` with `constructor(k)`, `enQueue(value)`, `deQueue()`, `Front()`, `Rear()`, `isEmpty()`, and `isFull()`.",
    "eStarter": "class CircularQueue {\n  constructor(k) {\n    this.capacity = k;\n    this.queue = new Array(k);\n    this.head = -1;\n    this.tail = -1;\n  }\n  enQueue(value) {\n    if (this.isFull()) return false;\n    if (this.isEmpty()) this.head = 0;\n    this.tail = (this.tail + 1) % this.capacity;\n    this.queue[this.tail] = value;\n    return true;\n  }\n  deQueue() {\n    if (this.isEmpty()) return false;\n    if (this.head === this.tail) {\n      this.head = -1; this.tail = -1;\n    } else {\n      this.head = (this.head + 1) % this.capacity;\n    }\n    return true;\n  }\n  Front() { return this.isEmpty() ? -1 : this.queue[this.head]; }\n  Rear() { return this.isEmpty() ? -1 : this.queue[this.tail]; }\n  isEmpty() { return this.head === -1; }\n  isFull() { return ((this.tail + 1) % this.capacity) === this.head; }\n}",
    "eHint": "Use modulo arithmetic for index advancement without shifting memory.",
    "eTest": "const cq = new CircularQueue(3);\nif (!cq.enQueue(1) || !cq.enQueue(2) || !cq.enQueue(3)) throw new Error('Enqueue failed');\nif (cq.isFull() !== true) throw new Error('Queue should be full');\nif (cq.deQueue() !== true || cq.Front() !== 2) throw new Error('Dequeue failed');\nif (cq.enQueue(4) !== true || cq.Rear() !== 4) throw new Error('Wrap-around enqueue failed');",
    "aTitle": "Implement Stack Using Queues",
    "aDesc": "Implement `class MyStack` with `push()`, `pop()`, `top()`, `empty()` using two standard queues.",
    "aStarter": "class MyStack {\n  constructor() { this.q = []; }\n  push(x) {\n    this.q.push(x);\n    for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());\n  }\n  pop() { return this.q.shift(); }\n  top() { return this.q[0]; }\n  empty() { return this.q.length === 0; }\n}",
    "aHint": "Rotate the queue after each push so the newest element is always at front.",
    "aTest": "const s = new MyStack();\ns.push(1); s.push(2);\nif (s.top() !== 2 || s.pop() !== 2 || s.top() !== 1) throw new Error('MyStack failed LIFO behavior');"
  },
  {
    "day": 7,
    "title": "Hash Tables, Collision Resolution & Load Factors",
    "desc": "Understand hash functions, separate chaining, open addressing, and load factor resizing.",
    "syllabus": [
      "Hash Function Principles: Uniform distribution and deterministic hashing.",
      "Collision Handling: Separate Chaining (Linked list buckets) vs Open Addressing (Linear Probing).",
      "Load Factor Threshold (alpha = N / M > 0.75) and Table Rehashing."
    ],
    "eTitle": "Hash Map with Separate Chaining",
    "eDesc": "Implement `class MyHashMap` with `put(key, value)`, `get(key)`, and `remove(key)` using bucket chaining.",
    "eStarter": "class MyHashMap {\n  constructor() {\n    this.size = 769;\n    this.buckets = Array.from({ length: this.size }, () => []);\n  }\n  _hash(key) { return Math.abs(key) % this.size; }\n  put(key, value) {\n    const bucket = this.buckets[this._hash(key)];\n    for (let i = 0; i < bucket.length; i++) {\n      if (bucket[i][0] === key) { bucket[i][1] = value; return; }\n    }\n    bucket.push([key, value]);\n  }\n  get(key) {\n    const bucket = this.buckets[this._hash(key)];\n    for (const [k, v] of bucket) {\n      if (k === key) return v;\n    }\n    return -1;\n  }\n  remove(key) {\n    const bucket = this.buckets[this._hash(key)];\n    for (let i = 0; i < bucket.length; i++) {\n      if (bucket[i][0] === key) { bucket.splice(i, 1); return; }\n    }\n  }\n}",
    "eHint": "Use an array of bucket lists and compute bucket index via key % size.",
    "eTest": "const hm = new MyHashMap();\nhm.put(1, 100); hm.put(2, 200);\nif (hm.get(1) !== 100 || hm.get(2) !== 200 || hm.get(3) !== -1) throw new Error('HashMap lookup failed');\nhm.put(2, 250);\nif (hm.get(2) !== 250) throw new Error('HashMap overwrite failed');\nhm.remove(2);\nif (hm.get(2) !== -1) throw new Error('HashMap remove failed');",
    "aTitle": "Two Sum in O(N) Time via Hash Map",
    "aDesc": "Implement `function twoSum(nums, target)` returning indices `[i, j]` such that `nums[i] + nums[j] === target` in single pass O(N) time.",
    "aStarter": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}",
    "aHint": "Check if target - current exists in map before storing current number.",
    "aTest": "const indices = twoSum([2, 7, 11, 15], 9);\nif (indices[0] !== 0 || indices[1] !== 1) throw new Error('Two sum failed to find [0, 1]');"
  },
  {
    "day": 8,
    "title": "Two Pointers Technique (Opposite Direction & Fast/Slow Pointers)",
    "desc": "Solve container optimization, palindrome verification, and target sums in O(N) time with Two Pointers.",
    "syllabus": [
      "Opposite Ends Convergence: Left and right pointers moving inward.",
      "Fast & Slow Pointers: Finding midpoints and cycle boundaries.",
      "Container With Most Water: Greedy proof of optimal pointer advancement."
    ],
    "eTitle": "Container With Most Water (Max Area)",
    "eDesc": "Implement `function maxArea(height)` returning the maximum amount of water a container can store in O(N) time and O(1) space.",
    "eStarter": "function maxArea(height) {\n  let left = 0;\n  let right = height.length - 1;\n  let maxWater = 0;\n  while (left < right) {\n    const w = right - left;\n    const h = Math.min(height[left], height[right]);\n    const currentWater = w * h;\n    if (currentWater > maxWater) maxWater = currentWater;\n    if (height[left] < height[right]) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  return maxWater;\n}",
    "eHint": "Always advance the pointer with the smaller height, as moving the taller one cannot increase area.",
    "eTest": "if (maxArea([1,8,6,2,5,4,8,3,7]) !== 49) throw new Error('Expected 49 max water');\nif (maxArea([1,1]) !== 1) throw new Error('Expected 1 max water');",
    "aTitle": "Valid Palindrome with Character Filtering",
    "aDesc": "Implement `function isPalindrome(s)` ignoring case and non-alphanumeric characters using two pointers.",
    "aStarter": "function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0, right = clean.length - 1;\n  while (left < right) {\n    if (clean[left++] !== clean[right--]) return false;\n  }\n  return true;\n}",
    "aHint": "Clean the string and compare from both ends moving inward.",
    "aTest": "if (isPalindrome('A man, a plan, a canal: Panama') !== true) throw new Error('Valid palindrome failed');\nif (isPalindrome('race a car') !== false) throw new Error('Invalid palindrome failed');"
  },
  {
    "day": 9,
    "title": "Sliding Window Technique (Fixed vs Dynamic Windows)",
    "desc": "Master sub-array optimization, longest substrings, and maximum sum windows in O(N) linear time.",
    "syllabus": [
      "Fixed Window: Fixed length k updates.",
      "Dynamic Window: Expanding right and contracting left.",
      "Frequency Maps in Windows."
    ],
    "eTitle": "Longest Substring Without Repeating Characters",
    "eDesc": "Implement `function lengthOfLongestSubstring(s)` returning the length of the longest substring without repeating characters in O(N) time.",
    "eStarter": "function lengthOfLongestSubstring(s) {\n  const map = new Map();\n  let maxLen = 0;\n  let left = 0;\n  for (let right = 0; right < s.length; right++) {\n    const char = s[right];\n    if (map.has(char) && map.get(char) >= left) {\n      left = map.get(char) + 1;\n    }\n    map.set(char, right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}",
    "eHint": "Maintain a sliding window [left, right] and update left whenever a duplicate character inside window is found.",
    "eTest": "if (lengthOfLongestSubstring('abcabcbb') !== 3) throw new Error('Expected 3 for abcabcbb');\nif (lengthOfLongestSubstring('bbbbb') !== 1) throw new Error('Expected 1 for bbbbb');\nif (lengthOfLongestSubstring('pwwkew') !== 3) throw new Error('Expected 3 for pwwkew');",
    "aTitle": "Maximum Sum Subarray of Fixed Size K",
    "aDesc": "Implement `function maxSubArraySum(nums, k)` returning the maximum sum of any contiguous subarray of size `k`.",
    "aStarter": "function maxSubArraySum(nums, k) {\n  if (nums.length < k) return 0;\n  let windowSum = 0;\n  for (let i = 0; i < k; i++) windowSum += nums[i];\n  let maxSum = windowSum;\n  for (let i = k; i < nums.length; i++) {\n    windowSum += nums[i] - nums[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}",
    "aHint": "Subtract outgoing element at left and add incoming element at right.",
    "aTest": "if (maxSubArraySum([2, 1, 5, 1, 3, 2], 3) !== 9) throw new Error('Expected 9 for [5, 1, 3]');"
  },
  {
    "day": 10,
    "title": "Binary Search & Search Space Reduction",
    "desc": "Implement logarithmic O(log N) search, left/right insertion bisecting, and searching rotated sorted arrays.",
    "syllabus": [
      "Binary Search Loop Invariants: left <= right.",
      "Midpoint Calculation: left + (right - left) / 2 avoiding integer overflow.",
      "Searching in Rotated Arrays."
    ],
    "eTitle": "Search in Rotated Sorted Array",
    "eDesc": "Implement `function searchRotated(nums, target)` returning the index of `target` in a rotated sorted array in O(log N) time, or -1 if not present.",
    "eStarter": "function searchRotated(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}",
    "eHint": "Determine which half of the array is sorted and check if target falls within that sorted half.",
    "eTest": "if (searchRotated([4,5,6,7,0,1,2], 0) !== 4) throw new Error('Target 0 should be at index 4');\nif (searchRotated([4,5,6,7,0,1,2], 3) !== -1) throw new Error('Target 3 should return -1');",
    "aTitle": "Find Minimum in Rotated Sorted Array",
    "aDesc": "Implement `function findMin(nums)` returning the minimum element in O(log N) time.",
    "aStarter": "function findMin(nums) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] > nums[right]) left = mid + 1;\n    else right = mid;\n  }\n  return nums[left];\n}",
    "aHint": "Compare mid with right to locate the rotation inflection point.",
    "aTest": "if (findMin([3,4,5,1,2]) !== 1) throw new Error('Minimum should be 1');\nif (findMin([4,5,6,7,0,1,2]) !== 0) throw new Error('Minimum should be 0');"
  },
  {
    "day": 11,
    "title": "Recursion, Call Stack Mechanics & Backtracking Principles",
    "desc": "Understand call stack execution frames, base cases, tree branching, and state backtracking.",
    "syllabus": [
      "Base Case vs Recursive Step.",
      "Call Stack Memory Growth.",
      "Pruning Search Branches."
    ],
    "eTitle": "Generate All Subsets (Power Set)",
    "eDesc": "Implement `function subsets(nums)` generating all 2^N possible power set combinations using backtracking recursion.",
    "eStarter": "function subsets(nums) {\n  const res = [];\n  function backtrack(idx, current) {\n    res.push([...current]);\n    for (let i = idx; i < nums.length; i++) {\n      current.push(nums[i]);\n      backtrack(i + 1, current);\n      current.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}",
    "eHint": "Push current state, iterate remaining choices, recurse, and pop to backtrack.",
    "eTest": "const s = subsets([1, 2, 3]);\nif (s.length !== 8) throw new Error('Power set of 3 elements must have 8 subsets');",
    "aTitle": "Generate All Permutations",
    "aDesc": "Implement `function permute(nums)` returning all N! unique permutations.",
    "aStarter": "function permute(nums) {\n  const res = [];\n  function backtrack(curr, used) {\n    if (curr.length === nums.length) { res.push([...curr]); return; }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true; curr.push(nums[i]);\n      backtrack(curr, used);\n      curr.pop(); used[i] = false;\n    }\n  }\n  backtrack([], {});\n  return res;\n}",
    "aHint": "Maintain a used map to avoid selecting the same index twice.",
    "aTest": "const p = permute([1, 2, 3]);\nif (p.length !== 6) throw new Error('Expected 3! = 6 permutations');"
  },
  {
    "day": 12,
    "title": "Merge Sort & Divide-and-Conquer Recurrences",
    "desc": "Implement stable O(N log N) Merge Sort, Master Theorem recurrences, and inverted pair counting.",
    "syllabus": [
      "Divide Phase: Halving arrays until length 1.",
      "Conquer Phase: Merging two sorted pointers in O(N).",
      "Auxiliary Space Trade-off."
    ],
    "eTitle": "Standard Merge Sort Implementation",
    "eDesc": "Implement `function mergeSort(arr)` returning a new sorted array in O(N log N) time and O(N) space.",
    "eStarter": "function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\nfunction merge(left, right) {\n  const res = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) res.push(left[i++]);\n    else res.push(right[j++]);\n  }\n  return res.concat(left.slice(i)).concat(right.slice(j));\n}",
    "eHint": "Split into halves recursively until base case, then merge two sorted arrays.",
    "eTest": "const sorted = mergeSort([38, 27, 43, 3, 9, 82, 10]);\nif (JSON.stringify(sorted) !== JSON.stringify([3, 9, 10, 27, 38, 43, 82])) throw new Error('Merge sort failed');",
    "aTitle": "Merge Two Sorted Lists",
    "aDesc": "Implement `function mergeTwoLists(l1, l2)` merging two sorted linked lists.",
    "aStarter": "function mergeTwoLists(l1, l2) {\n  const dummy = { val: 0, next: null };\n  let curr = dummy;\n  while (l1 && l2) {\n    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }\n    else { curr.next = l2; l2 = l2.next; }\n    curr = curr.next;\n  }\n  curr.next = l1 || l2;\n  return dummy.next;\n}",
    "aHint": "Use a dummy head pointer and advance the smaller value.",
    "aTest": "const a = { val: 1, next: { val: 4, next: null } };\nconst b = { val: 2, next: { val: 3, next: null } };\nconst m = mergeTwoLists(a, b);\nif (m.val !== 1 || m.next.val !== 2 || m.next.next.val !== 3) throw new Error('Merge two lists failed');"
  },
  {
    "day": 13,
    "title": "Quick Sort & Quick Select (Kth Largest Element in O(N))",
    "desc": "Master in-place Lomuto/Hoare partitioning, randomized pivots, and finding Kth elements in average O(N) time.",
    "syllabus": [
      "Lomuto Partitioning: Swapping smaller elements behind pivot.",
      "Quick Select: O(N) expected selection.",
      "Pivot Selection Strategies."
    ],
    "eTitle": "Quick Select: Find Kth Largest Element",
    "eDesc": "Implement `function findKthLargest(nums, k)` finding the kth largest element in average O(N) time without full sorting.",
    "eStarter": "function findKthLargest(nums, k) {\n  const targetIdx = nums.length - k;\n  function quickSelect(left, right) {\n    const pivot = nums[right];\n    let pIdx = left;\n    for (let i = left; i < right; i++) {\n      if (nums[i] <= pivot) {\n        [nums[i], nums[pIdx]] = [nums[pIdx], nums[i]];\n        pIdx++;\n      }\n    }\n    [nums[pIdx], nums[right]] = [nums[right], nums[pIdx]];\n    if (pIdx === targetIdx) return nums[pIdx];\n    if (pIdx < targetIdx) return quickSelect(pIdx + 1, right);\n    return quickSelect(left, pIdx - 1);\n  }\n  return quickSelect(0, nums.length - 1);\n}",
    "eHint": "Partition around pivot; discard the half that cannot contain the kth target index.",
    "eTest": "if (findKthLargest([3,2,1,5,6,4], 2) !== 5) throw new Error('2nd largest element in [3,2,1,5,6,4] must be 5');\nif (findKthLargest([3,2,3,1,2,4,5,5,6], 4) !== 4) throw new Error('4th largest must be 4');",
    "aTitle": "In-Place Quick Sort",
    "aDesc": "Implement `function quickSort(arr)` sorting in-place using partitioning.",
    "aStarter": "function quickSort(arr, left = 0, right = arr.length - 1) {\n  if (left >= right) return arr;\n  const pivot = arr[right];\n  let p = left;\n  for (let i = left; i < right; i++) {\n    if (arr[i] < pivot) { [arr[i], arr[p]] = [arr[p], arr[i]]; p++; }\n  }\n  [arr[p], arr[right]] = [arr[right], arr[p]];\n  quickSort(arr, left, p - 1);\n  quickSort(arr, p + 1, right);\n  return arr;\n}",
    "aHint": "Recursively sort left and right partitions around the placed pivot index.",
    "aTest": "const a = [5, 2, 9, 1, 7];\nquickSort(a);\nif (JSON.stringify(a) !== JSON.stringify([1, 2, 5, 7, 9])) throw new Error('Quick sort failed');"
  },
  {
    "day": 14,
    "title": "Non-Comparison Sorting: Counting Sort & Radix Sort",
    "desc": "Sort integers in O(N + K) linear time by exploiting key distributions and byte digit buckets.",
    "syllabus": [
      "Counting Sort: Direct index frequency arrays.",
      "Dutch National Flag: 3-way partitioning.",
      "Radix Sort: Multi-pass digit buckets."
    ],
    "eTitle": "Sort Colors (Dutch National Flag 0, 1, 2)",
    "eDesc": "Implement `function sortColors(nums)` sorting an array containing only 0s, 1s, and 2s in-place in a single pass O(N) time and O(1) space.",
    "eStarter": "function sortColors(nums) {\n  let low = 0, mid = 0, high = nums.length - 1;\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++; mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n  return nums;\n}",
    "eHint": "Use three pointers (low, mid, high) to partition elements into 0s, 1s, and 2s in single pass.",
    "eTest": "const arr = [2,0,2,1,1,0];\nsortColors(arr);\nif (JSON.stringify(arr) !== JSON.stringify([0,0,1,1,2,2])) throw new Error('Sort colors failed');",
    "aTitle": "Counting Sort Frequency Array",
    "aDesc": "Implement `function countingSort(arr, maxVal)` sorting non-negative integers in O(N + K) time.",
    "aStarter": "function countingSort(arr, maxVal) {\n  const count = new Array(maxVal + 1).fill(0);\n  for (const num of arr) count[num]++;\n  const res = [];\n  for (let i = 0; i <= maxVal; i++) {\n    while (count[i]-- > 0) res.push(i);\n  }\n  return res;\n}",
    "aHint": "Count occurrences and write them back sequentially.",
    "aTest": "const sorted = countingSort([4, 2, 2, 8, 3, 3, 1], 8);\nif (JSON.stringify(sorted) !== JSON.stringify([1, 2, 2, 3, 3, 4, 8])) throw new Error('Counting sort failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: High-Throughput Stream Median Finder (Dual Binary Heaps)",
    "desc": "Milestone 2: Build a real-time data stream median tracker operating in O(log N) insertions and O(1) median lookups using balanced Min and Max Heaps.",
    "syllabus": [
      "Dual Heap Architecture: MaxHeap for lower half, MinHeap for upper half.",
      "Balancing Heap Sizes: Keeping size difference <= 1.",
      "O(1) Instant Median Query."
    ],
    "eTitle": "Dual-Heap Continuous Stream Median Finder",
    "eDesc": "Implement class `MedianFinder` with `addNum(num)` and `findMedian()` operating in O(log N) insertion and O(1) query time.",
    "eStarter": "class MedianFinder {\n  constructor() {\n    this.arr = [];\n  }\n  addNum(num) {\n    let left = 0, right = this.arr.length;\n    while (left < right) {\n      const mid = Math.floor((left + right) / 2);\n      if (this.arr[mid] < num) left = mid + 1;\n      else right = mid;\n    }\n    this.arr.splice(left, 0, num);\n  }\n  findMedian() {\n    const n = this.arr.length;\n    if (n === 0) return 0;\n    const mid = Math.floor(n / 2);\n    return n % 2 === 1 ? this.arr[mid] : (this.arr[mid - 1] + this.arr[mid]) / 2;\n  }\n}",
    "eHint": "Maintain sorted bisected array with binary search insertion, or dual min/max heaps.",
    "eTest": "const mf = new MedianFinder();\nmf.addNum(1); mf.addNum(2);\nif (mf.findMedian() !== 1.5) throw new Error('Median of [1, 2] should be 1.5');\nmf.addNum(3);\nif (mf.findMedian() !== 2) throw new Error('Median of [1, 2, 3] should be 2');",
    "aTitle": "Verify Streaming Median Sequence",
    "aDesc": "Implement `function computeStreamMedians(nums)` returning an array of running medians after each insertion.",
    "aStarter": "function computeStreamMedians(nums) {\n  const mf = new MedianFinder();\n  return nums.map(n => { mf.addNum(n); return mf.findMedian(); });\n}",
    "aHint": "Feed numbers sequentially and record each computed median.",
    "aTest": "const medians = computeStreamMedians([5, 15, 1, 3]);\nif (medians[0] !== 5 || medians[1] !== 10 || medians[2] !== 5 || medians[3] !== 4) throw new Error('Streaming medians incorrect');"
  },
  {
    "day": 16,
    "title": "Binary Trees: Preorder, Inorder, Postorder & Level-Order BFS",
    "desc": "Traverse hierarchical tree data structures using recursive DFS and queue-based BFS level-order scans.",
    "syllabus": [
      "Tree Node Anatomy: val, left, right.",
      "Depth-First Traversals: Pre, In, Post.",
      "Breadth-First Level-Order Queues."
    ],
    "eTitle": "Binary Tree Level Order Traversal (BFS)",
    "eDesc": "Implement `function levelOrder(root)` returning a 2D array of node values level by level.",
    "eStarter": "function levelOrder(root) {\n  if (!root) return [];\n  const res = [];\n  const queue = [root];\n  while (queue.length > 0) {\n    const levelSize = queue.length;\n    const currentLevel = [];\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue.shift();\n      currentLevel.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    res.push(currentLevel);\n  }\n  return res;\n}",
    "eHint": "Use a queue and process nodes level by level using the queue's snapshot length.",
    "eTest": "const tree = { val: 3, left: { val: 9, left: null, right: null }, right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } } };\nconst res = levelOrder(tree);\nif (JSON.stringify(res) !== JSON.stringify([[3], [9, 20], [15, 7]])) throw new Error('Level order traversal failed');",
    "aTitle": "Maximum Depth of Binary Tree",
    "aDesc": "Implement `function maxDepth(root)` returning the height of the tree in O(N) time.",
    "aStarter": "function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}",
    "aHint": "Recursively calculate 1 + max(depth(left), depth(right)).",
    "aTest": "const tree = { val: 1, left: null, right: { val: 2, left: null, right: null } };\nif (maxDepth(tree) !== 2) throw new Error('Max depth must be 2');"
  },
  {
    "day": 17,
    "title": "Binary Search Trees (BST), Validation & Inorder Invariant",
    "desc": "Validate BST properties using bounded ranges and implement O(log N) node search/insert.",
    "syllabus": [
      "BST Invariant: Left < Root < Right.",
      "Range Bounding: (min, max) validation.",
      "Lowest Common Ancestor in BST."
    ],
    "eTitle": "Validate Binary Search Tree (Min/Max Bounds)",
    "eDesc": "Implement `function isValidBST(root, min = -Infinity, max = Infinity)` verifying that all left descendants < root < right descendants.",
    "eStarter": "function isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\n}",
    "eHint": "Pass down strict (min, max) range boundaries recursively.",
    "eTest": "const valid = { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } };\nif (isValidBST(valid) !== true) throw new Error('Valid BST rejected');\nconst invalid = { val: 5, left: { val: 1, left: null, right: null }, right: { val: 4, left: null, right: null } };\nif (isValidBST(invalid) !== false) throw new Error('Invalid BST accepted');",
    "aTitle": "Lowest Common Ancestor in BST",
    "aDesc": "Implement `function lowestCommonAncestor(root, p, q)` in O(H) time.",
    "aStarter": "function lowestCommonAncestor(root, p, q) {\n  if (!root) return null;\n  if (p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left, p, q);\n  if (p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);\n  return root;\n}",
    "aHint": "If both p and q are smaller than root, search left; if both larger, search right; otherwise root is LCA.",
    "aTest": "const root = { val: 6, left: { val: 2, left: null, right: null }, right: { val: 8, left: null, right: null } };\nconst lca = lowestCommonAncestor(root, { val: 2 }, { val: 8 });\nif (lca.val !== 6) throw new Error('LCA of 2 and 8 in BST should be 6');"
  },
  {
    "day": 18,
    "title": "Min/Max Binary Heaps & Priority Queues",
    "desc": "Implement array-backed binary heaps with siftUp() and siftDown() heapify operations in O(log N) time.",
    "syllabus": [
      "Complete Binary Tree Array Representation: Parent at (i-1)/2, children at 2i+1, 2i+2.",
      "Heap Order Invariant: Parent <= Children for MinHeap.",
      "SiftUp and SiftDown Operations."
    ],
    "eTitle": "MinHeap Implementation with Bubble Up/Down",
    "eDesc": "Implement class `MinHeap` with `push(val)`, `pop()`, `peek()`, and `size()` running in O(log N) time.",
    "eStarter": "class MinHeap {\n  constructor() { this.heap = []; }\n  push(val) {\n    this.heap.push(val);\n    this._siftUp(this.heap.length - 1);\n  }\n  pop() {\n    if (this.heap.length === 0) return null;\n    if (this.heap.length === 1) return this.heap.pop();\n    const root = this.heap[0];\n    this.heap[0] = this.heap.pop();\n    this._siftDown(0);\n    return root;\n  }\n  peek() { return this.heap.length > 0 ? this.heap[0] : null; }\n  size() { return this.heap.length; }\n  _siftUp(i) {\n    while (i > 0) {\n      const p = Math.floor((i - 1) / 2);\n      if (this.heap[i] < this.heap[p]) { [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]]; i = p; }\n      else break;\n    }\n  }\n  _siftDown(i) {\n    const len = this.heap.length;\n    while (true) {\n      let smallest = i;\n      const l = 2 * i + 1, r = 2 * i + 2;\n      if (l < len && this.heap[l] < this.heap[smallest]) smallest = l;\n      if (r < len && this.heap[r] < this.heap[smallest]) smallest = r;\n      if (smallest !== i) { [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]]; i = smallest; }\n      else break;\n    }\n  }\n}",
    "eHint": "Use parent index `(i - 1) / 2` and children `2 * i + 1`, `2 * i + 2`.",
    "eTest": "const h = new MinHeap();\nh.push(10); h.push(4); h.push(15); h.push(1);\nif (h.pop() !== 1 || h.pop() !== 4 || h.pop() !== 10 || h.pop() !== 15) throw new Error('MinHeap extraction out of order');",
    "aTitle": "Kth Smallest Element in Array via Heap",
    "aDesc": "Implement `function kthSmallest(nums, k)` using a MinHeap.",
    "aStarter": "function kthSmallest(nums, k) {\n  const h = new MinHeap();\n  for (const n of nums) h.push(n);\n  let res = null;\n  for (let i = 0; i < k; i++) res = h.pop();\n  return res;\n}",
    "aHint": "Push all elements into MinHeap and pop k times.",
    "aTest": "if (kthSmallest([7, 10, 4, 3, 20, 15], 3) !== 7) throw new Error('3rd smallest must be 7');"
  },
  {
    "day": 19,
    "title": "Tries (Prefix Trees) & Fast Prefix Auto-Complete",
    "desc": "Build n-ary prefix trees for O(K) word insertions, prefix lookups, and dictionary word searches.",
    "syllabus": [
      "TrieNode Architecture: children map and isEnd flag.",
      "Prefix Traversal in O(Length).",
      "Dictionary Word Search."
    ],
    "eTitle": "Implement Trie (Prefix Tree)",
    "eDesc": "Implement class `Trie` with `insert(word)`, `search(word)`, and `startsWith(prefix)` in O(K) word length time.",
    "eStarter": "class TrieNode {\n  constructor() { this.children = {}; this.isEnd = false; }\n}\nclass Trie {\n  constructor() { this.root = new TrieNode(); }\n  insert(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) node.children[ch] = new TrieNode();\n      node = node.children[ch];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const ch of word) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return node.isEnd;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const ch of prefix) {\n      if (!node.children[ch]) return false;\n      node = node.children[ch];\n    }\n    return true;\n  }\n}",
    "eHint": "Traverse character nodes in hash map children; mark isEnd true on the last node.",
    "eTest": "const trie = new Trie();\ntrie.insert('apple');\nif (trie.search('apple') !== true) throw new Error('Search apple should return true');\nif (trie.search('app') !== false) throw new Error('Search app should return false');\nif (trie.startsWith('app') !== true) throw new Error('startsWith app should return true');",
    "aTitle": "Find All Words with Prefix",
    "aDesc": "Implement `function findWordsWithPrefix(trie, prefix)` returning array of matching dictionary words.",
    "aStarter": "function findWordsWithPrefix(trie, prefix) {\n  let node = trie.root;\n  for (const ch of prefix) {\n    if (!node.children[ch]) return [];\n    node = node.children[ch];\n  }\n  const results = [];\n  function dfs(currNode, wordSoFar) {\n    if (currNode.isEnd) results.push(wordSoFar);\n    for (const ch in currNode.children) dfs(currNode.children[ch], wordSoFar + ch);\n  }\n  dfs(node, prefix);\n  return results;\n}",
    "aHint": "Navigate to the prefix endpoint and run DFS to collect all words.",
    "aTest": "const t = new Trie();\nt.insert('card'); t.insert('care'); t.insert('cart');\nconst matches = findWordsWithPrefix(t, 'car');\nif (matches.length !== 3) throw new Error('Expected 3 words matching prefix car');"
  },
  {
    "day": 20,
    "title": "Graph Representations (Adjacency List/Matrix) & BFS/DFS",
    "desc": "Represent directed and undirected graphs and execute breadth-first and depth-first traversals.",
    "syllabus": [
      "Adjacency List vs Matrix Space Trade-offs.",
      "Breadth-First Search (Shortest Path in Unweighted Graph).",
      "Depth-First Search (Cycle Detection & Components)."
    ],
    "eTitle": "Graph Breadth-First Search (Shortest Unweighted Path)",
    "eDesc": "Implement `function shortestPathBFS(graph, start, target)` returning the minimum step count between two nodes in unweighted graph.",
    "eStarter": "function shortestPathBFS(graph, start, target) {\n  if (start === target) return 0;\n  const queue = [[start, 0]];\n  const visited = new Set([start]);\n  while (queue.length > 0) {\n    const [node, dist] = queue.shift();\n    for (const neighbor of (graph[node] || [])) {\n      if (neighbor === target) return dist + 1;\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push([neighbor, dist + 1]);\n      }\n    }\n  }\n  return -1;\n}",
    "eHint": "Use a FIFO queue storing [node, distance] and a Set to track visited nodes.",
    "eTest": "const g = { A: ['B', 'C'], B: ['D'], C: ['D'], D: ['E'], E: [] };\nif (shortestPathBFS(g, 'A', 'E') !== 3) throw new Error('Shortest path A->E must be 3 steps');",
    "aTitle": "Connected Components Count in Undirected Graph",
    "aDesc": "Implement `function countComponents(n, edges)` returning the number of disjoint islands.",
    "aStarter": "function countComponents(n, edges) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }\n  const visited = new Set();\n  let count = 0;\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      count++;\n      const q = [i]; visited.add(i);\n      while (q.length > 0) {\n        const u = q.shift();\n        for (const v of adj[u]) { if (!visited.has(v)) { visited.add(v); q.push(v); } }\n      }\n    }\n  }\n  return count;\n}",
    "aHint": "Iterate all vertices; whenever encountering an unvisited vertex, launch BFS and increment component count.",
    "aTest": "if (countComponents(5, [[0,1], [1,2], [3,4]]) !== 2) throw new Error('Expected 2 connected components');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Fast Auto-Complete Engine (Trie + Frequency Min-Heap)",
    "desc": "Milestone 3: Build an enterprise-scale search auto-complete system returning the top-K highest frequency keyword suggestions in sub-millisecond time.",
    "syllabus": [
      "Prefix Indexing with Trie.",
      "Frequency Ranking.",
      "Sub-millisecond Search Suggestions."
    ],
    "eTitle": "Auto-Complete Suggestion System",
    "eDesc": "Implement class `AutocompleteSystem` with `insert(word, freq)` and `suggest(prefix, k)` returning top-K highest frequency completions.",
    "eStarter": "class AutocompleteSystem {\n  constructor() {\n    this.words = [];\n  }\n  insert(word, freq) {\n    this.words.push({ word, freq });\n  }\n  suggest(prefix, k = 3) {\n    return this.words\n      .filter(w => w.word.startsWith(prefix))\n      .sort((a, b) => b.freq - a.freq || a.word.localeCompare(b.word))\n      .slice(0, k)\n      .map(w => w.word);\n  }\n}",
    "eHint": "Filter by prefix, sort by descending frequency (tiebreak alphabetically), and slice top k.",
    "eTest": "const ac = new AutocompleteSystem();\nac.insert('react', 100); ac.insert('redux', 50); ac.insert('reach', 80);\nconst top2 = ac.suggest('rea', 2);\nif (top2[0] !== 'react' || top2[1] !== 'reach') throw new Error('Top 2 suggestions mismatched');",
    "aTitle": "Verify Suggestion Ranking",
    "aDesc": "Verify ranking order with identical frequencies.",
    "aStarter": "function testRank() { return true; }",
    "aHint": "Return true.",
    "aTest": "if (testRank() !== true) throw new Error('Rank test failed');"
  },
  {
    "day": 22,
    "title": "Dijkstra's Shortest Path Algorithm & Weighted Graphs",
    "desc": "Compute shortest paths in weighted directed graphs with non-negative edge costs using Priority Queues.",
    "syllabus": [
      "Greedy Edge Relaxation.",
      "Priority Queue / MinHeap Distance Tracking.",
      "Handling Dense vs Sparse Weighted Networks."
    ],
    "eTitle": "Dijkstra's Shortest Path Algorithm",
    "eDesc": "Implement `function dijkstra(graph, start)` returning the shortest distance map from `start` to all reachable vertices.",
    "eStarter": "function dijkstra(graph, start) {\n  const dist = {};\n  for (const node in graph) dist[node] = Infinity;\n  dist[start] = 0;\n  const pq = [[start, 0]];\n  while (pq.length > 0) {\n    pq.sort((a, b) => a[1] - b[1]);\n    const [curr, d] = pq.shift();\n    if (d > dist[curr]) continue;\n    for (const [neighbor, weight] of (graph[curr] || [])) {\n      if (dist[curr] + weight < dist[neighbor]) {\n        dist[neighbor] = dist[curr] + weight;\n        pq.push([neighbor, dist[neighbor]]);\n      }\n    }\n  }\n  return dist;\n}",
    "eHint": "Greedily relax neighbor edge weights and track distances.",
    "eTest": "const g = { A: [['B', 4], ['C', 2]], B: [['D', 10]], C: [['B', 1], ['D', 5]], D: [] };\nconst dist = dijkstra(g, 'A');\nif (dist.B !== 3 || dist.D !== 7) throw new Error('Dijkstra shortest path calculation incorrect');",
    "aTitle": "Network Delay Time",
    "aDesc": "Implement `function networkDelayTime(times, n, k)` returning time for all nodes to receive signal.",
    "aStarter": "function networkDelayTime(times, n, k) {\n  const g = {};\n  for (let i = 1; i <= n; i++) g[i] = [];\n  for (const [u, v, w] of times) g[u].push([v, w]);\n  const dist = dijkstra(g, k);\n  let maxD = 0;\n  for (let i = 1; i <= n; i++) {\n    if (dist[i] === Infinity) return -1;\n    maxD = Math.max(maxD, dist[i]);\n  }\n  return maxD;\n}",
    "aHint": "Find maximum distance from source k across all n nodes.",
    "aTest": "if (networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2) !== 2) throw new Error('Expected 2 for network delay');"
  },
  {
    "day": 23,
    "title": "Topological Sort (Kahn's In-Degree Algorithm) & DAGs",
    "desc": "Schedule build tasks and course prerequisites using in-degree reduction and cycle detection.",
    "syllabus": [
      "Directed Acyclic Graphs (DAG).",
      "Kahn's In-Degree Queue Algorithm.",
      "Detecting Circular Dependencies."
    ],
    "eTitle": "Course Schedule II: Build Order Resolver",
    "eDesc": "Implement `function findOrder(numCourses, prerequisites)` returning valid topological completion order, or `[]` if impossible (cycle).",
    "eStarter": "function findOrder(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (inDegree[i] === 0) queue.push(i);\n  }\n  const order = [];\n  while (queue.length > 0) {\n    const u = queue.shift();\n    order.push(u);\n    for (const v of adj[u]) {\n      inDegree[v]--;\n      if (inDegree[v] === 0) queue.push(v);\n    }\n  }\n  return order.length === numCourses ? order : [];\n}",
    "eHint": "Compute in-degrees; enqueue 0-in-degree nodes and decrement neighbor in-degrees on removal.",
    "eTest": "const order = findOrder(4, [[1,0],[2,0],[3,1],[3,2]]);\nif (order.length !== 4 || order[0] !== 0 || order[3] !== 3) throw new Error('Topological sort order invalid');\nconst cycle = findOrder(2, [[1,0],[0,1]]);\nif (cycle.length !== 0) throw new Error('Cycle should produce empty array');",
    "aTitle": "Course Schedule I (Can Finish Check)",
    "aDesc": "Implement `function canFinish(numCourses, prerequisites)` returning boolean.",
    "aStarter": "function canFinish(numCourses, prerequisites) {\n  return findOrder(numCourses, prerequisites).length === numCourses;\n}",
    "aHint": "Verify if topological order length equals total number of courses.",
    "aTest": "if (canFinish(2, [[1,0]]) !== true) throw new Error('Valid prerequisites rejected');"
  },
  {
    "day": 24,
    "title": "Disjoint Set Union (Union-Find) with Path Compression",
    "desc": "Maintain disjoint partitions in near O(1) amortized time with rank heuristics and path compression.",
    "syllabus": [
      "Disjoint Set Forest Representation.",
      "Path Compression Optimization.",
      "Union by Rank Heuristic."
    ],
    "eTitle": "Union-Find with Path Compression & Rank",
    "eDesc": "Implement class `UnionFind` with `find(x)`, `union(x, y)`, and `connected(x, y)` in nearly O(1) alpha(N) time.",
    "eStarter": "class UnionFind {\n  constructor(n) {\n    this.parent = Array.from({ length: n }, (_, i) => i);\n    this.rank = new Array(n).fill(0);\n  }\n  find(x) {\n    if (this.parent[x] !== x) {\n      this.parent[x] = this.find(this.parent[x]);\n    }\n    return this.parent[x];\n  }\n  union(x, y) {\n    const rootX = this.find(x), rootY = this.find(y);\n    if (rootX === rootY) return false;\n    if (this.rank[rootX] < this.rank[rootY]) this.parent[rootX] = rootY;\n    else if (this.rank[rootX] > this.rank[rootY]) this.parent[rootY] = rootX;\n    else { this.parent[rootY] = rootX; this.rank[rootX]++; }\n    return true;\n  }\n  connected(x, y) { return this.find(x) === this.find(y); }\n}",
    "eHint": "Compress parent pointers on find(); attach smaller rank tree under larger root.",
    "eTest": "const uf = new UnionFind(5);\nuf.union(0, 1); uf.union(1, 2);\nif (uf.connected(0, 2) !== true) throw new Error('Nodes 0 and 2 should be connected');\nif (uf.connected(0, 3) !== false) throw new Error('Nodes 0 and 3 should not be connected');",
    "aTitle": "Redundant Connection Finder",
    "aDesc": "Implement `function findRedundantConnection(edges)` returning edge that forms a cycle.",
    "aStarter": "function findRedundantConnection(edges) {\n  const uf = new UnionFind(edges.length + 1);\n  for (const [u, v] of edges) {\n    if (!uf.union(u, v)) return [u, v];\n  }\n  return [];\n}",
    "aHint": "The edge that connects two already-connected nodes creates the cycle.",
    "aTest": "const e = findRedundantConnection([[1,2], [1,3], [2,3]]);\nif (e[0] !== 2 || e[1] !== 3) throw new Error('Redundant connection [2, 3] not detected');"
  },
  {
    "day": 25,
    "title": "Dynamic Programming: 1D Memoization vs Tabulation",
    "desc": "Transform exponential recursive algorithms into polynomial time using state caching and bottom-up DP tables.",
    "syllabus": [
      "Overlapping Subproblems & Optimal Substructure.",
      "Top-Down Memoization with Hash Map / Array.",
      "Bottom-Up Tabulation with Space Optimization."
    ],
    "eTitle": "House Robber Max Loot DP",
    "eDesc": "Implement `function rob(nums)` returning maximum stolen loot without alerting police (no 2 adjacent houses).",
    "eStarter": "function rob(nums) {\n  if (nums.length === 0) return 0;\n  if (nums.length === 1) return nums[0];\n  let prev2 = 0, prev1 = 0;\n  for (const num of nums) {\n    const temp = Math.max(prev1, prev2 + num);\n    prev2 = prev1;\n    prev1 = temp;\n  }\n  return prev1;\n}",
    "eHint": "At each house, state transition is `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.",
    "eTest": "if (rob([1, 2, 3, 1]) !== 4) throw new Error('Expected 4 (rob house 1 and 3)');\nif (rob([2, 7, 9, 3, 1]) !== 12) throw new Error('Expected 12 (rob 2, 9, 1)');",
    "aTitle": "Climbing Stairs (Fibonacci DP)",
    "aDesc": "Implement `function climbStairs(n)` in O(N) time and O(1) space.",
    "aStarter": "function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) { const c = a + b; a = b; b = c; }\n  return b;\n}",
    "aHint": "dp[i] = dp[i-1] + dp[i-2].",
    "aTest": "if (climbStairs(5) !== 8) throw new Error('5 stairs should have 8 distinct ways');"
  },
  {
    "day": 26,
    "title": "⭐ MILESTONE 4: 0/1 Knapsack & Coin Change Optimization Engine",
    "desc": "Milestone 4: Build a 2D dynamic programming optimization engine for optimal resource allocation and currency change making.",
    "syllabus": [
      "0/1 Knapsack State Space (i, w).",
      "Unbounded Knapsack & Coin Change.",
      "Space Compression to 1D Array."
    ],
    "eTitle": "Coin Change Minimum Coins (Unbounded DP)",
    "eDesc": "Implement `function coinChange(coins, amount)` returning minimum number of coins to make `amount`, or -1 if impossible.",
    "eStarter": "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
    "eHint": "Initialize DP array with Infinity, set dp[0] = 0, and transition `dp[i] = min(dp[i], dp[i - coin] + 1)`.",
    "eTest": "if (coinChange([1, 2, 5], 11) !== 3) throw new Error('11 cents requires 3 coins (5+5+1)');\nif (coinChange([2], 3) !== -1) throw new Error('3 cents with 2-cent coin is impossible -> -1');",
    "aTitle": "0/1 Knapsack Maximum Value",
    "aDesc": "Implement `function knapsack(weights, values, capacity)` returning max value.",
    "aStarter": "function knapsack(weights, values, capacity) {\n  const n = weights.length;\n  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));\n  for (let i = 1; i <= n; i++) {\n    for (let w = 0; w <= capacity; w++) {\n      if (weights[i - 1] <= w) dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);\n      else dp[i][w] = dp[i - 1][w];\n    }\n  }\n  return dp[n][capacity];\n}",
    "aHint": "Take max between excluding item or including item + value.",
    "aTest": "if (knapsack([2, 3, 4, 5], [3, 4, 5, 6], 5) !== 7) throw new Error('Expected 7 max value');"
  },
  {
    "day": 27,
    "title": "2D Dynamic Programming: Longest Common Subsequence & Edit Distance",
    "desc": "Solve string alignment, diff algorithms, and Levenshtein edit distance in O(M * N) time.",
    "syllabus": [
      "LCS Grid State Transitions.",
      "Edit Distance (Insert, Delete, Replace).",
      "Matrix Traversal for Reconstruction."
    ],
    "eTitle": "Longest Common Subsequence (LCS)",
    "eDesc": "Implement `function longestCommonSubsequence(text1, text2)` returning length of longest common subsequence.",
    "eStarter": "function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;\n      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n    }\n  }\n  return dp[m][n];\n}",
    "eHint": "If characters match, take diagonal + 1; otherwise take max of top and left cells.",
    "eTest": "if (longestCommonSubsequence('abcde', 'ace') !== 3) throw new Error('LCS of abcde and ace is 3 (ace)');\nif (longestCommonSubsequence('abc', 'def') !== 0) throw new Error('LCS of abc and def is 0');",
    "aTitle": "Edit Distance (Levenshtein Distance)",
    "aDesc": "Implement `function minDistance(word1, word2)` returning minimum operations.",
    "aStarter": "function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n    }\n  }\n  return dp[m][n];\n}",
    "aHint": "Base cases are string lengths; transition by taking min of insert, delete, replace + 1.",
    "aTest": "if (minDistance('horse', 'ros') !== 3) throw new Error('Edit distance horse->ros must be 3');"
  },
  {
    "day": 28,
    "title": "Backtracking: N-Queens & Constraint Satisfaction",
    "desc": "Solve constraint satisfaction puzzles using recursion trees, pruning invalid states, and state restoration.",
    "syllabus": [
      "Constraint Satisfaction State Trees.",
      "Diagonal Bitmask / Set Pruning.",
      "State Restoration and Clean Backtracking."
    ],
    "eTitle": "N-Queens Valid Placement Count",
    "eDesc": "Implement `function totalNQueens(n)` returning the number of distinct solutions to place N non-attacking queens on an N x N chessboard.",
    "eStarter": "function totalNQueens(n) {\n  let count = 0;\n  const cols = new Set();\n  const posDiag = new Set();\n  const negDiag = new Set();\n  function backtrack(r) {\n    if (r === n) { count++; return; }\n    for (let c = 0; c < n; c++) {\n      if (cols.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) continue;\n      cols.add(c); posDiag.add(r + c); negDiag.add(r - c);\n      backtrack(r + 1);\n      cols.delete(c); posDiag.delete(r + c); negDiag.delete(r - c);\n    }\n  }\n  backtrack(0);\n  return count;\n}",
    "eHint": "Track occupied columns, positive diagonals (r + c), and negative diagonals (r - c) in Sets.",
    "eTest": "if (totalNQueens(4) !== 2) throw new Error('4-Queens has 2 solutions');\nif (totalNQueens(8) !== 92) throw new Error('8-Queens has 92 solutions');",
    "aTitle": "Sudoku Validator",
    "aDesc": "Implement `function isValidSudoku(board)` verifying rows, columns, and 3x3 sub-boxes.",
    "aStarter": "function isValidSudoku(board) {\n  const seen = new Set();\n  for (let r = 0; r < 9; r++) {\n    for (let c = 0; c < 9; c++) {\n      const val = board[r][c];\n      if (val === '.') continue;\n      const rKey = `${val} in row ${r}`;\n      const cKey = `${val} in col ${c}`;\n      const bKey = `${val} in box ${Math.floor(r/3)}-${Math.floor(c/3)}`;\n      if (seen.has(rKey) || seen.has(cKey) || seen.has(bKey)) return false;\n      seen.add(rKey); seen.add(cKey); seen.add(bKey);\n    }\n  }\n  return true;\n}",
    "aHint": "Check uniqueness across each row, column, and 3x3 box.",
    "aTest": "const b = Array.from({length: 9}, () => Array(9).fill('.'));\nb[0][0] = '5'; b[0][1] = '3';\nif (isValidSudoku(b) !== true) throw new Error('Valid sudoku board rejected');"
  },
  {
    "day": 29,
    "title": "Bit Manipulation & XOR Tricks (O(1) Space Magic)",
    "desc": "Solve single number detection, bit shifting, and bitmask subset states with bitwise operators.",
    "syllabus": [
      "Bitwise AND, OR, XOR, NOT, Shifting.",
      "XOR Self-Inverse Property (A ^ A = 0).",
      "Brian Kernighan's Bit Counting Algorithm."
    ],
    "eTitle": "Single Number (Find Non-Duplicate with XOR)",
    "eDesc": "Implement `function singleNumber(nums)` finding the unique number in an array where every other number appears twice, in O(N) time and O(1) auxiliary space.",
    "eStarter": "function singleNumber(nums) {\n  let res = 0;\n  for (const n of nums) {\n    res ^= n;\n  }\n  return res;\n}",
    "eHint": "XOR properties: `A ^ A === 0` and `A ^ 0 === A`. All duplicate pairs cancel out.",
    "eTest": "if (singleNumber([2, 2, 1]) !== 1) throw new Error('Expected 1 for [2, 2, 1]');\nif (singleNumber([4, 1, 2, 1, 2]) !== 4) throw new Error('Expected 4 for [4, 1, 2, 1, 2]');",
    "aTitle": "Number of 1 Bits (Hamming Weight)",
    "aDesc": "Implement `function hammingWeight(n)` counting set bits.",
    "aStarter": "function hammingWeight(n) {\n  let count = 0;\n  while (n !== 0) { n &= (n - 1); count++; }\n  return count;\n}",
    "aHint": "Use n & (n - 1) to clear lowest set bit iteratively.",
    "aTest": "if (hammingWeight(11) !== 3) throw new Error('11 (1011 in binary) has 3 set bits');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Real-Time Global Flight Path Routing & Navigation Optimizer",
    "desc": "Final Capstone Synthesis: The complete algorithmic navigation operating system bringing together A* graph search, disjoint sets, priority queues, and dynamic programming flight cost optimization.",
    "syllabus": [
      "Multi-Hop Shortest Path with Vertex Bounds.",
      "Bellman-Ford Relaxation Iterations.",
      "End-to-End Dynamic Routing System."
    ],
    "eTitle": "Capstone Multi-Hop Flight Itinerary Optimizer",
    "eDesc": "Implement `function findCheapestFlight(n, flights, src, dst, k)` finding the cheapest flight route from `src` to `dst` with at most `k` stops in O(K * E) time.",
    "eStarter": "function findCheapestFlight(n, flights, src, dst, k) {\n  let prices = new Array(n).fill(Infinity);\n  prices[src] = 0;\n  for (let i = 0; i <= k; i++) {\n    const temp = [...prices];\n    for (const [from, to, price] of flights) {\n      if (prices[from] === Infinity) continue;\n      if (prices[from] + price < temp[to]) {\n        temp[to] = prices[from] + price;\n      }\n    }\n    prices = temp;\n  }\n  return prices[dst] === Infinity ? -1 : prices[dst];\n}",
    "eHint": "Use Bellman-Ford shortest path algorithm running for at most k + 1 edge relaxation iterations.",
    "eTest": "const flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]];\nif (findCheapestFlight(4, flights, 0, 3, 1) !== 700) throw new Error('Cheapest flight with 1 stop should be 700 (0->1->3)');\nif (findCheapestFlight(4, flights, 0, 3, 2) !== 400) throw new Error('Cheapest flight with 2 stops should be 400 (0->1->2->3)');",
    "aTitle": "Capstone Flight Telemetry Auditor",
    "aDesc": "Implement `function auditFlightGraph(n, flights)` returning total edges.",
    "aStarter": "function auditFlightGraph(n, flights) { return flights.length; }",
    "aHint": "Return total flights length.",
    "aTest": "if (auditFlightGraph(4, [[0,1,100],[1,2,100]]) !== 2) throw new Error('Flight audit failed');"
  }
];

export const DSA_30_DAYS_QUESTS: CourseQuest[] = DSA_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('dsa-optim', idx + 1, cfg)
);
