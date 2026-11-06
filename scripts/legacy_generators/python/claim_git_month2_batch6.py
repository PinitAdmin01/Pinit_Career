# scripts/claim_git_month2_batch6.py
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

new_tasks = [
    ["TASK-1269", "git_vcs Day 56: Historic Catastrophe Post-Mortem 1: The Commercial Force-Push Repository Obliteration ($12M Lost WIP)", "AGENT-398", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1270", "git_vcs Day 57: Historic Catastrophe Post-Mortem 2: The Hardcoded AWS Root Key GitHub Leak ($4.5M Cloud Compromise)", "AGENT-398", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1271", "git_vcs Day 58: Historic Catastrophe Post-Mortem 3: The Broken Merge Conflict Silent Semantic Corruption (The $440M Glitch)", "AGENT-398", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1272", "git_vcs Day 59: Principal DevOps Architect Modernization RFC: Transitioning 2,000 Polyrepos to a Scalable Monorepo ($25M Blueprint)", "AGENT-398", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1273", "git_vcs Day 60: Capstone 2: ApexEnterpriseGitOps Sovereign Distributed Version Control & Enterprise Release Master Capstone Viva", "AGENT-398", "Course 20 git_vcs", "In_Progress", today_str],
]

with open(tasks_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(new_tasks)
print("Appended TASK-1269..1273 to agent_tasks.csv")

agent_row = [
    "AGENT-398",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1269",
    "In_Progress",
    now_str,
    "5-Task Batch Protocol In Progress: Month 2 Pioneer Batch 6 (FINAL COURSE 20 BATCH) — Course 20 git_vcs Days 56-60: $12M Force-Push Post-Mortem, $4.5M AWS Root Key Leak Post-Mortem, Knight Capital $440M Semantic Merge Post-Mortem, $25M Polyrepo-to-Monorepo Modernization RFC & ApexEnterpriseGitOps Grand Capstone Viva (TASK-1269..1273)."
]

with open(control_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(agent_row)
print("Appended AGENT-398 to multi_agent_control.csv")
