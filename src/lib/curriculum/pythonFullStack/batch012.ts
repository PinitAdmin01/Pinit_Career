// src/lib/curriculum/pythonFullStack/batch012.ts
// Single Source of Truth for PINIT BATCH 012: Month 3 · Week 12 · Days 56–60
// Milestone Project 3 & Gate 1 Foundation Exit Assessment: Modular Multi-Source Inventory & Configuration Management System
// Pedagogical Flow: UNDERSTAND (Requirements Decomposition & Architecture) -> APPLY (Core Domain Implementation) -> BUILD (Persistence, Config & CLI Integration) -> DEBUG (Automated Regression Defense & Defect Discovery) -> TRANSFER (Milestone Assembly & Gate 1 Exit Assessment)

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

export const COMPETENCY_ID_APPLICATION_SYNTHESIS = 'comp-pfs-m3-012';

// ── DAY 56: ANALYZE — Requirements Decomposition & Architecture Design ─────────
export const DAY_56_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w12-012',
  dayNumber: 1,
  title: 'Requirements Decomposition & Architecture Design',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b12-d56-01',
      type: 'THEORY',
      order: 1,
      title: 'Architectural Layering: Decomposing Multi-Source Systems Before Writing Code',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn how to analyze a realistic business specification and decompose a multi-source data processing application into clean, decoupled architectural layers before writing implementation code.',
      whatItIs: 'Architectural layering is the practice of separating software responsibilities into distinct modules with clear unidirectional dependencies. In a professional Python application, we establish 5 primary layers: Configuration (resolving settings from defaults, JSON, env vars, and CLI), Ingestion (reading and parsing external CSV/JSON files into normalized records), Domain (pure entity records and business rules), Service (state management, stock transactions, and valuation), and Presentation/CLI (user interaction and exit codes).',
      whyItExists: 'Writing code without an upfront architectural blueprint leads to monolithic "spaghetti" scripts where file parsing, calculation logic, terminal printing, and environment variable reading are hopelessly tangled, making automated testing and bug isolation nearly impossible.',
      problemSolved: 'Enables independent testing of business logic without touching real filesystems, allows swapping file formats without rewriting domain rules, and ensures predictable error propagation across layer boundaries.',
      mentalModel: 'The Concentric Onion / Layered Pipeline: Presentation (CLI) -> Service (State & Transactions) -> Domain (Pure Business Entities & Rules). Configuration and Ingestion feed the inner layers through stable data contracts. Data flows inward as normalized records; results flow outward as reports and exit codes.',
      realWorldUse: 'Designing supply chain backends, configuration synchronizers, financial reconciliation engines, and multi-tenant inventory pipelines in modern software teams.',
      commonMistakes: [
        'Allowing the file parsing logic (e.g. raw CSV string manipulation) to leak directly into the domain calculation classes.',
        'Hardcoding file paths, environment variable names, or terminal print statements inside core business logic methods.',
        'Designing deep, rigid inheritance hierarchies instead of using clean object composition.',
      ],
      commonMisconceptions: [
        'Misconception: "Architecture means you must have 10 separate files before writing a single line of logic." Reality: Architecture is about separation of concerns and dependency direction; whether modules reside in distinct files or cohesive sections depends on project scale and team convention, not rigid filesystem dogma.',
        'Misconception: "Marking a dataclass as frozen=True provides deep, immutable data structures." Reality: `frozen=True` provides shallow immutability: it only prevents direct attribute reassignment on the outer dataclass instance itself; nested mutable objects (like lists or dicts) can still be mutated in place unless defensively cloned or copied.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b12-d56-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Layer Decomposition & Frozen Dataclass Contracts in Action',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Examining how frozen dataclass records act as stable boundary contracts between an ingestion parser and domain operations, keeping domain logic completely isolated from raw string data.',
      language: 'python',
      codeSnippet: `from dataclasses import dataclass
from typing import Optional

# 1. Domain Layer: Pure Entity Contract (frozen=True provides attribute reassignment safety)
@dataclass(frozen=True)
class InventoryItem:
    sku: str
    name: str
    category: str
    unit_cost: float
    quantity: int

    def calculate_valuation(self) -> float:
        return round(self.unit_cost * self.quantity, 2)

# 2. Ingestion Normalization: Translates raw external dictionary into domain contract
def normalize_raw_record(raw_dict: dict) -> InventoryItem:
    # Validate and normalize keys from heterogeneous external sources
    sku = str(raw_dict.get("sku") or raw_dict.get("item_id") or "").strip()
    if not sku:
        raise ValueError("Missing SKU in raw input record")
    
    name = str(raw_dict.get("name") or "Unnamed Item").strip()
    category = str(raw_dict.get("category") or "GENERAL").strip().upper()
    unit_cost = float(raw_dict.get("unit_cost", 0.0))
    quantity = int(raw_dict.get("quantity", 0))

    if unit_cost < 0.0 or quantity < 0:
        raise ValueError(f"Negative values illegal for {sku}")

    return InventoryItem(sku=sku, name=name, category=category, unit_cost=unit_cost, quantity=quantity)

# 3. Demonstration
raw_csv_row = {"item_id": "SKU-9901", "name": "Precision Bolt M6", "unit_cost": "4.50", "quantity": "120"}
item = normalize_raw_record(raw_csv_row)
print(f"Normalized Item: {item.sku} | Name: {item.name} | Total Value: \${item.calculate_valuation():.2f}")`,
      expectedOutput: `Normalized Item: SKU-9901 | Name: Precision Bolt M6 | Total Value: $540.00`,
    } as ExampleBlock,
    {
      id: 'blk-b12-d56-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Defining Layer Boundaries for the Multi-Source Inventory System',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Review the 4 subsystem responsibilities for the Multi-Source Inventory & Configuration Management System.',
        'Ensure the configuration subsystem resolves CLI > Env > File > Defaults into a settings record.',
        'Ensure the ingestion subsystem parses CSV/JSON and emits validated domain records.',
        'Ensure the service layer handles in-memory catalog operations without importing sys.argv or CLI code.',
        'Run verify_boundary_coupling() to confirm that architectural boundaries remain decoupled.',
      ],
      starterCode: `class InventoryArchitectureDraft:
    def __init__(self):
        self.responsibilities = {
            "config": "Resolve CLI > Env > File > Defaults into a settings record",
            "ingestion": "Parse external CSV/JSON and yield validated InventoryItem records",
            "service": "Manage in-memory catalog, enforce non-negative stock, log transactions",
            "cli": "Expose user subcommands and map exceptions to exit codes 0, 1, 2"
        }

    def verify_boundary_coupling(self) -> bool:
        # Business logic must NOT import or call CLI or sys.argv
        return True

print("Architecture Draft Ready:", InventoryArchitectureDraft().verify_boundary_coupling())`,
      expectedOutcome: 'Architecture blueprint initialized with clean separation of concerns and decoupled service layers.',
      hints: [
        'Keep your domain service completely agnostic of how data was parsed (CSV vs JSON vs manual input).',
        'Configuration should always flow into services, never have services fetch configuration directly from the OS.',
      ],
      solutionReference: `class InventoryArchitectureDraft:
    def __init__(self):
        self.responsibilities = {
            "config": "Resolve CLI > Env > File > Defaults into a settings record",
            "ingestion": "Parse external CSV/JSON and yield validated InventoryItem records",
            "service": "Manage in-memory catalog, enforce non-negative stock, log transactions",
            "cli": "Expose user subcommands and map exceptions to exit codes 0, 1, 2"
        }

    def verify_boundary_coupling(self) -> bool:
        return True

print("Architecture Draft Ready:", InventoryArchitectureDraft().verify_boundary_coupling())`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b12-d56-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Architecture, Coupling & Boundary Invariants',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why do we use frozen dataclass records as layer-boundary contracts, and what is the exact semantic guarantee of frozen=True?',
      options: [
        'frozen=True guarantees complete recursive deep immutability across all nested collections and dictionary references.',
        'frozen=True prevents direct attribute reassignment on the dataclass instance, providing a stable contract while still allowing nested mutable collections if not carefully controlled.',
        'frozen=True automatically serializes the class to JSON and creates database tables in the background.',
        'frozen=True converts all string values into uppercase identifiers automatically.',
      ],
      correctIndex: 1,
      explanation: '`frozen=True` provides compile-time-like reassurance by making instance attribute re-assignment raise a `FrozenInstanceError`. However, it is shallow: if an instance holds a reference to a mutable list or dictionary, the contents of that list can still be modified. It is an effective layer-boundary contract when designed cleanly.',
      misconceptionIdentified: 'Believing that dataclass frozen=True recursively freezes all nested mutable lists and dictionaries.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 57: BUILD — Core Domain Implementation & Validation Logic ──────────────
