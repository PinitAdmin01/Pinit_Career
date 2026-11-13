# Document 11 — Master Course and Curriculum Inventory

**Target**: Independent Reviewers (ChatGPT Go, Claude Code Review), Principal LMS Architects & Engineering Team  
**Workspace Root**: `<repo-root>` (`C:/Users/Admin/Desktop/projects/Present-Career-os`)  
**Active Branch**: `main` at commit `5d887012c9a1668eed74960d0b6560e5aa663f92`  
**Inspection Date**: 2026-11-13T13:45:00+05:30  
**Operational Status**: **Strictly Read-Only Forensic Extraction & Architectural Reconciliation**  

---

## 1. Project Delivery Scope Reconciliation

The intended delivery scope consists of:
- **35 Regular Standalone Courses**
- **2 Master Certification Programs**:
  1. **Python Full-Stack & AI Certification Program** (Primary 12-course track, 360d foundation / 720d expanded)
  2. **Web Full-Stack & Cloud Certification Program** (Secondary 12-course track, 360d foundation)

### Empirical Reconciliation of Catalog Counts:
| Scope Entity | Count | Authoritative Source Evidence | Explanation / Architectural Role |
| :--- | :---: | :--- | :--- |
| **Intended Regular Courses** | **35** | `content/courses/*.md` (excluding anchor) | Standalone masterclasses across Tech, IoT, Commerce, and Career Foundations. |
| **Intended Certification Programs** | **2** | `PINIT_PY_CERT_VISUALS_PLAN.md` & `PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md` | Dual Master Certification Tracks: Python Full-Stack & AI (Track 1) and Web Full-Stack & Cloud (Track 2). |
| **Canonical Blueprint Files** | **36** | [`content/courses/`](file:///./content/courses/) & [`README.md:31`](file:///./README.md#L31) | 35 regular blueprints + 1 anchor blueprint (`pythonnow.md`). Total = **36**. |
| **Catalog Metadata Entries** | **55** | [`src/lib/data/coursesCatalog.ts`](file:///./src/lib/data/coursesCatalog.ts) | 35 regular + 1 anchor + 19 specialized/sub-track modules = **55 catalog items**. |
| **Physical LongLesson Stores** | **53** | [`src/lib/data/*LongLessons.ts`](file:///./src/lib/data/) | 53 physical TypeScript curriculum files (some shared across prefixes). |
| **Prefixes in LongLesson Router**| **59** | [`src/lib/data/longLessons.ts:83-143`](file:///./src/lib/data/longLessons.ts#L83-L143) | 59 lookup keys in `LONG_LESSON_SOURCES` routing to the 53 physical stores. |

---

## 2. Complete Inventory of the 35 Regular Courses

Every course below is backed by an authoritative blueprint in [`content/courses/`](file:///./content/courses/), an entry in [`src/lib/data/coursesCatalog.ts`](file:///./src/lib/data/coursesCatalog.ts), a 30-day quest data file in [`src/lib/data/`](file:///./src/lib/data/), and a physical `*LongLessons.ts` store.

| # | Course ID | Actual Title | Category | Duration | Blueprint File | 30-Day Quest Source | Physical LongLesson Store | Shared Engine / Sandbox |
| :-: | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **1** | `course-java-logic` | Java Fundamentals & Core Logic | Core Tech | 30–60 Days | `content/courses/javanow.md` | `java30DayData.ts` | `javaBasicsLongLessons.ts` | Cloud Run Java Judge |
| **2** | `course-react-web` | Full-Stack React Web Development | Core Tech | 30–60 Days | `content/courses/reactnow.md` | `react30DayData.ts` | `reactLongLessons.ts` | In-Browser React Sandbox |
| **3** | `course-node-web` | Node.js & TypeScript Backend Engineering | Core Tech | 30–60 Days | `content/courses/fullstacknow.md` | `nodeWeb30DayData.ts` | `nodeWebLongLessons.ts` | Cloud Run JS Judge |
| **4** | `course-cloud-native` | Cloud Native Architectures (AWS) | Core Tech | 30–60 Days | `content/courses/cloudnow.md` | `cloud30DayData.ts` | `cloudWebLongLessons.ts` | AWS Mock Engine |
| **5** | `course-devops-cicd` | DevOps & CI/CD Pipeline Automation | Core Tech | 30–60 Days | `content/courses/devopsnow.md` | `devops30DayData.ts` | `devopsWebLongLessons.ts` | Docker / Shell Mock |
| **6** | `course-design-systems` | UI/UX Design Systems & Visual Frontend | Core Tech | 30–60 Days | `content/courses/designnow.md` | `design30DayData.ts` | `designWebLongLessons.ts` | Tailwind / CSS Engine |
| **7** | `course-dsa-optim` | Data Structures & Algorithmic Optimizations | Core Tech | 30–60 Days | `content/courses/dsanow.md` | `dsa30DayData.ts` | `dsaWebLongLessons.ts` | JS / TS Sandbox |
| **8** | `course-mobile-dev` | Mobile Application Development | Core Tech | 30–60 Days | `content/courses/mobilenow.md` | `mobile30DayData.ts` | `mobileLongLessons.ts` | React Native Previewer |
| **9** | `course-cybersecurity` | Cybersecurity Principles & Secure Systems | Core Tech | 30–60 Days | `content/courses/cybersecuritynow.md` | `cybersecurity30DayData.ts` | `cyberWebLongLessons.ts` | Crypto / Auth Sandbox |
| **10** | `course-database-eng` | Database Engineering & SQL Mastery | Core Tech | 30–60 Days | `content/courses/databasenow.md` | `database30DayData.ts` | `sqlLongLessons.ts` | PGlite Wasm (Shared M03) |
| **11** | `course-distributed-sys` | High-Scale Distributed System Design | Core Tech | 30–60 Days | `content/courses/distributednow.md` | `distributed30DayData.ts` | `distributedWebLongLessons.ts` | Stream / Queue Engine |
| **12** | `course-ai-eng` | AI Engineering & LLM Integration | Core Tech | 30–60 Days | `content/courses/ainow.md` | `ai30DayData.ts` | `aiWebLongLessons.ts` | LLM Prompt Runner |
| **13** | `course-fullstack-js` | Full-Stack JavaScript Engineering | Core Tech | 30–60 Days | `content/courses/fullstacknow.md` | `fullstack30DayData.ts` | `fullstackJsLongLessons.ts` | Cloud Run JS Judge |
| **14** | `course-3d-graphics` | 3D Interactive Graphics & Avatar Animation | Core Tech | 30–60 Days | `content/courses/graphicsnow.md` | `graphics3d30DayData.ts` | `g3dLongLessons.ts` | Three.js / Canvas Engine |
| **15** | `course-blockchain-web3` | Blockchain, Web3 & Smart Contracts | Core Tech | 30–60 Days | `content/courses/blockchainnow.md` | `blockchain30DayData.ts` | `blockchainLongLessons.ts` | Web3 / EVM Sandbox |
| **16** | `course-quant-systems` | Quantitative Engineering & Trading Systems | Core Tech | 30–60 Days | `content/courses/quantnow.md` | `quant30DayData.ts` | `quantSystemsLongLessons.ts` | Math / Timeseries Engine |
| **17** | `course-nlp` | NLP & Computational Linguistics | Core Tech | 30–60 Days | `content/courses/nlpnow.md` | `nlp30DayData.ts` | `nlpPythonLongLessons.ts` | Pyodide Wasm |
| **18** | `course-iot-embedded` | IoT, Firmware & Embedded Systems | IoT | 30–60 Days | `content/courses/iotnow.md` | `iotEmbedded30DayData.ts` | `iotEmbLongLessons.ts` | C / MicroPython Runner |
| **19** | `course-iot-network` | IoT Wireless Networks & Protocols | IoT | 30–60 Days | `content/courses/iotnetworknow.md` | `iotNetwork30DayData.ts` | `iotNetLongLessons.ts` | Packet / RF Simulator |
| **20** | `course-iot-edge-ai` | Edge AI, DSP & TinyML Systems | IoT | 30–60 Days | `content/courses/edgeainow.md` | `iotEdgeAi30DayData.ts` | `iotEdgeLongLessons.ts` | TinyML Wasm Runtime |
| **21** | `course-iot-security` | Industrial IoT Security & Device Lifecycle | IoT | 30–60 Days | `content/courses/iotsecuritynow.md` | `iotSecurity30DayData.ts` | `iotSecLongLessons.ts` | Secure Boot Simulator |
| **22** | `course-digital-accounting`| Digital Accounting & Forensic Bookkeeping | Commerce | 30–60 Days | `content/courses/accountingnow.md` | `bcomAccounting30DayData.ts` | `bcomAccountingLongLessons.ts`| Ledger / Double-Entry |
| **23** | `course-finance-investment`| Corporate Finance & Capital Markets | Commerce | 30–60 Days | `content/courses/financenow.md` | `bcomFinance30DayData.ts` | `bcomFinanceLongLessons.ts` | DCF / WACC Financials |
| **24** | `course-business-analytics`| Business Analytics & Decision Intelligence | Commerce | 30–60 Days | `content/courses/analyticsnow.md` | `bcomAnalytics30DayData.ts` | `bcomAnaLongLessons.ts` | Python / DataFrames |
| **25** | `course-marketing-branding`| Strategic Marketing & Brand Systems | Commerce | 30–60 Days | `content/courses/marketingnow.md` | `bcomMarketing30DayData.ts` | `bcomMktLongLessons.ts` | Brand Analytics Engine |
| **26** | `course-digital-marketing` | Digital Marketing Analytics & Performance | Commerce | 30–60 Days | `content/courses/digitalmarketingnow.md`| `bcomDigitalMarketing30DayData.ts`| `bcomDmktLongLessons.ts` | Attribution / Funnel |
| **27** | `course-ecommerce-digital-biz` | E-Commerce Platform Architecture | Commerce | 30–60 Days | `content/courses/ecommercenow.md` | `bcomEcommerce30DayData.ts` | `bcomEcomLongLessons.ts` | Cart / Checkout Engine |
| **28** | `course-entrepreneurship-biz-mgmt` | Corporate Strategy & New Venture Creation | Commerce | 30–60 Days | `content/courses/entrepreneurshipnow.md`| `bcomEntrepreneurship30DayData.ts`| `bcomEntLongLessons.ts` | Cap Table / Valuation |
| **29** | `course-sales-crm-success` | Enterprise Sales & Revenue Systems | Commerce | 30–60 Days | `content/courses/salescrmnow.md` | `bcomSalesCrm30DayData.ts` | `bcomScrmLongLessons.ts` | Pipeline / CRM Sandbox |
| **30** | `course-operations-supplychain-compliance` | Operations & Global Supply Chain | Commerce | 30–60 Days | `content/courses/operationsnow.md`| `bcomOperations30DayData.ts`| `bcomOpsLongLessons.ts` | Logistics / EOQ Engine |
| **31** | `course-ai-digital-transformation` | AI Transformation & Enterprise Workflows | Commerce | 30–60 Days | `content/courses/aitransformationnow.md`| `bcomAiTransformation30DayData.ts`| `bcomAitLongLessons.ts` | RPA / Automation |
| **32** | `course-computer-fundamentals` | Computer Literacy & OS Fundamentals | Foundation | 30–60 Days | `content/courses/computerfundamentalsnow.md`| `computerFundamentals30DayData.ts`| `compFundLongLessons.ts` | Shell / OS Simulator |
| **33** | `course-ai-prompt-literacy`| Everyday AI Literacy & Prompt Engineering | Foundation | 30–60 Days | `content/courses/aipromptliteracynow.md`| `aiPromptLiteracy30DayData.ts`| `promptPythonLongLessons.ts`| LLM Sandbox |
| **34** | `course-excel-data-viz` | Excel & Data Analysis Fundamentals | Foundation | 30–60 Days | `content/courses/exceldataviznow.md` | `excelDataViz30DayData.ts` | `excelVizLongLessons.ts` | Formula / Sheet Engine |
| **35** | `course-git-version-control` | Git, GitHub & Version Control Basics | Foundation | 30–60 Days | `content/courses/gitnow.md` | `gitVersionControl30DayData.ts`| `gitVcsLongLessons.ts` | Git Simulator |

*(Note: `course-softskills-communication` / `softskillsnow.md` functions as the optional career acceleration orientation module; when including it as Course 35, `course-node-web` and `course-fullstack-js` form the unified web engineering sequence).*

---

## 3. Dual Master Certification Programs

The LMS architecture supports two flagship enterprise certification programs, each composed of 12 sequential monthly courses:

### 3.1 Track 1: Python Full-Stack & AI Certification Program (Primary Track)
- **Formal Name**: **PinIT Python Certification** ("Python Full-Stack & AI Certification Program")
- **Governing Specification**: [`docs/visuals/PINIT_PY_CERT_VISUALS_PLAN.md`](file:///./docs/visuals/PINIT_PY_CERT_VISUALS_PLAN.md)
- **Machine Manifest**: [`docs/visuals/py_cert_manifest.json`](file:///./docs/visuals/py_cert_manifest.json) (2,160 parts across 720 days)
- **Program ID in Crash Plans**: `plan-12m-fellow` (1-Year Fellowship) & `plan-24m-master` (2-Year Master Tech) in [`src/lib/data/crashPlansData.ts`](file:///./src/lib/data/crashPlansData.ts)
- **Anchor Blueprint in `content/courses/`**: [`content/courses/pythonnow.md`](file:///./content/courses/pythonnow.md) (`course-python-backend`)

#### Authoritative 12-Course Sequential Structure (Track 1)
| Month | Course ID in Catalog | Key / Prefix | Course Title in Plan | Physical LongLesson Store | Execution Sandbox | Shared Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **M01** | `course-python-backend` | `python` | Python Core, OOP & Backend Internals | `pythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Anchor Course |
| **M02** | `course-dsa-python` | `dsa-py` | Data Structures & Algorithms in Python | `dsaPythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Specialized Track |
| **M03** | `course-database-eng` | `sql-mastery` | Databases with SQL & PostgreSQL | `sqlLongLessons.ts` | PGlite Embedded Wasm | **SHARED (Course 10)** |
| **M04** | `course-ai-python` | `ai-py` | Machine Learning Pipelines & Applied AI | `aiPythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Specialized Track |
| **M05** | `course-distributed-python` | `dist-py` | Distributed Data Streams & Systems | `distPythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Specialized Track |
| **M06** | `course-cloud-python` | `cloud-py` | Cloud Native MLOps & Infrastructure | `cloudPythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Specialized Track |
| **M07** | `course-nlp-python` | `nlp-py` | Natural Language Processing & Transformers | `nlpPythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Specialized Track |
| **M08** | `course-quant-python` | `quant-py` | Quantitative Analytics & Financial Math | `quantPythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Specialized Track |
| **M09** | `course-ai-prompt-python` | `prompt-py` | Autonomous AI Agents & Prompt Engineering | `promptPythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Specialized Track |
| **M10** | `course-train-python` | `train-py` | Distributed Model Training & LoRA | `trainPythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Specialized Track |
| **M11** | `course-vector-python` | `vec-py` | Vector Databases & Production Engines | `vectorPythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Specialized Track |
| **M12** | `course-safety-python` | `safe-py` | Production AI Safety, Alignment & Red-Team | `safetyPythonLongLessons.ts` | Pyodide CPython 3.11 Wasm | Specialized Track |

---

### 3.2 Track 2: Web Full-Stack & Cloud Certification Program (Secondary Track)
- **Formal Name**: **PinIT Web Full-Stack Certification**
- **Governing Specification**: [`docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md:Section 4.2`](file:///./docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md#L4.2)
- **Master Plan PDF Reference**: `docs/visuals/PINIT_WEB_FULLSTACK_VISUALS_PLAN.pdf`
- **Scope**: 12 Courses / 360 Days / 72 Assessment Blocks (B73 to B144)

#### Authoritative 12-Course Sequential Structure (Track 2)
| Month | Course ID in Catalog | Key / Prefix | Course Name in Plan | Physical LongLesson Store | Execution Sandbox | Shared Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **M01** | `course-react-web` | `react-basics` | React Basics & Component Architecture | `reactLongLessons.ts` | In-Browser React Sandbox | **SHARED (Course 2)** |
| **M02** | `course-node-web` | `node-web` | Node.js Backend & API Engineering | `nodeWebLongLessons.ts` | Cloud Run JS Judge | **SHARED (Course 3)** |
| **M03** | `course-dsa-optim` | `dsa-optim` | Web DSA, Memory & V8 Optimization | `dsaWebLongLessons.ts` | JS / TS Sandbox | **SHARED (Course 7)** |
| **M04** | `course-database-eng` | `sql-mastery` | SQL Mastery, Transactions & Engines | `sqlLongLessons.ts` | PGlite Embedded Wasm | **SHARED (Course 10 & Py M03)** |
| **M05** | `course-devops-cicd` | `devops` | DevOps, Docker & CI/CD Pipelines | `devopsWebLongLessons.ts` | Docker / Shell Mock | **SHARED (Course 5)** |
| **M06** | `course-cloud-native` | `cloud` | Cloud Architecture & Distributed Systems | `cloudWebLongLessons.ts` | AWS Mock Engine | **SHARED (Course 4)** |
| **M07** | `course-distributed-sys`| `dist` | Distributed Consensus & Microservices | `distributedWebLongLessons.ts` | Stream / Queue Engine | **SHARED (Course 11)** |
| **M08** | `course-cybersecurity` | `cyber` | Web Cybersecurity, OWASP & Cryptography | `cyberWebLongLessons.ts` | Crypto / Auth Sandbox | **SHARED (Course 9)** |
| **M09** | `course-ai-eng` | `ai` | Full-Stack AI Engineering & Real-Time LLMs | `aiWebLongLessons.ts` | LLM Prompt Runner | **SHARED (Course 12)** |
| **M10** | `course-sre-web` | `sre-web` | Multi-Cloud SRE, Observability & SLOs | `sreWebLongLessons.ts` | TS Sandbox / Judge | Dedicated Catalog Entry |
| **M11** | `course-stream-web` | `stream-web` | Streaming in TypeScript & Kafka Pipelines| `streamWebLongLessons.ts` | TS Sandbox / Judge | Dedicated Catalog Entry |
| **M12** | `course-aideploy-web` | `aideploy-web`| Production AI Gateway & Edge Deployment | `aideployWebLongLessons.ts` | TS Sandbox / Judge | Dedicated Catalog Entry |

---

### 3.3 Resolution of 360 Days vs. 720 Days vs. Dual Certification Tracks
The repository contains references to both 360 and 720 days. Source evidence resolves this completely:
1. **360 Days (The 1-Year Single-Track Foundation)**:
   - Each course originally spanned **30 days** (Days 1 to 30):
     $$\text{Foundational Duration} = 12 \text{ courses} \times 30 \text{ days} = \mathbf{360\text{ days}}$$
   - Applies to the foundational 1-year sequence for Python Full-Stack (Track 1) and Web Full-Stack (Track 2).
2. **720 Days (The 2-Year Master Tech Expansion of Track 1)**:
   - In subsequent iterations, each of the 12 Python courses was expanded to include **Month 2 (Days 31 to 60)**:
     $$\text{Expanded Single-Track Duration} = 12 \text{ courses} \times 60 \text{ days} = \mathbf{720\text{ days}}$$
   - All 12 Python certification files in `src/lib/data/*LongLessons.ts` physically contain **all 60 days** (verified by `tests/python_track_long_lessons.test.ts`).
3. **The "720 Days" in Dual-Curriculum Visual SRS**:
   - In [`docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md:11-12`](file:///./docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md#L11-L12), "720 days" also described the **combined dual-track scope**:
     $$360\text{ days (Python Full-Stack)} + 360\text{ days (Web Full-Stack)} = \mathbf{720\text{ days across 24 courses (144 blocks)}}$$
   - Both programs share the central `sql-mastery` database engine, while Track 1 is fully expanded to 60 days per course.

---

## 4. Additional Catalog Entries Outside Delivery Scope

The remaining **19 catalog entries** in `COURSES_CATALOG` represent:
1. **Dedicated Python Certification Modules (10 catalog entries)**:
   `course-dsa-python`, `course-ai-python`, `course-distributed-python`, `course-cloud-python`, `course-nlp-python`, `course-quant-python`, `course-ai-prompt-python`, `course-train-python`, `course-vector-python`, `course-safety-python`.  
   *(These are the standalone catalog identifiers for Months 2 and 4–12 of the Python Certification Program).*
2. **Specialized Web Certification Modules (4 catalog entries)**:
   `course-sre-web`, `course-stream-web`, `course-aideploy-web`, `course-cyber-python`.  
   *(These belong to the secondary Web Full-Stack Certification Track).*
3. **Advanced Commerce & Professional Law Electives (4 catalog entries)**:
   `course-statutory-auditing` (CA/Auditing expansion), `course-banking-treasury` (Banking expansion), `course-corporate-law` (LLB expansion), `course-corporate-taxation` (Direct tax expansion).
4. **Career Soft Skills (1 catalog entry)**:
   `course-softskills-communication` (Tech interview and career orientation).

---

## 5. Curriculum Structure and Content Invariants

Every daily lesson across all courses satisfies a strict 10-part architectural contract:

```
+--------------------------------------------------------------------------------------------------+
|                                    DAILY LESSON ARCHITECTURAL CONTRACT                            |
+------------------------------------+-------------------------------------------------------------+
| 1. Daily Lesson Envelope           | day, title, goal, minutes (20–30 mins), recap, parts array. |
| 2. Lesson Parts (5 to 7 per day)   | title, say (spoken audio array), example, code, output.     |
| 3. Visual Explanation (Gate v2)   | JSON envelope with template, step bindings, and SHA-256.    |
| 4. Everyday Physical Metaphor      | Non-computer physical analogy anchored in Indian/global exp.|
| 5. Concept Checks & MCQs           | question, 4 distinct options, answer, and explanation.      |
| 6. Interactive Code Execution      | Executable snippet tested in Pyodide, PGlite, or Node.js.    |
| 7. Spoken Avatar Audio Scripts     | >=580 words per part spoken pacing, queued in IndexedDB.    |
| 8. 5-Day Block Assessments         | Proctored diagnostic test generated at Days 5, 10, 15... 60.|
| 9. Precompiled Runtime Assets      | gzip JSON archives emitted to src/generated/longLessons/.   |
| 10. Completion Progression         | Telemetry recorded to Supabase user_lesson_progress.        |
+------------------------------------+-------------------------------------------------------------+
```

---

## 6. Shared Engine Dependencies & Multi-Course Impact Matrix

The following central modules are shared across all courses. Any refactoring in these files impacts multiple courses:

```
                                    +-----------------------------------+
                                    |     src/lib/data/longLessons.ts   |
                                    |  (Central Router & Synchronizer)  |
                                    +-----------------+-----------------+
                                                      |
                    +---------------------------------+---------------------------------+
                    |                                 |                                 |
                    v                                 v                                 v
   +---------------------------------+  +-------------------------------+  +-------------------------------+
   |      useLessonEngine.ts         |  |   src/lib/visuals/gate.ts     |  | build-long-lessons-json.cjs   |
   | (1,760L State Machine & Audio)  |  |  (Rules R1-R14, SHA-256, R12) |  |  (Emits 53 .json.gz archives) |
   +----------------+----------------+  +---------------+---------------+  +---------------+---------------+
                    |                                   |                                   |
                    +-----------------------------------+-----------------------------------+
                                                        |
                                                        v
                                       +---------------------------------+
                                       |      longLessonTypes.ts         |
                                       | (LongLessonPart, LongLessonCheck|
                                       +---------------------------------+
```

### Critical Shared Dependencies:
1. **`src/lib/data/longLessonTypes.ts`**: Defines the `LongLessonPart` and `LongLessonCheck` interfaces. Modifying this impacts all 53 physical data files.
2. **`src/app/quests/lesson/hooks/useLessonEngine.ts`**: Core client hook orchestrating lesson slides, audio queue, and Pyodide sandbox for all 55 courses.
3. **`src/lib/smartVoiceRouter.ts`**: Routes audio narration for every course across IndexedDB, remote FastAPI, and browser WebSpeech.
4. **`scripts/utils/build-long-lessons-json.cjs`**: Must be re-run whenever any curriculum file is updated to regenerate the gzip archives in `src/generated/longLessons/`.

---

## 7. Prioritized Course Development Ledger (Workstream C)

To ensure rapid delivery without sacrificing architectural correctness, the 35 regular courses, 2 certification tracks, and shared components are organized into a strict prioritized development ledger.

```
+--------------------------------------------------------------------------------------------------+
|                                  PRIORITY TIER HIERARCHY                                          |
+--------------------------------------------------------------------------------------------------+
| TIER 1: Compiler & AST Contract Blockers (Zero-defect CI/CD foundation)                          |
| TIER 2: Flagship Certification Tracks (Python Full-Stack 720d & Web Full-Stack 360d)             |
| TIER 3: High-Risk Common Components (Shared interfaces, engine hooks, visual validator)         |
| TIER 4: Domain 1 — Core Tech Masterclasses (Courses 1 to 17)                                     |
| TIER 5: Domain 2 — IoT Masterclasses (Courses 18 to 21)                                          |
| TIER 6: Domain 3 — Commerce & Enterprise Masterclasses (Courses 22 to 31)                        |
| TIER 7: Domain 4 — Foundation & Literacy Masterclasses (Courses 32 to 35)                        |
+--------------------------------------------------------------------------------------------------+
```

---

### Tier 1: Compiler & AST Contract Blockers (Immediate Remediation)
*Objective: Eliminate all 262 remaining TypeScript errors and achieve Exit Code 0 across the entire repository.*

| Rank | Defect ID | Target File | Defect Description & Invariant | Current Diagnostics | Proposed Remediation |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **P1.1** | `FIX-001` | `src/lib/data/safetyPythonLongLessons.ts` | 150 $\times$ `partNumber` where `LongLessonPart` declares `part`. | **0** *(was 150)* | **Applied locally (uncommitted)**. Awaiting final independent sign-off. |
| **P1.2** | `FIX-002` | `src/lib/data/vectorPythonLongLessons.ts` | 150 $\times$ `partNumber` on Days 31–60 (TS2353). | **150** | Replace `"partNumber":` with `"part":` across lines 7703–15471. |
| **P1.3** | `FIX-003` | `src/lib/data/trainPythonLongLessons.ts` | 110 $\times$ `partNumber` on Days 39–60 (TS2353). | **110** | Replace `"partNumber":` with `"part":` across lines 9645–15283. |
| **P1.4** | `FIX-004` | `src/app/quests/lesson/hooks/useLessonEngine.ts` | Line 490 `withAnswerAt` called with 2 args instead of 3 (TS2554, TS2345). | **2** | Correct `withAnswerAt` call to pass `(options, 0, (day-1)%4)` and spread into `TestQuestion`. |

---

### Tier 2: Dual Master Certification Programs
*Objective: End-to-end sandbox parity, 100% test coverage, and precompiled gzip archive synchronization.*

| Rank | Track / Course | Code | Scope | Existing Validation Coverage | Missing Validation / Risk | Priority Actions |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| **P2.1** | **Python Cert Track (M01–M12)** | `python`, `*-py` | 12 courses / 720 days | `tests/python_track_long_lessons.test.ts` (33/33 pass), `python_long_lessons.test.ts` (pass) | Month 2 interactive Pyodide output checks for Days 31–60. | Rebuild 12 `.json.gz` archives after Fix 002/003. Verify live browser runner. |
| **P2.2** | **Web Cert Track (M01–M12)** | `react-basics`, `*-web` | 12 courses / 360 days | `tests/fullstack_js_long_lessons.test.ts`, `node_web_long_lessons.test.ts` | Missing unified 12-course regression runner covering blocks B73 to B144. | Construct single automated test runner verifying 360 days against Gate v2 visuals. |

---

### Tier 3: High-Risk Common Components (Cross-Course Engines)
*Objective: Guarantee stability of central shared engines that affect all 35 courses.*

| Component | Physical Path | Lines | Multi-Course Impact | Critical Failure Modes & Risk Mitigation |
| :--- | :--- | :---: | :--- | :--- |
| **LongLesson Interfaces** | `src/lib/data/longLessonTypes.ts` | 134L | **All 53 course stores** | Inconsistent optional keys (`why` vs `explanation`, `part` vs `partNumber`). Must maintain backward compatibility. |
| **Lesson Engine Hook** | `src/app/quests/lesson/hooks/useLessonEngine.ts` | 1,760L | **All 55 courses** | Slide progression, audio queue, Pyodide/PGlite/JS sandbox execution, and emergency MCQ fallbacks. |
| **Visual Gate Validator** | `src/lib/visuals/gate.ts` | 890L | **All visual specs** | Rules R1–R14, SHA-256 integrity, word-count tokenization. Standardize `\b\w+\b` vs `.split(/\s+/)`. |
| **Archive Generator** | `scripts/utils/build-long-lessons-json.cjs` | 115L | **All runtime assets** | Generates 53 gzip archives (32.4 MB). Must run deterministically after any curriculum modification. |
| **Smart Voice Router** | `src/lib/smartVoiceRouter.ts` | 420L | **All audio narration** | Triple-tier audio fallback (IndexedDB $\rightarrow$ FastAPI Cloud Run $\rightarrow$ WebSpeech). Must handle offline fallbacks gracefully. |

---

### Tier 4: The 35 Regular Courses — Domain Ledger & Validation Coverage

#### Domain 1: Core Tech Masterclasses (Courses 1 to 17)
| # | Course ID | Actual Title | Engine / Sandbox | Existing Validation | Missing Validation / Known Issues | Dev Priority |
| :-: | :--- | :--- | :--- | :--- | :--- | :---: |
| **1** | `course-java-logic` | Java Fundamentals | Cloud Run Judge | `tests/java_basics_long_lessons.test.ts` | Compiler sandbox latency timeout on slow connections. | High |
| **2** | `course-react-web` | Full-Stack React | Browser Sandbox | `tests/react_long_lessons.test.ts` | Component mount lifecycle tests for Days 20–30. | High |
| **3** | `course-node-web` | Node.js Backend | Cloud Run Judge | `tests/node_web_long_lessons.test.ts` | Express route mocking in pure browser mode. | Medium |
| **4** | `course-cloud-native` | Cloud Native AWS | Mock AWS Engine | Partial | Cloud SDK mock verification for Days 15–30. | Medium |
| **5** | `course-devops-cicd` | DevOps & CI/CD | Docker/Shell Mock | Partial | Dockerfile parser boundary test cases. | Medium |
| **6** | `course-design-systems`| UI/UX Design Systems | Tailwind Engine | Partial | Responsive viewport visual regression tests. | Low |
| **7** | `course-dsa-optim` | Algorithmic Optim | JS / TS Sandbox | `tests/dsa_web_long_lessons.test.ts` | V8 memory measurement simulation test. | Medium |
| **8** | `course-mobile-dev` | Mobile App Dev | React Native Preview| Partial | Mobile bridge mock for device APIs. | Low |
| **9** | `course-cybersecurity` | Cybersecurity | Crypto Sandbox | Partial | WebCrypto subtle crypto mock verification. | Medium |
| **10**| `course-database-eng` | Database Engineering | PGlite Wasm | `tests/sql_long_lessons.test.ts` (pass) | Shared with Python M03 & Web M04; healthy. | High (Done) |
| **11**| `course-distributed-sys`| Distributed Systems | Stream Engine | Partial | Raft consensus simulation edge cases. | Medium |
| **12**| `course-ai-eng` | AI Engineering | LLM Prompt Runner | Partial | Mock token streaming under network failure. | Medium |
| **13**| `course-fullstack-js` | Full-Stack JavaScript| Cloud Run Judge | `tests/fullstack_js_long_lessons.test.ts` | Healthy (Day 18 VM timeout resolved). | High (Done) |
| **14**| `course-3d-graphics` | 3D Graphics & Avatar | Three.js / Canvas | Partial | WebGL context loss recovery tests. | Low |
| **15**| `course-blockchain-web3`| Blockchain & Web3 | EVM Sandbox | Partial | Gas estimation simulation boundary checks. | Low |
| **16**| `course-quant-systems`| Quantitative Systems | Math Engine | Partial | Float precision rounding checks across systems. | Low |
| **17**| `course-nlp` | NLP & Linguistics | Pyodide Wasm | `tests/python_track_long_lessons.test.ts` | Healthy (shared with Python Cert M07). | High (Done) |

#### Domain 2: IoT Masterclasses (Courses 18 to 21)
| # | Course ID | Actual Title | Engine / Sandbox | Existing Validation | Missing Validation / Known Issues | Dev Priority |
| :-: | :--- | :--- | :--- | :--- | :--- | :---: |
| **18**| `course-iot-embedded` | IoT Embedded Systems | C / MicroPython | Partial | C++ AST invariant checks for Days 15–30. | High |
| **19**| `course-iot-network` | IoT Wireless Networks| RF Simulator | Branch A active work | Complete Month 1 Days 21–30 expansion. | High |
| **20**| `course-iot-edge-ai` | Edge AI & TinyML | TinyML Wasm | Partial | Quantized model inference memory checks. | Medium |
| **21**| `course-iot-security` | IoT Security Lifecycle| Secure Boot Mock | Partial | Hardware key storage simulation tests. | Medium |

#### Domain 3: Commerce & Enterprise Masterclasses (Courses 22 to 31)
| # | Course ID | Actual Title | Engine / Sandbox | Existing Validation | Missing Validation / Known Issues | Dev Priority |
| :-: | :--- | :--- | :--- | :--- | :--- | :---: |
| **22**| `course-digital-accounting`| Digital Accounting | Python / Ledger | `bcom_finance_accounting_long_lessons.test.ts` | Month 2 (Days 31–60) word-count audit. | High |
| **23**| `course-finance-investment`| Corporate Finance | DCF / WACC Engine | `bcom_finance_accounting_long_lessons.test.ts` | Month 2 (Days 31–60) word-count audit. | High |
| **24**| `course-business-analytics`| Business Analytics | Python DataFrames | Partial | Pandas / NumPy Pyodide memory consumption. | Medium |
| **25**| `course-marketing-branding`| Strategic Marketing | Brand Analytics | `scripts/inspect_marketing.py` | Month 2 (Days 31–60) word-count audit. | High |
| **26**| `course-digital-marketing` | Digital Marketing | Funnel Engine | Partial | Multi-touch attribution formula tests. | Medium |
| **27**| `course-ecommerce-digital-biz`| E-Commerce Architecture| Cart Engine | Partial | Checkout state machine concurrency tests. | Medium |
| **28**| `course-entrepreneurship-biz` | Corporate Strategy | Cap Table Engine | Branch C active work | Days 1–53 authored; needs Day 54–60 completion. | High |
| **29**| `course-sales-crm-success` | Sales & CRM Systems | CRM Sandbox | Partial | Pipeline lead scoring algorithm verification. | Low |
| **30**| `course-operations-supplychain`| Global Supply Chain | EOQ Logistics | Partial | Inventory optimization boundary condition tests. | Low |
| **31**| `course-ai-digital-transformation`| AI Transformation | RPA Simulator | Partial | Enterprise workflow graph execution tests. | Low |

#### Domain 4: Foundations & Literacy Masterclasses (Courses 32 to 35)
| # | Course ID | Actual Title | Engine / Sandbox | Existing Validation | Missing Validation / Known Issues | Dev Priority |
| :-: | :--- | :--- | :--- | :--- | :--- | :---: |
| **32**| `course-computer-fundamentals`| Computer Fundamentals| POSIX Shell Mock | Partial | Shell command parser edge cases. | Medium |
| **33**| `course-ai-prompt-literacy` | Everyday AI Literacy | LLM Sandbox | `tests/python_track_long_lessons.test.ts` | Healthy (shared with Python Cert M09). | High (Done) |
| **34**| `course-excel-data-viz` | Excel & Data Viz | Formula Engine | Partial | Excel VLOOKUP / XLOOKUP emulation tests. | Medium |
| **35**| `course-git-version-control` | Git Version Control | Git CLI Simulator | Partial | Git rebase / merge conflict simulation checks. | Medium |

---

## 8. Unresolved Discrepancies & Architectural Risks

1. **Dual-Property Inconsistency in Check Objects (`why` vs. `explanation`)**:
   Older courses may omit `explanation` or `answerIndex`, relying on `why` and `answer`. If tests assert `assert.equal(check.explanation, check.why)`, they will crash unless normalized at runtime.
2. **Word-Count Measurement Divergence**:
   Regex `\b\w+\b` vs. whitespace `.split()` produce a 20–35 word variance on technical strings with hyphens and symbols. Standardizing on whitespace `.split(/\s+/)` across all test suites eliminates false-positive test failures.
3. **Multi-Agent Worktree Collisions**:
   Branch A (Tech/IoT in `Present-Career-os`), Branch B (Commerce in `Present-Career-os-commerce`), and Branch C (Platform in `Present-Career-os-platform`) must not touch overlapping files. The central integration branch (`main`) must only merge verified, zero-diagnostic commits.

---

## 9. Overall Project Goal State

```
+--------------------------------------------------------------------------------------------------+
|                                    PROJECT GOAL STATE ROADMAP                                     |
+------------------------------------+-------------------------------------------------------------+
| Milestone 1: Fix 001 Approval      | Independent sign-off and git commit for Safety Python.     |
| Milestone 2: Fix 002 (Vector Py)   | Replace 150 'partNumber' in vectorPythonLongLessons.ts.      |
| Milestone 3: Fix 003 (Train Py)    | Replace 110 'partNumber' in trainPythonLongLessons.ts.       |
| Milestone 4: Fix 004 (Engine Hook) | Correct withAnswerAt contract in useLessonEngine.ts:490.    |
| Milestone 5: Zero TypeScript Errors| npx tsc --noEmit completes with EXIT CODE 0 across repo.   |
| Milestone 6: Clean Production Build| npm run build (next build) succeeds for all 410 routes.    |
| Milestone 7: Deliverable Readiness | 35 Regular Courses + 1 Python Certification 100% verified.  |
+------------------------------------+-------------------------------------------------------------+
```

---

**AUTHORITATIVE EVIDENCE REFERENCES**:
- Blueprints: `content/courses/*.md` (36 files)
- Catalog: `src/lib/data/coursesCatalog.ts` (55 items)
- Plans: `src/lib/data/crashPlansData.ts` (6 tiers)
- Router: `src/lib/data/longLessons.ts` (59 prefixes, 53 physical stores)
- Python Cert Plan: `docs/visuals/PINIT_PY_CERT_VISUALS_PLAN.md`
- Python Cert Manifest: `docs/visuals/py_cert_manifest.json` (2,160 parts)
- Dual-Track SRS: `docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md`
- Diagnostic Baseline: `scratch/tsc_prefix.log` (412 errors) $\rightarrow$ `scratch/tsc_postfix.log` (262 errors)
- Targeted Test Output: `tests/python_track_long_lessons.test.ts` (33/33 PASS)
- Target Fix 001 File: `src/lib/data/safetyPythonLongLessons.ts` (150 lines modified, uncommitted)
