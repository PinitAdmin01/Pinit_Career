// src/lib/curriculum/pythonFullStack/batch008.ts
// Single Source of Truth for PINIT BATCH 008: Month 2 · Week 8 · Days 36–40 (Month 2 Culmination)
// Custom Exceptions, Python Data Model Methods (__str__, __repr__, __eq__) & Modular Domain Architecture
// Pedagogical Flow: UNDERSTAND (Custom Exceptions) -> APPLY (Data Model Dunders) -> BUILD (Multi-Module Architecture) -> DEBUG (Circular Imports & Exception Masking) -> TRANSFER (Subscription Billing Domain Engine)

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  GuidedLabBlock,
  IndependentPracticeBlock,
  DebuggingChallengeBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_MODULAR_DOMAIN_ARCHITECTURE = 'comp-pfs-m2-008';

// ── DAY 36: UNDERSTAND — Custom Exceptions & Domain Error Hierarchies ─────────
export const DAY_36_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w8-008',
  dayNumber: 1,
  title: 'Custom Exceptions & Domain Error Hierarchies',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b8-d36-01',
      type: 'THEORY',
      order: 1,
      title: 'Domain Exceptions: Subclassing Exception & Communicating Application Failures',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand why professional Python applications define custom exception classes inheriting from Exception, how to construct concise domain error hierarchies, attach structured metadata, and avoid exception masking anti-patterns.',
      whatItIs: 'A custom exception is a user-defined class that subclasses Python\'s built-in `Exception` (`class BillingError(Exception):`). It allows applications to categorize domain-specific failure states distinct from generic language errors like `ValueError` or `KeyError`.',
      whyItExists: 'Built-in exceptions communicate generic language failures (e.g., cannot parse integer, key missing). Domain exceptions communicate business and application-level failures (e.g., `PaymentDeclinedError`, `InvalidSubscriptionError`), allowing callers to write targeted exception handlers for specific business outcomes.',
      problemSolved: 'Eliminates ambiguous error handling, enables structured error metadata inspection, and prevents silent failure masking.',
      mentalModel: 'Generic Language Errors vs Specific Business Errors: Think of built-in exceptions like physical machine alerts ("Out of paper", "Door open"). Domain exceptions are business alerts ("Subscription expired", "Card declined"). Create a shallow hierarchy where specific errors inherit from a shared domain base class (`class PaymentDeclinedError(BillingError):`). Only create an exception subclass when callers need to catch and handle that specific category differently—do not create an exception class merely to change a message string.',
      realWorldUse: 'Payment processing gateways, subscription billing engines, and e-commerce checkout pipelines.',
      commonMistakes: [
        'Inheriting from `BaseException` instead of `Exception` (which can prevent catching `KeyboardInterrupt` or `SystemExit` cleanly).',
        'Catching everything with `except: pass` or `except Exception: pass`, which silently hides unexpected bugs like `NameError` or `TypeError`.',
        'Creating dozens of deep, single-use exception subclasses with no semantic distinction.',
      ],
      commonMisconceptions: [
        'Misconception: "Custom exceptions need complex internal logic." Reality: Most custom exceptions only need a descriptive docstring or a small `__init__` that stores domain metadata and delegates message formatting to `super().__init__(...)`.',
        'Misconception: "Exceptions are only for fatal crashes." Reality: Exceptions are Python\'s standard control flow mechanism for communicating that an operation could not complete according to its contract.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b8-d36-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Defining a Domain Exception Hierarchy & Exception Translation',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating a concise 2-level billing exception hierarchy, attaching domain metadata, targeted exception handling, and practical exception translation with raise ... from.',
      language: 'python',
      codeSnippet: `# 1. Base Domain Exception
class BillingError(Exception):
    """Base exception for all billing domain failures."""
    pass


# 2. Specialized Domain Exceptions with Metadata
class InvalidSubscriptionError(BillingError):
    """Raised when a subscription plan or tier is unrecognized."""
    def __init__(self, plan_name, message=None):
        self.plan_name = str(plan_name)
        msg = message or f"Unrecognized subscription plan: '{self.plan_name}'"
        super().__init__(msg)


class PaymentDeclinedError(BillingError):
    """Raised when payment authorization fails."""
    def __init__(self, customer_id, amount_due, reason="Insufficient funds"):
        self.customer_id = str(customer_id)
        self.amount_due = float(amount_due)
        self.reason = str(reason)
        super().__init__(f"Payment of \${self.amount_due:.2f} declined for customer '{self.customer_id}': {self.reason}")


# 3. Domain Logic with Exception Translation (raise ... from)
VALID_PLANS = {"BASIC": 9.99, "PRO": 29.99}

def charge_subscription(customer_id, plan_name, account_balance):
    plan_key = str(plan_name).upper().strip()
    if plan_key not in VALID_PLANS:
        raise InvalidSubscriptionError(plan_name)

    cost = VALID_PLANS[plan_key]
    if account_balance < cost:
        # Translate low-level deficit into domain-specific failure
        deficit = cost - account_balance
        raise PaymentDeclinedError(customer_id, cost, f"Shortage of \${deficit:.2f}")

    return {
        "customer_id": customer_id,
        "plan": plan_key,
        "charged": cost,
        "new_balance": round(account_balance - cost, 2),
    }


# 4. Targeted Exception Handling at the Call Site
try:
    result = charge_subscription("CUST-101", "ENTERPRISE", 50.00)
except InvalidSubscriptionError as err:
    print(f"[RECOVERY ACTION] Prompt user with valid plan list. Missing plan: {err.plan_name}")
except BillingError as err:
    print(f"[RECOVERY ACTION] General billing failure: {err}")`,
      expectedOutput: `[RECOVERY ACTION] Prompt user with valid plan list. Missing plan: ENTERPRISE`,
    } as ExampleBlock,
    {
      id: 'blk-b8-d36-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Constructing Structured Exception Trees & Handling Drills',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Define a base exception `InventoryError(Exception)`.',
        'Define `OutOfStockError(sku, requested_qty, available_qty)` inheriting from `InventoryError` with structured metadata.',
        'Define `DiscontinuedProductError(sku)` inheriting from `InventoryError`.',
        'Implement `fulfill_order(inventory, sku, quantity)` that raises appropriate domain errors when items cannot be fulfilled.',
      ],
      starterCode: `class InventoryError(Exception):
    pass


class OutOfStockError(InventoryError):
    def __init__(self, sku, requested_qty, available_qty):
        self.sku = str(sku)
        self.requested_qty = int(requested_qty)
        self.available_qty = int(available_qty)
        super().__init__(f"SKU {self.sku} out of stock: requested {self.requested_qty}, available {self.available_qty}")


class DiscontinuedProductError(InventoryError):
    def __init__(self, sku):
        self.sku = str(sku)
        super().__init__(f"SKU {self.sku} has been permanently discontinued")


def fulfill_order(inventory, sku, quantity):
    if sku not in inventory:
        raise DiscontinuedProductError(sku)
    
    available = inventory[sku]
    if quantity > available:
        raise OutOfStockError(sku, quantity, available)
    
    inventory[sku] -= quantity
    return True


# Verification
stock = {"ITEM-A": 5}
try:
    fulfill_order(stock, "ITEM-A", 10)
except OutOfStockError as err:
    print(f"Handled OutOfStock: SKU={err.sku}, Deficit={err.requested_qty - err.available_qty}")`,
      hints: [
        'Ensure custom exception classes pass their formatted message string to `super().__init__(msg)`.',
        'Catch specific exceptions before catching generic base classes.',
      ],
      expectedOutcome: 'Learner constructs clean domain error hierarchies with structured metadata attributes.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b8-d36-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic Check: Targeted Catching vs Blanket Exception Masking',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Consider this code:\n```python\ntry:\n    process_transaction(account, amount)\nexcept Exception:\n    pass\n```\nWhy is this considered a severe software engineering anti-pattern?',
      options: [
        'Because Python raises a SyntaxError if an except block contains only pass.',
        'Because it catches and silently swallows unexpected programming bugs (like NameError or TypeError) along with expected domain errors, hiding defects and leaving system state corrupted.',
        'Because custom exceptions cannot be caught by except Exception.',
        'Because pass automatically re-raises the exception in Python 3.14.',
      ],
      correctIndex: 1,
      explanation: '`except Exception: pass` catches almost all exceptions indiscriminately. It masks typo errors (`NameError`), parameter mismatches (`TypeError`), and uninitialized state (`AttributeError`), giving the false illusion of success while leaving the application in a broken state.',
      misconceptionIdentified: 'Believing blanket try/except blocks make code robust rather than fragile and bug-prone.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b8-d36-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Official Python 3.14 Documentation: User-Defined Exceptions',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Tutorial: User-defined Exceptions',
          url: 'https://docs.python.org/3/tutorial/errors.html#user-defined-exceptions',
          description: 'Official Python guidance on creating exception classes inheriting from Exception and structuring error hierarchies.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 37: APPLY — Python Data Model Methods (__str__, __repr__, __eq__) ────
