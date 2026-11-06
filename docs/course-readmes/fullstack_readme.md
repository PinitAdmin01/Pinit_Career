# Full-Stack JavaScript Engineering — 30-Day Masterclass Curriculum

This comprehensive document outlines the daily curriculum roadmap for the **Full-Stack JavaScript Engineering (30-Day Masterclass)** course in PinIT Career OS, detailing every lecture topic, coding challenge, and test suite.

---

## 💻 Course Overview
* **Name**: Full-Stack JavaScript Engineering
* **ID**: `course-fullstack-js`
* **Duration**: 30 Days (4 Weeks)
* **Target Audience**: Full-Stack Developers / Backend SDEs / JavaScript Programmers
* **Learning Interface**: API routes tables, middleware pipelines sheets, SQL databases schemas, and network response logs.
* **Evaluation Sandbox**: Express testing engines checking route slashes collapses, authorization Bearer headers, book registration payloads JSON keys, SQL dynamic query strings, JWT signing headers, response status code categories, and compliance metrics audits.

---

## 📅 Detailed Day-by-Day Syllabus

### 💻 Week 1: Environment Configurations, Express APIs & Midddlewares

#### 🟢 Day 1: Modern JS Runtime & Environment Configurations
* **Lecture Syllabus**:
  - Node.js runtime environment and engine variables
  - Managing process.env variables parameters
  - Clean repository deployments configurations
* **Status**: Lecture Only (No coding exams or assignments for Day 1 to build core conceptual memory).

#### 🟢 Day 2: Asynchronous Workflows & Exception Handlers
* **Lecture Syllabus**:
  - Asynchronous execution loops (Promises, Async/Await)
  - Error throwing and exception catch patterns
  - Managing asynchronous flow timeouts constraints
* **Status**: Lecture Only (No coding exams or assignments for Day 2).

#### 🟢 Day 3: Express API Routers & Request Path Sanitizers
* **Lecture Syllabus**:
  - RESTful API routing principles
  - Handling URL request paths slashes
  - Chaining request routers middlewares
* **Coding Exam**: `fullstack-basics-exam-day-3` (`sanitizePath`)
  - **Task**: Write a JS function `sanitizePath(path)` collapsing duplicate adjacent slashes in URL requests paths.
  - **Test**: `sanitizePath('/api//users') === '/api/users'`.
* **Coding Assignment**: `fullstack-basics-assign-day-3` (`hasPathPrefix`)
  - **Task**: Write a JS function `hasPathPrefix(path, prefix)` checking endpoint namespaces.
  - **Test**: Returns true if prefix matches.

#### 🟢 Day 4: Express Middleware: Authentication token checkers
* **Lecture Syllabus**:
  - Express middleware functions signatures (req, res, next)
  - Validating headers authorization keys
  - Error statuses returns configurations
* **Coding Exam**: `fullstack-basics-exam-day-4` (`validateAuthHeader`)
  - **Task**: Write a JS function `validateAuthHeader(authHeader)` checking header token sizes.
  - **Test**: Rejects keys lacking 'Bearer ' prefix or under 10 chars.
* **Coding Assignment**: `fullstack-basics-assign-day-4` (`isOriginOk`)
  - **Task**: Write a JS function `isOriginOk(origin, whitelist)` checking request CORS domains.
  - **Test**: Verifies whitelist inclusions.

#### 🟢 Day 5: REST APIs: JSON request body validator
* **Lecture Syllabus**:
  - Express body parsers configurations
  - JSON properties types audits
  - Returning status code 400 bad requests
* **Coding Exam**: `fullstack-basics-exam-day-5` (`isValidBookPayload`)
  - **Task**: Write a JS function `isValidBookPayload(payload)` checking book registration fields.
  - **Test**: Enforces non-empty title and non-negative stock.
* **Coding Assignment**: `fullstack-basics-assign-day-5` (`trimPayloadStr`)
  - **Task**: Write a JS function `trimPayloadStr(str)` sanitizing string values.
  - **Test**: Trims whitespace with null fallback.

#### 🟢 Day 6: Database Integrations: SQL schema migration maps
* **Lecture Syllabus**:
  - Relational table schemas creation
  - Primary key and auto-increment indices
  - Column data constraints validation
