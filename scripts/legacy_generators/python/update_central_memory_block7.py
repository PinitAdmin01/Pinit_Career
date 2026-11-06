import os
import csv

MEMORY_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
PROJECT_MEMORY_PATH = os.path.join(MEMORY_DIR, "PROJECT_MEMORY.md")
CONTROL_CSV_PATH = os.path.join(MEMORY_DIR, "multi_agent_control.csv")

# 1. Prepend to PROJECT_MEMORY.md
milestone_entry = """#### Milestone Entry - 2026-10-19: Course 02 (`react-basics`) Month 2 Block 7 (Days 31–35) Completed & Verified
- **Course**: `course-react-web` / `react-basics` (Full-Stack React Web Development) - Month 2 Block 7 (Days 31–35)
- **Agent**: `AGENT-456` (`TASK-1619` through `TASK-1623`)
- **Scope**: Advanced React State Machines, Concurrent Mode, Fiber Architecture, `useTransition`, `useDeferredValue`, and Milestone 6: Concurrent Data Grid (10,000-Row Asynchronous Filter & Priority Slicing Engine).
- **Lessons Implemented & Enriched**:
  - **Day 31 (`TASK-1619`)**: The React Concurrent Runtime: Fiber Tree, Work-in-Progress & Cooperatively Yielding Reconciler (3,090 words, 38 min declared, 5/5 parts >= 580 words).
  - **Day 32 (`TASK-1620`)**: Concurrent Interruptible Rendering: `useTransition`, `isPending` & Non-Blocking Priority Slicing (3,008 words, 38 min declared, 5/5 parts >= 580 words).
  - **Day 33 (`TASK-1621`)**: Responsive Input Buffering with `useDeferredValue`, Stale Visuals & Suspense Fallbacks (2,945 words, 38 min declared, 5/5 parts >= 580 words).
  - **Day 34 (`TASK-1622`)**: Finite State Machines in React: Predictable State Transitions & `useReducer` with Discriminated Unions (2,940 words, 38 min declared, 5/5 parts >= 580 words).
  - **Day 35 (`TASK-1623`)**: 🏆 **Milestone 6**: Concurrent Data Grid: 10,000 Row Asynchronous Filter & Priority Slicing Engine (3,000 words, 40 min declared, 5/5 parts >= 580 words).
- **Gate v2 Visual Suites**:
  - Generated and validated `src/lib/data/lessonVisuals/react-basics/day-{31..35}.json` (5 files, 25 lesson parts, 4 synchronized steps each across allowed templates `flow`, `compare`, `states`, `boxes`, `component-tree`, `wireframe`, raw SHA-256 `codeHash` matches).
- **Curriculum & Quests Expansion**:
  - Appended Days 31–35 to `src/lib/data/reactLongLessons.ts` and `src/lib/data/react30DayData.ts`.
  - Added 10 interactive exam and assignment tasks with deterministic sandbox test validations.
- **Testing & Verification**:
  - `tests/react_days31_35_expansion.test.ts`: 3/3 suites passing (word counts >= 580 words, exact code execution matching, Gate v2 on-disk visual contracts, config titles & exam/assignment sandbox tests).
  - `tests/react_long_lessons.test.ts`: 3/3 suites passing across all 35 days.
  - `tests/react_render_check.test.ts`: 7/7 suites passing.
  - `npx tsc --noEmit`: 0 TypeScript compilation errors.
- **Overall Course Status**: Course 02 expanded to **35 Days (Block 7 Complete)**.

---

"""

with open(PROJECT_MEMORY_PATH, "r", encoding="utf-8") as f:
    existing_memory = f.read()

new_memory = milestone_entry + existing_memory
with open(PROJECT_MEMORY_PATH, "w", encoding="utf-8") as f:
    f.write(new_memory)
print("Updated PROJECT_MEMORY.md successfully!")

# 2. Update multi_agent_control.csv for AGENT-456
rows = []
with open(CONTROL_CSV_PATH, "r", encoding="utf-8") as f:
    r = csv.reader(f)
    header = next(r)
    for row in r:
        if len(row) > 7 and row[0] == 'AGENT-456':
            row[7] = 'Completed'
            row[8] = 'Course 02 (react-basics) Month 2 Block 7 Days 31-35 Completed & Verified'
            row[5] = 'Completed'
        rows.append(row)

with open(CONTROL_CSV_PATH, "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    w.writerow(header)
    w.writerows(rows)
print("Updated multi_agent_control.csv successfully!")
