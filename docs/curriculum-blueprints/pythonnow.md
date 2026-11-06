# 🐍 PinIT Python Programming & Backend Systems — Gold-Standard Master Curriculum Specification (v1.0)
**Course ID**: `course-python-backend` | **Target**: Beginners, Struggling Learners & Career Switchers
**Pedagogical Blueprint**: 1-Concept Teaching Budget • Everyday Physical Metaphors • 100% Runnable Python Sandboxes • 3-Step Socratic Recovery Ladders • 0 JS Placeholders • Isolated Sandbox Execution

---

## 📋 Comprehensive 30-Day Curriculum Structure & Milestones

| Day | Title | Blocks | Milestones / Key Focus | Proctored Test Assertions |
|:---:|:---|:---:|:---|:---:|
| **Day 1** | Program Execution, print(), Case-Sensitivity & Comments | 4 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 2** | Variables, Dynamic Typing & The type() Function | 3 Blocks | Core Micro-Learning | 7 Multi-Case Assertions |
| **Day 3** | User Input, String Parsing & Type Casting (int, float, str) | 3 Blocks | Core Micro-Learning | 6 Multi-Case Assertions |
| **Day 4** | Arithmetic Operations, Float Division /, Floor Division // & Modulo % | 3 Blocks | Core Micro-Learning | 7 Multi-Case Assertions |
| **Day 5** | ⭐ MILESTONE 1: Interactive Decision Console & Rule Engine | 4 Blocks | ⭐ Milestone Project | 8 Multi-Case Assertions |
| **Day 6** | The while Loop & Sentinel Input Validation | 3 Blocks | Core Micro-Learning | 5 Multi-Case Assertions |
| **Day 7** | The for Loop with range() & The Accumulator Pattern | 3 Blocks | Core Micro-Learning | 6 Multi-Case Assertions |
| **Day 8** | Nested Loops, Grid Traversal & String Formatting (f-strings) | 3 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 9** | Functions with def, Parameters, Return Values & Docstrings | 3 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 10** | ⭐ MILESTONE 2: Multi-Function Financial Utility Engine & Stack Frames | 3 Blocks | ⭐ Milestone Project | 4 Multi-Case Assertions |
| **Day 11** | Python Lists — Indexing, Slicing [start:stop:step] & CRUD Operations | 3 Blocks | Core Micro-Learning | 5 Multi-Case Assertions |
| **Day 12** | List Comprehensions, Filtering & In-Place vs Copy Sorting | 3 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 13** | Tuples (Immutability) & Sets (Uniqueness & O(1) Lookups) | 3 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 14** | Dictionaries — Key-Value Mapping & O(1) Hash Lookups | 3 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 15** | ⭐ MILESTONE 3: Fast Ledger Lookup & Dictionary Search Engine | 3 Blocks | ⭐ Milestone Project | 3 Multi-Case Assertions |
| **Day 16** | Object-Oriented Programming — Classes, self & Object Instantiation | 3 Blocks | Core Micro-Learning | 3 Multi-Case Assertions |
| **Day 17** | Constructors (__init__), Default Values & Instance State | 3 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 18** | Encapsulation, Private Attributes (_var, __var) & Properties (@property) | 3 Blocks | Core Micro-Learning | 5 Multi-Case Assertions |
| **Day 19** | Inheritance (class Child(Parent)), Method Overriding & super() | 3 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 20** | Polymorphism, Duck Typing & Magic Methods (__str__, __len__, __eq__) | 3 Blocks | Core Micro-Learning | 3 Multi-Case Assertions |
| **Day 21** | ⭐ MILESTONE 4: Enterprise Polymorphic Payment Gateway Engine | 3 Blocks | ⭐ Milestone Project | 4 Multi-Case Assertions |
| **Day 22** | Exception Handling — try, except, else, finally & Custom Exceptions | 3 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 23** | Context Managers & Safe File I/O (with open(...) as f:) | 3 Blocks | Core Micro-Learning | 3 Multi-Case Assertions |
| **Day 24** | JSON Serialization & Deserialization (json.dumps, json.loads) | 3 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 25** | Decorators, Higher-Order Functions & Lambda Expressions | 3 Blocks | Core Micro-Learning | 2 Multi-Case Assertions |
| **Day 26** | ⭐ MILESTONE 5: Word Frequency & Inverted Index Search Engine | 3 Blocks | ⭐ Milestone Project | 3 Multi-Case Assertions |
| **Day 27** | Asynchronous Python (async, await & asyncio Event Loops) | 3 Blocks | Core Micro-Learning | 2 Multi-Case Assertions |
| **Day 28** | Modern Type Hints, Static Typing & Pydantic Data Models | 3 Blocks | Core Micro-Learning | 5 Multi-Case Assertions |
| **Day 29** | Web API Architecture with FastAPI & HTTP Route Controllers | 3 Blocks | Core Micro-Learning | 4 Multi-Case Assertions |
| **Day 30** | 🏆 FINAL CAPSTONE: Enterprise High-Performance Transaction Ledger Auditor & Backend API | 4 Blocks | 🏆 Final Capstone | 4 Multi-Case Assertions |

---

# 📅 DAY 1: PROGRAM EXECUTION, PRINT(), CASE-SENSITIVITY & COMMENTS

> **Everyday Core Metaphor**: A Python program is like a cooking recipe: the Python interpreter reads your instructions line by line from top to bottom, executing each step exactly in order.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Sequential line-by-line execution
- **Concept**: The print() function with single and multiple arguments
- **Concept**: Single-line (#) comments and case sensitivity rules

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: What is an Instruction? (Top-to-Bottom Flow) (`py-d1-b1-execution-order`)

* **Primary Concept Budget**: `Sequential Execution`
* **Supporting Terms**: Line-by-Line, Interpreter

##### 💡 Real-World Physical Analogy: *A Musical Playlist*
A music player plays song 1, then song 2, then song 3 in exact order. Python runs line 1, then line 2, then line 3.

##### 🔄 Sequential Execution Flowchart
* [PROCESS] **Line 1: print('Step 1: Boil water')**
* [PROCESS] **Line 2: print('Step 2: Add tea leaves')**
* [END] **Line 3: print('Step 3: Pour cup')**

##### 💻 Runnable Interactive Python Sandbox (`recipe.py`)
```python
print('Step 1: Boil water')
print('Step 2: Add tea leaves')
print('Step 3: Pour cup')
```
**Expected Terminal Execution Output**:
```text
Step 1: Boil water
Step 2: Add tea leaves
Step 3: Pour cup
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_EXECUTION_ORDER`
* **Question**: **If line 1 prints 'Apple' and line 2 prints 'Banana', what prints first?**
* **Expected Exact Value**: `Apple`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Banana` (Misconception: `MC_PY_EXECUTION_ORDER`)
  1. 🛑 *What Went Wrong*: Python executes line 1 before line 2.
  2. 💡 *Simpler Everyday Picture*: Python reads from top to bottom, like reading a book.
  3. 🛠️ *Guided Fix Prompt*: **Type Apple**


#### 🔹 Slide 2: The print() Function — Displaying Messages (`py-d1-b2-print-function`)

* **Primary Concept Budget**: `print() Function`
* **Supporting Terms**: Parentheses (), String Arguments
* **Prerequisites**: `py-d1-b1-execution-order` (understood)

##### 💡 Real-World Physical Analogy: *The Megaphone*
The print() function is a megaphone: whatever you put inside its parentheses gets spoken out loud to the terminal screen.

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
print('Hello, Python!')
```
* **Line 1**: print is the command; parentheses () hold what to display; quotes '' surround text.

##### 💻 Runnable Interactive Python Sandbox (`hello.py`)
```python
print('Hello, Python!')
print('Welcome to PinIT Career OS!')
```
**Expected Terminal Execution Output**:
```text
Hello, Python!
Welcome to PinIT Career OS!
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_MISSING_QUOTES_STRING`
* **Question**: **What is required to print text in Python?**
  ✅ **Option A**: Surrounding the text with quotes like print('Hello')
  ❌ **Option B**: Writing the text without quotes like print(Hello)
  ❌ **Option C**: Ending every line with a semicolon ;

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_MISSING_QUOTES_STRING`)
  1. 🛑 *What Went Wrong*: Text without quotes is treated as a variable name and triggers NameError.
  2. 💡 *Simpler Everyday Picture*: Quotes ' ' tell Python: this is raw text words, not a code command.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Case Sensitivity (print vs Print vs PRINT) (`py-d1-b3-case-sensitivity`)

* **Primary Concept Budget**: `Case Sensitivity`
* **Supporting Terms**: Lowercase, NameError
* **Prerequisites**: `py-d1-b2-print-function` (understood)

##### 💡 Real-World Physical Analogy: *A Locked Password*
A password with lowercase letters will reject uppercase. Python treats 'print' and 'Print' as completely different words.

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```python
# ❌ BROKEN / BUGGY PATTERN
Print('Hello World')  # ❌ NameError: name 'Print' is not defined

# ✅ CORRECT / PRODUCTION FIX
print('Hello World')  # ✅ Correct lowercase function call
```
* **Error Reason**: Python built-in keywords and functions are strictly lowercase.
* **Fix Explanation**: Change capital 'P' to lowercase 'p'.

##### 💻 Runnable Interactive Python Sandbox (`casing.py`)
```python
print('Lowercase print works!')
```
**Expected Terminal Execution Output**:
```text
Lowercase print works!
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_PRINT_CASE_SENSITIVITY`
* **Question**: **Which of the following will run without error in Python?**
  ✅ **Option A**: print('Hello')
  ❌ **Option B**: Print('Hello')
  ❌ **Option C**: PRINT('Hello')

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_PRINT_CASE_SENSITIVITY`)
  1. 🛑 *What Went Wrong*: Python is case-sensitive: Print with capital P is undefined.
  2. 💡 *Simpler Everyday Picture*: Python commands are strictly lowercase.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A: print('Hello')**


#### 🔹 Slide 4: Single-Line Comments (#) (`py-d1-b4-comments`)

* **Primary Concept Budget**: `Code Comments`
* **Supporting Terms**: Hash Symbol #, Ignored by Interpreter
* **Prerequisites**: `py-d1-b1-execution-order` (understood)

##### 💡 Real-World Physical Analogy: *Sticky Notes on a Document*
Sticky notes explain the document to human readers. Python completely skips any line starting with #.

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
# This is a note for developers
print('Visible Output')
```
* **Line 1**: Lines starting with # are skipped by the interpreter.
* **Line 2**: This line executes normally.

##### 💻 Runnable Interactive Python Sandbox (`comments.py`)
```python
# Calculate discount
print('Total: $50')
```
**Expected Terminal Execution Output**:
```text
Total: $50
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_EXECUTION_ORDER`
* **Question**: **What is printed by: # print('Hidden')\nprint('Shown')**
* **Expected Exact Value**: `Shown`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Hidden` (Misconception: `MC_PY_EXECUTION_ORDER`)
  1. 🛑 *What Went Wrong*: The line with # is a comment and was completely ignored by Python.
  2. 💡 *Simpler Everyday Picture*: # means Python ignores the line entirely.
  3. 🛠️ *Guided Fix Prompt*: **Type Shown**


### ⚡ Quest 2: Proctored Coding Exam — System Initialization Banner Printer

**Problem Statement**:
Write a Python function `get_system_banner(system_name: str, version: str) -> str` that returns 'SYSTEM: <system_name> | VERSION: <version> | STATUS: ONLINE'.

**Socratic Mentor Hint**: *Use an f-string: f'SYSTEM: {system_name} | VERSION: {version} | STATUS: ONLINE'*

#### 💻 Exam Starter Code (`solution.py`)
```python
def get_system_banner(system_name: str, version: str) -> str:
    # Return formatted system banner
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert get_system_banner('AUTH_SRV', '1.0.4') == 'SYSTEM: AUTH_SRV | VERSION: 1.0.4 | STATUS: ONLINE', 'Test 1 Failed'
assert get_system_banner('CORE', '2.0.0') == 'SYSTEM: CORE | VERSION: 2.0.0 | STATUS: ONLINE', 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Receipt Header Formatter

**Problem Statement**:
Write a Python function `format_receipt_header(store_name: str, terminal_id: int) -> str` returning '*** <STORE_NAME> (TERM #<terminal_id>) ***'.

**Socratic Mentor Hint**: *Return f'*** {store_name} (TERM #{terminal_id}) ***'*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def format_receipt_header(store_name: str, terminal_id: int) -> str:
    # Format receipt header with store name and terminal id
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert format_receipt_header('METRO MART', 4) == '*** METRO MART (TERM #4) ***', 'Test 1 Failed'
assert format_receipt_header('PINIT STORE', 12) == '*** PINIT STORE (TERM #12) ***', 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 2: VARIABLES, DYNAMIC TYPING & THE TYPE() FUNCTION

> **Everyday Core Metaphor**: A variable is like a sticky label attached to a box in memory: name = 'Alex' sticks the name tag 'name' onto the string object 'Alex'.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Variables as name tags pointing to objects in heap memory
- **Concept**: Primitive data types: int, float, str, bool
- **Concept**: Inspecting data types with type() and isinstance()

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Variable Assignment with = (`py-d2-b1-variables`)

* **Primary Concept Budget**: `Variable Assignment`
* **Supporting Terms**: Identifier, Assignment Operator =
* **Prerequisites**: `py-d1-b2-print-function` (understood)

##### 💡 Real-World Physical Analogy: *A Labeled Storage Box*
Creating age = 25 is like labeling a box 'age' and putting the number 25 inside it.

##### 📦 Memory Box Model (Heap & Pointer State)
| Variable Name | Stored Value | Type | Updated |
|:---|:---|:---|:---:|
| `user_name` | `'Sarah'` | `str` | — |
| `user_age` | `21` | `int` | — |

##### 💻 Runnable Interactive Python Sandbox (`variables.py`)
```python
score = 100
print('Score:', score)
score = 150
print('Updated Score:', score)
```
**Expected Terminal Execution Output**:
```text
Score: 100
Updated Score: 150
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_VARIABLE_REASSIGNMENT`
* **Question**: **If x = 10 and then x = 20, what does print(x) display?**
* **Expected Exact Value**: `20`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `10` (Misconception: `MC_PY_VARIABLE_REASSIGNMENT`)
  1. 🛑 *What Went Wrong*: Assigning x = 20 overwrites the previous value 10 in variable x.
  2. 💡 *Simpler Everyday Picture*: Variables hold the LATEST value assigned to them.
  3. 🛠️ *Guided Fix Prompt*: **Type 20**


#### 🔹 Slide 2: Core Data Types: int, float, str, bool (`py-d2-b2-data-types`)

* **Primary Concept Budget**: `Primitive Data Types`
* **Supporting Terms**: int, float, str, bool
* **Prerequisites**: `py-d2-b1-variables` (understood)

##### 💡 Real-World Physical Analogy: *Item Categorization in a Pantry*
Whole apples (int), liquid liters (float), labels on jars (str), and light switch ON/OFF (bool).

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
items = 5        # int (whole number)
price = 19.99    # float (decimal)
label = 'Book'   # str (text)
in_stock = True  # bool (True/False)
```
* **Line 1**: int for integer counts.
* **Line 2**: float for decimal numbers.
* **Line 3**: str for text inside quotes.
* **Line 4**: bool for True or False (capitalized).

##### 💻 Runnable Interactive Python Sandbox (`types_demo.py`)
```python
print(type(42))
print(type(3.14))
print(type('Hello'))
print(type(True))
```
**Expected Terminal Execution Output**:
```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_DYNAMIC_TYPE_MISMATCH`
* **Question**: **What is the data type of the value 3.14 in Python?**
  ✅ **Option A**: float
  ❌ **Option B**: int
  ❌ **Option C**: str

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_DYNAMIC_TYPE_MISMATCH`)
  1. 🛑 *What Went Wrong*: Numbers with decimal points are float, not int.
  2. 💡 *Simpler Everyday Picture*: int = whole numbers (5); float = decimals (3.14).
  3. 🛠️ *Guided Fix Prompt*: **Select Option A: float**


#### 🔹 Slide 3: Dynamic Typing in Python (`py-d2-b3-dynamic-typing`)

* **Primary Concept Budget**: `Dynamic Typing`
* **Supporting Terms**: Rebinding, Runtime Type
* **Prerequisites**: `py-d2-b2-data-types` (understood)

##### 💡 Real-World Physical Analogy: *The Swappable Label*
In Python, a variable can point to a number on line 1, and be rebound to point to text on line 2.

##### 💻 Runnable Interactive Python Sandbox (`dynamic.py`)
```python
data = 100
print('data is:', type(data))
data = 'Now I am a string'
print('data is now:', type(data))
```
**Expected Terminal Execution Output**:
```text
data is: <class 'int'>
data is now: <class 'str'>
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_DYNAMIC_TYPE_MISMATCH`
* **Question**: **In Python, can a variable holding an integer later hold a string?**
  ✅ **Option A**: Yes, Python variables dynamically rebind to any type
  ❌ **Option B**: No, Python variables are permanently locked to one type
  ❌ **Option C**: Only if you declare it with var

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_DYNAMIC_TYPE_MISMATCH`)
  1. 🛑 *What Went Wrong*: Python is dynamically typed; variables can hold any object type.
  2. 💡 *Simpler Everyday Picture*: Python variable names are just tags that can point to any new object.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored Coding Exam — Payload Type Inspector

**Problem Statement**:
Write a Python function `identify_data_type(val) -> str` that returns 'INTEGER', 'FLOAT', 'STRING', 'BOOLEAN', or 'OTHER'.

**Socratic Mentor Hint**: *Check isinstance(val, bool) first (since bool is a subclass of int in Python), then int, float, str.*

#### 💻 Exam Starter Code (`solution.py`)
```python
def identify_data_type(val) -> str:
    # Return string label of the type
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert identify_data_type(True) == 'BOOLEAN', 'Test 1 Failed'
assert identify_data_type(42) == 'INTEGER', 'Test 2 Failed'
assert identify_data_type(3.14) == 'FLOAT', 'Test 3 Failed'
assert identify_data_type('hello') == 'STRING', 'Test 4 Failed'
assert identify_data_type([]) == 'OTHER', 'Test 5 Failed'
print('All 5 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Sensor Tag Formatter

**Problem Statement**:
Write a Python function `format_sensor_reading(name: str, reading: float, active: bool) -> str` returning '<name>: <reading> (Active: <active>)'.

**Socratic Mentor Hint**: *Return f'{name}: {reading} (Active: {active})'*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def format_sensor_reading(name: str, reading: float, active: bool) -> str:
    # Return formatted sensor reading string
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert format_sensor_reading('TEMP_1', 24.5, True) == 'TEMP_1: 24.5 (Active: True)', 'Test 1 Failed'
assert format_sensor_reading('PRESSURE', 101.3, False) == 'PRESSURE: 101.3 (Active: False)', 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 3: USER INPUT, STRING PARSING & TYPE CASTING (INT, FLOAT, STR)

> **Everyday Core Metaphor**: The input() function is a doorway: whatever comes through from the keyboard ALWAYS arrives as a string of text, even if the user typed numbers.

### 🎯 Day Overview & Learning Objectives
- **Concept**: The input() function and string returns
- **Concept**: Explicit casting with int(), float(), str()
- **Concept**: Preventing ValueError traps with validation

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The input() Function & The String Trap (`py-d3-b1-input-returns-str`)

* **Primary Concept Budget**: `input() Return Type`
* **Supporting Terms**: Keyboard Buffer, Text String '25' vs Number 25
* **Prerequisites**: `py-d2-b2-data-types` (understood)

##### 💡 Real-World Physical Analogy: *A Fax Machine*
A fax machine sends letters printed on paper. Even if someone faxes you a number '25', it arrives as printed text on paper, not a real math coin.

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```python
# ❌ BROKEN / BUGGY PATTERN
age = input()  # User types 25 -> age is '25'
print(age + 5) # ❌ TypeError: can only concatenate str (not 'int') to str

# ✅ CORRECT / PRODUCTION FIX
age = int(input()) # Converts '25' to integer 25
print(age + 5)     # ✅ Output: 30
```
* **Error Reason**: input() returns string text; adding integer causes TypeError.
* **Fix Explanation**: Wrap input() with int() to convert text to number.

##### 💻 Runnable Interactive Python Sandbox (`input_demo.py`)
```python
simulated_input = '42'
val = int(simulated_input)
print('Value + 10 =', val + 10)
```
**Expected Terminal Execution Output**:
```text
Value + 10 = 52
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_INPUT_RETURNS_STR`
* **Question**: **If a user enters 50 into input(), what data type does Python return?**
  ✅ **Option A**: str (string '50')
  ❌ **Option B**: int (number 50)
  ❌ **Option C**: float (50.0)

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_INPUT_RETURNS_STR`)
  1. 🛑 *What Went Wrong*: input() ALWAYS returns a string, never an integer.
  2. 💡 *Simpler Everyday Picture*: input() treats everything typed as text characters.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A: str**


#### 🔹 Slide 2: Explicit Type Casting: int(), float(), str() (`py-d3-b2-type-casting`)

* **Primary Concept Budget**: `Type Conversion Functions`
* **Supporting Terms**: int(), float(), str()
* **Prerequisites**: `py-d3-b1-input-returns-str` (understood)

##### 💡 Real-World Physical Analogy: *A Melting Mold*
Pouring metal letters '42' into a number mold produces a solid math integer 42.

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
num = int('25')      # '25' -> 25
dec = float('19.99') # '19.99' -> 19.99
txt = str(100)       # 100 -> '100'
```
* **Line 1**: int() converts valid numeric string to whole number.
* **Line 2**: float() converts decimal string to floating-point number.
* **Line 3**: str() converts any value to string text.

##### 💻 Runnable Interactive Python Sandbox (`casting.py`)
```python
a = int('15')
b = float('3.5')
print('Sum:', a + b)
```
**Expected Terminal Execution Output**:
```text
Sum: 18.5
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_STR_INT_CONCAT_TYPE_ERROR`
* **Question**: **What is the output of print(int('20') + int('30'))?**
* **Expected Exact Value**: `50`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `2030` (Misconception: `MC_PY_STR_INT_CONCAT_TYPE_ERROR`)
  1. 🛑 *What Went Wrong*: int() converted both strings to numbers before adding: 20 + 30 = 50.
  2. 💡 *Simpler Everyday Picture*: int('20') is number 20. 20 + 30 = 50.
  3. 🛠️ *Guided Fix Prompt*: **Type 50**


#### 🔹 Slide 3: The ValueError Casting Trap (`py-d3-b3-value-error-trap`)

* **Primary Concept Budget**: `ValueError on Invalid Conversion`
* **Supporting Terms**: Non-Numeric Text, Exception
* **Prerequisites**: `py-d3-b2-type-casting` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```python
# ❌ BROKEN / BUGGY PATTERN
val = int('hello') # ❌ ValueError: invalid literal for int() with base 10: 'hello'

# ✅ CORRECT / PRODUCTION FIX
val = int('123')   # ✅ Valid numeric characters convert cleanly
```
* **Error Reason**: Text letters cannot be converted into base-10 integers.
* **Fix Explanation**: Only pass digits ('0'-'9') to int().

##### 💻 Runnable Interactive Python Sandbox (`safe_cast.py`)
```python
s = '99'
if s.isdigit():
    print('Converted:', int(s))
else:
    print('Cannot convert non-digits')
```
**Expected Terminal Execution Output**:
```text
Converted: 99
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_TYPE_CAST_VALUE_ERROR`
* **Question**: **What happens if you run int('abc') in Python?**
  ✅ **Option A**: Python raises a ValueError and stops execution
  ❌ **Option B**: Python returns 0
  ❌ **Option C**: Python returns 'abc'

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_TYPE_CAST_VALUE_ERROR`)
  1. 🛑 *What Went Wrong*: Python does not guess 0; it raises a ValueError when text cannot be converted.
  2. 💡 *Simpler Everyday Picture*: Python halts with an error if the text contains non-numbers.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored Coding Exam — Safe Integer Parser with Fallback

**Problem Statement**:
Write a Python function `safe_parse_int(text: str, fallback: int) -> int` that parses text to an int, or returns fallback if conversion fails.

**Socratic Mentor Hint**: *Use try...except ValueError: return fallback*

