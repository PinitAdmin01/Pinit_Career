# ARGON FORENSIC AUDIT REPORT — PinIT Career OS
**Audit Role**: Brutal, Zero-Mercy Forensic Curriculum, Certification, Assessment & Puzzle Auditor (READ-ONLY)  
**Target Workspace**: `c:\Users\Admin\Desktop\projects\Present-Career-os` (`branch: main`)  
**Audit Date**: 2026-11-11  
**Mode**: STRICT READ-ONLY (Zero source/curriculum/test/visual files modified)

---

## Epistemic Tagging Legend
Every finding, metric, and coverage claim in this report carries an explicit epistemic provenance tag:
- **`[VERIFIED-EXEC]`**: Observed directly via live runtime/test execution, compiler exit code, or deterministic programmatic harness stdout.
- **`[VERIFIED-READ]`**: Inspected word-for-word via bounded file reads (`StartLine`–`EndLine`) with exact file path and line citations.
- **`[STATIC-SIGNAL]`**: Flagged by AST/regex/metric sweep across the full corpus (`3,540` long lessons, `3,184` visual JSONs, `2,820` coding tasks, `408` cert test questions, `180` Arena problems), where representative slices were `[VERIFIED-READ]` but not every flagged instance was manually read word-by-word.
- **`[UNAUDITED / BUDGET-CAP]`**: Prose/code slices not manually read word-for-word due to context-window budget limits (though 100% covered by automated `[STATIC-SIGNAL]` and `[VERIFIED-EXEC]` sweeps).

---

## 1. Brutal Verdict & Honest Confidence Assessment

### Overall Launch Readiness Verdict: **NO-GO (`BLOCKER` STATE)** `[VERIFIED-EXEC]` `[VERIFIED-READ]`
PinIT Career OS **cannot** be presented to shareholders or paying certification students as a "100% verified, enterprise-grade 60-day curriculum and certification platform" in its current state. While `npx tsc --noEmit` exits `0` (`[VERIFIED-EXEC]`) and the 180 CodeWars Arena problems pass deep reference/adversarial execution (`[VERIFIED-EXEC]`), **the existing test suite actively conceals catastrophic structural, runtime, and pedagogical defects through hardcoded loop caps, neutered hash assertions, narrow directory filters, and 500 exempted tasks.**

