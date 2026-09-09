// src/lib/curriculum/pythonFullStack/batch019.ts
// Single Source of Truth for PINIT BATCH 019: Month 5 · Week 19 · Days 93–97
// Advanced Python: Context Managers, Resource Lifecycle Protocols, Dunder Protocol Engineering & Defensive Transaction Architecture
// Pedagogical Flow: UNDERSTAND (Protocol & Dunder Mechanics) -> APPLY (Exception Suppression & State Rollbacks) -> BUILD (@contextmanager & Dynamic LIFO ExitStack) -> DEBUG (Over-Suppression & Re-entrancy Hazards) -> TRANSFER (Transactional Resource Management Engine Capstone)

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

export const COMPETENCY_ID_CONTEXT_MANAGERS_AND_RESOURCES = 'comp-pfs-m5-019';

// ── CANONICAL DOMAIN EXCEPTIONS FOR RESOURCE MANAGEMENT ──
// Used across instruction, labs, challenges, and assessment contracts:
// 1. ResourceManagementError: Base exception for domain-level resource and context management errors.
// 2. TransactionRollbackError: Raised when a transaction explicitly fails and is rolled back.
// 3. ResourceAcquisitionError: Raised when a resource cannot be acquired or leased.
// Note: In accordance with authentic Python protocols:
// - Exception suppression is truth-value based: returning a true value from __exit__ suppresses exceptions; returning a false value or None propagates them (the curriculum recommends explicit True/False returns for clarity).
// - Native exceptions (TypeError, ValueError, KeyError, etc.) propagate without artificial wrapping.
// - Raising an exception in __enter__ aborts execution before the body is entered; __exit__ is NOT invoked.
// - with Resource() as value translates to: manager = Resource(); value = manager.__enter__(); try ... finally manager.__exit__(...).