export const DAY_37_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w8-008',
  dayNumber: 2,
  title: 'Python Data Model Methods: __str__, __repr__, and __eq__',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b8-d37-01',
      type: 'THEORY',
      order: 1,
      title: 'Special Methods: String Representations & Value Equality Semantics',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master implementing __str__, __repr__, and __eq__ on domain classes to provide readable string formatting, unambiguous debugging representations, and meaningful value equality comparisons.',
      whatItIs: 'The Python Data Model defines special double-underscore ("dunder") methods that classes can implement to integrate with Python built-in operations: `__str__` for readable string conversion (`str()`, `print()`), `__repr__` for unambiguous developer representation (`repr()`), and `__eq__` for value equality (`==`).',
      whyItExists: 'Without special methods, printing custom objects yields generic memory addresses (e.g. `<__main__.Account object at 0x7f...>` and comparisons check object identity (`is`) rather than domain value equality. Implementing dunder methods makes domain objects intuitive and natural to work with.',
      problemSolved: 'Enables clean debugging logs, informative console output, and value-based entity comparisons.',
      mentalModel: '__str__ vs __repr__ vs __eq__: 1) `__str__` is for humans/users (clean, readable summary). 2) `__repr__` is for developers/logging (unambiguous, shows key identifier and state). 3) `__eq__` defines value equality (compares domain fields between two instances). Identity (`is`) checks if two variables point to the exact same memory address; `==` (`__eq__`) checks if their values/states are equal.',
      realWorldUse: 'Transaction logging, domain entity debugging, value comparison in billing pipelines, and unit test assertions.',
      commonMistakes: [
        'Returning a non-string from `__str__` or `__repr__` (which raises a `TypeError` at runtime).',
        'Confusing `==` (`__eq__`) with `is` (identity check).',
        'Assuming `__eq__` requires objects to be the exact same class without checking compatibility with `isinstance()` or returning `NotImplemented`.',
      ],
      commonMisconceptions: [
        'Misconception: "`__repr__` must always return valid Python code that can be passed to `eval()`." Reality: In modern Python engineering, `__repr__` is primarily an unambiguous, developer-focused description of the object state (e.g. `Account(id=\'ACC-01\', balance=100.0)`).',
        'Misconception: "Custom objects with `__eq__` can immediately be used as dictionary keys or in sets." Reality: In Python, defining `__eq__` without `__hash__` makes instances unhashable by default. Hashing and hash tables will be explored in Month 4 (DSA); do not use custom mutable domain objects as dictionary keys.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b8-d37-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Implementing __str__, __repr__, and __eq__ on Domain Entities',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating clean implementations of __str__, __repr__, and __eq__ with type compatibility checks on a BillingPlan entity.',
      language: 'python',
      codeSnippet: `class BillingPlan:
    def __init__(self, plan_id, plan_name, monthly_rate):
        self.plan_id = str(plan_id).strip()
        self.plan_name = str(plan_name).strip()
        self.monthly_rate = round(float(monthly_rate), 2)

    def __str__(self):
        # Human-friendly representation (used by str() and print())
        return f"{self.plan_name} (\${self.monthly_rate:.2f}/mo)"

    def __repr__(self):
        # Unambiguous developer representation (used by repr() and in debug logs)
        return f"BillingPlan(plan_id='{self.plan_id}', plan_name='{self.plan_name}', monthly_rate={self.monthly_rate})"

    def __eq__(self, other):
        # Value equality comparison (used by ==)
        if not isinstance(other, BillingPlan):
            return NotImplemented
        return self.plan_id == other.plan_id and self.monthly_rate == other.monthly_rate


# Demonstration
p1 = BillingPlan("PLN-01", "Standard Monthly", 19.99)
p2 = BillingPlan("PLN-01", "Standard Monthly", 19.99)
p3 = BillingPlan("PLN-02", "Pro Monthly", 49.99)

# 1. str() and print()
print("str(p1):", str(p1))

# 2. repr()
print("repr(p1):", repr(p1))

# 3. Value Equality (==) vs Identity (is)
print("p1 == p2 (Equal Values):", p1 == p2)
print("p1 is p2 (Different Memory):", p1 is p2)
print("p1 == p3 (Different Values):", p1 == p3)
print("p1 == 'NotAPlan' (Graceful Non-Match):", p1 == "NotAPlan")`,
      expectedOutput: `str(p1): Standard Monthly (\$19.99/mo)
repr(p1): BillingPlan(plan_id='PLN-01', plan_name='Standard Monthly', monthly_rate=19.99)
p1 == p2 (Equal Values): True
p1 is p2 (Different Memory): False
p1 == p3 (Different Values): False
p1 == 'NotAPlan' (Graceful Non-Match): False`,
    } as ExampleBlock,
    {
      id: 'blk-b8-d37-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Customer Subscription Entity with Pythonic Data Model Hooks',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a SubscriptionRecord entity that implements __str__, __repr__, and __eq__ according to the Python data model.',
      instructions: [
        'Implement `SubscriptionRecord(subscription_id, customer_id, plan_code, is_active)`.',
        'Implement `__str__` returning a user-friendly status string.',
        'Implement `__repr__` returning an unambiguous developer representation.',
        'Implement `__eq__` comparing `subscription_id` and `customer_id` across instances.',
      ],
      starterFiles: {
        'subscription.py': `class SubscriptionRecord:
    def __init__(self, subscription_id, customer_id, plan_code, is_active=True):
        self.subscription_id = str(subscription_id).strip()
        self.customer_id = str(customer_id).strip()
        self.plan_code = str(plan_code).upper().strip()
        self.is_active = bool(is_active)

    def __str__(self):
        status = "ACTIVE" if self.is_active else "CANCELLED"
        return f"Subscription {self.subscription_id} [{self.plan_code}] - {status}"

    def __repr__(self):
        return (
            f"SubscriptionRecord(subscription_id='{self.subscription_id}', "
            f"customer_id='{self.customer_id}', plan_code='{self.plan_code}', "
            f"is_active={self.is_active})"
        )

    def __eq__(self, other):
        if not isinstance(other, SubscriptionRecord):
            return NotImplemented
        return self.subscription_id == other.subscription_id and self.customer_id == other.customer_id


# Verification
s1 = SubscriptionRecord("SUB-100", "CUST-A", "PREMIUM")
s2 = SubscriptionRecord("SUB-100", "CUST-A", "PREMIUM", is_active=True)
print(str(s1))
print(repr(s1))
print("Equality:", s1 == s2)`,
      },
      expectedBehavior: 'SubscriptionRecord instances provide human-friendly str(), informative repr(), and clean value equality comparison.',
    } as GuidedLabBlock,
    {
      id: 'blk-b8-d37-04',
      type: 'INDEPENDENT_PRACTICE',
      order: 4,
      title: 'Independent Practice: Invoice Line Item Value Object',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Create an InvoiceLineItem class modeling item description, unit price, and quantity with full __str__, __repr__, and __eq__ support.',
      starterCode: `class InvoiceLineItem:
    def __init__(self, item_id, description, unit_price, quantity=1):
        self.item_id = str(item_id).strip()
        self.description = str(description).strip()
        self.unit_price = round(float(unit_price), 2)
        self.quantity = max(1, int(quantity))

    def calculate_total(self):
        return round(self.unit_price * self.quantity, 2)

    def __str__(self):
        # TODO: Format as "description (x quantity) - \$total"
        pass

    def __repr__(self):
        # TODO: Format as InvoiceLineItem(item_id='...', description='...', unit_price=..., quantity=...)
        pass

    def __eq__(self, other):
        # TODO: Return True if other is InvoiceLineItem and item_id, unit_price, quantity match
        pass`,
      hints: [
        'Use `isinstance(other, InvoiceLineItem)` in `__eq__` and return `NotImplemented` if false.',
        'Ensure `__str__` and `__repr__` return valid strings.',
      ],
      verificationRequirements: [
        '__str__ returns clean user-facing line item text.',
        '__repr__ returns informative developer representation.',
        '__eq__ compares value attributes correctly.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b8-d37-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Official Python 3.14 Documentation: Data Model Special Methods',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Data Model: Basic Customization',
          url: 'https://docs.python.org/3/reference/datamodel.html#basic-customization',
          description: 'Official Python reference on __repr__, __str__, and __eq__ special methods.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 38: BUILD — Multi-Module Architecture & Import Boundaries ────────────
export const DAY_38_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w8-008',
  dayNumber: 3,
  title: 'Multi-Module Domain Architecture & Import Boundaries',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b8-d38-01',
      type: 'THEORY',
      order: 1,
      title: 'Application Architecture: Module Namespaces, Separation of Concerns & Import Semantics',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn to transition from single-file Python scripts to cohesive multi-module applications, mastering module namespaces, separation of domain responsibilities, and the mechanics of absolute vs relative imports.',
      whatItIs: 'A multi-module application structures domain code across distinct Python files (modules), where each module manages its own private namespace. Python\'s `import` statement initializes modules and binds selected names into the importing module\'s namespace.',
      whyItExists: 'Placing all classes, exceptions, business logic, storage operations, and CLI drivers in one monolithic file leads to poor readability, tight coupling, and difficult maintenance. Modular architecture separates concerns into cohesive layers.',
      problemSolved: 'Enables clean division of labor, testability of isolated components, and organized code navigation.',
      mentalModel: 'Cohesive Domain Layers & Import Boundaries: A healthy reference layout separates: 1) Domain Models (Entities & State), 2) Domain Exceptions (Error types), 3) Services (Business logic & workflows), 4) Storage (Persistence & JSON recovery), and 5) Entry Point (CLI / Driver). Understand import context: Relative imports (`from .models import ...`) require an initialized package context. An application\'s directly executed entry-point script (`python main.py`) does not have a parent package context and uses absolute imports.',
      realWorldUse: 'Structuring web backends, financial processing tools, CLI utilities, and microservices.',
      commonMistakes: [
        'Thinking `import` copy-pastes code into the current file (it actually executes the module once and binds names in the namespace).',
        'Using relative imports in a directly executed script (`python app.py`), which causes `ImportError: attempted relative import with no known parent package`.',
        'Creating circular import dependencies where module A imports B and module B imports A at the top level.',
      ],
      commonMisconceptions: [
        'Misconception: "Every project must strictly follow a 5-file architecture." Reality: Module separation should match the natural complexity of the domain. Cohesion and clear responsibilities are what matter, not rigid file counts.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b8-d38-02',
      type: 'GUIDED_LAB',
      order: 2,
      title: 'Guided Lab: Building a Layered Subscription Management Application',
      estimatedMinutes: 35,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Construct a multi-module Python application featuring domain models, custom exceptions, business services, and a CLI driver.',
      instructions: [
        'Examine `models.py` for entity definitions and dunder methods.',
        'Examine `exceptions.py` for the domain error hierarchy.',
        'Implement `services.py` to coordinate subscriptions and apply business rules.',
        'Implement `main.py` entry point protected by `if __name__ == "__main__":`.',
      ],
      starterFiles: {
        'billing/exceptions.py': `class BillingError(Exception):
    pass

class SubscriptionNotFoundError(BillingError):
    def __init__(self, sub_id):
        self.sub_id = sub_id
        super().__init__(f"Subscription '{sub_id}' not found in registry")`,

        'billing/models.py': `class CustomerAccount:
    def __init__(self, account_id, name, balance=0.0):
        self.account_id = str(account_id).strip()
        self.name = str(name).strip()
        self.balance = max(0.0, float(balance))

    def deduct(self, amount):
        if amount > self.balance:
            return False
        self.balance = round(self.balance - amount, 2)
        return True

    def __str__(self):
        return f"Customer {self.account_id} ({self.name}): \${self.balance:.2f}"

    def __repr__(self):
        return f"CustomerAccount(account_id='{self.account_id}', balance={self.balance})"`,

        'billing/services.py': `from billing.exceptions import SubscriptionNotFoundError

class BillingService:
    def __init__(self):
        self._accounts = {}
        self._subscriptions = {}

    def register_account(self, account):
        self._accounts[account.account_id] = account

    def get_account(self, account_id):
        return self._accounts.get(account_id)

    def process_monthly_billing(self, sub_id, cost):
        if sub_id not in self._subscriptions:
            raise SubscriptionNotFoundError(sub_id)
        # Process billing workflow
        return True`,

        'main.py': `# Entry-point script using absolute import
from billing.models import CustomerAccount
from billing.services import BillingService
from billing.exceptions import BillingError

def main():
    service = BillingService()
    cust = CustomerAccount("C-101", "Acme Corp", 500.0)
    service.register_account(cust)
    print("Registered:", cust)

if __name__ == "__main__":
    main()`,
      },
      expectedBehavior: 'Multi-module application cleanly separates models, exceptions, services, and driver without circular imports.',
    } as GuidedLabBlock,
    {
      id: 'blk-b8-d38-03',
      type: 'INDEPENDENT_PRACTICE',
      order: 3,
      title: 'Independent Practice: Modular Audit Log & Notification Architecture',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Design a 3-module application separating entities, custom errors, and event dispatchers.',
      starterCode: `# Task: Outline the responsibilities of:
# 1. audit/errors.py (AuditSecurityError, UnverifiedEventError)
# 2. audit/models.py (AuditEvent with __str__, __repr__, __eq__)
# 3. audit/dispatcher.py (AuditDispatcher coordinating records)

# Implement the core dispatcher coordination logic:
def process_audit_stream(events, dispatcher):
    # Process events through dispatcher, catching domain exceptions gracefully
    pass`,
      hints: [
        'Keep entities focused strictly on state and validation.',
        'Keep dispatcher focused on coordination and error management.',
      ],
      verificationRequirements: [
        'Domain models encapsulate state and implement data model dunders.',
        'Dispatcher coordinates operations without leaky abstraction.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b8-d38-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Cohesion, Coupling & Boundary Cleanliness',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'What are the main symptoms of poor module separation in a growing Python application? How does separating domain models from business services reduce unnecessary coupling?',
      guidingQuestions: [
        'Why should domain exceptions live in their own module or close to the domain model rather than in the UI driver?',
        'How does keeping business rules out of persistence storage files improve testability?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 39: DEBUG / DEEPEN — Integration Debugging ───────────────────────────
export const DAY_39_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w8-008',
  dayNumber: 4,
  title: 'Integration Debugging: Circular Imports, Exception Masking & State Inconsistency',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b8-d39-01',
      type: 'THEORY',
      order: 1,
      title: 'Diagnosing Multi-Module Integration Deficiencies',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master identifying and fixing multi-module integration defects including circular imports / partially initialized module errors, silent exception masking, and state desynchronization across collaborating objects.',
      whatItIs: 'Integration bugs arise when multiple modules and objects interact: 1) Circular import / partially initialized module errors occur when module A imports B while B imports A at top-level execution. 2) Exception masking occurs when generic handlers catch and discard critical failures. 3) State inconsistency occurs when mutable state is modified without updating dependent views.',
      whyItExists: 'As applications scale across multiple files, module loading order and inter-object communication introduce new failure modes distinct from local algorithmic bugs.',
      problemSolved: 'Eliminates import initialization crashes, unmasks hidden system failures, and prevents state corruption.',
      mentalModel: 'The Integration Diagnostic Process: OBSERVE -> REPRODUCE -> TRACE -> HYPOTHESIZE -> ROOT CAUSE -> FIX -> VERIFY. 1) For circular imports: inspect the traceback to find the cycle and refactor shared definitions into a common base module. 2) For silent failures: replace broad `except Exception: pass` with targeted handlers that log or re-raise. 3) For state inconsistency: ensure single source of truth or synchronous updates.',
      commonMistakes: [
        'Calling circular imports "deadlocks" (a circular import is an import initialization dependency cycle, not a concurrency lock).',
        'Attempting to fix circular imports by putting `import` statements inside functions randomly instead of fixing the underlying architectural coupling.',
        'Swallowing exceptions to make tests pass while leaving system state corrupted.',
      ],
      commonMisconceptions: [
        'Misconception: "Python cannot handle files that reference each other." Reality: Python initializes modules top-to-bottom on first import; if module A references a name from module B before module B has finished defining it, an `ImportError` (partially initialized module) is raised.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b8-d39-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge 1: The Circular Import / Partially Initialized Module Error',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'An invoice system crashes on startup with `ImportError: cannot import name \'InvoiceItem\' from partially initialized module \'invoicing.models\' (most likely due to a circular import)`.',
      symptom: 'ImportError on application initialization due to mutual top-level import dependencies.',
      brokenArtifact: `# invoicing/models.py
from invoicing.services import format_item_summary  # Cycle!

class InvoiceItem:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def get_display(self):
        return format_item_summary(self)

# invoicing/services.py
from invoicing.models import InvoiceItem  # Cycle!

def format_item_summary(item):
    return f"Item: {item.name} (\${item.price:.2f})"

# Traceback:
# File "invoicing/models.py", line 2, in <module>: from invoicing.services import format_item_summary
# File "invoicing/services.py", line 2, in <module>: from invoicing.models import InvoiceItem
# ImportError: cannot import name 'InvoiceItem' from partially initialized module 'invoicing.models'`,
      expectedBehavior: 'Break the circular dependency by moving data formatting to the model or passing data into the service cleanly without mutual top-level imports.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Trace the import cycle: `models.py` imports `services.py`, which immediately imports `models.py`.',
        'Hint 2: Notice that `models.py` only imports `services` to call a single formatting function.',
        'Hint 3: Implement `get_display()` directly in `InvoiceItem` or remove the top-level service import from `models.py`.',
      ],
      targetCompetencyId: COMPETENCY_ID_MODULAR_DOMAIN_ARCHITECTURE,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b8-d39-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge 2: Silent Failure Masking via Blanket Exception Handling',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A subscription billing run reports 100% success, but customer accounts were never charged because a typo in the service layer was silently swallowed by `except Exception: pass`.',
      symptom: 'Logical failure: System claims success while zero transactions were actually processed.',
      brokenArtifact: `# billing_service.py
class SubscriptionService:
    def __init__(self):
        self.processed_count = 0

    def process_charge(self, account, amount):
        try:
            # DEFECT: Typo "account.deduct_balence" raises AttributeError,
            # but the blanket except block catches and swallows it!
            account.deduct_balence(amount)
            self.processed_count += 1
            return True
        except Exception:
            # Anti-pattern: Silently hides AttributeError and returns False without logging
            return False`,
      expectedBehavior: 'Fix the method typo (`account.deduct_balance`) and replace blanket `except Exception:` with targeted handling for valid domain exceptions.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Look at the call inside the try block: `account.deduct_balence`.',
        'Hint 2: When that raised `AttributeError`, the `except Exception:` block caught it and silently ignored it.',
        'Hint 3: Fix the typo and only catch specific expected domain exceptions.',
      ],
      targetCompetencyId: COMPETENCY_ID_MODULAR_DOMAIN_ARCHITECTURE,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b8-d39-04',
      type: 'DEBUGGING_CHALLENGE',
      order: 4,
      title: 'Debugging Challenge 3: Mutable Field Equality & State Desynchronization',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A customer subscription registry fails to detect duplicate accounts because `__eq__` was implemented using mutable transient balance fields instead of immutable domain identifiers.',
      symptom: 'Behavioral defect: Identical customer accounts with slightly different balances are treated as completely different entities.',
      brokenArtifact: `# customer.py
class CustomerProfile:
    def __init__(self, customer_id, email, current_balance):
        self.customer_id = customer_id
        self.email = email
        self.current_balance = current_balance

    # DEFECT: Comparing current_balance means the same customer with a balance change is considered !=
    def __eq__(self, other):
        if not isinstance(other, CustomerProfile):
            return NotImplemented
        return self.customer_id == other.customer_id and self.current_balance == other.current_balance

# When CUST-101 updates their balance from 50.0 to 100.0:
c1 = CustomerProfile("CUST-101", "alice@example.com", 50.0)
c2 = CustomerProfile("CUST-101", "alice@example.com", 100.0)
# Returns False even though they are the exact same domain customer!
print("Is same customer:", c1 == c2)`,
      expectedBehavior: 'Implement `__eq__` based on stable identity attributes (`customer_id`) rather than volatile mutable state.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Domain entity equality should be based on stable unique identifiers (`customer_id`).',
        'Hint 2: Refactor `__eq__` so it checks `self.customer_id == other.customer_id`.',
      ],
      targetCompetencyId: COMPETENCY_ID_MODULAR_DOMAIN_ARCHITECTURE,
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 40: TRANSFER + FORMATIVE ASSESSMENT — Subscription Billing Engine ────
export const DAY_40_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w8-008',
  dayNumber: 5,
  title: 'Subscription Billing Domain Engine',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b8-d40-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Subscription Billing Domain Engine',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'SaaS Recurring Billing & Subscription Tier Lifecycle: Digital platforms manage recurring subscriptions across multiple tiers (Standard, Pro, Enterprise). Subscriptions transition through states (ACTIVE, SUSPENDED, CANCELLED), apply discount structures, manage account balances, handle payment rejections with custom domain exceptions, and generate formatted financial summaries. Software engineers structure these capabilities into cohesive objects, implementing Python data model dunders and clean error boundaries.',
      task: `Design and implement an object-oriented subscription billing domain engine:
\`process_billing_operations(operations)\`

PARAMETER DATA FORMATS:
1. \`operations\`: A sequence of operation request dictionaries:
   - \`{"action": "REGISTER_ACCOUNT", "account_id": "ACC-101", "initial_balance": 100.0}\`
   - \`{"action": "CREATE_SUBSCRIPTION", "sub_id": "SUB-01", "account_id": "ACC-101", "tier": "PRO", "monthly_rate": 25.0}\`
   - \`{"action": "APPLY_DISCOUNT", "sub_id": "SUB-01", "discount_percent": 20.0}\`
   - \`{"action": "BILL_CYCLE", "sub_id": "SUB-01"}\`
   - \`{"action": "CANCEL_SUBSCRIPTION", "sub_id": "SUB-01"}\`
   - \`{"action": "SUMMARY"}\`

TIER PRICING & BILLING RULES:
1. Tiers:
   - \`"STANDARD"\`: Standard rate, minimum charge \$5.00.
   - \`"PRO"\`: Standard rate + \$10.00 platform fee.
   - \`"ENTERPRISE"\`: Standard rate with dedicated support SLA fee of \$30.00.
2. Discounts:
   - \`APPLY_DISCOUNT\` reduces the base \`monthly_rate\` by \`discount_percent\` (0.0 to 100.0) before tier fees are calculated.
3. Billing:
   - If account has sufficient balance: deduct effective cycle cost, increment successful billings count, accumulate total revenue.
   - If account has insufficient balance: do NOT deduct balance, raise/handle domain error, increment failed billings count, do not change subscription state.
   - If subscription is CANCELLED: reject billing operation.

OPERATION INVARIANTS & REJECTIONS:
- \`REGISTER_ACCOUNT\`: Reject duplicate \`account_id\` or negative \`initial_balance\`.
- \`CREATE_SUBSCRIPTION\`: Reject duplicate \`sub_id\`, non-existent \`account_id\`, unknown \`tier\`, or negative \`monthly_rate\`.
- \`APPLY_DISCOUNT\`: Reject non-existent \`sub_id\` or \`discount_percent\` outside [0.0, 100.0].
- \`BILL_CYCLE\`: Reject non-existent \`sub_id\` or cancelled subscription.
- \`CANCEL_SUBSCRIPTION\`: Reject non-existent \`sub_id\` or already cancelled subscription.
- Invalid/rejected operations increment \`REJECTED_OPERATIONS\` count.

RETURN FORMAT:
The function must return a formatted execution summary string:
"""
REGISTERED_ACCOUNTS_COUNT: 2
ACTIVE_SUBSCRIPTIONS_COUNT: 1
TOTAL_REVENUE_BILLED: 30.00
SUCCESSFUL_BILLINGS_COUNT: 1
FAILED_BILLINGS_COUNT: 0
REJECTED_OPERATIONS: 0
PRIMARY_ACCOUNT_ID: ACC-101
"""
- If operations is empty: return 0 counts, 0.00 revenue, and \`PRIMARY_ACCOUNT_ID: NONE\`.
- \`PRIMARY_ACCOUNT_ID\`: ID of the account with the highest total billed revenue (or first registered if tied; NONE if none).`,
      constraints: [
        'Apply Object-Oriented Principles: Use clean class modeling, custom exception hierarchy, and data model dunders (__str__, __repr__, __eq__).',
        'Zero global state: all state must pass via arguments and return values.',
        'Zero external libraries, zero type annotations in student-required code.',
        'The autograder is non-prescriptive and accepts multiple defensible OO designs.',
      ],
      difficulty: 'BEGINNER',
      timeExpectationMinutes: 45,
      targetCompetencyId: COMPETENCY_ID_MODULAR_DOMAIN_ARCHITECTURE,
      assessmentRef: 'asm-pfs-m2-w8-bill-001',
    } as TransferChallengeBlock,
  ],
};

