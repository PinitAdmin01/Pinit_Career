# scripts/register_iot_sec_block12.py
import os
import csv
from datetime import datetime

central_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Append tasks to agent_tasks.csv
tasks_csv = os.path.join(central_dir, "agent_tasks.csv")
if os.path.exists(tasks_csv):
    new_tasks = [
        ["TASK-1797", datetime.now().strftime("%Y-%m-%d"), datetime.now().strftime("%H:%M:%S"), "IN_PROGRESS", "Course 19 (iot_sec)", "Antigravity", "Course 19 Day 56: Zero-Trust Industrial Mesh Networking & 6LoWPAN Security", "python, bash", "scripts/iot_sec_day56.json", "In Progress", "codex/interview-tab-reliability", ""],
        ["TASK-1798", datetime.now().strftime("%Y-%m-%d"), datetime.now().strftime("%H:%M:%S"), "PENDING", "Course 19 (iot_sec)", "Antigravity", "Course 19 Day 57: Secure Element (SE) Hardware Integration (ATECC608B / OPTIGA)", "python, bash", "scripts/iot_sec_day57.json", "Pending", "codex/interview-tab-reliability", ""],
        ["TASK-1799", datetime.now().strftime("%Y-%m-%d"), datetime.now().strftime("%H:%M:%S"), "PENDING", "Course 19 (iot_sec)", "Antigravity", "Course 19 Day 58: Formal Verification of Embedded Cryptographic Protocols", "python, bash", "scripts/iot_sec_day58.json", "Pending", "codex/interview-tab-reliability", ""],
        ["TASK-1800", datetime.now().strftime("%Y-%m-%d"), datetime.now().strftime("%H:%M:%S"), "PENDING", "Course 19 (iot_sec)", "Antigravity", "Course 19 Day 59: IEC 62443-4-2 SL4 Compliance & Black-Box Incident Forensics", "python, bash", "scripts/iot_sec_day59.json", "Pending", "codex/interview-tab-reliability", ""],
        ["TASK-1801", datetime.now().strftime("%Y-%m-%d"), datetime.now().strftime("%H:%M:%S"), "PENDING", "Course 19 (iot_sec)", "Antigravity", "Course 19 Day 60: Milestone 12 Grand Enterprise Capstone (ApexShield Sovereign Platform)", "python, bash", "scripts/iot_sec_day60.json", "Pending", "codex/interview-tab-reliability", ""]
    ]
    with open(tasks_csv, "a", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(new_tasks)
    print("Registered TASK-1797..1801 in agent_tasks.csv!")

# 2. Append AGENT-489 to multi_agent_control.csv
control_csv = os.path.join(central_dir, "multi_agent_control.csv")
if os.path.exists(control_csv):
    with open(control_csv, "a", encoding="utf-8") as f:
        f.write(f"AGENT-489,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1797..1801,Active,{now_str},Block 12: Days 56-60 & Milestone 12 Grand Enterprise Capstone (Final 100% Completion of Course 19),,,,\n")
    print("Registered AGENT-489 in multi_agent_control.csv!")
