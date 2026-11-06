"""
PinIT Career OS — Python Course Puzzles: Days 16–30
====================================================
Hand-crafted code-block puzzles covering:
  Day 16  Working With Files
  Day 17  JSON: Saving Structured Data
  Day 18  Classes and Objects
  Day 19  Better Classes: __str__ and Inheritance
  Day 20  Python on Your Laptop: Scripts, input() and pip
  Day 21  Testing Your Code with assert and pytest
  Day 22  Git and GitHub: Saving and Sharing Your Code
  Day 23  Planning Your Expense Tracker
  Day 24  Project Build 1: Adding and Listing Expenses
  Day 25  Project Build 2: Summaries and Saving
  Day 26  Calling Web APIs
  Day 27  Building Your Own API with FastAPI
  Day 28  Debugging: Reading Tracebacks
  Day 29  Putting Your API Online
  Day 30  Interview Practice and Your Next Steps

Each puzzle dict carries blocks in CORRECT order; the UI shuffles them.
"""

PUZZLES = [
    # ── Day 16: Working With Files ──────────────────────────────────────
    {
        "day": 16,
        "title": "Grocery List Writer",
        "mission": (
            "Use an in-memory file to write three grocery items, one per "
            "line, then read them back and print each item in uppercase. "
            "This simulates real file I/O without touching the disk."
        ),
        "labels": [
            "Import StringIO",
            "Create the virtual file",
            "Write three items",
            "Seek back to the start",
            "Read and print each line uppercase",
        ],
        "blocks": [
            "import io",
            "f = io.StringIO()",
            "f.write('eggs\\nbread\\nmilk\\n')",
            "f.seek(0)",
            "for line in f:\n    print(line.strip().upper())",
        ],
        "decoys": [
            (
                "f.read(0)",
                "read(0) reads zero bytes — it does NOT reset the cursor. "
                "You need f.seek(0) to go back to the beginning of the file."
            ),
            (
                "for line in f:\n    print(line.upper())",
                "Forgetting .strip() leaves the trailing newline, so each "
                "printed line gets an extra blank line between items."
            ),
        ],
        "output": "EGGS\nBREAD\nMILK",
        "hint": "After writing to a file, the cursor sits at the end. Use seek(0) to rewind before reading.",
        "success": "File I/O mastered! You can read and write like a pro — even in memory.",
    },

    # ── Day 17: JSON — Saving Structured Data ───────────────────────────
    {
        "day": 17,
        "title": "Settings Saver",
        "mission": (
            "Build a settings dictionary, convert it to a JSON string, then "
            "parse it back and print the theme value. This mirrors how apps "
            "save and load config files."
        ),
        "labels": [
            "Import json",
            "Create settings dict",
            "Dump to JSON string",
            "Load it back into a Python dict",
            "Print the theme",
        ],
        "blocks": [
            "import json",
            "settings = {'theme': 'dark', 'font_size': 14}",
            "json_str = json.dumps(settings)",
            "loaded = json.loads(json_str)",
            "print(loaded['theme'])",
        ],
        "decoys": [
            (
                "json_str = json.dump(settings)",
                "json.dump() writes to a FILE object, not a string. "
                "Use json.dumps() (with the 's' for 'string') to get a string."
            ),
            (
                "loaded = json.load(json_str)",
                "json.load() reads from a FILE object. "
                "Use json.loads() to parse a JSON string directly."
            ),
        ],
        "output": "dark",
        "hint": "dumps/loads work with strings; dump/load work with file objects. The 's' stands for 'string'.",
        "success": "JSON ninja! You can serialize and deserialize data like a real back-end developer.",
    },

    # ── Day 18: Classes and Objects ─────────────────────────────────────
    {
        "day": 18,
        "title": "Pet Creator",
        "mission": (
            "Define a Pet class with a name and species, then add a speak() "
            "method that prints a greeting. Create a pet and make it speak."
        ),
        "labels": [
            "Define the class and __init__",
            "Store attributes",
            "Define the speak method",
            "Create an instance",
            "Call speak",
        ],
        "blocks": [
            "class Pet:",
            "    def __init__(self, name, species):\n        self.name = name\n        self.species = species",
            "    def speak(self):\n        print(f'Hi! I am {self.name} the {self.species}.')",
            "buddy = Pet('Buddy', 'dog')",
            "buddy.speak()",
        ],
        "decoys": [
            (
                "    def speak():\n        print(f'Hi! I am {self.name} the {self.species}.')",
                "Methods must include 'self' as the first parameter. "
                "Without it, Python cannot access the object's attributes."
            ),
            (
                "buddy = Pet('Buddy')",
                "The __init__ method requires both name AND species. "
                "Passing only one argument causes a TypeError."
            ),
        ],
        "output": "Hi! I am Buddy the dog.",
        "hint": "Every method inside a class needs 'self' as its first parameter so it can access the object's data.",
        "success": "You just brought Buddy to life! Object-oriented programming unlocked.",
    },

    # ── Day 19: Better Classes — __str__ and Inheritance ────────────────
    {
        "day": 19,
        "title": "Shape Inheritance",
        "mission": (
            "Create a Shape base class with a color attribute and __str__, "
            "then make a Circle subclass that adds a radius and overrides "
            "__str__ to include it. Print the circle."
        ),
        "labels": [
            "Define Shape base class with __init__ and __str__",
            "Define Circle subclass header",
            "Circle __init__ with super()",
            "Circle __str__ override",
            "Create and print",
        ],
        "blocks": [
            "class Shape:\n    def __init__(self, color):\n        self.color = color\n    def __str__(self):\n        return f'{self.color} shape'",
            "class Circle(Shape):",
            "    def __init__(self, color, radius):\n        super().__init__(color)\n        self.radius = radius",
            "    def __str__(self):\n        return f'{self.color} circle with radius {self.radius}'",
            "print(Circle('red', 5))",
        ],
        "decoys": [
            (
                "    def __init__(self, color, radius):\n        self.color = color\n        self.radius = radius",
                "This skips super().__init__(), duplicating the parent's "
                "logic. Always call super() to let the parent set its own "
                "attributes — that's the whole point of inheritance."
            ),
            (
                "class Circle(object):",
                "Circle should inherit from Shape, not object. "
                "Inheriting from object means you lose Shape's color logic."
            ),
        ],
        "output": "red circle with radius 5",
        "hint": "Use super().__init__() inside the child class to call the parent's constructor before adding new attributes.",
        "success": "Inheritance and __str__ conquered! Your classes now print beautifully.",
    },

    # ── Day 20: Python on Your Laptop — Scripts, input() and pip ────────
    {
        "day": 20,
        "title": "Greeting Script",
        "mission": (
            "Simulate a command-line script that takes a user's name, "
            "greets them, and prints the Python version. We mock input() "
            "and sys.version for deterministic output."
        ),
        "labels": [
            "Set up mock name",
            "Build greeting",
            "Print the greeting",
            "Set a mock version string",
            "Print version info",
        ],
        "blocks": [
            "name = 'Alice'",
            "greeting = f'Hello, {name}! Welcome to Python.'",
            "print(greeting)",
            "mock_version = '3.12.0'",
            "print(f'Running Python {mock_version}')",
        ],
        "decoys": [
            (
                "name = input('Enter name: ')",
                "In a puzzle environment there is no live terminal, so "
                "input() would hang forever. Use a hardcoded value instead."
            ),
            (
                "print(f'Running Python {sys.version}')",
                "sys.version includes build details that change per machine. "
                "Use a mock string for deterministic, testable output."
            ),
        ],
        "output": "Hello, Alice! Welcome to Python.\nRunning Python 3.12.0",
        "hint": "When writing testable scripts, you can substitute input() with a fixed value so the output never changes.",
        "success": "You can build real scripts that run on any laptop. Time to pip install the world!",
    },

    # ── Day 21: Testing Your Code with assert and pytest ────────────────
    {
        "day": 21,
        "title": "Test the Adder",
        "mission": (
            "Write a simple add() function, then write two test functions "
            "using assert to verify it works for positive numbers and "
            "negative numbers. Print a final message if all tests pass."
        ),
        "labels": [
            "Define the add function",
            "Test with positive numbers",
            "Test with negative numbers",
            "Test with zero",
            "Print success",
        ],
        "blocks": [
            "def add(a, b):\n    return a + b",
            "def test_add_positive():\n    assert add(2, 3) == 5",
            "def test_add_negative():\n    assert add(-1, -4) == -5",
            "def test_add_zero():\n    assert add(0, 7) == 7",
            "test_add_positive()\ntest_add_negative()\ntest_add_zero()\nprint('All 3 tests passed!')",
        ],
        "decoys": [
            (
                "def test_add_positive():\n    assert add(2, 3) = 5",
                "A single '=' is assignment, not comparison. "
                "Use '==' inside assert to compare values."
            ),
            (
                "def test_add_positive():\n    add(2, 3) == 5",
                "Without assert, this comparison runs but is silently "
                "discarded. The test would never catch a bug."
            ),
        ],
        "output": "All 3 tests passed!",
        "hint": "assert checks a condition and crashes with AssertionError if it's False. Always use == for comparison.",
        "success": "Your code is tested and trustworthy! Professional developers test everything.",
    },

    # ── Day 22: Git and GitHub ──────────────────────────────────────────
    {
        "day": 22,
        "title": "Mini Version Tracker",
        "mission": (
            "Build a tiny version-control simulation: a list of commits, "
            "a function to add a commit, and a function to show the log. "
            "This mirrors how Git tracks your project history."
        ),
        "labels": [
            "Initialize commit history",
            "Define the commit function",
            "Define the log function",
            "Make two commits",
            "Show the log",
        ],
        "blocks": [
            "history = []",
            "def commit(message):\n    history.append(message)\n    print(f'Committed: {message}')",
            "def log():\n    print('--- Git Log ---')\n    for i, msg in enumerate(history, 1):\n        print(f'  {i}. {msg}')",
            "commit('Initial commit')\ncommit('Add README')",
            "log()",
        ],
        "decoys": [
            (
                "def commit(message):\n    history = [message]",
                "This creates a LOCAL variable called history, shadowing "
                "the global list. The append never reaches the real history."
            ),
            (
                "def log():\n    for msg in history:\n        print(msg)",
                "This prints without numbering or a header, so the output "
                "won't match the expected formatted log."
            ),
        ],
        "output": "Committed: Initial commit\nCommitted: Add README\n--- Git Log ---\n  1. Initial commit\n  2. Add README",
        "hint": "Think of Git commits as a growing list. Each commit appends to the history, and git log shows them all.",
        "success": "You just built Git (well, a tiny one)! Now you understand commits and history.",
    },

    # ── Day 23: Planning Your Expense Tracker ───────────────────────────
    {
        "day": 23,
        "title": "Expense Schema Designer",
        "mission": (
            "Design the data model for an expense tracker: create an Expense "
            "class with category, amount, and description, plus a method "
            "to display it as a formatted string. Then create and print one."
        ),
        "labels": [
            "Define the Expense class header",
            "Write __init__ with three fields",
            "Write the display method",
            "Create a sample expense",
            "Display it",
        ],
        "blocks": [
            "class Expense:",
            "    def __init__(self, category, amount, description):\n        self.category = category\n        self.amount = amount\n        self.description = description",
            "    def display(self):\n        return f'[{self.category}] {self.description}: ${self.amount:.2f}'",
            "lunch = Expense('Food', 12.5, 'Lunch at cafe')",
            "print(lunch.display())",
        ],
        "decoys": [
            (
                "    def display(self):\n        return f'[{category}] {description}: ${amount:.2f}'",
                "Inside a method you must use self.category, self.amount, "
                "etc. Without 'self.', Python looks for local variables "
                "that don't exist and raises a NameError."
            ),
            (
                "lunch = Expense('Food', 'twelve fifty', 'Lunch at cafe')",
                "The amount should be a number (12.5), not a string. "
                "The :.2f format spec only works on numeric types."
            ),
        ],
        "output": "[Food] Lunch at cafe: $12.50",
        "hint": "Always reference instance attributes with self. inside methods. And keep amounts as numbers, not strings!",
        "success": "Your expense tracker has a solid data model. Time to start building!",
    },

    # ── Day 24: Project Build 1 — Adding and Listing Expenses ───────────
    {
        "day": 24,
        "title": "Expense List Manager",
        "mission": (
            "Build an ExpenseTracker class that can add expenses and list "
            "them all. Add two expenses and then print the full list."
        ),
        "labels": [
            "Define ExpenseTracker with empty list",
            "Define add_expense method",
            "Define list_expenses method",
            "Add two expenses",
            "List all expenses",
        ],
        "blocks": [
            "class ExpenseTracker:\n    def __init__(self):\n        self.expenses = []",
            "    def add_expense(self, category, amount, desc):\n        self.expenses.append({'cat': category, 'amt': amount, 'desc': desc})\n        print(f'Added: {desc} (${amount:.2f})')",
            "    def list_expenses(self):\n        print('--- All Expenses ---')\n        for e in self.expenses:\n            print(f\"  {e['cat']}: {e['desc']} - ${e['amt']:.2f}\")",
            "tracker = ExpenseTracker()\ntracker.add_expense('Food', 8.99, 'Coffee')\ntracker.add_expense('Transport', 2.50, 'Bus fare')",
            "tracker.list_expenses()",
        ],
        "decoys": [
            (
                "class ExpenseTracker:\n    expenses = []",
                "A class-level list is SHARED between all instances. "
                "Define it inside __init__ with self.expenses = [] so each "
                "tracker gets its own independent list."
            ),
            (
                "    def add_expense(self, category, amount, desc):\n        self.expenses = {'cat': category, 'amt': amount, 'desc': desc}",
                "This REPLACES the entire list with a single dict each time. "
                "Use .append() to add to the existing list."
            ),
        ],
        "output": "Added: Coffee ($8.99)\nAdded: Bus fare ($2.50)\n--- All Expenses ---\n  Food: Coffee - $8.99\n  Transport: Bus fare - $2.50",
        "hint": "Always initialize mutable attributes (like lists) inside __init__, not at the class level.",
        "success": "Your tracker can add and list expenses! That's a working MVP.",
    },

    # ── Day 25: Project Build 2 — Summaries and Saving ──────────────────
    {
        "day": 25,
        "title": "Expense Summary & Export",
        "mission": (
            "Extend an expense list with a summary function that calculates "
            "the total, and an export function that converts everything to "
            "a JSON string. Print the summary and the JSON."
        ),
        "labels": [
            "Import json and set up data",
            "Define the summary function",
            "Define the export function",
            "Print the summary",
            "Print the exported JSON",
        ],
        "blocks": [
            "import json\n\nexpenses = [\n    {'cat': 'Food', 'amt': 8.99, 'desc': 'Coffee'},\n    {'cat': 'Transport', 'amt': 2.50, 'desc': 'Bus fare'},\n]",
            "def summary(data):\n    total = sum(e['amt'] for e in data)\n    return f'Total: ${total:.2f} across {len(data)} expenses'",
            "def export_json(data):\n    return json.dumps(data, indent=2)",
            "print(summary(expenses))",
            "print(export_json(expenses))",
        ],
        "decoys": [
            (
                "def summary(data):\n    total = sum(data['amt'])\n    return f'Total: ${total:.2f}'",
                "data is a LIST of dicts, not a single dict. You need a "
                "generator expression: sum(e['amt'] for e in data)."
            ),
            (
                "def export_json(data):\n    return str(data)",
                "str() gives Python repr syntax (single quotes, etc.), "
                "NOT valid JSON. Use json.dumps() for proper JSON output."
            ),
        ],
        "output": (
            'Total: $11.49 across 2 expenses\n'
            '[\n'
            '  {\n'
            '    "cat": "Food",\n'
            '    "amt": 8.99,\n'
            '    "desc": "Coffee"\n'
            '  },\n'
            '  {\n'
            '    "cat": "Transport",\n'
            '    "amt": 2.5,\n'
            '    "desc": "Bus fare"\n'
            '  }\n'
            ']'
        ),
        "hint": "json.dumps() with indent=2 gives you pretty-printed, valid JSON — perfect for saving to a file.",
        "success": "Summaries and data export done! Your expense tracker is feature-complete.",
    },

    # ── Day 26: Calling Web APIs ────────────────────────────────────────
    {
        "day": 26,
        "title": "Weather API Parser",
        "mission": (
            "Simulate calling a weather API: define a mock JSON response, "
            "parse it, and display a formatted weather report. This is "
            "exactly how you'd handle real requests.get() data."
        ),
        "labels": [
            "Import json",
            "Define mock API response",
            "Parse the JSON",
            "Extract and format the data",
            "Print the report",
        ],
        "blocks": [
            "import json",
            "mock_response = '{\"city\": \"Tokyo\", \"temp_c\": 22, \"condition\": \"Sunny\"}'",
            "weather = json.loads(mock_response)",
            "report = f\"{weather['city']}: {weather['temp_c']}°C, {weather['condition']}\"",
            "print(report)",
        ],
        "decoys": [
            (
                "weather = json.dumps(mock_response)",
                "dumps() converts Python TO a JSON string — the opposite "
                "direction. Use json.loads() to parse a string INTO Python."
            ),
            (
                "report = f'{weather.city}: {weather.temp_c}°C'",
                "weather is a dict, not an object. Use square-bracket "
                "notation: weather['city'], not dot notation."
            ),
        ],
        "output": "Tokyo: 22°C, Sunny",
        "hint": "API responses come as JSON strings. Use json.loads() to turn them into Python dicts you can work with.",
        "success": "You can parse API data! The entire internet's data is now at your fingertips.",
    },

    # ── Day 27: Building Your Own API with FastAPI ──────────────────────
    {
        "day": 27,
        "title": "Book Catalog API",
        "mission": (
            "Define a mock FastAPI-style route handler: create a list of "
            "books, write a function that returns them as a dict response, "
            "and simulate calling the endpoint. Print the JSON result."
        ),
        "labels": [
            "Import json",
            "Define the book catalog",
            "Write the route handler function",
            "Simulate calling the endpoint",
            "Print the response",
        ],
        "blocks": [
            "import json",
            "books = [\n    {'id': 1, 'title': 'Python 101', 'author': 'Al'},\n    {'id': 2, 'title': 'Data Science', 'author': 'Bo'},\n]",
            "def get_books():\n    return {'status': 'ok', 'count': len(books), 'books': books}",
            "response = get_books()",
            "print(json.dumps(response, indent=2))",
        ],
        "decoys": [
            (
                "def get_books():\n    return books",
                "A real API wraps data in a response envelope with status "
                "and metadata. Returning a bare list misses the count and "
                "status fields the client expects."
            ),
            (
                "print(response)",
                "Printing the raw dict uses Python syntax (single quotes). "
                "APIs return JSON, so use json.dumps() for valid output."
            ),
        ],
        "output": (
            '{\n'
            '  "status": "ok",\n'
            '  "count": 2,\n'
            '  "books": [\n'
            '    {\n'
            '      "id": 1,\n'
            '      "title": "Python 101",\n'
            '      "author": "Al"\n'
            '    },\n'
            '    {\n'
            '      "id": 2,\n'
            '      "title": "Data Science",\n'
            '      "author": "Bo"\n'
            '    }\n'
            '  ]\n'
            '}'
        ),
        "hint": "Think of an API endpoint as a function that returns a dictionary. FastAPI converts it to JSON automatically.",
        "success": "You just designed an API endpoint! FastAPI makes this even easier in real projects.",
    },

    # ── Day 28: Debugging — Reading Tracebacks ──────────────────────────
    {
        "day": 28,
        "title": "Bug Squasher",
        "mission": (
            "Write a function that safely divides two numbers, catching "
            "ZeroDivisionError and TypeError. Test it with good input, "
            "zero, and a string to prove your error handling works."
        ),
        "labels": [
            "Define the safe_divide function header",
            "Try the division",
            "Catch division by zero",
            "Catch type errors",
            "Run three test cases",
        ],
        "blocks": [
            "def safe_divide(a, b):",
            "    try:\n        result = a / b\n        return f'{a} / {b} = {result}'",
            "    except ZeroDivisionError:\n        return f'Error: cannot divide {a} by zero'",
            "    except TypeError:\n        return f'Error: invalid types for division'",
            "print(safe_divide(10, 3))\nprint(safe_divide(5, 0))\nprint(safe_divide('x', 2))",
        ],
        "decoys": [
            (
                "    except:\n        return 'Something went wrong'",
                "A bare except catches ALL exceptions silently, hiding "
                "the actual problem. Always catch specific exception types "
                "so you can give a helpful error message."
            ),
            (
                "    except ZeroDivisionError:\n        pass",
                "'pass' swallows the error silently and returns None. "
                "The function should return a useful error message instead."
            ),
        ],
        "output": "10 / 3 = 3.3333333333333335\nError: cannot divide 5 by zero\nError: invalid types for division",
        "hint": "Catch specific exceptions (ZeroDivisionError, TypeError) to give targeted, helpful error messages.",
        "success": "You debug like a detective! Tracebacks are clues, not curses.",
    },

    # ── Day 29: Putting Your API Online ─────────────────────────────────
    {
        "day": 29,
        "title": "Deployment Checklist Validator",
        "mission": (
            "Build a deployment-readiness checker: define a checklist of "
            "requirements, validate each one, and print a status report. "
            "This mirrors the checks you'd run before deploying an API."
        ),
        "labels": [
            "Define the checklist",
            "Define the validator function",
            "Run the validator",
            "Print the summary",
            "Print the final verdict",
        ],
        "blocks": [
            "checklist = {\n    'tests_pass': True,\n    'env_vars_set': True,\n    'requirements_txt': True,\n    'debug_mode_off': False,\n}",
            "def validate(checks):\n    results = []\n    for name, status in checks.items():\n        icon = '✓' if status else '✗'\n        results.append(f'  {icon} {name}')\n    return results, all(checks.values())",
            "results, ready = validate(checklist)",
            "print('Deployment Checklist:')\nfor r in results:\n    print(r)",
            "print(f'Ready to deploy: {ready}')",
        ],
        "decoys": [
            (
                "def validate(checks):\n    for name, status in checks:\n        icon = '✓' if status else '✗'",
                "Iterating over a dict directly gives only keys, not "
                "(key, value) pairs. Use .items() to unpack both."
            ),
            (
                "print(f'Ready to deploy: {any(checklist.values())}')",
                "any() returns True if ANY check passes. You need all() — "
                "every single item must be True before deploying."
            ),
        ],
        "output": "Deployment Checklist:\n  ✓ tests_pass\n  ✓ env_vars_set\n  ✓ requirements_txt\n  ✗ debug_mode_off\nReady to deploy: False",
        "hint": "all() returns True only if EVERY value is True. One False means the deployment isn't ready.",
        "success": "Smart deploy! You know to check every box before going live.",
    },

    # ── Day 30: Interview Practice and Your Next Steps ──────────────────
    {
        "day": 30,
        "title": "FizzBuzz Champion",
        "mission": (
            "Solve the classic FizzBuzz interview question: print numbers "
            "1-15, but replace multiples of 3 with 'Fizz', multiples of 5 "
            "with 'Buzz', and multiples of both with 'FizzBuzz'."
        ),
        "labels": [
            "Start the loop",
            "Check divisible by both 3 and 5",
            "Check divisible by 3 only",
            "Check divisible by 5 only",
            "Print the number otherwise",
        ],
        "blocks": [
            "for n in range(1, 16):",
            "    if n % 3 == 0 and n % 5 == 0:\n        print('FizzBuzz')",
            "    elif n % 3 == 0:\n        print('Fizz')",
            "    elif n % 5 == 0:\n        print('Buzz')",
            "    else:\n        print(n)",
        ],
        "decoys": [
            (
                "    if n % 3 == 0:\n        print('Fizz')\n    elif n % 5 == 0:\n        print('Buzz')\n    elif n % 3 == 0 and n % 5 == 0:\n        print('FizzBuzz')",
                "The order matters! Checking % 3 first catches 15 as 'Fizz' "
                "before the combined check ever runs. Always test the most "
                "specific condition (both 3 AND 5) first."
            ),
            (
                "    if n % 3 == 0 and n % 5 == 0:\n        print('FizzBuzz')\n    if n % 3 == 0:\n        print('Fizz')",
                "Using 'if' instead of 'elif' means BOTH conditions can "
                "trigger. FizzBuzz numbers would also print 'Fizz' on a "
                "separate line."
            ),
        ],
        "output": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
        "hint": "Test the most specific condition first (divisible by BOTH 3 and 5), then use elif for the rest.",
        "success": "FizzBuzz crushed! You're interview-ready. Go build amazing things! 🚀",
    },
]
