#!/usr/bin/env python3
"""
register_iot_sec_block4.py
Registers Course 19 Month 1 Block 4 (Days 16-20 & Milestone 4) in central memory.
"""
import os, datetime

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
multi_agent_control_path = os.path.join(memory_dir, "multi_agent_control.csv")

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

new_tasks = [
    ("TASK-1739", "Course 19 Day 16: Public Key Infrastructure (PKI) for IoT & IEEE 802.1AR Secure Device Identity"),
    ("TASK-1740", "Course 19 Day 17: ASN.1 DER Encoding & Tiny X.509 Certificate Parsers: Memory-Constrained Parsing"),
    ("TASK-1741", "Course 19 Day 18: Certificate Revocation on Edge Devices: CRL, OCSP & Offline Memory Budgets"),
    ("TASK-1742", "Course 19 Day 19: Hardware-Enforced TLS 1.3 Client Handshake on MCU: wolfSSL/mbedTLS Optimization"),
    ("TASK-1743", "Course 19 Day 20 Milestone 4: IEEE 802.1AR Device Identity & Bare-Metal TLS 1.3 Handshake Engine")
]

if os.path.exists(agent_tasks_path):
    with open(agent_tasks_path, "a", encoding="utf-8") as f:
        for tid, desc in new_tasks:
            day_num = tid.split("-")[1]
            day_idx = int(day_num) - 1739 + 16
            f.write(f'{tid},2026-10-20,19:45:00,IN_PROGRESS,IN_PROGRESS,Antigravity,PENDING,"read_file, write_file, run_command","scripts/iot_sec_day{day_idx}.json, src/lib/data/lessonVisuals/iot_sec/day-{day_idx}.json","{desc}",Present-Career-os,\n')
    print("Registered TASK-1739..1743 in agent_tasks.csv.")

if os.path.exists(multi_agent_control_path):
    with open(multi_agent_control_path, "a", encoding="utf-8") as f:
        f.write(f'AGENT-479,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1739..1743,In_Progress,In_Progress,"Course 19 (iot_sec) Month 1 Block 4 (Days 16-20): IEEE 802.1AR PKI, Zero-Heap ASN.1 DER, OCSP Stapling, MCU TLS 1.3 & Milestone 4 Handshake Engine",2026-10-20 19:45:00,,,\n')
    print("Registered AGENT-479 in multi_agent_control.csv.")
