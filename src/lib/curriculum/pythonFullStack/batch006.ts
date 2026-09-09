// src/lib/curriculum/pythonFullStack/batch006.ts
// Single Source of Truth for PINIT BATCH 006: Month 2 · Week 6 · Days 26–30
// Object-Oriented Python & Entity Modeling: Classes, Encapsulation Conventions, Composition & State Design
// Pedagogical Flow: UNDERSTAND (Classes/__init__) -> APPLY (Methods/State Transitions) -> BUILD (Composition vs Association) -> DEBUG (Shared Mutable Class State & Method Binding) -> TRANSFER (OO Domain Engine)

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

export const COMPETENCY_ID_OOP_FOUNDATIONS = 'comp-pfs-m2-006';

// ── DAY 26: UNDERSTAND — Classes, Instances, Attributes & __init__ ────────────
export const DAY_26_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w6-006',
  dayNumber: 1,
  title: 'Classes, Instances, Attributes & __init__',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b6-d26-01',
      type: 'THEORY',
      order: 1,
      title: 'Classes as User-Defined Types: Definition, Instances, self & Attribute Scopes',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand Python classes as executable type definitions for creating custom object types, mastering the __init__ initializer, the explicit self parameter, and the distinct lookup behaviors of instance attributes vs class attributes.',
      whatItIs: 'A class defines a new type and describes the attributes and behaviors available to its instances (`class Name:`). When a class is instantiated (`obj = MyClass()`), Python creates a new instance object in memory and automatically invokes `__init__(self, ...)` to initialize instance attributes stored in the instance\'s namespace.',
      whyItExists: 'As programs scale, raw dictionaries and tuples become error-prone because they do not enforce structured state or tie specific operations directly to the data they manipulate. Classes bundle related state and behavior into cohesive, self-contained entities.',
      problemSolved: 'Provides clean custom types, protects data integrity, and enables structured multi-entity domain modeling.',
      mentalModel: 'Class Type Definition & Instance Objects: A class defines a type and describes attributes and behaviors available to its instances. While the blueprint analogy is a helpful introductory visual (the class defines structure and instances are individual houses built from it), remember that in Python, class definitions are executable code that create class objects at runtime. The parameter `self` is simply a conventional parameter name referencing the specific instance object passed into methods.',
      realWorldUse: 'User accounts, database models, physical device representations, e-commerce orders, and game entities.',
      commonMistakes: [
        'Defining mutable default attributes (e.g. `items = []`) in the class body instead of inside `__init__`, causing all instances to share a single list object upon attribute lookup.',
        'Forgetting the `self` parameter in `__init__` or method definitions, leading to `TypeError: takes 0 positional arguments but 1 was given` when called through an instance.',
        'Confusing an instance attribute (`self.name`) with a local variable (`name`), causing values to disappear when `__init__` finishes execution.',
      ],
      commonMisconceptions: [
        'Misconception: "`self` is a special built-in keyword in Python." Reality: `self` is a standard parameter name used by universally accepted Python convention. When calling `obj.method(x)`, Python automatically passes the instance as the first argument, conceptually evaluating to `Class.method(obj, x)`.',
        'Misconception: "A class definition creates an instance object immediately." Reality: The `class` block defines the type object; instance objects are created only when the class is instantiated with `obj = MyClass()`.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b6-d26-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Class Definition, Instance Initialization, self Binding & String Representation',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating class creation, initializing distinct instance attributes inside __init__, accessing attributes, and implementing __str__.',
      language: 'python',
      codeSnippet: `# 1. Defining a ServerNode Entity Class
class ServerNode:
    # Class attribute: Stored on the class object, shared upon lookup across all instances
    cluster_region = "us-east-1"

    def __init__(self, node_id, hostname, ram_gb):
        # Instance attributes: Stored on this specific instance object
        self.node_id = node_id
        self.hostname = hostname
        self.ram_gb = ram_gb
        self.status = "ONLINE"

    def __str__(self):
        return f"ServerNode({self.node_id}: {self.hostname}, {self.ram_gb}GB RAM, {self.status})"

# 2. Creating two independent instance objects
node1 = ServerNode("SRV-101", "app-primary.prod", 64)
node2 = ServerNode("SRV-102", "db-replica.prod", 128)

# 3. Inspecting independent instance state
print(node1)
print(node2)

# 4. Modifying one instance's state does not affect the other!
node1.status = "MAINTENANCE"
print("Node 1 updated:", node1.status)
print("Node 2 unaffected:", node2.status)
print("Shared cluster region:", node1.cluster_region)`,
      expectedOutput: `ServerNode(SRV-101: app-primary.prod, 64GB RAM, ONLINE)
ServerNode(SRV-102: db-replica.prod, 128GB RAM, ONLINE)
Node 1 updated: MAINTENANCE
Node 2 unaffected: ONLINE
Shared cluster region: us-east-1`,
    } as ExampleBlock,
    {
      id: 'blk-b6-d26-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Entity Blueprint & Instance Initialization Drills',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Define a `BankAccount` class with `account_number`, `owner_name`, and initial `balance` defaulting to 0.0.',
        'Define a `TelemetrySensor` class with `sensor_id`, `sensor_type`, and an empty `readings` list initialized inside `__init__`.',
        'Verify that creating multiple instances creates distinct, unshared object state.',
      ],
      starterCode: `class BankAccount:
    def __init__(self, account_number, owner_name, initial_balance=0.0):
        self.account_number = account_number
        self.owner_name = owner_name
        self.balance = float(initial_balance)

class TelemetrySensor:
    def __init__(self, sensor_id, sensor_type):
        self.sensor_id = sensor_id
        self.sensor_type = sensor_type
        # Important: Initialize mutable list inside __init__ per instance!
        self.readings = []

# Verification
acc1 = BankAccount("ACC-01", "Alice", 500.0)
acc2 = BankAccount("ACC-02", "Bob", 1000.0)

s1 = TelemetrySensor("S-10", "TEMPERATURE")
s2 = TelemetrySensor("S-20", "PRESSURE")
s1.readings.append(24.5)

print(f"{acc1.owner_name} Balance: {acc1.balance}")
print(f"{acc2.owner_name} Balance: {acc2.balance}")
print(f"Sensor 1 Readings: {s1.readings}")
print(f"Sensor 2 Readings: {s2.readings}")  # Remains empty []`,
      hints: [
        'Always assign instance attributes with `self.attribute_name = value` inside `__init__`.',
        'Never place `readings = []` directly inside the class body outside `__init__`.',
      ],
      expectedOutcome: 'Learner correctly defines classes, initializes instance variables inside __init__, and avoids shared mutable class attribute traps.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b6-d26-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic Check: self Binding & Class vs Instance Attributes',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'A developer defines the following class:\n```python\nclass InventoryBox:\n    items = []  # Line 2\n    def __init__(self, label):\n        self.label = label\n\nbox_a = InventoryBox("Alpha")\nbox_b = InventoryBox("Beta")\nbox_a.items.append("Wrench")\nprint(box_b.items)\n```\nWhat is printed, and why?',
      options: [
        'It prints `[]` because box_a and box_b are separate instances.',
        'It prints `[\'Wrench\']` because `items` was defined at the class level, creating a single shared list across all instances.',
        'It raises an AttributeError because items was not initialized in `__init__`.',
        'It prints `None` because append does not return a value.',
      ],
      correctIndex: 1,
      explanation: 'In Python, variables defined directly in the class body outside any method become Class Attributes shared by every instance upon attribute lookup. Because `items = []` is a mutable list defined at the class level, `box_a.items` and `box_b.items` refer to the exact same list object in memory. To give each instance its own independent list, `self.items = []` must be initialized inside `__init__`.',
      misconceptionIdentified: 'Believing class body variables are automatically duplicated per instance.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b6-d26-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Official Python 3.14 Documentation: Classes & Instances',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Tutorial: Classes',
          url: 'https://docs.python.org/3/tutorial/classes.html',
          description: 'Official Python reference on class definition syntax, instance objects, method objects, and class vs instance variables.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 27: APPLY — Methods, Encapsulation Conventions & Valid State Transitions ──