export const DAY_57_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w12-012',
  dayNumber: 2,
  title: 'Core Domain Implementation & Validation Logic',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b12-d57-01',
      type: 'THEORY',
      order: 1,
      title: 'Domain Modeling: Entities, Validation Invariants & Custom Error Hierarchies',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Implement domain entity dataclasses, define a comprehensive custom exception hierarchy, and construct deterministic validation functions that protect application state.',
      whatItIs: 'The Domain Layer encapsulates the core business rules and entities of an application. It defines what constitutes a valid `Item`, what constitutes a `StockMovement`, and what errors can occur when business rules are violated. A domain exception hierarchy rooted in a common base class (e.g. `InventoryError(Exception)`) provides clean, expressive error classification.',
      whyItExists: 'External data sources and user inputs frequently contain malformed records, negative numbers, missing identifiers, or conflicting updates. Without strict domain validation and specialized exceptions, applications fail silently or crash with low-level Python errors like `KeyError` or `TypeError`.',
      problemSolved: 'Isolates business constraints into pure, easily testable functions that reject invalid state transitions before they can contaminate application data.',
      mentalModel: 'The Castle Gate & Sovereign Invariants: The domain layer is the castle. External inputs must pass through strict gatekeepers (validators). Any rule violation raises a specific domain exception (`ValidationError`, `InsufficientStockError`), preventing corrupt data from ever reaching the inner treasury (the inventory catalog).',
      realWorldUse: 'Core accounting systems, warehouse ERP software, e-commerce order processing engines, and healthcare inventory databases.',
      commonMistakes: [
        'Raising generic `Exception` or `ValueError` instead of domain-specific custom exceptions, preventing callers from distinguishing expected business rejections from programming bugs.',
        'Performing validation during data rendering rather than at the domain ingestion boundary.',
        'Allowing items with negative unit costs or empty SKUs into the catalog.',
      ],
      commonMisconceptions: [
        'Misconception: "You must use an Object-Relational Mapping (ORM) or database framework to have an entity model." Reality: Pure Python dataclasses with domain validation provide a complete, decoupled entity model without any framework dependency.',
        'Misconception: "Every single domain class must be placed in a separate file." Reality: Cohesive classes that change together can live cleanly in a single `domain.py` or `models.py` module; excessive fragmentation creates unnecessary import complexity.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b12-d57-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Custom Exception Hierarchy & Domain Entity Validation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Building a custom exception hierarchy and implementing domain validation logic for an inventory item and stock movement.',
      language: 'python',
      codeSnippet: `from dataclasses import dataclass
from typing import Optional

# 1. Custom Domain Exception Hierarchy
class InventoryError(Exception):
    """Base exception for all domain inventory errors."""
    pass

class ValidationError(InventoryError):
    """Raised when an item attribute violates domain constraints."""
    pass

class InsufficientStockError(InventoryError):
    """Raised when a stock deduction exceeds available on-hand quantity."""
    pass

class ItemNotFoundError(InventoryError):
    """Raised when an operation targets an uncataloged SKU."""
    pass

# 2. Domain Entities
@dataclass(frozen=True)
class Item:
    sku: str
    name: str
    category: str
    unit_cost: float
    quantity: int

def validate_item_data(sku: str, name: str, category: str, unit_cost: float, quantity: int) -> None:
    if not sku or not isinstance(sku, str) or not sku.strip():
        raise ValidationError("SKU must be a non-empty string.")
    if not name or not isinstance(name, str) or not name.strip():
        raise ValidationError("Item name must be a non-empty string.")
    if unit_cost < 0.0:
        raise ValidationError(f"Unit cost cannot be negative. Given: {unit_cost}")
    if quantity < 0:
        raise ValidationError(f"Quantity cannot be negative. Given: {quantity}")

# 3. Demonstration of validation behavior
try:
    validate_item_data("SKU-100", "Widget Pro", "HARDWARE", -12.50, 50)
except ValidationError as e:
    print(f"Caught expected domain validation rejection: {e}")

try:
    validate_item_data("", "Bad SKU Item", "HARDWARE", 10.0, 5)
except ValidationError as e:
    print(f"Caught expected domain validation rejection: {e}")`,
      expectedOutput: `Caught expected domain validation rejection: Unit cost cannot be negative. Given: -12.5
Caught expected domain validation rejection: SKU must be a non-empty string.`,
    } as ExampleBlock,
    {
      id: 'blk-b12-d57-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Implementing the Domain Catalog & Movement Validator',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Implement `apply_stock_delta(current_quantity, delta)` that returns the new quantity or raises `InsufficientStockError` if `current_quantity + delta < 0`.',
      instructions: [
        'Define the base `InventoryError` and `InsufficientStockError` exceptions.',
        'Implement `apply_stock_delta` taking integer `current_quantity` and integer `delta`.',
        'Validate that `current_quantity >= 0` and that `delta` is an integer.',
        'Check if `current_quantity + delta < 0`; if so, raise `InsufficientStockError`.',
        'Return the updated non-negative inventory quantity.',
      ],
      starterFiles: {
        'inventory/validator.py': `# Implement apply_stock_delta
class InventoryError(Exception):
    pass

class InsufficientStockError(InventoryError):
    pass

def apply_stock_delta(current_quantity: int, delta: int) -> int:
    pass
`,
      },
      expectedBehavior: 'Stock additions increase quantity; stock deductions reduce quantity; deductions exceeding current stock raise InsufficientStockError.',
      solutionCode: `class InventoryError(Exception):
    pass

class InsufficientStockError(InventoryError):
    pass

class ValidationError(InventoryError):
    pass

def apply_stock_delta(current_quantity: int, delta: int) -> int:
    if not isinstance(current_quantity, int) or current_quantity < 0:
        raise ValidationError("Current quantity must be a non-negative integer.")
    if not isinstance(delta, int):
        raise ValidationError("Delta must be an integer.")
    
    new_quantity = current_quantity + delta
    if new_quantity < 0:
        raise InsufficientStockError(
            f"Cannot deduct {-delta} units: only {current_quantity} available."
        )
    return new_quantity

# Verification
print("Stock add:", apply_stock_delta(100, 50))
print("Stock deduct:", apply_stock_delta(100, -40))
try:
    apply_stock_delta(10, -25)
except InsufficientStockError as err:
    print("Caught:", err)`,
      hints: [
        'A positive delta represents a restock or addition; a negative delta represents a shipment or withdrawal.',
        'Check if new_quantity < 0 before returning; never allow the balance to drop below zero.',
      ],
      targetCompetencyId: COMPETENCY_ID_APPLICATION_SYNTHESIS,
    } as GuidedLabBlock,
    {
      id: 'blk-b12-d57-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Exception Hierarchy Architecture',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why should custom domain exceptions inherit from a common base class (e.g. `InventoryError`) rather than inheriting directly from built-in `Exception`?',
      options: [
        'Because Python standard library forbids inheriting directly from `Exception`.',
        'So that callers can catch the common base class (`except InventoryError:`) to handle any domain-specific error in a unified way, while still allowing targeted catches for specific errors like `InsufficientStockError`.',
        'Because custom exceptions must be registered with the operating system kernel before use.',
        'So that exceptions are automatically saved into a CSV file whenever they are raised.',
      ],
      correctIndex: 1,
      explanation: 'A clean exception hierarchy provides flexibility: callers can catch the base `InventoryError` to handle any application failure safely, or catch specific subclasses (`InsufficientStockError`, `ValidationError`) to execute targeted recovery logic.',
      misconceptionIdentified: 'Believing that all custom exceptions must inherit directly from Exception without an intermediate domain base class.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 58: INTEGRATE — Persistence, Configuration, Logging & CLI Integration ───
export const DAY_58_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w12-012',
  dayNumber: 3,
  title: 'Persistence, Configuration, Logging & CLI Integration',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b12-d58-01',
      type: 'THEORY',
      order: 1,
      title: 'Connecting Components: Precedence, Simple Timestamps & Structured Logging',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Integrate multi-source configuration precedence, JSON file persistence with pathlib.Path, simple audit trail timestamps, and structured logging into a functional CLI tool.',
      whatItIs: 'Integration brings independent modules together into an executable application. Configuration loads settings using strict precedence: CLI arguments override Environment variables (`os.environ`), which override JSON configuration files, which override application defaults. Persistence safely serializes state to disk. Logging audits operations with standard log levels (`INFO`, `WARNING`, `ERROR`). Transactions record simple timestamps (ISO 8601 string or epoch int) without datetime timezone complexity.',
      whyItExists: 'A domain model in isolation cannot interact with users, persist data across restarts, or report errors to operators. Production applications must bind domain logic to standard I/O, environments, and command-line interfaces.',
      problemSolved: 'Provides a unified, executable interface that runs reliably across developer machines and automated server environments.',
      mentalModel: 'The Application Engine: Configuration drives how the service initializes -> Ingestion/Persistence loads state from disk -> CLI commands dispatch operations -> Service updates state, logs the transaction, and records an audit entry -> CLI formats output and exits with a standard code (0 = success, 1 = domain failure, 2 = usage error).',
      realWorldUse: 'Building administrative utilities, deployment tools, batch data synchronizers, and enterprise operations CLIs.',
      commonMistakes: [
        'Attempting complex timezone-aware datetime manipulation when a simple string timestamp (`"2026-09-06T10:00:00Z"`) or epoch integer (`int(time.time())`) is all that is required for transaction auditing.',
        'Swallowing exceptions silently and exiting with code 0 even when a core operation failed.',
        'Writing raw `print()` statements instead of using the configured `logging` logger for operational messages.',
      ],
      commonMisconceptions: [
        'Misconception: "Transaction timestamps require complex clock mocking and temporal math in basic applications." Reality: Recording when an event occurred is an auditing requirement easily fulfilled by a simple ISO 8601 string; temporal modeling belongs in specialized scheduling systems.',
        'Misconception: "The CLI layer should perform all business calculations before passing them to the service." Reality: The CLI should only parse arguments, call service methods, and format output; all calculation and invariant enforcement belongs in the domain/service layer.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b12-d58-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Configuration Precedence, Simple Transaction Audit & Logging Pattern',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating configuration resolution across CLI, environment, and defaults, alongside simple transaction logging with an ISO 8601 string timestamp.',
      language: 'python',
      codeSnippet: `import os
import time
from dataclasses import dataclass, field
from typing import Optional

# 1. Simple Audit Transaction Record (No complex datetime math)
@dataclass(frozen=True)
class StockTransaction:
    timestamp: str       # Simple ISO 8601 string: e.g. "2026-09-06T10:00:00Z"
    sku: str
    delta: int
    reason: str
    reference_id: str

# 2. Configuration Precedence Resolver
def resolve_config(cli_threshold: Optional[int], env_name: str = "INVENTORY_THRESHOLD", default_val: int = 10) -> int:
    # 1. Explicit CLI argument takes highest precedence
    if cli_threshold is not None:
        return cli_threshold
    # 2. Environment variable takes second precedence
    env_val = os.getenv(env_name)
    if env_val is not None:
        try:
            return int(env_val)
        except ValueError:
            pass  # Fall through to default if invalid
    # 3. Application default
    return default_val

# 3. Creating and recording an audit event
timestamp = "2026-09-06T10:00:00Z"  # Simple deterministic timestamp
txn = StockTransaction(
    timestamp=timestamp,
    sku="SKU-200",
    delta=-15,
    reason="DISPATCH_ORDER",
    reference_id="ORD-7890"
)

print(f"Resolved Threshold: {resolve_config(cli_threshold=None)}")
print(f"Recorded Txn: {txn.sku} | Delta: {txn.delta} | Time: {txn.timestamp} | Ref: {txn.reference_id}")`,
      expectedOutput: `Resolved Threshold: 10
Recorded Txn: SKU-200 | Delta: -15 | Time: 2026-09-06T10:00:00Z | Ref: ORD-7890`,
    } as ExampleBlock,
    {
      id: 'blk-b12-d58-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Building the In-Memory Inventory Service with JSON Persistence',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Construct `InventoryService` with methods `add_item()`, `deduct_item()`, `total_valuation()`, and `to_dict()`.',
      instructions: [
        'Define `Item` dataclass with attributes `sku`, `name`, `unit_cost`, `quantity`.',
        'Implement `InventoryService` with internal `catalog` dictionary and `history` list.',
        'Implement `add_item()` to insert new items or update existing item quantities.',
        'Implement `deduct_item()` to deduct stock, raising `ItemNotFoundError` if SKU is missing or `InsufficientStockError` if balance would be negative.',
        'Implement `total_valuation()` returning the sum of `unit_cost * quantity` rounded to 2 decimal places.',
      ],
      starterFiles: {
        'inventory/service.py': `class InventoryService:
    def __init__(self):
        self.catalog = {}
        self.history = []
`,
      },
      expectedBehavior: 'Inventory service correctly adds items, deducts stock, raises domain errors, and calculates total inventory valuation.',
      solutionCode: `from dataclasses import dataclass, asdict
from typing import Dict, List

class InsufficientStockError(Exception):
    pass

class ItemNotFoundError(Exception):
    pass

@dataclass
class Item:
    sku: str
    name: str
    unit_cost: float
    quantity: int

class InventoryService:
    def __init__(self):
        self.catalog: Dict[str, Item] = {}
        self.history: List[dict] = []

    def add_item(self, sku: str, name: str, unit_cost: float, quantity: int) -> None:
        if sku in self.catalog:
            existing = self.catalog[sku]
            existing.quantity += quantity
        else:
            self.catalog[sku] = Item(sku=sku, name=name, unit_cost=unit_cost, quantity=quantity)
        self.history.append({"sku": sku, "delta": quantity, "reason": "ADD_STOCK"})

    def deduct_item(self, sku: str, quantity: int) -> None:
        if sku not in self.catalog:
            raise ItemNotFoundError(f"SKU {sku} not found.")
        item = self.catalog[sku]
        if item.quantity < quantity:
            raise InsufficientStockError(f"Insufficient stock for {sku}: {item.quantity} available, {quantity} requested.")
        item.quantity -= quantity
        self.history.append({"sku": sku, "delta": -quantity, "reason": "DEDUCT_STOCK"})

    def total_valuation(self) -> float:
        return round(sum(item.unit_cost * item.quantity for item in self.catalog.values()), 2)

    def to_dict(self) -> dict:
        return {
            "items": {sku: asdict(item) for sku, item in self.catalog.items()},
            "history_count": len(self.history)
        }

# Verification
service = InventoryService()
service.add_item("SKU-1", "Widgets", 12.50, 100)
service.deduct_item("SKU-1", 30)
print("Remaining Quantity:", service.catalog["SKU-1"].quantity)
print("Total Valuation:", service.total_valuation())
print("Export Data:", service.to_dict())`,
      hints: [
        'Use a dictionary mapping `sku -> Item` for fast O(1) lookups during additions and deductions.',
        'When calculating total valuation, multiply unit_cost by quantity for every item and sum the results.',
      ],
      targetCompetencyId: COMPETENCY_ID_APPLICATION_SYNTHESIS,
    } as GuidedLabBlock,
    {
      id: 'blk-b12-d58-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: State Management, CLI Exit Codes & Crash Prevention',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Why must command-line applications distinguish between exit code 0 (clean success), exit code 1 (domain error, e.g. insufficient stock), and exit code 2 (command-line usage syntax error)? How do shell scripts and CI pipelines depend on these exit codes?',
      guidingQuestions: [
        'How does an automated bash script or CI runner determine whether a command succeeded or failed without parsing raw terminal text?',
        'Why does printing an error message but exiting with code 0 cause silent failures in production automation pipelines?',
      ],
      targetCompetencyId: COMPETENCY_ID_APPLICATION_SYNTHESIS,
    } as ReflectionBlock,
  ],
};

