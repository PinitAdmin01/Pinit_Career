# scripts/sync_day57_memory.py
import os, sys

sys.stdout.reconfigure(encoding='utf-8')

MEMORY_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
PROJECT_MEMORY_PATH = os.path.join(MEMORY_DIR, "PROJECT_MEMORY.md")

entry = """### Course 18: IoT Networking & Cloud Protocols (`iot_net`) - Month 2 Block 12 Day 57 (Completed 2026-10-24)
- **Day Completed**: Day 57: Mutual TLS (mTLS) X.509 Authentication & Hardware Secure Elements (ATECC608A / TPM 2.0 PKCS#11).
- **Course 18 Progress**: **57 / 60 Days (95.0% Complete)**.
- **Pedagogical Invariants Met**:
  - Part 1: 655 words (PKI & Mutual TLS Handshake: X.509 Certificate Hierarchy, TLS 1.3 Handshake Dynamics, ECDHE Key Exchange & Cipher Suites).
  - Part 2: 618 words (Microchip ATECC608A Hardware Secure Element: Silicon Key Isolation, I2C Bus Architecture & Non-Exportable Cryptographic Signing).
  - Part 3: 633 words (TPM 2.0 & PKCS#11 Cryptographic Token Interface: Linux `libtpm2_pkcs11`, RFC 7512 Engine URIs & Non-Exportable Key Access).
  - Part 4: 596 words (X.509 Certificate Revocation & Lifecycle Management: CRLs, OCSP Stapling & Zero Trust Expiration Policies).
  - Part 5: 589 words (Masterclass Synthesis: Zero-Trust Hardware-Enforced Security Mesh Engine, `MTLS_HARDWARE_SECURITY_ENGINE_GRADE_A_PLUS_CERTIFIED`).
  - Total Day 57 Word Count: **3,091 words** (all 5 parts strictly >= 580 words; avatar speaking >= 20 minutes).
- **Visuals & Hardware Registers**:
  - `src/lib/data/lessonVisuals/iot_net/day-57.json` generated and verified with 5 domain-accurate 8-bit registers:
    `MTLS_HANDSHAKE_REG`, `ATECC608A_SILICON_REG`, `TPM2_PKCS11_REG`, `X509_REVOCATION_REG`, `SEC_MASTER_ENGINE_REG`.
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

print("PROJECT_MEMORY.md updated successfully with Day 57 entry!")
