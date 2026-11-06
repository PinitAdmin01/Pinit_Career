import datetime
import os

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
with open(mac_path, 'r', encoding='latin-1') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith('AGENT-413,'):
        new_lines.append(
            f'AGENT-413,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1348,Completed,{now_str},'
            f'"BATCH COMPLETE: Course 5 (java-basics) Month 2 Pioneer Batch 1: Block 7 -- Days 31-35 (Classes & Heap Pointers, Constructors & this Keyword, Encapsulation & Immutability, Metaspace vs Heap State, Milestone 6 Enterprise Domain Model: TASK-1344..1348) complete and tested. 15,071 words (all 5 days >= 25 spoken min, 35-36 total min/day), 143/143 tests passing, 0 tsc errors. Course 5 is 35/60 Days (58.3% Complete)!"\n'
        )
    else:
        new_lines.append(line)

with open(mac_path, 'w', encoding='latin-1') as f:
    f.writelines(new_lines)
print("Updated multi_agent_control.csv")

# 2. Update agent_tasks.csv
at_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
with open(at_path, 'r', encoding='latin-1') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    parts = line.split(',')
    if len(parts) > 0 and parts[0] in ['TASK-1344', 'TASK-1345', 'TASK-1346', 'TASK-1347', 'TASK-1348']:
        parts[3] = 'COMPLETED'
        # Also update the second status field if present
        if len(parts) >= 9 and parts[8] == 'IN_PROGRESS':
            parts[8] = 'COMPLETED'
        new_lines.append(','.join(parts))
    else:
        new_lines.append(line)

with open(at_path, 'w', encoding='latin-1') as f:
    f.writelines(new_lines)
print("Updated agent_tasks.csv")

# 3. Update PROJECT_MEMORY.md
pm_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(pm_path, 'r', encoding='utf-8', errors='replace') as f:
    pm_content = f.read()

batch_report = f"""### 🚀 Milestone Record: Course 5 (Java Core & Enterprise Systems) Month 2 Batch 1 (Block 7: Days 31–35)
- **Agent**: AGENT-413 (Antigravity Orchestrator)
- **Branch**: `codex/interview-tab-reliability`
- **Tasks**: `TASK-1344` through `TASK-1348`
- **Completion Date**: {now_str}
- **Curriculum Delivered**:
  - **Day 31 (`TASK-1344`)**: Classes, Heap Instances & Reference Pointer Mechanics (JVM Stack/Heap topology, 64-bit Mark Word & Klass Pointer header layout, Compressed OOPs, reference aliasing, defensive chained dereferencing NPE triage).
  - **Day 32 (`TASK-1345`)**: Constructors, State Initialization & The `this` Keyword (Instantiation lifecycle, default zeroing vs explicit assignment, parameter shadowing elimination, `this(...)` constructor chaining, AST self-assignment linter guards).
  - **Day 33 (`TASK-1346`)**: Data Hiding: Private Fields, Defensive Getters/Setters & Immutability (Access modifiers, encapsulation invariants, defensive copying of mutable collections/dates, immutable `Money` Value Object pattern, bypass vulnerability penetration tests).
  - **Day 34 (`TASK-1347`)**: Static State (Metaspace Class Variables) vs Heap Instance State (Metaspace allocation, static initialization blocks, ClassLoader hierarchy, multi-tenant memory leak prevention, thread-safe monotonic `GlobalSequenceGenerator`).
  - **Day 35 (`TASK-1348`)**: ⭐ **Milestone 6: Enterprise Bank Account Domain Model with Invariant Guards** (Rich domain entity architecture, overdraft tier boundaries, atomic zero-sum multi-account transfers, immutable transaction audit events, Senior Systems Viva Gate certification).
- **Quality & Verification Metrics**:
  - **Total Word Count**: **15,071 words** authored (avg 3,014.2 words/day; all 25 parts strictly $\\ge 580$ words).
  - **Spoken Duration**: 25–26 spoken minutes/day (exceeds $\\ge 20$ min constraint).
  - **Total Lesson Duration**: Strictly 35–36 minutes/day (perfectly within [35, 40] min window).
  - **Visual Specs**: Gate v2 visual JSON specs created for Days 31–35 (`src/lib/data/lessonVisuals/java-basics/day-{{31..35}}.json`) with `template: 'stack-queue'`, 4 synchronized steps (`intro`, `say1`, `example`, `tryIt`), non-empty tappable labels, and matching SHA-256 code hashes.
  - **Test Suite Verification**: 100% pass across `tests/java_basics_visuals_expansion.test.ts` (3/3 suites) and `tests/java_softskills_long_lessons.test.ts` (143/143 tests).
  - **Compiler Verification**: Clean TypeScript check (`npx tsc --noEmit` exited with code 0).
- **Course Progress**: Course 5 (`java-basics`) is now **35/60 Days (58.3% Complete)**.

---
"""

# Insert right after the top header or preamble
insert_marker = "## Recent Milestones & Batch Execution History"
if insert_marker in pm_content:
    new_pm_content = pm_content.replace(insert_marker, insert_marker + "\n\n" + batch_report)
else:
    new_pm_content = batch_report + "\n" + pm_content

with open(pm_path, 'w', encoding='utf-8') as f:
    f.write(new_pm_content)
print("Updated PROJECT_MEMORY.md")