export const DAY_27_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w6-006',
  dayNumber: 2,
  title: 'Methods, Encapsulation Conventions & State Transitions',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b6-d27-01',
      type: 'THEORY',
      order: 1,
      title: 'Instance Methods, State Invariant Validation & Internal Naming Conventions',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn to design instance methods that organize behavior and state together, validate input arguments, enforce valid state transitions, and use Python naming conventions (_single_leading_underscore) for internal implementation details.',
      whatItIs: 'An instance method is a function defined inside a class that receives `self` as its first argument when called on an instance. In Python, encapsulation means organizing data and the behaviors that operate on that data into cohesive units, controlling access through methods that enforce valid state transitions.',
      whyItExists: 'If external code directly modifies object attributes without validation (e.g. setting `account.balance = -9999`), corrupted states break system integrity. Methods provide structured entry points that validate inputs before modifying state.',
      problemSolved: 'Ensures that objects transition only between valid, consistent states, protecting invariants against invalid or out-of-range inputs.',
      mentalModel: 'State Transitions via Methods: Think of an object as maintaining a contract of valid states. Rather than letting external code directly mutate attributes without checks, instance methods follow an explicit pipeline: INPUT VALIDATION -> VALID STATE TRANSITION -> STATE UPDATE. A single leading underscore (e.g. `_balance`) is a widely respected Python convention indicating an internal implementation detail, not a strict runtime access restriction.',
      realWorldUse: 'Bank transactions with non-negative balance checks, shopping carts with stock limits, and resource capacity managers.',
      commonMistakes: [
        'Allowing external code to bypass methods and directly assign invalid values to internal attributes.',
        'Calling an instance method without parentheses (e.g. `account.deposit` references the method object rather than executing it with `account.deposit(50)`).',
        'Failing to validate method inputs before modifying instance attributes.',
      ],
      commonMisconceptions: [
        'Misconception: "Python prevents outside code from accessing `_attr`." Reality: In Python, `_attr` is a convention signaling \'internal use\'. Python does not enforce private access modifiers at runtime. Developers respect this convention by interacting with objects through their public methods.',
        'Misconception: "Encapsulation requires complex property decorators or descriptors." Reality: At this stage, clean encapsulation is achieved simply by writing well-validated instance methods.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b6-d27-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Implementing Encapsulated State Transitions with Invariant Validation',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating instance methods with input validation, guard clauses, error recovery, and internal attribute conventions.',
      language: 'python',
      codeSnippet: `class BankAccount:
    def __init__(self, account_id, owner_name, initial_balance=0.0):
        self.account_id = account_id
        self.owner_name = owner_name
        # Convention: _balance indicates internal state
        self._balance = max(0.0, float(initial_balance))
        self._is_active = True

    def get_balance(self):
        return self._balance

    def deposit(self, amount):
        # 1. Validation & Guard Clauses
        if not self._is_active:
            print("[ERROR] Account is frozen.")
            return False
        if amount <= 0.0:
            print(f"[ERROR] Deposit must be positive, got {amount}")
            return False
        
        # 2. Valid State Update
        self._balance += amount
        return True

    def withdraw(self, amount):
        # 1. Validation & Guard Clauses
        if not self._is_active:
            print("[ERROR] Account is frozen.")
            return False
        if amount <= 0.0:
            print(f"[ERROR] Withdrawal must be positive, got {amount}")
            return False
        if amount > self._balance:
            print(f"[ERROR] Insufficient funds. Balance: {self._balance}, Requested: {amount}")
            return False
        
        # 2. Valid State Update
        self._balance -= amount
        return True

# Testing state transitions through methods
acc = BankAccount("ACC-101", "Elena", 100.0)
print("Initial Balance:", acc.get_balance())

acc.deposit(50.0)
print("After Deposit:", acc.get_balance())

acc.withdraw(200.0)  # Fails guard clause
print("After Failed Withdrawal:", acc.get_balance())`,
      expectedOutput: `Initial Balance: 100.0
After Deposit: 150.0
[ERROR] Insufficient funds. Balance: 150.0, Requested: 200.0
After Failed Withdrawal: 150.0`,
    } as ExampleBlock,
    {
      id: 'blk-b6-d27-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Shopping Cart & Order Item Pricing Entity',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a shopping cart class that encapsulates item management, subtotal calculation, and discount bounds.',
      instructions: [
        'Implement `ShoppingCart` with `add_item(name, price, quantity)`, `remove_item(name)`, and `calculate_total(discount_percent=0)`.',
        'Validate that prices and quantities are positive numbers.',
        'Ensure discount percent is bounded between 0 and 100.',
      ],
      starterFiles: {
        'shopping_cart.py': `class ShoppingCart:
    def __init__(self, customer_id):
        self.customer_id = customer_id
        self._items = {}  # {item_name: {"price": price, "qty": quantity}}

    def add_item(self, name, price, quantity=1):
        if not name or price <= 0.0 or quantity <= 0:
            return False
        
        if name in self._items:
            self._items[name]["qty"] += quantity
        else:
            self._items[name] = {"price": float(price), "qty": int(quantity)}
        return True

    def remove_item(self, name):
        if name in self._items:
            del self._items[name]
            return True
        return False

    def calculate_total(self, discount_percent=0.0):
        subtotal = 0.0
        for item in self._items.values():
            subtotal += (item["price"] * item["qty"])
        
        if discount_percent < 0.0 or discount_percent > 100.0:
            discount_percent = 0.0
            
        discount_amount = subtotal * (discount_percent / 100.0)
        return round(subtotal - discount_amount, 2)

# Demonstration
cart = ShoppingCart("CUST-901")
cart.add_item("Mechanical Keyboard", 120.0, 1)
cart.add_item("USB-C Cable", 15.0, 2)

print("Subtotal:", cart.calculate_total())
print("Total with 10% discount:", cart.calculate_total(10.0))`,
      },
      expectedBehavior: 'Class methods correctly enforce positive inputs, manage internal item state, and compute totals with discount bounds.',
    } as GuidedLabBlock,
    {
      id: 'blk-b6-d27-04',
      type: 'INDEPENDENT_PRACTICE',
      order: 4,
      title: 'Independent Practice: Server Resource Allocation Tracker Entity',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Create a `ServerResourceNode` class managing CPU and RAM allocations with capacity limit guards.',
      starterCode: `class ServerResourceNode:
    def __init__(self, node_id, total_cpu_cores, total_ram_gb):
        self.node_id = node_id
        self.total_cpu_cores = int(total_cpu_cores)
        self.total_ram_gb = float(total_ram_gb)
        self._allocated_cpu = 0
        self._allocated_ram = 0.0
        self._active_tasks = {}

    def allocate_task(self, task_id, required_cpu, required_ram):
        # Validate positive inputs and check capacity limits
        if required_cpu <= 0 or required_ram <= 0.0 or task_id in self._active_tasks:
            return False
        if self._allocated_cpu + required_cpu > self.total_cpu_cores:
            return False
        if self._allocated_ram + required_ram > self.total_ram_gb:
            return False

        self._allocated_cpu += required_cpu
        self._allocated_ram += required_ram
        self._active_tasks[task_id] = {"cpu": required_cpu, "ram": required_ram}
        return True

    def release_task(self, task_id):
        if task_id not in self._active_tasks:
            return False
        task = self._active_tasks.pop(task_id)
        self._allocated_cpu -= task["cpu"]
        self._allocated_ram -= task["ram"]
        return True

    def get_utilization_summary(self):
        return (self._allocated_cpu, self.total_cpu_cores, self._allocated_ram, self.total_ram_gb)`,
      hints: [
        'Check both CPU and RAM capacity bounds before mutating `_allocated_cpu` and `_allocated_ram`.',
        'Store active task allocations in `self._active_tasks` dictionary to free exact amounts upon release.',
      ],
      verificationRequirements: [
        'Enforces capacity bounds and rejects over-allocation.',
        'Properly frees resources on task release.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b6-d27-05',
      type: 'KNOWLEDGE_CHECK',
      order: 5,
      title: 'Diagnostic Check: Encapsulation Conventions & State Validation',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'How does Python implement encapsulation and state protection in standard application design?',
      options: [
        'Python uses the `private` keyword to prevent the runtime from compiling unauthorized attribute access.',
        'Python developers organize state and behavior together inside classes, using methods to validate transitions and naming conventions (like a leading underscore) to signal internal state.',
        'Python converts unvalidated attribute assignments into fatal OS segfaults.',
        'Python automatically creates getters and setters for all variables defined in the class body.',
      ],
      correctIndex: 1,
      explanation: 'In Python, encapsulation is achieved by bundling data and methods together in classes. Methods act as controlled interfaces that validate inputs and guard invariants (e.g. preventing negative balances). Python relies on naming conventions (like `_balance`) rather than rigid compile-time access keywords.',
      misconceptionIdentified: 'Believing Python enforces rigid compile-time private keywords.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 28: BUILD — Composition, Ownership & Multi-Entity Modeling ────────────
export const DAY_28_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w6-006',
  dayNumber: 3,
  title: 'Object Collaboration: Composition, Ownership & Association',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b6-d28-01',
      type: 'THEORY',
      order: 1,
      title: 'Object Collaboration: Composition ("HAS-A") vs Association',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the fundamental architectural principle of object collaboration, learning to model multi-entity domain relationships using Composition (ownership/lifecycle management) and Association (independent collaboration) without unnecessary inheritance hierarchies.',
      whatItIs: 'Composition is a design relationship where a complex object contains and manages one or more component objects as part of its internal structure and lifecycle (e.g. a `CustomerOrder` owns its `OrderLineItem` entries; a line item has no independent existence outside its order). Association is a relationship where objects collaborate or reference each other, but exist independently (e.g. a `DispatchHub` or `FleetManager` coordinates `Vehicle` assets, where vehicles exist independently of any particular manager).',
      whyItExists: 'Building deep inheritance hierarchies ("IS-A") often tightly couples classes to parent implementation details. Assembling cohesive objects via composition and association provides loose coupling, clear boundaries, and straightforward testability.',
      problemSolved: 'Enables developers to model real-world domain systems with clear ownership boundaries and delegated responsibilities.',
      mentalModel: 'Composition vs Association: In Composition, the parent object owns the lifecycle and structure of its component parts (an `Order` creates, holds, and calculates over its specific `OrderLineItem` records). In Association, objects collaborate without strict lifecycle ownership (a `DispatchHub` registers and dispatches `Vehicle` assets, but each vehicle has an independent identity and lifecycle). Do not assume "manages = composition"—composition requires a meaningful ownership/lifecycle relationship.',
      realWorldUse: 'Invoices containing line items (composition), shopping carts containing cart items (composition), and dispatch hubs coordinating vehicles or drivers (association/management).',
      commonMistakes: [
        'Attempting to build deep inheritance trees for entities that simply collaborate (e.g. creating `class Order(LineItem)` instead of an Order holding a list of LineItem instances).',
        'Assuming all "HAS-A" or "manages" relationships are composition, ignoring whether component objects have an independent lifecycle.',
        'Creating bloated God objects that handle data storage, calculation, validation, and serialization all in one massive class.',
        'Failing to delegate specific operations to component entities.',
      ],
      commonMisconceptions: [
        'Misconception: "Every relationship between two classes is inheritance or composition." Reality: Objects can have simple associations or ownership compositions depending on lifecycle and domain structure.',
        'Misconception: "Inheritance is always bad and composition is always better." Reality: Choose the relationship that best reflects your domain model and maintenance requirements.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b6-d28-02',
      type: 'GUIDED_LAB',
      order: 2,
      title: 'Guided Lab: Customer Order & Line Item Composition System',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a multi-entity domain system using Composition: `OrderLineItem` component and `CustomerOrder` owner.',
      instructions: [
        'Define `OrderLineItem(sku, description, unit_price, quantity)` with `calculate_item_subtotal()`.',
        'Define `CustomerOrder(order_id, customer_email)` managing a collection of `OrderLineItem` objects.',
        'Implement `CustomerOrder.add_line_item(sku, description, price, qty)`, `CustomerOrder.calculate_order_total(tax_rate)`, and `CustomerOrder.get_item_count()`.',
      ],
      starterFiles: {
        'order_system.py': `class OrderLineItem:
    def __init__(self, sku, description, unit_price, quantity):
        self.sku = str(sku).strip()
        self.description = str(description).strip()
        self.unit_price = max(0.0, float(unit_price))
        self.quantity = max(1, int(quantity))

    def calculate_item_subtotal(self):
        return round(self.unit_price * self.quantity, 2)


class CustomerOrder:
    def __init__(self, order_id, customer_email):
        self.order_id = str(order_id).strip()
        self.customer_email = str(customer_email).strip()
        # Composition: CustomerOrder owns a collection of OrderLineItem objects
        self._line_items = []

    def add_line_item(self, sku, description, unit_price, quantity=1):
        if not sku or unit_price < 0.0 or quantity <= 0:
            return False
        item = OrderLineItem(sku, description, unit_price, quantity)
        self._line_items.append(item)
        return True

    def get_item_count(self):
        return len(self._line_items)

    def calculate_order_total(self, tax_rate=0.0):
        # Delegates subtotal calculation to each line item
        subtotal = sum(item.calculate_item_subtotal() for item in self._line_items)
        tax = subtotal * (max(0.0, float(tax_rate)) / 100.0)
        return round(subtotal + tax, 2)


# Demonstration
order = CustomerOrder("ORD-5001", "dev@example.com")
order.add_line_item("SKU-KEY-01", "Mechanical Keyboard", 120.0, 1)
order.add_line_item("SKU-CBL-02", "USB-C Braided Cable", 15.0, 2)

print("Items count:", order.get_item_count())
print("Total (5% tax):", order.calculate_order_total(5.0))`,
      },
      expectedBehavior: 'CustomerOrder composes OrderLineItem entities, delegating item subtotal calculation and aggregating order metrics.',
    } as GuidedLabBlock,
    {
      id: 'blk-b6-d28-03',
      type: 'INDEPENDENT_PRACTICE',
      order: 3,
      title: 'Independent Practice: Dispatch Hub & Vehicle Fleet Association System',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Design an association system where a `DispatchHub` manages and coordinates independent `FleetVehicle` entities, supporting dispatching and mileage tracking.',
      starterCode: `class FleetVehicle:
    def __init__(self, vin, model, max_capacity_kg):
        self.vin = str(vin).strip()
        self.model = str(model).strip()
        self.max_capacity_kg = float(max_capacity_kg)
        self.odometer_km = 0.0
        self.trips_completed = 0

    def record_trip(self, distance_km, payload_kg):
        if distance_km <= 0.0 or payload_kg > self.max_capacity_kg:
            return False
        self.odometer_km += distance_km
        self.trips_completed += 1
        return True


class DispatchHub:
    def __init__(self, hub_name):
        self.hub_name = hub_name
        # Association: DispatchHub maintains references to independent FleetVehicle entities
        self._vehicles = {}  # {vin: FleetVehicle}

    def register_vehicle(self, vin, model, max_capacity_kg):
        if not vin or vin in self._vehicles or max_capacity_kg <= 0.0:
            return False
        self._vehicles[vin] = FleetVehicle(vin, model, max_capacity_kg)
        return True

    def dispatch(self, vin, distance_km, payload_kg):
        vehicle = self._vehicles.get(vin)
        if not vehicle:
            return False
        return vehicle.record_trip(distance_km, payload_kg)

    def get_fleet_mileage(self):
        return round(sum(v.odometer_km for v in self._vehicles.values()), 2)`,
      hints: [
        'Store `FleetVehicle` instances inside `DispatchHub._vehicles` dictionary.',
        'Delegate `dispatch` operations directly to `vehicle.record_trip(distance_km, payload_kg)`.',
      ],
      verificationRequirements: [
        'Accurately delegates operations from DispatchHub to FleetVehicle entities.',
        'Properly validates capacity and calculates fleet-wide metrics.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b6-d28-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Composition, Ownership & Design Simplicity',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Why does professional software engineering favor composition and clear object responsibility over complex inheritance hierarchies? How does keeping objects small and cohesive make code easier to test and maintain?',
      guidingQuestions: [
        'How does composing objects allow you to change one component without rewriting an entire class hierarchy?',
        'Why is a small, well-defined class often better than a large class with dozens of methods?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 29: DEBUG / DEEPEN — Shared Mutable State & Method Binding Defects ────
export const DAY_29_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w6-006',
  dayNumber: 4,
  title: 'Shared Mutable State & Method Binding Defects',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b6-d29-01',
      type: 'THEORY',
      order: 1,
      title: 'Debugging Object-Oriented Systems: Class vs Instance Namespaces & Method Binding',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master diagnosing and fixing common object-oriented Python runtime defects, including shared mutable class attributes, missing self parameter TypeErrors, and un-prefixed attribute NameErrors.',
      whatItIs: 'OOP defects in Python typically stem from namespace confusion (defining mutable collections in the class body rather than on `self` inside `__init__`), method signature mismatches (omitting `self`), or scoping mistakes inside method bodies (referencing `attr` directly instead of `self.attr`).',
      whyItExists: 'In Python, instance methods receive the instance object as their first argument upon invocation. If a method header omits `self`, Python\'s method call passes an argument that the function signature was not declared to receive, raising an argument-count `TypeError`. If attributes are accessed without `self.`, Python searches local and global scopes and raises `NameError`.',
      problemSolved: 'Eliminates cross-instance data contamination, method argument mismatch errors, and attribute scoping bugs.',
      mentalModel: 'The OOP Debugging Diagnostic Process: When an OOP bug occurs, trace the exact runtime mechanism: 1) OBSERVE the exact symptom and exception type. 2) If `TypeError: takes 0 positional arguments but 1 was given` occurs on `obj.method()`, inspect if `self` is missing in the `def method(...)` signature. 3) If `NameError: name \'x\' is not defined` occurs inside a method body, check if `self.x` was intended. 4) If state unexpectedly bleeds across instances, check if mutable data was defined at class scope instead of inside `__init__`.',
      commonMistakes: [
        'Declaring mutable collections at class scope (`class Box: items = []`), causing mutations on one instance to appear on all instances upon lookup.',
        'Defining `def calculate():` instead of `def calculate(self):`, triggering a `TypeError` when called as `obj.calculate()`.',
        'Referencing `unit_price` instead of `self.unit_price` inside a method, triggering a `NameError`.',
      ],
      commonMisconceptions: [
        'Misconception: "A missing `self` raises an UnboundLocalError." Reality: Calling `obj.f()` when `def f():` is defined raises a `TypeError` because 1 argument (the instance) is passed to a function expecting 0 arguments. Referencing `self` inside a body where `self` is not a parameter raises a `NameError`.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b6-d29-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge 1: The Shared Mutable Class Attribute Defect',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A hospital patient record system uses a class where symptoms added to Patient A unexpectedly appear on Patient B.',
      symptom: 'Logical defect: Patient records cross-contaminate and share symptom lists across separate patient instances.',
      brokenArtifact: `# patient_record.py
class PatientRecord:
    # ROOT CAUSE: Mutable list defined as a class attribute!
    symptoms = []
    
    def __init__(self, patient_id, name):
        self.patient_id = patient_id
        self.name = name

    def add_symptom(self, symptom):
        self.symptoms.append(symptom)

p1 = PatientRecord("P-101", "Alice")
p2 = PatientRecord("P-102", "Bob")

p1.add_symptom("Fever")
print("P1 Symptoms:", p1.symptoms)
print("P2 Symptoms:", p2.symptoms)
# Defect: p2 has ['Fever'] because both instances look up the same class-level list!`,
      expectedBehavior: 'Initialize `self.symptoms = []` inside `__init__` so every patient instance owns an independent symptom list.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Observe where `symptoms = []` is defined. It is defined in the class body outside `__init__`, creating a single shared class attribute.',
        'Hint 2: When `p1.add_symptom("Fever")` executes, `self.symptoms` resolves to the class-level list, mutating it for all instances.',
        'Hint 3: Move `self.symptoms = []` inside `def __init__(self, patient_id, name):` and remove `symptoms = []` from the class body.',
      ],
      targetCompetencyId: COMPETENCY_ID_OOP_FOUNDATIONS,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b6-d29-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge 2: Missing self Parameter & Attribute NameError',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A warehouse inventory tracker crashes with `TypeError: calculate_valuation() takes 0 positional arguments but 1 was given` when calling an instance calculation method.',
      symptom: 'TypeError upon invoking instance method, followed by NameError if attributes are referenced without self.',
      brokenArtifact: `# inventory_item.py
class InventoryItem:
    def __init__(self, sku, unit_price, quantity):
        self.sku = sku
        self.unit_price = float(unit_price)
        self.quantity = int(quantity)

    # ROOT CAUSE 1: Missing 'self' parameter in method header!
    # Calling item.calculate_valuation() automatically passes 'item' as 1st argument, causing TypeError.
    def calculate_valuation():
        # ROOT CAUSE 2: Accessing unit_price without 'self.' causes NameError because it is not a local variable.
        return unit_price * quantity

item = InventoryItem("SKU-99", 25.0, 10)
# Crashes with: TypeError: InventoryItem.calculate_valuation() takes 0 positional arguments but 1 was given
val = item.calculate_valuation()
print("Valuation:", val)`,
      expectedBehavior: 'Define `def calculate_valuation(self):` and access attributes via `self.unit_price * self.quantity`.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: When `item.calculate_valuation()` is called, Python automatically passes `item` as the first argument. The method header must accept `self`.',
        'Hint 2: Inside the method, `unit_price` is an instance attribute, not a local variable. You must access it via `self.unit_price`.',
        'Hint 3: Update line 8 to `def calculate_valuation(self):` and line 10 to `return self.unit_price * self.quantity`.',
      ],
      targetCompetencyId: COMPETENCY_ID_OOP_FOUNDATIONS,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b6-d29-04',
      type: 'DEBUGGING_CHALLENGE',
      order: 4,
      title: 'Debugging Challenge 3: Inconsistent State from Bypassed State Validation',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A subscription system permits accounts to enter invalid negative billing days because external driver code directly modifies attributes without using validated methods.',
      symptom: 'Logical defect: Accounts enter negative days remaining and invalid status.',
      brokenArtifact: `# subscription.py
class Subscription:
    def __init__(self, user_id, plan_name):
        self.user_id = user_id
        self.plan_name = plan_name
        self.days_remaining = 30

    def renew(self, additional_days):
        if additional_days > 0:
            self.days_remaining += additional_days
            return True
        return False

# External driver code modifying state directly:
sub = Subscription("USR-42", "PRO")
# ROOT CAUSE: Direct attribute mutation bypassed invariant checks!
sub.days_remaining = -15
print(f"User {sub.user_id} Status: {sub.days_remaining} days left")`,
      expectedBehavior: 'Encapsulate consumption with a `consume_days(self, days)` method that clamps at zero and maintains valid internal state.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Direct attribute mutation bypasses business logic and creates invalid negative days.',
        'Hint 2: Implement an instance method `consume_days(self, days)` that validates `days > 0` and ensures `self.days_remaining` never drops below 0.',
        'Hint 3: Expose a helper `is_active(self)` returning `self.days_remaining > 0`.',
      ],
      targetCompetencyId: COMPETENCY_ID_OOP_FOUNDATIONS,
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 30: TRANSFER + FORMATIVE ASSESSMENT — OO Domain Processing Engine ────
export const DAY_30_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m2-w6-006',
  dayNumber: 5,
  title: 'Object-Oriented Domain Processing Engine',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b6-d30-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Fleet Logistics & Vehicle Service Dispatch Engine',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Commercial Fleet Operations & Maintenance Dispatch: Municipal transport and delivery fleets manage independent vehicles, tracking cumulative mileage, service intervals, and active dispatch trips. Software engineers use Object-Oriented Design and Composition to model entities and orchestrators that validate operations and calculate maintenance triggers.',
      task: `Design and implement an object-oriented fleet management domain engine:
\`process_fleet_operations(operations)\`

PARAMETER DATA FORMATS:
1. \`operations\`: A sequence of operation request dictionaries:
   - \`{"action": "REGISTER_VEHICLE", "vin": "V-101", "model": "Sprinter", "service_interval_km": 5000.0}\`
   - \`{"action": "RECORD_TRIP", "vin": "V-101", "distance_km": 350.0}\`
   - \`{"action": "PERFORM_SERVICE", "vin": "V-101"}\`
   - \`{"action": "SUMMARY"}\`

YOUR FUNCTION MUST PROCESS THE OPERATIONS IN SEQUENCE AND RETURN A FORMATTED EXECUTION REPORT STRING:
"""
REGISTERED_VEHICLES_COUNT: 2
TOTAL_FLEET_ODOMETER_KM: 850.0
ACTIVE_TRIPS_COMPLETED: 3
VEHICLES_NEEDING_SERVICE: 1
REJECTED_OPERATIONS: 0
PRIMARY_MAINTENANCE_VIN: V-101
"""

FUNCTIONAL & DOMAIN REQUIREMENTS:
1. OBJECT-ORIENTED ENTITY MODELING & COMPOSITION:
   - Model the domain using cohesive classes (for example, representing individual vehicle entities and a managing/coordinating object). Multiple defensible class structures and naming schemes are accepted.
   - Encapsulate entity state (such as odometer, service threshold, and distance since last service) within class instances.
2. OPERATION PROCESSING & INVARIANT ENFORCEMENT:
   - Process each operation dictionary in the exact sequence received.
   - \`"REGISTER_VEHICLE"\`:
     - Validate that \`vin\` and \`model\` are non-empty strings, and \`service_interval_km\` > 0.0.
     - If valid and VIN is not already registered: register vehicle entity.
     - Otherwise: increment rejected count.
   - \`"RECORD_TRIP"\`:
     - Validate that VIN exists and \`distance_km\` > 0.0.
     - If valid: update vehicle odometer and distance since last service, increment trips count.
     - Otherwise: increment rejected count.
   - \`"PERFORM_SERVICE"\`:
     - If VIN exists: reset distance since last service to 0.0.
     - Otherwise: increment rejected count.
3. MAINTENANCE & SUMMARY METRICS:
   - A vehicle needs service when \`distance_since_last_service >= service_interval_km\`.
   - \`VEHICLES_NEEDING_SERVICE\` = count of vehicles currently needing service.
   - \`PRIMARY_MAINTENANCE_VIN\` = VIN of the first vehicle needing service (or "NONE" if none).
4. BOUNDARY BEHAVIOR:
   - If operations sequence is empty: return 0.0 totals, 0 counts, and \`PRIMARY_MAINTENANCE_VIN: NONE\`.`,
      constraints: [
        'Apply Object-Oriented Principles: Encapsulate entity state within class instances and organize object collaboration cleanly.',
        'Zero global state: all data must pass via parameters and return values.',
        'Zero external libraries, zero type annotations in student-required code.',
        'Handle duplicate VINs, missing vehicles, and non-positive distances cleanly without unhandled crashes.',
      ],
      difficulty: 'BEGINNER',
      timeExpectationMinutes: 45,
      targetCompetencyId: COMPETENCY_ID_OOP_FOUNDATIONS,
      assessmentRef: 'asm-pfs-m2-w6-oop-001',
    } as TransferChallengeBlock,
  ],
};

