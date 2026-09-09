// src/lib/curriculum/pythonFullStack/batch002.ts
// Single Source of Truth for PINIT BATCH 002: Month 1 · Week 2 · Days 6–10
// Python Core Syntax & Object Model (UNDERSTAND -> APPLY -> BUILD -> DEBUG -> TRANSFER)

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

export const COMPETENCY_ID_SYNTAX_MODEL = 'comp-pfs-m1-002';

// ── DAY 6: UNDERSTAND — Variables, Dynamic Typing & Object References ─────────
export const DAY_6_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w2-002',
  dayNumber: 1,
  title: 'Variables, Dynamic Typing & Object References',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b2-d6-01',
      type: 'THEORY',
      order: 1,
      title: 'Python Names as Object Labels (The Reference Model)',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn the foundational mental model of Python variables: variable names are labels bound to objects managed by the Python runtime.',
      whatItIs: 'In Python, variables are names (labels or references) that point to objects managed by the Python runtime. An assignment statement `a = 100` creates an integer object `100` and binds the name `a` to that object. In CPython, objects are represented in the process memory, but this is an implementation detail; Python language semantics are defined in terms of names, objects, identity, type, and binding rather than physical RAM addresses.',
      whyItExists: 'Understanding the name-to-object binding model eliminates massive confusion when reassigning variables, passing objects, or checking equality vs identity.',
      problemSolved: 'Prevents the common beginner misconception that `b = a` creates an independent copy of an object.',
      mentalModel: 'Name Tag Model: Think of a Python variable as a name tag bound to an object managed by the runtime. If you write `b = a`, you attach a second name tag `b` to the exact same object.',
      realWorldUse: 'Crucial for reasoning about variable scope, memory lifecycle, and distinguishing value equality (`==`) from object identity (`is`).',
      commonMistakes: [
        'Believing `b = a` copies the underlying object in memory.',
        'Confusing `==` (checks if values are equal) with `is` (checks if two names point to the identical object).',
        'Expecting variable types to be declared statically before assignment.',
      ],
      commonMisconceptions: [
        'Misconception: "Variables have types in Python." Reality: In Python, objects have types (e.g. int, str, float), not the variable names. A name can be rebound to an object of any type at any time (Dynamic Typing).',
        'Misconception: "is and == are interchangeable." Reality: `a == b` evaluates whether values are equivalent; `a is b` evaluates whether `id(a) == id(b)`.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b2-d6-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Name Binding, Reassignment, and Identity vs Equality',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Observing how names bind to objects, how reassignment moves a name to a new object, and how identity (is) differs from value equality (==).',
      language: 'python',
      codeSnippet: `# 1. Name binding and Aliasing
x = 500
y = x  # y is bound to the exact same integer object as x

print(f"x value: {x}, y value: {y}")
print(f"x == y (Value Equality): {x == y}")
print(f"x is y (Object Identity): {x is y}")

# 2. Reassignment: Rebinding x to a new object
x = 600
print("\\nAfter x = 600:")
print(f"x value: {x}, y value: {y}")
print(f"x == y: {x == y}")
print(f"x is y: {x is y}")
print(f"Notice y remains bound to the original 500 object!")

# 3. Equality vs Identity with Distinct Objects
str1 = "PinIT Engineering Platform"
str2 = "PinIT Engineering " + "Platform"
print("\\nString Comparison:")
print(f"str1 == str2 (Same text value): {str1 == str2}")
print(f"str1 is str2 (Identity check): {str1 is str2}")`,
      expectedOutput: `x value: 500, y value: 500
x == y (Value Equality): True
x is y (Object Identity): True

After x = 600:
x value: 600, y value: 500
x == y: False
x is y: False
Notice y remains bound to the original 500 object!

String Comparison:
str1 == str2 (Same text value): True
str1 is str2 (Identity check): True`,
    } as ExampleBlock,
    {
      id: 'blk-b2-d6-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Interactive Prediction Drills: Name Binding & Types',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Read each code sequence and predict the output before running it.',
        'Sequence A: `val1 = 42; val2 = val1; val1 = val1 + 8`. What are `val1` and `val2`?',
        'Sequence B: `data = "100"; print(type(data)); data = 100; print(type(data))`. How does dynamic typing change `type(data)`?',
        'Sequence C: Compare `num1 = 1000` and `num2 = 1000.0`. Predict `num1 == num2` vs `num1 is num2`.',
      ],
      starterCode: `# Sequence A: Predict values
val1 = 42
val2 = val1
val1 = val1 + 8
print("Val1:", val1, "| Val2:", val2)

# Sequence B: Dynamic Typing
data = "100"
print("Type 1:", type(data))
data = 100
print("Type 2:", type(data))

# Sequence C: Value Equality vs Object Identity
num1 = 1000
num2 = 1000.0
print("num1 == num2:", num1 == num2)
print("num1 is num2:", num1 is num2)`,
      hints: [
        'Integers and floats with equal numeric value compare equal with `==`, but they are distinct types and distinct objects in memory (`is` is False).',
        'Rebinding `val1` does NOT modify `val2` because `val2` is still bound to the original object `42`.',
      ],
      expectedOutcome: 'The student correctly predicts that reassigning a variable does not alter aliases bound to immutable values.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b2-d6-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Diagnostic Check: Variable Assignment & Aliasing Misconceptions',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'A developer executes the following Python lines:\n```python\na = 10\nb = a\na = 20\n```\nWhat is the value of `b`, and why?',
      options: [
        '`b` is 20, because `b` points to variable `a` and updates automatically when `a` changes.',
        '`b` is 10, because `b` was bound to the integer object 10, and reassigning `a` only rebound `a` to a new object 20.',
        '`b` causes a NameError because `a` was overwritten.',
        '`b` is None because integers cannot be assigned to multiple names.',
      ],
      correctIndex: 1,
      explanation: 'In Python, assignment binds a name to an object. `b = a` bound `b` directly to the object `10`. The subsequent statement `a = 20` rebound `a` to the new integer object `20`, leaving `b` bound to `10`.',
      misconceptionIdentified: 'Believing variable names point to other variable names rather than binding directly to objects.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b2-d6-05',
      type: 'REFERENCE',
      order: 5,
      title: 'Official Documentation & Standards',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Python Official Docs: Data Model & Objects',
          url: 'https://docs.python.org/3/reference/datamodel.html#objects-values-and-types',
          description: 'Official specification of objects, values, and types in Python.',
        },
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 7: APPLY — Arithmetic, Logical & Comparison Operators ─────────────────
export const DAY_7_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w2-002',
  dayNumber: 2,
  title: 'Arithmetic, Logical & Comparison Operators',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b2-d7-01',
      type: 'THEORY',
      order: 1,
      title: 'Operator Precedence, Division Semantics & Short-Circuit Evaluation',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master arithmetic operators (including float vs floor division and modulo), comparison operators, and boolean short-circuit evaluation rules.',
      whatItIs: 'Operators perform computations on operands. Arithmetic operators compute numerical values (`+`, `-`, `*`, `/`, `//`, `%`, `**`). Comparison operators compare values returning booleans (`==`, `!=`, `<`, `<=`, `>`, `>=`). Logical operators (`and`, `or`, `not`) evaluate truthiness. Crucially, Python\'s `and` and `or` operators do not necessarily return `True` or `False`; they apply short-circuit evaluation and return one of their actual operands (`x and y` returns `x` if `x` is falsy, else `y`; `x or y` returns `x` if `x` is truthy, else `y`). In contrast, `not` and comparison operators always produce boolean `True` or `False`.',
      whyItExists: 'Every decision and calculation in software relies on unambiguous operator evaluation. Understanding precedence and operand-returning short-circuit evaluation prevents subtle logic bugs.',
      problemSolved: 'Eliminates unexpected results from integer truncation, modulo on negative numbers, and incorrect compound conditional logic.',
      mentalModel: 'Precedence Ladder: Exponentiation (`**`) > Multiplicative (`*`, `/`, `//`, `%`) > Additive (`+`, `-`) > Comparisons > `not` > `and` > `or`. When in doubt, parentheses make intent explicit.',
      commonMistakes: [
        'Confusing float division `/` (always returns float, e.g. `7 / 2 == 3.5`) with floor division `//` (`7 // 2 == 3`).',
        'Writing `if status == "PENDING" or "ACTIVE":` (which is always truthy because non-empty string `"ACTIVE"` is truthy).',
        'Assuming `and` and `or` always return True/False rather than returning one of the operands.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b2-d7-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Operator Mechanics, Precedence & Short-Circuiting',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      explanation: 'Worked code examples demonstrating division modes, modulo arithmetic, precedence ordering, and short-circuit operand-returning logic.',
      language: 'python',
      codeSnippet: `# 1. Division and Modulo Semantics
print("7 / 2 =", 7 / 2)     # Float division -> 3.5
print("7 // 2 =", 7 // 2)   # Floor division -> 3
print("7 % 2 =", 7 % 2)     # Modulo (remainder) -> 1
print("-7 // 2 =", -7 // 2) # Floor toward -infinity -> -4

# 2. Operator Precedence vs Parentheses
result1 = 10 + 5 * 2 ** 2     # 10 + (5 * 4) = 30
result2 = (10 + 5) * (2 ** 2) # 15 * 4 = 60
print(f"Without parens: {result1}, With parens: {result2}")

# 3. Short-Circuit Evaluation: 'and' and 'or' Return Operands (not just True/False)
print("'hello' and 42 ->", "hello" and 42)      # 'hello' is truthy -> returns 42
print("0 and 100 ->", 0 and 100)                # 0 is falsy -> returns 0
print("'' or 42 ->", "" or 42)                  # '' is falsy -> returns 42
print("None or 'default' ->", None or "default")# None is falsy -> returns 'default'`,
      expectedOutput: `7 / 2 = 3.5
7 // 2 = 3
7 % 2 = 1
-7 // 2 = -4
Without parens: 30, With parens: 60
'hello' and 42 -> 42
0 and 100 -> 0
'' or 42 -> 42
None or 'default' -> default`,
    } as ExampleBlock,
    {
      id: 'blk-b2-d7-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Business Rules & Compound Logic Evaluator',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Implement compound conditional expressions evaluating whether a package qualifies for free shipping.',
        'Rule 1: Order total must be >= $50.00 AND weight must be <= 20.0 kg.',
        'Rule 2: OR customer must have VIP status (`is_vip == True`).',
        'Rule 3: Exclude hazardous cargo (`is_hazardous == False`) unconditionally.',
      ],
      starterCode: `order_total = 75.50
weight_kg = 14.2
is_vip = False
is_hazardous = False

# Construct the single boolean expression:
qualifies_for_free_shipping = (not is_hazardous) and (is_vip or (order_total >= 50.0 and weight_kg <= 20.0))

print("Qualifies for free shipping:", qualifies_for_free_shipping)`,
      hints: [
        '`not is_hazardous` must be true for ANY package to qualify.',
        'Use parentheses around `is_vip or (...)` to enforce precedence over the outer `and`.',
      ],
      expectedOutcome: 'The student writes mathematically correct compound logical expressions using precedence rules.',
    } as GuidedPracticeBlock,
    {
      id: 'blk-b2-d7-04',
      type: 'INDEPENDENT_PRACTICE',
      order: 4,
      title: 'Independent Practice: Telemetry Sensor Threshold Evaluator',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Write a script that takes telemetry metrics (temperature, pressure, voltage) and evaluates whether the system state is "NORMAL", "WARNING", or "CRITICAL" using chained comparison and logical operators without using external libraries.',
      starterCode: `temperature_c = 85.0
pressure_psi = 120.0
voltage_v = 11.5

# Rules:
# CRITICAL if temperature_c > 100.0 or pressure_psi > 150.0 or voltage_v < 10.0
# WARNING if (80.0 <= temperature_c <= 100.0) or (110.0 <= pressure_psi <= 150.0)
# NORMAL otherwise

is_critical = temperature_c > 100.0 or pressure_psi > 150.0 or voltage_v < 10.0
is_warning = (not is_critical) and ((80.0 <= temperature_c <= 100.0) or (110.0 <= pressure_psi <= 150.0))
is_normal = (not is_critical) and (not is_warning)

print("Status:", "CRITICAL" if is_critical else ("WARNING" if is_warning else "NORMAL"))`,
      hints: [
        'Python supports chained comparisons like `80.0 <= temperature_c <= 100.0`.',
        'Ensure conditions are mutually exclusive so multiple states do not trigger simultaneously.',
      ],
      verificationRequirements: [
        'Evaluates boundary values (80.0, 100.0, 150.0, 10.0) accurately.',
        'Correctly assigns exactly one system status for any numerical input.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b2-d7-05',
      type: 'KNOWLEDGE_CHECK',
      order: 5,
      title: 'Diagnostic Check: String Truthiness & Compound Condition Bugs',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'A junior programmer writes the following validation check:\n```python\nstatus = "FAILED"\nif status == "COMPLETED" or "IN_PROGRESS":\n    print("System is running!")\n```\nWhat happens when this code executes, and why?',
      options: [
        'Nothing prints, because `status` is "FAILED".',
        '"System is running!" prints, because `"IN_PROGRESS"` is a non-empty string which evaluates to True in a boolean context, making the `or` expression always True.',
        'A TypeError occurs because strings cannot be used with the `or` operator.',
        'Python raises a SyntaxError because `or` requires a comparison on both sides.',
      ],
      correctIndex: 1,
      explanation: 'In Python, `status == "COMPLETED" or "IN_PROGRESS"` evaluates `status == "COMPLETED"` (False), and then evaluates `"IN_PROGRESS"`. Since any non-empty string is truthy, the entire expression evaluates to `"IN_PROGRESS"` (truthy), so the if-block ALWAYS runs. The correct syntax is `status == "COMPLETED" or status == "IN_PROGRESS"`.',
      misconceptionIdentified: 'Assuming `or "VALUE"` distributes the equality check across multiple values.',
    } as KnowledgeCheckBlock,
  ],
};

