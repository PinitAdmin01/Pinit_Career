import csv
import datetime

# 1. Update PROJECT_MEMORY.md
memory_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(memory_path, 'r', encoding='utf-8') as f:
    memory_content = f.read()

new_entry = """## [2026-10-19 01:40:00] Milestone Update: Course 14 (IoT, Firmware & Embedded Systems) Month 2 Block 8 (Days 36–40: MQTT, CoAP, Modbus RTU/TCP, NanoPB & Milestone 7 Bridge) High-Quality Enrichment COMPLETE & CERTIFIED

- **Agent**: AGENT-451 (Antigravity IDE & Multi-Agent Architecture)
- **Tasks**: TASK-1594..1598 (COMPLETED & Verified in agent_tasks.csv)
- **Branch**: codex/interview-tab-reliability (Commit: `8612429a`)
- **Course Status**: Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded / prefix: `iot_emb`)
  - **Month 1 (Days 1–30: Complete Silicon, RTOS, DMA & Avionics Synthesis)**: 100% Complete
  - **Month 2 Block 7 (Days 31–35: Wireless IoT Networks, BLE, Wi-Fi, LoRaWAN, Thread & Milestone 6 Multi-Radio Gateway)**: 100% Complete
  - **Month 2 Block 8 (Days 36–40: Industrial IoT Protocols: MQTT, CoAP, Modbus RTU/TCP, NanoPB & Milestone 7 Bridge)**: **100% ENRICHED, CERTIFIED & VERIFIED**
    - **Day 36 (TASK-1594)**: MQTT Protocol Internals: Publish/Subscribe, QoS 0/1/2 Guarantees & Last Will and Testament (3,174 words, 26.4 mins spoken, declared minutes: 38)
    - **Day 37 (TASK-1595)**: Constrained Application Protocol (CoAP): UDP Transport, Confirmable Messages & The Observe Pattern (3,116 words, 26.0 mins spoken, declared minutes: 38)
    - **Day 38 (TASK-1596)**: Modbus RTU & Modbus TCP: Master-Slave Polling, Holding Registers & RS-485 Differential Transceivers (3,284 words, 27.4 mins spoken, declared minutes: 38)
    - **Day 39 (TASK-1597)**: Compact Binary Serialization: Protocol Buffers (NanoPB), CBOR (RFC 8949) & MessagePack (3,020 words, 25.2 mins spoken, declared minutes: 39)
    - **Day 40 (TASK-1598)**: 🏆 **Milestone 7: Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge (Dual-Task FreeRTOS Decoupling, Defensive CRC-16 Ingestion, NanoPB Varint/ZigZag Binary Packing, TLS MQTT QoS 1 Handshake & Flash Store-and-Forward Failover)** (3,106 words, 25.9 mins spoken, declared minutes: 40)
  - **Course Progress**: **40 of 60 Days Complete (66.67%)**
- **Quality Mandates & Pedagogic Invariants Enforced**:
  - **Avatar Spoken Audio**: Strictly >= 24 minutes per day (every single part >= 580 words, 25.2 to 27.4 mins spoken audio per class).
  - **Class Declared Duration**: Strictly within 35-40 min range (Days 36-38: 38 mins, Day 39: 39 mins, Day 40: 40 mins).
  - **Pedagogic Invariants**: Exactly 5 parts per lesson, 4 options per Socratic check with `answer: 0`, substantial explanation, runnable C++ code with concrete terminal output and line-by-line `codeNotes`, and `tryIt` challenges.
  - **Gate v2 Visual Contracts**: Matching on-disk visual JSON files (`day-36.json` through `day-40.json`) with full envelope, synchronized 4-step markers (`intro`, `say1`, `example`, `tryIt`), tappable interactive labels, and raw SHA-256 `codeHash` validation against `part.code`.
  - **Verification**: `tests/iot_emb_days36_40_expansion.test.ts` (4/4 passing), `tests/iot_hardware_visuals_verification.test.ts` (5/5 passing, including Block 8), all 29 iot tests passing 100%, and `npx tsc --noEmit` clean (0 errors).

---

"""

with open(memory_path, 'w', encoding='utf-8') as f:
    f.write(new_entry + memory_content)

print("Prepend to PROJECT_MEMORY.md complete!")

# 2. Update agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
rows = []
fieldnames = []
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for r in reader:
        if r.get('Task_ID') in ['TASK-1594', 'TASK-1595', 'TASK-1596', 'TASK-1597', 'TASK-1598']:
            r['Status'] = 'COMPLETED'
            r['Dark_Gracity_Ref'] = 'COMPLETED'
            r['Agent_Resolution'] = 'Enriched with 20+ min spoken avatar audio, 38-40 min declared class duration, Gate v2 visuals, and 100% test verification (Commit 8612429a).'
        rows.append(r)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print("Updated agent_tasks.csv with COMPLETED for TASK-1594..1598!")

# 3. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_rows = []
with open(mac_path, 'r', encoding='utf-8') as f:
    mac_rows = list(csv.reader(f))

for r in mac_rows:
    if len(r) > 4 and r[0] == 'AGENT-451':
        r[4] = 'Completed'
        if len(r) > 6:
            r[6] = '8612429a'
        if len(r) > 7:
            r[7] = 'Course 14 (iot_emb) Month 2 Block 8: Days 36-40 Enriched with 20+ min spoken audio, 38-40 min duration, verified & pushed (8612429a). 40/60 Days Complete.'

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print("Updated multi_agent_control.csv for AGENT-451!")
