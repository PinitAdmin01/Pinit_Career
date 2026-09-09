// src/lib/curriculum/pythonFullStack/batch014.ts
// Single Source of Truth for PINIT BATCH 014: Month 4 · Week 14 · Days 68–72
// Core Data Structures: Linear Structures, Abstract Data Types & Memory Mechanics
// Pedagogical Flow: UNDERSTAND (Stack LIFO Contract & Array-Backed Mechanics) -> APPLY (Queue FIFO Contract, Ring Buffers & Deque Architecture) -> BUILD (Singly Linked List Invariant-Driven Implementation) -> DEBUG (Pointer Disconnections & Sentinel Traps) -> TRANSFER (Formative Linear DSA Synthesis: Bounded Buffer & Undo/Redo Engine)

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  GuidedLabBlock,
  DebuggingChallengeBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_CORE_DATA_STRUCTURES = 'comp-pfs-m4-014';

// ── CANONICAL DOMAIN EXCEPTIONS FOR LINEAR DATA STRUCTURES ──
// Used across all instruction, labs, challenges, and assessment contracts:
// 1. EmptyStackError: Raised when popping or peeking an empty stack.
// 2. EmptyQueueError: Raised when dequeuing or peeking an empty unbounded queue.
// 3. BufferOverflowError: Raised when enqueuing into a saturated bounded circular buffer.
// 4. BufferUnderflowError: Raised when dequeuing or peeking an empty bounded circular buffer.
// 5. NothingToUndoError: Raised when attempting to undo with an empty undo stack.
// 6. NothingToRedoError: Raised when attempting to redo with an empty redo stack.

