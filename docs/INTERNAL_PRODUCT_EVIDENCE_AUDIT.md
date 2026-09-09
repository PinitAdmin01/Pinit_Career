# PinIT Career OS: Internal Product Capability & Evidence Audit

> **CONFIDENTIAL INTERNAL WORKING DOCUMENT — NOT FOR EXTERNAL DISTRIBUTION**  
> **Evaluation Date**: September 2026 | **Audited Version**: 2.0.0  
> **Purpose**: Establish verified technical and operational ground truth prior to external comparative synthesis.

---

## 1. Audit Framework & Evaluation Axes

To prevent premature claims or conflating code existence with production maturity, every capability in PinIT Career OS is audited across three orthogonal axes:

```
                          AXIS A: CAPABILITY MATURITY
  [Existence] ──► [Completeness] ──► [Production Readiness] ──► [Adoption] ──► [Measured Outcome]
   (In Repo)      (End-to-End Flow)    (Resilient & Hardened)   (Active Users)  (Statistically Proven)

                          AXIS B: EVIDENCE STRENGTH
  [Artifact/Code] ──► [Automated Test] ──► [Live Observation] ──► [Telemetry] ──► [Customer Data] ──► [Independent Evidence]

                          AXIS C: STRATEGIC SIGNIFICANCE
  [None] ──► [Useful Feature] ──► [Differentiating] ──► [Difficult to Replicate] ──► [Potential Structural Advantage]
```

### Outcome Causality Standard
* **Observed Metric**: Feature is deployed; descriptive metric recorded (e.g., "Student completed 18 quests").
* **Measured Association**: Cohort observation (e.g., "Students using daily missions maintain higher 7-day active streaks").
* **Causal Evidence**: Controlled experimental baseline proving the platform itself caused the outcome lift. *(Currently classified as `Tier E Hypothesis` across all student career outcomes pending longitudinal institutional trials).*

---

## 2. Comprehensive Subsystem Capability Inventory

```
+--------------------------------------------------------------------------------------------------------------------+
|                                    PINIT CAREER OS: GROUND-TRUTH CAPABILITY AUDIT                                  |
+--------------------------------------------------------------------------------------------------------------------+
```

### Subsystem 1: In-Browser & Server Execution Engines

| Capability | Maturity (Axis A) | Evidence (Axis B) | Strategic Significance (Axis C) | User / Buyer / Budget Owner | Verified Architectural Reality |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Python WASM Execution** | Production Readiness | Live Observation & Telemetry | Differentiating | **User**: Student<br>**Buyer**: College<br>**Budget**: IT / Lab Software | Real Pyodide WebAssembly runtime running client-side in browser. Pre-warms Pyodide in background. Zero server compute cost per Python execution. |
| **JavaScript / TypeScript Runner** | Production Readiness | Automated Test & Live Obs. | Useful Feature | **User**: Student<br>**Buyer**: College<br>**Budget**: Lab Software | Evaluates JS/TS solutions against multi-assertion test cases with strict timeout limits (4500ms). |
| **In-Memory SQLite Engine** | Completeness | Live Observation | Useful Feature | **User**: Student<br>**Buyer**: College<br>**Budget**: Lab Software | Executes SQLite queries in-browser via Pyodide virtual filesystem. Creates and populates tables in memory for SQL verification. |
| **Server-Authoritative Java Judge** | Production Readiness | Code, Live Obs. & Telemetry | Difficult to Replicate | **User**: Student<br>**Buyer**: College<br>**Budget**: Placement / Dept | Isolated server judge (`/api/code/run-java`). Enforces AST security regex (blocks `Runtime`, `ProcessBuilder`, `File`, `Socket`), executes `javac`/`java` in scratch directories, and atomically commits quest completion to Supabase via service role. Fails closed. |
| **C++ Static Syntax Checker** | Completeness | Code & Live Obs. | Useful Feature | **User**: Student<br>**Buyer**: College<br>**Budget**: Lab Software | Structural AST regex verification for method signatures and return statements. Does not run full GCC binary compilation in browser. |

---

### Subsystem 2: Neural Audio, Voice & Cognitive Soundscapes

