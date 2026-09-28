# Quest tab: instructions for Antigravity

Written 2026-09-28 by Claude (cloud session) for the Antigravity agent working on PinIT Career OS.
Read this whole file before changing anything. Do the tasks **in order, one at a time**, and stop after
each task to report to the owner (format at the end).

---

## 0. Owner rules (always)

1. Explain to the owner in **simple words**. Be honest. Never say "done" unless it is verified.
2. **Verify before saying done**, every task:
   ```
   npx tsc --noEmit                       # must print nothing (exit 0)
   npm test                               # all tests pass (65 at the time of writing, 0 fail)
   node scripts/tests/test_crash_course_progress.cjs   # 10/10
   node scripts/tests/test_capstone_sprints.cjs        # 17 passed, 0 failed
   npx next build                         # exit 0
   node claude_self_validate.js           # on the owner's laptop only
   ```
3. Work on the branch **`main-dis3ku`**. Commit and push there. **Never merge or push to `main`**
   without the owner saying so in words.
4. Database changes: give the owner the SQL to paste into the Supabase SQL editor, plus a verify query
   that never errors. None of the tasks below should need database changes.
5. Never make a plan, page or certificate promise something the course does not really teach or give.
6. Do not commit `tsconfig.tsbuildinfo` (the build changes it; run `git checkout -- tsconfig.tsbuildinfo`).

---

## 1. First: get the work onto GitHub (nothing else before this)

The work is 11 commits on top of `main` at `4ab6f1d8` (the last one adds this file). It could not be pushed from the cloud session.
It is stored in a private page: https://claude.ai/artifact/VMpPsDLaW6dGWLk1F3y22h

Steps (Windows PowerShell, in `C:\Users\Admin\Desktop\projects\Present-Career-os`):

1. `git am --abort` (clears any failed earlier attempt; an error saying nothing is in progress is fine).
2. `git checkout main-dis3ku` then `git status` must say "nothing to commit". Stop if not.
3. Paste and run this line (it waits):
   ```
   Read-Host "Copy the work, then press Enter"; [IO.File]::WriteAllText("$PWD\quest.patch", (Get-Clipboard -Raw)); (Get-Item quest.patch).Length
   ```
4. Open the page link in **Chrome** (not the Claude app panel), click inside the big text box,
   press **Ctrl+A**, then **Ctrl+C**. Go back to PowerShell and press **Enter**.
   The number printed must match the size the page says ("It should be about …"). Anything under
   100000 means the copy failed: repeat steps 3–4.
5. `git am quest.patch` → must print 11 lines starting with `Applying:` and no error.
6. `git log --oneline -12` must show, newest first:
   ```
   docs: instructions for Antigravity to finish the Quest tab work
   feat(quests): certificate tab opens on one "today" card
   feat(quests): practice every day, a test after every 5 days
   fix(plans): 1-month React capstone matches what the course teaches
   feat(quests): React course Days 26-30; all 30 days are long lessons
   feat(quests): React course Days 21-25 as long lessons
   feat(quests): React course Days 16-20 as long lessons
   feat(quests): React course Days 11-15 as long lessons
   feat(quests): React course Days 6-10 as long lessons, project code box
   feat(quests): long plain-language React lessons, visible teacher, working Run Code
   fix(quests): load written lessons for Cloud, Quant, Accounting, Finance, Marketing, Soft Skills
   feat(onboarding): phone layout (no scrolling) and a test for "Start my plan"   <- 4ab6f1d8 (main)
   ```
7. Run every check in section 0, point 2. All must pass.
8. `del quest.patch`, then `git push -u origin main-dis3ku`.
9. Report to the owner: commits applied, check results, push result. Stop.

If `git am` fails: run `git am --abort`, do not try to fix it by hand, and show the owner the exact error.

---

## 2. What was done (so you understand the code)

