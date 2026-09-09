// src/lib/curriculum/pythonFullStack/batch016.ts
// Single Source of Truth for PINIT BATCH 016: Month 4 · Week 16 · Days 78–82
// Algorithmic Paradigms, Recursion, Sorting Invariants & Composite LRU Cache Architecture
// Pedagogical Flow: UNDERSTAND (Recursion & Call Stack Mechanics) -> APPLY (Divide-and-Conquer Sorting & Stability) -> BUILD (Composite LRU Cache ADT) -> DEBUG (Reference Retention & Boundary Failures) -> TRANSFER (Month 4 Milestone Capstone Assessment)

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  DebuggingChallengeBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_ALGORITHMIC_SYNTHESIS_AND_COMPOSITE = 'comp-pfs-m4-016';

// ── CANONICAL DOMAIN EXCEPTIONS FOR ALGORITHMIC & COMPOSITE STRUCTURES ──
// Used across all instruction, labs, challenges, and assessment contracts:
// 1. AlgorithmicStructureError: Base class for all algorithmic and composite structure invariant failures.
// 2. KeyNotFoundError: Raised when retrieving or peeking a non-existent key in an associative cache.
// 3. UnhashableKeyError: Raised when an unhashable key (e.g. mutable list/dict) is passed to get, put, or contains.
// 4. InvalidCapacityError: Raised when initializing an LRU cache with capacity <= 0.
// 5. EmptyCacheError: Raised when attempting to peek LRU or MRU elements in an empty cache.
// Note: Call stack recursion depth boundaries natively raise Python's standard RecursionError.

