import os
import sys

# 1. Update multi_agent_control.csv
control_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
with open(control_csv, "r", encoding="utf-8", errors="replace") as f:
    c_content = f.read()

new_agent_line = '\nAGENT-368,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1141,In_Progress,2026-10-17 17:20:00,"5-Task Batch Protocol In Progress: Course 24 soft_skills Days 11-15 (SCR Bad News Framework, ZOPA/BATNA Negotiation, Maker Deep Work, Imposter Syndrome Burnout, Milestone 2 Capstone, TASK-1137..1141)."\n'

if "AGENT-368" not in c_content:
    with open(control_csv, "a", encoding="utf-8") as f:
        f.write(new_agent_line)
    print("Claimed AGENT-368 in multi_agent_control.csv")
else:
    print("AGENT-368 already claimed in multi_agent_control.csv")

# 2. Append agent_tasks.csv
tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
with open(tasks_csv, "r", encoding="utf-8", errors="replace") as f:
    t_content = f.read()

tasks_to_add = [
    'TASK-1137,Antigravity,In_Progress,"TASK-1137: Expand Workplace Soft Skills Day 11: Executive Presence & Delivering Bad News: The SCR Communication Framework"',
    'TASK-1138,Antigravity,In_Progress,"TASK-1138: Expand Workplace Soft Skills Day 12: Negotiation & Persuasion for Engineers: Establishing ZOPA & BATNA"',
    'TASK-1139,Antigravity,In_Progress,"TASK-1139: Expand Workplace Soft Skills Day 13: Time Management & Deep Work Boundary Setting: Maker\'s Schedule vs Manager\'s Schedule"',
    'TASK-1140,Antigravity,In_Progress,"TASK-1140: Expand Workplace Soft Skills Day 14: Mental Health, Imposter Syndrome & Burnout Prevention: Psychological Safety"',
    'TASK-1141,Antigravity,In_Progress,"TASK-1141: Expand Workplace Soft Skills Day 15: ⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine"'
]

with open(tasks_csv, "a", encoding="utf-8") as f:
    for t in tasks_to_add:
        tid = t.split(",")[0]
        if tid not in t_content:
            f.write(t + "\n")
            print(f"Added {tid} to agent_tasks.csv")
        else:
            print(f"{tid} already in agent_tasks.csv")

print("Batch 2 claimed successfully!")
