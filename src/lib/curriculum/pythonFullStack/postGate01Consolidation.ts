// src/lib/curriculum/pythonFullStack/postGate01Consolidation.ts
// Single Source of Truth for Post-Gate 1 Consolidation & Architectural Transition (Days 61–62)
// Synthesizes and hardens Phase 1 competencies before launching Month 4 (DSA Foundations).

import {
  DayContentManifest,
  ConsolidationBlockManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  ReflectionBlock,
  TransferChallengeBlock,
  KnowledgeCheckBlock,
} from '../contentTypes';

const COMPETENCY_ID_APPLICATION_SYNTHESIS = 'comp-pfs-m3-012';

// ═══════════════════════════════════════════════════════════════════════════════
// DAY 61: REFLECT & HARDEN — Architecture Hardening & Engineering Retrospective
// ═══════════════════════════════════════════════════════════════════════════════
export const DAY_61_MANIFEST: DayContentManifest = {
  packetId: 'block-pfs-m3-post-gate01',
  dayNumber: 1, // Day 1 of consolidation block (Curriculum Day 61)
  title: 'Post-Gate Architecture Hardening, Refactoring & Engineering Retrospective',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-pg01-d61-01',
      type: 'THEORY',
      order: 1,
      title: 'The Cost of Fast Code: Technical Debt, Layer Leakage & Code Smells',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn to audit an application codebase for architectural debt, isolate code smells, and apply the Boy Scout Rule to harden layer boundaries.',
      whatItIs: 'Technical debt is the implied cost of future refactoring incurred by choosing expedient shortcuts over robust design during initial delivery. The Boy Scout Rule is an engineering principle: leave the code you touch cleaner than you found it. In Python applications, common code smells include broad `except Exception:` handlers that swallow syntax typos, boundary inversion where business logic imports CLI modules, and mutable default arguments.',
      whyItExists: 'Under milestone pressure, software inevitably accumulates minor architectural compromises. In a professional engineering organization, shipping a major release or passing an evaluation gate is immediately followed by a debt hardening phase to prevent brittle dependencies from compounding.',
      problemSolved: 'Prevents silent error masking, eliminates circular dependencies between domain logic and presentation layers, and prevents mutable default object sharing across function invocations.',
      mentalModel: 'The Structural Foundation: A crack in a concrete foundation can be patched easily while the building is one story high. If you construct three more floors on top of the crack without fixing it, repairing the foundation later requires demolishing the building.',
      realWorldUse: 'Post-launch stabilization sprints, architectural reviews, and code quality audits in mature engineering teams.',
      commonMistakes: [
        'Using bare `except:` or `except Exception: pass`, which hides critical programming defects like `NameError` or `TypeError`.',
        'Having core domain entities import CLI parser modules, creating an inverted dependency where business logic cannot run without presentation code.',
        'Using mutable defaults like `def add_transaction(items: list = []):`, causing all invocations to mutate the same shared list in memory.',
      ],
      commonMisconceptions: [
        'Misconception: "If all tests pass, the codebase has zero technical debt." Reality: Tests verify observable behavior against tested inputs; they do not reveal tight coupling, poor encapsulation, or hidden side effects.',
        'Misconception: "The Boy Scout Rule means rewriting entire modules." Reality: The Boy Scout Rule is an engineering principle about incremental improvement—fixing a leaky exception handler, renaming a confusing variable, or eliminating a redundant print statement during routine work.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-pg01-d61-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Refactoring a Leaky Layer Boundary & Eliminating Hidden State Leakage',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating how to identify and refactor a leaky service layer that improperly catches all exceptions and mutates shared defaults.',
      language: 'python',
      codeSnippet: `from dataclasses import dataclass
import logging
from typing import List, Optional

logger = logging.getLogger("inventory.service")

# ❌ BEFORE: Tightly coupled, leaky exception handling, mutable default
class BrittleInventoryService:
    def __init__(self, seed_items: list = []):  # ANTI-PATTERN: Shared mutable default!
        self.items = seed_items
        
    def deduct_stock(self, sku: str, quantity: int) -> bool:
        try:
            for item in self.items:
                if item["sku"] == sku:
                    item["qty"] -= quantity
                    print(f"DEBUG: Deducted {quantity} from {sku}")  # Anti-pattern: print in domain logic
                    return True
            return False
        except Exception:  # Anti-pattern: swallows KeyboardInterrupt, NameError, etc.
            return False


# ✅ AFTER: Hardened layer boundary, custom exceptions, defensive default
class InventoryDomainError(Exception):
    """Base exception for inventory service errors."""

class InsufficientStockError(InventoryDomainError):
    """Raised when deduction exceeds available stock."""

class ItemNotFoundError(InventoryDomainError):
    """Raised when requested SKU does not exist."""

@dataclass(frozen=True)
class InventoryRecord:
    sku: str
    quantity: int

class HardenedInventoryService:
    def __init__(self, seed_items: Optional[List[InventoryRecord]] = None):
        # Defensive copy: each instance owns an independent dictionary
        self._inventory = {
            item.sku: item.quantity 
            for item in (seed_items or [])
        }

    def deduct_stock(self, sku: str, quantity: int) -> int:
        if quantity <= 0:
            raise ValueError(f"Deduction quantity must be positive, got {quantity}")
        if sku not in self._inventory:
            raise ItemNotFoundError(f"SKU '{sku}' not found in catalog")
        
        current_qty = self._inventory[sku]
        if current_qty < quantity:
            raise InsufficientStockError(
                f"Cannot deduct {quantity} units from '{sku}': only {current_qty} available"
            )
            
        self._inventory[sku] = current_qty - quantity
        logger.info("Stock deducted successfully: sku=%s, deducted=%d, remaining=%d", 
                    sku, quantity, self._inventory[sku])
        return self._inventory[sku]
`,
      expectedOutput: 'Cleanly isolated domain logic with typed exceptions and zero presentation side-effects.',
    } as ExampleBlock,
    {
      id: 'blk-pg01-d61-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Hardening Domain Invariants & Adding Regression Traps',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Examine the provided `VulnerablePriceCalculator` which contains a dangerous mutable default argument and a broad exception catch that masks calculation errors.',
        'Write a targeted test function `test_mutable_default_isolation()` that demonstrates how two separate calculator instances pollute each other when the default argument is used.',
        'Refactor `VulnerablePriceCalculator` to `HardenedPriceCalculator` using `Optional[List[float]] = None` and explicit domain exception handling.',
        'Verify that all test assertions pass cleanly with zero state leakage across instances.',
      ],
      starterCode: `import pytest
from typing import List, Optional

# Step 1: Examine the vulnerable implementation
class VulnerablePriceCalculator:
    def __init__(self, discounts: list = []):  # Bug: Mutable default
        self.discounts = discounts

    def add_discount(self, rate: float) -> None:
        self.discounts.append(rate)

# Step 2: Implement the hardened version
class HardenedPriceCalculator:
    def __init__(self, discounts: Optional[List[float]] = None):
        # TODO: Implement defensive initialization
        pass

    def add_discount(self, rate: float) -> None:
        # TODO: Implement validation (rate must be between 0.0 and 1.0) and addition
        pass

# Step 3: Write tests proving the isolation
def test_mutable_default_isolation():
    # TODO: Prove two separate instances do NOT share discount lists
    pass
`,
      hints: [
        'When initializing with `discounts: Optional[List[float]] = None`, write `self.discounts = list(discounts) if discounts is not None else []`.',
        'In your test, instantiate `calc1 = HardenedPriceCalculator()`, call `calc1.add_discount(0.10)`, then instantiate `calc2 = HardenedPriceCalculator()` and assert `len(calc2.discounts) == 0`.',
      ],
      expectedOutcome: 'The student successfully demonstrates and patches mutable default state leakage, proving understanding through an automated regression test.',
      solutionReference: `import pytest
from typing import List, Optional

class HardenedPriceCalculator:
    def __init__(self, discounts: Optional[List[float]] = None):
        self.discounts: List[float] = list(discounts) if discounts is not None else []

    def add_discount(self, rate: float) -> None:
        if not (0.0 <= rate <= 1.0):
            raise ValueError(f"Discount rate must be between 0.0 and 1.0, got {rate}")
        self.discounts.append(rate)

def test_mutable_default_isolation():
    calc1 = HardenedPriceCalculator()
    calc1.add_discount(0.15)
    
    calc2 = HardenedPriceCalculator()
    assert len(calc2.discounts) == 0, "Instance calc2 was polluted by calc1 mutable state!"
    assert calc1.discounts == [0.15]
`,
    } as GuidedPracticeBlock,
    {
      id: 'blk-pg01-d61-04',
      type: 'REFLECTION',
      order: 4,
      title: 'The Post-Gate-1 Engineering Retrospective',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Identify one current architectural limitation in your Milestone Project 3 implementation, explain its likely impact, and describe one concrete improvement you would make before scaling the system.',
      guidingQuestions: [
        'What part of your system would become difficult to maintain or debug if the inventory catalog grew from 10 items to 10,000 items?',
        'How does keeping data entirely in an in-memory dictionary limit persistence or concurrent access?',
        'What concrete refactoring (e.g. splitting a module, formalizing an interface, or improving error reporting) would you prioritize next?',
      ],
      targetCompetencyId: COMPETENCY_ID_APPLICATION_SYNTHESIS,
    } as ReflectionBlock,
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// DAY 62: DEFEND & HANDOFF — Unfamiliar Change Request & Atomic Batch Invariants
// ═══════════════════════════════════════════════════════════════════════════════
export const DAY_62_MANIFEST: DayContentManifest = {
  packetId: 'block-pfs-m3-post-gate01',
  dayNumber: 2, // Day 2 of consolidation block (Curriculum Day 62)
  title: 'Unfamiliar Change Request, Blast Radius Defense & Atomic Batch Invariants',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-pg01-d62-01',
      type: 'THEORY',
      order: 1,
      title: 'Practical Blast Radius Analysis & Backward-Compatible Schema Evolution',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn to evaluate the impact of unfamiliar requirements using the Find-Inspect-Test-Modify-Check methodology, evolve dataclass schemas safely, and enforce all-or-nothing batch invariants.',
      whatItIs: 'In professional software engineering, a substantial portion of work involves modifying and maintaining existing systems rather than building everything from scratch. Blast radius analysis is the systematic process of identifying all parts of an application affected by a proposed change. The practical workflow follows five steps: Find → Inspect → Test → Modify → Regression-check.',
      whyItExists: 'Careless changes to shared domain entities frequently cause cascading failures in downstream consumers, serialization logic, or CLI parsers. Appending defaulted fields to the end of a dataclass preserves existing positional constructors, but true backward compatibility requires verifying actual consumers and serialized representations.',
      problemSolved: 'Eliminates partial state corruption during batch operations and ensures that code changes preserve all documented existing CLI behavior with zero test regressions.',
      mentalModel: 'The Atomic Gate: When loading cargo into a ship, you do not load half the containers and then check if the ship exceeds its weight limit. You calculate total weight beforehand; if the cargo violates the safety ceiling, the entire shipment is held at the dock and the ship remains in its pristine initial state.',
      realWorldUse: 'Implementing critical business rule updates, financial transaction limits, and API schema evolution in production services.',
      commonMistakes: [
        'Adding a non-defaulted field to the middle of a dataclass, breaking all existing positional instantiations across the test suite.',
        'Mutating application state record-by-record during a batch operation before verifying whether later records in the batch violate domain constraints.',
        'Claiming "100% backward compatibility" without running the full existing regression suite against the modified code.',
      ],
      commonMisconceptions: [
        'Misconception: "Adding a default value to a new dataclass field automatically makes the schema backward compatible." Reality: A default preserves many existing constructors, but backward compatibility must be checked against actual consumers and serialized representations (e.g. JSON payloads without the field).',
        'Misconception: "If a batch encounters an error on record 10, it is acceptable to have saved records 1 through 9." Reality: Unless partial ingestion is explicitly specified, batch operations must enforce all-or-nothing atomicity: validate first, reject the entire batch on failure, and leave pre-existing state untouched.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-pg01-d62-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Accommodating a Business Change Request with Atomic Pre-Validation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating how to safely extend a dataclass entity and enforce atomic all-or-nothing validation before applying any batch-level state mutations.',
      language: 'python',
      codeSnippet: `from dataclasses import dataclass
from typing import List, Dict

# Rule: When evolving a dataclass, append new defaulted attributes to the END
@dataclass(frozen=True)
class WarehouseItem:
    sku: str
    unit_cost: float
    quantity: int
    # Appended at end with default to preserve existing positional constructors
    category: str = "general"

class CapacityExceededError(Exception):
    """Raised when an ingestion batch would exceed the maximum valuation ceiling."""

class WarehouseManager:
    def __init__(self, max_valuation_ceiling: float = 50_000.0):
        self.max_valuation_ceiling = max_valuation_ceiling
        self._items: Dict[str, WarehouseItem] = {}

    def get_total_valuation(self) -> float:
        return sum(item.unit_cost * item.quantity for item in self._items.values())

    def ingest_batch_atomic(self, batch: List[WarehouseItem]) -> None:
        """
        ATOMIC INVARIANT:
        Validate the complete batch against the capacity constraint before committing
        any batch-level state mutations. If the batch would violate the ceiling,
        reject the entire batch and leave pre-existing inventory state unchanged.
        """
        # Step 1: Pre-calculate prospective state WITHOUT mutating self._items
        prospective_items = dict(self._items)
        for item in batch:
            if item.sku in prospective_items:
                existing = prospective_items[item.sku]
                prospective_items[item.sku] = WarehouseItem(
                    sku=item.sku,
                    unit_cost=item.unit_cost,
                    quantity=existing.quantity + item.quantity,
                    category=item.category
                )
            else:
                prospective_items[item.sku] = item

        prospective_valuation = sum(
            it.unit_cost * it.quantity for it in prospective_items.values()
        )

        # Step 2: Validate against ceiling BEFORE mutating state
        if prospective_valuation > self.max_valuation_ceiling:
            raise CapacityExceededError(
                f"Batch rejected: prospective valuation {prospective_valuation:.2f} "
                f"exceeds ceiling {self.max_valuation_ceiling:.2f}. Pre-existing inventory untouched."
            )

        # Step 3: All-or-nothing commit
        self._items = prospective_items
`,
      expectedOutput: 'All-or-nothing batch ingestion guaranteeing zero partial state corruption on rejection.',
    } as ExampleBlock,
    {
      id: 'blk-pg01-d62-03',
      type: 'TRANSFER_CHALLENGE',
      order: 3,
      title: 'Unfamiliar Change Request: Configurable Warehouse Valuation Ceiling',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Enterprise Supply Chain Audit: Warehouse Valuation Capping & Atomic Ingestion',
      task: 'Extend the Milestone Project 3 Inventory Manager to accommodate an unexpected business requirement: warehouse zones now enforce a configurable maximum valuation ceiling. You must apply the Find → Inspect → Test → Modify → Regression-check workflow. Validate the complete batch against the capacity constraint before committing any batch-level state mutations. If the batch would violate the ceiling, reject the entire batch and leave the pre-existing inventory state completely unchanged.',
      constraints: [
        'Apply the Find → Inspect → Test → Modify → Regression-check workflow before modifying existing logic.',
        'Validate the complete batch against the capacity ceiling before mutating any in-memory state.',
        'If the ceiling would be exceeded, raise a custom `CapacityExceededError` and ensure pre-existing inventory remains identical byte-for-byte / logically unchanged.',
        'Preserve all documented existing CLI behavior and demonstrate zero regressions against the supplied regression suite.',
        'Add new defaulted fields strictly at the end of dataclass definitions to protect existing positional constructors.',
      ],
      difficulty: 'INTERMEDIATE',
      timeExpectationMinutes: 35,
      targetCompetencyId: COMPETENCY_ID_APPLICATION_SYNTHESIS,
      starterArtifact: `import pytest
from dataclasses import dataclass
from typing import Dict, List

@dataclass(frozen=True)
class InventoryItem:
    sku: str
    unit_cost: float
    quantity: int
    # TODO: Add optional ceiling threshold or category at the END if needed

class CapacityExceededError(Exception):
    """Raised when an operation would exceed the warehouse valuation ceiling."""

class InventoryManager:
    def __init__(self, ceiling: float = 10_000.0):
        self.ceiling = ceiling
        self.items: Dict[str, InventoryItem] = {}

    def get_valuation(self) -> float:
        return sum(item.unit_cost * item.quantity for item in self.items.values())

    def ingest_batch(self, batch: List[InventoryItem]) -> None:
        # TODO: Implement atomic all-or-nothing validation!
        # If any item would cause total valuation to exceed self.ceiling,
        # reject the ENTIRE batch, leave self.items untouched, and raise CapacityExceededError.
        pass
`,
    } as TransferChallengeBlock,
    {
      id: 'blk-pg01-d62-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic: Detecting Breaking Changes & Partial Mutation Hazards',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'A developer adds a new required attribute `warehouse_zone: str` as the first field of an existing `@dataclass(frozen=True)` entity used across 40 unit tests. What failure occurs, and how should backward-compatible schema evolution have been applied instead?',
      options: [
        'Existing positional constructors `Item("SKU-1", 10.0, 5)` now bind "SKU-1" to `warehouse_zone`, breaking type safety or order; the new field should have been appended to the end with a default value.',
        'The Python interpreter refuses to compile any dataclass containing more than 3 fields; the developer must switch to a plain dictionary.',
        'The `@dataclass(frozen=True)` decorator prevents adding new fields permanently; the class must be made mutable.',
        'Nothing breaks because Python dataclasses automatically map positional arguments by type matching rather than parameter order.',
      ],
      correctIndex: 0,
      explanation: 'In Python dataclasses, parameters in generated `__init__` methods follow the exact order in which fields are declared. Inserting a new field at the beginning or middle shifts all existing positional arguments. To maintain backward compatibility with existing constructors, new fields must be appended at the end of the field list with a sensible default value, and compatibility must be verified against actual consumers.',
      misconceptionIdentified: 'Believing that dataclass constructor arguments are dynamically mapped or that field declaration order does not affect positional instantiation.',
    } as KnowledgeCheckBlock,
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// POST-GATE 1 CONSOLIDATION BLOCK MANIFEST (DAYS 61–62)
// ═══════════════════════════════════════════════════════════════════════════════
export const POST_GATE_01_CONSOLIDATION_MANIFEST: ConsolidationBlockManifest = {
  blockId: 'block-pfs-m3-post-gate01',
  blockCode: 'P1-M3-POST-GATE01',
  title: 'Post-Gate 1 Consolidation & Architectural Transition Block (Days 61–62)',
  difficulty: 'INTERMEDIATE',
  days: [
    DAY_61_MANIFEST,
    DAY_62_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-06T00:00:00.000Z',
  updatedAt: '2026-09-06T00:00:00.000Z',
};