// ── DAY 78: UNDERSTAND — Recursion Foundations, the Call Stack & Divide-and-Conquer ──
export const DAY_78_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w16-016',
  dayNumber: 1,
  title: 'Recursion Foundations, the Call Stack & Divide-and-Conquer Invariants',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b16-d78-01',
      type: 'THEORY',
      order: 1,
      title: 'The Mathematical Recursion Contract & Physical Call Stack Mechanics',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand the fundamental computer science mechanics of recursion: self-referential problem decomposition, the three non-negotiable laws of recursive termination, physical stack frame allocation in memory, and runtime-configurable interpreter recursion boundaries.',
      whatItIs: 'Recursion is an algorithmic paradigm where a function solves a problem by calling itself with progressively smaller instances of the same problem until reaching a non-recursive base case. In memory, each recursive invocation allocates a new stack frame containing local variables, return addresses, and parameter bindings on the physical call stack.',
      whyItExists: 'Many computational structures (such as trees, recursive grammar parsing, and divide-and-conquer sorting) are defined recursively. Expressing these problems iteratively requires manual stack maintenance, whereas recursion leverages the call stack runtime directly.',
      problemSolved: 'Eliminates complex manual state tracking when decomposing nested hierarchical problems, providing elegant solutions for divide-and-conquer algorithms.',
      mentalModel: 'The Russian Nesting Doll (Matryoshka): Opening the outer doll reveals a strictly smaller doll of identical shape. You continue opening dolls until reaching the solid innermost doll (the base case), at which point you stop opening and assemble the dolls back together during return unwinding.',
      realWorldUse: 'JSON serialization parsing, filesystem directory traversal, divide-and-conquer algorithms, and tree search.',
      commonMistakes: [
        'Omitting a base case, causing infinite recursive descent and interpreter crash.',
        'Recursive state progression failing to move towards the base case (e.g. passing n instead of n - 1).',
        'Assuming Python supports automatic tail-call elimination; in CPython, every recursive call consumes a call frame.',
      ],
      commonMisconceptions: [
        'Misconception: "Recursion is magical and avoids using extra memory." Reality: Every recursive call allocates a stack frame in RAM, consuming O(k) auxiliary memory proportional to the maximum recursion depth.',
        'Misconception: "Python allows infinite recursion if memory is available." Reality: Python explicitly protects against stack overflow by enforcing an interpreter recursion depth limit. The recursion limit is runtime-configurable; inspect it with sys.getrecursionlimit(). Standard CPython configurations commonly use a value around 1000, but learners must not treat that number as a language guarantee. Exceeding this boundary raises a native RecursionError.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b16-d78-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Tracing Recursive Stack Frame Allocation vs Stack Unwinding',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Traces stack frame creation during recursive descent, execution of the base case condition, and frame unwinding during return.',
      language: 'python',
      codeSnippet: `import sys

def recursive_countdown_sum(n, depth=1):
    """
    Computes the sum of integers from n down to 0 recursively.
    Traces stack frame creation during descent and unwinding during return.
    """
    print(f"  [Descent - Frame {depth}] Entering with n = {n}")
    
    # 1. BASE CASE INVARIANT: Must terminate without further recursive invocation
    if n <= 0:
        print(f"  [Base Case reached at Depth {depth}] n = {n} -> Returning 0")
        return 0
    
    # 2. STATE PROGRESSION INVARIANT: Must strictly reduce input towards base case
    sub_result = recursive_countdown_sum(n - 1, depth + 1)
    
    # 3. UNWINDING PHASE: Compute and propagate result back to caller frame
    total = n + sub_result
    print(f"  [Unwinding - Frame {depth}] Computed {n} + {sub_result} = {total}")
    return total

if __name__ == "__main__":
    current_limit = sys.getrecursionlimit()
    print(f"Configured interpreter recursion limit: {current_limit}")
    
    result = recursive_countdown_sum(4)
    print(f"Final Recursive Sum: {result}")
    assert result == 10
`,
    } as ExampleBlock,
    {
      id: 'blk-b16-d78-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Building a Guarded Recursive Binary Search & Stack Depth Tracker',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Implement recursive_binary_search(arr, target, low=0, high=None, depth=1).',
        'Validate base case: if low > high, target is absent, return -1.',
        'Compute midpoint mid = low + (high - low) // 2.',
        'If arr[mid] == target, return mid.',
        'If target < arr[mid], recurse on left slice (low, mid - 1).',
        'If target > arr[mid], recurse on right slice (mid + 1, high).',
        'Verify maximum call stack depth does not exceed ceil(log2(n)) + 1.',
      ],
      expectedOutcome: 'A clean recursive binary search that finds keys in logarithmic call stack depth without mutating input arrays.',
      starterCode: `def recursive_binary_search(arr, target, low=0, high=None, depth=1):
    # TODO: Initialize high on first call
    # TODO: Implement base case when search space is exhausted
    # TODO: Implement divide-and-conquer step with midpoint
    pass
`,
      hints: [
        'If high is None, initialize high = len(arr) - 1 on the top-level call.',
        'Never slice the array (arr[:mid]) because slicing allocates an O(k) sublist copy, destroying O(log n) space efficiency. Pass indices instead.',
      ],
      solutionReference: `def recursive_binary_search(arr, target, low=0, high=None, depth=1):
    if high is None:
        high = len(arr) - 1
    
    if low > high:
        return -1
    
    mid = low + (high - low) // 2
    if arr[mid] == target:
        return mid
    elif target < arr[mid]:
        return recursive_binary_search(arr, target, low, mid - 1, depth + 1)
    else:
        return recursive_binary_search(arr, target, mid + 1, high, depth + 1)
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b16-d78-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Recursion Depth Boundaries & Call Stack Overflow',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What happens in standard CPython when a recursive function exceeds the limit inspected via sys.getrecursionlimit()?',
      options: [
        'CPython silently allocates virtual memory swap space and continues executing without error.',
        'CPython automatically converts the recursive calls into an iterative while loop using tail-call optimization.',
        'CPython immediately raises a native RecursionError exception to prevent a process-level C stack overflow crash.',
        'CPython truncates the call stack, returning None for all remaining unexecuted frames.',
      ],
      correctIndex: 2,
      explanation: 'CPython enforces a safety ceiling (runtime-configurable via sys.getrecursionlimit(), commonly ~1000 in standard builds). When this depth is reached, the interpreter raises a native RecursionError to prevent exhausting the operating system C call stack.',
      misconceptionIdentified: 'Believing that Python automatically optimizes recursive tail calls or has infinite recursion depth.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 79: APPLY — Comparison Sorting Invariants: Divide-and-Conquer & CPython Sorting ──
export const DAY_79_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w16-016',
  dayNumber: 2,
  title: 'Comparison Sorting Invariants: Divide-and-Conquer & CPython Sorting Realities',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b16-d79-01',
      type: 'THEORY',
      order: 1,
      title: 'The Stability Invariant, Divide-and-Conquer Sorting & CPython Realities',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the formal mechanics of comparison sorting: contrast O(n^2) incremental sorting with O(n log n) divide-and-conquer Merge Sort, formalize the stability invariant, enforce key-only comparison contracts, understand non-mutating sorting design, and explore CPython sorting architecture.',
      whatItIs: 'A comparison sorting algorithm permutes an input sequence into non-decreasing order by evaluating pairwise comparisons. An algorithm is STABLE if and only if elements with equal comparison keys strictly preserve their original relative input order. Merge Sort achieves guaranteed O(n log n) time across all inputs and requires O(n) auxiliary space.',
      whyItExists: 'Multi-attribute tabular sorting (such as sorting records first by timestamp, then by priority) depends entirely on stability. If the second sort is unstable, it shuffles the previously sorted timestamps.',
      problemSolved: 'Guarantees predictable O(n log n) sorting performance without degradation on reverse or adversarial inputs, while preserving relational secondary ordering.',
      mentalModel: 'The Two-Stack Card Sorter: You divide a deck of cards into two halves recursively until you hold single cards. Then, looking only at the top cards of two face-up piles, you pick whichever is smaller. If they are equal, you ALWAYS take from the left pile first, preserving their original order.',
      realWorldUse: 'Database multi-column queries, transaction chronological grouping, and systems software data pipelines.',
      commonMistakes: [
        'Comparing full tuple records during merge instead of comparing ONLY the extracted key, causing TypeError crashes on non-orderable payloads or breaking stability.',
        'Mutating the caller input array in-place when a non-mutating sorting function is contracted.',
        'Repeatedly evaluating an expensive key function during every comparison instead of evaluating it exactly once per element.',
      ],
      commonMisconceptions: [
        'Misconception: "Merge sort can easily sort in-place with O(1) extra space." Reality: Merging two sorted contiguous subarrays requires an auxiliary buffer, incurring an unavoidable O(n) auxiliary space cost.',
        'Misconception: "Python\'s language specification guarantees O(n) auxiliary space for built-in sorting." Reality: Python 3.14 documentation specifies list.sort() as stable, adaptive, with O(n log n) worst-case time (and O(n) comparisons on nearly-sorted data). Internal memory layout and merge strategies belong to CPython rather than a universal language guarantee. Modern CPython sorting uses a Timsort-family adaptive hybrid with a Powersort merge strategy (an internal CPython optimization detail that students are not required to implement).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b16-d79-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Implementing Pure Stable Merge Sort with Key-Only Comparison',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates non-mutating stable merge sort with O(n) decorate phase for once-per-element key evaluation and strict right_key < left_key comparison to preserve stability and avoid comparing unorderable payload items.',
      language: 'python',
      codeSnippet: `def stable_merge_sort(items, key_func=None):
    """
    Non-mutating sorting function: does not modify the input list or its ordering.
    Complexity: O(n log n) time, O(n) auxiliary space.
    Guarantees:
      1. Stability: Equal keys preserve original relative order.
      2. Once-per-element key evaluation: key_func called exactly len(items) times.
      3. Key-only comparison: Never compares payload items directly.
    """
    if len(items) <= 1:
        return list(items)
    
    # 1. DECORATE PHASE: Extract key exactly once per input element
    decorated = [(key_func(x) if key_func is not None else x, x) for x in items]
    
    def _merge_sort_recursive(records):
        if len(records) <= 1:
            return records
        
        mid = len(records) // 2
        left = _merge_sort_recursive(records[:mid])
        right = _merge_sort_recursive(records[mid:])
        
        # Merge step
        merged = []
        i = 0
        j = 0
        
        while i < len(left) and j < len(right):
            left_key, left_item = left[i]
            right_key, right_item = right[j]
            
            # STABILITY INVARIANT: Compare right_key strictly against left_key using '<'
            if right_key < left_key:
                merged.append((right_key, right_item))
                j += 1
            else:
                # left_key <= right_key: When right is NOT strictly smaller,
                # take left to preserve input order. Crucially, left_item and right_item
                # are NEVER compared, preventing TypeError on unorderable objects!
                merged.append((left_key, left_item))
                i += 1
        
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged

    sorted_decorated = _merge_sort_recursive(decorated)
    # 2. UNDECORATE: Return newly allocated list of original items
    return [item for _, item in sorted_decorated]
