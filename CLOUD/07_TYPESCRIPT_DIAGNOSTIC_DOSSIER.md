# Document 07 — TypeScript Diagnostic Dossier

**Workspace Root**: `<repo-root>` (`Present-Career-os`)  
**Inspection Date**: 2026-11-13T12:30:00+05:30  
**Command Executed**: `npx tsc --noEmit`  
**Exit Code**: **1 (Failure — Exactly 412 total errors across exactly 4 files)**  
**Status**: **BASELINE PRESERVED — ZERO CODE MODIFICATIONS APPLIED**  

---

## 1. Raw Compiler Diagnostic Distribution

Full execution of `npx tsc --noEmit` confirms the exact compiler error distribution:

```
Command: npx tsc --noEmit
Exit Code: 1
Diagnostic Count: Exactly 412 errors across exactly 4 files

File Breakdown:
1. src/app/quests/lesson/hooks/useLessonEngine.ts : 2 errors   (TS2554, TS2345)
2. src/lib/data/safetyPythonLongLessons.ts        : 150 errors (TS2353)
3. src/lib/data/vectorPythonLongLessons.ts        : 150 errors (TS2353)
4. src/lib/data/trainPythonLongLessons.ts         : 110 errors (TS2353)
Total: 2 + 150 + 150 + 110 = 412 errors.
```

### Untruncated Diagnostic Ledger by File and Range:
| File Path | Line Range | Error Code | Count | Root Cause Category |
| :--- | :---: | :---: | :---: | :--- |
| `src/app/quests/lesson/hooks/useLessonEngine.ts` | 490 | `TS2554` | 1 | Category A (`withAnswerAt` arity mismatch: expected 3, got 2) |
| `src/app/quests/lesson/hooks/useLessonEngine.ts` | 490 | `TS2345` | 1 | Category A (Returned object missing `question`, `explanation`) |
| `src/lib/data/safetyPythonLongLessons.ts` | 7719–15042 | `TS2353` | 150 | Category B (`partNumber` not in `LongLessonPart`, Days 31–60, 5 parts/day) |
| `src/lib/data/vectorPythonLongLessons.ts` | 7703–15471 | `TS2353` | 150 | Category B (`partNumber` not in `LongLessonPart`, Days 31–60, 5 parts/day) |
| `src/lib/data/trainPythonLongLessons.ts` | 9645–15283 | `TS2353` | 110 | Category B (`partNumber` not in `LongLessonPart`, Days 31–52, 5 parts/day) |
| **TOTAL** | — | — | **412** | **Zero other files in the entire repository have TypeScript errors** |

---

## 2. Category A: `withAnswerAt` / `TestQuestion` Contract Mismatch

### A. Raw Compiler Diagnostics
```
src/app/quests/lesson/hooks/useLessonEngine.ts(490,11): error TS2554: Expected 3 arguments, but got 2.
src/app/quests/lesson/hooks/useLessonEngine.ts(490,11): error TS2345: Argument of type '{ options: string[]; answerIndex: number; }' is not assignable to parameter of type 'TestQuestion'.
  Type '{ options: string[]; answerIndex: number; }' is missing the following properties from type 'TestQuestion': question, explanation
```