// ── DAY 93: UNDERSTAND — The Python Context Management Protocol & Resource Mechanics ──
export const DAY_93_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w19-019',
  dayNumber: 1,
  title: 'The Python Context Management Protocol & Resource Mechanics',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b19-d93-01',
      type: 'THEORY',
      order: 1,
      title: 'Deterministic Context-Managed Cleanup, Dunder Contracts & Bytecode Dispatch',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the formal mechanics of the Python Context Management Protocol: why object finalizers (__del__) are potentially non-deterministic, how the with statement enforces deterministic context-managed cleanup vs potentially nondeterministic object finalization (__del__), the __enter__() and __exit__() dunder contracts, the canonical expansion of with statements, bytecode dispatch (BEFORE_WITH, SETUP_WITH), and distinguishing the context manager from the as binding target.',
      whatItIs: 'In Python, the Context Management Protocol governs deterministic resource allocation and release. An object is a context manager if it implements __enter__() (executed upon entering the with block, returning a target value) and __exit__() (executed upon leaving the with block, receiving any active exception tuple).\n\nAccording to PEP 343 and the Python Language Reference, a statement of the form:\n  with Resource() as value:\n      ...\nis evaluated by Python approximately as:\n  manager = Resource()\n  value = manager.__enter__()\n  try:\n      ...\n  finally:\n      manager.__exit__(*sys.exc_info())\nThe return value of manager.__enter__() is bound to the as target. It is essential to recognize that value is NOT necessarily manager itself—it is whatever __enter__() returns (for example, open() returns the file stream, while a lock might return True/None or self).',
      whyItExists: 'Prevents resource descriptor leaks (file handles, database sockets, thread locks, ephemeral scratch directories) that occur when code encounters unexpected errors, early return statements, or unhandled exceptions before traditional manual cleanup code runs.',
      problemSolved: 'Eliminates verbose, error-prone try...finally boilerplate sprawl and avoids relying on CPython reference counting or potentially non-deterministic object finalization (__del__) for resource reclamation.',
      mentalModel: 'The Safe Deposit Box: Entering the room requires a key and clerk verification (__enter__). When inside, you can perform transactions. Regardless of whether you finish gracefully, feel ill, or trigger a fire alarm, the security vault door automatically seals and locks behind you as you exit (__exit__).',
      realWorldUse: 'Database transaction scopes, distributed Redis lock leases, temporary scratch file cleanup, high-precision performance telemetry, and resource leases.',
      commonMistakes: [
        'Assuming __enter__() must return self: while open() returns the file object, lock context managers return None or True, and timer contexts return a measurement object.',
        'Relying on __del__() destructor finalizers for timely resource cleanup: circular references or alternative runtimes (PyPy) delay GC unpredictably.',
        'Assuming an exception raised inside __enter__() will trigger __exit__(): if __enter__() fails, the context block was never entered, so __exit__() is never called on that manager.',
      ],
      commonMisconceptions: [
        'Misconception: "The with statement only works with files." Reality: Any class implementing __enter__ and __exit__ can serve as a context manager.',
        'Misconception: "The as target is the context manager instance." Reality: The as target binds strictly to whatever expression __enter__() returns, which may or may not be self.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b19-d93-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Implementing Class-Based Context Managers: PreciseTimer & ManagedBuffer',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates implementing custom class-based context managers adhering strictly to the Context Management Protocol, verifying __enter__ binding, monotonic time measurement, and automatic resource release upon scope exit.',
      language: 'python',
      codeSnippet: `import time

class PreciseTimer:
    """Monotonic execution timer context manager exposing duration during and after block."""
    def __init__(self):
        self.start_time = 0.0
        self.end_time = 0.0
        self.elapsed = 0.0

    def __enter__(self):
        self.start_time = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = time.perf_counter()
        self.elapsed = self.end_time - self.start_time
        # Invariant: Returning False or None propagates exceptions normally
        return False

class ManagedBuffer:
    """A managed memory buffer with explicit allocation and deterministic cleanup."""
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.buffer = []
        self.is_open = False

    def __enter__(self):
        self.is_open = True
        self.buffer = []
        return self.buffer

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Guarantee resource release regardless of exceptions
        self.buffer = []
        self.is_open = False
        return False

# 1. Verification of PreciseTimer
with PreciseTimer() as timer:
    total = sum(x * x for x in range(1000))
    assert timer.elapsed == 0.0  # Still executing

assert timer.elapsed > 0.0  # Evaluated on exit

# 2. Verification of ManagedBuffer
with ManagedBuffer(10) as buf:
    buf.append("data_chunk_1")
    assert len(buf) == 1
`,
    } as ExampleBlock,
    {
      id: 'blk-b19-d93-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Building TemporaryEnvironmentVariableManager',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Create class TemporaryEnvironment accepting keyword arguments as environment variable overrides.',
        'In __enter__, snapshot existing os.environ keys and apply overrides.',
        'In __exit__, restore previously existing keys and pop newly created keys.',
        'Ensure __exit__ returns False to allow caller exceptions to propagate cleanly.',
      ],
      expectedOutcome: 'A reusable context manager providing temporary, isolated environment variable mutation with deterministic cleanup.',
      starterCode: `import os

class TemporaryEnvironment:
    def __init__(self, **overrides):
        self.overrides = overrides
        self.saved_state = {}

    def __enter__(self):
        # TODO: Snapshot and apply overrides
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: Restore previous state
        pass
`,
      hints: [
        'Store original value as None if key was not present initially in os.environ.',
        'Iterate over saved_state and restore or delete accordingly.',
      ],
      solutionReference: `import os

class TemporaryEnvironment:
    def __init__(self, **overrides):
        self.overrides = overrides
        self.saved_state = {}

    def __enter__(self):
        self.saved_state = {}
        for k, v in self.overrides.items():
            self.saved_state[k] = os.environ.get(k)
            os.environ[k] = str(v)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        for k, original_val in self.saved_state.items():
            if original_val is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = original_val
        return False
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b19-d93-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Dunder Contracts & Exit Signaling',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What arguments does Python automatically pass to __exit__() when an unhandled exception occurs inside a with block?',
      options: [
        '(exc_type, exc_val, exc_tb) containing the exception class, the instance, and the traceback object.',
        '(exc_type, exc_val) containing only the class and error message string.',
        'A single exception instance exc with no traceback information.',
        'None; the exception is caught before __exit__() is ever called.',
      ],
      correctIndex: 0,
      explanation: 'Python passes 3 arguments to __exit__ in addition to self: (exc_type, exc_val, exc_tb). If the block exits cleanly without error, all three arguments are None.',
      misconceptionIdentified: 'Believing that __exit__ receives only a single exception argument or message string.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b19-d93-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Reference: PEP 343 The with Statement Specification',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PEP 343 – The "with" Statement',
          url: 'https://peps.python.org/pep-0343/',
        },
        {
          title: 'Python Documentation: With Statement Context Managers',
          url: 'https://docs.python.org/3/reference/datamodel.html#context-managers',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 94: APPLY — Exception Handling, Suppression Semantics & Transactional State Restoration ──
export const DAY_94_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w19-019',
  dayNumber: 2,
  title: 'Exception Handling, Suppression Semantics & Transactional State Restoration',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b19-d94-01',
      type: 'THEORY',
      order: 1,
      title: 'Exception Inspection, Truth-Value Suppression & Transactional State Restoration',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Deep dive into exception handling inside __exit__: inspecting the 3 exception parameters, understanding the truth-value return contract (returning a true value suppresses the exception; returning a false value or None propagates it; the curriculum recommends explicit True/False returns for clarity), and constructing transactional units of work that isolate state mutations and restore snapshots upon failure.',
      whatItIs: 'When code inside a with block raises an exception, Python intercepts it and invokes __exit__(exc_type, exc_val, exc_tb). Python tests the truth value of the return value (bool(ret)). If __exit__() evaluates to a true value, the exception is suppressed and normal execution resumes after the with block. If it evaluates to a false value (or None), the exception is automatically re-raised by the interpreter. While any truthy or falsy object is evaluated by Python, our curriculum recommends returning explicit boolean literals True and False for clarity and defensive engineering.',
      whyItExists: 'Enables patterns like selective error suppression (ignoring known benign errors like FileNotFoundError or AlreadyExistsError) and transactional integrity (rolling back dirty writes before deciding whether to suppress or bubble up).',
      problemSolved: 'Replaces complex nested try...except...finally blocks with clean, declarative transactional scopes that guarantee in-memory state restoration (all-or-nothing mutations for deepcopy-compatible mappings).',
      mentalModel: 'The Isolated Workspace Snapshot: When a transaction block begins, an in-memory snapshot is captured. If all mutations succeed, the transaction commits in-place. If an error occurs, the rollback handler restores the exact pre-transaction snapshot into the target mapping before determining whether to suppress the error or bubble up.',
      realWorldUse: 'In-memory state staging, configuration rollback managers, and dictionary transaction units.',
      commonMistakes: [
        'Returning a truthy value (e.g. non-empty string, number 1) unintentionally from __exit__, silently swallowing critical errors like NameError or MemoryError.',
        'Performing shallow copies of nested state structures: mutating a nested list or dict in a shallow copy corrupts the original state upon rollback.',
        'Re-raising the exception manually inside __exit__ with raise exc_val: this alters the exception traceback unnecessarily; simply returning False allows Python to re-raise natively.',
        'Assuming deepcopy rollback provides database/file/network transaction atomicity: copy.deepcopy() cannot undo external I/O, file writes, or network requests, and fails on files, sockets, and frames.',
      ],
      commonMisconceptions: [
        'Misconception: "Returning None from __exit__ suppresses exceptions." Reality: None is falsy in Python; returning None causes the exception to be re-raised immediately.',
        'Misconception: "You can suppress KeyboardInterrupt by returning True." Reality: While technically possible, swallowing BaseException subclasses (SystemExit, KeyboardInterrupt) is an anti-pattern that cripples process control.',
        'Misconception: "In-memory rollback makes file writes atomic." Reality: File, database, and network side effects cannot be rolled back by copying in-memory objects.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b19-d94-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'AtomicDictionary: Transactional Rollback & Selective Exception Suppression',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates an in-memory dictionary transaction manager that deep-copies state on entry, applies mutations in-place, restores state on failure, and selectively suppresses specified exception types. Note: AtomicTransaction operates strictly on deepcopy-compatible in-memory mutable mapping state; it provides application-state rollback, not database, file system, or network transaction atomicity. External side effects cannot be rolled back by in-memory snapshotting, and copy.deepcopy() cannot copy files, sockets, or thread frames.',
      language: 'python',
      codeSnippet: `import copy

