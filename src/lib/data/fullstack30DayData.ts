import { buildEnrichedDayQuests } from './curriculumEnricher';
export interface DayConfig {
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export const FULLSTACK_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is Fullstack Development? — The Client-Server Model and Node.js from Scratch",
    desc: "Fullstack development means building both the front-end (what users see in the browser) and the back-end (the server, database, and logic running behind the scenes). Before learning the tools, you must understand the core of the web: the CLIENT-SERVER MODEL. When you type 'google.com' in your browser, your browser is the CLIENT. It sends a request over the internet to Google's backend computer, which is the SERVER. The server receives the request, processes it, retrieves data (like search results) from a DATABASE, and sends back a response containing HTML, CSS, and JavaScript. Your browser then reads this response and renders the page. In fullstack development, you build both sides: you write the client code (React, HTML/CSS) and the server code (Node.js, Express, databases). What is Node.js? JavaScript was originally created to run ONLY inside browsers (to add animations or buttons to web pages). If you wanted to write server code, you had to learn a different language like Java, Python, or PHP. In 2009, Ryan Dahl created Node.js. Node.js is a runtime environment that allows you to run JavaScript directly on your computer or server outside the browser. It uses Google Chrome's fast V8 JavaScript engine. Now, developers can use JavaScript for both client-side and server-side code — this is called single-language fullstack development. Node.js is perfect for building APIs, chat applications, and streaming servers because it is fast and handles thousands of connections simultaneously. When you install Node.js, it comes with npm (Node Package Manager). npm is the largest registry of pre-written code packages in the world. Instead of writing database connections or email senders from scratch, you install a package using 'npm install package-name'. (Real world: When you book a cab on Uber, your mobile app (client) sends a request to Uber's servers (Node.js/Go backends). The server calculates the driver's route, stores the trip details in a database, and sends the price back to your app. Fullstack developers build every single link in this chain.)",
    syllabus: ["Client-Server model: the client (browser, mobile app) makes requests over the internet. The server (backend computer) processes requests, talks to database, and returns responses. Fullstack development = building both client and server layers.", "Node.js = runtime environment allowing JavaScript to run outside the browser on your computer. Built on Chrome's V8 engine. Enables writing server-side code using the same JavaScript language used on the frontend.", "npm (Node Package Manager) = command-line tool installed with Node.js. Used to install, share, and manage external code packages (libraries). npm install downloads code into node_modules and adds it to package.json."],
    eTitle: "Exam: Config Setup",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: First Git Commit",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Asynchronous Programming — Callbacks, Promises and Async/Await Made Simple",
    desc: "In normal programming, code runs sequentially: line 1 runs, then line 2, then line 3. Each line must finish before the next one starts. This is called synchronous code. But what if line 2 needs to fetch data from a database or load a large file from disk? This might take 3 seconds. In synchronous code, the entire server freezes for 3 seconds, unable to handle any other requests. JavaScript solves this with ASYNCHRONOUS programming. When an async operation starts (like loading a database file), JavaScript sends the task to the operating system and immediately moves to line 3 without waiting. When the OS finishes loading the file, it tells JavaScript to run a specific function with the data. This means the server never freezes. There are three ways to write async code in JavaScript: (1) Callbacks: passing a function as an argument to run after a task finishes. Can lead to nested code called 'callback hell'. (2) Promises: a Promise is a JavaScript object that represents a task that will complete in the future. It has three states: Pending (task is running), Fulfilled (task finished successfully, calling .then()), and Rejected (task failed, calling .catch()). (3) Async/Await: the modern, cleanest way to write async code. You mark a function with the keyword 'async'. Inside, you use the keyword 'await' before any asynchronous function. This tells JavaScript: pause inside this function until the promise finishes, then continue. To handle errors with async/await, you must wrap the code in a 'try/catch' block. If the awaited operation fails, it jumps directly to the 'catch' block. (Real world: When you order food on Zomato, the payment page waits for the bank's API to confirm your payment. Because Zomato's backend is asynchronous, the server doesn't freeze for other customers while waiting for your bank — it processes thousands of other orders simultaneously.)",
    syllabus: ["Synchronous vs Asynchronous: synchronous blocks execution (server freezes during long tasks). Asynchronous runs tasks in background, letting the server handle other requests without waiting.", "Promises: JS objects representing future results. 3 states: Pending, Fulfilled (calls .then() when resolved), Rejected (calls .catch() when error occurs). Promise.all([p1, p2]) runs multiple tasks in parallel.", "Async/Await: modern syntax for clean async code. Mark function with async, use await to pause inside function. Always wrap await calls in try-catch blocks to catch errors and prevent server crashes."],
    eTitle: "Exam: Async Loader",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Global Exception Monitor",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Express API Routers & Request Path Sanitizers",
    desc: "Master route path matching rules, Express application configuration setup, and path sanitization. (Real world: API gateways collapse multiple adjacent slashes in incoming request routes to match backend paths cleanly.)",
    syllabus: ["RESTful API routing principles", "Handling URL request paths slashes", "Chaining request routers middlewares"],
    eTitle: "Exam: Request Path Sanitizer",
    eDesc: "Write a JS function `sanitizePath(path)` returning a string with duplicate consecutive slashes replaced by a single slash. Return empty string if path is empty/null.",
    eStarter: "function sanitizePath(path) {\n    // Write your code here\n    \n}",
    eHint: "Check for null/empty values, then apply regex replacing one or more slashes with a single slash.",
    eTest: "if (typeof sanitizePath !== 'function') throw new Error('Method sanitizePath not found.');\nif (sanitizePath('/api//users') !== '/api/users') throw new Error('Slash collapse failed');\nif (sanitizePath(null) !== '') throw new Error('Null fallback check failed');",
    aTitle: "Assignment: Path Prefix Validator",
    aDesc: "Write a JS function `hasPathPrefix(path, prefix)` returning true if path starts with prefix. Return false if path or prefix is null.",
    aStarter: "function hasPathPrefix(path, prefix) {\n    // Write your code here\n    \n}",
    aHint: "Verify prefix match index using startsWith or substring controls.",
    aTest: "if (typeof hasPathPrefix !== 'function') throw new Error('Method hasPathPrefix not found.');"
  },
  {
    title: "Express Middleware: Authentication token checkers",
    desc: "Master API request middleware handlers. (Real world: Backend API endpoints require specific authorization headers, verifying token values formats before execution.)",
    syllabus: ["Express middleware functions signatures (req, res, next)", "Validating headers authorization keys", "Error statuses returns configurations"],
    eTitle: "Exam: Bearer Token Validator",
    eDesc: "Write a JS function `validateAuthHeader(authHeader)` returning true if authHeader is non-empty string and starts with 'Bearer ' and token value after prefix has length >= 10. Returns false otherwise.",
    eStarter: "function validateAuthHeader(authHeader) {\n    // Write your code here\n    \n}",
    eHint: "Check header string prefix matches, slicing token value and testing length limits.",
    eTest: "if (typeof validateAuthHeader !== 'function') throw new Error('Method validateAuthHeader not found');\nif (validateAuthHeader('Bearer t1234567890') !== true) throw new Error('Auth header validation failed');",
    aTitle: "Assignment: Request origin whitelist validator",
    aDesc: "Write a JS function `isOriginOk(origin, whitelist)` returning true if origin is in whitelist.",
    aStarter: "function isOriginOk(origin, whitelist) {\n    // Write your code here\n    \n}",
    aHint: "Evaluate array inclusion.",
    aTest: "if (typeof isOriginOk !== 'function') throw new Error('Method isOriginOk not found');"
  },
  {
    title: "REST APIs: JSON request body validator",
    desc: "Master backend model payload audits. (Real world: Library APIs validate book registration structures, rejecting requests with missing title or negative stock counts.)",
    syllabus: ["Express body parsers configurations", "JSON properties types audits", "Returning status code 400 bad requests"],
    eTitle: "Exam: Book Registry Payload Auditor",
    eDesc: "Write a JS function `isValidBookPayload(payload)` returning true if payload.title is non-empty string and payload.stock >= 0. Returns false otherwise.",
    eStarter: "function isValidBookPayload(payload) {\n    // Write your code here\n    \n}",
    eHint: "Verify payload properties type and boundaries parameters limits. Check null.",
    eTest: "if (typeof isValidBookPayload !== 'function') throw new Error('Method isValidBookPayload not found');\nif (isValidBookPayload({ title: 'React', stock: 5 }) !== true) throw new Error('Payload validator failed');",
    aTitle: "Assignment: String trimmer helper",
    aDesc: "Write a JS function `trimPayloadStr(str)` returning str.trim() or empty string if null.",
    aStarter: "function trimPayloadStr(str) {\n    // Write your code here\n    \n}",
    aHint: "Verify null boundaries.",
    aTest: "if (typeof trimPayloadStr !== 'function') throw new Error('Method trimPayloadStr not found');"
  },
  {
    title: "Database Integrations: SQL schema migration maps",
    desc: "Master SQL schema migrations. (Real world: Enterprise backends initialize table schemas, checking column data types before routing system queries.)",
    syllabus: ["Relational table schemas creation", "Primary key and auto-increment indices", "Column data constraints validation"],
    eTitle: "Exam: DB Schema Table Validator",
    eDesc: "Write a JS function `isTableSchemaSafe(tableConfig)` returning true if tableConfig.tableName is non-empty and tableConfig.primaryKey === 'id'. Returns false otherwise.",
    eStarter: "function isTableSchemaSafe(tableConfig) {\n    // Write your code here\n    \n}",
    eHint: "Verify table config properties constraints. Check null.",
    eTest: "if (typeof isTableSchemaSafe !== 'function') throw new Error('Method isTableSchemaSafe not found');\nif (isTableSchemaSafe({ tableName: 'books', primaryKey: 'id' }) !== true) throw new Error('Schema validator failed');",
    aTitle: "Assignment: Column datatype checker",
    aDesc: "Write a JS function `isColumnTypeAllowed(type)` returning true if type is 'TEXT' or 'INTEGER' or 'BOOLEAN'.",
    aStarter: "function isColumnTypeAllowed(type) {\n    // Write your code here\n    \n}",
    aHint: "Compare input string with allowed datatypes list.",
    aTest: "if (typeof isColumnTypeAllowed !== 'function') throw new Error('Method isColumnTypeAllowed not found');"
  },
  {
    title: "SQL Query Builders: Dynamic book database search",
    desc: "Master dynamic query construction. (Real world: Search backends append filtering clauses dynamically, building SQL statements matching criteria parameters.)",
    syllabus: ["SQL WHERE filter clause assemblies", "Parameterizing search string inputs", "Limiting search query results lists"],
    eTitle: "Exam: Book Query Builder",
    eDesc: "Write a JS function `buildBookSearchQuery(titleQuery, minStock)` returning SQL string: `'SELECT * FROM books WHERE title LIKE ? AND stock >= ' + minStock`. If titleQuery is empty, default target to '%'.",
    eStarter: "function buildBookSearchQuery(titleQuery, minStock) {\n    // Write your code here\n    \n}",
    eHint: "Concatenate search constraints parameters into SQL query layouts.",
    eTest: "if (typeof buildBookSearchQuery !== 'function') throw new Error('Method buildBookSearchQuery not found');\nif (buildBookSearchQuery('React', 3) !== 'SELECT * FROM books WHERE title LIKE ? AND stock >= 3') throw new Error('Book query builder failed');",
    aTitle: "Assignment: SQL wildcard formatter",
    aDesc: "Write a JS function `formatWildcard(str)` returning '%' + str + '%'.",
    aStarter: "function formatWildcard(str) {\n    // Write your code here\n    \n}",
    aHint: "Concatenate wildcards.",
    aTest: "if (typeof formatWildcard !== 'function') throw new Error('Method formatWildcard not found');"
  },
  {
    title: "Authentication APIs: JWT token signers",
    desc: "Master secure session signing. (Real world: Authentication endpoints sign user detail payloads, returning encrypted JWT strings to browser clients.)",
    syllabus: ["JWT token claims configurations", "Signing keys parameters and salts", "Token encryption durations checks"],
    eTitle: "Exam: JWT Header Constructor",
    eDesc: "Write a JS function `buildJwtHeader(alg)` returning stringified JSON header `{ alg: alg, typ: 'JWT' }`. Default alg to 'HS256' if empty.",
    eStarter: "function buildJwtHeader(alg) {\n    // Write your code here\n    \n}",
    eHint: "Create object, then serialize via JSON.stringify.",
    eTest: "if (typeof buildJwtHeader !== 'function') throw new Error('Method buildJwtHeader not found');\nconst header = JSON.parse(buildJwtHeader('HS256'));\nif (header.alg !== 'HS256' || header.typ !== 'JWT') throw new Error('JWT header builder failed');",
    aTitle: "Assignment: Token expiry date setter",
    aDesc: "Write a JS function `getJwtExpiryEpoch(durationSec, current)` returning current + durationSec.",
    aStarter: "function getJwtExpiryEpoch(durationSec, current) {\n    // Write your code here\n    \n}",
    aHint: "Sum values.",
    aTest: "if (typeof getJwtExpiryEpoch !== 'function') throw new Error('Method getJwtExpiryEpoch not found');"
  },
  {
    title: "API testing: Endpoint status checks",
    desc: "Master automated backend tests. (Real world: Deploy pipelines verify status codes and body JSON keys, ensuring servers respond safely.)",
    syllabus: ["Testing HTTP endpoint statuses", "Parsing body assertions properties", "Exception logging checking mechanisms"],
    eTitle: "Exam: API Status Code Auditor",
    eDesc: "Write a JS function `isResponseSuccess(res)` returning true if res.status >= 200 and res.status <= 299. Returns false otherwise.",
    eStarter: "function isResponseSuccess(res) {\n    // Write your code here\n    \n}",
    eHint: "Check status range boundaries.",
    eTest: "if (typeof isResponseSuccess !== 'function') throw new Error('Method isResponseSuccess not found');\nif (isResponseSuccess({ status: 200 }) !== true) throw new Error('Status auditor failed');",
    aTitle: "Assignment: Error code checker",
    aDesc: "Write a JS function `isClientErrorCode(status)` returning true if status >= 400 && status <= 499.",
    aStarter: "function isClientErrorCode(status) {\n    // Write your code here\n    \n}",
    aHint: "Compare bounds.",
    aTest: "if (typeof isClientErrorCode !== 'function') throw new Error('Method isClientErrorCode not found');"
  },
  {
    title: "Final Capstone: Library API compliance audit",
    desc: "Perform evaluations of router paths mappings, check middleware token verifications, verify SQL query parameters, and check JWT signing payloads. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["API route tables compliance scans", "Authorization header checks validation", "SQL parameter injection scans"],
    eTitle: "Exam: Fullstack API Compliance Auditor",
    eDesc: "Write a JS function `evaluateFullstackApi(report)` returning true if report.authHeaderValid === true and report.payloadsSecure === true and report.queriesSafe === true.",
    eStarter: "function evaluateFullstackApi(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.authHeaderValid, report.payloadsSecure, and report.queriesSafe boolean properties in report.",
    eTest: "if (typeof evaluateFullstackApi !== 'function') throw new Error('Method evaluateFullstackApi not found');\nconst rep = { authHeaderValid: true, payloadsSecure: true, queriesSafe: true };\nif (evaluateFullstackApi(rep) !== true) throw new Error('API compliance validation failed');",
    aTitle: "Assignment: Compliance status evaluator",
    aDesc: "Write a JS function `getAuditStatus(warningsCount)` returning 'compliant' if warningsCount === 0, 'critical' otherwise.",
    aStarter: "function getAuditStatus(warningsCount) {\n    // Write your code here\n    \n}",
    aHint: "Compare warnings variables.",
    aTest: "if (typeof getAuditStatus !== 'function') throw new Error('Method getAuditStatus not found');"
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Library API compliance audit (Review)",
    desc: "Review fullstack API build parameters, Express routing path structures, database schema definitions, and SQL query builders. (Real world: Devops leads audit API build scripts, checking routing schemas before production releases.)",
    syllabus: ["Reviewing Express path boundaries", "Assembling API compliance checklists", "Verifying SQL query configurations"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  }
];

