// src/lib/curriculum/pythonFullStack/batch018.ts
// Single Source of Truth for PINIT BATCH 018: Month 5 · Week 18 · Days 88–92
// Advanced Python: Iterator Protocol, Generator Architecture, Lazy Streaming Pipelines & Memory Physics
// Pedagogical Flow: UNDERSTAND (Iterator Protocol & Dunders) -> APPLY (Generator Suspension & Memory Physics) -> BUILD (yield from & Bidirectional send) -> DEBUG (Container Mutation & PEP 479) -> TRANSFER (Operational Stream Processing Engine Capstone)

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

export const COMPETENCY_ID_ITERATORS_AND_GENERATORS = 'comp-pfs-m5-018';

// ── CANONICAL DOMAIN EXCEPTIONS FOR ITERATOR & STREAM PROCESSING ──
// Used across all instruction, labs, challenges, and assessment contracts:
// 1. StreamProcessingError: Base exception for domain-level stream processing errors.
// 2. InvalidChunkSizeError: Raised when chunk_size or window_size is not an integer >= 1 (e.g. non-int, bool, or < 1).
// Note: In accordance with authentic Python Iterator and Generator Protocols:
// - Iterator exhaustion raises native StopIteration (never a custom exception).
// - Sending non-None to an unprimed generator raises native TypeError (never a custom exception).
// - Sending to a closed/exited generator raises native StopIteration (never a custom exception).
// - Uncaught StopIteration escaping from a generator is converted to native RuntimeError (PEP 479).

