// src/lib/curriculum/pythonFullStack/batch020.ts
// Single Source of Truth for PINIT BATCH 020: Month 5 · Week 20 · Days 98–102
// Advanced Python: Type Architecture, Structural Subtyping (Protocols / PEP 544), Generics, Variance & Static Consistency with Mypy
// Pedagogical Flow: UNDERSTAND (Type Invariants & Modern Annotations) -> APPLY (Protocols & Structural Subtyping) -> BUILD (Generics, Variance & ParamSpec) -> DEBUG (Type Traps, Narrowing & Cast Hazards) -> TRANSFER (Strongly Typed Streaming Pipeline Engine Capstone)

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

export const COMPETENCY_ID_TYPE_SYSTEM_AND_PROTOCOLS = 'comp-pfs-m5-020';

// ── CANONICAL DOMAIN EXCEPTIONS FOR TYPED PIPELINE ARCHITECTURE ──
// Used across instruction, labs, challenges, and assessment contracts:
// 1. PipelineError: Base domain exception for data processing pipeline failures.
// 2. StageExecutionError: Raised when a pipeline stage fails to process an input item.
// 3. SchemaValidationError: Raised when data fails type-level or structural invariants.

// ── DAY 98: UNDERSTAND — Type System Invariants, Static Consistency & Modern Python Annotations ──
export const DAY_98_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w20-020',
  dayNumber: 1,
  title: 'Type System Invariants, Static Consistency & Modern Python Annotations',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b20-d98-01',
      type: 'THEORY',
      order: 1,
      title: 'Static Type Invariants vs Runtime Execution & Python 3.14 Annotation Mechanics',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the fundamental divide between static type checking and CPython runtime reality. Learn how Python evaluates annotations lazily by default in Python 3.14 (PEP 649 / PEP 749), how annotationlib inspects them, the critical security hazards of evaluating untrusted annotations, and why mypy clean does not equal a bug-free runtime.',
      whatItIs: 'Python is fundamentally a dynamically typed language. CPython does not enforce annotation types during ordinary runtime execution. Type annotations (PEP 484) are metadata used by static type checkers (such as mypy) to perform static consistency checking against declared and inferred types before execution.\n\nIn Python 3.14 (PEP 649 / PEP 749), annotations are lazily evaluated by default. Rather than eager evaluation at module load time (which caused circular import crashes) or storing annotations as raw unparsed strings via "from __future__ import annotations" (PEP 563, now a legacy compatibility tool scheduled for future deprecation), Python 3.14 stores an internal __annotate__ function on annotated objects.\n\nThe modern standard library module "annotationlib" provides the authoritative introspection API via annotationlib.get_annotations(obj, format=Format.VALUE), supporting Format.VALUE (evaluated types), Format.FORWARDREF (proxy objects), and Format.STRING (source-like string representations).',
      whyItExists: 'Allows large software engineering codebases to catch type inconsistencies, signature mismatches, attribute errors, and None-pointer bugs statically in CI, while preserving Python dynamic expressiveness and avoiding runtime type-checking CPU overhead.',
      problemSolved: 'Eliminates entire categories of silent runtime AttributeError and TypeError defects at build time, while modern Python 3.14 lazy evaluation solves the circular import and eager forward-reference initialization dilemmas.',
      mentalModel: 'The Architectural Blueprints vs Building Physics: Type annotations and static checkers are the architectural blueprint review (checking that every beam and load calculation matches). CPython runtime execution is the actual physical construction. The blueprint checker reports static inconsistencies according to its rules, but having a clean blueprint does not guarantee the building will never leak if a worker introduces bad runtime materials or bypasses checks.',
      realWorldUse: 'Enterprise backend services, API contract enforcement, library interface typing, IDE auto-completion engines, and automated static verification pipelines.',
      commonMistakes: [
        'Believing CPython enforces type annotations at runtime: passing a string to def add(x: int, y: int) -> int does NOT raise a TypeError at runtime; static analysis is completely decoupled from execution.',
        'Equating "mypy clean" with guaranteed program correctness: static type checkers verify consistency against declared types, but dynamic input, casts, and # type: ignore can bypass checks.',
        'Assuming "from __future__ import annotations" is the modern Python 3.14 architecture: in Python 3.14, lazy evaluation and annotationlib supersede PEP 563.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b20-d98-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Python 3.14 Annotation Introspection & The Untrusted Code Security Invariant',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrate modern annotation introspection with annotationlib, contrast Any vs object, and establish the critical security invariant governing annotation evaluation.',
      code: `import sys
from typing import Any

def calculate_metric(factor: float, tags: list[str]) -> dict[str, float]:
    return {tag: factor * 1.5 for tag in tags}

# ── 1. Modern Python 3.14 Introspection (Standard Library annotationlib) ──
if sys.version_info >= (3, 14):
    import annotationlib
    
    # Modern lazy introspection using format=Format.VALUE:
    hints = annotationlib.get_annotations(calculate_metric, format=annotationlib.Format.VALUE)
    print("Evaluated Hints:", hints)
    # Output: {'factor': <class 'float'>, 'tags': list[str], 'return': dict[str, float]}
    
    # Introspection using format=Format.STRING:
    str_hints = annotationlib.get_annotations(calculate_metric, format=annotationlib.Format.STRING)
    print("String Hints:", str_hints)

# ── 2. CRITICAL SECURITY INVARIANT: Untrusted Code & Arbitrary Execution ──
# WARNING: In Python 3.14, Format.VALUE, Format.FORWARDREF, and Format.STRING
# must only be used with trusted annotation definitions.
# The official documentation explicitly warns that annotation introspection
# can execute arbitrary code during expression evaluation.
# NEVER pass untrusted student/user code or unvalidated strings to annotation APIs!

# ── 3. Any vs object: The Gradual Typing Divide ──
def process_any(data: Any) -> None:
    # ANY disables type checking. Mypy permits arbitrary attribute access!
    # Silent runtime crash if 'invalid_method' doesn't exist:
    # data.invalid_method()  # Passes mypy, crashes at runtime!
    pass

def process_object(data: object) -> None:
    # OBJECT enables type checking. Only base object methods allowed.
    # mypy rejects: data.invalid_method()  -> [attr-defined] error!
    # Must use type narrowing before accessing specific methods:
    if isinstance(data, str):
        print(data.upper())  # Type narrowed to str; valid!
`,
      expectedOutput: "Evaluated Hints: {'factor': <class 'float'>, 'tags': list[str], 'return': dict[str, float]}",
      annotatedWalkthrough: [
        { line: 9, annotation: 'Inspects Python 3.14 runtime version before importing annotationlib.' },
        { line: 13, annotation: 'Format.VALUE lazily evaluates the annotation types into concrete type objects.' },
        { line: 20, annotation: 'Explicitly documents the security hazard: untrusted code can trigger arbitrary execution in annotationlib.' },
        { line: 26, annotation: 'Demonstrates why Any is a dangerous escape hatch that silences static checking.' },
        { line: 31, annotation: 'Demonstrates why object is type-safe: requires runtime type narrowing via isinstance.' },
      ],
    } as ExampleBlock,
    {
      id: 'blk-b20-d98-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Strict Type Annotations, Union Algebra & Mypy Configuration',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instruction: 'Annotate a complex configuration dictionary parsing function using modern PEP 604 union types (T | None), generic collections (list[T], dict[K, V]), and fixed vs variadic tuples.',
      starterCode: `# Practice: Annotate parse_telemetry_batch
# Requirements:
# 1. Takes 'records': a list of dictionaries mapping string keys to int, float, or str values.
# 2. Takes 'batch_id': an int or None (default None).
# 3. Returns a tuple of exactly two elements: (int count_processed, list of string error messages).

def parse_telemetry_batch(records, batch_id=None):
    errors = []
    processed = 0
    for record in records:
        if not isinstance(record, dict):
            errors.append("Invalid record format")
            continue
        processed += 1
    return processed, errors
`,
      solutionCode: `from typing import Union

def parse_telemetry_batch(
    records: list[dict[str, int | float | str]],
    batch_id: int | None = None,
) -> tuple[int, list[str]]:
    errors: list[str] = []
    processed: int = 0
    for record in records:
        if not isinstance(record, dict):
            errors.append("Invalid record format")
            continue
        processed += 1
    return processed, errors
`,
      validationCriteria: [
        'Uses list[dict[str, int | float | str]] for records parameter.',
        'Uses int | None = None for optional batch_id parameter.',
        'Specifies precise return type tuple[int, list[str]].',
      ],
      hints: [
        'Use PEP 604 pipe syntax "int | float | str" for the dictionary values.',
        'Fixed-length tuples specify types for each element: tuple[int, list[str]]. Variadic tuples use tuple[T, ...].',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b20-d98-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Static Consistency vs Runtime Reality',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does passing a static type check (e.g. running "mypy --strict" with 0 errors) not guarantee that a Python program will run without errors?',
      options: [
        'Because static type checkers check consistency against declared types, but cannot guard against unhandled dynamic input, unsafe typing.cast() assertions, # type: ignore overrides, or external I/O failures.',
        'Because Python automatically strips all type annotations and replaces them with random runtime values.',
        'Because mypy only analyzes the first 50 lines of each Python file.',
        'Because type annotations only apply to compiled C extensions, not standard Python code.',
      ],
      correctIndex: 0,
      explanation: 'Static consistency checking verifies that declarations adhere to type system rules. However, runtime dynamic inputs (JSON payloads, user inputs, database records), explicit cast() escapes, and suppression comments (# type: ignore) bypass static verification. "mypy clean" is a prerequisite for code quality, not a formal mathematical proof of total correctness.',
      misconceptionIdentified: 'Believing that static type checking provides mathematical runtime bug immunity.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b20-d98-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Reflection: Annotation Introspection Security in Production',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on Python 3.14 annotation introspection security: why is it dangerous for a multi-tenant platform (like an online code judge or educational platform) to call annotationlib.get_annotations() on untrusted user-submitted class definitions?',
    } as ReflectionBlock,
  ],
};