| Capability | Maturity (Axis A) | Evidence (Axis B) | Strategic Significance (Axis C) | User / Buyer / Budget Owner | Verified Architectural Reality |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Browser Audio Cache (Tier 1)** | Production Readiness | Live Obs. & Telemetry | Difficult to Replicate | **User**: Student<br>**Buyer**: College<br>**Budget**: Placement Prep | In-browser IndexedDB key-value store keyed by `SHA256(text + voice + speed)`. Yields sub-2ms audio delivery on cache hits. |
| **FastAPI Kokoro-82M TTS (Tier 2)** | Production Readiness | Code, Live Obs. & Telemetry | Differentiating | **User**: Student<br>**Buyer**: College<br>**Budget**: IT / Cloud | Pre-warmed Kokoro-82M ONNX singleton generating 24kHz audio. Features a 9-minute keep-warm heartbeat to prevent container idling. |
| **Focus Soundscapes & Ducking** | Production Readiness | Live Obs. & Telemetry | Differentiating | **User**: Student<br>**Buyer**: College<br>**Budget**: Student Engagement | Ambient focus tracks (`pattern-hunter`, `explorer`, `social-iq`, `stabilizer`) with procedural Web Audio oscillator fallback. Precision auto-ducking drops music volume to 4% during teacher speech and ramps to 30% when silent. |
| **Persona Vocal Signatures** | Completeness | Live Obs. | Useful Feature | **User**: Student<br>**Buyer**: College<br>**Budget**: Learning Tools | 15 distinct pitch and rate configurations (e.g., Kashyap Sir: 0.88 pitch / 1.10 rate; Divya: 1.15 pitch / 1.20 rate) paired with Kokoro voice vectors. |

---

### Subsystem 3: Socratic Classroom & Course Engine

| Capability | Maturity (Axis A) | Evidence (Axis B) | Strategic Significance (Axis C) | User / Buyer / Budget Owner | Verified Architectural Reality |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **36 Master Curricula (1,080 Days)** | Production Readiness | Artifact & Code | Difficult to Replicate | **User**: Student<br>**Buyer**: College<br>**Budget**: Academic / Curriculum | 36 courses covering CS, AI, Cloud, Embedded, Web3, and Commerce. Structured into 30 daily modules per course with 3 blocks per day. |
| **5-Step Flipped Pedagogy** | Production Readiness | Live Obs. | Differentiating | **User**: Student<br>**Buyer**: College<br>**Budget**: Academic Dean | 1. Production Analogy (Stripe, Uber, Docker); 2. Line-by-line vocal walkthrough; 3. Live Monaco IDE sandbox; 4. Multi-lingual doubt resolution; 5. 5-question evaluation exam. |
| **Multi-Lingual Doubt Resolution** | Completeness | Live Obs. | Differentiating | **User**: Student<br>**Buyer**: College<br>**Budget**: Student Welfare | Resolves doubts in English and Indian languages (Hindi, Telugu, Tamil, Kannada) with strict topic locks and a 7-doubt hard reteach safety guard. |
| **Dynamic Exam Engine** | Production Readiness | Automated Test & Live Obs. | Useful Feature | **User**: Student<br>**Buyer**: College<br>**Budget**: Exam / Assessment | 3 dynamic syllabus MCQs + 2 canonical benchmark questions evaluating Big-O complexity and null-safety. |

---

### Subsystem 4: Employability, ATS & Evidence Verification

