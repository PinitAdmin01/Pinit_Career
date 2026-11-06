import os
import shutil
import csv
import sys
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
wt_a = r"C:\Users\Admin\Desktop\projects\Present-Career-os"
wt_b = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
wt_c = r"C:\Users\Admin\Desktop\projects\Present-Career-os-platform"

# --- 1. MULTI_AGENT_3_BRANCH_CHARTER.md ---
charter_content = """# 🏛️ PinIT Career OS: Multi-Agent 3-Branch Division Charter & Master Execution Blueprint

**Document Version**: 2.0 (Tri-Branch Parallel Execution Charter)  
**Date**: October 24, 2026  
**Scope**: 100% Full Curriculum Conquering across all 37 Master Tracks (2,220 Days Total)  
**Central Coordination Authority**: `C:\\Users\\Admin\\Desktop\\projects\\memory of agent`

---

## 📊 1. Current Mathematical State of Work & Completed Foundations

### A. Completed 60-Day Graduations (15 Courses / 900 Days / 100% Complete)
The following 15 courses have reached **100% 60-day completion** with strict 5-part structure, $\\ge 580$ words/part ($\\ge 3,000$ words/day), Gate v2 visual envelopes, and deterministic verification:
1. `reactLongLessons.ts` (React Basics & UI Engineering) — 60/60 Days
2. `pythonLongLessons.ts` (Core Python & Systems Backend) — 60/60 Days
3. `nodeWebLongLessons.ts` (Node.js & Backend Architecture) — 60/60 Days
4. `compFundLongLessons.ts` (Computer Science Fundamentals) — 60/60 Days
5. `gitVcsLongLessons.ts` (Git, VCS & Release Engineering) — 60/60 Days
6. `iotEmbLongLessons.ts` (Embedded Systems & Microcontroller Firmware) — 60/60 Days
7. `quantSystemsLongLessons.ts` (Quantitative Systems Architecture) — 60/60 Days
8. `excelVizLongLessons.ts` (Business Analytics & Excel Modeling) — 60/60 Days
9. `blockchainLongLessons.ts` (Decentralized Systems & Smart Contracts) — 60/60 Days
10. `mobileLongLessons.ts` (Cross-Platform Mobile Engineering) — 60/60 Days
11. `javaBasicsLongLessons.ts` (Enterprise Java & JVM Architecture) — 60/60 Days
12. `softSkillsLongLessons.ts` (Executive Communication & Leadership) — 60/60 Days
13. `iotEdgeLongLessons.ts` (Edge Computing & RTOS IoT Architectures) — 60/60 Days
14. `iotSecLongLessons.ts` (Hardware Security & Cryptographic Enclaves) — 60/60 Days
15. `iotNetLongLessons.ts` (IoT Wireless Protocols & Edge Mesh Networks) — 60/60 Days

*(In addition, Branch C has completed `bcomEntLongLessons.ts` 60/60 and `bcomLawLongLessons.ts` 45/60)*.

---

## ⚖️ 2. Mathematical Partition: Equal 3-Branch Allocation (Zero Collisions)

The remaining incomplete curriculum across the entire platform stands at **1,120 Days**.  
To maximize throughput and ensure **0.00% merge collisions**, the remaining curriculum is divided into three equal, domain-isolated partitions:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PINIT CAREER OS TRI-BRANCH MATRIX                     │
├───────────────────────┬─────────────────────────────┬───────────────────────┤
│       BRANCH A        │          BRANCH B           │       BRANCH C        │
│   Web Full-Stack M2   │     Flagship Commerce M2    │   Python AI & Data M2 │
│      (360 Days)       │         (400 Days)          │      (360 Days)       │
├───────────────────────┼─────────────────────────────┼───────────────────────┤
│ Git: main             │ Git: agent/branch-b-curric* │ Git: agent/branch-c-* │
│ Directory:            │ Directory:                  │ Directory:            │
│ Present-Career-os     │ Present-Career-os-commerce  │ Present-Career-os-plat│
├───────────────────────┼─────────────────────────────┼───────────────────────┤
│ 12 Web Courses:       │ 13 B.Com Courses:           │ 12 Python Courses:    │
│ - cloudWeb (31-60)    │ - bcom_law (46-60) [15d]    │ - sql-mastery (31-60) │
│ - devopsWeb (31-60)   │ - bcom_acc (31-60) [30d]    │ - dsa-py (31-60)      │
│ - cyberWeb (31-60)    │ - bcom_fin (31-60) [30d]    │ - ai-py (31-60)       │
│ - distributedWeb (31) │ - bcom_tax (31-60) [30d]    │ - dist-py (31-60)     │
│ - sreWeb (31-60)      │ - bcom_aud (31-60) [30d]    │ - cloud-py (31-60)    │
│ - streamWeb (31-60)   │ - bcom_ban (31-60) [30d]    │ - nlp-py (31-60)      │
│ - aiWeb (31-60)       │ - bcom_ops (31-60) [30d]    │ - quant-py (31-60)    │
│ - aiDeployWeb (31-60) │ - bcom_ait (31-60) [30d]    │ - prompt-py (31-60)   │
│ - dsaWeb (31-60)      │ - bcom_ana (6-60)  [55d]    │ - train-py (31-60)    │
│ - fullstackJs (31-60) │ - bcom_mkt (31-60) [30d]    │ - vec-py (31-60)      │
│ - g3d (31-60)         │ - bcom_scrm (31-60)[30d]    │ - safe-py (31-60)     │
│ - designWeb (31-60)   │ - bcom_ecom (31-60)[30d]    │ - cyber-py (31-60)    │
│                       │ - bcom_dmkt (31-60)[30d]    │                       │
└───────────────────────┴─────────────────────────────┴───────────────────────┘
```

---

## 🛡️ 3. Absolute Concurrency & File Isolation Boundaries

To ensure zero merge conflicts when branches merge into `main`:
1. **Branch A File Locks**:
   - Source Files: `src/lib/data/*WebLongLessons.ts`, `src/lib/data/cloudWebLongLessons.ts`, `src/lib/data/devopsWebLongLessons.ts`, `src/lib/data/fullstackJsLongLessons.ts`, `src/lib/data/g3dLongLessons.ts`.
   - Visual Directories: `src/lib/data/lessonVisuals/{cloud, devops, cyber, dist, sre, stream, ai, aideploy, design, dsa-optim, fullstack-js, g3d}`.
   - Tests: `tests/cloud_*`, `tests/devops_*`, `tests/web_*`.

2. **Branch B File Locks**:
   - Source Files: `src/lib/data/bcom*LongLessons.ts` exclusively.
   - Visual Directories: `src/lib/data/lessonVisuals/bcom_*` exclusively.
   - Tests: `tests/bcom_*` exclusively.

3. **Branch C File Locks**:
   - Source Files: `src/lib/data/*PythonLongLessons.ts`, `src/lib/data/sqlLongLessons.ts` exclusively.
   - Visual Directories: `src/lib/data/lessonVisuals/{python, dsa-py, ai-py, dist-py, cloud-py, nlp-py, quant-py, prompt-py, train-py, vec-py, safe-py, sql-mastery}` exclusively.
   - Tests: `tests/python_*`, `tests/sql_*` exclusively.

---

## 📐 4. Universal Invariant Protocol (Zero Hallucination Mandate)

Every single day created by ANY agent on ANY branch MUST strictly adhere to:
1. **5-Part Structure**: Exactly 5 parts per day (`parts` array length = 5).
2. **Word Count Budget**:
   - Minimum **580 words per part**.
   - Minimum **3,000 words per day** (Avatar spoken lecture $\\ge 20$ minutes).
   - Paragraph structure: `say` array with $\\ge 3$ rich technical paragraphs.
3. **Deterministic Sandbox Code**:
   - Runnable snippet printing exact, bit-perfect deterministic stdout.
   - Matched verbatim in `part.output`.
   - Array of $\\ge 3$ `codeNotes`.
4. **Diagnostic Outage MCQ**:
   - `check.answer: 0` (first option is ALWAYS correct).
   - 4 distinct, plausible engineering options.
   - In-depth, architectural `explanation`.
5. **Gate v2 Visual Envelope**:
   - Saved in `src/lib/data/lessonVisuals/<course>/day-XX.json`.
   - 4 synchronized steps per part (`say1`, `say2`, `example`, `tryIt`).
   - SHA-256 `codeHash` bound directly to `part.code`.
6. **Verification & Git Operations**:
   - `npx tsx --test <test_file>` must pass 100% GREEN.
   - `npx tsc --noEmit` must report 0 errors.
   - Commit and push **day-by-day** or **block-by-block** with conventional commit messages.
   - Update `PROJECT_MEMORY.md` and `multi_agent_control.csv`.
"""