// ── DAY 99: APPLY — Structural Subtyping & Protocols (PEP 544) vs Nominal Inheritance ──
export const DAY_99_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w20-020',
  dayNumber: 2,
  title: 'Structural Subtyping & Protocols (PEP 544) vs Nominal Inheritance',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b20-d99-01',
      type: 'THEORY',
      order: 1,
      title: 'Structural Subtyping (PEP 544) vs Nominal Inheritance & @runtime_checkable Boundaries',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master typing.Protocol for static duck typing. Contrast nominal subtyping with structural subtyping, compose interfaces via multiple inheritance, and understand the precise limitations of @runtime_checkable.',
      whatItIs: 'Nominal subtyping requires explicit class inheritance (class Dog(Animal): ...). Callers must couple their implementations to a specific class hierarchy root. In contrast, structural subtyping (PEP 544, typing.Protocol) provides static duck typing: a class is considered a subtype of a Protocol if it implements all attributes and methods defined by the Protocol with compatible signatures, without explicitly inheriting from it.\n\nThe @runtime_checkable decorator enables isinstance(obj, Protocol) checks at runtime. However, learners must understand its strict boundary: @runtime_checkable only verifies that the required attribute and method names exist on the object; it CANNOT verify argument types, parameter counts, or return types at runtime!',
      whyItExists: 'Decouples library and application components. Callers can define the exact capabilities they need (e.g. Reader, Writer, Closable) without forcing external third-party classes or dependencies to import and inherit from internal base classes.',
      problemSolved: 'Eliminates rigid nominal inheritance hierarchies, prevents circular dependency imports between interfaces and implementations, and enables static verification of existing standard library and third-party types.',
      mentalModel: 'The Electrical Wall Plug vs The Brand Passport: Nominal typing requires a passport proving you were born in a specific family (inheriting from BaseClass). Structural typing (Protocols) requires only that your plug has the right physical shape (prongs match voltage and ground); any device conforming to the shape works safely regardless of who manufactured it.',
      realWorldUse: 'Standard library protocols (Iterable, Iterator, Mapping, ContextManager), repository pattern decoupling, plugin architecture interfaces, and test double mock injection.',
      commonMistakes: [
        'Believing @runtime_checkable validates method signatures: isinstance(obj, Reader) only checks that hasattr(obj, "read"); it does not check if read() accepts correct parameters or returns the expected type.',
        'Unnecessarily inheriting from a Protocol when implementing it: explicit inheritance is completely optional in structural subtyping.',
        'Using Protocol when concrete code reuse is needed: Protocols define interface shape; concrete base classes or mixins provide reusable method logic.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b20-d99-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Defining, Composing and Runtime-Checking Custom Protocols',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Implement decoupled protocols for LogEmitter, Closable, and a composed StorageResource protocol with @runtime_checkable inspection.',
      code: `from typing import Protocol, runtime_checkable, Any

@runtime_checkable
class Closable(Protocol):
    """Protocol for resources requiring explicit termination."""
    def close(self) -> None:
        ...

@runtime_checkable
class Serializable(Protocol):
    """Protocol for objects capable of dictionary export."""
    def to_dict(self) -> dict[str, Any]:
        ...

# Protocol composition via multiple inheritance
class StorageResource(Closable, Serializable, Protocol):
    """Composite protocol requiring both close() and to_dict()."""
    ...

# Unrelated class implementing the required methods WITHOUT inheriting from StorageResource:
class DatabaseSink:
    def __init__(self, endpoint: str) -> None:
        self.endpoint = endpoint
        self._open = True

    def close(self) -> None:
        self._open = False

    def to_dict(self) -> dict[str, Any]:
        return {"endpoint": self.endpoint, "status": "open" if self._open else "closed"}

# Verification:
sink = DatabaseSink("db://replica-01")

# 1. Static Type Checking: mypy accepts 'sink' wherever StorageResource is expected!
def persist_metadata(resource: StorageResource) -> None:
    data = resource.to_dict()
    resource.close()
    print("Persisted:", data)

persist_metadata(sink)

# 2. Runtime checkable verification:
print("isinstance Closable:", isinstance(sink, Closable))        # True
print("isinstance Serializable:", isinstance(sink, Serializable)) # True
print("isinstance StorageResource:", isinstance(sink, StorageResource)) # True
`,
      expectedOutput: "Persisted: {'endpoint': 'db://replica-01', 'status': 'open'}\nisinstance Closable: True\nisinstance Serializable: True\nisinstance StorageResource: True",
      annotatedWalkthrough: [
        { line: 3, annotation: 'Defines @runtime_checkable Closable protocol with close() method.' },
        { line: 15, annotation: 'Composes StorageResource by inheriting from both Closable and Serializable.' },
        { line: 20, annotation: 'DatabaseSink implements the methods without inheriting from StorageResource.' },
        { line: 34, annotation: 'Function accepts StorageResource; mypy statically validates DatabaseSink compatibility.' },
      ],
    } as ExampleBlock,
    {
      id: 'blk-b20-d99-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Decoupling a Payment Engine with Structural Protocols',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instruction: 'Define a PaymentGateway protocol requiring authorize(amount_cents: int) -> str and refund(transaction_id: str) -> bool. Implement a StripeGateway and MockGateway conforming structurally.',
      starterCode: `from typing import Protocol, runtime_checkable

# Practice:
# 1. Define @runtime_checkable PaymentGateway protocol
# 2. Implement MockPaymentGateway with in-memory transaction tracking

class PaymentGateway(Protocol):
    pass
`,
      solutionCode: `from typing import Protocol, runtime_checkable

@runtime_checkable
class PaymentGateway(Protocol):
    def authorize(self, amount_cents: int) -> str:
        ...

    def refund(self, transaction_id: str) -> bool:
        ...

class MockPaymentGateway:
    def __init__(self) -> None:
        self.transactions: set[str] = set()

    def authorize(self, amount_cents: int) -> str:
        tx_id = f"tx_mock_{amount_cents}"
        self.transactions.add(tx_id)
        return tx_id

    def refund(self, transaction_id: str) -> bool:
        if transaction_id in self.transactions:
            self.transactions.remove(transaction_id)
            return True
        return False
`,
      validationCriteria: [
        'Defines PaymentGateway with authorize and refund methods.',
        'Decorates protocol with @runtime_checkable.',
        'MockPaymentGateway conforms to protocol without explicit inheritance.',
      ],
      hints: [
        'Use ellipsis (...) as the body of protocol method declarations.',
        'Ensure the method signatures match exactly in the implementing class.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b20-d99-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: @runtime_checkable Limitations',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'If class BrokenGateway defines def authorize(self, x: str, y: str) -> int: ..., why does isinstance(BrokenGateway(), PaymentGateway) evaluate to True at runtime?',
      options: [
        'Because @runtime_checkable only checks that an attribute named "authorize" exists on the object; it does not inspect parameter count, argument types, or return types at runtime.',
        'Because Python runtime bytecode compiler automatically converts all types to integers.',
        'Because all classes in Python inherit from PaymentGateway by default.',
        'Because isinstance() is overridden to always return True for protocols.',
      ],
      correctIndex: 0,
      explanation: 'Python runtime inspection of protocols is lightweight: @runtime_checkable uses hasattr() under the hood to confirm method existence. Full signature and type compatibility checking is the exclusive responsibility of static type checkers (mypy/pyright) during static analysis.',
      misconceptionIdentified: 'Assuming @runtime_checkable performs full runtime method signature validation.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b20-d99-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Reflection: Protocols vs Nominal Base Classes',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on architectural boundaries: when is it superior to use typing.Protocol (structural subtyping) instead of nominal base classes, and in what scenarios is nominal inheritance still preferable?',
    } as ReflectionBlock,
  ],
};