#### 💻 Exam Starter Code (`solution.py`)
```python
def safe_parse_int(text: str, fallback: int) -> int:
    # Try to convert text to int; return fallback on error
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert safe_parse_int('120', 0) == 120, 'Test 1 Failed'
assert safe_parse_int('invalid', 10) == 10, 'Test 2 Failed'
assert safe_parse_int('-45', 0) == -45, 'Test 3 Failed'
print('All 3 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Currency String to Cents Converter

**Problem Statement**:
Write a Python function `dollars_to_cents(dollar_str: str) -> int` that converts a string like '19.99' into integer cents (1999).

**Socratic Mentor Hint**: *Convert to float, multiply by 100, and round to int: round(float(dollar_str) * 100)*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def dollars_to_cents(dollar_str: str) -> int:
    # Convert dollar string to total integer cents
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert dollars_to_cents('19.99') == 1999, 'Test 1 Failed'
assert dollars_to_cents('5.00') == 500, 'Test 2 Failed'
assert dollars_to_cents('0.75') == 75, 'Test 3 Failed'
print('All 3 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 4: ARITHMETIC OPERATIONS, FLOAT DIVISION /, FLOOR DIVISION // & MODULO %

> **Everyday Core Metaphor**: Dividing 7 cookies among 2 children: / gives each child 3.5 cookies (float), // gives each child 3 whole cookies (floor), and % leaves 1 leftover cookie in the jar (modulo remainder).

### 🎯 Day Overview & Learning Objectives
- **Concept**: Addition (+), subtraction (-), multiplication (*)
- **Concept**: Float division (/) vs floor division (//)
- **Concept**: The remainder operator (%) and even/odd parity checks

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Float Division (/) vs Floor Division (//) (`py-d4-b1-slash-vs-doubleslash`)

* **Primary Concept Budget**: `Division Modes`
* **Supporting Terms**: / always returns float, // drops decimal remainder
* **Prerequisites**: `py-d2-b2-data-types` (understood)

##### 💡 Real-World Physical Analogy: *Slicing Pizza vs Whole Boxes*
/ cuts slices to give exact fractions (3.5). // only gives whole uncut slices (3).

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
exact = 7 / 2   # 3.5 (float)
whole = 7 // 2  # 3 (int - drops remainder)
```
* **Line 1**: / always produces a float in Python 3.
* **Line 2**: // truncates toward negative infinity (floor).

