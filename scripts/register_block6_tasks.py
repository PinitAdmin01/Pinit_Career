import csv

control_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
tasks_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"

# 1. Update multi_agent_control.csv
c_rows = []
with open(control_csv_path, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] == "AGENT-480":
            row[4] = "TASK-1744..1748"
            row[5] = "Completed"
            row[6] = "Completed"
            row[9] = "b1f7b595"
            row[10] = "2026-10-20 20:58:00"
        c_rows.append(row)

# Append AGENT-481
c_rows.append([
    "AGENT-481", "Antigravity", "codex/interview-tab-reliability", "Present-Career-os",
    "TASK-1749..1753", "In_Progress", "In_Progress",
    "Course 19 (iot_sec) Month 1 Block 6 (Days 26-30): Defense-in-Depth, Key Lifecycle, Encrypted NVS, FIPS 140-3 & Milestone 6 Grand Capstone",
    "2026-10-20 21:15:00", "b1f7b595", "", ""
])

with open(control_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(c_rows)
print("Updated multi_agent_control.csv with AGENT-481")

# 2. Append TASK-1749..1753 to agent_tasks.csv
t_rows = []
with open(tasks_csv_path, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        t_rows.append(row)

new_tasks = [
    ["TASK-1749", "2026-10-20", "21:15:00", "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "IN_PROGRESS", "read_file, write_file, run_command", "scripts/iot_sec_day26.json, src/lib/data/lessonVisuals/iot_sec/day-26.json", "Course 19 Day 26: Defense-in-Depth Layering & Microcontroller Network Hardening: Port & Protocol Lockdown", "Present-Career-os", ""],
    ["TASK-1750", "2026-10-20", "21:15:00", "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "IN_PROGRESS", "read_file, write_file, run_command", "scripts/iot_sec_day27.json, src/lib/data/lessonVisuals/iot_sec/day-27.json", "Course 19 Day 27: Cryptographic Key Lifecycle Management & Emergency Zeroization", "Present-Career-os", ""],
    ["TASK-1751", "2026-10-20", "21:15:00", "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "IN_PROGRESS", "read_file, write_file, run_command", "scripts/iot_sec_day28.json, src/lib/data/lessonVisuals/iot_sec/day-28.json", "Course 19 Day 28: Secure Storage of Ephemeral Tokens & Session State: Encrypted NVS & AEAD", "Present-Career-os", ""],
    ["TASK-1752", "2026-10-20", "21:15:00", "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "IN_PROGRESS", "read_file, write_file, run_command", "scripts/iot_sec_day29.json, src/lib/data/lessonVisuals/iot_sec/day-29.json", "Course 19 Day 29: Principal Embedded Security Architect Review: Threat Modeling & FIPS 140-3 Compliance", "Present-Career-os", ""],
    ["TASK-1753", "2026-10-20", "21:15:00", "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "IN_PROGRESS", "read_file, write_file, run_command", "scripts/iot_sec_day30.json, src/lib/data/lessonVisuals/iot_sec/day-30.json", "Course 19 Day 30 ⭐ Milestone 6: Capstone 1: ApexSentry Industrial Secure Edge Sentinel & Cryptographic Hardware Root of Trust Capstone Viva Gate", "Present-Career-os", ""]
]

t_rows.extend(new_tasks)

with open(tasks_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(t_rows)
print("Updated agent_tasks.csv with TASK-1749..1753")
