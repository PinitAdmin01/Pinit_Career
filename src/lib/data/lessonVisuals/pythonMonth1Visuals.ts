import { LessonVisual } from '@/lib/types/lessonVisual';

export const PYTHON_M1_VISUALS: Record<string, { partTitle: string; visual: LessonVisual }> = {
  // Day 1, Part 1
  'python:1:0': {
    partTitle: 'What Python is and why so many people learn it',
    visual: {
      template: 'flow',
      title: 'From your instructions to the screen',
      nodes: [
        { id: 'instructions', label: 'Instructions' },
        { id: 'python', label: 'Python' },
        { id: 'screen', label: 'Screen' },
      ],
      steps: [
        {
          at: 'say1',
          caption: 'You write exact instructions for the computer.',
          values: {
            instructions: 'print("Hello! This is my first Python program.")',
            python: '',
            screen: '',
          },
          tones: { instructions: 'data', python: 'idle', screen: 'idle' },
          arrows: [],
        },
        {
          at: 'say2',
          caption: 'Python reads your instructions, one line at a time.',
          values: {
            instructions: 'print("Hello! This is my first Python program.")',
            python: 'reads it',
            screen: '',
          },
          tones: { instructions: 'idle', python: 'data', screen: 'idle' },
          arrows: [['instructions', 'python']],
        },
        {
          at: 'example',
          caption: 'The computer follows the steps and shows the result.',
          values: {
            instructions: 'print("Hello! This is my first Python program.")',
            python: 'reads it',
            screen: 'Hello! This is my first Python program.',
          },
          tones: { instructions: 'idle', python: 'idle', screen: 'ok' },
          arrows: [['python', 'screen']],
          checks: ['Hello! This is my first Python program.'],
        },
      ],
    },
  },

  // Day 1, Part 2
  'python:1:1': {
    partTitle: 'print(): showing results on the screen',
    visual: {
      template: 'table',
      title: 'Each print line makes one screen line',
      columns: ['Line', 'Screen'],
      steps: [
        {
          at: 'say1',
          caption: 'print shows what is inside the brackets.',
          rows: [
            { cells: ['print("My Expense Tracker")', 'My Expense Tracker'], tone: 'ok' },
          ],
          checks: ['My Expense Tracker'],
        },
        {
          at: 'say3',
          caption: 'Four lines run top to bottom, so four results appear in order.',
          rows: [
            { cells: ['print("My Expense Tracker")', 'My Expense Tracker'], tone: 'ok' },
            { cells: ['print("Tea", 20)', 'Tea 20'], tone: 'ok' },
            { cells: ["print('Bus ticket', 45)", 'Bus ticket 45'], tone: 'ok' },
            { cells: ['print(20 + 45)', '65'], tone: 'ok' },
          ],
          checks: ['Tea 20', 'Bus ticket 45', '65'],
        },
        {
          at: 'say4',
          caption: 'A comma prints both things with one space between.',
          rows: [
            { cells: ['print("My Expense Tracker")', 'My Expense Tracker'], tone: 'ok' },
            { cells: ['print("Tea", 20)', 'Tea 20'], tone: 'data' },
            { cells: ["print('Bus ticket', 45)", 'Bus ticket 45'], tone: 'ok' },
            { cells: ['print(20 + 45)', '65'], tone: 'ok' },
          ],
          checks: ['Tea 20', 'Bus ticket 45', '65'],
        },
      ],
    },
  },

  // Day 1, Part 3
  'python:1:2': {
    partTitle: 'How Python reads your code: line by line',
    visual: {
      template: 'table',
      title: 'Python reads top to bottom',
      columns: ['Line', 'What happens'],
      steps: [
        {
          at: 'say1',
          caption: 'Each line finishes before the next one starts.',
          rows: [
            { cells: ['line 1', 'Step 1: open the app'], tone: 'ok' },
            { cells: ['line 2', 'Step 2: add an expense'], tone: 'ok' },
            { cells: ['line 3', 'Step 3: see the total'], tone: 'ok' },
          ],
          checks: ['Step 1: open the app', 'Step 2: add an expense', 'Step 3: see the total'],
        },
        {
          at: 'say2',
          caption: 'A mistake while running stops Python; lines below never run.',
          rows: [
            { cells: ['print("Step 1: open the app")', 'Step 1: open the app'], tone: 'ok' },
            { cells: ['prnt("Step 2: add an expense")', 'NameError'], tone: 'error' },
            { cells: ['print("Step 3: see the total")', 'never ran'], tone: 'idle' },
          ],
          whatIf: 'print("Step 1: open the app")\nprnt("Step 2: add an expense")\nprint("Step 3: see the total")',
          checks: ['Step 1: open the app', 'NameError'],
        },
        {
          at: 'say4',
          caption: 'A missing quote is a SyntaxError, so nothing runs at all.',
          rows: [
            { cells: ['line 1', 'nothing printed'], tone: 'idle' },
            { cells: ['print("Step 2: add an expense)', 'SyntaxError'], tone: 'error' },
            { cells: ['line 3', 'nothing printed'], tone: 'idle' },
          ],
          whatIf: 'print("Step 1: open the app")\nprint("Step 2: add an expense)\nprint("Step 3: see the total")',
          checks: ['SyntaxError'],
          mustNotShow: ['Step 1: open the app'],
        },
      ],
    },
  },

  // Day 1, Part 4
  'python:1:3': {
    partTitle: 'Capital letters matter',
    visual: {
      template: 'compare',
      title: 'Small and capital letters are different',
      leftLabel: 'print',
      rightLabel: 'Print',
      steps: [
        {
          at: 'say1',
          caption: 'Python knows print, not Print.',
          left: { code: 'print("hello")', result: 'hello', tone: 'ok', checks: ['hello'] },
          right: { code: 'Print("hello")', result: 'NameError', tone: 'error', checks: ['NameError'], whatIf: 'Print("hello")' },
        },
        {
          at: 'say3',
          caption: 'Inside quotes any letters work, but H and h are still different.',
          left: { code: 'print("HELLO")', result: 'HELLO', tone: 'ok', checks: ['HELLO'] },
          right: { code: 'print("Hello" == "hello")', result: 'False', tone: 'data', checks: ['False'] },
        },
      ],
    },
  },

  // Day 1, Part 5
  'python:1:4': {
    partTitle: 'Comments: notes for humans',
    visual: {
      template: 'table',
      title: 'Python skips everything after #',
      columns: ['Line', 'What happens'],
      steps: [
        {
          at: 'say1',
          caption: 'A # line is a note for people; Python skips it.',
          rows: [
            { cells: ['# My Expense Tracker, day 1', 'skipped'], tone: 'idle' },
            { cells: ['print("Tea", 20)', 'Tea 20'], tone: 'ok' },
            { cells: ['# print("Movie", 300)', ''], tone: 'idle' },
            { cells: ['print("Bus", 45) # the bus to college', 'Bus 45'], tone: 'ok' },
          ],
          checks: ['Tea 20', 'Bus 45'],
        },
        {
          at: 'say3',
          caption: 'Putting # in front of a line turns it off without deleting it.',
          rows: [
            { cells: ['# My Expense Tracker, day 1', 'skipped'], tone: 'idle' },
            { cells: ['print("Tea", 20)', 'Tea 20'], tone: 'ok' },
            { cells: ['# print("Movie", 300)', 'turned off'], tone: 'data' },
            { cells: ['print("Bus", 45) # the bus to college', 'Bus 45'], tone: 'ok' },
          ],
          checks: ['Tea 20', 'Bus 45'],
          mustNotShow: ['Movie'],
        },
      ],
    },
  },

  // Day 1, Part 6
  'python:1:5': {
    partTitle: 'Putting it together: your first small program',
    visual: {
      template: 'table',
      title: 'Your first receipt',
      columns: ['Line', 'Screen'],
      steps: [
        {
          at: 'say2',
          caption: 'A title, one line per expense, and the total at the bottom.',
          rows: [
            { cells: ['print("=== My Expense Tracker ===")', '=== My Expense Tracker ==='], tone: 'ok' },
            { cells: ['print("Tea", 20)', 'Tea 20'], tone: 'ok' },
            { cells: ['print("Bus", 45)', 'Bus 45'], tone: 'ok' },
            { cells: ['print("Lunch", 120)', 'Lunch 120'], tone: 'ok' },
            { cells: ['print("Total:", 20 + 45 + 120)', 'Total: 185'], tone: 'ok' },
          ],
          checks: ['=== My Expense Tracker ===', 'Tea 20', 'Bus 45', 'Lunch 120', 'Total: 185'],
        },
        {
          at: 'say3',
          caption: '20, 45 and 120 are typed twice; tomorrow variables fix this.',
          rows: [
            { cells: ['print("=== My Expense Tracker ===")', '=== My Expense Tracker ==='], tone: 'ok' },
            { cells: ['print("Tea", 20)', 'Tea 20'], tone: 'error' },
            { cells: ['print("Bus", 45)', 'Bus 45'], tone: 'error' },
            { cells: ['print("Lunch", 120)', 'Lunch 120'], tone: 'error' },
            { cells: ['print("Total:", 20 + 45 + 120)', 'Total: 185'], tone: 'error' },
          ],
          checks: ['=== My Expense Tracker ===', 'Tea 20', 'Bus 45', 'Lunch 120', 'Total: 185'],
        },
      ],
    },
  },

  // Day 2, Part 1
  'python:2:0': {
    partTitle: 'What a variable is',
    visual: {
      template: 'boxes',
      title: 'A variable is a labelled box',
      boxes: [
        { id: 'tea', label: 'tea' },
        { id: 'bus_fare', label: 'bus_fare' },
        { id: 'lunch', label: 'lunch' },
        { id: 'total', label: 'total' },
      ],
      steps: [
        {
          at: 'say2',
          caption: 'tea = 20 stores 20 in the box named tea.',
          values: { tea: '20', bus_fare: '', lunch: '', total: '' },
          tones: { tea: 'data', bus_fare: 'idle', lunch: 'idle', total: 'idle' },
        },
        {
          at: 'say3',
          caption: '= puts the value on the right into the name on the left.',
          values: { tea: '20', bus_fare: '45', lunch: '120', total: '' },
          tones: { tea: 'data', bus_fare: 'data', lunch: 'data', total: 'idle' },
        },
        {
          at: 'example',
          caption: 'total uses the labels: 20 + 45 + 120 = 185.',
          values: { tea: '20', bus_fare: '45', lunch: '120', total: '185' },
          tones: { tea: 'idle', bus_fare: 'idle', lunch: 'idle', total: 'ok' },
          checks: ['Total: 185'],
        },
        {
          at: 'tryIt',
          caption: 'Change one box and the total follows: 215.',
          values: { tea: '20', bus_fare: '45', lunch: '150', total: '215' },
          tones: { tea: 'idle', bus_fare: 'idle', lunch: 'data', total: 'ok' },
          whatIf: 'tea = 20\nbus_fare = 45\nlunch = 150\ntotal = tea + bus_fare + lunch\nprint("Total:", total)',
          checks: ['Total: 215'],
        },
      ],
    },
  },

  // Day 2, Part 2
  'python:2:1': {
    partTitle: 'Changing a variable',
    visual: {
      template: 'boxes',
      title: 'A box keeps only its newest value',
      boxes: [
        { id: 'balance', label: 'balance' },
      ],
      steps: [
        {
          at: 'say1',
          caption: 'balance starts at 500.',
          values: { balance: '500' },
          tones: { balance: 'data' },
          checks: ['Start: 500'],
        },
        {
          at: 'say2',
          caption: 'balance = balance - 20 stores 480; 500 is forgotten.',
          values: { balance: '480' },
          tones: { balance: 'data' },
          checks: ['After tea: 480'],
        },
        {
          at: 'say3',
          caption: 'balance -= 45 is the short form: now 435.',
          values: { balance: '435' },
          tones: { balance: 'data' },
          checks: ['After bus: 435'],
        },
        {
          at: 'tryIt',
          caption: 'balance += 1000 adds the salary: 1435.',
          values: { balance: '1435' },
          tones: { balance: 'ok' },
          whatIf: 'balance = 500\nprint("Start:", balance)\nbalance = balance - 20\nprint("After tea:", balance)\nbalance -= 45\nprint("After bus:", balance)\nbalance += 1000\nprint("After salary:", balance)',
          checks: ['After salary: 1435'],
        },
      ],
    },
  },

  // Day 2, Part 3
  'python:2:2': {
    partTitle: 'Types of values: text, whole numbers, decimals',
    visual: {
      template: 'boxes',
      title: 'Every value has a type',
      boxes: [
        { id: 'item', label: 'item' },
        { id: 'amount', label: 'amount' },
        { id: 'rating', label: 'rating' },
        { id: 'twenty', label: '"20"', tappable: false },
      ],
      steps: [
        {
          at: 'say2',
          caption: 'Text is str, whole numbers are int, decimals are float.',
          values: { item: '"Tea"', amount: '20', rating: '4.5', twenty: '' },
          tones: { item: 'data', amount: 'data', rating: 'data', twenty: 'idle' },
          types: { item: 'str', amount: 'int', rating: 'float' },
        },
        {
          at: 'say3',
          caption: 'type() tells you the type: str, int or float.',
          values: { item: '"Tea"', amount: '20', rating: '4.5', twenty: '' },
          tones: { item: 'ok', amount: 'ok', rating: 'ok', twenty: 'idle' },
          types: { item: 'str', amount: 'int', rating: 'float' },
          checks: ["<class 'str'>", "<class 'int'>", "<class 'float'>"],
        },
        {
          at: 'say4',
          caption: 'Quotes make it text, even when it looks like a number.',
          values: { item: '"Tea"', amount: '20', rating: '4.5', twenty: '"20"' },
          tones: { item: 'idle', amount: 'idle', rating: 'idle', twenty: 'error' },
          types: { item: 'str', amount: 'int', rating: 'float', twenty: 'str' },
          checks: ["<class 'str'>"],
        },
      ],
    },
  },

  // Day 2, Part 4
  'python:2:3': {
    partTitle: 'True and False: the bool type',
    visual: {
      template: 'table',
      title: 'Questions answered True or False',
      columns: ['Question', 'Answer'],
      steps: [
        {
          at: 'say2',
          caption: 'A question about a value gives True or False.',
          rows: [
            { cells: ['amount > 1000', 'True'], tone: 'ok' },
            { cells: ['amount == 500', 'False'], tone: 'idle' },
          ],
          checks: ['True', 'False'],
        },
        {
          at: 'say3',
          caption: '!= means not equal; >= means more than or equal.',
          rows: [
            { cells: ['amount > 1000', 'True'], tone: 'ok' },
            { cells: ['amount == 500', 'False'], tone: 'idle' },
            { cells: ['amount != 500', 'True'], tone: 'ok' },
            { cells: ['is_big = amount >= 1000', 'True'], tone: 'ok' },
          ],
          checks: ['True', 'False', 'True', 'Big expense? True'],
        },
        {
          at: 'tryIt',
          caption: 'With 800, two answers change and two stay the same.',
          rows: [
            { cells: ['amount > 1000', 'False'], tone: 'data' },
            { cells: ['amount == 500', 'False'], tone: 'idle' },
            { cells: ['amount != 500', 'True'], tone: 'ok' },
            { cells: ['is_big = amount >= 1000', 'False'], tone: 'data' },
          ],
          whatIf: 'amount = 800\nprint(amount > 1000)\nprint(amount == 500)\nprint(amount != 500)\nis_big = amount >= 1000\nprint("Big expense?", is_big)',
          checks: ['Big expense? False'],
        },
      ],
    },
  },

  // Day 2, Part 5
  'python:2:4': {
    partTitle: 'Converting between types',
    visual: {
      template: 'flow',
      title: "Changing a value's type",
      nodes: [
        { id: 'value', label: 'value', tappable: false },
        { id: 'tool', label: 'str() / int()', tappable: false },
        { id: 'result', label: 'result', tappable: false },
      ],
      steps: [
        {
          at: 'say2',
          caption: 'str(20) makes the text "20", so it can join other text.',
          values: { value: '20', tool: 'str()', result: 'Tea costs 20' },
          tones: { value: 'idle', tool: 'idle', result: 'ok' },
          arrows: [['value', 'tool'], ['tool', 'result']],
          checks: ['Tea costs 20'],
        },
        {
          at: 'say3',
          caption: 'int("45") makes the number 45, so maths works.',
          values: { value: '"45"', tool: 'int()', result: '45 + 5 = 50' },
          tones: { value: 'idle', tool: 'idle', result: 'ok' },
          arrows: [['value', 'tool'], ['tool', 'result']],
          checks: ['50'],
        },
        {
          at: 'say4',
          caption: 'Text that is not a number cannot become a number.',
          values: { value: '"abc"', tool: 'int()', result: 'ValueError' },
          tones: { value: 'idle', tool: 'idle', result: 'error' },
          arrows: [['value', 'tool'], ['tool', 'result']],
          whatIf: 'int("abc")',
          checks: ['ValueError'],
        },
      ],
    },
  },

  // Day 2, Part 6
  'python:2:5': {
    partTitle: 'Good variable names and a better tracker',
    visual: {
      template: 'boxes',
      title: 'The tracker with variables',
      boxes: [
        { id: 'monthly_budget', label: 'monthly_budget' },
        { id: 'tea', label: 'tea' },
        { id: 'bus_fare', label: 'bus_fare' },
        { id: 'lunch', label: 'lunch' },
        { id: 'total', label: 'total' },
        { id: 'left', label: 'left' },
      ],
      steps: [
        {
          at: 'say1',
          caption: 'Each amount is stored once; total and left are worked out.',
          values: { monthly_budget: '5000', tea: '20', bus_fare: '45', lunch: '120', total: '185', left: '4815' },
          tones: { monthly_budget: 'idle', tea: 'idle', bus_fare: 'idle', lunch: 'idle', total: 'ok', left: 'ok' },
          checks: ['Spent today: 185', 'Left this month: 4815', 'Over budget? False'],
        },
        {
          at: 'tryIt',
          caption: 'With a budget of 100 the money left is negative.',
          values: { monthly_budget: '100', tea: '20', bus_fare: '45', lunch: '120', total: '185', left: '-85' },
          tones: { monthly_budget: 'data', tea: 'idle', bus_fare: 'idle', lunch: 'idle', total: 'idle', left: 'error' },
          whatIf: 'monthly_budget = 100\ntea = 20\nbus_fare = 45\nlunch = 120\ntotal = tea + bus_fare + lunch\nmoney_left = monthly_budget - total\nprint("Spent today:", total)\nprint("Left this month:", money_left)\nprint("Over budget?", money_left < 0)',
          checks: ['Left this month: -85', 'Over budget? True'],
        },
      ],
    },
  },

  // Day 3, Part 1
  'python:3:0': {
    partTitle: 'Strings and joining them',
    visual: {
      template: 'flow',
      title: '+ joins text exactly as it is',
      showSpaces: true,
      nodes: [
        { id: 'a', label: 'Hello, ', tappable: false },
        { id: 'b', label: 'first' },
        { id: 'c', label: '!', tappable: false },
        { id: 'greeting', label: 'greeting' },
      ],
      steps: [
        {
          at: 'say2',
          caption: '+ joins in order; the space must be inside the quotes.',
          values: { a: 'Hello,·', b: 'Asha', c: '!', greeting: 'Hello, Asha!' },
          tones: { a: 'data', b: 'data', c: 'data', greeting: 'ok' },
          arrows: [['a', 'b'], ['b', 'c']],
          checks: ['Hello, Asha!'],
        },
        {
          at: 'say3',
          caption: '* repeats a string: one dash, 20 times.',
          values: { a: '-', b: '* 20', c: '', greeting: '--------------------' },
          tones: { a: 'idle', b: 'idle', c: 'idle', greeting: 'ok' },
          arrows: [],
          checks: ['--------------------'],
        },
      ],
    },
  },

  // Day 3, Part 2
  'python:3:1': {
    partTitle: 'Length and positions',
    visual: {
      template: 'letters',
      title: 'Positions start at 0',
      text: 'Priya',
      steps: [
        {
          at: 'say1',
          caption: 'len() counts every character: 5.',
          range: [0, 5],
          result: 'len(name) = 5',
          tone: 'ok',
          checks: ['5'],
        },
        {
          at: 'say2',
          caption: 'The first character is at position 0, not 1.',
          pointer: 0,
          result: 'name[0] = P',
          tone: 'data',
          checks: ['P'],
        },
        {
          at: 'say3',
          caption: '-1 is always the last character.',
          pointer: -1,
          result: 'name[-1] = a',
          tone: 'data',
          checks: ['a'],
        },
        {
          at: 'say4',
          caption: 'There is nothing at position 10, so Python gives an IndexError.',
          pointer: 10,
          result: 'IndexError',
          tone: 'error',
          whatIf: 'name = "Priya"\nprint(name[10])',
          checks: ['IndexError'],
        },
      ],
    },
  },

  // Day 3, Part 3
  'python:3:2': {
    partTitle: 'Slicing: taking part of a string',
    visual: {
      template: 'letters',
      title: 'A slice stops before stop',
      text: '2026-09-28',
      steps: [
        {
          at: 'say2',
          caption: 'Positions 0 to 3 are taken; position 4 is not.',
          range: [0, 4],
          result: 'date[0:4] = 2026',
          tone: 'ok',
          checks: ['2026'],
        },
        {
          at: 'say3',
          caption: 'Leave out stop to go to the end: the last two characters.',
          range: [8, 10],
          result: 'date[-2:] = 28',
          tone: 'ok',
          checks: ['28'],
        },
        {
          at: 'say4',
          caption: 'Slicing gives a new string; the original stays the same.',
          result: 'date is still 2026-09-28',
          tone: 'data',
        },
      ],
    },
  },

  // Day 3, Part 4
  'python:3:3': {
    partTitle: 'String tools: upper, lower, strip, replace',
    visual: {
      template: 'flow',
      title: 'Cleaning text step by step',
      showSpaces: true,
      nodes: [
        { id: 'typed', label: 'typed' },
        { id: 'strip', label: 'strip()' },
        { id: 'lower', label: 'lower()' },
        { id: 'category', label: 'category' },
      ],
      steps: [
        {
          at: 'say2',
          caption: 'lower() turns FOOD into food, so all spellings match.',
          values: { typed: 'FOOD', strip: '', lower: 'lower()', category: 'food' },
          tones: { typed: 'idle', strip: 'idle', lower: 'data', category: 'ok' },
          arrows: [['lower', 'category']],
        },
        {
          at: 'say3',
          caption: 'strip() removes the spaces first, then lower() runs.',
          values: { typed: '··FOOD·', strip: 'strip()', lower: 'lower()', category: 'food' },
          tones: { typed: 'idle', strip: 'data', lower: 'data', category: 'ok' },
          arrows: [['typed', 'strip'], ['strip', 'lower'], ['lower', 'category']],
          checks: ['[food]'],
        },
        {
          at: 'say4',
          caption: 'typed is unchanged; the clean text is stored in category.',
          values: { typed: '··FOOD·', strip: '', lower: '', category: 'food' },
          tones: { typed: 'data', strip: 'idle', lower: 'idle', category: 'ok' },
          arrows: [],
        },
      ],
    },
  },

  // Day 3, Part 5
  'python:3:4': {
    partTitle: 'Searching inside text',
    visual: {
      template: 'table',
      title: 'Asking questions about text',
      columns: ['Question', 'Answer'],
      steps: [
        {
          at: 'say1',
          caption: 'in checks whether the smaller text is inside the bigger one.',
          rows: [
            { cells: ['"card" in note', 'True'], tone: 'ok' },
            { cells: ['"cash" in note', 'False'], tone: 'idle' },
          ],
          checks: ['True', 'False'],
        },
        {
          at: 'say2',
          caption: 'endswith() checks the end, startswith() the beginning.',
          rows: [
            { cells: ['"card" in note', 'True'], tone: 'ok' },
            { cells: ['"cash" in note', 'False'], tone: 'idle' },
            { cells: ['"invoice.pdf".endswith(".pdf")', 'True'], tone: 'ok' },
          ],
          checks: ['True', 'False', 'True'],
        },
        {
          at: 'say3',
          caption: 'count() counts copies; find() gives the first position.',
          rows: [
            { cells: ['"card" in note', 'True'], tone: 'ok' },
            { cells: ['"cash" in note', 'False'], tone: 'idle' },
            { cells: ['"invoice.pdf".endswith(".pdf")', 'True'], tone: 'ok' },
            { cells: ['"banana".count("a")', '3'], tone: 'ok' },
            { cells: ['note.find("team")', '11'], tone: 'ok' },
          ],
          checks: ['True', 'False', 'True', '3', '11'],
        },
        {
          at: 'say4',
          caption: 'Capital C is different, so "Card" is not found.',
          rows: [
            { cells: ['"card" in note', 'True'], tone: 'ok' },
            { cells: ['"cash" in note', 'False'], tone: 'idle' },
            { cells: ['"invoice.pdf".endswith(".pdf")', 'True'], tone: 'ok' },
            { cells: ['"banana".count("a")', '3'], tone: 'ok' },
            { cells: ['note.find("team")', '11'], tone: 'ok' },
            { cells: ['"Card" in note', 'False'], tone: 'error' },
          ],
          whatIf: 'note = "Expense on team card"\nprint("card" in note)\nprint("cash" in note)\nprint("invoice.pdf".endswith(".pdf"))\nprint("banana".count("a"))\nprint(note.find("team"))\nprint("Card" in note)',
          checks: ['False'],
          lastLine: 'False',
        },
      ],
    },
  },

  // Day 3, Part 6
  'python:3:5': {
    partTitle: 'Putting it together: tidy expense labels',
    visual: {
      template: 'flow',
      title: 'Clean the input, then use it',
      showSpaces: true,
      nodes: [
        { id: 'item', label: 'item' },
        { id: 'clean_item', label: 'clean_item' },
        { id: 'category', label: 'category' },
        { id: 'clean_category', label: 'clean_category' },
        { id: 'label', label: 'label', tappable: false },
      ],
      steps: [
        {
          at: 'say1',
          caption: 'Typed text is messy: extra spaces and random capitals.',
          values: {
            item: '··masala·CHAI·',
            clean_item: '',
            category: '·FOOD',
            clean_category: '',
            label: '',
          },
          tones: { item: 'error', clean_item: 'idle', category: 'error', clean_category: 'idle', label: 'idle' },
          arrows: [],
        },
        {
          at: 'say2',
          caption: 'strip(), capitalize() and lower() clean it, then + builds the label.',
          values: {
            item: '··masala·CHAI·',
            clean_item: 'Masala chai',
            category: '·FOOD',
            clean_category: 'food',
            label: 'Masala chai (food)',
          },
          tones: { item: 'idle', clean_item: 'idle', category: 'idle', clean_category: 'idle', label: 'ok' },
          arrows: [
            ['item', 'clean_item'],
            ['category', 'clean_category'],
            ['clean_item', 'label'],
            ['clean_category', 'label'],
          ],
          checks: ['Masala chai (food)'],
        },
      ],
    },
  },
};
