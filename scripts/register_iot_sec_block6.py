import os

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(memory_dir, "agent_tasks.csv")

b6_tasks = [
    ("TASK-1749", "Course 19 Day 26: Defense-in-Depth Layering & Microcontroller Network Hardening: Port & Protocol Lockdown"),
    ("TASK-1750", "Course 19 Day 27: Cryptographic Key Lifecycle Management & Emergency Zeroization: PUF Destruction & Flash Erase"),
    ("TASK-1751", "Course 19 Day 28: Secure Storage of Ephemeral Tokens & Session State: Encrypted NVS & AEAD ChaCha20-Poly1305"),
    ("TASK-1752", "Course 19 Day 29: Principal Embedded Security Architect Review: Threat Modeling, STRIDE & FIPS 140-3 Compliance"),
    ("TASK-1753", "Course 19 Day 30 Milestone 6: End-to-End Autonomous Industrial IoT Security Enclave & Lifecycle Architecture")
]

with open(agent_tasks_path, "a", encoding="utf-8") as f:
    for tid, desc in b6_tasks:
        day_num = int(tid.split("-")[1]) - 1749 + 26
        f.write(f'{tid},2026-10-20,21:15:00,IN_PROGRESS,IN_PROGRESS,Antigravity,PENDING,"read_file, write_file, run_command","scripts/iot_sec_day{day_num}.json, src/lib/data/lessonVisuals/iot_sec/day-{day_num}.json","{desc}",Present-Career-os,\n')

print("Registered TASK-1749..1753 in agent_tasks.csv successfully!")