// ── DAY 8: BUILD — Control Flow: Branching & Iteration Loops ──────────────────
export const DAY_8_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w2-002',
  dayNumber: 3,
  title: 'Control Flow: Branching & Iteration Loops',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b2-d8-01',
      type: 'THEORY',
      order: 1,
      title: 'Decision Trees & Iteration State Patterns',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Build conditional decision logic with if/elif/else and repetition logic with for/while loops, tracking state across iterations without functions or classes.',
      whatItIs: 'Control flow structures direct the path of code execution. `if/elif/else` branches code based on boolean truth. `for` loops iterate over ranges or sequences. `while` loops execute repeatedly as long as a condition remains True. `break` exits a loop immediately; `continue` skips to the next iteration.',
      whyItExists: 'Real software must make dynamic decisions and process repetitive data streams without duplicating code lines.',
      problemSolved: 'Replaces hardcoded repetitive code with robust, state-tracking loops and branching trees.',
      mentalModel: 'Loop State Machine: Think of a loop as a conveyor belt. On each item, a worker checks conditions, updates running counters or totals (accumulators), and decides whether to continue or stop the belt (`break`).',
      commonMistakes: [
        'Forgetting to update loop variables inside a `while` loop, creating an infinite loop.',
        'Assuming `range(1, 10)` includes the number 10 (range stop value is exclusive: 1 to 9).',
        'Modifying loop variables inside `for` loops expecting it to alter the iterator step.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b2-d8-02',
      type: 'GUIDED_LAB',
      order: 2,
      title: 'Guided Build: CLI Anomaly Stream Filter & Balancer',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Build a multi-record numerical anomaly scanner that computes running totals, filters invalid entries, and breaks on critical fault flags using loops and conditions.',
      instructions: [
        'Initialize state variables: `valid_count = 0`, `anomaly_count = 0`, `running_sum = 0.0`.',
        'Iterate over a sequence of numerical sensor readings.',
        'If reading is negative (`reading < 0`), skip it using `continue` and increment `anomaly_count`.',
        'If reading exceeds emergency threshold (`reading > 999.0`), trigger emergency shutdown with `break`.',
        'Otherwise, add reading to `running_sum` and increment `valid_count`.',
        'Print final telemetry summary.',
      ],
      starterFiles: {
        'anomaly_scanner.py': `# Simulation data (readings stream)
readings = [12.5, 45.0, -3.2, 88.1, 1020.0, 33.4]

valid_count = 0
anomaly_count = 0
running_sum = 0.0
emergency_stopped = False

for val in readings:
    if val > 999.0:
        print(f"🚨 EMERGENCY OVERLOAD DETECTED: {val}! Halting stream.")
        emergency_stopped = True
        break
    if val < 0.0:
        print(f"⚠️ Anomaly skipped: {val}")
        anomaly_count += 1
        continue
    
    running_sum += val
    valid_count += 1

print("\\n── Scan Summary ──")
print(f"Valid Readings: {valid_count}")
print(f"Anomalies Filtered: {anomaly_count}")
print(f"Running Total: {running_sum:.2f}")
print(f"Emergency Stopped: {emergency_stopped}")`,
      },
      expectedBehavior: 'Program processes valid readings, filters anomalies, breaks on critical value, and reports accurate totals.',
    } as GuidedLabBlock,
    {
      id: 'blk-b2-d8-03',
      type: 'INDEPENDENT_PRACTICE',
      order: 3,
      title: 'Independent Practice: Transaction Ledger Audit Balancer',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      task: 'Write a script that processes a list of transaction amounts (positive for credits, negative for debits) and validates that the account balance never drops below the allowed overdraft limit of -$500.00. Report the final balance, total credits, total debits, and whether an overdraft violation occurred.',
      starterCode: `transactions = [250.0, -100.0, -300.0, -400.0, 50.0]
overdraft_limit = -500.0

current_balance = 0.0
total_credits = 0.0
total_debits = 0.0
violation_occurred = False

# TODO: Process transactions with a loop
# Update balance, credits, debits, and flag violation if balance < overdraft_limit`,
      hints: [
        'Check if `current_balance + amount < overdraft_limit` to detect overdraft breaches.',
        'Use `if amount > 0:` to separate credits from debits.',
      ],
      verificationRequirements: [
        'Tracks credits, debits, and running balance accurately.',
        'Detects overdraft breaches and records the breach point.',
      ],
    } as IndependentPracticeBlock,
    {
      id: 'blk-b2-d8-04',
      type: 'REFLECTION',
      order: 4,
      title: 'Architectural Reflection: Loop Selection & Termination Guarantees',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'When should a software engineer choose a `for` loop versus a `while` loop? What mathematical guarantee must every `while` loop satisfy to prevent freezing production servers?',
      guidingQuestions: [
        'How does knowing the collection size or range boundary in advance influence your loop choice?',
        'What is a loop invariant, and how does state mutation ensure progress toward loop termination?',
      ],
    } as ReflectionBlock,
  ],
};

