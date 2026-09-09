// src/lib/curriculum/pythonFullStack/batch004.ts
// Single Source of Truth for PINIT BATCH 004: Month 1 · Week 4 · Days 16–20
// Python Built-In Data Structures: Lists, Tuples, Dictionaries & Sets
// Pedagogical Flow: UNDERSTAND (Lists) -> APPLY (Tuples) -> BUILD (Dictionaries) -> DEBUG (Sets/Aliasing) -> TRANSFER (Data Structure Selection)

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

export const COMPETENCY_ID_DATA_STRUCTURES = 'comp-pfs-m1-004';

// ── DAY 16: UNDERSTAND — Lists: Ordered Mutable Sequences ─────────────────────
export const DAY_16_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w4-004',
  dayNumber: 1,
  title: 'Lists: Ordered Mutable Sequences',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b4-d16-01',
      type: 'THEORY',
      order: 1,
      title: 'Lists as Ordered Mutable Sequences: Mutation vs Rebinding & Aliasing',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand Python lists as ordered, mutable sequence objects, mastering the critical distinction between in-place mutation and name rebinding, and understanding reference aliasing.',
      whatItIs: 'A list is an ordered, mutable sequence of heterogeneous object references. Elements are accessible by zero-based integer indices and negative indices (e.g. -1 for the last element). In Python, lists can be modified in-place using methods like append, insert, remove, pop, and extend, or via slice assignment.',
      whyItExists: 'Software applications need collections that can grow, shrink, and rearrange dynamically as program state changes over time.',
      problemSolved: 'Allows programs to store, sort, filter, and modify variable numbers of data items in a predictable sequential order.',
      mentalModel: 'Mutation vs Rebinding Mental Model: Think of a list object as a physical whiteboard. In-place mutation (e.g. `items.append("C")`) writes a new line on the existing whiteboard; any person looking at that same whiteboard immediately sees the update. In contrast, name rebinding (e.g. `items = ["X", "Y"]`) walks away from the old whiteboard and points the variable label to a brand new whiteboard in a different room.',
      realWorldUse: 'Managing queues, ordered event logs, processing pipelines, shopping carts, and dynamic data collections in web backends.',
      commonMistakes: [
        'Confusing in-place mutation with rebinding (e.g. assigning `items = items.append("X")`, which sets `items` to `None` because `.append()` returns `None`).',
        'Assuming variable assignment copies a list (e.g. `b = a` creates an alias to the same list object, so mutating `b` also modifies `a`).',
        'Attempting to access an index beyond `len(list) - 1`, raising an `IndexError`.',
      ],
      commonMisconceptions: [
        'Misconception: "Assigning a = b creates a duplicate copy of the list." Reality: It binds a second variable name to the exact same list object in memory (aliasing).',
        'Misconception: "Slicing creates a deep recursive copy." Reality: Slicing (`items[1:3]`) constructs a new shallow outer list containing references to the selected elements; nested mutable objects (if any) remain shared.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b4-d16-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'List Operations, In-Place Mutation, Slicing & Shallow Copy Aliasing Trace',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating list indexing, slicing as shallow outer list copies, in-place mutation vs name rebinding, and observing reference aliasing.',
      language: 'python',
      codeSnippet: `# 1. Creating a list, indexing and negative indexing
tasks = ["Setup DB", "Write Tests", "Build API", "Deploy App"]
print("First task:", tasks[0])
print("Last task:", tasks[-1])

# 2. Slicing creates a NEW outer list (shallow copy)
mid_tasks = tasks[1:3]
print("Mid tasks (slice copy):", mid_tasks)

# 3. In-place mutation: Modifies existing list object
tasks.append("Monitor Logs")
tasks.insert(1, "Review PR")
print("Tasks after in-place mutation:", tasks)

# 4. In-Place Mutation vs Rebinding
# A: In-place mutation
original_list = [10, 20]
alias_ref = original_list  # Both point to the SAME list object
alias_ref.append(30)
print("Original list after alias mutated:", original_list)  # [10, 20, 30]

# B: Rebinding name
alias_ref = [100, 200]  # alias_ref points to a NEW list
print("Original list after alias rebound:", original_list)  # Still [10, 20, 30]`,
      expectedOutput: `First task: Setup DB
Last task: Deploy App
Mid tasks (slice copy): ['Write Tests', 'Build API']
Tasks after in-place mutation: ['Setup DB', 'Review PR', 'Write Tests', 'Build API', 'Deploy App', 'Monitor Logs']
Original list after alias mutated: [10, 20, 30]
Original list after alias rebound: [10, 20, 30]`,
    } as ExampleBlock,
    {
      id: 'blk-b4-d16-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Interactive List Tracing & Aliasing Prediction Drills',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Predict the exact contents of `list_a` and `list_b` at each stage of execution.',
        'Implement `filter_positive_readings(readings)` that returns a new list containing only positive numbers, leaving the input list unmutated.',
        'Implement `trim_extremes(items)` that removes the first and last elements in-place using `.pop()`.',
      ],
      starterCode: `# Part 1: Aliasing Trace Prediction
list_x = [1, 2, 3]
list_y = list_x
list_y.append(4)
list_z = list_x[:]  # Slice copy
list_z.append(99)

print("list_x:", list_x)
print("list_y:", list_y)
print("list_z:", list_z)

# Part 2: Pure function returning a new list
def filter_positive_readings(readings):
    positive_items = []
    for val in readings:
        if val > 0.0:
            positive_items.append(val)
    return positive_items

# Part 3: In-place trimming
def trim_extremes(items):
    if len(items) >= 2:
        items.pop(0)
        items.pop()
    return items`,
      hints: [
        '`list_y` is an alias to `list_x`, so `list_x` contains `[1, 2, 3, 4]`.',
        '`list_z` is an independent slice copy, so appending 99 to `list_z` does not affect `list_x`.',
      ],
      expectedOutcome: 'Learner correctly traces mutation vs rebinding and distinguishes aliased variables from independent slice copies.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b4-d16-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic Check: In-Place Method Return Value Trap',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'A junior developer writes the following script:\n```python\nservers = ["srv-alpha", "srv-beta"]\nservers = servers.append("srv-gamma")\nprint(servers[0])\n```\nWhat happens when this script executes, and why?',
      options: [
        'It prints "srv-alpha" successfully.',
        'It raises a TypeError: \'NoneType\' object is not subscriptable, because .append() mutates the list in-place and returns None.',
        'It prints "srv-gamma" because append replaces the list.',
        'It raises an IndexError because the list was emptied.',
      ],
      correctIndex: 1,
      explanation: 'In Python, list mutation methods such as `.append()`, `.sort()`, and `.reverse()` modify the underlying list object in-place and return `None`. Assigning `servers = servers.append("srv-gamma")` rebinds `servers` to `None`. Attempting `servers[0]` on line 3 then fails with `TypeError: \'NoneType\' object is not subscriptable`. The correct code is simply `servers.append("srv-gamma")`.',
      misconceptionIdentified: 'Believing that in-place mutating list methods return the modified list.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b4-d16-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Official Documentation & Sequence Standards',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Tutorial: More on Lists',
          url: 'https://docs.python.org/3/tutorial/datastructures.html#more-on-lists',
          description: 'Official Python reference for list methods, indexing, and sequence operations.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 17: APPLY — Tuples + Sequence Concepts ────────────────────────────────