# --- 2. BRANCH_A_DIRECTIVE.md ---
branch_a_directive = """# 🎯 BRANCH A OPERATIONAL DIRECTIVE: Web Full-Stack Month 2 Masterclasses

**Assigned Worktree**: `C:\\Users\\Admin\\Desktop\\projects\\Present-Career-os`  
**Git Branch**: `main`  
**Assigned Agent**: Antigravity Primary / Orchestrator  
**Total Target Scope**: 12 Web Courses x 30 Days (Days 31–60) = **360 Days**

---

## 📋 Course Execution Roadmap:
1. **Course 1: Cloud Native AWS Architecture (`cloudWebLongLessons.ts`)** [Days 31–60: 30 Days]
   - *Master Spec*: `scripts/visuals/cloud-masterclass-spec.ts`
   - Block 7 (Days 31–35): Kubernetes on AWS (EKS), VPC CNI, Karpenter Auto-Provisioning, ALB Ingress, Istio Service Mesh.
   - Block 8 (Days 36–40): AWS Serverless EventMesh (EventBridge, SQS FIFO, Lambda SnapStart, Step Functions).
   - Block 9 (Days 41–45): Multi-Region Active-Active Architectures, DynamoDB Global Tables, Route 53 ARC.
   - Block 10 (Days 46–50): Cloud Security Engineering, KMS Envelope Encryption, AWS WAF, GuardDuty & IAM Zero Trust.
   - Block 11 (Days 51–55): Enterprise FinOps & Cost Optimization (Savings Plans, Graviton3, S3 Intelligent-Tiering).
   - Block 12 (Days 56–60): Milestone 12 Grand Capstone (Global Autonomous Cloud Enterprise Infrastructure).

2. **Course 2: DevOps, Docker & CI/CD Pipelines (`devopsWebLongLessons.ts`)** [Days 31–60: 30 Days]
   - *Master Spec*: `scripts/visuals/devops-masterclass-spec.ts`

3. **Course 3: Cybersecurity & Secure Web Engineering (`cyberWebLongLessons.ts`)** [Days 31–60: 30 Days]
4. **Course 4: Distributed Systems Architecture (`distributedWebLongLessons.ts`)** [Days 31–60: 30 Days]
5. **Course 5: Site Reliability Engineering & Multi-Cloud Observability (`sreWebLongLessons.ts`)** [Days 31–60: 30 Days]
6. **Course 6: High-Throughput Streaming in TypeScript (`streamWebLongLessons.ts`)** [Days 31–60: 30 Days]
7. **Course 7: Full-Stack AI Engineering & Large Language Models (`aiWebLongLessons.ts`)** [Days 31–60: 30 Days]
8. **Course 8: AI Deployment, Serving & MLOps (`aiDeployWebLongLessons.ts`)** [Days 31–60: 30 Days]
9. **Course 9: Advanced Data Structures & Algorithm Optimization (`dsaWebLongLessons.ts`)** [Days 31–60: 30 Days]
10. **Course 10: Full-Stack JavaScript & Node Architecture (`fullstackJsLongLessons.ts`)** [Days 31–60: 30 Days]
11. **Course 11: 3D Graphics, WebGL & Spatial Computing (`g3dLongLessons.ts`)** [Days 31–60: 30 Days]
12. **Course 12: Advanced UI/UX & Design Engineering (`designWebLongLessons.ts`)** [Days 31–60: 30 Days]

---

## 🔒 File Boundary Locks:
- ONLY modify files in `src/lib/data/*WebLongLessons.ts`, `src/lib/data/cloudWebLongLessons.ts`, etc.
- ONLY write visuals to `src/lib/data/lessonVisuals/{cloud, devops, cyber, dist, sre, stream, ai, aideploy, design, dsa-optim, fullstack-js, g3d}/`.
- DO NOT edit `bcom*` or `*Python*` files.
"""

