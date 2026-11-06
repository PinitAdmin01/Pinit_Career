import csv
import os

MEM_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
TASKS_CSV = os.path.join(MEM_DIR, "agent_tasks.csv")
CONTROL_CSV = os.path.join(MEM_DIR, "multi_agent_control.csv")

# 1. Register in agent_tasks.csv
rows = []
with open(TASKS_CSV, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    rows = list(reader)

existing_ids = {r[0] for r in rows if r}

new_tasks = [
    ["TASK-1504", "Course 20", "python", "Day 41 - Distributed Task Queue Architecture: Celery & Broker Mechanics", "IN_PROGRESS", "Task offloading, AMQP/Redis broker serialization, task_acks_late vs early ACK, prefetch limits"],
    ["TASK-1505", "Course 20", "python", "Day 42 - Celery Canvas: Chains, Groups, Chords & Complex Workflows", "PENDING", "Canvas primitives, sequential chains, parallel groups, chord barrier synchronization and polling"],
    ["TASK-1506", "Course 20", "python", "Day 43 - Reliability, Idempotency & Visibility Timeouts", "PENDING", "At-least-once delivery, visibility timeouts, idempotency keys, distributed locks and retry jitter"],
    ["TASK-1507", "Course 20", "python", "Day 44 - Dead-Letter Queues, Monitoring & Flower Observability", "PENDING", "Poison pill isolation, AMQP dead-letter exchanges, exponential backoff, worker cluster monitoring"],
    ["TASK-1508", "Course 20", "python", "Day 45 - Milestone Project 8: Resilient Distributed Task Queue & Workflow Orchestration Engine", "PENDING", "Complete production background processing tier integrating broker durability, Canvas chords, and DLQ isolation"]
]

for t in new_tasks:
    if t[0] not in existing_ids:
        rows.append(t)

with open(TASKS_CSV, "w", encoding="utf-8", newline="") as f:
    csv.writer(f).writerows(rows)
print("Registered TASK-1504..1508 in agent_tasks.csv")

# 2. Register AGENT-435 in multi_agent_control.csv
control_rows = []
with open(CONTROL_CSV, "r", encoding="utf-8") as f:
    control_rows = list(csv.reader(f))

agent_exists = any(r and r[0] == "AGENT-435" for r in control_rows)
if not agent_exists:
    control_rows.append([
        "AGENT-435",
        "Antigravity",
        "codex/interview-tab-reliability",
        "Present-Career-os",
        "TASK-1504..1508",
        "In_Progress",
        "2026-10-18 22:25:00",
        "Course 20 (python) Block 9: Days 41-45 (Distributed Task Queue Architecture: Celery & Workflows)",
        "", "", "", ""
    ])

with open(CONTROL_CSV, "w", encoding="utf-8", newline="") as f:
    csv.writer(f).writerows(control_rows)
print("Registered AGENT-435 as In_Progress in multi_agent_control.csv")