// ── DAY 88: UNDERSTAND — The Python Iterator Protocol & Iteration Mechanics ──
export const DAY_88_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w18-018',
  dayNumber: 1,
  title: 'The Python Iterator Protocol & Iteration Mechanics',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b18-d88-01',
      type: 'THEORY',
      order: 1,
      title: 'The Iterable vs Iterator Contract, Dunder Mechanics & Bytecode Dispatch',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the formal mechanics of the Python Iterator Protocol: the distinction between iterables and iterators, the __iter__() and __next__() dunder contracts, bytecode iteration dispatch (GET_ITER, FOR_ITER), native StopIteration exhaustion signaling, and legacy sequence iteration via __getitem__().',
      whatItIs: 'In Python, iteration is governed by two related protocols. An ITERABLE is any object that can return an iterator. For this curriculum, a custom iterable normally implements __iter__() returning an iterator; Python also supports legacy sequence-style iteration through __getitem__() with consecutive zero-based indexing until IndexError. An ITERATOR is an active traversal state machine that implements __iter__() returning self AND __next__() returning the next element or raising StopIteration.',
      whyItExists: 'Decouples collection traversal from underlying data structure layout (lists, trees, files, database cursors, infinite number sequences). Consumers traverse items through a uniform, predictable interface without knowing the internal storage layout.',
      problemSolved: 'Eliminates index-based traversal coupling, off-by-one boundary errors, and the requirement that all data be held simultaneously in memory.',
      mentalModel: 'The Book vs The Bookmark: An iterable is a book on the shelf. You can open it multiple times from the beginning. An iterator is a bookmark tracking your current page. Moving the bookmark advances through the pages. Once you reach the back cover, the bookmark cannot advance further unless you open a brand new bookmark.',
      realWorldUse: 'Traversing multi-gigabyte log files line-by-line, processing database query result cursors, and generating cryptographic sequence tokens.',
      commonMistakes: [
        'Failing to return self from an iterator __iter__() method, breaking compatibility with functions expecting standard Python iterators.',
        'Assuming iterators can be rewound or restarted: once an iterator raises StopIteration, it is permanently exhausted.',
        'Confusing an iterable container (e.g. list, range) with an iterator: calling iter(my_list) produces a NEW iterator every time, whereas calling iter(my_iterator) returns the SAME iterator state.',
      ],
      commonMisconceptions: [
        'Misconception: "Any object with a for loop is an iterator." Reality: Collections like list and dict are iterables, NOT iterators. They create and return a separate iterator object when iter() is called on them.',
        'Misconception: "StopIteration is an abnormal runtime crash." Reality: StopIteration is the standard, expected control-flow signal in Python indicating that an iteration sequence has cleanly completed.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b18-d88-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building Class-Based Iterators: BoundedCounter & Exhaustion Invariants',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates implementing a custom class-based iterator adhering strictly to the Iterator Protocol, verifying self-return from __iter__, native StopIteration exhaustion, and single-pass consumption.',
      language: 'python',
      codeSnippet: `class BoundedCounter:
    """A custom class-based iterator adhering strictly to the Python Iterator Protocol."""
    def __init__(self, low: int, high: int):
        self.current = low
        self.high = high

    def __iter__(self):
        # Invariant: Iterators must return self from __iter__()
        return self

    def __next__(self) -> int:
        if self.current > self.high:
            # Invariant: Exhaustion signaled exclusively via native StopIteration
            raise StopIteration
        val = self.current
        self.current += 1
        return val

# 1. Verification of Iterator Protocol Invariants
counter = BoundedCounter(1, 3)

# Invariant: iter(iterator) is iterator
assert iter(counter) is counter, "Iterator __iter__ must return self!"

# Invariant: Step-by-step __next__() traversal
assert next(counter) == 1
assert next(counter) == 2
assert next(counter) == 3

# Invariant: Exhaustion continuously raises StopIteration
try:
    next(counter)
    assert False, "Should have raised StopIteration"
except StopIteration:
    pass

# Calling next() again continues to raise StopIteration
try:
    next(counter)
    assert False, "Exhausted iterator must continue raising StopIteration"
except StopIteration:
    pass

# 2. Iteration via for loop (compiles to GET_ITER and FOR_ITER bytecode)
counter2 = BoundedCounter(10, 12)
items = [x for x in counter2]
assert items == [10, 11, 12]

# Subsequent iteration over the exhausted iterator yields 0 items
remaining = [x for x in counter2]
assert remaining == [], "Exhausted iterator yields no items on second pass"
print("Iterator Protocol invariants verified cleanly!")
`,
    } as ExampleBlock,
    {
      id: 'blk-b18-d88-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Implementing a Stateful CircularBufferIterator with Safe Boundary Invariants',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Create a class CircularBufferIterator that wraps a sequence and iterates up to max_steps cycles.',
        'Implement __iter__() returning self.',
        'Implement __next__() advancing circularly through the elements using modulo arithmetic.',
        'When total steps reach max_steps, raise native StopIteration.',
        'Handle empty input sequence by immediately raising StopIteration on first next() call.',
      ],
      expectedOutcome: 'A robust class-based iterator demonstrating modular state traversal and clean protocol termination.',
      starterCode: `class CircularBufferIterator:
    def __init__(self, items, max_steps: int):
        self.items = list(items)
        self.max_steps = max_steps
        self.step = 0
        self.index = 0

    def __iter__(self):
        # TODO: Return self as required by iterator protocol
        pass

    def __next__(self):
        # TODO: Check exhaustion against max_steps and empty items
        # TODO: Yield circular element and advance index and step
        pass
`,
      hints: [
        'If len(self.items) == 0 or self.step >= self.max_steps, raise StopIteration immediately.',
        'Compute next element as self.items[self.index % len(self.items)], then increment step and index.',
      ],
      solutionReference: `class CircularBufferIterator:
    def __init__(self, items, max_steps: int):
        self.items = list(items)
        self.max_steps = max_steps
        self.step = 0
        self.index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if not self.items or self.step >= self.max_steps:
            raise StopIteration
        val = self.items[self.index % len(self.items)]
        self.index += 1
        self.step += 1
        return val
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b18-d88-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: The Single-Pass Traversal Invariant',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Given `numbers = [1, 2, 3]` and `it = iter(numbers)`, what is the output of `list(it)` followed immediately by `list(it)`?',
      options: [
        '[1, 2, 3] followed by [1, 2, 3]',
        '[1, 2, 3] followed by []',
        '[1, 2, 3] followed by a RuntimeError',
        '[] followed by [1, 2, 3]',
      ],
      correctIndex: 1,
      explanation: 'An iterator is a single-pass consumable state machine. The first call to `list(it)` iterates `it` until StopIteration is raised, exhausting the iterator. The second call to `list(it)` calls `iter(it)` (which returns `it` itself) and then `next(it)`, which immediately raises StopIteration, yielding an empty list `[]`.',
      misconceptionIdentified: 'Believing that iterators automatically reset to the beginning when passed to subsequent collection constructors.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 89: APPLY — Generator Functions, yield Mechanics & Memory Physics ──
export const DAY_89_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w18-018',
  dayNumber: 2,
  title: 'Generator Functions, yield Mechanics & Memory Physics',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b18-d89-01',
      type: 'THEORY',
      order: 1,
      title: 'Generator Functions, Frame Suspension Mechanics & Asymptotic vs Empirical Memory',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand generator functions as resumable suspension state machines. Analyze execution frame suspension across yield points, lazy on-demand evaluation, asymptotic memory efficiency (O(1) auxiliary generator vs O(N) materialized list), generator expressions, and empirical memory profiling with tracemalloc.',
      whatItIs: 'A GENERATOR FUNCTION is a function containing the yield keyword. Calling a generator function does not execute its body; instead, it compiles to a bytecode object with CO_GENERATOR flag and returns a generator iterator. When next() is called on the generator, execution begins or resumes from the last yield point. The yield statement produces a value and suspends the execution frame (preserving local variables and instruction pointer).',
      whyItExists: 'Enables writing stateful iterators without class boilerplate (__iter__, __next__, manual state attributes). Enables processing unbounded or multi-gigabyte data streams with O(1) auxiliary space.',
      problemSolved: 'Eliminates memory exhaustion crashes (Out-Of-Memory / OOM) caused by eagerly constructing massive lists when only sequential element traversal is required.',
      mentalModel: 'The Assembly Line Station: An eager function manufactures all 1,000,000 widgets and stacks them in a massive warehouse before shipping. A generator manufactures exactly one widget, hands it to the courier, and pauses until the courier arrives asking for the next widget.',
      realWorldUse: 'Streaming large CSV/JSON datasets, reading database rows in batches, streaming real-time sensor measurements, and generating infinite series.',
      commonMistakes: [
        'Attempting to call next() on the generator function itself rather than on the generator instance returned by calling the function.',
        'Accidentally materializing a generator stream with list(gen) or tuple(gen) when attempting to stream, immediately defeating all memory benefits.',
        'Treating empirical tracemalloc or sys.getsizeof numbers as mathematical proofs of asymptotic complexity rather than profiling evidence.',
      ],
      commonMisconceptions: [
        'Misconception: "Generator functions run on a background thread." Reality: Generators are strictly synchronous, single-threaded execution frames that yield control back to the caller.',
        'Misconception: "A generator expression (x for x in data) is identical to [x for x in data] except with parentheses." Reality: The list comprehension eagerly evaluates and allocates full memory upfront; the generator expression creates a lazy generator iterator that computes values only when requested.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b18-d89-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Empirical Memory Comparison: Materialized List vs Generator Expression',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates lazy evaluation and profiles the empirical memory difference between an eager list comprehension and an O(1) auxiliary space generator expression.',
      language: 'python',
      codeSnippet: `import sys

# 1. Generator Function Suspension Mechanics
def countdown(n: int):
    print("[LOG] Starting generator execution")
    while n > 0:
        print(f"[LOG] About to yield {n}")
        yield n
        print(f"[LOG] Resumed after yielding {n}")
        n -= 1
    print("[LOG] Exiting generator cleanly")

# Calling countdown() does NOT execute code yet
gen = countdown(3)
print("Generator instance created, body not yet run")

assert next(gen) == 3
assert next(gen) == 2
assert next(gen) == 1

try:
    next(gen)
    assert False, "Should raise StopIteration on clean exit"
except StopIteration:
    print("Generator exhausted cleanly!")

# 2. Empirical Memory Footprint Comparison
N = 100_000

# Materialized List: Allocates full O(N) memory upfront
materialized_list = [x * x for x in range(N)]
list_bytes = sys.getsizeof(materialized_list)

# Lazy Generator: Retains O(1) auxiliary state regardless of N
lazy_gen = (x * x for x in range(N))
gen_bytes = sys.getsizeof(lazy_gen)