class AtomicDictionaryTransaction:
    """In-memory dictionary transaction supporting snapshot rollback and selective suppression.
    
    Operates strictly on deepcopy-compatible in-memory mutable mapping state.
    Provides application-state rollback, not database/file/network transaction atomicity.
    """
    def __init__(self, target_dict: dict, suppress_exceptions: tuple = ()):
        self.target_dict = target_dict
        self.suppress_exceptions = suppress_exceptions
        self.snapshot = None

    def __enter__(self):
        # Invariant: Capture deepcopy snapshot before any mutation
        self.snapshot = copy.deepcopy(self.target_dict)
        return self.target_dict

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            # Failure occurred: rollback target dictionary completely
            self.target_dict.clear()
            self.target_dict.update(self.snapshot)

            # Invariant: Truth-value selective suppression (explicit True/False recommended)
            if self.suppress_exceptions and isinstance(exc_val, self.suppress_exceptions):
                return True  # Suppress exception
            return False  # Propagate exception
        return False

# 1. Clean commit verification
data = {"balance": 100, "status": "active"}
with AtomicDictionaryTransaction(data) as tx:
    tx["balance"] += 50
assert data["balance"] == 150

# 2. Rollback verification upon exception
try:
    with AtomicDictionaryTransaction(data) as tx:
        tx["balance"] += 1000
        raise ValueError("Invalid transaction debit limit exceeded")
except ValueError:
    pass

assert data["balance"] == 150  # Restored to pre-transaction value
`,
    } as ExampleBlock,
    {
      id: 'blk-b19-d94-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Implementing SelectiveSuppressor Context Manager',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Create class SelectiveSuppressor accepting a variable argument list of exception types.',
        'In __enter__, reset caught_exception to None and return self.',
        'In __exit__, check if exc_type is a subclass of expected_exceptions; if so, store instance and return True.',
        'If exc_type does not match, return False to propagate.',
      ],
      expectedOutcome: 'A verified exception suppressor that cleanly suppresses matching exceptions without swallowing unexpected system errors.',
      starterCode: `class SelectiveSuppressor:
    def __init__(self, *expected_exceptions):
        self.expected_exceptions = expected_exceptions
        self.caught_exception = None

    def __enter__(self):
        # TODO: Initialize and return self
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: Selectively suppress matching exceptions
        pass
`,
      hints: [
        'Use issubclass(exc_type, self.expected_exceptions) when exc_type is not None.',
        'Assign self.caught_exception = exc_val before returning True.',
      ],
      solutionReference: `class SelectiveSuppressor:
    def __init__(self, *expected_exceptions):
        self.expected_exceptions = expected_exceptions
        self.caught_exception = None

    def __enter__(self):
        self.caught_exception = None
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            if issubclass(exc_type, self.expected_exceptions):
                self.caught_exception = exc_val
                return True
            return False
        return False
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b19-d94-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Suppression Return Semantics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What happens if __exit__() ends without an explicit return statement (evaluating to None) when an unhandled KeyError occurred in the with block?',
      options: [
        'The KeyError is automatically re-raised by the Python runtime because None is falsy.',
        'The KeyError is suppressed because no new exception was raised inside __exit__().',
        'Python raises a RuntimeError stating that __exit__ returned None.',
        'The KeyError is converted into a SystemError.',
      ],
      correctIndex: 0,
      explanation: 'In Python, if __exit__ returns None (or any falsy value), Python re-raises the original exception automatically. Only an explicit truthy return value (canonically True) suppresses the exception.',
      misconceptionIdentified: 'Believing that returning nothing (None) suppresses exceptions in context managers.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b19-d94-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Reference: Standard Library contextlib.suppress Specification',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'contextlib.suppress Documentation',
          url: 'https://docs.python.org/3/library/contextlib.html#contextlib.suppress',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 95: BUILD — The Generator Bridge: @contextmanager & Multi-Resource Orchestration ──