export const DAY_17_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w4-004',
  dayNumber: 2,
  title: 'Tuples + Sequence Concepts',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b4-d17-01',
      type: 'THEORY',
      order: 1,
      title: 'Tuples, Sequence Behavior, Packing/Unpacking & Container Immutability Nuance',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master tuples as ordered, immutable sequence containers, learn packing and sequence unpacking, and understand the nuance of container immutability vs contained mutable objects.',
      whatItIs: 'A tuple is an ordered, immutable sequence container. It is constructed using parentheses `(1, 2, 3)` or comma separation `1, 2, 3`. A singleton (single-item) tuple requires a trailing comma `(42,)`. Like lists, tuples support zero-based indexing, negative indexing, slicing, iteration, `len()`, and `in` membership testing.',
      whyItExists: 'Tuples represent fixed records and structured groupings of data that should not be accidentally modified during program execution.',
      problemSolved: 'Provides read-only integrity for fixed structured data (e.g. database rows, coordinates, status pairs) and enables clean sequence unpacking.',
      mentalModel: 'Container Immutability Nuance: The tuple container itself is immutable (its sequence of object references cannot be added, removed, or reassigned). However, if a tuple contains a reference to a mutable object (like a list), the contents of that mutable object can still change. Immutability belongs to the tuple structure, not necessarily to every object referenced inside it.',
      commonMistakes: [
        'Attempting to reassign an element of a tuple (e.g. `point[0] = 50` raises `TypeError: \'tuple\' object does not support item assignment`).',
        'Creating a single-element tuple without a comma (e.g. `x = (42)` creates an `int`, while `x = (42,)` creates a `tuple`).',
        'Unpacking into a mismatched number of variables (e.g. `a, b = (1, 2, 3)` raises `ValueError: too many values to unpack`).',
      ],
      commonMisconceptions: [
        'Misconception: "Tuples make everything inside them completely immutable." Reality: The tuple container itself is immutable, but it may hold references to mutable objects (like lists) whose internal contents can still be mutated.',
        'Misconception: "Parentheses make a tuple." Reality: In Python, the comma is what actually constructs a tuple in most contexts (except the empty tuple `()`).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b4-d17-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Tuple Creation, Sequence Unpacking & Contained Mutability Nuance',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating tuple syntax, singleton tuples, sequence unpacking, and the nuance of mutable objects inside an immutable tuple container.',
      language: 'python',
      codeSnippet: `# 1. Tuple Creation & Singleton Comma Rule
empty_tup = ()
singleton_int = (42)    # Just an integer with grouping parentheses
singleton_tup = (42,)   # A genuine 1-element tuple
print("Type singleton_int:", type(singleton_int))
print("Type singleton_tup:", type(singleton_tup))

# 2. Tuple Packing and Sequence Unpacking
location = 37.7749, -122.4194  # Tuple packing (comma syntax)
lat, lon = location            # Sequence unpacking
print(f"Latitude: {lat}, Longitude: {lon}")

# 3. Shared Sequence Operations
print("Tuple length:", len(location))
print("First coordinate:", location[0])
print("Is 37.7749 in location?", 37.7749 in location)

# 4. Container Immutability Nuance
# The tuple container cannot be reassigned, but contained mutable lists CAN be mutated!
student_record = ("Alice", [90, 95])
print("Initial record:", student_record)

# student_record[0] = "Bob" -> TypeError (Tuple container is immutable)
# Mutating the list INSIDE the tuple:
student_record[1].append(100)
print("Record after contained list mutation:", student_record)`,
      expectedOutput: `Type singleton_int: <class 'int'>
Type singleton_tup: <class 'tuple'>
Latitude: 37.7749, Longitude: -122.4194
Tuple length: 2
First coordinate: 37.7749
Is 37.7749 in location? True
Initial record: ('Alice', [90, 95])
Record after contained list mutation: ('Alice', [90, 95, 100])`,
    } as ExampleBlock,
    {
      id: 'blk-b4-d17-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Processing Fixed Waypoints & Transaction Records',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a waypoint route calculation module using immutable coordinate tuples.',
      instructions: [
        'Define `create_waypoint(name, lat, lon)` returning a fixed tuple `(name, lat, lon)`.',
        'Define `unpack_coordinates(waypoint)` that unpacks and returns `(lat, lon)`.',
        'Define `calculate_manhattan_distance(pt1, pt2)` using coordinate unpacking.',
      ],
      starterFiles: {
        'route_tracker.py': `# Waypoint & Route Tracker using Tuples

def create_waypoint(name, lat, lon):
    return (name, float(lat), float(lon))

def unpack_coordinates(waypoint):
    name, lat, lon = waypoint
    return (lat, lon)

def calculate_manhattan_distance(pt1, pt2):
    lat1, lon1 = pt1
    lat2, lon2 = pt2
    return round(abs(lat1 - lat2) + abs(lon1 - lon2), 4)

# Demonstration
wp1 = create_waypoint("Warehouse A", 12.9716, 77.5946)
wp2 = create_waypoint("Hub B", 13.0827, 80.2707)

coord1 = unpack_coordinates(wp1)
coord2 = unpack_coordinates(wp2)
dist = calculate_manhattan_distance(coord1, coord2)

print("Waypoint 1:", wp1)
print("Distance between coords:", dist)`,
      },
      expectedBehavior: 'Correctly construct tuples, unpack fields cleanly, and perform distance calculations without mutating coordinate pairs.',
    } as GuidedLabBlock,
    {
      id: 'blk-b4-d17-04',
      type: 'INDEPENDENT_PRACTICE',
      order: 4,
      title: 'Independent Practice: Transaction Ledger Checkpoint Processor',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Design functions to validate and process transaction checkpoints represented as `(tx_id, sender, receiver, amount, status)` tuples.',
      starterCode: `def create_transaction(tx_id, sender, receiver, amount, status):
    # TODO: Return immutable tuple (tx_id, sender, receiver, float(amount), status)
    pass

def is_settled(transaction_tuple):
    # TODO: Unpack status and return True if status == "SETTLED"
    pass

def extract_transfer_parties(transaction_tuple):
    # TODO: Unpack and return (sender, receiver) tuple
    pass`,
      hints: [
        'Return tuples directly with parentheses `(tx_id, sender, receiver, float(amount), status)`.',
        'Use sequence unpacking: `tx_id, sender, receiver, amount, status = transaction_tuple`.',
      ],
      verificationRequirements: [
        'Creates valid 5-element tuples.',
        'Correctly unpacks fields and filters settled transactions.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b4-d17-05',
      type: 'KNOWLEDGE_CHECK',
      order: 5,
      title: 'Diagnostic Check: Singleton Tuple vs Grouping Parentheses',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Consider the two assignments:\n```python\na = (500)\nb = (500,)\n```\nWhat are the types of `a` and `b`, and why?',
      options: [
        'Both `a` and `b` are tuples of length 1.',
        '`a` is an int (parentheses used for grouping), while `b` is a tuple of length 1 (trailing comma designates a singleton tuple).',
        '`a` is a tuple, while `b` raises a SyntaxError due to the trailing comma.',
        'Both `a` and `b` are ints.',
      ],
      correctIndex: 1,
      explanation: 'In Python syntax, parentheses around a single expression without a comma are interpreted as arithmetic grouping parentheses, so `a = (500)` evaluates to the integer `500`. To create a single-element (singleton) tuple, a trailing comma is required: `b = (500,)` creates a tuple with 1 element.',
      misconceptionIdentified: 'Believing parentheses alone create a tuple without the required trailing comma.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 18: BUILD — Dictionaries: Key → Value Mapping ─────────────────────────
export const DAY_18_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w4-004',
  dayNumber: 3,
  title: 'Dictionaries: Key → Value Mapping',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b4-d18-01',
      type: 'THEORY',
      order: 1,
      title: 'Dictionaries: Key-Value Association, Hashability & Efficient Lookup',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand Python dictionaries as mutable mappings from unique, hashable keys to values, mastering lookup, insertion, updates, deletions, and dictionary iteration.',
      whatItIs: 'A dictionary is a mutable mapping container that stores associations between keys and values (`{key: value}`). Keys must be unique and hashable (e.g. strings, integers, floats, tuples containing only immutable items; lists cannot be dictionary keys). Values can be any arbitrary Python object.',
      whyItExists: 'Sequences require integer indexing (0, 1, 2...), but real-world data is naturally identified by meaningful names, IDs, codes, or identifiers.',
      problemSolved: 'Provides fast key-based retrieval, structured entity records, and dynamic association without scanning linearly through a sequence.',
      mentalModel: 'Dictionary Lookup Efficiency Mental Model: Dictionary lookup is designed to be efficient and is typically O(1) on average under normal hash-table behavior. Think of a dictionary as an indexed physical address book: when you have a specific name (key), you can jump directly to the exact entry rather than reading the entire book page by page.',
      realWorldUse: 'User profile records, configuration tables, caching layers, database record representations, and API payloads.',
      commonMistakes: [
        'Using a mutable list as a dictionary key (e.g. `d[[1, 2]] = "data"` raises `TypeError: unhashable type: \'list\'`).',
        'Directly accessing a non-existent key with `d[key]`, raising a `KeyError` instead of using `d.get(key, default)`.',
        'Confusing a Python dictionary with JSON (a dictionary is an in-memory runtime mapping object; JSON is a text format).',
      ],
      commonMisconceptions: [
        'Misconception: "Dictionary lookup is guaranteed to be O(1) in every conceivable circumstance." Reality: Lookup is designed to be efficient and is typically O(1) on average under normal hash-table behavior, but worst-case workloads and implementation factors can vary.',
        'Misconception: "Dictionaries allow duplicate keys." Reality: Assigning to an existing key simply updates/overwrites its value; duplicate keys are not stored.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b4-d18-02',
      type: 'GUIDED_LAB',
      order: 2,
      title: 'Guided Build: In-Memory Device Telemetry & Inventory Registry CLI',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a modular in-memory device registry CLI using dictionaries and pure helper functions.',
      instructions: [
        'Implement `register_device(registry, device_id, model, ip_address, status)` inserting a record.',
        'Implement `lookup_device(registry, device_id)` returning the device dictionary or None.',
        'Implement `update_device_status(registry, device_id, new_status)` updating status safely.',
        'Implement `remove_device(registry, device_id)` deleting a record if present.',
        'Implement `calculate_status_counts(registry)` counting devices per status using a dictionary.',
      ],
      starterFiles: {
        'device_registry.py': `# Device Registry Manager using Dictionaries

def create_registry():
    return {}

def register_device(registry, device_id, model, ip_address, status="ONLINE"):
    if not device_id:
        return False
    registry[device_id] = {
        "model": model,
        "ip": ip_address,
        "status": status,
    }
    return True

def lookup_device(registry, device_id):
    return registry.get(device_id, None)

def update_device_status(registry, device_id, new_status):
    if device_id in registry:
        registry[device_id]["status"] = new_status
        return True
    return False

def remove_device(registry, device_id):
    if device_id in registry:
        del registry[device_id]
        return True
    return False

def calculate_status_counts(registry):
    counts = {}
    for dev_id, info in registry.items():
        st = info.get("status", "UNKNOWN")
        counts[st] = counts.get(st, 0) + 1
    return counts

# Demonstration
reg = create_registry()
register_device(reg, "DEV-101", "Edge-Sensor", "192.168.1.10", "ONLINE")
register_device(reg, "DEV-102", "Gateway", "192.168.1.1", "MAINTENANCE")
register_device(reg, "DEV-103", "Edge-Sensor", "192.168.1.11", "ONLINE")

print("Lookup DEV-101:", lookup_device(reg, "DEV-101"))
print("Status Counts:", calculate_status_counts(reg))`,
      },
      expectedBehavior: 'Modular functions correctly manage dictionary entries, lookup records safely, and aggregate counts using `.items()` and `.get()`.',
    } as GuidedLabBlock,
    {
      id: 'blk-b4-d18-03',
      type: 'INDEPENDENT_PRACTICE',
      order: 3,
      title: 'Independent Practice: Warehouse Product Stock & Reorder Tracker',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Implement a dictionary-backed stock manager with `add_product(stock_db, sku, name, quantity, unit_price)`, `restock(stock_db, sku, amount)`, and `compute_total_inventory_value(stock_db)`.',
      starterCode: `def add_product(stock_db, sku, name, quantity, unit_price):
    # TODO: Store product details in stock_db dictionary keyed by sku
    pass

def restock(stock_db, sku, amount):
    # TODO: If sku exists, add amount to quantity; return updated quantity
    pass

def compute_total_inventory_value(stock_db):
    # TODO: Iterate through products and calculate sum(quantity * unit_price)
    pass`,
      hints: [
        'Structure product data as nested dictionary `{sku: {"name": name, "qty": quantity, "price": unit_price}}`.',
        'Use `for sku, item in stock_db.items():` to iterate through records.',
      ],
      verificationRequirements: [
        'Correctly stores and updates inventory records.',
        'Accurately calculates total inventory valuation.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b4-d18-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Why Hashability Governs Dictionary Keys',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Why does Python forbid mutable lists from being used as dictionary keys, while immutable strings, integers, and tuples are allowed? What would happen if a dictionary key could be mutated after being inserted?',
      guidingQuestions: [
        'How does a dictionary locate where a key is stored in memory?',
        'If a key object was modified after insertion, what would happen to its hash value and subsequent lookups?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 19: DEBUG / DEEPEN — Sets + Mutable Collection Debugging ───────────────
export const DAY_19_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w4-004',
  dayNumber: 4,
  title: 'Sets + Mutable Collection Debugging',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b4-d19-01',
      type: 'THEORY',
      order: 1,
      title: 'Sets: Unordered Uniqueness, Set Algebra & Reference Mutation Traps',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn sets as unordered collections of unique elements, master set operations (union, intersection, difference), and debug collection aliasing and mutation defects.',
      whatItIs: 'A set is an unordered collection of distinct, hashable elements (`set()`, `{1, 2, 3}`). Sets automatically eliminate duplicate entries. Elements can be added with `.add()`, removed with `.remove()` (raises KeyError if missing) or `.discard()` (silent if missing). Sets support mathematical set operations: union (`|`), intersection (`&`), difference (`-`), and symmetric difference (`^`).',
      whyItExists: 'Many engineering problems require tracking unique entities, membership testing, and computing mathematical set relationships without duplicate entries.',
      problemSolved: 'Eliminates duplicates automatically, provides fast membership testing (`in`), and calculates overlaps and differences between collections.',
      mentalModel: 'Sets Are Unordered Collections: Sets do NOT provide sequence indexing (`s[0]` raises `TypeError: \'set\' object is not subscriptable`) and do NOT guarantee a stable iteration or display order. Think of a set as a bag of unique tagged marbles: you can check if a marble is in the bag or dump them out, but there is no "first" or "second" marble.',
      commonMistakes: [
        'Attempting to index or slice a set (e.g. `my_set[0]` raises `TypeError: \'set\' object is not subscriptable`).',
        'Using `{}` to create an empty set (in Python, `{}` creates an empty dictionary; use `set()` for an empty set).',
        'Assuming a set preserves insertion order or allows duplicate values.',
      ],
      commonMisconceptions: [
        'Misconception: "Sets are random." Reality: Sets are deterministic hash-based collections, but they are unordered and do not provide sequence indexing or guaranteed display order.',
        'Misconception: "Aliased collections inside functions are isolated." Reality: Passing a mutable list or dictionary into a function passes a reference; mutating it inside the function mutates the caller\'s object.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b4-d19-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge 1: The Shared List Alias Defect',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A warehouse dispatch system copies an active orders list using simple assignment. Mutating the local active queue unexpectedly modifies the master pending queue.',
      symptom: 'Master pending queue contains dispatched items that should have been processed in isolation.',
      brokenArtifact: `# order_dispatch.py
def process_urgent_dispatches(master_pending_orders):
    # DEFECT: Simple assignment 'urgent_queue = master_pending_orders' creates an ALIAS, not a copy!
    urgent_queue = master_pending_orders
    urgent_queue.append("ORDER-URGENT-99")
    return urgent_queue

master_orders = ["ORDER-101", "ORDER-102"]
print("Master before:", master_orders)
dispatched = process_urgent_dispatches(master_orders)
print("Master after dispatch:", master_orders)
# Defect: master_orders was mutated and now contains ORDER-URGENT-99!`,
      expectedBehavior: 'Create an independent shallow copy list (e.g. `urgent_queue = master_pending_orders[:]` or `list(master_pending_orders)`), leaving the caller\'s master list unmutated.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: In Python, `urgent_queue = master_pending_orders` does NOT duplicate the list. Both names point to the exact same list object in memory.',
        'Hint 2: When `urgent_queue.append(...)` runs, it mutates the shared list object directly.',
        'Hint 3: Fix by creating a new slice copy: `urgent_queue = master_pending_orders[:]` or `list(master_pending_orders)`.',
      ],
      targetCompetencyId: COMPETENCY_ID_DATA_STRUCTURES,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b4-d19-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge 2: The Set Indexing & Unintended Deduplication Trap',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A conference ticketing script attempts to retrieve the first attendee using index `[0]` on a set, and loses total ticket count because duplicate attendee names were collapsed.',
      symptom: 'TypeError: \'set\' object is not subscriptable on line 7 and ticket count mismatch.',
      brokenArtifact: `# event_tickets.py
def register_attendees(raw_attendee_entries):
    # DEFECT: Developer used a set for attendees, but the application needs:
    # 1. To preserve the chronological registration order
    # 2. To allow multiple tickets bought under the same name
    attendees = set(raw_attendee_entries)
    
    # DEFECT: Sets do not support indexing!
    first_attendee = attendees[0]
    total_tickets = len(attendees)
    return first_attendee, total_tickets

entries = ["Alice", "Bob", "Alice", "Charlie"]
first, count = register_attendees(entries)
print(f"First: {first}, Total: {count}")`,
      expectedBehavior: 'Refactor function to use a list when order and duplicate ticket purchases must be preserved, and use a set only when computing unique attendee counts.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Look at line 6: `attendees[0]`. In Python, sets are unordered collections and do NOT support sequence indexing.',
        'Hint 2: Look at line 5: `set(raw_attendee_entries)` automatically drops the duplicate "Alice", reducing the ticket count from 4 to 3.',
        'Hint 3: Use a list for the ticket order and total ticket count; use `set()` only if calculating unique attendees.',
      ],
      targetCompetencyId: COMPETENCY_ID_DATA_STRUCTURES,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b4-d19-04',
      type: 'DEBUGGING_CHALLENGE',
      order: 4,
      title: 'Debugging Challenge 3: Dictionary Key Collision & Overwrite Bug',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A customer ledger uses the customer\'s first name as a dictionary key. When two customers share the name "Alex", the second customer\'s balance overwrites the first customer\'s balance.',
      symptom: 'Earlier customer balance data is lost due to key collision.',
      brokenArtifact: `# customer_ledger.py
def record_customer_balance(ledger, customer_id, name, balance):
    # DEFECT: Using 'name' as key causes collisions when multiple customers share the same name!
    # "Alex" with customer_id C101 gets overwritten when "Alex" with customer_id C205 is recorded.
    ledger[name] = balance
    return ledger

ledger = {}
record_customer_balance(ledger, "C101", "Alex", 150.0)
record_customer_balance(ledger, "C205", "Alex", 320.0)
print("Ledger:", ledger)
# Defect: Ledger only has 1 record for "Alex" ($320.0), C101 was destroyed!`,
      expectedBehavior: 'Use unique customer_id as the dictionary key (e.g. `ledger[customer_id] = {"name": name, "balance": balance}`), eliminating collisions.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Dictionary keys must be unique. When `ledger["Alex"] = 320.0` is executed, it overwrites the existing entry for "Alex".',
        'Hint 2: Customer names are not guaranteed to be unique. What unique identifier was passed in the parameters?',
        'Hint 3: Key the dictionary by `customer_id` and store a sub-dictionary or tuple containing the name and balance.',
      ],
      targetCompetencyId: COMPETENCY_ID_DATA_STRUCTURES,
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 20: TRANSFER + ASSESSMENT — Choosing the Right Data Structure ─────────
export const DAY_20_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w4-004',
  dayNumber: 5,
  title: 'Choosing the Right Data Structure',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b4-d20-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Multi-Entity Fleet Logistics & Hub Fulfillment Engine',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Multi-Entity Supply Chain & Logistics Hub Optimization: Regional distribution centers receive multi-entity event streams containing warehouse inventory, shipment queues, geographic coordinates, and service destination hubs. Engineering teams must select and apply appropriate built-in data structures based on data access patterns, ordering requirements, uniqueness constraints, and mutability implications.',
      task: `Design and implement an integrated logistics data processing engine:
\`process_logistics_hub(inventory_records, dispatch_queue, allowed_hubs)\`

PARAMETER DATA FORMATS:
1. \`inventory_records\`: A sequence of item records \`(sku, name, quantity, unit_price)\`.
   Example: \`[("SKU-1", "Screws", 100, 0.50), ("SKU-2", "Bolts", 50, 1.20)]\`
2. \`dispatch_queue\`: A sequence of dispatch records \`(shipment_id, sku, requested_qty, destination_hub, coords)\` where \`coords\` is a coordinate pair \`(lat, lon)\`.
   Example: \`[("SH-01", "SKU-1", 20, "NORTH_HUB", (12.5, 77.2)), ("SH-02", "SKU-2", 60, "EAST_HUB", (13.1, 77.8))]\`
3. \`allowed_hubs\`: A collection of authorized destination hub identifiers.
   Example: \`["NORTH_HUB", "SOUTH_HUB", "EAST_HUB", "WEST_HUB"]\`

YOUR FUNCTION MUST RETURN A FORMATTED REPORT STRING:
"""
TOTAL_INVENTORY_VALUE: 110.0
FULFILLED_DISPATCHES: 1
UNFULFILLED_DISPATCHES: 1
UNIQUE_SERVED_HUBS: 1
UNSERVED_ALLOWED_HUBS: 3
PRIMARY_DEFICIT_SKU: SKU-2
"""

FUNCTIONAL & DOMAIN REQUIREMENTS:
1. INVENTORY VALUATION & STOCK TRACKING:
   - Calculate \`TOTAL_INVENTORY_VALUE\` = sum of initial \`(quantity * unit_price)\` across all inventory items (rounded to 2 decimal places).
   - Efficiently lookup and update item stock levels during dispatch fulfillment.
2. DISPATCH ORDER & FULFILLMENT:
   - Process dispatches in the exact order received in \`dispatch_queue\`.
   - A dispatch is fulfilled ONLY IF its \`destination_hub\` is an authorized hub in \`allowed_hubs\` AND the requested SKU exists in inventory with sufficient stock (\`quantity >= requested_qty\`).
   - When fulfilled:
     - Deduct \`requested_qty\` from available inventory.
     - Increment \`FULFILLED_DISPATCHES\`.
     - Record \`destination_hub\` as a served hub.
   - Otherwise:
     - Increment \`UNFULFILLED_DISPATCHES\`.
     - If the failure was due to insufficient stock (or missing SKU), track the first unfulfilled SKU as \`PRIMARY_DEFICIT_SKU\`.
3. HUB METRICS & UNMET CAPACITY:
   - Determine \`UNIQUE_SERVED_HUBS\` = count of unique served hubs.
   - Determine \`UNSERVED_ALLOWED_HUBS\` = count of authorized hubs that were never served.
4. BOUNDARY & EDGE BEHAVIOR:
   - If no deficit SKU occurred, report \`PRIMARY_DEFICIT_SKU: NONE\`.
   - If all input sequences are empty, report 0.0 value, 0 counts, and \`PRIMARY_DEFICIT_SKU: NONE\`.`,
      constraints: [
        'Select and apply appropriate built-in data structures based on domain requirements (e.g. key lookups, sequence order, uniqueness, mutability). Multiple defensible designs are acceptable.',
        'Zero global state: all data must pass via parameters and returns.',
        'Zero classes, zero file I/O, zero external libraries.',
        'Handle empty collections and missing item keys gracefully.',
      ],
      difficulty: 'BEGINNER',
      timeExpectationMinutes: 45,
      targetCompetencyId: COMPETENCY_ID_DATA_STRUCTURES,
      assessmentRef: 'asm-pfs-m1-w4-ds-001',
    } as TransferChallengeBlock,
  ],
};