print(f"Memory for {N} items:")
print(f"  Materialized List: {list_bytes:,} bytes (~{list_bytes / 1024:.1f} KB)")
print(f"  Lazy Generator:    {gen_bytes:,} bytes")
assert gen_bytes < list_bytes / 100, "Generator must consume a tiny fraction of list memory!"

# 3. Qualification: Fixed P stages require O(P) frame state, O(1) with respect to stream size N
print("Empirical memory profiling confirms lazy generation efficiency!")
`,
    } as ExampleBlock,
    {
      id: 'blk-b18-d89-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Refactoring an Eager Memory-Heavy Batch Processor into a Streaming Pipeline',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Write a generator function stream_filter_positive(numbers) yielding only numbers > 0.',
        'Write a generator function stream_square(numbers) yielding x * x for each item.',
        'Write a generator function stream_take(numbers, count) yielding up to count elements.',
        'Chain the generators into a composable pipeline: stream_take(stream_square(stream_filter_positive(data)), 3).',
        'Verify that the pipeline processes an infinite input generator without memory bloat or hanging.',
      ],
      expectedOutcome: 'A composable multi-stage lazy generator pipeline processing unbounded data in O(1) auxiliary memory per stage.',
      starterCode: `def stream_filter_positive(numbers):
    # TODO: Yield only numbers > 0 lazily
    pass

def stream_square(numbers):
    # TODO: Yield x * x lazily
    pass

def stream_take(numbers, count: int):
    # TODO: Yield up to count items then stop
    pass
`,
      hints: [
        'Use standard for x in numbers: with yield inside the loop.',
        'In stream_take, track an integer taken = 0 and return when taken >= count.',
      ],
      solutionReference: `def stream_filter_positive(numbers):
    for x in numbers:
        if x > 0:
            yield x

def stream_square(numbers):
    for x in numbers:
        yield x * x

def stream_take(numbers, count: int):
    taken = 0
    for x in numbers:
        if taken >= count:
            return
        yield x
        taken += 1
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b18-d89-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Generator Frame Suspension and Evaluation Timing',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In the code snippet:\n```python\ndef compute():\n    print("A")\n    yield 1\n    print("B")\n    yield 2\n\ng = compute()\nprint("C")\nnext(g)\n```\nWhat is the exact sequence of printed letters?',
      options: [
        'A, B, C',
        'A, C',
        'C, A',
        'C, A, B',
      ],
      correctIndex: 2,
      explanation: 'Calling `compute()` creates the generator object without executing any code in the body. `print("C")` executes first. Then `next(g)` starts execution of `compute()`, running up to the first yield point: `print("A")` runs and `1` is produced, suspending the frame before `print("B")`. Therefore, the exact sequence is "C" then "A".',
      misconceptionIdentified: 'Believing that calling a generator function executes code up to the first yield before returning the generator object.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 90: BUILD — Advanced Generator Control: yield from, .send(), .throw() & .close() ──
