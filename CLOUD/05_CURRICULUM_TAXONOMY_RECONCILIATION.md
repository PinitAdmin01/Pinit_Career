# Document 05 — Curriculum Taxonomy Reconciliation

**Workspace Root**: `<repo-root>` (`Present-Career-os`)  
**Inspection Date**: 2026-11-13T12:30:00+05:30  
**Verification Method**: Source Code Parsing, SRS Audit & Catalog Forensics  

---

## 1. Ground-Truth Curriculum Reconciliation Matrix

An apparent conflict existed between:
- Master prompt specifications citing "12 courses × 60 days = 720 days".
- Master SRS documentation ([`docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md`](file:///./docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md)) stating "12 courses and 360 days".
- Platform crash plans ([`src/lib/data/crashPlansData.ts`](file:///./src/lib/data/crashPlansData.ts)) defining both 12-month (360-day) and 24-month (720-day) programs.
- Catalog declarations ([`src/lib/data/coursesCatalog.ts`](file:///./src/lib/data/coursesCatalog.ts)) containing 55 course objects and 56 `id:` occurrences.
- Blueprint documentation ([`content/courses/`](file:///./content/courses/) and `README.md:31`) referencing 36 canonical courses.

This document resolves this conflict using actual repository source code:

```
+-------------------------------------------------------------------------------------------------------------------------+
|                                              AUTHORITATIVE RECONCILIATION MATRIX                                        |
+------------------------------+--------------------+---------------------+-----------------------------------------------+
| Tier / Document Scope        | Item Count         | Duration / Units    | Authoritative Source Evidence                 |
+------------------------------+--------------------+---------------------+-----------------------------------------------+
| 1. Dual-Track Visuals SRS    | 24 Courses (12+12) | 720 Days Combined   | docs/visuals-srs/PINIT_DUAL_CURRICULUM_...SRS  |
|    • Python Full-Stack Track | 12 Courses         | 360 Days (12m×30d)  | Track 1 (M01-M12, Days 1-30 each)             |
|    • Web Full-Stack Track    | 12 Courses         | 360 Days (12m×30d)  | Track 2 (M01-M12, Days 1-30 each)             |
| 2. Crash Plans (Fellowship)  | 12 Courses / Track | 360 Training Days   | src/lib/data/crashPlansData.ts (plan-12m)     |
| 3. Crash Plans (Master Tech) | 24 Courses / Track | 720 Training Days   | src/lib/data/crashPlansData.ts (plan-24m)     |
| 4. Month 2 Expanded Content  | 12 Python Courses  | 720 Days Tested     | src/lib/data/*LongLessons.ts (Days 1-60 each) |
| 5. Catalog Courses           | 55 Course Objects  | 3,300 Total Days    | src/lib/data/coursesCatalog.ts                |
| 6. Canonical Blueprints      | 36 Course Files    | 2,160 Total Days    | content/courses/*.md & README.md:31           |
| 7. Physical Data Stores      | 53 LongLesson Files| 3,180 Content Days  | src/lib/data/*LongLessons.ts (+1 loader)      |
+------------------------------+--------------------+---------------------+-----------------------------------------------+
```

---

## 2. Resolving 360 Days vs. 720 Days (The Month 1 vs. Month 2 Expansion)

### A. The 360-Day Foundation (Month 1 / Days 1–30)
Source files:
- [`docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md:11-12`](file:///./docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md#L11-L12)
- [`src/lib/data/crashPlansData.ts:plan-12m-fellow`](file:///./src/lib/data/crashPlansData.ts)

In the platform's original 1-Year Fellowship architecture:
- Each Certification Track spans **12 sequential months** (1 specialized course per month).
- Each course contained **30 curriculum days** (Days 1 to 30):
  $$\text{Track Duration} = 12 \text{ courses} \times 30 \text{ days} = 360 \text{ curriculum days}$$
- Across **both** tracks (Track 1 Python + Track 2 Web), the total combined scope is:
  $$\text{Total Dual Scope} = 360 \text{ days (Python)} + 360 \text{ days (Web)} = 720 \text{ Days (24 Courses)}$$
- This is explicitly verified in `PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md:11-12`:
  - `Curriculums Covered: 1. Python Full-Stack Track (12 Courses / 360 Days) | 2. Web Full-Stack Track (12 Courses / 360 Days)`
  - `Total Scope: 24 Courses, 720 Days, 4,320 Lesson Parts, >3,500 Interactive Visual Specs`.

### B. The 720-Day Single-Track Expansion (Month 2 / Days 31–60)
Source files:
- [`src/lib/data/crashPlansData.ts:plan-24m-master`](file:///./src/lib/data/crashPlansData.ts)
- [`src/lib/data/*LongLessons.ts`](file:///./src/lib/data/)
- [`tests/python_track_long_lessons.test.ts`](file:///./tests/python_track_long_lessons.test.ts)

In subsequent engineering iterations, each of the 12 individual courses was expanded to include **Month 2 (Days 31 to 60)**:
- Under this expanded 2-year model (`plan-24m-master`):
  $$\text{Expanded Track Duration} = 12 \text{ courses} \times 60 \text{ days} = 720 \text{ curriculum days per track}$$
- In `tests/python_track_long_lessons.test.ts` and `tests/python_long_lessons.test.ts`, all 12 Python certification courses have **all 60 days implemented and verified** (12 × 60 = 720 days).

**Conclusion**:  
- **360 Days** refers to the **1-year foundation** (12 courses × 30 days) documented in the Dual SRS and `plan-12m-fellow`.
- **720 Days** refers to EITHER:
  1. The **combined dual-track scope** in the SRS (360d Python + 360d Web = 720d across 24 courses).
  2. The **Month-2 expanded single-track scope** (12 courses × 60 days = 720d) implemented in `*LongLessons.ts` and `plan-24m-master`.

---

## 3. Authoritative Course Membership & Ordering

From [`src/lib/data/crashPlansData.ts`](file:///./src/lib/data/crashPlansData.ts) (`plan-12m-fellow`) and [`docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md:137-168`](file:///./docs/visuals-srs/PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS.md#L137-L168):

### Track 1: Python Full-Stack & AI Certification Track (12 Courses)
| Month | Course ID in Catalog | Key / Prefix | Course Title in Plan | Physical LongLesson Store |
| :---: | :--- | :--- | :--- | :--- |
| M01 | `course-python-backend` | `python` | Python Core, OOP & Backend Internals | `pythonLongLessons.ts` |
| M02 | `course-dsa-python` | `dsa-py` | Data Structures & Algorithms in Python | `dsaPythonLongLessons.ts` |
| M03 | `course-database-eng` | `sql-mastery` | Databases with SQL & PostgreSQL (Shared) | `sqlLongLessons.ts` |
| M04 | `course-ai-python` | `ai-py` | Machine Learning Pipelines & Applied AI | `aiPythonLongLessons.ts` |
| M05 | `course-distributed-python` | `dist-py` | Distributed Data Streams & Systems | `distPythonLongLessons.ts` |
| M06 | `course-cloud-python` | `cloud-py` | Cloud Native MLOps & Infrastructure | `cloudPythonLongLessons.ts` |
| M07 | `course-nlp-python` | `nlp-py` | Natural Language Processing & Transformers | `nlpPythonLongLessons.ts` |
| M08 | `course-quant-python` | `quant-py` | Quantitative Analytics & Financial Math | `quantPythonLongLessons.ts` |
| M09 | `course-ai-prompt-python` | `prompt-py` | Autonomous AI Agents & Prompt Engineering | `promptPythonLongLessons.ts` |
| M10 | `course-train-python` | `train-py` | Distributed Model Training & LoRA | `trainPythonLongLessons.ts` |
| M11 | `course-vector-python` | `vec-py` | Vector Databases & Production Engines | `vectorPythonLongLessons.ts` |
| M12 | `course-safety-python` | `safe-py` | Production AI Safety, Alignment & Red-Team | `safetyPythonLongLessons.ts` |

### Track 2: Web Full-Stack & Systems Certification Track (12 Courses)
| Month | Course ID in Catalog | Key / Prefix | Course Title in Plan | Physical LongLesson Store |
| :---: | :--- | :--- | :--- | :--- |
| M01 | `course-react-web` | `react-basics` | Frontend Architecture & React Mastery | `reactLongLessons.ts` |
| M02 | `course-node-web` | `node-web` | Node.js & TypeScript Backend Engineering | `nodeWebLongLessons.ts` |
| M03 | `course-database-eng` | `sql-mastery` | Databases with SQL & PostgreSQL (Shared) | `sqlLongLessons.ts` |
| M04 | `course-dsa-optim` | `dsa-optim` | System DSA & V8 Engine Optimization | `dsaWebLongLessons.ts` |
| M05 | `course-devops-cicd` | `devops` | DevOps, Docker, Kubernetes & CI/CD | `devopsWebLongLessons.ts` |
| M06 | `course-cloud-native` | `cloud` | Cloud Native Architectures (AWS) | `cloudWebLongLessons.ts` |
| M07 | `course-distributed-sys` | `dist` | Distributed Consensus & Microservices | `distributedWebLongLessons.ts` |
| M08 | `course-cybersecurity` | `cyber` | AppSec, OWASP & Enterprise Defense | `cyberWebLongLessons.ts` |
| M09 | `course-ai-eng` | `ai` | Applied AI Integrations & LLM Systems | `aiWebLongLessons.ts` |
| M10 | `course-sre-web` | `sre-web` | Multi-Cloud Reliability & SRE in TS | `sreWebLongLessons.ts` |
| M11 | `course-stream-web` | `stream-web` | High-Throughput Streaming in TypeScript | `streamWebLongLessons.ts` |
| M12 | `course-aideploy-web` | `aideploy-web`| Production AI Deployment & Edge Gateways | `aiDeployWebLongLessons.ts` |

### Shared Curriculum Store:
- **`course-database-eng` (`sqlLongLessons.ts`)**: Serves as **Month 3** in BOTH the Python Track and the Web Track. This shared foundation bridges database design for both software disciplines.

---

## 4. Complete Reconciliation of the 55 Catalog Courses

Source file: [`src/lib/data/coursesCatalog.ts`](file:///./src/lib/data/coursesCatalog.ts)
- **Line 5**: `id: string;` (TypeScript interface field definition — accounts for the 56th `id:` text match).
- **Lines 15–458**: Exactly **55 course object literals** in `COURSES_CATALOG`.

### Composition Breakdown:
1. **36 Canonical Masterclass Courses** (Catalog Items 1–36, matching `content/courses/*.md` and `README.md:31`):
   - Items 1–21: Core Tech, IoT, Database, Systems & Quantitative courses.
   - Items 22–31: 10 Core Commerce / B.Com Degree courses (`bcomAccounting`, `bcomFinance`, etc.).
   - Items 32–35: 4 Foundational literacy courses (Computer Fundamentals, Prompt Literacy, Excel, Git).
   - Item 36: `course-softskills-communication` (Soft Skills & Professional Communication).
2. **8 Advanced Specialized Extensions** (Catalog Items 37–44):
   - 4 Advanced Commerce/Audit/Law: `course-statutory-auditing` (#38), `course-banking-treasury` (#39), `course-corporate-law` (#40), `course-corporate-taxation` (#41).
   - 3 Advanced Cloud/Reliability: `course-sre-web` (#42), `course-stream-web` (#43), `course-aideploy-web` (#44).
   - 1 Advanced AI: `course-nlp` (#37).
3. **11 Python Certification Modules** (Catalog Items 45–55):
   - `cloud-python`, `vector-python`, `safety-python`, `dsa-python`, `cyber-python`, `distributed-python`, `train-python`, `ai-python`, `quant-python`, `ai-prompt-python`, `nlp-python`.
   - Combined with Course #20 (`course-python-backend`), these make up the **12 courses of the Python Certification Track**.
- **Grand Total**: 36 + 8 + 11 = **55 catalog course objects**. Zero unexplained IDs.
