# -*- coding: utf-8 -*-
"""
Register Course 7 Month 2 Batch 5: Block 11 (Days 51-55: TASK-1429..1433).
"""

import csv
import datetime

now_date = datetime.datetime.now().strftime("%Y-%m-%d")
now_time = datetime.datetime.now().strftime("%H:%M:%S")

tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
control_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

new_tasks = [
    [
        "TASK-1429", now_date, now_time, "IN_PROGRESS", "Block 11", "Antigravity",
        "Course 7 blockchain Day 51: Zero-Knowledge Proofs: ZK-SNARKs vs ZK-STARKs & Arithmetic Circuits",
        "write_to_file; run_command", "src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-51.json",
        "IN_PROGRESS", "c7b35c15-f056-4dc6-888b-f56621a809c1", ""
    ],
    [
        "TASK-1430", now_date, now_time, "PENDING", "Block 11", "Antigravity",
        "Course 7 blockchain Day 52: Circom & SnarkJS: Writing Arithmetic Circuits & Generating Groth16 Proofs",
        "write_to_file; run_command", "src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-52.json",
        "PENDING", "c7b35c15-f056-4dc6-888b-f56621a809c1", ""
    ],
    [
        "TASK-1431", now_date, now_time, "PENDING", "Block 11", "Antigravity",
        "Course 7 blockchain Day 53: Tornado Cash Architecture: Merkle Trees Nullifiers & Private Transactions",
        "write_to_file; run_command", "src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-53.json",
        "PENDING", "c7b35c15-f056-4dc6-888b-f56621a809c1", ""
    ],
    [
        "TASK-1432", now_date, now_time, "PENDING", "Block 11", "Antigravity",
        "Course 7 blockchain Day 54: Account Abstraction (ERC-4337): UserOperations Bundlers & Paymasters",
        "write_to_file; run_command", "src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-54.json",
        "PENDING", "c7b35c15-f056-4dc6-888b-f56621a809c1", ""
    ],
    [
        "TASK-1433", now_date, now_time, "PENDING", "Block 11", "Antigravity",
        "Course 7 blockchain Day 55: 🏆 Milestone 10: Private ZK-Mixer & ERC-4337 Gasless Smart Wallet Protocol",
        "write_to_file; run_command", "src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-55.json",
        "PENDING", "c7b35c15-f056-4dc6-888b-f56621a809c1", ""
    ]
]

with open(tasks_file, mode="a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for t in new_tasks:
        writer.writerow(t)
print("Registered TASK-1429..1433 in agent_tasks.csv")

# Update multi_agent_control.csv
with open(control_file, mode="r", encoding="utf-8") as f:
    c_rows = list(csv.reader(f))

for r in c_rows:
    if len(r) > 0 and r[0] == "AGENT-415":
        r[1] = "In_Progress"
        r[2] = "TASK-1419..1423"
        r[3] = "In_Progress"
        r[4] = "TASK-1429..1433 (Blockchain Days 51-55: Block 11 & Milestone 10)"
        r[5] = f"Completed TASK-1419..1423 on {now_date} {now_time}"
        r[6] = f"{now_date} {now_time}"
        r[7] = "Month 2 Pioneer Batch 5: Block 11 -- Days 51-55 ZK Proofs, Circom/SnarkJS, Tornado Cash Merkle Nullifiers, ERC-4337 Account Abstraction & Milestone 10: TASK-1429..1433 in progress"

with open(control_file, mode="w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(c_rows)
print("Updated AGENT-415 in multi_agent_control.csv")
