// src/lib/curriculum/pythonFullStack/batch013.ts
// Single Source of Truth for PINIT BATCH 013: Month 4 · Week 13 · Days 63–67
// Problem Solving & DSA Foundations: Asymptotic Complexity, Memory Physics & Search Mechanics
// Pedagogical Flow: UNDERSTAND (Growth of Work & Operation Counting) -> APPLY (Big-O & CPython Built-in Costs) -> BUILD (CPython Reference Arrays & Dynamic Resizing) -> DEBUG (Binary Search Boundaries & Precondition Contracts) -> TRANSFER (Two-Pointer Inward Convergence & Algorithmic Assessment)

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

export const COMPETENCY_ID_DSA_FOUNDATIONS = 'comp-pfs-m4-013';

// ── DAY 63: UNDERSTAND — Algorithmic Efficiency, Growth of Work & Operation Counting ──
export const DAY_63_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w13-013',
  dayNumber: 1,
  title: 'Algorithmic Efficiency, Growth of Work & Operation Counting',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b13-d63-01',
      type: 'THEORY',
      order: 1,
      title: 'Beyond Wall-Clock Benchmarks: Measuring Algorithmic Growth',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand why wall-clock timing is deceptive for evaluating algorithm efficiency, and learn how to quantify algorithmic workload through machine-independent operation counting and growth rates.',
      whatItIs: 'Algorithmic efficiency is the mathematical relationship between the size of an input dataset (denoted as n) and the computational resources (workload iterations and auxiliary memory) required to process it. Rather than measuring wall-clock seconds, computer science characterizes how the quantity of work grows as n approaches infinity.',
      whyItExists: 'Wall-clock benchmarks (e.g. `time.perf_counter()`) vary erratically depending on the host CPU architecture, OS thread preemption, CPU thermal throttling, background processes, and garbage collection pauses. Engineers need a reliable, environment-independent model to evaluate algorithms before deploying them to production systems.',
      problemSolved: 'Prevents developers from making flawed architecture decisions based on micro-benchmarks on small inputs, where low constant-factor overhead often conceals catastrophic asymptotic scaling.',
      mentalModel: 'The Work-Growth Microscope: We do not measure how many seconds a task took on a specific laptop on Tuesday morning. We measure the growth rate of required atomic steps as the dataset doubles, quadruples, or scales by a factor of 1,000.',
      realWorldUse: 'Evaluating database indexing strategies, search utilities, payload validation passes, and high-frequency stream processing pipelines.',
      commonMistakes: [
        'Assuming an algorithm is faster overall simply because it finishes in fewer milliseconds on a toy dataset of 10 items.',
        'Treating wall-clock measurements on a local development machine as universal performance specifications.',
        'Ignoring worst-case execution paths and only testing ideal "happy path" inputs.',
      ],
      commonMisconceptions: [
        'Misconception: "Faster CPUs eliminate the need for efficient algorithms." Reality: If an algorithm requires quadratic work, doubling the hardware speed only allows processing ~1.4x more data in the same time, whereas an optimal algorithm scales linearly with input size.',
        'Misconception: "Operation counts are fixed universal constants." Reality: Wall-clock timing is environment-dependent; complexity analysis focuses on how work grows with input size. Concrete timing measurements should be treated as empirical observations for a particular environment, not universal operation budgets.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b13-d63-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Tracing Operation Counts: Linear Search vs Constant Indexing',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Step-by-step trace of exact operation counts across small and large input sizes, demonstrating why growth rate dominates constant factor differences.',
      language: 'python',
      codeSnippet: `def linear_search_step_count(items: list[int], target: int) -> tuple[int, int]:
    """
    Performs linear search while explicitly counting comparison steps.
    Returns: (found_index, operations_count)
    """
    ops = 0
    for idx, val in enumerate(items):
        ops += 1  # Comparison step: val == target
        if val == target:
            return (idx, ops)
    return (-1, ops)

def constant_lookup_step_count(items: list[int], index: int) -> tuple[int, int]:
    """
    Direct index lookup operates in a single direct step regardless of list length.
    Returns: (value, operations_count)
    """
    ops = 1  # Single memory offset address calculation
    if 0 <= index < len(items):
        return (items[index], ops)
    return (-1, ops)

# Empirical step demonstration across scaling input sizes:
for n in [10, 1_000, 100_000]:
    data = list(range(n))
    missing_target = -1  # Forces worst-case traversal
    _, worst_linear_ops = linear_search_step_count(data, missing_target)
    _, const_ops = constant_lookup_step_count(data, 0)
    print(f"Input size n={n:>7} | Linear Search Ops: {worst_linear_ops:>7} | Index Lookup Ops: {const_ops:>2}")
`,
      expectedOutput: `Input size n=     10 | Linear Search Ops:      10 | Index Lookup Ops:  1
Input size n=   1000 | Linear Search Ops:    1000 | Index Lookup Ops:  1
Input size n= 100000 | Linear Search Ops:  100000 | Index Lookup Ops:  1`,
    } as ExampleBlock,
    {
      id: 'blk-b13-d63-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Counting Operations in Sequential vs Nested Loops',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Inspect the candidate loop functions and compute their exact mathematical operation count equations T(n).',
        'Observe how sequential loops add operations: T(n) = n + n = 2n.',
        'Observe how nested loops multiply operations: T(n) = n * n = n^2.',
        'Verify that doubling the input size (n -> 2n) doubles linear work (2x) and quadruples quadratic work (4x).',
      ],
      starterCode: `def count_ops_sequential(n: int) -> int:
    """Computes total operations executed across two sequential loops of length n."""
    ops = 0
    # Loop 1: n iterations
    for i in range(n):
        ops += 1
    # Loop 2: n iterations
    for j in range(n):
        ops += 1
    return ops

def count_ops_nested(n: int) -> int:
    """Computes total operations executed across nested loops of length n."""
    ops = 0
    for i in range(n):
        for j in range(n):
            ops += 1
    return ops
`,
      solutionReference: `def count_ops_sequential(n: int) -> int:
    """T(n) = 2n operations."""
    ops = 0
    for i in range(n):
        ops += 1
    for j in range(n):
        ops += 1
    return ops

def count_ops_nested(n: int) -> int:
    """T(n) = n^2 operations."""
    ops = 0
    for i in range(n):
        for j in range(n):
            ops += 1
    return ops
`,
      hints: [
        'In sequential loops, individual loop step counts add together: T(n) = n + n = 2n.',
        'In nested loops, the inner loop executes completely for every single iteration of the outer loop: T(n) = n * n = n^2.',
      ],
      expectedOutcome: 'Understanding how nested loops fundamentally alter asymptotic growth compared to sequential loops.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b13-d63-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Asymptotic Growth vs Constant Factor Misconceptions',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Algorithm A executes 1000 * n operations for an input of size n. Algorithm B executes n^2 operations. Which statement accurately describes their relative performance as input scales?',
      options: [
        'Algorithm B is always faster because it does not have the large constant multiplier 1000.',
        'Algorithm A is slower for small inputs (n < 1000), but becomes substantially faster than Algorithm B for any n > 1000.',
        'Algorithm A and Algorithm B have identical efficiency because both depend directly on variable n.',
        'Algorithm A is always faster because linear operations take fewer CPU cycles than quadratic operations.',
      ],
      correctIndex: 1,
      explanation: 'For small n (e.g. n = 10), Algorithm A executes 10,000 steps while Algorithm B executes only 100 steps. However, as n exceeds 1,000, n^2 grows much faster than 1,000n. For n = 10,000, Algorithm A takes 10,000,000 steps, while Algorithm B takes 100,000,000 steps (10x more). Asymptotic growth rate strictly dominates constant factors as n grows.',
      misconceptionIdentified: 'Believing that constant factor multipliers dominate asymptotic growth rate at scale.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 64: APPLY — Asymptotic Notation: Big-O, Space Complexity & Practical Python Costs ──