##### 💻 Runnable Interactive Python Sandbox (`division.py`)
```python
print('7 / 2 =', 7 / 2)
print('7 // 2 =', 7 // 2)
```
**Expected Terminal Execution Output**:
```text
7 / 2 = 3.5
7 // 2 = 3
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_INTEGER_DIVISION_SLASH`
* **Question**: **What is the output of print(9 // 2)?**
* **Expected Exact Value**: `4`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `4.5` (Misconception: `MC_PY_INTEGER_DIVISION_SLASH`)
  1. 🛑 *What Went Wrong*: // is floor division; it drops the decimal .5 to give 4.
  2. 💡 *Simpler Everyday Picture*: // gives only the whole number part.
  3. 🛠️ *Guided Fix Prompt*: **Type 4**


#### 🔹 Slide 2: The Modulo Remainder Operator (%) (`py-d4-b2-modulo`)

* **Primary Concept Budget**: `Modulo Remainder`
* **Supporting Terms**: Remainder, Parity Check (n % 2 == 0)
* **Prerequisites**: `py-d4-b1-slash-vs-doubleslash` (understood)

##### 💡 Real-World Physical Analogy: *Leftover Coins from a Vending Machine*
If an item costs $4 and you insert $10, you buy 2 items ($8) and get $2 leftover remainder.

##### 💻 Runnable Interactive Python Sandbox (`modulo.py`)
```python
print('10 % 3 =', 10 % 3)
print('8 % 2 =', 8 % 2)
```
**Expected Terminal Execution Output**:
```text
10 % 3 = 1
8 % 2 = 0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_MODULO_REMAINDER`
* **Question**: **What is 14 % 5?**
* **Expected Exact Value**: `4`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `2` (Misconception: `MC_PY_MODULO_REMAINDER`)
  1. 🛑 *What Went Wrong*: 5 goes into 14 two times (10), leaving 4 as remainder.
  2. 💡 *Simpler Everyday Picture*: 14 - 10 = 4 leftover remainder.
  3. 🛠️ *Guided Fix Prompt*: **Type 4**


#### 🔹 Slide 3: Operator Precedence & Parentheses () (`py-d4-b3-precedence`)

* **Primary Concept Budget**: `Order of Operations (PEMDAS)`
* **Supporting Terms**: Parentheses Override, Multiplication before Addition
* **Prerequisites**: `py-d4-b2-modulo` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```python
# ❌ BROKEN / BUGGY PATTERN
total = 10 + 5 * 2   # Output: 20 (5 * 2 evaluated first)

# ✅ CORRECT / PRODUCTION FIX
total = (10 + 5) * 2 # Output: 30 (Parentheses evaluated first)
```
* **Error Reason**: * has higher precedence than +.
* **Fix Explanation**: Use () around 10 + 5 to calculate sum first.

##### 💻 Runnable Interactive Python Sandbox (`precedence.py`)
```python
print('10 + 5 * 2 =', 10 + 5 * 2)
print('(10 + 5) * 2 =', (10 + 5) * 2)
```
**Expected Terminal Execution Output**:
```text
10 + 5 * 2 = 20
(10 + 5) * 2 = 30
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_OPERATOR_PRECEDENCE`
* **Question**: **What is the output of print(2 + 3 * 4)?**
* **Expected Exact Value**: `14`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `20` (Misconception: `MC_PY_OPERATOR_PRECEDENCE`)
  1. 🛑 *What Went Wrong*: Multiplication happens before addition: 3 * 4 = 12; 2 + 12 = 14.
  2. 💡 *Simpler Everyday Picture*: Multiply first: 3*4=12, then add 2 = 14.
  3. 🛠️ *Guided Fix Prompt*: **Type 14**


### ⚡ Quest 2: Proctored Coding Exam — Time Splitter: Total Seconds to Hours, Minutes, Seconds

**Problem Statement**:
Write a Python function `split_seconds(total_seconds: int) -> tuple` returning `(hours, minutes, seconds)`.

**Socratic Mentor Hint**: *hours = total_seconds // 3600; rem = total_seconds % 3600; minutes = rem // 60; seconds = rem % 60*

#### 💻 Exam Starter Code (`solution.py`)
```python
def split_seconds(total_seconds: int) -> tuple:
    # Return (hours, minutes, seconds)
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert split_seconds(3665) == (1, 1, 5), 'Test 1 Failed'
assert split_seconds(60) == (0, 1, 0), 'Test 2 Failed'
assert split_seconds(7200) == (2, 0, 0), 'Test 3 Failed'
print('All 3 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Even/Odd Number Classifier

**Problem Statement**:
Write a Python function `is_even(n: int) -> bool` returning True if n is even, False otherwise.

**Socratic Mentor Hint**: *Return n % 2 == 0*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def is_even(n: int) -> bool:
    # Return True if even, False if odd
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert is_even(4) == True, 'Test 1 Failed'
assert is_even(7) == False, 'Test 2 Failed'
assert is_even(0) == True, 'Test 3 Failed'
assert is_even(-2) == True, 'Test 4 Failed'
print('All 4 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 5: ⭐ MILESTONE 1: INTERACTIVE DECISION CONSOLE & RULE ENGINE

> **Everyday Core Metaphor**: Milestone 1 — Decision Engine: An if/elif/else ladder is like a security guard checking credentials at a building door: if VIP pass -> enter penthouse; elif regular ticket -> enter lobby; else -> reject entry.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Comparison operators (==, !=, <, <=, >, >=)
- **Concept**: Boolean operators (and, or, not) and truth tables
- **Concept**: Milestone Project: Loan Eligibility & Risk Rule Engine

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The if Statement & Indentation Blocks (`py-d5-b1-if-condition`)

* **Primary Concept Budget**: `if Condition & Indentation`
* **Supporting Terms**: Colon :, 4-Space Indentation
* **Prerequisites**: `py-d4-b3-precedence` (understood)

##### 💡 Real-World Physical Analogy: *A Door with a Passcode*
If the passcode matches (True), the door opens and you step inside (indented block). If False, you skip the room entirely.

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
score = 85
if score >= 50:
    print('Pass') # Indented with 4 spaces
```
* **Line 2**: if statement must end with colon :
* **Line 3**: Code inside if block MUST be indented by 4 spaces.

##### 💻 Runnable Interactive Python Sandbox (`if_demo.py`)
```python
score = 85
if score >= 50:
    print('Status: PASS')
print('Check complete.')
```
**Expected Terminal Execution Output**:
```text
Status: PASS
Check complete.
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_INDENTATION_SYNTAX`
* **Question**: **How does Python know which lines of code belong inside an if statement?**
  ✅ **Option A**: By looking at the indentation (4 spaces) of the lines
  ❌ **Option B**: By looking for curly braces { }
  ❌ **Option C**: By looking for the word 'then'

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_INDENTATION_SYNTAX`)
  1. 🛑 *What Went Wrong*: Python uses indentation (spaces), NOT curly braces { }.
  2. 💡 *Simpler Everyday Picture*: Python defines code blocks with 4-space indentation.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: The else Fallback Branch (`py-d5-b2-else-branch`)

* **Primary Concept Budget**: `else Branch`
* **Supporting Terms**: Fallback, Mutually Exclusive
* **Prerequisites**: `py-d5-b1-if-condition` (understood)

##### 💡 Real-World Physical Analogy: *A Two-Fork Road*
A car can go left OR right, but never both at the same time. If condition is False, the else path is taken.

##### 💻 Runnable Interactive Python Sandbox (`else_demo.py`)
```python
age = 16
if age >= 18:
    print('Eligible to vote')
else:
    print('Too young to vote')
```
**Expected Terminal Execution Output**:
```text
Too young to vote
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_ELSE_BRANCH_LOGIC`
* **Question**: **What is printed by: x = 5\nif x > 10: print('High')\nelse: print('Low')**
* **Expected Exact Value**: `Low`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `High` (Misconception: `MC_PY_ELSE_BRANCH_LOGIC`)
  1. 🛑 *What Went Wrong*: 5 is not greater than 10, so the else branch executes.
  2. 💡 *Simpler Everyday Picture*: Condition is False -> else runs.
  3. 🛠️ *Guided Fix Prompt*: **Type Low**


#### 🔹 Slide 3: Multi-Way Decisions with elif (`py-d5-b3-elif-ladder`)

* **Primary Concept Budget**: `elif (else-if) Ladders`
* **Supporting Terms**: Sequential Check, First Match Wins
* **Prerequisites**: `py-d5-b2-else-branch` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
score = 82
if score >= 90:
    print('Grade: A')
elif score >= 80:
    print('Grade: B')
else:
    print('Grade: C')
```
* **Line 3**: elif checks the next condition only if previous condition was False.

##### 💻 Runnable Interactive Python Sandbox (`grade.py`)
```python
score = 82
if score >= 90:
    print('Grade A')
elif score >= 80:
    print('Grade B')
else:
    print('Grade C')
```
**Expected Terminal Execution Output**:
```text
Grade B
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_ELIF_ORDER_PRECEDENCE`
* **Question**: **In the grade code above for score = 82, what is printed?**
* **Expected Exact Value**: `Grade B`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Grade A` (Misconception: `MC_PY_ELIF_ORDER_PRECEDENCE`)
  1. 🛑 *What Went Wrong*: 82 is less than 90, so the first if fails. It matches score >= 80.
  2. 💡 *Simpler Everyday Picture*: 82 matches the elif score >= 80 branch.
  3. 🛠️ *Guided Fix Prompt*: **Type Grade B**


#### 🔹 Slide 4: Boolean Logic: and, or, not (`py-d5-b4-boolean-operators`)

* **Primary Concept Budget**: `Boolean Logical Operators`
* **Supporting Terms**: and (both), or (either), not (invert)
* **Prerequisites**: `py-d5-b3-elif-ladder` (understood)

##### 💡 Real-World Physical Analogy: *Boarding an Airplane*
You need a Ticket AND a Passport to board (both required). You can pay with Cash OR Card (either is fine).

##### 💻 Runnable Interactive Python Sandbox (`logic.py`)
```python
has_ticket = True
has_id = True
if has_ticket and has_id:
    print('Boarding Approved')
```
**Expected Terminal Execution Output**:
```text
Boarding Approved
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_LOGICAL_AND_SHORT_CIRCUIT`
* **Question**: **What is the result of: print(True and False)?**
* **Expected Exact Value**: `False`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `True` (Misconception: `MC_PY_LOGICAL_AND_SHORT_CIRCUIT`)
  1. 🛑 *What Went Wrong*: and requires BOTH sides to be True. Since right side is False, result is False.
  2. 💡 *Simpler Everyday Picture*: True and False evaluates to False.
  3. 🛠️ *Guided Fix Prompt*: **Type False**


### ⚡ Quest 2: Proctored Coding Exam — Loan Risk Score Evaluator

**Problem Statement**:
Write a Python function `evaluate_loan_risk(credit_score: int, annual_income: int, has_defaults: bool) -> str` returning 'APPROVED' (credit >= 700 and income >= 50000 and not defaults), 'MANUAL_REVIEW' (credit >= 600 and income >= 30000 and not defaults), or 'REJECTED'.

**Socratic Mentor Hint**: *Check APPROVED condition first, then MANUAL_REVIEW, else return 'REJECTED'.*

#### 💻 Exam Starter Code (`solution.py`)
```python
def evaluate_loan_risk(credit_score: int, annual_income: int, has_defaults: bool) -> str:
    # Return 'APPROVED', 'MANUAL_REVIEW', or 'REJECTED'
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert evaluate_loan_risk(750, 60000, False) == 'APPROVED', 'Test 1 Failed'
assert evaluate_loan_risk(650, 40000, False) == 'MANUAL_REVIEW', 'Test 2 Failed'
assert evaluate_loan_risk(750, 60000, True) == 'REJECTED', 'Test 3 Failed'
assert evaluate_loan_risk(550, 80000, False) == 'REJECTED', 'Test 4 Failed'
print('All 4 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — E-Commerce Discount Tier Calculator

**Problem Statement**:
Write a Python function `calculate_discount_tier(cart_total: float, is_vip: bool) -> float` returning discount percentage (0.20 if VIP and cart >= 100; 0.10 if cart >= 100; 0.05 if VIP; 0.0 otherwise).

**Socratic Mentor Hint**: *Check both conditions (cart >= 100 and is_vip) first.*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def calculate_discount_tier(cart_total: float, is_vip: bool) -> float:
    # Return discount rate
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert calculate_discount_tier(150.0, True) == 0.20, 'Test 1 Failed'
assert calculate_discount_tier(120.0, False) == 0.10, 'Test 2 Failed'
assert calculate_discount_tier(50.0, True) == 0.05, 'Test 3 Failed'
assert calculate_discount_tier(40.0, False) == 0.0, 'Test 4 Failed'
print('All 4 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 6: THE WHILE LOOP & SENTINEL INPUT VALIDATION

> **Everyday Core Metaphor**: A while loop is like a security turnstile: WHILE your ticket is valid, it keeps letting you through again and again until the condition becomes False.

### 🎯 Day Overview & Learning Objectives
- **Concept**: The while loop syntax and condition re-evaluation
- **Concept**: Loop termination guards and preventing infinite loops
- **Concept**: Using break and continue for fine-grained loop control

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The while Loop Syntax & Condition Check (`py-d6-b1-while-syntax`)

* **Primary Concept Budget**: `while Loop`
* **Supporting Terms**: Loop Header, Iteration
* **Prerequisites**: `py-d5-b1-if-condition` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
count = 1
while count <= 3:
    print('Count:', count)
    count += 1 # Critical: update to avoid infinite loop!
```
* **Line 2**: while condition re-checks before each iteration.
* **Line 4**: Updating count moves it toward termination.

##### 💻 Runnable Interactive Python Sandbox (`while_demo.py`)
```python
count = 1
while count <= 3:
    print('Tick', count)
    count += 1
```
**Expected Terminal Execution Output**:
```text
Tick 1
Tick 2
Tick 3
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_WHILE_INFINITE_LOOP`
* **Question**: **How many times does print('Tick') run when count starts at 1 and condition is count <= 3?**
* **Expected Exact Value**: `3`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `2` (Misconception: `MC_PY_WHILE_INFINITE_LOOP`)
  1. 🛑 *What Went Wrong*: Count runs for 1, 2, and 3 (3 total iterations).
  2. 💡 *Simpler Everyday Picture*: Runs when count is 1, 2, and 3 -> 3 times.
  3. 🛠️ *Guided Fix Prompt*: **Type 3**


#### 🔹 Slide 2: Preventing Infinite Loops & Counter Updates (`py-d6-b2-infinite-loops`)

* **Primary Concept Budget**: `Loop Termination`
* **Supporting Terms**: State Update, Infinite Loop
* **Prerequisites**: `py-d6-b1-while-syntax` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```python
# ❌ BROKEN / BUGGY PATTERN
count = 1
while count <= 3:
    print(count)
    # ❌ count never changes -> infinite loop freezing the CPU!

# ✅ CORRECT / PRODUCTION FIX
count = 1
while count <= 3:
    print(count)
    count += 1  # ✅ Moves count toward termination
```
* **Error Reason**: Without count += 1, count remains 1 forever.
* **Fix Explanation**: Always increment or decrement loop counter inside the block.

##### 💻 Runnable Interactive Python Sandbox (`safe_loop.py`)
```python
n = 5
while n > 0:
    print('Countdown:', n)
    n -= 1
print('Blastoff!')
```
**Expected Terminal Execution Output**:
```text
Countdown: 5
Countdown: 4
Countdown: 3
Countdown: 2
Countdown: 1
Blastoff!
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_WHILE_SENTINEL_UPDATE`
* **Question**: **What happens if you forget to increment the counter inside a while loop?**
  ✅ **Option A**: The program enters an infinite loop and may freeze
  ❌ **Option B**: The loop runs only once
  ❌ **Option C**: Python automatically adds 1

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_WHILE_SENTINEL_UPDATE`)
  1. 🛑 *What Went Wrong*: The condition stays True forever, causing an infinite loop.
  2. 💡 *Simpler Everyday Picture*: Condition never becomes False -> loop never stops.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Controlling Loops: break and continue (`py-d6-b3-break-continue`)

* **Primary Concept Budget**: `break and continue`
* **Supporting Terms**: break (instant exit), continue (skip to next)
* **Prerequisites**: `py-d6-b2-infinite-loops` (understood)

##### 💡 Real-World Physical Analogy: *Emergency Brake vs Skipping a Song*
break hits the emergency brake and stops the entire train. continue skips the current song and plays the next.

##### 💻 Runnable Interactive Python Sandbox (`break_demo.py`)
```python
n = 1
while n <= 10:
    if n == 3:
        break
    print('Run:', n)
    n += 1
```
**Expected Terminal Execution Output**:
```text
Run: 1
Run: 2
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_WHILE_INFINITE_LOOP`
* **Question**: **In the code above where n stops at break when n == 3, what is the last line printed?**
* **Expected Exact Value**: `Run: 2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Run: 3` (Misconception: `MC_PY_WHILE_INFINITE_LOOP`)
  1. 🛑 *What Went Wrong*: break exits before reaching print('Run:', 3).
  2. 💡 *Simpler Everyday Picture*: break exits immediately before printing 3.
  3. 🛠️ *Guided Fix Prompt*: **Type Run: 2**


### ⚡ Quest 2: Proctored Coding Exam — Collatz Conjecture Step Counter

**Problem Statement**:
Write a Python function `collatz_steps(n: int) -> int` that calculates how many steps it takes to reach 1 (if even: n // 2, if odd: 3*n + 1). Return 0 for n=1.

**Socratic Mentor Hint**: *Use a while n > 1: loop with step counter.*

#### 💻 Exam Starter Code (`solution.py`)
```python
def collatz_steps(n: int) -> int:
    # Count steps until n reaches 1
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert collatz_steps(1) == 0, 'Test 1 Failed'
assert collatz_steps(6) == 8, 'Test 2 Failed'
assert collatz_steps(27) == 111, 'Test 3 Failed'
print('All 3 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Target Balance Investment Doubler

**Problem Statement**:
Write a Python function `years_to_target(principal: float, rate: float, target: float) -> int` that calculates years required to reach or exceed target balance with annual compound interest.

**Socratic Mentor Hint**: *while balance < target: balance += balance * rate; years += 1*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def years_to_target(principal: float, rate: float, target: float) -> int:
    # Count years until principal >= target
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert years_to_target(1000.0, 0.10, 2000.0) == 8, 'Test 1 Failed'
assert years_to_target(500.0, 0.05, 500.0) == 0, 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 7: THE FOR LOOP WITH RANGE() & THE ACCUMULATOR PATTERN

> **Everyday Core Metaphor**: A for loop with range(start, stop) is like a ticket dispenser: it dispenses numbered tokens one by one from start up to (but not including) stop.

### 🎯 Day Overview & Learning Objectives
- **Concept**: range(stop), range(start, stop), range(start, stop, step)
- **Concept**: The accumulator pattern (running totals and running products)
- **Concept**: Counting backwards with negative steps

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The range(start, stop, step) Function (`py-d7-b1-range-syntax`)

* **Primary Concept Budget**: `range() Generator`
* **Supporting Terms**: start (inclusive), stop (exclusive), step
* **Prerequisites**: `py-d6-b1-while-syntax` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
for i in range(1, 4):  # Produces 1, 2, 3 (4 is EXCLUDED!)
    print('Number:', i)
```
* **Line 1**: range(1, 4) starts at 1 and stops BEFORE 4.

##### 💻 Runnable Interactive Python Sandbox (`range_demo.py`)
```python
for i in range(1, 4):
    print('Item:', i)
```
**Expected Terminal Execution Output**:
```text
Item: 1
Item: 2
Item: 3
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_RANGE_STOP_EXCLUSIVE`
* **Question**: **Which numbers are produced by range(1, 5)?**
  ✅ **Option A**: 1, 2, 3, 4 (5 is excluded)
  ❌ **Option B**: 1, 2, 3, 4, 5
  ❌ **Option C**: 0, 1, 2, 3, 4, 5

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_RANGE_STOP_EXCLUSIVE`)
  1. 🛑 *What Went Wrong*: In Python range(start, stop), the stop number is always exclusive (not included).
  2. 💡 *Simpler Everyday Picture*: range stops 1 step before the stop number.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: The Accumulator Pattern (Running Totals) (`py-d7-b2-accumulator-pattern`)

* **Primary Concept Budget**: `Accumulator Pattern`
* **Supporting Terms**: total = 0, total += i
* **Prerequisites**: `py-d7-b1-range-syntax` (understood)

##### 💡 Real-World Physical Analogy: *A Piggy Bank*
Start with an empty bank ($0). Each day, drop in the day's coins. At the end, the bank holds the sum of all days.

##### 💻 Runnable Interactive Python Sandbox (`sum_demo.py`)
```python
total = 0
for i in range(1, 4):
    total += i
print('Total Sum:', total)
```
**Expected Terminal Execution Output**:
```text
Total Sum: 6
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_FOR_ACCUMULATOR_SCOPE`
* **Question**: **What is the output of sum 1 + 2 + 3 in the code above?**
* **Expected Exact Value**: `Total Sum: 6`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `3` (Misconception: `MC_PY_FOR_ACCUMULATOR_SCOPE`)
  1. 🛑 *What Went Wrong*: total accumulates 1 + 2 + 3 = 6.
  2. 💡 *Simpler Everyday Picture*: 0 + 1 = 1; 1 + 2 = 3; 3 + 3 = 6.
  3. 🛠️ *Guided Fix Prompt*: **Type Total Sum: 6**


#### 🔹 Slide 3: Custom Step Sizes & Counting Backwards (`py-d7-b3-step-size`)

* **Primary Concept Budget**: `range Step Parameter`
* **Supporting Terms**: range(start, stop, step), Negative Step
* **Prerequisites**: `py-d7-b1-range-syntax` (understood)

##### 💻 Runnable Interactive Python Sandbox (`step_demo.py`)
```python
for even in range(2, 8, 2):
    print('Even:', even)
```
**Expected Terminal Execution Output**:
```text
Even: 2
Even: 4
Even: 6
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_RANGE_STEP_DIRECTION`
* **Question**: **What numbers are printed by range(2, 8, 2)?**
* **Expected Exact Value**: `Even: 2
Even: 4
Even: 6`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `2, 4, 6, 8` (Misconception: `MC_PY_RANGE_STEP_DIRECTION`)
  1. 🛑 *What Went Wrong*: Stop 8 is exclusive, so 8 is not included.
  2. 💡 *Simpler Everyday Picture*: 2, 4, 6 (stops before 8).
  3. 🛠️ *Guided Fix Prompt*: **Type Even: 2\nEven: 4\nEven: 6**


### ⚡ Quest 2: Proctored Coding Exam — Sum of Multiples in Range

**Problem Statement**:
Write a Python function `sum_multiples(limit: int, factor: int) -> int` returning the sum of all multiples of `factor` strictly less than `limit`.

**Socratic Mentor Hint**: *Use sum(range(factor, limit, factor))*

#### 💻 Exam Starter Code (`solution.py`)
```python
def sum_multiples(limit: int, factor: int) -> int:
    # Return sum of multiples of factor < limit
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert sum_multiples(10, 3) == 18, 'Test 1 Failed'
assert sum_multiples(20, 5) == 30, 'Test 2 Failed'
assert sum_multiples(5, 10) == 0, 'Test 3 Failed'
print('All 3 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Factorial Calculator

**Problem Statement**:
Write a Python function `calculate_factorial(n: int) -> int` that calculates n! (return 1 for n=0).

**Socratic Mentor Hint**: *total = 1; for i in range(1, n + 1): total *= i; return total*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def calculate_factorial(n: int) -> int:
    # Calculate n factorial
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert calculate_factorial(0) == 1, 'Test 1 Failed'
assert calculate_factorial(5) == 120, 'Test 2 Failed'
assert calculate_factorial(6) == 720, 'Test 3 Failed'
print('All 3 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 8: NESTED LOOPS, GRID TRAVERSAL & STRING FORMATTING (F-STRINGS)

> **Everyday Core Metaphor**: Nested loops are like a clock: for every single hour that the hour hand ticks (outer loop), the minute hand must complete 60 full ticks (inner loop).

### 🎯 Day Overview & Learning Objectives
- **Concept**: Nested for loop mechanics (outer row, inner column)
- **Concept**: 2D coordinate space mapping
- **Concept**: Precision f-string formatting (decimals, padding, alignment)

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Nested For Loops (Rows & Columns) (`py-d8-b1-nested-loops`)

* **Primary Concept Budget**: `Nested Loops`
* **Supporting Terms**: Outer Row Loop, Inner Column Loop
* **Prerequisites**: `py-d7-b1-range-syntax` (understood)

##### 💡 Real-World Physical Analogy: *A Calendar Month*
For each week (outer loop row), you visit Monday through Sunday (inner loop days).

##### 💻 Runnable Interactive Python Sandbox (`grid.py`)
```python
for r in range(2):
    for c in range(2):
        print(f'Cell ({r}, {c})')
```
**Expected Terminal Execution Output**:
```text
Cell (0, 0)
Cell (0, 1)
Cell (1, 0)
Cell (1, 1)
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_NESTED_LOOP_COORDINATES`
* **Question**: **How many total cell coordinates are printed by for r in range(2): for c in range(3):?**
* **Expected Exact Value**: `6`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `5` (Misconception: `MC_PY_NESTED_LOOP_COORDINATES`)
  1. 🛑 *What Went Wrong*: Total iterations = outer * inner = 2 * 3 = 6.
  2. 💡 *Simpler Everyday Picture*: 2 rows * 3 columns = 6 total iterations.
  3. 🛠️ *Guided Fix Prompt*: **Type 6**


#### 🔹 Slide 2: Formatted String Literals (f-strings) (`py-d8-b2-fstrings`)

* **Primary Concept Budget**: `f-strings (f'...')`
* **Supporting Terms**: Curly Braces {}, Expression Interpolation
* **Prerequisites**: `py-d8-b1-nested-loops` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
name = 'Alex'
age = 25
msg = f'User {name} is {age} years old.' # Automatically embeds values
```
* **Line 3**: Prefix string with 'f' to interpolate variables inside {}.

##### 💻 Runnable Interactive Python Sandbox (`fstrings.py`)
```python
name = 'Sarah'
score = 98.5
print(f'Player: {name} | Score: {score}')
```
**Expected Terminal Execution Output**:
```text
Player: Sarah | Score: 98.5
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_FSTRING_EXPRESSION_EVAL`
* **Question**: **What is printed by: x = 10; print(f'Result: {x * 2}')?**
* **Expected Exact Value**: `Result: 20`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Result: {x * 2}` (Misconception: `MC_PY_FSTRING_EXPRESSION_EVAL`)
  1. 🛑 *What Went Wrong*: f-strings evaluate expressions inside {} at runtime: 10 * 2 = 20.
  2. 💡 *Simpler Everyday Picture*: f-string calculates 10*2 inside {} to produce 20.
  3. 🛠️ *Guided Fix Prompt*: **Type Result: 20**


#### 🔹 Slide 3: Matrix Traversal & Coordinate Generation (`py-d8-b3-grid-matrix-traversal`)

* **Primary Concept Budget**: `2D Grid Coordinates`
* **Supporting Terms**: Row Index, Column Index
* **Prerequisites**: `py-d8-b2-fstrings` (understood)

##### 💻 Runnable Interactive Python Sandbox (`table.py`)
```python
for i in range(1, 3):
    row = ''
    for j in range(1, 4):
        row += f'{i*j} '
    print(row.strip())
```
**Expected Terminal Execution Output**:
```text
1 2 3
2 4 6
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_NESTED_LOOP_COORDINATES`
* **Question**: **In the code above, what is the product at row 2, column 3 (i=2, j=3)?**
* **Expected Exact Value**: `6`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `5` (Misconception: `MC_PY_NESTED_LOOP_COORDINATES`)
  1. 🛑 *What Went Wrong*: i * j = 2 * 3 = 6.
  2. 💡 *Simpler Everyday Picture*: 2 * 3 = 6.
  3. 🛠️ *Guided Fix Prompt*: **Type 6**


### ⚡ Quest 2: Proctored Coding Exam — Multiplication Table Grid Generator

**Problem Statement**:
Write a Python function `generate_grid(rows: int, cols: int) -> list` that returns a 2D list of products where cell [r][c] = (r+1) * (c+1).

**Socratic Mentor Hint**: *Use nested list comprehension: [[(r+1)*(c+1) for c in range(cols)] for r in range(rows)]*

#### 💻 Exam Starter Code (`solution.py`)
```python
def generate_grid(rows: int, cols: int) -> list:
    # Return 2D list of products
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert generate_grid(2, 3) == [[1, 2, 3], [2, 4, 6]], 'Test 1 Failed'
assert generate_grid(1, 1) == [[1]], 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Coordinate Pair Flattener

**Problem Statement**:
Write a Python function `generate_coordinates(max_x: int, max_y: int) -> list` returning a list of tuple pairs `(x, y)` for x in 0..max_x and y in 0..max_y.

**Socratic Mentor Hint**: *[(x, y) for x in range(max_x + 1) for y in range(max_y + 1)]*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def generate_coordinates(max_x: int, max_y: int) -> list:
    # Return list of coordinate tuples
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert generate_coordinates(1, 1) == [(0, 0), (0, 1), (1, 0), (1, 1)], 'Test 1 Failed'
assert len(generate_coordinates(2, 2)) == 9, 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 9: FUNCTIONS WITH DEF, PARAMETERS, RETURN VALUES & DOCSTRINGS

> **Everyday Core Metaphor**: A Python function is like a vending machine: you give it inputs (coins and a button selection), it runs internal machinery, and it drops out a calculated result (the snack).

### 🎯 Day Overview & Learning Objectives
- **Concept**: The def keyword and function anatomy
- **Concept**: Parameters vs arguments and multiple return values
- **Concept**: Writing docstrings and pure functions

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Defining Functions with def & Parameters (`py-d9-b1-def-anatomy`)

* **Primary Concept Budget**: `Function Definition (def)`
* **Supporting Terms**: Parameter, Argument, def name():
* **Prerequisites**: `py-d8-b2-fstrings` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
def greet_user(name):
    print(f'Hello, {name}!')

greet_user('Alex') # Function call
```
* **Line 1**: def defines the function; name is the input parameter.
* **Line 4**: Calling greet_user('Alex') passes 'Alex' as argument.

##### 💻 Runnable Interactive Python Sandbox (`functions.py`)
```python
def greet(name):
    print(f'Welcome, {name}!')

greet('Emily')
```
**Expected Terminal Execution Output**:
```text
Welcome, Emily!
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_FUNCTION_DEF_VS_CALL`
* **Question**: **What keyword is used to declare a function in Python?**
  ✅ **Option A**: def
  ❌ **Option B**: function
  ❌ **Option C**: func

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_FUNCTION_DEF_VS_CALL`)
  1. 🛑 *What Went Wrong*: Python uses 'def' (short for define), not 'function'.
  2. 💡 *Simpler Everyday Picture*: In Python, functions always start with def.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A: def**


#### 🔹 Slide 2: The return Keyword (Returning Values to Caller) (`py-d9-b2-return-vs-print`)

* **Primary Concept Budget**: `The return Keyword`
* **Supporting Terms**: Return Value, print() vs return
* **Prerequisites**: `py-d9-b1-def-anatomy` (understood)

##### 💡 Real-World Physical Analogy: *A Calculator Display vs A Receipt Slip*
print() just flashes numbers on screen; return hands you a real paper slip you can save in a variable and do math with later.

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```python
# ❌ BROKEN / BUGGY PATTERN
def add(a, b):
    print(a + b) # ❌ Returns None implicitly!
x = add(2, 3)
print(x * 2)     # ❌ TypeError: unsupported operand type for *: 'NoneType' and 'int'

# ✅ CORRECT / PRODUCTION FIX
def add(a, b):
    return a + b # ✅ Hands back the number 5
x = add(2, 3)
print(x * 2)     # ✅ Output: 10
```
* **Error Reason**: Functions without return yield None, which cannot be used in calculations.
* **Fix Explanation**: Use return to pass calculated data back to the caller.

##### 💻 Runnable Interactive Python Sandbox (`returns.py`)
```python
def square(n):
    return n * n

result = square(4)
print('Square of 4 is:', result)
```
**Expected Terminal Execution Output**:
```text
Square of 4 is: 16
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_RETURN_VS_PRINT`
* **Question**: **In the code above, what value does square(4) return?**
* **Expected Exact Value**: `16`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `None` (Misconception: `MC_PY_RETURN_VS_PRINT`)
  1. 🛑 *What Went Wrong*: square has a return statement returning 4 * 4 = 16.
  2. 💡 *Simpler Everyday Picture*: 4 * 4 = 16 is handed back to result.
  3. 🛠️ *Guided Fix Prompt*: **Type 16**


#### 🔹 Slide 3: Docstrings & Multi-Argument Functions (`py-d9-b3-docstrings`)

* **Primary Concept Budget**: `Docstrings (""" ... """)`
* **Supporting Terms**: Documentation, help() Inspection
* **Prerequisites**: `py-d9-b2-return-vs-print` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
def calculate_tax(price, rate=0.08):
    """Calculates sales tax on an item."""
    return round(price * rate, 2)
```
* **Line 2**: Docstring between triple quotes explains the function's purpose.

##### 💻 Runnable Interactive Python Sandbox (`tax.py`)
```python
def calc_tax(price, rate=0.08):
    """Compute tax."""
    return round(price * rate, 2)

print('Tax on $100:', calc_tax(100))
```
**Expected Terminal Execution Output**:
```text
Tax on $100: 8.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_FUNCTION_DEF_VS_CALL`
* **Question**: **How do you write a multi-line docstring in Python?**
  ✅ **Option A**: Using triple quotes """ docstring """
  ❌ **Option B**: Using // comments
  ❌ **Option C**: Using /* docstring */

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_FUNCTION_DEF_VS_CALL`)
  1. 🛑 *What Went Wrong*: Python uses triple quotes (""" or ''') for docstrings.
  2. 💡 *Simpler Everyday Picture*: Triple quotes """ """ define Python docstrings.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored Coding Exam — Celsius to Fahrenheit & Kelvin Converter

**Problem Statement**:
Write a Python function `convert_temperature(celsius: float) -> tuple` returning `(fahrenheit, kelvin)` rounded to 2 decimals.

**Socratic Mentor Hint**: *f = round((celsius * 9/5) + 32, 2); k = round(celsius + 273.15, 2); return (f, k)*

#### 💻 Exam Starter Code (`solution.py`)
```python
def convert_temperature(celsius: float) -> tuple:
    # Return (f, k)
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert convert_temperature(0.0) == (32.0, 273.15), 'Test 1 Failed'
assert convert_temperature(100.0) == (212.0, 373.15), 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Volume of Cylinder Calculator

**Problem Statement**:
Write a Python function `cylinder_volume(radius: float, height: float) -> float` returning volume $V = \pi r^2 h$ rounded to 2 decimal places (use 3.14159 for pi).

**Socratic Mentor Hint**: *return round(3.14159 * (radius ** 2) * height, 2)*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def cylinder_volume(radius: float, height: float) -> float:
    # Calculate cylinder volume
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert cylinder_volume(3.0, 5.0) == 141.37, 'Test 1 Failed'
assert cylinder_volume(1.0, 1.0) == 3.14, 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 10: ⭐ MILESTONE 2: MULTI-FUNCTION FINANCIAL UTILITY ENGINE & STACK FRAMES

> **Everyday Core Metaphor**: Milestone 2 — Modular Financial Engine: The Call Stack is like a stack of cafeteria trays: when main() calls compute_tax(), a new tray is placed on top. When compute_tax() finishes, its tray is popped off and discarded.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Variable scope (Local, Enclosing, Global, Built-in - LEGB)
- **Concept**: Function composition and passing functions as inputs
- **Concept**: Milestone Project: Modular Payroll & Tax Deduction Engine

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Local vs Global Scope in Python (`py-d10-b1-scope-legb`)

* **Primary Concept Budget**: `Variable Scope (Local vs Global)`
* **Supporting Terms**: Local Scope inside Function, Global Scope
* **Prerequisites**: `py-d9-b2-return-vs-print` (understood)

##### 💡 Real-World Physical Analogy: *A Hotel Room vs The Hotel Lobby*
Items inside your private hotel room (local) cannot be seen from the lobby. The lobby chandelier (global) is visible to everyone.

##### 📦 Memory Box Model (Heap & Pointer State)
| Variable Name | Stored Value | Type | Updated |
|:---|:---|:---|:---:|
| `Global: company_name` | `'PinIT Inc'` | `str` | — |
| `Local (calc): local_bonus` | `500` | `int` | — |

##### 💻 Runnable Interactive Python Sandbox (`scope.py`)
```python
global_rate = 0.10

def compute_fee(amount):
    local_fee = amount * global_rate
    return local_fee

print('Fee on $500:', compute_fee(500))
```
**Expected Terminal Execution Output**:
```text
Fee on $500: 50.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_LOCAL_VS_GLOBAL_SCOPE`
* **Question**: **Can code outside a function directly access a variable created inside that function?**
  ✅ **Option A**: No, local variables exist only while the function is executing
  ❌ **Option B**: Yes, all variables in Python are global
  ❌ **Option C**: Only if the variable name starts with an underscore

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_LOCAL_VS_GLOBAL_SCOPE`)
  1. 🛑 *What Went Wrong*: Variables created inside functions have local scope and are destroyed when the function returns.
  2. 💡 *Simpler Everyday Picture*: Inside function = private local variable.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: The Call Stack (Stack Frames in Action) (`py-d10-b2-stack-frames`)

* **Primary Concept Budget**: `Call Stack Execution`
* **Supporting Terms**: Stack Frame, Push and Pop
* **Prerequisites**: `py-d10-b1-scope-legb` (understood)

##### 💻 Runnable Interactive Python Sandbox (`stack_trace.py`)
```python
def step_two():
    return 'Step 2 Complete'

def step_one():
    msg = step_two()
    return f'Step 1 got: {msg}'

print(step_one())
```
**Expected Terminal Execution Output**:
```text
Step 1 got: Step 2 Complete
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_STACK_FRAME_LIFECYCLE`
* **Question**: **In stack_trace.py, what is printed by print(step_one())?**
* **Expected Exact Value**: `Step 1 got: Step 2 Complete`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Step 2 Complete` (Misconception: `MC_PY_STACK_FRAME_LIFECYCLE`)
  1. 🛑 *What Went Wrong*: step_one formats the message with 'Step 1 got: ...'.
  2. 💡 *Simpler Everyday Picture*: Formats into 'Step 1 got: Step 2 Complete'.
  3. 🛠️ *Guided Fix Prompt*: **Type Step 1 got: Step 2 Complete**


#### 🔹 Slide 3: Helper Method Composition (`py-d10-b3-helper-composition`)

* **Primary Concept Budget**: `Function Composition`
* **Supporting Terms**: Helper Functions, Modular Pipeline
* **Prerequisites**: `py-d10-b2-stack-frames` (understood)

##### 💻 Runnable Interactive Python Sandbox (`payroll.py`)
```python
def calc_tax(gross):
    return gross * 0.15

def calc_net(gross, bonus):
    tax = calc_tax(gross)
    return gross - tax + bonus

print('Net Salary:', calc_net(4000, 200))
```
**Expected Terminal Execution Output**:
```text
Net Salary: 3600.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_STACK_FRAME_LIFECYCLE`
* **Question**: **For gross=4000 (tax=600) and bonus=200, what is the net salary (4000 - 600 + 200)?**
* **Expected Exact Value**: `Net Salary: 3600.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `4200` (Misconception: `MC_PY_STACK_FRAME_LIFECYCLE`)
  1. 🛑 *What Went Wrong*: 4000 - 600 (tax) + 200 (bonus) = 3600.0.
  2. 💡 *Simpler Everyday Picture*: 4000 - 600 + 200 = 3600.0.
  3. 🛠️ *Guided Fix Prompt*: **Type Net Salary: 3600.0**


### ⚡ Quest 2: Proctored Coding Exam — Net Salary & Tax Deduction Engine

**Problem Statement**:
Write a Python function `compute_net_salary(gross_pay: float, deduction_rate: float, bonus: float) -> float` that deducts tax from gross_pay and adds bonus. Return net rounded to 2 decimals.

**Socratic Mentor Hint**: *tax = gross_pay * deduction_rate; return round(gross_pay - tax + bonus, 2)*

#### 💻 Exam Starter Code (`solution.py`)
```python
def compute_net_salary(gross_pay: float, deduction_rate: float, bonus: float) -> float:
    # Return net pay
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert compute_net_salary(5000.0, 0.20, 500.0) == 4500.0, 'Test 1 Failed'
assert compute_net_salary(3000.0, 0.10, 0.0) == 2700.0, 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Compound Interest Metric Engine

**Problem Statement**:
Write a Python function `compound_interest(principal: float, rate: float, times_per_year: int, years: int) -> float` returning total future value $A = P(1 + r/n)^{nt}$ rounded to 2 decimals.

**Socratic Mentor Hint**: *return round(principal * ((1 + (rate / times_per_year)) ** (times_per_year * years)), 2)*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def compound_interest(principal: float, rate: float, times_per_year: int, years: int) -> float:
    # Calculate future value
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert compound_interest(1000.0, 0.05, 1, 2) == 1102.5, 'Test 1 Failed'
assert compound_interest(5000.0, 0.08, 12, 5) == 7449.23, 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 11: PYTHON LISTS — INDEXING, SLICING [START:STOP:STEP] & CRUD OPERATIONS

> **Everyday Core Metaphor**: A Python list is like a numbered train of cargo cars: car 0 is the first car, car 1 is the second, and car -1 is the caboose at the very end.

### 🎯 Day Overview & Learning Objectives
- **Concept**: List creation, append(), insert(), pop(), remove()
- **Concept**: Negative indexing (arr[-1] for last element)
- **Concept**: Slicing syntax [start:stop:step] and reverse slicing [::-1]

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: 0-Based & Negative Indexing (arr[0], arr[-1]) (`py-d11-b1-list-indexing`)

* **Primary Concept Budget**: `List Indexing`
* **Supporting Terms**: 0-based Indexing, Negative Indexing arr[-1]
* **Prerequisites**: `py-d10-b1-scope-legb` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
items = ['apple', 'banana', 'cherry']
first = items[0]  # 'apple'
last = items[-1]   # 'cherry' (negative index)
```
* **Line 2**: 0 is always the first item in Python.
* **Line 3**: -1 is always the last item in Python.

##### 💻 Runnable Interactive Python Sandbox (`indexing.py`)
```python
fruits = ['apple', 'banana', 'cherry']
print('First:', fruits[0])
print('Last:', fruits[-1])
```
**Expected Terminal Execution Output**:
```text
First: apple
Last: cherry
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_LIST_NEGATIVE_INDEXING`
* **Question**: **What is the output of print(['a', 'b', 'c'][-1])?**
* **Expected Exact Value**: `c`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `a` (Misconception: `MC_PY_LIST_NEGATIVE_INDEXING`)
  1. 🛑 *What Went Wrong*: Negative index -1 accesses the LAST element ('c'), not the first.
  2. 💡 *Simpler Everyday Picture*: -1 = last item in list.
  3. 🛠️ *Guided Fix Prompt*: **Type c**


#### 🔹 Slide 2: List Slicing: [start:stop:step] (`py-d11-b2-list-slicing`)

* **Primary Concept Budget**: `List Slicing`
* **Supporting Terms**: Sublist Extraction, Reverse with [::-1]
* **Prerequisites**: `py-d11-b1-list-indexing` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
nums = [10, 20, 30, 40, 50]
sub = nums[1:4]   # [20, 30, 40] (index 4 is EXCLUDED)
rev = nums[::-1]  # [50, 40, 30, 20, 10]
```
* **Line 2**: 1:4 takes elements at index 1, 2, 3 (stops before index 4).

##### 💻 Runnable Interactive Python Sandbox (`slicing.py`)
```python
nums = [10, 20, 30, 40, 50]
print('Slice [1:3]:', nums[1:3])
print('Reversed:', nums[::-1])
```
**Expected Terminal Execution Output**:
```text
Slice [1:3]: [20, 30]
Reversed: [50, 40, 30, 20, 10]
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_LIST_SLICE_STOP_EXCLUSIVE`
* **Question**: **What elements are in [0, 1, 2, 3, 4][1:3]?**
* **Expected Exact Value**: `[1, 2]`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `[1, 2, 3]` (Misconception: `MC_PY_LIST_SLICE_STOP_EXCLUSIVE`)
  1. 🛑 *What Went Wrong*: Stop index 3 is exclusive, so only indices 1 and 2 are returned: [1, 2].
  2. 💡 *Simpler Everyday Picture*: Slice [1:3] takes index 1 and 2 only.
  3. 🛠️ *Guided Fix Prompt*: **Type [1, 2]**


#### 🔹 Slide 3: List Mutation: append(), pop(), remove() (`py-d11-b3-list-crud`)

* **Primary Concept Budget**: `List Methods`
* **Supporting Terms**: append(), pop(), remove()
* **Prerequisites**: `py-d11-b2-list-slicing` (understood)

##### 💻 Runnable Interactive Python Sandbox (`crud.py`)
```python
tasks = ['Read', 'Code']
tasks.append('Deploy')
removed = tasks.pop(0) # Removes 'Read'
print('Tasks remaining:', tasks)
```
**Expected Terminal Execution Output**:
```text
Tasks remaining: ['Code', 'Deploy']
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_LIST_INDEX_OUT_OF_RANGE`
* **Question**: **After tasks.pop(0) removes index 0, what is the new first item in ['Code', 'Deploy']?**
* **Expected Exact Value**: `Code`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Read` (Misconception: `MC_PY_LIST_INDEX_OUT_OF_RANGE`)
  1. 🛑 *What Went Wrong*: pop(0) removed 'Read', so 'Code' shifted to index 0.
  2. 💡 *Simpler Everyday Picture*: 'Code' is now at index 0.
  3. 🛠️ *Guided Fix Prompt*: **Type Code**


### ⚡ Quest 2: Proctored Coding Exam — List Middle Window Extractor

**Problem Statement**:
Write a Python function `extract_middle_window(items: list, k: int) -> list` that removes `k` elements from both the start and end of the list.

**Socratic Mentor Hint**: *Use slicing: items[k : -k] if k > 0 else items*

#### 💻 Exam Starter Code (`solution.py`)
```python
def extract_middle_window(items: list, k: int) -> list:
    # Return sublist excluding first k and last k elements
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert extract_middle_window([10, 20, 30, 40, 50, 60], 1) == [20, 30, 40, 50], 'Test 1 Failed'
assert extract_middle_window([1, 2, 3, 4, 5], 2) == [3], 'Test 2 Failed'
assert extract_middle_window([1, 2, 3], 0) == [1, 2, 3], 'Test 3 Failed'
print('All 3 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — List Deduplicator and Reverser

**Problem Statement**:
Write a Python function `reverse_unique_order(items: list) -> list` that keeps only the first occurrence of each element, then returns the result reversed.

**Socratic Mentor Hint**: *Use a seen set or dict.fromkeys(items), convert to list, and slice [::-1]*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def reverse_unique_order(items: list) -> list:
    # Preserve first-seen uniqueness and reverse
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert reverse_unique_order([1, 2, 2, 3, 1, 4]) == [4, 3, 2, 1], 'Test 1 Failed'
assert reverse_unique_order(['a', 'b', 'a']) == ['b', 'a'], 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 12: LIST COMPREHENSIONS, FILTERING & IN-PLACE VS COPY SORTING

> **Everyday Core Metaphor**: A list comprehension is like an automated assembly line conveyor belt: each item travels down the belt, passes an optional quality inspector (if filter), gets modified (expression), and drops into a brand new box.

### 🎯 Day Overview & Learning Objectives
- **Concept**: List comprehension syntax: [expr for item in list if condition]
- **Concept**: In-place mutation (list.sort()) vs return copy (sorted(list))
- **Concept**: Sorting with custom key functions

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: List Comprehensions: [expr for x in list] (`py-d12-b1-comprehension-syntax`)

* **Primary Concept Budget**: `List Comprehension`
* **Supporting Terms**: One-Line Transformation, Mapping
* **Prerequisites**: `py-d11-b3-list-crud` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
nums = [1, 2, 3]
squares = [x * x for x in nums] # Produces [1, 4, 9]
```
* **Line 2**: x * x is the expression applied to every element in nums.

##### 💻 Runnable Interactive Python Sandbox (`comprehension.py`)
```python
nums = [1, 2, 3, 4]
squares = [n * 2 for n in nums]
print('Doubled:', squares)
```
**Expected Terminal Execution Output**:
```text
Doubled: [2, 4, 6, 8]
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_LIST_COMPREHENSION_SYNTAX`
* **Question**: **What is produced by [x + 10 for x in [1, 2, 3]]?**
* **Expected Exact Value**: `[11, 12, 13]`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `[10, 10, 10]` (Misconception: `MC_PY_LIST_COMPREHENSION_SYNTAX`)
  1. 🛑 *What Went Wrong*: x is replaced by 1, 2, 3: 1+10=11, 2+10=12, 3+10=13.
  2. 💡 *Simpler Everyday Picture*: Adds 10 to each item: [11, 12, 13].
  3. 🛠️ *Guided Fix Prompt*: **Type [11, 12, 13]**


#### 🔹 Slide 2: Filtering with if: [x for x in list if condition] (`py-d12-b2-comprehension-filter`)

* **Primary Concept Budget**: `Comprehension Guard Filters`
* **Supporting Terms**: Filtering, if Condition
* **Prerequisites**: `py-d12-b1-comprehension-syntax` (understood)

##### 💻 Runnable Interactive Python Sandbox (`filter_comp.py`)
```python
nums = [10, 15, 20, 25, 30]
evens = [n for n in nums if n % 2 == 0]
print('Evens only:', evens)
```
**Expected Terminal Execution Output**:
```text
Evens only: [10, 20, 30]
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_LIST_COMPREHENSION_SYNTAX`
* **Question**: **What is produced by [x for x in [5, 12, 8, 3] if x > 5]?**
* **Expected Exact Value**: `[12, 8]`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `[5, 12, 8]` (Misconception: `MC_PY_LIST_COMPREHENSION_SYNTAX`)
  1. 🛑 *What Went Wrong*: x > 5 is strictly greater than 5, so 5 is excluded.
  2. 💡 *Simpler Everyday Picture*: Only 12 and 8 are strictly greater than 5.
  3. 🛠️ *Guided Fix Prompt*: **Type [12, 8]**


#### 🔹 Slide 3: In-Place list.sort() vs sorted(list) (`py-d12-b3-sort-vs-sorted`)

* **Primary Concept Budget**: `Sorting Mechanisms`
* **Supporting Terms**: list.sort() in-place mutation, sorted(list) new copy
* **Prerequisites**: `py-d12-b2-comprehension-filter` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```python
# ❌ BROKEN / BUGGY PATTERN
nums = [3, 1, 2]
res = nums.sort() # ❌ nums.sort() returns None!
print(res)        # Output: None

# ✅ CORRECT / PRODUCTION FIX
nums = [3, 1, 2]
res = sorted(nums) # ✅ sorted() returns a brand new sorted list
print(res)         # Output: [1, 2, 3]
```
* **Error Reason**: list.sort() modifies in place and returns None.
* **Fix Explanation**: Use sorted(list) when assigning to a new variable.

##### 💻 Runnable Interactive Python Sandbox (`sorting.py`)
```python
raw = [40, 10, 30, 20]
ordered = sorted(raw)
print('Original:', raw)
print('Sorted:', ordered)
```
**Expected Terminal Execution Output**:
```text
Original: [40, 10, 30, 20]
Sorted: [10, 20, 30, 40]
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_LIST_APPEND_RETURNS_NONE`
* **Question**: **What does calling my_list.sort() return in Python?**
  ✅ **Option A**: None (it sorts my_list in place)
  ❌ **Option B**: A new sorted copy of the list
  ❌ **Option C**: The length of the list

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_LIST_APPEND_RETURNS_NONE`)
  1. 🛑 *What Went Wrong*: list.sort() mutates the list directly and returns None.
  2. 💡 *Simpler Everyday Picture*: sort() returns None; sorted() returns the copy.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored Coding Exam — Transaction Threshold Filter & Squared Magnitude

**Problem Statement**:
Write a Python function `filter_and_square_evens(numbers: list, threshold: int) -> list` returning a list of squares for all even numbers > threshold.

**Socratic Mentor Hint**: *Use [n ** 2 for n in numbers if n > threshold and n % 2 == 0]*

#### 💻 Exam Starter Code (`solution.py`)
```python
def filter_and_square_evens(numbers: list, threshold: int) -> list:
    # Return squares of even numbers > threshold
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert filter_and_square_evens([2, 5, 8, 11, 14], 4) == [64, 196], 'Test 1 Failed'
assert filter_and_square_evens([1, 3, 5], 0) == [], 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Sort Strings by Length Descending

**Problem Statement**:
Write a Python function `sort_by_length_desc(words: list) -> list` that returns words sorted by length from longest to shortest.

**Socratic Mentor Hint**: *Use sorted(words, key=len, reverse=True)*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def sort_by_length_desc(words: list) -> list:
    # Return copy of words sorted by length descending
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert sort_by_length_desc(['apple', 'pie', 'banana']) == ['banana', 'apple', 'pie'], 'Test 1 Failed'
assert sort_by_length_desc(['a', 'bbb', 'cc']) == ['bbb', 'cc', 'a'], 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 13: TUPLES (IMMUTABILITY) & SETS (UNIQUENESS & O(1) LOOKUPS)

> **Everyday Core Metaphor**: A Tuple is a carved stone tablet (its data can never be edited after creation). A Set is a magical bouncer at a club who instantly vaporizes any duplicate attendees.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Tuple creation and immutability security
- **Concept**: Set hashing, uniqueness, and add()/remove()
- **Concept**: Set mathematical operations (union |, intersection &, difference -)

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Tuples: Immutable Fixed Records (x, y) (`py-d13-b1-tuple-immutability`)

* **Primary Concept Budget**: `Tuple Immutability`
* **Supporting Terms**: Parentheses (), Cannot be Modified
* **Prerequisites**: `py-d11-b1-list-indexing` (understood)

##### 💡 Real-World Physical Analogy: *A Carved GPS Coordinate*
A GPS landmark (lat, long) never changes. Tuples protect coordinates from accidental mutation.

##### 💻 Runnable Interactive Python Sandbox (`tuples.py`)
```python
point = (10, 20)
print('X:', point[0], '| Y:', point[1])
```
**Expected Terminal Execution Output**:
```text
X: 10 | Y: 20
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_TUPLE_IMMUTABILITY`
* **Question**: **Can you change an element of a tuple like pt[0] = 50 in Python?**
  ✅ **Option A**: No, tuples are immutable and raise a TypeError
  ❌ **Option B**: Yes, tuples work identically to lists
  ❌ **Option C**: Only if the tuple has 2 items

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_TUPLE_IMMUTABILITY`)
  1. 🛑 *What Went Wrong*: Tuples cannot be modified after creation.
  2. 💡 *Simpler Everyday Picture*: Tuples are read-only / immutable.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Sets: Automatic Deduplication & O(1) in Lookups (`py-d13-b2-sets-uniqueness`)

* **Primary Concept Budget**: `Set Uniqueness & Fast Lookup`
* **Supporting Terms**: Curly Braces {1, 2}, set() Deduplication
* **Prerequisites**: `py-d13-b1-tuple-immutability` (understood)

##### 💻 Runnable Interactive Python Sandbox (`sets.py`)
```python
raw_ids = [101, 102, 101, 103, 102]
unique_ids = set(raw_ids)
print('Unique IDs:', sorted(list(unique_ids)))
```
**Expected Terminal Execution Output**:
```text
Unique IDs: [101, 102, 103]
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_SET_UNIQUENESS`
* **Question**: **What is len(set([1, 2, 2, 3, 3, 3]))?**
* **Expected Exact Value**: `3`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `6` (Misconception: `MC_PY_SET_UNIQUENESS`)
  1. 🛑 *What Went Wrong*: set() drops all duplicates, leaving only {1, 2, 3} (3 items).
  2. 💡 *Simpler Everyday Picture*: Duplicates are removed: {1, 2, 3} -> len is 3.
  3. 🛠️ *Guided Fix Prompt*: **Type 3**


#### 🔹 Slide 3: Set Operations: Union (|) & Intersection (&) (`py-d13-b3-set-operations`)

* **Primary Concept Budget**: `Set Mathematics`
* **Supporting Terms**: Intersection &, Union |, Difference -
* **Prerequisites**: `py-d13-b2-sets-uniqueness` (understood)

##### 💻 Runnable Interactive Python Sandbox (`set_math.py`)
```python
a = {1, 2, 3}
b = {2, 3, 4}
print('Intersection (shared):', a & b)
print('Union (all):', a | b)
```
**Expected Terminal Execution Output**:
```text
Intersection (shared): {2, 3}
Union (all): {1, 2, 3, 4}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_SET_UNIQUENESS`
* **Question**: **What is {1, 2} & {2, 3} (shared intersection)?**
* **Expected Exact Value**: `{2}`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `{1, 2, 3}` (Misconception: `MC_PY_SET_UNIQUENESS`)
  1. 🛑 *What Went Wrong*: & finds only elements in BOTH sets ({2}).
  2. 💡 *Simpler Everyday Picture*: Only 2 is present in both sets.
  3. 🛠️ *Guided Fix Prompt*: **Type {2}**


### ⚡ Quest 2: Proctored Coding Exam — Shared Customer ID Finder (Set Intersection)

**Problem Statement**:
Write a Python function `find_common_customers(list_a: list, list_b: list) -> set` that returns a set of IDs present in both lists.

**Socratic Mentor Hint**: *Return set(list_a) & set(list_b)*

#### 💻 Exam Starter Code (`solution.py`)
```python
def find_common_customers(list_a: list, list_b: list) -> set:
    # Return set intersection
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert find_common_customers([101, 102, 103], [102, 103, 104]) == {102, 103}, 'Test 1 Failed'
assert find_common_customers([1, 2], [3, 4]) == set(), 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Immutable Coordinate Distance

**Problem Statement**:
Write a Python function `euclidean_distance(pt1: tuple, pt2: tuple) -> float` returning distance $\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ rounded to 2 decimals.

**Socratic Mentor Hint**: * return round(math.sqrt((pt2[0]-pt1[0])**2 + (pt2[1]-pt1[1])**2), 2)*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def euclidean_distance(pt1: tuple, pt2: tuple) -> float:
    # Calculate Euclidean distance between two (x, y) tuples
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert euclidean_distance((0, 0), (3, 4)) == 5.0, 'Test 1 Failed'
assert euclidean_distance((1, 1), (4, 5)) == 5.0, 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 14: DICTIONARIES — KEY-VALUE MAPPING & O(1) HASH LOOKUPS

> **Everyday Core Metaphor**: A Python dictionary is like a real-world telephone book: you look up a person's unique name (Key) and instantly find their phone number (Value) without reading line by line.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Dictionary initialization, key hashing rules (immutable keys)
- **Concept**: Safe lookups with dict.get(key, default)
- **Concept**: Iterating keys(), values(), and items() tuples

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Dictionary Creation & Key Access: dict[key] (`py-d14-b1-dict-syntax`)

* **Primary Concept Budget**: `Dictionary Key-Value Pair`
* **Supporting Terms**: Key (Unique), Value (Data), Curly Braces {'k': 'v'}
* **Prerequisites**: `py-d13-b2-sets-uniqueness` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
user = {'name': 'Alex', 'age': 25}
print(user['name']) # Access value by key
```
* **Line 1**: 'name' is the key; 'Alex' is the value associated with it.

##### 💻 Runnable Interactive Python Sandbox (`dict_demo.py`)
```python
student = {'id': 101, 'name': 'Sarah', 'gpa': 3.9}
print('Student Name:', student['name'])
print('GPA:', student['gpa'])
```
**Expected Terminal Execution Output**:
```text
Student Name: Sarah
GPA: 3.9
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_DICT_KEY_ERROR`
* **Question**: **What is printed by: d = {'a': 10, 'b': 20}; print(d['b'])?**
* **Expected Exact Value**: `20`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `b` (Misconception: `MC_PY_DICT_KEY_ERROR`)
  1. 🛑 *What Went Wrong*: d['b'] retrieves the VALUE (20) stored under key 'b'.
  2. 💡 *Simpler Everyday Picture*: Key 'b' maps to value 20.
  3. 🛠️ *Guided Fix Prompt*: **Type 20**


#### 🔹 Slide 2: Safe Key Access with dict.get(key, default) (`py-d14-b2-dict-get-safe`)

* **Primary Concept Budget**: `dict.get() Method`
* **Supporting Terms**: Prevent KeyError, Fallback Default
* **Prerequisites**: `py-d14-b1-dict-syntax` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```python
# ❌ BROKEN / BUGGY PATTERN
user = {'name': 'Alex'}
print(user['email']) # ❌ KeyError: 'email'

# ✅ CORRECT / PRODUCTION FIX
user = {'name': 'Alex'}
print(user.get('email', 'No email')) # ✅ Output: 'No email'
```
* **Error Reason**: Accessing missing keys with [] throws a KeyError.
* **Fix Explanation**: Use user.get(key, default) for graceful fallbacks.

##### 💻 Runnable Interactive Python Sandbox (`safe_get.py`)
```python
config = {'port': 8080}
print('Port:', config.get('port', 3000))
print('Host:', config.get('host', 'localhost'))
```
**Expected Terminal Execution Output**:
```text
Port: 8080
Host: localhost
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_DICT_GET_FALLBACK`
* **Question**: **What does {'a': 1}.get('b', 'Missing') return?**
* **Expected Exact Value**: `Missing`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `None` (Misconception: `MC_PY_DICT_GET_FALLBACK`)
  1. 🛑 *What Went Wrong*: The second argument 'Missing' was provided as fallback default.
  2. 💡 *Simpler Everyday Picture*: Key 'b' is absent -> returns default 'Missing'.
  3. 🛠️ *Guided Fix Prompt*: **Type Missing**


#### 🔹 Slide 3: Iterating Dictionaries: keys(), values(), items() (`py-d14-b3-dict-iteration`)

* **Primary Concept Budget**: `Dictionary Iteration`
* **Supporting Terms**: items() tuples, k, v in d.items()
* **Prerequisites**: `py-d14-b2-dict-get-safe` (understood)

##### 💻 Runnable Interactive Python Sandbox (`dict_iter.py`)
```python
scores = {'Alice': 95, 'Bob': 88}
for name, score in scores.items():
    print(f'{name}: {score}')
```
**Expected Terminal Execution Output**:
```text
Alice: 95
Bob: 88
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_DICT_ITERATION_KEYS_VS_VALUES`
* **Question**: **Which dictionary method allows you to loop over both keys and values simultaneously?**
  ✅ **Option A**: dict.items()
  ❌ **Option B**: dict.keys()
  ❌ **Option C**: dict.values()

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_DICT_ITERATION_KEYS_VS_VALUES`)
  1. 🛑 *What Went Wrong*: dict.keys() returns only keys; dict.items() yields (key, value) pairs.
  2. 💡 *Simpler Everyday Picture*: items() returns (key, value) tuples.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A: dict.items()**


### ⚡ Quest 2: Proctored Coding Exam — Character Frequency Counter

**Problem Statement**:
Write a Python function `count_char_frequencies(text: str) -> dict` returning a dict mapping each lowercase letter (ignoring spaces) to its count.

**Socratic Mentor Hint**: *Iterate text.lower(): if char != ' ': freq[char] = freq.get(char, 0) + 1*

#### 💻 Exam Starter Code (`solution.py`)
```python
def count_char_frequencies(text: str) -> dict:
    # Return frequency dict for lowercase non-space characters
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert count_char_frequencies('Hello') == {'h': 1, 'e': 1, 'l': 2, 'o': 1}, 'Test 1 Failed'
assert count_char_frequencies('A a') == {'a': 2}, 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Inventory Reorder Alert Filter

**Problem Statement**:
Write a Python function `get_low_stock_items(inventory: dict, threshold: int) -> dict` returning items where quantity <= threshold.

**Socratic Mentor Hint**: *{k: v for k, v in inventory.items() if v <= threshold}*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def get_low_stock_items(inventory: dict, threshold: int) -> dict:
    # Return low stock subset
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert get_low_stock_items({'pens': 50, 'erasers': 5, 'notebooks': 12}, 10) == {'erasers': 5}, 'Test 1 Failed'
assert get_low_stock_items({'a': 20}, 5) == {}, 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 15: ⭐ MILESTONE 3: FAST LEDGER LOOKUP & DICTIONARY SEARCH ENGINE

> **Everyday Core Metaphor**: Milestone 3 — Fast Search Index: An inverted dictionary index is like the index at the back of a textbook: instead of reading all 500 pages, you look up the word and immediately see the exact page numbers.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Dictionary grouping patterns (grouping records by category)
- **Concept**: Inverted index construction
- **Concept**: Milestone Project: High-Speed Transaction Search & Grouping Engine

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Dictionary Grouping Pattern (setdefault / list grouping) (`py-d15-b1-dict-grouping`)

* **Primary Concept Budget**: `Record Grouping`
* **Supporting Terms**: Grouping by Category, setdefault()
* **Prerequisites**: `py-d14-b3-dict-iteration` (understood)

##### 💻 Runnable Interactive Python Sandbox (`grouping.py`)
```python
txs = [('FOOD', 15.0), ('TECH', 100.0), ('FOOD', 25.0)]
grouped = {}
for cat, amt in txs:
    grouped.setdefault(cat, []).append(amt)
print('Grouped Ledger:', grouped)
```
**Expected Terminal Execution Output**:
```text
Grouped Ledger: {'FOOD': [15.0, 25.0], 'TECH': [100.0]}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_DICT_GET_FALLBACK`
* **Question**: **How many items are in grouped['FOOD'] in the code above?**
* **Expected Exact Value**: `2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_DICT_GET_FALLBACK`)
  1. 🛑 *What Went Wrong*: FOOD has two entries (15.0 and 25.0), so len is 2.
  2. 💡 *Simpler Everyday Picture*: [15.0, 25.0] has 2 elements.
  3. 🛠️ *Guided Fix Prompt*: **Type 2**


#### 🔹 Slide 2: Category Balance Aggregator Pattern (`py-d15-b2-frequency-aggregation`)

* **Primary Concept Budget**: `Aggregation Pattern`
* **Supporting Terms**: Running Sum per Category, dict accumulator
* **Prerequisites**: `py-d15-b1-dict-grouping` (understood)

##### 💻 Runnable Interactive Python Sandbox (`aggregator.py`)
```python
items = [('FOOD', 15.5), ('TECH', 50.0), ('FOOD', 10.5)]
totals = {}
for cat, cost in items:
    totals[cat] = totals.get(cat, 0.0) + cost
print('Category Totals:', totals)
```
**Expected Terminal Execution Output**:
```text
Category Totals: {'FOOD': 26.0, 'TECH': 50.0}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_DICT_GET_FALLBACK`
* **Question**: **What is totals['FOOD'] (15.5 + 10.5) in the aggregator above?**
* **Expected Exact Value**: `26.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `15.5` (Misconception: `MC_PY_DICT_GET_FALLBACK`)
  1. 🛑 *What Went Wrong*: 15.5 + 10.5 accumulates to 26.0.
  2. 💡 *Simpler Everyday Picture*: 15.5 + 10.5 = 26.0.
  3. 🛠️ *Guided Fix Prompt*: **Type 26.0**


#### 🔹 Slide 3: Fast O(1) Key Lookup vs O(N) Linear Scan (`py-d15-b3-fast-search-index`)

* **Primary Concept Budget**: `Hash Lookup Efficiency`
* **Supporting Terms**: O(1) Instant Retrieval, Hash Map Mechanics
* **Prerequisites**: `py-d15-b2-frequency-aggregation` (understood)

##### 💻 Runnable Interactive Python Sandbox (`search_index.py`)
```python
index = {'TX_101': {'amount': 500, 'status': 'SETTLED'}}
lookup = index.get('TX_101')
print('Retrieved in O(1):', lookup['status'])
```
**Expected Terminal Execution Output**:
```text
Retrieved in O(1): SETTLED
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_DICT_KEY_ERROR`
* **Question**: **Why are dictionary lookups faster than scanning an unindexed list of 1,000,000 items?**
  ✅ **Option A**: Dictionaries use hash keys for instant O(1) direct memory lookup
  ❌ **Option B**: Dictionaries compress strings into smaller text
  ❌ **Option C**: Dictionaries run on the GPU

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_DICT_KEY_ERROR`)
  1. 🛑 *What Went Wrong*: Dictionaries use hash tables for instant O(1) access.
  2. 💡 *Simpler Everyday Picture*: Hash keys jump straight to the data address in O(1) time.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored Coding Exam — Ledger Category Aggregator

**Problem Statement**:
Write a Python function `aggregate_by_category(transactions: list) -> dict` where each transaction is `{'category': str, 'amount': float}`. Return dict summing amounts per category.

**Socratic Mentor Hint**: *totals = {}; for t in transactions: totals[t['category']] = round(totals.get(t['category'], 0.0) + t['amount'], 2); return totals*

#### 💻 Exam Starter Code (`solution.py`)
```python
def aggregate_by_category(transactions: list) -> dict:
    # Sum transaction amounts per category
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
txs = [{'category': 'FOOD', 'amount': 15.5}, {'category': 'TECH', 'amount': 120.0}, {'category': 'FOOD', 'amount': 10.5}]
assert aggregate_by_category(txs) == {'FOOD': 26.0, 'TECH': 120.0}, 'Test 1 Failed'
assert aggregate_by_category([]) == {}, 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — User Search by Email Domain Indexer

**Problem Statement**:
Write a Python function `index_users_by_domain(users: list) -> dict` where users is a list of emails. Return dict mapping domain (after '@') to list of usernames.

**Socratic Mentor Hint**: *domain_map = {}; for u in users: user, domain = u.split('@'); domain_map.setdefault(domain, []).append(user); return domain_map*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def index_users_by_domain(users: list) -> dict:
    # Group usernames by domain
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
users = ['alice@pinit.ai', 'bob@gmail.com', 'charlie@pinit.ai']
assert index_users_by_domain(users) == {'pinit.ai': ['alice', 'charlie'], 'gmail.com': ['bob']}, 'Test 1 Failed'
print('All 1 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 16: OBJECT-ORIENTED PROGRAMMING — CLASSES, SELF & OBJECT INSTANTIATION

> **Everyday Core Metaphor**: A Class is an architectural blueprint (drawing of a house). An Object is the actual house built from that blueprint on a piece of land in memory.

### 🎯 Day Overview & Learning Objectives
- **Concept**: The class keyword and instantiating objects
- **Concept**: The self parameter (explicit receiver of method calls)
- **Concept**: Instance attributes vs class variables

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: What is a Class? (Blueprint vs Object Instance) (`py-d16-b1-class-blueprint`)

* **Primary Concept Budget**: `Class Definition`
* **Supporting Terms**: Blueprint, Instance Object
* **Prerequisites**: `py-d14-b1-dict-syntax` (understood)

##### 💡 Real-World Physical Analogy: *A Cookie Cutter vs Cookies*
The metal cookie cutter (Class) is not edible; each individual cookie stamped out from it (Object) has its own frosting and sprinkles.

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
class Dog:
    species = 'Canine' # Class attribute

my_dog = Dog() # Creating an object instance
```
* **Line 1**: class keyword creates the blueprint.
* **Line 4**: Dog() stamps out a new object in memory.

##### 💻 Runnable Interactive Python Sandbox (`dog_class.py`)
```python
class Car:
    brand = 'Tesla'

car1 = Car()
print('Car Brand:', car1.brand)
```
**Expected Terminal Execution Output**:
```text
Car Brand: Tesla
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_CLASS_VS_INSTANCE`
* **Question**: **What is the relationship between a Class and an Object in Python?**
  ✅ **Option A**: A Class is the blueprint; an Object is the concrete instance created from it
  ❌ **Option B**: A Class is a number; an Object is text
  ❌ **Option C**: They are completely identical

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_CLASS_VS_INSTANCE`)
  1. 🛑 *What Went Wrong*: Classes define the structure; objects hold individual runtime state.
  2. 💡 *Simpler Everyday Picture*: Class = blueprint; Object = actual building.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: The self Parameter (Instance Self-Reference) (`py-d16-b2-self-parameter`)

* **Primary Concept Budget**: `The self Parameter`
* **Supporting Terms**: Explicit Receiver, self.attribute
* **Prerequisites**: `py-d16-b1-class-blueprint` (understood)

##### 💡 Real-World Physical Analogy: *Saying 'My Own Name'*
When you introduce yourself, you say 'My name is Alex'. 'self' refers to the specific instance whose method is being executed.

##### 💻 Runnable Interactive Python Sandbox (`self_demo.py`)
```python
class Player:
    def speak(self, greeting):
        print(f'{greeting}, I am ready!')

p = Player()
p.speak('Hello')
```
**Expected Terminal Execution Output**:
```text
Hello, I am ready!
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_SELF_FIRST_PARAMETER`
* **Question**: **Why must Python instance methods have 'self' as their first parameter?**
  ✅ **Option A**: To give the method access to the specific object instance calling it
  ❌ **Option B**: It is a required Python security token
  ❌ **Option C**: To make methods run on separate threads

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_SELF_FIRST_PARAMETER`)
  1. 🛑 *What Went Wrong*: self represents the current object instance calling the method.
  2. 💡 *Simpler Everyday Picture*: self binds the method to that specific object.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Multiple Independent Object Instances (`py-d16-b3-multiple-instances`)

* **Primary Concept Budget**: `Independent Instance State`
* **Supporting Terms**: Separate Heap Memory, State Isolation
* **Prerequisites**: `py-d16-b2-self-parameter` (understood)

##### 💻 Runnable Interactive Python Sandbox (`instances.py`)
```python
class Counter:
    def __init__(self):
        self.val = 0
    def inc(self):
        self.val += 1

c1 = Counter()
c2 = Counter()
c1.inc()
print('c1:', c1.val, '| c2:', c2.val)
```
**Expected Terminal Execution Output**:
```text
c1: 1 | c2: 0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_CLASS_VS_INSTANCE`
* **Question**: **When c1.inc() runs, why does c2.val stay 0?**
* **Expected Exact Value**: `c1: 1 | c2: 0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `c1: 1 | c2: 1` (Misconception: `MC_PY_CLASS_VS_INSTANCE`)
  1. 🛑 *What Went Wrong*: c1 and c2 are separate objects in memory; mutating c1 does not touch c2.
  2. 💡 *Simpler Everyday Picture*: Each object has its own independent storage.
  3. 🛠️ *Guided Fix Prompt*: **Type c1: 1 | c2: 0**


### ⚡ Quest 2: Proctored Coding Exam — BankAccount Class with Deposit & Balance

**Problem Statement**:
Implement `BankAccount` with `__init__(self, owner: str, balance: float = 0.0)`, `deposit(self, amount: float)`, and `get_balance(self) -> float`.

**Socratic Mentor Hint**: *Ensure deposit increases balance only when amount > 0.*

#### 💻 Exam Starter Code (`solution.py`)
```python
class BankAccount:
    def __init__(self, owner: str, balance: float = 0.0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float):
        if amount > 0:
            self.balance += amount

    def get_balance(self) -> float:
        return self.balance

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
acc = BankAccount('Alex', 100.0)
acc.deposit(50.0)
assert acc.get_balance() == 150.0, 'Test 1 Failed'
acc.deposit(-20.0)
assert acc.get_balance() == 150.0, 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Item Product Entity with Discount

**Problem Statement**:
Implement `Product` with `__init__(self, name: str, price: float)`, `apply_discount(self, rate: float)`, and `get_price(self) -> float`.

**Socratic Mentor Hint**: *price after discount is price * (1 - rate)*

#### 💻 Assignment Starter Code (`solution.py`)
```python
class Product:
    def __init__(self, name: str, price: float):
        self.name = name
        self.price = price

    def apply_discount(self, rate: float):
        self.price = round(self.price * (1 - rate), 2)

    def get_price(self) -> float:
        return self.price

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
p = Product('Keyboard', 100.0)
p.apply_discount(0.15)
assert p.get_price() == 85.0, 'Test 1 Failed'
print('All 1 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 17: CONSTRUCTORS (__INIT__), DEFAULT VALUES & INSTANCE STATE

> **Everyday Core Metaphor**: The __init__ method is like a factory setup crew: the moment a new car rolls off the production line, the crew sets up its owner name, paint color, and fuel tank.

### 🎯 Day Overview & Learning Objectives
- **Concept**: The __init__() dunder method lifecycle
- **Concept**: Parameter defaults in constructors
- **Concept**: Validating arguments during instantiation

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The __init__() Constructor Method (`py-d17-b1-init-constructor`)

* **Primary Concept Budget**: `Constructor Initialization`
* **Supporting Terms**: __init__(self, ...), Instance Attributes
* **Prerequisites**: `py-d16-b2-self-parameter` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
class User:
    def __init__(self, name, email):
        self.name = name   # Set instance attribute
        self.email = email
```
* **Line 2**: __init__ runs automatically when User('Alex', 'a@b.com') is called.

##### 💻 Runnable Interactive Python Sandbox (`user_init.py`)
```python
class User:
    def __init__(self, name, role='MEMBER'):
        self.name = name
        self.role = role

u = User('Sarah')
print(f'User: {u.name} ({u.role})')
```
**Expected Terminal Execution Output**:
```text
User: Sarah (MEMBER)
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_INIT_CONSTRUCTOR_RETURN`
* **Question**: **When does the __init__() method execute in Python?**
  ✅ **Option A**: Automatically as soon as a new object instance is created
  ❌ **Option B**: Only when you explicitly call obj.__init__()
  ❌ **Option C**: At the end of the Python script

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_INIT_CONSTRUCTOR_RETURN`)
  1. 🛑 *What Went Wrong*: __init__ is called automatically by Python during instantiation.
  2. 💡 *Simpler Everyday Picture*: Calling Class() automatically triggers __init__.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Constructor Defaults & The Mutable Default Trap (`py-d17-b2-default-args-trap`)

* **Primary Concept Budget**: `Default Arguments`
* **Supporting Terms**: Default Values, None as Safe Default
* **Prerequisites**: `py-d17-b1-init-constructor` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```python
# ❌ BROKEN / BUGGY PATTERN
class Box:
    def __init__(self, items=[]): # ❌ Shared list across all Box instances!
        self.items = items

# ✅ CORRECT / PRODUCTION FIX
class Box:
    def __init__(self, items=None): # ✅ Safe default
        self.items = [] if items is None else items
```
* **Error Reason**: Default list [] is evaluated ONCE at function definition time, sharing the list across all objects.
* **Fix Explanation**: Use items=None and initialize self.items = [] inside __init__.

##### 💻 Runnable Interactive Python Sandbox (`safe_init.py`)
```python
class SafeBox:
    def __init__(self, items=None):
        self.items = [] if items is None else items

b1 = SafeBox()
b1.items.append('Gold')
b2 = SafeBox()
print('b2 items (isolated):', b2.items)
```
**Expected Terminal Execution Output**:
```text
b2 items (isolated): []
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_DEFAULT_PARAM_MUTABLE`
* **Question**: **Why should you use items=None instead of items=[] as a default parameter?**
  ✅ **Option A**: To prevent all instances from accidentally sharing the same mutable list in memory
  ❌ **Option B**: Because empty lists take up too much RAM
  ❌ **Option C**: Because Python does not support [] in headers

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_DEFAULT_PARAM_MUTABLE`)
  1. 🛑 *What Went Wrong*: Mutable default arguments ([] or {}) are shared across all calls.
  2. 💡 *Simpler Everyday Picture*: Use None to ensure every object gets a fresh new list.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Defensive Validation in Constructors (`py-d17-b3-defensive-init`)