`,
    } as ExampleBlock,
    {
      id: 'blk-b16-d79-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Verifying Sorting Stability with Unorderable Payload Objects',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Create a list of dictionaries with identical priority keys (e.g. {"priority": 1, "payload": {}}).',
        'Note that in Python, dictionaries cannot be compared with < (raises TypeError).',
        'Run stable_merge_sort(records, key_func=lambda r: r["priority"]).',
        'Verify that sorting completes cleanly without TypeError because only the extracted integer key is compared.',
        'Verify that the output list order exactly matches the input order (stability preserved).',
        'Verify that the original input list is completely unmutated.',
      ],
      expectedOutcome: 'Proof that key-only comparison prevents payload comparison crashes and preserves relative stability.',
      starterCode: `def verify_stability_invariants(sorter_func):
    # TODO: Construct dataset with equal keys and unorderable payloads (e.g. dicts)
    # TODO: Verify stability and input immutability
    pass
`,
      hints: [
        'Take a snapshot before sorting: snapshot = list(items); result = sorter_func(items, key_func=...); assert items == snapshot.',
      ],
      solutionReference: `def verify_stability_invariants(sorter_func):
    # Dicts cannot be compared with < in Python 3!
    items = [
        {"priority": 2, "id": "A", "meta": {"custom": 1}},
        {"priority": 1, "id": "B", "meta": {"custom": 2}},
        {"priority": 2, "id": "C", "meta": {"custom": 3}},
        {"priority": 1, "id": "D", "meta": {"custom": 4}},
    ]
    original_snapshot = [dict(x) for x in items]
    
    # Sort by priority
    result = sorter_func(items, key_func=lambda x: x["priority"])
    
    # Check non-mutating contract
    assert items == original_snapshot, "Original list must not be mutated!"
    assert result is not items, "Must return a newly allocated list!"
    
    # Check sorted ordering and stability
    assert [x["id"] for x in result] == ["B", "D", "A", "C"], "Equal keys must preserve relative order!"
    print("Stability invariant with unorderable payloads fully verified!")
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b16-d79-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Key Extraction & Stability Hazards',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does Python\'s sorting architecture specify that a key function is evaluated exactly once per input item rather than inside the comparison loop?',
      options: [
        'Because Python bytecode cannot invoke functions inside recursive call stacks.',
        'Because key extraction functions can be arbitrarily expensive (e.g. database lookups, regex parsing); evaluating once in an O(n) pre-pass guarantees overall O(n log n) time.',
        'Because Python automatically converts all key functions into static C functions at runtime.',
        'Because key functions are only allowed to return constant integer literals.',
      ],
      correctIndex: 1,
      explanation: 'Evaluating key_func(item) inside the comparison loop would execute up to O(n log n) times, severely degrading performance if key_func is computationally intensive. Calling it exactly once per element in an O(n) pre-pass ensures predictable performance.',
      misconceptionIdentified: 'Believing that sorting comparisons re-evaluate key functions on demand.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 80: BUILD — Composite Data Structures: The Least Recently Used (LRU) Cache ──