### Bugs fixed for every course
| Bug | Where | Fix |
|---|---|---|
| 6 courses showed filler lessons | `src/lib/data/curriculumEnricher.ts` `PILOT_DAY_SOURCES`, `useLessonEngine.ts` `RUNNER_LABELS` | Keys now match the quest prefixes (`cloud`, `quant-systems`, `bcom-accounting`, `bcom-finance`, `bcom-marketing`, `soft-skills`) |
| Slides showed "Analogy: undefined" | `src/app/quests/lesson/hooks/useLessonEngine.ts` | Reads `metaphor`/`simpleExplanation`, `lineNotes`, `data.title` |
| Teacher avatar never showed in lessons | `src/components/avatar/AvatarMentorWidget.tsx` | `onlyAvatar` mode is never minimised |
| Run Code always failed | `src/lib/code/sandbox/sandboxedIframeRunner.ts` | Escaped newlines inside the nested worker template broke the worker; now uses `NEWLINE` |
| Objects printed as `[object Object]` | `src/lib/code/sandbox/logFormat.ts` | Node-style one-line formatting |
| Every lesson quiz had 2 generic filler questions | `src/app/quests/lesson/components/LessonQuizBlock.tsx` | Uses only the lesson's own questions |

### 1-month React course (`course-react-web`, quest prefix `react-basics`)
- New 30-day syllabus and 60 practice tasks: `src/lib/data/react30DayData.ts`.
- 30 long lessons: `src/lib/data/reactLongLessons.ts`, format in `src/lib/data/longLessons.ts`.
- Month project: a Job Tracker, built step by step from Day 7 to Day 29.
- Quest ids never changed, so saved student progress is still valid.

### Every day-based course
- Each day = Lesson → Practice 1 → Practice 2 (ids `-exam-day-N` / `-assign-day-N` kept; category is
  now `assignment`, titles "Day N Practice 1/2").
- A test after every 5 days and after the last day: `src/lib/data/courseTests.ts`
  (id `<prefix>-test-days-<start>-<end>`, category `exam`, 2 questions per day from the lessons, 70% to pass).
- The lesson page has a test mode (intro + questions). Tests can be started after the 3 daily tasks
  (server already allowed 5 exam completions a day).

### Plans and certificate tab
- 1-month plan, React track: capstone is **Recipe Finder & Weekly Meal Planner** (React, React Router,
  Vite, Vitest). Sprint wording per plan: `capstoneSprintsByTrack` in `src/lib/data/crashPlansData.ts`,
  read with `getCapstoneSprints()` in `src/lib/courses/capstoneSprints.ts`. Server checks unchanged.
- Certificate tab opens on one card (`src/app/quests/components/TodayCourseCard.tsx`, logic in
  `src/lib/courses/todaySummary.ts`); everything else is under "More details".

### Tests that protect this work (do not weaken them)
`tests/lesson_content_coverage.test.ts`, `tests/react_long_lessons.test.ts`,
`tests/sandbox_worker_script.test.ts`, `tests/course_tests.test.ts`, `tests/crash_plan_promises.test.ts`,
`tests/today_summary.test.ts`.

---

## 3. Traps (each one cost time before; do not repeat them)

1. **No backslashes** in the worker source inside `sandboxedIframeRunner.ts` (between
   `const workerScript = \`` and `\`;`) or in `LOG_FORMAT_SOURCE` in `logFormat.ts`. They pass through
   two template literals; `'\n'` becomes a raw line break and the whole code runner dies.
   `tests/sandbox_worker_script.test.ts` catches this. Use `NEWLINE` / character classes instead.
2. **Never change quest ids.** Students' progress is stored by id. Rename titles, never ids.
3. **Long lesson code must print exactly its `output`.** The test runs every sample. Arrays print like
   `[ 'a', 'b' ]`, objects like `{ title: 'Dev' }`, keys with spaces are quoted `{ 'All jobs': 2 }`.
   The runner has no internet, no `fetch` results, and must stay synchronous (no `await` output).
4. **Long lesson titles must equal the day title** in the course's `*30DayData.ts` config (test checks it).
5. **Each long lesson needs ≥ 9 minutes of speech** (`estimateSpokenMinutes`), 5–7 parts, ≥ 3 `say`
   paragraphs per part. The test fails otherwise.
