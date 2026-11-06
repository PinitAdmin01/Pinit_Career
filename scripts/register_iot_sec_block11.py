import csv
import datetime

tasks_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
control_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

new_tasks = [
    [
        "TASK-1792",
        "Course 19",
        "iot_sec",
        "Day 51: Post-Quantum Cryptography (PQC) & Module Lattice Foundations (FIPS 203/204)",
        "IN_PROGRESS",
        "Antigravity",
        "High"
    ],
    [
        "TASK-1793",
        "Course 19",
        "iot_sec",
        "Day 52: Number Theoretic Transform (NTT) Hardware Acceleration & Modular Arithmetic",
        "PENDING",
        "Antigravity",
        "High"
    ],
    [
        "TASK-1794",
        "Course 19",
        "iot_sec",
        "Day 53: Post-Quantum Physical Side-Channel Hardening & High-Order Masking",
        "PENDING",
        "Antigravity",
        "High"
    ],
    [
        "TASK-1795",
        "Course 19",
        "iot_sec",
        "Day 54: Hybrid Classical + PQC Secure Boot & Dual-Signature X.509 Verification",
        "PENDING",
        "Antigravity",
        "High"
    ],
    [
        "TASK-1796",
        "Course 19",
        "iot_sec",
        "Day 55: Milestone 11: QuantumShield Dual-Engine Hybrid Root of Trust Platform",
        "PENDING",
        "Antigravity",
        "High"
    ],
    [
        "TASK-1792",
        "2026-10-21",
        datetime.datetime.now().strftime("%H:%M:%S"),
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity",
        "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day51.json, src/lib/data/lessonVisuals/iot_sec/day-51.json",
        "Course 19 Day 51: Post-Quantum Cryptography & Module Lattice Foundations (FIPS 203/204)",
        "Present-Career-os",
        ""
    ],
    [
        "TASK-1793",
        "2026-10-21",
        datetime.datetime.now().strftime("%H:%M:%S"),
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity",
        "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day52.json, src/lib/data/lessonVisuals/iot_sec/day-52.json",
        "Course 19 Day 52: Number Theoretic Transform (NTT) Hardware Acceleration",
        "Present-Career-os",
        ""
    ],
    [
        "TASK-1794",
        "2026-10-21",
        datetime.datetime.now().strftime("%H:%M:%S"),
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity",
        "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day53.json, src/lib/data/lessonVisuals/iot_sec/day-53.json",
        "Course 19 Day 53: Post-Quantum Physical Side-Channel Hardening & High-Order Masking",
        "Present-Career-os",
        ""
    ],
    [
        "TASK-1795",
        "2026-10-21",
        datetime.datetime.now().strftime("%H:%M:%S"),
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity",
        "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day54.json, src/lib/data/lessonVisuals/iot_sec/day-54.json",
        "Course 19 Day 54: Hybrid Classical + PQC Secure Boot & Dual-Signature X.509 Verification",
        "Present-Career-os",
        ""
    ],
    [
        "TASK-1796",
        "2026-10-21",
        datetime.datetime.now().strftime("%H:%M:%S"),
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity",
        "",
        "read_file, write_file, run_command",
        "scripts/iot_sec_day55.json, src/lib/data/lessonVisuals/iot_sec/day-55.json",
        "Course 19 Day 55: Milestone 11: QuantumShield Dual-Engine Hybrid Root of Trust Platform",
        "Present-Career-os",
        ""
    ]
]

with open(tasks_csv_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(new_tasks)
print("Registered TASK-1792..1796 in agent_tasks.csv")

new_control = [
    [
        "AGENT-488",
        "Antigravity",
        "codex/interview-tab-reliability",
        "Present-Career-os",
        "TASK-1792..1796",
        "In_Progress",
        "In_Progress",
        "Course 19 (iot_sec) Month 2 Block 11 (Days 51-55): Post-Quantum Cryptography (FIPS 203/204), NTT Acceleration, Side-Channel Masking & Milestone 11 QuantumShield Platform",
        now_str,
        ""
    ]
]

with open(control_csv_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(new_control)
print("Registered AGENT-488 in multi_agent_control.csv")