// ── DAY 9: DEBUG / DEEPEN — Edge Cases in Loop Termination & State Mutation ───
export const DAY_9_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w2-002',
  dayNumber: 4,
  title: 'Edge Cases in Loop Termination & State Mutation',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b2-d9-01',
      type: 'THEORY',
      order: 1,
      title: 'Diagnosing Control-Flow & Boundary Faults with the 8-Stage Method',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Apply the 8-stage troubleshooting methodology (Observe -> Reproduce -> Form Hypothesis -> Inspect -> Identify Root Cause -> Fix -> Verify -> Explain) to control flow bugs, off-by-one errors, and state corruption.',
      whatItIs: 'Control flow debugging focuses on identifying why code executed a branch it shouldn\'t have, why a loop terminated prematurely or ran forever, or why accumulated state variables contain incorrect values.',
      whyItExists: 'Most production outages in algorithmic logic are not syntax errors, but boundary bugs (off-by-one, unhandled edge conditions, state mutation in the wrong block).',
      problemSolved: 'Transforms guessing into disciplined, deterministic diagnosis of loop invariants and boundary states.',
      mentalModel: 'Trace Table Mental Model: Step through code line by line with a paper table tracking each variable value at every iteration step.',
    } as TheoryBlock,
    {
      id: 'blk-b2-d9-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge 1: The Zombie While Loop (State Stagnation)',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A script intended to process sensor queue batches hangs indefinitely and never finishes. The developer wrote a `while` loop with a counter, but when certain values appear, the terminal freezes.',
      symptom: 'Process consumes 100% CPU and never prints the completion message.',
      brokenArtifact: `# queue_processor.py
items = [10, 20, 0, 40, 50]
index = 0
total = 0

# DEFECT: When item == 0, continue skips the index increment!
while index < len(items):
    item = items[index]
    if item == 0:
        continue # Infinite loop: index is never incremented when item is 0!
    total += item
    index += 1

print("Processing complete! Total:", total)`,
      expectedBehavior: 'Script increments `index` reliably on EVERY iteration before or alongside any `continue` statement, allowing the loop to reach termination.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Trace the loop execution when `index = 2` and `items[index] = 0`.',
        'Hint 2: What happens to the `index` variable when `continue` executes?',
        'Hint 3: In a while loop, state advancement must happen before `continue`, or prefer a `for` loop over indices.',
      ],
      targetCompetencyId: COMPETENCY_ID_SYNTAX_MODEL,
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b2-d9-03',
      type: 'DEBUGGING_CHALLENGE',
      order: 3,
      title: 'Debugging Challenge 2: The Boundary Omission Off-by-One in Range',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      problemDescription: 'A billing calculator calculates monthly compound interest over `N` months. For a 12-month period, it consistently undercalculates total interest by exactly 1 month of yield.',
      symptom: 'Expected 12 compounding cycles, but loop only executes 11 times for period = 12.',
      brokenArtifact: `# interest_calculator.py
principal = 1000.0
monthly_rate = 0.01 # 1% per month
months = 12

balance = principal
# DEFECT: range(1, months) generates numbers 1 to 11 (only 11 cycles!)
for month in range(1, months):
    interest = balance * monthly_rate
    balance += interest

print(f"Final Balance after {months} months: {balance:.2f}")`,
      expectedBehavior: 'Loop executes exactly 12 times by using `range(1, months + 1)` or `range(months)`, correctly calculating full 12-month compounded balance.',
      difficulty: 'BEGINNER',
      hints: [
        'Hint 1: Python `range(start, stop)` is half-open: it includes `start` but excludes `stop`.',
        'Hint 2: How many elements are in `range(1, 12)`?',
        'Hint 3: Change stop parameter to `months + 1` or use `range(months)`.',
      ],
      targetCompetencyId: COMPETENCY_ID_SYNTAX_MODEL,
    } as DebuggingChallengeBlock,
  ],
};

