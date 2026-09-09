// src/lib/curriculum/pythonFullStack/batch003.ts
// Single Source of Truth for PINIT BATCH 003: Month 1 · Week 3 · Days 11–15
// Functions, Scope & Modular Decomposition (UNDERSTAND -> APPLY -> DEBUG -> BUILD -> TRANSFER)

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

export const COMPETENCY_ID_FUNCTIONS_MODULAR = 'comp-pfs-m1-003';

// ── DAY 11: UNDERSTAND — Functions: Reusable Units of Behavior ────────────────
export const DAY_11_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w3-003',
  dayNumber: 1,
  title: 'Functions: Reusable Units of Behavior',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b3-d11-01',
      type: 'THEORY',
      order: 1,
      title: 'Why Functions Exist: The Input-Process-Output Contract',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Transition from procedural top-level scripts to modular, reusable functions with explicit inputs and outputs.',
      whatItIs: 'A function is a named, reusable block of code that performs a specific task. Defining a function with `def` creates a function object in the runtime; calling a function with parentheses `()` transfers execution control into the function body until a `return` statement is encountered.',
      whyItExists: 'Without functions, software becomes an unmaintainable wall of copy-pasted code where a single bug fix requires editing dozens of duplicate blocks.',
      problemSolved: 'Eliminates repetitive code duplication, enables unit testing, and provides clear separation of responsibilities.',
      mentalModel: 'Contract Model: Think of a function as an independent machine. You feed raw materials into its input hopper (parameters), it performs a specific mechanical operation inside (body), and dispenses a finished product through its output chute (return value). Defining the machine does not run it; pressing the start button (calling it) runs it.',
      realWorldUse: 'The fundamental building block of all Python backend services, APIs, utility scripts, and business logic layers.',
      commonMistakes: [
        'Assuming defining a function with `def` executes its body immediately.',
        'Confusing `print()` (a side effect that writes text to stdout) with `return` (passing a data value back to the caller).',
        'Forgetting parentheses when calling a function (e.g. `calculate_tax` references the function object; `calculate_tax()` executes it).',
      ],
      commonMisconceptions: [
        'Misconception: "print() gives data back to other code." Reality: `print()` displays text on the terminal screen but returns `None`. Only `return` allows caller code to store and reuse calculation results.',
        'Misconception: "A parameter and an argument are identical." Reality: Parameters are the variable names listed in the function definition header; arguments are the actual values passed during a function call.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b3-d11-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Defining Functions, Call Tracing & Return vs Print',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Tracing execution flow during function calls and contrasting returning data versus printing side effects.',
      language: 'python',
      codeSnippet: `# 1. Defining a function (Creates function object, does NOT run body)
def compute_total_cost(unit_price, quantity):
    subtotal = unit_price * quantity
    return subtotal

# 2. Function with a side-effect (print) vs return
def display_invoice(customer_name, total_amount):
    print(f"--- INVOICE FOR: {customer_name} ---")
    print(f"Total Amount Due: \${total_amount:.2f}")
    # No return statement -> implicitly returns None

# 3. Execution flow tracing
print("Step 1: Program begins")

# Calling compute_total_cost and capturing returned data
order_total = compute_total_cost(45.50, 4)
print(f"Step 2: Returned value captured -> {order_total}")

# Calling display_invoice
result_display = display_invoice("Apex Logistics", order_total)
print(f"Step 3: display_invoice returned -> {result_display}")`,
      expectedOutput: `Step 1: Program begins
Step 2: Returned value captured -> 182.0
--- INVOICE FOR: Apex Logistics ---
Total Amount Due: $182.00
Step 3: display_invoice returned -> None`,
    } as ExampleBlock,
    {
      id: 'blk-b3-d11-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Interactive Trace & Prediction Drills',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Trace the execution order of function calls step-by-step.',
        'Predict which print statements execute first, second, and third.',
        'Implement a function `calculate_net_salary(gross_salary, tax_rate)` that returns the salary after deducting taxes.',
        'Verify that the function returns a float value rather than printing it.',
      ],
      starterCode: `# Part 1: Execution Order Trace
def step_alpha():
    print("[ALPHA] Running inside alpha")
    return 10

def step_beta(multiplier):
    print("[BETA] Running inside beta with multiplier:", multiplier)
    val = step_alpha() * multiplier
    return val

print("1. Before any calls")
final_val = step_beta(3)
print("2. After beta returned:", final_val)

# Part 2: Write calculate_net_salary
def calculate_net_salary(gross_salary, tax_rate):
    # TODO: Calculate deduction = gross_salary * tax_rate
    # TODO: Return gross_salary - deduction
    pass`,
      hints: [
        'Execution flows into `step_beta`, which pauses while `step_alpha` runs, then finishes `step_beta`.',
        'Make sure `calculate_net_salary` returns a float with the formula `gross_salary * (1.0 - tax_rate)`.',
      ],
      expectedOutcome: 'The student understands non-linear execution flow during function calls and uses return values correctly.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b3-d11-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic Check: Function Execution & Return Misconceptions',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'A student writes the following script:\n```python\ndef get_discounted_price(price):\n    discount = price * 0.10\n    print(price - discount)\n\nfinal_price = get_discounted_price(100.0)\ntotal_with_tax = final_price * 1.05\n```\nWhat error occurs when this code runs, and why?',
      options: [
        'A SyntaxError occurs because `print` cannot be called inside a function.',
        'A TypeError occurs on line 6 because `get_discounted_price` has no `return` statement, so `final_price` is `None`, and `None * 1.05` is invalid.',
        'A NameError occurs because `discount` was not defined globally.',
        'The code runs successfully and `total_with_tax` is 94.5.',
      ],
      correctIndex: 1,
      explanation: 'When a function does not contain an explicit `return` statement, Python implicitly returns `None`. Calling `print(...)` displays text on the screen but does not return a value. Therefore, `final_price` is bound to `None`, causing a `TypeError: unsupported operand type(s) for *: \'NoneType\' and \'float\'` when multiplied.',
      misconceptionIdentified: 'Believing that calling print() inside a function returns the printed value to the caller.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b3-d11-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Official Documentation & Standards',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Tutorial: Defining Functions',
          url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions',
          description: 'Official guide on function definitions, return values, and parameter passing.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 12: APPLY — Parameters, Arguments, Return Values & Function Design ───
