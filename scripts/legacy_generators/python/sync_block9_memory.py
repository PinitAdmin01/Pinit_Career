import csv
import datetime

# 1. Update PROJECT_MEMORY.md
memory_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(memory_path, 'r', encoding='utf-8') as f:
    memory_content = f.read()

new_entry = """## [2026-10-19 01:50:00] Milestone Update: Course 14 (IoT, Firmware & Embedded Systems) Month 2 Block 9 (Days 41–45: Hardware Security, AES-GCM, Secure Boot, LittleFS & Milestone 8) 100% COMPLETE & CERTIFIED

- **Agent**: AGENT-452 (Antigravity IDE & Multi-Agent Architecture)
- **Tasks**: TASK-1599..1603 (COMPLETED & Verified in agent_tasks.csv)
- **Branch**: codex/interview-tab-reliability (Commit: `06ed54b7`)
- **Course Status**: Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded / prefix: `iot_emb`)
  - **Month 1 (Days 1–30: Complete Silicon, RTOS, DMA & Avionics Synthesis)**: 100% Complete
  - **Month 2 Block 7 (Days 31–35: Wireless IoT Networks, BLE, Wi-Fi, LoRaWAN, Thread & Milestone 6 Multi-Radio Gateway)**: 100% Complete
  - **Month 2 Block 8 (Days 36–40: Industrial IoT Protocols: MQTT, CoAP, Modbus RTU/TCP, NanoPB & Milestone 7 Bridge)**: 100% Complete
  - **Month 2 Block 9 (Days 41–45: Hardware Security, Cryptography, Secure Boot & LittleFS)**: **100% ENRICHED, CERTIFIED & VERIFIED**
    - **Day 41 (TASK-1599)**: Hardware Roots of Trust (RoT): Physical Unclonable Functions (PUF) & Secure Elements (ATECC608) (3,058 words, 25.5 mins spoken, declared minutes: 38)
    - **Day 42 (TASK-1600)**: Embedded Cryptography: AES-128/256-GCM, SHA-256 & Curve25519 Math on Cortex-M (3,123 words, 26.0 mins spoken, declared minutes: 38)
    - **Day 43 (TASK-1601)**: Secure Boot Architecture: Multi-Stage Bootloaders, ECDSA Signatures & Anti-Rollback eFuses (3,148 words, 26.2 mins spoken, declared minutes: 38)
    - **Day 44 (TASK-1602)**: Flash Memory Architecture: Wear Leveling, LittleFS / SPIFFS & Power-Loss Recovery (3,108 words, 25.9 mins spoken, declared minutes: 39)
    - **Day 45 (TASK-1603)**: 🏆 **Milestone 8: Cryptographic Secure Bootloader & Authenticated Firmware Verifier Engine (Multi-Stage Chain of Trust, Streaming SHA-256 Digest, ECDSA-P256 Signature Verification, Monotonic eFuse Anti-Rollback & Dual-Bank A/B Vector Handover)** (3,202 words, 26.7 mins spoken, declared minutes: 40)
  - **Course Progress**: **45 of 60 Days Complete (75.0%)**
- **Quality Mandates & Pedagogic Invariants Enforced**:
  - **Avatar Spoken Audio**: Strictly >= 25 minutes per day (every single part >= 585 words, 25.5 to 26.7 mins spoken audio per class).
  - **Class Declared Duration**: Strictly within 35-40 min range (Days 41-43: 38 mins, Day 44: 39 mins, Day 45: 40 mins).
  - **Pedagogic Invariants**: Exactly 5 parts per lesson, 4 options per Socratic check with `answer: 0`, substantial explanation, runnable C++ code with concrete terminal output and line-by-line `codeNotes`, and `tryIt` challenges.
  - **Gate v2 Visual Contracts**: Matching on-disk visual JSON files (`day-41.json` through `day-45.json`) with full envelope, synchronized 4-step markers (`intro`, `say1`, `example`, `tryIt`), tappable interactive labels, and raw SHA-256 `codeHash` validation matching `part.code`.
  - **Verification**: `tests/iot_emb_days41_45_expansion.test.ts` (4/4 passing), `tests/iot_hardware_visuals_verification.test.ts` (6/6 passing, including Block 9), all 34 iot tests passing 100%, and `npx tsc --noEmit` clean (0 errors).

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
        if r.get('Task_ID') in ['TASK-1599', 'TASK-1600', 'TASK-1601', 'TASK-1602', 'TASK-1603']:
            r['Status'] = 'COMPLETED'
            r['Dark_Gracity_Ref'] = 'COMPLETED'
            r['Agent_Resolution'] = 'Enriched with 20+ min spoken avatar audio, 38-40 min declared class duration, Gate v2 visuals, and 100% test verification (Commit 06ed54b7).'
        rows.append(r)

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print("Updated agent_tasks.csv with COMPLETED for TASK-1599..1603!")

# 3. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_rows = []
with open(mac_path, 'r', encoding='utf-8') as f:
    mac_rows = list(csv.reader(f))

for r in mac_rows:
    if len(r) > 4 and r[0] == 'AGENT-452':
        r[4] = 'Completed'
        if len(r) > 6:
            r[6] = '06ed54b7'
        if len(r) > 7:
            r[7] = 'Course 14 (iot_emb) Month 2 Block 9: Days 41-45 Complete with 20+ min spoken audio, 38-40 min duration, verified & pushed (06ed54b7). 45/60 Days Complete.'

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(mac_rows)

print("Updated multi_agent_control.csv for AGENT-452!")
