import csv

# 1. Register in agent_tasks.csv
tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
rows = []
with open(tasks_file, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    rows = list(reader)

# Check if TASK-1499 already exists
existing_ids = {r[0] for r in rows if r}

new_tasks = [
    ["TASK-1499", "Course 20", "python", "Day 36 - SQLAlchemy 2.0 Async Engine & Connection Pooling", "IN_PROGRESS", "create_async_engine, QueuePool mechanics, connection starvation and checkout lifecycle"],
    ["TASK-1500", "Course 20", "python", "Day 37 - Unit of Work Pattern & Identity Map Physics", "PENDING", "AsyncSession, Unit of Work transaction boundaries, Identity Map caching and flush ordering"],
    ["TASK-1501", "Course 20", "python", "Day 38 - High-Scale Query Optimization & The N+1 Problem", "PENDING", "selectinload, joinedload, subqueryload eager loading and statement compilation analysis"],
    ["TASK-1502", "Course 20", "python", "Day 39 - Database Migrations with Alembic & Zero-Downtime Schema Evolution", "PENDING", "Expand-contract migration patterns, online DDL, lock timeouts and rollback safety"],
    ["TASK-1503", "Course 20", "python", "Day 40 - Milestone Project 7: High-Scale Async ORM & Zero-Downtime Data Layer Engine", "PENDING", "Complete production async data layer integrating connection pooling, eager loading and safe migrations"]
]

for t in new_tasks:
    if t[0] not in existing_ids:
        rows.append(t)

with open(tasks_file, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print("Registered TASK-1499..1503 in agent_tasks.csv")

# 2. Register AGENT-434 in multi_agent_control.csv
control_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
control_rows = []
with open(control_file, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    control_rows = list(reader)

agent_exists = any(r and r[0] == "AGENT-434" for r in control_rows)
if not agent_exists:
    control_rows.append([
        "AGENT-434",
        "Antigravity",
        "codex/interview-tab-reliability",
        "Present-Career-os",
        "Course 20 (python) Block 8: Days 36-40 (SQLAlchemy 2.0 Async ORM)",
        "2026-10-18 21:55:00",
        "In_Progress",
        "None"
    ])

with open(control_file, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(control_rows)
print("Registered AGENT-434 as In_Progress in multi_agent_control.csv")
