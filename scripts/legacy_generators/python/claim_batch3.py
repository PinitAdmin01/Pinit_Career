import os

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

# 1. Claim in agent_tasks.csv
tasks_file = os.path.join(memory_dir, "agent_tasks.csv")
new_tasks = [
    'TASK-1142,Antigravity,In_Progress,"TASK-1142: Expand Workplace Soft Skills Day 16: Tech Resume Engineering: The Google X-Y-Z Formula & Impact Quantification"',
    'TASK-1143,Antigravity,In_Progress,"TASK-1143: Expand Workplace Soft Skills Day 17: LinkedIn Optimization & Personal Branding: High-Signal Engineering Profiles"',
    'TASK-1144,Antigravity,In_Progress,"TASK-1144: Expand Workplace Soft Skills Day 18: The Behavioral Interview Framework: The STAR Method & Time Allocation"',
    'TASK-1145,Antigravity,In_Progress,"TASK-1145: Expand Workplace Soft Skills Day 19: Answering \\"Tell Me About Yourself\\": The 90-Second Present-Past-Future Pitch"',
    'TASK-1146,Antigravity,In_Progress,"TASK-1146: Expand Workplace Soft Skills Day 20: Tackling \\"Tell Me About a Time You Failed\\": Blameless Postmortem Storytelling"'
]

with open(tasks_file, "a", encoding="utf-8") as f:
    for t in new_tasks:
        f.write("\n" + t)
print("Registered TASK-1142..1146 in agent_tasks.csv")

# 2. Claim in multi_agent_control.csv
control_file = os.path.join(memory_dir, "multi_agent_control.csv")
agent_line = 'AGENT-370,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1146,In_Progress,2026-10-17 18:10:00,"5-Task Batch Protocol In Progress: Course 24 soft_skills Days 16-20 (Google X-Y-Z Resume, LinkedIn Brand, STAR Behavioral Method, Tell Me About Yourself Pitch, Failure Storytelling, TASK-1142..1146)."'

with open(control_file, "a", encoding="utf-8") as f:
    f.write("\n" + agent_line)
print("Registered AGENT-370 in multi_agent_control.csv")
