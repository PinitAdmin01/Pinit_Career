import csv
import datetime

tasks_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
control_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

new_tasks = [
    [
        "TASK-1764",
        "Course 19",
        "iot_sec",
        "Day 41: Active Silicon Meshes & Serpentine Enclosure Tamper Sensors",
        "IN_PROGRESS",
        "Antigravity",
        "High"
    ],
    [
        "TASK-1765",
        "Course 19",
        "iot_sec",
        "Day 42: Environmental Physical Attack Detection: Cryo/Over-Temp, Decapsulation & Microprobing",
        "PENDING",
        "Antigravity",
        "High"
    ],
    [
        "TASK-1766",
        "Course 19",
        "iot_sec",
        "Day 43: Instantaneous Hardware Zeroization & Battery-Backed SRAM Key Erasure",
        "PENDING",
        "Antigravity",
        "High"
    ],
    [
        "TASK-1767",
        "Course 19",
        "iot_sec",
        "Day 44: Debug Interface Hardening: Authenticated JTAG/SWD & Irreversible eFuse Lockout",
        "PENDING",
        "Antigravity",
        "High"
    ],
    [
        "TASK-1768",
        "Course 19",
        "iot_sec",
        "Day 45: Milestone 9: TamperShield Sovereign Anti-Tamper & Physical Zeroization Engine",
        "PENDING",
        "Antigravity",
        "High"
    ],
    [
        "TASK-1764",
        "2026-10-20",
        datetime.datetime.now().strftime("%H:%M:%S"),
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity",
        "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day41.json, src/lib/data/lessonVisuals/iot_sec/day-41.json",
        "Course 19 Day 41: Active Silicon Meshes & Physical Enclosure Tamper Sensors",
        "Present-Career-os",
        ""
    ],
    [
        "TASK-1765",
        "2026-10-20",
        datetime.datetime.now().strftime("%H:%M:%S"),
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity",
        "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day42.json, src/lib/data/lessonVisuals/iot_sec/day-42.json",
        "Course 19 Day 42: Environmental Attack Detection: Thermal, Decapsulation Photodiodes & Microprobing Shields",
        "Present-Career-os",
        ""
    ],
    [
        "TASK-1766",
        "2026-10-20",
        datetime.datetime.now().strftime("%H:%M:%S"),
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity",
        "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day43.json, src/lib/data/lessonVisuals/iot_sec/day-43.json",
        "Course 19 Day 43: Instantaneous Hardware Zeroization & BB-SRAM Key Erasure",
        "Present-Career-os",
        ""
    ],
    [
        "TASK-1767",
        "2026-10-20",
        datetime.datetime.now().strftime("%H:%M:%S"),
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity",
        "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day44.json, src/lib/data/lessonVisuals/iot_sec/day-44.json",
        "Course 19 Day 44: Debug Port Hardening: Authenticated JTAG/SWD, Challenge-Response & eFuse Lockout",
        "Present-Career-os",
        ""
    ],
    [
        "TASK-1768",
        "2026-10-20",
        datetime.datetime.now().strftime("%H:%M:%S"),
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity",
        "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day45.json, src/lib/data/lessonVisuals/iot_sec/day-45.json",
        "Course 19 Day 45: Milestone 9: TamperShield Sovereign Anti-Tamper & Physical Zeroization Engine",
        "Present-Career-os",
        ""
    ]
]

with open(tasks_csv_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(new_tasks)
print("Registered TASK-1764..1768 in agent_tasks.csv")

new_control = [
    [
        "AGENT-484",
        "codex/interview-tab-reliability",
        "In_Progress",
        "Present-Career-os",
        "Course 19 Month 2 Block 9 Days 41-45 & Milestone 9",
        "Antigravity"
    ],
    [
        "AGENT-484",
        "Antigravity",
        "codex/interview-tab-reliability",
        "Present-Career-os",
        "TASK-1764..1768",
        "In_Progress",
        "In_Progress",
        "Course 19 (iot_sec) Month 2 Block 9 (Days 41-45): Active Meshes, Environmental Sensors, Zeroization & Milestone 9 TamperShield Engine",
        now_str,
        ""
    ]
]

with open(control_csv_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(new_control)
print("Registered AGENT-484 in multi_agent_control.csv")
