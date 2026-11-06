import csv
import datetime

# 1. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
rows = []
for r in csv.reader(open(mac_path, 'r', encoding='utf-8')):
    if len(r) > 0 and r[0] == 'AGENT-451':
        r = ['AGENT-451', 'Antigravity', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1594..1598', 'Completed', 'a1030d22', 'Course 14 (iot_emb) Month 2 Block 8: Days 36-40 Complete, verified & pushed (a1030d22). 40/60 Days Complete.']
    rows.append(r)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print('Updated multi_agent_control.csv for AGENT-451!')

# 2. Update agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
task_rows = []
tasks_to_complete = {'TASK-1594', 'TASK-1595', 'TASK-1596', 'TASK-1597', 'TASK-1598'}
with open(tasks_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for r in reader:
        if r.get('Task_ID') in tasks_to_complete:
            r['Status'] = 'COMPLETED'
            r['Dark_Gracity_Ref'] = 'COMPLETED'
        task_rows.append(r)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(task_rows)
print('Updated agent_tasks.csv marking TASK-1594..1598 as COMPLETED!')

# 3. Prepend to PROJECT_MEMORY.md
milestone_entry = """## [2026-10-19 01:30:00] Milestone Update: Course 14 (IoT, Firmware & Embedded Systems) Month 2 Block 8 (Days 36–40: Industrial IoT Protocols: MQTT, CoAP, Modbus RTU/TCP, NanoPB & Milestone 7 Industrial Telemetry Bridge) 100% COMPLETE & CERTIFIED

- **Agent**: AGENT-451 (Antigravity IDE & Multi-Agent Architecture)
- **Tasks**: TASK-1594..1598 (Marked COMPLETED in agent_tasks.csv)
- **Branch**: codex/interview-tab-reliability (Commit: a1030d22)
- **Course Status**: Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded / prefix: iot_emb)
  - **Month 1 (Days 1–30: Complete Silicon, RTOS, DMA & Avionics Synthesis)**: 100% Complete
  - **Month 2 Block 7 (Days 31–35: BLE, Wi-Fi LwIP, LoRaWAN, Thread & Milestone 6 Multi-Radio Gateway)**: 100% Complete
  - **Month 2 Block 8 (Days 36–40: MQTT, CoAP, Modbus RTU/TCP, NanoPB & Milestone 7 Bridge)**: **100% COMPLETE & VERIFIED**
    - **Day 36 (TASK-1594)**: MQTT Protocol Internals: Publish/Subscribe, QoS 0/1/2 Guarantees & Last Will and Testament
    - **Day 37 (TASK-1595)**: Constrained Application Protocol (CoAP): UDP Transport, Confirmable Messages & The Observe Pattern
    - **Day 38 (TASK-1596)**: Modbus RTU & Modbus TCP: Master-Slave Polling, Holding Registers & RS-485 Differential Transceivers
    - **Day 39 (TASK-1597)**: Compact Binary Serialization: Protocol Buffers (NanoPB), CBOR (RFC 8949) & MessagePack
    - **Day 40 (TASK-1598)**: 🏆 **Milestone 7: Industrial IoT Modbus-to-MQTT Cloud Telemetry Bridge (Dual-Task FreeRTOS Decoupling, Defensive CRC-16 Ingestion, NanoPB Varint/ZigZag Binary Packing, TLS MQTT QoS 1 Handshake & Flash Store-and-Forward Failover)**
  - **Course Progress**: **40 of 60 Days Complete (66.67%)**
- **Invariants Enforced & Quality Assurance**:
  - Strict 5-part LongLesson structure per day with deep technical explanations, C++ industrial protocol implementations (`TopicMatcher`, `CoAPFixedHeader`, `RS485TransceiverSim`, `DefensiveModbusMaster`, `NanoPBSerializer`, `MqttQoS1Client`, `Milestone7BridgeEngine`), terminal outputs, codeNotes, tryIt exercises, and socratic check questions (answer: 0).
  - Gate v2 Visual JSON contracts generated and SHA-256 hash verified in `src/lib/data/lessonVisuals/iot_emb/day-36.json` through `day-40.json` using the `register-bits` template with 4 synchronized steps (`intro`, `say1`, `example`, `tryIt`).
  - Unit test suite `tests/iot_emb_days36_40_expansion.test.ts` passing 100% (5 subtests, 0 failures).
  - Full regression across all Days 6–40 passing 100% (35/35 subtests passing).
  - Clean TypeScript compilation (`npx tsc --noEmit`) with 0 errors across the codebase.

---

"""

mem_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(mem_path, 'r', encoding='utf-8') as f:
    old_mem = f.read()

with open(mem_path, 'w', encoding='utf-8') as f:
    f.write(milestone_entry + old_mem)

print('Prepended Milestone 7 (Month 2 Block 8) update to PROJECT_MEMORY.md successfully!')
