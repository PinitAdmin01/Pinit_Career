import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

/**
 * 1-Month React course (course-react-web): from JavaScript basics to a deployed React app.
 *
 * Week 1: the JavaScript React needs. Week 2: React basics. Week 3: real-app skills
 * (effects, data, routing, hooks, context). Week 4: Git, building and deploying the month
 * project, debugging, testing and interview practice.
 *
 * Month project: a Job Tracker (add jobs you applied to, track status, filter, load data, deploy).
 * Practice tasks are small JavaScript functions checked automatically; many of them are the
 * logic the Job Tracker needs.
 *
 * Quest ids (react-basics-lecture1/exam/assign-day-N) are unchanged, so saved progress stays valid.
 */
const lines = (...l: string[]) => l.join('\n');

export const REACT_30_DAYS_CONFIGS: DayConfig[] = [
  // ── WEEK 1: The JavaScript React needs ─────────────────────────────────────
  {
    title: "How a Website Works: HTML, CSS, JavaScript and React",
    desc: "Every website is made of three things: HTML (the content), CSS (the look) and JavaScript (the behaviour). React is a JavaScript tool that helps you build the screens of an app from small reusable pieces. (Real world: Instagram's web app is built with React.)",
    syllabus: [
      "Three layers of a web page: HTML for content, CSS for style, JavaScript for actions.",
      "What React is: a JavaScript library for building screens out of small pieces called components.",
      "Your first JavaScript: console.log, strings and running code."
    ],
    eTitle: "Your App's Title",
    eDesc: "Write a function `pageTitle()` that returns the text `'My Job Tracker'`.",
    eStarter: lines("function pageTitle() {", "  // Return the text 'My Job Tracker'", "  return '';", "}"),
    eHint: "Put the words inside the quotes: return 'My Job Tracker';",
    eTest: lines(
      "if (typeof pageTitle !== 'function') throw new Error('pageTitle not found');",
      "if (pageTitle() !== 'My Job Tracker') throw new Error('Expected My Job Tracker but got ' + pageTitle());"
    ),
    aTitle: "Say Hello",
    aDesc: "Write a function `sayHello(name)` that returns `'Hello, '` followed by the name. Example: `sayHello('Asha')` returns `'Hello, Asha'`.",
    aStarter: lines("function sayHello(name) {", "  // Join 'Hello, ' and name with +", "  return '';", "}"),
    aHint: "return 'Hello, ' + name;",
    aTest: lines(
      "if (typeof sayHello !== 'function') throw new Error('sayHello not found');",
      "if (sayHello('Asha') !== 'Hello, Asha') throw new Error('sayHello(\"Asha\") should be Hello, Asha');",
      "if (sayHello('Ravi') !== 'Hello, Ravi') throw new Error('sayHello(\"Ravi\") should be Hello, Ravi');"
    )
  },
  {
    title: "Variables and Data Types",
    desc: "A variable is a labelled box that stores a value. JavaScript has a few basic kinds of values: text (strings), numbers, true/false (booleans), and 'nothing' (null and undefined). (Real world: a shopping app keeps the cart total in a variable.)",
    syllabus: [
      "let and const: boxes you can change, and boxes you can't.",
      "Strings, numbers and booleans: the basic kinds of values.",
      "Comparing values with ===, >, <, and joining text with +."
    ],
    eTitle: "Describe a Job",
    eDesc: "Write `describeJob(title, salary)` that returns text like `'Frontend Developer pays 400000'`.",
    eStarter: lines("function describeJob(title, salary) {", "  // Join title, ' pays ', and salary", "  return '';", "}"),
    eHint: "return title + ' pays ' + salary;",
    eTest: lines(
      "if (typeof describeJob !== 'function') throw new Error('describeJob not found');",
      "if (describeJob('Frontend Developer', 400000) !== 'Frontend Developer pays 400000') throw new Error('Wrong text: ' + describeJob('Frontend Developer', 400000));"
    ),
    aTitle: "Is It a Good Salary?",
    aDesc: "Write `isGoodSalary(salary)` that returns `true` when the salary is 500000 or more, otherwise `false`.",
    aStarter: lines("function isGoodSalary(salary) {", "  // Compare salary with 500000 using >=", "}"),
    aHint: "return salary >= 500000;",
    aTest: lines(
      "if (typeof isGoodSalary !== 'function') throw new Error('isGoodSalary not found');",
      "if (isGoodSalary(500000) !== true) throw new Error('500000 should be true');",
      "if (isGoodSalary(900000) !== true) throw new Error('900000 should be true');",
      "if (isGoodSalary(300000) !== false) throw new Error('300000 should be false');"
    )
  },
  {
    title: "Functions and Making Decisions",
    desc: "A function is a small machine: you give it inputs, it does a job, and gives back an answer. With if/else your code can make decisions. React components are just functions, so this is the most important day of week 1. (Real world: a food app decides to show 'Free delivery' when the bill is above a limit.)",
    syllabus: [
      "Writing functions: inputs (parameters), work, and the answer (return).",
      "Arrow functions: the short way to write a function, used everywhere in React.",
      "if, else if, else: letting code choose what to do."
    ],
    eTitle: "Pass or Fail",
    eDesc: "Write `getResult(score)` that returns `'Pass'` when score is 40 or more, otherwise `'Fail'`.",
    eStarter: lines("function getResult(score) {", "  // Use if / else", "}"),
    eHint: "if (score >= 40) { return 'Pass'; } else { return 'Fail'; }",
    eTest: lines(
      "if (typeof getResult !== 'function') throw new Error('getResult not found');",
      "if (getResult(40) !== 'Pass') throw new Error('40 should Pass');",
      "if (getResult(75) !== 'Pass') throw new Error('75 should Pass');",
      "if (getResult(39) !== 'Fail') throw new Error('39 should Fail');"
    ),
    aTitle: "Full Name Arrow Function",
    aDesc: "Write an arrow function `fullName` that takes `first` and `last` and returns them joined with one space. Example: `fullName('Asha', 'Rao')` returns `'Asha Rao'`.",
    aStarter: lines("const fullName = (first, last) => {", "  // Return first + ' ' + last", "};"),
    aHint: "const fullName = (first, last) => first + ' ' + last;",
    aTest: lines(
      "if (typeof fullName !== 'function') throw new Error('fullName not found');",
      "if (fullName('Asha', 'Rao') !== 'Asha Rao') throw new Error('Expected Asha Rao but got ' + fullName('Asha', 'Rao'));"
    )
  },
  {
    title: "Arrays and Objects",
    desc: "An array is a numbered list of values. An object groups related details under names, like a form with labelled fields. Almost all app data is arrays of objects, like a list of jobs where each job has a title and a company. (Real world: your chat app stores messages as an array of message objects.)",
    syllabus: [
      "Arrays: lists you can read by position, add to, and count with .length.",
      "Objects: named details like { title: 'Developer', company: 'Infosys' }.",
      "Arrays of objects: the shape of real app data."
    ],
    eTitle: "Make a Job",
    eDesc: "Write `makeJob(title, company)` that returns an object `{ title, company, status: 'applied' }`.",
    eStarter: lines("function makeJob(title, company) {", "  return {", "    // add title, company and status here", "  };", "}"),
    eHint: "return { title: title, company: company, status: 'applied' };",
    eTest: lines(
      "if (typeof makeJob !== 'function') throw new Error('makeJob not found');",
      "const j = makeJob('Developer', 'TCS');",
      "if (j.title !== 'Developer' || j.company !== 'TCS') throw new Error('title or company is wrong');",
      "if (j.status !== 'applied') throw new Error('status should be applied');"
    ),
    aTitle: "First and Last",
    aDesc: "Write `firstAndLast(list)` that returns a new array with the first and the last item of `list`.",
    aStarter: lines("function firstAndLast(list) {", "  // list[0] is the first item. What is the last?", "}"),
    aHint: "The last item is list[list.length - 1].",
    aTest: lines(
      "if (typeof firstAndLast !== 'function') throw new Error('firstAndLast not found');",
      "const r = firstAndLast(['a', 'b', 'c', 'd']);",
      "if (!Array.isArray(r) || r[0] !== 'a' || r[1] !== 'd' || r.length !== 2) throw new Error('Expected [a, d]');"
    )
  },
  {
    title: "Loops and Array Methods: map, filter, find",
    desc: "Apps show lists all the time. Instead of writing the same code for every item, you loop over the list. map changes every item, filter keeps only some items, and find picks one. React uses map to show lists on screen. (Real world: Swiggy filters restaurants to show only 'Pure Veg' ones.)",
    syllabus: [
      "for...of loops: doing something for each item.",
      "map and filter: making a new list from an old one.",
      "find: getting the first item that matches."
    ],
    eTitle: "Job Titles Only",
    eDesc: "Write `getTitles(jobs)` that returns an array of just the titles, using `map`.",
    eStarter: lines("function getTitles(jobs) {", "  return jobs.map(job => {", "    // return the title of this job", "  });", "}"),
    eHint: "return jobs.map(job => job.title);",
    eTest: lines(
      "if (typeof getTitles !== 'function') throw new Error('getTitles not found');",
      "const t = getTitles([{ title: 'Dev' }, { title: 'Tester' }]);",
      "if (t.length !== 2 || t[0] !== 'Dev' || t[1] !== 'Tester') throw new Error('Expected [Dev, Tester]');"
    ),
    aTitle: "Only Interviews",
    aDesc: "Write `onlyInterviews(jobs)` that returns only the jobs whose `status` is `'interview'`, using `filter`.",
    aStarter: lines("function onlyInterviews(jobs) {", "  // use jobs.filter(...)", "}"),
    aHint: "return jobs.filter(job => job.status === 'interview');",
    aTest: lines(
      "if (typeof onlyInterviews !== 'function') throw new Error('onlyInterviews not found');",
      "const r = onlyInterviews([{ id: 1, status: 'applied' }, { id: 2, status: 'interview' }, { id: 3, status: 'interview' }]);",
      "if (r.length !== 2 || r[0].id !== 2 || r[1].id !== 3) throw new Error('Expected the two interview jobs');"
    )
  },
  {
    title: "Modern JavaScript: Template Strings, Destructuring and Spread",
    desc: "React code uses a few short-cuts all the time. Template strings build text easily, destructuring pulls values out of objects, and spread (...) copies arrays and objects. Once you know these, React code stops looking strange. (Real world: updating one field of your profile without touching the others.)",
    syllabus: [
      "Template strings: `Hello, ${name}` instead of joining with +.",
      "Destructuring: const { title, company } = job.",
      "Spread: { ...job, status: 'offer' } makes an updated copy."
    ],
    eTitle: "Update a Job's Status",
    eDesc: "Write `updateStatus(job, status)` that returns a NEW object with the same details but the new status. Do not change the original job.",
    eStarter: lines("function updateStatus(job, status) {", "  // copy job with ...job and set the new status", "}"),
    eHint: "return { ...job, status: status };",
    eTest: lines(
      "if (typeof updateStatus !== 'function') throw new Error('updateStatus not found');",
      "const job = { title: 'Dev', status: 'applied' };",
      "const u = updateStatus(job, 'offer');",
      "if (u.status !== 'offer' || u.title !== 'Dev') throw new Error('New job should have status offer and keep the title');",
      "if (job.status !== 'applied') throw new Error('The original job was changed. Make a copy instead.');"
    ),
    aTitle: "Job Card Text",
    aDesc: "Write `jobCard(job)` that uses destructuring and a template string to return text like `'Developer at Infosys'`.",
    aStarter: lines("function jobCard(job) {", "  const { title, company } = job;", "  // return a template string using title and company", "}"),
    aHint: "return `${title} at ${company}`;",
    aTest: lines(
      "if (typeof jobCard !== 'function') throw new Error('jobCard not found');",
      "if (jobCard({ title: 'Developer', company: 'Infosys' }) !== 'Developer at Infosys') throw new Error('Expected Developer at Infosys');"
    )
  },
  {
    title: "Modules and Creating Your First React Project",
    desc: "Real apps are split into many files. import and export let one file use code from another. Today you also create your first React project with Vite and see it running in the browser. (Real world: every company React app starts with a project setup like this.)",
    syllabus: [
      "export and import: sharing code between files.",
      "npm and packages: installing tools other developers made.",
      "Creating a React app with Vite and running it with npm run dev."
    ],
    eTitle: "Count Jobs by Status",
    eDesc: "Write `countByStatus(jobs)` that returns an object counting each status. Example: two applied and one offer gives `{ applied: 2, offer: 1 }`.",
    eStarter: lines("function countByStatus(jobs) {", "  const counts = {};", "  for (const job of jobs) {", "    // add 1 to counts[job.status]", "  }", "  return counts;", "}"),
    eHint: "counts[job.status] = (counts[job.status] || 0) + 1;",
    eTest: lines(
      "if (typeof countByStatus !== 'function') throw new Error('countByStatus not found');",
      "const c = countByStatus([{ status: 'applied' }, { status: 'offer' }, { status: 'applied' }]);",
      "if (c.applied !== 2 || c.offer !== 1) throw new Error('Expected { applied: 2, offer: 1 }');"
    ),
    aTitle: "Add a Job",
    aDesc: "Write `addJob(jobs, job)` that returns a NEW array with the job added at the end. Do not change the original array.",
    aStarter: lines("function addJob(jobs, job) {", "  // use spread: [...jobs, job]", "}"),
    aHint: "return [...jobs, job];",
    aTest: lines(
      "if (typeof addJob !== 'function') throw new Error('addJob not found');",
      "const list = [{ id: 1 }];",
      "const r = addJob(list, { id: 2 });",
      "if (r.length !== 2 || r[1].id !== 2) throw new Error('New list should have 2 jobs');",
      "if (list.length !== 1) throw new Error('The original list was changed. Return a new array.');"
    )
  },

  // ── WEEK 2: React basics ───────────────────────────────────────────────────
  {
    title: "Your First Component and JSX",
    desc: "A component is a JavaScript function that returns a piece of screen. JSX lets you write that screen in an HTML-like way inside JavaScript. You build a whole app by putting small components together, like LEGO blocks. (Real world: a 'Like' button is one component used thousands of times.)",
    syllabus: [
      "Components: functions that return what should appear on screen.",
      "JSX rules: one parent element, className instead of class, {} for JavaScript values.",
      "Putting components inside other components."
    ],
    eTitle: "Greeting Component",
    eDesc: "Components return screen content. Here we practise the idea with text: write `Greeting(props)` that returns `'<h1>Hello, NAME</h1>'` using `props.name`.",
    eStarter: lines("function Greeting(props) {", "  // return a template string with an h1", "}"),
    eHint: "return `<h1>Hello, ${props.name}</h1>`;",
    eTest: lines(
      "if (typeof Greeting !== 'function') throw new Error('Greeting not found');",
      "if (Greeting({ name: 'Asha' }) !== '<h1>Hello, Asha</h1>') throw new Error('Expected <h1>Hello, Asha</h1>');"
    ),
    aTitle: "Job Item Component",
    aDesc: "Write `JobItem({ title, company })` that returns `'<li>TITLE - COMPANY</li>'`.",
    aStarter: lines("function JobItem({ title, company }) {", "  // return an li with title - company", "}"),
    aHint: "return `<li>${title} - ${company}</li>`;",
    aTest: lines(
      "if (typeof JobItem !== 'function') throw new Error('JobItem not found');",
      "if (JobItem({ title: 'Dev', company: 'TCS' }) !== '<li>Dev - TCS</li>') throw new Error('Expected <li>Dev - TCS</li>');"
    )
  },
  {
    title: "Props: Passing Data to Components",
    desc: "Props are the inputs of a component, like the details you fill on a form before printing it. The parent component passes props, and the child uses them to decide what to show. The same component can show different data each time. (Real world: one ProductCard component shows every product on Amazon.)",
    syllabus: [
      "Passing props: <JobCard title='Developer' />.",
      "Reading props with destructuring and giving default values.",
      "Props only flow down, from parent to child."
    ],
    eTitle: "Button With a Default Colour",
    eDesc: "Write `Button({ label, color = 'blue' })` that returns `'<button class=\"COLOR\">LABEL</button>'`. If no colour is given, use blue.",
    eStarter: lines("function Button({ label, color = 'blue' }) {", "  // return the button text", "}"),
    eHint: "return `<button class=\"${color}\">${label}</button>`;",
    eTest: lines(
      "if (typeof Button !== 'function') throw new Error('Button not found');",
      "if (Button({ label: 'Save' }) !== '<button class=\"blue\">Save</button>') throw new Error('Default colour should be blue');",
      "if (Button({ label: 'Delete', color: 'red' }) !== '<button class=\"red\">Delete</button>') throw new Error('Given colour should be used');"
    ),
    aTitle: "Badge Text",
    aDesc: "Write `badgeText({ count })` that returns `'No new jobs'` when count is 0, otherwise `'COUNT new jobs'`.",
    aStarter: lines("function badgeText({ count }) {", "  // check if count is 0", "}"),
    aHint: "return count === 0 ? 'No new jobs' : `${count} new jobs`;",
    aTest: lines(
      "if (typeof badgeText !== 'function') throw new Error('badgeText not found');",
      "if (badgeText({ count: 0 }) !== 'No new jobs') throw new Error('0 should say No new jobs');",
      "if (badgeText({ count: 3 }) !== '3 new jobs') throw new Error('3 should say 3 new jobs');"
    )
  },
  {
    title: "Showing Lists with map and key",
    desc: "To show a list in React, you map an array of data to an array of components. Each item needs a unique key so React can keep track of which item is which when the list changes. (Real world: your WhatsApp chat list is an array mapped to chat rows.)",
    syllabus: [
      "jobs.map(job => <JobCard ... />) to show a list.",
      "Why every list item needs a unique key.",
      "Showing a message when the list is empty."
    ],
    eTitle: "Build a List",
    eDesc: "Write `renderList(items)` that returns `'<ul>'` + one `'<li>ITEM</li>'` per item + `'</ul>'`.",
    eStarter: lines("function renderList(items) {", "  const rows = items.map(item => `<li>${item}</li>`);", "  // join the rows and wrap them in ul", "}"),
    eHint: "return '<ul>' + rows.join('') + '</ul>';",
    eTest: lines(
      "if (typeof renderList !== 'function') throw new Error('renderList not found');",
      "if (renderList(['a', 'b']) !== '<ul><li>a</li><li>b</li></ul>') throw new Error('Expected <ul><li>a</li><li>b</li></ul>');",
      "if (renderList([]) !== '<ul></ul>') throw new Error('Empty list should be <ul></ul>');"
    ),
    aTitle: "Are the Keys Unique?",
    aDesc: "Write `hasUniqueIds(jobs)` that returns `true` if no two jobs have the same `id`.",
    aStarter: lines("function hasUniqueIds(jobs) {", "  const seen = new Set();", "  // loop, and return false if an id was already seen", "  return true;", "}"),
    aHint: "for (const job of jobs) { if (seen.has(job.id)) return false; seen.add(job.id); }",
    aTest: lines(
      "if (typeof hasUniqueIds !== 'function') throw new Error('hasUniqueIds not found');",
      "if (hasUniqueIds([{ id: 1 }, { id: 2 }]) !== true) throw new Error('1 and 2 are unique');",
      "if (hasUniqueIds([{ id: 1 }, { id: 1 }]) !== false) throw new Error('1 and 1 are not unique');"
    )
  },
  {
    title: "Showing Things Only When Needed",
    desc: "Apps show different things in different situations: a loading spinner while waiting, a message when a list is empty, a badge when there is an offer. In React you do this with if, &&, and the ? : operator. (Real world: Gmail shows 'No new mail' only when the inbox is empty.)",
    syllabus: [
      "Using if to return different screens.",
      "condition && <Thing /> to show something only when true.",
      "condition ? <A /> : <B /> to choose between two things."
    ],
    eTitle: "Empty or Not",
    eDesc: "Write `statusMessage(jobs)` that returns `'No jobs yet. Add your first one!'` for an empty list, otherwise `'You have N jobs'`.",
    eStarter: lines("function statusMessage(jobs) {", "  // check jobs.length", "}"),
    eHint: "if (jobs.length === 0) return 'No jobs yet. Add your first one!'; return `You have ${jobs.length} jobs`;",
    eTest: lines(
      "if (typeof statusMessage !== 'function') throw new Error('statusMessage not found');",
      "if (statusMessage([]) !== 'No jobs yet. Add your first one!') throw new Error('Wrong empty message');",
      "if (statusMessage([{}, {}]) !== 'You have 2 jobs') throw new Error('Expected You have 2 jobs');"
    ),
    aTitle: "Offer Badge",
    aDesc: "Write `offerBadge(status)` that returns `'Offer!'` when status is `'offer'`, otherwise `null` (show nothing).",
    aStarter: lines("function offerBadge(status) {", "  // use ? :", "}"),
    aHint: "return status === 'offer' ? 'Offer!' : null;",
    aTest: lines(
      "if (typeof offerBadge !== 'function') throw new Error('offerBadge not found');",
      "if (offerBadge('offer') !== 'Offer!') throw new Error('offer should give Offer!');",
      "if (offerBadge('applied') !== null) throw new Error('applied should give null');"
    )
  },
  {
    title: "State with useState: Making the Screen Change",
    desc: "State is a component's memory. When state changes, React redraws the screen with the new value. useState gives you the current value and a function to change it. (Real world: the item count in your cart is state.)",
    syllabus: [
      "const [count, setCount] = useState(0): value and setter.",
      "Why you must call the setter instead of changing the value directly.",
      "Updating from the previous value: setCount(c => c + 1)."
    ],
    eTitle: "Counter Logic",
    eDesc: "Write `nextCount(count, action)` that returns count + 1 for `'plus'`, count - 1 for `'minus'`, but never goes below 0.",
    eStarter: lines("function nextCount(count, action) {", "  // handle 'plus' and 'minus'", "}"),
    eHint: "if (action === 'plus') return count + 1; if (action === 'minus') return Math.max(0, count - 1); return count;",
    eTest: lines(
      "if (typeof nextCount !== 'function') throw new Error('nextCount not found');",
      "if (nextCount(2, 'plus') !== 3) throw new Error('2 plus should be 3');",
      "if (nextCount(2, 'minus') !== 1) throw new Error('2 minus should be 1');",
      "if (nextCount(0, 'minus') !== 0) throw new Error('Count must not go below 0');"
    ),
    aTitle: "Toggle",
    aDesc: "Write `toggle(value)` that returns the opposite true/false value. This is how a show/hide button works.",
    aStarter: lines("function toggle(value) {", "  // return the opposite", "}"),
    aHint: "return !value;",
    aTest: lines(
      "if (typeof toggle !== 'function') throw new Error('toggle not found');",
      "if (toggle(true) !== false || toggle(false) !== true) throw new Error('toggle should flip true and false');"
    )
  },
  {
    title: "Handling Clicks and Typing",
    desc: "Events are things the user does: clicking, typing, submitting. You give React a function to run when the event happens, like onClick={handleClick}. Inside it you usually update state. (Real world: pressing 'Like' runs a click handler that updates the like count.)",
    syllabus: [
      "onClick, onChange and onSubmit.",
      "Passing a function, not calling it: onClick={handleClick}.",
      "The event object: reading e.target.value and calling e.preventDefault()."
    ],
    eTitle: "Is It the Enter Key?",
    eDesc: "Write `isEnterKey(event)` that returns `true` when `event.key` is `'Enter'`.",
    eStarter: lines("function isEnterKey(event) {", "  // compare event.key with 'Enter'", "}"),
    eHint: "return event.key === 'Enter';",
    eTest: lines(
      "if (typeof isEnterKey !== 'function') throw new Error('isEnterKey not found');",
      "if (isEnterKey({ key: 'Enter' }) !== true) throw new Error('Enter should be true');",
      "if (isEnterKey({ key: 'a' }) !== false) throw new Error('a should be false');"
    ),
    aTitle: "Like Button Logic",
    aDesc: "Write `clickLike(post)` that returns a new post object. If `post.liked` is false, set liked to true and add 1 to likes. If it is true, set liked to false and subtract 1.",
    aStarter: lines("function clickLike(post) {", "  // return { ...post, liked: ..., likes: ... }", "}"),
    aHint: "return post.liked ? { ...post, liked: false, likes: post.likes - 1 } : { ...post, liked: true, likes: post.likes + 1 };",
    aTest: lines(
      "if (typeof clickLike !== 'function') throw new Error('clickLike not found');",
      "const a = clickLike({ liked: false, likes: 5 });",
      "if (a.liked !== true || a.likes !== 6) throw new Error('Liking should give liked true and 6 likes');",
      "const b = clickLike(a);",
      "if (b.liked !== false || b.likes !== 5) throw new Error('Unliking should give liked false and 5 likes');"
    )
  },
  {
    title: "Forms: Getting Input From the User",
    desc: "Forms let users type information, like adding a new job. In React, the input's value lives in state (a 'controlled input'), so you always know what the user typed and can check it before saving. (Real world: sign-up forms show 'Email is required' before you submit.)",
    syllabus: [
      "Controlled inputs: value={title} and onChange={e => setTitle(e.target.value)}.",
      "One state object for the whole form.",
      "Checking the form and showing error messages."
    ],
    eTitle: "Check the Job Form",
    eDesc: "Write `validateJobForm(form)` that returns an array of errors: add `'Title is required'` if title is empty and `'Company is required'` if company is empty. Return `[]` if both are filled.",
    eStarter: lines("function validateJobForm(form) {", "  const errors = [];", "  // push error messages here", "  return errors;", "}"),
    eHint: "if (!form.title) errors.push('Title is required'); if (!form.company) errors.push('Company is required');",
    eTest: lines(
      "if (typeof validateJobForm !== 'function') throw new Error('validateJobForm not found');",
      "const e1 = validateJobForm({ title: '', company: '' });",
      "if (e1.length !== 2 || e1[0] !== 'Title is required' || e1[1] !== 'Company is required') throw new Error('Both errors expected');",
      "if (validateJobForm({ title: 'Dev', company: 'TCS' }).length !== 0) throw new Error('A full form should have no errors');"
    ),
    aTitle: "Update One Field",
    aDesc: "Write `updateField(form, name, value)` that returns a new form object with only that field changed. Example: `updateField({ title: '' }, 'title', 'Dev')` gives `{ title: 'Dev' }`.",
    aStarter: lines("function updateField(form, name, value) {", "  // use ...form and [name]: value", "}"),
    aHint: "return { ...form, [name]: value };",
    aTest: lines(
      "if (typeof updateField !== 'function') throw new Error('updateField not found');",
      "const f = { title: '', company: 'TCS' };",
      "const r = updateField(f, 'title', 'Dev');",
      "if (r.title !== 'Dev' || r.company !== 'TCS') throw new Error('Only title should change');",
      "if (f.title !== '') throw new Error('The original form was changed');"
    )
  },

  // ── WEEK 3: Real-app skills ────────────────────────────────────────────────
  {
    title: "Sharing Data Between Components",
    desc: "When two components need the same data, you keep the state in their closest parent and pass it down as props. Children tell the parent about changes by calling functions passed as props. This is called 'lifting state up'. (Real world: the cart count in the header and the cart page share the same data.)",
    syllabus: [
      "Where state should live: in the closest common parent.",
      "Passing functions like onDelete down as props.",
      "Updating a list: add, remove and change items."
    ],
    eTitle: "Remove a Job",
    eDesc: "Write `removeJob(jobs, id)` that returns a new list without the job with that id.",
    eStarter: lines("function removeJob(jobs, id) {", "  // use filter", "}"),
    eHint: "return jobs.filter(job => job.id !== id);",
    eTest: lines(
      "if (typeof removeJob !== 'function') throw new Error('removeJob not found');",
      "const r = removeJob([{ id: 1 }, { id: 2 }, { id: 3 }], 2);",
      "if (r.length !== 2 || r.some(j => j.id === 2)) throw new Error('Job 2 should be removed');"
    ),
    aTitle: "Change a Job's Status",
    aDesc: "Write `changeJobStatus(jobs, id, status)` that returns a new list where only the job with that id has the new status.",
    aStarter: lines("function changeJobStatus(jobs, id, status) {", "  // use map; change only the matching job", "}"),
    aHint: "return jobs.map(job => job.id === id ? { ...job, status } : job);",
    aTest: lines(
      "if (typeof changeJobStatus !== 'function') throw new Error('changeJobStatus not found');",
      "const jobs = [{ id: 1, status: 'applied' }, { id: 2, status: 'applied' }];",
      "const r = changeJobStatus(jobs, 2, 'interview');",
      "if (r[1].status !== 'interview' || r[0].status !== 'applied') throw new Error('Only job 2 should change');",
      "if (jobs[1].status !== 'applied') throw new Error('The original list was changed');"
    )
  },
  {
    title: "useEffect: Doing Things After the Screen Shows",
    desc: "Some work should happen after the screen appears: loading data, starting a timer, or saving to the browser. useEffect runs your code after React draws the screen, and the dependency list decides when it runs again. (Real world: a page loads your notifications right after it opens.)",
    syllabus: [
      "useEffect(() => { ... }, []) runs once after the first show.",
      "Dependencies: run again when a value changes.",
      "Clean-up: stopping timers when the component goes away."
    ],
    eTitle: "Should It Load Again?",
    eDesc: "Write `shouldReload(prevSearch, search)` that returns `true` when the search text changed.",
    eStarter: lines("function shouldReload(prevSearch, search) {", "  // compare the two values", "}"),
    eHint: "return prevSearch !== search;",
    eTest: lines(
      "if (typeof shouldReload !== 'function') throw new Error('shouldReload not found');",
      "if (shouldReload('dev', 'devops') !== true) throw new Error('Changed search should reload');",
      "if (shouldReload('dev', 'dev') !== false) throw new Error('Same search should not reload');"
    ),
    aTitle: "Timer Display",
    aDesc: "Write `formatTimer(seconds)` that returns `'MM:SS'` with two digits each. Example: 75 gives `'01:15'`.",
    aStarter: lines("function formatTimer(seconds) {", "  const m = Math.floor(seconds / 60);", "  const s = seconds % 60;", "  // pad both with padStart(2, '0')", "}"),
    aHint: "return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');",
    aTest: lines(
      "if (typeof formatTimer !== 'function') throw new Error('formatTimer not found');",
      "if (formatTimer(75) !== '01:15') throw new Error('75 should be 01:15');",
      "if (formatTimer(5) !== '00:05') throw new Error('5 should be 00:05');"
    )
  },
  {
    title: "Loading Data From the Internet",
    desc: "Most apps get their data from a server through an API. fetch asks the server for data, and async/await lets you wait for the answer without freezing the app. You also need to show 'Loading...' and handle errors. (Real world: a weather app fetches today's forecast from an API.)",
    syllabus: [
      "fetch and JSON: asking a server for data.",
      "async and await: waiting for the answer.",
      "Loading, error and success: the three states of every request."
    ],
    eTitle: "Read the Server's Answer",
    eDesc: "Servers often answer like `{ data: [...] }`. Write `parseJobsResponse(json)` that returns `json.data`, or `[]` if data is missing.",
    eStarter: lines("function parseJobsResponse(json) {", "  // return json.data, or [] if it is missing", "}"),
    eHint: "return (json && json.data) || [];",
    eTest: lines(
      "if (typeof parseJobsResponse !== 'function') throw new Error('parseJobsResponse not found');",
      "if (parseJobsResponse({ data: [1, 2] }).length !== 2) throw new Error('Should return data');",
      "if (!Array.isArray(parseJobsResponse({})) || parseJobsResponse({}).length !== 0) throw new Error('Missing data should give []');"
    ),
    aTitle: "Request State",
    aDesc: "Write `requestView(status)` that returns `'Loading...'` for `'loading'`, `'Something went wrong'` for `'error'`, and `'Done'` for `'success'`.",
    aStarter: lines("function requestView(status) {", "  // one if for each status", "}"),
    aHint: "if (status === 'loading') return 'Loading...'; if (status === 'error') return 'Something went wrong'; return 'Done';",
    aTest: lines(
      "if (typeof requestView !== 'function') throw new Error('requestView not found');",
      "if (requestView('loading') !== 'Loading...') throw new Error('loading is wrong');",
      "if (requestView('error') !== 'Something went wrong') throw new Error('error is wrong');",
      "if (requestView('success') !== 'Done') throw new Error('success is wrong');"
    )
  },
  {
    title: "Styling and Layouts That Work on Phones",
    desc: "A good app looks clean and works on every screen size. You will style components with CSS classes, use flexbox and grid for layout, and use Tailwind CSS, which many companies use. (Real world: Flipkart shows 2 products per row on phones and 5 on laptops.)",
    syllabus: [
      "className and CSS files in React.",
      "Flexbox and grid for layout.",
      "Tailwind CSS basics and responsive sizes."
    ],
    eTitle: "Join Class Names",
    eDesc: "Write `classNames(...names)` that joins only the non-empty names with a space. Example: `classNames('card', '', 'active')` gives `'card active'`.",
    eStarter: lines("function classNames(...names) {", "  // filter out empty values, then join with ' '", "}"),
    eHint: "return names.filter(Boolean).join(' ');",
    eTest: lines(
      "if (typeof classNames !== 'function') throw new Error('classNames not found');",
      "if (classNames('card', '', 'active') !== 'card active') throw new Error('Expected card active');",
      "if (classNames('card', false, null) !== 'card') throw new Error('Expected card');"
    ),
    aTitle: "Columns for Screen Size",
    aDesc: "Write `columnsFor(width)` that returns 1 when width is below 600, 2 when below 1000, otherwise 3.",
    aStarter: lines("function columnsFor(width) {", "  // check the smallest size first", "}"),
    aHint: "if (width < 600) return 1; if (width < 1000) return 2; return 3;",
    aTest: lines(
      "if (typeof columnsFor !== 'function') throw new Error('columnsFor not found');",
      "if (columnsFor(375) !== 1 || columnsFor(800) !== 2 || columnsFor(1366) !== 3) throw new Error('Wrong column count');"
    )
  },
  {
    title: "Multiple Pages with React Router",
    desc: "Real apps have many pages: home, list, details, settings. React Router shows the right page for each web address without reloading the whole site, and lets you read values from the address like a job's id. (Real world: amazon.in/dp/ID opens the page for one product.)",
    syllabus: [
      "Routes: which component to show for which address.",
      "Link: moving between pages without reloading.",
      "URL parameters: reading /jobs/42 to get the id 42."
    ],
    eTitle: "Which Page?",
    eDesc: "Write `matchRoute(path)` that returns `'home'` for `'/'`, `'jobs'` for `'/jobs'`, `'job-detail'` for `'/jobs/'` followed by an id, otherwise `'not-found'`.",
    eStarter: lines("function matchRoute(path) {", "  // check each address", "}"),
    eHint: "if (path === '/') return 'home'; if (path === '/jobs') return 'jobs'; if (/^\\/jobs\\/[^/]+$/.test(path)) return 'job-detail'; return 'not-found';",
    eTest: lines(
      "if (typeof matchRoute !== 'function') throw new Error('matchRoute not found');",
      "if (matchRoute('/') !== 'home') throw new Error('/ should be home');",
      "if (matchRoute('/jobs') !== 'jobs') throw new Error('/jobs should be jobs');",
      "if (matchRoute('/jobs/42') !== 'job-detail') throw new Error('/jobs/42 should be job-detail');",
      "if (matchRoute('/xyz') !== 'not-found') throw new Error('/xyz should be not-found');"
    ),
    aTitle: "Read the Job Id",
    aDesc: "Write `jobIdFromPath(path)` that returns the id from `'/jobs/ID'`, or `null` for any other address.",
    aStarter: lines("function jobIdFromPath(path) {", "  const parts = path.split('/');", "  // parts for '/jobs/42' are ['', 'jobs', '42']", "}"),
    aHint: "return parts.length === 3 && parts[1] === 'jobs' && parts[2] ? parts[2] : null;",
    aTest: lines(
      "if (typeof jobIdFromPath !== 'function') throw new Error('jobIdFromPath not found');",
      "if (jobIdFromPath('/jobs/42') !== '42') throw new Error('Expected 42');",
      "if (jobIdFromPath('/jobs') !== null) throw new Error('Expected null for /jobs');"
    )
  },
  {
    title: "Custom Hooks: Reusing Logic",
    desc: "When several components need the same logic, like searching a list or saving to the browser, you move it into your own hook: a function whose name starts with 'use'. This keeps components short and clean. (Real world: a useCart hook used by every page that shows the cart.)",
    syllabus: [
      "Rules of hooks: call them at the top of components.",
      "Writing a custom hook like useSearch or useLocalStorage.",
      "Returning values and functions from a hook."
    ],
    eTitle: "Search Jobs",
    eDesc: "Write `searchJobs(jobs, text)` that returns jobs whose title contains the text, ignoring upper/lower case. Empty text returns all jobs.",
    eStarter: lines("function searchJobs(jobs, text) {", "  const q = text.toLowerCase();", "  // filter titles that include q", "}"),
    eHint: "return jobs.filter(job => job.title.toLowerCase().includes(q));",
    eTest: lines(
      "if (typeof searchJobs !== 'function') throw new Error('searchJobs not found');",
      "const jobs = [{ title: 'React Developer' }, { title: 'Java Developer' }, { title: 'Tester' }];",
      "if (searchJobs(jobs, 'react').length !== 1) throw new Error('react should match 1 job');",
      "if (searchJobs(jobs, 'DEVELOPER').length !== 2) throw new Error('DEVELOPER should match 2 jobs');",
      "if (searchJobs(jobs, '').length !== 3) throw new Error('Empty text should return all jobs');"
    ),
    aTitle: "A Counter Maker",
    aDesc: "Write `createCounter(start)` that returns an object with `increment()` (adds 1) and `value()` (returns the current number). This is how a hook keeps its own value.",
    aStarter: lines("function createCounter(start) {", "  let count = start;", "  return {", "    // increment and value functions", "  };", "}"),
    aHint: "return { increment: () => { count = count + 1; }, value: () => count };",
    aTest: lines(
      "if (typeof createCounter !== 'function') throw new Error('createCounter not found');",
      "const c = createCounter(5);",
      "c.increment(); c.increment();",
      "if (c.value() !== 7) throw new Error('Expected 7 after two increments');"
    )
  },
  {
    title: "Context: Sharing Data With the Whole App",
    desc: "Some data is needed almost everywhere: the logged-in user, the theme, the language. Passing it through every component is tiring, so React Context lets any component read it directly. (Real world: the dark mode switch changes every screen of an app.)",
    syllabus: [
      "createContext and the Provider.",
      "useContext to read shared data.",
      "When to use Context and when props are enough."
    ],
    eTitle: "Theme Colours",
    eDesc: "Write `themeColors(theme)` that returns `{ background: '#ffffff', text: '#111111' }` for `'light'` and `{ background: '#111111', text: '#ffffff' }` for `'dark'`.",
    eStarter: lines("function themeColors(theme) {", "  // return one object for dark, another for light", "}"),
    eHint: "return theme === 'dark' ? { background: '#111111', text: '#ffffff' } : { background: '#ffffff', text: '#111111' };",
    eTest: lines(
      "if (typeof themeColors !== 'function') throw new Error('themeColors not found');",
      "const d = themeColors('dark'); const l = themeColors('light');",
      "if (d.background !== '#111111' || d.text !== '#ffffff') throw new Error('Dark colours are wrong');",
      "if (l.background !== '#ffffff' || l.text !== '#111111') throw new Error('Light colours are wrong');"
    ),
    aTitle: "Can This User Edit?",
    aDesc: "Write `canEdit(user, job)` that returns `true` only when a user is logged in and `user.id` equals `job.ownerId`.",
    aStarter: lines("function canEdit(user, job) {", "  // user may be null when logged out", "}"),
    aHint: "return Boolean(user) && user.id === job.ownerId;",
    aTest: lines(
      "if (typeof canEdit !== 'function') throw new Error('canEdit not found');",
      "if (canEdit({ id: 1 }, { ownerId: 1 }) !== true) throw new Error('Owner should be able to edit');",
      "if (canEdit({ id: 2 }, { ownerId: 1 }) !== false) throw new Error('Other users should not edit');",
      "if (canEdit(null, { ownerId: 1 }) !== false) throw new Error('Logged-out users should not edit');"
    )
  },

  // ── WEEK 4: Build, ship and get job-ready ──────────────────────────────────
  {
    title: "Git and GitHub: Saving and Sharing Your Code",
    desc: "Every developer job uses Git. It saves snapshots of your code (commits), lets you try ideas on branches, and GitHub stores your code online so others can see it. Recruiters look at your GitHub. (Real world: every change to this app is a Git commit.)",
    syllabus: [
      "git init, add, commit: saving snapshots.",
      "Branches: working on a feature safely.",
      "Pushing to GitHub and writing good commit messages."
    ],
    eTitle: "Good Commit Message",
    eDesc: "Write `isGoodCommitMessage(msg)` that returns `true` when the message is between 10 and 72 characters long.",
    eStarter: lines("function isGoodCommitMessage(msg) {", "  // check msg.length", "}"),
    eHint: "return msg.length >= 10 && msg.length <= 72;",
    eTest: lines(
      "if (typeof isGoodCommitMessage !== 'function') throw new Error('isGoodCommitMessage not found');",
      "if (isGoodCommitMessage('Add job form validation') !== true) throw new Error('A clear message should be good');",
      "if (isGoodCommitMessage('fix') !== false) throw new Error('fix is too short');"
    ),
    aTitle: "Branch Name",
    aDesc: "Write `branchName(task)` that turns `'Add Login Page'` into `'feature/add-login-page'` (lower case, spaces become dashes).",
    aStarter: lines("function branchName(task) {", "  // lower case, then replace spaces with -", "}"),
    aHint: "return 'feature/' + task.trim().toLowerCase().split(' ').join('-');",
    aTest: lines(
      "if (typeof branchName !== 'function') throw new Error('branchName not found');",
      "if (branchName('Add Login Page') !== 'feature/add-login-page') throw new Error('Expected feature/add-login-page');"
    )
  },
  {
    title: "Planning Your Job Tracker App",
    desc: "Before coding, good developers plan: what screens are needed, which components make each screen, what data each needs, and where the state lives. Today you plan the Job Tracker you will build and deploy this week. (Real world: teams draw screens and components before writing code.)",
    syllabus: [
      "Breaking a screen into components.",
      "Deciding the data shape of a job.",
      "Deciding where state lives."
    ],
    eTitle: "Newest First",
    eDesc: "Write `sortByNewest(jobs)` that returns a new list sorted by `appliedOn` (dates like `'2026-09-01'`), newest first. Do not change the original list.",
    eStarter: lines("function sortByNewest(jobs) {", "  // copy with [...jobs], then sort", "}"),
    eHint: "return [...jobs].sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));",
    eTest: lines(
      "if (typeof sortByNewest !== 'function') throw new Error('sortByNewest not found');",
      "const jobs = [{ id: 1, appliedOn: '2026-09-01' }, { id: 2, appliedOn: '2026-09-20' }, { id: 3, appliedOn: '2026-09-10' }];",
      "const r = sortByNewest(jobs);",
      "if (r[0].id !== 2 || r[1].id !== 3 || r[2].id !== 1) throw new Error('Expected ids 2, 3, 1');",
      "if (jobs[0].id !== 1) throw new Error('The original list was changed');"
    ),
    aTitle: "Group by Status",
    aDesc: "Write `groupByStatus(jobs)` that returns an object like `{ applied: [...], interview: [...] }`.",
    aStarter: lines("function groupByStatus(jobs) {", "  const groups = {};", "  // add each job to groups[job.status]", "  return groups;", "}"),
    aHint: "for (const job of jobs) { if (!groups[job.status]) groups[job.status] = []; groups[job.status].push(job); }",
    aTest: lines(
      "if (typeof groupByStatus !== 'function') throw new Error('groupByStatus not found');",
      "const g = groupByStatus([{ id: 1, status: 'applied' }, { id: 2, status: 'offer' }, { id: 3, status: 'applied' }]);",
      "if (g.applied.length !== 2 || g.offer.length !== 1) throw new Error('Expected 2 applied and 1 offer');"
    )
  },
  {
    title: "Project Build 1: Layout and Components",
    desc: "Today you build the skeleton of the Job Tracker: a header, a summary bar, and a job list made of JobCard components, using sample data. (Real world: most apps start with a static version before adding logic.)",
    syllabus: [
      "App layout: Header, Summary and JobList components.",
      "JobCard with props.",
      "Summary numbers calculated from the job list."
    ],
    eTitle: "Summary Numbers",
    eDesc: "Write `jobStats(jobs)` that returns `{ total, interviews, offers }`.",
    eStarter: lines("function jobStats(jobs) {", "  // count all jobs, interview jobs and offer jobs", "}"),
    eHint: "return { total: jobs.length, interviews: jobs.filter(j => j.status === 'interview').length, offers: jobs.filter(j => j.status === 'offer').length };",
    eTest: lines(
      "if (typeof jobStats !== 'function') throw new Error('jobStats not found');",
      "const s = jobStats([{ status: 'applied' }, { status: 'interview' }, { status: 'offer' }, { status: 'interview' }]);",
      "if (s.total !== 4 || s.interviews !== 2 || s.offers !== 1) throw new Error('Expected total 4, interviews 2, offers 1');"
    ),
    aTitle: "Status Label",
    aDesc: "Write `statusLabel(status)` that returns `'Applied'`, `'Interview'`, `'Offer'` or `'Rejected'` for the matching lower-case status, and `'Unknown'` otherwise.",
    aStarter: lines("function statusLabel(status) {", "  const labels = { applied: 'Applied' /* add the rest */ };", "  // return the label or 'Unknown'", "}"),
    aHint: "const labels = { applied: 'Applied', interview: 'Interview', offer: 'Offer', rejected: 'Rejected' }; return labels[status] || 'Unknown';",
    aTest: lines(
      "if (typeof statusLabel !== 'function') throw new Error('statusLabel not found');",
      "if (statusLabel('offer') !== 'Offer' || statusLabel('rejected') !== 'Rejected') throw new Error('Wrong label');",
      "if (statusLabel('xyz') !== 'Unknown') throw new Error('Unknown status should give Unknown');"
    )
  },
  {
    title: "Project Build 2: Adding Jobs and Filters",
    desc: "Today the Job Tracker comes alive: a form to add a job, buttons to change status, a delete button, and filter tabs (All, Applied, Interview, Offer). (Real world: this is the core of every to-do or tracker app.)",
    syllabus: [
      "The Add Job form with validation.",
      "Changing status and deleting jobs.",
      "Filter tabs using state."
    ],
    eTitle: "Create a Job From the Form",
    eDesc: "Write `createJob(form, id, today)` that returns `{ id, title, company, status: 'applied', appliedOn: today }` with extra spaces removed from title and company.",
    eStarter: lines("function createJob(form, id, today) {", "  // use .trim() on title and company", "}"),
    eHint: "return { id, title: form.title.trim(), company: form.company.trim(), status: 'applied', appliedOn: today };",
    eTest: lines(
      "if (typeof createJob !== 'function') throw new Error('createJob not found');",
      "const j = createJob({ title: '  Dev ', company: ' TCS' }, 7, '2026-09-28');",
      "if (j.id !== 7 || j.title !== 'Dev' || j.company !== 'TCS') throw new Error('id, title or company is wrong');",
      "if (j.status !== 'applied' || j.appliedOn !== '2026-09-28') throw new Error('status or date is wrong');"
    ),
    aTitle: "Filter Tabs",
    aDesc: "Write `filterJobs(jobs, tab)` that returns all jobs when tab is `'all'`, otherwise only jobs with that status.",
    aStarter: lines("function filterJobs(jobs, tab) {", "  // 'all' means no filter", "}"),
    aHint: "return tab === 'all' ? jobs : jobs.filter(j => j.status === tab);",
    aTest: lines(
      "if (typeof filterJobs !== 'function') throw new Error('filterJobs not found');",
      "const jobs = [{ status: 'applied' }, { status: 'offer' }];",
      "if (filterJobs(jobs, 'all').length !== 2) throw new Error('all should return 2');",
      "if (filterJobs(jobs, 'offer').length !== 1) throw new Error('offer should return 1');"
    )
  },
  {
    title: "Project Build 3: Saving Data and a Details Page",
    desc: "Today your jobs stay saved after a refresh using the browser's localStorage, sample companies load from an API, and each job gets its own details page with React Router. (Real world: apps remember your settings between visits.)",
    syllabus: [
      "Saving and loading with localStorage and useEffect.",
      "Loading data from an API with loading and error states.",
      "A job details page using the URL id."
    ],
    eTitle: "Safe Load",
    eDesc: "Saved data can be broken. Write `loadJobs(text)` that turns JSON text into an array, and returns `[]` if the text is empty, broken, or not an array.",
    eStarter: lines("function loadJobs(text) {", "  try {", "    // JSON.parse the text", "  } catch (e) {", "    return [];", "  }", "}"),
    eHint: "const data = JSON.parse(text); return Array.isArray(data) ? data : [];",
    eTest: lines(
      "if (typeof loadJobs !== 'function') throw new Error('loadJobs not found');",
      "if (loadJobs('[{\"id\":1}]').length !== 1) throw new Error('Valid text should load 1 job');",
      "if (loadJobs('broken{').length !== 0) throw new Error('Broken text should give []');",
      "if (loadJobs('{\"a\":1}').length !== 0) throw new Error('A non-array should give []');",
      "if (loadJobs('').length !== 0) throw new Error('Empty text should give []');"
    ),
    aTitle: "Find a Job by Id",
    aDesc: "The details page gets the id from the address as text. Write `findJob(jobs, idText)` that returns the job whose id equals `Number(idText)`, or `null`.",
    aStarter: lines("function findJob(jobs, idText) {", "  const id = Number(idText);", "  // use find, and return null if nothing matches", "}"),
    aHint: "return jobs.find(j => j.id === id) || null;",
    aTest: lines(
      "if (typeof findJob !== 'function') throw new Error('findJob not found');",
      "const jobs = [{ id: 1 }, { id: 2 }];",
      "if (!findJob(jobs, '2') || findJob(jobs, '2').id !== 2) throw new Error('Should find job 2');",
      "if (findJob(jobs, '9') !== null) throw new Error('Missing job should give null');"
    )
  },
  {
    title: "Debugging: Finding and Fixing Mistakes",
    desc: "Every developer spends a lot of time fixing bugs. Today you learn to read error messages, use console.log wisely, and use the browser's developer tools and React DevTools to see what is going on. (Real world: a junior developer's first tasks are usually bug fixes.)",
    syllabus: [
      "Reading an error message: what, where, and why.",
      "console.log and the browser DevTools.",
      "Common React mistakes and how to spot them."
    ],
    eTitle: "Fix the Bug",
    eDesc: "This function should add up the `salary` of all jobs, but it has a bug. Find it and fix it.",
    eStarter: lines("function totalSalary(jobs) {", "  let total = 0;", "  for (let i = 1; i < jobs.length; i++) {", "    total = total + jobs[i].salary;", "  }", "  return total;", "}"),
    eHint: "Arrays start at position 0, not 1.",
    eTest: lines(
      "if (typeof totalSalary !== 'function') throw new Error('totalSalary not found');",
      "if (totalSalary([{ salary: 100 }, { salary: 200 }, { salary: 300 }]) !== 600) throw new Error('Expected 600 but got ' + totalSalary([{ salary: 100 }, { salary: 200 }, { salary: 300 }]));"
    ),
    aTitle: "Find the Broken Record",
    aDesc: "Write `firstIncomplete(jobs)` that returns the first job with an empty or missing `company`, or `null` if all are fine.",
    aStarter: lines("function firstIncomplete(jobs) {", "  // use find", "}"),
    aHint: "return jobs.find(j => !j.company) || null;",
    aTest: lines(
      "if (typeof firstIncomplete !== 'function') throw new Error('firstIncomplete not found');",
      "const r = firstIncomplete([{ id: 1, company: 'TCS' }, { id: 2, company: '' }, { id: 3 }]);",
      "if (!r || r.id !== 2) throw new Error('Expected job 2');",
      "if (firstIncomplete([{ id: 1, company: 'TCS' }]) !== null) throw new Error('Expected null');"
    )
  },
  {
    title: "Testing Your Code",
    desc: "Tests are small programs that check your code works, so you can change things without fear. You will learn what a test is, write simple checks, and see how React Testing Library tests a component the way a user would use it. (Real world: companies run thousands of tests before every release.)",
    syllabus: [
      "What a test is: arrange, act, check.",
      "Writing checks with expect.",
      "React Testing Library: testing what the user sees."
    ],
    eTitle: "Email Check",
    eDesc: "Write `isValidEmail(email)` that returns `true` when the text has one `@` with text before it, and a `.` somewhere after it.",
    eStarter: lines("function isValidEmail(email) {", "  // a simple pattern is enough", "}"),
    eHint: "return /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email);",
    eTest: lines(
      "if (typeof isValidEmail !== 'function') throw new Error('isValidEmail not found');",
      "if (isValidEmail('asha@mail.com') !== true) throw new Error('asha@mail.com is valid');",
      "if (isValidEmail('asha.mail.com') !== false) throw new Error('No @ is not valid');",
      "if (isValidEmail('@mail.com') !== false) throw new Error('Nothing before @ is not valid');"
    ),
    aTitle: "Write Your Own Check",
    aDesc: "Write `expectEqual(actual, expected)` that returns `true` when they are equal, and throws an Error with the message `'Expected X but got Y'` when they are not.",
    aStarter: lines("function expectEqual(actual, expected) {", "  // throw new Error(...) when different", "}"),
    aHint: "if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`); return true;",
    aTest: lines(
      "if (typeof expectEqual !== 'function') throw new Error('expectEqual not found');",
      "if (expectEqual(2, 2) !== true) throw new Error('Equal values should return true');",
      "let threw = false; try { expectEqual(1, 2); } catch (e) { threw = String(e.message).includes('Expected 2 but got 1'); }",
      "if (!threw) throw new Error('Should throw Expected 2 but got 1');"
    )
  },
  {
    title: "Putting Your App Online",
    desc: "An app on your laptop helps nobody. Today you build the Job Tracker for production, deploy it to Vercel for free, and write a README so recruiters understand it. You finish with a live link for your resume. (Real world: every portfolio project should have a live link.)",
    syllabus: [
      "npm run build: making the production version.",
      "Deploying to Vercel from GitHub.",
      "Writing a good README with screenshots."
    ],
    eTitle: "Which Address?",
    eDesc: "Write `apiBaseUrl(env)` that returns `'https://jobtracker.vercel.app'` for `'production'` and `'http://localhost:5173'` for anything else.",
    eStarter: lines("function apiBaseUrl(env) {", "  // check if env is 'production'", "}"),
    eHint: "return env === 'production' ? 'https://jobtracker.vercel.app' : 'http://localhost:5173';",
    eTest: lines(
      "if (typeof apiBaseUrl !== 'function') throw new Error('apiBaseUrl not found');",
      "if (apiBaseUrl('production') !== 'https://jobtracker.vercel.app') throw new Error('Wrong production address');",
      "if (apiBaseUrl('development') !== 'http://localhost:5173') throw new Error('Wrong local address');"
    ),
    aTitle: "README Checker",
    aDesc: "Write `missingSections(readme)` that returns which of `'## About'`, `'## Features'`, `'## Setup'` are missing from the README text.",
    aStarter: lines("function missingSections(readme) {", "  const needed = ['## About', '## Features', '## Setup'];", "  // keep the ones readme does not include", "}"),
    aHint: "return needed.filter(s => !readme.includes(s));",
    aTest: lines(
      "if (typeof missingSections !== 'function') throw new Error('missingSections not found');",
      "const m = missingSections('# Job Tracker\\n## About\\nText\\n## Setup\\nnpm i');",
      "if (m.length !== 1 || m[0] !== '## Features') throw new Error('Only ## Features should be missing');"
    )
  },
  {
    title: "Interview Practice and Your Next Steps",
    desc: "You have built and deployed a real React app. Today you practise the questions junior React interviews ask, learn to explain your project clearly, and solve two classic coding questions. (Real world: most junior interviews include a short coding task and questions about your project.)",
    syllabus: [
      "Common React interview questions: state vs props, keys, useEffect.",
      "Explaining your project in 2 minutes.",
      "Solving small coding questions calmly."
    ],
    eTitle: "FizzBuzz",
    eDesc: "Write `fizzBuzz(n)` that returns `'FizzBuzz'` if n divides by 3 and 5, `'Fizz'` if by 3, `'Buzz'` if by 5, otherwise the number as text.",
    eStarter: lines("function fizzBuzz(n) {", "  // check 3 and 5 together first", "}"),
    eHint: "if (n % 15 === 0) return 'FizzBuzz'; if (n % 3 === 0) return 'Fizz'; if (n % 5 === 0) return 'Buzz'; return String(n);",
    eTest: lines(
      "if (typeof fizzBuzz !== 'function') throw new Error('fizzBuzz not found');",
      "if (fizzBuzz(15) !== 'FizzBuzz' || fizzBuzz(9) !== 'Fizz' || fizzBuzz(10) !== 'Buzz' || fizzBuzz(7) !== '7') throw new Error('Wrong FizzBuzz answer');"
    ),
    aTitle: "Reverse the Words",
    aDesc: "Write `reverseWords(sentence)` that reverses the order of the words. Example: `'I love React'` gives `'React love I'`.",
    aStarter: lines("function reverseWords(sentence) {", "  // split, reverse, join", "}"),
    aHint: "return sentence.split(' ').reverse().join(' ');",
    aTest: lines(
      "if (typeof reverseWords !== 'function') throw new Error('reverseWords not found');",
      "if (reverseWords('I love React') !== 'React love I') throw new Error('Expected React love I');"
    )
  }
];

export const REACT_30_DAYS_QUESTS = REACT_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('react-basics', i + 1, cfg)
);
