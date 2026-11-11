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
    aDesc: "Welcome your user! Print `'Hello, Asha!'` to the screen using `print()`.",
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
    eDesc: "Store an item and amount in variables, and print a description! Create item = 'Tea' and amount = 20, and print 'Tea costs 20' (using str() to convert the number).",
    eStarter: lines(
      'item = "Tea"',
      'amount = 20',
      '# Print "Tea costs 20" below using item, amount, and str()',
      ''
    ),
    eHint: lines('item = "Tea"', 'amount = 20', 'print(item + " costs " + str(amount))'),
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
    aDesc: "Check if an expense is big (1000 or more). Create amount = 1200 and is_big = amount >= 1000, then print is_big.",
    aStarter: lines(
      'amount = 1200',
      '# Set is_big = amount >= 1000 and print it below',
      ''
    ),
    aHint: lines('amount = 1200', 'is_big = amount >= 1000', 'print(is_big)'),
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
    eDesc: "Convert text to capital letters and add an exclamation mark! Create text = 'sale' and print 'SALE!' using upper() and + '!'.",
    eStarter: lines(
      'text = "sale"',
      '# Print text in capital letters with "!" at the end using upper() and +',
      ''
    ),
    eHint: lines('text = "sale"', 'print(text.upper() + "!")'),
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
    aDesc: "Get the initials of two names in capital letters! Create first = 'asha' and last = 'rao', and print 'AR' by taking first[0] and last[0] and using upper().",
    aStarter: lines(
      'first = "asha"',
      'last = "rao"',
      '# Print the initials in capitals (e.g. "AR") using [0], +, and upper()',
      ''
    ),
    aHint: lines('first = "asha"', 'last = "rao"', 'print((first[0] + last[0]).upper())'),
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
    eDesc: "Calculate the price with 18% GST added, rounded to 2 decimal places! Create price = 100 and print the total (118.0) using round(price * 1.18, 2).",
    eStarter: lines(
      'price = 100',
      '# Calculate price + 18% GST, round to 2 decimal places, and print it below',
      ''
    ),
    eHint: lines('price = 100', 'print(round(price * 1.18, 2))'),
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
    aDesc: "Split a bill among friends and round each share to 2 decimal places! Create total = 1000 and people = 4, and print each person's share (250.0) using round(total / people, 2).",
    aStarter: lines(
      'total = 1000',
      'people = 4',
      '# Calculate each share using round(total / people, 2) and print it below',
      ''
    ),
    aHint: lines('total = 1000', 'people = 4', 'print(round(total / people, 2))'),
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
    eDesc: "Decide if a score is a Pass or a Fail! Create score = 40 and print 'Pass' if the score is 40 or more, otherwise print 'Fail'.",
    eStarter: lines(
      'score = 40',
      '# Print "Pass" if score >= 40, otherwise print "Fail" using if and else',
      ''
    ),
    eHint: lines(
      'score = 40',
      'if score >= 40:',
      '    print("Pass")',
      'else:',
      '    print("Fail")'
    ),
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
    aDesc: "Calculate the delivery fee for a bill! Create bill = 499 and print 0 if the bill is 499 or more, otherwise print 40.",
    aStarter: lines(
      'bill = 499',
      '# Print 0 if bill >= 499, otherwise print 40 using if and else',
      ''
    ),
    aHint: lines(
      'bill = 499',
      'if bill >= 499:',
      '    print(0)',
      'else:',
      '    print(40)'
    ),
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
    eDesc: "Add up all numbers in a list using a for loop and the accumulator pattern! Create amounts = [20, 45, 100] and print the sum (165).",
    eStarter: lines(
      'amounts = [20, 45, 100]',
      'result = 0',
      '# Loop over amounts, add each to result, and print result below',
      ''
    ),
    eHint: lines(
      'amounts = [20, 45, 100]',
      'result = 0',
      'for amount in amounts:',
      '    result = result + amount',
      'print(result)'
    ),
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
    aDesc: "Count how many amounts are greater than a limit using a for loop and an if! Create amounts = [100, 500, 1200, 50] and limit = 400, and print the count (2).",
    aStarter: lines(
      'amounts = [100, 500, 1200, 50]',
      'limit = 400',
      'count = 0',
      '# Loop over amounts, add 1 to count if amount > limit, and print count below',
      ''
    ),
    aHint: lines(
      'amounts = [100, 500, 1200, 50]',
      'limit = 400',
      'count = 0',
      'for amount in amounts:',
      '    if amount > limit:',
      '        count = count + 1',
      'print(count)'
    ),
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
    eHint: lines(
      "def average(numbers):",
      "    if len(numbers) == 0:",
      "        return 0",
      "    return round(sum(numbers) / len(numbers), 2)"
    ),
    eTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('average')",
      "_val1 = None; _val2 = None; _val3 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn([10, 20, 30])",
      "        _val2 = _fn([1, 2])",
      "        _val3 = _fn([])",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_all_text = ' '.join(_printed) + ' ' + str(_cap)",
      "if callable(_fn) and _val1 is None and ('20' in _all_text or '20.0' in _all_text):",
      "    assert False, \"average() printed the answer instead of returning it. Use 'return' instead of 'print'!\"",
      "_fn_ok = (_val1 == 20.0 or _val1 == 20) and (_val2 == 1.5) and (_val3 == 0 or _val3 == 0.0)",
      "_script_ok = ('20.0' in _all_text or '20' in _all_text) and not callable(_fn) and ('average' in globals() or 'avg' in globals() or '20' in _printed)",
      "assert _fn_ok or _script_ok, \"Expected average([10, 20, 30]) == 20.0, average([1, 2]) == 1.5, and average([]) == 0\"",
      done
    ),
    aTitle: "Greeting With a Default",
    aDesc: "Write `greet(name, greeting='Hello')` that returns text like `'Hello, Asha!'`. If a greeting is given, use it instead.",
    aStarter: lines("def greet(name, greeting='Hello'):", "    # Join greeting, ', ', name and '!'", "    pass"),
    aHint: lines(
      "def greet(name, greeting='Hello'):",
      "    return greeting + ', ' + name + '!'"
    ),
    aTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('greet')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn('Asha')",
      "        _val2 = _fn('Ravi', 'Namaste')",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_all_text = ' '.join(_printed) + ' ' + str(_cap)",
      "if callable(_fn) and _val1 is None and ('Hello, Asha!' in _all_text or 'Asha' in _all_text):",
      "    assert False, \"greet() printed the greeting instead of returning it. Use 'return' instead of 'print'!\"",
      "_fn_ok = (_val1 == 'Hello, Asha!') and (_val2 == 'Namaste, Ravi!')",
      "_script_ok = ('Hello, Asha!' in _all_text) and not callable(_fn)",
      "assert _fn_ok or _script_ok, \"Expected greet('Asha') == 'Hello, Asha!' and greet('Ravi', 'Namaste') == 'Namaste, Ravi!'\"",
      done
    )
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
    eStarter: lines("def first_and_last(items):", "    # items[0] is the first item, items[-1] is the last item", "    pass"),
    eHint: lines(
      "def first_and_last(items):",
      "    return [items[0], items[-1]]"
    ),
    eTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('first_and_last')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn(['a', 'b', 'c', 'd'])",
      "        _val2 = _fn([10, 20])",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_all_text = ' '.join(_printed) + ' ' + str(_cap)",
      "if callable(_fn) and _val1 is None and (\"['a', 'd']\" in _all_text or 'a' in _all_text):",
      "    assert False, \"first_and_last() printed the answer instead of returning it. Use 'return [items[0], items[-1]]'!\"",
      "_fn_ok = (_val1 == ['a', 'd'] or _val1 == ('a', 'd')) and (_val2 == [10, 20] or _val2 == (10, 20))",
      "_script_ok = not callable(_fn) and (\"['a', 'd']\" in _all_text)",
      "assert _fn_ok or _script_ok, \"Expected first_and_last(['a', 'b', 'c', 'd']) to return ['a', 'd']\"",
      done
    ),
    aTitle: "Add Without Changing",
    aDesc: "Write `add_item(items, item)` that returns a NEW list with the item at the end. The original list must not change.",
    aStarter: lines("def add_item(items, item):", "    # items + [item] makes a new list without changing items", "    pass"),
    aHint: lines(
      "def add_item(items, item):",
      "    return items + [item]"
    ),
    aTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('add_item')",
      "original = ['Tea']",
      "result = None; _r2 = None",
      "try:",
      "    if callable(_fn):",
      "        result = _fn(original, 'Bus')",
      "        _r2 = _fn([1, 2], 3)",
      "finally:",
      "    print = _orig_print",
      "if callable(_fn) and result is None and original == ['Tea', 'Bus']:",
      "    assert False, \"items.append(item) changes the original list in-place and returns None! Use 'return items + [item]' instead.\"",
      "if callable(_fn) and result == ['Tea', 'Bus'] and original != ['Tea']:",
      "    assert False, \"The original list was changed! Use 'return items + [item]' or copy the list first with 'items.copy()' so the original stays ['Tea'].\"",
      "assert result == ['Tea', 'Bus'] and _r2 == [1, 2, 3], \"Expected add_item(['Tea'], 'Bus') to return ['Tea', 'Bus'] and add_item([1, 2], 3) to return [1, 2, 3]\"",
      "assert original == ['Tea'], \"The original list was changed\"",
      done
    )
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
    eDesc: "Write `double_all(numbers)` that returns a new list with every number doubled, using a list comprehension (or a for loop).",
    eStarter: lines("def double_all(numbers):", "    # [n * 2 for n in numbers] (or build a new list with a for loop)", "    pass"),
    eHint: lines(
      "def double_all(numbers):",
      "    return [n * 2 for n in numbers]"
    ),
    eTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('double_all')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn([1, 2, 3])",
      "        _val2 = _fn([])",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_all_text = ' '.join(_printed) + ' ' + str(_cap)",
      "if callable(_fn) and _val1 is None and ('[2, 4, 6]' in _all_text or '2' in _all_text):",
      "    assert False, \"double_all() printed the result instead of returning it. Use 'return [n * 2 for n in numbers]'!\"",
      "if callable(_fn) and isinstance(_val1, (int, float)):",
      "    assert False, \"double_all() returned a single number instead of a list! Put your return outside the loop, or use 'return [n * 2 for n in numbers]'.\"",
      "assert _val1 == [2, 4, 6] and _val2 == [], \"Expected double_all([1, 2, 3]) == [2, 4, 6] and double_all([]) == []\"",
      done
    ),
    aTitle: "Only the Big Ones",
    aDesc: "Write `above(numbers, limit)` that returns a new list with only the numbers greater than the limit.",
    aStarter: lines("def above(numbers, limit):", "    # [n for n in numbers if n > limit] (or use a for loop)", "    pass"),
    aHint: lines(
      "def above(numbers, limit):",
      "    return [n for n in numbers if n > limit]"
    ),
    aTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('above')",
      "_val1 = None; _val2 = None",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn([100, 500, 1200, 50], 400)",
      "        _val2 = _fn([1, 2], 5)",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_all_text = ' '.join(_printed) + ' ' + str(_cap)",
      "if callable(_fn) and _val1 is None and ('500' in _all_text):",
      "    assert False, \"above() printed the result instead of returning it. Use 'return [n for n in numbers if n > limit]'!\"",
      "if callable(_fn) and isinstance(_val1, (int, float)):",
      "    assert False, \"above() returned a single number instead of a list! Return a list of all matching numbers.\"",
      "assert _val1 == [500, 1200] and _val2 == [], \"Expected above([100, 500, 1200, 50], 400) == [500, 1200] and above([1, 2], 5) == []\"",
      done
    )
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
    eStarter: lines("def make_expense(item, amount, category):", "    # return {'item': item, 'amount': amount, 'category': category}", "    pass"),
    eHint: lines(
      "def make_expense(item, amount, category):",
      "    return {'item': item, 'amount': amount, 'category': category}"
    ),
    eTest: lines(
      "_printed = []",
      "_orig_print = print",
      "def _capturing_print(*args, **kwargs):",
      "    _printed.append(' '.join(str(a) for a in args))",
      "    try: _orig_print(*args, **kwargs)",
      "    except Exception: pass",
      "print = _capturing_print",
      "_fn = globals().get('make_expense')",
      "e = None; e2 = None",
      "try:",
      "    if callable(_fn):",
      "        e = _fn('Tea', 20, 'food')",
      "        e2 = _fn('Bus', 45, 'travel')",
      "finally:",
      "    print = _orig_print",
      "_cap = globals().get('_captured_stdout_', '')",
      "_all_text = ' '.join(_printed) + ' ' + str(_cap)",
      "if callable(_fn) and e is None and ('Tea' in _all_text):",
      "    assert False, \"make_expense() printed the dictionary instead of returning it. Use 'return'!\"",
      "if isinstance(e, dict) and {k.lower() for k in e.keys()} == {'item', 'amount', 'category'} and set(e.keys()) != {'item', 'amount', 'category'}:",
      "    assert False, \"Dictionary keys are case-sensitive! Use lowercase 'item', 'amount', and 'category'.\"",
      "assert e == {'item': 'Tea', 'amount': 20, 'category': 'food'} and e2 == {'item': 'Bus', 'amount': 45, 'category': 'travel'}, \"Expected {'item': 'Tea', 'amount': 20, 'category': 'food'}\"",
      done
    ),
    aTitle: "Price Lookup",
    aDesc: "Write `price_of(prices, item)` that returns the item's price from the dictionary, or 0 if the item is not there.",
    aStarter: lines("def price_of(prices, item):", "    # Use prices.get(item, 0) or check if item in prices", "    pass"),
    aHint: lines(
      "def price_of(prices, item):",
      "    return prices.get(item, 0)"
    ),
    aTest: lines(
      "prices = {'tea': 20, 'coffee': 40}",
      "_fn = globals().get('price_of')",
      "_val1 = None; _val2 = None; _key_err = False",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn(prices, 'coffee')",
      "        _val2 = _fn(prices, 'juice')",
      "except KeyError:",
      "    _key_err = True",
      "if _key_err:",
      "    assert False, \"KeyError when looking up a missing item! Use 'prices.get(item, 0)' or check 'if item in prices:' so missing items return 0.\"",
      "if _val1 == 40 and _val2 is None:",
      "    assert False, \"price_of() returned None for a missing item! Pass 0 as the default: 'return prices.get(item, 0)'.\"",
      "assert _val1 == 40 and _val2 == 0, \"Expected price_of(prices, 'coffee') == 40 and price_of(prices, 'juice') == 0\"",
      done
    )
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
    eStarter: lines("def total_spent(expenses):", "    # sum(e['amount'] for e in expenses) or use a for loop", "    pass"),
    eHint: lines(
      "def total_spent(expenses):",
      "    return sum(e['amount'] for e in expenses)"
    ),
    eTest: lines(
      "data = [{'item': 'Tea', 'amount': 20}, {'item': 'Bus', 'amount': 45}]",
      "_fn = globals().get('total_spent')",
      "_val1 = None; _val2 = None; _type_err = False",
      "try:",
      "    if callable(_fn):",
      "        _val1 = _fn(data)",
      "        _val2 = _fn([])",
      "except TypeError:",
      "    _type_err = True",
      "if _type_err:",
      "    assert False, \"Each item in expenses is a dictionary! Add up e['amount'] for each expense e, not the dictionary itself.\"",
      "assert _val1 == 65 and (_val2 == 0 or _val2 == 0.0), \"Expected total_spent(data) == 65 and total_spent([]) == 0\"",
      done
    ),
    aTitle: "One Category",
    aDesc: "Write `by_category(expenses, category)` that returns only the expenses in that category.",
    aStarter: lines("def by_category(expenses, category):", "    # keep e when e['category'] == category", "    pass"),
    aHint: lines(
      "def by_category(expenses, category):",
      "    return [e for e in expenses if e['category'] == category]"
    ),
    aTest: lines(
      "data = [{'item': 'Tea', 'category': 'food'}, {'item': 'Bus', 'category': 'travel'}, {'item': 'Lunch', 'category': 'food'}]",
      "_fn = globals().get('by_category')",
      "result = _fn(data, 'food') if callable(_fn) else None",
      "_r_travel = _fn(data, 'travel') if callable(_fn) else None",
      "_r_none = _fn(data, 'rent') if callable(_fn) else None",
      "assert isinstance(result, list) and isinstance(_r_travel, list) and _r_none == [], \"Expected by_category() to return a list of matching expenses\"",
      "_items = [e['item'] if isinstance(e, dict) else e for e in result]",
      "_travel_items = [e['item'] if isinstance(e, dict) else e for e in _r_travel]",
      "assert _items == ['Tea', 'Lunch'] and _travel_items == ['Bus'], \"Expected by_category(data, 'food') to keep only the 'Tea' and 'Lunch' food expenses\"",
      done
    )
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
    eHint: lines("def unique_categories(expenses):", "    return sorted({e['category'] for e in expenses})"),
    eTest: lines(
      "data = [{'category': 'food'}, {'category': 'travel'}, {'category': 'food'}]",
      "_fn = globals().get('unique_categories')",
      "_res = _fn(data) if callable(_fn) else None",
      "_res2 = _fn([{'category': 'rent'}, {'category': 'bills'}, {'category': 'rent'}]) if callable(_fn) else None",
      "if isinstance(_res, set) and _res == {'food', 'travel'}:",
      "    _res = sorted(_res)",
      "if isinstance(_res2, set) and _res2 == {'bills', 'rent'}:",
      "    _res2 = sorted(_res2)",
      "assert _res == ['food', 'travel'] and _res2 == ['bills', 'rent'], \"Expected unique_categories(data) to return ['food', 'travel']\"",
      done
    ),
    aTitle: "Smallest and Largest",
    aDesc: "Write `min_max(numbers)` that returns a tuple `(smallest, largest)`.",
    aStarter: lines("def min_max(numbers):", "    # return (min(numbers), max(numbers))", "    pass"),
    aHint: lines("def min_max(numbers):", "    return (min(numbers), max(numbers))"),
    aTest: lines(
      "_fn = globals().get('min_max')",
      "_r1 = _fn([40, 10, 90]) if callable(_fn) else None",
      "_r2 = _fn([5]) if callable(_fn) else None",
      "assert (_r1 == (10, 90) or _r1 == [10, 90]) and (_r2 == (5, 5) or _r2 == [5, 5]), \"Expected min_max([40, 10, 90]) to return (10, 90)\"",
      done
    )
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
    eHint: lines("def money(amount):", "    return f'Rs {amount:.2f}'"),
    eTest: lines(
      "_fn = globals().get('money')",
      "_v1 = _fn(1250.5) if callable(_fn) else None",
      "_v2 = _fn(20) if callable(_fn) else None",
      "if _v1 == 'Rs 1250.5' or _v2 == 'Rs 20':",
      "    assert False, \"Almost! Use ':.2f' inside the curly brackets: f'Rs {amount:.2f}' so it always shows 2 decimal places ('Rs 1250.50').\"",
      "assert _v1 == 'Rs 1250.50', \"Expected money(1250.5) to return 'Rs 1250.50'\"",
      "assert _v2 == 'Rs 20.00', \"Expected money(20) to return 'Rs 20.00'\"",
      done
    ),
    aTitle: "Receipt Line",
    aDesc: "Write `receipt_line(item, amount)` that returns the item padded to 10 characters on the left, then the amount right-aligned in 8 characters with 2 decimals. Example: `receipt_line('Tea', 20)` returns `'Tea          20.00'`.",
    aStarter: lines("def receipt_line(item, amount):", "    # f'{item:<10}{amount:>8.2f}'", "    pass"),
    aHint: lines("def receipt_line(item, amount):", "    return f'{item:<10}{amount:>8.2f}'"),
    aTest: lines(
      "_fn = globals().get('receipt_line')",
      "_r1 = _fn('Tea', 20) if callable(_fn) else None",
      "_r2 = _fn('Lunch', 150.5) if callable(_fn) else None",
      "if isinstance(_r1, str) and 'Tea' in _r1 and '20.00' in _r1 and len(_r1) < 18:",
      "    assert False, \"Almost! Use '<10' to pad the item to 10 characters and '>8.2f' to right-align the amount in 8 characters: f'{item:<10}{amount:>8.2f}'.\"",
      "assert _r1 in ('Tea          20.00', 'Tea           20.00'), f\"Expected 'Tea          20.00', got {_r1!r}\"",
      "assert isinstance(_r2, str) and len(_r2) in (18, 19), \"Expected 18 characters total (10 for item + 8 for amount)\"",
      done
    )
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
    eStarter: lines("def safe_int(text):", "    try:", "        # convert with int() and return it", "        pass", "    except ValueError:", "        # return 0 when text is not a valid number", "        pass"),
    eHint: lines("def safe_int(text):", "    try:", "        return int(text)", "    except ValueError:", "        return 0"),
    eTest: lines(
      "_fn = globals().get('safe_int')",
      "_v1 = None; _v2 = None; _v3 = None; _val_err = False",
      "try:",
      "    if callable(_fn):",
      "        _v1 = _fn('42')",
      "        _v2 = _fn('abc')",
      "        _v3 = _fn('')",
      "except ValueError:",
      "    _val_err = True",
      "if _val_err:",
      "    assert False, \"safe_int('abc') crashed with ValueError! Catch it with 'except ValueError:' and return 0.\"",
      "if _v1 == 42 and _v2 is None:",
      "    assert False, \"safe_int('abc') returned None instead of 0! Put 'return 0' inside the except block.\"",
      "assert _v1 == 42 and _v2 == 0 and _v3 == 0, \"Expected safe_int('42') == 42, safe_int('abc') == 0, and safe_int('') == 0\"",
      done
    ),
    aTitle: "Safe Divide",
    aDesc: "Write `safe_divide(a, b)` that returns `a / b`, or `None` when `b` is 0.",
    aStarter: lines("def safe_divide(a, b):", "    # try returning a / b, and return None on ZeroDivisionError", "    pass"),
    aHint: lines("def safe_divide(a, b):", "    try:", "        return a / b", "    except ZeroDivisionError:", "        return None"),
    aTest: lines(
      "_fn = globals().get('safe_divide')",
      "_v1 = None; _v2 = 'UNSET'; _z_err = False",
      "try:",
      "    if callable(_fn):",
      "        _v1 = _fn(10, 4)",
      "        _v2 = _fn(1, 0)",
      "except ZeroDivisionError:",
      "    _z_err = True",
      "if _z_err:",
      "    assert False, \"safe_divide(1, 0) crashed with ZeroDivisionError! Catch it with 'except ZeroDivisionError: return None'.\"",
      "assert _v1 == 2.5 and _v2 is None, \"Expected safe_divide(10, 4) == 2.5 and safe_divide(1, 0) is None\"",
      done
    )
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
    eStarter: lines("import math", "", "def circle_area(r):", "    # round(math.pi * r * r, 2)", "    pass"),
    eHint: lines("import math", "", "def circle_area(r):", "    return round(math.pi * r * r, 2)"),
    eTest: lines(
      "_fn = globals().get('circle_area')",
      "_v1 = _fn(1) if callable(_fn) else None",
      "_v2 = _fn(2) if callable(_fn) else None",
      "assert isinstance(_v1, (int, float)) and isinstance(_v2, (int, float)), \"Expected circle_area(r) to return a number\"",
      "assert round(_v1, 2) == 3.14 and round(_v2, 2) == 12.57, \"Expected circle_area(1) == 3.14 and circle_area(2) == 12.57\"",
      done
    ),
    aTitle: "Days Between Dates",
    aDesc: "Write `days_between(start, end)` where both are dates as text like `'2026-09-01'`. Return how many days are between them.",
    aStarter: lines("from datetime import date", "", "def days_between(start, end):", "    # (date.fromisoformat(end) - date.fromisoformat(start)).days", "    pass"),
    aHint: lines("from datetime import date", "", "def days_between(start, end):", "    return (date.fromisoformat(end) - date.fromisoformat(start)).days"),
    aTest: lines(
      "_fn = globals().get('days_between')",
      "_v1 = _fn('2026-09-01', '2026-09-28') if callable(_fn) else None",
      "_v2 = _fn('2026-01-01', '2026-01-01') if callable(_fn) else None",
      "if hasattr(_v1, 'days'):",
      "    assert False, \"Almost! Subtracting two dates returns a timedelta object. Add '.days' at the end: (date.fromisoformat(end) - date.fromisoformat(start)).days\"",
      "if _v1 == -27:",
      "    assert False, \"Almost! You subtracted end from start (-27). Subtract start from end: (date.fromisoformat(end) - date.fromisoformat(start)).days\"",
      "assert _v1 == 27 and _v2 == 0, \"Expected days_between('2026-09-01', '2026-09-28') == 27 and days_between('2026-01-01', '2026-01-01') == 0\"",
      done
    )
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
    eStarter: lines("def parse_line(line):", "    # strip(), then split(','), then return (item.strip(), int(amount))", "    pass"),
    eHint: "item, amount = line.strip().split(','); return (item.strip(), int(amount))",
    eTest: lines(
      "_fn = globals().get('parse_line')",
      "_r1 = _fn('Tea,20') if callable(_fn) else None",
      "_r2 = _fn(' Bus ticket , 45 \\n') if callable(_fn) else None",
      "if isinstance(_r1, (tuple, list)) and len(_r1) == 2 and _r1[1] == '20':",
      "    assert False, \"Almost! The amount '20' is still text (str). Convert it to a whole number with int(amount).\"",
      "assert isinstance(_r1, (tuple, list)) and len(_r1) == 2 and _r1[0].strip() == 'Tea' and _r1[1] == 20, \"Expected parse_line('Tea,20') to return ('Tea', 20)\"",
      "assert isinstance(_r2, (tuple, list)) and len(_r2) == 2 and _r2[0].strip() == 'Bus ticket' and _r2[1] == 45, \"Expected parse_line(' Bus ticket , 45 \\\\n') to return ('Bus ticket', 45)\"",
      done
    ),
    aTitle: "Write One Line",
    aDesc: "Write `to_line(item, amount)` that returns the line to save, like `'Tea,20'`.",
    aStarter: lines("def to_line(item, amount):", "    # f'{item},{amount}'", "    pass"),
    aHint: "return f'{item},{amount}'",
    aTest: lines(
      "_fn = globals().get('to_line')",
      "_r1 = _fn('Tea', 20) if callable(_fn) else None",
      "_r2 = _fn('Bus', 45) if callable(_fn) else None",
      "assert isinstance(_r1, str) and _r1.rstrip('\\n') == 'Tea,20', \"Expected to_line('Tea', 20) to return 'Tea,20'\"",
      "assert isinstance(_r2, str) and _r2.rstrip('\\n') == 'Bus,45', \"Expected to_line('Bus', 45) to return 'Bus,45'\"",
      done
    )
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
    eStarter: lines("import json", "", "def to_json(expenses):", "    # return json.dumps(expenses)", "    pass"),
    eHint: "return json.dumps(expenses)",
    eTest: lines(
      "import json as _json",
      "_fn = globals().get('to_json')",
      "_res = _fn([{'item': 'Tea', 'amount': 20}]) if callable(_fn) else None",
      "_res2 = _fn([]) if callable(_fn) else None",
      "assert isinstance(_res, str) and isinstance(_res2, str), \"Expected to_json(expenses) to return a JSON string using json.dumps(expenses)\"",
      "assert _json.loads(_res) == [{'item': 'Tea', 'amount': 20}] and _json.loads(_res2) == [], \"Expected json.dumps(expenses) output\"",
      done
    ),
    aTitle: "Safe Load",
    aDesc: "Write `load_expenses(text)` that turns JSON text into a list, and returns `[]` if the text is broken, empty, or not a list.",
    aStarter: lines("import json", "", "def load_expenses(text):", "    try:", "        # json.loads(text), then return it only if isinstance(data, list)", "        pass", "    except ValueError:", "        return []"),
    aHint: "data = json.loads(text); return data if isinstance(data, list) else []",
    aTest: lines(
      "_fn = globals().get('load_expenses')",
      "_r1 = _fn('[{\"item\": \"Tea\"}]') if callable(_fn) else None",
      "_r2 = _fn('broken{') if callable(_fn) else None",
      "_r3 = _fn('{\"a\": 1}') if callable(_fn) else None",
      "_r4 = _fn('') if callable(_fn) else None",
      "if _r1 == [{'item': 'Tea'}] and isinstance(_r3, dict):",
      "    assert False, \"Almost! When the JSON is a dictionary like '{\\\"a\\\": 1}' instead of a list, load_expenses() must return []. Check 'isinstance(data, list)'.\"",
      "assert _r1 == [{'item': 'Tea'}], \"Expected load_expenses('[{\\\"item\\\": \\\"Tea\\\"}]') == [{'item': 'Tea'}]\"",
      "assert _r2 == [] and _r3 == [] and _r4 == [], \"Expected load_expenses() to return [] for broken, non-list, or empty text\"",
      done
    )
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
    eStarter: lines("class Expense:", "    def __init__(self, item, amount):", "        # save item and amount on self", "        pass", "", "    def label(self):", "        # return f'{self.item}: {self.amount}'", "        pass"),
    eHint: "self.item = item; self.amount = amount; label returns f'{self.item}: {self.amount}'",
    eTest: lines(
      "e = Expense('Tea', 20)",
      "e2 = Expense('Bus', 45)",
      "_attrs_ok = False",
      "try:",
      "    _attrs_ok = (e.item == 'Tea' and e.amount == 20 and e2.item == 'Bus' and e2.amount == 45)",
      "except AttributeError:",
      "    _attrs_ok = False",
      "assert _attrs_ok, \"Save self.item = item and self.amount = amount inside __init__\"",
      "_lbl = e.label(); _lbl2 = e2.label()",
      "assert _lbl == 'Tea: 20' and _lbl2 == 'Bus: 45', f\"Expected e.label() to return 'Tea: 20' and 'Bus: 45', got {_lbl!r}\"",
      done
    ),
    aTitle: "A Wallet",
    aDesc: "Write a class `Wallet` that starts with a `balance`. Its method `spend(amount)` subtracts the amount and returns `True`, or returns `False` and changes nothing if there is not enough money.",
    aStarter: lines("class Wallet:", "    def __init__(self, balance):", "        self.balance = balance", "", "    def spend(self, amount):", "        # if amount > self.balance: return False; otherwise subtract and return True", "        pass"),
    aHint: "if amount > self.balance: return False. Otherwise subtract and return True.",
    aTest: lines(
      "w = Wallet(100)",
      "_ok1 = w.spend(30)",
      "assert _ok1 is True and w.balance == 70, \"Expected w.spend(30) on Wallet(100) to return True and leave balance 70\"",
      "_ok2 = w.spend(500)",
      "if w.balance < 0:",
      "    assert False, \"When amount > self.balance, do not subtract from self.balance! Return False without changing balance.\"",
      "assert _ok2 is False and w.balance == 70, \"Expected w.spend(500) to return False and keep balance at 70\"",
      done
    )
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
    eStarter: lines("class Expense:", "    def __init__(self, item, amount):", "        self.item = item", "        self.amount = amount", "", "    def __str__(self):", "        # return f'{self.item} (Rs {self.amount})'", "        pass"),
    eHint: "return f'{self.item} (Rs {self.amount})'",
    eTest: lines(
      "_s = None; _s2 = None; _t_err = False",
      "try:",
      "    _s = str(Expense('Tea', 20))",
      "    _s2 = str(Expense('Bus', 45))",
      "except TypeError:",
      "    _t_err = True",
      "if _t_err:",
      "    assert False, \"__str__() must return a string! Use: return f'{self.item} (Rs {self.amount})'\"",
      "assert _s == 'Tea (Rs 20)' and _s2 == 'Bus (Rs 45)', f\"Expected str(Expense('Tea', 20)) == 'Tea (Rs 20)', got {_s!r}\"",
      done
    ),
    aTitle: "Subscription",
    aDesc: "Given an `Expense` class with `item` and `amount`, write `Subscription(Expense)` with a method `yearly_cost()` that returns amount times 12.",
    aStarter: lines("class Expense:", "    def __init__(self, item, amount):", "        self.item = item", "        self.amount = amount", "", "class Subscription(Expense):", "    def yearly_cost(self):", "        # return self.amount * 12", "        pass"),
    aHint: "return self.amount * 12",
    aTest: lines(
      "s = Subscription('Music app', 99)",
      "s2 = Subscription('Cloud', 50)",
      "assert s.item == 'Music app' and s2.item == 'Cloud'",
      "assert s.yearly_cost() == 1188 and s2.yearly_cost() == 600, \"Expected yearly_cost() to return self.amount * 12 (1188)\"",
      "assert isinstance(s, Expense), \"Subscription must inherit from Expense: class Subscription(Expense):\"",
      done
    )
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
    eDesc: "People type amounts with spaces. Write `parse_amount(text)` that removes spaces and returns the amount as a float, or `None` if it is not a number. (Because the browser editor runs automatically without waiting for keyboard typing, this function takes the text that `input()` would return as its `text` parameter.)",
    eStarter: lines("def parse_amount(text):", "    # strip(), then float(), inside try/except", "    pass"),
    eHint: "try: return float(text.strip()) / except ValueError: return None",
    eTest: lines(
      "_fn = globals().get('parse_amount')",
      "_v1 = None; _v2 = None; _v3 = 'UNSET'; _v_err = False",
      "try:",
      "    if callable(_fn):",
      "        _v1 = _fn(' 250 ')",
      "        _v2 = _fn('99.5')",
      "        _v3 = _fn('abc')",
      "except ValueError:",
      "    _v_err = True",
      "if _v_err:",
      "    assert False, \"parse_amount('abc') crashed with ValueError! Catch it with 'except ValueError: return None'.\"",
      "assert _v1 == 250.0 and _v2 == 99.5 and _v3 is None, \"Expected parse_amount(' 250 ') == 250.0, parse_amount('99.5') == 99.5, and parse_amount('abc') is None\"",
      done
    ),
    aTitle: "Menu Choice",
    aDesc: "Write `menu_choice(text)` that returns the number 1, 2 or 3 when the user typed one of them, otherwise `None`. (Just like in Task 1, `text` is the string that `input()` would return.)",
    aStarter: lines("def menu_choice(text):", "    # compare text.strip() with '1', '2', '3'", "    pass"),
    aHint: "value = text.strip(); return int(value) if value in ('1', '2', '3') else None",
    aTest: lines(
      "_fn = globals().get('menu_choice')",
      "_v1 = _fn('2') if callable(_fn) else None",
      "_v2 = _fn(' 3 ') if callable(_fn) else None",
      "_v3 = _fn('7') if callable(_fn) else 'UNSET'",
      "_v4 = _fn('x') if callable(_fn) else 'UNSET'",
      "if _v1 == '2' or _v2 == '3':",
      "    assert False, \"Almost! menu_choice() returned a string ('2') instead of a number (2). Convert it with int().\"",
      "assert _v1 == 2 and _v2 == 3 and _v3 is None and _v4 is None, \"Expected menu_choice('2') == 2, menu_choice(' 3 ') == 3, and None for '7' or 'x'\"",
      done
    )
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
    eStarter: lines("def is_valid_amount(value):", "    # isinstance(value, (int, float)), not isinstance(value, bool), and value > 0", "    pass"),
    eHint: "return isinstance(value, (int, float)) and not isinstance(value, bool) and value > 0",
    eTest: lines(
      "_fn = globals().get('is_valid_amount')",
      "_ok_num = callable(_fn) and _fn(20) is True and _fn(9.5) is True and _fn(0) is False and _fn(-5) is False and _fn('20') is False",
      "assert _ok_num, \"Expected is_valid_amount() to return True for 20 and 9.5, and False for 0, -5, and '20'\"",
      done
    ),
    aTitle: "Your Own Check",
    aDesc: "Write `check_equal(actual, expected)` that returns `True` when they are equal and raises `AssertionError` with the message `'Expected X but got Y'` when they are not.",
    aStarter: lines("def check_equal(actual, expected):", "    # if actual != expected: raise AssertionError(f'Expected {expected} but got {actual}')", "    pass"),
    aHint: "if actual != expected: raise AssertionError(f'Expected {expected} but got {actual}'); return True",
    aTest: lines(
      "assert check_equal(2, 2) is True, \"Expected check_equal(2, 2) to return True\"",
      "raised = False; _err_msg = ''",
      "try:",
      "    check_equal(1, 2)",
      "except AssertionError as err:",
      "    _err_msg = str(err)",
      "    raised = 'Expected 2 but got 1' in _err_msg",
      "if 'Expected 1 but got 2' in _err_msg:",
      "    assert False, \"Almost! You swapped expected and actual in the message. Use: f'Expected {expected} but got {actual}'\"",
      "assert raised, \"Should raise AssertionError('Expected 2 but got 1') when actual=1 and expected=2\"",
      done
    )
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
    eStarter: lines("def is_good_commit_message(msg):", "    # return 10 <= len(msg) <= 72", "    pass"),
    eHint: "return 10 <= len(msg) <= 72",
    eTest: lines(
      "_fn = globals().get('is_good_commit_message')",
      "_v1 = _fn('Add expense summary by category') if callable(_fn) else None",
      "_v2 = _fn('fix') if callable(_fn) else None",
      "assert _v1 is True and _v2 is False, \"Expected is_good_commit_message('Add expense summary by category') is True and is_good_commit_message('fix') is False\"",
      done
    ),
    aTitle: "Branch Name",
    aDesc: "Write `branch_name(task)` that turns `'Add Monthly Report'` into `'feature/add-monthly-report'`.",
    aStarter: lines("def branch_name(task):", "    # lower case, split words and join with '-'", "    pass"),
    aHint: "return 'feature/' + '-'.join(task.lower().split())",
    aTest: lines(
      "_fn = globals().get('branch_name')",
      "_v1 = _fn('Add Monthly Report') if callable(_fn) else None",
      "_v2 = _fn('  Fix  total ') if callable(_fn) else None",
      "assert _v1 == 'feature/add-monthly-report', f\"Expected 'feature/add-monthly-report', got {_v1!r}\"",
      "assert _v2 in ('feature/fix-total', 'feature/fix--total'), f\"Expected 'feature/fix-total', got {_v2!r}\"",
      done
    )
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
    eStarter: lines("def sort_by_date(expenses):", "    # sorted(expenses, key=lambda e: e['date'], reverse=True)", "    pass"),
    eHint: "return sorted(expenses, key=lambda e: e['date'], reverse=True)",
    eTest: lines(
      "data = [{'id': 1, 'date': '2026-09-01'}, {'id': 2, 'date': '2026-09-20'}, {'id': 3, 'date': '2026-09-10'}]",
      "_fn = globals().get('sort_by_date')",
      "_res = _fn(data) if callable(_fn) else None",
      "if _res is None and data[0]['id'] == 2:",
      "    assert False, \"expenses.sort() changes the list in-place and returns None! Use 'return sorted(expenses, key=lambda e: e[\\\"date\\\"], reverse=True)'.\"",
      "if isinstance(_res, list) and [e['id'] for e in _res] == [1, 3, 2]:",
      "    assert False, \"Almost! That sorted oldest-first. Add 'reverse=True' inside sorted() for newest-first.\"",
      "assert isinstance(_res, list) and [e['id'] for e in _res] == [2, 3, 1], \"Expected sort_by_date() to return expenses ordered newest first\"",
      "assert data[0]['id'] == 1, \"The original list was changed\"",
      done
    ),
    aTitle: "Group by Category",
    aDesc: "Write `group_by_category(expenses)` that returns a dictionary like `{'food': ['Tea', 'Lunch'], 'travel': ['Bus']}` with item names.",
    aStarter: lines("def group_by_category(expenses):", "    groups = {}", "    # loop over expenses; if category not in groups, set groups[category] = []", "    return groups"),
    aHint: "for e in expenses: cat = e['category']; if cat not in groups: groups[cat] = []; groups[cat].append(e['item'])",
    aTest: lines(
      "data = [{'item': 'Tea', 'category': 'food'}, {'item': 'Bus', 'category': 'travel'}, {'item': 'Lunch', 'category': 'food'}]",
      "_fn = globals().get('group_by_category')",
      "_res = _fn(data) if callable(_fn) else None",
      "_res_empty = _fn([]) if callable(_fn) else None",
      "_res2 = _fn([{'item': 'Rent', 'category': 'home'}]) if callable(_fn) else None",
      "if isinstance(_res, dict) and isinstance(_res.get('food'), list) and len(_res['food']) > 0 and isinstance(_res['food'][0], dict):",
      "    assert False, \"Almost! Append only the item name e['item'] to each category list, not the whole dictionary e.\"",
      "assert _res == {'food': ['Tea', 'Lunch'], 'travel': ['Bus']} and _res_empty == {} and _res2 == {'home': ['Rent']}, \"Expected {'food': ['Tea', 'Lunch'], 'travel': ['Bus']}\"",
      done
    )
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
    eDesc: "Write `add_expense(expenses, item, amount, category, date)` that returns a NEW list with the new expense added. Give it the next `'id'` (starting at 1, using `max((e['id'] for e in expenses), default=0) + 1` or `len(expenses) + 1`) and remove extra spaces from `item` and `category`.",
    eStarter: lines("def add_expense(expenses, item, amount, category, date):", "    new = {", "        # id, item, amount, category, date", "    }", "    return expenses + [new]"),
    eHint: "next_id = max((e['id'] for e in expenses), default=0) + 1; new = {'id': next_id, 'item': item.strip(), 'amount': amount, 'category': category.strip(), 'date': date}",
    eTest: lines(
      "result = add_expense([], ' Tea ', 20, 'food ', '2026-09-28')",
      "if isinstance(result, list) and len(result) == 1 and isinstance(result[0], dict):",
      "    if result[0].get('item') == ' Tea ' or result[0].get('category') == 'food ':",
      "        assert False, \"Almost! Remove extra spaces from item and category using item.strip() and category.strip().\"",
      "assert result == [{'id': 1, 'item': 'Tea', 'amount': 20, 'category': 'food', 'date': '2026-09-28'}], f\"Unexpected result: {result!r}\"",
      "second = add_expense(result, 'Bus', 45, 'travel', '2026-09-28')",
      "assert second[1]['id'] == 2 and len(result) == 1, \"Expected id 2 on second expense and original list unchanged\"",
      done
    ),
    aTitle: "Format an Expense",
    aDesc: "Write `format_expense(e)` that returns text like `'Tea - Rs 20.00 (food)'`.",
    aStarter: lines("def format_expense(e):", "    # f\"{e['item']} - Rs {e['amount']:.2f} ({e['category']})\"", "    pass"),
    aHint: "return f\"{e['item']} - Rs {e['amount']:.2f} ({e['category']})\"",
    aTest: lines(
      "_fn = globals().get('format_expense')",
      "_res = _fn({'item': 'Tea', 'amount': 20, 'category': 'food'}) if callable(_fn) else None",
      "_res2 = _fn({'item': 'Bus', 'amount': 45.5, 'category': 'travel'}) if callable(_fn) else None",
      "if _res == 'Tea - Rs 20 (food)':",
      "    assert False, \"Almost! Format the amount with 2 decimal places using :.2f -> Rs {e['amount']:.2f}\"",
      "assert _res == 'Tea - Rs 20.00 (food)' and _res2 == 'Bus - Rs 45.50 (travel)', f\"Expected 'Tea - Rs 20.00 (food)', got {_res!r}\"",
      done
    )
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
    eTest: lines(
      "data = [{'item': 'Tea', 'amount': 20}, {'item': 'Rent', 'amount': 8000}, {'item': 'Bus', 'amount': 45}]",
      "_fn = globals().get('summary')",
      "_s1 = None; _s2 = None; _v_err = False",
      "try:",
      "    if callable(_fn):",
      "        _s1 = _fn(data)",
      "        _s2 = _fn([])",
      "except ValueError:",
      "    _v_err = True",
      "if _v_err:",
      "    assert False, \"summary([]) crashed on max() because the list is empty! Check 'if expenses:' before calling max(), and use None when empty.\"",
      "if isinstance(_s1, dict) and _s1.get('biggest') == 8000:",
      "    assert False, \"Almost! 'biggest' should be the item name ('Rent'), not the amount (8000).\"",
      "assert _s1 == {'total': 8065, 'count': 3, 'biggest': 'Rent'}, f\"Expected {{'total': 8065, 'count': 3, 'biggest': 'Rent'}}, got {_s1!r}\"",
      "assert _s2 == {'total': 0, 'count': 0, 'biggest': None}, f\"Expected {{'total': 0, 'count': 0, 'biggest': None}} for [], got {_s2!r}\"",
      done
    ),
    aTitle: "Totals per Category",
    aDesc: "Write `category_totals(expenses)` that returns a dictionary like `{'food': 170, 'travel': 45}`.",
    aStarter: lines("def category_totals(expenses):", "    totals = {}", "    # add each amount to totals[category]", "    return totals"),
    aHint: "totals[e['category']] = totals.get(e['category'], 0) + e['amount']",
    aTest: lines(
      "data = [{'category': 'food', 'amount': 20}, {'category': 'travel', 'amount': 45}, {'category': 'food', 'amount': 150}]",
      "assert category_totals(data) == {'food': 170, 'travel': 45} and category_totals([]) == {} and category_totals([{'category': 'bills', 'amount': 300}]) == {'bills': 300}, \"Expected {'food': 170, 'travel': 45}\"",
      done
    )
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
    eStarter: lines("def parse_results(data):", "    # return data.get('results', [])", "    pass"),
    eHint: "return data.get('results', [])",
    eTest: lines(
      "_fn = globals().get('parse_results')",
      "_r1 = None; _r2 = None; _k_err = False",
      "try:",
      "    if callable(_fn):",
      "        _r1 = _fn({'results': [1, 2]})",
      "        _r2 = _fn({})",
      "except KeyError:",
      "    _k_err = True",
      "if _k_err:",
      "    assert False, \"KeyError when 'results' is missing! Use data.get('results', []) so a missing key returns [].\"",
      "assert _r1 == [1, 2] and _r2 == [], \"Expected parse_results({'results': [1, 2]}) == [1, 2] and parse_results({}) == []\"",
      done
    ),
    aTitle: "Status Message",
    aDesc: "Write `status_message(code)` that returns `'OK'` for 200, `'Not found'` for 404, and `'Something went wrong'` for anything else.",
    aStarter: lines("def status_message(code):", "    # check 200, 404, and anything else", "    pass"),
    aHint: "if code == 200: return 'OK'; if code == 404: return 'Not found'; return 'Something went wrong'",
    aTest: lines(
      "_fn = globals().get('status_message')",
      "_s1 = _fn(200) if callable(_fn) else None",
      "_s2 = _fn(404) if callable(_fn) else None",
      "_s3 = _fn(500) if callable(_fn) else None",
      "assert isinstance(_s1, str) and _s1.upper() == 'OK', \"Expected 'OK' for 200\"",
      "assert isinstance(_s2, str) and _s2.lower() == 'not found', \"Expected 'Not found' for 404\"",
      "assert isinstance(_s3, str) and _s3.lower() == 'something went wrong', \"Expected 'Something went wrong' for 500\"",
      done
    )
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
    eStarter: lines("def validate_expense(data):", "    errors = []", "    # append 'item is required' and/or 'amount must be more than 0'", "    return errors"),
    eHint: "if not str(data.get('item', '')).strip(): errors.append('item is required'); amount = data.get('amount'); if not isinstance(amount, (int, float)) or amount <= 0: errors.append('amount must be more than 0')",
    eTest: lines(
      "_fn = globals().get('validate_expense')",
      "_v1 = None; _v2 = None; _v3 = None; _t_err = False",
      "try:",
      "    if callable(_fn):",
      "        _v1 = _fn({'item': 'Tea', 'amount': 20})",
      "        _v2 = _fn({'item': ' ', 'amount': 0})",
      "        _v3 = _fn({})",
      "except TypeError:",
      "    _t_err = True",
      "if _t_err:",
      "    assert False, \"TypeError when 'amount' is missing (None)! Use data.get('amount', 0) <= 0 or check isinstance(amount, (int, float)) first.\"",
      "assert _v1 == [] and _v2 == ['item is required', 'amount must be more than 0'] and _v3 == ['item is required', 'amount must be more than 0'], \"Expected [] for valid data and ['item is required', 'amount must be more than 0'] when both are invalid\"",
      done
    ),
    aTitle: "Pages of Results (Building Your Own API with FastAPI)",
    aDesc: "APIs send long lists in pages. Write `paginate(items, page, size)` that returns the items for that page, where page 1 is the first page.",
    aStarter: lines("def paginate(items, page, size):", "    # start = (page - 1) * size", "    pass"),
    aHint: "start = (page - 1) * size; return items[start:start + size]",
    aTest: lines(
      "items = list(range(1, 8))",
      "_fn = globals().get('paginate')",
      "_p1 = _fn(items, 1, 3) if callable(_fn) else None",
      "if _p1 == [4, 5, 6]:",
      "    assert False, \"Almost! Page 1 should start at index 0. Use start = (page - 1) * size.\"",
      "assert _p1 == [1, 2, 3] and _fn(items, 3, 3) == [7] and _fn(items, 4, 3) == [], \"Expected paginate(items, 1, 3) == [1, 2, 3], page 3 == [7], page 4 == []\"",
      done
    )
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
    eHint: "Lists start at position 0, not 1: use range(len(expenses)) or range(0, len(expenses)).",
    eTest: lines(
      "_res = total_amount([{'amount': 100}, {'amount': 200}, {'amount': 300}])",
      "_res2 = total_amount([{'amount': 20}, {'amount': 45}])",
      "if _res == 500:",
      "    assert False, \"total_amount() returned 500 instead of 600 because range(1, len(expenses)) skips index 0! Change 1 to 0.\"",
      "assert _res == 600 and _res2 == 65 and total_amount([]) == 0, f'Expected 600, got {_res}'",
      done
    ),
    aTitle: "Find the Bad Record",
    aDesc: "Write `first_invalid(expenses)` that returns the first expense whose amount is 0 or less, or `None` if all are fine.",
    aStarter: lines("def first_invalid(expenses):", "    # return the first expense with e['amount'] <= 0, or None", "    pass"),
    aHint: "for e in expenses: if e['amount'] <= 0: return e. After the loop, return None.",
    aTest: lines(
      "data = [{'id': 1, 'amount': 20}, {'id': 2, 'amount': 0}, {'id': 3, 'amount': -5}]",
      "_r1 = first_invalid(data)",
      "_r2 = first_invalid([{'id': 1, 'amount': 5}])",
      "if isinstance(_r1, dict) and _r1.get('id') == 3:",
      "    assert False, \"Almost! An amount of 0 is also invalid. Check 'if e[\\\"amount\\\"] <= 0:' instead of '< 0'.\"",
      "assert isinstance(_r1, dict) and _r1.get('id') == 2 and _r2 is None, \"Expected first_invalid(data) to return {'id': 2, 'amount': 0} and None when all are valid\"",
      done
    )
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
    eStarter: lines("def base_url(env):", "    # check if env == 'production'", "    pass"),
    eHint: "return 'https://expense-api.onrender.com' if env == 'production' else 'http://127.0.0.1:8000'",
    eTest: lines(
      "assert base_url('production') == 'https://expense-api.onrender.com', \"Expected 'https://expense-api.onrender.com' for 'production'\"",
      "assert base_url('development') == 'http://127.0.0.1:8000', \"Expected 'http://127.0.0.1:8000' for 'development'\"",
      done
    ),
    aTitle: "README Checker",
    aDesc: "Write `missing_sections(readme)` that returns which of `'## About'`, `'## Features'`, `'## Setup'` are missing from the README text, in that order.",
    aStarter: lines("def missing_sections(readme):", "    needed = ['## About', '## Features', '## Setup']", "    # return [s for s in needed if s not in readme]", "    pass"),
    aHint: "return [s for s in needed if s not in readme]",
    aTest: lines(
      "text = '# Expense API\\n## About\\nTrack spending\\n## Setup\\npip install -r requirements.txt'",
      "assert missing_sections(text) == ['## Features'] and missing_sections('## About\\n## Features\\n## Setup') == [] and missing_sections('') == ['## About', '## Features', '## Setup'], \"Expected ['## Features']\"",
      done
    )
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
    eTest: lines(
      "_fn = globals().get('fizz_buzz')",
      "_f15 = _fn(15) if callable(_fn) else None",
      "_f9 = _fn(9) if callable(_fn) else None",
      "_f10 = _fn(10) if callable(_fn) else None",
      "_f7 = _fn(7) if callable(_fn) else None",
      "if _f15 in ('Fizz', 'Buzz'):",
      "    assert False, \"fizz_buzz(15) returned \" + repr(_f15) + \" instead of 'FizzBuzz'! Check 'if n % 3 == 0 and n % 5 == 0:' FIRST.\"",
      "assert _f15 == 'FizzBuzz' and _f9 == 'Fizz' and _f10 == 'Buzz' and str(_f7) == '7' and _f7 is not None, \"Expected fizz_buzz(15)=='FizzBuzz', (9)=='Fizz', (10)=='Buzz', (7)=='7'\"",
      done
    ),
    aTitle: "Reverse the Words",
    aDesc: "Write `reverse_words(sentence)` that reverses the order of the words. Example: `'I love Python'` gives `'Python love I'`.",
    aStarter: lines("def reverse_words(sentence):", "    # split, reverse, join", "    pass"),
    aHint: "return ' '.join(reversed(sentence.split()))",
    aTest: lines(
      "_fn = globals().get('reverse_words')",
      "_r = _fn('I love Python') if callable(_fn) else None",
      "_r2 = _fn('hello world') if callable(_fn) else None",
      "if _r == 'nohtyP evol I':",
      "    assert False, \"That reversed the letters ('nohtyP evol I') instead of the words! Split into words first: ' '.join(sentence.split()[::-1]).\"",
      "assert _r == 'Python love I' and _r2 == 'world hello', f\"Expected 'Python love I', got {_r!r}\"",
      done
    )
  }
];

export const PYTHON_30_DAYS_QUESTS: CourseQuest[] = PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('python', idx + 1, cfg)
);