export const DAY_90_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w18-018',
  dayNumber: 3,
  title: 'Advanced Generator Control: yield from, .send(), .throw() & .close()',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b18-d90-01',
      type: 'THEORY',
      order: 1,
      title: 'Bidirectional Generator Communication, Priming Contracts & Subgenerator Delegation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master bidirectional generator communication with .send(), exception injection with .throw(), graceful teardown with .close() and GeneratorExit, priming rules (native TypeError on unprimed send), and transparent subgenerator delegation via yield from.',
      whatItIs: 'In Python, generators can act as bidirectional data consumers (generator-based coroutines). The expression val = yield produces a value outwards to the caller and receives a value sent inwards via gen.send(val). Subgenerator delegation via yield from subgen establishes a transparent bidirectional channel between caller and subgenerator, automatically forwarding values, exceptions, and returns.',
      whyItExists: 'Enables building stateful stream accumulators, event sinks, and layered streaming architectures without threading or complex callback hierarchies.',
      problemSolved: 'Solves two-way interactive data exchange in streaming pipelines and simplifies nested generator delegation.',
      mentalModel: 'The Two-Way Pneumatic Tube: Instead of a one-way slide that only drops items down, yield is a pneumatic tube. It sends an item up to the caller, and pauses. The caller can inspect the item, put a response into the tube, and hit .send(reply), sending data back down to the worker.',
      realWorldUse: 'Event aggregation, sliding statistical accumulators, pipeline flow-control, and simulation engines.',
      commonMistakes: [
        'Attempting to call gen.send(val) with non-None on a newly created, unprimed generator, which immediately raises native TypeError.',
        'Yielding a value inside a finally: block when handling GeneratorExit, which causes Python to raise RuntimeError: generator ignored GeneratorExit.',
        'Calling .send() on a closed or terminated generator, expecting a custom error instead of Python native StopIteration.',
      ],
      commonMisconceptions: [
        'Misconception: "yield from is just syntactic sugar for a for-loop." Reality: yield from establishes a full transparent bidirectional channel: it forwards .send(), catches and delegates .throw(), handles .close(), and captures the subgenerator return value: result = yield from subgen().',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b18-d90-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Constructing a Generator-Based Coroutine Event Accumulator with .send() and .close()',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates generator priming with next(g) or g.send(None), bidirectional data exchange via .send(), graceful teardown with .close(), and native StopIteration on post-close send.',
      language: 'python',
      codeSnippet: `def running_average_consumer():
    """Generator-based coroutine calculating running average of sent values."""
    total = 0.0
    count = 0
    average = 0.0
    try:
        while True:
            # Yields current average and receives next value from caller
            val = yield average
            if val is not None:
                total += val
                count += 1
                average = total / count
    except GeneratorExit:
        # Invariant: Graceful teardown upon .close()
        print(f"[CLEANUP] Consumer closed. Final count: {count}, total: {total}")
        # MUST NOT yield here; return terminates cleanly
        return

# 1. Unprimed Send Invariant: Sending non-None raises native TypeError
consumer = running_average_consumer()
try:
    consumer.send(10.0)
    assert False, "Should raise TypeError on unprimed send"
except TypeError as e:
    print(f"Verified unprimed send raises TypeError: {e}")

# 2. Priming the generator: Advances execution to first yield
prime_val = next(consumer)  # or consumer.send(None)
assert prime_val == 0.0

# 3. Sending data bidirectionally
assert consumer.send(10.0) == 10.0  # avg of [10] = 10.0
assert consumer.send(20.0) == 15.0  # avg of [10, 20] = 15.0
assert consumer.send(30.0) == 20.0  # avg of [10, 20, 30] = 20.0

# 4. Graceful Teardown via .close()
consumer.close()

# 5. Post-Close Invariant: Subsequent send raises native StopIteration
try:
    consumer.send(40.0)
    assert False, "Should raise StopIteration on closed generator"
except StopIteration:
    print("Verified post-close send raises native StopIteration!")
`,
    } as ExampleBlock,
    {
      id: 'blk-b18-d90-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Building a Composable Generator Pipeline with yield from Delegation',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Write a subgenerator stream_sequence(start, end) that yields numbers from start to end and returns the sum of all yielded numbers.',
        'Write an outer generator stream_batches(*ranges) that uses yield from to delegate to stream_sequence for each range, collecting their return values.',
        'Verify that the outer generator yields all sequence numbers seamlessly.',
        'Verify that the return value of the subgenerator is captured correctly by the outer generator.',
      ],
      expectedOutcome: 'A multi-tier delegating generator demonstrating transparent yield from data forwarding and subgenerator return value extraction.',
      starterCode: `def stream_sequence(start: int, end: int):
    # TODO: Yield numbers from start to end inclusive
    # TODO: Return the total sum of yielded numbers
    pass

def stream_batches(*ranges):
    # TODO: For each (start, end) in ranges, delegate with yield from
    # TODO: Capture and record total sum from each subgenerator
    pass
`,
      hints: [
        'In stream_batches, use total = yield from stream_sequence(start, end) to receive the subgenerator return value.',
      ],
      solutionReference: `def stream_sequence(start: int, end: int):
    total = 0
    for x in range(start, end + 1):
        total += x
        yield x
    return total

def stream_batches(*ranges):
    totals = []
    for start, end in ranges:
        total = yield from stream_sequence(start, end)
        totals.append(total)
    return totals
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b18-d90-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Generator Teardown & GeneratorExit Invariant',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What happens if a generator function attempts to execute `yield "extra"` inside an `except GeneratorExit:` or `finally:` block triggered by `gen.close()`?',
      options: [
        'The yielded value is returned to gen.close().',
        'Python catches the yield and ignores it silently.',
        'Python raises RuntimeError: generator ignored GeneratorExit.',
        'The generator restarts from the beginning.',
      ],
      correctIndex: 2,
      explanation: 'When `gen.close()` is called, Python injects a `GeneratorExit` exception at the yield point. The generator is expected to exit cleanly (or perform cleanup and return). If the generator attempts to yield another value while handling `GeneratorExit`, Python terminates the generator and raises `RuntimeError: generator ignored GeneratorExit`.',
      misconceptionIdentified: 'Believing that generators can continue yielding data during a forced close() teardown.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 91: DEBUG — Iterator Pitfalls, Container Mutation & PEP 479 Semantics ──
export const DAY_91_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w18-018',
  dayNumber: 4,
  title: 'Iterator Pitfalls, Container Mutation & PEP 479 Semantics',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b18-d91-01',
      type: 'THEORY',
      order: 1,
      title: 'Taxonomy of 5 Iterator Defects: Mutation Invalidation, PEP 479 & Premature Exhaustion',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Analyze 5 classic iteration defects: container mutation divergence (dict/set RuntimeError vs list index shifting), accidental iterator sharing / premature exhaustion, PEP 479 StopIteration conversion to RuntimeError, silent re-iteration bugs, and resource-cleanup hazards from abandoned generators.',
      whatItIs: 'Taxonomy of iteration defects: 1) Container Mutation Invalidation: Modifying containers during iteration causes dict and set iterators to immediately raise RuntimeError because their internal hash table size changes; list iteration does NOT raise RuntimeError, but instead produces silent bugs (skipped elements, duplicates, or shifted views) as internal index pointers drift. 2) Accidental Iterator Sharing: Passing a single iterator to multiple consumers or operations exhausts items unexpectedly. 3) PEP 479 Semantics: In Python 3.7+, an unhandled StopIteration raised inside a generator is automatically converted to RuntimeError to prevent silent masking of upstream errors. 4) Silent Re-Iteration: Code expecting a reusable iterable receiving an iterator and executing zero iterations on the second pass. 5) Resource-Cleanup Hazards: Generators holding underlying files or connections that remain open if iteration is abandoned without close().',
      whyItExists: 'Iteration bugs are among the most common sources of silent data corruption in production pipelines because iterators do not crash when exhausted—they simply yield zero items.',
      problemSolved: 'Equips engineers with defensive diagnostic test patterns to isolate exhaustion drift, safe snapshot iteration, and clean PEP 479 compliance.',
      mentalModel: 'The Moving Conveyor Belt: Modifying a list while traversing it is like moving items around on a conveyor belt while standing in front of it: you miss items that jumped behind you and double-process items placed ahead of you.',
      realWorldUse: 'Debugging data cleansing scripts, sanitizing dictionary caches, preventing production pipeline crashes under Python 3.14.',
      commonMistakes: [
        'Writing "raise StopIteration" directly inside a generator function, which crashes with RuntimeError under PEP 479 instead of cleanly stopping.',
        'Iterating over a list while calling list.remove(item) inside the loop, silently skipping adjacent elements.',
        'Calling min(it) and then max(it) on the same iterator: min(it) exhausts the iterator, causing max(it) to raise ValueError: max() arg is an empty sequence.',
      ],
      commonMisconceptions: [
        'Misconception: "Mutating any container during iteration raises RuntimeError." Reality: Dictionaries and sets raise RuntimeError; lists silently shift indices without raising any error, leading to silent bugs.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b18-d91-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge: Triaging In-Flight List Mutation & PEP 479 Violations',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_ITERATORS_AND_GENERATORS,
      problemDescription: 'A telemetry processing module suffers from 3 critical bugs: (1) In-flight deletion from a list of records skips every second consecutive error record; (2) A generator helper explicitly raises StopIteration, crashing with RuntimeError under PEP 479; (3) A summary function attempts to compute both sum() and len() on a single-pass iterator, producing a TypeError or incorrect calculations.',
      symptom: '50% of consecutive invalid records slip into the database undetected, the generator helper crashes the service with RuntimeError, and metric summaries report 0 total elements.',
      brokenArtifact: `def prune_invalid_records(records):
    # BUG 1: Mutating list in-place during iteration skips adjacent invalid items!
    for record in records:
        if not record.get("valid"):
            records.remove(record)
    return records

