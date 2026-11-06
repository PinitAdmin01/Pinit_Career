# scripts/register_iot_sec_block7.py
import csv
from datetime import datetime

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

# 1. Append TASK-1754..1758 to agent_tasks.csv
new_tasks = [
    ["TASK-1754", datetime.now().strftime("%Y-%m-%d"), datetime.now().strftime("%H:%M:%S"), "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "", "read_file, write_file, run_command", "scripts/iot_sec_day31.json, src/lib/data/lessonVisuals/iot_sec/day-31.json", "Course 19 Day 31: Voltage Glitch Injection: Crowbar Circuits, Under-Voltage Transitions & Instruction Skip Exploits", "Present-Career-os", ""],
    ["TASK-1755", datetime.now().strftime("%Y-%m-%d"), datetime.now().strftime("%H:%M:%S"), "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "", "read_file, write_file, run_command", "scripts/iot_sec_day32.json, src/lib/data/lessonVisuals/iot_sec/day-32.json", "Course 19 Day 32: Clock Glitch Injection: Over-Clocking Pulses, Setup-Time Violations & Branch Flip Analysis", "Present-Career-os", ""],
    ["TASK-1756", datetime.now().strftime("%Y-%m-%d"), datetime.now().strftime("%H:%M:%S"), "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "", "read_file, write_file, run_command", "scripts/iot_sec_day33.json, src/lib/data/lessonVisuals/iot_sec/day-33.json", "Course 19 Day 33: Electromagnetic Fault Injection (EMFI) & Laser Fault Injection (LFI): Localized Silicon Perturbation", "Present-Career-os", ""],
    ["TASK-1757", datetime.now().strftime("%Y-%m-%d"), datetime.now().strftime("%H:%M:%S"), "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "", "read_file, write_file, run_command", "scripts/iot_sec_day34.json, src/lib/data/lessonVisuals/iot_sec/day-34.json", "Course 19 Day 34: Hardware Glitch Detection Circuits: Dual-Rail Logic, Parity-Checked Pipelines & Voltage Monitors", "Present-Career-os", ""],
    ["TASK-1758", datetime.now().strftime("%Y-%m-%d"), datetime.now().strftime("%H:%M:%S"), "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "", "read_file, write_file, run_command", "scripts/iot_sec_day35.json, src/lib/data/lessonVisuals/iot_sec/day-35.json", "Course 19 Day 35 Milestone 7: GlitchShield Silicon Fault-Injection Resilience Engine & Hardware Glitch Emulation Bench", "Present-Career-os", ""]
]

with open(tasks_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for nt in new_tasks:
        writer.writerow(nt)

print("Appended TASK-1754..1758 to agent_tasks.csv")

# 2. Append AGENT-482 to multi_agent_control.csv
agent_row = [
    "AGENT-482", "Antigravity", "codex/interview-tab-reliability", "Present-Career-os", "TASK-1754..1758", "01ddddb9", "In_Progress", "In_Progress", "Course 19 (iot_sec) Month 2 Block 7 (Days 31-35): Voltage/Clock Glitching, EMFI, Laser Fault Injection & Milestone 7 GlitchShield Engine", datetime.now().strftime("%Y-%m-%d %H:%M:%S"), ""
]

with open(control_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(agent_row)

print("Registered AGENT-482 in multi_agent_control.csv")
