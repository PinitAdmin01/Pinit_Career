// src/lib/curriculum/pythonFullStack/batch017.ts
// Single Source of Truth for PINIT BATCH 017: Month 5 · Week 17 · Days 83–87
// Advanced Python: Closures, Lexical Scoping Invariants, First-Class Functions & Decorator Architecture
// Pedagogical Flow: UNDERSTAND (First-Class Callables & Lexical Scope) -> APPLY (Decorator Mechanics & Metadata Preservation) -> BUILD (Parameterized Decorator Factories & Resilience) -> DEBUG (Closure State Drift & Stacking Order) -> TRANSFER (Month 5 Week 17 Milestone Synthesis)

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

export const COMPETENCY_ID_CLOSURES_AND_DECORATORS = 'comp-pfs-m5-017';

// ── CANONICAL DOMAIN EXCEPTIONS FOR CLOSURES & DECORATOR ARCHITECTURE ──
// Used across all instruction, labs, challenges, and assessment contracts:
// 1. DecoratorStructureError: Base class for all decorator and closure invariant failures.
// 2. MetadataPreservationError: Raised when a decorator erases wrapped function metadata (__name__, __doc__, __wrapped__).
// 3. SignatureMismatchError: Raised when arguments supplied to a wrapper violate signature or contract expectations.
// 4. RetryExhaustedError: Raised when a retried operation fails to succeed within the maximum allowed attempt count.
// 5. UnhashableArgumentError: Raised when an unhashable argument is passed to a memoized function without custom key serialization.
// 6. RateLimitExceededError: Raised when invocation rate exceeds configured call frequency quota.

