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
    "eStarter": "function analyzeComplexityTier(f) {\n  // Compare the ratio of operations when doubling input size: ratio ~ 1 -> O(1), ratio ~ 2 -> O(N), ratio ~ 4 -> O(N^2).\n  \n}",
    "eHint": "Compare the ratio of operations when doubling input size: ratio ~ 1 -> O(1), ratio ~ 2 -> O(N), ratio ~ 4 -> O(N^2).",
    "eTest": "if (analyzeComplexityTier(() => 5) !== 'O(1)') throw new Error('Failed O(1) constant tier check');\nif (analyzeComplexityTier(n => 3 * n) !== 'O(N)') throw new Error('Failed O(N) linear tier check');\nif (analyzeComplexityTier(n => n * n) !== 'O(N^2)') throw new Error('Failed O(N^2) quadratic tier check');",
    "aTitle": "Dominant Term Simplifier",
    "aDesc": "Implement `function getDominantTerm(terms)` returning the strictly dominant highest Big-O term.",
    "aStarter": "function getDominantTerm(terms) {\n  // Find the maximum index in the standard Big-O growth hierarchy.\n  \n}",
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
    "eStarter": "class DynamicArray {\n  constructor(initialCapacity = 2) {\n    // Double capacity when size reaches capacity, allocate new buffer, and copy existing elements.\n    \n  }\n  push(val) {\n    // Double capacity when size reaches capacity, allocate new buffer, and copy existing elements.\n    \n  }\n  get(index) {\n    // Double capacity when size reaches capacity, allocate new buffer, and copy existing elements.\n    \n  }\n  size() {\n    // Double capacity when size reaches capacity, allocate new buffer, and copy existing elements.\n    \n  }\n  capacity() {\n    // Double capacity when size reaches capacity, allocate new buffer, and copy existing elements.\n    \n  }\n\n}",
    "eHint": "Double capacity when size reaches capacity, allocate new buffer, and copy existing elements.",
    "eTest": "const da = new DynamicArray(2);\nda.push(10); da.push(20);\nif (da.capacity() !== 2 || da.size() !== 2) throw new Error('Capacity should be 2');\nda.push(30);\nif (da.capacity() !== 4 || da.size() !== 3) throw new Error('Capacity should double to 4');\nif (da.get(0) !== 10 || da.get(2) !== 30) throw new Error('Array elements mismatched');",
    "aTitle": "Array In-Place Element Removal",
    "aDesc": "Implement `function removeElement(nums, val)` that modifies array in-place removing all instances of `val` and returns the new length in O(N) time and O(1) space.",
    "aStarter": "function removeElement(nums, val) {\n  // Use a slow pointer k to write elements that are not equal to val.\n  \n}",
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
    "eStarter": "function reverseList(head) {\n  // Maintain prev, curr, and nextTemp pointers iteratively.\n  \n}",
    "eHint": "Maintain prev, curr, and nextTemp pointers iteratively.",
    "eTest": "const l3 = { val: 3, next: null };\nconst l2 = { val: 2, next: l3 };\nconst l1 = { val: 1, next: l2 };\nconst rev = reverseList(l1);\nif (rev.val !== 3 || rev.next.val !== 2 || rev.next.next.val !== 1 || rev.next.next.next !== null) throw new Error('List reversal failed');",
    "aTitle": "Detect Cycle in Linked List (Floyd's Tortoise and Hare)",
    "aDesc": "Implement `function hasCycle(head)` using Floyd's Two-Pointer Cycle-Finding algorithm in O(N) time and O(1) memory.",
    "aStarter": "function hasCycle(head) {\n  // Advance slow by 1 and fast by 2; if they ever point to the identical node object, a cycle exists.\n  \n}",
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
    "eStarter": "function isValidParentheses(s) {\n  // Push opening brackets; on closing brackets, pop and verify matching pair.\n  \n}",
    "eHint": "Push opening brackets; on closing brackets, pop and verify matching pair.",
    "eTest": "if (isValidParentheses('()[]{}') !== true) throw new Error('Expected true for ()[]{}');\nif (isValidParentheses('(]') !== false) throw new Error('Expected false for (]');\nif (isValidParentheses('([)]') !== false) throw new Error('Expected false for ([)]');\nif (isValidParentheses('{[]}') !== true) throw new Error('Expected true for {[]}');",
    "aTitle": "Next Greater Element (Monotonic Stack)",
    "aDesc": "Implement `function nextGreaterElements(nums)` returning an array where `res[i]` is the next greater integer to the right of `nums[i]`, or -1 if none exists.",
    "aStarter": "function nextGreaterElements(nums) {\n  // Maintain a decreasing stack of array indices. Pop when finding a greater element.\n  \n}",
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
    "eStarter": "class DNode {\n  constructor(key = 0, val = 0) {\n    // Use dummy head/tail sentinel nodes. When an item is accessed or added, move it directly behind head.\n    \n  }\n\n}\nclass LRUCache {\n  constructor(capacity) {\n    // Use dummy head/tail sentinel nodes. When an item is accessed or added, move it directly behind head.\n    \n  }\n  _remove(node) {\n    // Use dummy head/tail sentinel nodes. When an item is accessed or added, move it directly behind head.\n    \n  }\n  _add(node) {\n    // Use dummy head/tail sentinel nodes. When an item is accessed or added, move it directly behind head.\n    \n  }\n  get(key) {\n    // Use dummy head/tail sentinel nodes. When an item is accessed or added, move it directly behind head.\n    \n  }\n  put(key, value) {\n    // Use dummy head/tail sentinel nodes. When an item is accessed or added, move it directly behind head.\n    \n  }\n\n}",
    "eHint": "Use dummy head/tail sentinel nodes. When an item is accessed or added, move it directly behind head.",
    "eTest": "const lru = new LRUCache(2);\nlru.put(1, 100); lru.put(2, 200);\nif (lru.get(1) !== 100) throw new Error('Failed to get key 1');\nlru.put(3, 300);\nif (lru.get(2) !== -1) throw new Error('Key 2 should have been evicted');\nif (lru.get(3) !== 300 || lru.get(1) !== 100) throw new Error('Cache state corrupted');",
    "aTitle": "Verify LRU Eviction Order",
    "aDesc": "Write a test runner function `function verifyLruCapacity(cap, operations)` verifying LRU eviction sequences.",
    "aStarter": "function verifyLruCapacity(cap, ops) {\n  // Execute operations and verify returned values match expected sequence.\n  \n}",
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
    "eStarter": "class CircularQueue {\n  constructor(k) {\n    // Use modulo arithmetic for index advancement without shifting memory.\n    \n  }\n  enQueue(value) {\n    // Use modulo arithmetic for index advancement without shifting memory.\n    \n  }\n  deQueue() {\n    // Use modulo arithmetic for index advancement without shifting memory.\n    \n  }\n  Front() {\n    // Use modulo arithmetic for index advancement without shifting memory.\n    \n  }\n  Rear() {\n    // Use modulo arithmetic for index advancement without shifting memory.\n    \n  }\n  isEmpty() {\n    // Use modulo arithmetic for index advancement without shifting memory.\n    \n  }\n  isFull() {\n    // Use modulo arithmetic for index advancement without shifting memory.\n    \n  }\n\n}",
    "eHint": "Use modulo arithmetic for index advancement without shifting memory.",
    "eTest": "const cq = new CircularQueue(3);\nif (!cq.enQueue(1) || !cq.enQueue(2) || !cq.enQueue(3)) throw new Error('Enqueue failed');\nif (cq.isFull() !== true) throw new Error('Queue should be full');\nif (cq.deQueue() !== true || cq.Front() !== 2) throw new Error('Dequeue failed');\nif (cq.enQueue(4) !== true || cq.Rear() !== 4) throw new Error('Wrap-around enqueue failed');",
    "aTitle": "Implement Stack Using Queues",
    "aDesc": "Implement `class MyStack` with `push()`, `pop()`, `top()`, `empty()` using two standard queues.",
    "aStarter": "class MyStack {\n  constructor() {\n    // Rotate the queue after each push so the newest element is always at front.\n    \n  }\n  push(x) {\n    // Rotate the queue after each push so the newest element is always at front.\n    \n  }\n  pop() {\n    // Rotate the queue after each push so the newest element is always at front.\n    \n  }\n  top() {\n    // Rotate the queue after each push so the newest element is always at front.\n    \n  }\n  empty() {\n    // Rotate the queue after each push so the newest element is always at front.\n    \n  }\n\n}",
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
    "eStarter": "class MyHashMap {\n  constructor() {\n    // Use an array of bucket lists and compute bucket index via key % size.\n    \n  }\n  _hash(key) {\n    // Use an array of bucket lists and compute bucket index via key % size.\n    \n  }\n  put(key, value) {\n    // Use an array of bucket lists and compute bucket index via key % size.\n    \n  }\n  get(key) {\n    // Use an array of bucket lists and compute bucket index via key % size.\n    \n  }\n  remove(key) {\n    // Use an array of bucket lists and compute bucket index via key % size.\n    \n  }\n\n}",
    "eHint": "Use an array of bucket lists and compute bucket index via key % size.",
    "eTest": "const hm = new MyHashMap();\nhm.put(1, 100); hm.put(2, 200);\nif (hm.get(1) !== 100 || hm.get(2) !== 200 || hm.get(3) !== -1) throw new Error('HashMap lookup failed');\nhm.put(2, 250);\nif (hm.get(2) !== 250) throw new Error('HashMap overwrite failed');\nhm.remove(2);\nif (hm.get(2) !== -1) throw new Error('HashMap remove failed');",
    "aTitle": "Two Sum in O(N) Time via Hash Map",
    "aDesc": "Implement `function twoSum(nums, target)` returning indices `[i, j]` such that `nums[i] + nums[j] === target` in single pass O(N) time.",
    "aStarter": "function twoSum(nums, target) {\n  // Check if target - current exists in map before storing current number.\n  \n}",
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
    "eStarter": "function maxArea(height) {\n  // Always advance the pointer with the smaller height, as moving the taller one cannot increase area.\n  \n}",
    "eHint": "Always advance the pointer with the smaller height, as moving the taller one cannot increase area.",
    "eTest": "if (maxArea([1,8,6,2,5,4,8,3,7]) !== 49) throw new Error('Expected 49 max water');\nif (maxArea([1,1]) !== 1) throw new Error('Expected 1 max water');",
    "aTitle": "Valid Palindrome with Character Filtering",
    "aDesc": "Implement `function isPalindrome(s)` ignoring case and non-alphanumeric characters using two pointers.",
    "aStarter": "function isPalindrome(s) {\n  // Clean the string and compare from both ends moving inward.\n  \n}",
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
    "eStarter": "function lengthOfLongestSubstring(s) {\n  // Maintain a sliding window [left, right] and update left whenever a duplicate character inside window is found.\n  \n}",
    "eHint": "Maintain a sliding window [left, right] and update left whenever a duplicate character inside window is found.",
    "eTest": "if (lengthOfLongestSubstring('abcabcbb') !== 3) throw new Error('Expected 3 for abcabcbb');\nif (lengthOfLongestSubstring('bbbbb') !== 1) throw new Error('Expected 1 for bbbbb');\nif (lengthOfLongestSubstring('pwwkew') !== 3) throw new Error('Expected 3 for pwwkew');",
    "aTitle": "Maximum Sum Subarray of Fixed Size K",
    "aDesc": "Implement `function maxSubArraySum(nums, k)` returning the maximum sum of any contiguous subarray of size `k`.",
    "aStarter": "function maxSubArraySum(nums, k) {\n  // Subtract outgoing element at left and add incoming element at right.\n  \n}",
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
    "eStarter": "function searchRotated(nums, target) {\n  // Determine which half of the array is sorted and check if target falls within that sorted half.\n  \n}",
    "eHint": "Determine which half of the array is sorted and check if target falls within that sorted half.",
    "eTest": "if (searchRotated([4,5,6,7,0,1,2], 0) !== 4) throw new Error('Target 0 should be at index 4');\nif (searchRotated([4,5,6,7,0,1,2], 3) !== -1) throw new Error('Target 3 should return -1');\nif (searchRotated([1,2,3,4,5], 4) !== 3) throw new Error('Non-rotated array: target 4 should be at index 3');",
    "aTitle": "Find Minimum in Rotated Sorted Array",
    "aDesc": "Implement `function findMin(nums)` returning the minimum element in O(log N) time.",
    "aStarter": "function findMin(nums) {\n  // Compare mid with right to locate the rotation inflection point.\n  \n}",
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
    "eStarter": "function subsets(nums) {\n  // Push current state, iterate remaining choices, recurse, and pop to backtrack.\n  \n}",
    "eHint": "Push current state, iterate remaining choices, recurse, and pop to backtrack.",
    "eTest": "const s = subsets([1, 2, 3]);\nif (s.length !== 8) throw new Error('Power set of 3 elements must have 8 subsets');\nconst e = subsets([]);\nif (e.length !== 1) throw new Error('Empty set has exactly 1 subset: the empty set itself');",
    "aTitle": "Generate All Permutations",
    "aDesc": "Implement `function permute(nums)` returning all N! unique permutations.",
    "aStarter": "function permute(nums) {\n  // Maintain a used map to avoid selecting the same index twice.\n  \n}",
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
    "eStarter": "function mergeSort(arr) {\n  // Split into halves recursively until base case, then merge two sorted arrays.\n  \n}\nfunction merge(left, right) {\n  // Split into halves recursively until base case, then merge two sorted arrays.\n  \n}",
    "eHint": "Split into halves recursively until base case, then merge two sorted arrays.",
    "eTest": "const sorted = mergeSort([38, 27, 43, 3, 9, 82, 10]);\nif (JSON.stringify(sorted) !== JSON.stringify([3, 9, 10, 27, 38, 43, 82])) throw new Error('Merge sort failed');\nif (JSON.stringify(mergeSort([])) !== JSON.stringify([])) throw new Error('Empty array merge sort must return []');",
    "aTitle": "Merge Two Sorted Lists",
    "aDesc": "Implement `function mergeTwoLists(l1, l2)` merging two sorted linked lists.",
    "aStarter": "function mergeTwoLists(l1, l2) {\n  // Use a dummy head pointer and advance the smaller value.\n  \n}",
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
    "eStarter": "function findKthLargest(nums, k) {\n  // Partition around pivot; discard the half that cannot contain the kth target index.\n  \n}",
    "eHint": "Partition around pivot; discard the half that cannot contain the kth target index.",
    "eTest": "if (findKthLargest([3,2,1,5,6,4], 2) !== 5) throw new Error('2nd largest element in [3,2,1,5,6,4] must be 5');\nif (findKthLargest([3,2,3,1,2,4,5,5,6], 4) !== 4) throw new Error('4th largest must be 4');",
    "aTitle": "In-Place Quick Sort",
    "aDesc": "Implement `function quickSort(arr)` sorting in-place using partitioning.",
    "aStarter": "function quickSort(arr, left = 0, right = arr.length - 1) {\n  // Recursively sort left and right partitions around the placed pivot index.\n  \n}",
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
    "eStarter": "function sortColors(nums) {\n  // Use three pointers (low, mid, high) to partition elements into 0s, 1s, and 2s in single pass.\n  \n}",
    "eHint": "Use three pointers (low, mid, high) to partition elements into 0s, 1s, and 2s in single pass.",
    "eTest": "const arr = [2,0,2,1,1,0];\nsortColors(arr);\nif (JSON.stringify(arr) !== JSON.stringify([0,0,1,1,2,2])) throw new Error('Sort colors failed');\nconst arr2 = [2,1,0];\nsortColors(arr2);\nif (JSON.stringify(arr2) !== JSON.stringify([0,1,2])) throw new Error('Reverse sorted input failed');",
    "aTitle": "Counting Sort Frequency Array",
    "aDesc": "Implement `function countingSort(arr, maxVal)` sorting non-negative integers in O(N + K) time.",
    "aStarter": "function countingSort(arr, maxVal) {\n  // Count occurrences and write them back sequentially.\n  \n}",
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
    "eStarter": "class MedianFinder {\n  constructor() {\n    // Maintain sorted bisected array with binary search insertion, or dual min/max heaps.\n    \n  }\n  addNum(num) {\n    // Maintain sorted bisected array with binary search insertion, or dual min/max heaps.\n    \n  }\n  findMedian() {\n    // Maintain sorted bisected array with binary search insertion, or dual min/max heaps.\n    \n  }\n\n}",
    "eHint": "Maintain sorted bisected array with binary search insertion, or dual min/max heaps.",
    "eTest": "const mf = new MedianFinder();\nmf.addNum(1); mf.addNum(2);\nif (mf.findMedian() !== 1.5) throw new Error('Median of [1, 2] should be 1.5');\nmf.addNum(3);\nif (mf.findMedian() !== 2) throw new Error('Median of [1, 2, 3] should be 2');",
    "aTitle": "Verify Streaming Median Sequence",
    "aDesc": "Implement `function computeStreamMedians(nums)` returning an array of running medians after each insertion.",
    "aStarter": "function computeStreamMedians(nums) {\n  // Feed numbers sequentially and record each computed median.\n  \n}",
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
    "eStarter": "function levelOrder(root) {\n  // Use a queue and process nodes level by level using the queue's snapshot length.\n  \n}",
    "eHint": "Use a queue and process nodes level by level using the queue's snapshot length.",
    "eTest": "const tree = { val: 3, left: { val: 9, left: null, right: null }, right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } } };\nconst res = levelOrder(tree);\nif (JSON.stringify(res) !== JSON.stringify([[3], [9, 20], [15, 7]])) throw new Error('Level order traversal failed');\nif (JSON.stringify(levelOrder(null)) !== JSON.stringify([])) throw new Error('Null tree should return empty array');",
    "aTitle": "Maximum Depth of Binary Tree",
    "aDesc": "Implement `function maxDepth(root)` returning the height of the tree in O(N) time.",
    "aStarter": "function maxDepth(root) {\n  // Recursively calculate 1 + max(depth(left), depth(right)).\n  \n}",
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
    "eStarter": "function isValidBST(root, min = -Infinity, max = Infinity) {\n  // Pass down strict (min, max) range boundaries recursively.\n  \n}",
    "eHint": "Pass down strict (min, max) range boundaries recursively.",
    "eTest": "const valid = { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } };\nif (isValidBST(valid) !== true) throw new Error('Valid BST rejected');\nconst invalid = { val: 5, left: { val: 1, left: null, right: null }, right: { val: 4, left: null, right: null } };\nif (isValidBST(invalid) !== false) throw new Error('Invalid BST accepted');\nif (isValidBST(null) !== true) throw new Error('Null tree is a valid BST by convention');",
    "aTitle": "Lowest Common Ancestor in BST",
    "aDesc": "Implement `function lowestCommonAncestor(root, p, q)` in O(H) time.",
    "aStarter": "function lowestCommonAncestor(root, p, q) {\n  // If both p and q are smaller than root, search left; if both larger, search right; otherwise root is LCA.\n  \n}",
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
    "eStarter": "class MinHeap {\n  constructor() {\n    // Use parent index `(i - 1) / 2` and children `2 * i + 1`, `2 * i + 2`.\n    \n  }\n  push(val) {\n    // Use parent index `(i - 1) / 2` and children `2 * i + 1`, `2 * i + 2`.\n    \n  }\n  pop() {\n    // Use parent index `(i - 1) / 2` and children `2 * i + 1`, `2 * i + 2`.\n    \n  }\n  peek() {\n    // Use parent index `(i - 1) / 2` and children `2 * i + 1`, `2 * i + 2`.\n    \n  }\n  size() {\n    // Use parent index `(i - 1) / 2` and children `2 * i + 1`, `2 * i + 2`.\n    \n  }\n  _siftUp(i) {\n    // Use parent index `(i - 1) / 2` and children `2 * i + 1`, `2 * i + 2`.\n    \n  }\n  _siftDown(i) {\n    // Use parent index `(i - 1) / 2` and children `2 * i + 1`, `2 * i + 2`.\n    \n  }\n\n}",
    "eHint": "Use parent index `(i - 1) / 2` and children `2 * i + 1`, `2 * i + 2`.",
    "eTest": "const h = new MinHeap();\nh.push(10); h.push(4); h.push(15); h.push(1);\nif (h.pop() !== 1 || h.pop() !== 4 || h.pop() !== 10 || h.pop() !== 15) throw new Error('MinHeap extraction out of order');",
    "aTitle": "Kth Smallest Element in Array via Heap",
    "aDesc": "Implement `function kthSmallest(nums, k)` using a MinHeap.",
    "aStarter": "function kthSmallest(nums, k) {\n  // Push all elements into MinHeap and pop k times.\n  \n}",
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
    "eStarter": "class TrieNode {\n  constructor() {\n    // Traverse character nodes in hash map children; mark isEnd true on the last node.\n    \n  }\n\n}\nclass Trie {\n  constructor() {\n    // Traverse character nodes in hash map children; mark isEnd true on the last node.\n    \n  }\n  insert(word) {\n    // Traverse character nodes in hash map children; mark isEnd true on the last node.\n    \n  }\n  search(word) {\n    // Traverse character nodes in hash map children; mark isEnd true on the last node.\n    \n  }\n  startsWith(prefix) {\n    // Traverse character nodes in hash map children; mark isEnd true on the last node.\n    \n  }\n\n}",
    "eHint": "Traverse character nodes in hash map children; mark isEnd true on the last node.",
    "eTest": "const trie = new Trie();\ntrie.insert('apple');\nif (trie.search('apple') !== true) throw new Error('Search apple should return true');\nif (trie.search('app') !== false) throw new Error('Search app should return false');\nif (trie.startsWith('app') !== true) throw new Error('startsWith app should return true');",
    "aTitle": "Find All Words with Prefix",
    "aDesc": "Implement `function findWordsWithPrefix(trie, prefix)` returning array of matching dictionary words.",
    "aStarter": "function findWordsWithPrefix(trie, prefix) {\n  // Navigate to the prefix endpoint and run DFS to collect all words.\n  \n}",
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
    "eStarter": "function shortestPathBFS(graph, start, target) {\n  // Use a FIFO queue storing [node, distance] and a Set to track visited nodes.\n  \n}",
    "eHint": "Use a FIFO queue storing [node, distance] and a Set to track visited nodes.",
    "eTest": "const g = { A: ['B', 'C'], B: ['D'], C: ['D'], D: ['E'], E: [] };\nif (shortestPathBFS(g, 'A', 'E') !== 3) throw new Error('Shortest path A->E must be 3 steps');\nif (shortestPathBFS(g, 'A', 'A') !== 0) throw new Error('Same start and target should be distance 0');",
    "aTitle": "Connected Components Count in Undirected Graph",
    "aDesc": "Implement `function countComponents(n, edges)` returning the number of disjoint islands.",
    "aStarter": "function countComponents(n, edges) {\n  // Iterate all vertices; whenever encountering an unvisited vertex, launch BFS and increment component count.\n  \n}",
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
    "eStarter": "class AutocompleteSystem {\n  constructor() {\n    // Filter by prefix, sort by descending frequency (tiebreak alphabetically), and slice top k.\n    \n  }\n  insert(word, freq) {\n    // Filter by prefix, sort by descending frequency (tiebreak alphabetically), and slice top k.\n    \n  }\n  suggest(prefix, k = 3) {\n    // Filter by prefix, sort by descending frequency (tiebreak alphabetically), and slice top k.\n    \n  }\n\n}",
    "eHint": "Filter by prefix, sort by descending frequency (tiebreak alphabetically), and slice top k.",
    "eTest": "const ac = new AutocompleteSystem();\nac.insert('react', 100); ac.insert('redux', 50); ac.insert('reach', 80);\nconst top2 = ac.suggest('rea', 2);\nif (top2[0] !== 'react' || top2[1] !== 'reach') throw new Error('Top 2 suggestions mismatched');",
    "aTitle": "Verify Suggestion Ranking",
    "aDesc": "Use the AutocompleteSystem from the exercise: insert 'apple' and 'avocado' with equal frequency, call suggest('a', 2), and return true only if the result is ['apple', 'avocado'] (alphabetical tiebreak).",
    "aStarter": "function testRank() {\n  // Return true if the auto-complete engine ranks correctly:\n  \n}",
    "aHint": "When two words share the same frequency, the tiebreaker is alphabetical order — 'apple' < 'avocado' lexicographically, so it must appear first in the suggestions list.",
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
    "eStarter": "function dijkstra(graph, start) {\n  // Greedily relax neighbor edge weights and track distances.\n  \n}",
    "eHint": "Greedily relax neighbor edge weights and track distances.",
    "eTest": "const g = { A: [['B', 4], ['C', 2]], B: [['D', 10]], C: [['B', 1], ['D', 5]], D: [] };\nconst dist = dijkstra(g, 'A');\nif (dist.B !== 3 || dist.D !== 7) throw new Error('Dijkstra shortest path calculation incorrect');",
    "aTitle": "Network Delay Time",
    "aDesc": "Implement `function networkDelayTime(times, n, k)` returning time for all nodes to receive signal.",
    "aStarter": "function networkDelayTime(times, n, k) {\n  // Find maximum distance from source k across all n nodes.\n  \n}",
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
    "eStarter": "function findOrder(numCourses, prerequisites) {\n  // Compute in-degrees; enqueue 0-in-degree nodes and decrement neighbor in-degrees on removal.\n  \n}",
    "eHint": "Compute in-degrees; enqueue 0-in-degree nodes and decrement neighbor in-degrees on removal.",
    "eTest": "const order = findOrder(4, [[1,0],[2,0],[3,1],[3,2]]);\nif (order.length !== 4 || order[0] !== 0 || order[3] !== 3) throw new Error('Topological sort order invalid');\nconst cycle = findOrder(2, [[1,0],[0,1]]);\nif (cycle.length !== 0) throw new Error('Cycle should produce empty array');",
    "aTitle": "Course Schedule I (Can Finish Check)",
    "aDesc": "Implement `function canFinish(numCourses, prerequisites)` returning boolean.",
    "aStarter": "function canFinish(numCourses, prerequisites) {\n  // Verify if topological order length equals total number of courses.\n  \n}",
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
    "eStarter": "class UnionFind {\n  constructor(n) {\n    // Compress parent pointers on find(); attach smaller rank tree under larger root.\n    \n  }\n  find(x) {\n    // Compress parent pointers on find(); attach smaller rank tree under larger root.\n    \n  }\n  union(x, y) {\n    // Compress parent pointers on find(); attach smaller rank tree under larger root.\n    \n  }\n  connected(x, y) {\n    // Compress parent pointers on find(); attach smaller rank tree under larger root.\n    \n  }\n\n}",
    "eHint": "Compress parent pointers on find(); attach smaller rank tree under larger root.",
    "eTest": "const uf = new UnionFind(5);\nuf.union(0, 1); uf.union(1, 2);\nif (uf.connected(0, 2) !== true) throw new Error('Nodes 0 and 2 should be connected');\nif (uf.connected(0, 3) !== false) throw new Error('Nodes 0 and 3 should not be connected');",
    "aTitle": "Redundant Connection Finder",
    "aDesc": "Implement `function findRedundantConnection(edges)` returning edge that forms a cycle.",
    "aStarter": "function findRedundantConnection(edges) {\n  // The edge that connects two already-connected nodes creates the cycle.\n  \n}",
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
    "eStarter": "function rob(nums) {\n  // At each house, state transition is `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.\n  \n}",
    "eHint": "At each house, state transition is `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.",
    "eTest": "if (rob([1, 2, 3, 1]) !== 4) throw new Error('Expected 4 (rob house 1 and 3)');\nif (rob([2, 7, 9, 3, 1]) !== 12) throw new Error('Expected 12 (rob 2, 9, 1)');",
    "aTitle": "Climbing Stairs (Fibonacci DP)",
    "aDesc": "Implement `function climbStairs(n)` in O(N) time and O(1) space.",
    "aStarter": "function climbStairs(n) {\n  // dp[i] = dp[i-1] + dp[i-2].\n  \n}",
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
    "eStarter": "function coinChange(coins, amount) {\n  // Initialize DP array with Infinity, set dp[0] = 0, and transition `dp[i] = min(dp[i], dp[i - coin] + 1)`.\n  \n}",
    "eHint": "Initialize DP array with Infinity, set dp[0] = 0, and transition `dp[i] = min(dp[i], dp[i - coin] + 1)`.",
    "eTest": "if (coinChange([1, 2, 5], 11) !== 3) throw new Error('11 cents requires 3 coins (5+5+1)');\nif (coinChange([2], 3) !== -1) throw new Error('3 cents with 2-cent coin is impossible -> -1');",
    "aTitle": "0/1 Knapsack Maximum Value",
    "aDesc": "Implement `function knapsack(weights, values, capacity)` returning max value.",
    "aStarter": "function knapsack(weights, values, capacity) {\n  // Take max between excluding item or including item + value.\n  \n}",
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
    "eStarter": "function longestCommonSubsequence(text1, text2) {\n  // If characters match, take diagonal + 1; otherwise take max of top and left cells.\n  \n}",
    "eHint": "If characters match, take diagonal + 1; otherwise take max of top and left cells.",
    "eTest": "if (longestCommonSubsequence('abcde', 'ace') !== 3) throw new Error('LCS of abcde and ace is 3 (ace)');\nif (longestCommonSubsequence('abc', 'def') !== 0) throw new Error('LCS of abc and def is 0');",
    "aTitle": "Edit Distance (Levenshtein Distance)",
    "aDesc": "Implement `function minDistance(word1, word2)` returning minimum operations.",
    "aStarter": "function minDistance(word1, word2) {\n  // Base cases are string lengths; transition by taking min of insert, delete, replace + 1.\n  \n}",
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
    "eStarter": "function totalNQueens(n) {\n  // Track occupied columns, positive diagonals (r + c), and negative diagonals (r - c) in Sets.\n  \n}",
    "eHint": "Track occupied columns, positive diagonals (r + c), and negative diagonals (r - c) in Sets.",
    "eTest": "if (totalNQueens(4) !== 2) throw new Error('4-Queens has 2 solutions');\nif (totalNQueens(8) !== 92) throw new Error('8-Queens has 92 solutions');",
    "aTitle": "Sudoku Validator",
    "aDesc": "Implement `function isValidSudoku(board)` verifying rows, columns, and 3x3 sub-boxes.",
    "aStarter": "function isValidSudoku(board) {\n  // Check uniqueness across each row, column, and 3x3 box.\n  \n}",
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
    "eStarter": "function singleNumber(nums) {\n  // XOR properties: `A ^ A === 0` and `A ^ 0 === A`. All duplicate pairs cancel out.\n  \n}",
    "eHint": "XOR properties: `A ^ A === 0` and `A ^ 0 === A`. All duplicate pairs cancel out.",
    "eTest": "if (singleNumber([2, 2, 1]) !== 1) throw new Error('Expected 1 for [2, 2, 1]');\nif (singleNumber([4, 1, 2, 1, 2]) !== 4) throw new Error('Expected 4 for [4, 1, 2, 1, 2]');",
    "aTitle": "Number of 1 Bits (Hamming Weight)",
    "aDesc": "Implement `function hammingWeight(n)` counting set bits.",
    "aStarter": "function hammingWeight(n) {\n  // Use n & (n - 1) to clear lowest set bit iteratively.\n  \n}",
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
    "eStarter": "function findCheapestFlight(n, flights, src, dst, k) {\n  // Use Bellman-Ford shortest path algorithm running for at most k + 1 edge relaxation iterations.\n  \n}",
    "eHint": "Use Bellman-Ford shortest path algorithm running for at most k + 1 edge relaxation iterations.",
    "eTest": "const flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]];\nif (findCheapestFlight(4, flights, 0, 3, 1) !== 700) throw new Error('Cheapest flight with 1 stop should be 700 (0->1->3)');\nif (findCheapestFlight(4, flights, 0, 3, 2) !== 400) throw new Error('Cheapest flight with 2 stops should be 400 (0->1->2->3)');",
    "aTitle": "Capstone Flight Telemetry Auditor",
    "aDesc": "Implement `function auditFlightGraph(n, flights)` returning total edges.",
    "aStarter": "function auditFlightGraph(n, flights) {\n  // Return the total number of flight connections (edges) in the graph:\n  \n}",
    "aHint": "Return total flights length.",
    "aTest": "if (auditFlightGraph(4, [[0,1,100],[1,2,100]]) !== 2) throw new Error('Flight audit failed');"
  }
];

export const DSA_30_DAYS_QUESTS: CourseQuest[] = DSA_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('dsa-optim', idx + 1, cfg)
);