export const DAY_95_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w19-019',
  dayNumber: 3,
  title: 'The Generator Bridge: @contextmanager & Multi-Resource Orchestration',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b19-d95-01',
      type: 'THEORY',
      order: 1,
      title: 'Bridging Generators to Context Managers via contextlib & Dynamic ExitStack',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the generator bridge: how contextlib.contextmanager converts single-yield generator functions into fully compliant context managers, how contextlib.ContextDecorator enables dual with-block and decorator usage, learn how exceptions are injected into the generator via .throw(), why our curriculum establishes try...finally as the core resource-cleanup design rule, and how contextlib.ExitStack enables dynamic, variable-length resource management with LIFO unwinding guarantees.',
      whatItIs: 'The @contextmanager decorator wraps a generator function yielding exactly once. The code before the yield executes during __enter__, the yielded value is bound to the as target, and the code after yield executes during __exit__. Exceptions inside the with block are injected at the yield point via generator.throw(). Fundamentally, @contextmanager requires the generator to yield appropriately (exactly once); for resource-owning context managers in this curriculum, use try...finally to guarantee that cleanup executes even if an unhandled exception escapes the with block.',
      whyItExists: 'Writing class-based context managers with boilerplate __init__, __enter__, and __exit__ methods is tedious for simple resource patterns. @contextmanager allows expressing resource lifecycle logic in a single, compact generator using standard try...finally blocks.',
      problemSolved: 'Eliminates class boilerplate for straightforward resource scopes and solves the dynamic multi-resource problem where an unknown number of resources must be acquired and released safely without static comma-separated with statements.',
      mentalModel: 'The Bookend Generator: Imagine an open door. The code before yield walks you through the door. The yield statement pauses while you explore the room. The finally block ensures you exit and close the door, even if a fire started inside the room.',
      realWorldUse: 'Temporary directory creation (`tempfile.TemporaryDirectory`), thread lock acquisition, database connection leasing, and standard output redirection (`contextlib.redirect_stdout`).',
      commonMistakes: [
        'Omitting try...finally around the yield statement in resource-owning context managers: while contextlib.contextmanager does not syntactically require finally, omitting it means that if the with block raises an exception, the code after yield will never run, leaking the resource!',
        'Yielding more than once or zero times: causes RuntimeError: generator didn\'t yield or generator didn\'t stop.',
        'Catching BaseException inside the generator without re-raising or propagating properly, unintentionally intercepting system shutdown signals.',
      ],
      commonMisconceptions: [
        'Misconception: "@contextmanager generates faster code than class-based context managers." Reality: Generator frames have slight overhead compared to simple class dunders; @contextmanager is chosen for clarity and conciseness, not raw CPU throughput.',
        'Misconception: "Comma-separated with statements can manage dynamic lists of files." Reality: with open(f1), open(f2): only works for fixed counts; dynamic lists require an ExitStack.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b19-d95-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building managed_lease with @contextmanager & Dynamic LIFO ExitStack Pattern',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates building a generator-based resource lease manager using @contextmanager and implementing a dynamic multi-resource coordinator adhering to LIFO unwinding semantics.',
      language: 'python',
      codeSnippet: `from contextlib import contextmanager

@contextmanager
def managed_lease(lease_name: str, registry: dict):
    """Generator-based context manager ensuring lease registration and cleanup."""
    if lease_name in registry:
        raise ValueError(f"Lease '{lease_name}' is already active!")
    registry[lease_name] = True
    try:
        yield lease_name
    finally:
        # Invariant: Cleanup executes unconditionally upon exit
        registry.pop(lease_name, None)

class DynamicResourceStack:
    """Dynamic multi-resource stack ensuring strict LIFO unwinding.
    
    Resources exit in reverse order. Each __exit__ receives the current exception state.
    Once suppressed, subsequent outer managers receive (None, None, None).
    A later exception raised during unwinding replaces the prior failure.
    """
    def __init__(self):
        self._stack = []

    def enter_context(self, cm):
        # Invariant: Call __enter__ and push to stack
        val = cm.__enter__()
        self._stack.append(cm)
        return val

    def close(self):
        # Invariant: LIFO reverse unwinding
        errors = []
        while self._stack:
            cm = self._stack.pop()
            try:
                cm.__exit__(None, None, None)
            except Exception as e:
                errors.append(e)
        if errors:
            raise errors[0]

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        # Unwind all resources in reverse order, passing current exception tuple
        suppressed = False
        new_exc = None
        while self._stack:
            cm = self._stack.pop()
            try:
                if cm.__exit__(exc_type, exc_val, exc_tb):
                    suppressed = True
                    exc_type, exc_val, exc_tb = None, None, None
                else:
                    suppressed = False
            except Exception as e:
                new_exc = e
                exc_type, exc_val, exc_tb = type(e), e, e.__traceback__
                suppressed = False
        if new_exc is not None:
            raise new_exc
        return suppressed
`,
    } as ExampleBlock,
    {
      id: 'blk-b19-d95-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Generator-Based Scoped Workspace Manager',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Import contextmanager from contextlib.',
        'Define @contextmanager generator function scoped_workspace(name, active_registry).',
        'Record the workspace entry in active_registry before yielding.',
        'Wrap the yield in a try...finally block ensuring cleanup executes even on failure.',
        'In the finally block, remove the workspace from active_registry and log cleanup.',
      ],
      expectedOutcome: 'A resilient generator-based context manager that guarantees state cleanup even on unhandled exceptions.',
      starterCode: `from contextlib import contextmanager

@contextmanager
def scoped_workspace(name: str, active_registry: dict):
    # TODO: Register workspace in active_registry
    try:
        # TODO: Yield workspace reference
        pass
    finally:
        # TODO: Cleanup workspace from active_registry
        pass
`,
      hints: [
        'Place the setup logic before the yield statement.',
        'The yield statement should be inside a try block.',
        'The cleanup logic in finally executes whether the with block completes normally or raises.',
      ],
      solutionReference: `from contextlib import contextmanager

@contextmanager
def scoped_workspace(name: str, active_registry: dict):
    if name in active_registry:
        raise ValueError(f"Workspace '{name}' already active")
    workspace_data = {"name": name, "files": []}
    active_registry[name] = workspace_data
    try:
        yield workspace_data
    finally:
        active_registry.pop(name, None)
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b19-d95-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Exception Injection in Generators',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'How does @contextmanager propagate an exception raised inside the with block to the generator function?',
      options: [
        'It calls generator.throw(exc_type, exc_val, exc_tb) at the point where the generator is currently suspended on yield.',
        'It sets a flag on the generator and waits for the next yield statement.',
        'It terminates the generator immediately without executing any finally blocks.',
        'It passes the exception as the return value of the yield expression.',
      ],
      correctIndex: 0,
      explanation: 'The @contextmanager wrapper intercepts the exception in __exit__ and injects it directly into the generator frame at the yield point using generator.throw(). This triggers any enclosing try...except or try...finally blocks.',
      misconceptionIdentified: 'Assuming generator context managers receive exceptions via return values rather than active exception injection.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b19-d95-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Reference: Python contextlib Module Architecture',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Documentation: contextlib',
          url: 'https://docs.python.org/3/library/contextlib.html',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 96: DEBUG — Resource Leaks, Re-entrancy Traps & Exception Masquerading Hazards ──
export const DAY_96_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w19-019',
  dayNumber: 4,
  title: 'Resource Leaks, Re-entrancy Traps & Exception Masquerading Hazards',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b19-d96-01',
      type: 'THEORY',
      order: 1,
      title: 'Re-entrancy Corruption, Exception Masquerading & Allocation Leak Hazards',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Diagnose critical production hazards in context manager implementations: the re-entrancy state corruption trap, exception masquerading via indiscriminate truthy returns, resource allocation hazards outside try blocks in generators, and exception masking in cleanup blocks.',
      whatItIs: 'Resource management code must be robust against re-entrance (using the same manager in nested scopes) and partial initialization (errors during setup). A buggy context manager can corrupt state or permanently leak descriptors when used under non-trivial conditions.',
      whyItExists: 'In complex applications, context managers are often composed, nested, or called recursively across functions in the same call stack. Without recursion-depth tracking and precise exception filtering, subtle premature release bugs and descriptor leaks emerge.',
      problemSolved: 'Prevents premature resource deallocation in nested blocks, unintended suppression of syntax/system errors, and zombie resource leaks when acquisition fails mid-way.',
      mentalModel: 'The Russian Nesting Dolls: A re-entrant state machine must know how many layers deep it is. Opening doll #2 does not close doll #1. Only when the outermost doll #1 is closed does the entire set seal.',
      realWorldUse: 'Recursive algorithm resource management, nested database savepoints, and single-threaded call-stack resource tracking (multi-threaded synchronization primitives are taught in Phase 3).',
      commonMistakes: [
        'Writing `return True` without checking `isinstance(exc_val, expected)`: inadvertently swallowing typos, NameError, or MemoryError.',
        'Allocating multiple resources sequentially without a try block: if resource 2 fails, resource 1 is leaked forever.',
        'Storing a single boolean `is_active` on a context manager: when re-entered, the inner exit flips `is_active = False`, destroying the outer scope.',
      ],
      commonMisconceptions: [
        'Misconception: "All context managers can be safely reused across multiple with statements." Reality: Many context managers (like generator-based ones) are strictly single-use; reusing an exhausted generator context raises RuntimeError.',
        'Misconception: "Exceptions in finally blocks are ignored." Reality: An uncaught exception in a finally block replaces the active exception, obliterating the original traceback.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b19-d96-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Debugging Re-entrancy Traps with Depth Counters: Single-Threaded Re-entrant State Machine',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrates diagnosing and correcting re-entrancy bugs by introducing strict recursion-depth accounting in a single-threaded educational resource state machine, avoiding premature resource release across nested calls in the same call stack (multi-threaded synchronization is deferred to Phase 3/Concurrency).',
      language: 'python',
      codeSnippet: `class ResourceManagementError(Exception):
    """Base domain exception for invalid resource-manager state transitions."""
    pass

