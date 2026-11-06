# scripts/claim_git_month2_batch5.py
import sys
import os
import re
import csv
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

# 1. Extract Days 51-55 ground truth from PINIT_MASTER_DEBUG.html
with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('39.2 Month 2: Distributed Topology')
end_pos = html.find('Part XL:', pos)
part_html = html[pos:end_pos]

day51_pos = part_html.find('Day 51')
day56_pos = part_html.find('Day 56')
block11_html = part_html[day51_pos - 200 : day56_pos if day56_pos != -1 else len(part_html)]
clean_text = re.sub(r'<[^>]+>', ' ', block11_html)
clean_text = re.sub(r'\s+', ' ', clean_text).strip()

with open('scripts/git_month2_batch5_bible.txt', 'w', encoding='utf-8') as f:
    f.write(clean_text + '\n')

for d in range(51, 56):
    p1 = clean_text.find(f'Day {d}')
    p2 = clean_text.find(f'Day {d+1}') if d < 55 else len(clean_text)
    print(f"=== DAY {d} ===")
    print(clean_text[p1:p1+700])

# 2. Claim TASK-1259..1263 and AGENT-396 in central memory
memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
control_path = os.path.join(memory_dir, "multi_agent_control.csv")

today_str = datetime.now().strftime("%Y-%m-%d")
now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

new_tasks = [
    ["TASK-1259", "git_vcs Day 51: Git Performance Tuning at Scale: Commit-Graph, Multi-Pack-Index (MIDX), FSMonitor & Bitmap Indexes", "AGENT-396", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1260", "git_vcs Day 52: Git Garbage Collection & Maintenance Engineering: git gc, git maintenance, Geometric Repacking & Cruft Packs", "AGENT-396", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1261", "git_vcs Day 53: Deep Disaster Forensics & Object Recovery: Corrupted Packfiles, Dangling Objects, git fsck & Manual Unpacking", "AGENT-396", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1262", "git_vcs Day 54: Multi-Agent Git Orchestration: Worktree Pools, Branch Namespacing, Lock Collision Prevention & Merge Synthesis", "AGENT-396", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1263", "git_vcs Day 55: Legacy VCS Migration Engineering: Migrating Subversion (SVN), Perforce & Mercurial to Git with Full History", "AGENT-396", "Course 20 git_vcs", "In_Progress", today_str],
]

with open(tasks_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(new_tasks)
print("Appended TASK-1259..1263 to agent_tasks.csv")

agent_row = [
    "AGENT-396",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1259",
    "In_Progress",
    now_str,
    "5-Task Batch Protocol In Progress: Month 2 Pioneer Batch 5 — Course 20 git_vcs Days 51-55: Git Performance Tuning (Commit-Graph/MIDX/FSMonitor), Maintenance Engineering (Geometric Repack/Cruft Packs), Disaster Forensics (fsck/Corrupted Packfiles), Multi-Agent Worktree Orchestration & Legacy VCS Migration Engineering (TASK-1259..1263)."
]

with open(control_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(agent_row)
print("Appended AGENT-396 to multi_agent_control.csv")