// ── DAY 30 INDEPENDENT FORMATIVE ASSESSMENT ──────────────────────────────────
export const DAY_30_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m2-w6-oop-001',
  assessmentCode: 'ASM-PFS-M2-W6-OOP',
  title: 'Object-Oriented Python & Entity Modeling Formative Assessment',
  description: 'Independent formative assessment evaluating object-oriented class design, instance encapsulation, invariant protection, and composition modeling in the browser sandbox. (Formative practice assessment; not certification-grade).',
  type: 'CODE',
  mode: 'FORMATIVE',
  version: '1.0.0',
  status: 'PUBLISHED',
  difficulty: 'BEGINNER',
  timeLimitMinutes: 45,
  attemptPolicy: 'LIMITED_BEST',
  maxAttempts: 3,
  passingScore: 75,
  targetCompetencyId: COMPETENCY_ID_OOP_FOUNDATIONS,
  items: [
    {
      id: 'item-oop-01',
      assessmentId: 'asm-pfs-m2-w6-oop-001',
      version: '1.0.0',
      itemType: 'CODE',
      prompt: `Implement a modular object-oriented solution with \`process_fleet_operations(operations)\` that encapsulates vehicle entities, coordinates fleet operations, and returns the formatted execution report string. Multiple defensible class designs and naming choices are accepted.`,
      points: 100,
      order: 1,
      timeEstimateMinutes: 30,
      visibleTests: [
        {
          id: 'vt-oop-01',
          name: 'Standard Vehicle Registration, Trips and Maintenance Trigger',
          input: JSON.stringify({
            operations: [
              { action: 'REGISTER_VEHICLE', vin: 'V-101', model: 'Sprinter', service_interval_km: 5000.0 },
              { action: 'REGISTER_VEHICLE', vin: 'V-102', model: 'Transit', service_interval_km: 10000.0 },
              { action: 'RECORD_TRIP', vin: 'V-101', distance_km: 5200.0 },
              { action: 'RECORD_TRIP', vin: 'V-102', distance_km: 3000.0 },
              { action: 'SUMMARY' },
            ],
          }),
          expectedOutput: 'REGISTERED_VEHICLES_COUNT: 2\\nTOTAL_FLEET_ODOMETER_KM: 8200.0\\nACTIVE_TRIPS_COMPLETED: 2\\nVEHICLES_NEEDING_SERVICE: 1\\nREJECTED_OPERATIONS: 0\\nPRIMARY_MAINTENANCE_VIN: V-101',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-oop-02',
          name: 'Service Reset and Invalid Operation Rejection',
          input: JSON.stringify({
            operations: [
              { action: 'REGISTER_VEHICLE', vin: 'V-201', model: 'BoxTruck', service_interval_km: 4000.0 },
              { action: 'RECORD_TRIP', vin: 'V-201', distance_km: 4500.0 },
              { action: 'PERFORM_SERVICE', vin: 'V-201' },
              { action: 'RECORD_TRIP', vin: 'V-999', distance_km: 100.0 }, // Non-existent VIN
            ],
          }),
          expectedOutput: 'REGISTERED_VEHICLES_COUNT: 1\\nTOTAL_FLEET_ODOMETER_KM: 4500.0\\nACTIVE_TRIPS_COMPLETED: 1\\nVEHICLES_NEEDING_SERVICE: 0\\nREJECTED_OPERATIONS: 1\\nPRIMARY_MAINTENANCE_VIN: NONE',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-oop-01',
          name: 'Duplicate VIN Registration and Negative Distance Guards',
          input: JSON.stringify({
            operations: [
              { action: 'REGISTER_VEHICLE', vin: 'V-301', model: 'Sedan', service_interval_km: 3000.0 },
              { action: 'REGISTER_VEHICLE', vin: 'V-301', model: 'Duplicate', service_interval_km: 3000.0 }, // Duplicate
              { action: 'RECORD_TRIP', vin: 'V-301', distance_km: -50.0 }, // Negative distance
            ],
          }),
          expectedOutput: 'REGISTERED_VEHICLES_COUNT: 1\\nTOTAL_FLEET_ODOMETER_KM: 0.0\\nACTIVE_TRIPS_COMPLETED: 0\\nVEHICLES_NEEDING_SERVICE: 0\\nREJECTED_OPERATIONS: 2\\nPRIMARY_MAINTENANCE_VIN: NONE',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-oop-02',
          name: 'Empty Operations Sequence Handling',
          input: JSON.stringify({
            operations: [],
          }),
          expectedOutput: 'REGISTERED_VEHICLES_COUNT: 0\\nTOTAL_FLEET_ODOMETER_KM: 0.0\\nACTIVE_TRIPS_COMPLETED: 0\\nVEHICLES_NEEDING_SERVICE: 0\\nREJECTED_OPERATIONS: 0\\nPRIMARY_MAINTENANCE_VIN: NONE',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-oop-01',
          name: 'Anti-Hardcoding Dynamic Fleet Probe',
          input: '{"probe_vector": "DYNAMIC_FLEET_PROBE"}',
          expectedOutput: '{"dynamically_computed": true, "not_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-oop-01', name: 'FunctionalCorrectness', description: 'Accurately calculates cumulative mileage, trip counts, service triggers, and operation rejections.', weight: 0.35, maxPoints: 35 },
        { id: 'rub-oop-02', name: 'ObjectModeling', description: 'Designs cohesive, well-structured classes with clear instance attributes initialized in __init__ and clean method interfaces.', weight: 0.20, maxPoints: 20 },
        { id: 'rub-oop-03', name: 'MethodStateBehavior', description: 'Encapsulates entity state and validates state transitions against invalid inputs (e.g. non-positive distance, duplicate VIN).', weight: 0.15, maxPoints: 15 },
        { id: 'rub-oop-04', name: 'CompositionResponsibility', description: 'Coordinates objects cleanly, delegating tasks to component entities without unnecessary complexity.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-oop-05', name: 'DebuggingEdgeCases', description: 'Safely handles missing VINs, duplicate registrations, and empty operation lists without unhandled crashes.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-oop-06', name: 'CodeQuality', description: 'Readable naming, clean method organization, and clear object lifecycle logic.', weight: 0.10, maxPoints: 10 },
      ],
    },
  ],
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};

// ── BATCH 006 COMPLETE MANIFEST (DAYS 26–30) ─────────────────────────────────
export const BATCH_006_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m2-w6-006',
  batchCode: 'P1-M2-W6-BATCH006',
  title: 'Object-Oriented Python & Entity Modeling (Days 26–30)',
  difficulty: 'BEGINNER',
  days: [
    DAY_26_MANIFEST,
    DAY_27_MANIFEST,
    DAY_28_MANIFEST,
    DAY_29_MANIFEST,
    DAY_30_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};