// ── DAY 83: UNDERSTAND — First-Class Functions, Lexical Scoping & Closure Mechanics ──
export const DAY_83_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w17-017',
  dayNumber: 1,
  title: 'First-Class Functions, Lexical Scoping & Closure Mechanics',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b17-d83-01',
      type: 'THEORY',
      order: 1,
      title: 'First-Class Callables, LEGB Scope Resolution & Closure Cell Physics',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the computer science foundations of first-class functions, lexical scope environments, closure formation mechanics in memory, cell objects, the nonlocal rebinding contract, and the infamous loop late-binding trap.',
      whatItIs: 'In Python, functions are first-class objects: they can be bound to names, passed as arguments, returned from other functions, and stored in data structures. A CLOSURE is a record storing a function together with an environment—a mapping associating each free variable of the function with the value or storage location to which the name was bound when the closure was created. In CPython, free variables captured in enclosing scopes are stored in "cell" objects accessed via func.__closure__.',
      whyItExists: 'Closures enable data hiding, state retention across invocations without global variables or full class boilerplate, and functional composition patterns essential for decorators, factories, and event-driven architectures.',
      problemSolved: 'Eliminates the need for mutable global variables or heavyweight stateful classes when associating persistent state with a callable.',
      mentalModel: 'The Backpack: When an inner function leaves its home (enclosing function scope), it packs all the variables it needs from the local room into its backpack (cell objects). Even after the enclosing function finishes and its stack frame is destroyed, the inner function carries its backpack wherever it goes.',
      realWorldUse: 'Middleware pipelines, event callbacks, memoization caches, and parameterized decorators.',
      commonMistakes: [
        'Attempting to rebind an enclosing immutable variable (e.g. count += 1) without declaring "nonlocal count", which creates an unbound local variable and raises UnboundLocalError.',
        'The Late Binding Loop Trap: Creating closures inside a loop (e.g. [lambda: i for i in range(5)]) where all closures reference the identical cell variable, evaluating to the final loop value (4) rather than their creation-time snapshot.',
        'Confusing global with nonlocal: global looks in module scope; nonlocal looks in enclosing function scopes.',
      ],
      commonMisconceptions: [
        'Misconception: "When an outer function returns, all its local variables are garbage collected." Reality: In CPython, variables referenced by inner functions are stored in cell objects on the heap; they survive as long as the closure object remains reachable.',
        'Misconception: "Python closures snapshot the value of free variables at definition time." Reality: Python closures bind to variable LOCATIONS (cell objects), not values. Changes to the variable in the enclosing scope are reflected inside the closure (hence the late-binding loop behavior). Snapshotting requires explicit parameter defaulting: lambda x=i: x.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b17-d83-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Closure Cell Inspection, nonlocal State Rebinding & The Late Binding Trap',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates Python closure cell inspection via __closure__, stateful encapsulation using nonlocal, and the late-binding loop trap contrasted with default argument capture.',
      language: 'python',
      codeSnippet: `def make_counter(initial_value=0):
    """Factory creating a stateful counter closure using nonlocal."""
    count = initial_value  # Enclosing variable -> stored in cell object
    
    def increment(step=1):
        nonlocal count  # Rebinds cell variable in enclosing scope
        count += step
        return count
        
    return increment

# 1. State Encapsulation in Closures
c1 = make_counter(10)
c2 = make_counter(100)

assert c1() == 11
assert c1(4) == 15
assert c2() == 101  # c1 and c2 maintain independent closure cells!

# 2. Inspecting Closure Cells
assert len(c1.__closure__) == 1
cell = c1.__closure__[0]
assert cell.cell_contents == 15
print(f"c1 closure cell contents: {cell.cell_contents}")

# 3. The Late Binding Loop Trap vs Default Argument Capture
# BROKEN: All closures share the same 'i' cell, evaluating to 2
broken_funcs = [lambda: i for i in range(3)]
assert [f() for f in broken_funcs] == [2, 2, 2]

# FIXED: Default argument evaluation snapshots 'i' at definition time
fixed_funcs = [lambda x=i: x for i in range(3)]
assert [f() for f in fixed_funcs] == [0, 1, 2]
print("Closure cell mechanics and late-binding fix verified!")
`,
    } as ExampleBlock,
    {
      id: 'blk-b17-d83-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Building an Isolated Multi-Channel Event Accumulator',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Implement create_accumulator(channel_name, initial_events=None).',
        'Use an internal closure dictionary to track total event count and history list.',
        'Expose three inner callable functions or a dispatch function: record(event), get_history(), and clear().',
        'Ensure mutating history preserves channel isolation without leaking state across channels.',
        'Verify closure cell count and inspect cell_contents directly.',
      ],
      expectedOutcome: 'A robust stateful accumulator closure demonstrating clean lexical isolation without global state.',
      starterCode: `def create_accumulator(channel_name, initial_events=None):
    # TODO: Initialize channel state in enclosing scope
    # TODO: Define record, get_history, and clear closures
    # TODO: Return dispatch dictionary or callable interface
    pass
`,
      hints: [
        'Store history in a list: history = list(initial_events) if initial_events else [].',
        'Mutating a list (history.append) does not require nonlocal, but rebinding history = [] DOES require nonlocal history.',
      ],
      solutionReference: `def create_accumulator(channel_name, initial_events=None):
    history = list(initial_events) if initial_events else []
    total_records = len(history)

    def record(event):
        nonlocal total_records
        history.append(event)
        total_records += 1
        return total_records

    def get_history():
        return list(history)  # Defensive copy

    def clear():
        nonlocal total_records, history
        history = []
        total_records = 0

    return {
        "channel": channel_name,
        "record": record,
        "get_history": get_history,
        "clear": clear,
    }
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b17-d83-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Lexical Scope & The Late Binding Trap',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does the list comprehension [lambda: i for i in range(4)] produce functions that all return 3 when called after the loop finishes?',
      options: [
        'Because Python optimizes list comprehensions by caching only the return value of the last lambda expression.',
        'Because lambda functions in Python cannot access variables defined in enclosing loop scopes.',
        'Because closures bind to the variable location (cell object) rather than capturing the value at definition time; by the time the lambdas are called, i has completed the loop with value 3.',
        'Because range() objects mutate their memory in-place and overwrite all earlier integers.',
      ],
      correctIndex: 2,
      explanation: 'Python closures bind to cell objects containing the variable reference. All lambdas in the loop share the exact same variable `i`. When invoked after the loop, they look up `i` from their closure cell, which now holds 3. Snapshotting requires default arguments: lambda x=i: x.',
      misconceptionIdentified: 'Believing that Python closures take by-value copies of enclosing variables at the point of function definition.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 84: APPLY — Decorator Mechanics, Syntactic Sugar & Metadata Preservation ──
export const DAY_84_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w17-017',
  dayNumber: 2,
  title: 'Decorator Mechanics, Syntactic Sugar & Metadata Preservation',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b17-d84-01',
      type: 'THEORY',
      order: 1,
      title: 'The Decorator Contract: Mathematical Mapping, Wrapper Forwarding & Metadata Preservation',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand the formal architecture of Python decorators: syntactic transformation, transparent wrapper forwarding (*args, **kwargs), the critical Metadata Erasure Hazard, and the functools.wraps preservation invariant.',
      whatItIs: 'A decorator is a callable that takes a function object as an argument and returns a replacement callable. The syntax @decorator before a function def f(...) is exact syntactic sugar for f = decorator(f). A transparent wrapper forwards arbitrary positional and keyword arguments (*args, **kwargs) and propagates the wrapped function return value.',
      whyItExists: 'Decorators implement Aspect-Oriented Programming (AOP), separating cross-cutting concerns (authentication, logging, metrics, caching, retries) from core domain business logic.',
      problemSolved: 'Eliminates repetitive boilerplate scattered across domain functions, enforcing cross-cutting policies cleanly.',
      mentalModel: 'The Gift Box: The original function is a gift. A decorator places the gift inside an elegant box (the wrapper). When someone opens the box (calls the function), custom actions happen (tissue paper removed), the gift is used, and the result is returned.',
      realWorldUse: 'Flask/FastAPI route registrations, Django login_required, pytest fixtures, and telemetry timing.',
      commonMistakes: [
        'Forgetting to return wrapper from the decorator function, resulting in f becoming None.',
        'Failing to return the result of calling the wrapped function inside the wrapper, causing the decorated function to always return None.',
        'Omitting functools.wraps, which erases __name__, __doc__, __annotations__, and breaks inspect.signature or debugging tools.',
      ],
      commonMisconceptions: [
        'Misconception: "Decorators execute every time the decorated function is called." Reality: The DECORATOR function executes EXACTLY ONCE at module import/definition time when f = decorator(f) runs. It is the WRAPPER function that executes upon each subsequent invocation.',
        'Misconception: "f.__wrapped__ always points directly to the original raw function." Reality: In stacked decorators (@dec1 then @dec2), f.__wrapped__ exposes the callable wrapped by the CURRENT decorator layer (dec2 wrapper). Repeated __wrapped__ traversal is required to reach the base function.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b17-d84-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building a Transparent Timing & Audit Decorator with functools.wraps',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates implementing a non-intrusive execution logging decorator with functools.wraps, preserving metadata and exposing __wrapped__ for testing.',
      language: 'python',
      codeSnippet: `import functools
import time

