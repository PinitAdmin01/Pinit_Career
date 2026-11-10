import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

/**
 * 1-Month Python course (course-python-backend): from a first print() to a small web API online.
 *
 * Week 1: Python basics. Week 2: working with data (lists, dictionaries). Week 3: building
 * programs (modules, files, JSON, classes, testing). Week 4: Git, the month project, web APIs,
 * debugging, deploying and interview practice.
 *
 * Month project: an Expense Tracker (add expenses, see totals by category, save them, then serve
 * them from a small FastAPI web API).
 * Practice tasks are small Python functions checked with assert. They never use input(), because
 * the browser cannot type into a running program; input() is taught for the laptop on Day 20.
 *
 * Quest ids (python-lecture1/exam/assign-day-N) are unchanged, so saved progress stays valid.
 */
const lines = (...l: string[]) => l.join('\n');
const done = "print('All checks passed.')";

export const PYTHON_30_DAYS_CONFIGS: DayConfig[] = [
  // ── WEEK 1: Python basics ─────────────────────────────────────────────────
  {
    title: "Your First Python Program",
    desc: "Python is a programming language known for being easy to read. It is used for websites, automation, data analysis and AI. Today you run your first lines of Python and learn how Python reads your code. (Real world: Instagram's servers and YouTube's tools use Python.)",
    syllabus: [
      "What Python is and what people build with it.",
      "print() and running code line by line.",
      "Comments with # and why capital letters matter."
    ],
    eTitle: "Your App's Title",
    eDesc: "Print the title of your Expense Tracker: `'My Expense Tracker'`. Use `print()` to show the exact text on the screen.",
    eStarter: lines("# Print the title of your app on the screen", ""),
    eHint: 'print("My Expense Tracker")',
    eTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('page_title')",
      "_res = None",
      "try:",
      "    if callable(_fn): _res = _fn()",
      "    else: _res = globals().get('page_title')",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_all_text = ' '.join(_printed) + ' ' + str(_res or '') + ' ' + str(_cap)",
      "assert 'My Expense Tracker' in _all_text, \"Expected 'My Expense Tracker' to be printed or returned\"",
      done
    ),
    aTitle: "Say Hello",
    aDesc: "Welcome your user! Print `'Hello, Asha!'` to the screen using `print()`. (Or define a function `say_hello(name)`).",
    aStarter: lines("# Print a greeting to Asha on the screen", ""),
    aHint: 'print("Hello, Asha!")',
    aTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('say_hello')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn('Asha'); _val2 = _fn('Ravi')",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_cap)",
      "assert (_val1 == 'Hello, Asha' and _val2 == 'Hello, Ravi') or ('Asha' in _all_text and 'Hello' in _all_text), \"Expected 'Hello, Asha!' to be printed or returned\"",
      done
    )
  },
  {
    title: "Variables and Data Types",
    desc: "A variable is a labelled box that stores a value. Python has a few basic kinds of values: text (str), whole numbers (int), decimal numbers (float) and True/False (bool). (Real world: a shopping app keeps your cart total in a variable.)",
    syllabus: [
      "Creating and changing variables.",
      "str, int, float and bool, and checking them with type().",
      "Turning numbers into text with str() and text into numbers with int() and float()."
    ],
    eTitle: "Describe an Expense",
    eDesc: "Store an item and amount in variables, and print a description! Create item = 'Tea' and amount = 20, and print 'Tea costs 20' (using str() to convert the number). (Or define a function describe_expense(item, amount)).",
    eStarter: lines(
      'item = "Tea"',
      'amount = 20',
      '# Print "Tea costs 20" below using item, amount, and str()',
      ''
    ),
    eHint: 'print(item + " costs " + str(amount))',
    eTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('describe_expense')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn('Tea', 20)",
      "        _val2 = _fn('Bus ticket', 45)",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_cap)",
      "_fn_ok = (_val1 == 'Tea costs 20' and _val2 == 'Bus ticket costs 45') or ('Tea costs 20' in _all_text and 'Bus ticket costs 45' in _all_text)",
      "_script_ok = 'Tea costs 20' in _all_text or ('Tea' in _all_text and 'costs' in _all_text and '20' in _all_text)",
      "assert _fn_ok or _script_ok, \"Expected 'Tea costs 20' to be printed or returned\"",
      done
    ),
    aTitle: "Is It a Big Expense?",
    aDesc: "Check if an expense is big (1000 or more). Create amount = 1200 and is_big = amount >= 1000, then print is_big. (Or define a function is_big_expense(amount)).",
    aStarter: lines(
      'amount = 1200',
      '# Set is_big = amount >= 1000 and print it below',
      ''
    ),
    aHint: 'is_big = amount >= 1000\\nprint(is_big)',
    aTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('is_big_expense')",
      "_val1 = None; _val2 = None; _val3 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn(1000)",
      "        _val2 = _fn(2500)",
      "        _val3 = _fn(999)",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_var_big = globals().get('is_big')",
      "_all_text = ' '.join(_printed) + ' ' + str(_cap)",
      "_fn_ok = (_val1 is True and _val2 is True and _val3 is False) or (callable(_fn) and 'True' in ' '.join(_printed) and 'False' in ' '.join(_printed))",
      "_script_ok = (_var_big is True or 'True' in _all_text) and ('is_big' in globals() or 'True' in _printed or 'True' in str(_cap))",
      "assert _fn_ok or _script_ok, \"Expected is_big to be True when amount >= 1000\"",
      done
    )
  },
  {
    title: "Working With Text",
    desc: "Text in Python is called a string. You will join strings, count their letters, pick out single characters, and change them with built-in tools like upper() and strip(). (Real world: apps clean up the names people type before saving them.)",
    syllabus: [
      "Joining strings and repeating them.",
      "len(), and picking characters by position.",
      "String tools: upper(), lower(), strip(), replace()."
    ],
    eTitle: "Shout It (Working With Text)",
    eDesc: "Convert text to capital letters and add an exclamation mark! Create text = 'sale' and print 'SALE!' using upper() and + '!'. (Or define a function shout(text)).",
    eStarter: lines(
      'text = "sale"',
      '# Print text in capital letters with "!" at the end using upper() and +',
      ''
    ),
    eHint: 'print(text.upper() + "!")',
    eTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('shout')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn('sale')",
      "        _val2 = _fn('Hi')",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_var_shout = globals().get('shout') if not callable(_fn) else None",
      "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_var_shout or '') + ' ' + str(_cap)",
      "_fn_ok = (_val1 == 'SALE!' and _val2 == 'HI!') or ('SALE!' in _all_text and 'HI!' in _all_text)",
      "_script_ok = 'SALE!' in _all_text",
      "assert _fn_ok or _script_ok, \"Expected 'SALE!' to be printed or returned\"",
      done
    ),
    aTitle: "Initials (Working With Text)",
    aDesc: "Get the initials of two names in capital letters! Create first = 'asha' and last = 'rao', and print 'AR' by taking first[0] and last[0] and using upper(). (Or define a function initials(first, last)).",
    aStarter: lines(
      'first = "asha"',
      'last = "rao"',
      '# Print the initials in capitals (e.g. "AR") using [0], +, and upper()',
      ''
    ),
    aHint: 'print((first[0] + last[0]).upper())',
    aTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('initials')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn('asha', 'rao')",
      "        _val2 = _fn('Ravi', 'kumar')",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_var_init = globals().get('initials') if not callable(_fn) else None",
      "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_var_init or '') + ' ' + str(_cap)",
      "_fn_ok = (_val1 == 'AR' and _val2 == 'RK') or ('AR' in _all_text and 'RK' in _all_text)",
      "_script_ok = 'AR' in _all_text",
      "assert _fn_ok or _script_ok, \"Expected initials 'AR' to be printed or returned\"",
      done
    )
  },
  {
    title: "Numbers and Maths",
    desc: "Python is an excellent calculator. You will use +, -, *, /, and two special operators: // for dividing without the decimal part, and % for the remainder. You will also round money to 2 decimal places. (Real world: every bill, discount and GST calculation.)",
    syllabus: [
      "+, -, *, / and the order of operations.",
      "// (floor division) and % (remainder).",
      "round() and why 0.1 + 0.2 is not exactly 0.3."
    ],
    eTitle: "Add GST",
    eDesc: "Calculate the price with 18% GST added, rounded to 2 decimal places! Create price = 100 and print the total (118.0) using round(price * 1.18, 2). (Or define a function add_gst(price)).",
    eStarter: lines(
      'price = 100',
      '# Calculate price + 18% GST, round to 2 decimal places, and print it below',
      ''
    ),
    eHint: 'print(round(price * 1.18, 2))',
    eTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('add_gst')",
      "_val1 = None; _val2 = None; _val3 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn(100)",
      "        _val2 = _fn(250)",
      "        _val3 = _fn(99.99)",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_var_res = globals().get('add_gst') if not callable(_fn) else None",
      "_var_total = globals().get('total')",
      "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_val3 or '') + ' ' + str(_var_res or '') + ' ' + str(_var_total or '') + ' ' + str(_cap)",
      "_fn_ok = (_val1 == 118.0 and _val2 == 295.0 and _val3 == 117.99) or ('118' in _all_text and '295' in _all_text)",
      "_script_ok = '118.0' in _all_text or '118' in _all_text",
      "assert _fn_ok or _script_ok, \"Expected 118.0 to be printed or returned\"",
      done
    ),
    aTitle: "Split the Bill",
    aDesc: "Split a bill among friends and round each share to 2 decimal places! Create total = 1000 and people = 4, and print each person's share (250.0) using round(total / people, 2). (Or define a function split_bill(total, people)).",
    aStarter: lines(
      'total = 1000',
      'people = 4',
      '# Calculate each share using round(total / people, 2) and print it below',
      ''
    ),
    aHint: 'print(round(total / people, 2))',
    aTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('split_bill')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn(1000, 4)",
      "        _val2 = _fn(100, 3)",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_var_res = globals().get('split_bill') if not callable(_fn) else None",
      "_var_share = globals().get('share')",
      "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_var_res or '') + ' ' + str(_var_share or '') + ' ' + str(_cap)",
      "_fn_ok = (_val1 == 250.0 and _val2 == 33.33) or ('250' in _all_text and '33.33' in _all_text)",
      "_script_ok = '250.0' in _all_text or '250' in _all_text",
      "assert _fn_ok or _script_ok, \"Expected 250.0 to be printed or returned\"",
      done
    )
  },
  {
    title: "Making Decisions",
    desc: "Programs make choices: free delivery above a bill amount, a warning when you overspend. You will use if, elif and else, and combine conditions with and, or and not. Python uses indentation, the spaces at the start of a line, to know which lines belong to an if. (Real world: a food app deciding the delivery fee.)",
    syllabus: [
      "Comparisons: ==, !=, <, >, <=, >=.",
      "if, elif, else and indentation.",
      "and, or, not."
    ],
    eTitle: "Pass or Fail",
    eDesc: "Decide if a score is a Pass or a Fail! Create score = 40 and print 'Pass' if the score is 40 or more, otherwise print 'Fail'. (Or define a function grade(score)).",
    eStarter: lines(
      'score = 40',
      '# Print "Pass" if score >= 40, otherwise print "Fail" using if and else',
      ''
    ),
    eHint: 'if score >= 40:\\n    print("Pass")\\nelse:\\n    print("Fail")',
    eTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('grade')",
      "_val1 = None; _val2 = None; _val3 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn(40)",
      "        _val2 = _fn(85)",
      "        _val3 = _fn(39)",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_var_grade = globals().get('grade') if not callable(_fn) else None",
      "_var_result = globals().get('result')",
      "_all_text = ' '.join(_printed) + ' ' + str(_val1 or '') + ' ' + str(_val2 or '') + ' ' + str(_val3 or '') + ' ' + str(_var_grade or '') + ' ' + str(_var_result or '') + ' ' + str(_cap)",
      "_fn_ok = (_val1 == 'Pass' and _val2 == 'Pass' and _val3 == 'Fail') or ('Pass' in _all_text and 'Fail' in _all_text)",
      "_script_ok = 'Pass' in _all_text and ('Pass' in _printed or 'Pass' in str(_cap) or _var_grade == 'Pass' or _var_result == 'Pass')",
      "assert _fn_ok or _script_ok, \"Expected 'Pass' to be printed or returned\"",
      done
    ),
    aTitle: "Delivery Fee",
    aDesc: "Calculate the delivery fee for a bill! Create bill = 499 and print 0 if the bill is 499 or more, otherwise print 40. (Or define a function delivery_fee(bill)).",
    aStarter: lines(
      'bill = 499',
      '# Print 0 if bill >= 499, otherwise print 40 using if and else',
      ''
    ),
    aHint: 'if bill >= 499:\\n    print(0)\\nelse:\\n    print(40)',
    aTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('delivery_fee')",
      "_val1 = None; _val2 = None; _val3 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn(499)",
      "        _val2 = _fn(1200)",
      "        _val3 = _fn(300)",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_var_fee = globals().get('fee')",
      "_var_del = globals().get('delivery_fee') if not callable(_fn) else None",
      "_all_text = ' '.join(_printed) + ' ' + str(_val1 if _val1 is not None else '') + ' ' + str(_val2 if _val2 is not None else '') + ' ' + str(_val3 if _val3 is not None else '') + ' ' + str(_var_fee if _var_fee is not None else '') + ' ' + str(_var_del if _var_del is not None else '') + ' ' + str(_cap)",
      "_fn_ok = (_val1 == 0 and _val2 == 0 and _val3 == 40) or (callable(_fn) and '0' in _all_text and '40' in _all_text)",
      "_script_ok = ('0' in _all_text or _var_fee == 0 or _var_del == 0) and ('fee' in globals() or '0' in _printed or '0' in str(_cap))",
      "assert _fn_ok or _script_ok, \"Expected delivery fee 0 to be printed or returned\"",
      done
    )
  },
  {
    title: "Loops: Doing Things Again and Again",
    desc: "Loops repeat work. A for loop goes through every item in a list or every number in a range. A while loop repeats as long as a condition is true. You will also learn the accumulator pattern: start a total at 0 and add to it in the loop. (Real world: adding up every item in your cart.)",
    syllabus: [
      "for loops with lists and range().",
      "The accumulator pattern: totals and counts.",
      "while loops, and how to avoid endless loops."
    ],
    eTitle: "Add Them Up",
    eDesc: "Add up all numbers in a list using a for loop and the accumulator pattern! Create amounts = [20, 45, 100] and print the sum (165). (Or define a function total(amounts)).",
    eStarter: lines(
      'amounts = [20, 45, 100]',
      'result = 0',
      '# Loop over amounts, add each to result, and print result below',
      ''
    ),
    eHint: 'for amount in amounts:\\n    result = result + amount\\nprint(result)',
    eTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('total')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn([20, 45, 100])",
      "        _val2 = _fn([])",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_var_res = globals().get('result')",
      "_var_tot = globals().get('total') if not callable(_fn) else None",
      "_all_text = ' '.join(_printed) + ' ' + str(_val1 if _val1 is not None else '') + ' ' + str(_val2 if _val2 is not None else '') + ' ' + str(_var_res if _var_res is not None else '') + ' ' + str(_var_tot if _var_tot is not None else '') + ' ' + str(_cap)",
      "_fn_ok = (_val1 == 165 and _val2 == 0) or (callable(_fn) and '165' in _all_text and '0' in _all_text)",
      "_script_ok = ('165' in _all_text or _var_res == 165 or _var_tot == 165) and ('165' in _printed or '165' in str(_cap) or _var_res == 165)",
      "assert _fn_ok or _script_ok, \"Expected 165 to be printed or returned\"",
      done
    ),
    aTitle: "Count the Big Ones",
    aDesc: "Count how many amounts are greater than a limit using a for loop and an if! Create amounts = [100, 500, 1200, 50] and limit = 400, and print the count (2). (Or define a function count_above(amounts, limit)).",
    aStarter: lines(
      'amounts = [100, 500, 1200, 50]',
      'limit = 400',
      'count = 0',
      '# Loop over amounts, add 1 to count if amount > limit, and print count below',
      ''
    ),
    aHint: 'for amount in amounts:\\n    if amount > limit:\\n        count = count + 1\\nprint(count)',
    aTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('count_above')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn([100, 500, 1200, 50], 400)",
      "        _val2 = _fn([], 10)",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_var_count = globals().get('count')",
      "_var_ca = globals().get('count_above') if not callable(_fn) else None",
      "_all_text = ' '.join(_printed) + ' ' + str(_val1 if _val1 is not None else '') + ' ' + str(_val2 if _val2 is not None else '') + ' ' + str(_var_count if _var_count is not None else '') + ' ' + str(_var_ca if _var_ca is not None else '') + ' ' + str(_cap)",
      "_fn_ok = (_val1 == 2 and _val2 == 0) or (callable(_fn) and '2' in _all_text and '0' in _all_text)",
      "_script_ok = ('2' in _all_text or _var_count == 2 or _var_ca == 2) and ('2' in _printed or '2' in str(_cap) or _var_count == 2)",
      "assert _fn_ok or _script_ok, \"Expected count 2 to be printed or returned\"",
      done
    )
  },
  {
    title: "Functions: Your Own Tools",
    desc: "A function is a named set of steps you write once and use many times. It takes inputs (parameters) and gives back an answer with return. Good functions do one job and have clear names. (Real world: a calculate_gst function used on every bill in a shop app.)",
    syllabus: [
      "def, parameters and return.",
      "Default values for parameters.",
      "Why return is different from print."
    ],
    eTitle: "Average",
    eDesc: "Write `average(numbers)` that returns the average of the list rounded to 2 places, or 0 for an empty list.",
    eStarter: lines("def average(numbers):", "    # Handle the empty list first", "    pass"),
    eHint: "if not numbers: return 0. Otherwise return round(sum(numbers) / len(numbers), 2)",
    eTest: lines("assert average([10, 20, 30]) == 20.0", "assert average([1, 2]) == 1.5", "assert average([]) == 0, 'An empty list should give 0'", done),
    aTitle: "Greeting With a Default",
    aDesc: "Write `greet(name, greeting='Hello')` that returns text like `'Hello, Asha!'`. If a greeting is given, use it instead.",
    aStarter: lines("def greet(name, greeting='Hello'):", "    # Join greeting, ', ', name and '!'", "    pass"),
    aHint: "return greeting + ', ' + name + '!'",
    aTest: lines("assert greet('Asha') == 'Hello, Asha!'", "assert greet('Ravi', 'Namaste') == 'Namaste, Ravi!'", done)
  },

  // ── WEEK 2: Working with data ─────────────────────────────────────────────
  {
    title: "Lists: Keeping Many Values Together",
    desc: "A list keeps many values in order, like a shopping list. You can read items by position (starting at 0), add items, remove items and count them. (Real world: your recent transactions in a banking app are a list.)",
    syllabus: [
      "Creating lists and reading items by position, including negative positions.",
      "append(), remove(), len() and in.",
      "Slicing: taking part of a list with [start:stop]."
    ],
    eTitle: "First and Last",
    eDesc: "Write `first_and_last(items)` that returns a new list with the first and the last item.",
    eStarter: lines("def first_and_last(items):", "    # items[-1] is the last item", "    pass"),
    eHint: "return [items[0], items[-1]]",
    eTest: lines("assert first_and_last(['a', 'b', 'c', 'd']) == ['a', 'd'], 'Expected [a, d]'", done),
    aTitle: "Add Without Changing",
    aDesc: "Write `add_item(items, item)` that returns a NEW list with the item at the end. The original list must not change.",
    aStarter: lines("def add_item(items, item):", "    # items + [item] makes a new list", "    pass"),
    aHint: "return items + [item]",
    aTest: lines("original = ['Tea']", "result = add_item(original, 'Bus')", "assert result == ['Tea', 'Bus']", "assert original == ['Tea'], 'The original list was changed'", done)
  },
  {
    title: "Looping Over Lists and List Comprehensions",
    desc: "Most work with lists means doing something for every item: changing each one, or keeping only some. Python has a short, popular way to do this called a list comprehension. (Real world: showing only this month's expenses.)",
    syllabus: [
      "for loops over lists, and enumerate() for positions.",
      "List comprehensions: [x * 2 for x in numbers].",
      "Filtering: [x for x in numbers if x > 100]."
    ],
    eTitle: "Double Everything",
    eDesc: "Write `double_all(numbers)` that returns a new list with every number doubled, using a list comprehension.",
    eStarter: lines("def double_all(numbers):", "    # [ ... for n in numbers]", "    pass"),
    eHint: "return [n * 2 for n in numbers]",
    eTest: lines("assert double_all([1, 2, 3]) == [2, 4, 6]", "assert double_all([]) == []", done),
    aTitle: "Only the Big Ones",
    aDesc: "Write `above(numbers, limit)` that returns only the numbers greater than the limit.",
    aStarter: lines("def above(numbers, limit):", "    # [n for n in numbers if ...]", "    pass"),
    aHint: "return [n for n in numbers if n > limit]",
    aTest: lines("assert above([100, 500, 1200, 50], 400) == [500, 1200]", "assert above([1, 2], 5) == []", done)
  },
  {
    title: "Dictionaries: Named Details",
    desc: "A dictionary stores values under names called keys, like a form with labelled fields. You read a value by its key, add new keys, and use get() to avoid errors when a key is missing. (Real world: a product's name, price and stock in a shopping app.)",
    syllabus: [
      "Creating dictionaries and reading values by key.",
      "Adding and changing keys; get() with a default.",
      "Looping over keys, values and items()."
    ],
    eTitle: "Make an Expense",
    eDesc: "Write `make_expense(item, amount, category)` that returns a dictionary with the keys `'item'`, `'amount'` and `'category'`.",
    eStarter: lines("def make_expense(item, amount, category):", "    # return { ... }", "    pass"),
    eHint: "return {'item': item, 'amount': amount, 'category': category}",
    eTest: lines("e = make_expense('Tea', 20, 'food')", "assert e == {'item': 'Tea', 'amount': 20, 'category': 'food'}, 'Wrong dictionary'", done),
    aTitle: "Price Lookup",
    aDesc: "Write `price_of(prices, item)` that returns the item's price from the dictionary, or 0 if the item is not there.",
    aStarter: lines("def price_of(prices, item):", "    # Use prices.get(...)", "    pass"),
    aHint: "return prices.get(item, 0)",
    aTest: lines("prices = {'tea': 20, 'coffee': 40}", "assert price_of(prices, 'coffee') == 40", "assert price_of(prices, 'juice') == 0", done)
  },
  {
    title: "Lists of Dictionaries: Real Data",
    desc: "Real app data is usually a list of dictionaries: a list of expenses, where each expense is a dictionary. Today you add up, filter and search this kind of data, exactly what your Expense Tracker will do. (Real world: every API answer you will ever read looks like this.)",
    syllabus: [
      "Reading values: expenses[0]['amount'].",
      "Totals and filters over a list of dictionaries.",
      "sum() with a comprehension."
    ],
    eTitle: "Total Spent",
    eDesc: "Write `total_spent(expenses)` that returns the sum of every expense's `'amount'`.",
    eStarter: lines("def total_spent(expenses):", "    # sum(... for e in expenses)", "    pass"),
    eHint: "return sum(e['amount'] for e in expenses)",
    eTest: lines("data = [{'item': 'Tea', 'amount': 20}, {'item': 'Bus', 'amount': 45}]", "assert total_spent(data) == 65", "assert total_spent([]) == 0", done),
    aTitle: "One Category",
    aDesc: "Write `by_category(expenses, category)` that returns only the expenses in that category.",
    aStarter: lines("def by_category(expenses, category):", "    # keep e when e['category'] == category", "    pass"),
    aHint: "return [e for e in expenses if e['category'] == category]",
    aTest: lines("data = [{'item': 'Tea', 'category': 'food'}, {'item': 'Bus', 'category': 'travel'}, {'item': 'Lunch', 'category': 'food'}]", "result = by_category(data, 'food')", "assert [e['item'] for e in result] == ['Tea', 'Lunch']", done)
  },
  {
    title: "Tuples and Sets",
    desc: "Two more ways to group values. A tuple is like a list that cannot be changed, good for fixed pairs like (latitude, longitude). A set keeps only unique values, perfect for removing duplicates. (Real world: finding the different categories you spent money on.)",
    syllabus: [
      "Tuples: creating, reading and unpacking.",
      "Sets: unique values, add() and in.",
      "When to use a list, tuple, set or dictionary."
    ],
    eTitle: "Unique Categories",
    eDesc: "Write `unique_categories(expenses)` that returns the different categories, sorted A to Z, as a list.",
    eStarter: lines("def unique_categories(expenses):", "    # a set removes duplicates; sorted() gives a sorted list", "    pass"),
    eHint: "return sorted({e['category'] for e in expenses})",
    eTest: lines("data = [{'category': 'food'}, {'category': 'travel'}, {'category': 'food'}]", "assert unique_categories(data) == ['food', 'travel']", done),
    aTitle: "Smallest and Largest",
    aDesc: "Write `min_max(numbers)` that returns a tuple `(smallest, largest)`.",
    aStarter: lines("def min_max(numbers):", "    # return (..., ...)", "    pass"),
    aHint: "return (min(numbers), max(numbers))",
    aTest: lines("assert min_max([40, 10, 90]) == (10, 90)", "assert min_max([5]) == (5, 5)", done)
  },
  {
    title: "f-strings: Clean, Readable Output",
    desc: "f-strings are the modern way to put values into text: f'Total: {total}'. They can also format numbers, like showing exactly 2 decimal places or lining up columns. (Real world: printing a neat receipt.)",
    syllabus: [
      "f'...' with {values} and expressions inside.",
      "Number formats: {amount:.2f} and {n:,}.",
      "Lining up text with {name:<10} and {amount:>8}."
    ],
    eTitle: "Show Money",
    eDesc: "Write `money(amount)` that returns text like `'Rs 1250.50'`, always with 2 decimal places.",
    eStarter: lines("def money(amount):", "    # f'Rs {amount:.2f}'", "    pass"),
    eHint: "return f'Rs {amount:.2f}'",
    eTest: lines("assert money(1250.5) == 'Rs 1250.50', 'Expected Rs 1250.50'", "assert money(20) == 'Rs 20.00'", done),
    aTitle: "Receipt Line",
    aDesc: "Write `receipt_line(item, amount)` that returns the item padded to 10 characters on the left, then the amount right-aligned in 8 characters with 2 decimals. Example: `receipt_line('Tea', 20)` returns `'Tea          20.00'`.",
    aStarter: lines("def receipt_line(item, amount):", "    # f'{item:<10}{amount:>8.2f}'", "    pass"),
    aHint: "return f'{item:<10}{amount:>8.2f}'",
    aTest: lines("assert receipt_line('Tea', 20) == 'Tea          20.00', repr(receipt_line('Tea', 20))", "assert len(receipt_line('Lunch', 150.5)) == 18", done)
  },
  {
    title: "Errors and try/except",
    desc: "Things go wrong: a user types 'abc' where a number was expected, or divides by zero. Instead of crashing, a good program catches the error with try and except and handles it calmly. (Real world: a payment form that says 'Please enter a valid amount' instead of crashing.)",
    syllabus: [
      "Reading an error message: its type and line.",
      "try and except for specific errors.",
      "else, finally, and raising your own errors."
    ],
    eTitle: "Safe Number",
    eDesc: "Write `safe_int(text)` that returns the text as a whole number, or 0 if it is not a valid number.",
    eStarter: lines("def safe_int(text):", "    try:", "        # convert with int()", "        pass", "    except ValueError:", "        pass"),
    eHint: "try: return int(text) / except ValueError: return 0",
    eTest: lines("assert safe_int('42') == 42", "assert safe_int('abc') == 0", "assert safe_int('') == 0", done),
    aTitle: "Safe Divide",
    aDesc: "Write `safe_divide(a, b)` that returns `a / b`, or `None` when `b` is 0.",
    aStarter: lines("def safe_divide(a, b):", "    # catch ZeroDivisionError", "    pass"),
    aHint: "try: return a / b / except ZeroDivisionError: return None",
    aTest: lines("assert safe_divide(10, 4) == 2.5", "assert safe_divide(1, 0) is None", done)
  },

  // ── WEEK 3: Building programs ─────────────────────────────────────────────
  {
    title: "Modules and Python's Built-in Library",
    desc: "Python comes with a huge library of ready-made tools called modules. You import what you need: math for maths, random for random choices, datetime for dates. You can also split your own code into modules. (Real world: apps use datetime for every 'due date' and 'last seen'.)",
    syllabus: [
      "import and from ... import ...",
      "math, random and datetime.",
      "Your own modules, and if __name__ == '__main__'."
    ],
    eTitle: "Circle Area",
    eDesc: "Write `circle_area(r)` that returns the area of a circle (pi times r squared), rounded to 2 decimal places, using the math module.",
    eStarter: lines("import math", "", "def circle_area(r):", "    # math.pi * r * r", "    pass"),
    eHint: "return round(math.pi * r * r, 2)",
    eTest: lines("assert circle_area(1) == 3.14", "assert circle_area(2) == 12.57", done),
    aTitle: "Days Between Dates",
    aDesc: "Write `days_between(start, end)` where both are dates as text like `'2026-09-01'`. Return how many days are between them.",
    aStarter: lines("from datetime import date", "", "def days_between(start, end):", "    # date.fromisoformat(...) turns text into a date", "    pass"),
    aHint: "return (date.fromisoformat(end) - date.fromisoformat(start)).days",
    aTest: lines("assert days_between('2026-09-01', '2026-09-28') == 27", "assert days_between('2026-01-01', '2026-01-01') == 0", done)
  },
  {
    title: "Working With Files",
    desc: "Programs forget everything when they stop, unless they save to a file. You will write text to files and read it back with open() and the with statement, which closes the file safely. You will use a simple format: one expense per line, like 'Tea,20'. (Real world: apps export your data as CSV files for Excel.)",
    syllabus: [
      "open() with 'w', 'a' and 'r', and why we use with.",
      "Writing and reading lines.",
      "Splitting a line like 'Tea,20' into parts."
    ],
    eTitle: "Read One Line",
    eDesc: "Write `parse_line(line)` that turns text like `'Tea,20'` into a tuple `('Tea', 20)` with the amount as a whole number. Ignore spaces and the newline at the end.",
    eStarter: lines("def parse_line(line):", "    # strip(), then split(',')", "    pass"),
    eHint: "item, amount = line.strip().split(','); return (item.strip(), int(amount))",
    eTest: lines("assert parse_line('Tea,20') == ('Tea', 20)", "assert parse_line(' Bus ticket , 45 \\n') == ('Bus ticket', 45)", done),
    aTitle: "Write One Line",
    aDesc: "Write `to_line(item, amount)` that returns the line to save, like `'Tea,20'`.",
    aStarter: lines("def to_line(item, amount):", "    # f'{item},{amount}'", "    pass"),
    aHint: "return f'{item},{amount}'",
    aTest: lines("assert to_line('Tea', 20) == 'Tea,20'", "assert to_line('Bus', 45) == 'Bus,45'", done)
  },
  {
    title: "JSON: Saving Structured Data",
    desc: "JSON is the standard text format for data on the internet and in files. Python's json module turns lists and dictionaries into JSON text with dumps(), and back with loads(). It is how your Expense Tracker will save its data, and how APIs talk. (Real world: every app's settings and API answers.)",
    syllabus: [
      "json.dumps() and json.loads().",
      "Saving and loading a list of dictionaries to a file.",
      "Handling broken or missing data safely."
    ],
    eTitle: "To JSON",
    eDesc: "Write `to_json(expenses)` that returns the list as JSON text using json.dumps.",
    eStarter: lines("import json", "", "def to_json(expenses):", "    pass"),
    eHint: "return json.dumps(expenses)",
    eTest: lines("assert to_json([{'item': 'Tea', 'amount': 20}]) == '[{\"item\": \"Tea\", \"amount\": 20}]'", done),
    aTitle: "Safe Load",
    aDesc: "Write `load_expenses(text)` that turns JSON text into a list, and returns `[]` if the text is broken, empty, or not a list.",
    aStarter: lines("import json", "", "def load_expenses(text):", "    try:", "        # json.loads, then check it is a list", "        pass", "    except ValueError:", "        return []"),
    aHint: "data = json.loads(text); return data if isinstance(data, list) else []",
    aTest: lines("assert load_expenses('[{\"item\": \"Tea\"}]') == [{'item': 'Tea'}]", "assert load_expenses('broken{') == []", "assert load_expenses('{\"a\": 1}') == []", "assert load_expenses('') == []", done)
  },
  {
    title: "Classes and Objects",
    desc: "A class is a blueprint for creating objects that keep data and actions together. An Expense class can hold an item and an amount, and know how to describe itself. Most large Python programs and libraries are built from classes. (Real world: a Wallet object that knows its balance and can pay.)",
    syllabus: [
      "class, __init__ and self.",
      "Attributes: data inside an object.",
      "Methods: functions that belong to an object."
    ],
    eTitle: "An Expense Class",
    eDesc: "Write a class `Expense` with `item` and `amount`, and a method `label()` that returns text like `'Tea: 20'`.",
    eStarter: lines("class Expense:", "    def __init__(self, item, amount):", "        # save item and amount on self", "        pass", "", "    def label(self):", "        pass"),
    eHint: "self.item = item; self.amount = amount; label returns f'{self.item}: {self.amount}'",
    eTest: lines("e = Expense('Tea', 20)", "assert e.item == 'Tea' and e.amount == 20", "assert e.label() == 'Tea: 20'", done),
    aTitle: "A Wallet",
    aDesc: "Write a class `Wallet` that starts with a `balance`. Its method `spend(amount)` subtracts the amount and returns `True`, or returns `False` and changes nothing if there is not enough money.",
    aStarter: lines("class Wallet:", "    def __init__(self, balance):", "        self.balance = balance", "", "    def spend(self, amount):", "        pass"),
    aHint: "if amount > self.balance: return False. Otherwise subtract and return True.",
    aTest: lines("w = Wallet(100)", "assert w.spend(30) is True and w.balance == 70", "assert w.spend(500) is False and w.balance == 70", done)
  },
  {
    title: "Better Classes: __str__ and Inheritance",
    desc: "Make your objects print nicely with __str__, and build new classes from existing ones with inheritance: a Subscription is an Expense that repeats every month. (Real world: Netflix and gym fees are subscriptions.)",
    syllabus: [
      "__str__ for readable printing.",
      "Inheritance: class Subscription(Expense).",
      "super() and adding new methods to a child class."
    ],
    eTitle: "Printable Expense",
    eDesc: "Write a class `Expense` whose `str()` looks like `'Tea (Rs 20)'`.",
    eStarter: lines("class Expense:", "    def __init__(self, item, amount):", "        self.item = item", "        self.amount = amount", "", "    def __str__(self):", "        pass"),
    eHint: "return f'{self.item} (Rs {self.amount})'",
    eTest: lines("assert str(Expense('Tea', 20)) == 'Tea (Rs 20)'", done),
    aTitle: "Subscription",
    aDesc: "Given an `Expense` class with `item` and `amount`, write `Subscription(Expense)` with a method `yearly_cost()` that returns amount times 12.",
    aStarter: lines("class Expense:", "    def __init__(self, item, amount):", "        self.item = item", "        self.amount = amount", "", "class Subscription(Expense):", "    def yearly_cost(self):", "        pass"),
    aHint: "return self.amount * 12",
    aTest: lines("s = Subscription('Music app', 99)", "assert s.item == 'Music app'", "assert s.yearly_cost() == 1188", "assert isinstance(s, Expense)", done)
  },
  {
    title: "Python on Your Laptop: Scripts, input() and pip",
    desc: "Today you set up Python on your own laptop, write .py files in VS Code, run them from the terminal, read what the user types with input(), and install packages with pip inside a virtual environment. (Real world: every Python job starts with this setup.)",
    syllabus: [
      "Installing Python and VS Code; running python file.py.",
      "input() and turning what users type into numbers.",
      "pip, virtual environments and requirements.txt."
    ],
    eTitle: "Clean Up Typed Amounts",
    eDesc: "People type amounts with spaces. Write `parse_amount(text)` that removes spaces and returns the amount as a float, or `None` if it is not a number.",
    eStarter: lines("def parse_amount(text):", "    # strip(), then float(), inside try/except", "    pass"),
    eHint: "try: return float(text.strip()) / except ValueError: return None",
    eTest: lines("assert parse_amount(' 250 ') == 250.0", "assert parse_amount('99.5') == 99.5", "assert parse_amount('abc') is None", done),
    aTitle: "Menu Choice",
    aDesc: "Write `menu_choice(text)` that returns the number 1, 2 or 3 when the user typed one of them, otherwise `None`.",
    aStarter: lines("def menu_choice(text):", "    # compare text.strip() with '1', '2', '3'", "    pass"),
    aHint: "value = text.strip(); return int(value) if value in ('1', '2', '3') else None",
    aTest: lines("assert menu_choice('2') == 2", "assert menu_choice(' 3 ') == 3", "assert menu_choice('7') is None", "assert menu_choice('x') is None", done)
  },
  {
    title: "Testing Your Code with assert and pytest",
    desc: "Tests are small programs that check your code works, so you can change it without fear. You will write checks with assert and use pytest, the most popular Python testing tool. (Real world: companies run thousands of tests before every release.)",
    syllabus: [
      "assert and clear failure messages.",
      "Writing test_ functions and running pytest.",
      "Testing normal cases and edge cases."
    ],
    eTitle: "Valid Amount",
    eDesc: "Write `is_valid_amount(value)` that returns `True` only for numbers greater than 0 (int or float, not bool or text).",
    eStarter: lines("def is_valid_amount(value):", "    # isinstance(value, (int, float)), not bool, and > 0", "    pass"),
    eHint: "return isinstance(value, (int, float)) and not isinstance(value, bool) and value > 0",
    eTest: lines("assert is_valid_amount(20) is True", "assert is_valid_amount(9.5) is True", "assert is_valid_amount(0) is False", "assert is_valid_amount('20') is False", "assert is_valid_amount(True) is False", done),
    aTitle: "Your Own Check",
    aDesc: "Write `check_equal(actual, expected)` that returns `True` when they are equal and raises `AssertionError` with the message `'Expected X but got Y'` when they are not.",
    aStarter: lines("def check_equal(actual, expected):", "    # raise AssertionError(...) when different", "    pass"),
    aHint: "if actual != expected: raise AssertionError(f'Expected {expected} but got {actual}'); return True",
    aTest: lines("assert check_equal(2, 2) is True", "try:", "    check_equal(1, 2)", "    raised = False", "except AssertionError as err:", "    raised = 'Expected 2 but got 1' in str(err)", "assert raised, 'Should raise Expected 2 but got 1'", done)
  },

  // ── WEEK 4: Build, ship and get job-ready ─────────────────────────────────
  {
    title: "Git and GitHub: Saving and Sharing Your Code",
    desc: "Every developer job uses Git. It saves snapshots of your code (commits), lets you try ideas on branches, and GitHub stores your code online so recruiters can see it. (Real world: every change to this app is a Git commit.)",
    syllabus: [
      "git init, add, commit and good commit messages.",
      "Branches: working on a feature safely.",
      "Pushing to GitHub; a .gitignore for Python projects."
    ],
    eTitle: "Good Commit Message",
    eDesc: "Write `is_good_commit_message(msg)` that returns `True` when the message is between 10 and 72 characters long.",
    eStarter: lines("def is_good_commit_message(msg):", "    pass"),
    eHint: "return 10 <= len(msg) <= 72",
    eTest: lines("assert is_good_commit_message('Add expense summary by category') is True", "assert is_good_commit_message('fix') is False", done),
    aTitle: "Branch Name",
    aDesc: "Write `branch_name(task)` that turns `'Add Monthly Report'` into `'feature/add-monthly-report'`.",
    aStarter: lines("def branch_name(task):", "    # lower case, spaces become '-'", "    pass"),
    aHint: "return 'feature/' + '-'.join(task.lower().split())",
    aTest: lines("assert branch_name('Add Monthly Report') == 'feature/add-monthly-report'", "assert branch_name('  Fix  total ') == 'feature/fix-total'", done)
  },
  {
    title: "Planning Your Expense Tracker",
    desc: "Before building, plan: what the program should do, the shape of one expense, the functions you need, and the order to build them. Today you plan the Expense Tracker you will build this week. (Real world: teams plan before they code.)",
    syllabus: [
      "User stories: what the user wants and why.",
      "The data shape of an expense.",
      "Splitting the program into small functions."
    ],
    eTitle: "Newest First",
    eDesc: "Write `sort_by_date(expenses)` that returns a new list sorted by `'date'` (text like `'2026-09-01'`), newest first. The original must not change.",
    eStarter: lines("def sort_by_date(expenses):", "    # sorted(..., key=..., reverse=True)", "    pass"),
    eHint: "return sorted(expenses, key=lambda e: e['date'], reverse=True)",
    eTest: lines("data = [{'id': 1, 'date': '2026-09-01'}, {'id': 2, 'date': '2026-09-20'}, {'id': 3, 'date': '2026-09-10'}]", "assert [e['id'] for e in sort_by_date(data)] == [2, 3, 1]", "assert data[0]['id'] == 1, 'The original list was changed'", done),
    aTitle: "Group by Category",
    aDesc: "Write `group_by_category(expenses)` that returns a dictionary like `{'food': ['Tea', 'Lunch'], 'travel': ['Bus']}` with item names.",
    aStarter: lines("def group_by_category(expenses):", "    groups = {}", "    # add each item name to groups[category]", "    return groups"),
    aHint: "groups.setdefault(e['category'], []).append(e['item'])",
    aTest: lines("data = [{'item': 'Tea', 'category': 'food'}, {'item': 'Bus', 'category': 'travel'}, {'item': 'Lunch', 'category': 'food'}]", "assert group_by_category(data) == {'food': ['Tea', 'Lunch'], 'travel': ['Bus']}", done)
  },
  {
    title: "Project Build 1: Adding and Listing Expenses",
    desc: "Today you build the core of the Expense Tracker: a program with a menu to add an expense and list all expenses neatly, using the functions and data shape from your plan. (Real world: this is the heart of every budgeting app.)",
    syllabus: [
      "A main menu loop with input().",
      "add_expense and list_expenses functions.",
      "Neat output with f-strings."
    ],
    eTitle: "Add an Expense",
    eDesc: "Write `add_expense(expenses, item, amount, category, date)` that returns a NEW list with the new expense added. Its `'id'` is one more than the number of expenses. Remove extra spaces from item and category.",
    eStarter: lines("def add_expense(expenses, item, amount, category, date):", "    new = {", "        # id, item, amount, category, date", "    }", "    return expenses + [new]"),
    eHint: "new = {'id': len(expenses) + 1, 'item': item.strip(), 'amount': amount, 'category': category.strip(), 'date': date}",
    eTest: lines("result = add_expense([], ' Tea ', 20, 'food ', '2026-09-28')", "assert result == [{'id': 1, 'item': 'Tea', 'amount': 20, 'category': 'food', 'date': '2026-09-28'}], result", "second = add_expense(result, 'Bus', 45, 'travel', '2026-09-28')", "assert second[1]['id'] == 2 and len(result) == 1", done),
    aTitle: "Format an Expense",
    aDesc: "Write `format_expense(e)` that returns text like `'Tea - Rs 20.00 (food)'`.",
    aStarter: lines("def format_expense(e):", "    pass"),
    aHint: "return f\"{e['item']} - Rs {e['amount']:.2f} ({e['category']})\"",
    aTest: lines("assert format_expense({'item': 'Tea', 'amount': 20, 'category': 'food'}) == 'Tea - Rs 20.00 (food)'", done)
  },
  {
    title: "Project Build 2: Summaries and Saving",
    desc: "Now the tracker becomes useful: a summary with the total, the number of expenses and the biggest one, totals per category, and saving everything to a JSON file so nothing is lost when the program closes. (Real world: the monthly report in your banking app.)",
    syllabus: [
      "A summary function.",
      "Totals per category with a dictionary.",
      "Saving and loading with json and files."
    ],
    eTitle: "Summary",
    eDesc: "Write `summary(expenses)` that returns `{'total': ..., 'count': ..., 'biggest': ...}` where biggest is the item name of the largest expense, or `None` for an empty list.",
    eStarter: lines("def summary(expenses):", "    # max(expenses, key=...) finds the biggest", "    pass"),
    eHint: "biggest = max(expenses, key=lambda e: e['amount'])['item'] if expenses else None",
    eTest: lines("data = [{'item': 'Tea', 'amount': 20}, {'item': 'Rent', 'amount': 8000}, {'item': 'Bus', 'amount': 45}]", "assert summary(data) == {'total': 8065, 'count': 3, 'biggest': 'Rent'}", "assert summary([]) == {'total': 0, 'count': 0, 'biggest': None}", done),
    aTitle: "Totals per Category",
    aDesc: "Write `category_totals(expenses)` that returns a dictionary like `{'food': 170, 'travel': 45}`.",
    aStarter: lines("def category_totals(expenses):", "    totals = {}", "    # add each amount to totals[category]", "    return totals"),
    aHint: "totals[e['category']] = totals.get(e['category'], 0) + e['amount']",
    aTest: lines("data = [{'category': 'food', 'amount': 20}, {'category': 'travel', 'amount': 45}, {'category': 'food', 'amount': 150}]", "assert category_totals(data) == {'food': 170, 'travel': 45}", done)
  },
  {
    title: "Calling Web APIs",
    desc: "Many programs get data from other services through web APIs: exchange rates, weather, job listings. You will call an API with the requests library, read its JSON answer, and handle errors like 'not found'. (Real world: a travel app getting live flight prices.)",
    syllabus: [
      "What an API is: URLs that answer with JSON.",
      "requests.get(), status codes and .json().",
      "Handling errors and missing data."
    ],
    eTitle: "Read the Answer",
    eDesc: "APIs often answer like `{'results': [...]}`. Write `parse_results(data)` that returns `data['results']`, or `[]` if it is missing.",
    eStarter: lines("def parse_results(data):", "    pass"),
    eHint: "return data.get('results', [])",
    eTest: lines("assert parse_results({'results': [1, 2]}) == [1, 2]", "assert parse_results({}) == []", done),
    aTitle: "Status Message",
    aDesc: "Write `status_message(code)` that returns `'OK'` for 200, `'Not found'` for 404, and `'Something went wrong'` for anything else.",
    aStarter: lines("def status_message(code):", "    pass"),
    aHint: "if code == 200: return 'OK'; if code == 404: return 'Not found'; return 'Something went wrong'",
    aTest: lines("assert status_message(200) == 'OK'", "assert status_message(404) == 'Not found'", "assert status_message(500) == 'Something went wrong'", done)
  },
  {
    title: "Building Your Own API with FastAPI",
    desc: "Now you build your own web API so other apps can use your Expense Tracker: GET to list expenses, POST to add one, with automatic checks on the data sent. FastAPI is a popular, beginner-friendly Python framework used by many companies. (Real world: a phone app talking to its server.)",
    syllabus: [
      "What a web API is: routes, GET and POST.",
      "Your first FastAPI app and the automatic /docs page.",
      "Checking incoming data with Pydantic models and returning errors."
    ],
    eTitle: "Check Incoming Data",
    eDesc: "Write `validate_expense(data)` that returns a list of errors: `'item is required'` if item is missing or empty, and `'amount must be more than 0'` if amount is missing or not above 0.",
    eStarter: lines("def validate_expense(data):", "    errors = []", "    # append the error messages", "    return errors"),
    eHint: "if not str(data.get('item', '')).strip(): errors.append(...); amount = data.get('amount'); if not isinstance(amount, (int, float)) or amount <= 0: errors.append(...)",
    eTest: lines("assert validate_expense({'item': 'Tea', 'amount': 20}) == []", "assert validate_expense({'item': ' ', 'amount': 0}) == ['item is required', 'amount must be more than 0']", "assert validate_expense({}) == ['item is required', 'amount must be more than 0']", done),
    aTitle: "Pages of Results (Building Your Own API with FastAPI)",
    aDesc: "APIs send long lists in pages. Write `paginate(items, page, size)` that returns the items for that page, where page 1 is the first page.",
    aStarter: lines("def paginate(items, page, size):", "    # slice from (page - 1) * size", "    pass"),
    aHint: "start = (page - 1) * size; return items[start:start + size]",
    aTest: lines("items = list(range(1, 8))", "assert paginate(items, 1, 3) == [1, 2, 3]", "assert paginate(items, 3, 3) == [7]", "assert paginate(items, 4, 3) == []", done)
  },
  {
    title: "Debugging: Reading Tracebacks",
    desc: "Every developer spends a lot of time fixing bugs. Today you learn to read Python tracebacks from the bottom up, find the exact line, use print() and the VS Code debugger, and recognise the most common beginner mistakes. (Real world: a junior developer's first tasks are usually bug fixes.)",
    syllabus: [
      "Reading a traceback: error type, message and line.",
      "Common errors: NameError, TypeError, KeyError, IndexError.",
      "print() debugging and breakpoints."
    ],
    eTitle: "Fix the Bug",
    eDesc: "This function should add up every expense's amount, but it has a bug. Find it and fix it.",
    eStarter: lines("def total_amount(expenses):", "    total = 0", "    for i in range(1, len(expenses)):", "        total = total + expenses[i]['amount']", "    return total"),
    eHint: "Lists start at position 0, not 1.",
    eTest: lines("assert total_amount([{'amount': 100}, {'amount': 200}, {'amount': 300}]) == 600, 'Expected 600'", done),
    aTitle: "Find the Bad Record",
    aDesc: "Write `first_invalid(expenses)` that returns the first expense whose amount is 0 or less, or `None` if all are fine.",
    aStarter: lines("def first_invalid(expenses):", "    pass"),
    aHint: "for e in expenses: if e['amount'] <= 0: return e. After the loop, return None.",
    aTest: lines("data = [{'id': 1, 'amount': 20}, {'id': 2, 'amount': 0}, {'id': 3, 'amount': -5}]", "assert first_invalid(data)['id'] == 2", "assert first_invalid([{'id': 1, 'amount': 5}]) is None", done)
  },
  {
    title: "Putting Your API Online",
    desc: "An API on your laptop helps nobody. Today you put the Expense Tracker API online with a free hosting service, keep secrets in environment variables, and write a README with the live link. (Real world: every portfolio project should have a live link.)",
    syllabus: [
      "requirements.txt and the start command.",
      "Deploying from GitHub to a free host.",
      "Environment variables and a good README."
    ],
    eTitle: "Which Address?",
    eDesc: "Write `base_url(env)` that returns `'https://expense-api.onrender.com'` for `'production'` and `'http://127.0.0.1:8000'` for anything else.",
    eStarter: lines("def base_url(env):", "    pass"),
    eHint: "return 'https://expense-api.onrender.com' if env == 'production' else 'http://127.0.0.1:8000'",
    eTest: lines("assert base_url('production') == 'https://expense-api.onrender.com'", "assert base_url('development') == 'http://127.0.0.1:8000'", done),
    aTitle: "README Checker",
    aDesc: "Write `missing_sections(readme)` that returns which of `'## About'`, `'## Features'`, `'## Setup'` are missing from the README text, in that order.",
    aStarter: lines("def missing_sections(readme):", "    needed = ['## About', '## Features', '## Setup']", "    pass"),
    aHint: "return [s for s in needed if s not in readme]",
    aTest: lines("text = '# Expense API\\n## About\\nTrack spending\\n## Setup\\npip install -r requirements.txt'", "assert missing_sections(text) == ['## Features']", done)
  },
  {
    title: "Interview Practice and Your Next Steps",
    desc: "You have built a Python program and a web API and put it online. Today you practise the questions junior Python interviews ask, learn to explain your project clearly, and solve two classic coding questions. (Real world: most junior interviews include a short coding task and questions about your project.)",
    syllabus: [
      "Common Python questions: lists vs tuples, dictionaries, exceptions.",
      "Explaining your project in 2 minutes.",
      "Solving small coding questions calmly."
    ],
    eTitle: "FizzBuzz",
    eDesc: "Write `fizz_buzz(n)` that returns `'FizzBuzz'` if n divides by 3 and 5, `'Fizz'` if by 3, `'Buzz'` if by 5, otherwise the number as text.",
    eStarter: lines("def fizz_buzz(n):", "    # check 3 and 5 together first", "    pass"),
    eHint: "if n % 15 == 0: return 'FizzBuzz' ... return str(n)",
    eTest: lines("assert fizz_buzz(15) == 'FizzBuzz'", "assert fizz_buzz(9) == 'Fizz'", "assert fizz_buzz(10) == 'Buzz'", "assert fizz_buzz(7) == '7'", done),
    aTitle: "Reverse the Words",
    aDesc: "Write `reverse_words(sentence)` that reverses the order of the words. Example: `'I love Python'` gives `'Python love I'`.",
    aStarter: lines("def reverse_words(sentence):", "    # split, reverse, join", "    pass"),
    aHint: "return ' '.join(reversed(sentence.split()))",
    aTest: lines("assert reverse_words('I love Python') == 'Python love I'", done)
  }
];

export const PYTHON_30_DAYS_QUESTS: CourseQuest[] = PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('python', idx + 1, cfg)
);