export const FULLSTACK_30_DAYS_QUESTS = FULLSTACK_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `fullstack-basics-lecture-day-${dayNum}`,
    title: `Day ${dayNum} Learning: ${cfg.title}`,
    desc: cfg.desc,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: cfg.syllabus,
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };
  if (dayNum === 1) {
    return [
      lecture,
      {
        id: `fullstack-basics-lecture2-day-1`,
        title: `Day 1 Deep Dive: Syntax, Execution Rules, and Line-by-Line Breakdown`,
        desc: `In-depth step-by-step breakdown of Day 1 concepts, memory layout, and execution mechanics. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `fullstack-basics-lecture3-day-1`,
        title: `Day 1 Workshop: Real-World Industry Context & Visualization Guide`,
        desc: `Practical visualization guide and real-world system architecture context for Day 1. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  if (dayNum === 2) {
    return [
      lecture,
      {
        id: `fullstack-basics-lecture2-day-2`,
        title: `Day 2 Deep Dive: Flow Control, Logic Branching, and Execution Paths`,
        desc: `In-depth line-by-line mechanics of conditionals, loops, and memory execution state. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `fullstack-basics-lecture3-day-2`,
        title: `Day 2 Workshop: Practical Code Workshop & Edge Case Pitfall Warnings`,
        desc: `Practical code workshop analyzing common edge cases, off-by-one errors, and production traps. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  return buildEnrichedDayQuests('fullstack-basics', dayNum, cfg);
});