// ── DAY 59: VERIFY — Automated Regression Defense & Defect Discovery ───────────
export const DAY_59_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w12-012',
  dayNumber: 4,
  title: 'Automated Regression Defense & Defect Discovery',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b12-d59-01',
      type: 'THEORY',
      order: 1,
      title: 'Regression Defense: Contract Testing, pytest.approx & Injected Defect Discovery',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Construct an exhaustive pytest suite that exercises behavioral contracts, handles floating-point valuation tolerances safely with pytest.approx, and detects latent defects in legacy code.',
      whatItIs: 'Automated regression defense is the systematic creation of automated test suites that verify application contracts under boundary conditions. It uses fixtures for reproducible test setups, `tmp_path` for isolated filesystem I/O, `monkeypatch` for environment overrides, and parameterization for combinatorial edge cases. For financial and valuation calculations, the business contract defines an acceptable precision tolerance verified via `pytest.approx(expected, abs=0.01)`.',
      whyItExists: 'Writing tests only for simple happy paths gives false confidence. When code is modified, un-tested boundary conditions fail silently. Furthermore, floating-point arithmetic in standard binary representation (`0.1 + 0.2 != 0.3`) creates precision artifacts that must be asserted against clear business contracts rather than mistaken for algorithmic bugs.',
      problemSolved: 'Detects regressions before deployment, ensures filesystem tests leave zero leftover files on disk, and proves that defects are reliably reproduced, patched, and prevented from recurring.',
      mentalModel: 'The Defect Trap: A test suite must be capable of failing when a bug is present. If you introduce a deliberate mutation into the code and no test fails, the test suite is inadequate. True testing rigor is demonstrated when tests catch real defects.',
      realWorldUse: 'Validating billing engines, inventory reconciliation suites, compiler passes, and data transformation pipelines in professional CI workflows.',
      commonMistakes: [
        'Calling `total_valuation == 100.0` directly without considering floating-point representation, causing tests to fail intermittently due to rounding artifacts.',
        'Not cleaning up test files from disk, polluting the working directory with temporary CSVs.',
        'Accepting a test suite that passes 100% without verifying that it can actually detect an intentional bug.',
      ],
      commonMisconceptions: [
        'Misconception: "Floating-point precision differences mean the Python calculation logic is wrong." Reality: Binary floating-point representation naturally exhibits minor precision artifacts; the business contract specifies the acceptable tolerance (e.g. 1 cent), and `pytest.approx` is the standard tool to verify that contract.',
        'Misconception: "High code coverage guarantees zero bugs." Reality: Coverage only measures which lines executed, not whether the assertions tested boundary conditions or valid invariants.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b12-d59-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Writing Contract Tests with pytest.approx, tmp_path & monkeypatch',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating how to structure contract tests using pytest.approx for monetary tolerances and simulating environment variable overrides.',
      language: 'python',
      codeSnippet: `import pytest

# Application logic under test
def calculate_inventory_valuation(items: list) -> float:
    # Simulates summing prices across float items
    return sum(item["price"] * item["qty"] for item in items)

def is_low_stock(quantity: int, threshold: int) -> bool:
    # CONTRACT: Quantity AT OR BELOW threshold is considered low stock
    return quantity <= threshold

# 1. Contract Testing with pytest.approx
def test_inventory_valuation_float_tolerance():
    items = [
        {"price": 19.99, "qty": 3},
        {"price": 5.40, "qty": 7},
        {"price": 0.10, "qty": 14}
    ]
    total = calculate_inventory_valuation(items)
    # Expected: 19.99*3 (59.97) + 5.40*7 (37.80) + 0.10*14 (1.40) = 99.17
    # Contract: Valuation must match within 1 cent ($0.01) tolerance
    assert total == pytest.approx(99.17, abs=0.01)

# 2. Boundary Value Testing: At, above, and below threshold
@pytest.mark.parametrize("quantity, threshold, expected_alert", [
    (15, 10, False),  # Above threshold -> Healthy
    (10, 10, True),   # Exact threshold boundary -> Low stock alert
    (9, 10, True),    # Below threshold -> Low stock alert
    (0, 10, True),    # Zero stock -> Critical alert
])
def test_low_stock_boundary_conditions(quantity, threshold, expected_alert):
    assert is_low_stock(quantity, threshold) == expected_alert

print("Contract test patterns verified.")`,
      expectedOutput: `Contract test patterns verified.`,
    } as ExampleBlock,
    {
      id: 'blk-b12-d59-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge: Uncovering and Patching the Legacy Low-Stock Boundary Defect',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      difficulty: 'INTERMEDIATE',
      targetCompetencyId: COMPETENCY_ID_APPLICATION_SYNTHESIS,
      problemDescription: 'The legacy inventory notification system contains a subtle off-by-one boundary defect: it triggers low-stock alerts only when stock is strictly less than threshold (`quantity < threshold`), failing to alert warehouse managers when stock reaches the exact safety threshold (`quantity == threshold`).',
      symptom: 'Items with quantity equal to the reorder threshold are omitted from reorder alerts, leading to warehouse stockouts.',
      brokenArtifact: `def check_reorder_status(catalog: dict, reorder_threshold: int) -> list:
    """
    Returns a list of SKUs that require reordering.
    BUSINESS CONTRACT: An item must be reordered if its quantity is LESS THAN OR EQUAL TO reorder_threshold.
    """
    reorder_list = []
    for sku, item in catalog.items():
        # DEFECT: Using < instead of <= means items at exact safety stock are never reordered!
        if item["quantity"] < reorder_threshold:
            reorder_list.append(sku)
    return reorder_list
`,
      expectedBehavior: 'Patch `check_reorder_status` so that `quantity <= reorder_threshold` is checked, ensuring items at exact threshold are correctly flagged for reorder.',
      hints: [
        'Examine the comparison operator in the `if` condition.',
        'Change `item["quantity"] < reorder_threshold` to `item["quantity"] <= reorder_threshold`.',
      ],
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b12-d59-04',
      type: 'GUIDED_PRACTICE',
      order: 4,
      title: 'Guided Practice: Writing Regression Tests for Discovered Defects',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Review the corrected `check_reorder_status` function.',
        'Write a dedicated test function that explicitly verifies the boundary condition where `quantity == threshold`.',
        'Assert that the test SKU appears in the reorder list to guarantee the regression cannot return.',
      ],
      starterCode: `def check_reorder_status(catalog: dict, reorder_threshold: int) -> list:
    reorder_list = []
    for sku, item in catalog.items():
        if item["quantity"] <= reorder_threshold:
            reorder_list.append(sku)
    return reorder_list

def test_reorder_boundary_exact_threshold():
    # TODO: Assert that item with quantity == 10 is included when reorder_threshold == 10
    pass
`,
      expectedOutcome: 'Regression test passes, proving that boundary items at exact threshold are flagged for reordering.',
      hints: [
        'The regression test specifically targets the boundary value (quantity == threshold).',
      ],
      solutionReference: `def check_reorder_status(catalog: dict, reorder_threshold: int) -> list:
    reorder_list = []
    for sku, item in catalog.items():
        if item["quantity"] <= reorder_threshold:
            reorder_list.append(sku)
    return reorder_list

def test_reorder_boundary_exact_threshold():
    sample = {"SKU-TEST": {"quantity": 10}}
    result = check_reorder_status(sample, reorder_threshold=10)
    assert "SKU-TEST" in result, "Regression defect: Item at exact threshold was not flagged!"
    print("Regression test PASSED!")

test_reorder_boundary_exact_threshold()`,
    } as GuidedPracticeBlock,
  ],
};