def log_execution(func):
    """
    Transparent decorator logging function invocations.
    Preserves __name__, __doc__, __annotations__, and exposes __wrapped__.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        print(f"[AUDIT] Calling {func.__name__} with args={args}, kwargs={kwargs}")
        try:
            result = func(*args, **kwargs)
            duration = time.perf_counter() - start
            print(f"[AUDIT] {func.__name__} completed in {duration:.6f}s -> {result}")
            return result
        except Exception as e:
            duration = time.perf_counter() - start
            print(f"[AUDIT] {func.__name__} failed after {duration:.6f}s: {e}")
            raise

    return wrapper

@log_execution
def compute_payload(x: int, y: int) -> int:
    """Computes multiplication of two integers."""
    return x * y

# 1. Verification of Behavior
assert compute_payload(3, 4) == 12

# 2. Verification of Metadata Preservation Invariant
assert compute_payload.__name__ == "compute_payload"
assert compute_payload.__doc__ == "Computes multiplication of two integers."
assert compute_payload.__annotations__ == {"x": int, "y": int, "return": int}

# 3. Verification of __wrapped__ Introspection
assert hasattr(compute_payload, "__wrapped__")
assert compute_payload.__wrapped__(5, 6) == 30  # Bypasses logging wrapper!
print("Metadata preservation and unwrapping verified cleanly!")
`,
    } as ExampleBlock,
    {
      id: 'blk-b17-d84-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Enforcing Runtime Type Validation via Decorator Invariants',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Write a decorator @validate_integer_args that inspects all positional and keyword arguments.',
        'If any argument is not an instance of int (or is a bool, since bool subclasses int in Python), raise TypeError.',
        'Preserve wrapped function metadata using functools.wraps.',
        'Forward all return values faithfully.',
        'Verify that the raw unvalidated function is retrievable via func.__wrapped__.',
      ],
      expectedOutcome: 'A clean validation decorator enforcing runtime argument boundaries without mutating signatures.',
      starterCode: `import functools

def validate_integer_args(func):
    # TODO: Implement wrapper checking all args and kwargs are strictly int
    # TODO: Ensure bool is rejected (isinstance(True, int) is True!)
    # TODO: Return wrapper with @functools.wraps
    pass
`,
      hints: [
        'Remember that in Python, bool subclasses int: isinstance(True, int) is True! Use: type(arg) is int (or not isinstance(arg, bool) and isinstance(arg, int)).',
      ],
      solutionReference: `import functools

def validate_integer_args(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        for arg in args:
            if type(arg) is not int:
                raise TypeError(f"Argument {arg!r} is of type {type(arg).__name__}, expected int.")
        for k, v in kwargs.items():
            if type(v) is not int:
                raise TypeError(f"Keyword argument {k}={v!r} is of type {type(v).__name__}, expected int.")
        return func(*args, **kwargs)
    return wrapper
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b17-d84-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: The Metadata Erasure Hazard & __wrapped__',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What critical operational failure happens if a decorator omits @functools.wraps(func) on its inner wrapper?',
      options: [
        'The decorated function fails to execute and raises a native RecursionError.',
        'The decorated function adopts the wrapper name ("wrapper") and docstring (or None), breaking automated documentation generators, serialization, and test frameworks.',
        'Python disables garbage collection for the decorated module.',
        'The function can no longer accept keyword arguments.',
      ],
      correctIndex: 1,
      explanation: 'Without @functools.wraps(func), the decorated function object inherits the metadata of the inner wrapper function (e.g. __name__ = "wrapper", __doc__ = None), and loses __wrapped__. This breaks docstring generators, signature inspection, logging, and unit tests.',
      misconceptionIdentified: 'Assuming that Python automatically copies function metadata when returning a replacement function.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 85: BUILD — Parameterized Decorators & Multi-Tier Decorator Factories ──
export const DAY_85_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w17-017',
  dayNumber: 3,
  title: 'Parameterized Decorators & Multi-Tier Decorator Factories',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b17-d85-01',
      type: 'THEORY',
      order: 1,
      title: 'Parameterized Decorator Factories: Three-Tier Nesting & Deterministic Resilience Contracts',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master three-tier decorator factory architectures: factory(*factory_args) -> decorator(func) -> wrapper(*args, **kwargs). Enforce deterministic retry backoff formulas with injectable sleepers and fixed-window rate limiters with controllable clocks.',
      whatItIs: 'A parameterized decorator is not a decorator itself—it is a DECORATOR FACTORY. Calling @repeat(num_times=3) invokes repeat(3), which returns the actual decorator function that in turn wraps the target function. This requires three levels of nested function definitions.',
      whyItExists: 'Enables decorators to accept configuration parameters (such as retry counts, cache sizes, rate limits, role permissions) tailored to individual target functions.',
      problemSolved: 'Allows building configurable, reusable middleware and resilience components.',
      mentalModel: 'The Factory Machine: A decorator factory is a machine that builds custom gift boxes. Passing num_times=3 adjusts the factory settings to produce a specific box that executes the gift three times.',
      realWorldUse: 'Retry policies with backoff, rate limiting in API clients, role-based access control, and bounded LRU caches.',
      commonMistakes: [
        'Confusing decorator arguments with function arguments (e.g. writing def dec(func, num_times) instead of 3-tier nesting).',
        'Using wall-clock sleep in unit tests, creating slow and flaky test suites; resilient architectures inject a sleeper callable.',
        'Swallowing unexpected exceptions in retry loops instead of propagating non-retryable exceptions immediately.',
      ],
      commonMisconceptions: [
        'Misconception: "@retry(max_retries=3) means the function will run 3 times in total." Reality: In standard engineering contracts, max_retries represents additional retry attempts following an initial failed attempt. Total attempts = 1 + max_retries.',
        'Misconception: "Rate limiters must always use a complex sliding log algorithm." Reality: Fixed-window limiters track count N in window W based on monotonic clock intervals, providing simple and predictable behavior.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b17-d85-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building a Deterministic Retry Decorator with Injectable Sleeper & Backoff',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates a 3-tier parameterized retry decorator with exponential backoff, specific exception filtering, and injectable sleeper for non-blocking deterministic testing.',
      language: 'python',
      codeSnippet: `import functools
import time

class DecoratorStructureError(Exception): pass
class RetryExhaustedError(DecoratorStructureError): pass

def retry_with_backoff(max_retries=3, base_delay=1.0, max_delay=10.0, 
                       backoff_factor=2.0, retry_exceptions=(Exception,), 
                       sleeper=time.sleep):
    """
    Parameterized decorator factory for exponential backoff retries.
    Contract:
      - Initial call = Attempt 0.
      - Up to max_retries additional attempts (total invocations <= 1 + max_retries).
      - Delay formula for retry k (1 <= k <= max_retries):
        delay = min(base_delay * (backoff_factor ** (k - 1)), max_delay)
      - Non-matching exceptions propagate immediately without retry.
      - If all attempts fail, raises RetryExhaustedError from the last caught exception.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except retry_exceptions as e:
                    last_exception = e
                    if attempt < max_retries:
                        k = attempt + 1  # 1-indexed retry number
                        delay = min(base_delay * (backoff_factor ** (k - 1)), max_delay)
                        sleeper(delay)  # Injected sleeper enables instant testing!
                    else:
                        raise RetryExhaustedError(
                            f"Operation {func.__name__} exhausted {max_retries} retries."
                        ) from e
                except Exception:
                    # Non-matching exception: propagate immediately!
                    raise
            raise RetryExhaustedError("All retries exhausted.") from last_exception

        return wrapper
    return decorator