6. **The in-lesson code box runs JavaScript only.** React/JSX and terminal commands go in `projectCode`
   (shown read-only), with a plain-JavaScript version of the same idea in `code`.
7. **Previewing pages without Supabase:** the cloud session temporarily edited
   `src/components/ui/AppShell.tsx` (added `/quests` to `PUBLIC_PATHS` and an early return) and
   signed a local test JWT. **Never commit that edit.** Always `git checkout -- src/components/ui/AppShell.tsx`
   and check `git diff --stat` before committing. On the laptop you can sign in normally instead.
8. **Plan text is shared by both tracks** (`web_fullstack`, `python_ai`) except fields inside
   `flagshipBuildByTrack`, `modulesByTrack` and `capstoneSprintsByTrack`. Edit only the plan block you
   mean to (`plan-1m-sprint` is the first entry in `ALL_CRASH_COURSE_PLANS`).
9. **`tests/crash_plan_promises.test.ts`** fails if the React capstone lists a technology the lessons do
   not teach. Add the same guard for any track you rewrite.

---

## 4. Tasks, in order

### Task A — Real check on the Vercel preview (after section 1)
Goal: prove it works for a real signed-in student. No code changes unless something is broken.

On the Vercel preview of `main-dis3ku`, signed in as a test student who owns the 1-month React plan
(web track), check and screenshot each:
1. Quests → Certification tab shows one card: "Day 1 of 30", "0 of 96 tasks done", Start button,
   "Next test: Test: Days 1–5", "Final project: Opens after all tasks (96 left)".
2. Start → teacher select → lesson "Day 1: How a Website Works…". The 3D teacher is visible and speaks.
3. Each part shows the explanation, "🌍 Everyday example", code, "🔎 What the code does", "✍️ Your turn".
4. Run Code prints `Hello! This is my first line of JavaScript.`; editing the code and running again works.
5. End-of-lesson quiz has 6 questions from the lesson (no "Canonical Benchmark" questions).
6. Practice 1 opens the coding workspace with **no 45-minute timer** and no "PROCTOR EXAM" label.
7. After Day 5's tasks, "Test: Days 1–5" opens, has 10 questions, and passing it is saved.
8. Refresh: progress is kept. The Certification card numbers moved on.
Report any failure with a screenshot and the browser console (F12) error. Fix only real bugs, one per commit.

### Task B — Small leftovers (safe, small)
1. On a test (`parseTestQuestId(questId)` not null), `src/app/quests/lesson/components/LessonHeader.tsx`
   shows "ACTIVE CLASS LESSON" and "⚡ Skip Audio & Jump to Code". For tests show "TEST" and hide the
   Jump-to-Code button. Pass a boolean prop from `src/app/quests/lesson/page.tsx`.
2. `src/app/quests/components/ActiveEnrollmentBanner.tsx` says "Capstone Defense & Dual Certificates".
   When `INTERNSHIP_AVAILABLE` is false it must say "Capstone Defense & Certificate".
3. Done when: the checks in section 0 pass, and a screenshot of a test screen and the banner is shown
   to the owner.

### Task C — Delete the unused old React lessons (only with the owner's "yes")
`src/lib/data/reactPilotDays.ts` (~5,000 lines) is no longer imported anywhere. Ask the owner first.
Before deleting, confirm: `grep -rn "reactPilotDays\|REACT_PILOT_DAYS" src tests scripts` finds only the
file itself. After deleting, run all checks.

### Task D — Plan promises (owner decisions; do not change without a written answer)
Show the owner this list and ask what to keep, change or remove. Change only what they approve.
File: `src/lib/data/crashPlansData.ts` (and the badges in `CrashCoursePlanCards.tsx` /
`EnhancedCrashCoursePlanCard.tsx`).
- `hireabilityBoost` lines like "+25% Hireability Jump", "+90% Hireability Jump" (no data behind them).
- `competitorSavings` lines like "Save ₹45,000 vs short-term bootcamps".
- 9/12/24-month features: "Guaranteed Corporate Engineering Fellowship", "1-on-1 Mentorship from Staff
  Engineers at Top-Tier Tech Companies", "Mastery of 4 Languages…", "Lifelong Priority Corporate Referral
  Pipeline & VC Angel Introductions", "Zero-to-Hero … Guaranteed Placement Readiness".