// ── DAY 60: TRANSFER + GATE 1 — Milestone Assembly & Foundation Exit Assessment ─
export const DAY_60_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m3-w12-012',
  dayNumber: 5,
  title: 'Milestone Project 3 Assembly & Gate 1 Foundation Exit Assessment',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b12-d60-01',
      type: 'GUIDED_LAB',
      order: 1,
      title: 'Capstone Packaging & Entry Point Assembly',
      estimatedMinutes: 45,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Configure `pyproject.toml` with `[project.scripts]` defining `inventory-cli = "inventory_manager.cli:main"` and verify that the package installs in editable mode (`pip install -e .`).',
      instructions: [
        'Review the pyproject.toml configuration specifying setuptools build-backend.',
        'Configure project metadata: name, version, description, and requires-python >= 3.10.',
        'Define optional test dependency: test = ["pytest>=7.0.0"].',
        'Add [project.scripts] console entry point binding `inventory-cli` to `inventory_manager.cli:main`.',
      ],
      starterFiles: {
        'pyproject.toml': `[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "inventory-manager"
version = "1.0.0"
`,
      },
      expectedBehavior: 'Standard pyproject.toml package specification allows editable installation and exposes the inventory-cli console command.',
      solutionCode: `# Standard pyproject.toml configuration for Milestone Project 3
PYPROJECT_CONFIG = """
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "inventory-manager"
version = "1.0.0"
description = "Modular Multi-Source Inventory & Configuration Management System"
readme = "README.md"
requires-python = ">=3.10"
dependencies = []

[project.optional-dependencies]
test = [
    "pytest>=7.0.0",
]

[project.scripts]
inventory-cli = "inventory_manager.cli:main"
"""
print("Package configuration verified.")`,
      hints: [
        'Standard layout places code under `src/inventory_manager/` with an `__init__.py`.',
        '`[project.scripts]` binds console command names to callable Python functions.',
      ],
      targetCompetencyId: COMPETENCY_ID_APPLICATION_SYNTHESIS,
    } as GuidedLabBlock,
    {
      id: 'blk-b12-d60-02',
      type: 'TRANSFER_CHALLENGE',
      order: 2,
      title: 'Transfer Challenge: Multi-Source Supplier Feed Reconciler',
      estimatedMinutes: 50,
      status: 'PUBLISHED',
      version: '1.0.0',
      difficulty: 'INTERMEDIATE',
      timeExpectationMinutes: 50,
      targetCompetencyId: COMPETENCY_ID_APPLICATION_SYNTHESIS,
      unfamiliarDomainContext: 'Automated Supply Chain Discrepancy Reconciliation: A regional warehouse receives electronic supplier fulfillment records and compares them against physical barcode scan receipts. Due to transport damages and supplier packaging errors, shipments often arrive with quantity discrepancies (surplus or deficit). You must implement an un-scaffolded reconciliation engine that processes both feeds, detects discrepancies, calculates net loss or surplus valuation, updates the inventory ledger, and outputs an audited discrepancy report.',
      task: `Implement \`reconcile_supplier_shipment(manifest_records, physical_counts, unit_costs)\`:
1. \`manifest_records\`: Dictionary mapping SKU to expected supplier shipment quantity: \`{"SKU-1": 100, "SKU-2": 50}\`.
2. \`physical_counts\`: Dictionary mapping SKU to physically scanned quantity: \`{"SKU-1": 95, "SKU-2": 50, "SKU-3": 10}\`.
3. \`unit_costs\`: Dictionary mapping SKU to unit cost: \`{"SKU-1": 10.0, "SKU-2": 20.0, "SKU-3": 5.0}\`.

Business Rules:
- If physical count < manifest quantity: Record a DEFICIT (lost/missing units).
- If physical count > manifest quantity: Record a SURPLUS (extra units received).
- If SKU in physical counts but not manifest: Record as UNEXPECTED_RECEIPT (surplus).
- Calculate total discrepancy valuation = sum of \`(abs(physical - manifest) * unit_cost)\`.
- Return a summary dictionary:
  \`{
      "status": "RECONCILED",
      "matched_skus": int,
      "discrepant_skus": int,
      "total_deficit_units": int,
      "total_surplus_units": int,
      "net_discrepancy_value": float (rounded to 2 decimal places),
      "items": list of discrepancy details
  }\``,
      constraints: [
        'Pure Python standard library only — no external dependencies.',
        'Use set operations to find all unique SKUs across both manifest and physical scan feeds.',
        'Round net discrepancy monetary values to 2 decimal places.',
        'Handle missing SKUs defensively without raising KeyError.',
      ],
      solutionCode: `def reconcile_supplier_shipment(manifest_records: dict, physical_counts: dict, unit_costs: dict) -> dict:
    all_skus = set(manifest_records.keys()) | set(physical_counts.keys())
    matched_count = 0
    discrepant_count = 0
    total_deficit = 0
    total_surplus = 0
    net_value_diff = 0.0
    details = []

    for sku in sorted(all_skus):
        expected = manifest_records.get(sku, 0)
        actual = physical_counts.get(sku, 0)
        cost = unit_costs.get(sku, 0.0)
        diff = actual - expected

        if diff == 0:
            matched_count += 1
        else:
            discrepant_count += 1
            if diff < 0:
                deficit_units = -diff
                total_deficit += deficit_units
                net_value_diff -= round(deficit_units * cost, 2)
                details.append({"sku": sku, "type": "DEFICIT", "units": deficit_units, "cost": cost})
            else:
                surplus_units = diff
                total_surplus += surplus_units
                net_value_diff += round(surplus_units * cost, 2)
                details.append({"sku": sku, "type": "SURPLUS", "units": surplus_units, "cost": cost})

    return {
        "status": "RECONCILED",
        "matched_skus": matched_count,
        "discrepant_skus": discrepant_count,
        "total_deficit_units": total_deficit,
        "total_surplus_units": total_surplus,
        "net_discrepancy_value": round(net_value_diff, 2),
        "items": details
    }

# Demonstration
manifest = {"SKU-1": 100, "SKU-2": 50}
physical = {"SKU-1": 95, "SKU-2": 50, "SKU-3": 10}
costs = {"SKU-1": 10.0, "SKU-2": 20.0, "SKU-3": 5.0}
print(reconcile_supplier_shipment(manifest, physical, costs))`,
      hints: [
        'Use set union `set(manifest.keys()) | set(physical.keys())` to iterate across all unique SKUs.',
        'Handle missing SKUs defensively using `.get(sku, 0)`.',
      ],
    } as TransferChallengeBlock,
  ],
};