// ── DAY 100: BUILD — Generic Programming, Variance Physics & ParamSpec Decorator Typing ──
export const DAY_100_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w20-020',
  dayNumber: 3,
  title: 'Generic Programming, Variance Physics & ParamSpec Decorator Typing',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b20-d100-01',
      type: 'THEORY',
      order: 1,
      title: 'The Physics of Variance: Invariance, Covariance, Contravariance & ParamSpec',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand generic class construction, why read-write generic containers (list[T]) must be invariant, covariance for producers, contravariance for consumers, PEP 695 inferred variance, and ParamSpec decorator signature preservation.',
      whatItIs: 'Generic programming allows classes and functions to operate on type parameters (TypeVar). Variance describes how the subtyping relationship of complex generic types relates to the subtyping of their type arguments:\n\n1. Invariance (default): A read-write generic container such as list[T] is invariant because accepting both reads and writes makes covariance unsound. If list[Dog] were accepted where list[Animal] is expected, a function could append a Cat into the list[Dog], violating the type-level container-state invariant!\n2. Covariance (covariant=True): Safe for read-only producer interfaces. If code only reads Animal from a Sequence, receiving a Sequence[Dog] is completely safe.\n3. Contravariance (contravariant=True): Safe for write-only consumer interfaces. If code accepts a handler that processes any Animal, passing it to code that feeds Dog is completely safe.\n\nIn modern Python 3.12+ PEP 695 syntax (class Container[T]: ...), variance is automatically inferred by type checkers based on whether T appears in parameter or return positions.\n\nParamSpec (PEP 612) captures function parameter signatures (*args, **kwargs), enabling decorators to wrap functions while preserving exact parameter types and return types.',
      whyItExists: 'Prevents container state corruption at runtime while maximizing code reusability. ParamSpec solves the classic Python decorator problem where wrapping a function wiped out type annotations, turning functions into Callable[..., Any].',
      problemSolved: 'Guarantees that generic containers and decorators preserve static type safety without sacrificing IDE autocompletion or static verification.',
      mentalModel: 'The Vending Machine vs The Trash Can: A Dog Vending Machine (Producer) is an Animal Vending Machine (Covariant—you ask for an Animal, you get a Dog, which is an Animal). An Animal Incinerator (Consumer) is a Dog Incinerator (Contravariant—if it can incinerate any Animal, it can safely incinerate a Dog). A Pet Hotel Crate (Read-Write Container) must be Invariant—you cannot substitute a Cat crate for a Dog crate because someone might put a Dog in.',
      realWorldUse: 'Generic database repositories, streaming data pipelines, telemetry/audit decorators, and event bus message dispatchers.',
      commonMistakes: [
        'Assuming list[Dog] is a subtype of list[Animal]: it is not; list is invariant to prevent inserting a Cat into a Dog list.',
        'Attempting to mutate a covariant collection: covariance is only sound when the collection is read-only (immutable).',
        'Typing decorators with Callable[..., Any]: this destroys parameter hints; ParamSpec must be used to preserve signature fidelity.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b20-d100-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Implementing a Generic Repository and a Type-Preserving ParamSpec Decorator',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Build a generic Repository[T] with identity lookup, and engineer a telemetry decorator using ParamSpec and TypeVar.',
      code: `import functools
import time
from typing import Generic, TypeVar, ParamSpec, Callable

# ── 1. Generic Repository ──
T = TypeVar("T")

class Repository(Generic[T]):
    """Generic in-memory repository managing items of type T."""
    def __init__(self) -> None:
        self._storage: dict[str, T] = {}

    def save(self, key: str, item: T) -> None:
        self._storage[key] = item

    def get(self, key: str) -> T | None:
        return self._storage.get(key)

# ── 2. Type-Preserving Decorator with ParamSpec ──
P = ParamSpec("P")
R = TypeVar("R")

def monitored(fn: Callable[P, R]) -> Callable[P, R]:
    """Decorator that logs execution time while preserving exact argument and return types."""
    @functools.wraps(fn)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        elapsed_ms = (time.perf_counter() - start) * 1000
        print(f"[METRIC] {fn.__name__} executed in {elapsed_ms:.2f}ms")
        return result
    return wrapper

# Verification of ParamSpec Decorator
@monitored
def fetch_user_balance(user_id: str, multiplier: float = 1.0) -> float:
    return len(user_id) * 100.0 * multiplier

# Type checker knows balance is float; IDE knows user_id is str and multiplier is float!
repo: Repository[float] = Repository[float]()
balance = fetch_user_balance("usr_9918", multiplier=1.2)
repo.save("usr_9918", balance)
print("Stored Balance:", repo.get("usr_9918"))
`,
      expectedOutput: "[METRIC] fetch_user_balance executed in ...ms\nStored Balance: 960.0",
      annotatedWalkthrough: [
        { line: 7, annotation: 'Defines invariant TypeVar T for generic repository storage.' },
        { line: 9, annotation: 'Generic[T] defines the class as generic over type T.' },
        { line: 20, annotation: 'ParamSpec P captures positional and keyword arguments.' },
        { line: 23, annotation: 'Callable[P, R] -> Callable[P, R] ensures zero signature loss.' },
        { line: 25, annotation: 'P.args and P.kwargs type-check *args and **kwargs authentically.' },
      ],
    } as ExampleBlock,
    {
      id: 'blk-b20-d100-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Defining Variance-Aware Protocols for Pipelines',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instruction: 'Define a generic PipelineStage protocol with explicit contravariant InputT and covariant OutputT parameters, and implement a concrete StringToLengthStage.',
      starterCode: `from typing import Protocol, TypeVar

# Practice:
# 1. Define InputT as contravariant TypeVar
# 2. Define OutputT as covariant TypeVar
# 3. Define PipelineStage Protocol
# 4. Implement StringToLengthStage

class PipelineStage(Protocol):
    pass
`,
      solutionCode: `from typing import Protocol, TypeVar

InputT = TypeVar("InputT", contravariant=True)
OutputT = TypeVar("OutputT", covariant=True)

class PipelineStage(Protocol[InputT, OutputT]):
    def process(self, item: InputT) -> OutputT:
        ...

class StringToLengthStage:
    def process(self, item: str) -> int:
        return len(item)
`,
      validationCriteria: [
        'InputT is declared with contravariant=True.',
        'OutputT is declared with covariant=True.',
        'PipelineStage defines process(item: InputT) -> OutputT.',
        'StringToLengthStage conforms to PipelineStage[str, int].',
      ],
      hints: [
        'Use TypeVar("InputT", contravariant=True) because inputs are in consumer position.',
        'Use TypeVar("OutputT", covariant=True) because outputs are in producer position.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b20-d100-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Read-Write Container Invariance',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does Python type checking forbid passing a list[Dog] to a function expecting list[Animal] (where Dog is a subclass of Animal)?',
      options: [
        'Because list[T] is a read-write mutable container; if it were covariant, the function could write a Cat (an Animal) into the list[Dog], violating the container-state invariant for the caller.',
        'Because Python lists can only store primitive integers and strings.',
        'Because subclasses in Python are not allowed to be stored in collections.',
        'Because mypy only allows tuples to participate in inheritance hierarchies.',
      ],
      correctIndex: 0,
      explanation: 'Mutable collections that support both read and write operations must be invariant. If list[Dog] were accepted as list[Animal], caller code holding a reference to list[Dog] could find a Cat inserted by the receiving function, leading to silent attribute and method failures.',
      misconceptionIdentified: 'Believing that if A is a subtype of B, Container[A] is automatically a subtype of Container[B].',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b20-d100-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Reflection: ParamSpec vs *args: Any, **kwargs: Any',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on decorator architecture: what happens to code maintainability, refactoring safety, and IDE user experience when an engineering team migrates legacy decorators from *args: Any to ParamSpec?',
    } as ReflectionBlock,
  ],
};

