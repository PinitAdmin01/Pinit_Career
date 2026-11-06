# scripts/register_iot_sec_block3.py
import csv, datetime

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
now_date = datetime.datetime.now().strftime("%Y-%m-%d")
now_time = datetime.datetime.now().strftime("%H:%M:%S")

# 1. Register tasks in agent_tasks.csv
tasks_file = f"{memory_dir}\\agent_tasks.csv"
new_tasks = [
    ["TASK-1729", now_date, now_time, "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "PENDING", "read_file, write_file, run_command", "scripts/iot_sec_day11.json, src/lib/data/lessonVisuals/iot_sec/day-11.json", "Course 19 Day 11: Cryptographic Accelerators: Hardware AES, SHA-256, and TRNG Silicon Drivers", "Present-Career-os", ""],
    ["TASK-1730", now_date, now_time, "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "PENDING", "read_file, write_file, run_command", "scripts/iot_sec_day12.json, src/lib/data/lessonVisuals/iot_sec/day-12.json", "Course 19 Day 12: ARM TrustZone for Cortex-M: Secure vs Non-Secure World Partitioning & SAU/IDAU Configuration", "Present-Career-os", ""],
    ["TASK-1731", now_date, now_time, "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "PENDING", "read_file, write_file, run_command", "scripts/iot_sec_day13.json, src/lib/data/lessonVisuals/iot_sec/day-13.json", "Course 19 Day 13: Memory Protection Units (MPU): Stack Overflow Guarding & Unprivileged User Mode Isolation", "Present-Career-os", ""],
    ["TASK-1732", now_date, now_time, "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "PENDING", "read_file, write_file, run_command", "scripts/iot_sec_day14.json, src/lib/data/lessonVisuals/iot_sec/day-14.json", "Course 19 Day 14: Secure Inter-Process Communication (IPC): Non-Secure Callable (NSC) Gateways & SG Veneers", "Present-Career-os", ""],
    ["TASK-1733", now_date, now_time, "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "PENDING", "read_file, write_file, run_command", "scripts/iot_sec_day15.json, src/lib/data/lessonVisuals/iot_sec/day-15.json", "Course 19 Day 15 Milestone 3: Cortex-M TrustZone Secure Firmware Enclave & MPU Partitioning Engine", "Present-Career-os", ""]
]

with open(tasks_file, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for t in new_tasks:
        writer.writerow(t)

print("Registered TASK-1729..1733 in agent_tasks.csv")

# 2. Register AGENT-477 in multi_agent_control.csv
control_file = f"{memory_dir}\\multi_agent_control.csv"
agent_row = [
    "AGENT-477", "Antigravity", "codex/interview-tab-reliability", "Present-Career-os",
    "TASK-1729..1733", "In_Progress", "In_Progress",
    "Course 19 (iot_sec) Month 1 Block 3 (Days 11-15): Crypto Accelerators, ARM TrustZone Cortex-M, MPU Isolation, NSC Gateways & Milestone 3 Secure Enclave Engine",
    f"{now_date} {now_time}", "", "", ""
]

with open(control_file, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(agent_row)

print("Registered AGENT-477 in multi_agent_control.csv")