# Testing with recorded sleeper (Zero wall-clock delay!)
delays_recorded = []
def mock_sleeper(d):
    delays_recorded.append(d)

attempts_made = 0
@retry_with_backoff(max_retries=3, base_delay=0.5, backoff_factor=2.0, 
                    retry_exceptions=(ValueError,), sleeper=mock_sleeper)
def flaky_service():
    global attempts_made
    attempts_made += 1
    if attempts_made < 3:
        raise ValueError("Network glitch")
    return "SUCCESS"

result = flaky_service()
assert result == "SUCCESS"
assert attempts_made == 3
assert delays_recorded == [0.5, 1.0]  # 0.5 * 2^0, 0.5 * 2^1
print(f"Deterministic retry verified with delays: {delays_recorded}!")
`,
    } as ExampleBlock,
    {
      id: 'blk-b17-d85-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Building a Fixed-Window Rate Limiter with Controllable Clock',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Implement rate_limiter(max_calls, period_seconds, clock_func=time.monotonic).',
        'Use closure state to track window_start_time and current_call_count.',
        'If call occurs within window and count < max_calls, allow and increment.',
        'If call occurs within window and count >= max_calls, raise RateLimitExceededError.',
        'If call occurs after window has elapsed, reset window_start_time to current clock and reset count to 1.',
        'Test using an injectable mock clock to simulate time passing instantaneously.',
      ],
      expectedOutcome: 'A fixed-window rate limiter closure with testable clock injection.',
      starterCode: `import functools
import time

class RateLimitExceededError(Exception): pass

def rate_limiter(max_calls, period_seconds, clock_func=time.monotonic):
    # TODO: Implement 3-tier factory with closure state tracking window and count
    pass
`,
      hints: [
        'Track window_start = clock_func() and call_count = 0 in the decorator scope.',
        'When clock_func() - window_start >= period_seconds, rebind window_start = clock_func() and call_count = 1 using nonlocal.',
      ],
      solutionReference: `import functools
import time

class RateLimitExceededError(Exception): pass

def rate_limiter(max_calls, period_seconds, clock_func=time.monotonic):
    def decorator(func):
        window_start = None
        call_count = 0

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal window_start, call_count
            now = clock_func()
            if window_start is None or (now - window_start) >= period_seconds:
                window_start = now
                call_count = 1
                return func(*args, **kwargs)

            if call_count < max_calls:
                call_count += 1
                return func(*args, **kwargs)
            else:
                raise RateLimitExceededError(
                    f"Rate limit exceeded: {max_calls} calls per {period_seconds}s."
                )

        return wrapper
    return decorator
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b17-d85-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Decorator Factory Invocation Lifecycle',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'In the syntax @timeout(seconds=5) placed above def query(): ..., in what order and at what times do the factory, decorator, and wrapper functions execute?',
      options: [
        'All three functions execute sequentially every time query() is called.',
        'timeout(5) executes at module import/definition time to produce the decorator; the decorator executes immediately to wrap query; the wrapper executes on each subsequent call to query().',
        'The factory and decorator execute only when Python finishes garbage collection.',
        'The wrapper executes first to inspect query, then the factory parses the seconds argument.',
      ],
      correctIndex: 1,
      explanation: 'The factory timeout(seconds=5) executes immediately during module parsing to return a decorator. That decorator immediately takes query as its argument and returns wrapper. The wrapper is then invoked whenever query() is subsequently called at runtime.',
      misconceptionIdentified: 'Believing that parameterized decorator factories re-evaluate their outer arguments on every function invocation.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 86: DEBUG — Closure State Drift, Stacking Order & Decorator Anti-Patterns ──