export const DAY_80_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w16-016',
  dayNumber: 3,
  title: 'Composite Data Structures: The Least Recently Used (LRU) Cache',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b16-d80-01',
      type: 'THEORY',
      order: 1,
      title: 'The Composite Data Structure Paradigm: Coupling Hash Maps & Linked Lists',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn why composite data structures are required when single ADTs fail to satisfy dual performance contracts. Deconstruct the LRU Cache architecture: combining a Python dictionary for expected O(1) key access with a Doubly Linked List for worst-case O(1) recency promotion and eviction.',
      whatItIs: 'An LRU (Least Recently Used) Cache is a bounded associative data structure that evicts the item that has not been accessed for the longest time when its capacity is exceeded. It achieves expected O(1) lookup and expected O(1) amortized insertion by coupling a hash map (key -> Node pointer) with a doubly linked list with dummy head/tail sentinels.',
      whyItExists: 'A modern Python dictionary preserves insertion order, but insertion order is NOT LRU recency order. A standard dictionary cannot reorder an existing item to the MRU position in O(1) time upon access without popping and re-inserting it, nor does it provide O(1) eviction of the least-recently accessed node without scanning or manual tracking. Coupling with a Doubly Linked List provides worst-case O(1) arbitrary-node promotion to MRU and worst-case O(1) LRU victim detachment.',
      problemSolved: 'Eliminates cache eviction scanning bottlenecks in web servers, database query caches, and operating system page tables.',
      mentalModel: 'The Desk and the Filing Cabinet: The hash map is an index card catalog telling you exactly which shelf a file is on. The doubly linked list is a stack of folders on your desk. When you read a folder, you slide it to the top of the stack (MRU). When the desk is full, you discard the folder at the very bottom (LRU).',
      realWorldUse: 'functools.lru_cache in Python, Redis memory eviction policies, and HTTP browser asset caching.',
      commonMistakes: [
        'Attempting to use a standard list for recency ordering, causing O(n) removals on cache hits.',
        'Failing to update both prev and next pointers when splicing out a doubly linked node, corrupting list integrity.',
        'De-synchronizing the map and linked list during eviction (evicting from list but leaving key in map).',
      ],
      commonMisconceptions: [
        'Misconception: "LRU cache operations are strictly worst-case O(1) in Python." Reality: Doubly linked list node detach and insert operations are strict O(1) worst-case. However, key-to-node association uses a Python dictionary, inheriting expected O(1) lookup and amortized O(1) insertion. LRU complexity assumes key hashing and equality checks have expected O(1) cost and stable hash/equality behavior while the key is stored.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b16-d80-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building LRUCache with Sentinel Nodes & Dual Synchronization',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates composite LRU cache coupling a Python dictionary for expected O(1) key-to-node lookup with a Doubly Linked List with dummy sentinels for O(1) worst-case promotion and eviction.',
      language: 'python',
      codeSnippet: `class AlgorithmicStructureError(Exception):
    pass

class KeyNotFoundError(AlgorithmicStructureError):
    pass

class UnhashableKeyError(AlgorithmicStructureError):
    pass

class InvalidCapacityError(AlgorithmicStructureError):
    pass

class EmptyCacheError(AlgorithmicStructureError):
    pass

class Node:
    """Doubly-linked node storing key, value, and bidirectional pointers."""
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):
        if capacity <= 0:
            raise InvalidCapacityError("Capacity must be positive.")
        self._capacity = capacity
        self._map = {}  # key -> Node
        
        # Sentinels eliminate null-pointer boundary checks:
        # _head.next is Most Recently Used (MRU)
        # _tail.prev is Least Recently Used (LRU)
        self._head = Node(None, None)
        self._tail = Node(None, None)
        self._head.next = self._tail
        self._tail.prev = self._head

    def _validate_key(self, key):
        try:
            hash(key)
        except TypeError:
            raise UnhashableKeyError(f"Key of type {type(key).__name__} is unhashable.")

    def _detach(self, node):
        """Splice node out of linked list in O(1) worst-case time."""
        node.prev.next = node.next
        node.next.prev = node.prev
        node.prev = None
        node.next = None

    def _prepend(self, node):
        """Insert node immediately after _head (MRU) in O(1) worst-case time."""
        node.next = self._head.next
        node.prev = self._head
        self._head.next.prev = node
        self._head.next = node

    def get(self, key):
        self._validate_key(key)
        if key not in self._map:
            raise KeyNotFoundError(f"Key {key!r} not in cache.")
        node = self._map[key]
        self._detach(node)
        self._prepend(node)
        return node.value

    def put(self, key, value):
        self._validate_key(key)
        if key in self._map:
            node = self._map[key]
            node.value = value
            self._detach(node)
            self._prepend(node)
            return

        new_node = Node(key, value)
        self._map[key] = new_node
        self._prepend(new_node)

        if len(self._map) > self._capacity:
            # Evict LRU node (_tail.prev)
            victim = self._tail.prev
            self._detach(victim)
            del self._map[victim.key]

    def peek_lru(self):
        if len(self._map) == 0:
            raise EmptyCacheError("Cache is empty.")
        node = self._tail.prev
        return (node.key, node.value)

    def peek_mru(self):
        if len(self._map) == 0:
            raise EmptyCacheError("Cache is empty.")
        node = self._head.next
        return (node.key, node.value)

    def size(self):
        return len(self._map)

    def capacity(self):
        return self._capacity
`,
    } as ExampleBlock,
    {
      id: 'blk-b16-d80-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Verifying LRU Recency Promotion & None Payload Safety',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Instantiate LRUCache with capacity 2.',
        'Put ("a", 1) and ("b", None). Verify None payload is preserved cleanly.',
        'Access ("a") via get("a"). Verify ("a") is promoted to MRU, shifting ("b") to LRU.',
        'Put ("c", 3). Verify ("b") is evicted as the LRU victim, while ("a") remains.',
        'Verify get("b") raises KeyNotFoundError.',
        'Verify get("a") returns 1 and peek_mru() returns ("c", 3).',
      ],
      expectedOutcome: 'Hands-on verification that get() promotions alter eviction ordering and None payloads are supported.',
      starterCode: `def test_lru_invariants(cache_cls):
    cache = cache_cls(capacity=2)
    # TODO: Verify get promotion, None handling, and capacity eviction
    pass
`,
      hints: [
        'Check peek_lru() before and after get() calls to verify recency transitions.',
      ],
      solutionReference: `def test_lru_invariants(cache_cls):
    cache = cache_cls(capacity=2)
    cache.put("a", 100)
    cache.put("b", None)
    
    assert cache.get("b") is None, "None payload must be retrievable without error!"
    assert cache.peek_mru() == ("b", None)
    assert cache.peek_lru() == ("a", 100)
    
    # Access "a" to promote it to MRU
    assert cache.get("a") == 100
    assert cache.peek_mru() == ("a", 100)
    assert cache.peek_lru() == ("b", None)
    
    # Insert "c", which should evict "b" (LRU)
    cache.put("c", 300)
    assert cache.size() == 2
    assert cache.peek_mru() == ("c", 300)
    assert cache.peek_lru() == ("a", 100)
    
    try:
        cache.get("b")
        assert False, "Should raise KeyNotFoundError"
    except KeyNotFoundError:
        pass
    print("LRU invariants verified!")
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b16-d80-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Sentinels & Dual Structure Synchronization',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What critical architectural failure occurs if an LRU cache removes the LRU node from its Doubly Linked List during eviction but fails to delete the key from its internal dictionary?',
      options: [
        'The cache automatically converts the dictionary into a tuple.',
        'The dictionary continues to report the key as present, returning a detached node with stale pointers, while capacity accounting becomes permanently de-synchronized.',
        'The linked list raises a native RecursionError on subsequent insertions.',
        'Python forces a garbage collection cycle that re-inserts the node at the head.',
      ],
      correctIndex: 1,
      explanation: 'Composite data structures require bidirectional invariant synchronization. If the list evicts a node but the dictionary retains the key, subsequent lookups return detached nodes and len(_map) exceeds capacity.',
      misconceptionIdentified: 'Assuming that modifying one part of a composite structure automatically updates the other.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 81: DEBUG — Algorithmic State Drift, Reference Retention & Link Integrity ──
export const DAY_81_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w16-016',
  dayNumber: 4,
  title: 'Algorithmic State Drift, Reference Retention & Link Integrity Traps',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b16-d81-01',
      type: 'THEORY',
      order: 1,
      title: 'Anatomy of 4 Algorithmic & Composite Invariant Defects',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Analyze four subtle architectural bugs in algorithmic systems: infinite recursion from boundary condition omission, sorting stability inversions, caller input list mutation side-effects, and reference retention / link integrity defects in doubly linked structures.',
      whatItIs: 'Rigorous diagnostic taxonomy of algorithmic defects: 1) Recursion base case failure on empty/singleton inputs; 2) Merge step stability inversion from full tuple comparisons or improper comparison operators; 3) Unintended mutation of caller input arrays during sorting; 4) reference retention and pointer/link integrity defects in composite structures.',
      whyItExists: 'These defects frequently execute without raising standard Python exceptions while corrupting data ordering, retaining stale objects in memory, or silently degrading performance.',
      problemSolved: 'Equips engineers with defensive diagnostic test patterns to verify sorting stability, input immutability, and link integrity.',
      mentalModel: 'The Severed Bridge: When moving a car between two bridges (relinking a doubly linked node), you must connect both the outgoing and incoming support cables (prev and next). If you connect the left cable but forget the right cable, cars drive off the cliff.',
      realWorldUse: 'Debugging caching layers, multi-tenant sorting pipelines, and recursive tree traversals.',
      commonMistakes: [
        'Using right_key <= left_key instead of right_key < left_key, inverting stability when keys are identical.',
        'Calling items.sort() inside merge_sort, violating the non-mutating sorter contract.',
        'Forgetting to clear detached node references (node.prev = None; node.next = None), leading to reference retention defects.',
      ],
      commonMisconceptions: [
        'Misconception: "If my sorter produces sorted outputs, it must be stable." Reality: An unstable sorter produces mathematically sorted outputs; stability is only revealed when sorting composite elements with identical primary keys and observing relative ordering.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b16-d81-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge: Triaging a Broken LRU Cache & Unstable Sorter',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_ALGORITHMIC_SYNTHESIS_AND_COMPOSITE,
      problemDescription: 'An internal analytics cache contains 3 critical defects: (1) Splicing nodes during promotion fails to update node.next.prev, causing broken bidirectional links; (2) Calling put() with an unhashable key crashes with unhandled TypeError; (3) The sorting helper mutates input arrays in-place and compares full tuples, crashing on non-orderable payloads.',
      symptom: 'Cache corruption crashes traversing workers, unhashable keys cause uncaught exceptions, and analytics data is mutated in-place with inverted stability.',
      brokenArtifact: `class BrokenLRUCache:
    def __init__(self, capacity):
        self._capacity = capacity
        self._map = {}
        self._head = None
        self._tail = None

    def put(self, key, value):
        # BUG: No hashability validation, unhandled TypeError
        # BUG: Broken doubly linked list link updates
        self._map[key] = value
