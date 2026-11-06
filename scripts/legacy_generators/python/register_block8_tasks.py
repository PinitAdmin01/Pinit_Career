import csv
import datetime

now = datetime.datetime.now()
date_str = now.strftime("%Y-%m-%d")
time_str = now.strftime("%H:%M:%S")

# 1. Append tasks to agent_tasks.csv
tasks_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"

new_tasks = [
    [
        "TASK-1759", date_str, time_str, "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day36.json, src/lib/data/lessonVisuals/iot_sec/day-36.json",
        "Course 19 Day 36: Side-Channel Analysis Fundamentals: Current Shunt Resistors, Power Traces & Correlation Power Analysis (CPA)",
        "Present-Career-os", ""
    ],
    [
        "TASK-1760", date_str, time_str, "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day37.json, src/lib/data/lessonVisuals/iot_sec/day-37.json",
        "Course 19 Day 37: Hardware Cryptographic Masking: First-Order Boolean Masking, Masked S-Boxes & Multiplicative Blinding",
        "Present-Career-os", ""
    ],
    [
        "TASK-1761", date_str, time_str, "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day38.json, src/lib/data/lessonVisuals/iot_sec/day-38.json",
        "Course 19 Day 38: Electromagnetic Side-Channel Analysis (EMA): Near-Field Probes, Spatial Leakage Mapping & Differential EM (DEMA)",
        "Present-Career-os", ""
    ],
    [
        "TASK-1762", date_str, time_str, "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day39.json, src/lib/data/lessonVisuals/iot_sec/day-39.json",
        "Course 19 Day 39: Silicon Side-Channel Countermeasures: Random Clock Jitter Insertion, Operation Shuffling & Dummy Cycles",
        "Present-Career-os", ""
    ],
    [
        "TASK-1763", date_str, time_str, "IN_PROGRESS", "IN_PROGRESS", "Antigravity", "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day40.json, src/lib/data/lessonVisuals/iot_sec/day-40.json",
        "Course 19 Day 40 Milestone 8: ApexSideChannelResilience Sovereign DPA/CPA Resistant Crypto Co-Processor & TVLA Verification Engine",
        "Present-Career-os", ""
    ]
]

with open(tasks_csv_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(new_tasks)

print("Appended TASK-1759..1763 to agent_tasks.csv")

# 2. Append/Update AGENT-483 in multi_agent_control.csv
control_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
agent_row = [
    "AGENT-483", "Antigravity", "codex/interview-tab-reliability", "Present-Career-os",
    "TASK-1759..1763", "In_Progress", "In_Progress",
    "Course 19 (iot_sec) Month 2 Block 8 (Days 36-40): Side-Channel Analysis (DPA/CPA), Masking, EM Probes & Milestone 8 TVLA Engine",
    f"{date_str} {time_str}", ""
]

with open(control_csv_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(agent_row)

print("Registered AGENT-483 in multi_agent_control.csv")
