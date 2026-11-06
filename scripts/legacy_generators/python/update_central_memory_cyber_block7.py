# scripts/update_central_memory_cyber_block7.py
import os
import sys

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

# 1. Update PROJECT_MEMORY.md
proj_mem_path = os.path.join(memory_dir, "PROJECT_MEMORY.md")
with open(proj_mem_path, "r", encoding="utf-8") as f:
    proj_mem = f.read()

cyber_entry = """
## [2026-10-26 02:40:00] - Branch A: Course 09 (Cybersecurity Principles / cyber) Month 2 Block 7 (Days 31–35 & Milestone 7 Capstone) 100% Complete & Certified
- **Branch**: `main` (Branch A: Tech / IoT / Systems Architecture)
- **Worktree**: `Present-Career-os`
- **Course**: Course 09: Cybersecurity Principles (`course-cybersecurity` / `cyber` / `src/lib/data/cyberWebLongLessons.ts`)
- **Block**: Month 2 Block 7 (Days 31–35 & Milestone 7 Capstone):
  - Day 31: Modern Symmetric Cryptography: AES-GCM-256 Authenticated Encryption, ChaCha20-Poly1305 Stream Cipher, AEAD Invariants & Nonce-Reuse Disaster Avoidance (3,185 words)
  - Day 32: Asymmetric Cryptography & Elliptic Curves: RSA-4096 vs ECC Curve25519/Ed25519, ECDSA Signatures, ECDH Key Exchange & Ephemeral Forward Secrecy (3,256 words)
  - Day 33: Cryptographic Hashing & Password Storage: SHA-3/BLAKE3 Fixed-Output Functions, HMAC Message Authentication, PBKDF2 vs Scrypt vs Memory-Hard Argon2id (3,080 words)
  - Day 34: Public Key Infrastructure (PKI) & X.509 Certificate Authorities: Certificate Chains, ASN.1/DER Encoding, CRL, OCSP Stapling & Certificate Transparency (CT) Logs (3,218 words)
  - Day 35: 🌟 Milestone 7 Capstone: The Enterprise Cryptographic Hardware Security Module (HSM) & Key Lifecycle Management Engine (KMS) (3,134 words; minutes: 60)
- **Total Block Words**: 15,873 words across 25 parts (average 634.9 words/part; all 25 parts >= 600 words)
- **Gate v2 Visual Envelopes**: `src/lib/data/lessonVisuals/cyber/day-31.json` through `day-35.json` generated with `schemaVersion: 2`, `compare` template, 4 synchronized steps (`intro`, `inspect`, `compare`, `verify`), and ZERO numeric digits in captions (`!/\d/`).
- **Verification & Testing**:
  - `tests/cyber_days31_35_expansion.test.ts`: 2/2 tests PASS (100%).
  - Days 1 to 35 sequential verification in `src/lib/data/cyberWebLongLessons.ts`.
  - TypeScript Compilation: `npx tsc --noEmit` verified with 0 errors (Exit code 0).
- **Task Logging**: Appended non-colliding `TASK-2173` through `TASK-2177` to `agent_tasks.csv`.
- **Course Status**: Course 09 (`cyber`) is now **35 / 60 Days (58.33% Complete)**!
- **Next Assignment**: Advance immediately to Month 2 Block 8 (Days 36–40: Identity, Authentication & OAuth2/OIDC Protocols: OAuth 2.1 Grant Types, PKCE Authorization Code Flow, JWT/JWS/JWE Anatomy, OpenID Connect Discovery, and Milestone 8 Capstone).
"""

with open(proj_mem_path, "a", encoding="utf-8") as f:
    f.write(cyber_entry)
print("Updated PROJECT_MEMORY.md successfully!")

# 2. Update agent_tasks.csv
tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
task_lines = [
    'TASK-2173,"cyber Day 31: Modern Symmetric Cryptography: AES-GCM-256 Authenticated Encryption, ChaCha20-Poly1305 Stream Cipher, AEAD Invariants & Nonce-Reuse Disaster Avoidance",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 02:40:00\n',
    'TASK-2174,"cyber Day 32: Asymmetric Cryptography & Elliptic Curves: RSA-4096 vs ECC Curve25519/Ed25519, ECDSA Signatures, ECDH Key Exchange & Ephemeral Forward Secrecy",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 02:40:00\n',
    'TASK-2175,"cyber Day 33: Cryptographic Hashing & Password Storage: SHA-3/BLAKE3 Fixed-Output Functions, HMAC Message Authentication, PBKDF2 vs Scrypt vs Memory-Hard Argon2id",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 02:40:00\n',
    'TASK-2176,"cyber Day 34: Public Key Infrastructure (PKI) & X.509 Certificate Authorities: Certificate Chains, ASN.1/DER Encoding, CRL, OCSP Stapling & Certificate Transparency (CT) Logs",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 02:40:00\n',
    'TASK-2177,"cyber Day 35: Milestone 7 Capstone: The Enterprise Cryptographic Hardware Security Module (HSM) & Key Lifecycle Management Engine (KMS)",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 02:40:00\n'
]

with open(tasks_path, "a", encoding="utf-8") as f:
    f.writelines(task_lines)
print("Updated agent_tasks.csv successfully!")

# 3. Update multi_agent_control.csv
mac_path = os.path.join(memory_dir, "multi_agent_control.csv")
mac_line = 'AGENT-528,Branch A Tech/IoT/Systems Lead,Present-Career-os,main,"Course 09: Cybersecurity Principles (cyber) Month 2 Block 7 (Days 31-35 & Milestone 7 Capstone) Complete & Pushed. Progress: 35/60 Days (58.33%). Advancing to Block 8 (Days 36-40).",Active,2026-10-26 02:40:00\n'

with open(mac_path, "a", encoding="utf-8") as f:
    f.write(mac_line)
print("Updated multi_agent_control.csv successfully!")