// ── DAY 101: DEBUG — Type Traps, False Invariants, Type Narrowing & Cast Hazards ──
export const DAY_101_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w20-020',
  dayNumber: 4,
  title: 'Type Traps, False Invariants, Type Narrowing & Cast Hazards',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b20-d101-01',
      type: 'THEORY',
      order: 1,
      title: 'Type Narrowing, The typing.cast() Hazard & TypeGuard vs TypeIs',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master safe type narrowing techniques (isinstance, match/case, TypeGuard), recognize why typing.cast() is an unsafe escape hatch, understand the Python 3.13+ TypeIs extension, and establish strict # type: ignore discipline.',
      whatItIs: 'Type narrowing is the process by which a type checker refines a variable from a broader type (e.g. str | int | None) to a narrower, specific type within a conditional block.\n\nSafe narrowing constructs include:\n1. isinstance() and issubclass() checks.\n2. structural pattern matching (match/case).\n3. PEP 647 TypeGuard[T]: A user-defined function returning bool. If it returns True, the type checker narrows the argument to T on the True branch. On the False branch, the type remains the wider type.\n4. Python 3.13+ PEP 742 TypeIs[T] (Extension Note): Unlike TypeGuard, TypeIs provides symmetric narrowing (narrows to T on True, and subtracts T from the original type on False).\n\nThe typing.cast() Hazard: typing.cast(TargetType, value) performs ZERO runtime conversion or validation! At runtime, cast() literally returns value unchanged (def cast(typ, val): return val). It is a compile-time assertion to silence the type checker. If the developer assertion is incorrect, it masks silent runtime crashes.\n\n# type: ignore Discipline: Blanket "# type: ignore" is forbidden. Real production standards mandate scoped codes with architectural justifications (e.g. "# type: ignore[attr-defined] # C-extension dynamic binding verified").',
      whyItExists: 'Empowers developers to write complex polymorphic code without resorting to Any, while establishing boundaries against dangerous compiler-silencing anti-patterns.',
      problemSolved: 'Eliminates unchecked NoneType attribute access, prevents unsound type casting bugs, and provides structured type narrowing for heterogeneous data streams.',
      mentalModel: 'The Airport Security Scanner vs The Counterfeit Badge: Safe narrowing (isinstance, TypeGuard) is the airport scanner physically verifying your passport and luggage before letting you board. typing.cast() is flashing a fake security badge that tells the guard to stop looking; if you actually have illegal contraband (invalid runtime state), the plane will still encounter disaster mid-flight.',
      realWorldUse: 'Validating untyped JSON API responses, handling union payloads in event streams, and safely narrowing database result sets.',
      commonMistakes: [
        'Using typing.cast() to "convert" data: cast("123", int) does NOT convert a string to an integer; at runtime it remains the string "123".',
        'Assuming TypeGuard narrows both branches: PEP 647 TypeGuard only narrows on the True branch; False leaves the type unchanged.',
        'Using blanket # type: ignore: hides legitimate bugs and masks regressions when code is refactored.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b20-d101-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge: Refactoring Cast Hazards & False Invariants',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_TYPE_SYSTEM_AND_PROTOCOLS,
      problemDescription: 'Audit and debug a broken polymorphic message processor plagued by unsafe cast() calls, unsound covariance mutation, and un-scoped type ignores.',
      description: 'Audit and debug a broken polymorphic message processor plagued by unsafe cast() calls, unsound covariance mutation, and un-scoped type ignores.',
      symptom: 'Uncaught runtime AttributeError/TypeError when malformed payloads bypass cast() without validation.',
      brokenArtifact: `from typing import Any, cast, TypeGuard

def is_valid_payload(data: Any) -> bool:
    # BUG 1: Regular bool return does not narrow type for mypy!
    return isinstance(data, dict) and "id" in data and "score" in data

def process_scores(payload: object) -> float:
    # BUG 2: Unsafe cast() without validation can crash at runtime!
    # If payload is a string, cast() returns string, crashing on ["score"]
    d = cast(dict[str, Any], payload)
    
    # BUG 3: Blanket type ignore masking potential None dereference
    score = d["score"] # type: ignore
    return float(score) * 1.1

def append_element(items: list[object], val: str) -> None:
    # BUG 4: Modifying covariant/narrowed assumption
    items.append(val)
`,
      fixedCode: `from typing import Any, TypeGuard

def is_valid_payload(data: object) -> TypeGuard[dict[str, Any]]:
    # FIXED: TypeGuard enables safe type narrowing on the True branch
    return isinstance(data, dict) and "id" in data and "score" in data

def process_scores(payload: object) -> float:
    # FIXED: Safe narrowing via TypeGuard replaces blind cast()
    if is_valid_payload(payload):
        score = payload["score"]
        if isinstance(score, (int, float, str)):
            try:
                return float(score) * 1.1
            except ValueError:
                return 0.0
    return 0.0

def append_element(items: list[object], val: str) -> None:
    items.append(val)
`,
      expectedErrors: [
        'Unsafe cast() hiding potential runtime TypeError/AttributeError.',
        'Blanket type ignore concealing None/KeyError.',
        'Missing TypeGuard annotation preventing mypy narrowing.',
      ],
      verificationSteps: [
        'Replace bool return with TypeGuard[dict[str, Any]].',
        'Remove unsafe cast() call and gate access with if is_valid_payload(payload).',
        'Remove blanket type ignores and handle value conversion safely.',
      ],
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b20-d101-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Implementing Safe TypeGuard Narrowing',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      instruction: 'Implement a custom TypeGuard function "is_string_list" that safely narrows a variable from object to list[str].',
      starterCode: `from typing import TypeGuard

# Practice:
# Implement is_string_list(val: object) -> TypeGuard[list[str]]
# Must check that val is a list, and every item in val is a str.

def is_string_list(val: object) -> bool:
    pass
`,
      solutionCode: `from typing import TypeGuard

def is_string_list(val: object) -> TypeGuard[list[str]]:
    if not isinstance(val, list):
        return False
    return all(isinstance(item, str) for item in val)
`,
      validationCriteria: [
        'Return type annotated with TypeGuard[list[str]].',
        'Validates isinstance(val, list).',
        'Validates all elements are strings.',
      ],
      hints: [
        'Return TypeGuard[list[str]] instead of plain bool.',
        'Use all(isinstance(x, str) for x in val) to check elements.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b20-d101-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: The typing.cast() Reality',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What actually happens at runtime when the statement "x = cast(int, "hello")" is executed in Python?',
      options: [
        'Python executes "return "hello"", leaving x as the string "hello" with zero type conversion or error.',
        'Python raises a TypeError because "hello" cannot be cast to an integer.',
        'Python parses the string and sets x to 0.',
        'Python compiles the string into an integer hash value.',
      ],
      correctIndex: 0,
      explanation: 'In the standard library typing module, cast(typ, val) is implemented literally as: def cast(typ, val): return val. It has zero runtime effect. It is solely an instruction to static type checkers, and misuse causes immediate runtime bugs when code expects an int and gets a str.',
      misconceptionIdentified: 'Believing typing.cast() performs runtime type casting or coercion.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b20-d101-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Reflection: Defensive Type Checking in Large Codebases',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on static typing governance: why do top-tier engineering organizations configure CI to ban blanket "# type: ignore" and require explicit error codes with linked tracking tickets?',
    } as ReflectionBlock,
  ],
};