* **Primary Concept Budget**: `Constructor Invariant Checking`
* **Supporting Terms**: raise ValueError, Input Sanitization
* **Prerequisites**: `py-d17-b2-default-args-trap` (understood)

##### 💻 Runnable Interactive Python Sandbox (`defensive.py`)
```python
class Account:
    def __init__(self, balance):
        if balance < 0:
            raise ValueError('Balance cannot be negative')
        self.balance = balance

acc = Account(100)
print('Account Created Balance:', acc.balance)
```
**Expected Terminal Execution Output**:
```text
Account Created Balance: 100
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_INIT_CONSTRUCTOR_RETURN`
* **Question**: **What is printed if balance=100 is passed to Account?**
* **Expected Exact Value**: `Account Created Balance: 100`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Error` (Misconception: `MC_PY_INIT_CONSTRUCTOR_RETURN`)
  1. 🛑 *What Went Wrong*: 100 is >= 0, so validation passes cleanly.
  2. 💡 *Simpler Everyday Picture*: 100 is valid -> prints Account Created Balance: 100.
  3. 🛠️ *Guided Fix Prompt*: **Type Account Created Balance: 100**


### ⚡ Quest 2: Proctored Coding Exam — Validated User Profile Constructor

**Problem Statement**:
Implement `UserProfile` with `__init__(self, username: str, email: str, role: str = 'STUDENT')`. Raise `ValueError` if username is empty or email lacks '@'.

**Socratic Mentor Hint**: *Check if not username: raise ValueError; if '@' not in email: raise ValueError*

#### 💻 Exam Starter Code (`solution.py`)
```python
class UserProfile:
    def __init__(self, username: str, email: str, role: str = 'STUDENT'):
        if not username:
            raise ValueError('Username cannot be empty')
        if '@' not in email:
            raise ValueError('Invalid email')
        self.username = username
        self.email = email
        self.role = role

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
u = UserProfile('sarah', 'sarah@pinit.ai')
assert u.role == 'STUDENT', 'Test 1 Failed'
try:
    UserProfile('', 'test@pinit.ai')
    assert False, 'Test 2 Failed'
