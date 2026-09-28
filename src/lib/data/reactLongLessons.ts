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
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 6,
    title: 'Modern JavaScript: Template Strings, Destructuring and Spread',
    goal: 'You can build text with template strings, pull values out of objects and arrays, and make updated copies with spread, which React code uses on almost every line.',
    minutes: 30,
    recap: 'Yesterday you used loops, map, filter and find to work with whole lists of jobs.',
    parts: [
      {
        title: 'Template strings: building text the easy way',
        say: [
          'So far you joined text with the plus sign: "Hello, " + name + "!". It works, but with many pieces it gets messy, and it is easy to forget a space.',
          'Template strings are a cleaner way. Instead of quotes, you use backticks, the key usually just below Escape on your keyboard. Inside backticks, you can put any JavaScript value inside a dollar sign and curly brackets, like ${name}, and it gets placed into the text.',
          'You can put any expression inside ${ }, not only variable names: maths like ${price * 2}, or a function call like ${name.toUpperCase()}. Template strings can also go over several lines.',
          'From now on, when you build text from pieces, use template strings. You will see them in React for class names and messages.'
        ],
        example: 'A template string is like a printed form with blanks: "Dear ____, your order of ____ items is ready." You fill the blanks with real values, and the rest of the sentence stays the same.',
        code: lines(
          'const name = "Asha";',
          'const jobs = 3;',
          'console.log(`Hi ${name}, you applied to ${jobs} jobs.`);',
          'console.log(`Next month that could be ${jobs * 2} jobs!`);',
          'console.log(`Your name in capitals: ${name.toUpperCase()}`);'
        ),
        output: lines('Hi Asha, you applied to 3 jobs.', 'Next month that could be 6 jobs!', 'Your name in capitals: ASHA'),
        codeNotes: [
          { line: 3, note: 'Backticks instead of quotes. ${name} and ${jobs} are replaced by their values.' },
          { line: 4, note: 'Any expression works inside ${ }, even maths.' }
        ],
        tryIt: 'Write a template string that prints: "Asha has 3 interviews this week." using the name variable and a new variable interviews.',
        check: {
          question: 'What does `Total: ${2 + 3}` produce?',
          options: ['Total: ${2 + 3}', 'Total: 5', 'Total: 23'],
          answer: 1,
          why: 'Inside ${ } the expression is calculated first, so 2 + 3 becomes 5.'
        }
      },
      {
        title: 'Destructuring objects: taking out the parts you need',
        say: [
          'Often you have an object and need a few of its properties. You could write const title = job.title; and const company = job.company; on separate lines. Destructuring does it in one line: const { title, company } = job;.',
          'The curly brackets on the left side mean: from this object, take the properties with these names and create variables with the same names. The names must match the property names exactly.',
          'If a property does not exist, its variable becomes undefined. You can also give a default value: const { status = "applied" } = job; uses "applied" when job has no status.',
          'This matters for React because every component receives its data as one object called props, and the very first thing most components do is destructure it. You will see this tomorrow and on Day 9.'
        ],
        example: 'When a delivery box arrives, you do not carry the whole box around the house. You take out the items you need and put each in its place. Destructuring takes the values you need out of an object.',
        code: lines(
          'const job = { title: "React Developer", company: "Zoho", salary: 600000 };',
          '',
          'const { title, company } = job;',
          'console.log(title);',
          'console.log(company);',
          '',
          'const { status = "applied" } = job;',
          'console.log(status);'
        ),
        output: lines('React Developer', 'Zoho', 'applied'),
        codeNotes: [
          { line: 3, note: 'Creates two variables, title and company, from the matching properties.' },
          { line: 7, note: 'job has no status, so the default "applied" is used.' }
        ],
        tryIt: 'Also take out salary with destructuring and print it using a template string: `Salary: ${salary}`.',
        check: {
          question: 'After const { city } = { name: "Ravi" }; what is city?',
          options: ['"Ravi"', 'undefined', 'An error'],
          answer: 1,
          why: 'The object has no city property, so the variable city is undefined.'
        }
      },
      {
        title: 'Destructuring arrays: the useState pattern',
        say: [
          'Arrays can be destructured too, but with square brackets, and the values are taken by position, not by name. const [first, second] = list; puts list[0] into first and list[1] into second.',
          'Because it is by position, you can choose any names you like. That is different from objects, where the names must match.',
          'Why learn this now? Next week you will write this line again and again: const [count, setCount] = useState(0);. useState gives back an array of two things: the current value and a function to change it. Array destructuring gives them nice names in one line.',
          'The code below imitates useState with a normal function that returns an array of two items, so you can see exactly how that line works.'
        ],
        example: 'Think of a queue at a ticket counter. The first person in line goes to counter A, the second to counter B. People are assigned by their position, not by their name. Array destructuring works by position.',
        code: lines(
          'const skills = ["HTML", "CSS", "JavaScript"];',
          'const [first, second] = skills;',
          'console.log(first);',
          'console.log(second);',
          '',
          'function fakeUseState(start) {',
          '  const setValue = (v) => console.log(`Would change to ${v}`);',
          '  return [start, setValue];',
          '}',
          '',
          'const [count, setCount] = fakeUseState(0);',
          'console.log(count);',
          'setCount(1);'
        ),
        output: lines('HTML', 'CSS', '0', 'Would change to 1'),
        codeNotes: [
          { line: 2, note: 'By position: first gets skills[0], second gets skills[1].' },
          { line: 8, note: 'The function returns an array with two items: a value and a function.' },
          { line: 11, note: 'The same shape as React\'s useState line you will write next week.' }
        ],
        tryIt: 'Add a third name to line 2: const [first, second, third] = skills; and print third.',
        check: {
          question: 'In const [a, b] = [10, 20]; what is b?',
          options: ['10', '20', 'undefined'],
          answer: 1,
          why: 'Array destructuring goes by position: a gets the first item (10), b gets the second (20).'
        }
      },
      {
        title: 'Spread with arrays: copying and adding',
        say: [
          'Here is a surprise that confuses many beginners. If you write const b = a; with an array, you do not get a copy. Both names point to the same array. Change b, and a changes too.',
          'To make a real copy, use the spread operator: three dots. [...a] means: a new array containing all the items of a. You can add items at the same time: [...jobs, newJob] makes a new array with every old job plus the new one at the end.',
          'React needs this. React decides whether to redraw the screen by checking if you gave it a new array. If you push into the old array, React may not notice the change, and your screen will not update. So in React, you add items with [...jobs, newJob], never with push.',
          'Today\'s second practice task, addJob, is exactly this pattern.'
        ],
        example: 'Sharing a Google Doc link is like const b = a: both people edit the same document. Making a copy of the doc is like [...a]: now you each have your own, and changes to one do not touch the other.',
        code: lines(
          'const a = [1, 2];',
          'const b = a;',
          'b.push(3);',
          'console.log(a);',
          '',
          'const c = [...a];',
          'c.push(4);',
          'console.log(a);',
          'console.log(c);',
          '',
          'const jobs = ["Dev", "Tester"];',
          'const moreJobs = [...jobs, "Designer"];',
          'console.log(moreJobs);'
        ),
        output: lines('[ 1, 2, 3 ]', '[ 1, 2, 3 ]', '[ 1, 2, 3, 4 ]', '[ \'Dev\', \'Tester\', \'Designer\' ]'),
        codeNotes: [
          { line: 2, note: 'Not a copy: b and a are the same array.' },
          { line: 4, note: 'a changed too, because b.push changed the shared array.' },
          { line: 6, note: 'A real copy with spread. Changing c does not touch a.' },
          { line: 12, note: 'The React way to add an item: a new array with the old items plus the new one.' }
        ],
        tryIt: 'Make a new array with "Intern" at the START instead of the end: ["Intern", ...jobs]. Print it.',
        check: {
          question: 'How should you add newJob to jobs in React?',
          options: ['jobs.push(newJob)', '[...jobs, newJob]', 'jobs = newJob'],
          answer: 1,
          why: 'React needs a new array to notice the change. Spread makes a new array with the new item added.'
        }
      },
      {
        title: 'Spread with objects: updating one detail',
        say: [
          'Objects work the same way. const copy = { ...job }; makes a new object with all the properties of job.',
          'The really useful part: you can change some properties while copying. { ...job, status: "offer" } means: copy everything from job, then set status to "offer". Properties written after the spread win.',
          'This is how you update anything in React: the job status, a form field, a user setting. You never change the old object; you create an updated copy. The original stays untouched, which also makes bugs much easier to find.',
          'Order matters. If you write { status: "offer", ...job }, the spread comes last and puts the old status back. Always put the spread first, then your changes.'
        ],
        example: 'When you update your address on a bank form, the bank does not scratch out your old form. It makes a new record with everything the same except the address. Spread with objects does exactly that.',
        code: lines(
          'const job = { title: "Dev", company: "TCS", status: "applied" };',
          '',
          'const updated = { ...job, status: "interview" };',
          'console.log(updated);',
          'console.log(job.status);',
          '',
          'const wrongOrder = { status: "offer", ...job };',
          'console.log(wrongOrder.status);'
        ),
        output: lines(
          '{ title: \'Dev\', company: \'TCS\', status: \'interview\' }',
          'applied',
          'applied'
        ),
        codeNotes: [
          { line: 3, note: 'Copy everything, then set status to "interview".' },
          { line: 5, note: 'The original job is unchanged.' },
          { line: 7, note: 'Wrong order: the spread comes last and overwrites status back to "applied".' }
        ],
        tryIt: 'Make a copy of job with both status: "offer" and a new property salary: 500000. Print it.',
        check: {
          question: 'What is { ...{ a: 1, b: 2 }, b: 5 }?',
          options: ['{ a: 1, b: 2 }', '{ a: 1, b: 5 }', '{ b: 5 }'],
          answer: 1,
          why: 'Everything is copied first, then b is set to 5 because it comes after the spread.'
        }
      },
      {
        title: 'Safe access with ?. and ??',
        say: [
          'Real data is often incomplete. A job may have no salary. A user may not be logged in, so user is null. Reading user.name then crashes with "Cannot read properties of null".',
          'Optional chaining, written ?., protects you. user?.name means: if user exists, give me its name; if user is null or undefined, just give undefined instead of crashing.',
          'The ?? operator gives a fallback value when something is null or undefined: job.salary ?? "Not shared" shows "Not shared" when the salary is missing. Together, ?. and ?? let you show sensible text instead of crashing or showing "undefined" on screen.',
          'Well done: you now know the modern JavaScript that React code is full of. Tomorrow you create your very first React project.'
        ],
        example: 'Before asking a shopkeeper for a specific brand, you check whether the shop is open. If it is closed, you do not argue with a locked door; you go with plan B. ?. checks first, and ?? is your plan B.',
        code: lines(
          'const user = null;',
          'console.log(user?.name);',
          '',
          'const job = { title: "Dev" };',
          'console.log(job.salary ?? "Not shared");',
          '',
          'const loggedIn = { name: "Asha" };',
          'console.log(loggedIn?.name ?? "Guest");',
          'console.log(user?.name ?? "Guest");'
        ),
        output: lines('undefined', 'Not shared', 'Asha', 'Guest'),
        codeNotes: [
          { line: 2, note: 'user is null, so ?. gives undefined instead of crashing.' },
          { line: 5, note: 'salary is missing, so ?? uses the fallback text.' },
          { line: 9, note: 'Combined: no user, so show "Guest".' }
        ],
        tryIt: 'Remove the ?. from line 2 (write user.name) and run it. Read the error. Then put it back.',
        check: {
          question: 'What does null ?? "Guest" give?',
          options: ['null', '"Guest"', 'An error'],
          answer: 1,
          why: '?? uses the right side when the left side is null or undefined.'
        }
      }
    ],
    summary: [
      'Template strings use backticks and ${ } to put values into text.',
      'Object destructuring takes properties by name; array destructuring takes items by position.',
      '[...list, item] and { ...obj, key: value } make updated copies; React needs new copies, not changes.',
      '?. avoids crashes on missing data; ?? gives a fallback value.'
    ],
    projectStep: {
      title: 'Update jobs the React way',
      steps: [
        'Write a function describe(job) that uses destructuring and a template string: "Dev at TCS (applied)".',
        'Create a new job and add it with spread: const next = [...jobs, newJob].',
        'Change one job\'s status by making a copy with spread, and print both the old and new job.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 7,
    title: 'Modules and Creating Your First React Project',
    goal: 'You can split code into files with import and export, and you will create and run your own React project on your laptop.',
    minutes: 35,
    recap: 'Yesterday you learned template strings, destructuring and spread, the modern JavaScript React uses everywhere.',
    parts: [
      {
        title: 'Why real apps use many files',
        say: [
          'Everything you wrote so far fit in one small file. A real app like Swiggy has thousands of functions. If everything were in one file, nobody could find anything, and two developers editing the same file at once would keep breaking each other\'s work.',
          'So apps are split into many small files, each with one clear job. In React, the usual habit is one component per file: Header.jsx, JobCard.jsx, JobList.jsx.',
          'For this to work, a file must be able to share its code with other files, and other files must be able to use it. That is what export and import do.'
        ],
        example: 'A textbook is split into chapters, and each chapter can say "see Chapter 3" instead of repeating it. Files in an app are chapters, and import is the "see Chapter 3" reference.',
        check: {
          question: 'Why do apps split code into many files?',
          options: ['Browsers can only read small files', 'To keep code organised and easy to find and share', 'Files make code run faster'],
          answer: 1,
          why: 'Small files with one job each are easier to understand, find and work on together.'
        }
      },
      {
        title: 'export and import',
        say: [
          'To share something from a file, put export in front of it: export function formatSalary(amount) { ... }. Now other files are allowed to use it.',
          'To use it in another file, import it at the top, with the file path: import { formatSalary } from "./utils.js";. The ./ means "in the same folder as this file". The name inside the curly brackets must match the exported name. This is called a named export.',
          'There is also a default export, used for the main thing a file offers: export default function JobCard() { ... }. You import it without curly brackets, and you can choose the name: import JobCard from "./JobCard.jsx";. React components are usually default exports.',
          'The in-lesson code box runs a single file, so the two files below are shown for reading. You will use exactly this pattern in your project from tomorrow.'
        ],
        example: 'A school library lends books only if they are on the lending shelf (export). A student must fill a slip with the exact book name to borrow it (import). Books not on the shelf stay inside the library.',
        projectCode: {
          label: 'Two files in your project',
          code: lines(
            '// utils.js',
            'export function formatSalary(amount) {',
            '  return `₹${amount.toLocaleString("en-IN")}`;',
            '}',
            '',
            '// JobCard.jsx',
            'import { formatSalary } from "./utils.js";',
            '',
            'export default function JobCard({ title, salary }) {',
            '  return <p>{title}: {formatSalary(salary)}</p>;',
            '}'
          )
        },
        code: lines(
          'function formatSalary(amount) {',
          '  return "Rs " + amount.toLocaleString("en-IN");',
          '}',
          'console.log(formatSalary(450000));'
        ),
        output: 'Rs 4,50,000',
        codeNotes: [
          { line: 2, note: 'toLocaleString("en-IN") adds commas the Indian way: 4,50,000.' }
        ],
        tryIt: 'Call formatSalary(1200000) and see how it formats twelve lakh.',
        check: {
          question: 'How do you import a named export called formatSalary from ./utils.js?',
          options: ['import formatSalary from "./utils.js"', 'import { formatSalary } from "./utils.js"', 'export { formatSalary }'],
          answer: 1,
          why: 'Named exports are imported with curly brackets and the exact name.'
        }
      },
      {
        title: 'Node.js and npm: tools on your laptop',
        say: [
          'To build React apps on your laptop, you need two tools. Node.js lets your computer run JavaScript outside the browser. npm, which comes with Node.js, downloads packages: code that other developers have shared, like React itself.',
          'Install Node.js from nodejs.org: choose the LTS version, which means the stable one. Then open a terminal. On Windows, that is PowerShell or the terminal inside VS Code. Type node -v and npm -v. If both print a version number, you are ready.',
          'You also need a code editor. Most companies use VS Code, which is free. Install it from code.visualstudio.com.',
          'Every project has a file called package.json. It lists the packages the project needs. When you run npm install, npm reads that list and downloads everything into a folder called node_modules. You never edit node_modules yourself.'
        ],
        example: 'npm is like the Play Store for code. Instead of writing a camera app yourself, you install one. Instead of writing React yourself, npm installs it for you.',
        projectCode: {
          label: 'In your terminal',
          code: lines(
            'node -v',
            '# prints something like v22.11.0',
            'npm -v',
            '# prints something like 10.9.0'
          )
        },
        tryIt: 'Install Node.js (LTS) and VS Code now if you have not. Run node -v and npm -v in a terminal and check that both print a version.',
        check: {
          question: 'What does npm install do?',
          options: ['Deletes the project', 'Downloads the packages listed in package.json', 'Starts the website'],
          answer: 1,
          why: 'npm install reads package.json and downloads every package the project needs into node_modules.'
        }
      },
      {
        title: 'Create your React project with Vite',
        say: [
          'Now the exciting part: creating your own React app. We use a tool called Vite, pronounced "veet", which is French for fast. It sets up a React project in seconds.',
          'Open the terminal in the folder where you keep your projects, and run the four commands shown below, one at a time. The first one creates a folder called job-tracker with a ready-made React app inside. When it asks questions, choose React and then JavaScript.',
          'The last command, npm run dev, starts a small development server. It prints an address like http://localhost:5173. Open it in your browser, and you will see the Vite and React welcome page. That page is running from your own laptop.',
          'Keep that terminal open while you work. To stop the server, press Ctrl+C in the terminal. To start it again later, go into the folder and run npm run dev again.'
        ],
        example: 'It is like buying a flat that comes with the walls, wiring and plumbing already done. You move in and start decorating right away instead of building from bricks.',
        projectCode: {
          label: 'In your terminal',
          code: lines(
            'npm create vite@latest job-tracker -- --template react',
            'cd job-tracker',
            'npm install',
            'npm run dev'
          )
        },
        tryIt: 'Run the four commands. Open http://localhost:5173 in your browser and click the counter button on the welcome page. That button is React state, which you will learn on Day 12.',
        check: {
          question: 'Which command starts your app so you can see it in the browser?',
          options: ['npm install', 'npm run dev', 'node -v'],
          answer: 1,
          why: 'npm run dev starts the development server and prints the local address to open.'
        }
      },
      {
        title: 'A tour of your project',
        say: [
          'Open the job-tracker folder in VS Code (File, then Open Folder). Here are the parts that matter. index.html is the single HTML page. It has an empty div with the id root; React fills it with your app.',
          'src is where your code lives. src/main.jsx starts React and puts your App component into that root div. You rarely change this file. src/App.jsx is your main component: the whole screen starts here. This is where you will work.',
          'Files ending in .jsx are JavaScript files that contain JSX, the HTML-like syntax you learn tomorrow. package.json lists the packages, and node_modules holds them.',
          'Now replace everything in src/App.jsx with the short version below and save. Look at your browser: it updates instantly, without refreshing. This is called hot reload, and it makes building apps fast and fun.'
        ],
        example: 'Your project is like a house: index.html is the plot of land, main.jsx is the foundation, and App.jsx is the main room you will furnish every day.',
        projectCode: {
          label: 'src/App.jsx',
          code: lines(
            'export default function App() {',
            '  return (',
            '    <div>',
            '      <h1>My Job Tracker</h1>',
            '      <p>Track every job you apply to.</p>',
            '    </div>',
            '  );',
            '}'
          )
        },
        tryIt: 'Change the h1 text to your own name, like "Priya\'s Job Tracker", save, and watch the browser update by itself.',
        check: {
          question: 'Which file is your main screen component, where you will do most of your work?',
          options: ['index.html', 'src/App.jsx', 'package.json'],
          answer: 1,
          why: 'App.jsx holds the App component, which is the starting point of everything on your screen.'
        }
      },
      {
        title: 'Counting with objects (for today\'s practice)',
        say: [
          'Before you finish, one small but very useful trick for today\'s practice: counting things with an object. Suppose you want to know how many jobs are at each status.',
          'Start with an empty object, const counts = {};. Loop over the jobs. For each job, add 1 to counts[job.status]. The square brackets let you use the status text as the property name.',
          'But the first time a status appears, counts[job.status] is undefined, and undefined + 1 is NaN, which means "not a number". So we write (counts[job.status] || 0) + 1. The || 0 means: if there is nothing yet, start from 0.',
          'This counting pattern appears in dashboards everywhere: votes per option, orders per city, jobs per status. Your Job Tracker summary will use it.'
        ],
        example: 'A shopkeeper counting sales on paper: the first time someone buys Maggi, they write "Maggi: 1". Each next sale adds one to that line. A new item gets a new line starting at 1.',
        code: lines(
          'const jobs = [',
          '  { status: "applied" },',
          '  { status: "interview" },',
          '  { status: "applied" }',
          '];',
          '',
          'const counts = {};',
          'for (const job of jobs) {',
          '  counts[job.status] = (counts[job.status] || 0) + 1;',
          '}',
          'console.log(counts);'
        ),
        output: '{ applied: 2, interview: 1 }',
        codeNotes: [
          { line: 7, note: 'Start with an empty object.' },
          { line: 9, note: 'Use the status text as the property name. || 0 starts new statuses at zero.' }
        ],
        tryIt: 'Add a job with status "offer" and run again. A new property appears by itself.',
        check: {
          question: 'Why do we write (counts[job.status] || 0) + 1?',
          options: ['To make the code shorter', 'Because the first time, counts[job.status] is undefined', 'Because statuses are numbers'],
          answer: 1,
          why: 'A new status has no count yet (undefined). || 0 makes it start from 0, so + 1 gives 1.'
        }
      }
    ],
    summary: [
      'Apps are split into files; export shares code and import uses it.',
      'Named exports use { } when importing; default exports do not.',
      'Node.js runs JavaScript on your laptop; npm installs packages listed in package.json.',
      'npm create vite, npm install, npm run dev: your React app runs at localhost:5173.',
      'Count things with an object: counts[key] = (counts[key] || 0) + 1.'
    ],
    projectStep: {
      title: 'Create the Job Tracker project',
      steps: [
        'Create the project with Vite and run it with npm run dev.',
        'Replace src/App.jsx with the short version from this lesson and put your own name in the heading.',
        'Delete src/App.css and remove its import line from App.jsx. We will add our own styles later.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 8,
    title: 'Your First Component and JSX',
    goal: 'You can write React components with JSX, follow the JSX rules, show JavaScript values on screen, and build a screen from several components.',
    minutes: 32,
    recap: 'Yesterday you created your Job Tracker project with Vite and saw React running on your laptop.',
    parts: [
      {
        title: 'What a component really is',
        say: [
          'Today you write real React. Remember from Day 3: a component is a function that returns what should appear on the screen. That is truly all it is.',
          'There are two rules. First, the name must start with a capital letter: Header, not header. That is how React tells your components apart from normal HTML tags like div. Second, it must return a single piece of screen, written in JSX.',
          'Look at the React code below. Header is a function that returns an h1. App returns a div that uses Header like a tag: <Header />. When React draws App, it calls your Header function and puts its result there.',
          'The runnable box shows the same idea in plain JavaScript: functions that return pieces of a page, where one function uses another.'
        ],
        example: 'A component is like a rubber stamp. You design the stamp once (write the function), and every time you press it (use <Header />), the same design appears on the page.',
        projectCode: {
          label: 'src/App.jsx',
          code: lines(
            'function Header() {',
            '  return <h1>My Job Tracker</h1>;',
            '}',
            '',
            'export default function App() {',
            '  return (',
            '    <div>',
            '      <Header />',
            '      <p>Track every job you apply to.</p>',
            '    </div>',
            '  );',
            '}'
          )
        },
        code: lines(
          'function Header() {',
          '  return "<h1>My Job Tracker</h1>";',
          '}',
          '',
          'function App() {',
          '  return "<div>" + Header() + "<p>Track every job.</p></div>";',
          '}',
          '',
          'console.log(App());'
        ),
        output: '<div><h1>My Job Tracker</h1><p>Track every job.</p></div>',
        codeNotes: [
          { line: 1, note: 'A component: a function with a capital-letter name.' },
          { line: 6, note: 'App uses Header. In React you would write <Header /> instead of Header().' }
        ],
        tryIt: 'In your project, add a second component called Footer that returns <p>Made by YOUR NAME</p>, and use <Footer /> inside App below the paragraph.',
        check: {
          question: 'Which is a valid component name?',
          options: ['jobCard', 'JobCard', 'job-card'],
          answer: 1,
          why: 'Component names must start with a capital letter so React can tell them apart from HTML tags.'
        }
      },
      {
        title: 'JSX: HTML-like code inside JavaScript',
        say: [
          'The HTML-looking code inside return is JSX. It looks like HTML, but it is really JavaScript. Before the browser runs it, a tool turns every JSX tag into a JavaScript object that describes what to draw.',
          'For example, <h1 className="title">Hello</h1> becomes an object like { type: "h1", props: { className: "title", children: "Hello" } }. React reads these objects and creates the real page from them.',
          'You never write those objects yourself; JSX is the friendly way. But knowing it is JavaScript underneath explains all the JSX rules you will learn next. And it is why you can put JSX in variables, return it from functions, and put it in arrays.',
          'When JSX spans several lines, wrap it in round brackets after return, as in the examples. That avoids a classic mistake where JavaScript ends the return on the first line.'
        ],
        example: 'JSX is like writing a recipe in simple words that a translator then turns into precise kitchen instructions. You write the easy version; the tool produces the exact one the computer needs.',
        code: lines(
          'const element = {',
          '  type: "h1",',
          '  props: { className: "title", children: "Hello" }',
          '};',
          '',
          'console.log(element.type);',
          'console.log(element.props.children);'
        ),
        output: lines('h1', 'Hello'),
        codeNotes: [
          { line: 1, note: 'Roughly what <h1 className="title">Hello</h1> becomes after the JSX tool runs.' }
        ],
        tryIt: 'Write, as an object, what <p>Welcome</p> would become: type "p" and children "Welcome". Print its type.',
        check: {
          question: 'What is JSX really?',
          options: ['Real HTML', 'JavaScript that describes what to draw', 'A CSS file'],
          answer: 1,
          why: 'JSX is turned into JavaScript objects that tell React what to draw.'
        }
      },
      {
        title: 'The JSX rules',
        say: [
          'Because JSX is JavaScript, it has a few rules that differ from HTML. Rule one: a component must return one parent element. You cannot return two h1s side by side. Wrap them in a div, or in an empty tag <> </> called a fragment, which groups things without adding anything to the page.',
          'Rule two: use className instead of class, because class is a reserved word in JavaScript. Similarly, the for attribute on labels becomes htmlFor.',
          'Rule three: every tag must be closed. In HTML you may write <img> or <br> alone; in JSX you must write <img /> and <br /> with a slash.',
          'Rule four: attributes with two words use camelCase: onclick becomes onClick, and tabindex becomes tabIndex. If you break a rule, the browser page and the terminal show a clear error message. Read it: it usually tells you the exact line.'
        ],
        example: 'It is like writing a formal letter instead of a text message. The words are mostly the same, but there are a few strict rules about format, and following them avoids confusion.',
        projectCode: {
          label: 'Wrong vs right',
          code: lines(
            '// Wrong: two parents, class, unclosed img',
            'return (',
            '  <h1 class="title">Jobs</h1>',
            '  <img src="logo.png">',
            ');',
            '',
            '// Right',
            'return (',
            '  <>',
            '    <h1 className="title">Jobs</h1>',
            '    <img src="logo.png" alt="Logo" />',
            '  </>',
            ');'
          )
        },
        tryIt: 'In your App.jsx, deliberately write class instead of className on the h1, save, and look at the warning in the browser console (press F12). Then fix it.',
        check: {
          question: 'Which JSX is correct?',
          options: ['<img src="a.png">', '<img src="a.png" />', '<img src="a.png"></img class>'],
          answer: 1,
          why: 'Every tag must be closed in JSX. Tags with nothing inside close themselves with />.'
        }
      },
      {
        title: 'Curly braces: showing JavaScript values',
        say: [
          'A screen that always shows the same text is not very useful. To show a JavaScript value inside JSX, put it inside curly braces: <h1>Hello, {name}</h1>. Whatever is inside the braces is calculated and shown.',
          'You can put any expression in the braces: a variable {name}, maths {jobs.length * 2}, a function call {name.toUpperCase()}, or a template string. You cannot put statements like if or for inside braces; you will learn the React way to do those on Days 10 and 11.',
          'Braces also work for attribute values: <img src={photoUrl} />. Use quotes for fixed text and braces for JavaScript values.',
          'This is the same idea as ${ } in template strings from Day 6. The runnable box shows the template-string version so you can compare.'
        ],
        example: 'Curly braces are like the blanks in a fill-in-the-blanks form. The form (JSX) stays the same, and the blanks show whatever value you give them today.',
        projectCode: {
          label: 'src/App.jsx',
          code: lines(
            'export default function App() {',
            '  const name = "Asha";',
            '  const jobsApplied = 5;',
            '  return (',
            '    <div>',
            '      <h1>{name}\'s Job Tracker</h1>',
            '      <p>You applied to {jobsApplied} jobs.</p>',
            '      <p>Goal this month: {jobsApplied * 4}</p>',
            '    </div>',
            '  );',
            '}'
          )
        },
        code: lines(
          'const name = "Asha";',
          'const jobsApplied = 5;',
          'console.log(`<h1>${name}\'s Job Tracker</h1>`);',
          'console.log(`<p>Goal this month: ${jobsApplied * 4}</p>`);'
        ),
        output: lines('<h1>Asha\'s Job Tracker</h1>', '<p>Goal this month: 20</p>'),
        codeNotes: [
          { line: 3, note: '${name} in a template string does what {name} does in JSX.' }
        ],
        tryIt: 'In your project, add a variable today = new Date().toDateString() and show it in a paragraph: <p>Today is {today}</p>.',
        check: {
          question: 'How do you show the value of a variable city in JSX?',
          options: ['<p>city</p>', '<p>{city}</p>', '<p>${city}</p>'],
          answer: 1,
          why: 'Curly braces put a JavaScript value into JSX. ${ } is only for template strings.'
        }
      },
      {
        title: 'Components inside components',
        say: [
          'The real power of components is putting them together. App can use Header, Summary and JobCard. JobCard can use a StatusBadge. Each is small and simple, and together they form the whole screen. This is called a component tree.',
          'When you design a screen, draw boxes around its parts. Each box that has its own job, or that repeats, becomes a component. A good component usually fits on one screen of code.',
          'Right now your JobCard always shows the same job, because it has no inputs yet. Tomorrow you will give components inputs called props, so the same JobCard can show any job.',
          'The runnable box shows the tree idea with plain functions: App calls Header and two JobCards.'
        ],
        example: 'A car is made from parts: engine, wheels, seats. Each part is made separately and tested separately, then put together. You can also reuse the same wheel design four times.',
        code: lines(
          'const Header = () => "[Header: My Job Tracker]";',
          'const JobCard = () => "[JobCard: Frontend Developer at Infosys]";',
          '',
          'const App = () => [Header(), JobCard(), JobCard()].join("\\n");',
          '',
          'console.log(App());'
        ),
        output: lines('[Header: My Job Tracker]', '[JobCard: Frontend Developer at Infosys]', '[JobCard: Frontend Developer at Infosys]'),
        codeNotes: [
          { line: 4, note: 'App is built from smaller pieces. The same JobCard is used twice.' }
        ],
        tryIt: 'Notice both JobCards show the same job. That is the problem props solve tomorrow. Try adding a Footer piece to App.',
        check: {
          question: 'When should a part of the screen become its own component?',
          options: ['Never, keep everything in App', 'When it has its own job or repeats', 'Only for buttons'],
          answer: 1,
          why: 'Parts that repeat or have a clear job of their own are good components.'
        }
      },
      {
        title: 'Your first real components in the Job Tracker',
        say: [
          'Let us give your Job Tracker its first real structure. Create a folder called components inside src. Inside it, create Header.jsx and JobCard.jsx, one component per file, each with export default.',
          'Then import them in App.jsx and use them. The code below shows all three files. Type them yourself instead of copying: typing builds the muscle memory that makes you fast in interviews.',
          'Save and look at your browser. You should see the heading and one job card. If you see a blank page, press F12 and read the red error in the Console tab: usually it is a missing import or a typo in a file name.',
          'You have just built a React app from components. Tomorrow, the job card learns to show any job.'
        ],
        example: 'Like a kitchen with separate stations for chopping, cooking and plating: each file is a station, and App.jsx is the head chef bringing the dish together.',
        projectCode: {
          label: 'src/components/Header.jsx, JobCard.jsx and src/App.jsx',
          code: lines(
            '// src/components/Header.jsx',
            'export default function Header() {',
            '  return <h1>My Job Tracker</h1>;',
            '}',
            '',
            '// src/components/JobCard.jsx',
            'export default function JobCard() {',
            '  return (',
            '    <div className="job-card">',
            '      <h3>Frontend Developer</h3>',
            '      <p>Infosys · applied</p>',
            '    </div>',
            '  );',
            '}',
            '',
            '// src/App.jsx',
            'import Header from "./components/Header.jsx";',
            'import JobCard from "./components/JobCard.jsx";',
            '',
            'export default function App() {',
            '  return (',
            '    <div>',
            '      <Header />',
            '      <JobCard />',
            '    </div>',
            '  );',
            '}'
          )
        },
        tryIt: 'Create the three files in your project and check that the heading and card appear in the browser.',
        check: {
          question: 'Your page is blank after adding a component. What should you do first?',
          options: ['Delete the project', 'Press F12 and read the error in the Console', 'Restart the computer'],
          answer: 1,
          why: 'The browser console shows the exact error, usually a wrong import path or a typo.'
        }
      }
    ],
    summary: [
      'A component is a function with a capital-letter name that returns JSX.',
      'JSX is JavaScript underneath: one parent, className, close every tag, camelCase attributes.',
      'Curly braces {value} show JavaScript values inside JSX.',
      'Screens are trees of small components; keep one component per file with export default.'
    ],
    projectStep: {
      title: 'Header and JobCard components',
      steps: [
        'Create src/components/Header.jsx and src/components/JobCard.jsx.',
        'Import and use both in App.jsx.',
        'Add a Summary component that shows "Total jobs: 5" (a fixed number for now).'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 9,
    title: 'Props: Passing Data to Components',
    goal: 'You can pass data into components with props, read props with destructuring and defaults, and understand that props flow one way, from parent to child.',
    minutes: 30,
    recap: 'Yesterday you built your first components with JSX, but your JobCard always showed the same job.',
    parts: [
      {
        title: 'Why components need props',
        say: [
          'Yesterday\'s JobCard always showed "Frontend Developer at Infosys". A real list has many different jobs. Writing a new component for each job would be silly.',
          'Props are the answer. Props are the inputs of a component, just like parameters are the inputs of a function. The parent decides the values, and the component uses them to decide what to show.',
          'With props, you write JobCard once and use it for any job: <JobCard title="Tester" company="TCS" />. The word props is short for properties.',
          'Think back to Day 3, where getResult(score) gave a different answer for each score. A component with props is the same idea: one function, different inputs, different results. The only change is that the result is a piece of screen instead of a word. The runnable box shows exactly this: one JobCard function called with two different props objects.'
        ],
        example: 'A wedding invitation card design is made once. Each printed copy has a different guest\'s name written on it. The design is the component; the guest\'s name is a prop.',
        code: lines(
          'function JobCard(props) {',
          '  return `${props.title} at ${props.company}`;',
          '}',
          '',
          'console.log(JobCard({ title: "Frontend Developer", company: "Infosys" }));',
          'console.log(JobCard({ title: "Tester", company: "TCS" }));'
        ),
        output: lines('Frontend Developer at Infosys', 'Tester at TCS'),
        codeNotes: [
          { line: 1, note: 'props is one object holding all the inputs.' },
          { line: 5, note: 'In React you would write <JobCard title="..." company="..." />. React collects them into this object.' }
        ],
        tryIt: 'Add a third call for a job you want, like a UI Developer at Swiggy.',
        check: {
          question: 'What are props?',
          options: ['The inputs a parent gives to a component', 'CSS styles', 'A type of loop'],
          answer: 0,
          why: 'Props are the inputs of a component, given by the parent that uses it.'
        }
      },
      {
        title: 'Passing props',
        say: [
          'You pass props like HTML attributes. Text goes in quotes: title="Tester". Anything else, like numbers, booleans, arrays, objects or variables, goes in curly braces: salary={400000}, remote={true}, job={myJob}.',
          'React collects all the attributes you wrote into one object and passes it to your component function. So <JobCard title="Tester" salary={400000} /> calls JobCard with { title: "Tester", salary: 400000 }.',
          'A common mistake is salary="400000" with quotes: that passes text, not a number, and maths on it will surprise you, like on Day 2. Use braces for numbers.',
          'A shortcut worth knowing: writing just the prop name with no value, like <JobCard remote />, passes true. It is the same as remote={true}. You will see this often with props like disabled on buttons.'
        ],
        example: 'Filling a courier form: the name field takes text, the weight field takes a number, the "fragile" checkbox is yes or no. Each field is a prop with the right kind of value.',
        projectCode: {
          label: 'src/App.jsx',
          code: lines(
            'import JobCard from "./components/JobCard.jsx";',
            '',
            'export default function App() {',
            '  return (',
            '    <div>',
            '      <JobCard title="Frontend Developer" company="Infosys" salary={400000} />',
            '      <JobCard title="Tester" company="TCS" salary={300000} />',
            '    </div>',
            '  );',
            '}'
          )
        },
        code: lines(
          'const props = { title: "Tester", salary: "300000" };',
          'console.log(props.salary + 50000);',
          '',
          'const fixed = { title: "Tester", salary: 300000 };',
          'console.log(fixed.salary + 50000);'
        ),
        output: lines('30000050000', '350000'),
        codeNotes: [
          { line: 1, note: 'salary="300000" with quotes passes text.' },
          { line: 2, note: 'Text + number joins them: the Day 2 trap.' },
          { line: 4, note: 'salary={300000} with braces passes a real number.' }
        ],
        tryIt: 'In your project, pass title, company and salary to two JobCards in App.jsx.',
        check: {
          question: 'How do you pass the number 5 as a prop called count?',
          options: ['count="5"', 'count={5}', 'count=5'],
          answer: 1,
          why: 'Non-text values go inside curly braces. Quotes would pass the text "5".'
        }
      },
      {
        title: 'Reading props with destructuring',
        say: [
          'Writing props.title and props.company everywhere gets long. Instead, destructure the props right in the function\'s brackets: function JobCard({ title, company, salary }). This is the Day 6 destructuring, placed where the parameter goes.',
          'Now you use title, company and salary directly. The component also becomes self-documenting: anyone reading the first line sees exactly which inputs it expects.',
          'This is how almost all React components start. When you read company code, the first line of a component tells you its props.',
          'Be careful with spelling. If the parent passes companyName but the component destructures company, then company is simply undefined, and nothing warns you. When a value is missing on screen, compare the prop name in the parent with the name in the component\'s first line.'
        ],
        example: 'When a package arrives, you open it and put each item straight into its place: the charger on the desk, the cable in the drawer. Destructuring unpacks props straight into named variables.',
        projectCode: {
          label: 'src/components/JobCard.jsx',
          code: lines(
            'export default function JobCard({ title, company, salary }) {',
            '  return (',
            '    <div className="job-card">',
            '      <h3>{title}</h3>',
            '      <p>{company} · ₹{salary.toLocaleString("en-IN")}</p>',
            '    </div>',
            '  );',
            '}'
          )
        },
        code: lines(
          'function JobCard({ title, company, salary }) {',
          '  return `${title} | ${company} | Rs ${salary.toLocaleString("en-IN")}`;',
          '}',
          '',
          'console.log(JobCard({ title: "Frontend Developer", company: "Infosys", salary: 400000 }));'
        ),
        output: 'Frontend Developer | Infosys | Rs 4,00,000',
        codeNotes: [
          { line: 1, note: 'Destructuring in the brackets: title, company and salary come straight out of props.' }
        ],
        tryIt: 'Add a city prop: destructure it and show it in the text.',
        check: {
          question: 'What does function Card({ name }) do with the props object?',
          options: ['Ignores it', 'Takes out the name property as a variable', 'Renames props to name'],
          answer: 1,
          why: 'It destructures props, creating a variable name from props.name.'
        }
      },
      {
        title: 'Default values for props',
        say: [
          'Sometimes a parent does not pass every prop. A new job has no status yet, or a button has no colour chosen. Without a default, the prop is undefined, and your screen may show "undefined".',
          'Give a default in the destructuring: function JobCard({ title, status = "applied" }). If the parent passes a status, it is used; if not, "applied" is used.',
          'Defaults make components safer and easier to use: the parent only passes what is different from the usual case. Today\'s first practice task, Button with a default colour, is exactly this.',
          'A default is used only when the prop is missing or undefined. If the parent passes an empty text, status="", the default is not used, because empty text is still a value. Keep this in mind when data comes from a form.'
        ],
        example: 'When you order tea at a stall without saying anything else, you get the usual: with milk and sugar. You only speak up if you want something different. Defaults are "the usual".',
        code: lines(
          'function StatusBadge({ status = "applied" }) {',
          '  return `[${status.toUpperCase()}]`;',
          '}',
          '',
          'console.log(StatusBadge({ status: "interview" }));',
          'console.log(StatusBadge({}));'
        ),
        output: lines('[INTERVIEW]', '[APPLIED]'),
        codeNotes: [
          { line: 1, note: 'If no status is passed, use "applied".' },
          { line: 6, note: 'No status given, so the default is used.' }
        ],
        tryIt: 'Add a second prop color = "grey" and include it in the text, like [APPLIED - grey].',
        check: {
          question: 'With function Button({ label, size = "medium" }), what is size for <Button label="Save" />?',
          options: ['undefined', '"medium"', '"Save"'],
          answer: 1,
          why: 'size was not passed, so the default "medium" is used.'
        }
      },
      {
        title: 'Passing a whole object as a prop',
        say: [
          'Your jobs are objects. Instead of passing each property separately, you can pass the whole object: <JobCard job={job} />. Inside, destructure it: function JobCard({ job }), then use job.title, job.company.',
          'You can even destructure one level deeper: function JobCard({ job: { title, company } }). But that gets hard to read, so most developers keep it simple: take job, then read its properties.',
          'Which style is better? Separate props make it clear exactly what a component needs. A whole object is shorter when the component shows most of the object\'s details. Both are fine; be consistent in your project.',
          'In interviews you may be asked about this choice. A good answer: separate props make a component easier to reuse with different data shapes, while passing an object keeps the parent short. Saying why you chose one shows you understand, not just that you can type code.'
        ],
        example: 'You can hand your friend each document separately, or hand over the whole file folder. The folder is quicker when they need most of what is inside.',
        code: lines(
          'const job = { id: 1, title: "React Developer", company: "Zoho", status: "interview" };',
          '',
          'function JobCard({ job }) {',
          '  return `${job.title} at ${job.company} (${job.status})`;',
          '}',
          '',
          'console.log(JobCard({ job: job }));'
        ),
        output: 'React Developer at Zoho (interview)',
        codeNotes: [
          { line: 3, note: 'The component receives one prop called job, which is an object.' },
          { line: 7, note: 'In React: <JobCard job={job} />.' }
        ],
        tryIt: 'Change the function so it shows the status in capital letters.',
        check: {
          question: 'How do you pass a job object as a prop?',
          options: ['<JobCard job="job" />', '<JobCard job={job} />', '<JobCard {job} />'],
          answer: 1,
          why: 'Objects are JavaScript values, so they go in curly braces. Quotes would pass the text "job".'
        }
      },
      {
        title: 'Props flow one way and are read-only',
        say: [
          'Props always flow down: from parent to child. A child cannot send props back up, and it must never change the props it receives. Treat props as read-only.',
          'Why? If a child could change its props, the same data might show differently in different places, and bugs would be very hard to track. With one-way flow, you always know where data comes from: look at the parent.',
          'But what if a child needs to tell the parent something, like "the delete button was clicked"? The parent passes a function as a prop, and the child calls it. You will do this on Day 15. And data that changes over time lives in state, which you learn on Day 12.',
          'That completes props. With components and props, you can already build any static screen. Next: showing whole lists.'
        ],
        example: 'A teacher gives each student a printed question paper. Students answer on their own answer sheet; they do not change the question paper. If they have a doubt, they raise their hand to tell the teacher, which is like calling a function prop.',
        code: lines(
          'function JobCard(props) {',
          '  const label = props.status.toUpperCase();',
          '  return `${props.title}: ${label}`;',
          '}',
          '',
          'const props = { title: "Dev", status: "applied" };',
          'console.log(JobCard(props));',
          'console.log(props.status);'
        ),
        output: lines('Dev: APPLIED', 'applied'),
        codeNotes: [
          { line: 2, note: 'Right: make a new variable from the prop instead of changing the prop itself.' },
          { line: 8, note: 'The original props are unchanged.' }
        ],
        tryIt: 'Think: which component in your Job Tracker should own the list of jobs, App or JobCard? (Answer: App, because it is the parent that passes each job down.)',
        check: {
          question: 'Can a child component change the props it receives?',
          options: ['Yes, any time', 'No, props are read-only', 'Only numbers'],
          answer: 1,
          why: 'Props flow down and are read-only. Changing data is done with state, owned by a component.'
        }
      }
    ],
    summary: [
      'Props are the inputs of a component, passed like attributes: text in quotes, everything else in { }.',
      'Destructure props in the function brackets: function JobCard({ title, company }).',
      'Give defaults for optional props: { status = "applied" }.',
      'You can pass a whole object: <JobCard job={job} />.',
      'Props flow one way, parent to child, and are read-only.'
    ],
    projectStep: {
      title: 'Make JobCard show any job',
      steps: [
        'Change JobCard to accept title, company and status props, with status defaulting to "applied".',
        'In App.jsx, show three JobCards with three different jobs from your list.',
        'Make Summary accept a total prop and pass 3 from App.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 10,
    title: 'Showing Lists with map and key',
    goal: 'You can show a whole list of jobs from an array with map, give every item a proper key, and show a message when the list is empty.',
    minutes: 30,
    recap: 'Yesterday you passed data into components with props, so one JobCard can show any job.',
    parts: [
      {
        title: 'From an array of data to a list on screen',
        say: [
          'Yesterday you wrote three JobCards by hand in App.jsx. But the real job list is an array, and it changes: jobs get added and deleted. You cannot hand-write a line for every job.',
          'This is where Day 5\'s map comes back. You map the array of job objects to an array of JobCard components: jobs.map(job => <JobCard ... />). Put that inside curly braces in your JSX, and React shows every item.',
          'That is it. This single pattern, data array plus map, is how every list in every React app is built: chats, products, songs, notifications.',
          'The runnable box does the same with text, so you can see map turning data into pieces of a page.'
        ],
        example: 'A printing press with one design and a list of names prints one invitation per name. The array is the list of names, map is the press, and JobCard is the design.',
        projectCode: {
          label: 'src/App.jsx',
          code: lines(
            'import JobCard from "./components/JobCard.jsx";',
            '',
            'const jobs = [',
            '  { id: 1, title: "Frontend Developer", company: "Infosys", status: "applied" },',
            '  { id: 2, title: "React Developer", company: "Zoho", status: "interview" },',
            '  { id: 3, title: "UI Developer", company: "Swiggy", status: "offer" }',
            '];',
            '',
            'export default function App() {',
            '  return (',
            '    <div>',
            '      {jobs.map(job => (',
            '        <JobCard key={job.id} title={job.title} company={job.company} status={job.status} />',
            '      ))}',
            '    </div>',
            '  );',
            '}'
          )
        },
        code: lines(
          'const jobs = [',
          '  { id: 1, title: "Frontend Developer" },',
          '  { id: 2, title: "React Developer" }',
          '];',
          '',
          'const items = jobs.map(job => `<li>${job.title}</li>`);',
          'console.log(items);',
          'console.log(`<ul>${items.join("")}</ul>`);'
        ),
        output: lines(
          '[ \'<li>Frontend Developer</li>\', \'<li>React Developer</li>\' ]',
          '<ul><li>Frontend Developer</li><li>React Developer</li></ul>'
        ),
        codeNotes: [
          { line: 6, note: 'map turns each job into a list item. In React, it would be a <JobCard />.' },
          { line: 8, note: 'Joined inside a ul. React does this joining for you.' }
        ],
        tryIt: 'Add a third job to the array and run again. The list grows by itself.',
        check: {
          question: 'How do you show a list of jobs in React?',
          options: ['Copy JobCard once per job by hand', 'Use jobs.map to turn each job into a JobCard', 'Use a for loop inside JSX'],
          answer: 1,
          why: 'map turns an array of data into an array of components, which React shows.'
        }
      },
      {
        title: 'Writing map inside JSX',
        say: [
          'Inside JSX, JavaScript goes in curly braces, so the map goes in braces too: {jobs.map(job => <JobCard ... />)}. Remember: you cannot write a for loop inside braces, because a loop is a statement, not a value. map is an expression that gives back an array, so it works.',
          'When the JSX for each item spans several lines, wrap it in round brackets after the arrow: job => ( <div> ... </div> ). Round brackets mean "return this"; curly brackets would need the word return.',
          'A very common bug: writing job => { <JobCard /> } with curly brackets and no return. The function returns nothing, and the list is empty with no error. If your list is empty, check this first.'
        ],
        example: 'It is like telling a helper: "for each guest, prepare a plate." map is that instruction, and the plate is what each arrow function returns.',
        code: lines(
          'const jobs = ["Dev", "Tester"];',
          '',
          'const wrong = jobs.map(job => { `<li>${job}</li>` });',
          'console.log(wrong);',
          '',
          'const right = jobs.map(job => `<li>${job}</li>`);',
          'console.log(right);'
        ),
        output: lines('[ undefined, undefined ]', '[ \'<li>Dev</li>\', \'<li>Tester</li>\' ]'),
        codeNotes: [
          { line: 3, note: 'Curly brackets with no return: every item becomes undefined. On screen, the list is empty.' },
          { line: 6, note: 'Without curly brackets, the value is returned automatically.' }
        ],
        tryIt: 'Fix line 3 by adding the word return inside the curly brackets, and run it again.',
        check: {
          question: 'Your map runs but the list is empty. What is the most likely cause?',
          options: ['map is broken', 'The arrow function uses { } without return', 'Too many items'],
          answer: 1,
          why: 'With curly brackets, an arrow function needs return. Without it, every item is undefined.'
        }
      },
      {
        title: 'Why every item needs a key',
        say: [
          'When you render a list, React asks for a key prop on each item: <JobCard key={job.id} ... />. If you forget, the browser console shows a warning: "Each child in a list should have a unique key prop."',
          'The key is how React recognises each item between updates. When you delete the second job, React uses the keys to know exactly which card to remove, instead of redrawing everything or, worse, mixing up which card shows what.',
          'A key must be unique within the list and stable, meaning the same item always has the same key. The job\'s id is perfect. Avoid using the position number (index) as a key when items can be added, deleted or reordered, because positions change and React gets confused.',
          'This is why every job in your data has an id. Today\'s second practice task checks that ids are unique.'
        ],
        example: 'In a classroom, the teacher identifies students by roll number, not by where they sit. If two students swap seats, the roll numbers still say who is who. The key is the roll number.',
        code: lines(
          'const jobs = [{ id: 1 }, { id: 2 }, { id: 2 }];',
          '',
          'const ids = jobs.map(job => job.id);',
          'const unique = new Set(ids);',
          'console.log(ids.length);',
          'console.log(unique.size);',
          'console.log(ids.length === unique.size ? "Keys are unique" : "Duplicate keys!");'
        ),
        output: lines('3', '2', 'Duplicate keys!'),
        codeNotes: [
          { line: 4, note: 'A Set keeps only one copy of each value, so duplicates disappear.' },
          { line: 7, note: 'If the Set is smaller, some ids were repeated.' }
        ],
        tryIt: 'Change the last id to 3 and run again. Now the keys are unique.',
        check: {
          question: 'What is the best key for a job in a list?',
          options: ['Its position in the array', 'Its unique id', 'Its title'],
          answer: 1,
          why: 'An id is unique and never changes. Positions change when items move; titles can repeat.'
        }
      },
      {
        title: 'When the list is empty',
        say: [
          'A new user has no jobs yet. If you only map, they see a blank area and wonder if the app is broken. Good apps show a helpful message instead: "No jobs yet. Add your first one!"',
          'In React, a simple way is: {jobs.length === 0 && <p>No jobs yet.</p>}. The && means: only if the left side is true, show the right side. You will learn more ways to show things conditionally tomorrow.',
          'A careful detail: write jobs.length === 0, not just jobs.length &&. If you write {jobs.length && ...} and the length is 0, React shows the number 0 on the screen. It is a famous small bug.'
        ],
        example: 'An empty shop shelf with a sign "New stock arriving Monday" is much better than a bare shelf. The sign tells you nothing is wrong.',
        projectCode: {
          label: 'Inside App\'s return',
          code: lines(
            '<div>',
            '  {jobs.length === 0 && <p>No jobs yet. Add your first one!</p>}',
            '  {jobs.map(job => (',
            '    <JobCard key={job.id} title={job.title} company={job.company} status={job.status} />',
            '  ))}',
            '</div>'
          )
        },
        code: lines(
          'function listMessage(jobs) {',
          '  return jobs.length === 0 ? "No jobs yet. Add your first one!" : `Showing ${jobs.length} jobs`;',
          '}',
          '',
          'console.log(listMessage([]));',
          'console.log(listMessage([{ id: 1 }, { id: 2 }]));'
        ),
        output: lines('No jobs yet. Add your first one!', 'Showing 2 jobs'),
        codeNotes: [
          { line: 2, note: 'The ? : chooses one of two messages. You will use it in JSX tomorrow.' }
        ],
        tryIt: 'In your project, temporarily make the jobs array empty ([]) and check that the message appears.',
        check: {
          question: 'Why write jobs.length === 0 && ... instead of !jobs.length or jobs.length && ...?',
          options: ['It is faster', 'jobs.length && ... can show a stray 0 on screen', 'There is no difference'],
          answer: 1,
          why: 'When the length is 0, jobs.length && ... gives 0, and React prints that 0. A clear comparison avoids it.'
        }
      },
      {
        title: 'filter and map together',
        say: [
          'Often you do not show every item. You might show only jobs at the interview stage, or only jobs that match a search. Combine filter and map, exactly like Day 5: jobs.filter(...).map(...).',
          'In JSX: {jobs.filter(job => job.status === "interview").map(job => <JobCard key={job.id} ... />)}. That line is a bit long, so many developers first make a variable above the return: const interviewJobs = jobs.filter(...); and then map that variable in the JSX.',
          'Putting calculations above the return and keeping the JSX simple is a good habit. Your JSX then reads almost like a description of the screen.'
        ],
        example: 'Your phone\'s gallery shows only "Favourites" when you tap that tab. The photos are all still there; the app just filters, then shows what is left.',
        code: lines(
          'const jobs = [',
          '  { id: 1, title: "Dev", status: "applied" },',
          '  { id: 2, title: "Tester", status: "interview" },',
          '  { id: 3, title: "Designer", status: "interview" }',
          '];',
          '',
          'const interviewJobs = jobs.filter(job => job.status === "interview");',
          'const cards = interviewJobs.map(job => `[${job.id}] ${job.title}`);',
          'console.log(cards);'
        ),
        output: '[ \'[2] Tester\', \'[3] Designer\' ]',
        codeNotes: [
          { line: 7, note: 'Calculate first, in a variable with a clear name.' },
          { line: 8, note: 'Then map only the filtered jobs.' }
        ],
        tryIt: 'Change the filter to show only "applied" jobs.',
        check: {
          question: 'Where is the cleanest place to filter a list before showing it?',
          options: ['In a variable above the return', 'Inside every JobCard', 'In index.html'],
          answer: 0,
          why: 'Calculating above the return keeps the JSX short and easy to read.'
        }
      },
      {
        title: 'Build the JobList component',
        say: [
          'Let us put today together in your Job Tracker. Create a JobList component that receives the jobs array as a prop, shows the empty message when needed, and maps every job to a JobCard with a key.',
          'Then App only needs <JobList jobs={jobs} />. Notice how App gets shorter and clearer as you split the screen into components.',
          'Move your jobs array to the top of App.jsx for now. From Day 12, it will live in state so you can add and delete jobs. Today\'s version is the skeleton that everything else builds on.',
          'Congratulations: you can now build any screen that shows data. After this lesson, you will have your second short test, covering Days 6 to 10.'
        ],
        example: 'A school notice board (JobList) holds many notices (JobCards). The principal\'s office (App) only needs to hand over the pile of notices; the board decides how to arrange them.',
        projectCode: {
          label: 'src/components/JobList.jsx and src/App.jsx',
          code: lines(
            '// src/components/JobList.jsx',
            'import JobCard from "./JobCard.jsx";',
            '',
            'export default function JobList({ jobs }) {',
            '  if (jobs.length === 0) {',
            '    return <p>No jobs yet. Add your first one!</p>;',
            '  }',
            '  return (',
            '    <div className="job-list">',
            '      {jobs.map(job => (',
            '        <JobCard key={job.id} title={job.title} company={job.company} status={job.status} />',
            '      ))}',
            '    </div>',
            '  );',
            '}',
            '',
            '// src/App.jsx',
            'import Header from "./components/Header.jsx";',
            'import JobList from "./components/JobList.jsx";',
            '',
            'const jobs = [ /* your 5 jobs from Day 4 */ ];',
            '',
            'export default function App() {',
            '  return (',
            '    <div>',
            '      <Header />',
            '      <JobList jobs={jobs} />',
            '    </div>',
            '  );',
            '}'
          )
        },
        tryIt: 'Create JobList.jsx, use it in App with your own 5 jobs, and check that all 5 cards appear with no key warning in the console (F12).',
        check: {
          question: 'What does App pass to JobList?',
          options: ['Each job separately', 'The whole jobs array as a prop', 'Nothing'],
          answer: 1,
          why: 'App passes the array: <JobList jobs={jobs} />. JobList then maps it to JobCards.'
        }
      }
    ],
    summary: [
      'Show lists by mapping data to components: {jobs.map(job => <JobCard ... />)}.',
      'Use ( ) after the arrow for multi-line JSX; { } needs return or the list is empty.',
      'Every list item needs a unique, stable key, usually its id.',
      'Show a helpful message for an empty list, using jobs.length === 0.',
      'Filter in a variable above the return, then map it.'
    ],
    projectStep: {
      title: 'Show the full job list',
      steps: [
        'Create JobList.jsx that maps jobs to JobCards with key={job.id}.',
        'Use <JobList jobs={jobs} /> in App with your 5 jobs.',
        'Make Summary show the real total with total={jobs.length}.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 11,
    title: 'Showing Things Only When Needed',
    goal: 'You can make a component show different things in different situations using if, && and the ? : operator.',
    minutes: 30,
    recap: 'Yesterday you showed a whole list of jobs with map and gave each card a key.',
    parts: [
      {
        title: 'Why screens change with the situation',
        say: [
          'Look at any app you use and notice how often the screen changes with the situation. While data loads, you see a spinner. If your inbox is empty, you see "No new mail". If you are logged out, you see a Login button; logged in, you see your photo.',
          'This is called conditional rendering: showing something only when a condition is true, or choosing between two things. It is not a new React feature. It is the if and ? : you learned on Day 3, used inside components.',
          'Your Job Tracker needs it right away: an empty-list message, an "Offer!" badge only on offer jobs, and different colours for different statuses. Today you learn the three ways to do it and when to use each.'
        ],
        example: 'A lift display shows the floor number normally, "Door opening" when the door opens, and "Overload" only when too many people get in. Same display, different message for each situation.',
        code: lines(
          'function Greeting(user) {',
          '  if (user) {',
          '    return `Welcome back, ${user.name}!`;',
          '  }',
          '  return "Please log in.";',
          '}',
          '',
          'console.log(Greeting({ name: "Asha" }));',
          'console.log(Greeting(null));'
        ),
        output: lines('Welcome back, Asha!', 'Please log in.'),
        codeNotes: [
          { line: 2, note: 'If there is a user, show a welcome.' },
          { line: 5, note: 'Otherwise, this line runs instead.' }
        ],
        tryIt: 'Add a check: if the user has isAdmin: true, return "Welcome, admin!" before the normal welcome.',
        check: {
          question: 'What is conditional rendering?',
          options: ['Showing different things depending on a condition', 'Making the page load faster', 'A special React library'],
          answer: 0,
          why: 'It means choosing what to show based on conditions, using normal JavaScript like if and ? :.'
        }
      },
      {
        title: 'Way 1: if with an early return',
        say: [
          'The clearest way is a normal if before the main return. If a special situation applies, return something different straight away. This is called an early return.',
          'For example, at the top of JobList: if (jobs.length === 0) return <p>No jobs yet.</p>;. The rest of the component only runs when there are jobs, so the main return stays simple.',
          'Use early returns for "whole screen" situations: loading, errors, empty lists, not logged in. Each situation gets its own if at the top, and the happy path comes last.',
          'You already did this on Day 10 in JobList. Now you know its name and why it is a good pattern.'
        ],
        example: 'A security guard at the building gate checks your ID first. No ID? You are turned back right there, and the rest of the building never needs to deal with you. That is an early return.',
        projectCode: {
          label: 'src/components/JobList.jsx',
          code: lines(
            'export default function JobList({ jobs, loading }) {',
            '  if (loading) {',
            '    return <p>Loading your jobs...</p>;',
            '  }',
            '  if (jobs.length === 0) {',
            '    return <p>No jobs yet. Add your first one!</p>;',
            '  }',
            '  return (',
            '    <div className="job-list">',
            '      {jobs.map(job => <JobCard key={job.id} {...job} />)}',
            '    </div>',
            '  );',
            '}'
          )
        },
        code: lines(
          'function JobList(jobs, loading) {',
          '  if (loading) return "Loading your jobs...";',
          '  if (jobs.length === 0) return "No jobs yet. Add your first one!";',
          '  return `Showing ${jobs.length} jobs`;',
          '}',
          '',
          'console.log(JobList([], true));',
          'console.log(JobList([], false));',
          'console.log(JobList([{}, {}], false));'
        ),
        output: lines('Loading your jobs...', 'No jobs yet. Add your first one!', 'Showing 2 jobs'),
        codeNotes: [
          { line: 2, note: 'Special situations first, each with its own early return.' },
          { line: 4, note: 'The normal case comes last.' }
        ],
        tryIt: 'Add an error parameter and, before the others, return "Could not load jobs" when error is true.',
        check: {
          question: 'Where do early returns usually go in a component?',
          options: ['At the top, before the main return', 'At the very end', 'Inside the JSX'],
          answer: 0,
          why: 'Special cases are handled first at the top, so the main return only deals with the normal case.'
        }
      },
      {
        title: 'Way 2: && to show something or nothing',
        say: [
          'Sometimes you do not want a whole different screen, just one small extra piece: a badge, a warning, a button. For "show this or show nothing", use && inside the JSX: {job.status === "offer" && <span>Offer!</span>}.',
          'How does it work? In JavaScript, a && b gives b when a is true, and gives a (false) when a is false. React shows nothing for false, null and undefined. So the badge appears only when the condition is true.',
          'Remember the trap from Day 10: numbers. {count && <p>...</p>} shows a 0 on screen when count is 0, because 0 is not false, it is a number React happily displays. Always use a real comparison on the left: {count > 0 && ...}.',
          'The runnable box shows what && gives back in different cases, so you can see the trap for yourself.'
        ],
        example: 'A shop puts a "SALE" sticker on a product only if it is discounted. No discount, no sticker. The shelf is otherwise the same.',
        code: lines(
          'console.log(true && "Offer!");',
          'console.log(false && "Offer!");',
          'console.log(0 && "You have jobs");',
          'console.log(0 > 0 && "You have jobs");'
        ),
        output: lines('Offer!', 'false', '0', 'false'),
        codeNotes: [
          { line: 1, note: 'True on the left: && gives the right side.' },
          { line: 2, note: 'False: React shows nothing for false.' },
          { line: 3, note: 'The trap: 0 is returned, and React would show "0" on screen.' },
          { line: 4, note: 'The fix: a real comparison gives false, which shows nothing.' }
        ],
        projectCode: {
          label: 'Inside JobCard',
          code: lines(
            '<div className="job-card">',
            '  <h3>{title}</h3>',
            '  {status === "offer" && <span className="badge">Offer!</span>}',
            '</div>'
          )
        },
        tryIt: 'Try console.log("" && "Hello"). Empty text is also falsy. Does it print anything visible?',
        check: {
          question: 'What does {jobs.length && <p>Jobs</p>} show when there are no jobs?',
          options: ['Nothing', 'The number 0', 'An error'],
          answer: 1,
          why: 'jobs.length is 0, so && gives 0, and React displays numbers. Use jobs.length > 0 instead.'
        }
      },
      {
        title: 'Way 3: ? : to choose between two things',
        say: [
          'When you need one thing or another, use the ternary operator: condition ? whenTrue : whenFalse. In JSX: {isLoggedIn ? <LogoutButton /> : <LoginButton />}.',
          'It is also great for small values like text or class names: <span>{remote ? "Remote" : "Office"}</span> or className={status === "offer" ? "card green" : "card"}.',
          'Keep ternaries short. If you find yourself nesting one ternary inside another, a ? b ? c : d : e, stop. It becomes very hard to read. Use an early return, a small helper function, or an object lookup instead.',
          'An object lookup is a neat trick: const colors = { applied: "grey", interview: "blue", offer: "green" }; then colors[status]. One line replaces a long chain of if statements.'
        ],
        example: 'A railway signal shows green or red. One of the two, always. The ternary is your two-light signal.',
        code: lines(
          'const remote = false;',
          'console.log(remote ? "Remote" : "Office");',
          '',
          'const colors = { applied: "grey", interview: "blue", offer: "green" };',
          'const status = "interview";',
          'console.log(colors[status] ?? "grey");',
          'console.log(`card ${status === "offer" ? "highlight" : ""}`.trim());'
        ),
        output: lines('Office', 'blue', 'card'),
        codeNotes: [
          { line: 2, note: 'One of two texts, chosen by the condition.' },
          { line: 6, note: 'Object lookup instead of many ifs. ?? gives a fallback for unknown statuses.' },
          { line: 7, note: 'A class name that changes with the status.' }
        ],
        tryIt: 'Add rejected: "red" to the colors object and change status to "rejected".',
        check: {
          question: 'Which is best for choosing between exactly two things in JSX?',
          options: ['&&', '? :', 'A for loop'],
          answer: 1,
          why: 'The ternary picks one of two options. && is for "something or nothing".'
        }
      },
      {
        title: 'Choosing the right way',
        say: [
          'Here is a simple guide. Whole different screen for a situation, like loading, error, empty or logged out: use an early return with if. Show an extra piece or nothing: use &&, with a real comparison on the left. One of two pieces or values: use ? :.',
          'Many situations: use an object lookup or a small function that returns the right piece. Never write long nested ternaries.',
          'A good test is to read your JSX out loud. "If the status is offer, show the badge" reads well. "If a then if b then c else d else e" does not. Code is read far more often than it is written, so write for the reader.',
          'Interviewers love asking "how do you conditionally render in React?". Now you can answer with all three ways and when to use each.'
        ],
        example: 'Choosing transport: for a long trip you take a train (early return, big decision), for an extra stop you add a detour (&&), for two routes you pick one (? :). The right tool depends on the size of the choice.',
        code: lines(
          'function statusLabel(status) {',
          '  const labels = { applied: "Applied", interview: "Interview", offer: "Offer" };',
          '  return labels[status] ?? "Unknown";',
          '}',
          '',
          'console.log(statusLabel("offer"));',
          'console.log(statusLabel("ghosted"));'
        ),
        output: lines('Offer', 'Unknown'),
        codeNotes: [
          { line: 2, note: 'An object lookup: clean even with many statuses.' }
        ],
        tryIt: 'Add rejected: "Rejected" to the labels and call statusLabel("rejected").',
        check: {
          question: 'Your page needs a completely different view while data is loading. Which way?',
          options: ['An early return with if', 'A nested ternary', '&&'],
          answer: 0,
          why: 'A whole different screen for a situation is clearest as an early return at the top of the component.'
        }
      },
      {
        title: 'Make the Job Tracker react to status',
        say: [
          'Let us use all this in your project. JobCard gets a coloured status badge using an object lookup, and an "Offer!" celebration only on offer jobs using &&.',
          'Summary shows "No interviews yet" when there are none, and "2 interviews!" otherwise, using a ternary.',
          'JobList keeps its early return for the empty list. With these three changes, your app already looks like it understands the data.',
          'Tomorrow is a big day: state. Your screen will finally be able to change while the user is using it, instead of only showing fixed data.'
        ],
        example: 'A good receptionist greets a regular customer by name, a new visitor politely, and a VIP with extra care. Your components now greet each job according to its situation.',
        projectCode: {
          label: 'src/components/JobCard.jsx',
          code: lines(
            'const STATUS_COLORS = { applied: "#64748b", interview: "#2563eb", offer: "#16a34a", rejected: "#dc2626" };',
            '',
            'export default function JobCard({ title, company, status = "applied" }) {',
            '  return (',
            '    <div className="job-card">',
            '      <h3>{title}</h3>',
            '      <p>{company}</p>',
            '      <span style={{ color: STATUS_COLORS[status] ?? "#64748b" }}>{status}</span>',
            '      {status === "offer" && <strong> 🎉 Offer!</strong>}',
            '    </div>',
            '  );',
            '}'
          )
        },
        tryIt: 'Update JobCard in your project like this, then change one job\'s status to "offer" in App and watch the badge appear.',
        check: {
          question: 'In style={{ color: STATUS_COLORS[status] }}, what are the double curly braces?',
          options: ['A mistake', 'Outer braces for JavaScript, inner braces for an object of styles', 'A special React loop'],
          answer: 1,
          why: 'The outer braces switch to JavaScript; the inner braces are the object holding the CSS values.'
        }
      }
    ],
    summary: [
      'Conditional rendering is normal JavaScript used inside components.',
      'Early return with if for whole-screen situations like loading, errors and empty lists.',
      '&& for "this or nothing"; always put a real comparison on the left to avoid a stray 0.',
      '? : for one of two things; use an object lookup for many options.'
    ],
    projectStep: {
      title: 'Status badges and smart messages',
      steps: [
        'Add coloured status badges to JobCard with an object lookup.',
        'Show "🎉 Offer!" only on offer jobs using &&.',
        'Make Summary say "No interviews yet" or "N interviews!" with a ternary.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 12,
    title: 'State with useState: Making the Screen Change',
    goal: 'You can give a component memory with useState, update it the right way, and understand why the screen redraws when state changes.',
    minutes: 32,
    recap: 'Yesterday you made components show different things in different situations.',
    parts: [
      {
        title: 'Why normal variables are not enough',
        say: [
          'So far your screens show data that never changes while the app is open. Real apps change all the time: a counter goes up, a menu opens, a new job is added. For that, a component needs memory that survives, and a way to tell React "something changed, please redraw".',
          'You might think a normal variable would do: let count = 0; and count = count + 1 on click. It does not work. The variable changes, but React does not know, so the screen stays the same. And every time React redraws the component, the function runs again from the top, and let count = 0 resets it.',
          'React\'s answer is state. State is data that React stores for your component between redraws. When you change it through React, React redraws the component with the new value automatically.'
        ],
        example: 'Writing a number on a whiteboard in an empty room changes nothing for anyone. Telling the class teacher "the score changed" means the teacher updates the scoreboard everyone sees. State is telling React.',
        code: lines(
          'function Counter() {',
          '  let count = 0;',
          '  count = count + 1;',
          '  return `Count: ${count}`;',
          '}',
          '',
          'console.log(Counter());',
          'console.log(Counter());',
          'console.log(Counter());'
        ),
        output: lines('Count: 1', 'Count: 1', 'Count: 1'),
        codeNotes: [
          { line: 2, note: 'Every time the component runs, this resets to 0.' },
          { line: 7, note: 'Each call is like a redraw. The count never goes past 1: normal variables forget.' }
        ],
        tryIt: 'Move let count = 0; outside the function (above it) and run again. It counts now, but React components cannot rely on outside variables like this; state is the proper way.',
        check: {
          question: 'Why does a normal let variable not work for a click counter in React?',
          options: ['let is not allowed in React', 'It resets on every redraw and React does not know it changed', 'Numbers cannot change'],
          answer: 1,
          why: 'The component function runs again on each redraw, resetting the variable, and changing it does not tell React to redraw.'
        }
      },
      {
        title: 'useState: value and setter',
        say: [
          'To use state, import useState from React and call it at the top of your component: const [count, setCount] = useState(0);. This is the array destructuring from Day 6.',
          'useState gives back two things. count is the current value. setCount is a function to change it. The 0 you pass in is the starting value, used only the very first time.',
          'To change the value, call the setter: setCount(count + 1). React stores the new value and redraws the component. On the redraw, useState gives back the new value, so count is now 1.',
          'The names are your choice, but the convention is always [something, setSomething]: [jobs, setJobs], [isOpen, setIsOpen], [name, setName]. Following it makes your code instantly readable to other developers.'
        ],
        example: 'State is like a locker with a key. React keeps the locker (the value). useState gives you the current contents and the only key that can change them (the setter).',
        projectCode: {
          label: 'src/components/Counter.jsx',
          code: lines(
            'import { useState } from "react";',
            '',
            'export default function Counter() {',
            '  const [count, setCount] = useState(0);',
            '  return (',
            '    <div>',
            '      <p>Jobs applied today: {count}</p>',
            '      <button onClick={() => setCount(count + 1)}>+1</button>',
            '    </div>',
            '  );',
            '}'
          )
        },
        code: lines(
          'let stored = 0;',
          'function useStateDemo() {',
          '  const setValue = (next) => { stored = next; render(); };',
          '  return [stored, setValue];',
          '}',
          '',
          'function render() {',
          '  const [count, setCount] = useStateDemo();',
          '  console.log(`Screen shows: ${count}`);',
          '  return setCount;',
          '}',
          '',
          'const setCount = render();',
          'setCount(1);',
          'setCount(2);'
        ),
        output: lines('Screen shows: 0', 'Screen shows: 1', 'Screen shows: 2'),
        codeNotes: [
          { line: 1, note: 'React keeps the value somewhere safe, outside your component.' },
          { line: 3, note: 'The setter saves the new value and redraws.' },
          { line: 14, note: 'Each setter call redraws the "screen" with the new value.' }
        ],
        tryIt: 'In your project, create Counter.jsx from the React code, use <Counter /> in App, and click the button a few times.',
        check: {
          question: 'In const [open, setOpen] = useState(false), what is false?',
          options: ['The value forever', 'The starting value', 'The setter'],
          answer: 1,
          why: 'The argument to useState is only the starting value. After that, the setter changes it.'
        }
      },
      {
        title: 'Never change state directly',
        say: [
          'The golden rule of state: never change it directly. count = 5 or jobs.push(newJob) will not redraw the screen, and can cause strange bugs later. Always use the setter.',
          'For arrays and objects, this means giving the setter a new copy, exactly the Day 6 spread patterns. To add a job: setJobs([...jobs, newJob]). To change a field: setJob({ ...job, status: "offer" }).',
          'Why a new copy? React checks whether the new value is a different array or object from the old one. If you push into the same array and pass it back, React sees the same array and may decide nothing changed. A new copy makes the change obvious.',
          'This is why you practised spread so carefully. It is not style; it is how React knows what changed.'
        ],
        example: 'A bank notices you updated your address only when you submit a new form. Scribbling on your old passbook at home changes nothing in the bank\'s records.',
        code: lines(
          'const jobs = ["Dev"];',
          '',
          'const sameArray = jobs;',
          'sameArray.push("Tester");',
          'console.log(sameArray === jobs);',
          '',
          'const newArray = [...jobs, "Designer"];',
          'console.log(newArray === jobs);',
          'console.log(newArray);'
        ),
        output: lines('true', 'false', '[ \'Dev\', \'Tester\', \'Designer\' ]'),
        codeNotes: [
          { line: 5, note: 'After push it is still the same array. React would think nothing changed.' },
          { line: 8, note: 'A new array: React sees clearly that something changed.' }
        ],
        tryIt: 'Write the object version: const job = { status: "applied" }; const updated = { ...job, status: "offer" }; and print updated === job.',
        check: {
          question: 'How do you add newJob to the jobs state?',
          options: ['jobs.push(newJob)', 'setJobs([...jobs, newJob])', 'jobs = [...jobs, newJob]'],
          answer: 1,
          why: 'Always use the setter with a new array. push and direct assignment do not tell React.'
        }
      },
      {
        title: 'Updating from the previous value',
        say: [
          'There is one subtle case. When the new value depends on the old one, like a counter, React recommends passing a function to the setter: setCount(c => c + 1).',
          'Why? React does not always update state immediately; it may group several updates together for speed. If you call setCount(count + 1) three times in one click, all three use the same old count, and you get +1 instead of +3. With setCount(c => c + 1), each call receives the latest value, so you get +3.',
          'You do not need this every time, but it is a safe habit whenever the new value is calculated from the old one: counters, toggles like setOpen(o => !o), and adding to lists like setJobs(prev => [...prev, newJob]).',
          'The runnable box shows the difference with a small fake of how React groups updates.'
        ],
        example: 'Three people each told "the count is 5, add one" all write 6. Three people passing a notebook, each adding one to whatever the last person wrote, end at 8. The function form is passing the notebook.',
        code: lines(
          'function runUpdates(start, updates) {',
          '  let value = start;',
          '  for (const u of updates) {',
          '    value = typeof u === "function" ? u(value) : u;',
          '  }',
          '  return value;',
          '}',
          '',
          'const count = 5;',
          'console.log(runUpdates(count, [count + 1, count + 1, count + 1]));',
          'console.log(runUpdates(count, [c => c + 1, c => c + 1, c => c + 1]));'
        ),
        output: lines('6', '8'),
        codeNotes: [
          { line: 4, note: 'Like React: a function gets the latest value; a plain value just replaces it.' },
          { line: 10, note: 'Three times count + 1 with the old count: only 6.' },
          { line: 11, note: 'Three updater functions: each builds on the last, giving 8.' }
        ],
        tryIt: 'Add a fourth updater c => c * 2 to the second list. What do you get?',
        check: {
          question: 'Which is the safe way to add 1 based on the previous value?',
          options: ['setCount(count + 1)', 'setCount(c => c + 1)', 'count++'],
          answer: 1,
          why: 'The function form always receives the latest value, even when React groups several updates.'
        }
      },
      {
        title: 'What happens when state changes',
        say: [
          'Let us be clear about what happens, because interviewers love this question. When you call a setter, React stores the new value and schedules a redraw, called a re-render, of that component.',
          'During the re-render, React calls your component function again from the top. useState now gives back the new value. Your JSX is calculated again with it. React compares the new result with the old one and changes only the parts of the real page that differ.',
          'Child components re-render too, because they may depend on the changed value through props. That is how one setJobs call in App updates the Summary, the JobList and every JobCard at once.',
          'Important: the value does not change inside the current run. If you write setCount(5); console.log(count); the log still shows the old value. The new value appears in the next run of the component.'
        ],
        example: 'When a cricket score changes, the whole scoreboard is recalculated, but the electrician only replaces the digits that actually changed. React is that careful electrician.',
        code: lines(
          'let renders = 0;',
          'let stateValue = "applied";',
          '',
          'function JobCard() {',
          '  renders = renders + 1;',
          '  return `Render ${renders}: status is ${stateValue}`;',
          '}',
          '',
          'console.log(JobCard());',
          'stateValue = "interview";',
          'console.log(JobCard());'
        ),
        output: lines('Render 1: status is applied', 'Render 2: status is interview'),
        codeNotes: [
          { line: 4, note: 'The component is just a function that runs again on every render.' },
          { line: 10, note: 'In React, a setter call does this and triggers the next render for you.' }
        ],
        tryIt: 'Add a third render after changing stateValue to "offer".',
        check: {
          question: 'After setCount(5), when does count become 5?',
          options: ['Immediately on the next line', 'In the next render of the component', 'Never'],
          answer: 1,
          why: 'The setter schedules a re-render; the new value is available when the component runs again.'
        }
      },
      {
        title: 'Put the jobs into state',
        say: [
          'Now the Job Tracker. Move the jobs array into state in App: const [jobs, setJobs] = useState(initialJobs);. Keep your sample jobs in a constant called initialJobs above the component, used only as the starting value.',
          'Add a button "Add sample job" that calls setJobs(prev => [...prev, { id: Date.now(), title: "New Job", company: "Somewhere", status: "applied" }]). Date.now() gives the current time in milliseconds, a quick way to get a unique id.',
          'Click it and watch: a new card appears, and the Summary total goes up by itself, because both read from the same state. You wrote no code to update the Summary. That is the magic of React.',
          'Tomorrow you will connect real buttons and typing, and on Day 14 you will replace the sample button with a real form.'
        ],
        example: 'A shared shopping list on the fridge: whoever adds an item, everyone looking at the list sees it. State in App is the list on the fridge, and every component reads from it.',
        projectCode: {
          label: 'src/App.jsx',
          code: lines(
            'import { useState } from "react";',
            'import Header from "./components/Header.jsx";',
            'import Summary from "./components/Summary.jsx";',
            'import JobList from "./components/JobList.jsx";',
            '',
            'const initialJobs = [ /* your jobs */ ];',
            '',
            'export default function App() {',
            '  const [jobs, setJobs] = useState(initialJobs);',
            '',
            '  function addSample() {',
            '    const job = { id: Date.now(), title: "New Job", company: "Somewhere", status: "applied" };',
            '    setJobs(prev => [...prev, job]);',
            '  }',
            '',
            '  return (',
            '    <div>',
            '      <Header />',
            '      <Summary total={jobs.length} />',
            '      <button onClick={addSample}>Add sample job</button>',
            '      <JobList jobs={jobs} />',
            '    </div>',
            '  );',
            '}'
          )
        },
        tryIt: 'Make this change in your project and click the button three times. Check that the total and the list both update.',
        check: {
          question: 'Why does Summary update when you add a job, without extra code?',
          options: ['Summary checks every second', 'App re-renders with new state and passes the new total down as a prop', 'The browser refreshes'],
          answer: 1,
          why: 'setJobs re-renders App, which passes the new jobs.length to Summary as a prop, so Summary re-renders too.'
        }
      }
    ],
    summary: [
      'Normal variables reset on every render and do not tell React about changes.',
      'const [value, setValue] = useState(start) gives a remembered value and a setter.',
      'Never change state directly; give the setter a new copy: setJobs([...jobs, job]).',
      'Use the function form when the new value depends on the old: setCount(c => c + 1).',
      'A setter call re-renders the component and its children with the new value.'
    ],
    projectStep: {
      title: 'Jobs in state',
      steps: [
        'Move jobs into useState in App, starting from initialJobs.',
        'Add an "Add sample job" button that adds a job with setJobs(prev => [...prev, job]).',
        'Check that Summary and JobList update together.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 13,
    title: 'Handling Clicks and Typing',
    goal: 'You can respond to clicks, typing and key presses, pass the right function to an event, and use the event object.',
    minutes: 30,
    recap: 'Yesterday you gave components memory with useState and saw the screen update when state changes.',
    parts: [
      {
        title: 'What events are',
        say: [
          'An event is something the user does: a click, typing a letter, pressing Enter, moving the mouse, submitting a form. Your app reacts to events by running a function you choose. That function is called an event handler.',
          'In React, you attach a handler with a prop that starts with on: onClick, onChange, onSubmit, onKeyDown. The value is the function to run: <button onClick={handleClick}>.',
          'Most handlers do one thing: update state. The click changes state, the state change re-renders the screen. Event, then state, then screen. Remember that chain; it is how every interactive React feature works.'
        ],
        example: 'A doorbell is an event. You wire it to a bell (the handler). When someone presses it, the bell rings. You decide in advance what happens; the visitor decides when.',
        code: lines(
          'const handlers = {};',
          'function on(eventName, fn) { handlers[eventName] = fn; }',
          'function userDoes(eventName) { handlers[eventName](); }',
          '',
          'let likes = 0;',
          'on("click", () => {',
          '  likes = likes + 1;',
          '  console.log(`Likes: ${likes}`);',
          '});',
          '',
          'userDoes("click");',
          'userDoes("click");'
        ),
        output: lines('Likes: 1', 'Likes: 2'),
        codeNotes: [
          { line: 6, note: 'We decide in advance what should happen on a click.' },
          { line: 11, note: 'The user clicks: our function runs.' }
        ],
        tryIt: 'Add a "reset" handler that sets likes to 0 and prints it, then call userDoes("reset").',
        check: {
          question: 'What is an event handler?',
          options: ['A function that runs when the user does something', 'A CSS rule', 'A type of state'],
          answer: 0,
          why: 'A handler is the function you give React to run when an event like a click happens.'
        }
      },
      {
        title: 'onClick: pass the function, do not call it',
        say: [
          'The most common beginner bug with events: writing onClick={handleClick()} with brackets. The brackets call the function immediately, while the page is being drawn, not when the user clicks. If it changes state, you can even get an endless loop of redraws.',
          'The right way is onClick={handleClick}, without brackets: you hand React the function itself, and React calls it later, on the click.',
          'What if you need to pass a value, like which job to delete? Wrap it in an arrow function: onClick={() => deleteJob(job.id)}. The arrow function is created now but runs only on click, and then it calls deleteJob with the id.',
          'So: no value needed, write the name. Value needed, write an arrow function around the call.'
        ],
        example: 'Giving someone your phone number (the function) so they can call later, versus calling them right now (handleClick()). onClick needs the number, not a call.',
        code: lines(
          'function sayHi() {',
          '  console.log("Hi!");',
          '  return "done";',
          '}',
          '',
          'const good = sayHi;',
          'console.log(typeof good);',
          '',
          'const bad = sayHi();',
          'console.log(typeof bad);'
        ),
        output: lines('function', 'Hi!', 'string'),
        codeNotes: [
          { line: 6, note: 'Without brackets: we keep the function itself to call later. Nothing runs yet.' },
          { line: 9, note: 'With brackets: it runs right now ("Hi!" appears) and we keep only its result.' }
        ],
        projectCode: {
          label: 'Right and wrong',
          code: lines(
            '<button onClick={addSample}>Add</button>                  // right',
            '<button onClick={addSample()}>Add</button>                // wrong: runs while drawing',
            '<button onClick={() => deleteJob(job.id)}>Delete</button> // right, with a value'
          )
        },
        tryIt: 'Notice "Hi!" printed before "string". That is the wrong version running immediately. Remove line 9 and 10 and check that nothing prints "Hi!" now.',
        check: {
          question: 'How do you call removeJob(5) when a button is clicked?',
          options: ['onClick={removeJob(5)}', 'onClick={() => removeJob(5)}', 'onClick="removeJob(5)"'],
          answer: 1,
          why: 'The arrow function runs only on click, and then calls removeJob with 5.'
        }
      },
      {
        title: 'The event object',
        say: [
          'When React calls your handler, it passes one argument: the event object, usually named e. It holds details about what happened.',
          'The most used parts: e.target is the element the event happened on, so e.target.value is what is typed in an input. e.key is the key pressed, like "Enter" or "a". e.preventDefault() stops the browser\'s default action, such as reloading the page when a form is submitted.',
          'You do not have to use the event object if you do not need it. But for typing and forms, you always will.',
          'Today\'s first practice task, isEnterKey(event), checks event.key, exactly as a real key handler does.'
        ],
        example: 'A courier delivery comes with a slip: who sent it, when, and what is inside. The event object is that slip for every user action.',
        code: lines(
          'function handleKeyDown(e) {',
          '  if (e.key === "Enter") {',
          '    console.log(`Search for: ${e.target.value}`);',
          '  } else {',
          '    console.log(`Typed: ${e.key}`);',
          '  }',
          '}',
          '',
          'handleKeyDown({ key: "r", target: { value: "r" } });',
          'handleKeyDown({ key: "Enter", target: { value: "react" } });'
        ),
        output: lines('Typed: r', 'Search for: react'),
        codeNotes: [
          { line: 2, note: 'e.key tells you which key was pressed.' },
          { line: 3, note: 'e.target.value is the current text in the input.' },
          { line: 9, note: 'Here we build fake event objects; in React the browser provides them.' }
        ],
        tryIt: 'Add a case: if e.key is "Escape", print "Cleared".',
        check: {
          question: 'How do you read what the user typed in an input from its onChange event?',
          options: ['e.key', 'e.target.value', 'e.value.target'],
          answer: 1,
          why: 'e.target is the input element, and its value is the current text.'
        }
      },
      {
        title: 'onChange: reacting to typing',
        say: [
          'To react to typing, use onChange on an input. It fires on every letter typed or deleted. Usually you store the text in state: onChange={e => setSearch(e.target.value)}.',
          'Now search always holds what is in the box, and you can use it anywhere: to filter the job list, show a character count, or enable a button only when something is typed.',
          'Let us add a search box to the Job Tracker. Keep search in state in App, filter the jobs by title with it, and pass the filtered list to JobList. The list updates as the user types. This is your Day 5 filter, now live.',
          'Tomorrow you will learn the full pattern for inputs, called controlled inputs, and use it for a whole form.'
        ],
        example: 'Swiggy\'s search box shows matching dishes as you type each letter. Every letter is an onChange event that updates the search and the results.',
        code: lines(
          'const jobs = [{ title: "React Developer" }, { title: "Java Developer" }, { title: "Tester" }];',
          'let search = "";',
          '',
          'function onChange(e) {',
          '  search = e.target.value;',
          '  const shown = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));',
          '  console.log(`"${search}" -> ${shown.length} jobs`);',
          '}',
          '',
          'onChange({ target: { value: "d" } });',
          'onChange({ target: { value: "de" } });',
          'onChange({ target: { value: "dev" } });'
        ),
        output: lines('"d" -> 2 jobs', '"de" -> 2 jobs', '"dev" -> 2 jobs'),
        codeNotes: [
          { line: 5, note: 'In React: setSearch(e.target.value).' },
          { line: 6, note: 'Filter by the latest search text, ignoring capital letters.' }
        ],
        projectCode: {
          label: 'In App.jsx',
          code: lines(
            'const [search, setSearch] = useState("");',
            'const shownJobs = jobs.filter(job =>',
            '  job.title.toLowerCase().includes(search.toLowerCase())',
            ');',
            '',
            '// in the JSX:',
            '<input placeholder="Search jobs" value={search} onChange={e => setSearch(e.target.value)} />',
            '<JobList jobs={shownJobs} />'
          )
        },
        tryIt: 'Add a fourth onChange call with "react". How many jobs match?',
        check: {
          question: 'When does onChange run for a text input?',
          options: ['Only when the user presses Enter', 'On every change to the text', 'Once when the page loads'],
          answer: 1,
          why: 'onChange fires on every letter typed or deleted.'
        }
      },
      {
        title: 'Handlers that update objects',
        say: [
          'Many clicks update one item, not a simple number. A like button flips liked and changes the like count at the same time. You update both in one new object with spread.',
          'Write the logic as a small function that takes the old item and returns the new one. Then the handler is just: setPost(p => clickLike(p)). Keeping the logic in a separate, plain function makes it easy to test, which is exactly what today\'s second practice task does.',
          'This split, plain logic functions plus thin handlers, is how good React code is written in companies. Components stay short, and the logic can be tested without any screen at all.'
        ],
        example: 'A restaurant writes its recipes in a book (logic functions). The waiter just takes the order and passes it to the kitchen (handler). The recipe can be checked without any customers.',
        code: lines(
          'function clickLike(post) {',
          '  return post.liked',
          '    ? { ...post, liked: false, likes: post.likes - 1 }',
          '    : { ...post, liked: true, likes: post.likes + 1 };',
          '}',
          '',
          'let post = { liked: false, likes: 10 };',
          'post = clickLike(post);',
          'console.log(post);',
          'post = clickLike(post);',
          'console.log(post);'
        ),
        output: lines('{ liked: true, likes: 11 }', '{ liked: false, likes: 10 }'),
        codeNotes: [
          { line: 2, note: 'Already liked? Unlike and subtract one. Otherwise like and add one.' },
          { line: 8, note: 'In React: setPost(p => clickLike(p)).' }
        ],
        tryIt: 'Add a third clickLike call and print the result. It should be liked again with 11.',
        check: {
          question: 'Why put the like logic in a separate plain function?',
          options: ['React requires it', 'It keeps components short and the logic easy to test', 'It runs faster'],
          answer: 1,
          why: 'Plain functions can be tested on their own, and the component just calls them.'
        }
      },
      {
        title: 'Status buttons in the Job Tracker',
        say: [
          'Let us make each job card interactive. Each JobCard gets a "Next stage" button that moves a job from applied to interview to offer.',
          'But JobCard does not own the jobs state; App does. So App writes a function moveToNext(id) and passes it down as a prop: <JobList jobs={shownJobs} onNext={moveToNext} />, and JobList passes it to each JobCard. The card calls onNext(id) on click. This is how a child tells a parent something happened, as promised on Day 9.',
          'Inside moveToNext, App uses map to change only the matching job: setJobs(prev => prev.map(job => job.id === id ? { ...job, status: next(job.status) } : job)). You will study this pattern properly on Day 15.',
          'After today, your Job Tracker has search, an add button and status buttons. It is a real interactive app.'
        ],
        example: 'In a hospital, a nurse notices a patient needs attention and presses the call button. The nurse does not change the doctor\'s schedule; the call tells the doctor, who decides. The child calls onNext, and the parent updates state.',
        code: lines(
          'const order = ["applied", "interview", "offer"];',
          'function nextStatus(status) {',
          '  const i = order.indexOf(status);',
          '  return i >= 0 && i < order.length - 1 ? order[i + 1] : status;',
          '}',
          '',
          'let jobs = [{ id: 1, status: "applied" }, { id: 2, status: "interview" }];',
          'function moveToNext(id) {',
          '  jobs = jobs.map(job => job.id === id ? { ...job, status: nextStatus(job.status) } : job);',
          '}',
          '',
          'moveToNext(2);',
          'console.log(jobs);'
        ),
        output: '[ { id: 1, status: \'applied\' }, { id: 2, status: \'offer\' } ]',
        codeNotes: [
          { line: 4, note: 'Move one step forward, but stay at the last stage.' },
          { line: 9, note: 'Only the job with the matching id changes. In React: setJobs(prev => prev.map(...)).' }
        ],
        tryIt: 'Call moveToNext(1) twice and print jobs. Job 1 should reach "offer".',
        check: {
          question: 'How does a JobCard tell App that its button was clicked?',
          options: ['It changes the jobs array directly', 'It calls a function App passed down as a prop', 'It reloads the page'],
          answer: 1,
          why: 'App passes a function like onNext as a prop; the child calls it, and App updates state.'
        }
      }
    ],
    summary: [
      'Events are user actions; handlers are the functions that respond, usually by updating state.',
      'Pass the function: onClick={handleClick}. Need a value? onClick={() => remove(id)}.',
      'The event object e has e.target.value for inputs and e.key for key presses.',
      'onChange fires on every change; keep the text in state.',
      'Children tell parents about events by calling functions passed as props.'
    ],
    projectStep: {
      title: 'Search and status buttons',
      steps: [
        'Add a search input in App that filters jobs by title as you type.',
        'Add a "Next stage" button to JobCard that calls onNext(id).',
        'Write moveToNext in App and pass it down through JobList.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 14,
    title: 'Forms: Getting Input From the User',
    goal: 'You can build a form with controlled inputs, keep all fields in one state object, check the input, show errors and add a new job.',
    minutes: 32,
    recap: 'Yesterday you handled clicks and typing, added search and status buttons to the Job Tracker.',
    parts: [
      {
        title: 'Why forms matter',
        say: [
          'Almost every app collects information through forms: sign up, log in, add to cart, post a comment, apply for a job. Forms are also one of the most common tasks given to junior developers, so doing them well matters.',
          'A good form does four things. It shows the current values, it updates as the user types, it checks the values and shows clear errors, and on submit it saves the data and resets.',
          'Today you build the Add Job form for your Job Tracker, doing all four. It replaces yesterday\'s "Add sample job" button.'
        ],
        example: 'A bank account form with a friendly clerk: the clerk reads what you wrote, points out a missing signature before you leave, and only then accepts it. A good form is that clerk.',
        code: lines(
          'const form = { title: "", company: "" };',
          'console.log(form);',
          'const filled = { ...form, title: "React Developer" };',
          'console.log(filled);'
        ),
        output: lines('{ title: \'\', company: \'\' }', '{ title: \'React Developer\', company: \'\' }'),
        codeNotes: [
          { line: 1, note: 'A form\'s data is just an object: one property per field.' },
          { line: 3, note: 'Typing in a field makes an updated copy.' }
        ],
        tryIt: 'Add a status field to the form object with the value "applied".',
        check: {
          question: 'What should a good form do before saving?',
          options: ['Nothing, just save', 'Check the values and show clear errors', 'Reload the page'],
          answer: 1,
          why: 'Checking values first prevents bad data and tells the user exactly what to fix.'
        }
      },
      {
        title: 'Controlled inputs',
        say: [
          'In React, the usual way to handle an input is a controlled input. The input\'s value comes from state, and onChange updates that state: <input value={title} onChange={e => setTitle(e.target.value)} />.',
          'Why "controlled"? Because React state, not the browser, is in charge of what the box shows. So you always know exactly what the user typed, and you can also change it from code, for example to clear the box after saving.',
          'A common mistake: giving value without onChange. The box then refuses all typing, because React keeps setting it back to the state, which never changes. If an input will not let you type, check for a missing onChange.',
          'The runnable box shows the controlled loop: typing calls onChange, onChange updates state, and state decides what the input shows.'
        ],
        example: 'A digital thermostat: you press the button (onChange), the thermostat updates its setting (state), and the display shows the setting (value). The display never shows anything the thermostat does not know.',
        code: lines(
          'let title = "";',
          'function render() { console.log(`<input value="${title}" />`); }',
          'function onChange(e) { title = e.target.value; render(); }',
          '',
          'render();',
          'onChange({ target: { value: "R" } });',
          'onChange({ target: { value: "Re" } });'
        ),
        output: lines('<input value="" />', '<input value="R" />', '<input value="Re" />'),
        codeNotes: [
          { line: 2, note: 'The input always shows what is in state.' },
          { line: 3, note: 'Typing updates state, which redraws the input.' }
        ],
        projectCode: {
          label: 'A controlled input',
          code: lines(
            'const [title, setTitle] = useState("");',
            '',
            '<input',
            '  value={title}',
            '  onChange={e => setTitle(e.target.value)}',
            '  placeholder="Job title"',
            '/>'
          )
        },
        tryIt: 'Add one more onChange call for "Rea". Then think: what would happen if onChange did not update title?',
        check: {
          question: 'An input with value={name} but no onChange...',
          options: ['Works normally', 'Will not let the user type', 'Crashes the app'],
          answer: 1,
          why: 'React keeps setting the value back to state, which never changes, so typing has no effect.'
        }
      },
      {
        title: 'One state object for the whole form',
        say: [
          'A form with five fields could have five useState calls. It works, but it repeats a lot. A neater way is one state object: const [form, setForm] = useState({ title: "", company: "", status: "applied" });.',
          'Give every input a name attribute matching its property, and use one shared handler: function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }.',
          'The square brackets [e.target.name] are the Day 4 bracket access, used to create a property whose name comes from a variable. If the title input changes, it sets title; if the company input changes, it sets company. One handler for every field.',
          'This is today\'s second practice task, updateField, and it is a pattern you will write in almost every React job.'
        ],
        example: 'One reception desk handling every department by reading the name on each visitor\'s slip, instead of a separate desk for every department.',
        code: lines(
          'let form = { title: "", company: "", status: "applied" };',
          '',
          'function handleChange(e) {',
          '  form = { ...form, [e.target.name]: e.target.value };',
          '}',
          '',
          'handleChange({ target: { name: "title", value: "React Developer" } });',
          'handleChange({ target: { name: "company", value: "Zoho" } });',
          'console.log(form);'
        ),
        output: '{ title: \'React Developer\', company: \'Zoho\', status: \'applied\' }',
        codeNotes: [
          { line: 4, note: '[e.target.name] uses the input\'s name as the property to change.' },
          { line: 7, note: 'The title input sends name "title", so title changes.' }
        ],
        projectCode: {
          label: 'Inputs with name',
          code: lines(
            '<input name="title" value={form.title} onChange={handleChange} />',
            '<input name="company" value={form.company} onChange={handleChange} />',
            '<select name="status" value={form.status} onChange={handleChange}>',
            '  <option value="applied">Applied</option>',
            '  <option value="interview">Interview</option>',
            '</select>'
          )
        },
        tryIt: 'Add a third handleChange call that sets status to "interview", and print form.',
        check: {
          question: 'What does { ...form, [name]: value } do when name is "company"?',
          options: ['Adds a property literally called name', 'Copies the form and sets company to value', 'Deletes company'],
          answer: 1,
          why: 'The square brackets use the value of the name variable, "company", as the property name.'
        }
      },
      {
        title: 'Checking the form and showing errors',
        say: [
          'Before saving, check the input. Is the title empty? Is the company missing? Write a validate function that takes the form and returns a list of error messages. An empty list means everything is fine.',
          'Keep the errors in state, so you can show them under the form: errors.map(err => <p key={err}>{err}</p>). Use friendly, specific messages: "Company is required" is far better than "Invalid input".',
          'Also trim spaces: a title of "   " is really empty. form.title.trim() removes spaces at both ends, so a user cannot sneak past with only spaces.',
          'Today\'s first practice task is exactly this validate function. Checking in plain JavaScript first, then using it in the component, is the same split you learned yesterday.'
        ],
        example: 'An exam invigilator checking your answer sheet before you leave: "You forgot your roll number." Specific, polite, and before it is too late.',
        code: lines(
          'function validateJobForm(form) {',
          '  const errors = [];',
          '  if (!form.title.trim()) errors.push("Title is required");',
          '  if (!form.company.trim()) errors.push("Company is required");',
          '  return errors;',
          '}',
          '',
          'console.log(validateJobForm({ title: "  ", company: "" }));',
          'console.log(validateJobForm({ title: "Dev", company: "TCS" }));'
        ),
        output: lines('[ \'Title is required\', \'Company is required\' ]', '[]'),
        codeNotes: [
          { line: 3, note: '.trim() removes spaces, so "  " counts as empty.' },
          { line: 9, note: 'A full form gives an empty list: no errors.' }
        ],
        tryIt: 'Add a rule: if the title is shorter than 3 letters, push "Title is too short".',
        check: {
          question: 'Why use .trim() when checking a required field?',
          options: ['To make the text shorter', 'So a value of only spaces counts as empty', 'It is required by React'],
          answer: 1,
          why: 'Spaces alone are not a real title. trim() removes them before checking.'
        }
      },
      {
        title: 'Submitting the form',
        say: [
          'Wrap the inputs in a <form> with onSubmit={handleSubmit}, and give it a submit button. Pressing Enter in a field or clicking the button then submits.',
          'The first line of handleSubmit must be e.preventDefault(). Without it, the browser does its old default behaviour: it reloads the whole page, and your app loses its state. This is one of the most common React bugs.',
          'Then: validate. If there are errors, save them in state and stop. If not, build the new job, add it with setJobs(prev => [...prev, job]), clear the errors, and reset the form to its empty starting values.',
          'Resetting is easy because the inputs are controlled: setForm(emptyForm) empties every box at once.'
        ],
        example: 'Posting a letter: first check the address (validate), then drop it in the box (save), then take a fresh sheet for the next letter (reset).',
        code: lines(
          'const emptyForm = { title: "", company: "" };',
          'let form = { title: " React Dev ", company: "Zoho" };',
          'let jobs = [];',
          'let prevented = false;',
          '',
          'function handleSubmit(e) {',
          '  e.preventDefault();',
          '  const job = { id: jobs.length + 1, title: form.title.trim(), company: form.company.trim(), status: "applied" };',
          '  jobs = [...jobs, job];',
          '  form = emptyForm;',
          '}',
          '',
          'handleSubmit({ preventDefault() { prevented = true; } });',
          'console.log(prevented);',
          'console.log(jobs);',
          'console.log(form);'
        ),
        output: lines('true', '[ { id: 1, title: \'React Dev\', company: \'Zoho\', status: \'applied\' } ]', '{ title: \'\', company: \'\' }'),
        codeNotes: [
          { line: 7, note: 'Always first: stop the browser from reloading the page.' },
          { line: 8, note: 'Build the new job from the form, trimming spaces.' },
          { line: 10, note: 'Reset the form so the boxes are empty again.' }
        ],
        tryIt: 'Add a validation step inside handleSubmit: if form.title.trim() is empty, print "Title is required" and return before adding.',
        check: {
          question: 'What happens if you forget e.preventDefault() in onSubmit?',
          options: ['Nothing', 'The page reloads and the app loses its state', 'The form submits twice'],
          answer: 1,
          why: 'The browser\'s default submit reloads the page, wiping everything React was holding.'
        }
      },
      {
        title: 'Build the Add Job form',
        say: [
          'Put it all together in a JobForm component. It keeps its own form state and errors. When the form is valid, it calls onAdd(job), a function App passes as a prop, and App adds the job to its state.',
          'Notice the split: JobForm knows about typing and errors, App knows about the list. Each component has one job, and they talk through props.',
          'Delete the "Add sample job" button from Day 12. Now users add real jobs with a real form, see clear errors, and the form empties after each save.',
          'This form is worth showing in interviews: controlled inputs, one state object, validation and a clean submit are exactly what interviewers look for.'
        ],
        example: 'The form at a clinic\'s reception: the receptionist makes sure it is complete, then hands it to the doctor\'s list. The receptionist is JobForm, the doctor\'s list is App.',
        projectCode: {
          label: 'src/components/JobForm.jsx',
          code: lines(
            'import { useState } from "react";',
            '',
            'const emptyForm = { title: "", company: "", status: "applied" };',
            '',
            'export default function JobForm({ onAdd }) {',
            '  const [form, setForm] = useState(emptyForm);',
            '  const [errors, setErrors] = useState([]);',
            '',
            '  function handleChange(e) {',
            '    setForm({ ...form, [e.target.name]: e.target.value });',
            '  }',
            '',
            '  function handleSubmit(e) {',
            '    e.preventDefault();',
            '    const found = [];',
            '    if (!form.title.trim()) found.push("Title is required");',
            '    if (!form.company.trim()) found.push("Company is required");',
            '    setErrors(found);',
            '    if (found.length > 0) return;',
            '    onAdd({ ...form, id: Date.now(), title: form.title.trim(), company: form.company.trim() });',
            '    setForm(emptyForm);',
            '  }',
            '',
            '  return (',
            '    <form onSubmit={handleSubmit}>',
            '      <input name="title" placeholder="Job title" value={form.title} onChange={handleChange} />',
            '      <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />',
            '      <button type="submit">Add job</button>',
            '      {errors.map(err => <p key={err} className="error">{err}</p>)}',
            '    </form>',
            '  );',
            '}',
            '',
            '// In App.jsx:  <JobForm onAdd={job => setJobs(prev => [...prev, job])} />'
          )
        },
        tryIt: 'Build JobForm in your project. Try submitting empty, then with only a title, then with both fields.',
        check: {
          question: 'How does JobForm get the new job into App\'s list?',
          options: ['It changes App\'s jobs array directly', 'It calls the onAdd function App passed as a prop', 'It saves to a file'],
          answer: 1,
          why: 'App owns the jobs state and passes onAdd. JobForm calls it with the new job.'
        }
      }
    ],
    summary: [
      'Controlled inputs: value from state, onChange updates state.',
      'One form object with a shared handler: { ...form, [e.target.name]: e.target.value }.',
      'Validate with trim() and show specific, friendly error messages.',
      'onSubmit must call e.preventDefault() first; then validate, save and reset.',
      'The form calls a parent function (onAdd) to add to the parent\'s state.'
    ],
    projectStep: {
      title: 'The Add Job form',
      steps: [
        'Create JobForm with title, company and status fields.',
        'Show errors for empty title or company.',
        'Add valid jobs through onAdd, reset the form, and remove the old sample button.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 15,
    title: 'Sharing Data Between Components',
    goal: 'You can decide where state should live, pass data down and actions up, and add, remove and change items in a list stored in state.',
    minutes: 30,
    recap: 'Yesterday you built the Add Job form with controlled inputs, validation and a clean submit.',
    parts: [
      {
        title: 'Where should state live?',
        say: [
          'As your app grows, the most important question becomes: which component should own each piece of state? The rule is simple. Put state in the closest common parent of every component that needs it.',
          'Your jobs are needed by Summary (to count), JobList (to show) and JobForm (to add). Their closest common parent is App, so App owns jobs. The search text is needed by App to filter, so it lives in App too. But the form\'s typing state is needed only by JobForm, so it stays inside JobForm.',
          'Keeping state as low as possible, but high enough to be shared, keeps components simple. This decision is called "lifting state up" when you move state from a child to a parent so it can be shared.'
        ],
        example: 'A family keeps the house key with a parent, not with one child, because everyone needs it. But each child keeps their own school bag. Shared things live higher up; personal things stay with each person.',
        code: lines(
          'const needs = {',
          '  jobs: ["Summary", "JobList", "JobForm"],',
          '  formText: ["JobForm"]',
          '};',
          '',
          'for (const [stateName, users] of Object.entries(needs)) {',
          '  const owner = users.length > 1 ? "App (shared parent)" : users[0];',
          '  console.log(`${stateName} lives in ${owner}`);',
          '}'
        ),
        output: lines('jobs lives in App (shared parent)', 'formText lives in JobForm'),
        codeNotes: [
          { line: 6, note: 'Object.entries gives [name, value] pairs, destructured into two variables.' },
          { line: 7, note: 'Used by several components: lift to the parent. Used by one: keep it there.' }
        ],
        tryIt: 'Add a "theme" entry used by ["Header", "JobCard"] and run it.',
        check: {
          question: 'Summary and JobList both need the jobs. Where should jobs state live?',
          options: ['In Summary', 'In JobList', 'In their shared parent, App'],
          answer: 2,
          why: 'Shared state lives in the closest common parent, which then passes it down as props.'
        }
      },
      {
        title: 'Data down, actions up',
        say: [
          'Once state lives in the parent, the pattern is always the same: data goes down as props, and actions come up as function calls. App passes jobs down to JobList, and passes functions like onDelete and onNext down too. When the user clicks, the child calls the function, and App updates its state.',
          'Name these function props with on at the start: onDelete, onAdd, onStatusChange. It matches React\'s own onClick and makes it obvious that the prop is something that happens, not data.',
          'If a function has to travel through several layers, like App to JobList to JobCard, each layer just passes it along. That is fine for a few layers. For data needed almost everywhere, Day 21 teaches Context.'
        ],
        example: 'In a school, notices come down from the principal to classes, and requests go up from students through the class teacher to the principal. Information down, requests up.',
        projectCode: {
          label: 'Passing actions down',
          code: lines(
            '// App.jsx',
            '<JobList jobs={shownJobs} onDelete={deleteJob} onNext={moveToNext} />',
            '',
            '// JobList.jsx',
            '{jobs.map(job => (',
            '  <JobCard key={job.id} {...job} onDelete={onDelete} onNext={onNext} />',
            '))}',
            '',
            '// JobCard.jsx',
            '<button onClick={() => onDelete(id)}>Delete</button>'
          )
        },
        code: lines(
          'function App() {',
          '  let jobs = [{ id: 1, title: "Dev" }, { id: 2, title: "Tester" }];',
          '  const onDelete = (id) => { jobs = jobs.filter(j => j.id !== id); console.log(`App now has ${jobs.length} job(s)`); };',
          '  JobCard({ job: jobs[0], onDelete });',
          '}',
          '',
          'function JobCard({ job, onDelete }) {',
          '  console.log(`Card for ${job.title}: delete clicked`);',
          '  onDelete(job.id);',
          '}',
          '',
          'App();'
        ),
        output: lines('Card for Dev: delete clicked', 'App now has 1 job(s)'),
        codeNotes: [
          { line: 4, note: 'Data (job) and an action (onDelete) go down to the card.' },
          { line: 9, note: 'The card calls the action; App changes its own data.' }
        ],
        tryIt: 'Change line 4 to pass jobs[1] instead, and run. Which job is deleted now?',
        check: {
          question: 'In "data down, actions up", what goes up?',
          options: ['State values', 'Calls to functions the parent passed down', 'CSS'],
          answer: 1,
          why: 'Children send actions up by calling functions from props; the parent then changes its state.'
        }
      },
      {
        title: 'Removing an item',
        say: [
          'To remove a job from state, keep every job except the one with that id: setJobs(prev => prev.filter(job => job.id !== id)). This is the filter pattern from Day 5, now used with state.',
          'filter always gives a new array, so React sees the change and re-renders. The card disappears, the Summary total goes down, and the search results update, all from one line.',
          'A kind touch for real apps: ask before deleting. The simplest way in the browser is if (!window.confirm("Delete this job?")) return;. Later you can build a nicer confirm box in your own design.'
        ],
        example: 'Removing one name from a guest list by writing a fresh list with everyone except that person. The old list is untouched; the new list is what you use.',
        code: lines(
          'function removeJob(jobs, id) {',
          '  return jobs.filter(job => job.id !== id);',
          '}',
          '',
          'const jobs = [{ id: 1 }, { id: 2 }, { id: 3 }];',
          'const after = removeJob(jobs, 2);',
          'console.log(after);',
          'console.log(jobs.length);'
        ),
        output: lines('[ { id: 1 }, { id: 3 } ]', '3'),
        codeNotes: [
          { line: 2, note: 'Keep every job whose id is not the one to remove.' },
          { line: 8, note: 'The original array still has 3 jobs; React gets the new one.' }
        ],
        tryIt: 'Remove id 9, which does not exist. What happens? (Nothing is removed and nothing breaks.)',
        check: {
          question: 'Which line removes the job with id 7 from state?',
          options: ['jobs.splice(7, 1)', 'setJobs(prev => prev.filter(job => job.id !== 7))', 'delete jobs[7]'],
          answer: 1,
          why: 'filter creates a new array without that job, and the setter tells React about it.'
        }
      },
      {
        title: 'Changing one item',
        say: [
          'To change one job, use map: go through every job, and for the one with the matching id, return an updated copy; for all the others, return them unchanged. setJobs(prev => prev.map(job => job.id === id ? { ...job, status } : job)).',
          'This single line is the most common state update in React apps. Marking a to-do done, changing a quantity in a cart, editing a profile field: all are this pattern.',
          'Read it slowly: for each job, if it is the one, make a copy with the new status; otherwise keep it as it is. The result is a new array, with a new object only for the changed job.',
          'Today\'s second practice task, changeJobStatus, is exactly this. Master it and you can update any list in React.'
        ],
        example: 'Updating one student\'s marks in a register by copying the register, changing only that row, and keeping every other row as it was.',
        code: lines(
          'function changeJobStatus(jobs, id, status) {',
          '  return jobs.map(job => job.id === id ? { ...job, status } : job);',
          '}',
          '',
          'const jobs = [{ id: 1, status: "applied" }, { id: 2, status: "applied" }];',
          'const after = changeJobStatus(jobs, 2, "interview");',
          'console.log(after);',
          'console.log(after[0] === jobs[0]);',
          'console.log(after[1] === jobs[1]);'
        ),
        output: lines('[ { id: 1, status: \'applied\' }, { id: 2, status: \'interview\' } ]', 'true', 'false'),
        codeNotes: [
          { line: 2, note: '{ ...job, status } is short for { ...job, status: status }.' },
          { line: 8, note: 'Unchanged jobs are the very same objects.' },
          { line: 9, note: 'Only the changed job is a new object.' }
        ],
        tryIt: 'Use changeJobStatus to set job 1 to "offer" and print the result.',
        check: {
          question: 'In the map update, what happens to jobs that do not match the id?',
          options: ['They are removed', 'They are returned unchanged', 'They get the new status too'],
          answer: 1,
          why: 'The ? : returns an updated copy for the matching job and the original job for all others.'
        }
      },
      {
        title: 'Derived data: calculate, do not store',
        say: [
          'A common mistake is storing things in state that can be calculated from other state. For example, keeping a separate totalJobs state and updating it whenever jobs changes. Sooner or later you forget to update it, and the screen shows a wrong number.',
          'Instead, calculate it during render: const total = jobs.length; const interviews = jobs.filter(j => j.status === "interview").length;. It is always correct because it is recalculated from the jobs on every render.',
          'The same applies to your search results: shownJobs is calculated from jobs and search, not stored. Keep state minimal: only what cannot be calculated from other state.',
          'Rule of thumb: if you can compute it from existing state or props, do not put it in state.'
        ],
        example: 'You do not write your age on your fridge and update it every birthday. You calculate it from your date of birth when needed, and it is never wrong.',
        code: lines(
          'function jobStats(jobs) {',
          '  return {',
          '    total: jobs.length,',
          '    interviews: jobs.filter(j => j.status === "interview").length,',
          '    offers: jobs.filter(j => j.status === "offer").length',
          '  };',
          '}',
          '',
          'const jobs = [{ status: "applied" }, { status: "interview" }, { status: "offer" }];',
          'console.log(jobStats(jobs));'
        ),
        output: '{ total: 3, interviews: 1, offers: 1 }',
        codeNotes: [
          { line: 1, note: 'All numbers are calculated from jobs, so they can never be out of date.' }
        ],
        tryIt: 'Add rejected to jobStats and a rejected job to the list.',
        check: {
          question: 'Should the number of offers be kept in its own state?',
          options: ['Yes, always', 'No, calculate it from jobs during render', 'Only on Mondays'],
          answer: 1,
          why: 'It can be calculated from jobs, so storing it separately only risks it becoming wrong.'
        }
      },
      {
        title: 'Finish the core Job Tracker',
        say: [
          'Let us complete the core of your app. App owns jobs and search. It defines three actions: addJob, deleteJob and changeStatus, each one line using the patterns from today. It calculates shownJobs and the stats during render.',
          'App passes onAdd to JobForm, the stats to Summary, and shownJobs, onDelete and onStatusChange to JobList, which passes them to each JobCard. Each JobCard gets a Delete button and a status dropdown.',
          'When you finish, you have a complete working app: add, search, change status, delete, and a live summary. This is real React, built the way companies build it.',
          'After this lesson there is your third short test, covering Days 11 to 15. Next week you will make the app save its data, load data from the internet and have multiple pages.'
        ],
        example: 'Like the manager of a small shop who keeps the stock register (state), while the counter staff (components) only report sales and returns (actions). The register is always correct because only the manager writes in it.',
        projectCode: {
          label: 'src/App.jsx (core)',
          code: lines(
            'const [jobs, setJobs] = useState(initialJobs);',
            'const [search, setSearch] = useState("");',
            '',
            'const addJob = job => setJobs(prev => [...prev, job]);',
            'const deleteJob = id => setJobs(prev => prev.filter(j => j.id !== id));',
            'const changeStatus = (id, status) =>',
            '  setJobs(prev => prev.map(j => (j.id === id ? { ...j, status } : j)));',
            '',
            'const shownJobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()));',
            'const stats = {',
            '  total: jobs.length,',
            '  interviews: jobs.filter(j => j.status === "interview").length,',
            '  offers: jobs.filter(j => j.status === "offer").length',
            '};',
            '',
            'return (',
            '  <div>',
            '    <Header />',
            '    <Summary {...stats} />',
            '    <JobForm onAdd={addJob} />',
            '    <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />',
            '    <JobList jobs={shownJobs} onDelete={deleteJob} onStatusChange={changeStatus} />',
            '  </div>',
            ');'
          )
        },
        tryIt: 'Build this in your project. Add 3 jobs, change one to "offer", delete one, and search. Check that the summary is always right.',
        check: {
          question: 'Why is stats calculated in App instead of stored in state?',
          options: ['State cannot hold objects', 'It can be computed from jobs, so it is always correct', 'It makes the app slower'],
          answer: 1,
          why: 'Derived values recalculated each render can never go out of date.'
        }
      }
    ],
    summary: [
      'Put state in the closest common parent of the components that need it.',
      'Data goes down as props; actions come up as calls to function props named onSomething.',
      'Remove: prev.filter(j => j.id !== id). Change: prev.map(j => j.id === id ? { ...j, ... } : j).',
      'Do not store what you can calculate; derive totals and filtered lists during render.'
    ],
    projectStep: {
      title: 'The complete core app',
      steps: [
        'In App, add deleteJob and changeStatus next to addJob.',
        'Give JobCard a Delete button and a status dropdown that call onDelete and onStatusChange.',
        'Calculate stats in App and pass them to Summary. Test add, search, change and delete together.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 16,
    title: 'useEffect: Doing Things After the Screen Shows',
    goal: 'You can run code after React draws the screen with useEffect, control when it runs with the dependency list, and clean up after it.',
    minutes: 30,
    recap: 'Yesterday you finished the core Job Tracker: add, search, change status and delete, with state in App.',
    parts: [
      {
        title: 'Side effects: work outside drawing the screen',
        say: [
          'A component\'s main job is to return what the screen should look like. It should do that and nothing else, like a pure calculation. But apps also need to do other things: load data from a server, save to the browser, start a timer, change the page title.',
          'These are called side effects, because they reach outside the component. If you do them directly inside the component body, they run on every single render, maybe hundreds of times, which can flood a server with requests or start endless timers.',
          'React gives you a special place for side effects: useEffect. Code inside useEffect runs after React has drawn the screen, and you decide how often it runs.'
        ],
        example: 'A chef\'s main job is cooking (drawing the screen). Ordering new vegetables from the market is a side job (a side effect). You do not want the chef to phone the market every time a plate goes out; you want it done at the right moments.',
        code: lines(
          'let requests = 0;',
          'function JobListBad() {',
          '  requests = requests + 1;',
          '  return `Rendered. Server requests so far: ${requests}`;',
          '}',
          '',
          'console.log(JobListBad());',
          'console.log(JobListBad());',
          'console.log(JobListBad());'
        ),
        output: lines('Rendered. Server requests so far: 1', 'Rendered. Server requests so far: 2', 'Rendered. Server requests so far: 3'),
        codeNotes: [
          { line: 3, note: 'Pretend this line asks a server for data. Doing it in the body repeats it on every render.' }
        ],
        tryIt: 'Imagine the user types 10 letters in the search box. How many server requests would this bad version make? (10 extra, one per re-render.)',
        check: {
          question: 'What is a side effect in React?',
          options: ['A CSS animation', 'Work that reaches outside the component, like loading data or timers', 'A type of prop'],
          answer: 1,
          why: 'Side effects talk to the outside world: servers, the browser, timers. They belong in useEffect.'
        }
      },
      {
        title: 'useEffect and the empty dependency list',
        say: [
          'You write useEffect(() => { ...your code... }, []);. The first argument is a function with the side effect. The second argument, the square brackets, is the dependency list: it tells React when to run the effect again.',
          'An empty list [] means: run once, right after the component first appears, and never again. This is what you use for loading data when a page opens.',
          'Like useState, useEffect is imported from React and called at the top of your component, never inside an if or a loop. React relies on the hooks being called in the same order on every render.',
          'The runnable box imitates how React treats an effect with an empty list: it runs after the first render only, however many times the component renders.'
        ],
        example: 'When you move into a new flat, you set up the Wi-Fi once, on the first day. You do not reinstall it every time you walk into a room. An effect with [] is that first-day setup.',
        code: lines(
          'let firstRenderDone = false;',
          'function useEffectOnce(effect) {',
          '  if (!firstRenderDone) { firstRenderDone = true; effect(); }',
          '}',
          '',
          'function JobList(render) {',
          '  useEffectOnce(() => console.log("Loading jobs from server..."));',
          '  console.log(`Render ${render}`);',
          '}',
          '',
          'JobList(1);',
          'JobList(2);',
          'JobList(3);'
        ),
        output: lines('Loading jobs from server...', 'Render 1', 'Render 2', 'Render 3'),
        codeNotes: [
          { line: 3, note: 'Our pretend useEffect with []: run the effect only the first time.' },
          { line: 7, note: 'In React: useEffect(() => { loadJobs(); }, []);' }
        ],
        projectCode: {
          label: 'Page title on first load',
          code: lines(
            'import { useEffect } from "react";',
            '',
            'export default function App() {',
            '  useEffect(() => {',
            '    document.title = "My Job Tracker";',
            '  }, []);',
            '  // ...',
            '}'
          )
        },
        tryIt: 'In your project, add the useEffect above to App and check the browser tab title.',
        check: {
          question: 'When does useEffect(() => {...}, []) run?',
          options: ['On every render', 'Once, after the first render', 'Never'],
          answer: 1,
          why: 'An empty dependency list means run once after the component first appears.'
        }
      },
      {
        title: 'Dependencies: running again when something changes',
        say: [
          'Often an effect must run again when some value changes. Put that value in the dependency list: useEffect(() => { ... }, [jobs]);. React runs the effect after the first render, and again after any render where jobs is different from last time.',
          'A great example for your Job Tracker: saving jobs to the browser whenever they change. The effect depends on jobs, so every add, delete or status change saves automatically.',
          'The rule: every value from the component that the effect uses should be in the list. If you forget one, the effect uses an old value and you get bugs that are hard to spot. VS Code with the React extension warns you about missing dependencies.',
          'And no list at all, useEffect(() => {...}), means run after every render. That is rarely what you want.'
        ],
        example: 'A phone backs up your photos whenever you take a new one. The backup depends on the photo list: no new photo, no backup. That is an effect with [photos].',
        code: lines(
          'let lastDeps = null;',
          'function useEffectDeps(effect, deps) {',
          '  const changed = !lastDeps || deps.some((d, i) => d !== lastDeps[i]);',
          '  lastDeps = deps;',
          '  if (changed) effect();',
          '}',
          '',
          'function App(search) {',
          '  useEffectDeps(() => console.log(`Searching for "${search}"`), [search]);',
          '}',
          '',
          'App("dev");',
          'App("dev");',
          'App("devops");'
        ),
        output: lines('Searching for "dev"', 'Searching for "devops"'),
        codeNotes: [
          { line: 3, note: 'Run only if a dependency differs from last time, like React does.' },
          { line: 13, note: 'Same search: the effect is skipped.' }
        ],
        tryIt: 'Add App("devops") again at the end. Does it search again? Why not?',
        check: {
          question: 'An effect uses the variable userId. What should the dependency list contain?',
          options: ['[]', '[userId]', 'Nothing'],
          answer: 1,
          why: 'Every value the effect uses must be listed, so it re-runs when userId changes.'
        }
      },
      {
        title: 'Clean-up: stopping what you started',
        say: [
          'Some effects start something that keeps going: a timer, a connection, a listener for window resizing. If the component disappears and nobody stops it, it keeps running in the background, wasting memory, and can even cause errors.',
          'To stop it, return a function from your effect. React calls that clean-up function when the component disappears, and also before running the effect again.',
          'For a timer: const id = setInterval(tick, 1000); return () => clearInterval(id);. Start in the effect, stop in the clean-up. Always pair them.',
          'Forgetting clean-up is a classic memory-leak bug, and a common interview question: "What does the function returned from useEffect do?". Now you know.'
        ],
        example: 'When you leave a room, you switch off the fan you switched on. The effect is switching on; the clean-up is switching off when you leave.',
        code: lines(
          'const running = new Set();',
          'function effect() {',
          '  running.add("timer");',
          '  console.log("Timer started");',
          '  return () => { running.delete("timer"); console.log("Timer stopped"); };',
          '}',
          '',
          'const cleanup = effect();',
          'console.log(`Running: ${running.size}`);',
          'cleanup();',
          'console.log(`Running: ${running.size}`);'
        ),
        output: lines('Timer started', 'Running: 1', 'Timer stopped', 'Running: 0'),
        codeNotes: [
          { line: 5, note: 'The returned function is the clean-up.' },
          { line: 10, note: 'React calls it when the component disappears.' }
        ],
        projectCode: {
          label: 'A timer with clean-up',
          code: lines(
            'const [seconds, setSeconds] = useState(0);',
            '',
            'useEffect(() => {',
            '  const id = setInterval(() => setSeconds(s => s + 1), 1000);',
            '  return () => clearInterval(id);',
            '}, []);'
          )
        },
        tryIt: 'Call effect() twice without cleanup in between, and print running.size. A Set stays at 1 here, but real timers would pile up: two timers running at once.',
        check: {
          question: 'What does the function returned from useEffect do?',
          options: ['Nothing', 'Cleans up, for example stops a timer, when the component goes away', 'Runs the effect twice'],
          answer: 1,
          why: 'React calls the returned clean-up function before the component disappears or before the effect runs again.'
        }
      },
      {
        title: 'Saving to the browser with localStorage',
        say: [
          'Right now, when you refresh the page, all your jobs disappear and you are back to the sample list. Let us fix that with localStorage: a small storage space in the browser that keeps text even after refresh.',
          'localStorage only stores text. So to save an array, turn it into text with JSON.stringify(jobs), and to load it back, turn the text into an array with JSON.parse(text). JSON is the standard text format for data on the web.',
          'Saving is an effect that depends on jobs: useEffect(() => { localStorage.setItem("jobs", JSON.stringify(jobs)); }, [jobs]);. Loading happens once, when creating the state: useState(() => loadJobs()), so the saved jobs are there from the very first render.',
          'Loading must be careful: the saved text could be missing or broken. Wrap JSON.parse in try and catch, and fall back to an empty list. That is exactly your Day 26 practice task, so you will write it properly then.'
        ],
        example: 'localStorage is like a notebook you keep in your bag. Close the app (the book), open it again, and your notes are still there. But you can only write words in it, so lists must be written out as text first.',
        code: lines(
          'const jobs = [{ id: 1, title: "Dev" }];',
          'const text = JSON.stringify(jobs);',
          'console.log(text);',
          'console.log(typeof text);',
          '',
          'const back = JSON.parse(text);',
          'console.log(back[0].title);'
        ),
        output: lines('[{"id":1,"title":"Dev"}]', 'string', 'Dev'),
        codeNotes: [
          { line: 2, note: 'JSON.stringify turns the array into text that can be stored.' },
          { line: 6, note: 'JSON.parse turns it back into a real array.' }
        ],
        projectCode: {
          label: 'Save and load jobs in App.jsx',
          code: lines(
            'function loadJobs() {',
            '  try {',
            '    const saved = JSON.parse(localStorage.getItem("jobs"));',
            '    return Array.isArray(saved) ? saved : initialJobs;',
            '  } catch {',
            '    return initialJobs;',
            '  }',
            '}',
            '',
            'const [jobs, setJobs] = useState(() => loadJobs());',
            '',
            'useEffect(() => {',
            '  localStorage.setItem("jobs", JSON.stringify(jobs));',
            '}, [jobs]);'
          )
        },
        tryIt: 'Try JSON.parse("broken{") in the code box. Read the error: this is why loading needs try and catch.',
        check: {
          question: 'Why do we use JSON.stringify before saving to localStorage?',
          options: ['To encrypt the data', 'Because localStorage only stores text', 'To make it smaller'],
          answer: 1,
          why: 'localStorage stores only strings, so arrays and objects must be turned into JSON text first.'
        }
      },
      {
        title: 'When not to use useEffect',
        say: [
          'Beginners often overuse useEffect. A common example: keeping a filtered list in state and updating it in an effect whenever jobs or search change. It works, but it is slower and causes an extra render, and the list is briefly out of date.',
          'Remember Day 15: if you can calculate something from state or props, just calculate it during render. const shownJobs = jobs.filter(...) needs no effect and no extra state.',
          'Use effects only for talking to the outside world: servers, browser storage, timers, the document title, third-party libraries. If the code only calculates values for the screen, it does not belong in an effect.',
          'The React team calls this "You might not need an effect". Knowing it will make your code cleaner than many developers with more experience.'
        ],
        example: 'You do not hire a courier to carry a note from your left hand to your right hand. Couriers (effects) are for sending things outside the house.',
        code: lines(
          'const jobs = [{ title: "React Dev" }, { title: "Tester" }];',
          'const search = "react";',
          '',
          'const shownJobs = jobs.filter(j => j.title.toLowerCase().includes(search));',
          'console.log(shownJobs.length);'
        ),
        output: '1',
        codeNotes: [
          { line: 4, note: 'Calculated during render: always correct, no effect or extra state needed.' }
        ],
        tryIt: 'Change search to "e" and run. The result is always up to date because it is recalculated.',
        check: {
          question: 'Should you use useEffect to keep a filtered list in state?',
          options: ['Yes, always', 'No, calculate it during render instead', 'Only for long lists'],
          answer: 1,
          why: 'Values that can be calculated from state belong in render, not in an effect with extra state.'
        }
      }
    ],
    summary: [
      'Side effects (servers, storage, timers, title) go in useEffect, which runs after the screen is drawn.',
      '[] runs once after the first render; [a, b] runs again when a or b change.',
      'Return a clean-up function to stop timers and listeners.',
      'localStorage stores text: use JSON.stringify to save and JSON.parse (with try/catch) to load.',
      'Do not use effects for values you can calculate during render.'
    ],
    projectStep: {
      title: 'Jobs that survive a refresh',
      steps: [
        'Add loadJobs and useState(() => loadJobs()) in App.',
        'Save jobs to localStorage in a useEffect with [jobs].',
        'Refresh the page and check that your jobs are still there.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 17,
    title: 'Loading Data From the Internet',
    goal: 'You can load data from an API with fetch, wait for it with async and await, and show loading, error and success states.',
    minutes: 32,
    recap: 'Yesterday you learned useEffect and made your jobs survive a page refresh.',
    parts: [
      {
        title: 'APIs: how apps get data',
        say: [
          'Most apps do not keep their data inside the app. Swiggy\'s restaurants, Instagram\'s posts and the weather forecast all live on servers. The app asks the server for data through an API: an address on the internet that answers with data instead of a web page.',
          'You ask by sending a request to an address, called a URL or endpoint, like https://api.example.com/companies. The server answers with a response, usually in JSON, the same text format you used with localStorage yesterday.',
          'Today your Job Tracker will load a list of companies from an API to suggest them in the form. This is the same skill every company app uses.'
        ],
        example: 'An API is like a restaurant menu with a waiter. You do not walk into the kitchen; you ask the waiter for dish number 12 (a request to an endpoint), and the waiter brings it on a plate (the JSON response).',
        code: lines(
          'const responseText = \'{"data":[{"name":"Infosys"},{"name":"Zoho"}]}\';',
          'const json = JSON.parse(responseText);',
          'console.log(json.data.length);',
          'console.log(json.data.map(c => c.name));'
        ),
        output: lines('2', '[ \'Infosys\', \'Zoho\' ]'),
        codeNotes: [
          { line: 1, note: 'What a server might send back: JSON text.' },
          { line: 2, note: 'Turned into real JavaScript data you can use.' }
        ],
        tryIt: 'Add a third company to the JSON text and run again. Be careful with the quotes and commas.',
        check: {
          question: 'What does an API usually send back?',
          options: ['A finished web page', 'Data, usually as JSON', 'A picture of the screen'],
          answer: 1,
          why: 'APIs answer with data, usually JSON, which your app turns into JavaScript objects.'
        }
      },
      {
        title: 'fetch, async and await',
        say: [
          'To send a request, use fetch(url). Asking a server takes time: maybe 100 milliseconds, maybe 5 seconds. JavaScript does not freeze while waiting; fetch gives back a promise, which is an IOU that says "the answer will arrive later".',
          'To wait for a promise in readable code, put await in front of it, inside a function marked async: const response = await fetch(url); const json = await response.json();. The function pauses at each await until the answer arrives, while the rest of the app keeps working.',
          'Read it like a story: ask the server, wait; turn the answer into JSON, wait; use the data. The in-lesson code box cannot reach the internet, so the real fetch is shown in the project box. In the runnable box we use ready-made data to practise the steps after the answer arrives.'
        ],
        example: 'Ordering food on an app: you place the order (fetch), you get an order number immediately (the promise), and you carry on with your day. When the food arrives (await), you eat it (use the data).',
        projectCode: {
          label: 'A real request',
          code: lines(
            'async function loadCompanies() {',
            '  const response = await fetch("https://jsonplaceholder.typicode.com/users");',
            '  const users = await response.json();',
            '  return users.map(user => user.company.name);',
            '}',
            '',
            'loadCompanies().then(names => console.log(names));'
          )
        },
        code: lines(
          'const fakeUsers = [',
          '  { name: "Leanne", company: { name: "Romaguera-Crona" } },',
          '  { name: "Ervin", company: { name: "Deckow-Crist" } }',
          '];',
          '',
          'const names = fakeUsers.map(user => user.company.name);',
          'console.log(names);'
        ),
        output: '[ \'Romaguera-Crona\', \'Deckow-Crist\' ]',
        codeNotes: [
          { line: 1, note: 'The same shape jsonplaceholder.typicode.com sends back, so you can practise without the internet.' },
          { line: 6, note: 'The same step as line 4 of the real request.' }
        ],
        tryIt: 'On your laptop, open the browser console (F12) on any page, paste the real request code, and press Enter. You will see ten real company names.',
        check: {
          question: 'What does await do?',
          options: ['Makes the request faster', 'Pauses the async function until the promise has an answer', 'Cancels the request'],
          answer: 1,
          why: 'await waits for the promise inside an async function, without freezing the rest of the app.'
        }
      },
      {
        title: 'The three states of every request',
        say: [
          'While data loads, your screen must not be blank or broken. Every request has three possible states: loading (waiting for the answer), error (something went wrong), and success (the data is here).',
          'Keep the state in React: const [status, setStatus] = useState("loading"); const [data, setData] = useState([]);. Show "Loading..." while loading, a friendly message on error, and the data on success.',
          'Errors happen more than you think: slow mobile networks, a server that is down, a wrong address. An app that handles errors gracefully feels professional; one that shows a blank page feels broken. Today\'s second practice task, requestView, turns the three states into text.'
        ],
        example: 'When you track a parcel: "Out for delivery" (loading), "Delivery failed, will retry" (error), "Delivered" (success). A tracking page that showed nothing would worry you.',
        code: lines(
          'function requestView(status, data) {',
          '  if (status === "loading") return "Loading...";',
          '  if (status === "error") return "Could not load. Please try again.";',
          '  return `Loaded ${data.length} companies`;',
          '}',
          '',
          'console.log(requestView("loading", []));',
          'console.log(requestView("error", []));',
          'console.log(requestView("success", ["Infosys", "Zoho"]));'
        ),
        output: lines('Loading...', 'Could not load. Please try again.', 'Loaded 2 companies'),
        codeNotes: [
          { line: 2, note: 'Each state gets its own screen. Early returns, like Day 11.' }
        ],
        tryIt: 'Add a fourth case: if status is "success" but data is empty, return "No companies found".',
        check: {
          question: 'What are the three states of a request?',
          options: ['Start, middle, end', 'Loading, error, success', 'Fast, slow, stopped'],
          answer: 1,
          why: 'Every request is loading, has failed, or has succeeded. Your screen should handle all three.'
        }
      },
      {
        title: 'Handling errors with try and catch',
        say: [
          'When something inside an async function fails, like the network being down, it throws an error. If nobody catches it, your loading code stops halfway and the screen stays on "Loading..." forever.',
          'Wrap the risky steps in try { ... } catch (err) { ... }. If anything in try throws, JavaScript jumps straight to catch, where you set the error state. Code after the failing line inside try does not run.',
          'One surprise: fetch does not throw when the server answers with an error code like 404 (not found) or 500 (server error). It only throws when the request cannot be sent at all. So check response.ok and throw your own error if it is false.',
          'The runnable box shows try and catch with a function that fails on purpose, so you can see the jump to catch.'
        ],
        example: 'A safety net under a trapeze artist. If they fall (an error), the net (catch) catches them and the show continues safely, instead of the whole circus stopping.',
        code: lines(
          'function parseCompanies(text) {',
          '  try {',
          '    const json = JSON.parse(text);',
          '    return { status: "success", data: json.data || [] };',
          '  } catch (err) {',
          '    return { status: "error", data: [] };',
          '  }',
          '}',
          '',
          'console.log(parseCompanies(\'{"data":["Zoho"]}\'));',
          'console.log(parseCompanies("<html>Server down</html>"));'
        ),
        output: lines('{ status: \'success\', data: [ \'Zoho\' ] }', '{ status: \'error\', data: [] }'),
        codeNotes: [
          { line: 3, note: 'If the text is not valid JSON, this line throws.' },
          { line: 6, note: 'catch runs instead, and we return a clean error state.' },
          { line: 11, note: 'A broken server answer, handled without crashing.' }
        ],
        projectCode: {
          label: 'Checking response.ok',
          code: lines(
            'const response = await fetch(url);',
            'if (!response.ok) {',
            '  throw new Error(`Server answered ${response.status}`);',
            '}',
            'const json = await response.json();'
          )
        },
        tryIt: 'Call parseCompanies("") with empty text. Which branch runs?',
        check: {
          question: 'Does fetch throw an error when the server answers 404?',
          options: ['Yes, always', 'No, you must check response.ok yourself', 'Only on Sundays'],
          answer: 1,
          why: 'fetch only throws when the request fails completely. For 404 or 500, check response.ok and throw yourself.'
        }
      },
      {
        title: 'Loading data in a component',
        say: [
          'Now put it together in React. Loading data is a side effect, so it goes in useEffect with an empty list, to run once when the component appears.',
          'The effect function itself cannot be async, so create an async function inside it and call it. Inside: set loading, fetch, check ok, read JSON, set data and success; in catch, set error.',
          'One more detail for later: if the component disappears before the answer arrives, you should not set state. The usual guard is a variable let cancelled = false; in the effect, set to true in the clean-up, and checked before setting state. It is shown in the code below.',
          'Read the component slowly, one line at a time. Every line uses something you already know: state, effects, async and await, try and catch, early returns.'
        ],
        example: 'A shop assistant who checks the storeroom when you arrive (effect), says "one moment" (loading), and comes back with the item or a polite "sorry, out of stock" (success or error).',
        projectCode: {
          label: 'src/components/CompanySuggestions.jsx',
          code: lines(
            'import { useEffect, useState } from "react";',
            '',
            'export default function CompanySuggestions() {',
            '  const [status, setStatus] = useState("loading");',
            '  const [companies, setCompanies] = useState([]);',
            '',
            '  useEffect(() => {',
            '    let cancelled = false;',
            '    async function load() {',
            '      try {',
            '        const response = await fetch("https://jsonplaceholder.typicode.com/users");',
            '        if (!response.ok) throw new Error(`Server answered ${response.status}`);',
            '        const users = await response.json();',
            '        if (!cancelled) {',
            '          setCompanies(users.map(u => u.company.name));',
            '          setStatus("success");',
            '        }',
            '      } catch {',
            '        if (!cancelled) setStatus("error");',
            '      }',
            '    }',
            '    load();',
            '    return () => { cancelled = true; };',
            '  }, []);',
            '',
            '  if (status === "loading") return <p>Loading companies...</p>;',
            '  if (status === "error") return <p>Could not load companies.</p>;',
            '  return <ul>{companies.map(name => <li key={name}>{name}</li>)}</ul>;',
            '}'
          )
        },
        code: lines(
          'function nextState(event, payload) {',
          '  if (event === "start") return { status: "loading", companies: [] };',
          '  if (event === "done") return { status: "success", companies: payload };',
          '  return { status: "error", companies: [] };',
          '}',
          '',
          'console.log(nextState("start"));',
          'console.log(nextState("done", ["Zoho", "TCS"]));',
          'console.log(nextState("failed"));'
        ),
        output: lines(
          '{ status: \'loading\', companies: [] }',
          '{ status: \'success\', companies: [ \'Zoho\', \'TCS\' ] }',
          '{ status: \'error\', companies: [] }'
        ),
        codeNotes: [
          { line: 1, note: 'The three moments of a request, as plain data. The component sets these with its setters.' }
        ],
        tryIt: 'Add CompanySuggestions to your App and watch "Loading companies..." turn into a list. Then turn off your Wi-Fi and refresh to see the error message.',
        check: {
          question: 'Why is there an async function inside the effect, instead of making the effect async?',
          options: ['It is just style', 'The effect function itself must not be async, so we define one inside and call it', 'Async is not allowed in React'],
          answer: 1,
          why: 'useEffect expects its function to return nothing or a clean-up, not a promise, so the async work goes in an inner function.'
        }
      },
      {
        title: 'Use the data in the Job Tracker form',
        say: [
          'Let us make the data useful. In JobForm, show the loaded company names as suggestions while the user types the company, using a datalist: an input with a list of suggestions built into the browser.',
          'Load the companies in App, or in JobForm itself since only the form needs them. Remember the Day 15 rule: state lives where it is needed.',
          'Real apps load data like this all the time: countries in a signup form, cities in a delivery form, skills on a profile. You have now done the full cycle: request, wait, handle errors, show.',
          'Tomorrow you make the whole app look good on phones and laptops.'
        ],
        example: 'When you type in Google Maps, it suggests places from its servers as you type. You are building a small version of that for company names.',
        projectCode: {
          label: 'Suggestions in JobForm',
          code: lines(
            '<input',
            '  name="company"',
            '  list="company-options"',
            '  value={form.company}',
            '  onChange={handleChange}',
            '/>',
            '<datalist id="company-options">',
            '  {companies.map(name => <option key={name} value={name} />)}',
            '</datalist>'
          )
        },
        code: lines(
          'const companies = ["Infosys", "Zoho", "TCS", "Zomato"];',
          'const typed = "zo";',
          'const suggestions = companies.filter(c => c.toLowerCase().startsWith(typed));',
          'console.log(suggestions);'
        ),
        output: '[ \'Zoho\', \'Zomato\' ]',
        codeNotes: [
          { line: 3, note: 'The browser\'s datalist does this matching for you; here it is by hand.' }
        ],
        tryIt: 'Change startsWith to includes and typed to "o". How many suggestions now?',
        check: {
          question: 'Where should the companies state live if only JobForm uses it?',
          options: ['In App, always', 'In JobForm, where it is needed', 'In localStorage only'],
          answer: 1,
          why: 'State lives in the lowest component that needs it. Only JobForm uses the suggestions.'
        }
      }
    ],
    summary: [
      'APIs send data, usually JSON, from a server address (an endpoint).',
      'fetch returns a promise; await it inside an async function.',
      'Handle three states: loading, error, success.',
      'Use try/catch, and check response.ok because fetch does not throw on 404 or 500.',
      'Load data in useEffect with [], using an inner async function and a cancelled guard.'
    ],
    projectStep: {
      title: 'Company suggestions from an API',
      steps: [
        'Load company names from https://jsonplaceholder.typicode.com/users in a useEffect.',
        'Show loading and error messages.',
        'Use the names as suggestions in the JobForm company input with a datalist.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 18,
    title: 'Styling and Layouts That Work on Phones',
    goal: 'You can style components with CSS classes, lay them out with flexbox and grid, make them work on phones, and use Tailwind CSS.',
    minutes: 30,
    recap: 'Yesterday you loaded data from the internet and handled loading and error states.',
    parts: [
      {
        title: 'Styling React components with CSS',
        say: [
          'Your Job Tracker works, but it looks plain. Recruiters notice design, and so do users. Today you learn to make it look clean and work on every screen size.',
          'The simplest way is a CSS file. Create src/index.css (Vite already has one), write rules with class names, and use them in JSX with className="job-card". Remember from Day 8: className, not class.',
          'You can also give a style prop with an object: style={{ color: "green" }}. CSS property names become camelCase: background-color becomes backgroundColor. Use the style prop only for small values that change with data, like a status colour. For everything else, use classes.',
          'A good habit: name classes after what things are, not how they look: .job-card, not .blue-box. If you later change the colour, the name still makes sense.'
        ],
        example: 'CSS classes are like school uniforms: you define the uniform once, and everyone who wears the class name looks the same. The style prop is like a badge pinned on one student.',
        projectCode: {
          label: 'src/index.css',
          code: lines(
            'body {',
            '  font-family: system-ui, sans-serif;',
            '  margin: 0;',
            '  background: #f6f7f9;',
            '  color: #1f2933;',
            '}',
            '',
            '.job-card {',
            '  background: white;',
            '  border: 1px solid #e3e6ea;',
            '  border-radius: 8px;',
            '  padding: 16px;',
            '}'
          )
        },
        code: lines(
          'const style = { backgroundColor: "white", borderRadius: "8px", padding: "16px" };',
          'const css = Object.entries(style)',
          '  .map(([key, value]) => key.replace(/[A-Z]/g, m => "-" + m.toLowerCase()) + ": " + value)',
          '  .join("; ");',
          'console.log(css);'
        ),
        output: 'background-color: white; border-radius: 8px; padding: 16px',
        codeNotes: [
          { line: 1, note: 'A React style object uses camelCase names.' },
          { line: 3, note: 'Turning each camelCase name back into CSS style, like React does for you.' }
        ],
        tryIt: 'Add fontSize: "18px" to the style object and run again.',
        check: {
          question: 'How is the CSS property font-size written in a React style object?',
          options: ['font-size', 'fontSize', 'FontSize'],
          answer: 1,
          why: 'Style object keys use camelCase: the dash is removed and the next letter is capital.'
        }
      },
      {
        title: 'Flexbox: arranging things in a row or column',
        say: [
          'Layout is where things sit on the screen. The most useful tool is flexbox. Put display: flex on a container, and its children line up in a row. flex-direction: column stacks them instead.',
          'Three more properties do most of the work: gap sets the space between items, justify-content spreads them along the row (start, center, space-between), and align-items lines them up across (center is common).',
          'A classic use: a job card header with the title on the left and the status badge on the right: display: flex; justify-content: space-between; align-items: center;.',
          'Add flex-wrap: wrap and items move to the next line when there is no room. That alone makes many layouts work on phones.'
        ],
        example: 'Flexbox is like arranging books on a shelf. You choose left to right or top to bottom, how much gap between books, and whether they are pushed to one side, centred or spread out.',
        projectCode: {
          label: 'Card header with flexbox',
          code: lines(
            '.job-card-header {',
            '  display: flex;',
            '  justify-content: space-between;',
            '  align-items: center;',
            '  gap: 12px;',
            '}',
            '',
            '// In JobCard:',
            '<div className="job-card-header">',
            '  <h3>{title}</h3>',
            '  <span className="badge">{status}</span>',
            '</div>'
          )
        },
        code: lines(
          'function spaceBetween(items, width) {',
          '  const used = items.join("").length;',
          '  const gap = Math.max(1, Math.floor((width - used) / (items.length - 1)));',
          '  return items.join(" ".repeat(gap));',
          '}',
          '',
          'console.log(`[${spaceBetween(["Title", "Badge"], 30)}]`);'
        ),
        output: '[Title                    Badge]',
        codeNotes: [
          { line: 3, note: 'justify-content: space-between puts all the extra space between the items.' }
        ],
        tryIt: 'Try three items: ["A", "B", "C"] with width 21.',
        check: {
          question: 'Which puts a title on the left and a badge on the far right?',
          options: ['display: flex; justify-content: space-between', 'display: block', 'text-align: right'],
          answer: 0,
          why: 'space-between pushes the first item to the start and the last item to the end.'
        }
      },
      {
        title: 'Grid: cards in rows and columns',
        say: [
          'For a set of cards in rows and columns, CSS grid is simpler than flexbox. display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; makes three equal columns. 1fr means one equal share of the space.',
          'Even better, grid can pick the number of columns by itself: grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));. This means: fit as many columns as possible, each at least 260 pixels wide. On a phone you get one column, on a laptop three or four, with no extra code.',
          'Use flexbox for one line of things, like a header or a row of buttons, and grid for two-dimensional layouts, like a list of cards.'
        ],
        example: 'A cinema seat map is a grid: rows and columns. A queue at a counter is flexbox: one line.',
        projectCode: {
          label: 'Job list as a grid',
          code: lines(
            '.job-list {',
            '  display: grid;',
            '  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));',
            '  gap: 16px;',
            '}'
          )
        },
        code: lines(
          'function autoFillColumns(screenWidth, minCard, gap) {',
          '  return Math.max(1, Math.floor((screenWidth + gap) / (minCard + gap)));',
          '}',
          '',
          'console.log(autoFillColumns(375, 260, 16));',
          'console.log(autoFillColumns(768, 260, 16));',
          'console.log(autoFillColumns(1280, 260, 16));'
        ),
        output: lines('1', '2', '4'),
        codeNotes: [
          { line: 2, note: 'Roughly what auto-fill with minmax(260px, 1fr) calculates for you.' },
          { line: 5, note: 'Phone: 1 column. Tablet: 2. Laptop: 4.' }
        ],
        tryIt: 'Change the minimum card width to 320 and see how the column counts change.',
        check: {
          question: 'What does repeat(auto-fill, minmax(260px, 1fr)) do?',
          options: ['Always 3 columns', 'As many columns as fit, each at least 260px wide', 'One column only'],
          answer: 1,
          why: 'auto-fill fits as many columns as possible, and minmax sets their smallest and largest size.'
        }
      },
      {
        title: 'Responsive design: phones first',
        say: [
          'More than half of internet users in India browse mainly on phones. So design for a phone first, then add changes for bigger screens. This is called mobile-first design.',
          'The tool for screen-size changes is a media query: @media (min-width: 768px) { ... }. Rules inside apply only when the screen is at least 768 pixels wide. Write your normal CSS for phones, and put the bigger-screen changes inside media queries.',
          'Test it: in Chrome, press F12, then the phone icon (device toolbar), and pick a phone like an iPhone SE or Pixel. Check there is no sideways scrolling, text is readable without zooming, and buttons are big enough to tap, at least about 44 pixels tall.',
          'Today\'s second practice task, columnsFor(width), is the same decision in JavaScript.'
        ],
        example: 'A newspaper uses wide columns in print, and the same news on a phone app is one narrow column. Same content, arranged for the space available.',
        projectCode: {
          label: 'Mobile-first CSS',
          code: lines(
            '.app {',
            '  padding: 16px;',
            '}',
            '',
            '@media (min-width: 768px) {',
            '  .app {',
            '    max-width: 1100px;',
            '    margin: 0 auto;',
            '    padding: 32px;',
            '  }',
            '}'
          )
        },
        code: lines(
          'function paddingFor(width) {',
          '  return width >= 768 ? 32 : 16;',
          '}',
          '',
          'console.log(paddingFor(375));',
          'console.log(paddingFor(1366));'
        ),
        output: lines('16', '32'),
        codeNotes: [
          { line: 2, note: 'Like the media query: bigger padding only on screens 768px and wider.' }
        ],
        tryIt: 'Add a third size: 64 for screens 1200px and wider. Check the biggest size first.',
        check: {
          question: 'What does mobile-first mean?',
          options: ['Only build for phones', 'Write CSS for phones first, add bigger-screen changes in media queries', 'Build a separate phone app'],
          answer: 1,
          why: 'Phone styles are the default, and media queries adjust for larger screens.'
        }
      },
      {
        title: 'Tailwind CSS: styling with small classes',
        say: [
          'Many companies now use Tailwind CSS. Instead of writing your own CSS rules, you add small ready-made classes directly in JSX: className="p-4 rounded-lg bg-white shadow". Each class does one thing: p-4 is padding, rounded-lg rounds the corners.',
          'Responsive design is built in: md:grid-cols-2 means two columns on medium screens and up. It follows the same mobile-first idea: the plain class is for phones, prefixed classes for bigger screens.',
          'Tailwind looks messy at first, but it is fast once you know the common classes, and you never have to invent class names. Because many job listings ask for it, knowing the basics is valuable.',
          'Both approaches are fine for your project. Plain CSS helps you understand what is happening; Tailwind is what you will often see at work. The official site has a clear install guide for Vite.'
        ],
        example: 'Plain CSS is like cooking from scratch; Tailwind is like using ready spice mixes. Both make good food. The mixes are faster once you know what each one does.',
        projectCode: {
          label: 'JobCard with Tailwind',
          code: lines(
            '<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">',
            '  <div className="flex items-center justify-between gap-3">',
            '    <h3 className="font-semibold">{title}</h3>',
            '    <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">{status}</span>',
            '  </div>',
            '  <p className="mt-1 text-gray-600">{company}</p>',
            '</div>'
          )
        },
        code: lines(
          'function classNames(...names) {',
          '  return names.filter(Boolean).join(" ");',
          '}',
          '',
          'const status = "offer";',
          'console.log(classNames("rounded-lg p-4", status === "offer" && "border-green-500", false && "hidden"));'
        ),
        output: 'rounded-lg p-4 border-green-500',
        codeNotes: [
          { line: 2, note: 'A tiny helper to join only the classes that apply. Today\'s first practice task.' },
          { line: 6, note: 'The green border is added only for offers.' }
        ],
        tryIt: 'Change status to "applied" and run. Which class disappears?',
        check: {
          question: 'In Tailwind, what does md:grid-cols-2 mean?',
          options: ['Always 2 columns', '2 columns on medium screens and larger', 'A medium-sized font'],
          answer: 1,
          why: 'The md: prefix applies the class from the medium screen size upward, mobile-first.'
        }
      },
      {
        title: 'Make the Job Tracker look professional',
        say: [
          'Time to style your app. Choose one main colour for buttons and links, and use soft grey backgrounds with white cards. Consistency matters more than fancy effects: same spacing, same corner radius, same font sizes everywhere.',
          'Lay out the job list as a responsive grid, give each card a flex header with the title and a coloured status badge, and make the form a neat row on laptops that stacks on phones.',
          'Then test on a phone size in Chrome\'s device toolbar. Fix anything that scrolls sideways or is too small to tap.',
          'A clean, responsive design makes your project look finished. Recruiters decide in seconds whether a portfolio project looks serious, and design is the first thing they see.'
        ],
        example: 'Two shops sell the same products. The tidy one with clear signs gets more customers. Your code may be great, but the design is the shop front.',
        projectCode: {
          label: 'Form row that stacks on phones',
          code: lines(
            '.job-form {',
            '  display: flex;',
            '  flex-direction: column;',
            '  gap: 8px;',
            '}',
            '',
            '@media (min-width: 768px) {',
            '  .job-form {',
            '    flex-direction: row;',
            '    align-items: center;',
            '  }',
            '}'
          )
        },
        code: lines(
          'const theme = { primary: "#2563eb", radius: "8px", space: [4, 8, 16, 24, 32] };',
          'console.log(`Buttons use ${theme.primary}`);',
          'console.log(`All cards use radius ${theme.radius}`);',
          'console.log(`Spacing steps: ${theme.space.join(", ")}px`);'
        ),
        output: lines('Buttons use #2563eb', 'All cards use radius 8px', 'Spacing steps: 4, 8, 16, 24, 32px'),
        codeNotes: [
          { line: 1, note: 'A small design system: choose a few values and reuse them everywhere.' }
        ],
        tryIt: 'Pick your own primary colour for your app and write it in the theme.',
        check: {
          question: 'What makes a design look professional most of all?',
          options: ['Lots of colours and animations', 'Consistent spacing, sizes and colours', 'Very small text'],
          answer: 1,
          why: 'Consistency is what makes an interface feel clean and trustworthy.'
        }
      }
    ],
    summary: [
      'Style with classes in a CSS file; use the style prop only for small data-driven values.',
      'Flexbox for a row or column; grid for cards in rows and columns.',
      'repeat(auto-fill, minmax(260px, 1fr)) gives responsive columns with no extra code.',
      'Mobile-first: phone styles by default, media queries for bigger screens.',
      'Tailwind uses small ready-made classes; md: and lg: prefixes handle bigger screens.'
    ],
    projectStep: {
      title: 'Style and make it responsive',
      steps: [
        'Style the cards, badges and form with a consistent colour, radius and spacing.',
        'Make the job list a responsive grid and the form stack on phones.',
        'Test in Chrome\'s device toolbar at phone size and fix any sideways scrolling.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 19,
    title: 'Multiple Pages with React Router',
    goal: 'You can add pages to a React app with React Router, move between them with links, and read values like a job id from the address.',
    minutes: 30,
    recap: 'Yesterday you styled the Job Tracker and made it work on phones.',
    parts: [
      {
        title: 'Why apps have pages',
        say: [
          'Real apps have several screens: a home page, a list, a details page, settings. Each has its own address, so you can bookmark it, share it, and use the browser\'s back button.',
          'Without pages, everything would sit on one long screen, or you would hide and show sections with state. That works for tiny apps, but users cannot share a link to one job, the back button does nothing useful, and search engines cannot see your screens.',
          'Your Job Tracker will get three pages: the dashboard at /, the job list at /jobs, and a details page for one job at /jobs/42, where 42 is the job\'s id.',
          'In a React app, the page does not reload when you move between screens. React simply swaps which component is shown, based on the address. This is called client-side routing, and it makes apps feel instant. The library almost everyone uses for it is React Router.'
        ],
        example: 'A shopping mall has one building but many shops, each with its own shop number. Walking between shops does not mean leaving the building. Routes are shop numbers inside your single app.',
        code: lines(
          'const routes = {',
          '  "/": "Dashboard",',
          '  "/jobs": "JobListPage"',
          '};',
          '',
          'function show(path) {',
          '  return routes[path] ?? "NotFound";',
          '}',
          '',
          'console.log(show("/"));',
          'console.log(show("/jobs"));',
          'console.log(show("/settings"));'
        ),
        output: lines('Dashboard', 'JobListPage', 'NotFound'),
        codeNotes: [
          { line: 1, note: 'A route table: which component to show for which address.' },
          { line: 7, note: 'Unknown addresses show a Not Found page.' }
        ],
        tryIt: 'Add "/settings": "SettingsPage" to the routes and run again.',
        check: {
          question: 'What is client-side routing?',
          options: ['Reloading the page for every screen', 'Swapping components based on the address without reloading', 'Sending the user to another website'],
          answer: 1,
          why: 'The app changes what it shows based on the address, without a full page reload.'
        }
      },
      {
        title: 'Setting up React Router',
        say: [
          'Install it in your project: npm install react-router-dom. Then wrap your app in BrowserRouter, usually in main.jsx, so every component can use routing.',
          'Inside App, describe your pages with Routes and Route: <Route path="/jobs" element={<JobListPage />} />. Each Route says: at this address, show this component. A Route with path="*" catches every unknown address, for your Not Found page.',
          'Parts that appear on every page, like the Header, stay outside Routes. Only the part that changes goes inside.',
          'The runnable box shows the matching idea. The real setup, which only runs in your project, is in the project box.'
        ],
        example: 'A hotel reception desk with a room list. Guests (addresses) are sent to the right room (component). Anyone asking for a room that does not exist is told politely at the desk (the * route).',
        projectCode: {
          label: 'src/main.jsx and src/App.jsx',
          code: lines(
            '// src/main.jsx',
            'import { BrowserRouter } from "react-router-dom";',
            'createRoot(document.getElementById("root")).render(',
            '  <BrowserRouter>',
            '    <App />',
            '  </BrowserRouter>',
            ');',
            '',
            '// src/App.jsx',
            'import { Routes, Route } from "react-router-dom";',
            '',
            'return (',
            '  <div className="app">',
            '    <Header />',
            '    <Routes>',
            '      <Route path="/" element={<Dashboard jobs={jobs} />} />',
            '      <Route path="/jobs" element={<JobListPage jobs={jobs} />} />',
            '      <Route path="/jobs/:id" element={<JobDetails jobs={jobs} />} />',
            '      <Route path="*" element={<p>Page not found</p>} />',
            '    </Routes>',
            '  </div>',
            ');'
          )
        },
        code: lines(
          'function matchRoute(path) {',
          '  if (path === "/") return "home";',
          '  if (path === "/jobs") return "jobs";',
          '  if (/^\\/jobs\\/[^/]+$/.test(path)) return "job-detail";',
          '  return "not-found";',
          '}',
          '',
          'for (const p of ["/", "/jobs", "/jobs/42", "/abc"]) {',
          '  console.log(`${p} -> ${matchRoute(p)}`);',
          '}'
        ),
        output: lines('/ -> home', '/jobs -> jobs', '/jobs/42 -> job-detail', '/abc -> not-found'),
        codeNotes: [
          { line: 4, note: 'A pattern for "/jobs/" followed by anything except another slash. React Router does this for "/jobs/:id".' }
        ],
        tryIt: 'Add "/jobs/42/edit" to the list. Which page does it match? Why?',
        check: {
          question: 'Which Route shows a Not Found page for unknown addresses?',
          options: ['<Route path="/" ... />', '<Route path="*" ... />', '<Route path="404" ... />'],
          answer: 1,
          why: 'path="*" matches any address not matched by the other routes.'
        }
      },
      {
        title: 'Moving between pages with Link',
        say: [
          'To move between pages, do not use a normal <a href="/jobs">. A normal link reloads the whole page, and your app loses its state. Use React Router\'s Link instead: <Link to="/jobs">All jobs</Link>. It changes the address and the screen without a reload.',
          'NavLink is a Link that knows when it is the current page, so you can style the active menu item. Use it in your Header menu.',
          'Sometimes you need to move from code, for example after saving a form. The useNavigate hook gives you a navigate function: navigate("/jobs") or navigate(-1) to go back.',
          'Links are also how your job cards will open the details page: <Link to={`/jobs/${job.id}`}>View</Link>. A template string builds the address from the id.',
          'A quick way to test that your links are right: click one, then press the browser\'s back button. You should return to the previous page instantly, with your search text and state still there. If the page flashes white and reloads, you used a normal a tag somewhere.'
        ],
        example: 'Moving between rooms in your house through inside doors (Link), instead of going out of the main door and ringing the bell again (a normal link that reloads).',
        projectCode: {
          label: 'Header menu and card link',
          code: lines(
            'import { NavLink, Link } from "react-router-dom";',
            '',
            '<nav className="menu">',
            '  <NavLink to="/">Dashboard</NavLink>',
            '  <NavLink to="/jobs">All jobs</NavLink>',
            '</nav>',
            '',
            '// In JobCard:',
            '<Link to={`/jobs/${id}`}>View details</Link>'
          )
        },
        code: lines(
          'const jobs = [{ id: 7, title: "Dev" }, { id: 12, title: "Tester" }];',
          'const links = jobs.map(job => `/jobs/${job.id}`);',
          'console.log(links);'
        ),
        output: '[ \'/jobs/7\', \'/jobs/12\' ]',
        codeNotes: [
          { line: 2, note: 'Each card\'s link address, built from its id with a template string.' }
        ],
        tryIt: 'Build the links as "/jobs/7/edit" instead.',
        check: {
          question: 'Why use Link instead of <a href> inside a React app?',
          options: ['Link looks nicer', 'Link changes pages without reloading, so state is kept', 'a tags are not allowed in JSX'],
          answer: 1,
          why: 'A normal link reloads the whole app and loses state. Link only swaps the component.'
        }
      },
      {
        title: 'Reading the id from the address',
        say: [
          'The details page must know which job to show. The route path "/jobs/:id" has a URL parameter: the colon means "any value here, call it id".',
          'Inside the page, the useParams hook gives you the parameters: const { id } = useParams();. For /jobs/42, id is "42". Notice it is text, not a number.',
          'Then find the job: jobs.find(job => job.id === Number(id)). Remember Day 2\'s trap: "42" and 42 are different with ===, so convert with Number first.',
          'If no job matches, show a friendly "Job not found" message with a link back to the list. People will type wrong addresses and open old bookmarks; handle it gracefully.'
        ],
        example: 'On Amazon, amazon.in/dp/B0C123 opens one product. The code after /dp/ tells the page which product to show. Your /jobs/42 works the same way.',
        projectCode: {
          label: 'src/pages/JobDetails.jsx',
          code: lines(
            'import { useParams, Link } from "react-router-dom";',
            '',
            'export default function JobDetails({ jobs }) {',
            '  const { id } = useParams();',
            '  const job = jobs.find(j => j.id === Number(id));',
            '',
            '  if (!job) {',
            '    return <p>Job not found. <Link to="/jobs">Back to all jobs</Link></p>;',
            '  }',
            '  return (',
            '    <div>',
            '      <h2>{job.title}</h2>',
            '      <p>{job.company} · {job.status}</p>',
            '      <Link to="/jobs">Back</Link>',
            '    </div>',
            '  );',
            '}'
          )
        },
        code: lines(
          'function jobIdFromPath(path) {',
          '  const parts = path.split("/");',
          '  return parts.length === 3 && parts[1] === "jobs" && parts[2] ? parts[2] : null;',
          '}',
          '',
          'const jobs = [{ id: 42, title: "React Developer" }];',
          'const id = jobIdFromPath("/jobs/42");',
          'console.log(id, typeof id);',
          'console.log(jobs.find(j => j.id === id));',
          'console.log(jobs.find(j => j.id === Number(id)).title);'
        ),
        output: lines('42 string', 'undefined', 'React Developer'),
        codeNotes: [
          { line: 2, note: '"/jobs/42".split("/") gives ["", "jobs", "42"].' },
          { line: 9, note: 'The trap: the text "42" is not equal to the number 42.' },
          { line: 10, note: 'The fix: convert with Number first.' }
        ],
        tryIt: 'Call jobIdFromPath("/jobs") and print it. What comes back?',
        check: {
          question: 'For the route /jobs/:id and address /jobs/42, what is id from useParams?',
          options: ['The number 42', 'The text "42"', 'undefined'],
          answer: 1,
          why: 'URL parameters are always text. Convert with Number(id) before comparing with number ids.'
        }
      },
      {
        title: 'Organising pages and components',
        say: [
          'As the app grows, organise files by role. A common layout: src/pages for full screens that match a route (Dashboard, JobListPage, JobDetails), and src/components for reusable pieces used by pages (JobCard, JobForm, Summary).',
          'Pages are usually thin: they read the route, pick the data, and arrange components. The real UI lives in components. This keeps each file small and easy to find.',
          'Where does the jobs state live now? Several pages need it, so it stays in App, above the Routes, and App passes it to each page. On Day 21, Context will offer a neater way.',
          'A tidy folder structure is something reviewers notice immediately in your GitHub project.',
          'There is no single correct structure, and every company has its own. What matters is that you can explain yours: pages match routes, components are reusable, hooks hold shared logic. Consistency beats cleverness.'
        ],
        example: 'A school has classrooms (pages) and shared resources like the library and lab (components). Classrooms use the shared resources; you do not build a new library for each class.',
        code: lines(
          'const files = {',
          '  pages: ["Dashboard.jsx", "JobListPage.jsx", "JobDetails.jsx"],',
          '  components: ["Header.jsx", "JobCard.jsx", "JobForm.jsx", "JobList.jsx", "Summary.jsx"]',
          '};',
          '',
          'for (const [folder, names] of Object.entries(files)) {',
          '  console.log(`src/${folder}: ${names.length} files`);',
          '}'
        ),
        output: lines('src/pages: 3 files', 'src/components: 5 files'),
        codeNotes: [
          { line: 2, note: 'Pages match routes.' },
          { line: 3, note: 'Components are reusable pieces.' }
        ],
        tryIt: 'Add a NotFound.jsx page to the list and run again.',
        check: {
          question: 'What usually goes in src/pages?',
          options: ['Every small button', 'Full screens that match a route', 'CSS files'],
          answer: 1,
          why: 'Pages are route-level screens; reusable pieces go in components.'
        }
      },
      {
        title: 'Add pages to the Job Tracker',
        say: [
          'Now build it. Install React Router, wrap App in BrowserRouter, and create three pages: Dashboard with the Summary and the Add Job form, JobListPage with search and the list, and JobDetails for one job.',
          'Add a menu with NavLink to the Header, and a "View details" link on each JobCard.',
          'One setting for later: when you deploy on Day 29, the server must send index.html for every address, otherwise refreshing /jobs/42 shows the server\'s own 404 page. Vercel handles this with a small config file; we will add it then.',
          'After today, your app has real navigation, shareable addresses and a working back button, like a professional product.'
        ],
        example: 'Your app just grew from a single room into a small house with a hallway. Each room has a purpose, and the menu is the hallway connecting them.',
        projectCode: {
          label: 'Terminal',
          code: 'npm install react-router-dom'
        },
        code: lines(
          'const pages = [',
          '  { path: "/", title: "Dashboard" },',
          '  { path: "/jobs", title: "All jobs" },',
          '  { path: "/jobs/:id", title: "Job details" }',
          '];',
          '',
          'const menu = pages.filter(p => !p.path.includes(":")).map(p => p.title);',
          'console.log(menu);'
        ),
        output: '[ \'Dashboard\', \'All jobs\' ]',
        codeNotes: [
          { line: 7, note: 'Pages with a parameter, like the details page, are not menu items; you reach them from a card.' }
        ],
        tryIt: 'Add a Settings page to the list and check it appears in the menu.',
        check: {
          question: 'Why does the details page not appear in the main menu?',
          options: ['It is broken', 'It needs a specific job id, so you reach it from a job card', 'Menus can only have two items'],
          answer: 1,
          why: 'A details page shows one item, so it is opened from that item\'s link, not from the menu.'
        }
      }
    ],
    summary: [
      'React Router shows different components for different addresses without reloading.',
      'BrowserRouter wraps the app; Routes and Route map paths to pages; path="*" catches unknown addresses.',
      'Use Link and NavLink, not <a href>, to keep state; useNavigate moves from code.',
      'useParams reads URL parameters as text; convert with Number before comparing ids.',
      'Keep route-level screens in src/pages and reusable pieces in src/components.'
    ],
    projectStep: {
      title: 'Three pages and a menu',
      steps: [
        'Install react-router-dom and wrap App in BrowserRouter.',
        'Create Dashboard, JobListPage and JobDetails pages with routes, plus a Not Found route.',
        'Add a NavLink menu in Header and a "View details" Link on each JobCard.'
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  {
    day: 20,
    title: 'Custom Hooks: Reusing Logic',
    goal: 'You can move repeated logic into your own hooks, follow the rules of hooks, and use custom hooks to keep components short.',
    minutes: 30,
    recap: 'Yesterday you added pages to the Job Tracker with React Router.',
    parts: [
      {
        title: 'The problem: the same logic in many places',
        say: [
          'Look at your app. The dashboard and the job list both need search. The job list and the details page both need to load jobs from localStorage. As apps grow, the same logic appears in several components, copied and pasted.',
          'Copies are dangerous. Fix a bug in one copy, forget the other, and the app behaves differently in two places. You have already solved this problem for display, with components. For logic that uses state and effects, the answer is a custom hook.',
          'A custom hook is just a function whose name starts with use, which can call other hooks like useState and useEffect inside it. Components call it and get back values and functions.',
          'You have already used hooks written by others: useState and useEffect from React, useParams and useNavigate from React Router. Today you write your own, in exactly the same style. There is nothing magic about them; they are functions with a naming rule.'
        ],
        example: 'A family recipe written once in a book, used by everyone who cooks it, instead of each person remembering their own slightly different version.',
        code: lines(
          'function searchJobs(jobs, text) {',
          '  const q = text.toLowerCase();',
          '  return jobs.filter(job => job.title.toLowerCase().includes(q));',
          '}',
          '',
          'const jobs = [{ title: "React Developer" }, { title: "Java Developer" }, { title: "Tester" }];',
          'console.log(searchJobs(jobs, "react").length);',
          'console.log(searchJobs(jobs, "DEVELOPER").length);',
          'console.log(searchJobs(jobs, "").length);'
        ),
        output: lines('1', '2', '3'),
        codeNotes: [
          { line: 1, note: 'Logic written once, used anywhere. Today\'s first practice task.' },
          { line: 9, note: 'Empty text matches everything, because every title includes "".' }
        ],
        tryIt: 'Make it also search the company: add company to the jobs and check job.company.toLowerCase().includes(q) too, joined with ||.',
        check: {
          question: 'What is a custom hook?',
          options: ['A React component', 'A function starting with use that can use other hooks and return values', 'A CSS helper'],
          answer: 1,
          why: 'A custom hook packs reusable stateful logic into a function whose name starts with use.'
        }
      },
      {
        title: 'Your first custom hook: useSearch',
        say: [
          'Move the search logic into a hook: function useSearch(items) { const [text, setText] = useState(""); const results = items.filter(...); return { text, setText, results }; }.',
          'Now any page can write const { text, setText, results } = useSearch(jobs); and get a working search: the state, the setter and the filtered list. The component only handles showing them.',
          'Each component that calls useSearch gets its own separate text state. Hooks share logic, not data. If you want two components to share the same data, lift the state up or use Context, which you learn tomorrow.',
          'The runnable box imitates a hook with a function that keeps its own value, exactly your second practice task, createCounter.'
        ],
        example: 'A photocopy of a blank form. Everyone uses the same form design (the hook), but each person fills in their own copy (their own state).',
        projectCode: {
          label: 'src/hooks/useSearch.js',
          code: lines(
            'import { useState } from "react";',
            '',
            'export function useSearch(items) {',
            '  const [text, setText] = useState("");',
            '  const q = text.toLowerCase();',
            '  const results = items.filter(item =>',
            '    item.title.toLowerCase().includes(q) || item.company.toLowerCase().includes(q)',
            '  );',
            '  return { text, setText, results };',
            '}',
            '',
            '// In JobListPage:',
            'const { text, setText, results } = useSearch(jobs);'
          )
        },
        code: lines(
          'function createCounter(start) {',
          '  let count = start;',
          '  return { increment: () => { count = count + 1; }, value: () => count };',
          '}',
          '',
          'const a = createCounter(0);',
          'const b = createCounter(10);',
          'a.increment(); a.increment(); b.increment();',
          'console.log(a.value(), b.value());'
        ),
        output: '2 11',
        codeNotes: [
          { line: 2, note: 'Each call keeps its own count, like each component calling a hook gets its own state.' },
          { line: 9, note: 'a and b do not share: 2 and 11.' }
        ],
        tryIt: 'Add a reset() function to createCounter that sets count back to start.',
        check: {
          question: 'Two components both call useSearch(jobs). Do they share the same search text?',
          options: ['Yes', 'No, each gets its own state', 'Only if they are on the same page'],
          answer: 1,
          why: 'Custom hooks share logic, not state. Each call has its own useState inside.'
        }
      },
      {
        title: 'The rules of hooks',
        say: [
          'Hooks have two rules, and breaking them causes confusing bugs. Rule one: only call hooks at the top level of a component or a custom hook. Never inside if, loops or nested functions.',
          'Why? React remembers your hooks by their order: the first useState, the second useState, the first useEffect. If a hook is inside an if, it runs on some renders and not others, the order shifts, and React gives the wrong state to the wrong hook.',
          'Rule two: only call hooks from React components or custom hooks, not from normal functions. That is why custom hooks must start with use: it tells React and your editor that the rules apply.',
          'If you need a condition, put it inside the hook, not around it: useEffect(() => { if (!userId) return; ... }, [userId]);.'
        ],
        example: 'A teacher takes attendance by seat order: first seat, second seat, third seat. If students keep switching seats between days, the register goes wrong. Hooks must sit in the same seats every render.',
        code: lines(
          'const stored = ["Asha", "dark"];',
          'function render(showName) {',
          '  const values = [];',
          '  let i = 0;',
          '  const fakeUseState = () => stored[i++];',
          '  if (showName) values.push(`name=${fakeUseState()}`);',
          '  values.push(`theme=${fakeUseState()}`);',
          '  return values.join(", ");',
          '}',
          '',
          'console.log(render(true));',
          'console.log(render(false));'
        ),
        output: lines('name=Asha, theme=dark', 'theme=Asha'),
        codeNotes: [
          { line: 5, note: 'Like React: values are handed out by call order.' },
          { line: 6, note: 'A hook inside an if: sometimes it is called, sometimes not.' },
          { line: 12, note: 'The bug: theme now gets the name\'s value, because the order shifted.' }
        ],
        tryIt: 'Move the name line out of the if (always call it) and check that theme is correct both times.',
        check: {
          question: 'Can you call useState inside an if statement?',
          options: ['Yes', 'No, hooks must be called at the top level in the same order every render', 'Only for numbers'],
          answer: 1,
          why: 'React tracks hooks by call order. A conditional hook changes the order and mixes up state.'
        }
      },
      {
        title: 'useLocalStorage: state that saves itself',
        say: [
          'Here is a hook many real apps use. Remember Day 16: loading from localStorage when creating state, and saving in an effect. That is two pieces of code that always go together, which makes it a perfect custom hook.',
          'useLocalStorage(key, initialValue) works just like useState, but the value is also saved in the browser and loaded back after refresh. It returns [value, setValue], the same shape as useState, so it is a drop-in replacement.',
          'In App, const [jobs, setJobs] = useState(...) plus the effect becomes one line: const [jobs, setJobs] = useLocalStorage("jobs", initialJobs);. Much cleaner.',
          'Returning the same shape as a built-in hook is good design: other developers already know how to use it.',
          'The key parameter lets you reuse the hook for anything: useLocalStorage("theme", "light") for dark mode, useLocalStorage("draft", emptyForm) to keep a half-filled form after refresh. One hook, many uses.'
        ],
        example: 'A notebook that automatically photocopies every page you write into a safe. You write normally, and the copies happen by themselves.',
        projectCode: {
          label: 'src/hooks/useLocalStorage.js',
          code: lines(
            'import { useEffect, useState } from "react";',
            '',
            'export function useLocalStorage(key, initialValue) {',
            '  const [value, setValue] = useState(() => {',
            '    try {',
            '      const saved = localStorage.getItem(key);',
            '      return saved !== null ? JSON.parse(saved) : initialValue;',
            '    } catch {',
            '      return initialValue;',
            '    }',
            '  });',
            '',
            '  useEffect(() => {',
            '    localStorage.setItem(key, JSON.stringify(value));',
            '  }, [key, value]);',
            '',
            '  return [value, setValue];',
            '}'
          )
        },
        code: lines(
          'const storage = {};',
          'function load(key, initial) {',
          '  try { return key in storage ? JSON.parse(storage[key]) : initial; }',
          '  catch { return initial; }',
          '}',
          'function save(key, value) { storage[key] = JSON.stringify(value); }',
          '',
          'let jobs = load("jobs", []);',
          'jobs = [...jobs, { id: 1 }];',
          'save("jobs", jobs);',
          'console.log(load("jobs", []));',
          'storage.broken = "{oops";',
          'console.log(load("broken", ["safe default"]));'
        ),
        output: lines('[ { id: 1 } ]', '[ \'safe default\' ]'),
        codeNotes: [
          { line: 3, note: 'Load: saved value if present, otherwise the starting value.' },
          { line: 13, note: 'Broken saved data falls back safely instead of crashing the app.' }
        ],
        tryIt: 'Save a theme with save("theme", "dark") and load it back.',
        check: {
          question: 'Why does useLocalStorage return [value, setValue]?',
          options: ['It is required', 'So it can be used exactly like useState', 'To save memory'],
          answer: 1,
          why: 'Matching useState\'s shape makes the hook familiar and a drop-in replacement.'
        }
      },
      {
        title: 'useFetch: loading data anywhere',
        say: [
          'Day 17\'s loading code, with status, data, the effect and the error handling, is long. And every page that loads data would repeat it. Move it into a hook: useFetch(url) returns { status, data }.',
          'Then CompanySuggestions becomes: const { status, data } = useFetch(COMPANIES_URL);, followed by the three early returns. The component reads almost like plain English.',
          'The url is a dependency of the effect inside the hook, so if the address changes, it loads again automatically.',
          'Libraries like TanStack Query give you a much more powerful version of this, with caching and retries. Many companies use them. Now you understand what they do underneath.',
          'Notice this version uses .then instead of async and await. Both do the same job: .then says "when the promise is ready, run this". You will see both styles in company code, so it helps to read either one comfortably.'
        ],
        example: 'A delivery service you call with just an address. You do not need to know about vans, routes or traffic. useFetch is that service for data.',
        projectCode: {
          label: 'src/hooks/useFetch.js',
          code: lines(
            'import { useEffect, useState } from "react";',
            '',
            'export function useFetch(url) {',
            '  const [state, setState] = useState({ status: "loading", data: null });',
            '',
            '  useEffect(() => {',
            '    let cancelled = false;',
            '    setState({ status: "loading", data: null });',
            '    fetch(url)',
            '      .then(res => {',
            '        if (!res.ok) throw new Error(`Server answered ${res.status}`);',
            '        return res.json();',
            '      })',
            '      .then(data => { if (!cancelled) setState({ status: "success", data }); })',
            '      .catch(() => { if (!cancelled) setState({ status: "error", data: null }); });',
            '    return () => { cancelled = true; };',
            '  }, [url]);',
            '',
            '  return state;',
            '}'
          )
        },
        code: lines(
          'function view({ status, data }) {',
          '  if (status === "loading") return "Loading...";',
          '  if (status === "error") return "Could not load.";',
          '  return `${data.length} companies`;',
          '}',
          '',
          'console.log(view({ status: "loading", data: null }));',
          'console.log(view({ status: "success", data: ["Zoho", "TCS", "Infosys"] }));'
        ),
        output: lines('Loading...', '3 companies'),
        codeNotes: [
          { line: 1, note: 'With useFetch, the component only decides what to show for each state.' }
        ],
        tryIt: 'Call view with status "error" and check the message.',
        check: {
          question: 'Why is url in the dependency list of the effect inside useFetch?',
          options: ['It is not needed', 'So the data loads again when the address changes', 'To make it faster'],
          answer: 1,
          why: 'The effect uses url, so it must re-run when url changes.'
        }
      },
      {
        title: 'Clean up the Job Tracker with hooks',
        say: [
          'Refactor your app, which means improving the code without changing what it does. Create a src/hooks folder with useLocalStorage, useSearch and useFetch, and replace the repeated code in your components.',
          'After refactoring, test everything: add, search, change status, delete, refresh, open a details page. The app must behave exactly as before. That is the whole point of a refactor.',
          'Your components should now be noticeably shorter. Interviewers often ask "tell me about a time you improved your code". This refactor is a great, concrete answer.',
          'After this lesson comes your fourth short test, covering Days 16 to 20. Then the final week: Context, Git, planning, building, debugging, testing and deploying.'
        ],
        example: 'Tidying a kitchen: the same food gets cooked, but the spices are now labelled in one rack instead of scattered in every cupboard. Cooking gets faster and mistakes rarer.',
        projectCode: {
          label: 'App.jsx after the refactor',
          code: lines(
            'import { useLocalStorage } from "./hooks/useLocalStorage.js";',
            '',
            'export default function App() {',
            '  const [jobs, setJobs] = useLocalStorage("jobs", initialJobs);',
            '  const addJob = job => setJobs(prev => [...prev, job]);',
            '  const deleteJob = id => setJobs(prev => prev.filter(j => j.id !== id));',
            '  const changeStatus = (id, status) =>',
            '    setJobs(prev => prev.map(j => (j.id === id ? { ...j, status } : j)));',
            '  // routes as before',
            '}'
          )
        },
        code: lines(
          'const before = { AppLines: 60, JobListPageLines: 45 };',
          'const after = { AppLines: 30, JobListPageLines: 25 };',
          'for (const file of Object.keys(before)) {',
          '  const saved = before[file] - after[file];',
          '  console.log(`${file}: ${before[file]} -> ${after[file]} (${saved} fewer)`);',
          '}'
        ),
        output: lines('AppLines: 60 -> 30 (30 fewer)', 'JobListPageLines: 45 -> 25 (20 fewer)'),
        codeNotes: [
          { line: 1, note: 'Example numbers. Count your own files before and after the refactor.' }
        ],
        tryIt: 'Before refactoring, count the lines in App.jsx. After, count again and note the difference for your interview story.',
        check: {
          question: 'What must stay the same after a refactor?',
          options: ['The file names', 'What the app does', 'The number of lines'],
          answer: 1,
          why: 'A refactor improves the code\'s structure without changing its behaviour.'
        }
      }
    ],
    summary: [
      'A custom hook is a function starting with use that packs reusable logic, including state and effects.',
      'Hooks share logic, not state: each component calling a hook gets its own state.',
      'Rules of hooks: call them at the top level, in the same order, only from components or hooks.',
      'useLocalStorage, useSearch and useFetch keep components short and consistent.',
      'A refactor improves structure without changing behaviour; test everything after.'
    ],
    projectStep: {
      title: 'Refactor with custom hooks',
      steps: [
        'Create src/hooks with useLocalStorage, useSearch and useFetch.',
        'Replace the repeated code in App, JobListPage and CompanySuggestions.',
        'Test add, search, status change, delete, refresh and the details page.'
      ]
    }
  }
];