### Top 8 Systemic Failures Uncovered
1. **Unedited Starter Code Passes Official Coding Exams (`[VERIFIED-EXEC]` `[VERIFIED-READ]`)**:
   In [nodeWeb30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/nodeWeb30DayData.ts#L1480-L2298), **4 Month-2 Exam quests** (`node-web-exam-day-32`, `node-web-exam-day-36`, `node-web-exam-day-56`, `node-web-exam-day-59`) ship with starter code `return 0;` that **passes the official test suite 100% unedited** because `eTest` only asserts range/equality (`p1 === p2 && p1 >= 0 && p1 < 8`). `tests/web_track_tasks.test.ts` missed all 4 because lines `619` and `629` hardcode `const checkDays = 30;` even when `expectedDays` is `60`!
2. **87.4% of Gate v2 Visual Files Fail `checkDayFile` & 23 Files Throw Uncaught `TypeError` (`[VERIFIED-EXEC]` `[VERIFIED-READ]`)**:
   Running `checkDayFile` ([src/lib/visuals/gate.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/visuals/gate.ts#L204-L664)) across all `3,184` `day-XX.json` files in `53` directories under `src/lib/data/lessonVisuals/` yields **only `400` passing files (`12.6%`) and `2,784` failing files (`87.4%`)**, including **23 files in `node-web` (`day-37..60`) that crash with `TypeError: Cannot read properties of undefined (reading 'filter')`** because `"template": "compare"` uses `left`/`right` objects instead of `columns` ([node-web/day-37.json](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/lessonVisuals/node-web/day-37.json#L11-L29)). Furthermore, `tests/lesson_visuals_gate.test.ts` **fails right now** on `ai/day-01.json` (which contains mangled regex artifacts like `[Done.Pfour.Stwo]` and `"2. Multi-Head Attentio..."`), while domain visual tests in `tests/*_visuals_verification.test.ts` bypass `codeHash` verification via `|| (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16)`.
3. **Server-Side `verify-quest` Edge Function Drift & Missing Month-2 Quests (`[VERIFIED-EXEC]` `[VERIFIED-READ]`)**:
   In [questTestSuites.generated.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/supabase/functions/verify-quest/questTestSuites.generated.ts#L1-L200), **all 60 coding tasks for `course-python-backend`** (`python-exam-day-1..30` and `python-assign-day-1..30`) are out of sync with [python30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/python30DayData.ts#L1-L300), and **all Month-2 coding tasks (`day-31..60`)** for 60-day courses (`course-react-web`, `course-node-web`, `course-fullstack-js`) are completely missing from `QUEST_TEST_SUITES`.
4. **Cross-Track Language & Runtime Betrayal (`[VERIFIED-READ]`)**:
   - [longLessonTypes.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/longLessonTypes.ts#L123-L140) sets `LONG_LESSON_LANGUAGE['java-basics'] = 'javascript'`, and [javaBasicsLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/javaBasicsLongLessons.ts#L37-L83) writes "Java" lesson code in **TypeScript/JavaScript** (`console.log`, TS type annotations `sourceFile: string`) instead of Java! Worse, `jsRunner.ts` executes raw JS via `AsyncFunction` without TypeScript transpilation, meaning the TypeScript type annotations in `java-basics` Part 1/Part 2 throw `SyntaxError: Unexpected token ':'` if passed to `runJsCode`!
   - Conversely, `bcom_*` (14 courses), `iot_net`, `iot_edge`, `iot_sec`, `excel_viz`, `ai_prompt`, `nlp` teach **Python** in their long lessons, `iot_emb` and `quant-systems` teach **C++**, and `comp_fund` and `git_vcs` teach **Bash**, YET **100% of their 30-day coding exams and assignments (`*30DayData.ts`) require writing JavaScript functions** (`function evaluate...`) graded in JS!
   - In [questsData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/questsData.ts#L45-L121), standalone Java quests (`fizzbuzz`, `reverser`, `arraysum`, `palindrome`, `findmax`) give the student Java `starterCode` (`public class Solution { ... }`) while `testSuite` is JavaScript (`if (typeof fizzBuzz !== 'function')`).
5. **1,650 Month-2 Lesson Parts Across 11 Python/Web Courses Are Cloned Toy Boilerplate (`[VERIFIED-EXEC]` `[VERIFIED-READ]`)**:
   Across all 30 days of Month 2 (Days 31–60, 150 parts per course) in `ai-py`, `dist-py`, `cloud-py`, `quant-py`, `cyber-py`, `train-py`, `vec-py`, `safe-py`, `sre-web`, `stream-web`, and `aideploy-web` (`1,650 parts` total), every single part repeats the **exact same 8-paragraph template** (`"For fast readers..."`, `"For slow or methodical readers..."`, `"Think of an air-traffic control tower managing runway capacity for <Title>..."`) and executes the **exact same 6-line arithmetic stub** (`utilization = round((load * weight) / capacity, 4); healthy = utilization <= 0.85`) regardless of whether the lesson claims to teach *Reciprocal Rank Fusion (RRF)*, *Cross-Encoder Reranking*, *Raft Consensus*, or *Zero-Knowledge Proofs* ([aiPythonLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/aiPythonLongLessons.ts#L7228-L7330)). Every single one of those 1,650 parts also violates the `<580` total word / `<450` `say` word contract (~220 `say` words per part).
6. **240 Coding Tasks Across 4 B.Com Courses Are Day 1–30 Clones of `0.6*a + 0.4*b` (`[VERIFIED-READ]`)**:
   In `bcom_tax` ([bcomTaxation30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomTaxation30DayData.ts#L14-L120)), `bcom_aud` ([bcomAuditing30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomAuditing30DayData.ts#L14-L44)), `bcom_ban` ([bcomBanking30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomBanking30DayData.ts#L14-L84)), and `bcom_law` ([bcomLaw30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomLaw30DayData.ts#L14-L84)), **all 30 days** of Exams (`evaluateDay{N}AuditMetric`) and Assignments (`calculateDay{N}VarianceIndex`) implement the **exact same formula** (`weightedScore = primaryMetric * 0.6 + secondaryMetric * 0.4 >= 70 + day` tested with `(95, 90)` and `(40, 50)`, and `(observed - benchmark) / benchmark * 100` tested with `(105, 100)` and `(130, 100)`), regardless of whether the title says *OECD Pillar Two 15% Minimum Tax*, *Beneish M-Score*, *ISO 20022 pacs.008*, or *Chapter 11 DIP Financing*.
7. **227 Tasks Bypassed by Single Constant Return & 500 Tasks Exempted in `tests/known_*.ts` (`[VERIFIED-EXEC]` `[VERIFIED-READ]`)**:
   - `tests/known_low_input_tasks.ts` exempts **367 tasks** with `<3` distinct test inputs (including **all 30 exams** in `cyber`).
   - `tests/known_constant_tasks.ts` exempts **133 tasks** (132 unique IDs; `nlp-assign-day-21` is listed twice).
   - Programmatic constant-return testing across all JS-graded `*30DayData.ts` tasks proved **227 tasks across 21 courses** pass when the body is replaced by a single hardcoded return (`return 0`, `return true`, `return ""`, `return []`, or returning the first string/object literal from `eTest`).
8. **100% Answer-Index `0` Bias & Length Giveaway Across 35+ Courses (`[VERIFIED-EXEC]` `[VERIFIED-READ]`)**:
   Across 35+ course prefixes (`bcom_*`, `iot_*`, `react-basics`, `node-web`, `git_vcs`, `quant-systems`, `excel_viz`, `blockchain`, `mobile`, and Month 1 of `python`, `sql-mastery`, `dsa-py`, `devops`, `cloud`, `design`, `dsa-optim`, `dist`, `cyber`, `ai`), **100% of `part.check.answer` values in those slices are index `0`**, and in dozens of courses (`bcom-accounting`, `bcom-finance`, `comp_fund`, `iot_emb`, etc.) option `0` is `1.8x–3.5x` longer than the distractors.

### Explicit Blind Spots & Assumptions Where Argon Could Be Wrong
1. **TypeScript/JSX vs Raw JS in `runLikeStudent` (`[VERIFIED-EXEC]`)**: Our raw `runLikeStudent` sweep (`scripts/audit/studentRuntime.ts`) reported `300` mismatches in `react-basics` and `175` in `java-basics` because `runLikeStudent` uses `vm.runInNewContext` without TypeScript/JSX transpilation. However, `tests/web_track_long_lessons.test.ts` and `tests/java_basics_master_60days.test.ts` transpile TypeScript before execution and **passed 100%** (`[VERIFIED-EXEC]`). We explicitly separate *test-time TS compilation pass* from *browser `jsRunner.ts` lack of TS transpilation* so we do not falsely claim `react-basics` or `java-basics` outputs are numerically wrong.
2. **Word-by-Word Inspection Coverage (`[UNAUDITED / BUDGET-CAP]`)**: Across `59` course prefixes (`3,540` day lessons / `18,450+` parts), `100%` of lessons were audited programmatically (`[VERIFIED-EXEC]` / `[STATIC-SIGNAL]`), and stratified slices across every track (`Web`, `Python`, `Systems/DevOps`, `Launchpad`, `IoT`, `B.Com`, `Java`) were inspected word-for-word (`[VERIFIED-READ]`). The remaining un-read prose lines are marked `[UNAUDITED / BUDGET-CAP]` in Section 2; subtle domain prose typos that do not trigger AST/metric/execution/duplication detectors could exist in those unread slices.
3. **Browser-Only Pyodide/sql.js Runtime Nuances**: Python and SQL tasks were verified in Node via the repository's own test harnesses (`python_practice_tasks.test.ts`, `dsa_python_tasks.test.ts`, `sql_practice_tasks.test.ts` — all passing `[VERIFIED-EXEC]`), rather than a live Chromium WebWorker instance.

---

## 2. Complete Coverage Ledger (100% Transparent)

### 2A. All 59 Long-Lesson & 30-Day Curriculum Prefixes
*Note on Alias Pairs*: 6 course families register both a hyphenated and underscored prefix in `longLessons.ts` (`soft-skills`/`soft_skills`, `bcom-accounting`/`bcom_acc`, `bcom-finance`/`bcom_fin`, `bcom-marketing`/`bcom_mkt`) pointing to the same underlying `LongLesson[]` array (`53` unique arrays, `59` registered prefixes).

| Course Prefix | Catalog ID / Track | Days (M1+M2) | Parts per Day (M1/M2) | Auto-Swept (`[STATIC-SIGNAL]`) | Runtime & Visuals Tested (`[VERIFIED-EXEC]`) | Word-by-Word Inspected Slices (`[VERIFIED-READ]`) | Remaining Unaudited Slices (`[UNAUDITED / BUDGET-CAP]`) | Key Status Summary |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| `react-basics` | `course-react-web` (Web) | 60 | 5 / 5 | Yes (300 parts) | `web_track_long_lessons` PASS; Visuals: **0/60 pass** | `react30DayData.ts` (via sweep), `web_track_tasks.test.ts:1-710` | Days 2–60 prose (`[UNAUDITED / BUDGET-CAP]`) | `ans=[300,0,0,0]`, 284 length-skew MCQs, Days 31–60 tasks skipped in test |
| `node-web` | `course-node-web` (Web) | 60 | 5 / 5 | Yes (300 parts) | `web_track_long_lessons` PASS; Visuals: **0/60 pass (23 CRASH)** | `nodeWebLongLessons.ts:1-150`, `nodeWeb30DayData.ts:1450-1650,2150-2355`, `node-web/day-37.json:1-80` | Days 2–60 prose (`[UNAUDITED / BUDGET-CAP]`) | **4 M2 exams pass unedited starter**, 23 visual JSONs crash `checkDayFile` |
| `fullstack-js` | `course-fullstack-js` (Web) | 60 | 5 / 5 | Yes (300 parts) | `web_track_long_lessons` PASS; Visuals: **60/60 pass** | `known_constant_tasks.ts:1-53`, `web_track_tasks.test.ts:590-660` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 27 tasks in `known_constant_tasks`, M2 tasks missing from `verify-quest` |
| `sre-web` | `course-sre-web` (Web/Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `web_track_long_lessons` PASS; Visuals: **0/60 pass** | `coursesCatalog.ts:1-345`, `coursesData.ts:470-605` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; Days 31–60 (150 parts) cloned `<580w` stub |
| `stream-web` | `course-stream-web` (Web/Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `web_track_long_lessons` PASS; Visuals: **0/60 pass** | `coursesCatalog.ts:1-345`, `coursesData.ts:470-605` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; Days 31–60 (150 parts) cloned `<580w` stub |
| `aideploy-web` | `course-aideploy-web` (Web/Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `web_track_long_lessons` PASS; Visuals: **0/60 pass** | `coursesCatalog.ts:1-345`, `coursesData.ts:470-605` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; Days 31–60 (150 parts) cloned `<580w` stub |
| `python` | `course-python-backend` (Python) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **60/60 pass** | `python30DayData.ts:1-300`, `questTestSuites.generated.ts:1-200` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | **All 60 coding tasks drifted from `verify-quest`**; M1 `ans=[180,0,0,0]` |
| `sql-mastery` | `course-sql-mastery` (Python/Data) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **30/60 pass** | `sql_practice_tasks.test.ts:1-143`, `sqlRunner.ts:1-239` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 30 visual files fail Gate v2; M1 `ans=[180,0,0,0]` |
| `dsa-py` | `course-dsa-python` (Python/Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **60/60 pass** | `dsa_python_tasks.test.ts:1-180` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; M1 `ans=[180,0,0,0]` |
| `ai-py` | `course-ai-python` (Python/Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **0/60 pass** | `aiPythonLongLessons.ts:1-120,7200-7330` | Days 2–30, 33–60 (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; **Days 31–60 (150 parts) cloned `<580w` stub** |
| `dist-py` | `course-distributed-python` (Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **0/60 pass** | Pattern verified via `aiPythonLongLessons.ts:7200-7330` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; Days 31–60 (150 parts) cloned `<580w` stub |
| `cloud-py` | `course-cloud-python` (Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **0/60 pass** | Pattern verified via `aiPythonLongLessons.ts:7200-7330` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; Days 31–60 (150 parts) cloned `<580w` stub |
| `nlp-py` | `course-nlp-python` (Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **0/60 pass** | `coursesCatalog.ts:1-345` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; 60/60 visuals fail (`R6: 2496`) |
| `quant-py` | `course-quant-python` (Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **0/60 pass** | Pattern verified via `aiPythonLongLessons.ts:7200-7330` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; Days 31–60 (150 parts) cloned `<580w` stub |
| `prompt-py` | `course-ai-prompt-python` (Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **29/60 pass** | `coursesCatalog.ts:1-345` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; 31/60 visuals fail Gate v2 |
| `cyber-py` | `course-cyber-python` (Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **0/60 pass** | Pattern verified via `aiPythonLongLessons.ts:7200-7330` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; Days 31–60 (150 parts) cloned `<580w` stub |
| `train-py` | `course-train-python` (Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **0/60 pass** | Pattern verified via `aiPythonLongLessons.ts:7200-7330` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; Days 31–60 (150 parts) cloned `<580w` stub |
| `vec-py` | `course-vector-python` (Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **0/60 pass** | Pattern verified via `aiPythonLongLessons.ts:7200-7330` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; Days 31–60 (150 parts) cloned `<580w` stub |
| `safe-py` | `course-safety-python` (Missing Catalog) | 60 | 6 / 5 | Yes (330 parts) | `python_track_long_lessons` PASS; Visuals: **0/60 pass** | Pattern verified via `aiPythonLongLessons.ts:7200-7330` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Missing from `COURSES_CATALOG`; Days 31–60 (150 parts) cloned `<580w` stub |
| `devops` | `course-devops-cloud` (Systems) | 60 | 6 / 5 | Yes (330 parts) | `systems_long_lessons_parity` PASS; Visuals: **30/60 pass** | `systems_long_lessons_parity.test.ts:1-250` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 30/60 visuals fail Gate v2; 22 low-input tasks exempted |
| `cloud` | `course-cloud-aws` (Systems) | 60 | 6 / 5 | Yes (330 parts) | `systems_long_lessons_parity` PASS; Visuals: **0/60 pass** | `known_low_input_tasks.ts:50-80` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 60/60 visuals fail (`R5: 1288`); `codeNotes` schema drift (`string[]`) |
| `design` | `course-system-design` (Systems) | 60 | 6 / 5 | Yes (330 parts) | `systems_long_lessons_parity` PASS; Visuals: **0/60 pass** | `known_low_input_tasks.ts:80-115` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 60/60 visuals fail (`R12: 949`); 32 low-input tasks exempted |
| `dsa-optim` | `course-dsa- algorithmic` (Systems) | 60 | 6 / 5 | Yes (330 parts) | `systems_long_lessons_parity` PASS; Visuals: **30/60 pass** | `known_low_input_tasks.ts:115-150` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 30/60 visuals fail Gate v2; 27 low-input tasks exempted |
| `dist` | `course-distributed` (Systems) | 60 | 6 / 5 | Yes (330 parts) | `systems_long_lessons_parity` PASS; Visuals: **0/60 pass** | `known_low_input_tasks.ts:150-195` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 60/60 visuals fail (`R5: 630, R12: 524`); 41 low-input tasks exempted |
| `cyber` | `course-cybersecurity` (Systems) | 60 | 6 / 5 | Yes (330 parts) | `systems_long_lessons_parity` PASS; Visuals: **0/60 pass** | `known_low_input_tasks.ts:195-245` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 60/60 visuals fail; **all 30 exams exempted in `known_low_input_tasks`** |
| `ai` | `course-ai-engineering` (Systems) | 60 | 6 / 5 | Yes (330 parts) | `lesson_visuals_gate` **FAIL**; Visuals: **30/60 pass** | `lessonVisuals/ai/day-01.json:1-180,350-560` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | `ai/day-01..30.json` fail Gate v2 (`[Done.Pfour.Stwo]` mangled captions) |
| `comp_fund` | `comp_fund` (Launchpad) | 60 | 5 / 5 | Yes (300 parts) | `launchpad_core_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `compFundLongLessons.ts:1-120` | Days 2–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Bash, tasks in JS; 298 parts with `"For slow or methodical readers"` |
| `git_vcs` | `git_vcs` (Launchpad) | 60 | 5 / 5 | Yes (300 parts) | `launchpad_core_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `launchpad_core_visuals_verification.test.ts:1-103` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Bash, tasks in JS; `ans=[300,0,0,0]` |
| `excel_viz` | `excel_viz` (Launchpad) | 60 | 5 / 5 | Yes (300 parts) | Visuals: **0/60 pass Gate v2** (`R9: 1290, R12: 553`) | `universal_and_commerce_tasks.test.ts:1-147` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Python, tasks in JS; `ans=[300,0,0,0]` |
| `soft-skills` / `soft_skills` | `soft_skills` (Launchpad) | 60 | 5 / 5 | Yes (300 parts) | Visuals: **0/60 pass Gate v2** (`R12: 770`) | `longLessons.ts:1-150` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 2 constant-bypassable tasks; 60/60 visuals fail R12 (`codeHash`) |
| `java-basics` | `java-basics` (Java) | 60 | 5 / 5 | Yes (300 parts) | `java_basics_master_60days` PASS; Visuals: **0/60 pass** | `javaBasicsLongLessons.ts:1-120`, `java_basics_master_60days.test.ts:1-64` | Days 2–60 prose (`[UNAUDITED / BUDGET-CAP]`) | **Java course teaches/runs TS/JS code**; 150 template `tryIt` prompts |
| `mobile` | `mobile` (Systems) | 60 | 5 / 5 | Yes (300 parts) | `advanced_systems_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `advanced_systems_visuals_verification.test.ts:1-250` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | `ans=[300,0,0,0]`, 150 template `tryIt` prompts, 60/60 visuals fail R9/R12 |
| `blockchain` | `blockchain` (Systems) | 60 | 5 / 5 | Yes (300 parts) | `advanced_systems_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `advanced_systems_visuals_verification.test.ts:1-250` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | **17 tasks pass via constant return**, `ans=[300,0,0,0]`, 60/60 visuals fail |
| `g3d` | `g3d` (Systems) | 60 | 5 / 5 | Yes (300 parts) | `advanced_systems_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `advanced_systems_visuals_verification.test.ts:1-250` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | **25 tasks pass via constant return**, 60/60 visuals fail Gate v2 |
| `quant-systems` | `quant-systems` (Systems) | 60 | 5 / 5 | Yes (300 parts) | `advanced_systems_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `known_constant_tasks.ts:1-53` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in C++, tasks in JS; 24 tasks in `known_constant_tasks`; `ans=[300,0,0,0]` |
| `ai_prompt` | `ai_prompt` (AI) | 60 | 6 / 5 | Yes (330 parts) | Visuals: uses `prompt-py` | `known_constant_tasks.ts:1-53` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Python, tasks in JS; 34 tasks in `known_constant_tasks` |
| `nlp` | `nlp` (AI) | 60 | 6 / 5 | Yes (330 parts) | Visuals: uses `nlp-py` | `known_constant_tasks.ts:1-53` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Python, tasks in JS; **47/60 tasks in `known_constant_tasks`** |
| `iot_emb` | `iot_emb` (IoT) | 60 | 5 / 5 | Yes (300 parts) | `iot_hardware_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `iotEmbLongLessons.ts:1-120`, `iotEmbedded30DayData.ts:1-90` | Days 2–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in C++ (`<580w` in M1), tasks in JS; **29 tasks pass via constant return** |
| `iot_net` | `iot_net` (IoT) | 60 | 5 / 5 | Yes (300 parts) | `iot_hardware_visuals` PASS*; Visuals: **0/64 pass Gate v2** | `iot_hardware_visuals_verification.test.ts:1-250` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Python, tasks in JS; **16 tasks pass via constant return** |
| `iot_edge` | `iot_edge` (IoT) | 60 | 5 / 5 | Yes (300 parts) | `iot_hardware_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `iot_hardware_visuals_verification.test.ts:1-250` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Python, tasks in JS; **23 tasks pass via constant return** |
| `iot_sec` | `iot_sec` (IoT) | 60 | 5 / 5 | Yes (300 parts) | `iot_hardware_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `iot_hardware_visuals_verification.test.ts:1-250` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Python, tasks in JS; **22 tasks pass via constant return** |
| `bcom-accounting` / `bcom_acc` | `bcom_acc` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **4/60 pass Gate v2** | `bcomAccountingLongLessons.ts:1-120`, `bcomAccounting30DayData.ts:1-45` | Days 2–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Python, tasks in JS; `ans=[300,0,0,0]`, 288 length-skew MCQs |
| `bcom-finance` / `bcom_fin` | `bcom_fin` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `bcomFinance30DayData.ts:1-120` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Python, tasks in JS; `ans=[300,0,0,0]`, Day 2/3 title mismatch |
| `bcom-marketing` / `bcom_mkt` | `bcom_mkt` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `bcomMarketing30DayData.ts:1-45` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | Lessons in Python, tasks in JS; `ans=[300,0,0,0]`, 60/60 visuals fail |
| `bcom_aud` | `bcom_aud` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `bcomAuditing30DayData.ts:1-45` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | **All 60 coding tasks are Day 1–30 clones of `0.6*a+0.4*b` / variance** |
| `bcom_ban` | `bcom_ban` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `bcomBanking30DayData.ts:1-90` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | **All 60 coding tasks are Day 1–30 clones of `0.6*a+0.4*b` / variance** |
| `bcom_dmkt` | `bcom_dmkt` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `bcomDigitalMarketing30DayData.ts:1-30` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 2 constant-bypassable tasks; `ans=[300,0,0,0]`; 60/60 visuals fail |
| `bcom_ecom` | `bcom_ecom` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `bcomEcommerce30DayData.ts:1-30` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 3 constant-bypassable tasks; 60/60 visuals fail (`R12: 672, R13: 70`) |
| `bcom_ent` | `bcom_ent` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **30/60 pass Gate v2** | `bcomEntrepreneurship30DayData.ts:1-30` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 30/60 visuals fail R12 (`codeHash`); lessons in Python, tasks in JS |
| `bcom_scrm` | `bcom_scrm` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `bcomSalesCrm30DayData.ts:1-30` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 60/60 visuals fail (`R12: 754, R6: 150`); lessons in Python, tasks in JS |
| `bcom_law` | `bcom_law` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **15/60 pass Gate v2** | `bcomLaw30DayData.ts:1-90` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | **All 60 coding tasks are Day 1–30 clones of `0.6*a+0.4*b` / variance** |
| `bcom_tax` | `bcom_tax` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **10/60 pass Gate v2** | `bcomTaxation30DayData.ts:1-120` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | **All 60 coding tasks are Day 1–30 clones of `0.6*a+0.4*b` / variance** |
| `bcom_ana` | `bcom_ana` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `bcomAnalytics30DayData.ts:1-45` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 5 constant-bypassable tasks; `ans=[300,0,0,0]`; 60/60 visuals fail |
| `bcom_ops` | `bcom_ops` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **12/60 pass Gate v2** | `bcomOperations30DayData.ts:1-45` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | 48/60 visuals fail (`R12: 656, R4: 300`); lessons in Python, tasks in JS |
| `bcom_ait` | `bcom_ait` (Commerce) | 60 | 5 / 5 | Yes (300 parts) | `bcom_flagship_visuals` PASS*; Visuals: **0/60 pass Gate v2** | `bcom_flagship_visuals_verification.test.ts:1-72` | Days 1–60 prose (`[UNAUDITED / BUDGET-CAP]`) | `ans=[300,0,0,0]`; 60/60 visuals fail (`R12: 749, R6: 125`) |

*\*Note: `PASS*` on domain visual verification tests indicates that the domain test suite passed ONLY because its `codeHash` assertion was bypassed via `|| (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16)`.*

### 2B. Assessments, Course Certification Tests, Quests & CodeWars Arena Registry

| Subsystem / Module | Total Units | Auto-Swept (`[STATIC-SIGNAL]`) | Executed / Tested (`[VERIFIED-EXEC]`) | Word-by-Word Inspected (`[VERIFIED-READ]`) | Remaining Unaudited (`[UNAUDITED / BUDGET-CAP]`) | Audit Verdict |
| :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| `courseTests*.ts` (51 courses, 408 Qs) | 408 MCQs | 100% (408/408) | `tests/course_tests.test.ts` (9/9 PASS) | `courseTests.ts:1-28`, `courseTestsCore.ts:1-179`, `tests/course_tests.test.ts:1-128` | Remaining `courseTests*.ts` files (`[STATIC-SIGNAL]` swept) | **CRITICAL**: 0 explanations (`why` missing on 408/408 Qs); 27/51 courses have `0` index-0 answers; 195 length-skewed Qs |
| `blockTests.ts` (Block Exams) | 6-day / 5-day generator | 100% | Indirectly via `coursesData.ts` | `src/lib/data/blockTests.ts:1-103` | N/A (100% read) | **HIGH**: Generates synthetic trivia MCQs (`"Which milestone topic is part of..."`) with hardcoded `correctIndex: day % 4` |
| `questsData.ts` (Standalone Quests) | 22 Quests | 100% (22/22) | Swept via `sweep_tasks_and_puzzles.ts` | `src/lib/data/questsData.ts:1-197` | N/A (100% read) | **CRITICAL**: 5 Java quests (`fizzbuzz`..`findmax`) provide Java `starterCode` (`public class Solution`) but execute JS `testSuite` |
| `verify-quest` (`questTestSuites.generated.ts`) | 1,642 Suites | 100% (1,642/1,642) | Cross-checked against `COURSES_REGISTRY` | `supabase/functions/verify-quest/questTestSuites.generated.ts:1-200` | Lines 201–end (`[STATIC-SIGNAL]` swept) | **BLOCKER**: All 60 `course-python-backend` tasks out of sync; all M2 coding tasks (`day-31..60`) missing |
| `codeWarsRegistryData.ts` + `codeWarsApi.ts` | 180 Arena Problems | 100% (180/180) | `brutal_adversarial_arena_audit.test.ts` & `arena_all_180_questions_deep_audit.test.ts` PASS | `codeWarsRegistryData.ts:1-250,750-950`, `codeWarsApi.ts:1-250`, `codeWarsSandbox.ts:1-250`, `codeWarsJudge.ts:1-138` | Remaining problem descriptions (`[STATIC-SIGNAL]` swept) | **HIGH**: Reference solutions & adversarial tests pass 180/180, but `codeWarsSandbox.ts` blocks valid comments containing `process`/`import`/`fs`/`global` |
| `src/lib/code/runners/*` | 7 Language Runners | 100% | Tested across JS/Py/SQL/Web suites | `jsRunner.ts:1-250`, `pythonRunner.ts:1-250`, `webTaskRunner.ts:1-250`, `sqlRunner.ts:1-239`, `bashRunner.ts:1-250`, `cppRunner.ts:1-203` | N/A (100% read) | **HIGH**: `pythonRunner.ts:205` hardcodes `C:\Users\vinay\...`; `jsRunner.ts` lacks TS transpilation for `java-basics` |

---

## 3. Executive Severity Scorecard

| Domain / Category | `BLOCKER` | `CRITICAL` | `HIGH` | `MEDIUM` | `LOW` | Total Distinct Findings |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Courses & Long Lessons (`*LongLessons.ts`)** | 1 | 3 | 3 | 1 | 0 | **8** |
| **Gate v2 Visuals (`lessonVisuals/**`, `gate.ts`)** | 2 | 1 | 1 | 0 | 0 | **4** |
| **Certifications & Course Tests (`courseTests*.ts`, `blockTests.ts`)** | 0 | 1 | 2 | 0 | 0 | **3** |
| **Coding Tasks, Quests & Judges (`*30DayData.ts`, `questsData.ts`, `verify-quest`)** | 2 | 3 | 2 | 0 | 0 | **7** |
| **CodeWars Arena & Runners (`codeWars*`, `runners/*`)** | 0 | 0 | 2 | 1 | 0 | **3** |
| **Infrastructure, Catalog & Test Suites (`tests/*`, `contracts.json`)** | 1 | 1 | 1 | 1 | 0 | **4** |
| **TOTAL** | **6** | **9** | **11** | **3** | **0** | **29** |

---

## 4. Detailed Forensic Findings Register

### Group A — Coding Tasks, Certification Quests & Server Judges (`*30DayData.ts`, `questsData.ts`, `verify-quest`)

#### `[FINDING-001]` `[BLOCKER]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: Unedited Starter Code (`return 0;`) Passes Official Exam Test Suites in 4 Month-2 `node-web` Exams, Hidden by Hardcoded `checkDays = 30` in `tests/web_track_tasks.test.ts`
- **Location**:
  - [src/lib/data/nodeWeb30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/nodeWeb30DayData.ts#L1480-L1492) (`node-web-exam-day-32`)
  - [src/lib/data/nodeWeb30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/nodeWeb30DayData.ts#L1595-L1607) (`node-web-exam-day-36`)
  - [src/lib/data/nodeWeb30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/nodeWeb30DayData.ts#L2193-L2206) (`node-web-exam-day-56`)
  - [src/lib/data/nodeWeb30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/nodeWeb30DayData.ts#L2285-L2298) (`node-web-exam-day-59`)
  - [tests/web_track_tasks.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/web_track_tasks.test.ts#L617-L633)
- **Evidence**:
  In [src/lib/data/nodeWeb30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/nodeWeb30DayData.ts#L1483-L1492):
  ```ts
  eStarter: `function selectPartition(key, numPartitions) {
    // Deterministic hash mod numPartitions
    return 0;
  }`,
  eTest: `const p1 = selectPartition('user-123', 8);
  const p2 = selectPartition('user-123', 8);
  const p3 = selectPartition('user-456', 8);
  if (p1 !== p2 || p1 < 0 || p1 >= 8) throw new Error('Must be deterministic and within partition bounds 0..7');
  if (typeof p3 !== 'number') throw new Error('Must return valid partition index');`,
  ```
  And in [tests/web_track_tasks.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/web_track_tasks.test.ts#L617-L631):
  ```ts
  const expectedDays = (courseId === 'course-react-web' || courseId === 'course-node-web' || courseId === 'course-fullstack-js') ? 60 : 30;
  if (courseId !== 'course-fullstack-js') {
    const checkDays = 30;
    assert.equal(exams.length, expectedDays, `${courseId} should have ${expectedDays} exams`);
    // ...
    for (let d = 1; d <= checkDays; d++) {
  ```
- **What Is Wrong**:
  1. In all 4 exams (`day-32`, `day-36`, `day-56`, `day-59`), `eStarter` returns `0`, and `eTest` only checks that two identical calls return the same number (`0 === 0`), that the number is `>= 0` and `< N`, and that a third call returns `typeof === 'number'`. Thus, clicking "Submit" without typing a single character awards 100% completion on 4 official Month-2 Node.js certification exams!
  2. Furthermore, on `day-59` ([nodeWeb30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/nodeWeb30DayData.ts#L2283-L2289)), `eStarter` says `// Return CRC16 hash slot 0..16383` while `eDesc` specifies `((hash << 5) - hash + charCode) & 0xffff` (DJB2 variant, not CRC16).
  3. `tests/web_track_tasks.test.ts` completely skipped Days 31–60 (`120 tasks`) for `course-react-web` and `course-node-web` because `const checkDays = 30;` was hardcoded right below `expectedDays = 60`!
- **What Should Be Done**:
  1. In `nodeWeb30DayData.ts` (`day-32`, `day-36`, `day-56`, `day-59`), change `eStarter` to leave an empty body or `return -1;` / `undefined`, and strengthen `eTest` to assert exact expected output values across at least 3 distinct keys (and assert `p1 !== p3` for distinct keys). Fix `day-59` comment/description alignment.
  2. In `tests/web_track_tasks.test.ts:619,629`, replace `const checkDays = 30;` with `const checkDays = expectedDays;` and run the full 60-day loop across all web courses.
- **How To Fix + Verify**:
  Edit `src/lib/data/nodeWeb30DayData.ts` and `tests/web_track_tasks.test.ts`, regenerate `questTestSuites.generated.ts`, then run:
  ```powershell
  npx tsx --test tests/web_track_tasks.test.ts
  ```

---

#### `[FINDING-002]` `[BLOCKER]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: Server-Side Edge Judge (`supabase/functions/verify-quest/questTestSuites.generated.ts`) Has 100% Drift on `course-python-backend` (60 Tasks) and Is Missing All Month-2 Coding Tasks (`day-31..60`)
- **Location**:
  - [supabase/functions/verify-quest/questTestSuites.generated.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/supabase/functions/verify-quest/questTestSuites.generated.ts#L1-L200)
  - [src/lib/data/python30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/python30DayData.ts#L1-L300)
- **Evidence**:
  In [supabase/functions/verify-quest/questTestSuites.generated.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/supabase/functions/verify-quest/questTestSuites.generated.ts#L93-L99):
  ```ts
  "python-exam-day-1": {
    "testSuite": "if (typeof formatGreeting !== 'function') throw new Error('formatGreeting function is missing');\nconst r1 = formatGreeting('Ada', 'Engineer');\n...",
    "language": "javascript"
  },
  ```
  Whereas in [src/lib/data/python30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/python30DayData.ts#L31-L48), `python-exam-day-1` is a real Python task (`def build_welcome_banner(name, track): ...`) with Python `assert` statements!
  And our programmatic cross-check (`scratch/tasks_puzzles_report.json` `[VERIFIED-EXEC]`) confirmed:
  - `driftedInVerifyQuestCount: 60` (`python-exam-day-1..30` and `python-assign-day-1..30` all have legacy JavaScript `testSuite`s with `"language": "javascript"` in `questTestSuites.generated.ts` while `python30DayData.ts` has Python code and Python assertions!).
  - Furthermore, `questTestSuites.generated.ts` contains `0` entries for `react-exam-day-31..60`, `node-web-exam-day-31..60`, `fullstack-js-exam-day-31..60`, and Month-2 quests across the expanded courses!
- **What Is Wrong**:
  When a student submits valid Python code for any Day 1–30 exam or assignment in `course-python-backend` to the `verify-quest` Supabase Edge Function, the server judge evaluates their Python code as **JavaScript** against the old JS test suite (`typeof formatGreeting !== 'function'`), causing **100% of server-side verifications for `course-python-backend` to fail**! And any Month-2 coding quest submitted to `verify-quest` fails with unknown quest ID.
- **What Should Be Done**:
  Re-run and fix the generator script that builds `supabase/functions/verify-quest/questTestSuites.generated.ts` so that:
  1. All 60 `course-python-backend` tasks sync their actual Python `testSuite` and `"language": "python"`.
  2. All Month-2 (`day-31..60`) coding exams and assignments across all 60-day courses are emitted into `QUEST_TEST_SUITES`.
- **How To Fix + Verify**:
  Update the `questTestSuites.generated.ts` build script, regenerate `supabase/functions/verify-quest/questTestSuites.generated.ts`, and add a CI test asserting `QUEST_TEST_SUITES[q.id].testSuite === q.testSuite` for every coding quest in `COURSES_REGISTRY`.

---

#### `[FINDING-003]` `[CRITICAL]` `[TAG: VERIFIED-READ]`
- **Title**: 240 Coding Exams & Assignments Across 4 B.Com Courses (`bcom_tax`, `bcom_aud`, `bcom_ban`, `bcom_law`) Are Verbatim Day 1–30 Clones of `0.6 * a + 0.4 * b` and `(a - b) / b * 100`
- **Location**:
  - [src/lib/data/bcomTaxation30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomTaxation30DayData.ts#L14-L609) (Days 1–30, 60 tasks)
  - [src/lib/data/bcomAuditing30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomAuditing30DayData.ts#L14-L609) (Days 1–30, 60 tasks)
  - [src/lib/data/bcomBanking30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomBanking30DayData.ts#L14-L594) (Days 1–30, 60 tasks)
  - [src/lib/data/bcomLaw30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomLaw30DayData.ts#L14-L609) (Days 1–30, 60 tasks)
- **Evidence**:
  Every single day `N` (`1..30`) across all 4 courses defines:
  - Exam: `evaluateDay{N}AuditMetric(primaryMetric, secondaryMetric, hurdleThreshold = 70 + N)` where `eHint` and `eTest` are identical except for the day number `N`:
    ```ts
    const passRes = evaluateDay2AuditMetric(95, 90, 72);
    const failRes = evaluateDay2AuditMetric(40, 50, 72);
    ```
  - Assignment: `calculateDay{N}VarianceIndex(observedValue, benchmarkValue)` where `aTest` is identical across all 120 assignments:
    ```ts
    const v1 = calculateDay2VarianceIndex(105, 100);
    const v2 = calculateDay2VarianceIndex(130, 100);
    ```
- **What Is Wrong**:
  Despite rich domain titles like *"OECD BEPS Pillar Two & Global Anti-Base Erosion (GloBE) 15% Minimum Tax"*, *"The Beneish M-Score 8-Variable Earnings Manipulation Detection Model"*, *"ISO 20022 Financial Messaging: pacs.008"*, and *"Chapter 11 Petition, Automatic Stay & DIP Superpriority Financing"*, the actual coding assessment forces students to write the exact same `0.6 * primaryMetric + 0.4 * secondaryMetric` and `(observed - benchmark) / benchmark * 100` formula 120 times in a row! This is pure synthetic curriculum fraud.
- **What Should Be Done**:
  Replace the cloned `evaluateDay{N}AuditMetric` and `calculateDay{N}VarianceIndex` tasks in `bcomTaxation30DayData.ts`, `bcomAuditing30DayData.ts`, `bcomBanking30DayData.ts`, and `bcomLaw30DayData.ts` with genuine domain-specific quantitative problems matching each day's syllabus (e.g., GloBE top-up tax calculation with SBCO carve-out on Tax Day 2, Beneish M-Score threshold evaluator on Audit Day 2, LCR/NSFR or duration gap calculation on Banking Day 1, HHI delta merger calculation on Law Day 1/3).
- **How To Fix + Verify**:
  Author genuine day-specific tasks in those 4 files and verify with:
  ```powershell
  npx tsx --test tests/universal_and_commerce_tasks.test.ts
  ```

---

#### `[FINDING-004]` `[CRITICAL]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: 227 Coding Tasks Across 21 Courses Are Bypassable by a Single Constant Return, Plus 500 Weak Tasks Are Exempted in `tests/known_low_input_tasks.ts` (367) and `tests/known_constant_tasks.ts` (133)
- **Location**:
  - [tests/known_low_input_tasks.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/known_low_input_tasks.ts#L1-L378) (`367` exempted task IDs)
  - [tests/known_constant_tasks.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/known_constant_tasks.ts#L1-L53) (`133` entries, `132` unique IDs; `nlp-assign-day-21` duplicated on lines 36 and 37)
  - Unexempted courses with constant-return bypasses (`[VERIFIED-EXEC]` via `scratch/tasks_puzzles_report.json`):
    - `iot_emb` (`29/60` tasks pass with a single constant return)
    - `g3d` (`25/60` tasks)
    - `iot_edge` (`23/60` tasks)
    - `iot_sec` (`22/60` tasks)
    - `blockchain` (`17/60` tasks)
    - `iot_net` (`16/60` tasks)
    - `bcom_ana` (`5/60`), `node-web` (`4/120`), `bcom_ecom` (`3/60`), `react-basics` (`2/120`), `bcom_dmkt` (`2/60`), `soft-skills` (`2/60`), `comp_fund` (`1/60`), `git_vcs` (`1/60`), `excel_viz` (`1/60`), `mobile` (`1/60`), `bcom_ops` (`1/60`)
- **Evidence**:
  For example, in [src/lib/data/iotEmbedded30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/iotEmbedded30DayData.ts#L20-L23) (`iot_emb-assign-day-1`):
  ```ts
  aTest: "if (calculateFreeSram(65536, 1024, 2048, 4096) !== 58368) throw new Error('SRAM calc failed');"
  ```
  There is only **1 single function call** in `aTest`, so `function calculateFreeSram() { return 58368; }` passes 100%! Same for Day 2 (`return '0x0008';`), Day 4 (`return 2.5;`), and 95 tasks across the IoT track alone!
  Meanwhile, in [tests/known_low_input_tasks.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/known_low_input_tasks.ts#L201-L246), **all 30 exams in `course-cybersecurity`** (`cyber-exam-day-1` through `cyber-exam-day-30`) and **47 of 60 tasks in `nlp`** (`tests/known_constant_tasks.ts:18-45`) are explicitly whitelisted so CI tests ignore their single-input / constant-return vulnerability!
- **What Is Wrong**:
  A certification platform cannot award verified credentials when 227 JS-graded coding tasks can be defeated by `return <constant>;` and 367 tasks test fewer than 3 distinct inputs. Worse, `tests/universal_and_commerce_tasks.test.ts` never runs constant-return or `>= 3` distinct-input checks at all!
- **What Should Be Done**:
  1. Add at least 3 distinct input assertions (nominal, boundary, negative/adversarial) to every single-assertion `eTest` and `aTest` across `iot_*`, `g3d`, `blockchain`, `bcom_*`, `nlp`, `ai_prompt`, `quant-systems`, `fullstack-js`, and the 12 web/systems courses in `known_low_input_tasks.ts`.
  2. Delete `tests/known_low_input_tasks.ts` and `tests/known_constant_tasks.ts` (or reduce them to 0 entries) and enforce the anti-constant-return and `>= 3` distinct-input gates in `tests/universal_and_commerce_tasks.test.ts` as well as `tests/web_track_tasks.test.ts`.
- **How To Fix + Verify**:
  Expand the single-case `eTest`/`aTest` scripts to 3+ distinct inputs, empty `known_low_input_tasks.ts` and `known_constant_tasks.ts`, and verify:
  ```powershell
  npx tsx --test tests/web_track_tasks.test.ts tests/universal_and_commerce_tasks.test.ts
  ```

---

#### `[FINDING-005]` `[CRITICAL]` `[TAG: VERIFIED-READ]`
- **Title**: Systemic Track Language Betrayal — Python, C++, Bash, and Java Courses Force Students to Write JavaScript (or TypeScript) in Lessons and/or Coding Assessments
- **Location**:
  - [src/lib/data/longLessonTypes.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/longLessonTypes.ts#L123-L195) (`LONG_LESSON_LANGUAGE`)
  - [src/lib/data/javaBasicsLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/javaBasicsLongLessons.ts#L37-L85) (`java-basics` lessons written in TypeScript/JS)
  - [src/lib/data/questsData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/questsData.ts#L45-L121) (5 Java quests with Java `starterCode` and JS `testSuite`)
  - [tests/universal_and_commerce_tasks.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/universal_and_commerce_tasks.test.ts#L44-L135) (26 non-JS courses graded in JS)
- **Evidence**:
  1. In [src/lib/data/longLessonTypes.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/longLessonTypes.ts#L136):
     ```ts
     'java-basics': 'javascript',
     ```
     And in [src/lib/data/javaBasicsLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/javaBasicsLongLessons.ts#L37):
     ```ts
     "code": "// Java Platform Compilation & Execution Architecture Simulator\nclass JavaPlatformSimulator {\n  executePipeline(sourceFile: string): {\n    compiler: string;\n...
     ```
     Not only is the "Java Logic & Systems" course executing JavaScript instead of Java, `part.code` contains **TypeScript type annotations** (`sourceFile: string`) on 175 of 300 parts! When a student runs `part.code` in the browser via `jsRunner.ts` (`new AsyncFunction`), raw JS execution fails with `SyntaxError: Unexpected token ':'` because `jsRunner.ts` does not transpile TypeScript!
  2. In [src/lib/data/questsData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/questsData.ts#L45-L58) (`quest-fizzbuzz`, `quest-reverse`, `quest-sum`, `quest-palindrome`, `quest-max`):
     ```ts
     language: 'Java',
     starterCode: `public class Solution {\n    public static void fizzBuzz(int n) {\n        // Write your code here\n    }\n}`,
     testSuite: `if (typeof fizzBuzz !== 'function') throw new Error('fizzBuzz function is missing'); ...`,
     ```
     A student sees `language: 'Java'` and Java `public class Solution` starter code, but the judge runs a JavaScript `testSuite`!
  3. Across 23 courses (`bcom_*` [14], `iot_net`, `iot_edge`, `iot_sec`, `excel_viz`, `ai_prompt`, `nlp` [taught in Python], `iot_emb`, `quant-systems` [taught in C++], `comp_fund`, `git_vcs` [taught in Bash]), the daily long lessons teach Python/C++/Bash, yet every daily coding exam and assignment in `*30DayData.ts` requires writing a **JavaScript** function (`function ...`).
- **What Is Wrong**:
  Students enrolled in Java, Python (B.Com/IoT/NLP/Excel), C++ (Embedded/Quant), or Bash (Linux/Git) courses are either given TypeScript pretending to be Java, Java starter code graded by a JS runner (impossible to pass without deleting the Java class and writing JS), or Python/C++/Bash lessons paired with JavaScript exams.
- **What Should Be Done**:
  1. Convert the 5 broken Java quests in `questsData.ts` to either use a real Java runner or match the language of their `testSuite`.
  2. In `javaBasicsLongLessons.ts`, either strip TypeScript type annotations so `jsRunner.ts` can execute the simulator code in the browser without `SyntaxError`, or transpiling TS in `jsRunner.ts` (and clearly label JS simulator code vs real Java syntax).
  3. Align course exam/assignment languages (`*30DayData.ts`) with the language taught in the course's `LongLesson` track (or explicitly disclose JS-based simulation grading in the UI).
- **How To Fix + Verify**:
  Strip TS annotations in `javaBasicsLongLessons.ts` (or add TS stripping to `jsRunner.ts`) and verify `runLikeStudent(part.code)` passes all 300 parts of `java-basics` with 0 `SyntaxError`s. Fix `questsData.ts:45-121` and verify all 22 quests in `QUESTS_DATA`.

---

#### `[FINDING-006]` `[HIGH]` `[TAG: VERIFIED-READ]`
- **Title**: Hidden Test Suite Contract Mismatches (`eDesc` vs `eTest`) & Overwritten Day Titles in `*30DayData.ts` (`iot_emb`, `bcom-finance`)
- **Location**:
  - [src/lib/data/iotEmbedded30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/iotEmbedded30DayData.ts#L26-L84) (`iot_emb` Days 2, 3, 4)
  - [src/lib/data/bcomFinance30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomFinance30DayData.ts#L26-L68) (`bcom-finance` Days 2, 3, 4)
- **Evidence**:
  1. In [src/lib/data/iotEmbedded30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/iotEmbedded30DayData.ts#L55-L58) (`iot_emb` Day 3 Exam):
     - `eDesc`: `"Implement function processDebounceSample(shiftHistory, newSample) shifting new bit into 8-bit history; returns 'PRESSED' when all 8 bits are 0 (Active Low pressed), 'RELEASED' when all 8 bits are 1, or 'BOUNCING'."`
     - `eTest`:
       ```js
       let h = 0xFF; // Idle high
       h = processDebounceSample(h, 0).updatedHistory;
       h = processDebounceSample(h, 0).updatedHistory;
       const b = processDebounceSample(h, 1); // Bounce back high
       if (b.state !== 'BOUNCING_TRANSITION') throw new Error('Bounce state failed to detect oscillation');
       ...
       if (processDebounceSample(pressedH, 0).state !== 'PRESSED_DEBOUNCED') throw new Error('Debounce pressed state failed');
       ```
     `eDesc` tells the student to return `'PRESSED'`, `'RELEASED'`, or `'BOUNCING'`, whereas `eTest` expects an object `{ updatedHistory: number, state: 'PRESSED_DEBOUNCED' | 'RELEASED_DEBOUNCED' | 'BOUNCING_TRANSITION' }`!
  2. In [src/lib/data/iotEmbedded30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/iotEmbedded30DayData.ts#L75-L78) (`iot_emb` Day 4 Exam), `eDesc` never mentions the return object keys `{ voltage, lsbStepMicrovolts }` or that LSB must be scaled by `1e6` (microvolts).
  3. In [src/lib/data/bcomFinance30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomFinance30DayData.ts#L27-L38), Day 2 `title` is `"LBO Financial Modeling, M&A Accretion, Real Options & FX Risk Hedging"`, while `desc`, `syllabus`, `eTitle`, and `aTitle` are basic Time Value of Money (`Future Value FV = PV(1+r)^t` and `Rule of 72`)! Same on `iotEmbedded30DayData.ts:27,47,67` where Day 2–5 `title`s were overwritten with week-level titles from `LongLesson` while the quests test completely different Day 2–5 topics.
- **What Is Wrong**:
  Students cannot solve tasks when `eDesc` specifies the wrong return type and wrong enum strings (`'PRESSED'` vs `{ updatedHistory, state: 'PRESSED_DEBOUNCED' }`), and day titles in `*30DayData.ts` contradict the actual day syllabus and coding tasks.
- **What Should Be Done**:
  Audit and synchronize every `eDesc`/`aDesc` JSDoc return signature with the exact properties and enum literals asserted by `eTest`/`aTest` across `iotEmbedded30DayData.ts` and all `*30DayData.ts` files (similar to how `bcomEcommerce30DayData.ts` was enriched with JSDoc `@returns`), and restore matching day `title`s.
- **How To Fix + Verify**:
  Update `eDesc`/`aDesc` and `eStarter`/`aStarter` JSDoc blocks to list every property and string literal asserted in `eTest`/`aTest`, then run `npx tsx --test tests/universal_and_commerce_tasks.test.ts`.

---

#### `[FINDING-007]` `[HIGH]` `[TAG: VERIFIED-READ + STATIC-SIGNAL]`
- **Title**: Trivial Acronym/Constant Lookup Assignments (`get*FullForm`, `get*Role`, `get*ChannelName`) Across B.Com Courses (`bcom_ops`, `bcom_scrm`, `bcom_ent`, `bcom_ecom`, `bcom_dmkt`, `bcom_ana`)
- **Location**:
  - [src/lib/data/bcomOperations30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomOperations30DayData.ts#L19-L24) (`getSipocFullForm`, `getEoqBalancedCosts`, etc.)
  - [src/lib/data/bcomSalesCrm30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomSalesCrm30DayData.ts#L19-L24) (`getBudgetOwnerRole`, etc.)
  - [src/lib/data/bcomEntrepreneurship30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomEntrepreneurship30DayData.ts#L19-L24) (`getVentureCapitalStandardEntity`, etc.)
  - [src/lib/data/bcomEcommerce30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomEcommerce30DayData.ts#L19-L24) (`getD2cChannelName`, etc.)
  - [src/lib/data/bcomDigitalMarketing30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomDigitalMarketing30DayData.ts#L19-L24) (`getLinearAttributionName`, etc.)
- **Evidence**:
  In [src/lib/data/bcomOperations30DayData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomOperations30DayData.ts#L20-L23):
  ```ts
  aDesc: "Implement function getSipocFullForm() returning `'SUPPLIERS_INPUTS_PROCESS_OUTPUTS_CUSTOMERS'`. When called with an `inputTag` string, return `{ canonical: \"SUPPLIERS_INPUTS_PROCESS_OUTPUTS_CUSTOMERS\", provided: String(inputTag).trim(), isMatch }` comparing case-insensitively.",
  ```
- **What Is Wrong**:
  Originally these assignments were zero-argument constant-string getters (`getSipocFullForm() => 'SUPPLIERS_INPUTS_PROCESS_OUTPUTS_CUSTOMERS'`). To bypass a naive anti-constant-return check without writing real domain assignments, an automated patch bolted on an artificial `inputTag` case-insensitive string comparison wrapper (`{ canonical, provided, isMatch }`) across dozens of B.Com daily assignments! This teaches zero operations, sales, entrepreneurship, or marketing analytics.
- **What Should Be Done**:
  Replace all `get*FullForm` / `get*Name` / `get*Role` string-matching wrapper assignments with genuine quantitative commerce calculations (e.g., calculating safety stock `Z * sigma_d * sqrt(L)`, CAC payback months, TAM/SAM/SOM dollar funnel, or ROAS/CPA break-even).
- **How To Fix + Verify**:
  Rewrite the `aTitle`/`aDesc`/`aStarter`/`aTest` entries in those 6 B.Com `*30DayData.ts` files and run `npx tsx --test tests/universal_and_commerce_tasks.test.ts`.

---

### Group B — Gate v2 Visuals (`src/lib/data/lessonVisuals/**`, `src/lib/visuals/gate.ts`, `tests/*visuals*`)

#### `[FINDING-008]` `[BLOCKER]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: 2,784 of 3,184 Gate v2 Visual Files (`87.4%`) Fail `checkDayFile`, and 23 `node-web` Visual Files Crash `checkDayFile` with Uncaught `TypeError`
- **Location**:
  - [src/lib/visuals/gate.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/visuals/gate.ts#L204-L664) (`checkDayFile`)
  - [src/lib/data/lessonVisuals/node-web/day-37.json](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/lessonVisuals/node-web/day-37.json#L11-L29) (plus `day-38.json` and `day-40.json`..`day-60.json` — 23 crashing files)
  - [src/lib/data/lessonVisuals/ai/day-01.json](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/lessonVisuals/ai/day-01.json#L423-L560) (fails `tests/lesson_visuals_gate.test.ts` on line 150)
- **Evidence**:
  1. Running `npx tsx --test tests/lesson_visuals_gate.test.ts` (`[VERIFIED-EXEC]`) **FAILS** with exit code `1`:
     ```text
     not ok 11 - runs checkDayFile on all day files under src/lib/data/lessonVisuals/
     Error: C:\Users\Admin\Desktop\projects\Present-Career-os\src\lib\data\lessonVisuals\ai\day-01.json:
       [R5] Entry [3] ("Multi-Head Attention: Parallel Subspace Projections") step[0] label has digits: "1. Input & State"
       [R8] Entry [3] ("Multi-Head Attention: Parallel Subspace Projections") step[0] caption has no content word (>=4 chars) from say[1]
       [R12] Entry [3] ("Multi-Head Attention: Parallel Subspace Projections") codeHash mismatch
     ```
  2. Reading [src/lib/data/lessonVisuals/ai/day-01.json](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/lessonVisuals/ai/day-01.json#L425-L455) (`[VERIFIED-READ]`) reveals corrupted regex-replacement text where digits were blindly replaced with words inside brackets:
     ```json
     "caption": "Execute core transformation in Multi-Head Attentio... [Done.Pfour.Stwo].",
     "caption": "Inspect concrete example output and invariants [Done.Pfour.object-storage].",
     "caption": "Challenge: apply the tryIt modification [Done.Pfour.Sfour]."
     ```
  3. Reading [src/lib/data/lessonVisuals/node-web/day-37.json](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/lessonVisuals/node-web/day-37.json#L11-L29) (`[VERIFIED-READ]`):
     ```json
     "template": "compare",
     "title": "Distributed Locking: Single-Instance vs Multi-Node Redlock",
     "left": { "title": "Single-Instance Redis Lock", "points": [...] },
     "right": { "title": "Multi-Node Redlock Quorum", "points": [...] }
     ```
     Because `spec.columns` is `undefined`, [src/lib/visuals/gate.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/visuals/gate.ts#L242) (`spec.columns.filter(...)`) throws an uncaught `TypeError: Cannot read properties of undefined (reading 'filter')` on 23 files in `node-web` (`day-37`, `day-38`, `day-40..60`)!
  4. Across all 53 directories (`3,184` files), executing `checkDayFile` (`scratch/visuals_exact_report.json` `[VERIFIED-EXEC]`) shows **only 3 courses (`python`, `dsa-py`, `fullstack-js`) pass 60/60 files**. Overall: **`400` pass, `2,784` fail**.
- **What Is Wrong**:
  87.4% of the platform's visual specifications violate Gate v2 (`R12` stale `codeHash`, `R6` forbidden filler tokens, `R8` ungrounded captions, `R5` digits in labels/captions, `R4`/`R9` step/tryIt violations), and 23 files in `node-web` use an invalid `compare` schema (`left`/`right` instead of `columns`) that crashes the validator and renderer.
- **What Should Be Done**:
  1. Fix `src/lib/visuals/gate.ts:242` to guard `Array.isArray(spec.columns)` instead of throwing an uncaught `TypeError`, and convert the 23 `node-web` `day-37..60.json` `compare` specs from `{ left, right }` to the canonical `columns: [{ id, title, traits }]` schema.
  2. Replace all synthetic `[Done.Pfour.Stwo]` / `Multi-Head Attentio...` placeholder entries in `ai`, `ai-py`, `cloud`, `cyber`, `dist`, `devops`, `dsa-optim`, `sql-mastery`, `sre-web`, `stream-web`, `aideploy-web`, `train-py`, `vec-py`, `safe-py`, `quant-py`, `cloud-py`, `cyber-py`, `dist-py`, `nlp-py`, `prompt-py`, `react-basics`, and recompute `codeHash` across all 53 directories after lesson code is finalized.
- **How To Fix + Verify**:
  Fix the visual specs and recompute `codeHash`, then run:
  ```powershell
  npx tsx scripts/visuals/check.mts --all
  ```

---

#### `[FINDING-009]` `[BLOCKER]` `[TAG: VERIFIED-READ]`
- **Title**: Domain Visual Verification Tests (`tests/*_visuals_verification.test.ts`) Neutralize `codeHash` Integrity Checks via `|| (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16)`, and `tests/lesson_visuals_gate.test.ts` Skips 30+ Courses
- **Location**:
  - [tests/bcom_flagship_visuals_verification.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/bcom_flagship_visuals_verification.test.ts#L53-L57)
  - [tests/iot_hardware_visuals_verification.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/iot_hardware_visuals_verification.test.ts#L38-L42) (and lines `86`, `138`, `190`, `242`)
  - [tests/advanced_systems_visuals_verification.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/advanced_systems_visuals_verification.test.ts#L46-L50) (and lines `95`, `142`, `189`, `234`)
  - [tests/launchpad_core_visuals_verification.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/launchpad_core_visuals_verification.test.ts#L43-L47) (and line `90`)
  - [tests/lesson_visuals_gate.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/lesson_visuals_gate.test.ts#L137-L148)
- **Evidence**:
  In [tests/bcom_flagship_visuals_verification.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/bcom_flagship_visuals_verification.test.ts#L53-L57):
  ```ts
  const expectedHash = computeCodeHash(lessonPart.code || '');
  assert.ok(
    entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16),
    `${course.prefix} day-${dayStr} part ${pIdx + 1} codeHash valid`
  );
  ```
  And in [tests/lesson_visuals_gate.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/lesson_visuals_gate.test.ts#L137-L147), `walk(root)` filters directories by `CERT_24M_COURSES.includes(relPath)`, completely excluding `30` of the `53` visual directories (`bcom_*`, `iot_*`, `comp_fund`, `git_vcs`, `excel_viz`, `soft-skills`, `java-basics`, `mobile`, `fullstack-js`, `blockchain`, `g3d`, `quant-systems`)!
- **What Is Wrong**:
  Computing `expectedHash = computeCodeHash(lessonPart.code)` and then asserting `entry.codeHash === expectedHash || entry.codeHash.length >= 16` is a deliberate test-rigging anti-pattern: **any** non-empty 16+ character string passes even when `entry.codeHash !== expectedHash`! That is why all 4 domain visual test suites reported `100% PASS` while thousands of `R12` (`codeHash` mismatch) errors existed across those exact files (`iot_sec`: 1,054 R12 errors; `iot_emb`: 1,030 R12 errors; `java-basics`: 859 R12 errors; `bcom_scrm`: 754 R12 errors).
- **What Should Be Done**:
  1. Remove `|| (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16)` from all 4 `tests/*_visuals_verification.test.ts` files and call `checkDayFile(dayFile)` directly.
  2. Remove the `CERT_24M_COURSES` filter in `tests/lesson_visuals_gate.test.ts:144` so `lesson_visuals_gate.test.ts` checks **all 53 directories** under `src/lib/data/lessonVisuals/`.
- **How To Fix + Verify**:
  Edit the 5 visual test files to enforce strict `entry.codeHash === expectedHash` and full Gate v2 `checkDayFile`, then run:
  ```powershell
  npx tsx --test tests/lesson_visuals_gate.test.ts tests/bcom_flagship_visuals_verification.test.ts tests/iot_hardware_visuals_verification.test.ts tests/advanced_systems_visuals_verification.test.ts tests/launchpad_core_visuals_verification.test.ts
  ```

---

#### `[FINDING-010]` `[CRITICAL]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: 6,924 Gate v2 `R6` Filler Errors in `react-basics` and 2,496 `R6` Errors in `nlp-py` Visual Captions
- **Location**:
  - `src/lib/data/lessonVisuals/react-basics/day-01.json` through `day-60.json`
  - `src/lib/data/lessonVisuals/nlp-py/day-01.json` through `day-60.json`
- **Evidence**:
  Our exact Gate v2 sweep (`scratch/visuals_exact_report.json` `[VERIFIED-EXEC]`) recorded:
  - `react-basics`: `60/60` files fail (`R6: 6924`, `R12: 212`, `R5: 195`, `R8: 38`, `R1: 30`, `R9: 8`)
  - `nlp-py`: `60/60` files fail (`R6: 2496`, `R8: 624`, `R12: 432`, `R5: 45`, `R2: 2`)
- **What Is Wrong**:
  Every visual step caption in `react-basics` and `nlp-py` was generated with banned template filler words (`R6`) and ungrounded generic phrases (`R8`).
- **What Should Be Done**:
  Regenerate the visual step captions and labels for `react-basics` and `nlp-py` from each part's actual `say[]` and `code` tokens so every step satisfies `R5`, `R6`, `R8`, and `R12`.
- **How To Fix + Verify**:
  Run `npx tsx scripts/visuals/check.mts --course react-basics` and `npx tsx scripts/visuals/check.mts --course nlp-py` until `0` errors remain.

---

#### `[FINDING-011]` `[HIGH]` `[TAG: VERIFIED-EXEC]`
- **Title**: Orphan Visual Files `day-61.json` through `day-64.json` in `src/lib/data/lessonVisuals/iot_net/`
- **Location**:
  - `src/lib/data/lessonVisuals/iot_net/day-61.json` .. `day-64.json`
- **Evidence**:
  In `scratch/visuals_exact_report.json` (`[VERIFIED-EXEC]`): `iot_net` has `totalFiles: 64` (`day-01.json` through `day-64.json`), while `iot_net` only has `60` days of lessons in `longLessons.ts`, causing `day-61.json`..`day-64.json` to fail with `No LongLesson found for iot_net day 61..64`.
- **What Is Wrong**:
  4 orphan visual JSON files (`day-61..64.json`) sit inside `src/lib/data/lessonVisuals/iot_net/` with no corresponding lessons.
- **What Should Be Done**:
  Delete `src/lib/data/lessonVisuals/iot_net/day-61.json` through `day-64.json`.
- **How To Fix + Verify**:
  Remove the 4 orphan files and run `npx tsx scripts/visuals/check.mts --course iot_net`.

---

### Group C — Courses & Long Lessons (`*LongLessons.ts`, `longLessons.ts`)

#### `[FINDING-012]` `[BLOCKER]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: 1,650 Month-2 Lesson Parts Across 11 Python & Web Courses (`ai-py`, `dist-py`, `cloud-py`, `quant-py`, `cyber-py`, `train-py`, `vec-py`, `safe-py`, `sre-web`, `stream-web`, `aideploy-web`) Are Verbatim Boilerplate Clones Implementing a Fake 6-Line `utilization = (load * weight) / capacity` Stub
- **Location**:
  - [src/lib/data/aiPythonLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/aiPythonLongLessons.ts#L7200-L14510) (Days 31–60, 150 parts)
  - Plus Days 31–60 (150 parts each) of `dist-py`, `cloud-py`, `quant-py`, `cyber-py`, `train-py`, `vec-py`, `safe-py`, `sre-web`, `stream-web`, `aideploy-web`
- **Evidence**:
  Inspected word-for-word at [src/lib/data/aiPythonLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/aiPythonLongLessons.ts#L7228-L7330) (`[VERIFIED-READ]`) and swept across all 11 courses (`scratch/lessons_visuals_report.json` `[VERIFIED-EXEC]`):
  - All `150` Month-2 parts in each of the 11 courses (`1,650 parts` total) have `< 580` total words and `< 450` `say` words (~220 `say` words per part).
  - Every single part repeats the exact same 4 verbatim paragraphs across all 150 parts (`596–728` duplicate paragraph hits per course):
    - `"Notice how our implementation models the core state transitions explicitly: every input parameter is validated, intermediate metrics are computed without side effects, and the output dictionary captures both the primary decision and diagnostic telemetry."`
    - `"For slow or methodical readers: step through each line of the code sample in sequence, comparing how the first test case represents nominal operation while the second test case stresses boundary or failure thresholds."`
    - `"When integrating this pattern into a larger system, always pair the core calculation with structured logging and unit assertions so any regression in upstream inputs is caught immediately during continuous integration."`
    - `"Take a moment to inspect the concrete execution output below and test your understanding with the interactive prompt and Socratic verification check."`
  - Every single part uses the exact same `example`: `"Think of an air-traffic control tower managing runway capacity for <Title>: controllers track real-time utilization and reserve a 15% safety buffer (85% threshold) so sudden weather diversions never cause a gridlock."`
  - Worse, **Prose-vs-Code Betrayal**: Every single part's `code` block implements the exact same toy arithmetic function (`utilization = round((load * weight) / capacity, 4); headroom = round(max(0.0, 1.0 - utilization), 4); healthy = utilization <= 0.85`), merely renaming the function to `analyze_hybrid_rag_core`, `analyze_cross_encoder_core`, etc.!
- **What Is Wrong**:
  11 complete Month-2 tracks (`330 course-days`, `1,650 lesson parts`) do not teach their advertised subjects at all in Month 2. A student studying Day 31 "Reciprocal Rank Fusion (RRF) over BM25 & Dense Vectors" or Day 32 "Cross-Encoder Reranking" is shown `utilization = (load * weight) / capacity <= 0.85` 150 times in a row! And `tests/python_track_long_lessons.test.ts` and `tests/web_track_long_lessons.test.ts` passed only because they never checked minimum word count (`>= 580`), duplicate paragraphs, or boilerplate code on Days 31–60!
- **What Should Be Done**:
  Replace Days 31–60 across all 11 courses (`ai-py`, `dist-py`, `cloud-py`, `quant-py`, `cyber-py`, `train-py`, `vec-py`, `safe-py`, `sre-web`, `stream-web`, `aideploy-web`) with authentic, domain-specific 5-part lessons (`>= 580` total words, `>= 450` `say` words, zero duplicated boilerplate paragraphs) where `part.code` genuinely implements the algorithm named in `part.title` (e.g., actual RRF score fusion `1 / (k + rank)`, actual cross-encoder logit scoring, etc.).
- **How To Fix + Verify**:
  Expand and replace the Month-2 lessons in those 11 files, add `>= 580` word and duplicate-paragraph assertions to `tests/python_track_long_lessons.test.ts` and `tests/web_track_long_lessons.test.ts`, and run:
  ```powershell
  npx tsx --test tests/python_track_long_lessons.test.ts tests/web_track_long_lessons.test.ts
  ```

---

#### `[FINDING-013]` `[CRITICAL]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: 5,500+ Lesson Parts Violate the `>= 580` Total Word / `>= 450` `say` Word Contract Across Python M1, Systems M1, IoT M1, and AI/NLP/Mobile/G3D Courses
- **Location**:
  - Month 1 (Days 1–30) of `python`, `sql-mastery`, `dsa-py`, `ai-py`, `dist-py`, `cloud-py`, `nlp-py`, `quant-py`, `prompt-py`, `cyber-py`, `train-py`, `vec-py`, `safe-py` (`180/180` M1 parts per course under 580 words; e.g., [src/lib/data/aiPythonLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/aiPythonLongLessons.ts#L18-L50) Day 1 Part 1 has only `142` `say` words!)
  - Month 1 (Days 1–30) of `iot_emb` ([src/lib/data/iotEmbLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/iotEmbLongLessons.ts#L16-L53) — Day 1 Part 1 has only `114` `say` words; `150/150` M1 parts under 580 words), `iot_edge` (`150/150` M1 parts under 580 words), `iot_sec` (`150/150` M1 parts under 580 words)
  - `devops`, `cloud`, `design`, `dsa-optim`, `dist`, `cyber`, `ai` (`159–180` M1 parts per course under 580 words)
  - `g3d` (`300/300` parts under 580 words), `mobile` (`150/300` parts under 580 words), `blockchain` (`150/300`), `quant-systems` (`150/300`), `excel_viz` (`150/300`), `git_vcs` (`145/300`), `soft-skills` (`152/300`), `bcom_ana` (`150/300`), `bcom_ops` (`140/300`), `bcom_ait` (`130/300`), `bcom_scrm` (`150/300`), `bcom_ent` (`35/300`), `bcom_law` (`75/300`), `bcom_tax` (`50/300`)
- **Evidence**:
  In [src/lib/data/iotEmbLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/iotEmbLongLessons.ts#L17-L24) (`[VERIFIED-READ]`):
  `say` consists of 6 single-sentence bullets totaling `114` words.
  In [tests/known_lesson_defects.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/known_lesson_defects.ts#L1-L17) (`[VERIFIED-READ]`):
  `KNOWN_SHORT_PARTS` only checks a 160-word minimum on web courses and exempts 10 parts even from that 160-word floor!
- **What Is Wrong**:
  The platform's pedagogical contract (`>= 580` total words and `>= 450` `say` words per part) is only met in recently expanded slices (such as `bcom-accounting`, `bcom-finance`, `bcom-marketing`, `bcom_aud`, `bcom_ban`, `bcom_dmkt`, `bcom_ecom`, `java-basics`, `comp_fund`, and `iot_net`). Over `5,500` parts across the remaining courses contain brief 110–250 word summaries.
- **What Should Be Done**:
  Expand all sub-580-word parts across the flagged Month-1 and Month-2 courses to meet the `>= 580` total word / `>= 450` `say` word invariant with authentic technical depth (not template filler).
- **How To Fix + Verify**:
  Expand the short lesson parts and add a global `>= 580` total words / `>= 450` `say` words gate across all 59 prefixes.

---

#### `[FINDING-014]` `[CRITICAL]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: 100% Answer Index `0` Bias & Severe Option Length Giveaway (`> 1.8x`) Across 35+ Courses
- **Location**:
  - `100%` of all 300 MCQ checks (`[300, 0, 0, 0]`) in: `react-basics`, `node-web`, `git_vcs`, `iot_emb`, `quant-systems`, `excel_viz`, `blockchain`, `mobile`, `iot_edge`, `iot_sec`, `iot_net`, `bcom_ana`, `bcom_ait`, `bcom-finance`, `bcom-accounting`, `bcom_dmkt`, `bcom-marketing`, `bcom_tax`, `bcom_aud` (`[VERIFIED-EXEC]` via `scratch/lessons_visuals_report.json`)
  - `90%+` of all 300 MCQ checks in: `comp_fund` (`[296, 4, 0, 0]`), `bcom_ops` (`[260, 10, 20, 10]`), `bcom_scrm` (`[290, 3, 4, 3]`), `bcom_ent` (`[279, 7, 7, 7]`), `bcom_ecom` (`[292, 3, 3, 2]`), `bcom_ban` (`[290, 3, 4, 3]`), `bcom_law` (`[269, 10, 11, 10]`), `java-basics` (`[226, 25, 25, 24]`), `g3d` (`[225, 25, 25, 25]`)
  - Plus severe length giveaway (`maxLen / secondMaxLen > 1.8` or `maxLen / minLen > 1.8` where the longest option is the right answer): `bcom-accounting` (`288/300` parts), `react-basics` (`284/300`), `bcom_dmkt` (`264/300`), `bcom-marketing` (`263/300`), `bcom_ecom` (`263/300`), `bcom_ban` (`241/300`), `bcom_aud` (`234/300`), `comp_fund` (`226/300`), `bcom-finance` (`226/300`), `iot_net` (`215/300`), `iot_emb` (`203/300`).
- **Evidence**:
  In [src/lib/data/iotEmbLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/iotEmbLongLessons.ts#L44-L51) (`[VERIFIED-READ]`):
  ```json
  "options": [
    "A microcontroller integrates CPU, RAM, flash memory, and peripherals onto a single silicon die",
    "A microcontroller cannot execute compiled C++ code",
    "A microcontroller always runs an x86 operating system"
  ],
  "answer": 0
  ```
- **What Is Wrong**:
  A student can pass almost every lesson check across 35+ courses without reading a single word of the lesson simply by clicking the first (and longest) option (`index 0`) every time!
- **What Should Be Done**:
  Deterministically permute `part.check.options` across every course so `answer` (and `answerIndex`) is evenly distributed (`~25%` each across `0, 1, 2, 3`), and rewrite short joke distractors so all options have balanced length (`max/min <= 1.5`) and plausible technical depth.
- **How To Fix + Verify**:
  Permute options and update `answer` + `answerIndex` in unison across all `*LongLessons.ts` files, then verify uniform distribution (`20%–30%` per index) via test assertion.

---

#### `[FINDING-015]` `[CRITICAL]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: Widespread Boilerplate Meta-Commentary (`"For slow or methodical readers"`, `"Fast readers can scan"`, `"When studying <Title> within <DayTitle>"`) Across `comp_fund`, `java-basics`, `git_vcs`, and Month-2 Python/Web Courses
- **Location**:
  - [src/lib/data/compFundLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/compFundLongLessons.ts#L20-L21) (and lines `68-69`, `113-114` — `298 of 300` parts in `comp_fund`!)
  - [src/lib/data/javaBasicsLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/javaBasicsLongLessons.ts#L34-L80) (`300 of 300` parts in `java-basics` contain `"For slow readers..."` / `"For fast readers..."`)
  - `git_vcs` (`155 of 300` parts), plus `150 of 330` parts in `ai-py`, `dist-py`, `cloud-py`, `quant-py`, `cyber-py`, `train-py`, `vec-py`, `safe-py`, `sre-web`, `stream-web`, `aideploy-web`
- **Evidence**:
  In [src/lib/data/compFundLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/compFundLongLessons.ts#L20-L21) (`[VERIFIED-READ]`):
  > `"When studying The Hierarchical Single-Root File Tree within POSIX File System Navigation, Pipelines & File Streams, pay close attention to how each state transition is structured for both rapid intuition and step-by-step verification. Fast readers can scan the core invariants and output metrics directly, while slow or methodical readers should trace how the input parameters flow through pwd, mkdir, workspace, project line by line before inspecting the final result."`
  > `"In production engineering and operational workflows, mastering The Hierarchical Single-Root File Tree prevents subtle edge-case failures when inputs scale or boundary conditions are triggered. Always verify that your mental model matches the exact deterministic output produced by the code block, and use the interactive practice prompt below to test how modifying a single threshold or input value changes the system behavior."`
- **What Is Wrong**:
  To artificially pad word counts past 580 words, a script injected the exact same 2-paragraph meta-commentary (`"When studying <PartTitle> within <DayTitle>... Fast readers can scan... while slow or methodical readers should trace..."`) into **298 of 300 parts** of `comp_fund` and `155 of 300` parts of `git_vcs`!
- **What Should Be Done**:
  Strip all templated `"When studying ... Fast readers can scan ... slow or methodical readers"` paragraphs from `comp_fund`, `git_vcs`, `java-basics`, and the 11 Python/Web courses, and replace them with genuine technical explanation specific to the part's topic.
- **How To Fix + Verify**:
  Replace the template paragraphs and add a banned-phrase check for `/slow or methodical readers|Fast readers can scan|When studying .* within/i` to the long-lesson test suites.

---

#### `[FINDING-016]` `[HIGH]` `[TAG: VERIFIED-EXEC]`
- **Title**: Part-Count Contract Mismatch (`6` Parts in Month 1 vs `5` Parts in Month 2) Across 22 Courses, and Missing `summary` / `projectStep` Fields in Month 1 of 40+ Courses
- **Location**:
  - 22 courses with `6` parts/day in Days 1–30 and `5` parts/day in Days 31–60 (`scratch/visuals_exact_report.json:1271-1549` `[VERIFIED-EXEC]`): `python`, `sql-mastery`, `dsa-py`, `ai-py`, `dist-py`, `cloud-py`, `nlp-py`, `quant-py`, `prompt-py`, `cyber-py`, `train-py`, `vec-py`, `safe-py`, `devops`, `cloud`, `design`, `dsa-optim`, `dist`, `cyber`, `ai`, `sre-web`, `stream-web`, `aideploy-web`, `ai_prompt`, `nlp`.
  - Missing `summary` and/or `projectStep` on `30 to 60` days across 45+ courses (`scratch/lessons_visuals_report.json` `[VERIFIED-EXEC]`; e.g., [src/lib/data/bcomAccountingLongLessons.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/bcomAccountingLongLessons.ts#L8-L16) has `goal`, `minutes`, `recap`, `parts` but no `summary` or `projectStep`).
- **Evidence**:
  In `scratch/visuals_exact_report.json:1271-1279` (`[VERIFIED-EXEC]`):
  `"python": { "totalDays": 60, "m1Parts": { "6": 30 }, "m2Parts": { "5": 30 } }`.
- **What Is Wrong**:
  While `longLessonTypes.ts` makes `summary` and `projectStep` optional (`?`), the 5-part `LongLesson` structural standard is violated in Month 1 of 22 courses (which have 6 parts/day) and `summary`/`projectStep` are missing on Days 1–30 of almost every course except `java-basics`.
- **What Should Be Done**:
  Standardize the `LongLesson` schema contract across all 60 days (either enforcing `summary` and `projectStep` on all 60 days or formally documenting their optionality in `audit/CONTRACTS.md`, and reconciling the 6-part vs 5-part split with Gate v2 `R1`).
- **How To Fix + Verify**:
  Populate missing `summary` and `projectStep` fields on Days 1–30 and verify via schema test.

---

#### `[FINDING-017]` `[HIGH]` `[TAG: VERIFIED-EXEC + STATIC-SIGNAL]`
- **Title**: 2,100+ Template `tryIt` Prompts Across `java-basics` (150), `mobile` (150), `blockchain` (139), `quant-systems` (124), `excel_viz` (104), and B.Com/IoT Courses
- **Location**:
  - Swept across all 59 prefixes in `scratch/lessons_visuals_report.json` (`[VERIFIED-EXEC]`):
    `java-basics` (`150` template `tryIt`s), `mobile` (`150`), `blockchain` (`139`), `quant-systems` (`124`), `excel_viz` (`104`), `bcom_ana` (`86`), `bcom-finance` (`78`), `bcom_ops` (`78`), `g3d` (`77`), `bcom_ait` (`68`), `iot_edge` (`66`).
- **Evidence**:
  Prompts matching `/^(Modify|Change|Update|Test what happens|Try changing|In the .* code editor, adjust)/i` or failing to reference concrete identifiers inside `part.code`.
- **What Is Wrong**:
  Hundreds of `tryIt` prompts use repetitive fill-in-the-blank phrasing (`"In the ... code editor, adjust..."` or `"Modify the threshold parameter..."`) instead of specific, Socratic code experiments anchored to real variables in `part.code`.
- **What Should Be Done**:
  Rewrite template `tryIt` prompts to name specific identifiers/literals in `part.code` and state the exact output change the student should observe.
- **How To Fix + Verify**:
  Update flagged `tryIt` strings and verify against Gate v2 `R9` (`checkDayFile`).

---

#### `[FINDING-018]` `[MEDIUM]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: `codeNotes` Schema Drift (`string[]` vs `{ line: number; note: string }[]` vs `{ line: number; text: string }[]`)
- **Location**:
  - [src/lib/data/longLessonTypes.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/longLessonTypes.ts#L36)
  - `src/lib/data/cloudLongLessons.ts` and multiple `*LongLessons.ts` files (`[VERIFIED-EXEC]`)
- **Evidence**:
  In [src/lib/data/longLessonTypes.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/longLessonTypes.ts#L36):
  ```ts
  codeNotes?: { line: number; text?: string; note?: string }[] | string[];
  ```
  During our programmatic sweep, inspecting `part.codeNotes` revealed a mix of `string[]` (in `cloud`), `{ line, note }` (in `iot_emb`, `comp_fund`, `java-basics`), and `undefined` (in `bcom-accounting`).
- **What Is Wrong**:
  Consumers expecting `{ line: number, note: string }` fail or drop notes when `codeNotes` is `string[]` or `{ line, text }`.
- **What Should Be Done**:
  Normalize all `codeNotes` across all `*LongLessons.ts` files to `{ line: number; note: string }[]` where `1 <= line <= code.split('\n').length`.
- **How To Fix + Verify**:
  Run a normalization pass and tighten `LongLessonPart['codeNotes']` in `longLessonTypes.ts` to `ReadonlyArray<{ line: number; note: string }>`.

---

### Group D — Course Certification Tests & Block Exams (`courseTests*.ts`, `blockTests.ts`)

#### `[FINDING-019]` `[CRITICAL]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: All 408 Official Course Certification Test Questions (`courseTests*.ts`) Lack Explanations (`why` / `explanation` Missing on 100% of Questions), 27 of 51 Course Packs Never Use `correctIndex: 0`, and 195 Questions Have Severe Option Length Skew
- **Location**:
  - [src/lib/data/courseTestsCore.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/courseTestsCore.ts#L1-L179)
  - `src/lib/data/courseTests*.ts` (all 51 course packs, `408` questions total)
  - [tests/course_tests.test.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/tests/course_tests.test.ts#L1-L128)
- **Evidence**:
  In [src/lib/data/courseTestsCore.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/courseTestsCore.ts#L3-L10) (`[VERIFIED-READ]`):
  ```ts
  export interface CourseTestQuestion {
    id: string;
    question: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    topic: string;
  }
  ```
  And in `scratch/tasks_puzzles_report.json` (`[VERIFIED-EXEC]`):
  - `missingWhyCount: 408` (`100%` of the 408 questions have no `why` or `explanation` field!).
  - Across 27 of the 51 courses (`course-devops-cloud`, `course-cloud-aws`, `course-system-design`, `course-dsa-algorithmic`, `course-distributed`, `course-cybersecurity`, `course-ai-engineering`, `course-sre-web`, `course-stream-web`, `course-aideploy-web`, `course-python-backend`, `course-sql-mastery`, `course-dsa-python`, `course-ai-python`, `course-distributed-python`, `course-cloud-python`, `course-nlp-python`, `course-quant-python`, `course-ai-prompt-python`, `course-cyber-python`, `course-train-python`, `course-vector-python`, `course-safety-python`, `comp_fund`, `git_vcs`, `iot_emb`, `quant-systems`, `excel_viz`), the `correctIndex` distribution is **`[0, 3, 3, 2]` or `[0, 2, 3, 3]`** — index `0` is **never** the correct answer (`0/8`) in 27 consecutive course exams!
  - `195 of 408` questions (`47.8%`) have severe option length skew (`max/min > 1.8`).
- **What Is Wrong**:
  1. `CourseTestQuestion` omits post-assessment rationales (`why`), so students reviewing or failing a certification exam receive zero explanation of why an answer is right or wrong.
  2. An earlier script that shifted answers away from index `0` overcorrected on 27 courses so that `correctIndex: 0` NEVER appears (`0%` frequency across 216 questions), creating an obvious `[1, 2, 3]` pattern (`1, 2, 3, 1, 2, 3, 1, 2` in `courseTestsCore.ts:44-98`!).
- **What Should Be Done**:
  1. Add a mandatory `why: string` (`>= 60 chars`) field to `CourseTestQuestion` across all 408 questions.
  2. Re-balance `correctIndex` across all 51 courses so every course pack of 8 questions has an exact `[2, 2, 2, 2]` distribution across indices `0, 1, 2, 3`, and equalize distractor lengths (`max/min <= 1.5`).
- **How To Fix + Verify**:
  Update `CourseTestQuestion` in `courseTestsCore.ts` and all `courseTests*.ts` packs, add `[2, 2, 2, 2]` balance and `why.length >= 60` assertions to `tests/course_tests.test.ts`, and run:
  ```powershell
  npx tsx --test tests/course_tests.test.ts
  ```

---

#### `[FINDING-020]` `[HIGH]` `[TAG: VERIFIED-READ]`
- **Title**: `blockTests.ts` Generates Synthetic Meta-Trivia Block Exams with Predictable `correctIndex: day % 4`
- **Location**:
  - [src/lib/data/blockTests.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/blockTests.ts#L1-L103)
- **Evidence**:
  In [src/lib/data/blockTests.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/blockTests.ts#L50-L94) (`[VERIFIED-READ]`):
  ```ts
  const correctIdx = (d.day + idx) % 4;
  ...
  question: `In ${courseTitle} (Day ${d.day}: ${d.title}), which core concept or milestone deliverable is covered?`,
  ```
- **What Is Wrong**:
  Instead of testing domain comprehension at each 6-day block boundary, `blockTests.ts` auto-generates superficial syllabus-matching trivia (`"In <Course> (Day X: <Title>), which core concept or milestone deliverable is covered?"`) by pulling strings from `syllabus[]` of other days as distractors, with a deterministic `(d.day + idx) % 4` answer index and no `why` explanation.
- **What Should Be Done**:
  Either draw block-exam questions from the verified `part.check` Socratic pool of those 6 days (`longLessons.ts`) with full `why` explanations, or author dedicated conceptual block assessments.
- **How To Fix + Verify**:
  Update `buildBlockTestsForCourse` in `src/lib/data/blockTests.ts` to source real technical MCQs + explanations from the block's days.

---

### Group E — CodeWars Arena, Sandboxes & Language Runners (`codeWars*`, `src/lib/code/runners/*`)

#### `[FINDING-021]` `[HIGH]` `[TAG: VERIFIED-READ]`
- **Title**: `codeWarsSandbox.ts` Over-Blocks Valid Student Code Containing Common English Words (`process`, `import`, `fs`, `global`, `prototype`) Inside Comments or Identifiers
- **Location**:
  - [src/lib/server/codeWarsSandbox.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/server/codeWarsSandbox.ts#L26-L49)
- **Evidence**:
  In [src/lib/server/codeWarsSandbox.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/server/codeWarsSandbox.ts#L26-L44) (`[VERIFIED-READ]`):
  ```ts
  const FORBIDDEN_JS_PATTERNS: ReadonlyArray<{ pattern: RegExp; label: string }> = [
    { pattern: /\bprocess\b/i, label: 'process access' },
    { pattern: /\brequire\b/i, label: 'CommonJS require()' },
    { pattern: /\bimport\b/i, label: 'dynamic/static import' },
    { pattern: /\bchild_process\b/i, label: 'child_process module' },
    { pattern: /\bfs\b/i, label: 'filesystem module' },
    ...
    { pattern: /\bglobal\b/i, label: 'Node global object' },
    ...
    { pattern: /\bprototype\b/i, label: 'prototype manipulation' },
  ];
  ```
  And in `validateCodeSecurity(code)` (lines `51-59`), `FORBIDDEN_JS_PATTERNS` is tested against raw `code` **without stripping comments or string literals first**!
- **What Is Wrong**:
  If a student writes a comment like `// Process the input array and return global max` or names a variable `const processItem = ...` or `const fsRate = ...` in a CodeWars Arena JS/TS challenge, `validateCodeSecurity` immediately rejects their submission with `SECURITY_VIOLATION: Forbidden construct detected (process access)`!
- **What Should Be Done**:
  Strip single-line (`//...`) and multi-line (`/*...*/`) comments before running regex checks in `validateCodeSecurity`, and tighten `/\bprocess\b/i` and `/\bfs\b/i` so they do not false-positive on comments or case-insensitive prose (`Process`).
- **How To Fix + Verify**:
  Update `validateCodeSecurity` in `src/lib/server/codeWarsSandbox.ts` to strip comments first and add a unit test in `tests/brutal_adversarial_arena_audit.test.ts` verifying that `// process each item in global list` passes security validation while `process.exit(1)` is blocked.

---

#### `[FINDING-022]` `[HIGH]` `[TAG: VERIFIED-READ]`
- **Title**: Hardcoded Developer Machine Path (`C:\Users\vinay\pgsql18\...`) in `src/lib/code/runners/pythonRunner.ts`
- **Location**:
  - [src/lib/code/runners/pythonRunner.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/code/runners/pythonRunner.ts#L198-L210)
- **Evidence**:
  In [src/lib/code/runners/pythonRunner.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/code/runners/pythonRunner.ts#L201-L207) (`[VERIFIED-READ]`):
  ```ts
  const candidates = [
    process.env.PYTHON_BIN,
    'python3',
    'python',
    'C:\\Users\\vinay\\pgsql18\\pgsql\\pgAdmin 4\\python\\python.exe',
  ].filter(Boolean) as string[];
  ```
- **What Is Wrong**:
  A personal developer filesystem path (`C:\Users\vinay\pgsql18\pgsql\pgAdmin 4\python\python.exe`) is hardcoded inside production source code (`src/lib/code/runners/pythonRunner.ts`).
- **What Should Be Done**:
  Remove the hardcoded `C:\Users\vinay\...` path and rely on `process.env.PYTHON_BIN`, `'python3'`, `'python'`, and `'py'` (Windows Python Launcher).
- **How To Fix + Verify**:
  Edit `src/lib/code/runners/pythonRunner.ts:205` and run `npx tsx --test tests/python_practice_tasks.test.ts`.

---

#### `[FINDING-023]` `[MEDIUM]` `[TAG: VERIFIED-EXEC + VERIFIED-READ]`
- **Title**: `codeWarsRegistryData.ts` Does Not Include `starterCode` (Split Registry Architecture Between `codeWarsApi.ts` and `codeWarsRegistryData.ts`)
- **Location**:
  - [src/lib/data/codeWarsRegistryData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/codeWarsRegistryData.ts#L1-L50)
  - [src/lib/api/codeWarsApi.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/api/codeWarsApi.ts#L1-L120)
- **Evidence**:
  `CODEWARS_PROBLEM_REGISTRY` in `codeWarsRegistryData.ts` stores `id`, `title`, `difficulty`, `category`, `functionName`, `testCases`, `hiddenTestCases`, and `referenceSolutions`, while `starterCode` and `description` live separately in `CODE_WARS_PROBLEMS_CATALOG` inside `src/lib/api/codeWarsApi.ts`.
- **What Is Wrong**:
  While all 180 problems pass reference and adversarial execution (`tests/arena_all_180_questions_deep_audit.test.ts` — `181/181 PASS` `[VERIFIED-EXEC]`), splitting problem metadata across two huge files (`codeWarsRegistryData.ts` and `codeWarsApi.ts`) creates a maintenance hazard if a function signature or `functionName` is updated in one file without the other.
- **What Should Be Done**:
  Add a schema parity assertion in `tests/arena_all_180_questions_deep_audit.test.ts` verifying that every problem's `starterCode` in `CODE_WARS_PROBLEMS_CATALOG` declares the exact `functionName` registered in `CODEWARS_PROBLEM_REGISTRY` across all 4 languages (`javascript`, `python`, `java`, `cpp`).
- **How To Fix + Verify**:
  Add the cross-file signature assertion to `tests/arena_all_180_questions_deep_audit.test.ts` and run `npx tsx --test tests/arena_all_180_questions_deep_audit.test.ts`.

---

### Group F — Infrastructure, Catalog Parity & API Contracts (`coursesCatalog.ts`, `audit/contracts.json`)

#### `[FINDING-024]` `[BLOCKER]` `[TAG: VERIFIED-READ]`
- **Title**: 14 Courses Registered in `COURSES_REGISTRY` (`coursesData.ts`) Are Completely Missing from `COURSES_CATALOG` (`coursesCatalog.ts`)
- **Location**:
  - [src/lib/data/coursesCatalog.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/coursesCatalog.ts#L1-L345) (`39` courses)
  - [src/lib/data/coursesData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/coursesData.ts#L470-L605) (`53` courses in `COURSES_REGISTRY`)
- **Evidence**:
  Comparing the keys of `COURSES_REGISTRY` ([src/lib/data/coursesData.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/coursesData.ts#L473-L527)) against `COURSES_CATALOG` ([src/lib/data/coursesCatalog.ts](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/coursesCatalog.ts#L19-L345)) (`[VERIFIED-READ]`) proves that **14 full courses** in `COURSES_REGISTRY` do not exist in `COURSES_CATALOG`:
  1. `course-sre-web`
  2. `course-stream-web`
  3. `course-aideploy-web`
  4. `course-dsa-python`
  5. `course-ai-python`
  6. `course-distributed-python`
  7. `course-cloud-python`
  8. `course-nlp-python`
  9. `course-quant-python`
  10. `course-ai-prompt-python`
  11. `course-cyber-python`
  12. `course-train-python`
  13. `course-vector-python`
  14. `course-safety-python`
- **What Is Wrong**:
  Any UI view, catalog browser, career track selector, or certification directory that reads `COURSES_CATALOG` (`src/lib/data/coursesCatalog.ts`) cannot see or enroll students into any of these 14 Python/Web specialization courses (`840 days` of curriculum)!
- **What Should Be Done**:
  Add catalog metadata entries (`CourseCatalogItem`) for all 14 missing courses to `COURSES_CATALOG` in `src/lib/data/coursesCatalog.ts`, and add a unit test asserting `Object.keys(COURSES_REGISTRY).every(id => COURSES_CATALOG.some(c => c.id === id))`.
- **How To Fix + Verify**:
  Add the 14 `CourseCatalogItem` definitions to `src/lib/data/coursesCatalog.ts` and verify 1:1 parity with `COURSES_REGISTRY`.

---

#### `[FINDING-025]` `[CRITICAL]` `[TAG: VERIFIED-READ]`
- **Title**: 21 Unhandled Client-to-Server API Endpoints (`404 Not Found`) Documented in `audit/contracts.json`, Including Live `GET /api/pins/balance`
- **Location**:
  - [audit/contracts.json](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/audit/contracts.json#L86-L240)
  - `src/lib/api/pinsClient.ts` (`GET /api/pins/balance`)
  - `src/lib/api/examClient.ts`, `src/lib/api/missionsClient.ts`, `src/lib/api/careerDnaClient.ts`, `src/lib/api/personalityClient.ts`
- **Evidence**:
  In [audit/contracts.json](file:///c:/Users/Admin/Desktop/projects/Present-Career-os/audit/contracts.json#L86-L155) (`[VERIFIED-READ]`):
  `"unhandledClientCalls": 21`, including:
  - Live client call: `GET /api/pins/balance` in `src/lib/api/pinsClient.ts:27` (no matching `src/app/api/pins/balance/route.ts` exists!).
  - 20 client calls in `examClient.ts`, `missionsClient.ts`, `careerDnaClient.ts`, `personalityClient.ts` pointing to non-existent `/api/exam/*`, `/api/missions/streak`, `/api/career-dna/*`, `/api/personality/*` routes.
- **What Is Wrong**:
  Calling `getPinBalance()` from `pinsClient.ts` hits a non-existent API route (`404`), and 4 client API SDK modules target 20 unimplemented backend endpoints.
- **What Should Be Done**:
  Implement `src/app/api/pins/balance/route.ts` (or route `pinsClient.ts` to the existing pins endpoint) and either implement or remove the 20 dead API client functions.
- **How To Fix + Verify**:
  Create the missing route handler or align `pinsClient.ts`, re-run the contract extractor, and verify `unhandledClientCalls === 0`.

---

## 5. Prioritized Remediation Roadmap

To bring PinIT Career OS from its current **NO-GO (`BLOCKER`)** state to genuine, audit-proof production readiness, execute remediation in the following 4 deterministic waves:

### Wave 1 — Stop the Bleeding: Broken Judges, Cheat-Bypassable Exams & Test Suite Blind Spots (`BLOCKER`s)
1. **Fix `node-web` Unedited Starter Passers (`[FINDING-001]`)**:
   - Update `node-web-exam-day-32`, `day-36`, `day-56`, and `day-59` in `src/lib/data/nodeWeb30DayData.ts` so starter code does not return a passing `0` and `eTest` asserts exact expected hashes/partitions across 3+ distinct inputs.
   - Change `const checkDays = 30;` to `const checkDays = expectedDays;` in `tests/web_track_tasks.test.ts:619,629`.
2. **Synchronize `verify-quest` Server Judge (`[FINDING-002]`)**:
   - Regenerate `supabase/functions/verify-quest/questTestSuites.generated.ts` so all 60 `course-python-backend` quests use their actual Python `testSuite` and `"language": "python"`, and all Month-2 (`day-31..60`) coding quests across 60-day courses are included.
3. **Fix Crashing Visual Specs & Un-Rig Visual Test Suites (`[FINDING-008]`, `[FINDING-009]`)**:
   - Convert the 23 crashing `compare` specs in `src/lib/data/lessonVisuals/node-web/day-37..60.json` from `{ left, right }` to `columns: [...]`, and guard `spec.columns` in `src/lib/visuals/gate.ts:242`.
   - Delete `|| (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16)` from all 4 `tests/*_visuals_verification.test.ts` suites and remove the `CERT_24M_COURSES` filter in `tests/lesson_visuals_gate.test.ts:144`.
4. **Fix Broken Java Quests & TypeScript-in-JS Runner (`[FINDING-005]`)**:
   - Fix the 5 Java quests in `src/lib/data/questsData.ts:45-121` (`fizzbuzz`, `reverser`, `arraysum`, `palindrome`, `findmax`) and strip TS type annotations from `javaBasicsLongLessons.ts` (or transpile TS in `jsRunner.ts`).

### Wave 2 — Eliminate Cloned Boilerplate & Constant-Bypassable Assessments (`BLOCKER` & `CRITICAL` Content)
1. **Replace Cloned Month-2 Toy Lessons Across 11 Python/Web Courses (`[FINDING-012]`)**:
   - Rewrite Days 31–60 (`1,650 parts`) across `ai-py`, `dist-py`, `cloud-py`, `quant-py`, `cyber-py`, `train-py`, `vec-py`, `safe-py`, `sre-web`, `stream-web`, and `aideploy-web` with real algorithms, real domain prose (`>= 580` words/part, `>= 450` `say` words), and zero duplicated template paragraphs.
2. **Replace Cloned B.Com `evaluateDay{N}AuditMetric` / `calculateDay{N}VarianceIndex` & `get*FullForm` Tasks (`[FINDING-003]`, `[FINDING-007]`)**:
   - Rewrite the 240 cloned tasks in `bcomTaxation30DayData.ts`, `bcomAuditing30DayData.ts`, `bcomBanking30DayData.ts`, and `bcomLaw30DayData.ts`, plus the acronym-lookup assignments in `bcom_ops`, `bcom_scrm`, `bcom_ent`, `bcom_ecom`, and `bcom_dmkt`.
3. **Harden All 227 Constant-Bypassable Tasks & Retire `known_low_input_tasks.ts` / `known_constant_tasks.ts` (`[FINDING-004]`, `[FINDING-006]`)**:
   - Expand single-input `eTest`/`aTest` suites across `iot_*`, `g3d`, `blockchain`, `bcom_*`, `nlp`, `ai_prompt`, `quant-systems`, `fullstack-js`, and the 12 web/systems courses to test `>= 3` distinct inputs, align `eDesc` return contracts in `iotEmbedded30DayData.ts`, and empty both exemption lists.

### Wave 3 — Gate v2 Visuals Overhaul, MCQ Re-Balancing & Explanation Backfill (`CRITICAL` & `HIGH`)
1. **Fix All 2,784 Failing Gate v2 Visual Files (`[FINDING-008]`, `[FINDING-010]`, `[FINDING-011]`)**:
   - Delete orphan `iot_net/day-61..64.json`, replace `[Done.Pfour.Stwo]` mangled captions in `ai/day-01..30.json` and sibling courses, clean `R6` filler words in `react-basics` and `nlp-py`, and recompute `codeHash` (`R12`) across all 53 directories until `npx tsx scripts/visuals/check.mts --all` reports `0` errors across all `3,180` files.
2. **Re-Balance MCQ Answer Indices & Add `why` Explanations to All 408 Course Test Questions (`[FINDING-014]`, `[FINDING-019]`, `[FINDING-020]`)**:
   - Permute `part.check.options` across all 35+ courses with `[300, 0, 0, 0]` bias and normalize distractor lengths (`max/min <= 1.5`).
   - Add `why` explanations to all 408 `CourseTestQuestion` items in `courseTests*.ts` and rebalance the 27 courses that have `0` index-0 answers to `[2, 2, 2, 2]`.
3. **Expand Sub-580-Word Lesson Parts & Strip Meta-Commentary (`[FINDING-013]`, `[FINDING-015]`, `[FINDING-017]`)**:
   - Strip `"When studying ... Fast readers can scan ... slow or methodical readers"` from `comp_fund`, `git_vcs`, and `java-basics`, expand sub-580-word Month-1 parts across Python/Systems/IoT tracks, and replace template `tryIt` prompts.

### Wave 4 — Catalog Parity, Sandbox Polish & Full CI Regression Gate (`HIGH` & `MEDIUM`)
1. **Register Missing 14 Courses in `COURSES_CATALOG` (`[FINDING-024]`)**:
   - Add the 14 missing Python/Web courses to `src/lib/data/coursesCatalog.ts`.
2. **Fix Sandbox Comment False-Positives, Hardcoded Python Path & API 404s (`[FINDING-021]`, `[FINDING-022]`, `[FINDING-025]`)**:
   - Strip comments before regex matching in `src/lib/server/codeWarsSandbox.ts`, remove `C:\Users\vinay\...` from `src/lib/code/runners/pythonRunner.ts:205`, and resolve `GET /api/pins/balance`.
3. **Final Verification Gate**:
   - Run `npx tsc --noEmit`, `npx tsx scripts/visuals/check.mts --all`, and `npx tsx --test tests/*.test.ts` with zero exemptions (`known_low_input_tasks.ts` and `known_constant_tasks.ts` empty).