// ── DAY 40 INDEPENDENT FORMATIVE ASSESSMENT ──────────────────────────────────
export const DAY_40_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m2-w8-bill-001',
  assessmentCode: 'ASM-PFS-M2-W8-BILL',
  title: 'Subscription Billing Domain Engine Formative Assessment',
  description: 'Independent formative assessment evaluating custom exception handling, Python data model special methods, modular domain design, and multi-tier billing logic in the browser sandbox. (Formative practice assessment; not certification-grade).',
  type: 'CODE',
  mode: 'FORMATIVE',
  version: '1.0.0',
  status: 'PUBLISHED',
  difficulty: 'BEGINNER',
  timeLimitMinutes: 45,
  attemptPolicy: 'LIMITED_BEST',
  maxAttempts: 3,
  passingScore: 75,
  targetCompetencyId: COMPETENCY_ID_MODULAR_DOMAIN_ARCHITECTURE,
  items: [
    {
      id: 'item-bill-01',
      assessmentId: 'asm-pfs-m2-w8-bill-001',
      version: '1.0.0',
      itemType: 'CODE',
      prompt: `Implement an object-oriented subscription billing solution with \`process_billing_operations(operations)\` that models customer accounts, subscriptions, custom domain exceptions, and returns the formatted execution report string. Multiple defensible class structures and naming choices are accepted.`,
      points: 100,
      order: 1,
      timeEstimateMinutes: 30,
      visibleTests: [
        {
          id: 'vt-bill-01',
          name: 'Standard Account Registration, Subscription Creation & Successful Billing',
          input: JSON.stringify({
            operations: [
              { action: 'REGISTER_ACCOUNT', account_id: 'ACC-101', initial_balance: 100.0 },
              { action: 'CREATE_SUBSCRIPTION', sub_id: 'SUB-01', account_id: 'ACC-101', tier: 'STANDARD', monthly_rate: 20.0 },
              { action: 'BILL_CYCLE', sub_id: 'SUB-01' },
              { action: 'SUMMARY' },
            ],
          }),
          expectedOutput: 'REGISTERED_ACCOUNTS_COUNT: 1\\nACTIVE_SUBSCRIPTIONS_COUNT: 1\\nTOTAL_REVENUE_BILLED: 20.00\\nSUCCESSFUL_BILLINGS_COUNT: 1\\nFAILED_BILLINGS_COUNT: 0\\nREJECTED_OPERATIONS: 0\\nPRIMARY_ACCOUNT_ID: ACC-101',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-bill-02',
          name: 'Pro Tier Surcharge, Discount Application & Insufficient Funds Guard',
          input: JSON.stringify({
            operations: [
              { action: 'REGISTER_ACCOUNT', account_id: 'ACC-201', initial_balance: 30.0 },
              { action: 'CREATE_SUBSCRIPTION', sub_id: 'SUB-02', account_id: 'ACC-201', tier: 'PRO', monthly_rate: 20.0 }, // Pro tier adds 10.0 -> Total 30.0
              { action: 'BILL_CYCLE', sub_id: 'SUB-02' }, // Balance becomes 0.0, successful
              { action: 'BILL_CYCLE', sub_id: 'SUB-02' }, // Insufficient funds -> failed billing
              { action: 'SUMMARY' },
            ],
          }),
          expectedOutput: 'REGISTERED_ACCOUNTS_COUNT: 1\\nACTIVE_SUBSCRIPTIONS_COUNT: 1\\nTOTAL_REVENUE_BILLED: 30.00\\nSUCCESSFUL_BILLINGS_COUNT: 1\\nFAILED_BILLINGS_COUNT: 1\\nREJECTED_OPERATIONS: 0\\nPRIMARY_ACCOUNT_ID: ACC-201',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-bill-01',
          name: 'Duplicate Registrations, Cancellation Lifecycle & Invalid Subscriptions',
          input: JSON.stringify({
            operations: [
              { action: 'REGISTER_ACCOUNT', account_id: 'ACC-301', initial_balance: 50.0 },
              { action: 'REGISTER_ACCOUNT', account_id: 'ACC-301', initial_balance: 50.0 }, // Duplicate -> reject
              { action: 'CREATE_SUBSCRIPTION', sub_id: 'SUB-03', account_id: 'ACC-301', tier: 'STANDARD', monthly_rate: 15.0 },
              { action: 'CANCEL_SUBSCRIPTION', sub_id: 'SUB-03' },
              { action: 'BILL_CYCLE', sub_id: 'SUB-03' }, // Cannot bill cancelled -> reject
            ],
          }),
          expectedOutput: 'REGISTERED_ACCOUNTS_COUNT: 1\\nACTIVE_SUBSCRIPTIONS_COUNT: 0\\nTOTAL_REVENUE_BILLED: 0.00\\nSUCCESSFUL_BILLINGS_COUNT: 0\\nFAILED_BILLINGS_COUNT: 0\\nREJECTED_OPERATIONS: 2\\nPRIMARY_ACCOUNT_ID: ACC-301',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-bill-02',
          name: 'Empty Operations Boundary Handling',
          input: JSON.stringify({
            operations: [],
          }),
          expectedOutput: 'REGISTERED_ACCOUNTS_COUNT: 0\\nACTIVE_SUBSCRIPTIONS_COUNT: 0\\nTOTAL_REVENUE_BILLED: 0.00\\nSUCCESSFUL_BILLINGS_COUNT: 0\\nFAILED_BILLINGS_COUNT: 0\\nREJECTED_OPERATIONS: 0\\nPRIMARY_ACCOUNT_ID: NONE',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-bill-01',
          name: 'Anti-Hardcoding Dynamic Subscription Calculation Probe',
          input: '{"probe_vector": "DYNAMIC_BILLING_PROBE"}',
          expectedOutput: '{"dynamically_computed": true, "not_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-bill-01', name: 'FunctionalCorrectness', description: 'Accurately computes tier rates, discounts, balance deductions, and lifecycle state.', weight: 0.30, maxPoints: 30 },
        { id: 'rub-bill-02', name: 'DomainErrorModeling', description: 'Implements custom exception classes and cleanly handles domain failure categories.', weight: 0.20, maxPoints: 20 },
        { id: 'rub-bill-03', name: 'ObjectDataModelBehavior', description: 'Implements clean data model dunder methods (__str__, __repr__, __eq__) on domain entities.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-bill-04', name: 'ModuleResponsibility', description: 'Separates entity models, exceptions, and billing coordination into cohesive responsibilities.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-bill-05', name: 'DesignJudgment', description: 'Avoids anti-patterns like exception swallowing and creates maintainable abstractions.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-bill-06', name: 'DebuggingVerification', description: 'Safely handles duplicate registrations, cancelled subscriptions, and boundary cases.', weight: 0.10, maxPoints: 10 },
      ],
    },
  ],
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};

// ── BATCH 008 COMPLETE MANIFEST (DAYS 36–40) ─────────────────────────────────
export const BATCH_008_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m2-w8-008',
  batchCode: 'P1-M2-W8-BATCH008',
  title: 'Custom Exceptions, Python Data-Model Methods & Modular Domain Architecture (Days 36–40)',
  difficulty: 'BEGINNER',
  days: [
    DAY_36_MANIFEST,
    DAY_37_MANIFEST,
    DAY_38_MANIFEST,
    DAY_39_MANIFEST,
    DAY_40_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};