def stream_positive_until_negative(stream):
    # BUG 2: Raising StopIteration inside generator triggers PEP 479 RuntimeError!
    for item in stream:
        if item < 0:
            raise StopIteration
        yield item

def compute_stream_stats(stream):
    # BUG 3: Double consumption of single-pass iterator!
    # sum(stream) exhausts the iterator, len() is not supported on iterators
    total = sum(stream)
    count = sum(1 for _ in stream)  # Will always be 0!
    return {"total": total, "count": count}
`,
      reproductionSteps: [
        'Call prune_invalid_records([{"valid": False}, {"valid": False}, {"valid": True}]) -> second invalid item remains!',
        'Call list(stream_positive_until_negative([1, 2, -1, 3])) -> raises RuntimeError: StopIteration under PEP 479!',
        'Call compute_stream_stats(iter([10, 20, 30])) -> returns count=0 instead of count=3!',
      ],
      expectedPatch: 'Rebuild prune_invalid_records using list comprehension or filtering; replace raise StopIteration with return in stream_positive_until_negative; consume stream in a single pass accumulating total and count simultaneously in compute_stream_stats.',
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b18-d91-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Writing an Invariant Verification Harness for Single-Pass Iterator Integrity',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Write assert_single_pass_integrity(iterator_factory) testing that returned iterators behave as single-pass state machines.',
        'Verify that iter(it) is it.',
        'Verify that complete consumption leaves the iterator exhausted.',
        'Verify that subsequent next() calls consistently raise StopIteration without reviving.',
      ],
      expectedOutcome: 'A comprehensive invariant test harness validating the strict contract of custom iterators.',
      starterCode: `def verify_iterator_invariants(it):
    # TODO: Verify self-identity from __iter__, step traversal, and persistent exhaustion
    pass
`,
      hints: [
        'Check iter(it) is it.',
        'Consume with list(it), then call next(it) twice and assert StopIteration both times.',
      ],
      solutionReference: `def verify_iterator_invariants(it):
    assert iter(it) is it, "Iterator must return self from __iter__()"
    consumed = list(it)
    for _ in range(3):
        try:
            next(it)
            assert False, "Exhausted iterator must continuously raise StopIteration"
        except StopIteration:
            pass
    return True
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b18-d91-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: PEP 479 and Container Mutation Mechanics',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which statement accurately contrasts dictionary mutation during iteration with list mutation during iteration?',
      options: [
        'Both dictionaries and lists immediately raise RuntimeError if modified during iteration.',
        'Dictionaries raise RuntimeError when modified during iteration; lists do not raise RuntimeError, but can silently skip or duplicate elements as index offsets shift.',
        'Lists raise RuntimeError; dictionaries silently ignore newly added keys.',
        'Python creates an automatic shadow copy of both lists and dictionaries during iteration.',
      ],
      correctIndex: 1,
      explanation: 'CPython tracks a dictionary internal version/size counter during iteration and immediately raises `RuntimeError: dictionary changed size during iteration` if altered. In contrast, list iteration simply tracks an internal integer index; removing or adding elements shifts list items across index slots without error, silently causing subsequent items to be skipped or repeated.',
      misconceptionIdentified: 'Believing that Python runtime engines detect in-flight mutations identically across all built-in container types.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 92: TRANSFER — Operational Formative Assessment: High-Throughput Memory-Bounded Stream Engine ──