`,
      reproductionSteps: [
        'Run cache.put([], 1) -> crashes with raw TypeError instead of UnhashableKeyError.',
        'Insert 3 items into capacity 2 -> tail eviction fails to remove key from _map.',
        'Run merge_sort([{"k": 1}, {"k": 1}]) -> crashes with TypeError: "<" not supported between dicts.',
      ],
      expectedPatch: 'Defend hashability with UnhashableKeyError, maintain dummy head/tail sentinels with verified bidirectional links, and compare strictly right_key < left_key without comparing payload items.',
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b16-d81-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Writing an Invariant Verification Harness for Composite Structures',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Write assert_dll_integrity(cache) validating that traversing from head to tail visits exactly cache.size() nodes.',
        'Validate that traversing backwards from tail to head visits the exact same nodes in reverse order.',
        'Validate that every node in the linked list exists in cache._map, and every entry in cache._map exists in the linked list.',
      ],
      expectedOutcome: 'A comprehensive invariant assertion harness that catches broken links and de-synchronized composite states.',
      starterCode: `def assert_dll_integrity(cache):
    # TODO: Traverse forward from head, backward from tail, and verify map synchronization
    pass
`,
      hints: [
        'Count visited nodes forward: curr = cache._head.next; while curr is not cache._tail: count += 1; curr = curr.next; assert count == cache.size().',
      ],
      solutionReference: `def assert_dll_integrity(cache):
    # 1. Forward traversal
    forward_keys = []
    curr = cache._head.next
    while curr is not cache._tail:
        assert curr is not None, "Encountered premature null pointer!"
        forward_keys.append(curr.key)
        curr = curr.next
    
    assert len(forward_keys) == cache.size(), f"Forward count {len(forward_keys)} != cache size {cache.size()}"
    
    # 2. Backward traversal
    backward_keys = []
    curr = cache._tail.prev
    while curr is not cache._head:
        assert curr is not None, "Encountered premature null pointer!"
        backward_keys.append(curr.key)
        curr = curr.prev
        
    assert list(reversed(forward_keys)) == backward_keys, "Forward and backward traversals do not match!"
    
    # 3. Dual structure synchronization
    assert set(forward_keys) == set(cache._map.keys()), "Map and linked list keys are de-synchronized!"
    for k in forward_keys:
        assert cache._map[k].key == k
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b16-d81-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Stability Inversion Root Cause',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In a merge sort implementation, why does comparing full decorated records (left_key, left_item) <= (right_key, right_item) fail to guarantee sorting stability?',
      options: [
        'Because Python tuples cannot be compared using relational operators.',
        'Because when left_key == right_key, Python falls back to comparing left_item and right_item, which can raise TypeError if items are non-comparable, or reorder items based on payload values.',
        'Because Python tuples always reverse their elements when evaluated.',
        'Because merge sort only works on single integers.',
      ],
      correctIndex: 1,
      explanation: 'Tuple comparison compares index 0 first; if elements at index 0 are equal, Python compares index 1. If payload items are unorderable (like dicts), it crashes with TypeError. If orderable, it reorders equal-keyed items by their payload values, violating the stability contract.',
      misconceptionIdentified: 'Believing that standard tuple comparison preserves original input sequence on key ties.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 82: TRANSFER — Formative Assessment: Month 4 Milestone Synthesis ──