// ── DAY 102: TRANSFER — Month 5 Capstone: Strongly Typed Streaming Data Pipeline Engine ──
export const DAY_102_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m5-w20-020',
  assessmentCode: 'ASM-PFS-M5-W20-020',
  title: 'Formative Assessment: Strongly-Typed Streaming Data Pipeline Engine',
  description: 'Synthesize Month 5 architecture: Decorators with ParamSpec, Generators/Streaming batches, Context Managers with rollback, and Generic Protocols with variance. Requires dual verification: Lane A static mypy compliance under Python 3.12, and comprehensive runtime execution pass.',
  type: 'CODE',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  difficulty: 'ADVANCED',
  timeLimitMinutes: 95,
  passingScore: 80,
  maxAttempts: 3,
  attemptPolicy: 'LIMITED_BEST',
  targetCompetencyId: COMPETENCY_ID_TYPE_SYSTEM_AND_PROTOCOLS,
  batchId: 'batch-pfs-m5-w20-020',
  createdAt: '2026-09-07T00:00:00.000Z',
  updatedAt: '2026-09-07T00:00:00.000Z',
  items: [
    {
      id: 'item-b20-01',
      assessmentId: 'asm-pfs-m5-w20-020',
      itemType: 'CODE',
      points: 100,
      order: 1,
      timeEstimateMinutes: 95,
      title: 'Synthesizing Strongly Typed Streaming Pipeline Engine',
      prompt: 'Implement four production-grade architectural components under strict typing:\n1) Generic PipelineStage[InputT, OutputT] protocol with contravariant InputT and covariant OutputT.\n2) Type-safe @monitored_stage decorator preserving signatures using ParamSpec and TypeVar.\n3) TypedDataPipeline engine managing streaming generator batches with lazy chunking.\n4) StageTransaction context manager providing in-memory rollback on stage failure.\nDual verification: static consistency passing mypy --strict --python-version 3.12, and runtime behavioral correctness.',
      starterCode: `import functools
import time
from typing import Protocol, TypeVar, Generic, ParamSpec, Callable, Iterator, Any

# ── DOMAIN EXCEPTIONS ──
class PipelineError(Exception):
    """Base domain exception for pipeline failures."""
    pass

class StageExecutionError(PipelineError):
    """Raised when a stage fails to process an item."""
    pass

# ── 1. VARIANCE-AWARE PROTOCOL CONTRACT ──
# InputT is contravariant (consumer position); OutputT is covariant (producer position)
InputT = TypeVar("InputT", contravariant=True)
OutputT = TypeVar("OutputT", covariant=True)

class PipelineStage(Protocol[InputT, OutputT]):
    def process(self, item: InputT) -> OutputT:
        ...

# ── 2. TYPE-SAFE PARAMSPEC DECORATOR ──
P = ParamSpec("P")
R = TypeVar("R")

def monitored_stage(fn: Callable[P, R]) -> Callable[P, R]:
    """Wraps stage execution, recording call count and timing while preserving exact signature."""
    # TODO: Implement wrapper preserving signature and recording call metrics
    pass

# ── 3. TRANSACTIONAL STAGE CONTEXT MANAGER ──
class StageTransaction:
    """In-memory transactional context manager for pipeline state rollback."""
    # TODO: Implement __enter__ and __exit__ with snapshot rollback
    pass

# ── 4. TYPED DATA PIPELINE ──
class TypedDataPipeline:
    """Coordinates generic stages, streaming batches lazily with error recovery."""
    # TODO: Implement pipeline orchestration
    pass
`,
      solutionCode: `import copy
import functools
import time
from typing import Protocol, TypeVar, Generic, ParamSpec, Callable, Iterator, Any

class PipelineError(Exception):
    """Base domain exception for pipeline failures."""
    pass

class StageExecutionError(PipelineError):
    """Raised when a stage fails to process an item."""
    pass

InputT = TypeVar("InputT", contravariant=True)
OutputT = TypeVar("OutputT", covariant=True)

class PipelineStage(Protocol[InputT, OutputT]):
    def process(self, item: InputT) -> OutputT:
        ...

P = ParamSpec("P")
R = TypeVar("R")

def monitored_stage(fn: Callable[P, R]) -> Callable[P, R]:
    """Wraps stage execution, recording call count and timing while preserving exact signature."""
    @functools.wraps(fn)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        return fn(*args, **kwargs)
    return wrapper

class StageTransaction:
    """In-memory transactional context manager for pipeline state rollback."""
    def __init__(self, target_state: dict[str, Any]) -> None:
        self.target_state = target_state
        self._snapshot: dict[str, Any] | None = None

    def __enter__(self) -> dict[str, Any]:
        self._snapshot = copy.deepcopy(self.target_state)
        return self.target_state

    def __exit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> bool:
        if exc_type is not None:
            if self._snapshot is not None:
                self.target_state.clear()
                self.target_state.update(self._snapshot)
            return False  # Propagate error
        return False

class TypedDataPipeline:
    """Coordinates generic stages, streaming batches lazily with error recovery."""
    def __init__(self) -> None:
        self.stages: list[PipelineStage[Any, Any]] = []

    def add_stage(self, stage: PipelineStage[Any, Any]) -> None:
        self.stages.append(stage)

    def process_stream(self, stream: Iterator[Any]) -> Iterator[Any]:
        for item in stream:
            current: Any = item
            for stage in self.stages:
                current = stage.process(current)
            yield current

    def process_batch_transactional(self, batch: list[Any], state: dict[str, Any]) -> list[Any]:
        results: list[Any] = []
        with StageTransaction(state):
            for item in batch:
                current = item
                for stage in self.stages:
                    current = stage.process(current)
                results.append(current)
        return results
`,
      rubric: [
        {
          id: 'dim-b20-01',
          name: 'Static Type Annotations & Mypy Strict Compliance',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
          description: 'Validates complete static typing across all classes, protocols, methods, and functions passing mypy in strict mode under Python 3.12 with zero errors. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
          criteria: 'Zero untyped defs, zero dynamic Any escapes in pipeline interfaces, full TypeVar/ParamSpec compliance.',
        },
        {
          id: 'dim-b20-02',
          name: 'Structural Subtyping & Protocol Contracts',
          weight: 0.15,
          maxPoints: 15,
          description: 'Validates PipelineStage protocol adheres to PEP 544 structural subtyping without requiring explicit inheritance.',
          criteria: 'PipelineStage defines process(item: InputT) -> OutputT cleanly.',
        },
        {
          id: 'dim-b20-03',
          name: 'Generic Architecture & Variance Integrity',
          weight: 0.15,
          maxPoints: 15,
          description: 'Validates that InputT is contravariant and OutputT is covariant, correctly reflecting consumer/producer positions.',
          criteria: 'InputT declared contravariant=True, OutputT declared covariant=True.',
        },
        {
          id: 'dim-b20-04',
          name: 'Type-Safe Decorator Engineering via ParamSpec',
          weight: 0.10,
          maxPoints: 10,
          description: 'Validates @monitored_stage uses ParamSpec and TypeVar to preserve function signatures through wrapping.',
          criteria: 'Decorator wraps functions without losing argument or return types.',
        },
        {
          id: 'dim-b20-05',
          name: 'Streaming Pipeline & Transactional Context Orchestration',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
          description: 'Validates streaming generator pipeline processes data lazily, and StageTransaction context manager rolls back state upon stage execution errors. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
          criteria: 'Lazy generator streaming verified; transactional deepcopy rollback verified on error.',
        },
        {
          id: 'dim-b20-06',
          name: 'Type Narrowing & Cast Hazard Avoidance',
          weight: 0.05,
          maxPoints: 5,
          description: 'Validates zero unsafe typing.cast() calls or un-scoped # type: ignore comments.',
          criteria: 'Safe type narrowing utilized instead of blind casts.',
        },
        {
          id: 'dim-b20-07',
          name: 'Architectural Cleanliness & Defensive Standards',
          weight: 0.05,
          maxPoints: 5,
          description: 'Validates clean modular separation, domain exception inheritance, and defensive standards.',
          criteria: 'Clean exception hierarchy and defensive programming standards.',
        },
      ],
      visibleTests: [
        {
          name: 'test_protocol_conformance',
          assertion: 'class UpperStage: def process(self, item: str) -> str: return item.upper()\nstage = UpperStage()\nassert isinstance(stage, object) and stage.process("abc") == "ABC"',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_monitored_decorator_signature_preservation',
          assertion: '@monitored_stage\ndef add(x: int, y: int) -> int: return x + y\nassert add(3, 4) == 7',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_stage_transaction_rollback_on_failure',
          assertion: 'state = {"count": 10}\ntry:\n    with StageTransaction(state):\n        state["count"] = 999\n        raise StageExecutionError("Stage failed")\nexcept StageExecutionError:\n    pass\nassert state["count"] == 10',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_typed_pipeline_streaming',
          assertion: 'class DoubleStage: def process(self, item: int) -> int: return item * 2\npipeline = TypedDataPipeline()\npipeline.add_stage(DoubleStage())\nres = list(pipeline.process_stream(iter([1, 2, 3])))\nassert res == [2, 4, 6]',
          points: 10,
          tier: 'VISIBLE',
        },
      ],
      adversarialTests: [
        {
          name: 'test_transaction_preserves_nested_state_isolation',
          assertion: 'state = {"meta": {"version": 1}}\ntry:\n    with StageTransaction(state):\n        state["meta"]["version"] = 99\n        raise ValueError("aborted")\nexcept ValueError:\n    pass\nassert state["meta"]["version"] == 1',
          points: 10,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_pipeline_empty_stream_handling',
          assertion: 'pipeline = TypedDataPipeline()\nassert list(pipeline.process_stream(iter([]))) == []',
          points: 10,
          tier: 'ADVERSARIAL',
        },
      ],
      integrityTests: [
        {
          name: 'test_forbidden_threading_and_async_ast_scan',
          assertion: 'import ast, inspect\nsrc = inspect.getsource(TypedDataPipeline)\ntree = ast.parse(src)\nassert not any(isinstance(n, (ast.AsyncFunctionDef, ast.Await)) for n in ast.walk(tree))',
          points: 10,
          tier: 'INTEGRITY',
        },
      ],
    },
  ],
};