except ValueError:
    pass
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Timer Config Entity

**Problem Statement**:
Implement `TimerConfig` with `__init__(self, duration_sec: int, is_countdown: bool = True)`. If duration_sec <= 0, raise ValueError.

**Socratic Mentor Hint**: *Validate duration_sec > 0 in __init__.*

#### 💻 Assignment Starter Code (`solution.py`)
```python
class TimerConfig:
    def __init__(self, duration_sec: int, is_countdown: bool = True):
        if duration_sec <= 0:
            raise ValueError('Duration must be positive')
        self.duration_sec = duration_sec
        self.is_countdown = is_countdown

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
t = TimerConfig(60)
assert t.is_countdown == True, 'Test 1 Failed'
try:
    TimerConfig(-5)
    assert False, 'Test 2 Failed'
except ValueError:
    pass
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 18: ENCAPSULATION, PRIVATE ATTRIBUTES (_VAR, __VAR) & PROPERTIES (@PROPERTY)

> **Everyday Core Metaphor**: Encapsulation is like a bank teller window: customers cannot walk behind the counter and grab cash directly; they must ask the teller (getter/setter) who enforces security rules.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Single underscore (_protected) vs double underscore (__private name mangling)
- **Concept**: The @property decorator for clean attribute access
- **Concept**: The @<field>.setter decorator with validation

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Protected (_var) & Private (__var) Attributes (`py-d18-b1-private-naming`)

* **Primary Concept Budget**: `Private Naming Conventions`
* **Supporting Terms**: _protected Convention, __private Name Mangling
* **Prerequisites**: `py-d17-b1-init-constructor` (understood)

##### 💡 Real-World Physical Analogy: *A 'Private: Staff Only' Door Sign*
A single underscore _ tells other developers 'do not touch this internal field'. Double underscore __ triggers Python name mangling.

##### 💻 Runnable Interactive Python Sandbox (`private_demo.py`)
```python
class Vault:
    def __init__(self, secret):
        self._secret = secret # Protected by convention

v = Vault('pass123')
print('Vault created with protected state.')
```
**Expected Terminal Execution Output**:
```text
Vault created with protected state.
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_PRIVATE_ATTRIBUTE_MANGLING`
* **Question**: **In Python, what does a leading underscore `_balance` signal to other developers?**
  ✅ **Option A**: It is an internal/protected attribute that should not be modified directly
  ❌ **Option B**: It is a constant that cannot change
  ❌ **Option C**: It is an encrypted string

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_PRIVATE_ATTRIBUTE_MANGLING`)
  1. 🛑 *What Went Wrong*: Leading underscore indicates private/internal implementation details.
  2. 💡 *Simpler Everyday Picture*: _var = internal use only convention.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: The @property Getter & @<field>.setter Decorators (`py-d18-b2-property-decorator`)

* **Primary Concept Budget**: `Properties (@property)`
* **Supporting Terms**: @property Getter, @field.setter Validator
* **Prerequisites**: `py-d18-b1-private-naming` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
class Account:
    def __init__(self, bal):
        self._bal = bal

    @property
    def bal(self):
        return self._bal

    @bal.setter
    def bal(self, val):
        if val < 0:
            raise ValueError('No negative balances')
        self._bal = val
```
* **Line 5**: @property allows reading acc.bal like an attribute.
* **Line 9**: @bal.setter runs validation when acc.bal = 50 is assigned.

##### 💻 Runnable Interactive Python Sandbox (`property_demo.py`)
```python
class SafeVault:
    def __init__(self, cash):
        self._cash = cash
    @property
    def cash(self):
        return self._cash

v = SafeVault(500)
print('Cash read via property: $', v.cash)
```
**Expected Terminal Execution Output**:
```text
Cash read via property: $ 500
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_PROPERTY_GETTER_SETTER`
* **Question**: **How do you access a method decorated with @property in Python?**
  ✅ **Option A**: Like a normal attribute without parentheses: obj.cash
  ❌ **Option B**: By calling it with parentheses: obj.cash()
  ❌ **Option C**: By calling obj.get_cash()

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_PROPERTY_GETTER_SETTER`)
  1. 🛑 *What Went Wrong*: @property allows methods to be accessed cleanly as obj.cash.
  2. 💡 *Simpler Everyday Picture*: Property methods are read without () parentheses.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A: obj.cash**


#### 🔹 Slide 3: Dynamic Computed Properties (`py-d18-b3-computed-properties`)

* **Primary Concept Budget**: `Computed Properties`
* **Supporting Terms**: Derived State, On-the-Fly Calculation
* **Prerequisites**: `py-d18-b2-property-decorator` (understood)

##### 💻 Runnable Interactive Python Sandbox (`rect.py`)
```python
class Rectangle:
    def __init__(self, w, h):
        self.w = w
        self.h = h
    @property
    def area(self):
        return self.w * self.h

r = Rectangle(4, 5)
print('Area computed dynamically:', r.area)
```
**Expected Terminal Execution Output**:
```text
Area computed dynamically: 20
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_PROPERTY_GETTER_SETTER`
* **Question**: **For Rectangle(4, 5), what is r.area?**
* **Expected Exact Value**: `Area computed dynamically: 20`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `9` (Misconception: `MC_PY_PROPERTY_GETTER_SETTER`)
  1. 🛑 *What Went Wrong*: area is width * height = 4 * 5 = 20.
  2. 💡 *Simpler Everyday Picture*: 4 * 5 = 20.
  3. 🛠️ *Guided Fix Prompt*: **Type Area computed dynamically: 20**


### ⚡ Quest 2: Proctored Coding Exam — Encapsulated Temperature with Kelvin Property

**Problem Statement**:
Implement `Temperature` class with `@property celsius` and `@property kelvin`. Setting celsius should validate that celsius >= -273.15 (else raise ValueError).

**Socratic Mentor Hint**: *Use @property and @celsius.setter with self._celsius backing field.*

#### 💻 Exam Starter Code (`solution.py`)
```python
class Temperature:
    def __init__(self, celsius: float = 0.0):
        self.celsius = celsius

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, val: float):
        if val < -273.15:
            raise ValueError('Below absolute zero')
        self._celsius = val

    @property
    def kelvin(self) -> float:
        return round(self._celsius + 273.15, 2)

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
t = Temperature(25.0)
assert t.kelvin == 298.15, 'Test 1 Failed'
t.celsius = 0.0
assert t.kelvin == 273.15, 'Test 2 Failed'
try:
    t.celsius = -300.0
    assert False, 'Test 3 Failed'
except ValueError:
    pass
print('All 3 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Wallet with Non-Negative Balance Property

**Problem Statement**:
Implement `Wallet` with `@property balance` and `@balance.setter` raising ValueError if balance is set to negative.

**Socratic Mentor Hint**: *Validate val >= 0 in setter.*

#### 💻 Assignment Starter Code (`solution.py`)
```python
class Wallet:
    def __init__(self, balance: float = 0.0):
        self.balance = balance

    @property
    def balance(self) -> float:
        return self._balance

    @balance.setter
    def balance(self, val: float):
        if val < 0:
            raise ValueError('Negative balance')
        self._balance = val

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
w = Wallet(50.0)
w.balance = 20.0
assert w.balance == 20.0, 'Test 1 Failed'
try:
    w.balance = -10.0
    assert False, 'Test 2 Failed'
except ValueError:
    pass
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 19: INHERITANCE (CLASS CHILD(PARENT)), METHOD OVERRIDING & SUPER()

> **Everyday Core Metaphor**: Inheritance is genetic inheritance: a Child smartphone inherits basic Phone abilities (making calls) while adding its own unique features (touch screen, browsing).

### 🎯 Day Overview & Learning Objectives
- **Concept**: Single inheritance syntax: class Child(Parent)
- **Concept**: Calling parent constructor with super().__init__(...)
- **Concept**: Method overriding and extending base behavior

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Single Inheritance Syntax: class Child(Parent) (`py-d19-b1-inheritance-syntax`)

* **Primary Concept Budget**: `Inheritance (Subclassing)`
* **Supporting Terms**: Base / Parent Class, Derived / Child Class
* **Prerequisites**: `py-d16-b1-class-blueprint` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
class Vehicle:      # Parent base class
    pass

class Car(Vehicle): # Child derived class
    pass
```
* **Line 4**: Passing Vehicle inside Car(...) sets Vehicle as the parent.

##### 💻 Runnable Interactive Python Sandbox (`inheritance.py`)
```python
class Animal:
    def speak(self):
        return 'Generic Sound'

class Dog(Animal):
    pass # Inherits speak() from Animal

d = Dog()
print('Dog sound:', d.speak())
```
**Expected Terminal Execution Output**:
```text
Dog sound: Generic Sound
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_INHERITANCE_SUPER_CALL`
* **Question**: **How do you specify that `SmartPhone` inherits from `Phone` in Python?**
  ✅ **Option A**: class SmartPhone(Phone):
  ❌ **Option B**: class SmartPhone extends Phone:
  ❌ **Option C**: class SmartPhone inherits Phone:

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_INHERITANCE_SUPER_CALL`)
  1. 🛑 *What Went Wrong*: Python uses parentheses `class Child(Parent):`, not the `extends` keyword (which is Java/JS).
  2. 💡 *Simpler Everyday Picture*: In Python: class Child(Parent):
  3. 🛠️ *Guided Fix Prompt*: **Select Option A: class SmartPhone(Phone):**


#### 🔹 Slide 2: Calling Parent Constructor with super().__init__() (`py-d19-b2-super-init`)

* **Primary Concept Budget**: `The super() Proxy`
* **Supporting Terms**: super().__init__(), Parent State Setup
* **Prerequisites**: `py-d19-b1-inheritance-syntax` (understood)

##### 💻 Runnable Interactive Python Sandbox (`super_demo.py`)
```python
class Person:
    def __init__(self, name):
        self.name = name

class Student(Person):
    def __init__(self, name, grade):
        super().__init__(name) # Pass name to parent
        self.grade = grade

s = Student('Emily', 10)
print(f'Student: {s.name}, Grade: {s.grade}')
```
**Expected Terminal Execution Output**:
```text
Student: Emily, Grade: 10
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_INHERITANCE_SUPER_CALL`
* **Question**: **What is the purpose of calling `super().__init__(name)` in a child constructor?**
  ✅ **Option A**: To initialize the inherited fields defined in the parent class
  ❌ **Option B**: To delete the parent class from memory
  ❌ **Option C**: To convert the child into a parent

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_INHERITANCE_SUPER_CALL`)
  1. 🛑 *What Went Wrong*: super().__init__() executes the parent's initialization logic.
  2. 💡 *Simpler Everyday Picture*: Initializes parent attributes properly.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Method Overriding in Subclasses (`py-d19-b3-method-overriding`)

* **Primary Concept Budget**: `Method Overriding`
* **Supporting Terms**: Polymorphic Dispatch, Specialized Behavior
* **Prerequisites**: `py-d19-b2-super-init` (understood)

##### 💻 Runnable Interactive Python Sandbox (`override.py`)
```python
class Bird:
    def sound(self):
        return 'Chirp'

class Duck(Bird):
    def sound(self): # Overrides sound()
        return 'Quack'

print('Duck says:', Duck().sound())
```
**Expected Terminal Execution Output**:
```text
Duck says: Quack
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_METHOD_OVERRIDING_DISPATCH`
* **Question**: **What does Duck().sound() return in the code above?**
* **Expected Exact Value**: `Duck says: Quack`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Chirp` (Misconception: `MC_PY_METHOD_OVERRIDING_DISPATCH`)
  1. 🛑 *What Went Wrong*: Duck overrides sound() to return 'Quack' instead of 'Chirp'.
  2. 💡 *Simpler Everyday Picture*: Subclass definition takes precedence.
  3. 🛠️ *Guided Fix Prompt*: **Type Duck says: Quack**


### ⚡ Quest 2: Proctored Coding Exam — Employee & Manager Class Hierarchy

**Problem Statement**:
Implement `Employee(name, base_salary)` with `get_total_compensation()` returning base_salary, and `Manager(Employee)` with `bonus` added in `get_total_compensation()`.

**Socratic Mentor Hint**: *Use super().__init__(name, base_salary) in Manager.*