export const DAY_86_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w17-017',
  dayNumber: 4,
  title: 'Closure State Drift, Stacking Order & Decorator Anti-Patterns',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b17-d86-01',
      type: 'THEORY',
      order: 1,
      title: 'Anatomy of 4 Decorator Invariant Defects: Stacking Inversion, Shared State & Signature Corruption',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Analyze four subtle architectural bugs in decorator implementations: definition vs dispatch stacking inversion, accidental closure state sharing, signature corruption, and broken layer-by-layer unwrapping.',
      whatItIs: 'Taxonomy of decorator defects: 1) Stacking Inversion: @dec1 then @dec2 executes as dec1(dec2(f)), meaning dec1 runs outer and dec2 runs inner; 2) Shared Mutable Closure State: Multiple decorated functions accidentally sharing mutable state if created by flawed factory patterns; 3) Signature Corruption: Hardcoding wrapper arguments (*args) without forwarding (**kwargs); 4) Layer-by-layer __wrapped__ traversal corruption.',
      whyItExists: 'Decorators wrap arbitrary callables across large systems; subtle wrapper bugs propagate silently or cause intermittent authorization, caching, or latency failures.',
      problemSolved: 'Equips engineers with defensive diagnostic test patterns to verify stacking order, signature fidelity, and unwrapping.',
      mentalModel: 'The Stacked Coats: When leaving the house in winter, you put on a sweater (@sweater), then an overcoat (@coat). The outer layer (@coat) encounters the wind first when walking outside, but you put the sweater on first when dressing.',
      realWorldUse: 'Debugging middleware order in web frameworks, auth before caching vs caching before auth, and transaction management.',
      commonMistakes: [
        'Placing @cache above @authenticate, allowing unauthorized users to retrieve cached responses computed by prior authorized users.',
        'Omitting **kwargs in wrapper(*args), crashing whenever a caller passes keyword arguments.',
        'Assuming f.__wrapped__ unwraps all layers at once; in stacked decorators, each __wrapped__ access unwraps exactly one decorator layer.',
      ],
      commonMisconceptions: [
        'Misconception: "Top decorator wraps first." Reality: The bottom-most decorator immediately adjacent to def f() evaluates first at definition time: @d1 then @d2 means f = d1(d2(f)).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b17-d86-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge: Triaging a Broken Middleware Stack & Leaky Cache',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_CLOSURES_AND_DECORATORS,
      problemDescription: 'A production API service contains 3 critical decorator defects: (1) Stacking order places @memoize above @require_admin, allowing cached admin data to leak to unauthorized callers; (2) The memoize wrapper fails to normalize keyword arguments, producing duplicate cache entries for identical calls; (3) The auth wrapper erases metadata by omitting functools.wraps.',
      symptom: 'Unauthorized users read cached privileged records, cache hit rates are 50% lower than expected, and API route documentation renders with generic "wrapper" docstrings.',
      brokenArtifact: `def require_admin(func):
    # BUG: Missing @functools.wraps
    def wrapper(user, *args, **kwargs):
        if not user.get("is_admin"):
            raise PermissionError("Admin required")
        return func(user, *args, **kwargs)
    return wrapper

def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # BUG: Ignores kwargs order and unhashable keys
        key = (args, str(kwargs))
        if key not in cache:
            cache[key] = func(*args, **kwargs)
        return cache[key]
    return wrapper

# BUG: Stacking order leak!
@memoize
@require_admin
def fetch_financial_records(user, quarter):
    """Fetches confidential financial ledger."""
    return f"Records for {quarter}"
`,
      reproductionSteps: [
        'Call fetch_financial_records({"is_admin": True}, "Q1") -> caches result.',
        'Call fetch_financial_records({"is_admin": False}, "Q1") -> returns cached records WITHOUT permission check!',
        'Inspect fetch_financial_records.__doc__ -> returns None.',
      ],
      expectedPatch: 'Invert stacking order so @require_admin sits outside @memoize, apply @functools.wraps to require_admin, and normalize kwargs deterministically as sorted tuple.',
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b17-d86-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Lab: Writing an Invariant Verification Harness for Stacked Decorators',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Write assert_stacking_order(decorated_func, trace_list) validating execution order.',
        'Verify that outer decorator runs before inner decorator.',
        'Verify that unwrapping via func.__wrapped__ peels exactly one decorator layer at a time.',
        'Verify that func.__wrapped__.__wrapped__ reaches the original undecorated function.',
      ],
      expectedOutcome: 'A comprehensive invariant assertion harness for multi-layer stacked decorators.',
      starterCode: `def verify_stack_invariants(f, original_base):
    # TODO: Verify metadata, layer-by-layer __wrapped__ peeling, and base function identity
    pass
`,
      hints: [
        'Layer 1: f.__wrapped__ is the inner wrapper.',
        'Layer 2: f.__wrapped__.__wrapped__ is original_base.',
      ],
      solutionReference: `def verify_stack_invariants(f, original_base):
    assert hasattr(f, "__wrapped__"), "Outer decorator missing __wrapped__!"
    inner = f.__wrapped__
    assert hasattr(inner, "__wrapped__"), "Inner decorator missing __wrapped__!"
    base = inner.__wrapped__
    assert base is original_base, "Two-layer peeling failed to reach base function!"
    assert f.__name__ == original_base.__name__, "Function name metadata lost in stack!"
    assert f.__doc__ == original_base.__doc__, "Docstring metadata lost in stack!"
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b17-d86-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Stacking Order Semantics',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Given the stacked definition:\n@decorator_a\n@decorator_b\ndef process(): ...\nWhich statement accurately describes the definition and execution order?',
      options: [
        'decorator_a executes first at definition time; decorator_b executes first at runtime invocation.',
        'decorator_b wraps process first at definition time: process = decorator_a(decorator_b(process)); at runtime invocation, decorator_a wrapper executes first, then dispatches to decorator_b wrapper.',
        'Both decorators execute in parallel using multi-threading.',
        'Python randomizes stacking order unless decorators are numbered.',
      ],
      correctIndex: 1,
      explanation: 'Stacked decorators evaluate bottom-up at definition time: `decorator_b` wraps `process`, and `decorator_a` wraps that resulting wrapper. At runtime, the outer wrapper (`decorator_a`) is called first, which in turn calls the inner wrapper (`decorator_b`).',
      misconceptionIdentified: 'Confusing the definition-time bottom-up wrapping sequence with the runtime top-down dispatch order.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 87: TRANSFER — Formative Assessment: Production Telemetry & Resilience Decorator Suite ──
export const DAY_87_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m5-w17-017',
  assessmentCode: 'ASM-PFS-M5-W17-017',
  title: 'Batch 017 Formative Assessment: Production Telemetry, Resilience & Memoization Decorator Architecture',
  description: 'Design and synthesize production-grade resilience and performance decorators: exponential backoff retry with injectable sleep, deterministic memoization caching with unhashable argument defense and statistics introspection, and signature enforcement.',
  type: 'CODE',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  difficulty: 'INTERMEDIATE',
  timeLimitMinutes: 95,
  passingScore: 70,
  maxAttempts: 3,
  attemptPolicy: 'LIMITED_BEST',
  targetCompetencyId: COMPETENCY_ID_CLOSURES_AND_DECORATORS,
  batchId: 'batch-pfs-m5-w17-017',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
  items: [
    {
      id: 'item-b17-01',
      assessmentId: 'asm-pfs-m5-w17-017',
      itemType: 'CODE',
      points: 100,
      order: 1,
      timeEstimateMinutes: 95,
      version: '1.0.0',
      prompt: `Implement two mission-critical decorator architectures and utilize the provided signature validator scaffolding:

TASK A: @retry_with_backoff (Parameterized Resilience Decorator Factory)
Contract & Specification:
- Signature: retry_with_backoff(max_retries=3, base_delay=1.0, max_delay=10.0, backoff_factor=2.0, retry_exceptions=(Exception,), sleeper=time.sleep)
- Attempts: Initial invocation is attempt 0. Up to max_retries additional retry attempts (total attempts <= 1 + max_retries).
- Backoff delay formula for retry k (1 <= k <= max_retries):
    delay = min(base_delay * (backoff_factor ** (k - 1)), max_delay)
- Exception Filtering: Only catch and retry exceptions that are instances of retry_exceptions. Any other exception must immediately propagate outwards without retry.
- Exhaustion: If all retries fail, raise RetryExhaustedError from the final caught exception.
- Sleeper Injection: The decorator must call sleeper(delay) before each retry. In unit tests, an injected mock sleeper records delays and avoids real wall-clock waiting.
- Metadata: Must use @functools.wraps and expose the callable wrapped by the current layer via __wrapped__.

TASK B: @memoize_with_stats (Stateful Closure Caching Decorator Factory)
Contract & Specification:
- Signature: memoize_with_stats(maxsize=None)
- Deterministic Cache Key Contract:
    args_key = tuple(args)
    kwargs_key = tuple(sorted(kwargs.items()))
    cache_key = (args_key, kwargs_key)
  * Note: In Batch 017, f(1, 2) and f(1, b=2) are intentionally distinct cache entries; full signature binding normalization is not required.
- Unhashable Argument Defense: Every element of the constructed key must be hashable. If any argument cannot be hashed (e.g. list, dict), raise UnhashableArgumentError immediately without calling the wrapped function.
- Introspection Attributes attached to wrapper:
    wrapper.hits: int (count of cache hits)
    wrapper.misses: int (count of cache misses / evaluations)
    wrapper.cache_clear(): resets hits to 0, misses to 0, and empties cache.
    wrapper.stats(): returns dict {"hits": int, "misses": int, "size": int}
- Bounded Cache: If maxsize is an integer > 0 and len(cache) reaches maxsize upon a miss, evict the oldest inserted key (FIFO or LRU order) before inserting.
- Metadata: Must use @functools.wraps and expose __wrapped__.

CANONICAL EXCEPTION HIERARCHY:
  class DecoratorStructureError(Exception): pass
  class MetadataPreservationError(DecoratorStructureError): pass
  class SignatureMismatchError(DecoratorStructureError): pass
  class RetryExhaustedError(DecoratorStructureError): pass
  class UnhashableArgumentError(DecoratorStructureError): pass
  class RateLimitExceededError(DecoratorStructureError): pass
`,
      starterCode: `import functools
import time
import inspect

class DecoratorStructureError(Exception): pass
class MetadataPreservationError(DecoratorStructureError): pass
class SignatureMismatchError(DecoratorStructureError): pass
class RetryExhaustedError(DecoratorStructureError): pass
class UnhashableArgumentError(DecoratorStructureError): pass
class RateLimitExceededError(DecoratorStructureError): pass

# ── PROVIDED SCAFFOLDING: Runtime Signature Enforcement ──
def enforce_signature(func):
    """Provided helper decorator: Validates caller arguments match function parameter count."""
    sig = inspect.signature(func)
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            sig.bind(*args, **kwargs)
        except TypeError as e:
            raise SignatureMismatchError(f"Signature mismatch: {e}") from e
        return func(*args, **kwargs)
    return wrapper

# ── TASK A: Implement Parameterized Retry Decorator Factory ──
def retry_with_backoff(max_retries=3, base_delay=1.0, max_delay=10.0, 
                       backoff_factor=2.0, retry_exceptions=(Exception,), 
                       sleeper=time.sleep):
    # TODO: Implement 3-tier decorator factory with deterministic backoff and sleeper injection
    pass