export const DAY_92_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m5-w18-018',
  assessmentCode: 'ASM-PFS-M5-W18-018',
  title: 'Batch 018 Formative Assessment: High-Throughput Memory-Bounded Stream Processing Engine',
  description: 'Synthesize lazy streaming transformers (chunking with trailing partial chunk emission, sliding complete windows, multi-way sorted merge with key extraction and stream-index tie-breaking) and a bidirectional generator-based coroutine event consumer with clean lifecycle management.',
  type: 'CODE',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  difficulty: 'ADVANCED',
  timeLimitMinutes: 95,
  passingScore: 70,
  maxAttempts: 3,
  attemptPolicy: 'LIMITED_BEST',
  targetCompetencyId: COMPETENCY_ID_ITERATORS_AND_GENERATORS,
  batchId: 'batch-pfs-m5-w18-018',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
  items: [
    {
      id: 'item-b18-01',
      assessmentId: 'asm-pfs-m5-w18-018',
      itemType: 'CODE',
      points: 100,
      order: 1,
      timeEstimateMinutes: 95,
      version: '1.0.0',
      prompt: `Implement a high-throughput, memory-bounded lazy stream processing engine adhering strictly to Python iterator and generator protocol invariants:

TASK A: Lazy Streaming Transforms
1. chunk_stream(stream, chunk_size: int):
   - Contract: Lazily yields tuples of up to chunk_size elements from stream.
   - Validation: chunk_size must be strictly an int and >= 1 (rejecting bool); otherwise raise InvalidChunkSizeError.
   - Trailing Partial Chunk Rule: When the input stream ends, if remaining elements exist (1 <= count < chunk_size), yield that final partial chunk as a tuple.
   - If stream is empty, yield 0 chunks.
   - Space Complexity: Strictly bounded O(chunk_size) auxiliary space.

2. window_stream(stream, window_size: int):
   - Contract: Lazily yields sliding windows of window_size elements with step size 1.
   - Validation: window_size must be strictly an int and >= 1 (rejecting bool); otherwise raise InvalidChunkSizeError.
   - Incomplete Window Rule: Emit ONLY complete windows. If stream contains fewer than window_size elements, yield 0 windows.
   - Space Complexity: Strictly bounded O(window_size) auxiliary space using deque(maxlen=window_size).

3. merge_sorted_streams(*streams, key=None):
   - Precondition: Each input stream in streams is individually sorted in non-decreasing order.
   - Comparability: When key is not None, key(item) must produce mutually comparable values. When key is None, the items themselves must be mutually comparable.
   - Multi-Way Merge & Tie-Breaking: Uses a min-heap to merge streams in O(K) space (K = number of active streams).
   - Heap Entry Structure: (sort_key, stream_index, item), where sort_key is key(item) if key is not None else item.
   - Payload Safety: Ties are broken deterministically by stream_index. Because stream_index is unique among active stream heads, Python NEVER compares item. Non-comparable items (e.g. dicts) are completely safe when key is provided.

TASK B: Generator-Based Coroutine Consumer
4. event_stream_consumer(threshold: float = 100.0):
   - Generator-based coroutine receiving numeric measurements via .send(event).
   - Priming: Must be primed via next(consumer) or consumer.send(None) before receiving data. Sending non-None to an unprimed consumer raises native TypeError.
   - Status Yield: After each accepted event, yields a status dictionary:
       {"count": int, "total": float, "anomalies": int, "latest": float}
     where anomalies counts events strictly greater than threshold.
   - Teardown: On consumer.close(), catches GeneratorExit in finally, performs clean teardown, and terminates cleanly without yielding.
   - Post-Close: Sending to a closed consumer raises native StopIteration.

CANONICAL DOMAIN EXCEPTIONS:
  class StreamProcessingError(Exception): pass
  class InvalidChunkSizeError(StreamProcessingError): pass
`,
      starterCode: `from collections import deque
import heapq

class StreamProcessingError(Exception):
    """Base exception for domain-level stream processing errors."""
    pass

class InvalidChunkSizeError(StreamProcessingError):
    """Raised when chunk_size or window_size is not an integer >= 1 (e.g. non-int, bool, or < 1)."""
    pass

# ── TASK A: Chunking, Windowing & Multi-Way Merge Transforms ──

def chunk_stream(stream, chunk_size: int):
    """
    Lazily yields tuples of up to chunk_size elements from stream.
    
    Contracts:
    - Raises InvalidChunkSizeError if type(chunk_size) is not int or chunk_size < 1 (rejecting bool).
    - Yields full chunks of size chunk_size as tuples.
    - Trailing partial chunk rule: If stream ends with remaining items (1 <= count < chunk_size),
      yields that final partial chunk as a tuple.
    - If stream is empty, yields 0 chunks.
    - Auxiliary space complexity: Strictly bounded O(chunk_size).
    """
    # TODO: Validate chunk_size, iterate lazily, yield full & trailing partial chunks
    pass

def window_stream(stream, window_size: int):
    """
    Lazily yields sliding windows of window_size elements with step size 1.
    
    Contracts:
    - Raises InvalidChunkSizeError if type(window_size) is not int or window_size < 1 (rejecting bool).
    - Yields only complete windows as tuples.
    - Incomplete window rule: If stream contains fewer than window_size elements,
      yields 0 windows.
    - Auxiliary space complexity: Strictly bounded O(window_size) using deque(maxlen=window_size).
    """
    # TODO: Validate window_size, slide window of step 1, yield complete windows
    pass

def merge_sorted_streams(*streams, key=None):
    """
    Lazily merges multiple sorted input streams into a single sorted stream.
    
    Preconditions:
    - Each input stream in streams is individually sorted in non-decreasing order.
    - When key is not None, key(item) must produce mutually comparable values.
    - When key is None, the items themselves must be mutually comparable.
    
    Contracts:
    - Uses a min-heap to achieve O(K) auxiliary space (K = number of active streams).
    - Sort Key vs Payload Separation:
      Heap entries are stored as (sort_key, stream_index, item).
      sort_key is computed as key(item) if key is not None else item.
    - Deterministic tie-breaking: When items from different streams have equal sort_key,
      the tie is broken by stream_index (yielding the item from the lower stream index).
    - Payload Safety: Because stream_index is unique among active stream heads,
      Python's tuple comparison is fully resolved at stream_index and NEVER compares item.
      When key is provided, unorderable payloads (e.g. dicts) are completely safe.
    - If no streams or all streams are empty, yields 0 items.
    """
    # TODO: Initialize heap with first item from each non-empty stream
    # TODO: Yield minimum item, pull next item from that stream, maintain heap
    pass

# ── TASK B: Generator-Based Coroutine Consumer ──

def event_stream_consumer(threshold: float = 100.0):
    """
    Generator-based coroutine that accepts numeric event measurements via .send(event).
    
    Contracts:
    - Must be primed via next(consumer) or consumer.send(None) before receiving data.
    - Sending non-None to unprimed consumer raises native TypeError.
    - Yields current status dictionary after each accepted event:
        {"count": int, "total": float, "anomalies": int, "latest": float}
        where anomalies counts events strictly greater than threshold.
    - On consumer.close(), catches GeneratorExit, executes cleanup block in finally,
      and terminates cleanly without yielding.
    - Sending to a closed consumer raises native StopIteration.
    """
    # TODO: Implement generator-based coroutine with priming and GeneratorExit teardown
    pass
`,
      solutionCode: `from collections import deque
import heapq

class StreamProcessingError(Exception):
    """Base exception for domain-level stream processing errors."""
    pass

class InvalidChunkSizeError(StreamProcessingError):
    """Raised when chunk_size or window_size is not an integer >= 1 (e.g. non-int, bool, or < 1)."""
    pass

def chunk_stream(stream, chunk_size: int):
    if type(chunk_size) is not int or chunk_size < 1:
        raise InvalidChunkSizeError(f"chunk_size must be an integer >= 1, received {chunk_size!r}")
    
    chunk = []
    for item in stream:
        chunk.append(item)
        if len(chunk) == chunk_size:
            yield tuple(chunk)
            chunk = []
    if chunk:
        yield tuple(chunk)

def window_stream(stream, window_size: int):
    if type(window_size) is not int or window_size < 1:
        raise InvalidChunkSizeError(f"window_size must be an integer >= 1, received {window_size!r}")
    
    buf = deque(maxlen=window_size)
    for item in stream:
        buf.append(item)
        if len(buf) == window_size:
            yield tuple(buf)

def merge_sorted_streams(*streams, key=None):
    heap = []
    # Convert all inputs to active iterators
    active_iters = [iter(s) for s in streams]
    
    # Initialize heap with (sort_key, stream_index, item)
    for idx, it in enumerate(active_iters):
        try:
            val = next(it)
            sort_key = key(val) if key is not None else val
            heapq.heappush(heap, (sort_key, idx, val))
        except StopIteration:
            continue
            
    while heap:
        sort_key, idx, val = heapq.heappop(heap)
        yield val
        try:
            next_val = next(active_iters[idx])
            next_key = key(next_val) if key is not None else next_val
            heapq.heappush(heap, (next_key, idx, next_val))
        except StopIteration:
            continue

def event_stream_consumer(threshold: float = 100.0):
    count = 0
    total = 0.0
    anomalies = 0
    latest = 0.0
    status = {"count": 0, "total": 0.0, "anomalies": 0, "latest": 0.0}
    
    try:
        while True:
            event = yield status
            if event is not None:
                count += 1
                total += float(event)
                latest = float(event)
                if event > threshold:
                    anomalies += 1
                status = {
                    "count": count,
                    "total": total,
                    "anomalies": anomalies,
                    "latest": latest,
                }
    except GeneratorExit:
        return
`,
      rubricDimensions: [
        {
          id: 'dim-b18-01',
          name: 'Chunking Stream Transformation & Trailing Chunk Invariant',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
          description: 'Validates chunk_stream produces exact full chunks, emits trailing partial chunk when stream ends with remaining elements, handles empty streams, and rejects invalid chunk sizes.',
          criteria: 'Validates chunk_stream produces exact full chunks, emits trailing partial chunk when stream ends with remaining elements, handles empty streams, and rejects invalid chunk sizes. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
        },
        {
          id: 'dim-b18-02',
          name: 'Sliding Window Stream & Complete-Window Invariant',
          weight: 0.15,
          maxPoints: 15,
          description: 'Validates window_stream emits only complete sliding windows of step 1, produces 0 windows when stream has fewer than window_size elements, and bounds memory via deque.',
          criteria: 'Validates window_stream emits only complete sliding windows of step 1, produces 0 windows when stream has fewer than window_size elements, and bounds memory via deque.',
        },
        {
          id: 'dim-b18-03',
          name: 'Multi-Way Sorted Stream Merging & Stream Index Tie-Breaking',
          weight: 0.15,
          maxPoints: 15,
          description: 'Validates merge_sorted_streams correctly merges multiple pre-sorted streams in O(K) space, deterministically breaking ties using source stream index.',
          criteria: 'Validates merge_sorted_streams correctly merges multiple pre-sorted streams in O(K) space, deterministically breaking ties using source stream index.',
        },
        {
          id: 'dim-b18-04',
          name: 'Key Extractor & Payload Isolation Invariant',
          weight: 0.10,
          maxPoints: 10,
          description: 'Validates merge_sorted_streams supports custom key extractor function, safely processing unorderable payloads (e.g. dicts) without TypeError.',
          criteria: 'Validates merge_sorted_streams supports custom key extractor function, safely processing unorderable payloads (e.g. dicts) without TypeError.',
        },
        {
          id: 'dim-b18-05',
          name: 'Generator-Based Coroutine Lifecycle, Priming & Clean Teardown',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
          description: 'Validates event_stream_consumer priming requirement (TypeError on unprimed non-None send), bidirectional .send() tracking, graceful GeneratorExit handling on .close(), and native StopIteration on post-close send.',
          criteria: 'Validates event_stream_consumer priming requirement (TypeError on unprimed non-None send), bidirectional .send() tracking, graceful GeneratorExit handling on .close(), and native StopIteration on post-close send. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
        },
        {
          id: 'dim-b18-06',
          name: 'Domain Size Validation & Native Exception Invariants',
          weight: 0.05,
          maxPoints: 5,
          description: 'Validates InvalidChunkSizeError strictly raised when chunk_size or window_size is not an int or is < 1 (strictly rejecting bool), and verifies native StopIteration on iterator exhaustion.',
          criteria: 'Validates InvalidChunkSizeError strictly raised when chunk_size or window_size is not an int or is < 1 (strictly rejecting bool), and verifies native StopIteration on iterator exhaustion.',
        },
        {
          id: 'dim-b18-07',
          name: 'Memory Boundedness & Lazy Stream Consumption Invariant',
          weight: 0.05,
          maxPoints: 5,
          description: 'Validates that streaming operations process elements lazily on demand without eager full-stream materialization.',
          criteria: 'Validates that streaming operations process elements lazily on demand without eager full-stream materialization.',
        },
      ],
      visibleTests: [
        {
          name: 'test_chunk_stream_basic_and_trailing',
          assertion: 'list(chunk_stream([1, 2, 3, 4, 5], 2)) == [(1, 2), (3, 4), (5,)]',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_chunk_stream_exact_multiple',
          assertion: 'list(chunk_stream([1, 2, 3, 4], 2)) == [(1, 2), (3, 4)]',
          points: 5,
          tier: 'VISIBLE',
        },
        {
          name: 'test_window_stream_basic',
          assertion: 'list(window_stream([1, 2, 3, 4, 5], 3)) == [(1, 2, 3), (2, 3, 4), (3, 4, 5)]',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_merge_sorted_streams_basic',
          assertion: 'list(merge_sorted_streams(iter([1, 4, 7]), iter([2, 5, 8]), iter([3, 6, 9]))) == [1, 2, 3, 4, 5, 6, 7, 8, 9]',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_event_consumer_basic_lifecycle',
          assertion: 'c = event_stream_consumer(threshold=50.0); next(c); r1 = c.send(30.0); r2 = c.send(80.0); c.close(); r1["count"] == 1 and r2["anomalies"] == 1',
          points: 10,
          tier: 'VISIBLE',
        },
      ],
      adversarialTests: [
        {
          name: 'test_chunk_stream_invalid_size_types_and_values',
          assertion: 'raises_invalid_chunk_size(lambda: list(chunk_stream([1], 0))) and raises_invalid_chunk_size(lambda: list(chunk_stream([1], -2))) and raises_invalid_chunk_size(lambda: list(chunk_stream([1], True))) and raises_invalid_chunk_size(lambda: list(chunk_stream([1], 2.5)))',
          points: 5,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_window_stream_incomplete_emits_nothing',
          assertion: 'list(window_stream([1, 2], 3)) == [] and list(window_stream([], 2)) == []',
          points: 5,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_merge_sorted_streams_deterministic_ties',
          assertion: 's1 = iter([2, 5]); s2 = iter([2, 3]); list(merge_sorted_streams(s1, s2)) == [2, 2, 3, 5]',
          points: 10,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_merge_sorted_streams_unorderable_payloads_with_key',
          assertion: 'd1 = iter([{"ts": 10, "data": "alpha"}]); d2 = iter([{"ts": 10, "data": "beta"}]); res = list(merge_sorted_streams(d1, d2, key=lambda x: x["ts"])); res[0]["data"] == "alpha" and res[1]["data"] == "beta"',
          points: 10,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_event_consumer_unprimed_send_raises_type_error',
          assertion: 'c = event_stream_consumer(); raises_type_error(lambda: c.send(10.0))',
          points: 10,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_event_consumer_post_close_send_raises_stop_iteration',
          assertion: 'c = event_stream_consumer(); next(c); c.close(); raises_stop_iteration(lambda: c.send(10.0))',
          points: 10,
          tier: 'ADVERSARIAL',
        },
      ],
      integrityTests: [
        {
          name: 'test_empty_stream_transforms_yield_zero_items',
          assertion: 'list(chunk_stream([], 5)) == [] and list(window_stream([], 5)) == [] and list(merge_sorted_streams()) == []',
          points: 5,
          tier: 'INTEGRITY',
        },
      ],
    },
  ],
};

