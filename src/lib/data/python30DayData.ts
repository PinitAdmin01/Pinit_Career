import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const PYTHON_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "title": "Program Execution, print(), Case-Sensitivity & Comments",
    "desc": "Understand how Python executes code sequentially from top to bottom, print output with print(), and write comments.",
    "syllabus": [
      "Sequential line-by-line execution",
      "The print() function with single and multiple arguments",
      "Single-line (#) comments and case sensitivity rules"
    ],
    "eTitle": "System Initialization Banner Printer",
    "eDesc": "Write a Python function `get_system_banner(system_name: str, version: str) -> str` that returns 'SYSTEM: <system_name> | VERSION: <version> | STATUS: ONLINE'.",
    "eStarter": "def get_system_banner(system_name: str, version: str) -> str:\n    # Return formatted system banner\n    pass\n",
    "eHint": "Use an f-string: f'SYSTEM: {system_name} | VERSION: {version} | STATUS: ONLINE'",
    "eTest": "assert get_system_banner('AUTH_SRV', '1.0.4') == 'SYSTEM: AUTH_SRV | VERSION: 1.0.4 | STATUS: ONLINE', 'Test 1 Failed'\nassert get_system_banner('CORE', '2.0.0') == 'SYSTEM: CORE | VERSION: 2.0.0 | STATUS: ONLINE', 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Receipt Header Formatter",
    "aDesc": "Write a Python function `format_receipt_header(store_name: str, terminal_id: int) -> str` returning '*** <STORE_NAME> (TERM #<terminal_id>) ***'.",
    "aStarter": "def format_receipt_header(store_name: str, terminal_id: int) -> str:\n    # Format receipt header with store name and terminal id\n    pass\n",
    "aHint": "Return f'*** {store_name} (TERM #{terminal_id}) ***'",
    "aTest": "assert format_receipt_header('METRO MART', 4) == '*** METRO MART (TERM #4) ***', 'Test 1 Failed'\nassert format_receipt_header('PINIT STORE', 12) == '*** PINIT STORE (TERM #12) ***', 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Variables, Dynamic Typing & The type() Function",
    "desc": "Master variable assignment, dynamic type binding, and type inspection in Python.",
    "syllabus": [
      "Variables as name tags pointing to objects in heap memory",
      "Primitive data types: int, float, str, bool",
      "Inspecting data types with type() and isinstance()"
    ],
    "eTitle": "Payload Type Inspector",
    "eDesc": "Write a Python function `identify_data_type(val) -> str` that returns 'INTEGER', 'FLOAT', 'STRING', 'BOOLEAN', or 'OTHER'.",
    "eStarter": "def identify_data_type(val) -> str:\n    # Return string label of the type\n    pass\n",
    "eHint": "Check isinstance(val, bool) first (since bool is a subclass of int in Python), then int, float, str.",
    "eTest": "assert identify_data_type(True) == 'BOOLEAN', 'Test 1 Failed'\nassert identify_data_type(42) == 'INTEGER', 'Test 2 Failed'\nassert identify_data_type(3.14) == 'FLOAT', 'Test 3 Failed'\nassert identify_data_type('hello') == 'STRING', 'Test 4 Failed'\nassert identify_data_type([]) == 'OTHER', 'Test 5 Failed'\nprint('All 5 assertions passed.')",
    "aTitle": "Sensor Tag Formatter",
    "aDesc": "Write a Python function `format_sensor_reading(name: str, reading: float, active: bool) -> str` returning '<name>: <reading> (Active: <active>)'.",
    "aStarter": "def format_sensor_reading(name: str, reading: float, active: bool) -> str:\n    # Return formatted sensor reading string\n    pass\n",
    "aHint": "Return f'{name}: {reading} (Active: {active})'",
    "aTest": "assert format_sensor_reading('TEMP_1', 24.5, True) == 'TEMP_1: 24.5 (Active: True)', 'Test 1 Failed'\nassert format_sensor_reading('PRESSURE', 101.3, False) == 'PRESSURE: 101.3 (Active: False)', 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "User Input, String Parsing & Type Casting (int, float, str)",
    "desc": "Handle user input, parse string numbers, and cast safely between types.",
    "syllabus": [
      "The input() function and string returns",
      "Explicit casting with int(), float(), str()",
      "Preventing ValueError traps with validation"
    ],
    "eTitle": "Safe Integer Parser with Fallback",
    "eDesc": "Write a Python function `safe_parse_int(text: str, fallback: int) -> int` that parses text to an int, or returns fallback if conversion fails.",
    "eStarter": "def safe_parse_int(text: str, fallback: int) -> int:\n    # Try to convert text to int; return fallback on error\n    pass\n",
    "eHint": "Use try...except ValueError: return fallback",
    "eTest": "assert safe_parse_int('120', 0) == 120, 'Test 1 Failed'\nassert safe_parse_int('invalid', 10) == 10, 'Test 2 Failed'\nassert safe_parse_int('-45', 0) == -45, 'Test 3 Failed'\nprint('All 3 assertions passed.')",
    "aTitle": "Currency String to Cents Converter",
    "aDesc": "Write a Python function `dollars_to_cents(dollar_str: str) -> int` that converts a string like '19.99' into integer cents (1999).",
    "aStarter": "def dollars_to_cents(dollar_str: str) -> int:\n    # Convert dollar string to total integer cents\n    pass\n",
    "aHint": "Convert to float, multiply by 100, and round to int: round(float(dollar_str) * 100)",
    "aTest": "assert dollars_to_cents('19.99') == 1999, 'Test 1 Failed'\nassert dollars_to_cents('5.00') == 500, 'Test 2 Failed'\nassert dollars_to_cents('0.75') == 75, 'Test 3 Failed'\nprint('All 3 assertions passed.')"
  },
  {
    "title": "Arithmetic Operations, Float Division /, Floor Division // & Modulo %",
    "desc": "Master mathematical operators in Python including floor division, modulo, and precedence rules.",
    "syllabus": [
      "Addition (+), subtraction (-), multiplication (*)",
      "Float division (/) vs floor division (//)",
      "The remainder operator (%) and even/odd parity checks"
    ],
    "eTitle": "Time Splitter: Total Seconds to Hours, Minutes, Seconds",
    "eDesc": "Write a Python function `split_seconds(total_seconds: int) -> tuple` returning `(hours, minutes, seconds)`.",
    "eStarter": "def split_seconds(total_seconds: int) -> tuple:\n    # Return (hours, minutes, seconds)\n    pass\n",
    "eHint": "hours = total_seconds // 3600; rem = total_seconds % 3600; minutes = rem // 60; seconds = rem % 60",
    "eTest": "assert split_seconds(3665) == (1, 1, 5), 'Test 1 Failed'\nassert split_seconds(60) == (0, 1, 0), 'Test 2 Failed'\nassert split_seconds(7200) == (2, 0, 0), 'Test 3 Failed'\nprint('All 3 assertions passed.')",
    "aTitle": "Even/Odd Number Classifier",
    "aDesc": "Write a Python function `is_even(n: int) -> bool` returning True if n is even, False otherwise.",
    "aStarter": "def is_even(n: int) -> bool:\n    # Return True if even, False if odd\n    pass\n",
    "aHint": "Return n % 2 == 0",
    "aTest": "assert is_even(4) == True, 'Test 1 Failed'\nassert is_even(7) == False, 'Test 2 Failed'\nassert is_even(0) == True, 'Test 3 Failed'\nassert is_even(-2) == True, 'Test 4 Failed'\nprint('All 4 assertions passed.')"
  },
  {
    "title": "⭐ MILESTONE 1: Interactive Decision Console & Rule Engine",
    "desc": "Synthesize if, elif, else branch logic, boolean comparison operators, and short-circuit evaluation into an enterprise rule evaluator.",
    "syllabus": [
      "Comparison operators (==, !=, <, <=, >, >=)",
      "Boolean operators (and, or, not) and truth tables",
      "Milestone Project: Loan Eligibility & Risk Rule Engine"
    ],
    "eTitle": "Loan Risk Score Evaluator",
    "eDesc": "Write a Python function `evaluate_loan_risk(credit_score: int, annual_income: int, has_defaults: bool) -> str` returning 'APPROVED' (credit >= 700 and income >= 50000 and not defaults), 'MANUAL_REVIEW' (credit >= 600 and income >= 30000 and not defaults), or 'REJECTED'.",
    "eStarter": "def evaluate_loan_risk(credit_score: int, annual_income: int, has_defaults: bool) -> str:\n    # Return 'APPROVED', 'MANUAL_REVIEW', or 'REJECTED'\n    pass\n",
    "eHint": "Check APPROVED condition first, then MANUAL_REVIEW, else return 'REJECTED'.",
    "eTest": "assert evaluate_loan_risk(750, 60000, False) == 'APPROVED', 'Test 1 Failed'\nassert evaluate_loan_risk(650, 40000, False) == 'MANUAL_REVIEW', 'Test 2 Failed'\nassert evaluate_loan_risk(750, 60000, True) == 'REJECTED', 'Test 3 Failed'\nassert evaluate_loan_risk(550, 80000, False) == 'REJECTED', 'Test 4 Failed'\nprint('All 4 assertions passed.')",
    "aTitle": "E-Commerce Discount Tier Calculator",
    "aDesc": "Write a Python function `calculate_discount_tier(cart_total: float, is_vip: bool) -> float` returning discount percentage (0.20 if VIP and cart >= 100; 0.10 if cart >= 100; 0.05 if VIP; 0.0 otherwise).",
    "aStarter": "def calculate_discount_tier(cart_total: float, is_vip: bool) -> float:\n    # Return discount rate\n    pass\n",
    "aHint": "Check both conditions (cart >= 100 and is_vip) first.",
    "aTest": "assert calculate_discount_tier(150.0, True) == 0.20, 'Test 1 Failed'\nassert calculate_discount_tier(120.0, False) == 0.10, 'Test 2 Failed'\nassert calculate_discount_tier(50.0, True) == 0.05, 'Test 3 Failed'\nassert calculate_discount_tier(40.0, False) == 0.0, 'Test 4 Failed'\nprint('All 4 assertions passed.')"
  },
  {
    "title": "The while Loop & Sentinel Input Validation",
    "desc": "Master condition-first iteration, sentinel loops, break statements, and continue keywords.",
    "syllabus": [
      "The while loop syntax and condition re-evaluation",
      "Loop termination guards and preventing infinite loops",
      "Using break and continue for fine-grained loop control"
    ],
    "eTitle": "Collatz Conjecture Step Counter",
    "eDesc": "Write a Python function `collatz_steps(n: int) -> int` that calculates how many steps it takes to reach 1 (if even: n // 2, if odd: 3*n + 1). Return 0 for n=1.",
    "eStarter": "def collatz_steps(n: int) -> int:\n    # Count steps until n reaches 1\n    pass\n",
    "eHint": "Use a while n > 1: loop with step counter.",
    "eTest": "assert collatz_steps(1) == 0, 'Test 1 Failed'\nassert collatz_steps(6) == 8, 'Test 2 Failed'\nassert collatz_steps(27) == 111, 'Test 3 Failed'\nprint('All 3 assertions passed.')",
    "aTitle": "Target Balance Investment Doubler",
    "aDesc": "Write a Python function `years_to_target(principal: float, rate: float, target: float) -> int` that calculates years required to reach or exceed target balance with annual compound interest.",
    "aStarter": "def years_to_target(principal: float, rate: float, target: float) -> int:\n    # Count years until principal >= target\n    pass\n",
    "aHint": "while balance < target: balance += balance * rate; years += 1",
    "aTest": "assert years_to_target(1000.0, 0.10, 2000.0) == 8, 'Test 1 Failed'\nassert years_to_target(500.0, 0.05, 500.0) == 0, 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "The for Loop with range() & The Accumulator Pattern",
    "desc": "Iterate over definite sequences using range(start, stop, step) and accumulate sums and products.",
    "syllabus": [
      "range(stop), range(start, stop), range(start, stop, step)",
      "The accumulator pattern (running totals and running products)",
      "Counting backwards with negative steps"
    ],
    "eTitle": "Sum of Multiples in Range",
    "eDesc": "Write a Python function `sum_multiples(limit: int, factor: int) -> int` returning the sum of all multiples of `factor` strictly less than `limit`.",
    "eStarter": "def sum_multiples(limit: int, factor: int) -> int:\n    # Return sum of multiples of factor < limit\n    pass\n",
    "eHint": "Use sum(range(factor, limit, factor))",
    "eTest": "assert sum_multiples(10, 3) == 18, 'Test 1 Failed'\nassert sum_multiples(20, 5) == 30, 'Test 2 Failed'\nassert sum_multiples(5, 10) == 0, 'Test 3 Failed'\nprint('All 3 assertions passed.')",
    "aTitle": "Factorial Calculator",
    "aDesc": "Write a Python function `calculate_factorial(n: int) -> int` that calculates n! (return 1 for n=0).",
    "aStarter": "def calculate_factorial(n: int) -> int:\n    # Calculate n factorial\n    pass\n",
    "aHint": "total = 1; for i in range(1, n + 1): total *= i; return total",
    "aTest": "assert calculate_factorial(0) == 1, 'Test 1 Failed'\nassert calculate_factorial(5) == 120, 'Test 2 Failed'\nassert calculate_factorial(6) == 720, 'Test 3 Failed'\nprint('All 3 assertions passed.')"
  },
  {
    "title": "Nested Loops, Grid Traversal & String Formatting (f-strings)",
    "desc": "Master nested loop iterations for 2D matrix grids, coordinate generation, and structured f-string reporting.",
    "syllabus": [
      "Nested for loop mechanics (outer row, inner column)",
      "2D coordinate space mapping",
      "Precision f-string formatting (decimals, padding, alignment)"
    ],
    "eTitle": "Multiplication Table Grid Generator",
    "eDesc": "Write a Python function `generate_grid(rows: int, cols: int) -> list` that returns a 2D list of products where cell [r][c] = (r+1) * (c+1).",
    "eStarter": "def generate_grid(rows: int, cols: int) -> list:\n    # Return 2D list of products\n    pass\n",
    "eHint": "Use nested list comprehension: [[(r+1)*(c+1) for c in range(cols)] for r in range(rows)]",
    "eTest": "assert generate_grid(2, 3) == [[1, 2, 3], [2, 4, 6]], 'Test 1 Failed'\nassert generate_grid(1, 1) == [[1]], 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Coordinate Pair Flattener",
    "aDesc": "Write a Python function `generate_coordinates(max_x: int, max_y: int) -> list` returning a list of tuple pairs `(x, y)` for x in 0..max_x and y in 0..max_y.",
    "aStarter": "def generate_coordinates(max_x: int, max_y: int) -> list:\n    # Return list of coordinate tuples\n    pass\n",
    "aHint": "[(x, y) for x in range(max_x + 1) for y in range(max_y + 1)]",
    "aTest": "assert generate_coordinates(1, 1) == [(0, 0), (0, 1), (1, 0), (1, 1)], 'Test 1 Failed'\nassert len(generate_coordinates(2, 2)) == 9, 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Functions with def, Parameters, Return Values & Docstrings",
    "desc": "Master reusable modular programming, parameter passing, return statements, and documentation docstrings.",
    "syllabus": [
      "The def keyword and function anatomy",
      "Parameters vs arguments and multiple return values",
      "Writing docstrings and pure functions"
    ],
    "eTitle": "Celsius to Fahrenheit & Kelvin Converter",
    "eDesc": "Write a Python function `convert_temperature(celsius: float) -> tuple` returning `(fahrenheit, kelvin)` rounded to 2 decimals.",
    "eStarter": "def convert_temperature(celsius: float) -> tuple:\n    # Return (f, k)\n    pass\n",
    "eHint": "f = round((celsius * 9/5) + 32, 2); k = round(celsius + 273.15, 2); return (f, k)",
    "eTest": "assert convert_temperature(0.0) == (32.0, 273.15), 'Test 1 Failed'\nassert convert_temperature(100.0) == (212.0, 373.15), 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Volume of Cylinder Calculator",
    "aDesc": "Write a Python function `cylinder_volume(radius: float, height: float) -> float` returning volume $V = \\pi r^2 h$ rounded to 2 decimal places (use 3.14159 for pi).",
    "aStarter": "def cylinder_volume(radius: float, height: float) -> float:\n    # Calculate cylinder volume\n    pass\n",
    "aHint": "return round(3.14159 * (radius ** 2) * height, 2)",
    "aTest": "assert cylinder_volume(3.0, 5.0) == 141.37, 'Test 1 Failed'\nassert cylinder_volume(1.0, 1.0) == 3.14, 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "⭐ MILESTONE 2: Multi-Function Financial Utility Engine & Stack Frames",
    "desc": "Synthesize multi-function composition, local vs global scope, and call stack frame execution into a modular financial engine.",
    "syllabus": [
      "Variable scope (Local, Enclosing, Global, Built-in - LEGB)",
      "Function composition and passing functions as inputs",
      "Milestone Project: Modular Payroll & Tax Deduction Engine"
    ],
    "eTitle": "Net Salary & Tax Deduction Engine",
    "eDesc": "Write a Python function `compute_net_salary(gross_pay: float, deduction_rate: float, bonus: float) -> float` that deducts tax from gross_pay and adds bonus. Return net rounded to 2 decimals.",
    "eStarter": "def compute_net_salary(gross_pay: float, deduction_rate: float, bonus: float) -> float:\n    # Return net pay\n    pass\n",
    "eHint": "tax = gross_pay * deduction_rate; return round(gross_pay - tax + bonus, 2)",
    "eTest": "assert compute_net_salary(5000.0, 0.20, 500.0) == 4500.0, 'Test 1 Failed'\nassert compute_net_salary(3000.0, 0.10, 0.0) == 2700.0, 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Compound Interest Metric Engine",
    "aDesc": "Write a Python function `compound_interest(principal: float, rate: float, times_per_year: int, years: int) -> float` returning total future value $A = P(1 + r/n)^{nt}$ rounded to 2 decimals.",
    "aStarter": "def compound_interest(principal: float, rate: float, times_per_year: int, years: int) -> float:\n    # Calculate future value\n    pass\n",
    "aHint": "return round(principal * ((1 + (rate / times_per_year)) ** (times_per_year * years)), 2)",
    "aTest": "assert compound_interest(1000.0, 0.05, 1, 2) == 1102.5, 'Test 1 Failed'\nassert compound_interest(5000.0, 0.08, 12, 5) == 7449.23, 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Python Lists — Indexing, Slicing [start:stop:step] & CRUD Operations",
    "desc": "Master mutable sequences, 0-based and negative indexing, slicing tricks, and list mutation methods.",
    "syllabus": [
      "List creation, append(), insert(), pop(), remove()",
      "Negative indexing (arr[-1] for last element)",
      "Slicing syntax [start:stop:step] and reverse slicing [::-1]"
    ],
    "eTitle": "List Middle Window Extractor",
    "eDesc": "Write a Python function `extract_middle_window(items: list, k: int) -> list` that removes `k` elements from both the start and end of the list.",
    "eStarter": "def extract_middle_window(items: list, k: int) -> list:\n    # Return sublist excluding first k and last k elements\n    pass\n",
    "eHint": "Use slicing: items[k : -k] if k > 0 else items",
    "eTest": "assert extract_middle_window([10, 20, 30, 40, 50, 60], 1) == [20, 30, 40, 50], 'Test 1 Failed'\nassert extract_middle_window([1, 2, 3, 4, 5], 2) == [3], 'Test 2 Failed'\nassert extract_middle_window([1, 2, 3], 0) == [1, 2, 3], 'Test 3 Failed'\nprint('All 3 assertions passed.')",
    "aTitle": "List Deduplicator and Reverser",
    "aDesc": "Write a Python function `reverse_unique_order(items: list) -> list` that keeps only the first occurrence of each element, then returns the result reversed.",
    "aStarter": "def reverse_unique_order(items: list) -> list:\n    # Preserve first-seen uniqueness and reverse\n    pass\n",
    "aHint": "Use a seen set or dict.fromkeys(items), convert to list, and slice [::-1]",
    "aTest": "assert reverse_unique_order([1, 2, 2, 3, 1, 4]) == [4, 3, 2, 1], 'Test 1 Failed'\nassert reverse_unique_order(['a', 'b', 'a']) == ['b', 'a'], 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "List Comprehensions, Filtering & In-Place vs Copy Sorting",
    "desc": "Write clean, Pythonic transformations using list comprehensions, sorting with sort() vs sorted(), and lambda keys.",
    "syllabus": [
      "List comprehension syntax: [expr for item in list if condition]",
      "In-place mutation (list.sort()) vs return copy (sorted(list))",
      "Sorting with custom key functions"
    ],
    "eTitle": "Transaction Threshold Filter & Squared Magnitude",
    "eDesc": "Write a Python function `filter_and_square_evens(numbers: list, threshold: int) -> list` returning a list of squares for all even numbers > threshold.",
    "eStarter": "def filter_and_square_evens(numbers: list, threshold: int) -> list:\n    # Return squares of even numbers > threshold\n    pass\n",
    "eHint": "Use [n ** 2 for n in numbers if n > threshold and n % 2 == 0]",
    "eTest": "assert filter_and_square_evens([2, 5, 8, 11, 14], 4) == [64, 196], 'Test 1 Failed'\nassert filter_and_square_evens([1, 3, 5], 0) == [], 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Sort Strings by Length Descending",
    "aDesc": "Write a Python function `sort_by_length_desc(words: list) -> list` that returns words sorted by length from longest to shortest.",
    "aStarter": "def sort_by_length_desc(words: list) -> list:\n    # Return copy of words sorted by length descending\n    pass\n",
    "aHint": "Use sorted(words, key=len, reverse=True)",
    "aTest": "assert sort_by_length_desc(['apple', 'pie', 'banana']) == ['banana', 'apple', 'pie'], 'Test 1 Failed'\nassert sort_by_length_desc(['a', 'bbb', 'cc']) == ['bbb', 'cc', 'a'], 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Tuples (Immutability) & Sets (Uniqueness & O(1) Lookups)",
    "desc": "Master immutable fixed records with tuples and ultra-fast unique hash sets with union/intersection operators.",
    "syllabus": [
      "Tuple creation and immutability security",
      "Set hashing, uniqueness, and add()/remove()",
      "Set mathematical operations (union |, intersection &, difference -)"
    ],
    "eTitle": "Shared Customer ID Finder (Set Intersection)",
    "eDesc": "Write a Python function `find_common_customers(list_a: list, list_b: list) -> set` that returns a set of IDs present in both lists.",
    "eStarter": "def find_common_customers(list_a: list, list_b: list) -> set:\n    # Return set intersection\n    pass\n",
    "eHint": "Return set(list_a) & set(list_b)",
    "eTest": "assert find_common_customers([101, 102, 103], [102, 103, 104]) == {102, 103}, 'Test 1 Failed'\nassert find_common_customers([1, 2], [3, 4]) == set(), 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Immutable Coordinate Distance",
    "aDesc": "Write a Python function `euclidean_distance(pt1: tuple, pt2: tuple) -> float` returning distance $\\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ rounded to 2 decimals.",
    "aStarter": "def euclidean_distance(pt1: tuple, pt2: tuple) -> float:\n    # Calculate Euclidean distance between two (x, y) tuples\n    pass\n",
    "aHint": "import math; return round(math.sqrt((pt2[0]-pt1[0])**2 + (pt2[1]-pt1[1])**2), 2)",
    "aTest": "assert euclidean_distance((0, 0), (3, 4)) == 5.0, 'Test 1 Failed'\nassert euclidean_distance((1, 1), (4, 5)) == 5.0, 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Dictionaries — Key-Value Mapping & O(1) Hash Lookups",
    "desc": "Master associative arrays, hash lookups, dictionary CRUD, and safe key access with .get().",
    "syllabus": [
      "Dictionary initialization, key hashing rules (immutable keys)",
      "Safe lookups with dict.get(key, default)",
      "Iterating keys(), values(), and items() tuples"
    ],
    "eTitle": "Character Frequency Counter",
    "eDesc": "Write a Python function `count_char_frequencies(text: str) -> dict` returning a dict mapping each lowercase letter (ignoring spaces) to its count.",
    "eStarter": "def count_char_frequencies(text: str) -> dict:\n    # Return frequency dict for lowercase non-space characters\n    pass\n",
    "eHint": "Iterate text.lower(): if char != ' ': freq[char] = freq.get(char, 0) + 1",
    "eTest": "assert count_char_frequencies('Hello') == {'h': 1, 'e': 1, 'l': 2, 'o': 1}, 'Test 1 Failed'\nassert count_char_frequencies('A a') == {'a': 2}, 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Inventory Reorder Alert Filter",
    "aDesc": "Write a Python function `get_low_stock_items(inventory: dict, threshold: int) -> dict` returning items where quantity <= threshold.",
    "aStarter": "def get_low_stock_items(inventory: dict, threshold: int) -> dict:\n    # Return low stock subset\n    pass\n",
    "aHint": "{k: v for k, v in inventory.items() if v <= threshold}",
    "aTest": "assert get_low_stock_items({'pens': 50, 'erasers': 5, 'notebooks': 12}, 10) == {'erasers': 5}, 'Test 1 Failed'\nassert get_low_stock_items({'a': 20}, 5) == {}, 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "⭐ MILESTONE 3: Fast Ledger Lookup & Dictionary Search Engine",
    "desc": "Synthesize dictionary lookups, grouping operations, and fast search indexing into a high-performance ledger aggregator.",
    "syllabus": [
      "Dictionary grouping patterns (grouping records by category)",
      "Inverted index construction",
      "Milestone Project: High-Speed Transaction Search & Grouping Engine"
    ],
    "eTitle": "Ledger Category Aggregator",
    "eDesc": "Write a Python function `aggregate_by_category(transactions: list) -> dict` where each transaction is `{'category': str, 'amount': float}`. Return dict summing amounts per category.",
    "eStarter": "def aggregate_by_category(transactions: list) -> dict:\n    # Sum transaction amounts per category\n    pass\n",
    "eHint": "totals = {}; for t in transactions: totals[t['category']] = round(totals.get(t['category'], 0.0) + t['amount'], 2); return totals",
    "eTest": "txs = [{'category': 'FOOD', 'amount': 15.5}, {'category': 'TECH', 'amount': 120.0}, {'category': 'FOOD', 'amount': 10.5}]\nassert aggregate_by_category(txs) == {'FOOD': 26.0, 'TECH': 120.0}, 'Test 1 Failed'\nassert aggregate_by_category([]) == {}, 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "User Search by Email Domain Indexer",
    "aDesc": "Write a Python function `index_users_by_domain(users: list) -> dict` where users is a list of emails. Return dict mapping domain (after '@') to list of usernames.",
    "aStarter": "def index_users_by_domain(users: list) -> dict:\n    # Group usernames by domain\n    pass\n",
    "aHint": "domain_map = {}; for u in users: user, domain = u.split('@'); domain_map.setdefault(domain, []).append(user); return domain_map",
    "aTest": "users = ['alice@pinit.ai', 'bob@gmail.com', 'charlie@pinit.ai']\nassert index_users_by_domain(users) == {'pinit.ai': ['alice', 'charlie'], 'gmail.com': ['bob']}, 'Test 1 Failed'\nprint('All 1 assertions passed.')"
  },
  {
    "title": "Object-Oriented Programming — Classes, self & Object Instantiation",
    "desc": "Understand the blueprint-to-instance relationship, self parameter, and object state in Python.",
    "syllabus": [
      "The class keyword and instantiating objects",
      "The self parameter (explicit receiver of method calls)",
      "Instance attributes vs class variables"
    ],
    "eTitle": "BankAccount Class with Deposit & Balance",
    "eDesc": "Implement `BankAccount` with `__init__(self, owner: str, balance: float = 0.0)`, `deposit(self, amount: float)`, and `get_balance(self) -> float`.",
    "eStarter": "class BankAccount:\n    def __init__(self, owner: str, balance: float = 0.0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount: float):\n        if amount > 0:\n            self.balance += amount\n\n    def get_balance(self) -> float:\n        return self.balance\n",
    "eHint": "Ensure deposit increases balance only when amount > 0.",
    "eTest": "acc = BankAccount('Alex', 100.0)\nacc.deposit(50.0)\nassert acc.get_balance() == 150.0, 'Test 1 Failed'\nacc.deposit(-20.0)\nassert acc.get_balance() == 150.0, 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Item Product Entity with Discount",
    "aDesc": "Implement `Product` with `__init__(self, name: str, price: float)`, `apply_discount(self, rate: float)`, and `get_price(self) -> float`.",
    "aStarter": "class Product:\n    def __init__(self, name: str, price: float):\n        self.name = name\n        self.price = price\n\n    def apply_discount(self, rate: float):\n        self.price = round(self.price * (1 - rate), 2)\n\n    def get_price(self) -> float:\n        return self.price\n",
    "aHint": "price after discount is price * (1 - rate)",
    "aTest": "p = Product('Keyboard', 100.0)\np.apply_discount(0.15)\nassert p.get_price() == 85.0, 'Test 1 Failed'\nprint('All 1 assertions passed.')"
  },
  {
    "title": "Constructors (__init__), Default Values & Instance State",
    "desc": "Master Python constructor initialization, parameter defaults, and instance invariants.",
    "syllabus": [
      "The __init__() dunder method lifecycle",
      "Parameter defaults in constructors",
      "Validating arguments during instantiation"
    ],
    "eTitle": "Validated User Profile Constructor",
    "eDesc": "Implement `UserProfile` with `__init__(self, username: str, email: str, role: str = 'STUDENT')`. Raise `ValueError` if username is empty or email lacks '@'.",
    "eStarter": "class UserProfile:\n    def __init__(self, username: str, email: str, role: str = 'STUDENT'):\n        if not username:\n            raise ValueError('Username cannot be empty')\n        if '@' not in email:\n            raise ValueError('Invalid email')\n        self.username = username\n        self.email = email\n        self.role = role\n",
    "eHint": "Check if not username: raise ValueError; if '@' not in email: raise ValueError",
    "eTest": "u = UserProfile('sarah', 'sarah@pinit.ai')\nassert u.role == 'STUDENT', 'Test 1 Failed'\ntry:\n    UserProfile('', 'test@pinit.ai')\n    assert False, 'Test 2 Failed'\nexcept ValueError:\n    pass\nprint('All 2 assertions passed.')",
    "aTitle": "Timer Config Entity",
    "aDesc": "Implement `TimerConfig` with `__init__(self, duration_sec: int, is_countdown: bool = True)`. If duration_sec <= 0, raise ValueError.",
    "aStarter": "class TimerConfig:\n    def __init__(self, duration_sec: int, is_countdown: bool = True):\n        if duration_sec <= 0:\n            raise ValueError('Duration must be positive')\n        self.duration_sec = duration_sec\n        self.is_countdown = is_countdown\n",
    "aHint": "Validate duration_sec > 0 in __init__.",
    "aTest": "t = TimerConfig(60)\nassert t.is_countdown == True, 'Test 1 Failed'\ntry:\n    TimerConfig(-5)\n    assert False, 'Test 2 Failed'\nexcept ValueError:\n    pass\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Encapsulation, Private Attributes (_var, __var) & Properties (@property)",
    "desc": "Protect object internal state using naming conventions, name mangling, and @property getters and setters.",
    "syllabus": [
      "Single underscore (_protected) vs double underscore (__private name mangling)",
      "The @property decorator for clean attribute access",
      "The @<field>.setter decorator with validation"
    ],
    "eTitle": "Encapsulated Temperature with Kelvin Property",
    "eDesc": "Implement `Temperature` class with `@property celsius` and `@property kelvin`. Setting celsius should validate that celsius >= -273.15 (else raise ValueError).",
    "eStarter": "class Temperature:\n    def __init__(self, celsius: float = 0.0):\n        self.celsius = celsius\n\n    @property\n    def celsius(self) -> float:\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, val: float):\n        if val < -273.15:\n            raise ValueError('Below absolute zero')\n        self._celsius = val\n\n    @property\n    def kelvin(self) -> float:\n        return round(self._celsius + 273.15, 2)\n",
    "eHint": "Use @property and @celsius.setter with self._celsius backing field.",
    "eTest": "t = Temperature(25.0)\nassert t.kelvin == 298.15, 'Test 1 Failed'\nt.celsius = 0.0\nassert t.kelvin == 273.15, 'Test 2 Failed'\ntry:\n    t.celsius = -300.0\n    assert False, 'Test 3 Failed'\nexcept ValueError:\n    pass\nprint('All 3 assertions passed.')",
    "aTitle": "Wallet with Non-Negative Balance Property",
    "aDesc": "Implement `Wallet` with `@property balance` and `@balance.setter` raising ValueError if balance is set to negative.",
    "aStarter": "class Wallet:\n    def __init__(self, balance: float = 0.0):\n        self.balance = balance\n\n    @property\n    def balance(self) -> float:\n        return self._balance\n\n    @balance.setter\n    def balance(self, val: float):\n        if val < 0:\n            raise ValueError('Negative balance')\n        self._balance = val\n",
    "aHint": "Validate val >= 0 in setter.",
    "aTest": "w = Wallet(50.0)\nw.balance = 20.0\nassert w.balance == 20.0, 'Test 1 Failed'\ntry:\n    w.balance = -10.0\n    assert False, 'Test 2 Failed'\nexcept ValueError:\n    pass\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Inheritance (class Child(Parent)), Method Overriding & super()",
    "desc": "Master parent-child class hierarchies, code reuse, method overriding, and calling super().__init__().",
    "syllabus": [
      "Single inheritance syntax: class Child(Parent)",
      "Calling parent constructor with super().__init__(...)",
      "Method overriding and extending base behavior"
    ],
    "eTitle": "Employee & Manager Class Hierarchy",
    "eDesc": "Implement `Employee(name, base_salary)` with `get_total_compensation()` returning base_salary, and `Manager(Employee)` with `bonus` added in `get_total_compensation()`.",
    "eStarter": "class Employee:\n    def __init__(self, name: str, base_salary: float):\n        self.name = name\n        self.base_salary = base_salary\n\n    def get_total_compensation(self) -> float:\n        return self.base_salary\n\nclass Manager(Employee):\n    def __init__(self, name: str, base_salary: float, bonus: float):\n        super().__init__(name, base_salary)\n        self.bonus = bonus\n\n    def get_total_compensation(self) -> float:\n        return self.base_salary + self.bonus\n",
    "eHint": "Use super().__init__(name, base_salary) in Manager.",
    "eTest": "e = Employee('Alice', 5000.0)\nassert e.get_total_compensation() == 5000.0, 'Test 1 Failed'\nm = Manager('Bob', 7000.0, 2000.0)\nassert m.get_total_compensation() == 9000.0, 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Shape & Rectangle Class Hierarchy",
    "aDesc": "Implement `Shape(color)` and `Rectangle(Shape)` with `width` and `height`, and `get_area()` returning width * height.",
    "aStarter": "class Shape:\n    def __init__(self, color: str):\n        self.color = color\n\nclass Rectangle(Shape):\n    def __init__(self, color: str, width: float, height: float):\n        super().__init__(color)\n        self.width = width\n        self.height = height\n\n    def get_area(self) -> float:\n        return self.width * self.height\n",
    "aHint": "Pass color to super().__init__(color).",
    "aTest": "r = Rectangle('blue', 4.0, 5.0)\nassert r.color == 'blue', 'Test 1 Failed'\nassert r.get_area() == 20.0, 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Polymorphism, Duck Typing & Magic Methods (__str__, __len__, __eq__)",
    "desc": "Master dynamic dispatch, Pythonic duck typing ('if it walks like a duck'), and operator overloading with dunder methods.",
    "syllabus": [
      "Duck typing: focusing on behavior rather than explicit inheritance",
      "Overloading string representation: __str__ and __repr__",
      "Overloading length __len__ and equality __eq__"
    ],
    "eTitle": "Cart Item Container with Magic Methods",
    "eDesc": "Implement `Cart` with `items` list, `add_item(item)`, `__len__(self)` returning count of items, and `__str__(self)` returning 'Cart: <count> items'.",
    "eStarter": "class Cart:\n    def __init__(self):\n        self.items = []\n\n    def add_item(self, item: str):\n        self.items.append(item)\n\n    def __len__(self) -> int:\n        return len(self.items)\n\n    def __str__(self) -> str:\n        return f'Cart: {len(self.items)} items'\n",
    "eHint": "Implement def __len__(self) -> int and def __str__(self) -> str",
    "eTest": "c = Cart()\nc.add_item('Laptop')\nc.add_item('Mouse')\nassert len(c) == 2, 'Test 1 Failed'\nassert str(c) == 'Cart: 2 items', 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "2D Vector with Vector Addition (__add__)",
    "aDesc": "Implement `Vector(x, y)` with `__add__(self, other)` returning a new Vector with added coordinates `(self.x + other.x, self.y + other.y)`.",
    "aStarter": "class Vector:\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n\n    def __add__(self, other: 'Vector') -> 'Vector':\n        return Vector(self.x + other.x, self.y + other.y)\n\n    def __eq__(self, other) -> bool:\n        return self.x == other.x and self.y == other.y\n",
    "aHint": "Return Vector(self.x + other.x, self.y + other.y)",
    "aTest": "v1 = Vector(2, 3)\nv2 = Vector(4, 5)\nv3 = v1 + v2\nassert v3.x == 6 and v3.y == 8, 'Test 1 Failed'\nprint('All 1 assertions passed.')"
  },
  {
    "title": "⭐ MILESTONE 4: Enterprise Polymorphic Payment Gateway Engine",
    "desc": "Synthesize abstract contracts, multiple polymorphic processors (CreditCard, UPI, Crypto), and fee calculations into an enterprise gateway.",
    "syllabus": [
      "Designing pluggable payment contracts",
      "Polymorphic collection iteration and transaction dispatch",
      "Milestone Project: Multi-Provider Payment Gateway Engine"
    ],
    "eTitle": "Polymorphic Payment Processor Engine",
    "eDesc": "Implement `CreditCardProcessor(fee_rate=0.02)` and `UPIProcessor(flat_fee=0.50)` both having `process_payment(amount: float) -> dict` returning `{'net': amount - fee, 'fee': fee, 'status': 'PROCESSED'}`.",
    "eStarter": "class CreditCardProcessor:\n    def __init__(self, fee_rate: float = 0.02):\n        self.fee_rate = fee_rate\n\n    def process_payment(self, amount: float) -> dict:\n        fee = round(amount * self.fee_rate, 2)\n        return {'net': round(amount - fee, 2), 'fee': fee, 'status': 'PROCESSED'}\n\nclass UPIProcessor:\n    def __init__(self, flat_fee: float = 0.50):\n        self.flat_fee = flat_fee\n\n    def process_payment(self, amount: float) -> dict:\n        fee = self.flat_fee\n        return {'net': round(amount - fee, 2), 'fee': fee, 'status': 'PROCESSED'}\n",
    "eHint": "Compute fee based on fee_rate or flat_fee.",
    "eTest": "cc = CreditCardProcessor(0.02)\nassert cc.process_payment(100.0) == {'net': 98.0, 'fee': 2.0, 'status': 'PROCESSED'}, 'Test 1 Failed'\nupi = UPIProcessor(0.50)\nassert upi.process_payment(100.0) == {'net': 99.50, 'fee': 0.50, 'status': 'PROCESSED'}, 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Polymorphic Notification Service",
    "aDesc": "Implement `EmailNotifier` and `SMSNotifier` both having `send(recipient: str, message: str) -> str` returning '[EMAIL] to <recipient>: <message>' and '[SMS] to <recipient>: <message>'.",
    "aStarter": "class EmailNotifier:\n    def send(self, recipient: str, message: str) -> str:\n        return f'[EMAIL] to {recipient}: {message}'\n\nclass SMSNotifier:\n    def send(self, recipient: str, message: str) -> str:\n        return f'[SMS] to {recipient}: {message}'\n",
    "aHint": "Return formatted string prefix.",
    "aTest": "e = EmailNotifier()\nassert e.send('a@b.com', 'Hi') == '[EMAIL] to a@b.com: Hi', 'Test 1 Failed'\ns = SMSNotifier()\nassert s.send('+1234', 'Hi') == '[SMS] to +1234: Hi', 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Exception Handling — try, except, else, finally & Custom Exceptions",
    "desc": "Build resilient systems using structured exception handling, specific catch hierarchies, finally cleanup, and custom Exception classes.",
    "syllabus": [
      "The try...except Exception as e block structure",
      "The else (success only) and finally (guaranteed run) blocks",
      "Creating custom exceptions with class MyError(Exception)"
    ],
    "eTitle": "Safe Division with Error Telemetry",
    "eDesc": "Write a Python function `safe_divide_logged(a: float, b: float) -> dict` returning `{'result': a/b, 'error': None}` or `{'result': None, 'error': 'ZeroDivisionError'}` on divide-by-zero.",
    "eStarter": "def safe_divide_logged(a: float, b: float) -> dict:\n    # Return result or caught error name\n    pass\n",
    "eHint": "try: return {'result': a / b, 'error': None} except ZeroDivisionError: return {'result': None, 'error': 'ZeroDivisionError'}",
    "eTest": "assert safe_divide_logged(10, 2) == {'result': 5.0, 'error': None}, 'Test 1 Failed'\nassert safe_divide_logged(10, 0) == {'result': None, 'error': 'ZeroDivisionError'}, 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Custom InsufficientFundsError Validator",
    "aDesc": "Define `InsufficientFundsError(Exception)`. Write `withdraw(balance: float, amount: float) -> float` raising `InsufficientFundsError('Overdraft')` if amount > balance, else returning balance - amount.",
    "aStarter": "class InsufficientFundsError(Exception):\n    pass\n\ndef withdraw(balance: float, amount: float) -> float:\n    if amount > balance:\n        raise InsufficientFundsError('Overdraft')\n    return balance - amount\n",
    "aHint": "Raise InsufficientFundsError when amount > balance.",
    "aTest": "assert withdraw(100.0, 40.0) == 60.0, 'Test 1 Failed'\ntry:\n    withdraw(50.0, 80.0)\n    assert False, 'Test 2 Failed'\nexcept InsufficientFundsError:\n    pass\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Context Managers & Safe File I/O (with open(...) as f:)",
    "desc": "Master automated resource management with context managers, reading and writing files safely without descriptor leaks.",
    "syllabus": [
      "The with statement and context manager protocol (__enter__, __exit__)",
      "Reading text line by line with readline() and for line in f",
      "Parsing comma-separated value (CSV) text streams"
    ],
    "eTitle": "Log Stream Error Counter (Context Safe)",
    "eDesc": "Write a Python function `count_errors_in_stream(lines: list) -> int` that counts how many lines start with '[ERROR]'.",
    "eStarter": "def count_errors_in_stream(lines: list) -> int:\n    # Count lines starting with '[ERROR]'\n    pass\n",
    "eHint": "sum(1 for line in lines if line.strip().startswith('[ERROR]'))",
    "eTest": "logs = ['[INFO] Booting', '[ERROR] Disk Full', '[WARN] High RAM', '[ERROR] Timeout']\nassert count_errors_in_stream(logs) == 2, 'Test 1 Failed'\nassert count_errors_in_stream(['[OK] Normal']) == 0, 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "CSV Line Column Parser",
    "aDesc": "Write a Python function `parse_csv_header(header_line: str) -> list` that splits a comma-separated line and returns stripped column names.",
    "aStarter": "def parse_csv_header(header_line: str) -> list:\n    # Return list of stripped column headers\n    pass\n",
    "aHint": "[col.strip() for col in header_line.split(',')]",
    "aTest": "assert parse_csv_header('id, name , email ') == ['id', 'name', 'email'], 'Test 1 Failed'\nprint('All 1 assertions passed.')"
  },
  {
    "title": "JSON Serialization & Deserialization (json.dumps, json.loads)",
    "desc": "Master interoperable data exchange, converting Python dicts to JSON strings and parsing JSON payloads safely.",
    "syllabus": [
      "json.dumps() for serialization and json.loads() for deserialization",
      "Formatting with indent and sort_keys",
      "Handling JSONDecodeError on corrupted input payloads"
    ],
    "eTitle": "Safe JSON Payload Decoder with Validation",
    "eDesc": "Write a Python function `decode_user_payload(json_str: str) -> dict` returning parsed dict if valid and contains 'user_id', else returning `{'error': 'INVALID_PAYLOAD'}`.",
    "eStarter": "import json\n\ndef decode_user_payload(json_str: str) -> dict:\n    # Parse JSON safely\n    pass\n",
    "eHint": "try: data = json.loads(json_str); return data if 'user_id' in data else {'error': 'INVALID_PAYLOAD'} except Exception: return {'error': 'INVALID_PAYLOAD'}",
    "eTest": "import json\nassert decode_user_payload('{\"user_id\": 101, \"name\": \"Alex\"}') == {'user_id': 101, 'name': 'Alex'}, 'Test 1 Failed'\nassert decode_user_payload('{\"name\": \"NoId\"}') == {'error': 'INVALID_PAYLOAD'}, 'Test 2 Failed'\nassert decode_user_payload('bad json') == {'error': 'INVALID_PAYLOAD'}, 'Test 3 Failed'\nprint('All 3 assertions passed.')",
    "aTitle": "Configuration Serializer with Sorting",
    "aDesc": "Write a Python function `serialize_config(config_dict: dict) -> str` that serializes config_dict to a sorted JSON string without indentation.",
    "aStarter": "import json\n\ndef serialize_config(config_dict: dict) -> str:\n    # Return sorted JSON string\n    pass\n",
    "aHint": "return json.dumps(config_dict, sort_keys=True)",
    "aTest": "import json\nassert serialize_config({'b': 2, 'a': 1}) == '{\"a\": 1, \"b\": 2}', 'Test 1 Failed'\nprint('All 1 assertions passed.')"
  },
  {
    "title": "Decorators, Higher-Order Functions & Lambda Expressions",
    "desc": "Master meta-programming in Python: treating functions as first-class citizens, creating wrapper decorators, and anonymous lambdas.",
    "syllabus": [
      "First-class functions and closures",
      "Writing function decorators with @functools.wraps",
      "Anonymous lambda functions and map()/filter()"
    ],
    "eTitle": "Execution Logger Decorator",
    "eDesc": "Implement a decorator `@log_execution` that modifies a function to return a dict `{'result': <output>, 'function': <func_name>}`.",
    "eStarter": "def log_execution(func):\n    def wrapper(*args, **kwargs):\n        res = func(*args, **kwargs)\n        return {'result': res, 'function': func.__name__}\n    return wrapper\n",
    "eHint": "Call func(*args, **kwargs) inside wrapper and return dict.",
    "eTest": "@log_execution\ndef add(a, b):\n    return a + b\n\nassert add(3, 4) == {'result': 7, 'function': 'add'}, 'Test 1 Failed'\nprint('All 1 assertions passed.')",
    "aTitle": "Lambda Sort by Nested Value",
    "aDesc": "Write a Python function `sort_products_by_price(products: list) -> list` sorting a list of dicts `[{'name': 'a', 'price': 10}]` by price ascending using a lambda.",
    "aStarter": "def sort_products_by_price(products: list) -> list:\n    # Return sorted copy of products by price\n    pass\n",
    "aHint": "return sorted(products, key=lambda p: p['price'])",
    "aTest": "prods = [{'name': 'B', 'price': 30}, {'name': 'A', 'price': 10}]\nassert sort_products_by_price(prods) == [{'name': 'A', 'price': 10}, {'name': 'B', 'price': 30}], 'Test 1 Failed'\nprint('All 1 assertions passed.')"
  },
  {
    "title": "⭐ MILESTONE 5: Word Frequency & Inverted Index Search Engine",
    "desc": "Synthesize text parsing, dictionary hashing, frequency ranking, and inverted indexing into a search engine indexer.",
    "syllabus": [
      "Text tokenization, lowercasing, and punctuation stripping",
      "Building an inverted document index (word -> set of doc_ids)",
      "Milestone Project: Full-Text Mini Search Engine"
    ],
    "eTitle": "Inverted Document Index Builder",
    "eDesc": "Write a Python function `build_inverted_index(docs: dict) -> dict` where docs is `{doc_id: 'text string'}`. Return dict mapping each word (lowercase, stripped) to sorted list of doc_ids where it appears.",
    "eStarter": "def build_inverted_index(docs: dict) -> dict:\n    # Build inverted index\n    pass\n",
    "eHint": "index = {}; for doc_id, text in docs.items(): for w in set(text.lower().split()): index.setdefault(w, []).append(doc_id); return {k: sorted(v) for k, v in index.items()}",
    "eTest": "docs = {1: 'Python is great', 2: 'Great systems use Python'}\nidx = build_inverted_index(docs)\nassert idx['python'] == [1, 2], 'Test 1 Failed'\nassert idx['systems'] == [2], 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "Top-K Word Frequency Ranker",
    "aDesc": "Write a Python function `top_k_words(text: str, k: int) -> list` returning the top `k` most frequent lowercase words as a list of `(word, count)` tuples sorted by count descending.",
    "aStarter": "def top_k_words(text: str, k: int) -> list:\n    # Return top k word tuples\n    pass\n",
    "aHint": "from collections import Counter; return Counter(text.lower().split()).most_common(k)",
    "aTest": "res = top_k_words('apple banana apple apple banana cherry', 2)\nassert res == [('apple', 3), ('banana', 2)], 'Test 1 Failed'\nprint('All 1 assertions passed.')"
  },
  {
    "title": "Asynchronous Python (async, await & asyncio Event Loops)",
    "desc": "Master asynchronous concurrency, non-blocking I/O, coroutines with async/await, and gathering tasks with asyncio.",
    "syllabus": [
      "Synchronous blocking vs Asynchronous non-blocking event loops",
      "Defining coroutines with async def and awaiting with await",
      "Running concurrent tasks with asyncio.gather()"
    ],
    "eTitle": "Async Coroutine Aggregator",
    "eDesc": "Write an async Python function `fetch_all_metrics(coros: list) -> list` that executes a list of coroutines concurrently using `asyncio.gather`.",
    "eStarter": "import asyncio\n\nasync def fetch_all_metrics(coros: list) -> list:\n    # Await and gather all coroutines\n    pass\n",
    "eHint": "return await asyncio.gather(*coros)",
    "eTest": "import asyncio\n\nasync def sample(x):\n    return x * 2\n\nasync def runner():\n    res = await fetch_all_metrics([sample(1), sample(2), sample(3)])\n    assert res == [2, 4, 6], 'Test 1 Failed'\n\nasyncio.run(runner())\nprint('All 1 assertions passed.')",
    "aTitle": "Async Rate-Limited Task Runner",
    "aDesc": "Write an async Python function `run_with_delay(val: int) -> int` that awaits asyncio.sleep(0.01) and returns val * 10.",
    "aStarter": "import asyncio\n\nasync def run_with_delay(val: int) -> int:\n    # Await sleep then return result\n    pass\n",
    "aHint": "await asyncio.sleep(0.01); return val * 10",
    "aTest": "import asyncio\n\nasync def runner():\n    res = await run_with_delay(5)\n    assert res == 50, 'Test 1 Failed'\n\nasyncio.run(runner())\nprint('All 1 assertions passed.')"
  },
  {
    "title": "Modern Type Hints, Static Typing & Pydantic Data Models",
    "desc": "Write production-grade, self-documenting Python using PEP 484 type hints, Optional/Union types, and schema validation.",
    "syllabus": [
      "Type annotations: int, str, list[str], dict[str, Any]",
      "Optional[T] and Union[A, B] from typing",
      "Data validation principles and type safety in backend services"
    ],
    "eTitle": "Typed User Record Validator",
    "eDesc": "Write a Python function `validate_user_record(record: dict) -> bool` returning True if record contains 'id' (int), 'email' (str containing '@'), and 'is_active' (bool), else False.",
    "eStarter": "def validate_user_record(record: dict) -> bool:\n    # Validate dictionary structure and types\n    pass\n",
    "eHint": "Check isinstance for all 3 fields and '@' in record['email'].",
    "eTest": "assert validate_user_record({'id': 1, 'email': 'a@b.com', 'is_active': True}) == True, 'Test 1 Failed'\nassert validate_user_record({'id': '1', 'email': 'a@b.com', 'is_active': True}) == False, 'Test 2 Failed'\nassert validate_user_record({'id': 2, 'email': 'bad', 'is_active': True}) == False, 'Test 3 Failed'\nprint('All 3 assertions passed.')",
    "aTitle": "Typed API Query Parameter Formatter",
    "aDesc": "Write a Python function `build_query_string(params: dict) -> str` returning a URL query string like '?key1=val1&key2=val2' with sorted keys, or '' if empty.",
    "aStarter": "def build_query_string(params: dict) -> str:\n    # Return formatted URL query string\n    pass\n",
    "aHint": "if not params: return ''; return '?' + '&'.join(f'{k}={params[k]}' for k in sorted(params.keys()))",
    "aTest": "assert build_query_string({'limit': 10, 'offset': 0}) == '?limit=10&offset=0', 'Test 1 Failed'\nassert build_query_string({}) == '', 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "Web API Architecture with FastAPI & HTTP Route Controllers",
    "desc": "Master modern RESTful backend services, HTTP methods (GET, POST), request payloads, and status codes in FastAPI.",
    "syllabus": [
      "Client-server HTTP request/response cycle",
      "FastAPI app instance and route decorators (@app.get, @app.post)",
      "Handling query parameters, path parameters, and JSON response bodies"
    ],
    "eTitle": "HTTP Status Code & Route Response Builder",
    "eDesc": "Write a Python function `build_api_response(status_code: int, data: dict = None, error_msg: str = None) -> dict` returning `{'status': status_code, 'data': data, 'error': error_msg}`.",
    "eStarter": "def build_api_response(status_code: int, data: dict = None, error_msg: str = None) -> dict:\n    # Return structured API response dictionary\n    pass\n",
    "eHint": "Return {'status': status_code, 'data': data, 'error': error_msg}",
    "eTest": "assert build_api_response(200, {'id': 1}) == {'status': 200, 'data': {'id': 1}, 'error': None}, 'Test 1 Failed'\nassert build_api_response(404, error_msg='Not Found') == {'status': 404, 'data': None, 'error': 'Not Found'}, 'Test 2 Failed'\nprint('All 2 assertions passed.')",
    "aTitle": "API Route Endpoint Path Parser",
    "aDesc": "Write a Python function `extract_path_params(route_template: str, actual_path: str) -> dict` extracting `{param}` from matching paths (e.g. '/users/{id}' and '/users/42' -> `{'id': '42'}`).",
    "aStarter": "def extract_path_params(route_template: str, actual_path: str) -> dict:\n    # Extract path parameters\n    pass\n",
    "aHint": "Zip template parts and actual parts; if part starts with '{' and ends with '}': key = part[1:-1]; params[key] = actual_part",
    "aTest": "assert extract_path_params('/users/{id}', '/users/42') == {'id': '42'}, 'Test 1 Failed'\nassert extract_path_params('/items/{category}/{id}', '/items/books/101') == {'category': 'books', 'id': '101'}, 'Test 2 Failed'\nprint('All 2 assertions passed.')"
  },
  {
    "title": "🏆 FINAL CAPSTONE: Enterprise High-Performance Transaction Ledger Auditor & Backend API",
    "desc": "The ultimate synthesis of PinIT Python Backend Engineering: end-to-end Ledger Transaction Auditor, balance reconciler, defensive anomaly detector, and metric summary generator.",
    "syllabus": [
      "End-to-end domain entity architecture",
      "Transaction reconciliation and audit reporting",
      "Final Capstone Certification Project"
    ],
    "eTitle": "Final Capstone: Ledger Transaction Auditor Engine",
    "eDesc": "Implement `LedgerAuditor` with `__init__(self, initial_balance: float)`, `add_transaction(self, tx_type: str, amount: float, category: str)`, `reconcile_balance(self) -> float`, and `generate_audit_report(self) -> dict` returning `{'final_balance': float, 'total_credits': float, 'total_debits': float, 'transaction_count': int}`.",
    "eStarter": "class LedgerAuditor:\n    def __init__(self, initial_balance: float = 0.0):\n        self.initial_balance = initial_balance\n        self.transactions = []\n\n    def add_transaction(self, tx_type: str, amount: float, category: str):\n        if amount <= 0:\n            raise ValueError('Amount must be positive')\n        if tx_type not in ('CREDIT', 'DEBIT'):\n            raise ValueError('Invalid transaction type')\n        self.transactions.append({'type': tx_type, 'amount': amount, 'category': category})\n\n    def reconcile_balance(self) -> float:\n        bal = self.initial_balance\n        for t in self.transactions:\n            if t['type'] == 'CREDIT':\n                bal += t['amount']\n            else:\n                bal -= t['amount']\n        return round(bal, 2)\n\n    def generate_audit_report(self) -> dict:\n        credits = sum(t['amount'] for t in self.transactions if t['type'] == 'CREDIT')\n        debits = sum(t['amount'] for t in self.transactions if t['type'] == 'DEBIT')\n        return {\n            'final_balance': self.reconcile_balance(),\n            'total_credits': round(credits, 2),\n            'total_debits': round(debits, 2),\n            'transaction_count': len(self.transactions)\n        }\n",
    "eHint": "Reconcile balance by adding CREDIT and subtracting DEBIT; calculate totals in report.",
    "eTest": "auditor = LedgerAuditor(1000.0)\nauditor.add_transaction('CREDIT', 500.0, 'SALARY')\nauditor.add_transaction('DEBIT', 200.0, 'GROCERIES')\nassert auditor.reconcile_balance() == 1300.0, 'Test 1 Failed'\nrep = auditor.generate_audit_report()\nassert rep == {'final_balance': 1300.0, 'total_credits': 500.0, 'total_debits': 200.0, 'transaction_count': 2}, 'Test 2 Failed'\ntry:\n    auditor.add_transaction('INVALID', 10.0, 'TEST')\n    assert False, 'Test 3 Failed'\nexcept ValueError:\n    pass\nprint('All 3 assertions passed.')",
    "aTitle": "Final Capstone: Account Balance Reconciler & Category Filter",
    "aDesc": "Write a Python function `reconcile_ledger_by_category(initial_balance: float, transactions: list, filter_category: str) -> dict` returning net balance after applying only transactions of that category, plus count of transactions processed.",
    "aStarter": "def reconcile_ledger_by_category(initial_balance: float, transactions: list, filter_category: str) -> dict:\n    # Filter and reconcile transactions by category\n    pass\n",
    "aHint": "bal = initial_balance; count = 0; for t in transactions: if t['category'] == filter_category: bal += t['amount'] if t['type'] == 'CREDIT' else -t['amount']; count += 1; return {'filtered_balance': round(bal, 2), 'processed_count': count}",
    "aTest": "txs = [{'type': 'CREDIT', 'amount': 100.0, 'category': 'TECH'}, {'type': 'DEBIT', 'amount': 30.0, 'category': 'TECH'}, {'type': 'DEBIT', 'amount': 50.0, 'category': 'FOOD'}]\nres = reconcile_ledger_by_category(500.0, txs, 'TECH')\nassert res == {'filtered_balance': 570.0, 'processed_count': 2}, 'Test 1 Failed'\nprint('All 1 assertions passed.')"
  }
];

export const PYTHON_30_DAYS_QUESTS: CourseQuest[] = PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('python', idx + 1, cfg)
);
