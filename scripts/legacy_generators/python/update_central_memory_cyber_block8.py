# scripts/update_central_memory_cyber_block8.py
import os
import sys

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

# 1. Update PROJECT_MEMORY.md
proj_mem_path = os.path.join(memory_dir, "PROJECT_MEMORY.md")
with open(proj_mem_path, "r", encoding="utf-8") as f:
    proj_mem = f.read()

cyber_entry = """
## [2026-10-26 02:58:00] - Branch A: Course 09 (Cybersecurity Principles / cyber) Month 2 Block 8 (Days 36–40 & Milestone 8 Capstone) 100% Complete & Certified
- **Branch**: `main` (Branch A: Tech / IoT / Systems Architecture)
- **Worktree**: `Present-Career-os`
- **Course**: Course 09: Cybersecurity Principles (`course-cybersecurity` / `cyber` / `src/lib/data/cyberWebLongLessons.ts`)
- **Block**: Month 2 Block 8 (Days 36–40 & Milestone 8 Capstone: Identity, Authentication & OAuth2/OIDC Protocols):
  - Day 36: OAuth 2.1 Framework & Core Grant Flows: Authorization Code Grant, PKCE (RFC 7636), Client Authentication & Refresh Token Rotation (3,410 words)
  - Day 37: JSON Web Tokens (JWT) & JOSE Standards: JWS Signatures, JWE Encryption, Key IDs (kid), Algorithm Confusion & Clock Skew Mitigation (3,630 words)
  - Day 38: OpenID Connect (OIDC) & Identity Federation: ID Tokens, UserInfo Endpoint, Discovery Document & JWKS Management (3,399 words)
  - Day 39: SAML 2.0 & Enterprise Single Sign-On (SSO): XML Signatures (XMLDSig), Canonicalization (C14N) & Replay Mitigation (3,397 words)
  - Day 40: 🌟 Milestone 8 Capstone: The Sovereign Enterprise Identity Provider (IdP) & Zero-Trust Token Exchange Gateway (3,281 words; minutes: 60)
- **Total Block Words**: 17,117 words across 25 parts (average 684.7 words/part; all 25 parts >= 600 words)
- **Gate v2 Visual Envelopes**: `src/lib/data/lessonVisuals/cyber/day-36.json` through `day-40.json` generated with `schemaVersion: 2`, `compare` template, 4 synchronized steps (`intro`, `inspect`, `compare`, `verify`), and ZERO numeric digits in captions (`!/\d/`).
- **Verification & Testing**:
  - `tests/cyber_days36_40_expansion.test.ts`: 2/2 tests PASS (100%).
  - Full cyber regression suite `tests/cyber_days31_35_expansion.test.ts` + `tests/cyber_days36_40_expansion.test.ts`: 4/4 tests PASS (100%).
  - Days 1 to 40 sequential verification in `src/lib/data/cyberWebLongLessons.ts`.
  - TypeScript Compilation: `npx tsc --noEmit` verified with 0 errors (Exit code 0).
- **Task Logging**: Appended non-colliding `TASK-2178` through `TASK-2182` to `agent_tasks.csv`.
- **Course Status**: Course 09 (`cyber`) is now **40 / 60 Days (66.67% Complete)**!
- **Next Assignment**: Advance immediately to Month 2 Block 9 (Days 41–45: Application & API Security: OWASP Top 10, Injection Mitigation, Cross-Site Scripting, CSRF Defense, and Milestone 9 Capstone).
"""

with open(proj_mem_path, "a", encoding="utf-8") as f:
    f.write(cyber_entry)
print("Updated PROJECT_MEMORY.md successfully!")

# 2. Update agent_tasks.csv
tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
task_lines = [
    'TASK-2178,"cyber Day 36: OAuth 2.1 Framework & Core Grant Flows: Authorization Code Grant, PKCE (RFC 7636), Client Authentication & Refresh Token Rotation",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 02:58:00\n',
    'TASK-2179,"cyber Day 37: JSON Web Tokens (JWT) & JOSE Standards: JWS Signatures, JWE Encryption, Key IDs (kid), Algorithm Confusion & Clock Skew Mitigation",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 02:58:00\n',
    'TASK-2180,"cyber Day 38: OpenID Connect (OIDC) & Identity Federation: ID Tokens, UserInfo Endpoint, Discovery Document & JWKS Management",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 02:58:00\n',
    'TASK-2181,"cyber Day 39: SAML 2.0 & Enterprise Single Sign-On (SSO): XML Signatures (XMLDSig), Canonicalization (C14N) & Replay Mitigation",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 02:58:00\n',
    'TASK-2182,"cyber Day 40: Milestone 8 Capstone: The Sovereign Enterprise Identity Provider (IdP) & Zero-Trust Token Exchange Gateway",Completed,PENDING_COMMIT,Present-Career-os,main,2026-10-26 02:58:00\n'
]

with open(tasks_path, "a", encoding="utf-8") as f:
    f.writelines(task_lines)
print("Updated agent_tasks.csv successfully!")

# 3. Update multi_agent_control.csv
mac_path = os.path.join(memory_dir, "multi_agent_control.csv")
mac_line = 'AGENT-529,Branch A Tech/IoT/Systems Lead,Present-Career-os,main,"Course 09: Cybersecurity Principles (cyber) Month 2 Block 8 (Days 36-40 & Milestone 8 Capstone) Complete & Verified. Progress: 40/60 Days (66.67%). Advancing to Block 9 (Days 41-45).",Active,2026-10-26 02:58:00\n'

with open(mac_path, "a", encoding="utf-8") as f:
    f.write(mac_line)
print("Updated multi_agent_control.csv successfully!")