export const DAY_92_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w18-018',
  dayNumber: 5,
  title: 'Formative Assessment: High-Throughput Memory-Bounded Stream Processing Engine',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b18-d92-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: High-Throughput Memory-Bounded Stream Processing Engine',
      estimatedMinutes: 80,
      status: 'PUBLISHED',
      version: '1.0.0',
      difficulty: 'ADVANCED',
      timeExpectationMinutes: 80,
      targetCompetencyId: COMPETENCY_ID_ITERATORS_AND_GENERATORS,
      unfamiliarDomainContext: 'High-Throughput Financial Tick Telemetry & Real-Time Event Processing',
      task: 'Synthesize lazy streaming transforms (chunking with trailing partial chunks, sliding windows, multi-way merge with tie-breaking) and a bidirectional generator-based coroutine consumer with clean lifecycle management.',
      constraints: [
        'chunk_stream: Validates type is int and >= 1 (rejecting bool); emits full chunks and final partial chunk.',
        'window_stream: Validates type is int and >= 1 (rejecting bool); emits complete sliding windows of step 1 only.',
        'merge_sorted_streams: Merges sorted streams in O(K) space; tie-breaks on stream index; payloads are never compared when key is provided.',
        'event_stream_consumer: Must be primed (raises native TypeError if unprimed); accumulates stats; handles close() cleanly; post-close raises native StopIteration.',
        'Dual competency floor: Minimum 50% score required on both chunking/merging and coroutine consumer dimensions.',
      ],
      starterArtifact: `from collections import deque
import heapq

class StreamProcessingError(Exception): pass
class InvalidChunkSizeError(StreamProcessingError): pass

def chunk_stream(stream, chunk_size: int):
    pass

def window_stream(stream, window_size: int):
    pass

def merge_sorted_streams(*streams, key=None):
    pass

def event_stream_consumer(threshold: float = 100.0):
    pass
`,
    } as TransferChallengeBlock,
    {
      id: 'blk-b18-d92-02',
      type: 'REFLECTION',
      order: 2,
      title: 'Architectural Reflection: Lazy Evaluation, Memory Bounds & Coroutine Lifecycle in Python',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on the trade-offs of pull-based lazy generator streams versus eager collection processing, space complexity bounds in streaming pipelines, and generator lifecycle invariants.',
      guidingQuestions: [
        'How does lazy on-demand evaluation in generators decouple memory consumption from stream length N?',
        'Why does multi-way stream merging with a min-heap guarantee O(K) auxiliary space where K is stream count, and why is stream-index tie-breaking critical for unorderable payloads?',
        'Why is it important that native generator protocol signaling (StopIteration, TypeError, GeneratorExit) is preserved rather than masked by artificial custom exceptions?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b18-d92-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Batch 018 Reference Sheet: Python Iterator Protocol, Generator Architecture & Streaming Invariants',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Documentation: The Iterator Protocol',
          url: 'https://docs.python.org/3/c-api/iter.html',
        },
        {
          title: 'Python Official Documentation: Generator Functions & Expressions',
          url: 'https://docs.python.org/3/reference/expressions.html#yield-expressions',
        },
        {
          title: 'Python Official Documentation: PEP 479 – Change StopIteration handling inside generators',
          url: 'https://peps.python.org/pep-0479/',
        },
      ],
      documentationExtracts: [
        'Python 3.14 Documentation: An iterator must implement __iter__() returning self and __next__() returning the next value or raising StopIteration.',
        'PEP 479: When StopIteration is raised inside a generator (directly or indirectly by called code), it is converted to RuntimeError unless caught within the generator frame.',
        'Generator Coroutine Protocol: A newly created generator must be primed with next(gen) or gen.send(None) before non-None values can be sent via gen.send(val). Calling gen.close() injects GeneratorExit.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 018 MANIFEST ──
export const BATCH_018_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m5-w18-018',
  batchCode: 'P2-M5-W18-BATCH018',
  title: 'Python Iterator Protocol, Generator Architecture, Lazy Streaming Pipelines & Memory Physics',
  difficulty: 'ADVANCED',
  days: [
    DAY_88_MANIFEST,
    DAY_89_MANIFEST,
    DAY_90_MANIFEST,
    DAY_91_MANIFEST,
    DAY_92_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
};
