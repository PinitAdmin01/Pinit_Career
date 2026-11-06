import csv
import os
from datetime import datetime

memory_dir = "C:/Users/Admin/Desktop/projects/memory of agent"
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
commit_sha = "b5e2e8d7"

# 1. Update multi_agent_control.csv
control_path = os.path.join(memory_dir, "multi_agent_control.csv")
with open(control_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow([
        "AGENT-501",
        "Agent Branch B",
        "agent/branch-b-curriculum-commerce-iot",
        "Present-Career-os-commerce",
        "TASK-1891..1895",
        "Completed",
        timestamp,
        f"Block 12: Days 56-60 & Milestone 12 Final Grand Capstone (bcom_acc) completed, tested (73/73 pass), and pushed (commit {commit_sha}). Course 01 bcom_acc 100% CONQUERED (60/60 Days)! 16,662 words generated.",
        "",
        "",
        "",
        ""
    ])
print("multi_agent_control.csv updated!")

# 2. Update agent_tasks.csv
tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
if os.path.exists(tasks_path):
    rows = []
    with open(tasks_path, "r", encoding="utf-8", newline="") as f:
        reader = csv.reader(f)
        for r in reader:
            if len(r) > 4 and "bcom_acc" in r[1].lower() and ("block 12" in r[1].lower() or "56-60" in r[1].lower()):
                r[4] = "COMPLETED"
                r[7] = "100%"
                r[8] = f"Completed 60/60 Days Graduation on {timestamp} (commit {commit_sha})"
            rows.append(r)
    with open(tasks_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(rows)
print("agent_tasks.csv updated!")

# 3. Update PROJECT_MEMORY.md with commit sha
pm_path = os.path.join(memory_dir, "PROJECT_MEMORY.md")
with open(pm_path, "a", encoding="utf-8") as f:
    f.write(f"\n- **Graduation Commit**: `{commit_sha}` pushed to `origin/agent/branch-b-curriculum-commerce-iot` at {timestamp}.\n")
print("PROJECT_MEMORY.md updated with commit SHA!")
