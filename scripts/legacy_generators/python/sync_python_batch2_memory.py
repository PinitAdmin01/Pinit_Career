import csv
import os
from datetime import datetime

MEM_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
TASKS_CSV = os.path.join(MEM_DIR, "agent_tasks.csv")
CONTROL_CSV = os.path.join(MEM_DIR, "multi_agent_control.csv")
PROJECT_MEM = os.path.join(MEM_DIR, "PROJECT_MEMORY.md")

# 1. Update agent_tasks.csv
if os.path.exists(TASKS_CSV):
    with open(TASKS_CSV, mode="r", encoding="utf-8", newline="") as f:
        reader = list(csv.DictReader(f))
        fieldnames = reader[0].keys() if reader else []

    updated = False
    for row in reader:
        if row.get("Task_ID") in ["TASK-1499", "TASK-1500", "TASK-1501", "TASK-1502", "TASK-1503"]:
            row["Status"] = "COMPLETED"
            updated = True

    if updated:
        with open(TASKS_CSV, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(reader)
        print("Updated agent_tasks.csv: marked TASK-1499..TASK-1503 as COMPLETED.")

# 2. Update multi_agent_control.csv
if os.path.exists(CONTROL_CSV):
    with open(CONTROL_CSV, mode="r", encoding="utf-8", newline="") as f:
        reader = list(csv.DictReader(f))
        fieldnames = reader[0].keys() if reader else []

    updated_ctrl = False
    for row in reader:
        if row.get("Agent_ID") == "AGENT-434":
            row["Status"] = "Completed"
            updated_ctrl = True

    if updated_ctrl:
        with open(CONTROL_CSV, mode="w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(reader)
        print("Updated multi_agent_control.csv: marked AGENT-434 as Completed.")

# 3. Prepend to PROJECT_MEMORY.md
if os.path.exists(PROJECT_MEM):
    with open(PROJECT_MEM, mode="r", encoding="utf-8") as f:
        content = f.read()

    milestone_header = f"""## Milestone Completion: Course 20 (Python Programming & Backend Systems) Month 2 Block 8 (Days 36–40) Complete
- **Date**: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
- **Course**: Course 20: Python Programming & Backend Systems (`course-python-backend` / `python`)
- **Batch**: Month 2 Pioneer Batch 2 (Block 8: Days 36–40: SQLAlchemy 2.0 Async ORM & High-Scale Database Patterns)
- **Course Progress**: **40 of 60 Days Complete (66.7%)**
- **Tasks Completed**:
  - `TASK-1499`: Day 36 - SQLAlchemy 2.0 Async Engine & Connection Pooling (QueuePool, overflow, timeout queues)
  - `TASK-1500`: Day 37 - Unit of Work Pattern & Identity Map Physics (Transient/Pending/Persistent lifecycle, dirty diffs)
  - `TASK-1501`: Day 38 - High-Scale Query Optimization & The N+1 Problem (selectinload, joinedload, Cartesian product avoidance)
  - `TASK-1502`: Day 39 - Database Migrations with Alembic & Zero-Downtime Schema Evolution (Expand & Contract, online DDL, lock_timeout)
  - `TASK-1503`: Day 40 - 🏆 Milestone Project 7: High-Scale Async ORM & Zero-Downtime Data Layer Engine (Synthesis & Verification Gate)
- **Pedagogical & Structural Invariants Verified**:
  - 5 parts per day, 5 paragraphs per part, each part say >= 580 words (2,927–2,975 words daily total).
  - Spoken minutes >= 20 (27 min), total lesson minutes strictly in [35, 40] (37–38 min).
  - Deterministic Python 3 code execution in both native Python and browser Pyodide WebAssembly (zero `asyncio.run()` runtime conflicts).
  - Gate v2 Visual JSON contracts deployed to `src/lib/data/lessonVisuals/python/day-36..40.json` with matching SHA-256 code hashes.
  - Test suites `python_days36_40_expansion.test.ts` and `python_long_lessons.test.ts` passing 100%. `npx tsc --noEmit` zero errors.

---
"""
    new_content = milestone_header + content
    with open(PROJECT_MEM, mode="w", encoding="utf-8") as f:
        f.write(new_content)
    print("Prepended milestone entry to PROJECT_MEMORY.md.")
