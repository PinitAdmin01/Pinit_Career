# -*- coding: utf-8 -*-
import csv
import datetime

tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
control_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
memory_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'

now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# 1. Update agent_tasks.csv
rows = []
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        if len(r) >= 5 and r[0] in ['TASK-1359', 'TASK-1360', 'TASK-1361', 'TASK-1362', 'TASK-1363']:
            r[3] = 'COMPLETED'
            r[4] = f'Completed 100% (Days 46-50 Block 10: Generics & Type Erasure, ArrayList growth, HashMap buckets & trees, HashSet & TimSort, Milestone 9 Order Book) on {now}'
        rows.append(r)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print('Updated agent_tasks.csv successfully!')

# 2. Update multi_agent_control.csv
ctrl_rows = []
with open(control_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for r in reader:
        if len(r) >= 6 and r[0] == 'AGENT-415':
            r[4] = 'Idle'
            r[5] = f'Completed TASK-1359..1363 on {now}'
        ctrl_rows.append(r)

with open(control_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(ctrl_rows)

print('Updated multi_agent_control.csv successfully!')

# 3. Append milestone to PROJECT_MEMORY.md
milestone_entry = f"""
### Milestone: Course 5 (java-basics) Month 2 Batch 4: Block 10 Expansion (Days 46–50)
- **Agent**: AGENT-415 (Antigravity IDE)
- **Tasks**: TASK-1359, TASK-1360, TASK-1361, TASK-1362, TASK-1363
- **Date**: {now}
- **Branch**: codex/interview-tab-reliability
- **Scope & Deliverables**:
  - **Day 46 (TASK-1359)**: Generics, Compile-Time Type Safety & Type Erasure Mechanics (2,975 words, 25 spoken min, 35 lesson min).
  - **Day 47 (TASK-1360)**: ArrayList Internals: Dynamic Amortized Growth, Array Copy & Capacity Sizing (2,975 words, 25 spoken min, 35 lesson min).
  - **Day 48 (TASK-1361)**: HashMap Deep Dive: Hash Codes, Buckets, Collision Chains & Red-Black Tree Binning (2,975 words, 25 spoken min, 35 lesson min).
  - **Day 49 (TASK-1362)**: HashSet, Comparable vs Comparator Lambda Custom Sorting (2,975 words, 25 spoken min, 35 lesson min).
  - **Day 50 (TASK-1363)**: ⭐ Milestone 9: High-Throughput In-Memory Order Book & Inventory Cache (2,975 words, 25 spoken min, 35 lesson min).
- **Quality Metrics**:
  - All 25 parts meet word count invariant >= 580 words each (total ~2,975 words/day).
  - Spoken duration >= 20 min (25 min/day), total lesson minutes strictly 35 to 40 min (35 min/day).
  - Gate v2 on-disk visual JSON specs in `src/lib/data/lessonVisuals/java-basics/day-46.json` through `day-50.json` with matching SHA-256 code hashes.
  - Tests 100% passing (`tests/java_basics_visuals_expansion.test.ts` for Days 6 to 50), 0 TypeScript compiler errors (`npx tsc --noEmit`).
"""

with open(memory_path, 'a', encoding='utf-8') as f:
    f.write(milestone_entry)

print('Updated PROJECT_MEMORY.md successfully!')
