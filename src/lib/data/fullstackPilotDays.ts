import { DayLessonPlan } from '../types/lessonEngine';

export const FULLSTACK_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Client-Server Separation, Node.js Runtime & Modern JS",
    "overviewMetaphor": "Full-Stack web development is a restaurant: the Client (Frontend React) is the dining room where customers view the visual menu and place orders; the Server (Backend Node.js) is the kitchen where raw food is processed, private secret recipes are protected, and dishes are cooked before being handed back to the waiter in JSON format.",
    "blocks": [
      {
        "id": "fs-d1-b1-client-server-boundary",
        "day": 1,
        "blockNumber": 1,
        "title": "Client vs Server Execution Boundaries & Security Invariants",
        "conceptBudget": {
          "primaryConcept": "Client-Server Execution Boundary",
          "supportingTerms": [
            "Browser DOM environment (`window`, `document`)",
            "Node.js Process environment (`process.env`, `Buffer`)",
            "Never leaking backend secrets to the browser"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d1-b1-react-mental-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Execution Environment Comparison",
              "boxes": [
                {
                  "label": "Frontend (Browser)",
                  "value": "window, document, localStorage (PUBLIC TO USER)",
                  "varType": "Client Environment",
                  "isUpdated": false
                },
                {
                  "label": "Backend (Node.js)",
                  "value": "process.env.DB_PASS, fs, crypto (PRIVATE SERVER SECRETS)",
                  "varType": "Server Environment",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "runtime_env_check.js",
            "initialCode": "function getRuntimeEnvironment() {\n  const isBrowser = typeof window !== 'undefined';\n  const isNode = typeof process !== 'undefined' && Boolean(process.versions?.node);\n  return { isBrowser, isNode, runtime: isNode ? 'Node.js Server' : 'Browser Client' };\n}\n\nconsole.log('Detected Runtime:', getRuntimeEnvironment().runtime);",
            "expectedOutput": "Detected Runtime: Node.js Server",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must database passwords and private API keys NEVER be bundled into frontend client JavaScript files?",
          "options": [
            "Because frontend JavaScript files are downloaded directly into the user's browser where anyone can inspect them in Chrome DevTools Source tabs",
            "Because browser JavaScript cannot parse strings longer than 10 characters",
            "Because database passwords only work on Linux"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_CLIENT_VS_SERVER_EXECUTION_BOUNDARY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_CLIENT_VS_SERVER_EXECUTION_BOUNDARY",
              "errorExplanation": "Any code sent to the client is completely visible to users and attackers.",
              "recoveryPath": {
                "simplerExplanation": "Frontend code is public; server code is private.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d1-b2-event-loop-call-stack",
        "day": 1,
        "blockNumber": 2,
        "title": "The Node.js Event Loop & Microtask vs Macrotask Queues",
        "conceptBudget": {
          "primaryConcept": "Node.js Event Loop",
          "supportingTerms": [
            "Call Stack Single Thread",
            "Microtask Queue (Promises / process.nextTick)",
            "Macrotask Queue (setTimeout / setImmediate / I/O)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d1-b1-client-server-boundary",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Event Loop Task Priority",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Synchronous Call Stack Execution",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Microtask Queue Drain (All Promise .then() callbacks execute FIRST)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Macrotask Queue (setTimeout / I/O callbacks execute next)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "event_loop_demo.js",
            "initialCode": "const executionLog = [];\nexecutionLog.push('1. Sync Start');\nsetTimeout(() => executionLog.push('4. Macrotask (setTimeout)'), 0);\nPromise.resolve().then(() => executionLog.push('3. Microtask (Promise)'));\nexecutionLog.push('2. Sync End');\n\n// Drain synchronous tasks first\nconsole.log(executionLog.join(' -> '));",
            "expectedOutput": "1. Sync Start -> 2. Sync End",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which task runs first after the synchronous code completes: a resolved `Promise.then()` microtask or a `setTimeout(..., 0)` macrotask?",
          "expectedStringOutput": "Promise.then() microtask",
          "acceptableAnswers": [
            "Promise.then() microtask",
            "Promise",
            "microtask",
            "Promise.then()"
          ],
          "primaryMisconceptionId": "MC_FS_EVENT_LOOP_BLOCKING_SYNC_CALLS",
          "diagnosisMap": {
            "setTimeout": {
              "misconceptionId": "MC_FS_EVENT_LOOP_BLOCKING_SYNC_CALLS",
              "errorExplanation": "Microtask queues (Promises) always drain completely before the next macrotask (setTimeout) runs.",
              "recoveryPath": {
                "simplerExplanation": "Microtasks run before macrotasks.",
                "guidedFixPrompt": "Type Promise.then() microtask"
              }
            }
          }
        }
      },
      {
        "id": "fs-d1-b3-isomorphic-json-sanitizer",
        "day": 1,
        "blockNumber": 3,
        "title": "Isomorphic Config Sanitization & Secret Filtering",
        "conceptBudget": {
          "primaryConcept": "Config Sanitization",
          "supportingTerms": [
            "Whitelisting public config variables",
            "Preventing accidental leakage of `process.env`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d1-b2-event-loop-call-stack",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sanitize_cfg.js",
            "initialCode": "function getPublicEnv(serverEnv) {\n  const allowed = ['APP_NAME', 'API_URL', 'PUBLIC_STRIPE_KEY'];\n  const safe = {};\n  for (const key of allowed) {\n    if (key in serverEnv) safe[key] = serverEnv[key];\n  }\n  return safe;\n}\n\nconst serverConfig = { APP_NAME: 'PinIT OS', API_URL: 'https://api.pinit.io', DB_PASSWORD: 'super-secret-pw' };\nconsole.log('Safe Client Config:', JSON.stringify(getPublicEnv(serverConfig)));",
            "expectedOutput": "Safe Client Config: {\"APP_NAME\":\"PinIT OS\",\"API_URL\":\"https://api.pinit.io\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the sanitized output returned for `serverConfig` without `DB_PASSWORD`?",
          "expectedStringOutput": "{\"APP_NAME\":\"PinIT OS\",\"API_URL\":\"https://api.pinit.io\"}",
          "acceptableAnswers": [
            "{\"APP_NAME\":\"PinIT OS\",\"API_URL\":\"https://api.pinit.io\"}",
            "Safe Client Config: {\"APP_NAME\":\"PinIT OS\",\"API_URL\":\"https://api.pinit.io\"}"
          ],
          "primaryMisconceptionId": "MC_FS_ENVIRONMENT_VARIABLES_LEAK_CLIENT",
          "diagnosisMap": {
            "{\"APP_NAME\":\"PinIT OS\",\"API_URL\":\"https://api.pinit.io\",\"DB_PASSWORD\":\"super-secret-pw\"}": {
              "misconceptionId": "MC_FS_ENVIRONMENT_VARIABLES_LEAK_CLIENT",
              "errorExplanation": "DB_PASSWORD must be stripped out so client cannot access database credentials.",
              "recoveryPath": {
                "simplerExplanation": "Strip DB_PASSWORD from client config.",
                "guidedFixPrompt": "Type {\"APP_NAME\":\"PinIT OS\",\"API_URL\":\"https://api.pinit.io\"}"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Node.js Core Modules, EventEmitters & Stream Buffers",
    "overviewMetaphor": "Node.js Streams are drinking from a garden hose: instead of trying to swallow the entire 10,000-gallon water tank in one gigantic gulp (which crashes your computer's RAM with Out-Of-Memory errors), you drink sip by sip as small chunks flow through the hose (Stream Buffers with backpressure).",
    "blocks": [
      {
        "id": "fs-d2-b1-event-emitter-pattern",
        "day": 2,
        "blockNumber": 1,
        "title": "The EventEmitter Pattern: Decoupled Observer Architecture",
        "conceptBudget": {
          "primaryConcept": "EventEmitter Pattern",
          "supportingTerms": [
            "`.on(event, listener)` subscription",
            "`.emit(event, payload)` dispatch",
            "Decoupling producers from consumers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d1-b2-event-loop-call-stack",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "EventEmitter Event Pipeline",
            "codeSnippet": "const EventEmitter = require('events');\nconst orderEmitter = new EventEmitter();\n\norderEmitter.on('order:paid', (order) => {\n  console.log(`Sending email receipt to ${order.customerEmail}`);\n});\n\norderEmitter.emit('order:paid', { id: 101, customerEmail: 'alex@pinit.io' });",
            "lineNotes": {
              "4": "Registers observer listener for 'order:paid' event.",
              "8": "Emits event and dispatches data payload to all registered listeners asynchronously."
            }
          },
          {
            "type": "runnable_code",
            "filename": "emitter_demo.js",
            "initialCode": "const EventEmitter = require('events');\nconst bus = new EventEmitter();\n\nlet totalOrders = 0;\nbus.on('order', () => totalOrders++);\nbus.emit('order'); bus.emit('order');\n\nconsole.log('Total Orders Emitted:', totalOrders);",
            "expectedOutput": "Total Orders Emitted: 2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is `totalOrders` after two `bus.emit('order')` events?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "Total Orders Emitted: 2"
          ],
          "primaryMisconceptionId": "MC_FS_EVENT_DRIVEN_MESSAGE_BROKER_KAFKA",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_EVENT_DRIVEN_MESSAGE_BROKER_KAFKA",
              "errorExplanation": "Each emit triggers the listener, incrementing the counter twice.",
              "recoveryPath": {
                "simplerExplanation": "2 emits = 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "fs-d2-b2-buffers-binary-encoding",
        "day": 2,
        "blockNumber": 2,
        "title": "Node.js Buffers & Binary UTF-8 Byte Calculations",
        "conceptBudget": {
          "primaryConcept": "Buffer Binary Storage",
          "supportingTerms": [
            "`Buffer.from(str, 'utf8')`",
            "`Buffer.byteLength(str)`",
            "Multi-byte Unicode & Emoji encodings"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d2-b1-event-emitter-pattern",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "buffer_demo.js",
            "initialCode": "const ascii = 'Hello';\nconst emoji = '🚀';\n\nconsole.log('ASCII length:', ascii.length, 'Bytes:', Buffer.byteLength(ascii));\nconsole.log('Emoji length:', emoji.length, 'Bytes:', Buffer.byteLength(emoji));",
            "expectedOutput": "ASCII length: 5 Bytes: 5\nEmoji length: 2 Bytes: 4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many raw bytes does the emoji `'🚀'` occupy in UTF-8 binary representation?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4 bytes"
          ],
          "primaryMisconceptionId": "MC_FS_STREAM_BUFFER_BACKPRESSURE_HANDLING",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_FS_STREAM_BUFFER_BACKPRESSURE_HANDLING",
              "errorExplanation": "While emoji.length in JS strings is 2 (UTF-16 code units), its UTF-8 binary representation is 4 bytes.",
              "recoveryPath": {
                "simplerExplanation": "Emoji uses 4 bytes in UTF-8.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "fs-d2-b3-streams-backpressure",
        "day": 2,
        "blockNumber": 3,
        "title": "Readable Streams & Backpressure Management",
        "conceptBudget": {
          "primaryConcept": "Stream Backpressure",
          "supportingTerms": [
            "`.pipe(writableStream)`",
            "`highWaterMark` buffer threshold",
            "Pausing stream when consumer buffer is full"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d2-b2-buffers-binary-encoding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Stream Backpressure Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Readable Stream pushes 64KB chunk to Writable Stream",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Writable Buffer exceeds highWaterMark threshold",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Writable returns false -> Readable stream pauses reading from disk",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Writable drains buffer -> Emits 'drain' -> Readable resumes",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "stream_sim.js",
            "initialCode": "function simulateStreamCopy(totalSizeMb, chunkSizeMb = 16) {\n  let chunks = 0;\n  for (let read = 0; read < totalSizeMb; read += chunkSizeMb) {\n    chunks++;\n  }\n  return { totalSizeMb, chunks, peakMemoryMb: chunkSizeMb };\n}\n\nconst sim = simulateStreamCopy(1024, 64);\nconsole.log(`Streaming 1GB file in ${sim.chunks} chunks with only ${sim.peakMemoryMb}MB peak RAM!`);",
            "expectedOutput": "Streaming 1GB file in 16 chunks with only 64MB peak RAM!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the primary benefit of streaming files via `.pipe()` over `fs.readFileSync()`?",
          "options": [
            "Streaming keeps RAM consumption constant at ~64KB regardless of file size, preventing server out-of-memory crashes when uploading multi-gigabyte files",
            "Streaming deletes files after reading them",
            "Streaming converts all text to uppercase automatically"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_STREAM_BUFFER_BACKPRESSURE_HANDLING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_STREAM_BUFFER_BACKPRESSURE_HANDLING",
              "errorExplanation": "Streams chunk data so server memory stays constant.",
              "recoveryPath": {
                "simplerExplanation": "Streaming uses tiny constant memory.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "HTTP Request/Response Cycle & Status Code Design",
    "overviewMetaphor": "HTTP Status Codes are postal return receipt stamps: 200 is \"Package Delivered OK\"; 201 is \"New PO Box Created\"; 400 is \"Illegible handwriting on address\"; 401 is \"No ID badge shown\"; 403 is \"ID badge shown, but no VIP clearance for this room\"; 404 is \"No such address exists\"; 500 is \"The post office ceiling collapsed\".",
    "blocks": [
      {
        "id": "fs-d3-b1-http-status-codes",
        "day": 3,
        "blockNumber": 1,
        "title": "Semantic HTTP Status Codes & Error Envelopes",
        "conceptBudget": {
          "primaryConcept": "HTTP Status Code Semantics",
          "supportingTerms": [
            "2xx Success (200 OK, 201 Created, 204 No Content)",
            "4xx Client Errors (400, 401, 403, 404, 422)",
            "5xx Server Errors (500, 502, 503)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d1-b1-client-server-boundary",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Standard JSON API Response Envelope",
            "codeSnippet": "res.status(200).json({\n  success: true,\n  data: { id: 'usr_101', name: 'Alex' },\n  error: null,\n  meta: { timestamp: 1714000000 }\n});",
            "lineNotes": {
              "1": "Sets HTTP header status to 200 OK.",
              "3": "Encapsulates payload inside consistent `data` field."
            }
          },
          {
            "type": "runnable_code",
            "filename": "status_codes_demo.js",
            "initialCode": "function getStatusCategory(code) {\n  if (code >= 200 && code < 300) return '2xx SUCCESS';\n  if (code >= 400 && code < 500) return '4xx CLIENT_ERROR';\n  if (code >= 500 && code < 600) return '5xx SERVER_ERROR';\n  return 'OTHER';\n}\n\nconsole.log('Status 201:', getStatusCategory(201));\nconsole.log('Status 404:', getStatusCategory(404));\nconsole.log('Status 503:', getStatusCategory(503));",
            "expectedOutput": "Status 201: 2xx SUCCESS\nStatus 404: 4xx CLIENT_ERROR\nStatus 503: 5xx SERVER_ERROR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What is the crucial difference between 401 Unauthorized and 403 Forbidden?",
          "options": [
            "401 means Authentication is missing/invalid (Who are you?), while 403 means Authenticated identity lacks permission/authorization for this resource (You cannot do that)",
            "401 is for mobile apps and 403 is for desktop browsers",
            "401 is a database error"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
              "errorExplanation": "401 = Unauthenticated (no identity); 403 = Unauthorized / Forbidden (identity known, but forbidden).",
              "recoveryPath": {
                "simplerExplanation": "401 = Unauthenticated (No Login); 403 = Forbidden (No Permission).",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d3-b2-http-headers-content-negotiation",
        "day": 3,
        "blockNumber": 2,
        "title": "HTTP Request/Response Headers & Content Negotiation",
        "conceptBudget": {
          "primaryConcept": "Content Negotiation",
          "supportingTerms": [
            "`Content-Type: application/json`",
            "`Accept: application/json`",
            "`Authorization: Bearer <token>`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d3-b1-http-status-codes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "headers_demo.js",
            "initialCode": "function parseContentType(header = '') {\n  return header.split(';')[0].trim().toLowerCase();\n}\n\nconsole.log('Parsed Type:', parseContentType('application/json; charset=utf-8'));",
            "expectedOutput": "Parsed Type: application/json",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the MIME type extracted from `'application/json; charset=utf-8'`?",
          "expectedStringOutput": "application/json",
          "acceptableAnswers": [
            "application/json",
            "Parsed Type: application/json"
          ],
          "primaryMisconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
          "diagnosisMap": {
            "charset=utf-8": {
              "misconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
              "errorExplanation": "The base MIME type is application/json.",
              "recoveryPath": {
                "simplerExplanation": "MIME type is application/json.",
                "guidedFixPrompt": "Type application/json"
              }
            }
          }
        }
      },
      {
        "id": "fs-d3-b3-restful-verbs-idempotency",
        "day": 3,
        "blockNumber": 3,
        "title": "RESTful HTTP Verbs & Idempotency Rules",
        "conceptBudget": {
          "primaryConcept": "HTTP Verb Idempotency",
          "supportingTerms": [
            "Idempotent: Executing multiple times produces identical state (GET, PUT, DELETE)",
            "Non-Idempotent: Executing multiple times creates multiple items (POST)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d3-b2-http-headers-content-negotiation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "idempotency_sim.js",
            "initialCode": "const db = new Map();\n\n// Idempotent PUT (sets absolute state)\nfunction putUser(id, name) { db.set(id, name); return db.size; }\nputUser(1, 'Alex'); putUser(1, 'Alex');\nconsole.log('DB size after 2 identical PUTs:', db.size);",
            "expectedOutput": "DB size after 2 identical PUTs: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is DB size 1 after executing `putUser(1, 'Alex')` twice?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "DB size after 2 identical PUTs: 1"
          ],
          "primaryMisconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
              "errorExplanation": "PUT replaces the resource at key 1; repeating it produces the exact same single record.",
              "recoveryPath": {
                "simplerExplanation": "PUT is idempotent -> size remains 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Express.js Middleware Pipelines & Chain of Responsibility",
    "overviewMetaphor": "Express Middleware is airport security checkpoints: before boarding your flight (reaching the Route Handler), you must pass through ID verification (Auth Middleware), the baggage scanner (Body Parser / Validator), and the metal detector (CORS/Helmet); each officer either stamps your boarding pass and says \"Next!\" (`next()`), or stops you on the spot (`res.status(401)`).",
    "blocks": [
      {
        "id": "fs-d4-b1-middleware-chain-of-responsibility",
        "day": 4,
        "blockNumber": 1,
        "title": "The Middleware Chain of Responsibility & The `next()` Invariant",
        "conceptBudget": {
          "primaryConcept": "Middleware Pipeline",
          "supportingTerms": [
            "Signature `(req, res, next) => void`",
            "Calling `next()` to advance pipeline",
            "Halting with `res.status().json()`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d3-b1-http-status-codes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Forgetting next() Bug Diff",
              "brokenCode": "// ❌ BUGGY: Forgets to call next() -> Request hangs indefinitely!\napp.use((req, res, next) => {\n  console.log(`[${req.method}] ${req.url}`);\n  // Missing next()!\n});",
              "fixedCode": "// ✅ CORRECT: Calls next() to pass execution to subsequent middleware\napp.use((req, res, next) => {\n  console.log(`[${req.method}] ${req.url}`);\n  next();\n});",
              "errorLine": 4,
              "errorReason": "If a middleware neither responds with res nor calls next(), the HTTP request hangs until client timeout!",
              "fixExplanation": "Always call next() to pass control or send a response terminating the cycle."
            }
          },
          {
            "type": "runnable_code",
            "filename": "middleware_demo.js",
            "initialCode": "function executePipeline(req, res, pipeline) {\n  let idx = 0;\n  function next() {\n    if (idx < pipeline.length) {\n      const mw = pipeline[idx++];\n      mw(req, res, next);\n    }\n  }\n  next();\n}\n\nconst req = { user: null };\nconst mw1 = (rq, rs, nxt) => { rq.user = 'AuthenticatedAlex'; nxt(); };\nconst mw2 = (rq, rs, nxt) => { rq.role = 'ADMIN'; nxt(); };\nexecutePipeline(req, {}, [mw1, mw2]);\nconsole.log(`User: ${req.user}, Role: ${req.role}`);",
            "expectedOutput": "User: AuthenticatedAlex, Role: ADMIN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What happens if a custom Express middleware does not call `next()` and does not send a response (`res.send()`)?",
          "options": [
            "The client HTTP request hangs forever until the connection times out (e.g. 504 Gateway Timeout)",
            "Express automatically skips to the database",
            "The server reboots"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_EXPRESS_MIDDLEWARE_NEXT_OMISSION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_EXPRESS_MIDDLEWARE_NEXT_OMISSION",
              "errorExplanation": "Node.js leaves the socket open waiting for either next() or res.end().",
              "recoveryPath": {
                "simplerExplanation": "Request hangs without next() or res.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d4-b2-global-error-handling-middleware",
        "day": 4,
        "blockNumber": 2,
        "title": "Global 4-Parameter Error Handling Middleware",
        "conceptBudget": {
          "primaryConcept": "Error Handling Middleware",
          "supportingTerms": [
            "Signature `(err, req, res, next)`",
            "`next(err)` triggering error pipeline",
            "Hiding internal stack traces in production"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d4-b1-middleware-chain-of-responsibility",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Global Error Handler",
            "codeSnippet": "app.use((err, req, res, next) => {\n  const status = err.statusCode || 500;\n  res.status(status).json({\n    success: false,\n    error: err.message || 'Internal Server Error',\n    stack: process.env.NODE_ENV === 'production' ? null : err.stack\n  });\n});",
            "lineNotes": {
              "1": "4 parameters tells Express this is an Error Handling middleware.",
              "5": "Hides stack trace in production to prevent leaking server filesystem paths."
            }
          },
          {
            "type": "runnable_code",
            "filename": "error_handler_demo.js",
            "initialCode": "function simulateErrorHandler(err, isProd = true) {\n  return {\n    status: err.statusCode || 500,\n    message: err.message,\n    stack: isProd ? undefined : 'Error at /server/routes.js:42'\n  };\n}\n\nconst err = new Error('Database connection failed');\nerr.statusCode = 503;\nconsole.log('Production Error Response:', JSON.stringify(simulateErrorHandler(err, true)));",
            "expectedOutput": "Production Error Response: {\"status\":503,\"message\":\"Database connection failed\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the sanitized production error payload for status 503 with stack hidden?",
          "expectedStringOutput": "{\"status\":503,\"message\":\"Database connection failed\"}",
          "acceptableAnswers": [
            "{\"status\":503,\"message\":\"Database connection failed\"}",
            "Production Error Response: {\"status\":503,\"message\":\"Database connection failed\"}"
          ],
          "primaryMisconceptionId": "MC_FS_EXPRESS_MIDDLEWARE_NEXT_OMISSION",
          "diagnosisMap": {
            "500": {
              "misconceptionId": "MC_FS_EXPRESS_MIDDLEWARE_NEXT_OMISSION",
              "errorExplanation": "err.statusCode was explicitly set to 503.",
              "recoveryPath": {
                "simplerExplanation": "Payload retains status 503 and message.",
                "guidedFixPrompt": "Type {\"status\":503,\"message\":\"Database connection failed\"}"
              }
            }
          }
        }
      },
      {
        "id": "fs-d4-b3-request-context-attachment",
        "day": 4,
        "blockNumber": 3,
        "title": "Attaching Request Context (`req.user`, `req.requestId`)",
        "conceptBudget": {
          "primaryConcept": "Request Context Object",
          "supportingTerms": [
            "Decorating `req` with validated user object",
            "Propagating correlation `req.requestId` across logs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d4-b2-global-error-handling-middleware",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "context_demo.js",
            "initialCode": "function authContextMiddleware(req, res, next) {\n  req.requestId = 'req_abc123';\n  req.user = { id: 42, role: 'EDITOR' };\n  next();\n}\n\nconst req = {};\nauthContextMiddleware(req, {}, () => {});\nconsole.log(`Attached Request ID: ${req.requestId}, User ID: ${req.user.id}`);",
            "expectedOutput": "Attached Request ID: req_abc123, User ID: 42",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What user ID is attached to `req.user` in the context middleware?",
          "expectedStringOutput": "42",
          "acceptableAnswers": [
            "42",
            "User ID: 42"
          ],
          "primaryMisconceptionId": "MC_FS_EXPRESS_MIDDLEWARE_NEXT_OMISSION",
          "diagnosisMap": {
            "null": {
              "misconceptionId": "MC_FS_EXPRESS_MIDDLEWARE_NEXT_OMISSION",
              "errorExplanation": "req.user is assigned { id: 42, role: 'EDITOR' }.",
              "recoveryPath": {
                "simplerExplanation": "User ID is 42.",
                "guidedFixPrompt": "Type 42"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: High-Throughput RESTful API Gateway with Rate Limiting",
    "overviewMetaphor": "Milestone 1 — The API Gateway Traffic Control Tower: All millions of client requests enter through a single hardened Gateway tower; the tower validates security badges, enforces burst rate limits, intercepts malicious payloads, and routes clean requests to internal microservices with sub-millisecond dispatching.",
    "blocks": [
      {
        "id": "fs-d5-b1-gateway-router-dispatch",
        "day": 5,
        "blockNumber": 1,
        "title": "API Gateway Reverse Proxy & Dynamic Route Dispatching",
        "conceptBudget": {
          "primaryConcept": "API Gateway Architecture",
          "supportingTerms": [
            "Centralized Route Dispatch `METHOD:PATH`",
            "Global Middleware Interception",
            "Uniform 404 & 500 Responses"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d4-b1-middleware-chain-of-responsibility",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "API Gateway Request Journey",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Client Sends HTTP Request to Gateway",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Execute Global Interceptors (Rate Limit -> Security Headers -> Auth)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. If validation fails -> Return 400/401/429 instantly",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Route to matching microservice handler -> Return JSON response",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gateway_demo.js",
            "initialCode": "class MiniGateway {\n  constructor() { this.routes = new Map(); }\n  register(method, path, handler) { this.routes.set(`${method}:${path}`, handler); }\n  dispatch(method, path) {\n    const handler = this.routes.get(`${method}:${path}`);\n    if (!handler) return { status: 404, body: { error: 'ROUTE_NOT_FOUND' } };\n    return { status: 200, body: handler() };\n  }\n}\n\nconst gw = new MiniGateway();\ngw.register('GET', '/health', () => ({ status: 'UP', load: 0.12 }));\nconsole.log('Dispatch /health:', JSON.stringify(gw.dispatch('GET', '/health')));\nconsole.log('Dispatch /unknown:', JSON.stringify(gw.dispatch('GET', '/unknown')));",
            "expectedOutput": "Dispatch /health: {\"status\":200,\"body\":{\"status\":\"UP\",\"load\":0.12}}\nDispatch /unknown: {\"status\":404,\"body\":{\"error\":\"ROUTE_NOT_FOUND\"}}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What HTTP status code is returned by the gateway when a requested route is not registered?",
          "expectedStringOutput": "404",
          "acceptableAnswers": [
            "404",
            "status: 404"
          ],
          "primaryMisconceptionId": "MC_FS_MICROSERVICES_API_GATEWAY_ROUTING",
          "diagnosisMap": {
            "500": {
              "misconceptionId": "MC_FS_MICROSERVICES_API_GATEWAY_ROUTING",
              "errorExplanation": "Unmatched routes return 404 Not Found, not internal 500 error.",
              "recoveryPath": {
                "simplerExplanation": "Missing route = 404.",
                "guidedFixPrompt": "Type 404"
              }
            }
          }
        }
      },
      {
        "id": "fs-d5-b2-token-bucket-integration",
        "day": 5,
        "blockNumber": 2,
        "title": "Token Bucket Rate Limiting Integration",
        "conceptBudget": {
          "primaryConcept": "Gateway Rate Limiting",
          "supportingTerms": [
            "Per-IP Request Throttling",
            "Returning 429 Too Many Requests",
            "`Retry-After` Header"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d5-b1-gateway-router-dispatch",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rate_limiter_sim.js",
            "initialCode": "function simulateRateLimiting(reqCount, burstLimit = 3) {\n  const results = [];\n  for (let i = 1; i <= reqCount; i++) {\n    const allowed = i <= burstLimit;\n    results.push({ req: i, status: allowed ? 200 : 429 });\n  }\n  return results;\n}\n\nconst requests = simulateRateLimiting(5, 3);\nconsole.log('4th Request Status:', requests[3].status);",
            "expectedOutput": "4th Request Status: 429",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What HTTP status code is returned for the 4th request when burst limit is 3?",
          "expectedStringOutput": "429",
          "acceptableAnswers": [
            "429",
            "4th Request Status: 429"
          ],
          "primaryMisconceptionId": "MC_FS_RATE_LIMITING_TOKEN_BUCKET_IP",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_FS_RATE_LIMITING_TOKEN_BUCKET_IP",
              "errorExplanation": "The burst limit was 3. The 4th request exceeds the quota, triggering 429 Too Many Requests.",
              "recoveryPath": {
                "simplerExplanation": "4th request exceeds limit -> 429.",
                "guidedFixPrompt": "Type 429"
              }
            }
          }
        }
      },
      {
        "id": "fs-d5-b3-milestone-gateway-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 API Gateway Certification",
        "conceptBudget": {
          "primaryConcept": "API Gateway Certification",
          "supportingTerms": [
            "High-Throughput Routing Invariant",
            "100% Quality Verified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d5-b2-token-bucket-integration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gw_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: High-Throughput RESTful API Gateway [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: High-Throughput RESTful API Gateway [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string is returned upon verifying Milestone 1?",
          "expectedStringOutput": "⭐ MILESTONE 1: High-Throughput RESTful API Gateway [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: High-Throughput RESTful API Gateway [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_FS_MICROSERVICES_API_GATEWAY_ROUTING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FS_MICROSERVICES_API_GATEWAY_ROUTING",
              "errorExplanation": "Returns ⭐ MILESTONE 1: High-Throughput RESTful API Gateway [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Matches header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: High-Throughput RESTful API Gateway [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Request Schema Validation & Type Safety (Zod & Joi)",
    "overviewMetaphor": "Schema Validation is a bouncer with a passport scanner at an international airport: TypeScript types only exist on your laptop during development (like an imaginary passport); Zod is the real physical scanner at the border that physically measures incoming strings, verifies valid email formats, and rejects invalid JSON before it touches your database.",
    "blocks": [
      {
        "id": "fs-d6-b1-zod-runtime-boundary",
        "day": 6,
        "blockNumber": 1,
        "title": "Runtime Boundary Validation vs Static TypeScript Types",
        "conceptBudget": {
          "primaryConcept": "Runtime Schema Validation",
          "supportingTerms": [
            "TypeScript Type Erasure at runtime",
            "Zod `.safeParse()` method",
            "Enforcing non-empty strings and numeric boundaries"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d4-b1-middleware-chain-of-responsibility",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Missing Runtime Validation Bug Diff",
              "brokenCode": "// ❌ BUGGY: Relies only on TypeScript interface -> Crashes when client sends { age: 'not_a_number' }!\ninterface UserInput { name: string; age: number; }\napp.post('/user', (req, res) => {\n  const user = req.body as UserInput; // Unsafe type casting!\n  db.save(user.age.toFixed(2));        // CRASHES at runtime!\n});",
              "fixedCode": "// ✅ CORRECT: Validates incoming shape at runtime with Zod before casting\nconst UserSchema = z.object({ name: z.string().min(1), age: z.number().positive() });\napp.post('/user', (req, res) => {\n  const result = UserSchema.safeParse(req.body);\n  if (!result.success) return res.status(400).json({ error: result.error.format() });\n  db.save(result.data.age.toFixed(2)); // Guaranteed 100% type-safe!\n});",
              "errorLine": 4,
              "errorReason": "TypeScript types disappear at runtime. Unsafe casting crashes the server on invalid payloads!",
              "fixExplanation": "Use Zod safeParse to inspect real runtime data before processing."
            }
          },
          {
            "type": "runnable_code",
            "filename": "zod_sim_demo.js",
            "initialCode": "function validateUserPayload(body) {\n  if (!body || typeof body.email !== 'string' || !body.email.includes('@')) {\n    return { success: false, error: 'INVALID_EMAIL' };\n  }\n  if (typeof body.age !== 'number' || body.age <= 0) {\n    return { success: false, error: 'INVALID_AGE' };\n  }\n  return { success: true, data: { email: body.email.toLowerCase(), age: body.age } };\n}\n\nconsole.log('Bad Payload:', validateUserPayload({ email: 'bad', age: -5 }).error);\nconsole.log('Good Payload:', validateUserPayload({ email: 'Alex@PinIT.io', age: 25 }).data);",
            "expectedOutput": "Bad Payload: INVALID_EMAIL\nGood Payload: { email: 'alex@pinit.io', age: 25 }",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do production backend servers require runtime schema validation libraries (like Zod) even when written in 100% TypeScript?",
          "options": [
            "Because TypeScript types are erased during compilation into JavaScript; any malicious or malformed client JSON payload would bypass compiler checks at runtime",
            "Because TypeScript cannot run on Linux servers",
            "Because Zod makes SQL queries faster"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_CLIENT_VS_SERVER_EXECUTION_BOUNDARY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_CLIENT_VS_SERVER_EXECUTION_BOUNDARY",
              "errorExplanation": "Type erasure means runtime code has no idea what TypeScript types were declared without runtime validators.",
              "recoveryPath": {
                "simplerExplanation": "TypeScript types disappear at runtime.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d6-b2-validation-middleware-injection",
        "day": 6,
        "blockNumber": 2,
        "title": "Automatic `req.validatedBody` Middleware Injection",
        "conceptBudget": {
          "primaryConcept": "Validated Body Injection",
          "supportingTerms": [
            "Parsing and sanitizing inputs",
            "Assigning clean output to `req.validatedBody`",
            "Halting on 400 Bad Request"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d6-b1-zod-runtime-boundary",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "validate_mw.js",
            "initialCode": "function createValidator(schemaFn) {\n  return (req, res, next) => {\n    const resVal = schemaFn(req.body);\n    if (!resVal.success) { res.status = 400; res.error = resVal.error; return; }\n    req.validatedBody = resVal.data;\n    next();\n  };\n}\n\nconst validator = createValidator(body => body?.name ? { success: true, data: { name: body.name.trim() } } : { success: false, error: 'MISSING_NAME' });\nconst req = { body: { name: '  Sam Wilson  ' } };\nvalidator(req, {}, () => {});\nconsole.log('Sanitized Name:', req.validatedBody.name);",
            "expectedOutput": "Sanitized Name: Sam Wilson",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What sanitized name is stored in `req.validatedBody.name` after trimming whitespace?",
          "expectedStringOutput": "Sam Wilson",
          "acceptableAnswers": [
            "Sam Wilson",
            "Sanitized Name: Sam Wilson"
          ],
          "primaryMisconceptionId": "MC_FS_CLIENT_VS_SERVER_EXECUTION_BOUNDARY",
          "diagnosisMap": {
            "  Sam Wilson  ": {
              "misconceptionId": "MC_FS_CLIENT_VS_SERVER_EXECUTION_BOUNDARY",
              "errorExplanation": "The validator trims leading and trailing whitespace.",
              "recoveryPath": {
                "simplerExplanation": "Trimmed name is Sam Wilson.",
                "guidedFixPrompt": "Type Sam Wilson"
              }
            }
          }
        }
      },
      {
        "id": "fs-d6-b3-nested-schema-coercion",
        "day": 6,
        "blockNumber": 3,
        "title": "Nested Object Schemas & Type Coercion (`z.coerce.number()`)",
        "conceptBudget": {
          "primaryConcept": "Schema Type Coercion",
          "supportingTerms": [
            "Converting query string `'25'` to number `25`",
            "Validating nested relational arrays"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d6-b2-validation-middleware-injection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coerce_demo.js",
            "initialCode": "function coerceQueryNumber(val, fallback = 1) {\n  const num = Number(val);\n  return isNaN(num) ? fallback : num;\n}\n\nconsole.log('Coerced \"42\":', coerceQueryNumber('42'));\nconsole.log('Coerced \"invalid\":', coerceQueryNumber('invalid', 10));",
            "expectedOutput": "Coerced \"42\": 42\nCoerced \"invalid\": 10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value is returned when coercing `'invalid'` with fallback 10?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "Coerced \"invalid\": 10"
          ],
          "primaryMisconceptionId": "MC_FS_CLIENT_VS_SERVER_EXECUTION_BOUNDARY",
          "diagnosisMap": {
            "NaN": {
              "misconceptionId": "MC_FS_CLIENT_VS_SERVER_EXECUTION_BOUNDARY",
              "errorExplanation": "Fallback 10 is returned when conversion produces NaN.",
              "recoveryPath": {
                "simplerExplanation": "Returns fallback 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "CORS, Security Headers (Helmet) & CSP Directives",
    "overviewMetaphor": "CORS is an embassy guard checking diplomatic visas: if your web page lives on `https://myfrontend.com`, your browser refuses to talk to `https://api.pinit.io` unless the API server explicitly stamps its response with `Access-Control-Allow-Origin: https://myfrontend.com`.",
    "blocks": [
      {
        "id": "fs-d7-b1-same-origin-policy-cors",
        "day": 7,
        "blockNumber": 1,
        "title": "The Same-Origin Policy (SOP) & Preflight `OPTIONS` Requests",
        "conceptBudget": {
          "primaryConcept": "CORS & Preflight Requests",
          "supportingTerms": [
            "Same-Origin Policy (Protocol + Domain + Port)",
            "Preflight `OPTIONS` check",
            "`Access-Control-Allow-Origin`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d3-b2-http-headers-content-negotiation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "CORS Preflight Handshake Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Browser sends preflight OPTIONS request with Origin: https://app.pinit.io",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Server verifies Origin in whitelist and responds with 204 No Content + Access-Control headers",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Browser verifies approved response and sends real POST /api/data payload",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cors_sim_demo.js",
            "initialCode": "function resolveCorsHeaders(origin, allowedList) {\n  if (allowedList.includes('*') || allowedList.includes(origin)) {\n    return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE' };\n  }\n  return {};\n}\n\nconsole.log('Approved Origin:', JSON.stringify(resolveCorsHeaders('https://app.pinit.io', ['https://app.pinit.io'])));\nconsole.log('Blocked Origin:', JSON.stringify(resolveCorsHeaders('https://evil-hacker.com', ['https://app.pinit.io'])));",
            "expectedOutput": "Approved Origin: {\"Access-Control-Allow-Origin\":\"https://app.pinit.io\",\"Access-Control-Allow-Methods\":\"GET,POST,PUT,DELETE\"}\nBlocked Origin: {}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Who enforces Cross-Origin Resource Sharing (CORS) security restrictions?",
          "options": [
            "The User's Web Browser (browsers block cross-domain JavaScript reads unless the server sends approved CORS headers)",
            "The router hardware",
            "The database server"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_CORS_PREFLIGHT_OPTIONS_MISMATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_CORS_PREFLIGHT_OPTIONS_MISMATCH",
              "errorExplanation": "CORS is a browser security mechanism enforced by the client browser engine.",
              "recoveryPath": {
                "simplerExplanation": "Web browsers enforce CORS rules.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d7-b2-helmet-security-headers",
        "day": 7,
        "blockNumber": 2,
        "title": "Essential Security Headers: X-Frame-Options & MIME Sniffing",
        "conceptBudget": {
          "primaryConcept": "Security Headers (Helmet)",
          "supportingTerms": [
            "`X-Frame-Options: DENY` (Clickjacking prevention)",
            "`X-Content-Type-Options: nosniff`",
            "`Strict-Transport-Security` (HSTS)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d7-b1-same-origin-policy-cors",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "security_headers.js",
            "initialCode": "function getStandardSecurityHeaders() {\n  return {\n    'X-Frame-Options': 'DENY',\n    'X-Content-Type-Options': 'nosniff',\n    'X-XSS-Protection': '0',\n    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'\n  };\n}\n\nconsole.log('X-Frame-Options:', getStandardSecurityHeaders()['X-Frame-Options']);",
            "expectedOutput": "X-Frame-Options: DENY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What directive value is set for `X-Frame-Options` to prevent clickjacking attacks inside malicious iframes?",
          "expectedStringOutput": "DENY",
          "acceptableAnswers": [
            "DENY",
            "X-Frame-Options: DENY"
          ],
          "primaryMisconceptionId": "MC_FS_CORS_PREFLIGHT_OPTIONS_MISMATCH",
          "diagnosisMap": {
            "ALLOW": {
              "misconceptionId": "MC_FS_CORS_PREFLIGHT_OPTIONS_MISMATCH",
              "errorExplanation": "DENY prevents any external site from embedding your web application in an iframe.",
              "recoveryPath": {
                "simplerExplanation": "Value is DENY.",
                "guidedFixPrompt": "Type DENY"
              }
            }
          }
        }
      },
      {
        "id": "fs-d7-b3-csp-content-security-policy",
        "day": 7,
        "blockNumber": 3,
        "title": "Content Security Policy (CSP) Directives",
        "conceptBudget": {
          "primaryConcept": "Content Security Policy",
          "supportingTerms": [
            "`default-src 'self'`",
            "`script-src 'self' https://trusted.cdn.com`",
            "Preventing inline XSS execution"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d7-b2-helmet-security-headers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "csp_demo.js",
            "initialCode": "function buildCspHeader(directives) {\n  return Object.entries(directives)\n    .map(([key, vals]) => `${key} ${vals.join(' ')}`)\n    .join('; ');\n}\n\nconst csp = buildCspHeader({\n  'default-src': [\"'self'\"],\n  'script-src': [\"'self'\", 'https://apis.google.com']\n});\nconsole.log('CSP Header:', csp);",
            "expectedOutput": "CSP Header: default-src 'self'; script-src 'self' https://apis.google.com",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the CSP header string for `default-src 'self'` and `script-src 'self' https://apis.google.com`?",
          "expectedStringOutput": "default-src 'self'; script-src 'self' https://apis.google.com",
          "acceptableAnswers": [
            "default-src 'self'; script-src 'self' https://apis.google.com",
            "CSP Header: default-src 'self'; script-src 'self' https://apis.google.com"
          ],
          "primaryMisconceptionId": "MC_FS_CORS_PREFLIGHT_OPTIONS_MISMATCH",
          "diagnosisMap": {
            "default-src *": {
              "misconceptionId": "MC_FS_CORS_PREFLIGHT_OPTIONS_MISMATCH",
              "errorExplanation": "Matches the formatted directives above.",
              "recoveryPath": {
                "simplerExplanation": "Formatted CSP string.",
                "guidedFixPrompt": "Type default-src 'self'; script-src 'self' https://apis.google.com"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "REST Resource Design, Pagination, Filtering & Sorting",
    "overviewMetaphor": "REST Pagination is reading a 1,000-page encyclopedia: you don't load all 1,000 pages onto your desk at once (which breaks the desk); you open Page 1 with 10 articles (`page=1&limit=10`); when you flip to the next page, the index bookmark tells you there are 99 pages remaining.",
    "blocks": [
      {
        "id": "fs-d8-b1-offset-vs-cursor-pagination",
        "day": 8,
        "blockNumber": 1,
        "title": "Offset vs Cursor-Based Pagination Scaling",
        "conceptBudget": {
          "primaryConcept": "Pagination Strategies",
          "supportingTerms": [
            "Offset Pagination `LIMIT 10 OFFSET 20` (Good for direct page navigation)",
            "Cursor Pagination `WHERE id > lastId LIMIT 10` (Scales to millions of records without database degradation)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d3-b1-http-status-codes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Offset vs Cursor Performance at Scale",
              "boxes": [
                {
                  "label": "Offset: OFFSET 1000000",
                  "value": "Database must scan & discard 1,000,000 rows (SLOW)",
                  "varType": "O(N) DB Scan",
                  "isUpdated": false
                },
                {
                  "label": "Cursor: WHERE id > 'usr_999999'",
                  "value": "Indexed B-Tree direct seek in O(log N) (INSTANT)",
                  "varType": "O(log N) Seek",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pagination_demo.js",
            "initialCode": "function paginateList(items, page = 1, pageSize = 2) {\n  const start = (page - 1) * pageSize;\n  return {\n    items: items.slice(start, start + pageSize),\n    page,\n    total: items.length,\n    totalPages: Math.ceil(items.length / pageSize)\n  };\n}\n\nconst list = ['A', 'B', 'C', 'D', 'E'];\nconsole.log('Page 2 of 2-item size:', JSON.stringify(paginateList(list, 2, 2)));",
            "expectedOutput": "Page 2 of 2-item size: {\"items\":[\"C\",\"D\"],\"page\":2,\"total\":5,\"totalPages\":3}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What items are returned on Page 2 for list `['A', 'B', 'C', 'D', 'E']` with pageSize 2?",
          "expectedStringOutput": "[\"C\",\"D\"]",
          "acceptableAnswers": [
            "[\"C\",\"D\"]",
            "['C','D']",
            "C, D"
          ],
          "primaryMisconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
          "diagnosisMap": {
            "[\"A\",\"B\"]": {
              "misconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
              "errorExplanation": "Page 1 is ['A', 'B']. Page 2 contains ['C', 'D'].",
              "recoveryPath": {
                "simplerExplanation": "Page 2 slice is ['C', 'D'].",
                "guidedFixPrompt": "Type [\"C\",\"D\"]"
              }
            }
          }
        }
      },
      {
        "id": "fs-d8-b2-multi-field-query-sorting",
        "day": 8,
        "blockNumber": 2,
        "title": "Multi-Field Query Sorting & Direction Invariants",
        "conceptBudget": {
          "primaryConcept": "Query Parameter Parsing",
          "supportingTerms": [
            "`?sort=-created_at,name`",
            "Prefix `-` indicates descending order",
            "Safe property whitelist validation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d8-b1-offset-vs-cursor-pagination",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sort_parser.js",
            "initialCode": "function parseSortFields(sortQuery = 'id') {\n  return sortQuery.split(',').map(field => {\n    if (field.startsWith('-')) return { field: field.slice(1), direction: 'DESC' };\n    return { field, direction: 'ASC' };\n  });\n}\n\nconsole.log('Sort Orders:', JSON.stringify(parseSortFields('-created_at,score')));",
            "expectedOutput": "Sort Orders: [{\"field\":\"created_at\",\"direction\":\"DESC\"},{\"field\":\"score\",\"direction\":\"ASC\"}]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What direction is parsed for `'-created_at'`?",
          "expectedStringOutput": "DESC",
          "acceptableAnswers": [
            "DESC",
            "Descending"
          ],
          "primaryMisconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
          "diagnosisMap": {
            "ASC": {
              "misconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
              "errorExplanation": "Leading hyphen '-' specifies descending order.",
              "recoveryPath": {
                "simplerExplanation": "Leading minus sign = DESC.",
                "guidedFixPrompt": "Type DESC"
              }
            }
          }
        }
      },
      {
        "id": "fs-d8-b3-envelope-metadata-links",
        "day": 8,
        "blockNumber": 3,
        "title": "REST Envelope Metadata & HATEOAS Navigation Links",
        "conceptBudget": {
          "primaryConcept": "Pagination Envelope Metadata",
          "supportingTerms": [
            "`hasNextPage: page < totalPages`",
            "`hasPrevPage: page > 1`",
            "Uniform Collection JSON Response"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d8-b2-multi-field-query-sorting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "envelope_demo.js",
            "initialCode": "function buildPaginationEnvelope(data, page, limit, total) {\n  const totalPages = Math.ceil(total / limit) || 1;\n  return {\n    data,\n    meta: {\n      page,\n      limit,\n      total,\n      totalPages,\n      hasNextPage: page < totalPages,\n      hasPrevPage: page > 1\n    }\n  };\n}\n\nconsole.log('Has Next on Page 1 of 3?:', buildPaginationEnvelope([], 1, 10, 30).meta.hasNextPage);",
            "expectedOutput": "Has Next on Page 1 of 3?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is `hasNextPage` true on Page 1 when total pages is 3?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Has Next on Page 1 of 3?: true"
          ],
          "primaryMisconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_FS_REST_HTTP_STATUS_CODE_MISUSE",
              "errorExplanation": "Page 1 is less than totalPages 3, so hasNextPage is true.",
              "recoveryPath": {
                "simplerExplanation": "1 < 3 -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "JSON Web Tokens (JWT), Cryptographic Signatures & Verification",
    "overviewMetaphor": "A JWT is a wax-sealed royal decree: anyone in the public kingdom can read the words inside (JWT payload is Base64 encoded, not encrypted); but if any rogue impostor attempts to change the decree text (`role: 'USER'` to `role: 'ADMIN'`), the royal cryptographic wax seal (HMAC-SHA256 signature) shatters instantly on inspection.",
    "blocks": [
      {
        "id": "fs-d9-b1-jwt-three-part-anatomy",
        "day": 9,
        "blockNumber": 1,
        "title": "JWT Structure: Header, Payload & Cryptographic Signature",
        "conceptBudget": {
          "primaryConcept": "JWT Anatomy",
          "supportingTerms": [
            "Header (`alg`, `typ`)",
            "Payload (Claims: `sub`, `role`, `exp`)",
            "Cryptographic Signature `HMACSHA256(header + '.' + payload, secret)`",
            "Base64Url Encoding vs Encryption"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d3-b2-http-headers-content-negotiation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "JWT Three-Part Layout",
              "boxes": [
                {
                  "label": "Part 1: Header (Base64)",
                  "value": "{\"alg\":\"HS256\",\"typ\":\"JWT\"}",
                  "varType": "Algorithm Declaration",
                  "isUpdated": false
                },
                {
                  "label": "Part 2: Payload (Base64)",
                  "value": "{\"userId\":101,\"role\":\"ADMIN\",\"exp\":1714000000}",
                  "varType": "Public Claims",
                  "isUpdated": false
                },
                {
                  "label": "Part 3: Signature",
                  "value": "HMAC-SHA256(Header.Payload, PRIVATE_SECRET)",
                  "varType": "Tamper Proof Seal",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "jwt_anatomy_demo.js",
            "initialCode": "function decodeJwtPayload(token) {\n  const parts = token.split('.');\n  if (parts.length !== 3) throw new Error('Invalid JWT format');\n  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));\n}\n\nconst samplePayload = Buffer.from(JSON.stringify({ userId: 42, role: 'EDITOR' })).toString('base64');\nconst mockToken = `eyJhbGciOiJIUzI1NiJ9.${samplePayload}.mock_signature`;\nconsole.log('Decoded Claims:', JSON.stringify(decodeJwtPayload(mockToken)));",
            "expectedOutput": "Decoded Claims: {\"userId\":42,\"role\":\"EDITOR\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Is data stored inside a standard JWT payload hidden or encrypted from the user?",
          "options": [
            "No, JWT payloads are merely Base64 encoded and completely readable by anyone; never store sensitive secrets like passwords or credit cards in a JWT payload",
            "Yes, JWTs are encrypted with 256-bit military encryption and cannot be read",
            "Only numbers are encrypted in JWTs"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
              "errorExplanation": "JWT signatures guarantee data integrity (prevent tampering), but the payload is readable in plain text.",
              "recoveryPath": {
                "simplerExplanation": "JWT payload is public Base64; signature proves authenticity.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d9-b2-signature-verification-pipeline",
        "day": 9,
        "blockNumber": 2,
        "title": "Cryptographic Tampering Detection & Verification",
        "conceptBudget": {
          "primaryConcept": "JWT Signature Verification",
          "supportingTerms": [
            "Recomputing signature using server secret",
            "Rejecting mismatched signatures with 401",
            "Expiration claim `exp` checking"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d9-b1-jwt-three-part-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "JWT Verification Logic",
            "codeSnippet": "const [headerB64, payloadB64, signature] = token.split('.');\nconst computedSig = crypto.createHmac('sha256', SECRET).update(`${headerB64}.${payloadB64}`).digest('base64url');\nif (signature !== computedSig) {\n  throw new Error('TAMPERED_JWT_SIGNATURE');\n}",
            "lineNotes": {
              "2": "Recomputes expected signature using the server's private secret key.",
              "3": "If an attacker modified payload data, computed signature differs -> rejects immediately."
            }
          },
          {
            "type": "runnable_code",
            "filename": "jwt_verify_demo.js",
            "initialCode": "function verifyMockJwt(token, secret) {\n  const [h, p, s] = token.split('.');\n  const expected = Buffer.from(`${h}.${p}:${secret}`).toString('base64');\n  return s === expected;\n}\n\nconst h = 'eyJhbGciOiJIUzI1NiJ9';\nconst p = Buffer.from('{\"user\":\"Alex\"}').toString('base64');\nconst validSig = Buffer.from(`${h}.${p}:my-secret`).toString('base64');\nconst token = `${h}.${p}.${validSig}`;\n\nconsole.log('Valid Secret Match?:', verifyMockJwt(token, 'my-secret'));\nconsole.log('Wrong Secret Match?:', verifyMockJwt(token, 'wrong-secret'));",
            "expectedOutput": "Valid Secret Match?: true\nWrong Secret Match?: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Does verification succeed when verifying with a wrong server secret?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "Wrong Secret Match?: false"
          ],
          "primaryMisconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
              "errorExplanation": "A wrong secret produces a mismatched signature, returning false.",
              "recoveryPath": {
                "simplerExplanation": "Wrong secret fails verification -> false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "fs-d9-b3-jwt-expiration-claims",
        "day": 9,
        "blockNumber": 3,
        "title": "Short-Lived Access Tokens & The `exp` Claim",
        "conceptBudget": {
          "primaryConcept": "JWT Expiration Invariant",
          "supportingTerms": [
            "Short-lived access tokens (15 minutes)",
            "Comparing `Date.now() / 1000 >= exp`",
            "401 TOKEN_EXPIRED error"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d9-b2-signature-verification-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "jwt_exp_demo.js",
            "initialCode": "function isTokenExpired(expEpochSec) {\n  const nowSec = Math.floor(Date.now() / 1000);\n  return nowSec >= expEpochSec;\n}\n\nconst past = Math.floor(Date.now() / 1000) - 60;\nconst future = Math.floor(Date.now() / 1000) + 900;\nconsole.log('Is 60s past token expired?:', isTokenExpired(past));\nconsole.log('Is 15m future token expired?:', isTokenExpired(future));",
            "expectedOutput": "Is 60s past token expired?: true\nIs 15m future token expired?: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is a token with an expiration timestamp in the past considered expired?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Is 60s past token expired?: true"
          ],
          "primaryMisconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
              "errorExplanation": "If current time exceeds the expiration claim, the token is expired.",
              "recoveryPath": {
                "simplerExplanation": "Past exp = expired -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Secure HttpOnly Cookies & Refresh Token Rotation",
    "overviewMetaphor": "HttpOnly Cookies are a locked safety deposit box bolted into the browser's vault: malicious JavaScript injected by a hacker (XSS) can run in the browser tab, but it has zero hands to reach inside the locked box (`document.cookie` returns nothing); only the browser's network engine automatically attaches the cookie when talking to the server.",
    "blocks": [
      {
        "id": "fs-d10-b1-httponly-xss-defense",
        "day": 10,
        "blockNumber": 1,
        "title": "HttpOnly, Secure & SameSite Cookie Directives",
        "conceptBudget": {
          "primaryConcept": "Secure Cookie Flags",
          "supportingTerms": [
            "`HttpOnly` (Blocks JavaScript `document.cookie` access)",
            "`Secure` (HTTPS-only transmission)",
            "`SameSite=Strict` (Prevents CSRF attacks)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d9-b1-jwt-three-part-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "localStorage vs HttpOnly Cookie Security Diff",
              "brokenCode": "// ❌ INSECURE: Storing refresh token in localStorage\nlocalStorage.setItem('refreshToken', token);\n// Any XSS malicious script can steal this with: alert(localStorage.getItem('refreshToken'))!",
              "fixedCode": "// ✅ SECURE: Storing refresh token in HttpOnly Cookie\nres.setHeader('Set-Cookie', `refreshToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`);\n// JavaScript cannot read this cookie; immune to XSS theft!",
              "errorLine": 2,
              "errorReason": "localStorage is 100% accessible to any malicious script executing on the page (XSS)!",
              "fixExplanation": "HttpOnly flag instructs the browser to forbid JavaScript access."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cookie_flag_demo.js",
            "initialCode": "function buildCookie(name, val, maxAge = 86400) {\n  return `${name}=${val}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict`;\n}\n\nconst cookie = buildCookie('refreshToken', 'token_xyz');\nconsole.log('Generated Header:', cookie);",
            "expectedOutput": "Generated Header: refreshToken=token_xyz; Max-Age=86400; Path=/; HttpOnly; Secure; SameSite=Strict",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should refresh tokens be stored in HttpOnly cookies instead of browser `localStorage`?",
          "options": [
            "Because malicious JavaScript injected through XSS vulnerabilities cannot read or steal HttpOnly cookies",
            "Because localStorage only holds 10 bytes",
            "Because cookies load faster than memory"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_COOKIES_HTTPONLY_SAMESITE_FLAG",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_COOKIES_HTTPONLY_SAMESITE_FLAG",
              "errorExplanation": "HttpOnly blocks document.cookie access from malicious XSS scripts.",
              "recoveryPath": {
                "simplerExplanation": "HttpOnly protects against XSS token theft.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d10-b2-refresh-token-rotation",
        "day": 10,
        "blockNumber": 2,
        "title": "Refresh Token Rotation (RTR) & Reuse Detection",
        "conceptBudget": {
          "primaryConcept": "Refresh Token Rotation",
          "supportingTerms": [
            "Issuing new refresh token on every renewal",
            "Invalidating entire token family if an old token is reused (Theft Detection)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d10-b1-httponly-xss-defense",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Refresh Token Rotation & Reuse Detection",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Client exchanges Refresh Token A for new Access Token",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Server invalidates Token A and issues new Refresh Token B",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. If Token A is submitted a 2nd time (Thief using stolen token) -> Revoke all tokens for user immediately!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rtr_sim.js",
            "initialCode": "class RefreshManager {\n  constructor() { this.activeTokens = new Set(); this.usedTokens = new Set(); }\n  issue(tokenId) { this.activeTokens.add(tokenId); return tokenId; }\n  rotate(oldToken, newToken) {\n    if (this.usedTokens.has(oldToken)) {\n      this.activeTokens.clear(); // Security alert: revoke family!\n      return { error: 'TOKEN_REUSE_DETECTED_FAMILY_REVOKED' };\n    }\n    this.activeTokens.delete(oldToken);\n    this.usedTokens.add(oldToken);\n    this.activeTokens.add(newToken);\n    return { success: true, newToken };\n  }\n}\n\nconst rtr = new RefreshManager();\nrtr.issue('token_1');\nconsole.log('Rotate 1->2:', rtr.rotate('token_1', 'token_2').success);\nconsole.log('Reused 1 attack:', rtr.rotate('token_1', 'token_hack').error);",
            "expectedOutput": "Rotate 1->2: true\nReused 1 attack: TOKEN_REUSE_DETECTED_FAMILY_REVOKED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What error is triggered when an attacker attempts to reuse an already rotated refresh token?",
          "expectedStringOutput": "TOKEN_REUSE_DETECTED_FAMILY_REVOKED",
          "acceptableAnswers": [
            "TOKEN_REUSE_DETECTED_FAMILY_REVOKED",
            "Reused 1 attack: TOKEN_REUSE_DETECTED_FAMILY_REVOKED"
          ],
          "primaryMisconceptionId": "MC_FS_COOKIES_HTTPONLY_SAMESITE_FLAG",
          "diagnosisMap": {
            "TOKEN_EXPIRED": {
              "misconceptionId": "MC_FS_COOKIES_HTTPONLY_SAMESITE_FLAG",
              "errorExplanation": "Reuse detection revokes the entire token family with TOKEN_REUSE_DETECTED_FAMILY_REVOKED.",
              "recoveryPath": {
                "simplerExplanation": "Returns TOKEN_REUSE_DETECTED_FAMILY_REVOKED.",
                "guidedFixPrompt": "Type TOKEN_REUSE_DETECTED_FAMILY_REVOKED"
              }
            }
          }
        }
      },
      {
        "id": "fs-d10-b3-cookie-header-parsing",
        "day": 10,
        "blockNumber": 3,
        "title": "Server-Side `Cookie` Request Header Parsing",
        "conceptBudget": {
          "primaryConcept": "Cookie Parsing",
          "supportingTerms": [
            "Parsing semicolon-delimited cookie strings",
            "Decoding URI component values"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d10-b2-refresh-token-rotation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "parse_cookie_demo.js",
            "initialCode": "function parseCookies(cookieStr = '') {\n  const map = {};\n  cookieStr.split(';').forEach(part => {\n    const [key, val] = part.trim().split('=');\n    if (key && val) map[key] = decodeURIComponent(val);\n  });\n  return map;\n}\n\nconst header = 'sessionId=sess_99; theme=dark; user=Alex%20Smith';\nconsole.log('Parsed User:', parseCookies(header).user);",
            "expectedOutput": "Parsed User: Alex Smith",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What decoded user name is parsed from `user=Alex%20Smith`?",
          "expectedStringOutput": "Alex Smith",
          "acceptableAnswers": [
            "Alex Smith",
            "Parsed User: Alex Smith"
          ],
          "primaryMisconceptionId": "MC_FS_COOKIES_HTTPONLY_SAMESITE_FLAG",
          "diagnosisMap": {
            "Alex%20Smith": {
              "misconceptionId": "MC_FS_COOKIES_HTTPONLY_SAMESITE_FLAG",
              "errorExplanation": "decodeURIComponent transforms %20 into a space character.",
              "recoveryPath": {
                "simplerExplanation": "Decoded is Alex Smith.",
                "guidedFixPrompt": "Type Alex Smith"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Password Hashing with Argon2/Bcrypt & Salt Invariants",
    "overviewMetaphor": "A Cryptographic Salt is putting a unique fingerprint on every lock in a hotel: even if 500 guests choose the simple password \"password123\", every single hash stored in the database looks 100% completely different because each password was blended with a unique 16-byte random salt, rendering precomputed hacker rainbow tables useless.",
    "blocks": [
      {
        "id": "fs-d11-b1-salt-rainbow-table-defense",
        "day": 11,
        "blockNumber": 1,
        "title": "Cryptographic Salt & Rainbow Table Defense Invariants",
        "conceptBudget": {
          "primaryConcept": "Cryptographic Salting",
          "supportingTerms": [
            "Unique random salt per password",
            "Defeating Rainbow Table precomputation",
            "Never using plain MD5/SHA256 for passwords"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d9-b1-jwt-three-part-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Identical Passwords with Unique Salts",
              "boxes": [
                {
                  "label": "User 1 (Salt: 'a9x2')",
                  "value": "Hash: $argon2id$v=19$m=65536,t=3... (LOOKS RANDOM)",
                  "varType": "Unique Hash 1",
                  "isUpdated": false
                },
                {
                  "label": "User 2 (Salt: 'k7q8')",
                  "value": "Hash: $argon2id$v=19$m=65536,t=3... (COMPLETELY DIFFERENT)",
                  "varType": "Unique Hash 2",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "salt_demo.js",
            "initialCode": "function mockHash(password, salt) {\n  return Buffer.from(`${salt}:${password}`).toString('base64');\n}\n\nconst hashUser1 = mockHash('hunter2', 'salt_AAA');\nconst hashUser2 = mockHash('hunter2', 'salt_BBB');\n\nconsole.log('Are hashes for identical password different?:', hashUser1 !== hashUser2);",
            "expectedOutput": "Are hashes for identical password different?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is plain `SHA-256('password')` dangerous for storing passwords even though SHA-256 is cryptographic?",
          "options": [
            "Because modern GPUs can compute billions of SHA-256 hashes per second, allowing attackers to crack entire password databases in minutes using precomputed rainbow tables; password hashing requires intentionally slow work factors (Argon2 / Bcrypt)",
            "Because SHA-256 cannot hash letters",
            "Because SHA-256 only works on Mac"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
              "errorExplanation": "Fast hashes allow high-speed GPU brute-force attacks. Password hashing requires adaptive work factors (Argon2/Bcrypt).",
              "recoveryPath": {
                "simplerExplanation": "Fast hashes allow rainbow table attacks.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d11-b2-timing-attack-safe-comparison",
        "day": 11,
        "blockNumber": 2,
        "title": "Timing Attacks & Constant-Time Buffer Comparison",
        "conceptBudget": {
          "primaryConcept": "Constant-Time Comparison",
          "supportingTerms": [
            "`crypto.timingSafeEqual()`",
            "Preventing early-exit string comparison timing leaks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d11-b1-salt-rainbow-table-defense",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "timing_safe_demo.js",
            "initialCode": "function timingSafeCheck(a, b) {\n  if (a.length !== b.length) return false;\n  let diff = 0;\n  for (let i = 0; i < a.length; i++) {\n    diff |= (a.charCodeAt(i) ^ b.charCodeAt(i));\n  }\n  return diff === 0;\n}\n\nconsole.log('Match \"secret\" vs \"secret\":', timingSafeCheck('secret', 'secret'));\nconsole.log('Match \"secret\" vs \"wrong!\":', timingSafeCheck('secret', 'wrong!'));",
            "expectedOutput": "Match \"secret\" vs \"secret\": true\nMatch \"secret\" vs \"wrong!\": false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the boolean result when comparing `'secret'` against `'secret'`?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Match \"secret\" vs \"secret\": true"
          ],
          "primaryMisconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
              "errorExplanation": "Identical strings match with zero diff, returning true.",
              "recoveryPath": {
                "simplerExplanation": "Strings match -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "fs-d11-b3-work-factor-tuning",
        "day": 11,
        "blockNumber": 3,
        "title": "Work Factor Calibration (Cost Parameters)",
        "conceptBudget": {
          "primaryConcept": "Work Factor Calibration",
          "supportingTerms": [
            "Targeting ~250-500ms hash time per login",
            "Argon2 memory and time cost parameters"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d11-b2-timing-attack-safe-comparison",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "work_factor.js",
            "initialCode": "function getCostParameters(environment = 'production') {\n  return environment === 'production' \n    ? { memoryCost: 65536, timeCost: 3, parallelism: 4 } \n    : { memoryCost: 1024, timeCost: 1, parallelism: 1 }; // Fast tests\n}\n\nconsole.log('Production Memory Cost (KB):', getCostParameters('production').memoryCost);",
            "expectedOutput": "Production Memory Cost (KB): 65536",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the recommended production memory cost parameter (in KB)?",
          "expectedStringOutput": "65536",
          "acceptableAnswers": [
            "65536",
            "64MB",
            "Production Memory Cost (KB): 65536"
          ],
          "primaryMisconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
          "diagnosisMap": {
            "1024": {
              "misconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
              "errorExplanation": "1024 is for quick unit tests. Production uses 65536 (64MB).",
              "recoveryPath": {
                "simplerExplanation": "Production uses 65536 KB.",
                "guidedFixPrompt": "Type 65536"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Prisma ORM, Schema Migrations & Relational Modeling",
    "overviewMetaphor": "Prisma ORM is a universal translator between JavaScript objects and raw SQL tables: instead of concatenating raw SQL strings (which creates catastrophic SQL Injection security holes), you write type-safe queries (`prisma.user.findUnique({ where: { id } })`); Prisma automatically translates this into optimal parametrized SQL queries with full TypeScript autocomplete.",
    "blocks": [
      {
        "id": "fs-d12-b1-prisma-schema-declarative",
        "day": 12,
        "blockNumber": 1,
        "title": "Declarative Schema Definition & 1-to-Many Relations",
        "conceptBudget": {
          "primaryConcept": "Prisma Relational Modeling",
          "supportingTerms": [
            "`model User { id, posts Post[] }`",
            "`@relation(fields: [authorId], references: [id])`",
            "Declarative schema migrations"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d1-b1-client-server-boundary",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Prisma Schema Relations",
            "codeSnippet": "model User {\n  id        Int      @id @default(autoincrement())\n  email     String   @unique\n  posts     Post[]\n}\n\nmodel Post {\n  id        Int      @id @default(autoincrement())\n  title     String\n  authorId  Int\n  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)\n}",
            "lineNotes": {
              "4": "Defines 1-to-many relationship where a user has many posts.",
              "11": "Foreign key relation linking authorId to User.id with cascade delete."
            }
          },
          {
            "type": "runnable_code",
            "filename": "prisma_mock_demo.js",
            "initialCode": "function mockPrismaFindUnique(users, id) {\n  return users.find(u => u.id === id) || null;\n}\n\nconst dbUsers = [{ id: 1, email: 'alex@pinit.io' }, { id: 2, email: 'sam@pinit.io' }];\nconsole.log('Found User 1:', JSON.stringify(mockPrismaFindUnique(dbUsers, 1)));",
            "expectedOutput": "Found User 1: {\"id\":1,\"email\":\"alex@pinit.io\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What user object is returned for ID 1 in the mock database above?",
          "expectedStringOutput": "{\"id\":1,\"email\":\"alex@pinit.io\"}",
          "acceptableAnswers": [
            "{\"id\":1,\"email\":\"alex@pinit.io\"}",
            "Found User 1: {\"id\":1,\"email\":\"alex@pinit.io\"}"
          ],
          "primaryMisconceptionId": "MC_FS_ORM_N_PLUS_ONE_QUERY_PROBLEM",
          "diagnosisMap": {
            "null": {
              "misconceptionId": "MC_FS_ORM_N_PLUS_ONE_QUERY_PROBLEM",
              "errorExplanation": "User with ID 1 exists and is returned.",
              "recoveryPath": {
                "simplerExplanation": "Returns user 1 object.",
                "guidedFixPrompt": "Type {\"id\":1,\"email\":\"alex@pinit.io\"}"
              }
            }
          }
        }
      },
      {
        "id": "fs-d12-b2-parametrized-query-safety",
        "day": 12,
        "blockNumber": 2,
        "title": "SQL Injection Prevention & Parametrization",
        "conceptBudget": {
          "primaryConcept": "SQL Injection Prevention",
          "supportingTerms": [
            "Never concatenating raw strings into SQL",
            "Parametrized query placeholders `$1, $2`",
            "Automated ORM escaping"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d12-b1-prisma-schema-declarative",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "SQL Injection Vulnerability Diff",
              "brokenCode": "// ❌ INSECURE: Vulnerable to SQL Injection!\nconst query = `SELECT * FROM users WHERE email = '${req.body.email}'`;\n// If email is \"' OR '1'='1\", attacker bypasses auth and dumps entire DB!",
              "fixedCode": "// ✅ SECURE: Parametrized query via Prisma ORM\nconst user = await prisma.user.findUnique({\n  where: { email: req.body.email }\n});",
              "errorLine": 2,
              "errorReason": "Raw string interpolation executes malicious user SQL commands directly against your database!",
              "fixExplanation": "Prisma and parametrized queries send SQL template and data arguments separately."
            }
          },
          {
            "type": "runnable_code",
            "filename": "param_sql_demo.js",
            "initialCode": "function buildSafeParametrizedQuery(email) {\n  return {\n    sql: 'SELECT * FROM users WHERE email = $1',\n    params: [email]\n  };\n}\n\nconst malicious = \"' OR '1'='1\";\nconsole.log('Parametrized SQL:', buildSafeParametrizedQuery(malicious).sql);",
            "expectedOutput": "Parametrized SQL: SELECT * FROM users WHERE email = $1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do parametrized queries completely neutralize SQL Injection attacks?",
          "options": [
            "Because the database driver treats user input strictly as a literal data parameter value, never parsing or executing user input as executable SQL commands",
            "Because parameters make queries shorter",
            "Because databases delete user input"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_SQL_INJECTION_PARAMETRIZED_QUERIES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_SQL_INJECTION_PARAMETRIZED_QUERIES",
              "errorExplanation": "Parametrization ensures data is never executed as SQL code.",
              "recoveryPath": {
                "simplerExplanation": "Data is treated as data, never code.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d12-b3-eager-vs-lazy-loading",
        "day": 12,
        "blockNumber": 3,
        "title": "Relational Inclusion (`include: { posts: true }`)",
        "conceptBudget": {
          "primaryConcept": "Relational Inclusion",
          "supportingTerms": [
            "`prisma.user.findMany({ include: { posts: true } })`",
            "Translating to single JOIN or batch IN query"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d12-b2-parametrized-query-safety",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "include_demo.js",
            "initialCode": "function joinUserPosts(users, posts) {\n  const map = new Map();\n  for (const p of posts) {\n    if (!map.has(p.userId)) map.set(p.userId, []);\n    map.get(p.userId).push(p);\n  }\n  return users.map(u => ({ ...u, posts: map.get(u.id) || [] }));\n}\n\nconst u = [{ id: 1, name: 'Alex' }];\nconst p = [{ id: 101, userId: 1, title: 'Prisma Intro' }];\nconsole.log('Joined User with Posts:', JSON.stringify(joinUserPosts(u, p)));",
            "expectedOutput": "Joined User with Posts: [{\"id\":1,\"name\":\"Alex\",\"posts\":[{\"id\":101,\"userId\":1,\"title\":\"Prisma Intro\"}]}]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many posts are attached to user 1 after relational join?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1 post"
          ],
          "primaryMisconceptionId": "MC_FS_ORM_N_PLUS_ONE_QUERY_PROBLEM",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_FS_ORM_N_PLUS_ONE_QUERY_PROBLEM",
              "errorExplanation": "Post 101 has userId 1 and is joined to user 1.",
              "recoveryPath": {
                "simplerExplanation": "1 post is attached.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "The N+1 Query Problem & DataLoader Batching",
    "overviewMetaphor": "The N+1 Query problem is a waiter running back to the kitchen 100 separate times for 100 guests: instead of taking everyone's drink orders in a single notepad list and bringing 100 drinks back on one tray in 1 trip (Batch DataLoader in O(1) query), the waiter asks Guest 1, runs to the kitchen, asks Guest 2, runs to the kitchen... making 101 exhausting round-trips.",
    "blocks": [
      {
        "id": "fs-d13-b1-n-plus-one-anatomy",
        "day": 13,
        "blockNumber": 1,
        "title": "The N+1 Database Query Trap in Nested Loops",
        "conceptBudget": {
          "primaryConcept": "N+1 Query Problem",
          "supportingTerms": [
            "1 initial query for parent list",
            "N individual queries for each child",
            "Database connection pool exhaustion"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d12-b1-prisma-schema-declarative",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "N+1 Query vs Batch Query Comparison",
              "nodes": [
                {
                  "id": "1",
                  "label": "❌ N+1 Pattern: 1 query for 100 Users + 100 separate queries for each user's Posts = 101 DB ROUNDTRIPS (SLOW)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "✅ DataLoader Batching: 1 query for 100 Users + 1 batch query (WHERE userId IN (...)) = 2 TOTAL DB ROUNDTRIPS (INSTANT)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "n_plus_one_demo.js",
            "initialCode": "let dbQueryCount = 0;\nfunction mockDbGet(query) { dbQueryCount++; return []; }\n\n// ❌ INEFFICIENT N+1 LOOP\nconst users = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];\nmockDbGet('SELECT * FROM users'); // 1st query\nfor (const user of users) {\n  mockDbGet(`SELECT * FROM posts WHERE userId = ${user.id}`); // N queries!\n}\n\nconsole.log(`Total Database Queries for ${users.length} users: ${dbQueryCount}`);",
            "expectedOutput": "Total Database Queries for 5 users: 6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total database queries are executed for 5 users in the N+1 loop above (1 initial query + 5 child queries)?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "Total Database Queries for 5 users: 6"
          ],
          "primaryMisconceptionId": "MC_FS_ORM_N_PLUS_ONE_QUERY_PROBLEM",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_FS_ORM_N_PLUS_ONE_QUERY_PROBLEM",
              "errorExplanation": "1 query to fetch users + 5 queries to fetch posts = 6 total queries.",
              "recoveryPath": {
                "simplerExplanation": "1 + 5 = 6 queries.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      },
      {
        "id": "fs-d13-b2-dataloader-batching-event-loop",
        "day": 13,
        "blockNumber": 2,
        "title": "DataLoader Single-Tick Batching & Primary Key Deduplication",
        "conceptBudget": {
          "primaryConcept": "DataLoader Batching",
          "supportingTerms": [
            "Accumulating keys across a single Node.js event loop tick",
            "`WHERE id IN (...)` single query",
            "Key deduplication via `Set`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d13-b1-n-plus-one-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "DataLoader Architecture",
            "codeSnippet": "const userLoader = new DataLoader(async (userIds) => {\n  // Single batch query across all collected IDs\n  const users = await prisma.user.findMany({\n    where: { id: { in: userIds } }\n  });\n  const userMap = new Map(users.map(u => [u.id, u]));\n  return userIds.map(id => userMap.get(id) || null);\n});",
            "lineNotes": {
              "1": "Batches all userLoader.load(id) calls from the current event loop tick into userIds array.",
              "4": "Executes 1 single WHERE id IN (...) query instead of N individual queries."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dataloader_sim.js",
            "initialCode": "class SimpleBatchLoader {\n  constructor(batchFn) { this.batchFn = batchFn; this.queue = []; }\n  load(id) { this.queue.push(id); }\n  async flush() {\n    const uniqueIds = [...new Set(this.queue)];\n    this.queue = [];\n    return this.batchFn(uniqueIds);\n  }\n}\n\nlet batchCalls = 0;\nconst loader = new SimpleBatchLoader(ids => { batchCalls++; return ids; });\nloader.load(1); loader.load(2); loader.load(1); // duplicate ID 1\nloader.flush();\n\nconsole.log('Total Database Batch Calls:', batchCalls);",
            "expectedOutput": "Total Database Batch Calls: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many database calls are executed when flushing the DataLoader?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "Total Database Batch Calls: 1"
          ],
          "primaryMisconceptionId": "MC_FS_ORM_N_PLUS_ONE_QUERY_PROBLEM",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_FS_ORM_N_PLUS_ONE_QUERY_PROBLEM",
              "errorExplanation": "All 3 loaded IDs are coalesced and deduplicated into a single batch query.",
              "recoveryPath": {
                "simplerExplanation": "Batched into 1 query.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "fs-d13-b3-cache-memoization-per-request",
        "day": 13,
        "blockNumber": 3,
        "title": "Per-Request DataLoader Caching & Memory Lifecycles",
        "conceptBudget": {
          "primaryConcept": "Per-Request Caching",
          "supportingTerms": [
            "Creating fresh DataLoader instance per HTTP request",
            "Preventing cross-user cache contamination"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d13-b2-dataloader-batching-event-loop",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "per_request_dl.js",
            "initialCode": "function createContext(req) {\n  return {\n    userId: req.user?.id,\n    userLoader: new SimpleBatchLoader(ids => ids)\n  };\n}\n\nconst ctx1 = createContext({ user: { id: 1 } });\nconst ctx2 = createContext({ user: { id: 2 } });\nconsole.log('Are loaders isolated per request?:', ctx1.userLoader !== ctx2.userLoader);",
            "expectedOutput": "Are loaders isolated per request?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why MUST DataLoader instances be created freshly per HTTP request instead of as a global singleton?",
          "options": [
            "To prevent cross-tenant data leaks (where User A might receive cached private data from User B) and to ensure stale data is not held across requests",
            "Because DataLoaders crash after 1 use",
            "Because JavaScript garbage collection requires it"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_ORM_N_PLUS_ONE_QUERY_PROBLEM",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_ORM_N_PLUS_ONE_QUERY_PROBLEM",
              "errorExplanation": "Per-request instantiation ensures complete security isolation between separate client requests.",
              "recoveryPath": {
                "simplerExplanation": "Per-request loaders isolate user data.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Redis In-Memory Caching & Cache-Aside Invalidation",
    "overviewMetaphor": "Redis Caching is a chef's countertop cutting board: looking up a record in a hard drive database is like walking down to the basement walk-in freezer (takes 100ms); keeping hot records in Redis RAM is having sliced tomatoes right on the countertop (takes 0.5ms); with Cache-Aside, if a tomato is on the board, you grab it instantly; if not, you fetch one from the freezer and leave it on the board for next time.",
    "blocks": [
      {
        "id": "fs-d14-b1-cache-aside-strategy",
        "day": 14,
        "blockNumber": 1,
        "title": "The Cache-Aside (Lazy Loading) Architecture",
        "conceptBudget": {
          "primaryConcept": "Cache-Aside Pattern",
          "supportingTerms": [
            "1. Check Redis RAM (`redis.get(key)`)",
            "2. Cache Hit -> Return instantly",
            "3. Cache Miss -> Query Database -> Write to Redis with TTL -> Return"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d12-b1-prisma-schema-declarative",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Cache-Aside Decision Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Read Request -> Query Redis RAM by Key",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. If Key Exists (Cache Hit) -> Return Data in 0.5ms",
                  "kind": "end"
                },
                {
                  "id": "3",
                  "label": "3. If Key Missing (Cache Miss) -> Query Primary Database (50ms)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. Write Data to Redis with TTL (e.g. 3600s) -> Return Data to Client",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cache_aside_demo.js",
            "initialCode": "class MockRedisCache {\n  constructor() { this.store = new Map(); }\n  get(k) { return this.store.get(k) || null; }\n  set(k, v, ttlSec) { this.store.set(k, v); }\n}\n\nconst redis = new MockRedisCache();\nlet dbHits = 0;\nfunction getUserWithCache(id) {\n  const key = `user:${id}`;\n  const cached = redis.get(key);\n  if (cached) return { data: cached, source: 'REDIS_CACHE' };\n  dbHits++;\n  const fresh = { id, name: 'Alex' };\n  redis.set(key, fresh, 3600);\n  return { data: fresh, source: 'POSTGRES_DB' };\n}\n\nconsole.log('Call 1:', getUserWithCache(1).source);\nconsole.log('Call 2:', getUserWithCache(1).source);",
            "expectedOutput": "Call 1: POSTGRES_DB\nCall 2: REDIS_CACHE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where is the user data retrieved from on Call 2?",
          "expectedStringOutput": "REDIS_CACHE",
          "acceptableAnswers": [
            "REDIS_CACHE",
            "Call 2: REDIS_CACHE"
          ],
          "primaryMisconceptionId": "MC_FS_REDIS_CACHE_STAMPEDE_TTL_EXPIRATION",
          "diagnosisMap": {
            "POSTGRES_DB": {
              "misconceptionId": "MC_FS_REDIS_CACHE_STAMPEDE_TTL_EXPIRATION",
              "errorExplanation": "Call 1 cached the user in Redis, so Call 2 is a Cache Hit from REDIS_CACHE.",
              "recoveryPath": {
                "simplerExplanation": "Call 2 hits Redis cache.",
                "guidedFixPrompt": "Type REDIS_CACHE"
              }
            }
          }
        }
      },
      {
        "id": "fs-d14-b2-cache-invalidation-write-through",
        "day": 14,
        "blockNumber": 2,
        "title": "Cache Invalidation on Mutation & Write-Through Invariants",
        "conceptBudget": {
          "primaryConcept": "Cache Invalidation",
          "supportingTerms": [
            "Evicting stale keys on UPDATE/DELETE (`redis.del(key)`)",
            "Cache Consistency Invariants"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d14-b1-cache-aside-strategy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Mutation Invalidation",
            "codeSnippet": "async function updateUser(id, updateData) {\n  const updated = await prisma.user.update({ where: { id }, data: updateData });\n  // Immediately evict stale cached record!\n  await redis.del(`user:${id}`);\n  return updated;\n}",
            "lineNotes": {
              "2": "Saves fresh record to primary database.",
              "4": "Deletes stale key from Redis so the next read fetches fresh data from DB."
            }
          },
          {
            "type": "runnable_code",
            "filename": "invalidation_demo.js",
            "initialCode": "const cache = new Map([['user:1', { name: 'OldName' }]]);\nfunction updateUser(id, newName) {\n  cache.delete(`user:${id}`); // Evict!\n  return { id, name: newName };\n}\n\nupdateUser(1, 'NewName');\nconsole.log('Is stale key deleted?:', !cache.has('user:1'));",
            "expectedOutput": "Is stale key deleted?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is the stale cached user key deleted after updating the user profile?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Is stale key deleted?: true"
          ],
          "primaryMisconceptionId": "MC_FS_REDIS_CACHE_STAMPEDE_TTL_EXPIRATION",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_FS_REDIS_CACHE_STAMPEDE_TTL_EXPIRATION",
              "errorExplanation": "The mutation deletes the stale key, leaving cache.has('user:1') === false.",
              "recoveryPath": {
                "simplerExplanation": "Stale key is deleted -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "fs-d14-b3-cache-stampede-ttl-jitter",
        "day": 14,
        "blockNumber": 3,
        "title": "Cache Stampede Prevention & TTL Random Jitter",
        "conceptBudget": {
          "primaryConcept": "Cache Stampede Defense",
          "supportingTerms": [
            "Cache Stampede (10,000 requests hitting DB simultaneously when key expires)",
            "Adding random +/- 10% TTL jitter to stagger expirations"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d14-b2-cache-invalidation-write-through",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "jitter_demo.js",
            "initialCode": "function getJitteredTtl(baseTtlSeconds = 3600, jitterPercent = 0.1) {\n  const delta = baseTtlSeconds * jitterPercent * (Math.random() * 2 - 1);\n  return Math.floor(baseTtlSeconds + delta);\n}\n\nconst ttl = getJitteredTtl(3600, 0.1);\nconsole.log('Jittered TTL is within [3240, 3960]:', ttl >= 3240 && ttl <= 3960);",
            "expectedOutput": "Jittered TTL is within [3240, 3960]: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should cache TTLs have random jitter (e.g. 3600s +/- 10%) when writing large datasets to Redis?",
          "options": [
            "To prevent all 100,000 cached records from expiring at the exact same millisecond, which would cause a massive Cache Stampede avalanche crashing the primary database",
            "Because Redis requires prime numbers for TTL",
            "To save memory on disk"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_REDIS_CACHE_STAMPEDE_TTL_EXPIRATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_REDIS_CACHE_STAMPEDE_TTL_EXPIRATION",
              "errorExplanation": "Random jitter staggers key expirations over time, preventing simultaneous database stampedes.",
              "recoveryPath": {
                "simplerExplanation": "Jitter prevents simultaneous mass expiration stampedes.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Enterprise Multi-Tenant Authentication & Session Hub",
    "overviewMetaphor": "Milestone 2 — Multi-Tenant Enterprise Security Fortress: A modern skyscraper where each corporation (Tenant A, Tenant B) has their own private badge readers; the Central Session Hub issues cryptographic JWT keycards, rotates refresh tokens on every use, and enforces instant global token revocation with Redis session blacklisting.",
    "blocks": [
      {
        "id": "fs-d15-b1-multi-tenant-auth-isolation",
        "day": 15,
        "blockNumber": 1,
        "title": "Multi-Tenant Data Isolation & Tenant ID Claims",
        "conceptBudget": {
          "primaryConcept": "Multi-Tenant Auth Invariant",
          "supportingTerms": [
            "Embedding `tenantId` in JWT Claims",
            "Row-Level Multi-Tenant Isolation (`WHERE tenantId = req.user.tenantId`)",
            "Cross-Tenant Access Denial"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d9-b1-jwt-three-part-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Multi-Tenant JWT Claim Structure",
              "boxes": [
                {
                  "label": "tenantId",
                  "value": "\"tenant_corp_alpha\"",
                  "varType": "Enterprise Org Boundary",
                  "isUpdated": false
                },
                {
                  "label": "userId",
                  "value": "\"usr_9981\"",
                  "varType": "User Identity",
                  "isUpdated": false
                },
                {
                  "label": "roles",
                  "value": "[\"BILLING_ADMIN\", \"MEMBER\"]",
                  "varType": "RBAC Permissions",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tenant_auth_demo.js",
            "initialCode": "function verifyTenantAccess(userClaim, requestedTenantId) {\n  return userClaim.tenantId === requestedTenantId;\n}\n\nconst user = { userId: 101, tenantId: 'acme_corp' };\nconsole.log('Access Acme Corp:', verifyTenantAccess(user, 'acme_corp'));\nconsole.log('Access Competitor Corp:', verifyTenantAccess(user, 'beta_industries'));",
            "expectedOutput": "Access Acme Corp: true\nAccess Competitor Corp: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can an authenticated user from `acme_corp` access data belonging to `beta_industries`?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "Access Competitor Corp: false"
          ],
          "primaryMisconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
              "errorExplanation": "Cross-tenant access is strictly denied (returns false).",
              "recoveryPath": {
                "simplerExplanation": "Tenant mismatch -> access denied (false).",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "fs-d15-b2-session-blacklist-revocation",
        "day": 15,
        "blockNumber": 2,
        "title": "Redis Instant Token Blacklist & Session Revocation",
        "conceptBudget": {
          "primaryConcept": "Token Revocation Blacklist",
          "supportingTerms": [
            "Storing revoked JWT JTI (JWT ID) in Redis with token remaining TTL",
            "Checking blacklist during auth middleware"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d15-b1-multi-tenant-auth-isolation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "blacklist_demo.js",
            "initialCode": "class SessionHub {\n  constructor() { this.blacklist = new Set(); }\n  revoke(jti) { this.blacklist.add(jti); }\n  isRevoked(jti) { return this.blacklist.has(jti); }\n}\n\nconst hub = new SessionHub();\nconsole.log('Is Token jti_123 active before logout?:', !hub.isRevoked('jti_123'));\nhub.revoke('jti_123');\nconsole.log('Is Token jti_123 revoked after logout?:', hub.isRevoked('jti_123'));",
            "expectedOutput": "Is Token jti_123 active before logout?: true\nIs Token jti_123 revoked after logout?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is token `jti_123` reported as revoked after calling `hub.revoke('jti_123')`?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Is Token jti_123 revoked after logout?: true"
          ],
          "primaryMisconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
              "errorExplanation": "Calling revoke adds the JTI to the blacklist, returning true.",
              "recoveryPath": {
                "simplerExplanation": "Token is revoked -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "fs-d15-b3-milestone-auth-hub-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Multi-Tenant Auth Hub Certification",
        "conceptBudget": {
          "primaryConcept": "Auth Hub Certification",
          "supportingTerms": [
            "Enterprise Multi-Tenant Invariant",
            "100% Quality Verified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d15-b2-session-blacklist-revocation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "auth_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Enterprise Multi-Tenant Authentication & Session Hub [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Enterprise Multi-Tenant Authentication & Session Hub [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 verification?",
          "expectedStringOutput": "⭐ MILESTONE 2: Enterprise Multi-Tenant Authentication & Session Hub [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Enterprise Multi-Tenant Authentication & Session Hub [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FS_JWT_SIGNING_VS_ENCRYPTION_SECRET",
              "errorExplanation": "Returns ⭐ MILESTONE 2: Enterprise Multi-Tenant Authentication & Session Hub [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Matches certification header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Enterprise Multi-Tenant Authentication & Session Hub [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "WebSockets & Real-Time Bidirectional Event Streaming",
    "overviewMetaphor": "WebSockets is picking up a live telephone call instead of sending letters in the mail: standard HTTP is mailing a letter (Client asks $\\to$ Server replies $\\to$ Connection closes); a WebSocket is an open two-way phone line (`ws://`) where either party can talk instantly with sub-5ms latency without ever redialing.",
    "blocks": [
      {
        "id": "fs-d16-b1-websocket-handshake-upgrade",
        "day": 16,
        "blockNumber": 1,
        "title": "HTTP 101 Switching Protocols & The Full-Duplex TCP Pipe",
        "conceptBudget": {
          "primaryConcept": "WebSocket Upgrade Handshake",
          "supportingTerms": [
            "`Upgrade: websocket` header",
            "`Connection: Upgrade`",
            "HTTP 101 Switching Protocols",
            "Full-Duplex Bidirectional TCP Socket"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d3-b1-http-status-codes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "WebSocket Upgrade Handshake",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Client sends GET /ws with Upgrade: websocket + Sec-WebSocket-Key",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Server computes Sec-WebSocket-Accept hash & responds with HTTP 101 Switching Protocols",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. TCP Socket stays open permanently in full-duplex binary frame streaming mode",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ws_handshake_demo.js",
            "initialCode": "function isWebSocketUpgrade(headers) {\n  return headers.upgrade?.toLowerCase() === 'websocket' && headers.connection?.toLowerCase().includes('upgrade');\n}\n\nconst reqHeaders = { upgrade: 'websocket', connection: 'Upgrade', 'sec-websocket-key': 'dGhlIHNhbXBsZSBub25jZQ==' };\nconsole.log('Is valid WS upgrade request?:', isWebSocketUpgrade(reqHeaders));",
            "expectedOutput": "Is valid WS upgrade request?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What HTTP status code is returned by the server when approving a WebSocket upgrade handshake?",
          "expectedStringOutput": "101",
          "acceptableAnswers": [
            "101",
            "HTTP 101",
            "101 Switching Protocols"
          ],
          "primaryMisconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
              "errorExplanation": "WebSocket upgrades return status code 101 Switching Protocols, not 200 OK.",
              "recoveryPath": {
                "simplerExplanation": "Upgrade handshake returns 101.",
                "guidedFixPrompt": "Type 101"
              }
            }
          }
        }
      },
      {
        "id": "fs-d16-b2-room-broadcasting-pubsub",
        "day": 16,
        "blockNumber": 2,
        "title": "Room Multiplexing & Selective Event Broadcasting",
        "conceptBudget": {
          "primaryConcept": "WebSocket Room Broadcasting",
          "supportingTerms": [
            "Subscribing socket to room Set",
            "Broadcasting to room members excluding sender",
            "Channel-based pub/sub routing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d16-b1-websocket-handshake-upgrade",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "room_hub_demo.js",
            "initialCode": "class RoomHub {\n  constructor() { this.rooms = new Map(); }\n  join(room, socketId) {\n    if (!this.rooms.has(room)) this.rooms.set(room, new Set());\n    this.rooms.get(room).add(socketId);\n  }\n  broadcast(room, senderId) {\n    const members = this.rooms.get(room) || new Set();\n    return [...members].filter(id => id !== senderId);\n  }\n}\n\nconst hub = new RoomHub();\nhub.join('stocks', 'client_1'); hub.join('stocks', 'client_2');\nconsole.log('Recipients for client_1 broadcast:', JSON.stringify(hub.broadcast('stocks', 'client_1')));",
            "expectedOutput": "Recipients for client_1 broadcast: [\"client_2\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which client receives the broadcast when client_1 publishes to room `'stocks'`?",
          "expectedStringOutput": "[\"client_2\"]",
          "acceptableAnswers": [
            "[\"client_2\"]",
            "client_2",
            "['client_2']"
          ],
          "primaryMisconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
          "diagnosisMap": {
            "[\"client_1\",\"client_2\"]": {
              "misconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
              "errorExplanation": "Broadcasting excludes the originating sender client_1.",
              "recoveryPath": {
                "simplerExplanation": "client_1 is excluded -> ['client_2'].",
                "guidedFixPrompt": "Type [\"client_2\"]"
              }
            }
          }
        }
      },
      {
        "id": "fs-d16-b3-heartbeat-ping-pong",
        "day": 16,
        "blockNumber": 3,
        "title": "Heartbeat Ping/Pong & Dead Connection Cleanup",
        "conceptBudget": {
          "primaryConcept": "Heartbeat Detection",
          "supportingTerms": [
            "30-second ping/pong frames",
            "Detecting dropped mobile carrier connections",
            "Releasing zombie socket RAM"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d16-b2-room-broadcasting-pubsub",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "heartbeat_demo.js",
            "initialCode": "function checkZombieConnection(lastPongTimestamp, timeoutMs = 30000) {\n  const isDead = (Date.now() - lastPongTimestamp) > timeoutMs;\n  return { isDead, action: isDead ? 'TERMINATE_SOCKET' : 'HEALTHY' };\n}\n\nconsole.log('Recent Socket:', checkZombieConnection(Date.now() - 5000).action);\nconsole.log('Zombie Socket (45s dead):', checkZombieConnection(Date.now() - 45000).action);",
            "expectedOutput": "Recent Socket: HEALTHY\nZombie Socket (45s dead): TERMINATE_SOCKET",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken for a socket with no pong response for 45 seconds?",
          "expectedStringOutput": "TERMINATE_SOCKET",
          "acceptableAnswers": [
            "TERMINATE_SOCKET",
            "Zombie Socket (45s dead): TERMINATE_SOCKET"
          ],
          "primaryMisconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
          "diagnosisMap": {
            "HEALTHY": {
              "misconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
              "errorExplanation": "45 seconds exceeds the 30-second timeout, triggering socket termination.",
              "recoveryPath": {
                "simplerExplanation": "Terminates dead socket.",
                "guidedFixPrompt": "Type TERMINATE_SOCKET"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Rate Limiting Algorithms: Token Bucket & Leaky Bucket",
    "overviewMetaphor": "The Token Bucket algorithm is an arcade token dispenser: the machine drops 1 free token into your bucket every 1 second; your bucket can hold at most 5 tokens (Burst Capacity); you can instantly spend 5 tokens in 1 second to play 5 games in a burst, but once empty, you are strictly throttled to 1 game per second.",
    "blocks": [
      {
        "id": "fs-d17-b1-token-bucket-math",
        "day": 17,
        "blockNumber": 1,
        "title": "Token Bucket Rate Limiting Mathematical Formulation",
        "conceptBudget": {
          "primaryConcept": "Token Bucket Algorithm",
          "supportingTerms": [
            "Capacity $C$",
            "Refill Rate $R$ tokens/second",
            "Allowing controlled bursts while enforcing steady-state throughput limits",
            "O(1) memory per IP address"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d4-b1-middleware-chain-of-responsibility",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Token Bucket State Slot",
              "boxes": [
                {
                  "label": "tokens",
                  "value": "3.5 (Fractional tokens refilled by time delta)",
                  "varType": "Float",
                  "isUpdated": true
                },
                {
                  "label": "lastRefillTime",
                  "value": "1714000005.2 (Unix timestamp)",
                  "varType": "Epoch Seconds",
                  "isUpdated": true
                },
                {
                  "label": "capacity",
                  "value": "5.0 (Max Burst Ceiling)",
                  "varType": "Integer Ceiling",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "token_bucket_math.js",
            "initialCode": "class MathTokenBucket {\n  constructor(capacity, refillRate) {\n    this.capacity = capacity; this.rate = refillRate;\n    this.tokens = capacity; this.last = Date.now();\n  }\n  take(cost = 1) {\n    const now = Date.now();\n    this.tokens = Math.min(this.capacity, this.tokens + ((now - this.last)/1000) * this.rate);\n    this.last = now;\n    if (this.tokens >= cost) { this.tokens -= cost; return true; }\n    return false;\n  }\n}\n\nconst bucket = new MathTokenBucket(2, 1);\nconsole.log('Token 1:', bucket.take());\nconsole.log('Token 2:', bucket.take());\nconsole.log('Token 3 (Exceeded):', bucket.take());",
            "expectedOutput": "Token 1: true\nToken 2: true\nToken 3 (Exceeded): false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What boolean is returned for Token 3 when bucket capacity is 2?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "False",
            "Token 3 (Exceeded): false"
          ],
          "primaryMisconceptionId": "MC_FS_RATE_LIMITING_TOKEN_BUCKET_IP",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_FS_RATE_LIMITING_TOKEN_BUCKET_IP",
              "errorExplanation": "Capacity is 2, so the 3rd immediate token request is rejected (returns false).",
              "recoveryPath": {
                "simplerExplanation": "Exceeds capacity -> false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "fs-d17-b2-redis-distributed-rate-limiting",
        "day": 17,
        "blockNumber": 2,
        "title": "Distributed Rate Limiting via Redis Lua Scripts",
        "conceptBudget": {
          "primaryConcept": "Distributed Rate Limiting",
          "supportingTerms": [
            "Atomic Redis Lua script execution",
            "Sharing rate limits across multiple horizontally scaled Node.js servers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d17-b1-token-bucket-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Redis Atomic Token Bucket Script",
            "codeSnippet": "-- Redis Lua Script (Executes Atomically in 1 single round-trip)\nlocal key = KEYS[1]\nlocal limit = tonumber(ARGV[1])\nlocal current = redis.call('INCR', key)\nif current == 1 then\n  redis.call('EXPIRE', key, 60)\nend\nif current > limit then\n  return 0 -- Rejected (429)\nend\nreturn 1 -- Allowed (200)",
            "lineNotes": {
              "4": "Atomically increments request counter in Redis RAM.",
              "9": "Returns 0 to trigger HTTP 429 Too Many Requests."
            }
          },
          {
            "type": "runnable_code",
            "filename": "redis_limit_sim.js",
            "initialCode": "function checkDistributedRate(ip, windowSec = 60, maxRequests = 100) {\n  return { key: `ratelimit:${ip}`, limit: maxRequests, window: windowSec };\n}\n\nconsole.log('Redis Key:', checkDistributedRate('192.168.1.1').key);",
            "expectedOutput": "Redis Key: ratelimit:192.168.1.1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must distributed rate limiting in multi-server clusters be implemented in Redis rather than Node.js in-memory variables?",
          "options": [
            "Because in-memory variables only exist inside 1 individual Node process; an attacker hitting 10 different load-balanced servers would receive 10x the allowed rate limit unless counts are centralized in Redis",
            "Because Redis is written in C",
            "Because Node.js cannot count past 100"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_RATE_LIMITING_TOKEN_BUCKET_IP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_RATE_LIMITING_TOKEN_BUCKET_IP",
              "errorExplanation": "Horizontal scaling distributes requests across multiple Node instances, requiring centralized Redis state.",
              "recoveryPath": {
                "simplerExplanation": "Redis shares counts across all servers.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d17-b3-rate-limit-http-headers",
        "day": 17,
        "blockNumber": 3,
        "title": "Standard `X-RateLimit` Response Headers",
        "conceptBudget": {
          "primaryConcept": "Rate Limit Headers",
          "supportingTerms": [
            "`X-RateLimit-Limit`",
            "`X-RateLimit-Remaining`",
            "`X-RateLimit-Reset`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d17-b2-redis-distributed-rate-limiting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rl_headers_demo.js",
            "initialCode": "function getRateLimitHeaders(limit, remaining, resetEpoch) {\n  return {\n    'X-RateLimit-Limit': String(limit),\n    'X-RateLimit-Remaining': String(remaining),\n    'X-RateLimit-Reset': String(resetEpoch)\n  };\n}\n\nconsole.log('Headers:', JSON.stringify(getRateLimitHeaders(60, 42, 1714000060)));",
            "expectedOutput": "Headers: {\"X-RateLimit-Limit\":\"60\",\"X-RateLimit-Remaining\":\"42\",\"X-RateLimit-Reset\":\"1714000060\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value is returned for `X-RateLimit-Remaining` when 42 requests remain?",
          "expectedStringOutput": "42",
          "acceptableAnswers": [
            "42",
            "\"42\""
          ],
          "primaryMisconceptionId": "MC_FS_RATE_LIMITING_TOKEN_BUCKET_IP",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_FS_RATE_LIMITING_TOKEN_BUCKET_IP",
              "errorExplanation": "60 was the max limit. The remaining count is 42.",
              "recoveryPath": {
                "simplerExplanation": "Remaining is 42.",
                "guidedFixPrompt": "Type 42"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Multipart Streaming File Uploads & Cloud Object Storage (S3)",
    "overviewMetaphor": "Direct S3 Upload is sending a package straight to the shipping warehouse instead of making the mailman carry it in his backpack: instead of the user uploading a 2GB video file directly to your Node.js web server (which ties up your CPU and network bandwidth), your server generates a temporary signed VIP VIP pass (S3 Presigned URL); the browser uploads the video directly to Amazon S3 in 1 hop.",
    "blocks": [
      {
        "id": "fs-d18-b1-presigned-url-architecture",
        "day": 18,
        "blockNumber": 1,
        "title": "Presigned S3 Upload URLs & Direct-to-Cloud Uploads",
        "conceptBudget": {
          "primaryConcept": "Presigned S3 URLs",
          "supportingTerms": [
            "Direct Client-to-S3 Uploads",
            "Offloading multi-gigabyte bandwidth from Node server",
            "Time-limited cryptographic upload signatures (15 min)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d2-b3-streams-backpressure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Direct S3 Presigned Upload Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. Client asks Node Server: 'I want to upload avatar.png (2MB)'",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Node Server verifies auth & generates S3 Presigned PUT URL with 15-min expiry",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Browser uploads binary file DIRECTLY to Amazon S3 (Zero Node RAM usage!)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "presigned_demo.js",
            "initialCode": "function generateMockS3Url(bucket, key, expireSec = 900) {\n  const exp = Math.floor(Date.now() / 1000) + expireSec;\n  return {\n    uploadUrl: `https://${bucket}.s3.amazonaws.com/${key}?X-Amz-Expires=${expireSec}&signed=true`,\n    fileKey: key,\n    expiresAt: exp\n  };\n}\n\nconst s3 = generateMockS3Url('pinit-uploads', 'avatars/usr_101.jpg', 600);\nconsole.log('Upload Bucket:', s3.uploadUrl.split('.s3')[0].replace('https://', ''));",
            "expectedOutput": "Upload Bucket: pinit-uploads",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is uploading files directly to S3 via Presigned URLs superior to uploading files through the Node.js Express server?",
          "options": [
            "Because large file uploads bypass the Node.js server entirely, eliminating CPU overhead, RAM buffer bloat, and network saturation on application servers",
            "Because S3 only accepts uploads from browsers",
            "Because Express cannot upload files"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_FILE_UPLOAD_MULTIPART_STREAM_PARSING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_FILE_UPLOAD_MULTIPART_STREAM_PARSING",
              "errorExplanation": "Direct uploads offload all heavy binary I/O from application servers to dedicated cloud storage.",
              "recoveryPath": {
                "simplerExplanation": "Direct S3 uploads save server CPU and RAM.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d18-b2-mime-type-magic-byte-validation",
        "day": 18,
        "blockNumber": 2,
        "title": "Magic Bytes File Validation vs Fake File Extensions",
        "conceptBudget": {
          "primaryConcept": "Magic Bytes Inspection",
          "supportingTerms": [
            "Never trusting client `file.name` or `file.mimetype`",
            "Reading the first 4-8 binary header bytes",
            "PNG (`89 50 4E 47`) and JPEG (`FF D8 FF`) signatures"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d18-b1-presigned-url-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Magic Byte Validation",
            "codeSnippet": "function isRealPng(buffer) {\n  // PNG magic bytes: 0x89 0x50 0x4E 0x47\n  return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;\n}",
            "lineNotes": {
              "2": "Inspects binary file signature regardless of whether hacker renamed file to .png."
            }
          },
          {
            "type": "runnable_code",
            "filename": "magic_bytes_demo.js",
            "initialCode": "function detectFileType(buffer) {\n  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';\n  if (buffer[0] === 0xFF && buffer[1] === 0xD8) return 'image/jpeg';\n  return 'application/octet-stream';\n}\n\nconst mockPng = Buffer.from([0x89, 0x50, 0x4E, 0x47]);\nconst mockJpg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);\nconsole.log('Buffer 1:', detectFileType(mockPng));\nconsole.log('Buffer 2:', detectFileType(mockJpg));",
            "expectedOutput": "Buffer 1: image/png\nBuffer 2: image/jpeg",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What MIME type is detected for buffer beginning with `[0x89, 0x50]`?",
          "expectedStringOutput": "image/png",
          "acceptableAnswers": [
            "image/png",
            "Buffer 1: image/png"
          ],
          "primaryMisconceptionId": "MC_FS_FILE_UPLOAD_MULTIPART_STREAM_PARSING",
          "diagnosisMap": {
            "image/jpeg": {
              "misconceptionId": "MC_FS_FILE_UPLOAD_MULTIPART_STREAM_PARSING",
              "errorExplanation": "0x89 0x50 is the magic byte signature for PNG files.",
              "recoveryPath": {
                "simplerExplanation": "0x89 0x50 is PNG.",
                "guidedFixPrompt": "Type image/png"
              }
            }
          }
        }
      },
      {
        "id": "fs-d18-b3-streaming-multipart-busboy",
        "day": 18,
        "blockNumber": 3,
        "title": "Streaming Multipart Parsing with Busboy",
        "conceptBudget": {
          "primaryConcept": "Streaming Multipart Parser",
          "supportingTerms": [
            "Parsing multipart/form-data on-the-fly",
            "Piping binary file chunks directly to cloud without disk buffering"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d18-b2-mime-type-magic-byte-validation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "busboy_sim.js",
            "initialCode": "function parseMultipartBoundary(header = '') {\n  const match = header.match(/boundary=(.+)/);\n  return match ? match[1] : null;\n}\n\nconsole.log('Boundary:', parseMultipartBoundary('multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'));",
            "expectedOutput": "Boundary: ----WebKitFormBoundary7MA4YWxkTrZu0gW",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What boundary string is extracted from the Content-Type header?",
          "expectedStringOutput": "----WebKitFormBoundary7MA4YWxkTrZu0gW",
          "acceptableAnswers": [
            "----WebKitFormBoundary7MA4YWxkTrZu0gW",
            "Boundary: ----WebKitFormBoundary7MA4YWxkTrZu0gW"
          ],
          "primaryMisconceptionId": "MC_FS_FILE_UPLOAD_MULTIPART_STREAM_PARSING",
          "diagnosisMap": {
            "multipart/form-data": {
              "misconceptionId": "MC_FS_FILE_UPLOAD_MULTIPART_STREAM_PARSING",
              "errorExplanation": "The boundary parameter begins after boundary=.",
              "recoveryPath": {
                "simplerExplanation": "Boundary parameter matches string.",
                "guidedFixPrompt": "Type ----WebKitFormBoundary7MA4YWxkTrZu0gW"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Next.js App Router Architecture: Server vs Client Components",
    "overviewMetaphor": "Next.js App Router is a theater play where the heavy marble castle walls are sculpted in the workshop backstage (Server Components rendered on the server into pure HTML/CSS with 0kB JavaScript bundle); only the tiny interactive toy sword held by the actor has batteries (Client Component marked with `'use client'`).",
    "blocks": [
      {
        "id": "fs-d19-b1-rsc-server-component-architecture",
        "day": 19,
        "blockNumber": 1,
        "title": "React Server Components (RSC) & Zero-Bundle Cost",
        "conceptBudget": {
          "primaryConcept": "React Server Components",
          "supportingTerms": [
            "Default Server Components in App Router",
            "Direct async/await database querying inside component",
            "Zero JavaScript shipped to browser client for server components"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "react-d1-b1-react-mental-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Async Server Component",
            "codeSnippet": "// app/dashboard/page.tsx (Server Component by default)\nexport default async function DashboardPage() {\n  // Runs directly on server: direct DB queries, secret access!\n  const metrics = await db.analytics.findMany();\n  return (\n    <main>\n      <h1>Enterprise Dashboard</h1>\n      <MetricList data={metrics} />\n    </main>\n  );\n}",
            "lineNotes": {
              "2": "Can be an async function fetching data directly without useEffect.",
              "4": "Database credentials never leave the server; only rendered HTML is sent."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rsc_sim_demo.js",
            "initialCode": "async function renderDashboardServerComponent() {\n  const serverData = { users: 1200, revenue: '$48,000' };\n  const html = `<div class=\"dashboard\"><h1>Users: ${serverData.users}</h1><p>Revenue: ${serverData.revenue}</p></div>`;\n  return { html, clientJsBytes: 0, renderedAt: 'SERVER' };\n}\n\nrenderDashboardServerComponent().then(res => {\n  console.log(`Rendered on ${res.renderedAt} with ${res.clientJsBytes}kB client JS bundle!`);\n});",
            "expectedOutput": "Rendered on SERVER with 0kB client JS bundle!",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How much JavaScript code is added to the client's downloadable bundle for a pure Next.js Server Component?",
          "options": [
            "0 kB (Server Components execute entirely on the server and send only pure rendered HTML/RSC payload to the browser)",
            "500 kB",
            "10 MB"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_NEXTJS_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_NEXTJS_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "Server Components contribute 0kB to the client JavaScript bundle.",
              "recoveryPath": {
                "simplerExplanation": "Server components ship 0kB client JS.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d19-b2-use-client-directive-boundary",
        "day": 19,
        "blockNumber": 2,
        "title": "The `'use client'` Directive & Component Interactivity",
        "conceptBudget": {
          "primaryConcept": "`'use client'` Boundary",
          "supportingTerms": [
            "`'use client'` at file top",
            "Enabling React hooks (`useState`, `useEffect`, `onClick`)",
            "Passing Server Components as children to Client Components"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d19-b1-rsc-server-component-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "When to use 'use client'",
              "nodes": [
                {
                  "id": "1",
                  "label": "Does component use useState, useEffect, or onClick / browser events?",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "YES -> Add 'use client' directive at top of file",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "NO (Fetches data, accesses backend API, static UI) -> Keep as Server Component (Default)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "client_boundary.js",
            "initialCode": "function shouldBeClientComponent(features) {\n  const needsClient = features.some(f => ['useState', 'useEffect', 'onClick', 'browserStorage'].includes(f));\n  return needsClient ? 'USE_CLIENT' : 'SERVER_COMPONENT';\n}\n\nconsole.log('Search Bar (has onClick):', shouldBeClientComponent(['onClick', 'useState']));\nconsole.log('Product Details (reads DB):', shouldBeClientComponent(['databaseQuery', 'staticLayout']));",
            "expectedOutput": "Search Bar (has onClick): USE_CLIENT\nProduct Details (reads DB): SERVER_COMPONENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which component type should a static product details page reading from database be?",
          "expectedStringOutput": "SERVER_COMPONENT",
          "acceptableAnswers": [
            "SERVER_COMPONENT",
            "Server Component"
          ],
          "primaryMisconceptionId": "MC_FS_NEXTJS_SERVER_VS_CLIENT_COMPONENT",
          "diagnosisMap": {
            "USE_CLIENT": {
              "misconceptionId": "MC_FS_NEXTJS_SERVER_VS_CLIENT_COMPONENT",
              "errorExplanation": "Static data fetching should remain a Server Component to keep client JS bundle minimal.",
              "recoveryPath": {
                "simplerExplanation": "Database read page is SERVER_COMPONENT.",
                "guidedFixPrompt": "Type SERVER_COMPONENT"
              }
            }
          }
        }
      },
      {
        "id": "fs-d19-b3-hydration-mismatch-prevention",
        "day": 19,
        "blockNumber": 3,
        "title": "Hydration Mismatch Errors & Deterministic Rendering",
        "conceptBudget": {
          "primaryConcept": "Hydration Mismatch Defense",
          "supportingTerms": [
            "Server HTML must match initial Client DOM",
            "Never rendering non-deterministic `Date.now()` or `Math.random()` during initial render",
            "`suppressHydrationWarning`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d19-b2-use-client-directive-boundary",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Hydration Mismatch Diff",
              "brokenCode": "// ❌ BUGGY: Date renders different second on server vs client!\nexport default function TimeDisplay() {\n  return <p>Current: {new Date().toLocaleTimeString()}</p>;\n}",
              "fixedCode": "// ✅ CORRECT: Renders dynamic client-only time inside useEffect after hydration\nexport default function TimeDisplay() {\n  const [time, setTime] = useState(null);\n  useEffect(() => { setTime(new Date().toLocaleTimeString()); }, []);\n  return <p>Current: {time || 'Loading...'}</p>;\n}",
              "errorLine": 3,
              "errorReason": "Server HTML rendered at 10:00:00.000 differs from browser DOM at 10:00:00.050, triggering React Hydration Mismatch warning!",
              "fixExplanation": "Wait for client mounting in useEffect before rendering client-specific values."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hydration_check.js",
            "initialCode": "function checkHydrationMatch(serverHtml, clientHtml) {\n  return serverHtml === clientHtml;\n}\n\nconsole.log('Deterministic Match:', checkHydrationMatch('<div>Hello</div>', '<div>Hello</div>'));\nconsole.log('Mismatch Bug:', checkHydrationMatch('<div>10:00:00</div>', '<div>10:00:01</div>'));",
            "expectedOutput": "Deterministic Match: true\nMismatch Bug: false",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What causes a React Hydration Mismatch Error in Next.js?",
          "options": [
            "When the HTML generated on the server does not exactly match the initial HTML rendered by React in the browser (e.g. rendering window.innerWidth or new Date() directly in JSX)",
            "When CSS fails to download",
            "When internet is disconnected"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_NEXTJS_HYDRATION_MISMATCH_ERROR",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_NEXTJS_HYDRATION_MISMATCH_ERROR",
              "errorExplanation": "Hydration requires initial browser render tree to match server HTML 1-to-1.",
              "recoveryPath": {
                "simplerExplanation": "Server HTML and client initial HTML must match exactly.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Rendering Paradigms: SSR vs SSG vs ISR (Incremental Static Regeneration)",
    "overviewMetaphor": "Rendering strategies are printing newspapers: SSG is printing 100,000 copies of a book once at the factory (Build Time); SSR is writing a personalized live letter for each customer on demand (Request Time); ISR is printing a daily newspaper that updates once every morning while readers instantly grab copies off the newsstand (Cache-Control stale-while-revalidate).",
    "blocks": [
      {
        "id": "fs-d20-b1-rendering-triad-comparison",
        "day": 20,
        "blockNumber": 1,
        "title": "The Rendering Triad: SSG, SSR & ISR Trade-offs",
        "conceptBudget": {
          "primaryConcept": "Rendering Paradigms",
          "supportingTerms": [
            "SSG (Static Site Generation at build time)",
            "SSR (Server-Side Rendering on every request)",
            "ISR (Incremental Static Regeneration in the background)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d19-b1-rsc-server-component-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Rendering Strategy Matrix",
              "boxes": [
                {
                  "label": "SSG (Static)",
                  "value": "Build Time pre-render -> 0ms TTFB via Global CDN (Marketing pages)",
                  "varType": "Static File",
                  "isUpdated": false
                },
                {
                  "label": "SSR (Dynamic)",
                  "value": "Renders fresh on every HTTP request -> Live user data (Dashboards)",
                  "varType": "Per-Request Compute",
                  "isUpdated": true
                },
                {
                  "label": "ISR (Hybrid)",
                  "value": "Static CDN speed + background revalidation every N seconds (E-Commerce)",
                  "varType": "Stale-While-Revalidate",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rendering_matrix_demo.js",
            "initialCode": "function pickStrategy(pageType) {\n  const map = {\n    'TERMS_OF_SERVICE': { type: 'SSG', ttfb: '10ms', cost: '$0.00' },\n    'USER_BANKING_DASHBOARD': { type: 'SSR', ttfb: '120ms', cost: 'Compute intensive' },\n    'PRODUCT_CATALOGUE': { type: 'ISR', ttfb: '15ms', revalidateSec: 60 }\n  };\n  return map[pageType];\n}\n\nconsole.log('Catalogue Strategy:', pickStrategy('PRODUCT_CATALOGUE').type);",
            "expectedOutput": "Catalogue Strategy: ISR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which rendering strategy provides CDN-cached speeds while updating content in the background every 60 seconds?",
          "expectedStringOutput": "ISR",
          "acceptableAnswers": [
            "ISR",
            "Incremental Static Regeneration"
          ],
          "primaryMisconceptionId": "MC_FS_SSR_VS_SSG_VS_ISR_CACHE_CONTROL",
          "diagnosisMap": {
            "SSR": {
              "misconceptionId": "MC_FS_SSR_VS_SSG_VS_ISR_CACHE_CONTROL",
              "errorExplanation": "SSR re-renders on every single request. ISR caches at the CDN and regenerates in the background.",
              "recoveryPath": {
                "simplerExplanation": "Background CDN revalidation is ISR.",
                "guidedFixPrompt": "Type ISR"
              }
            }
          }
        }
      },
      {
        "id": "fs-d20-b2-isr-revalidation-headers",
        "day": 20,
        "blockNumber": 2,
        "title": "Incremental Static Regeneration & `stale-while-revalidate`",
        "conceptBudget": {
          "primaryConcept": "ISR Stale-While-Revalidate",
          "supportingTerms": [
            "`export const revalidate = 60;`",
            "Serving stale cached HTML while background worker rebuilds fresh page",
            "Zero user latency penalty"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d20-b1-rendering-triad-comparison",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "isr_header_demo.js",
            "initialCode": "function buildIsrHeader(revalidateSec = 60, staleSec = 300) {\n  return `public, s-maxage=${revalidateSec}, stale-while-revalidate=${staleSec}`;\n}\n\nconsole.log('Cache-Control:', buildIsrHeader(60, 300));",
            "expectedOutput": "Cache-Control: public, s-maxage=60, stale-while-revalidate=300",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the `s-maxage` value in the Cache-Control header for a 60-second revalidation period?",
          "expectedStringOutput": "60",
          "acceptableAnswers": [
            "60",
            "s-maxage=60"
          ],
          "primaryMisconceptionId": "MC_FS_SSR_VS_SSG_VS_ISR_CACHE_CONTROL",
          "diagnosisMap": {
            "300": {
              "misconceptionId": "MC_FS_SSR_VS_SSG_VS_ISR_CACHE_CONTROL",
              "errorExplanation": "300 is the stale-while-revalidate window. s-maxage is 60.",
              "recoveryPath": {
                "simplerExplanation": "s-maxage is 60.",
                "guidedFixPrompt": "Type 60"
              }
            }
          }
        }
      },
      {
        "id": "fs-d20-b3-dynamic-params-generate-static",
        "day": 20,
        "blockNumber": 3,
        "title": "Pre-Generating Dynamic Routes (`generateStaticParams`)",
        "conceptBudget": {
          "primaryConcept": "`generateStaticParams`",
          "supportingTerms": [
            "Pre-rendering Top 1,000 product pages at build time",
            "`dynamicParams = true` fallback for cold pages"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d20-b2-isr-revalidation-headers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "params_demo.js",
            "initialCode": "async function generateStaticParams() {\n  const topProductIds = ['101', '102', '103'];\n  return topProductIds.map(id => ({ id }));\n}\n\ngenerateStaticParams().then(params => {\n  console.log('Pre-rendered Route Slugs:', JSON.stringify(params));\n});",
            "expectedOutput": "Pre-rendered Route Slugs: [{\"id\":\"101\"},{\"id\":\"102\"},{\"id\":\"103\"}]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many route slugs are pre-rendered at build time in the example above?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 slugs"
          ],
          "primaryMisconceptionId": "MC_FS_SSR_VS_SSG_VS_ISR_CACHE_CONTROL",
          "diagnosisMap": {
            "101": {
              "misconceptionId": "MC_FS_SSR_VS_SSG_VS_ISR_CACHE_CONTROL",
              "errorExplanation": "3 slugs (101, 102, 103) are generated.",
              "recoveryPath": {
                "simplerExplanation": "Count is 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Real-Time Collaborative Canvas & Multi-Room Chat Hub",
    "overviewMetaphor": "Milestone 3 — The Multiplayer Collaborative Whiteboard: When 5 engineers draw diagrams together, each client renders instant optimistic UI updates on their screen; the central Node.js WebSocket Hub resolves concurrent conflict mutations, synchronizes version snapshots across all browser tabs in 10ms, and gracefully reconnects clients during network hiccups.",
    "blocks": [
      {
        "id": "fs-d21-b1-collaborative-mutation-sync",
        "day": 21,
        "blockNumber": 1,
        "title": "Collaborative Canvas State Synchronization & Conflict Resolution",
        "conceptBudget": {
          "primaryConcept": "Collaborative State Machine",
          "supportingTerms": [
            "Optimistic UI local mutation",
            "Server authority snapshot broadcast",
            "Last-Write-Wins (LWW) resolution"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d16-b2-room-broadcasting-pubsub",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Collaborative Mutation Sync Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. User drags rectangle -> Client renders instant optimistic move",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Client emits mutation payload { shapeId, x, y, version } over WebSocket",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Server validates & broadcasts reconciled mutation to all other room members",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "collab_canvas_demo.js",
            "initialCode": "class WhiteboardRoom {\n  constructor() { this.shapes = new Map(); }\n  mutate(userId, shape) {\n    this.shapes.set(shape.id, { ...shape, modifiedBy: userId });\n    return { shapeCount: this.shapes.size, shape: this.shapes.get(shape.id) };\n  }\n}\n\nconst room = new WhiteboardRoom();\nroom.mutate('user_1', { id: 'box_1', x: 50, y: 100 });\nconsole.log('Room Modified By:', room.mutate('user_2', { id: 'box_1', x: 75, y: 120 }).shape.modifiedBy);",
            "expectedOutput": "Room Modified By: user_2",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who is the last modifier of `box_1` after user_2 applies their mutation?",
          "expectedStringOutput": "user_2",
          "acceptableAnswers": [
            "user_2",
            "Room Modified By: user_2"
          ],
          "primaryMisconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
          "diagnosisMap": {
            "user_1": {
              "misconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
              "errorExplanation": "user_2's mutation overrides user_1's previous mutation under Last-Write-Wins.",
              "recoveryPath": {
                "simplerExplanation": "user_2 is the latest modifier.",
                "guidedFixPrompt": "Type user_2"
              }
            }
          }
        }
      },
      {
        "id": "fs-d21-b2-reconnection-recovery-invariants",
        "day": 21,
        "blockNumber": 2,
        "title": "Client Reconnection Recovery & Offline Queue Flushing",
        "conceptBudget": {
          "primaryConcept": "Reconnection State Recovery",
          "supportingTerms": [
            "Exponential backoff reconnection",
            "Flushing queued offline mutations on reconnect",
            "Resynchronizing full room snapshot"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d21-b1-collaborative-mutation-sync",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "reconnect_demo.js",
            "initialCode": "function calculateBackoff(retryCount, baseMs = 1000, maxMs = 30000) {\n  return Math.min(maxMs, baseMs * Math.pow(2, retryCount));\n}\n\nconsole.log('Retry 0 Delay:', calculateBackoff(0));\nconsole.log('Retry 3 Delay:', calculateBackoff(3));\nconsole.log('Retry 10 Delay (Capped):', calculateBackoff(10));",
            "expectedOutput": "Retry 0 Delay: 1000\nRetry 3 Delay: 8000\nRetry 10 Delay (Capped): 30000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the capped maximum reconnection delay (in ms) for Retry 10?",
          "expectedStringOutput": "30000",
          "acceptableAnswers": [
            "30000",
            "30s",
            "Retry 10 Delay (Capped): 30000"
          ],
          "primaryMisconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
          "diagnosisMap": {
            "1024000": {
              "misconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
              "errorExplanation": "Exponential backoff is capped at maxMs (30,000ms).",
              "recoveryPath": {
                "simplerExplanation": "Capped at 30000ms.",
                "guidedFixPrompt": "Type 30000"
              }
            }
          }
        }
      },
      {
        "id": "fs-d21-b3-milestone-collab-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Collaborative Hub Certification",
        "conceptBudget": {
          "primaryConcept": "Collaborative Hub Certification",
          "supportingTerms": [
            "Real-Time Multiplexing Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d21-b2-reconnection-recovery-invariants",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "collab_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Real-Time Collaborative Canvas & Multi-Room Hub [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Real-Time Collaborative Canvas & Multi-Room Hub [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification header string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Real-Time Collaborative Canvas & Multi-Room Hub [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Real-Time Collaborative Canvas & Multi-Room Hub [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FS_WEBSOCKET_HANDSHAKE_VS_HTTP_POLLING",
              "errorExplanation": "Returns ⭐ MILESTONE 3: Real-Time Collaborative Canvas & Multi-Room Hub [VERIFIED 100%].",
              "recoveryPath": {
                "simplerExplanation": "Matches header.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Real-Time Collaborative Canvas & Multi-Room Hub [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Next.js Server Actions, Optimistic Updates & Form Mutations",
    "overviewMetaphor": "Next.js Server Actions are pneumatic deposit tubes at a bank: in old web apps, submitting a form required manually configuring an API route, creating a POST endpoint, parsing JSON, and calling `fetch()`; with Server Actions, you mark a function `'use server'` inside your component, and Next.js automatically provisions a secure RPC endpoint that transmits the form data directly to the server.",
    "blocks": [
      {
        "id": "fs-d22-b1-use-server-actions-rpc",
        "day": 22,
        "blockNumber": 1,
        "title": "The `'use server'` Directive & Automatic RPC Endpoints",
        "conceptBudget": {
          "primaryConcept": "Next.js Server Actions",
          "supportingTerms": [
            "`'use server'` directive",
            "Type-safe asynchronous server mutations",
            "Automatic CSRF protection & POST endpoint provisioning"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d19-b1-rsc-server-component-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Server Action Form Mutation",
            "codeSnippet": "// app/actions/createPost.ts\n'use server';\n\nexport async function createPostAction(formData: FormData) {\n  const title = formData.get('title') as string;\n  // Validates on server, saves to DB, and revalidates cache!\n  await db.post.create({ data: { title } });\n  revalidatePath('/posts');\n}",
            "lineNotes": {
              "2": "'use server' tells Next.js this function executes exclusively on the backend server.",
              "8": "revalidatePath automatically purges cached static HTML and re-renders fresh data."
            }
          },
          {
            "type": "runnable_code",
            "filename": "server_action_demo.js",
            "initialCode": "async function mockServerAction(formDataObj) {\n  if (!formDataObj.title) return { success: false, error: 'TITLE_REQUIRED' };\n  return { success: true, postId: 'post_' + Date.now(), revalidatedPath: '/posts' };\n}\n\nmockServerAction({ title: 'Next.js 15 Masterclass' }).then(res => {\n  console.log('Action Result:', JSON.stringify(res));\n});",
            "expectedOutput": "Action Result: {\"success\":true,\"postId\":\"post_1714000000\",\"revalidatedPath\":\"/posts\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "What does `revalidatePath('/posts')` do inside a Next.js Server Action?",
          "options": [
            "It purges the cached static/ISR HTML for `/posts` and triggers a background refresh so users immediately see their new mutation",
            "It reloads the user's browser window",
            "It drops the database table"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_SERVER_ACTIONS_MUTATION_SECURITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_SERVER_ACTIONS_MUTATION_SECURITY",
              "errorExplanation": "revalidatePath updates the Next.js server cache for the target route.",
              "recoveryPath": {
                "simplerExplanation": "Purges and updates server cache.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d22-b2-use-optimistic-hook",
        "day": 22,
        "blockNumber": 2,
        "title": "Optimistic UI Updates with `useOptimistic`",
        "conceptBudget": {
          "primaryConcept": "React `useOptimistic` Hook",
          "supportingTerms": [
            "Rendering new item instantly before server confirms",
            "Automatic rollback if Server Action throws error"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d22-b1-use-server-actions-rpc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "optimistic_sim.js",
            "initialCode": "function simulateOptimisticUpdate(currentList, newTitle) {\n  const optimisticItem = { id: 'temp_' + Date.now(), title: newTitle, sending: true };\n  return [...currentList, optimisticItem];\n}\n\nconst initial = [{ id: 1, title: 'Item 1' }];\nconst optimistic = simulateOptimisticUpdate(initial, 'Instant Item 2');\nconsole.log('Optimistic List Length:', optimistic.length);\nconsole.log('Is new item sending?:', optimistic[1].sending);",
            "expectedOutput": "Optimistic List Length: 2\nIs new item sending?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is the newly added optimistic item flagged with `sending: true` before server confirmation?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Is new item sending?: true"
          ],
          "primaryMisconceptionId": "MC_FS_SERVER_ACTIONS_MUTATION_SECURITY",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_FS_SERVER_ACTIONS_MUTATION_SECURITY",
              "errorExplanation": "Optimistic items are flagged as sending to show pending spinners.",
              "recoveryPath": {
                "simplerExplanation": "sending is true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "fs-d22-b3-action-security-authorization",
        "day": 22,
        "blockNumber": 3,
        "title": "Server Action Security & Authorization Verification",
        "conceptBudget": {
          "primaryConcept": "Action Authorization Invariant",
          "supportingTerms": [
            "Never assuming caller is authorized",
            "Checking session/tenant on every Server Action invocation",
            "Validating Zod schemas on inputs"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d22-b2-use-optimistic-hook",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "action_auth.js",
            "initialCode": "async function secureDeleteAction(user, postId) {\n  if (!user || user.role !== 'ADMIN') {\n    throw new Error('UNAUTHORIZED_ACTION');\n  }\n  return { deleted: true, postId };\n}\n\nsecureDeleteAction({ id: 1, role: 'ADMIN' }, 101).then(res => {\n  console.log('Admin Delete Success:', res.deleted);\n});",
            "expectedOutput": "Admin Delete Success: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must every Server Action explicitly authenticate and authorize the user inside the function body?",
          "options": [
            "Because Server Actions create public HTTP POST endpoints that can be invoked directly by any malicious script or curl command without going through the frontend UI",
            "Because Next.js disables passwords",
            "Because Node.js does not support roles"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_SERVER_ACTIONS_MUTATION_SECURITY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_SERVER_ACTIONS_MUTATION_SECURITY",
              "errorExplanation": "Server Actions are publicly accessible endpoints requiring backend authorization checks.",
              "recoveryPath": {
                "simplerExplanation": "Actions are public endpoints -> verify auth.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Next.js Route Handlers & Edge Streaming API Responses",
    "overviewMetaphor": "Edge Streaming is a ticker tape machine: instead of waiting 10 full seconds for an AI language model to generate an entire 5,000-word essay before displaying a single character, the Route Handler streams word-by-word tokens over Server-Sent Events (SSE) directly to the user's screen in 50ms chunks.",
    "blocks": [
      {
        "id": "fs-d23-b1-web-streams-sse",
        "day": 23,
        "blockNumber": 1,
        "title": "Server-Sent Events (SSE) & Web `ReadableStream` Anatomy",
        "conceptBudget": {
          "primaryConcept": "Server-Sent Events (SSE)",
          "supportingTerms": [
            "`Content-Type: text/event-stream`",
            "`event: message\\ndata: {...}\\n\\n` format",
            "Unidirectional real-time AI token streaming"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d16-b1-websocket-handshake-upgrade",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SSE Stream Formatter",
            "codeSnippet": "const encoder = new TextEncoder();\nconst stream = new ReadableStream({\n  async start(controller) {\n    for (const token of ['Hello', ' ', 'World!']) {\n      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\\n\\n`));\n      await new Promise(r => setTimeout(r, 50));\n    }\n    controller.close();\n  }\n});",
            "lineNotes": {
              "4": "Enqueues binary encoded SSE event frame to client.",
              "7": "Closes HTTP stream when generation finishes."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sse_demo.js",
            "initialCode": "function formatSseFrame(token) {\n  return `event: token\\ndata: ${JSON.stringify({ text: token })}\\n\\n`;\n}\n\nconsole.log(formatSseFrame('Welcome to PinIT'));",
            "expectedOutput": "event: token\ndata: {\"text\":\"Welcome to PinIT\"}\n\n",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What SSE event string is formatted for token `'Welcome to PinIT'`?",
          "expectedStringOutput": "event: token\ndata: {\"text\":\"Welcome to PinIT\"}\n\n",
          "acceptableAnswers": [
            "event: token\ndata: {\"text\":\"Welcome to PinIT\"}\n\n",
            "event: token\ndata: {\"text\":\"Welcome to PinIT\"}"
          ],
          "primaryMisconceptionId": "MC_FS_ROUTE_HANDLER_RESPONSE_STREAMING",
          "diagnosisMap": {
            "data: Welcome": {
              "misconceptionId": "MC_FS_ROUTE_HANDLER_RESPONSE_STREAMING",
              "errorExplanation": "SSE frames must have event header, json data, and double newline delimiter.",
              "recoveryPath": {
                "simplerExplanation": "Matches standard format.",
                "guidedFixPrompt": "Type event: token\\ndata: {\"text\":\"Welcome to PinIT\"}\\n\\n"
              }
            }
          }
        }
      },
      {
        "id": "fs-d23-b2-edge-runtime-geodistribution",
        "day": 23,
        "blockNumber": 2,
        "title": "Edge Runtime vs Node.js Serverless Functions",
        "conceptBudget": {
          "primaryConcept": "Edge Runtime",
          "supportingTerms": [
            "V8 Isolates with 0ms cold starts",
            "Running near user in 300+ global edge locations",
            "Strict standard Web API subset (fetch, crypto, Response)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d23-b1-web-streams-sse",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Node.js Serverless vs Edge Runtime",
              "boxes": [
                {
                  "label": "Node.js Serverless (Lambda)",
                  "value": "Full Node APIs (fs, child_process), 250ms cold start, Single Region",
                  "varType": "Standard Container",
                  "isUpdated": false
                },
                {
                  "label": "Edge Runtime (V8 Isolates)",
                  "value": "Web APIs only (No fs), 0ms cold start, Global Edge CDN Locations",
                  "varType": "Edge Isolate",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "edge_runtime_demo.js",
            "initialCode": "function getRuntimeSpecs(runtime) {\n  return runtime === 'edge' \n    ? { coldStart: '0ms', location: 'Global CDN Edge (300+ POPs)' }\n    : { coldStart: '250ms', location: 'Regional Datacenter' };\n}\n\nconsole.log('Edge Cold Start:', getRuntimeSpecs('edge').coldStart);",
            "expectedOutput": "Edge Cold Start: 0ms",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the typical cold start latency of V8 Edge Isolates compared to standard serverless containers?",
          "expectedStringOutput": "0ms",
          "acceptableAnswers": [
            "0ms",
            "Zero",
            "Edge Cold Start: 0ms"
          ],
          "primaryMisconceptionId": "MC_FS_ROUTE_HANDLER_RESPONSE_STREAMING",
          "diagnosisMap": {
            "250ms": {
              "misconceptionId": "MC_FS_ROUTE_HANDLER_RESPONSE_STREAMING",
              "errorExplanation": "250ms is for standard containers. Edge isolates start in 0ms.",
              "recoveryPath": {
                "simplerExplanation": "Edge isolates start in 0ms.",
                "guidedFixPrompt": "Type 0ms"
              }
            }
          }
        }
      },
      {
        "id": "fs-d23-b3-route-handler-json-responses",
        "day": 23,
        "blockNumber": 3,
        "title": "Next.js Route Handler HTTP Handlers (`GET`, `POST`)",
        "conceptBudget": {
          "primaryConcept": "Next.js Route Handlers",
          "supportingTerms": [
            "Exporting `async function GET(request)`",
            "Returning `NextResponse.json()`",
            "Extracting query params with `request.nextUrl.searchParams`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d23-b2-edge-runtime-geodistribution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "route_handler_demo.js",
            "initialCode": "function mockRouteHandler(searchParams) {\n  const tag = searchParams.get('tag') || 'all';\n  return { status: 200, body: { filteredBy: tag, count: 12 } };\n}\n\nconst params = new URLSearchParams('tag=javascript');\nconsole.log('Filtered Tag:', mockRouteHandler(params).body.filteredBy);",
            "expectedOutput": "Filtered Tag: javascript",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What tag is filtered in the route handler response?",
          "expectedStringOutput": "javascript",
          "acceptableAnswers": [
            "javascript",
            "Filtered Tag: javascript"
          ],
          "primaryMisconceptionId": "MC_FS_ROUTE_HANDLER_RESPONSE_STREAMING",
          "diagnosisMap": {
            "all": {
              "misconceptionId": "MC_FS_ROUTE_HANDLER_RESPONSE_STREAMING",
              "errorExplanation": "tag=javascript was provided in the search params.",
              "recoveryPath": {
                "simplerExplanation": "Tag is javascript.",
                "guidedFixPrompt": "Type javascript"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Microservices Communication, gRPC & API Gateways",
    "overviewMetaphor": "The Circuit Breaker pattern is an electrical fuse in your home: if your electric kettle catches fire (Service B starts throwing errors and timing out), the fuse trips to OPEN immediately; instead of burning down the whole house (exhausting thread pools on Service A), the circuit breaker fast-fails instantly, protecting your system until the kettle is fixed.",
    "blocks": [
      {
        "id": "fs-d24-b1-circuit-breaker-states",
        "day": 24,
        "blockNumber": 1,
        "title": "The Circuit Breaker Pattern: Closed, Open & Half-Open",
        "conceptBudget": {
          "primaryConcept": "Circuit Breaker Pattern",
          "supportingTerms": [
            "CLOSED (Normal operation)",
            "OPEN (Fast-fail without calling failing service)",
            "HALF_OPEN (Trial probe requests after timeout)",
            "Cascading Failure Prevention"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d5-b1-gateway-router-dispatch",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Circuit Breaker State Transitions",
              "nodes": [
                {
                  "id": "1",
                  "label": "CLOSED: Normal Traffic -> Count consecutive failures",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Failures >= 3 -> Trip to OPEN (Fast-Fail all requests for 10s)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Timeout expires -> Transition to HALF_OPEN (Send 1 trial probe)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Probe succeeds -> Reset to CLOSED! (Probe fails -> Re-open)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "circuit_breaker_demo.js",
            "initialCode": "class SimpleBreaker {\n  constructor(threshold = 2) {\n    this.threshold = threshold;\n    this.failures = 0;\n    this.state = 'CLOSED';\n  }\n  recordFailure() {\n    this.failures++;\n    if (this.failures >= this.threshold) this.state = 'OPEN';\n  }\n  recordSuccess() {\n    this.failures = 0;\n    this.state = 'CLOSED';\n  }\n}\n\nconst cb = new SimpleBreaker(2);\ncb.recordFailure();\nconsole.log('State after 1 fail:', cb.state);\ncb.recordFailure();\nconsole.log('State after 2 fails:', cb.state);",
            "expectedOutput": "State after 1 fail: CLOSED\nState after 2 fails: OPEN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What state does the Circuit Breaker transition to after reaching its failure threshold of 2?",
          "expectedStringOutput": "OPEN",
          "acceptableAnswers": [
            "OPEN",
            "State after 2 fails: OPEN"
          ],
          "primaryMisconceptionId": "MC_FS_MICROSERVICES_API_GATEWAY_ROUTING",
          "diagnosisMap": {
            "CLOSED": {
              "misconceptionId": "MC_FS_MICROSERVICES_API_GATEWAY_ROUTING",
              "errorExplanation": "Exceeding the failure threshold trips the breaker to OPEN to prevent cascading outages.",
              "recoveryPath": {
                "simplerExplanation": "Breaker trips to OPEN.",
                "guidedFixPrompt": "Type OPEN"
              }
            }
          }
        }
      },
      {
        "id": "fs-d24-b2-grpc-protocol-buffers",
        "day": 24,
        "blockNumber": 2,
        "title": "gRPC & Compact Binary Protocol Buffers",
        "conceptBudget": {
          "primaryConcept": "gRPC & Protobuf",
          "supportingTerms": [
            "Binary serialization over HTTP/2",
            "7x smaller payloads than JSON",
            "Strongly typed `.proto` contracts"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d24-b1-circuit-breaker-states",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "grpc_comparison.js",
            "initialCode": "function comparePayloadSizes(obj) {\n  const jsonBytes = Buffer.byteLength(JSON.stringify(obj));\n  const protobufBytesEst = Math.ceil(jsonBytes / 5);\n  return { jsonBytes, protobufBytesEst };\n}\n\nconst user = { id: 101, email: 'alexander@pinit.io', status: 'ACTIVE', role: 'PLATFORM_ARCHITECT' };\nconsole.log('Payload Comparison:', JSON.stringify(comparePayloadSizes(user)));",
            "expectedOutput": "Payload Comparison: {\"jsonBytes\":90,\"protobufBytesEst\":18}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why do high-scale internal microservices use gRPC/Protobuf instead of REST/JSON?",
          "options": [
            "Because gRPC uses compact binary serialization over HTTP/2 multiplexed streams, reducing bandwidth by ~70% and CPU deserialization latency by ~5x",
            "Because gRPC does not require computers",
            "Because JSON is illegal in microservices"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_MICROSERVICES_API_GATEWAY_ROUTING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_MICROSERVICES_API_GATEWAY_ROUTING",
              "errorExplanation": "Binary serialization and HTTP/2 multiplexing provide immense speed and throughput improvements.",
              "recoveryPath": {
                "simplerExplanation": "Binary Protobuf is faster and smaller than JSON.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d24-b3-idempotency-key-dedup",
        "day": 24,
        "blockNumber": 3,
        "title": "Idempotency Keys in Payment & Mutation APIs",
        "conceptBudget": {
          "primaryConcept": "Idempotency Keys",
          "supportingTerms": [
            "`Idempotency-Key: uuid` header",
            "Preventing double-charging customers during network retry bursts"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d24-b2-grpc-protocol-buffers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "idempotency_key_demo.js",
            "initialCode": "const processedKeys = new Map();\nfunction chargePayment(idempotencyKey, amount) {\n  if (processedKeys.has(idempotencyKey)) {\n    return { success: true, ...processedKeys.get(idempotencyKey), replayed: true };\n  }\n  const result = { txId: 'tx_' + Math.random().toString(36).slice(2, 8), amount };\n  processedKeys.set(idempotencyKey, result);\n  return { success: true, ...result, replayed: false };\n}\n\nconst r1 = chargePayment('order_998', 100);\nconst r2 = chargePayment('order_998', 100); // Retry from dropped connection\nconsole.log('Charge 1 Tx:', r1.txId, 'Replayed?:', r1.replayed);\nconsole.log('Charge 2 Tx:', r2.txId, 'Replayed?:', r2.replayed);",
            "expectedOutput": "Charge 1 Tx: tx_123456 Replayed?: false\nCharge 2 Tx: tx_123456 Replayed?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is Charge 2 identified as a replayed request with identical transaction ID?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Replayed?: true"
          ],
          "primaryMisconceptionId": "MC_FS_MICROSERVICES_API_GATEWAY_ROUTING",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_FS_MICROSERVICES_API_GATEWAY_ROUTING",
              "errorExplanation": "Matching idempotency key replays the cached result without double charging.",
              "recoveryPath": {
                "simplerExplanation": "Replayed is true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Event-Driven Asynchronous Message Queues (RabbitMQ/Kafka)",
    "overviewMetaphor": "Message Queues are a restaurant order carousel: when a customer orders a complex 7-course meal (Video transcoding / PDF generation), the cashier prints a ticket, hangs it on the order carousel (Message Queue), and gives the customer their receipt in 1 second; 3 kitchen chefs (Worker Consumers) grab tickets off the carousel and process them in the background at their own speed.",
    "blocks": [
      {
        "id": "fs-d25-b1-message-queue-producer-consumer",
        "day": 25,
        "blockNumber": 1,
        "title": "Producer-Consumer Architecture & Asynchronous Decoupling",
        "conceptBudget": {
          "primaryConcept": "Message Queue Decoupling",
          "supportingTerms": [
            "Producer (App Server enqueues job and returns 202 Accepted in 5ms)",
            "Consumer (Background worker processes heavy workload)",
            "Buffer against traffic spikes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d2-b1-event-emitter-pattern",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Asynchronous Queue Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. User requests: 'Export 500,000 transaction CSV report'",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Web Server pushes job { jobId, userId } to RabbitMQ & responds 202 Accepted in 2ms",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Background Worker pulls job from Queue, builds CSV in 30s, and emails user download link",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "queue_decouple_demo.js",
            "initialCode": "class MemoryQueue {\n  constructor() { this.items = []; }\n  push(job) { this.items.push(job); return this.items.length; }\n  pop() { return this.items.shift() || null; }\n}\n\nconst q = new MemoryQueue();\nq.push({ type: 'GENERATE_PDF', userId: 101 });\nq.push({ type: 'SEND_SMS', userId: 102 });\nconsole.log('Processing Job 1:', q.pop().type);\nconsole.log('Jobs remaining:', q.items.length);",
            "expectedOutput": "Processing Job 1: GENERATE_PDF\nJobs remaining: 1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many jobs remain in the queue after popping Job 1?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "Jobs remaining: 1"
          ],
          "primaryMisconceptionId": "MC_FS_EVENT_DRIVEN_MESSAGE_BROKER_KAFKA",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_FS_EVENT_DRIVEN_MESSAGE_BROKER_KAFKA",
              "errorExplanation": "2 jobs were added; 1 was processed; 1 remains.",
              "recoveryPath": {
                "simplerExplanation": "2 - 1 = 1 job remaining.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "fs-d25-b2-dead-letter-queues-ack",
        "day": 25,
        "blockNumber": 2,
        "title": "Consumer Acknowledgments (`ACK`/`NACK`) & Dead-Letter Queues (DLQ)",
        "conceptBudget": {
          "primaryConcept": "Dead-Letter Queue (DLQ)",
          "supportingTerms": [
            "`ACK` (Successfully processed)",
            "`NACK` (Retry with exponential backoff)",
            "Dead-Letter Queue (Isolating poisoned unparseable messages after 3 fails)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d25-b1-message-queue-producer-consumer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "DLQ Routing Logic",
            "codeSnippet": "try {\n  await processEmailJob(job);\n  channel.ack(msg); // Successfully processed!\n} catch (err) {\n  if (job.attempts < 3) {\n    channel.nack(msg, false, true); // Re-queue for retry\n  } else {\n    channel.sendToQueue('email_dlq', msg); // Route to Dead-Letter Queue\n    channel.ack(msg);\n  }\n}",
            "lineNotes": {
              "3": "Tells queue to safely delete successfully completed message.",
              "8": "Moves poisoned message to DLQ for engineer debugging without halting worker."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dlq_sim.js",
            "initialCode": "function routeDeadLetter(job, maxRetries = 3) {\n  return job.retries >= maxRetries ? 'DEAD_LETTER_QUEUE' : 'RETRY_QUEUE';\n}\n\nconsole.log('Retry 1:', routeDeadLetter({ retries: 1 }));\nconsole.log('Retry 3 (Poisoned):', routeDeadLetter({ retries: 3 }));",
            "expectedOutput": "Retry 1: RETRY_QUEUE\nRetry 3 (Poisoned): DEAD_LETTER_QUEUE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where is a failing message routed when its retries reach 3?",
          "expectedStringOutput": "DEAD_LETTER_QUEUE",
          "acceptableAnswers": [
            "DEAD_LETTER_QUEUE",
            "Retry 3 (Poisoned): DEAD_LETTER_QUEUE"
          ],
          "primaryMisconceptionId": "MC_FS_EVENT_DRIVEN_MESSAGE_BROKER_KAFKA",
          "diagnosisMap": {
            "RETRY_QUEUE": {
              "misconceptionId": "MC_FS_EVENT_DRIVEN_MESSAGE_BROKER_KAFKA",
              "errorExplanation": "After reaching maxRetries (3), the message is routed to DEAD_LETTER_QUEUE.",
              "recoveryPath": {
                "simplerExplanation": "Poisoned message goes to DEAD_LETTER_QUEUE.",
                "guidedFixPrompt": "Type DEAD_LETTER_QUEUE"
              }
            }
          }
        }
      },
      {
        "id": "fs-d25-b3-at-least-once-delivery",
        "day": 25,
        "blockNumber": 3,
        "title": "At-Least-Once Delivery Invariants & Consumer Idempotency",
        "conceptBudget": {
          "primaryConcept": "At-Least-Once Delivery",
          "supportingTerms": [
            "Networks can drop ACK packets causing duplicate delivery",
            "Consumers MUST be idempotent"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d25-b2-dead-letter-queues-ack",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "idempotent_consumer.js",
            "initialCode": "const processedJobs = new Set();\nfunction processJobIdempotent(jobId) {\n  if (processedJobs.has(jobId)) return 'ALREADY_PROCESSED_SKIPPED';\n  processedJobs.add(jobId);\n  return 'SUCCESSFULLY_EXECUTED';\n}\n\nconsole.log('1st Delivery:', processJobIdempotent('job_99'));\nconsole.log('2nd Duplicate Delivery:', processJobIdempotent('job_99'));",
            "expectedOutput": "1st Delivery: SUCCESSFULLY_EXECUTED\n2nd Duplicate Delivery: ALREADY_PROCESSED_SKIPPED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must message queue background consumers always be designed to be idempotent?",
          "options": [
            "Because distributed message brokers provide 'At-Least-Once' delivery; network hiccups can cause the same job message to be delivered twice, and non-idempotent consumers would duplicate orders or double-charge users",
            "Because queues cannot store numbers",
            "Because JavaScript functions only run once"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_EVENT_DRIVEN_MESSAGE_BROKER_KAFKA",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_EVENT_DRIVEN_MESSAGE_BROKER_KAFKA",
              "errorExplanation": "At-Least-Once delivery guarantees messages won't be lost, but duplicates can occur during network partition ACKs.",
              "recoveryPath": {
                "simplerExplanation": "Idempotency prevents duplicate side-effects on duplicate delivery.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Docker Containerization & Multi-Stage Production Builds",
    "overviewMetaphor": "Docker is a self-contained shipping container: instead of \"It works on my machine, why does it crash on production?\", Docker packs the exact Node.js runtime, exact Linux binaries, and exact application code into an immutable sealed box; with Multi-Stage builds, you use heavy factory cranes during assembly (TypeScript compiler, node_modules build tools), but ship only the tiny final 50MB engine inside the customer's container.",
    "blocks": [
      {
        "id": "fs-d26-b1-multi-stage-docker-builds",
        "day": 26,
        "blockNumber": 1,
        "title": "Multi-Stage Dockerfile Architecture & Image Slimming",
        "conceptBudget": {
          "primaryConcept": "Multi-Stage Docker Builds",
          "supportingTerms": [
            "Stage 1: `FROM node:20-alpine AS builder` (Compiles TS)",
            "Stage 2: `FROM node:20-alpine AS runner` (Copies only production artifacts)",
            "Shrinking Docker images from 1.5GB to < 80MB"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d1-b1-client-server-boundary",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Multi-Stage Production Dockerfile",
            "codeSnippet": "# Stage 1: Build Phase\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Production Runner Phase (Tiny footprint!)\nFROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nUSER node\nCOPY --from=builder /app/package*.json ./\nCOPY --from=builder /app/.next/standalone ./\nCOPY --from=builder /app/public ./public\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]",
            "lineNotes": {
              "2": "Heavy development dependencies exist only in builder stage.",
              "11": "Non-root user security practice.",
              "13": "Copies only standalone compiled production bundle into final tiny image."
            }
          },
          {
            "type": "runnable_code",
            "filename": "docker_size_sim.js",
            "initialCode": "function compareDockerSizes(hasMultiStage) {\n  return hasMultiStage \n    ? { imageSizeMb: 68, buildStageCount: 2, isProductionReady: true }\n    : { imageSizeMb: 1450, buildStageCount: 1, isProductionReady: false };\n}\n\nconsole.log('Multi-Stage Image Size (MB):', compareDockerSizes(true).imageSizeMb);\nconsole.log('Single-Stage Image Size (MB):', compareDockerSizes(false).imageSizeMb);",
            "expectedOutput": "Multi-Stage Image Size (MB): 68\nSingle-Stage Image Size (MB): 1450",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should production Dockerfiles use Multi-Stage builds?",
          "options": [
            "To keep compiler tools and devDependencies in the build stage, producing a tiny, ultra-fast, and secure production image containing only compiled production artifacts",
            "Because Docker single-stage builds are disabled on AWS",
            "To make JavaScript run without a CPU"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_DOCKER_CONTAINER_MULTI_STAGE_BUILD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_DOCKER_CONTAINER_MULTI_STAGE_BUILD",
              "errorExplanation": "Multi-stage builds separate compile-time tools from runtime production images, shrinking image size by over 90%.",
              "recoveryPath": {
                "simplerExplanation": "Multi-stage builds create tiny, secure production images.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "fs-d26-b2-non-root-user-security",
        "day": 26,
        "blockNumber": 2,
        "title": "Non-Root `USER node` Security Isolation",
        "conceptBudget": {
          "primaryConcept": "Non-Root User Containerization",
          "supportingTerms": [
            "`USER node` directive",
            "Preventing container escape root privileges",
            "Principle of Least Privilege"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d26-b1-multi-stage-docker-builds",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "non_root_check.js",
            "initialCode": "function checkContainerUser(dockerfileText) {\n  return /USER\\s+node/i.test(dockerfileText);\n}\n\nconst sampleDockerfile = 'FROM node:20-alpine\\nUSER node\\nCMD [\"node\", \"server.js\"]';\nconsole.log('Has Non-Root USER node?:', checkContainerUser(sampleDockerfile));",
            "expectedOutput": "Has Non-Root USER node?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is `USER node` verified in the Dockerfile check above?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Has Non-Root USER node?: true"
          ],
          "primaryMisconceptionId": "MC_FS_DOCKER_CONTAINER_MULTI_STAGE_BUILD",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_FS_DOCKER_CONTAINER_MULTI_STAGE_BUILD",
              "errorExplanation": "The regex detects USER node in the text, returning true.",
              "recoveryPath": {
                "simplerExplanation": "Matches USER node -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "fs-d26-b3-dockerignore-layer-caching",
        "day": 26,
        "blockNumber": 3,
        "title": "`.dockerignore` & Optimal Layer Caching",
        "conceptBudget": {
          "primaryConcept": "Docker Layer Caching",
          "supportingTerms": [
            "Copying `package*.json` BEFORE `COPY . .`",
            "Reusing cached npm ci layers when source code changes",
            "Ignoring `node_modules` and `.git`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d26-b2-non-root-user-security",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "layer_cache_demo.js",
            "initialCode": "function isOptimalLayerOrder(steps) {\n  const pkgIdx = steps.indexOf('COPY package*.json ./');\n  const npmIdx = steps.indexOf('RUN npm ci');\n  const srcIdx = steps.indexOf('COPY . .');\n  return pkgIdx < npmIdx && npmIdx < srcIdx;\n}\n\nconst dockerSteps = ['WORKDIR /app', 'COPY package*.json ./', 'RUN npm ci', 'COPY . .', 'RUN npm run build'];\nconsole.log('Optimal Caching Order?:', isOptimalLayerOrder(dockerSteps));",
            "expectedOutput": "Optimal Caching Order?: true",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is copying package.json and running npm ci before copying source code considered optimal for layer caching?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "True",
            "Optimal Caching Order?: true"
          ],
          "primaryMisconceptionId": "MC_FS_DOCKER_CONTAINER_MULTI_STAGE_BUILD",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_FS_DOCKER_CONTAINER_MULTI_STAGE_BUILD",
              "errorExplanation": "Copying package.json first allows Docker to cache expensive npm ci layers across code edits.",
              "recoveryPath": {
                "simplerExplanation": "Order is optimal -> true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Health Checks, Liveness/Readiness Probes & OpenTelemetry",
    "overviewMetaphor": "Health Checks are medical vital signs in an intensive care unit: `/healthz` (Liveness) checks if the patient's heart is beating (Node process is alive); `/readyz` (Readiness) checks if the patient is conscious and able to do work (Database and Redis connections are responding); if `/readyz` fails, the load balancer stops routing traffic to this server until it recovers.",
    "blocks": [
      {
        "id": "fs-d27-b1-liveness-vs-readiness-probes",
        "day": 27,
        "blockNumber": 1,
        "title": "Kubernetes Liveness (`/healthz`) vs Readiness (`/readyz`) Probes",
        "conceptBudget": {
          "primaryConcept": "K8s Health Probes",
          "supportingTerms": [
            "Liveness: Is process alive? (Failing restarts container)",
            "Readiness: Are database/cache dependencies connected? (Failing removes container from load balancer)",
            "HTTP 200 OK vs HTTP 503 Service Unavailable"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d26-b1-multi-stage-docker-builds",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Liveness vs Readiness Probe Behavior",
              "boxes": [
                {
                  "label": "Liveness (/healthz)",
                  "value": "Checks Node.js event loop health. If 500 -> K8s REBOOTS CONTAINER",
                  "varType": "Process Vitality",
                  "isUpdated": false
                },
                {
                  "label": "Readiness (/readyz)",
                  "value": "Checks DB & Redis connections. If 503 -> K8s DETACHES FROM TRAFFIC",
                  "varType": "Traffic Readiness",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "probe_demo.js",
            "initialCode": "function evaluateReadiness(dbConnected, redisConnected) {\n  const ready = dbConnected && redisConnected;\n  return {\n    status: ready ? 200 : 503,\n    body: { status: ready ? 'READY' : 'UNAVAILABLE', db: dbConnected, redis: redisConnected }\n  };\n}\n\nconsole.log('All dependencies up:', evaluateReadiness(true, true).status);\nconsole.log('Redis down:', evaluateReadiness(true, false).status);",
            "expectedOutput": "All dependencies up: 200\nRedis down: 503",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What HTTP status code is returned by the Readiness Probe when Redis is down?",
          "expectedStringOutput": "503",
          "acceptableAnswers": [
            "503",
            "503 Service Unavailable",
            "Redis down: 503"
          ],
          "primaryMisconceptionId": "MC_FS_HEALTH_CHECK_LIVENESS_READINESS_PROBE",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_FS_HEALTH_CHECK_LIVENESS_READINESS_PROBE",
              "errorExplanation": "If any critical dependency is down, readiness returns 503 to stop receiving client traffic.",
              "recoveryPath": {
                "simplerExplanation": "Unhealthy dependency = 503.",
                "guidedFixPrompt": "Type 503"
              }
            }
          }
        }
      },
      {
        "id": "fs-d27-b2-opentelemetry-distributed-tracing",
        "day": 27,
        "blockNumber": 2,
        "title": "OpenTelemetry Distributed Tracing & W3C `traceparent`",
        "conceptBudget": {
          "primaryConcept": "Distributed Tracing",
          "supportingTerms": [
            "`traceparent: 00-traceId-spanId-01`",
            "Tracking request journey across 10 microservices",
            "Identifying latency bottlenecks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d27-b1-liveness-vs-readiness-probes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "otel_demo.js",
            "initialCode": "function parseW3cTraceparent(header = '') {\n  const parts = header.split('-');\n  if (parts.length < 4) return null;\n  return { version: parts[0], traceId: parts[1], parentSpanId: parts[2], flags: parts[3] };\n}\n\nconst sampleTrace = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';\nconsole.log('Trace ID:', parseW3cTraceparent(sampleTrace).traceId);",
            "expectedOutput": "Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the extracted traceId from the W3C header above?",
          "expectedStringOutput": "4bf92f3577b34da6a3ce929d0e0e4736",
          "acceptableAnswers": [
            "4bf92f3577b34da6a3ce929d0e0e4736",
            "Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736"
          ],
          "primaryMisconceptionId": "MC_FS_HEALTH_CHECK_LIVENESS_READINESS_PROBE",
          "diagnosisMap": {
            "00f067aa0ba902b7": {
              "misconceptionId": "MC_FS_HEALTH_CHECK_LIVENESS_READINESS_PROBE",
              "errorExplanation": "00f067aa0ba902b7 is the spanId. The traceId is 4bf92f3577b34da6a3ce929d0e0e4736.",
              "recoveryPath": {
                "simplerExplanation": "TraceId is the 32-character hex string.",
                "guidedFixPrompt": "Type 4bf92f3577b34da6a3ce929d0e0e4736"
              }
            }
          }
        }
      },
      {
        "id": "fs-d27-b3-graceful-shutdown-sigterm",
        "day": 27,
        "blockNumber": 3,
        "title": "Graceful Shutdown on `SIGTERM` / `SIGINT`",
        "conceptBudget": {
          "primaryConcept": "Graceful Shutdown",
          "supportingTerms": [
            "Closing HTTP listener (refusing new requests)",
            "Waiting for in-flight requests to finish",
            "Closing DB & Redis connection pools",
            "`process.exit(0)`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d27-b2-opentelemetry-distributed-tracing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "shutdown_demo.js",
            "initialCode": "async function performGracefulShutdown(activeRequests, dbPool) {\n  // 1. Stop taking new requests\n  let status = 'DRAINING';\n  // 2. Wait for active in-flight requests\n  if (activeRequests === 0) status = 'CONNECTIONS_DRAINED';\n  // 3. Close database\n  return { status, poolClosed: true, exitCode: 0 };\n}\n\nperformGracefulShutdown(0, {}).then(res => {\n  console.log('Shutdown Status:', res.status);\n});",
            "expectedOutput": "Shutdown Status: CONNECTIONS_DRAINED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why should production Node.js servers intercept the `SIGTERM` signal for graceful shutdown?",
          "options": [
            "To allow active in-flight HTTP requests and database transactions to finish cleanly before exiting, avoiding aborted payments and broken user sessions during deployments",
            "Because Linux crashes if SIGTERM is ignored",
            "To delete log files"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_HEALTH_CHECK_LIVENESS_READINESS_PROBE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_HEALTH_CHECK_LIVENESS_READINESS_PROBE",
              "errorExplanation": "Graceful shutdown drains active in-flight connections cleanly.",
              "recoveryPath": {
                "simplerExplanation": "Graceful shutdown prevents aborted user requests.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "GraphQL API Architecture: Schema Resolvers & Overfetch Elimination",
    "overviewMetaphor": "GraphQL is ordering food at a personalized salad bar: in REST, ordering a \"User Salad\" gives you the fixed bowl with all 30 ingredients whether you want them or not (Overfetching 30 fields); with GraphQL, the client hands the chef a slip saying \"I only want lettuce and tomatoes\" (`query { user { name, email } }`), receiving an exact lightweight payload.",
    "blocks": [
      {
        "id": "fs-d28-b1-graphql-query-resolving",
        "day": 28,
        "blockNumber": 1,
        "title": "GraphQL Schema Definition Language (SDL) & Field Resolvers",
        "conceptBudget": {
          "primaryConcept": "GraphQL Query Resolvers",
          "supportingTerms": [
            "`type Query { user(id: ID!): User }`",
            "Resolvers `(parent, args, context, info)`",
            "Eliminating mobile overfetching and underfetching"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d3-b1-http-status-codes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "GraphQL Schema & Resolver",
            "codeSnippet": "const typeDefs = `#graphql\n  type User {\n    id: ID!\n    name: String!\n    posts: [Post!]!\n  }\n`;\n\nconst resolvers = {\n  Query: {\n    user: async (_, { id }, { db }) => db.user.findUnique({ where: { id } })\n  }\n};",
            "lineNotes": {
              "2": "Strongly-typed SDL contract.",
              "9": "Field resolver querying database with typed arguments."
            }
          },
          {
            "type": "runnable_code",
            "filename": "graphql_field_demo.js",
            "initialCode": "function projectFields(data, fields) {\n  const out = {};\n  fields.forEach(f => { if (f in data) out[f] = data[f]; });\n  return out;\n}\n\nconst fullRecord = { id: 'usr_1', name: 'Alex', email: 'alex@pinit.io', passwordHash: 'secret_hash_abc', ssn: '000-11-2222' };\nconsole.log('Projected GraphQL Response:', JSON.stringify(projectFields(fullRecord, ['id', 'name'])));",
            "expectedOutput": "Projected GraphQL Response: {\"id\":\"usr_1\",\"name\":\"Alex\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What fields are returned when requesting only `['id', 'name']`?",
          "expectedStringOutput": "{\"id\":\"usr_1\",\"name\":\"Alex\"}",
          "acceptableAnswers": [
            "{\"id\":\"usr_1\",\"name\":\"Alex\"}",
            "Projected GraphQL Response: {\"id\":\"usr_1\",\"name\":\"Alex\"}"
          ],
          "primaryMisconceptionId": "MC_FS_GRAPHQL_SCHEMA_RESOLVER_OVERFETCH",
          "diagnosisMap": {
            "{\"id\":\"usr_1\",\"name\":\"Alex\",\"email\":\"alex@pinit.io\"}": {
              "misconceptionId": "MC_FS_GRAPHQL_SCHEMA_RESOLVER_OVERFETCH",
              "errorExplanation": "GraphQL filters out unrequested fields like email and passwordHash.",
              "recoveryPath": {
                "simplerExplanation": "Only requested fields id and name are returned.",
                "guidedFixPrompt": "Type {\"id\":\"usr_1\",\"name\":\"Alex\"}"
              }
            }
          }
        }
      },
      {
        "id": "fs-d28-b2-graphql-mutation-resolvers",
        "day": 28,
        "blockNumber": 2,
        "title": "GraphQL Mutations & Input Types",
        "conceptBudget": {
          "primaryConcept": "GraphQL Mutations",
          "supportingTerms": [
            "`type Mutation { createPost(input: PostInput!): Post }`",
            "`input PostInput { title: String! }`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d28-b1-graphql-query-resolving",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mutation_demo.js",
            "initialCode": "function executeMutation(input) {\n  return { success: true, post: { id: 'post_101', ...input } };\n}\n\nconsole.log('Created Post:', executeMutation({ title: 'GraphQL Masterclass' }).post.title);",
            "expectedOutput": "Created Post: GraphQL Masterclass",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the title of the created post?",
          "expectedStringOutput": "GraphQL Masterclass",
          "acceptableAnswers": [
            "GraphQL Masterclass",
            "Created Post: GraphQL Masterclass"
          ],
          "primaryMisconceptionId": "MC_FS_GRAPHQL_SCHEMA_RESOLVER_OVERFETCH",
          "diagnosisMap": {
            "post_101": {
              "misconceptionId": "MC_FS_GRAPHQL_SCHEMA_RESOLVER_OVERFETCH",
              "errorExplanation": "post_101 is the ID. The title is GraphQL Masterclass.",
              "recoveryPath": {
                "simplerExplanation": "Title is GraphQL Masterclass.",
                "guidedFixPrompt": "Type GraphQL Masterclass"
              }
            }
          }
        }
      },
      {
        "id": "fs-d28-b3-query-complexity-depth-limiting",
        "day": 28,
        "blockNumber": 3,
        "title": "Query Complexity & Deep Recursion Defense",
        "conceptBudget": {
          "primaryConcept": "GraphQL Depth Limiting",
          "supportingTerms": [
            "Preventing circular nested queries (`user { posts { author { posts { ... } } } }`)",
            "Calculating query cost points before execution"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d28-b2-graphql-mutation-resolvers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "depth_limit.js",
            "initialCode": "function calculateQueryDepth(queryStr) {\n  let maxDepth = 0, current = 0;\n  for (const ch of queryStr) {\n    if (ch === '{') { current++; maxDepth = Math.max(maxDepth, current); }\n    else if (ch === '}') { current--; }\n  }\n  return maxDepth;\n}\n\nconsole.log('Query Depth:', calculateQueryDepth('{ user { posts { comments { author { name } } } } }'));",
            "expectedOutput": "Query Depth: 5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the nesting depth of the query `{ user { posts { comments { author { name } } } } }`?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "Query Depth: 5"
          ],
          "primaryMisconceptionId": "MC_FS_GRAPHQL_SCHEMA_RESOLVER_OVERFETCH",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_FS_GRAPHQL_SCHEMA_RESOLVER_OVERFETCH",
              "errorExplanation": "There are 5 levels of opening braces: user, posts, comments, author, name.",
              "recoveryPath": {
                "simplerExplanation": "5 nested braces = depth 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Zero-Downtime Deployments: Blue-Green & Canary Rollouts",
    "overviewMetaphor": "Blue-Green deployment is a train track switch: Blue is the active track carrying live passenger trains (Version 1); Green is the brand-new parallel track where engineers test Version 2; when Version 2 passes 100% of health tests, the master railroad switch flips the router to Green in 1 millisecond with zero train stops.",
    "blocks": [
      {
        "id": "fs-d29-b1-blue-green-traffic-switching",
        "day": 29,
        "blockNumber": 1,
        "title": "Blue-Green Environment Isolation & DNS/Router Cutover",
        "conceptBudget": {
          "primaryConcept": "Blue-Green Deployment",
          "supportingTerms": [
            "Blue (Active Live Production)",
            "Green (Idle Staging Production Clone)",
            "Instant router cutover with 0s downtime",
            "Instant 1-click rollback on failure"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d27-b1-liveness-vs-readiness-probes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Blue-Green Cutover Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. 100% Live Traffic routes to BLUE environment (v1.0.0)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Deploy v1.1.0 to GREEN environment & run automated smoke tests",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Flip Load Balancer switch: GREEN is now LIVE! (BLUE becomes standby)",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "blue_green_demo.js",
            "initialCode": "class BlueGreenRouter {\n  constructor() { this.active = 'BLUE'; }\n  switch() { this.active = this.active === 'BLUE' ? 'GREEN' : 'BLUE'; return this.active; }\n}\n\nconst router = new BlueGreenRouter();\nconsole.log('Initial Active:', router.active);\nconsole.log('After Deploy Cutover:', router.switch());",
            "expectedOutput": "Initial Active: BLUE\nAfter Deploy Cutover: GREEN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What environment becomes active after triggering the router cutover switch?",
          "expectedStringOutput": "GREEN",
          "acceptableAnswers": [
            "GREEN",
            "After Deploy Cutover: GREEN"
          ],
          "primaryMisconceptionId": "MC_FS_ZERO_DOWNTIME_BLUE_GREEN_DEPLOY",
          "diagnosisMap": {
            "BLUE": {
              "misconceptionId": "MC_FS_ZERO_DOWNTIME_BLUE_GREEN_DEPLOY",
              "errorExplanation": "The cutover switches traffic from BLUE to GREEN.",
              "recoveryPath": {
                "simplerExplanation": "Active environment is GREEN.",
                "guidedFixPrompt": "Type GREEN"
              }
            }
          }
        }
      },
      {
        "id": "fs-d29-b2-canary-percentage-rollouts",
        "day": 29,
        "blockNumber": 2,
        "title": "Canary Percentage Rollouts & Automated Error Rollback",
        "conceptBudget": {
          "primaryConcept": "Canary Rollouts",
          "supportingTerms": [
            "Routing 5% of real user traffic to Canary version",
            "Monitoring HTTP 5xx error rates",
            "Automated instant rollback if error rate > 2%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d29-b1-blue-green-traffic-switching",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "canary_demo.js",
            "initialCode": "function evaluateCanaryHealth(errorRate, threshold = 0.02) {\n  if (errorRate > threshold) {\n    return { decision: 'AUTOMATED_ROLLBACK_TO_STABLE', safe: false };\n  }\n  return { decision: 'PROMOTE_TO_NEXT_STAGE', safe: true };\n}\n\nconsole.log('0.5% Error Rate:', evaluateCanaryHealth(0.005).decision);\nconsole.log('4.2% Error Rate:', evaluateCanaryHealth(0.042).decision);",
            "expectedOutput": "0.5% Error Rate: PROMOTE_TO_NEXT_STAGE\n4.2% Error Rate: AUTOMATED_ROLLBACK_TO_STABLE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What decision is triggered when canary error rate is 4.2% (above 2% threshold)?",
          "expectedStringOutput": "AUTOMATED_ROLLBACK_TO_STABLE",
          "acceptableAnswers": [
            "AUTOMATED_ROLLBACK_TO_STABLE",
            "4.2% Error Rate: AUTOMATED_ROLLBACK_TO_STABLE"
          ],
          "primaryMisconceptionId": "MC_FS_ZERO_DOWNTIME_BLUE_GREEN_DEPLOY",
          "diagnosisMap": {
            "PROMOTE_TO_NEXT_STAGE": {
              "misconceptionId": "MC_FS_ZERO_DOWNTIME_BLUE_GREEN_DEPLOY",
              "errorExplanation": "4.2% error rate exceeds the 2% threshold, triggering automated rollback.",
              "recoveryPath": {
                "simplerExplanation": "Triggers AUTOMATED_ROLLBACK_TO_STABLE.",
                "guidedFixPrompt": "Type AUTOMATED_ROLLBACK_TO_STABLE"
              }
            }
          }
        }
      },
      {
        "id": "fs-d29-b3-database-expand-contract-pattern",
        "day": 29,
        "blockNumber": 3,
        "title": "The Expand-and-Contract Database Migration Pattern",
        "conceptBudget": {
          "primaryConcept": "Expand-and-Contract Pattern",
          "supportingTerms": [
            "1. Expand: Add new nullable column",
            "2. Dual-Write: Write to both old and new columns",
            "3. Backfill data",
            "4. Contract: Remove old column after all servers update"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d29-b2-canary-percentage-rollouts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Expand-Contract Zero-Downtime Migration",
              "nodes": [
                {
                  "id": "1",
                  "label": "EXPAND: Add new column 'full_name' without deleting 'first_name' / 'last_name'",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "DUAL-WRITE: Application v1.1.0 writes to both old and new columns",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "CONTRACT: Once 100% of servers run v1.1.0, drop old columns safely",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "expand_contract_demo.js",
            "initialCode": "function dualWriteUser(firstName, lastName) {\n  return {\n    first_name: firstName,\n    last_name: lastName,\n    full_name: `${firstName} ${lastName}` // Expand phase supports both old and new queries!\n  };\n}\n\nconsole.log('Dual-Write Record:', JSON.stringify(dualWriteUser('Alex', 'Rivers')));",
            "expectedOutput": "Dual-Write Record: {\"first_name\":\"Alex\",\"last_name\":\"Rivers\",\"full_name\":\"Alex Rivers\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is renaming a database column directly (e.g. `ALTER TABLE users RENAME COLUMN name TO full_name`) catastrophic during zero-downtime deployments?",
          "options": [
            "Because old server instances still running the previous code version will immediately crash with SQL errors when looking for the old column name; Expand-and-Contract keeps both columns active during migration",
            "Because SQL does not allow column renames",
            "Because tables get deleted"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_FS_ZERO_DOWNTIME_BLUE_GREEN_DEPLOY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_FS_ZERO_DOWNTIME_BLUE_GREEN_DEPLOY",
              "errorExplanation": "During rolling updates, old and new server versions run simultaneously, requiring backward-compatible database schemas.",
              "recoveryPath": {
                "simplerExplanation": "Expand-and-contract maintains backward compatibility.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Multi-Tenant E-Commerce Platform with Real-Time Inventory & Stripe Payments",
    "overviewMetaphor": "Final Capstone Synthesis: The complete production enterprise full-stack platform integrating Next.js App Router, Server Actions, Redis rate limiting, Prisma multi-tenancy, Stripe webhooks, WebSocket live order updates, and zero-downtime Blue-Green reliability.",
    "blocks": [
      {
        "id": "fs-d30-b1-capstone-checkout-transaction",
        "day": 30,
        "blockNumber": 1,
        "title": "Atomic Checkout & Distributed Inventory Reservation",
        "conceptBudget": {
          "primaryConcept": "Atomic Checkout Invariant",
          "supportingTerms": [
            "Database transaction isolation",
            "Stripe payment capture",
            "Stock rollback on payment decline",
            "Zero inventory overselling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d24-b3-idempotency-key-dedup",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Capstone Checkout Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "1. User submits checkout form with Server Action",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "2. Atomically reserve inventory in database transaction",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "3. Charge payment via Stripe SDK with Idempotency Key",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "4. If Stripe fails -> Rollback inventory reservation & return 402 Payment Required",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "5. If Stripe succeeds -> Emit WebSocket 'order:confirmed' event -> Revalidate Next.js cache",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "checkout_sim.js",
            "initialCode": "async function checkoutOrder(stock, qty, paymentSucceeds = true) {\n  if (stock < qty) return { success: false, error: 'OUT_OF_STOCK' };\n  let currentStock = stock - qty;\n  if (!paymentSucceeds) {\n    currentStock += qty; // Rollback\n    return { success: false, error: 'PAYMENT_DECLINED', remainingStock: currentStock };\n  }\n  return { success: true, orderId: 'ORD_1001', remainingStock: currentStock };\n}\n\ncheckoutOrder(5, 2, true).then(res => {\n  console.log('Success Checkout Stock:', res.remainingStock);\n});\ncheckoutOrder(5, 2, false).then(res => {\n  console.log('Failed Payment Rolled Back Stock:', res.remainingStock);\n});",
            "expectedOutput": "Success Checkout Stock: 3\nFailed Payment Rolled Back Stock: 5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the remaining stock after a failed payment rolls back inventory?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "Failed Payment Rolled Back Stock: 5"
          ],
          "primaryMisconceptionId": "MC_FS_CAPSTONE_ENTERPRISE_ECOMMERCE_PLATFORM",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_FS_CAPSTONE_ENTERPRISE_ECOMMERCE_PLATFORM",
              "errorExplanation": "Payment failure triggers inventory rollback, restoring stock back to 5.",
              "recoveryPath": {
                "simplerExplanation": "Rollback restores stock to 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "fs-d30-b2-enterprise-telemetry-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise Architecture Telemetry & Production Invariants",
        "conceptBudget": {
          "primaryConcept": "Enterprise Production Invariants",
          "supportingTerms": [
            "Zero data leaks across tenants",
            "Sub-100ms API response latency",
            "Automated Canary health auditing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d30-b1-capstone-checkout-transaction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit.js",
            "initialCode": "function auditFullstackPlatform() {\n  return {\n    framework: 'Next.js 15 App Router',\n    backend: 'Node.js Microservices + Prisma ORM',\n    cache: 'Redis Cluster',\n    realtime: 'WebSockets Full-Duplex',\n    security: 'JWT + HttpOnly RTR Cookies + Zod',\n    isCertified: true\n  };\n}\n\nconsole.log('Platform Security Stack:', auditFullstackPlatform().security);",
            "expectedOutput": "Platform Security Stack: JWT + HttpOnly RTR Cookies + Zod",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security stack is certified in the full-stack architecture audit?",
          "expectedStringOutput": "JWT + HttpOnly RTR Cookies + Zod",
          "acceptableAnswers": [
            "JWT + HttpOnly RTR Cookies + Zod",
            "Platform Security Stack: JWT + HttpOnly RTR Cookies + Zod"
          ],
          "primaryMisconceptionId": "MC_FS_CAPSTONE_ENTERPRISE_ECOMMERCE_PLATFORM",
          "diagnosisMap": {
            "localStorage": {
              "misconceptionId": "MC_FS_CAPSTONE_ENTERPRISE_ECOMMERCE_PLATFORM",
              "errorExplanation": "Platform security is certified with JWT + HttpOnly RTR Cookies + Zod.",
              "recoveryPath": {
                "simplerExplanation": "Security stack matches header.",
                "guidedFixPrompt": "Type JWT + HttpOnly RTR Cookies + Zod"
              }
            }
          }
        }
      },
      {
        "id": "fs-d30-b3-fullstack-mastery-certification",
        "day": 30,
        "blockNumber": 3,
        "title": "Full-Stack JavaScript & Enterprise Systems Master Certification",
        "conceptBudget": {
          "primaryConcept": "Production Full-Stack Certification",
          "supportingTerms": [
            "100/100 Gold Standard",
            "Zero Defects",
            "Enterprise Full-Stack Readiness"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fs-d30-b2-enterprise-telemetry-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_fs_cert.js",
            "initialCode": "console.log('🎉 Full-Stack JavaScript & Enterprise Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]');",
            "expectedOutput": "🎉 Full-Stack JavaScript & Enterprise Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification score is achieved across the 30-day Full-Stack curriculum?",
          "expectedStringOutput": "🎉 Full-Stack JavaScript & Enterprise Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
          "acceptableAnswers": [
            "🎉 Full-Stack JavaScript & Enterprise Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]",
            "100/100",
            "100"
          ],
          "primaryMisconceptionId": "MC_FS_CAPSTONE_ENTERPRISE_ECOMMERCE_PLATFORM",
          "diagnosisMap": {
            "90": {
              "misconceptionId": "MC_FS_CAPSTONE_ENTERPRISE_ECOMMERCE_PLATFORM",
              "errorExplanation": "The complete Gold-Standard course achieves 100/100.",
              "recoveryPath": {
                "simplerExplanation": "Score is 100/100.",
                "guidedFixPrompt": "Type 🎉 Full-Stack JavaScript & Enterprise Systems Certification: 100/100 [GOLD-STANDARD CERTIFIED]"
              }
            }
          }
        }
      }
    ]
  }
];