#### 💻 Exam Starter Code (`solution.py`)
```python
class Employee:
    def __init__(self, name: str, base_salary: float):
        self.name = name
        self.base_salary = base_salary

    def get_total_compensation(self) -> float:
        return self.base_salary

class Manager(Employee):
    def __init__(self, name: str, base_salary: float, bonus: float):
        super().__init__(name, base_salary)
        self.bonus = bonus

    def get_total_compensation(self) -> float:
        return self.base_salary + self.bonus

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
e = Employee('Alice', 5000.0)
assert e.get_total_compensation() == 5000.0, 'Test 1 Failed'
m = Manager('Bob', 7000.0, 2000.0)
assert m.get_total_compensation() == 9000.0, 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Shape & Rectangle Class Hierarchy

**Problem Statement**:
Implement `Shape(color)` and `Rectangle(Shape)` with `width` and `height`, and `get_area()` returning width * height.

**Socratic Mentor Hint**: *Pass color to super().__init__(color).*

#### 💻 Assignment Starter Code (`solution.py`)
```python
class Shape:
    def __init__(self, color: str):
        self.color = color

class Rectangle(Shape):
    def __init__(self, color: str, width: float, height: float):
        super().__init__(color)
        self.width = width
        self.height = height

    def get_area(self) -> float:
        return self.width * self.height

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
r = Rectangle('blue', 4.0, 5.0)
assert r.color == 'blue', 'Test 1 Failed'
assert r.get_area() == 20.0, 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 20: POLYMORPHISM, DUCK TYPING & MAGIC METHODS (__STR__, __LEN__, __EQ__)

> **Everyday Core Metaphor**: Duck typing is the golden rule of Python: 'If it walks like a duck and quacks like a duck, Python treats it as a duck!' You do not need rigid interface contracts; if the object has the required method, it runs.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Duck typing: focusing on behavior rather than explicit inheritance
- **Concept**: Overloading string representation: __str__ and __repr__
- **Concept**: Overloading length __len__ and equality __eq__

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Duck Typing & Polymorphic Dispatch (`py-d20-b1-duck-typing`)

* **Primary Concept Budget**: `Duck Typing`
* **Supporting Terms**: Dynamic Dispatch, Behavior-Based Interfaces
* **Prerequisites**: `py-d19-b3-method-overriding` (understood)

##### 💡 Real-World Physical Analogy: *Any Key that Fits the Lock*
A lock doesn't care whether the key is gold, iron, or 3D-printed. If the grooves fit the lock, the door opens.

##### 💻 Runnable Interactive Python Sandbox (`duck_typing.py`)
```python
class Radio:
    def play(self): return 'Music Stream'

class TV:
    def play(self): return 'Video Stream'

for player in [Radio(), TV()]:
    print('Playing:', player.play())
```
**Expected Terminal Execution Output**:
```text
Playing: Music Stream
Playing: Video Stream
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_POLYMORPHIC_DUCK_TYPING`
* **Question**: **What is 'Duck Typing' in Python?**
  ✅ **Option A**: A system where an object's suitability is determined by the presence of methods/attributes rather than its inheritance hierarchy
  ❌ **Option B**: A library for drawing ducks
  ❌ **Option C**: A typing system only for web scrapers

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_POLYMORPHIC_DUCK_TYPING`)
  1. 🛑 *What Went Wrong*: Duck typing checks capabilities (methods present) rather than strict class types.
  2. 💡 *Simpler Everyday Picture*: If it has the method, Python runs it.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Magic Methods: __str__ and __repr__ (`py-d20-b2-str-repr-dunder`)

* **Primary Concept Budget**: `String Representation Dunders`
* **Supporting Terms**: __str__() for Users, __repr__() for Developers
* **Prerequisites**: `py-d20-b1-duck-typing` (understood)

##### 💻 Runnable Interactive Python Sandbox (`str_dunder.py`)
```python
class Book:
    def __init__(self, title):
        self.title = title
    def __str__(self):
        return f'Book: {self.title}'

b = Book('Python Mastery')
print(str(b))
```
**Expected Terminal Execution Output**:
```text
Book: Python Mastery
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_MAGIC_METHOD_STR_REPR`
* **Question**: **What does print(str(Book('Clean Code'))) display when __str__ is defined as above?**
* **Expected Exact Value**: `Book: Clean Code`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `<Book object at 0x...>` (Misconception: `MC_PY_MAGIC_METHOD_STR_REPR`)
  1. 🛑 *What Went Wrong*: Defining __str__ replaces the default memory address printout with clean readable text.
  2. 💡 *Simpler Everyday Picture*: __str__ produces human-readable strings.
  3. 🛠️ *Guided Fix Prompt*: **Type Book: Clean Code**


#### 🔹 Slide 3: Operator Overloading: __len__ and __eq__ (`py-d20-b3-len-eq-dunders`)

* **Primary Concept Budget**: `Container & Equality Dunders`
* **Supporting Terms**: __len__(), __eq__() for obj1 == obj2
* **Prerequisites**: `py-d20-b2-str-repr-dunder` (understood)

##### 💻 Runnable Interactive Python Sandbox (`container_dunders.py`)
```python
class Deck:
    def __init__(self):
        self.cards = ['A', 'K', 'Q', 'J']
    def __len__(self):
        return len(self.cards)

d = Deck()
print('Deck length:', len(d))
```
**Expected Terminal Execution Output**:
```text
Deck length: 4
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_MAGIC_METHOD_STR_REPR`
* **Question**: **What is len(Deck()) when __len__ returns len(self.cards) (which has 4 cards)?**
* **Expected Exact Value**: `Deck length: 4`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `TypeError` (Misconception: `MC_PY_MAGIC_METHOD_STR_REPR`)
  1. 🛑 *What Went Wrong*: Defining __len__ enables standard len(obj) without errors.
  2. 💡 *Simpler Everyday Picture*: __len__ connects object to len() function.
  3. 🛠️ *Guided Fix Prompt*: **Type Deck length: 4**


### ⚡ Quest 2: Proctored Coding Exam — Cart Item Container with Magic Methods

**Problem Statement**:
Implement `Cart` with `items` list, `add_item(item)`, `__len__(self)` returning count of items, and `__str__(self)` returning 'Cart: <count> items'.

**Socratic Mentor Hint**: *Implement def __len__(self) -> int and def __str__(self) -> str*

#### 💻 Exam Starter Code (`solution.py`)
```python
class Cart:
    def __init__(self):
        self.items = []

    def add_item(self, item: str):
        self.items.append(item)

    def __len__(self) -> int:
        return len(self.items)

    def __str__(self) -> str:
        return f'Cart: {len(self.items)} items'

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
c = Cart()
c.add_item('Laptop')
c.add_item('Mouse')
assert len(c) == 2, 'Test 1 Failed'
assert str(c) == 'Cart: 2 items', 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — 2D Vector with Vector Addition (__add__)

**Problem Statement**:
Implement `Vector(x, y)` with `__add__(self, other)` returning a new Vector with added coordinates `(self.x + other.x, self.y + other.y)`.

**Socratic Mentor Hint**: *Return Vector(self.x + other.x, self.y + other.y)*

#### 💻 Assignment Starter Code (`solution.py`)
```python
class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other: 'Vector') -> 'Vector':
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other) -> bool:
        return self.x == other.x and self.y == other.y

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
v1 = Vector(2, 3)
v2 = Vector(4, 5)
v3 = v1 + v2
assert v3.x == 6 and v3.y == 8, 'Test 1 Failed'
print('All 1 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 21: ⭐ MILESTONE 4: ENTERPRISE POLYMORPHIC PAYMENT GATEWAY ENGINE

> **Everyday Core Metaphor**: Milestone 4 — Payment Gateway: An e-commerce checkout treats Credit Card, UPI, and Crypto processors identically because each processor provides a uniform .process_payment(amount) method.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Designing pluggable payment contracts
- **Concept**: Polymorphic collection iteration and transaction dispatch
- **Concept**: Milestone Project: Multi-Provider Payment Gateway Engine

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Designing Pluggable Payment Processors (`py-d21-b1-processor-contracts`)

* **Primary Concept Budget**: `Pluggable Architecture`
* **Supporting Terms**: Uniform Method Signatures, Decoupled Integration
* **Prerequisites**: `py-d20-b1-duck-typing` (understood)

##### 💻 Runnable Interactive Python Sandbox (`gateway.py`)
```python
class CreditCard:
    def process(self, amt): return f'CC Paid ${amt}'

class UPI:
    def process(self, amt): return f'UPI Paid ${amt}'

def checkout(processor, amt):
    return processor.process(amt)

print(checkout(CreditCard(), 100))
print(checkout(UPI(), 50))
```
**Expected Terminal Execution Output**:
```text
CC Paid $100
UPI Paid $50
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_INTERFACE_PROTOCOL_CONTRACT`
* **Question**: **Why does checkout() accept both CreditCard and UPI instances without error?**
  ✅ **Option A**: Both objects implement the .process(amt) method signature (Duck Typing)
  ❌ **Option B**: Python automatically translates code into Java
  ❌ **Option C**: Because CreditCard and UPI are strings

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_INTERFACE_PROTOCOL_CONTRACT`)
  1. 🛑 *What Went Wrong*: Both classes provide matching .process(amt) methods.
  2. 💡 *Simpler Everyday Picture*: Matching method signatures enable polymorphic interchangeability.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Dynamic Fee Calculation Strategies (`py-d21-b2-fee-strategy`)

* **Primary Concept Budget**: `Strategy Pattern`
* **Supporting Terms**: Fee Strategies, Polymorphic Net Amount
* **Prerequisites**: `py-d21-b1-processor-contracts` (understood)

##### 💻 Runnable Interactive Python Sandbox (`fees.py`)
```python
class FixedFee:
    def fee(self, amt): return 2.0

class PercentFee:
    def fee(self, amt): return amt * 0.05

def net_payout(strategy, amt):
    return amt - strategy.fee(amt)

print('Net with fixed fee on $100:', net_payout(FixedFee(), 100))
```
**Expected Terminal Execution Output**:
```text
Net with fixed fee on $100: 98.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_INTERFACE_PROTOCOL_CONTRACT`
* **Question**: **What is net_payout for $100 with FixedFee ($2.0 fee)?**
* **Expected Exact Value**: `Net with fixed fee on $100: 98.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `100` (Misconception: `MC_PY_INTERFACE_PROTOCOL_CONTRACT`)
  1. 🛑 *What Went Wrong*: 100 - 2.0 = 98.0.
  2. 💡 *Simpler Everyday Picture*: 100 - 2 = 98.0.
  3. 🛠️ *Guided Fix Prompt*: **Type Net with fixed fee on $100: 98.0**


#### 🔹 Slide 3: Batch Transaction Dispatch & Validation (`py-d21-b3-transaction-audit-dispatch`)

* **Primary Concept Budget**: `Batch Processing Dispatch`
* **Supporting Terms**: Dispatch Loop, Transaction Record
* **Prerequisites**: `py-d21-b2-fee-strategy` (understood)

##### 💻 Runnable Interactive Python Sandbox (`batch_dispatch.py`)
```python
class Gateway:
    def process_all(self, payments):
        return [p['proc'].process(p['amt']) for p in payments]

gw = Gateway()
queue = [{'proc': CreditCard(), 'amt': 50}]
print('Batch Output:', gw.process_all(queue))
```
**Expected Terminal Execution Output**:
```text
Batch Output: ['CC Paid $50']
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_INTERFACE_PROTOCOL_CONTRACT`
* **Question**: **What is the single output item in the batch above?**
* **Expected Exact Value**: `Batch Output: ['CC Paid $50']`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `None` (Misconception: `MC_PY_INTERFACE_PROTOCOL_CONTRACT`)
  1. 🛑 *What Went Wrong*: Returns list with formatted strings.
  2. 💡 *Simpler Everyday Picture*: List comprehension collects ['CC Paid $50'].
  3. 🛠️ *Guided Fix Prompt*: **Type Batch Output: ['CC Paid $50']**


### ⚡ Quest 2: Proctored Coding Exam — Polymorphic Payment Processor Engine

**Problem Statement**:
Implement `CreditCardProcessor(fee_rate=0.02)` and `UPIProcessor(flat_fee=0.50)` both having `process_payment(amount: float) -> dict` returning `{'net': amount - fee, 'fee': fee, 'status': 'PROCESSED'}`.

**Socratic Mentor Hint**: *Compute fee based on fee_rate or flat_fee.*

#### 💻 Exam Starter Code (`solution.py`)
```python
class CreditCardProcessor:
    def __init__(self, fee_rate: float = 0.02):
        self.fee_rate = fee_rate

    def process_payment(self, amount: float) -> dict:
        fee = round(amount * self.fee_rate, 2)
        return {'net': round(amount - fee, 2), 'fee': fee, 'status': 'PROCESSED'}

class UPIProcessor:
    def __init__(self, flat_fee: float = 0.50):
        self.flat_fee = flat_fee

    def process_payment(self, amount: float) -> dict:
        fee = self.flat_fee
        return {'net': round(amount - fee, 2), 'fee': fee, 'status': 'PROCESSED'}

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
cc = CreditCardProcessor(0.02)
assert cc.process_payment(100.0) == {'net': 98.0, 'fee': 2.0, 'status': 'PROCESSED'}, 'Test 1 Failed'
upi = UPIProcessor(0.50)
assert upi.process_payment(100.0) == {'net': 99.50, 'fee': 0.50, 'status': 'PROCESSED'}, 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Polymorphic Notification Service

**Problem Statement**:
Implement `EmailNotifier` and `SMSNotifier` both having `send(recipient: str, message: str) -> str` returning '[EMAIL] to <recipient>: <message>' and '[SMS] to <recipient>: <message>'.

**Socratic Mentor Hint**: *Return formatted string prefix.*

#### 💻 Assignment Starter Code (`solution.py`)
```python
class EmailNotifier:
    def send(self, recipient: str, message: str) -> str:
        return f'[EMAIL] to {recipient}: {message}'

class SMSNotifier:
    def send(self, recipient: str, message: str) -> str:
        return f'[SMS] to {recipient}: {message}'

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
e = EmailNotifier()
assert e.send('a@b.com', 'Hi') == '[EMAIL] to a@b.com: Hi', 'Test 1 Failed'
s = SMSNotifier()
assert s.send('+1234', 'Hi') == '[SMS] to +1234: Hi', 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 22: EXCEPTION HANDLING — TRY, EXCEPT, ELSE, FINALLY & CUSTOM EXCEPTIONS

> **Everyday Core Metaphor**: Exception handling is like an airbag in a car: if a crash occurs (an error), the airbag deploys (except block), catches the impact, and keeps the passengers safe without destroying the car.

### 🎯 Day Overview & Learning Objectives
- **Concept**: The try...except Exception as e block structure
- **Concept**: The else (success only) and finally (guaranteed run) blocks
- **Concept**: Creating custom exceptions with class MyError(Exception)

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The try-except Block (Catching Runtime Errors) (`py-d22-b1-try-except`)

* **Primary Concept Budget**: `try-except Structure`
* **Supporting Terms**: ZeroDivisionError, Graceful Degradation
* **Prerequisites**: `py-d9-b2-return-vs-print` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
try:
    res = 10 / 0 # Crash attempt
except ZeroDivisionError:
    print('Cannot divide by zero!') # Safe recovery
```
* **Line 1**: try block contains risky code.
* **Line 3**: except catches specific error and prevents program crash.

##### 💻 Runnable Interactive Python Sandbox (`try_demo.py`)
```python
try:
    val = 10 / 0
except ZeroDivisionError:
    val = 0
print('Safe Value:', val)
```
**Expected Terminal Execution Output**:
```text
Safe Value: 0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_DIVIDE_BY_ZERO`
* **Question**: **When 10 / 0 is intercepted by except ZeroDivisionError: val = 0, what does print('Safe Value:', val) output?**
* **Expected Exact Value**: `Safe Value: 0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Crash` (Misconception: `MC_PY_DIVIDE_BY_ZERO`)
  1. 🛑 *What Went Wrong*: try-except intercepted the division by zero and assigned val = 0.
  2. 💡 *Simpler Everyday Picture*: The crash was caught and handled safely.
  3. 🛠️ *Guided Fix Prompt*: **Type Safe Value: 0**


#### 🔹 Slide 2: The else & finally Blocks (Guaranteed Cleanup) (`py-d22-b2-else-finally`)

* **Primary Concept Budget**: `else and finally Clauses`
* **Supporting Terms**: else (runs on success), finally (ALWAYS runs)
* **Prerequisites**: `py-d22-b1-try-except` (understood)

##### 💡 Real-World Physical Analogy: *Locking the Front Door When Leaving*
Whether your cooking was successful or burnt, you ALWAYS turn off the stove and lock the door (finally block).

##### 💻 Runnable Interactive Python Sandbox (`finally_demo.py`)
```python
try:
    x = 10 / 2
except ZeroDivisionError:
    print('Error')
finally:
    print('Cleanup: Resources Released')
```
**Expected Terminal Execution Output**:
```text
Cleanup: Resources Released
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_FINALLY_ALWAYS_RUNS`
* **Question**: **Under what conditions does code inside a `finally:` block execute?**
  ✅ **Option A**: ALWAYS, regardless of whether errors occurred, were caught, or didn't happen
  ❌ **Option B**: Only when an unhandled error happens
  ❌ **Option C**: Only when no errors occur

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_FINALLY_ALWAYS_RUNS`)
  1. 🛑 *What Went Wrong*: finally blocks are guaranteed to run in all execution paths.
  2. 💡 *Simpler Everyday Picture*: finally = ALWAYS runs guaranteed.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Raising Exceptions with raise & Custom Errors (`py-d22-b3-raise-custom-exceptions`)

* **Primary Concept Budget**: `The raise Keyword`
* **Supporting Terms**: raise ValueError(), Custom Error Class
* **Prerequisites**: `py-d22-b2-else-finally` (understood)

##### 💻 Runnable Interactive Python Sandbox (`raise_demo.py`)
```python
class InvalidAmountError(Exception):
    pass

def deposit(amt):
    if amt <= 0:
        raise InvalidAmountError('Amount must be > 0')
    return amt

try:
    deposit(-10)
except InvalidAmountError as e:
    print('Caught Custom Error:', e)
```
**Expected Terminal Execution Output**:
```text
Caught Custom Error: Amount must be > 0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_RAISE_EXCEPTION_TYPE`
* **Question**: **In the code above, what error message is printed inside e?**
* **Expected Exact Value**: `Caught Custom Error: Amount must be > 0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `None` (Misconception: `MC_PY_RAISE_EXCEPTION_TYPE`)
  1. 🛑 *What Went Wrong*: e contains the string passed to the exception constructor.
  2. 💡 *Simpler Everyday Picture*: Prints 'Caught Custom Error: Amount must be > 0'.
  3. 🛠️ *Guided Fix Prompt*: **Type Caught Custom Error: Amount must be > 0**


### ⚡ Quest 2: Proctored Coding Exam — Safe Division with Error Telemetry

**Problem Statement**:
Write a Python function `safe_divide_logged(a: float, b: float) -> dict` returning `{'result': a/b, 'error': None}` or `{'result': None, 'error': 'ZeroDivisionError'}` on divide-by-zero.

**Socratic Mentor Hint**: *try: return {'result': a / b, 'error': None} except ZeroDivisionError: return {'result': None, 'error': 'ZeroDivisionError'}*

#### 💻 Exam Starter Code (`solution.py`)
```python
def safe_divide_logged(a: float, b: float) -> dict:
    # Return result or caught error name
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert safe_divide_logged(10, 2) == {'result': 5.0, 'error': None}, 'Test 1 Failed'
assert safe_divide_logged(10, 0) == {'result': None, 'error': 'ZeroDivisionError'}, 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Custom InsufficientFundsError Validator

**Problem Statement**:
Define `InsufficientFundsError(Exception)`. Write `withdraw(balance: float, amount: float) -> float` raising `InsufficientFundsError('Overdraft')` if amount > balance, else returning balance - amount.

**Socratic Mentor Hint**: *Raise InsufficientFundsError when amount > balance.*

#### 💻 Assignment Starter Code (`solution.py`)
```python
class InsufficientFundsError(Exception):
    pass

def withdraw(balance: float, amount: float) -> float:
    if amount > balance:
        raise InsufficientFundsError('Overdraft')
    return balance - amount

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert withdraw(100.0, 40.0) == 60.0, 'Test 1 Failed'
try:
    withdraw(50.0, 80.0)
    assert False, 'Test 2 Failed'
except InsufficientFundsError:
    pass
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 23: CONTEXT MANAGERS & SAFE FILE I/O (WITH OPEN(...) AS F:)

> **Everyday Core Metaphor**: The `with open()` context manager is like an automatic sliding door at a supermarket: as soon as you enter, it opens; and the moment you step out, it automatically shuts and locks behind you, preventing resource leaks.

### 🎯 Day Overview & Learning Objectives
- **Concept**: The with statement and context manager protocol (__enter__, __exit__)
- **Concept**: Reading text line by line with readline() and for line in f
- **Concept**: Parsing comma-separated value (CSV) text streams

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: The with Statement & Automatic File Closing (`py-d23-b1-with-open-syntax`)

* **Primary Concept Budget**: `Context Manager (with open)`
* **Supporting Terms**: Automatic Descriptor Close, File Modes ('r', 'w', 'a')
* **Prerequisites**: `py-d22-b2-else-finally` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
with open('log.txt', 'r') as f:
    data = f.read() # Automatically closed when block ends!
```
* **Line 1**: with open ensures the file handle is closed even if crashes happen.

##### 💻 Runnable Interactive Python Sandbox (`file_io.py`)
```python
import io

simulated_file = io.StringIO('Line 1\nLine 2')
with simulated_file as f:
    for line in f:
        print('Stream Read:', line.strip())
```
**Expected Terminal Execution Output**:
```text
Stream Read: Line 1
Stream Read: Line 2
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_FILE_RESOURCE_LEAK_NO_WITH`
* **Question**: **What is the primary benefit of using `with open(...) as f:` over raw `f = open(...)`?**
  ✅ **Option A**: It guarantees that the file is automatically closed and freed, even if an exception occurs
  ❌ **Option B**: It runs the code twice as fast
  ❌ **Option C**: It automatically encrypts the file

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_FILE_RESOURCE_LEAK_NO_WITH`)
  1. 🛑 *What Went Wrong*: with context managers prevent file descriptor leaks by guaranteeing automatic cleanup.
  2. 💡 *Simpler Everyday Picture*: with open = automatic file closing.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Line-by-Line Stream Reading (Memory Safe) (`py-d23-b2-line-by-line-parsing`)

* **Primary Concept Budget**: `Stream Reading`
* **Supporting Terms**: for line in f, strip() Whitespace Clean
* **Prerequisites**: `py-d23-b1-with-open-syntax` (understood)

##### 💻 Runnable Interactive Python Sandbox (`stream_read.py`)
```python
import io

log_data = io.StringIO('[INFO] Start\n[ERROR] Fail\n[INFO] End')
error_count = 0
for line in log_data:
    if line.startswith('[ERROR]'):
        error_count += 1
print('Total Errors Found:', error_count)
```
**Expected Terminal Execution Output**:
```text
Total Errors Found: 1
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_FILE_READLINE_STRIP_NEWLINE`
* **Question**: **How many [ERROR] lines were detected in the stream above?**
* **Expected Exact Value**: `Total Errors Found: 1`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `3` (Misconception: `MC_PY_FILE_READLINE_STRIP_NEWLINE`)
  1. 🛑 *What Went Wrong*: Only 1 line started with '[ERROR]'.
  2. 💡 *Simpler Everyday Picture*: Count is 1.
  3. 🛠️ *Guided Fix Prompt*: **Type Total Errors Found: 1**


#### 🔹 Slide 3: CSV Text Parsing & Column Splitting (`py-d23-b3-csv-parsing`)

* **Primary Concept Budget**: `CSV String Splitting`
* **Supporting Terms**: split(','), Header Row
* **Prerequisites**: `py-d23-b2-line-by-line-parsing` (understood)