export const DAY_82_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m4-w16-016',
  assessmentCode: 'ASM-PFS-M4-W16-016',
  title: 'Batch 016 Formative Assessment: High-Throughput LRU Eviction Cache & Stable Divide-and-Conquer Engine',
  description: 'Synthesize recursion mechanics, divide-and-conquer sorting invariants, stability contracts, and composite data structure architecture in a mission-critical caching and sorting engine.',
  type: 'CODE',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  difficulty: 'INTERMEDIATE',
  timeLimitMinutes: 95,
  passingScore: 70,
  maxAttempts: 3,
  attemptPolicy: 'LIMITED_BEST',
  targetCompetencyId: COMPETENCY_ID_ALGORITHMIC_SYNTHESIS_AND_COMPOSITE,
  batchId: 'batch-pfs-m4-w16-016',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
  items: [
    {
      id: 'item-b16-01',
      assessmentId: 'asm-pfs-m4-w16-016',
      itemType: 'CODE',
      points: 100,
      order: 1,
      timeEstimateMinutes: 95,
      version: '1.0.0',
      prompt: `Implement two mission-critical data structures and algorithmic components:

TASK A: LRUCache (Composite Hash Map + Doubly Linked List ADT)
Contract & Complexity:
- Initialize with capacity: int. Raise InvalidCapacityError if capacity <= 0.
- Use internal sentinel nodes (_head, _tail) for doubly-linked order.
- get(key): Expected O(1) time.
  - If key is unhashable, raise UnhashableKeyError.
  - If key absent, raise KeyNotFoundError.
  - If key present, promote node to MRU (_head.next) in O(1) time and return value.
  - INVARIANT: None is a valid payload (cache.put("k", None)). Calling cache.get("k") returns None, NOT KeyNotFoundError.
- put(key, value): Expected O(1) amortized time.
  - If key is unhashable, raise UnhashableKeyError.
  - If key exists, update value in-place and promote to MRU. Size does not change.
  - If key absent, insert new node at MRU and into dictionary.
  - If size > capacity, evict LRU node (_tail.prev) and delete key from dictionary in O(1) time.
- peek_lru() -> tuple(key, value) & peek_mru() -> tuple(key, value):
  - Return (key, value) without promoting node. Raise EmptyCacheError if cache is empty.
- size() -> int & capacity() -> int.
Note: LRU complexity assumes key hashing and equality checks have expected O(1) cost and stable hash/equality behavior while the key is stored.

TASK B: StableMergeSorter (Non-Mutating Pure Divide-and-Conquer Sorter)
Contract & Complexity:
- merge_sort(items, key_func=None) -> list:
  - Non-mutating sorting function: does not modify the input list or its ordering. Returns a newly allocated sorted list in O(n log n) time.
  - Evaluates key_func exactly once per input element (O(n) key evaluations total).
  - Preserves the Stability Invariant: Elements with equal keys strictly retain their relative input order.
  - Uses key-only comparison: Compares strictly right_key < left_key; NEVER compares payload items directly. Must sort unorderable items (e.g. dicts) without TypeError.
- is_sorted(items, key_func=None) -> bool:
  - Validates if items is already sorted in O(n) linear time without performing full sorting.

CANONICAL EXCEPTION HIERARCHY:
All classes must raise the canonical exceptions defined below:
  class AlgorithmicStructureError(Exception): pass
  class KeyNotFoundError(AlgorithmicStructureError): pass
  class UnhashableKeyError(AlgorithmicStructureError): pass
  class InvalidCapacityError(AlgorithmicStructureError): pass
  class EmptyCacheError(AlgorithmicStructureError): pass
`,
      starterCode: `class AlgorithmicStructureError(Exception):
    pass

class KeyNotFoundError(AlgorithmicStructureError):
    pass

class UnhashableKeyError(AlgorithmicStructureError):
    pass

class InvalidCapacityError(AlgorithmicStructureError):
    pass

class EmptyCacheError(AlgorithmicStructureError):
    pass

class Node:
    """Starter Scaffolding: Doubly linked list node."""
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):
        if capacity <= 0:
            raise InvalidCapacityError("Capacity must be positive.")
        self._capacity = capacity
        self._map = {}
        # Sentinel dummy head and tail
        self._head = Node(None, None)
        self._tail = Node(None, None)
        self._head.next = self._tail
        self._tail.prev = self._head

    def get(self, key):
        # TODO: Implement expected O(1) lookup, promotion, None safety, and UnhashableKeyError
        pass

    def put(self, key, value):
        # TODO: Implement expected O(1) amortized insertion, update, and eviction
        pass

    def peek_lru(self):
        # TODO: Return (key, value) of LRU item without promoting
        pass

    def peek_mru(self):
        # TODO: Return (key, value) of MRU item without promoting
        pass

    def size(self):
        # TODO: Return size
        pass

    def capacity(self):
        # TODO: Return capacity
        pass

class StableMergeSorter:
    def merge_sort(self, items, key_func=None):
        # TODO: Implement pure non-mutating stable merge sort in O(n log n)
        # TODO: Key function evaluated once per element
        # TODO: Key-only comparison (<) preserving stability for unorderable payloads
        pass

    def is_sorted(self, items, key_func=None):
        # TODO: Check if items is sorted in O(n) linear time
        pass
`,
      solutionCode: `class AlgorithmicStructureError(Exception):
    pass

class KeyNotFoundError(AlgorithmicStructureError):
    pass

class UnhashableKeyError(AlgorithmicStructureError):
    pass

class InvalidCapacityError(AlgorithmicStructureError):
    pass

class EmptyCacheError(AlgorithmicStructureError):
    pass

class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):
        if capacity <= 0:
            raise InvalidCapacityError("Capacity must be positive.")
        self._capacity = capacity
        self._map = {}
        self._head = Node(None, None)
        self._tail = Node(None, None)
        self._head.next = self._tail
        self._tail.prev = self._head

    def _validate_key(self, key):
        try:
            hash(key)
        except TypeError:
            raise UnhashableKeyError(f"Key of type {type(key).__name__} is unhashable.")

    def _detach(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
        node.prev = None
        node.next = None

    def _prepend(self, node):
        node.next = self._head.next
        node.prev = self._head
        self._head.next.prev = node
        self._head.next = node

    def get(self, key):
        self._validate_key(key)
        if key not in self._map:
            raise KeyNotFoundError(f"Key {key!r} not in cache.")
        node = self._map[key]
        self._detach(node)
        self._prepend(node)
        return node.value

    def put(self, key, value):
        self._validate_key(key)
        if key in self._map:
            node = self._map[key]
            node.value = value
            self._detach(node)
            self._prepend(node)
            return

        new_node = Node(key, value)
        self._map[key] = new_node
        self._prepend(new_node)

        if len(self._map) > self._capacity:
            victim = self._tail.prev
            self._detach(victim)
            del self._map[victim.key]

    def peek_lru(self):
        if len(self._map) == 0:
            raise EmptyCacheError("Cache is empty.")
        node = self._tail.prev
        return (node.key, node.value)

    def peek_mru(self):
        if len(self._map) == 0:
            raise EmptyCacheError("Cache is empty.")
        node = self._head.next
        return (node.key, node.value)

    def size(self):
        return len(self._map)

    def capacity(self):
        return self._capacity

class StableMergeSorter:
    def merge_sort(self, *args, **kwargs):
        if len(args) == 0:
            return []
        if isinstance(self, StableMergeSorter):
            items = args[0]
            key_func = args[1] if len(args) > 1 else kwargs.get("key_func", None)
        else:
            items = self
            key_func = args[0] if len(args) > 0 else kwargs.get("key_func", None)

        if len(items) <= 1:
            return list(items)

        # 1. DECORATE: Evaluate key_func exactly once per element
        decorated = [(key_func(x) if key_func is not None else x, x) for x in items]

        def _sort(records):
            if len(records) <= 1:
                return records

            mid = len(records) // 2
            left = _sort(records[:mid])
            right = _sort(records[mid:])

            merged = []
            i = 0
            j = 0

            while i < len(left) and j < len(right):
                left_key, left_item = left[i]
                right_key, right_item = right[j]

                # STABILITY INVARIANT: Strictly compare right_key < left_key
                # Crucial: NEVER compare left_item and right_item!
                if right_key < left_key:
                    merged.append((right_key, right_item))
                    j += 1
                else:
                    # When right is not strictly smaller (left <= right), take left
                    merged.append((left_key, left_item))
                    i += 1

            merged.extend(left[i:])
            merged.extend(right[j:])
            return merged

        sorted_records = _sort(decorated)
        # 2. UNDECORATE: Return newly allocated sorted list of original items
        return [item for _, item in sorted_records]

    def is_sorted(self, *args, **kwargs):
        if isinstance(self, StableMergeSorter):
            items = args[0] if len(args) > 0 else []
            key_func = args[1] if len(args) > 1 else kwargs.get("key_func", None)
        else:
            items = self
            key_func = args[0] if len(args) > 0 else kwargs.get("key_func", None)

        if len(items) <= 1:
            return True
        prev_key = key_func(items[0]) if key_func is not None else items[0]
        for i in range(1, len(items)):
            curr_key = key_func(items[i]) if key_func is not None else items[i]
            if curr_key < prev_key:
                return False
            prev_key = curr_key
        return True
`,
      visibleTests: [
        {
          id: 'vt-b16-01',
          name: 'Task A: Basic Operations, None Safety & Eviction Invariant',
          input: '{"ops": ["put", "put", "get", "put", "get"]}',
          expectedOutput: '{"get_a": 100, "evicted_b": true, "size": 2}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-b16-02',
          name: 'Task B: Stable Merge Sort with Unorderable Payloads & Input Immutability',
          input: '{"items": [{"p": 2, "id": "A"}, {"p": 1, "id": "B"}, {"p": 2, "id": "C"}]}',
          expectedOutput: '{"sorted_ids": ["B", "A", "C"], "input_unmutated": true}',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-b16-01',
          name: 'Task A: Unhashable Key Defense on LRUCache',
          input: '{"unhashable_key": []}',
          expectedOutput: '{"unhashable_raised": true}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-b16-02',
          name: 'Task B: Once-Per-Element Key Evaluation Contract',
          input: '{"item_count": 100}',
          expectedOutput: '{"key_evaluations": 100}',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-b16-01',
          name: 'Task A: Bidirectional Pointer Link Integrity Harness',
          input: '{"operations": 50}',
          expectedOutput: '{"dll_integrity_verified": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        {
          id: 'dim-b16-01',
          name: 'Architecture',
          description: 'Correct expected O(1) get, amortized O(1) put, recency promotion, and LRU eviction when capacity exceeded.',
          criteria: 'Correct expected O(1) get, amortized O(1) put, recency promotion, and LRU eviction when capacity exceeded. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
        },
        {
          id: 'dim-b16-02',
          name: 'ErrorHandling',
          description: 'Stores None payload cleanly without raising KeyNotFoundError; raises KeyNotFoundError on absent keys; raises UnhashableKeyError on unhashable keys.',
          criteria: 'Stores None payload cleanly without raising KeyNotFoundError; raises KeyNotFoundError on absent keys; raises UnhashableKeyError on unhashable keys.',
          weight: 0.10,
          maxPoints: 10,
        },
        {
          id: 'dim-b16-03',
          name: 'DataStructureSelection',
          description: 'Clean detachment and splicing with sentinel head/tail; zero broken bidirectional links, stale references, or de-synchronized state.',
          criteria: 'Clean detachment and splicing with sentinel head/tail; zero broken bidirectional links, stale references, or de-synchronized state.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'dim-b16-04',
          name: 'EdgeCaseRobustness',
          description: 'size(), capacity(), peek_lru(), peek_mru(), and EmptyCacheError on empty peek.',
          criteria: 'size(), capacity(), peek_lru(), peek_mru(), and EmptyCacheError on empty peek.',
          weight: 0.10,
          maxPoints: 10,
        },
        {
          id: 'dim-b16-05',
          name: 'Correctness',
          description: 'Pure recursive merge sort operating in O(n log n) time, preserving stability via key-only < comparison, with once-per-element key evaluation.',
          criteria: 'Pure recursive merge sort operating in O(n log n) time, preserving stability via key-only < comparison, with once-per-element key evaluation. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
        },
        {
          id: 'dim-b16-06',
          name: 'DesignJudgment',
          description: 'Original input list is guaranteed unmutated; newly allocated sorted list is returned.',
          criteria: 'Original input list is guaranteed unmutated; newly allocated sorted list is returned.',
          weight: 0.05,
          maxPoints: 5,
        },
        {
          id: 'dim-b16-07',
          name: 'Performance',
          description: 'Detects pre-sorted arrays in O(n) time before partitioning.',
          criteria: 'Detects pre-sorted arrays in O(n) time before partitioning.',
          weight: 0.10,
          maxPoints: 10,
        },
      ],
    },
  ],
};

