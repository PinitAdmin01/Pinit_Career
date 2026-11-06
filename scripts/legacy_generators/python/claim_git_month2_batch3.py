# scripts/claim_git_month2_batch3.py
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

print("=== CLAIMING COURSE 20 GIT_VCS MONTH 2 BATCH 3 (DAYS 41-45) ===")

batch_tasks = [
    ("TASK-1238", "git_vcs Day 41: Cryptographic Commit & Tag Signing: GPG vs SSH Key Signatures, Web-Flow Verification & Allowed Signers", "AGENT-391", "Course 20 git_vcs", "In_Progress", today_str),
    ("TASK-1239", "git_vcs Day 42: Secret Detection & Pre-Commit Hardening: Pre-Commit Hooks, Gitleaks, TruffleHog & Entropy Scanning", "AGENT-391", "Course 20 git_vcs", "In_Progress", today_str),
    ("TASK-1240", "git_vcs Day 43: Permanent Secret Purging & Repository Cleansing: git filter-repo vs BFG, Rewriting Packfiles & Reflogs", "AGENT-391", "Course 20 git_vcs", "In_Progress", today_str),
    ("TASK-1241", "git_vcs Day 44: Tamper-Evident Repository Auditing: Merkle Tree Invariants, SHA-1 Collision Attacks & SHA-256 Architecture", "AGENT-391", "Course 20 git_vcs", "In_Progress", today_str),
    ("TASK-1242", "git_vcs Day 45: Milestone 6 (M2): ApexAudit Cryptographic Git Verification & Secrets Hardening Suite", "AGENT-391", "Course 20 git_vcs", "In_Progress", today_str)
]

# 1. Append tasks to agent_tasks.csv
with open(tasks_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for t in batch_tasks:
        writer.writerow(t)
        print(f"Registered {t[0]}: {t[1]}")

print(f"Updated {tasks_path} successfully.")

# 2. Append AGENT-391 to multi_agent_control.csv
agent_record = [
    "AGENT-391",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1238",
    "In_Progress",
    now_str,
    "5-Task Batch Protocol In Progress: Month 2 Pioneer Batch 3 — Course 20 git_vcs Days 41-45: Cryptographic Commit/Tag Signing, Secret Detection & Pre-Commit Hardening, Permanent Secret Purging/filter-repo, Merkle Tree Invariants/SHA-256 & ApexAudit Milestone 6 Capstone (TASK-1238..1242)."
]

with open(control_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(agent_record)

print(f"Registered AGENT-391 in {control_path} successfully.")
print("=== CLAIM COMPLETE ===")