export const DAY_102_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m5-w20-020',
  dayNumber: 5,
  title: 'Formative Assessment: Strongly-Typed Streaming Data Pipeline Engine',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b20-d102-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Strongly Typed Streaming Data Pipeline Engine',
      estimatedMinutes: 80,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_TYPE_SYSTEM_AND_PROTOCOLS,
      unfamiliarDomainContext: 'High-Throughput Financial Event Processing & Audit Pipelines',
      task: 'Synthesize Month 5 architecture into a strongly typed data processing pipeline: generic PipelineStage protocols with variance, @monitored_stage ParamSpec decorators, lazy generator batch streaming, and StageTransaction rollback.',
    } as TransferChallengeBlock,
    {
      id: 'blk-b20-d102-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Knowledge Check: Month 5 Architectural Synthesis',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'How do ParamSpec and Protocols jointly enable type-safe, decoupled decorator and pipeline architectures in modern Python?',
      options: [
        'Protocols decouple interfaces from class hierarchies via structural subtyping, while ParamSpec preserves exact argument and return types through higher-order decorator wrapping.',
        'Protocols convert Python bytecode into C extensions, and ParamSpec forces memory to be allocated on the GPU.',
        'Protocols and ParamSpec automatically disable all error handling in Python.',
        'They are purely documentation strings that have no effect on static analysis.',
      ],
      correctIndex: 0,
      explanation: 'Structural subtyping via Protocols allows components to interact through interface contracts without inheritance coupling. ParamSpec ensures that higher-order decorators wrap functions without losing parameter names, default values, or return types.',
      misconceptionIdentified: 'Failing to see the architectural synergy between structural interfaces and signature-preserving decorators.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b20-d102-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Batch 020 Reference Sheet: Python Type System, Protocols & Invariants',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'PEP 544: Protocols: Structural subtyping (static duck typing)',
          url: 'https://peps.python.org/pep-0544/',
        },
        {
          title: 'PEP 612: Parameter Specification Variables (ParamSpec)',
          url: 'https://peps.python.org/pep-0612/',
        },
        {
          title: 'PEP 649 / PEP 749: Deferred Evaluation of Annotations using Format.VALUE/STRING',
          url: 'https://peps.python.org/pep-0749/',
        },
      ],
      documentationExtracts: [
        'CPython does not enforce annotation types during ordinary runtime execution.',
        'A read-write generic container such as list[T] is invariant because accepting both reads and writes makes covariance unsound.',
        'Format.VALUE, Format.FORWARDREF, and Format.STRING must only be used with trusted annotation definitions; annotation introspection can execute arbitrary code.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 020 MANIFEST ──
export const BATCH_020_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m5-w20-020',
  batchCode: 'P2-M5-W20-BATCH020',
  title: 'Python Type Architecture, Structural Subtyping (Protocols), Generics, Variance & Static Consistency with Mypy',
  difficulty: 'ADVANCED',
  days: [
    DAY_98_MANIFEST,
    DAY_99_MANIFEST,
    DAY_100_MANIFEST,
    DAY_101_MANIFEST,
    DAY_102_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-07T00:00:00.000Z',
  updatedAt: '2026-09-07T00:00:00.000Z',
};
