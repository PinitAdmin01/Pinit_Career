# scripts/claim_git_month2_batch2.py
import sys
import os
import csv
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
control_path = os.path.join(memory_dir, "multi_agent_control.csv")

today_str = datetime.now().strftime("%Y-%m-%d")
now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

print("=== CLAIMING COURSE 20 GIT_VCS MONTH 2 BATCH 2 (DAYS 36-40) ===")

batch_tasks = [
    ("TASK-1233", "git_vcs Day 36: Branching Strategies at Scale: Gitflow vs GitHub Flow vs Trunk-Based Development & Short-Lived Branches", "AGENT-390", "Course 20 git_vcs", "In_Progress", today_str),
    ("TASK-1234", "git_vcs Day 37: Monorepo vs Polyrepo Architecture: Scaling Bottlenecks, Hermetic Builds & Dependency Graph Management", "AGENT-390", "Course 20 git_vcs", "In_Progress", today_str),
    ("TASK-1235", "git_vcs Day 38: Scalable Large Repositories: Sparse Checkout (git sparse-checkout), Blobless Clones & Microsoft Scalar", "AGENT-390", "Course 20 git_vcs", "In_Progress", today_str),
    ("TASK-1236", "git_vcs Day 39: Git LFS (Large File Storage): Pointer Files, Smudge/Clean Filters, S3 Storage Backends & Asset Deduplication", "AGENT-390", "Course 20 git_vcs", "In_Progress", today_str),
    ("TASK-1237", "git_vcs Day 40: Milestone 5 (M2): ApexRelease Enterprise Trunk-Based CI/CD Release Engine Suite", "AGENT-390", "Course 20 git_vcs", "In_Progress", today_str),
]

# Append to agent_tasks.csv
with open(tasks_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for t in batch_tasks:
        writer.writerow(t)
        print(f"Registered {t[0]}: {t[1]}")

# Register in multi_agent_control.csv
agent_entry = [
    "AGENT-390",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1233",
    "In_Progress",
    now_str,
    "5-Task Batch Protocol In Progress: Month 2 Pioneer Batch 2 — Course 20 git_vcs Days 36-40: Branching Strategies at Scale, Monorepo vs Polyrepo, Sparse Checkout/Scalar, Git LFS & ApexRelease Milestone 5 Capstone (TASK-1233..1237)."
]

with open(control_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(agent_entry)
print(f"Registered AGENT-390 as In_Progress in {control_path}")

print("=== CLAIM PROTOCOL COMPLETE ===")
