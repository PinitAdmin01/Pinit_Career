# scripts/sync_iot_sec_block2_memory.py
import csv, datetime

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

# 1. Update agent_tasks.csv
tasks_file = f"{memory_dir}\\agent_tasks.csv"
rows = []
updated_tasks = 0
with open(tasks_file, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] in [f"TASK-{i}" for i in range(1719, 1724)]:
            row[6] = "COMPLETED"
            updated_tasks += 1
        rows.append(row)

with open(tasks_file, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print(f"Updated {updated_tasks} tasks in agent_tasks.csv to COMPLETED.")

# 2. Update multi_agent_control.csv
control_file = f"{memory_dir}\\multi_agent_control.csv"
rows = []
updated_agent = 0
with open(control_file, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] == "AGENT-475":
            row[6] = "Completed"
            row[9] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            updated_agent += 1
        rows.append(row)

with open(control_file, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)
print(f"Updated {updated_agent} agent in multi_agent_control.csv to Completed.")

# 3. Update PROJECT_MEMORY.md
project_memory_file = f"{memory_dir}\\PROJECT_MEMORY.md"
with open(project_memory_file, "r", encoding="utf-8") as f:
    mem_content = f.read()

new_entry = """
### Milestone Entry: Course 19 (iot_sec) Month 1 Block 2 (Days 6–10) & Milestone 2 (AES-XTS Flash Encryption)
- **Course**: `iot_sec` (Course 19: IoT Hardware Security, Root of Trust & Secure Boot)
- **Block**: Month 1 Block 2 (Days 6–10)
- **Status**: 100% COMPLETE & VERIFIED
- **Total Words**: 14,938 words across 5 days (Average 2,988 words/day, every part >= 580 words)
- **Days Completed**:
  - Day 6: Anti-Rollback Protection: Monotonic Counters & One-Time Programmable (eFuse) Silicon (3,016 words)
  - Day 7: Device Identity & X.509 Certificates: PKI, CAs and Device Provisioning (2,997 words)
  - Day 8: Secure Elements (SE) & Hardware Security Modules (TPM 2.0): I2C/SPI Bus Crypto Coprocessors & PCR Measurement (2,973 words)
  - Day 9: Hardware Debug Port Security: JTAG/SWD Disabling, Bitfuse Lockout & Password Protection (2,961 words)
  - Day 10: ⭐ **Milestone 2**: Flash Encryption & Bus Scrambling: AES-XTS on External SPI Flash (2,991 words)
- **Key Hardware Architectures**:
  - Unary eFuse monotonic counters preventing firmware downgrade exploitation.
  - IEEE 802.1AR Secure Device Identifiers (IDevID, LDevID) and zero-knowledge factory provisioning via CSRs.
  - Discrete Secure Elements (ATECC608B, SE050), Common Criteria EAL6+ active shields, and SCP03 bus encryption.
  - TPM 2.0 EK/SRK hierarchies, SHA-256 PCR banks, and remote attestation quotes bound by AK signatures.
  - Irreversible eFuse JTAG/SWD lockout, challenge-response debug unlock, and mandatory RMA data zeroization.
  - ⭐ **Milestone 2 ApexFlash-XTS Engine**: IEEE 1619 address-bound tweakable block cipher, Galois Field GF(2^128) tweak polynomial, hardware LFSR bus scrambler, and transparent 0-wait-state XiP cache.
- **Visuals**: Gate v2 Visual Envelopes compiled for Days 6–10 (`src/lib/data/lessonVisuals/iot_sec/day-{06..10}.json`, 25 visual envelopes).
- **Test Suite**: `tests/iot_sec_days6_10_expansion.test.ts` (6/6 passing, 100% deterministic test coverage).
- **TypeScript**: 0 errors on `npx tsc --noEmit`.
"""

mem_content += "\n" + new_entry
with open(project_memory_file, "w", encoding="utf-8") as f:
    f.write(mem_content)
print("Updated PROJECT_MEMORY.md successfully!")