export const DAY_64_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w13-013',
  dayNumber: 2,
  title: 'Asymptotic Notation: Big-O, Space Complexity & Practical Python Costs',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b13-d64-01',
      type: 'THEORY',
      order: 1,
      title: 'Asymptotic Complexity Classes & Mathematical Upper Bounds',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master Big-O notation as the formal standard for expressing worst-case computational upper bounds, dropping non-dominant terms, and distinguishing time from auxiliary space.',
      whatItIs: 'Big-O notation (O(g(n))) characterizes the upper bound of an algorithm growth rate: an algorithm T(n) is O(g(n)) if there exist positive constants c and n0 such that T(n) <= c * g(n) for all n >= n0. When classifying algorithms, we drop constant factors (3n -> O(n)) and lower-order terms (n^2 + 5n + 10 -> O(n^2)).',
      whyItExists: 'Exact equations like T(n) = 4n^2 + 17n + 23 are cumbersome and hardware-specific. Big-O categorizes algorithms into standard complexity classes so engineers can immediately compare trade-offs.',
      problemSolved: 'Provides a standardized vocabulary to predict whether an algorithm will scale to production datasets or trigger critical latency failures.',
      mentalModel: 'The Asymptotic Hierarchy: O(1) [Constant] < O(log n) [Logarithmic] < O(n) [Linear] < O(n log n) [Linearithmic] < O(n^2) [Quadratic] < O(2^n) [Exponential]. As n grows large, an algorithm in a lower class always outperforms any algorithm in a higher class regardless of constants.',
      realWorldUse: 'Establishing Service Level Agreements (SLAs) for API endpoints, selecting data structures for caching engines, and sizing memory allocations for batch processing jobs.',
      commonMistakes: [
        'Keeping constant multipliers in Big-O notation (e.g. writing O(2n) instead of O(n)).',
        'Confusing time complexity (how many operations execute) with auxiliary space complexity (how much additional memory is allocated beyond the input).',
        'Assuming O(1) means "instantaneous" — O(1) means constant work that does not depend on n, even if that constant step involves significant calculation.',
      ],
      commonMisconceptions: [
        'Misconception: "Big-O measures average runtime." Reality: Big-O represents a mathematical upper bound; in software engineering it is conventionally applied to the worst-case scenario unless explicitly qualified as amortized or average-case.',
        'Misconception: "Creating a sub-list with slice syntax lst[a:b] is a zero-cost O(1) pointer operation in Python." Reality: In Python, list slicing creates a brand-new list object and copies references, requiring O(k) time and O(k) auxiliary memory where k = b - a.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b13-d64-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'CPython Complexity Profiles for Core Built-ins',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Practical inventory of CPython asymptotic costs for common list and string operations, highlighting hidden allocations and copy overhead.',
      language: 'python',
      codeSnippet: `# CPython Complexity Profiles for Common Built-in Operations:
# Note: These reflect standard CPython implementation characteristics, not language guarantees.

data = list(range(10_000))

# 1. len(data) -> O(1) Time, O(1) Auxiliary Space
# CPython stores the length directly in the PyVarObject header (ob_size).
size = len(data)

# 2. data[i] -> O(1) Time, O(1) Auxiliary Space
# Direct pointer calculation from the contiguous array base address.
first_val = data[0]

# 3. target in data -> O(n) Time, O(1) Auxiliary Space
# Linear scan checking each reference sequentially until match or exhaustion.
is_present = 9999 in data

# 4. data.append(x) -> Amortized O(1) Time, O(1) Space
# Appending to the tail uses pre-allocated capacity; occasionally triggers reallocation.
data.append(10_000)

# 5. data.insert(0, x) -> O(n) Time, O(1) Space
# Inserting at the head requires shifting all existing n references forward by 1 index!
data.insert(0, -1)

# 6. data[100:500] -> O(k) Time, O(k) Auxiliary Space (where k = 400)
# Allocates a new list and copies 400 object references.
sub_slice = data[100:500]
`,
      expectedOutput: `# Reference operations complete with respective asymptotic profiles.`,
    } as ExampleBlock,
    {
      id: 'blk-b13-d64-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Empirical Growth Curve Profiling in Python',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Measure and compare empirical runtime scaling of linear vs quadratic functions across scaling input sizes, validating theoretical Big-O predictions with real measurements.',
      instructions: [
        'Implement profile_growth_curves() across input sizes [500, 1000, 2000].',
        'Measure elapsed wall-clock seconds with time.perf_counter().',
        'Calculate the ratio of elapsed time when input doubles from n to 2n.',
        'Observe how quadratic runtime quadruples (~4x) while linear runtime doubles (~2x).',
      ],
      starterFiles: {
        'profiler.py': `import time

def algorithm_linear(items: list[int]) -> int:
    """Single pass accumulation: O(n) time."""
    total = 0
    for x in items:
        total += x
    return total

def algorithm_quadratic(items: list[int]) -> int:
    """Pairwise comparison: O(n^2) time."""
    matches = 0
    n = len(items)
    for i in range(n):
        for j in range(n):
            if items[i] == items[j]:
                matches += 1
    return matches

def profile_growth_curves():
    # TODO: Implement timing harness
    pass
`,
      },
      expectedBehavior: 'Quadratic function execution time scales by approximately 4x when n doubles, while linear scales by ~2x.',
    } as GuidedLabBlock,
    {
      id: 'blk-b13-d64-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Space Complexity Traps in List Slicing',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'A developer processes a list of n items by repeatedly slicing the first element off: `while data: data = data[1:]`. What is the total time and auxiliary space complexity of this loop?',
      options: [
        'O(n) time and O(1) auxiliary space, because slicing merely shifts the start pointer.',
        'O(n^2) total time and O(n) auxiliary space across iterations, because each slice allocates a new list and copies the remaining references.',
        'O(log n) time and O(n) space, because the list halves with each iteration.',
        'O(1) time and O(1) space, because Python automatically optimizes slicing into a view.',
      ],
      correctIndex: 1,
      explanation: 'In Python, `data[1:]` allocates a new list and copies all n - 1 elements. Doing this in a loop of n iterations copies (n - 1) + (n - 2) + ... + 1 = n(n - 1)/2 elements, resulting in catastrophic O(n^2) cumulative time and repeated heap allocations.',
      misconceptionIdentified: 'Assuming list slicing in Python is a free O(1) pointer view rather than an O(k) copy.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 65: BUILD — Memory Representation, Reference Arrays & Append vs Insert Mechanics ──
export const DAY_65_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w13-013',
  dayNumber: 3,
  title: 'Memory Representation, Reference Arrays & Append vs Insert Mechanics',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b13-d65-01',
      type: 'THEORY',
      order: 1,
      title: 'Hardware Memory Physics: Contiguous Reference Arrays & Cache Locality',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand computer memory layout, CPU cache lines, spatial locality mechanics, and how CPython lists are implemented as dynamically resizable arrays of object references.',
      whatItIs: 'Physical RAM is organized as a linear sequence of addressable byte locations. When a CPU core requests data from memory, it does not fetch a single byte; it fetches an entire contiguous block called a cache line (commonly 64 bytes on modern architectures). Spatial locality refers to the high probability that data stored immediately adjacent to recently accessed data will be requested next.',
      whyItExists: 'Accessing data directly from CPU L1/L2 cache is orders of magnitude faster than fetching from main system RAM. Contiguous memory layouts allow hardware prefetchers to anticipate memory accesses and keep CPU pipelines saturated.',
      problemSolved: 'Explains why data structures with contiguous memory layouts outperform pointer-heavy linked data structures for sequential operations, and why certain array operations (like front insertion) carry heavy performance penalties.',
      mentalModel: 'The Reference Shelf: In CPython, a list is not a box containing raw values directly. It is a contiguous shelf of memory addresses (pointers) pointing to separate objects on the heap. Accessing shelf slot `i` is effectively O(1) because the shelf address is computed directly: `shelf_start + (i * pointer_size)`.',
      realWorldUse: 'Optimizing high-throughput data processing pipelines, scientific data buffers, and memory-efficient data caching services.',
      commonMistakes: [
        'Assuming a Python list of integers stores raw numbers packed contiguously like a C array (Python lists store references to separate PyObject structs on the heap).',
        'Believing CPython internal layout details (such as pointer size or over-allocation constants) are universal Python language specifications rather than implementation specifics.',
        'Using `list.insert(0, val)` inside a high-throughput loop instead of appending or using a dedicated queue structure.',
      ],
      commonMisconceptions: [
        'Misconception: "Contiguous memory access has a fixed, universal speed multiplier over non-contiguous access." Reality: Contiguous access can be substantially faster because it benefits from spatial locality and CPU cache behavior; the exact performance difference depends on hardware architecture, cache hierarchy, memory bus saturation, and workload.',
        'Misconception: "Python lists reallocate memory on every single append." Reality: Dynamic arrays use an over-allocation strategy, allocating extra capacity buffer so that appends achieve amortized O(1) performance.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b13-d65-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'The Mechanics of Over-Allocation & Amortized O(1) Appends',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Understand why naive array resizing is inefficient and how geometric over-allocation guarantees amortized O(1) append performance.',
      language: 'python',
      codeSnippet: `import sys

def inspect_list_capacity_growth(sample_limit: int = 25) -> list[tuple[int, int]]:
    """
    Demonstrates dynamic array over-allocation by inspecting sys.getsizeof().
    Returns: list of (element_count, byte_size) tuples.
    Note: Exact byte sizes and growth steps are CPython implementation specifics.
    """
    history = []
    items: list[int] = []
    prev_size = sys.getsizeof(items)
    
    for count in range(sample_limit):
        items.append(count)
        current_size = sys.getsizeof(items)
        if current_size != prev_size or count == 0:
            history.append((len(items), current_size))
            prev_size = current_size
            
    return history

growth_samples = inspect_list_capacity_growth(30)
for count, mem_bytes in growth_samples:
    print(f"Count: {count:>2} elements -> Allocated Memory: {mem_bytes:>4} bytes")
`,
      expectedOutput: `Count:  1 elements -> Allocated Memory:   88 bytes
Count:  5 elements -> Allocated Memory:  120 bytes
Count:  9 elements -> Allocated Memory:  184 bytes`,
    } as ExampleBlock,
    {
      id: 'blk-b13-d65-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Empirical Lab: Repeated Append vs Repeated Insert(0)',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Measure and explain the asymptotic performance divergence between repeated list.append() and repeated list.insert(0, x), observing shifting overhead in action.',
      instructions: [
        'Implement benchmark_repeated_append(n) measuring elapsed seconds for n tail appends.',
        'Implement benchmark_repeated_insert_zero(n) measuring elapsed seconds for n front insertions.',
        'Execute both benchmarks for n = 20_000 elements.',
        'Calculate slowdown factor and document the reference shifting mechanics.',
      ],
      starterFiles: {
        'bench_insert.py': `import time

def benchmark_repeated_append(n: int) -> float:
    t0 = time.perf_counter()
    data: list[int] = []
    for i in range(n):
        data.append(i)
    return time.perf_counter() - t0

def benchmark_repeated_insert_zero(n: int) -> float:
    t0 = time.perf_counter()
    data: list[int] = []
    for i in range(n):
        data.insert(0, i)
    return time.perf_counter() - t0
`,
      },
      expectedBehavior: 'insert(0) takes significantly longer than append due to shifting all existing references in contiguous memory.',
    } as GuidedLabBlock,
    {
      id: 'blk-b13-d65-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: References vs Inline Values',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Why does a Python list of 1,000,000 integers require significantly more memory than a contiguous 64-bit integer array in C, and what architectural trade-off does Python make by using object references?',
      guidingQuestions: [
        'How many bytes does a raw 64-bit integer occupy in C (8 bytes) vs a PyObject struct holding an integer in Python (~28 bytes)?',
        'What additional memory is consumed by the list pointer array itself (one reference address per element)?',
        'What flexibility does Python gain by storing references rather than raw inline values (e.g. heterogenous types, dynamic polymorphism)?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 66: DEBUG — Binary Search Invariants, Preconditions & Boundary Traps ──
export const DAY_66_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w13-013',
  dayNumber: 4,
  title: 'Binary Search Invariants, Preconditions & Boundary Traps',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b13-d66-01',
      type: 'THEORY',
      order: 1,
      title: 'Logarithmic Search Space Halving & The Precondition Contract',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the logarithmic mechanics of binary search, understand the system contract of sortedness preconditions, and learn loop invariant proofs.',
      whatItIs: 'Binary search is a divide-and-conquer algorithm that finds the position of a target value within a sorted collection. By comparing the target with the middle element, it eliminates half of the remaining search interval in each step, halving the problem size: n -> n/2 -> n/4 -> ... -> 1, achieving O(log n) time complexity.',
      whyItExists: 'Linear search requires O(n) steps, which becomes prohibitive for large datasets (e.g. 1,000,000 items requires up to 1,000,000 comparisons). In contrast, binary search resolves 1,000,000 items in at most ~20 comparisons.',
      problemSolved: 'Enables real-time search queries across massive collections, database index traversals, and boundary value root-finding.',
      mentalModel: 'The Halving Book: Open a 1,000-page dictionary in the exact middle. If the target word comes alphabetically earlier, discard the entire second half immediately. Repeat on the remaining half. You reach any word in at most 10 page turns.',
      realWorldUse: 'Database B-Tree leaf searches, network routing table lookup, log timestamp bisecting, and git bisect defect hunting.',
      commonMistakes: [
        'Calling binary search on unsorted data and expecting correct results.',
        'Writing `while low < high` instead of `while low <= high`, prematurely terminating and missing the target when it sits at the final single-element boundary.',
        'Updating intervals with `high = mid` instead of `high = mid - 1`, triggering infinite loops when the target is missing.',
      ],
      commonMisconceptions: [
        'Misconception: "Binary search should scan the list first to verify it is sorted." Reality: Sortedness is a system precondition guaranteed by the caller. Scanning the list to check sortedness would require O(n) time, completely destroying the O(log n) efficiency advantage.',
        'Misconception: "Midpoint calculation `(low + high) // 2` causes integer overflow in Python." Reality: In Python 3, integers have arbitrary precision and never overflow 32-bit registers. However, `low + (high - low) // 2` is taught as a standard cross-language defensive idiom essential in fixed-width languages such as C, Java, or Rust.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b13-d66-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Canonical Binary Search Implementation & Pointer Trace',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Canonical binary search implementation with comprehensive pointer movement tracing across target-found and target-missing execution paths.',
      language: 'python',
      codeSnippet: `def binary_search_traced(arr: list[int], target: int) -> tuple[int, list[dict[str, int]]]:
    """
    Canonical binary search returning (found_index, trace_steps).
    Precondition: arr is sorted in non-decreasing order.
    Returns -1 if target is not present in arr.
    """
    low = 0
    high = len(arr) - 1
    trace = []
    
    # Invariant: If target exists, it must reside within arr[low .. high]
    while low <= high:
        # Both midpoint forms are safe in Python 3:
        # mid = (low + high) // 2  <-- idiomatic Python
        # mid = low + (high - low) // 2  <-- cross-language defensive idiom
        mid = low + (high - low) // 2
        mid_val = arr[mid]
        
        trace.append({"low": low, "high": high, "mid": mid, "val": mid_val})
        
        if mid_val == target:
            return (mid, trace)
        elif mid_val < target:
            low = mid + 1   # Target lies in right half; discard left half + mid
        else:
            high = mid - 1  # Target lies in left half; discard right half + mid
            
    return (-1, trace)

# Trace demonstration
data = [12, 24, 37, 45, 59, 68, 71, 83, 90]
idx, steps = binary_search_traced(data, 71)
print(f"Target 71 found at index: {idx} in {len(steps)} steps:")
`,
      expectedOutput: `Target 71 found at index: 6 in 3 steps:`,
    } as ExampleBlock,
    {
      id: 'blk-b13-d66-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Diagnosing 3 Latent Boundary Traps in a Search Utility',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A legacy search microservice contains subtle defects causing off-by-one errors, infinite loops, and boundary misses.',
      symptom: 'Single-element searches fail, missing targets trigger infinite loops, and boundary elements are missed.',
      brokenArtifact: `def search_service_legacy(records: list[int], target: int) -> int:
    if not records:
        return -1
    low = 0
    high = len(records) - 1
    # DEFECT 1: '<' misses target when low == high
    while low < high:
        mid = (low + high) // 2
        if records[mid] == target:
            return mid
        elif records[mid] < target:
            low = mid + 1
        else:
            # DEFECT 2: Incomplete interval reduction triggers infinite loops
            high = mid
    return -1
`,
      expectedBehavior: 'All boundary cases (single-element lists, target at first index, target at last index, target missing) resolve deterministically in O(log n) time without infinite loops.',
      difficulty: 'INTERMEDIATE',
      hints: [
        'Change the loop condition to `while low <= high:` so single-element intervals are checked.',
        'When `records[mid] > target`, update `high = mid - 1`.',
      ],
      targetCompetencyId: COMPETENCY_ID_DSA_FOUNDATIONS,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b13-d66-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Binary Search Boundary Invariants',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why should a binary search function NOT execute `assert records == sorted(records)` inside its production implementation?',
      options: [
        'Python does not support sorting verification on lists.',
        'Sorting check takes O(n) time, which negates the O(log n) efficiency advantage of binary search.',
        'The sorted() function mutates the original list in place.',
        'Binary search works equally well on unsorted lists.',
      ],
      correctIndex: 1,
      explanation: 'Checking sortedness requires inspecting every element (O(n) time). If an algorithm must run an O(n) check before every binary search, the total time is O(n), destroying the O(log n) benefit. Sortedness is a system contract/precondition guaranteed by the caller.',
      misconceptionIdentified: 'Failing to recognize that sortedness is an API precondition rather than an internally validated invariant.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 67: TRANSFER — Two-Pointer Convergence & Contract-Enforced Formative Assessment ──
export const DAY_67_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m4-w13-013',
  dayNumber: 5,
  title: 'Two-Pointer Inward Convergence & Contract-Enforced Formative Assessment',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b13-d67-01',
      type: 'THEORY',
      order: 1,
      title: 'Two-Pointer Inward Convergence: Eliminating Quadratic Scans',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master opposite-direction two-pointer convergence on sorted collections, proving how monotonic array properties allow eliminating quadratic O(n^2) nested loops into single-pass O(n) time.',
      whatItIs: 'The two-pointer technique uses two integer indices (typically `left = 0` and `right = len(arr) - 1`) that converge toward each other based on monotonic comparison conditions. By evaluating the pair at each step, the algorithm eliminates entire subsets of candidate pairs without inspecting them individually.',
      whyItExists: 'A naive approach to finding pairs satisfying a condition tests all combinations using nested loops, which requires n(n - 1)/2 checks — an O(n^2) cost. On sorted data, two pointers reduce this to at most n checks — an O(n) linear cost with O(1) auxiliary memory.',
      problemSolved: 'Solves target sum pairing, container optimization, palindrome verification, and packet fitting in single linear time without auxiliary memory allocation.',
      mentalModel: 'The Squeeze Invariant: Because the array is sorted, moving `left` to the right can only increase or maintain the sum; moving `right` to the left can only decrease or maintain the sum. If current sum exceeds the target, no other element paired with `right` could possibly be valid — so `right` can be permanently discarded.',
      realWorldUse: 'Network packet packaging under MTU constraints, audio signal balance matching, financial portfolio risk offset pairing, and genome sequence alignment.',
      commonMistakes: [
        'Attempting to apply inward two-pointer convergence to an unsorted array without establishing sortedness first.',
        'Failing to specify or implement a deterministic tie-breaking rule when multiple pairs achieve identical optimal sums.',
        'Creating temporary slices inside the two-pointer loop, accidentally inflating auxiliary space complexity from O(1) to O(n).',
      ],
      commonMisconceptions: [
        'Misconception: "Two-pointer always requires extra memory for index tracking." Reality: Two pointers are integer scalar indices stored on the local stack frame, requiring strict O(1) auxiliary space.',
        'Misconception: "Nested loops are acceptable if n is small in tests." Reality: Production datasets quickly expose quadratic scaling, causing services to breach latency SLAs or encounter gateway timeouts.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b13-d67-02',
      type: 'TRANSFER_CHALLENGE',
      order: 2,
      title: 'Network Telemetry Bandwidth Packet Pairing',
      estimatedMinutes: 65,
      status: 'PUBLISHED',
      version: '1.0.0',
      difficulty: 'INTERMEDIATE',
      timeExpectationMinutes: 65,
      targetCompetencyId: COMPETENCY_ID_DSA_FOUNDATIONS,
      unfamiliarDomainContext: 'High-Throughput Telemetry Ingestion Gateway & Packet Coalescing Engine',
      task: 'Implement a high-throughput packet pairing utility that pairs two sensor payload buffers to maximize bandwidth utilization without exceeding the gateway Maximum Transmission Unit (MTU). The implementation must adhere strictly to O(n) time complexity and O(1) auxiliary space, and implement a deterministic tie-breaking contract.',
      constraints: [
        'Precondition: Input `packet_sizes` is sorted in ascending order.',
        'Time Complexity: Strict O(n) single-pass execution. Zero nested loops (O(n^2)) permitted.',
        'Auxiliary Space Complexity: Strict O(1) auxiliary space. No intermediate copies or slice allocations.',
        'Tie-Breaking Contract: When multiple distinct index pairs achieve the identical maximum valid sum <= max_bandwidth, return the pair with the widest index span (right_index - left_index), and if still tied, the smallest left_index.',
        'Return value: Tuple of (left_index, right_index) with left_index < right_index, or None if no valid pair exists.',
      ],
      starterArtifact: `# telemetry_packet_coalescer.py
from typing import Optional, Tuple

def pair_telemetry_packets(packet_sizes: list[int], max_bandwidth: int) -> Optional[Tuple[int, int]]:
    """
    Pairs two distinct sensor packets to maximize bandwidth utilization <= max_bandwidth.
    
    Precondition: packet_sizes is sorted in ascending order.
    
    Contract:
    - Must run in O(n) time and O(1) auxiliary space.
    - Tie-Break Rule: When multiple pairs have the same maximum valid sum,
      return the pair with the widest index span (right - left), and if tied,
      the smallest left_index.
    - Returns: (left_index, right_index) with left_index < right_index, or None.
    """
    # TODO: Implement two-pointer convergence
    pass
`,
    } as TransferChallengeBlock,
    {
      id: 'blk-b13-d67-03',
      type: 'REFERENCE',
      order: 3,
      title: 'DSA Week 13 Architecture & Complexity Quick Reference',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        { title: 'Python TimeComplexity Official Wiki', url: 'https://wiki.python.org/moin/TimeComplexity' },
        { title: 'CPython listobject.c Implementation', url: 'https://github.com/python/cpython/blob/main/Objects/listobject.c' },
      ],
      documentationExtracts: [
        'CPython List Indexing: Constant time O(1) via base + (index * pointer_size).',
        'CPython List Append: Amortized O(1) using overallocation growth buffer.',
        'CPython List Insert(0): O(n) requiring memory memmove of all existing references.',
        'Binary Search: O(log n) divide-and-conquer on sorted collections maintaining low <= high.',
        'Two Pointers: O(n) inward convergence on sorted collections maintaining left < right.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 013 MANIFEST ────────────────────────────────────────────────────────
export const BATCH_013_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m4-w13-013',
  batchCode: 'P2-M4-W13-BATCH013',
  title: 'Problem Solving & DSA Foundations: Asymptotic Complexity, Memory Physics & Search Mechanics (Days 63–67)',
  difficulty: 'INTERMEDIATE',
  days: [
    DAY_63_MANIFEST,
    DAY_64_MANIFEST,
    DAY_65_MANIFEST,
    DAY_66_MANIFEST,
    DAY_67_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
};

// ── DAY 67 FORMATIVE ASSESSMENT ──────────────────────────────────────────────
export const DAY_67_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m4-w13-013',
  assessmentCode: 'ASM-PFS-M4-W13-013',
  title: 'Formative Assessment: Algorithmic Efficiency & Search Mechanics',
  description: 'Rigorous automated formative assessment verifying algorithmic time/space complexity compliance, binary search boundary invariants, and two-pointer inward convergence under deterministic tie-breaking contracts.',
  type: 'CODE',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  difficulty: 'INTERMEDIATE',
  timeLimitMinutes: 65,
  passingScore: 70,
  maxAttempts: 3,
  attemptPolicy: 'LIMITED_BEST',
  targetCompetencyId: COMPETENCY_ID_DSA_FOUNDATIONS,
  batchId: 'batch-pfs-m4-w13-013',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
  items: [
    {
      id: 'item-b13-01',
      assessmentId: 'asm-pfs-m4-w13-013',
      version: '1.0.0',
      itemType: 'CODE',
      points: 100,
      order: 1,
      timeEstimateMinutes: 65,
      prompt: `Implement two foundational algorithmic routines for a real-time telemetry processing gateway:

Task A: Telemetry Timestamp Binary Search ('find_telemetry_timestamp(timestamps: list[int], target: int) -> int')
- Contract: Input 'timestamps' is guaranteed sorted in ascending order.
- Complexity: Strict O(log n) time complexity, strict O(1) auxiliary space.
- Behavior: Returns the zero-based index of 'target' in 'timestamps', or -1 if not found.
- Must handle all boundary conditions (empty list, single element, first/last element, missing targets).

Task B: 'pair_telemetry_packets(packet_sizes: list[int], max_bandwidth: int) -> tuple[int, int] | None'
- Contract: Input 'packet_sizes' is guaranteed sorted in ascending order.
- Complexity: Strict O(n) time complexity, strict O(1) auxiliary space.
- Tie-Break Rule: When multiple pairs have the same maximum valid sum <= max_bandwidth, return the pair with the widest index span (right_index - left_index), and if still tied, the smallest left_index.
- Complexity Floor: Zero O(n^2) nested loops permitted. Solutions using nested loops will fail static AST and operation-budget verification.
- Behavior: Returns (left_index, right_index) with left_index < right_index, or None if no valid pair exists.
`,
      starterCode: `from typing import Optional, Tuple

def find_telemetry_timestamp(timestamps: list[int], target: int) -> int:
    """
    Locates target in sorted timestamps using binary search.
    Precondition: timestamps is sorted ascending.
    Complexity: O(log n) time, O(1) auxiliary space.
    """
    # TODO: Implement Task A
    pass

def pair_telemetry_packets(packet_sizes: list[int], max_bandwidth: int) -> Optional[Tuple[int, int]]:
    """
    Pairs two distinct sensor packets to maximize bandwidth utilization <= max_bandwidth.
    Precondition: packet_sizes is sorted ascending.
    Complexity: O(n) time, O(1) auxiliary space.
    Tie-Break: Widest index span (right - left), then smallest left_index.
    """
    # TODO: Implement Task B
    pass
`,
      solutionCode: `from typing import Optional, Tuple

def find_telemetry_timestamp(timestamps: list[int], target: int) -> int:
    """Task A: Canonical O(log n) binary search."""
    low = 0
    high = len(timestamps) - 1
    
    while low <= high:
        mid = low + (high - low) // 2
        if timestamps[mid] == target:
            return mid
        elif timestamps[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1

def pair_telemetry_packets(packet_sizes: list[int], max_bandwidth: int) -> Optional[Tuple[int, int]]:
    """Task B: Single-pass O(n) two-pointer inward convergence."""
    if len(packet_sizes) < 2:
        return None
        
    left = 0
    right = len(packet_sizes) - 1
    best_sum = -1
    best_pair: Optional[Tuple[int, int]] = None
    
    while left < right:
        current_sum = packet_sizes[left] + packet_sizes[right]
        if current_sum <= max_bandwidth:
            if current_sum > best_sum:
                best_sum = current_sum
                best_pair = (left, right)
            elif current_sum == best_sum:
                # Deterministic tie-break: widest span (right - left), then smallest left
                span_current = right - left
                span_best = best_pair[1] - best_pair[0] if best_pair else -1
                if span_current > span_best or (span_current == span_best and left < best_pair[0]):
                    best_pair = (left, right)
            left += 1
        else:
            right -= 1
            
    return best_pair
`,
      visibleTests: [
        {
          id: 'vt-b13-01',
          name: 'Task A: Basic Target Found and Missing Target Checks',
          input: '{"func": "find_telemetry_timestamp", "data": [10, 20, 30, 40, 50], "targets": [30, 99]}',
          expectedOutput: '{"index_30": 2, "index_99": -1}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-b13-02',
          name: 'Task B: Standard Two-Pointer Packet Pairing Check',
          input: '{"func": "pair_telemetry_packets", "data": [10, 20, 30, 45, 50], "max_bw": 65}',
          expectedOutput: '{"pair": [1, 3], "sum": 65}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-b13-03',
          name: 'Task B: Deterministic Tie-Breaking Verification Check',
          input: '{"func": "pair_telemetry_packets", "data": [2, 3, 4, 5], "max_bw": 7}',
          expectedOutput: '{"pair": [0, 3], "sum": 7}',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-b13-01',
          name: 'Task A: Boundary Endpoints and Single Element Invariants',
          input: '{"func": "find_telemetry_timestamp", "cases": ["empty", "single_match", "first_element", "last_element"]}',
          expectedOutput: '{"all_boundaries_passed": true}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-b13-02',
          name: 'Task B: No Valid Pair and Fewer than Two Elements Checks',
          input: '{"func": "pair_telemetry_packets", "cases": ["empty", "single", "all_exceed"]}',
          expectedOutput: '{"all_none_passed": true}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-b13-03',
          name: 'Task B: Duplicate Element Tie-Breaking Contract Invariant Check',
          input: '{"func": "pair_telemetry_packets", "data": [3, 5, 16, 17, 18, 20, 20], "max_bw": 36}',
          expectedOutput: '{"pair": [2, 6], "sum": 36}',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-b13-01',
          name: 'Static AST & Operation Bound Anti-Quadratic Probe',
          input: '{"check": "AST_AND_ITERATION_FLOOR", "max_allowed_iterations": 100000}',
          expectedOutput: '{"quadratic_loops_detected": false, "competency_floor_met": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        {
          id: 'rub-b13-01',
          name: 'Correctness',
          description: 'Adheres strictly to O(log n) binary search for Task A and O(n) two-pointer convergence for Task B. Zero O(n^2) regressions.',
          weight: 0.20,
          maxPoints: 20,
          minimumPassingScore: 10,
          isMandatory: true,
        },
        {
          id: 'rub-b13-02',
          name: 'EdgeCaseRobustness',
          description: 'Flawlessly handles empty inputs, single-element collections, boundary endpoints, and missing target conditions.',
          weight: 0.20,
          maxPoints: 20,
        },
        {
          id: 'rub-b13-03',
          name: 'Performance',
          description: 'Operates in strict O(1) auxiliary space without intermediate slice allocations, copies, or redundant collections.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'rub-b13-04',
          name: 'DebuggingDiagnostics',
          description: 'Avoids off-by-one boundary traps (<= vs <) and incomplete interval updates (mid - 1 / mid + 1).',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'rub-b13-05',
          name: 'Testing',
          description: 'Comprehensive test assertion coverage validating behavioral invariants across standard and edge-case inputs.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'rub-b13-06',
          name: 'CodeQuality',
          description: 'Clear pointer naming (low, high, mid, left, right), comprehensive type annotations, and descriptive docstrings.',
          weight: 0.10,
          maxPoints: 10,
        },
        {
          id: 'rub-b13-07',
          name: 'Reasoning',
          description: 'Defends precondition contracts and explains why sorting O(n log n) once is amortized across multiple binary searches.',
          weight: 0.05,
          maxPoints: 5,
        },
      ],
    },
  ],
};
