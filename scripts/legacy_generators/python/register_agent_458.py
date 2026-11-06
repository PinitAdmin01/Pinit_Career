import os
import csv
from datetime import datetime

MEMORY_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
CONTROL_CSV = os.path.join(MEMORY_DIR, "multi_agent_control.csv")
TASKS_CSV = os.path.join(MEMORY_DIR, "agent_tasks.csv")

now = datetime.now()
date_str = now.strftime("%Y-%m-%d")
time_str = now.strftime("%H:%M:%S")

# 1. Register AGENT-458 in multi_agent_control.csv
with open(CONTROL_CSV, "a", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        "AGENT-458",
        "Antigravity",
        "codex/interview-tab-reliability",
        "Present-Career-os",
        "TASK-1629..1633",
        "In_Progress",
        "none",
        "Course 02 (react-basics) Month 2 Block 8 (Days 36-40): The 16ms Frame Budget, Lane Priority Architecture, useTransition, useDeferredValue & Milestone 7 Low-Latency 10k-Node Visual Graph Filter",
        f"{date_str} {time_str}",
        "",
        "",
        ""
    ])
print("Registered AGENT-458 in multi_agent_control.csv")

# 2. Register TASK-1629..1633 in agent_tasks.csv
tasks = [
    ("TASK-1629", "Course 02 react-basics Day 36: The 16ms Frame Budget: Cooperative Multitasking, MessageChannel Scheduler & Time Slicing"),
    ("TASK-1630", "Course 02 react-basics Day 37: Lane Priority Architecture: Bitmask Priority Scheduling (Sync, Continuous, Default, Idle Lanes)"),
    ("TASK-1631", "Course 02 react-basics Day 38: Non-Urgent Updates with useTransition: Preventing UI Freezes on Heavy State Computations"),
    ("TASK-1632", "Course 02 react-basics Day 39: Responsive Search with useDeferredValue: Debouncing vs Deferred Rendering Benchmarks"),
    ("TASK-1633", "Course 02 react-basics Day 40: Milestone 7: Low-Latency 10,000-Node Visual Graph Filter with useTransition & Time Slicing")
]

with open(TASKS_CSV, "a", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    for tid, goal in tasks:
        w.writerow([
            tid,
            date_str,
            time_str,
            "IN_PROGRESS",
            "codex/interview-tab-reliability",
            "Antigravity",
            goal,
            "python,node,git",
            f"src/lib/data/reactLongLessons.ts,src/lib/data/react30DayData.ts,src/lib/data/lessonVisuals/react-basics/day-36..40.json",
            "In progress curriculum expansion",
            "Present-Career-os",
            ""
        ])
print("Registered TASK-1629..1633 in agent_tasks.csv")
