# Document 09 — AI Regression Risk Analysis

**Workspace Root**: `<repo-root>` (`Present-Career-os`)  
**Inspection Date**: 2026-11-13T11:45:00+05:30  
**Framework**: Systems Reliability Engineering & Multi-Agent Ergonomics  
**Methodology**: Rigorous Separation of Verified Empirical Facts vs. Hypotheses  

---

## 1. Problem Formulation: The Recurring Error-Fixing Cycle

Development on PinIT Career OS has suffered from a repetitive cycle:
```
[Generate Code] -> [Run App/Test] -> [Discover Error] -> [Ask AI to Fix] -> [Secondary Bug Introduced] -> [Repeat]
```

To eliminate this friction, this document dissects the technical drivers, separating **empirically established facts** from **explicit hypotheses**.

---

## 2. Verified Empirical Facts (Evidence-Backed Root Causes)

### [VERIFIED EMPIRICAL FACT 1]: `withAnswerAt` Parameter Mismatch
- **Evidence Path**: [`src/app/quests/lesson/hooks/useLessonEngine.ts:490`](file:///./src/app/quests/lesson/hooks/useLessonEngine.ts#L490) & [`src/lib/data/blockTests.ts:33`](file:///./src/lib/data/blockTests.ts#L33).
- **Finding**: Line 490 invokes `withAnswerAt(questionObj, seed)` with 2 arguments. The function signature strictly requires 3 arguments `(options: string[], correct: number | string, seed: number)`. Furthermore, `withAnswerAt` returns `{ options, answerIndex }`, which cannot satisfy `TestQuestion` because it lacks `question` and `explanation`.
- **Verdict**: Verified contract violation introduced by local symptom patching in the emergency fallback routine.

### [VERIFIED EMPIRICAL FACT 2]: Data Store Schema Drift via Batch Expansion
- **Evidence Path**: Commits `9797c338` & `5d887012` modifying `safetyPythonLongLessons.ts`, `vectorPythonLongLessons.ts`, and `trainPythonLongLessons.ts`.
- **Finding**: Automated batch expansions emitted `"partNumber": idx` instead of `"part": idx`. In strict TypeScript, excess properties on object literals assigned to `LongLessonPart` trigger `error TS2353`. This single defect accounts for **410 of the 412 TypeScript errors**.
- **Verdict**: Verified generator drift during Month 2 automated lesson creation.

### [VERIFIED EMPIRICAL FACT 3]: Test Runner Transpilation Masking
- **Evidence Path**: [`tests/python_track_long_lessons.test.ts`](file:///./tests/python_track_long_lessons.test.ts) executed via `npx tsx`.
- **Finding**: `tsx` uses esbuild to strip types and execute runtime JavaScript directly. It performs **zero type-checking**. Consequently, `npm test` passed with Exit Code 0, creating a false impression of health while standard `next build` and `tsc` failed completely.
- **Verdict**: Verified gap between test execution runtimes and production compiler gates.

### [VERIFIED EMPIRICAL FACT 4]: Zero Consumer Reliance on `partNumber`
- **Evidence Path**: Full-repository regex search across all files in `src/`.
- **Finding**: Exactly zero application components, hooks, or utilities read `.partNumber`. Consumers in `useLessonEngine.ts` map over `lesson.parts.entries()` and use loop index `i + 1`.
- **Verdict**: Verified unused property that serves no functional purpose in the application.

---

## 3. Explicit Engineering Hypotheses (Probable Contributing Factors)

### [HYPOTHESIS 1]: Attention Degradation in Massive Single-File Contexts
- **Observation**: `useLessonEngine.ts` is 1,760 lines long; `safetyPythonLongLessons.ts` is over 15,000 lines long.
- **Hypothesis**: When an AI model processes files exceeding several thousand lines, attention density across distant interface definitions (e.g. `src/lib/data/blockTests.ts` located in another file) degrades, leading the model to hallucinate or approximate function signatures rather than navigating to the declaration.

### [HYPOTHESIS 2]: Symptom-Patching Optimization Bias
- **Observation**: When presented with compiler errors, models exhibit a strong preference for minimal edit distance (e.g. inserting `as any` or casting properties) rather than tracing the root cause back to data generator scripts.
- **Hypothesis**: RLHF tuning for coding assistants prioritizes immediate error elimination, inadvertently favoring local symptom patching over comprehensive architectural refactoring.

### [HYPOTHESIS 3]: Multi-Agent Worktree Divergence
- **Observation**: Git worktree inspection revealed 4 active worktrees operating across Branches A, B, and C.
- **Hypothesis**: Independent agents authoring features concurrently in separate worktrees without a centralized, automated typecheck gate introduce schema mismatches that only surface during integration into `main`.

---

## 4. Architectural Remedies & Stabilized Workflow

To permanently prevent regressions, future stages must enforce the following non-negotiable protocols:

1. **The "Test Where You Write" Gate**:
   After modifying any single file, immediately run:
   ```powershell
   npx tsc --noEmit
   ```
   If any TypeScript error appears, the agent must fix it or revert before touching any other file.
2. **Multi-Model Governance (Separation of Powers)**:
   - **Reasoning Tier (ChatGPT Go / Claude 3.5 Sonnet)**: Analyzes `CLOUD/` dossier, performs architectural reviews, and specifies exact contracts.
   - **Execution Tier (Antigravity / Gemini 3.8 Flash)**: Applies bounded code changes and runs local CLI verification commands without straying into unapproved files.
3. **Zero Type-Cast Suppressions**:
   Strict prohibition against `as any`, `@ts-ignore`, or disabling ESLint rules. Every data structure must align with its canonical TypeScript interface.