* **Coding Exam**: `fullstack-basics-exam-day-6` (`isTableSchemaSafe`)
  - **Task**: Write a JS function `isTableSchemaSafe(tableConfig)` verifying column parameters.
  - **Test**: Confirms primaryKey is set to 'id'.
* **Coding Assignment**: `fullstack-basics-assign-day-6` (`isColumnTypeAllowed`)
  - **Task**: Write a JS function `isColumnTypeAllowed(type)` checking database formats.
  - **Test**: Limits types to TEXT, INTEGER, or BOOLEAN.

#### 🟢 Day 7: SQL Query Builders: Dynamic book database search
* **Lecture Syllabus**:
  - SQL WHERE filter clause assemblies
  - Parameterizing search string inputs
  - Limiting search query results lists
* **Coding Exam**: `fullstack-basics-exam-day-7` (`buildBookSearchQuery`)
  - **Task**: Write a JS function `buildBookSearchQuery(titleQuery, minStock)` constructing database SQL.
  - **Test**: Assembles LIKE conditions and stock limit thresholds.
* **Coding Assignment**: `fullstack-basics-assign-day-7` (`formatWildcard`)
  - **Task**: Write a JS function `formatWildcard(str)` formatting search criteria.
  - **Test**: Appends '%' wildcards tags.

---

### 💻 Week 2: Token Security, Endpoint tests & compliance Audits

#### 🟢 Day 8: Authentication APIs: JWT token signers
* **Lecture Syllabus**:
  - JWT token claims configurations
  - Signing keys parameters and salts
  - Token encryption durations checks
* **Coding Exam**: `fullstack-basics-exam-day-8` (`buildJwtHeader`)
  - **Task**: Write a JS function `buildJwtHeader(alg)` building token header objects.
  - **Test**: Returns stringified JSON containing alg and typ.
* **Coding Assignment**: `fullstack-basics-assign-day-8` (`getJwtExpiryEpoch`)
  - **Task**: Write a JS function `getJwtExpiryEpoch(durationSec, current)` setting token expiries.
  - **Test**: Sums timestamp offsets.

#### 🟢 Day 9: API testing: Endpoint status checks
* **Lecture Syllabus**:
  - Testing HTTP endpoint statuses
  - Parsing body assertions properties
  - Exception logging checking mechanisms
* **Coding Exam**: `fullstack-basics-exam-day-9` (`isResponseSuccess`)
  - **Task**: Write a JS function `isResponseSuccess(res)` verifying request success.
  - **Test**: Confirms status is between 200 and 299.
* **Coding Assignment**: `fullstack-basics-assign-day-9` (`isClientErrorCode`)
  - **Task**: Write a JS function `isClientErrorCode(status)` identifying client errors.
  - **Test**: Maps status between 400 and 499.

#### 🟢 Day 10: Final Capstone: Library API compliance audit
* **Lecture Syllabus**:
  - API route tables compliance scans
  - Authorization header checks validation
  - SQL parameter injection scans
* **Coding Exam**: `fullstack-basics-exam-day-10` (`evaluateFullstackApi`)
  - **Task**: Write a JS function `evaluateFullstackApi(report)` auditing API build compliance.
  - **Test**: Checks authentication headers, payload security, and queries parameters in report.
* **Coding Assignment**: `fullstack-basics-assign-day-10` (`getAuditStatus`)
  - **Task**: Write a JS function `getAuditStatus(warningsCount)` scoring audit compliance.
  - **Test**: Compares warning counts bounds.

---

### 💻 Week 3: Applied Fullstack Development & Release Reviews

#### 🟢 Day 11: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 12: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 13: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 14: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

---

### 💻 Week 4: Applied Fullstack Development & Release Reviews (Review)

#### 🟢 Day 15: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 16: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 17: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 18: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 19: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 20: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 21: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 22: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 23: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 24: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 25: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 26: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 27: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 28: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 29: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Reviewing Express path boundaries
  - Assembling API compliance checklists
  - Verifying SQL query configurations
* **Status**: Lecture Only (Capstones pipeline review).

#### 🟢 Day 30: Library API compliance audit (Review)
* **Lecture Syllabus**:
  - Assemble final fullstack JavaScript API deployment and code audit report
  - Verify Express path sanitizers and auth middlewares headers validators
  - Confirm database SQL dynamic query builders and JSON request body payloads checkers
* **Status**: Lecture Only (Final day capstone audit checklist review).

---
*Created by Antigravity*
