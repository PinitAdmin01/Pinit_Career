import csv

# 1. Update multi_agent_control.csv
mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
rows = []
for r in csv.reader(open(mac_path, 'r', encoding='utf-8')):
    if len(r) > 0 and r[0] == 'AGENT-452':
        r = ['AGENT-452', 'Antigravity', 'codex/interview-tab-reliability', 'Present-Career-os', 'TASK-1599..1603', 'Completed', 'c9c27c25', 'Course 14 (iot_emb) Month 2 Block 9: Days 41-45 Complete, verified & pushed (c9c27c25). 45/60 Days Complete.']
    rows.append(r)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print('Updated multi_agent_control.csv for AGENT-452!')

# 2. Update agent_tasks.csv
tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
task_rows = []
tasks_to_complete = {'TASK-1599', 'TASK-1600', 'TASK-1601', 'TASK-1602', 'TASK-1603'}
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
print('Updated agent_tasks.csv marking TASK-1599..1603 as COMPLETED!')

# 3. Prepend to PROJECT_MEMORY.md
milestone_entry = """## [2026-10-19 01:45:00] Milestone Update: Course 14 (IoT, Firmware & Embedded Systems) Month 2 Block 9 (Days 41–45: Hardware Security, Embedded Cryptography, Secure Boot Architecture, LittleFS Storage & Milestone 8 Secure Bootloader) 100% COMPLETE & CERTIFIED

- **Agent**: AGENT-452 (Antigravity IDE & Multi-Agent Architecture)
- **Tasks**: TASK-1599..1603 (Marked COMPLETED in agent_tasks.csv)
- **Branch**: codex/interview-tab-reliability (Commit: c9c27c25)
- **Course Status**: Course 14: IoT, Firmware & Embedded Systems (course-iot-embedded / prefix: iot_emb)
  - **Month 1 (Days 1–30: Complete Silicon, RTOS, DMA & Avionics Synthesis)**: 100% Complete
  - **Month 2 Block 7 (Days 31–35: BLE, Wi-Fi LwIP, LoRaWAN, Thread & Milestone 6 Multi-Radio Gateway)**: 100% Complete
  - **Month 2 Block 8 (Days 36–40: MQTT, CoAP, Modbus RTU/TCP, NanoPB & Milestone 7 Bridge)**: 100% Complete
  - **Month 2 Block 9 (Days 41–45: Hardware Security, Cryptography & Milestone 8 Secure Bootloader)**: **100% COMPLETE & VERIFIED**
    - **Day 41 (TASK-1599)**: Hardware Roots of Trust (RoT): Physical Unclonable Functions (PUF) & Secure Elements (ATECC608)
    - **Day 42 (TASK-1600)**: Embedded Cryptography: AES-128/256-GCM, SHA-256 & Curve25519 Math on Cortex-M
    - **Day 43 (TASK-1601)**: Secure Boot Architecture: Multi-Stage Bootloaders, ECDSA Signatures & Anti-Rollback eFuses
    - **Day 44 (TASK-1602)**: Flash Memory Architecture: Wear Leveling, LittleFS / SPIFFS & Power-Loss Recovery
    - **Day 45 (TASK-1603)**: 🏆 **Milestone 8: Cryptographic Secure Bootloader & Authenticated Firmware Verifier Engine (Flash Memory Partitioning Blueprint, Streaming SHA-256 Digest, ECDSA P-256 Hardware Validation, Anti-Rollback Monotonic eFuses, Glitch-Resistant Multibit Return Codes & Safe Thumb Reset_Handler Branching)**
  - **Course Progress**: **45 of 60 Days Complete (75.00%)**
- **Invariants Enforced & Quality Assurance**:
  - Strict 5-part LongLesson structure per day with deep technical explanations, C++ security constructs (`MCUFlashSecuritySim`, `ATECC608SecureElementSim`, `SRAMPUFSimulator`, `AES128GCMSimulator`, `constantTimeCompare`, `X25519KeyExchangeSim`, `ChainOfTrustSim`, `SecureBootVerifier`, `HardwareAntiRollbackSim`, `GlitchResistantBootloader`, `NORFlashSiliconSim`, `WearLevelingManager`, `LittleFSCopyOnWriteSim`, `Milestone8SecureBootloaderEngine`), terminal outputs, codeNotes, tryIt exercises, and socratic check questions (answer: 0).
  - Gate v2 Visual JSON contracts generated and SHA-256 hash verified in `src/lib/data/lessonVisuals/iot_emb/day-41.json` through `day-45.json` using the `register-bits` template with 4 synchronized steps (`intro`, `say1`, `example`, `tryIt`).
  - Unit test suite `tests/iot_emb_days41_45_expansion.test.ts` passing 100% (5 subtests, 0 failures).
  - Full regression across all Days 6–45 passing 100% (39/39 subtests passing).
  - Clean TypeScript compilation (`npx tsc --noEmit`) with 0 errors across the codebase.

---

"""

mem_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'
with open(mem_path, 'r', encoding='utf-8') as f:
    old_mem = f.read()

with open(mem_path, 'w', encoding='utf-8') as f:
    f.write(milestone_entry + old_mem)

print('Prepended Milestone 8 (Month 2 Block 9) update to PROJECT_MEMORY.md successfully!')