// ── DAY 68: UNDERSTAND — Abstract Data Types (ADTs) vs Concrete Data Structures: The Stack (LIFO) Contract ──
export const DAY_68_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w14-014',
  dayNumber: 1,
  title: 'Abstract Data Types (ADTs) vs Concrete Data Structures: The Stack (LIFO) Contract',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b14-d68-01',
      type: 'THEORY',
      order: 1,
      title: 'Abstract Data Types vs Physical Data Structures: The Stack Interface',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand the essential computer science distinction between an Abstract Data Type (the behavioral contract) and a Data Structure (the physical memory layout), and establish the formal LIFO Stack contract.',
      whatItIs: 'An Abstract Data Type (ADT) is a mathematical specification of a data object defined exclusively by its allowable operations, input types, output types, preconditions, and invariant promises from the user perspective (the "what"). A Data Structure is the physical memory layout, pointers, and machine instructions that realize that contract in silicon (the "how").',
      whyItExists: 'Decoupling client contracts from storage implementations allows software systems to evolve their underlying memory representations without breaking downstream business logic. For example, a Stack ADT client only cares about push and pop contracts, regardless of whether the engine uses a dynamic array, a linked chain of nodes, or a static buffer.',
      problemSolved: 'Eliminates architectural coupling where high-level application modules depend on raw list methods (like index slicing or arbitrary insertions), accidentally violating LIFO/FIFO disciplines.',
      mentalModel: 'The Vending Machine vs The Internal Motor: The ADT is the vending machine button and slot (you insert a coin and push a button to get an item). The Data Structure is the internal spiral coil, motor, and sensors executing the drop. The consumer depends on the contract, not the motor coils.',
      realWorldUse: 'Runtime call stack activation frames, bracket and syntax delimiter parsing, browser history traversal, and expression evaluation engines.',
      commonMistakes: [
        'Confusing an ADT with a specific Python class or built-in container.',
        'Returning None on empty pop instead of raising EmptyStackError, which creates an unresolvable bug when None is a legitimate payload pushed onto the stack.',
        'Using list.insert(0, x) and list.pop(0) to implement a stack, turning O(1) operations into catastrophic O(n) memory shifts.',
      ],
      commonMisconceptions: [
        'Misconception: "A stack is just a Python list." Reality: A list is a general-purpose random-access dynamic array. A Stack is a restricted ADT that enforces strict Last-In, First-Out (LIFO) access.',
        'Misconception: "Returning None from an empty stack is cleaner than raising an exception." Reality: If stack.push(None) is valid, the caller cannot distinguish between an empty stack and a stack whose top element is None. Raising EmptyStackError is unambiguous.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b14-d68-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Array-Backed Stack Implementation & The Shifting Cost of insert(0)',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Step-by-step implementation of an ArrayStack using high-index operations (append/pop) in O(1) amortized time, contrasted against the O(n) element-shifting penalty of front-index manipulation.',
      language: 'python',
      codeSnippet: `class EmptyStackError(Exception):
    """Raised when attempting to pop or peek from an empty stack."""
    pass

class ArrayStack:
    """
    Concrete implementation of the Stack ADT backed by a CPython dynamic array.
    Invariant: The top of the stack is maintained at the high index (end of list).
    Complexity:
      - push(item): O(1) amortized
      - pop(): O(1) worst-case
      - peek(): O(1) worst-case
      - is_empty(): O(1)
      - size(): O(1)
    """
    def __init__(self):
        self._items = []

    def push(self, item):
        """Pushes an element onto the top of the stack."""
        self._items.append(item)

    def pop(self):
        """
        Removes and returns the top element from the stack.
        Raises EmptyStackError if the stack contains zero elements.
        """
        if not self._items:
            raise EmptyStackError("Cannot pop from an empty stack.")
        return self._items.pop()

    def peek(self):
        """
        Returns the top element without removing it.
        Raises EmptyStackError if the stack contains zero elements.
        """
        if not self._items:
            raise EmptyStackError("Cannot peek into an empty stack.")
        return self._items[-1]

    def is_empty(self):
        """Returns True if the stack has zero elements, False otherwise."""
        return len(self._items) == 0

    def size(self):
        """Returns the current number of elements on the stack."""
        return len(self._items)

# Verification of LIFO discipline and None-payload safety:
stack = ArrayStack()
stack.push("Alpha")
stack.push(None)  # Legitimate payload
stack.push("Gamma")

print("Top element (peek):", stack.peek())
print("Popped:", stack.pop())  # "Gamma"
print("Popped payload:", stack.pop())  # None (distinguishable from empty error!)
print("Popped:", stack.pop())  # "Alpha"
print("Is empty now?", stack.is_empty())

try:
    stack.pop()
except EmptyStackError as err:
    print("Caught expected exception:", err)
`,
      expectedOutput: `Top element (peek): Gamma
Popped: Gamma
Popped payload: None
Popped: Alpha
Is empty now? True
Caught expected exception: Cannot pop from an empty stack.`,
    } as ExampleBlock,
    {
      id: 'blk-b14-d68-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Balanced Delimiter Validation Using the Stack ADT',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Inspect the candidate delimiter validation function for source code parsing.',
        'Use an ArrayStack to track open delimiters: "(", "{", "[".',
        'When encountering a closing delimiter, pop from the stack and verify that the opening delimiter matches.',
        'If the stack is empty when a closing delimiter is found, or if delimiters mismatch, return False.',
        'After scanning the full string, ensure the stack is completely empty (no unclosed brackets remain).',
      ],
      expectedOutcome: 'A robust syntax validator function is_balanced(expression) returning True for properly nested brackets and False for mismatched or unclosed delimiters.',
      starterCode: `class EmptyStackError(Exception):
    pass

class ArrayStack:
    def __init__(self):
        self._items = []
    def push(self, item):
        self._items.append(item)
    def pop(self):
        if not self._items:
            raise EmptyStackError("Empty")
        return self._items.pop()
    def is_empty(self):
        return len(self._items) == 0

def is_balanced(code: str) -> bool:
    """
    Validates whether delimiters (), {}, and [] are correctly matched and nested.
    Returns True if balanced, False otherwise.
    """
    # TODO: Implement stack-based delimiter matching
    pass
`,
      hints: [
        'Define a dictionary matching closing delimiters to opening delimiters: {")": "(", "}": "{", "]": "["}.',
        'Iterate through each character in the string. If it is an opening delimiter, push it onto the stack.',
        'If it is a closing delimiter, check if the stack is empty (if so, return False). Otherwise pop and compare.',
      ],
      solutionReference: `def is_balanced(code: str) -> bool:
    pairs = {")": "(", "}": "{", "]": "["}
    openers = set(pairs.values())
    stack = ArrayStack()
    
    for char in code:
        if char in openers:
            stack.push(char)
        elif char in pairs:
            if stack.is_empty():
                return False
            top = stack.pop()
            if top != pairs[char]:
                return False
    return stack.is_empty()`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b14-d68-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'LIFO Mechanics, Shifting Costs & Domain Exceptions',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is it an engineering anti-pattern to return None instead of raising EmptyStackError when pop() is invoked on an empty stack?',
      options: [
        'Because Python lists raise TypeError when receiving None values.',
        'Because if None is pushed as a valid payload, the caller cannot distinguish between a legitimate None payload and an empty stack.',
        'Because returning None forces the Python interpreter to perform a garbage collection cycle.',
        'Because Python functions are required by the language specification to raise IndexError on empty returns.',
      ],
      correctIndex: 1,
      explanation: 'When None is permitted as a valid data payload, returning None on empty pop introduces ambiguity: the caller cannot tell whether the stack held None or was empty. Raising EmptyStackError provides an explicit, unambiguous domain signal.',
      misconceptionIdentified: 'Believing that sentinel values like None are interchangeable with formal exception contracts in data structure design.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 69: APPLY — FIFO Queues, Ring Buffers & collections.deque Block Architecture ──
