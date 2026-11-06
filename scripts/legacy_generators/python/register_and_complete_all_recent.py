import os, datetime

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
multi_agent_control_path = os.path.join(memory_dir, "multi_agent_control.csv")

# Let's verify existing task IDs
with open(agent_tasks_path, "r", encoding="utf-8") as f:
    text = f.read()

tasks_to_add = []

# Course 03 Month 2 Block 12 (Days 56-60 & Milestone 11)
c03_tasks = [
    ("TASK-1734", "Course 03 Block 12 Day 56: Real-Time Bidirectional Event Mesh: WebSocket Subscriptions, SSE Backpressure & Heartbeats"),
    ("TASK-1735", "Course 03 Block 12 Day 57: High-Performance Caching & Invalidation Topologies: Multi-Tier Cache-Aside, Write-Through & Stampede Defense"),
    ("TASK-1736", "Course 03 Block 12 Day 58: Distributed Rate Limiting & Sliding Windows: Token Bucket, Leaky Bucket & Memory-Bounded Counters"),
    ("TASK-1737", "Course 03 Block 12 Day 59: High-Availability Failover, Heartbeating & Health Gating: Circuit Breaker State Machine & Load Balancing"),
    ("TASK-1738", "Course 03 Block 12 Day 60 Milestone 11: Enterprise Production Gateway: Reactive Mesh, Multi-Tier Caching, Token Bucket & Failover")
]

for tid, desc in c03_tasks:
    if tid not in text:
        day_idx = int(tid.split("-")[1]) - 1734 + 56
        tasks_to_add.append(f'{tid},2026-10-20,19:30:00,COMPLETED,COMPLETED,Antigravity,COMPLETED,"read_file, write_file, run_command","scripts/node_day{day_idx}.json, src/lib/data/lessonVisuals/node-web/day-{day_idx}.json","{desc}",Present-Career-os,\n')

# Course 19 Month 1 Block 4 (Days 16-20 & Milestone 4)
c19_b4_tasks = [
    ("TASK-1739", "Course 19 Day 16: Public Key Infrastructure (PKI) for IoT & IEEE 802.1AR Secure Device Identity"),
    ("TASK-1740", "Course 19 Day 17: ASN.1 DER Encoding & Tiny X.509 Certificate Parsers: Memory-Constrained Parsing"),
    ("TASK-1741", "Course 19 Day 18: Certificate Revocation on Edge Devices: CRL, OCSP & Offline Memory Budgets"),
    ("TASK-1742", "Course 19 Day 19: Hardware-Enforced TLS 1.3 Client Handshake on MCU: wolfSSL/mbedTLS Optimization"),
    ("TASK-1743", "Course 19 Day 20 Milestone 4: IEEE 802.1AR Device Identity & Bare-Metal TLS 1.3 Handshake Engine")
]

for tid, desc in c19_b4_tasks:
    if tid not in text:
        day_idx = int(tid.split("-")[1]) - 1739 + 16
        tasks_to_add.append(f'{tid},2026-10-20,20:00:00,COMPLETED,COMPLETED,Antigravity,COMPLETED,"read_file, write_file, run_command","scripts/iot_sec_day{day_idx}.json, src/lib/data/lessonVisuals/iot_sec/day-{day_idx}.json","{desc}",Present-Career-os,\n')

# Course 19 Month 1 Block 5 (Days 21-25 & Milestone 5)
c19_b5_tasks = [
    ("TASK-1744", "Course 19 Day 21: Secure Firmware Over-The-Air (FOTA) Architecture: A/B Dual-Bank Partitioning & Fallback Recovery"),
    ("TASK-1745", "Course 19 Day 22: Cryptographic Firmware Signing & Verification: Ed25519, ECDSA P-256 & SHA-256 Digest Chains"),
    ("TASK-1746", "Course 19 Day 23: Hardware-Enforced Anti-Rollback Protection: Monotonic eFuse Counters & Version Fencing"),
    ("TASK-1747", "Course 19 Day 24: Remote Device Attestation & DICE Architecture: Device Identifier Composition Engine, CDI & Alias Keys"),
    ("TASK-1748", "Course 19 Day 25 Milestone 5: Resilient FOTA Ingestion, Anti-Rollback Enforcement & Remote Device Attestation Engine")
]

for tid, desc in c19_b5_tasks:
    if tid not in text:
        day_idx = int(tid.split("-")[1]) - 1744 + 21
        tasks_to_add.append(f'{tid},2026-10-20,20:30:00,COMPLETED,COMPLETED,Antigravity,COMPLETED,"read_file, write_file, run_command","scripts/iot_sec_day{day_idx}.json, src/lib/data/lessonVisuals/iot_sec/day-{day_idx}.json","{desc}",Present-Career-os,\n')

if tasks_to_add:
    with open(agent_tasks_path, "a", encoding="utf-8") as f:
        f.writelines(tasks_to_add)
    print(f"Appended {len(tasks_to_add)} completed tasks to agent_tasks.csv!")
else:
    print("All tasks already present in agent_tasks.csv.")