export const DAY_12_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w3-003',
  dayNumber: 2,
  title: 'Parameters, Arguments, Return Values & Function Design',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b3-d12-01',
      type: 'THEORY',
      order: 1,
      title: 'Function Design: Parameter Binding, Contracts & Early Return',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master positional vs keyword argument binding, return values, early return guard clauses, and single-purpose function decomposition.',
      whatItIs: 'When a function is called, Python binds argument values to parameter names. Positional arguments bind in order; keyword arguments bind by name. The `return` statement immediately terminates function execution and passes a single computed value back to the caller. Guard clauses use early `return` to handle invalid inputs or edge cases cleanly before executing the primary calculation.',
      whyItExists: 'Clear input/output contracts and small, focused functions make software easy to test, debug, and understand without deep nested indentation.',
      problemSolved: 'Prevents deeply nested if/else pyramids and unreadable monolithic functions.',
      mentalModel: 'Guard Clause Pattern: Handle invalid cases at the very top of the function and return immediately (early exit), leaving the happy path unindented and clean.',
      commonMistakes: [
        'Placing positional arguments after keyword arguments in a function call (e.g. `fn(x=1, 2)` causes SyntaxError).',
        'Creating functions that do too many unrelated tasks instead of adhering to the Single Responsibility Principle.',
        'Writing dead code after an unconditional `return` statement.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b3-d12-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Argument Binding Modes, Return Values & Guard Clauses',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Demonstrating positional vs keyword calls, returning a single computed metric, and using guard clauses for clean input validation.',
      language: 'python',
      codeSnippet: `# 1. Positional vs Keyword argument binding
def calculate_shipping(weight_kg, distance_km, is_express=False):
    if weight_kg <= 0.0 or distance_km <= 0.0:
        return 0.0  # Guard clause: Early return for invalid input
    
    base_rate = weight_kg * 1.50 + distance_km * 0.10
    if is_express:
        base_rate += 25.00
    return round(base_rate, 2)

# Positional call
cost1 = calculate_shipping(10.0, 150.0)

# Keyword call (order can vary when names are specified)
cost2 = calculate_shipping(distance_km=150.0, weight_kg=10.0, is_express=True)

# 2. Computing and returning a single value with scalar comparisons & guard clauses
def clamp_value(value, min_threshold, max_threshold):
    if value < min_threshold:
        return min_threshold
    if value > max_threshold:
        return max_threshold
    return value

reading_a = clamp_value(105.4, 0.0, 100.0)
reading_b = clamp_value(-12.8, 0.0, 100.0)
reading_c = clamp_value(45.6, 0.0, 100.0)
print(f"Standard Shipping: \${cost1}")
print(f"Express Shipping: \${cost2}")
print(f"Clamped Readings: {reading_a}, {reading_b}, {reading_c}")`,
      expectedOutput: `Standard Shipping: $30.0
Express Shipping: $55.0
Clamped Readings: 100.0, 0.0, 45.6`,
    } as ExampleBlock,
    {
      id: 'blk-b3-d12-03',
      type: 'GUIDED_LAB',
      order: 3,
      title: 'Guided Lab: Refactoring Monolithic Scripts into Function Pipelines',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Refactor a messy procedural fuel efficiency script into 3 dedicated single-responsibility functions.',
      instructions: [
        'Define `compute_fuel_economy(distance_km, fuel_liters)`: Returns km per liter (or 0.0 if fuel_liters <= 0).',
        'Define `compute_trip_cost(fuel_liters, price_per_liter)`: Returns total cost as float.',
        'Define `classify_efficiency(km_per_liter)`: Returns "HIGH" if >= 15.0, "MODERATE" if >= 10.0, else "LOW".',
        'Orchestrate the calculations by calling these functions sequentially.',
      ],
      starterFiles: {
        'fuel_refactor.py': `# Target: Refactor procedural logic into clean functions

def compute_fuel_economy(distance_km, fuel_liters):
    if fuel_liters <= 0.0:
        return 0.0
    return round(distance_km / fuel_liters, 2)

def compute_trip_cost(fuel_liters, price_per_liter):
    if fuel_liters <= 0.0 or price_per_liter <= 0.0:
        return 0.0
    return round(fuel_liters * price_per_liter, 2)

def classify_efficiency(km_per_liter):
    if km_per_liter >= 15.0:
        return "HIGH"
    elif km_per_liter >= 10.0:
        return "MODERATE"
    return "LOW"

# Main pipeline
trip_km = 450.0
fuel_used = 28.5
gas_price = 1.45

economy = compute_fuel_economy(trip_km, fuel_used)
cost = compute_trip_cost(fuel_used, gas_price)
rating = classify_efficiency(economy)

print(f"Fuel Economy: {economy} km/L | Rating: {rating} | Total Cost: \${cost}")`,
      },
      expectedBehavior: 'Functions correctly isolate arithmetic calculations and return explicit values for orchestration.',
    } as GuidedLabBlock,
    {
      id: 'blk-b3-d12-04',
      type: 'INDEPENDENT_PRACTICE',
      order: 4,
      title: 'Independent Practice: Freight Delivery Surcharge Engine',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Design a modular function suite for a freight surcharge engine: `calculate_base_fare(weight_kg)`, `calculate_zone_multiplier(zone_code)`, and `calculate_total_fare(weight_kg, zone_code, is_refrigerated)`.',
      starterCode: `def calculate_base_fare(weight_kg):
    # Base: $10.00 minimum + $2.50 per kg over 5kg
    pass

def calculate_zone_multiplier(zone_code):
    # 'LOCAL': 1.0, 'REGIONAL': 1.25, 'NATIONAL': 1.60, other: 2.0
    pass

def calculate_total_fare(weight_kg, zone_code, is_refrigerated=False):
    # Total = base_fare * zone_multiplier (+ $50.00 flat surcharge if refrigerated)
    pass`,
      hints: [
        'Keep each function focused strictly on its mathematical sub-task.',
        'Use `is_refrigerated=False` as a boolean keyword argument.',
      ],
      verificationRequirements: [
        'Handles zero and negative weights safely with early return 0.0.',
        'Computes multipliers accurately across all zone codes.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b3-d12-05',
      type: 'KNOWLEDGE_CHECK',
      order: 5,
      title: 'Diagnostic Check: Positional vs Keyword Ordering Rules',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Consider the function definition:\n```python\ndef record_sensor(sensor_id, value, alert_mode="LOG"):\n    pass\n```\nWhich of the following function calls raises a SyntaxError in Python?',
      options: [
        '`record_sensor("S1", 42.0)`',
        '`record_sensor("S1", 42.0, alert_mode="SMS")`',
        '`record_sensor(value=42.0, sensor_id="S1")`',
        '`record_sensor(sensor_id="S1", 42.0, "SMS")`',
      ],
      correctIndex: 3,
      explanation: 'In Python syntax, positional arguments cannot follow keyword arguments in a call. `record_sensor(sensor_id="S1", 42.0, "SMS")` puts positional argument `42.0` after keyword argument `sensor_id="S1"`, raising `SyntaxError: positional argument follows keyword argument`.',
      misconceptionIdentified: 'Believing keyword arguments can be freely intermixed before positional arguments.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 13: DEBUG / DEEPEN — Scope, Namespaces & Name Resolution ──────────────
export const DAY_13_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w3-003',
  dayNumber: 3,
  title: 'Scope, Namespaces & Name Resolution',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b3-d13-01',
      type: 'THEORY',
      order: 1,
      title: 'Namespaces, LEGB Scope Rules & Name Binding Resolution',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn how Python resolves variable names using the LEGB rule (Local -> Enclosing -> Global -> Built-in) and why assigning inside a function creates a local binding.',
      whatItIs: 'A namespace is a mapping from variable names to objects. A scope is the textual region of a Python program where a namespace is directly accessible. For ordinary function name resolution, LEGB is a useful beginner model: 1. Local (inside current function) -> 2. Enclosing (outer functions, if nested) -> 3. Global (module top-level) -> 4. Built-in (built-in Python functions like len, print, sum). Python also has class namespace and scope behavior that is intentionally deferred until classes are taught later.',
      whyItExists: 'Scope isolation prevents functions from accidentally corrupting variables defined in other parts of the application.',
      problemSolved: 'Explains why assigning to a variable inside a function does NOT overwrite outer variables by default, and why `UnboundLocalError` occurs.',
      mentalModel: 'LEGB Privacy Layers: Think of scopes like a series of nested one-way glass rooms. Looking outward: Code inside a function can look through the glass to read global names. But looking inward: The outside global scope cannot see into local function rooms, and writing to a name inside the room places a local label on the inside wall.',
      commonMistakes: [
        'Attempting to read an outer variable and then assigning to it in the same function, causing `UnboundLocalError`.',
        'Shadowing built-in names like `max = 100.0` or `min = 0.0`, breaking future calls to built-in `max()` or `min()`.',
        'Overusing the `global` keyword to mutate global variables instead of passing arguments and returning values.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b3-d13-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge 1: The UnboundLocalError Trap',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A counter function crashes with `UnboundLocalError` when attempting to track cumulative system visits.',
      symptom: 'UnboundLocalError: cannot access local variable \'visit_count\' where it is not associated with a value',
      brokenArtifact: `# visitor_counter.py
visit_count = 0

def register_visit():
    # DEFECT: Python sees assignment 'visit_count = ...' and treats visit_count as LOCAL to register_visit.
    # When it tries to read 'visit_count + 1' on the right side, the local variable has no value yet!
    print("Current visits before:", visit_count)
    visit_count = visit_count + 1
    return visit_count

register_visit()`,
      expectedBehavior: 'Refactor function to avoid mutating global state directly, passing the current count as a parameter and returning the updated count, or using explicit scope declarations.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Python inspects the function body at compile time. Because `visit_count = ...` exists, Python marks `visit_count` as local throughout the ENTIRE function.',
        'Hint 2: When `print(visit_count)` runs on line 7, Python looks for the local `visit_count` (which has not been assigned yet), triggering `UnboundLocalError`.',
        'Hint 3: Best practice: Pass `current_count` as a parameter and return `current_count + 1` rather than relying on global state.',
      ],
      targetCompetencyId: COMPETENCY_ID_FUNCTIONS_MODULAR,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b3-d13-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge 2: The Shadowed Built-In Function',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A developer creates a variable named `max` to store a threshold. Later in the code, calling the built-in function `max(sensor_a, sensor_b)` crashes with `TypeError: \'float\' object is not callable`.',
      symptom: 'TypeError: \'float\' object is not callable on line 8',
      brokenArtifact: `# telemetry_bounds.py
# Step 1: Store threshold bound in a variable
max = 100.0

# Step 2: Compare two sensor readings using Python built-in max()
reading_1 = 78.5
reading_2 = 92.3

# DEFECT: 'max' is bound to the float 100.0, shadowing the built-in max() function!
peak_reading = max(reading_1, reading_2)
print("Peak Sensor Reading:", peak_reading)`,
      expectedBehavior: 'Rename the threshold variable from `max` to `max_threshold` or `peak_limit`, preserving access to Python built-in `max()` function in the global namespace.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Look at the name of the variable assigned on line 3. Is `max` a built-in Python function?',
        'Hint 2: In the LEGB rule, Global scope is checked BEFORE Built-in scope. Binding `max = 100.0` in global scope hides the built-in `max()` function.',
        'Hint 3: Rename line 3 variable to `max_threshold` and test again.',
      ],
      targetCompetencyId: COMPETENCY_ID_FUNCTIONS_MODULAR,
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 14: BUILD — Modules, import & Python Module Boundaries ────────────────
export const DAY_14_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w3-003',
  dayNumber: 4,
  title: 'Modules, import & Python Module Boundaries',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b3-d14-01',
      type: 'THEORY',
      order: 1,
      title: 'Module Boundaries, Namespace Encapsulation & The __main__ Idiom',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn how Python modules organize code across files, how imports bind names into namespaces, and how __name__ == "__main__" distinguishes library code from executables.',
      whatItIs: 'A Python module is a file containing Python definitions and statements; in the common case, a `.py` file acts as a module with its own independent namespace. The statement `import module_name` loads the file once and binds the module namespace. `from module_name import func` binds `func` directly into the current namespace. In Python, `__main__` is the special runtime name/environment assigned to top-level script execution (when a file is run directly). In contrast, `main()` is simply a conventional function name developers often write to hold the program\'s primary entry point behavior. They are not the same thing: `__main__` is an environment name, while `main()` is an ordinary function.',
      whyItExists: 'Separating code into modular files prevents giant multi-thousand-line monolithic scripts, enables team collaboration, and allows functions to be reused across multiple applications.',
      problemSolved: 'Eliminates naming collisions and allows code to be both imported as a library and executed as a standalone CLI tool.',
      mentalModel: 'Module as Toolbox: Each module file is a dedicated toolbox with its own label (e.g. `metrics.py`, `formatters.py`). Importing a module brings the toolbox into your workshop without spilling its tools all over your global workbench.',
      commonMistakes: [
        'Executing code at the top level of a module without `if __name__ == "__main__":`, causing test code to run whenever the module is imported elsewhere.',
        'Naming a local file the same as a Python standard library module (e.g. creating `random.py` or `math.py`, breaking standard library imports).',
        'Using wildcard imports (`from module import *`) which pollutes the local namespace with unknown names.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b3-d14-02',
      type: 'GUIDED_LAB',
      order: 2,
      title: 'Guided Build: Decomposing a Script into a 3-Module CLI Application',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a multi-file Python application with clean module boundaries: `calculations.py`, `reporters.py`, and `app.py`.',
      instructions: [
        'Create `calculations.py` containing math functions: `calculate_discount(price, rate)` and `calculate_tax(subtotal, tax_rate)`.',
        'Create `reporters.py` containing display formatters: `format_currency(amount)` and `format_summary(subtotal, tax, final_total)`.',
        'Create `app.py` that imports functions from `calculations` and `reporters` and orchestrates invoice processing under `if __name__ == "__main__":`.',
      ],
      starterFiles: {
        'calculations.py': `# Module: calculations.py
def calculate_discount(price, discount_percent):
    if price <= 0.0 or discount_percent <= 0.0:
        return 0.0
    return round(price * (discount_percent / 100.0), 2)

def calculate_tax(subtotal, tax_rate_percent=8.5):
    if subtotal <= 0.0:
        return 0.0
    return round(subtotal * (tax_rate_percent / 100.0), 2)`,
        'reporters.py': `# Module: reporters.py
def format_currency(amount):
    return f"\${amount:.2f}"

def format_summary(subtotal, tax_amount, total):
    return (
        f"=== INVOICE SUMMARY ===\\n"
        f"Subtotal: {format_currency(subtotal)}\\n"
        f"Tax:      {format_currency(tax_amount)}\\n"
        f"Total:    {format_currency(total)}"
    )`,
        'app.py': `# Module: app.py (Entry point)
from calculations import calculate_discount, calculate_tax
from reporters import format_summary

def run_invoice_pipeline():
    original_price = 250.0
    discount = calculate_discount(original_price, 15.0)
    subtotal = original_price - discount
    tax = calculate_tax(subtotal, 8.0)
    final_total = subtotal + tax
    
    print(format_summary(subtotal, tax, final_total))

if __name__ == "__main__":
    run_invoice_pipeline()`,
      },
      expectedBehavior: 'Each module maintains clear single responsibility and imports function smoothly without namespace collisions.',
    } as GuidedLabBlock,
    {
      id: 'blk-b3-d14-03',
      type: 'INDEPENDENT_PRACTICE',
      order: 3,
      title: 'Independent Practice: Modular Warehouse Stock Auditor',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Create two modules `inventory_rules.py` and `audit_runner.py`. `inventory_rules.py` must provide `is_reorder_needed(stock, threshold)` and `calculate_shortage(stock, capacity)`. `audit_runner.py` must import these rules and evaluate a stock list.',
      starterCode: `# inventory_rules.py
def is_reorder_needed(current_stock, threshold):
    pass

def calculate_shortage(current_stock, target_capacity):
    pass`,
      hints: [
        'Ensure `inventory_rules.py` contains only pure functions with no top-level print statements.',
        'In `audit_runner.py`, use `from inventory_rules import is_reorder_needed, calculate_shortage`.',
      ],
      verificationRequirements: [
        'Rules module exports clean functions with explicit parameters and return types.',
        'Runner module imports and uses rules accurately under `if __name__ == "__main__":`.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b3-d14-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Why Module Encapsulation Matters',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Why is `from module import *` considered an anti-pattern in professional Python development? How does the `if __name__ == "__main__":` block enable automated testing of modules?',
      guidingQuestions: [
        'What happens when two imported modules define a function with the same name during a wildcard import?',
        'How does `__name__` change when a file is executed directly versus when it is imported by another file?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 15: TRANSFER + ASSESSMENT — Modular Fleet Expense Analyzer CLI ────────
export const DAY_15_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w3-003',
  dayNumber: 5,
  title: 'Modular Python CLI Application',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b3-d15-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Modular Fleet Expense & Telemetry Analyzer CLI',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Commercial Fleet Logistics & Operations Monitoring: Commercial transport companies require modular CLI utilities to process raw trip log streams, calculate operational metrics (fuel efficiency, total fuel cost, maintenance alerts), and return structured telemetry reports without global state pollution.',
      task: `Design and implement a modular Python solution containing clear, single-purpose functions to analyze fleet operations logs.

You must implement the primary analysis function:
\`generate_fleet_operations_report(raw_log_stream)\`

The function receives a multi-line string where each line represents one vehicle trip log formatted as:
\`VEHICLE_ID,DISTANCE_KM,FUEL_LITERS,PRICE_PER_LITER,STATUS\`

Example input:
"""
V101,420.0,28.0,1.50,COMPLETED
V102,150.0,25.0,1.40,COMPLETED
V103,0.0,0.0,1.50,MAINTENANCE
"""

The function must process records using decomposed helper functions (e.g. calculating economy, computing trip cost, validating trip status, formatting report lines) and return a formatted multi-line summary report string:
"""
TOTAL_TRIPS: 3
COMPLETED_TRIPS: 2
MAINTENANCE_TRIPS: 1
TOTAL_DISTANCE_KM: 570.0
TOTAL_FUEL_COST: 77.0
AVG_KM_PER_LITER: 10.75
OPERATIONAL_HEALTH: ATTENTION_REQUIRED
"""

BUSINESS & STATUS RULES:
1. A trip is a VALID COMPLETED TRIP if:
   - STATUS is "COMPLETED"
   - DISTANCE_KM > 0.0
   - FUEL_LITERS > 0.0
   - PRICE_PER_LITER > 0.0
2. If STATUS is "MAINTENANCE": increment maintenance_trips (distance and fuel are not added to completed totals).
3. OPERATIONAL HEALTH Rules:
   - "OPTIMAL": If completed_trips > 0 and maintenance_trips == 0 and avg_km_per_liter >= 12.0
   - "ATTENTION_REQUIRED": If maintenance_trips >= 1 or (completed_trips > 0 and avg_km_per_liter < 12.0)
   - "CRITICAL": If completed_trips == 0 or total_trips == 0
4. If raw_log_stream is empty or None: return all counts as 0, totals as 0.0, and OPERATIONAL_HEALTH: CRITICAL.`,
      constraints: [
        'Strictly decompose calculations into separate helper functions (e.g., computing economy, computing trip cost, validating trip record, formatting output).',
        'Zero global state: all data must pass via parameters and return values.',
        'Zero classes, zero external libraries, zero file I/O.',
        'No explicit list/sequence indexing or collection manipulation required: stream parsing is solvable via scalar helper functions and string iteration.',
        'Must handle boundary values (empty stream, zero fuel, invalid lines) gracefully.',
      ],
      difficulty: 'BEGINNER',
      timeExpectationMinutes: 45,
      targetCompetencyId: COMPETENCY_ID_FUNCTIONS_MODULAR,
      assessmentRef: 'asm-pfs-m1-w3-func-001',
    } as TransferChallengeBlock,
  ],
};

// ── DAY 15 INDEPENDENT FORMATIVE ASSESSMENT ──────────────────────────────────
export const DAY_15_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m1-w3-func-001',
  assessmentCode: 'ASM-PFS-M1-W3-FUNC',
  title: 'Modular Functions, Scope & Stream Decomposition Assessment',
  description: 'Independent formative learning assessment evaluating modular function decomposition, parameter/return contracts, scope isolation, and multi-metric aggregation within the formative sandbox.',
  type: 'CODE',
  mode: 'FORMATIVE',
  version: '1.0.0',
  status: 'PUBLISHED',
  difficulty: 'BEGINNER',
  timeLimitMinutes: 45,
  attemptPolicy: 'LIMITED_BEST',
  maxAttempts: 3,
  passingScore: 75,
  targetCompetencyId: COMPETENCY_ID_FUNCTIONS_MODULAR,
  items: [
    {
      id: 'item-func-01',
      assessmentId: 'asm-pfs-m1-w3-func-001',
      version: '1.0.0',
      itemType: 'CODE',
      prompt: `Implement a modular solution with \`generate_fleet_operations_report(raw_log_stream)\` that uses helper functions to parse, compute metrics, and return the formatted multi-line operations summary report string.`,
      points: 100,
      order: 1,
      timeEstimateMinutes: 30,
      visibleTests: [
        {
          id: 'vt-func-01',
          name: 'Standard Fleet Normal Log Analysis',
          input: '{"raw_log_stream": "V1,300.0,20.0,1.50,COMPLETED\\nV2,450.0,30.0,1.50,COMPLETED"}',
          expectedOutput: 'TOTAL_TRIPS: 2\\nCOMPLETED_TRIPS: 2\\nMAINTENANCE_TRIPS: 0\\nTOTAL_DISTANCE_KM: 750.0\\nTOTAL_FUEL_COST: 75.0\\nAVG_KM_PER_LITER: 15.0\\nOPERATIONAL_HEALTH: OPTIMAL',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-func-02',
          name: 'Maintenance Status & Attention Required Check',
          input: '{"raw_log_stream": "V1,300.0,20.0,1.50,COMPLETED\\nV2,0.0,0.0,1.50,MAINTENANCE"}',
          expectedOutput: 'TOTAL_TRIPS: 2\\nCOMPLETED_TRIPS: 1\\nMAINTENANCE_TRIPS: 1\\nTOTAL_DISTANCE_KM: 300.0\\nTOTAL_FUEL_COST: 30.0\\nAVG_KM_PER_LITER: 15.0\\nOPERATIONAL_HEALTH: ATTENTION_REQUIRED',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-func-01',
          name: 'Low Fuel Efficiency Alert Trigger (< 12.0 km/L)',
          input: '{"raw_log_stream": "V1,100.0,20.0,2.00,COMPLETED"}',
          expectedOutput: 'TOTAL_TRIPS: 1\\nCOMPLETED_TRIPS: 1\\nMAINTENANCE_TRIPS: 0\\nTOTAL_DISTANCE_KM: 100.0\\nTOTAL_FUEL_COST: 40.0\\nAVG_KM_PER_LITER: 5.0\\nOPERATIONAL_HEALTH: ATTENTION_REQUIRED',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-func-02',
          name: 'Empty and Malformed Stream Resilience',
          input: '{"raw_log_stream": ""}',
          expectedOutput: 'TOTAL_TRIPS: 0\\nCOMPLETED_TRIPS: 0\\nMAINTENANCE_TRIPS: 0\\nTOTAL_DISTANCE_KM: 0.0\\nTOTAL_FUEL_COST: 0.0\\nAVG_KM_PER_LITER: 0.0\\nOPERATIONAL_HEALTH: CRITICAL',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-func-01',
          name: 'Anti-Hardcoding Dynamic Fleet Probe',
          input: '{"probe_vector": "DYNAMIC_FLEET_RANDOM_STREAM"}',
          expectedOutput: '{"dynamically_computed": true, "not_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-func-01', name: 'Correctness', description: 'Accurately parses trip logs, aggregates distance/fuel costs, and determines fleet health.', weight: 0.40, maxPoints: 40 },
        { id: 'rub-func-02', name: 'FunctionDesign', description: 'Decomposes logic into clear single-purpose helper functions with explicit inputs and returns.', weight: 0.20, maxPoints: 20 },
        { id: 'rub-func-03', name: 'ScopeStateReasoning', description: 'Avoids global state pollution; correctly manages parameters, returns, and local variable scope.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-func-04', name: 'ModuleOrganization', description: 'Demonstrates modular structure separating parsing, calculation, and orchestration logic.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-func-05', name: 'DebuggingVerification', description: 'Handles boundary conditions, zero divisions, and empty streams robustly without crashing.', weight: 0.10, maxPoints: 10 },
        { id: 'rub-func-06', name: 'CodeQuality', description: 'Clear function naming, readable formatting, and sensible comments where useful.', weight: 0.05, maxPoints: 5 },
      ],
    },
  ],
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};

// ── BATCH 003 COMPLETE MANIFEST (DAYS 11–15) ─────────────────────────────────
export const BATCH_003_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m1-w3-003',
  batchCode: 'P1-M1-W3-BATCH003',
  title: 'Functions, Scope & Modular Decomposition (Days 11–15)',
  difficulty: 'BEGINNER',
  days: [
    DAY_11_MANIFEST,
    DAY_12_MANIFEST,
    DAY_13_MANIFEST,
    DAY_14_MANIFEST,
    DAY_15_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};