# --- 3. BRANCH_B_DIRECTIVE.md ---
branch_b_directive = """# 🎯 BRANCH B OPERATIONAL DIRECTIVE: Flagship Commerce (B.Com) Masterclasses Month 2

**Assigned Worktree**: `C:\\Users\\Admin\\Desktop\\projects\\Present-Career-os-commerce`  
**Git Branch**: `agent/branch-b-curriculum-commerce-iot`  
**Assigned Agent**: Agent Branch B / Claude or Antigravity Session 2  
**Total Target Scope**: 13 Flagship Commerce Courses = **400 Days**

---

## 📋 Course Execution Roadmap:
1. **Course 06: Corporate Law & Governance (`bcomLawLongLessons.ts`)**
   - Current status: Days 1–45 completed in Branch C!
   - **Branch B Assignment**: Conclude Block 10 to 12 (Days 46–60: 15 Days) to reach 100% 60-day graduation!
   - Topics: Cross-Border Insolvency, SEBI ICDR Public Listings, Corporate Fraud Forensic Jurisprudence, CAE Milestone 12 Capstone.

2. **Course 01: Advanced Corporate Accounting & Ind AS/IFRS (`bcomAccountingLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Ind AS 115 (Revenue Recognition), Ind AS 116 (Lease Accounting), Business Combinations & Consolidation, Financial Instruments (Ind AS 109), Share-Based Payments, Milestone 12 Capstone.

3. **Course 02: Financial Markets & Investment Banking (`bcomFinanceLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Valuation Modeling (DCF / LBO), M&A Due Diligence, Treasury Risk Management, Derivatives Hedging, Algorithmic Trading Systems, Milestone 12 Capstone.

4. **Course 03: Direct & International Taxation (`bcomTaxLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Transfer Pricing Documentation, BEPS Action Plans, Double Tax Avoidance Agreements (DTAA), Search & Seizure Assessments, Corporate Tax Planning, Milestone 12 Capstone.

5. **Course 04: Advanced Auditing & Forensic Assurance (`bcomAudLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Digital Forensics, Fraud Investigation Protocols, Benford's Law Analytics, Big 4 Quality Reviews, Courtroom Expert Testimony, Milestone 12 Capstone.

6. **Course 05: Banking Operations & Credit Risk Management (`bcomBanLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Basel III Capital Adequacy, Asset-Liability Management (ALM), Non-Performing Asset (NPA) Workouts, Syndicate Lending, FinTech Core Banking Integrations, Milestone 12 Capstone.

7. **Course 07: Supply Chain & Lean Operations Management (`bcomOpsLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Lean Six Sigma Black Belt Protocols, ERP S/4HANA Supply Chain, Dynamic Fleet Optimization, Total Productive Maintenance (TPM), Global Freight Logistics, Milestone 12 Capstone.

8. **Course 08: AI in Accounting & FinTech Automation (`bcomAitLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Robotic Process Automation (RPA), AI Continuous Auditing, Blockchain Multi-Party Reconciliation, Machine Learning Credit Scoring, Milestone 12 Capstone.

9. **Course 09: Business Analytics & Quantitative Decision Modeling (`bcomAnaLongLessons.ts`)** [Days 6–60: 55 Days]
   - Month 1 Block 2–6 (Days 6–30) + Month 2 Block 7–12 (Days 31–60).
   - Econometric Modeling, PowerBI Executive Dashboards, Predictive Churn Modeling, Time-Series Financial Forecasting, Monte Carlo Simulation Engine.

10. **Course 10: Omni-Channel Marketing & Strategic Brand Architecture (`bcomMktLongLessons.ts`)** [Days 31–60: 30 Days]
11. **Course 11: Global Supply Chain Relationship Management (`bcomScrmLongLessons.ts`)** [Days 31–60: 30 Days]
12. **Course 12: D2C eCommerce Scaling & Marketplace Optimization (`bcomEcomLongLessons.ts`)** [Days 31–60: 30 Days]
13. **Course 13: Digital Marketing Automation & Growth Hacking (`bcomDmktLongLessons.ts`)** [Days 31–60: 30 Days]

---

## 🔒 File Boundary Locks:
- ONLY modify files in `src/lib/data/bcom*LongLessons.ts`.
- ONLY write visuals to `src/lib/data/lessonVisuals/bcom_*/`.
- Visual templates: `ledger-sheet`, `workflow`, `table`, `bars`, `funnel`, `flow`.
- DO NOT touch Web Full-Stack or Python files.
"""

