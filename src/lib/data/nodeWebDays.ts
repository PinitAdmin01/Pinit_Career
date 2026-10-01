import { DayConfig } from './curriculumEnricher';

/**
 * Node.js & TypeScript Backend Engineering (course-node-web, prefix: node-web):
 * 30 course days covering runtime fundamentals, HTTP protocols, middleware pipelines,
 * authentication, data access patterns, resiliency, and production API design.
 *
 * Practice tasks are in nodeWeb30DayData.ts; lessons in nodeWebLongLessons.ts.
 */
export const NODE_WEB_DAYS: DayConfig[] = [
  // ── WEEK 1: Node.js Runtime & TypeScript Foundations ──────────────────────
  {
    day: 1,
    title: 'The Node.js Runtime, Event Loop & Process Model',
    desc: 'Understand how Node.js executes JavaScript on a single thread using the libuv event loop, phases of execution, and the process object.',
    syllabus: [
      'V8 engine and libuv single-threaded event loop architecture.',
      'Phases of the event loop: timers, poll, check, and microtasks (process.nextTick, Promise).',
      'The process object: process.env, process.argv, exit codes, and process.uptime().'
    ]
  },
  {
    day: 2,
    title: 'Modular Architecture: ESM, CommonJS & Path Resolution',
    desc: 'Master module systems in Node.js, comparing modern ECMAScript Modules (import/export) with CommonJS (require/module.exports), and path normalization.',
    syllabus: [
      'CommonJS vs ESM module syntax and interoperability rules.',
      'Path resolution: path.join, path.resolve, relative paths, and file extensions.',
      'Package exports, type declarations, and package.json module configuration.'
    ]
  },
  {
    day: 3,
    title: 'Backend TypeScript: Types, Interfaces & Narrowing',
    desc: 'Apply strong typing to server-side code using interfaces, type aliases, union types, and runtime type narrowing.',
    syllabus: [
      'Type aliases and interfaces for backend data models.',
      'Discriminated unions for modeling states and operation outcomes.',
      'Type narrowing with typeof, instanceof, and user-defined type predicates.'
    ]
  },
  {
    day: 4,
    title: 'TypeScript Generics & Utility Types for Backends',
    desc: 'Write flexible, reusable backend utilities using TypeScript generics and standard utility types like Record, Partial, Pick, and Omit.',
    syllabus: [
      'Generic functions, classes, and repository interfaces.',
      'Standard utility types: Partial<T>, Required<T>, Readonly<T>, Record<K, V>.',
      'Constructing transformation types with Pick<T, K> and Omit<T, K>.'
    ]
  },
  {
    day: 5,
    title: 'Asynchronous Flow, Promises & Error Handling',
    desc: 'Handle asynchronous backend operations safely with async/await, Promise concurrency combinators, and custom typed error hierarchies.',
    syllabus: [
      'Async/await flow control and avoiding unhandled promise rejections.',
      'Promise combinators: Promise.all, Promise.allSettled, and Promise.race.',
      'Custom ApplicationError classes with operational flags and HTTP status codes.'
    ]
  },

  // ── WEEK 2: HTTP Protocols, Routing & Validation ──────────────────────────
  {
    day: 6,
    title: 'The HTTP Protocol: Methods, Status Codes & Headers',
    desc: 'Explore HTTP/1.1 fundamentals, request/response message formats, standard methods, RFC status code categories, and essential headers.',
    syllabus: [
      'HTTP verbs and semantics: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD.',
      'Status code semantics: 2xx success, 3xx redirects, 4xx client errors, 5xx server errors.',
      'Request and response headers: Content-Type, Accept, Authorization, Cache-Control.'
    ]
  },
  {
    day: 7,
    title: 'Request Handlers as Pure Functions',
    desc: 'Design HTTP request handlers as pure, decoupled functions that transform an immutable HttpRequest into an HttpResponse object for testability.',
    syllabus: [
      'Separating transport concerns from business request handling.',
      'Representing requests and responses as plain TypeScript data structures.',
      'Deterministic handler execution without global state dependencies.'
    ]
  },
  {
    day: 8,
    title: 'Routing Tables & Path Parameter Matching',
    desc: 'Build a pattern-matching router that routes requests by HTTP method and path pattern, extracting dynamic path parameters.',
    syllabus: [
      'Routing tables mapping (Method, PathPattern) tuples to handlers.',
      'Matching dynamic path segments (e.g. /api/users/:id or /jobs/:jobId/apply).',
      'Handling 404 Not Found and 405 Method Not Allowed scenarios.'
    ]
  },
  {
    day: 9,
    title: 'Query String Parsing & Parameter Coercion',
    desc: 'Parse URL search queries into structured TypeScript objects, with type coercion for numbers, booleans, and arrays.',
    syllabus: [
      'URL and URLSearchParams parsing standards.',
      'Coercing string query parameters to numbers, booleans, and string arrays.',
      'Default query parameter values and fallback strategies.'
    ]
  },
  {
    day: 10,
    title: 'Request Body Validation with Schema Validators',
    desc: 'Validate untrusted JSON request bodies against schemas with type guards, field presence checks, and formatted error lists.',
    syllabus: [
      'Declarative schema definitions for incoming payload structures.',
      'Validating required fields, data types, min/max lengths, and email formats.',
      'Generating clean, human-readable validation error summaries for clients.'
    ]
  },

  // ── WEEK 3: Middleware Pipelines, Observability & Data Patterns ───────────
  {
    day: 11,
    title: 'Middleware Chains & Onion Architecture',
    desc: 'Implement an extensible middleware pipeline where incoming requests flow through an onion chain with next() execution.',
    syllabus: [
      'Middleware function signature: (req, res, next) pattern.',
      'Executing pre-processing, delegating to next, and running post-processing.',
      'Short-circuiting middleware pipelines on validation or authentication errors.'
    ]
  },
  {
    day: 12,
    title: 'RFC 7807 Problem Details Error Formatting',
    desc: 'Standardize client error responses using the IETF RFC 7807 specification for problem details in HTTP APIs.',
    syllabus: [
      'RFC 7807 standard fields: type, title, status, detail, instance.',
      'Extending problem details with invalid-params arrays for validation failures.',
      'Global exception formatting filter ensuring zero raw stack traces leak.'
    ]
  },
  {
    day: 13,
    title: 'Structured JSON Logging & Request Tracing',
    desc: 'Implement high-performance structured JSON logging with severity levels, contextual metadata, and sensitive field redaction.',
    syllabus: [
      'Structured JSON logs: timestamp, level, message, correlationId, durationMs.',
      'Correlation IDs (X-Request-ID) across distributed service calls.',
      'Data masking: redacting passwords, API tokens, and PII from log output.'
    ]
  },
  {
    day: 14,
    title: 'Configuration Management & Fail-Fast Startup',
    desc: 'Load, validate, and freeze server configuration from environment variables with fail-fast startup assertions.',
    syllabus: [
      'Reading and validating process.env against expected backend schemas.',
      'Applying environment-specific defaults (development, staging, production).',
      'Crashing early on startup if critical secrets or connection strings are missing.'
    ]
  },
  {
    day: 15,
    title: 'Pagination, Sorting & Filtering Standards',
    desc: 'Design scalable pagination models, comparing offset/limit with cursor-based pagination, along with multi-attribute sorting and filtering.',
    syllabus: [
      'Offset-based pagination: page, limit, totalItems, totalPages calculation.',
      'Cursor-based pagination: encode/decode cursors for high-volume datasets.',
      'Sorting specifications: sort field, asc/desc direction, and safe field whitelists.'
    ]
  },

  // ── WEEK 4: Security, Authentication & Resiliency ─────────────────────────
  {
    day: 16,
    title: 'Password Security & Cryptographic Hashing',
    desc: 'Understand cryptographic password security, salt generation, slow key-derivation functions, and timing-attack defense.',
    syllabus: [
      'Why fast hashes (MD5, SHA-256) are dangerous for password storage.',
      'Salts, work factors, and key-stretching functions (bcrypt/Argon2 concepts).',
      'Timing-safe comparisons to prevent side-channel timing attacks.'
    ]
  },
  {
    day: 17,
    title: 'Stateful Sessions vs Stateless Bearer Tokens',
    desc: 'Compare session-based authentication using cookies with stateless token-based authentication using HTTP Bearer tokens.',
    syllabus: [
      'Session stores, session cookies, HttpOnly, and SameSite attributes.',
      'Bearer token authentication flow via Authorization header.',
      'Architectural trade-offs: server memory, horizontal scaling, and revocation.'
    ]
  },
  {
    day: 18,
    title: 'JSON Web Tokens (JWT): Structure & Verification',
    desc: 'Deconstruct JWT header, payload, and signature components, implementing strict expiration (exp) and validity checks.',
    syllabus: [
      'JWT three-part structure: base64url(header).base64url(payload).signature.',
      'Standard claims: iss (issuer), sub (subject), aud (audience), exp (expiration).',
      'Validating token expiration, not-before (nbf), and signature tampering.'
    ]
  },
  {
    day: 19,
    title: 'Role-Based Access Control (RBAC) & Route Guards',
    desc: 'Implement authorization layers checking user roles and explicit permission scopes before allowing route access.',
    syllabus: [
      'RBAC primitives: users, roles (admin, member, viewer), and permissions.',
      'Role hierarchy and permission set evaluation.',
      'Route authorization guards returning 401 Unauthorized vs 403 Forbidden.'
    ]
  },
  {
    day: 20,
    title: 'API Security: Rate Limiting, CORS & Input Sanitization',
    desc: 'Protect backend endpoints against brute-force attacks, cross-origin request abuse, and injection with rate limiting and CORS headers.',
    syllabus: [
      'Sliding window and token bucket rate limiting algorithms.',
      'Cross-Origin Resource Sharing (CORS): origin checks, preflight OPTIONS, allowed headers.',
      'Sanitizing string inputs to neutralize injection payloads and malicious script tags.'
    ]
  },

  // ── WEEK 5: Data Access, Caching & Reliability ────────────────────────────
  {
    day: 21,
    title: 'Data Access Layer & The In-Memory Repository Pattern',
    desc: 'Decouple business logic from database operations using the Repository Pattern with generic entity interfaces.',
    syllabus: [
      'The Repository Pattern: separation of concerns between domain and storage.',
      'Standard CRUD operations: create, findById, findAll, update, delete.',
      'Handling entity not found and duplicate key conflicts.'
    ]
  },
  {
    day: 22,
    title: 'Advanced Repository Querying & State Mutation',
    desc: 'Implement complex querying capabilities inside repositories including predicate filters, pagination slices, and immutable state updates.',
    syllabus: [
      'Filtering entities with composable criteria predicates.',
      'Applying sorting and slicing to repository datasets.',
      'Immutable record mutations and audit timestamp updates (createdAt, updatedAt).'
    ]
  },
  {
    day: 23,
    title: 'Transactions & Unit of Work Concepts',
    desc: 'Model atomic multi-step operations using Unit of Work patterns, ensuring all operations succeed together or roll back on error.',
    syllabus: [
      'ACID properties: Atomicity, Consistency, Isolation, Durability in backends.',
      'Unit of work: staging multiple database mutations in a single atomic batch.',
      'Rollback mechanics when one operation in a transaction sequence fails.'
    ]
  },
  {
    day: 24,
    title: 'In-Memory Caching & TTL Expiration Strategies',
    desc: 'Implement a high-performance in-memory cache with Time-To-Live (TTL) expiration, hit/miss metrics, and Cache-Aside patterns.',
    syllabus: [
      'Cache-Aside (lazy loading) read and write-through patterns.',
      'TTL (Time-To-Live) eviction mechanics and timestamp checking.',
      'Measuring cache hit ratio and invalidating stale keys upon mutation.'
    ]
  },
  {
    day: 25,
    title: 'Idempotency Keys & Safe Request Retries',
    desc: 'Prevent duplicate mutations (e.g. payments or duplicate job postings) using unique Idempotency-Key headers and result caching.',
    syllabus: [
      'Why network retries cause duplicate operations on non-idempotent endpoints (POST).',
      'The Idempotency-Key header standard: storing and replaying response payloads.',
      'Detecting concurrent in-flight requests with identical idempotency keys.'
    ]
  },

  // ── WEEK 6: Production Engineering, Testing & Capstone API ────────────────
  {
    day: 26,
    title: 'Automated Testing of Backend Handlers & Contracts',
    desc: 'Write automated unit and integration tests for backend request handlers, verifying status codes, headers, and error bodies.',
    syllabus: [
      'Simulating HTTP requests and inspecting response status codes and headers.',
      'Asserting JSON response payloads against expected schema contracts.',
      'Testing edge cases: malformed JSON, missing headers, and timeout behaviors.'
    ]
  },
  {
    day: 27,
    title: 'OpenAPI Specification & Self-Documenting APIs',
    desc: 'Generate and validate OpenAPI 3.0 (Swagger) specifications describing paths, parameters, request bodies, and responses.',
    syllabus: [
      'OpenAPI 3.0 document anatomy: info, servers, paths, components/schemas.',
      'Describing path parameters, query parameters, and request body schemas.',
      'Declaring HTTP response codes (200, 400, 404, 500) with content schemas.'
    ]
  },
  {
    day: 28,
    title: 'Asynchronous Task Queues & Exponential Backoff',
    desc: 'Design an in-memory job queue with background worker execution, retry counts, exponential backoff delays, and dead-letter handling.',
    syllabus: [
      'Decoupling long-running tasks from the HTTP request-response cycle.',
      'Job state machine: queued, processing, completed, failed.',
      'Calculating exponential backoff with jitter and moving poisoned jobs to dead-letter storage.'
    ]
  },
  {
    day: 29,
    title: 'Health Checks, Readiness Probes & Graceful Shutdown',
    desc: 'Implement production liveness/readiness probes and graceful shutdown handlers to terminate servers cleanly without dropping connections.',
    syllabus: [
      'Liveness (/healthz) vs Readiness (/readyz) probe semantics.',
      'Listening for OS termination signals: SIGTERM and SIGINT.',
      'Graceful drain: rejecting new connections, finishing active requests, and closing resources.'
    ]
  },
  {
    day: 30,
    title: '🏆 Capstone: Production Node.js & TypeScript API Engine',
    desc: 'Assemble an end-to-end production REST API server combining routing, middleware, authentication, schema validation, repository, and health checks.',
    syllabus: [
      'Architecting a clean, modular server application with unified pipeline dispatch.',
      'Integrating authentication, authorization, and rate limiting into protected endpoints.',
      'Deploying a fully tested, observable, and resilient backend service.'
    ]
  }
];
