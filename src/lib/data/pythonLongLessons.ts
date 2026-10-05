import type { LongLesson } from './longLessons';

/**
 * Long-format lessons for the 1-Month Python course (quest prefix `python`).
 * Days follow PYTHON_30_DAYS_CONFIGS in python30DayData.ts. Written for beginners, in plain words.
 * Every `code` sample runs as Python in the browser (Pyodide) and prints exactly its `output`
 * (checked by tests/python_long_lessons.test.ts). Samples never use input(): the browser cannot type into them.
 */
const lines = (...l: string[]) => l.join('\n');

export const PYTHON_LONG_LESSONS: LongLesson[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 1,
    title: 'Your First Python Program',
    goal: 'You can explain what Python is used for, run your first lines of Python, and write comments.',
    minutes: 30,
    parts: [
      {
        title: 'What Python is and why so many people learn it',
        say: [
          'Welcome to your first day of Python. A programming language is a way of giving exact instructions to a computer. The computer is very fast but it cannot guess what you mean, so every instruction must be clear and written in a way it understands.',
          'Python is one of the most popular programming languages in the world. It was designed to be easy to read. Many lines of Python look almost like simple English, which is why it is often the first language people learn.',
          'Python is not only for beginners. Companies use it for websites and servers, for automating boring office work, for analysing data in spreadsheets, and for artificial intelligence. Instagram, YouTube and many banks and startups in India use Python every day.',
          'This month you will go from your very first line to a real project: an Expense Tracker that records what you spend, adds it up by category, saves it, and later runs as a small web API on the internet. Every day adds one piece.'
        ],
        example: 'Think of a recipe. A recipe is a list of exact steps: boil water, add rice, wait ten minutes. If a step is missing or unclear, the dish goes wrong. A program is a recipe for the computer, and Python is the language the recipe is written in.',
        code: lines(
          'print("Hello! This is my first Python program.")'
        ),
        output: 'Hello! This is my first Python program.',
        codeNotes: [
          { line: 1, note: 'print shows a message on the screen. The text inside the quotes is shown exactly as written.' }
        ],
        tryIt: 'Change the message inside the quotes to your own name, for example "Hello, I am Priya", and press Run Code. Keep the quotes at both ends and the brackets around them.',
        check: {
          question: 'What is Python?',
          options: ['A programming language used for websites, automation, data and AI', 'A program for drawing pictures', 'A type of computer'],
          answer: 0,
          why: 'Python is a programming language. People use it to build websites, automate work, analyse data and build AI tools.'
        }
      },
      {
        title: 'print(): showing results on the screen',
        say: [
          'The first tool every Python programmer learns is print. You write the word print, then round brackets, and inside the brackets the thing you want to show. Python shows it on the screen.',
          'Text must be inside quotes. You can use double quotes or single quotes, as long as both ends match. Text inside quotes is called a string. Numbers do not need quotes: print(25) shows 25.',
          'Python runs your program from the top line to the bottom line, one line at a time. So if you write three print lines, you see three results, in the same order.',
          'You can also give print more than one thing, separated by commas. Python shows them on one line with a space between them. This is handy for labels, like print("Total:", 250).'
        ],
        example: 'print is like a loudspeaker in a railway station. Whatever the announcer reads into it, everyone hears, in the order it was read. If the announcer reads three messages, you hear three messages, one after another.',
        code: lines(
          'print("My Expense Tracker")',
          'print("Tea", 20)',
          "print('Bus ticket', 45)",
          'print(20 + 45)'
        ),
        output: lines('My Expense Tracker', 'Tea 20', 'Bus ticket 45', '65'),
        codeNotes: [
          { line: 2, note: 'Two things separated by a comma. Python prints them on one line with a space between.' },
          { line: 3, note: 'Single quotes work the same as double quotes.' },
          { line: 4, note: 'No quotes, so Python does the maths first and prints the answer.' }
        ],
        tryIt: 'Add a new line at the bottom: print("Lunch", 120). Then change the last line to add all three amounts: print(20 + 45 + 120). Run it and check the total is 185.',
        check: {
          question: 'What does print("5 + 5") show?',
          options: ['5 + 5', '10', 'An error'],
          answer: 0,
          why: 'Because 5 + 5 is inside quotes, it is text, so Python shows it exactly as written. Without quotes, print(5 + 5) would show 10.'
        }
      },
      {
        title: 'How Python reads your code: line by line',
        say: [
          'A computer program is read in order, from the first line to the last. Python finishes one line completely before it starts the next one. This order matters a lot.',
          'If a line has a mistake that Python finds while running, such as a misspelled word, Python stops at that line and shows an error message. The lines above it already ran, but the lines below it never run. Beginners often think the whole program is broken, when really only one line has a problem.',
          'An error message is not a punishment. It is Python telling you exactly what went wrong and on which line. Professional developers read error messages all day. You will get better at reading them each week.',
          'Some mistakes are different. If you forget a closing quote or a closing bracket, Python cannot even read the program, so nothing runs at all, not even line 1. This is called a SyntaxError. If you see SyntaxError, check your quotes and brackets first.'
        ],
        example: 'Think of a teacher reading attendance from a register, one name at a time, from top to bottom. If a page is torn in the middle, the teacher reads the names before it and stops there. The names after the torn part are never called.',
        code: lines(
          'print("Step 1: open the app")',
          'print("Step 2: add an expense")',
          'print("Step 3: see the total")'
        ),
        output: lines('Step 1: open the app', 'Step 2: add an expense', 'Step 3: see the total'),
        codeNotes: [
          { line: 1, note: 'This line runs first.' },
          { line: 3, note: 'This line runs last, because it is at the bottom.' }
        ],
        tryIt: 'Change line 2 to prnt("Step 2: add an expense") and run it. Line 1 prints, then Python stops with a NameError on line 2, and line 3 never runs. Fix it, then remove the closing quote on line 2 and run again: this time nothing prints at all, because a SyntaxError stops Python before it starts.',
        check: {
          question: 'Line 3 of a 5-line program says prnt("Hi"), a misspelled print. What happens?',
          options: ['Lines 1 and 2 run, then Python stops with an error on line 3', 'Nothing runs at all', 'Python skips line 3 and runs lines 4 and 5'],
          answer: 0,
          why: 'Python runs line by line. The lines before the mistake run, then it stops at the mistake and shows an error. It does not skip ahead. A missing quote would be different: that is a SyntaxError, and nothing would run.'
        }
      },
      {
        title: 'Capital letters matter',
        say: [
          'Python is case-sensitive. That means small letters and capital letters are different to Python. print with a small p is the tool you know. Print with a capital P means nothing to Python, and you get an error.',
          'The error you get is called a NameError. It means Python looked for a name it does not know. When you see NameError, check the spelling and the capital letters of the word it mentions.',
          'Text inside quotes is different. Inside quotes you can use any letters you like, because Python does not read it as an instruction. It just shows it. So print("HELLO") and print("hello") both work, and show different text.',
          'Most Python words are written in small letters. As a simple rule for this month: write Python instructions in small letters, and use capitals only inside quotes, or when a lesson tells you to.'
        ],
        example: 'A password works the same way. If your password is Mango123, typing mango123 does not unlock your phone. The letters look almost the same to you, but to the computer a capital M and a small m are different.',
        code: lines(
          'print("hello")',
          'print("HELLO")',
          'print("Hello" == "hello")'
        ),
        output: lines('hello', 'HELLO', 'False'),
        codeNotes: [
          { line: 3, note: '== asks "are these the same?" Python answers False, because a capital H is different from a small h.' }
        ],
        tryIt: 'Change line 1 to Print("hello") with a capital P and run it. Read the NameError. Then change it back to a small p.',
        check: {
          question: 'Why does Print("Hi") give an error?',
          options: ['Python is case-sensitive, and the tool is print with a small p', 'The text Hi is too short', 'Quotes are not allowed in print'],
          answer: 0,
          why: 'Python treats capital and small letters as different. It knows print, not Print, so it reports a NameError.'
        }
      },
      {
        title: 'Comments: notes for humans',
        say: [
          'A comment is a note in your code that Python ignores. It is written for people, not for the computer. In Python, a comment starts with the hash sign #. Everything after the # on that line is skipped.',
          'Comments explain why the code does something, or what a section is for. When you come back to your code after a month, or when a teammate reads it, good comments save a lot of time.',
          'Comments are also useful while learning and testing. If you put # at the start of a line, that line stops running without being deleted. This is called commenting out a line.',
          'Do not write a comment for every line. print("Hello") does not need a comment saying "prints hello". Write comments when the reason is not obvious from the code itself.'
        ],
        example: 'Comments are like sticky notes on a textbook. The book stays the same, but your notes remind you why a page matters. Someone reading the book aloud would skip your sticky notes.',
        code: lines(
          '# My Expense Tracker, day 1',
          'print("Tea", 20)',
          '# print("Movie", 300)   <- turned off for now',
          'print("Bus", 45)  # the bus to college'
        ),
        output: lines('Tea 20', 'Bus 45'),
        codeNotes: [
          { line: 1, note: 'A whole-line comment. Python skips it.' },
          { line: 3, note: 'This print is "commented out", so it does not run.' },
          { line: 4, note: 'A comment can also go at the end of a line. The print still runs.' }
        ],
        tryIt: 'Remove the # at the start of line 3 and run again. Now the movie line is printed too. Then add your own comment at the top saying what today\'s date is.',
        check: {
          question: 'What does Python do with a line that starts with #?',
          options: ['It skips the line', 'It prints the line', 'It shows an error'],
          answer: 0,
          why: 'A line starting with # is a comment. Comments are notes for people, so Python ignores them.'
        }
      },
      {
        title: 'Putting it together: your first small program',
        say: [
          'Now let us put everything from today together into one small program: a title, a few expenses, and a total. This is the very first version of the Expense Tracker you will build this month.',
          'Look at how the program is organised. A comment says what it is. print lines show the title and each expense in order. The last line lets Python do the maths for the total.',
          'Right now the numbers are typed twice: once in each expense line and again in the total. That is not ideal, because if you change one number you must remember to change it in two places. Tomorrow you will fix this with variables.',
          'In the practice after this lesson, you will write your first function. Do not worry about the word function yet. You will see a few lines already written for you, and you only need to change one line. The instructions will show you exactly what to type.'
        ],
        example: 'A shop receipt has the shop name at the top, then one line per item, then the total at the bottom. Your first program is a tiny receipt printed by Python.',
        code: lines(
          '# Expense Tracker, version 1',
          'print("=== My Expense Tracker ===")',
          'print("Tea", 20)',
          'print("Bus", 45)',
          'print("Lunch", 120)',
          'print("Total:", 20 + 45 + 120)'
        ),
        output: lines('=== My Expense Tracker ===', 'Tea 20', 'Bus 45', 'Lunch 120', 'Total: 185'),
        codeNotes: [
          { line: 6, note: 'The label "Total:" is text, and 20 + 45 + 120 is maths. Python prints both on one line.' }
        ],
        tryIt: 'Add one more expense of your own, for example print("Notebook", 60). Then update the total line so it includes 60. Check that the total becomes 245.',
        check: {
          question: 'In print("Total:", 20 + 45), what is shown?',
          options: ['Total: 65', 'Total: 20 + 45', 'Total:65+'],
          answer: 0,
          why: '"Total:" is text, so it is shown as written. 20 + 45 has no quotes, so Python adds it and shows 65, with a space in between.'
        }
      }
    ],
    summary: [
      'Python is an easy-to-read programming language used for websites, automation, data and AI.',
      'print(...) shows text or numbers on the screen. Text goes inside quotes.',
      'Python runs code from top to bottom and stops at the first mistake, with an error message.',
      'Python is case-sensitive: print works, Print does not.',
      'A # starts a comment: a note for people that Python ignores.'
    ],
    projectStep: {
      title: 'Expense Tracker: set up your first file',
      steps: [
        'For now, write all your code in the lesson editor. On Day 20 you will install Python on your laptop.',
        'Write a program that prints a title "=== My Expense Tracker ===".',
        'Print three real expenses from your day, each on its own line.',
        'Print the total using + so Python does the maths.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 2,
    title: 'Variables and Data Types',
    goal: 'You can store values in variables, tell text, whole numbers, decimals and True/False apart, and convert between them.',
    minutes: 30,
    recap: 'Yesterday you used print to show text and numbers, learned that Python reads top to bottom, and wrote comments with #.',
    parts: [
      {
        title: 'What a variable is',
        say: [
          'Yesterday you typed the same numbers twice: once for each expense and again in the total. Today you learn how to store a value once and use it many times. The tool for this is a variable.',
          'A variable is a name that points to a value. You create one with an equals sign: tea = 20. Read it as "tea stores 20". After that line, whenever you write tea, Python uses 20.',
          'The equals sign in Python does not mean "is equal to" like in maths. It means "store the value on the right in the name on the left". The name always goes on the left.',
          'Variable names should describe what they hold. tea, bus_fare and total are good names. x or a1 tell the reader nothing. Names can use small letters, numbers and underscores, but cannot start with a number or contain spaces.'
        ],
        example: 'A variable is like a labelled jar in the kitchen. The label says "sugar" and inside is the sugar. When a recipe says "add sugar", you pick up the jar with that label. You do not need to know exactly how much is inside; you just use the label.',
        code: lines(
          'tea = 20',
          'bus_fare = 45',
          'lunch = 120',
          'total = tea + bus_fare + lunch',
          'print("Total:", total)'
        ),
        output: 'Total: 185',
        codeNotes: [
          { line: 1, note: 'Store 20 in a variable called tea.' },
          { line: 4, note: 'Python looks up each name, adds the values, and stores the answer in total.' }
        ],
        tryIt: 'Change lunch = 120 to lunch = 150 and run again. The total changes to 215 by itself, because the total is worked out from the variables.',
        check: {
          question: 'What does price = 50 do in Python?',
          options: ['Stores 50 in a variable named price', 'Checks whether price is 50', 'Prints 50'],
          answer: 0,
          why: 'In Python, = stores the value on the right in the name on the left. It does not compare and does not print.'
        }
      },
      {
        title: 'Changing a variable',
        say: [
          'Variables can change. That is why they are called variables: their value can vary. If you write balance = 500 and later balance = 300, the name balance now points to 300. The old value is forgotten.',
          'Very often you change a variable using its own old value. For example, balance = balance - 20 means: take the current balance, subtract 20, and store the answer back in balance.',
          'Python has a short way to write this: balance -= 20. In the same way, total += 45 means total = total + 45. You will see this short form in real code all the time.',
          'Remember that Python runs top to bottom. If you print a variable before you change it, you see the old value. If you print it after, you see the new value.'
        ],
        example: 'Think of your metro card. It starts with 500 rupees. Each trip, the machine takes the current balance, subtracts the fare, and saves the new balance on the card. The card does not remember the old amount; it only knows what is left now.',
        code: lines(
          'balance = 500',
          'print("Start:", balance)',
          'balance = balance - 20',
          'print("After tea:", balance)',
          'balance -= 45',
          'print("After bus:", balance)'
        ),
        output: lines('Start: 500', 'After tea: 480', 'After bus: 435'),
        codeNotes: [
          { line: 3, note: 'Take the old balance (500), subtract 20, and store 480 back in balance.' },
          { line: 5, note: 'The short form of balance = balance - 45.' }
        ],
        tryIt: 'Add two lines at the bottom: balance += 1000 and print("After salary:", balance). The balance should be 1435.',
        check: {
          question: 'score = 10, then score += 5. What is score now?',
          options: ['15', '5', '10'],
          answer: 0,
          why: 'score += 5 means score = score + 5. The old value 10 plus 5 gives 15.'
        }
      },
      {
        title: 'Types of values: text, whole numbers, decimals',
        say: [
          'Every value in Python has a type. The type tells Python what kind of thing it is and what you can do with it. Today you meet four types.',
          'Text is called str, short for string. It always has quotes: "Tea". A whole number is called int, short for integer: 20. A number with a decimal point is called float: 99.5. You can add and multiply ints and floats, but not text.',
          'You can ask Python for the type of any value with type(). print(type(20)) shows <class \'int\'>. Do not worry about the word class yet. Just look at the last word: int, str or float.',
          'Watch out: "20" with quotes is text, not a number. It looks like a number, but Python treats it like the word "twenty" written down. You cannot do maths with it until you convert it, which you will learn in a moment.'
        ],
        example: 'A phone number and a price both have digits, but they are different kinds of things. You add prices together to get a bill total. You never add two phone numbers. Python types are the same idea: they tell Python what makes sense to do with a value.',
        code: lines(
          'item = "Tea"',
          'amount = 20',
          'rating = 4.5',
          'print(type(item))',
          'print(type(amount))',
          'print(type(rating))',
          'print(type("20"))'
        ),
        output: lines("<class 'str'>", "<class 'int'>", "<class 'float'>", "<class 'str'>"),
        codeNotes: [
          { line: 3, note: 'A decimal point makes it a float.' },
          { line: 7, note: '"20" has quotes, so it is text (str), not a number.' }
        ],
        tryIt: 'Add a line print(type(20.0)) and run it. Even though 20.0 equals 20, the decimal point makes it a float.',
        check: {
          question: 'What type is "45"?',
          options: ['str (text)', 'int (whole number)', 'float (decimal)'],
          answer: 0,
          why: 'It has quotes around it, so it is text. Quotes always make a string, even if the characters are digits.'
        }
      },
      {
        title: 'True and False: the bool type',
        say: [
          'The fourth type is called bool, short for Boolean. A bool has only two possible values: True and False. Notice the capital T and capital F. Python is case-sensitive, so true with a small t does not work.',
          'You usually get a bool by asking a question. amount > 100 asks "is amount more than 100?" and Python answers True or False. amount == 20 asks "is amount exactly 20?". Two equals signs means compare; one equals sign means store.',
          'The comparison signs are: > more than, < less than, >= more than or equal, <= less than or equal, == equal, and != not equal.',
          'Bools are how programs make decisions. On Day 5 you will use them with if: if the bill is 499 or more, delivery is free. For now, just practise asking questions and reading the True or False answers.'
        ],
        example: 'A light switch has only two states: on or off. There is no half-on. A bool is the same: every yes-or-no question, like "is the shop open?" or "is my balance below zero?", has an answer of True or False.',
        code: lines(
          'amount = 1200',
          'print(amount > 1000)',
          'print(amount == 500)',
          'print(amount != 500)',
          'is_big = amount >= 1000',
          'print("Big expense?", is_big)'
        ),
        output: lines('True', 'False', 'True', 'Big expense? True'),
        codeNotes: [
          { line: 3, note: 'Two equals signs: "is it equal?". The answer is False.' },
          { line: 5, note: 'You can store the True/False answer in a variable, like any other value.' }
        ],
        tryIt: 'Change amount = 1200 to amount = 800 and run it. Two of the answers change and two stay the same. Predict which ones before you press Run Code.',
        check: {
          question: 'What is the difference between = and == in Python?',
          options: ['= stores a value; == asks if two values are equal', 'They mean the same thing', '= compares; == stores'],
          answer: 0,
          why: 'One equals sign stores a value in a variable. Two equals signs compare two values and give True or False.'
        }
      },
      {
        title: 'Converting between types',
        say: [
          'Sometimes you have a value of one type and need another. Python has simple tools for this, named after the types: str(), int() and float().',
          'str(20) turns the number 20 into the text "20". You need this when joining a number to text with +. "Total: " + 20 is an error, because Python will not add text and a number. "Total: " + str(20) works.',
          'int("45") turns the text "45" into the number 45, so you can do maths with it. float("99.5") gives the decimal 99.5. This matters a lot later, because anything a user types into a program arrives as text.',
          'If the text is not a number, like int("abc"), Python gives a ValueError. On Day 14 you will learn how to handle that calmly instead of letting the program crash.'
        ],
        example: 'Converting types is like changing currency at the airport. You hand over rupees and get dollars back. The value is the same idea, but in a form you can use in the new place. str() and int() change a value into the form you need.',
        code: lines(
          'amount = 20',
          'message = "Tea costs " + str(amount)',
          'print(message)',
          'typed = "45"',
          'print(int(typed) + 5)',
          'print(float("99.5") * 2)'
        ),
        output: lines('Tea costs 20', '50', '199.0'),
        codeNotes: [
          { line: 2, note: 'str(amount) turns 20 into "20" so it can be joined to other text with +.' },
          { line: 5, note: 'int("45") turns the text into the number 45, and then 45 + 5 is 50.' }
        ],
        tryIt: 'Change line 2 to "Tea costs " + amount (remove str) and run it. Read the TypeError. It is Python saying it cannot join text and a number. Then put str() back.',
        check: {
          question: 'What does "Total: " + str(65) give?',
          options: ['"Total: 65"', 'An error', '"Total: " 65'],
          answer: 0,
          why: 'str(65) turns the number into the text "65", and + joins two pieces of text into one.'
        }
      },
      {
        title: 'Good variable names and a better tracker',
        say: [
          'Let us rewrite yesterday\'s Expense Tracker with variables. Each expense amount is stored once. The total is worked out from the variables. The output looks the same, but the program is much easier to change.',
          'Python programmers write variable names in small letters with underscores between words, like bus_fare or monthly_budget. This style is called snake_case. It is the standard style in Python, and following it makes your code look professional.',
          'A few words are reserved by Python and cannot be used as names, like if, for, and class. You will learn these words over the next days. If you accidentally use one, Python will tell you with a SyntaxError.',
          'In today\'s practice, you will join text and a number with str(), and compare a number with >=. These are exactly the two ideas from this lesson.'
        ],
        example: 'Good names are like clear labels on files in an office cupboard. "Electricity bills 2026" is easy to find. "Folder 7" is not. Months later, clear names help you and your teammates understand the code quickly.',
        code: lines(
          '# Expense Tracker, version 2: with variables',
          'monthly_budget = 5000',
          'tea = 20',
          'bus_fare = 45',
          'lunch = 120',
          'total = tea + bus_fare + lunch',
          'left = monthly_budget - total',
          'print("Spent today: " + str(total))',
          'print("Left this month: " + str(left))',
          'print("Over budget?", total > monthly_budget)'
        ),
        output: lines('Spent today: 185', 'Left this month: 4815', 'Over budget? False'),
        codeNotes: [
          { line: 7, note: 'A new value worked out from two other variables.' },
          { line: 10, note: 'A comparison gives True or False, and print shows it next to the label.' }
        ],
        tryIt: 'Change monthly_budget to 100 and run it. Now the money left is negative and "Over budget?" becomes True.',
        check: {
          question: 'Which is the best Python variable name for a monthly budget?',
          options: ['monthly_budget', 'Monthly Budget', 'mb'],
          answer: 0,
          why: 'Python uses small letters with underscores (snake_case). Spaces are not allowed in names, and short names like mb are hard to understand.'
        }
      }
    ],
    summary: [
      'A variable stores a value under a name: tea = 20. One = means store.',
      'You can change a variable, often from its own value: balance -= 20.',
      'Four basic types: str (text, in quotes), int (whole number), float (decimal), bool (True or False).',
      'Comparisons like >, == and != give True or False. Two == means compare.',
      'str(), int() and float() convert between types. Use str() to join numbers to text.'
    ],
    projectStep: {
      title: 'Expense Tracker: use variables',
      steps: [
        'Store a monthly_budget and three expense amounts in variables.',
        'Work out the total and the money left from the variables.',
        'Print both with labels, using str() to join text and numbers.',
        'Print whether you are over budget with a comparison.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 3,
    title: 'Working With Text',
    goal: 'You can join, measure, slice and clean text with Python\'s string tools.',
    minutes: 30,
    recap: 'Yesterday you stored values in variables, met the types str, int, float and bool, and converted between them with str() and int().',
    parts: [
      {
        title: 'Strings and joining them',
        say: [
          'Most programs work with a lot of text: names, messages, product titles, addresses. In Python, a piece of text is called a string, and today is all about strings.',
          'You already know you can join strings with +. "Hello, " + "Asha" gives "Hello, Asha". Notice the space inside the first string. Python does not add spaces for you when you use +, so you must include them yourself.',
          'You can also repeat a string with *. "-" * 10 gives ten dashes. This is a quick way to draw lines in the output, like the line under a heading on a receipt.',
          'Strings can contain any characters: letters, numbers, spaces, symbols and even emoji. If your text contains a single quote, like the word it\'s, wrap the string in double quotes so Python does not get confused about where it ends.'
        ],
        example: 'Joining strings is like joining train coaches. Each coach is a piece of text, and + links them in order. If you want a gap between two coaches, you have to add a gap yourself, which in code means adding a space.',
        code: lines(
          'first = "Asha"',
          'greeting = "Hello, " + first + "!"',
          'print(greeting)',
          'print("-" * 20)',
          'print("It\'s payday")'
        ),
        output: lines('Hello, Asha!', '--------------------', "It's payday"),
        codeNotes: [
          { line: 2, note: 'Three strings joined together. The space after the comma is inside the quotes.' },
          { line: 4, note: 'The dash repeated 20 times.' }
        ],
        tryIt: 'Change first to your own name. Then change "-" * 20 to "=" * 30 and see a longer line of equals signs.',
        check: {
          question: 'What does "Hi" + "there" give?',
          options: ['"Hithere"', '"Hi there"', 'An error'],
          answer: 0,
          why: '+ joins strings exactly as they are. There is no space in either string, so the result has no space.'
        }
      },
      {
        title: 'Length and positions',
        say: [
          'len() tells you how many characters are in a string. Spaces and symbols count too. len("Tea") is 3, and len("Bus fare") is 8 because the space counts.',
          'Each character in a string has a position number, called an index. The first character is at position 0, not 1. This surprises everyone at first, but almost every programming language counts from 0.',
          'You get one character with square brackets: name[0] is the first character. You can also count from the end with negative numbers: name[-1] is the last character, name[-2] is the second last.',
          'If you ask for a position that does not exist, like name[50] on a short name, Python gives an IndexError. That is Python saying "there is nothing at that position".'
        ],
        example: 'Think of seats in a cinema row where the numbering starts at 0. The first seat is seat 0, the second is seat 1. If you want the seat at the far end, you can simply say "the last seat", which is what -1 means in Python.',
        code: lines(
          'name = "Priya"',
          'print(len(name))',
          'print(name[0])',
          'print(name[1])',
          'print(name[-1])',
          'print(len("Bus fare"))'
        ),
        output: lines('5', 'P', 'r', 'a', '8'),
        codeNotes: [
          { line: 3, note: 'Position 0 is the first letter.' },
          { line: 5, note: '-1 is always the last letter, however long the string is.' },
          { line: 6, note: 'The space counts as a character.' }
        ],
        tryIt: 'Add print(name[10]) at the bottom and run it. Read the IndexError. Then remove that line.',
        check: {
          question: 'For word = "Python", what is word[0]?',
          options: ['"P"', '"y"', '"n"'],
          answer: 0,
          why: 'Python counts positions from 0, so word[0] is the first character, "P".'
        }
      },
      {
        title: 'Slicing: taking part of a string',
        say: [
          'Sometimes you need a piece of a string, not just one character. For that you use a slice: text[start:stop]. It gives you the characters from position start up to, but not including, position stop.',
          'For example, "2026-09-28"[0:4] gives "2026", the year. Positions 0, 1, 2 and 3 are included; position 4 is not. The "up to but not including" rule is the same everywhere in Python, so it is worth remembering.',
          'You can leave out start or stop. text[:3] means from the beginning up to position 3. text[5:] means from position 5 to the end. text[-4:] means the last four characters.',
          'Slicing never changes the original string. It gives you a new string. The original stays exactly as it was.'
        ],
        example: 'Slicing is like cutting a piece from a long loaf of bread. You mark where the cut starts and where it stops, and you get that piece. The loaf you started with is still there on the counter.',
        code: lines(
          'date = "2026-09-28"',
          'print(date[0:4])',
          'print(date[5:7])',
          'print(date[-2:])',
          'card = "4111222233334444"',
          'print("Card ending " + card[-4:])'
        ),
        output: lines('2026', '09', '28', 'Card ending 4444'),
        codeNotes: [
          { line: 2, note: 'Positions 0 to 3: the year.' },
          { line: 4, note: 'From the second-last character to the end: the day.' },
          { line: 6, note: 'Apps show only the last four digits of a card. This is how.' }
        ],
        tryIt: 'Add print(date[:7]) and predict the output before you run it. It should be "2026-09", the year and month.',
        check: {
          question: 'What does "Expense"[0:3] give?',
          options: ['"Exp"', '"Expe"', '"xpe"'],
          answer: 0,
          why: 'A slice goes from the start position up to, but not including, the stop position. Positions 0, 1 and 2 give "Exp".'
        }
      },
      {
        title: 'String tools: upper, lower, strip, replace',
        say: [
          'Strings come with built-in tools called methods. You use a method by writing a dot after the string, then the method name and brackets: name.upper(). A method is a tool that belongs to a value.',
          'upper() gives the text in capital letters. lower() gives it in small letters. These are useful for comparing text: people type "Food", "FOOD" and "food", and lower() turns them all into "food" so you can treat them the same.',
          'strip() removes spaces from the start and the end of a string. When people type into a form, they often add an extra space by mistake. strip() cleans that up. replace("old", "new") swaps every copy of one piece of text for another.',
          'Like slicing, these methods do not change the original string. They give you a new string. If you want to keep the result, store it in a variable, for example name = name.strip().'
        ],
        example: 'Imagine a receptionist writing names in a visitor book. Someone writes "  rahul " with extra spaces and a small r. The receptionist tidies it to "Rahul" before writing it in the book. strip() and the capital-letter tools are that tidy-up step.',
        code: lines(
          'typed = "  FOOD "',
          'category = typed.strip().lower()',
          'print("[" + category + "]")',
          'print("tea".upper())',
          'print("I like coffee".replace("coffee", "tea"))',
          'print("rahul".capitalize())'
        ),
        output: lines('[food]', 'TEA', 'I like tea', 'Rahul'),
        codeNotes: [
          { line: 2, note: 'First strip() removes the spaces, then lower() makes it small letters. Methods can be chained.' },
          { line: 3, note: 'The square brackets in the text show that the spaces are really gone.' },
          { line: 6, note: 'capitalize() makes only the first letter a capital.' }
        ],
        tryIt: 'Change typed to "   Travel   " and run it. The output should be [travel] with no spaces inside the brackets.',
        check: {
          question: 'What does "  Hi  ".strip() give?',
          options: ['"Hi"', '"  Hi"', '"HI"'],
          answer: 0,
          why: 'strip() removes spaces from both the start and the end, but not from the middle, and it does not change capital letters.'
        }
      },
      {
        title: 'Searching inside text',
        say: [
          'You often need to check whether some text contains something. Python makes this very simple with the word in. "tea" in "green tea" asks "is tea inside green tea?" and gives True.',
          'startswith() and endswith() check the beginning and the end. "invoice.pdf".endswith(".pdf") is True. Apps use this to check file types or to check that a phone number starts with +91.',
          'count() tells you how many times something appears, and find() tells you the position where it first appears. find() gives -1 if it is not there at all.',
          'All these checks are case-sensitive, because Python is case-sensitive. "Tea" in "green tea" is False. If you want to ignore capitals, use lower() on both first.'
        ],
        example: 'This is like using the search box in WhatsApp to look for a word in your chats. You type a word, and it tells you whether it is there and where. Python\'s in, find() and count() do the same inside a string.',
        code: lines(
          'note = "Lunch with team, paid by card"',
          'print("card" in note)',
          'print("cash" in note)',
          'print("invoice.pdf".endswith(".pdf"))',
          'print("+919876543210".startswith("+91"))',
          'print("banana".count("a"))',
          'print(note.find("team"))'
        ),
        output: lines('True', 'False', 'True', 'True', '3', '11'),
        codeNotes: [
          { line: 2, note: 'in gives True when the smaller text is found inside the bigger one.' },
          { line: 7, note: '"team" starts at position 11 (counting from 0).' }
        ],
        tryIt: 'Add print("Card" in note) with a capital C and run it. It is False. Then try print("card" in note.lower()).',
        check: {
          question: 'What does "pay" in "Payment" give?',
          options: ['False', 'True', 'An error'],
          answer: 0,
          why: 'The check is case-sensitive. "Payment" has a capital P, so the small "pay" is not found. "pay" in "Payment".lower() would be True.'
        }
      },
      {
        title: 'Putting it together: tidy expense labels',
        say: [
          'Let us use today\'s tools on the Expense Tracker. When people type an expense, the text is often messy: extra spaces, random capital letters. Before saving it, a good program cleans it.',
          'In this example, we clean the item name with strip() and capitalize(), clean the category with strip() and lower(), and then build a neat label. We also draw a line under the title with *.',
          'This pattern, clean the input first and then use it, is used in almost every real app. Sign-up forms, search boxes and payment pages all clean what you type before they use it.',
          'In today\'s practice you will use upper() and join text with +, and you will take the first letter of a string with [0]. These are exactly the tools from this lesson.'
        ],
        example: 'Before cooking, you wash and cut vegetables. You do not throw them into the pan straight from the market bag. Cleaning text before using it is the same preparation step in programming.',
        code: lines(
          'title = "My Expenses"',
          'print(title)',
          'print("=" * len(title))',
          'item = "  masala CHAI "',
          'category = " FOOD"',
          'clean_item = item.strip().capitalize()',
          'clean_category = category.strip().lower()',
          'print(clean_item + " (" + clean_category + ")")'
        ),
        output: lines('My Expenses', '===========', 'Masala chai (food)'),
        codeNotes: [
          { line: 3, note: 'len(title) is 11, so we draw exactly 11 equals signs under the title.' },
          { line: 6, note: 'capitalize() makes the first letter capital and the rest small.' }
        ],
        tryIt: 'Change title to "Expenses for September" and run it. The line of equals signs grows to match, because it uses len(title).',
        check: {
          question: 'Why do apps call strip() on text people type?',
          options: ['To remove accidental spaces at the start and end', 'To make the text capital', 'To count the letters'],
          answer: 0,
          why: 'People often add extra spaces by mistake. strip() removes them so "Tea " and "Tea" are treated the same.'
        }
      }
    ],
    summary: [
      'Strings are text. + joins them (add your own spaces), * repeats them.',
      'len() counts characters. Positions start at 0; -1 is the last character.',
      'Slices text[start:stop] take a piece, up to but not including stop.',
      'Methods like strip(), lower(), upper() and replace() give a new, changed string.',
      'in, startswith(), endswith(), count() and find() search inside text. All are case-sensitive.'
    ],
    projectStep: {
      title: 'Expense Tracker: clean the labels',
      steps: [
        'Store a messy item name and category, with extra spaces and mixed capitals.',
        'Clean them with strip(), capitalize() and lower().',
        'Print a title with a matching line of = underneath using len().',
        'Print the clean label, like "Masala chai (food)".'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 4,
    title: 'Numbers and Maths',
    goal: 'You can calculate bills, percentages and splits in Python, and round money correctly.',
    minutes: 30,
    recap: 'Yesterday you joined, measured, sliced and cleaned text, and searched inside it with in.',
    parts: [
      {
        title: 'The four basic operators',
        say: [
          'Python is an excellent calculator. The four basic operators are + for add, - for subtract, * for multiply and / for divide. The star is used for multiply because the keyboard has no × sign.',
          'Python follows the same order as school maths: multiply and divide happen before add and subtract. So 10 + 5 * 2 is 20, not 30. If you want the addition first, use brackets: (10 + 5) * 2 is 30.',
          'One surprise: dividing with / always gives a float, even when the answer is a whole number. 10 / 2 gives 5.0, not 5. This is Python being careful, because division often does not come out even.',
          'When in doubt, add brackets. Brackets make the order clear to Python and to anyone reading your code, and they never hurt.'
        ],
        example: 'At a shop, "3 plates of idli at 40 each, plus a 20 rupee coffee" is 3 × 40 + 20 = 140. Everyone multiplies first without thinking about it. Python follows the same rule.',
        code: lines(
          'print(3 * 40 + 20)',
          'print(10 + 5 * 2)',
          'print((10 + 5) * 2)',
          'print(10 / 2)',
          'print(7 / 2)'
        ),
        output: lines('140', '20', '30', '5.0', '3.5'),
        codeNotes: [
          { line: 2, note: 'Multiply first: 5 * 2 = 10, then 10 + 10 = 20.' },
          { line: 4, note: '/ always gives a decimal answer, so 5.0.' }
        ],
        tryIt: 'Write your own bill: 2 dosas at 60 each and 3 teas at 15 each. The answer should be 165.',
        check: {
          question: 'What does 2 + 3 * 4 give in Python?',
          options: ['14', '20', '24'],
          answer: 0,
          why: 'Multiplication happens first: 3 * 4 = 12, then 2 + 12 = 14. Use brackets, (2 + 3) * 4, to get 20.'
        }
      },
      {
        title: 'Floor division and remainder',
        say: [
          'Python has two more operators that are very useful. // is floor division: it divides and throws away the decimal part. 17 // 5 is 3.',
          '% is the remainder operator, sometimes called modulo. It tells you what is left over after dividing. 17 % 5 is 2, because 5 goes into 17 three times with 2 left over.',
          'These two work well together. If you have 130 minutes, 130 // 60 is 2 hours and 130 % 60 is 10 minutes. If you pack 50 laddoos into boxes of 12, 50 // 12 is 4 full boxes and 50 % 12 is 2 left over.',
          'A very common use of %: a number is even if number % 2 is 0. You will use this idea again in the interview practice on Day 30.'
        ],
        example: 'Sharing 17 chocolates between 5 friends: each friend gets 3 whole chocolates (17 // 5), and 2 chocolates are left in the box (17 % 5).',
        code: lines(
          'print(17 // 5)',
          'print(17 % 5)',
          'minutes = 130',
          'print(minutes // 60, "hours and", minutes % 60, "minutes")',
          'print(10 % 2 == 0)',
          'print(7 % 2 == 0)'
        ),
        output: lines('3', '2', '2 hours and 10 minutes', 'True', 'False'),
        codeNotes: [
          { line: 4, note: '// gives the whole hours, % gives the minutes left over.' },
          { line: 5, note: 'An even number has remainder 0 when divided by 2.' }
        ],
        tryIt: 'Change minutes to 245 and predict the output before running. It should be 4 hours and 5 minutes.',
        check: {
          question: 'What is 20 % 6?',
          options: ['2', '3', '3.33'],
          answer: 0,
          why: '6 goes into 20 three times (18), and 20 - 18 leaves 2. % gives that remainder.'
        }
      },
      {
        title: 'Percentages: GST and discounts',
        say: [
          'Money apps calculate percentages all the time: tax, discounts and tips. A percentage is just a multiplication. 18 percent of a price is price * 18 / 100, or price * 0.18.',
          'To add 18 percent GST to a price, you can add the tax to the price: price + price * 0.18. A shorter way is price * 1.18, because the price plus 18 percent is 118 percent of the price.',
          'A discount works the other way. 10 percent off means you pay 90 percent: price * 0.9. Store these numbers in variables with clear names, like gst_rate = 0.18, so the code explains itself.',
          'You will notice some answers have long decimals, like 117.9882. Money should show 2 decimal places. In the next part you will learn how to round correctly.'
        ],
        example: 'A 1000 rupee shirt has a 20 percent sale. You pay 80 percent of the price: 1000 × 0.8 = 800. Then 5 percent GST on 800 is 40, so the bill is 840.',
        code: lines(
          'price = 1000',
          'gst_rate = 0.18',
          'gst = price * gst_rate',
          'print("GST:", gst)',
          'print("Total:", price + gst)',
          'sale_price = price * 0.8',
          'print("After 20% off:", sale_price)'
        ),
        output: lines('GST: 180.0', 'Total: 1180.0', 'After 20% off: 800.0'),
        codeNotes: [
          { line: 2, note: 'A named rate makes the calculation easy to read and easy to change.' },
          { line: 6, note: '20% off means you pay 80%, so multiply by 0.8.' }
        ],
        tryIt: 'Change gst_rate to 0.05 (5% GST, used for many food items) and run again. GST becomes 50.0.',
        check: {
          question: 'How do you work out a price after a 25% discount?',
          options: ['price * 0.75', 'price * 0.25', 'price - 25'],
          answer: 0,
          why: '25% off means you pay the other 75%, so multiply by 0.75. price * 0.25 is the discount amount, not the new price.'
        }
      },
      {
        title: 'Rounding money',
        say: [
          'Computers store decimal numbers in a way that is almost exact, but not perfectly exact. So 0.1 + 0.2 in Python gives 0.30000000000000004. This is not a Python bug; almost every programming language does this.',
          'For money, you should round to 2 decimal places before showing or comparing values. round(value, 2) rounds to 2 places. round(117.9882, 2) gives 117.99.',
          'round() with no second number rounds to a whole number: round(4.6) is 5. Be careful: when a number is exactly halfway, Python rounds to the nearest even number, so round(2.5) is 2. For money with 2 decimals this rarely matters in practice.',
          'A simple rule: do your maths, then round the final answer once. Rounding at every step can add up small errors.'
        ],
        example: 'When a shop bill comes to 117.9882 rupees, nobody pays the 0.0082. The cashier rounds to paise, 117.99. round(value, 2) is the cashier doing that step for you.',
        code: lines(
          'print(0.1 + 0.2)',
          'print(round(0.1 + 0.2, 2))',
          'price = 99.99',
          'total = price * 1.18',
          'print(total)',
          'print(round(total, 2))',
          'print(round(4.6))'
        ),
        output: lines('0.30000000000000004', '0.3', '117.98819999999999', '117.99', '5'),
        codeNotes: [
          { line: 1, note: 'A tiny error from how computers store decimals. Rounding fixes it for display.' },
          { line: 6, note: 'Round money to 2 places at the end.' }
        ],
        tryIt: 'Add print(round(1000 / 3, 2)) and run it. You should see 333.33.',
        check: {
          question: 'What does round(45.678, 2) give?',
          options: ['45.68', '45.67', '46'],
          answer: 0,
          why: 'Rounding to 2 places looks at the third decimal (8), which is 5 or more, so the second decimal goes up: 45.68.'
        }
      },
      {
        title: 'Useful number tools: abs, min, max, sum',
        say: [
          'Python has a few built-in number tools you will use constantly. abs() gives the distance from zero, so abs(-250) is 250. It is useful when you want the size of a difference and do not care if it is up or down.',
          'min() gives the smallest of several values and max() gives the largest. min(20, 45, 120) is 20. These work on any number of values.',
          'sum() adds up a group of numbers. You will use it a lot next week with lists. For now, you can write sum([20, 45, 120]) with square brackets around the numbers, and it gives 185.',
          'Remember that these are tools, called functions. You give them values inside the brackets, and they give an answer back. Tomorrow and on Day 7 you will learn to write your own functions like these.'
        ],
        example: 'When you compare prices of the same phone on three shopping sites, you are doing min(): picking the smallest price. When you check your biggest expense this month, you are doing max().',
        code: lines(
          'print(abs(-250))',
          'print(min(20, 45, 120))',
          'print(max(20, 45, 120))',
          'print(sum([20, 45, 120]))',
          'budget = 5000',
          'spent = 5320',
          'print("Over by", abs(budget - spent))'
        ),
        output: lines('250', '20', '120', '185', 'Over by 320'),
        codeNotes: [
          { line: 4, note: 'The square brackets make a list of numbers. You will learn lists on Day 8.' },
          { line: 7, note: 'budget - spent is -320. abs() turns it into 320.' }
        ],
        tryIt: 'Find the cheapest of three phone prices: print(min(15999, 14499, 15250)). The answer should be 14499.',
        check: {
          question: 'What does max(3, 9, 4) give?',
          options: ['9', '3', '16'],
          answer: 0,
          why: 'max() gives the largest value. 16 would be the sum, which is what sum() gives.'
        }
      },
      {
        title: 'Putting it together: a restaurant bill',
        say: [
          'Let us combine today\'s tools into something practical: a restaurant bill with GST, a tip and a split between friends. This is exactly the kind of calculation money apps do.',
          'Look at the steps. First the food total with * and +. Then GST with a named rate. Then the grand total. Then each person\'s share with /, and finally round() so the money looks right.',
          'Notice how each step is stored in a variable with a clear name. If a friend asks "how much was the GST?", the answer is right there in the gst variable. Breaking a calculation into named steps makes it easy to check.',
          'In today\'s practice, you will add GST and round the result, and you will split a bill and round each share. You have now seen every piece you need.'
        ],
        example: 'After dinner with four friends, the bill is 1180 rupees including GST. Someone opens a calculator, divides by 4, and says "295 each". Your Python program does this same thing, step by step.',
        code: lines(
          'dosa = 60',
          'coffee = 30',
          'food = 4 * dosa + 4 * coffee',
          'gst = food * 0.05',
          'grand_total = food + gst',
          'people = 3',
          'share = round(grand_total / people, 2)',
          'print("Food:", food)',
          'print("GST:", gst)',
          'print("Total:", grand_total)',
          'print("Each pays:", share)'
        ),
        output: lines('Food: 360', 'GST: 18.0', 'Total: 378.0', 'Each pays: 126.0'),
        codeNotes: [
          { line: 3, note: '4 dosas and 4 coffees. Multiply first, then add.' },
          { line: 7, note: 'Divide, then round the share to 2 decimal places.' }
        ],
        tryIt: 'Change people to 7 and run it. The share becomes 54.0. Then change it to 9 and see 42.0.',
        check: {
          question: 'Why store each step (food, gst, grand_total) in its own variable?',
          options: ['It makes the calculation easy to read and check', 'Python needs a variable for every number', 'It makes the program run faster'],
          answer: 0,
          why: 'Named steps show exactly how the answer was reached, so you and others can check each part. Python does not require it.'
        }
      }
    ],
    summary: [
      '+, -, * and / follow school maths order. Use brackets to be clear.',
      '/ always gives a float. // gives the whole part and % gives the remainder.',
      'Percentages are multiplications: add 18% GST with price * 1.18.',
      'Decimals are not perfectly exact. Round money with round(value, 2) at the end.',
      'abs(), min(), max() and sum() are handy built-in number tools.'
    ],
    projectStep: {
      title: 'Expense Tracker: money maths',
      steps: [
        'Store three expenses and add them to a total.',
        'Work out how much of a monthly budget is used, as a percentage: round(total / budget * 100, 2).',
        'Print the biggest expense amount with max().',
        'Print the average per expense, rounded to 2 places.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 5,
    title: 'Making Decisions',
    goal: 'You can make a program choose what to do with if, elif and else, and combine conditions with and, or and not.',
    minutes: 30,
    recap: 'Yesterday you calculated bills, GST and splits, used // and %, and rounded money with round().',
    parts: [
      {
        title: 'if: do something only when a condition is True',
        say: [
          'So far, every line of your programs ran every time. Real programs need to make choices. If the balance is too low, show a warning. If the bill is big enough, give free delivery. The tool for this is if.',
          'You write if, then a condition, then a colon. The lines that belong to the if go underneath, pushed in by four spaces. This push-in is called indentation. Those indented lines run only when the condition is True.',
          'Indentation is not just for looks in Python. It is how Python knows which lines belong to the if. Other languages use curly brackets for this; Python uses spaces. When the indentation ends, the if ends.',
          'The condition is any True or False question, like the ones you wrote on Day 2: amount > 1000, category == "food", balance < 0.'
        ],
        example: 'A security guard at an office checks your ID. If you have an ID card, the guard opens the gate. If you do not, the gate simply stays closed. The if in Python is that guard: the indented lines run only when the check passes.',
        code: lines(
          'balance = 150',
          'if balance < 200:',
          '    print("Warning: low balance")',
          '    print("Please add money")',
          'print("Balance:", balance)'
        ),
        output: lines('Warning: low balance', 'Please add money', 'Balance: 150'),
        codeNotes: [
          { line: 2, note: 'The condition, followed by a colon. Do not forget the colon.' },
          { line: 3, note: 'Indented by 4 spaces, so it belongs to the if.' },
          { line: 5, note: 'Not indented, so it always runs, whatever the balance is.' }
        ],
        tryIt: 'Change balance to 900 and run it. Only the last line prints, because the condition is now False.',
        check: {
          question: 'How does Python know which lines belong to an if?',
          options: ['They are indented (pushed in with spaces) under the if', 'They are in capital letters', 'They are written on the same line'],
          answer: 0,
          why: 'Python uses indentation. Lines pushed in under the if, usually by 4 spaces, belong to it and run only when the condition is True.'
        }
      },
      {
        title: 'else: what to do otherwise',
        say: [
          'Often you want to do one thing when a condition is True and a different thing when it is False. For that, add else after the if block.',
          'else is written at the same level as the if, not indented, and it also ends with a colon. The lines under else are indented, just like under if. Python runs exactly one of the two blocks, never both.',
          'else does not have a condition. It simply catches every case that the if did not. Think of it as "in every other case".',
          'A very common mistake is putting else at the wrong indentation. If you get an IndentationError or SyntaxError near an else, check that else lines up exactly with its if.'
        ],
        example: 'At a restaurant: if you order more than 499 rupees, delivery is free, else you pay 40 rupees. Every order gets exactly one of the two answers. Nobody gets both, and nobody gets neither.',
        code: lines(
          'bill = 350',
          'if bill >= 499:',
          '    fee = 0',
          'else:',
          '    fee = 40',
          'print("Delivery fee:", fee)',
          'print("Pay:", bill + fee)'
        ),
        output: lines('Delivery fee: 40', 'Pay: 390'),
        codeNotes: [
          { line: 4, note: 'else lines up with if and ends with a colon.' },
          { line: 5, note: 'This runs because 350 is not 499 or more.' }
        ],
        tryIt: 'Change bill to 600 and predict the output before running. It should be Delivery fee: 0 and Pay: 600.',
        check: {
          question: 'With an if and an else, how many of the two blocks run?',
          options: ['Exactly one', 'Both', 'Sometimes none'],
          answer: 0,
          why: 'If the condition is True, the if block runs. Otherwise the else block runs. It is always exactly one of them.'
        }
      },
      {
        title: 'elif: more than two choices',
        say: [
          'Sometimes there are more than two possibilities. For example, grades: 75 and above is Distinction, 60 and above is First class, 40 and above is Pass, and below that is Fail. For this, Python has elif, short for "else if".',
          'Python checks the conditions from top to bottom. The first one that is True wins, its block runs, and Python skips all the rest. If none is True, the else block runs.',
          'Because the first True condition wins, the order matters. Check the highest grade first. If you checked score >= 40 first, a score of 90 would get "Pass", because 90 is also more than 40.',
          'You can have as many elif blocks as you like, and the else at the end is optional. Without an else, it is possible that no block runs.'
        ],
        example: 'A ticket counter has prices by age: under 5 is free, under 12 is a child ticket, 60 and above is a senior ticket, everyone else pays the full price. The clerk checks from the top and stops at the first rule that fits.',
        code: lines(
          'score = 68',
          'if score >= 75:',
          '    result = "Distinction"',
          'elif score >= 60:',
          '    result = "First class"',
          'elif score >= 40:',
          '    result = "Pass"',
          'else:',
          '    result = "Fail"',
          'print(score, "->", result)'
        ),
        output: '68 -> First class',
        codeNotes: [
          { line: 2, note: '68 is not 75 or more, so Python moves on.' },
          { line: 4, note: '68 is 60 or more, so this block runs and the rest are skipped.' }
        ],
        tryIt: 'Try the scores 90, 45 and 12. Then swap the order so score >= 40 is checked first, and see why 90 wrongly becomes "Pass". Swap it back.',
        check: {
          question: 'In an if / elif / else chain, which block runs?',
          options: ['The first one whose condition is True', 'Every block whose condition is True', 'The last one whose condition is True'],
          answer: 0,
          why: 'Python checks from the top and stops at the first True condition. The rest are skipped, even if they would also be True.'
        }
      },
      {
        title: 'and, or, not: combining conditions',
        say: [
          'Sometimes one condition is not enough. and needs both sides to be True: age >= 18 and has_id. or needs at least one side to be True: is_weekend or is_holiday.',
          'not flips a condition: not is_member is True when is_member is False. It reads almost like English, which is one of the nice things about Python.',
          'You can write long conditions, but keep them readable. If a condition has more than two or three parts, store parts in well-named variables first. is_big = amount > 1000 is easier to read than a long line of symbols.',
          'Python also lets you write a range check in one go: 18 <= age <= 60 means age is between 18 and 60, including both ends.'
        ],
        example: 'To withdraw cash from an ATM, you need your card and the right PIN: both must be correct, so that is and. To enter a members-only lounge, you need a membership card or a first-class ticket: either one is enough, so that is or.',
        code: lines(
          'amount = 1500',
          'category = "food"',
          'is_big = amount > 1000',
          'print(is_big and category == "food")',
          'print(category == "travel" or category == "food")',
          'print(not is_big)',
          'age = 25',
          'print(18 <= age <= 60)'
        ),
        output: lines('True', 'True', 'False', 'True'),
        codeNotes: [
          { line: 4, note: 'Both are True, so and gives True.' },
          { line: 5, note: 'The second part is True, so or gives True.' },
          { line: 8, note: 'Is age between 18 and 60? A neat Python shortcut.' }
        ],
        tryIt: 'Change category to "shopping" and predict each answer before running. The first two become False.',
        check: {
          question: 'When is A or B True?',
          options: ['When at least one of A and B is True', 'Only when both are True', 'Only when both are False'],
          answer: 0,
          why: 'or needs just one True side. and is the one that needs both sides to be True.'
        }
      },
      {
        title: 'Short one-line choices',
        say: [
          'When an if/else only chooses between two values, Python lets you write it on one line: fee = 0 if bill >= 499 else 40. Read it as "fee is 0 if the bill is 499 or more, else 40".',
          'This is called a conditional expression. It does exactly the same as the four-line version with if and else. It is just shorter, and you will see it often in real Python code.',
          'Use the short form only for simple choices between two values. If you need to run several lines, or check more than two cases, the normal if / elif / else is much easier to read.',
          'Being able to read both forms is important, because in a job you will read far more code than you write, and other developers use both styles.'
        ],
        example: 'It is like saying in one sentence, "Carry an umbrella if it is raining, otherwise sunglasses", instead of writing a full paragraph about it. Same decision, shorter to say.',
        code: lines(
          'bill = 520',
          'fee = 0 if bill >= 499 else 40',
          'print("Fee:", fee)',
          'balance = -200',
          'status = "OK" if balance >= 0 else "Overdrawn"',
          'print(status)'
        ),
        output: lines('Fee: 0', 'Overdrawn'),
        codeNotes: [
          { line: 2, note: 'Value if condition else other value, all on one line.' }
        ],
        tryIt: 'Rewrite line 5 as a normal if / else with four lines, and check you get the same output. Then keep whichever you find easier to read.',
        check: {
          question: 'What is label after label = "big" if 50 > 100 else "small"?',
          options: ['"small"', '"big"', 'An error'],
          answer: 0,
          why: '50 > 100 is False, so the value after else is used: "small".'
        }
      },
      {
        title: 'Putting it together: a budget checker',
        say: [
          'Let us finish today with a small budget checker for the Expense Tracker. It adds up the day\'s spending, compares it with a daily budget, and gives a different message for each situation.',
          'Look at the order of the checks. The worst case, going over budget, is checked first. Then "close to the limit", then everything else. Just like the grades example, the order makes sure each case lands in the right place.',
          'After today\'s practice comes your first test, covering Days 1 to 5. It has short questions, and each one comes with an explanation. If you do not pass, you can read the explanations and try again. The test is there to help you notice what to review, not to catch you out.',
          'In today\'s practice, you will write two small decisions: Pass or Fail from a score, and a delivery fee from a bill. Both are one if and one else.'
        ],
        example: 'A fuel gauge in a car does the same thing. Nearly empty: a red warning light. Low: a yellow light. Otherwise: no light. It checks the most urgent case first.',
        code: lines(
          'daily_budget = 300',
          'spent = 20 + 45 + 180',
          'if spent > daily_budget:',
          '    print("Over budget by", spent - daily_budget)',
          'elif spent >= daily_budget * 0.8:',
          '    print("Careful: you have used", round(spent / daily_budget * 100), "percent")',
          'else:',
          '    print("Good: you have", daily_budget - spent, "left today")'
        ),
        output: 'Careful: you have used 82 percent',
        codeNotes: [
          { line: 3, note: 'The most serious case is checked first.' },
          { line: 5, note: '80% of the budget is 240. 245 is more than that, so this block runs.' }
        ],
        tryIt: 'Change 180 to 300 and run it: you are over budget. Then change it to 50: you get the "Good" message.',
        check: {
          question: 'Why is the "over budget" check written first?',
          options: ['So the most serious case is caught before the milder checks', 'Python requires the biggest number first', 'It makes no difference'],
          answer: 0,
          why: 'Python runs the first True block. Checking the most serious case first makes sure an over-budget day is not reported as just "careful".'
        }
      }
    ],
    summary: [
      'if runs the indented lines only when its condition is True. Remember the colon.',
      'else runs when the if condition is False. Exactly one of the two blocks runs.',
      'elif adds more choices. Python stops at the first True condition, so order matters.',
      'and needs both sides True, or needs at least one, not flips True and False.',
      'value_if_true if condition else value_if_false chooses between two values on one line.'
    ],
    projectStep: {
      title: 'Expense Tracker: budget warnings',
      steps: [
        'Store a daily budget and today\'s total spending.',
        'Print "Over budget" with the amount if you spent more than the budget.',
        'Print a "Careful" message when you used 80% or more.',
        'Otherwise print how much is left today.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 6,
    title: 'Loops: Doing Things Again and Again',
    goal: 'You can repeat work with for and while loops, and add up or count values with the accumulator pattern.',
    minutes: 30,
    recap: 'Yesterday you made decisions with if, elif and else, and combined conditions with and, or and not.',
    parts: [
      {
        title: 'Why we need loops',
        say: [
          'Imagine you have 100 expenses and want to print each one. You could write 100 print lines, but that is slow, boring and easy to get wrong. Computers are good at repeating work, and a loop is how you tell Python to repeat.',
          'Today you meet the for loop. It goes through a group of values one at a time and runs the same indented lines for each one. When there are no values left, the loop ends and Python carries on with the next line.',
          'To have something to loop over, you need a group of values. The simplest group is a list: values inside square brackets, separated by commas, like [20, 45, 120]. You will learn lists properly on Day 8. Today you just loop over them.',
          'Like if, a for line ends with a colon, and the lines that repeat are indented by four spaces underneath. The indentation tells Python which lines are inside the loop.'
        ],
        example: 'A teacher correcting 40 answer sheets does the same steps for each sheet: pick it up, check the answers, write the marks, put it on the done pile. She does not need 40 different instructions, just one set of steps repeated for each sheet. That is a loop.',
        code: lines(
          'expenses = [20, 45, 120]',
          'for amount in expenses:',
          '    print("Expense:", amount)',
          'print("Done")'
        ),
        output: lines('Expense: 20', 'Expense: 45', 'Expense: 120', 'Done'),
        codeNotes: [
          { line: 1, note: 'A list: three values in square brackets.' },
          { line: 2, note: 'Each time round the loop, amount holds the next value from the list.' },
          { line: 4, note: 'Not indented, so it runs once, after the loop finishes.' }
        ],
        tryIt: 'Add two more numbers to the list, for example 60 and 300, and run it. The loop prints five lines without you changing anything else.',
        check: {
          question: 'How many times does the indented line run in: for x in [5, 6, 7, 8]:',
          options: ['4 times', '1 time', '8 times'],
          answer: 0,
          why: 'A for loop runs its indented lines once for every value in the list. The list has four values, so four times.'
        }
      },
      {
        title: 'Looping over text and range()',
        say: [
          'A for loop can go through more than lists. If you loop over a string, you get one character at a time. This is useful for checking or counting letters.',
          'Very often you just want to repeat something a number of times, or count. For that, Python has range(). range(5) gives the numbers 0, 1, 2, 3 and 4. Notice it starts at 0 and stops before 5, the same "up to but not including" rule you saw with slicing.',
          'range can also take a start: range(1, 6) gives 1 to 5. And a step: range(0, 20, 5) gives 0, 5, 10 and 15. The step is how much to jump each time.',
          'The loop variable, the name after for, can be any name you like. Use a meaningful one, like amount or day. For simple counting, programmers often use i, short for index.'
        ],
        example: 'range is like the numbered stops on a bus route. range(1, 6) is "stop 1 to stop 5". The bus visits each stop in order and stops before stop 6. A step of 2 would be an express bus that skips every other stop.',
        code: lines(
          'for letter in "Tea":',
          '    print(letter)',
          'for day in range(1, 4):',
          '    print("Day", day)',
          'for n in range(0, 20, 5):',
          '    print(n)'
        ),
        output: lines('T', 'e', 'a', 'Day 1', 'Day 2', 'Day 3', '0', '5', '10', '15'),
        codeNotes: [
          { line: 1, note: 'Looping over a string gives one character at a time.' },
          { line: 3, note: 'range(1, 4) gives 1, 2 and 3. It stops before 4.' },
          { line: 5, note: 'Start at 0, stop before 20, jump by 5.' }
        ],
        tryIt: 'Print the 7 times table: for i in range(1, 11): print(7, "x", i, "=", 7 * i). Put the print on its own indented line.',
        check: {
          question: 'Which numbers does range(2, 6) give?',
          options: ['2, 3, 4, 5', '2, 3, 4, 5, 6', '0, 1, 2, 3, 4, 5'],
          answer: 0,
          why: 'range starts at the first number and stops before the second one. So 2 up to 5, not including 6.'
        }
      },
      {
        title: 'The accumulator pattern: running totals',
        say: [
          'One of the most useful patterns in programming is the accumulator. You start a variable at zero before the loop, and inside the loop you add to it each time. When the loop finishes, the variable holds the total.',
          'The start line must be before the loop, not inside it. If you write total = 0 inside the loop, it resets to zero every time round, and you end up with only the last value. This is one of the most common beginner bugs.',
          'The same pattern works for counting. Start count = 0, and add 1 each time something happens. Combined with an if inside the loop, you can count only the values you care about, like expenses over 100.',
          'You already know sum() does totals for you. So why learn this? Because the accumulator works for anything: totals, counts, the biggest value so far, or building up a message. sum() only does one of those jobs.'
        ],
        example: 'A shopkeeper at the end of the day starts with an empty counting sheet. For each bill in the drawer, she adds the amount to her running total. When the last bill is added, the sheet shows the day\'s sales. She wrote "0" once at the start, not before every bill.',
        code: lines(
          'expenses = [20, 45, 120, 300, 60]',
          'total = 0',
          'big = 0',
          'for amount in expenses:',
          '    total = total + amount',
          '    if amount > 100:',
          '        big = big + 1',
          'print("Total:", total)',
          'print("Expenses over 100:", big)'
        ),
        output: lines('Total: 545', 'Expenses over 100: 2'),
        codeNotes: [
          { line: 2, note: 'Start at zero, before the loop.' },
          { line: 5, note: 'Add each amount to the running total.' },
          { line: 7, note: 'Indented twice: inside the if, which is inside the loop. Counts only the big ones.' }
        ],
        tryIt: 'Move total = 0 inside the loop (indent it under the for line, above line 5) and run it. The total is now just 60, the last value. Move it back.',
        check: {
          question: 'Where should total = 0 go when adding up a list with a loop?',
          options: ['Before the loop', 'Inside the loop', 'After the loop'],
          answer: 0,
          why: 'It must be set once, before the loop starts. Inside the loop it would reset to 0 every time round.'
        }
      },
      {
        title: 'while loops',
        say: [
          'A for loop repeats once for each value in a group. A while loop is different: it repeats as long as a condition is True. It checks the condition before every round, and stops as soon as the condition becomes False.',
          'while loops are useful when you do not know in advance how many rounds you need. For example: keep saving 500 rupees a month until you reach 3000. How many months is that? The loop works it out.',
          'The big danger with while is an endless loop. If nothing inside the loop ever makes the condition False, the loop runs forever and the program freezes. Always check that something inside the loop moves you towards the end.',
          'In the lesson editor, a program that runs too long is stopped after a few seconds, so you cannot break anything. But in real programs, endless loops are a serious bug, so build the habit of checking now.'
        ],
        example: 'Filling a bucket with a mug: while the bucket is not full, pour one more mug. You do not count the mugs in advance; you just keep going until the condition "not full" stops being true. If the bucket had a hole, you would pour forever.',
        code: lines(
          'savings = 0',
          'months = 0',
          'while savings < 3000:',
          '    savings = savings + 500',
          '    months = months + 1',
          'print("Months needed:", months)',
          'print("Saved:", savings)'
        ),
        output: lines('Months needed: 6', 'Saved: 3000'),
        codeNotes: [
          { line: 3, note: 'Checked before every round. When savings reaches 3000, the loop stops.' },
          { line: 4, note: 'This line moves us towards the end. Without it, the loop would never stop.' }
        ],
        tryIt: 'Change the monthly saving from 500 to 700. Predict the months before running. It should be 5 months, with 3500 saved.',
        check: {
          question: 'What makes a while loop stop?',
          options: ['Its condition becomes False', 'It has run 10 times', 'It reaches the end of a list'],
          answer: 0,
          why: 'A while loop keeps going as long as its condition is True, and stops as soon as the condition is False.'
        }
      },
      {
        title: 'break and continue',
        say: [
          'Sometimes you want to leave a loop early. break stops the loop immediately, and Python continues with the first line after the loop. It is useful when you are searching for something and have found it.',
          'continue is different. It skips the rest of the current round and jumps to the next value. The loop keeps going. It is useful for ignoring values you do not want, like zero or negative amounts.',
          'Both break and continue are usually inside an if, because you only want to stop or skip in certain cases.',
          'Use them when they make the code simpler. If a loop has many breaks and continues, it can become hard to follow, and a clearer if is often better.'
        ],
        example: 'Looking for your keys in a row of drawers: you open them one by one, and as soon as you find the keys, you stop. That is break. Sorting mangoes: if a mango is spoiled, you skip it and move on to the next one. That is continue.',
        code: lines(
          'expenses = [20, 0, 45, -5, 120, 900, 30]',
          'total = 0',
          'for amount in expenses:',
          '    if amount <= 0:',
          '        continue',
          '    if amount > 500:',
          '        print("Found a large expense:", amount)',
          '        break',
          '    total = total + amount',
          'print("Total before the large one:", total)'
        ),
        output: lines('Found a large expense: 900', 'Total before the large one: 185'),
        codeNotes: [
          { line: 5, note: 'Skip zero and negative amounts, and go to the next value.' },
          { line: 8, note: 'Stop the whole loop. The 30 at the end is never looked at.' }
        ],
        tryIt: 'Change 900 to 90 and run it. Now no amount is over 500, so the loop never breaks and the total includes every positive amount: 305.',
        check: {
          question: 'What does continue do inside a loop?',
          options: ['Skips the rest of this round and goes to the next value', 'Stops the loop completely', 'Starts the loop again from the first value'],
          answer: 0,
          why: 'continue jumps to the next round. break is the one that stops the loop completely.'
        }
      },
      {
        title: 'Putting it together: a spending report',
        say: [
          'Let us put today\'s loops into the Expense Tracker. We have a list of amounts and want a small report: each expense numbered, the total, the number of big expenses and the largest one.',
          'To number the lines, we keep a counter that goes up by one each round. To find the largest, we use the accumulator idea again: keep the biggest seen so far, and replace it whenever we see something bigger.',
          'Notice that this one loop does four jobs at the same time. That is common in real code: you go through the data once and collect everything you need.',
          'In today\'s practice you will write two small loops: one that adds up a list, and one that counts the values above a limit. They are the two halves of the loop in this example.'
        ],
        example: 'A cricket scorer watches every ball of an innings. On each ball, they update the total runs, the ball count and the highest score so far. One pass through the match fills the whole scorecard.',
        code: lines(
          'expenses = [20, 45, 120, 300, 60]',
          'number = 0',
          'total = 0',
          'largest = 0',
          'for amount in expenses:',
          '    number += 1',
          '    total += amount',
          '    if amount > largest:',
          '        largest = amount',
          '    print(str(number) + ". Rs", amount)',
          'print("Total:", total)',
          'print("Largest:", largest)'
        ),
        output: lines('1. Rs 20', '2. Rs 45', '3. Rs 120', '4. Rs 300', '5. Rs 60', 'Total: 545', 'Largest: 300'),
        codeNotes: [
          { line: 6, note: 'The counter goes 1, 2, 3... one per expense.' },
          { line: 8, note: 'Keep the biggest amount seen so far.' }
        ],
        tryIt: 'Add a count of expenses under 50, using a new variable small = 0 before the loop and an if inside it. Print it at the end. The answer should be 2.',
        check: {
          question: 'How does the loop find the largest expense?',
          options: ['It keeps the biggest value so far and replaces it when it sees a bigger one', 'It sorts the list first', 'It uses the last value in the list'],
          answer: 0,
          why: 'largest starts at 0 and is replaced whenever a bigger amount appears. At the end, it holds the biggest one.'
        }
      }
    ],
    summary: [
      'A for loop runs its indented lines once for each value in a list, string or range.',
      'range(start, stop, step) counts from start up to, but not including, stop.',
      'The accumulator pattern: start a total or count before the loop, add to it inside.',
      'A while loop repeats while its condition is True. Make sure something moves it towards the end.',
      'break leaves the loop early; continue skips to the next round.'
    ],
    projectStep: {
      title: 'Expense Tracker: a loop report',
      steps: [
        'Store a list of at least five expense amounts.',
        'Loop over it to print each one with a number in front.',
        'Work out the total and the largest expense in the same loop.',
        'Count how many expenses are over 100 and print it.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 7,
    title: 'Functions: Your Own Tools',
    goal: 'You can write your own functions with parameters, default values and return, and know why return is different from print.',
    minutes: 30,
    recap: 'Yesterday you repeated work with for and while loops and built totals and counts with the accumulator pattern.',
    parts: [
      {
        title: 'What a function is',
        say: [
          'You have been using functions since Day 1: print, len, round, max. Each one is a named tool that does one job. Today you learn to write your own.',
          'A function is a named set of steps. You write the steps once, give them a name, and then use that name whenever you need those steps. Using a function is called calling it.',
          'You create a function with def, short for define, then the name, round brackets, and a colon. The steps go underneath, indented, just like with if and for. Defining a function does not run it. It only runs when you call it by name with brackets.',
          'Functions are how real programs are organised. Instead of one long list of instructions, a program is made of many small functions, each with a clear name and one job. This makes code easier to read, test and fix.'
        ],
        example: 'A function is like a recipe card for masala chai. You write the recipe once. Whenever someone wants chai, you do not re-invent it; you just say "make chai" and follow the card. Writing the card is defining the function; making the chai is calling it.',
        code: lines(
          'def show_title():',
          '    print("=== My Expense Tracker ===")',
          '    print("Track every rupee")',
          '',
          'show_title()',
          'print("...some other work...")',
          'show_title()'
        ),
        output: lines('=== My Expense Tracker ===', 'Track every rupee', '...some other work...', '=== My Expense Tracker ===', 'Track every rupee'),
        codeNotes: [
          { line: 1, note: 'def starts a function definition. Nothing prints yet.' },
          { line: 5, note: 'Calling the function runs its two indented lines.' },
          { line: 7, note: 'Called again: the same steps run again.' }
        ],
        tryIt: 'Delete the two calls on lines 5 and 7 and run it. Only "...some other work..." prints, because defining a function does not run it. Then put the calls back.',
        check: {
          question: 'When do the lines inside a function run?',
          options: ['When the function is called by its name with brackets', 'As soon as Python reads the def line', 'Only at the end of the program'],
          answer: 0,
          why: 'def only defines the function. Its lines run each time you call it, like show_title().'
        }
      },
      {
        title: 'Parameters: giving a function information',
        say: [
          'Most functions need some information to do their job. print needs to know what to print; round needs a number. The names inside the brackets of a def are called parameters. They are like empty boxes that get filled when the function is called.',
          'When you call the function, the values you put in the brackets are called arguments. Python puts the first argument into the first parameter, the second into the second, and so on. The order matters.',
          'Inside the function, parameters work just like variables. When the function finishes, they disappear. Each call gets fresh boxes with its own values.',
          'A function can have as many parameters as it needs, separated by commas. Give them clear names, because they tell the reader what information the function expects.'
        ],
        example: 'A courier form has blanks for name, address and phone. The form is the same for every parcel; only what you write in the blanks changes. Parameters are the blanks; arguments are what you write in them for this parcel.',
        code: lines(
          'def show_expense(item, amount):',
          '    print(item, "costs Rs", amount)',
          '',
          'show_expense("Tea", 20)',
          'show_expense("Bus", 45)',
          'show_expense(120, "Lunch")'
        ),
        output: lines('Tea costs Rs 20', 'Bus costs Rs 45', '120 costs Rs Lunch'),
        codeNotes: [
          { line: 1, note: 'Two parameters: item and amount.' },
          { line: 4, note: '"Tea" goes into item and 20 goes into amount.' },
          { line: 6, note: 'Wrong order: Python does not know what you meant, so the output is nonsense.' }
        ],
        tryIt: 'Fix line 6 by swapping the two arguments. Then add a third call for your own expense.',
        check: {
          question: 'In def greet(name, city), what is name when you call greet("Ravi", "Pune")?',
          options: ['"Ravi"', '"Pune"', 'Nothing until you set it'],
          answer: 0,
          why: 'Arguments are matched to parameters in order. The first argument, "Ravi", goes into the first parameter, name.'
        }
      },
      {
        title: 'return: giving back an answer',
        say: [
          'The functions so far printed something. But usually you want a function to work out an answer and give it back, so you can use it in the rest of your program. That is what return does.',
          'return sends a value back to the place where the function was called. You can store it in a variable, print it, or use it in a calculation. len("Tea") returns 3; that is why you can write len("Tea") + 1.',
          'When Python reaches a return line, the function ends immediately. Any lines after it inside the function do not run.',
          'If a function has no return, it gives back a special value called None, which means "nothing". If you ever see None printed where you expected a number, you probably forgot a return.'
        ],
        example: 'You send a friend to the shop with money and a list. return is your friend coming back and handing you the items. If your friend just shouts "I bought them!" from the shop but never comes back, you have nothing in your hand. That is print without return.',
        code: lines(
          'def add_gst(price):',
          '    return round(price * 1.18, 2)',
          '',
          'tea = add_gst(20)',
          'lunch = add_gst(120)',
          'print(tea)',
          'print(lunch)',
          'print("Total:", tea + lunch)'
        ),
        output: lines('23.6', '141.6', 'Total: 165.2'),
        codeNotes: [
          { line: 2, note: 'Work out the price with GST and send it back.' },
          { line: 4, note: 'The returned value is stored in tea.' },
          { line: 8, note: 'Because the function returns numbers, we can add them.' }
        ],
        tryIt: 'Change return on line 2 to print and run it. Notice the values still print, but then tea and lunch are None, and the total line gives an error. Change it back to return.',
        check: {
          question: 'What does a function give back if it has no return?',
          options: ['None', '0', 'The last value it printed'],
          answer: 0,
          why: 'Without a return, a function gives back None, Python\'s way of saying "nothing".'
        }
      },
      {
        title: 'Why return is different from print',
        say: [
          'This is the most important idea of today, so let us be very clear. print shows a value on the screen for a human to read. return hands a value back to the program so it can keep working with it.',
          'A printed value is gone for the program. It is on the screen, but the code cannot pick it up again. A returned value can be stored, compared, added and passed to other functions.',
          'Good functions usually return, and let the code that called them decide whether to print. This makes functions reusable: the same add_gst function can be used for a bill on screen, a saved file or a web API.',
          'This matters for your practice tasks too. The checks call your function and look at what it returns. If you print the answer instead of returning it, the check sees None and fails, even though the right answer appeared on screen.'
        ],
        example: 'A cashier who reads your total out loud is doing print. A cashier who writes the total on a slip and hands it to you is doing return. With the slip in your hand, you can do things with it: pay, check it, or add it to your monthly budget.',
        code: lines(
          'def total_with_print(a, b):',
          '    print(a + b)',
          '',
          'def total_with_return(a, b):',
          '    return a + b',
          '',
          'x = total_with_print(20, 45)',
          'y = total_with_return(20, 45)',
          'print("x is", x)',
          'print("y is", y)'
        ),
        output: lines('65', 'x is None', 'y is 65'),
        codeNotes: [
          { line: 7, note: 'This prints 65 on screen, but gives back None.' },
          { line: 8, note: 'This prints nothing, but gives back 65, which is stored in y.' }
        ],
        tryIt: 'Add print(y * 2) at the bottom. It works: 130. Then add print(x * 2) and read the error: you cannot multiply None.',
        check: {
          question: 'A practice check calls your function and gets None. What is the most likely mistake?',
          options: ['The function prints the answer instead of returning it', 'The function name is too long', 'The function has a comment'],
          answer: 0,
          why: 'Checks use the returned value. A function that only prints gives back None, so the check fails.'
        }
      },
      {
        title: 'Default values for parameters',
        say: [
          'Sometimes a parameter usually has the same value. For example, most items have 18 percent GST. You can give a parameter a default value in the def line: def add_gst(price, rate=0.18).',
          'If the caller does not give that argument, Python uses the default. If the caller does give it, their value is used instead. This makes functions easy to use in the common case, and still flexible.',
          'Parameters with defaults must come after the ones without defaults. def add_gst(rate=0.18, price) is an error, because Python would not know which value goes where.',
          'You can also name arguments when calling: add_gst(100, rate=0.05). Naming makes calls easier to read, especially when a function has several parameters.'
        ],
        example: 'When you order tea at a stall, the default is with sugar. If you say nothing, you get sugar. If you say "no sugar", you get that instead. The stall has a sensible default, but you can change it.',
        code: lines(
          'def add_gst(price, rate=0.18):',
          '    return round(price * (1 + rate), 2)',
          '',
          'print(add_gst(100))',
          'print(add_gst(100, 0.05))',
          'print(add_gst(100, rate=0.12))'
        ),
        output: lines('118.0', '105.0', '112.0'),
        codeNotes: [
          { line: 1, note: 'rate has a default of 0.18.' },
          { line: 4, note: 'No rate given, so the default 0.18 is used.' },
          { line: 6, note: 'Naming the argument makes the call clear.' }
        ],
        tryIt: 'Add a third parameter to the function, discount=0, and subtract it from the price before adding GST. Check that add_gst(100) still gives 118.0 and add_gst(100, discount=10) gives 106.2.',
        check: {
          question: 'For def greet(name, greeting="Hello"), what does greet("Asha") use as greeting?',
          options: ['"Hello"', 'Nothing, it is an error', '"Asha"'],
          answer: 0,
          why: 'The caller did not give a greeting, so Python uses the default value "Hello".'
        }
      },
      {
        title: 'Putting it together: tracker functions',
        say: [
          'Let us rebuild the Expense Tracker report from yesterday using functions. Each job gets its own small function: one for the total, one for the average, one to format a line of text.',
          'Look at how short and readable the last few lines are. They read almost like a sentence: print the total of expenses, print the average. The details are hidden inside the functions, where you only need to look when something is wrong.',
          'The average function checks for an empty list first. Dividing by zero would crash, so a good function handles that edge case and returns 0 instead. Thinking about empty inputs is a habit that professional developers have.',
          'In today\'s practice you will write exactly this kind of function: an average that handles an empty list, and a greeting with a default value.'
        ],
        example: 'A kitchen with a separate person for chopping, cooking and plating works faster and makes fewer mistakes than one person doing everything at once. Small functions are the same: each has one job and does it well.',
        code: lines(
          'def total(amounts):',
          '    result = 0',
          '    for amount in amounts:',
          '        result += amount',
          '    return result',
          '',
          'def average(amounts):',
          '    if len(amounts) == 0:',
          '        return 0',
          '    return round(total(amounts) / len(amounts), 2)',
          '',
          'def money(amount):',
          '    return "Rs " + str(amount)',
          '',
          'expenses = [20, 45, 120, 300, 60]',
          'print("Total:", money(total(expenses)))',
          'print("Average:", money(average(expenses)))',
          'print("Average of nothing:", average([]))'
        ),
        output: lines('Total: Rs 545', 'Average: Rs 109.0', 'Average of nothing: 0'),
        codeNotes: [
          { line: 8, note: 'Handle the empty list first, so we never divide by zero.' },
          { line: 10, note: 'A function can call another function: average uses total.' },
          { line: 16, note: 'The result of total() is passed straight into money().' }
        ],
        tryIt: 'Write a new function largest(amounts) that returns the biggest amount using a loop, and print money(largest(expenses)). It should show Rs 300.',
        check: {
          question: 'Why does average() check for an empty list first?',
          options: ['To avoid dividing by zero, which would crash', 'Because Python needs it for every function', 'To make it run faster'],
          answer: 0,
          why: 'An empty list has length 0, and dividing by 0 is an error. Returning 0 early handles that case safely.'
        }
      }
    ],
    summary: [
      'def defines a function; it only runs when you call it with brackets.',
      'Parameters are the names in the def line; arguments are the values you pass in, in order.',
      'return gives a value back to the program. Without return, a function gives None.',
      'print shows a value to a person; return hands it to the code. Practice checks need return.',
      'Default values (rate=0.18) make a parameter optional.'
    ],
    projectStep: {
      title: 'Expense Tracker: split into functions',
      steps: [
        'Write total(amounts) and average(amounts) functions that return values.',
        'Make average return 0 for an empty list.',
        'Write money(amount) that returns text like "Rs 545".',
        'Use the three functions to print a short report.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 8,
    title: 'Lists: Keeping Many Values Together',
    goal: 'You can create lists, read items by position, add and remove items, and take slices.',
    minutes: 30,
    recap: 'Yesterday you wrote your own functions with parameters, return and default values.',
    parts: [
      {
        title: 'Creating a list and reading items',
        say: [
          'Welcome to Week 2, where you learn to work with groups of data. Real apps never deal with just one value. They deal with many: all your expenses, all your contacts, all your orders. The most common way to keep many values together in Python is a list.',
          'A list is written with square brackets and commas: items = ["Tea", "Bus", "Lunch"]. A list keeps its items in order, and it can hold any type: text, numbers, even other lists.',
          'You read an item by its position, called its index, just like characters in a string. items[0] is the first item. items[-1] is the last. len(items) tells you how many items there are.',
          'Asking for a position that does not exist, like items[10] in a list of three, gives an IndexError. The last valid index is always len(items) - 1, because counting starts at 0.'
        ],
        example: 'A list is like the queue at a ticket counter. People stand in order, and you can say "the first person" (position 0) or "the last person" (position -1). You can also count how long the queue is.',
        code: lines(
          'items = ["Tea", "Bus", "Lunch", "Movie"]',
          'print(items)',
          'print(items[0])',
          'print(items[-1])',
          'print(len(items))',
          'print(items[len(items) - 1])'
        ),
        output: lines("['Tea', 'Bus', 'Lunch', 'Movie']", 'Tea', 'Movie', '4', 'Movie'),
        codeNotes: [
          { line: 2, note: 'Printing a whole list shows it with square brackets and quotes around text.' },
          { line: 6, note: 'The last index is len - 1, which is 3 here. -1 is the shorter way to write it.' }
        ],
        tryIt: 'Print items[1] and items[-2]. Before running, say which items you expect: Bus and Lunch.',
        check: {
          question: 'For a list with 5 items, what is the index of the last item?',
          options: ['4', '5', '6'],
          answer: 0,
          why: 'Counting starts at 0, so 5 items have the indexes 0 to 4. The last one is 4, which is also -1.'
        }
      },
      {
        title: 'Changing a list: append, insert, remove',
        say: [
          'Lists can change. This is a big difference from strings, which cannot be changed. You can add items, remove items and replace items in a list.',
          'append(value) adds an item to the end. This is the one you will use most, for example every time the user adds a new expense. insert(position, value) puts an item at a chosen position and shifts the others along.',
          'remove(value) removes the first item that equals that value. pop() removes and returns the last item; pop(0) removes the first. You can also replace an item directly: items[1] = "Auto".',
          'These methods change the list itself. They do not give back a new list. So you write items.append("Tea") on its own line, not items = items.append("Tea"). The second version would store None, because append returns nothing.'
        ],
        example: 'A shopping list on the fridge: you add milk at the bottom (append), squeeze eggs in at the top because they are urgent (insert), cross off bread when you buy it (remove), and change "rice" to "basmati rice" (replace by position).',
        code: lines(
          'items = ["Tea", "Bus"]',
          'items.append("Lunch")',
          'print(items)',
          'items.insert(0, "Breakfast")',
          'print(items)',
          'items.remove("Bus")',
          'items[1] = "Masala tea"',
          'print(items)',
          'last = items.pop()',
          'print("Removed:", last)',
          'print(items)'
        ),
        output: lines(
          "['Tea', 'Bus', 'Lunch']",
          "['Breakfast', 'Tea', 'Bus', 'Lunch']",
          "['Breakfast', 'Masala tea', 'Lunch']",
          'Removed: Lunch',
          "['Breakfast', 'Masala tea']"
        ),
        codeNotes: [
          { line: 2, note: 'append adds to the end.' },
          { line: 4, note: 'insert at position 0 puts it at the front.' },
          { line: 9, note: 'pop removes the last item and gives it back.' }
        ],
        tryIt: 'Add items.remove("Pizza") at the end and run it. Read the ValueError: you cannot remove an item that is not in the list. Then delete that line.',
        check: {
          question: 'What does items.append("Juice") do?',
          options: ['Adds "Juice" to the end of the list', 'Adds "Juice" to the start', 'Replaces the last item with "Juice"'],
          answer: 0,
          why: 'append always adds a new item at the end, and the list gets one item longer.'
        }
      },
      {
        title: 'Checking and searching: in, count, index',
        say: [
          'You can ask whether a value is in a list with the word in, just like with strings: "Tea" in items gives True or False. This is very common before removing something, to avoid an error.',
          'count(value) tells you how many times a value appears. index(value) tells you the position of its first appearance. Like remove, index gives an error if the value is not there, so check with in first.',
          'You also already know the built-in tools that work on lists of numbers: sum(), min(), max() and len(). Together they answer most simple questions about a list.',
          'sorted(list) gives you a new list in order, from small to large or A to Z. The original list is not changed. sorted(list, reverse=True) gives the opposite order.'
        ],
        example: 'A class register: "Is Priya in this class?" is in. "How many students are called Rahul?" is count. "Which roll number is Priya?" is index. "List everyone alphabetically" is sorted.',
        code: lines(
          'amounts = [120, 20, 45, 20, 300]',
          'print(20 in amounts)',
          'print(999 in amounts)',
          'print(amounts.count(20))',
          'print(amounts.index(45))',
          'print(sorted(amounts))',
          'print(sorted(amounts, reverse=True))',
          'print(amounts)'
        ),
        output: lines('True', 'False', '2', '2', '[20, 20, 45, 120, 300]', '[300, 120, 45, 20, 20]', '[120, 20, 45, 20, 300]'),
        codeNotes: [
          { line: 5, note: '45 is at position 2.' },
          { line: 8, note: 'sorted gave new lists. The original order is unchanged.' }
        ],
        tryIt: 'Print the three biggest amounts using sorted and a slice: sorted(amounts, reverse=True)[:3]. You will learn slices properly in the next part.',
        check: {
          question: 'After nums = [3, 1, 2] and sorted(nums), what is nums?',
          options: ['[3, 1, 2]', '[1, 2, 3]', 'None'],
          answer: 0,
          why: 'sorted() gives back a new sorted list and does not change the original.'
        }
      },
      {
        title: 'Slicing lists',
        say: [
          'Slicing works on lists exactly as it does on strings. items[start:stop] gives a new list with the items from start up to, but not including, stop.',
          'items[:3] gives the first three items. items[-3:] gives the last three. items[1:] gives everything except the first. These three shapes cover most real uses.',
          'A slice is always a new list. Changing the slice does not change the original. items[:] is a quick way to make a full copy of a list.',
          'Slices never give an IndexError. If you ask for more than there is, you just get what exists. items[:100] on a list of four items gives all four.'
        ],
        example: 'On a phone, the "recent calls" screen shows only the latest few calls from your full call history. That is a slice: a piece of the full list, while the full history is still stored.',
        code: lines(
          'history = [20, 45, 120, 300, 60, 90]',
          'print(history[:3])',
          'print(history[-2:])',
          'print(history[1:4])',
          'print(history[:100])',
          'recent = history[-3:]',
          'print("Recent total:", sum(recent))'
        ),
        output: lines('[20, 45, 120]', '[60, 90]', '[45, 120, 300]', '[20, 45, 120, 300, 60, 90]', 'Recent total: 450'),
        codeNotes: [
          { line: 4, note: 'Positions 1, 2 and 3.' },
          { line: 5, note: 'Asking for more than exists is fine with slices.' }
        ],
        tryIt: 'Print the first and last item together as a new list: [history[0], history[-1]]. It should be [20, 90].',
        check: {
          question: 'What does [10, 20, 30, 40][-2:] give?',
          options: ['[30, 40]', '[40]', '[10, 20]'],
          answer: 0,
          why: 'Starting from the second-last item to the end gives the last two items.'
        }
      },
      {
        title: 'Copies and the "same list" trap',
        say: [
          'Here is a trap that catches many beginners and even experienced developers. If you write b = a where a is a list, you do not get a copy. You get a second name for the same list. Changing b also changes a.',
          'Why? A variable is a label pointing to a value. b = a sticks a second label on the same list. There is still only one list.',
          'To get a real copy, use a[:] or list(a) or a.copy(). Or build a new list with +: a + [new_item] gives a new, longer list and leaves a alone.',
          'This matters for functions too. If your function changes a list it was given, the caller\'s list changes as well. Often the safer choice is to return a new list, which is exactly what one of today\'s practice tasks asks you to do.'
        ],
        example: 'If two people share one Google Doc, when one of them edits it, the other sees the change: there is only one document. Making a copy gives each person their own document to change freely. b = a is sharing; a.copy() is making a copy.',
        code: lines(
          'a = ["Tea", "Bus"]',
          'b = a',
          'b.append("Lunch")',
          'print("a:", a)',
          'c = a.copy()',
          'c.append("Movie")',
          'print("a:", a)',
          'print("c:", c)',
          'd = a + ["Snacks"]',
          'print("a:", a)',
          'print("d:", d)'
        ),
        output: lines(
          "a: ['Tea', 'Bus', 'Lunch']",
          "a: ['Tea', 'Bus', 'Lunch']",
          "c: ['Tea', 'Bus', 'Lunch', 'Movie']",
          "a: ['Tea', 'Bus', 'Lunch']",
          "d: ['Tea', 'Bus', 'Lunch', 'Snacks']"
        ),
        codeNotes: [
          { line: 2, note: 'Not a copy: b and a are two names for one list.' },
          { line: 4, note: 'a changed too, because it is the same list as b.' },
          { line: 9, note: '+ builds a new list; a is not changed.' }
        ],
        tryIt: 'Change line 2 to b = a.copy() and run again. Now the first print shows only Tea and Bus, because b is a separate list.',
        check: {
          question: 'After a = [1, 2], b = a, b.append(3), what is a?',
          options: ['[1, 2, 3]', '[1, 2]', 'An error'],
          answer: 0,
          why: 'b = a does not copy. Both names point to one list, so appending through b also changes a.'
        }
      },
      {
        title: 'Putting it together: a list of expenses',
        say: [
          'Let us use lists in the Expense Tracker. Instead of separate variables, we keep all item names in one list and all amounts in another, and we add new ones with append.',
          'Keeping two separate lists works, but it is fragile: position 2 in the names must match position 2 in the amounts. If you remove from one and forget the other, they get out of step. On Day 10 you will learn dictionaries, and on Day 11 a much better way to keep each expense together.',
          'For now, notice how much the list tools give you for free: len for the count, sum for the total, max for the biggest, and slices for the most recent ones.',
          'In today\'s practice you will return the first and last items of a list, and add an item without changing the original list. Remember the copy trap from the last part.'
        ],
        example: 'A small shop notebook with two columns, item and price, is exactly this: two lists side by side. It works, as long as nobody writes an item on one line and its price on another.',
        code: lines(
          'names = ["Tea", "Bus", "Lunch"]',
          'amounts = [20, 45, 120]',
          'names.append("Movie")',
          'amounts.append(300)',
          'print("Count:", len(amounts))',
          'print("Total:", sum(amounts))',
          'biggest = max(amounts)',
          'print("Biggest:", names[amounts.index(biggest)], biggest)',
          'print("Last two:", names[-2:])'
        ),
        output: lines('Count: 4', 'Total: 485', 'Biggest: Movie 300', "Last two: ['Lunch', 'Movie']"),
        codeNotes: [
          { line: 8, note: 'Find where the biggest amount is, then read the name at the same position.' }
        ],
        tryIt: 'Add a new expense ("Auto", 80) to both lists with append, and run again. The count becomes 5 and the total 565.',
        check: {
          question: 'Why is keeping names and amounts in two separate lists risky?',
          options: ['The positions can get out of step if one list changes and the other does not', 'Python only allows one list per program', 'Lists cannot hold numbers'],
          answer: 0,
          why: 'Each name must stay at the same position as its amount. Changing one list and not the other breaks that link.'
        }
      }
    ],
    summary: [
      'A list keeps values in order: ["Tea", "Bus"]. Index 0 is the first, -1 the last.',
      'append adds to the end, insert adds at a position, remove and pop take items out.',
      'in, count, index, sum, min, max and sorted answer questions about a list.',
      'Slices like items[:3] and items[-3:] give new lists and never raise errors.',
      'b = a does not copy a list. Use a.copy() or a + [...] for a new list.'
    ],
    projectStep: {
      title: 'Expense Tracker: keep expenses in lists',
      steps: [
        'Store expense names and amounts in two lists.',
        'Add two new expenses with append.',
        'Print the count, the total and the biggest expense with its name.',
        'Print the three most recent expenses with a slice.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 9,
    title: 'Looping Over Lists and List Comprehensions',
    goal: 'You can loop over lists with positions, and build new lists by changing or filtering items with list comprehensions.',
    minutes: 30,
    recap: 'Yesterday you created lists, added and removed items, took slices, and learned that b = a does not copy a list.',
    parts: [
      {
        title: 'enumerate: items with their positions',
        say: [
          'On Day 6 you looped over lists with for. Sometimes you need the position of each item as well as the item, for example to number the lines of a report. You could keep your own counter, but Python has a neater tool: enumerate.',
          'for i, item in enumerate(items): gives you two things each round: the position i and the item. Writing two names separated by a comma after for is called unpacking.',
          'By default enumerate starts counting at 0. For numbered lists shown to people, you usually want to start at 1: enumerate(items, start=1).',
          'Another useful tool is zip, which walks through two lists side by side. for name, amount in zip(names, amounts): gives you one name and its matching amount each round.'
        ],
        example: 'When a teacher reads the attendance register, she reads the roll number and the name together: "1, Aarav. 2, Diya." enumerate gives you both the number and the item in the same way.',
        code: lines(
          'names = ["Tea", "Bus", "Lunch"]',
          'amounts = [20, 45, 120]',
          'for i, name in enumerate(names, start=1):',
          '    print(i, name)',
          'for name, amount in zip(names, amounts):',
          '    print(name, "-", amount)'
        ),
        output: lines('1 Tea', '2 Bus', '3 Lunch', 'Tea - 20', 'Bus - 45', 'Lunch - 120'),
        codeNotes: [
          { line: 3, note: 'Each round gives a position and an item. start=1 counts from 1.' },
          { line: 5, note: 'zip pairs up the two lists, item by item.' }
        ],
        tryIt: 'Remove start=1 and run it. The numbering now starts at 0, which is how Python counts positions internally.',
        check: {
          question: 'What does enumerate give you in each round of a loop?',
          options: ['The position and the item', 'Only the item', 'Only the length of the list'],
          answer: 0,
          why: 'enumerate gives pairs of (position, item), which you can unpack into two names like i and item.'
        }
      },
      {
        title: 'Building a new list with a loop',
        say: [
          'A very common job is to make a new list from an old one: every price with GST added, every name in capitals, every amount in dollars. The basic way is a loop with an empty list and append.',
          'You start with an empty list, result = [], before the loop. Inside the loop, you work out the new value and append it. After the loop, result holds all the new values. This is the accumulator pattern again, but building a list instead of a number.',
          'The original list stays the same, which is usually what you want. You now have both: the old values and the new ones.',
          'This pattern is so common that Python has a shorter way to write it, called a list comprehension. In the next part you will see the same result in one line. But first make sure this longer version makes sense to you, because the short version does exactly the same thing.'
        ],
        example: 'A photocopy shop that takes your document and returns a copy with the company logo stamped on each page. It starts with an empty tray, stamps each page and puts it in the tray. Your original pages are untouched.',
        code: lines(
          'prices = [100, 250, 40]',
          'with_gst = []',
          'for price in prices:',
          '    with_gst.append(round(price * 1.18, 2))',
          'print(with_gst)',
          'print(prices)'
        ),
        output: lines('[118.0, 295.0, 47.2]', '[100, 250, 40]'),
        codeNotes: [
          { line: 2, note: 'Start with an empty list.' },
          { line: 4, note: 'Work out the new value and add it to the new list.' },
          { line: 6, note: 'The original list is unchanged.' }
        ],
        tryIt: 'Make a second new list called labels that holds text like "Rs 100" for each price, using "Rs " + str(price). It should print [\'Rs 100\', \'Rs 250\', \'Rs 40\'].',
        check: {
          question: 'Where should result = [] go when building a new list with a loop?',
          options: ['Before the loop', 'Inside the loop', 'After the loop'],
          answer: 0,
          why: 'Like a total, the empty list is created once before the loop. Inside the loop it would be emptied every round.'
        }
      },
      {
        title: 'List comprehensions: the one-line version',
        say: [
          'A list comprehension builds a new list in one line. [price * 2 for price in prices] means: for each price in prices, work out price * 2, and collect the answers in a new list.',
          'Read it from the middle: "for price in prices" is the loop, and the part before it, price * 2, is what goes into the new list. The square brackets around everything say "make a list".',
          'It does exactly the same as the loop-and-append version. It is not faster to learn, but once you are used to it, it is quicker to read and write, and Python programmers use it everywhere. You will see it in interviews and in almost every Python codebase.',
          'You can use any expression before for: a calculation, a method like name.upper(), or a function call like round(p, 2).'
        ],
        example: 'It is like telling a friend in one sentence: "For each of these shirts, give me the size label." Instead of a long step-by-step instruction, you say what you want for each item and they hand you the new pile.',
        code: lines(
          'prices = [100, 250, 40]',
          'doubled = [p * 2 for p in prices]',
          'with_gst = [round(p * 1.18, 2) for p in prices]',
          'names = ["tea", "bus", "lunch"]',
          'shout = [n.upper() for n in names]',
          'print(doubled)',
          'print(with_gst)',
          'print(shout)'
        ),
        output: lines('[200, 500, 80]', '[118.0, 295.0, 47.2]', "['TEA', 'BUS', 'LUNCH']"),
        codeNotes: [
          { line: 2, note: 'For each p in prices, put p * 2 in the new list.' },
          { line: 3, note: 'The same result as the loop in the last part, in one line.' },
          { line: 5, note: 'Any expression works, including string methods.' }
        ],
        tryIt: 'Make a list of the lengths of each name with [len(n) for n in names]. It should be [3, 3, 5].',
        check: {
          question: 'What is [x + 1 for x in [1, 2, 3]]?',
          options: ['[2, 3, 4]', '[1, 2, 3, 1]', '6'],
          answer: 0,
          why: 'For each x, the comprehension puts x + 1 in the new list: 2, 3 and 4.'
        }
      },
      {
        title: 'Filtering with if',
        say: [
          'A list comprehension can also keep only some items. Add an if at the end: [p for p in prices if p > 100] keeps only the prices above 100.',
          'Read it as: for each p in prices, if p is more than 100, keep p. Items where the condition is False are simply left out. The new list can be shorter than the original, or even empty.',
          'You can change and filter at the same time: [p * 2 for p in prices if p > 100] doubles only the big prices and drops the rest.',
          'Filtering is everywhere in real apps: only this month\'s expenses, only unread messages, only products in stock. When you catch yourself writing a loop with an if and an append, a comprehension with if is usually the shorter way.'
        ],
        example: 'A sieve in the kitchen keeps the rice and lets the water go. The if in a comprehension is the sieve: items that pass the condition stay in the new list, and the rest fall through.',
        code: lines(
          'amounts = [20, 450, 45, 1200, 120, 60]',
          'big = [a for a in amounts if a > 100]',
          'small = [a for a in amounts if a <= 100]',
          'print(big)',
          'print(small)',
          'print("Big total:", sum(big))',
          'names = ["Tea", "Taxi", "Lunch", "Train"]',
          'print([n for n in names if n.startswith("T")])'
        ),
        output: lines('[450, 1200, 120]', '[20, 45, 60]', 'Big total: 1770', "['Tea', 'Taxi', 'Train']"),
        codeNotes: [
          { line: 2, note: 'Keep only the amounts over 100.' },
          { line: 8, note: 'Any True/False check works as a filter, including string methods.' }
        ],
        tryIt: 'Make a list of only the even amounts using a % 2 == 0. It should be [20, 450, 1200, 120, 60].',
        check: {
          question: 'What is [n for n in [5, 12, 8, 20] if n > 10]?',
          options: ['[12, 20]', '[5, 8]', '[True, False]'],
          answer: 0,
          why: 'Only the values where n > 10 is True are kept: 12 and 20.'
        }
      },
      {
        title: 'When not to use a comprehension',
        say: [
          'Comprehensions are great for short, simple transformations. But they can be overused. If a comprehension gets long, has several ifs, or needs a line of explanation, a normal loop is easier to read.',
          'Also, a comprehension is for building a list. If you only want to print things, or add up a total, use a normal loop or sum(). Do not build a list you never use.',
          'A nice combination is sum() with a comprehension-like expression: sum(a for a in amounts if a > 100) adds up only the big amounts, without building a list first. This is called a generator expression, and it looks like a comprehension without the square brackets.',
          'The golden rule: code is read many more times than it is written. Choose the version your teammate will understand fastest.'
        ],
        example: 'A short sentence is great for a simple message: "Pass the salt." For complex instructions, like how to reach your house, clear separate steps work better than one very long sentence. Comprehensions are the short sentence.',
        code: lines(
          'amounts = [20, 450, 45, 1200, 120, 60]',
          'print(sum(a for a in amounts if a > 100))',
          'print(len([a for a in amounts if a < 50]))',
          '# A normal loop is clearer when there are several steps',
          'for a in amounts:',
          '    if a > 1000:',
          '        print("Check this one:", a)'
        ),
        output: lines('1770', '2', 'Check this one: 1200'),
        codeNotes: [
          { line: 2, note: 'Add up only the big amounts, without a separate list.' },
          { line: 5, note: 'Printing is a job for a normal loop, not a comprehension.' }
        ],
        tryIt: 'Use sum() with a generator expression to add up only the amounts under 100. The answer should be 125.',
        check: {
          question: 'When is a normal for loop better than a list comprehension?',
          options: ['When the logic is long or you only want to print', 'Never; comprehensions are always better', 'When the list has more than 10 items'],
          answer: 0,
          why: 'Comprehensions are for short list-building. For long logic, or for actions like printing, a normal loop is clearer.'
        }
      },
      {
        title: 'Putting it together: filtered reports',
        say: [
          'Let us use today\'s tools in the Expense Tracker. With names and amounts side by side, we print a numbered list with enumerate and zip, then use comprehensions to find big expenses and to add GST.',
          'Notice line 6: zip gives us each name with its amount, and the if keeps only the pairs where the amount is over 100. The new list holds just the names. That is a lot of work in one readable line.',
          'Comprehensions will become even more useful on Day 11, when each expense becomes a dictionary with its name, amount and category together.',
          'In today\'s practice you will double every number in a list, and keep only the numbers above a limit. Both are one-line comprehensions.'
        ],
        example: 'Your bank app has a filter: "show only debits above 1000 this month". Behind the button, the app does exactly this kind of filtering on the list of your transactions.',
        code: lines(
          'names = ["Tea", "Rent", "Bus", "Groceries"]',
          'amounts = [20, 8000, 45, 1500]',
          'for i, (name, amount) in enumerate(zip(names, amounts), start=1):',
          '    print(str(i) + ".", name, amount)',
          'big_names = [n for n, a in zip(names, amounts) if a > 100]',
          'print("Big:", big_names)',
          'print("With GST:", [round(a * 1.18) for a in amounts])'
        ),
        output: lines('1. Tea 20', '2. Rent 8000', '3. Bus 45', '4. Groceries 1500', "Big: ['Rent', 'Groceries']", 'With GST: [24, 9440, 53, 1770]'),
        codeNotes: [
          { line: 3, note: 'zip pairs the lists; enumerate numbers the pairs. The brackets unpack each pair.' },
          { line: 5, note: 'Keep the name n only when its amount a is over 100.' }
        ],
        tryIt: 'Change the limit on line 5 from 100 to 5000 and run it. Now only Rent is left in the Big list.',
        check: {
          question: 'In [n for n, a in zip(names, amounts) if a > 100], what ends up in the new list?',
          options: ['The names whose amount is over 100', 'The amounts over 100', 'Pairs of names and amounts'],
          answer: 0,
          why: 'The part before for is n, the name. The if keeps only pairs where the amount a is over 100.'
        }
      }
    ],
    summary: [
      'enumerate gives each item with its position; zip walks two lists side by side.',
      'Build a new list with an empty list, a loop and append.',
      'A list comprehension does the same in one line: [p * 2 for p in prices].',
      'Add if at the end to filter: [p for p in prices if p > 100].',
      'Keep comprehensions short. Use a normal loop for long logic or printing.'
    ],
    projectStep: {
      title: 'Expense Tracker: filtered views',
      steps: [
        'Print a numbered list of your expenses with enumerate and zip.',
        'Make a list of the names of expenses over 100 with a comprehension.',
        'Print the total of only the big expenses with sum().',
        'Make a list of all amounts with 18% GST added.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 10,
    title: 'Dictionaries: Named Details',
    goal: 'You can store details under names in a dictionary, read them safely with get(), change them, and loop over them.',
    minutes: 30,
    recap: 'Yesterday you looped with enumerate and zip, and built and filtered lists with list comprehensions.',
    parts: [
      {
        title: 'What a dictionary is',
        say: [
          'A list keeps values in order and you find them by position. But many things are better described by names than by positions. An expense has an item, an amount and a category. Remembering that position 2 means category is awkward. A dictionary solves this.',
          'A dictionary stores values under names called keys. You write it with curly brackets: {"item": "Tea", "amount": 20}. Each entry is a key, a colon, and its value, and entries are separated by commas. Each key and value pair is often called an item of the dictionary.',
          'You read a value with its key in square brackets: expense["amount"] gives 20. No counting positions, no guessing. The code tells you exactly what you are reading.',
          'Keys are usually strings. Values can be anything: text, numbers, True/False, lists, even other dictionaries. Each key appears only once in a dictionary.'
        ],
        example: 'A dictionary is like a form, for example a bank account opening form. Each field has a label (name, phone, city) and a value filled in next to it. To find someone\'s phone number, you look for the label "phone", not "the third box".',
        code: lines(
          'expense = {"item": "Tea", "amount": 20, "category": "food"}',
          'print(expense)',
          'print(expense["item"])',
          'print(expense["amount"] * 2)',
          'print(len(expense))'
        ),
        output: lines("{'item': 'Tea', 'amount': 20, 'category': 'food'}", 'Tea', '40', '3'),
        codeNotes: [
          { line: 1, note: 'Three key and value pairs inside curly brackets.' },
          { line: 3, note: 'Read a value by its key.' },
          { line: 5, note: 'len counts the number of keys.' }
        ],
        tryIt: 'Add a fourth key "paid_by" with the value "UPI" inside the curly brackets, and print expense["paid_by"].',
        check: {
          question: 'How do you read the value stored under the key "city" in a dictionary called person?',
          options: ['person["city"]', 'person[2]', 'person.city()'],
          answer: 0,
          why: 'Dictionary values are read with the key in square brackets. There are no positions like in a list.'
        }
      },
      {
        title: 'Adding and changing keys',
        say: [
          'Dictionaries can change, like lists. To add a new key, just assign to it: expense["date"] = "2026-09-28". If the key did not exist, it is created.',
          'The same syntax changes an existing key. expense["amount"] = 25 replaces the old amount. Python does not ask whether you meant to add or change; if the key exists, it is changed, otherwise it is added.',
          'To remove a key, use del expense["date"] or expense.pop("date"). pop also gives back the value it removed, just like with lists.',
          'You can start with an empty dictionary, {}, and fill it step by step. This is common when you build up information as your program runs.'
        ],
        example: 'Your contact card for a friend on your phone: you add a new email address, update their phone number when they change it, and delete an old address. The card is the dictionary, and each field is a key.',
        code: lines(
          'expense = {"item": "Tea", "amount": 20}',
          'expense["category"] = "food"',
          'expense["amount"] = 25',
          'print(expense)',
          'removed = expense.pop("category")',
          'print("Removed:", removed)',
          'print(expense)',
          'settings = {}',
          'settings["currency"] = "INR"',
          'print(settings)'
        ),
        output: lines(
          "{'item': 'Tea', 'amount': 25, 'category': 'food'}",
          'Removed: food',
          "{'item': 'Tea', 'amount': 25}",
          "{'currency': 'INR'}"
        ),
        codeNotes: [
          { line: 2, note: 'A new key is added.' },
          { line: 3, note: 'An existing key is changed.' },
          { line: 8, note: 'An empty dictionary, filled on the next line.' }
        ],
        tryIt: 'Add settings["monthly_budget"] = 5000 and print settings again. Then change the budget to 6000 and print once more.',
        check: {
          question: 'd = {"a": 1}. What is d after d["a"] = 5?',
          options: ['{"a": 5}', '{"a": 1, "a": 5}', 'An error'],
          answer: 0,
          why: 'Keys are unique. Assigning to an existing key replaces its value.'
        }
      },
      {
        title: 'Missing keys and get()',
        say: [
          'If you ask for a key that is not in the dictionary, like expense["date"] when there is no date, Python gives a KeyError. This is one of the most common errors in real programs, because data from users and other systems is often incomplete.',
          'You can check first with in: "date" in expense gives True or False. For dictionaries, in checks the keys, not the values.',
          'Even better, use get(). expense.get("date") gives the value if the key exists, and None if it does not, with no error. expense.get("date", "unknown") lets you choose the value to use when the key is missing.',
          'As a habit: use square brackets when the key must be there and a missing key is a real bug. Use get() when a key is optional.'
        ],
        example: 'At a restaurant, asking for a dish that is not on the menu: a strict waiter says "that does not exist" and stops (KeyError). A friendly waiter says "we do not have that, would you like the house special?" That friendly waiter is get() with a default.',
        code: lines(
          'prices = {"tea": 20, "coffee": 40}',
          'print("tea" in prices)',
          'print("juice" in prices)',
          'print(prices.get("coffee"))',
          'print(prices.get("juice"))',
          'print(prices.get("juice", 0))'
        ),
        output: lines('True', 'False', '40', 'None', '0'),
        codeNotes: [
          { line: 2, note: 'in checks whether a key exists.' },
          { line: 5, note: 'Missing key with get: None, not an error.' },
          { line: 6, note: 'Missing key with a default: 0.' }
        ],
        tryIt: 'Add print(prices["juice"]) at the end and read the KeyError. Then delete that line.',
        check: {
          question: 'What does {"a": 1}.get("b", 99) give?',
          options: ['99', 'None', 'A KeyError'],
          answer: 0,
          why: 'The key "b" is missing, so get() returns the default value you gave, 99.'
        }
      },
      {
        title: 'Looping over a dictionary',
        say: [
          'You can loop over a dictionary with for. Looping directly gives you the keys, one at a time. Dictionaries keep the order in which keys were added.',
          'values() gives just the values. That is handy with sum(): sum(prices.values()) adds up all the prices.',
          'items() gives both the key and the value each round. for name, price in prices.items(): is the most common way to loop over a dictionary, because you usually want both.',
          'Do not add or remove keys while looping over the same dictionary. Python will complain. If you need to change keys, loop over a copy, or build a new dictionary instead.'
        ],
        example: 'Reading a menu card: you can read only the dish names (keys), only the prices (values), or each dish with its price (items). The menu is the same; you just choose what to read.',
        code: lines(
          'prices = {"tea": 20, "coffee": 40, "samosa": 15}',
          'for name in prices:',
          '    print(name)',
          'print(sum(prices.values()))',
          'for name, price in prices.items():',
          '    print(name, "costs", price)'
        ),
        output: lines('tea', 'coffee', 'samosa', '75', 'tea costs 20', 'coffee costs 40', 'samosa costs 15'),
        codeNotes: [
          { line: 2, note: 'Looping over a dictionary gives the keys.' },
          { line: 4, note: 'values() gives the prices; sum adds them.' },
          { line: 5, note: 'items() gives each key with its value.' }
        ],
        tryIt: 'Print only the items that cost more than 18, using an if inside the items() loop. You should see tea and coffee.',
        check: {
          question: 'What does for k, v in d.items(): give you each round?',
          options: ['A key and its value', 'Only the values', 'The position and the key'],
          answer: 0,
          why: 'items() gives key and value pairs, which you unpack into two names like k and v.'
        }
      },
      {
        title: 'Counting with a dictionary',
        say: [
          'A classic use of dictionaries is counting or adding up by group. For example: how much did I spend in each category? The categories become keys, and the totals become values.',
          'The pattern is: start with an empty dictionary. For each expense, look up the current total for its category with get(category, 0), add the amount, and store it back. The first time a category appears, get gives 0, so there is no KeyError.',
          'This pattern appears everywhere: counting words in a text, votes per candidate, orders per city, visits per page. Learn it well; it is also a common interview question.',
          'You will use this exact pattern in Week 4 for the category totals of your Expense Tracker.'
        ],
        example: 'Counting votes in a class election on a blackboard. When a new name is read out for the first time, you write the name with 1 next to it. When a name is read again, you add one to its number. The blackboard is the dictionary.',
        code: lines(
          'categories = ["food", "travel", "food", "rent", "food", "travel"]',
          'amounts = [20, 45, 120, 8000, 60, 30]',
          'totals = {}',
          'for category, amount in zip(categories, amounts):',
          '    totals[category] = totals.get(category, 0) + amount',
          'print(totals)',
          'counts = {}',
          'for category in categories:',
          '    counts[category] = counts.get(category, 0) + 1',
          'print(counts)'
        ),
        output: lines("{'food': 200, 'travel': 75, 'rent': 8000}", "{'food': 3, 'travel': 2, 'rent': 1}"),
        codeNotes: [
          { line: 5, note: 'Current total for this category (0 if new), plus this amount, stored back.' },
          { line: 9, note: 'The same pattern, adding 1 each time, counts the categories.' }
        ],
        tryIt: 'Add "shopping" to the categories list and 999 to the amounts list, and run it. A new key appears in both dictionaries automatically.',
        check: {
          question: 'Why use totals.get(category, 0) instead of totals[category]?',
          options: ['The first time a category appears it is not in the dictionary yet, and get gives 0 instead of an error', 'get is faster', 'Square brackets do not work with strings'],
          answer: 0,
          why: 'For a new category the key does not exist yet. totals[category] would raise a KeyError; get(category, 0) starts it at 0.'
        }
      },
      {
        title: 'Putting it together: one expense as a dictionary',
        say: [
          'On Day 8 you kept names and amounts in two separate lists, and saw how fragile that was. A dictionary keeps all the details of one expense together, so they can never get out of step.',
          'In this example, a function builds an expense dictionary from its parts, and another function turns it into a readable line. This is a pattern you will use for the rest of the course: data as dictionaries, and small functions that create and use them.',
          'Tomorrow you take the next step: a list of these dictionaries, one per expense. That is the shape of almost all real app data, and exactly what a web API sends and receives.',
          'In today\'s practice you will write make_expense, which returns a dictionary, and price_of, which reads a price safely with get().'
        ],
        example: 'A paper bill for one purchase keeps the item, price, date and payment method together on one slip. You never have to match a price from one notebook with an item from another. One expense as one dictionary is that slip.',
        code: lines(
          'def make_expense(item, amount, category):',
          '    return {"item": item, "amount": amount, "category": category}',
          '',
          'def describe(expense):',
          '    return expense["item"] + " (" + expense["category"] + "): Rs " + str(expense["amount"])',
          '',
          'tea = make_expense("Tea", 20, "food")',
          'rent = make_expense("Rent", 8000, "home")',
          'print(describe(tea))',
          'print(describe(rent))',
          'print(tea.get("date", "no date yet"))'
        ),
        output: lines('Tea (food): Rs 20', 'Rent (home): Rs 8000', 'no date yet'),
        codeNotes: [
          { line: 2, note: 'Return a new dictionary built from the three parameters.' },
          { line: 5, note: 'Read each detail by its key name. Easy to understand later.' },
          { line: 11, note: 'An optional key read safely with a default.' }
        ],
        tryIt: 'Add a date parameter to make_expense and a "date" key to the dictionary. Update the two calls to pass a date like "2026-09-28", and check the last line now prints it.',
        check: {
          question: 'Why is a dictionary better than two separate lists for one expense\'s details?',
          options: ['All details of one expense stay together under clear names', 'Dictionaries use less memory', 'Lists cannot hold text'],
          answer: 0,
          why: 'A dictionary keeps item, amount and category together, read by name, so they can never get out of step.'
        }
      }
    ],
    summary: [
      'A dictionary stores values under keys: {"item": "Tea", "amount": 20}.',
      'Read with d["key"]; add or change with d["key"] = value; remove with pop or del.',
      'A missing key with [] is a KeyError. Use in to check, or get(key, default) to read safely.',
      'Loop with for k in d, d.values(), or for k, v in d.items().',
      'Group totals with totals[key] = totals.get(key, 0) + amount.'
    ],
    projectStep: {
      title: 'Expense Tracker: expenses as dictionaries',
      steps: [
        'Write make_expense(item, amount, category) that returns a dictionary.',
        'Create three expenses with it.',
        'Write describe(expense) that returns a readable line, and print each expense.',
        'Add up the amount of each category into a totals dictionary with get().'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 11,
    title: 'Lists of Dictionaries: Real Data',
    goal: 'You can store many records as a list of dictionaries, and total, filter, search and sort them.',
    minutes: 30,
    recap: 'Yesterday you stored the details of one expense in a dictionary and added up totals per category with get().',
    parts: [
      {
        title: 'The shape of real data',
        say: [
          'Yesterday one expense became a dictionary. Today you put many of them in a list. A list of dictionaries is the most important data shape in this whole course, because almost all real app data looks like this.',
          'Each dictionary is one record: one expense, one user, one order. The list holds all the records in order. When a shopping app shows your orders, or a bank app shows your transactions, the data behind the screen is a list of dictionaries.',
          'When you later call a web API on Day 26, or build your own on Day 27, the data going back and forth will be in this shape too, written as JSON, which you will learn on Day 17.',
          'To read one value, you go in two steps: first the position in the list, then the key in the dictionary. expenses[0]["amount"] means: the first expense, and its amount.'
        ],
        example: 'Think of a class register as a stack of student cards. The stack is the list. Each card is a dictionary with the same labels: name, roll number, marks. To find the marks of the first student, you pick the first card, then read the marks line.',
        code: lines(
          'expenses = [',
          '    {"item": "Tea", "amount": 20, "category": "food"},',
          '    {"item": "Bus", "amount": 45, "category": "travel"},',
          '    {"item": "Lunch", "amount": 120, "category": "food"},',
          ']',
          'print(len(expenses))',
          'print(expenses[0])',
          'print(expenses[0]["item"])',
          'print(expenses[-1]["amount"])'
        ),
        output: lines('3', "{'item': 'Tea', 'amount': 20, 'category': 'food'}", 'Tea', '120'),
        codeNotes: [
          { line: 1, note: 'A list can be written over several lines. Each line is one dictionary.' },
          { line: 8, note: 'First the position (0), then the key ("item").' },
          { line: 9, note: 'The last expense, and its amount.' }
        ],
        tryIt: 'Add a fourth dictionary for a movie ticket costing 300 in the "fun" category. Run it and check that len(expenses) is now 4 and the last amount is 300.',
        check: {
          question: 'For the list above, what is expenses[1]["category"]?',
          options: ['"travel"', '"food"', '"Bus"'],
          answer: 0,
          why: 'expenses[1] is the second dictionary (the bus), and its "category" key holds "travel".'
        }
      },
      {
        title: 'Looping over records',
        say: [
          'To do something with every record, loop over the list. Each round, the loop variable holds one whole dictionary. Name it after one record, like expense, so the code reads naturally: for expense in expenses.',
          'Inside the loop, you read the details with keys: expense["item"], expense["amount"]. This is much clearer than the two separate lists from Day 8. The name and the amount can never get out of step, because they live in the same dictionary.',
          'The accumulator pattern works here too. Start total = 0 before the loop and add expense["amount"] each round.',
          'You can also add or change keys on each record inside the loop, for example marking every expense over 1000 as "big". Because dictionaries can change, the change stays in the list.'
        ],
        example: 'A delivery person with a stack of parcels: for each parcel, read the name and address label, deliver it, and tick it off. The parcels are the dictionaries; the labels are the keys.',
        code: lines(
          'expenses = [',
          '    {"item": "Tea", "amount": 20},',
          '    {"item": "Rent", "amount": 8000},',
          '    {"item": "Lunch", "amount": 120},',
          ']',
          'total = 0',
          'for expense in expenses:',
          '    print(expense["item"], "-", expense["amount"])',
          '    total += expense["amount"]',
          '    expense["big"] = expense["amount"] > 1000',
          'print("Total:", total)',
          'print(expenses[1])'
        ),
        output: lines('Tea - 20', 'Rent - 8000', 'Lunch - 120', 'Total: 8140', "{'item': 'Rent', 'amount': 8000, 'big': True}"),
        codeNotes: [
          { line: 7, note: 'Each round, expense is one whole dictionary.' },
          { line: 10, note: 'Add a new key to each record. The change stays in the list.' }
        ],
        tryIt: 'Print expenses[0] at the end too. It should have "big": False, because 20 is not over 1000.',
        check: {
          question: 'In for expense in expenses:, what does expense hold each round?',
          options: ['One whole dictionary (one record)', 'One key', 'The position number'],
          answer: 0,
          why: 'The list holds dictionaries, so each round the loop variable is the next dictionary in the list.'
        }
      },
      {
        title: 'Totals and filters with comprehensions',
        say: [
          'Everything you learned on Day 9 works here. To add up all amounts in one line: sum(e["amount"] for e in expenses). To keep only some records: [e for e in expenses if e["category"] == "food"].',
          'A filter gives you a new list of whole dictionaries, so you still have every detail of each record you kept. You can then total, count or print that smaller list.',
          'You can also pull out one field from every record: [e["item"] for e in expenses] gives a plain list of item names. This is useful for showing a short summary.',
          'These one-liners are exactly what your practice tasks ask for today, and they will be at the heart of the Expense Tracker in Week 4.'
        ],
        example: 'In a spreadsheet, you might filter the rows to show only "food", then look at the sum at the bottom of the amount column. A comprehension with an if is the filter, and sum() is the total at the bottom.',
        code: lines(
          'expenses = [',
          '    {"item": "Tea", "amount": 20, "category": "food"},',
          '    {"item": "Bus", "amount": 45, "category": "travel"},',
          '    {"item": "Lunch", "amount": 120, "category": "food"},',
          '    {"item": "Metro", "amount": 30, "category": "travel"},',
          ']',
          'print(sum(e["amount"] for e in expenses))',
          'food = [e for e in expenses if e["category"] == "food"]',
          'print(len(food), "food expenses")',
          'print(sum(e["amount"] for e in food))',
          'print([e["item"] for e in expenses])'
        ),
        output: lines('215', '2 food expenses', '140', "['Tea', 'Bus', 'Lunch', 'Metro']"),
        codeNotes: [
          { line: 7, note: 'Add up the amount of every record.' },
          { line: 8, note: 'Keep only the food records. Each kept item is a full dictionary.' },
          { line: 11, note: 'Pull out just the item names.' }
        ],
        tryIt: 'Make a list of the items in the travel category only: [e["item"] for e in expenses if e["category"] == "travel"]. It should be [\'Bus\', \'Metro\'].',
        check: {
          question: 'What does [e for e in expenses if e["amount"] > 100] give?',
          options: ['A list of the whole expense dictionaries with amount over 100', 'A list of amounts over 100', 'The total of amounts over 100'],
          answer: 0,
          why: 'The part before for is e, the whole dictionary, so the new list holds full records that pass the filter.'
        }
      },
      {
        title: 'Finding one record',
        say: [
          'Often you need one particular record: the expense with id 3, or the user with a given email. The simple way is a loop that returns as soon as it finds a match.',
          'Put this in a function. Loop over the records, and when one matches, return it. If the loop finishes without finding anything, return None. The caller can then check if the result is None.',
          'max() and min() can also find a record, not just a number. max(expenses, key=lambda e: e["amount"]) gives the whole dictionary with the biggest amount.',
          'The key=lambda e: e["amount"] part tells max what to compare. A lambda is a tiny one-line function without a name. Read it as "for each e, compare e\'s amount". You will see lambda again for sorting in a moment.'
        ],
        example: 'Looking for your friend\'s parcel in a pile: you check each label, and as soon as you find their name, you stop and hand it over. If you reach the bottom of the pile without finding it, you tell them "not here". That is return inside the loop, and None after it.',
        code: lines(
          'expenses = [',
          '    {"id": 1, "item": "Tea", "amount": 20},',
          '    {"id": 2, "item": "Rent", "amount": 8000},',
          '    {"id": 3, "item": "Lunch", "amount": 120},',
          ']',
          'def find_by_id(records, wanted):',
          '    for record in records:',
          '        if record["id"] == wanted:',
          '            return record',
          '    return None',
          '',
          'print(find_by_id(expenses, 3))',
          'print(find_by_id(expenses, 9))',
          'biggest = max(expenses, key=lambda e: e["amount"])',
          'print(biggest["item"])'
        ),
        output: lines("{'id': 3, 'item': 'Lunch', 'amount': 120}", 'None', 'Rent'),
        codeNotes: [
          { line: 9, note: 'Found it: return straight away. The rest of the loop does not run.' },
          { line: 10, note: 'The loop finished without a match, so return None.' },
          { line: 14, note: 'max compares the records by their amount and returns the whole record.' }
        ],
        tryIt: 'Use min with the same key to find the cheapest expense, and print its item. It should be Tea.',
        check: {
          question: 'Why does find_by_id have return None after the loop?',
          options: ['So the caller gets a clear "not found" answer when nothing matches', 'Because every function must end with None', 'To restart the loop'],
          answer: 0,
          why: 'If no record matches, the loop ends without returning. return None makes the "not found" result clear.'
        }
      },
      {
        title: 'Sorting records',
        say: [
          'To show records in a useful order, use sorted() with a key, just like max. sorted(expenses, key=lambda e: e["amount"]) gives a new list from the smallest amount to the largest.',
          'Add reverse=True to sort from largest to smallest. For text keys, like item names or dates written as "2026-09-28", sorting puts them in alphabetical order. Dates written year-month-day sort correctly as text, which is one reason that format is used everywhere.',
          'sorted() returns a new list and leaves the original alone. If you want to sort the list itself, use expenses.sort(key=...), which changes the list and returns None.',
          'Showing the newest first or the biggest first is something almost every app does. Sorting by a key is how.'
        ],
        example: 'A cricket points table: the same list of teams, sorted by points so the leader is at the top. The teams did not change; only the order in which they are shown did.',
        code: lines(
          'expenses = [',
          '    {"item": "Tea", "amount": 20, "date": "2026-09-03"},',
          '    {"item": "Rent", "amount": 8000, "date": "2026-09-01"},',
          '    {"item": "Lunch", "amount": 120, "date": "2026-09-10"},',
          ']',
          'by_amount = sorted(expenses, key=lambda e: e["amount"], reverse=True)',
          'print([e["item"] for e in by_amount])',
          'newest = sorted(expenses, key=lambda e: e["date"], reverse=True)',
          'print([e["date"] for e in newest])',
          'print(expenses[0]["item"])'
        ),
        output: lines("['Rent', 'Lunch', 'Tea']", "['2026-09-10', '2026-09-03', '2026-09-01']", 'Tea'),
        codeNotes: [
          { line: 6, note: 'Biggest amount first.' },
          { line: 8, note: 'Dates as year-month-day text sort in the right order.' },
          { line: 10, note: 'The original list is unchanged: Tea is still first.' }
        ],
        tryIt: 'Sort by item name with key=lambda e: e["item"] and print the names. They should be in A to Z order: Lunch, Rent, Tea.',
        check: {
          question: 'Why do dates like "2026-09-10" sort correctly as text?',
          options: ['Year, then month, then day, each with a fixed number of digits, so alphabetical order is date order', 'Python recognises dates automatically', 'They do not; you must convert them first'],
          answer: 0,
          why: 'In year-month-day format with leading zeros, comparing the text character by character gives the same order as the dates.'
        }
      },
      {
        title: 'Putting it together: a monthly report',
        say: [
          'Let us combine today\'s tools into a small report for the Expense Tracker: the total, the total per category, the biggest expense, and the three newest expenses.',
          'Look at how each question is one or two lines, because the data is in a good shape. This is a big lesson in programming: when the data shape is right, the code becomes simple.',
          'The category totals use the get() pattern from yesterday, but now reading the category and amount from each record.',
          'In today\'s practice you will write total_spent, which adds up the amounts of a list of expenses, and by_category, which keeps only the expenses of one category.'
        ],
        example: 'At the end of a month, you open your bank statement and ask: how much did I spend, where did it go, what was the biggest payment, and what were the last few? This program answers exactly those questions.',
        code: lines(
          'expenses = [',
          '    {"item": "Tea", "amount": 20, "category": "food", "date": "2026-09-03"},',
          '    {"item": "Rent", "amount": 8000, "category": "home", "date": "2026-09-01"},',
          '    {"item": "Lunch", "amount": 120, "category": "food", "date": "2026-09-10"},',
          '    {"item": "Bus", "amount": 45, "category": "travel", "date": "2026-09-08"},',
          ']',
          'print("Total:", sum(e["amount"] for e in expenses))',
          'totals = {}',
          'for e in expenses:',
          '    totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]',
          'print("By category:", totals)',
          'print("Biggest:", max(expenses, key=lambda e: e["amount"])["item"])',
          'newest = sorted(expenses, key=lambda e: e["date"], reverse=True)[:3]',
          'print("Newest:", [e["item"] for e in newest])'
        ),
        output: lines(
          'Total: 8185',
          "By category: {'food': 140, 'home': 8000, 'travel': 45}",
          'Biggest: Rent',
          "Newest: ['Lunch', 'Bus', 'Tea']"
        ),
        codeNotes: [
          { line: 10, note: 'The grouping pattern from Day 10, reading from each record.' },
          { line: 13, note: 'Sort newest first, then take the first three with a slice.' }
        ],
        tryIt: 'Add a fifth expense of your own with today\'s date, and run the report. It should appear first in the Newest list.',
        check: {
          question: 'Why is this report so short to write?',
          options: ['The data is a list of dictionaries, so each question is a simple loop, filter or sort', 'Python has a built-in report function', 'The list is small'],
          answer: 0,
          why: 'With the right data shape, totals, groups, maximums and sorting each take only a line or two.'
        }
      }
    ],
    summary: [
      'Real app data is usually a list of dictionaries: one dictionary per record.',
      'Read a value in two steps: expenses[0]["amount"].',
      'Loop with for e in expenses, and use comprehensions to total, filter and pick fields.',
      'Find one record with a loop that returns it, or None if not found.',
      'Sort or find the biggest with key=lambda e: e["amount"].'
    ],
    projectStep: {
      title: 'Expense Tracker: a list of expense records',
      steps: [
        'Make a list of at least five expense dictionaries with item, amount, category and date.',
        'Print the total and the totals per category.',
        'Print the biggest expense and the three newest ones.',
        'Write find_by_item(expenses, name) that returns the matching record or None.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 12,
    title: 'Tuples and Sets',
    goal: 'You can use tuples for fixed groups of values and sets for unique values, and choose between list, tuple, set and dictionary.',
    minutes: 30,
    recap: 'Yesterday you worked with a list of dictionaries: totals, filters, searching and sorting.',
    parts: [
      {
        title: 'Tuples: fixed groups of values',
        say: [
          'A tuple is like a list that cannot be changed. You write it with round brackets instead of square ones: point = (12.97, 77.59). You read items by position, exactly like a list: point[0].',
          'Once a tuple is created, you cannot add, remove or replace items. That sounds like a limitation, but it is useful. It tells everyone reading the code that this group of values belongs together and should stay fixed.',
          'Tuples are used for small groups where each position has a fixed meaning: a map location (latitude, longitude), a colour (red, green, blue), or a date (year, month, day).',
          'If you try to change a tuple, like point[0] = 5, Python gives a TypeError saying the tuple does not support item assignment.'
        ],
        example: 'Your date of birth is like a tuple: (day, month, year). It is one fixed group of three values, and it never changes. Your shopping list, on the other hand, changes all the time, so it is a list.',
        code: lines(
          'bengaluru = (12.97, 77.59)',
          'print(bengaluru[0])',
          'print(bengaluru[1])',
          'print(len(bengaluru))',
          'birthday = (15, 8, 2004)',
          'print(birthday)',
          'print(type(birthday))'
        ),
        output: lines('12.97', '77.59', '2', '(15, 8, 2004)', "<class 'tuple'>"),
        codeNotes: [
          { line: 1, note: 'Round brackets make a tuple.' },
          { line: 2, note: 'Read by position, just like a list.' }
        ],
        tryIt: 'Add bengaluru[0] = 13 at the end and run it. Read the TypeError: tuples cannot be changed. Then delete that line.',
        check: {
          question: 'What is the main difference between a tuple and a list?',
          options: ['A tuple cannot be changed after it is created', 'A tuple can only hold numbers', 'A tuple has no positions'],
          answer: 0,
          why: 'Tuples are fixed. Lists can have items added, removed and replaced.'
        }
      },
      {
        title: 'Unpacking and returning several values',
        say: [
          'Unpacking means taking the values out of a tuple into separate variables in one line: lat, lng = bengaluru. The number of names on the left must match the number of values.',
          'You have already used unpacking without the name: for i, item in enumerate(...) and for key, value in d.items(). Each round gives a small tuple, and the loop unpacks it.',
          'Tuples also let a function return more than one value. return smallest, largest actually returns a tuple, and the caller can unpack it: low, high = min_max(amounts).',
          'A neat Python trick uses the same idea to swap two variables: a, b = b, a. No temporary variable needed.'
        ],
        example: 'Unpacking is like opening a tiffin box with three compartments and putting the rice, dal and sabzi on three separate plates in one go. You know exactly which compartment holds what.',
        code: lines(
          'location = (12.97, 77.59)',
          'lat, lng = location',
          'print("Latitude:", lat)',
          '',
          'def min_max(numbers):',
          '    return min(numbers), max(numbers)',
          '',
          'low, high = min_max([45, 20, 300, 120])',
          'print(low, high)',
          'a, b = 1, 2',
          'a, b = b, a',
          'print(a, b)'
        ),
        output: lines('Latitude: 12.97', '20 300', '2 1'),
        codeNotes: [
          { line: 2, note: 'Two names on the left, two values in the tuple.' },
          { line: 6, note: 'Returning two values separated by a comma returns a tuple.' },
          { line: 11, note: 'Swap two values in one line.' }
        ],
        tryIt: 'Print the result of min_max without unpacking: print(min_max([5, 9, 1])). You will see the tuple (1, 9).',
        check: {
          question: 'After x, y = (3, 7), what is y?',
          options: ['7', '3', '(3, 7)'],
          answer: 0,
          why: 'Unpacking puts the first value into x and the second into y.'
        }
      },
      {
        title: 'Sets: only unique values',
        say: [
          'A set is a group of values where each value appears only once. You write it with curly brackets but without keys: {"food", "travel"}. If you add a value that is already there, nothing changes.',
          'The most common use is removing duplicates: set(list) turns a list into a set and drops repeated values. This is very handy for questions like "which categories did I spend money on?".',
          'Sets do not keep items in order, and you cannot read them by position. If you need them in order, turn the set into a sorted list: sorted(my_set).',
          'One small trap: {} makes an empty dictionary, not an empty set. For an empty set, write set().'
        ],
        example: 'A guest list for a wedding: even if an uncle is invited by three different family members, his name appears on the final list only once. A set keeps each name once, no matter how many times it is added.',
        code: lines(
          'categories = ["food", "travel", "food", "rent", "food"]',
          'unique = set(categories)',
          'print(len(unique))',
          'print(sorted(unique))',
          'tags = set()',
          'tags.add("urgent")',
          'tags.add("urgent")',
          'tags.add("work")',
          'print(sorted(tags))'
        ),
        output: lines('3', "['food', 'rent', 'travel']", "['urgent', 'work']"),
        codeNotes: [
          { line: 2, note: 'Duplicates are dropped: food appears only once.' },
          { line: 4, note: 'Sets have no order, so sort them to print them neatly.' },
          { line: 7, note: 'Adding a value that is already there changes nothing.' }
        ],
        tryIt: 'Count how many different letters are in "mississippi" with len(set("mississippi")). The answer is 4: m, i, s and p.',
        check: {
          question: 'What is len(set([1, 2, 2, 3, 3, 3]))?',
          options: ['3', '6', '1'],
          answer: 0,
          why: 'A set keeps each value once, so it holds 1, 2 and 3: three values.'
        }
      },
      {
        title: 'Checking membership quickly',
        say: [
          'The word in works with sets too, and it is much faster than with a list when there are many values. To check if something is in a list, Python may have to look at every item. A set can answer almost instantly, however big it is.',
          'This matters in real programs. Checking whether a username is already taken, whether an email is on a block list, or whether a product code is valid: all these are membership checks, and sets are the right tool.',
          'Sets can also compare two groups. a & b gives the values in both sets. a | b gives the values in either. a - b gives the values in a but not in b.',
          'For example, comparing the categories you spent on this month and last month tells you what is new and what stopped.'
        ],
        example: 'A security guard with a printed list of 500 names has to read down the list to find yours. A guard with a smart scanner answers instantly. A set is the smart scanner: checking if something is inside takes the same short time however long the list is.',
        code: lines(
          'taken = {"asha", "ravi", "priya"}',
          'print("ravi" in taken)',
          'print("neha" in taken)',
          'this_month = {"food", "travel", "rent", "movies"}',
          'last_month = {"food", "rent", "gym"}',
          'print(sorted(this_month & last_month))',
          'print(sorted(this_month - last_month))',
          'print(sorted(last_month - this_month))'
        ),
        output: lines('True', 'False', "['food', 'rent']", "['movies', 'travel']", "['gym']"),
        codeNotes: [
          { line: 6, note: '& gives the categories in both months.' },
          { line: 7, note: 'New this month: in this month, not last month.' },
          { line: 8, note: 'Stopped: in last month, not this month.' }
        ],
        tryIt: 'Print all categories from both months together with sorted(this_month | last_month). You should see five categories.',
        check: {
          question: 'Why use a set instead of a list to check if a username is taken?',
          options: ['Checking membership in a set is very fast, even with millions of names', 'Sets keep names in order', 'Lists cannot hold text'],
          answer: 0,
          why: 'A list may need to check every item; a set answers almost instantly. Sets have no order at all.'
        }
      },
      {
        title: 'Choosing the right container',
        say: [
          'You now know four ways to group values: list, tuple, set and dictionary. Choosing the right one makes your code simpler and clearer. Here is a simple guide.',
          'Use a list when order matters and the group changes: expenses, messages, a to-do list. Use a tuple for a small, fixed group where each position has a meaning: coordinates, a returned pair.',
          'Use a set when you only care whether something is there, and duplicates make no sense: unique categories, tags, seen IDs. Use a dictionary when you look things up by name: one record\'s details, or totals per category.',
          'Very often they are combined. A list of dictionaries holds records. A dictionary of lists groups records by category. A set of tuples could hold unique locations. Interviews often ask why you picked a container, so practise explaining your choice.'
        ],
        example: 'In a kitchen: a shopping list is a list (order and changes), a recipe\'s oven setting of (temperature, minutes) is a tuple (fixed pair), the spices you own is a set (you either have it or not), and the labelled spice rack is a dictionary (find by name).',
        code: lines(
          'expenses = [("Tea", 20, "food"), ("Bus", 45, "travel"), ("Lunch", 120, "food")]',
          'categories = {category for _, _, category in expenses}',
          'by_category = {}',
          'for item, amount, category in expenses:',
          '    by_category.setdefault(category, []).append(item)',
          'print(sorted(categories))',
          'print(by_category)'
        ),
        output: lines("['food', 'travel']", "{'food': ['Tea', 'Lunch'], 'travel': ['Bus']}"),
        codeNotes: [
          { line: 1, note: 'A list of tuples: each expense is a fixed (item, amount, category) group.' },
          { line: 2, note: 'A set comprehension: curly brackets make a set. _ means "a value I do not need".' },
          { line: 5, note: 'setdefault gives the list for this category, creating an empty one the first time.' }
        ],
        tryIt: 'Add ("Metro", 30, "travel") to the expenses and run it. by_category should now list Bus and Metro under travel.',
        check: {
          question: 'Which container fits "the unique tags on a blog post" best?',
          options: ['A set', 'A tuple', 'A list of dictionaries'],
          answer: 0,
          why: 'Tags should not repeat, their order does not matter, and you mostly check whether a tag is present. That is exactly what a set is for.'
        }
      },
      {
        title: 'Putting it together: categories and ranges',
        say: [
          'Let us use today\'s tools on the Expense Tracker. We find the unique categories with a set, get the smallest and largest amounts with a function that returns a tuple, and check whether any expense is in a category we have not seen before.',
          'Notice how each container is used for what it is best at: a list of dictionaries for the records, a set for unique values, a tuple for the (low, high) pair.',
          'This is the level of thinking employers look for in a junior developer: not just making the code work, but choosing a clear, sensible data shape.',
          'In today\'s practice you will return the unique categories sorted A to Z, and write min_max that returns a tuple.'
        ],
        example: 'A shop owner at the end of the month wants to know: which kinds of products sold (a set of categories), and the cheapest and most expensive sale (a pair of numbers). Two simple containers answer both questions.',
        code: lines(
          'expenses = [',
          '    {"item": "Tea", "amount": 20, "category": "food"},',
          '    {"item": "Bus", "amount": 45, "category": "travel"},',
          '    {"item": "Lunch", "amount": 120, "category": "food"},',
          '    {"item": "Gym", "amount": 900, "category": "health"},',
          ']',
          'categories = sorted({e["category"] for e in expenses})',
          'print(categories)',
          'def amount_range(records):',
          '    amounts = [e["amount"] for e in records]',
          '    return min(amounts), max(amounts)',
          'low, high = amount_range(expenses)',
          'print("From", low, "to", high)',
          'known = {"food", "travel", "rent"}',
          'print("New categories:", sorted(set(categories) - known))'
        ),
        output: lines("['food', 'health', 'travel']", 'From 20 to 900', "New categories: ['health']"),
        codeNotes: [
          { line: 7, note: 'A set comprehension removes duplicates; sorted gives an A to Z list.' },
          { line: 11, note: 'Return two values as a tuple.' },
          { line: 15, note: 'Set difference: categories we have not seen before.' }
        ],
        tryIt: 'Add "health" to the known set and run it again. The new categories list becomes empty: [].',
        check: {
          question: 'Why does the code use sorted() on the set of categories?',
          options: ['Sets have no order, so sorting gives a stable A to Z list', 'Sets cannot be printed', 'sorted removes duplicates'],
          answer: 0,
          why: 'The set already removed duplicates. sorted turns it into a list in a predictable order for display and for checks.'
        }
      }
    ],
    summary: [
      'A tuple is a fixed group in round brackets: (12.97, 77.59). It cannot be changed.',
      'Unpacking: lat, lng = location. Functions can return several values as a tuple.',
      'A set holds unique values: set(list) removes duplicates. Empty set is set(), not {}.',
      'in is very fast on a set. & gives values in both, | in either, - in one but not the other.',
      'List for ordered changing data, tuple for fixed groups, set for unique values, dictionary for lookup by name.'
    ],
    projectStep: {
      title: 'Expense Tracker: unique categories',
      steps: [
        'From your list of expense dictionaries, get the unique categories as a sorted list.',
        'Write amount_range(expenses) that returns (smallest, largest).',
        'Keep a set of "allowed" categories and print any expense whose category is not allowed.',
        'Group item names by category with setdefault.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 13,
    title: 'f-strings: Clean, Readable Output',
    goal: 'You can build text with f-strings, format money and big numbers, and line up columns into a neat receipt.',
    minutes: 30,
    recap: 'Yesterday you used tuples for fixed groups, sets for unique values, and chose the right container for each job.',
    parts: [
      {
        title: 'What an f-string is',
        say: [
          'Until now you built text by joining pieces with + and str(), like "Tea costs " + str(amount). It works, but it is easy to forget a space or a str(), and long lines become hard to read.',
          'An f-string is a better way. Put the letter f just before the opening quote, and write values inside curly brackets right in the text: f"Tea costs {amount}". Python replaces {amount} with its value. No str() needed.',
          'The f stands for formatted. f-strings are the modern, standard way to build text in Python. You will see them in almost every Python codebase and job interview.',
          'If you forget the f, Python prints the curly brackets as they are. If you see {amount} in your output, check for a missing f.'
        ],
        example: 'An f-string is like a fill-in-the-blanks form letter: "Dear {name}, your order of {amount} rupees has shipped." The template is written once, and the blanks are filled in for each customer.',
        code: lines(
          'item = "Tea"',
          'amount = 20',
          'print("Old way: " + item + " costs " + str(amount))',
          'print(f"New way: {item} costs {amount}")',
          'print("Forgot the f: {item}")'
        ),
        output: lines('Old way: Tea costs 20', 'New way: Tea costs 20', 'Forgot the f: {item}'),
        codeNotes: [
          { line: 4, note: 'f before the quote, values in curly brackets.' },
          { line: 5, note: 'Without the f, the brackets are printed as plain text.' }
        ],
        tryIt: 'Add a variable city = "Pune" and print f"{item} in {city} costs {amount}".',
        check: {
          question: 'What does f"Total: {5 + 5}" give?',
          options: ['"Total: 10"', '"Total: {5 + 5}"', '"Total: 5 + 5"'],
          answer: 0,
          why: 'Inside the curly brackets of an f-string, Python works out the expression, so {5 + 5} becomes 10.'
        }
      },
      {
        title: 'Expressions inside the brackets',
        say: [
          'You can put more than a variable name inside the curly brackets. Any expression works: maths like {price * 2}, method calls like {name.upper()}, function calls like {len(items)}, or dictionary lookups.',
          'For a dictionary lookup inside an f-string, use different quotes inside and outside. If the f-string uses double quotes, write the key with single quotes: f"{expense[\'item\']}". Mixing them up confuses Python about where the string ends.',
          'Keep the expressions short. If the calculation is long, work it out in a variable first, then put the variable in the f-string. The goal is readable text, not clever code.',
          'You can also put a conditional expression inside: {"paid" if paid else "pending"}. This is handy for status labels.'
        ],
        example: 'A bill printer does small calculations while printing: "3 x Tea = 60". It does not need a separate step for 3 times 20; it works it out in the line itself. Expressions in f-strings do the same.',
        code: lines(
          'price = 20',
          'quantity = 3',
          'name = "masala chai"',
          'expense = {"item": "Bus", "amount": 45}',
          'paid = False',
          'print(f"{quantity} x {name.title()} = {price * quantity}")',
          "print(f\"{expense['item']} cost {expense['amount']}\")",
          'print(f"Status: {\'paid\' if paid else \'pending\'}")'
        ),
        output: lines('3 x Masala Chai = 60', 'Bus cost 45', 'Status: pending'),
        codeNotes: [
          { line: 6, note: 'A method call and a calculation, right inside the text. title() capitalises each word.' },
          { line: 7, note: 'Single quotes for the keys inside a double-quoted f-string.' }
        ],
        tryIt: 'Change paid to True and run it. The status becomes paid.',
        check: {
          question: 'Inside f"...", how should you write a dictionary key like "item"?',
          options: ['With single quotes: {d[\'item\']}', 'With the same double quotes: {d["item"]}', 'Without quotes: {d[item]}'],
          answer: 0,
          why: 'Using the other kind of quote inside avoids ending the f-string early. Without quotes, Python would look for a variable called item.'
        }
      },
      {
        title: 'Formatting numbers: decimals and commas',
        say: [
          'f-strings can also control how a number looks. Add a colon and a format after the value. {amount:.2f} shows exactly 2 decimal places, which is what you want for money: 20 becomes 20.00 and 99.5 becomes 99.50.',
          'The .2f means: a float with 2 digits after the point. .1f would give 1 digit, .0f none. Formatting rounds the number for display but does not change the variable.',
          '{n:,} adds commas as thousands separators: 1250000 becomes 1,250,000. You can combine them: {n:,.2f} gives 1,250,000.00. Note that this uses the international grouping, not the Indian lakh style.',
          '{ratio:.1%} shows a fraction as a percentage: 0.456 becomes 45.6%. It multiplies by 100 and adds the % sign for you.'
        ],
        example: 'A bank statement never shows 20 or 99.5. It shows 20.00 and 99.50, always two decimals, so the columns look consistent and nobody wonders about missing paise. The format code is how you ask Python for that look.',
        code: lines(
          'amount = 99.5',
          'print(f"Rs {amount:.2f}")',
          'print(f"Rs {20:.2f}")',
          'salary = 1250000',
          'print(f"Rs {salary:,}")',
          'print(f"Rs {salary:,.2f}")',
          'used = 4815 / 5000',
          'print(f"Budget used: {used:.1%}")'
        ),
        output: lines('Rs 99.50', 'Rs 20.00', 'Rs 1,250,000', 'Rs 1,250,000.00', 'Budget used: 96.3%'),
        codeNotes: [
          { line: 2, note: '.2f: always 2 decimal places.' },
          { line: 5, note: ', adds thousands separators.' },
          { line: 8, note: '.1% turns 0.963 into a percentage with 1 decimal.' }
        ],
        tryIt: 'Print f"{1/3:.3f}" and f"{1/3:.0%}". You should see 0.333 and 33%.',
        check: {
          question: 'What does f"{7:.2f}" show?',
          options: ['7.00', '7', '7.2'],
          answer: 0,
          why: '.2f means show the number with exactly 2 decimal places, so 7 becomes 7.00.'
        }
      },
      {
        title: 'Lining up columns',
        say: [
          'To make neat tables and receipts, you need columns that line up. f-strings can pad a value to a fixed width. {item:<10} makes the item at least 10 characters wide, filling with spaces on the right. The < means left-aligned.',
          '{amount:>8} makes the amount 8 characters wide, aligned to the right, which is how numbers look best in columns. ^ centres the value.',
          'You can combine width with number formats: {amount:>8.2f} is right-aligned in 8 characters with 2 decimals. The width comes first, then the format.',
          'If a value is longer than the width, it is not cut. It just pushes the rest of the line along. Choose widths that fit your longest values.'
        ],
        example: 'A printed restaurant bill has item names on the left and prices lined up on the right, all ending at the same place. The printer pads each line with spaces so the columns stay straight. Width formatting does that padding.',
        code: lines(
          'print(f"[{\'Tea\':<10}]")',
          'print(f"[{45:>8}]")',
          'print(f"[{\'Menu\':^10}]")',
          'print(f"{\'Tea\':<10}{20:>8.2f}")',
          'print(f"{\'Lunch\':<10}{120.5:>8.2f}")',
          'print(f"{\'Rent\':<10}{8000:>8.2f}")'
        ),
        output: lines('[Tea       ]', '[      45]', '[   Menu   ]', 'Tea          20.00', 'Lunch       120.50', 'Rent       8000.00'),
        codeNotes: [
          { line: 1, note: 'Square brackets in the text show the padding clearly.' },
          { line: 4, note: 'Name left-aligned in 10, amount right-aligned in 8 with 2 decimals.' }
        ],
        tryIt: 'Change the width 10 to 14 on the last three lines and run it. The amounts move right but stay lined up.',
        check: {
          question: 'What does the > in {amount:>8} mean?',
          options: ['Right-align the value in a space 8 characters wide', 'Only show amounts greater than 8', 'Show 8 decimal places'],
          answer: 0,
          why: 'In a format, > means right-align and 8 is the width. Decimals use .2f.'
        }
      },
      {
        title: 'Multi-line text and join',
        say: [
          'For longer text you often build several lines. One way is to put the lines in a list and join them: "\\n".join(lines). \\n is the newline character, a special code that means "start a new line".',
          'join works with any separator. ", ".join(names) gives "Tea, Bus, Lunch". It is the cleanest way to make a readable list of words, and the opposite of split(), which you will use on Day 16.',
          'join only works with strings. If you have numbers, turn them into strings first, for example with a comprehension: ", ".join(str(a) for a in amounts).',
          'Building text as a list of lines and joining at the end is a common pattern for reports, emails and receipts. It also makes the text easy to test, because a function can return the whole text instead of printing it.'
        ],
        example: 'Writing a message on a greeting card: you write each line, and the card places them one under the other. join with a newline is you telling Python "put these lines one under another".',
        code: lines(
          'names = ["Tea", "Bus", "Lunch"]',
          'print(", ".join(names))',
          'amounts = [20, 45, 120]',
          'print(" + ".join(str(a) for a in amounts))',
          'report = ["Report", "------", f"Items: {len(names)}"]',
          'print("\\n".join(report))'
        ),
        output: lines('Tea, Bus, Lunch', '20 + 45 + 120', 'Report', '------', 'Items: 3'),
        codeNotes: [
          { line: 2, note: 'Join the names with a comma and a space between each.' },
          { line: 4, note: 'Numbers must become text before joining.' },
          { line: 6, note: 'Join the lines with a newline, so each goes on its own line.' }
        ],
        tryIt: 'Change line 4 to also show the total: print(" + ".join(str(a) for a in amounts) + f" = {sum(amounts)}"). You should see 20 + 45 + 120 = 185.',
        check: {
          question: 'What does "-".join(["a", "b", "c"]) give?',
          options: ['"a-b-c"', '"-a-b-c-"', '["a-", "b-", "c"]'],
          answer: 0,
          why: 'join puts the separator between the items, not at the ends.'
        }
      },
      {
        title: 'Putting it together: a printed receipt',
        say: [
          'Let us put today\'s tools together into a proper receipt for the Expense Tracker: a centred title, a line of dashes, one neat line per expense, and a total at the bottom.',
          'Notice that receipt_line is a function that returns a string. The report function builds a list of lines and joins them. Nothing is printed until the very end. This makes both functions easy to test and reuse.',
          'Real apps use exactly this approach to build invoices, emails and text messages. Getting the output neat is a small detail that makes your projects look professional to recruiters.',
          'In today\'s practice you will write money, which formats an amount with 2 decimals, and receipt_line, which lines up an item and an amount. Both are one-line f-strings.'
        ],
        example: 'A good shop receipt is easy to read at a glance: the shop name on top, items in a neat column, prices lined up on the right, and a clear total. Your program now prints one just like that.',
        code: lines(
          'def receipt_line(item, amount):',
          '    return f"{item:<12}{amount:>9.2f}"',
          '',
          'def receipt(expenses):',
          '    lines = [f"{\'MY EXPENSES\':^21}", "-" * 21]',
          '    for e in expenses:',
          '        lines.append(receipt_line(e["item"], e["amount"]))',
          '    lines.append("-" * 21)',
          '    total = sum(e["amount"] for e in expenses)',
          '    lines.append(receipt_line("TOTAL", total))',
          '    return "\\n".join(lines)',
          '',
          'data = [{"item": "Tea", "amount": 20}, {"item": "Lunch", "amount": 120.5}, {"item": "Rent", "amount": 8000}]',
          'print(receipt(data))'
        ),
        output: lines(
          '     MY EXPENSES     ',
          '---------------------',
          'Tea             20.00',
          'Lunch          120.50',
          'Rent          8000.00',
          '---------------------',
          'TOTAL         8140.50'
        ),
        codeNotes: [
          { line: 2, note: '12 characters for the item, 9 for the amount: 21 in total.' },
          { line: 5, note: 'The title centred in 21 characters, then a dashed line.' },
          { line: 11, note: 'The function returns the whole text; printing happens outside.' }
        ],
        tryIt: 'Add a fourth expense of your own to data and run it. The total and the columns update automatically.',
        check: {
          question: 'Why does receipt() return the text instead of printing it?',
          options: ['So the text can be tested, saved or sent, not only shown on screen', 'Because f-strings cannot be printed', 'Returning is faster than printing'],
          answer: 0,
          why: 'A returned string can be checked by tests, written to a file or emailed. Printing only shows it on the screen.'
        }
      }
    ],
    summary: [
      'f"{value}" puts values straight into text. Do not forget the f.',
      'Any short expression works inside the brackets. Use the other kind of quote for dictionary keys.',
      '{amount:.2f} gives 2 decimals, {n:,} adds commas, {r:.1%} shows a percentage.',
      '{item:<10} left-aligns in 10 characters, {amount:>8.2f} right-aligns money in 8.',
      '", ".join(list) joins strings with a separator; "\\n" means a new line.'
    ],
    projectStep: {
      title: 'Expense Tracker: a neat receipt',
      steps: [
        'Write money(amount) that returns text like "Rs 120.50".',
        'Write receipt_line(item, amount) that lines up the item and the amount.',
        'Write receipt(expenses) that returns the whole receipt text with a title and a total.',
        'Print the receipt for your list of expenses.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 14,
    title: 'Errors and try/except',
    goal: 'You can read an error message, catch expected errors with try and except, and raise your own errors with clear messages.',
    minutes: 30,
    recap: 'Yesterday you built neat text with f-strings, formatted money, and lined up a receipt.',
    parts: [
      {
        title: 'Reading an error message',
        say: [
          'By now you have seen several errors: NameError, TypeError, IndexError, KeyError, ValueError. Errors are normal. Every developer sees many every day. What matters is being able to read them calmly.',
          'A full Python error message is called a traceback, and it is best read from the bottom up. The last line tells you the type of error and a short message, like ValueError: invalid literal for int() with base 10: \'abc\'. That line alone usually tells you what went wrong. The lesson editor shows you just this last line, marked [Error].',
          'On your laptop, from Day 20, you will see the whole traceback. Above the last line, it shows the file and line number where the error happened, and the line of code itself. That tells you where to look.',
          'The most common types: NameError is a misspelt or undefined name. TypeError is the wrong type, like adding text and a number. ValueError is the right type but a bad value. KeyError is a missing dictionary key. IndexError is a list position that does not exist. ZeroDivisionError is dividing by zero.'
        ],
        example: 'An error message is like a doctor\'s report: the last line is the diagnosis ("sprained ankle"), and the lines above tell you where and how it happened. You read the diagnosis first, then look at the details.',
        code: lines(
          'amount = int("250")',
          'print(amount + 50)',
          'print("Now a bad value:")',
          'amount = int("abc")',
          'print("This line never runs")'
        ),
        output: lines(
          '300',
          'Now a bad value:',
          "[Error] ValueError: invalid literal for int() with base 10: 'abc'"
        ),
        codeNotes: [
          { line: 4, note: 'int cannot turn "abc" into a number: ValueError.' },
          { line: 5, note: 'Python stopped at the error, so this never runs.' }
        ],
        tryIt: 'Change "abc" to "12.5" and run it. It is still a ValueError, because int() does not accept decimals. Try float("12.5") instead.',
        check: {
          question: 'Where do you look first in a Python traceback?',
          options: ['The last line: the error type and message', 'The first line', 'The middle'],
          answer: 0,
          why: 'The last line names the error and explains it. The lines above show where it happened.'
        }
      },
      {
        title: 'try and except',
        say: [
          'Some errors are expected. When a user types an amount, they might type "abc". Crashing the whole program because of that would be a bad experience. Instead, you can catch the error and handle it.',
          'You put the risky code inside a try block. Below it, an except block says what to do if a certain error happens. If no error happens, the except block is skipped. If the error happens, Python jumps straight to except, and the program carries on.',
          'Always name the error you expect: except ValueError:. A bare except: with no name catches everything, including real bugs you would want to know about. That hides problems and makes them very hard to find.',
          'Keep the try block small. Put only the line that can fail inside it, not half your program.'
        ],
        example: 'A shopkeeper takes a note from a customer and checks whether it is real. If it is fake, she does not close the shop; she politely asks for another note and carries on. try is taking the note; except ValueError is the polite response to a fake one.',
        code: lines(
          'def safe_int(text):',
          '    try:',
          '        return int(text)',
          '    except ValueError:',
          '        return 0',
          '',
          'print(safe_int("45"))',
          'print(safe_int("abc"))',
          'print(safe_int(""))',
          'print("The program is still running")'
        ),
        output: lines('45', '0', '0', 'The program is still running'),
        codeNotes: [
          { line: 3, note: 'The risky line goes inside try.' },
          { line: 4, note: 'Name the exact error you expect.' },
          { line: 5, note: 'What to do instead: return 0 and carry on.' }
        ],
        tryIt: 'Add print(safe_int(None)) and run it. You get a TypeError, not a ValueError, so it is not caught. That is correct: None is a different problem that you should see.',
        check: {
          question: 'Why should you write except ValueError: instead of a bare except:?',
          options: ['A bare except also hides real bugs you did not expect', 'A bare except is slower', 'Python does not allow a bare except'],
          answer: 0,
          why: 'Naming the error catches only the problem you planned for. Other errors still show up so you can fix them.'
        }
      },
      {
        title: 'Using the error message',
        say: [
          'You can get the error itself with except ValueError as error:. The name error then holds the error object, and str(error) or printing it gives its message.',
          'This is useful for logging what went wrong, or showing a helpful message. You can also catch several error types with one except by putting them in a tuple: except (ValueError, TypeError):.',
          'Or you can have several except blocks, one per error type, each with its own response. Python uses the first one that matches.',
          'When you show a message to a user, keep it friendly and simple: "Please enter a number" is better than the raw Python message. Save the raw message for developers, in logs.'
        ],
        example: 'A call centre gets different complaints: a wrong bill goes to billing, a broken phone goes to repairs. Several except blocks are like routing each kind of problem to the right desk.',
        code: lines(
          'def divide(a, b):',
          '    try:',
          '        return a / b',
          '    except ZeroDivisionError as error:',
          '        print("Problem:", error)',
          '        return None',
          '    except TypeError:',
          '        print("Please give two numbers")',
          '        return None',
          '',
          'print(divide(10, 4))',
          'print(divide(10, 0))',
          'print(divide(10, "2"))'
        ),
        output: lines('2.5', 'Problem: division by zero', 'None', 'Please give two numbers', 'None'),
        codeNotes: [
          { line: 4, note: 'as error gives us the error object and its message.' },
          { line: 7, note: 'A second except for a different kind of problem.' }
        ],
        tryIt: 'Combine the two except blocks into one: except (ZeroDivisionError, TypeError) as error: and print the error. Run it and compare the messages.',
        check: {
          question: 'What does except KeyError as e: give you?',
          options: ['The error object in e, whose message you can print', 'The missing key\'s value', 'A new dictionary'],
          answer: 0,
          why: 'as e stores the error that was caught, so you can print or log its message.'
        }
      },
      {
        title: 'else and finally',
        say: [
          'A try statement can have two more optional parts. else runs only if no error happened in the try. It is a good place for the code that should run only on success.',
          'finally runs every time, error or not. It is used for clean-up that must always happen, like closing a file or saying "done". On Day 16 you will see a shorter way to close files with the with statement.',
          'The full order is try, then except, then else, then finally. You rarely need all four at once. try and except are the core; add else and finally when they make the code clearer.',
          'Do not put the success code inside try just because it is easier. Keeping the try small, with success code in else, makes it clear which line was expected to fail.'
        ],
        example: 'Booking a train ticket: try to pay. If payment fails (except), show an error. If it succeeds (else), show the ticket. Either way (finally), the payment screen closes.',
        code: lines(
          'def pay(amount_text):',
          '    try:',
          '        amount = float(amount_text)',
          '    except ValueError:',
          '        print("Not a valid amount:", amount_text)',
          '    else:',
          '        print(f"Paid Rs {amount:.2f}")',
          '    finally:',
          '        print("Payment screen closed")',
          '',
          'pay("250")',
          'pay("two hundred")'
        ),
        output: lines('Paid Rs 250.00', 'Payment screen closed', 'Not a valid amount: two hundred', 'Payment screen closed'),
        codeNotes: [
          { line: 6, note: 'else runs only when the try had no error.' },
          { line: 8, note: 'finally runs every time.' }
        ],
        tryIt: 'Call pay("99.5") as well. You should see Paid Rs 99.50 followed by Payment screen closed.',
        check: {
          question: 'When does the finally block run?',
          options: ['Always, whether or not there was an error', 'Only when there was an error', 'Only when there was no error'],
          answer: 0,
          why: 'finally is for clean-up that must always happen, so it runs in both cases.'
        }
      },
      {
        title: 'Raising your own errors',
        say: [
          'Sometimes your own function receives a value it cannot accept, like a negative expense amount. Instead of silently continuing with bad data, you can raise an error yourself: raise ValueError("Amount must be more than 0").',
          'raise stops the function immediately, like return, but it signals a problem. The code that called the function can catch it with try and except, or let it stop the program if it is a real bug.',
          'Choose a fitting error type. ValueError is for a bad value of the right type. TypeError is for the wrong type. Always write a clear message that says what was wrong and what is expected.',
          'Checking inputs at the start of a function is called validation. Good validation catches bad data early, close to where it came in, instead of causing confusing errors later.'
        ],
        example: 'A bank teller who receives a withdrawal slip for minus 500 rupees does not guess what you meant. She hands it back and says "the amount must be positive". raise is the function handing back the slip with a clear reason.',
        code: lines(
          'def add_expense(expenses, item, amount):',
          '    if amount <= 0:',
          '        raise ValueError(f"Amount must be more than 0, got {amount}")',
          '    expenses.append({"item": item, "amount": amount})',
          '',
          'data = []',
          'add_expense(data, "Tea", 20)',
          'try:',
          '    add_expense(data, "Refund?", -50)',
          'except ValueError as error:',
          '    print("Not added:", error)',
          'print(data)'
        ),
        output: lines('Not added: Amount must be more than 0, got -50', "[{'item': 'Tea', 'amount': 20}]"),
        codeNotes: [
          { line: 3, note: 'Stop and signal a problem with a clear message.' },
          { line: 10, note: 'The caller catches it and decides what to do.' },
          { line: 12, note: 'The bad expense was never added.' }
        ],
        tryIt: 'Remove the try and except around line 9 (keep the add_expense call, not indented) and run it. The program stops with your own error message in the traceback.',
        check: {
          question: 'What does raise ValueError("...") do in a function?',
          options: ['Stops the function and signals an error that the caller can catch', 'Prints a warning and continues', 'Returns the value ValueError'],
          answer: 0,
          why: 'raise ends the function with an error. The caller can catch it with try/except, or the program stops.'
        }
      },
      {
        title: 'Putting it together: safe input handling',
        say: [
          'Let us make the Expense Tracker safe against bad input. We simulate what a user might type, as a list of strings, and turn each one into an amount. Good values are kept, bad ones are reported, and the program never crashes.',
          'This is exactly what real forms do: they check every field, collect the problems, and tell the user what to fix. On Day 20, when you use input() on your laptop, you will use this same function with real typing.',
          'Notice that parse_amount raises its own ValueError for negative numbers, and the loop catches both kinds of problem, bad text and bad values, with the same except.',
          'In today\'s practice you will write safe_int, which returns 0 for bad text, and safe_divide, which returns None when dividing by zero.'
        ],
        example: 'A college admissions office checks each form. Forms with a missing or wrong field go into a "please fix" pile with a note. Good forms go through. The office never shuts down because of one bad form.',
        code: lines(
          'def parse_amount(text):',
          '    amount = float(text.strip())',
          '    if amount <= 0:',
          '        raise ValueError("must be more than 0")',
          '    return amount',
          '',
          'typed = ["20", " 45.5 ", "abc", "-10", "120"]',
          'good = []',
          'for text in typed:',
          '    try:',
          '        good.append(parse_amount(text))',
          '    except ValueError as error:',
          '        print(f"Skipped {text!r}: {error}")',
          'print("Saved:", good)',
          'print(f"Total: {sum(good):.2f}")'
        ),
        output: lines(
          "Skipped 'abc': could not convert string to float: 'abc'",
          "Skipped '-10': must be more than 0",
          'Saved: [20.0, 45.5, 120.0]',
          'Total: 185.50'
        ),
        codeNotes: [
          { line: 2, note: 'float() raises ValueError for text like "abc".' },
          { line: 4, note: 'Our own ValueError for negative numbers.' },
          { line: 13, note: '!r shows the text with quotes, so spaces and empty text are visible.' }
        ],
        tryIt: 'Add an empty string "" to the typed list and run it. It is skipped with a message about converting an empty string.',
        check: {
          question: 'Why does the loop keep going after "abc" fails?',
          options: ['The error is caught by except inside the loop, so the loop continues with the next value', 'Python ignores errors in loops', 'float("abc") returns 0'],
          answer: 0,
          why: 'The try/except is inside the loop, so each value is handled on its own. A bad value is reported, then the loop moves on.'
        }
      }
    ],
    summary: [
      'Read a traceback from the bottom: the error type and message, then the line.',
      'try runs risky code; except SomeError handles that error so the program continues.',
      'Name the error you expect. A bare except hides real bugs.',
      'else runs on success; finally runs every time.',
      'raise ValueError("clear message") rejects bad input early.'
    ],
    projectStep: {
      title: 'Expense Tracker: never crash on bad input',
      steps: [
        'Write parse_amount(text) that returns a float, and raises ValueError for zero or negative amounts.',
        'Run it over a list of typed values, keeping the good ones.',
        'Print a friendly message for each skipped value.',
        'Print the total of the good values with 2 decimals.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 15,
    title: "Modules and Python's Built-in Library",
    goal: 'You can import modules, use math, random and datetime, and split your own code into modules.',
    minutes: 30,
    recap: 'Yesterday you read tracebacks, caught errors with try and except, and raised your own errors.',
    parts: [
      {
        title: 'What a module is and how to import it',
        say: [
          'Python comes with a huge collection of ready-made code called the standard library. It is split into modules, and each module is a file full of useful functions on one topic: maths, dates, random numbers, files, JSON and much more.',
          'To use a module, you import it at the top of your file: import math. Then you use its tools with a dot: math.sqrt(16). The dot means "the sqrt tool inside the math module".',
          'You can also import just the tools you need: from math import sqrt, pi. Then you use them directly, without the module name: sqrt(16).',
          'Python has a saying: "batteries included". Before writing something complicated yourself, check whether the standard library already has it. It usually does, and it is well tested.'
        ],
        example: 'A module is like a toolbox. The standard library is a whole workshop of labelled toolboxes: one for measuring, one for dates, one for chance. import math is taking the measuring toolbox off the shelf so you can use its tools.',
        code: lines(
          'import math',
          'print(math.sqrt(16))',
          'print(math.ceil(4.1))',
          'print(math.floor(4.9))',
          'from math import pi',
          'print(round(pi, 4))'
        ),
        output: lines('4.0', '5', '4', '3.1416'),
        codeNotes: [
          { line: 1, note: 'Import the whole module; use its tools with math.' },
          { line: 3, note: 'ceil rounds up to the next whole number.' },
          { line: 5, note: 'Import just one name, and use it directly.' }
        ],
        tryIt: 'Work out how many buses of 40 seats are needed for 130 students: print(math.ceil(130 / 40)). It should be 4, because you cannot book part of a bus.',
        check: {
          question: 'After import math, how do you call its sqrt function?',
          options: ['math.sqrt(9)', 'sqrt(9)', 'import.sqrt(9)'],
          answer: 0,
          why: 'With import math, you reach its tools through the module name and a dot. from math import sqrt would let you write sqrt(9).'
        }
      },
      {
        title: 'The random module',
        say: [
          'The random module makes random choices. random.randint(1, 6) gives a random whole number from 1 to 6, including both ends, like a dice. random.choice(list) picks one item from a list.',
          'random.shuffle(list) mixes up a list in place. random.random() gives a decimal between 0 and 1.',
          'Random numbers are used for games, quizzes, simulations and test data. For example, a quiz app might shuffle the order of questions for each student.',
          'Because the results change every run, programs that use random are harder to test. In the example below, we print things that are always true about the result, like whether the number is in range, instead of the random number itself.'
        ],
        example: 'Drawing a name from a hat to decide who presents first in class is random.choice. Rolling a dice in Ludo is random.randint(1, 6). Shuffling a deck of cards is random.shuffle.',
        code: lines(
          'import random',
          'roll = random.randint(1, 6)',
          'print(1 <= roll <= 6)',
          'team = ["Asha", "Ravi", "Priya"]',
          'pick = random.choice(team)',
          'print(pick in team)',
          'random.shuffle(team)',
          'print(sorted(team))'
        ),
        output: lines('True', 'True', "['Asha', 'Priya', 'Ravi']"),
        codeNotes: [
          { line: 3, note: 'The number changes each run, but it is always between 1 and 6.' },
          { line: 8, note: 'After shuffling, the order changes, but sorting shows the same three names.' }
        ],
        tryIt: 'Add print(roll) and print(pick) and run the code a few times. The values change each time.',
        check: {
          question: 'Which numbers can random.randint(1, 3) give?',
          options: ['1, 2 or 3', '1 or 2 only', '0, 1, 2 or 3'],
          answer: 0,
          why: 'Unlike range, randint includes both ends, so 1, 2 and 3 are all possible.'
        }
      },
      {
        title: 'Dates with datetime',
        say: [
          'Almost every app works with dates: when an expense was made, when a bill is due, how many days are left. The datetime module handles this correctly, including different month lengths and leap years.',
          'from datetime import date gives you the date type. date(2026, 9, 28) makes a date. date.fromisoformat("2026-09-28") turns text in year-month-day format into a date. date.today() gives today\'s date.',
          'Subtracting two dates gives a timedelta, a length of time. Its .days tells you the number of days between them. Adding timedelta(days=30) to a date gives the date 30 days later.',
          'A date can be turned back into text with str(d) or d.isoformat(), which gives "2026-09-28". strftime lets you choose other formats, like "28 Sep 2026" with "%d %b %Y".'
        ],
        example: 'Counting days to your birthday on a calendar is error-prone: does this month have 30 or 31 days? Is it a leap year? datetime is a calendar that never gets this wrong.',
        code: lines(
          'from datetime import date, timedelta',
          'start = date.fromisoformat("2026-09-01")',
          'end = date(2026, 10, 1)',
          'print((end - start).days)',
          'due = start + timedelta(days=45)',
          'print(due)',
          'print(due.strftime("%d %b %Y"))',
          'print(date(2028, 3, 1) - date(2028, 2, 1))'
        ),
        output: lines('30', '2026-10-16', '16 Oct 2026', '29 days, 0:00:00'),
        codeNotes: [
          { line: 4, note: 'Subtracting dates gives a length of time; .days gives the number.' },
          { line: 5, note: 'Add 45 days. datetime handles the month change.' },
          { line: 8, note: '2028 is a leap year, so February has 29 days.' }
        ],
        tryIt: 'Print date.today() and run it. It shows the real date today. Then work out how many days until 2027-01-01.',
        check: {
          question: 'Why use datetime instead of doing date maths yourself?',
          options: ['It handles month lengths and leap years correctly', 'It is the only way to print a date', 'It makes dates into random numbers'],
          answer: 0,
          why: 'Date maths has many special cases. datetime already handles all of them correctly.'
        }
      },
      {
        title: 'Other useful modules',
        say: [
          'The standard library has many more modules. You do not need to learn them all; you need to know they exist and where to look. Here are a few you will use soon.',
          'json reads and writes JSON data, which you will learn on Day 17. statistics has mean, median and mode. collections has Counter, which counts things for you in one line.',
          'Counter is a nicer version of the counting pattern from Day 10. Counter(categories) gives the count of each value, and most_common(1) gives the most frequent one.',
          'When you need something, search "python standard library" plus what you want, for example "python standard library median". The official Python documentation at docs.python.org is the most reliable source.'
        ],
        example: 'You do not need to know every shop in your city by heart. You need to know that a pharmacy, a bank and a stationery shop exist and roughly where. The standard library is the same: know what exists, and look up the details when you need them.',
        code: lines(
          'from statistics import mean, median',
          'from collections import Counter',
          'amounts = [20, 45, 120, 45, 300]',
          'print(mean(amounts))',
          'print(median(amounts))',
          'categories = ["food", "travel", "food", "rent", "food"]',
          'counts = Counter(categories)',
          'print(counts["food"])',
          'print(counts.most_common(1))'
        ),
        output: lines('106', '45', '3', "[('food', 3)]"),
        codeNotes: [
          { line: 4, note: 'The average of the amounts.' },
          { line: 5, note: 'The middle value when sorted.' },
          { line: 9, note: 'A list with the most common value and its count, as a tuple.' }
        ],
        tryIt: 'Print counts.most_common(2) to see the top two categories. You should see food with 3, then one of the categories that appear once.',
        check: {
          question: 'What does Counter(["a", "b", "a"])["a"] give?',
          options: ['2', '1', '3'],
          answer: 0,
          why: 'Counter counts how many times each value appears. "a" appears twice.'
        }
      },
      {
        title: 'Your own modules',
        say: [
          'A module is just a Python file. When your project grows, you split it into several files, each with one topic. For the Expense Tracker, you might have storage.py for saving and loading, reports.py for totals and receipts, and main.py to run everything.',
          'In main.py you then write from reports import total, receipt, exactly like importing from the standard library. Python finds reports.py in the same folder.',
          'When a file is imported, all its top-level code runs once. So a module should mostly contain functions, not print lines. Code that should only run when you start the file directly goes inside if __name__ == "__main__":.',
          '__name__ is a special variable. It is "__main__" when you run the file yourself, and the module\'s name when it is imported. That check lets one file be both a module and a runnable script. You will set this up on your laptop on Day 20; the lesson editor runs one file at a time.'
        ],
        example: 'A big company splits work into departments: accounts, sales, HR. Each department has its own room and its own job, and they call on each other when needed. Your own modules are departments for your code.',
        projectCode: {
          label: 'reports.py and main.py on your laptop (Day 20 onwards)',
          code: lines(
            '# reports.py',
            'def total(expenses):',
            '    return sum(e["amount"] for e in expenses)',
            '',
            'if __name__ == "__main__":',
            '    # Runs only with: python reports.py',
            '    print(total([{"amount": 20}, {"amount": 45}]))',
            '',
            '# main.py',
            'from reports import total',
            '',
            'expenses = [{"item": "Tea", "amount": 20}]',
            'print("Total:", total(expenses))'
          )
        },
        code: lines(
          'def total(expenses):',
          '    return sum(e["amount"] for e in expenses)',
          '',
          'print("__name__ is", __name__)',
          'if __name__ == "__main__":',
          '    print("Running directly, so this test runs:", total([{"amount": 20}, {"amount": 45}]))'
        ),
        output: lines('__name__ is __main__', 'Running directly, so this test runs: 65'),
        codeNotes: [
          { line: 4, note: 'When you run a file yourself, __name__ is "__main__".' },
          { line: 5, note: 'This block runs only when the file is run directly, not when imported.' }
        ],
        tryIt: 'Change "__main__" on line 5 to "reports" and run it. The block no longer runs, just like when the file is imported by another file. Change it back.',
        check: {
          question: 'What is the purpose of if __name__ == "__main__": ?',
          options: ['To run some code only when the file is run directly, not when it is imported', 'To make the file run faster', 'To import the main module'],
          answer: 0,
          why: '__name__ is "__main__" only for the file you ran. Imported modules skip that block.'
        }
      },
      {
        title: 'Putting it together: due dates for bills',
        say: [
          'Let us use modules in the Expense Tracker to track bills with due dates. We use datetime to work out how many days are left for each bill, and math to round up a monthly saving target.',
          'The code imports only what it needs at the top, which is the standard style: all imports first, then functions, then the code that runs.',
          'We use a fixed "today" date so the output is the same every time. In the real app you would use date.today(). Fixing the date like this is also how developers write reliable tests for date code.',
          'In today\'s practice you will use math to calculate a circle\'s area, and datetime to count the days between two dates.'
        ],
        example: 'A phone bill reminder that says "Electricity bill due in 5 days" is doing exactly this: today\'s date, the due date, and a subtraction.',
        code: lines(
          'import math',
          'from datetime import date',
          '',
          'today = date(2026, 9, 28)',
          'bills = [',
          '    {"name": "Electricity", "amount": 1450, "due": "2026-10-03"},',
          '    {"name": "Phone", "amount": 399, "due": "2026-09-30"},',
          '    {"name": "Rent", "amount": 8000, "due": "2026-10-05"},',
          ']',
          'for bill in bills:',
          '    days_left = (date.fromisoformat(bill["due"]) - today).days',
          '    print(f"{bill[\'name\']:<12} due in {days_left} days")',
          'total = sum(b["amount"] for b in bills)',
          'print("Save per day:", math.ceil(total / 7))'
        ),
        output: lines('Electricity  due in 5 days', 'Phone        due in 2 days', 'Rent         due in 7 days', 'Save per day: 1407'),
        codeNotes: [
          { line: 4, note: 'A fixed date so the output is always the same.' },
          { line: 11, note: 'Turn the due text into a date and subtract today.' },
          { line: 14, note: 'Round up, so saving that much each day always covers the bills.' }
        ],
        tryIt: 'Sort the bills by days left before printing, using sorted(bills, key=lambda b: b["due"]). Phone should come first.',
        check: {
          question: 'Why does the example use a fixed date instead of date.today()?',
          options: ['So the output is the same every run, which makes it easy to check and test', 'date.today() does not work in Python', 'Fixed dates are faster'],
          answer: 0,
          why: 'date.today() changes every day, so the output would change. A fixed date keeps results predictable for learning and testing.'
        }
      }
    ],
    summary: [
      'The standard library has modules for most jobs. import math, then math.sqrt(16).',
      'from module import name lets you use the name directly.',
      'random picks and shuffles; datetime handles dates, differences and adding days.',
      'statistics and collections.Counter help with averages and counting.',
      'Your own .py files are modules. if __name__ == "__main__": runs only when the file is run directly.'
    ],
    projectStep: {
      title: 'Expense Tracker: bills with due dates',
      steps: [
        'Make a list of bills with name, amount and a due date as "YYYY-MM-DD" text.',
        'Use datetime to print how many days are left for each bill.',
        'Print the bills sorted by due date.',
        'Use Counter to find your most common expense category.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 16,
    title: 'Working With Files',
    goal: 'You can write text to a file, add to it, read it back line by line, and turn each line into data.',
    minutes: 30,
    recap: 'Yesterday you imported modules like math, random and datetime, and learned how your own files become modules.',
    parts: [
      {
        title: 'Why programs need files',
        say: [
          'Every program you have written so far forgets everything when it stops. Your expenses exist only while the code runs. Run it again, and you start from nothing. Real apps need to remember, and the simplest way to remember is to save data in a file.',
          'A file is a named piece of storage on a disk. Text files hold plain text, like a .txt or .csv file. Python can create them, write to them and read them back.',
          'You open a file with open(name, mode). The mode says what you want to do: "w" to write (it creates the file, or empties it if it exists), "a" to append (add to the end), and "r" to read.',
          'In the lesson editor, files live in the browser\'s memory for the current page, so you can practise safely. On your laptop, from Day 20, they will be real files in your project folder that stay there after the program ends.'
        ],
        example: 'A file is like a notebook in your bag. What you work out in your head is forgotten tomorrow. What you write in the notebook is still there next week. Saving to a file is writing it down.',
        code: lines(
          'with open("notes.txt", "w") as f:',
          '    f.write("Tea,20\\n")',
          '    f.write("Bus,45\\n")',
          'with open("notes.txt", "r") as f:',
          '    content = f.read()',
          'print(content)'
        ),
        output: lines('Tea,20', 'Bus,45', ''),
        codeNotes: [
          { line: 1, note: '"w" opens the file for writing. It is created if it does not exist.' },
          { line: 2, note: 'write does not add a new line by itself, so we add \\n at the end.' },
          { line: 5, note: 'read() gives the whole file as one string.' }
        ],
        tryIt: 'Add a third line f.write("Lunch,120\\n") in the first block and run it again. Notice the empty line at the end of the output: it comes from the last \\n plus the one print adds.',
        check: {
          question: 'What does the mode "w" do when the file already exists?',
          options: ['Empties it and writes from the start', 'Adds to the end', 'Gives an error'],
          answer: 0,
          why: '"w" means write from scratch: an existing file is emptied first. Use "a" to add to the end instead.'
        }
      },
      {
        title: 'The with statement',
        say: [
          'An open file must be closed when you are done, so the data is really saved and the computer can let go of it. Forgetting to close files causes lost data and strange bugs.',
          'The with statement closes the file for you. with open(...) as f: opens the file and names it f. The indented lines use f. As soon as the indented block ends, even if an error happened, Python closes the file automatically.',
          'This is why you will almost always see files opened with with. It is shorter and safer than calling f.close() yourself, and it works like the finally block you learned on Day 14.',
          'Inside the block, f is a file object with methods: write() to write text, read() to read everything, and readlines() or a for loop to read line by line.'
        ],
        example: 'with is like a library that automatically takes back a book when you leave the reading room. You cannot forget to return it, because returning happens by itself when you walk out.',
        code: lines(
          'with open("log.txt", "w") as f:',
          '    f.write("started\\n")',
          '    print("Inside: closed?", f.closed)',
          'print("After: closed?", f.closed)'
        ),
        output: lines('Inside: closed? False', 'After: closed? True'),
        codeNotes: [
          { line: 3, note: 'Inside the block, the file is open.' },
          { line: 4, note: 'After the block, Python has closed it for us.' }
        ],
        tryIt: 'Try writing after the block: add f.write("more") at the end, not indented. Read the error: you cannot write to a closed file.',
        check: {
          question: 'What does with open(...) as f: do for you?',
          options: ['Closes the file automatically when the block ends', 'Makes the file read-only', 'Deletes the file afterwards'],
          answer: 0,
          why: 'The with block guarantees the file is closed at the end, even if an error happens inside.'
        }
      },
      {
        title: 'Appending and reading line by line',
        say: [
          'To add new data without losing the old data, open the file with "a" for append. Each write goes to the end of the file. This is what you want when a user adds a new expense.',
          'To read a file line by line, loop over the file object: for line in f:. Each line includes its newline character at the end, so you usually call line.strip() to clean it.',
          'Reading line by line is also better for very big files, because Python does not need to load the whole file into memory at once.',
          'If you try to read a file that does not exist, Python raises FileNotFoundError. You can catch it with try and except, and start with empty data instead, which is exactly what a new app should do on its first run.'
        ],
        example: 'A diary: each day you add a new entry at the end (append), you never tear out the old pages. When you read it later, you go one entry at a time.',
        code: lines(
          'with open("expenses.txt", "w") as f:',
          '    f.write("Tea,20\\n")',
          'with open("expenses.txt", "a") as f:',
          '    f.write("Bus,45\\n")',
          '    f.write("Lunch,120\\n")',
          'with open("expenses.txt") as f:',
          '    for line in f:',
          '        print("Line:", line.strip())',
          'try:',
          '    open("missing.txt")',
          'except FileNotFoundError:',
          '    print("No file yet, starting fresh")'
        ),
        output: lines('Line: Tea,20', 'Line: Bus,45', 'Line: Lunch,120', 'No file yet, starting fresh'),
        codeNotes: [
          { line: 3, note: '"a" adds to the end. Tea is kept.' },
          { line: 6, note: 'No mode means "r": read.' },
          { line: 8, note: 'strip() removes the newline at the end of each line.' },
          { line: 11, note: 'A missing file is expected on the first run, so handle it.' }
        ],
        tryIt: 'Change "a" on line 3 to "w" and run it. Now Tea is gone, because "w" empties the file first. Change it back.',
        check: {
          question: 'Which mode adds new lines to the end of an existing file?',
          options: ['"a"', '"w"', '"r"'],
          answer: 0,
          why: '"a" means append: keep what is there and add at the end. "w" would empty the file first.'
        }
      },
      {
        title: 'Turning lines into data with split',
        say: [
          'A line like "Tea,20" is just text. To use it, you split it into parts. "Tea,20".split(",") gives the list ["Tea", "20"]. split cuts the text wherever it finds the separator.',
          'Then you unpack and convert: item, amount = line.split(","), and int(amount) to get a number. Remember that everything read from a file is text, just like on Day 2.',
          'This simple format, values separated by commas, is called CSV, short for comma-separated values. Excel and Google Sheets can open CSV files directly, which makes them a popular way to export data.',
          'Real CSV files can have commas inside values, like "Lunch, with team". For those, Python has a csv module that handles the tricky cases. For our simple tracker, split(",") is enough, as long as item names have no commas.'
        ],
        example: 'split is like cutting a paper strip at each fold line. "Tea,20" cut at the comma gives two pieces: the item and the price. You then read each piece separately.',
        code: lines(
          'line = "Tea,20\\n"',
          'parts = line.strip().split(",")',
          'print(parts)',
          'item, amount = parts',
          'print(item, int(amount) + 5)',
          'print("a b  c".split())',
          'print("2026-09-28".split("-"))'
        ),
        output: lines("['Tea', '20']", 'Tea 25', "['a', 'b', 'c']", "['2026', '09', '28']"),
        codeNotes: [
          { line: 2, note: 'Clean the newline first, then cut at each comma.' },
          { line: 5, note: 'The amount is text until int() converts it.' },
          { line: 6, note: 'split() with no separator splits on any spaces.' }
        ],
        tryIt: 'Split "Asha,Ravi,Priya" by commas and print how many names there are with len(). It should be 3.',
        check: {
          question: 'What does "10,20,30".split(",") give?',
          options: ["['10', '20', '30']", '[10, 20, 30]', "'102030'"],
          answer: 0,
          why: 'split gives a list of strings. The numbers are still text until you convert them with int().'
        }
      },
      {
        title: 'Saving and loading a list of records',
        say: [
          'Now let us save the Expense Tracker\'s data properly. We write two functions: save_expenses writes each expense as one line, and load_expenses reads the lines back into a list of dictionaries.',
          'This pattern, save and load functions that turn data into text and back, is the basis of every app that remembers things. Later, databases do the same job at a much bigger scale.',
          'Look at load_expenses: it handles the missing-file case by returning an empty list, and it skips blank lines. Small details like these make a program reliable.',
          'The round trip test at the end is important: save some data, load it back, and check that you got the same data. Tomorrow you will see that JSON makes this even easier, especially for records with many fields.'
        ],
        example: 'Packing for a trip and unpacking at the hotel: you fold each item into the suitcase in a known way, and unfold it the same way at the other end. Saving and loading must match exactly, or something comes out wrong.',
        code: lines(
          'def save_expenses(expenses, filename):',
          '    with open(filename, "w") as f:',
          '        for e in expenses:',
          '            f.write(f"{e[\'item\']},{e[\'amount\']}\\n")',
          '',
          'def load_expenses(filename):',
          '    try:',
          '        with open(filename) as f:',
          '            lines = [line.strip() for line in f if line.strip()]',
          '    except FileNotFoundError:',
          '        return []',
          '    result = []',
          '    for line in lines:',
          '        item, amount = line.split(",")',
          '        result.append({"item": item, "amount": int(amount)})',
          '    return result',
          '',
          'data = [{"item": "Tea", "amount": 20}, {"item": "Rent", "amount": 8000}]',
          'save_expenses(data, "tracker.csv")',
          'loaded = load_expenses("tracker.csv")',
          'print(loaded)',
          'print(loaded == data)',
          'print(load_expenses("nothing.csv"))'
        ),
        output: lines("[{'item': 'Tea', 'amount': 20}, {'item': 'Rent', 'amount': 8000}]", 'True', '[]'),
        codeNotes: [
          { line: 4, note: 'One expense per line: item, comma, amount.' },
          { line: 9, note: 'Keep only non-empty lines, already stripped.' },
          { line: 15, note: 'Convert the amount back to a number.' },
          { line: 22, note: 'The round trip test: what we loaded equals what we saved.' }
        ],
        tryIt: 'Add a third expense to data and run it again. The loaded list grows and the round trip test is still True.',
        check: {
          question: 'Why does load_expenses return [] when the file is missing?',
          options: ['On the first run there is no file yet, and an empty list is the right starting data', 'Because files cannot be read in Python', 'To hide all errors'],
          answer: 0,
          why: 'A missing file is expected before anything has been saved. Starting with no expenses is the sensible behaviour.'
        }
      },
      {
        title: 'Putting it together: a tracker that remembers',
        say: [
          'Let us simulate two runs of the Expense Tracker. In the first run, we start with nothing, add two expenses and save. In the second run, we load what was saved, add one more, save again, and print the total.',
          'This is the core loop of every app that stores data: load, change, save. Your phone\'s notes app, a to-do app, and the Expense Tracker all do this.',
          'Right now the data is in a simple CSV format. It works, but it only fits simple records, and every new field means changing both the save and the load code. Tomorrow JSON solves this.',
          'In today\'s practice you will write parse_line, which turns "Tea,20" into a tuple, and to_line, which does the opposite. Together they are the heart of saving and loading.'
        ],
        example: 'A shop\'s account book: each morning the owner opens the book (load), writes the day\'s sales (change), and puts it back on the shelf (save). The next morning, yesterday\'s entries are still there.',
        code: lines(
          'FILE = "my_expenses.csv"',
          'open(FILE, "w").close()  # start with an empty file on every Run',
          '',
          'def load():',
          '    try:',
          '        with open(FILE) as f:',
          '            return [(i, int(a)) for i, a in (line.strip().split(",") for line in f if line.strip())]',
          '    except FileNotFoundError:',
          '        return []',
          '',
          'def save(expenses):',
          '    with open(FILE, "w") as f:',
          '        for item, amount in expenses:',
          '            f.write(f"{item},{amount}\\n")',
          '',
          '# First run',
          'expenses = load()',
          'expenses.append(("Tea", 20))',
          'expenses.append(("Bus", 45))',
          'save(expenses)',
          '# Second run: start again from the file',
          'expenses = load()',
          'print("Loaded:", expenses)',
          'expenses.append(("Lunch", 120))',
          'save(expenses)',
          'print("Total:", sum(a for _, a in load()))'
        ),
        output: lines("Loaded: [('Tea', 20), ('Bus', 45)]", 'Total: 185'),
        codeNotes: [
          { line: 1, note: 'A constant in capitals: the file name used everywhere.' },
          { line: 2, note: 'An empty file, so pressing Run twice gives the same result.' },
          { line: 7, note: 'Read, clean, split and convert each line into an (item, amount) tuple.' },
          { line: 22, note: 'The second run starts only from what was saved.' }
        ],
        tryIt: 'Line 7 is dense. Rewrite load() with a normal for loop, like load_expenses in the last part, and check the output is the same.',
        check: {
          question: 'What is the basic cycle of an app that remembers data?',
          options: ['Load, change, save', 'Save, delete, print', 'Print, load, exit'],
          answer: 0,
          why: 'The app loads what was saved, changes it as the user works, and saves it again for next time.'
        }
      }
    ],
    summary: [
      'open(name, mode): "w" writes from scratch, "a" appends, "r" reads.',
      'Use with open(...) as f: so the file is always closed.',
      'Loop over a file to read line by line, and strip() each line.',
      'split(",") turns "Tea,20" into ["Tea", "20"]. Convert numbers with int().',
      'Handle FileNotFoundError on the first run by starting with empty data.'
    ],
    projectStep: {
      title: 'Expense Tracker: save to a file',
      steps: [
        'Write save_expenses(expenses, filename) that writes one line per expense.',
        'Write load_expenses(filename) that returns a list of dictionaries, or [] if the file is missing.',
        'Check the round trip: saving then loading gives the same data.',
        'Simulate two runs: add expenses, save, load again and print the total.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 17,
    title: 'JSON: Saving Structured Data',
    goal: 'You can turn Python lists and dictionaries into JSON text and back, save them to files, and handle broken data safely.',
    minutes: 30,
    recap: 'Yesterday you wrote and read text files, split lines like "Tea,20", and built save and load functions.',
    parts: [
      {
        title: 'What JSON is',
        say: [
          'JSON stands for JavaScript Object Notation. Despite the name, it is not only for JavaScript. It is a simple text format for data that almost every language, app and web service understands.',
          'JSON looks very much like Python. A JSON object looks like a Python dictionary: {"item": "Tea", "amount": 20}. A JSON array looks like a Python list: [1, 2, 3]. Text is in double quotes, and numbers, true, false and null are written plainly.',
          'Why does this matter? When your phone app talks to a server, the data travels as JSON. When you call a weather or payments API, the answer is JSON. When apps save settings, it is often JSON. It is the common language of data.',
          'A few small differences from Python: JSON always uses double quotes for text, true and false are lower-case, and null means what Python calls None.'
        ],
        example: 'JSON is like English at an international airport: the pilots and control towers may speak different languages at home, but they all agree to use one common language to talk to each other. Apps written in different languages agree to exchange data as JSON.',
        code: lines(
          'import json',
          'expense = {"item": "Tea", "amount": 20, "paid": True, "note": None}',
          'text = json.dumps(expense)',
          'print(text)',
          'print(type(text))'
        ),
        output: lines('{"item": "Tea", "amount": 20, "paid": true, "note": null}', "<class 'str'>"),
        codeNotes: [
          { line: 3, note: 'dumps turns Python data into JSON text. Think "dump to string".' },
          { line: 4, note: 'Notice: double quotes, lower-case true, and null instead of None.' },
          { line: 5, note: 'The result is plain text, ready to save or send.' }
        ],
        tryIt: 'Add a list to the dictionary, like "tags": ["daily", "office"], and run it. JSON shows it as an array in square brackets.',
        check: {
          question: 'How does JSON write Python\'s None?',
          options: ['null', 'None', 'nil'],
          answer: 0,
          why: 'JSON uses null for "no value". json.dumps converts None to null, and json.loads converts it back.'
        }
      },
      {
        title: 'loads: from JSON text back to Python',
        say: [
          'json.loads does the opposite of dumps. It takes JSON text and gives back Python data: dictionaries, lists, strings, numbers, True, False and None. Think "load from string".',
          'After loads, the data is normal Python. You can read keys, loop, filter and total, exactly as you learned in Week 2.',
          'This is how you will read API answers on Day 26: the answer arrives as JSON text, you load it, and then you work with ordinary lists and dictionaries.',
          'dumps and loads together give you a perfect round trip for this kind of data: dumps then loads gives you back what you started with.'
        ],
        example: 'A courier packs your items into a box to send (dumps), and the receiver unpacks the box to use them (loads). The items arrive the same as they were packed.',
        code: lines(
          'import json',
          'text = \'[{"item": "Tea", "amount": 20}, {"item": "Bus", "amount": 45}]\'',
          'expenses = json.loads(text)',
          'print(type(expenses))',
          'print(expenses[1]["item"])',
          'print(sum(e["amount"] for e in expenses))',
          'print(json.loads(json.dumps(expenses)) == expenses)'
        ),
        output: lines("<class 'list'>", 'Bus', '65', 'True'),
        codeNotes: [
          { line: 2, note: 'JSON text inside single quotes, so the double quotes can be part of the text.' },
          { line: 3, note: 'loads gives back a real Python list of dictionaries.' },
          { line: 7, note: 'The round trip gives back exactly the same data.' }
        ],
        tryIt: 'Add a third expense inside the JSON text and check the total changes. Be careful with the commas and quotes; JSON is strict.',
        check: {
          question: 'What type does json.loads(\'{"a": 1}\') return?',
          options: ['dict', 'str', 'list'],
          answer: 0,
          why: 'A JSON object becomes a Python dictionary.'
        }
      },
      {
        title: 'Saving and loading JSON files',
        say: [
          'To save data to a file as JSON, use json.dump (without the s) with an open file: json.dump(data, f). To load from a file, use json.load(f). The versions without s work with files; the ones with s work with strings.',
          'Add indent=2 to make the file easy for humans to read: each key on its own line, nicely indented. This is very helpful when you open the file to check what your program saved.',
          'Compare this with yesterday\'s CSV code. There is no splitting, no converting numbers, no worrying about which field comes first. Every field of every record is saved and loaded automatically. Adding a new field, like a date, needs no code changes at all.',
          'This is why most small apps and tools save their data as JSON files.'
        ],
        example: 'Yesterday\'s CSV was like writing a shopping list in a fixed column order that only you understand. JSON is like a labelled form: anyone, including another program, can read it and know exactly what each value means.',
        code: lines(
          'import json',
          'expenses = [',
          '    {"item": "Tea", "amount": 20, "category": "food"},',
          '    {"item": "Bus", "amount": 45, "category": "travel"},',
          ']',
          'with open("expenses.json", "w") as f:',
          '    json.dump(expenses, f, indent=2)',
          'with open("expenses.json") as f:',
          '    print("\\n".join(f.read().splitlines()[:5]))',
          'with open("expenses.json") as f:',
          '    loaded = json.load(f)',
          'print(loaded == expenses)'
        ),
        output: lines('[', '  {', '    "item": "Tea",', '    "amount": 20,', '    "category": "food"', 'True'),
        codeNotes: [
          { line: 7, note: 'dump writes JSON into the open file. indent=2 makes it readable.' },
          { line: 9, note: 'Print the first 5 lines of the file so you can see its layout.' },
          { line: 11, note: 'load reads the file and gives back the list of dictionaries.' }
        ],
        tryIt: 'Remove indent=2 and run it again. The file is now one long line. Both versions load the same data.',
        check: {
          question: 'What is the difference between json.dump and json.dumps?',
          options: ['dump writes to a file; dumps returns a string', 'dump is for lists; dumps is for dictionaries', 'There is no difference'],
          answer: 0,
          why: 'The s stands for string. dumps gives you JSON text; dump writes it straight into an open file.'
        }
      },
      {
        title: 'Handling broken or unexpected data',
        say: [
          'Data from files and the internet is not always correct. A file might be half-written after a crash, empty, or edited by hand with a mistake. json.loads on broken text raises a json.JSONDecodeError, which is a kind of ValueError.',
          'A reliable program catches that error and falls back to safe data, like an empty list, instead of crashing. You learned this pattern on Day 14; here is a real use for it.',
          'Even valid JSON can have the wrong shape. You expected a list of expenses, but the file contains a single dictionary or a number. Check the type with isinstance(data, list) before using it.',
          'Validating data at the edges of your program, where it comes in from files, users or APIs, is one of the habits that separate professional code from beginner code.'
        ],
        example: 'A pharmacist checks every prescription before handing out medicine: is it readable, is it complete, is it the right kind of document? If not, they do not guess; they ask for a correct one. Your program should check data the same way before trusting it.',
        code: lines(
          'import json',
          '',
          'def load_list(text):',
          '    try:',
          '        data = json.loads(text)',
          '    except ValueError:',
          '        return []',
          '    return data if isinstance(data, list) else []',
          '',
          'print(load_list(\'[{"item": "Tea"}]\'))',
          'print(load_list("[{broken"))',
          'print(load_list(""))',
          'print(load_list(\'{"item": "Tea"}\'))'
        ),
        output: lines("[{'item': 'Tea'}]", '[]', '[]', '[]'),
        codeNotes: [
          { line: 6, note: 'JSONDecodeError is a kind of ValueError, so this catches broken text.' },
          { line: 8, note: 'Valid JSON, but only accept it if it is a list.' },
          { line: 13, note: 'A dictionary, not a list: rejected safely.' }
        ],
        tryIt: 'Call json.loads("[{broken") directly, without the function, and read the error message. It tells you the exact position of the problem.',
        check: {
          question: 'Why check isinstance(data, list) after json.loads?',
          options: ['Valid JSON can still have the wrong shape for your program', 'json.loads always returns a string', 'isinstance makes loading faster'],
          answer: 0,
          why: 'json.loads succeeds for any valid JSON, like a dictionary or a number. Your code expects a list, so it checks before using it.'
        }
      },
      {
        title: 'Dates and other values JSON cannot store',
        say: [
          'JSON only knows a few types: objects, arrays, strings, numbers, true, false and null. Python has more, like dates, sets and tuples. What happens to them?',
          'Tuples become JSON arrays, so they come back as lists. Sets and dates cannot be saved at all: json.dumps raises a TypeError saying the object is not JSON serializable.',
          'The simple fix is to convert them to something JSON understands before saving. For dates, store the text form, date.isoformat(), which gives "2026-09-28", and turn it back with date.fromisoformat() after loading. For sets, save sorted(list(the_set)).',
          'This is exactly why the expenses in this course store dates as "YYYY-MM-DD" text: it saves to JSON easily, sorts correctly, and converts to a real date when needed.'
        ],
        example: 'Some things cannot go through the post as they are, like a cake. You send the recipe instead, and the receiver bakes it again. Saving a date as text and turning it back into a date is sending the recipe.',
        code: lines(
          'import json',
          'from datetime import date',
          'today = date(2026, 9, 28)',
          'try:',
          '    json.dumps({"date": today})',
          'except TypeError as error:',
          '    print("Error:", error)',
          'text = json.dumps({"date": today.isoformat(), "point": (1, 2)})',
          'print(text)',
          'back = json.loads(text)',
          'print(date.fromisoformat(back["date"]).year, back["point"])'
        ),
        output: lines('Error: Object of type date is not JSON serializable', '{"date": "2026-09-28", "point": [1, 2]}', '2026 [1, 2]'),
        codeNotes: [
          { line: 5, note: 'A date object cannot be turned into JSON directly.' },
          { line: 8, note: 'Save the date as text. The tuple becomes a JSON array.' },
          { line: 11, note: 'Turn the text back into a real date. The tuple came back as a list.' }
        ],
        tryIt: 'Try json.dumps({"tags": {"food", "daily"}}) and read the error. Then fix it with sorted(...) around the set.',
        check: {
          question: 'How should you store a date in JSON?',
          options: ['As text like "2026-09-28", using isoformat()', 'As a Python date object', 'Dates cannot be stored at all'],
          answer: 0,
          why: 'JSON has no date type, so store the date as text and convert it back with date.fromisoformat() when loading.'
        }
      },
      {
        title: 'Putting it together: a JSON-backed tracker',
        say: [
          'Let us replace yesterday\'s CSV storage in the Expense Tracker with JSON. The save function is now two lines, and the load function handles a missing file, broken JSON and the wrong shape.',
          'The records can have any fields: item, amount, category, date. Adding a new field later, like a payment method, needs no change to save or load.',
          'This is the storage layer you will use in the Week 4 project, and on Day 27 your FastAPI web API will send and receive this same JSON.',
          'In today\'s practice you will write to_json, which uses json.dumps, and load_expenses, which safely returns [] for broken, empty or non-list text.'
        ],
        example: 'Upgrading from a paper notebook with columns to a proper labelled filing system: every record keeps all its details, anyone can read it, and adding a new detail does not mean redrawing every page.',
        code: lines(
          'import json',
          'FILE = "tracker.json"',
          'open(FILE, "w").close()  # start with an empty file on every Run',
          '',
          'def save(expenses):',
          '    with open(FILE, "w") as f:',
          '        json.dump(expenses, f, indent=2)',
          '',
          'def load():',
          '    try:',
          '        with open(FILE) as f:',
          '            data = json.load(f)',
          '    except (FileNotFoundError, ValueError):',
          '        return []',
          '    return data if isinstance(data, list) else []',
          '',
          'expenses = load()',
          'expenses.append({"item": "Tea", "amount": 20, "category": "food", "date": "2026-09-28"})',
          'save(expenses)',
          'expenses = load()',
          'expenses.append({"item": "Metro", "amount": 30, "category": "travel", "date": "2026-09-28", "paid_by": "UPI"})',
          'save(expenses)',
          'final = load()',
          'print(len(final), "expenses")',
          'print(final[-1]["paid_by"])',
          'print(sum(e["amount"] for e in final))'
        ),
        output: lines('2 expenses', 'UPI', '50'),
        codeNotes: [
          { line: 13, note: 'Catch a missing file and broken JSON in one line. An empty file is broken JSON, so load() starts with [].' },
          { line: 21, note: 'A new field, paid_by, with no change to save or load.' }
        ],
        tryIt: 'Write the text "oops" into tracker.json with a normal open and write, just before the line expenses = load(), then run it. load() safely returns [] and the program still works.',
        check: {
          question: 'What happens in this tracker if you add a new field to an expense?',
          options: ['It is saved and loaded automatically, with no code changes', 'save() must be rewritten', 'JSON cannot store new fields'],
          answer: 0,
          why: 'json.dump and json.load save every key of every dictionary, so new fields just work.'
        }
      }
    ],
    summary: [
      'JSON is the common text format for data between apps and APIs.',
      'json.dumps(data) gives JSON text; json.loads(text) gives Python data.',
      'json.dump(data, f, indent=2) and json.load(f) work with open files.',
      'Catch ValueError for broken JSON and check the shape with isinstance.',
      'Dates and sets are not JSON: store dates as "YYYY-MM-DD" text.'
    ],
    projectStep: {
      title: 'Expense Tracker: JSON storage',
      steps: [
        'Write save(expenses) with json.dump and indent=2.',
        'Write load() that returns [] for a missing file, broken JSON or a non-list.',
        'Store each expense with item, amount, category and a date as text.',
        'Add an expense, save, load again and print the total.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 18,
    title: 'Classes and Objects',
    goal: 'You can write a class with __init__, attributes and methods, and create objects from it.',
    minutes: 30,
    recap: 'Yesterday you saved and loaded data as JSON and handled broken data safely.',
    parts: [
      {
        title: 'What classes and objects are',
        say: [
          'So far, data and the functions that work on it have been separate: an expense dictionary here, a describe function there. A class lets you keep data and its actions together in one place.',
          'A class is a blueprint. It describes what information something has and what it can do. An object is one real thing made from that blueprint. From one Expense class, you can make many Expense objects: tea, bus, lunch.',
          'You already use objects every day in Python. Every string is an object of the str class; that is why "tea".upper() works. upper is an action that belongs to strings. Lists, dictionaries and dates are objects too.',
          'Most large Python programs and libraries are built from classes. FastAPI, which you will use on Day 27, uses classes to describe the data an API accepts. So understanding classes is important for the job, not just for exams.'
        ],
        example: 'An architect draws one blueprint for a house. From it, the builder can build many houses on different streets. Each house is real and separate: one has blue walls, one has red, but they all follow the same plan. The blueprint is the class; each house is an object.',
        code: lines(
          'class Expense:',
          '    pass',
          '',
          'tea = Expense()',
          'bus = Expense()',
          'print(type(tea).__name__)',
          'print(tea is bus)',
          'print(type("hello").__name__, type([1, 2]).__name__)'
        ),
        output: lines('Expense', 'False', 'str list'),
        codeNotes: [
          { line: 1, note: 'class and a name starting with a capital letter. pass means "nothing yet".' },
          { line: 4, note: 'Calling the class like a function creates a new object.' },
          { line: 7, note: 'Two separate objects from the same class.' }
        ],
        tryIt: 'Print type(3.5).__name__ and type({}).__name__. Numbers and dictionaries are objects of classes too: float and dict.',
        check: {
          question: 'What is the relationship between a class and an object?',
          options: ['A class is a blueprint; an object is one thing made from it', 'They are the same thing', 'An object is a blueprint for classes'],
          answer: 0,
          why: 'The class describes what things of that kind have and can do. Each object is one real instance built from it.'
        }
      },
      {
        title: '__init__ and self: giving objects their data',
        say: [
          'An empty object is not very useful. You want each expense to have its own item and amount. For that, a class has a special method called __init__, with two underscores on each side. Python runs it automatically every time you create a new object.',
          'The first parameter of every method is self. self means "this particular object". Inside __init__, self.item = item stores the item on this object. Values stored like this are called attributes.',
          'When you write Expense("Tea", 20), Python creates a new object, then calls __init__ with self as the new object, item as "Tea" and amount as 20. You never pass self yourself; Python does it.',
          'After that, tea.item gives "Tea". Each object has its own attributes, so tea.amount and bus.amount can be different.'
        ],
        example: 'When a baby is born, the hospital fills in a birth certificate: name, date, weight. __init__ is filling in that certificate for each new object. self is "this baby", so the details go on the right certificate.',
        code: lines(
          'class Expense:',
          '    def __init__(self, item, amount):',
          '        self.item = item',
          '        self.amount = amount',
          '',
          'tea = Expense("Tea", 20)',
          'bus = Expense("Bus", 45)',
          'print(tea.item, tea.amount)',
          'print(bus.item, bus.amount)',
          'tea.amount = 25',
          'print(tea.amount, bus.amount)'
        ),
        output: lines('Tea 20', 'Bus 45', '25 45'),
        codeNotes: [
          { line: 2, note: '__init__ runs automatically for every new object.' },
          { line: 3, note: 'Store the value on this object as an attribute.' },
          { line: 10, note: 'Changing one object\'s attribute does not affect the other.' }
        ],
        tryIt: 'Add a third parameter category to __init__, store it as self.category, and pass "food" when creating tea. Remember to pass a category for bus too.',
        check: {
          question: 'Inside a method, what does self refer to?',
          options: ['The particular object the method is working on', 'The class itself', 'The first argument you pass'],
          answer: 0,
          why: 'self is the object itself. Python passes it automatically, which is why Expense("Tea", 20) has only two arguments.'
        }
      },
      {
        title: 'Methods: actions that belong to an object',
        say: [
          'A method is a function defined inside a class. It always takes self first, so it can use the object\'s attributes. You call it with a dot: tea.label().',
          'Methods keep the actions next to the data they use. Instead of a separate describe(expense) function, the expense knows how to describe itself. Anyone reading the class sees everything an Expense can do in one place.',
          'Methods can take extra parameters after self, and they can return values, exactly like normal functions. They can also change the object\'s attributes.',
          'A common beginner mistake is forgetting self in the def line, like def label():. Python then complains that the method got one more argument than expected, because it always passes the object as self.'
        ],
        example: 'A TV remote is an object with actions built in: power, volume up, change channel. You do not need a separate machine to change the channel; you press a button on the remote itself. Methods are the buttons on your object.',
        code: lines(
          'class Expense:',
          '    def __init__(self, item, amount):',
          '        self.item = item',
          '        self.amount = amount',
          '',
          '    def label(self):',
          '        return f"{self.item}: {self.amount}"',
          '',
          '    def with_gst(self, rate=0.18):',
          '        return round(self.amount * (1 + rate), 2)',
          '',
          'lunch = Expense("Lunch", 120)',
          'print(lunch.label())',
          'print(lunch.with_gst())',
          'print(lunch.with_gst(0.05))'
        ),
        output: lines('Lunch: 120', '141.6', '126.0'),
        codeNotes: [
          { line: 6, note: 'A method: self first, then it can read self.item and self.amount.' },
          { line: 9, note: 'Methods can have extra parameters and defaults.' },
          { line: 13, note: 'Call a method with a dot and brackets.' }
        ],
        tryIt: 'Add a method is_big(self) that returns True when self.amount is over 1000. Test it on lunch (False) and on Expense("Rent", 8000) (True).',
        check: {
          question: 'What is the first parameter of every normal method?',
          options: ['self', 'this', 'the class name'],
          answer: 0,
          why: 'Python passes the object as the first argument, and by convention it is always named self.'
        }
      },
      {
        title: 'Methods that change the object',
        say: [
          'Objects can hold state: information that changes over time. A wallet has a balance that goes down when you spend. A method can change an attribute, like self.balance = self.balance - amount.',
          'This is where classes really help. The rule "you cannot spend more than you have" lives inside the spend method. Every part of the program that spends money goes through that one method, so the rule is always followed.',
          'A method that changes the object can also return a value to say whether it worked, like True for success and False for "not enough money". That lets the caller react.',
          'Keeping rules inside the class, next to the data, is called encapsulation. It means the object protects its own data from being put into a bad state.'
        ],
        example: 'A metro card machine will not let you travel if your balance is too low. The rule lives in the machine, not in each passenger\'s head. A spend method on a Wallet class is that machine.',
        code: lines(
          'class Wallet:',
          '    def __init__(self, balance):',
          '        self.balance = balance',
          '',
          '    def spend(self, amount):',
          '        if amount > self.balance:',
          '            return False',
          '        self.balance -= amount',
          '        return True',
          '',
          '    def add(self, amount):',
          '        self.balance += amount',
          '',
          'w = Wallet(100)',
          'print(w.spend(30), w.balance)',
          'print(w.spend(500), w.balance)',
          'w.add(1000)',
          'print(w.spend(500), w.balance)'
        ),
        output: lines('True 70', 'False 70', 'True 570'),
        codeNotes: [
          { line: 6, note: 'The rule: never spend more than the balance.' },
          { line: 8, note: 'Change this wallet\'s balance.' },
          { line: 16, note: 'Not enough money: nothing changes, and False tells the caller.' }
        ],
        tryIt: 'Add a history list in __init__ (self.history = []) and append the amount in spend when it succeeds. Print w.history at the end: [30, 500].',
        check: {
          question: 'Why put the "not enough money" check inside spend()?',
          options: ['So every spend in the program follows the rule automatically', 'Because if statements only work in classes', 'To make spend faster'],
          answer: 0,
          why: 'All spending goes through that one method, so the rule can never be skipped by accident.'
        }
      },
      {
        title: 'Many objects in a list',
        say: [
          'Objects work perfectly with everything you already know. You can keep many objects in a list, loop over them, filter them with comprehensions, and sort them with a key.',
          'The only change is how you read values: e.amount with a dot instead of e["amount"] with brackets. Many developers find the dot version easier to read.',
          'Methods make loops cleaner too. Instead of building a label with an f-string in the loop, you call e.label(), and the class decides what a label looks like.',
          'When should you use a class instead of a dictionary? A dictionary is great for simple data, especially data that goes to and from JSON. A class is better when the data has rules and actions that belong to it. In real projects, you will see both.'
        ],
        example: 'A school has many student objects, each with a name and marks, and each able to say whether they passed. The principal loops over all of them to make the results list, calling "did you pass?" on each student.',
        code: lines(
          'class Expense:',
          '    def __init__(self, item, amount, category):',
          '        self.item = item',
          '        self.amount = amount',
          '        self.category = category',
          '',
          '    def label(self):',
          '        return f"{self.item} ({self.category}): {self.amount}"',
          '',
          'expenses = [Expense("Tea", 20, "food"), Expense("Rent", 8000, "home"), Expense("Lunch", 120, "food")]',
          'for e in sorted(expenses, key=lambda e: e.amount, reverse=True):',
          '    print(e.label())',
          'print(sum(e.amount for e in expenses if e.category == "food"))'
        ),
        output: lines('Rent (home): 8000', 'Lunch (food): 120', 'Tea (food): 20', '140'),
        codeNotes: [
          { line: 11, note: 'Sort objects by an attribute, biggest first.' },
          { line: 13, note: 'Filter and total with dots instead of square brackets.' }
        ],
        tryIt: 'Find the cheapest expense with min(expenses, key=lambda e: e.amount) and print its label. It should be Tea (food): 20.',
        check: {
          question: 'For an Expense object e, how do you read its amount?',
          options: ['e.amount', 'e["amount"]', 'e.amount()'],
          answer: 0,
          why: 'Attributes are read with a dot and no brackets. Square brackets are for dictionaries, and brackets after a name call a method.'
        }
      },
      {
        title: 'Putting it together: an ExpenseBook class',
        say: [
          'Let us wrap the Expense Tracker\'s main actions in a class. ExpenseBook holds a list of expenses and a budget, and has methods to add an expense, get the total, and check how much is left.',
          'The add method validates the amount, raising a ValueError for bad values, as you learned on Day 14. So an ExpenseBook can never contain a negative expense, whoever uses it.',
          'The rest of the program now just talks to the book: book.add(...), book.total(), book.left(). The details are hidden inside. This makes the program easier to change later, for example to save to JSON inside add.',
          'In today\'s practice you will write an Expense class with a label method, and a Wallet class with a spend method that refuses to spend more than the balance.'
        ],
        example: 'A bank passbook is an object: it holds your transactions and knows your balance. You do not calculate the balance yourself; the passbook does it. ExpenseBook is a passbook for your spending.',
        code: lines(
          'class ExpenseBook:',
          '    def __init__(self, budget):',
          '        self.budget = budget',
          '        self.expenses = []',
          '',
          '    def add(self, item, amount):',
          '        if amount <= 0:',
          '            raise ValueError("amount must be more than 0")',
          '        self.expenses.append({"item": item, "amount": amount})',
          '',
          '    def total(self):',
          '        return sum(e["amount"] for e in self.expenses)',
          '',
          '    def left(self):',
          '        return self.budget - self.total()',
          '',
          'book = ExpenseBook(5000)',
          'book.add("Tea", 20)',
          'book.add("Groceries", 1500)',
          'try:',
          '    book.add("Mistake", -10)',
          'except ValueError as error:',
          '    print("Refused:", error)',
          'print("Spent:", book.total())',
          'print("Left:", book.left())',
          'print(len(book.expenses), "expenses")'
        ),
        output: lines('Refused: amount must be more than 0', 'Spent: 1520', 'Left: 3480', '2 expenses'),
        codeNotes: [
          { line: 4, note: 'Each book starts with its own empty list.' },
          { line: 8, note: 'The rule lives in the class: no bad amounts, ever.' },
          { line: 15, note: 'A method can call another method with self.' }
        ],
        tryIt: 'Add a method by_category(self, category) that returns the expenses of one category. You will need to add a category parameter to add() first.',
        check: {
          question: 'Why does ExpenseBook.add raise a ValueError for negative amounts?',
          options: ['So the book can never contain bad data, whoever calls add', 'Because Python does not allow negative numbers', 'To stop the program every time'],
          answer: 0,
          why: 'Checking inside add means every expense passes the same rule. The caller can catch the error and show a message.'
        }
      }
    ],
    summary: [
      'A class is a blueprint; an object is one thing made from it: tea = Expense("Tea", 20).',
      '__init__ runs for every new object and stores attributes on self.',
      'Methods are functions inside the class. self is always the first parameter.',
      'Methods can change the object\'s state and keep its rules in one place.',
      'Read attributes with a dot: e.amount. Objects work in lists, loops and sorting.'
    ],
    projectStep: {
      title: 'Expense Tracker: an ExpenseBook class',
      steps: [
        'Write an ExpenseBook class with a budget and an empty list of expenses.',
        'Add an add(item, amount, category) method that rejects amounts of 0 or less.',
        'Add total() and left() methods.',
        'Create a book, add a few expenses and print the total and what is left.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 19,
    title: 'Better Classes: __str__ and Inheritance',
    goal: 'You can make objects print nicely, build new classes from existing ones with inheritance, and use super().',
    minutes: 30,
    recap: 'Yesterday you wrote classes with __init__, attributes and methods, and built an ExpenseBook.',
    parts: [
      {
        title: 'Making objects print nicely with __str__',
        say: [
          'If you print an object from yesterday\'s classes, you get something unhelpful, like <__main__.Expense object at 0x7f3a...>. The strange number is where the object lives in memory. It tells you nothing about the expense.',
          'You can choose what an object looks like when printed by adding a special method called __str__. It takes only self and must return a string. print(obj) and str(obj) both use it.',
          'Methods with double underscores on both sides, like __init__ and __str__, are called special methods, or dunder methods, short for double underscore. Python calls them automatically at the right moment. You rarely call them yourself.',
          'A good __str__ gives a short, human-friendly description. It makes debugging much easier, because printing an object tells you straight away what is inside.'
        ],
        example: 'A name badge at a conference. Without it, people see just "a person". With it, they immediately see "Priya, Developer, Pune". __str__ is the name badge for your objects.',
        code: lines(
          'class Plain:',
          '    def __init__(self, item):',
          '        self.item = item',
          '',
          'class Expense:',
          '    def __init__(self, item, amount):',
          '        self.item = item',
          '        self.amount = amount',
          '',
          '    def __str__(self):',
          '        return f"{self.item} (Rs {self.amount})"',
          '',
          'print(str(Plain("Tea")).startswith("<"))',
          'tea = Expense("Tea", 20)',
          'print(tea)',
          'print("Today: " + str(tea))'
        ),
        output: lines('True', 'Tea (Rs 20)', 'Today: Tea (Rs 20)'),
        codeNotes: [
          { line: 10, note: '__str__ returns the text to show when the object is printed.' },
          { line: 13, note: 'Without __str__, the text starts with < and a memory address.' },
          { line: 15, note: 'print uses __str__ automatically.' }
        ],
        tryIt: 'Add print(Plain("Tea")) and run it to see the unhelpful default. Then change the f-string in __str__ to show the amount with 2 decimals: {self.amount:.2f}.',
        check: {
          question: 'What does print(obj) use to decide what to show?',
          options: ['The object\'s __str__ method', 'The object\'s __init__ method', 'The class name only'],
          answer: 0,
          why: 'print calls str(obj), which uses __str__. Without it, Python shows a default text with a memory address.'
        }
      },
      {
        title: 'Inheritance: building on an existing class',
        say: [
          'Sometimes you need a class that is almost the same as an existing one, with a little extra. For example, a Subscription is an Expense that repeats every month. It has an item and an amount, plus a yearly cost.',
          'Instead of copying the Expense code, you write class Subscription(Expense):. The class in brackets is the parent. The new class, the child, automatically gets all the parent\'s attributes and methods.',
          'You then add only what is new. The child can use the parent\'s __init__ and __str__ without writing them again. This avoids duplicated code, which is a common source of bugs.',
          'isinstance(obj, Expense) is True for a Subscription too, because a subscription is a kind of expense. Code written for expenses works with subscriptions without changes.'
        ],
        example: 'A mobile phone model family: the base model has calling, messaging and a camera. The Pro model has everything the base model has, plus a better camera. The Pro is built on the base design; nobody designs calling again from scratch.',
        code: lines(
          'class Expense:',
          '    def __init__(self, item, amount):',
          '        self.item = item',
          '        self.amount = amount',
          '',
          '    def __str__(self):',
          '        return f"{self.item} (Rs {self.amount})"',
          '',
          'class Subscription(Expense):',
          '    def yearly_cost(self):',
          '        return self.amount * 12',
          '',
          'music = Subscription("Music app", 99)',
          'print(music)',
          'print(music.yearly_cost())',
          'print(isinstance(music, Expense))'
        ),
        output: lines('Music app (Rs 99)', '1188', 'True'),
        codeNotes: [
          { line: 9, note: 'Subscription inherits from Expense.' },
          { line: 13, note: 'Uses the parent\'s __init__: no need to write it again.' },
          { line: 14, note: 'Uses the parent\'s __str__ too.' }
        ],
        tryIt: 'Create a normal Expense("Tea", 20) and call yearly_cost() on it. Read the AttributeError: only subscriptions have that method.',
        check: {
          question: 'In class Subscription(Expense):, what does Subscription get from Expense?',
          options: ['All of Expense\'s attributes and methods', 'Nothing unless it copies the code', 'Only the __init__ method'],
          answer: 0,
          why: 'A child class inherits everything from its parent. It only needs to add or change what is different.'
        }
      },
      {
        title: 'Overriding methods',
        say: [
          'A child class can also replace a parent\'s method with its own version. This is called overriding. If Subscription defines its own __str__, Python uses that one for subscriptions, and the parent\'s one for normal expenses.',
          'Python looks for a method first in the object\'s own class, and then in the parent. The first one found is used.',
          'This lets different kinds of objects respond to the same method call in their own way. You can loop over a mixed list of expenses and subscriptions, call str() or a method on each, and each one does the right thing. This idea is called polymorphism.',
          'Overriding is powerful, but use it for real differences in behaviour. If you find yourself overriding almost everything, the child probably should not inherit from that parent at all.'
        ],
        example: 'Every vehicle at a toll booth is asked "pay the toll". A car pays the car rate, a truck pays the truck rate, and a bike pays the bike rate. The same request, but each type answers in its own way.',
        code: lines(
          'class Expense:',
          '    def __init__(self, item, amount):',
          '        self.item = item',
          '        self.amount = amount',
          '',
          '    def __str__(self):',
          '        return f"{self.item} (Rs {self.amount})"',
          '',
          '    def monthly_cost(self):',
          '        return 0',
          '',
          'class Subscription(Expense):',
          '    def __str__(self):',
          '        return f"{self.item} (Rs {self.amount} every month)"',
          '',
          '    def monthly_cost(self):',
          '        return self.amount',
          '',
          'items = [Expense("Tea", 20), Subscription("Gym", 900), Subscription("Music app", 99)]',
          'for thing in items:',
          '    print(thing)',
          'print("Fixed monthly cost:", sum(t.monthly_cost() for t in items))'
        ),
        output: lines('Tea (Rs 20)', 'Gym (Rs 900 every month)', 'Music app (Rs 99 every month)', 'Fixed monthly cost: 999'),
        codeNotes: [
          { line: 13, note: 'Subscription overrides __str__ with its own version.' },
          { line: 16, note: 'And overrides monthly_cost.' },
          { line: 22, note: 'One call works for both kinds; each answers in its own way.' }
        ],
        tryIt: 'Add a third class Refund(Expense) whose __str__ shows the amount with a minus sign, and add Refund("Shoes", 1200) to the list.',
        check: {
          question: 'If both Expense and Subscription define __str__, which one does a Subscription object use?',
          options: ['Subscription\'s own version', 'Expense\'s version', 'Both, one after the other'],
          answer: 0,
          why: 'Python looks in the object\'s own class first. The child\'s version overrides the parent\'s.'
        }
      },
      {
        title: 'super(): reusing the parent\'s work',
        say: [
          'Sometimes the child needs extra data. A Subscription might need a renewal day, as well as an item and amount. So it needs its own __init__. But you do not want to repeat the parent\'s lines that store item and amount.',
          'super() gives you the parent class, so you can call its version of a method. super().__init__(item, amount) runs the parent\'s __init__, which stores item and amount. Then the child adds its own attribute.',
          'The same works for other methods. A child\'s __str__ can call super().__str__() and add something to the end, instead of writing the whole text again.',
          'A common bug is forgetting to call super().__init__(). The child\'s own attributes are set, but the parent\'s are missing, and you get an AttributeError later when you use them.'
        ],
        example: 'A new branch of a bank follows all the head office rules, and adds one local rule of its own. It does not rewrite the whole rule book; it says "all head office rules apply, plus this one". super() is "all head office rules apply".',
        code: lines(
          'class Expense:',
          '    def __init__(self, item, amount):',
          '        self.item = item',
          '        self.amount = amount',
          '',
          '    def __str__(self):',
          '        return f"{self.item} (Rs {self.amount})"',
          '',
          'class Subscription(Expense):',
          '    def __init__(self, item, amount, renews_on):',
          '        super().__init__(item, amount)',
          '        self.renews_on = renews_on',
          '',
          '    def __str__(self):',
          '        return super().__str__() + f", renews on day {self.renews_on}"',
          '',
          'gym = Subscription("Gym", 900, 5)',
          'print(gym.item, gym.amount, gym.renews_on)',
          'print(gym)'
        ),
        output: lines('Gym 900 5', 'Gym (Rs 900), renews on day 5'),
        codeNotes: [
          { line: 11, note: 'Let the parent store item and amount.' },
          { line: 12, note: 'Then add the child\'s own attribute.' },
          { line: 15, note: 'Reuse the parent\'s text and add to it.' }
        ],
        tryIt: 'Delete line 11 (the super call) and run it. Read the AttributeError about item: the parent\'s setup never ran. Put the line back.',
        check: {
          question: 'What does super().__init__(item, amount) do in a child class?',
          options: ['Runs the parent\'s __init__ so the parent\'s attributes are set', 'Creates a second object', 'Deletes the parent class'],
          answer: 0,
          why: 'super() refers to the parent. Calling its __init__ sets up everything the parent normally sets up.'
        }
      },
      {
        title: 'When to use classes and inheritance',
        say: [
          'Classes are a tool, not a goal. For simple data, a dictionary is often enough, especially data that goes to and from JSON. Use a class when data has rules and actions that belong together, like the Wallet or ExpenseBook.',
          'Use inheritance when the child really is a kind of the parent: a Subscription is a kind of Expense. If the sentence "X is a kind of Y" sounds wrong, do not use inheritance.',
          'Keep inheritance shallow. One or two levels is normal. Long chains, where a class inherits from a class that inherits from another, become hard to follow.',
          'In real work, you will mostly use classes that libraries give you, and inherit from them. On Day 27, FastAPI will ask you to write class NewExpense(BaseModel): to describe incoming data. That is inheritance from a library class, and you now know exactly what it means.'
        ],
        example: 'You do not need a toolbox with twenty compartments to carry one pen. A simple pouch is fine. Classes are the toolbox: great when you have many related tools and rules, unnecessary for a single simple value.',
        code: lines(
          'class Shape:',
          '    def area(self):',
          '        return 0',
          '',
          'class Rectangle(Shape):',
          '    def __init__(self, w, h):',
          '        self.w, self.h = w, h',
          '    def area(self):',
          '        return self.w * self.h',
          '',
          'class Square(Rectangle):',
          '    def __init__(self, side):',
          '        super().__init__(side, side)',
          '',
          'shapes = [Rectangle(3, 4), Square(5)]',
          'print([s.area() for s in shapes])',
          'print(isinstance(Square(2), Rectangle), isinstance(Square(2), Shape))'
        ),
        output: lines('[12, 25]', 'True True'),
        codeNotes: [
          { line: 11, note: 'A square is a kind of rectangle, so inheritance makes sense.' },
          { line: 13, note: 'A square is a rectangle with equal sides.' },
          { line: 17, note: 'A Square counts as a Rectangle and as a Shape.' }
        ],
        tryIt: 'Add a Circle(Shape) class with a radius and an area method using 3.14 * r * r, and add Circle(1) to the list. The areas become [12, 25, 3.14].',
        check: {
          question: 'Which sentence suggests inheritance is a good fit?',
          options: ['"A Subscription is a kind of Expense"', '"A Wallet has a list of expenses"', '"An Expense has an amount"'],
          answer: 0,
          why: '"Is a kind of" fits inheritance. "Has a" means one object holds another as an attribute instead.'
        }
      },
      {
        title: 'Putting it together: expenses and subscriptions',
        say: [
          'Let us use today\'s ideas in the Expense Tracker. We have one-time expenses and subscriptions in the same list. Each prints nicely, and each knows its yearly cost: a one-time expense counts once, a subscription counts twelve times.',
          'The report loop does not need to know which kind each item is. It just calls str() and yearly_cost(), and every object answers correctly. That is polymorphism in a real use.',
          'Seeing your subscriptions as yearly costs is eye-opening: 99 rupees a month is 1188 rupees a year. This is a feature real budgeting apps highlight.',
          'In today\'s practice you will write an Expense class with a __str__, and a Subscription class that inherits from Expense and adds yearly_cost.'
        ],
        example: 'When you list your spending for a year, a one-time phone purchase appears once, but your streaming plan appears twelve times. Each item knows how often it repeats, and the yearly total comes out right.',
        code: lines(
          'class Expense:',
          '    def __init__(self, item, amount):',
          '        self.item = item',
          '        self.amount = amount',
          '',
          '    def yearly_cost(self):',
          '        return self.amount',
          '',
          '    def __str__(self):',
          '        return f"{self.item:<10} Rs {self.amount:>6}"',
          '',
          'class Subscription(Expense):',
          '    def yearly_cost(self):',
          '        return self.amount * 12',
          '',
          '    def __str__(self):',
          '        return super().__str__() + " / month"',
          '',
          'things = [Expense("Phone", 15000), Subscription("Music", 99), Subscription("Gym", 900)]',
          'for t in things:',
          '    print(t)',
          'print("Yearly total:", sum(t.yearly_cost() for t in things))',
          'subs = [t for t in things if isinstance(t, Subscription)]',
          'print("Subscriptions per year:", sum(s.yearly_cost() for s in subs))'
        ),
        output: lines(
          'Phone      Rs  15000',
          'Music      Rs     99 / month',
          'Gym        Rs    900 / month',
          'Yearly total: 26988',
          'Subscriptions per year: 11988'
        ),
        codeNotes: [
          { line: 10, note: 'Lined-up output with f-string widths from Day 13.' },
          { line: 17, note: 'Reuse the parent\'s text and add " / month".' },
          { line: 23, note: 'isinstance picks out only the subscriptions.' }
        ],
        tryIt: 'Add Subscription("Cloud", 75) to the list. Predict the new subscriptions total before running: 11988 + 900 = 12888.',
        check: {
          question: 'Why can the report loop call t.yearly_cost() without checking the type of t?',
          options: ['Each class has its own yearly_cost, and Python calls the right one', 'Python converts every object to an Expense', 'yearly_cost ignores the object'],
          answer: 0,
          why: 'Both classes define yearly_cost. Python uses the version from each object\'s own class, so each answer is correct.'
        }
      }
    ],
    summary: [
      '__str__ returns the text shown when an object is printed.',
      'class Child(Parent): inherits all the parent\'s attributes and methods.',
      'A child can override a method with its own version.',
      'super().__init__(...) runs the parent\'s setup; super().method() reuses the parent\'s version.',
      'Use inheritance only when "X is a kind of Y" is true, and keep it shallow.'
    ],
    projectStep: {
      title: 'Expense Tracker: subscriptions',
      steps: [
        'Give your Expense class a __str__ and a yearly_cost method.',
        'Write Subscription(Expense) that overrides yearly_cost to return amount * 12.',
        'Put expenses and subscriptions in one list and print each one.',
        'Print the yearly total and the yearly cost of subscriptions only.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 20,
    title: 'Python on Your Laptop: Scripts, input() and pip',
    goal: 'You can install Python and VS Code, run .py files from the terminal, read what users type with input(), and install packages with pip in a virtual environment.',
    minutes: 35,
    recap: 'Yesterday you made objects print nicely with __str__ and built classes on top of other classes with inheritance.',
    parts: [
      {
        title: 'Installing Python and VS Code',
        say: [
          'So far you have written Python in the lesson editor. Real work happens on your own computer, in files, with an editor and a terminal. Today you set that up. From now on, the project steps assume you have it.',
          'First, install Python from python.org. On Windows, run the installer and tick the box "Add python.exe to PATH" before clicking Install. This box matters: without it, the terminal will not find Python. On a Mac, use the installer from python.org too.',
          'Second, install Visual Studio Code, usually called VS Code, from code.visualstudio.com. It is a free editor used by a huge number of professional developers. Open it, go to Extensions, and install the official Python extension from Microsoft.',
          'Finally, check it works. Open a terminal (in VS Code: Terminal, then New Terminal) and type python --version, or python3 --version on a Mac. You should see something like Python 3.12. If you get "not found", reinstall Python and make sure the PATH box is ticked.'
        ],
        example: 'Until now you have been cooking in a cookery class kitchen where everything was set up for you. Today you set up your own kitchen at home: buy the stove (Python), the counter (VS Code), and learn where the switches are (the terminal).',
        projectCode: {
          label: 'In a terminal on your laptop',
          code: lines(
            '# Windows',
            'python --version',
            '',
            '# Mac or Linux',
            'python3 --version',
            '',
            '# Expected: Python 3.12.x (any 3.10 or newer is fine)'
          )
        },
        code: lines(
          'import sys',
          'major, minor = sys.version_info[:2]',
          'print("Python", major)',
          'print("Recent enough:", (major, minor) >= (3, 10))'
        ),
        output: lines('Python 3', 'Recent enough: True'),
        codeNotes: [
          { line: 2, note: 'The running Python version as numbers, like (3, 12).' },
          { line: 4, note: 'Tuples compare item by item, so this checks for 3.10 or newer.' }
        ],
        tryIt: 'Run the same four lines in a file on your laptop after installing Python. You should get the same answers.',
        check: {
          question: 'On Windows, which installer option is important so the terminal can find Python?',
          options: ['"Add python.exe to PATH"', '"Install for all users"', '"Disable path length limit"'],
          answer: 0,
          why: 'Adding Python to PATH lets the terminal find the python command from any folder.'
        }
      },
      {
        title: 'Running a .py file from the terminal',
        say: [
          'Python programs are saved in files ending in .py. Create a folder for your project, for example expense-tracker, and open it in VS Code with File, Open Folder. Create a file called main.py and write print("Hello from my laptop").',
          'To run it, open the terminal in VS Code. The terminal is a text window where you type commands. Make sure it is in your project folder, then type python main.py (or python3 main.py on a Mac) and press Enter.',
          'A few terminal commands you will use every day: cd folder_name moves into a folder, cd .. moves up one level, and ls on Mac or dir on Windows lists the files in the current folder. pwd on Mac, or cd on its own on Windows, shows where you are.',
          'VS Code also has a Run button in the top right corner of a Python file. It runs the same command for you. Both are fine, but knowing the terminal command matters, because servers and deployment use it.'
        ],
        example: 'The terminal is like talking to the computer by text message instead of tapping icons. "Go to the expense-tracker folder" is cd expense-tracker. "Run my program" is python main.py.',
        projectCode: {
          label: 'Terminal: create and run your first file',
          code: lines(
            'mkdir expense-tracker',
            'cd expense-tracker',
            'code .            # opens this folder in VS Code',
            '',
            '# after creating main.py in VS Code:',
            'python main.py    # Mac: python3 main.py'
          )
        },
        code: lines(
          '# main.py',
          'def main():',
          '    print("Hello from my laptop")',
          '    print("Expense Tracker starting...")',
          '',
          'if __name__ == "__main__":',
          '    main()'
        ),
        output: lines('Hello from my laptop', 'Expense Tracker starting...'),
        codeNotes: [
          { line: 2, note: 'Put the program\'s steps in a main() function.' },
          { line: 6, note: 'Run main() only when this file is run directly (from Day 15).' }
        ],
        tryIt: 'Create main.py on your laptop with this code and run python main.py in the terminal. You should see the same two lines.',
        check: {
          question: 'How do you run a file called main.py from the terminal?',
          options: ['python main.py (python3 on a Mac)', 'run main', 'open main.py'],
          answer: 0,
          why: 'The python command followed by the file name runs the file. The terminal must be in the folder where the file is.'
        }
      },
      {
        title: 'Reading what the user types with input()',
        say: [
          'On your laptop, a program can ask the user a question and wait for an answer. input("Item: ") shows the text Item: and waits. When the user types something and presses Enter, input returns what they typed as a string.',
          'input always returns a string, even if the user typed a number. To use it as a number, convert it with int() or float(). And because users make mistakes, wrap the conversion in try and except, exactly like Day 14.',
          'input() does not work in the lesson editor, because a web page cannot pause and wait for you to type into a running program. That is why the practice tasks give you functions that receive text as a parameter. On your laptop, you pass input(...) into those same functions.',
          'This is a good design anyway: keep the logic in functions that take plain values, and keep input() at the edge of the program. Functions without input() are easy to test.'
        ],
        example: 'input() is like a shopkeeper asking "What would you like?" and waiting for your answer. Whatever you say, the shopkeeper hears words, not numbers, and has to understand "two" or "2" as a quantity.',
        projectCode: {
          label: 'main.py on your laptop (input() only works there)',
          code: lines(
            'def parse_amount(text):',
            '    try:',
            '        return float(text.strip())',
            '    except ValueError:',
            '        return None',
            '',
            'item = input("Item: ")',
            'amount = parse_amount(input("Amount: "))',
            'if amount is None:',
            '    print("Please type a number, like 120 or 99.5")',
            'else:',
            '    print(f"Added {item}: Rs {amount:.2f}")'
          )
        },
        code: lines(
          'def parse_amount(text):',
          '    try:',
          '        return float(text.strip())',
          '    except ValueError:',
          '        return None',
          '',
          '# In the lesson editor we pretend these were typed:',
          'for typed in [" 120 ", "99.5", "abc"]:',
          '    print(repr(typed), "->", parse_amount(typed))'
        ),
        output: lines("' 120 ' -> 120.0", "'99.5' -> 99.5", "'abc' -> None"),
        codeNotes: [
          { line: 3, note: 'Everything typed is text: strip spaces, then convert.' },
          { line: 8, note: 'We test the function with pretend input instead of input().' },
          { line: 9, note: 'repr shows the text with quotes, so the spaces are visible.' }
        ],
        tryIt: 'Run the projectCode version on your laptop. Type an item and an amount, then try typing letters for the amount to see the friendly message.',
        check: {
          question: 'What type does input() always return?',
          options: ['str (text)', 'int', 'Whatever type the user typed'],
          answer: 0,
          why: 'input() always gives a string. Convert it with int() or float(), inside try/except, when you need a number.'
        }
      },
      {
        title: 'A menu loop',
        say: [
          'Most small command-line programs are a menu in a loop: show the options, read a choice, do the action, and repeat until the user chooses to quit.',
          'The loop is a while True: loop, which would run forever, with a break when the user picks Quit. You saw break on Day 6.',
          'Each option calls a function: add an expense, list expenses, show the total. The menu itself stays short and easy to read.',
          'We check the choice with a small function, menu_choice, which returns 1, 2 or 3 for valid choices and None for anything else. That function has no input() in it, so it can be tested, and it is one of today\'s practice tasks.'
        ],
        example: 'An ATM shows a menu: withdraw, balance, mini statement, exit. After each action, it shows the menu again, until you press exit. Your Expense Tracker menu works the same way.',
        projectCode: {
          label: 'main.py: the Expense Tracker menu (on your laptop)',
          code: lines(
            'def menu_choice(text):',
            '    value = text.strip()',
            '    return int(value) if value in ("1", "2", "3") else None',
            '',
            'expenses = []',
            'while True:',
            '    print("1. Add  2. List  3. Quit")',
            '    choice = menu_choice(input("Choose: "))',
            '    if choice == 1:',
            '        item = input("Item: ")',
            '        amount = float(input("Amount: "))',
            '        expenses.append({"item": item, "amount": amount})',
            '    elif choice == 2:',
            '        for e in expenses:',
            '            print(f"{e[\'item\']:<12}{e[\'amount\']:>9.2f}")',
            '    elif choice == 3:',
            '        print("Bye!")',
            '        break',
            '    else:',
            '        print("Please type 1, 2 or 3")'
          )
        },
        code: lines(
          'def menu_choice(text):',
          '    value = text.strip()',
          '    return int(value) if value in ("1", "2", "3") else None',
          '',
          'expenses = []',
          'pretend_typing = ["1", "Tea", "20", "1", "Bus", "45", "7", "2", "3"]',
          'answers = iter(pretend_typing)',
          'while True:',
          '    choice = menu_choice(next(answers))',
          '    if choice == 1:',
          '        expenses.append({"item": next(answers), "amount": float(next(answers))})',
          '    elif choice == 2:',
          '        for e in expenses:',
          '            print(f"{e[\'item\']:<12}{e[\'amount\']:>9.2f}")',
          '    elif choice == 3:',
          '        print("Bye!")',
          '        break',
          '    else:',
          '        print("Please type 1, 2 or 3")'
        ),
        output: lines('Please type 1, 2 or 3', 'Tea             20.00', 'Bus             45.00', 'Bye!'),
        codeNotes: [
          { line: 6, note: 'Pretend answers, in the order a user would type them.' },
          { line: 9, note: 'next(answers) gives the next pretend answer, like input() would.' },
          { line: 17, note: 'break ends the while True loop.' }
        ],
        tryIt: 'Change "7" in the pretend typing to "2" and run it. Now the list is printed twice and there is no "Please type" message.',
        check: {
          question: 'How does a while True: menu loop end?',
          options: ['With break when the user chooses Quit', 'It ends after 10 rounds', 'When the list is empty'],
          answer: 0,
          why: 'while True never becomes False by itself. A break inside the Quit option ends the loop.'
        }
      },
      {
        title: 'pip and packages',
        say: [
          'Python\'s standard library is big, but the wider Python community has written hundreds of thousands of extra packages: requests for calling APIs, FastAPI for building web APIs, pytest for testing, and many more. They live on a website called PyPI, the Python Package Index.',
          'pip is the tool that installs these packages. In the terminal, pip install requests downloads and installs the requests package so your code can import it.',
          'Only install packages you need, from names you trust. Check the spelling carefully: attackers sometimes publish fake packages with names one letter different from popular ones.',
          'pip list shows what is installed. pip freeze > requirements.txt writes the exact packages and versions to a file, so another computer, or a server, can install the same set with pip install -r requirements.txt. You will need this file on Day 29 when you deploy.'
        ],
        example: 'PyPI is like an app store for Python code, and pip is the "Install" button. requirements.txt is a shopping list of the exact apps and versions your project needs, so a new phone can be set up the same way.',
        projectCode: {
          label: 'Terminal: installing packages',
          code: lines(
            'pip install requests',
            'pip list',
            'pip freeze > requirements.txt',
            '',
            '# On another computer or a server:',
            'pip install -r requirements.txt'
          )
        },
        code: lines(
          'requirements = """requests==2.32.3',
          'fastapi==0.115.0',
          'pytest==8.3.3"""',
          'for line in requirements.splitlines():',
          '    name, version = line.split("==")',
          '    print(f"{name:<10} version {version}")'
        ),
        output: lines('requests   version 2.32.3', 'fastapi    version 0.115.0', 'pytest     version 8.3.3'),
        codeNotes: [
          { line: 1, note: 'This is what a requirements.txt file looks like: name==version per line.' },
          { line: 5, note: 'Each line splits into the package name and its exact version.' }
        ],
        tryIt: 'On your laptop (inside a virtual environment, next part), run pip install requests and then pip list to see it installed.',
        check: {
          question: 'What is requirements.txt for?',
          options: ['Listing the exact packages a project needs, so they can be installed elsewhere', 'Storing your Python code', 'Listing Python\'s built-in modules'],
          answer: 0,
          why: 'pip install -r requirements.txt installs the same packages and versions on another computer or server.'
        }
      },
      {
        title: 'Virtual environments',
        say: [
          'If every project installs packages into one shared Python, projects start to clash: one needs version 1 of a package, another needs version 2. The solution is a virtual environment, usually called a venv: a private set of packages for one project.',
          'You create one inside your project folder with python -m venv .venv. Then you activate it: on Windows, .venv\\Scripts\\activate; on Mac or Linux, source .venv/bin/activate. The terminal prompt then shows (.venv) at the start.',
          'While the venv is active, pip install puts packages only into this project. VS Code usually notices the .venv folder and asks whether to use it; say yes.',
          'Do not put the .venv folder in Git; it is large and can be rebuilt from requirements.txt. You will set up a .gitignore file for that on Day 22. Creating a venv at the start of every Python project is a professional habit that interviewers like to hear about.'
        ],
        example: 'A virtual environment is like each project having its own pencil box. Your art project\'s colours do not get mixed into your maths project\'s box. If one project needs a special pen, only its box gets it.',
        projectCode: {
          label: 'Terminal: set up the Expense Tracker project',
          code: lines(
            'cd expense-tracker',
            'python -m venv .venv',
            '',
            '# Windows',
            '.venv\\Scripts\\activate',
            '# Mac or Linux',
            'source .venv/bin/activate',
            '',
            '# The prompt now starts with (.venv)',
            'pip install pytest',
            'pip freeze > requirements.txt',
            'python main.py'
          )
        },
        code: lines(
          'import sys',
          'in_venv = sys.prefix != sys.base_prefix',
          'print("Checking for a virtual environment...")',
          'print("This check is useful on your laptop:", type(in_venv).__name__)'
        ),
        output: lines('Checking for a virtual environment...', 'This check is useful on your laptop: bool'),
        codeNotes: [
          { line: 2, note: 'Inside a venv, sys.prefix points to the .venv folder instead of the main Python.' }
        ],
        tryIt: 'On your laptop, run print(sys.prefix != sys.base_prefix) with and without the venv activated. It is True only when the venv is active.',
        check: {
          question: 'Why use a virtual environment for each project?',
          options: ['So each project has its own packages and versions without clashing', 'To make Python run faster', 'Because pip only works in a venv'],
          answer: 0,
          why: 'A venv keeps one project\'s packages separate from others, so different projects can use different versions safely.'
        }
      }
    ],
    summary: [
      'Install Python (tick "Add to PATH" on Windows) and VS Code with the Python extension.',
      'Save code in .py files and run them with python main.py (python3 on a Mac).',
      'input() returns text. Convert with int() or float() inside try/except.',
      'pip install adds packages; requirements.txt lists the exact versions.',
      'Create a venv per project: python -m venv .venv, then activate it.'
    ],
    projectStep: {
      title: 'Expense Tracker: move to your laptop',
      steps: [
        'Create an expense-tracker folder, open it in VS Code and create a .venv.',
        'Copy your functions (parse_amount, save, load) into main.py.',
        'Write the menu loop with input(): add, list, quit.',
        'Save expenses to expenses.json with the JSON code from Day 17, so they are still there next time you run it.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 21,
    title: 'Testing Your Code with assert and pytest',
    goal: 'You can write automatic tests with assert, organise them as pytest test functions, and test normal cases and edge cases.',
    minutes: 30,
    recap: 'Yesterday you set up Python on your laptop, ran scripts from the terminal, used input(), and installed packages with pip in a virtual environment.',
    parts: [
      {
        title: 'Why developers write tests',
        say: [
          'So far you have checked your code by running it and looking at the output. That works for small programs, but it does not scale. When a program has fifty functions, you cannot re-check every one by eye each time you change something.',
          'A test is a small piece of code that checks another piece of code automatically. It calls a function with known inputs and checks that the answer is what you expected. If it is, the test passes silently. If not, it fails loudly and tells you.',
          'Tests give you confidence to change code. If you improve a function and all the tests still pass, you know you did not break anything. Companies run thousands of tests before every release for exactly this reason.',
          'You have actually been using tests all month: every practice task is checked by a test that calls your function and compares the result. Today you learn to write them yourself. Interviewers often ask junior developers "how do you test your code?", and now you will have a real answer.'
        ],
        example: 'Before a car leaves the factory, it goes through a checklist: brakes work, lights work, horn works. Nobody drives every car around the city by hand to check. The checklist is fast, the same every time, and catches problems before customers do. Tests are that checklist for code.',
        code: lines(
          'def add_gst(price):',
          '    return round(price * 1.18, 2)',
          '',
          'assert add_gst(100) == 118.0',
          'assert add_gst(0) == 0',
          'print("All checks passed")'
        ),
        output: 'All checks passed',
        codeNotes: [
          { line: 4, note: 'assert checks that something is True. If it is, nothing happens.' },
          { line: 6, note: 'We only get here if every assert passed.' }
        ],
        tryIt: 'Change 1.18 to 1.8 on line 2 (a typo a real developer could make) and run it. The first assert fails and stops the program, pointing straight at the bug.',
        check: {
          question: 'What is the main benefit of automatic tests?',
          options: ['You can change code and quickly confirm nothing broke', 'They make the program run faster', 'They replace the need to write functions'],
          answer: 0,
          why: 'Tests re-check your code in seconds after every change, so mistakes are caught before users see them.'
        }
      },
      {
        title: 'assert and failure messages',
        say: [
          'assert takes a condition. If the condition is True, nothing happens and the program continues. If it is False, Python raises an AssertionError and stops.',
          'You can add a message after a comma: assert total == 65, "total should be 65". When the assert fails, the message is shown, which makes it much easier to understand what went wrong.',
          'A very useful message shows both what you expected and what you actually got: f"expected 65, got {total}". When a test fails at midnight on a server, a clear message saves a lot of time.',
          'assert is only for checking your own code in tests. Do not use it to check user input in the real program, because Python can be run in a mode that skips asserts. For user input, use if and raise, as on Day 14.'
        ],
        example: 'A good failure message is like a clear complaint at a restaurant: "I ordered paneer, but got chicken" is much more helpful than just "wrong". The kitchen knows exactly what to fix.',
        code: lines(
          'def total(amounts):',
          '    return sum(amounts)',
          '',
          'result = total([20, 45])',
          'assert result == 65, f"expected 65, got {result}"',
          'print("First check passed")',
          'result = total([20, 45, 10])',
          'assert result == 70, f"expected 70, got {result}"',
          'print("This line is never reached")'
        ),
        output: lines('First check passed', '[Error] AssertionError: expected 70, got 75'),
        codeNotes: [
          { line: 5, note: 'The message after the comma is shown only if the check fails.' },
          { line: 8, note: 'This expectation is wrong on purpose: 20 + 45 + 10 is 75.' }
        ],
        tryIt: 'Fix the expected value on line 8 to 75 and run it. Now both checks pass and the last line prints.',
        check: {
          question: 'What happens when assert x == 5, "x should be 5" fails?',
          options: ['An AssertionError is raised showing "x should be 5"', 'x is set to 5', 'Python prints a warning and continues'],
          answer: 0,
          why: 'A failing assert raises AssertionError with your message, and the program stops unless the error is caught.'
        }
      },
      {
        title: 'Test functions and pytest',
        say: [
          'Writing asserts at the bottom of a file gets messy. The standard approach is to put each check in its own function whose name starts with test_, in a separate file whose name also starts with test_, like test_tracker.py.',
          'pytest is the most popular Python testing tool. You install it with pip install pytest inside your virtual environment. Then you type pytest in the terminal. It finds every file and function starting with test_, runs them all, and shows a summary: how many passed and which failed.',
          'Each test function should check one behaviour and have a name that says what it checks, like test_total_of_empty_list_is_zero. When a test fails, its name alone tells you what broke.',
          'pytest cannot run in the lesson editor, so today\'s code sample includes a tiny test runner written in plain Python that does the same basic job. On your laptop, you will use the real pytest.'
        ],
        example: 'A school exam is split into numbered questions, each testing one topic. If a student gets question 4 wrong, the teacher knows exactly which topic to review. Test functions are numbered questions for your code, and pytest is the teacher marking them.',
        projectCode: {
          label: 'test_tracker.py on your laptop, run with: pytest',
          code: lines(
            'from tracker import total',
            '',
            'def test_total_adds_amounts():',
            '    assert total([20, 45]) == 65',
            '',
            'def test_total_of_empty_list_is_zero():',
            '    assert total([]) == 0',
            '',
            '# Terminal:',
            '# (.venv) $ pytest',
            '# ..                                    [100%]',
            '# 2 passed in 0.01s'
          )
        },
        code: lines(
          'def total(amounts):',
          '    return sum(amounts)',
          '',
          'def test_total_adds_amounts():',
          '    assert total([20, 45]) == 65',
          '',
          'def test_total_of_empty_list_is_zero():',
          '    assert total([]) == 0',
          '',
          'def test_total_wrong_on_purpose():',
          '    assert total([1, 1]) == 3, "1 + 1 is not 3"',
          '',
          '# A tiny version of what pytest does:',
          'tests = [test_total_adds_amounts, test_total_of_empty_list_is_zero, test_total_wrong_on_purpose]',
          'passed = 0',
          'for test in tests:',
          '    try:',
          '        test()',
          '        passed += 1',
          '    except AssertionError as error:',
          '        print("FAILED", test.__name__, "-", error)',
          'print(passed, "passed,", len(tests) - passed, "failed")'
        ),
        output: lines('FAILED test_total_wrong_on_purpose - 1 + 1 is not 3', '2 passed, 1 failed'),
        codeNotes: [
          { line: 4, note: 'One behaviour per test, with a descriptive name starting with test_.' },
          { line: 18, note: 'Run each test; a failing assert raises AssertionError.' },
          { line: 21, note: 'Like pytest, show which test failed and why.' }
        ],
        tryIt: 'Delete the wrong-on-purpose test from the tests list and run it again. You should see 2 passed, 0 failed.',
        check: {
          question: 'How does pytest know which functions are tests?',
          options: ['Their names start with test_', 'They contain the word assert', 'They are at the bottom of the file'],
          answer: 0,
          why: 'pytest collects files and functions whose names start with test_ and runs them automatically.'
        }
      },
      {
        title: 'Normal cases and edge cases',
        say: [
          'A good set of tests checks more than the obvious case. Normal cases are the usual inputs: a list of a few amounts. Edge cases are the unusual inputs at the boundaries: an empty list, a single item, zero, a negative number, very large numbers, text with extra spaces.',
          'Bugs love edge cases. Remember the average function on Day 7: it worked for normal lists but would have crashed on an empty list by dividing by zero. A test for the empty list catches that.',
          'Boundaries deserve special attention. If free delivery starts at 499, test 498, 499 and 500. Off-by-one mistakes, like writing > instead of >=, are some of the most common bugs, and boundary tests catch them.',
          'When you find a bug, first write a test that shows the bug, then fix the code until the test passes. That test then protects you from the same bug coming back later. This habit is called a regression test.'
        ],
        example: 'When a lift is tested, engineers do not only check it goes from floor 2 to floor 5. They check the ground floor, the top floor, an empty lift and a full lift. The edges are where things break.',
        code: lines(
          'def delivery_fee(bill):',
          '    return 0 if bill > 499 else 40',
          '',
          'cases = [(100, 40), (498, 40), (499, 0), (500, 0), (0, 40)]',
          'for bill, expected in cases:',
          '    got = delivery_fee(bill)',
          '    status = "ok" if got == expected else "BUG"',
          '    print(f"bill {bill:>3}: expected {expected:>2}, got {got:>2}  {status}")'
        ),
        output: lines(
          'bill 100: expected 40, got 40  ok',
          'bill 498: expected 40, got 40  ok',
          'bill 499: expected  0, got 40  BUG',
          'bill 500: expected  0, got  0  ok',
          'bill   0: expected 40, got 40  ok'
        ),
        codeNotes: [
          { line: 2, note: 'The bug: > should be >=, because delivery is free from 499.' },
          { line: 4, note: 'A table of (input, expected) cases, including the boundary 499.' }
        ],
        tryIt: 'Fix the bug by changing > to >= on line 2, and run again. Every line should now say ok.',
        check: {
          question: 'Free delivery starts at 499. Which bills are most important to test?',
          options: ['498, 499 and 500', 'Only 100', '10000 and 20000'],
          answer: 0,
          why: 'Testing just below, at, and just above the boundary catches off-by-one mistakes like > instead of >=.'
        }
      },
      {
        title: 'Testing errors and keeping functions testable',
        say: [
          'Some functions should raise an error for bad input, like add_expense refusing a negative amount. A good test checks that the error really happens. In pytest you write with pytest.raises(ValueError): and call the function inside; the test passes only if that error is raised.',
          'Functions are easiest to test when they take inputs as parameters and return a result, without printing, reading input() or touching files. That is why this course asked you to keep input() at the edge of your program and write functions that return values.',
          'Code that saves files can still be tested: pytest gives each test a temporary folder called tmp_path, so tests never touch your real data.',
          'You do not need to test everything. Focus on the logic that matters: calculations, rules and data handling. For the Expense Tracker, that means totals, category grouping, validation, and saving and loading.'
        ],
        example: 'Testing a smoke alarm means making a little smoke on purpose and checking that it beeps. Testing that a function raises an error is the same: give it bad input on purpose and check that it complains.',
        projectCode: {
          label: 'test_tracker.py: testing an error with pytest',
          code: lines(
            'import pytest',
            'from tracker import add_expense',
            '',
            'def test_negative_amount_is_refused():',
            '    with pytest.raises(ValueError):',
            '        add_expense([], "Refund", -50)'
          )
        },
        code: lines(
          'def add_expense(expenses, item, amount):',
          '    if amount <= 0:',
          '        raise ValueError("amount must be more than 0")',
          '    return expenses + [{"item": item, "amount": amount}]',
          '',
          'def test_negative_amount_is_refused():',
          '    try:',
          '        add_expense([], "Refund", -50)',
          '    except ValueError:',
          '        return',
          '    raise AssertionError("expected a ValueError")',
          '',
          'def test_good_amount_is_added():',
          '    result = add_expense([], "Tea", 20)',
          '    assert result == [{"item": "Tea", "amount": 20}]',
          '',
          'test_negative_amount_is_refused()',
          'test_good_amount_is_added()',
          'print("Both tests passed")'
        ),
        output: 'Both tests passed',
        codeNotes: [
          { line: 7, note: 'Without pytest: call it and expect a ValueError.' },
          { line: 11, note: 'If no error happened, the test fails.' }
        ],
        tryIt: 'Remove the if check (lines 2 and 3) from add_expense and run it. The first test now fails with "expected a ValueError". Put the lines back.',
        check: {
          question: 'Which function is easiest to test?',
          options: ['One that takes parameters and returns a result', 'One that reads input() and prints the result', 'One that only works with a real file on your laptop'],
          answer: 0,
          why: 'A test can call it with known values and compare the returned result, with no typing or files involved.'
        }
      },
      {
        title: 'Putting it together: tests for the tracker',
        say: [
          'Let us write a small test suite for the Expense Tracker functions: total, category totals, and the amount parser from Day 14. Each test is short and checks one behaviour, including edge cases.',
          'Look at the test names. Reading only the names tells you what the tracker promises to do. Tests are a kind of documentation that can never go out of date, because they run.',
          'On your laptop, put the functions in tracker.py and the tests in test_tracker.py, and run pytest. Add a test every time you add a feature or fix a bug. By the end of the month project, your GitHub repository will show recruiters that you test your code.',
          'In today\'s practice you will write is_valid_amount, which has several edge cases, and check_equal, a tiny assert helper that raises a clear AssertionError.'
        ],
        example: 'A pilot runs through the same pre-flight checklist before every flight, even after thousands of flights. Your test suite is the checklist you run before every change is shared.',
        code: lines(
          'def category_totals(expenses):',
          '    totals = {}',
          '    for e in expenses:',
          '        totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]',
          '    return totals',
          '',
          'def parse_amount(text):',
          '    try:',
          '        value = float(text.strip())',
          '    except ValueError:',
          '        return None',
          '    return value if value > 0 else None',
          '',
          'def test_category_totals_groups_amounts():',
          '    data = [{"category": "food", "amount": 20}, {"category": "food", "amount": 30}]',
          '    assert category_totals(data) == {"food": 50}',
          '',
          'def test_category_totals_of_nothing_is_empty():',
          '    assert category_totals([]) == {}',
          '',
          'def test_parse_amount_accepts_spaces():',
          '    assert parse_amount(" 120 ") == 120.0',
          '',
          'def test_parse_amount_refuses_text_and_zero():',
          '    assert parse_amount("abc") is None',
          '    assert parse_amount("0") is None',
          '',
          'tests = [f for name, f in list(globals().items()) if name.startswith("test_")]',
          'for test in tests:',
          '    test()',
          '    print("PASSED", test.__name__)'
        ),
        output: lines(
          'PASSED test_category_totals_groups_amounts',
          'PASSED test_category_totals_of_nothing_is_empty',
          'PASSED test_parse_amount_accepts_spaces',
          'PASSED test_parse_amount_refuses_text_and_zero'
        ),
        codeNotes: [
          { line: 18, note: 'An edge case: no expenses at all.' },
          { line: 26, note: 'Another edge case: zero is not a valid amount.' },
          { line: 28, note: 'Find every function whose name starts with test_, like pytest does.' }
        ],
        tryIt: 'Add a test that parse_amount("-5") is None, and run it. Then add one for parse_amount("") and check it also returns None.',
        check: {
          question: 'Why write a test for category_totals([])?',
          options: ['An empty list is an edge case where bugs often hide', 'Empty lists are the most common input', 'pytest needs at least one empty test'],
          answer: 0,
          why: 'Edge cases like empty input are where functions often crash or give wrong answers, so they deserve their own tests.'
        }
      }
    ],
    summary: [
      'Tests check your code automatically, so you can change it with confidence.',
      'assert condition, "message" raises AssertionError with your message when the condition is False.',
      'pytest runs every test_ function in test_ files: pip install pytest, then pytest.',
      'Test normal cases and edge cases: empty, zero, negative, boundaries like 498, 499, 500.',
      'Functions that take parameters and return values are the easiest to test.'
    ],
    projectStep: {
      title: 'Expense Tracker: add tests',
      steps: [
        'Move your functions into tracker.py and create test_tracker.py next to it.',
        'Write at least five test_ functions, including an empty list and an invalid amount.',
        'Install pytest in your venv and run pytest until everything passes.',
        'Add pytest to requirements.txt with pip freeze > requirements.txt.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 22,
    title: 'Git and GitHub: Saving and Sharing Your Code',
    goal: 'You can save snapshots of your code with Git commits, work on branches, ignore files with .gitignore, and push your project to GitHub.',
    minutes: 30,
    recap: 'Yesterday you wrote automatic tests with assert and pytest, including edge cases.',
    parts: [
      {
        title: 'What Git is and why every job uses it',
        say: [
          'Git is a tool that records the history of your code. Each time you reach a good point, you save a snapshot called a commit. You can look back at any commit, see exactly what changed, and go back if something breaks.',
          'Git also lets many people work on the same code without overwriting each other\'s work. Every software company uses Git, or something very like it. Knowing the basics is expected even for a junior role.',
          'GitHub is a website that stores Git projects online, called repositories or repos. It is also where recruiters look at your work. A GitHub profile with a real project, clear commits and a good README is one of the strongest things a junior developer can show.',
          'Install Git from git-scm.com. Then, once, tell Git your name and email with git config, so your commits are labelled with who made them.'
        ],
        example: 'Git is like the save points in a video game. When you reach a safe spot, you save. If you make a bad move later, you go back to the last save instead of starting the whole game again. Each commit is a save point with a note saying what you did.',
        projectCode: {
          label: 'Terminal: one-time Git setup',
          code: lines(
            'git --version',
            'git config --global user.name "Your Name"',
            'git config --global user.email "you@example.com"'
          )
        },
        code: lines(
          'history = []',
          'def commit(message, files):',
          '    history.append({"id": len(history) + 1, "message": message, "files": dict(files)})',
          '',
          'files = {"main.py": "print(\'v1\')"}',
          'commit("Add first version", files)',
          'files["main.py"] = "print(\'v2 with a bug\')"',
          'commit("Change output", files)',
          'for c in history:',
          '    print(c["id"], c["message"])',
          'files = dict(history[0]["files"])',
          'print("Went back to:", files["main.py"])'
        ),
        output: lines('1 Add first version', '2 Change output', "Went back to: print('v1')"),
        codeNotes: [
          { line: 3, note: 'A commit saves a copy of the files plus a message. (A simple imitation of Git.)' },
          { line: 11, note: 'Going back to an earlier snapshot, like Git lets you do.' }
        ],
        tryIt: 'Add a third commit with the message "Fix output" that sets main.py back to a working version, and print the history again.',
        check: {
          question: 'What is a Git commit?',
          options: ['A saved snapshot of your code with a message', 'A copy of your code on a USB drive', 'A test that checks your code'],
          answer: 0,
          why: 'A commit records the state of your files at that moment, with a message describing the change.'
        }
      },
      {
        title: 'The basic cycle: status, add, commit',
        say: [
          'You start using Git in a project folder with git init. This creates a hidden .git folder that holds the whole history. You only do this once per project.',
          'The everyday cycle has three steps. git status shows which files have changed. git add chooses which changes go into the next commit; git add . adds all changes in the folder. git commit -m "message" saves the snapshot with your message.',
          'Commit small and often: one commit per meaningful step, like "Add category totals" or "Fix empty list in average". Small commits are easy to understand and easy to undo.',
          'git log shows the history of commits, newest first. git diff shows exactly which lines changed since the last commit. Checking git diff before committing is a great habit: you will often catch a leftover print or a mistake.'
        ],
        example: 'Packing a parcel: git status is looking at what is on the table, git add is putting chosen items into the box, and git commit is sealing the box and writing a label on it. You can have things on the table that you do not put in this box yet.',
        projectCode: {
          label: 'Terminal: the everyday Git cycle',
          code: lines(
            'cd expense-tracker',
            'git init',
            'git status',
            'git add .',
            'git commit -m "Add expense menu and JSON storage"',
            'git log --oneline'
          )
        },
        code: lines(
          'def is_good_commit_message(msg):',
          '    return 10 <= len(msg) <= 72',
          '',
          'messages = ["fix", "Add category totals to the report", "stuff", "Handle an empty list in average()"]',
          'for m in messages:',
          '    verdict = "good" if is_good_commit_message(m) else "too short or too long"',
          '    print(f"{m!r}: {verdict}")'
        ),
        output: lines(
          "'fix': too short or too long",
          "'Add category totals to the report': good",
          "'stuff': too short or too long",
          "'Handle an empty list in average()': good"
        ),
        codeNotes: [
          { line: 2, note: 'A simple rule of thumb: between 10 and 72 characters.' },
          { line: 4, note: 'Good messages say what changed, starting with a verb like Add, Fix or Handle.' }
        ],
        tryIt: 'Write two commit messages of your own for changes you made to your tracker this week and check them with the function.',
        check: {
          question: 'Which command chooses the changes that go into the next commit?',
          options: ['git add', 'git status', 'git log'],
          answer: 0,
          why: 'git add stages changes for the next commit. git status only shows what changed, and git log shows past commits.'
        }
      },
      {
        title: '.gitignore: files Git should skip',
        say: [
          'Some files should never go into Git. Your .venv folder is large and can be rebuilt from requirements.txt. The __pycache__ folders are created by Python automatically. Your personal data file, like expenses.json, is not code. And secret files, like .env with passwords or API keys, must never be shared.',
          'A file called .gitignore in the project folder lists names and patterns for Git to skip. .venv/ skips that folder. *.pyc skips every file ending in .pyc. Each rule goes on its own line.',
          'Create .gitignore before your first commit. If a secret file was committed by mistake, deleting it later does not remove it from the history, and anyone who can see the repository can find it. If that happens, treat the secret as leaked and change it.',
          'GitHub offers a ready-made Python .gitignore template when you create a repository. It covers the common cases.'
        ],
        example: '.gitignore is like the "do not pack" list before a trip: no house keys to the neighbour\'s house, no half-eaten food, nothing private. You write the list once, and it is checked every time you pack.',
        projectCode: {
          label: '.gitignore for a Python project',
          code: lines(
            '.venv/',
            '__pycache__/',
            '*.pyc',
            '.env',
            'expenses.json'
          )
        },
        code: lines(
          'from fnmatch import fnmatch',
          'rules = [".venv/*", "__pycache__/*", "*.pyc", ".env", "expenses.json"]',
          'files = ["main.py", "tracker.py", ".env", ".venv/bin/python", "__pycache__/tracker.pyc", "expenses.json", "README.md"]',
          'for f in files:',
          '    ignored = any(fnmatch(f, rule) for rule in rules)',
          '    print(f"{f:<26}{\'skip\' if ignored else \'commit\'}")'
        ),
        output: lines(
          'main.py                   commit',
          'tracker.py                commit',
          '.env                      skip',
          '.venv/bin/python          skip',
          '__pycache__/tracker.pyc   skip',
          'expenses.json             skip',
          'README.md                 commit'
        ),
        codeNotes: [
          { line: 1, note: 'fnmatch checks names against patterns like *.pyc, similar to .gitignore.' },
          { line: 5, note: 'A file is skipped if it matches any rule.' }
        ],
        tryIt: 'Add "notes.txt" to the files list and a rule "*.txt" to the rules list, and check it is skipped.',
        check: {
          question: 'Why must .env files with API keys go in .gitignore?',
          options: ['Secrets pushed to GitHub can be seen by others and stay in the history', 'Git cannot read .env files', '.env files are too large'],
          answer: 0,
          why: 'Anything committed can be seen by people with access to the repository, and it stays in the history even if deleted later.'
        }
      },
      {
        title: 'Branches: working safely on a feature',
        say: [
          'The main branch, usually called main, should always hold working code. When you start a new feature, you create a branch: a separate line of work. You can commit freely on it without affecting main.',
          'git switch -c feature/monthly-report creates a new branch and moves to it. git switch main goes back. When the feature is finished and tested, you merge it into main with git merge, or on GitHub with a pull request.',
          'A pull request, often called a PR, is a request to merge your branch. On a team, colleagues review your code in the PR before it is merged. This review is where juniors learn the most, so welcome comments on your PRs.',
          'Branch names are usually short and descriptive: feature/add-export, fix/empty-average. Lower-case words joined by hyphens are the common style.'
        ],
        example: 'A branch is like writing a new chapter of a book in a separate notebook. The published book (main) stays clean while you draft. When the chapter is ready and an editor has checked it, you add it to the book.',
        projectCode: {
          label: 'Terminal: a feature branch',
          code: lines(
            'git switch -c feature/monthly-report',
            '# ...edit code, run pytest...',
            'git add .',
            'git commit -m "Add monthly report"',
            'git switch main',
            'git merge feature/monthly-report'
          )
        },
        code: lines(
          'def branch_name(task):',
          '    return "feature/" + "-".join(task.lower().split())',
          '',
          'print(branch_name("Add Monthly Report"))',
          'print(branch_name("  Export to   CSV "))'
        ),
        output: lines('feature/add-monthly-report', 'feature/export-to-csv'),
        codeNotes: [
          { line: 2, note: 'Lower-case, split on any spaces, join with hyphens.' }
        ],
        tryIt: 'Write fix_branch_name(task) that makes names starting with "fix/" instead, and test it with "Empty list in average".',
        check: {
          question: 'Why work on a branch instead of directly on main?',
          options: ['main stays working while the new feature is in progress', 'Branches make Python run faster', 'Git does not allow commits on main'],
          answer: 0,
          why: 'A branch keeps unfinished work separate, so main always holds code that works. You merge when the feature is ready.'
        }
      },
      {
        title: 'Pushing to GitHub',
        say: [
          'To share your project, create a free account on github.com, then create a new, empty repository, for example expense-tracker. GitHub then shows the commands to connect your local project to it.',
          'git remote add origin <address> tells your project where the online copy lives. git push -u origin main uploads your commits. After the first time, just git push sends new commits.',
          'When you work on another computer, or with a teammate, git clone <address> downloads a full copy, and git pull brings in new commits others have pushed.',
          'GitHub will ask you to log in the first time you push. Follow its instructions for signing in from the terminal; the easiest way is usually the GitHub CLI or the sign-in window that Git opens. Never put your password in your code.'
        ],
        example: 'Your local Git history is your personal diary at home. Pushing to GitHub is putting a copy in a public library, where others can read it and where it is safe if your laptop breaks.',
        projectCode: {
          label: 'Terminal: connect and push to GitHub',
          code: lines(
            'git remote add origin https://github.com/your-name/expense-tracker.git',
            'git branch -M main',
            'git push -u origin main',
            '',
            '# Later, after new commits:',
            'git push',
            '',
            '# On another computer:',
            'git clone https://github.com/your-name/expense-tracker.git'
          )
        },
        code: lines(
          'def repo_url(username, repo):',
          '    return f"https://github.com/{username}/{repo}.git"',
          '',
          'def looks_like_github_url(url):',
          '    return url.startswith("https://github.com/") and url.endswith(".git") and url.count("/") == 4',
          '',
          'url = repo_url("priya-dev", "expense-tracker")',
          'print(url)',
          'print(looks_like_github_url(url))',
          'print(looks_like_github_url("github.com/priya-dev"))'
        ),
        output: lines('https://github.com/priya-dev/expense-tracker.git', 'True', 'False'),
        codeNotes: [
          { line: 2, note: 'The address format GitHub shows for a repository.' },
          { line: 5, note: 'https:// has two slashes, plus one after github.com and one before the repo name: 4 in total.' }
        ],
        tryIt: 'Make the URL for your own GitHub username and a repository called python-projects, and check it with looks_like_github_url.',
        check: {
          question: 'What does git push do?',
          options: ['Uploads your local commits to the online repository', 'Downloads commits from GitHub', 'Creates a new commit'],
          answer: 0,
          why: 'push sends your commits to the remote (GitHub). pull and clone bring commits down from it.'
        }
      },
      {
        title: 'Putting it together: your project on GitHub',
        say: [
          'Let us put your Expense Tracker on GitHub step by step: create .gitignore, initialise Git, make the first commit, create the repository on GitHub, and push.',
          'From now on, work in small steps: one feature, run the tests, commit with a clear message, push. Over the next week, your project\'s history will show a real development story, which recruiters like to see.',
          'Add a short README.md file now, even if it is only one line. On Day 29 you will turn it into a proper project page with features, setup steps and a live link.',
          'In today\'s practice you will write is_good_commit_message and branch_name, two small helpers based on what you learned today.'
        ],
        example: 'A photographer\'s portfolio shows finished photos, and a good one also shows the process. Your GitHub repository shows the finished tracker and, through its commits, how you built it step by step.',
        projectCode: {
          label: 'Terminal: first push of the Expense Tracker',
          code: lines(
            'cd expense-tracker',
            '# create .gitignore and README.md first',
            'git init',
            'git add .',
            'git status            # check .venv and expenses.json are NOT listed',
            'git commit -m "First version of the expense tracker"',
            'git remote add origin https://github.com/your-name/expense-tracker.git',
            'git branch -M main',
            'git push -u origin main'
          )
        },
        code: lines(
          'steps = [',
          '    ("Create .gitignore", True),',
          '    ("git init", True),',
          '    ("git add .", True),',
          '    ("Check git status for secrets", True),',
          '    ("git commit", True),',
          '    ("git push", False),',
          ']',
          'for number, (step, done) in enumerate(steps, start=1):',
          '    print(f"{number}. [{\'x\' if done else \' \'}] {step}")',
          'left = [s for s, d in steps if not d]',
          'print("Next:", left[0] if left else "All done")'
        ),
        output: lines(
          '1. [x] Create .gitignore',
          '2. [x] git init',
          '3. [x] git add .',
          '4. [x] Check git status for secrets',
          '5. [x] git commit',
          '6. [ ] git push',
          'Next: git push'
        ),
        codeNotes: [
          { line: 9, note: 'Unpack each (step, done) tuple while numbering with enumerate.' },
          { line: 12, note: 'Show the first step that is not done yet.' }
        ],
        tryIt: 'Change the last step to True and run it. The output ends with "Next: All done".',
        check: {
          question: 'Before your first commit, what should you check with git status?',
          options: ['That .venv, data files and secrets are not in the list', 'That Python is installed', 'That the internet is working'],
          answer: 0,
          why: 'git status shows what will be committed. Make sure .gitignore is keeping out large folders, personal data and secrets.'
        }
      }
    ],
    summary: [
      'Git records snapshots called commits; GitHub stores repositories online.',
      'Everyday cycle: git status, git add ., git commit -m "clear message".',
      '.gitignore keeps out .venv, __pycache__, data files and secrets like .env.',
      'Work on branches (git switch -c feature/name) and merge when ready.',
      'git push uploads commits; git clone and git pull download them.'
    ],
    projectStep: {
      title: 'Expense Tracker: on GitHub',
      steps: [
        'Create .gitignore with .venv/, __pycache__/, .env and expenses.json.',
        'Run git init, git add . and check git status before your first commit.',
        'Create an expense-tracker repository on GitHub and push to it.',
        'Add a one-line README.md, commit it, and push again.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 23,
    title: 'Planning Your Expense Tracker',
    goal: 'You can turn an idea into user stories, a data shape and a list of small functions, and plan the order to build them.',
    minutes: 30,
    recap: 'Yesterday you learned Git: commits, .gitignore, branches, and pushing your project to GitHub.',
    parts: [
      {
        title: 'Why plan before coding',
        say: [
          'This week you build the full Expense Tracker, the project you will show to employers. Before writing code, good developers spend a little time planning. It feels slower, but it saves a lot of time, because you avoid building the wrong thing or rewriting code again and again.',
          'A simple plan answers four questions. What should the program do for the user? What does the data look like? Which functions do we need? In what order will we build them?',
          'You do not need a long document. A short PLAN.md file in your repository, with a few bullet points under each question, is enough. It also shows recruiters how you think.',
          'The plan is allowed to change. When you learn something new while building, update the plan. It is a guide, not a contract.'
        ],
        example: 'Before building a house, a family sits with an architect: how many rooms, who uses each room, where the kitchen goes. Changing a line on paper costs nothing; moving a wall after it is built costs a lot.',
        code: lines(
          'plan = {',
          '    "What should it do?": ["add an expense", "list expenses", "see totals by category", "save between runs"],',
          '    "Data shape": ["item", "amount", "category", "date"],',
          '    "Functions": ["add_expense", "list_expenses", "category_totals", "save", "load"],',
          '    "Order": ["data + add", "list", "totals", "save/load", "menu"],',
          '}',
          'for question, answers in plan.items():',
          '    print(question)',
          '    for a in answers:',
          '        print("  -", a)'
        ),
        output: lines(
          'What should it do?',
          '  - add an expense',
          '  - list expenses',
          '  - see totals by category',
          '  - save between runs',
          'Data shape',
          '  - item',
          '  - amount',
          '  - category',
          '  - date',
          'Functions',
          '  - add_expense',
          '  - list_expenses',
          '  - category_totals',
          '  - save',
          '  - load',
          'Order',
          '  - data + add',
          '  - list',
          '  - totals',
          '  - save/load',
          '  - menu'
        ),
        codeNotes: [
          { line: 1, note: 'The whole plan as a dictionary: each question with a list of answers.' },
          { line: 7, note: 'Print it like the bullet points of a PLAN.md file.' }
        ],
        tryIt: 'Add one more feature of your own to the "What should it do?" list, like "delete an expense", and run it.',
        check: {
          question: 'Why write a short plan before coding a project?',
          options: ['To avoid building the wrong thing and rewriting code', 'Because Python requires a plan file', 'To make the code run faster'],
          answer: 0,
          why: 'A plan makes you think about what is needed first. Changing a plan is much cheaper than changing finished code.'
        }
      },
      {
        title: 'User stories',
        say: [
          'A user story describes a feature from the user\'s point of view, in one sentence: As a user, I want to do something, so that I get some benefit. For example: As a student, I want to see my spending per category, so that I know where my money goes.',
          'User stories keep you focused on real needs instead of clever code. If a feature does not serve a story, it can probably wait.',
          'Each story should be small enough to build in a few hours. "Manage my money" is too big. "Add an expense with an amount and category" is the right size.',
          'Mark each story as must-have or nice-to-have. Build every must-have first, so you always have a working program. Nice-to-haves come only if there is time. This is how real teams plan too.'
        ],
        example: 'A restaurant does not start by buying fancy equipment. It starts from what customers want: "As a customer, I want my food within 20 minutes, so that I can eat in my lunch break." Everything else is planned around that.',
        code: lines(
          'stories = [',
          '    ("add an expense with amount and category", "so I record every spend", True),',
          '    ("see the total per category", "so I know where money goes", True),',
          '    ("keep my expenses after closing the app", "so I do not lose data", True),',
          '    ("export to a spreadsheet", "so I can make charts", False),',
          ']',
          'for want, benefit, must in stories:',
          '    label = "MUST" if must else "NICE"',
          '    print(f"[{label}] As a student, I want to {want}, {benefit}.")'
        ),
        output: lines(
          '[MUST] As a student, I want to add an expense with amount and category, so I record every spend.',
          '[MUST] As a student, I want to see the total per category, so I know where money goes.',
          '[MUST] As a student, I want to keep my expenses after closing the app, so I do not lose data.',
          '[NICE] As a student, I want to export to a spreadsheet, so I can make charts.'
        ),
        codeNotes: [
          { line: 2, note: 'Each story: what the user wants, why, and whether it is a must-have.' },
          { line: 7, note: 'Unpack each tuple into three names.' }
        ],
        tryIt: 'Print only the must-have stories by adding if must: before the print, or with a list comprehension that filters them.',
        check: {
          question: 'Which is a well-sized user story?',
          options: ['As a user, I want to add an expense with a category, so that I can track spending', 'As a user, I want a complete finance app', 'Write the add_expense function'],
          answer: 0,
          why: 'It is written from the user\'s view, small enough to build quickly, and says why it matters. The last one is a task, not a story.'
        }
      },
      {
        title: 'Designing the data shape',
        say: [
          'Next, decide exactly what one expense looks like. You already know the best shape from Week 2: a dictionary. Choose each key, its type and an example value.',
          'For the tracker: id, a whole number to identify each expense; item, text; amount, a number above 0; category, lower-case text; date, text in YYYY-MM-DD format. All of these save easily to JSON.',
          'Writing a small example record, and a function that checks a record has the right shape, catches mistakes early. If a bug later creates a record without a category, the check finds it straight away.',
          'Agreeing on the data shape first is especially important in teams: the person building the API on Day 27 and the person building the reports must use the same keys.'
        ],
        example: 'A school admission form has fixed fields: name, date of birth, class. Because every form has the same fields, the office can file, search and count them easily. Your data shape is the admission form for an expense.',
        code: lines(
          'EXAMPLE = {"id": 1, "item": "Tea", "amount": 20, "category": "food", "date": "2026-09-28"}',
          'SHAPE = {"id": int, "item": str, "amount": (int, float), "category": str, "date": str}',
          '',
          'def problems(record):',
          '    found = []',
          '    for key, kind in SHAPE.items():',
          '        if key not in record:',
          '            found.append(f"missing {key}")',
          '        elif not isinstance(record[key], kind):',
          '            found.append(f"{key} has the wrong type")',
          '    return found',
          '',
          'print(problems(EXAMPLE))',
          'print(problems({"id": 2, "item": "Bus", "amount": "45"}))'
        ),
        output: lines('[]', "['amount has the wrong type', 'missing category', 'missing date']"),
        codeNotes: [
          { line: 2, note: 'The expected type for each key. (int, float) means either is fine.' },
          { line: 9, note: 'isinstance checks the type; "45" is text, not a number.' }
        ],
        tryIt: 'Add a check that the date has length 10 (like "2026-09-28"), and test it with a record whose date is "28/9".',
        check: {
          question: 'Why store the date as text like "2026-09-28" in this project?',
          options: ['It saves to JSON easily and sorts correctly as text', 'Python has no date type', 'It uses less memory than a number'],
          answer: 0,
          why: 'JSON has no date type (Day 17), and year-month-day text sorts in date order (Day 11).'
        }
      },
      {
        title: 'Breaking the program into small functions',
        say: [
          'Now list the functions you need. Each should do one job, take data as parameters and return a result, so it is easy to test. Only the menu should use input() and print().',
          'For the tracker: add_expense returns a new list with one more expense. sort_by_date returns expenses newest first. category_totals returns a dictionary of totals. summary returns the total, count and biggest item. save and load handle the JSON file.',
          'Write each function\'s name, inputs and output in the plan before coding. This is sometimes called the function\'s signature. It lets you think about the design without getting lost in details.',
          'Notice that most of these functions are things you have already written in earlier lessons. A real project is mostly familiar pieces, put together carefully.'
        ],
        example: 'A kitchen at a busy restaurant has stations: one cook for starters, one for curries, one for breads. Each station has one clear job, and the head chef only coordinates. Your menu function is the head chef; the other functions are the stations.',
        code: lines(
          'def sort_by_date(expenses):',
          '    return sorted(expenses, key=lambda e: e["date"], reverse=True)',
          '',
          'def group_by_category(expenses):',
          '    groups = {}',
          '    for e in expenses:',
          '        groups.setdefault(e["category"], []).append(e["item"])',
          '    return groups',
          '',
          'data = [',
          '    {"item": "Tea", "category": "food", "date": "2026-09-01"},',
          '    {"item": "Bus", "category": "travel", "date": "2026-09-20"},',
          '    {"item": "Lunch", "category": "food", "date": "2026-09-10"},',
          ']',
          'print([e["item"] for e in sort_by_date(data)])',
          'print(group_by_category(data))',
          'print(data[0]["item"])'
        ),
        output: lines("['Bus', 'Lunch', 'Tea']", "{'food': ['Tea', 'Lunch'], 'travel': ['Bus']}", 'Tea'),
        codeNotes: [
          { line: 2, note: 'sorted returns a new list; the original stays in its order.' },
          { line: 7, note: 'setdefault from Day 12: create the list the first time, then append.' },
          { line: 17, note: 'The original list is unchanged.' }
        ],
        tryIt: 'Write a function items_in(expenses, category) that returns only the item names in one category, and test it with "food".',
        check: {
          question: 'In the plan, which function should use input() and print()?',
          options: ['Only the menu', 'Every function', 'category_totals'],
          answer: 0,
          why: 'Keeping input and printing in one place leaves the other functions pure and easy to test.'
        }
      },
      {
        title: 'Planning the build order',
        say: [
          'The last part of the plan is the order. Build in thin, working slices: after each step, the program should run and do something useful. Never write everything and test only at the end.',
          'A good order for the tracker: first the data shape and add_expense with tests. Then listing. Then totals and the summary. Then saving and loading. Then the menu that ties it together. Then nice-to-haves.',
          'After each slice: run the tests, commit with a clear message, and push. If something goes wrong, you only have to look at the last small change.',
          'Estimate each step roughly, in hours, and compare with reality afterwards. You will get better at estimating, and being able to say "that will take about two days" is a skill managers value.'
        ],
        example: 'When painting a room, you do one wall at a time and let it dry before moving on. You never paint all four walls, the ceiling and the door at once and hope. Thin slices are one wall at a time.',
        code: lines(
          'build = [',
          '    ("Data shape + add_expense + tests", 2),',
          '    ("List and format expenses", 1),',
          '    ("Totals, categories, summary", 2),',
          '    ("Save and load with JSON", 1.5),',
          '    ("Menu that asks the user", 1.5),',
          ']',
          'hours = 0',
          'for step, (task, estimate) in enumerate(build, start=1):',
          '    hours += estimate',
          '    print(f"Step {step}: {task} (~{estimate}h, total {hours}h)")'
        ),
        output: lines(
          'Step 1: Data shape + add_expense + tests (~2h, total 2h)',
          'Step 2: List and format expenses (~1h, total 3h)',
          'Step 3: Totals, categories, summary (~2h, total 5h)',
          'Step 4: Save and load with JSON (~1.5h, total 6.5h)',
          'Step 5: Menu that asks the user (~1.5h, total 8.0h)'
        ),
        codeNotes: [
          { line: 9, note: 'enumerate numbers the steps; each step is a (task, hours) tuple.' },
          { line: 10, note: 'A running total of the estimated hours.' }
        ],
        tryIt: 'Add a sixth step "README and deploy" of 2 hours and run it. The total becomes 10.0h: once a decimal like 1.5 is added, the total stays a decimal.',
        check: {
          question: 'What does building in "thin slices" mean?',
          options: ['After each small step, the program runs and does something useful', 'Writing all the code first and testing at the end', 'Making every function one line long'],
          answer: 0,
          why: 'Each slice adds a small working feature, so problems are found early and are easy to trace.'
        }
      },
      {
        title: 'Putting it together: PLAN.md and the first functions',
        say: [
          'Let us finish today by generating a PLAN.md text from the plan data, and writing the first two helper functions from it. On your laptop, you will save this text as PLAN.md in the repository and commit it.',
          'Notice that the plan is short and specific. Someone reading it for one minute understands what the program does, what an expense looks like, and how it will be built.',
          'Tomorrow, you start the build with add_expense and list formatting. Keep the plan open while you work, and tick off steps as you go.',
          'In today\'s practice you will write sort_by_date, which sorts expenses newest first without changing the original, and group_by_category, which groups item names by category.'
        ],
        example: 'A travel itinerary for a trip: where you go each day, what to pack, and what to book first. With it, the trip goes smoothly; without it, you spend the holiday deciding what to do next.',
        code: lines(
          'stories = ["Add an expense", "See totals per category", "Keep data between runs"]',
          'fields = {"id": "int", "item": "str", "amount": "number > 0", "category": "str", "date": "YYYY-MM-DD"}',
          'lines_out = ["# Expense Tracker plan", "", "## User stories"]',
          'lines_out += [f"- As a student, I want to {s.lower()}." for s in stories]',
          'lines_out += ["", "## One expense"]',
          'lines_out += [f"- {k}: {v}" for k, v in fields.items()]',
          'print("\\n".join(lines_out))'
        ),
        output: lines(
          '# Expense Tracker plan',
          '',
          '## User stories',
          '- As a student, I want to add an expense.',
          '- As a student, I want to see totals per category.',
          '- As a student, I want to keep data between runs.',
          '',
          '## One expense',
          '- id: int',
          '- item: str',
          '- amount: number > 0',
          '- category: str',
          '- date: YYYY-MM-DD'
        ),
        codeNotes: [
          { line: 4, note: '+= adds the new lines to the end of the list.' },
          { line: 7, note: 'Join with newlines to get the text of the file.' }
        ],
        tryIt: 'Add a "## Build order" section with your five build steps as a numbered list, using enumerate.',
        check: {
          question: 'What should a good PLAN.md contain?',
          options: ['User stories, the data shape, the functions and the build order', 'All the code of the project', 'Only the project name'],
          answer: 0,
          why: 'A short plan answers what to build, what the data looks like, which functions are needed and in what order.'
        }
      }
    ],
    summary: [
      'Plan before coding: what it does, the data shape, the functions and the order.',
      'User stories: As a user, I want X, so that Y. Build must-haves first.',
      'Define the data shape with example values, and check records against it.',
      'Keep functions small and pure; only the menu uses input() and print().',
      'Build in thin working slices: test, commit and push after each one.'
    ],
    projectStep: {
      title: 'Expense Tracker: write PLAN.md',
      steps: [
        'Write 3 to 5 user stories, marked must-have or nice-to-have.',
        'Describe one expense: id, item, amount, category, date, with types.',
        'List the functions with their inputs and outputs.',
        'Write the build order with rough hours, then commit PLAN.md and push.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 24,
    title: 'Project Build 1: Adding and Listing Expenses',
    goal: 'You can build the core of the Expense Tracker: adding validated expenses, listing them neatly, and a menu that ties it together.',
    minutes: 35,
    recap: 'Yesterday you planned the Expense Tracker: user stories, the data shape, the functions and the build order.',
    parts: [
      {
        title: 'Project structure',
        say: [
          'Today you start the real build. First, set up the files. tracker.py holds the logic: the functions that add, list and calculate. main.py holds the menu with input() and print(). test_tracker.py holds the tests.',
          'This split is the same idea you have heard all month: logic in pure, testable functions, and input and output at the edge. It also means that on Day 27 you can reuse tracker.py unchanged in a web API. Only the "edge" changes from a terminal menu to web requests.',
          'Keep your virtual environment active, and commit after each part of today\'s lesson. By the end of today you will have a program you can actually use every day.',
          'The code samples in this lesson show the functions in one piece so you can run them here. On your laptop, put each function in tracker.py, and the menu in main.py.'
        ],
        example: 'A restaurant has a kitchen and a dining room. The kitchen (tracker.py) cooks; the dining room (main.py) takes orders and serves. You can redesign the dining room, or add home delivery, without changing how the kitchen cooks.',
        projectCode: {
          label: 'Project folder on your laptop',
          code: lines(
            'expense-tracker/',
            '  .gitignore',
            '  PLAN.md',
            '  README.md',
            '  requirements.txt',
            '  tracker.py        # logic: add, list, totals, save, load',
            '  main.py           # menu: input() and print()',
            '  test_tracker.py   # pytest tests'
          )
        },
        code: lines(
          'files = {',
          '    "tracker.py": "logic",',
          '    "main.py": "menu (input and print)",',
          '    "test_tracker.py": "tests",',
          '}',
          'for name, job in files.items():',
          '    print(f"{name:<17}-> {job}")',
          'print("Web API later reuses:", [n for n, j in files.items() if j == "logic"])'
        ),
        output: lines('tracker.py       -> logic', 'main.py          -> menu (input and print)', 'test_tracker.py  -> tests', "Web API later reuses: ['tracker.py']"),
        codeNotes: [
          { line: 8, note: 'Only the logic file is reused by the API on Day 27.' }
        ],
        tryIt: 'On your laptop, create the three empty files in your expense-tracker folder and commit them with the message "Add project structure".',
        check: {
          question: 'Why keep the logic in tracker.py, separate from the menu in main.py?',
          options: ['The logic can be tested and reused, for example by a web API later', 'Python needs at least two files', 'It makes the menu faster'],
          answer: 0,
          why: 'Pure logic functions can be tested easily and reused with a different "edge", like a web API instead of a terminal menu.'
        }
      },
      {
        title: 'add_expense with validation',
        say: [
          'The first function is add_expense. It takes the current list and the new expense\'s details, and returns a new list with the expense added. It does not change the original list, which makes it safe and easy to test.',
          'It also cleans the input: strip spaces from the item, and make the category lower-case, so "Food " and "food" count as the same category. And it gives each expense an id: one more than the largest existing id.',
          'Validation comes first. If the item is empty, or the amount is not a number above 0, it raises a ValueError with a clear message. The menu will catch it and show the message to the user.',
          'Why the largest id plus one, and not the length of the list plus one? If an expense is deleted later, the length shrinks and a new expense could get an id that already exists. Using the largest id avoids that bug.'
        ],
        example: 'A hospital registration desk checks your form (name filled in, age a real number), tidies it (capital letters, no extra spaces), and gives you the next token number. Only then does your form go into the pile.',
        code: lines(
          'def next_id(expenses):',
          '    return max((e["id"] for e in expenses), default=0) + 1',
          '',
          'def add_expense(expenses, item, amount, category, date):',
          '    item = item.strip()',
          '    if not item:',
          '        raise ValueError("item is required")',
          '    if not isinstance(amount, (int, float)) or amount <= 0:',
          '        raise ValueError("amount must be more than 0")',
          '    new = {"id": next_id(expenses), "item": item, "amount": amount,',
          '           "category": category.strip().lower(), "date": date}',
          '    return expenses + [new]',
          '',
          'data = add_expense([], " Tea ", 20, "Food ", "2026-09-28")',
          'data = add_expense(data, "Bus", 45, "travel", "2026-09-28")',
          'print(data[0])',
          'print([e["id"] for e in data])',
          'try:',
          '    add_expense(data, "  ", 10, "food", "2026-09-28")',
          'except ValueError as error:',
          '    print("Refused:", error)'
        ),
        output: lines(
          "{'id': 1, 'item': 'Tea', 'amount': 20, 'category': 'food', 'date': '2026-09-28'}",
          '[1, 2]',
          'Refused: item is required'
        ),
        codeNotes: [
          { line: 2, note: 'The largest id plus one. default=0 handles an empty list.' },
          { line: 11, note: 'Clean the category so "Food " becomes "food".' },
          { line: 12, note: 'Return a new list; the original is not changed.' }
        ],
        tryIt: 'Try add_expense(data, "Lunch", -5, "food", "2026-09-28") inside the try, and check the message says the amount must be more than 0.',
        check: {
          question: 'Why does add_expense use the largest id plus one instead of len(expenses) + 1?',
          options: ['After a deletion, len + 1 could repeat an id that already exists', 'max is faster than len', 'len does not work on lists'],
          answer: 0,
          why: 'If expense 1 of [1, 2] is deleted, len + 1 gives 2 again. The largest id plus one gives 3, which is always new.'
        }
      },
      {
        title: 'Listing expenses neatly',
        say: [
          'Next, the list. format_expense turns one expense into a readable line, and list_lines turns the whole list into lines, newest first, with a header. They return text; the menu prints it.',
          'Use the f-string widths from Day 13 so the columns line up. Money always gets two decimal places. An empty list gets a friendly message instead of a blank screen.',
          'Handling the empty case is a small detail that makes a big difference to how finished your program feels. The first thing any new user sees is an empty list.',
          'Remember to add tests for these functions: one with a few expenses, and one with an empty list.'
        ],
        example: 'A bank statement page: a header row with Date, Description and Amount, then one aligned row per transaction, newest first. When there are no transactions, it says so clearly instead of showing an empty table.',
        code: lines(
          'def format_expense(e):',
          '    return f"{e[\'date\']}  {e[\'item\']:<12}{e[\'category\']:<10}{e[\'amount\']:>9.2f}"',
          '',
          'def list_lines(expenses):',
          '    if not expenses:',
          '        return ["No expenses yet. Choose 1 to add one."]',
          '    header = f"{\'Date\':<12}{\'Item\':<12}{\'Category\':<10}{\'Amount\':>9}"',
          '    rows = [format_expense(e) for e in sorted(expenses, key=lambda e: e["date"], reverse=True)]',
          '    return [header, "-" * len(header)] + rows',
          '',
          'data = [',
          '    {"id": 1, "item": "Tea", "amount": 20, "category": "food", "date": "2026-09-27"},',
          '    {"id": 2, "item": "Metro card", "amount": 500, "category": "travel", "date": "2026-09-28"},',
          ']',
          'print("\\n".join(list_lines(data)))',
          'print("\\n".join(list_lines([])))'
        ),
        output: lines(
          'Date        Item        Category     Amount',
          '-------------------------------------------',
          '2026-09-28  Metro card  travel       500.00',
          '2026-09-27  Tea         food          20.00',
          'No expenses yet. Choose 1 to add one.'
        ),
        codeNotes: [
          { line: 2, note: 'Fixed widths so every row lines up; 2 decimals for money.' },
          { line: 6, note: 'A friendly message for the empty case.' },
          { line: 8, note: 'Newest first.' }
        ],
        tryIt: 'Add a third expense with a long item name like "Birthday gift for Amma" and run it. Notice the columns shift. Try slicing the name to 11 characters in format_expense: e[\'item\'][:11].',
        check: {
          question: 'Why does list_lines return lines instead of printing them?',
          options: ['So it can be tested and reused; the menu decides when to print', 'Because print does not work with lists', 'To make the list shorter'],
          answer: 0,
          why: 'Returning text keeps the function pure. Tests can check the lines, and the menu or an API can use them.'
        }
      },
      {
        title: 'The menu in main.py',
        say: [
          'Now the menu connects the user to the logic. It reads a choice, asks for the details, calls add_expense or list_lines, and prints the result. It is the only part that uses input() and print().',
          'When add_expense raises a ValueError, the menu catches it and shows the message, then returns to the menu. The user can try again; the program never crashes because of bad typing.',
          'The amount typed by the user is text, so the menu converts it with the parse_amount function from earlier lessons. If it returns None, the menu shows a friendly message instead of calling add_expense.',
          'Here, the menu reads from a list of pretend answers so it can run in the lesson editor. On your laptop, replace next(answers) with input("...") and it becomes a real interactive program.'
        ],
        example: 'A receptionist at a clinic talks to patients, writes down their details and passes the form to the doctor. The receptionist does not examine anyone. The menu is the receptionist; the tracker functions are the doctor.',
        projectCode: {
          label: 'main.py on your laptop',
          code: lines(
            'from datetime import date',
            'from tracker import add_expense, list_lines, parse_amount',
            '',
            'def main():',
            '    expenses = []',
            '    while True:',
            '        choice = input("1. Add  2. List  3. Quit > ").strip()',
            '        if choice == "1":',
            '            item = input("Item: ")',
            '            amount = parse_amount(input("Amount: "))',
            '            category = input("Category: ")',
            '            if amount is None:',
            '                print("Please type a number above 0.")',
            '                continue',
            '            try:',
            '                expenses = add_expense(expenses, item, amount, category, date.today().isoformat())',
            '                print("Added.")',
            '            except ValueError as error:',
            '                print("Not added:", error)',
            '        elif choice == "2":',
            '            print("\\n".join(list_lines(expenses)))',
            '        elif choice == "3":',
            '            break',
            '',
            'if __name__ == "__main__":',
            '    main()'
          )
        },
        code: lines(
          'def parse_amount(text):',
          '    try:',
          '        value = float(text.strip())',
          '    except ValueError:',
          '        return None',
          '    return value if value > 0 else None',
          '',
          'def add_expense(expenses, item, amount, category, date):',
          '    if not item.strip():',
          '        raise ValueError("item is required")',
          '    new_id = max((e["id"] for e in expenses), default=0) + 1',
          '    return expenses + [{"id": new_id, "item": item.strip(), "amount": amount, "category": category.strip().lower(), "date": date}]',
          '',
          'answers = iter(["1", "Tea", "20", "food", "1", "Juice", "abc", "food", "1", " ", "30", "food", "2", "3"])',
          'expenses = []',
          'while True:',
          '    choice = next(answers).strip()',
          '    if choice == "1":',
          '        item, amount, category = next(answers), parse_amount(next(answers)), next(answers)',
          '        if amount is None:',
          '            print("Please type a number above 0.")',
          '            continue',
          '        try:',
          '            expenses = add_expense(expenses, item, amount, category, "2026-09-28")',
          '            print("Added.")',
          '        except ValueError as error:',
          '            print("Not added:", error)',
          '    elif choice == "2":',
          '        for e in expenses:',
          '            print(e["id"], e["item"], e["amount"])',
          '    elif choice == "3":',
          '        print("Bye!")',
          '        break'
        ),
        output: lines('Added.', 'Please type a number above 0.', 'Not added: item is required', '1 Tea 20.0', 'Bye!'),
        codeNotes: [
          { line: 14, note: 'Pretend typing: a good expense, a bad amount, an empty item, then list and quit.' },
          { line: 21, note: 'Bad amount: friendly message, back to the menu.' },
          { line: 27, note: 'add_expense refused it: show why, back to the menu.' }
        ],
        tryIt: 'Add another good expense to the pretend answers before "2", for example "1", "Bus", "45", "travel", and run it. The list shows two expenses.',
        check: {
          question: 'What does the menu do when add_expense raises a ValueError?',
          options: ['Shows the error message and returns to the menu', 'Crashes the program', 'Adds the expense anyway'],
          answer: 0,
          why: 'The menu catches the ValueError, shows why the expense was refused, and carries on so the user can try again.'
        }
      },
      {
        title: 'Testing what you built',
        say: [
          'Before committing, test today\'s functions. The most important checks: an expense is added with a clean item and category; ids go up; the original list is not changed; an empty item and a bad amount are refused; and listing an empty list gives the friendly message.',
          'Run pytest after every change. If a test fails, read its name and message first; they tell you what broke.',
          'Once the tests pass, commit: git add ., git commit -m "Add expenses and list them", git push. Your GitHub now shows a real, tested feature.',
          'The sample below runs these checks here in the lesson editor. On your laptop they go in test_tracker.py as test_ functions.'
        ],
        example: 'A tailor checks a shirt before handing it over: both sleeves the same length, all buttons sewn on, no loose threads. Checking before delivery is much better than the customer finding the problem.',
        code: lines(
          'def add_expense(expenses, item, amount, category, date):',
          '    item = item.strip()',
          '    if not item:',
          '        raise ValueError("item is required")',
          '    if not isinstance(amount, (int, float)) or amount <= 0:',
          '        raise ValueError("amount must be more than 0")',
          '    new_id = max((e["id"] for e in expenses), default=0) + 1',
          '    return expenses + [{"id": new_id, "item": item, "amount": amount, "category": category.strip().lower(), "date": date}]',
          '',
          'def refused(**details):',
          '    try:',
          '        add_expense([], **details)',
          '    except ValueError:',
          '        return True',
          '    return False',
          '',
          'first = add_expense([], " Tea ", 20, " FOOD", "2026-09-28")',
          'second = add_expense(first, "Bus", 45, "travel", "2026-09-28")',
          'checks = {',
          '    "item and category are cleaned": first[0]["item"] == "Tea" and first[0]["category"] == "food",',
          '    "ids go up": [e["id"] for e in second] == [1, 2],',
          '    "original list unchanged": len(first) == 1,',
          '    "empty item refused": refused(item=" ", amount=5, category="x", date="d"),',
          '    "negative amount refused": refused(item="Tea", amount=-5, category="x", date="d"),',
          '    "text amount refused": refused(item="Tea", amount="20", category="x", date="d"),',
          '}',
          'for name, ok in checks.items():',
          '    print("PASS" if ok else "FAIL", name)'
        ),
        output: lines(
          'PASS item and category are cleaned',
          'PASS ids go up',
          'PASS original list unchanged',
          'PASS empty item refused',
          'PASS negative amount refused',
          'PASS text amount refused'
        ),
        codeNotes: [
          { line: 10, note: '**details passes named arguments through to add_expense.' },
          { line: 19, note: 'Each check has a name, like a pytest test function.' }
        ],
        tryIt: 'Break add_expense on purpose by removing .lower() from the category, and run it. The first check now says FAIL. Put it back.',
        check: {
          question: 'Which check protects against add_expense changing the list it was given?',
          options: ['"original list unchanged"', '"ids go up"', '"empty item refused"'],
          answer: 0,
          why: 'It checks that the first list still has one expense after a second one was added to a new list.'
        }
      },
      {
        title: 'Putting it together: today\'s working program',
        say: [
          'At the end of today, your Expense Tracker can add validated expenses and list them neatly, from a real menu, with tests. That is already a useful program and a genuine first project.',
          'Look back at how you got here: every function today uses ideas from earlier days. Strings from Day 3, decisions from Day 5, functions from Day 7, dictionaries from Day 10, sorting from Day 11, f-strings from Day 13, errors from Day 14. Projects are built from fundamentals.',
          'Tomorrow you add the rest of the must-haves: a summary, totals per category, and saving to JSON so the data survives between runs.',
          'In today\'s practice you will write add_expense, which returns a new list with a clean, numbered expense, and format_expense, which returns a neat line of text.'
        ],
        example: 'After the first day of building a house, the walls of one room are up. You cannot live in it yet, but you can stand inside and see it is real. Tomorrow comes the roof.',
        code: lines(
          'def add_expense(expenses, item, amount, category, date):',
          '    new_id = max((e["id"] for e in expenses), default=0) + 1',
          '    return expenses + [{"id": new_id, "item": item.strip(), "amount": amount, "category": category.strip().lower(), "date": date}]',
          '',
          'def format_expense(e):',
          '    return f"{e[\'item\']} - Rs {e[\'amount\']:.2f} ({e[\'category\']})"',
          '',
          'expenses = []',
          'for item, amount, category in [("Tea", 20, "Food"), ("Metro", 30, "travel"), ("Notebook", 60, "study")]:',
          '    expenses = add_expense(expenses, item, amount, category, "2026-09-28")',
          'for e in expenses:',
          '    print(e["id"], format_expense(e))',
          'print("Categories so far:", sorted({e["category"] for e in expenses}))'
        ),
        output: lines('1 Tea - Rs 20.00 (food)', '2 Metro - Rs 30.00 (travel)', '3 Notebook - Rs 60.00 (study)', "Categories so far: ['food', 'study', 'travel']"),
        codeNotes: [
          { line: 9, note: 'Add three expenses in a loop, each time getting a new list.' },
          { line: 13, note: 'A set comprehension gives the unique categories.' }
        ],
        tryIt: 'Add a fourth expense in the "Food" category with a capital F. The category list stays at three, because add_expense makes it lower-case.',
        check: {
          question: 'After today, what can the Expense Tracker do?',
          options: ['Add validated expenses and list them from a menu, with tests', 'Only print a title', 'Save data to a web server'],
          answer: 0,
          why: 'Today built adding with validation, neat listing, the menu and tests. Summaries and saving come tomorrow, and the web API on Day 27.'
        }
      }
    ],
    summary: [
      'tracker.py holds pure logic, main.py the menu, test_tracker.py the tests.',
      'add_expense validates, cleans the input, gives a new id, and returns a new list.',
      'Listing returns aligned lines, newest first, with a friendly empty message.',
      'The menu catches ValueError and shows the reason, so bad typing never crashes it.',
      'Test, commit and push after each working step.'
    ],
    projectStep: {
      title: 'Expense Tracker: build step 1',
      steps: [
        'Write add_expense and list_lines in tracker.py.',
        'Write the menu in main.py with options Add, List and Quit.',
        'Write at least five tests in test_tracker.py and run pytest.',
        'Commit with "Add expenses and list them" and push to GitHub.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 25,
    title: 'Project Build 2: Summaries and Saving',
    goal: 'You can add a summary, totals per category and a monthly filter to the tracker, and save and load its data as JSON.',
    minutes: 35,
    recap: 'Yesterday you built the core of the Expense Tracker: adding validated expenses, listing them, a menu and tests.',
    parts: [
      {
        title: 'A summary of spending',
        say: [
          'Today the tracker becomes truly useful. First, a summary: the total spent, the number of expenses and the biggest single expense. These three numbers answer the question every user asks first: how am I doing?',
          'The summary function returns a dictionary, not text. That keeps it flexible: the menu can print it, a test can check it, and on Day 27 the web API can send it as JSON without any changes.',
          'Think about the empty case again. With no expenses, the total is 0, the count is 0, and there is no biggest expense, so it is None. max() on an empty list would crash, so check first.',
          'Round the total to two decimal places, because amounts can be decimals and you learned on Day 4 that decimals are not perfectly exact.'
        ],
        example: 'The first screen of a banking app shows your balance, the number of transactions this month and your largest payment. Before any details, it gives you a quick picture. summary() is that first screen.',
        code: lines(
          'def summary(expenses):',
          '    if not expenses:',
          '        return {"total": 0, "count": 0, "biggest": None}',
          '    biggest = max(expenses, key=lambda e: e["amount"])',
          '    return {',
          '        "total": round(sum(e["amount"] for e in expenses), 2),',
          '        "count": len(expenses),',
          '        "biggest": biggest["item"],',
          '    }',
          '',
          'data = [{"item": "Tea", "amount": 20}, {"item": "Rent", "amount": 8000}, {"item": "Bus", "amount": 45.5}]',
          'print(summary(data))',
          'print(summary([]))'
        ),
        output: lines("{'total': 8065.5, 'count': 3, 'biggest': 'Rent'}", "{'total': 0, 'count': 0, 'biggest': None}"),
        codeNotes: [
          { line: 2, note: 'The empty case first, so max() never sees an empty list.' },
          { line: 4, note: 'max with a key returns the whole expense with the largest amount.' },
          { line: 6, note: 'Round the total to 2 decimal places.' }
        ],
        tryIt: 'Add an "average" key to the summary, rounded to 2 places. For the data above it should be 2688.5.',
        check: {
          question: 'Why does summary() return a dictionary instead of printing?',
          options: ['So the menu, tests and later the web API can all use the same result', 'Because print cannot show numbers', 'Dictionaries are faster than print'],
          answer: 0,
          why: 'A returned dictionary is data. Anyone can print it, test it or send it as JSON.'
        }
      },
      {
        title: 'Totals per category',
        say: [
          'Next, where does the money go? category_totals uses the grouping pattern from Day 10: a dictionary where each category is a key and its total is the value.',
          'To make the result easy to read, the menu shows categories sorted from the biggest spend to the smallest, with each category\'s share of the total as a percentage.',
          'The percentage uses the :.0% or :.1% format from Day 13. Remember to guard against dividing by zero when there are no expenses at all.',
          'This feature is the one users find most eye-opening. Seeing that food takes 40 percent of your spending is exactly the kind of insight that makes an app worth using.'
        ],
        example: 'A monthly pie chart in a budgeting app: food 40 percent, rent 35 percent, travel 15 percent, other 10 percent. The numbers behind the chart are exactly what category_totals calculates.',
        code: lines(
          'def category_totals(expenses):',
          '    totals = {}',
          '    for e in expenses:',
          '        totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]',
          '    return totals',
          '',
          'def category_lines(expenses):',
          '    totals = category_totals(expenses)',
          '    grand = sum(totals.values())',
          '    if grand == 0:',
          '        return ["Nothing spent yet."]',
          '    ordered = sorted(totals.items(), key=lambda pair: pair[1], reverse=True)',
          '    return [f"{cat:<10}{amount:>9.2f}  {amount / grand:>4.0%}" for cat, amount in ordered]',
          '',
          'data = [',
          '    {"category": "food", "amount": 400}, {"category": "rent", "amount": 350},',
          '    {"category": "travel", "amount": 150},',
          '    {"category": "fun", "amount": 100},',
          ']',
          'print("\\n".join(category_lines(data)))',
          'print(category_lines([]))'
        ),
        output: lines('food         400.00   40%', 'rent         350.00   35%', 'travel       150.00   15%', 'fun          100.00   10%', "['Nothing spent yet.']"),
        codeNotes: [
          { line: 4, note: 'The grouping pattern: current total (0 if new) plus this amount.' },
          { line: 12, note: 'Sort the (category, amount) pairs by amount, biggest first.' },
          { line: 13, note: 'Share of the total as a percentage with no decimals.' }
        ],
        tryIt: 'Change :>4.0% to :>6.1% and run it. The percentages now have one decimal place, like 40.0%.',
        check: {
          question: 'Why does category_lines check if grand == 0?',
          options: ['To avoid dividing by zero when nothing has been spent', 'Because sorted fails on zero', 'To hide small categories'],
          answer: 0,
          why: 'The percentage divides by the grand total. With no spending, that would be a division by zero.'
        }
      },
      {
        title: 'Filtering by month',
        say: [
          'Most people think about spending month by month. Because the date is stored as "YYYY-MM-DD" text, the month is simply the first seven characters: "2026-09". A slice from Day 3 is all you need.',
          'in_month returns only the expenses in a given month. The summary and category totals can then be run on that smaller list, without changing either function. This is the power of small functions that take a list and return a result: they combine easily.',
          'To offer the user a list of months to choose from, collect the unique months with a set comprehension and sort them.',
          'Again, think about edge cases: a month with no expenses should give an empty list, and the summary of an empty list already works because you handled it earlier.'
        ],
        example: 'Your phone\'s photo gallery groups pictures by month. It does not store them in separate folders; it just looks at each photo\'s date. in_month looks at each expense\'s date in the same way.',
        code: lines(
          'def in_month(expenses, month):',
          '    return [e for e in expenses if e["date"][:7] == month]',
          '',
          'def months(expenses):',
          '    return sorted({e["date"][:7] for e in expenses})',
          '',
          'data = [',
          '    {"item": "Tea", "amount": 20, "date": "2026-08-30"},',
          '    {"item": "Rent", "amount": 8000, "date": "2026-09-01"},',
          '    {"item": "Bus", "amount": 45, "date": "2026-09-15"},',
          ']',
          'print(months(data))',
          'september = in_month(data, "2026-09")',
          'print([e["item"] for e in september])',
          'print(sum(e["amount"] for e in september))',
          'print(in_month(data, "2026-12"))'
        ),
        output: lines("['2026-08', '2026-09']", "['Rent', 'Bus']", '8045', '[]'),
        codeNotes: [
          { line: 2, note: 'The first 7 characters of "2026-09-15" are "2026-09".' },
          { line: 5, note: 'A set of months, sorted into a list.' },
          { line: 16, note: 'A month with no expenses gives an empty list, not an error.' }
        ],
        tryIt: 'Add an expense dated "2026-10-02" and run it. A third month appears in the months list.',
        check: {
          question: 'For an expense dated "2026-09-15", what is e["date"][:7]?',
          options: ['"2026-09"', '"2026-09-1"', '"15"'],
          answer: 0,
          why: 'The slice takes characters 0 to 6: the year, the dash and the month.'
        }
      },
      {
        title: 'Saving and loading with JSON',
        say: [
          'Now the most important must-have: the data should still be there after the program closes. You built this on Day 17; today you put it into tracker.py.',
          'save writes the whole list to a JSON file with indent=2. load reads it back, and returns an empty list for a missing file, broken JSON, or data that is not a list. The menu calls load() when it starts and save() after every change.',
          'Saving after every change is simple and safe for a small app: if the program crashes or the laptop turns off, at most one change is lost.',
          'The file name is a parameter with a default, like load(path="expenses.json"). Tests can then pass a temporary file name, so they never touch your real data.'
        ],
        example: 'A good notes app saves each note as you type. You never press "save", and you never lose a note when your phone restarts. Saving after every change gives your tracker the same reliability.',
        code: lines(
          'import json',
          '',
          'def save(expenses, path="expenses.json"):',
          '    with open(path, "w") as f:',
          '        json.dump(expenses, f, indent=2)',
          '',
          'def load(path="expenses.json"):',
          '    try:',
          '        with open(path) as f:',
          '            data = json.load(f)',
          '    except (FileNotFoundError, ValueError):',
          '        return []',
          '    return data if isinstance(data, list) else []',
          '',
          'data = [{"id": 1, "item": "Tea", "amount": 20, "category": "food", "date": "2026-09-28"}]',
          'save(data, "test_expenses.json")',
          'print(load("test_expenses.json") == data)',
          'print(load("does_not_exist.json"))',
          'with open("broken.json", "w") as f:',
          '    f.write("{not json")',
          'print(load("broken.json"))'
        ),
        output: lines('True', '[]', '[]'),
        codeNotes: [
          { line: 3, note: 'The path has a default, so tests can use a different file.' },
          { line: 11, note: 'A missing file or broken JSON gives an empty list.' },
          { line: 17, note: 'The round trip: what we load equals what we saved.' }
        ],
        tryIt: 'Write the text "[1, 2" (a JSON list with no closing bracket) into broken.json instead, and check load still returns [].',
        check: {
          question: 'Why does load() take the file path as a parameter with a default?',
          options: ['So tests can use a separate file and never touch the real data', 'Because json.load needs two parameters', 'To load two files at once'],
          answer: 0,
          why: 'The real app uses the default file. Tests pass a different path, keeping your real expenses safe.'
        }
      },
      {
        title: 'Connecting it all in the menu',
        say: [
          'The menu grows to five options: Add, List, Summary, By category, and Quit. At the start it calls load(). After a successful add, it calls save().',
          'Each option is a few lines, because the real work happens in tracker.py. This is what good structure looks like: when you add a feature, you write one function and one menu option.',
          'Try your program for real on your laptop: add a few expenses, quit, run it again and check they are still there. That moment, when your own program remembers your data, is a big milestone.',
          'The sample below runs the same menu with pretend typing, including a restart of the program, to show that the data survives.'
        ],
        example: 'Think of a shop: the shelves (the JSON file) keep the stock overnight. Each morning the shopkeeper opens the shop (load), serves customers and restocks (add and save), and closes at night. The stock is there again tomorrow.',
        code: lines(
          'import json',
          'PATH = "demo_expenses.json"',
          'open(PATH, "w").close()  # start with an empty file on every Run',
          '',
          'def load():',
          '    try:',
          '        with open(PATH) as f:',
          '            data = json.load(f)',
          '    except (FileNotFoundError, ValueError):',
          '        return []',
          '    return data if isinstance(data, list) else []',
          '',
          'def save(expenses):',
          '    with open(PATH, "w") as f:',
          '        json.dump(expenses, f)',
          '',
          'def run_menu(typed):',
          '    answers = iter(typed)',
          '    expenses = load()',
          '    while True:',
          '        choice = next(answers)',
          '        if choice == "1":',
          '            expenses.append({"item": next(answers), "amount": float(next(answers))})',
          '            save(expenses)',
          '        elif choice == "3":',
          '            total = sum(e["amount"] for e in expenses)',
          '            print(f"{len(expenses)} expenses, total Rs {total:.2f}")',
          '        elif choice == "5":',
          '            return',
          '',
          'run_menu(["1", "Tea", "20", "1", "Bus", "45", "3", "5"])',
          'print("--- program closed and opened again ---")',
          'run_menu(["3", "1", "Lunch", "120", "3", "5"])'
        ),
        output: lines('2 expenses, total Rs 65.00', '--- program closed and opened again ---', '2 expenses, total Rs 65.00', '3 expenses, total Rs 185.00'),
        codeNotes: [
          { line: 19, note: 'Load saved data when the program starts.' },
          { line: 24, note: 'Save straight after every change.' },
          { line: 33, note: 'A second "run" starts with the saved data, not an empty list.' }
        ],
        tryIt: 'Remove the save(expenses) line and run it. After the restart, the program only knows about Lunch. Put the line back.',
        check: {
          question: 'Where does the menu call save()?',
          options: ['Straight after every successful change', 'Only when the user quits', 'Never; the data stays in memory'],
          answer: 0,
          why: 'Saving after each change means a crash or power cut loses at most one change.'
        }
      },
      {
        title: 'Putting it together: all must-haves done',
        say: [
          'Your Expense Tracker now meets every must-have user story from your plan: add expenses, see totals per category, and keep data between runs. It also has a summary and a monthly filter. Update PLAN.md to tick them off.',
          'Before committing, add tests: summary of an empty list, category totals, in_month with a month that has no expenses, and a save-load round trip using a test file. Run pytest, then commit and push.',
          'Tomorrow you learn to call web APIs, and on Day 27 you turn the tracker into a small web API with FastAPI, reusing tracker.py as it is. That is the version you will put online on Day 29.',
          'In today\'s practice you will write summary, which returns the total, count and biggest item, and category_totals, which returns the total per category.'
        ],
        example: 'A house with walls, a roof, doors and electricity is ready to live in, even before the paint and decoration. Your tracker is now ready to use every day; the next days add the finishing touches that make it shine.',
        code: lines(
          'def summary(expenses):',
          '    if not expenses:',
          '        return {"total": 0, "count": 0, "biggest": None}',
          '    return {"total": sum(e["amount"] for e in expenses), "count": len(expenses),',
          '            "biggest": max(expenses, key=lambda e: e["amount"])["item"]}',
          '',
          'def category_totals(expenses):',
          '    totals = {}',
          '    for e in expenses:',
          '        totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]',
          '    return totals',
          '',
          'def in_month(expenses, month):',
          '    return [e for e in expenses if e["date"][:7] == month]',
          '',
          'data = [',
          '    {"item": "Tea", "amount": 20, "category": "food", "date": "2026-09-03"},',
          '    {"item": "Rent", "amount": 8000, "category": "home", "date": "2026-09-01"},',
          '    {"item": "Lunch", "amount": 150, "category": "food", "date": "2026-09-10"},',
          '    {"item": "Train", "amount": 600, "category": "travel", "date": "2026-10-02"},',
          ']',
          'sept = in_month(data, "2026-09")',
          'print(summary(sept))',
          'print(category_totals(sept))',
          'stories = {"add expenses": True, "totals per category": True, "keep data": True}',
          'print("Must-haves done:", all(stories.values()))'
        ),
        output: lines("{'total': 8170, 'count': 3, 'biggest': 'Rent'}", "{'food': 170, 'home': 8000}", 'Must-haves done: True'),
        codeNotes: [
          { line: 22, note: 'Filter by month first, then reuse the other functions unchanged.' },
          { line: 26, note: 'all() is True only if every value is True.' }
        ],
        tryIt: 'Run the summary for "2026-10" instead. It should show a total of 600, 1 expense, and Train as the biggest.',
        check: {
          question: 'Why can summary() and category_totals() work on one month without any changes?',
          options: ['They take any list of expenses, so a filtered list works the same way', 'They check the month themselves', 'Python filters dates automatically'],
          answer: 0,
          why: 'Small functions that take a list and return a result combine easily: filter first, then summarise the smaller list.'
        }
      }
    ],
    summary: [
      'summary() returns total, count and biggest, and handles an empty list.',
      'category_totals() groups spending; show it biggest first with percentages.',
      'The month is e["date"][:7]; in_month() filters, and other functions work on the result.',
      'save() and load() keep data in JSON; load handles missing and broken files.',
      'Load at start, save after every change, test everything, then commit and push.'
    ],
    projectStep: {
      title: 'Expense Tracker: build step 2',
      steps: [
        'Add summary, category_totals, in_month, save and load to tracker.py.',
        'Add Summary and By category options to the menu; load at start and save after every add.',
        'Add tests for the empty cases and a save-load round trip, and run pytest.',
        'Tick off the must-haves in PLAN.md, commit and push.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 26,
    title: 'Calling Web APIs',
    goal: 'You can explain what a web API is, call one with the requests library, check the status code, and read the JSON answer safely.',
    minutes: 30,
    recap: 'Yesterday you finished the Expense Tracker\'s must-haves: summaries, category totals, a monthly filter and JSON saving.',
    parts: [
      {
        title: 'What a web API is',
        say: [
          'Most apps do not do everything themselves. A travel app gets flight prices from airlines, a shopping app gets payment results from a bank, a weather widget gets the forecast from a weather service. They talk to each other through web APIs.',
          'API stands for Application Programming Interface. A web API is a web address that answers programs instead of people. Your program sends a request to a URL, and the API sends back data, usually as JSON, which you learned on Day 17.',
          'Every request has a method. GET means "give me data". POST means "here is new data, please save it". There are others, like PUT and DELETE, but GET and POST are the ones you will use most.',
          'Tomorrow you build your own API for the Expense Tracker. Today you learn the other side: how a program calls an API and uses the answer. Understanding both sides is exactly what backend developer jobs ask for.'
        ],
        example: 'An API is like a restaurant waiter. You do not walk into the kitchen; you give your order to the waiter in a standard way, and the waiter brings back your food. The kitchen can change completely, and as long as the waiter takes the same orders, you do not notice.',
        code: lines(
          'import json',
          '# What an API answer to GET /rates?base=INR might look like:',
          'answer_text = \'{"base": "INR", "date": "2026-09-28", "rates": {"USD": 0.012, "EUR": 0.011}}\'',
          'data = json.loads(answer_text)',
          'print(data["base"])',
          'print(data["rates"]["USD"])',
          'print(round(5000 * data["rates"]["USD"], 2), "USD")'
        ),
        output: lines('INR', '0.012', '60.0 USD'),
        codeNotes: [
          { line: 3, note: 'API answers are JSON text. This one is written by hand so it runs here.' },
          { line: 4, note: 'json.loads turns it into a normal dictionary.' },
          { line: 6, note: 'A dictionary inside a dictionary: read it in two steps.' }
        ],
        tryIt: 'Convert 5000 rupees to euros instead, using data["rates"]["EUR"]. The answer should be 55.0.',
        check: {
          question: 'What does a web API usually send back?',
          options: ['Data, often as JSON', 'A finished web page for people', 'A Python file'],
          answer: 0,
          why: 'An API answers programs, not people, so it sends data, most often as JSON text.'
        }
      },
      {
        title: 'URLs, parameters and status codes',
        say: [
          'An API request goes to a URL, like https://api.example.com/rates. Extra details go in query parameters after a question mark: ?base=INR&symbols=USD. Each parameter is a name and a value, joined with &.',
          'Every answer comes with a status code, a three-digit number that says how it went. 200 means OK. 201 means something was created. 400 means your request was wrong. 401 or 403 means you are not allowed. 404 means not found. 500 means the server had a problem.',
          'A simple rule: codes starting with 2 are success, codes starting with 4 are the caller\'s mistake, and codes starting with 5 are the server\'s mistake. Always check the status before using the answer.',
          'Python\'s urllib.parse module can build a URL with parameters correctly, including spaces and special characters that need encoding.'
        ],
        example: 'Status codes are like the replies at a shop counter. 200: here you go. 404: sorry, we do not have that item. 400: I did not understand your order. 500: our machine is broken, please try later. You react differently to each.',
        code: lines(
          'from urllib.parse import urlencode',
          'base = "https://api.example.com/search"',
          'params = {"q": "python jobs", "city": "Pune", "page": 2}',
          'print(base + "?" + urlencode(params))',
          '',
          'def status_message(code):',
          '    if 200 <= code < 300:',
          '        return "OK"',
          '    if code == 404:',
          '        return "Not found"',
          '    if 400 <= code < 500:',
          '        return "Problem with our request"',
          '    return "Server problem, try again later"',
          '',
          'for code in [200, 201, 404, 400, 503]:',
          '    print(code, status_message(code))'
        ),
        output: lines(
          'https://api.example.com/search?q=python+jobs&city=Pune&page=2',
          '200 OK',
          '201 OK',
          '404 Not found',
          '400 Problem with our request',
          '503 Server problem, try again later'
        ),
        codeNotes: [
          { line: 4, note: 'urlencode joins the parameters and encodes the space as +.' },
          { line: 7, note: 'Any code from 200 to 299 is a success.' }
        ],
        tryIt: 'Add a check for 401 and 403 that returns "Not allowed: check your API key", before the general 400 check.',
        check: {
          question: 'What does status code 404 mean?',
          options: ['Not found', 'Success', 'The server crashed'],
          answer: 0,
          why: '404 means the thing you asked for does not exist at that URL. Server crashes are 500-level codes.'
        }
      },
      {
        title: 'Calling an API with requests',
        say: [
          'On your laptop, the easiest way to call an API is the requests library: pip install requests in your virtual environment. requests.get(url, params=..., timeout=10) sends a GET request and gives back a response object.',
          'The response has response.status_code, the number, and response.json(), which turns the JSON answer into Python data. response.raise_for_status() raises an error if the status is 400 or above, which is a quick way to stop on failure.',
          'Always set a timeout. Without one, if the server never answers, your program waits forever. timeout=10 means give up after 10 seconds.',
          'The lesson editor cannot reach the internet, so the sample below uses a small pretend response object that behaves like the real one. The projectCode box shows the real code for your laptop.'
        ],
        example: 'Calling an API with requests is like ordering on a food app. You send the order, wait a limited time, check the order status (delivered or failed), and only then unpack the food. You do not wait at the door forever.',
        projectCode: {
          label: 'On your laptop: pip install requests',
          code: lines(
            'import requests',
            '',
            'response = requests.get(',
            '    "https://api.github.com/users/octocat",',
            '    timeout=10,',
            ')',
            'print(response.status_code)',
            'if response.status_code == 200:',
            '    user = response.json()',
            '    print(user["name"], "has", user["public_repos"], "public repos")'
          )
        },
        code: lines(
          'import json',
          '',
          'class FakeResponse:',
          '    def __init__(self, status_code, text):',
          '        self.status_code = status_code',
          '        self.text = text',
          '    def json(self):',
          '        return json.loads(self.text)',
          '',
          'def fake_get(url, timeout=10):',
          '    if url.endswith("/users/octocat"):',
          '        return FakeResponse(200, \'{"name": "The Octocat", "public_repos": 8}\')',
          '    return FakeResponse(404, \'{"message": "Not Found"}\')',
          '',
          'for url in ["https://api.github.com/users/octocat", "https://api.github.com/users/nobody-here"]:',
          '    response = fake_get(url, timeout=10)',
          '    if response.status_code == 200:',
          '        user = response.json()',
          '        print(user["name"], "has", user["public_repos"], "public repos")',
          '    else:',
          '        print("Error", response.status_code, response.json()["message"])'
        ),
        output: lines('The Octocat has 8 public repos', 'Error 404 Not Found'),
        codeNotes: [
          { line: 3, note: 'A pretend response with the same parts as the real one: status_code and json().' },
          { line: 17, note: 'Check the status first.' },
          { line: 18, note: 'Only then read the JSON answer.' }
        ],
        tryIt: 'On your laptop, run the projectCode version with your own GitHub username instead of octocat.',
        check: {
          question: 'Why should you always pass timeout to requests.get?',
          options: ['So your program does not wait forever if the server never answers', 'To make the request faster', 'Because the API needs to know your time zone'],
          answer: 0,
          why: 'Without a timeout, a slow or broken server can make your program hang. A timeout makes it give up and report an error.'
        }
      },
      {
        title: 'Reading nested JSON safely',
        say: [
          'Real API answers are often big and nested: dictionaries inside lists inside dictionaries. A job-search API might return {"results": [{"title": ..., "company": {"name": ...}}], "total": 42}.',
          'Read them one level at a time. data["results"] is a list; each item is a dictionary; item["company"]["name"] goes one level deeper. Printing the data, or part of it, while you explore is completely normal.',
          'APIs do not always include every field. Use get() with a default for optional fields, so a missing field does not crash your program: item.get("salary", "not given").',
          'A common, useful step is to turn the API\'s answer into your own simple shape, keeping only the fields you need. The rest of your program then works with clean data and does not care how the API formats things.'
        ],
        example: 'A big parcel from an online shop has a box, inside it a bag, inside it the item and the bill. You open one layer at a time. And if the bill is missing, you do not throw the parcel away; you just note "no bill".',
        code: lines(
          'import json',
          'text = """{',
          '  "total": 2,',
          '  "results": [',
          '    {"title": "Junior Python Developer", "company": {"name": "Acme", "city": "Pune"}, "salary": "4-6 LPA"},',
          '    {"title": "Backend Intern", "company": {"name": "Byte Labs", "city": "Remote"}}',
          '  ]',
          '}"""',
          'data = json.loads(text)',
          'jobs = []',
          'for item in data.get("results", []):',
          '    jobs.append({',
          '        "title": item["title"],',
          '        "company": item["company"]["name"],',
          '        "salary": item.get("salary", "not given"),',
          '    })',
          'for job in jobs:',
          '    print(f"{job[\'title\']} at {job[\'company\']} ({job[\'salary\']})")'
        ),
        output: lines('Junior Python Developer at Acme (4-6 LPA)', 'Backend Intern at Byte Labs (not given)'),
        codeNotes: [
          { line: 2, note: 'Triple quotes let a string run over several lines.' },
          { line: 11, note: 'If "results" is missing, loop over an empty list instead of crashing.' },
          { line: 15, note: 'The second job has no salary, so the default is used.' }
        ],
        tryIt: 'Add the city to each job with item["company"].get("city", "unknown") and include it in the printed line.',
        check: {
          question: 'Why convert an API answer into your own simple shape?',
          options: ['The rest of your program works with clean data and does not depend on the API\'s format', 'APIs require it', 'JSON cannot be used directly'],
          answer: 0,
          why: 'Keeping only the fields you need, in a shape you choose, makes the rest of your code simpler and protects it from API changes.'
        }
      },
      {
        title: 'API keys and handling failures',
        say: [
          'Many APIs need an API key: a secret string that identifies your account. It is usually sent in a header, like headers={"Authorization": "Bearer your-key"}. Never write the key directly in your code, and never push it to GitHub.',
          'Instead, keep keys in environment variables: settings stored outside your code. os.environ.get("RATES_API_KEY") reads one. On your laptop you can put them in a .env file, which your .gitignore from Day 22 keeps out of Git. You will set environment variables on the hosting site on Day 29.',
          'Networks fail: no internet, the server is down, or it is too slow. requests raises errors like requests.Timeout or requests.ConnectionError. Catch them and show a friendly message, or fall back to saved data, instead of crashing.',
          'A good pattern for important data is: try the API; if it fails, use the last good answer you saved in a JSON file, and tell the user the data might be out of date.'
        ],
        example: 'An API key is like your gym membership card: it proves who you are, so you keep it in your wallet, not stuck on the front door. And if the gym is closed one day, you do not give up exercising; you go for a run instead. That is the fallback.',
        projectCode: {
          label: 'On your laptop: a key from the environment, and handling failures',
          code: lines(
            'import os',
            'import requests',
            '',
            'API_KEY = os.environ.get("RATES_API_KEY", "")',
            '',
            'def get_rates():',
            '    try:',
            '        r = requests.get("https://api.example.com/rates",',
            '                         headers={"Authorization": f"Bearer {API_KEY}"},',
            '                         timeout=10)',
            '        r.raise_for_status()',
            '        return r.json()',
            '    except requests.RequestException as error:',
            '        print("Could not get rates:", error)',
            '        return None'
          )
        },
        code: lines(
          'import os',
          '',
          'def get_rates(fetch):',
          '    try:',
          '        return fetch(), "live"',
          '    except (TimeoutError, ConnectionError):',
          '        return {"USD": 0.012}, "saved (may be out of date)"',
          '',
          'def working_api():',
          '    return {"USD": 0.0121}',
          '',
          'def broken_api():',
          '    raise TimeoutError("no answer in 10 seconds")',
          '',
          'print(get_rates(working_api))',
          'print(get_rates(broken_api))',
          'key = os.environ.get("RATES_API_KEY", "")',
          'print("Key set:", bool(key))'
        ),
        output: lines("({'USD': 0.0121}, 'live')", "({'USD': 0.012}, 'saved (may be out of date)')", 'Key set: False'),
        codeNotes: [
          { line: 6, note: 'Network problems: fall back instead of crashing.' },
          { line: 7, note: 'The last good answer, clearly labelled as possibly old.' },
          { line: 17, note: 'Read the key from the environment. Here it is not set, so we get "".' }
        ],
        tryIt: 'Write a third function slow_api that raises ConnectionError("offline") and call get_rates(slow_api). It should also use the saved rates.',
        check: {
          question: 'Where should an API key be stored?',
          options: ['In an environment variable, not in the code', 'In the code, so it is easy to find', 'In the README'],
          answer: 0,
          why: 'Keys in code end up on GitHub, where others can find and misuse them. Environment variables keep them out of your code.'
        }
      },
      {
        title: 'Putting it together: expenses in another currency',
        say: [
          'Let us add a small API feature to the Expense Tracker: showing your total in another currency using exchange rates. The rates come from an API answer; here we use a sample answer so it runs in the lesson.',
          'The steps are the ones you learned today: check the status, read the JSON, pick out what you need with get() and a sensible default, and handle a missing currency politely.',
          'Notice that the conversion function takes the rates as a parameter. It does not call the API itself. That keeps it easy to test, just like the other tracker functions, and the API call stays at the edge of the program.',
          'In today\'s practice you will write parse_results, which reads a list from an API answer safely, and status_message, which turns a status code into words.'
        ],
        example: 'When you shop on an international website, prices appear in rupees. Behind the scenes, the site fetched today\'s exchange rate from an API and converted every price. Your tracker now does the same for your total.',
        code: lines(
          'import json',
          'status_code = 200',
          'body = \'{"base": "INR", "rates": {"USD": 0.012, "EUR": 0.011, "AED": 0.044}}\'',
          '',
          'def convert(amount, rates, currency):',
          '    rate = rates.get(currency)',
          '    if rate is None:',
          '        return None',
          '    return round(amount * rate, 2)',
          '',
          'expenses = [{"amount": 20}, {"amount": 8000}, {"amount": 480}]',
          'total = sum(e["amount"] for e in expenses)',
          'if status_code == 200:',
          '    rates = json.loads(body).get("rates", {})',
          '    for currency in ["USD", "EUR", "JPY"]:',
          '        value = convert(total, rates, currency)',
          '        print(currency, value if value is not None else "rate not available")',
          'else:',
          '    print("Could not get rates, status", status_code)'
        ),
        output: lines('USD 102.0', 'EUR 93.5', 'JPY rate not available'),
        codeNotes: [
          { line: 5, note: 'A pure function: amount and rates in, converted amount out.' },
          { line: 13, note: 'Check the status before reading the body.' },
          { line: 17, note: 'A missing rate is handled politely, not with a crash.' }
        ],
        tryIt: 'Change status_code to 503 and run it. The program reports the problem instead of converting.',
        check: {
          question: 'Why does convert() take the rates as a parameter instead of calling the API itself?',
          options: ['It stays easy to test without the internet, and the API call stays at the edge', 'Functions cannot call APIs', 'To make the API faster'],
          answer: 0,
          why: 'A pure function can be tested with sample rates. The network call lives in one place at the edge of the program.'
        }
      }
    ],
    summary: [
      'A web API is a URL that answers programs, usually with JSON. GET reads data; POST sends new data.',
      'Status codes: 2xx success, 4xx the caller\'s mistake (404 not found), 5xx the server\'s problem.',
      'requests.get(url, params=..., timeout=10), then check status_code and read response.json().',
      'Read nested JSON one level at a time; use get() with defaults for optional fields.',
      'Keep API keys in environment variables, and handle network failures with a fallback.'
    ],
    projectStep: {
      title: 'Expense Tracker: call a real API',
      steps: [
        'On your laptop, pip install requests and call https://api.github.com/users/<your-username> with a timeout.',
        'Print the status code and two fields from the JSON answer.',
        'Write convert(amount, rates, currency) in tracker.py with a test.',
        'Commit and push.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 27,
    title: 'Building Your Own API with FastAPI',
    goal: 'You can build a small web API with FastAPI that lists and adds expenses, checks incoming data, and returns clear errors.',
    minutes: 35,
    recap: 'Yesterday you called web APIs: URLs, parameters, status codes, JSON answers and API keys.',
    parts: [
      {
        title: 'From a terminal menu to a web API',
        say: [
          'Your Expense Tracker works in the terminal, but only on your laptop, and only for you. Turning it into a web API means any program can use it over the internet: a phone app, a website, or another developer\'s code.',
          'A web API is a set of routes. A route is a method plus a path, like GET /expenses to list expenses or POST /expenses to add one. For each route, you write a Python function that returns data, and the framework turns it into JSON.',
          'FastAPI is a modern, popular Python framework for building APIs. It is fast, beginner-friendly, and used by many companies. It also checks incoming data for you and creates documentation automatically.',
          'Here is the best part: you already wrote the logic. add_expense, summary and category_totals from tracker.py are reused as they are. The API is just a new edge, replacing input() and print() with web requests and JSON answers.'
        ],
        example: 'Your tracker so far is like a home kitchen that only cooks for you. A web API is like opening a delivery counter: the same kitchen and recipes, but now anyone can place an order through a standard window and get food back.',
        code: lines(
          'routes = {',
          '    ("GET", "/expenses"): "list all expenses",',
          '    ("POST", "/expenses"): "add one expense",',
          '    ("GET", "/summary"): "total, count and biggest",',
          '    ("GET", "/categories"): "total per category",',
          '}',
          'for (method, path), job in routes.items():',
          '    print(f"{method:<5}{path:<13}-> {job}")'
        ),
        output: lines(
          'GET  /expenses    -> list all expenses',
          'POST /expenses    -> add one expense',
          'GET  /summary     -> total, count and biggest',
          'GET  /categories  -> total per category'
        ),
        codeNotes: [
          { line: 2, note: 'A route is a (method, path) pair. GET reads, POST adds.' },
          { line: 7, note: 'Unpack the tuple key and the value in one loop.' }
        ],
        tryIt: 'Add a route ("GET", "/expenses/{id}") for "one expense by id" and run it.',
        check: {
          question: 'Which route should add a new expense?',
          options: ['POST /expenses', 'GET /expenses', 'GET /summary'],
          answer: 0,
          why: 'POST sends new data to be saved. GET only reads data.'
        }
      },
      {
        title: 'Your first FastAPI app',
        say: [
          'On your laptop, install FastAPI and the server that runs it: pip install "fastapi[standard]". Then create api.py.',
          'app = FastAPI() creates the application. Above a function, @app.get("/") says: when a GET request comes to "/", run this function. The line starting with @ is called a decorator. The function returns a dictionary, and FastAPI sends it as JSON.',
          'Start the server in the terminal with fastapi dev api.py. Open http://127.0.0.1:8000 in your browser and you see your JSON. 127.0.0.1 means "this computer", and 8000 is the port, like a door number.',
          'Now open http://127.0.0.1:8000/docs. FastAPI has created an interactive documentation page listing every route, where you can try each one with a button. Recruiters and teammates love this page.'
        ],
        example: 'The decorator @app.get("/") is like writing "Enquiries" above a counter window in an office. Anyone who comes to that window gets served by the person behind it. Each route is a labelled window, and each function is the person behind it.',
        projectCode: {
          label: 'api.py on your laptop, run with: fastapi dev api.py',
          code: lines(
            'from fastapi import FastAPI',
            '',
            'app = FastAPI()',
            '',
            '@app.get("/")',
            'def home():',
            '    return {"message": "Expense Tracker API is running"}',
            '',
            '# Terminal:',
            '#   pip install "fastapi[standard]"',
            '#   fastapi dev api.py',
            '# Browser:',
            '#   http://127.0.0.1:8000       -> the JSON above',
            '#   http://127.0.0.1:8000/docs  -> interactive docs'
          )
        },
        code: lines(
          'import json',
          'routes = {}',
          '',
          'def get(path):',
          '    def register(function):',
          '        routes[("GET", path)] = function',
          '        return function',
          '    return register',
          '',
          '@get("/")',
          'def home():',
          '    return {"message": "Expense Tracker API is running"}',
          '',
          'def handle(method, path):',
          '    function = routes.get((method, path))',
          '    if function is None:',
          '        return 404, {"detail": "Not Found"}',
          '    return 200, function()',
          '',
          'for path in ["/", "/nothing"]:',
          '    status, body = handle("GET", path)',
          '    print(status, json.dumps(body))'
        ),
        output: lines('200 {"message": "Expense Tracker API is running"}', '404 {"detail": "Not Found"}'),
        codeNotes: [
          { line: 4, note: 'A tiny imitation of FastAPI\'s app.get, so the idea runs here.' },
          { line: 10, note: 'The decorator registers home() for GET /.' },
          { line: 17, note: 'An unknown path gets 404, just like FastAPI.' }
        ],
        tryIt: 'Add a second route @get("/health") that returns {"status": "ok"}, and call handle("GET", "/health").',
        check: {
          question: 'In FastAPI, what does @app.get("/summary") above a function do?',
          options: ['Runs that function when a GET request comes to /summary', 'Downloads /summary from the internet', 'Prints the function\'s code'],
          answer: 0,
          why: 'The decorator connects the route (GET /summary) to the function. FastAPI calls it and sends the result as JSON.'
        }
      },
      {
        title: 'GET routes that reuse tracker.py',
        say: [
          'Now connect the API to your tracker. Import load, summary and category_totals from tracker.py. Each GET route loads the expenses and returns what the function calculates.',
          'A route can also have a path parameter: @app.get("/expenses/{expense_id}") with def get_expense(expense_id: int). FastAPI takes the number from the URL, checks it is really a whole number, and passes it in.',
          'If the expense does not exist, raise HTTPException(status_code=404, detail="Expense not found"). The caller gets a 404 status with a clear JSON message, instead of a crash.',
          'Query parameters work too: def list_expenses(month: str | None = None) lets callers use /expenses?month=2026-09. If the parameter is left out, it is None and you return everything.'
        ],
        example: 'A library catalogue: /books lists all books, /books/42 shows book number 42, and /books?author=Premchand filters the list. If you ask for book 99999, the librarian says "not found" instead of pretending.',
        projectCode: {
          label: 'api.py: GET routes',
          code: lines(
            'from fastapi import FastAPI, HTTPException',
            'from tracker import load, summary, category_totals, in_month',
            '',
            'app = FastAPI()',
            '',
            '@app.get("/expenses")',
            'def list_expenses(month: str | None = None):',
            '    expenses = load()',
            '    return in_month(expenses, month) if month else expenses',
            '',
            '@app.get("/expenses/{expense_id}")',
            'def get_expense(expense_id: int):',
            '    for e in load():',
            '        if e["id"] == expense_id:',
            '            return e',
            '    raise HTTPException(status_code=404, detail="Expense not found")',
            '',
            '@app.get("/summary")',
            'def get_summary():',
            '    return summary(load())'
          )
        },
        code: lines(
          'expenses = [',
          '    {"id": 1, "item": "Tea", "amount": 20, "date": "2026-08-30"},',
          '    {"id": 2, "item": "Rent", "amount": 8000, "date": "2026-09-01"},',
          ']',
          '',
          'def list_expenses(month=None):',
          '    if month:',
          '        return 200, [e for e in expenses if e["date"][:7] == month]',
          '    return 200, expenses',
          '',
          'def get_expense(expense_id):',
          '    for e in expenses:',
          '        if e["id"] == expense_id:',
          '            return 200, e',
          '    return 404, {"detail": "Expense not found"}',
          '',
          'print(list_expenses(month="2026-09"))',
          'print(get_expense(1))',
          'print(get_expense(99))'
        ),
        output: lines(
          "(200, [{'id': 2, 'item': 'Rent', 'amount': 8000, 'date': '2026-09-01'}])",
          "(200, {'id': 1, 'item': 'Tea', 'amount': 20, 'date': '2026-08-30'})",
          "(404, {'detail': 'Expense not found'})"
        ),
        codeNotes: [
          { line: 6, note: 'An optional query parameter: /expenses?month=2026-09.' },
          { line: 11, note: 'A path parameter: /expenses/1.' },
          { line: 15, note: 'Not found: a 404 status with a clear message.' }
        ],
        tryIt: 'Call list_expenses() with no month and check both expenses come back.',
        check: {
          question: 'What should an API return when asked for an expense id that does not exist?',
          options: ['A 404 status with a clear message', 'A 200 status with an empty dictionary', 'Nothing; the server should crash'],
          answer: 0,
          why: '404 tells the caller exactly what happened, and the message explains it. A crash would give a confusing 500 error.'
        }
      },
      {
        title: 'POST routes and data checking with Pydantic models',
        say: [
          'To add an expense, the caller sends a POST request with JSON in the request body, like {"item": "Tea", "amount": 20, "category": "food"}. You describe the expected shape with a class that inherits from Pydantic\'s BaseModel. You learned inheritance on Day 19; here it is in real use.',
          'class NewExpense(BaseModel): with lines like item: str and amount: float says what fields are needed and their types. Field(gt=0) adds a rule: greater than 0. FastAPI then checks every incoming request automatically.',
          'If the data is wrong, for example the amount is missing or is "abc", FastAPI answers with status 422 and a list explaining each problem, before your function even runs. You get strong validation almost for free.',
          'For a successful POST, return the new expense and set status_code=201, which means "created". Then save the updated list with save() from tracker.py.'
        ],
        example: 'A bank form for a new account has boxes with rules: name must be filled, phone must be 10 digits, age must be over 18. The clerk checks the form before processing it and returns it with notes if anything is wrong. A BaseModel is that form with its rules.',
        projectCode: {
          label: 'api.py: POST with a model',
          code: lines(
            'from datetime import date',
            'from pydantic import BaseModel, Field',
            'from tracker import load, save, add_expense',
            '',
            'class NewExpense(BaseModel):',
            '    item: str = Field(min_length=1)',
            '    amount: float = Field(gt=0)',
            '    category: str = "other"',
            '',
            '@app.post("/expenses", status_code=201)',
            'def create_expense(data: NewExpense):',
            '    expenses = add_expense(load(), data.item, data.amount,',
            '                           data.category, date.today().isoformat())',
            '    save(expenses)',
            '    return expenses[-1]'
          )
        },
        code: lines(
          'def validate_expense(data):',
          '    errors = []',
          '    if not str(data.get("item", "")).strip():',
          '        errors.append("item is required")',
          '    amount = data.get("amount")',
          '    if not isinstance(amount, (int, float)) or amount <= 0:',
          '        errors.append("amount must be more than 0")',
          '    return errors',
          '',
          'expenses = []',
          'def create_expense(data):',
          '    errors = validate_expense(data)',
          '    if errors:',
          '        return 422, {"detail": errors}',
          '    new = {"id": len(expenses) + 1, "item": data["item"].strip(), "amount": data["amount"], "category": data.get("category", "other")}',
          '    expenses.append(new)',
          '    return 201, new',
          '',
          'print(create_expense({"item": "Tea", "amount": 20, "category": "food"}))',
          'print(create_expense({"item": " ", "amount": "abc"}))',
          'print(create_expense({"item": "Bus", "amount": 45}))'
        ),
        output: lines(
          "(201, {'id': 1, 'item': 'Tea', 'amount': 20, 'category': 'food'})",
          "(422, {'detail': ['item is required', 'amount must be more than 0']})",
          "(201, {'id': 2, 'item': 'Bus', 'amount': 45, 'category': 'other'})"
        ),
        codeNotes: [
          { line: 1, note: 'What FastAPI and BaseModel do for you, written out by hand so you can see it.' },
          { line: 14, note: '422 with a list of every problem.' },
          { line: 17, note: '201 means created.' }
        ],
        tryIt: 'Send {"amount": 50} with no item. You should get 422 with only "item is required".',
        check: {
          question: 'What status does FastAPI return when the request body fails the model\'s rules?',
          options: ['422, with details of each problem', '200, with the data unchanged', '500, because the server crashed'],
          answer: 0,
          why: 'FastAPI checks the body against the model before your function runs and answers 422 with an explanation.'
        }
      },
      {
        title: 'Trying and testing your API',
        say: [
          'The /docs page is the easiest way to try your API by hand: open a route, click "Try it out", fill in the JSON, press Execute, and see the status and answer.',
          'For automatic tests, FastAPI has a TestClient. client.get("/summary") and client.post("/expenses", json={...}) send pretend requests to your app without starting a server. You check response.status_code and response.json() with assert, in pytest, as on Day 21.',
          'Test the important paths: listing works, adding a good expense returns 201, adding a bad one returns 422, and asking for a missing id returns 404.',
          'Make the tests use a temporary data file, so they never touch your real expenses. This is why load and save take a path parameter.'
        ],
        example: 'Before opening a new restaurant, the owners do a trial evening with friends: they order normal dishes, strange combinations and things not on the menu, to check the kitchen handles everything. TestClient is that trial evening for your API.',
        projectCode: {
          label: 'test_api.py, run with: pytest',
          code: lines(
            'from fastapi.testclient import TestClient',
            'from api import app',
            '',
            'client = TestClient(app)',
            '',
            'def test_add_good_expense():',
            '    r = client.post("/expenses", json={"item": "Tea", "amount": 20})',
            '    assert r.status_code == 201',
            '    assert r.json()["item"] == "Tea"',
            '',
            'def test_refuse_bad_amount():',
            '    r = client.post("/expenses", json={"item": "Tea", "amount": -5})',
            '    assert r.status_code == 422',
            '',
            'def test_missing_expense_is_404():',
            '    assert client.get("/expenses/99999").status_code == 404'
          )
        },
        code: lines(
          'def paginate(items, page, size):',
          '    start = (page - 1) * size',
          '    return items[start:start + size]',
          '',
          'items = list(range(1, 8))',
          'checks = {',
          '    "page 1": paginate(items, 1, 3) == [1, 2, 3],',
          '    "page 3 is the last item": paginate(items, 3, 3) == [7],',
          '    "page 4 is empty": paginate(items, 4, 3) == [],',
          '}',
          'for name, ok in checks.items():',
          '    print("PASS" if ok else "FAIL", name)'
        ),
        output: lines('PASS page 1', 'PASS page 3 is the last item', 'PASS page 4 is empty'),
        codeNotes: [
          { line: 1, note: 'APIs often return long lists in pages, like ?page=2&size=20.' },
          { line: 2, note: 'Page 1 starts at position 0, page 2 at size, and so on.' }
        ],
        tryIt: 'Add a check that paginate(items, 2, 5) is [6, 7], and run it.',
        check: {
          question: 'Why should API tests use a temporary data file?',
          options: ['So tests never change your real expenses', 'Because TestClient cannot read files', 'To make the API faster'],
          answer: 0,
          why: 'Tests add and change data. Pointing them at a temporary file keeps your real data safe.'
        }
      },
      {
        title: 'Putting it together: the Expense Tracker API',
        say: [
          'Let us run the whole flow of the Expense Tracker API in the lesson editor with a small imitation of FastAPI: list, add a good expense, refuse a bad one, get the summary, and ask for a missing route.',
          'On your laptop, the real version is api.py with FastAPI, reusing tracker.py, plus test_api.py. Run it with fastapi dev api.py, try every route on the /docs page, run pytest, then commit and push.',
          'This is a real backend project: a web API with validation, error handling, tests, and data storage. It is exactly what junior Python backend roles ask about, and on Day 29 you will put it online.',
          'In today\'s practice you will write validate_expense, which returns the list of problems in incoming data, and paginate, which returns one page of a list.'
        ],
        example: 'You started the month with a program that printed one line. Now other programs can send your tracker requests over the internet and get correct, checked answers back. That is the same kind of work backend developers do every day.',
        code: lines(
          'import json',
          'expenses = []',
          '',
          'def post_expenses(body):',
          '    if not str(body.get("item", "")).strip() or not isinstance(body.get("amount"), (int, float)) or body["amount"] <= 0:',
          '        return 422, {"detail": "item is required and amount must be more than 0"}',
          '    new = {"id": len(expenses) + 1, "item": body["item"].strip(), "amount": body["amount"]}',
          '    expenses.append(new)',
          '    return 201, new',
          '',
          'def get_summary(body):',
          '    return 200, {"total": sum(e["amount"] for e in expenses), "count": len(expenses)}',
          '',
          'routes = {("POST", "/expenses"): post_expenses, ("GET", "/summary"): get_summary,',
          '          ("GET", "/expenses"): lambda body: (200, expenses)}',
          '',
          'def request(method, path, body=None):',
          '    handler = routes.get((method, path))',
          '    status, data = handler(body or {}) if handler else (404, {"detail": "Not Found"})',
          '    print(method, path, "->", status, json.dumps(data))',
          '',
          'request("GET", "/expenses")',
          'request("POST", "/expenses", {"item": "Tea", "amount": 20})',
          'request("POST", "/expenses", {"item": "Bad", "amount": -1})',
          'request("POST", "/expenses", {"item": "Rent", "amount": 8000})',
          'request("GET", "/summary")',
          'request("GET", "/nothing")'
        ),
        output: lines(
          'GET /expenses -> 200 []',
          'POST /expenses -> 201 {"id": 1, "item": "Tea", "amount": 20}',
          'POST /expenses -> 422 {"detail": "item is required and amount must be more than 0"}',
          'POST /expenses -> 201 {"id": 2, "item": "Rent", "amount": 8000}',
          'GET /summary -> 200 {"total": 8020, "count": 2}',
          'GET /nothing -> 404 {"detail": "Not Found"}'
        ),
        codeNotes: [
          { line: 14, note: 'The route table: (method, path) -> function, like FastAPI keeps internally.' },
          { line: 19, note: 'Unknown routes get 404.' },
          { line: 20, note: 'Every answer is a status code and JSON, exactly what a real API sends.' }
        ],
        tryIt: 'Add a route ("GET", "/health") that returns (200, {"status": "ok"}) and call it.',
        check: {
          question: 'What does the Expense Tracker API reuse from earlier days?',
          options: ['The logic in tracker.py: add, summary, totals, save and load', 'The terminal menu with input()', 'Nothing; APIs need all-new code'],
          answer: 0,
          why: 'Only the edge changes. The API calls the same tested functions that the terminal menu used.'
        }
      }
    ],
    summary: [
      'A web API is a set of routes: a method and a path, like GET /expenses and POST /expenses.',
      'FastAPI: app = FastAPI(), @app.get(...) and @app.post(...), run with fastapi dev api.py, try it at /docs.',
      'Path parameters (/expenses/{id}) and query parameters (?month=2026-09) come in as function arguments.',
      'A BaseModel describes incoming JSON; bad data gets a 422 answer automatically.',
      'Return 201 for created and raise HTTPException(404) for not found. Test with TestClient.'
    ],
    projectStep: {
      title: 'Expense Tracker: build the API',
      steps: [
        'pip install "fastapi[standard]" and add it to requirements.txt.',
        'Create api.py with GET /expenses, GET /expenses/{id}, POST /expenses and GET /summary, reusing tracker.py.',
        'Try every route on http://127.0.0.1:8000/docs.',
        'Write test_api.py with TestClient, run pytest, commit and push.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 28,
    title: 'Debugging: Reading Tracebacks',
    goal: 'You can find and fix bugs calmly: read tracebacks, recognise common errors, and use print() and breakpoints to see what code is really doing.',
    minutes: 30,
    recap: 'Yesterday you built the Expense Tracker API with FastAPI: routes, data models, error codes and tests.',
    parts: [
      {
        title: 'Debugging is a normal part of the job',
        say: [
          'A bug is any case where the program does something different from what you meant. Every developer writes bugs, every day. Senior developers are not people who never write bugs; they are people who find and fix them calmly and quickly.',
          'Most of a junior developer\'s first tasks at a company are bug fixes. So debugging is one of the most job-relevant skills in this course.',
          'Debugging follows simple steps. One: reproduce the bug, so you can see it happen. Two: read the error message, if there is one. Three: find the exact line and the values involved. Four: form a guess about the cause and test it. Five: fix it, and add a test so it never comes back.',
          'The worst approach is changing random things and hoping. It wastes time and often creates new bugs. Follow the steps, and look at the actual values instead of guessing.'
        ],
        example: 'A good doctor does not prescribe random medicines. They ask what happened, look at the symptoms, run a test, form a diagnosis, then treat. Debugging is the same careful process for code.',
        code: lines(
          'steps = [',
          '    "Reproduce the bug",',
          '    "Read the error message",',
          '    "Find the line and the values",',
          '    "Guess the cause and test the guess",',
          '    "Fix it and add a test",',
          ']',
          'for number, step in enumerate(steps, start=1):',
          '    print(f"{number}. {step}")'
        ),
        output: lines('1. Reproduce the bug', '2. Read the error message', '3. Find the line and the values', '4. Guess the cause and test the guess', '5. Fix it and add a test'),
        codeNotes: [
          { line: 8, note: 'A numbered checklist with enumerate, starting at 1.' }
        ],
        tryIt: 'Add a sixth step, "Commit the fix with a clear message", and run it.',
        check: {
          question: 'What is the first step in fixing a bug?',
          options: ['Reproduce it, so you can see it happen', 'Rewrite the whole function', 'Change random lines until it works'],
          answer: 0,
          why: 'If you cannot make the bug happen, you cannot check whether your fix worked.'
        }
      },
      {
        title: 'Reading a traceback, from the bottom up',
        say: [
          'When Python crashes, it prints a traceback. On your laptop, you see the full version. Read it from the bottom up.',
          'The last line gives the error type and message, like TypeError: unsupported operand type(s) for +: \'int\' and \'str\'. That means you tried to add a number and a piece of text.',
          'Above it, each pair of lines shows a file, a line number and a function name, with the line of code underneath. The bottom pair is where the error actually happened. The pairs above show which function called which, all the way from the start of the program.',
          'Often the bug is not on the exact line that crashed, but in the value that arrived there. If amount is "45" instead of 45, the question is: where did that text come from? Follow the traceback upwards to find out.'
        ],
        example: 'A traceback is like tracking a courier parcel backwards: "damaged at the Pune hub" is the last line. Above it: it came from the Mumbai warehouse, which got it from the seller. The damage showed up in Pune, but the bad packing may have happened at the start.',
        projectCode: {
          label: 'A traceback on your laptop (read from the bottom)',
          code: lines(
            'Traceback (most recent call last):',
            '  File "main.py", line 12, in <module>',
            '    print(total(expenses))',
            '  File "tracker.py", line 3, in total',
            '    result = result + e["amount"]',
            'TypeError: unsupported operand type(s) for +: \'int\' and \'str\''
          )
        },
        code: lines(
          'def total(expenses):',
          '    result = 0',
          '    for e in expenses:',
          '        result = result + e["amount"]',
          '    return result',
          '',
          'expenses = [{"item": "Tea", "amount": 20}, {"item": "Bus", "amount": "45"}]',
          'print(total(expenses))'
        ),
        output: "[Error] TypeError: unsupported operand type(s) for +: 'int' and 'str'",
        codeNotes: [
          { line: 4, note: 'The line that crashes: 20 + "45" mixes a number and text.' },
          { line: 7, note: 'The real cause: the bus amount was stored as text "45".' }
        ],
        tryIt: 'Fix the cause, not the symptom: change "45" to 45 on line 7 and run it. The total is 65.',
        check: {
          question: 'Which line of a traceback do you read first?',
          options: ['The last line: error type and message', 'The first line: "Traceback (most recent call last)"', 'The middle line'],
          answer: 0,
          why: 'The last line tells you what went wrong. The lines above show where, and how the program got there.'
        }
      },
      {
        title: 'The most common errors and their usual causes',
        say: [
          'A few error types cause most beginner bugs. Learning their usual causes makes debugging much faster.',
          'NameError: a name is misspelt, or used before it is created. TypeError: the wrong type, like adding text to a number, or calling a function with the wrong number of arguments. KeyError: a dictionary key is missing or spelt differently. IndexError: a list position that does not exist, often one past the end.',
          'AttributeError: an object does not have that attribute or method, often because the value is None or a different type than you think. ValueError: the right type with a bad value, like int("abc"). ZeroDivisionError: dividing by zero, often an average of an empty list.',
          'The sample below triggers each one on purpose and prints the error type and message. Being able to name the error and its likely cause in an interview shows real experience.'
        ],
        example: 'A car mechanic hears a squeal and says "that is probably the brake pads". Years of experience link common symptoms to common causes. Learning the common errors gives you that experience early.',
        code: lines(
          'broken = [',
          '    lambda: totl,',
          '    lambda: 20 + "45",',
          '    lambda: {"amount": 20}["amont"],',
          '    lambda: [1, 2, 3][3],',
          '    lambda: None.upper(),',
          '    lambda: int("abc"),',
          '    lambda: sum([]) / len([]),',
          ']',
          'for run in broken:',
          '    try:',
          '        run()',
          '    except Exception as error:',
          '        print(f"{type(error).__name__}: {error}")'
        ),
        output: lines(
          "NameError: name 'totl' is not defined",
          "TypeError: unsupported operand type(s) for +: 'int' and 'str'",
          "KeyError: 'amont'",
          'IndexError: list index out of range',
          "AttributeError: 'NoneType' object has no attribute 'upper'",
          "ValueError: invalid literal for int() with base 10: 'abc'",
          'ZeroDivisionError: division by zero'
        ),
        codeNotes: [
          { line: 2, note: 'A misspelt name: NameError.' },
          { line: 4, note: 'A misspelt key: KeyError.' },
          { line: 5, note: 'A list of 3 has positions 0 to 2: IndexError.' },
          { line: 13, note: 'Catching every error is fine here, because we only want to show them.' }
        ],
        tryIt: 'Add lambda: len(5) to the list and run it. Predict the error type before you look: it is a TypeError, because a number has no length.',
        check: {
          question: 'You see AttributeError: \'NoneType\' object has no attribute \'strip\'. What is the most likely cause?',
          options: ['A value you expected to be text is None, often a function that forgot to return', 'strip is misspelt', 'The file is missing'],
          answer: 0,
          why: 'NoneType means the value is None. Often a function had no return, or get() found no value.'
        }
      },
      {
        title: 'print() debugging',
        say: [
          'Many bugs give no error at all: the program runs but the answer is wrong. For those, you need to see what the code is really doing. The simplest tool is print().',
          'Add prints that show the values at each step, with labels: print("DEBUG i:", i, "total:", total). Then compare what you see with what you expected. The first place where they differ is where the bug is.',
          'The f-string shortcut f"{total=}" prints both the name and the value, like total=65. It is very handy for quick debugging.',
          'Remove the debug prints when you are done. Leaving them in makes output messy and can leak private data. Use git diff before committing to spot any you forgot.'
        ],
        example: 'When a recipe comes out wrong, you cook it again and taste at every step: after adding salt, after the spices, after simmering. The step where it tastes wrong is where the mistake is. Debug prints are tasting at every step.',
        code: lines(
          'def total_amount(expenses):',
          '    total = 0',
          '    for i in range(1, len(expenses)):',
          '        print(f"DEBUG {i=} {total=}")',
          '        total = total + expenses[i]["amount"]',
          '    return total',
          '',
          'data = [{"amount": 100}, {"amount": 200}, {"amount": 300}]',
          'print("Result:", total_amount(data), "expected 600")'
        ),
        output: lines('DEBUG i=1 total=0', 'DEBUG i=2 total=200', 'Result: 500 expected 600'),
        codeNotes: [
          { line: 3, note: 'The bug: range starts at 1, so position 0 is skipped.' },
          { line: 4, note: 'f"{i=}" prints the name and the value. There is no i=0 line: that is the clue.' }
        ],
        tryIt: 'Fix the bug by changing range(1, ...) to range(0, ...), or simply loop with for e in expenses. Then remove the DEBUG line.',
        check: {
          question: 'What does print(f"{total=}") show when total is 65?',
          options: ['total=65', '65', '{total=}'],
          answer: 0,
          why: 'Adding = inside the f-string brackets prints the expression, an equals sign, and its value.'
        }
      },
      {
        title: 'Breakpoints and the VS Code debugger',
        say: [
          'For bigger bugs, a debugger is more powerful than print. In VS Code, click in the margin to the left of a line number to set a breakpoint, a red dot. Then press F5, or Run, Start Debugging.',
          'The program runs and pauses at the breakpoint. On the left, VS Code shows every variable and its current value. You can hover over any name in the code to see its value, without adding a single print.',
          'Then you control the program: Step Over (F10) runs the next line, Step Into (F11) goes inside a function call, and Continue (F5) runs until the next breakpoint. You watch the values change line by line.',
          'Python also has a built-in breakpoint() function that pauses a program in the terminal. The VS Code debugger is easier for beginners, and it is a skill worth showing in interviews: "I set a breakpoint and stepped through the loop".'
        ],
        example: 'A debugger is like pausing and replaying a cricket match in slow motion. At normal speed, you only see that the batsman was out. In slow motion, frame by frame, you see exactly where the ball hit.',
        projectCode: {
          label: 'In VS Code on your laptop',
          code: lines(
            '1. Click left of a line number: a red dot (breakpoint) appears.',
            '2. Press F5 and choose "Python File".',
            '3. The program pauses at the red dot. Look at VARIABLES on the left.',
            '4. F10: run the next line.   F11: step into a function.',
            '5. F5: continue to the next breakpoint.   Shift+F5: stop.'
          )
        },
        code: lines(
          'def average(amounts):',
          '    steps = []',
          '    total = 0',
          '    for a in amounts:',
          '        total += a',
          '        steps.append(f"after {a}: total={total}")',
          '    steps.append(f"count={len(amounts)}")',
          '    return total / len(amounts), steps',
          '',
          'result, steps = average([20, 45, 115])',
          'for line in steps:',
          '    print(line)',
          'print("average:", result)'
        ),
        output: lines('after 20: total=20', 'after 45: total=65', 'after 115: total=180', 'count=3', 'average: 60.0'),
        codeNotes: [
          { line: 6, note: 'Recording each step shows what a debugger shows you line by line.' }
        ],
        tryIt: 'On your laptop, copy this function into a file, put a breakpoint on line 5, press F5, and step with F10 while watching total change.',
        check: {
          question: 'What does a breakpoint do?',
          options: ['Pauses the program at that line so you can look at the values', 'Deletes the line', 'Makes the program skip that line'],
          answer: 0,
          why: 'The program stops at the breakpoint, and the debugger shows every variable\'s current value.'
        }
      },
      {
        title: 'Putting it together: fixing a real bug',
        say: [
          'Let us debug a realistic bug in the Expense Tracker. Users report that the food total is too low. There is no error message: the answer is just wrong.',
          'Follow the steps. Reproduce: run category_totals on sample data. Look at the values: one expense has the category "Food" with a capital F, so it is counted as a different category. Guess the cause: categories are not cleaned when they are added. Fix: make categories lower-case. Test: add a test with mixed capitals.',
          'Notice the fix is in the right place: when the data comes in, in add_expense, not by patching the report. Fixing the cause means every other feature, the API included, gets correct data too.',
          'In today\'s practice you will fix a buggy total_amount function (the same range bug you saw today) and write first_invalid, which finds the first bad record in a list.'
        ],
        example: 'If a tap keeps leaking, you can keep mopping the floor (patching the report), or you can fix the washer in the tap (cleaning data when it comes in). Only one of them solves the problem.',
        code: lines(
          'def category_totals(expenses):',
          '    totals = {}',
          '    for e in expenses:',
          '        totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]',
          '    return totals',
          '',
          'reported = [{"category": "food", "amount": 20}, {"category": "Food", "amount": 150}, {"category": "travel", "amount": 45}]',
          'print("Bug:", category_totals(reported))',
          'print("Categories seen:", sorted({e["category"] for e in reported}))',
          '',
          'def clean(expense):',
          '    return {**expense, "category": expense["category"].strip().lower()}',
          '',
          'fixed = [clean(e) for e in reported]',
          'print("Fixed:", category_totals(fixed))',
          'assert category_totals([clean({"category": " FOOD", "amount": 5})]) == {"food": 5}',
          'print("Regression test passed")'
        ),
        output: lines(
          "Bug: {'food': 20, 'Food': 150, 'travel': 45}",
          "Categories seen: ['Food', 'food', 'travel']",
          "Fixed: {'food': 170, 'travel': 45}",
          'Regression test passed'
        ),
        codeNotes: [
          { line: 9, note: 'Looking at the actual values reveals two spellings of food.' },
          { line: 12, note: '{**expense, ...} copies the dictionary and replaces one key.' },
          { line: 16, note: 'A regression test so this bug can never come back unnoticed.' }
        ],
        tryIt: 'Add an expense with the category "food " (a space at the end) to reported, and check the fixed totals still show a single food category.',
        check: {
          question: 'Where is the best place to fix the "Food" vs "food" bug?',
          options: ['Where the data comes in, by cleaning the category in add_expense', 'In the report, by printing capitals differently', 'By telling users to always type small letters'],
          answer: 0,
          why: 'Fixing the cause at the entry point means every feature gets clean data, and the bug cannot reappear elsewhere.'
        }
      }
    ],
    summary: [
      'Debug in steps: reproduce, read the error, find the line and values, test a guess, fix and add a test.',
      'Read tracebacks from the bottom up; the cause may be where a bad value came from.',
      'Know the common errors: NameError, TypeError, KeyError, IndexError, AttributeError, ValueError, ZeroDivisionError.',
      'Use labelled prints like f"{total=}", then remove them before committing.',
      'Use VS Code breakpoints and F10 to step through code and watch values.'
    ],
    projectStep: {
      title: 'Expense Tracker: bug hunt',
      steps: [
        'Add an expense with the category "Food" and check whether your totals split food in two.',
        'If they do, fix add_expense to clean the category, and add a regression test.',
        'Set a breakpoint in category_totals and step through it once in VS Code.',
        'Run pytest, commit with a message like "Fix mixed-case categories", and push.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 29,
    title: 'Putting Your API Online',
    goal: 'You can prepare a FastAPI app for deployment, put it online with a free host, keep secrets in environment variables, and write a good README.',
    minutes: 30,
    recap: 'Yesterday you learned to debug: reading tracebacks, common errors, print debugging and breakpoints.',
    parts: [
      {
        title: 'What deploying means',
        say: [
          'Right now your API runs only on your laptop, at 127.0.0.1, which means "this computer". Nobody else can reach it, and it stops when you close the terminal. Deploying means running it on a server on the internet, with a public address, all the time.',
          'Hosting companies rent you a piece of a server. Some, like Render, have a free plan that is enough for a portfolio project. The usual flow is: you push your code to GitHub, connect the host to your repository, and it builds and runs your app. Every new push can redeploy it automatically.',
          'A live link changes how recruiters see your project. Instead of reading about your API, they click a link, open /docs, and try it themselves. It shows you can take a project all the way from idea to users.',
          'Free plans have limits. For example, a free app might go to sleep when nobody uses it and take a little while to wake up, and files saved on a free server may be deleted when it restarts. That is fine for a portfolio; just mention it in your README.'
        ],
        example: 'Cooking at home for your family is running on your laptop. Opening a food stall in the market, with a sign and opening hours, is deploying: now anyone passing by can order.',
        code: lines(
          'local = "http://127.0.0.1:8000"',
          'online = "https://expense-api.onrender.com"',
          'for url in [local, online]:',
          '    who = "only you" if "127.0.0.1" in url else "anyone on the internet"',
          '    print(f"{url:<36} -> reachable by {who}")'
        ),
        output: lines('http://127.0.0.1:8000                -> reachable by only you', 'https://expense-api.onrender.com     -> reachable by anyone on the internet'),
        codeNotes: [
          { line: 1, note: '127.0.0.1 always means "this same computer".' },
          { line: 2, note: 'An example public address from a host (yours will be different).' }
        ],
        tryIt: 'Add "http://localhost:8000" to the list. localhost is another name for 127.0.0.1, so it should also say "only you". Update the check to handle it.',
        check: {
          question: 'Why can nobody else open http://127.0.0.1:8000 on your laptop?',
          options: ['127.0.0.1 means "this computer", so for anyone else it points to their own computer', 'Port 8000 is blocked on the internet', 'FastAPI only allows one user'],
          answer: 0,
          why: '127.0.0.1 is always the computer you are using. A public address is needed for others to reach your API.'
        }
      },
      {
        title: 'Getting the project ready',
        say: [
          'A host needs to know two things: how to install your project, and how to start it. The install step is pip install -r requirements.txt, so make sure requirements.txt lists fastapi and anything else you import.',
          'The start command runs your API in production mode: fastapi run api.py --port $PORT, or uvicorn api:app --host 0.0.0.0 --port $PORT. 0.0.0.0 means "accept connections from outside", and $PORT is a port number the host gives you in an environment variable.',
          'Before deploying, run your tests and try the start command locally. Most failed deployments come from a missing package in requirements.txt or a typo in the start command.',
          'Also check .gitignore one last time: no .venv, no .env, no personal data files in your repository.'
        ],
        example: 'Before sending a flat-pack table to a customer, you check the box contains every screw (requirements.txt) and the assembly instructions (the start command). A missing screw means the customer cannot build it.',
        projectCode: {
          label: 'Deployment settings (for example on Render)',
          code: lines(
            'Build command:   pip install -r requirements.txt',
            'Start command:   fastapi run api.py --port $PORT',
            '',
            '# requirements.txt must include at least:',
            'fastapi[standard]',
            '',
            '# Try the production start command locally first:',
            'fastapi run api.py --port 8000'
          )
        },
        code: lines(
          'imports = {"fastapi", "pydantic", "requests"}',
          'requirements = """fastapi[standard]==0.115.0',
          'pytest==8.3.3"""',
          'listed = {line.split("==")[0].split("[")[0] for line in requirements.splitlines()}',
          'comes_with_fastapi = {"pydantic"}',
          'missing = sorted(imports - listed - comes_with_fastapi)',
          'print("Listed:", sorted(listed))',
          'print("Missing:", missing)'
        ),
        output: lines("Listed: ['fastapi', 'pytest']", "Missing: ['requests']"),
        codeNotes: [
          { line: 4, note: 'Take just the package name from lines like fastapi[standard]==0.115.0.' },
          { line: 6, note: 'Set difference: imported but not listed. This would break the deploy.' }
        ],
        tryIt: 'Add a line "requests==2.32.3" to the requirements text and run it. Missing becomes [].',
        check: {
          question: 'What is the most common reason a Python deployment fails?',
          options: ['A package used in the code is missing from requirements.txt', 'The code has too many comments', 'The README is too short'],
          answer: 0,
          why: 'The server only installs what requirements.txt lists. A missing package causes an import error when the app starts.'
        }
      },
      {
        title: 'Environment variables for settings and secrets',
        say: [
          'Some settings differ between your laptop and the server: the data file location, whether debug output is on, API keys. These should not be written into the code. They go in environment variables, which you first met on Day 26.',
          'In Python, os.environ.get("NAME", "default") reads a variable, with a default if it is not set. On the host, you set the real values in the dashboard, usually under "Environment". They are kept private and never appear in your GitHub repository.',
          'Environment variables are always text. If you need a number or a True/False value, convert it: int(os.environ.get("MAX_ITEMS", "100")), or os.environ.get("DEBUG", "false") == "true".',
          'This approach is part of a well-known set of practices for web apps called the Twelve-Factor App. Interviewers are pleased when a junior developer knows that secrets belong in environment variables.'
        ],
        example: 'A hotel gives each guest a room key at the front desk. The key is not printed in the hotel brochure. Your code is the brochure, public for everyone; the environment variables are the keys handed out privately at the desk.',
        code: lines(
          'import os',
          '',
          'def settings(env):',
          '    return {',
          '        "data_file": env.get("DATA_FILE", "expenses.json"),',
          '        "debug": env.get("DEBUG", "false").lower() == "true",',
          '        "max_items": int(env.get("MAX_ITEMS", "100")),',
          '    }',
          '',
          'print(settings({}))',
          'print(settings({"DATA_FILE": "/data/expenses.json", "DEBUG": "True", "MAX_ITEMS": "20"}))',
          'print(type(os.environ.get("PATH", "")).__name__)'
        ),
        output: lines(
          "{'data_file': 'expenses.json', 'debug': False, 'max_items': 100}",
          "{'data_file': '/data/expenses.json', 'debug': True, 'max_items': 20}",
          'str'
        ),
        codeNotes: [
          { line: 3, note: 'Pass the environment in as a dictionary, so the function is easy to test.' },
          { line: 6, note: 'Text "True" or "true" becomes the bool True.' },
          { line: 12, note: 'Real environment variables are always strings.' }
        ],
        tryIt: 'On your laptop, call settings(os.environ) to use the real environment. Then set DEBUG=true in the terminal before running, and check the value changes.',
        check: {
          question: 'Why convert environment variables with int() or a comparison?',
          options: ['They are always text, even when they look like numbers', 'Python cannot read them otherwise', 'Hosts require it'],
          answer: 0,
          why: 'Environment variables are strings. "20" must become 20, and "true" must become True, before you use them.'
        }
      },
      {
        title: 'Deploying and checking it works',
        say: [
          'The deploy itself takes a few clicks. On the host, create a new Web Service, connect your GitHub account, and pick the expense-tracker repository. Enter the build and start commands, add any environment variables, and choose the free plan.',
          'The host then shows a live log: installing packages, starting the app. Read it like a traceback. If something fails, the last lines usually say why, for example "ModuleNotFoundError: No module named requests".',
          'When it says the service is live, open your public URL, then add /docs. Try each route. It is a great moment: your own code, answering requests from anywhere in the world.',
          'Add a simple GET /health route that returns {"status": "ok"}. Hosts and monitoring tools use it to check your app is alive, and it is the quickest way for you to check too.'
        ],
        example: 'Opening night at a new shop: you unlock the doors, check the lights and the card machine work, and then welcome the first customer. Checking /health and /docs is testing the lights and the card machine.',
        projectCode: {
          label: 'After deploying: check it from your laptop',
          code: lines(
            'import requests',
            '',
            'BASE = "https://your-app-name.onrender.com"',
            'print(requests.get(f"{BASE}/health", timeout=30).json())',
            'r = requests.post(f"{BASE}/expenses", json={"item": "Tea", "amount": 20}, timeout=30)',
            'print(r.status_code, r.json())'
          )
        },
        code: lines(
          'log = """==> Installing dependencies',
          'Successfully installed fastapi-0.115.0',
          '==> Starting service',
          'Traceback (most recent call last):',
          '  File "/app/api.py", line 3, in <module>',
          '    import requests',
          'ModuleNotFoundError: No module named \'requests\'"""',
          '',
          'last = log.strip().splitlines()[-1]',
          'print("Last line:", last)',
          'if last.startswith("ModuleNotFoundError"):',
          '    package = last.split("\'")[1]',
          '    print(f"Fix: add {package} to requirements.txt, commit and push")'
        ),
        output: lines("Last line: ModuleNotFoundError: No module named 'requests'", 'Fix: add requests to requirements.txt, commit and push'),
        codeNotes: [
          { line: 9, note: 'Read the deploy log like a traceback: the last line first.' },
          { line: 12, note: 'The text between the quotes is the missing package name.' }
        ],
        tryIt: 'Change the last log line to mention \'pydantic\' instead and run it. The fix message changes to pydantic.',
        check: {
          question: 'What is a /health route for?',
          options: ['A quick way for you and the host to check the app is running', 'Checking the user\'s health data', 'Speeding up the API'],
          answer: 0,
          why: 'A tiny route that always returns {"status": "ok"} shows at a glance that the app is alive.'
        }
      },
      {
        title: 'A README that sells your project',
        say: [
          'The README.md is the front page of your repository. A recruiter might spend thirty seconds on it, so the most important information goes at the top.',
          'A good README has: the project name and one sentence about what it does; the live link; a list of features; the tech used (Python, FastAPI, pytest); how to run it locally, step by step; how to run the tests; and an example API request.',
          'A screenshot of the /docs page is a nice touch. Keep the writing short and honest. If the free plan sleeps, say "the first request may take up to a minute".',
          'Markdown is simple: # for headings, - for bullet points, and three backticks around code blocks. GitHub displays it nicely automatically.'
        ],
        example: 'A README is like the back cover of a book: a clear title, a short description that makes you want to read it, and the key facts. Nobody reads the whole book in the shop; the cover decides if they pick it up.',
        code: lines(
          'readme = """# Expense Tracker API',
          '',
          'Track your spending by category, from the terminal or over a web API.',
          '',
          '## Live demo',
          'https://expense-api.onrender.com/docs',
          '',
          '## Features',
          '- Add and list expenses with validation',
          '- Totals per category and per month',
          '',
          '## Setup',
          'pip install -r requirements.txt',
          '"""',
          '',
          'def missing_sections(text):',
          '    needed = ["## Live demo", "## Features", "## Setup", "## Tests"]',
          '    return [s for s in needed if s not in text]',
          '',
          'print(readme.splitlines()[0])',
          'print("Missing:", missing_sections(readme))'
        ),
        output: lines('# Expense Tracker API', "Missing: ['## Tests']"),
        codeNotes: [
          { line: 1, note: 'The README text in Markdown: # for headings, - for bullet points.' },
          { line: 18, note: 'A quick check that every important section is present.' }
        ],
        tryIt: 'Add a "## Tests" section with the line "pytest" before the closing quotes, and run it. Missing becomes [].',
        check: {
          question: 'What should be near the top of a portfolio project README?',
          options: ['What the project does and the live link', 'Your full life story', 'The complete source code'],
          answer: 0,
          why: 'A recruiter decides in seconds. A one-line description and a working link show the value immediately.'
        }
      },
      {
        title: 'Putting it together: your deployment checklist',
        say: [
          'Let us collect everything into one checklist you can use for this project and every future one. Go through it in order, and do not skip the tests.',
          'After the deploy, share the live link: on your GitHub profile, on LinkedIn, and in your CV under Projects, with one line about what it does and the tech used.',
          'Tomorrow is the last day: interview practice. You will learn to explain this project clearly, answer common Python questions, and solve small coding problems calmly.',
          'In today\'s practice you will write base_url, which picks the right address for each environment, and missing_sections, which checks a README for the important headings.'
        ],
        example: 'Pilots use a checklist before every take-off, no matter how experienced they are. A deployment checklist means you never forget the one small step that breaks everything.',
        code: lines(
          'def base_url(env):',
          '    return "https://expense-api.onrender.com" if env == "production" else "http://127.0.0.1:8000"',
          '',
          'checklist = [',
          '    ("pytest passes", True),',
          '    ("requirements.txt has every import", True),',
          '    ("no .env, .venv or data files in Git", True),',
          '    ("start command tried locally", True),',
          '    ("deployed and /health says ok", True),',
          '    ("README has live link, features, setup, tests", False),',
          ']',
          'for item, done in checklist:',
          '    print(("[x] " if done else "[ ] ") + item)',
          'print("Ready to share:", all(done for _, done in checklist))',
          'print(base_url("production") + "/docs")'
        ),
        output: lines(
          '[x] pytest passes',
          '[x] requirements.txt has every import',
          '[x] no .env, .venv or data files in Git',
          '[x] start command tried locally',
          '[x] deployed and /health says ok',
          '[ ] README has live link, features, setup, tests',
          'Ready to share: False',
          'https://expense-api.onrender.com/docs'
        ),
        codeNotes: [
          { line: 2, note: 'Pick the right address for where the code is running.' },
          { line: 14, note: 'all() is True only when every item is done.' }
        ],
        tryIt: 'Mark the README item as True and run it. "Ready to share" becomes True.',
        check: {
          question: 'Where should you share your live project link?',
          options: ['GitHub profile, LinkedIn and your CV', 'Nowhere; recruiters will find it', 'Only in the code comments'],
          answer: 0,
          why: 'A live link in the places recruiters look lets them try your work in seconds.'
        }
      }
    ],
    summary: [
      'Deploying runs your app on a public server; 127.0.0.1 only works on your own computer.',
      'The host needs requirements.txt (install) and a start command like fastapi run api.py --port $PORT.',
      'Keep settings and secrets in environment variables; they are always text, so convert them.',
      'Read deploy logs from the bottom; check /health and /docs when it is live.',
      'A good README: what it does, the live link, features, setup, tests.'
    ],
    projectStep: {
      title: 'Expense Tracker: go live',
      steps: [
        'Add a GET /health route and make sure requirements.txt lists every package.',
        'Create a free web service on a host like Render, connected to your GitHub repository.',
        'Set the build and start commands, deploy, and check /health and /docs.',
        'Write the README with the live link, features, setup and tests, and add the link to your CV.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 30,
    title: 'Interview Practice and Your Next Steps',
    goal: 'You can answer common junior Python interview questions, explain your project clearly, solve small coding problems step by step, and plan what to learn next.',
    minutes: 35,
    recap: 'Yesterday you put your Expense Tracker API online and wrote a README that shows it off.',
    parts: [
      {
        title: 'What junior Python interviews look like',
        say: [
          'Congratulations on reaching the last day. In one month you have gone from your first print() to a tested web API running on the internet. Today is about showing that in an interview.',
          'Most junior Python interviews have three parts. Questions about Python basics. A conversation about a project you built. And a short coding task, often done while talking through your thinking.',
          'Interviewers are not expecting you to know everything. They want to see that you understand the basics clearly, can explain your own work honestly, can think through a problem step by step, and are pleasant to work with.',
          'Being honest matters. If you do not know something, say "I have not used that yet, but I would look it up in the documentation, and I think it works like this". That is a much better answer than guessing confidently and being wrong.'
        ],
        example: 'An interview is less like an exam and more like a trial day with a sports team. The coach wants to see how you play, how you think under a little pressure, and whether you would be good to work with, not whether you are already a champion.',
        code: lines(
          'interview = {',
          '    "Python basics": ["lists vs tuples", "dictionaries", "exceptions"],',
          '    "Your project": ["what it does", "a problem you solved", "how you tested it"],',
          '    "Coding task": ["FizzBuzz", "reverse words", "count items"],',
          '}',
          'for part, topics in interview.items():',
          '    print(f"{part}: {\', \'.join(topics)}")'
        ),
        output: lines(
          'Python basics: lists vs tuples, dictionaries, exceptions',
          'Your project: what it does, a problem you solved, how you tested it',
          'Coding task: FizzBuzz, reverse words, count items'
        ),
        codeNotes: [
          { line: 7, note: 'join makes a readable comma-separated list of topics.' }
        ],
        tryIt: 'Add a fourth part, "Questions for them", with two questions you could ask the interviewer, like "How do you review code?"',
        check: {
          question: 'What is the best answer when you do not know something in an interview?',
          options: ['Say honestly you have not used it, and explain how you would find out', 'Guess confidently', 'Change the subject'],
          answer: 0,
          why: 'Honesty and a clear way of finding answers are what interviewers look for in juniors. Confident wrong answers are a red flag.'
        }
      },
      {
        title: 'Common Python questions',
        say: [
          'Here are questions that come up again and again, with short answers you can now give from experience. What is the difference between a list and a tuple? A list can be changed; a tuple cannot. Use a tuple for a fixed group, like coordinates.',
          'When would you use a dictionary? When you look things up by a name or key, like an expense\'s details or totals per category. When would you use a set? For unique values and fast "is it in there?" checks.',
          'What is the difference between return and print? print shows a value to a person; return hands it back to the code. How do you handle errors? With try and except, naming the specific error, and raising my own errors with clear messages for bad input.',
          'What is a virtual environment, and why use one? A private set of packages for each project, so versions do not clash. What is the difference between == and is? == compares values; is checks whether two names point to the very same object. Use is only for None: if value is None.'
        ],
        example: 'A driving test asks what the road signs mean. You have seen these signs every day for a month, so you can answer from experience, not memorised lines. These questions are the road signs of Python.',
        code: lines(
          'a = [1, 2]',
          'b = [1, 2]',
          'c = a',
          'print(a == b, a is b, a is c)',
          '',
          'point = (12.97, 77.59)',
          'try:',
          '    point[0] = 0',
          'except TypeError:',
          '    print("tuples cannot be changed")',
          '',
          'value = None',
          'print(value is None)'
        ),
        output: lines('True False True', 'tuples cannot be changed', 'True'),
        codeNotes: [
          { line: 4, note: 'a and b have equal values but are two different lists; c is the same list as a.' },
          { line: 8, note: 'A tuple cannot be changed: TypeError.' },
          { line: 13, note: 'The one place to use is: checking for None.' }
        ],
        tryIt: 'Say each answer from this lesson out loud in your own words, as if to an interviewer. Then run c.append(3) and print a, to show that a and c are one list.',
        check: {
          question: 'What is the difference between == and is?',
          options: ['== compares values; is checks if both names point to the same object', 'They are exactly the same', 'is compares values; == checks the type'],
          answer: 0,
          why: 'Two lists can be equal in value but be separate objects. Use is mainly for checking None.'
        }
      },
      {
        title: 'Explaining your project in two minutes',
        say: [
          'The most important question is often: tell me about a project you built. Prepare a two-minute answer about your Expense Tracker, and practise it out loud until it feels natural.',
          'A simple structure works well. What it is and why: "An expense tracker that shows where my money goes." How it works: "Python, with the logic in one module, a terminal menu and a FastAPI web API, saving data as JSON." Something hard you solved: "Categories like Food and food were counted separately; I fixed it at the entry point and added a regression test." How you checked it: "pytest tests, including edge cases, and it is deployed with a live link."',
          'End with what you would improve next, like a real database or user accounts. It shows you understand the limits of your project and are thinking ahead.',
          'Use your own words and your own real experiences. Interviewers will ask follow-up questions, and genuine answers are easy to expand on, while memorised ones fall apart.'
        ],
        example: 'Think of describing a trip to a friend: where you went, how you travelled, what went wrong and how you handled it, and where you want to go next time. Your project story follows the same shape.',
        code: lines(
          'pitch = {',
          '    "What and why": "An expense tracker that shows where my money goes.",',
          '    "How it works": "Python logic module, a terminal menu, and a FastAPI API storing JSON.",',
          '    "A problem I solved": "Food and food were split; I cleaned categories on entry and added a test.",',
          '    "How I checked it": "pytest with edge cases, and it is live with a /docs page.",',
          '    "Next": "A real database and user accounts.",',
          '}',
          'words = sum(len(text.split()) for text in pitch.values())',
          'print(words, "words")',
          'print("About", round(words / 120 * 60), "seconds at a calm speaking pace")'
        ),
        output: lines('53 words', 'About 26 seconds at a calm speaking pace'),
        codeNotes: [
          { line: 8, note: 'Count the words in all five parts.' },
          { line: 10, note: 'About 120 words per minute is a calm speaking pace.' }
        ],
        tryIt: 'Rewrite each part with your own details and a bit more explanation, until it reaches about 240 words: roughly two minutes.',
        check: {
          question: 'Why mention what you would improve next?',
          options: ['It shows you understand the project\'s limits and think ahead', 'To make the answer longer', 'Because the project is not finished'],
          answer: 0,
          why: 'Knowing your project\'s limits, and how you would improve it, shows maturity and real understanding.'
        }
      },
      {
        title: 'Solving a coding task out loud',
        say: [
          'In a coding task, how you think matters as much as the final code. Talk through your steps. First, repeat the problem in your own words and ask about anything unclear, like "can the list be empty?".',
          'Second, try a small example by hand. Third, write a simple solution that works, even if it is not clever. Fourth, test it with your examples, including an edge case. Only then, if there is time, improve it.',
          'FizzBuzz is a classic: for a number, return "Fizz" if it divides by 3, "Buzz" if by 5, "FizzBuzz" if by both, otherwise the number as text. The common trap is checking 3 before checking both, so 15 wrongly becomes "Fizz". You saw the same order rule with elif on Day 5.',
          'If you get stuck, say what you are thinking. Interviewers often give hints to candidates who communicate. Silence gives them nothing to work with.'
        ],
        example: 'A maths teacher gives marks for the working, not only the final answer. Even if the final number is slightly wrong, clear steps show you understand. Coding interviews mark your working too.',
        code: lines(
          'def fizz_buzz(n):',
          '    if n % 15 == 0:',
          '        return "FizzBuzz"',
          '    if n % 3 == 0:',
          '        return "Fizz"',
          '    if n % 5 == 0:',
          '        return "Buzz"',
          '    return str(n)',
          '',
          'print([fizz_buzz(n) for n in range(1, 16)])',
          'for n, expected in [(15, "FizzBuzz"), (9, "Fizz"), (10, "Buzz"), (7, "7")]:',
          '    assert fizz_buzz(n) == expected, f"{n}: got {fizz_buzz(n)}"',
          'print("All my examples pass")'
        ),
        output: lines(
          "['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']",
          'All my examples pass'
        ),
        codeNotes: [
          { line: 2, note: 'Check "both" first. 15 divides by 3 and by 5.' },
          { line: 11, note: 'Test with your own examples, as you would say out loud in an interview.' }
        ],
        tryIt: 'Move the n % 15 check below the n % 3 check and run it. The assert catches the bug for 15. Move it back.',
        check: {
          question: 'What should you do first when given a coding task in an interview?',
          options: ['Repeat the problem in your own words and ask about unclear cases', 'Start typing code immediately', 'Look for the cleverest possible solution'],
          answer: 0,
          why: 'Making sure you understand the problem, including edge cases, avoids solving the wrong problem.'
        }
      },
      {
        title: 'More classic small problems',
        say: [
          'A few more problems appear often in junior interviews. Reverse the words in a sentence: split into words, reverse the list, join them back. Count how often each word appears: the dictionary counting pattern from Day 10, or Counter. Check whether a word is a palindrome: compare it with its reverse, text[::-1].',
          'Find duplicates in a list: loop with a set of seen values, and collect any value you have already seen. Find the largest number without using max: the accumulator pattern from Day 6.',
          'You have used every idea these problems need. The trick is recognising the pattern: "counting" means a dictionary, "unique" means a set, "go through everything" means a loop.',
          'Practise one or two small problems a day on a site like HackerRank or LeetCode (easy level), writing tests for your own solutions. After a few weeks, these patterns become automatic.'
        ],
        example: 'A good cook recognises that many dishes start the same way: onion, ginger, garlic. Once you know the base, new recipes are quick. Coding problems also reuse a few bases: loops, dictionaries, sets and slicing.',
        code: lines(
          'from collections import Counter',
          '',
          'def reverse_words(sentence):',
          '    return " ".join(reversed(sentence.split()))',
          '',
          'def is_palindrome(word):',
          '    clean = word.lower()',
          '    return clean == clean[::-1]',
          '',
          'def duplicates(items):',
          '    seen, dupes = set(), []',
          '    for x in items:',
          '        if x in seen and x not in dupes:',
          '            dupes.append(x)',
          '        seen.add(x)',
          '    return dupes',
          '',
          'print(reverse_words("I love Python"))',
          'print(is_palindrome("Malayalam"), is_palindrome("Python"))',
          'print(duplicates([3, 1, 3, 2, 1, 3]))',
          'print(Counter("the cat and the hat".split()).most_common(1))'
        ),
        output: lines('Python love I', 'True False', '[3, 1]', "[('the', 2)]"),
        codeNotes: [
          { line: 4, note: 'Split, reverse, join.' },
          { line: 8, note: 'text[::-1] is a slice that reverses the text.' },
          { line: 13, note: 'A set of seen values makes the "have I seen it?" check fast.' }
        ],
        tryIt: 'Write largest(numbers) without using max(), using a loop that keeps the biggest value so far. Test it with [3, 9, 2] and with a single number.',
        check: {
          question: 'A problem asks you to count how often each word appears. Which tool fits best?',
          options: ['A dictionary (or Counter)', 'A tuple', 'A while loop with no data structure'],
          answer: 0,
          why: 'Counting per item is the dictionary pattern: each word is a key and its count is the value. Counter does it in one line.'
        }
      },
      {
        title: 'Your next steps after this month',
        say: [
          'In one month you learned Python basics, data structures, files and JSON, classes, testing, Git, APIs, FastAPI, debugging and deployment, and built a real project with them. That is a genuine foundation for a junior Python role. Now keep building on it.',
          'The most valuable next step for backend jobs is databases. Learn SQL, then use SQLite or PostgreSQL in your Expense Tracker instead of a JSON file. After that, learn user accounts and login, and Docker for packaging apps.',
          'Keep building small projects and put each one on GitHub with a README and a live link where possible. Three solid, tested projects say more than a long list of courses.',
          'Apply for jobs and internships while you keep learning; do not wait until you feel you know everything, because nobody ever does. Every interview is practice. In today\'s practice, you will solve FizzBuzz and reverse the words in a sentence, two classic interview tasks. Well done on finishing the month.'
        ],
        example: 'Learning to ride a bicycle does not end on the day you first ride without falling. You keep riding, go further, try hills. This month got you riding. Your next projects are the longer rides.',
        code: lines(
          'learned = ["basics", "lists and dictionaries", "files and JSON", "classes", "testing",',
          '           "Git", "APIs", "FastAPI", "debugging", "deployment"]',
          'next_steps = ["SQL and SQLite", "PostgreSQL", "user accounts", "Docker", "two more projects"]',
          'print(f"Learned this month: {len(learned)} topics")',
          'for week, step in enumerate(next_steps, start=1):',
          '    print(f"Week {week} after the course: {step}")',
          'print("You are ready to apply for junior Python roles. Good luck!")'
        ),
        output: lines(
          'Learned this month: 10 topics',
          'Week 1 after the course: SQL and SQLite',
          'Week 2 after the course: PostgreSQL',
          'Week 3 after the course: user accounts',
          'Week 4 after the course: Docker',
          'Week 5 after the course: two more projects',
          'You are ready to apply for junior Python roles. Good luck!'
        ),
        codeNotes: [
          { line: 5, note: 'A simple learning plan, one topic per week.' }
        ],
        tryIt: 'Replace the next steps with your own plan for the next five weeks, and run it. Save it somewhere you will see it every day.',
        check: {
          question: 'What is the most valuable next skill for a junior Python backend developer after this course?',
          options: ['Databases and SQL', 'Memorising every Python module', 'Waiting until you know everything before applying'],
          answer: 0,
          why: 'Almost every backend job stores data in a database. SQL and a real database are the natural next step for your project.'
        }
      }
    ],
    summary: [
      'Junior interviews cover Python basics, your project, and a short coding task.',
      'Be honest about what you do not know, and explain how you would find out.',
      'Prepare a two-minute project story: what, how, a problem solved, testing, next.',
      'Solve tasks out loud: restate, try an example, simple solution, test, then improve.',
      'Next: SQL and databases, more projects on GitHub, and apply while you keep learning.'
    ],
    projectStep: {
      title: 'Get job-ready',
      steps: [
        'Write your two-minute Expense Tracker story and practise it out loud three times.',
        'Solve FizzBuzz, reverse words and find duplicates without looking, with tests.',
        'Add the project, its live link and your GitHub profile to your CV and LinkedIn.',
        'Pick your next project idea, one that uses a database, and write its PLAN.md.'
      ]
    }
  }
];
