import { DayLessonPlan } from '../types/lessonEngine';

export const PYTHON_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Program Execution, print(), Case-Sensitivity & Comments",
    "overviewMetaphor": "A Python program is like a cooking recipe: the Python interpreter reads your instructions line by line from top to bottom, executing each step exactly in order.",
    "blocks": [
      {
        "id": "py-d1-b1-execution-order",
        "day": 1,
        "blockNumber": 1,
        "title": "What is an Instruction? (Top-to-Bottom Flow)",
        "conceptBudget": {
          "primaryConcept": "Sequential Execution",
          "supportingTerms": [
            "Line-by-Line",
            "Interpreter"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Musical Playlist",
            "simpleExplanation": "A music player plays song 1, then song 2, then song 3 in exact order. Python runs line 1, then line 2, then line 3."
          },
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Sequential Program Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Line 1: print('Step 1: Boil water')",
                  "kind": "process"
                },
                {
                  "id": "2",
                  "label": "Line 2: print('Step 2: Add tea leaves')",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Line 3: print('Step 3: Pour cup')",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "recipe.py",
            "initialCode": "print('Step 1: Boil water')\nprint('Step 2: Add tea leaves')\nprint('Step 3: Pour cup')",
            "expectedOutput": "Step 1: Boil water\nStep 2: Add tea leaves\nStep 3: Pour cup",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "If line 1 prints 'Apple' and line 2 prints 'Banana', what prints first?",
          "expectedStringOutput": "Apple",
          "acceptableAnswers": [
            "Apple",
            "apple",
            "'Apple'"
          ],
          "primaryMisconceptionId": "MC_PY_EXECUTION_ORDER",
          "diagnosisMap": {
            "Banana": {
              "misconceptionId": "MC_PY_EXECUTION_ORDER",
              "errorExplanation": "Python executes line 1 before line 2.",
              "recoveryPath": {
                "simplerExplanation": "Python reads from top to bottom, like reading a book.",
                "guidedFixPrompt": "Type Apple"
              }
            }
          }
        }
      },
      {
        "id": "py-d1-b2-print-function",
        "day": 1,
        "blockNumber": 2,
        "title": "The print() Function — Displaying Messages",
        "conceptBudget": {
          "primaryConcept": "print() Function",
          "supportingTerms": [
            "Parentheses ()",
            "String Arguments"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d1-b1-execution-order",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Megaphone",
            "simpleExplanation": "The print() function is a megaphone: whatever you put inside its parentheses gets spoken out loud to the terminal screen."
          },
          {
            "type": "syntax_anatomy",
            "title": "print() Syntax",
            "codeSnippet": "print('Hello, Python!')",
            "lineNotes": {
              "1": "print is the command; parentheses () hold what to display; quotes '' surround text."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hello.py",
            "initialCode": "print('Hello, Python!')\nprint('Welcome to PinIT Career OS!')",
            "expectedOutput": "Hello, Python!\nWelcome to PinIT Career OS!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is required to print text in Python?",
          "options": [
            "Surrounding the text with quotes like print('Hello')",
            "Writing the text without quotes like print(Hello)",
            "Ending every line with a semicolon ;"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_MISSING_QUOTES_STRING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_MISSING_QUOTES_STRING",
              "errorExplanation": "Text without quotes is treated as a variable name and triggers NameError.",
              "recoveryPath": {
                "simplerExplanation": "Quotes ' ' tell Python: this is raw text words, not a code command.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d1-b3-case-sensitivity",
        "day": 1,
        "blockNumber": 3,
        "title": "Case Sensitivity (print vs Print vs PRINT)",
        "conceptBudget": {
          "primaryConcept": "Case Sensitivity",
          "supportingTerms": [
            "Lowercase",
            "NameError"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d1-b2-print-function",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Locked Password",
            "simpleExplanation": "A password with lowercase letters will reject uppercase. Python treats 'print' and 'Print' as completely different words."
          },
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Case Sensitivity Error & Fix",
              "brokenCode": "Print('Hello World')  # ❌ NameError: name 'Print' is not defined",
              "fixedCode": "print('Hello World')  # ✅ Correct lowercase function call",
              "errorLine": 1,
              "errorReason": "Python built-in keywords and functions are strictly lowercase.",
              "fixExplanation": "Change capital 'P' to lowercase 'p'."
            }
          },
          {
            "type": "runnable_code",
            "filename": "casing.py",
            "initialCode": "print('Lowercase print works!')",
            "expectedOutput": "Lowercase print works!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which of the following will run without error in Python?",
          "options": [
            "print('Hello')",
            "Print('Hello')",
            "PRINT('Hello')"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_PRINT_CASE_SENSITIVITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_PRINT_CASE_SENSITIVITY",
              "errorExplanation": "Python is case-sensitive: Print with capital P is undefined.",
              "recoveryPath": {
                "simplerExplanation": "Python commands are strictly lowercase.",
                "guidedFixPrompt": "Select Option A: print('Hello')"
              }
            }
          }
        }
      },
      {
        "id": "py-d1-b4-comments",
        "day": 1,
        "blockNumber": 4,
        "title": "Single-Line Comments (#)",
        "conceptBudget": {
          "primaryConcept": "Code Comments",
          "supportingTerms": [
            "Hash Symbol #",
            "Ignored by Interpreter"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d1-b1-execution-order",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Sticky Notes on a Document",
            "simpleExplanation": "Sticky notes explain the document to human readers. Python completely skips any line starting with #."
          },
          {
            "type": "syntax_anatomy",
            "title": "Comment Syntax",
            "codeSnippet": "# This is a note for developers\nprint('Visible Output')",
            "lineNotes": {
              "1": "Lines starting with # are skipped by the interpreter.",
              "2": "This line executes normally."
            }
          },
          {
            "type": "runnable_code",
            "filename": "comments.py",
            "initialCode": "# Calculate discount\nprint('Total: $50')",
            "expectedOutput": "Total: $50",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is printed by: # print('Hidden')\\nprint('Shown')",
          "expectedStringOutput": "Shown",
          "acceptableAnswers": [
            "Shown",
            "shown"
          ],
          "primaryMisconceptionId": "MC_PY_EXECUTION_ORDER",
          "diagnosisMap": {
            "Hidden": {
              "misconceptionId": "MC_PY_EXECUTION_ORDER",
              "errorExplanation": "The line with # is a comment and was completely ignored by Python.",
              "recoveryPath": {
                "simplerExplanation": "# means Python ignores the line entirely.",
                "guidedFixPrompt": "Type Shown"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Variables, Dynamic Typing & The type() Function",
    "overviewMetaphor": "A variable is like a sticky label attached to a box in memory: name = 'Alex' sticks the name tag 'name' onto the string object 'Alex'.",
    "blocks": [
      {
        "id": "py-d2-b1-variables",
        "day": 2,
        "blockNumber": 1,
        "title": "Variable Assignment with =",
        "conceptBudget": {
          "primaryConcept": "Variable Assignment",
          "supportingTerms": [
            "Identifier",
            "Assignment Operator ="
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d1-b2-print-function",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Labeled Storage Box",
            "simpleExplanation": "Creating age = 25 is like labeling a box 'age' and putting the number 25 inside it."
          },
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Variable Memory Binding",
              "boxes": [
                {
                  "label": "user_name",
                  "value": "'Sarah'",
                  "varType": "str",
                  "isUpdated": false
                },
                {
                  "label": "user_age",
                  "value": "21",
                  "varType": "int",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "variables.py",
            "initialCode": "score = 100\nprint('Score:', score)\nscore = 150\nprint('Updated Score:', score)",
            "expectedOutput": "Score: 100\nUpdated Score: 150",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "If x = 10 and then x = 20, what does print(x) display?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20"
          ],
          "primaryMisconceptionId": "MC_PY_VARIABLE_REASSIGNMENT",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_PY_VARIABLE_REASSIGNMENT",
              "errorExplanation": "Assigning x = 20 overwrites the previous value 10 in variable x.",
              "recoveryPath": {
                "simplerExplanation": "Variables hold the LATEST value assigned to them.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      },
      {
        "id": "py-d2-b2-data-types",
        "day": 2,
        "blockNumber": 2,
        "title": "Core Data Types: int, float, str, bool",
        "conceptBudget": {
          "primaryConcept": "Primitive Data Types",
          "supportingTerms": [
            "int",
            "float",
            "str",
            "bool"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d2-b1-variables",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Item Categorization in a Pantry",
            "simpleExplanation": "Whole apples (int), liquid liters (float), labels on jars (str), and light switch ON/OFF (bool)."
          },
          {
            "type": "syntax_anatomy",
            "title": "Data Type Declarations",
            "codeSnippet": "items = 5        # int (whole number)\nprice = 19.99    # float (decimal)\nlabel = 'Book'   # str (text)\nin_stock = True  # bool (True/False)",
            "lineNotes": {
              "1": "int for integer counts.",
              "2": "float for decimal numbers.",
              "3": "str for text inside quotes.",
              "4": "bool for True or False (capitalized)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "types_demo.py",
            "initialCode": "print(type(42))\nprint(type(3.14))\nprint(type('Hello'))\nprint(type(True))",
            "expectedOutput": "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the data type of the value 3.14 in Python?",
          "options": [
            "float",
            "int",
            "str"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_DYNAMIC_TYPE_MISMATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_DYNAMIC_TYPE_MISMATCH",
              "errorExplanation": "Numbers with decimal points are float, not int.",
              "recoveryPath": {
                "simplerExplanation": "int = whole numbers (5); float = decimals (3.14).",
                "guidedFixPrompt": "Select Option A: float"
              }
            }
          }
        }
      },
      {
        "id": "py-d2-b3-dynamic-typing",
        "day": 2,
        "blockNumber": 3,
        "title": "Dynamic Typing in Python",
        "conceptBudget": {
          "primaryConcept": "Dynamic Typing",
          "supportingTerms": [
            "Rebinding",
            "Runtime Type"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d2-b2-data-types",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Swappable Label",
            "simpleExplanation": "In Python, a variable can point to a number on line 1, and be rebound to point to text on line 2."
          },
          {
            "type": "runnable_code",
            "filename": "dynamic.py",
            "initialCode": "data = 100\nprint('data is:', type(data))\ndata = 'Now I am a string'\nprint('data is now:', type(data))",
            "expectedOutput": "data is: <class 'int'>\ndata is now: <class 'str'>",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In Python, can a variable holding an integer later hold a string?",
          "options": [
            "Yes, Python variables dynamically rebind to any type",
            "No, Python variables are permanently locked to one type",
            "Only if you declare it with var"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_DYNAMIC_TYPE_MISMATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_DYNAMIC_TYPE_MISMATCH",
              "errorExplanation": "Python is dynamically typed; variables can hold any object type.",
              "recoveryPath": {
                "simplerExplanation": "Python variable names are just tags that can point to any new object.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "User Input, String Parsing & Type Casting (int, float, str)",
    "overviewMetaphor": "The input() function is a doorway: whatever comes through from the keyboard ALWAYS arrives as a string of text, even if the user typed numbers.",
    "blocks": [
      {
        "id": "py-d3-b1-input-returns-str",
        "day": 3,
        "blockNumber": 1,
        "title": "The input() Function & The String Trap",
        "conceptBudget": {
          "primaryConcept": "input() Return Type",
          "supportingTerms": [
            "Keyboard Buffer",
            "Text String '25' vs Number 25"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d2-b2-data-types",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Fax Machine",
            "simpleExplanation": "A fax machine sends letters printed on paper. Even if someone faxes you a number '25', it arrives as printed text on paper, not a real math coin."
          },
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Input String Concatenation Trap",
              "brokenCode": "age = input()  # User types 25 -> age is '25'\nprint(age + 5) # ❌ TypeError: can only concatenate str (not 'int') to str",
              "fixedCode": "age = int(input()) # Converts '25' to integer 25\nprint(age + 5)     # ✅ Output: 30",
              "errorLine": 2,
              "errorReason": "input() returns string text; adding integer causes TypeError.",
              "fixExplanation": "Wrap input() with int() to convert text to number."
            }
          },
          {
            "type": "runnable_code",
            "filename": "input_demo.py",
            "initialCode": "simulated_input = '42'\nval = int(simulated_input)\nprint('Value + 10 =', val + 10)",
            "expectedOutput": "Value + 10 = 52",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "If a user enters 50 into input(), what data type does Python return?",
          "options": [
            "str (string '50')",
            "int (number 50)",
            "float (50.0)"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_INPUT_RETURNS_STR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_INPUT_RETURNS_STR",
              "errorExplanation": "input() ALWAYS returns a string, never an integer.",
              "recoveryPath": {
                "simplerExplanation": "input() treats everything typed as text characters.",
                "guidedFixPrompt": "Select Option A: str"
              }
            }
          }
        }
      },
      {
        "id": "py-d3-b2-type-casting",
        "day": 3,
        "blockNumber": 2,
        "title": "Explicit Type Casting: int(), float(), str()",
        "conceptBudget": {
          "primaryConcept": "Type Conversion Functions",
          "supportingTerms": [
            "int()",
            "float()",
            "str()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d3-b1-input-returns-str",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Melting Mold",
            "simpleExplanation": "Pouring metal letters '42' into a number mold produces a solid math integer 42."
          },
          {
            "type": "syntax_anatomy",
            "title": "Type Casting Functions",
            "codeSnippet": "num = int('25')      # '25' -> 25\ndec = float('19.99') # '19.99' -> 19.99\ntxt = str(100)       # 100 -> '100'",
            "lineNotes": {
              "1": "int() converts valid numeric string to whole number.",
              "2": "float() converts decimal string to floating-point number.",
              "3": "str() converts any value to string text."
            }
          },
          {
            "type": "runnable_code",
            "filename": "casting.py",
            "initialCode": "a = int('15')\nb = float('3.5')\nprint('Sum:', a + b)",
            "expectedOutput": "Sum: 18.5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the output of print(int('20') + int('30'))?",
          "expectedStringOutput": "50",
          "acceptableAnswers": [
            "50"
          ],
          "primaryMisconceptionId": "MC_PY_STR_INT_CONCAT_TYPE_ERROR",
          "diagnosisMap": {
            "2030": {
              "misconceptionId": "MC_PY_STR_INT_CONCAT_TYPE_ERROR",
              "errorExplanation": "int() converted both strings to numbers before adding: 20 + 30 = 50.",
              "recoveryPath": {
                "simplerExplanation": "int('20') is number 20. 20 + 30 = 50.",
                "guidedFixPrompt": "Type 50"
              }
            }
          }
        }
      },
      {
        "id": "py-d3-b3-value-error-trap",
        "day": 3,
        "blockNumber": 3,
        "title": "The ValueError Casting Trap",
        "conceptBudget": {
          "primaryConcept": "ValueError on Invalid Conversion",
          "supportingTerms": [
            "Non-Numeric Text",
            "Exception"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d3-b2-type-casting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Invalid String to Int Crash",
              "brokenCode": "val = int('hello') # ❌ ValueError: invalid literal for int() with base 10: 'hello'",
              "fixedCode": "val = int('123')   # ✅ Valid numeric characters convert cleanly",
              "errorLine": 1,
              "errorReason": "Text letters cannot be converted into base-10 integers.",
              "fixExplanation": "Only pass digits ('0'-'9') to int()."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_cast.py",
            "initialCode": "s = '99'\nif s.isdigit():\n    print('Converted:', int(s))\nelse:\n    print('Cannot convert non-digits')",
            "expectedOutput": "Converted: 99",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if you run int('abc') in Python?",
          "options": [
            "Python raises a ValueError and stops execution",
            "Python returns 0",
            "Python returns 'abc'"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_TYPE_CAST_VALUE_ERROR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_TYPE_CAST_VALUE_ERROR",
              "errorExplanation": "Python does not guess 0; it raises a ValueError when text cannot be converted.",
              "recoveryPath": {
                "simplerExplanation": "Python halts with an error if the text contains non-numbers.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Arithmetic Operations, Float Division /, Floor Division // & Modulo %",
    "overviewMetaphor": "Dividing 7 cookies among 2 children: / gives each child 3.5 cookies (float), // gives each child 3 whole cookies (floor), and % leaves 1 leftover cookie in the jar (modulo remainder).",
    "blocks": [
      {
        "id": "py-d4-b1-slash-vs-doubleslash",
        "day": 4,
        "blockNumber": 1,
        "title": "Float Division (/) vs Floor Division (//)",
        "conceptBudget": {
          "primaryConcept": "Division Modes",
          "supportingTerms": [
            "/ always returns float",
            "// drops decimal remainder"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d2-b2-data-types",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Slicing Pizza vs Whole Boxes",
            "simpleExplanation": "/ cuts slices to give exact fractions (3.5). // only gives whole uncut slices (3)."
          },
          {
            "type": "syntax_anatomy",
            "title": "Division Operators",
            "codeSnippet": "exact = 7 / 2   # 3.5 (float)\nwhole = 7 // 2  # 3 (int - drops remainder)",
            "lineNotes": {
              "1": "/ always produces a float in Python 3.",
              "2": "// truncates toward negative infinity (floor)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "division.py",
            "initialCode": "print('7 / 2 =', 7 / 2)\nprint('7 // 2 =', 7 // 2)",
            "expectedOutput": "7 / 2 = 3.5\n7 // 2 = 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the output of print(9 // 2)?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4"
          ],
          "primaryMisconceptionId": "MC_PY_INTEGER_DIVISION_SLASH",
          "diagnosisMap": {
            "4.5": {
              "misconceptionId": "MC_PY_INTEGER_DIVISION_SLASH",
              "errorExplanation": "// is floor division; it drops the decimal .5 to give 4.",
              "recoveryPath": {
                "simplerExplanation": "// gives only the whole number part.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "py-d4-b2-modulo",
        "day": 4,
        "blockNumber": 2,
        "title": "The Modulo Remainder Operator (%)",
        "conceptBudget": {
          "primaryConcept": "Modulo Remainder",
          "supportingTerms": [
            "Remainder",
            "Parity Check (n % 2 == 0)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d4-b1-slash-vs-doubleslash",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Leftover Coins from a Vending Machine",
            "simpleExplanation": "If an item costs $4 and you insert $10, you buy 2 items ($8) and get $2 leftover remainder."
          },
          {
            "type": "runnable_code",
            "filename": "modulo.py",
            "initialCode": "print('10 % 3 =', 10 % 3)\nprint('8 % 2 =', 8 % 2)",
            "expectedOutput": "10 % 3 = 1\n8 % 2 = 0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is 14 % 5?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4"
          ],
          "primaryMisconceptionId": "MC_PY_MODULO_REMAINDER",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_PY_MODULO_REMAINDER",
              "errorExplanation": "5 goes into 14 two times (10), leaving 4 as remainder.",
              "recoveryPath": {
                "simplerExplanation": "14 - 10 = 4 leftover remainder.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "py-d4-b3-precedence",
        "day": 4,
        "blockNumber": 3,
        "title": "Operator Precedence & Parentheses ()",
        "conceptBudget": {
          "primaryConcept": "Order of Operations (PEMDAS)",
          "supportingTerms": [
            "Parentheses Override",
            "Multiplication before Addition"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d4-b2-modulo",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Precedence Bug & Fix",
              "brokenCode": "total = 10 + 5 * 2   # Output: 20 (5 * 2 evaluated first)",
              "fixedCode": "total = (10 + 5) * 2 # Output: 30 (Parentheses evaluated first)",
              "errorLine": 1,
              "errorReason": "* has higher precedence than +.",
              "fixExplanation": "Use () around 10 + 5 to calculate sum first."
            }
          },
          {
            "type": "runnable_code",
            "filename": "precedence.py",
            "initialCode": "print('10 + 5 * 2 =', 10 + 5 * 2)\nprint('(10 + 5) * 2 =', (10 + 5) * 2)",
            "expectedOutput": "10 + 5 * 2 = 20\n(10 + 5) * 2 = 30",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the output of print(2 + 3 * 4)?",
          "expectedStringOutput": "14",
          "acceptableAnswers": [
            "14"
          ],
          "primaryMisconceptionId": "MC_PY_OPERATOR_PRECEDENCE",
          "diagnosisMap": {
            "20": {
              "misconceptionId": "MC_PY_OPERATOR_PRECEDENCE",
              "errorExplanation": "Multiplication happens before addition: 3 * 4 = 12; 2 + 12 = 14.",
              "recoveryPath": {
                "simplerExplanation": "Multiply first: 3*4=12, then add 2 = 14.",
                "guidedFixPrompt": "Type 14"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Interactive Decision Console & Rule Engine",
    "overviewMetaphor": "Milestone 1 — Decision Engine: An if/elif/else ladder is like a security guard checking credentials at a building door: if VIP pass -> enter penthouse; elif regular ticket -> enter lobby; else -> reject entry.",
    "blocks": [
      {
        "id": "py-d5-b1-if-condition",
        "day": 5,
        "blockNumber": 1,
        "title": "The if Statement & Indentation Blocks",
        "conceptBudget": {
          "primaryConcept": "if Condition & Indentation",
          "supportingTerms": [
            "Colon :",
            "4-Space Indentation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d4-b3-precedence",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Door with a Passcode",
            "simpleExplanation": "If the passcode matches (True), the door opens and you step inside (indented block). If False, you skip the room entirely."
          },
          {
            "type": "syntax_anatomy",
            "title": "if Statement Syntax",
            "codeSnippet": "score = 85\nif score >= 50:\n    print('Pass') # Indented with 4 spaces",
            "lineNotes": {
              "2": "if statement must end with colon :",
              "3": "Code inside if block MUST be indented by 4 spaces."
            }
          },
          {
            "type": "runnable_code",
            "filename": "if_demo.py",
            "initialCode": "score = 85\nif score >= 50:\n    print('Status: PASS')\nprint('Check complete.')",
            "expectedOutput": "Status: PASS\nCheck complete.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does Python know which lines of code belong inside an if statement?",
          "options": [
            "By looking at the indentation (4 spaces) of the lines",
            "By looking for curly braces { }",
            "By looking for the word 'then'"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_INDENTATION_SYNTAX",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_INDENTATION_SYNTAX",
              "errorExplanation": "Python uses indentation (spaces), NOT curly braces { }.",
              "recoveryPath": {
                "simplerExplanation": "Python defines code blocks with 4-space indentation.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d5-b2-else-branch",
        "day": 5,
        "blockNumber": 2,
        "title": "The else Fallback Branch",
        "conceptBudget": {
          "primaryConcept": "else Branch",
          "supportingTerms": [
            "Fallback",
            "Mutually Exclusive"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d5-b1-if-condition",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Two-Fork Road",
            "simpleExplanation": "A car can go left OR right, but never both at the same time. If condition is False, the else path is taken."
          },
          {
            "type": "runnable_code",
            "filename": "else_demo.py",
            "initialCode": "age = 16\nif age >= 18:\n    print('Eligible to vote')\nelse:\n    print('Too young to vote')",
            "expectedOutput": "Too young to vote",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is printed by: x = 5\\nif x > 10: print('High')\\nelse: print('Low')",
          "expectedStringOutput": "Low",
          "acceptableAnswers": [
            "Low",
            "low"
          ],
          "primaryMisconceptionId": "MC_PY_ELSE_BRANCH_LOGIC",
          "diagnosisMap": {
            "High": {
              "misconceptionId": "MC_PY_ELSE_BRANCH_LOGIC",
              "errorExplanation": "5 is not greater than 10, so the else branch executes.",
              "recoveryPath": {
                "simplerExplanation": "Condition is False -> else runs.",
                "guidedFixPrompt": "Type Low"
              }
            }
          }
        }
      },
      {
        "id": "py-d5-b3-elif-ladder",
        "day": 5,
        "blockNumber": 3,
        "title": "Multi-Way Decisions with elif",
        "conceptBudget": {
          "primaryConcept": "elif (else-if) Ladders",
          "supportingTerms": [
            "Sequential Check",
            "First Match Wins"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d5-b2-else-branch",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "elif Ladder",
            "codeSnippet": "score = 82\nif score >= 90:\n    print('Grade: A')\nelif score >= 80:\n    print('Grade: B')\nelse:\n    print('Grade: C')",
            "lineNotes": {
              "3": "elif checks the next condition only if previous condition was False."
            }
          },
          {
            "type": "runnable_code",
            "filename": "grade.py",
            "initialCode": "score = 82\nif score >= 90:\n    print('Grade A')\nelif score >= 80:\n    print('Grade B')\nelse:\n    print('Grade C')",
            "expectedOutput": "Grade B",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In the grade code above for score = 82, what is printed?",
          "expectedStringOutput": "Grade B",
          "acceptableAnswers": [
            "Grade B",
            "B"
          ],
          "primaryMisconceptionId": "MC_PY_ELIF_ORDER_PRECEDENCE",
          "diagnosisMap": {
            "Grade A": {
              "misconceptionId": "MC_PY_ELIF_ORDER_PRECEDENCE",
              "errorExplanation": "82 is less than 90, so the first if fails. It matches score >= 80.",
              "recoveryPath": {
                "simplerExplanation": "82 matches the elif score >= 80 branch.",
                "guidedFixPrompt": "Type Grade B"
              }
            }
          }
        }
      },
      {
        "id": "py-d5-b4-boolean-operators",
        "day": 5,
        "blockNumber": 4,
        "title": "Boolean Logic: and, or, not",
        "conceptBudget": {
          "primaryConcept": "Boolean Logical Operators",
          "supportingTerms": [
            "and (both)",
            "or (either)",
            "not (invert)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d5-b3-elif-ladder",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Boarding an Airplane",
            "simpleExplanation": "You need a Ticket AND a Passport to board (both required). You can pay with Cash OR Card (either is fine)."
          },
          {
            "type": "runnable_code",
            "filename": "logic.py",
            "initialCode": "has_ticket = True\nhas_id = True\nif has_ticket and has_id:\n    print('Boarding Approved')",
            "expectedOutput": "Boarding Approved",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the result of: print(True and False)?",
          "expectedStringOutput": "False",
          "acceptableAnswers": [
            "False",
            "false"
          ],
          "primaryMisconceptionId": "MC_PY_LOGICAL_AND_SHORT_CIRCUIT",
          "diagnosisMap": {
            "True": {
              "misconceptionId": "MC_PY_LOGICAL_AND_SHORT_CIRCUIT",
              "errorExplanation": "and requires BOTH sides to be True. Since right side is False, result is False.",
              "recoveryPath": {
                "simplerExplanation": "True and False evaluates to False.",
                "guidedFixPrompt": "Type False"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "The while Loop & Sentinel Input Validation",
    "overviewMetaphor": "A while loop is like a security turnstile: WHILE your ticket is valid, it keeps letting you through again and again until the condition becomes False.",
    "blocks": [
      {
        "id": "py-d6-b1-while-syntax",
        "day": 6,
        "blockNumber": 1,
        "title": "The while Loop Syntax & Condition Check",
        "conceptBudget": {
          "primaryConcept": "while Loop",
          "supportingTerms": [
            "Loop Header",
            "Iteration"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d5-b1-if-condition",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "while Loop Syntax",
            "codeSnippet": "count = 1\nwhile count <= 3:\n    print('Count:', count)\n    count += 1 # Critical: update to avoid infinite loop!",
            "lineNotes": {
              "2": "while condition re-checks before each iteration.",
              "4": "Updating count moves it toward termination."
            }
          },
          {
            "type": "runnable_code",
            "filename": "while_demo.py",
            "initialCode": "count = 1\nwhile count <= 3:\n    print('Tick', count)\n    count += 1",
            "expectedOutput": "Tick 1\nTick 2\nTick 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many times does print('Tick') run when count starts at 1 and condition is count <= 3?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 times"
          ],
          "primaryMisconceptionId": "MC_PY_WHILE_INFINITE_LOOP",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_PY_WHILE_INFINITE_LOOP",
              "errorExplanation": "Count runs for 1, 2, and 3 (3 total iterations).",
              "recoveryPath": {
                "simplerExplanation": "Runs when count is 1, 2, and 3 -> 3 times.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "py-d6-b2-infinite-loops",
        "day": 6,
        "blockNumber": 2,
        "title": "Preventing Infinite Loops & Counter Updates",
        "conceptBudget": {
          "primaryConcept": "Loop Termination",
          "supportingTerms": [
            "State Update",
            "Infinite Loop"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d6-b1-while-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Missing Counter Update Trap",
              "brokenCode": "count = 1\nwhile count <= 3:\n    print(count)\n    # ❌ count never changes -> infinite loop freezing the CPU!",
              "fixedCode": "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1  # ✅ Moves count toward termination",
              "errorLine": 4,
              "errorReason": "Without count += 1, count remains 1 forever.",
              "fixExplanation": "Always increment or decrement loop counter inside the block."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_loop.py",
            "initialCode": "n = 5\nwhile n > 0:\n    print('Countdown:', n)\n    n -= 1\nprint('Blastoff!')",
            "expectedOutput": "Countdown: 5\nCountdown: 4\nCountdown: 3\nCountdown: 2\nCountdown: 1\nBlastoff!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if you forget to increment the counter inside a while loop?",
          "options": [
            "The program enters an infinite loop and may freeze",
            "The loop runs only once",
            "Python automatically adds 1"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_WHILE_SENTINEL_UPDATE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_WHILE_SENTINEL_UPDATE",
              "errorExplanation": "The condition stays True forever, causing an infinite loop.",
              "recoveryPath": {
                "simplerExplanation": "Condition never becomes False -> loop never stops.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d6-b3-break-continue",
        "day": 6,
        "blockNumber": 3,
        "title": "Controlling Loops: break and continue",
        "conceptBudget": {
          "primaryConcept": "break and continue",
          "supportingTerms": [
            "break (instant exit)",
            "continue (skip to next)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d6-b2-infinite-loops",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Emergency Brake vs Skipping a Song",
            "simpleExplanation": "break hits the emergency brake and stops the entire train. continue skips the current song and plays the next."
          },
          {
            "type": "runnable_code",
            "filename": "break_demo.py",
            "initialCode": "n = 1\nwhile n <= 10:\n    if n == 3:\n        break\n    print('Run:', n)\n    n += 1",
            "expectedOutput": "Run: 1\nRun: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In the code above where n stops at break when n == 3, what is the last line printed?",
          "expectedStringOutput": "Run: 2",
          "acceptableAnswers": [
            "Run: 2",
            "2"
          ],
          "primaryMisconceptionId": "MC_PY_WHILE_INFINITE_LOOP",
          "diagnosisMap": {
            "Run: 3": {
              "misconceptionId": "MC_PY_WHILE_INFINITE_LOOP",
              "errorExplanation": "break exits before reaching print('Run:', 3).",
              "recoveryPath": {
                "simplerExplanation": "break exits immediately before printing 3.",
                "guidedFixPrompt": "Type Run: 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "The for Loop with range() & The Accumulator Pattern",
    "overviewMetaphor": "A for loop with range(start, stop) is like a ticket dispenser: it dispenses numbered tokens one by one from start up to (but not including) stop.",
    "blocks": [
      {
        "id": "py-d7-b1-range-syntax",
        "day": 7,
        "blockNumber": 1,
        "title": "The range(start, stop, step) Function",
        "conceptBudget": {
          "primaryConcept": "range() Generator",
          "supportingTerms": [
            "start (inclusive)",
            "stop (exclusive)",
            "step"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d6-b1-while-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "range() Parameters",
            "codeSnippet": "for i in range(1, 4):  # Produces 1, 2, 3 (4 is EXCLUDED!)\n    print('Number:', i)",
            "lineNotes": {
              "1": "range(1, 4) starts at 1 and stops BEFORE 4."
            }
          },
          {
            "type": "runnable_code",
            "filename": "range_demo.py",
            "initialCode": "for i in range(1, 4):\n    print('Item:', i)",
            "expectedOutput": "Item: 1\nItem: 2\nItem: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which numbers are produced by range(1, 5)?",
          "options": [
            "1, 2, 3, 4 (5 is excluded)",
            "1, 2, 3, 4, 5",
            "0, 1, 2, 3, 4, 5"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_RANGE_STOP_EXCLUSIVE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_RANGE_STOP_EXCLUSIVE",
              "errorExplanation": "In Python range(start, stop), the stop number is always exclusive (not included).",
              "recoveryPath": {
                "simplerExplanation": "range stops 1 step before the stop number.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d7-b2-accumulator-pattern",
        "day": 7,
        "blockNumber": 2,
        "title": "The Accumulator Pattern (Running Totals)",
        "conceptBudget": {
          "primaryConcept": "Accumulator Pattern",
          "supportingTerms": [
            "total = 0",
            "total += i"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d7-b1-range-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Piggy Bank",
            "simpleExplanation": "Start with an empty bank ($0). Each day, drop in the day's coins. At the end, the bank holds the sum of all days."
          },
          {
            "type": "runnable_code",
            "filename": "sum_demo.py",
            "initialCode": "total = 0\nfor i in range(1, 4):\n    total += i\nprint('Total Sum:', total)",
            "expectedOutput": "Total Sum: 6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the output of sum 1 + 2 + 3 in the code above?",
          "expectedStringOutput": "Total Sum: 6",
          "acceptableAnswers": [
            "Total Sum: 6",
            "6"
          ],
          "primaryMisconceptionId": "MC_PY_FOR_ACCUMULATOR_SCOPE",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_PY_FOR_ACCUMULATOR_SCOPE",
              "errorExplanation": "total accumulates 1 + 2 + 3 = 6.",
              "recoveryPath": {
                "simplerExplanation": "0 + 1 = 1; 1 + 2 = 3; 3 + 3 = 6.",
                "guidedFixPrompt": "Type Total Sum: 6"
              }
            }
          }
        }
      },
      {
        "id": "py-d7-b3-step-size",
        "day": 7,
        "blockNumber": 3,
        "title": "Custom Step Sizes & Counting Backwards",
        "conceptBudget": {
          "primaryConcept": "range Step Parameter",
          "supportingTerms": [
            "range(start, stop, step)",
            "Negative Step"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d7-b1-range-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "step_demo.py",
            "initialCode": "for even in range(2, 8, 2):\n    print('Even:', even)",
            "expectedOutput": "Even: 2\nEven: 4\nEven: 6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What numbers are printed by range(2, 8, 2)?",
          "expectedStringOutput": "Even: 2\nEven: 4\nEven: 6",
          "acceptableAnswers": [
            "Even: 2\nEven: 4\nEven: 6",
            "2, 4, 6",
            "2 4 6"
          ],
          "primaryMisconceptionId": "MC_PY_RANGE_STEP_DIRECTION",
          "diagnosisMap": {
            "2, 4, 6, 8": {
              "misconceptionId": "MC_PY_RANGE_STEP_DIRECTION",
              "errorExplanation": "Stop 8 is exclusive, so 8 is not included.",
              "recoveryPath": {
                "simplerExplanation": "2, 4, 6 (stops before 8).",
                "guidedFixPrompt": "Type Even: 2\\nEven: 4\\nEven: 6"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Nested Loops, Grid Traversal & String Formatting (f-strings)",
    "overviewMetaphor": "Nested loops are like a clock: for every single hour that the hour hand ticks (outer loop), the minute hand must complete 60 full ticks (inner loop).",
    "blocks": [
      {
        "id": "py-d8-b1-nested-loops",
        "day": 8,
        "blockNumber": 1,
        "title": "Nested For Loops (Rows & Columns)",
        "conceptBudget": {
          "primaryConcept": "Nested Loops",
          "supportingTerms": [
            "Outer Row Loop",
            "Inner Column Loop"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d7-b1-range-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Calendar Month",
            "simpleExplanation": "For each week (outer loop row), you visit Monday through Sunday (inner loop days)."
          },
          {
            "type": "runnable_code",
            "filename": "grid.py",
            "initialCode": "for r in range(2):\n    for c in range(2):\n        print(f'Cell ({r}, {c})')",
            "expectedOutput": "Cell (0, 0)\nCell (0, 1)\nCell (1, 0)\nCell (1, 1)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total cell coordinates are printed by for r in range(2): for c in range(3):?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "6 cells"
          ],
          "primaryMisconceptionId": "MC_PY_NESTED_LOOP_COORDINATES",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_PY_NESTED_LOOP_COORDINATES",
              "errorExplanation": "Total iterations = outer * inner = 2 * 3 = 6.",
              "recoveryPath": {
                "simplerExplanation": "2 rows * 3 columns = 6 total iterations.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      },
      {
        "id": "py-d8-b2-fstrings",
        "day": 8,
        "blockNumber": 2,
        "title": "Formatted String Literals (f-strings)",
        "conceptBudget": {
          "primaryConcept": "f-strings (f'...')",
          "supportingTerms": [
            "Curly Braces {}",
            "Expression Interpolation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d8-b1-nested-loops",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "f-string Anatomy",
            "codeSnippet": "name = 'Alex'\nage = 25\nmsg = f'User {name} is {age} years old.' # Automatically embeds values",
            "lineNotes": {
              "3": "Prefix string with 'f' to interpolate variables inside {}."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fstrings.py",
            "initialCode": "name = 'Sarah'\nscore = 98.5\nprint(f'Player: {name} | Score: {score}')",
            "expectedOutput": "Player: Sarah | Score: 98.5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is printed by: x = 10; print(f'Result: {x * 2}')?",
          "expectedStringOutput": "Result: 20",
          "acceptableAnswers": [
            "Result: 20"
          ],
          "primaryMisconceptionId": "MC_PY_FSTRING_EXPRESSION_EVAL",
          "diagnosisMap": {
            "Result: {x * 2}": {
              "misconceptionId": "MC_PY_FSTRING_EXPRESSION_EVAL",
              "errorExplanation": "f-strings evaluate expressions inside {} at runtime: 10 * 2 = 20.",
              "recoveryPath": {
                "simplerExplanation": "f-string calculates 10*2 inside {} to produce 20.",
                "guidedFixPrompt": "Type Result: 20"
              }
            }
          }
        }
      },
      {
        "id": "py-d8-b3-grid-matrix-traversal",
        "day": 8,
        "blockNumber": 3,
        "title": "Matrix Traversal & Coordinate Generation",
        "conceptBudget": {
          "primaryConcept": "2D Grid Coordinates",
          "supportingTerms": [
            "Row Index",
            "Column Index"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d8-b2-fstrings",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "table.py",
            "initialCode": "for i in range(1, 3):\n    row = ''\n    for j in range(1, 4):\n        row += f'{i*j} '\n    print(row.strip())",
            "expectedOutput": "1 2 3\n2 4 6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In the code above, what is the product at row 2, column 3 (i=2, j=3)?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6"
          ],
          "primaryMisconceptionId": "MC_PY_NESTED_LOOP_COORDINATES",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_PY_NESTED_LOOP_COORDINATES",
              "errorExplanation": "i * j = 2 * 3 = 6.",
              "recoveryPath": {
                "simplerExplanation": "2 * 3 = 6.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Functions with def, Parameters, Return Values & Docstrings",
    "overviewMetaphor": "A Python function is like a vending machine: you give it inputs (coins and a button selection), it runs internal machinery, and it drops out a calculated result (the snack).",
    "blocks": [
      {
        "id": "py-d9-b1-def-anatomy",
        "day": 9,
        "blockNumber": 1,
        "title": "Defining Functions with def & Parameters",
        "conceptBudget": {
          "primaryConcept": "Function Definition (def)",
          "supportingTerms": [
            "Parameter",
            "Argument",
            "def name():"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d8-b2-fstrings",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Function Definition Anatomy",
            "codeSnippet": "def greet_user(name):\n    print(f'Hello, {name}!')\n\ngreet_user('Alex') # Function call",
            "lineNotes": {
              "1": "def defines the function; name is the input parameter.",
              "4": "Calling greet_user('Alex') passes 'Alex' as argument."
            }
          },
          {
            "type": "runnable_code",
            "filename": "functions.py",
            "initialCode": "def greet(name):\n    print(f'Welcome, {name}!')\n\ngreet('Emily')",
            "expectedOutput": "Welcome, Emily!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What keyword is used to declare a function in Python?",
          "options": [
            "def",
            "function",
            "func"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_FUNCTION_DEF_VS_CALL",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_FUNCTION_DEF_VS_CALL",
              "errorExplanation": "Python uses 'def' (short for define), not 'function'.",
              "recoveryPath": {
                "simplerExplanation": "In Python, functions always start with def.",
                "guidedFixPrompt": "Select Option A: def"
              }
            }
          }
        }
      },
      {
        "id": "py-d9-b2-return-vs-print",
        "day": 9,
        "blockNumber": 2,
        "title": "The return Keyword (Returning Values to Caller)",
        "conceptBudget": {
          "primaryConcept": "The return Keyword",
          "supportingTerms": [
            "Return Value",
            "print() vs return"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d9-b1-def-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Calculator Display vs A Receipt Slip",
            "simpleExplanation": "print() just flashes numbers on screen; return hands you a real paper slip you can save in a variable and do math with later."
          },
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "print vs return Trap",
              "brokenCode": "def add(a, b):\n    print(a + b) # ❌ Returns None implicitly!\nx = add(2, 3)\nprint(x * 2)     # ❌ TypeError: unsupported operand type for *: 'NoneType' and 'int'",
              "fixedCode": "def add(a, b):\n    return a + b # ✅ Hands back the number 5\nx = add(2, 3)\nprint(x * 2)     # ✅ Output: 10",
              "errorLine": 2,
              "errorReason": "Functions without return yield None, which cannot be used in calculations.",
              "fixExplanation": "Use return to pass calculated data back to the caller."
            }
          },
          {
            "type": "runnable_code",
            "filename": "returns.py",
            "initialCode": "def square(n):\n    return n * n\n\nresult = square(4)\nprint('Square of 4 is:', result)",
            "expectedOutput": "Square of 4 is: 16",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In the code above, what value does square(4) return?",
          "expectedStringOutput": "16",
          "acceptableAnswers": [
            "16"
          ],
          "primaryMisconceptionId": "MC_PY_RETURN_VS_PRINT",
          "diagnosisMap": {
            "None": {
              "misconceptionId": "MC_PY_RETURN_VS_PRINT",
              "errorExplanation": "square has a return statement returning 4 * 4 = 16.",
              "recoveryPath": {
                "simplerExplanation": "4 * 4 = 16 is handed back to result.",
                "guidedFixPrompt": "Type 16"
              }
            }
          }
        }
      },
      {
        "id": "py-d9-b3-docstrings",
        "day": 9,
        "blockNumber": 3,
        "title": "Docstrings & Multi-Argument Functions",
        "conceptBudget": {
          "primaryConcept": "Docstrings (\"\"\" ... \"\"\")",
          "supportingTerms": [
            "Documentation",
            "help() Inspection"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d9-b2-return-vs-print",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Docstring Syntax",
            "codeSnippet": "def calculate_tax(price, rate=0.08):\n    \"\"\"Calculates sales tax on an item.\"\"\"\n    return round(price * rate, 2)",
            "lineNotes": {
              "2": "Docstring between triple quotes explains the function's purpose."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tax.py",
            "initialCode": "def calc_tax(price, rate=0.08):\n    \"\"\"Compute tax.\"\"\"\n    return round(price * rate, 2)\n\nprint('Tax on $100:', calc_tax(100))",
            "expectedOutput": "Tax on $100: 8.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How do you write a multi-line docstring in Python?",
          "options": [
            "Using triple quotes \"\"\" docstring \"\"\"",
            "Using // comments",
            "Using /* docstring */"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_FUNCTION_DEF_VS_CALL",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_FUNCTION_DEF_VS_CALL",
              "errorExplanation": "Python uses triple quotes (\"\"\" or ''') for docstrings.",
              "recoveryPath": {
                "simplerExplanation": "Triple quotes \"\"\" \"\"\" define Python docstrings.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "⭐ MILESTONE 2: Multi-Function Financial Utility Engine & Stack Frames",
    "overviewMetaphor": "Milestone 2 — Modular Financial Engine: The Call Stack is like a stack of cafeteria trays: when main() calls compute_tax(), a new tray is placed on top. When compute_tax() finishes, its tray is popped off and discarded.",
    "blocks": [
      {
        "id": "py-d10-b1-scope-legb",
        "day": 10,
        "blockNumber": 1,
        "title": "Local vs Global Scope in Python",
        "conceptBudget": {
          "primaryConcept": "Variable Scope (Local vs Global)",
          "supportingTerms": [
            "Local Scope inside Function",
            "Global Scope"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d9-b2-return-vs-print",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Hotel Room vs The Hotel Lobby",
            "simpleExplanation": "Items inside your private hotel room (local) cannot be seen from the lobby. The lobby chandelier (global) is visible to everyone."
          },
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Local vs Global Scope Frames",
              "boxes": [
                {
                  "label": "Global: company_name",
                  "value": "'PinIT Inc'",
                  "varType": "str",
                  "isUpdated": false
                },
                {
                  "label": "Local (calc): local_bonus",
                  "value": "500",
                  "varType": "int",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "scope.py",
            "initialCode": "global_rate = 0.10\n\ndef compute_fee(amount):\n    local_fee = amount * global_rate\n    return local_fee\n\nprint('Fee on $500:', compute_fee(500))",
            "expectedOutput": "Fee on $500: 50.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can code outside a function directly access a variable created inside that function?",
          "options": [
            "No, local variables exist only while the function is executing",
            "Yes, all variables in Python are global",
            "Only if the variable name starts with an underscore"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_LOCAL_VS_GLOBAL_SCOPE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_LOCAL_VS_GLOBAL_SCOPE",
              "errorExplanation": "Variables created inside functions have local scope and are destroyed when the function returns.",
              "recoveryPath": {
                "simplerExplanation": "Inside function = private local variable.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d10-b2-stack-frames",
        "day": 10,
        "blockNumber": 2,
        "title": "The Call Stack (Stack Frames in Action)",
        "conceptBudget": {
          "primaryConcept": "Call Stack Execution",
          "supportingTerms": [
            "Stack Frame",
            "Push and Pop"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d10-b1-scope-legb",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "stack_trace.py",
            "initialCode": "def step_two():\n    return 'Step 2 Complete'\n\ndef step_one():\n    msg = step_two()\n    return f'Step 1 got: {msg}'\n\nprint(step_one())",
            "expectedOutput": "Step 1 got: Step 2 Complete",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In stack_trace.py, what is printed by print(step_one())?",
          "expectedStringOutput": "Step 1 got: Step 2 Complete",
          "acceptableAnswers": [
            "Step 1 got: Step 2 Complete"
          ],
          "primaryMisconceptionId": "MC_PY_STACK_FRAME_LIFECYCLE",
          "diagnosisMap": {
            "Step 2 Complete": {
              "misconceptionId": "MC_PY_STACK_FRAME_LIFECYCLE",
              "errorExplanation": "step_one formats the message with 'Step 1 got: ...'.",
              "recoveryPath": {
                "simplerExplanation": "Formats into 'Step 1 got: Step 2 Complete'.",
                "guidedFixPrompt": "Type Step 1 got: Step 2 Complete"
              }
            }
          }
        }
      },
      {
        "id": "py-d10-b3-helper-composition",
        "day": 10,
        "blockNumber": 3,
        "title": "Helper Method Composition",
        "conceptBudget": {
          "primaryConcept": "Function Composition",
          "supportingTerms": [
            "Helper Functions",
            "Modular Pipeline"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d10-b2-stack-frames",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "payroll.py",
            "initialCode": "def calc_tax(gross):\n    return gross * 0.15\n\ndef calc_net(gross, bonus):\n    tax = calc_tax(gross)\n    return gross - tax + bonus\n\nprint('Net Salary:', calc_net(4000, 200))",
            "expectedOutput": "Net Salary: 3600.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "For gross=4000 (tax=600) and bonus=200, what is the net salary (4000 - 600 + 200)?",
          "expectedStringOutput": "Net Salary: 3600.0",
          "acceptableAnswers": [
            "Net Salary: 3600.0",
            "3600.0",
            "3600"
          ],
          "primaryMisconceptionId": "MC_PY_STACK_FRAME_LIFECYCLE",
          "diagnosisMap": {
            "4200": {
              "misconceptionId": "MC_PY_STACK_FRAME_LIFECYCLE",
              "errorExplanation": "4000 - 600 (tax) + 200 (bonus) = 3600.0.",
              "recoveryPath": {
                "simplerExplanation": "4000 - 600 + 200 = 3600.0.",
                "guidedFixPrompt": "Type Net Salary: 3600.0"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Python Lists — Indexing, Slicing [start:stop:step] & CRUD Operations",
    "overviewMetaphor": "A Python list is like a numbered train of cargo cars: car 0 is the first car, car 1 is the second, and car -1 is the caboose at the very end.",
    "blocks": [
      {
        "id": "py-d11-b1-list-indexing",
        "day": 11,
        "blockNumber": 1,
        "title": "0-Based & Negative Indexing (arr[0], arr[-1])",
        "conceptBudget": {
          "primaryConcept": "List Indexing",
          "supportingTerms": [
            "0-based Indexing",
            "Negative Indexing arr[-1]"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d10-b1-scope-legb",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "List Indexing",
            "codeSnippet": "items = ['apple', 'banana', 'cherry']\nfirst = items[0]  # 'apple'\nlast = items[-1]   # 'cherry' (negative index)",
            "lineNotes": {
              "2": "0 is always the first item in Python.",
              "3": "-1 is always the last item in Python."
            }
          },
          {
            "type": "runnable_code",
            "filename": "indexing.py",
            "initialCode": "fruits = ['apple', 'banana', 'cherry']\nprint('First:', fruits[0])\nprint('Last:', fruits[-1])",
            "expectedOutput": "First: apple\nLast: cherry",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the output of print(['a', 'b', 'c'][-1])?",
          "expectedStringOutput": "c",
          "acceptableAnswers": [
            "c",
            "'c'"
          ],
          "primaryMisconceptionId": "MC_PY_LIST_NEGATIVE_INDEXING",
          "diagnosisMap": {
            "a": {
              "misconceptionId": "MC_PY_LIST_NEGATIVE_INDEXING",
              "errorExplanation": "Negative index -1 accesses the LAST element ('c'), not the first.",
              "recoveryPath": {
                "simplerExplanation": "-1 = last item in list.",
                "guidedFixPrompt": "Type c"
              }
            }
          }
        }
      },
      {
        "id": "py-d11-b2-list-slicing",
        "day": 11,
        "blockNumber": 2,
        "title": "List Slicing: [start:stop:step]",
        "conceptBudget": {
          "primaryConcept": "List Slicing",
          "supportingTerms": [
            "Sublist Extraction",
            "Reverse with [::-1]"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d11-b1-list-indexing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Slicing Syntax",
            "codeSnippet": "nums = [10, 20, 30, 40, 50]\nsub = nums[1:4]   # [20, 30, 40] (index 4 is EXCLUDED)\nrev = nums[::-1]  # [50, 40, 30, 20, 10]",
            "lineNotes": {
              "2": "1:4 takes elements at index 1, 2, 3 (stops before index 4)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "slicing.py",
            "initialCode": "nums = [10, 20, 30, 40, 50]\nprint('Slice [1:3]:', nums[1:3])\nprint('Reversed:', nums[::-1])",
            "expectedOutput": "Slice [1:3]: [20, 30]\nReversed: [50, 40, 30, 20, 10]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What elements are in [0, 1, 2, 3, 4][1:3]?",
          "expectedStringOutput": "[1, 2]",
          "acceptableAnswers": [
            "[1, 2]",
            "1, 2",
            "1 and 2"
          ],
          "primaryMisconceptionId": "MC_PY_LIST_SLICE_STOP_EXCLUSIVE",
          "diagnosisMap": {
            "[1, 2, 3]": {
              "misconceptionId": "MC_PY_LIST_SLICE_STOP_EXCLUSIVE",
              "errorExplanation": "Stop index 3 is exclusive, so only indices 1 and 2 are returned: [1, 2].",
              "recoveryPath": {
                "simplerExplanation": "Slice [1:3] takes index 1 and 2 only.",
                "guidedFixPrompt": "Type [1, 2]"
              }
            }
          }
        }
      },
      {
        "id": "py-d11-b3-list-crud",
        "day": 11,
        "blockNumber": 3,
        "title": "List Mutation: append(), pop(), remove()",
        "conceptBudget": {
          "primaryConcept": "List Methods",
          "supportingTerms": [
            "append()",
            "pop()",
            "remove()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d11-b2-list-slicing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "crud.py",
            "initialCode": "tasks = ['Read', 'Code']\ntasks.append('Deploy')\nremoved = tasks.pop(0) # Removes 'Read'\nprint('Tasks remaining:', tasks)",
            "expectedOutput": "Tasks remaining: ['Code', 'Deploy']",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "After tasks.pop(0) removes index 0, what is the new first item in ['Code', 'Deploy']?",
          "expectedStringOutput": "Code",
          "acceptableAnswers": [
            "Code",
            "'Code'"
          ],
          "primaryMisconceptionId": "MC_PY_LIST_INDEX_OUT_OF_RANGE",
          "diagnosisMap": {
            "Read": {
              "misconceptionId": "MC_PY_LIST_INDEX_OUT_OF_RANGE",
              "errorExplanation": "pop(0) removed 'Read', so 'Code' shifted to index 0.",
              "recoveryPath": {
                "simplerExplanation": "'Code' is now at index 0.",
                "guidedFixPrompt": "Type Code"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "List Comprehensions, Filtering & In-Place vs Copy Sorting",
    "overviewMetaphor": "A list comprehension is like an automated assembly line conveyor belt: each item travels down the belt, passes an optional quality inspector (if filter), gets modified (expression), and drops into a brand new box.",
    "blocks": [
      {
        "id": "py-d12-b1-comprehension-syntax",
        "day": 12,
        "blockNumber": 1,
        "title": "List Comprehensions: [expr for x in list]",
        "conceptBudget": {
          "primaryConcept": "List Comprehension",
          "supportingTerms": [
            "One-Line Transformation",
            "Mapping"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d11-b3-list-crud",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "List Comprehension Anatomy",
            "codeSnippet": "nums = [1, 2, 3]\nsquares = [x * x for x in nums] # Produces [1, 4, 9]",
            "lineNotes": {
              "2": "x * x is the expression applied to every element in nums."
            }
          },
          {
            "type": "runnable_code",
            "filename": "comprehension.py",
            "initialCode": "nums = [1, 2, 3, 4]\nsquares = [n * 2 for n in nums]\nprint('Doubled:', squares)",
            "expectedOutput": "Doubled: [2, 4, 6, 8]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is produced by [x + 10 for x in [1, 2, 3]]?",
          "expectedStringOutput": "[11, 12, 13]",
          "acceptableAnswers": [
            "[11, 12, 13]",
            "11, 12, 13"
          ],
          "primaryMisconceptionId": "MC_PY_LIST_COMPREHENSION_SYNTAX",
          "diagnosisMap": {
            "[10, 10, 10]": {
              "misconceptionId": "MC_PY_LIST_COMPREHENSION_SYNTAX",
              "errorExplanation": "x is replaced by 1, 2, 3: 1+10=11, 2+10=12, 3+10=13.",
              "recoveryPath": {
                "simplerExplanation": "Adds 10 to each item: [11, 12, 13].",
                "guidedFixPrompt": "Type [11, 12, 13]"
              }
            }
          }
        }
      },
      {
        "id": "py-d12-b2-comprehension-filter",
        "day": 12,
        "blockNumber": 2,
        "title": "Filtering with if: [x for x in list if condition]",
        "conceptBudget": {
          "primaryConcept": "Comprehension Guard Filters",
          "supportingTerms": [
            "Filtering",
            "if Condition"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d12-b1-comprehension-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "filter_comp.py",
            "initialCode": "nums = [10, 15, 20, 25, 30]\nevens = [n for n in nums if n % 2 == 0]\nprint('Evens only:', evens)",
            "expectedOutput": "Evens only: [10, 20, 30]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is produced by [x for x in [5, 12, 8, 3] if x > 5]?",
          "expectedStringOutput": "[12, 8]",
          "acceptableAnswers": [
            "[12, 8]",
            "12, 8"
          ],
          "primaryMisconceptionId": "MC_PY_LIST_COMPREHENSION_SYNTAX",
          "diagnosisMap": {
            "[5, 12, 8]": {
              "misconceptionId": "MC_PY_LIST_COMPREHENSION_SYNTAX",
              "errorExplanation": "x > 5 is strictly greater than 5, so 5 is excluded.",
              "recoveryPath": {
                "simplerExplanation": "Only 12 and 8 are strictly greater than 5.",
                "guidedFixPrompt": "Type [12, 8]"
              }
            }
          }
        }
      },
      {
        "id": "py-d12-b3-sort-vs-sorted",
        "day": 12,
        "blockNumber": 3,
        "title": "In-Place list.sort() vs sorted(list)",
        "conceptBudget": {
          "primaryConcept": "Sorting Mechanisms",
          "supportingTerms": [
            "list.sort() in-place mutation",
            "sorted(list) new copy"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d12-b2-comprehension-filter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "sort() Return Trap",
              "brokenCode": "nums = [3, 1, 2]\nres = nums.sort() # ❌ nums.sort() returns None!\nprint(res)        # Output: None",
              "fixedCode": "nums = [3, 1, 2]\nres = sorted(nums) # ✅ sorted() returns a brand new sorted list\nprint(res)         # Output: [1, 2, 3]",
              "errorLine": 2,
              "errorReason": "list.sort() modifies in place and returns None.",
              "fixExplanation": "Use sorted(list) when assigning to a new variable."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sorting.py",
            "initialCode": "raw = [40, 10, 30, 20]\nordered = sorted(raw)\nprint('Original:', raw)\nprint('Sorted:', ordered)",
            "expectedOutput": "Original: [40, 10, 30, 20]\nSorted: [10, 20, 30, 40]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does calling my_list.sort() return in Python?",
          "options": [
            "None (it sorts my_list in place)",
            "A new sorted copy of the list",
            "The length of the list"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_LIST_APPEND_RETURNS_NONE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_LIST_APPEND_RETURNS_NONE",
              "errorExplanation": "list.sort() mutates the list directly and returns None.",
              "recoveryPath": {
                "simplerExplanation": "sort() returns None; sorted() returns the copy.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Tuples (Immutability) & Sets (Uniqueness & O(1) Lookups)",
    "overviewMetaphor": "A Tuple is a carved stone tablet (its data can never be edited after creation). A Set is a magical bouncer at a club who instantly vaporizes any duplicate attendees.",
    "blocks": [
      {
        "id": "py-d13-b1-tuple-immutability",
        "day": 13,
        "blockNumber": 1,
        "title": "Tuples: Immutable Fixed Records (x, y)",
        "conceptBudget": {
          "primaryConcept": "Tuple Immutability",
          "supportingTerms": [
            "Parentheses ()",
            "Cannot be Modified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d11-b1-list-indexing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Carved GPS Coordinate",
            "simpleExplanation": "A GPS landmark (lat, long) never changes. Tuples protect coordinates from accidental mutation."
          },
          {
            "type": "runnable_code",
            "filename": "tuples.py",
            "initialCode": "point = (10, 20)\nprint('X:', point[0], '| Y:', point[1])",
            "expectedOutput": "X: 10 | Y: 20",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can you change an element of a tuple like pt[0] = 50 in Python?",
          "options": [
            "No, tuples are immutable and raise a TypeError",
            "Yes, tuples work identically to lists",
            "Only if the tuple has 2 items"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_TUPLE_IMMUTABILITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_TUPLE_IMMUTABILITY",
              "errorExplanation": "Tuples cannot be modified after creation.",
              "recoveryPath": {
                "simplerExplanation": "Tuples are read-only / immutable.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d13-b2-sets-uniqueness",
        "day": 13,
        "blockNumber": 2,
        "title": "Sets: Automatic Deduplication & O(1) in Lookups",
        "conceptBudget": {
          "primaryConcept": "Set Uniqueness & Fast Lookup",
          "supportingTerms": [
            "Curly Braces {1, 2}",
            "set() Deduplication"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d13-b1-tuple-immutability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sets.py",
            "initialCode": "raw_ids = [101, 102, 101, 103, 102]\nunique_ids = set(raw_ids)\nprint('Unique IDs:', sorted(list(unique_ids)))",
            "expectedOutput": "Unique IDs: [101, 102, 103]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is len(set([1, 2, 2, 3, 3, 3]))?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3"
          ],
          "primaryMisconceptionId": "MC_PY_SET_UNIQUENESS",
          "diagnosisMap": {
            "6": {
              "misconceptionId": "MC_PY_SET_UNIQUENESS",
              "errorExplanation": "set() drops all duplicates, leaving only {1, 2, 3} (3 items).",
              "recoveryPath": {
                "simplerExplanation": "Duplicates are removed: {1, 2, 3} -> len is 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "py-d13-b3-set-operations",
        "day": 13,
        "blockNumber": 3,
        "title": "Set Operations: Union (|) & Intersection (&)",
        "conceptBudget": {
          "primaryConcept": "Set Mathematics",
          "supportingTerms": [
            "Intersection &",
            "Union |",
            "Difference -"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d13-b2-sets-uniqueness",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "set_math.py",
            "initialCode": "a = {1, 2, 3}\nb = {2, 3, 4}\nprint('Intersection (shared):', a & b)\nprint('Union (all):', a | b)",
            "expectedOutput": "Intersection (shared): {2, 3}\nUnion (all): {1, 2, 3, 4}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is {1, 2} & {2, 3} (shared intersection)?",
          "expectedStringOutput": "{2}",
          "acceptableAnswers": [
            "{2}",
            "2",
            "set([2])"
          ],
          "primaryMisconceptionId": "MC_PY_SET_UNIQUENESS",
          "diagnosisMap": {
            "{1, 2, 3}": {
              "misconceptionId": "MC_PY_SET_UNIQUENESS",
              "errorExplanation": "& finds only elements in BOTH sets ({2}).",
              "recoveryPath": {
                "simplerExplanation": "Only 2 is present in both sets.",
                "guidedFixPrompt": "Type {2}"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Dictionaries — Key-Value Mapping & O(1) Hash Lookups",
    "overviewMetaphor": "A Python dictionary is like a real-world telephone book: you look up a person's unique name (Key) and instantly find their phone number (Value) without reading line by line.",
    "blocks": [
      {
        "id": "py-d14-b1-dict-syntax",
        "day": 14,
        "blockNumber": 1,
        "title": "Dictionary Creation & Key Access: dict[key]",
        "conceptBudget": {
          "primaryConcept": "Dictionary Key-Value Pair",
          "supportingTerms": [
            "Key (Unique)",
            "Value (Data)",
            "Curly Braces {'k': 'v'}"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d13-b2-sets-uniqueness",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Dictionary Anatomy",
            "codeSnippet": "user = {'name': 'Alex', 'age': 25}\nprint(user['name']) # Access value by key",
            "lineNotes": {
              "1": "'name' is the key; 'Alex' is the value associated with it."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dict_demo.py",
            "initialCode": "student = {'id': 101, 'name': 'Sarah', 'gpa': 3.9}\nprint('Student Name:', student['name'])\nprint('GPA:', student['gpa'])",
            "expectedOutput": "Student Name: Sarah\nGPA: 3.9",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is printed by: d = {'a': 10, 'b': 20}; print(d['b'])?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20"
          ],
          "primaryMisconceptionId": "MC_PY_DICT_KEY_ERROR",
          "diagnosisMap": {
            "b": {
              "misconceptionId": "MC_PY_DICT_KEY_ERROR",
              "errorExplanation": "d['b'] retrieves the VALUE (20) stored under key 'b'.",
              "recoveryPath": {
                "simplerExplanation": "Key 'b' maps to value 20.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      },
      {
        "id": "py-d14-b2-dict-get-safe",
        "day": 14,
        "blockNumber": 2,
        "title": "Safe Key Access with dict.get(key, default)",
        "conceptBudget": {
          "primaryConcept": "dict.get() Method",
          "supportingTerms": [
            "Prevent KeyError",
            "Fallback Default"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d14-b1-dict-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "KeyError Trap & Safe get() Fix",
              "brokenCode": "user = {'name': 'Alex'}\nprint(user['email']) # ❌ KeyError: 'email'",
              "fixedCode": "user = {'name': 'Alex'}\nprint(user.get('email', 'No email')) # ✅ Output: 'No email'",
              "errorLine": 2,
              "errorReason": "Accessing missing keys with [] throws a KeyError.",
              "fixExplanation": "Use user.get(key, default) for graceful fallbacks."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_get.py",
            "initialCode": "config = {'port': 8080}\nprint('Port:', config.get('port', 3000))\nprint('Host:', config.get('host', 'localhost'))",
            "expectedOutput": "Port: 8080\nHost: localhost",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does {'a': 1}.get('b', 'Missing') return?",
          "expectedStringOutput": "Missing",
          "acceptableAnswers": [
            "Missing",
            "'Missing'"
          ],
          "primaryMisconceptionId": "MC_PY_DICT_GET_FALLBACK",
          "diagnosisMap": {
            "None": {
              "misconceptionId": "MC_PY_DICT_GET_FALLBACK",
              "errorExplanation": "The second argument 'Missing' was provided as fallback default.",
              "recoveryPath": {
                "simplerExplanation": "Key 'b' is absent -> returns default 'Missing'.",
                "guidedFixPrompt": "Type Missing"
              }
            }
          }
        }
      },
      {
        "id": "py-d14-b3-dict-iteration",
        "day": 14,
        "blockNumber": 3,
        "title": "Iterating Dictionaries: keys(), values(), items()",
        "conceptBudget": {
          "primaryConcept": "Dictionary Iteration",
          "supportingTerms": [
            "items() tuples",
            "k, v in d.items()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d14-b2-dict-get-safe",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dict_iter.py",
            "initialCode": "scores = {'Alice': 95, 'Bob': 88}\nfor name, score in scores.items():\n    print(f'{name}: {score}')",
            "expectedOutput": "Alice: 95\nBob: 88",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which dictionary method allows you to loop over both keys and values simultaneously?",
          "options": [
            "dict.items()",
            "dict.keys()",
            "dict.values()"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_DICT_ITERATION_KEYS_VS_VALUES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_DICT_ITERATION_KEYS_VS_VALUES",
              "errorExplanation": "dict.keys() returns only keys; dict.items() yields (key, value) pairs.",
              "recoveryPath": {
                "simplerExplanation": "items() returns (key, value) tuples.",
                "guidedFixPrompt": "Select Option A: dict.items()"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 3: Fast Ledger Lookup & Dictionary Search Engine",
    "overviewMetaphor": "Milestone 3 — Fast Search Index: An inverted dictionary index is like the index at the back of a textbook: instead of reading all 500 pages, you look up the word and immediately see the exact page numbers.",
    "blocks": [
      {
        "id": "py-d15-b1-dict-grouping",
        "day": 15,
        "blockNumber": 1,
        "title": "Dictionary Grouping Pattern (setdefault / list grouping)",
        "conceptBudget": {
          "primaryConcept": "Record Grouping",
          "supportingTerms": [
            "Grouping by Category",
            "setdefault()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d14-b3-dict-iteration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "grouping.py",
            "initialCode": "txs = [('FOOD', 15.0), ('TECH', 100.0), ('FOOD', 25.0)]\ngrouped = {}\nfor cat, amt in txs:\n    grouped.setdefault(cat, []).append(amt)\nprint('Grouped Ledger:', grouped)",
            "expectedOutput": "Grouped Ledger: {'FOOD': [15.0, 25.0], 'TECH': [100.0]}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many items are in grouped['FOOD'] in the code above?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 items"
          ],
          "primaryMisconceptionId": "MC_PY_DICT_GET_FALLBACK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_DICT_GET_FALLBACK",
              "errorExplanation": "FOOD has two entries (15.0 and 25.0), so len is 2.",
              "recoveryPath": {
                "simplerExplanation": "[15.0, 25.0] has 2 elements.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "py-d15-b2-frequency-aggregation",
        "day": 15,
        "blockNumber": 2,
        "title": "Category Balance Aggregator Pattern",
        "conceptBudget": {
          "primaryConcept": "Aggregation Pattern",
          "supportingTerms": [
            "Running Sum per Category",
            "dict accumulator"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d15-b1-dict-grouping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "aggregator.py",
            "initialCode": "items = [('FOOD', 15.5), ('TECH', 50.0), ('FOOD', 10.5)]\ntotals = {}\nfor cat, cost in items:\n    totals[cat] = totals.get(cat, 0.0) + cost\nprint('Category Totals:', totals)",
            "expectedOutput": "Category Totals: {'FOOD': 26.0, 'TECH': 50.0}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is totals['FOOD'] (15.5 + 10.5) in the aggregator above?",
          "expectedStringOutput": "26.0",
          "acceptableAnswers": [
            "26.0",
            "26"
          ],
          "primaryMisconceptionId": "MC_PY_DICT_GET_FALLBACK",
          "diagnosisMap": {
            "15.5": {
              "misconceptionId": "MC_PY_DICT_GET_FALLBACK",
              "errorExplanation": "15.5 + 10.5 accumulates to 26.0.",
              "recoveryPath": {
                "simplerExplanation": "15.5 + 10.5 = 26.0.",
                "guidedFixPrompt": "Type 26.0"
              }
            }
          }
        }
      },
      {
        "id": "py-d15-b3-fast-search-index",
        "day": 15,
        "blockNumber": 3,
        "title": "Fast O(1) Key Lookup vs O(N) Linear Scan",
        "conceptBudget": {
          "primaryConcept": "Hash Lookup Efficiency",
          "supportingTerms": [
            "O(1) Instant Retrieval",
            "Hash Map Mechanics"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d15-b2-frequency-aggregation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "search_index.py",
            "initialCode": "index = {'TX_101': {'amount': 500, 'status': 'SETTLED'}}\nlookup = index.get('TX_101')\nprint('Retrieved in O(1):', lookup['status'])",
            "expectedOutput": "Retrieved in O(1): SETTLED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why are dictionary lookups faster than scanning an unindexed list of 1,000,000 items?",
          "options": [
            "Dictionaries use hash keys for instant O(1) direct memory lookup",
            "Dictionaries compress strings into smaller text",
            "Dictionaries run on the GPU"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_DICT_KEY_ERROR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_DICT_KEY_ERROR",
              "errorExplanation": "Dictionaries use hash tables for instant O(1) access.",
              "recoveryPath": {
                "simplerExplanation": "Hash keys jump straight to the data address in O(1) time.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Object-Oriented Programming — Classes, self & Object Instantiation",
    "overviewMetaphor": "A Class is an architectural blueprint (drawing of a house). An Object is the actual house built from that blueprint on a piece of land in memory.",
    "blocks": [
      {
        "id": "py-d16-b1-class-blueprint",
        "day": 16,
        "blockNumber": 1,
        "title": "What is a Class? (Blueprint vs Object Instance)",
        "conceptBudget": {
          "primaryConcept": "Class Definition",
          "supportingTerms": [
            "Blueprint",
            "Instance Object"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d14-b1-dict-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Cookie Cutter vs Cookies",
            "simpleExplanation": "The metal cookie cutter (Class) is not edible; each individual cookie stamped out from it (Object) has its own frosting and sprinkles."
          },
          {
            "type": "syntax_anatomy",
            "title": "Class Definition",
            "codeSnippet": "class Dog:\n    species = 'Canine' # Class attribute\n\nmy_dog = Dog() # Creating an object instance",
            "lineNotes": {
              "1": "class keyword creates the blueprint.",
              "4": "Dog() stamps out a new object in memory."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dog_class.py",
            "initialCode": "class Car:\n    brand = 'Tesla'\n\ncar1 = Car()\nprint('Car Brand:', car1.brand)",
            "expectedOutput": "Car Brand: Tesla",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the relationship between a Class and an Object in Python?",
          "options": [
            "A Class is the blueprint; an Object is the concrete instance created from it",
            "A Class is a number; an Object is text",
            "They are completely identical"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_CLASS_VS_INSTANCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_CLASS_VS_INSTANCE",
              "errorExplanation": "Classes define the structure; objects hold individual runtime state.",
              "recoveryPath": {
                "simplerExplanation": "Class = blueprint; Object = actual building.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d16-b2-self-parameter",
        "day": 16,
        "blockNumber": 2,
        "title": "The self Parameter (Instance Self-Reference)",
        "conceptBudget": {
          "primaryConcept": "The self Parameter",
          "supportingTerms": [
            "Explicit Receiver",
            "self.attribute"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d16-b1-class-blueprint",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Saying 'My Own Name'",
            "simpleExplanation": "When you introduce yourself, you say 'My name is Alex'. 'self' refers to the specific instance whose method is being executed."
          },
          {
            "type": "runnable_code",
            "filename": "self_demo.py",
            "initialCode": "class Player:\n    def speak(self, greeting):\n        print(f'{greeting}, I am ready!')\n\np = Player()\np.speak('Hello')",
            "expectedOutput": "Hello, I am ready!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must Python instance methods have 'self' as their first parameter?",
          "options": [
            "To give the method access to the specific object instance calling it",
            "It is a required Python security token",
            "To make methods run on separate threads"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_SELF_FIRST_PARAMETER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_SELF_FIRST_PARAMETER",
              "errorExplanation": "self represents the current object instance calling the method.",
              "recoveryPath": {
                "simplerExplanation": "self binds the method to that specific object.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d16-b3-multiple-instances",
        "day": 16,
        "blockNumber": 3,
        "title": "Multiple Independent Object Instances",
        "conceptBudget": {
          "primaryConcept": "Independent Instance State",
          "supportingTerms": [
            "Separate Heap Memory",
            "State Isolation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d16-b2-self-parameter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "instances.py",
            "initialCode": "class Counter:\n    def __init__(self):\n        self.val = 0\n    def inc(self):\n        self.val += 1\n\nc1 = Counter()\nc2 = Counter()\nc1.inc()\nprint('c1:', c1.val, '| c2:', c2.val)",
            "expectedOutput": "c1: 1 | c2: 0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When c1.inc() runs, why does c2.val stay 0?",
          "expectedStringOutput": "c1: 1 | c2: 0",
          "acceptableAnswers": [
            "c1: 1 | c2: 0",
            "c2 is 0",
            "0"
          ],
          "primaryMisconceptionId": "MC_PY_CLASS_VS_INSTANCE",
          "diagnosisMap": {
            "c1: 1 | c2: 1": {
              "misconceptionId": "MC_PY_CLASS_VS_INSTANCE",
              "errorExplanation": "c1 and c2 are separate objects in memory; mutating c1 does not touch c2.",
              "recoveryPath": {
                "simplerExplanation": "Each object has its own independent storage.",
                "guidedFixPrompt": "Type c1: 1 | c2: 0"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Constructors (__init__), Default Values & Instance State",
    "overviewMetaphor": "The __init__ method is like a factory setup crew: the moment a new car rolls off the production line, the crew sets up its owner name, paint color, and fuel tank.",
    "blocks": [
      {
        "id": "py-d17-b1-init-constructor",
        "day": 17,
        "blockNumber": 1,
        "title": "The __init__() Constructor Method",
        "conceptBudget": {
          "primaryConcept": "Constructor Initialization",
          "supportingTerms": [
            "__init__(self, ...)",
            "Instance Attributes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d16-b2-self-parameter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "__init__ Syntax",
            "codeSnippet": "class User:\n    def __init__(self, name, email):\n        self.name = name   # Set instance attribute\n        self.email = email",
            "lineNotes": {
              "2": "__init__ runs automatically when User('Alex', 'a@b.com') is called."
            }
          },
          {
            "type": "runnable_code",
            "filename": "user_init.py",
            "initialCode": "class User:\n    def __init__(self, name, role='MEMBER'):\n        self.name = name\n        self.role = role\n\nu = User('Sarah')\nprint(f'User: {u.name} ({u.role})')",
            "expectedOutput": "User: Sarah (MEMBER)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When does the __init__() method execute in Python?",
          "options": [
            "Automatically as soon as a new object instance is created",
            "Only when you explicitly call obj.__init__()",
            "At the end of the Python script"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_INIT_CONSTRUCTOR_RETURN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_INIT_CONSTRUCTOR_RETURN",
              "errorExplanation": "__init__ is called automatically by Python during instantiation.",
              "recoveryPath": {
                "simplerExplanation": "Calling Class() automatically triggers __init__.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d17-b2-default-args-trap",
        "day": 17,
        "blockNumber": 2,
        "title": "Constructor Defaults & The Mutable Default Trap",
        "conceptBudget": {
          "primaryConcept": "Default Arguments",
          "supportingTerms": [
            "Default Values",
            "None as Safe Default"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d17-b1-init-constructor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Mutable Default Argument Bug",
              "brokenCode": "class Box:\n    def __init__(self, items=[]): # ❌ Shared list across all Box instances!\n        self.items = items",
              "fixedCode": "class Box:\n    def __init__(self, items=None): # ✅ Safe default\n        self.items = [] if items is None else items",
              "errorLine": 2,
              "errorReason": "Default list [] is evaluated ONCE at function definition time, sharing the list across all objects.",
              "fixExplanation": "Use items=None and initialize self.items = [] inside __init__."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_init.py",
            "initialCode": "class SafeBox:\n    def __init__(self, items=None):\n        self.items = [] if items is None else items\n\nb1 = SafeBox()\nb1.items.append('Gold')\nb2 = SafeBox()\nprint('b2 items (isolated):', b2.items)",
            "expectedOutput": "b2 items (isolated): []",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should you use items=None instead of items=[] as a default parameter?",
          "options": [
            "To prevent all instances from accidentally sharing the same mutable list in memory",
            "Because empty lists take up too much RAM",
            "Because Python does not support [] in headers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_DEFAULT_PARAM_MUTABLE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_DEFAULT_PARAM_MUTABLE",
              "errorExplanation": "Mutable default arguments ([] or {}) are shared across all calls.",
              "recoveryPath": {
                "simplerExplanation": "Use None to ensure every object gets a fresh new list.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d17-b3-defensive-init",
        "day": 17,
        "blockNumber": 3,
        "title": "Defensive Validation in Constructors",
        "conceptBudget": {
          "primaryConcept": "Constructor Invariant Checking",
          "supportingTerms": [
            "raise ValueError",
            "Input Sanitization"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d17-b2-default-args-trap",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "defensive.py",
            "initialCode": "class Account:\n    def __init__(self, balance):\n        if balance < 0:\n            raise ValueError('Balance cannot be negative')\n        self.balance = balance\n\nacc = Account(100)\nprint('Account Created Balance:', acc.balance)",
            "expectedOutput": "Account Created Balance: 100",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is printed if balance=100 is passed to Account?",
          "expectedStringOutput": "Account Created Balance: 100",
          "acceptableAnswers": [
            "Account Created Balance: 100",
            "100"
          ],
          "primaryMisconceptionId": "MC_PY_INIT_CONSTRUCTOR_RETURN",
          "diagnosisMap": {
            "Error": {
              "misconceptionId": "MC_PY_INIT_CONSTRUCTOR_RETURN",
              "errorExplanation": "100 is >= 0, so validation passes cleanly.",
              "recoveryPath": {
                "simplerExplanation": "100 is valid -> prints Account Created Balance: 100.",
                "guidedFixPrompt": "Type Account Created Balance: 100"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Encapsulation, Private Attributes (_var, __var) & Properties (@property)",
    "overviewMetaphor": "Encapsulation is like a bank teller window: customers cannot walk behind the counter and grab cash directly; they must ask the teller (getter/setter) who enforces security rules.",
    "blocks": [
      {
        "id": "py-d18-b1-private-naming",
        "day": 18,
        "blockNumber": 1,
        "title": "Protected (_var) & Private (__var) Attributes",
        "conceptBudget": {
          "primaryConcept": "Private Naming Conventions",
          "supportingTerms": [
            "_protected Convention",
            "__private Name Mangling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d17-b1-init-constructor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A 'Private: Staff Only' Door Sign",
            "simpleExplanation": "A single underscore _ tells other developers 'do not touch this internal field'. Double underscore __ triggers Python name mangling."
          },
          {
            "type": "runnable_code",
            "filename": "private_demo.py",
            "initialCode": "class Vault:\n    def __init__(self, secret):\n        self._secret = secret # Protected by convention\n\nv = Vault('pass123')\nprint('Vault created with protected state.')",
            "expectedOutput": "Vault created with protected state.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In Python, what does a leading underscore `_balance` signal to other developers?",
          "options": [
            "It is an internal/protected attribute that should not be modified directly",
            "It is a constant that cannot change",
            "It is an encrypted string"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_PRIVATE_ATTRIBUTE_MANGLING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_PRIVATE_ATTRIBUTE_MANGLING",
              "errorExplanation": "Leading underscore indicates private/internal implementation details.",
              "recoveryPath": {
                "simplerExplanation": "_var = internal use only convention.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d18-b2-property-decorator",
        "day": 18,
        "blockNumber": 2,
        "title": "The @property Getter & @<field>.setter Decorators",
        "conceptBudget": {
          "primaryConcept": "Properties (@property)",
          "supportingTerms": [
            "@property Getter",
            "@field.setter Validator"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d18-b1-private-naming",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "@property Syntax",
            "codeSnippet": "class Account:\n    def __init__(self, bal):\n        self._bal = bal\n\n    @property\n    def bal(self):\n        return self._bal\n\n    @bal.setter\n    def bal(self, val):\n        if val < 0:\n            raise ValueError('No negative balances')\n        self._bal = val",
            "lineNotes": {
              "5": "@property allows reading acc.bal like an attribute.",
              "9": "@bal.setter runs validation when acc.bal = 50 is assigned."
            }
          },
          {
            "type": "runnable_code",
            "filename": "property_demo.py",
            "initialCode": "class SafeVault:\n    def __init__(self, cash):\n        self._cash = cash\n    @property\n    def cash(self):\n        return self._cash\n\nv = SafeVault(500)\nprint('Cash read via property: $', v.cash)",
            "expectedOutput": "Cash read via property: $ 500",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How do you access a method decorated with @property in Python?",
          "options": [
            "Like a normal attribute without parentheses: obj.cash",
            "By calling it with parentheses: obj.cash()",
            "By calling obj.get_cash()"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_PROPERTY_GETTER_SETTER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_PROPERTY_GETTER_SETTER",
              "errorExplanation": "@property allows methods to be accessed cleanly as obj.cash.",
              "recoveryPath": {
                "simplerExplanation": "Property methods are read without () parentheses.",
                "guidedFixPrompt": "Select Option A: obj.cash"
              }
            }
          }
        }
      },
      {
        "id": "py-d18-b3-computed-properties",
        "day": 18,
        "blockNumber": 3,
        "title": "Dynamic Computed Properties",
        "conceptBudget": {
          "primaryConcept": "Computed Properties",
          "supportingTerms": [
            "Derived State",
            "On-the-Fly Calculation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d18-b2-property-decorator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rect.py",
            "initialCode": "class Rectangle:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n    @property\n    def area(self):\n        return self.w * self.h\n\nr = Rectangle(4, 5)\nprint('Area computed dynamically:', r.area)",
            "expectedOutput": "Area computed dynamically: 20",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "For Rectangle(4, 5), what is r.area?",
          "expectedStringOutput": "Area computed dynamically: 20",
          "acceptableAnswers": [
            "Area computed dynamically: 20",
            "20"
          ],
          "primaryMisconceptionId": "MC_PY_PROPERTY_GETTER_SETTER",
          "diagnosisMap": {
            "9": {
              "misconceptionId": "MC_PY_PROPERTY_GETTER_SETTER",
              "errorExplanation": "area is width * height = 4 * 5 = 20.",
              "recoveryPath": {
                "simplerExplanation": "4 * 5 = 20.",
                "guidedFixPrompt": "Type Area computed dynamically: 20"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Inheritance (class Child(Parent)), Method Overriding & super()",
    "overviewMetaphor": "Inheritance is genetic inheritance: a Child smartphone inherits basic Phone abilities (making calls) while adding its own unique features (touch screen, browsing).",
    "blocks": [
      {
        "id": "py-d19-b1-inheritance-syntax",
        "day": 19,
        "blockNumber": 1,
        "title": "Single Inheritance Syntax: class Child(Parent)",
        "conceptBudget": {
          "primaryConcept": "Inheritance (Subclassing)",
          "supportingTerms": [
            "Base / Parent Class",
            "Derived / Child Class"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d16-b1-class-blueprint",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Inheritance Syntax",
            "codeSnippet": "class Vehicle:      # Parent base class\n    pass\n\nclass Car(Vehicle): # Child derived class\n    pass",
            "lineNotes": {
              "4": "Passing Vehicle inside Car(...) sets Vehicle as the parent."
            }
          },
          {
            "type": "runnable_code",
            "filename": "inheritance.py",
            "initialCode": "class Animal:\n    def speak(self):\n        return 'Generic Sound'\n\nclass Dog(Animal):\n    pass # Inherits speak() from Animal\n\nd = Dog()\nprint('Dog sound:', d.speak())",
            "expectedOutput": "Dog sound: Generic Sound",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How do you specify that `SmartPhone` inherits from `Phone` in Python?",
          "options": [
            "class SmartPhone(Phone):",
            "class SmartPhone extends Phone:",
            "class SmartPhone inherits Phone:"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_INHERITANCE_SUPER_CALL",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_INHERITANCE_SUPER_CALL",
              "errorExplanation": "Python uses parentheses `class Child(Parent):`, not the `extends` keyword (which is Java/JS).",
              "recoveryPath": {
                "simplerExplanation": "In Python: class Child(Parent):",
                "guidedFixPrompt": "Select Option A: class SmartPhone(Phone):"
              }
            }
          }
        }
      },
      {
        "id": "py-d19-b2-super-init",
        "day": 19,
        "blockNumber": 2,
        "title": "Calling Parent Constructor with super().__init__()",
        "conceptBudget": {
          "primaryConcept": "The super() Proxy",
          "supportingTerms": [
            "super().__init__()",
            "Parent State Setup"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d19-b1-inheritance-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "super_demo.py",
            "initialCode": "class Person:\n    def __init__(self, name):\n        self.name = name\n\nclass Student(Person):\n    def __init__(self, name, grade):\n        super().__init__(name) # Pass name to parent\n        self.grade = grade\n\ns = Student('Emily', 10)\nprint(f'Student: {s.name}, Grade: {s.grade}')",
            "expectedOutput": "Student: Emily, Grade: 10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the purpose of calling `super().__init__(name)` in a child constructor?",
          "options": [
            "To initialize the inherited fields defined in the parent class",
            "To delete the parent class from memory",
            "To convert the child into a parent"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_INHERITANCE_SUPER_CALL",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_INHERITANCE_SUPER_CALL",
              "errorExplanation": "super().__init__() executes the parent's initialization logic.",
              "recoveryPath": {
                "simplerExplanation": "Initializes parent attributes properly.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d19-b3-method-overriding",
        "day": 19,
        "blockNumber": 3,
        "title": "Method Overriding in Subclasses",
        "conceptBudget": {
          "primaryConcept": "Method Overriding",
          "supportingTerms": [
            "Polymorphic Dispatch",
            "Specialized Behavior"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d19-b2-super-init",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "override.py",
            "initialCode": "class Bird:\n    def sound(self):\n        return 'Chirp'\n\nclass Duck(Bird):\n    def sound(self): # Overrides sound()\n        return 'Quack'\n\nprint('Duck says:', Duck().sound())",
            "expectedOutput": "Duck says: Quack",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does Duck().sound() return in the code above?",
          "expectedStringOutput": "Duck says: Quack",
          "acceptableAnswers": [
            "Duck says: Quack",
            "Quack",
            "'Quack'"
          ],
          "primaryMisconceptionId": "MC_PY_METHOD_OVERRIDING_DISPATCH",
          "diagnosisMap": {
            "Chirp": {
              "misconceptionId": "MC_PY_METHOD_OVERRIDING_DISPATCH",
              "errorExplanation": "Duck overrides sound() to return 'Quack' instead of 'Chirp'.",
              "recoveryPath": {
                "simplerExplanation": "Subclass definition takes precedence.",
                "guidedFixPrompt": "Type Duck says: Quack"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Polymorphism, Duck Typing & Magic Methods (__str__, __len__, __eq__)",
    "overviewMetaphor": "Duck typing is the golden rule of Python: 'If it walks like a duck and quacks like a duck, Python treats it as a duck!' You do not need rigid interface contracts; if the object has the required method, it runs.",
    "blocks": [
      {
        "id": "py-d20-b1-duck-typing",
        "day": 20,
        "blockNumber": 1,
        "title": "Duck Typing & Polymorphic Dispatch",
        "conceptBudget": {
          "primaryConcept": "Duck Typing",
          "supportingTerms": [
            "Dynamic Dispatch",
            "Behavior-Based Interfaces"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d19-b3-method-overriding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Any Key that Fits the Lock",
            "simpleExplanation": "A lock doesn't care whether the key is gold, iron, or 3D-printed. If the grooves fit the lock, the door opens."
          },
          {
            "type": "runnable_code",
            "filename": "duck_typing.py",
            "initialCode": "class Radio:\n    def play(self): return 'Music Stream'\n\nclass TV:\n    def play(self): return 'Video Stream'\n\nfor player in [Radio(), TV()]:\n    print('Playing:', player.play())",
            "expectedOutput": "Playing: Music Stream\nPlaying: Video Stream",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is 'Duck Typing' in Python?",
          "options": [
            "A system where an object's suitability is determined by the presence of methods/attributes rather than its inheritance hierarchy",
            "A library for drawing ducks",
            "A typing system only for web scrapers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_POLYMORPHIC_DUCK_TYPING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_POLYMORPHIC_DUCK_TYPING",
              "errorExplanation": "Duck typing checks capabilities (methods present) rather than strict class types.",
              "recoveryPath": {
                "simplerExplanation": "If it has the method, Python runs it.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d20-b2-str-repr-dunder",
        "day": 20,
        "blockNumber": 2,
        "title": "Magic Methods: __str__ and __repr__",
        "conceptBudget": {
          "primaryConcept": "String Representation Dunders",
          "supportingTerms": [
            "__str__() for Users",
            "__repr__() for Developers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d20-b1-duck-typing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "str_dunder.py",
            "initialCode": "class Book:\n    def __init__(self, title):\n        self.title = title\n    def __str__(self):\n        return f'Book: {self.title}'\n\nb = Book('Python Mastery')\nprint(str(b))",
            "expectedOutput": "Book: Python Mastery",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does print(str(Book('Clean Code'))) display when __str__ is defined as above?",
          "expectedStringOutput": "Book: Clean Code",
          "acceptableAnswers": [
            "Book: Clean Code",
            "'Book: Clean Code'"
          ],
          "primaryMisconceptionId": "MC_PY_MAGIC_METHOD_STR_REPR",
          "diagnosisMap": {
            "<Book object at 0x...>": {
              "misconceptionId": "MC_PY_MAGIC_METHOD_STR_REPR",
              "errorExplanation": "Defining __str__ replaces the default memory address printout with clean readable text.",
              "recoveryPath": {
                "simplerExplanation": "__str__ produces human-readable strings.",
                "guidedFixPrompt": "Type Book: Clean Code"
              }
            }
          }
        }
      },
      {
        "id": "py-d20-b3-len-eq-dunders",
        "day": 20,
        "blockNumber": 3,
        "title": "Operator Overloading: __len__ and __eq__",
        "conceptBudget": {
          "primaryConcept": "Container & Equality Dunders",
          "supportingTerms": [
            "__len__()",
            "__eq__() for obj1 == obj2"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d20-b2-str-repr-dunder",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "container_dunders.py",
            "initialCode": "class Deck:\n    def __init__(self):\n        self.cards = ['A', 'K', 'Q', 'J']\n    def __len__(self):\n        return len(self.cards)\n\nd = Deck()\nprint('Deck length:', len(d))",
            "expectedOutput": "Deck length: 4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is len(Deck()) when __len__ returns len(self.cards) (which has 4 cards)?",
          "expectedStringOutput": "Deck length: 4",
          "acceptableAnswers": [
            "Deck length: 4",
            "4"
          ],
          "primaryMisconceptionId": "MC_PY_MAGIC_METHOD_STR_REPR",
          "diagnosisMap": {
            "TypeError": {
              "misconceptionId": "MC_PY_MAGIC_METHOD_STR_REPR",
              "errorExplanation": "Defining __len__ enables standard len(obj) without errors.",
              "recoveryPath": {
                "simplerExplanation": "__len__ connects object to len() function.",
                "guidedFixPrompt": "Type Deck length: 4"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 4: Enterprise Polymorphic Payment Gateway Engine",
    "overviewMetaphor": "Milestone 4 — Payment Gateway: An e-commerce checkout treats Credit Card, UPI, and Crypto processors identically because each processor provides a uniform .process_payment(amount) method.",
    "blocks": [
      {
        "id": "py-d21-b1-processor-contracts",
        "day": 21,
        "blockNumber": 1,
        "title": "Designing Pluggable Payment Processors",
        "conceptBudget": {
          "primaryConcept": "Pluggable Architecture",
          "supportingTerms": [
            "Uniform Method Signatures",
            "Decoupled Integration"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d20-b1-duck-typing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gateway.py",
            "initialCode": "class CreditCard:\n    def process(self, amt): return f'CC Paid ${amt}'\n\nclass UPI:\n    def process(self, amt): return f'UPI Paid ${amt}'\n\ndef checkout(processor, amt):\n    return processor.process(amt)\n\nprint(checkout(CreditCard(), 100))\nprint(checkout(UPI(), 50))",
            "expectedOutput": "CC Paid $100\nUPI Paid $50",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does checkout() accept both CreditCard and UPI instances without error?",
          "options": [
            "Both objects implement the .process(amt) method signature (Duck Typing)",
            "Python automatically translates code into Java",
            "Because CreditCard and UPI are strings"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_INTERFACE_PROTOCOL_CONTRACT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_INTERFACE_PROTOCOL_CONTRACT",
              "errorExplanation": "Both classes provide matching .process(amt) methods.",
              "recoveryPath": {
                "simplerExplanation": "Matching method signatures enable polymorphic interchangeability.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d21-b2-fee-strategy",
        "day": 21,
        "blockNumber": 2,
        "title": "Dynamic Fee Calculation Strategies",
        "conceptBudget": {
          "primaryConcept": "Strategy Pattern",
          "supportingTerms": [
            "Fee Strategies",
            "Polymorphic Net Amount"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d21-b1-processor-contracts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fees.py",
            "initialCode": "class FixedFee:\n    def fee(self, amt): return 2.0\n\nclass PercentFee:\n    def fee(self, amt): return amt * 0.05\n\ndef net_payout(strategy, amt):\n    return amt - strategy.fee(amt)\n\nprint('Net with fixed fee on $100:', net_payout(FixedFee(), 100))",
            "expectedOutput": "Net with fixed fee on $100: 98.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is net_payout for $100 with FixedFee ($2.0 fee)?",
          "expectedStringOutput": "Net with fixed fee on $100: 98.0",
          "acceptableAnswers": [
            "Net with fixed fee on $100: 98.0",
            "98.0",
            "98"
          ],
          "primaryMisconceptionId": "MC_PY_INTERFACE_PROTOCOL_CONTRACT",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_PY_INTERFACE_PROTOCOL_CONTRACT",
              "errorExplanation": "100 - 2.0 = 98.0.",
              "recoveryPath": {
                "simplerExplanation": "100 - 2 = 98.0.",
                "guidedFixPrompt": "Type Net with fixed fee on $100: 98.0"
              }
            }
          }
        }
      },
      {
        "id": "py-d21-b3-transaction-audit-dispatch",
        "day": 21,
        "blockNumber": 3,
        "title": "Batch Transaction Dispatch & Validation",
        "conceptBudget": {
          "primaryConcept": "Batch Processing Dispatch",
          "supportingTerms": [
            "Dispatch Loop",
            "Transaction Record"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d21-b2-fee-strategy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "batch_dispatch.py",
            "initialCode": "class Gateway:\n    def process_all(self, payments):\n        return [p['proc'].process(p['amt']) for p in payments]\n\ngw = Gateway()\nqueue = [{'proc': CreditCard(), 'amt': 50}]\nprint('Batch Output:', gw.process_all(queue))",
            "expectedOutput": "Batch Output: ['CC Paid $50']",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the single output item in the batch above?",
          "expectedStringOutput": "Batch Output: ['CC Paid $50']",
          "acceptableAnswers": [
            "Batch Output: ['CC Paid $50']",
            "['CC Paid $50']",
            "CC Paid $50"
          ],
          "primaryMisconceptionId": "MC_PY_INTERFACE_PROTOCOL_CONTRACT",
          "diagnosisMap": {
            "None": {
              "misconceptionId": "MC_PY_INTERFACE_PROTOCOL_CONTRACT",
              "errorExplanation": "Returns list with formatted strings.",
              "recoveryPath": {
                "simplerExplanation": "List comprehension collects ['CC Paid $50'].",
                "guidedFixPrompt": "Type Batch Output: ['CC Paid $50']"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Exception Handling — try, except, else, finally & Custom Exceptions",
    "overviewMetaphor": "Exception handling is like an airbag in a car: if a crash occurs (an error), the airbag deploys (except block), catches the impact, and keeps the passengers safe without destroying the car.",
    "blocks": [
      {
        "id": "py-d22-b1-try-except",
        "day": 22,
        "blockNumber": 1,
        "title": "The try-except Block (Catching Runtime Errors)",
        "conceptBudget": {
          "primaryConcept": "try-except Structure",
          "supportingTerms": [
            "ZeroDivisionError",
            "Graceful Degradation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d9-b2-return-vs-print",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "try-except Anatomy",
            "codeSnippet": "try:\n    res = 10 / 0 # Crash attempt\nexcept ZeroDivisionError:\n    print('Cannot divide by zero!') # Safe recovery",
            "lineNotes": {
              "1": "try block contains risky code.",
              "3": "except catches specific error and prevents program crash."
            }
          },
          {
            "type": "runnable_code",
            "filename": "try_demo.py",
            "initialCode": "try:\n    val = 10 / 0\nexcept ZeroDivisionError:\n    val = 0\nprint('Safe Value:', val)",
            "expectedOutput": "Safe Value: 0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When 10 / 0 is intercepted by except ZeroDivisionError: val = 0, what does print('Safe Value:', val) output?",
          "expectedStringOutput": "Safe Value: 0",
          "acceptableAnswers": [
            "Safe Value: 0",
            "0"
          ],
          "primaryMisconceptionId": "MC_PY_DIVIDE_BY_ZERO",
          "diagnosisMap": {
            "Crash": {
              "misconceptionId": "MC_PY_DIVIDE_BY_ZERO",
              "errorExplanation": "try-except intercepted the division by zero and assigned val = 0.",
              "recoveryPath": {
                "simplerExplanation": "The crash was caught and handled safely.",
                "guidedFixPrompt": "Type Safe Value: 0"
              }
            }
          }
        }
      },
      {
        "id": "py-d22-b2-else-finally",
        "day": 22,
        "blockNumber": 2,
        "title": "The else & finally Blocks (Guaranteed Cleanup)",
        "conceptBudget": {
          "primaryConcept": "else and finally Clauses",
          "supportingTerms": [
            "else (runs on success)",
            "finally (ALWAYS runs)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d22-b1-try-except",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Locking the Front Door When Leaving",
            "simpleExplanation": "Whether your cooking was successful or burnt, you ALWAYS turn off the stove and lock the door (finally block)."
          },
          {
            "type": "runnable_code",
            "filename": "finally_demo.py",
            "initialCode": "try:\n    x = 10 / 2\nexcept ZeroDivisionError:\n    print('Error')\nfinally:\n    print('Cleanup: Resources Released')",
            "expectedOutput": "Cleanup: Resources Released",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Under what conditions does code inside a `finally:` block execute?",
          "options": [
            "ALWAYS, regardless of whether errors occurred, were caught, or didn't happen",
            "Only when an unhandled error happens",
            "Only when no errors occur"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_FINALLY_ALWAYS_RUNS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_FINALLY_ALWAYS_RUNS",
              "errorExplanation": "finally blocks are guaranteed to run in all execution paths.",
              "recoveryPath": {
                "simplerExplanation": "finally = ALWAYS runs guaranteed.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d22-b3-raise-custom-exceptions",
        "day": 22,
        "blockNumber": 3,
        "title": "Raising Exceptions with raise & Custom Errors",
        "conceptBudget": {
          "primaryConcept": "The raise Keyword",
          "supportingTerms": [
            "raise ValueError()",
            "Custom Error Class"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d22-b2-else-finally",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "raise_demo.py",
            "initialCode": "class InvalidAmountError(Exception):\n    pass\n\ndef deposit(amt):\n    if amt <= 0:\n        raise InvalidAmountError('Amount must be > 0')\n    return amt\n\ntry:\n    deposit(-10)\nexcept InvalidAmountError as e:\n    print('Caught Custom Error:', e)",
            "expectedOutput": "Caught Custom Error: Amount must be > 0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In the code above, what error message is printed inside e?",
          "expectedStringOutput": "Caught Custom Error: Amount must be > 0",
          "acceptableAnswers": [
            "Caught Custom Error: Amount must be > 0",
            "Amount must be > 0"
          ],
          "primaryMisconceptionId": "MC_PY_RAISE_EXCEPTION_TYPE",
          "diagnosisMap": {
            "None": {
              "misconceptionId": "MC_PY_RAISE_EXCEPTION_TYPE",
              "errorExplanation": "e contains the string passed to the exception constructor.",
              "recoveryPath": {
                "simplerExplanation": "Prints 'Caught Custom Error: Amount must be > 0'.",
                "guidedFixPrompt": "Type Caught Custom Error: Amount must be > 0"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Context Managers & Safe File I/O (with open(...) as f:)",
    "overviewMetaphor": "The `with open()` context manager is like an automatic sliding door at a supermarket: as soon as you enter, it opens; and the moment you step out, it automatically shuts and locks behind you, preventing resource leaks.",
    "blocks": [
      {
        "id": "py-d23-b1-with-open-syntax",
        "day": 23,
        "blockNumber": 1,
        "title": "The with Statement & Automatic File Closing",
        "conceptBudget": {
          "primaryConcept": "Context Manager (with open)",
          "supportingTerms": [
            "Automatic Descriptor Close",
            "File Modes ('r', 'w', 'a')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d22-b2-else-finally",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "with open Syntax",
            "codeSnippet": "with open('log.txt', 'r') as f:\n    data = f.read() # Automatically closed when block ends!",
            "lineNotes": {
              "1": "with open ensures the file handle is closed even if crashes happen."
            }
          },
          {
            "type": "runnable_code",
            "filename": "file_io.py",
            "initialCode": "import io\n\nsimulated_file = io.StringIO('Line 1\\nLine 2')\nwith simulated_file as f:\n    for line in f:\n        print('Stream Read:', line.strip())",
            "expectedOutput": "Stream Read: Line 1\nStream Read: Line 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary benefit of using `with open(...) as f:` over raw `f = open(...)`?",
          "options": [
            "It guarantees that the file is automatically closed and freed, even if an exception occurs",
            "It runs the code twice as fast",
            "It automatically encrypts the file"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_FILE_RESOURCE_LEAK_NO_WITH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_FILE_RESOURCE_LEAK_NO_WITH",
              "errorExplanation": "with context managers prevent file descriptor leaks by guaranteeing automatic cleanup.",
              "recoveryPath": {
                "simplerExplanation": "with open = automatic file closing.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d23-b2-line-by-line-parsing",
        "day": 23,
        "blockNumber": 2,
        "title": "Line-by-Line Stream Reading (Memory Safe)",
        "conceptBudget": {
          "primaryConcept": "Stream Reading",
          "supportingTerms": [
            "for line in f",
            "strip() Whitespace Clean"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d23-b1-with-open-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "stream_read.py",
            "initialCode": "import io\n\nlog_data = io.StringIO('[INFO] Start\\n[ERROR] Fail\\n[INFO] End')\nerror_count = 0\nfor line in log_data:\n    if line.startswith('[ERROR]'):\n        error_count += 1\nprint('Total Errors Found:', error_count)",
            "expectedOutput": "Total Errors Found: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many [ERROR] lines were detected in the stream above?",
          "expectedStringOutput": "Total Errors Found: 1",
          "acceptableAnswers": [
            "Total Errors Found: 1",
            "1"
          ],
          "primaryMisconceptionId": "MC_PY_FILE_READLINE_STRIP_NEWLINE",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_PY_FILE_READLINE_STRIP_NEWLINE",
              "errorExplanation": "Only 1 line started with '[ERROR]'.",
              "recoveryPath": {
                "simplerExplanation": "Count is 1.",
                "guidedFixPrompt": "Type Total Errors Found: 1"
              }
            }
          }
        }
      },
      {
        "id": "py-d23-b3-csv-parsing",
        "day": 23,
        "blockNumber": 3,
        "title": "CSV Text Parsing & Column Splitting",
        "conceptBudget": {
          "primaryConcept": "CSV String Splitting",
          "supportingTerms": [
            "split(',')",
            "Header Row"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d23-b2-line-by-line-parsing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "csv_parse.py",
            "initialCode": "row = '101,Sarah,sarah@pinit.ai'\nuser_id, name, email = row.split(',')\nprint(f'User: {name} (ID #{user_id})')",
            "expectedOutput": "User: Sarah (ID #101)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is user_id in the unpacked CSV row above?",
          "expectedStringOutput": "101",
          "acceptableAnswers": [
            "101",
            "'101'"
          ],
          "primaryMisconceptionId": "MC_PY_FILE_READLINE_STRIP_NEWLINE",
          "diagnosisMap": {
            "Sarah": {
              "misconceptionId": "MC_PY_FILE_READLINE_STRIP_NEWLINE",
              "errorExplanation": "user_id is the first element '101'.",
              "recoveryPath": {
                "simplerExplanation": "First column is 101.",
                "guidedFixPrompt": "Type 101"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "JSON Serialization & Deserialization (json.dumps, json.loads)",
    "overviewMetaphor": "JSON is the universal passport of data: it converts live Python dictionary objects into a standardized text string (dumps) so they can travel across the internet, and unpacks them back into Python objects (loads) upon arrival.",
    "blocks": [
      {
        "id": "py-d24-b1-json-dumps",
        "day": 24,
        "blockNumber": 1,
        "title": "Serializing to JSON Strings: json.dumps()",
        "conceptBudget": {
          "primaryConcept": "JSON Serialization",
          "supportingTerms": [
            "json.dumps()",
            "dict -> JSON str"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d14-b1-dict-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "json.dumps Syntax",
            "codeSnippet": "import json\n\ndata = {'name': 'Alex', 'score': 100}\njson_str = json.dumps(data) # '{\"name\": \"Alex\", \"score\": 100}'",
            "lineNotes": {
              "4": "json.dumps converts Python dict into a text string."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dumps_demo.py",
            "initialCode": "import json\n\nuser = {'id': 42, 'role': 'ADMIN'}\nprint('JSON String:', json.dumps(user))",
            "expectedOutput": "JSON String: {\"id\": 42, \"role\": \"ADMIN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does json.dumps(obj) return in Python?",
          "options": [
            "A formatted JSON text string",
            "A binary file on the hard drive",
            "A Python list"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_JSON_LOADS_VS_DUMPS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_JSON_LOADS_VS_DUMPS",
              "errorExplanation": "dumps returns a string (the 's' stands for string).",
              "recoveryPath": {
                "simplerExplanation": "json.dumps() creates a JSON text string.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d24-b2-json-loads",
        "day": 24,
        "blockNumber": 2,
        "title": "Deserializing from JSON: json.loads()",
        "conceptBudget": {
          "primaryConcept": "JSON Deserialization",
          "supportingTerms": [
            "json.loads()",
            "JSON str -> dict"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d24-b1-json-dumps",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "loads_demo.py",
            "initialCode": "import json\n\npayload = '{\"service\": \"AUTH\", \"port\": 8000}'\nparsed = json.loads(payload)\nprint('Service Port:', parsed['port'])",
            "expectedOutput": "Service Port: 8000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is parsed['port'] in the code above?",
          "expectedStringOutput": "8000",
          "acceptableAnswers": [
            "8000"
          ],
          "primaryMisconceptionId": "MC_PY_JSON_LOADS_VS_DUMPS",
          "diagnosisMap": {
            "'port'": {
              "misconceptionId": "MC_PY_JSON_LOADS_VS_DUMPS",
              "errorExplanation": "parsed['port'] accesses the value 8000.",
              "recoveryPath": {
                "simplerExplanation": "Returns integer 8000.",
                "guidedFixPrompt": "Type 8000"
              }
            }
          }
        }
      },
      {
        "id": "py-d24-b3-json-error-handling",
        "day": 24,
        "blockNumber": 3,
        "title": "Safe JSON Parsing with try-except",
        "conceptBudget": {
          "primaryConcept": "JSONDecodeError Handling",
          "supportingTerms": [
            "Malformed Payloads",
            "Graceful Fallback"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d24-b2-json-loads",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "safe_json.py",
            "initialCode": "import json\n\nbad_json = '{bad json string}'\ntry:\n    data = json.loads(bad_json)\nexcept Exception:\n    data = {'error': 'INVALID_JSON'}\nprint('Status:', data['error'])",
            "expectedOutput": "Status: INVALID_JSON",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is data['error'] when bad JSON is safely caught?",
          "expectedStringOutput": "INVALID_JSON",
          "acceptableAnswers": [
            "INVALID_JSON",
            "'INVALID_JSON'"
          ],
          "primaryMisconceptionId": "MC_PY_JSON_LOADS_VS_DUMPS",
          "diagnosisMap": {
            "Crash": {
              "misconceptionId": "MC_PY_JSON_LOADS_VS_DUMPS",
              "errorExplanation": "try-except caught the decode error and assigned the fallback dict.",
              "recoveryPath": {
                "simplerExplanation": "Returns 'INVALID_JSON'.",
                "guidedFixPrompt": "Type INVALID_JSON"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Decorators, Higher-Order Functions & Lambda Expressions",
    "overviewMetaphor": "A Decorator is gift wrapping around a present: the original present (function) stays inside, but the wrapping adds ribbons, labels, or security locks around it without modifying the present itself.",
    "blocks": [
      {
        "id": "py-d25-b1-first-class-functions",
        "day": 25,
        "blockNumber": 1,
        "title": "Functions as First-Class Citizens",
        "conceptBudget": {
          "primaryConcept": "First-Class Functions",
          "supportingTerms": [
            "Passing Functions as Arguments",
            "Higher-Order Functions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d9-b2-return-vs-print",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Hiring a Contractor",
            "simpleExplanation": "You pass a job description (function) to a manager who calls it at the right time."
          },
          {
            "type": "runnable_code",
            "filename": "higher_order.py",
            "initialCode": "def apply_op(val, func):\n    return func(val)\n\ndef double(x):\n    return x * 2\n\nprint('Applied double to 5:', apply_op(5, double))",
            "expectedOutput": "Applied double to 5: 10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is apply_op(5, double) when double multiplies by 2?",
          "expectedStringOutput": "Applied double to 5: 10",
          "acceptableAnswers": [
            "Applied double to 5: 10",
            "10"
          ],
          "primaryMisconceptionId": "MC_PY_FUNCTION_DEF_VS_CALL",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_PY_FUNCTION_DEF_VS_CALL",
              "errorExplanation": "double(5) calculates 5 * 2 = 10.",
              "recoveryPath": {
                "simplerExplanation": "5 * 2 = 10.",
                "guidedFixPrompt": "Type Applied double to 5: 10"
              }
            }
          }
        }
      },
      {
        "id": "py-d25-b2-decorator-syntax",
        "day": 25,
        "blockNumber": 2,
        "title": "The @decorator Wrapper Syntax",
        "conceptBudget": {
          "primaryConcept": "Decorator Wrapper (@)",
          "supportingTerms": [
            "Wrapper Function",
            "Meta-Programming"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d25-b1-first-class-functions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Decorator Anatomy",
            "codeSnippet": "def my_decorator(func):\n    def wrapper(*args, **kwargs):\n        print('Before call')\n        return func(*args, **kwargs)\n    return wrapper",
            "lineNotes": {
              "1": "my_decorator receives the target function.",
              "5": "wrapper wraps execution and returns the result."
            }
          },
          {
            "type": "runnable_code",
            "filename": "decorator_demo.py",
            "initialCode": "def banner_dec(func):\n    def wrapper(name):\n        return f'*** {func(name)} ***'\n    return wrapper\n\n@banner_dec\ndef greet(name):\n    return f'Hello {name}'\n\nprint(greet('Alex'))",
            "expectedOutput": "*** Hello Alex ***",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does putting `@my_decorator` above a function definition do in Python?",
          "options": [
            "It wraps the function with my_decorator to add reusable behavior",
            "It converts the function into C code",
            "It runs the function in the background"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_DECORATOR_WRAPPER_RETURN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_DECORATOR_WRAPPER_RETURN",
              "errorExplanation": "Decorators wrap functions with pre/post execution hooks.",
              "recoveryPath": {
                "simplerExplanation": "Decorators wrap functions cleanly.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d25-b3-lambda-functions",
        "day": 25,
        "blockNumber": 3,
        "title": "Anonymous Lambda Functions: lambda x: expr",
        "conceptBudget": {
          "primaryConcept": "Lambda Expressions",
          "supportingTerms": [
            "Anonymous Function",
            "One-Line Expression"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d25-b2-decorator-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lambdas.py",
            "initialCode": "double = lambda x: x * 2\nprint('Lambda double 7:', double(7))\n\nitems = [('B', 30), ('A', 10)]\nitems.sort(key=lambda item: item[1])\nprint('Sorted by price:', items)",
            "expectedOutput": "Lambda double 7: 14\nSorted by price: [('A', 10), ('B', 30)]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is (lambda a, b: a + b)(3, 4)?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7"
          ],
          "primaryMisconceptionId": "MC_PY_LAMBDA_ONE_EXPRESSION",
          "diagnosisMap": {
            "34": {
              "misconceptionId": "MC_PY_LAMBDA_ONE_EXPRESSION",
              "errorExplanation": "Lambda adds 3 + 4 = 7 as integers.",
              "recoveryPath": {
                "simplerExplanation": "3 + 4 = 7.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "⭐ MILESTONE 5: Word Frequency & Inverted Index Search Engine",
    "overviewMetaphor": "Milestone 5 — Full-Text Search Engine: An inverted search index maps every unique word in an entire library to the exact document IDs containing it, powering sub-millisecond search across gigabytes of text.",
    "blocks": [
      {
        "id": "py-d26-b1-tokenization",
        "day": 26,
        "blockNumber": 1,
        "title": "Text Sanitization & Tokenization",
        "conceptBudget": {
          "primaryConcept": "Text Tokenization",
          "supportingTerms": [
            "lower()",
            "strip()",
            "split()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d14-b1-dict-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tokenize.py",
            "initialCode": "raw_text = 'Python, Fast API, and Python Data!'\ncleaned = [w.strip(',!') for w in raw_text.lower().split()]\nprint('Token Stream:', cleaned)",
            "expectedOutput": "Token Stream: ['python', 'fast', 'api', 'and', 'python', 'data']",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many times does 'python' appear in the Token Stream above?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 times"
          ],
          "primaryMisconceptionId": "MC_PY_STR_INT_CONCAT_TYPE_ERROR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_STR_INT_CONCAT_TYPE_ERROR",
              "errorExplanation": "Both 'Python,' and 'Python' were sanitized to lowercase 'python' (count = 2).",
              "recoveryPath": {
                "simplerExplanation": "'python' appears at index 0 and index 4 -> count is 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "py-d26-b2-inverted-index",
        "day": 26,
        "blockNumber": 2,
        "title": "Building the Inverted Document Index",
        "conceptBudget": {
          "primaryConcept": "Inverted Index Architecture",
          "supportingTerms": [
            "word -> set(doc_ids)",
            "Fast Text Search"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d26-b1-tokenization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "inverted_index.py",
            "initialCode": "docs = {1: 'Learn Python', 2: 'Python Backend'}\nindex = {}\nfor doc_id, text in docs.items():\n    for word in text.lower().split():\n        index.setdefault(word, set()).add(doc_id)\nprint('Docs containing python:', sorted(list(index['python'])))",
            "expectedOutput": "Docs containing python: [1, 2]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which document IDs contain 'python' in the index above?",
          "expectedStringOutput": "[1, 2]",
          "acceptableAnswers": [
            "[1, 2]",
            "1, 2",
            "1 and 2"
          ],
          "primaryMisconceptionId": "MC_PY_DICT_KEY_ERROR",
          "diagnosisMap": {
            "[1]": {
              "misconceptionId": "MC_PY_DICT_KEY_ERROR",
              "errorExplanation": "Both doc 1 and doc 2 contain 'python'.",
              "recoveryPath": {
                "simplerExplanation": "Both documents match -> [1, 2].",
                "guidedFixPrompt": "Type [1, 2]"
              }
            }
          }
        }
      },
      {
        "id": "py-d26-b3-query-engine",
        "day": 26,
        "blockNumber": 3,
        "title": "Multi-Word AND Query Search Matching",
        "conceptBudget": {
          "primaryConcept": "Search Query Resolution",
          "supportingTerms": [
            "Set Intersection Matching",
            "Fast Search Ranking"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d26-b2-inverted-index",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "search_engine.py",
            "initialCode": "index = {'python': {1, 2, 3}, 'backend': {2, 3}, 'fast': {3}}\nquery = ['python', 'backend']\nmatches = index[query[0]] & index[query[1]]\nprint('Search Results (docs with BOTH terms):', sorted(list(matches)))",
            "expectedOutput": "Search Results (docs with BOTH terms): [2, 3]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What docs match BOTH 'python' {1, 2, 3} and 'backend' {2, 3}?",
          "expectedStringOutput": "[2, 3]",
          "acceptableAnswers": [
            "[2, 3]",
            "2, 3",
            "2 and 3"
          ],
          "primaryMisconceptionId": "MC_PY_SET_UNIQUENESS",
          "diagnosisMap": {
            "[1, 2, 3]": {
              "misconceptionId": "MC_PY_SET_UNIQUENESS",
              "errorExplanation": "Doc 1 lacks 'backend', so only {2, 3} match both terms.",
              "recoveryPath": {
                "simplerExplanation": "Intersection of {1, 2, 3} and {2, 3} is [2, 3].",
                "guidedFixPrompt": "Type [2, 3]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Asynchronous Python (async, await & asyncio Event Loops)",
    "overviewMetaphor": "Asynchronous I/O is like a restaurant chef: while a soup is simmering on the stove for 10 minutes (I/O wait), the chef doesn't stand frozen staring at the pot; they immediately chop vegetables for the salad.",
    "blocks": [
      {
        "id": "py-d27-b1-async-concept",
        "day": 27,
        "blockNumber": 1,
        "title": "Async Coroutines: async def & await",
        "conceptBudget": {
          "primaryConcept": "Coroutines (async / await)",
          "supportingTerms": [
            "async def",
            "await Non-Blocking I/O"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d25-b1-first-class-functions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "async/await Anatomy",
            "codeSnippet": "import asyncio\n\nasync def fetch_data():\n    await asyncio.sleep(0.01) # Non-blocking pause\n    return 'Data Loaded'",
            "lineNotes": {
              "3": "async def declares a coroutine.",
              "4": "await pauses execution without blocking other tasks."
            }
          },
          {
            "type": "runnable_code",
            "filename": "async_demo.py",
            "initialCode": "import asyncio\n\nasync def main():\n    return 'Async Ready'\n\nprint('Result:', asyncio.run(main()))",
            "expectedOutput": "Result: Async Ready",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What keyword is used to declare an asynchronous coroutine in Python?",
          "options": [
            "async def",
            "thread def",
            "defer def"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE",
              "errorExplanation": "Python uses 'async def' for coroutines.",
              "recoveryPath": {
                "simplerExplanation": "async def declares asynchronous functions.",
                "guidedFixPrompt": "Select Option A: async def"
              }
            }
          }
        }
      },
      {
        "id": "py-d27-b2-asyncio-gather",
        "day": 27,
        "blockNumber": 2,
        "title": "Concurrent Task Execution with asyncio.gather()",
        "conceptBudget": {
          "primaryConcept": "Concurrent Gathering",
          "supportingTerms": [
            "asyncio.gather()",
            "Parallel I/O"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d27-b1-async-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gather_demo.py",
            "initialCode": "import asyncio\n\nasync def fetch_user(uid):\n    return f'User_{uid}'\n\nasync def main():\n    users = await asyncio.gather(fetch_user(1), fetch_user(2))\n    print('Gathered Users:', users)\n\nasyncio.run(main())",
            "expectedOutput": "Gathered Users: ['User_1', 'User_2']",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What list is gathered by asyncio.gather(fetch_user(1), fetch_user(2))?",
          "expectedStringOutput": "Gathered Users: ['User_1', 'User_2']",
          "acceptableAnswers": [
            "Gathered Users: ['User_1', 'User_2']",
            "['User_1', 'User_2']"
          ],
          "primaryMisconceptionId": "MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE",
          "diagnosisMap": {
            "None": {
              "misconceptionId": "MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE",
              "errorExplanation": "gather collects all coroutine return values into a list.",
              "recoveryPath": {
                "simplerExplanation": "Gathers results into ['User_1', 'User_2'].",
                "guidedFixPrompt": "Type Gathered Users: ['User_1', 'User_2']"
              }
            }
          }
        }
      },
      {
        "id": "py-d27-b3-unresolved-coroutine-trap",
        "day": 27,
        "blockNumber": 3,
        "title": "The Un-awaited Coroutine Warning Trap",
        "conceptBudget": {
          "primaryConcept": "Awaiting Coroutines",
          "supportingTerms": [
            "RuntimeWarning",
            "Coroutine Object"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d27-b2-asyncio-gather",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Missing await Bug",
              "brokenCode": "async def get_data(): return 42\nx = get_data() # ❌ x is <coroutine object>, NOT the integer 42!",
              "fixedCode": "async def get_data(): return 42\nx = await get_data() # ✅ x is the integer 42",
              "errorLine": 2,
              "errorReason": "Calling an async def function without await returns an un-executed coroutine object.",
              "fixExplanation": "Always place await before calling async functions."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_await.py",
            "initialCode": "import asyncio\n\nasync def compute(): return 100\nasync def main():\n    val = await compute()\n    print('Awaited Value:', val)\n\nasyncio.run(main())",
            "expectedOutput": "Awaited Value: 100",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if you call `get_data()` (an async def function) without the `await` keyword?",
          "options": [
            "It returns a coroutine object instead of executing and returning the actual data value",
            "It automatically runs synchronously",
            "It deletes the function"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_ASYNC_AWAIT_UNRESOLVED_COROUTINE",
              "errorExplanation": "Async functions must be awaited to yield their return values.",
              "recoveryPath": {
                "simplerExplanation": "Without await, you only get the coroutine wrapper.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Modern Type Hints, Static Typing & Pydantic Data Models",
    "overviewMetaphor": "Type hints are clear luggage tags on airport bags: even though bags can hold anything, the tag 'Fragile Electronics' tells everyone exactly what kind of payload is expected inside.",
    "blocks": [
      {
        "id": "py-d28-b1-type-hints",
        "day": 28,
        "blockNumber": 1,
        "title": "Type Annotations: def func(a: int) -> str:",
        "conceptBudget": {
          "primaryConcept": "PEP 484 Type Hints",
          "supportingTerms": [
            "Parameter Annotations : int",
            "Return Type -> str"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d9-b1-def-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Type Hint Anatomy",
            "codeSnippet": "def format_price(amount: float, symbol: str = '$') -> str:\n    return f'{symbol}{amount:.2f}'",
            "lineNotes": {
              "1": "amount: float and -> str document expected types for IDEs and linters."
            }
          },
          {
            "type": "runnable_code",
            "filename": "type_hints.py",
            "initialCode": "def add_tax(price: float, rate: float = 0.05) -> float:\n    return round(price * (1 + rate), 2)\n\nprint('Total with tax:', add_tax(100.0))",
            "expectedOutput": "Total with tax: 105.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Does Python reject code at runtime if you pass a string to a function annotated with `amount: int`?",
          "options": [
            "No, Python type hints are advisory documentation and not strictly enforced at runtime by standard Python",
            "Yes, Python halts with a StaticTypeError",
            "Only on Tuesdays"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_TYPE_HINT_RUNTIME_IGNORE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_TYPE_HINT_RUNTIME_IGNORE",
              "errorExplanation": "Standard Python does not enforce type hints at runtime (tools like mypy or Pydantic do).",
              "recoveryPath": {
                "simplerExplanation": "Python type hints are advisory for developers and IDEs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d28-b2-typing-module",
        "day": 28,
        "blockNumber": 2,
        "title": "Advanced Types: Optional[T], Union[A, B], list[str]",
        "conceptBudget": {
          "primaryConcept": "typing Module Generics",
          "supportingTerms": [
            "Optional[str] (can be None)",
            "dict[str, Any]"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d28-b1-type-hints",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "typing_demo.py",
            "initialCode": "def find_user(uid: int) -> dict | None:\n    if uid == 1:\n        return {'name': 'Alex'}\n    return None\n\nprint('User 1:', find_user(1))\nprint('User 99:', find_user(99))",
            "expectedOutput": "User 1: {'name': 'Alex'}\nUser 99: None",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does the type annotation `str | None` (or `Optional[str]`) mean?",
          "options": [
            "The value can either be a valid string or None",
            "The string cannot contain spaces",
            "The string is encrypted"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_TYPE_HINT_RUNTIME_IGNORE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_TYPE_HINT_RUNTIME_IGNORE",
              "errorExplanation": "Optional[T] (T | None) signals that None is an acceptable value.",
              "recoveryPath": {
                "simplerExplanation": "str | None means string OR None.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d28-b3-schema-validation",
        "day": 28,
        "blockNumber": 3,
        "title": "Runtime Schema Validation Principles",
        "conceptBudget": {
          "primaryConcept": "Schema Validation",
          "supportingTerms": [
            "Pydantic Model Principles",
            "Field Constraints"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d28-b2-typing-module",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "validator.py",
            "initialCode": "def validate_product(p: dict) -> bool:\n    return isinstance(p.get('name'), str) and isinstance(p.get('price'), (int, float)) and p['price'] > 0\n\nprint('Valid Product:', validate_product({'name': 'Book', 'price': 12.99}))\nprint('Invalid Product:', validate_product({'name': 'Book', 'price': -5}))",
            "expectedOutput": "Valid Product: True\nInvalid Product: False",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does validate_product return for price=-5?",
          "expectedStringOutput": "False",
          "acceptableAnswers": [
            "False",
            "false"
          ],
          "primaryMisconceptionId": "MC_PY_TYPE_HINT_RUNTIME_IGNORE",
          "diagnosisMap": {
            "True": {
              "misconceptionId": "MC_PY_TYPE_HINT_RUNTIME_IGNORE",
              "errorExplanation": "Price -5 violates the p['price'] > 0 constraint.",
              "recoveryPath": {
                "simplerExplanation": "Negative price fails validation -> False.",
                "guidedFixPrompt": "Type False"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Web API Architecture with FastAPI & HTTP Route Controllers",
    "overviewMetaphor": "A Web API is like a restaurant waiter: the client (customer) makes an HTTP GET/POST request (orders from the menu), the route controller (waiter) passes it to the kitchen (database/services), and returns a JSON response (food on a plate) with an HTTP status code.",
    "blocks": [
      {
        "id": "py-d29-b1-http-methods",
        "day": 29,
        "blockNumber": 1,
        "title": "HTTP Methods (GET, POST) & Status Codes (200, 404)",
        "conceptBudget": {
          "primaryConcept": "HTTP Request/Response Cycle",
          "supportingTerms": [
            "GET (Retrieve)",
            "POST (Create)",
            "Status 200 OK vs 404 Not Found"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d24-b1-json-dumps",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "HTTP Status Codes",
            "codeSnippet": "200: OK (Success)\n201: Created (Resource created)\n400: Bad Request (Invalid client data)\n404: Not Found (Resource missing)\n500: Internal Server Error (Backend crash)",
            "lineNotes": {
              "1": "200 indicates standard successful HTTP response.",
              "4": "404 indicates missing endpoint or resource."
            }
          },
          {
            "type": "runnable_code",
            "filename": "http_demo.py",
            "initialCode": "def router(method, path):\n    if method == 'GET' and path == '/health':\n        return {'status': 200, 'body': {'status': 'healthy'}}\n    return {'status': 404, 'body': {'error': 'Not Found'}}\n\nprint('/health response:', router('GET', '/health'))",
            "expectedOutput": "/health response: {'status': 200, 'body': {'status': 'healthy'}}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which HTTP status code signifies a successful request?",
          "options": [
            "200 OK",
            "404 Not Found",
            "500 Server Error"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_FASTAPI_STATUS_CODE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_FASTAPI_STATUS_CODE",
              "errorExplanation": "404 means Not Found; 200 means OK/Success.",
              "recoveryPath": {
                "simplerExplanation": "200 = Success.",
                "guidedFixPrompt": "Select Option A: 200 OK"
              }
            }
          }
        }
      },
      {
        "id": "py-d29-b2-fastapi-routes",
        "day": 29,
        "blockNumber": 2,
        "title": "FastAPI Route Controllers & Decorators (@app.get)",
        "conceptBudget": {
          "primaryConcept": "FastAPI Routing",
          "supportingTerms": [
            "@app.get('/path')",
            "JSON Response Body"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d29-b1-http-methods",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "FastAPI Endpoint Syntax",
            "codeSnippet": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/users/{user_id}')\ndef get_user(user_id: int):\n    return {'user_id': user_id, 'status': 'ACTIVE'}",
            "lineNotes": {
              "5": "@app.get maps HTTP GET requests to the get_user function."
            }
          },
          {
            "type": "runnable_code",
            "filename": "route_demo.py",
            "initialCode": "def handle_get_user(user_id: int) -> dict:\n    return {'id': user_id, 'name': f'User_{user_id}', 'active': True}\n\nprint('API Output:', handle_get_user(42))",
            "expectedOutput": "API Output: {'id': 42, 'name': 'User_42', 'active': True}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What dictionary is returned by handle_get_user(42)?",
          "expectedStringOutput": "API Output: {'id': 42, 'name': 'User_42', 'active': True}",
          "acceptableAnswers": [
            "API Output: {'id': 42, 'name': 'User_42', 'active': True}",
            "{'id': 42, 'name': 'User_42', 'active': True}"
          ],
          "primaryMisconceptionId": "MC_PY_FASTAPI_STATUS_CODE",
          "diagnosisMap": {
            "None": {
              "misconceptionId": "MC_PY_FASTAPI_STATUS_CODE",
              "errorExplanation": "Returns JSON dict with id, name, and active fields.",
              "recoveryPath": {
                "simplerExplanation": "Formats user dictionary for ID 42.",
                "guidedFixPrompt": "Type API Output: {'id': 42, 'name': 'User_42', 'active': True}"
              }
            }
          }
        }
      },
      {
        "id": "py-d29-b3-path-params",
        "day": 29,
        "blockNumber": 3,
        "title": "Path Parameters & Query Parameters",
        "conceptBudget": {
          "primaryConcept": "API Parameters",
          "supportingTerms": [
            "Path Parameter /users/{id}",
            "Query Parameter ?limit=10"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d29-b2-fastapi-routes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "params_demo.py",
            "initialCode": "def get_items(category: str, limit: int = 10):\n    return f'Fetching up to {limit} items in category: {category}'\n\nprint(get_items('books', 5))",
            "expectedOutput": "Fetching up to 5 items in category: books",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is printed by get_items('books', 5)?",
          "expectedStringOutput": "Fetching up to 5 items in category: books",
          "acceptableAnswers": [
            "Fetching up to 5 items in category: books"
          ],
          "primaryMisconceptionId": "MC_PY_FASTAPI_STATUS_CODE",
          "diagnosisMap": {
            "None": {
              "misconceptionId": "MC_PY_FASTAPI_STATUS_CODE",
              "errorExplanation": "Prints formatted string with limit 5 and category books.",
              "recoveryPath": {
                "simplerExplanation": "Prints 'Fetching up to 5 items in category: books'.",
                "guidedFixPrompt": "Type Fetching up to 5 items in category: books"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise High-Performance Transaction Ledger Auditor & Backend API",
    "overviewMetaphor": "Final Capstone Synthesis: The complete financial operating system bringing together Object-Oriented Entities, Defensive Validation, High-Speed Dictionary Lookups, Batch Reconciliation, and Web API Reporting.",
    "blocks": [
      {
        "id": "py-d30-b1-architecture",
        "day": 30,
        "blockNumber": 1,
        "title": "Capstone System Architecture & Domain Entities",
        "conceptBudget": {
          "primaryConcept": "Domain-Driven Design",
          "supportingTerms": [
            "Transaction Entity",
            "Auditor Engine",
            "Reconciliation Pipeline"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d29-b2-fastapi-routes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Capstone Ledger Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Transaction Ingestion (Validation)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Reconcile Balance (+CREDIT, -DEBIT)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Category Aggregation & Anomaly Check",
                  "kind": "decision"
                },
                {
                  "id": "4",
                  "label": "4. Generate Audit Report API Payload",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "architecture.py",
            "initialCode": "class Transaction:\n    def __init__(self, tx_type, amount, category):\n        if amount <= 0:\n            raise ValueError('Amount must be > 0')\n        self.tx_type = tx_type\n        self.amount = amount\n        self.category = category\n\ntx = Transaction('CREDIT', 250.0, 'SALARY')\nprint(f'Valid Transaction: {tx.tx_type} ${tx.amount} ({tx.category})')",
            "expectedOutput": "Valid Transaction: CREDIT $250.0 (SALARY)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should the `Transaction` entity validate `amount > 0` directly inside `__init__`?",
          "options": [
            "To guarantee that corrupted/negative transaction objects can never exist in memory (Domain Invariant)",
            "To make the transaction run faster",
            "Because Python does not allow negative numbers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_PY_CAPSTONE_TRANSACTION_RECONCILER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_PY_CAPSTONE_TRANSACTION_RECONCILER",
              "errorExplanation": "Validating inside the constructor prevents invalid state from ever entering the system.",
              "recoveryPath": {
                "simplerExplanation": "Enforces valid state at object creation.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "py-d30-b2-auditor-reconciliation",
        "day": 30,
        "blockNumber": 2,
        "title": "Balance Reconciliation & Total Credits/Debits",
        "conceptBudget": {
          "primaryConcept": "Ledger Reconciliation",
          "supportingTerms": [
            "Credits (+)",
            "Debits (-)",
            "Final Net Balance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d30-b1-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "auditor_core.py",
            "initialCode": "class Ledger:\n    def __init__(self, init_bal=0.0):\n        self.init_bal = init_bal\n        self.txs = []\n    def add(self, kind, amt):\n        self.txs.append((kind, amt))\n    def balance(self):\n        bal = self.init_bal\n        for kind, amt in self.txs:\n            bal += amt if kind == 'CREDIT' else -amt\n        return bal\n\nledger = Ledger(100)\nledger.add('CREDIT', 50)\nledger.add('DEBIT', 20)\nprint('Reconciled Balance: $', ledger.balance())",
            "expectedOutput": "Reconciled Balance: $ 130",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Starting at 100, adding CREDIT 50 and DEBIT 20 gives what balance (100 + 50 - 20)?",
          "expectedStringOutput": "Reconciled Balance: $ 130",
          "acceptableAnswers": [
            "Reconciled Balance: $ 130",
            "130",
            "$130"
          ],
          "primaryMisconceptionId": "MC_PY_CAPSTONE_TRANSACTION_RECONCILER",
          "diagnosisMap": {
            "170": {
              "misconceptionId": "MC_PY_CAPSTONE_TRANSACTION_RECONCILER",
              "errorExplanation": "DEBIT subtracts from the balance: 100 + 50 - 20 = 130.",
              "recoveryPath": {
                "simplerExplanation": "100 + 50 - 20 = 130.",
                "guidedFixPrompt": "Type Reconciled Balance: $ 130"
              }
            }
          }
        }
      },
      {
        "id": "py-d30-b3-audit-report-generator",
        "day": 30,
        "blockNumber": 3,
        "title": "Structured Audit Report & Telemetry Generation",
        "conceptBudget": {
          "primaryConcept": "Audit Report Generation",
          "supportingTerms": [
            "Aggregation Telemetry",
            "JSON-Ready Summary"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d30-b2-auditor-reconciliation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "report_gen.py",
            "initialCode": "def generate_report(initial_bal, credits, debits):\n    return {\n        'initial_balance': initial_bal,\n        'total_credits': credits,\n        'total_debits': debits,\n        'final_balance': initial_bal + credits - debits\n    }\n\nrep = generate_report(1000.0, 500.0, 200.0)\nprint('Final Balance in Report:', rep['final_balance'])",
            "expectedOutput": "Final Balance in Report: 1300.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is final_balance for initial 1000 + 500 credits - 200 debits?",
          "expectedStringOutput": "Final Balance in Report: 1300.0",
          "acceptableAnswers": [
            "Final Balance in Report: 1300.0",
            "1300.0",
            "1300"
          ],
          "primaryMisconceptionId": "MC_PY_CAPSTONE_TRANSACTION_RECONCILER",
          "diagnosisMap": {
            "1500": {
              "misconceptionId": "MC_PY_CAPSTONE_TRANSACTION_RECONCILER",
              "errorExplanation": "1000 + 500 - 200 = 1300.0.",
              "recoveryPath": {
                "simplerExplanation": "1000 + 500 - 200 = 1300.0.",
                "guidedFixPrompt": "Type Final Balance in Report: 1300.0"
              }
            }
          }
        }
      },
      {
        "id": "py-d30-b4-category-filtering",
        "day": 30,
        "blockNumber": 4,
        "title": "Category Breakdown & Anomaly Detection",
        "conceptBudget": {
          "primaryConcept": "Category Breakdown",
          "supportingTerms": [
            "Threshold Filter",
            "Anomaly Tagging"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "py-d30-b3-audit-report-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "anomaly.py",
            "initialCode": "txs = [('TECH', 5000), ('FOOD', 25), ('TECH', 120)]\nlarge_txs = [t for t in txs if t[1] >= 1000]\nprint('Anomalous High-Value Transactions:', large_txs)",
            "expectedOutput": "Anomalous High-Value Transactions: [('TECH', 5000)]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which single transaction is filtered as >= 1000 in the code above?",
          "expectedStringOutput": "Anomalous High-Value Transactions: [('TECH', 5000)]",
          "acceptableAnswers": [
            "Anomalous High-Value Transactions: [('TECH', 5000)]",
            "[('TECH', 5000)]",
            "('TECH', 5000)"
          ],
          "primaryMisconceptionId": "MC_PY_CAPSTONE_TRANSACTION_RECONCILER",
          "diagnosisMap": {
            "None": {
              "misconceptionId": "MC_PY_CAPSTONE_TRANSACTION_RECONCILER",
              "errorExplanation": "Only ('TECH', 5000) is >= 1000.",
              "recoveryPath": {
                "simplerExplanation": "5000 >= 1000 matches.",
                "guidedFixPrompt": "Type Anomalous High-Value Transactions: [('TECH', 5000)]"
              }
            }
          }
        }
      }
    ]
  }
];