# --- 4. BRANCH_C_DIRECTIVE.md ---
branch_c_directive = """# 🎯 BRANCH C OPERATIONAL DIRECTIVE: Python AI, Distributed & Quantitative Masterclasses Month 2

**Assigned Worktree**: `C:\\Users\\Admin\\Desktop\\projects\\Present-Career-os-platform`  
**Git Branch**: `agent/branch-c-platform-admin-faculty`  
**Assigned Agent**: Agent Branch C / Codex or Antigravity Session 3  
**Total Target Scope**: 12 Python / Data Courses x 30 Days (Days 31–60) = **360 Days**

---

## 📋 Course Execution Roadmap:
1. **Course 01: SQL Mastery & High-Performance Relational Databases (`sqlLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Advanced Query Optimization, B-Tree vs LSM Indexes, Window Functions, Table Partitioning, Multi-Master Replication, Milestone 12 Capstone.

2. **Course 02: Data Structures & Algorithms in Python (`dsaPythonLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Advanced Graph Algorithms (Tarjan, Edmonds-Karp), Dynamic Programming on Trees, Segment Trees, Fenwick Trees, Suffix Automata, Milestone 12 Capstone.

3. **Course 03: AI & Deep Learning Systems in Python (`aiPythonLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Attention Mechanisms, Transformer Architectures from Scratch, PyTorch DistributedDataParallel (DDP), Model Sharding (DeepSpeed ZeRO-3), Milestone 12 Capstone.

4. **Course 04: Distributed Systems Engineering in Python (`distPythonLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Raft Distributed Consensus, Vector Clocks, CRDTs, gRPC Async Streaming, Distributed Deadlock Detection, Milestone 12 Capstone.

5. **Course 05: Cloud Infrastructure & Serverless Python (`cloudPythonLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: AWS Boto3 Async Automation, Lambda Extension SDK, Step Functions Distributed Maps, S3 Event Streaming, Multi-Cloud Terraform SDK, Milestone 12 Capstone.

6. **Course 06: Natural Language Processing in Python (`nlpPythonLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Byte-Pair Encoding (BPE), FlashAttention-2, RoPE Positional Embeddings, Named Entity Recognition, Sentence Transformers, Milestone 12 Capstone.

7. **Course 07: Quantitative Finance & Algorithmic Trading (`quantPythonLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Black-Scholes PDE Solvers, Monte Carlo Portfolio Risk, High-Frequency Order Book Simulation, Kelly Criterion Sizing, Vectorized Backtesting, Milestone 12 Capstone.

8. **Course 08: Prompt Engineering & ReAct Agent Architectures (`promptPythonLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Chain-of-Thought Decomposition, Self-Consistency Prompting, LangChain / LlamaIndex Custom Tools, Autonomous Multi-Agent Consensus, Milestone 12 Capstone.

9. **Course 09: LLM Fine-Tuning & Model Alignment (`trainPythonLongLessons.ts`)** [Days 31–60: 30 Days]
   - Block 7–12: Parameter-Efficient Fine-Tuning (LoRA / QLoRA), Direct Preference Optimization (DPO), RLHF with PPO, Quantization (GPTQ / AWQ), Milestone 12 Capstone.

10. **Course 10: Vector Search, Embeddings & Semantic Retrieval (`vectorPythonLongLessons.ts`)** [Days 31–60: 30 Days]
    - Block 7–12: HNSW Graph Indexing, Product Quantization (IVF-PQ), Milvus & Qdrant Clusters, Hybrid Dense-Sparse RAG, ColBERT Late Interaction, Milestone 12 Capstone.

11. **Course 11: AI Safety, Red-Teaming & Guardrails (`safetyPythonLongLessons.ts`)** [Days 31–60: 30 Days]
    - Block 7–12: Adversarial Jailbreak Defenses, Constitutional AI Principles, Llama Guardrail Policies, Hallucination Verification, Model Watermarking, Milestone 12 Capstone.

12. **Course 12: Cybersecurity & Exploit Automation in Python (`cyberPythonLongLessons.ts`)** [Days 31–60: 30 Days]
    - Block 7–12: Scapy Packet Crafting, Protocol Fuzzing, Binary Reverse Engineering (Capstone/Keystone), Memory Exploitation Simulators, Automated SIEM Threat Hunting, Milestone 12 Capstone.

---

## 🔒 File Boundary Locks:
- ONLY modify files in `src/lib/data/*PythonLongLessons.ts` and `src/lib/data/sqlLongLessons.ts`.
- ONLY write visuals to `src/lib/data/lessonVisuals/{python, dsa-py, ai-py, dist-py, cloud-py, nlp-py, quant-py, prompt-py, train-py, vec-py, safe-py, sql-mastery}/`.
- DO NOT touch Web Full-Stack or Commerce files.
"""