export const DAY_69_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w14-014',
  dayNumber: 2,
  title: 'FIFO Queues, Ring Buffers & collections.deque Block Architecture',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b14-d69-01',
      type: 'THEORY',
      order: 1,
      title: 'Queue FIFO Contracts, Modulo Ring Buffers & collections.deque Internals',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Explore the First-In, First-Out (FIFO) queue contract, analyze the O(n) dequeue bottleneck of list.pop(0), examine the circular ring buffer, and inspect the block architecture of collections.deque.',
      whatItIs: 'The Queue ADT enforces First-In, First-Out (FIFO) ordering where elements are enqueued at the tail and dequeued from the head. A Circular Buffer is a fixed-capacity array utilizing modulo pointer arithmetic to achieve O(1) operations without shifting elements. collections.deque is Python\'s standard library double-ended queue.',
      whyItExists: 'CPython lists are dynamic arrays. Appending to the end is O(1) amortized, but removing the first element via list.pop(0) requires shifting every remaining pointer in contiguous memory to the left by one position—an O(n) operation. In CPython, boundary append/pop operations on collections.deque are approximately O(1); Python\'s documentation describes them as approximately O(1).',
      problemSolved: 'Prevents catastrophic quadratic O(n^2) latency degradation in event loops, message dispatchers, and task scheduling pipelines caused by naive list.pop(0) calls.',
      mentalModel: 'The Airport Runway vs The Escalator: Naive list queueing is like forcing everyone in line to physically take a step forward whenever the person at the front boards. A circular ring buffer or deque simply advances the front pointer, leaving everyone else in place.',
      realWorldUse: 'In-memory task queues, sliding window telemetry buffers, thread-safe message passing, and network packet queues.',
      commonMistakes: [
        'Using list.pop(0) to dequeue in a loop, turning an O(n) pipeline into an O(n^2) system bottleneck.',
        'Using None as the sole empty-slot indicator in a circular buffer without a separate size/count tracker, causing buffer corruption if None is enqueued.',
        'Assuming collections.deque provides O(1) random indexed access like a list; deque[i] requires pointer traversal across blocks, which is O(n) for middle indices.',
      ],
      commonMisconceptions: [
        'Misconception: "collections.deque O(1) performance is an absolute universal language guarantee across all Python implementations." Reality: In CPython, boundary append/pop operations are approximately O(1); Python\'s documentation describes them as approximately O(1). The underlying implementation may differ across non-CPython runtimes.',
        'Misconception: "CPython deque blocks are always 64 elements on every machine." Reality: As a current CPython implementation detail, BLOCKLEN is defined as 64, linking 64-element pointer buffers in a doubly linked chain. This is an implementation detail of CPython, not an immutable language law.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b14-d69-02',
      type: 'GUIDED_LAB',
      order: 2,
      title: 'Building a Fixed-Capacity CircularBuffer with Modulo Pointer Wrapping',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Implement and verify a fixed-capacity circular FIFO buffer using modulo pointer arithmetic and independent count tracking, handling buffer overflow and None payloads safely.',
      instructions: [
        'Implement a CircularBuffer with a pre-allocated fixed storage list [None] * capacity.',
        'Maintain independent head, tail, and size/count state variables. Do NOT rely on None to detect empty slots.',
        'Implement enqueue(item): if size == capacity, raise BufferOverflowError without corrupting buffer state.',
        'Implement dequeue(): if size == 0, raise BufferUnderflowError; advance head via (head + 1) % capacity.',
        'Verify that enqueue(None) and dequeue() handle None payloads cleanly without confusing None with an empty slot.',
      ],
      starterFiles: {
        'circular_buffer.py': `class BufferOverflowError(Exception):
    """Raised when enqueuing into a full bounded buffer."""
    pass

class BufferUnderflowError(Exception):
    """Raised when dequeuing or peeking an empty bounded buffer."""
    pass

class CircularBuffer:
    """
    Fixed-capacity circular FIFO buffer using modulo pointer arithmetic.
    Complexity: All operations strictly O(1) worst-case.
    """
    def __init__(self, capacity: int):
        if capacity <= 0:
            raise ValueError("Capacity must be positive.")
        self._capacity = capacity
        self._storage = [None] * capacity
        self._head = 0
        self._tail = 0
        self._size = 0  # Crucial independent state tracker

    def enqueue(self, item):
        pass

    def dequeue(self):
        pass

    def peek(self):
        pass

    def is_empty(self):
        return self._size == 0

    def is_full(self):
        return self._size == self._capacity

    def size(self):
        return self._size
`,
      },
      expectedBehavior: 'All circular buffer operations execute in strict O(1) worst-case time without shifting memory, and process None payloads safely without slot confusion.',
    } as GuidedLabBlock,
    {
      id: 'blk-b14-d69-03',
      type: 'KNOWLEDGE_CHECK',
      order: 3,
      title: 'Deque Block Mechanics & Shifting Traps',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does Python\'s collections.deque provide approximately O(1) performance for append and popleft, while list.pop(0) is O(n)?',
      options: [
        'Because deque allocates all elements in a single contiguous C array and shifts them using hardware SIMD registers.',
        'Because deque is implemented in CPython as a doubly linked list of fixed-size blocks (BLOCKLEN 64), enabling boundary pointer adjustments without shifting internal elements.',
        'Because Python automatically compiles deque operations into native assembly instructions.',
        'Because deque does not support holding Python objects, only 64-bit primitive integers.',
      ],
      correctIndex: 1,
      explanation: 'In CPython, collections.deque is implemented as a doubly linked list of fixed-size blocks (BLOCKLEN 64). Pushing or popping at either boundary adjusts pointers or allocates/deallocates individual boundary blocks without shifting existing element references.',
      misconceptionIdentified: 'Believing that deque uses a single contiguous array that magically shifts elements in constant time.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 70: BUILD — Node-Based Data Structures: Singly Linked List Architecture from Scratch ──
export const DAY_70_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w14-014',
  dayNumber: 3,
  title: 'Node-Based Data Structures: Singly Linked List Architecture from Scratch',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b14-d70-01',
      type: 'THEORY',
      order: 1,
      title: 'Contiguous Memory vs Pointer Nodes: Cache Locality & Reference Physics',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Contrast the physical memory layout of contiguous arrays against node-based linked structures, exploring CPU cache lines, spatial locality, and the pointer-chasing latency trade-off.',
      whatItIs: 'A Node-based data structure connects individual, independently allocated heap objects through explicit memory references (pointers). A Singly Linked List consists of Node instances where each node holds a value and a reference to the next node.',
      whyItExists: 'Dynamic arrays require contiguous memory buffers; prepending an item or inserting at an index requires shifting subsequent elements. Linked lists decouple insertion from element shifting: prepending a node is strictly O(1) pointer assignment without touching subsequent nodes.',
      problemSolved: 'Provides O(1) insertions and deletions at known pointer locations without requiring geometric buffer reallocation or memory shifts.',
      mentalModel: 'The Train Cars vs The Treasure Hunt: A dynamic array is a train where all cars are physically coupled in contiguous track slots. A linked list is a treasure hunt: each clue (node) gives you a prize (value) and the address of the next clue, scattered across town (heap memory).',
      realWorldUse: 'Kernel memory block free-lists, hash map collision bucket chaining, LRU cache node tracking, and undo-history chains.',
      commonMistakes: [
        'Losing the head reference during traversal (e.g. updating self.head = self.head.next instead of using a temporary cursor curr).',
        'Failing to update self.tail when deleting the final node, leaving a dangling pointer.',
        'Assuming linked lists are always faster than arrays because "insertion is O(1)". In modern hardware, cache misses from pointer chasing often make array iteration significantly faster for traversal.',
      ],
      commonMisconceptions: [
        'Misconception: "Linked list access by index is O(1)." Reality: Accessing the k-th node requires sequential pointer traversal from the head, which is strictly O(k) linear time.',
        'Misconception: "Linked lists use less memory than arrays." Reality: In Python, each Node object has object header overhead and reference pointer fields, incurring substantial memory overhead compared to an array of pointers.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b14-d70-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Node Construction & Pointer Linking Mechanics',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates manual node instantiation and pointer manipulation using grounded Python class syntax without premature typing imports.',
      language: 'python',
      codeSnippet: `class Node:
    """
    Fundamental building block of a linked structure.
    Uses clean, previously taught Python class syntax.
    """
    def __init__(self, val, next_node=None):
        self.val = val
        self.next = next_node

# Manual linking of three nodes:
first = Node("Alpha")
second = Node("Beta")
third = Node("Gamma")

first.next = second
second.next = third

# Sequential pointer traversal (cursor pattern):
curr = first
elements = []
while curr is not None:
    elements.append(curr.val)
    curr = curr.next

print("Traversed chain:", " -> ".join(elements))
print("Second node value via first:", first.next.val)
print("Third node value via first:", first.next.next.val)
`,
      expectedOutput: `Traversed chain: Alpha -> Beta -> Gamma
Second node value via first: Beta
Third node value via first: Gamma`,
    } as ExampleBlock,
    {
      id: 'blk-b14-d70-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Building an Invariant-Driven Educational SinglyLinkedList',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Build an invariant-driven educational SinglyLinkedList class with head, tail, and _size attributes.',
        'Implement prepend(val): creates a new Node, points it to head, updates head, and sets tail if list was empty. O(1) time.',
        'Implement append(val): leverages the self.tail pointer for O(1) insertion at the end.',
        'Implement find(val): returns the integer index of the first matching node, or -1 if not found. O(n) traversal.',
        'Implement delete(val): deletes the first matching node. Update prev.next = curr.next. Crucially maintain head, tail, and _size invariants.',
      ],
      expectedOutcome: 'A complete, invariant-defended SinglyLinkedList implementation handling empty list, single-node list, head deletion, and tail deletion edge cases.',
      starterCode: `class Node:
    def __init__(self, val, next_node=None):
        self.val = val
        self.next = next_node

class SinglyLinkedList:
    """
    Invariant-driven educational implementation of a Singly Linked List.
    Invariants:
      - self.head points to the first Node, or None if empty.
      - self.tail points to the last Node, or None if empty.
      - self._size accurately tracks node count.
    """
    def __init__(self):
        self.head = None
        self.tail = None
        self._size = 0

    def prepend(self, val):
        # TODO: Implement O(1) prepend
        pass

    def append(self, val):
        # TODO: Implement O(1) append with tail pointer
        pass

    def find(self, val):
        # TODO: Implement O(n) find
        pass

    def delete(self, val):
        # TODO: Implement O(n) delete with invariant defense
        pass

    def size(self):
        return self._size

    def is_empty(self):
        return self._size == 0
`,
      hints: [
        'For prepend: new_node = Node(val, self.head); self.head = new_node. If self.tail is None, self.tail = new_node.',
        'For append: if self.tail is None, both head and tail point to new_node. Otherwise self.tail.next = new_node; self.tail = new_node.',
        'For delete: keep track of prev and curr. If deleting head: self.head = curr.next. If that was the only node, also self.tail = None. If deleting tail, self.tail = prev.',
      ],
      solutionReference: `class Node:
    def __init__(self, val, next_node=None):
        self.val = val
        self.next = next_node

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self._size = 0

    def prepend(self, val):
        new_node = Node(val, self.head)
        self.head = new_node
        if self.tail is None:
            self.tail = new_node
        self._size += 1

    def append(self, val):
        new_node = Node(val)
        if self.head is None:
            self.head = new_node
            self.tail = new_node
        else:
            self.tail.next = new_node
            self.tail = new_node
        self._size += 1

    def find(self, val):
        curr = self.head
        idx = 0
        while curr is not None:
            if curr.val == val:
                return idx
            curr = curr.next
            idx += 1
        return -1

    def delete(self, val):
        curr = self.head
        prev = None
        while curr is not None:
            if curr.val == val:
                if prev is None:
                    self.head = curr.next
                    if self.head is None:
                        self.tail = None
                else:
                    prev.next = curr.next
                    if curr == self.tail:
                        self.tail = prev
                self._size -= 1
                return True
            prev = curr
            curr = curr.next
        return False

    def size(self):
        return self._size

    def is_empty(self):
        return self._size == 0`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b14-d70-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Linked List Pointer Invariants & Cache Physics',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'When deleting the final node in a SinglyLinkedList that maintains a self.tail reference, what invariant must be updated in addition to prev.next = None?',
      options: [
        'self.head must be set to None regardless of list size.',
        'self.tail must be updated to reference prev, or None if the deleted node was the only node.',
        'All preceding nodes must have their next references recomputed.',
        'The list must be reallocated as a contiguous array.',
      ],
      correctIndex: 1,
      explanation: 'If self.tail is not updated to prev when the tail node is deleted, it remains referencing the orphaned node. Subsequent append calls would attach to the dead node, corrupting the list.',
      misconceptionIdentified: 'Believing that updating prev.next is sufficient to maintain a list that tracks an explicit tail pointer.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 71: DEBUG — Pointer Disconnections, Boundary Bugs & Invariant Violations ──
export const DAY_71_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w14-014',
  dayNumber: 4,
  title: 'Pointer Disconnections, Boundary Bugs & Invariant Violations',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b14-d71-01',
      type: 'THEORY',
      order: 1,
      title: 'Anatomy of Pointer Corruptions, Cyclic Traps & Sentinel Failures',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Diagnose the four classic failure modes in linear and linked data structures: dangling tail references, single-node zeroing oversights, accidental cyclic references, and ambiguous sentinel returns.',
      whatItIs: 'Pointer corruption occurs when memory references diverge from the mathematical invariants of the data structure. Unlike static syntax errors, pointer bugs create subtle runtime hazards such as infinite traversal loops, disconnected orphaned nodes, or state corruption.',
      whyItExists: 'In Python, pointers are object references. If a developer forgets to update a reference or accidentally points a node back to itself (curr.next = curr), Python\'s while loop traversal will hang indefinitely, freezing worker processes.',
      problemSolved: 'Provides systematic diagnosis patterns and defensive assertions to identify and eliminate pointer disconnects and boundary bugs before production deployment.',
      mentalModel: 'The Train Switchyard: A broken pointer is like an unaligned railroad switch. The engine either derails into empty space (AttributeError: \'NoneType\' object has no attribute \'next\') or gets trapped in an endless circle (infinite loop).',
      realWorldUse: 'Debugging corrupted transactional logs, in-memory LRU cache disconnections, and broker message queues.',
      commonMistakes: [
        'Setting prev.next = curr.next but failing to check if curr was the tail node.',
        'Deleting the only node in a list and updating head = None, but leaving tail pointing to the deleted node.',
        'Creating a cyclic loop during in-place list reversal by failing to set the old head\'s next pointer to None.',
      ],
      commonMisconceptions: [
        'Misconception: "Garbage collection will automatically fix dangling pointer references." Reality: If self.tail references an orphaned node, Python\'s garbage collector sees an active reference and preserves the entire chain in memory.',
        'Misconception: "A pointer bug always raises an exception." Reality: Pointer bugs often silently disconnect data or loop forever without raising any exception.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b14-d71-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Chaos Lab: Resolving 3 Latent Pointer & State Defects in an In-Memory Task Pipeline',
      estimatedMinutes: 45,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'An in-memory task dispatcher contains 3 latent bugs: (1) A linked list delete method leaves self.tail dangling when deleting the tail; (2) A queue returns None on empty dequeue instead of raising EmptyQueueError; (3) An in-place list reversal hangs in an infinite loop because the original head\'s next pointer is never cleared.',
      symptom: 'Subsequent node appends attach to deleted nodes, worker pipelines misinterpret None payloads as empty queues, and list reversals hang in infinite loops.',
      brokenArtifact: `class EmptyQueueError(Exception):
    pass

class BrokenTaskQueue:
    def __init__(self):
        self._items = []
    def enqueue(self, task):
        self._items.append(task)
    def dequeue(self):
        if not self._items:
            return None  # DEFECT 1: Returns None instead of raising EmptyQueueError
        return self._items.pop(0)

class Node:
    def __init__(self, val, next_node=None):
        self.val = val
        self.next = next_node

class BrokenLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self._size = 0

    def append(self, val):
        n = Node(val)
        if self.head is None:
            self.head = n
            self.tail = n
        else:
            self.tail.next = n
            self.tail = n
        self._size += 1

    def delete(self, val):
        curr = self.head
        prev = None
        while curr:
            if curr.val == val:
                if prev is None:
                    self.head = curr.next
                    if self.head is None:
                        self.tail = None
                else:
                    prev.next = curr.next
                    # DEFECT 2: Missing update to self.tail if curr was self.tail!
                self._size -= 1
                return True
            prev = curr
            curr = curr.next
        return False

    def reverse(self):
        # DEFECT 3: Missing prev = None link causes circular infinite loop
        prev = None
        curr = self.head
        self.tail = self.head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        self.head = prev
`,
      expectedBehavior: 'All 3 defects are patched: EmptyQueueError is raised on empty dequeue, self.tail is updated on tail deletion, and list reversal terminates cleanly without cycles.',
      difficulty: 'INTERMEDIATE',
      hints: [
        'When deleting the tail node (curr == self.tail), update self.tail = prev.',
        'In dequeue(), verify len(self._items) > 0 before calling pop(0); otherwise raise EmptyQueueError.',
        'In reverse(), ensure the original head node has its next pointer set to None so no cycle is created.',
      ],
      targetCompetencyId: COMPETENCY_ID_CORE_DATA_STRUCTURES,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b14-d71-03',
      type: 'KNOWLEDGE_CHECK',
      order: 3,
      title: 'Boundary Invariants & Diagnostic Assertions',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What occurs if an in-place linked list reversal fails to set the original head node\'s next reference to None?',
      options: [
        'Python immediately raises a RecursionError during execution.',
        'The list becomes cyclic: the first node points back to the second node, creating an infinite loop during sequential traversal.',
        'All node values are wiped and replaced with None.',
        'Memory is leaked but traversal proceeds normally.',
      ],
      correctIndex: 1,
      explanation: 'In an in-place reversal, the original head node becomes the new tail. Its next pointer must be explicitly set to None (which prev starts as). If it retains a link to the subsequent node, a two-node cycle is formed, causing any while curr: traversal to loop infinitely.',
      misconceptionIdentified: 'Assuming that re-pointing pointers in a loop automatically breaks circular references without explicit termination.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 72: TRANSFER — Formative Linear DSA Synthesis: Bounded Buffer & Transactional Undo Pipeline ──
export const DAY_72_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m4-w14-014',
  assessmentCode: 'ASM-PFS-M4-W14-014',
  title: 'Batch 014 Formative Assessment: Bounded FIFO Buffer & Transactional Undo/Redo Engine',
  description: 'Synthesize Stacks, Queues, Circular Buffers, and Invariant Defense in a mission-critical in-memory request processing and state management pipeline.',
  type: 'CODE',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  difficulty: 'INTERMEDIATE',
  timeLimitMinutes: 65,
  passingScore: 70,
  maxAttempts: 3,
  attemptPolicy: 'LIMITED_BEST',
  targetCompetencyId: COMPETENCY_ID_CORE_DATA_STRUCTURES,
  batchId: 'batch-pfs-m4-w14-014',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
  items: [
    {
      id: 'item-b14-01',
      assessmentId: 'asm-pfs-m4-w14-014',
      itemType: 'CODE',
      points: 100,
      order: 1,
      timeEstimateMinutes: 65,
      version: '1.0.0',
      prompt: `Implement two mission-critical data structures for an in-memory audit and state tracking engine:

TASK A: BoundedEventBuffer (Fixed-Capacity FIFO Queue)
Contract & Complexity:
- Initialize with capacity: int (raise ValueError if capacity <= 0).
- enqueue(event): Strict O(1) worst-case time. Inserts event at tail. If buffer is full, raises BufferOverflowError and leaves existing buffer state completely unchanged.
- dequeue(): Strict O(1) worst-case time. Removes and returns oldest event from head. If empty, raises BufferUnderflowError.
- peek(): Strict O(1) worst-case time. Returns oldest event without removing. If empty, raises BufferUnderflowError.
- is_empty() -> bool, is_full() -> bool, size() -> int.
- INVARIANT: None is a valid event payload (e.g. enqueue(None)). You MUST maintain an independent _size counter; you may NOT rely on None to detect empty slots.
- REJECTION GUARD: Solutions that shift elements (e.g. list.pop(0)) will fail performance checks.

TASK B: ActionHistoryTracker (Transactional State History Engine)
Contract & Complexity:
- Maintains a state dictionary state: dict and dual stacks (_undo_stack, _redo_stack).
- Reversible Action Schema:
  {
      "entity_id": str,
      "old_exists": bool,
      "old_value": Any,
      "new_exists": bool,
      "new_value": Any
  }
  * old_exists: True if entity_id existed in state prior to this action; False if it was absent.
  * old_value: Prior value of entity_id (None if old_exists is False).
  * new_exists: True if entity_id should exist after applying action; False for key deletions.
  * new_value: New value to set for entity_id (None if new_exists is False).
- record_action(action: dict): Strict O(1) amortized time.
  * If action.get("new_exists", True): state[action["entity_id"]] = action.get("new_value")
  * Else: state.pop(action["entity_id"], None)
  * Pushes action onto _undo_stack and completely clears _redo_stack (branching invalidation).
  * (Note: clearing h redo entries takes O(h) in that call, but is O(1) amortized across the sequence).
- undo() -> dict: Strict O(1) amortized time.
  * Pops action from _undo_stack.
  * If action.get("old_exists", False): state[action["entity_id"]] = action.get("old_value")
  * Else: state.pop(action["entity_id"], None)
  * Pushes action onto _redo_stack and returns the action.
  * Raises NothingToUndoError if _undo_stack is empty.
- redo() -> dict: Strict O(1) amortized time.
  * Pops action from _redo_stack.
  * If action.get("new_exists", True): state[action["entity_id"]] = action.get("new_value")
  * Else: state.pop(action["entity_id"], None)
  * Pushes action onto _undo_stack and returns the action.
  * Raises NothingToRedoError if _redo_stack is empty.
- get_state(entity_id: str): Returns current state value, or None if not set.
- has_state(entity_id: str) -> bool: Returns True if entity_id is present in state dictionary, False otherwise.
- INVARIANT: Disambiguates an existing key holding None from an absent key. None values, creations, and deletions must be handled without ambiguity.`,
      starterCode: `class BufferOverflowError(Exception):
    pass

class BufferUnderflowError(Exception):
    pass

class NothingToUndoError(Exception):
    pass

class NothingToRedoError(Exception):
    pass

class BoundedEventBuffer:
    def __init__(self, capacity: int):
        if capacity <= 0:
            raise ValueError("Capacity must be positive.")
        # TODO: Implement circular buffer with independent size tracking
        pass

    def enqueue(self, event):
        pass

    def dequeue(self):
        pass

    def peek(self):
        pass

    def is_empty(self) -> bool:
        pass

    def is_full(self) -> bool:
        pass

    def size(self) -> int:
        pass

class ActionHistoryTracker:
    def __init__(self):
        self.state = {}
        self._undo_stack = []
        self._redo_stack = []

    def record_action(self, action: dict):
        pass

    def undo(self) -> dict:
        pass

    def redo(self) -> dict:
        pass

    def get_state(self, entity_id: str):
        return self.state.get(entity_id)

    def has_state(self, entity_id: str) -> bool:
        return entity_id in self.state
`,
      solutionCode: `class BufferOverflowError(Exception):
    pass

class BufferUnderflowError(Exception):
    pass

class NothingToUndoError(Exception):
    pass

class NothingToRedoError(Exception):
    pass

class BoundedEventBuffer:
    def __init__(self, capacity: int):
        if capacity <= 0:
            raise ValueError("Capacity must be positive.")
        self._capacity = capacity
        self._storage = [None] * capacity
        self._head = 0
        self._tail = 0
        self._size = 0

    def enqueue(self, event):
        if self._size == self._capacity:
            raise BufferOverflowError("Buffer is full.")
        self._storage[self._tail] = event
        self._tail = (self._tail + 1) % self._capacity
        self._size += 1

    def dequeue(self):
        if self._size == 0:
            raise BufferUnderflowError("Buffer is empty.")
        item = self._storage[self._head]
        self._storage[self._head] = None
        self._head = (self._head + 1) % self._capacity
        self._size -= 1
        return item

    def peek(self):
        if self._size == 0:
            raise BufferUnderflowError("Buffer is empty.")
        return self._storage[self._head]

    def is_empty(self) -> bool:
        return self._size == 0

    def is_full(self) -> bool:
        return self._size == self._capacity

    def size(self) -> int:
        return self._size

class ActionHistoryTracker:
    def __init__(self):
        self.state = {}
        self._undo_stack = []
        self._redo_stack = []

    def record_action(self, action: dict):
        entity_id = action["entity_id"]
        if action.get("new_exists", True):
            self.state[entity_id] = action.get("new_value")
        else:
            self.state.pop(entity_id, None)
        self._undo_stack.append(action)
        self._redo_stack = []

    def undo(self) -> dict:
        if not self._undo_stack:
            raise NothingToUndoError("No actions to undo.")
        action = self._undo_stack.pop()
        entity_id = action["entity_id"]
        if action.get("old_exists", False):
            self.state[entity_id] = action.get("old_value")
        else:
            self.state.pop(entity_id, None)
        self._redo_stack.append(action)
        return action

    def redo(self) -> dict:
        if not self._redo_stack:
            raise NothingToRedoError("No actions to redo.")
        action = self._redo_stack.pop()
        entity_id = action["entity_id"]
        if action.get("new_exists", True):
            self.state[entity_id] = action.get("new_value")
        else:
            self.state.pop(entity_id, None)
        self._undo_stack.append(action)
        return action

    def get_state(self, entity_id: str):
        return self.state.get(entity_id)

    def has_state(self, entity_id: str) -> bool:
        return entity_id in self.state
`,
      visibleTests: [
        {
          id: 'vt-b14-01',
          name: 'Task A: Circular Buffer Basic FIFO & None Payload Support',
          input: '{"func": "test_fifo_none_payload"}',
          expectedOutput: '{"success": true}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-b14-02',
          name: 'Task A: Saturated Buffer Overflow Leaves State Logically Unchanged',
          input: '{"func": "test_buffer_overflow_invariance"}',
          expectedOutput: '{"overflow_caught": true, "state_intact": true}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-b14-03',
          name: 'Task B: Action Rollback and Replay with Explicit Existence Flags',
          input: '{"func": "test_undo_redo_cycles"}',
          expectedOutput: '{"undo_success": true, "redo_success": true, "final_state_match": true}',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-b14-01',
          name: 'Task B: Redo Stack Branching Invalidation on New Action',
          input: '{"func": "test_branching_redo_purge"}',
          expectedOutput: '{"redo_purged": true, "nothing_to_redo_caught": true}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-b14-02',
          name: 'Task B: Key Absent vs Key Mapped to None Invariant Defense across Creation, Deletion and Undo/Redo',
          input: '{"func": "test_none_vs_absent_invariance"}',
          expectedOutput: '{"absent_handled": true, "none_value_handled": true, "deletion_handled": true}',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-b14-01',
          name: 'Static AST & Dynamic Element-Shifting Anti-Cheating Guard',
          input: '{"check": "AST_ANTI_POP_0_PROBE"}',
          expectedOutput: '{"pop_zero_detected": false, "competency_floor_met": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        {
          id: 'rub-b14-01',
          name: 'Correctness',
          description: 'FIFO and LIFO ordering strictly preserved. None payloads handled without ambiguity. Bounded capacity enforced. State dictionary restored accurately on undo/redo with explicit existence flags disambiguating absent keys from keys mapped to None.',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
        },
        {
          id: 'rub-b14-02',
          name: 'ErrorHandling',
          description: 'Canonical domain exceptions raised: BufferOverflowError, BufferUnderflowError, NothingToUndoError, NothingToRedoError.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'rub-b14-03',
          name: 'Performance',
          description: 'Task A: Strict O(1) worst-case time. Task B: Strict O(1) amortized time (accounting for O(h) redo disposal).',
          weight: 0.20,
          maxPoints: 20,
        },
        {
          id: 'rub-b14-04',
          name: 'DataStructureSelection',
          description: 'Circular buffer utilizes independent _size count state. Zero O(n) list.pop(0) operations.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'rub-b14-05',
          name: 'EdgeCaseRobustness',
          description: 'Resilient against empty calls, single-element buffers, consecutive undo/redo cycles, and interleaved workloads.',
          weight: 0.10,
          maxPoints: 10,
        },
        {
          id: 'rub-b14-06',
          name: 'CodeQuality',
          description: 'Clean class design adhering strictly to prerequisite firewall (zero premature decorators or ABCs).',
          weight: 0.10,
          maxPoints: 10,
        },
        {
          id: 'rub-b14-07',
          name: 'Reasoning',
          description: 'Articulates the trade-offs between contiguous arrays vs node structures, and defends the amortized analysis of stack clearing.',
          weight: 0.05,
          maxPoints: 5,
        },
      ],
    },
  ],
};

export const DAY_72_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w14-014',
  dayNumber: 5,
  title: 'Formative Linear DSA Synthesis: Bounded Buffer & Transactional Undo Pipeline',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b14-d72-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Dual-Task Synthesis: Bounded Circular Buffer & Transactional State History',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      difficulty: 'INTERMEDIATE',
      timeExpectationMinutes: 60,
      targetCompetencyId: COMPETENCY_ID_CORE_DATA_STRUCTURES,
      unfamiliarDomainContext: 'High-Performance In-Memory Audit Logging & Transactional Event Dispatcher',
      task: 'Implement BoundedEventBuffer (fixed-capacity circular FIFO buffer with independent size tracking) and ActionHistoryTracker (dual-stack transactional undo/redo engine with explicit existence flags for unambiguous None handling), maintaining strict O(1) performance contracts, raising canonical exceptions, and defending state invariance.',
      constraints: [
        'Task A: enqueue and dequeue must execute in strict O(1) worst-case time.',
        'Task A: BoundedEventBuffer must raise BufferOverflowError when full without modifying existing buffer contents.',
        'Task A: BoundedEventBuffer must raise BufferUnderflowError when empty.',
        'Task A: None must be supported as a valid event payload without being confused with empty slots.',
        'Task B: Reversible Action Schema must include entity_id, old_exists, old_value, new_exists, new_value to distinguish absent keys from keys mapped to None.',
        'Task B: record_action, undo, and redo must execute in strict O(1) amortized time (accounting for O(h) redo disposal on branching).',
        'Task B: undo must restore old_value or delete key if old_exists is False; redo must apply new_value or delete key if new_exists is False.',
        'Task B: Recording a new action on a branched state must completely purge redo history.',
        'Rejection Guard: Implementations using list element shifting (e.g. list.pop(0)) will fail verification.',
      ],
      starterArtifact: `# audit_pipeline.py
class BufferOverflowError(Exception):
    pass

class BufferUnderflowError(Exception):
    pass

class NothingToUndoError(Exception):
    pass

class NothingToRedoError(Exception):
    pass

class BoundedEventBuffer:
    def __init__(self, capacity: int):
        if capacity <= 0:
            raise ValueError("Capacity must be positive.")
        self._capacity = capacity
        self._storage = [None] * capacity
        self._head = 0
        self._tail = 0
        self._size = 0

    def enqueue(self, event):
        pass

    def dequeue(self):
        pass

    def peek(self):
        pass

    def is_empty(self) -> bool:
        return self._size == 0

    def is_full(self) -> bool:
        return self._size == self._capacity

    def size(self) -> int:
        return self._size

class ActionHistoryTracker:
    def __init__(self):
        self.state = {}
        self._undo_stack = []
        self._redo_stack = []

    def record_action(self, action: dict):
        pass

    def undo(self) -> dict:
        pass

    def redo(self) -> dict:
        pass

    def get_state(self, entity_id: str):
        return self.state.get(entity_id)

    def has_state(self, entity_id: str) -> bool:
        return entity_id in self.state
`,
    } as TransferChallengeBlock,
    {
      id: 'blk-b14-d72-02',
      type: 'REFLECTION',
      order: 2,
      title: 'Engineering Retrospective: Contiguous Arrays vs Pointer Nodes in Modern Hardware',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on the trade-offs between dynamic arrays, circular ring buffers, collections.deque, and singly linked lists. Why do modern high-performance systems frequently prefer array-backed circular buffers over linked lists for queues, despite both offering O(1) operations?',
      guidingQuestions: [
        'How does CPU cache line spatial locality impact traversal speed across contiguous vs non-contiguous heap nodes?',
        'What is the per-element memory overhead of Python Node instances compared to reference arrays?',
        'Under what specific system constraints does a linked structure still outperform an array buffer?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b14-d72-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Canonical Documentation Extracts: collections.deque & Time Complexity',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      documentationExtracts: [
        'Python 3.14 collections.deque documentation: "Deques support thread-safe, memory efficient appends and pops from either side of the deque with approximately the same O(1) performance in either direction."',
        'Python 3.14 TimeComplexity documentation: "list.pop(0) removes the first item from the list and shifts all subsequent items down by one slot, requiring O(n) time."',
        'CPython 3.14 Modules/_collectionsmodule.c: "BLOCKLEN is set to 64. A deque object is composed of a doubly-linked list of blocks of elements."',
      ],
      links: [
        {
          title: 'Python Official Documentation: collections.deque',
          url: 'https://docs.python.org/3/library/collections.html#collections.deque',
        },
        {
          title: 'Python Wiki: TimeComplexity Analysis',
          url: 'https://wiki.python.org/moin/TimeComplexity',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 014 MANIFEST ──
export const BATCH_014_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m4-w14-014',
  batchCode: 'P2-M4-W14-BATCH014',
  title: 'Core Data Structures: Linear Structures, ADTs & Invariant Defense (Days 68–72)',
  difficulty: 'INTERMEDIATE',
  days: [
    DAY_68_MANIFEST,
    DAY_69_MANIFEST,
    DAY_70_MANIFEST,
    DAY_71_MANIFEST,
    DAY_72_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
};