### B. Interface & Function Declarations
Source file: [`src/lib/data/blockTests.ts:8-53`](file:///./src/lib/data/blockTests.ts#L8-L53)

```typescript
// 1. The Target Interface:
export interface TestQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

// 2. The Function Signature:
export function withAnswerAt(
  options: string[],
  correct: number | string,
  seed: number
): { options: string[]; answerIndex: number }
```

### C. The Defective Call Site
Source file: [`src/app/quests/lesson/hooks/useLessonEngine.ts:482-505`](file:///./src/app/quests/lesson/hooks/useLessonEngine.ts#L482-L505)

```typescript
const makeEmergencyFallback = (): TestQuestion[] => {
  const fallback = buildTestQuestions(testInfo.prefix, testInfo.start, testInfo.end, () => null);
  if (fallback.length > 0) return fallback;
  console.warn('[useLessonEngine] makeEmergencyFallback triggered for', testInfo.prefix, testInfo.start, testInfo.end);
  const res: TestQuestion[] = [];
  for (let day = testInfo.start; day <= testInfo.end; day++) {
    res.push(
      withAnswerAt( // LINE 490: CALLED WITH 2 ARGUMENTS INSTEAD OF 3
        {
          question: `Diagnostic Assessment Day ${day}: What is the core requirement for Day ${day} in the ${testInfo.prefix} syllabus?`,
          options: [
            'Implement the required functionality according to specification and verify with tests',
            'Skip test verification and push incomplete code directly to production',
            'Bypass input validation checks in the pipeline',
            'Hardcode mock credentials in production source code',
          ],
          answerIndex: 0,
          explanation: `Engineering standard for Day ${day} demands verified implementation matching the curriculum rubric.`,
        },
        (day - 1) % 4
      ) // Returns { options, answerIndex }, which lacks `question` and `explanation`!
    );
  }
  return res;
};
```

### D. Canonical Call Site Comparison
Source file: [`src/app/quests/lesson/hooks/useLessonEngine.ts:860-868`](file:///./src/app/quests/lesson/hooks/useLessonEngine.ts#L860-L868)

At line 862 of the very same file, `withAnswerAt` is invoked correctly with 3 arguments:
```typescript
mcq: {
  question: part.check?.question || `Concept check for Part ${i + 1}`,
  ...withAnswerAt(
    part.check?.options || ['Follow the verified lesson method', 'Skip verification steps'],
    part.check?.answer ?? (part.check as any)?.answerIndex ?? (part.check as any)?.correctIndex ?? 0,
    dayNum * 7 + i // 3rd Argument: seed
  ),
  explanation: part.check?.why || (part.check as any)?.explanation || '...',
}
```

---

## 3. Category B: `LongLessonPart.part` vs. `partNumber` Mismatch (410 Errors)

### A. Raw Compiler Diagnostics
```
src/lib/data/safetyPythonLongLessons.ts(7719,9): error TS2353: Object literal may only specify known properties, and '"partNumber"' does not exist in type 'LongLessonPart'.
src/lib/data/safetyPythonLongLessons.ts(7764,9): error TS2353: Object literal may only specify known properties, and '"partNumber"' does not exist in type 'LongLessonPart'.
... [150 occurrences in safetyPythonLongLessons.ts across lines 7719 to 15042]

src/lib/data/vectorPythonLongLessons.ts(7703,9): error TS2353: Object literal may only specify known properties, and '"partNumber"' does not exist in type 'LongLessonPart'.
src/lib/data/vectorPythonLongLessons.ts(7748,9): error TS2353: Object literal may only specify known properties, and '"partNumber"' does not exist in type 'LongLessonPart'.
... [150 occurrences in vectorPythonLongLessons.ts across lines 7703 to 15471]

src/lib/data/trainPythonLongLessons.ts(9645,9): error TS2353: Object literal may only specify known properties, and '"partNumber"' does not exist in type 'LongLessonPart'.
src/lib/data/trainPythonLongLessons.ts(9690,9): error TS2353: Object literal may only specify known properties, and '"partNumber"' does not exist in type 'LongLessonPart'.
... [110 occurrences in trainPythonLongLessons.ts across lines 9645 to 15283]
```

### B. Interface Definition
Source file: [`src/lib/data/longLessonTypes.ts:20-44`](file:///./src/lib/data/longLessonTypes.ts#L20-L44)

```typescript
export interface LongLessonPart {
  part?: string | number; // Accepts "part", does NOT accept "partNumber"
  title: string;
  say?: string[] | string;
  content?: string[] | string;
  example?: string;
  code?: string;
  rawCode?: string;
  output?: string;
  codeNotes?: ({ line: number; note: string } | string)[];
  tryIt?: string;
  projectCode?: { label: string; code: string };
  check?: LongLessonCheck;
  checks?: LongLessonCheck[];
}
```

### C. Exact Error Distribution
- `safetyPythonLongLessons.ts`: Days 31 through 60 (30 days × 5 parts) = **150 errors**.
- `vectorPythonLongLessons.ts`: Days 31 through 60 (30 days × 5 parts) = **150 errors**.
- `trainPythonLongLessons.ts`: Days 31 through 52 (22 days × 5 parts) = **110 errors**.
- **Sum**: 150 + 150 + 110 = **410 errors**.

### D. Actual Generator Provenance (Resolved)
Earlier preliminary notes incorrectly hypothesized that visual JSON generators in `scripts/legacy_generators/` emitted these fields. **Git commit forensics resolves the true provenance**:
- **Commit `9797c338`** (`feat(python-cert): complete and verify 10 of 12 Python certification courses`): The automated AI batch expansion script wrote `"partNumber": idx` directly into `trainPythonLongLessons.ts` (Days 31–52).
- **Commit `5d887012`** (`feat(curriculum): complete 100% verified live python certification track`): The automated AI batch expansion script wrote `"partNumber": idx` directly into `safetyPythonLongLessons.ts` (Days 31–60) and `vectorPythonLongLessons.ts` (Days 31–60).
- **Why this was not caught during authoring**: The authoring agent executed `npx tsx tests/python_track_long_lessons.test.ts`. Because `tsx` uses esbuild to strip types and execute runtime code without type-checking, the test passed with Exit Code 0. The agent never ran `npx tsc --noEmit` before committing.

### E. Exhaustive Consumer Analysis
A full-repository regex search across all files in `src/` for `.partNumber` confirms:
- **Zero application consumers read `partNumber`**.
- In `src/app/quests/lesson/hooks/useLessonEngine.ts` ([`lines 836-870`](file:///./src/app/quests/lesson/hooks/useLessonEngine.ts#L836-L870)), parts are iterated using array index `lesson.parts.entries()` and rendered as `Part ${i + 1}`.
- Neither `coursesData.ts` nor `longLessons.ts` reference `partNumber`.