# ── TASK B: Implement Stateful Memoize Decorator Factory ──
def memoize_with_stats(maxsize=None):
    # TODO: Implement 2-tier or 3-tier decorator factory with deterministic keying, stats, and unhashable defense
    pass
`,
      solutionCode: `import functools
import time
import inspect

class DecoratorStructureError(Exception): pass
class MetadataPreservationError(DecoratorStructureError): pass
class SignatureMismatchError(DecoratorStructureError): pass
class RetryExhaustedError(DecoratorStructureError): pass
class UnhashableArgumentError(DecoratorStructureError): pass
class RateLimitExceededError(DecoratorStructureError): pass

def enforce_signature(func):
    sig = inspect.signature(func)
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            sig.bind(*args, **kwargs)
        except TypeError as e:
            raise SignatureMismatchError(f"Signature mismatch: {e}") from e
        return func(*args, **kwargs)
    return wrapper

def retry_with_backoff(max_retries=3, base_delay=1.0, max_delay=10.0, 
                       backoff_factor=2.0, retry_exceptions=(Exception,), 
                       sleeper=time.sleep):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exc = None
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except retry_exceptions as e:
                    last_exc = e
                    if attempt < max_retries:
                        k = attempt + 1
                        delay = min(base_delay * (backoff_factor ** (k - 1)), max_delay)
                        sleeper(delay)
                    else:
                        raise RetryExhaustedError(
                            f"Function {func.__name__} exhausted {max_retries} retries."
                        ) from e
                except Exception:
                    raise
            raise RetryExhaustedError("Retries exhausted.") from last_exc
        return wrapper
    return decorator

def memoize_with_stats(maxsize=None):
    def decorator(func):
        cache = {}
        hits = 0
        misses = 0

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal hits, misses
            args_key = tuple(args)
            kwargs_key = tuple(sorted(kwargs.items()))
            cache_key = (args_key, kwargs_key)

            try:
                hash(cache_key)
            except TypeError:
                raise UnhashableArgumentError(
                    f"Arguments to {func.__name__} are unhashable: args={args}, kwargs={kwargs}"
                )

            if cache_key in cache:
                hits += 1
                wrapper.hits = hits
                return cache[cache_key]

            misses += 1
            wrapper.misses = misses
            val = func(*args, **kwargs)

            if maxsize is not None and maxsize > 0 and len(cache) >= maxsize:
                oldest_key = next(iter(cache))
                del cache[oldest_key]

            cache[cache_key] = val
            return val

        def cache_clear():
            nonlocal hits, misses
            cache.clear()
            hits = 0
            misses = 0
            wrapper.hits = 0
            wrapper.misses = 0

        def stats():
            return {"hits": hits, "misses": misses, "size": len(cache)}

        wrapper.hits = 0
        wrapper.misses = 0
        wrapper.cache_clear = cache_clear
        wrapper.stats = stats
        return wrapper
    return decorator
`,
      visibleTests: [
        {
          id: 'vt-b17-01',
          name: 'Task A: Retry Success After Flaky Failures & Injected Sleeper Verification',
          input: '{"flaky_attempts": 2, "max_retries": 3}',
          expectedOutput: '{"result": "OK", "attempts": 3, "delays": [1.0, 2.0]}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-b17-02',
          name: 'Task B: Memoization Cache Hits, Misses & Stats Verification',
          input: '{"calls": [1, 2, 1, 2, 3]}',
          expectedOutput: '{"hits": 2, "misses": 3, "size": 3}',
          tier: 'VISIBLE',
        },
      ],
      adversarialTests: [
        {
          id: 'at-b17-01',
          name: 'Task A: Immediate Propagation of Non-Retryable Exceptions',
          input: '{"exception": "KeyError", "retry_exceptions": ["ValueError"]}',
          expectedOutput: '{"retried": false, "propagated_immediately": true}',
          tier: 'ADVERSARIAL',
        },
        {
          id: 'at-b17-02',
          name: 'Task B: Unhashable Argument Defense on Mutable Payload',
          input: '{"arg": [1, 2, 3]}',
          expectedOutput: '{"unhashable_raised": true}',
          tier: 'ADVERSARIAL',
        },
      ],
      integrityTests: [
        {
          id: 'it-b17-01',
          name: 'Task A & B: Multi-Layer Stacking and __wrapped__ Traversal Invariant',
          input: '{"stack": ["retry", "memoize", "enforce_signature"]}',
          expectedOutput: '{"two_layer_peeling_reached_base": true, "metadata_preserved": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        {
          id: 'dim-b17-01',
          name: 'Architecture',
          description: 'Parameterized @retry_with_backoff factory with accurate attempt counting, deterministic delay formula, and sleeper injection.',
          criteria: 'Parameterized @retry_with_backoff factory with accurate attempt counting, deterministic delay formula, and sleeper injection. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
        },
        {
          id: 'dim-b17-02',
          name: 'ErrorHandling',
          description: 'Exception filtering in retry (only retrying specified exceptions, propagating non-matching immediately) and raising RetryExhaustedError from last exception.',
          criteria: 'Exception filtering in retry (only retrying specified exceptions, propagating non-matching immediately) and raising RetryExhaustedError from last exception.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'dim-b17-03',
          name: 'DataStructureSelection',
          description: 'Deterministic memoization key tuple construction: args as tuple and kwargs as sorted (key, value) pairs.',
          criteria: 'Deterministic memoization key tuple construction: args as tuple and kwargs as sorted (key, value) pairs.',
          weight: 0.10,
          maxPoints: 10,
        },
        {
          id: 'dim-b17-04',
          name: 'EdgeCaseRobustness',
          description: 'Defends unhashable arguments with UnhashableArgumentError and implements bounded FIFO/LRU eviction when maxsize exceeded.',
          criteria: 'Defends unhashable arguments with UnhashableArgumentError and implements bounded FIFO/LRU eviction when maxsize exceeded.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'dim-b17-05',
          name: 'Correctness',
          description: 'Accurate hits/misses counter tracking, cache_clear() operation, and stats() introspection dictionary. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
          criteria: 'Accurate hits/misses counter tracking, cache_clear() operation, and stats() introspection dictionary. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
        },
        {
          id: 'dim-b17-06',
          name: 'DesignJudgment',
          description: 'Preserves function metadata (__name__, __doc__, __annotations__) and exposes callable wrapped by current layer via __wrapped__.',
          criteria: 'Preserves function metadata (__name__, __doc__, __annotations__) and exposes callable wrapped by current layer via __wrapped__.',
          weight: 0.05,
          maxPoints: 5,
        },
        {
          id: 'dim-b17-07',
          name: 'Performance',
          description: 'Supports stacking without redundant re-evaluation or memory leaks; non-blocking sleeper injection allows instant unit testing.',
          criteria: 'Supports stacking without redundant re-evaluation or memory leaks; non-blocking sleeper injection allows instant unit testing.',
          weight: 0.05,
          maxPoints: 5,
        },
      ],
    },
  ],
};

export const DAY_87_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w17-017',
  dayNumber: 5,
  title: 'Formative Assessment: Production Telemetry, Resilience & Memoization Decorator Architecture',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b17-d87-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Production Telemetry & Resilience Decorator Suite',
      estimatedMinutes: 80,
      status: 'PUBLISHED',
      version: '1.0.0',
      difficulty: 'INTERMEDIATE',
      timeExpectationMinutes: 80,
      targetCompetencyId: COMPETENCY_ID_CLOSURES_AND_DECORATORS,
      unfamiliarDomainContext: 'High-Throughput Microservice Middleware & Resilient RPC Client Architecture',
      task: 'Synthesize parameterized retry decorator with exponential backoff and memoization cache decorator with unhashable defense, stats tracking, and stacked composition.',
      constraints: [
        'Retry initial invocation = attempt 0; up to max_retries additional attempts.',
        'Backoff delay formula: delay = min(base_delay * (backoff_factor ** (k - 1)), max_delay).',
        'Sleeper injection: Must call sleeper(delay) for non-blocking testability.',
        'Deterministic cache key: (tuple(args), tuple(sorted(kwargs.items()))).',
        'Unhashable arguments MUST raise UnhashableArgumentError.',
        'Dual competency floor: Minimum 50% score required on both retry and memoize dimensions.',
      ],
      starterArtifact: `class DecoratorStructureError(Exception): pass