- 3/6/9/12/24-month capstones use Next.js 14, Supabase, Razorpay, Kafka, Kubernetes, pgvector etc.,
  which Months 2+ do not teach yet (see Task F).
- The removed "NASSCOM Aligned" badge: put back only if the owner confirms a real NASSCOM alignment.

### Task E — Python track of the 1-month plan (`course-python-backend`, prefix `python`)
**Blocker to solve first:** the in-lesson code box only runs JavaScript (`adaptCodeForSandbox` in
`useLessonEngine.ts` just turns `print(` into `console.log(`, which breaks for real Python). Practice
tasks call `/api/code/run-python`, which runs a local `python3` process — check whether that actually
works on Vercel. Propose to the owner, with pros and cons, one way to run Python in lessons (for
example Pyodide in the browser, the same way the workspace labels say "Pyodide WASM"), build it, and
prove it with a test before writing any lesson.

Then follow the same method as the React course:
1. Write a 4-week beginner syllabus in `src/lib/data/python30DayData.ts` (keep the 30 configs and the
   `buildEnrichedDayQuests('python', …)` call so ids stay the same). Every practice task needs a
   correct solution that passes its test and a starter that fails it (write a check like the one used for
   React: run solution + test, and starter + test).
2. Create `src/lib/data/pythonLongLessons.ts` and add `'python': PYTHON_LONG_LESSONS` to
   `LONG_LESSON_SOURCES` in `longLessons.ts`.
3. Write 5 days at a time; after each batch run the checks, commit, push, report.
4. Add a Python version of `tests/react_long_lessons.test.ts` (outputs must match the real Python runner).
5. Change the 1-month plan's `python_ai` capstone and `capstoneSprintsByTrack.python_ai` so they only use
   what the Python course teaches, and add a guard like `tests/crash_plan_promises.test.ts`.

### Task F — Courses used by the longer plans (large; the owner picks the order)
Months 2+ of the 3/6/9/12/24-month plans use: `course-fullstack-js`, `course-database-eng`,
`course-dsa-optim`, `course-devops-cicd`, `course-cloud-native`, `course-design-systems`, `course-ai-eng`,
`course-distributed-sys`, `course-cybersecurity`, `course-nlp`, `course-quant-systems`,
`course-ai-prompt-literacy`. Each needs the same treatment as React (syllabus that fits the plan's
promise, 30 long lessons, practice with checks). Roughly one long working day per course. Ask the owner
which plan to finish first; do one course at a time.

### Task G — Other Quest sub-tabs (review only, then propose)
Custom Roadmap, Standalone Course and Language Academy were not redesigned. Open each as a student,
list what is confusing (with screenshots), and propose changes to the owner before building anything.

---

## 5. How to write a long lesson (Tasks E and F)

Format: `LongLesson` in `src/lib/data/longLessons.ts`. Look at `reactLongLessons.ts` Day 3 as the model.
- 5–7 parts. Each part: `title`; `say` (3–4 short paragraphs the teacher speaks, plain words, one idea
  each); `example` (an everyday Indian-life comparison); `code` + exact `output`; `codeNotes` for the
  important lines (1-based line numbers); `tryIt` (one small change to make and run); `check`
  (question, 2–3 options, `answer` index, `why` in one sentence).
- `goal`, `recap` (yesterday in one sentence), `summary` (3–5 points), `projectStep` (the month project).
- Language: short sentences, no jargon without explaining it, examples from daily life (shops, trains,
  phone apps), never "production-grade", "enterprise", "invariants".
- Beginners first: explain every new symbol the first time it appears.
- Order inside a day: why it matters → the idea → example → code → try it → check.

---

## 6. How to report to the owner after each task

Short and in simple words:
1. What changed (2–4 bullets, no code terms if possible).
2. What you checked and the result (the commands from section 0 with pass/fail counts).
3. What you could not check, and why.
4. Screenshots when a screen changed.
5. The next task, and the question you need answered (if any). Then stop and wait.
