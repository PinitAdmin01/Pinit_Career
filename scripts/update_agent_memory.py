# -*- coding: utf-8 -*-
import os

# 1. Update multi_agent_control.csv
csv_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
with open(csv_path, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
new_lines = []
for line in lines:
    if line.startswith('AGENT-415,'):
        new_lines.append(
            'AGENT-415,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1398,Completed,2026-10-18 16:05:00,'
            '"BATCH COMPLETE: Course 8 (mobile) Month 2 Batch 5: Block 11 -- Days 51-55 (Memory Profiling, Hermes Heap Leaks, '
            'Android Studio Profiler, Jest and RNTL, Maestro E2E Automation, and Milestone 10 Zero-Leak Verified Mobile Test Harness: '
            'TASK-1394..1398) complete and tested. 16,716 words (all 5 days >= 28 spoken min, 38 total min/day), all tests passing, '
            '0 tsc errors. Course 8 is 55/60 Days (91.7% Complete)!"'
        )
    else:
        new_lines.append(line)

with open(csv_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines) + '\n')

print("Updated multi_agent_control.csv successfully!")

# 2. Prepend Milestone 10 to PROJECT_MEMORY.md
md_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(md_path, 'r', encoding='utf-8') as f:
    md_content = f.read()

milestone_entry = """### Milestone 10: Zero-Leak Verified Mobile Test Harness with Automated Maestro E2E Regression Suite (Course 8: Mobile Month 2 Days 51-55: Block 11) - 2026-10-18
- **Scope & Delivery**: Completed Course 8 (Mobile Application Development) Month 2 Block 11 (Days 51-55: `TASK-1394..1398`).
  - Day 51 (`TASK-1394`): Memory Profiling: Diagnosing Hermes Heap Leaks & Retained Views with Xcode Instruments (Jetsam 650MB limit, VM Tracker dirty memory, detached RCTView retain cycles).
  - Day 52 (`TASK-1395`): Android Memory Profiling: Android Studio Profiler, Bitmap Allocations & Fragment Leaks (Java/Native/Graphics RSS, Android 8+ native bitmap pointers, LeakCanary, LMK oom_score_adj).
  - Day 53 (`TASK-1396`): Unit & Component Testing: Jest, React Native Testing Library (RNTL) & Mocking Native Modules (hermetic Node.js execution, getByRole accessible queries, TurboModule JSI mocks, waitFor polling).
  - Day 54 (`TASK-1397`): Automated End-to-End Testing: Maestro UI Automation, Flake Reduction & Device Emulation (declarative YAML flows, native accessibility daemons, universal link injection, offline hardware emulation).
  - Day 55 (`TASK-1398`): 🏆 Milestone 10: Zero-Leak Verified Mobile Test Harness with Automated Maestro E2E Regression Suite (70/20/10 test pyramid, native linkage gates, 250-cycle navigation stress heap assertions, 4 production Maestro flows, CI verification report).
- **Invariants Verified**:
  - Exactly 5 parts per day; all parts >= 580 words (3,317 to 3,359 words/day, 16,716 total words across batch).
  - Spoken duration: 28 min/day (>= 20 min invariant). Total duration: 38 min/day (strictly 35-40 min invariant).
  - Gate v2 Visual JSON specs generated with matching SHA-256 hashes (`src/lib/data/lessonVisuals/mobile/day-{51..55}.json`).
  - 100% test pass rate in `tests/mobile_days51_55_expansion.test.ts` and `tests/blockchain_mobile_long_lessons.test.ts`.
  - 0 TypeScript compiler errors (`npx tsc --noEmit`).
- **Course Status**: Course 8 (`mobile`) advanced to 55/60 Days (91.7% Complete). Ready for final Batch 6 (Days 56-60: Block 12 Grand Capstone).

---

"""

# Prepend right after the title or at the beginning of the file
if '# Central Project Memory & Milestone Registry' in md_content:
    parts = md_content.split('# Central Project Memory & Milestone Registry\n', 1)
    new_md = '# Central Project Memory & Milestone Registry\n\n' + milestone_entry + parts[1]
else:
    new_md = milestone_entry + md_content

with open(md_path, 'w', encoding='utf-8') as f:
    f.write(new_md)

print("Updated PROJECT_MEMORY.md successfully!")