// ── DAY 10: TRANSFER + ASSESSMENT — Multi-Record Stream Validator CLI ─────────
export const DAY_10_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m1-w2-002',
  dayNumber: 5,
  title: 'Multi-Record Stream Validator CLI',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b2-d10-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Multi-Record Telemetry Stream Validator',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      unfamiliarDomainContext: 'Industrial Logistics & Sensor Telemetry: You are tasked with writing a raw stream record validator that parses multi-line text buffers from freight containers, validating sensor thresholds, calculating accumulated payloads, and flagging safety anomalies.',
      task: `Implement a standalone Python validator function:
\`validate_telemetry_stream(raw_stream: str) -> dict\`

The function receives a multi-line string where each non-empty line represents one sensor record formatted as:
\`RECORD_ID,TEMPERATURE,WEIGHT_KG,STATUS_CODE\`

Example raw_stream input:
"""
REC001,24.5,150.0,OK
REC002,-5.0,220.5,OK
REC003,110.2,85.0,ERR
"""

The function must parse each record using basic string splitting and control flow, returning a summary telemetry dictionary:
{
  "total_records": int,          # Total non-empty lines processed
  "valid_records": int,          # Count of records meeting all safety rules
  "anomaly_records": int,        # Count of records violating safety rules
  "cumulative_weight": float,    # Sum of WEIGHT_KG for valid records (rounded to 2 decimal places)
  "max_temperature": float,      # Highest temperature observed across all valid records (or 0.0 if none)
  "stream_status": "NORMAL" | "DEGRADED" | "CRITICAL"
}

VALIDATION & STATUS RULES:
1. An individual record is VALID if:
   - TEMPERATURE is between -20.0 and 85.0 (inclusive)
   - WEIGHT_KG is > 0.0 and <= 1000.0
   - STATUS_CODE is exactly "OK"
2. An individual record is an ANOMALY if it violates ANY of the above rules.
3. STREAM_STATUS Rules:
   - If anomaly_records == 0 and total_records > 0: "NORMAL"
   - If 1 <= anomaly_records <= 2: "DEGRADED"
   - If anomaly_records > 2 or total_records == 0: "CRITICAL"
4. If raw_stream is empty or None: return total_records: 0, valid_records: 0, anomaly_records: 0, cumulative_weight: 0.0, max_temperature: 0.0, stream_status: "CRITICAL".`,
      constraints: [
        'Strictly zero external packages: use ONLY Python core syntax, loops, and conditions.',
        'Do NOT use file I/O (open()) or JSON/CSV libraries; parse the provided text stream directly.',
        'Must handle boundary values (e.g. temperature = -20.0 or 85.0) accurately.',
        'Must handle empty strings or None input gracefully without crashing.',
      ],
      difficulty: 'BEGINNER',
      timeExpectationMinutes: 45,
      targetCompetencyId: COMPETENCY_ID_SYNTAX_MODEL,
      assessmentRef: 'asm-pfs-m1-w2-syntax-001',
    } as TransferChallengeBlock,
  ],
};

