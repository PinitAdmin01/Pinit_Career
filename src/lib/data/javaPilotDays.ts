import { DayLessonPlan } from '../types/lessonEngine';

export const JAVA_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "What is a Program? — Writing Your First Java Instructions",
    "overviewMetaphor": "A computer program is like a cooking recipe card: it gives the computer a step-by-step list of instructions to follow in exact order.",
    "blocks": [
      {
        "id": "java-d1-b1-instructions",
        "day": 1,
        "blockNumber": 1,
        "title": "What is an Instruction?",
        "conceptBudget": {
          "primaryConcept": "Instruction",
          "supportingTerms": [
            "Step",
            "Order"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Recipe Card",
            "simpleExplanation": "Computers are very fast, but they do not know what to do on their own. An instruction is a single step that tells the computer exactly what action to take."
          },
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Sequential Execution Order",
              "nodes": [
                {
                  "id": "1",
                  "label": "Step 1: Boil water",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Step 2: Add tea leaves",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Step 3: Pour into cup",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "Recipe.java",
            "initialCode": "public class Recipe {\n    public static void main(String[] args) {\n        System.out.println(\"Step 1: Boil water\");\n        System.out.println(\"Step 2: Add tea leaves\");\n        System.out.println(\"Step 3: Pour into cup\");\n    }\n}",
            "expectedOutput": "Step 1: Boil water\nStep 2: Add tea leaves\nStep 3: Pour into cup",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "If a computer follows instructions strictly from top to bottom, which step runs first?",
          "expectedStringOutput": "Step 1",
          "acceptableAnswers": [
            "step 1",
            "1",
            "first step"
          ],
          "primaryMisconceptionId": "MC_JAVA_EXECUTION_ORDER",
          "diagnosisMap": {
            "wrong_order": {
              "misconceptionId": "MC_JAVA_EXECUTION_ORDER",
              "errorExplanation": "Computers always execute instructions in sequential order from top to bottom without skipping.",
              "recoveryPath": {
                "simplerExplanation": "Think of reading a book: you read line 1 before line 2.",
                "guidedFixPrompt": "Identify the very first line at the top."
              }
            }
          }
        }
      },
      {
        "id": "java-d1-b2-println",
        "day": 1,
        "blockNumber": 2,
        "title": "Your First Print Statement",
        "conceptBudget": {
          "primaryConcept": "System.out.println",
          "supportingTerms": [
            "Screen",
            "Text"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d1-b1-instructions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Writing on a Chalkboard",
            "simpleExplanation": "In Java, when you want the computer to display words on the screen, you use System.out.println(\"Your text here\");."
          },
          {
            "type": "syntax_anatomy",
            "codeSnippet": "System.out.println(\"Hello, World!\");",
            "lineNotes": {
              "1": "System.out.println tells Java to print text on a new line. Quotes hold the exact message."
            }
          },
          {
            "type": "runnable_code",
            "filename": "Hello.java",
            "initialCode": "public class Hello {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
            "expectedOutput": "Hello, World!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What will this command display on screen: System.out.println(\"Welcome!\");",
          "expectedStringOutput": "Welcome!",
          "acceptableAnswers": [
            "welcome!",
            "Welcome!"
          ],
          "primaryMisconceptionId": "MC_JAVA_CASE_SENSITIVITY",
          "diagnosisMap": {
            "system_error": {
              "misconceptionId": "MC_JAVA_CASE_SENSITIVITY",
              "errorExplanation": "System.out.println prints whatever exact text is written inside the double quotation marks.",
              "recoveryPath": {
                "simplerExplanation": "Look inside the quotes: whatever text is inside is printed to the screen.",
                "guidedFixPrompt": "Type the exact word inside the quotes: Welcome!"
              }
            }
          }
        }
      },
      {
        "id": "java-d1-b3-changing-messages",
        "day": 1,
        "blockNumber": 3,
        "title": "Changing What Gets Printed",
        "conceptBudget": {
          "primaryConcept": "Custom Message",
          "supportingTerms": [
            "Quotes",
            "Output"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d1-b2-println",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Customizing a Greeting Card",
            "simpleExplanation": "You can change the message to say anything you want by replacing the text inside the double quotation marks."
          },
          {
            "type": "runnable_code",
            "filename": "MyGreeting.java",
            "initialCode": "public class MyGreeting {\n    public static void main(String[] args) {\n        System.out.println(\"My name is Java!\");\n    }\n}",
            "expectedOutput": "My name is Java!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is printed by: System.out.println(\"Good morning!\");",
          "expectedStringOutput": "Good morning!",
          "acceptableAnswers": [
            "good morning!",
            "Good morning!"
          ],
          "primaryMisconceptionId": "MC_JAVA_QUOTES_ON_NUMBERS",
          "diagnosisMap": {
            "wrong_text": {
              "misconceptionId": "MC_JAVA_QUOTES_ON_NUMBERS",
              "errorExplanation": "The computer prints the exact characters placed inside the double quotation marks.",
              "recoveryPath": {
                "simplerExplanation": "The words inside quotes are delivered directly to the terminal output.",
                "guidedFixPrompt": "Write: Good morning!"
              }
            }
          }
        }
      },
      {
        "id": "java-d1-b4-semicolon",
        "day": 1,
        "blockNumber": 4,
        "title": "The Semicolon Rule",
        "conceptBudget": {
          "primaryConcept": "Semicolon Delimiter",
          "supportingTerms": [
            "Statement",
            "Period"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d1-b3-changing-messages",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Full Stop at End of a Sentence",
            "simpleExplanation": "Just like every sentence in English ends with a period (.), every complete instruction in Java MUST end with a semicolon (;)."
          },
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Missing Semicolon Fix",
              "brokenCode": "System.out.println(\"Hello\") // ❌ Error: missing semicolon",
              "fixedCode": "System.out.println(\"Hello\"); // ✅ Correct!",
              "errorReason": "Java does not know where the instruction ends without a semicolon.",
              "fixExplanation": "Add a semicolon ; at the very end of the line."
            }
          },
          {
            "type": "runnable_code",
            "filename": "SemicolonDemo.java",
            "initialCode": "public class SemicolonDemo {\n    public static void main(String[] args) {\n        System.out.println(\"Sentence 1 ends with semicolon;\");\n        System.out.println(\"Sentence 2 ends with semicolon;\");\n    }\n}",
            "expectedOutput": "Sentence 1 ends with semicolon;\nSentence 2 ends with semicolon;",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "fix_line",
          "question": "Fix the missing semicolon in this command: System.out.println(\"Done\")",
          "expectedStringOutput": "System.out.println(\"Done\");",
          "acceptableAnswers": [
            "System.out.println(\"Done\");",
            "System.out.println(\"Done\"); "
          ],
          "primaryMisconceptionId": "MC_JAVA_MISSING_SEMICOLON",
          "diagnosisMap": {
            "missing_semicolon": {
              "misconceptionId": "MC_JAVA_MISSING_SEMICOLON",
              "errorExplanation": "Every statement must terminate with a semicolon ; in Java.",
              "recoveryPath": {
                "simplerExplanation": "Put a ; at the very end of the instruction.",
                "guidedFixPrompt": "Add ; to the end of the line."
              }
            }
          }
        }
      },
      {
        "id": "java-d1-b5-container",
        "day": 1,
        "blockNumber": 5,
        "title": "The Program Container (Class & Main)",
        "conceptBudget": {
          "primaryConcept": "Java Program Container",
          "supportingTerms": [
            "Class",
            "Main Entry Point"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d1-b4-semicolon",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Labeled Folder with a Front Door",
            "simpleExplanation": "Java requires all code to live inside a labeled folder (class) with a front door (main). For now, memorize this outer shell as Java standard starting structure."
          },
          {
            "type": "syntax_anatomy",
            "codeSnippet": "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Ready!\");\n    }\n}",
            "lineNotes": {
              "1": "public class HelloWorld creates the outer container.",
              "2": "public static void main(String[] args) is the starting front door where Java starts running.",
              "3": "Your actual instructions go inside the main door."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ProgramShell.java",
            "initialCode": "public class ProgramShell {\n    public static void main(String[] args) {\n        System.out.println(\"Program container active!\");\n    }\n}",
            "expectedOutput": "Program container active!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Where do your starting instructions go in a basic Java program?",
          "options": [
            "Inside the main method: public static void main(String[] args) { ... }",
            "Above the public class line",
            "Outside all curly braces"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_CODE_OUTSIDE_CLASS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_CODE_OUTSIDE_CLASS",
              "errorExplanation": "Instructions must be inside the main method body.",
              "recoveryPath": {
                "simplerExplanation": "Java starts reading inside the main { } block.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 1 Capstone Exam: Print 3 Lines",
      "instruction": "Write a Java program that prints exactly 3 lines: \"Step 1\", \"Step 2\", \"Step 3\".",
      "scaffoldLevel": 1,
      "starterJavaCode": "public class Solution {\n    public static void main(String[] args) {\n        // Print Step 1, Step 2, Step 3 on 3 separate lines:\n        System.out.println(\"Step 1\");\n        \n    }\n}",
      "publicTestCases": [
        {
          "description": "Prints 3 lines",
          "expected": "Step 1\nStep 2\nStep 3"
        }
      ]
    }
  },
  {
    "day": 2,
    "title": "Interactive Programs — Reading User Input with Scanner",
    "overviewMetaphor": "Scanner is like a microphone for your program: it listens to what the user types on the keyboard and hands the words to your code.",
    "blocks": [
      {
        "id": "java-d2-b1-scanner-intro",
        "day": 2,
        "blockNumber": 1,
        "title": "What is User Input?",
        "conceptBudget": {
          "primaryConcept": "User Input",
          "supportingTerms": [
            "Keyboard",
            "Interactive"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d1-b5-container",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Ordering Window at a Fast Food Drive-Through",
            "simpleExplanation": "Instead of printing the same fixed text every time, interactive programs pause and wait for the user to type their name or age."
          },
          {
            "type": "runnable_code",
            "filename": "InputDemo.java",
            "initialCode": "public class InputDemo {\n    public static void main(String[] args) {\n        String simulatedInput = \"Alex\";\n        System.out.println(\"Welcome, \" + simulatedInput + \"!\");\n    }\n}",
            "expectedOutput": "Welcome, Alex!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do programs need user input?",
          "options": [
            "To make programs interactive and respond to dynamic user information",
            "To make the computer screen turn on",
            "To delete old files from the hard drive"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_INPUT_MISMATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_INPUT_MISMATCH",
              "errorExplanation": "User input allows software to handle different data dynamically.",
              "recoveryPath": {
                "simplerExplanation": "Input lets the user talk to the program.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d2-b2-import-scanner",
        "day": 2,
        "blockNumber": 2,
        "title": "Importing & Creating Scanner",
        "conceptBudget": {
          "primaryConcept": "Scanner Initialization",
          "supportingTerms": [
            "import java.util.Scanner",
            "System.in"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d2-b1-scanner-intro",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "import java.util.Scanner;\n\nScanner sc = new Scanner(System.in);",
            "lineNotes": {
              "1": "import java.util.Scanner tells Java to bring in the Scanner tool from its standard toolbox.",
              "3": "new Scanner(System.in) connects the Scanner to the keyboard."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ScannerSetup.java",
            "initialCode": "import java.util.Scanner;\n\npublic class ScannerSetup {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(\"42\");\n        int val = sc.nextInt();\n        System.out.println(\"Scanner read integer: \" + val);\n    }\n}",
            "expectedOutput": "Scanner read integer: 42",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Where must import java.util.Scanner; be placed in your Java file?",
          "options": [
            "At the very top of the file, before public class",
            "Inside the main method",
            "At the very bottom after the last brace"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_FORGOT_SCANNER_IMPORT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_FORGOT_SCANNER_IMPORT",
              "errorExplanation": "Imports must be at the top level of the file before any class declaration.",
              "recoveryPath": {
                "simplerExplanation": "Put all imports at line 1 before the class.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d2-b3-nextline",
        "day": 2,
        "blockNumber": 3,
        "title": "Reading Text with nextLine()",
        "conceptBudget": {
          "primaryConcept": "sc.nextLine()",
          "supportingTerms": [
            "String Input",
            "Line Reader"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d2-b2-import-scanner",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "GreetingApp.java",
            "initialCode": "import java.util.Scanner;\n\npublic class GreetingApp {\n    public static void main(String[] args) {\n        // Simulated reading from input stream\n        String name = \"Vinay\";\n        System.out.println(\"Hello, \" + name + \"!\");\n    }\n}",
            "expectedOutput": "Hello, Vinay!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which Scanner method reads an entire line of text as a String?",
          "options": [
            "sc.nextLine()",
            "sc.nextInt()",
            "sc.nextDouble()"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_INPUT_MISMATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_INPUT_MISMATCH",
              "errorExplanation": "sc.nextLine() reads text lines, while sc.nextInt() reads whole numbers.",
              "recoveryPath": {
                "simplerExplanation": "nextLine reads text lines. nextInt reads integers.",
                "guidedFixPrompt": "Select sc.nextLine()."
              }
            }
          }
        }
      },
      {
        "id": "java-d2-b4-nextint-newline-trap",
        "day": 2,
        "blockNumber": 4,
        "title": "The Newline Trap (nextInt followed by nextLine)",
        "conceptBudget": {
          "primaryConcept": "Scanner Newline Mechanics",
          "supportingTerms": [
            "Buffer Remainder",
            "sc.nextLine() Clearing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d2-b3-nextline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Leftover Enter Key",
            "simpleExplanation": "When you type 22 and press ENTER, nextInt() reads only the 22. The ENTER key character (\\n) stays behind on the line. If you call nextLine() right after, it instantly reads that leftover ENTER and thinks the user typed an empty string!"
          },
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Scanner Buffer Fix",
              "brokenCode": "int age = sc.nextInt();\nString name = sc.nextLine(); // ❌ Skips! Reads leftover newline",
              "fixedCode": "int age = sc.nextInt();\nsc.nextLine(); // ✅ Consumes leftover newline\nString name = sc.nextLine(); // ✅ Reads real name",
              "errorReason": "nextInt() does not consume the trailing newline character.",
              "fixExplanation": "Call sc.nextLine() once immediately after nextInt() to clear the leftover newline."
            }
          },
          {
            "type": "runnable_code",
            "filename": "BufferFixDemo.java",
            "initialCode": "import java.util.Scanner;\n\npublic class BufferFixDemo {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(\"25\\nSarah Connor\");\n        int age = sc.nextInt();\n        sc.nextLine(); // Discard newline\n        String name = sc.nextLine();\n        System.out.println(\"User: \" + name + \" (Age \" + age + \")\");\n    }\n}",
            "expectedOutput": "User: Sarah Connor (Age 25)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does nextLine() appear to get skipped when called immediately after nextInt()?",
          "options": [
            "Because nextInt() reads the number but leaves the ENTER newline in the buffer, which nextLine() immediately reads",
            "Because Java runs out of memory",
            "Because Scanner only works once per program"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_SCANNER_BUFFER_SKIP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_SCANNER_BUFFER_SKIP",
              "errorExplanation": "nextInt() leaves the newline character in the stream buffer.",
              "recoveryPath": {
                "simplerExplanation": "The leftover ENTER key is consumed by nextLine. Add sc.nextLine() to discard it.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 2 Capstone Exam: Reading Name & Age",
      "instruction": "Write a Java program that reads an integer age, clears the newline, reads a String name, and prints \"Name: [name] | Age: [age]\".",
      "scaffoldLevel": 2,
      "starterJavaCode": "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        sc.nextLine(); // Clear buffer\n        String name = sc.nextLine();\n        System.out.println(\"Name: \" + name + \" | Age: \" + age);\n    }\n}",
      "publicTestCases": [
        {
          "description": "Reads 22 and Vinay Kumar",
          "input": "22\nVinay Kumar\n",
          "expected": "Name: Vinay Kumar | Age: 22"
        }
      ]
    }
  },
  {
    "day": 3,
    "title": "Variables & Data Types — Storing Information in Memory",
    "overviewMetaphor": "A variable is like a labeled storage box in memory that holds a specific type of information.",
    "blocks": [
      {
        "id": "java-d3-b1-int",
        "day": 3,
        "blockNumber": 1,
        "title": "Whole Numbers (int)",
        "conceptBudget": {
          "primaryConcept": "int Type",
          "supportingTerms": [
            "Variable",
            "Whole Number"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d1-b5-container",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Labeled Storage Box for Counters",
            "simpleExplanation": "In Java, an int is a box that holds whole numbers like 1, 10, or 250 (no decimals)."
          },
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "boxes": [
                {
                  "label": "score",
                  "varType": "int",
                  "value": "100",
                  "highlightNote": "32-bit integer"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "Score.java",
            "initialCode": "public class Score {\n    public static void main(String[] args) {\n        int score = 100;\n        System.out.println(\"Score: \" + score);\n    }\n}",
            "expectedOutput": "Score: 100",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "trace_value",
          "question": "If you write int score = 50; score = 75; what is the final value of score?",
          "expectedStringOutput": "75",
          "acceptableAnswers": [
            "75",
            "seventy five"
          ],
          "primaryMisconceptionId": "MC_JAVA_VARIABLE_REASSIGNMENT",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_JAVA_VARIABLE_REASSIGNMENT",
              "errorExplanation": "Assigning a new value overwrites whatever was in the box previously.",
              "recoveryPath": {
                "simplerExplanation": "When you put 75 in the box, the old 50 is replaced.",
                "guidedFixPrompt": "The final value is 75."
              }
            }
          }
        }
      },
      {
        "id": "java-d3-b2-double",
        "day": 3,
        "blockNumber": 2,
        "title": "Decimal Numbers (double)",
        "conceptBudget": {
          "primaryConcept": "double Type",
          "supportingTerms": [
            "Decimals",
            "Precision"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d3-b1-int",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Price Tag Box",
            "simpleExplanation": "When you need numbers with fractional cents or decimals (like 9.99), use double."
          },
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "boxes": [
                {
                  "label": "price",
                  "varType": "double",
                  "value": "19.99",
                  "highlightNote": "64-bit floating point"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "DoubleDemo.java",
            "initialCode": "public class DoubleDemo {\n    public static void main(String[] args) {\n        double price = 19.99;\n        double tax = 1.50;\n        System.out.println(\"Total: $\" + (price + tax));\n    }\n}",
            "expectedOutput": "Total: $21.49",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which variable type is best for storing a product price like $4.50?",
          "options": [
            "double price = 4.50;",
            "int price = 4.50;",
            "boolean price = 4.50;"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_WRONG_DATA_TYPE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_WRONG_DATA_TYPE",
              "errorExplanation": "int cannot hold decimal places; double is required for decimals.",
              "recoveryPath": {
                "simplerExplanation": "Decimals require double.",
                "guidedFixPrompt": "Select double price = 4.50;."
              }
            }
          }
        }
      },
      {
        "id": "java-d3-b3-boolean",
        "day": 3,
        "blockNumber": 3,
        "title": "True/False Flags (boolean)",
        "conceptBudget": {
          "primaryConcept": "boolean Type",
          "supportingTerms": [
            "true",
            "false",
            "Condition Flag"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d3-b1-int",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Light Switch",
            "simpleExplanation": "A boolean holds only two possible values: true (ON) or false (OFF)."
          },
          {
            "type": "runnable_code",
            "filename": "FlagDemo.java",
            "initialCode": "public class FlagDemo {\n    public static void main(String[] args) {\n        boolean isPass = true;\n        System.out.println(\"Passed: \" + isPass);\n    }\n}",
            "expectedOutput": "Passed: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which of the following is a valid boolean value in Java?",
          "options": [
            "true (lowercase without quotes)",
            "\"true\" (in double quotes)",
            "YES"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_BOOLEAN_QUOTES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_BOOLEAN_QUOTES",
              "errorExplanation": "boolean values true and false must not be surrounded by quotes.",
              "recoveryPath": {
                "simplerExplanation": "Quotes make it text (String), not a boolean flag.",
                "guidedFixPrompt": "Select true without quotes."
              }
            }
          }
        }
      },
      {
        "id": "java-d3-b4-string",
        "day": 3,
        "blockNumber": 4,
        "title": "Text Sequences (String)",
        "conceptBudget": {
          "primaryConcept": "String Type",
          "supportingTerms": [
            "Text Sequence",
            "Double Quotes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d3-b1-int",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "A Bead Necklace of Characters",
            "simpleExplanation": "A String stores a sequence of characters chained together inside double quotes."
          },
          {
            "type": "syntax_anatomy",
            "codeSnippet": "String city = \"New York\";",
            "lineNotes": {
              "1": "String begins with a capital S because it is a reference object type in Java."
            }
          },
          {
            "type": "runnable_code",
            "filename": "StringDemo.java",
            "initialCode": "public class StringDemo {\n    public static void main(String[] args) {\n        String greeting = \"Hello\";\n        String user = \"Student\";\n        System.out.println(greeting + \", \" + user + \"!\");\n    }\n}",
            "expectedOutput": "Hello, Student!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does String start with an uppercase S while int starts with lowercase i?",
          "options": [
            "String is a class type in Java, whereas int is a primitive type",
            "It is a spelling error in Java",
            "Uppercase means it is private"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_CASING_SYSTEM",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_CASING_SYSTEM",
              "errorExplanation": "In Java, standard reference class types start with uppercase (String), while primitives start lowercase (int, double, boolean).",
              "recoveryPath": {
                "simplerExplanation": "String is a Class object, int is a primitive number.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 3 Capstone Exam: Variable Inventory",
      "instruction": "Declare an int id = 101, double price = 9.99, and boolean inStock = true. Print them on 3 lines.",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static void main(String[] args) {\n        // Declare variables and print them:\n        int id = 101;\n        double price = 9.99;\n        boolean inStock = true;\n        System.out.println(\"ID: \" + id);\n        System.out.println(\"Price: \" + price);\n        System.out.println(\"InStock: \" + inStock);\n    }\n}",
      "publicTestCases": [
        {
          "description": "Prints ID, Price, InStock",
          "expected": "ID: 101\nPrice: 9.99\nInStock: true"
        }
      ]
    }
  },
  {
    "day": 4,
    "title": "Math Operators & Expressions — Performing Calculations in Java",
    "overviewMetaphor": "Math operators in Java are like a pocket calculator: they perform arithmetic (+, -, *, /, %) on numbers.",
    "blocks": [
      {
        "id": "java-d4-b1-add-sub",
        "day": 4,
        "blockNumber": 1,
        "title": "Addition & Subtraction (+ and -)",
        "conceptBudget": {
          "primaryConcept": "Addition & Subtraction",
          "supportingTerms": [
            "Operand",
            "Result"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d3-b1-int",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "AddSub.java",
            "initialCode": "public class AddSub {\n    public static void main(String[] args) {\n        int sum = 10 + 5;\n        int diff = 10 - 3;\n        System.out.println(\"Sum: \" + sum + \", Diff: \" + diff);\n    }\n}",
            "expectedOutput": "Sum: 15, Diff: 7",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What will int total = 20 + 30; System.out.println(total); display?",
          "expectedStringOutput": "50",
          "acceptableAnswers": [
            "50",
            "fifty"
          ],
          "primaryMisconceptionId": "MC_JAVA_OPERATOR_PRECEDENCE",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_OPERATOR_PRECEDENCE",
              "errorExplanation": "20 + 30 evaluates to 50.",
              "recoveryPath": {
                "simplerExplanation": "Add the two numbers together.",
                "guidedFixPrompt": "Type 50."
              }
            }
          }
        }
      },
      {
        "id": "java-d4-b2-mult-div",
        "day": 4,
        "blockNumber": 2,
        "title": "Multiplication & Integer Division (* and /)",
        "conceptBudget": {
          "primaryConcept": "Integer Division Truncation",
          "supportingTerms": [
            "Integer Division",
            "Truncation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d4-b1-add-sub",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Chopping off the Decimal Tail",
            "simpleExplanation": "When dividing two integers in Java (like 7 / 2), Java drops the decimal remainder completely and gives you 3 (not 3.5)."
          },
          {
            "type": "runnable_code",
            "filename": "DivisionDemo.java",
            "initialCode": "public class DivisionDemo {\n    public static void main(String[] args) {\n        int intDiv = 7 / 2; // drops .5\n        double decDiv = 7.0 / 2.0; // preserves .5\n        System.out.println(\"Integer div: \" + intDiv);\n        System.out.println(\"Decimal div: \" + decDiv);\n    }\n}",
            "expectedOutput": "Integer div: 3\nDecimal div: 3.5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In Java, what does the expression 9 / 2 evaluate to?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "four"
          ],
          "primaryMisconceptionId": "MC_JAVA_INTEGER_TRUNCATION",
          "diagnosisMap": {
            "4.5": {
              "misconceptionId": "MC_JAVA_INTEGER_TRUNCATION",
              "errorExplanation": "Integer division chops off the decimal portion.",
              "recoveryPath": {
                "simplerExplanation": "Both 9 and 2 are integers, so 9 / 2 produces 4.",
                "guidedFixPrompt": "Enter 4."
              }
            }
          }
        }
      },
      {
        "id": "java-d4-b3-modulo",
        "day": 4,
        "blockNumber": 3,
        "title": "The Modulo Remainder Operator (%)",
        "conceptBudget": {
          "primaryConcept": "Modulo Operator",
          "supportingTerms": [
            "Remainder",
            "Even/Odd Check"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d4-b2-mult-div",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Leftover Slices of Pizza",
            "simpleExplanation": "If you have 10 slices of pizza and 3 people each take 3 slices, 1 slice is left over in the box. 10 % 3 = 1."
          },
          {
            "type": "runnable_code",
            "filename": "ModuloDemo.java",
            "initialCode": "public class ModuloDemo {\n    public static void main(String[] args) {\n        int remainder = 10 % 3;\n        System.out.println(\"10 % 3 = \" + remainder);\n    }\n}",
            "expectedOutput": "10 % 3 = 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is 14 % 5 in Java?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "four"
          ],
          "primaryMisconceptionId": "MC_JAVA_MODULO_REMAINDER",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_JAVA_MODULO_REMAINDER",
              "errorExplanation": "14 divided by 5 is 2 with a remainder of 4. % calculates the remainder (4).",
              "recoveryPath": {
                "simplerExplanation": "5 goes into 14 twice (10), leaving 4 leftover.",
                "guidedFixPrompt": "Type 4."
              }
            }
          }
        }
      },
      {
        "id": "java-d4-b4-precedence",
        "day": 4,
        "blockNumber": 4,
        "title": "Operator Precedence (Order of Operations)",
        "conceptBudget": {
          "primaryConcept": "Math Precedence",
          "supportingTerms": [
            "PEMDAS",
            "Parentheses Priority"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d4-b3-modulo",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "VIP Priority Line",
            "simpleExplanation": "Multiplication (*) and Division (/) have VIP priority over Addition (+) and Subtraction (-). Always use (parentheses) to force addition first."
          },
          {
            "type": "runnable_code",
            "filename": "PrecedenceDemo.java",
            "initialCode": "public class PrecedenceDemo {\n    public static void main(String[] args) {\n        int res1 = 2 + 3 * 4;     // 2 + 12 = 14\n        int res2 = (2 + 3) * 4;   // 5 * 4 = 20\n        System.out.println(\"res1: \" + res1 + \", res2: \" + res2);\n    }\n}",
            "expectedOutput": "res1: 14, res2: 20",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the result of 10 - 2 * 3 in Java?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "four"
          ],
          "primaryMisconceptionId": "MC_JAVA_OPERATOR_PRECEDENCE",
          "diagnosisMap": {
            "24": {
              "misconceptionId": "MC_JAVA_OPERATOR_PRECEDENCE",
              "errorExplanation": "Multiplication runs before subtraction: 2 * 3 = 6, then 10 - 6 = 4.",
              "recoveryPath": {
                "simplerExplanation": "Do 2 * 3 first (6), then 10 - 6.",
                "guidedFixPrompt": "Type 4."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 4 Capstone Exam: Modulo & Math Expressions",
      "instruction": "Write a program calculating remainder of 17 % 5 and sum of 10 + 25. Print results.",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static void main(String[] args) {\n        int rem = 17 % 5;\n        int sum = 10 + 25;\n        System.out.println(\"Remainder: \" + rem);\n        System.out.println(\"Sum: \" + sum);\n    }\n}",
      "publicTestCases": [
        {
          "description": "Remainder 2 and Sum 35",
          "expected": "Remainder: 2\nSum: 35"
        }
      ]
    }
  },
  {
    "day": 5,
    "title": "Conditionals & ⭐ MILESTONE 1: Interactive Decision Console",
    "overviewMetaphor": "Milestone 1 — Interactive Decision Console: Conditionals are like railway switch tracks that guide trains onto different paths based on track signals.",
    "blocks": [
      {
        "id": "java-d5-b1-if-basic",
        "day": 5,
        "blockNumber": 1,
        "title": "Making a Decision (if Statement)",
        "conceptBudget": {
          "primaryConcept": "if Statement",
          "supportingTerms": [
            "Condition",
            "Branch"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d3-b3-boolean",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Toll Booth Gate",
            "simpleExplanation": "If you pay the toll (condition is true), the gate opens and you drive through. If not, the gate stays closed."
          },
          {
            "type": "runnable_code",
            "filename": "TollGate.java",
            "initialCode": "public class TollGate {\n    public static void main(String[] args) {\n        int balance = 50;\n        if (balance >= 20) {\n            System.out.println(\"Gate Open!\");\n        }\n    }\n}",
            "expectedOutput": "Gate Open!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "When does the code inside an if (condition) { ... } block execute?",
          "options": [
            "Only when the condition inside parentheses evaluates to true",
            "Every time the program runs regardless of the condition",
            "Only when the computer reboots"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_IF_CONDITION_EXECUTION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_IF_CONDITION_EXECUTION",
              "errorExplanation": "if blocks execute only when the boolean condition evaluates to true.",
              "recoveryPath": {
                "simplerExplanation": "if true -> execute. if false -> skip.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d5-b2-else-branch",
        "day": 5,
        "blockNumber": 2,
        "title": "The Fallback Path (else Statement)",
        "conceptBudget": {
          "primaryConcept": "else Branch",
          "supportingTerms": [
            "Alternative Path",
            "Exclusivity"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d5-b1-if-basic",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "If-Else Decision Path",
              "nodes": [
                {
                  "id": "1",
                  "label": "Condition Check: score >= 50",
                  "kind": "decision"
                },
                {
                  "id": "2",
                  "label": "True: Print \"Pass!\"",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "False: Print \"Try Again!\"",
                  "kind": "process"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "PassFail.java",
            "initialCode": "public class PassFail {\n    public static void main(String[] args) {\n        int score = 45;\n        if (score >= 50) {\n            System.out.println(\"Status: Pass\");\n        } else {\n            System.out.println(\"Status: Retry\");\n        }\n    }\n}",
            "expectedOutput": "Status: Retry",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In int score = 40; if (score >= 50) System.out.println(\"Pass\"); else System.out.println(\"Retry\"); what is printed?",
          "expectedStringOutput": "Retry",
          "acceptableAnswers": [
            "retry",
            "Retry"
          ],
          "primaryMisconceptionId": "MC_JAVA_ELSE_BRANCH_LOGIC",
          "diagnosisMap": {
            "pass": {
              "misconceptionId": "MC_JAVA_ELSE_BRANCH_LOGIC",
              "errorExplanation": "40 is not >= 50, so execution falls into the else branch.",
              "recoveryPath": {
                "simplerExplanation": "40 < 50 is false, so else runs.",
                "guidedFixPrompt": "Write Retry."
              }
            }
          }
        }
      },
      {
        "id": "java-d5-b3-elseif-ladder",
        "day": 5,
        "blockNumber": 3,
        "title": "Multi-Way Decisions (else-if Ladders)",
        "conceptBudget": {
          "primaryConcept": "else-if Ladder",
          "supportingTerms": [
            "Multi-Way Branch",
            "Sequential Evaluation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d5-b2-else-branch",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Sizing Sieve",
            "simpleExplanation": "Check size in order: if score >= 90 (Grade A), else if score >= 80 (Grade B), else (Grade C). As soon as one branch matches, Java skips all remaining branches."
          },
          {
            "type": "runnable_code",
            "filename": "GradeLadder.java",
            "initialCode": "public class GradeLadder {\n    public static void main(String[] args) {\n        int score = 85;\n        if (score >= 90) System.out.println(\"Grade: A\");\n        else if (score >= 80) System.out.println(\"Grade: B\");\n        else System.out.println(\"Grade: C\");\n    }\n}",
            "expectedOutput": "Grade: B",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "With score = 85 in the GradeLadder above, what is output?",
          "expectedStringOutput": "Grade: B",
          "acceptableAnswers": [
            "Grade: B",
            "grade: b",
            "B"
          ],
          "primaryMisconceptionId": "MC_JAVA_ASSIGNMENT_IN_CONDITION",
          "diagnosisMap": {
            "Grade: A": {
              "misconceptionId": "MC_JAVA_ASSIGNMENT_IN_CONDITION",
              "errorExplanation": "85 is not >= 90, so the first condition is false; it falls to score >= 80 (Grade B).",
              "recoveryPath": {
                "simplerExplanation": "85 is less than 90, so it matches Grade B.",
                "guidedFixPrompt": "Write Grade: B."
              }
            }
          }
        }
      },
      {
        "id": "java-d5-b4-milestone-1",
        "day": 5,
        "blockNumber": 4,
        "title": "⭐ MILESTONE 1: Interactive Decision Console",
        "conceptBudget": {
          "primaryConcept": "Decision Engine",
          "supportingTerms": [
            "Validation Guard",
            "Console Menu"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d5-b3-elseif-ladder",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "DecisionConsole.java",
            "initialCode": "public class DecisionConsole {\n    public static String evaluateAdmission(int score, boolean hasPrereq) {\n        if (score >= 80 && hasPrereq) return \"Direct Admit\";\n        else if (score >= 60) return \"Interview Required\";\n        else return \"Application Rejected\";\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Result: \" + evaluateAdmission(85, true));\n    }\n}",
            "expectedOutput": "Result: Direct Admit",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In Milestone 1, what does evaluateAdmission(85, false) return?",
          "options": [
            "\"Interview Required\" (Score >= 60 even though prereq is false)",
            "\"Direct Admit\"",
            "\"Application Rejected\""
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_LOGICAL_AND_SHORT_CIRCUIT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_LOGICAL_AND_SHORT_CIRCUIT",
              "errorExplanation": "hasPrereq is false, so && fails on direct admit; it falls to else if score >= 60.",
              "recoveryPath": {
                "simplerExplanation": "&& requires both to be true. Since prereq is false, it matches the second branch.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 5 Milestone 1 Challenge: Decision Console",
      "instruction": "Write a program checking if score >= 70 print \"Qualified\", else print \"Review Required\".",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static void main(String[] args) {\n        int score = 85;\n        if (score >= 70) {\n            System.out.println(\"Qualified\");\n        } else {\n            System.out.println(\"Review Required\");\n        }\n    }\n}",
      "publicTestCases": [
        {
          "description": "Score 85 qualifies",
          "expected": "Qualified"
        }
      ]
    }
  },
  {
    "day": 6,
    "title": "Switch Statements & Default Guards",
    "overviewMetaphor": "A switch statement is like an elevator panel: you press floor 3 (case 3), and the elevator jumps directly to floor 3 without stopping at floors 1 and 2.",
    "blocks": [
      {
        "id": "java-d6-b1-switch-syntax",
        "day": 6,
        "blockNumber": 1,
        "title": "The Switch & Case Structure",
        "conceptBudget": {
          "primaryConcept": "switch and case",
          "supportingTerms": [
            "Direct Jump",
            "break Keyword"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d5-b2-else-branch",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "Elevator.java",
            "initialCode": "public class Elevator {\n    public static void main(String[] args) {\n        int floor = 2;\n        switch (floor) {\n            case 1:\n                System.out.println(\"Lobby\");\n                break;\n            case 2:\n                System.out.println(\"Offices\");\n                break;\n            default:\n                System.out.println(\"Roof\");\n        }\n    }\n}",
            "expectedOutput": "Offices",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if you omit the break statement after a matching case in a switch block?",
          "options": [
            "Execution falls through and runs subsequent cases until a break or switch end is reached",
            "The compiler throws an unrecoverable syntax error",
            "The computer skips the rest of the file"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_MISSING_BREAK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_MISSING_BREAK",
              "errorExplanation": "Without a break statement, Java continues executing the next case (fallthrough).",
              "recoveryPath": {
                "simplerExplanation": "break stops fallthrough to other cases.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d6-b2-default-guard",
        "day": 6,
        "blockNumber": 2,
        "title": "The Default Fallback Guard",
        "conceptBudget": {
          "primaryConcept": "default Guard",
          "supportingTerms": [
            "Catch-All",
            "Unlisted Option"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d6-b1-switch-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The General Inquiries Desk",
            "simpleExplanation": "If none of the specific case numbers match the input, the default branch catches the execution."
          },
          {
            "type": "runnable_code",
            "filename": "DefaultGuardDemo.java",
            "initialCode": "public class DefaultGuardDemo {\n    public static void main(String[] args) {\n        int option = 99;\n        switch (option) {\n            case 1: System.out.println(\"Profile\"); break;\n            case 2: System.out.println(\"Settings\"); break;\n            default: System.out.println(\"Unknown Menu Option\");\n        }\n    }\n}",
            "expectedOutput": "Unknown Menu Option",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which keyword acts as the catch-all fallback for unlisted switch values?",
          "options": [
            "default",
            "fallback",
            "else"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_MISSING_DEFAULT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_MISSING_DEFAULT",
              "errorExplanation": "In Java switch statements, default: handles unmatched cases.",
              "recoveryPath": {
                "simplerExplanation": "default is the fallback keyword.",
                "guidedFixPrompt": "Select default."
              }
            }
          }
        }
      },
      {
        "id": "java-d6-b3-switch-vs-if",
        "day": 6,
        "blockNumber": 3,
        "title": "Switch vs if-else (When to Use Which)",
        "conceptBudget": {
          "primaryConcept": "Control Flow Choice",
          "supportingTerms": [
            "Discrete Values",
            "Range Checking"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d6-b2-default-guard",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Menu Button vs Thermometer Range",
            "simpleExplanation": "Use switch when matching exact fixed choices (Menu option 1, 2, 3). Use if-else when testing ranges (temperature > 75 and temperature < 90)."
          },
          {
            "type": "runnable_code",
            "filename": "MenuChoice.java",
            "initialCode": "public class MenuChoice {\n    public static void main(String[] args) {\n        char grade = 'B';\n        switch (grade) {\n            case 'A': System.out.println(\"Excellent\"); break;\n            case 'B': System.out.println(\"Good Job\"); break;\n            default: System.out.println(\"Keep Practicing\");\n        }\n    }\n}",
            "expectedOutput": "Good Job",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which structure is cleaner for checking if an integer menuOption is exactly 1, 2, 3, or 4?",
          "options": [
            "A switch statement with case 1, 2, 3, 4",
            "A 10-line while loop",
            "A try-catch block"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_SWITCH_VS_IF_DISCRETE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_SWITCH_VS_IF_DISCRETE",
              "errorExplanation": "switch statements are specifically designed for exact discrete value matching.",
              "recoveryPath": {
                "simplerExplanation": "switch is ideal for exact menu choices.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 6 Capstone Exam: Day of Week Switch",
      "instruction": "Write a switch statement on dayNumber (1 = \"Mon\", 2 = \"Tue\", default = \"Other\").",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static void main(String[] args) {\n        int day = 1;\n        switch (day) {\n            case 1: System.out.println(\"Mon\"); break;\n            case 2: System.out.println(\"Tue\"); break;\n            default: System.out.println(\"Other\");\n        }\n    }\n}",
      "publicTestCases": [
        {
          "description": "Day 1 is Mon",
          "expected": "Mon"
        }
      ]
    }
  },
  {
    "day": 7,
    "title": "While & Do-While Loops — Iterative Repetition",
    "overviewMetaphor": "A loop is like a Ferris wheel: as long as the ride light is GREEN (condition is true), the wheel spins another round.",
    "blocks": [
      {
        "id": "java-d7-b1-while-syntax",
        "day": 7,
        "blockNumber": 1,
        "title": "The While Loop (Condition-First Iteration)",
        "conceptBudget": {
          "primaryConcept": "while Loop",
          "supportingTerms": [
            "Loop Guard",
            "Condition Check"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d5-b1-if-basic",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "Counter.java",
            "initialCode": "public class Counter {\n    public static void main(String[] args) {\n        int count = 1;\n        while (count <= 3) {\n            System.out.println(\"Count: \" + count);\n            count++;\n        }\n    }\n}",
            "expectedOutput": "Count: 1\nCount: 2\nCount: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if you forget to increment count++ inside a while (count <= 3) loop?",
          "options": [
            "The loop runs forever (Infinite Loop) because count never exceeds 3",
            "The program automatically exits",
            "The computer deletes the variable"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_INFINITE_LOOP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_INFINITE_LOOP",
              "errorExplanation": "Without updating loop variables, the condition stays true forever.",
              "recoveryPath": {
                "simplerExplanation": "Count stays 1 forever, so the loop never stops spinning.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d7-b2-loop-accumulator",
        "day": 7,
        "blockNumber": 2,
        "title": "The Accumulator Pattern (Summing Inside Loops)",
        "conceptBudget": {
          "primaryConcept": "Accumulator Variable",
          "supportingTerms": [
            "Running Total",
            "sum += val"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d7-b1-while-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Piggy Bank",
            "simpleExplanation": "An accumulator variable (int total = 0;) sits outside the loop. Each time the loop spins, it drops another coin into the bank (total += coin;)."
          },
          {
            "type": "runnable_code",
            "filename": "PiggyBank.java",
            "initialCode": "public class PiggyBank {\n    public static void main(String[] args) {\n        int total = 0;\n        int coin = 1;\n        while (coin <= 4) {\n            total += coin;\n            coin++;\n        }\n        System.out.println(\"Total saved: \" + total);\n    }\n}",
            "expectedOutput": "Total saved: 10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the value of total saved after 1 + 2 + 3 + 4 in PiggyBank?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "ten"
          ],
          "primaryMisconceptionId": "MC_JAVA_ACCUMULATOR_SCOPE",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_ACCUMULATOR_SCOPE",
              "errorExplanation": "1 + 2 + 3 + 4 = 10.",
              "recoveryPath": {
                "simplerExplanation": "Add 1+2+3+4 = 10.",
                "guidedFixPrompt": "Type 10."
              }
            }
          }
        }
      },
      {
        "id": "java-d7-b3-dowhile",
        "day": 7,
        "blockNumber": 3,
        "title": "The Do-While Loop (Execute At Least Once)",
        "conceptBudget": {
          "primaryConcept": "do-while Loop",
          "supportingTerms": [
            "Post-Condition Check",
            "Guaranteed First Run"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d7-b2-loop-accumulator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Restaurant Menu Order",
            "simpleExplanation": "The waiter always presents the menu at least once (do). You only ask to see the menu again if you are still hungry (while hungry)."
          },
          {
            "type": "syntax_anatomy",
            "codeSnippet": "do {\n    System.out.println(\"Action executed!\");\n} while (false);",
            "lineNotes": {
              "1": "do runs the block immediately before checking the condition at line 3."
            }
          },
          {
            "type": "runnable_code",
            "filename": "DoWhileDemo.java",
            "initialCode": "public class DoWhileDemo {\n    public static void main(String[] args) {\n        int count = 10;\n        do {\n            System.out.println(\"Runs at least once even if false! Count: \" + count);\n        } while (count < 5);\n    }\n}",
            "expectedOutput": "Runs at least once even if false! Count: 10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does a do-while loop differ from a standard while loop?",
          "options": [
            "A do-while loop always executes its body at least once before checking the condition",
            "A do-while loop can only count to 10",
            "A do-while loop cannot use variables"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_INFINITE_LOOP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_INFINITE_LOOP",
              "errorExplanation": "do-while evaluates its condition at the bottom, guaranteeing at least one execution.",
              "recoveryPath": {
                "simplerExplanation": "do runs first, checks condition second.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 7 Capstone Exam: While Loop Sum",
      "instruction": "Write a while loop summing numbers 1 through 4 (1+2+3+4 = 10). Print \"Sum: 10\".",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static void main(String[] args) {\n        int sum = 0;\n        int i = 1;\n        while (i <= 4) {\n            sum += i;\n            i++;\n        }\n        System.out.println(\"Sum: \" + sum);\n    }\n}",
      "publicTestCases": [
        {
          "description": "Sum 1 to 4 is 10",
          "expected": "Sum: 10"
        }
      ]
    }
  },
  {
    "day": 8,
    "title": "For Loops & Nested Iteration — Deterministic Counting",
    "overviewMetaphor": "A for loop is like a lap counter with 3 dials: 1) Start at lap 1, 2) Stop after lap 5, 3) Add 1 lap every time you cross the finish line.",
    "blocks": [
      {
        "id": "java-d8-b1-for-syntax",
        "day": 8,
        "blockNumber": 1,
        "title": "The For Loop 3-Part Header",
        "conceptBudget": {
          "primaryConcept": "for Loop Structure",
          "supportingTerms": [
            "Init",
            "Condition",
            "Update"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d7-b1-while-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "for (int i = 0; i < 3; i++) {\n    System.out.println(\"Lap: \" + i);\n}",
            "lineNotes": {
              "1": "int i = 0 (Init once), i < 3 (Check condition every lap), i++ (Update counter after each lap)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "LapCounter.java",
            "initialCode": "public class LapCounter {\n    public static void main(String[] args) {\n        for (int i = 0; i < 3; i++) {\n            System.out.println(\"Lap: \" + i);\n        }\n    }\n}",
            "expectedOutput": "Lap: 0\nLap: 1\nLap: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How many times will for (int i = 0; i < 4; i++) execute?",
          "options": [
            "4 times (for i = 0, 1, 2, 3)",
            "5 times",
            "3 times"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_OFF_BY_ONE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_OFF_BY_ONE",
              "errorExplanation": "Starting at 0 and checking < 4 runs 4 iterations (0, 1, 2, 3).",
              "recoveryPath": {
                "simplerExplanation": "Count: 0, 1, 2, 3 = 4 total laps.",
                "guidedFixPrompt": "Select 4 times."
              }
            }
          }
        }
      },
      {
        "id": "java-d8-b2-step-counting",
        "day": 8,
        "blockNumber": 2,
        "title": "Custom Step Sizes & Counting Backwards",
        "conceptBudget": {
          "primaryConcept": "Loop Step Modification",
          "supportingTerms": [
            "i += 2",
            "i--",
            "Countdown"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d8-b1-for-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "StepDemo.java",
            "initialCode": "public class StepDemo {\n    public static void main(String[] args) {\n        // Counting by 2s:\n        for (int i = 2; i <= 6; i += 2) {\n            System.out.print(i + \" \");\n        }\n        System.out.println();\n    }\n}",
            "expectedOutput": "2 4 6 ",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is printed by for (int i = 3; i >= 1; i--) System.out.print(i + \" \"); ?",
          "expectedStringOutput": "3 2 1 ",
          "acceptableAnswers": [
            "3 2 1 ",
            "3 2 1",
            "3 2 1 "
          ],
          "primaryMisconceptionId": "MC_JAVA_OFF_BY_ONE",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_OFF_BY_ONE",
              "errorExplanation": "The loop decrements i by 1 each step: 3, then 2, then 1.",
              "recoveryPath": {
                "simplerExplanation": "3, 2, 1.",
                "guidedFixPrompt": "Write: 3 2 1 "
              }
            }
          }
        }
      },
      {
        "id": "java-d8-b3-nested-loops",
        "day": 8,
        "blockNumber": 3,
        "title": "Nested For Loops (Rows & Columns Grid)",
        "conceptBudget": {
          "primaryConcept": "Nested Loops",
          "supportingTerms": [
            "Outer Loop (Row)",
            "Inner Loop (Col)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d8-b2-step-counting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Wall Calendar (Weeks & Days)",
            "simpleExplanation": "For each week (outer loop), you visit all 7 days of that week (inner loop). The inner loop finishes completely for every single step of the outer loop."
          },
          {
            "type": "runnable_code",
            "filename": "GridDemo.java",
            "initialCode": "public class GridDemo {\n    public static void main(String[] args) {\n        for (int row = 1; row <= 2; row++) {\n            for (int col = 1; col <= 3; col++) {\n                System.out.print(\"[\" + row + \",\" + col + \"] \");\n            }\n            System.out.println();\n        }\n    }\n}",
            "expectedOutput": "[1,1] [1,2] [1,3] \n[2,1] [2,2] [2,3] ",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "If an outer loop runs 3 times and an inner loop runs 4 times, how many total times does the inner loop body execute?",
          "options": [
            "12 times (3 rows * 4 columns)",
            "7 times (3 + 4)",
            "4 times"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_NESTED_LOOP_MULTIPLICATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_NESTED_LOOP_MULTIPLICATION",
              "errorExplanation": "Nested loops multiply: 3 * 4 = 12 total executions.",
              "recoveryPath": {
                "simplerExplanation": "Outer count * Inner count = 3 * 4 = 12.",
                "guidedFixPrompt": "Select 12 times."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 8 Capstone Exam: Even Numbers Sum",
      "instruction": "Write a for loop calculating sum of even numbers from 2 up to 6 (2 + 4 + 6 = 12). Print \"Even Sum: 12\".",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static void main(String[] args) {\n        int sum = 0;\n        for (int i = 2; i <= 6; i += 2) {\n            sum += i;\n        }\n        System.out.println(\"Even Sum: \" + sum);\n    }\n}",
      "publicTestCases": [
        {
          "description": "Even sum 2+4+6 = 12",
          "expected": "Even Sum: 12"
        }
      ]
    }
  },
  {
    "day": 9,
    "title": "Modular Programming — Custom Methods & Reusable Logic",
    "overviewMetaphor": "A custom method is like a microwave preset button (e.g. Popcorn): instead of typing 50 lines of instructions every time, you package them under a named button and press it whenever you need it.",
    "blocks": [
      {
        "id": "java-d9-b1-why-methods",
        "day": 9,
        "blockNumber": 1,
        "title": "Why Methods? (The DRY Principle)",
        "conceptBudget": {
          "primaryConcept": "Method Packaging",
          "supportingTerms": [
            "DRY Principle",
            "Code Reusability"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d8-b1-for-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Microwave Popcorn Button",
            "simpleExplanation": "Without a method, if you calculate sales tax across 10 checkout screens, you have to copy-paste the formula 10 times. A method packages that formula so you write it once and reuse it everywhere."
          },
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Eliminating Code Duplication",
              "brokenCode": "// Copy-pasting tax formula everywhere:\ndouble t1 = price1 * 0.08;\ndouble t2 = price2 * 0.08;",
              "fixedCode": "// Define once in a method:\npublic static double calculateTax(double price) {\n    return price * 0.08;\n}",
              "errorReason": "Duplicate code is difficult to update and prone to bugs.",
              "fixExplanation": "Define calculateTax() once and call calculateTax(price1) whenever needed."
            }
          },
          {
            "type": "runnable_code",
            "filename": "DryMethods.java",
            "initialCode": "public class DryMethods {\n    public static double computeTax(double price) {\n        return price * 0.08;\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Tax 1: $\" + computeTax(100.0));\n        System.out.println(\"Tax 2: $\" + computeTax(50.0));\n    }\n}",
            "expectedOutput": "Tax 1: $8.0\nTax 2: $4.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary purpose of writing custom methods in Java?",
          "options": [
            "Packaging reusable logic so you do not duplicate code across your application",
            "Allowing Java code to run without requiring memory",
            "Deleting old variables permanently from disk"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_METHOD_PURPOSE_DRY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_METHOD_PURPOSE_DRY",
              "errorExplanation": "Methods are structural tools designed for code reusability.",
              "recoveryPath": {
                "simplerExplanation": "Methods let you write instructions once and reuse them anywhere.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d9-b2-anatomy",
        "day": 9,
        "blockNumber": 2,
        "title": "Method Anatomy (Return Types & Parameters)",
        "conceptBudget": {
          "primaryConcept": "Method Signatures",
          "supportingTerms": [
            "Return Type",
            "Parameter Inputs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d9-b1-why-methods",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "public static int add(int a, int b) {\n    return a + b;\n}",
            "lineNotes": {
              "1": "int is the return type (the calculated answer sent back). (int a, int b) are the input parameters.",
              "2": "return a + b calculates the sum and hands the value back to the caller."
            }
          },
          {
            "type": "runnable_code",
            "filename": "Calculator.java",
            "initialCode": "public class Calculator {\n    public static int add(int a, int b) {\n        return a + b;\n    }\n    public static void main(String[] args) {\n        int answer = add(10, 25);\n        System.out.println(\"Answer: \" + answer);\n    }\n}",
            "expectedOutput": "Answer: 35",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In public static int multiply(int x, int y) { return x * y; }, what does multiply(4, 5) return?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "twenty"
          ],
          "primaryMisconceptionId": "MC_JAVA_METHOD_RETURN_TYPE_MISMATCH",
          "diagnosisMap": {
            "wrong_math": {
              "misconceptionId": "MC_JAVA_METHOD_RETURN_TYPE_MISMATCH",
              "errorExplanation": "multiply(4, 5) computes 4 * 5 = 20.",
              "recoveryPath": {
                "simplerExplanation": "Multiply 4 by 5 to calculate 20.",
                "guidedFixPrompt": "Type 20."
              }
            }
          }
        }
      },
      {
        "id": "java-d9-b3-pass-by-value",
        "day": 9,
        "blockNumber": 3,
        "title": "Pass-by-Value (The Photocopy Rule)",
        "conceptBudget": {
          "primaryConcept": "Pass-by-Value Primitives",
          "supportingTerms": [
            "Parameter Copy",
            "Caller Isolation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d9-b2-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Photocopy Rule",
            "simpleExplanation": "When you pass an int into a method, Java gives the method a photocopy of the number. If the method writes all over its photocopy, your original number remains completely untouched."
          },
          {
            "type": "runnable_code",
            "filename": "PhotocopyDemo.java",
            "initialCode": "public class PhotocopyDemo {\n    public static void modifyNumber(int n) {\n        n = n + 50; // Only changes local photocopy!\n    }\n    public static void main(String[] args) {\n        int score = 100;\n        modifyNumber(score);\n        System.out.println(\"Original score: \" + score);\n    }\n}",
            "expectedOutput": "Original score: 100",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "If you pass int score = 100 into modifyNumber(int n) { n = 999; }, what is score in main() afterwards?",
          "options": [
            "100 (Primitives are passed by copy; original variable is unchanged)",
            "999 (The original variable is overwritten)",
            "0 (The variable is reset to default)"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_PASS_BY_VALUE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_PASS_BY_VALUE",
              "errorExplanation": "In Java, primitive variables are passed by value (copy). Changing the parameter does not alter the caller variable.",
              "recoveryPath": {
                "simplerExplanation": "Remember the photocopy rule: changing the photocopy never changes the original document.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d9-b4-void-methods",
        "day": 9,
        "blockNumber": 4,
        "title": "Void Methods (Actions Without Return Values)",
        "conceptBudget": {
          "primaryConcept": "void Return Type",
          "supportingTerms": [
            "Action-Only",
            "No Return Value"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d9-b3-pass-by-value",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "public static void printReceipt(double total) {\n    System.out.println(\"Total Due: $\" + total);\n}",
            "lineNotes": {
              "1": "void means this method executes an action (printing) but does not return any calculated answer back."
            }
          },
          {
            "type": "runnable_code",
            "filename": "VoidDemo.java",
            "initialCode": "public class VoidDemo {\n    public static void printBanner(String msg) {\n        System.out.println(\"=== \" + msg + \" ===\");\n    }\n    public static void main(String[] args) {\n        printBanner(\"SYSTEM READY\");\n    }\n}",
            "expectedOutput": "=== SYSTEM READY ===",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does the void keyword mean in a method signature?",
          "options": [
            "The method does not return any value to the caller",
            "The method cannot take any input parameters",
            "The method is empty and will not run"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_PASS_BY_VALUE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_PASS_BY_VALUE",
              "errorExplanation": "void indicates that the method performs side effects without returning data.",
              "recoveryPath": {
                "simplerExplanation": "void = performs an action without handing back an answer.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 9 Capstone Exam: Total Price Calculator",
      "instruction": "Write a Java method calculateTotal(double price, double taxRate) in Solution returning price + (price * taxRate).",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static double calculateTotal(double price, double taxRate) {\n        return price + (price * taxRate);\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Total: \" + calculateTotal(100.0, 0.05));\n    }\n}",
      "publicTestCases": [
        {
          "description": "100.0 with 5% tax = Total: 105.0",
          "expected": "Total: 105.0"
        }
      ]
    }
  },
  {
    "day": 10,
    "title": "Call Stack, Variable Scopes & ⭐ MILESTONE 2: Financial Utility Engine",
    "overviewMetaphor": "Milestone 2 — Modular Financial Utility Engine: The Call Stack is like a stack of cafeteria trays: every time you call a method, a new tray is placed on top. When the method finishes, its tray is popped off and local variables vanish.",
    "blocks": [
      {
        "id": "java-d10-b1-call-stack",
        "day": 10,
        "blockNumber": 1,
        "title": "The Call Stack (Stack Frames in Action)",
        "conceptBudget": {
          "primaryConcept": "Call Stack Frames",
          "supportingTerms": [
            "Push",
            "Pop",
            "Active Frame"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d9-b2-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Stack of Cafeteria Trays",
            "simpleExplanation": "When main() calls calculateTax(), Java places calculateTax on top of the stack. main() pauses and waits. When calculateTax finishes, its tray is popped off and main() resumes."
          },
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Stack Frame Execution Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. main() pushes frame",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. main() calls calculateTax(100)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. calculateTax frame placed on top",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. calculateTax returns 8.0 & pops off",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "5. main() receives 8.0 & resumes",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "StackTraceDemo.java",
            "initialCode": "public class StackTraceDemo {\n    public static void stepTwo() {\n        System.out.println(\"Step 2: Top of Stack\");\n    }\n    public static void stepOne() {\n        System.out.println(\"Step 1: Calling stepTwo\");\n        stepTwo();\n        System.out.println(\"Step 1: Resumed after pop\");\n    }\n    public static void main(String[] args) {\n        stepOne();\n    }\n}",
            "expectedOutput": "Step 1: Calling stepTwo\nStep 2: Top of Stack\nStep 1: Resumed after pop",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens to a method stack frame when the method finishes executing?",
          "options": [
            "It is popped off the call stack and its local variables vanish from memory",
            "It stays in memory permanently and blocks other methods",
            "It is copied to the hard drive"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_VARIABLE_REASSIGNMENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_VARIABLE_REASSIGNMENT",
              "errorExplanation": "When a method returns, its stack frame is popped and cleaned up automatically.",
              "recoveryPath": {
                "simplerExplanation": "Method ends = tray removed from stack = local variables vanish.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d10-b2-scope",
        "day": 10,
        "blockNumber": 2,
        "title": "Block Scope ({ Curly Brace } Boundaries)",
        "conceptBudget": {
          "primaryConcept": "Variable Scope",
          "supportingTerms": [
            "Curly Braces",
            "Local Visibility"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d10-b1-call-stack",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Block Scope Visibility Fix",
              "brokenCode": "if (true) {\n    int discount = 15;\n}\nSystem.out.println(discount); // ❌ Error: Cannot find symbol discount",
              "fixedCode": "int discount = 0;\nif (true) {\n    discount = 15;\n}\nSystem.out.println(discount); // ✅ Correct! Prints 15",
              "errorReason": "Variables declared inside { } only exist inside those braces.",
              "fixExplanation": "Declare the variable outside the block before the if statement if you need to use it later."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ScopeDemo.java",
            "initialCode": "public class ScopeDemo {\n    public static void main(String[] args) {\n        int globalVar = 100;\n        if (true) {\n            int localVar = 50;\n            System.out.println(\"Inside block: \" + (globalVar + localVar));\n        }\n        System.out.println(\"Outside block: \" + globalVar);\n    }\n}",
            "expectedOutput": "Inside block: 150\nOutside block: 100",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Where can a variable declared inside an if { ... } block be accessed?",
          "options": [
            "Only inside that specific { ... } block",
            "Anywhere in the entire Java file",
            "Only after main finishes"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_VARIABLE_REASSIGNMENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_VARIABLE_REASSIGNMENT",
              "errorExplanation": "Variables declared inside braces are limited to that block scope.",
              "recoveryPath": {
                "simplerExplanation": "Curly braces are private rooms: variables created inside stay inside.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d10-b3-helper-methods",
        "day": 10,
        "blockNumber": 3,
        "title": "Helper Method Composition",
        "conceptBudget": {
          "primaryConcept": "Helper Methods",
          "supportingTerms": [
            "Method Calling Method",
            "Modular Step"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d10-b2-scope",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Assembly Line Station",
            "simpleExplanation": "Station 1 stamps the metal (applyDiscount). Station 2 paints it (applyTax). Each helper method does one simple job perfectly."
          },
          {
            "type": "runnable_code",
            "filename": "AssemblyLine.java",
            "initialCode": "public class AssemblyLine {\n    public static double applyTax(double amount, double rate) {\n        return amount + (amount * rate);\n    }\n    public static double processOrder(double price, double taxRate) {\n        return applyTax(price, taxRate);\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Final: \" + processOrder(50.0, 0.10));\n    }\n}",
            "expectedOutput": "Final: 55.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In AssemblyLine above, what is the output of processOrder(50.0, 0.10)?",
          "expectedStringOutput": "Final: 55.0",
          "acceptableAnswers": [
            "Final: 55.0",
            "55.0",
            "55"
          ],
          "primaryMisconceptionId": "MC_JAVA_METHOD_CALL_COMPOSITION",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_METHOD_CALL_COMPOSITION",
              "errorExplanation": "50 + (50 * 0.10) = 55.0.",
              "recoveryPath": {
                "simplerExplanation": "50 + 5 = 55.0.",
                "guidedFixPrompt": "Type Final: 55.0"
              }
            }
          }
        }
      },
      {
        "id": "java-d10-b4-milestone-2",
        "day": 10,
        "blockNumber": 4,
        "title": "⭐ MILESTONE 2: Multi-Method Financial Engine",
        "conceptBudget": {
          "primaryConcept": "Method Composition",
          "supportingTerms": [
            "Helper Methods",
            "Modular Architecture"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d10-b3-helper-methods",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "FinancialEngine.java",
            "initialCode": "public class FinancialEngine {\n    public static double applyDiscount(double p, double d) {\n        return p - (p * d);\n    }\n    public static double finalPrice(double p, double d, double t) {\n        double disc = applyDiscount(p, d);\n        return disc + (disc * t);\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Final: \" + finalPrice(100.0, 0.10, 0.05));\n    }\n}",
            "expectedOutput": "Final: 94.5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In Milestone 2, how do applyDiscount and finalPrice connect?",
          "options": [
            "finalPrice calls applyDiscount and uses its return value to calculate tax",
            "They share a single global variable that cannot be changed",
            "They must be in two separate files"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_METHOD_RETURN_FEEDTHROUGH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_METHOD_RETURN_FEEDTHROUGH",
              "errorExplanation": "Methods return values that can be passed into other methods.",
              "recoveryPath": {
                "simplerExplanation": "Method output feeds into another method as input.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 10 Milestone 2 Challenge: Multi-Method Financial Engine",
      "instruction": "Write applyDiscount(double p, double d) returning p - (p * d), and finalPrice(double p, double d, double t) returning applyTax on discounted price in Solution.",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static double applyDiscount(double p, double d) {\n        return p - (p * d);\n    }\n    public static double finalPrice(double p, double d, double t) {\n        double disc = applyDiscount(p, d);\n        return disc + (disc * t);\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Final: \" + finalPrice(100.0, 0.10, 0.05));\n    }\n}",
      "publicTestCases": [
        {
          "description": "100.0 with 10% discount and 5% tax = Final: 94.5",
          "expected": "Final: 94.5"
        }
      ]
    }
  },
  {
    "day": 11,
    "title": "Method Overloading & Clean Signatures",
    "overviewMetaphor": "Method overloading is like a universal TV remote with a Power button: pressing Power turns on the TV; pressing Power while holding Shift turns on the soundbar. Same button name, different inputs.",
    "blocks": [
      {
        "id": "java-d11-b1-why-overload",
        "day": 11,
        "blockNumber": 1,
        "title": "Why Overload? (Intuitive Naming)",
        "conceptBudget": {
          "primaryConcept": "Method Overloading Concept",
          "supportingTerms": [
            "Clean API",
            "Shared Intent"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d9-b2-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Universal Remote",
            "simpleExplanation": "Instead of memorizing calculateAreaSquare(4) and calculateAreaRectangle(4, 5), you simply name both calculateArea. Java looks at the arguments you pass and runs the matching version."
          },
          {
            "type": "runnable_code",
            "filename": "OverloadConcept.java",
            "initialCode": "public class OverloadConcept {\n    public static String format(int num) { return \"Number: \" + num; }\n    public static String format(String text) { return \"Text: \" + text; }\n    public static void main(String[] args) {\n        System.out.println(format(42));\n        System.out.println(format(\"Hello\"));\n    }\n}",
            "expectedOutput": "Number: 42\nText: Hello",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do developers overload methods instead of creating different names like addInt and addDouble?",
          "options": [
            "It creates cleaner, intuitive APIs so callers use one consistent method name for the same conceptual action",
            "It makes the compiler faster",
            "Java only permits 10 method names per class"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_OVERLOAD_PURPOSE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_OVERLOAD_PURPOSE",
              "errorExplanation": "Overloading provides intuitive, unified naming for the same logical operation.",
              "recoveryPath": {
                "simplerExplanation": "Same name = same conceptual action with different inputs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d11-b2-overload-types",
        "day": 11,
        "blockNumber": 2,
        "title": "Overloading by Parameter Types",
        "conceptBudget": {
          "primaryConcept": "Type Overloading",
          "supportingTerms": [
            "Type Signature",
            "Int vs Double"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d11-b1-why-overload",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "OverloadDemo.java",
            "initialCode": "public class OverloadDemo {\n    public static int add(int a, int b) {\n        return a + b;\n    }\n    public static double add(double a, double b) {\n        return a + b;\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Int: \" + add(2, 3));\n        System.out.println(\"Double: \" + add(2.5, 3.5));\n    }\n}",
            "expectedOutput": "Int: 5\nDouble: 6.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can two methods in the same class have the exact same name?",
          "options": [
            "Yes, provided their parameter types or counts are different",
            "No, Java throws a compile error whenever two methods share a name",
            "Only if one method is private"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_OVERLOAD_PARAMETER_SIGNATURE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_OVERLOAD_PARAMETER_SIGNATURE",
              "errorExplanation": "Java supports method overloading when parameter signatures differ.",
              "recoveryPath": {
                "simplerExplanation": "Same name is allowed if inputs are different.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d11-b3-overload-count",
        "day": 11,
        "blockNumber": 3,
        "title": "Overloading by Parameter Count",
        "conceptBudget": {
          "primaryConcept": "Count Overloading",
          "supportingTerms": [
            "Optional Arguments",
            "Arity"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d11-b2-overload-types",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "public static double calculateTotal(double price) {\n    return calculateTotal(price, 0.05); // Default 5% tax\n}\npublic static double calculateTotal(double price, double taxRate) {\n    return price + (price * taxRate);\n}",
            "lineNotes": {
              "1": "The 1-parameter version delegates to the 2-parameter version with a default tax rate of 0.05."
            }
          },
          {
            "type": "runnable_code",
            "filename": "OverloadCountDemo.java",
            "initialCode": "public class OverloadCountDemo {\n    public static double priceWithTax(double p) {\n        return priceWithTax(p, 0.05);\n    }\n    public static double priceWithTax(double p, double tax) {\n        return p + (p * tax);\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Default: \" + priceWithTax(100.0));\n        System.out.println(\"Custom: \" + priceWithTax(100.0, 0.10));\n    }\n}",
            "expectedOutput": "Default: 105.0\nCustom: 110.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In the code above, what does calculateTotal(100.0) return?",
          "expectedStringOutput": "105.0",
          "acceptableAnswers": [
            "105.0",
            "105"
          ],
          "primaryMisconceptionId": "MC_JAVA_OVERLOAD_ARITY",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_OVERLOAD_ARITY",
              "errorExplanation": "calculateTotal(100.0) calls calculateTotal(100.0, 0.05) = 105.0.",
              "recoveryPath": {
                "simplerExplanation": "100 + (100 * 0.05) = 105.0.",
                "guidedFixPrompt": "Type 105.0."
              }
            }
          }
        }
      },
      {
        "id": "java-d11-b4-signature-rules",
        "day": 11,
        "blockNumber": 4,
        "title": "The Return Type Trap (Signature Match Rules)",
        "conceptBudget": {
          "primaryConcept": "Signature Match Rules",
          "supportingTerms": [
            "Return Type Excluded",
            "Compiler Ambiguity"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d11-b3-overload-count",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Return Type Alone Cannot Overload",
              "brokenCode": "public static int getNum() { return 5; }\npublic static double getNum() { return 5.0; } // ❌ Error: duplicate method",
              "fixedCode": "public static int getIntNum() { return 5; }\npublic static double getDoubleNum() { return 5.0; } // ✅ Correct!",
              "errorReason": "Java cannot decide which getNum() to call when you write getNum(). Changing return type alone is not overloading.",
              "fixExplanation": "Change the parameter list (types or count) to create a valid overload."
            }
          },
          {
            "type": "runnable_code",
            "filename": "SignatureRulesDemo.java",
            "initialCode": "public class SignatureRulesDemo {\n    public static int multiply(int a, int b) { return a * b; }\n    public static double multiply(double a, double b) { return a * b; }\n    public static void main(String[] args) {\n        System.out.println(\"Int: \" + multiply(4, 5));\n        System.out.println(\"Double: \" + multiply(2.5, 4.0));\n    }\n}",
            "expectedOutput": "Int: 20\nDouble: 10.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does changing only the return type (int vs double) fail to overload a method?",
          "options": [
            "Because Java identifies which method to call based on input arguments, not what it returns",
            "Because return types cannot be numbers",
            "Because double takes more memory"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_OVERLOAD_RETURN_TYPE_ONLY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_OVERLOAD_RETURN_TYPE_ONLY",
              "errorExplanation": "Overload resolution is based entirely on parameter list signatures.",
              "recoveryPath": {
                "simplerExplanation": "The caller only passes inputs: Java picks based on inputs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 11 Capstone Exam: Overloaded Area Calculator",
      "instruction": "Write overloaded calculateArea(int side) returning side * side and calculateArea(int length, int width) returning length * width.",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static int calculateArea(int side) {\n        return side * side;\n    }\n    public static int calculateArea(int length, int width) {\n        return length * width;\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Square: \" + calculateArea(4));\n        System.out.println(\"Rect: \" + calculateArea(5, 8));\n    }\n}",
      "publicTestCases": [
        {
          "description": "Square 4 and Rect 5x8",
          "expected": "Square: 16\nRect: 40"
        }
      ]
    }
  },
  {
    "day": 12,
    "title": "1D Arrays — Contiguous Memory Allocation & Indexing",
    "overviewMetaphor": "An array is like an egg carton with numbered slots: slot 0 holds the first egg, slot 1 holds the second. Counting always starts at 0!",
    "blocks": [
      {
        "id": "java-d12-b1-why-arrays",
        "day": 12,
        "blockNumber": 1,
        "title": "Why Arrays? (The Numbered Egg Carton)",
        "conceptBudget": {
          "primaryConcept": "1D Arrays Concept",
          "supportingTerms": [
            "Indexed Collection",
            "Uniform Type"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d8-b1-for-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Numbered Egg Carton",
            "simpleExplanation": "Instead of creating 50 separate variables for 50 student scores (score1, score2, ... score50), an array packages all 50 scores inside one indexed container scores[i]."
          },
          {
            "type": "runnable_code",
            "filename": "ArrayEggCarton.java",
            "initialCode": "public class ArrayEggCarton {\n    public static void main(String[] args) {\n        int[] carton = { 10, 20, 30, 40 };\n        System.out.println(\"Carton size: \" + carton.length);\n        System.out.println(\"Slot 0: \" + carton[0]);\n        System.out.println(\"Slot 3: \" + carton[3]);\n    }\n}",
            "expectedOutput": "Carton size: 4\nSlot 0: 10\nSlot 3: 40",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the main benefit of using an array instead of individual variables?",
          "options": [
            "Grouping multiple values of the same type under one name with indexed access",
            "Allowing Java to delete unused files",
            "Running code without requiring a main method"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_ARRAY_INDEX_PURPOSE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_ARRAY_INDEX_PURPOSE",
              "errorExplanation": "Arrays store ordered collections of elements accessible by index.",
              "recoveryPath": {
                "simplerExplanation": "One array variable replaces 50 separate variables.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d12-b2-array-creation",
        "day": 12,
        "blockNumber": 2,
        "title": "Array Creation & 0-Based Indexing",
        "conceptBudget": {
          "primaryConcept": "0-Based Indexing",
          "supportingTerms": [
            "Index 0",
            "Array Length"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d12-b1-why-arrays",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ArrayDemo.java",
            "initialCode": "public class ArrayDemo {\n    public static void main(String[] args) {\n        int[] scores = { 85, 92, 78, 90 };\n        System.out.println(\"First score: \" + scores[0]);\n        System.out.println(\"Total items: \" + scores.length);\n    }\n}",
            "expectedOutput": "First score: 85\nTotal items: 4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In int[] nums = { 10, 20, 30 }, what is nums[0]?",
          "options": [
            "10 (The first item is always at index 0)",
            "20 (Index 0 is the second item)",
            "30 (Index 0 is the last item)"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_OFF_BY_ONE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_OFF_BY_ONE",
              "errorExplanation": "In programming, indices start at 0. nums[0] is the first element.",
              "recoveryPath": {
                "simplerExplanation": "First item = index 0. Second item = index 1.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d12-b3-array-bounds",
        "day": 12,
        "blockNumber": 3,
        "title": "The Out-of-Bounds Trap (Index >= length)",
        "conceptBudget": {
          "primaryConcept": "ArrayIndexOutOfBoundsException",
          "supportingTerms": [
            "Last Index (length - 1)",
            "Index Safety"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d12-b2-array-creation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Preventing Off-By-One Index Crashes",
              "brokenCode": "int[] arr = { 10, 20, 30 };\nint last = arr[3]; // ❌ Crash! ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3",
              "fixedCode": "int[] arr = { 10, 20, 30 };\nint last = arr[arr.length - 1]; // ✅ Correct! Reads index 2 (value 30)",
              "errorReason": "An array of length 3 has valid indices 0, 1, 2 only.",
              "fixExplanation": "Always access the last element at arr[arr.length - 1]."
            }
          },
          {
            "type": "runnable_code",
            "filename": "SafeBoundsDemo.java",
            "initialCode": "public class SafeBoundsDemo {\n    public static void main(String[] args) {\n        int[] arr = { 100, 200, 300 };\n        int lastIndex = arr.length - 1;\n        System.out.println(\"Safe last element at index \" + lastIndex + \": \" + arr[lastIndex]);\n    }\n}",
            "expectedOutput": "Safe last element at index 2: 300",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "For an array of length 5, what is the valid index of the very last element?",
          "options": [
            "4 (length - 1)",
            "5",
            "0"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_OFF_BY_ONE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_OFF_BY_ONE",
              "errorExplanation": "Indices run from 0 to length - 1 (0, 1, 2, 3, 4).",
              "recoveryPath": {
                "simplerExplanation": "5 items: 0, 1, 2, 3, 4. The last index is 4.",
                "guidedFixPrompt": "Select 4."
              }
            }
          }
        }
      },
      {
        "id": "java-d12-b4-array-traversal",
        "day": 12,
        "blockNumber": 4,
        "title": "Iterating Arrays with For Loops",
        "conceptBudget": {
          "primaryConcept": "Array For-Loop Traversal",
          "supportingTerms": [
            "arr[i]",
            "Loop Scanning"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d12-b3-array-bounds",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ArrayScan.java",
            "initialCode": "public class ArrayScan {\n    public static void main(String[] args) {\n        int[] values = { 10, 20, 30 };\n        int sum = 0;\n        for (int i = 0; i < values.length; i++) {\n            sum += values[i];\n        }\n        System.out.println(\"Sum: \" + sum);\n    }\n}",
            "expectedOutput": "Sum: 60",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In ArrayScan above, what is printed as the final Sum?",
          "expectedStringOutput": "Sum: 60",
          "acceptableAnswers": [
            "Sum: 60",
            "60"
          ],
          "primaryMisconceptionId": "MC_JAVA_OFF_BY_ONE",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_OFF_BY_ONE",
              "errorExplanation": "10 + 20 + 30 = 60.",
              "recoveryPath": {
                "simplerExplanation": "Summing all 3 items gives 60.",
                "guidedFixPrompt": "Type Sum: 60"
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 12 Capstone Exam: Find Maximum in Array",
      "instruction": "Write a Java method findMax(int[] arr) that loops through arr and returns the largest number.",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static int findMax(int[] arr) {\n        int max = arr[0];\n        for (int i = 1; i < arr.length; i++) {\n            if (arr[i] > max) max = arr[i];\n        }\n        return max;\n    }\n    public static void main(String[] args) {\n        int[] scores = { 45, 92, 78, 88 };\n        System.out.println(\"Max: \" + findMax(scores));\n    }\n}",
      "publicTestCases": [
        {
          "description": "Max is 92",
          "expected": "Max: 92"
        }
      ]
    }
  },
  {
    "day": 13,
    "title": "Enhanced For-Each Loop & Array Traversal",
    "overviewMetaphor": "The for-each loop is like an airport luggage conveyor belt: each item in the array slides right into your hands one by one without needing a manual counter index (i++).",
    "blocks": [
      {
        "id": "java-d13-b1-foreach-syntax",
        "day": 13,
        "blockNumber": 1,
        "title": "The For-Each Loop (Clean Traversal)",
        "conceptBudget": {
          "primaryConcept": "Enhanced For-Each Loop",
          "supportingTerms": [
            "Read-Only Iteration",
            "Cleaner Syntax"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d12-b1-why-arrays",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Airport Luggage Belt",
            "simpleExplanation": "The for-each loop slides every element directly to you: for (int score : scores) inspects each score automatically from left to right."
          },
          {
            "type": "runnable_code",
            "filename": "ForEachDemo.java",
            "initialCode": "public class ForEachDemo {\n    public static void main(String[] args) {\n        int[] prices = { 10, 20, 30 };\n        int sum = 0;\n        for (int p : prices) {\n            sum += p;\n        }\n        System.out.println(\"Total: \" + sum);\n    }\n}",
            "expectedOutput": "Total: 60",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the syntax for iterating through int[] nums using for-each?",
          "options": [
            "for (int n : nums)",
            "for (int n in nums)",
            "for (nums : int n)"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_FOREACH_COLON_SYNTAX",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_FOREACH_COLON_SYNTAX",
              "errorExplanation": "In Java, the for-each syntax uses a colon (:): for (Type var : array).",
              "recoveryPath": {
                "simplerExplanation": "Type colon Array: for (int x : list).",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d13-b2-readonly-rule",
        "day": 13,
        "blockNumber": 2,
        "title": "Read-Only Iteration (The Photocopy in For-Each)",
        "conceptBudget": {
          "primaryConcept": "For-Each Read-Only Nature",
          "supportingTerms": [
            "Value Copy",
            "Non-Mutating"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d13-b1-foreach-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Inspecting Luggage Tags",
            "simpleExplanation": "When you inspect a luggage tag on the conveyor belt, reading the tag does not change what is inside the suitcase. Modifying the loop variable p = 999 does NOT change the array."
          },
          {
            "type": "runnable_code",
            "filename": "ReadOnlyDemo.java",
            "initialCode": "public class ReadOnlyDemo {\n    public static void main(String[] args) {\n        int[] nums = { 10, 20 };\n        for (int n : nums) {\n            n = 999; // Modifies local copy only!\n        }\n        System.out.println(\"nums[0] remains: \" + nums[0]);\n    }\n}",
            "expectedOutput": "nums[0] remains: 10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can you modify the original array elements by reassigning the loop variable in a for-each loop?",
          "options": [
            "No, the loop variable is a local copy; modifying it does not alter the array",
            "Yes, it automatically updates the array",
            "Only if the array is double"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_PASS_BY_VALUE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_PASS_BY_VALUE",
              "errorExplanation": "for-each delivers values by copy; use indexed for (int i=0; i<arr.length; i++) if you need to mutate elements.",
              "recoveryPath": {
                "simplerExplanation": "for-each is for reading, standard for loop is for modifying.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d13-b3-filtering-pattern",
        "day": 13,
        "blockNumber": 3,
        "title": "Filtering & Counting Elements",
        "conceptBudget": {
          "primaryConcept": "Conditional Accumulation",
          "supportingTerms": [
            "Filter Condition",
            "Count Match"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d13-b2-readonly-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "FilterDemo.java",
            "initialCode": "public class FilterDemo {\n    public static void main(String[] args) {\n        int[] scores = { 45, 88, 92, 50, 75 };\n        int passing = 0;\n        for (int s : scores) {\n            if (s >= 70) passing++;\n        }\n        System.out.println(\"Passing students: \" + passing);\n    }\n}",
            "expectedOutput": "Passing students: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In FilterDemo above, how many scores are >= 70 (88, 92, 75)?",
          "expectedStringOutput": "Passing students: 3",
          "acceptableAnswers": [
            "Passing students: 3",
            "3"
          ],
          "primaryMisconceptionId": "MC_JAVA_FILTER_COUNT_LOGIC",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_FILTER_COUNT_LOGIC",
              "errorExplanation": "88, 92, and 75 meet the condition, giving 3 passing students.",
              "recoveryPath": {
                "simplerExplanation": "Count: 88 (1), 92 (2), 75 (3). Total is 3.",
                "guidedFixPrompt": "Type Passing students: 3"
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 13 Capstone Exam: Count Positives with For-Each",
      "instruction": "Write countPositives(int[] arr) using a for-each loop to count elements > 0. Print \"Positives: \" + count.",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static int countPositives(int[] arr) {\n        int count = 0;\n        for (int n : arr) {\n            if (n > 0) count++;\n        }\n        return count;\n    }\n    public static void main(String[] args) {\n        int[] values = { -5, 12, 0, 7, -2, 9 };\n        System.out.println(\"Positives: \" + countPositives(values));\n    }\n}",
      "publicTestCases": [
        {
          "description": "3 positive numbers",
          "expected": "Positives: 3"
        }
      ]
    }
  },
  {
    "day": 14,
    "title": "2D Arrays & Grid Traversal",
    "overviewMetaphor": "A 2D array is like a Tic-Tac-Toe board or spreadsheet: you specify a row and a column coordinate like matrix[row][col].",
    "blocks": [
      {
        "id": "java-d14-b1-matrix-grid",
        "day": 14,
        "blockNumber": 1,
        "title": "2D Arrays (Row & Column Coordinates)",
        "conceptBudget": {
          "primaryConcept": "2D Matrices",
          "supportingTerms": [
            "Row Index",
            "Column Index"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d12-b1-why-arrays",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Spreadsheet Grid",
            "simpleExplanation": "matrix[0][1] means Row 0, Column 1. To visit every cell, you use a nested loop: outer loop for rows, inner loop for columns."
          },
          {
            "type": "runnable_code",
            "filename": "MatrixDemo.java",
            "initialCode": "public class MatrixDemo {\n    public static void main(String[] args) {\n        int[][] grid = {\n            { 1, 2 },\n            { 3, 4 }\n        };\n        System.out.println(\"Top right: \" + grid[0][1]);\n        System.out.println(\"Bottom left: \" + grid[1][0]);\n    }\n}",
            "expectedOutput": "Top right: 2\nBottom left: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In int[][] grid = { {1,2}, {3,4} }, which coordinate accesses the number 4?",
          "options": [
            "grid[1][1] (Row 1, Column 1)",
            "grid[2][2] (Row 2, Column 2)",
            "grid[0][0] (Row 0, Column 0)"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_OFF_BY_ONE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_OFF_BY_ONE",
              "errorExplanation": "Indices start at 0. Row 1, Col 1 is the bottom right corner (4).",
              "recoveryPath": {
                "simplerExplanation": "First row is 0, second row is 1. grid[1][1] is 4.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d14-b2-matrix-nested-traversal",
        "day": 14,
        "blockNumber": 2,
        "title": "Nested Loop Grid Traversal",
        "conceptBudget": {
          "primaryConcept": "Nested Matrix Traversal",
          "supportingTerms": [
            "grid[r][c]",
            "Row Scan"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d14-b1-matrix-grid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "for (int r = 0; r < grid.length; r++) {\n    for (int c = 0; c < grid[r].length; c++) {\n        System.out.print(grid[r][c] + \" \");\n    }\n}",
            "lineNotes": {
              "1": "grid.length is the number of rows.",
              "2": "grid[r].length is the number of columns in row r."
            }
          },
          {
            "type": "runnable_code",
            "filename": "NestedMatrixScan.java",
            "initialCode": "public class NestedMatrixScan {\n    public static void main(String[] args) {\n        int[][] table = { { 1, 2 }, { 3, 4 } };\n        int total = 0;\n        for (int r = 0; r < table.length; r++) {\n            for (int c = 0; c < table[r].length; c++) {\n                total += table[r][c];\n            }\n        }\n        System.out.println(\"Matrix Sum: \" + total);\n    }\n}",
            "expectedOutput": "Matrix Sum: 10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In a 2D array grid, what does grid.length represent?",
          "options": [
            "The number of rows in the matrix",
            "The total number of all cells combined",
            "The number of columns in the first row only"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_OFF_BY_ONE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_OFF_BY_ONE",
              "errorExplanation": "grid.length gives the outer array length (rows).",
              "recoveryPath": {
                "simplerExplanation": "grid.length = rows. grid[0].length = columns.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d14-b3-diagonal-sum",
        "day": 14,
        "blockNumber": 3,
        "title": "Square Matrix Diagonals (grid[i][i])",
        "conceptBudget": {
          "primaryConcept": "Matrix Diagonal Scan",
          "supportingTerms": [
            "Single Loop Optimization",
            "r == c"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d14-b2-matrix-nested-traversal",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "DiagonalDemo.java",
            "initialCode": "public class DiagonalDemo {\n    public static void main(String[] args) {\n        int[][] square = {\n            { 5, 0 },\n            { 0, 8 }\n        };\n        int diagonalSum = 0;\n        for (int i = 0; i < square.length; i++) {\n            diagonalSum += square[i][i]; // [0][0] + [1][1]\n        }\n        System.out.println(\"Diagonal Sum: \" + diagonalSum);\n    }\n}",
            "expectedOutput": "Diagonal Sum: 13",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In DiagonalDemo above, what is 5 + 8?",
          "expectedStringOutput": "Diagonal Sum: 13",
          "acceptableAnswers": [
            "Diagonal Sum: 13",
            "13"
          ],
          "primaryMisconceptionId": "MC_JAVA_MATRIX_DIAGONAL_INDEX",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_MATRIX_DIAGONAL_INDEX",
              "errorExplanation": "5 + 8 = 13.",
              "recoveryPath": {
                "simplerExplanation": "Add the diagonal cells 5 + 8 = 13.",
                "guidedFixPrompt": "Type Diagonal Sum: 13"
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 14 Capstone Exam: Matrix Diagonal Sum",
      "instruction": "Write sumDiagonal(int[][] matrix) returning sum of matrix[i][i] elements.",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static int sumDiagonal(int[][] matrix) {\n        int sum = 0;\n        for (int i = 0; i < matrix.length; i++) {\n            sum += matrix[i][i];\n        }\n        return sum;\n    }\n    public static void main(String[] args) {\n        int[][] grid = { { 5, 1 }, { 2, 8 } };\n        System.out.println(\"Diagonal: \" + sumDiagonal(grid));\n    }\n}",
      "publicTestCases": [
        {
          "description": "Diagonal 5 + 8 = 13",
          "expected": "Diagonal: 13"
        }
      ]
    }
  },
  {
    "day": 15,
    "title": "Search Algorithms & ⭐ MILESTONE 3: Fast Data Ledger",
    "overviewMetaphor": "Milestone 3 — Fast Data Ledger: Linear search is like checking every page of a book one by one. Binary search is like opening a dictionary in the exact middle and cutting your search area in half with every step.",
    "blocks": [
      {
        "id": "java-d15-b1-linear-search",
        "day": 15,
        "blockNumber": 1,
        "title": "Linear Search (Sequential Scan)",
        "conceptBudget": {
          "primaryConcept": "Linear Search",
          "supportingTerms": [
            "Sequential Check",
            "Unsorted Search"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d12-b4-array-traversal",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Flipping Every Card One by One",
            "simpleExplanation": "Linear search inspects index 0, then index 1, then index 2. It works on any unsorted list, but takes O(N) steps."
          },
          {
            "type": "runnable_code",
            "filename": "LinearDemo.java",
            "initialCode": "public class LinearDemo {\n    public static int search(int[] arr, int target) {\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] == target) return i;\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] items = { 40, 10, 30, 20 };\n        System.out.println(\"Found 30 at index: \" + search(items, 30));\n    }\n}",
            "expectedOutput": "Found 30 at index: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In LinearDemo with items { 40, 10, 30, 20 }, what index is returned for target 30?",
          "expectedStringOutput": "Found 30 at index: 2",
          "acceptableAnswers": [
            "Found 30 at index: 2",
            "2"
          ],
          "primaryMisconceptionId": "MC_JAVA_OFF_BY_ONE",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_OFF_BY_ONE",
              "errorExplanation": "30 is at index 2 (40 is at 0, 10 is at 1, 30 is at 2).",
              "recoveryPath": {
                "simplerExplanation": "Count: 0, 1, 2. Index 2 holds 30.",
                "guidedFixPrompt": "Type Found 30 at index: 2"
              }
            }
          }
        }
      },
      {
        "id": "java-d15-b2-binary-search-concept",
        "day": 15,
        "blockNumber": 2,
        "title": "Binary Search (The Dictionary Halving Trick)",
        "conceptBudget": {
          "primaryConcept": "Binary Search Divide & Conquer",
          "supportingTerms": [
            "Halving Steps",
            "low, mid, high"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d15-b1-linear-search",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Dictionary Halving Trick",
            "simpleExplanation": "If an array is sorted, check the middle item. If your target is larger, throw away the left half. If smaller, throw away the right half. You find any item in a 1,000,000-item array in just 20 steps!"
          },
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Binary Search Halving Step",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Sorted Array: [10, 20, 30, 40, 50]",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Check mid (30) vs target (40)",
                  "kind": "decision"
                },
                {
                  "id": "3",
                  "label": "3. 40 > 30 -> discard left half [10, 20, 30]",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Search remaining right half [40, 50]",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "HalvingDemo.java",
            "initialCode": "public class HalvingDemo {\n    public static void main(String[] args) {\n        int[] sorted = { 10, 20, 30, 40, 50, 60, 70 };\n        int low = 0, high = sorted.length - 1;\n        int mid = low + (high - low) / 2;\n        System.out.println(\"Middle element of sorted array: \" + sorted[mid]);\n    }\n}",
            "expectedOutput": "Middle element of sorted array: 40",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the critical prerequisite for Binary Search to function correctly?",
          "options": [
            "The array MUST be sorted in ascending order",
            "The array must contain only positive numbers",
            "The array must have an even number of elements"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_BINARY_SEARCH_UNSORTED",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_BINARY_SEARCH_UNSORTED",
              "errorExplanation": "Binary search relies on sorted ordering to eliminate half the items.",
              "recoveryPath": {
                "simplerExplanation": "You can only cut in half if the list is sorted in order.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d15-b3-milestone-3",
        "day": 15,
        "blockNumber": 3,
        "title": "⭐ MILESTONE 3: Fast Binary Search Ledger",
        "conceptBudget": {
          "primaryConcept": "Binary Search Implementation",
          "supportingTerms": [
            "mid Calculation",
            "O(log N) Efficiency"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d15-b2-binary-search-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "BinarySearchDemo.java",
            "initialCode": "public class BinarySearchDemo {\n    public static int search(int[] arr, int target) {\n        int low = 0, high = arr.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (arr[mid] == target) return mid;\n            if (arr[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] sorted = { 10, 20, 30, 40, 50 };\n        System.out.println(\"Index of 40: \" + search(sorted, 40));\n    }\n}",
            "expectedOutput": "Index of 40: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does binarySearch return if the target element is NOT present in the array?",
          "options": [
            "-1",
            "0",
            "Throws an exception"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_OFF_BY_ONE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_OFF_BY_ONE",
              "errorExplanation": "Standard Java search convention returns -1 when a target is not found.",
              "recoveryPath": {
                "simplerExplanation": "-1 indicates \"not found\".",
                "guidedFixPrompt": "Select -1."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 15 Milestone 3 Challenge: Fast Binary Search Ledger",
      "instruction": "Write binarySearch(int[] arr, int target) in Solution returning index of target in sorted arr, or -1 if not found.",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static int binarySearch(int[] arr, int target) {\n        int low = 0, high = arr.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (arr[mid] == target) return mid;\n            if (arr[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        int[] ledger = { 100, 250, 400, 750, 990 };\n        System.out.println(\"Found 750 at index: \" + binarySearch(ledger, 750));\n    }\n}",
      "publicTestCases": [
        {
          "description": "Finds 750 at index 3",
          "expected": "Found 750 at index: 3"
        }
      ]
    }
  },
  {
    "day": 16,
    "title": "Object-Oriented Programming — Classes, Objects & Memory Instances",
    "overviewMetaphor": "A Class is an architectural blueprint of a house drawn on paper; an Object is the real brick-and-mortar house constructed on the lot (in heap memory).",
    "blocks": [
      {
        "id": "java-d16-b1-blueprint",
        "day": 16,
        "blockNumber": 1,
        "title": "What is a Class? (The Blueprint)",
        "conceptBudget": {
          "primaryConcept": "Class Definition",
          "supportingTerms": [
            "Blueprint",
            "Field Template"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d12-b1-why-arrays",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Cookie Cutter",
            "simpleExplanation": "A class is the metal cookie cutter: it has the shape and fields (name, age), but it is not a cookie you can eat. An object is the delicious cookie stamped out of dough in RAM."
          },
          {
            "type": "syntax_anatomy",
            "codeSnippet": "class Student {\n    String name;\n    int age;\n}",
            "lineNotes": {
              "1": "class Student defines the template for all student objects.",
              "2": "String name and int age are the state fields every student will possess."
            }
          },
          {
            "type": "runnable_code",
            "filename": "CarBlueprint.java",
            "initialCode": "class Car {\n    String model = \"Sedan\";\n    int speed = 60;\n}\npublic class CarBlueprint {\n    public static void main(String[] args) {\n        Car myCar = new Car();\n        System.out.println(\"Car model: \" + myCar.model + \", Speed: \" + myCar.speed + \" mph\");\n    }\n}",
            "expectedOutput": "Car model: Sedan, Speed: 60 mph",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the relationship between a Class and an Object in Java?",
          "options": [
            "A Class is the blueprint template; an Object is a real concrete instance created in memory",
            "They are identical words for the same thing",
            "An Object is the blueprint; a Class is the instance"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_CLASS_VS_OBJECT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_CLASS_VS_OBJECT",
              "errorExplanation": "Classes define structure; objects are the memory instances stamped out using new.",
              "recoveryPath": {
                "simplerExplanation": "Class = blueprint on paper. Object = real house in memory.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d16-b2-new-keyword",
        "day": 16,
        "blockNumber": 2,
        "title": "The new Keyword (Heap Allocation)",
        "conceptBudget": {
          "primaryConcept": "new Operator",
          "supportingTerms": [
            "Heap Allocation",
            "Object Instance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d16-b1-blueprint",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Pouring Foundation Concrete",
            "simpleExplanation": "Writing new Student() commands Java to allocate a brand-new chunk of RAM on the Heap to hold this specific student fields."
          },
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "boxes": [
                {
                  "label": "s1",
                  "varType": "Student reference",
                  "value": "Heap Storage: { name: \"Alice\", score: 95 }",
                  "highlightNote": "Heap Object"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "HeapAllocDemo.java",
            "initialCode": "class Item {\n    String label;\n    double cost;\n}\npublic class HeapAllocDemo {\n    public static void main(String[] args) {\n        Item item = new Item();\n        item.label = \"Laptop\";\n        item.cost = 899.99;\n        System.out.println(\"Created on Heap: \" + item.label + \" for $\" + item.cost);\n    }\n}",
            "expectedOutput": "Created on Heap: Laptop for $899.99",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which keyword tells Java to construct a brand-new object instance in heap memory?",
          "options": [
            "new",
            "create",
            "make"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_NEW_KEYWORD_HEAP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_NEW_KEYWORD_HEAP",
              "errorExplanation": "In Java, the new keyword allocates object memory on the heap.",
              "recoveryPath": {
                "simplerExplanation": "new = allocate new memory.",
                "guidedFixPrompt": "Select new."
              }
            }
          }
        }
      },
      {
        "id": "java-d16-b3-dot-notation",
        "day": 16,
        "blockNumber": 3,
        "title": "Dot Notation (Accessing Fields & Methods)",
        "conceptBudget": {
          "primaryConcept": "Dot Operator",
          "supportingTerms": [
            "Field Access",
            "Method Invocation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d16-b2-new-keyword",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "Student s = new Student();\ns.name = \"Alice\";\ns.age = 20;",
            "lineNotes": {
              "2": "s.name uses the dot operator (.) to reach inside object s and set its name field."
            }
          },
          {
            "type": "runnable_code",
            "filename": "DotNotationDemo.java",
            "initialCode": "class Player {\n    String tag;\n    int rank;\n    public void levelUp() { rank++; }\n}\npublic class DotNotationDemo {\n    public static void main(String[] args) {\n        Player p = new Player();\n        p.tag = \"Shadow\";\n        p.rank = 1;\n        p.levelUp();\n        System.out.println(\"Player: \" + p.tag + \" (Rank \" + p.rank + \")\");\n    }\n}",
            "expectedOutput": "Player: Shadow (Rank 2)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How do you access a field or method on an object reference s in Java?",
          "options": [
            "Using the dot operator: s.fieldName",
            "Using an arrow: s->fieldName",
            "Using brackets: s[fieldName]"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_DOT_NOTATION_ACCESS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_DOT_NOTATION_ACCESS",
              "errorExplanation": "Java uses dot notation (.) for member access.",
              "recoveryPath": {
                "simplerExplanation": "Use dot: object.field.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d16-b4-multiple-instances",
        "day": 16,
        "blockNumber": 4,
        "title": "Multiple Independent Instances",
        "conceptBudget": {
          "primaryConcept": "Independent Object State",
          "supportingTerms": [
            "Isolated Heap Boxes",
            "No Interference"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d16-b3-dot-notation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "StudentDemo.java",
            "initialCode": "class Student {\n    String name;\n    int age;\n}\npublic class StudentDemo {\n    public static void main(String[] args) {\n        Student s1 = new Student();\n        s1.name = \"Alice\";\n        Student s2 = new Student();\n        s2.name = \"Bob\";\n        System.out.println(\"s1: \" + s1.name + \", s2: \" + s2.name);\n    }\n}",
            "expectedOutput": "s1: Alice, s2: Bob",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "If you change s1.name = \"Charlie\", what happens to s2.name?",
          "options": [
            "s2.name remains \"Bob\" (s1 and s2 are completely independent objects in memory)",
            "s2.name also changes to \"Charlie\"",
            "s2 is deleted"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_VARIABLE_REASSIGNMENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_VARIABLE_REASSIGNMENT",
              "errorExplanation": "Each object instance occupies its own independent memory space.",
              "recoveryPath": {
                "simplerExplanation": "Two separate houses: painting House 1 does not change House 2.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 16 Capstone Exam: Bank Account Class",
      "instruction": "Create class BankAccount with int balance, deposit(int amt) adding to balance, and getBalance() in Solution.",
      "scaffoldLevel": 2,
      "starterJavaCode": "class BankAccount {\n    int balance = 0;\n    public void deposit(int amt) {\n        balance += amt;\n    }\n    public int getBalance() {\n        return balance;\n    }\n}\npublic class Solution {\n    public static void main(String[] args) {\n        BankAccount acc = new BankAccount();\n        acc.deposit(100);\n        System.out.println(\"Balance: \" + acc.getBalance());\n    }\n}",
      "publicTestCases": [
        {
          "description": "Deposits 100",
          "expected": "Balance: 100"
        }
      ]
    }
  },
  {
    "day": 17,
    "title": "Constructors & The `this` Keyword — Initializing Object State",
    "overviewMetaphor": "A Constructor is like a birth certificate filled out at the moment a baby is born: it sets the initial name and date so the baby never exists in an uninitialized, blank state.",
    "blocks": [
      {
        "id": "java-d17-b1-why-constructors",
        "day": 17,
        "blockNumber": 1,
        "title": "Why Constructors? (Instant Initialization)",
        "conceptBudget": {
          "primaryConcept": "Constructors",
          "supportingTerms": [
            "Initialization",
            "No Return Type"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d16-b1-blueprint",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Factory Birth Certificate",
            "simpleExplanation": "Instead of creating a blank car and then setting car.color and car.doors line by line, a constructor lets you create the car fully configured in one step: new Car(\"Red\", 4)."
          },
          {
            "type": "runnable_code",
            "filename": "ConstructorIntro.java",
            "initialCode": "class Device {\n    String name;\n    public Device(String name) {\n        this.name = name;\n    }\n}\npublic class ConstructorIntro {\n    public static void main(String[] args) {\n        Device d = new Device(\"Phone\");\n        System.out.println(\"Initialized Device: \" + d.name);\n    }\n}",
            "expectedOutput": "Initialized Device: Phone",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is a key syntactic requirement of a Java constructor?",
          "options": [
            "It MUST have the EXACT same name as the class and has NO return type (not even void)",
            "It must be named initialize() and return int",
            "It must be private"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_CONSTRUCTOR_NAME_MISMATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_CONSTRUCTOR_NAME_MISMATCH",
              "errorExplanation": "Constructors must match the class name exactly and have no return type.",
              "recoveryPath": {
                "simplerExplanation": "Constructor name = Class name. No return type.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d17-b2-this-keyword",
        "day": 17,
        "blockNumber": 2,
        "title": "The `this` Keyword (Disambiguation)",
        "conceptBudget": {
          "primaryConcept": "this Keyword",
          "supportingTerms": [
            "Current Instance",
            "Shadowing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d17-b1-why-constructors",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "class User {\n    String name;\n    public User(String name) {\n        this.name = name; // this.name is the object field; name is the parameter\n    }\n}",
            "lineNotes": {
              "4": "this.name refers to the instance field belonging to the object; name refers to the incoming parameter."
            }
          },
          {
            "type": "runnable_code",
            "filename": "UserDemo.java",
            "initialCode": "class User {\n    String name;\n    public User(String name) {\n        this.name = name;\n    }\n}\npublic class UserDemo {\n    public static void main(String[] args) {\n        User u = new User(\"Alice\");\n        System.out.println(\"User: \" + u.name);\n    }\n}",
            "expectedOutput": "User: Alice",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "In this.name = name;, what does this.name refer to?",
          "options": [
            "The instance variable (field) belonging to the object currently being constructed",
            "The local parameter passed into the method",
            "A global system setting"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_VARIABLE_REASSIGNMENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_VARIABLE_REASSIGNMENT",
              "errorExplanation": "this refers to the current object instance.",
              "recoveryPath": {
                "simplerExplanation": "this.name = my object field. name = parameter.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d17-b3-default-constructors",
        "day": 17,
        "blockNumber": 3,
        "title": "Default vs Custom Constructors",
        "conceptBudget": {
          "primaryConcept": "Default Constructor Mechanics",
          "supportingTerms": [
            "No-Arg Constructor",
            "Compiler Insertion"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d17-b2-this-keyword",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Automatic Starter Key",
            "simpleExplanation": "If you write zero constructors, Java gives you a hidden blank constructor for free: new User(). But the second you write a custom constructor like User(String name), the free blank one disappears!"
          },
          {
            "type": "runnable_code",
            "filename": "DefaultConstructorDemo.java",
            "initialCode": "class Light {\n    boolean isOn = false;\n    // Implicit default constructor Light() is used\n}\npublic class DefaultConstructorDemo {\n    public static void main(String[] args) {\n        Light l = new Light();\n        System.out.println(\"Default light state: \" + l.isOn);\n    }\n}",
            "expectedOutput": "Default light state: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens to the default no-argument constructor when you define a custom constructor with parameters?",
          "options": [
            "Java no longer provides the automatic default constructor; you must declare it explicitly if you still want it",
            "Java keeps both automatically",
            "Java throws an error"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_CONSTRUCTOR_NAME_MISMATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_CONSTRUCTOR_NAME_MISMATCH",
              "errorExplanation": "Defining any custom constructor removes the implicit default constructor.",
              "recoveryPath": {
                "simplerExplanation": "Writing your own constructor disables the free default one.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d17-b4-overloaded-constructors",
        "day": 17,
        "blockNumber": 4,
        "title": "Constructor Overloading (Multiple Options)",
        "conceptBudget": {
          "primaryConcept": "Constructor Overloading",
          "supportingTerms": [
            "Multiple Ways to Build",
            "Constructor Chaining"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d17-b3-default-constructors",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ProductDemo.java",
            "initialCode": "class Product {\n    String name;\n    double price;\n    public Product(String name) {\n        this(name, 0.0); // Chains to 2-arg constructor\n    }\n    public Product(String name, double price) {\n        this.name = name;\n        this.price = price;\n    }\n}\npublic class ProductDemo {\n    public static void main(String[] args) {\n        Product p = new Product(\"Book\", 19.99);\n        System.out.println(\"Product: \" + p.name + \" ($\" + p.price + \")\");\n    }\n}",
            "expectedOutput": "Product: Book ($19.99)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In ProductDemo above, what is printed for Product p = new Product(\"Book\", 19.99)?",
          "expectedStringOutput": "Product: Book ($19.99)",
          "acceptableAnswers": [
            "Product: Book ($19.99)",
            "Book ($19.99)"
          ],
          "primaryMisconceptionId": "MC_JAVA_CONSTRUCTOR_OVERLOADING",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_CONSTRUCTOR_OVERLOADING",
              "errorExplanation": "p.name is \"Book\" and p.price is 19.99.",
              "recoveryPath": {
                "simplerExplanation": "Prints \"Product: Book ($19.99)\".",
                "guidedFixPrompt": "Type Product: Book ($19.99)"
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 17 Capstone Exam: Book Constructor",
      "instruction": "Create class Book with fields title and pages, a constructor Book(String title, int pages), and print Book details.",
      "scaffoldLevel": 2,
      "starterJavaCode": "class Book {\n    String title;\n    int pages;\n    public Book(String title, int pages) {\n        this.title = title;\n        this.pages = pages;\n    }\n}\npublic class Solution {\n    public static void main(String[] args) {\n        Book b = new Book(\"Java Basics\", 200);\n        System.out.println(\"Book: \" + b.title + \" | Pages: \" + b.pages);\n    }\n}",
      "publicTestCases": [
        {
          "description": "Constructs Java Basics with 200 pages",
          "expected": "Book: Java Basics | Pages: 200"
        }
      ]
    }
  },
  {
    "day": 18,
    "title": "Encapsulation & Data Hiding — Getters, Setters & Private Fields",
    "overviewMetaphor": "Encapsulation is like a Bank ATM machine: you cannot reach your arm inside the physical vault to grab cash directly (private); you must use the verified keypad buttons (public deposit/withdraw methods) that check your PIN and balance.",
    "blocks": [
      {
        "id": "java-d18-b1-danger-public-fields",
        "day": 18,
        "blockNumber": 1,
        "title": "The Danger of Public Fields",
        "conceptBudget": {
          "primaryConcept": "Data Corruption Risk",
          "supportingTerms": [
            "Uncontrolled Mutation",
            "Public Fields"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d16-b1-blueprint",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Unlocked Cash Register on the Sidewalk",
            "simpleExplanation": "If you make bank account balance public (public int balance;), any rogue code can write account.balance = -999999; and corrupt your entire bank system."
          },
          {
            "type": "runnable_code",
            "filename": "PublicDangerDemo.java",
            "initialCode": "class BadVault {\n    public int cash = 1000;\n}\npublic class PublicDangerDemo {\n    public static void main(String[] args) {\n        BadVault v = new BadVault();\n        v.cash = -9999; // Corrupted easily!\n        System.out.println(\"Corrupted cash: \" + v.cash);\n    }\n}",
            "expectedOutput": "Corrupted cash: -9999",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should class fields generally NOT be declared public?",
          "options": [
            "Because any outside code can directly modify and corrupt the internal state without validation",
            "Because public variables take double the memory",
            "Because Java only allows 2 public variables"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_DIRECT_PRIVATE_ACCESS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_DIRECT_PRIVATE_ACCESS",
              "errorExplanation": "Public fields allow uncontrolled external mutation bypassing business rules.",
              "recoveryPath": {
                "simplerExplanation": "Public fields let anyone break your rules.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d18-b2-private-modifier",
        "day": 18,
        "blockNumber": 2,
        "title": "The private Modifier (The Locked Vault)",
        "conceptBudget": {
          "primaryConcept": "private Modifier",
          "supportingTerms": [
            "Access Control",
            "Data Hiding"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d18-b1-danger-public-fields",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "class Account {\n    private double balance; // 🔒 Locked! Invisible to outside classes\n}",
            "lineNotes": {
              "2": "private means only methods inside class Account can read or modify balance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "PrivateVaultDemo.java",
            "initialCode": "class SafeVault {\n    private int cash = 500;\n    public int getCash() { return cash; }\n}\npublic class PrivateVaultDemo {\n    public static void main(String[] args) {\n        SafeVault v = new SafeVault();\n        System.out.println(\"Protected cash read via getter: $\" + v.getCash());\n    }\n}",
            "expectedOutput": "Protected cash read via getter: $500",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if an external class tries to access a private field directly via acc.balance?",
          "options": [
            "The Java compiler halts with a compilation error: balance has private access",
            "The value 0 is returned silently",
            "The variable becomes public automatically"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_DIRECT_PRIVATE_ACCESS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_DIRECT_PRIVATE_ACCESS",
              "errorExplanation": "private members are inaccessible outside their declaring class.",
              "recoveryPath": {
                "simplerExplanation": "private prevents outside code from compiling.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d18-b3-getters-setters",
        "day": 18,
        "blockNumber": 3,
        "title": "Getters & Validation Setters",
        "conceptBudget": {
          "primaryConcept": "Encapsulated Accessors",
          "supportingTerms": [
            "Getter",
            "Setter Validation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d18-b2-private-modifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "SecureAccountDemo.java",
            "initialCode": "class SecureAccount {\n    private double balance;\n    public double getBalance() { return balance; }\n    public void deposit(double amount) {\n        if (amount > 0) {\n            balance += amount;\n        }\n    }\n}\npublic class SecureAccountDemo {\n    public static void main(String[] args) {\n        SecureAccount acc = new SecureAccount();\n        acc.deposit(100);\n        acc.deposit(-50); // Ignored by validation guard!\n        System.out.println(\"Balance: \" + acc.getBalance());\n    }\n}",
            "expectedOutput": "Balance: 100.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In SecureAccountDemo, what is the final balance after acc.deposit(100) and acc.deposit(-50)?",
          "expectedStringOutput": "Balance: 100.0",
          "acceptableAnswers": [
            "Balance: 100.0",
            "100.0",
            "100"
          ],
          "primaryMisconceptionId": "MC_JAVA_DIRECT_PRIVATE_ACCESS",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_JAVA_DIRECT_PRIVATE_ACCESS",
              "errorExplanation": "amount > 0 rejects negative deposits, leaving balance at 100.0.",
              "recoveryPath": {
                "simplerExplanation": "-50 is blocked by the if (amount > 0) guard.",
                "guidedFixPrompt": "Type Balance: 100.0"
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 18 Capstone Exam: Encapsulated Account",
      "instruction": "Create class SecureAccount with private double balance, getBalance(), and deposit(double amt) rejecting <= 0 values.",
      "scaffoldLevel": 2,
      "starterJavaCode": "class SecureAccount {\n    private double balance = 0;\n    public double getBalance() { return balance; }\n    public void deposit(double amt) {\n        if (amt > 0) balance += amt;\n    }\n}\npublic class Solution {\n    public static void main(String[] args) {\n        SecureAccount acc = new SecureAccount();\n        acc.deposit(50.0);\n        System.out.println(\"Balance: \" + acc.getBalance());\n    }\n}",
      "publicTestCases": [
        {
          "description": "Balance 50.0",
          "expected": "Balance: 50.0"
        }
      ]
    }
  },
  {
    "day": 19,
    "title": "Inheritance & Subclassing — Reusing Class Hierarchies",
    "overviewMetaphor": "Inheritance is like genetic traits passed from Parent to Child: a Dog inherits generic Animal traits (breathing, eating) and adds specific traits (barking).",
    "blocks": [
      {
        "id": "java-d19-b1-why-inheritance",
        "day": 19,
        "blockNumber": 1,
        "title": "Why Inheritance? (The Parent-Child Hierarchy)",
        "conceptBudget": {
          "primaryConcept": "Inheritance Concept",
          "supportingTerms": [
            "Superclass (Parent)",
            "Subclass (Child)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d16-b1-blueprint",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Smartphone Family",
            "simpleExplanation": "A BasicPhone can make phone calls. A SmartPhone inherits makeCall() from BasicPhone and adds browseWeb() and takePhoto(). It does not reinvent calling from scratch."
          },
          {
            "type": "runnable_code",
            "filename": "InheritanceConcept.java",
            "initialCode": "class Phone {\n    public void call() { System.out.println(\"Making phone call...\"); }\n}\nclass SmartPhone extends Phone {\n    public void browse() { System.out.println(\"Browsing web...\"); }\n}\npublic class InheritanceConcept {\n    public static void main(String[] args) {\n        SmartPhone sp = new SmartPhone();\n        sp.call();   // Inherited\n        sp.browse(); // Added\n    }\n}",
            "expectedOutput": "Making phone call...\nBrowsing web...",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary benefit of class inheritance in Java?",
          "options": [
            "Subclasses automatically inherit fields and methods from parent classes, avoiding code duplication",
            "Subclasses delete the parent class",
            "Inheritance stops programs from using RAM"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_INHERITANCE_CODE_REUSE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_INHERITANCE_CODE_REUSE",
              "errorExplanation": "Inheritance allows code reuse across class hierarchies.",
              "recoveryPath": {
                "simplerExplanation": "Child classes inherit all parent capabilities.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d19-b2-extends-keyword",
        "day": 19,
        "blockNumber": 2,
        "title": "The `extends` Keyword",
        "conceptBudget": {
          "primaryConcept": "extends Keyword",
          "supportingTerms": [
            "Subclassing",
            "Inherited Methods"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d19-b1-why-inheritance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "class Animal {\n    public void eat() { System.out.println(\"Eating...\"); }\n}\nclass Dog extends Animal {\n    public void bark() { System.out.println(\"Woof!\"); }\n}",
            "lineNotes": {
              "4": "class Dog extends Animal establishes Dog as a subclass of Animal. Dog has BOTH eat() and bark()."
            }
          },
          {
            "type": "runnable_code",
            "filename": "AnimalDemo.java",
            "initialCode": "class Animal {\n    public void eat() { System.out.println(\"Eating...\"); }\n}\nclass Dog extends Animal {\n    public void bark() { System.out.println(\"Woof!\"); }\n}\npublic class AnimalDemo {\n    public static void main(String[] args) {\n        Dog d = new Dog();\n        d.eat();\n        d.bark();\n    }\n}",
            "expectedOutput": "Eating...\nWoof!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which keyword is used in Java to inherit from a parent class?",
          "options": [
            "extends",
            "inherits",
            "implements"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_EXTENDS_KEYWORD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_EXTENDS_KEYWORD",
              "errorExplanation": "Java uses extends for class inheritance.",
              "recoveryPath": {
                "simplerExplanation": "Class Child extends Parent.",
                "guidedFixPrompt": "Select extends."
              }
            }
          }
        }
      },
      {
        "id": "java-d19-b3-super-constructor",
        "day": 19,
        "blockNumber": 3,
        "title": "The `super` Keyword (Calling Parent Constructor)",
        "conceptBudget": {
          "primaryConcept": "super() Chaining",
          "supportingTerms": [
            "Parent Initialization",
            "First Line Rule"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d19-b2-extends-keyword",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Building the First Floor Before the Attic",
            "simpleExplanation": "Before a Child object can initialize its own fields, the Parent foundation must be built first using super(...)."
          },
          {
            "type": "syntax_anatomy",
            "codeSnippet": "class Employee extends Person {\n    double salary;\n    public Employee(String name, double salary) {\n        super(name); // Must be first line in constructor!\n        this.salary = salary;\n    }\n}",
            "lineNotes": {
              "4": "super(name) calls Person(name) to initialize the inherited name field."
            }
          },
          {
            "type": "runnable_code",
            "filename": "SuperConstructorDemo.java",
            "initialCode": "class Person {\n    String name;\n    public Person(String name) { this.name = name; }\n}\nclass Student extends Person {\n    int grade;\n    public Student(String name, int grade) {\n        super(name); // Call parent constructor\n        this.grade = grade;\n    }\n}\npublic class SuperConstructorDemo {\n    public static void main(String[] args) {\n        Student s = new Student(\"Emily\", 10);\n        System.out.println(\"Student: \" + s.name + \", Grade: \" + s.grade);\n    }\n}",
            "expectedOutput": "Student: Emily, Grade: 10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Where must super(...) be called inside a subclass constructor?",
          "options": [
            "On the very first line of the subclass constructor body",
            "At the very end of the constructor",
            "Anywhere outside the class"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_CONSTRUCTOR_NAME_MISMATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_CONSTRUCTOR_NAME_MISMATCH",
              "errorExplanation": "Java requires super() to be the first statement in a constructor.",
              "recoveryPath": {
                "simplerExplanation": "Parent must initialize first on Line 1: super().",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 19 Capstone Exam: Vehicle & Car Inheritance",
      "instruction": "Create Vehicle with brand and Car extends Vehicle adding model in Solution.",
      "scaffoldLevel": 2,
      "starterJavaCode": "class Vehicle {\n    String brand;\n    public Vehicle(String brand) { this.brand = brand; }\n}\nclass Car extends Vehicle {\n    String model;\n    public Car(String brand, String model) {\n        super(brand);\n        this.model = model;\n    }\n}\npublic class Solution {\n    public static void main(String[] args) {\n        Car c = new Car(\"Toyota\", \"Camry\");\n        System.out.println(c.brand + \" \" + c.model);\n    }\n}",
      "publicTestCases": [
        {
          "description": "Toyota Camry",
          "expected": "Toyota Camry"
        }
      ]
    }
  },
  {
    "day": 20,
    "title": "Polymorphism & Dynamic Method Dispatch",
    "overviewMetaphor": "Polymorphism means \"many shapes\" (like a universal Play button): whether you press Play on a CD player, DVD player, or Streaming app, they all respond to play() in their own specific way.",
    "blocks": [
      {
        "id": "java-d20-b1-what-is-polymorphism",
        "day": 20,
        "blockNumber": 1,
        "title": "What is Polymorphism? (Many Shapes)",
        "conceptBudget": {
          "primaryConcept": "Polymorphism Concept",
          "supportingTerms": [
            "Parent Reference",
            "Child Instance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d19-b2-extends-keyword",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Universal Remote Play Button",
            "simpleExplanation": "A parent reference Animal a can hold a Dog, a Cat, or a Bird. When you call a.makeSound(), Java dynamically executes the sound of the real animal in memory."
          },
          {
            "type": "runnable_code",
            "filename": "PolyIntro.java",
            "initialCode": "class Speaker {\n    public void speak() { System.out.println(\"Generic sound\"); }\n}\nclass Radio extends Speaker {\n    public void speak() { System.out.println(\"Playing music stream\"); }\n}\npublic class PolyIntro {\n    public static void main(String[] args) {\n        Speaker s = new Radio();\n        s.speak();\n    }\n}",
            "expectedOutput": "Playing music stream",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can a parent class variable hold a reference to a child subclass object in Java?",
          "options": [
            "Yes (e.g. Animal a = new Dog(); is completely valid polymorphism)",
            "No, types must always match identically on both sides",
            "Only if the class is static"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_POLYMORPHISM_PARENT_REF",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_POLYMORPHISM_PARENT_REF",
              "errorExplanation": "Subclasses are substitutable for their superclasses (Liskov principle).",
              "recoveryPath": {
                "simplerExplanation": "A Dog IS AN Animal, so Animal a = new Dog() is valid.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d20-b2-override-annotation",
        "day": 20,
        "blockNumber": 2,
        "title": "The `@Override` Annotation & Dynamic Dispatch",
        "conceptBudget": {
          "primaryConcept": "@Override Annotation",
          "supportingTerms": [
            "Dynamic Dispatch",
            "Runtime Polymorphism"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d20-b1-what-is-polymorphism",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "PolyDemo.java",
            "initialCode": "class Shape {\n    public void draw() { System.out.println(\"Drawing shape\"); }\n}\nclass Circle extends Shape {\n    @Override\n    public void draw() { System.out.println(\"Drawing circle\"); }\n}\npublic class PolyDemo {\n    public static void main(String[] args) {\n        Shape s = new Circle();\n        s.draw(); // Dynamic dispatch calls Circle.draw()!\n    }\n}",
            "expectedOutput": "Drawing circle",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In PolyDemo above, what is printed when s.draw() is called on Shape s = new Circle()?",
          "expectedStringOutput": "Drawing circle",
          "acceptableAnswers": [
            "Drawing circle",
            "drawing circle"
          ],
          "primaryMisconceptionId": "MC_JAVA_DYNAMIC_METHOD_DISPATCH",
          "diagnosisMap": {
            "Drawing shape": {
              "misconceptionId": "MC_JAVA_DYNAMIC_METHOD_DISPATCH",
              "errorExplanation": "Java uses runtime dynamic dispatch: it executes the overridden method of the actual object in memory (Circle).",
              "recoveryPath": {
                "simplerExplanation": "The real object is a Circle, so Circle.draw() runs.",
                "guidedFixPrompt": "Type Drawing circle"
              }
            }
          }
        }
      },
      {
        "id": "java-d20-b3-polymorphic-collections",
        "day": 20,
        "blockNumber": 3,
        "title": "Polymorphic Collections (Arrays of Parent Type)",
        "conceptBudget": {
          "primaryConcept": "Polymorphic Array Processing",
          "supportingTerms": [
            "Heterogeneous Collection",
            "Uniform Invocation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d20-b2-override-annotation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "Shape[] shapes = { new Circle(), new Rectangle() };\nfor (Shape s : shapes) {\n    s.draw(); // Each shape draws itself uniquely\n}",
            "lineNotes": {
              "1": "An array of type Shape can hold any subclass of Shape."
            }
          },
          {
            "type": "runnable_code",
            "filename": "PolyCollectionDemo.java",
            "initialCode": "class Animal { public void sound() { System.out.println(\"Noise\"); } }\nclass Cat extends Animal { public void sound() { System.out.println(\"Meow\"); } }\nclass Dog extends Animal { public void sound() { System.out.println(\"Woof\"); } }\npublic class PolyCollectionDemo {\n    public static void main(String[] args) {\n        Animal[] zoo = { new Cat(), new Dog() };\n        for (Animal a : zoo) {\n            a.sound();\n        }\n    }\n}",
            "expectedOutput": "Meow\nWoof",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why are polymorphic collections so powerful in enterprise software?",
          "options": [
            "You can iterate through a list of diverse objects and invoke common methods without needing if-else type checks",
            "They bypass memory bounds",
            "They make all code run on GPU"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_POLYMORPHIC_ARRAY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_POLYMORPHIC_ARRAY",
              "errorExplanation": "Polymorphism allows uniform processing of heterogeneous object types.",
              "recoveryPath": {
                "simplerExplanation": "Treat all items as their shared parent and let dynamic dispatch do the work.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 20 Capstone Exam: Polymorphic Shapes",
      "instruction": "Create Shape with area() returning 0.0, and Square extends Shape with side 4 returning 16.0.",
      "scaffoldLevel": 2,
      "starterJavaCode": "class Shape {\n    public double area() { return 0.0; }\n}\nclass Square extends Shape {\n    double side;\n    public Square(double s) { this.side = s; }\n    @Override\n    public double area() { return side * side; }\n}\npublic class Solution {\n    public static void main(String[] args) {\n        Shape s = new Square(4.0);\n        System.out.println(\"Area: \" + s.area());\n    }\n}",
      "publicTestCases": [
        {
          "description": "Square area 16.0",
          "expected": "Area: 16.0"
        }
      ]
    }
  },
  {
    "day": 21,
    "title": "Interfaces & ⭐ MILESTONE 4: Enterprise Payment Gateway Interface",
    "overviewMetaphor": "Milestone 4 — Enterprise Payment Gateway Interface: An interface is like a standard 3-prong electrical wall outlet: the outlet guarantees a standard contract (120V power), regardless of whether you plug in a lamp, a toaster, or a laptop.",
    "blocks": [
      {
        "id": "java-d21-b1-what-is-interface",
        "day": 21,
        "blockNumber": 1,
        "title": "What is an Interface? (The Pure Contract)",
        "conceptBudget": {
          "primaryConcept": "Interface Definition",
          "supportingTerms": [
            "Contract",
            "Method Signature Only"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d20-b1-what-is-polymorphism",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The 3-Prong Wall Outlet",
            "simpleExplanation": "An interface specifies what methods a class MUST provide, but provides zero implementation code itself. It is 100% contract."
          },
          {
            "type": "syntax_anatomy",
            "codeSnippet": "interface PaymentMethod {\n    boolean processPayment(double amount);\n}",
            "lineNotes": {
              "1": "interface keyword defines the contract.",
              "2": "processPayment has no curly braces {} body—only a signature ending in semicolon ;."
            }
          },
          {
            "type": "runnable_code",
            "filename": "InterfaceConceptDemo.java",
            "initialCode": "interface Printable {\n    void print();\n}\nclass Document implements Printable {\n    public void print() { System.out.println(\"Printing Document content\"); }\n}\npublic class InterfaceConceptDemo {\n    public static void main(String[] args) {\n        Printable p = new Document();\n        p.print();\n    }\n}",
            "expectedOutput": "Printing Document content",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can you directly instantiate an interface in Java using new PaymentMethod()?",
          "options": [
            "No, interfaces cannot be instantiated directly because they contain no method bodies",
            "Yes, with default values",
            "Only if you have 1 method"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_INTERFACE_INSTANTIATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_INTERFACE_INSTANTIATION",
              "errorExplanation": "Interfaces are abstract contracts that must be implemented by concrete classes.",
              "recoveryPath": {
                "simplerExplanation": "You cannot make an instance of a contract. You instantiate a class that implements it.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d21-b2-implements-keyword",
        "day": 21,
        "blockNumber": 2,
        "title": "The `implements` Keyword",
        "conceptBudget": {
          "primaryConcept": "implements Keyword",
          "supportingTerms": [
            "Contract Fulfillment",
            "Concrete Implementation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d21-b1-what-is-interface",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "PaymentDemo.java",
            "initialCode": "interface PaymentMethod {\n    boolean processPayment(double amount);\n}\nclass CreditCard implements PaymentMethod {\n    public boolean processPayment(double amount) {\n        System.out.println(\"Processing credit card: $\" + amount);\n        return true;\n    }\n}\npublic class PaymentDemo {\n    public static void main(String[] args) {\n        PaymentMethod pm = new CreditCard();\n        pm.processPayment(50.0);\n    }\n}",
            "expectedOutput": "Processing credit card: $50.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Which keyword connects a concrete Java class to an interface contract?",
          "options": [
            "implements",
            "extends",
            "uses"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_INTERFACE_INSTANTIATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_INTERFACE_INSTANTIATION",
              "errorExplanation": "Classes implement interfaces using the implements keyword.",
              "recoveryPath": {
                "simplerExplanation": "class Name implements Interface.",
                "guidedFixPrompt": "Select implements."
              }
            }
          }
        }
      },
      {
        "id": "java-d21-b3-milestone-4",
        "day": 21,
        "blockNumber": 3,
        "title": "⭐ MILESTONE 4: Enterprise Payment Gateway Interface",
        "conceptBudget": {
          "primaryConcept": "Decoupled Architecture",
          "supportingTerms": [
            "Interface Decoupling",
            "Pluggable Providers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d21-b2-implements-keyword",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Universal Payment Gateway",
            "simpleExplanation": "Your CheckoutEngine accepts any PaymentMethod. Today you pass CreditCard; tomorrow you pass PayPal without changing a single line of checkout code."
          },
          {
            "type": "runnable_code",
            "filename": "GatewayDemo.java",
            "initialCode": "interface PaymentProcessor {\n    boolean pay(double amount);\n}\nclass PayPal implements PaymentProcessor {\n    public boolean pay(double amount) {\n        return amount > 0;\n    }\n}\npublic class GatewayDemo {\n    public static boolean executeCheckout(PaymentProcessor p, double amount) {\n        return p.pay(amount);\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Payment Success: \" + executeCheckout(new PayPal(), 75.0));\n    }\n}",
            "expectedOutput": "Payment Success: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In GatewayDemo, what is output for executeCheckout(new PayPal(), 75.0)?",
          "expectedStringOutput": "Payment Success: true",
          "acceptableAnswers": [
            "Payment Success: true",
            "true"
          ],
          "primaryMisconceptionId": "MC_JAVA_INTERFACE_DECOUPLING",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_INTERFACE_DECOUPLING",
              "errorExplanation": "75.0 > 0 is true, so pay returns true.",
              "recoveryPath": {
                "simplerExplanation": "PayPal confirms valid amount > 0.",
                "guidedFixPrompt": "Type Payment Success: true"
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 21 Milestone 4 Challenge: Enterprise Payment Gateway Interface",
      "instruction": "Create interface PaymentProcessor with boolean pay(double amt), and class PayPal implements PaymentProcessor returning amt > 0 in Solution.",
      "scaffoldLevel": 2,
      "starterJavaCode": "interface PaymentProcessor {\n    boolean pay(double amt);\n}\nclass PayPal implements PaymentProcessor {\n    public boolean pay(double amt) {\n        return amt > 0;\n    }\n}\npublic class Solution {\n    public static void main(String[] args) {\n        PaymentProcessor pp = new PayPal();\n        System.out.println(\"Paid: \" + pp.pay(50.0));\n    }\n}",
      "publicTestCases": [
        {
          "description": "Paid: true",
          "expected": "Paid: true"
        }
      ]
    }
  },
  {
    "day": 22,
    "title": "Static State vs Instance State — Shared Class Memory",
    "overviewMetaphor": "Instance variables are like student personal notebooks (each student has their own); static variables are like the shared classroom chalkboard on the front wall (everyone reads and writes to the exact same board).",
    "blocks": [
      {
        "id": "java-d22-b1-chalkboard-analogy",
        "day": 22,
        "blockNumber": 1,
        "title": "The Classroom Chalkboard (Static Memory)",
        "conceptBudget": {
          "primaryConcept": "static Keyword",
          "supportingTerms": [
            "Class-Level Storage",
            "Shared State"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d16-b4-multiple-instances",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Classroom Chalkboard",
            "simpleExplanation": "If Student A writes on the front chalkboard (static int studentCount), Student B and Student C immediately see the updated count because only ONE chalkboard exists for the entire class."
          },
          {
            "type": "runnable_code",
            "filename": "CounterDemo.java",
            "initialCode": "class Counter {\n    static int totalCount = 0;\n    int myCount = 0;\n    public void increment() {\n        totalCount++;\n        myCount++;\n    }\n}\npublic class CounterDemo {\n    public static void main(String[] args) {\n        Counter c1 = new Counter();\n        Counter c2 = new Counter();\n        c1.increment();\n        c2.increment();\n        System.out.println(\"Total: \" + Counter.totalCount + \", c1: \" + c1.myCount + \", c2: \" + c2.myCount);\n    }\n}",
            "expectedOutput": "Total: 2, c1: 1, c2: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How many copies of a static variable exist in memory regardless of how many objects are instantiated?",
          "options": [
            "Exactly ONE shared copy per class",
            "One copy per object instance",
            "Zero copies until main exits"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_STATIC_ON_INSTANCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_STATIC_ON_INSTANCE",
              "errorExplanation": "static variables belong to the class itself and exist as a single shared copy.",
              "recoveryPath": {
                "simplerExplanation": "static = 1 shared copy on the classroom wall.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d22-b2-static-methods",
        "day": 22,
        "blockNumber": 2,
        "title": "Static Utility Methods (Math.max, Helper Functions)",
        "conceptBudget": {
          "primaryConcept": "static Methods",
          "supportingTerms": [
            "No Instance Needed",
            "Utility Functions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d22-b1-chalkboard-analogy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "class MathUtils {\n    public static int square(int n) {\n        return n * n;\n    }\n}\n// Call directly on Class without new:\nint res = MathUtils.square(5);",
            "lineNotes": {
              "2": "static methods can be called directly using ClassName.method() without writing new MathUtils()."
            }
          },
          {
            "type": "runnable_code",
            "filename": "StaticUtilsDemo.java",
            "initialCode": "class MathHelper {\n    public static int cube(int n) { return n * n * n; }\n}\npublic class StaticUtilsDemo {\n    public static void main(String[] args) {\n        System.out.println(\"Cube of 3: \" + MathHelper.cube(3));\n    }\n}",
            "expectedOutput": "Cube of 3: 27",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why can you call Math.abs(-10) without writing Math m = new Math()?",
          "options": [
            "Because abs() is a static utility method attached directly to the Math class",
            "Because Java creates a hidden instance automatically in the background",
            "Because negative numbers are special"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_STATIC_ON_INSTANCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_STATIC_ON_INSTANCE",
              "errorExplanation": "static methods are invoked directly on the class identifier.",
              "recoveryPath": {
                "simplerExplanation": "static methods do not require object instantiation.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d22-b3-static-access-rules",
        "day": 22,
        "blockNumber": 3,
        "title": "The Non-Static Field in Static Context Trap",
        "conceptBudget": {
          "primaryConcept": "Static Context Rules",
          "supportingTerms": [
            "Cannot Access this",
            "Static vs Instance Boundary"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d22-b2-static-methods",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Non-Static Field Access from Static Method",
              "brokenCode": "class App {\n    int count = 0;\n    public static void main(String[] args) {\n        System.out.println(count); // ❌ Error: non-static variable count cannot be referenced from a static context\n    }\n}",
              "fixedCode": "class App {\n    static int count = 0; // Or create App app = new App();\n    public static void main(String[] args) {\n        System.out.println(count); // ✅ Correct!\n    }\n}",
              "errorReason": "A static method runs without an object instance, so it does not know which object count to read.",
              "fixExplanation": "Make count static, or instantiate an App object to read app.count."
            }
          },
          {
            "type": "runnable_code",
            "filename": "StaticBoundaryDemo.java",
            "initialCode": "class Config {\n    static String appVersion = \"5.3.0\";\n    public static void showVersion() {\n        System.out.println(\"Running Version: \" + appVersion);\n    }\n}\npublic class StaticBoundaryDemo {\n    public static void main(String[] args) {\n        Config.showVersion();\n    }\n}",
            "expectedOutput": "Running Version: 5.3.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why can a static method NOT directly read an instance variable (non-static)?",
          "options": [
            "Because a static method runs on the class itself and has no specific object instance (this) to read from",
            "Because variables are deleted in static methods",
            "Because static methods only allow Strings"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_STATIC_ON_INSTANCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_STATIC_ON_INSTANCE",
              "errorExplanation": "Static context has no this reference to resolve instance fields.",
              "recoveryPath": {
                "simplerExplanation": "No object instance = no instance variables available.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 22 Capstone Exam: Static Counter & Utilities",
      "instruction": "Create class Counter with static int totalCount, increment() adding 1 to totalCount, and getCount() in Solution.",
      "scaffoldLevel": 2,
      "starterJavaCode": "class Counter {\n    static int totalCount = 0;\n    public static void increment() { totalCount++; }\n    public static int getCount() { return totalCount; }\n}\npublic class Solution {\n    public static void main(String[] args) {\n        Counter.increment();\n        Counter.increment();\n        System.out.println(\"Count: \" + Counter.getCount());\n    }\n}",
      "publicTestCases": [
        {
          "description": "Count: 2",
          "expected": "Count: 2"
        }
      ]
    }
  },
  {
    "day": 23,
    "title": "Exception Handling — Defensive Programming with try-catch-finally",
    "overviewMetaphor": "A try-catch block is like a trapeze safety net: the gymnast attempts a risky stunt in the try block; if they slip and fall (exception), the catch net catches them safely so the circus show does not crash to a halt.",
    "blocks": [
      {
        "id": "java-d23-b1-why-exceptions",
        "day": 23,
        "blockNumber": 1,
        "title": "Why Programs Crash (Runtime Exceptions)",
        "conceptBudget": {
          "primaryConcept": "Runtime Exceptions",
          "supportingTerms": [
            "Abrupt Termination",
            "Crash Prevention"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d4-b2-mult-div",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Trapeze Safety Net",
            "simpleExplanation": "When code divides by zero (10 / 0) or accesses an invalid array index (arr[99]), Java throws an Exception. Without a safety net, the whole application crashes."
          },
          {
            "type": "runnable_code",
            "filename": "CrashDemo.java",
            "initialCode": "public class CrashDemo {\n    public static void main(String[] args) {\n        System.out.println(\"Handling crash safely with try-catch:\");\n        try {\n            int val = 10 / 0;\n        } catch (ArithmeticException e) {\n            System.out.println(\"Crash intercepted: \" + e.getClass().getSimpleName());\n        }\n    }\n}",
            "expectedOutput": "Handling crash safely with try-catch:\nCrash intercepted: ArithmeticException",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens when an unhandled ArithmeticException occurs during program execution?",
          "options": [
            "The JVM immediately halts program execution and prints a stack trace crash report",
            "The program ignores the error and prints 0",
            "The computer restarts"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_DIVIDE_BY_ZERO",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_DIVIDE_BY_ZERO",
              "errorExplanation": "Unhandled exceptions terminate program execution abruptly.",
              "recoveryPath": {
                "simplerExplanation": "Unhandled exception = instant crash.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d23-b2-try-catch-syntax",
        "day": 23,
        "blockNumber": 2,
        "title": "The try-catch Block (Catching Errors)",
        "conceptBudget": {
          "primaryConcept": "try-catch Syntax",
          "supportingTerms": [
            "Risky Code",
            "Catch Block"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d23-b1-why-exceptions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "try {\n    int result = 10 / 0; // Risky code\n} catch (ArithmeticException e) {\n    System.out.println(\"Caught division by zero!\");\n}",
            "lineNotes": {
              "1": "try { } encloses the code that might fail.",
              "3": "catch (ArithmeticException e) intercept the crash and runs recovery logic."
            }
          },
          {
            "type": "runnable_code",
            "filename": "SafeDivide.java",
            "initialCode": "public class SafeDivide {\n    public static int divide(int a, int b) {\n        try {\n            return a / b;\n        } catch (ArithmeticException e) {\n            return -1; // Fallback error code\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Result: \" + divide(10, 0));\n    }\n}",
            "expectedOutput": "Result: -1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does divide(10, 0) return in SafeDivide above?",
          "options": [
            "-1 (The catch block caught ArithmeticException and returned -1)",
            "0",
            "Crashes with an error"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_DIVIDE_BY_ZERO",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_DIVIDE_BY_ZERO",
              "errorExplanation": "10 / 0 triggers ArithmeticException, which is caught and returns -1.",
              "recoveryPath": {
                "simplerExplanation": "The catch block safely handles the crash and returns -1.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d23-b3-finally-block",
        "day": 23,
        "blockNumber": 3,
        "title": "The `finally` Block (Guaranteed Cleanup)",
        "conceptBudget": {
          "primaryConcept": "finally Block",
          "supportingTerms": [
            "Guaranteed Execution",
            "Resource Cleanup"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d23-b2-try-catch-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Locking the Door When Leaving",
            "simpleExplanation": "Whether your trip outside went smoothly or you got rained on, you ALWAYS lock the front door when you leave. The finally block ALWAYS runs, even if errors occurred."
          },
          {
            "type": "runnable_code",
            "filename": "FinallyDemo.java",
            "initialCode": "public class FinallyDemo {\n    public static void main(String[] args) {\n        try {\n            int x = 5 / 1;\n        } catch (Exception e) {\n            System.out.println(\"Error\");\n        } finally {\n            System.out.println(\"Always executed!\");\n        }\n    }\n}",
            "expectedOutput": "Always executed!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Under what circumstances does code in a finally block execute?",
          "options": [
            "ALWAYS, regardless of whether an exception was thrown, caught, or not thrown at all",
            "Only when an error occurs",
            "Only when no errors occur"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_FINALLY_GUARANTEED_RUN",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_FINALLY_GUARANTEED_RUN",
              "errorExplanation": "finally blocks are guaranteed to execute in all control flow paths.",
              "recoveryPath": {
                "simplerExplanation": "finally = ALWAYS runs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 23 Capstone Exam: Safe Division",
      "instruction": "Write safeDivide(int a, int b) in Solution that returns a / b, catching ArithmeticException to return -1.",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static int safeDivide(int a, int b) {\n        try {\n            return a / b;\n        } catch (ArithmeticException e) {\n            return -1;\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Res: \" + safeDivide(10, 0));\n    }\n}",
      "publicTestCases": [
        {
          "description": "Divide by zero returns -1",
          "expected": "Res: -1"
        }
      ]
    }
  },
  {
    "day": 24,
    "title": "Throwing Exceptions & Defensive Programming",
    "overviewMetaphor": "The throw keyword is like a soccer referee whistle: when a player commits an illegal foul (e.g. passing a negative deposit amount), the referee blows the whistle (throw new IllegalArgumentException()) to halt play immediately.",
    "blocks": [
      {
        "id": "java-d24-b1-why-throw",
        "day": 24,
        "blockNumber": 1,
        "title": "Why Throw Exceptions? (The Referee Whistle)",
        "conceptBudget": {
          "primaryConcept": "throw Keyword",
          "supportingTerms": [
            "Validation Guard",
            "Active Enforcement"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d23-b2-try-catch-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Referee Whistle",
            "simpleExplanation": "Instead of quietly corrupting data with a negative price (price = -50), your code blows the whistle with throw new IllegalArgumentException(\"Price cannot be negative\") to stop the violation immediately."
          },
          {
            "type": "runnable_code",
            "filename": "ThrowWhistleDemo.java",
            "initialCode": "public class ThrowWhistleDemo {\n    public static void checkPositive(int n) {\n        if (n <= 0) throw new IllegalArgumentException(\"Number must be positive!\");\n    }\n    public static void main(String[] args) {\n        try {\n            checkPositive(-10);\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"Referee whistle blown: \" + e.getMessage());\n        }\n    }\n}",
            "expectedOutput": "Referee whistle blown: Number must be positive!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should a method throw an IllegalArgumentException when receiving invalid input?",
          "options": [
            "To explicitly halt invalid operations and notify the caller of a rule violation",
            "To automatically fix the number",
            "To speed up calculations"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_THROW_PURPOSE_HALT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_THROW_PURPOSE_HALT",
              "errorExplanation": "Throwing exceptions prevents corrupt state by signaling contract violations.",
              "recoveryPath": {
                "simplerExplanation": "Blow the whistle to stop illegal data from being saved.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d24-b2-throw-syntax",
        "day": 24,
        "blockNumber": 2,
        "title": "The `throw` Syntax with Custom Messages",
        "conceptBudget": {
          "primaryConcept": "throw new Exception",
          "supportingTerms": [
            "Error Message",
            "Instant Halt"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d24-b1-why-throw",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "if (amount <= 0) {\n    throw new IllegalArgumentException(\"Amount must be positive\");\n}",
            "lineNotes": {
              "2": "throw new IllegalArgumentException(...) constructs and throws an exception object."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ValidatorDemo.java",
            "initialCode": "public class ValidatorDemo {\n    public static void validateAge(int age) {\n        if (age < 0) {\n            throw new IllegalArgumentException(\"Age cannot be negative\");\n        }\n    }\n    public static void main(String[] args) {\n        try {\n            validateAge(-5);\n        } catch (IllegalArgumentException e) {\n            System.out.println(\"Caught: \" + e.getMessage());\n        }\n    }\n}",
            "expectedOutput": "Caught: Age cannot be negative",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In ValidatorDemo above, what is printed by e.getMessage()?",
          "expectedStringOutput": "Caught: Age cannot be negative",
          "acceptableAnswers": [
            "Caught: Age cannot be negative",
            "Age cannot be negative"
          ],
          "primaryMisconceptionId": "MC_JAVA_THROW_EXCEPTION_CONSTRUCTOR",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_THROW_EXCEPTION_CONSTRUCTOR",
              "errorExplanation": "e.getMessage() returns the string passed to the exception constructor: \"Age cannot be negative\".",
              "recoveryPath": {
                "simplerExplanation": "Returns the exact error message.",
                "guidedFixPrompt": "Type Caught: Age cannot be negative"
              }
            }
          }
        }
      },
      {
        "id": "java-d24-b3-defensive-guards",
        "day": 24,
        "blockNumber": 3,
        "title": "Defensive Guard Clauses in Enterprise Methods",
        "conceptBudget": {
          "primaryConcept": "Guard Clauses",
          "supportingTerms": [
            "Early Exit",
            "Input Sanitization"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d24-b2-throw-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Defensive Guard Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Method called: deposit(amount)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Guard Check: amount <= 0?",
                  "kind": "decision"
                },
                {
                  "id": "3",
                  "label": "3. True: throw IllegalArgumentException",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. False: balance += amount (Success)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "GuardClauseDemo.java",
            "initialCode": "public class GuardClauseDemo {\n    public static int transfer(int balance, int amount) {\n        if (amount <= 0) throw new IllegalArgumentException(\"Transfer must be > 0\");\n        if (amount > balance) throw new IllegalArgumentException(\"Insufficient funds\");\n        return balance - amount;\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Remaining: $\" + transfer(100, 40));\n    }\n}",
            "expectedOutput": "Remaining: $60",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Where should defensive guard clauses be placed inside a method?",
          "options": [
            "At the very beginning of the method before any business calculations run",
            "At the very end of the method after changes are already saved",
            "Outside the class"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_GUARD_CLAUSE_ORDER",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_GUARD_CLAUSE_ORDER",
              "errorExplanation": "Guard clauses protect the method by validating inputs on Line 1.",
              "recoveryPath": {
                "simplerExplanation": "Check inputs at the door before doing any work.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 24 Capstone Exam: Defensive Deposit Validation",
      "instruction": "Write checkDeposit(double amt) throwing IllegalArgumentException if amt <= 0, else printing \"Deposit Approved\".",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static void checkDeposit(double amt) {\n        if (amt <= 0) throw new IllegalArgumentException(\"Invalid\");\n        System.out.println(\"Deposit Approved\");\n    }\n    public static void main(String[] args) {\n        checkDeposit(50.0);\n    }\n}",
      "publicTestCases": [
        {
          "description": "Valid deposit approved",
          "expected": "Deposit Approved"
        }
      ]
    }
  },
  {
    "day": 25,
    "title": "Dynamic Collections — ArrayList<T> & Resizable Arrays",
    "overviewMetaphor": "An ArrayList is like an expanding accordion folder: standard Java arrays have a fixed size that can never change; an ArrayList automatically expands whenever you add new items and shrinks when you remove them.",
    "blocks": [
      {
        "id": "java-d25-b1-arraylist-concept",
        "day": 25,
        "blockNumber": 1,
        "title": "Why ArrayList? (The Expanding Accordion)",
        "conceptBudget": {
          "primaryConcept": "ArrayList Dynamic Resizing",
          "supportingTerms": [
            "Dynamic Capacity",
            "Auto-Growing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d12-b1-why-arrays",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Accordion Folder",
            "simpleExplanation": "If you create int[] arr = new int[3], it can only hold 3 numbers forever. ArrayList<Integer> list = new ArrayList<>(); can hold 3 numbers, 300 numbers, or 3,000 numbers dynamically."
          },
          {
            "type": "runnable_code",
            "filename": "AccordionListDemo.java",
            "initialCode": "import java.util.ArrayList;\n\npublic class AccordionListDemo {\n    public static void main(String[] args) {\n        ArrayList<Integer> list = new ArrayList<>();\n        list.add(10);\n        list.add(20);\n        list.add(30);\n        System.out.println(\"List auto-expanded to size: \" + list.size());\n    }\n}",
            "expectedOutput": "List auto-expanded to size: 3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the main advantage of ArrayList over a standard Java array?",
          "options": [
            "ArrayList automatically resizes dynamically as elements are added or removed",
            "ArrayList cannot store numbers",
            "ArrayList does not use memory"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS",
              "errorExplanation": "ArrayLists provide dynamic resizing unlike fixed-length arrays.",
              "recoveryPath": {
                "simplerExplanation": "ArrayList grows and shrinks automatically.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d25-b2-crud-operations",
        "day": 25,
        "blockNumber": 2,
        "title": "ArrayList CRUD: add(), get(), and size()",
        "conceptBudget": {
          "primaryConcept": "ArrayList Methods",
          "supportingTerms": [
            "add()",
            "get(i)",
            "size()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d25-b1-arraylist-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "import java.util.ArrayList;\n\nArrayList<String> list = new ArrayList<>();\nlist.add(\"Apple\"); // Append item\nString item = list.get(0); // Read index 0\nint count = list.size(); // Total count",
            "lineNotes": {
              "4": "list.get(0) reads index 0 (NOT list[0]).",
              "5": "list.size() returns element count (NOT list.length)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ListDemo.java",
            "initialCode": "import java.util.ArrayList;\n\npublic class ListDemo {\n    public static void main(String[] args) {\n        ArrayList<String> fruits = new ArrayList<>();\n        fruits.add(\"Apple\");\n        fruits.add(\"Banana\");\n        System.out.println(\"First fruit: \" + fruits.get(0));\n        System.out.println(\"Total: \" + fruits.size());\n    }\n}",
            "expectedOutput": "First fruit: Apple\nTotal: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How do you read the item at index 0 in an ArrayList named list?",
          "options": [
            "list.get(0)",
            "list[0]",
            "list.first()"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS",
              "errorExplanation": "In Java ArrayLists, use the .get(index) method, not square brackets [].",
              "recoveryPath": {
                "simplerExplanation": "Use list.get(0) for ArrayLists.",
                "guidedFixPrompt": "Select list.get(0)."
              }
            }
          }
        }
      },
      {
        "id": "java-d25-b3-modifying-removing",
        "day": 25,
        "blockNumber": 3,
        "title": "Removing & Modifying Elements (Index Shifting)",
        "conceptBudget": {
          "primaryConcept": "ArrayList remove & shift",
          "supportingTerms": [
            "Index Shifting",
            "remove(index)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d25-b2-crud-operations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Line at the Bank Teller",
            "simpleExplanation": "When person 0 finishes and leaves the line (list.remove(0)), everyone behind them steps forward one step. Person 1 is now Person 0!"
          },
          {
            "type": "runnable_code",
            "filename": "RemoveDemo.java",
            "initialCode": "import java.util.ArrayList;\n\npublic class RemoveDemo {\n    public static void main(String[] args) {\n        ArrayList<String> queue = new ArrayList<>();\n        queue.add(\"Alice\");\n        queue.add(\"Bob\");\n        queue.remove(0); // Alice leaves\n        System.out.println(\"New first in line: \" + queue.get(0));\n    }\n}",
            "expectedOutput": "New first in line: Bob",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In RemoveDemo above, who is at index 0 after removing index 0?",
          "expectedStringOutput": "New first in line: Bob",
          "acceptableAnswers": [
            "New first in line: Bob",
            "Bob"
          ],
          "primaryMisconceptionId": "MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS",
          "diagnosisMap": {
            "Alice": {
              "misconceptionId": "MC_JAVA_ARRAYLIST_INDEX_OUT_OF_BOUNDS",
              "errorExplanation": "Alice was removed; Bob shifted to index 0.",
              "recoveryPath": {
                "simplerExplanation": "Bob steps into index 0.",
                "guidedFixPrompt": "Type New first in line: Bob"
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 25 Capstone Exam: Filter Values into ArrayList",
      "instruction": "Write filterAbove(int[] arr, int threshold) returning an ArrayList<Integer> with elements > threshold.",
      "scaffoldLevel": 2,
      "starterJavaCode": "import java.util.ArrayList;\n\npublic class Solution {\n    public static ArrayList<Integer> filterAbove(int[] arr, int limit) {\n        ArrayList<Integer> res = new ArrayList<>();\n        for (int n : arr) {\n            if (n > limit) res.add(n);\n        }\n        return res;\n    }\n    public static void main(String[] args) {\n        int[] nums = { 10, 55, 20, 80 };\n        System.out.println(\"Filtered: \" + filterAbove(nums, 50));\n    }\n}",
      "publicTestCases": [
        {
          "description": "Filtered: [55, 80]",
          "expected": "Filtered: [55, 80]"
        }
      ]
    }
  },
  {
    "day": 26,
    "title": "HashMaps & ⭐ MILESTONE 5: Word Frequency & Inventory Engine",
    "overviewMetaphor": "Milestone 5 — Word Frequency & Inventory Engine: A HashMap is like a Coat Check Room: you hand the attendant your ticket number (Key), and they instantly hand you back your exact winter coat (Value) in O(1) time without searching coat by coat.",
    "blocks": [
      {
        "id": "java-d26-b1-hashmap-concept",
        "day": 26,
        "blockNumber": 1,
        "title": "Why Key-Value? (The Coat Check Ticket)",
        "conceptBudget": {
          "primaryConcept": "HashMap Key-Value Pairing",
          "supportingTerms": [
            "Key (Unique)",
            "Value (Data)",
            "O(1) Lookup"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d25-b1-arraylist-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Coat Check Ticket",
            "simpleExplanation": "Instead of searching through an entire array of names one by one, a HashMap matches a unique Key (e.g. Student ID) directly to a Value (e.g. Grade) in instant O(1) time."
          },
          {
            "type": "runnable_code",
            "filename": "CoatCheckDemo.java",
            "initialCode": "import java.util.HashMap;\n\npublic class CoatCheckDemo {\n    public static void main(String[] args) {\n        HashMap<Integer, String> coatCheck = new HashMap<>();\n        coatCheck.put(101, \"Black Leather Jacket\");\n        System.out.println(\"Ticket 101 retrieves: \" + coatCheck.get(101));\n    }\n}",
            "expectedOutput": "Ticket 101 retrieves: Black Leather Jacket",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary relationship in a Java HashMap<K, V>?",
          "options": [
            "Each unique Key maps directly to an associated Value",
            "All items are stored in numerical index order only",
            "Keys and values must always be integers"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_HASHMAP_NULL_KEY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_HASHMAP_NULL_KEY",
              "errorExplanation": "HashMaps store key-value associations where keys are unique identifiers.",
              "recoveryPath": {
                "simplerExplanation": "Unique Key -> Associated Value.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d26-b2-put-get-operations",
        "day": 26,
        "blockNumber": 2,
        "title": "HashMap Operations: put(), get(), and containsKey()",
        "conceptBudget": {
          "primaryConcept": "HashMap Methods",
          "supportingTerms": [
            "put(k,v)",
            "get(k)",
            "containsKey(k)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d26-b1-hashmap-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "import java.util.HashMap;\n\nHashMap<String, Integer> map = new HashMap<>();\nmap.put(\"Alice\", 95); // Insert pair\nint score = map.get(\"Alice\"); // Retrieve 95\nboolean hasBob = map.containsKey(\"Bob\"); // false",
            "lineNotes": {
              "4": "map.put(key, value) saves the association.",
              "5": "map.get(key) retrieves the value for that key."
            }
          },
          {
            "type": "runnable_code",
            "filename": "GradeMap.java",
            "initialCode": "import java.util.HashMap;\n\npublic class GradeMap {\n    public static void main(String[] args) {\n        HashMap<String, Integer> grades = new HashMap<>();\n        grades.put(\"Alice\", 95);\n        grades.put(\"Bob\", 88);\n        System.out.println(\"Alice score: \" + grades.get(\"Alice\"));\n    }\n}",
            "expectedOutput": "Alice score: 95",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In GradeMap above, what is output for grades.get(\"Alice\")?",
          "expectedStringOutput": "Alice score: 95",
          "acceptableAnswers": [
            "Alice score: 95",
            "95"
          ],
          "primaryMisconceptionId": "MC_JAVA_HASHMAP_NULL_KEY",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_HASHMAP_NULL_KEY",
              "errorExplanation": "grades.get(\"Alice\") returns the mapped value 95.",
              "recoveryPath": {
                "simplerExplanation": "Alice is associated with 95.",
                "guidedFixPrompt": "Type Alice score: 95"
              }
            }
          }
        }
      },
      {
        "id": "java-d26-b3-milestone-5",
        "day": 26,
        "blockNumber": 3,
        "title": "⭐ MILESTONE 5: Word Frequency Counter",
        "conceptBudget": {
          "primaryConcept": "Frequency Counting with getOrDefault",
          "supportingTerms": [
            "map.getOrDefault",
            "Tallying Pattern"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d26-b2-put-get-operations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "WordCounter.java",
            "initialCode": "import java.util.HashMap;\n\npublic class WordCounter {\n    public static void main(String[] args) {\n        String[] words = { \"java\", \"code\", \"java\", \"cool\" };\n        HashMap<String, Integer> counts = new HashMap<>();\n        for (String w : words) {\n            counts.put(w, counts.getOrDefault(w, 0) + 1);\n        }\n        System.out.println(\"Java count: \" + counts.get(\"java\"));\n    }\n}",
            "expectedOutput": "Java count: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In WordCounter above, how many times does \"java\" appear in {\"java\", \"code\", \"java\", \"cool\"}?",
          "expectedStringOutput": "Java count: 2",
          "acceptableAnswers": [
            "Java count: 2",
            "2"
          ],
          "primaryMisconceptionId": "MC_JAVA_HASHMAP_NULL_KEY",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_HASHMAP_NULL_KEY",
              "errorExplanation": "\"java\" appears twice.",
              "recoveryPath": {
                "simplerExplanation": "Count: \"java\" (1), \"java\" (2). Total is 2.",
                "guidedFixPrompt": "Type Java count: 2"
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 26 Milestone 5 Challenge: Word Frequency & Inventory Engine",
      "instruction": "Write countFrequency(String[] words, String target) using HashMap in Solution returning count of target word.",
      "scaffoldLevel": 2,
      "starterJavaCode": "import java.util.HashMap;\n\npublic class Solution {\n    public static int countFrequency(String[] words, String target) {\n        HashMap<String, Integer> map = new HashMap<>();\n        for (String w : words) {\n            map.put(w, map.getOrDefault(w, 0) + 1);\n        }\n        return map.getOrDefault(target, 0);\n    }\n    public static void main(String[] args) {\n        String[] list = { \"apple\", \"banana\", \"apple\", \"cherry\" };\n        System.out.println(\"Count: \" + countFrequency(list, \"apple\"));\n    }\n}",
      "publicTestCases": [
        {
          "description": "Count apple is 2",
          "expected": "Count: 2"
        }
      ]
    }
  },
  {
    "day": 27,
    "title": "Java Generics — Compile-Time Type Safety (<T>)",
    "overviewMetaphor": "Generics are like transparent shipping crates with custom molded inserts: a crate molded for Bicycles (<Bicycle>) guarantees at compile-time that no one can accidentally pack a Microwave inside it.",
    "blocks": [
      {
        "id": "java-d27-b1-why-generics",
        "day": 27,
        "blockNumber": 1,
        "title": "Why Generics? (The Transparent Shipping Crate)",
        "conceptBudget": {
          "primaryConcept": "Generics Type Safety",
          "supportingTerms": [
            "Type Parameter <T>",
            "Compile-Time Check"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d25-b1-arraylist-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Labeled Shipping Crate",
            "simpleExplanation": "Without generics, a Box could hold any random Object, requiring dangerous type casts (String) box.get() that crash at runtime. Generics Box<T> enforce compile-time safety."
          },
          {
            "type": "runnable_code",
            "filename": "GenericsIntroDemo.java",
            "initialCode": "class Storage<T> {\n    T data;\n    public void save(T d) { this.data = d; }\n    public T load() { return data; }\n}\npublic class GenericsIntroDemo {\n    public static void main(String[] args) {\n        Storage<String> s = new Storage<>();\n        s.save(\"Verified Safe\");\n        System.out.println(\"Loaded: \" + s.load());\n    }\n}",
            "expectedOutput": "Loaded: Verified Safe",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary benefit of using Generics (<T>) in Java?",
          "options": [
            "Catching type mismatch errors at compile-time instead of crashing at runtime with ClassCastException",
            "Making variables global",
            "Allowing Java code to bypass memory boundaries"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_GENERICS_TYPE_SAFETY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_GENERICS_TYPE_SAFETY",
              "errorExplanation": "Generics provide strong compile-time type validation.",
              "recoveryPath": {
                "simplerExplanation": "Generics catch bugs before your code even runs.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d27-b2-generic-class-box",
        "day": 27,
        "blockNumber": 2,
        "title": "Creating a Generic Class (`Box<T>`)",
        "conceptBudget": {
          "primaryConcept": "Generic Class Definition",
          "supportingTerms": [
            "Placeholder T",
            "Parametric Type"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d27-b1-why-generics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "class Box<T> {\n    private T item;\n    public void set(T item) { this.item = item; }\n    public T get() { return item; }\n}",
            "lineNotes": {
              "1": "Box<T> declares T as a generic placeholder type that will be replaced when instantiated (e.g. Box<String>)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "GenericBoxDemo.java",
            "initialCode": "class Box<T> {\n    private T item;\n    public void set(T item) { this.item = item; }\n    public T get() { return item; }\n}\npublic class GenericBoxDemo {\n    public static void main(String[] args) {\n        Box<String> strBox = new Box<>();\n        strBox.set(\"Hello Generics!\");\n        System.out.println(\"Box contents: \" + strBox.get());\n    }\n}",
            "expectedOutput": "Box contents: Hello Generics!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In GenericBoxDemo, what is output by strBox.get()?",
          "expectedStringOutput": "Box contents: Hello Generics!",
          "acceptableAnswers": [
            "Box contents: Hello Generics!",
            "Hello Generics!"
          ],
          "primaryMisconceptionId": "MC_JAVA_GENERIC_CLASS_TYPE_PARAM",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_GENERIC_CLASS_TYPE_PARAM",
              "errorExplanation": "strBox.get() returns the string \"Hello Generics!\".",
              "recoveryPath": {
                "simplerExplanation": "Box holds \"Hello Generics!\".",
                "guidedFixPrompt": "Type Box contents: Hello Generics!"
              }
            }
          }
        }
      },
      {
        "id": "java-d27-b3-generic-pair",
        "day": 27,
        "blockNumber": 3,
        "title": "Multi-Type Generics (`Pair<K, V>`)",
        "conceptBudget": {
          "primaryConcept": "Multi-Parameter Generics",
          "supportingTerms": [
            "Pair<K,V>",
            "Two Type Variables"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d27-b2-generic-class-box",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "PairDemo.java",
            "initialCode": "class Pair<K, V> {\n    K key;\n    V value;\n    public Pair(K k, V v) { this.key = k; this.value = v; }\n}\npublic class PairDemo {\n    public static void main(String[] args) {\n        Pair<String, Integer> p = new Pair<>(\"Age\", 25);\n        System.out.println(p.key + \": \" + p.value);\n    }\n}",
            "expectedOutput": "Age: 25",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Can a generic class accept multiple type parameters like Pair<K, V>?",
          "options": [
            "Yes, classes can specify multiple comma-separated type parameters like <K, V>",
            "No, Java only supports 1 generic type per class",
            "Only if both types are identical"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_GENERIC_MULTI_TYPE_PARAMS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_GENERIC_MULTI_TYPE_PARAMS",
              "errorExplanation": "Java supports multiple generic type parameters separated by commas.",
              "recoveryPath": {
                "simplerExplanation": "Pair<K, V> accepts two distinct types.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 27 Capstone Exam: Generic Container Box<T>",
      "instruction": "Create generic class Box<T> with T item, set(T item), and get() returning item in Solution.",
      "scaffoldLevel": 2,
      "starterJavaCode": "class Box<T> {\n    private T item;\n    public void set(T item) { this.item = item; }\n    public T get() { return item; }\n}\npublic class Solution {\n    public static void main(String[] args) {\n        Box<String> b = new Box<>();\n        b.set(\"Secure Data\");\n        System.out.println(\"Contents: \" + b.get());\n    }\n}",
      "publicTestCases": [
        {
          "description": "Contents: Secure Data",
          "expected": "Contents: Secure Data"
        }
      ]
    }
  },
  {
    "day": 28,
    "title": "Multithreading & Concurrency — Parallel Execution",
    "overviewMetaphor": "Concurrency is like having two chefs in a restaurant kitchen: Chef 1 cooks the soup on Stove A while Chef 2 bakes the bread in Oven B at the exact same time. Parallel work gets the meal finished twice as fast!",
    "blocks": [
      {
        "id": "java-d28-b1-why-threads",
        "day": 28,
        "blockNumber": 1,
        "title": "Why Threads? (Two Chefs in the Kitchen)",
        "conceptBudget": {
          "primaryConcept": "Parallel Threads",
          "supportingTerms": [
            "Concurrent Workers",
            "Background Tasks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d21-b1-what-is-interface",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Two Chefs in the Kitchen",
            "simpleExplanation": "Without threads, your app freezes while downloading a large file. With threads, a background worker downloads the file while the main thread keeps the UI smooth and responsive."
          },
          {
            "type": "runnable_code",
            "filename": "ParallelChefsDemo.java",
            "initialCode": "public class ParallelChefsDemo {\n    public static void main(String[] args) {\n        Thread chef1 = new Thread(() -> System.out.println(\"Chef 1: Soup simmering\"));\n        Thread chef2 = new Thread(() -> System.out.println(\"Chef 2: Bread baking\"));\n        chef1.start();\n        chef2.start();\n    }\n}",
            "expectedOutput": "Chef 1: Soup simmering\nChef 2: Bread baking",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do software applications use multithreading?",
          "options": [
            "To perform long-running background tasks in parallel without freezing the user interface",
            "To make the computer use zero memory",
            "To automatically fix syntax bugs"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_THREAD_RUN_VS_START",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_THREAD_RUN_VS_START",
              "errorExplanation": "Threads allow parallel background task execution.",
              "recoveryPath": {
                "simplerExplanation": "Background workers do tasks without freezing the main screen.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d28-b2-runnable-start",
        "day": 28,
        "blockNumber": 2,
        "title": "The Runnable Interface & `.start()` vs `.run()`",
        "conceptBudget": {
          "primaryConcept": "Thread.start() Mechanics",
          "supportingTerms": [
            "Runnable Interface",
            ".start() vs .run()"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d28-b1-why-threads",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "class Task implements Runnable {\n    public void run() {\n        System.out.println(\"Background worker running!\");\n    }\n}\n// Spawning the parallel thread:\nThread t = new Thread(new Task());\nt.start(); // 🚀 Spawns a NEW independent JVM thread!",
            "lineNotes": {
              "7": "t.start() asks the JVM OS scheduler to spawn a brand-new parallel thread. If you accidentally call t.run(), it runs sequentially on the current thread!"
            }
          },
          {
            "type": "runnable_code",
            "filename": "ThreadDemo.java",
            "initialCode": "class Worker implements Runnable {\n    public void run() {\n        System.out.println(\"Worker thread active\");\n    }\n}\npublic class ThreadDemo {\n    public static void main(String[] args) {\n        Thread t = new Thread(new Worker());\n        t.start();\n    }\n}",
            "expectedOutput": "Worker thread active",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if you call t.run() directly instead of t.start()?",
          "options": [
            "It executes sequentially on the main thread like a normal method call without spawning a new background thread",
            "It spawns two threads",
            "It crashes the computer"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_THREAD_RUN_VS_START",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_THREAD_RUN_VS_START",
              "errorExplanation": "t.run() executes on the caller thread. Only t.start() spawns a new thread of execution.",
              "recoveryPath": {
                "simplerExplanation": "Always call .start() to spawn a new parallel worker.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d28-b3-race-conditions",
        "day": 28,
        "blockNumber": 3,
        "title": "Shared State & Race Conditions",
        "conceptBudget": {
          "primaryConcept": "Race Condition Awareness",
          "supportingTerms": [
            "Shared Variable Conflict",
            "Thread Safety"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d28-b2-runnable-start",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "Two People Writing on the Same Chalkboard at the Same Second",
            "simpleExplanation": "If Chef 1 and Chef 2 try to write on the exact same chalkboard line simultaneously, their chalk marks collide and produce scrambled text. Shared state requires thread safety."
          },
          {
            "type": "runnable_code",
            "filename": "ThreadSafetyDemo.java",
            "initialCode": "public class ThreadSafetyDemo {\n    public static void main(String[] args) {\n        System.out.println(\"Multithreading requires thread coordination for shared data.\");\n    }\n}",
            "expectedOutput": "Multithreading requires thread coordination for shared data.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is a race condition in multithreaded programming?",
          "options": [
            "A bug occurring when multiple threads concurrently modify shared data without coordination, causing unpredictable results",
            "When one computer runs faster than another",
            "A loop that finishes too quickly"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_THREAD_RUN_VS_START",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_THREAD_RUN_VS_START",
              "errorExplanation": "Race conditions occur when uncoordinated concurrent writes corrupt shared state.",
              "recoveryPath": {
                "simplerExplanation": "Two threads colliding on the same variable.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 28 Capstone Exam: Parallel Worker Task",
      "instruction": "Create class Worker implements Runnable with run() printing \"Work Done\", and start the thread in Solution.",
      "scaffoldLevel": 2,
      "starterJavaCode": "class Worker implements Runnable {\n    public void run() {\n        System.out.println(\"Work Done\");\n    }\n}\npublic class Solution {\n    public static void main(String[] args) {\n        Worker w = new Worker();\n        w.run();\n    }\n}",
      "publicTestCases": [
        {
          "description": "Work Done",
          "expected": "Work Done"
        }
      ]
    }
  },
  {
    "day": 29,
    "title": "File & Stream I/O — Data Ingestion & Stream Processing",
    "overviewMetaphor": "A data stream is like a water pipe: data flows through the pipe byte-by-byte or line-by-line; when you are finished, you MUST close the valve (close stream) so you do not leak operating system resources.",
    "blocks": [
      {
        "id": "java-d29-b1-stream-concept",
        "day": 29,
        "blockNumber": 1,
        "title": "Streams as Plumbing Pipes",
        "conceptBudget": {
          "primaryConcept": "Stream Pipelines",
          "supportingTerms": [
            "InputStream / Reader",
            "Sequential Byte/Char Flow"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d23-b2-try-catch-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Water Pipe",
            "simpleExplanation": "Instead of loading a massive 10GB file into RAM all at once (which would crash your computer), a stream lets you drink from the pipe one sip (or line) at a time."
          },
          {
            "type": "runnable_code",
            "filename": "StreamPipeDemo.java",
            "initialCode": "import java.io.StringReader;\nimport java.util.Scanner;\n\npublic class StreamPipeDemo {\n    public static void main(String[] args) {\n        Scanner pipe = new Scanner(new StringReader(\"Chunk1\\nChunk2\"));\n        while (pipe.hasNextLine()) {\n            System.out.println(\"Stream Flow: \" + pipe.nextLine());\n        }\n    }\n}",
            "expectedOutput": "Stream Flow: Chunk1\nStream Flow: Chunk2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do applications process files using Streams rather than loading entire giant files at once?",
          "options": [
            "To process data line-by-line using minimal constant memory without exhausting RAM",
            "Because Java cannot open files larger than 1MB",
            "Streams delete the hard drive"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_STREAM_PIPELINE_MEMORY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_STREAM_PIPELINE_MEMORY",
              "errorExplanation": "Streams allow efficient sequential processing of arbitrary data sizes.",
              "recoveryPath": {
                "simplerExplanation": "Read line-by-line without running out of RAM.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d29-b2-buffered-reader",
        "day": 29,
        "blockNumber": 2,
        "title": "Line-by-Line Reading with BufferedReader / Scanner",
        "conceptBudget": {
          "primaryConcept": "Stream Line Reading",
          "supportingTerms": [
            "readLine()",
            "null Termination"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d29-b1-stream-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "import java.io.BufferedReader;\nimport java.io.StringReader;\n\nBufferedReader reader = new BufferedReader(new StringReader(\"Line 1\\nLine 2\"));\nString line;\nwhile ((line = reader.readLine()) != null) {\n    System.out.println(\"Read: \" + line);\n}",
            "lineNotes": {
              "5": "reader.readLine() returns the next line as a String, or null when end-of-stream is reached."
            }
          },
          {
            "type": "runnable_code",
            "filename": "StreamDemo.java",
            "initialCode": "import java.io.BufferedReader;\nimport java.io.StringReader;\n\npublic class StreamDemo {\n    public static void main(String[] args) throws Exception {\n        BufferedReader reader = new BufferedReader(new StringReader(\"LOG: Server Started\\nLOG: User Login\"));\n        String line;\n        while ((line = reader.readLine()) != null) {\n            System.out.println(\"Processing -> \" + line);\n        }\n    }\n}",
            "expectedOutput": "Processing -> LOG: Server Started\nProcessing -> LOG: User Login",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does reader.readLine() return when it reaches the end of the file/stream?",
          "options": [
            "null",
            "An empty string \"\"",
            "-1"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_BUFFERED_READER_EOF_NULL",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_BUFFERED_READER_EOF_NULL",
              "errorExplanation": "readLine() returns null when no further lines exist in the stream.",
              "recoveryPath": {
                "simplerExplanation": "null signals end of stream.",
                "guidedFixPrompt": "Select null."
              }
            }
          }
        }
      },
      {
        "id": "java-d29-b3-try-with-resources",
        "day": 29,
        "blockNumber": 3,
        "title": "Try-with-Resources (Automatic Stream Valve Closing)",
        "conceptBudget": {
          "primaryConcept": "try-with-resources",
          "supportingTerms": [
            "AutoCloseable",
            "No Resource Leak"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d29-b2-buffered-reader",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Automatic Stream Closing",
              "brokenCode": "BufferedReader r = new BufferedReader(...);\n// If error happens here, r is NEVER closed (Resource Leak!)\nr.close();",
              "fixedCode": "try (BufferedReader r = new BufferedReader(...)) {\n    // Automatically closes r when block finishes, even on errors!\n}",
              "errorReason": "Manual close() is skipped if an exception is thrown inside the method.",
              "fixExplanation": "Use try (Resource r = ...) so Java guarantees automatic closure."
            }
          },
          {
            "type": "runnable_code",
            "filename": "AutoCloseDemo.java",
            "initialCode": "import java.io.BufferedReader;\nimport java.io.StringReader;\n\npublic class AutoCloseDemo {\n    public static void main(String[] args) {\n        try (BufferedReader br = new BufferedReader(new StringReader(\"Resource Safe Data\"))) {\n            System.out.println(\"Read: \" + br.readLine());\n        } catch (Exception e) {}\n    }\n}",
            "expectedOutput": "Read: Resource Safe Data",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is try (BufferedReader r = ...) preferred over manual r.close()?",
          "options": [
            "Java automatically closes the stream resource in all situations, even if exceptions occur",
            "It makes reading 10x faster",
            "It deletes temporary files"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_TRY_WITH_RESOURCES_AUTOCLOSE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_TRY_WITH_RESOURCES_AUTOCLOSE",
              "errorExplanation": "try-with-resources guarantees resource cleanup preventing file descriptor leaks.",
              "recoveryPath": {
                "simplerExplanation": "Java closes the stream automatically.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 29 Capstone Exam: Stream Error Log Parser",
      "instruction": "Write countErrorLines(String logContent) in Solution using a reader/stream to count lines starting with \"[ERROR]\".",
      "scaffoldLevel": 2,
      "starterJavaCode": "import java.io.BufferedReader;\nimport java.io.StringReader;\n\npublic class Solution {\n    public static int countErrorLines(String streamText) {\n        if (streamText == null) return 0;\n        int count = 0;\n        try (BufferedReader reader = new BufferedReader(new StringReader(streamText))) {\n            String line;\n            while ((line = reader.readLine()) != null) {\n                if (line.trim().startsWith(\"[ERROR]\")) count++;\n            }\n        } catch (Exception e) {}\n        return count;\n    }\n    public static void main(String[] args) {\n        String log = \"[INFO] Start\\n[ERROR] Crash\\n[ERROR] Timeout\";\n        System.out.println(\"Errors: \" + countErrorLines(log));\n    }\n}",
      "publicTestCases": [
        {
          "description": "Counts 2 error lines",
          "expected": "Errors: 2"
        }
      ]
    }
  },
  {
    "day": 30,
    "title": "🏆 Comprehensive Capstone Project: Ledger Transaction Auditor",
    "overviewMetaphor": "The Capstone synthesizes your entire 30-day journey into a complete enterprise financial auditing engine: object entities, validation guards, collections, and threshold summation working in harmony.",
    "blocks": [
      {
        "id": "java-d30-b1-architecture",
        "day": 30,
        "blockNumber": 1,
        "title": "Capstone System Architecture",
        "conceptBudget": {
          "primaryConcept": "Full System Integration",
          "supportingTerms": [
            "Domain Entity",
            "Ledger Collection",
            "Audit Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d26-b1-hashmap-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "analogy",
            "metaphor": "The Enterprise Banking Auditor",
            "simpleExplanation": "You are building the transaction auditor for a major financial bank: it processes ledger records, filters high-value transactions above a threshold, rejects negative corruption, and computes total balances."
          },
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Capstone Auditor Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Raw Transaction Stream Array",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Defensive Guard: Reject invalid amounts (<= 0)",
                  "kind": "decision"
                },
                {
                  "id": "3",
                  "label": "3. Threshold Filter: amount > limit?",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Summation Accumulator: sum += amount",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "5. Return Audited Balance",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ArchitectureDemo.java",
            "initialCode": "public class ArchitectureDemo {\n    public static void main(String[] args) {\n        System.out.println(\"Capstone Auditor: Domain Entities + Validation + Aggregation\");\n    }\n}",
            "expectedOutput": "Capstone Auditor: Domain Entities + Validation + Aggregation",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What are the core components synthesized in the Ledger Auditor capstone?",
          "options": [
            "Domain classes, defensive validation, loop traversal, threshold filtering, and summation",
            "Only print statements",
            "Only while loops"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_CAPSTONE_SYSTEM_SYNTHESIS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_CAPSTONE_SYSTEM_SYNTHESIS",
              "errorExplanation": "The capstone unifies OOP, collections, validation, and algorithmic traversal.",
              "recoveryPath": {
                "simplerExplanation": "All major course concepts synthesized into 1 project.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d30-b2-transaction-entity",
        "day": 30,
        "blockNumber": 2,
        "title": "The Transaction Domain Entity",
        "conceptBudget": {
          "primaryConcept": "Domain Entity Modeling",
          "supportingTerms": [
            "Encapsulated Fields",
            "Validation Constructor"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d30-b1-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "codeSnippet": "class Transaction {\n    private String id;\n    private int amount;\n    public Transaction(String id, int amount) {\n        if (amount <= 0) throw new IllegalArgumentException(\"Amount must be positive\");\n        this.id = id;\n        this.amount = amount;\n    }\n    public int getAmount() { return amount; }\n}",
            "lineNotes": {
              "4": "Defensive validation in constructor ensures no corrupt transactions can ever exist in memory."
            }
          },
          {
            "type": "runnable_code",
            "filename": "TransactionEntityDemo.java",
            "initialCode": "class Transaction {\n    int amount;\n    public Transaction(int amt) {\n        if (amt <= 0) throw new IllegalArgumentException(\"Amount must be > 0\");\n        this.amount = amt;\n    }\n}\npublic class TransactionEntityDemo {\n    public static void main(String[] args) {\n        Transaction tx = new Transaction(250);\n        System.out.println(\"Valid Transaction created: $\" + tx.amount);\n    }\n}",
            "expectedOutput": "Valid Transaction created: $250",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why does the Transaction constructor throw IllegalArgumentException when amount <= 0?",
          "options": [
            "To guarantee that no invalid or negative transaction object can ever be instantiated in memory",
            "To make the object static",
            "To format the output as CSV"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_JAVA_ENTITY_INVARIANT_VALIDATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_JAVA_ENTITY_INVARIANT_VALIDATION",
              "errorExplanation": "Constructor validation guarantees invariant state for domain objects.",
              "recoveryPath": {
                "simplerExplanation": "Prevent bad data from entering the system.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "java-d30-b3-auditor-aggregation",
        "day": 30,
        "blockNumber": 3,
        "title": "Auditor Aggregation & Threshold Filter",
        "conceptBudget": {
          "primaryConcept": "Threshold Filter & Accumulation",
          "supportingTerms": [
            "for-each scan",
            "summation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d30-b2-transaction-entity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "AuditorDemo.java",
            "initialCode": "public class AuditorDemo {\n    public static int auditLedger(int[] amounts, int threshold) {\n        int sum = 0;\n        for (int a : amounts) {\n            if (a > threshold) {\n                sum += a;\n            }\n        }\n        return sum;\n    }\n    public static void main(String[] args) {\n        int[] ledger = { 100, 500, 200, 1200, 4500 };\n        System.out.println(\"High Value Sum: $\" + auditLedger(ledger, 1000));\n    }\n}",
            "expectedOutput": "High Value Sum: $5700",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In AuditorDemo with amounts { 100, 500, 200, 1200, 4500 } and threshold 1000, what is 1200 + 4500?",
          "expectedStringOutput": "High Value Sum: $5700",
          "acceptableAnswers": [
            "High Value Sum: $5700",
            "5700",
            "$5700"
          ],
          "primaryMisconceptionId": "MC_JAVA_AUDITOR_THRESHOLD_FILTER",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_AUDITOR_THRESHOLD_FILTER",
              "errorExplanation": "Only 1200 and 4500 are > 1000; their sum is 5700.",
              "recoveryPath": {
                "simplerExplanation": "1200 + 4500 = 5700.",
                "guidedFixPrompt": "Type High Value Sum: $5700"
              }
            }
          }
        }
      },
      {
        "id": "java-d30-b4-category-filter",
        "day": 30,
        "blockNumber": 4,
        "title": "Category Filtering & Balance Reconciliation",
        "conceptBudget": {
          "primaryConcept": "Category Reconciliation",
          "supportingTerms": [
            "Record Parsing",
            "Category Matching"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "java-d30-b3-auditor-aggregation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "CategoryAuditor.java",
            "initialCode": "public class CategoryAuditor {\n    public static int calculateBalance(int initialBalance, int[] transactions) {\n        int balance = initialBalance;\n        for (int tx : transactions) {\n            balance += tx;\n        }\n        return balance;\n    }\n    public static void main(String[] args) {\n        int[] txs = { 500, -200, 150 };\n        System.out.println(\"Reconciled Balance: $\" + calculateBalance(1000, txs));\n    }\n}",
            "expectedOutput": "Reconciled Balance: $1450",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is 1000 + 500 - 200 + 150?",
          "expectedStringOutput": "Reconciled Balance: $1450",
          "acceptableAnswers": [
            "Reconciled Balance: $1450",
            "1450",
            "$1450"
          ],
          "primaryMisconceptionId": "MC_JAVA_BALANCE_RECONCILIATION",
          "diagnosisMap": {
            "wrong": {
              "misconceptionId": "MC_JAVA_BALANCE_RECONCILIATION",
              "errorExplanation": "1000 + 500 - 200 + 150 = 1450.",
              "recoveryPath": {
                "simplerExplanation": "Reconciled balance is 1450.",
                "guidedFixPrompt": "Type Reconciled Balance: $1450"
              }
            }
          }
        }
      }
    ],
    "scaffoldedExam": {
      "title": "Day 30 Final Capstone Challenge: Ledger Transaction Auditor",
      "instruction": "Write auditLedger(int[] amounts, int limit) in Solution returning sum of all transaction amounts strictly greater than limit.",
      "scaffoldLevel": 2,
      "starterJavaCode": "public class Solution {\n    public static int auditLedger(int[] amounts, int limit) {\n        int sum = 0;\n        for (int a : amounts) {\n            if (a > limit) sum += a;\n        }\n        return sum;\n    }\n    public static void main(String[] args) {\n        int[] ledger = { 500, 1500, 200, 3000, 800 };\n        System.out.println(\"Audited Sum: \" + auditLedger(ledger, 1000));\n    }\n}",
      "publicTestCases": [
        {
          "description": "Audited Sum 1500 + 3000 = 4500",
          "expected": "Audited Sum: 4500"
        }
      ]
    }
  }
];
