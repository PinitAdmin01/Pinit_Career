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
    title: "How a Website Works: Modern Web Architecture, Network Protocols & Browser Engine Internals",
    desc: "Master modern web architecture: TCP three-way handshakes, TLS session negotiation, HTTP pipelining vs multiplexing, V8 rendering pipelines, and Core Web Vitals telemetry.",
    syllabus: [
      "Network protocol stacks: DNS recursion, TCP handshakes, and TLS cryptographic session negotiation.",
      "HTTP evolution: HTTP/1.1 head-of-line blocking versus HTTP/2 binary framing and multiplexed streams.",
      "Browser rendering engines: HTML/CSS tokenization, DOM/CSSOM trees, layout geometry, and GPU compositing."
    ],
    eTitle: "App Title Formatter",
    eDesc: "Write a function `formatAppTitle(name)` that returns `'PinIT - '` followed by the app name. Example: `formatAppTitle('Job Tracker')` returns `'PinIT - Job Tracker'`.",
    eStarter: lines("function formatAppTitle(name) {", "  // Return 'PinIT - ' followed by name", "  return '';", "}"),
    eHint: "return 'PinIT - ' + name;",
    eTest: lines(
      "if (typeof formatAppTitle !== 'function') throw new Error('formatAppTitle not found');",
      "if (formatAppTitle('Job Tracker') !== 'PinIT - Job Tracker') throw new Error('Expected PinIT - Job Tracker');",
      "if (formatAppTitle('Career OS') !== 'PinIT - Career OS') throw new Error('Expected PinIT - Career OS');",
      "if (formatAppTitle('Portfolio') !== 'PinIT - Portfolio') throw new Error('Expected PinIT - Portfolio');"
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
    title: "Variables and Data Types: V8 Heap, Stack Frames, Memory Allocation & Type Safety",
    desc: "Analyze the low-level memory mechanics of the V8 engine: execution stack frames, heap allocation, primitive value copying vs reference pointers, type coercion hazards, and static type narrowing.",
    syllabus: [
      "V8 runtime architecture: Call stack execution frames, heap allocations, and task queue event loops.",
      "Primitive scalars vs composite heap references: Pointer semantics and garbage collection scavenger cycles.",
      "Type safety dynamics: Coercion pitfalls, IEEE 754 precision, and production TypeScript schema validation."
    ],
    eTitle: "Describe a Job",
    eDesc: "Write `describeJob(title, salary)` that returns text like `'Frontend Developer pays 400000'`.",
    eStarter: lines("function describeJob(title, salary) {", "  // Join title, ' pays ', and salary", "  return '';", "}"),
    eHint: "return title + ' pays ' + salary;",
    eTest: lines(
      "if (typeof describeJob !== 'function') throw new Error('describeJob not found');",
      "if (describeJob('Frontend Developer', 400000) !== 'Frontend Developer pays 400000') throw new Error('Wrong text 1');",
      "if (describeJob('Backend Engineer', 600000) !== 'Backend Engineer pays 600000') throw new Error('Wrong text 2');",
      "if (describeJob('DevOps Specialist', 800000) !== 'DevOps Specialist pays 800000') throw new Error('Wrong text 3');"
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
    title: "Functions and Making Decisions: Execution Contexts, Closures & Functional Architecture",
    desc: "Deconstruct JavaScript execution contexts and functional architecture: creation phase, temporal dead zones, lexical scope chains, closures in heap memory, currying, and exhaustive pattern matching.",
    syllabus: [
      "The V8 execution context lifecycle: Creation phase, variable environments, and temporal dead zone boundaries.",
      "Lexical scope and closures: Retaining outer activation records in heap memory across function returns.",
      "Functional architecture: Higher-order functions, curried unary pipelines, and exhaustive pattern matching."
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
    aHint: "return first + ' ' + last;",
    aTest: lines(
      "if (typeof fullName !== 'function') throw new Error('fullName not found');",
      "if (fullName('Asha', 'Rao') !== 'Asha Rao') throw new Error('Expected Asha Rao but got ' + fullName('Asha', 'Rao'));"
    )
  },
  {
    title: "Arrays and Objects: Memory Layout, Structural Sharing & Normalized Relational State",
    desc: "Evaluate V8 internal array representations (Packed vs Holey ElementsKind), implement shallow structural sharing with spread operators, optimize V8 Hidden Classes (Shapes), and architect normalized relational client stores.",
    syllabus: [
      "V8 array memory topologies: Contiguous PACKED_SMI and DOUBLE buffers versus holey dictionary mode degradation.",
      "Structural sharing and shallow copying: Preserving referential immutability without recursive allocation penalties.",
      "Relational state normalization: Architecting byId entity dictionaries and allIds sequences for O(1) atomic updates."
    ],
    eTitle: "Make a Job",
    eDesc: "Write `makeJob(title, company)` that returns an object `{ title, company, status: 'applied' }`.",
    eStarter: lines("function makeJob(title, company) {", "  return {", "    // add title, company and status here", "  };", "}"),
    eHint: "return { title: title, company: company, status: 'applied' };",
    eTest: lines(
      "if (typeof makeJob !== 'function') throw new Error('makeJob not found');",
      "const j1 = makeJob('Developer', 'TCS');",
      "if (j1.title !== 'Developer' || j1.company !== 'TCS' || j1.status !== 'applied') throw new Error('makeJob 1 failed');",
      "const j2 = makeJob('Designer', 'Infosys');",
      "if (j2.title !== 'Designer' || j2.company !== 'Infosys' || j2.status !== 'applied') throw new Error('makeJob 2 failed');",
      "const j3 = makeJob('Analyst', 'Wipro');",
      "if (j3.title !== 'Analyst' || j3.company !== 'Wipro' || j3.status !== 'applied') throw new Error('makeJob 3 failed');"
    ),
    aTitle: "First and Last",
    aDesc: "Write `firstAndLast(list)` that returns a new array with the first and the last item of `list`.",
    aStarter: lines("function firstAndLast(list) {", "  // list[0] is the first item. What is the last?", "}"),
    aHint: "return [list[0], list[list.length - 1]];",
    aTest: lines(
      "if (typeof firstAndLast !== 'function') throw new Error('firstAndLast not found');",
      "const r1 = firstAndLast(['a', 'b', 'c', 'd']);",
      "if (!Array.isArray(r1) || r1[0] !== 'a' || r1[1] !== 'd' || r1.length !== 2) throw new Error('Expected [a, d]');",
      "const r2 = firstAndLast([10, 20, 30]);",
      "if (!Array.isArray(r2) || r2[0] !== 10 || r2[1] !== 30 || r2.length !== 2) throw new Error('Expected [10, 30]');",
      "const r3 = firstAndLast(['x', 'y']);",
      "if (!Array.isArray(r3) || r3[0] !== 'x' || r3[1] !== 'y' || r3.length !== 2) throw new Error('Expected [x, y]');"
    )
  },
  {
    title: "Loops and Array Methods: Iteration Cost, Collection Pipelines, Reconciliation & Milestone 1 Capstone",
    desc: "Analyze the algorithmic cost of loop constructs versus declarative array higher-order methods, optimize collection pipelines, explore virtual DOM reconciliation keys, and build the Milestone 1 Architecture Capstone.",
    syllabus: [
      "Loop execution mechanics: TurboFan loop peeling, On-Stack Replacement, and the perils of for...in on arrays.",
      "Declarative collection pipelines: Intermediate array allocation overhead in method chaining vs single-pass reduction.",
      "React list reconciliation: Spatial identity, Fiber diffing heuristics, and the Milestone 1 Relational Query Engine."
    ],
    eTitle: "Job Titles Only",
    eDesc: "Write `getTitles(jobs)` that returns an array of just the titles, using `map`.",
    eStarter: lines("function getTitles(jobs) {", "  return jobs.map(job => {", "    // return the title of this job", "  });", "}"),
    eHint: "return jobs.map(job => job.title);",
    eTest: lines(
      "if (typeof getTitles !== 'function') throw new Error('getTitles not found');",
      "const t1 = getTitles([{ title: 'Dev' }, { title: 'Tester' }]);",
      "if (t1.length !== 2 || t1[0] !== 'Dev' || t1[1] !== 'Tester') throw new Error('Expected [Dev, Tester]');",
      "const t2 = getTitles([{ title: 'Lead' }, { title: 'Manager' }, { title: 'Director' }]);",
      "if (t2.length !== 3 || t2[0] !== 'Lead' || t2[1] !== 'Manager' || t2[2] !== 'Director') throw new Error('Expected 3 titles');",
      "const t3 = getTitles([{ title: 'Intern' }]);",
      "if (t3.length !== 1 || t3[0] !== 'Intern') throw new Error('Expected [Intern]');"
    ),
    aTitle: "Only Interviews",
    aDesc: "Write `onlyInterviews(jobs)` that returns only the jobs whose `status` is `'interview'`, using `filter`.",
    aStarter: lines("function onlyInterviews(jobs) {", "  // use jobs.filter(...)", "}"),
    aHint: "return jobs.filter(job => job.status === 'interview');",
    aTest: lines(
      "if (typeof onlyInterviews !== 'function') throw new Error('onlyInterviews not found');",
      "const r1 = onlyInterviews([{ id: 1, status: 'applied' }, { id: 2, status: 'interview' }, { id: 3, status: 'interview' }]);",
      "if (r1.length !== 2 || r1[0].id !== 2 || r1[1].id !== 3) throw new Error('Expected two interview jobs');",
      "const r2 = onlyInterviews([{ id: 4, status: 'rejected' }, { id: 5, status: 'applied' }]);",
      "if (r2.length !== 0) throw new Error('Expected zero interview jobs');",
      "const r3 = onlyInterviews([{ id: 6, status: 'interview' }]);",
      "if (r3.length !== 1 || r3[0].id !== 6) throw new Error('Expected single interview job');"
    )
  },
  {
    title: "ESNext Syntax & Modern Language Mechanics: Destructuring, Tagged Templates, Rest/Spread & Symbols",
    desc: "Master modern ESNext syntax and V8 execution mechanics: tagged template literals and AST lowering, object/array destructuring bytecode patterns, rest/spread shallow allocation, Symbols and metaprogramming, and short-circuiting optional chaining.",
    syllabus: [
      "Tagged template functions: String interleaving, raw chunks, and SQL/HTML injection sanitization pipelines.",
      "Destructuring mechanics: V8 bytecode property lookup, default fallback evaluation, and stack slot allocation.",
      "Rest and spread operators: Shallow cloning memory footprint, immutable state updates, and Symbol property slots."
    ],
    eTitle: "Update a Job's Status",
    eDesc: "Write `updateStatus(job, status)` that returns a NEW object with the same details but the new status. Do not change the original job.",
    eStarter: lines("function updateStatus(job, status) {", "  // copy job with ...job and set the new status", "}"),
    eHint: "return { ...job, status: status };",
    eTest: lines(
      "if (typeof updateStatus !== 'function') throw new Error('updateStatus not found');",
      "const job1 = { title: 'Dev', status: 'applied' };",
      "const u1 = updateStatus(job1, 'offer');",
      "if (u1.status !== 'offer' || u1.title !== 'Dev') throw new Error('updateStatus 1 failed');",
      "if (job1.status !== 'applied') throw new Error('job1 was mutated');",
      "const job2 = { title: 'QA', status: 'interview' };",
      "const u2 = updateStatus(job2, 'rejected');",
      "if (u2.status !== 'rejected' || u2.title !== 'QA') throw new Error('updateStatus 2 failed');",
      "const job3 = { title: 'Lead', status: 'applied' };",
      "const u3 = updateStatus(job3, 'interview');",
      "if (u3.status !== 'interview' || u3.title !== 'Lead') throw new Error('updateStatus 3 failed');"
    ),
    aTitle: "Job Card Text",
    aDesc: "Write `jobCard(job)` that uses destructuring and a template string to return text like `'Developer at Infosys'`.",
    aStarter: lines("function jobCard(job) {", "  const { title, company } = job;", "  // return a template string using title and company", "}"),
    aHint: "return `${title} at ${company}`;",
    aTest: lines(
      "if (typeof jobCard !== 'function') throw new Error('jobCard not found');",
      "if (jobCard({ title: 'Developer', company: 'Infosys' }) !== 'Developer at Infosys') throw new Error('jobCard 1 failed');",
      "if (jobCard({ title: 'Designer', company: 'Figma' }) !== 'Designer at Figma') throw new Error('jobCard 2 failed');",
      "if (jobCard({ title: 'Product Manager', company: 'Google' }) !== 'Product Manager at Google') throw new Error('jobCard 3 failed');"
    )
  },
  {
    title: "JavaScript Module Systems & Bundler Internals: ESM vs CommonJS, Tree-Shaking & Dependency Graphs",
    desc: "Dissect modern JavaScript module systems and bundler architectures: CommonJS dynamic evaluation vs ES module static analysis, dependency graph construction, tree-shaking dead code elimination, Vite native ESM dev servers, and route-based dynamic code splitting.",
    syllabus: [
      "CommonJS vs ESM: Dynamic synchronous loading vs static parsing and live binding reference mechanics.",
      "Module graph resolution: Abstract syntax tree parsing, cyclic dependency handling, and topological sorting.",
      "Bundler optimization: Tree-shaking side-effect analysis, dead code elimination, and on-demand ESM serving."
    ],
    eTitle: "Count Jobs by Status",
    eDesc: "Write `countByStatus(jobs)` that returns an object counting each status. Example: two applied and one offer gives `{ applied: 2, offer: 1 }`.",
    eStarter: lines("function countByStatus(jobs) {", "  const counts = {};", "  for (const job of jobs) {", "    // add 1 to counts[job.status]", "  }", "  return counts;", "}"),
    eHint: "for (const job of jobs) { counts[job.status] = (counts[job.status] || 0) + 1; } return counts;",
    eTest: lines(
      "if (typeof countByStatus !== 'function') throw new Error('countByStatus not found');",
      "const c1 = countByStatus([{ status: 'applied' }, { status: 'offer' }, { status: 'applied' }]);",
      "if (c1.applied !== 2 || c1.offer !== 1) throw new Error('countByStatus 1 failed');",
      "const c2 = countByStatus([{ status: 'rejected' }, { status: 'rejected' }]);",
      "if (c2.rejected !== 2) throw new Error('countByStatus 2 failed');",
      "const c3 = countByStatus([{ status: 'interview' }, { status: 'applied' }, { status: 'offer' }]);",
      "if (c3.interview !== 1 || c3.applied !== 1 || c3.offer !== 1) throw new Error('countByStatus 3 failed');"
    ),
    aTitle: "Add a Job",
    aDesc: "Write `addJob(jobs, job)` that returns a NEW array with the job added at the end. Do not change the original array.",
    aStarter: lines("function addJob(jobs, job) {", "  // use spread: [...jobs, job]", "}"),
    aHint: "return [...jobs, job];",
    aTest: lines(
      "if (typeof addJob !== 'function') throw new Error('addJob not found');",
      "const list1 = [{ id: 1 }];",
      "const r1 = addJob(list1, { id: 2 });",
      "if (r1.length !== 2 || r1[1].id !== 2 || list1.length !== 1) throw new Error('addJob 1 failed');",
      "const list2 = [];",
      "const r2 = addJob(list2, { id: 10 });",
      "if (r2.length !== 1 || r2[0].id !== 10) throw new Error('addJob 2 failed');",
      "const list3 = [{ id: 5 }, { id: 6 }];",
      "const r3 = addJob(list3, { id: 7 });",
      "if (r3.length !== 3 || r3[2].id !== 7 || list3.length !== 2) throw new Error('addJob 3 failed');"
    )
  },

  // ── WEEK 2: React basics ───────────────────────────────────────────────────
  {
    title: "JSX Internals, Compilation Pipelines & The Virtual DOM: React.createElement vs The New JSX Transform",
    desc: "Examine JSX compilation pipelines and virtual DOM architectures: AST lowering via Babel/SWC, React element anatomy vs native DOM nodes, heuristic tree reconciliation in O(n) linear time, React Fiber cooperative scheduling work loops, and pure component invariants.",
    syllabus: [
      "JSX compilation mechanics: AST lowering, React.createElement versus modern jsx runtime automatic imports.",
      "Virtual DOM architecture: Immutable element descriptors, C++ heap DOM overhead, and shallow tree comparison.",
      "React Fiber engine: Cooperative multitasking, 16ms frame budgeting, and pure render function idempotence."
    ],
    eTitle: "Greeting Component",
    eDesc: "Components return screen content. Write a TSX component `Greeting({ name }: { name: string })` that returns an `<h1>` element: `<h1>Hello, {name}</h1>`.",
    eLanguage: "tsx",
    eStarter: lines("function Greeting({ name }: { name: string }) {", "  // Return an h1 with 'Hello, ' and name", "  return null;", "}"),
    eHint: "return <h1>Hello, {name}</h1>;",
    eTest: lines(
      "if (typeof Greeting !== 'function') throw new Error('Greeting not found');",
      "const h1 = render(Greeting, { name: 'Asha' });",
      "if (h1 !== '<h1>Hello, Asha</h1>') throw new Error('Expected <h1>Hello, Asha</h1> but got ' + h1);",
      "const h2 = render(Greeting, { name: 'Ravi' });",
      "if (h2 !== '<h1>Hello, Ravi</h1>') throw new Error('Expected <h1>Hello, Ravi</h1> but got ' + h2);",
      "const h3 = render(Greeting, { name: 'Priya' });",
      "if (h3 !== '<h1>Hello, Priya</h1>') throw new Error('Expected <h1>Hello, Priya</h1> but got ' + h3);"
    ),
    aTitle: "Job Item Component",
    aDesc: "Write a TSX component `JobItem({ title, company }: { title: string; company: string })` that returns an `<li>` element: `<li>{title} - {company}</li>`.",
    aLanguage: "tsx",
    aStarter: lines("function JobItem({ title, company }: { title: string; company: string }) {", "  // Return an li with title and company", "  return null;", "}"),
    aHint: "return <li>{title} - {company}</li>;",
    aTest: lines(
      "if (typeof JobItem !== 'function') throw new Error('JobItem not found');",
      "const h1 = render(JobItem, { title: 'Dev', company: 'TCS' });",
      "if (h1 !== '<li>Dev - TCS</li>') throw new Error('Expected <li>Dev - TCS</li> but got ' + h1);",
      "const h2 = render(JobItem, { title: 'Designer', company: 'Wipro' });",
      "if (h2 !== '<li>Designer - Wipro</li>') throw new Error('Expected <li>Designer - Wipro</li> but got ' + h2);",
      "const h3 = render(JobItem, { title: 'PM', company: 'Google' });",
      "if (h3 !== '<li>PM - Google</li>') throw new Error('Expected <li>PM - Google</li> but got ' + h3);"
    )
  },
  {
    title: "Props Architecture, Contract Enforcement & Unidirectional Data Flow: Read-Only Invariants & Component Composition",
    desc: "Architect robust component input contracts and unidirectional data topologies: top-down props propagation and bubbling event callbacks, props immutability and shallow freezing, compound component composition via props.children, type-safe discriminated union props, and modern destructuring defaults.",
    syllabus: [
      "Unidirectional data flow: Single source of truth state ownership, top-down propagation, and callback mutation.",
      "Props immutability invariants: Object.freeze development barriers and pure referential state transitions.",
      "Component composition patterns: Compound component inversion of control, slot patterns, and discriminated union props."
    ],
    eTitle: "Button With a Default Colour",
    eDesc: "Write a TSX component `Button({ label, color = 'blue' }: { label: string; color?: string })` that returns `<button className={color}>{label}</button>`. If no colour is given, default to `'blue'`.",
    eLanguage: "tsx",
    eStarter: lines("function Button({ label, color = 'blue' }: { label: string; color?: string }) {", "  // Return a button with className set to color and label inside", "  return null;", "}"),
    eHint: "return <button className={color}>{label}</button>;",
    eTest: lines(
      "if (typeof Button !== 'function') throw new Error('Button not found');",
      "const h1 = render(Button, { label: 'Save' });",
      "if (h1 !== '<button class=\"blue\">Save</button>') throw new Error('Default colour should be blue, got ' + h1);",
      "const h2 = render(Button, { label: 'Delete', color: 'red' });",
      "if (h2 !== '<button class=\"red\">Delete</button>') throw new Error('Given colour should be used, got ' + h2);",
      "const h3 = render(Button, { label: 'Submit', color: 'green' });",
      "if (h3 !== '<button class=\"green\">Submit</button>') throw new Error('Given colour green should be used, got ' + h3);"
    ),
    aTitle: "Badge Component",
    aDesc: "Write a TSX component `Badge({ count }: { count: number })` that returns `<span>No new jobs</span>` when count is 0, otherwise `<span>{count} new jobs</span>`.",
    aLanguage: "tsx",
    aStarter: lines("function Badge({ count }: { count: number }) {", "  // Return span with count text", "  return null;", "}"),
    aHint: "return <span>{count === 0 ? 'No new jobs' : `${count} new jobs`}</span>;",
    aTest: lines(
      "if (typeof Badge !== 'function') throw new Error('Badge not found');",
      "const h1 = render(Badge, { count: 0 });",
      "if (h1 !== '<span>No new jobs</span>') throw new Error('0 count should give No new jobs, got ' + h1);",
      "const h2 = render(Badge, { count: 3 });",
      "if (h2 !== '<span>3 new jobs</span>') throw new Error('3 count should give 3 new jobs, got ' + h2);",
      "const h3 = render(Badge, { count: 12 });",
      "if (h3 !== '<span>12 new jobs</span>') throw new Error('12 count should give 12 new jobs, got ' + h3);"
    )
  },
  {
    title: "List Rendering, Fiber Identity Keys & Milestone 2 Architecture Capstone: Virtualized Dynamic Feed Engine",
    desc: "Master list rendering, reconciliation mechanics, and collection virtualization: multi-child diffing algorithms, mutation inversion pitfalls of array indices as keys, DOM node reordering heuristics with lastPlacedIndex, viewport windowing with overscan, and architecting the Milestone 2 High-Throughput Dynamic Feed Engine.",
    syllabus: [
      "Multi-child reconciliation: Two-pass diffing algorithms, key-indexed hash maps, and linear O(n) traversal.",
      "The key contract: Entity identity versus array positions, state corruption hazards, and surrogate key derivation.",
      "List virtualization architecture: Windowed viewport slicing, overscan buffers, and the Milestone 2 Capstone Engine."
    ],
    eTitle: "Build a List",
    eDesc: "Write a TSX component `JobList({ items }: { items: string[] })` that returns an `<ul>` containing an `<li>` for each item in `items`.",
    eLanguage: "tsx",
    eStarter: lines("function JobList({ items }: { items: string[] }) {", "  // Return an ul with li elements for each item", "  return null;", "}"),
    eHint: "return <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>;",
    eTest: lines(
      "if (typeof JobList !== 'function') throw new Error('JobList not found');",
      "const h1 = render(JobList, { items: ['Frontend', 'Backend'] });",
      "if (h1 !== '<ul><li>Frontend</li><li>Backend</li></ul>') throw new Error('Expected two items in ul, got ' + h1);",
      "const h2 = render(JobList, { items: ['DevOps'] });",
      "if (h2 !== '<ul><li>DevOps</li></ul>') throw new Error('Expected single item ul, got ' + h2);",
      "const h3 = render(JobList, { items: [] });",
      "if (h3 !== '<ul></ul>') throw new Error('Empty list should be <ul></ul>, got ' + h3);"
    ),
    aTitle: "Are the Keys Unique?",
    aDesc: "Write `hasUniqueIds(jobs)` that returns `true` if no two jobs have the same `id`.",
    aStarter: lines("function hasUniqueIds(jobs) {", "  const seen = new Set();", "  // loop, and return false if an id was already seen", "  return true;", "}"),
    aHint: "for (const job of jobs) { if (seen.has(job.id)) return false; seen.add(job.id); } return true;",
    aTest: lines(
      "if (typeof hasUniqueIds !== 'function') throw new Error('hasUniqueIds not found');",
      "if (hasUniqueIds([{ id: 1 }, { id: 2 }]) !== true) throw new Error('1 and 2 are unique');",
      "if (hasUniqueIds([{ id: 1 }, { id: 1 }]) !== false) throw new Error('1 and 1 are not unique');"
    )
  },
  {
    title: "Conditional Rendering Mechanics, Branching Heuristics & Element Reconciliation: Short-Circuiting, Ternaries & Early Returns",
    desc: "Master conditional rendering mechanics and reconciliation heuristics: eliminating the falsy zero hazard in logical AND, architecting multi-branch table dispatchers, implementing early return guard clauses while preserving hook order invariants, managing element identity vs state bleed across branches, and building resilient four-state UI topologies.",
    syllabus: [
      "The falsy zero hazard: Logical AND evaluation pitfalls, boolean coercion, and guarded branch patterns.",
      "Branching heuristics: Dispatch tables vs nested ternaries, early return guards, and hook linked list order invariants.",
      "Identity and state preservation: Fiber reuse across branch switches, spatial key assignment, and resilient UI state topologies."
    ],
    eTitle: "Empty or Not",
    eDesc: "Write a TSX component `StatusMessage({ jobs }: { jobs: unknown[] })` that returns `<p>No jobs yet. Add your first one!</p>` when `jobs` is empty, otherwise `<p>You have {jobs.length} jobs</p>`.",
    eLanguage: "tsx",
    eStarter: lines("function StatusMessage({ jobs }: { jobs: unknown[] }) {", "  // Return p with empty message or job count", "  return null;", "}"),
    eHint: "return <p>{jobs.length === 0 ? 'No jobs yet. Add your first one!' : `You have ${jobs.length} jobs`}</p>;",
    eTest: lines(
      "if (typeof StatusMessage !== 'function') throw new Error('StatusMessage not found');",
      "const h1 = render(StatusMessage, { jobs: [] });",
      "if (h1 !== '<p>No jobs yet. Add your first one!</p>') throw new Error('Expected empty message, got ' + h1);",
      "const h2 = render(StatusMessage, { jobs: [{}, {}] });",
      "if (h2 !== '<p>You have 2 jobs</p>') throw new Error('Expected 2 jobs message, got ' + h2);",
      "const h3 = render(StatusMessage, { jobs: [{}] });",
      "if (h3 !== '<p>You have 1 jobs</p>') throw new Error('Expected 1 jobs message, got ' + h3);"
    ),
    aTitle: "Offer Badge",
    aDesc: "Write a TSX component `OfferBadge({ status }: { status: string })` that returns `<span className=\"badge-offer\">Offer!</span>` when status is `'offer'`, or `null` otherwise.",
    aLanguage: "tsx",
    aStarter: lines("function OfferBadge({ status }: { status: string }) {", "  // Return offer badge or null", "  return null;", "}"),
    aHint: "return status === 'offer' ? <span className=\"badge-offer\">Offer!</span> : null;",
    aTest: lines(
      "if (typeof OfferBadge !== 'function') throw new Error('OfferBadge not found');",
      "const h1 = render(OfferBadge, { status: 'offer' });",
      "if (h1 !== '<span class=\"badge-offer\">Offer!</span>') throw new Error('Expected Offer! badge, got ' + h1);",
      "const h2 = render(OfferBadge, { status: 'applied' });",
      "if (h2 !== '') throw new Error('Applied status should render nothing, got ' + h2);",
      "const h3 = render(OfferBadge, { status: 'interview' });",
      "if (h3 !== '') throw new Error('Interview status should render nothing, got ' + h3);"
    )
  },
  {
    title: "The useState Hook & React State Mechanics: State Cells, Dispatch Action Queues & Batching in Concurrent Mode",
    desc: "Master the internal mechanics of the useState hook: understanding Fiber Hook linked list structures, preventing closure staleness with functional update queues, analyzing React 18 automatic batching across asynchronous boundaries, avoiding Object.is mutation bailout traps, and optimizing mount performance with lazy state initializers.",
    syllabus: [
      "Fiber Hook memory architecture: MemoizedState singly-linked list, positional cursor traversal, and the Rules of Hooks.",
      "Asynchronous batching & action queues: Stale closures, functional state setters, and React 18 automatic batching via createRoot.",
      "Reference equality & initialization: Object.is reconciliation bailouts, immutability spread mechanics, and lazy initializer callbacks."
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
    title: "Synthetic Event System & Browser Event Dispatch: Event Delegation, Bubble Pipelines & Passive Event Listeners",
    desc: "Master the architecture of React's SyntheticEvent system: event delegation to the root container (createRoot), cross-browser normalization, synthetic event pooling removal in React 17+, bubbling vs capture phases, stopPropagation() vs nativeEvent.stopImmediatePropagation(), passive event listener optimization, and keyboard accessibility pipelines.",
    syllabus: [
      "Event delegation architecture: Root container listener binding, W3C event flow, and micro-frontend isolation boundaries.",
      "SyntheticEvent mechanics: Cross-browser normalization, legacy pooling elimination, and generational nursery GC optimization.",
      "Propagation & accessibility: React Fiber bubble vs native DOM capture, passive high-frequency listeners, and keyboard contracts."
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
    title: "Form Architecture, Controlled vs Uncontrolled Components & Input Validation Engines: FormData, Ref Buffers & Schema Constraints",
    desc: "Master modern form architecture in React: controlled state single source of truth vs uncontrolled DOM ref buffers, keystroke re-render trade-offs, native FormData extraction and onSubmit pipelines, asynchronous validation queues, debounced validation patterns, and schema-driven validation with custom constraint engines.",
    syllabus: [
      "Controlled vs uncontrolled paradigms: Single source of truth, keystroke render costs, IME composition, and DOM ref buffers.",
      "Native FormData pipelines: Multi-field extraction, file binary blobs, multipart boundary formatting, and server actions.",
      "Validation engines: Asynchronous race condition elimination via Request IDs, debouncing, and declarative schema parsers."
    ],
    eTitle: "Check the Job Form",
    eDesc: "Write `validateJobForm(form)` that returns an array of errors: add `'Title is required'` if title is empty and `'Company is required'` if company is empty. Return `[]` if both are filled.",
    eStarter: lines("function validateJobForm(form) {", "  const errors = [];", "  // push error messages here", "  return errors;", "}"),
    eHint: "if (!form.title) errors.push('Title is required'); if (!form.company) errors.push('Company is required'); return errors;",
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
      "const f1 = { title: '', company: 'TCS' };",
      "const r1 = updateField(f1, 'title', 'Dev');",
      "if (r1.title !== 'Dev' || r1.company !== 'TCS' || f1.title !== '') throw new Error('updateField 1 failed');",
      "const f2 = { title: 'Dev', salary: 100 };",
      "const r2 = updateField(f2, 'salary', 200);",
      "if (r2.salary !== 200 || r2.title !== 'Dev') throw new Error('updateField 2 failed');",
      "const f3 = { location: 'Remote' };",
      "const r3 = updateField(f3, 'status', 'open');",
      "if (r3.status !== 'open' || r3.location !== 'Remote') throw new Error('updateField 3 failed');"
    )
  },

  // ── WEEK 3: Real-app skills ────────────────────────────────────────────────
  {
    title: "Lifting State Up, Prop Drilling Mitigations & State Colocation: Normalized Shared State & Milestone 3 Architecture Capstone",
    desc: "Master multi-component state architecture: identifying state ownership, lifting state to lowest common ancestors (LCA), state colocation principles, mitigating prop drilling via component composition (children slots), relational state normalization (byId entity tables), and architecting the Milestone 3 Multi-Step Transaction & Checkout Engine capstone.",
    syllabus: [
      "State ownership heuristics: Lowest Common Ancestor (LCA) graph search, callback stabilization, and re-render coupling.",
      "State colocation & composition: Containing re-render blast radiuses, children slots, and eliminating prop drilling.",
      "Normalized state & capstone: Relational byId entity stores, O(1) mutations, and the Milestone 3 Multi-Step Transaction Engine."
    ],
    eTitle: "Remove a Job",
    eDesc: "Write `removeJob(jobs, id)` that returns a new list without the job with that id.",
    eStarter: lines("function removeJob(jobs, id) {", "  // use filter", "}"),
    eHint: "return jobs.filter(job => job.id !== id);",
    eTest: lines(
      "if (typeof removeJob !== 'function') throw new Error('removeJob not found');",
      "const r1 = removeJob([{ id: 1 }, { id: 2 }, { id: 3 }], 2);",
      "if (r1.length !== 2 || r1.some(j => j.id === 2)) throw new Error('removeJob 1 failed');",
      "const r2 = removeJob([{ id: 5 }], 5);",
      "if (r2.length !== 0) throw new Error('removeJob 2 failed');",
      "const r3 = removeJob([{ id: 10 }, { id: 20 }], 99);",
      "if (r3.length !== 2 || r3[0].id !== 10 || r3[1].id !== 20) throw new Error('removeJob 3 failed');"
    ),
    aTitle: "Change a Job's Status",
    aDesc: "Write `changeJobStatus(jobs, id, status)` that returns a new list where only the job with that id has the new status.",
    aStarter: lines("function changeJobStatus(jobs, id, status) {", "  // use map; change only the matching job", "}"),
    aHint: "return jobs.map(job => job.id === id ? { ...job, status } : job);",
    aTest: lines(
      "if (typeof changeJobStatus !== 'function') throw new Error('changeJobStatus not found');",
      "const j1 = [{ id: 1, status: 'applied' }, { id: 2, status: 'applied' }];",
      "const r1 = changeJobStatus(j1, 2, 'interview');",
      "if (r1[1].status !== 'interview' || r1[0].status !== 'applied' || j1[1].status !== 'applied') throw new Error('changeJobStatus 1 failed');",
      "const j2 = [{ id: 3, status: 'interview' }];",
      "const r2 = changeJobStatus(j2, 3, 'offer');",
      "if (r2[0].status !== 'offer') throw new Error('changeJobStatus 2 failed');",
      "const j3 = [{ id: 4, status: 'applied' }];",
      "const r3 = changeJobStatus(j3, 99, 'rejected');",
      "if (r3[0].status !== 'applied') throw new Error('changeJobStatus 3 failed');"
    )
  },
  {
    title: "Side Effects Lifecycle & The useEffect Hook: Synchronization Pipelines, Passive Execution & Cleanup Cycles",
    desc: "Master the side effect lifecycle in React: separating pure render computations from impure imperative side effects, understanding the passive deferred execution timing of useEffect after browser paint, implementing strict effect cleanup and teardown protocols to prevent memory leaks, handling React 18 Strict Mode double-mounting idempotently, and structuring asynchronous effects with cancellation flags and AbortController.",
    syllabus: [
      "Render purity & side effect quarantine: Mathematical render invariants, browser paint deferral, and message channel scheduling.",
      "Symmetric cleanup lifecycles: Destructor execution before re-sync, subscription teardowns, and Reusable State stress testing.",
      "Asynchronous race conditions & abort signals: Unmounted component state guards, AbortController pipelines, and streaming resync."
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
    title: "Effect Dependencies & The Stale Closure Hazard: Exhaustive Deps Lint Rules & Primitive Value Tracking",
    desc: "Master React effect dependencies and eliminate stale closures: understanding lexical environment records in V8, adhering to the exhaustive-deps lint contract, avoiding object and array reference instability loops, stabilizing function references with useCallback and inlining, and engineering the Mutable Ref Bridge pattern with useEffectEvent.",
    syllabus: [
      "Lexical closures & stale captures: Immutable execution frames, frozen constant traps, and functional state updater queues.",
      "The exhaustive-deps contract: AST control flow graph analysis, areHookInputsEqual mechanics, and Object.is shallow diffing.",
      "Reference stability & ref bridges: Primitive flattening, useCallback caching, and the Mutable Ref Bridge pattern (useEffectEvent)."
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
    aTitle: "Request View Component",
    aDesc: "Write a TSX component `RequestView({ status }: { status: string })` that returns `<div>Loading...</div>` for `'loading'`, `<div>Something went wrong</div>` for `'error'`, and `<div>Done</div>` for `'success'`.",
    aLanguage: "tsx",
    aStarter: lines("function RequestView({ status }: { status: string }) {", "  // Return appropriate div based on status", "  return null;", "}"),
    aHint: "if (status === 'loading') return <div>Loading...</div>; if (status === 'error') return <div>Something went wrong</div>; return <div>Done</div>;",
    aTest: lines(
      "if (typeof RequestView !== 'function') throw new Error('RequestView not found');",
      "const h1 = render(RequestView, { status: 'loading' });",
      "if (h1 !== '<div>Loading...</div>') throw new Error('loading should render Loading..., got ' + h1);",
      "const h2 = render(RequestView, { status: 'error' });",
      "if (h2 !== '<div>Something went wrong</div>') throw new Error('error should render Something went wrong, got ' + h2);",
      "const h3 = render(RequestView, { status: 'success' });",
      "if (h3 !== '<div>Done</div>') throw new Error('success should render Done, got ' + h3);"
    )
  },
  {
    title: "The useLayoutEffect Hook & DOM Mutation Measurement: Synchronous Paint Blocking & Layout Shifts",
    desc: "Master synchronous DOM measurements and paint-blocking effects: dissecting the browser render pipeline (Layout, Paint, Composite), eliminating Cumulative Layout Shift (CLS) with useLayoutEffect, preventing layout thrashing by separating reads and writes, resolving SSR hydration warnings with isomorphic layout hooks, and building an enterprise tooltip collision engine.",
    syllabus: [
      "The browser render pipeline: Layout (Reflow), Paint, Compositing layers, and asynchronous passive effect paint gaps (CLS).",
      "useLayoutEffect commit mechanics: Synchronous post-mutation execution, main thread paint blocking, and flushSync batching.",
      "Layout thrashing & isomorphic SSR: Interleaved read/write avoidance, contain: layout boundaries, and isomorphic layout effect hooks."
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
    title: "Mutable References & The useRef Hook: Persistent Memory Cells, DOM Nodes & Previous Value Caches",
    desc: "Master mutable references and imperative component control: understanding persistent heap object identity in React Fiber, enforcing the Golden Ref Invariant (no ref mutations during render), encapsulating DOM nodes with useImperativeHandle, anchoring non-visual infrastructure (timers, WebSockets, workers), implementing the usePrevious state-differencing primitive, and building an in-memory LRU query cache.",
    syllabus: [
      "Persistent memory cell anatomy: Fiber memoizedState heap objects, bypass reconciliation work loop, and render purity invariants.",
      "Host DOM binding & encapsulation: Commit mutation attachment, React 19 ref props, and useImperativeHandle facade masking.",
      "Non-visual infrastructure & differencing: Interval timers, AbortControllers, WebSockets, usePrevious, and in-memory LRU caching."
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
    title: "Custom Hooks Architecture & Logic Extraction: Reusable Primitives & Milestone 4 Architecture Capstone",
    desc: "Master custom hooks architecture and stateful logic extraction: understanding Fiber hook linked list traversal, designing ergonomic hook APIs (tuples vs objects), engineering rate-limiting primitives (useDebounce, useThrottle), building cross-tab sync and environmental hooks (useLocalStorage, useNetworkStatus), and constructing the Milestone 4 Real-Time Streaming & Sync Engine capstone.",
    syllabus: [
      "Philosophy of custom hooks: Eliminating wrapper hell, flat Fiber hook linked list registration, and logic vs state isolation.",
      "Hook API design & stability: Tuples vs objects, TypeScript generics, discriminated union lifecycles, and useCallback stabilization.",
      "Enterprise primitives & streaming capstone: useDebounce, useLocalStorage cross-tab sync, and the Real-Time Streaming Sync Engine."
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
    title: "Context API Internals, Dependency Injection & The Re-Render Problem: Provider Hierarchy, Value Object Reference Stability & Context Splitting",
    desc: "Master React Context internals and re-render broadcast mitigation: understanding Fiber tree return pointer traversal, analyzing Object.is value propagation mechanics, eliminating unnecessary subtree churn with Context Splitting (separating state and dispatch), integrating fine-grained selector stores with useSyncExternalStore, and designing an enterprise multi-tier theme and authentication topology engine.",
    syllabus: [
      "Context Fiber traversal: Ancestor return pointers, createContext fallbacks, and dynamic runtime dependency injection.",
      "The re-render broadcast problem: Object.is value propagation, reference traps, and why React.memo cannot shield consumers.",
      "Context splitting & external stores: State vs dispatch separation, useSyncExternalStore fine-grained selectors, and topology pipelines."
    ],
    eTitle: "Context Fallback Resolver",
    eDesc: "Write `resolveContextValue(providers, contextId, fallback)` that returns matching provider value or fallback.",
    eStarter: lines("function resolveContextValue(providers, contextId, fallback) {", "  // return matching provider value or fallback", "  return fallback;", "}"),
    eHint: "return providers[contextId] !== undefined ? providers[contextId] : fallback;",
    eTest: lines("if (typeof resolveContextValue !== 'function') throw new Error('resolveContextValue not found');", "const p = { 'ctx_theme': 'dark', 'ctx_auth': 'admin' };", "if (resolveContextValue(p, 'ctx_theme', 'light') !== 'dark') throw new Error('Failed to resolve existing context');", "if (resolveContextValue(p, 'ctx_locale', 'en-US') !== 'en-US') throw new Error('Failed fallback resolution');"),
    aTitle: "Dispatch Identity Stability Guard",
    aDesc: "Write `canDispatchBypassRender(lastDispatch, nextDispatch)` that returns `true` if dispatch identity is strictly identical.",
    aStarter: lines("function canDispatchBypassRender(lastDispatch, nextDispatch) {", "  // return true if dispatch identity is strictly identical", "  return false;", "}"),
    aHint: "return Object.is(lastDispatch, nextDispatch);",
    aTest: lines("if (typeof canDispatchBypassRender !== 'function') throw new Error('canDispatchBypassRender not found');", "const d1 = () => {};", "const d2 = () => {};", "if (!canDispatchBypassRender(d1, d1)) throw new Error('Identical dispatch should bypass');", "if (canDispatchBypassRender(d1, () => {})) throw new Error('Fresh dispatch reference should fail');", "if (canDispatchBypassRender(d1, d2)) throw new Error('Different dispatch should fail');")
  },

  // ── WEEK 4: Build, ship and get job-ready ──────────────────────────────────
  {
    title: "Performance Optimization & Memoization Primitives: React.memo, useMemo, useCallback & Shallow Equality Bailouts",
    desc: "Master React performance optimization and memoization economics: understanding Fiber beginWork reconciliation bailouts, configuring React.memo with custom arePropsEqual comparers, avoiding the Reference Inequality Trap, applying useMemo with quantitative benchmarking thresholds, stabilizing callback pointers with useCallback and functional updaters, and profiling render performance using React DevTools and the React 19 Compiler.",
    syllabus: [
      "Fiber beginWork reconciliation bailouts: Pending work lanes, oldProps vs newProps pointer checks, and commit phase skipping.",
      "React.memo & shallow equality: Monomorphic V8 key comparison, reference inequality traps, and custom arePropsEqual contracts.",
      "Computational economics: useMemo memory and CPU overhead, useCallback identity preservation, and React DevTools Profiler traces."
    ],
    eTitle: "Shallow Equal Props Evaluator",
    eDesc: "Write `shallowEqualProps(objA, objB)` that returns `true` if all top-level keys match using `Object.is`.",
    eStarter: lines("function shallowEqualProps(objA, objB) {", "  // return true if all top level keys match using Object.is", "  return false;", "}"),
    eHint: lines("if (Object.is(objA, objB)) return true;", "if (!objA || !objB || typeof objA !== 'object' || typeof objB !== 'object') return false;", "const keysA = Object.keys(objA); const keysB = Object.keys(objB);", "if (keysA.length !== keysB.length) return false;", "for (let k of keysA) {", "  if (!Object.prototype.hasOwnProperty.call(objB, k) || !Object.is(objA[k], objB[k])) return false;", "}", "return true;"),
    eTest: lines("if (typeof shallowEqualProps !== 'function') throw new Error('shallowEqualProps not found');", "const p1 = { id: 10, title: 'Item' }; const p2 = { id: 10, title: 'Item' }; const p3 = { id: 10, title: 'Changed' };", "if (!shallowEqualProps(p1, p2)) throw new Error('Identical props should match');", "if (shallowEqualProps(p1, p3)) throw new Error('Modified prop should fail shallow equal');", "if (shallowEqualProps(p1, { ...p1, extra: true })) throw new Error('Key length mismatch should fail');"),
    aTitle: "Custom Domain Props Comparator",
    aDesc: "Write `customArePropsEqual(prevProps, nextProps)` returning `true` if `id` and `version` match, ignoring others.",
    aStarter: lines("function customArePropsEqual(prevProps, nextProps) {", "  // return true if id and version are equal, ignoring other fields", "  return false;", "}"),
    aHint: "return prevProps.id === nextProps.id && prevProps.version === nextProps.version;",
    aTest: lines("if (typeof customArePropsEqual !== 'function') throw new Error('customArePropsEqual not found');", "const a = { id: 'x', version: 2, meta: { ts: 100 } }; const b = { id: 'x', version: 2, meta: { ts: 200 } }; const c = { id: 'x', version: 3, meta: { ts: 100 } };", "if (!customArePropsEqual(a, b)) throw new Error('Equal id and version should return true');", "if (customArePropsEqual(a, c)) throw new Error('Version mismatch should return false');")
  },
  {
    title: "Code Splitting, Dynamic Imports & React.lazy: Webpack/Vite Chunking, Route-Based Bundling & Asset Delivery",
    desc: "Master client-side code splitting and production asset delivery: understanding why monolithic bundles impair Core Web Vitals (TTFB, FCP, INP), configuring asynchronous chunk boundaries using ECMAScript dynamic import(), integrating declarative Suspense fallbacks with React.lazy, implementing predictive route prefetching via link rel=modulepreload, enforcing tree-shaking with sideEffects: false, and auditing production bundles with strict CI size budgets.",
    syllabus: [
      "Monolithic bundle crisis & dynamic imports: Critical rendering path, TTFB/FCP/INP impact, and ECMAScript import() boundaries.",
      "React.lazy state machine & Suspense: Four-stage lifecycle, thrown promise interception, and progressive skeleton commits.",
      "Predictive prefetching & production auditing: link rel=modulepreload, sideEffects: false tree-shaking, and automated CI byte budgets."
    ],
    eTitle: "Bundle Size Reduction Calculator",
    eDesc: "Write `calculateBundleReduction(monolithicKb, initialChunksKb)` returning percentage of deferred bytes rounded to whole number.",
    eStarter: lines("function calculateBundleReduction(monolithicKb, initialChunksKb) {", "  // return percentage of deferred bytes rounded to whole number", "  return 0;", "}"),
    eHint: "const deferred = monolithicKb - initialChunksKb; return Math.round((deferred / monolithicKb) * 100);",
    eTest: lines("if (typeof calculateBundleReduction !== 'function') throw new Error('calculateBundleReduction not found');", "if (calculateBundleReduction(1000, 300) !== 70) throw new Error('Expected 70% reduction');", "if (calculateBundleReduction(500, 250) !== 50) throw new Error('Expected 50% reduction');"),
    aTitle: "Status Grouping Utility",
    aDesc: "Write `groupByStatus(jobs)` that returns an object grouped by status.",
    aStarter: lines("function groupByStatus(jobs) {", "  const groups = {};", "  // add each job to groups[job.status]", "  return groups;", "}"),
    aHint: lines("for (const job of jobs) {", "  if (!groups[job.status]) groups[job.status] = [];", "  groups[job.status].push(job);", "}", "return groups;"),
    aTest: lines("if (typeof groupByStatus !== 'function') throw new Error('groupByStatus not found');", "const g1 = groupByStatus([{ id: 1, status: 'applied' }, { id: 2, status: 'offer' }, { id: 3, status: 'applied' }]);", "if (!g1.applied || g1.applied.length !== 2 || !g1.offer || g1.offer.length !== 1) throw new Error('groupByStatus 1 failed');", "const g2 = groupByStatus([{ id: 4, status: 'interview' }]);", "if (!g2.interview || g2.interview.length !== 1) throw new Error('groupByStatus 2 failed');")
  },
  {
    title: "Suspense Architecture, Concurrent Boundaries & Error Boundaries: getDerivedStateFromError & Transition Mechanics",
    desc: "Master declarative asynchronous UI architecture and resilient boundary topologies: eliminating isLoading boolean layout thrashing with React Suspense, eliminating fetch-on-render waterfalls via parallel resource kicking and SuspenseList, prioritizing non-blocking state transitions with useTransition and startTransition, implementing production Error Boundaries with getDerivedStateFromError and componentDidCatch, and designing an enterprise zero-crash resilient hierarchy.",
    syllabus: [
      "Declarative Suspense mental model: Eliminating isLoading boolean thrashing, thrown promise work loops, and atomic DOM commits.",
      "Waterfall elimination & concurrent transitions: Parallel resource kicking, SuspenseList, and non-blocking useTransition scheduling.",
      "Production Error Boundary architecture: getDerivedStateFromError fallbacks, componentDidCatch telemetry, and resilient multi-tier trees."
    ],
    eTitle: "Parallel Latency Coordinator",
    eDesc: "Write `calculateParallelLatency(requests)` returning max latency among all concurrent requests.",
    eStarter: lines("function calculateParallelLatency(requests) {", "  // return max latency among all concurrent requests", "  return 0;", "}"),
    eHint: "return requests.length === 0 ? 0 : Math.max(...requests.map(r => r.latencyMs));",
    eTest: lines("if (typeof calculateParallelLatency !== 'function') throw new Error('calculateParallelLatency not found');", "const reqs = [{ id: 'a', latencyMs: 120 }, { id: 'b', latencyMs: 250 }, { id: 'c', latencyMs: 80 }];", "if (calculateParallelLatency(reqs) !== 250) throw new Error('Parallel latency should be max latency (250)');", "if (calculateParallelLatency([]) !== 0) throw new Error('Empty array should return 0');"),
    aTitle: "Error Boundary Derived State",
    aDesc: "Write `getDerivedStateFromError(error)` returning `{ hasError: true, errorMessage }`.",
    aStarter: lines("function getDerivedStateFromError(error) {", "  // return object with hasError: true and errorMessage string", "  return { hasError: false, errorMessage: '' };", "}"),
    aHint: "return { hasError: true, errorMessage: error && error.message ? error.message : String(error) };",
    aTest: lines("if (typeof getDerivedStateFromError !== 'function') throw new Error('getDerivedStateFromError not found');", "const s1 = getDerivedStateFromError(new Error('NETWORK_TIMEOUT'));", "if (!s1.hasError || s1.errorMessage !== 'NETWORK_TIMEOUT') throw new Error('Failed error object extraction');", "const s2 = getDerivedStateFromError('STRING_EXCEPTION');", "if (!s2.hasError || s2.errorMessage !== 'STRING_EXCEPTION') throw new Error('Failed string error extraction');")
  },
  {
    title: "The useReducer Hook & Enterprise State Machines: Complex State Transitions, Reducer Purity & Milestone 5 Capstone",
    desc: "Master advanced enterprise state management and construct the Milestone 5 Capstone: recognizing the limitations of useState for relational domains, eliminating impossible states with Finite State Machines, implementing deterministic pure reducers with useReducer and lazy init, pairing useReducer with Split Contexts for high-performance zero-dependency global stores, engineering middleware pipelines with time-travel debugging, and building the Global Enterprise E-Commerce & Inventory State Engine.",
    syllabus: [
      "Limitations of useState: Tangled boolean states, race conditions, impossible states, and Finite State Machine modeling.",
      "useReducer internals & reducer purity: Action contracts, immutable structural sharing, never exhaustive checks, and lazy init.",
      "Enterprise State Machine & Capstone: Split Context stores, middleware pipelines, time-travel logging, and the Commerce Engine Capstone."
    ],
    eTitle: "Inventory Reservation Reducer",
    eDesc: "Write `inventoryReducer(stock, action)` where RESERVE decrements stock if sufficient and RESTOCK increments stock.",
    eStarter: lines("function inventoryReducer(stock, action) {", "  // RESERVE decrements stock if sufficient, RESTOCK increments stock", "  return stock;", "}"),
    eHint: lines("if (action.type === 'RESERVE') {", "  return stock >= action.quantity ? stock - action.quantity : stock;", "}", "if (action.type === 'RESTOCK') {", "  return stock + action.quantity;", "}", "return stock;"),
    eTest: lines("if (typeof inventoryReducer !== 'function') throw new Error('inventoryReducer not found');", "if (inventoryReducer(100, { type: 'RESERVE', quantity: 30 }) !== 70) throw new Error('Failed to reserve stock');", "if (inventoryReducer(20, { type: 'RESERVE', quantity: 50 }) !== 20) throw new Error('Over-reservation should keep stock unchanged');", "if (inventoryReducer(50, { type: 'RESTOCK', quantity: 25 }) !== 75) throw new Error('Failed to restock');"),
    aTitle: "Discounted Cart Total Calculator",
    aDesc: "Write `calculateDiscountedTotal(items, discountRate)` returning discounted total rounded to 2 decimal places.",
    aStarter: lines("function calculateDiscountedTotal(items, discountRate) {", "  // return final discounted total rounded to 2 decimal places", "  return 0;", "}"),
    aHint: lines("const subtotal = items.reduce((acc, i) => acc + (i.price * i.qty), 0);", "const total = subtotal * (1 - discountRate);", "return Number(total.toFixed(2));"),
    aTest: lines("if (typeof calculateDiscountedTotal !== 'function') throw new Error('calculateDiscountedTotal not found');", "const items = [{ sku: 'A', price: 100, qty: 2 }, { sku: 'B', price: 50, qty: 1 }];", "if (calculateDiscountedTotal(items, 0.20) !== 200) throw new Error('Expected 200 for 20% discount on 250 subtotal');", "if (calculateDiscountedTotal(items, 0.0) !== 250) throw new Error('Expected 250 for 0% discount');")
  },
  {
    title: "REST API Design & Client Data Fetching: TanStack Query, SWR Caching & Revalidation",
    desc: "Master enterprise data fetching and REST API architecture: HTTP method idempotency guarantees, RFC 5861 Stale-While-Revalidate caching, in-flight request deduplication, optimistic UI mutations with rollback snapshots, and exponential backoff with full jitter.",
    syllabus: [
      "RESTful resource hierarchies, safe (GET, HEAD) vs idempotent (PUT, DELETE) methods, and UUIDv4 idempotency keys.",
      "The RFC 5861 Stale-While-Revalidate caching protocol, deterministic query key serialization, and staleTime vs gcTime memory tuning.",
      "Eliminating the Thundering Herd bottleneck via in-flight Promise pooling and lifecycle observer garbage collection.",
      "Zero-latency optimistic UI mutations with snapshot rollback closures and cache invalidation reconciliation.",
      "Network resilience pipelines: exponential backoff, randomized jitter, and stream cancellation with AbortController."
    ],
    eTitle: "Deterministic Query Key Serializer",
    eDesc: "Write `serializeQueryKey(key)` that turns a string or array containing primitive tokens and nested objects into a deterministic cache key string where object keys are sorted alphabetically.",
    eStarter: lines(
      "function serializeQueryKey(key) {",
      "  // Serialize array tokens with sorted object keys",
      "  return '';",
      "}"
    ),
    eHint: "if (typeof key === 'string') return key; return key.map(k => typeof k === 'object' && k !== null ? JSON.stringify(Object.keys(k).sort().reduce((a, c) => (a[c] = k[c], a), {})) : String(k)).join('::');",
    eTest: lines(
      "if (typeof serializeQueryKey !== 'function') throw new Error('serializeQueryKey not found');",
      "const k1 = ['jobs', { status: 'active', page: 1 }];",
      "const k2 = ['jobs', { page: 1, status: 'active' }];",
      "if (serializeQueryKey(k1) !== serializeQueryKey(k2)) throw new Error('Serialized keys should match');",
      "if (!serializeQueryKey(k1).includes('jobs::')) throw new Error('Expected separator');",
      "const k3 = ['users', 42];",
      "if (serializeQueryKey(k3) !== 'users::42') throw new Error('Expected users::42, got ' + serializeQueryKey(k3));"
    ),
    aTitle: "Exponential Backoff Calculator",
    aDesc: "Write `calculateBackoff(attempt, baseMs, maxMs)` that calculates retry delay using exponential backoff formula `Math.min(maxMs, baseMs * Math.pow(2, attempt))`.",
    aStarter: lines(
      "function calculateBackoff(attempt, baseMs, maxMs) {",
      "  // Return min(maxMs, baseMs * 2^attempt)",
      "  return 0;",
      "}"
    ),
    aHint: "return Math.min(maxMs, baseMs * Math.pow(2, attempt));",
    aTest: lines(
      "if (typeof calculateBackoff !== 'function') throw new Error('calculateBackoff not found');",
      "if (calculateBackoff(0, 100, 1000) !== 100) throw new Error('Attempt 0 should be 100');",
      "if (calculateBackoff(1, 100, 1000) !== 200) throw new Error('Attempt 1 should be 200');",
      "if (calculateBackoff(4, 100, 1000) !== 1000) throw new Error('Attempt 4 should cap at 1000');"
    )
  },
  {
    title: "Authentication & Session Management: JWT, HttpOnly Cookies, OAuth2 & Protected Route Guards",
    desc: "Architect enterprise full-stack authentication: stateless JWT cryptographic signatures, dual-token rotation with refresh token family reuse detection, XSS/CSRF mitigation via HttpOnly SameSite cookies, OAuth2 PKCE authorization flows, and declarative RBAC route guards.",
    syllabus: [
      "Stateless JWT cryptographic claim verification vs stateful session stores, selecting optimal revocation and latency topologies.",
      "The dual-token architecture: short-lived access tokens, sliding refresh token rotation, and token family reuse detection alarms.",
      "Hardening storage against XSS token exfiltration using HttpOnly Secure SameSite cookies and Double-Submit CSRF tokens.",
      "OAuth 2.0 Authorization Code Flow with PKCE for public single-page clients, securing federated identity provider handshakes.",
      "Declarative multi-tier route guards combining edge middleware redirect interception with client-side RBAC Auth Contexts."
    ],
    eTitle: "Double-Submit CSRF Validator",
    eDesc: "Write `verifyCsrfToken(cookieToken, headerToken, method)` that allows safe HTTP methods (GET, HEAD, OPTIONS) unconditionally, and requires matching non-empty tokens for mutative methods.",
    eStarter: lines(
      "function verifyCsrfToken(cookieToken, headerToken, method) {",
      "  // Safe methods pass; other methods require non-empty matching tokens",
      "  return false;",
      "}"
    ),
    eHint: "if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true; if (!cookieToken || !headerToken) return false; return cookieToken === headerToken;",
    eTest: lines(
      "if (typeof verifyCsrfToken !== 'function') throw new Error('verifyCsrfToken not found');",
      "if (!verifyCsrfToken(null, null, 'GET')) throw new Error('Safe GET should pass');",
      "if (verifyCsrfToken('abc', null, 'POST')) throw new Error('Missing header should fail');",
      "if (verifyCsrfToken('abc', 'xyz', 'POST')) throw new Error('Mismatch should fail');",
      "if (!verifyCsrfToken('abc', 'abc', 'POST')) throw new Error('Matching tokens should pass');"
    ),
    aTitle: "Token Expiration Checker",
    aDesc: "Write `isTokenExpired(expEpoch, currentEpoch)` that returns true if the token's expiration epoch is less than or equal to the current epoch.",
    aStarter: lines(
      "function isTokenExpired(expEpoch, currentEpoch) {",
      "  // Return true if token is expired",
      "  return false;",
      "}"
    ),
    aHint: "return expEpoch <= currentEpoch;",
    aTest: lines(
      "if (typeof isTokenExpired !== 'function') throw new Error('isTokenExpired not found');",
      "if (!isTokenExpired(100, 150)) throw new Error('100 <= 150 should be expired');",
      "if (isTokenExpired(200, 150)) throw new Error('200 > 150 should be active');"
    )
  },
  {
    title: "Server-Side Rendering (SSR) & Next.js Architecture: Hydration Mechanics, RSC & Streaming",
    desc: "Master modern full-stack rendering architectures: CSR vs SSR vs SSG vs ISR rendering matrix, the React hydration contract and mismatch resolution, React Server Components (RSC) wire format, asynchronous streaming SSR with Suspense, and the Server-Client serialization boundary.",
    syllabus: [
      "Evaluating web pages across the rendering spectrum (CSR, SSR, SSG, ISR), optimizing for TTFB, SEO, and compute cost.",
      "Upholding the React Hydration Contract, eliminating client-server DOM mismatches caused by browser globals or invalid nesting.",
      "Harnessing React Server Components (RSC) to execute zero-bundle-size dependencies on the server and stream UI via the RSC Wire Format.",
      "Deploying Asynchronous Streaming SSR with Suspense boundaries, flushing critical shells immediately and executing out-of-order DOM swapping.",
      "Architecting component hierarchies across the Server-Client boundary using serializable props contracts and the Component Slot Pattern."
    ],
    eTitle: "Rendering Strategy Classifier",
    eDesc: "Write `classifyRenderingStrategy(isStatic, hasDynamicAuth, revalidateSeconds)` that returns 'SSR' if hasDynamicAuth is true, 'SSG' if isStatic is true, 'ISR' if revalidateSeconds > 0, and 'CSR' otherwise.",
    eStarter: lines(
      "function classifyRenderingStrategy(isStatic, hasDynamicAuth, revalidateSeconds) {",
      "  // Return 'SSR', 'SSG', 'ISR', or 'CSR'",
      "  return '';",
      "}"
    ),
    eHint: "if (hasDynamicAuth) return 'SSR'; if (isStatic) return 'SSG'; if (revalidateSeconds > 0) return 'ISR'; return 'CSR';",
    eTest: lines(
      "if (typeof classifyRenderingStrategy !== 'function') throw new Error('classifyRenderingStrategy not found');",
      "if (classifyRenderingStrategy(false, true, 0) !== 'SSR') throw new Error('Dynamic auth should give SSR');",
      "if (classifyRenderingStrategy(true, false, 0) !== 'SSG') throw new Error('Static should give SSG');",
      "if (classifyRenderingStrategy(false, false, 60) !== 'ISR') throw new Error('Revalidation should give ISR');"
    ),
    aTitle: "Hydration Mismatch Detector",
    aDesc: "Write `detectHydrationMismatch(serverText, clientText)` that returns `{ matched: boolean, serverText, clientText }` indicating whether the server and client text align.",
    aStarter: lines(
      "function detectHydrationMismatch(serverText, clientText) {",
      "  // Return object with matched boolean",
      "  return null;",
      "}"
    ),
    aHint: "return { matched: serverText === clientText, serverText, clientText };",
    aTest: lines(
      "if (typeof detectHydrationMismatch !== 'function') throw new Error('detectHydrationMismatch not found');",
      "const resMatch = detectHydrationMismatch('hello', 'hello');",
      "if (!resMatch.matched) throw new Error('Matching text should have matched: true');",
      "const resDiff = detectHydrationMismatch('10:00', '10:01');",
      "if (resDiff.matched) throw new Error('Divergent text should have matched: false');"
    )
  },
  {
    title: "Full-Stack Database Integration: PostgreSQL, Prisma/Drizzle ORM & API Route Handlers",
    desc: "Master industrial-grade database integration: relational schema design and B-Tree indexing, ACID transactions and PostgreSQL isolation levels, type-safe ORMs (Prisma/Drizzle) and N+1 query elimination, serverless connection pooling via PgBouncer, and secure Next.js API route handlers with Zod.",
    syllabus: [
      "Designing normalized 3NF relational schemas enforcing foreign key integrity and sub-millisecond B-Tree composite indexing.",
      "Enforcing ACID guarantees, atomic rollbacks, explicit row locks (FOR UPDATE), and evaluating PostgreSQL transaction isolation levels.",
      "Leveraging type-safe ORMs (Prisma, Drizzle) while eliminating the N+1 query bottleneck using eager relation joining and DataLoader batching.",
      "Shielding PostgreSQL against serverless connection exhaustion using transaction poolers like PgBouncer and edge-native managers.",
      "Building enterprise API Route Handlers combining Zod schema validation, edge/node runtime selection, and sanitized HTTP error envelopes."
    ],
    eTitle: "Job Payload Validator",
    eDesc: "Write `validateJobPayload(payload)` that validates that title is at least 3 chars, company at least 2 chars, and stage is one of APPLIED, INTERVIEWING, OFFER, or REJECTED. Returns `{ valid: boolean, errors: string[] }`.",
    eStarter: lines(
      "function validateJobPayload(payload) {",
      "  // Return { valid: boolean, errors: string[] }",
      "  return null;",
      "}"
    ),
    eHint: "const errors = []; if (!payload || typeof payload.title !== 'string' || payload.title.trim().length < 3) errors.push('invalid title'); if (!payload || typeof payload.company !== 'string' || payload.company.trim().length < 2) errors.push('invalid company'); const stages = ['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED']; if (!payload || !stages.includes(payload.stage)) errors.push('invalid stage'); return { valid: errors.length === 0, errors };",
    eTest: lines(
      "if (typeof validateJobPayload !== 'function') throw new Error('validateJobPayload not found');",
      "const ok = validateJobPayload({ title: 'Architect', company: 'Google', stage: 'OFFER' });",
      "if (!ok.valid) throw new Error('Valid payload should pass');",
      "const bad = validateJobPayload({ title: 'J', company: '', stage: 'PENDING' });",
      "if (bad.valid || bad.errors.length !== 3) throw new Error('Invalid payload should return 3 errors');"
    ),
    aTitle: "Batch ID Deduplicator",
    aDesc: "Write `deduplicateBatchIds(ids)` that takes an array of string identifiers, deduplicates them, and returns them sorted alphabetically.",
    aStarter: lines(
      "function deduplicateBatchIds(ids) {",
      "  // Return unique sorted IDs array",
      "  return [];",
      "}"
    ),
    aHint: "return Array.from(new Set(ids)).sort();",
    aTest: lines(
      "if (typeof deduplicateBatchIds !== 'function') throw new Error('deduplicateBatchIds not found');",
      "const res = deduplicateBatchIds(['c2', 'c1', 'c2', 'c3', 'c1']);",
      "if (res.length !== 3 || res[0] !== 'c1' || res[1] !== 'c2' || res[2] !== 'c3') throw new Error('Should deduplicate and sort');",
      "const res2 = deduplicateBatchIds(['z', 'a', 'z']);",
      "if (res2.length !== 2 || res2[0] !== 'a' || res2[1] !== 'z') throw new Error('Should sort z and a');"
    )
  },
  {
    title: "Month 1 Capstone: Enterprise Full-Stack Job Tracker & Career OS Architecture",
    desc: "Architect and deploy the Month 1 Capstone enterprise platform: multi-tier system topology, normalized client cache with optimistic transactional rollbacks, full-stack defense-in-depth security audit (CSP, CORS, RLS), Core Web Vitals performance profiling (LCP, INP, CLS), and production deployment verification gates.",
    syllabus: [
      "Synthesizing the complete multi-tier enterprise architecture: Edge Network, Hybrid RSC & Streaming SSR, Interactive Islands, and PostgreSQL.",
      "Implementing a normalized client cache engine supporting O(1) dictionary lookups, single-point-of-truth updates, and optimistic rollbacks.",
      "Executing a full-stack security audit implementing Content Security Policy (CSP), HttpOnly SameSite cookies, anti-CSRF tokens, and Row-Level Security.",
      "Optimizing Core Web Vitals to achieve elite ratings: LCP under 2.5s via SSR, INP under 200ms via deferred values, and CLS under 0.1 via aspect ratios.",
      "Enforcing rigorous CI/CD Production Deployment Gates: zero TypeScript errors, 100% test pass rate, clean security audits, and database migrations."
    ],
    eTitle: "Deployment Gate Evaluator",
    eDesc: "Write `evaluateDeploymentGate(checklist)` that verifies 5 mandatory boolean checks: typescriptCompiled, unitTestsPassed, securityAuditClean, webVitalsWithinBudget, databaseMigrationsApplied. Returns `{ approved: boolean, score: number }`.",
    eStarter: lines(
      "function evaluateDeploymentGate(checklist) {",
      "  // Return { approved: boolean, score: number }",
      "  return null;",
      "}"
    ),
    eHint: "const keys = ['typescriptCompiled', 'unitTestsPassed', 'securityAuditClean', 'webVitalsWithinBudget', 'databaseMigrationsApplied']; const passed = keys.filter(k => checklist && checklist[k] === true); return { approved: passed.length === keys.length, score: Math.round((passed.length / keys.length) * 100) };",
    eTest: lines(
      "if (typeof evaluateDeploymentGate !== 'function') throw new Error('evaluateDeploymentGate not found');",
      "const p = evaluateDeploymentGate({ typescriptCompiled: true, unitTestsPassed: true, securityAuditClean: true, webVitalsWithinBudget: true, databaseMigrationsApplied: true });",
      "if (!p.approved || p.score !== 100) throw new Error('Complete checklist should be approved with score 100');",
      "const f = evaluateDeploymentGate({ typescriptCompiled: true, unitTestsPassed: true, securityAuditClean: true, webVitalsWithinBudget: true, databaseMigrationsApplied: false });",
      "if (f.approved || f.score !== 80) throw new Error('Incomplete checklist should not be approved');"
    ),
    aTitle: "Job List Normalizer",
    aDesc: "Write `normalizeJobList(jobs)` that takes an array of job objects with `id` and returns a normalized `{ byId: Record<string, Job>, allIds: string[] }` object.",
    aStarter: lines(
      "function normalizeJobList(jobs) {",
      "  // Return { byId: Record<string, Job>, allIds: string[] }",
      "  return null;",
      "}"
    ),
    aHint: "const byId = {}; const allIds = []; (jobs || []).forEach(j => { byId[j.id] = j; allIds.push(j.id); }); return { byId, allIds };",
    aTest: lines(
      "if (typeof normalizeJobList !== 'function') throw new Error('normalizeJobList not found');",
      "const jobs = [{ id: 'j1', title: 'Architect' }, { id: 'j2', title: 'Lead' }];",
      "const norm = normalizeJobList(jobs);",
      "if (norm.allIds.length !== 2 || norm.byId['j1'].title !== 'Architect' || norm.byId['j2'].title !== 'Lead') throw new Error('Normalization mismatch');",
      "const empty = normalizeJobList([]);",
      "if (empty.allIds.length !== 0 || Object.keys(empty.byId).length !== 0) throw new Error('Empty list should produce empty normalization');"
    )
  },
  // ── BLOCK 7 (MONTH 2): Advanced React State Machines & Concurrency (Days 31–35) ──
  {
    title: "The React Concurrent Runtime: Fiber Tree, Work-in-Progress & Cooperatively Yielding Reconciler",
    desc: "Understand the Fiber reconciler, cooperative time-slicing, dual-buffering work loop, and priority lanes that empower non-blocking React 18/19 rendering.",
    syllabus: [
      "Fiber node tree structure (child, sibling, return).",
      "Dual-buffering: current vs workInProgress trees.",
      "Work loop and cooperative time-slicing."
    ],
    eTitle: "Fiber Node Linker",
    eDesc: "Write `linkFiberNodes(parent, child, sibling)` that returns an object representing the Fiber relationships: `{ child, sibling, return: parent }`.",
    eStarter: lines("function linkFiberNodes(parent, child, sibling) {", "  // Return fiber node links", "  return {};", "}"),
    eHint: "return { child: child, sibling: sibling, return: parent };",
    eTest: lines(
      "if (typeof linkFiberNodes !== 'function') throw new Error('linkFiberNodes not found');",
      "const f = linkFiberNodes('Root', 'App', null);",
      "if (f.return !== 'Root' || f.child !== 'App' || f.sibling !== null) throw new Error('Fiber links mismatch 1');",
      "const f2 = linkFiberNodes('App', 'Header', 'Sidebar');",
      "if (f2.return !== 'App' || f2.child !== 'Header' || f2.sibling !== 'Sidebar') throw new Error('Fiber links mismatch 2');"
    ),
    aTitle: "Priority Lane Classifier",
    aDesc: "Write `classifyLane(laneId)` returning `'urgent'` for 1-2, `'transition'` for 3-5, `'idle'` for 6+.",
    aStarter: lines("function classifyLane(laneId) {", "  // Return lane classification string", "  return '';", "}"),
    aHint: "if (laneId <= 2) return 'urgent'; if (laneId <= 5) return 'transition'; return 'idle';",
    aTest: lines(
      "if (typeof classifyLane !== 'function') throw new Error('classifyLane not found');",
      "if (classifyLane(1) !== 'urgent') throw new Error('Lane 1 should be urgent');",
      "if (classifyLane(4) !== 'transition') throw new Error('Lane 4 should be transition');",
      "if (classifyLane(8) !== 'idle') throw new Error('Lane 8 should be idle');"
    )
  },
  {
    title: "Concurrent Interruptible Rendering: useTransition, isPending & Non-Blocking Priority Slicing",
    desc: "Master startTransition and isPending to prevent UI freezing during heavy computational updates while keeping high-frequency keystrokes responsive at 60 FPS.",
    syllabus: [
      "Urgent vs transition updates in React 18/19.",
      "startTransition semantics and yield points.",
      "Designing non-blocking loading states with isPending."
    ],
    eTitle: "Transition Scheduler",
    eDesc: "Write `scheduleUpdate(isUrgent, payload)` returning `{ priority: isUrgent ? 'high' : 'low', payload: payload, isPending: !isUrgent }`.",
    eStarter: lines("function scheduleUpdate(isUrgent, payload) {", "  // Return update descriptor", "  return {};", "}"),
    eHint: "return { priority: isUrgent ? 'high' : 'low', payload: payload, isPending: !isUrgent };",
    eTest: lines(
      "if (typeof scheduleUpdate !== 'function') throw new Error('scheduleUpdate not found');",
      "const u1 = scheduleUpdate(true, 'text');",
      "if (u1.priority !== 'high' || u1.isPending !== false) throw new Error('Urgent update failed');",
      "const u2 = scheduleUpdate(false, [1, 2, 3]);",
      "if (u2.priority !== 'low' || u2.isPending !== true) throw new Error('Transition update failed');"
    ),
    aTitle: "Pending Badge Formatter",
    aDesc: "Write `formatPendingBadge(isPending, query)` that returns `'Updating (' + query + ')...'` when pending, otherwise `'Synced'`.",
    aStarter: lines("function formatPendingBadge(isPending, query) {", "  // Return badge string", "  return '';", "}"),
    aHint: "return isPending ? 'Updating (' + query + ')...' : 'Synced';",
    aTest: lines(
      "if (typeof formatPendingBadge !== 'function') throw new Error('formatPendingBadge not found');",
      "if (formatPendingBadge(true, 'React') !== 'Updating (React)...') throw new Error('Pending format failed');",
      "if (formatPendingBadge(false, 'React') !== 'Synced') throw new Error('Synced format failed');"
    )
  },
  {
    title: "Responsive Input Buffering with useDeferredValue, Stale Visuals & Suspense Fallbacks",
    desc: "Differentiate useDeferredValue from debounce/throttle, prevent premature child re-renders with React.memo, and build stale visual cues.",
    syllabus: [
      "useDeferredValue vs timer-based debounce.",
      "Visual staleness signaling (query !== deferredQuery).",
      "Fiber bailouts with React.memo."
    ],
    eTitle: "Staleness Checker",
    eDesc: "Write `checkStaleness(currentVal, deferredVal)` returning `{ isStale: currentVal !== deferredVal, opacity: currentVal !== deferredVal ? 0.6 : 1.0 }`.",
    eStarter: lines("function checkStaleness(currentVal, deferredVal) {", "  // Check if value is stale and return opacity", "  return {};", "}"),
    eHint: "const isStale = currentVal !== deferredVal; return { isStale: isStale, opacity: isStale ? 0.6 : 1.0 };",
    eTest: lines(
      "if (typeof checkStaleness !== 'function') throw new Error('checkStaleness not found');",
      "const s1 = checkStaleness('apple', 'app');",
      "if (s1.isStale !== true || s1.opacity !== 0.6) throw new Error('Stale check failed');",
      "const s2 = checkStaleness('apple', 'apple');",
      "if (s2.isStale !== false || s2.opacity !== 1.0) throw new Error('Synced check failed');"
    ),
    aTitle: "Memoized Filter Bailout",
    aDesc: "Write `filterWithBailout(items, prevQuery, nextQuery, prevResult)` that returns `prevResult` if `prevQuery === nextQuery`, otherwise filters items where `item.indexOf(nextQuery) !== -1`.",
    aStarter: lines("function filterWithBailout(items, prevQuery, nextQuery, prevResult) {", "  // Return cached result if queries match", "  return [];", "}"),
    aHint: "if (prevQuery === nextQuery) return prevResult; return items.filter(x => x.indexOf(nextQuery) !== -1);",
    aTest: lines(
      "if (typeof filterWithBailout !== 'function') throw new Error('filterWithBailout not found');",
      "const cache = ['a'];",
      "if (filterWithBailout(['a', 'b'], 'q', 'q', cache) !== cache) throw new Error('Bailout should return cached instance');",
      "const res = filterWithBailout(['alpha', 'beta'], 'a', 'bet', cache);",
      "if (res.length !== 1 || res[0] !== 'beta') throw new Error('Filter calculation failed');"
    )
  },
  {
    title: "Finite State Machines in React: Predictable State Transitions & useReducer with Discriminated Unions",
    desc: "Eliminate impossible UI states and boolean explosion by building finite state machines with useReducer, tagged union actions, and token invalidation.",
    syllabus: [
      "Boolean explosion vs finite state models.",
      "Pure transition matrices with useReducer.",
      "Monotonic tokens for race condition cancellation."
    ],
    eTitle: "FSM Transition Function",
    eDesc: "Write `transition(state, event)` where states are `'IDLE'`, `'LOADING'`, `'SUCCESS'`. From `'IDLE'`, `'FETCH'` transitions to `'LOADING'`. From `'LOADING'`, `'RESOLVE'` transitions to `'SUCCESS'`. Any other event returns current state.",
    eStarter: lines("function transition(state, event) {", "  // Return next state string", "  return state;", "}"),
    eHint: "if (state === 'IDLE' && event === 'FETCH') return 'LOADING'; if (state === 'LOADING' && event === 'RESOLVE') return 'SUCCESS'; return state;",
    eTest: lines(
      "if (typeof transition !== 'function') throw new Error('transition not found');",
      "if (transition('IDLE', 'FETCH') !== 'LOADING') throw new Error('IDLE -> FETCH failed');",
      "if (transition('LOADING', 'RESOLVE') !== 'SUCCESS') throw new Error('LOADING -> RESOLVE failed');",
      "if (transition('SUCCESS', 'FETCH') !== 'SUCCESS') throw new Error('Invalid transition should return same state');"
    ),
    aTitle: "Token Invalidation Guard",
    aDesc: "Write `shouldCommitResult(activeToken, incomingToken)` returning `true` only if `incomingToken === activeToken`.",
    aStarter: lines("function shouldCommitResult(activeToken, incomingToken) {", "  // Return boolean guard", "  return false;", "}"),
    aHint: "return activeToken === incomingToken;",
    aTest: lines(
      "if (typeof shouldCommitResult !== 'function') throw new Error('shouldCommitResult not found');",
      "if (shouldCommitResult(5, 5) !== true) throw new Error('Matching token should commit');",
      "if (shouldCommitResult(5, 4) !== false) throw new Error('Stale token should be rejected');"
    )
  },
  {
    title: "Milestone 6: Concurrent Data Grid: 10,000 Row Asynchronous Filter & Priority Slicing Engine",
    desc: "Architect an enterprise-grade concurrent data grid handling 10,000 records. Integrate finite state machine lifecycle management, urgent keystroke buffering, deferred value filtering, and cooperative time-slicing to guarantee a 60 FPS responsive UI under heavy synthetic computation.",
    syllabus: [
      "Enterprise data grid state machine architecture.",
      "Non-blocking cooperative filtering with priority cancellation.",
      "Viewport virtualization (scrollTop, rowHeight, overscan).",
      "Automated latency benchmarking for 60 FPS compliance."
    ],
    eTitle: "Virtual Viewport Calculator",
    eDesc: "Write `getVirtualSlice(scrollTop, rowHeight, viewportHeight, overscan)` returning `{ startIndex, endIndex }`. `startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)`, `endIndex = Math.floor((scrollTop + viewportHeight) / rowHeight) + overscan`.",
    eStarter: lines("function getVirtualSlice(scrollTop, rowHeight, viewportHeight, overscan) {", "  // Return startIndex and endIndex", "  return {};", "}"),
    eHint: "const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan); const end = Math.floor((scrollTop + viewportHeight) / rowHeight) + overscan; return { startIndex: start, endIndex: end };",
    eTest: lines(
      "if (typeof getVirtualSlice !== 'function') throw new Error('getVirtualSlice not found');",
      "const slice = getVirtualSlice(400, 40, 200, 2);",
      "if (slice.startIndex !== 8 || slice.endIndex !== 17) throw new Error('Wrong virtual slice calculation');",
      "const slice0 = getVirtualSlice(0, 40, 100, 2);",
      "if (slice0.startIndex !== 0 || slice0.endIndex !== 4) throw new Error('Wrong virtual slice at top');"
    ),
    aTitle: "Frame Budget Latency Auditor",
    aDesc: "Write `auditLatency(elapsedMs)` returning `'pass'` if `elapsedMs < 16.6`, otherwise `'jank'`.",
    aStarter: lines("function auditLatency(elapsedMs) {", "  // Audit 60 FPS budget", "  return '';", "}"),
    aHint: "return elapsedMs < 16.6 ? 'pass' : 'jank';",
    aTest: lines(
      "if (typeof auditLatency !== 'function') throw new Error('auditLatency not found');",
      "if (auditLatency(4.2) !== 'pass') throw new Error('4.2ms should pass');",
      "if (auditLatency(16.5) !== 'pass') throw new Error('16.5ms should pass');",
      "if (auditLatency(18.0) !== 'jank') throw new Error('18ms should be jank');"
    )
  }
,
  // ── BLOCK 8 (MONTH 2): Frame Budget, Lane Scheduling & 10,000-Node Visual Graph Filter (Days 36–40) ──
  {
    title: "The 16ms Frame Budget: Cooperative Multitasking, MessageChannel Scheduler & Time Slicing",
    desc: "Master the 16.6ms frame budget: explore browser rendering pipelines, why setTimeout 4ms clamping causes starvation, how React's Scheduler leverages MessageChannel macro-tasks, and how cooperative time-slicing prevents UI thread jank.",
    syllabus: [
      "Browser 16.6ms frame budgets and V-Sync intervals.",
      "HTML5 4ms setTimeout clamping and MessageChannel alternatives.",
      "React Scheduler cooperative 5ms time-slicing with shouldYield()."
    ],
    eTitle: "Frame Deadline Auditor",
    eDesc: "Write `auditFrameBudget(durationMs)` returning `{ isJank: durationMs > 16.66, headroom: Math.max(0, +(16.66 - durationMs).toFixed(2)) }`.",
    eStarter: lines("function auditFrameBudget(durationMs) {", "  // Return frame budget status", "  return {};", "}"),
    eHint: "const isJank = durationMs > 16.66; const headroom = Math.max(0, +(16.66 - durationMs).toFixed(2)); return { isJank: isJank, headroom: headroom };",
    eTest: lines(
      "if (typeof auditFrameBudget !== 'function') throw new Error('auditFrameBudget not found');",
      "const a1 = auditFrameBudget(5.0);",
      "if (a1.isJank !== false || a1.headroom !== 11.66) throw new Error('5ms check failed');",
      "const a2 = auditFrameBudget(20.0);",
      "if (a2.isJank !== true || a2.headroom !== 0) throw new Error('20ms check failed');"
    ),
    aTitle: "Time Slice Yield Guard",
    aDesc: "Write `shouldYieldSlice(startTimeMs, currentTimeMs, sliceLimitMs)` returning `(currentTimeMs - startTimeMs) >= sliceLimitMs`.",
    aStarter: lines("function shouldYieldSlice(startTimeMs, currentTimeMs, sliceLimitMs) {", "  // Return boolean yield decision", "  return false;", "}"),
    aHint: "return (currentTimeMs - startTimeMs) >= sliceLimitMs;",
    aTest: lines(
      "if (typeof shouldYieldSlice !== 'function') throw new Error('shouldYieldSlice not found');",
      "if (shouldYieldSlice(100, 104, 5) !== false) throw new Error('4ms elapsed should not yield');",
      "if (shouldYieldSlice(100, 105, 5) !== true) throw new Error('5ms elapsed should yield');",
      "if (shouldYieldSlice(100, 108, 5) !== true) throw new Error('8ms elapsed should yield');"
    )
  },
  {
    title: "Lane Priority Architecture: Bitmask Priority Scheduling (Sync, Continuous, Default, Idle Lanes)",
    desc: "Master React's 31-bit Lane priority model: explore the mathematical transition from numeric priorities to bitwise bitmasks, understand least-significant bit extraction (lanes & -lanes), lane merging, and priority starvation escalation.",
    syllabus: [
      "31-bit integer bitmasks vs scalar priorities.",
      "Two's complement least-significant bit extraction (lanes & -lanes).",
      "Lane starvation detection and synchronous promotion."
    ],
    eTitle: "Highest Priority Lane Isolator",
    eDesc: "Write `isolateHighestPriorityLane(lanes)` returning `lanes & -lanes`.",
    eStarter: lines("function isolateHighestPriorityLane(lanes) {", "  // Return single highest priority bit", "  return 0;", "}"),
    eHint: "return lanes & -lanes;",
    eTest: lines(
      "if (typeof isolateHighestPriorityLane !== 'function') throw new Error('isolateHighestPriorityLane not found');",
      "if (isolateHighestPriorityLane(12) !== 4) throw new Error('12 should isolate 4');",
      "if (isolateHighestPriorityLane(5) !== 1) throw new Error('5 should isolate 1');",
      "if (isolateHighestPriorityLane(16) !== 16) throw new Error('16 should isolate 16');"
    ),
    aTitle: "Lane Membership Checker",
    aDesc: "Write `hasLane(pendingLanes, targetLane)` returning `(pendingLanes & targetLane) !== 0`.",
    aStarter: lines("function hasLane(pendingLanes, targetLane) {", "  // Test bitmask membership", "  return false;", "}"),
    aHint: "return (pendingLanes & targetLane) !== 0;",
    aTest: lines(
      "if (typeof hasLane !== 'function') throw new Error('hasLane not found');",
      "if (hasLane(0b0110, 0b0010) !== true) throw new Error('0b0010 should exist in 0b0110');",
      "if (hasLane(0b0110, 0b0001) !== false) throw new Error('0b0001 should not exist in 0b0110');",
      "if (hasLane(0b1111, 0b1000) !== true) throw new Error('0b1000 should exist in 0b1111');"
    )
  },
  {
    title: "Non-Urgent Updates with useTransition: Preventing UI Freezes on Heavy State Computations",
    desc: "Master React's useTransition hook: differentiate urgent vs transition updates, leverage isPending for seamless optimistic visual feedback, observe interruptible rendering under high-frequency typing, and implement a production-grade transition scheduler in JavaScript.",
    syllabus: [
      "Urgent SyncLane vs non-urgent TransitionLane execution.",
      "isPending synchronous toggle and visual continuity.",
      "Preempting and discarding stale in-flight transitions."
    ],
    eTitle: "Optimistic Visual Styler",
    eDesc: "Write `getOptimisticStyle(isPending)` returning `{ opacity: isPending ? 0.6 : 1.0, cursor: isPending ? 'progress' : 'default', isUpdating: isPending }`.",
    eStarter: lines("function getOptimisticStyle(isPending) {", "  // Return style object based on isPending", "  return {};", "}"),
    eHint: "return { opacity: isPending ? 0.6 : 1.0, cursor: isPending ? 'progress' : 'default', isUpdating: isPending };",
    eTest: lines(
      "if (typeof getOptimisticStyle !== 'function') throw new Error('getOptimisticStyle not found');",
      "const s1 = getOptimisticStyle(true);",
      "if (s1.opacity !== 0.6 || s1.cursor !== 'progress' || s1.isUpdating !== true) throw new Error('Pending style failed');",
      "const s2 = getOptimisticStyle(false);",
      "if (s2.opacity !== 1.0 || s2.cursor !== 'default' || s2.isUpdating !== false) throw new Error('Idle style failed');"
    ),
    aTitle: "In-Flight Preemption Guard",
    aDesc: "Write `auditPreemption(activeTask, incomingUrgentQuery)` returning `{ shouldAbort: activeTask !== null && activeTask.query !== incomingUrgentQuery, savedUnits: (activeTask !== null && activeTask.query !== incomingUrgentQuery) ? (activeTask.total - activeTask.done) : 0 }`.",
    aStarter: lines("function auditPreemption(activeTask, incomingUrgentQuery) {", "  // Determine if in-flight task must be aborted", "  return {};", "}"),
    aHint: "const shouldAbort = activeTask !== null && activeTask.query !== incomingUrgentQuery; const savedUnits = shouldAbort ? (activeTask.total - activeTask.done) : 0; return { shouldAbort: shouldAbort, savedUnits: savedUnits };",
    aTest: lines(
      "if (typeof auditPreemption !== 'function') throw new Error('auditPreemption not found');",
      "const res1 = auditPreemption({ query: 'A', total: 100, done: 30 }, 'AB');",
      "if (res1.shouldAbort !== true || res1.savedUnits !== 70) throw new Error('Preemption abort failed');",
      "const res2 = auditPreemption(null, 'A');",
      "if (res2.shouldAbort !== false || res2.savedUnits !== 0) throw new Error('No task check failed');"
    )
  },
  {
    title: "Responsive Search with useDeferredValue: Debouncing vs Deferred Rendering Benchmarks",
    desc: "Master React's useDeferredValue hook: explore the dual-render lifecycle, benchmark deferred rendering against fixed timer debouncing, implement visual staleness signaling (query !== deferredQuery), and combine deferred values with React.memo bailouts.",
    syllabus: [
      "Two-phase rendering: Phase 1 urgent vs Phase 2 deferred.",
      "Visual staleness signaling (query !== deferredQuery).",
      "React.memo bailout optimization for child trees."
    ],
    eTitle: "Deferred Staleness Evaluator",
    eDesc: "Write `evaluateStaleness(rawQuery, deferredQuery)` returning `{ isStale: rawQuery !== deferredQuery, badge: rawQuery !== deferredQuery ? 'Updating...' : 'Synced' }`.",
    eStarter: lines("function evaluateStaleness(rawQuery, deferredQuery) {", "  // Return staleness evaluation", "  return {};", "}"),
    eHint: "const isStale = rawQuery !== deferredQuery; return { isStale: isStale, badge: isStale ? 'Updating...' : 'Synced' };",
    eTest: lines(
      "if (typeof evaluateStaleness !== 'function') throw new Error('evaluateStaleness not found');",
      "const s1 = evaluateStaleness('React', 'Rea');",
      "if (s1.isStale !== true || s1.badge !== 'Updating...') throw new Error('Stale evaluation failed');",
      "const s2 = evaluateStaleness('React', 'React');",
      "if (s2.isStale !== false || s2.badge !== 'Synced') throw new Error('Synced evaluation failed');"
    ),
    aTitle: "React.memo Prop Bailout Guard",
    aDesc: "Write `shouldMemoBailout(prevProp, nextProp)` returning `prevProp === nextProp`.",
    aStarter: lines("function shouldMemoBailout(prevProp, nextProp) {", "  // Return boolean bailout decision", "  return false;", "}"),
    aHint: "return prevProp === nextProp;",
    aTest: lines(
      "if (typeof shouldMemoBailout !== 'function') throw new Error('shouldMemoBailout not found');",
      "if (shouldMemoBailout('Rea', 'Rea') !== true) throw new Error('Identical props should bailout');",
      "if (shouldMemoBailout('Rea', 'React') !== false) throw new Error('Changed props should re-render');"
    )
  },
  {
    title: "Milestone 7: Low-Latency 10,000-Node Visual Graph Filter with useTransition & Time Slicing",
    desc: "Architect an enterprise-grade 10,000-node interactive visual graph filtering engine. Synthesize the 16.6ms frame budget, 31-bit Lane priority bitmasks, useTransition interruptibility, useDeferredValue staleness cues, and spatial viewport partitioning to achieve an unyielding 60 FPS responsive UI under massive computational load.",
    syllabus: [
      "10,000-node visual graph contiguous memory topology.",
      "Dual-priority search input and cooperative 5ms slicing.",
      "Bounding-box spatial viewport partitioning and GPU culling.",
      "Automated 16.6ms frame budget and zero TBT verification."
    ],
    eTitle: "Spatial Bounding-Box Culler",
    eDesc: "Write `isNodeInViewport(node, minX, minY, maxX, maxY)` returning `node.x >= minX && node.x <= maxX && node.y >= minY && node.y <= maxY`.",
    eStarter: lines("function isNodeInViewport(node, minX, minY, maxX, maxY) {", "  // Return true if node is within viewport bounds", "  return false;", "}"),
    eHint: "return node.x >= minX && node.x <= maxX && node.y >= minY && node.y <= maxY;",
    eTest: lines(
      "if (typeof isNodeInViewport !== 'function') throw new Error('isNodeInViewport not found');",
      "if (isNodeInViewport({ x: 400, y: 300 }, 0, 0, 800, 600) !== true) throw new Error('Inside node check failed');",
      "if (isNodeInViewport({ x: 900, y: 300 }, 0, 0, 800, 600) !== false) throw new Error('Outside node check failed');",
      "if (isNodeInViewport({ x: 400, y: 700 }, 0, 0, 800, 600) !== false) throw new Error('Outside Y node check failed');"
    ),
    aTitle: "60 FPS Frame Budget Latency Verifier",
    aDesc: "Write `verifyFrameCompliance(maxSliceMs, tbtMs)` returning `{ isCompliant: maxSliceMs <= 16.66 && tbtMs === 0, status: (maxSliceMs <= 16.66 && tbtMs === 0) ? '60 FPS PASS' : 'JANK FAIL' }`.",
    aStarter: lines("function verifyFrameCompliance(maxSliceMs, tbtMs) {", "  // Verify 60 FPS compliance", "  return {};", "}"),
    aHint: "const isCompliant = maxSliceMs <= 16.66 && tbtMs === 0; return { isCompliant: isCompliant, status: isCompliant ? '60 FPS PASS' : 'JANK FAIL' };",
    aTest: lines(
      "if (typeof verifyFrameCompliance !== 'function') throw new Error('verifyFrameCompliance not found');",
      "const r1 = verifyFrameCompliance(5.0, 0);",
      "if (r1.isCompliant !== true || r1.status !== '60 FPS PASS') throw new Error('5ms check failed');",
      "const r2 = verifyFrameCompliance(20.0, 3.34);",
      "if (r2.isCompliant !== false || r2.status !== 'JANK FAIL') throw new Error('Jank check failed');"
    )
  }
,
  {
    title: "React Server Components (RSC): The Server-Client Boundary, Zero-Bundle-Size Dependencies & RSC Wire Format",
    desc: "Master the architecture of React Server Components: understand the server-client boundary, how the \"use client\" directive marks module boundaries, offloading massive dependencies for zero-bundle client weight, line-by-line RSC wire stream format decoding, and complete runtime simulation.",
    syllabus: [
      "The Server-Client dichotomy and zero client bundle size.",
      "The 'use client' boundary and JSON serialization rules.",
      "Offloading heavy AST dependencies to server Node.js.",
      "Line-by-line RSC wire stream decoding and client VDOM."
    ],
    eTitle: "RSC Boundary Prop Validator",
    eDesc: "Write `isSerializableRSCProp(value)` returning true if value is a string, number, boolean, null, or undefined, or false if value is a function or symbol.",
    eStarter: lines("function isSerializableRSCProp(value) {", "  // Return boolean serialization safety", "  return false;", "}"),
    eHint: "const t = typeof value; return t === 'string' || t === 'number' || t === 'boolean' || value === null || value === undefined;",
    eTest: lines(
      "if (typeof isSerializableRSCProp !== 'function') throw new Error('isSerializableRSCProp not found');",
      "if (isSerializableRSCProp('hello') !== true) throw new Error('String check failed');",
      "if (isSerializableRSCProp(42) !== true) throw new Error('Number check failed');",
      "if (isSerializableRSCProp(() => {}) !== false) throw new Error('Function check failed');",
      "if (isSerializableRSCProp(Symbol('react')) !== false) throw new Error('Symbol check failed');"
    ),
    aTitle: "RSC Client Bundle Reducer",
    aDesc: "Write `calculateBundleSavings(traditionalKb, serverOnlyKb)` returning `{ savedKb: serverOnlyKb, percentage: +((serverOnlyKb / traditionalKb) * 100).toFixed(1) }`.",
    aStarter: lines("function calculateBundleSavings(traditionalKb, serverOnlyKb) {", "  // Return savings object", "  return {};", "}"),
    aHint: "const pct = +((serverOnlyKb / traditionalKb) * 100).toFixed(1); return { savedKb: serverOnlyKb, percentage: pct };",
    aTest: lines(
      "if (typeof calculateBundleSavings !== 'function') throw new Error('calculateBundleSavings not found');",
      "const res = calculateBundleSavings(1000, 700);",
      "if (res.savedKb !== 700 || res.percentage !== 70.0) throw new Error('Bundle savings calculation failed');"
    )
  },
  {
    title: "Streaming SSR with Suspense: HTML Streaming, Early Flushes & Out-of-Order Chunk Insertion",
    desc: "Master asynchronous streaming server-side rendering with Suspense: eliminate TTFB bottlenecks, flush document heads early, orchestrate out-of-order chunk streaming via template replacements ($RC), manage mid-stream error recovery, and implement a full streaming SSR pipeline.",
    syllabus: [
      "TTFB waterfall elimination and early head flushes.",
      "Chunked transfer encoding and HTTP/2 stream multiplexing.",
      "Out-of-order Suspense replacement scripts ($RC).",
      "Streaming error boundary fallbacks and header commitment."
    ],
    eTitle: "Suspense Template Placeholder Builder",
    eDesc: "Write `buildSuspenseSlot(id, fallbackText)` returning `<!--$?--><template id=\"B:' + id + '\"></template><div class=\"fallback\">' + fallbackText + '</div><!--/$-->`.",
    eStarter: lines("function buildSuspenseSlot(id, fallbackText) {", "  // Return Suspense placeholder HTML", "  return '';", "}"),
    eHint: "return '<!--$?--><template id=\"B:' + id + '\"></template><div class=\"fallback\">' + fallbackText + '</div><!--/$-->';",
    eTest: lines(
      "if (typeof buildSuspenseSlot !== 'function') throw new Error('buildSuspenseSlot not found');",
      "const slot = buildSuspenseSlot(0, 'Loading...');",
      "if (!slot.includes('id=\"B:0\"') || !slot.includes('Loading...')) throw new Error('Slot placeholder check failed');"
    ),
    aTitle: "Out-of-Order Replacement Script Generator",
    aDesc: "Write `generateRcScript(boundaryId, contentId)` returning `<script>$RC(\"B:' + boundaryId + '\",\"S:' + contentId + '\")</script>`.",
    aStarter: lines("function generateRcScript(boundaryId, contentId) {", "  // Return $RC replacement script tag", "  return '';", "}"),
    aHint: "return '<script>$RC(\"B:' + boundaryId + '\",\"S:' + contentId + '\")</script>';",
    aTest: lines(
      "if (typeof generateRcScript !== 'function') throw new Error('generateRcScript not found');",
      "const s = generateRcScript(0, 0);",
      "if (s !== '<script>$RC(\"B:0\",\"S:0\")</script>') throw new Error('$RC script check failed');"
    )
  },
  {
    title: "Selective Hydration & Progressive Interactivity: Prioritizing Interactive Islands on User Click",
    desc: "Master selective hydration and progressive interactivity: eliminate the hydration uncanny valley, segment trees via React 18 hydrateRoot and Suspense, intercept clicks on unhydrated islands for priority promotion and interaction replay, and schedule hydration via 31-bit lanes.",
    syllabus: [
      "Hydration uncanny valley and main-thread freezing.",
      "hydrateRoot and Suspense subtree segmentation.",
      "Capture-phase event interception and interaction replay.",
      "Viewport-driven lane scheduling with IntersectionObserver."
    ],
    eTitle: "Total Blocking Time Calculator",
    eDesc: "Write `calculateTbt(taskDurationMs)` returning `taskDurationMs > 50 ? taskDurationMs - 50 : 0`.",
    eStarter: lines("function calculateTbt(taskDurationMs) {", "  // Return TBT penalty", "  return 0;", "}"),
    eHint: "return taskDurationMs > 50 ? taskDurationMs - 50 : 0;",
    eTest: lines(
      "if (typeof calculateTbt !== 'function') throw new Error('calculateTbt not found');",
      "if (calculateTbt(120) !== 70) throw new Error('120ms TBT check failed');",
      "if (calculateTbt(30) !== 0) throw new Error('30ms TBT check failed');"
    ),
    aTitle: "Hydration Priority Promoter",
    aDesc: "Write `promoteIslandPriority(island, isClicked)` returning `{ ...island, priority: isClicked ? 'URGENT_SYNC_LANE' : island.priority }`.",
    aStarter: lines("function promoteIslandPriority(island, isClicked) {", "  // Return promoted island object", "  return {};", "}"),
    aHint: "return { ...island, priority: isClicked ? 'URGENT_SYNC_LANE' : island.priority };",
    aTest: lines(
      "if (typeof promoteIslandPriority !== 'function') throw new Error('promoteIslandPriority not found');",
      "const res = promoteIslandPriority({ id: 'btn', priority: 'IDLE' }, true);",
      "if (res.priority !== 'URGENT_SYNC_LANE') throw new Error('Promotion check failed');"
    )
  },
  {
    title: "Server Actions & Mutative Transitions: Form Actions, useActionState, Optimistic Updates & Revalidation",
    desc: "Master declarative mutations with React Server Actions: eliminate REST boilerplate, implement progressive enhancement for zero-JS form fallbacks, orchestrate state with useActionState and useFormStatus, project instant UI changes with useOptimistic, and handle cache revalidations.",
    syllabus: [
      "Declarative 'use server' actions vs imperative REST.",
      "Progressive enhancement and native HTML form POSTs.",
      "useActionState reactive lifecycle and useFormStatus.",
      "useOptimistic UI projection and automatic rollbacks."
    ],
    eTitle: "Optimistic State Projector",
    eDesc: "Write `applyOptimisticDelta(currentCount, delta)` returning `Math.max(0, currentCount + delta)`.",
    eStarter: lines("function applyOptimisticDelta(currentCount, delta) {", "  // Return optimistic count", "  return 0;", "}"),
    eHint: "return Math.max(0, currentCount + delta);",
    eTest: lines(
      "if (typeof applyOptimisticDelta !== 'function') throw new Error('applyOptimisticDelta not found');",
      "if (applyOptimisticDelta(5, 2) !== 7) throw new Error('Positive delta check failed');",
      "if (applyOptimisticDelta(2, -5) !== 0) throw new Error('Floor 0 check failed');"
    ),
    aTitle: "Server Action Rollback Guard",
    aDesc: "Write `auditActionRollback(serverSuccess, optimisticVal, serverAuthoritativeVal)` returning `serverSuccess ? optimisticVal : serverAuthoritativeVal`.",
    aStarter: lines("function auditActionRollback(serverSuccess, optimisticVal, serverAuthoritativeVal) {", "  // Return resolved authoritative state", "  return 0;", "}"),
    aHint: "return serverSuccess ? optimisticVal : serverAuthoritativeVal;",
    aTest: lines(
      "if (typeof auditActionRollback !== 'function') throw new Error('auditActionRollback not found');",
      "if (auditActionRollback(true, 10, 5) !== 10) throw new Error('Success branch check failed');",
      "if (auditActionRollback(false, 10, 5) !== 5) throw new Error('Rollback branch check failed');"
    )
  },
  {
    title: "Milestone 8: Production Hybrid RSC E-Commerce Catalog with Streaming SSR, Selective Hydration & Server Actions",
    desc: "Architect an enterprise-grade production hybrid e-commerce catalog: synthesize React Server Components for zero-bundle specs, stream HTML shells with Suspense placeholders, hydrate interactive cart islands selectively with event replay, and process checkout mutations via Server Actions with optimistic rollbacks.",
    syllabus: [
      "Hybrid RSC enterprise topology and client island boundaries.",
      "Server component catalog engine and zero-bundle specs.",
      "Streaming out-of-order reviews and selective cart hydration.",
      "Server Action checkout mutations with optimistic rollbacks."
    ],
    eTitle: "Enterprise Topology Auditor",
    eDesc: "Write `isHybridTopologyValid(serverRootsCount, clientIslandsCount, streamingBoundariesCount)` returning `serverRootsCount >= 2 && clientIslandsCount >= 2 && streamingBoundariesCount >= 1`.",
    eStarter: lines("function isHybridTopologyValid(serverRootsCount, clientIslandsCount, streamingBoundariesCount) {", "  // Return boolean compliance decision", "  return false;", "}"),
    eHint: "return serverRootsCount >= 2 && clientIslandsCount >= 2 && streamingBoundariesCount >= 1;",
    eTest: lines(
      "if (typeof isHybridTopologyValid !== 'function') throw new Error('isHybridTopologyValid not found');",
      "if (isHybridTopologyValid(2, 2, 1) !== true) throw new Error('Valid topology check failed');",
      "if (isHybridTopologyValid(1, 2, 1) !== false) throw new Error('Invalid topology check failed');"
    ),
    aTitle: "Milestone 8 Performance Auditor",
    aDesc: "Write `auditMilestone8Compliance(tbtMs, ttfbMs, clientBundleLeakedKb)` returning `{ isCompliant: tbtMs === 0 && ttfbMs <= 50 && clientBundleLeakedKb === 0, grade: (tbtMs === 0 && ttfbMs <= 50 && clientBundleLeakedKb === 0) ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' }`.",
    aStarter: lines("function auditMilestone8Compliance(tbtMs, ttfbMs, clientBundleLeakedKb) {", "  // Return audit report", "  return {};", "}"),
    aHint: "const ok = tbtMs === 0 && ttfbMs <= 50 && clientBundleLeakedKb === 0; return { isCompliant: ok, grade: ok ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' };",
    aTest: lines(
      "if (typeof auditMilestone8Compliance !== 'function') throw new Error('auditMilestone8Compliance not found');",
      "const r = auditMilestone8Compliance(0, 38, 0);",
      "if (r.isCompliant !== true || r.grade !== 'GRADE A+ PRODUCTION READY') throw new Error('Compliant audit check failed');",
      "const r2 = auditMilestone8Compliance(50, 38, 0);",
      "if (r2.isCompliant !== false || r2.grade !== 'NON-COMPLIANT') throw new Error('Non-compliant audit check failed');"
    )
  },
  {
    title: "Concurrent External Stores with useSyncExternalStore: Eliminating State Tearing in Third-Party State Libraries",
    desc: "Master concurrent state synchronization in React 18: eliminate state tearing with useSyncExternalStore, configure resilient subscribe and getSnapshot hooks, enforce referential stability with memoized selectors, and recover cleanly in SyncLane.",
    syllabus: [
      "State tearing mechanics under concurrent time-slicing.",
      "useSyncExternalStore subscribe and getSnapshot contracts.",
      "Memoized selectors and referential stability.",
      "Pre-commit validation and SyncLane recovery."
    ],
    eTitle: "Pre-Commit Snapshot Guard",
    eDesc: "Write `isSnapshotTorn(startSnapshot, commitSnapshot)` returning `startSnapshot !== commitSnapshot`.",
    eStarter: lines("function isSnapshotTorn(startSnapshot, commitSnapshot) {", "  // Return boolean tearing status", "  return false;", "}"),
    eHint: "return startSnapshot !== commitSnapshot;",
    eTest: lines(
      "if (typeof isSnapshotTorn !== 'function') throw new Error('isSnapshotTorn not found');",
      "if (isSnapshotTorn('150', '155') !== true) throw new Error('Torn snapshot check failed');",
      "if (isSnapshotTorn('150', '150') !== false) throw new Error('Clean snapshot check failed');"
    ),
    aTitle: "Selector Memoization Cache",
    aDesc: "Write `memoizeSliceSelector(prevSlice, nextSlice)` returning `prevSlice && prevSlice.val === nextSlice.val ? prevSlice : nextSlice`.",
    aStarter: lines("function memoizeSliceSelector(prevSlice, nextSlice) {", "  // Return stable slice reference", "  return {};", "}"),
    aHint: "return prevSlice && prevSlice.val === nextSlice.val ? prevSlice : nextSlice;",
    aTest: lines(
      "if (typeof memoizeSliceSelector !== 'function') throw new Error('memoizeSliceSelector not found');",
      "const s1 = { val: 42 };",
      "const s2 = { val: 42 };",
      "if (memoizeSliceSelector(s1, s2) !== s1) throw new Error('Stable reference check failed');",
      "const s3 = { val: 99 };",
      "if (memoizeSliceSelector(s1, s3) !== s3) throw new Error('Mutated reference check failed');"
    )
  },
  {
    title: "Finite State Automata & Hierarchical Statecharts in React: Actor Model & Transition Invariants",
    desc: "Abolish impossible UI states with mathematical statecharts: model deterministic finite state automata with transition guards, construct hierarchical composite states, orchestrate concurrent subsystems with the Actor Model, and implement fault-tolerant supervision trees.",
    syllabus: [
      "Boolean flag combinatorial explosion vs statecharts.",
      "Finite State Automata transition tables and guards.",
      "Hierarchical nested statecharts and preemption.",
      "Actor Model mailboxes and fault-tolerant supervision."
    ],
    eTitle: "Transition Guard Validator",
    eDesc: "Write `canTransition(currentState, event, guardPassed)` returning `currentState === 'IDLE' && event === 'SUBMIT' && guardPassed === true`.",
    eStarter: lines("function canTransition(currentState, event, guardPassed) {", "  // Return boolean transition permission", "  return false;", "}"),
    eHint: "return currentState === 'IDLE' && event === 'SUBMIT' && guardPassed === true;",
    eTest: lines(
      "if (typeof canTransition !== 'function') throw new Error('canTransition not found');",
      "if (canTransition('IDLE', 'SUBMIT', true) !== true) throw new Error('Valid transition check failed');",
      "if (canTransition('IDLE', 'SUBMIT', false) !== false) throw new Error('Blocked guard check failed');",
      "if (canTransition('LOADING', 'SUBMIT', true) !== false) throw new Error('Invalid state check failed');"
    ),
    aTitle: "Actor Message Mailbox",
    aDesc: "Write `enqueueActorMessage(mailbox, msg)` returning `[...mailbox, { ...msg, timestamp: 1700000000000 }]`.",
    aStarter: lines("function enqueueActorMessage(mailbox, msg) {", "  // Return updated mailbox array", "  return [];", "}"),
    aHint: "return [...mailbox, { ...msg, timestamp: 1700000000000 }];",
    aTest: lines(
      "if (typeof enqueueActorMessage !== 'function') throw new Error('enqueueActorMessage not found');",
      "const res = enqueueActorMessage([{ type: 'PING' }], { type: 'TICK' });",
      "if (res.length !== 2 || res[1].type !== 'TICK' || res[1].timestamp !== 1700000000000) throw new Error('Mailbox enqueue check failed');"
    )
  },
  {
    title: "Micro-Frontends with Module Federation: Shared React Runtimes, Version Isolation & Remote Island Mounting",
    desc: "Scale enterprise frontend architectures with Module Federation: decouple monolithic codebases into autonomous micro-frontends, configure host containers and dynamic remotes, negotiate shared React singletons, implement resilient error sandboxing, and coordinate cross-remote events.",
    syllabus: [
      "Monolith organizational bottlenecks vs Micro-Frontends.",
      "Webpack Module Federation runtime container architecture.",
      "Shared scope negotiation and React singleton safety.",
      "Cross-remote decoupled event bus bridges."
    ],
    eTitle: "SemVer Singleton Negotiator",
    eDesc: "Write `resolveSharedSingleton(v1, v2)` returning `v1 >= v2 ? v1 : v2`.",
    eStarter: lines("function resolveSharedSingleton(v1, v2) {", "  // Return highest compatible version", "  return '';", "}"),
    eHint: "return v1 >= v2 ? v1 : v2;",
    eTest: lines(
      "if (typeof resolveSharedSingleton !== 'function') throw new Error('resolveSharedSingleton not found');",
      "if (resolveSharedSingleton('18.3.1', '18.2.0') !== '18.3.1') throw new Error('Highest version check failed');",
      "if (resolveSharedSingleton('18.1.0', '18.2.0') !== '18.2.0') throw new Error('Ascending version check failed');"
    ),
    aTitle: "Remote Timeout Guard",
    aDesc: "Write `shouldAbortRemoteLoad(latencyMs, maxTimeoutMs)` returning `latencyMs > maxTimeoutMs`.",
    aStarter: lines("function shouldAbortRemoteLoad(latencyMs, maxTimeoutMs) {", "  // Return boolean abort decision", "  return false;", "}"),
    aHint: "return latencyMs > maxTimeoutMs;",
    aTest: lines(
      "if (typeof shouldAbortRemoteLoad !== 'function') throw new Error('shouldAbortRemoteLoad not found');",
      "if (shouldAbortRemoteLoad(3500, 3000) !== true) throw new Error('Timeout check failed');",
      "if (shouldAbortRemoteLoad(1200, 3000) !== false) throw new Error('Within-budget check failed');"
    )
  },
  {
    title: "Custom React Reconcilers: Building a Headless HostConfig with react-reconciler",
    desc: "Unshackle React from the browser DOM: implement the complete react-reconciler HostConfig mutative contract, traverse Fiber reconciliation work loops, construct headless in-memory Virtual Node Graphs, and render React component trees to ANSI terminal CLI screens with 60 FPS performance.",
    syllabus: [
      "React architecture decoupling: Core, Reconciler & Renderer.",
      "HostConfig mutative lifecycle methods.",
      "In-memory Virtual Node Graph and layout engine.",
      "Decoupled headless testing and cross-platform targets."
    ],
    eTitle: "Fiber Prop Diff Engine",
    eDesc: "Write `computePropDiff(oldProps, newProps)` returning `oldProps.text !== newProps.text ? { text: newProps.text } : null`.",
    eStarter: lines("function computePropDiff(oldProps, newProps) {", "  // Return prop diff payload", "  return null;", "}"),
    eHint: "return oldProps.text !== newProps.text ? { text: newProps.text } : null;",
    eTest: lines(
      "if (typeof computePropDiff !== 'function') throw new Error('computePropDiff not found');",
      "const diff = computePropDiff({ text: 'A' }, { text: 'B' });",
      "if (!diff || diff.text !== 'B') throw new Error('Prop diff check failed');",
      "if (computePropDiff({ text: 'A' }, { text: 'A' }) !== null) throw new Error('Unchanged diff check failed');"
    ),
    aTitle: "Virtual Node Allocator",
    aDesc: "Write `createVirtualNode(type, props)` returning `{ type, props: { ...props }, children: [] }`.",
    aStarter: lines("function createVirtualNode(type, props) {", "  // Return virtual node object", "  return {};", "}"),
    aHint: "return { type, props: { ...props }, children: [] };",
    aTest: lines(
      "if (typeof createVirtualNode !== 'function') throw new Error('createVirtualNode not found');",
      "const node = createVirtualNode('box', { color: 'cyan' });",
      "if (node.type !== 'box' || node.props.color !== 'cyan' || !Array.isArray(node.children)) throw new Error('Virtual node allocation check failed');"
    )
  },
  {
    title: "Milestone 9: Micro-Frontend Real-Time Trading Desk with useSyncExternalStore & Federated Modules",
    desc: "Architect an enterprise-grade Micro-Frontend Real-Time Financial Trading Desk. Synthesize concurrent external stores (useSyncExternalStore), deterministic statecharts, federated micro-app modules, and custom headless rendering into an ultra-low-latency, tear-free, multi-tenant financial analytics dashboard.",
    syllabus: [
      "Trading desk topology and micro-frontend boundaries.",
      "Low-latency market feed store with useSyncExternalStore.",
      "Order execution statecharts with pre-trade risk guards.",
      "Federated remote orchestration and production audit."
    ],
    eTitle: "Trading Desk Topology Auditor",
    eDesc: "Write `isTradingDeskTopologyValid(remotesCount, instrumentsCount, hasSharedSingleton)` returning `remotesCount >= 3 && instrumentsCount >= 5 && hasSharedSingleton === true`.",
    eStarter: lines("function isTradingDeskTopologyValid(remotesCount, instrumentsCount, hasSharedSingleton) {", "  // Return boolean validation result", "  return false;", "}"),
    eHint: "return remotesCount >= 3 && instrumentsCount >= 5 && hasSharedSingleton === true;",
    eTest: lines(
      "if (typeof isTradingDeskTopologyValid !== 'function') throw new Error('isTradingDeskTopologyValid not found');",
      "if (isTradingDeskTopologyValid(3, 5, true) !== true) throw new Error('Valid topology check failed');",
      "if (isTradingDeskTopologyValid(2, 5, true) !== false) throw new Error('Insufficient remotes check failed');"
    ),
    aTitle: "Milestone 9 Production Auditor",
    aDesc: "Write `auditMilestone9Compliance(tornFrames, renderLatencyMs, duplicateOrdersBlocked)` returning `{ isCompliant: tornFrames === 0 && renderLatencyMs <= 5 && duplicateOrdersBlocked, grade: (tornFrames === 0 && renderLatencyMs <= 5 && duplicateOrdersBlocked) ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' }`.",
    aStarter: lines("function auditMilestone9Compliance(tornFrames, renderLatencyMs, duplicateOrdersBlocked) {", "  // Return production audit report", "  return {};", "}"),
    aHint: "const ok = tornFrames === 0 && renderLatencyMs <= 5 && duplicateOrdersBlocked; return { isCompliant: ok, grade: ok ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' };",
    aTest: lines(
      "if (typeof auditMilestone9Compliance !== 'function') throw new Error('auditMilestone9Compliance not found');",
      "const rep = auditMilestone9Compliance(0, 3.2, true);",
      "if (rep.isCompliant !== true || rep.grade !== 'GRADE A+ PRODUCTION READY') throw new Error('Compliant desk check failed');",
      "const rep2 = auditMilestone9Compliance(2, 3.2, true);",
      "if (rep2.isCompliant !== false || rep2.grade !== 'NON-COMPLIANT') throw new Error('Torn desk check failed');"
    )
  }

,
// ── WEEK 11 (Days 51–55): Next.js App Router, Edge Runtime, PPR & SDUI ───────
  {
    title: "Next.js App Router Internals: Nested Layouts, Route Groups, Parallel Routes & Intercepting Routes",
    desc: "Master the foundational routing architecture of the Next.js App Router: preserve client state during navigation with nested layouts, isolate domains with Route Groups, build multi-pane dashboards with Parallel Routes, and implement contextual modal overlays with Intercepting Routes.",
    syllabus: [
      "Nested layout trees and state preservation across route changes.",
      "Route Groups for clean URL organization and multi-root layouts.",
      "Parallel Routes (@slots) for independent concurrent sub-view streaming.",
      "Intercepting Routes ((..)) for dual-mode modal overlay navigation."
    ],
    eTitle: "App Router Segment Resolver",
    eDesc: "Write `resolveAppRouterPath(segments)` returning a clean normalized path string starting with '/', stripping Route Group segments in parentheses (e.g. ['(marketing)', 'about'] -> '/about').",
    eStarter: lines("function resolveAppRouterPath(segments) {", "  // Return normalized route path", "  return '';", "}"),
    eHint: "const clean = segments.filter(s => !(s.startsWith('(') && s.endsWith(')'))); return '/' + clean.join('/');",
    eTest: lines(
      "if (typeof resolveAppRouterPath !== 'function') throw new Error('resolveAppRouterPath not found');",
      "if (resolveAppRouterPath(['(marketing)', 'about']) !== '/about') throw new Error('Marketing route resolution failed');",
      "if (resolveAppRouterPath(['(dashboard)', 'analytics', 'realtime']) !== '/analytics/realtime') throw new Error('Dashboard route resolution failed');",
      "if (resolveAppRouterPath([]) !== '/') throw new Error('Empty root path resolution failed');"
    ),
    aTitle: "Route Group Classifier",
    aDesc: "Write `classifyRouteSegments(segments)` returning `{ isRouteGroup: boolean, publicSegments: string[] }` where isRouteGroup is true if any segment is parenthesized.",
    aStarter: lines("function classifyRouteSegments(segments) {", "  // Return route classification object", "  return {};", "}"),
    aHint: "const hasGroup = segments.some(s => s.startsWith('(') && s.endsWith(')')); const pub = segments.filter(s => !(s.startsWith('(') && s.endsWith(')'))); return { isRouteGroup: hasGroup, publicSegments: pub };",
    aTest: lines(
      "if (typeof classifyRouteSegments !== 'function') throw new Error('classifyRouteSegments not found');",
      "const r1 = classifyRouteSegments(['(marketing)', 'pricing']);",
      "if (r1.isRouteGroup !== true || r1.publicSegments.join('/') !== 'pricing') throw new Error('Route group classification failed');",
      "const r2 = classifyRouteSegments(['api', 'health']);",
      "if (r2.isRouteGroup !== false || r2.publicSegments.join('/') !== 'api/health') throw new Error('Standard route classification failed');"
    )
  },
  {
    title: "Edge Runtime & Middleware Pipelines: Geo-Distributed Routing, Edge Caching, JWT Verification & Rate Limiting",
    desc: "Explore low-latency edge computing using V8 isolates: intercept requests at globally distributed edge nodes, enforce sub-millisecond cryptographic JWT verification, implement token bucket rate limiting, and route users by geographic coordinates.",
    syllabus: [
      "Edge Runtime V8 isolates vs Node.js serverless containers.",
      "Middleware pipeline execution order: rate limiting, auth, geo-tagging.",
      "Cryptographic JWT verification via Web Crypto API in < 1ms.",
      "Distributed sliding token bucket rate limiting and IP throttling."
    ],
    eTitle: "Edge Rate Limit Gate",
    eDesc: "Write `evaluateEdgeRateLimit(requestCount, maxAllowed)` returning `{ allowed: requestCount <= maxAllowed, remaining: Math.max(0, maxAllowed - requestCount) }`.",
    eStarter: lines("function evaluateEdgeRateLimit(requestCount, maxAllowed) {", "  // Return rate limit evaluation", "  return {};", "}"),
    eHint: "return { allowed: requestCount <= maxAllowed, remaining: Math.max(0, maxAllowed - requestCount) };",
    eTest: lines(
      "if (typeof evaluateEdgeRateLimit !== 'function') throw new Error('evaluateEdgeRateLimit not found');",
      "const r1 = evaluateEdgeRateLimit(3, 5);",
      "if (r1.allowed !== true || r1.remaining !== 2) throw new Error('Allowed rate limit check failed');",
      "const r2 = evaluateEdgeRateLimit(6, 5);",
      "if (r2.allowed !== false || r2.remaining !== 0) throw new Error('Exceeded rate limit check failed');"
    ),
    aTitle: "Edge JWT Header Formatter",
    aDesc: "Write `formatEdgeAuthHeader(userId, role, geoRegion)` returning `{ 'x-edge-user': userId, 'x-edge-role': role, 'x-edge-geo': geoRegion, 'x-edge-verified': 'true' }`.",
    aStarter: lines("function formatEdgeAuthHeader(userId, role, geoRegion) {", "  // Return injected edge headers", "  return {};", "}"),
    aHint: "return { 'x-edge-user': userId, 'x-edge-role': role, 'x-edge-geo': geoRegion, 'x-edge-verified': 'true' };",
    aTest: lines(
      "if (typeof formatEdgeAuthHeader !== 'function') throw new Error('formatEdgeAuthHeader not found');",
      "const h = formatEdgeAuthHeader('u_101', 'TRADER', 'US-NYC');",
      "if (h['x-edge-user'] !== 'u_101' || h['x-edge-verified'] !== 'true') throw new Error('Edge auth header formatting failed');",
      "if (h['x-edge-geo'] !== 'US-NYC' || h['x-edge-role'] !== 'TRADER') throw new Error('Geo/Role header formatting failed');"
    )
  },
  {
    title: "Streaming Hybrid Rendering & Partial Prerendering (PPR): Static Shells, Dynamic Holes & React Experimental Cache",
    desc: "Combine the lightning speed of static websites with the power of dynamic server rendering: compile static shells at build time, stream dynamic holes over HTTP chunked transfer encoding, and eliminate N+1 database queries with request-scoped memoization.",
    syllabus: [
      "Partial Prerendering (PPR) architecture: static shells + dynamic holes.",
      "Skeleton Bounding Box Contracts for zero Cumulative Layout Shift (CLS = 0.000).",
      "Request-scoped memoization via React cache() function.",
      "Granular tag-based edge cache invalidation via revalidateTag()."
    ],
    eTitle: "PPR TTFB Optimizer",
    eDesc: "Write `evaluatePprPerformance(staticShellTtfbMs, totalStreamMs)` returning `{ isOptimal: staticShellTtfbMs <= 35 && totalStreamMs <= 100, ttfbGrade: staticShellTtfbMs <= 35 ? 'A+' : 'NEEDS_WORK' }`.",
    eStarter: lines("function evaluatePprPerformance(staticShellTtfbMs, totalStreamMs) {", "  // Return PPR performance report", "  return {};", "}"),
    eHint: "const opt = staticShellTtfbMs <= 35 && totalStreamMs <= 100; return { isOptimal: opt, ttfbGrade: staticShellTtfbMs <= 35 ? 'A+' : 'NEEDS_WORK' };",
    eTest: lines(
      "if (typeof evaluatePprPerformance !== 'function') throw new Error('evaluatePprPerformance not found');",
      "const rep1 = evaluatePprPerformance(18, 45);",
      "if (rep1.isOptimal !== true || rep1.ttfbGrade !== 'A+') throw new Error('Optimal PPR performance check failed');",
      "const rep2 = evaluatePprPerformance(50, 120);",
      "if (rep2.isOptimal !== false || rep2.ttfbGrade !== 'NEEDS_WORK') throw new Error('Sub-optimal PPR performance check failed');"
    ),
    aTitle: "Cache Tag Purge Inspector",
    aDesc: "Write `filterCacheEntriesByTag(cacheEntries, targetTag)` returning an array of entry IDs whose tags array includes targetTag.",
    aStarter: lines("function filterCacheEntriesByTag(cacheEntries, targetTag) {", "  // Return matching entry IDs", "  return [];", "}"),
    aHint: "return cacheEntries.filter(e => e.tags && e.tags.includes(targetTag)).map(e => e.id);",
    aTest: lines(
      "if (typeof filterCacheEntriesByTag !== 'function') throw new Error('filterCacheEntriesByTag not found');",
      "const entries = [{ id: 'p1', tags: ['catalog', 'electronics'] }, { id: 'p2', tags: ['catalog', 'clothing'] }, { id: 'p3', tags: ['pricing'] }];",
      "const matches = filterCacheEntriesByTag(entries, 'electronics');",
      "if (matches.length !== 1 || matches[0] !== 'p1') throw new Error('Tag filtering failed');",
      "const catalogMatches = filterCacheEntriesByTag(entries, 'catalog');",
      "if (catalogMatches.length !== 2) throw new Error('Multi-tag filtering failed');"
    )
  },
  {
    title: "Server-Driven UI (SDUI) & Dynamic Component Engines: JSON Wire Schemas, Component Registries & Polymorphic Rendering",
    desc: "Decouple visual presentation and feature releases from native client deployments: transmit declarative JSON wire schemas, resolve components through polymorphic registries with resilient fallbacks, and execute safe client expressions without eval().",
    syllabus: [
      "Declarative JSON Wire Protocols for dynamic component hierarchies.",
      "Polymorphic Component Registries with defensive fallback boundaries.",
      "Declarative action dispatchers and centralized client event buses.",
      "Zero-eval safe expression evaluation engines for dynamic visibility."
    ],
    eTitle: "SDUI Node Counter",
    eDesc: "Write `countSduiNodes(node)` recursively calculating the total number of nodes in an SDUI tree (root + all descendants in node.children).",
    eStarter: lines("function countSduiNodes(node) {", "  // Return total node count", "  return 0;", "}"),
    eHint: "if (!node) return 0; let count = 1; if (Array.isArray(node.children)) { for (const c of node.children) count += countSduiNodes(c); } return count;",
    eTest: lines(
      "if (typeof countSduiNodes !== 'function') throw new Error('countSduiNodes not found');",
      "const tree = { type: 'Page', children: [{ type: 'Hero' }, { type: 'Grid', children: [{ type: 'Card' }, { type: 'Card' }] }] };",
      "if (countSduiNodes(tree) !== 5) throw new Error('SDUI node count mismatch: expected 5');",
      "if (countSduiNodes({ type: 'Leaf' }) !== 1) throw new Error('Single node count failed');"
    ),
    aTitle: "Safe Expression Evaluator",
    aDesc: "Write `evaluateSimplePredicate(valA, op, valB)` supporting '===', '!==', '>', '<' without using eval().",
    aStarter: lines("function evaluateSimplePredicate(valA, op, valB) {", "  // Return evaluated boolean", "  return false;", "}"),
    aHint: "switch(op) { case '===': return valA === valB; case '!==': return valA !== valB; case '>': return Number(valA) > Number(valB); case '<': return Number(valA) < Number(valB); default: return false; }",
    aTest: lines(
      "if (typeof evaluateSimplePredicate !== 'function') throw new Error('evaluateSimplePredicate not found');",
      "if (evaluateSimplePredicate('VIP', '===', 'VIP') !== true) throw new Error('Equality test failed');",
      "if (evaluateSimplePredicate(500, '>', 1000) !== false) throw new Error('Greater-than test failed');",
      "if (evaluateSimplePredicate(1500, '>', 1000) !== true) throw new Error('Greater-than true test failed');"
    )
  },
  {
    title: "Milestone 10: Enterprise Edge-Native Streaming Portal with Partial Prerendering (PPR), Edge Middleware & Server-Driven UI",
    desc: "The architectural capstone of Month 2 Block 11: assemble, optimize, and certify a complete enterprise streaming portal synthesizing Next.js App Router nested layouts, geo-distributed edge middleware, Partial Prerendering, and Server-Driven UI into a Grade A+ certified platform.",
    syllabus: [
      "Enterprise portal subsystem topology and operational readiness auditing.",
      "Integrated edge middleware pipeline: sliding rate limits, Web Crypto JWT, geo context.",
      "Partial Prerendering streaming coordinator with zero layout shift (CLS = 0.000).",
      "Production 6-vector SLA verification suite and Grade A+ certification."
    ],
    eTitle: "Streaming Portal Health Auditor",
    eDesc: "Write `auditPortalReadiness(edgeActive, pprActive, sduiActive, cacheActive)` returning `{ ready: edgeActive && pprActive && sduiActive && cacheActive, activeSubsystems: [edgeActive, pprActive, sduiActive, cacheActive].filter(Boolean).length }`.",
    eStarter: lines("function auditPortalReadiness(edgeActive, pprActive, sduiActive, cacheActive) {", "  // Return health audit report", "  return {};", "}"),
    eHint: "const ready = edgeActive && pprActive && sduiActive && cacheActive; const count = [edgeActive, pprActive, sduiActive, cacheActive].filter(Boolean).length; return { ready, activeSubsystems: count };",
    eTest: lines(
      "if (typeof auditPortalReadiness !== 'function') throw new Error('auditPortalReadiness not found');",
      "const r1 = auditPortalReadiness(true, true, true, true);",
      "if (r1.ready !== true || r1.activeSubsystems !== 4) throw new Error('Healthy portal audit failed');",
      "const r2 = auditPortalReadiness(true, false, true, true);",
      "if (r2.ready !== false || r2.activeSubsystems !== 3) throw new Error('Degraded portal audit failed');"
    ),
    aTitle: "Milestone 10 SLA Certifier",
    aDesc: "Write `certifyMilestone10SLA(ttfbMs, authLatencyMs, cls)` returning `{ certified: ttfbMs <= 35 && authLatencyMs <= 5 && cls <= 0.01, grade: (ttfbMs <= 35 && authLatencyMs <= 5 && cls <= 0.01) ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' }`.",
    aStarter: lines("function certifyMilestone10SLA(ttfbMs, authLatencyMs, cls) {", "  // Return SLA certification report", "  return {};", "}"),
    aHint: "const pass = ttfbMs <= 35 && authLatencyMs <= 5 && cls <= 0.01; return { certified: pass, grade: pass ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' };",
    aTest: lines(
      "if (typeof certifyMilestone10SLA !== 'function') throw new Error('certifyMilestone10SLA not found');",
      "const cert1 = certifyMilestone10SLA(18.2, 2.4, 0.000);",
      "if (cert1.certified !== true || cert1.grade !== 'GRADE A+ PRODUCTION READY') throw new Error('Certified SLA test failed');",
      "const cert2 = certifyMilestone10SLA(42.0, 2.4, 0.000);",
      "if (cert2.certified !== false || cert2.grade !== 'NON-COMPLIANT') throw new Error('Uncertified SLA test failed');"
    )
  }
,
// ── WEEK 12 (Days 56–60): Industrial Architecture Case Studies, RFC & Capstone ───────
  {
    title: "Industrial Architecture Case Study 1: High-Frequency Trading Desk & Financial Telemetry",
    desc: "Architect high-frequency financial trading systems in React: stream 100k market events/sec over WebSockets into zero-GC circular buffers, synchronize 120 FPS order books with useSyncExternalStore, accelerate depth charts with off-screen canvas rendering, and isolate federated micro-frontend modules.",
    syllabus: [
      "High-throughput binary WebSocket stream ingestion into Web Workers.",
      "Zero-allocation circular ring buffers for high-frequency market depth.",
      "Atomic frame throttling with useSyncExternalStore at 120 FPS.",
      "Hardware-accelerated off-screen canvas depth chart rendering."
    ],
    eTitle: "Circular Ring Buffer Slot Indexer",
    eDesc: "Write `getRingBufferIndex(cursor, capacity)` returning `cursor % capacity` to map unbounded sequence IDs to fixed array slots.",
    eStarter: lines("function getRingBufferIndex(cursor, capacity) {", "  // Return mapped array index", "  return 0;", "}"),
    eHint: "return cursor % capacity;",
    eTest: lines(
      "if (typeof getRingBufferIndex !== 'function') throw new Error('getRingBufferIndex not found');",
      "if (getRingBufferIndex(0, 1024) !== 0) throw new Error('Zero cursor failed');",
      "if (getRingBufferIndex(1024, 1024) !== 0) throw new Error('Wrap around index failed');",
      "if (getRingBufferIndex(1025, 1024) !== 1) throw new Error('Next slot index failed');"
    ),
    aTitle: "Order Book Spread Calculator",
    aDesc: "Write `calculateOrderBookSpread(bestBid, bestAsk)` returning `{ spread: Number((bestAsk - bestBid).toFixed(4)), isCrossed: bestBid >= bestAsk }`.",
    aStarter: lines("function calculateOrderBookSpread(bestBid, bestAsk) {", "  // Return spread metrics", "  return {};", "}"),
    aHint: "return { spread: Number((bestAsk - bestBid).toFixed(4)), isCrossed: bestBid >= bestAsk };",
    aTest: lines(
      "if (typeof calculateOrderBookSpread !== 'function') throw new Error('calculateOrderBookSpread not found');",
      "const r1 = calculateOrderBookSpread(100.50, 100.55);",
      "if (r1.spread !== 0.05 || r1.isCrossed !== false) throw new Error('Normal spread calculation failed');",
      "const r2 = calculateOrderBookSpread(101.00, 100.80);",
      "if (r2.isCrossed !== true) throw new Error('Crossed order book detection failed');"
    )
  },
  {
    title: "Industrial Architecture Case Study 2: Global E-Commerce Streaming Architecture & PPR",
    desc: "Build enterprise edge-native e-commerce platforms: terminate requests at edge anycast nodes with token bucket rate limiting, stream static catalog shells with Partial Prerendering (PPR) in sub-25ms, eliminate layout shift with skeleton bounds, and manage tag-based edge cache invalidation.",
    syllabus: [
      "Edge Anycast ingress and sliding token bucket rate limiters.",
      "Partial Prerendering (PPR) static shell and dynamic hole streaming.",
      "Zero layout shift skeleton bounding box contracts (CLS = 0.000).",
      "Tag-based edge cache revalidation and synthetic SLA benchmarking."
    ],
    eTitle: "Token Bucket Capacity Evaluator",
    eDesc: "Write `evaluateTokenBucket(currentTokens, cost, maxCapacity)` returning `{ allowed: currentTokens >= cost, newBalance: currentTokens >= cost ? currentTokens - cost : currentTokens }`.",
    eStarter: lines("function evaluateTokenBucket(currentTokens, cost, maxCapacity) {", "  // Return bucket evaluation", "  return {};", "}"),
    eHint: "const allowed = currentTokens >= cost; return { allowed, newBalance: allowed ? currentTokens - cost : currentTokens };",
    eTest: lines(
      "if (typeof evaluateTokenBucket !== 'function') throw new Error('evaluateTokenBucket not found');",
      "const b1 = evaluateTokenBucket(10, 2, 20);",
      "if (b1.allowed !== true || b1.newBalance !== 8) throw new Error('Allowed token deduction failed');",
      "const b2 = evaluateTokenBucket(1, 2, 20);",
      "if (b2.allowed !== false || b2.newBalance !== 1) throw new Error('Throttled bucket check failed');"
    ),
    aTitle: "CLS Layout Stability Auditor",
    aDesc: "Write `auditCumulativeLayoutShift(shiftEntries)` returning `{ totalCls: Number(shiftEntries.reduce((acc, s) => acc + s, 0).toFixed(4)), passesSla: shiftEntries.reduce((acc, s) => acc + s, 0) === 0 }`.",
    aStarter: lines("function auditCumulativeLayoutShift(shiftEntries) {", "  // Return CLS audit report", "  return {};", "}"),
    aHint: "const total = Number(shiftEntries.reduce((acc, s) => acc + s, 0).toFixed(4)); return { totalCls: total, passesSla: total === 0 };",
    aTest: lines(
      "if (typeof auditCumulativeLayoutShift !== 'function') throw new Error('auditCumulativeLayoutShift not found');",
      "const a1 = auditCumulativeLayoutShift([0, 0, 0]);",
      "if (a1.totalCls !== 0 || a1.passesSla !== true) throw new Error('Zero CLS audit failed');",
      "const a2 = auditCumulativeLayoutShift([0.02, 0.01]);",
      "if (a2.passesSla !== false) throw new Error('Failing CLS audit failed');"
    )
  },
  {
    title: "Industrial Architecture Case Study 3: Enterprise Collaborative Workspace & Server-Driven UI",
    desc: "Design multi-tenant collaborative workspaces: structure nested block documents into normalized RecordMaps, virtualize deep trees for 60 FPS scrolling, synchronize offline mutations with CRDTs, and execute sandboxed DAG formulas without freezing the UI.",
    syllabus: [
      "Normalized in-memory RecordMap block tree architectures.",
      "Dynamic block code-splitting with React.lazy and telemetry fallbacks.",
      "CRDT mathematical convergence and IndexedDB offline mutation queues.",
      "Topological DAG dependency formula evaluation engines."
    ],
    eTitle: "Normalized Block Finder",
    eDesc: "Write `findChildBlocks(recordMap, parentId)` returning an array of block objects corresponding to the parent block's content ID array.",
    eStarter: lines("function findChildBlocks(recordMap, parentId) {", "  // Return ordered child block objects", "  return [];", "}"),
    eHint: "const parent = recordMap[parentId]; if (!parent || !Array.isArray(parent.content)) return []; return parent.content.map(id => recordMap[id]).filter(Boolean);",
    eTest: lines(
      "if (typeof findChildBlocks !== 'function') throw new Error('findChildBlocks not found');",
      "const map = { p1: { id: 'p1', content: ['c1', 'c2'] }, c1: { id: 'c1', type: 'text' }, c2: { id: 'c2', type: 'image' } };",
      "const kids = findChildBlocks(map, 'p1');",
      "if (kids.length !== 2 || kids[0].id !== 'c1' || kids[1].type !== 'image') throw new Error('Child block resolution failed');",
      "if (findChildBlocks(map, 'nonexistent').length !== 0) throw new Error('Missing parent handling failed');"
    ),
    aTitle: "DAG Dependency Sorter",
    aDesc: "Write `isAcyclicDependency(dependencies)` checking if a direct cycle exists between keys and values.",
    aStarter: lines("function isAcyclicDependency(dependencies) {", "  // Return true if acyclic", "  return true;", "}"),
    aHint: "for (const [k, v] of Object.entries(dependencies)) { if (v && dependencies[v] === k) return false; } return true;",
    aTest: lines(
      "if (typeof isAcyclicDependency !== 'function') throw new Error('isAcyclicDependency not found');",
      "if (isAcyclicDependency({ A: 'B', B: 'A' }) !== false) throw new Error('Cycle detection failed');",
      "if (isAcyclicDependency({ A: 'B', B: 'C', C: null }) !== true) throw new Error('Acyclic graph check failed');"
    )
  },
  {
    title: "Principal Full-Stack React Architect RFC & System Design Defense",
    desc: "Operate as a Principal Full-Stack React Architect: author RFC-0104 for edge-native streaming platforms, allocate end-to-end 50ms latency budgets across multi-tier pipelines, engineer automated edge circuit breakers for multi-region failover, govern decoupled team topologies with Zod schemas, and defend multi-million-dollar financial ROI before executive boards.",
    syllabus: [
      "Enterprise Request for Comments (RFC) authoring and Change Advisory Board (CAB) ratification.",
      "End-to-end 50.0ms latency budgeting across DNS, edge middleware, and RSC streams.",
      "Edge Circuit Breaker finite state machine (CLOSED, OPEN, HALF-OPEN) and multi-region failover.",
      "Conway's Law team topologies, Zod schema governance, and multi-million-dollar financial ROI modeling."
    ],
    eTitle: "Latency Budget Auditor",
    eDesc: "Write `auditLatencyBudget(stageDurations, maxBudgetMs)` returning `{ totalDuration: stageDurations.reduce((a, b) => a + b, 0), withinBudget: stageDurations.reduce((a, b) => a + b, 0) <= maxBudgetMs }`.",
    eStarter: lines("function auditLatencyBudget(stageDurations, maxBudgetMs) {", "  // Return latency audit", "  return {};", "}"),
    eHint: "const total = Number(stageDurations.reduce((a, b) => a + b, 0).toFixed(2)); return { totalDuration: total, withinBudget: total <= maxBudgetMs };",
    eTest: lines(
      "if (typeof auditLatencyBudget !== 'function') throw new Error('auditLatencyBudget not found');",
      "const l1 = auditLatencyBudget([4.2, 1.8, 12.5, 22.0], 50.0);",
      "if (l1.withinBudget !== true || Math.abs(l1.totalDuration - 40.5) > 0.01) throw new Error('Latency budget check failed');",
      "const l2 = auditLatencyBudget([25.0, 30.0], 50.0);",
      "if (l2.withinBudget !== false) throw new Error('Exceeded latency budget check failed');"
    ),
    aTitle: "Circuit Breaker State Machine",
    aDesc: "Write `evaluateCircuitState(currentFailures, threshold)` returning `{ state: currentFailures >= threshold ? 'OPEN' : 'CLOSED', canRoutePrimary: currentFailures < threshold }`.",
    aStarter: lines("function evaluateCircuitState(currentFailures, threshold) {", "  // Return circuit breaker state", "  return {};", "}"),
    aHint: "const open = currentFailures >= threshold; return { state: open ? 'OPEN' : 'CLOSED', canRoutePrimary: !open };",
    aTest: lines(
      "if (typeof evaluateCircuitState !== 'function') throw new Error('evaluateCircuitState not found');",
      "const c1 = evaluateCircuitState(1, 3);",
      "if (c1.state !== 'CLOSED' || c1.canRoutePrimary !== true) throw new Error('Closed state check failed');",
      "const c2 = evaluateCircuitState(3, 3);",
      "if (c2.state !== 'OPEN' || c2.canRoutePrimary !== false) throw new Error('Tripped open state check failed');"
    )
  },
  {
    title: "Grand Master Capstone & Production Deployment Gate: HyperGrid Enterprise Autonomous Trading & Edge Streaming Portal",
    desc: "The crowning milestone of Full-Stack React Web Development: synthesize the entire 60-day curriculum into the HyperGrid Enterprise Autonomous Trading Portal. Execute zero-downtime blue/green canary traffic migration, enforce the 10-vector production SLA audit, survive automated chaos engineering failover drills, and achieve official Distinguished Full-Stack React Architect accreditation.",
    syllabus: [
      "HyperGrid full-system topology synthesis and subsystem operational validation.",
      "Zero-downtime blue/green traffic migration with 99.999% canary error threshold gating.",
      "10-Vector Production SLA Audit: sub-25ms shell TTFB, 0.000 CLS, 120 FPS, zero memory leaks.",
      "Automated chaos engineering failover and Distinguished Full-Stack React Architect certification."
    ],
    eTitle: "10-Vector SLA Scorecard",
    eDesc: "Write `scoreSlaVectors(resultsArray)` returning `{ score: (resultsArray.filter(Boolean).length / resultsArray.length) * 100, isCertified: resultsArray.every(Boolean) }`.",
    eStarter: lines("function scoreSlaVectors(resultsArray) {", "  // Return scorecard", "  return {};", "}"),
    eHint: "const count = resultsArray.filter(Boolean).length; return { score: (count / resultsArray.length) * 100, isCertified: count === resultsArray.length };",
    eTest: lines(
      "if (typeof scoreSlaVectors !== 'function') throw new Error('scoreSlaVectors not found');",
      "const s1 = scoreSlaVectors([true, true, true, true, true, true, true, true, true, true]);",
      "if (s1.score !== 100 || s1.isCertified !== true) throw new Error('100% score certification failed');",
      "const s2 = scoreSlaVectors([true, false, true, true, true, true, true, true, true, true]);",
      "if (s2.score !== 90 || s2.isCertified !== false) throw new Error('Partial score check failed');"
    ),
    aTitle: "Grand Master Curriculum Certifier",
    aDesc: "Write `certifyCourseCompletion(daysCompleted, milestonesDone)` returning `{ complete: daysCompleted === 60 && milestonesDone === 10, title: (daysCompleted === 60 && milestonesDone === 10) ? 'DISTINGUISHED_FULL_STACK_REACT_ARCHITECT' : 'IN_PROGRESS' }`.",
    aStarter: lines("function certifyCourseCompletion(daysCompleted, milestonesDone) {", "  // Return master certification", "  return {};", "}"),
    aHint: "const ok = daysCompleted === 60 && milestonesDone === 10; return { complete: ok, title: ok ? 'DISTINGUISHED_FULL_STACK_REACT_ARCHITECT' : 'IN_PROGRESS' };",
    aTest: lines(
      "if (typeof certifyCourseCompletion !== 'function') throw new Error('certifyCourseCompletion not found');",
      "const cert = certifyCourseCompletion(60, 10);",
      "if (cert.complete !== true || cert.title !== 'DISTINGUISHED_FULL_STACK_REACT_ARCHITECT') throw new Error('Grand master certification check failed');",
      "const inc = certifyCourseCompletion(59, 9);",
      "if (inc.complete !== false || inc.title !== 'IN_PROGRESS') throw new Error('Incomplete course check failed');"
    )
  }
];


export const REACT_30_DAYS_QUESTS = REACT_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('react-basics', i + 1, cfg)
);
