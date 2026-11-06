# scripts/claim_git_month2_batch4.py
import sys
import os
import re
import csv
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

# 1. Extract Days 46-50 ground truth from PINIT_MASTER_DEBUG.html
with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('39.2 Month 2: Distributed Topology')
end_pos = html.find('Part XL:', pos)
part_html = html[pos:end_pos]

# Clean HTML tags to get readable ground truth for Days 46-50
day46_pos = part_html.find('Day 46')
day51_pos = part_html.find('Day 51')
block10_html = part_html[day46_pos - 200 : day51_pos if day51_pos != -1 else len(part_html)]
clean_text = re.sub(r'<[^>]+>', ' ', block10_html)
clean_text = re.sub(r'\s+', ' ', clean_text).strip()

with open('scripts/git_month2_batch4_bible.txt', 'w', encoding='utf-8') as f:
    f.write(clean_text + '\n')

print("Extracted Ground Truth for Days 46-50:")
print(clean_text)

# 2. Claim TASK-1248..1252 and AGENT-393 in central memory
memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
control_path = os.path.join(memory_dir, "multi_agent_control.csv")

today_str = datetime.now().strftime("%Y-%m-%d")
now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

new_tasks = [
    ["TASK-1248", "git_vcs Day 46: Advanced GitHub Actions: Composite Actions, Reusable Workflows (workflow_call), Matrix Strategies & Cache", "AGENT-393", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1249", "git_vcs Day 47: Self-Hosted Runners, Security Isolation, Ephemeral Environments & OIDC Cloud Authentication (AWS/GCP)", "AGENT-393", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1250", "git_vcs Day 48: GitHub Enterprise Administration: GitHub Apps vs Fine-Grained PATs, Webhooks & Audit Log Streaming", "AGENT-393", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1251", "git_vcs Day 49: Repository Governance at Scale: Organization Rulesets, CODEOWNERS, Automated Merge Queues & Branch Policies", "AGENT-393", "Course 20 git_vcs", "In_Progress", today_str],
    ["TASK-1252", "git_vcs Day 50: Milestone 7 (M2): ApexAutomate Enterprise GitHub Actions & Security Automation Suite", "AGENT-393", "Course 20 git_vcs", "In_Progress", today_str],
]

with open(tasks_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(new_tasks)
print("Appended TASK-1248..1252 to agent_tasks.csv")

agent_row = [
    "AGENT-393",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1248",
    "In_Progress",
    now_str,
    "5-Task Batch Protocol In Progress: Month 2 Pioneer Batch 4 — Course 20 git_vcs Days 46-50: Advanced GitHub Actions, Self-Hosted Runners/OIDC, GitHub Enterprise Admin, Repository Governance at Scale & ApexAutomate Milestone 7 Capstone (TASK-1248..1252)."
]

with open(control_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(agent_row)
print("Appended AGENT-393 to multi_agent_control.csv")