| Capability | Maturity (Axis A) | Evidence (Axis B) | Strategic Significance (Axis C) | User / Buyer / Budget Owner | Verified Architectural Reality |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Contradiction Sentinel** | Production Readiness | Code & Automated Test | Potential Structural Advantage | **User**: Student / Recruiter<br>**Buyer**: College / Recruiter<br>**Budget**: Placement / HR | Cross-references multiple documents. Preserves divergent claims under `CONFLICTING_EVIDENCE` and applies precedence: Institution-Verified (5) > Cross-Validated (4) > Third-Party (3) > Structurally Validated (2) > Self-Submitted (1). |
| **GitHub Evidence Ingestion** | Completeness | Code & Live Obs. | Difficult to Replicate | **User**: Student / Recruiter<br>**Buyer**: College / Recruiter<br>**Budget**: Placement Cell | Parses repositories with SSRF protection. Scores Architecture, Testing (Jest/Pytest), DevOps (CI/CD/Docker), Documentation, and Commit Recency. Produces evidence SHA hash. |
| **L0–L5 Competency Framework** | Completeness | Code & Artifact | Potential Structural Advantage | **User**: Student / Dean<br>**Buyer**: College<br>**Budget**: Accreditation / Academic | 6 evidence classes (`knowledge`, `application`, `debugging`, `architecture`, `production`, `defense`). Enforces anti-gaming rules requiring multiple distinct evidence families. |
| **ATS Resume Screener & Parser** | Production Readiness | Live Obs. & Telemetry | Differentiating | **User**: Student<br>**Buyer**: College<br>**Budget**: Career Services | Scores keyword density, section headers, format compliance, and factual alignment with verified Vault items. |

---

### Subsystem 5: Behavioral Readiness & AI Simulations

| Capability | Maturity (Axis A) | Evidence (Axis B) | Strategic Significance (Axis C) | User / Buyer / Budget Owner | Verified Architectural Reality |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **3D VRoid AI Interview Studio** | Production Readiness | Live Obs. & Telemetry | Difficult to Replicate | **User**: Student<br>**Buyer**: College<br>**Budget**: Placement Training | WebGL Three.js 3D avatar rendering, live Monaco coding, System Design whiteboard canvas, and 5-dimension STAR radar scoring (Logic, Systems, Comms, Solving, STAR). |
| **Crisis Management Roleplay** | Production Readiness | Code & Live Obs. | Differentiating | **User**: Student<br>**Buyer**: College<br>**Budget**: Career Services | Multi-turn decision trees featuring difficult workplace personas (blame-shifting teammate, impatient executive). Scores leadership, communication, and decision velocity. |
| **Boardroom Group Discussion Arena** | Production Readiness | Live Obs. & Telemetry | Difficult to Replicate | **User**: Student<br>**Buyer**: College<br>**Budget**: Placement Cell | 15 AI peer avatars with conflicting behavioral traits (*Proactive, Reactive, Aggressive, Silent*). Audio turn-taking engine manages interjections and generates post-session meeting minutes. |
| **Attention Span Cognitive Trainer** | Production Readiness | Live Obs. & Telemetry | Useful Feature | **User**: Student<br>**Buyer**: College<br>**Budget**: Student Welfare | 10 gamified focus exercises (Focus Fire, Reflex Rush, Pattern Forge, etc.) with difficulty scaling, accuracy leaderboards, and stamina metrics. |

---

### Subsystem 6: Campus Operations ERP & Multi-Role Governance

| Capability | Maturity (Axis A) | Evidence (Axis B) | Strategic Significance (Axis C) | User / Buyer / Budget Owner | Verified Architectural Reality |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Finance Desk & Payment Gateway** | Production Readiness | Code & Live Obs. | Differentiating | **User**: Student / Parent<br>**Buyer**: College<br>**Budget**: Finance / Accounts | Term fee installment tracking, scholarship waiver calculation, printable watermarked receipts, and Razorpay payment gateway integration. |
| **Admissions Management** | Completeness | Code & Live Obs. | Useful Feature | **User**: Student / Admin<br>**Buyer**: College<br>**Budget**: Admissions | Rank tracking, seat matrix allocation, document verification checkmarks, and admissions pipeline stages. |
| **Exams Cell & QR Hall Tickets** | Production Readiness | Code & Live Obs. | Differentiating | **User**: Student / Admin<br>**Buyer**: College<br>**Budget**: Examination Cell | Exam timetables, printable hall tickets with cryptographically signed QR stamps, GPA calculation, and audit trail logs. |
| **Hostel & Transport Logistics** | Completeness | Code & Live Obs. | Useful Feature | **User**: Student / Warden<br>**Buyer**: College<br>**Budget**: Campus Ops | Room allocation selector grids, biometric thumb entry simulation, maintenance ticketing, route mapping, and driver registers. |
| **6-Stage Procurement PO Engine** | Completeness | Code & Live Obs. | Useful Feature | **User**: Faculty / Admin<br>**Buyer**: College<br>**Budget**: Admin / Finance | Workflow stages: Requisition $\to$ Manager Approval $\to$ PO Issue $\to$ Vendor Dispatch $\to$ Delivery Ingestion $\to$ Invoice Settle. |
| **Multi-Tier Persistence Cascade** | Production Readiness | Code & Live Obs. | Difficult to Replicate | **User**: All Roles<br>**Buyer**: College<br>**Budget**: IT / Enterprise | Multi-tier failover: Node filesystem $\to$ Shared Supabase `campus_kv` $\to$ User `vault_items` $\to$ Browser `localStorage`. Ensures zero-downtime offline execution. |
| **6-Role RBAC Governance** | Production Readiness | Live Obs. & Telemetry | Potential Structural Advantage | **User**: All Personas<br>**Buyer**: College<br>**Budget**: CIO / Central Admin | Independent navigation shells, authorization policies, and dedicated portals for Student, Faculty/Teacher, Admin, Recruiter, Consultant, and Parent. |