// ── DAY 10 INDEPENDENT FORMATIVE ASSESSMENT ──────────────────────────────────
export const DAY_10_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m1-w2-syntax-001',
  assessmentCode: 'ASM-PFS-M1-W2-SYNTAX',
  title: 'Python Core Syntax, Operators & Control Flow Stream Assessment',
  description: 'Independent formative learning assessment evaluating string stream parsing, operator expressions, loop accumulators, and boundary state reasoning within the formative sandbox.',
  type: 'CODE',
  mode: 'FORMATIVE',
  version: '1.0.0',
  status: 'PUBLISHED',
  difficulty: 'BEGINNER',
  timeLimitMinutes: 45,
  attemptPolicy: 'LIMITED_BEST',
  maxAttempts: 3,
  passingScore: 75,
  targetCompetencyId: COMPETENCY_ID_SYNTAX_MODEL,
  items: [
    {
      id: 'item-syntax-01',
      assessmentId: 'asm-pfs-m1-w2-syntax-001',
      version: '1.0.0',
      itemType: 'CODE',
      prompt: `Write a function \`validate_telemetry_stream(raw_stream)\` in Python that parses raw multi-line sensor records, computes accumulators, validates boundary thresholds, and returns the telemetry summary dictionary.`,
      points: 100,
      order: 1,
      timeEstimateMinutes: 30,
      visibleTests: [
        {
          id: 'vt-syn-01',
          name: 'Standard Stream Normal Processing',
          input: '{"raw_stream": "R1,20.0,100.0,OK\\nR2,25.0,200.0,OK"}',
          expectedOutput: '{"total_records": 2, "valid_records": 2, "anomaly_records": 0, "cumulative_weight": 300.0, "max_temperature": 25.0, "stream_status": "NORMAL"}',
          tier: 'VISIBLE',
        },
        {
          id: 'vt-syn-02',
          name: 'Single Anomaly Detection (Degraded Status)',
          input: '{"raw_stream": "R1,20.0,100.0,OK\\nR2,95.0,200.0,OK"}',
          expectedOutput: '{"total_records": 2, "valid_records": 1, "anomaly_records": 1, "cumulative_weight": 100.0, "max_temperature": 20.0, "stream_status": "DEGRADED"}',
          tier: 'VISIBLE',
        },
      ],
      privateTests: [
        {
          id: 'pt-syn-01',
          name: 'Boundary Value Inclusions (-20.0, 85.0, 1000.0)',
          input: '{"raw_stream": "R1,-20.0,1000.0,OK\\nR2,85.0,50.0,OK"}',
          expectedOutput: '{"total_records": 2, "valid_records": 2, "anomaly_records": 0, "cumulative_weight": 1050.0, "max_temperature": 85.0, "stream_status": "NORMAL"}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-syn-02',
          name: 'Empty and Whitespace-Only Streams (Critical Status)',
          input: '{"raw_stream": ""}',
          expectedOutput: '{"total_records": 0, "valid_records": 0, "anomaly_records": 0, "cumulative_weight": 0.0, "max_temperature": 0.0, "stream_status": "CRITICAL"}',
          tier: 'PRIVATE',
        },
        {
          id: 'pt-syn-03',
          name: 'Multiple Anomalies (> 2 Anomaly Critical Status)',
          input: '{"raw_stream": "R1,100.0,50.0,OK\\nR2,20.0,1500.0,OK\\nR3,25.0,50.0,ERR"}',
          expectedOutput: '{"total_records": 3, "valid_records": 0, "anomaly_records": 3, "cumulative_weight": 0.0, "max_temperature": 0.0, "stream_status": "CRITICAL"}',
          tier: 'PRIVATE',
        },
      ],
      integrityTests: [
        {
          id: 'it-syn-01',
          name: 'Anti-Hardcoding Dynamic Stream Probe',
          input: '{"probe_vector": "RANDOM_TELEMETRY_STREAM"}',
          expectedOutput: '{"computed_dynamically": true, "not_static_mock": true}',
          tier: 'INTEGRITY',
        },
      ],
      rubricDimensions: [
        { id: 'rub-syn-01', name: 'Correctness', description: 'Accurately parses records, filters anomalies, and calculates weights/max temperatures.', weight: 0.40, maxPoints: 40 },
        { id: 'rub-syn-02', name: 'Reasoning', description: 'Uses clean conditional branching and accumulator logic without brittle assumptions.', weight: 0.20, maxPoints: 20 },
        { id: 'rub-syn-03', name: 'EdgeCaseRobustness', description: 'Edge-Case Robustness: Handles boundary values (-20.0, 85.0, 1000.0) and empty inputs safely.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-syn-04', name: 'Performance', description: 'Processes stream in linear O(N) single-pass iteration without redundant traversals.', weight: 0.15, maxPoints: 15 },
        { id: 'rub-syn-05', name: 'CodeQuality', description: 'Clean variable naming, clear loop structure, readability, and comments.', weight: 0.10, maxPoints: 10 },
      ],
    },
  ],
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};

// ── BATCH 002 COMPLETE MANIFEST (DAYS 6–10) ──────────────────────────────────
export const BATCH_002_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m1-w2-002',
  batchCode: 'P1-M1-W2-BATCH002',
  title: 'Python Core Syntax & Object Model (Days 6–10)',
  difficulty: 'BEGINNER',
  days: [
    DAY_6_MANIFEST,
    DAY_7_MANIFEST,
    DAY_8_MANIFEST,
    DAY_9_MANIFEST,
    DAY_10_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};