class ReentrantLock:
    """Single-threaded educational resource acquisition state machine tracking recursion depth."""
    def __init__(self):
        self.depth = 0
        self.is_acquired = False

    def __enter__(self):
        if self.depth == 0:
            # First entry: perform actual underlying acquisition
            self.is_acquired = True
        self.depth += 1
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.depth <= 0:
            raise ResourceManagementError("ReentrantLock released more times than acquired!")
        self.depth -= 1
        if self.depth == 0:
            # Outermost exit: perform actual underlying release
            self.is_acquired = False
        return False

# Verification of Nested Re-entrance
lock = ReentrantLock()
assert not lock.is_acquired

with lock:
    assert lock.is_acquired
    assert lock.depth == 1
    with lock:
        assert lock.is_acquired
        assert lock.depth == 2
    assert lock.is_acquired  # Still acquired in outer block!
    assert lock.depth == 1

assert not lock.is_acquired  # Cleanly released on outer exit
assert lock.depth == 0
`,
    } as ExampleBlock,
    {
      id: 'blk-b19-d96-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge: Remediation of BuggyLeaseManager',
      estimatedMinutes: 40,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_CONTEXT_MANAGERS_AND_RESOURCES,
      problemDescription: 'A distributed lease manager suffers from 3 critical bugs: 1) Over-suppression swallowing KeyboardInterrupt, 2) Allocation outside try block causing socket leak on connection error, and 3) Lack of depth counter causing premature release in nested calls.',
      symptom: 'Service cannot be terminated via Ctrl+C, nested calls release leases prematurely while outer transactions are still running, and connection pool leaks descriptors under network errors.',
      brokenArtifact: `class BuggyLeaseManager:
    # BUG 1: Single boolean without depth counter causes premature nested release
    def __init__(self, resource_id: str):
        self.resource_id = resource_id
        self.active = False

    def __enter__(self):
        self.active = True
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.active = False
        # BUG 2: Indiscriminate return True swallows all exceptions!
        return True
`,
      fixedArtifact: `class RobustLeaseManager:
    def __init__(self, resource_id: str, suppress_exceptions: tuple = ()):
        self.resource_id = resource_id
        self.suppress_exceptions = suppress_exceptions
        self.depth = 0
        self.active = False

    def __enter__(self):
        if self.depth == 0:
            self.active = True
        self.depth += 1
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.depth <= 0:
            raise RuntimeError("Lease released more times than acquired!")
        self.depth -= 1
        if self.depth == 0:
            self.active = False
        if exc_type is not None and self.suppress_exceptions:
            if issubclass(exc_type, self.suppress_exceptions):
                return True
        return False
