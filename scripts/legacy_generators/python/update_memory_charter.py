import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

mem_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

with open(mem_path, 'r', encoding='utf-8') as f:
    current_content = f.read()

new_milestone_header = """### 🚀 MASTER MULTI-AGENT TRI-BRANCH CHARTER ESTABLISHED (2026-10-24)
- **Authority**: Central Coordination Authority (`C:\\Users\\Admin\\Desktop\\projects\\memory of agent`).
- **Platform Incomplete Work Audited**: **1,120 Days remaining** out of 2,220 Days Total Platform Target (15 Courses 100% Complete = 900 Days; Month 1 Complete across all other courses).
- **Equal Tri-Branch Division & Domain Partition (Zero File Overlap / 0.00% Merge Collision)**:
  1. **Branch A (`main` / `Present-Career-os`)**:
     - **Assignment**: **Web Full-Stack Masterclasses Month 2 (Days 31–60)**.
     - **Scope**: 12 Web Courses x 30 Days = **360 Days**.
     - **Active Courses**: `cloudWebLongLessons.ts` (EKS, Serverless, Active-Active), `devopsWebLongLessons.ts` (Docker, CI/CD, K8s GitOps), `cyberWebLongLessons.ts`, `distributedWebLongLessons.ts`, `sreWebLongLessons.ts`, `streamWebLongLessons.ts`, `aiWebLongLessons.ts`, `aiDeployWebLongLessons.ts`, `dsaWebLongLessons.ts`, `fullstackJsLongLessons.ts`, `g3dLongLessons.ts`, `designWebLongLessons.ts`.
     - **File Boundaries**: `src/lib/data/*WebLongLessons.ts` and `src/lib/data/lessonVisuals/{cloud, devops, cyber, dist, sre, stream, ai, aideploy, design, dsa-optim, fullstack-js, g3d}`.
  2. **Branch B (`agent/branch-b-curriculum-commerce-iot` / `Present-Career-os-commerce`)**:
     - **Assignment**: **Flagship B.Com Commerce Masterclasses Month 2 (Days 31–60)**.
     - **Scope**: 13 Commerce Courses = **400 Days**.
     - **Active Courses**: `bcomLawLongLessons.ts` (Finish Days 46–60: 15 Days), `bcomAccountingLongLessons.ts` (30 Days), `bcomFinanceLongLessons.ts` (30 Days), `bcomTaxLongLessons.ts` (30 Days), `bcomAudLongLessons.ts` (30 Days), `bcomBanLongLessons.ts` (30 Days), `bcomOpsLongLessons.ts` (30 Days), `bcomAitLongLessons.ts` (30 Days), `bcomAnaLongLessons.ts` (55 Days), `bcomMktLongLessons.ts` (30 Days), `bcomScrmLongLessons.ts` (30 Days), `bcomEcomLongLessons.ts` (30 Days), `bcomDmktLongLessons.ts` (30 Days).
     - **File Boundaries**: `src/lib/data/bcom*LongLessons.ts` and `src/lib/data/lessonVisuals/bcom_*` exclusively.
  3. **Branch C (`agent/branch-c-platform-admin-faculty` / `Present-Career-os-platform`)**:
     - **Assignment**: **Python AI, Distributed & Quantitative Masterclasses Month 2 (Days 31–60)**.
     - **Scope**: 12 Python Courses x 30 Days = **360 Days**.
     - **Active Courses**: `sqlLongLessons.ts` (30 Days), `dsaPythonLongLessons.ts` (30 Days), `aiPythonLongLessons.ts` (30 Days), `distPythonLongLessons.ts` (30 Days), `cloudPythonLongLessons.ts` (30 Days), `nlpPythonLongLessons.ts` (30 Days), `quantPythonLongLessons.ts` (30 Days), `promptPythonLongLessons.ts` (30 Days), `trainPythonLongLessons.ts` (30 Days), `vectorPythonLongLessons.ts` (30 Days), `safetyPythonLongLessons.ts` (30 Days), `cyberPythonLongLessons.ts` (30 Days).
     - **File Boundaries**: `src/lib/data/*PythonLongLessons.ts`, `sqlLongLessons.ts`, and `src/lib/data/lessonVisuals/{python, dsa-py, ai-py, dist-py, cloud-py, nlp-py, quant-py, prompt-py, train-py, vec-py, safe-py, sql-mastery}` exclusively.
- **Universal Zero-Hallucination Invariants**:
  - Exactly 5 parts per day.
  - $\ge 580$ words per part, $\ge 3,000$ words per day (Avatar lecture $\ge 20$ minutes).
  - Gate v2 visual envelope on disk (`day-XX.json`) with 4 synchronized steps and SHA-256 bindings.
  - Diagnostic MCQ with `answer: 0`, 4 distinct options, and deep architectural explanation.
  - Deterministic code with bit-perfect stdout matching.
  - Tests pass 100% GREEN, `npx tsc --noEmit` reports 0 errors.
  - One-by-one git commits and pushes.
- **Directives Published**:
  - `MULTI_AGENT_3_BRANCH_CHARTER.md` (Master Charter)
  - `BRANCH_A_DIRECTIVE.md` (Web Full-Stack)
  - `BRANCH_B_DIRECTIVE.md` (Flagship Commerce)
  - `BRANCH_C_DIRECTIVE.md` (Python AI & Data)

"""

updated_content = new_milestone_header + current_content

with open(mem_path, 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Prepend successful: PROJECT_MEMORY.md updated with Multi-Agent Tri-Branch Charter.")