// ── DAY 20 INDEPENDENT FORMATIVE ASSESSMENT ──────────────────────────────────
export const DAY_20_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m1-w4-ds-001',
  assessmentCode: 'ASM-PFS-M1-W4-DS',
  title: 'Choosing the Right Data Structure — Integrated Data Processing Assessment',
  description: 'Independent formative assessment evaluating architectural data structure selection (Lists, Tuples, Dictionaries, Sets), reference mutability reasoning, key-value modeling, and set algebra in the browser sandbox.',
  type: 'CODE',
  mode: 'FORMATIVE',
  version: '1.0.0',
  status: 'PUBLISHED',
  difficulty: 'BEGINNER',
  timeLimitMinutes: 45,
  attemptPolicy: 'LIMITED_BEST',
  maxAttempts: 3,
  passingScore: 75,
  targetCompetencyId: COMPETENCY_ID_DATA_STRUCTURES,
  items: [
    {
      id: 'item-ds-01',
      assessmentId: 'asm-pfs-m1-w4-ds-001',
      version: '1.0.0',
      itemType: 'CODE',
      prompt: `Implement a modular solution with \`process_logistics_hub(inventory_records, dispatch_queue, allowed_hubs)\` that selects and applies appropriate built-in data structures to process inventory, dispatches, and hub metrics, returning the formatted operations summary string.`,
      points: 100,
      order: 1,
      timeEstimateMinutes: 30,
      visibleTests: [
        {
          id: 'vt-ds-01',
          name: 'Standard Normal Logistics Hub Fulfillment',
          input: JSON.stringify({
            inventory_records: [
              ['SKU-1', 'Screws', 100, 0.50],
              ['SKU-2', 'Bolts', 50, 1.20],
            ],
            dispatch_queue: [
              ['SH-01', 'SKU-1', 20, 'NORTH_HUB', [12.5, 77.2]],
              ['SH-02', 'SKU-2', 60, 'EAST_HUB', [13.1, 77.8]],
            ],
            allowed_hubs: ['NORTH_HUB', 'SOUTH_HUB', 'EAST_HUB', 'WEST_HUB'],
          }),
          expectedOutput: 'TOTAL_INVENTORY_VALUE: 110.0\\nFULFILLED_DISPATCHES: 1\\nUNFULFILLED_DISPATCHES: 1\\nUNIQUE_SERVED_HUBS: 1\\nUNSERVED_ALLOWED_HUBS: 3\\nPRIMARY_DEFICIT_SKU: SKU-2',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-ds-02',
          name: 'All Dispatches Fulfilled & Optimal Stock',
          input: JSON.stringify({
            inventory_records: [
              ['SKU-10', 'Generators', 10, 500.0],
              ['SKU-20', 'Cables', 100, 5.0],
            ],
            dispatch_queue: [
              ['SH-11', 'SKU-10', 2, 'SOUTH_HUB', [10.0, 75.0]],
              ['SH-12', 'SKU-20', 30, 'NORTH_HUB', [11.0, 76.0]],
            ],
            allowed_hubs: ['NORTH_HUB', 'SOUTH_HUB'],
          }),
          expectedOutput: 'TOTAL_INVENTORY_VALUE: 5500.0\\nFULFILLED_DISPATCHES: 2\\nUNFULFILLED_DISPATCHES: 0\\nUNIQUE_SERVED_HUBS: 2\\nUNSERVED_ALLOWED_HUBS: 0\\nPRIMARY_DEFICIT_SKU: NONE',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-ds-01',
          name: 'Unauthorized Destination Hub Rejection',
          input: JSON.stringify({
            inventory_records: [
              ['SKU-A', 'Solar Panels', 50, 100.0],
            ],
            dispatch_queue: [
              ['SH-99', 'SKU-A', 10, 'UNAUTHORIZED_HUB', [0.0, 0.0]],
            ],
            allowed_hubs: ['MAIN_HUB'],
          }),
          expectedOutput: 'TOTAL_INVENTORY_VALUE: 5000.0\\nFULFILLED_DISPATCHES: 0\\nUNFULFILLED_DISPATCHES: 1\\nUNIQUE_SERVED_HUBS: 0\\nUNSERVED_ALLOWED_HUBS: 1\\nPRIMARY_DEFICIT_SKU: NONE',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-ds-02',
          name: 'Empty Inventory & Empty Queue Resilience',
          input: JSON.stringify({
            inventory_records: [],
            dispatch_queue: [],
            allowed_hubs: ['HUB-1', 'HUB-2'],
          }),
          expectedOutput: 'TOTAL_INVENTORY_VALUE: 0.0\\nFULFILLED_DISPATCHES: 0\\nUNFULFILLED_DISPATCHES: 0\\nUNIQUE_SERVED_HUBS: 0\\nUNSERVED_ALLOWED_HUBS: 2\\nPRIMARY_DEFICIT_SKU: NONE',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-ds-01',
          name: 'Anti-Hardcoding Dynamic Logistics Stream Probe',
          input: '{"probe_vector": "DYNAMIC_LOGISTICS_RANDOM_STREAM"}',
          expectedOutput: '{"dynamically_computed": true, "not_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-ds-01', name: 'Correctness', description: 'Accurately calculates inventory valuation, dispatches shipments, and tracks fulfillment counts.', weight: 0.35, maxPoints: 35 },
        { id: 'rub-ds-02', name: 'DataStructureSelection', description: 'Selects the appropriate built-in data structure for each domain role (Dict for lookup, List for ordered queue, Set for unique hubs).', weight: 0.25, maxPoints: 25 },
        { id: 'rub-ds-03', name: 'TradeoffReasoning', description: 'Demonstrates understanding of data structure trade-offs (mutability, hashing, ordering, lookup efficiency).', weight: 0.15, maxPoints: 15 },
        { id: 'rub-ds-04', name: 'MutabilityAliasingReasoning', description: 'Correctly manages in-place dictionary inventory deductions without corrupting initial input structures.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-ds-05', name: 'DebuggingVerification', description: 'Handles missing inventory keys, empty queues, and unserved hub edge cases cleanly.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-ds-06', name: 'CodeQuality', description: 'Clean modular functions, readable variable naming, and clear logic flow.', weight: 0.05, maxPoints: 5 },
      ],
    },
  ],
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};

// ── BATCH 004 COMPLETE MANIFEST (DAYS 16–20) ─────────────────────────────────
export const BATCH_004_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m1-w4-004',
  batchCode: 'P1-M1-W4-BATCH004',
  title: 'Python Built-In Data Structures (Days 16–20)',
  difficulty: 'BEGINNER',
  days: [
    DAY_16_MANIFEST,
    DAY_17_MANIFEST,
    DAY_18_MANIFEST,
    DAY_19_MANIFEST,
    DAY_20_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};
