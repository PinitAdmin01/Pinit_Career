import csv
import os
from datetime import datetime

MEM_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
TASKS_CSV = os.path.join(MEM_DIR, "agent_tasks.csv")
CONTROL_CSV = os.path.join(MEM_DIR, "multi_agent_control.csv")
PROJECT_MEMORY_MD = os.path.join(MEM_DIR, "PROJECT_MEMORY.md")

# 1. Append tasks to agent_tasks.csv
new_tasks = [
    ["TASK-1529", "Course 20", "python", "Day 41 - Distributed Task Queue Architecture: Celery & Broker Mechanics", "COMPLETED", "Task offloading, AMQP/Redis broker serialization, task_acks_late vs early ACK, fair prefetch limits, zero task loss under SIGKILL crash."],
    ["TASK-1530", "Course 20", "python", "Day 42 - Celery Canvas: Chains, Groups, Chords & Complex Workflows", "COMPLETED", "Canvas primitives, sequential chains, parallel groups, chord barrier synchronization, and thundering herd polling storm defense."],
    ["TASK-1531", "Course 20", "python", "Day 43 - Reliability, Idempotency & Visibility Timeouts", "COMPLETED", "At-least-once delivery, visibility timeouts, idempotency keys, atomic distributed locks with TTL leases, and zero double-billing."],
    ["TASK-1532", "Course 20", "python", "Day 44 - Dead-Letter Queues, Monitoring & Flower Observability", "COMPLETED", "Poison pill isolation, AMQP dead-letter exchanges, exponential backoff with jitter, worker pool profiling (prefork vs gevent), Flower/Prometheus metrics."],
    ["TASK-1533", "Course 20", "python", "Day 45 - Milestone Project 8: Resilient Distributed Task Queue & Workflow Orchestration Engine", "COMPLETED", "Complete enterprise distributed processing tier integrating broker durability, Canvas chords, and DLQ isolation certified for production."]
]

with open(TASKS_CSV, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for t in new_tasks:
        writer.writerow(t)

print("Appended TASK-1529..1533 as COMPLETED in agent_tasks.csv")

# 2. Update multi_agent_control.csv for AGENT-435
control_rows = []
with open(CONTROL_CSV, "r", encoding="utf-8") as f:
    control_rows = list(csv.reader(f))

updated = False
for r in control_rows:
    if r and r[0] == "AGENT-435":
        r[4] = "TASK-1529..1533"
        r[5] = "Completed"
        r[6] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        r[7] = "Course 20 (python) Block 9: Days 41-45 complete & verified. 45/60 days (75.0%)."
        updated = True
        break

if not updated:
    control_rows.append([
        "AGENT-435", "Antigravity", "codex/interview-tab-reliability", "Present-Career-os",
        "TASK-1529..1533", "Completed", datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Course 20 (python) Block 9: Days 41-45 complete & verified. 45/60 days (75.0%).",
        "", "", "", ""
    ])

with open(CONTROL_CSV, "w", encoding="utf-8", newline="") as f:
    csv.writer(f).writerows(control_rows)

print("Updated AGENT-435 to Completed in multi_agent_control.csv")

# 3. Prepend milestone entry to PROJECT_MEMORY.md
with open(PROJECT_MEMORY_MD, "r", encoding="utf-8") as f:
    mem_content = f.read()

entry = f"""### Milestone Update: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Course 20 Month 2 Batch 3 (Block 9: Days 41-45) COMPLETE
- **Course**: Course 20: Python Programming & Backend Systems (`course-python-backend` / `python`)
- **Stage**: Stage 9: Distributed Background Processing & Asynchronous Architecture (Block 9: Days 41-45)
- **Completed Tasks**: `TASK-1529` to `TASK-1533`
  - **Day 41 (`TASK-1529`)**: Distributed Task Queue Architecture: Celery & Broker Mechanics
  - **Day 42 (`TASK-1530`)**: Celery Canvas: Chains, Groups, Chords & Complex Workflows
  - **Day 43 (`TASK-1531`)**: Reliability, Idempotency & Visibility Timeouts
  - **Day 44 (`TASK-1532`)**: Dead-Letter Queues, Monitoring & Flower Observability
  - **Day 45 (`TASK-1533`)**: 🏆 Milestone Project 8: Resilient Distributed Task Queue & Workflow Orchestration Engine
- **Invariants & Verification**:
  - Exactly 5 parts per day, each part $\ge 580$ words in `say` (target 581-597 words), strictly in [35, 40] lesson minutes.
  - 100% deterministic code output matching executed in native Python 3 and Pyodide test harness.
  - Gate v2 Visual JSON contracts authored and SHA-256 code verified in `src/lib/data/lessonVisuals/python/day-{{41..45}}.json`.
  - Resolution and integrity validated across `tests/python_days41_45_expansion.test.ts` and `tests/python_long_lessons.test.ts`.
- **Course Progress**: **45 of 60 Days Complete (75.0%)**. Next Batch: Month 2 Pioneer Batch 4 (Block 10: Days 46–50: Caching Architecture & Redis In-Memory Performance).

---

"""

# Insert milestone update right after header or at top of progress
target_marker = "## Recent Milestones & Completed Work"
if target_marker in mem_content:
    new_mem = mem_content.replace(target_marker, f"{target_marker}\n\n{entry}")
else:
    new_mem = f"# Shared Project Memory\n\n{entry}\n\n" + mem_content

with open(PROJECT_MEMORY_MD, "w", encoding="utf-8") as f:
    f.write(new_mem)

print("Prepended milestone entry to PROJECT_MEMORY.md")