`,
      remediationSteps: [
        'Add depth integer counter initialized to 0.',
        'Increment depth in __enter__, setting active = True only on transition from 0 to 1.',
        'Decrement depth in __exit__, setting active = False only when depth reaches 0.',
        'Filter exc_type strictly against suppress_exceptions before returning True.',
      ],
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b19-d96-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Garbage Collection vs Explicit Lifecycle Protocols',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why high-throughput backend services and cloud systems mandate deterministic context managers instead of relying on garbage collection finalizers (__del__). How does deterministic teardown protect against resource exhaustion in microservices?',
    } as ReflectionBlock,
  ],
};

// ── DAY 97: TRANSFER — Formative Assessment: Operational Transactional Resource Engine ──
export const DAY_97_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m5-w19-019',
  assessmentCode: 'ASM-PFS-M5-W19-019',
  title: 'Formative Assessment: Production-Grade Resilient Transactional Resource Engine',
  description: 'Synthesize class-based and generator-based context management protocols to deliver an enterprise-grade transactional resource suite capable of managing nested transactions, selective suppression, re-entrancy, and atomic multi-resource acquisition failure rollbacks.',
  type: 'CODE',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  difficulty: 'ADVANCED',
  timeLimitMinutes: 95,
  passingScore: 80,
  maxAttempts: 3,
  attemptPolicy: 'LIMITED_BEST',
  targetCompetencyId: COMPETENCY_ID_CONTEXT_MANAGERS_AND_RESOURCES,
  batchId: 'batch-pfs-m5-w19-019',
  createdAt: '2026-09-07T00:00:00.000Z',
  updatedAt: '2026-09-07T00:00:00.000Z',
  items: [
    {
      id: 'item-b19-01',
      assessmentId: 'asm-pfs-m5-w19-019',
      itemType: 'CODE',
      points: 100,
      order: 1,
      timeEstimateMinutes: 95,
      title: 'Synthesizing Resilient Transactional Resource Engine',
      prompt: 'Implement four production-grade resource and transaction management components: 1) AtomicTransaction operating on deepcopy-compatible in-memory mutable mapping state with snapshot rollback and truth-value selective exception suppression (recommending explicit True/False); 2) managed_resource generator context manager with recommended try...finally cleanup; 3) ReentrantLockManager educational single-threaded resource acquisition state machine with recursion depth tracking; 4) MultiResourceCoordinator with dynamic LIFO acquisition failure recovery and chained exception unwinding semantics.',
      starterCode: `import copy
from contextlib import contextmanager

class ResourceManagementError(Exception):
    """Base domain exception for resource management failures."""
    pass

class TransactionRollbackError(ResourceManagementError):
    """Raised when a transaction aborts and rolls back state."""
    pass

class AtomicTransaction:
    """Class-based context manager managing isolated mutable mapping state.
    
    Operates strictly on deepcopy-compatible in-memory mutable mapping state (e.g. dict).
    Provides bounded application-state rollback, not database/file/network transaction atomicity.
    - Captures deepcopy snapshot on __enter__.
    - Commits on clean exit.
    - Restores target to snapshot on error.
    - Selectively suppresses only exceptions matching suppress_exceptions (recommending True/False).
    """
    def __init__(self, target_dict: dict, suppress_exceptions: tuple = ()):
        self.target_dict = target_dict
        self.suppress_exceptions = suppress_exceptions
        self.snapshot = None

    def __enter__(self):
        # TODO: Implement snapshot capture
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: Implement rollback and selective suppression
        pass

@contextmanager
def managed_resource(acquire_fn, release_fn):
    """Generator-based context manager using @contextmanager with recommended try...finally."""
    # TODO: Implement managed resource lifecycle
    pass

class ReentrantLockManager:
    """Single-threaded educational resource acquisition state machine.
    
    Tracks recursion depth in a single-threaded call stack, acquiring the underlying
    resource on 0->1 transition and releasing strictly on 1->0 transition.
    """
    def __init__(self):
        self.depth = 0
        self.is_acquired = False

    def __enter__(self):
        # TODO: Implement depth-tracked acquire
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: Implement depth-tracked release
        pass

class MultiResourceCoordinator:
    """Dynamic multi-resource coordinator entering an arbitrary sequence of context managers.
    - Enters managers sequentially in declaration order.
    - If manager k fails to enter, all managers k-1 ... 0 are closed in reverse LIFO order.
    - Unwinds in reverse order (LIFO) upon exit, passing current exception state to each __exit__.
    - Once suppressed, subsequent outer managers receive (None, None, None).
    - A later exception raised during unwinding replaces prior failures.
    """
    def __init__(self, *managers):
        self.managers = managers
        self._entered = []

    def __enter__(self):
        # TODO: Implement sequential acquisition with fault-isolated LIFO cleanup
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: Implement LIFO unwinding
        pass
`,
      solutionCode: `import copy
from contextlib import contextmanager

class ResourceManagementError(Exception):
    pass

class TransactionRollbackError(ResourceManagementError):
    pass

class AtomicTransaction:
    """Class-based context manager managing isolated mutable mapping state.
    
    Operates strictly on deepcopy-compatible in-memory mutable mapping state.
    Provides application-state rollback, not database/file/network transaction atomicity.
    """
    def __init__(self, target_dict: dict, suppress_exceptions: tuple = ()):
        self.target_dict = target_dict
        self.suppress_exceptions = suppress_exceptions
        self.snapshot = None

    def __enter__(self):
        self.snapshot = copy.deepcopy(self.target_dict)
        return self.target_dict

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            self.target_dict.clear()
            self.target_dict.update(self.snapshot)
            if self.suppress_exceptions and isinstance(exc_val, self.suppress_exceptions):
                return True
            return False
        return False

@contextmanager
def managed_resource(acquire_fn, release_fn):
    res = acquire_fn()
    try:
        yield res
    finally:
        release_fn(res)

class ReentrantLockManager:
    """Single-threaded educational resource acquisition state machine tracking recursion depth."""
    def __init__(self):
        self.depth = 0
        self.is_acquired = False

    def __enter__(self):
        if self.depth == 0:
            self.is_acquired = True
        self.depth += 1
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.depth <= 0:
            raise ResourceManagementError("ReentrantLockManager released more times than acquired!")
        self.depth -= 1
        if self.depth == 0:
            self.is_acquired = False
        return False

