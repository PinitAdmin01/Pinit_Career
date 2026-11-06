#!/usr/bin/env python3
"""
register_iot_sec_block5.py
Registers Course 19 Month 1 Block 5 (Days 21-25 & Milestone 5) in central memory.
"""
import os, datetime

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
multi_agent_control_path = os.path.join(memory_dir, "multi_agent_control.csv")

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

new_tasks = [
    ("TASK-1744", "Course 19 Day 21: Secure Firmware Over-The-Air (FOTA) Architecture: A/B Dual-Bank Partitioning & Fallback Recovery"),
    ("TASK-1745", "Course 19 Day 22: Cryptographic Firmware Signing & Verification: Ed25519, ECDSA P-256 & SHA-256 Digest Chains"),
    ("TASK-1746", "Course 19 Day 23: Hardware-Enforced Anti-Rollback Protection: Monotonic eFuse Counters & Version Fencing"),
    ("TASK-1747", "Course 19 Day 24: Remote Device Attestation & DICE Architecture: Device Identifier Composition Engine, CDI & Alias Keys"),
    ("TASK-1748", "Course 19 Day 25 ⭐ Milestone 5: Resilient FOTA Ingestion, Anti-Rollback Enforcement & Remote Device Attestation Engine")
]

if os.path.exists(agent_tasks_path):
    with open(agent_tasks_path, "a", encoding="utf-8") as f:
        for tid, desc in new_tasks:
            day_num = tid.split("-")[1]
            day_idx = int(day_num) - 1744 + 21
            f.write(f'{tid},2026-10-20,20:30:00,IN_PROGRESS,IN_PROGRESS,Antigravity,PENDING,"read_file, write_file, run_command","scripts/iot_sec_day{day_idx}.json, src/lib/data/lessonVisuals/iot_sec/day-{day_idx}.json","{desc}",Present-Career-os,\n')
    print("Registered TASK-1744..1748 in agent_tasks.csv.")

if os.path.exists(multi_agent_control_path):
    with open(multi_agent_control_path, "a", encoding="utf-8") as f:
        f.write(f'AGENT-480,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1744..1748,In_Progress,In_Progress,"Course 19 (iot_sec) Month 1 Block 5 (Days 21-25): Dual-Bank FOTA, Ed25519 Signing, eFuse Anti-Rollback, TCG DICE Attestation & Milestone 5 Engine",2026-10-20 20:30:00,,,\n')
    print("Registered AGENT-480 in multi_agent_control.csv.")