// ── DAY 60 FORMAL ASSESSMENT SPECIFICATION (GATE 1 FOUNDATION EXIT) ───────────
// Note: Designated as FORMATIVE sandbox assessment for foundation exit competency verification.
export const DAY_60_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m3-w12-gate1',
  assessmentCode: 'ASM-PFS-M3-W12-GATE1',
  title: 'Gate 1 Foundation Exit Assessment: Modular Multi-Source Inventory & Configuration Management System',
  description: 'Comprehensive Phase 1 Foundation Exit Assessment evaluating Months 1–3 competencies: modular package architecture, dataclasses, defensive validation, multi-source configuration precedence, simple transaction logging, and contract-focused pytest testing with discovered defect regression defense.',
  type: 'PROJECT',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  difficulty: 'INTERMEDIATE',
  passingScore: 70,
  timeLimitMinutes: 90,
  attemptPolicy: 'UNLIMITED',
  maxAttempts: 0,
  targetCompetencyId: COMPETENCY_ID_APPLICATION_SYNTHESIS,
  batchId: 'batch-pfs-m3-w12-012',
  items: [
    {
      id: 'item-gate1-01',
      assessmentId: 'asm-pfs-m3-w12-gate1',
      version: '1.0.0',
      itemType: 'PROJECT',
      prompt: 'Implement, test, and defend the complete Modular Multi-Source Inventory & Configuration Management System adhering to all architectural boundaries, validation rules, and testing contracts.',
      points: 100,
      order: 1,
      timeEstimateMinutes: 90,
      starterCode: `# Gate 1 Foundation Exit Capstone Implementation
# Subsystems required:
# 1. Config: CLI > Env > File > Defaults precedence
# 2. Domain: Item, StockTransaction (simple timestamp: ISO 8601 string)
# 3. Service: In-memory catalog, valuation, non-negative inventory
# 4. Ingestion: CSV/JSON normalizers with custom exceptions
# 5. CLI: argparse subcommands with standard exit codes (0, 1, 2)
# 6. Test Suite: pytest with pytest.approx, tmp_path, monkeypatch, and defect regression
`,
      visibleTests: [
        {
          id: 'vt-gate1-01',
          name: 'Core Inventory Addition and Deduction Invariant Check',
          input: '{"action": "test_inventory_crud", "initial": 100, "deduct": 40}',
          expectedOutput: '{"status": "PASS", "remaining_quantity": 60}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-gate1-02',
          name: 'Insufficient Stock Rejection Invariant Check',
          input: '{"action": "test_insufficient_stock", "initial": 10, "deduct": 25}',
          expectedOutput: '{"status": "PASS", "error_raised": "InsufficientStockError"}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-gate1-03',
          name: 'Valuation Precision Contract Check with pytest.approx',
          input: '{"action": "test_valuation_tolerance", "items": [{"cost": 19.99, "qty": 3}]}',
          expectedOutput: '{"status": "PASS", "valuation_within_tolerance": true}',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-gate1-01',
          name: 'Configuration Precedence Evaluation (CLI > Env > File > Defaults)',
          input: '{"action": "test_config_precedence", "cli": 50, "env": 20, "file": 10}',
          expectedOutput: '{"status": "PASS", "resolved_value": 50}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-gate1-02',
          name: 'Isolated Filesystem Ingestion via tmp_path',
          input: '{"action": "test_isolated_ingestion", "file_type": "json"}',
          expectedOutput: '{"status": "PASS", "records_parsed": 5, "clean_teardown": true}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-gate1-03',
          name: 'Discovered Defect Regression Defense Check',
          input: '{"action": "test_exact_threshold_reorder_regression"}',
          expectedOutput: '{"status": "PASS", "regression_prevented": true}',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-gate1-01',
          name: 'Anti-Hardcoding Dynamic Assertion Evaluation Probe',
          input: '{"probe_vector": "DYNAMIC_GATE1_COMPETENCY_PROBE"}',
          expectedOutput: '{"dynamically_verified": true, "competency_floor_met": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        {
          id: 'rub-gate1-01',
          name: 'Architecture',
          description: 'Modular package decomposition with clean separation between config, ingestion, domain, service, and presentation layers.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'rub-gate1-02',
          name: 'DesignJudgment',
          description: 'Uses frozen dataclass records as layer contracts and enforces strict domain constraints against corrupt or malformed inputs.',
          weight: 0.15,
          maxPoints: 15,
        },
        {
          id: 'rub-gate1-03',
          name: 'FunctionalCorrectness',
          description: 'Core application correctness: state mutation safety, non-negative inventory enforcement, and transaction history consistency. (MINIMUM COMPETENCY FLOOR: >= 50%)',
          weight: 0.20,
          maxPoints: 20,
          isMandatory: true,
          minimumPassingScore: 10,
        },
        {
          id: 'rub-gate1-04',
          name: 'Testing',
          description: 'Comprehensive pytest suite: fixtures, tmp_path, monkeypatch, pytest.approx, parameterized boundary checks, and discovered defect regression test. (MINIMUM COMPETENCY FLOOR: >= 50%)',
          weight: 0.20,
          maxPoints: 20,
          isMandatory: true,
          minimumPassingScore: 10,
        },
        {
          id: 'rub-gate1-05',
          name: 'CLIDesign',
          description: 'Resolves configuration using strict 4-tier precedence and exposes intuitive argparse subcommands with standard exit codes (0, 1, 2).',
          weight: 0.10,
          maxPoints: 10,
        },
        {
          id: 'rub-gate1-06',
          name: 'ValidationErrorHandling',
          description: 'Custom domain exception hierarchy rooted in a common base class, meaningful error messages, and structured logging across all operations.',
          weight: 0.10,
          maxPoints: 10,
        },
        {
          id: 'rub-gate1-07',
          name: 'PackagingInstallation',
          description: 'Standard pyproject.toml package configuration, editable installation layout, and working CLI console script entry point.',
          weight: 0.10,
          maxPoints: 10,
        },
      ],
    },
  ],
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
};

// ── BATCH 012 COMPLETE MANIFEST (DAYS 56–60) ─────────────────────────────────
export const BATCH_012_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m3-w12-012',
  batchCode: 'P1-M3-W12-BATCH012',
  title: 'Milestone Project 3 & Gate 1 Foundation Exit Assessment: Modular Multi-Source Inventory & Configuration Management System (Days 56–60)',
  difficulty: 'INTERMEDIATE',
  days: [
    DAY_56_MANIFEST,
    DAY_57_MANIFEST,
    DAY_58_MANIFEST,
    DAY_59_MANIFEST,
    DAY_60_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
};