class MultiResourceCoordinator:
    """Dynamic multi-resource coordinator ensuring strict LIFO unwinding.
    
    Resources exit in reverse order. Each __exit__ receives the current exception state.
    Once suppressed, subsequent outer managers receive (None, None, None).
    A later exception raised during unwinding replaces prior failures.
    """
    def __init__(self, *managers):
        self.managers = managers
        self._entered = []

    def __enter__(self):
        self._entered = []
        try:
            results = []
            for mgr in self.managers:
                res = mgr.__enter__()
                self._entered.append(mgr)
                results.append(res)
            return results
        except Exception as e:
            while self._entered:
                acquired = self._entered.pop()
                try:
                    acquired.__exit__(type(e), e, e.__traceback__)
                except Exception:
                    pass
            raise

    def __exit__(self, exc_type, exc_val, exc_tb):
        suppressed = False
        new_exc = None
        while self._entered:
            mgr = self._entered.pop()
            try:
                if mgr.__exit__(exc_type, exc_val, exc_tb):
                    suppressed = True
                    exc_type, exc_val, exc_tb = None, None, None
                else:
                    suppressed = False
            except Exception as e:
                new_exc = e
                exc_type, exc_val, exc_tb = type(e), e, e.__traceback__
                suppressed = False
        if new_exc is not None:
            raise new_exc
        return suppressed
