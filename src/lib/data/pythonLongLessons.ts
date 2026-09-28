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
  }
];