##### 💻 Runnable Interactive Python Sandbox (`csv_parse.py`)
```python
row = '101,Sarah,sarah@pinit.ai'
user_id, name, email = row.split(',')
print(f'User: {name} (ID #{user_id})')
```
**Expected Terminal Execution Output**:
```text
User: Sarah (ID #101)
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_FILE_READLINE_STRIP_NEWLINE`
* **Question**: **What is user_id in the unpacked CSV row above?**
* **Expected Exact Value**: `101`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Sarah` (Misconception: `MC_PY_FILE_READLINE_STRIP_NEWLINE`)
  1. 🛑 *What Went Wrong*: user_id is the first element '101'.
  2. 💡 *Simpler Everyday Picture*: First column is 101.
  3. 🛠️ *Guided Fix Prompt*: **Type 101**


### ⚡ Quest 2: Proctored Coding Exam — Log Stream Error Counter (Context Safe)

**Problem Statement**:
Write a Python function `count_errors_in_stream(lines: list) -> int` that counts how many lines start with '[ERROR]'.

**Socratic Mentor Hint**: *sum(1 for line in lines if line.strip().startswith('[ERROR]'))*

#### 💻 Exam Starter Code (`solution.py`)
```python
def count_errors_in_stream(lines: list) -> int:
    # Count lines starting with '[ERROR]'
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
logs = ['[INFO] Booting', '[ERROR] Disk Full', '[WARN] High RAM', '[ERROR] Timeout']
assert count_errors_in_stream(logs) == 2, 'Test 1 Failed'
assert count_errors_in_stream(['[OK] Normal']) == 0, 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — CSV Line Column Parser

**Problem Statement**:
Write a Python function `parse_csv_header(header_line: str) -> list` that splits a comma-separated line and returns stripped column names.

**Socratic Mentor Hint**: *[col.strip() for col in header_line.split(',')]*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def parse_csv_header(header_line: str) -> list:
    # Return list of stripped column headers
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert parse_csv_header('id, name , email ') == ['id', 'name', 'email'], 'Test 1 Failed'
print('All 1 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 24: JSON SERIALIZATION & DESERIALIZATION (JSON.DUMPS, JSON.LOADS)

> **Everyday Core Metaphor**: JSON is the universal passport of data: it converts live Python dictionary objects into a standardized text string (dumps) so they can travel across the internet, and unpacks them back into Python objects (loads) upon arrival.

### 🎯 Day Overview & Learning Objectives
- **Concept**: json.dumps() for serialization and json.loads() for deserialization
- **Concept**: Formatting with indent and sort_keys
- **Concept**: Handling JSONDecodeError on corrupted input payloads

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Serializing to JSON Strings: json.dumps() (`py-d24-b1-json-dumps`)

* **Primary Concept Budget**: `JSON Serialization`
* **Supporting Terms**: json.dumps(), dict -> JSON str
* **Prerequisites**: `py-d14-b1-dict-syntax` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
import json

data = {'name': 'Alex', 'score': 100}
json_str = json.dumps(data) # '{"name": "Alex", "score": 100}'
```
* **Line 4**: json.dumps converts Python dict into a text string.

##### 💻 Runnable Interactive Python Sandbox (`dumps_demo.py`)
```python
import json

user = {'id': 42, 'role': 'ADMIN'}
print('JSON String:', json.dumps(user))
```
**Expected Terminal Execution Output**:
```text
JSON String: {"id": 42, "role": "ADMIN"}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_JSON_LOADS_VS_DUMPS`
* **Question**: **What does json.dumps(obj) return in Python?**
  ✅ **Option A**: A formatted JSON text string
  ❌ **Option B**: A binary file on the hard drive
  ❌ **Option C**: A Python list

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_JSON_LOADS_VS_DUMPS`)
  1. 🛑 *What Went Wrong*: dumps returns a string (the 's' stands for string).
  2. 💡 *Simpler Everyday Picture*: json.dumps() creates a JSON text string.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Deserializing from JSON: json.loads() (`py-d24-b2-json-loads`)

* **Primary Concept Budget**: `JSON Deserialization`
* **Supporting Terms**: json.loads(), JSON str -> dict
* **Prerequisites**: `py-d24-b1-json-dumps` (understood)

##### 💻 Runnable Interactive Python Sandbox (`loads_demo.py`)
```python
import json

payload = '{"service": "AUTH", "port": 8000}'
parsed = json.loads(payload)
print('Service Port:', parsed['port'])
```
**Expected Terminal Execution Output**:
```text
Service Port: 8000
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_JSON_LOADS_VS_DUMPS`
* **Question**: **What is parsed['port'] in the code above?**
* **Expected Exact Value**: `8000`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `'port'` (Misconception: `MC_PY_JSON_LOADS_VS_DUMPS`)
  1. 🛑 *What Went Wrong*: parsed['port'] accesses the value 8000.
  2. 💡 *Simpler Everyday Picture*: Returns integer 8000.
  3. 🛠️ *Guided Fix Prompt*: **Type 8000**


#### 🔹 Slide 3: Safe JSON Parsing with try-except (`py-d24-b3-json-error-handling`)

* **Primary Concept Budget**: `JSONDecodeError Handling`
* **Supporting Terms**: Malformed Payloads, Graceful Fallback
* **Prerequisites**: `py-d24-b2-json-loads` (understood)

##### 💻 Runnable Interactive Python Sandbox (`safe_json.py`)
```python
import json

bad_json = '{bad json string}'
try:
    data = json.loads(bad_json)
except Exception:
    data = {'error': 'INVALID_JSON'}
print('Status:', data['error'])
```
**Expected Terminal Execution Output**:
```text
Status: INVALID_JSON
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_JSON_LOADS_VS_DUMPS`
* **Question**: **What is data['error'] when bad JSON is safely caught?**
* **Expected Exact Value**: `INVALID_JSON`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `Crash` (Misconception: `MC_PY_JSON_LOADS_VS_DUMPS`)
  1. 🛑 *What Went Wrong*: try-except caught the decode error and assigned the fallback dict.
  2. 💡 *Simpler Everyday Picture*: Returns 'INVALID_JSON'.
  3. 🛠️ *Guided Fix Prompt*: **Type INVALID_JSON**


### ⚡ Quest 2: Proctored Coding Exam — Safe JSON Payload Decoder with Validation

**Problem Statement**:
Write a Python function `decode_user_payload(json_str: str) -> dict` returning parsed dict if valid and contains 'user_id', else returning `{'error': 'INVALID_PAYLOAD'}`.

**Socratic Mentor Hint**: *try: data = json.loads(json_str); return data if 'user_id' in data else {'error': 'INVALID_PAYLOAD'} except Exception: return {'error': 'INVALID_PAYLOAD'}*

#### 💻 Exam Starter Code (`solution.py`)
```python
import json

def decode_user_payload(json_str: str) -> dict:
    # Parse JSON safely
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
import json
assert decode_user_payload('{"user_id": 101, "name": "Alex"}') == {'user_id': 101, 'name': 'Alex'}, 'Test 1 Failed'
assert decode_user_payload('{"name": "NoId"}') == {'error': 'INVALID_PAYLOAD'}, 'Test 2 Failed'
assert decode_user_payload('bad json') == {'error': 'INVALID_PAYLOAD'}, 'Test 3 Failed'
print('All 3 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Configuration Serializer with Sorting

**Problem Statement**:
Write a Python function `serialize_config(config_dict: dict) -> str` that serializes config_dict to a sorted JSON string without indentation.

**Socratic Mentor Hint**: *return json.dumps(config_dict, sort_keys=True)*

#### 💻 Assignment Starter Code (`solution.py`)
```python
import json

def serialize_config(config_dict: dict) -> str:
    # Return sorted JSON string
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
import json
assert serialize_config({'b': 2, 'a': 1}) == '{"a": 1, "b": 2}', 'Test 1 Failed'
print('All 1 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 25: DECORATORS, HIGHER-ORDER FUNCTIONS & LAMBDA EXPRESSIONS

> **Everyday Core Metaphor**: A Decorator is gift wrapping around a present: the original present (function) stays inside, but the wrapping adds ribbons, labels, or security locks around it without modifying the present itself.

### 🎯 Day Overview & Learning Objectives
- **Concept**: First-class functions and closures
- **Concept**: Writing function decorators with @functools.wraps
- **Concept**: Anonymous lambda functions and map()/filter()

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Functions as First-Class Citizens (`py-d25-b1-first-class-functions`)

* **Primary Concept Budget**: `First-Class Functions`
* **Supporting Terms**: Passing Functions as Arguments, Higher-Order Functions
* **Prerequisites**: `py-d9-b2-return-vs-print` (understood)

##### 💡 Real-World Physical Analogy: *Hiring a Contractor*
You pass a job description (function) to a manager who calls it at the right time.

##### 💻 Runnable Interactive Python Sandbox (`higher_order.py`)
```python
def apply_op(val, func):
    return func(val)

def double(x):
    return x * 2

print('Applied double to 5:', apply_op(5, double))
```
**Expected Terminal Execution Output**:
```text
Applied double to 5: 10
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_FUNCTION_DEF_VS_CALL`
* **Question**: **What is apply_op(5, double) when double multiplies by 2?**
* **Expected Exact Value**: `Applied double to 5: 10`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `5` (Misconception: `MC_PY_FUNCTION_DEF_VS_CALL`)
  1. 🛑 *What Went Wrong*: double(5) calculates 5 * 2 = 10.
  2. 💡 *Simpler Everyday Picture*: 5 * 2 = 10.
  3. 🛠️ *Guided Fix Prompt*: **Type Applied double to 5: 10**


#### 🔹 Slide 2: The @decorator Wrapper Syntax (`py-d25-b2-decorator-syntax`)

* **Primary Concept Budget**: `Decorator Wrapper (@)`
* **Supporting Terms**: Wrapper Function, Meta-Programming
* **Prerequisites**: `py-d25-b1-first-class-functions` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print('Before call')
        return func(*args, **kwargs)
    return wrapper
```
* **Line 1**: my_decorator receives the target function.
* **Line 5**: wrapper wraps execution and returns the result.

##### 💻 Runnable Interactive Python Sandbox (`decorator_demo.py`)
```python
def banner_dec(func):
    def wrapper(name):
        return f'*** {func(name)} ***'
    return wrapper

@banner_dec
def greet(name):
    return f'Hello {name}'

print(greet('Alex'))
```
**Expected Terminal Execution Output**:
```text
*** Hello Alex ***
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_DECORATOR_WRAPPER_RETURN`
* **Question**: **What does putting `@my_decorator` above a function definition do in Python?**
  ✅ **Option A**: It wraps the function with my_decorator to add reusable behavior
  ❌ **Option B**: It converts the function into C code
  ❌ **Option C**: It runs the function in the background

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_DECORATOR_WRAPPER_RETURN`)
  1. 🛑 *What Went Wrong*: Decorators wrap functions with pre/post execution hooks.
  2. 💡 *Simpler Everyday Picture*: Decorators wrap functions cleanly.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Anonymous Lambda Functions: lambda x: expr (`py-d25-b3-lambda-functions`)

* **Primary Concept Budget**: `Lambda Expressions`
* **Supporting Terms**: Anonymous Function, One-Line Expression
* **Prerequisites**: `py-d25-b2-decorator-syntax` (understood)

##### 💻 Runnable Interactive Python Sandbox (`lambdas.py`)
```python
double = lambda x: x * 2
print('Lambda double 7:', double(7))

items = [('B', 30), ('A', 10)]
items.sort(key=lambda item: item[1])
print('Sorted by price:', items)
```
**Expected Terminal Execution Output**:
```text
Lambda double 7: 14
Sorted by price: [('A', 10), ('B', 30)]
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_LAMBDA_ONE_EXPRESSION`
* **Question**: **What is (lambda a, b: a + b)(3, 4)?**
* **Expected Exact Value**: `7`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `34` (Misconception: `MC_PY_LAMBDA_ONE_EXPRESSION`)
  1. 🛑 *What Went Wrong*: Lambda adds 3 + 4 = 7 as integers.
  2. 💡 *Simpler Everyday Picture*: 3 + 4 = 7.
  3. 🛠️ *Guided Fix Prompt*: **Type 7**


### ⚡ Quest 2: Proctored Coding Exam — Execution Logger Decorator

**Problem Statement**:
Implement a decorator `@log_execution` that modifies a function to return a dict `{'result': <output>, 'function': <func_name>}`.

**Socratic Mentor Hint**: *Call func(*args, **kwargs) inside wrapper and return dict.*

#### 💻 Exam Starter Code (`solution.py`)
```python
def log_execution(func):
    def wrapper(*args, **kwargs):
        res = func(*args, **kwargs)
        return {'result': res, 'function': func.__name__}
    return wrapper

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
@log_execution
def add(a, b):
    return a + b

assert add(3, 4) == {'result': 7, 'function': 'add'}, 'Test 1 Failed'
print('All 1 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Lambda Sort by Nested Value

**Problem Statement**:
Write a Python function `sort_products_by_price(products: list) -> list` sorting a list of dicts `[{'name': 'a', 'price': 10}]` by price ascending using a lambda.

**Socratic Mentor Hint**: *return sorted(products, key=lambda p: p['price'])*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def sort_products_by_price(products: list) -> list:
    # Return sorted copy of products by price
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
prods = [{'name': 'B', 'price': 30}, {'name': 'A', 'price': 10}]
assert sort_products_by_price(prods) == [{'name': 'A', 'price': 10}, {'name': 'B', 'price': 30}], 'Test 1 Failed'
print('All 1 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 26: ⭐ MILESTONE 5: WORD FREQUENCY & INVERTED INDEX SEARCH ENGINE

> **Everyday Core Metaphor**: Milestone 5 — Full-Text Search Engine: An inverted search index maps every unique word in an entire library to the exact document IDs containing it, powering sub-millisecond search across gigabytes of text.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Text tokenization, lowercasing, and punctuation stripping
- **Concept**: Building an inverted document index (word -> set of doc_ids)
- **Concept**: Milestone Project: Full-Text Mini Search Engine

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Text Sanitization & Tokenization (`py-d26-b1-tokenization`)

* **Primary Concept Budget**: `Text Tokenization`
* **Supporting Terms**: lower(), strip(), split()
* **Prerequisites**: `py-d14-b1-dict-syntax` (understood)

##### 💻 Runnable Interactive Python Sandbox (`tokenize.py`)
```python
raw_text = 'Python, Fast API, and Python Data!'
cleaned = [w.strip(',!') for w in raw_text.lower().split()]
print('Token Stream:', cleaned)
```
**Expected Terminal Execution Output**:
```text
Token Stream: ['python', 'fast', 'api', 'and', 'python', 'data']
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_STR_INT_CONCAT_TYPE_ERROR`
* **Question**: **How many times does 'python' appear in the Token Stream above?**
* **Expected Exact Value**: `2`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_STR_INT_CONCAT_TYPE_ERROR`)
  1. 🛑 *What Went Wrong*: Both 'Python,' and 'Python' were sanitized to lowercase 'python' (count = 2).
  2. 💡 *Simpler Everyday Picture*: 'python' appears at index 0 and index 4 -> count is 2.
  3. 🛠️ *Guided Fix Prompt*: **Type 2**


#### 🔹 Slide 2: Building the Inverted Document Index (`py-d26-b2-inverted-index`)

* **Primary Concept Budget**: `Inverted Index Architecture`
* **Supporting Terms**: word -> set(doc_ids), Fast Text Search
* **Prerequisites**: `py-d26-b1-tokenization` (understood)

##### 💻 Runnable Interactive Python Sandbox (`inverted_index.py`)
```python
docs = {1: 'Learn Python', 2: 'Python Backend'}
index = {}
for doc_id, text in docs.items():
    for word in text.lower().split():
        index.setdefault(word, set()).add(doc_id)
print('Docs containing python:', sorted(list(index['python'])))
```
**Expected Terminal Execution Output**:
```text
Docs containing python: [1, 2]
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_DICT_KEY_ERROR`
* **Question**: **Which document IDs contain 'python' in the index above?**
* **Expected Exact Value**: `[1, 2]`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `[1]` (Misconception: `MC_PY_DICT_KEY_ERROR`)
  1. 🛑 *What Went Wrong*: Both doc 1 and doc 2 contain 'python'.
  2. 💡 *Simpler Everyday Picture*: Both documents match -> [1, 2].
  3. 🛠️ *Guided Fix Prompt*: **Type [1, 2]**


#### 🔹 Slide 3: Multi-Word AND Query Search Matching (`py-d26-b3-query-engine`)

* **Primary Concept Budget**: `Search Query Resolution`
* **Supporting Terms**: Set Intersection Matching, Fast Search Ranking
* **Prerequisites**: `py-d26-b2-inverted-index` (understood)

##### 💻 Runnable Interactive Python Sandbox (`search_engine.py`)
```python
index = {'python': {1, 2, 3}, 'backend': {2, 3}, 'fast': {3}}
query = ['python', 'backend']
matches = index[query[0]] & index[query[1]]
print('Search Results (docs with BOTH terms):', sorted(list(matches)))
```
**Expected Terminal Execution Output**:
```text
Search Results (docs with BOTH terms): [2, 3]
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_SET_UNIQUENESS`
* **Question**: **What docs match BOTH 'python' {1, 2, 3} and 'backend' {2, 3}?**
* **Expected Exact Value**: `[2, 3]`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `[1, 2, 3]` (Misconception: `MC_PY_SET_UNIQUENESS`)
  1. 🛑 *What Went Wrong*: Doc 1 lacks 'backend', so only {2, 3} match both terms.
  2. 💡 *Simpler Everyday Picture*: Intersection of {1, 2, 3} and {2, 3} is [2, 3].
  3. 🛠️ *Guided Fix Prompt*: **Type [2, 3]**


### ⚡ Quest 2: Proctored Coding Exam — Inverted Document Index Builder

**Problem Statement**:
Write a Python function `build_inverted_index(docs: dict) -> dict` where docs is `{doc_id: 'text string'}`. Return dict mapping each word (lowercase, stripped) to sorted list of doc_ids where it appears.

**Socratic Mentor Hint**: *index = {}; for doc_id, text in docs.items(): for w in set(text.lower().split()): index.setdefault(w, []).append(doc_id); return {k: sorted(v) for k, v in index.items()}*

#### 💻 Exam Starter Code (`solution.py`)
```python
def build_inverted_index(docs: dict) -> dict:
    # Build inverted index
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
docs = {1: 'Python is great', 2: 'Great systems use Python'}
idx = build_inverted_index(docs)
assert idx['python'] == [1, 2], 'Test 1 Failed'
assert idx['systems'] == [2], 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Top-K Word Frequency Ranker

**Problem Statement**:
Write a Python function `top_k_words(text: str, k: int) -> list` returning the top `k` most frequent lowercase words as a list of `(word, count)` tuples sorted by count descending.

**Socratic Mentor Hint**: *from collections  return Counter(text.lower().split()).most_common(k)*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def top_k_words(text: str, k: int) -> list:
    # Return top k word tuples
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
res = top_k_words('apple banana apple apple banana cherry', 2)
assert res == [('apple', 3), ('banana', 2)], 'Test 1 Failed'
print('All 1 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 27: ASYNCHRONOUS PYTHON (ASYNC, AWAIT & ASYNCIO EVENT LOOPS)

> **Everyday Core Metaphor**: Asynchronous I/O is like a restaurant chef: while a soup is simmering on the stove for 10 minutes (I/O wait), the chef doesn't stand frozen staring at the pot; they immediately chop vegetables for the salad.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Synchronous blocking vs Asynchronous non-blocking event loops
- **Concept**: Defining coroutines with async def and awaiting with await
- **Concept**: Running concurrent tasks with asyncio.gather()

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Async Coroutines: async def & await (`py-d27-b1-async-concept`)

* **Primary Concept Budget**: `Coroutines (async / await)`
* **Supporting Terms**: async def, await Non-Blocking I/O
* **Prerequisites**: `py-d25-b1-first-class-functions` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
import asyncio

async def fetch_data():
    await asyncio.sleep(0.01) # Non-blocking pause
    return 'Data Loaded'
```
* **Line 3**: async def declares a coroutine.
* **Line 4**: await pauses execution without blocking other tasks.

##### 💻 Runnable Interactive Python Sandbox (`async_demo.py`)
```python
import asyncio

async def main():
    return 'Async Ready'

print('Result:', asyncio.run(main()))
```
**Expected Terminal Execution Output**:
```text
Result: Async Ready
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE`
* **Question**: **What keyword is used to declare an asynchronous coroutine in Python?**
  ✅ **Option A**: async def
  ❌ **Option B**: thread def
  ❌ **Option C**: defer def

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE`)
  1. 🛑 *What Went Wrong*: Python uses 'async def' for coroutines.
  2. 💡 *Simpler Everyday Picture*: async def declares asynchronous functions.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A: async def**


#### 🔹 Slide 2: Concurrent Task Execution with asyncio.gather() (`py-d27-b2-asyncio-gather`)

* **Primary Concept Budget**: `Concurrent Gathering`
* **Supporting Terms**: asyncio.gather(), Parallel I/O
* **Prerequisites**: `py-d27-b1-async-concept` (understood)

##### 💻 Runnable Interactive Python Sandbox (`gather_demo.py`)
```python
import asyncio

async def fetch_user(uid):
    return f'User_{uid}'

async def main():
    users = await asyncio.gather(fetch_user(1), fetch_user(2))
    print('Gathered Users:', users)

asyncio.run(main())
```
**Expected Terminal Execution Output**:
```text
Gathered Users: ['User_1', 'User_2']
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE`
* **Question**: **What list is gathered by asyncio.gather(fetch_user(1), fetch_user(2))?**
* **Expected Exact Value**: `Gathered Users: ['User_1', 'User_2']`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `None` (Misconception: `MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE`)
  1. 🛑 *What Went Wrong*: gather collects all coroutine return values into a list.
  2. 💡 *Simpler Everyday Picture*: Gathers results into ['User_1', 'User_2'].
  3. 🛠️ *Guided Fix Prompt*: **Type Gathered Users: ['User_1', 'User_2']**


#### 🔹 Slide 3: The Un-awaited Coroutine Warning Trap (`py-d27-b3-unresolved-coroutine-trap`)

* **Primary Concept Budget**: `Awaiting Coroutines`
* **Supporting Terms**: RuntimeWarning, Coroutine Object
* **Prerequisites**: `py-d27-b2-asyncio-gather` (understood)

##### ⚠️ Visual Code Diff: Common Pitfall vs Production Fix
```python
# ❌ BROKEN / BUGGY PATTERN
async def get_data(): return 42
x = get_data() # ❌ x is <coroutine object>, NOT the integer 42!

# ✅ CORRECT / PRODUCTION FIX
async def get_data(): return 42
x = await get_data() # ✅ x is the integer 42
```
* **Error Reason**: Calling an async def function without await returns an un-executed coroutine object.
* **Fix Explanation**: Always place await before calling async functions.

##### 💻 Runnable Interactive Python Sandbox (`safe_await.py`)
```python
import asyncio

async def compute(): return 100
async def main():
    val = await compute()
    print('Awaited Value:', val)

asyncio.run(main())
```
**Expected Terminal Execution Output**:
```text
Awaited Value: 100
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE`
* **Question**: **What happens if you call `get_data()` (an async def function) without the `await` keyword?**
  ✅ **Option A**: It returns a coroutine object instead of executing and returning the actual data value
  ❌ **Option B**: It automatically runs synchronously
  ❌ **Option C**: It deletes the function

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE`)
  1. 🛑 *What Went Wrong*: Async functions must be awaited to yield their return values.
  2. 💡 *Simpler Everyday Picture*: Without await, you only get the coroutine wrapper.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


### ⚡ Quest 2: Proctored Coding Exam — Async Coroutine Aggregator

**Problem Statement**:
Write an async Python function `fetch_all_metrics(coros: list) -> list` that executes a list of coroutines concurrently using `asyncio.gather`.

**Socratic Mentor Hint**: *return await asyncio.gather(*coros)*

#### 💻 Exam Starter Code (`solution.py`)
```python
import asyncio

async def fetch_all_metrics(coros: list) -> list:
    # Await and gather all coroutines
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
import asyncio

async def sample(x):
    return x * 2

async def runner():
    res = await fetch_all_metrics([sample(1), sample(2), sample(3)])
    assert res == [2, 4, 6], 'Test 1 Failed'

asyncio.run(runner())
print('All 1 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Async Rate-Limited Task Runner

**Problem Statement**:
Write an async Python function `run_with_delay(val: int) -> int` that awaits asyncio.sleep(0.01) and returns val * 10.

**Socratic Mentor Hint**: *await asyncio.sleep(0.01); return val * 10*

#### 💻 Assignment Starter Code (`solution.py`)
```python
import asyncio