# Write files to memory of agent
files_to_write = [
    (os.path.join(mem_dir, "MULTI_AGENT_3_BRANCH_CHARTER.md"), charter_content),
    (os.path.join(mem_dir, "BRANCH_A_DIRECTIVE.md"), branch_a_directive),
    (os.path.join(mem_dir, "BRANCH_B_DIRECTIVE.md"), branch_b_directive),
    (os.path.join(mem_dir, "BRANCH_C_DIRECTIVE.md"), branch_c_directive),
    # Also write local copies into worktrees
    (os.path.join(wt_a, "BRANCH_A_DIRECTIVE.md"), branch_a_directive),
    (os.path.join(wt_b, "BRANCH_B_DIRECTIVE.md"), branch_b_directive),
    (os.path.join(wt_c, "BRANCH_C_DIRECTIVE.md"), branch_c_directive),
]

for path, content in files_to_write:
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created: {path}")

# Update multi_agent_control.csv with the 3 active branch assignments
now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
date_str = datetime.now().strftime("%Y-%m-%d")
time_str = datetime.now().strftime("%H:%M:%S")

new_rows = [
    [
        "AGENT-500", date_str, time_str, "Antigravity (Branch A Lead)", "main",
        "https://github.com/Vinay-N-Kashyap/Present-Career-os/tree/main",
        "C:/Users/Admin/Desktop/projects/Present-Career-os",
        "ACTIVE (Web Full-Stack M2 - Cloud & DevOps)",
        "b6f866f6 - Course 18 iot_net Conquered",
        "src/lib/data/*WebLongLessons.ts; src/lib/data/lessonVisuals/{cloud,devops,...}",
        "None (Isolated Domain: Web Full-Stack)", ""
    ],
    [
        "AGENT-501", date_str, time_str, "Agent Branch B (Commerce Lead)", "agent/branch-b-curriculum-commerce-iot",
        "https://github.com/Vinay-N-Kashyap/Present-Career-os/tree/agent/branch-b-curriculum-commerce-iot",
        "C:/Users/Admin/Desktop/projects/Present-Career-os-commerce",
        "ACTIVE (Flagship Commerce M2 - bcom_law to bcom_dmkt)",
        "41036b7d - establish Branch B task assignment",
        "src/lib/data/bcom*LongLessons.ts; src/lib/data/lessonVisuals/bcom_*",
        "None (Isolated Domain: Flagship Commerce)", ""
    ],
    [
        "AGENT-502", date_str, time_str, "Agent Branch C (Python AI Lead)", "agent/branch-c-platform-admin-faculty",
        "https://github.com/Vinay-N-Kashyap/Present-Career-os/tree/agent/branch-c-platform-admin-faculty",
        "C:/Users/Admin/Desktop/projects/Present-Career-os-platform",
        "ACTIVE (Python AI & Data M2 - sql, dsa, ai, dist)",
        "f486e232 - complete Month 2 Block 9 Days 41-45",
        "src/lib/data/*PythonLongLessons.ts; sqlLongLessons.ts; src/lib/data/lessonVisuals/{python,...}",
        "None (Isolated Domain: Python AI & Data)", ""
    ]
]

mac_path = os.path.join(mem_dir, "multi_agent_control.csv")
with open(mac_path, "a", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    for r in new_rows:
        writer.writerow(r)

print("Updated multi_agent_control.csv with AGENT-500, AGENT-501, and AGENT-502.")