---

## 3. Ground-Truth Deficits & Current Operational Limitations

To maintain absolute intellectual honesty during institutional due diligence, the audit notes the following current operational boundaries:

1. **Enterprise SIS Interoperability**: While supporting standard CSV exports and Supabase webhooks, native LTI 1.3 Advantage certification (Banner, Canvas SIS, PeopleSoft) is currently in architectural design rather than turnkey production deployment.
2. **Longitudinal Placement Lift Proof**: The causal mechanism connecting the Contradiction Sentinel and Evidence Vault to verified hiring rate lift requires multi-cohort institutional longitudinal studies.
3. **Core Financial Ledger Integration**: The finance console handles term installments and student payment gateways, but does not displace core enterprise general ledgers (e.g., SAP S/4HANA treasury). It serves as the student-facing sub-ledger.
4. **Local Hardware Variation**: In-browser WASM and WebGL avatar rendering require modern browsers with WebAssembly and WebGL enabled; low-end mobile devices fall back to procedural audio and simplified CSS cards.

---

## 4. The "So What?" Economic & Strategic Summary

```
+----------------------------------------------------------------------------------------------------------------------------------------+
|                                                   STRATEGIC & ECONOMIC CHAIN OF REASONING                                             |
+----------------------------------------------------------------------------------------------------------------------------------------+
| Capability              | Problem Solved            | Economic Value                 | Competitive Alternative | Strategic Moat        |
+-------------------------+---------------------------+--------------------------------+-------------------------+-----------------------+
| In-Browser WASM/SQLite  | Eliminates cloud server   | Lowers server compute cost to  | AWS Cloud Sandboxes     | High gross margins on |
| & Local Audio Cache     | compute costs for 95% of  | near-zero for student coding   | ($15–$30/user/mo        | student subscriptions |
|                         | daily practice sessions   | and audio replays              | server costs)           |                       |
+-------------------------+---------------------------+--------------------------------+-------------------------+-----------------------+
| Contradiction Sentinel  | Resumes are full of       | Provides recruiters with       | Self-reported LinkedIn  | High switching costs; |
| & Evidence Vault        | unverified, inflated, or  | verified candidate proof,      | and unverified PDF      | recruiter lock-in via |
|                         | fraudulent claims         | reducing hiring cycle time     | resumes                 | verified talent pool  |
+-------------------------+---------------------------+--------------------------------+-------------------------+-----------------------+
| Unified 6-Role Portal   | Universities pay for 5–7  | Consolidates fragmented        | Buying Canvas + Taleo + | Budget substitution;  |
| (LMS + ERP + Careers)   | disconnected platforms    | software contracts into single | ERP + LeetCode separately| single institutional  |
|                         | with high integration cost| campus subscription            | ($80–$150/student/yr)   | system of record      |
+-------------------------+---------------------------+--------------------------------+-------------------------+-----------------------+
```