async def run_with_delay(val: int) -> int:
    # Await sleep then return result
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
import asyncio

async def runner():
    res = await run_with_delay(5)
    assert res == 50, 'Test 1 Failed'

asyncio.run(runner())
print('All 1 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 28: MODERN TYPE HINTS, STATIC TYPING & PYDANTIC DATA MODELS

> **Everyday Core Metaphor**: Type hints are clear luggage tags on airport bags: even though bags can hold anything, the tag 'Fragile Electronics' tells everyone exactly what kind of payload is expected inside.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Type annotations: int, str, list[str], dict[str, Any]
- **Concept**: Optional[T] and Union[A, B] from typing
- **Concept**: Data validation principles and type safety in backend services

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Type Annotations: def func(a: int) -> str: (`py-d28-b1-type-hints`)

* **Primary Concept Budget**: `PEP 484 Type Hints`
* **Supporting Terms**: Parameter Annotations : int, Return Type -> str
* **Prerequisites**: `py-d9-b1-def-anatomy` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
def format_price(amount: float, symbol: str = '$') -> str:
    return f'{symbol}{amount:.2f}'
```
* **Line 1**: amount: float and -> str document expected types for IDEs and linters.

##### 💻 Runnable Interactive Python Sandbox (`type_hints.py`)
```python
def add_tax(price: float, rate: float = 0.05) -> float:
    return round(price * (1 + rate), 2)

print('Total with tax:', add_tax(100.0))
```
**Expected Terminal Execution Output**:
```text
Total with tax: 105.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_TYPE_HINT_RUNTIME_IGNORE`
* **Question**: **Does Python reject code at runtime if you pass a string to a function annotated with `amount: int`?**
  ✅ **Option A**: No, Python type hints are advisory documentation and not strictly enforced at runtime by standard Python
  ❌ **Option B**: Yes, Python halts with a StaticTypeError
  ❌ **Option C**: Only on Tuesdays

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_TYPE_HINT_RUNTIME_IGNORE`)
  1. 🛑 *What Went Wrong*: Standard Python does not enforce type hints at runtime (tools like mypy or Pydantic do).
  2. 💡 *Simpler Everyday Picture*: Python type hints are advisory for developers and IDEs.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Advanced Types: Optional[T], Union[A, B], list[str] (`py-d28-b2-typing-module`)

* **Primary Concept Budget**: `typing Module Generics`
* **Supporting Terms**: Optional[str] (can be None), dict[str, Any]
* **Prerequisites**: `py-d28-b1-type-hints` (understood)

##### 💻 Runnable Interactive Python Sandbox (`typing_demo.py`)
```python
def find_user(uid: int) -> dict | None:
    if uid == 1:
        return {'name': 'Alex'}
    return None

print('User 1:', find_user(1))
print('User 99:', find_user(99))
```
**Expected Terminal Execution Output**:
```text
User 1: {'name': 'Alex'}
User 99: None
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_TYPE_HINT_RUNTIME_IGNORE`
* **Question**: **What does the type annotation `str | None` (or `Optional[str]`) mean?**
  ✅ **Option A**: The value can either be a valid string or None
  ❌ **Option B**: The string cannot contain spaces
  ❌ **Option C**: The string is encrypted

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_TYPE_HINT_RUNTIME_IGNORE`)
  1. 🛑 *What Went Wrong*: Optional[T] (T | None) signals that None is an acceptable value.
  2. 💡 *Simpler Everyday Picture*: str | None means string OR None.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 3: Runtime Schema Validation Principles (`py-d28-b3-schema-validation`)

* **Primary Concept Budget**: `Schema Validation`
* **Supporting Terms**: Pydantic Model Principles, Field Constraints
* **Prerequisites**: `py-d28-b2-typing-module` (understood)

##### 💻 Runnable Interactive Python Sandbox (`validator.py`)
```python
def validate_product(p: dict) -> bool:
    return isinstance(p.get('name'), str) and isinstance(p.get('price'), (int, float)) and p['price'] > 0

print('Valid Product:', validate_product({'name': 'Book', 'price': 12.99}))
print('Invalid Product:', validate_product({'name': 'Book', 'price': -5}))
```
**Expected Terminal Execution Output**:
```text
Valid Product: True
Invalid Product: False
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_TYPE_HINT_RUNTIME_IGNORE`
* **Question**: **What does validate_product return for price=-5?**
* **Expected Exact Value**: `False`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `True` (Misconception: `MC_PY_TYPE_HINT_RUNTIME_IGNORE`)
  1. 🛑 *What Went Wrong*: Price -5 violates the p['price'] > 0 constraint.
  2. 💡 *Simpler Everyday Picture*: Negative price fails validation -> False.
  3. 🛠️ *Guided Fix Prompt*: **Type False**


### ⚡ Quest 2: Proctored Coding Exam — Typed User Record Validator

**Problem Statement**:
Write a Python function `validate_user_record(record: dict) -> bool` returning True if record contains 'id' (int), 'email' (str containing '@'), and 'is_active' (bool), else False.

**Socratic Mentor Hint**: *Check isinstance for all 3 fields and '@' in record['email'].*

#### 💻 Exam Starter Code (`solution.py`)
```python
def validate_user_record(record: dict) -> bool:
    # Validate dictionary structure and types
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert validate_user_record({'id': 1, 'email': 'a@b.com', 'is_active': True}) == True, 'Test 1 Failed'
assert validate_user_record({'id': '1', 'email': 'a@b.com', 'is_active': True}) == False, 'Test 2 Failed'
assert validate_user_record({'id': 2, 'email': 'bad', 'is_active': True}) == False, 'Test 3 Failed'
print('All 3 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Typed API Query Parameter Formatter

**Problem Statement**:
Write a Python function `build_query_string(params: dict) -> str` returning a URL query string like '?key1=val1&key2=val2' with sorted keys, or '' if empty.

**Socratic Mentor Hint**: *if not params: return ''; return '?' + '&'.join(f'{k}={params[k]}' for k in sorted(params.keys()))*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def build_query_string(params: dict) -> str:
    # Return formatted URL query string
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert build_query_string({'limit': 10, 'offset': 0}) == '?limit=10&offset=0', 'Test 1 Failed'
assert build_query_string({}) == '', 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 29: WEB API ARCHITECTURE WITH FASTAPI & HTTP ROUTE CONTROLLERS

> **Everyday Core Metaphor**: A Web API is like a restaurant waiter: the client (customer) makes an HTTP GET/POST request (orders from the menu), the route controller (waiter) passes it to the kitchen (database/services), and returns a JSON response (food on a plate) with an HTTP status code.

### 🎯 Day Overview & Learning Objectives
- **Concept**: Client-server HTTP request/response cycle
- **Concept**: FastAPI app instance and route decorators (@app.get, @app.post)
- **Concept**: Handling query parameters, path parameters, and JSON response bodies

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: HTTP Methods (GET, POST) & Status Codes (200, 404) (`py-d29-b1-http-methods`)

* **Primary Concept Budget**: `HTTP Request/Response Cycle`
* **Supporting Terms**: GET (Retrieve), POST (Create), Status 200 OK vs 404 Not Found
* **Prerequisites**: `py-d24-b1-json-dumps` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
200: OK (Success)
201: Created (Resource created)
400: Bad Request (Invalid client data)
404: Not Found (Resource missing)
500: Internal Server Error (Backend crash)
```
* **Line 1**: 200 indicates standard successful HTTP response.
* **Line 4**: 404 indicates missing endpoint or resource.

##### 💻 Runnable Interactive Python Sandbox (`http_demo.py`)
```python
def router(method, path):
    if method == 'GET' and path == '/health':
        return {'status': 200, 'body': {'status': 'healthy'}}
    return {'status': 404, 'body': {'error': 'Not Found'}}

print('/health response:', router('GET', '/health'))
```
**Expected Terminal Execution Output**:
```text
/health response: {'status': 200, 'body': {'status': 'healthy'}}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_FASTAPI_STATUS_CODE`
* **Question**: **Which HTTP status code signifies a successful request?**
  ✅ **Option A**: 200 OK
  ❌ **Option B**: 404 Not Found
  ❌ **Option C**: 500 Server Error

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_FASTAPI_STATUS_CODE`)
  1. 🛑 *What Went Wrong*: 404 means Not Found; 200 means OK/Success.
  2. 💡 *Simpler Everyday Picture*: 200 = Success.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A: 200 OK**


#### 🔹 Slide 2: FastAPI Route Controllers & Decorators (@app.get) (`py-d29-b2-fastapi-routes`)

* **Primary Concept Budget**: `FastAPI Routing`
* **Supporting Terms**: @app.get('/path'), JSON Response Body
* **Prerequisites**: `py-d29-b1-http-methods` (understood)

##### ⚙️ Python Syntax Anatomy & Breakdown
```python
from fastapi import FastAPI

app = FastAPI()

@app.get('/users/{user_id}')
def get_user(user_id: int):
    return {'user_id': user_id, 'status': 'ACTIVE'}
```
* **Line 5**: @app.get maps HTTP GET requests to the get_user function.

##### 💻 Runnable Interactive Python Sandbox (`route_demo.py`)
```python
def handle_get_user(user_id: int) -> dict:
    return {'id': user_id, 'name': f'User_{user_id}', 'active': True}

print('API Output:', handle_get_user(42))
```
**Expected Terminal Execution Output**:
```text
API Output: {'id': 42, 'name': 'User_42', 'active': True}
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_FASTAPI_STATUS_CODE`
* **Question**: **What dictionary is returned by handle_get_user(42)?**
* **Expected Exact Value**: `API Output: {'id': 42, 'name': 'User_42', 'active': True}`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `None` (Misconception: `MC_PY_FASTAPI_STATUS_CODE`)
  1. 🛑 *What Went Wrong*: Returns JSON dict with id, name, and active fields.
  2. 💡 *Simpler Everyday Picture*: Formats user dictionary for ID 42.
  3. 🛠️ *Guided Fix Prompt*: **Type API Output: {'id': 42, 'name': 'User_42', 'active': True}**


#### 🔹 Slide 3: Path Parameters & Query Parameters (`py-d29-b3-path-params`)

* **Primary Concept Budget**: `API Parameters`
* **Supporting Terms**: Path Parameter /users/{id}, Query Parameter ?limit=10
* **Prerequisites**: `py-d29-b2-fastapi-routes` (understood)

##### 💻 Runnable Interactive Python Sandbox (`params_demo.py`)
```python
def get_items(category: str, limit: int = 10):
    return f'Fetching up to {limit} items in category: {category}'

print(get_items('books', 5))
```
**Expected Terminal Execution Output**:
```text
Fetching up to 5 items in category: books
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_FASTAPI_STATUS_CODE`
* **Question**: **What is printed by get_items('books', 5)?**
* **Expected Exact Value**: `Fetching up to 5 items in category: books`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `None` (Misconception: `MC_PY_FASTAPI_STATUS_CODE`)
  1. 🛑 *What Went Wrong*: Prints formatted string with limit 5 and category books.
  2. 💡 *Simpler Everyday Picture*: Prints 'Fetching up to 5 items in category: books'.
  3. 🛠️ *Guided Fix Prompt*: **Type Fetching up to 5 items in category: books**


### ⚡ Quest 2: Proctored Coding Exam — HTTP Status Code & Route Response Builder

**Problem Statement**:
Write a Python function `build_api_response(status_code: int, data: dict = None, error_msg: str = None) -> dict` returning `{'status': status_code, 'data': data, 'error': error_msg}`.

**Socratic Mentor Hint**: *Return {'status': status_code, 'data': data, 'error': error_msg}*

#### 💻 Exam Starter Code (`solution.py`)
```python
def build_api_response(status_code: int, data: dict = None, error_msg: str = None) -> dict:
    # Return structured API response dictionary
    pass

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
assert build_api_response(200, {'id': 1}) == {'status': 200, 'data': {'id': 1}, 'error': None}, 'Test 1 Failed'
assert build_api_response(404, error_msg='Not Found') == {'status': 404, 'data': None, 'error': 'Not Found'}, 'Test 2 Failed'
print('All 2 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — API Route Endpoint Path Parser

**Problem Statement**:
Write a Python function `extract_path_params(route_template: str, actual_path: str) -> dict` extracting `{param}` from matching paths (e.g. '/users/{id}' and '/users/42' -> `{'id': '42'}`).

**Socratic Mentor Hint**: *Zip template parts and actual parts; if part starts with '{' and ends with '}': key = part[1:-1]; params[key] = actual_part*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def extract_path_params(route_template: str, actual_path: str) -> dict:
    # Extract path parameters
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
assert extract_path_params('/users/{id}', '/users/42') == {'id': '42'}, 'Test 1 Failed'
assert extract_path_params('/items/{category}/{id}', '/items/books/101') == {'category': 'books', 'id': '101'}, 'Test 2 Failed'
print('All 2 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

# 📅 DAY 30: 🏆 FINAL CAPSTONE: ENTERPRISE HIGH-PERFORMANCE TRANSACTION LEDGER AUDITOR & BACKEND API

> **Everyday Core Metaphor**: Final Capstone Synthesis: The complete financial operating system bringing together Object-Oriented Entities, Defensive Validation, High-Speed Dictionary Lookups, Batch Reconciliation, and Web API Reporting.

### 🎯 Day Overview & Learning Objectives
- **Concept**: End-to-end domain entity architecture
- **Concept**: Transaction reconciliation and audit reporting
- **Concept**: Final Capstone Certification Project

---

### 🧩 Quest 1: Socratic Adaptive Micro-Learning Blocks (Handcrafted)

#### 🔹 Slide 1: Capstone System Architecture & Domain Entities (`py-d30-b1-architecture`)

* **Primary Concept Budget**: `Domain-Driven Design`
* **Supporting Terms**: Transaction Entity, Auditor Engine, Reconciliation Pipeline
* **Prerequisites**: `py-d29-b2-fastapi-routes` (understood)

##### 🔄 Sequential Execution Flowchart
* [START] **1. Transaction Ingestion (Validation)**
* [PROCESS] **2. Reconcile Balance (+CREDIT, -DEBIT)**
* [DECISION] **3. Category Aggregation & Anomaly Check**
* [END] **4. Generate Audit Report API Payload**

##### 💻 Runnable Interactive Python Sandbox (`architecture.py`)
```python
class Transaction:
    def __init__(self, tx_type, amount, category):
        if amount <= 0:
            raise ValueError('Amount must be > 0')
        self.tx_type = tx_type
        self.amount = amount
        self.category = category

tx = Transaction('CREDIT', 250.0, 'SALARY')
print(f'Valid Transaction: {tx.tx_type} ${tx.amount} ({tx.category})')
```
**Expected Terminal Execution Output**:
```text
Valid Transaction: CREDIT $250.0 (SALARY)
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `choose_answer`
* **Targeted Misconception ID**: `MC_PY_CAPSTONE_TRANSACTION_RECONCILER`
* **Question**: **Why should the `Transaction` entity validate `amount > 0` directly inside `__init__`?**
  ✅ **Option A**: To guarantee that corrupted/negative transaction objects can never exist in memory (Domain Invariant)
  ❌ **Option B**: To make the transaction run faster
  ❌ **Option C**: Because Python does not allow negative numbers

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1` (Misconception: `MC_PY_CAPSTONE_TRANSACTION_RECONCILER`)
  1. 🛑 *What Went Wrong*: Validating inside the constructor prevents invalid state from ever entering the system.
  2. 💡 *Simpler Everyday Picture*: Enforces valid state at object creation.
  3. 🛠️ *Guided Fix Prompt*: **Select Option A.**


#### 🔹 Slide 2: Balance Reconciliation & Total Credits/Debits (`py-d30-b2-auditor-reconciliation`)

* **Primary Concept Budget**: `Ledger Reconciliation`
* **Supporting Terms**: Credits (+), Debits (-), Final Net Balance
* **Prerequisites**: `py-d30-b1-architecture` (understood)

##### 💻 Runnable Interactive Python Sandbox (`auditor_core.py`)
```python
class Ledger:
    def __init__(self, init_bal=0.0):
        self.init_bal = init_bal
        self.txs = []
    def add(self, kind, amt):
        self.txs.append((kind, amt))
    def balance(self):
        bal = self.init_bal
        for kind, amt in self.txs:
            bal += amt if kind == 'CREDIT' else -amt
        return bal

ledger = Ledger(100)
ledger.add('CREDIT', 50)
ledger.add('DEBIT', 20)
print('Reconciled Balance: $', ledger.balance())
```
**Expected Terminal Execution Output**:
```text
Reconciled Balance: $ 130
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_CAPSTONE_TRANSACTION_RECONCILER`
* **Question**: **Starting at 100, adding CREDIT 50 and DEBIT 20 gives what balance (100 + 50 - 20)?**
* **Expected Exact Value**: `Reconciled Balance: $ 130`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `170` (Misconception: `MC_PY_CAPSTONE_TRANSACTION_RECONCILER`)
  1. 🛑 *What Went Wrong*: DEBIT subtracts from the balance: 100 + 50 - 20 = 130.
  2. 💡 *Simpler Everyday Picture*: 100 + 50 - 20 = 130.
  3. 🛠️ *Guided Fix Prompt*: **Type Reconciled Balance: $ 130**


#### 🔹 Slide 3: Structured Audit Report & Telemetry Generation (`py-d30-b3-audit-report-generator`)

* **Primary Concept Budget**: `Audit Report Generation`
* **Supporting Terms**: Aggregation Telemetry, JSON-Ready Summary
* **Prerequisites**: `py-d30-b2-auditor-reconciliation` (understood)

##### 💻 Runnable Interactive Python Sandbox (`report_gen.py`)
```python
def generate_report(initial_bal, credits, debits):
    return {
        'initial_balance': initial_bal,
        'total_credits': credits,
        'total_debits': debits,
        'final_balance': initial_bal + credits - debits
    }

rep = generate_report(1000.0, 500.0, 200.0)
print('Final Balance in Report:', rep['final_balance'])
```
**Expected Terminal Execution Output**:
```text
Final Balance in Report: 1300.0
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_CAPSTONE_TRANSACTION_RECONCILER`
* **Question**: **What is final_balance for initial 1000 + 500 credits - 200 debits?**
* **Expected Exact Value**: `Final Balance in Report: 1300.0`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `1500` (Misconception: `MC_PY_CAPSTONE_TRANSACTION_RECONCILER`)
  1. 🛑 *What Went Wrong*: 1000 + 500 - 200 = 1300.0.
  2. 💡 *Simpler Everyday Picture*: 1000 + 500 - 200 = 1300.0.
  3. 🛠️ *Guided Fix Prompt*: **Type Final Balance in Report: 1300.0**


#### 🔹 Slide 4: Category Breakdown & Anomaly Detection (`py-d30-b4-category-filtering`)

* **Primary Concept Budget**: `Category Breakdown`
* **Supporting Terms**: Threshold Filter, Anomaly Tagging
* **Prerequisites**: `py-d30-b3-audit-report-generator` (understood)

##### 💻 Runnable Interactive Python Sandbox (`anomaly.py`)
```python
txs = [('TECH', 5000), ('FOOD', 25), ('TECH', 120)]
large_txs = [t for t in txs if t[1] >= 1000]
print('Anomalous High-Value Transactions:', large_txs)
```
**Expected Terminal Execution Output**:
```text
Anomalous High-Value Transactions: [('TECH', 5000)]
```

##### ❓ Socratic Diagnostic & Empathetic Recovery Ladder
* **Diagnostic Check Type**: `predict_output`
* **Targeted Misconception ID**: `MC_PY_CAPSTONE_TRANSACTION_RECONCILER`
* **Question**: **Which single transaction is filtered as >= 1000 in the code above?**
* **Expected Exact Value**: `Anomalous High-Value Transactions: [('TECH', 5000)]`

**Empathetic 3-Step Recovery Path**:
* **Trigger Context**: `None` (Misconception: `MC_PY_CAPSTONE_TRANSACTION_RECONCILER`)
  1. 🛑 *What Went Wrong*: Only ('TECH', 5000) is >= 1000.
  2. 💡 *Simpler Everyday Picture*: 5000 >= 1000 matches.
  3. 🛠️ *Guided Fix Prompt*: **Type Anomalous High-Value Transactions: [('TECH', 5000)]**


### ⚡ Quest 2: Proctored Coding Exam — Final Capstone: Ledger Transaction Auditor Engine

**Problem Statement**:
Implement `LedgerAuditor` with `__init__(self, initial_balance: float)`, `add_transaction(self, tx_type: str, amount: float, category: str)`, `reconcile_balance(self) -> float`, and `generate_audit_report(self) -> dict` returning `{'final_balance': float, 'total_credits': float, 'total_debits': float, 'transaction_count': int}`.

**Socratic Mentor Hint**: *Reconcile balance by adding CREDIT and subtracting DEBIT; calculate totals in report.*

#### 💻 Exam Starter Code (`solution.py`)
```python
class LedgerAuditor:
    def __init__(self, initial_balance: float = 0.0):
        self.initial_balance = initial_balance
        self.transactions = []

    def add_transaction(self, tx_type: str, amount: float, category: str):
        if amount <= 0:
            raise ValueError('Amount must be positive')
        if tx_type not in ('CREDIT', 'DEBIT'):
            raise ValueError('Invalid transaction type')
        self.transactions.append({'type': tx_type, 'amount': amount, 'category': category})

    def reconcile_balance(self) -> float:
        bal = self.initial_balance
        for t in self.transactions:
            if t['type'] == 'CREDIT':
                bal += t['amount']
            else:
                bal -= t['amount']
        return round(bal, 2)

    def generate_audit_report(self) -> dict:
        credits = sum(t['amount'] for t in self.transactions if t['type'] == 'CREDIT')
        debits = sum(t['amount'] for t in self.transactions if t['type'] == 'DEBIT')
        return {
            'final_balance': self.reconcile_balance(),
            'total_credits': round(credits, 2),
            'total_debits': round(debits, 2),
            'transaction_count': len(self.transactions)
        }

```

#### 🛡️ Proctored Adversarial Multi-Case Test Suite (`test_runner.py`)
```python
auditor = LedgerAuditor(1000.0)
auditor.add_transaction('CREDIT', 500.0, 'SALARY')
auditor.add_transaction('DEBIT', 200.0, 'GROCERIES')
assert auditor.reconcile_balance() == 1300.0, 'Test 1 Failed'
rep = auditor.generate_audit_report()
assert rep == {'final_balance': 1300.0, 'total_credits': 500.0, 'total_debits': 200.0, 'transaction_count': 2}, 'Test 2 Failed'
try:
    auditor.add_transaction('INVALID', 10.0, 'TEST')
    assert False, 'Test 3 Failed'
except ValueError:
    pass
print('All 3 assertions passed.')
```

### 🛠️ Quest 3: Practical Python Assignment — Final Capstone: Account Balance Reconciler & Category Filter

**Problem Statement**:
Write a Python function `reconcile_ledger_by_category(initial_balance: float, transactions: list, filter_category: str) -> dict` returning net balance after applying only transactions of that category, plus count of transactions processed.

**Socratic Mentor Hint**: *bal = initial_balance; count = 0; for t in transactions: if t['category'] == filter_category: bal += t['amount'] if t['type'] == 'CREDIT' else -t['amount']; count += 1; return {'filtered_balance': round(bal, 2), 'processed_count': count}*

#### 💻 Assignment Starter Code (`solution.py`)
```python
def reconcile_ledger_by_category(initial_balance: float, transactions: list, filter_category: str) -> dict:
    # Filter and reconcile transactions by category
    pass

```

#### 🛡️ Multi-Case Test Suite (`test_runner.py`)
```python
txs = [{'type': 'CREDIT', 'amount': 100.0, 'category': 'TECH'}, {'type': 'DEBIT', 'amount': 30.0, 'category': 'TECH'}, {'type': 'DEBIT', 'amount': 50.0, 'category': 'FOOD'}]
res = reconcile_ledger_by_category(500.0, txs, 'TECH')
assert res == {'filtered_balance': 570.0, 'processed_count': 2}, 'Test 1 Failed'
print('All 1 assertions passed.')
```


═══════════════════════════════════════════════════════════════════

