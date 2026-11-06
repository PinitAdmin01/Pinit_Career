import os, sys

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

# 1. Append tasks to agent_tasks.csv
tasks_file = os.path.join(memory_dir, "agent_tasks.csv")
new_tasks = [
    'TASK-1152,Antigravity,In_Progress,"TASK-1152: Expand Workplace Soft Skills Day 21: ⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine"',
    'TASK-1153,Antigravity,In_Progress,"TASK-1153: Expand Workplace Soft Skills Day 22: High-Signal Reverse Interviewing: Questions to Ask the Interviewer"',
    'TASK-1154,Antigravity,In_Progress,"TASK-1154: Expand Workplace Soft Skills Day 23: Live Coding & Whiteboard Communication Protocols: The Think-Aloud Protocol & Requirement Framing"',
    'TASK-1155,Antigravity,In_Progress,"TASK-1155: Expand Workplace Soft Skills Day 24: System Design Interview Communication: The RADIO Framework"',
    'TASK-1156,Antigravity,In_Progress,"TASK-1156: Expand Workplace Soft Skills Day 25: Salary Negotiation & Compensation Mastery: Total Compensation (TC) Mechanics"'
]

with open(tasks_file, "a", encoding="utf-8") as f:
    for t in new_tasks:
        f.write("\n" + t)
print("Registered TASK-1152..1156 in agent_tasks.csv")

# 2. Register AGENT-373 in multi_agent_control.csv
control_file = os.path.join(memory_dir, "multi_agent_control.csv")
agent_line = 'AGENT-373,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1156,In_Progress,2026-10-17 18:45:00,"5-Task Batch Protocol In Progress: Course 24 soft_skills Days 21-25 (Milestone 3 Capstone, Reverse Interviewing, Live Coding Protocols, RADIO System Design, Salary Negotiation, TASK-1152..1156)."'

with open(control_file, "a", encoding="utf-8") as f:
    f.write("\n" + agent_line)
print("Registered AGENT-373 in multi_agent_control.csv")