class MetadataPreservationError(DecoratorStructureError): pass
class SignatureMismatchError(DecoratorStructureError): pass
class RetryExhaustedError(DecoratorStructureError): pass
class UnhashableArgumentError(DecoratorStructureError): pass
class RateLimitExceededError(DecoratorStructureError): pass

def retry_with_backoff(max_retries=3, base_delay=1.0, max_delay=10.0, backoff_factor=2.0, retry_exceptions=(Exception,), sleeper=time.sleep):
    pass

def memoize_with_stats(maxsize=None):
    pass
`,
    } as TransferChallengeBlock,
    {
      id: 'blk-b17-d87-02',
      type: 'REFLECTION',
      order: 2,
      title: 'Architectural Reflection: Decorators, Closures & Aspect-Oriented Engineering in Python',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on the trade-offs of Aspect-Oriented Programming using Python decorators, closure memory lifecycles, and testing strategies for stateful wrappers.',
      guidingQuestions: [
        'How does lexical scope and closure cell allocation in CPython allow state retention without global variables or explicit classes?',
        'Why does decorator stacking order have critical security and correctness implications (e.g. authentication vs caching)?',
        'Why is dependency injection (like injectable sleeper and clock callables) crucial for building deterministic automated tests for decorators that involve timing and backoff?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b17-d87-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Batch 017 Reference Sheet: Decorator Architecture, functools.wraps & Closure Mechanics',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Documentation: functools.wraps',
          url: 'https://docs.python.org/3/library/functools.html#functools.wraps',
        },
        {
          title: 'Python Official Documentation: PEP 318 – Decorators for Functions and Methods',
          url: 'https://peps.python.org/pep-0318/',
        },
        {
          title: 'Python Official Documentation: PEP 3104 – Access to Names in Outer Scopes (nonlocal)',
          url: 'https://peps.python.org/pep-3104/',
        },
      ],
      documentationExtracts: [
        'Python 3.14 Documentation: functools.wraps copies __module__, __name__, __qualname__, __doc__, and __annotations__ from the wrapped function to the wrapper function, and updates __dict__ while setting __wrapped__ to point to the wrapped callable.',
        'Closure Cell Invariant: Free variables in closures are stored in PyCellObject instances on the heap, ensuring persistent state even after enclosing stack frames unwind.',
        'Stacking Semantics: @d1 followed by @d2 over def f() evaluates definition-time as f = d1(d2(f)). Runtime calls enter d1 first.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 017 MASTER MANIFEST ──
export const BATCH_017_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m5-w17-017',
  batchCode: 'P2-M5-W17-BATCH017',
  title: 'Advanced Python: Closures, Lexical Scoping Invariants, First-Class Functions & Decorator Architecture',
  difficulty: 'INTERMEDIATE',
  days: [
    DAY_83_MANIFEST,
    DAY_84_MANIFEST,
    DAY_85_MANIFEST,
    DAY_86_MANIFEST,
    DAY_87_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
};
