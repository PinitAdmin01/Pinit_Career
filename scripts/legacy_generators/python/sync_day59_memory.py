# scripts/sync_day59_memory.py
import os, sys

sys.stdout.reconfigure(encoding='utf-8')

MEMORY_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
PROJECT_MEMORY_PATH = os.path.join(MEMORY_DIR, "PROJECT_MEMORY.md")

entry = """### Course 18: IoT Networking & Cloud Protocols (`iot_net`) - Month 2 Block 12 Day 59 (Completed 2026-10-24)
- **Day Completed**: Day 59: Over-the-Air (OTA) Firmware Updates, Dual-Bank Flash A/B Partitioning & Rollback Protection.
- **Course 18 Progress**: **59 / 60 Days (98.3% Complete)**.
- **Pedagogical Invariants Met**:
  - Part 1: 590 words (Dual-Bank Flash A/B Partition Manager & Golden Bootloader Architecture: Active vs Passive Banks, Watchdog Rollback).
  - Part 2: 619 words (Cryptographic Firmware Signature Verification & Manifest Bundling: ECDSA P-256, OTP eFuse Root of Trust & Merkle Trees).
  - Part 3: 609 words (Anti-Rollback Protection & Hardware Monotonic Security Counters: Defeating Downgrade Attacks with Permanent eFuses).
  - Part 4: 606 words (Cellular/Satellite Delta Updates & Chunked Resumable Ingestion: Binary Diffing, Persistent Bitmaps & CRC32 Blocks).
  - Part 5: 589 words (Masterclass Synthesis: Resilient Dual-Bank Secure OTA Firmware Engine, `OTA_DUAL_BANK_FIRMWARE_ENGINE_GRADE_A_PLUS_CERTIFIED`).
  - Total Day 59 Word Count: **3,013 words** (all 5 parts strictly >= 580 words; avatar speaking >= 20 minutes).
- **Visuals & Hardware Registers**:
  - `src/lib/data/lessonVisuals/iot_net/day-59.json` generated and verified with 5 domain-accurate 8-bit registers:
    `DUAL_BANK_CTRL_REG`, `FW_SIG_VERIFY_REG`, `ANTI_ROLLBACK_REG`, `CHUNK_INGEST_REG`, `OTA_MASTER_ENGINE_REG`.
  - 4 synchronized steps per visual (`say1`, `say2`, `example`, `tryIt`) matching raw SHA-256 codeHash contracts.
- **Verification Suite**:
  - `tests/iot_net_days56_60_expansion.test.ts`: Passed (6/6 assertions).
  - TypeScript Compiler (`npx tsc --noEmit`): Clean (0 errors).
- **Target Branch**: `main`

"""

print("Updating PROJECT_MEMORY.md...")
with open(PROJECT_MEMORY_PATH, 'r', encoding='utf-8') as f:
    orig_memory = f.read()

with open(PROJECT_MEMORY_PATH, 'w', encoding='utf-8') as f:
    f.write(entry + orig_memory)

print("PROJECT_MEMORY.md updated successfully with Day 59 entry!")
