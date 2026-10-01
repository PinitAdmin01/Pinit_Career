import type { LongLesson } from "./longLessons";

const lines = (...l: string[]) => l.join("\n");

export const NODE_WEB_LONG_LESSONS: LongLesson[] = [
  {
    "day": 1,
    "title": "The Node.js Runtime Architecture & The Event Loop",
    "goal": "Explain the V8 and libuv runtime architecture, how non-blocking I/O executes, and how the event loop processes tasks.",
    "minutes": 30,
    "parts": [
      {
        "title": "What Node.js Actually Is: V8 and libuv",
        "say": [
          "Welcome to the Node.js and TypeScript Backend Engineering course. Over the next thirty days, you are going to learn how production-grade backend servers work from the ground up, starting with the runtime environment itself.",
          "Node.js is not a programming language, and it is not a framework. Node.js is an open-source, cross-platform JavaScript runtime environment built on Google Chrome V8 engine and an asynchronous I/O library called libuv.",
          "Before Node was introduced in 2009 by Ryan Dahl, JavaScript lived almost exclusively inside web browsers, limited to manipulating HTML and responding to clicks. Node took V8 out of the browser and coupled it with C++ bindings to the operating system, allowing JavaScript to read files, listen on network sockets, and interact directly with hardware.",
          "The V8 engine parses and compiles your JavaScript code directly into machine code for your CPU, while libuv provides the platform-independent event loop and thread pool that makes Node non-blocking."
        ],
        "example": "Think of Node.js like a modern electric locomotive. The V8 engine is the powerful motor that turns high-voltage electricity into rotational force, while libuv is the complex suspension and steering gearbox that connects that motor cleanly to the railway tracks.",
        "code": "interface RuntimeProfile {\n  name: string;\n  engine: string;\n  architecture: string;\n}\nconst profile: RuntimeProfile = {\n  name: \"Node.js Backend\",\n  engine: \"V8 + libuv\",\n  architecture: \"Single-Threaded Event Loop\"\n};\nconsole.log(\"Server Runtime:\", profile.name, \"-\", profile.engine);",
        "codeNotes": [
          {
            "line": 6,
            "note": "TypeScript interfaces define the shape of runtime data structures for maximum clarity."
          },
          {
            "line": 11,
            "note": "console.log prints formatted output to the terminal standard output stream."
          }
        ],
        "tryIt": "Modify the profile object to include your own application name and run the code.",
        "check": {
          "question": "Which component in Node.js compiles JavaScript into native machine code?",
          "options": [
            "The V8 JavaScript Engine",
            "The libuv event loop library",
            "The npm package registry"
          ],
          "answer": 0,
          "why": "Google V8 compiles JavaScript into native machine code, while libuv manages the asynchronous I/O thread pool and event loop."
        },
        "output": "Server Runtime: Node.js Backend - V8 + libuv"
      },
      {
        "title": "Synchronous Blocking vs Non-Blocking I/O",
        "say": [
          "In traditional web servers like Apache or standard multi-threaded platforms, every incoming HTTP request is assigned to a dedicated operating system thread. If that request needs to query a database or read a file from disk, the thread sits completely idle, blocked and waiting for the disk or network to respond.",
          "Operating system threads are expensive: each thread consumes around one megabyte of memory stack space, and the CPU spends significant processing power switching context between thousands of threads.",
          "Node.js takes a fundamentally different architectural approach. Node executes your JavaScript application code on a single thread. When your code needs to perform an I/O operation—like reading from a database or fetching an external API—it delegates the waiting to the operating system kernel or libuv thread pool and continues running other code immediately.",
          "When the I/O operation finishes, the kernel alerts Node, and your callback or promise resolution is placed onto the event loop queue, ready to be executed when the call stack clears."
        ],
        "example": "Imagine a busy restaurant with one waiter. In a blocking model, the waiter takes Order 1 to the kitchen, stands in front of the chef until the meal is cooked 15 minutes later, carries it to Table 1, and only then takes Order 2. In Node non-blocking model, the waiter gives the ticket to the kitchen and immediately takes orders from Tables 2, 3, and 4 while the food cooks.",
        "code": "async function demoAsyncFlow(): Promise<void> {\n  const events: string[] = [];\n  events.push(\"1. Request received\");\n  events.push(\"2. Query delegated to background\");\n  await Promise.resolve().then(() => {\n    events.push(\"3. Query results resolved\");\n  });\n  console.log(events.join(\" -> \"));\n}\ndemoAsyncFlow();",
        "codeNotes": [
          {
            "line": 5,
            "note": "Promise.resolve schedules resolution onto the microtask queue without blocking the synchronous stack."
          }
        ],
        "tryIt": "Add another event between step 2 and the promise resolution to see non-blocking execution in action.",
        "check": {
          "question": "Why does Node.js achieve high concurrency on a single JavaScript thread?",
          "options": [
            "It delegates I/O waiting to the OS kernel so the thread stays free to handle other requests",
            "It runs thousands of native OS threads for each individual user request",
            "It speeds up JavaScript execution by ignoring all database errors"
          ],
          "answer": 0,
          "why": "Non-blocking I/O allows a single thread to handle thousands of concurrent requests by never sitting idle during network or disk operations."
        },
        "output": "1. Request received -> 2. Query delegated to background -> 3. Query results resolved"
      },
      {
        "title": "The Phases of the Event Loop: Timers, Poll, Check",
        "say": [
          "The libuv event loop is the heartbeat of every Node.js application. It is a continuous loop that executes through distinct phases in a strictly defined order on every iteration, often called a tick.",
          "The primary phases are: Timers, Pending Callbacks, Idle/Prepare, Poll, Check, and Close Callbacks. As a backend engineer, the three phases you interact with constantly are Timers, Poll, and Check.",
          "The Timers phase executes callbacks scheduled by setTimeout() and setInterval() whose threshold has elapsed. The Poll phase retrieves new I/O events from the OS, reads incoming network sockets, and executes I/O-related callbacks.",
          "The Check phase is dedicated exclusively to setImmediate() callbacks. If the Poll phase becomes idle and callbacks have been queued with setImmediate(), Node advances directly to the Check phase rather than waiting."
        ],
        "example": "Think of an airport gate agent. Phase 1: check if boarding time has arrived for ticket holders (Timers). Phase 2: welcome passengers arriving from connecting flights and scan their boarding passes (Poll). Phase 3: call standby passengers who were asked to wait right next to the podium (Check).",
        "code": "interface EventLoopPhase {\n  phase: string;\n  purpose: string;\n}\nconst loopPhases: EventLoopPhase[] = [\n  { phase: \"Timers\", purpose: \"setTimeout and setInterval callbacks\" },\n  { phase: \"Poll\", purpose: \"I/O events and incoming socket data\" },\n  { phase: \"Check\", purpose: \"setImmediate scheduled callbacks\" }\n];\nconsole.log(\"Key Event Loop Phases:\", loopPhases.map(p => p.phase).join(\", \"));",
        "codeNotes": [
          {
            "line": 5,
            "note": "Mapping loop phase definitions clarifies the architectural tick sequence."
          }
        ],
        "tryIt": "Add the Close Callbacks phase to the array and log its description.",
        "check": {
          "question": "Which event loop phase retrieves new I/O events and incoming network packets?",
          "options": [
            "The Poll phase",
            "The Timers phase",
            "The Close phase"
          ],
          "answer": 0,
          "why": "The Poll phase checks the operating system for ready I/O descriptors and processes incoming socket data."
        },
        "output": "Key Event Loop Phases: Timers, Poll, Check"
      },
      {
        "title": "Microtasks: process.nextTick and Promise Queues",
        "say": [
          "In addition to the libuv event loop phases, Node.js manages two critical microtask queues: the process.nextTick queue and the Promise microtask queue.",
          "Microtasks do not belong to libuv; they are managed directly by Node and V8. Whenever the JavaScript call stack transitions between operations or between event loop phases, Node completely drains the microtask queue before moving forward.",
          "The process.nextTick queue has the absolute highest priority in the entire runtime. Callbacks queued with process.nextTick() execute immediately after the current synchronous operation finishes, even before any resolved Promise microtasks or pending timers.",
          "Because microtasks drain exhaustively, recursively calling process.nextTick() can completely starve the event loop, preventing any network I/O or timers from ever executing."
        ],
        "example": "Imagine a doctor office where patients wait in the general waiting room for their appointments (the event loop phases). If an emergency crash cart call occurs (process.nextTick), the doctor treats that critical patient immediately before calling anyone from the waiting room.",
        "code": "async function traceMicrotasks(): Promise<void> {\n  const executionQueue: string[] = [];\n  executionQueue.push(\"1. Synchronous Frame\");\n  await Promise.resolve().then(() => {\n    executionQueue.push(\"2. Microtask Promise\");\n  });\n  executionQueue.push(\"3. Resumed Synchronous Frame\");\n  console.log(\"Execution Order:\", executionQueue.join(\" -> \"));\n}\ntraceMicrotasks();",
        "codeNotes": [
          {
            "line": 4,
            "note": "Microtasks execute immediately after the current frame finishes, before the next tick."
          }
        ],
        "tryIt": "Change the log labels to observe the exact asynchronous resumption sequence.",
        "check": {
          "question": "When do microtasks like Promise.then execute?",
          "options": [
            "Immediately after the current synchronous call stack clears, before advancing the event loop",
            "Only after all pending timers and network requests finish",
            "Once every minute on a background thread"
          ],
          "answer": 0,
          "why": "Microtask queues drain completely immediately after the current synchronous execution context empties."
        },
        "output": "Execution Order: 1. Synchronous Frame -> 2. Microtask Promise -> 3. Resumed Synchronous Frame"
      },
      {
        "title": "CPU-Bound vs I/O-Bound Workloads",
        "say": [
          "Understanding the difference between CPU-bound and I/O-bound operations is the single most important architectural skill in backend Node.js development.",
          "An I/O-bound operation spends almost all its time waiting for external systems: querying a PostgreSQL database over TCP, making an HTTPS request to Stripe, or streaming a video file from disk. Node excels at I/O-bound workloads because the single thread delegates the waiting and remains responsive.",
          "A CPU-bound operation, by contrast, requires intense calculation directly on the processor: resizing a high-resolution image, generating a cryptographic hash, parsing a 500-megabyte JSON file, or running machine learning matrix multiplications.",
          "Because Node executes JavaScript on a single thread, running heavy CPU-bound code blocks that thread completely. While the CPU calculates, no other user can connect, no HTTP requests are answered, and health checks will timeout."
        ],
        "example": "An I/O-bound task is like mailing a letter and waiting for a reply—you can do other things while the mail carrier delivers it. A CPU-bound task is like assembling a complex puzzle yourself with your own two hands—while your hands are busy, you cannot pick up the telephone.",
        "code": "function computeTaskType(isIo: boolean): string {\n  if (isIo) return \"I/O-Bound: Non-blocking, perfect for Node.js event loop\";\n  return \"CPU-Bound: Blocks main thread, offload to worker threads\";\n}\nconsole.log(\"Database Query:\", computeTaskType(true));\nconsole.log(\"Image Compression:\", computeTaskType(false));",
        "codeNotes": [
          {
            "line": 2,
            "note": "I/O operations yield execution back to the loop; CPU operations monopolize the thread."
          }
        ],
        "tryIt": "Add another classification for video transcoding and check its category.",
        "check": {
          "question": "What happens to a Node.js web server if an endpoint runs an expensive CPU calculation synchronously?",
          "options": [
            "The main thread blocks, preventing all other incoming requests from being handled",
            "Node automatically spawns 100 background threads to handle other users",
            "The calculation is automatically sent to the client browser"
          ],
          "answer": 0,
          "why": "Because JavaScript execution is single-threaded, synchronous CPU calculations block the event loop entirely."
        },
        "output": "Database Query: I/O-Bound: Non-blocking, perfect for Node.js event loop\nImage Compression: CPU-Bound: Blocks main thread, offload to worker threads"
      },
      {
        "title": "Structuring Clean Node.js Process Lifecycles",
        "say": [
          "Production Node.js applications run inside orchestrators like Docker, Kubernetes, or systemd. These environments need your process to communicate its health and shut down cleanly when instructed.",
          "The global process object provides vital telemetry and event hooks into the host operating system. Properties like process.pid, process.uptime(), process.memoryUsage(), and process.cwd() allow your server to monitor its own performance.",
          "When an orchestrator wants to deploy a new version of your server or scale down a pod, it sends a POSIX termination signal, typically SIGTERM or SIGINT. A production server must listen for these signals, stop accepting new HTTP connections, finish active requests, and close database pools before exiting.",
          "Never allow unhandled exceptions or unhandled promise rejections to linger silently. Always register global error listeners that log structured diagnostics and exit cleanly with a non-zero code so the container orchestrator can restart the unhealthy process."
        ],
        "example": "Think of closing a bank branch for the evening. You lock the front doors so no new customers can enter (stop accepting connections), help all customers currently standing at the counter complete their transactions (drain active requests), lock the vault (close database pool), and turn off the lights.",
        "code": "interface ServerHealth {\n  uptimeSeconds: number;\n  status: \"UP\" | \"DOWN\";\n  connections: number;\n}\nfunction checkHealth(activeConns: number): ServerHealth {\n  return {\n    uptimeSeconds: 3600,\n    status: \"UP\",\n    connections: activeConns\n  };\n}\nconst status = checkHealth(12);\nconsole.log(\"Server Health:\", status.status, \"- Active Connections:\", status.connections);",
        "codeNotes": [
          {
            "line": 7,
            "note": "Production health endpoints report current uptime and active request counts."
          }
        ],
        "tryIt": "Change the active connections count and observe the formatted output.",
        "check": {
          "question": "What is the correct production response when receiving a SIGTERM signal?",
          "options": [
            "Gracefully stop accepting new requests, finish existing requests, close resources, and exit cleanly",
            "Immediately crash the process without closing database connections",
            "Ignore the signal and keep running indefinitely"
          ],
          "answer": 0,
          "why": "Graceful shutdown prevents in-flight user requests from failing and avoids database connection leaks when containers restart."
        },
        "output": "Server Health: UP - Active Connections: 12"
      }
    ],
    "summary": [
      "Node.js combines the Google V8 engine for fast JavaScript compilation with libuv for asynchronous, non-blocking I/O.",
      "The single-threaded event loop processes work across structured phases: Timers, Poll for I/O events, and Check for setImmediate.",
      "Microtasks (process.nextTick and Promise.then) drain completely whenever the synchronous execution stack clears before the next phase.",
      "I/O-bound tasks should be delegated to the event loop, while heavy CPU-bound computations must be offloaded to worker threads to avoid blocking."
    ],
    "projectStep": {
      "title": "Initialize Node Server Workspace",
      "steps": [
        "Initialize package.json with \"type\": \"module\" and configure a strict tsconfig.json targeting Node 20+.",
        "Create src/server.ts with a structured server bootstrapper and health verification function."
      ]
    }
  },
  {
    "day": 2,
    "title": "Modern ECMAScript Modules (ESM) & Path Resolution",
    "goal": "Master ECMAScript Modules (import/export), URL-based file specifiers, path normalization, and package module configuration.",
    "minutes": 30,
    "parts": [
      {
        "title": "ES Modules vs CommonJS: The Modern Standard",
        "say": [
          "In early versions of Node.js, the only supported module system was CommonJS (require and module.exports). CommonJS was created before JavaScript had an official module syntax in ECMAScript 2015.",
          "CommonJS loads modules synchronously: when you call require(\"./database\"), Node pauses execution, reads the file from disk, evaluates it, and returns the exported object. This works well on server local disks but is incompatible with browsers and tree-shaking optimizers.",
          "ECMAScript Modules (ESM), using import and export statements, are the official standardized module format for the entire JavaScript ecosystem. ESM modules are parsed asynchronously and analyzed statically before any code runs.",
          "Static analysis means the JavaScript engine knows every import and export without executing the file. This enables modern bundlers to perform dead-code elimination (tree-shaking) and ensures circular dependencies are handled predictably.",
          "In production TypeScript architectures, adopting native ESM guarantees that your code adheres to standard ECMAScript specifications, allowing frictionless sharing of types, utilities, and components between server and client without transpilation hacks."
        ],
        "example": "CommonJS is like reading a recipe book one instruction at a time: you reach a step, stop cooking, walk to the pantry to find the next ingredient, and come back. ESM is like reading the entire ingredient list upfront and setting all measured bowls on your counter before lighting the stove.",
        "code": "interface ModuleStandard {\n  system: \"ESM\" | \"CommonJS\";\n  syntax: string;\n  staticAnalysis: boolean;\n}\nconst standard: ModuleStandard = {\n  system: \"ESM\",\n  syntax: \"import / export\",\n  staticAnalysis: true\n};\nconsole.log(\"Current Module Standard:\", standard.system, \"-\", standard.syntax);",
        "codeNotes": [
          {
            "line": 6,
            "note": "Explicit TypeScript module interfaces describe system capabilities clearly."
          }
        ],
        "tryIt": "Inspect the syntax property and try logging whether staticAnalysis is true.",
        "check": {
          "question": "What is the primary architectural advantage of ECMAScript Modules over CommonJS?",
          "options": [
            "Static analysis allows dependencies to be resolved and tree-shaken before execution",
            "ESM eliminates the need for any file extensions in Linux",
            "ESM runs twice as fast by skipping syntax checks"
          ],
          "answer": 0,
          "why": "Static analysis enables tools to analyze dependencies, optimize bundles, and detect missing imports before runtime."
        },
        "output": "Current Module Standard: ESM - import / export"
      },
      {
        "title": "Working with File and Directory URLs",
        "say": [
          "In traditional CommonJS, two global variables were available in every file: __filename (the absolute path of the current file) and __dirname (the directory containing it).",
          "In modern ECMAScript Modules, __filename and __dirname do not exist. Instead, ESM provides the import.meta metadata object, which includes import.meta.url—a standard file:// URL pointing to the active module.",
          "To work with operating system file paths in ESM, Node provides helper functions in the node:url module: fileURLToPath() converts a file:// URL to a platform-specific path string, and pathToFileURL() does the inverse.",
          "Understanding URL-based module specifiers ensures your backend code works identically across Linux containers, macOS workstations, and Windows development machines.",
          "When constructing relative paths to resources like email templates or database fixtures, always anchor them to import.meta.url rather than process.cwd() so that your scripts execute consistently regardless of the directory from which the Node process was launched."
        ],
        "example": "Think of coordinates versus street addresses. A GPS coordinate (import.meta.url) is universally valid anywhere on the globe, while a local postal street address (__dirname) requires translation into the specific country postal format.",
        "code": "function formatUrlSpecifier(protocol: string, host: string, pathname: string): string {\n  const formattedUrl = new URL(pathname, `${protocol}://${host}`);\n  return formattedUrl.pathname;\n}\nconst resolved = formatUrlSpecifier(\"file\", \"localhost\", \"/var/app/dist/server.js\");\nconsole.log(\"Resolved Module Path:\", resolved);",
        "codeNotes": [
          {
            "line": 2,
            "note": "The standard URL constructor parses and normalizes file paths predictably."
          }
        ],
        "tryIt": "Change the path to /home/node/app and verify the normalized output.",
        "check": {
          "question": "How do you obtain the current file path in modern ECMAScript Modules?",
          "options": [
            "Using import.meta.url converted with fileURLToPath",
            "By referencing the global __dirname variable directly",
            "By calling window.location.href"
          ],
          "answer": 0,
          "why": "import.meta.url is the modern ESM standard; __dirname and __filename are CommonJS-only globals."
        },
        "output": "Resolved Module Path: /var/app/dist/server.js"
      },
      {
        "title": "Path Resolution: path.join, path.resolve and path.normalize",
        "say": [
          "Backend servers manipulate file system paths constantly: reading uploaded resumes, loading configuration files, and serving compiled static assets.",
          "Never concatenate path strings with simple plus operators like folder + \"/\" + file. Windows uses backslashes (\\) as path separators, while Linux and macOS use forward slashes (/). Simple string concatenation creates broken paths and introduces directory traversal security vulnerabilities.",
          "The node:path module provides cross-platform path utilities. path.join() concatenates path segments using the host platform separator and resolves relative segments like \".\" and \"..\".",
          "path.resolve() treats paths like a sequence of cd commands in the terminal, resolving them into an absolute path anchored to the current working directory.",
          "In production cloud deployments, path normalization also protects against malicious dot-dot-slash directory traversal exploits where malicious clients attempt to access /etc/passwd or protected environment variables through uploaded file names."
        ],
        "example": "Path resolution is like giving directions. path.join says: \"walk 2 blocks forward, take 1 step back\". path.resolve says: \"starting from the city center GPS origin, walk to exact coordinate 4th and Main\".",
        "code": "function normalizePathSegments(base: string, endpoint: string): string {\n  const segments = `${base}/${endpoint}`.split(\"/\").filter(Boolean);\n  return \"/\" + segments.join(\"/\");\n}\nconst cleaned = normalizePathSegments(\"/api/v1/\", \"/users/profile/\");\nconsole.log(\"Normalized Endpoint:\", cleaned);",
        "codeNotes": [
          {
            "line": 2,
            "note": "Splitting on slash and filtering empty items removes redundant duplicate slashes."
          }
        ],
        "tryIt": "Test normalizePathSegments with multiple leading and trailing slashes.",
        "check": {
          "question": "Why should you avoid manual string concatenation for file paths in backend code?",
          "options": [
            "Different operating systems use different path separators (\\ vs /) leading to bugs and vulnerabilities",
            "JavaScript strings cannot hold more than 10 characters for file names",
            "File paths cannot contain letters when joined with +"
          ],
          "answer": 0,
          "why": "The node:path module handles platform-specific separators and resolves parent directory dots safely."
        },
        "output": "Normalized Endpoint: /api/v1/users/profile"
      },
      {
        "title": "Named Exports, Default Exports, and Re-exporting",
        "say": [
          "Clean modular architecture depends on clear interface boundaries. In ESM, you have two primary mechanisms for sharing code across files: named exports and default exports.",
          "A named export allows a file to export multiple distinct functions, interfaces, or classes by name. Importers must import them using the exact exported identifier enclosed in curly braces.",
          "A default export allows a module to declare a single primary export. Importers can choose whatever name they prefer when importing the default value.",
          "In large backend services, you frequently use the \"barrel\" export pattern: an index.ts file inside a feature directory re-exports all controllers, services, and repositories, providing a unified public API for the rest of the application.",
          "Explicit named exports are strongly favored in production enterprise codebases because they make IDE auto-imports reliable, refactorings automated, and prevent unintentional re-naming collisions across large engineering teams."
        ],
        "example": "Think of a toolbox. The toolbox itself is the module. A default export is the tool the box is named after (e.g. A drill set where the drill is the main tool). Named exports are the individual drill bits and screwdriver heads included in the case.",
        "code": "interface BarrelModule {\n  defaultService: string;\n  namedUtilities: string[];\n}\nconst authModule: BarrelModule = {\n  defaultService: \"AuthenticationService\",\n  namedUtilities: [\"hashPassword\", \"verifyToken\", \"parseHeader\"]\n};\nconsole.log(\"Service:\", authModule.defaultService, \"| Tools:\", authModule.namedUtilities.length);",
        "codeNotes": [
          {
            "line": 5,
            "note": "Exporting a main service alongside auxiliary utility functions is standard backend architecture."
          }
        ],
        "tryIt": "Add another utility name to namedUtilities and inspect the printed tool count.",
        "check": {
          "question": "What is a \"barrel export\" file in modern TypeScript backends?",
          "options": [
            "An index.ts file that aggregates and re-exports multiple related components from one directory",
            "A file that compresses JavaScript code into ZIP format",
            "A binary database file used for storing passwords"
          ],
          "answer": 0,
          "why": "Barrel files (index.ts) provide clean import boundaries, preventing callers from needing deep relative paths."
        },
        "output": "Service: AuthenticationService | Tools: 3"
      },
      {
        "title": "Package.json Module Configuration and \"type\": \"module\"",
        "say": [
          "To tell Node.js that your project uses ECMAScript Modules by default, you must set \"type\": \"module\" in your root package.json file.",
          "When \"type\": \"module\" is configured, Node treats all .js files as ESM. If you ever need to load legacy CommonJS in an ESM package, you can name the specific file with the .cjs extension.",
          "Conversely, in a project without \"type\": \"module\", Node treats .js as CommonJS, and requires the .mjs extension for ES modules.",
          "Modern backend applications also define the \"exports\" field in package.json. The \"exports\" field acts as an encapsulation boundary, defining precisely which files external consumers can import while hiding internal private implementation details.",
          "Combining package.json exports mapping with subpath imports (like #config or #services) allows clean, extensionless import statements without messy relative dots (../../..) traversing your directory tree."
        ],
        "example": "Setting \"type\": \"module\" in package.json is like declaring the official operating language at an international conference: once declared, all documents and speeches are expected in that language by default unless an explicit translation tag is worn.",
        "code": "interface PackageManifest {\n  name: string;\n  type: \"module\";\n  main: string;\n  engines: { node: string };\n}\nconst manifest: PackageManifest = {\n  name: \"career-os-backend\",\n  type: \"module\",\n  main: \"dist/index.js\",\n  engines: { node: \">=20.0.0\" }\n};\nconsole.log(\"Package:\", manifest.name, \"| Module mode:\", manifest.type);",
        "codeNotes": [
          {
            "line": 3,
            "note": "Declaring type: module enables native ESM across all standard JavaScript output files."
          }
        ],
        "tryIt": "Check the engines property to verify your package requires modern Node.js versions.",
        "check": {
          "question": "Which setting in package.json instructs Node.js to interpret .js files as ECMAScript Modules?",
          "options": [
            "\"type\": \"module\"",
            "\"module\": true",
            "\"esm\": \"enabled\""
          ],
          "answer": 0,
          "why": "Setting \"type\": \"module\" in package.json tells the Node.js module loader that .js files use ESM syntax."
        },
        "output": "Package: career-os-backend | Module mode: module"
      },
      {
        "title": "Handling Dynamic Imports and Conditional Loading",
        "say": [
          "Standard import statements must always appear at the top level of a file. You cannot place an import statement inside an if block, a loop, or a function body.",
          "However, production backends often need conditional loading: loading an expensive PDF generation library only when an invoice is requested, or loading database migration scripts only in migration mode.",
          "ECMAScript provides the dynamic import() function for this exact purpose. Calling import(specifier) returns a Promise that resolves to the module namespace object.",
          "Dynamic imports can be called anywhere in your code, accept runtime variables as specifiers, and allow your server to boot quickly by deferring heavy dependencies until they are actually needed.",
          "In microservice plugins and modular extensible backends, dynamic imports enable plugin discovery where modules are discovered and loaded at runtime based on active configuration flags."
        ],
        "example": "A static import is like bringing every piece of luggage on your trip just in case. A dynamic import is like using a local delivery service to bring winter coats only if it actually starts snowing.",
        "code": "async function loadMockPlugin(name: string): Promise<{ name: string; ready: boolean }> {\n  return await Promise.resolve({ name, ready: true });\n}\nasync function initPlugins() {\n  const plugin = await loadMockPlugin(\"analytics-engine\");\n  console.log(\"Dynamic Plugin Initialized:\", plugin.name, plugin.ready);\n}\ninitPlugins();",
        "codeNotes": [
          {
            "line": 5,
            "note": "Dynamic imports return promises that resolve with the module exports."
          }
        ],
        "tryIt": "Call initPlugins with a different module name and observe asynchronous resolution.",
        "check": {
          "question": "What does the dynamic import() function return?",
          "options": [
            "A Promise that resolves to the module exports object",
            "The module contents synchronously without a Promise",
            "A numeric file descriptor for the operating system"
          ],
          "answer": 0,
          "why": "Dynamic import() is asynchronous and returns a Promise resolving to the module namespace."
        },
        "output": "Dynamic Plugin Initialized: analytics-engine true"
      }
    ],
    "summary": [
      "ECMAScript Modules (ESM) are the modern, statically analyzed standard for JavaScript and TypeScript code.",
      "In ESM, __dirname and __filename are replaced by URL utilities built from import.meta.url.",
      "Always use cross-platform path utilities like path.join and path.resolve rather than manual string concatenation.",
      "Configure \"type\": \"module\" in package.json and use dynamic import() for conditional or deferred loading."
    ],
    "projectStep": {
      "title": "Configure ESM & Directory Aliases",
      "steps": [
        "Add \"type\": \"module\" to package.json and configure tsconfig path aliases for clean directory imports.",
        "Implement src/utils/paths.ts to provide cross-platform root path helpers."
      ]
    }
  },
  {
    "day": 3,
    "title": "Backend TypeScript Essentials: Narrowing & Discriminated Unions",
    "goal": "Master TypeScript type narrowing, discriminated unions for API responses, custom type guards, and exhaustive checking.",
    "minutes": 30,
    "parts": [
      {
        "title": "Why Type Safety Matters for Server Backends",
        "say": [
          "In frontend applications, a type error might cause a button to render with the wrong color or fail to submit a form. In a backend service, an unhandled type error crashes the server, corrupts records in the database, or leaks confidential financial data.",
          "TypeScript adds static type verification at compile time, eliminating entire classes of production bugs before code ever reaches deployment.",
          "A modern backend server processes untrusted input from thousands of external clients: query parameters, JSON request bodies, headers, and third-party webhook payloads. TypeScript ensures every payload is rigorously checked and typed.",
          "By modeling your domain logic with expressive types, your compiler becomes an active pairing partner that prevents invalid application states from ever being compiled.",
          "In large distributed microservices, strict type definitions act as executable contracts between independent teams, ensuring that breaking API schema changes are flagged immediately during build automation."
        ],
        "example": "Think of TypeScript types like standard container sizes at a global cargo port. Every box is precisely measured and labeled before loading. If a cargo piece does not match the crane locking specifications, it is stopped at the gate before boarding the ship.",
        "code": "interface UserRegistrationDto {\n  email: string;\n  tier: \"free\" | \"pro\";\n  credits: number;\n}\nconst newUser: UserRegistrationDto = {\n  email: \"student@pin.it\",\n  tier: \"pro\",\n  credits: 100\n};\nconsole.log(\"Validated User DTO:\", newUser.email, \"| Tier:\", newUser.tier);",
        "codeNotes": [
          {
            "line": 3,
            "note": "Literal union types (\"free\" | \"pro\") restrict strings to exact permitted values."
          }
        ],
        "tryIt": "Try changing tier to an invalid string like \"enterprise\" in your editor to see how TypeScript rejects it.",
        "check": {
          "question": "What is the primary benefit of compile-time type verification in backend servers?",
          "options": [
            "It catches invalid states, missing properties, and type mismatches before deployment",
            "It automatically creates database tables in PostgreSQL",
            "It makes JavaScript run without a CPU"
          ],
          "answer": 0,
          "why": "Static type checking catches errors during development and build steps before users trigger them in production."
        },
        "output": "Validated User DTO: student@pin.it | Tier: pro"
      },
      {
        "title": "Type Narrowing with typeof and the in Operator",
        "say": [
          "Type narrowing is the process where TypeScript refines an open, general type into a more specific, concrete type based on runtime control flow checks.",
          "JavaScript provides several built-in operators that TypeScript understands as type guards: typeof, instanceof, and the in operator.",
          "The typeof operator checks primitive types: \"string\", \"number\", \"boolean\", \"symbol\", \"bigint\", \"function\", and \"object\". When you wrap a variable in if (typeof val === \"string\"), TypeScript automatically narrows the variable to string inside that block.",
          "The in operator checks whether a specific property exists on an object. This is especially powerful when distinguishing between different payload shapes without needing explicit class instances.",
          "Mastering these runtime operators allows backend developers to write safe, bulletproof input sanitizers that inspect dynamic request parameters without resorting to unsafe type assertions or casts."
        ],
        "example": "Type narrowing is like a security guard checking identification at a gate. First question: \"Do you have a passport or a driver license?\" Once you show the passport, the guard specifically examines the country visa page, knowing it exists.",
        "code": "type Identifier = string | number;\nfunction formatIdentifier(id: Identifier): string {\n  if (typeof id === \"number\") {\n    return `NUM-${id.toFixed(0)}`;\n  }\n  return `STR-${id.toUpperCase()}`;\n}\nconsole.log(formatIdentifier(42), \"|\", formatIdentifier(\"adm_token\"));",
        "codeNotes": [
          {
            "line": 3,
            "note": "Inside the typeof id === \"number\" branch, TypeScript knows id has number methods like toFixed."
          },
          {
            "line": 6,
            "note": "Outside the if branch, TypeScript narrows id to string with methods like toUpperCase."
          }
        ],
        "tryIt": "Call formatIdentifier with 0 and with an empty string to observe both branches.",
        "check": {
          "question": "How does TypeScript understand typeof checks in your code?",
          "options": [
            "It uses control flow analysis to narrow the variable type inside the guarded block",
            "It converts all numbers into strings automatically",
            "It deletes the if statement when compiling to JavaScript"
          ],
          "answer": 0,
          "why": "Control flow analysis allows TypeScript to narrow types based on runtime conditional checks."
        },
        "output": "NUM-42 | STR-ADM_TOKEN"
      },
      {
        "title": "Discriminated Unions for HTTP API Payloads",
        "say": [
          "One of the most powerful patterns in modern backend TypeScript is the Discriminated Union (also called a Tagged Union or Algebraic Data Type).",
          "A discriminated union is a union of object types where every member shares a common literal property—called the discriminator or tag. Common discriminator names are \"type\", \"kind\", or \"status\".",
          "When you inspect the discriminator inside a switch statement or if check, TypeScript automatically narrows the entire object to the specific union variant that owns that discriminator value.",
          "This pattern is ideal for API responses (success vs error), payment gateway states (pending, completed, failed), and job queue messages (emailJob, webhookJob, reportJob).",
          "By designing domain events and command payloads as discriminated unions, event-driven architectures can route, process, and persist messages with zero ambiguity regarding available properties."
        ],
        "example": "Think of emergency vehicles approaching an intersection. They all have colored flashing lights. A red light means fire truck (prepare water hoses), a blue light means police car (clear traffic lane), and an orange light means tow truck (clear stalled vehicle). The light color discriminates the vehicle type instantly.",
        "code": "type ServiceResult =\n  | { status: \"success\"; data: { recordCount: number } }\n  | { status: \"error\"; errorMessage: string; errorCode: number };\nfunction handleResult(res: ServiceResult): string {\n  if (res.status === \"success\") {\n    return `Success: ${res.data.recordCount} items processed`;\n  }\n  return `Error [${res.errorCode}]: ${res.errorMessage}`;\n}\nconsole.log(handleResult({ status: \"success\", data: { recordCount: 8 } }));\nconsole.log(handleResult({ status: \"error\", errorMessage: \"Quota exceeded\", errorCode: 429 }));",
        "codeNotes": [
          {
            "line": 2,
            "note": "status: \"success\" is the discriminator for the positive branch."
          },
          {
            "line": 5,
            "note": "Checking res.status === \"success\" makes res.data safely accessible without null checks."
          }
        ],
        "tryIt": "Add another result branch with status: \"pending\" and handle it in handleResult.",
        "check": {
          "question": "What defines a discriminated union in TypeScript?",
          "options": [
            "A union of object types that all share a common literal discriminator property",
            "An array of numbers with random indices",
            "A class with only private static methods"
          ],
          "answer": 0,
          "why": "A shared literal property (the discriminator) allows TypeScript to distinguish variants cleanly."
        },
        "output": "Success: 8 items processed\nError [429]: Quota exceeded"
      },
      {
        "title": "User-Defined Custom Type Guards (is syntax)",
        "say": [
          "Built-in typeof checks can only inspect primitive values. What happens when you receive an arbitrary unknown payload from an HTTP request and need to verify it is a valid User object?",
          "TypeScript allows you to write custom type guards using the \"value is Type\" return type syntax. A custom type guard is a regular JavaScript function that returns a boolean, but whose return type asserts a type predicate.",
          "When the function returns true, TypeScript assumes the checked variable matches the declared type within the calling scope.",
          "Custom type guards bridge the gap between untrusted runtime data and compile-time type guarantees, ensuring your internal business logic receives only validated entities.",
          "In enterprise backend frameworks, custom type guards often underpin validation layers, inspecting parsed JSON bodies and guaranteeing safety before database insertion routines are invoked."
        ],
        "example": "A custom type guard is like a bouncer with an ID scanner. The scanner checks the magnetic strip, hologram, and expiration date. If the scanner beeps green (returns true), the patron is admitted as a verified adult.",
        "code": "interface JobPosting {\n  id: string;\n  title: string;\n  salary: number;\n}\nfunction isJobPosting(obj: unknown): obj is JobPosting {\n  return (\n    typeof obj === \"object\" &&\n    obj !== null &&\n    \"id\" in obj &&\n    \"title\" in obj &&\n    \"salary\" in obj\n  );\n}\nconst payload = { id: \"job_404\", title: \"Site Reliability Engineer\", salary: 140000 };\nconsole.log(\"Validated Job Entity:\", isJobPosting(payload), payload.title);",
        "codeNotes": [
          {
            "line": 6,
            "note": "obj is JobPosting informs the compiler that returning true guarantees the shape."
          }
        ],
        "tryIt": "Pass null and an empty object to isJobPosting to verify it safely returns false without throwing.",
        "check": {
          "question": "What does the return type syntax \"param is Type\" signify in a TypeScript function?",
          "options": [
            "It tells the compiler the function is a custom type guard that narrows param when returning true",
            "It forces the parameter to be converted to a string",
            "It registers the function in the global window scope"
          ],
          "answer": 0,
          "why": "The \"is\" keyword creates a type predicate, allowing custom boolean functions to narrow types."
        },
        "output": "Validated Job Entity: true Site Reliability Engineer"
      },
      {
        "title": "The unknown Type vs any: Safe Deserialization",
        "say": [
          "In legacy TypeScript code, developers frequently used the any type whenever they encountered external data. Using any tells the compiler: \"turn off all type checking for this variable and assume anything I do with it is valid\".",
          "Using any is dangerous: it allows you to call non-existent methods, access undefined properties, and pass invalid types, causing runtime crashes that TypeScript was meant to prevent.",
          "TypeScript 3.0 introduced the unknown type as the type-safe counterpart to any. The unknown type represents any JavaScript value, but the compiler forbids you from performing any operations on an unknown value until you narrow it.",
          "Whenever you parse JSON from an HTTP request or receive data from a socket, type the raw incoming data as unknown, not any. This forces you to validate before using.",
          "By treating all incoming network data as unknown, your codebase builds a resilient protective perimeter where unvalidated data cannot penetrate into internal domain services."
        ],
        "example": "The any type is like a package labeled \"DO NOT INSPECT—OPEN WITHOUT CAUTION\". You reach inside blindly. The unknown type is like a sealed, opaque security container: before you can open it, you must pass it through the X-ray scanner (validation).",
        "code": "function parseStringField(input: unknown): string {\n  if (typeof input === \"string\") {\n    return input.trim();\n  }\n  return \"default_value\";\n}\nconsole.log(\"Valid string:\", parseStringField(\"   clean token   \"));\nconsole.log(\"Invalid number:\", parseStringField(12345));",
        "codeNotes": [
          {
            "line": 2,
            "note": "You cannot call .trim() on input directly while it is unknown; narrowing is required."
          }
        ],
        "tryIt": "Pass undefined and an array to parseStringField to verify safe fallback behavior.",
        "check": {
          "question": "Why is the unknown type safer than any for incoming API data?",
          "options": [
            "TypeScript forces you to check and narrow unknown values before accessing properties or calling methods",
            "unknown encrypts all string values automatically",
            "unknown variables cannot be reassigned"
          ],
          "answer": 0,
          "why": "The compiler prevents operations on unknown values until runtime narrowing confirms their shape."
        },
        "output": "Valid string: clean token\nInvalid number: default_value"
      },
      {
        "title": "Exhaustive Pattern Matching with the never Type",
        "say": [
          "When writing switch statements over union types, a critical failure mode occurs when a new union member is added to the system later, but one of the switch statements forgets to handle it.",
          "TypeScript provides the never type to represent values that should never exist. If you narrow a union type until all possible variants have been handled in case branches, the remaining type in the default block is never.",
          "By assigning the unhandled variable to a const assertion of type never in the default block, you create an compile-time alarm: if a new variant is ever added to the union, the assignment will fail to compile immediately.",
          "This technique is known as exhaustive pattern matching, and it guarantees that your backend request handlers and state machines never overlook a case.",
          "In production financial workflows and state transition engines, exhaustive matching ensures that every new transaction state or error code is explicitly accounted for across all reporting systems."
        ],
        "example": "Exhaustive checking is like an aircraft departure checklist. If an engineer adds a 15th instrument to the cockpit, the pre-flight checklist will fail validation until every pilot checklist includes verification of that 15th dial.",
        "code": "type PaymentStatus = \"pending\" | \"settled\" | \"refunded\";\nfunction describePayment(status: PaymentStatus): string {\n  switch (status) {\n    case \"pending\": return \"Payment is awaiting bank clearance\";\n    case \"settled\": return \"Funds successfully transferred to merchant\";\n    case \"refunded\": return \"Funds reversed to customer card\";\n    default: {\n      const _exhaustive: never = status;\n      return _exhaustive;\n    }\n  }\n}\nconsole.log(\"Settled status:\", describePayment(\"settled\"));",
        "codeNotes": [
          {
            "line": 8,
            "note": "If you add a new status like \"failed\", TypeScript will flag this line as a compile error."
          }
        ],
        "tryIt": "Observe how the switch statement comprehensively maps every union variant.",
        "check": {
          "question": "What is the purpose of assigning unhandled switch cases to a never variable?",
          "options": [
            "It forces a compile error if a new union variant is added without being handled",
            "It causes the server to reboot on every payment",
            "It automatically creates refund records"
          ],
          "answer": 0,
          "why": "Exhaustive checking ensures all possible union variants are accounted for at compile time."
        },
        "output": "Settled status: Funds successfully transferred to merchant"
      }
    ],
    "summary": [
      "Static types in backends eliminate runtime null reference errors and ensure API contract integrity.",
      "Use typeof, instanceof, and the in operator to perform runtime type narrowing.",
      "Discriminated unions provide self-documenting, type-safe models for API payloads and state machines.",
      "Always prefer the unknown type over any for untrusted input, and enforce exhaustive checks with never."
    ],
    "projectStep": {
      "title": "Model Domain Types & Custom Guards",
      "steps": [
        "Define core entity types and discriminated API response models in src/types/api.ts.",
        "Implement custom runtime validation guards to inspect and sanitize incoming HTTP bodies."
      ]
    }
  },
  {
    "day": 4,
    "title": "Generic Types & Utility Types for Clean APIs",
    "goal": "Build reusable backend utilities using generic parameters, constraints, keyof lookup types, and built-in mapped types.",
    "minutes": 30,
    "parts": [
      {
        "title": "Understanding Generic Functions and Type Variables",
        "say": [
          "In backend engineering, you frequently write code that performs the exact same algorithmic logic regardless of the specific data type passing through it: pagination wrappers, caching layers, and database queries.",
          "Without generics, you would either have to duplicate the function for every single data entity (paginateUsers, paginateJobs, paginateOrders) or resort to using any, losing all type safety.",
          "Generics allow you to write functions, classes, and interfaces that take type parameters, conventionally denoted with single letters like T, U, or V. The caller specifies the type, or TypeScript infers it automatically.",
          "Generics provide complete code reusability while preserving full compile-time type fidelity from the input arguments through to the return value.",
          "In production API servers, generic wrapper types like PaginatedResponse<T> or ApiResponse<T> ensure that frontend clients and backend microservices share perfectly synchronized contract structures."
        ],
        "example": "Think of an envelope. The envelope has standard postal dimensions and sealing mechanics regardless of whether you put a graduation card, a bank statement, or a love letter inside. The envelope structure is generic; the payload is typed.",
        "code": "interface Envelope<T> {\n  payload: T;\n  receivedAt: number;\n}\nfunction createEnvelope<T>(payload: T): Envelope<T> {\n  return {\n    payload,\n    receivedAt: 1700000000\n  };\n}\nconst msg = createEnvelope({ userId: \"u_99\", role: \"admin\" });\nconsole.log(\"Enveloped User:\", msg.payload.userId, \"| Role:\", msg.payload.role);",
        "codeNotes": [
          {
            "line": 5,
            "note": "<T> declares a generic type parameter that carries through to Envelope<T>."
          }
        ],
        "tryIt": "Create another envelope holding an array of numbers and print its payload length.",
        "check": {
          "question": "Why are generics preferred over any for reusable functions?",
          "options": [
            "Generics retain exact type information throughout execution without losing type safety",
            "Generics automatically convert all inputs into strings",
            "Generics bypass the TypeScript compiler entirely"
          ],
          "answer": 0,
          "why": "Generics allow reusable code while preserving the exact types of inputs and return values."
        },
        "output": "Enveloped User: u_99 | Role: admin"
      },
      {
        "title": "Generic Constraints with the extends Keyword",
        "say": [
          "Sometimes a generic type parameter cannot be completely open to any type. You might need to guarantee that whatever type is passed has an \"id\" property, or can be converted to JSON.",
          "TypeScript allows you to constrain generic parameters using the extends keyword: <T extends Identifiable>. This tells the compiler: \"T can be any type, as long as it satisfies the Identifiable interface\".",
          "Inside the generic function, you can safely access all properties defined on the constraint without causing compiler errors.",
          "Generic constraints allow you to write generic repository operations like findById, save, or delete that work on any database entity with an ID.",
          "By combining constraints with union types, you can enforce that generic handlers only accept supported database entities while forbidding unsupported arbitrary shapes."
        ],
        "example": "Imagine a vending machine slot designed for round objects. You can insert a gold coin, a silver token, or an arcade token (generic tokens), but you cannot insert a square playing card. The slot constrains the shape to round items.",
        "code": "interface HasId {\n  id: string;\n}\nfunction printEntityId<T extends HasId>(entity: T): string {\n  return `Entity ID: ${entity.id.toUpperCase()}`;\n}\nconst job = { id: \"job_01\", title: \"Cloud Architect\", level: \"Senior\" };\nconsole.log(printEntityId(job));",
        "codeNotes": [
          {
            "line": 4,
            "note": "T extends HasId guarantees entity.id is always available and typed as string."
          }
        ],
        "tryIt": "Pass an object with both an id and multiple other custom fields to printEntityId.",
        "check": {
          "question": "What does <T extends HasId> enforce in a generic function?",
          "options": [
            "Any type passed as T must include all properties required by HasId",
            "T can only be the boolean true",
            "T must be an empty object"
          ],
          "answer": 0,
          "why": "The extends constraint enforces that T adheres to the structure of the specified interface."
        },
        "output": "Entity ID: JOB_01"
      },
      {
        "title": "Built-in Utility Types: Partial, Required, and Readonly",
        "say": [
          "TypeScript includes built-in utility types that transform existing types into new variations, eliminating repetitive manual interface declarations.",
          "Partial<T> constructs a type with all properties of T set to optional. This is the foundation of HTTP PATCH endpoints, where a client submits only the fields they want to update.",
          "Required<T> does the exact opposite: it removes optionality, constructing a type where every property must be present. This is useful for configuration loaders that supply default values for every optional setting.",
          "Readonly<T> marks all properties of T as readonly, preventing reassignment. This is essential for configuration objects and cached state that should never be mutated by request handlers.",
          "Understanding these transformations enables you to design DRY (Don't Repeat Yourself) data architectures where entity modifications automatically propagate across all update payloads."
        ],
        "example": "Partial<T> is like a survey where all questions are optional. Required<T> is like a passport application where every single field must be filled in before submission. Readonly<T> is like an official laminated birth certificate: you can view it, but you cannot write on it.",
        "code": "interface AppConfig {\n  port: number;\n  host: string;\n  debug?: boolean;\n}\nfunction applyServerDefaults(userConfig: Partial<AppConfig>): Required<AppConfig> {\n  return {\n    port: userConfig.port ?? 3000,\n    host: userConfig.host ?? \"0.0.0.0\",\n    debug: userConfig.debug ?? false\n  };\n}\nconst finalConfig = applyServerDefaults({ port: 8080 });\nconsole.log(\"Server host:\", finalConfig.host, \"| Port:\", finalConfig.port);",
        "codeNotes": [
          {
            "line": 6,
            "note": "userConfig is Partial<AppConfig>, allowing any subset of properties to be supplied."
          },
          {
            "line": 12,
            "note": "The return value is Required<AppConfig>, guaranteeing host and debug are present."
          }
        ],
        "tryIt": "Supply custom values for all three fields and observe the resolved configuration.",
        "check": {
          "question": "Which utility type makes all properties of an existing type optional for PATCH updates?",
          "options": [
            "Partial<T>",
            "Required<T>",
            "Readonly<T>"
          ],
          "answer": 0,
          "why": "Partial<T> sets every property on T to optional (key?: type)."
        },
        "output": "Server host: 0.0.0.0 | Port: 8080"
      },
      {
        "title": "Selective Typing: Pick and Omit for DTOs",
        "say": [
          "When designing API endpoints, you almost never expose database models directly to clients. Database models contain sensitive internal fields like passwordHash, salt, internalVersion, or softDeleteAt.",
          "Pick<T, K> constructs a new type by selecting a set of keys K from type T. For example, Pick<User, \"id\" | \"name\" | \"email\"> creates a safe public user representation.",
          "Omit<T, K> does the inverse: it constructs a type with all properties of T except the keys specified in K. For example, Omit<User, \"passwordHash\"> strips the password hash from the user object.",
          "Using Pick and Omit ensures that as your core models evolve, your API Data Transfer Objects (DTOs) remain strictly synchronized without accidental data leaks.",
          "In security-critical environments, using Pick rather than Omit is recommended for public APIs: an allowlist approach ensures that newly added sensitive columns are never exposed by accident."
        ],
        "example": "Think of a job applicant resume. The full internal hiring file contains salary expectations, background checks, and reference interviews. When forwarding the resume to the interview panel, HR Omits the salary notes and Picks only the candidate technical skills and experience.",
        "code": "interface UserDbRecord {\n  id: string;\n  username: string;\n  email: string;\n  passwordHash: string;\n}\ntype PublicUserDto = Pick<UserDbRecord, \"id\" | \"username\" | \"email\">;\nconst publicUser: PublicUserDto = {\n  id: \"usr_10\",\n  username: \"vikram\",\n  email: \"vikram@pin.it\"\n};\nconsole.log(\"Public DTO:\", publicUser.username, \"(no passwordHash field)\");",
        "codeNotes": [
          {
            "line": 7,
            "note": "PublicUserDto picks only safe public fields, omitting internal sensitive hashes."
          }
        ],
        "tryIt": "Verify that attempting to assign passwordHash to publicUser causes a TypeScript compile error.",
        "check": {
          "question": "How do you create a safe public user type that excludes passwordHash from a database model?",
          "options": [
            "Using Omit<User, \"passwordHash\"> or Pick with only public fields",
            "By setting passwordHash: any",
            "By deleting the property at runtime with delete user.passwordHash"
          ],
          "answer": 0,
          "why": "Pick and Omit create compile-time safe representations that prevent sensitive fields from leaking."
        },
        "output": "Public DTO: vikram (no passwordHash field)"
      },
      {
        "title": "Lookup Types and Indexed Access: keyof and T[K]",
        "say": [
          "Backend systems frequently handle dynamic attribute filtering and sorting: for example, an endpoint that allows querying /users?sortBy=email or /jobs?filterBy=salary.",
          "The keyof operator queries an object type and produces a string or numeric literal union of its keys. For example, keyof User produces \"id\" | \"name\" | \"email\".",
          "Indexed access types, written as T[K], look up the exact type of property K on type T. If User[\"age\"] is number, then T[\"age\"] evaluates to number.",
          "Combining generic parameters with keyof and indexed access allows you to write perfectly type-safe property getter and sorting utilities that the compiler validates completely.",
          "This eliminates hard-coded string sorting bugs and ensures that database query builders validate column names before sending SQL queries to the engine."
        ],
        "example": "keyof is like an official catalog index of chapter titles in a book. If you ask the librarian for a chapter that is in the index, they can immediately flip to the exact page type (T[K]). If you ask for a chapter not in the index, they reject the request immediately.",
        "code": "interface JobPosting {\n  title: string;\n  location: string;\n  openings: number;\n}\nfunction getJobAttribute<K extends keyof JobPosting>(job: JobPosting, key: K): JobPosting[K] {\n  return job[key];\n}\nconst post: JobPosting = { title: \"DevOps Engineer\", location: \"Bengaluru\", openings: 4 };\nconsole.log(\"Attribute Value:\", getJobAttribute(post, \"location\"));",
        "codeNotes": [
          {
            "line": 6,
            "note": "K extends keyof JobPosting ensures only valid keys can be requested."
          },
          {
            "line": 6,
            "note": "JobPosting[K] ensures the return type matches the specific property requested."
          }
        ],
        "tryIt": "Call getJobAttribute requesting \"openings\" and verify the return value is typed as number.",
        "check": {
          "question": "What does the keyof operator produce when applied to an interface?",
          "options": [
            "A union of string literal types representing the property names of the interface",
            "An array of all values stored inside the interface",
            "The number of methods declared in the interface"
          ],
          "answer": 0,
          "why": "keyof produces a literal union of all public property names on the target type."
        },
        "output": "Attribute Value: Bengaluru"
      },
      {
        "title": "Building a Type-Safe Entity Store with Generics",
        "say": [
          "Now let us combine generic constraints, interfaces, and methods into a reusable architectural component: a generic in-memory entity repository.",
          "In production enterprise applications, the Repository Pattern separates database access mechanics from business logic. Services interact with repository interfaces, enabling easy testing with mock in-memory stores.",
          "A generic repository class or factory accepts an entity type parameter T extends { id: string } and manages CRUD operations (Create, Read, Update, Delete) on an internal collection.",
          "Because the repository is fully generic and type-safe, you can instantiate it for Users, Jobs, Applications, or Courses without duplicating a single line of storage logic.",
          "This repository abstraction layer also provides an ideal insertion point for cross-cutting infrastructure concerns such as performance auditing, telemetry metrics, and distributed caching."
        ],
        "example": "A generic entity store is like an automated warehouse storage rack. The rack does not care whether the bin holds microchips, medical vials, or books, as long as each bin carries an RFID barcode identifier (id: string). The crane finds, stores, and retrieves bins using the same universal mechanics.",
        "code": "class GenericMemoryStore<T extends { id: string }> {\n  private records = new Map<string, T>();\n  save(item: T): T {\n    this.records.set(item.id, { ...item });\n    return item;\n  }\n  findById(id: string): T | null {\n    return this.records.get(id) ? { ...this.records.get(id)! } : null;\n  }\n}\nconst store = new GenericMemoryStore<{ id: string; role: string }>();\nstore.save({ id: \"adm_1\", role: \"DevOps Administrator\" });\nconsole.log(\"Stored Entity:\", store.findById(\"adm_1\")?.role);",
        "codeNotes": [
          {
            "line": 1,
            "note": "Generic constraint T extends { id: string } guarantees every stored item has an id."
          },
          {
            "line": 4,
            "note": "Returning cloned objects prevents accidental external mutation of internal store state."
          }
        ],
        "tryIt": "Add a delete(id: string): boolean method to the store class and test removing an entity.",
        "check": {
          "question": "Why should an in-memory repository return copies of objects rather than direct references?",
          "options": [
            "To prevent callers from accidentally mutating internal storage state without going through repository methods",
            "Because JavaScript cannot store original objects in Maps",
            "To double the memory usage of the server"
          ],
          "answer": 0,
          "why": "Defensive copying preserves encapsulation and prevents side-channel state mutation."
        },
        "output": "Stored Entity: DevOps Administrator"
      }
    ],
    "summary": [
      "Generics enable reusable, type-safe data structures and functions across your backend codebase.",
      "Constrain generic type parameters with extends to guarantee required properties like identifiers.",
      "Use built-in utility types like Partial, Required, Pick, and Omit to transform domain models cleanly.",
      "Leverage keyof and indexed access types to build robust, compile-time verified querying utilities."
    ],
    "projectStep": {
      "title": "Implement Generic DTO & Entity Utilities",
      "steps": [
        "Create src/utils/dto.ts containing generic Pick and Omit projection helpers.",
        "Implement src/repositories/baseRepository.ts defining the generic CRUD repository interface."
      ]
    }
  },
  {
    "day": 5,
    "title": "Asynchronous Flow Control & Production Error Handling",
    "goal": "Master Promise semantics, concurrent batching with Promise.allSettled, custom error hierarchies, and process error safety.",
    "minutes": 30,
    "parts": [
      {
        "title": "Promises Under the Hood and async/await Semantics",
        "say": [
          "JavaScript asynchronous programming has evolved through three major eras: callbacks, Promises, and async/await. In modern Node.js backend development, async/await is the standard idiom.",
          "An async function always returns a Promise. If the function returns a value, the Promise resolves with that value. If the function throws an error, the Promise rejects with that error.",
          "The await keyword pauses execution of the surrounding async function until the awaited Promise settles. Crucially, await only pauses that specific function; the Node.js event loop continues processing other requests in the background.",
          "Under the hood, async/await is syntactic sugar over native V8 microtasks. Understanding this ensures you write concurrent, non-blocking asynchronous workflows.",
          "Writing asynchronous code with async/await makes stack traces substantially easier to read and debug than deeply nested callback waterfalls or raw Promise chaining chains."
        ],
        "example": "Calling an async function is like taking a buzzer at a pharmacy counter while your prescription is filled. You can walk around the store, read a magazine, or look at other products. When the buzzer vibrates (the Promise resolves), you step back up to the counter and continue your transaction.",
        "code": "async function retrieveUserData(userId: string): Promise<{ id: string; active: boolean }> {\n  return { id: userId, active: true };\n}\nasync function executeWorkflow(): Promise<void> {\n  const user = await retrieveUserData(\"usr_200\");\n  console.log(\"Retrieved User ID:\", user.id, \"| Active Status:\", user.active);\n}\nexecuteWorkflow();",
        "codeNotes": [
          {
            "line": 1,
            "note": "async functions always wrap their return value in a Promise."
          },
          {
            "line": 5,
            "note": "await unwraps the Promise result cleanly without nested callbacks."
          }
        ],
        "tryIt": "Modify the function to return an email field and log it inside executeWorkflow.",
        "check": {
          "question": "What happens to the Node.js event loop when an async function encounters an await statement?",
          "options": [
            "The function pauses, but the event loop continues processing other requests concurrently",
            "The entire server freezes until the awaited Promise resolves",
            "Node automatically creates a new operating system thread"
          ],
          "answer": 0,
          "why": "await yields execution back to the event loop, allowing other concurrent requests to proceed."
        },
        "output": "Retrieved User ID: usr_200 | Active Status: true"
      },
      {
        "title": "Concurrent Operations: Promise.all vs Promise.allSettled",
        "say": [
          "Backend endpoints frequently need to fetch data from multiple independent sources concurrently: for example, fetching user profile information, order history, and notification counts simultaneously.",
          "A common novice mistake is to await each promise sequentially: const u = await getUser(); const o = await getOrders();. If each takes 200 milliseconds, the total endpoint latency is 400 milliseconds.",
          "Promise.all() initiates all promises concurrently. If all succeed, it returns an array of results in exactly 200 milliseconds. However, Promise.all has a \"fail-fast\" behavior: if even one promise rejects, the entire batch rejects immediately, ignoring all successful responses.",
          "Promise.allSettled() is the resilient alternative. It waits for every promise to complete, whether fulfilled or rejected, returning an array of settlement objects ({ status: \"fulfilled\", value } or { status: \"rejected\", reason }). This allows your backend to degrade gracefully when secondary services fail.",
          "In modern high-availability microservice architectures, Promise.allSettled enables composite dashboard endpoints where partial data is returned alongside degradation notices."
        ],
        "example": "Promise.all is like a group of friends ordering a team pizza: if one person is allergic to gluten, the entire order is canceled. Promise.allSettled is like ordering individual lunch boxes: even if one person delivery fails, everyone else receives and eats their lunch.",
        "code": "async function testConcurrentSettlement(): Promise<void> {\n  const taskA = Promise.resolve(\"Service A: OK\");\n  const taskB = Promise.reject(new Error(\"Service B: 503 Unavailable\"));\n  const outcomes = await Promise.allSettled([taskA, taskB]);\n  const report = outcomes.map((o, idx) => `Task ${idx + 1}: ${o.status}`);\n  console.log(\"Settled Summary:\", report.join(\" | \"));\n}\ntestConcurrentSettlement();",
        "codeNotes": [
          {
            "line": 4,
            "note": "Promise.allSettled never rejects; it collects outcomes for every operation."
          }
        ],
        "tryIt": "Add a third task that succeeds and observe how allSettled reports 2 fulfilled and 1 rejected.",
        "check": {
          "question": "Why is Promise.allSettled preferred over Promise.all for independent secondary service calls?",
          "options": [
            "It allows successful calls to be processed even if one secondary service fails",
            "It automatically retries all failed requests 100 times",
            "It prevents promises from using memory"
          ],
          "answer": 0,
          "why": "Promise.allSettled isolates failures so one failing task does not abort the entire batch."
        },
        "output": "Settled Summary: Task 1: fulfilled | Task 2: rejected"
      },
      {
        "title": "Safe Error Handling with Custom AppError Hierarchies",
        "say": [
          "Never throw generic new Error(\"something went wrong\") in a production backend. Generic errors lack the metadata required to determine the appropriate HTTP status code or client-facing message.",
          "Professional Node.js applications define a custom AppError class that extends JavaScript built-in Error. An AppError includes properties like statusCode (e.g. 404, 400, 403), isOperational (distinguishing expected domain failures from unexpected programming bugs), and optional error codes.",
          "By standardizing on an AppError hierarchy, your centralized Express or Fastify error-handling middleware can inspect err.statusCode and respond to clients with RFC-compliant problem details.",
          "Operational errors (like invalid input or invalid login credentials) should result in 4xx responses, while programmer errors (like TypeError: Cannot read property of undefined) should be logged with full stack traces and returned as 500 Internal Server Error.",
          "Maintaining a clear distinction between operational errors and system bugs ensures that your security auditing tools can detect brute-force attempts without alerting on normal operational validations."
        ],
        "example": "Custom errors are like hospital triage tags. A green tag means minor scrape (400 Bad Request: client needs a bandage). A red tag means critical trauma (500 Internal Server Error: page the senior surgeon immediately). Standardizing tags ensures the staff knows exactly what protocol to trigger.",
        "code": "class BackendAppError extends Error {\n  constructor(\n    public statusCode: number,\n    message: string,\n    public isOperational: boolean = true\n  ) {\n    super(message);\n    this.name = \"BackendAppError\";\n  }\n}\nconst notFound = new BackendAppError(404, \"User profile not found\");\nconsole.log(\"Created Error:\", notFound.statusCode, \"-\", notFound.message);",
        "codeNotes": [
          {
            "line": 1,
            "note": "Extending Error preserves the native stack trace capture mechanism."
          },
          {
            "line": 5,
            "note": "isOperational: true flags the error as a known, handled domain condition."
          }
        ],
        "tryIt": "Create a 403 Forbidden error instance using BackendAppError and log its properties.",
        "check": {
          "question": "What is the purpose of extending Error with a custom AppError class in backends?",
          "options": [
            "To attach HTTP status codes and operational flags for standardized error response handling",
            "To prevent any errors from ever being thrown in JavaScript",
            "To replace the Node.js event loop with C++ code"
          ],
          "answer": 0,
          "why": "Attaching status codes and operational flags allows global error middleware to format appropriate HTTP responses."
        },
        "output": "Created Error: 404 - User profile not found"
      },
      {
        "title": "Timeout Patterns and Promise Races",
        "say": [
          "In distributed backend systems, external services (payment gateways, notification providers, third-party APIs) will eventually hang without responding. If an external service hangs, your incoming HTTP connection stays open indefinitely, leaking server memory and exhausting socket pools.",
          "Production code must enforce strict timeouts on all external network operations using Promise.race() or the modern AbortSignal.timeout() API.",
          "Promise.race() takes an array of promises and resolves or rejects as soon as the first promise settles. By racing your database query against a timer promise that rejects after 5000 milliseconds, you guarantee that a frozen query will fail fast.",
          "Failing fast with a 504 Gateway Timeout allows your load balancer to redirect traffic and keeps your server threads free for other healthy traffic.",
          "Combining timeout patterns with automated retry policies and exponential backoff creates resilient fault tolerance against intermittent cloud network blips."
        ],
        "example": "Think of waiting for a taxi. If you have a train to catch at 3:00 PM, you wait for the taxi until 2:30 PM. If the taxi arrives before 2:30, you take it. If 2:30 passes and no taxi has arrived, you immediately trigger your fallback plan and take the subway instead.",
        "code": "async function executeWithSimulatedTimeout<T>(primary: () => Promise<T>): Promise<T> {\n  return await primary();\n}\nasync function testTimeoutWrapper() {\n  const res = await executeWithSimulatedTimeout(async () => \"Fast Service Result\");\n  console.log(\"Operation Result:\", res);\n}\ntestTimeoutWrapper();",
        "codeNotes": [
          {
            "line": 1,
            "note": "Timeout wrappers enforce maximum duration boundaries on remote service calls."
          }
        ],
        "tryIt": "Wrap an async function that returns a simulated user object and log its resolved output.",
        "check": {
          "question": "Why should external network requests always have an explicit timeout configured?",
          "options": [
            "To prevent hanging remote calls from permanently holding open server sockets and resources",
            "Because timeouts make network requests download faster",
            "To disable SSL certificates on remote servers"
          ],
          "answer": 0,
          "why": "Explicit timeouts ensure hanging external dependencies fail fast rather than exhausting server connections."
        },
        "output": "Operation Result: Fast Service Result"
      },
      {
        "title": "Error Propagation vs Error Swallowing in Pipelines",
        "say": [
          "A pervasive anti-pattern in backend code is \"error swallowing\": catching an exception inside a try/catch block and doing nothing with it, or simply logging console.log(err) and returning null.",
          "When you swallow an error without propagating it or handling it cleanly, callers further up the stack assume the operation succeeded. This leads to subtle data corruption, missing database updates, and impossible-to-debug states.",
          "Always adhere to the rule of error handling: catch an error only if you can meaningfully handle it (e.g. Return a cached fallback or retry). If you cannot resolve the problem at that level, re-throw the error or wrap it in a contextual AppError and allow centralized middleware to handle it.",
          "Clean error propagation keeps functions focused on their happy path while guaranteeing failures bubble up to observability layers.",
          "Structured error logging with distributed trace IDs ensures that when an error bubbles up to the top level, engineers can correlate the failure across logs, metrics, and client reports."
        ],
        "example": "Error swallowing is like a smoke alarm that detects a fire in the kitchen, turns off its own siren so it does not bother the sleeping family, and goes back to sleep. When a fire occurs, the alarm must sound loudly so the household can evacuate.",
        "code": "function safeJsonParse<T>(raw: string, fallback: T): T {\n  try {\n    return JSON.parse(raw);\n  } catch {\n    return fallback;\n  }\n}\nconst valid = safeJsonParse('{\"port\": 5000}', { port: 3000 });\nconst corrupted = safeJsonParse(\"not-json\", { port: 3000 });\nconsole.log(\"Parsed Valid Port:\", valid.port, \"| Fallback Port:\", corrupted.port);",
        "codeNotes": [
          {
            "line": 5,
            "note": "Catching JSON parse errors and providing a known default is a legitimate fallback pattern."
          }
        ],
        "tryIt": "Test safeJsonParse with an empty string and verify the fallback is returned cleanly.",
        "check": {
          "question": "What is the danger of \"error swallowing\" in backend service layers?",
          "options": [
            "Callers assume operations succeeded, hiding critical failures and corrupting application state",
            "It causes the CPU to overheat",
            "It slows down JSON parsing"
          ],
          "answer": 0,
          "why": "Swallowing errors hides failures from monitoring systems and leads to unpredictable data corruption."
        },
        "output": "Parsed Valid Port: 5000 | Fallback Port: 3000"
      },
      {
        "title": "Building an Asynchronous Batch Worker with Failure Isolation",
        "say": [
          "In production systems, backend workers regularly process batches of jobs: sending email notifications to 500 users, updating product prices from a CSV feed, or syncing invoices with an accounting platform.",
          "If you process 500 records in a simple loop and item 240 throws an unhandled exception, your entire worker crashes, leaving the remaining 260 records unprocessed and the system in an inconsistent half-finished state.",
          "A resilient batch worker isolates each task execution within a try/catch boundary, records the outcome (success or failure with error details), and aggregates the final results into a structured summary.",
          "This guarantees that poison-pill records do not bring down the entire batch pipeline, and enables dead-letter queue routing for failed jobs.",
          "In mission-critical background workers, recording individual errors in a dedicated failure table allows operators to inspect and replay failed tasks without re-executing successful work."
        ],
        "example": "Think of an automated postal sorting facility. If one package has a torn address label, the robotic arm diverts that single defective package to an inspection bin and continues sorting the other 9,999 packages. The entire conveyor belt is not halted for one torn box.",
        "code": "interface WorkerResult {\n  processed: number;\n  failed: number;\n  errors: string[];\n}\nasync function runBatchWorker(items: string[]): Promise<WorkerResult> {\n  let processed = 0;\n  let failed = 0;\n  const errors: string[] = [];\n  for (const item of items) {\n    if (item === \"invalid\") {\n      failed++;\n      errors.push(\"Invalid payload rejected\");\n    } else {\n      processed++;\n    }\n  }\n  return { processed, failed, errors };\n}\nasync function execute() {\n  const summary = await runBatchWorker([\"task1\", \"invalid\", \"task2\"]);\n  console.log(\"Batch Processed:\", summary.processed, \"Failed:\", summary.failed);\n}\nexecute();",
        "codeNotes": [
          {
            "line": 10,
            "note": "Isolating failures per item ensures the batch loop processes all remaining items."
          }
        ],
        "tryIt": "Pass a list with multiple invalid items and observe the aggregated failure count.",
        "check": {
          "question": "How should a resilient batch processor handle an error on an individual record?",
          "options": [
            "Isolate the error, record the failure, and continue processing the remaining items in the batch",
            "Immediately crash the entire Node.js server",
            "Delete the database table"
          ],
          "answer": 0,
          "why": "Failure isolation prevents single poisoned records from blocking or crashing the entire batch queue."
        },
        "output": "Batch Processed: 2 Failed: 1"
      }
    ],
    "summary": [
      "Async/await provides clean, non-blocking asynchronous syntax that yields execution to the event loop.",
      "Use Promise.allSettled over Promise.all when concurrent tasks are independent and partial success is acceptable.",
      "Define a custom AppError hierarchy with HTTP status codes and operational flags for centralized error handling.",
      "Isolate failures in batch workers and enforce strict timeouts on external network dependencies to maintain resilience."
    ],
    "projectStep": {
      "title": "Build Global Error Hierarchy & Async Handlers",
      "steps": [
        "Create src/errors/appError.ts defining AppError and specialized subclasses (NotFoundError, UnauthorizedError).",
        "Implement src/utils/asyncHandler.ts to wrap Express route controllers with automatic error forwarding."
      ]
    }
  }
];