`,
      rubricDimensions: [
        {
          id: 'dim-b19-01',
          name: 'Atomic State Management & Selective Rollback',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
          description: 'Validates AtomicTransaction operates on deepcopy-compatible in-memory mutable mapping state, creates an isolated snapshot on entry, commits mutations on clean exit, rolls back state on exception, and selectively suppresses only exceptions matching suppress_exceptions (recommending explicit True/False).',
          criteria: 'Validates AtomicTransaction operates on deepcopy-compatible in-memory mutable mapping state, creates an isolated snapshot on entry, commits mutations on clean exit, rolls back state on exception, and selectively suppresses only exceptions matching suppress_exceptions (recommending explicit True/False). MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
        },
        {
          id: 'dim-b19-02',
          name: 'Protocol Precision & Dunder Contracts',
          weight: 0.15,
          maxPoints: 15,
          description: 'Validates __enter__ and __exit__ dunder signatures, return value binding to as target, and strict 4-argument __exit__ handling.',
          criteria: 'Validates __enter__ and __exit__ dunder signatures, return value binding to as target, and strict 4-argument __exit__ handling.',
        },
        {
          id: 'dim-b19-03',
          name: 'Generator Context Manager Bridge & Exception Injection',
          weight: 0.15,
          maxPoints: 15,
          description: 'Validates managed_resource generator context manager with @contextlib.contextmanager, ensuring setup runs pre-yield, cleanup runs post-yield in finally, and exceptions are cleanly injected via .throw().',
          criteria: 'Validates managed_resource generator context manager with @contextlib.contextmanager, ensuring setup runs pre-yield, cleanup runs post-yield in finally, and exceptions are cleanly injected via .throw().',
        },
        {
          id: 'dim-b19-04',
          name: 'Re-entrancy Semantics & Depth Accounting',
          weight: 0.10,
          maxPoints: 10,
          description: 'Validates ReentrantLockManager educational state machine accurately tracks recursion depth in a single-threaded call stack, acquiring underlying resource on 0->1 transition and releasing strictly on 1->0 transition.',
          criteria: 'Validates ReentrantLockManager educational state machine accurately tracks recursion depth in a single-threaded call stack, acquiring underlying resource on 0->1 transition and releasing strictly on 1->0 transition.',
        },
        {
          id: 'dim-b19-05',
          name: 'Dynamic Multi-Resource LIFO Unwinding & Fault Isolation',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
          description: 'Validates MultiResourceCoordinator dynamically enters an arbitrary sequence of context managers, unwinds all acquired resources in strict LIFO order on exit passing current exception state, correctly passes (None, None, None) once suppressed, replaces prior failures on subsequent exceptions, and safely closes already-acquired resources if an intermediate acquisition fails.',
          criteria: 'Validates MultiResourceCoordinator dynamically enters an arbitrary sequence of context managers, unwinds all acquired resources in strict LIFO order on exit passing current exception state, correctly passes (None, None, None) once suppressed, replaces prior failures on subsequent exceptions, and safely closes already-acquired resources if an intermediate acquisition fails. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
        },
        {
          id: 'dim-b19-06',
          name: 'Exception Masquerading Defense & Native Exception Fidelity',
          weight: 0.05,
          maxPoints: 5,
          description: 'Validates that unsuppressed exceptions and critical system exceptions (KeyboardInterrupt, SystemExit) are never inadvertently swallowed, and native exceptions propagate authentically.',
          criteria: 'Validates that unsuppressed exceptions and critical system exceptions (KeyboardInterrupt, SystemExit) are never inadvertently swallowed, and native exceptions propagate authentically.',
        },
        {
          id: 'dim-b19-07',
          name: 'Resource Cleanliness & Leak Prevention Verification',
          weight: 0.05,
          maxPoints: 5,
          description: 'Validates zero resource descriptor leaks across error paths and repeated lifecycle cycles.',
          criteria: 'Validates zero resource descriptor leaks across error paths and repeated lifecycle cycles.',
        },
      ],
      visibleTests: [
        {
          name: 'test_atomic_transaction_clean_commit',
          assertion: 'd = {"a": 1}; with AtomicTransaction(d) as tx: tx["a"] = 2; tx["b"] = 3; assert d == {"a": 2, "b": 3}',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_atomic_transaction_rollback_on_error',
          assertion: 'd = {"balance": 100}; try: with AtomicTransaction(d) as tx: tx["balance"] = 999; raise ValueError("aborted"); except ValueError: pass; assert d == {"balance": 100}',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_managed_resource_clean_lifecycle',
          assertion: 'log = []; with managed_resource(lambda: "R1", lambda r: log.append(f"cleaned:{r}")) as r: log.append(f"used:{r}"); assert log == ["used:R1", "cleaned:R1"]',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_reentrant_lock_nested_acquisition',
          assertion: 'l = ReentrantLockManager(); with l: assert l.depth == 1; with l: assert l.depth == 2; assert l.is_acquired; assert l.depth == 1; assert not l.is_acquired; assert l.depth == 0',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_multi_resource_coordinator_lifo_order',
          assertion: 'log = []; c1 = DummyCM("1", log); c2 = DummyCM("2", log); with MultiResourceCoordinator(c1, c2): pass; assert log == ["enter:1", "enter:2", "exit:2", "exit:1"]',
          points: 10,
          tier: 'VISIBLE',
        },
      ],
      adversarialTests: [
        {
          name: 'test_atomic_transaction_selective_suppression',
          assertion: 'd = {"val": 10}; with AtomicTransaction(d, suppress_exceptions=(KeyError,)) as tx: tx["val"] = 20; raise KeyError("missing"); assert d == {"val": 10}',
          points: 10,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_atomic_transaction_unsuppressed_propagates',
          assertion: 'd = {"val": 10}; try: with AtomicTransaction(d, suppress_exceptions=(KeyError,)) as tx: tx["val"] = 20; raise TypeError("wrong type"); except TypeError: pass; assert d == {"val": 10}',
          points: 10,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_multi_resource_coordinator_acquisition_failure_cleanup',
          assertion: 'log = []; c1 = DummyCM("1", log); c2 = FailingCM("2", log); try: with MultiResourceCoordinator(c1, c2): pass; except RuntimeError: pass; assert log == ["enter:1", "enter:2:failed", "exit:1"]',
          points: 10,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_managed_resource_exception_in_body_calls_cleanup',
          assertion: 'log = []; try: with managed_resource(lambda: "R2", lambda r: log.append("cleaned")): raise RuntimeError("boom"); except RuntimeError: pass; assert log == ["cleaned"]',
          points: 10,
          tier: 'ADVERSARIAL',
        },
      ],
      integrityTests: [
        {
          name: 'test_atomic_transaction_nested_deepcopy_isolation',
          assertion: 'd = {"nested": [1, 2]}; try: with AtomicTransaction(d) as tx: tx["nested"].append(3); raise ValueError(); except ValueError: pass; assert d == {"nested": [1, 2]}',
          points: 5,
          tier: 'INTEGRITY',
        },
        {
          name: 'test_reentrant_lock_underflow_safety',
          assertion: 'l = ReentrantLockManager(); raised = False; try: l.__exit__(None, None, None); except ResourceManagementError: raised = True; assert raised',
          points: 5,
          tier: 'INTEGRITY',
        },
      ],
    },
  ],
};

export const DAY_97_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w19-019',
  dayNumber: 5,
  title: 'Formative Assessment: Production-Grade Resilient Transactional Resource Engine',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b19-d97-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Production-Grade Transactional Resource Suite',
      estimatedMinutes: 80,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_CONTEXT_MANAGERS_AND_RESOURCES,
      unfamiliarDomainContext: 'In-Memory State Coordinators & Ephemeral Multi-Device Leases',
      task: 'Synthesize four core resource management components: AtomicTransaction with in-memory mapping snapshot rollback, managed_resource generator context manager, ReentrantLockManager educational state machine with depth tracking, and MultiResourceCoordinator with LIFO unwinding.',
    } as TransferChallengeBlock,
    {
      id: 'blk-b19-d97-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Knowledge Check: Context Management Architectural Synthesis',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why must a multi-resource coordinator unwind already-acquired resources in LIFO order if an intermediate resource raises during its __enter__() call?',
      options: [
        'To prevent partial resource leakage and respect dependency order (resources acquired later may depend on resources acquired earlier).',
        'Because Python bytecode mandates reverse iteration for all lists.',
        'Because FIFO cleanup causes Python to raise an uncatchable SystemError.',
        'LIFO cleanup is purely cosmetic and has no impact on system stability.',
      ],
      correctIndex: 0,
      explanation: 'Resources acquired sequentially frequently depend on previous resources (e.g. a database cursor depends on an open database connection). Unwinding in strict LIFO order ensures dependents are closed before their dependencies, avoiding segmentation faults, lock deadlocks, or socket corruption.',
      misconceptionIdentified: 'Assuming resource acquisition failure cleanups can occur in arbitrary or FIFO order.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b19-d97-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Batch 019 Reference Sheet: Python Context Management Protocols & Invariants',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Documentation: The Context Management Protocol',
          url: 'https://docs.python.org/3/reference/datamodel.html#context-managers',
        },
        {
          title: 'Python Official Documentation: contextlib Utilities',
          url: 'https://docs.python.org/3/library/contextlib.html',
        },
      ],
      documentationExtracts: [
        'Python 3.14 Documentation: An object supporting the context management protocol must implement __enter__() returning a runtime target and __exit__(exc_type, exc_val, exc_tb).',
        'Returning True from __exit__ suppresses the exception and execution resumes immediately after the with statement.',
        'If __enter__ raises an exception, the body is not entered and __exit__ is not called on that manager.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 019 MANIFEST ──
export const BATCH_019_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m5-w19-019',
  batchCode: 'P2-M5-W19-BATCH019',
  title: 'Python Context Managers, Resource Lifecycle Protocols, Dunder Engineering & Defensive Transaction Architecture',
  difficulty: 'ADVANCED',
  days: [
    DAY_93_MANIFEST,
    DAY_94_MANIFEST,
    DAY_95_MANIFEST,
    DAY_96_MANIFEST,
    DAY_97_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-07T00:00:00.000Z',
  updatedAt: '2026-09-07T00:00:00.000Z',
};
