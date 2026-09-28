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
          'If a line has a mistake, Python stops at that line and shows an error message. The lines above it already ran, but the lines below it never run. Beginners often think the whole program is broken, when really only one line has a problem.',
          'An error message is not a punishment. It is Python telling you exactly what went wrong and on which line. Professional developers read error messages all day. You will get better at reading them each week.',
          'One common beginner mistake is forgetting a closing quote or a closing bracket. Python then does not know where your text ends. If you see the word SyntaxError, check your quotes and brackets first.'
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
        tryIt: 'Remove the closing quote on line 2 so it reads print("Step 2: add an expense). Run it and read the error. Notice it tells you the problem is about the text not being closed. Then put the quote back.',
        check: {
          question: 'Python finds a mistake on line 3 of a 5-line program. What happens?',
          options: ['Lines 1 and 2 run, then Python stops with an error on line 3', 'Nothing runs at all', 'Python skips line 3 and runs lines 4 and 5'],
          answer: 0,
          why: 'Python runs line by line. The lines before the mistake run, then it stops at the mistake and shows an error. It does not skip ahead.'
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
        tryIt: 'Change amount = 1200 to amount = 800 and run it. Every answer flips. Predict the four answers before you press Run Code.',
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
  }
];