// ── DAY 82: TRANSFER — Formative Assessment: Month 4 Milestone Synthesis ──
export const DAY_82_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w16-016',
  dayNumber: 5,
  title: 'Formative Assessment: High-Throughput LRU Eviction Cache & Stable Divide-and-Conquer Engine',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b16-d82-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: High-Throughput LRU Cache & Stable Divide-and-Conquer Engine',
      estimatedMinutes: 80,
      status: 'PUBLISHED',
      version: '1.0.0',
      difficulty: 'INTERMEDIATE',
      timeExpectationMinutes: 80,
      targetCompetencyId: COMPETENCY_ID_ALGORITHMIC_SYNTHESIS_AND_COMPOSITE,
      unfamiliarDomainContext: 'High-Throughput In-Memory Session Cache & Telemetry Event Sequence Ordering',
      task: 'Synthesize LRUCache (composite doubly linked list + dictionary) and StableMergeSorter (pure divide-and-conquer sorter with key-only comparison) under strict asymptotic complexity and stability invariants.',
      constraints: [
        'LRUCache get() is expected O(1), put() is expected O(1) amortized, DLL operations are O(1) worst-case.',
        'LRU complexity assumes key hashing and equality checks have expected O(1) cost and stable hash/equality behavior while the key is stored.',
        'StableMergeSorter is a non-mutating sorting function: does not modify the input list or its ordering.',
        'Key function evaluated exactly once per input element.',
        'Strict key-only comparison (right_key < left_key) ensures stability and sorts unorderable payloads without TypeError.',
        'Dual competency floor: Minimum 50% score required on both LRUCache and StableMergeSorter dimensions.',
      ],
      starterArtifact: `class AlgorithmicStructureError(Exception): pass
class KeyNotFoundError(AlgorithmicStructureError): pass
class UnhashableKeyError(AlgorithmicStructureError): pass
class InvalidCapacityError(AlgorithmicStructureError): pass
class EmptyCacheError(AlgorithmicStructureError): pass

class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    pass

class StableMergeSorter:
    pass
`,
    } as TransferChallengeBlock,
    {
      id: 'blk-b16-d82-02',
      type: 'REFLECTION',
      order: 2,
      title: 'Architectural Reflection: Composite Structures, Recursion Depth & Stability Realities',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on the trade-offs between coupling data structures for dual performance guarantees, the memory implications of call stacks, and the necessity of sorting stability in real-world pipelines.',
      guidingQuestions: [
        'Why does a single primitive data structure (e.g. standard array or standard hash map) fail to satisfy the dual O(1) requirements of an LRU cache?',
        'How does Python handle call stack growth during deep recursion, and why is sys.getrecursionlimit() an interpreter safety ceiling rather than a fixed language constant?',
        'In multi-pass sorting or composite database queries, what catastrophic data integrity failures happen when a sorter fails to guarantee stability or mutates its input in-place?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b16-d82-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Batch 016 Reference Sheet: LRU Cache Architecture, Recursion Mechanics & Sorting Guarantees',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Documentation: functools.lru_cache',
          url: 'https://docs.python.org/3/library/functools.html#functools.lru_cache',
        },
        {
          title: 'Python Official Documentation: Sorting Techniques',
          url: 'https://docs.python.org/3/howto/sorting.html',
        },
        {
          title: 'Python Official Documentation: sys.getrecursionlimit',
          url: 'https://docs.python.org/3/library/sys.html#sys.getrecursionlimit',
        },
      ],
      documentationExtracts: [
        'Python 3.14 Documentation: list.sort() is guaranteed to be stable and adaptive, with O(n log n) worst-case comparisons. Internal sorting implementation details belong to CPython rather than the universal Python language specification.',
        'CPython Implementation Detail: Modern CPython sorting uses a Timsort-family adaptive hybrid with a Powersort merge strategy. Students are not required to implement this internal detail.',
        'Python Call Stack: sys.getrecursionlimit() inspects the current maximum recursion depth (standard CPython default is commonly ~1000). Exceeding this boundary raises a native RecursionError.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 016 MASTER MANIFEST ──
export const BATCH_016_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m4-w16-016',
  batchCode: 'P2-M4-W16-BATCH016',
  title: 'Algorithmic Paradigms, Recursion, Sorting Invariants & Composite LRU Cache Architecture',
  difficulty: 'INTERMEDIATE',
  days: [
    DAY_78_MANIFEST,
    DAY_79_MANIFEST,
    DAY_80_MANIFEST,
    DAY_81_MANIFEST,
    DAY_82_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
};
