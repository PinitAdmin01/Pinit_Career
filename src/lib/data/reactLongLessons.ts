import type { LongLesson } from './longLessons';

/**
 * Long-format lessons for the 1-Month React course (quest prefix `react-basics`).
 * Days follow REACT_30_DAYS_CONFIGS in react30DayData.ts. Written for beginners, in plain words.
 * Every `code` sample runs as plain JavaScript and prints exactly its `output`
 * (checked by tests/react_long_lessons.test.ts).
 */
const lines = (...l: string[]) => l.join('\n');

export const REACT_LONG_LESSONS: LongLesson[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 1,
    title: 'How a Website Works: HTML, CSS, JavaScript and React',
    goal: 'You can explain how a web page is built, what React is used for, and you will run your first JavaScript code.',
    minutes: 30,
    parts: [
      {
        title: 'What happens when you open a website',
        say: [
          'Welcome to your first day. Let us start with something you do every day: opening a website. When you type an address like flipkart.com and press Enter, your browser, which is Chrome or Safari, sends a request over the internet to a computer called a server.',
          'The server sends back a few files. Your browser reads those files and draws the page on your screen. That is all a website is: files that a browser knows how to read and draw.',
          'Those files are written in three languages. HTML says what is on the page. CSS says how it looks. JavaScript says what happens when you click, type or scroll. Every website in the world, big or small, uses these three.',
          'React, which you will learn this month, is a tool written in JavaScript. It helps you build the screens of an app faster and with fewer mistakes. But first, you need to be comfortable with the basics, so this first week is about JavaScript.'
        ],
        example: 'Think of ordering food at a restaurant. You (the browser) ask the waiter for a dish. The kitchen (the server) prepares it and sends it to your table. The dish arrives on a plate, and you see and enjoy it. A website works the same way: you ask, the server sends files, and the browser shows them to you.',
        code: lines(
          'console.log("Hello! This is my first line of JavaScript.");'
        ),
        output: 'Hello! This is my first line of JavaScript.',
        codeNotes: [
          { line: 1, note: 'console.log prints a message. Developers use it all day to see what their code is doing. The text inside the quotes is printed exactly as written.' }
        ],
        tryIt: 'Change the message inside the quotes to your own name, for example "Hello, I am Priya", and press Run Code. Make sure the quotes stay at both ends.',
        check: {
          question: 'When you open a website, what does the server send to your browser?',
          options: ['Files that the browser reads and draws on screen', 'A finished photo of the page', 'Nothing, the page is already inside the browser'],
          answer: 0,
          why: 'The server sends files (HTML, CSS and JavaScript). The browser reads them and draws the page for you.'
        }
      },
      {
        title: 'HTML: the content of the page',
        say: [
          'HTML is the first layer. It describes what is on the page: headings, paragraphs, images, buttons and links. HTML does not decide colours or actions. It only says: here is a heading, here is a button.',
          'HTML is written with tags. A tag is a word inside angle brackets, like <h1>. Most tags come in pairs: an opening tag <h1> and a closing tag </h1> with a slash. The text between them is the content. So <h1>My Job Tracker</h1> means: show "My Job Tracker" as a big heading.',
          'A few tags you will see all the time: h1 for the main heading, p for a paragraph, button for a button, img for an image, and div, which is a box used to group other things together.',
          'Later this month, you will write something that looks very much like HTML inside your React code. So getting used to tags now makes React feel familiar.'
        ],
        example: 'HTML is like the skeleton of a body, or the bricks of a house before painting. It gives the structure: where the rooms, doors and windows are. It does not say what colour the walls are.',
        code: lines(
          'const heading = "<h1>My Job Tracker</h1>";',
          'const button = "<button>Add Job</button>";',
          'console.log(heading);',
          'console.log(button);'
        ),
        output: lines('<h1>My Job Tracker</h1>', '<button>Add Job</button>'),
        codeNotes: [
          { line: 1, note: 'We store some HTML as text so we can print it. A real browser would draw this as a big heading.' },
          { line: 2, note: 'A button tag. The words between the tags are what the button says.' }
        ],
        tryIt: 'Add a third line that stores a paragraph: const para = "<p>Track every job you apply to.</p>"; and print it with console.log(para);',
        check: {
          question: 'What does HTML decide on a web page?',
          options: ['What is on the page, like headings and buttons', 'The colours and fonts', 'What happens when you click'],
          answer: 0,
          why: 'HTML is the content and structure. CSS decides the look, and JavaScript decides the actions.'
        }
      },
      {
        title: 'CSS: how the page looks',
        say: [
          'CSS is the second layer. It decides how things look: colours, sizes, fonts, spacing, and where things sit on the screen. The same HTML can look completely different with different CSS.',
          'CSS works with rules. A rule picks some elements and gives them a style. For example, the rule h1 { color: blue; } means: make every h1 heading blue. The part before the curly brackets is what to style, and the part inside is how.',
          'CSS is also how a page adjusts to phones and laptops. On a phone, you might show one card per row; on a laptop, three cards per row. You will do exactly this for your Job Tracker in week three.',
          'You do not need to master CSS today. Just remember the idea: HTML is what is there, CSS is how it looks.'
        ],
        example: 'If HTML is the bricks of a house, CSS is the paint, the tiles and the furniture. Two houses with the same bricks can look totally different inside because of how they are decorated.',
        code: lines(
          'const rule = "h1 { color: blue; font-size: 32px; }";',
          'console.log("This CSS rule makes every h1 heading:");',
          'console.log(rule);'
        ),
        output: lines('This CSS rule makes every h1 heading:', 'h1 { color: blue; font-size: 32px; }'),
        codeNotes: [
          { line: 1, note: 'A CSS rule: h1 is what to style; color and font-size are how it should look.' }
        ],
        tryIt: 'Change blue to green and 32px to 40px, then run it again. In a real page, the heading would become bigger and green.',
        check: {
          question: 'Which layer would you change to make a button red?',
          options: ['HTML', 'CSS', 'The server'],
          answer: 1,
          why: 'Colours, sizes and fonts are all decided by CSS.'
        }
      },
      {
        title: 'JavaScript: making the page do things',
        say: [
          'JavaScript is the third layer, and it is the one you will write every day. JavaScript makes a page react: when you click Like, the heart turns red and the number goes up. When you type in a search box, the results change. That is JavaScript.',
          'JavaScript is a programming language. You write instructions, and the computer follows them from top to bottom, one line at a time. Each instruction usually ends with a semicolon.',
          'JavaScript can work with text, which we write inside quotes, and with numbers, which we write without quotes. It can do maths, join pieces of text together, make decisions and much more. You will learn all of this in the next few days.',
          'Notice something important in the code below: 2 + 3 gives 5 because they are numbers. But "Asha" + " Rao" joins the two texts together. The same plus sign does different jobs depending on what you give it.'
        ],
        example: 'JavaScript is like the electricity and switches in a house. The bricks (HTML) and paint (CSS) are there, but nothing works until you press a switch and the fan starts or the light turns on.',
        code: lines(
          'console.log("2 + 3 is");',
          'console.log(2 + 3);',
          'console.log("Asha" + " Rao");',
          'console.log(10 * 4);'
        ),
        output: lines('2 + 3 is', '5', 'Asha Rao', '40'),
        codeNotes: [
          { line: 2, note: 'No quotes, so these are numbers. JavaScript adds them and prints 5.' },
          { line: 3, note: 'With quotes these are text. The plus sign joins them into "Asha Rao".' },
          { line: 4, note: 'The star * means multiply.' }
        ],
        tryIt: 'Add a line console.log(100 - 35); and another line console.log("100" + "35");. Run it and compare the two answers. Why are they different?',
        check: {
          question: 'What does console.log("5" + "5") print?',
          options: ['10', '55', 'An error'],
          answer: 1,
          why: 'Both are in quotes, so they are text. The plus sign joins text, giving "55".'
        }
      },
      {
        title: 'What React is and why companies use it',
        say: [
          'Now, what is React? React is a JavaScript library made by Facebook, now called Meta. A library is ready-made code that other developers share so you do not have to write everything yourself. Instagram, Netflix, Swiggy, Zomato and thousands of companies use React for their websites.',
          'The big idea of React is components. A component is a small, reusable piece of the screen, like a job card, a button, or a menu. You build each piece once, and then use it again and again with different information. A full app is just many components put together.',
          'Without React, when data changes, for example when a new job is added, you would have to find the right place on the page and change it yourself. That gets messy fast. With React, you only change the data, and React updates the screen for you.',
          'In the code below, JobCard is a tiny machine that builds a card from a job title. We use it three times with different titles. Do not worry about how to write it yet. That is Day 3. Just notice: one piece, used many times.'
        ],
        example: 'Think of LEGO blocks. You do not make a new kind of block for every toy. You use the same blocks again and again to build a car, a house or a robot. React components are your blocks, and your app is the toy you build with them.',
        code: lines(
          'function JobCard(title) {',
          '  return "[ Job: " + title + " ]";',
          '}',
          '',
          'console.log(JobCard("Frontend Developer"));',
          'console.log(JobCard("React Developer"));',
          'console.log(JobCard("Web Designer"));'
        ),
        output: lines('[ Job: Frontend Developer ]', '[ Job: React Developer ]', '[ Job: Web Designer ]'),
        codeNotes: [
          { line: 1, note: 'This creates a reusable piece called JobCard. You will learn how to write these on Day 3.' },
          { line: 5, note: 'We use the same JobCard three times, each time with a different title.' }
        ],
        tryIt: 'Add one more line that makes a card for a job you would like to apply to, for example console.log(JobCard("UI Developer"));',
        check: {
          question: 'What is a React component?',
          options: ['A small reusable piece of the screen', 'A type of database', 'A kind of web browser'],
          answer: 0,
          why: 'Components are reusable screen pieces, like buttons or cards. Apps are built by putting many components together.'
        }
      },
      {
        title: 'Your month plan and your Job Tracker project',
        say: [
          'Here is the plan for this month, so you always know where you are. Week one: the JavaScript that React needs. Week two: React basics, like components, props, state and forms. Week three: real-app skills, like loading data from the internet and multiple pages. Week four: you finish your own app, put it online, and practise for interviews.',
          'Every day has the same shape. First a lesson like this one, about thirty minutes. Then two practice tasks where you write small pieces of code, with hints if you get stuck. Then one small step of your project. In total, about one hour a day.',
          'Your project is a Job Tracker: an app where you save the jobs you applied to, mark them as applied, interview, offer or rejected, search and filter them, and see a summary. It is simple enough to finish in a month, and real enough to show in an interview. By day twenty-nine, it will be live on the internet with your own link.',
          'After every five lessons there is a short test on those five days, so you can check you really understood before moving on. If something is not clear during a lesson, press "No, explain further" and ask me. There are no silly questions.'
        ],
        example: 'Learning to code is like learning to drive. On day one you learn what the pedals and the steering do. You are not driving on the highway yet, but every small step makes the next one easier. By the end of the month, you will have driven your own car: your deployed app.',
        tryIt: 'Take a notebook or a notes app and write down 5 jobs you would like to apply to, with the company name. You will use them as real data in your Job Tracker.',
        check: {
          question: 'What does a normal day in this course include?',
          options: ['Only watching a video', 'A lesson, two practice tasks and one project step', 'Only a test'],
          answer: 1,
          why: 'Each day has a lesson, then practice with hints, then a small step of your Job Tracker project, about one hour in total.'
        }
      }
    ],
    summary: [
      'A website is files (HTML, CSS, JavaScript) that the browser reads and draws.',
      'HTML is the content, CSS is the look, JavaScript is the behaviour.',
      'console.log prints a message; text goes inside quotes, numbers do not.',
      'React builds screens from small reusable pieces called components.'
    ],
    projectStep: {
      title: 'Choose your data',
      steps: [
        'Write down 5 jobs you would like to apply to: job title and company.',
        'Next to each, write one of these statuses: applied, interview, offer or rejected (a guess is fine).',
        'Keep this list. Your Job Tracker will use it from Day 4.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 2,
    title: 'Variables and Data Types',
    goal: 'You can store information in variables, know the main kinds of values, and compare values correctly.',
    minutes: 30,
    recap: 'Yesterday you learned that a web page is HTML, CSS and JavaScript, and you printed your first message with console.log.',
    parts: [
      {
        title: 'What a variable is',
        say: [
          'Programs need to remember things: your name, the number of items in a cart, whether you are logged in. To remember something, we store it in a variable.',
          'A variable is a box with a label. You put a value inside the box, and later you use the label to get the value back. In JavaScript, you create a variable with the word let, then the name, then an equals sign, then the value.',
          'For example, let jobTitle = "Frontend Developer"; creates a box called jobTitle and puts the text "Frontend Developer" inside it. After that, whenever you write jobTitle, JavaScript uses the value inside the box.',
          'The equals sign here does not mean "is equal to" like in maths. It means "put this value into this box". Read it as: jobTitle gets "Frontend Developer".'
        ],
        example: 'Think of the labelled jars in a kitchen: one says Sugar, one says Salt. You do not need to open every jar to find the sugar. You read the label. Variables are labelled jars for your program.',
        code: lines(
          'let jobTitle = "Frontend Developer";',
          'let company = "Infosys";',
          'console.log(jobTitle);',
          'console.log(company);'
        ),
        output: lines('Frontend Developer', 'Infosys'),
        codeNotes: [
          { line: 1, note: 'let creates a variable named jobTitle and stores the text in it.' },
          { line: 3, note: 'Using the name without quotes prints the value inside the box.' }
        ],
        tryIt: 'Add a variable called city with your city name, and print it. Then try console.log("city"); with quotes. What is the difference?',
        check: {
          question: 'What does let score = 10; do?',
          options: ['Checks if score is 10', 'Creates a variable called score and stores 10 in it', 'Prints 10'],
          answer: 1,
          why: 'let creates a variable, and the equals sign puts the value 10 into it.'
        }
      },
      {
        title: 'Changing values, and const for values that stay the same',
        say: [
          'A variable made with let can be changed later. You simply write the name, an equals sign and the new value, without let this time. The old value is thrown away and the new one takes its place.',
          'Some values should never change after you set them, like your date of birth or the name of your app. For those, use const instead of let. If any code later tries to change a const, JavaScript stops with an error. That protects you from mistakes.',
          'A simple rule many companies follow: use const by default, and use let only when you know the value will change, like a counter or a total.',
          'In React, you will use const almost everywhere, so get comfortable with it now.'
        ],
        example: 'Your Aadhaar number is like a const: it is set once and never changes. Your mobile balance is like a let: it goes up when you recharge and down when you use data.',
        code: lines(
          'const appName = "Job Tracker";',
          'let jobsApplied = 2;',
          'console.log(appName + " - jobs applied: " + jobsApplied);',
          'jobsApplied = 3;',
          'console.log(appName + " - jobs applied: " + jobsApplied);'
        ),
        output: lines('Job Tracker - jobs applied: 2', 'Job Tracker - jobs applied: 3'),
        codeNotes: [
          { line: 1, note: 'const: this name will never change.' },
          { line: 4, note: 'No let here. We are changing the value in the existing box from 2 to 3.' }
        ],
        tryIt: 'Add the line appName = "Job App"; at the end and run it. Read the error message. It tells you that a const cannot be changed.',
        check: {
          question: 'Which should you use for a value that will change, like a counter?',
          options: ['const', 'let', 'Either, it makes no difference'],
          answer: 1,
          why: 'let is for values that change. const is for values that stay the same.'
        }
      },
      {
        title: 'Strings: working with text',
        say: [
          'In programming, text is called a string, like a string of letters. Strings are always inside quotes. You can use double quotes "like this" or single quotes \'like this\'. Just start and end with the same kind.',
          'You can join strings with the plus sign. You can also ask a string questions. For example, name.length tells you how many characters it has, and name.toUpperCase() gives you the same text in capital letters.',
          'Things like .length and .toUpperCase() are built-in tools that every string has. You write the variable name, a dot, and the tool name. Tools that do an action end with round brackets.',
          'Watch out for spaces when joining. "Asha" + "Rao" gives "AshaRao" with no space. You have to add the space yourself: "Asha" + " " + "Rao".'
        ],
        example: 'Your name printed on an ID card, a message you send on WhatsApp, a product name on Amazon: these are all strings in the app\'s code.',
        code: lines(
          'const firstName = "asha";',
          'const lastName = "rao";',
          'const fullName = firstName + " " + lastName;',
          'console.log(fullName);',
          'console.log(fullName.length);',
          'console.log(fullName.toUpperCase());'
        ),
        output: lines('asha rao', '8', 'ASHA RAO'),
        codeNotes: [
          { line: 3, note: 'We join three strings: first name, a space, and last name.' },
          { line: 5, note: '.length counts characters. The space counts too, so it is 8.' },
          { line: 6, note: '.toUpperCase() gives a capital-letter copy. The original is not changed.' }
        ],
        tryIt: 'Use your own first and last name. Then try fullName.toLowerCase() to see the opposite tool.',
        check: {
          question: 'What does "Hi" + "there" print?',
          options: ['Hi there', 'Hithere', 'Hi + there'],
          answer: 1,
          why: 'The plus sign joins strings exactly as they are. There is no space unless you add one.'
        }
      },
      {
        title: 'Numbers and maths',
        say: [
          'Numbers are written without quotes: 10, 3.5, -2. JavaScript can do maths with them: plus, minus, star for multiply, and slash for divide.',
          'There is also the percent sign, which gives the remainder after dividing. 10 % 3 is 1, because 3 goes into 10 three times with 1 left over. This is often used to check if a number is even: an even number % 2 gives 0.',
          'Here is a very common beginner mistake. The number 5 and the string "5" are different. 5 + 5 is 10, but "5" + 5 is "55", because when one side is text, the plus sign joins instead of adding. Values typed by users in a form usually arrive as text, so this mistake happens a lot in real apps.',
          'To turn text into a number, use Number("5"). Then the maths works properly.'
        ],
        example: 'A shopping cart total is maths on numbers: price times quantity, plus delivery fee, minus discount. If the price was stored as text by mistake, your cart might show 500 + 40 as "50040" instead of 540.',
        code: lines(
          'const price = 500;',
          'const delivery = 40;',
          'console.log(price + delivery);',
          'console.log(price * 2);',
          'console.log(10 % 3);',
          'console.log("500" + 40);',
          'console.log(Number("500") + 40);'
        ),
        output: lines('540', '1000', '1', '50040', '540'),
        codeNotes: [
          { line: 5, note: 'The remainder of 10 divided by 3 is 1.' },
          { line: 6, note: 'The mistake: "500" is text, so + joins, giving 50040.' },
          { line: 7, note: 'The fix: Number() turns the text into a real number first.' }
        ],
        tryIt: 'Work out a monthly salary: create const yearly = 600000; and print yearly / 12.',
        check: {
          question: 'What does console.log("10" + 5) print?',
          options: ['15', '105', 'An error'],
          answer: 1,
          why: 'One side is text, so the plus sign joins them into "105". Use Number("10") to do real maths.'
        }
      },
      {
        title: 'Booleans and comparing values',
        say: [
          'A boolean is a value that is either true or false, nothing else. Apps use booleans for yes/no facts: is the user logged in? Is the cart empty? Did this job reply?',
          'You usually get a boolean by comparing two values. Greater than > and less than < work like in maths. >= means greater than or equal to. To check if two values are the same, JavaScript uses three equals signs: ===. To check if they are different, use !==.',
          'Why three equals signs? A single = means "store in a box". Two == exists too, but it tries to be clever and treats 5 and "5" as the same, which causes bugs. Always use === and !==. This is the rule in almost every company.',
          'Booleans are the basis of every decision your app makes. Tomorrow you will use them with if and else.'
        ],
        example: 'A lift has a boolean: is the door open, true or false? The lift only moves when that is false. Your app works the same way: it checks true/false facts before doing something.',
        code: lines(
          'const salary = 450000;',
          'console.log(salary > 300000);',
          'console.log(salary >= 500000);',
          'console.log("offer" === "offer");',
          'console.log(5 === "5");',
          'const isLoggedIn = true;',
          'console.log(isLoggedIn);'
        ),
        output: lines('true', 'false', 'true', 'false', 'true'),
        codeNotes: [
          { line: 2, note: '450000 is more than 300000, so this is true.' },
          { line: 5, note: 'A number and a string are not the same with ===, so this is false. That is what we want.' },
          { line: 6, note: 'You can store true or false directly in a variable. No quotes.' }
        ],
        tryIt: 'Change salary to 500000 and run again. Which line changed its answer, and why?',
        check: {
          question: 'Which is the correct way to check if status is "offer"?',
          options: ['status = "offer"', 'status === "offer"', 'status => "offer"'],
          answer: 1,
          why: 'Three equals signs compare values. A single equals sign would store "offer" in status instead of checking it.'
        }
      },
      {
        title: 'null, undefined, typeof and good names',
        say: [
          'Two special values mean "nothing". undefined means a value was never given: for example, a variable you created without putting anything in it. null means you are saying on purpose "there is nothing here", like a job with no reply yet.',
          'When you are not sure what kind of value you have, use typeof. It tells you "string", "number", "boolean" or "undefined". This is a great tool when debugging.',
          'Finally, names. A good variable name says what is inside: jobTitle is much better than x or data1. JavaScript developers write names in camelCase: the first word small, each new word starting with a capital letter, like appliedDate or isRemoteJob. Names cannot have spaces or start with a number.',
          'You now know the basic building blocks: variables, strings, numbers, booleans, null and undefined. Tomorrow you will make your code do real work with functions.'
        ],
        example: 'On a job application form, a field you skipped is like undefined: nobody filled it. A field where you wrote "None" on purpose, like "Previous company: none", is like null.',
        code: lines(
          'let interviewDate;',
          'const reply = null;',
          'console.log(interviewDate);',
          'console.log(reply);',
          'console.log(typeof "Infosys");',
          'console.log(typeof 42);',
          'console.log(typeof true);'
        ),
        output: lines('undefined', 'null', 'string', 'number', 'boolean'),
        codeNotes: [
          { line: 1, note: 'Created but no value given, so it is undefined.' },
          { line: 2, note: 'null means "empty on purpose".' },
          { line: 5, note: 'typeof tells you the kind of value.' }
        ],
        tryIt: 'Try typeof "42" with quotes. Is it a number or a string? This is the same trap as "500" + 40.',
        check: {
          question: 'Which is the best variable name for the date you applied?',
          options: ['d', 'applied date', 'appliedDate'],
          answer: 2,
          why: 'appliedDate is clear and uses camelCase. Names cannot contain spaces, and d does not say what it holds.'
        }
      }
    ],
    summary: [
      'let creates a variable you can change; const creates one you cannot.',
      'Strings are text in quotes; numbers have no quotes; "5" + 5 gives "55".',
      'Booleans are true or false; compare with === and !==, never with a single =.',
      'undefined means never set; null means empty on purpose; typeof tells the kind of value.'
    ],
    projectStep: {
      title: 'Store one job in variables',
      steps: [
        'Pick the first job from your list.',
        'Create const jobTitle, const company, let status = "applied" and const salary (a number).',
        'Print one sentence that uses all four, for example: Frontend Developer at Infosys, status applied, salary 400000.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 3,
    title: 'Functions and Making Decisions',
    goal: 'You can write functions that take inputs and return answers, and make your code choose with if and else.',
    minutes: 32,
    recap: 'Yesterday you stored values in variables with let and const, and compared them with === to get true or false.',
    parts: [
      {
        title: 'Why we need functions',
        say: [
          'Imagine you need to calculate GST on 50 different products. You could write the same maths 50 times, but if the GST rate changes, you would have to fix it in 50 places. That is slow and full of mistakes.',
          'A function solves this. A function is a named set of instructions that you write once and use as many times as you want. You give it some inputs, it does its job, and it can give you back an answer.',
          'Today is the most important day of week one, because React components are just functions. Every button, card and page you build in React will be a function. If you understand functions, React will make sense.'
        ],
        example: 'A mixer grinder is a function. You put in ingredients (inputs), press the button (call the function), and get chutney (the answer). You do not rebuild the mixer every time; you just use it again with new ingredients.',
        code: lines(
          'function greet() {',
          '  console.log("Welcome to Job Tracker!");',
          '}',
          '',
          'greet();',
          'greet();'
        ),
        output: lines('Welcome to Job Tracker!', 'Welcome to Job Tracker!'),
        codeNotes: [
          { line: 1, note: 'function, then the name greet, then round brackets, then curly brackets holding the instructions.' },
          { line: 5, note: 'Writing greet() runs the function. We call it twice, so the message prints twice.' }
        ],
        tryIt: 'Call greet() one more time at the bottom. Then change the message inside the function and run again: every call now prints the new message. That is the power of writing it once.',
        check: {
          question: 'What does greet(); do?',
          options: ['Creates the function', 'Runs the function', 'Deletes the function'],
          answer: 1,
          why: 'The name followed by round brackets calls (runs) the function.'
        }
      },
      {
        title: 'Inputs and answers: parameters and return',
        say: [
          'Most functions need some information to do their job. These inputs are called parameters, and you write them inside the round brackets when you create the function. When you call the function, the actual values you pass in are used in their place.',
          'A function can also give back an answer with the word return. Whatever comes after return is the result of calling the function, and you can store it in a variable or print it.',
          'Here is a difference beginners often mix up: console.log only shows something on the screen for you, the developer. return hands the answer back to the code that called the function, so the code can use it. In React, components return what should appear on screen, so return is what matters.',
          'When return runs, the function stops immediately. Any line after it inside the function does not run.'
        ],
        example: 'An ATM is a function with inputs and a return. Your inputs are your card, PIN and amount. The ATM returns cash. You can then use that cash however you like, just as code can use a returned value.',
        code: lines(
          'function addGst(price) {',
          '  return price + price * 0.18;',
          '}',
          '',
          'const phone = addGst(10000);',
          'const shoes = addGst(2000);',
          'console.log(phone);',
          'console.log(shoes);'
        ),
        output: lines('11800', '2360'),
        codeNotes: [
          { line: 1, note: 'price is a parameter: a name for whatever value is passed in.' },
          { line: 2, note: 'return sends back the price plus 18 percent.' },
          { line: 5, note: 'The answer 11800 is stored in phone so we can use it later.' }
        ],
        tryIt: 'Call addGst(500) and print the result. Then write a new function withDiscount(price) that returns price minus 100.',
        check: {
          question: 'What is the difference between console.log and return inside a function?',
          options: ['There is no difference', 'console.log only shows a message; return gives the answer back to the code', 'return prints in red'],
          answer: 1,
          why: 'return hands the value back so other code can use it. console.log only displays it.'
        }
      },
      {
        title: 'Arrow functions: the short way',
        say: [
          'Modern JavaScript has a shorter way to write functions, called arrow functions, because they use an arrow made of = and >. You will see them everywhere in React code, so it is important to read them comfortably.',
          'You store the arrow function in a const: const double = (n) => { return n * 2; }. The inputs go in the round brackets, then the arrow, then the body.',
          'If the body is just one return, you can make it even shorter by removing the curly brackets and the word return: const double = (n) => n * 2;. Both versions do exactly the same thing.',
          'Normal functions and arrow functions mostly behave the same for what you will build. Use whichever is clearer, but learn to read both.'
        ],
        example: 'It is like writing "Thank you" versus "Thx" in a message. Both mean the same thing; one is just shorter. Arrow functions are the short form that React developers usually use.',
        code: lines(
          'const double = (n) => n * 2;',
          'const fullName = (first, last) => first + " " + last;',
          '',
          'console.log(double(21));',
          'console.log(fullName("Ravi", "Kumar"));'
        ),
        output: lines('42', 'Ravi Kumar'),
        codeNotes: [
          { line: 1, note: 'Input n, arrow, and the answer n * 2. No return needed in this short form.' },
          { line: 2, note: 'Two inputs are separated by a comma.' }
        ],
        tryIt: 'Write an arrow function const square = (n) => n * n; and print square(9).',
        check: {
          question: 'What does const triple = (n) => n * 3; return for triple(4)?',
          options: ['7', '12', 'n * 3'],
          answer: 1,
          why: 'n is 4, and the arrow function returns 4 * 3, which is 12.'
        }
      },
      {
        title: 'Making decisions with if and else',
        say: [
          'Programs need to make choices. Show "Free delivery" if the bill is over 499. Show the Login button only if the user is not logged in. For this, we use if.',
          'You write if, then a condition in round brackets, then curly brackets with the code to run when the condition is true. The condition is usually a comparison that gives true or false, like the ones you wrote yesterday.',
          'You can add else, with its own curly brackets, for what should happen when the condition is false. Exactly one of the two blocks runs, never both.',
          'Inside functions, a common pattern is to return different answers in each branch. Look at the code: the function returns one string for scores 40 and above, and another string for the rest.'
        ],
        example: 'Before going out, you think: if it is raining, take an umbrella; else, take sunglasses. You never take both, and you always take one. That is exactly how if and else work.',
        code: lines(
          'function getResult(score) {',
          '  if (score >= 40) {',
          '    return "Pass";',
          '  } else {',
          '    return "Fail";',
          '  }',
          '}',
          '',
          'console.log(getResult(72));',
          'console.log(getResult(35));'
        ),
        output: lines('Pass', 'Fail'),
        codeNotes: [
          { line: 2, note: 'The condition: is score 40 or more? This gives true or false.' },
          { line: 4, note: 'else runs only when the condition was false.' }
        ],
        tryIt: 'Call getResult(40). Is 40 a pass? Then change >= to > and run again. One small symbol changes the result for exactly 40. Bugs like this are very common.',
        check: {
          question: 'If a bill is 300, what does this print? if (bill > 499) { console.log("Free delivery"); } else { console.log("Delivery: 40"); }',
          options: ['Free delivery', 'Delivery: 40', 'Both'],
          answer: 1,
          why: '300 is not more than 499, so the condition is false and the else block runs.'
        }
      },
      {
        title: 'More choices: else if, and, or',
        say: [
          'Sometimes there are more than two choices. For that, use else if between if and else. JavaScript checks each condition from top to bottom and runs the first one that is true. The rest are skipped.',
          'You can also join conditions. && means and: both sides must be true. || means or: at least one side must be true. ! means not: it flips true to false.',
          'For example, a job is a great match if the salary is at least 500000 && it is remote. A job is worth applying to if it is remote || it is in your city.',
          'Order matters with else if. Put the most specific checks first. Look at the code: we check for "offer" before the general case.'
        ],
        example: 'A traffic signal: if red, stop; else if yellow, slow down; else if green, go. Only one of them applies at a time, checked in order.',
        code: lines(
          'function statusLabel(status) {',
          '  if (status === "offer") {',
          '    return "You got an offer!";',
          '  } else if (status === "interview") {',
          '    return "Interview scheduled";',
          '  } else {',
          '    return "Waiting for reply";',
          '  }',
          '}',
          '',
          'console.log(statusLabel("interview"));',
          'const isRemote = true;',
          'const salary = 600000;',
          'console.log(isRemote && salary >= 500000);'
        ),
        output: lines('Interview scheduled', 'true'),
        codeNotes: [
          { line: 4, note: 'Checked only if the first condition was false.' },
          { line: 14, note: '&& gives true only when both sides are true.' }
        ],
        tryIt: 'Add another else if for "rejected" that returns "Not this time, keep going". Then call statusLabel("rejected").',
        check: {
          question: 'What is true && false?',
          options: ['true', 'false'],
          answer: 1,
          why: '&& needs both sides to be true. One side is false, so the result is false.'
        }
      },
      {
        title: 'Functions working together (and how this becomes React)',
        say: [
          'Real programs are made of many small functions that use each other. One function can call another and use its answer. This keeps each function short and easy to understand.',
          'Variables created inside a function only exist inside that function. Code outside cannot see them. This is good: each function keeps its own things private, so functions do not accidentally break each other.',
          'Here is the big picture for React. A React component is a function whose name starts with a capital letter and which returns what to show on the screen. Look at the code below: JobCard uses statusText to build its result. Next week, the only difference is that it will return real screen elements instead of text.',
          'Well done. With variables, functions and decisions, you already know the core of programming. Tomorrow you will learn to handle lists of data.'
        ],
        example: 'In a restaurant kitchen, one cook chops, another cooks, another plates the food. Each does one job well, and together they make the dish. Small functions working together are the same.',
        code: lines(
          'const statusText = (status) => status === "offer" ? "Offer!" : "Pending";',
          '',
          'function JobCard(title, status) {',
          '  const label = statusText(status);',
          '  return title + " - " + label;',
          '}',
          '',
          'console.log(JobCard("React Developer", "offer"));',
          'console.log(JobCard("Web Developer", "applied"));'
        ),
        output: lines('React Developer - Offer!', 'Web Developer - Pending'),
        codeNotes: [
          { line: 1, note: 'The ? : is a short if/else: condition ? answer if true : answer if false.' },
          { line: 4, note: 'JobCard calls statusText and stores its answer in label.' },
          { line: 5, note: 'label only exists inside JobCard.' }
        ],
        tryIt: 'After the last line, add console.log(label);. Read the error: label is not defined outside JobCard.',
        check: {
          question: 'What is a React component?',
          options: ['A function that returns what to show on screen', 'A CSS file', 'A variable that stores a number'],
          answer: 0,
          why: 'Components are functions (with a capital first letter) that return screen content.'
        }
      }
    ],
    summary: [
      'A function is written once and used many times; call it with its name and ().',
      'Parameters are the inputs; return gives the answer back and stops the function.',
      'Arrow functions are the short form: const double = (n) => n * 2;',
      'if / else if / else choose one path; && means and, || means or.',
      'React components are functions that return what appears on screen.'
    ],
    projectStep: {
      title: 'Write describeJob',
      steps: [
        'Write a function describeJob(title, company, status).',
        'Make it return a sentence like: Frontend Developer at Infosys (applied).',
        'If the status is "offer", add " - Congratulations!" to the end.',
        'Call it for three jobs from your list and print the results.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 4,
    title: 'Arrays and Objects',
    goal: 'You can store lists in arrays, group details in objects, and work with a list of job objects, which is the shape of real app data.',
    minutes: 30,
    recap: 'Yesterday you wrote functions with inputs and return, and made decisions with if and else.',
    parts: [
      {
        title: 'Arrays: lists of values',
        say: [
          'So far each variable held one value. But apps are full of lists: a list of messages, of products, of jobs. To store a list, we use an array.',
          'You create an array with square brackets and put values inside, separated by commas: const skills = ["HTML", "CSS", "JavaScript"];.',
          'Each item has a position number called its index. The important thing: counting starts at 0, not 1. So skills[0] is "HTML", skills[1] is "CSS" and skills[2] is "JavaScript".',
          'To know how many items an array has, use .length. The last item is always at position length minus 1, because counting starts at 0.'
        ],
        example: 'A train has coaches in order, and each coach has a number. An array is the train, and the items are the coaches. The only difference: in JavaScript, the first coach is number 0.',
        code: lines(
          'const skills = ["HTML", "CSS", "JavaScript"];',
          'console.log(skills[0]);',
          'console.log(skills[2]);',
          'console.log(skills.length);',
          'console.log(skills[skills.length - 1]);'
        ),
        output: lines('HTML', 'JavaScript', '3', 'JavaScript'),
        codeNotes: [
          { line: 2, note: 'Index 0 is the first item.' },
          { line: 4, note: 'There are 3 items.' },
          { line: 5, note: 'The last item is at index length - 1, which is 2.' }
        ],
        tryIt: 'Print skills[3]. There is no fourth item, so you get undefined. Remember this: it is one of the most common bugs.',
        check: {
          question: 'In const days = ["Mon", "Tue", "Wed"], what is days[1]?',
          options: ['"Mon"', '"Tue"', '"Wed"'],
          answer: 1,
          why: 'Counting starts at 0, so index 1 is the second item, "Tue".'
        }
      },
      {
        title: 'Changing arrays',
        say: [
          'Arrays come with useful tools. push adds an item to the end. pop removes the last item. includes tells you with true or false whether a value is in the list. indexOf tells you the position of a value, or -1 if it is not there.',
          'Even though we used const, we can still add items with push. const means the variable always points to the same array, but the array itself can still change. Think of it as the same bag: you can put more things in it.',
          'Important for React: React prefers that you do not change an array directly. Instead, you make a new array with the changes. You will learn the easy way to do that on Day 6. For today, just get comfortable with the basic tools.'
        ],
        example: 'A shopping list on your fridge: you add items at the bottom (push), cross off the last one (pop), and check whether milk is already on it (includes).',
        code: lines(
          'const skills = ["HTML", "CSS"];',
          'skills.push("JavaScript");',
          'console.log(skills);',
          'console.log(skills.includes("CSS"));',
          'console.log(skills.includes("Python"));',
          'console.log(skills.indexOf("JavaScript"));'
        ),
        output: lines('[ \'HTML\', \'CSS\', \'JavaScript\' ]', 'true', 'false', '2'),
        codeNotes: [
          { line: 2, note: 'push adds "JavaScript" to the end.' },
          { line: 4, note: 'includes answers true or false.' },
          { line: 6, note: 'JavaScript is at position 2.' }
        ],
        tryIt: 'Add "React" with push, then print skills.length. Then call skills.pop() and print the array again.',
        check: {
          question: 'What does ["a", "b"].includes("c") give?',
          options: ['true', 'false', '2'],
          answer: 1,
          why: '"c" is not in the list, so includes returns false.'
        }
      },
      {
        title: 'Objects: details with names',
        say: [
          'An array is good for a list of similar things. But how do you store all the details of one job: its title, company, salary and status? For that, we use an object.',
          'An object uses curly brackets and stores pairs of name and value, called properties: { title: "Frontend Developer", company: "Infosys", salary: 400000 }. The name comes first, then a colon, then the value, with commas between pairs.',
          'To read a property, write the object name, a dot, and the property name: job.title. This is called dot notation. It reads almost like English: job dot title means the job\'s title.',
          'Objects are how apps describe real things. A user, a product, a message, a job: each is an object with properties.'
        ],
        example: 'Your college ID card is an object. It has labelled details: name, roll number, branch, year. You look up a detail by its label, not by its position.',
        code: lines(
          'const job = {',
          '  title: "Frontend Developer",',
          '  company: "Infosys",',
          '  salary: 400000,',
          '  remote: false',
          '};',
          '',
          'console.log(job.title);',
          'console.log(job.company + " pays " + job.salary);'
        ),
        output: lines('Frontend Developer', 'Infosys pays 400000'),
        codeNotes: [
          { line: 2, note: 'A property: the name title with the value "Frontend Developer".' },
          { line: 5, note: 'Values can be any type: text, numbers or booleans.' },
          { line: 8, note: 'Dot notation reads one property.' }
        ],
        tryIt: 'Add a property city: "Bengaluru" to the object, then print job.city.',
        check: {
          question: 'How do you read the salary of const job = { title: "Dev", salary: 5 }?',
          options: ['job[salary]', 'job.salary', 'salary.job'],
          answer: 1,
          why: 'Dot notation: object name, a dot, then the property name.'
        }
      },
      {
        title: 'Changing and adding properties',
        say: [
          'You can change a property by assigning a new value: job.status = "interview";. If the property did not exist before, this adds it.',
          'There is a second way to read properties: square brackets with the name as text, job["status"]. This is useful when the property name is stored in a variable, for example when a form tells you which field changed. You will use this on Day 14 for forms.',
          'If you read a property that does not exist, like job.salry with a spelling mistake, you get undefined, not an error. So when something shows as undefined, the first thing to check is the spelling.'
        ],
        example: 'Updating your profile on LinkedIn: you change your job title field and add a new skill field. It is still the same profile, just with updated details.',
        code: lines(
          'const job = { title: "React Developer", status: "applied" };',
          'job.status = "interview";',
          'job.interviewDate = "2026-10-05";',
          'console.log(job);',
          '',
          'const field = "title";',
          'console.log(job[field]);',
          'console.log(job.salry);'
        ),
        output: lines('{ title: \'React Developer\', status: \'interview\', interviewDate: \'2026-10-05\' }', 'React Developer', 'undefined'),
        codeNotes: [
          { line: 2, note: 'Changes an existing property.' },
          { line: 3, note: 'Adds a new property.' },
          { line: 7, note: 'Square brackets use the text inside field, which is "title".' },
          { line: 8, note: 'A spelling mistake gives undefined.' }
        ],
        tryIt: 'Fix the spelling on the last line to job.salary. It is still undefined. Why? Add a salary property to the job to fix it properly.',
        check: {
          question: 'What do you get when you read a property that does not exist?',
          options: ['An error', 'undefined', '0'],
          answer: 1,
          why: 'Missing properties give undefined. Check the spelling first when you see it.'
        }
      },
      {
        title: 'Arrays of objects: real app data',
        say: [
          'Now the most important idea of today. Real apps combine the two: an array of objects. Your job list is an array, and each job in it is an object with its own details.',
          'To reach a detail, combine the two ways: jobs[0] gives the first job object, and jobs[0].company gives that job\'s company.',
          'This is exactly the data your Job Tracker will use. When you get data from any company API, like jobs from Naukri or products from Flipkart, it almost always comes as an array of objects. Learning to read this shape is a skill you will use every single day as a developer.',
          'Each job also gets an id, a unique number. You will need it later to find, change and delete one job without confusing it with another.'
        ],
        example: 'A class attendance register is an array of objects: the register is the list, and each row is a student with details like roll number, name and present or absent.',
        code: lines(
          'const jobs = [',
          '  { id: 1, title: "Frontend Developer", company: "Infosys", status: "applied" },',
          '  { id: 2, title: "React Developer", company: "Zoho", status: "interview" },',
          '  { id: 3, title: "UI Developer", company: "Swiggy", status: "offer" }',
          '];',
          '',
          'console.log(jobs.length);',
          'console.log(jobs[1].company);',
          'console.log(jobs[2].title + " - " + jobs[2].status);'
        ),
        output: lines('3', 'Zoho', 'UI Developer - offer'),
        codeNotes: [
          { line: 1, note: 'An array (square brackets) of job objects (curly brackets).' },
          { line: 8, note: 'jobs[1] is the second job; .company reads its company.' }
        ],
        tryIt: 'Add a fourth job with id 4 using one of the jobs from your own list. Then print jobs.length and the title of your new job.',
        check: {
          question: 'For the jobs array above, what is jobs[0].status?',
          options: ['"applied"', '"interview"', '"offer"'],
          answer: 0,
          why: 'jobs[0] is the first job (Infosys), and its status is "applied".'
        }
      },
      {
        title: 'Common mistakes and how to avoid them',
        say: [
          'Let us look at the mistakes almost every beginner makes with arrays and objects, so you can spot them quickly.',
          'Mistake one: forgetting that counting starts at 0, and asking for jobs[3] in a list of three. You get undefined. Mistake two: using the array as if it were one object, like jobs.title instead of jobs[0].title. The array itself has no title; only the jobs inside it do.',
          'Mistake three: reading a property of something that is undefined. If jobs[5] does not exist, then jobs[5].title crashes with "Cannot read properties of undefined". This is the most common error message in JavaScript. When you see it, ask: which thing before the dot is undefined?',
          'Great work today. Tomorrow you will learn to go through a whole list at once with loops, map and filter, which is how React shows lists on the screen.'
        ],
        example: 'Asking for coach number 12 of a train that has only 10 coaches: there is nothing there. And asking for the seat number inside a coach that does not exist makes no sense at all. That is the "Cannot read properties of undefined" error.',
        code: lines(
          'const jobs = [{ title: "Dev" }, { title: "Tester" }];',
          'console.log(jobs.title);',
          'console.log(jobs[0].title);',
          'console.log(jobs[2]);'
        ),
        output: lines('undefined', 'Dev', 'undefined'),
        codeNotes: [
          { line: 2, note: 'Wrong: the array has no title. Only its items do.' },
          { line: 3, note: 'Right: first pick an item, then read its property.' },
          { line: 4, note: 'Only indexes 0 and 1 exist, so this is undefined.' }
        ],
        tryIt: 'Add console.log(jobs[2].title); and run it. Read the error message carefully: it tells you what was undefined.',
        check: {
          question: 'You see the error "Cannot read properties of undefined (reading \'title\')". What does it mean?',
          options: ['The title is empty', 'The thing before .title is undefined', 'JavaScript is broken'],
          answer: 1,
          why: 'You tried to read .title from something that does not exist, like an item past the end of the array.'
        }
      }
    ],
    summary: [
      'Arrays are ordered lists in [ ]; counting starts at 0; .length gives the count.',
      'push, pop, includes and indexOf are everyday array tools.',
      'Objects group named details in { }; read them with job.title or job["title"].',
      'Real data is an array of objects: jobs[0].company.',
      '"Cannot read properties of undefined" means the thing before the dot does not exist.'
    ],
    projectStep: {
      title: 'Create your job list',
      steps: [
        'Create const jobs = [ ... ] with the 5 jobs from your Day 1 list.',
        'Give each job an id (1 to 5), title, company, status and appliedOn date like "2026-09-28".',
        'Print how many jobs you have and the company of the last job.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 5,
    title: 'Loops and Array Methods: map, filter, find',
    goal: 'You can go through a whole list with loops, and use map, filter and find to create new lists, which is exactly how React shows lists.',
    minutes: 32,
    recap: 'Yesterday you stored data in arrays and objects, and built a list of job objects.',
    parts: [
      {
        title: 'Why loops: doing something for every item',
        say: [
          'Your job list has five jobs today. Next month it might have fifty. If you want to print every job title, you cannot write fifty console.log lines. You need a way to say: for every job in the list, do this. That is a loop.',
          'The easiest loop in JavaScript is for...of. You write for (const job of jobs) and then curly brackets. The code inside runs once for each item, and each time, job is the current item.',
          'The name job is your choice. You could call it item or x, but a clear name makes your code easier to read. A good habit: if the list is jobs, call each item job.'
        ],
        example: 'A teacher taking attendance goes down the list and does the same thing for each student: calls the name and marks present or absent. That is a loop over the class list.',
        code: lines(
          'const jobs = [',
          '  { title: "Frontend Developer", company: "Infosys" },',
          '  { title: "React Developer", company: "Zoho" },',
          '  { title: "UI Developer", company: "Swiggy" }',
          '];',
          '',
          'for (const job of jobs) {',
          '  console.log(job.title + " at " + job.company);',
          '}'
        ),
        output: lines('Frontend Developer at Infosys', 'React Developer at Zoho', 'UI Developer at Swiggy'),
        codeNotes: [
          { line: 7, note: 'For each item in jobs, call it job and run the code inside.' },
          { line: 8, note: 'This line runs three times, once per job.' }
        ],
        tryIt: 'Add a fourth job to the array and run again. You did not change the loop, but it now prints four lines.',
        check: {
          question: 'If an array has 10 items, how many times does the code inside for...of run?',
          options: ['1', '10', '11'],
          answer: 1,
          why: 'The loop runs once for every item, so 10 times.'
        }
      },
      {
        title: 'Counting and adding up with a loop',
        say: [
          'Loops are also used to calculate something from a whole list: a total, a count, a biggest value. The pattern is always the same. Start with a variable before the loop, change it inside the loop, and use it after the loop.',
          'For example, to count how many jobs are at the interview stage, start with let count = 0;. Inside the loop, if the job status is "interview", add 1. After the loop, count holds the answer.',
          'There is also the classic for loop with a counter: for (let i = 0; i < jobs.length; i++). It is older and a little harder to read, but you will see it in many places, and it is useful when you need the position number. i++ simply means add 1 to i.'
        ],
        example: 'Counting how many people in your class passed the exam: you start at zero, go through every result, and add one each time you see a pass. At the end, your number is the answer.',
        code: lines(
          'const jobs = [',
          '  { title: "Dev", status: "interview", salary: 400000 },',
          '  { title: "Tester", status: "applied", salary: 300000 },',
          '  { title: "Designer", status: "interview", salary: 350000 }',
          '];',
          '',
          'let interviews = 0;',
          'let totalSalary = 0;',
          'for (const job of jobs) {',
          '  if (job.status === "interview") {',
          '    interviews = interviews + 1;',
          '  }',
          '  totalSalary = totalSalary + job.salary;',
          '}',
          'console.log("Interviews: " + interviews);',
          'console.log("Average salary: " + totalSalary / jobs.length);'
        ),
        output: lines('Interviews: 2', 'Average salary: 350000'),
        codeNotes: [
          { line: 7, note: 'Start counting at 0, before the loop.' },
          { line: 10, note: 'Only add 1 when this job is at the interview stage.' },
          { line: 16, note: 'After the loop: total divided by number of jobs gives the average.' }
        ],
        tryIt: 'Add a variable let highest = 0; and inside the loop, if job.salary > highest, set highest = job.salary. Print highest after the loop.',
        check: {
          question: 'Where should let count = 0; go when counting items in a loop?',
          options: ['Inside the loop', 'Before the loop', 'After the loop'],
          answer: 1,
          why: 'If it were inside, it would reset to 0 on every item. It must start once, before the loop.'
        }
      },
      {
        title: 'map: turn every item into something new',
        say: [
          'Now the tools that React developers use every day. The first is map. map goes through an array and creates a new array, where each item has been changed by a function you give it.',
          'You write jobs.map(job => job.title). For every job, the arrow function returns its title, and map collects all those answers into a new array of titles. The original jobs array is not changed.',
          'Why does this matter so much? In React, to show a list on the screen, you map your array of data into an array of components: jobs.map(job => <JobCard ... />). So map is literally how lists appear in React apps. You will do this on Day 10.',
          'Rule to remember: map always gives back a new array of the same length as the original.'
        ],
        example: 'A photo filter app: you give it 10 photos, it applies the same filter to each one, and you get back 10 edited photos. The originals are still there. That is map.',
        code: lines(
          'const jobs = [',
          '  { title: "Frontend Developer", salary: 400000 },',
          '  { title: "React Developer", salary: 500000 }',
          '];',
          '',
          'const titles = jobs.map(job => job.title);',
          'console.log(titles);',
          '',
          'const monthly = jobs.map(job => job.salary / 12);',
          'console.log(monthly);'
        ),
        output: lines('[ \'Frontend Developer\', \'React Developer\' ]', '[ 33333.333333333336, 41666.666666666664 ]'),
        codeNotes: [
          { line: 6, note: 'For each job, return its title. map collects the answers into a new array.' },
          { line: 9, note: 'The same idea: for each job, return the salary divided by 12.' }
        ],
        tryIt: 'Those monthly numbers are ugly. Change line 9 to job => Math.round(job.salary / 12) and run again. Math.round rounds to the nearest whole number.',
        check: {
          question: 'If jobs has 5 items, how many items does jobs.map(job => job.title) have?',
          options: ['5', '1', 'It depends on the titles'],
          answer: 0,
          why: 'map always returns a new array with the same number of items.'
        }
      },
      {
        title: 'filter: keep only some items',
        say: [
          'The second tool is filter. It goes through an array and keeps only the items for which your function returns true. The result is a new, possibly shorter, array.',
          'jobs.filter(job => job.status === "interview") keeps only the jobs at the interview stage. For each job, the arrow function answers true or false, and filter keeps the true ones.',
          'You will use filter for search boxes, filter tabs like All, Applied and Interview, and for deleting: to delete a job, you keep every job except the one with that id: jobs.filter(job => job.id !== idToDelete). Your Job Tracker will do all of these.',
          'Like map, filter never changes the original array. It always gives you a new one. React loves this.'
        ],
        example: 'On Zomato, when you tap "Pure Veg", the app does not delete the other restaurants. It shows you a new, filtered list. Tap it again, and the full list is back, because the original list was never changed.',
        code: lines(
          'const jobs = [',
          '  { id: 1, title: "Dev", status: "applied" },',
          '  { id: 2, title: "Tester", status: "interview" },',
          '  { id: 3, title: "Designer", status: "interview" }',
          '];',
          '',
          'const interviewJobs = jobs.filter(job => job.status === "interview");',
          'console.log(interviewJobs.length);',
          '',
          'const withoutJob2 = jobs.filter(job => job.id !== 2);',
          'console.log(withoutJob2.map(job => job.title));',
          'console.log(jobs.length);'
        ),
        output: lines('2', '[ \'Dev\', \'Designer\' ]', '3'),
        codeNotes: [
          { line: 7, note: 'Keep only jobs where the status is interview.' },
          { line: 10, note: 'The delete pattern: keep every job whose id is not 2.' },
          { line: 12, note: 'The original array still has all 3 jobs.' }
        ],
        tryIt: 'Write a filter that keeps only jobs whose title includes the letter "e": jobs.filter(job => job.title.includes("e")). Print the titles.',
        check: {
          question: 'How would you delete the job with id 5 from jobs, React-style?',
          options: ['jobs.filter(job => job.id !== 5)', 'jobs.filter(job => job.id === 5)', 'jobs.map(job => 5)'],
          answer: 0,
          why: 'Keep every job whose id is not 5. The result is a new array without that job.'
        }
      },
      {
        title: 'find and some: one item, or a yes/no answer',
        say: [
          'Sometimes you do not want a list back. You want one item. find goes through the array and returns the first item for which your function returns true. If nothing matches, it returns undefined.',
          'You will use find for detail pages: when someone opens the page for job number 2, you do jobs.find(job => job.id === 2) to get that one job object.',
          'some answers a yes/no question about the whole list: is there at least one item that matches? jobs.some(job => job.status === "offer") gives true if you have at least one offer.',
          'Choosing the right tool: want a new list with every item changed? map. Want fewer items? filter. Want one item? find. Want a yes or no? some.'
        ],
        example: 'Looking for your friend in a crowd: you scan faces until you find them, then stop. That is find. Asking "is anyone here wearing red?" needs just a yes or no. That is some.',
        code: lines(
          'const jobs = [',
          '  { id: 1, title: "Dev", status: "applied" },',
          '  { id: 2, title: "Tester", status: "offer" }',
          '];',
          '',
          'const job = jobs.find(job => job.id === 2);',
          'console.log(job.title);',
          'console.log(jobs.find(job => job.id === 9));',
          'console.log(jobs.some(job => job.status === "offer"));'
        ),
        output: lines('Tester', 'undefined', 'true'),
        codeNotes: [
          { line: 6, note: 'Returns the first matching job object, not a list.' },
          { line: 8, note: 'No job has id 9, so find returns undefined.' },
          { line: 9, note: 'At least one job is an offer, so true.' }
        ],
        tryIt: 'Use some to check whether any job is "rejected". Then use find to get the job with id 1 and print its status.',
        check: {
          question: 'You want the one job with id 7 to show on its details page. Which tool?',
          options: ['map', 'filter', 'find'],
          answer: 2,
          why: 'find returns one item: the first that matches.'
        }
      },
      {
        title: 'Putting it together, and a look at React',
        say: [
          'These tools can be chained: the result of one goes straight into the next. jobs.filter(...).map(...) first keeps some jobs, then changes each of those. Read it left to right like a sentence: from jobs, keep the interviews, then give me their titles.',
          'Here is a preview of what you will write in React on Day 10. You have a jobs array, and you want to show a list on screen. You write jobs.map(job => <li>{job.title}</li>). It is exactly the map you learned today; the arrow function just returns a screen element instead of text.',
          'That is the end of week one. You now know variables, functions, decisions, arrays, objects and the array tools. These are the JavaScript skills React needs. After this lesson, you will have a short test covering days 1 to 5. Take it calmly: it is to help you, not to scare you.',
          'Next week, you build your first React components. Well done for finishing week one!'
        ],
        example: 'At a vegetable shop, you first pick only the good tomatoes (filter), then weigh each one (map). Two simple steps, one after the other, give you exactly what you want.',
        code: lines(
          'const jobs = [',
          '  { title: "Frontend Developer", status: "interview" },',
          '  { title: "Tester", status: "applied" },',
          '  { title: "React Developer", status: "interview" }',
          '];',
          '',
          'const interviewTitles = jobs',
          '  .filter(job => job.status === "interview")',
          '  .map(job => job.title.toUpperCase());',
          '',
          'console.log(interviewTitles);',
          '',
          'const listItems = jobs.map(job => "<li>" + job.title + "</li>");',
          'console.log(listItems.join(""));'
        ),
        output: lines(
          '[ \'FRONTEND DEVELOPER\', \'REACT DEVELOPER\' ]',
          '<li>Frontend Developer</li><li>Tester</li><li>React Developer</li>'
        ),
        codeNotes: [
          { line: 8, note: 'First, keep only the interview jobs.' },
          { line: 9, note: 'Then change each remaining job into its title in capitals.' },
          { line: 13, note: 'This is almost what React does to show a list: map data into screen elements.' },
          { line: 14, note: 'join("") glues the pieces into one text.' }
        ],
        tryIt: 'Change the chain to keep only "applied" jobs and show their titles in lower case with toLowerCase().',
        check: {
          question: 'How will you show a list of jobs on screen in React?',
          options: ['Write one line per job by hand', 'Use map to turn each job into a screen element', 'Use console.log'],
          answer: 1,
          why: 'React lists are made with map: jobs.map(job => <JobCard ... />).'
        }
      }
    ],
    summary: [
      'for...of runs code once for every item in a list.',
      'To count or total: start a variable before the loop, update it inside, use it after.',
      'map changes every item; filter keeps some items; find returns one item; some answers yes/no.',
      'These tools return new arrays and never change the original.',
      'React shows lists with map.'
    ],
    projectStep: {
      title: 'Summarise your job list',
      steps: [
        'Using your jobs array from Day 4, print all titles with map.',
        'Use filter to print how many jobs are at the interview stage.',
        'Use find to print the job with id 3.',
        'Use some to print whether you have any offer yet.'
      ]
    }
  }
];
