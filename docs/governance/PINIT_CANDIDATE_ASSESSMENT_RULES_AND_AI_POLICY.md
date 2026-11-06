# 📋 PinitCareer Candidate Assessment Rules, Environment Controls & AI-Use Policy

> **Document Version:** 1.4.0 (Authoritative Operational & Container Hardening Standard)  
> **Associated Standard:** [`docs/PINIT_CREDENTIAL_OPERATIONS_AND_GOVERNANCE_CHARTER.md`](file:///c:/Users/vinay/OneDrive/project/Present-Career-os/docs/PINIT_CREDENTIAL_OPERATIONS_AND_GOVERNANCE_CHARTER.md)  
> **Audience:** Examination Candidates, Operations Staff, Examination Proctors, Authorized Assessors  
> **Effective Date:** September 2026  

---

## 1. 🎯 Purpose & Integrity Statement

The **PinitCareer Professional Advanced Credential** is awarded exclusively to candidates who demonstrate verified, autonomous engineering competence. 

This policy defines the operational rules, environmental controls, allowed and forbidden technical resources, and explicit generative AI usage boundaries across all assessment gates.

---

## 2. 🆔 Candidate Identity Verification Protocol

To prevent proxy test-taking, credential fraud, or impersonation, candidate identity verification is managed by **Independent Operations Staff** and decoupled from academic scoring:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TWO-STAGE IDENTITY VERIFICATION WORKFLOW                                                                         │
├────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────┤
│ Stage 1: Pre-Assessment Audit          │ Stage 2: Live Defense Ingress Check                                     │
│ (48 Hours Prior | Operations Team)     │ (15 Minutes Prior | Security Proctor)                                   │
├────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ • Valid Government-Issued Photo ID     │ • Live video and biometric face-match against verified photo ID         │
│   (Passport, National Identity Card,   │ • 360-degree camera sweep of candidate assessment workspace             │
│   or Driver's License) submitted via   │ • Secondary screen inspection (single monitor required)                 │
│   secure encrypted upload.             │ • Background audio and process monitor check                            │
│ • Candidate Identity Token generated.  │ • Candidate 256-bit anonymized ID assigned to scoring packet            │
└────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────┘
```

*Note: The evaluating assessor receives the candidate's anonymized packet (`CANDIDATE_<256-BIT-OPAQUE-TOKEN>`) to protect against unconscious demographic or institutional bias.*

---

## 3. 🖥️ Authoritative Assessment Resource & Tooling Matrix

The following matrix authoritatively dictates what software, documentation, internet access, and AI tools are permitted during each assessment gate:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ AUTHORITATIVE ASSESSMENT RESOURCE MATRIX ACROSS GATES A–E                                                         │
├──────────────────────┬─────────────┬─────────────┬─────────────┬───────────────────────────┬─────────────────────┤
│ Technical Resource   │ Gate A      │ Gate B      │ Gate C      │ Gate D                    │ Gate E              │
│                      │ (Principles)│ (Incident)  │ (Chaos)     │ (System Design)           │ (Master Viva)       │
├──────────────────────┼─────────────┼─────────────┼─────────────┼───────────────────────────┼─────────────────────┤
│ 1. Internet Access   │ 🛑 BLOCKED  │ 🟡 WHITELIST│ 🟡 WHITELIST│ 🟢 UNRESTRICTED (Research)│ 🛑 BLOCKED          │
├──────────────────────┼─────────────┼─────────────┼─────────────┼───────────────────────────┼─────────────────────┤
│ 2. Documentation     │ 🛑 None     │ 🟢 Local /  │ 🟢 Local /  │ 🟢 Public Docs & RFCs     │ 🛑 None             │
│                      │             │ Whitelisted │ Whitelisted │                           │                     │
├──────────────────────┼─────────────┼─────────────┼─────────────┼───────────────────────────┼─────────────────────┤
│ 3. IDE / Editor      │ 🛑 Whiteboard│ 🟢 VS Code /│ 🟢 VS Code /│ 🟢 Architecture Canvas /  │ 🛑 None             │
│                      │ only        │ Terminal    │ Terminal    │ Excalidraw / Text Editor  │ (Verbal dialogue)   │
├──────────────────────┼─────────────┼─────────────┼─────────────┼───────────────────────────┼─────────────────────┤
│ 4. AI Assistants     │ 🛑 ZERO     │ 🛑 ZERO     │ 🛑 ZERO     │ 🟡 SYNTAX ONLY            │ 🛑 ZERO             │
│    (LLMs, Copilot)   │ FORBIDDEN   │ FORBIDDEN   │ FORBIDDEN   │ (No architectural prompts)│ FORBIDDEN           │
├──────────────────────┼─────────────┼─────────────┼─────────────┼───────────────────────────┼─────────────────────┤
│ 5. Code Autocomplete │ N/A         │ 🟢 Basic LSP│ 🟢 Basic LSP│ 🟢 Standard Editor LSP    │ N/A                 │
│    (Language Server) │             │ (IntelliSense│(IntelliSense│                           │                     │
│    vs Generative Tab │             │ only; no AI)│ only; no AI)│                           │                     │
├──────────────────────┼─────────────┼─────────────┼─────────────┼───────────────────────────┼─────────────────────┤
│ 6. Terminal / Shell  │ 🛑 None     │ 🟢 Full Bash│ 🟢 Full Bash│ 🛑 None                   │ 🛑 None             │
│    Diagnostic Tools  │             │ (psql, curl)│ (psql, curl)│                           │                     │
├──────────────────────┼─────────────┼─────────────┼─────────────┼───────────────────────────┼─────────────────────┤
│ 7. Human Assistance  │ 🛑 ZERO     │ 🛑 ZERO     │ 🛑 ZERO     │ 🛑 ZERO                   │ 🛑 ZERO             │
│    (Second Humans)   │ FORBIDDEN   │ FORBIDDEN   │ FORBIDDEN   │ FORBIDDEN                 │ FORBIDDEN           │
└──────────────────────┴─────────────┴─────────────┴─────────────┴───────────────────────────┴─────────────────────┘
```

---

## 4. 🔬 Explicit Operational Definitions for Technical Resources

### 1. What "Whitelisted Documentation" Means (Gates B & C)
During Gates B and C, candidates troubleshoot live incidents within a sandboxed environment. Whitelisted resources are restricted to:
* **Local Offline Documentation:** Installed DevDocs or man pages (`man`, `pinfo`).
* **Official Whitelisted Vendor Docs:**
  - Official Node.js Documentation (`nodejs.org/docs`)
  - Official PostgreSQL Documentation (`postgresql.org/docs`)
  - Official Redis Documentation (`redis.io/docs`)
  - Official MDN Web Docs (`developer.mozilla.org`)
* **Prohibited:** Public search engines (Google, Bing), developer forums (Stack Overflow, Reddit), and generative AI chat interfaces.

### 2. What "Manual Diagnostic Tools" Means (Gates B & C)
Candidates have full access to standard POSIX shell utilities and language runtimes to inspect, trace, and resolve incidents:
* **Process & System Inspection:** `ps`, `top`, `htop`, `lsof`, `kill`, `killall`.
* **Network & Socket Diagnostics:** `netstat`, `ss`, `curl`, `nc`, `tcpdump`.
* **Database & Cache Clients:** `psql`, `redis-cli`.
* **Code & Runtime Utilities:** `node`, `npm`, `npx`, `git`, `diff`, `grep`, `sed`, `awk`, `jest`, `mocha`, `tsc`.
* **Prohibited:** Autonomous AI agents executing autonomous terminal commands or external code generation scripts.

### 3. What "Basic LSP Autocomplete" Means (Gates B, C & D)
* **Permitted:** Standard language server protocol features (TypeScript Language Server, Go gopls, Python pyright) providing function signatures, type annotations, auto-importing, and syntax highlighting.
* **Prohibited:** Multi-line generative tab completion (GitHub Copilot autocomplete, Cursor tab, Supermaven) that predicts or synthesizes full algorithmic blocks or unit tests.

### 4. What "Zero AI Assistance" Means (Gates A, B, C & E)
* During oral examinations (Gates A & E), candidate must maintain an un-interrupted camera stream with hands visible when requested.
* No secondary screens, no second browser windows, no smart earpieces, no automated transcription prompts, and no live LLM sparring tools.
* Violation of the Zero AI policy results in **immediate assessment termination and a 1-year suspension**.

---

## 5. 🛡️ Operational AI & Technical Environment Enforcement Mechanisms

PinitCareer enforces academic integrity through **hard container isolation, capability restriction, and network boundary controls**, recognizing that an application-layer "binary allowlist" alone is vulnerable to execution-environment abuse (e.g., executing arbitrary network sockets or child processes from inside `node`):

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MULTI-LAYERED CONTAINER & RUNTIME SECURITY BOUNDARY                                                              │
├──────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┤
│ Security Layer           │ Architectural Enforcement Mechanism                                                   │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Kernel Container      │ Isolated Linux namespaces (PID, net, mnt, ipc, user, uts). Non-root execution        │
│    Isolation             │ (`uid 10001`, `gid 10001`) with all Linux capabilities dropped (`cap-drop=ALL`).      │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 2. Filesystem Immutability│ Root filesystem mounted read-only (`ro`). Write operations strictly restricted to     │
│                          │ `/workspace/scratch` mounted with `noexec,nosuid,nodev`. `/tmp` is a bounded tmpfs.  │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 3. Seccomp-BPF Policy    │ Explicit system call filtering blocking unauthorized calls (`ptrace`, `bpf`, `chroot`,│
│                          │ raw socket creation, module loading, kernel keyring inspection).                      │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 4. Deny-by-Default Egress│ Container network namespace has zero direct internet routing. All egress packets are  │
│    & Forward Proxy       │ dropped at the virtual interface via kernel `nftables`. Egress is forced through a    │
│                          │ local forward proxy enforcing the explicit documentation allowlist with SNI checks.   │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 5. DNS-over-HTTPS (DoH)  │ Outbound UDP/TCP 53 and 853 are dropped. Direct IP egress is blocked. Known public    │
│    Sinkholing            │ DoH resolvers (Cloudflare, Google, Quad9) and AI domains are sinkholed at host firewall│
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 6. Node Runtime Boundary │ Node.js executed with `--frozen-intrinsics` and `--no-addons`. Because the network    │
│                          │ namespace lacks external routing, script socket calls fail immediately at kernel layer│
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 7. Process Watchdog      │ Continuous supervisor agent monitors process tree; unauthorized spawned child         │
│                          │ processes or memory-injection attempts trigger instant session pause and alert proctor.│
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 8. Worker Threads & IPC  │ Detection and blocking of worker threads (`worker_threads`, cluster forks) attempting │
│    Socket Interception   │ to spawn unmonitored threads or establish unauthorized inter-process communication.   │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 9. Localhost Daemon &    │ Ingress/egress filter blocks unauthorized daemons binding to `127.0.0.1` or `0.0.0.0` │
│    Reverse Proxy Defense │ to prevent local reverse proxies or bridge services from bypassing network rules.     │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 10. HTTP CONNECT Defense │ Forward proxy rejects HTTP CONNECT tunneling methods across all permitted ports,      │
│     & SNI Inspection     │ inspecting TLS SNI headers to block SSL-tunneled connections to unlisted endpoints.   │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 11. Complete IPv6        │ IPv6 is completely disabled at the kernel level (`net.ipv6.conf.all.disable_ipv6=1`)   │
│     Disablement          │ to prevent dual-stack IPv6 egress bypass routes around IPv4 firewall rules.           │
└──────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Active Network Boundary Configuration
* **Gates A & E (Oral & Viva Defenses):** Complete outbound internet block; real-time video/audio connection to the assessor panel only.
* **Gates B & C (Incident Troubleshooting & Chaos Engineering):** Network traffic routed through an egress filtering proxy enforcing the explicit documentation allowlist (`nodejs.org/docs`, `postgresql.org/docs`, `redis.io/docs`, `developer.mozilla.org`). All other domains return HTTP 403 Forbidden.
* **Gate D (System Design):** Unrestricted web search permitted for technical RFCs and documentation; however, generative conversational LLM prompts for end-to-end system architectures are prohibited and flagged via proxy pattern matching.

### 2. Authoritative Container Image Specification & Immutable Pinning (Sub-Gate C1.1)
To ensure absolute reproducibility across all candidate assessment environments and prevent tag drift:
* **Canonical Pinned Base Image Digest:**
  ```dockerfile
  FROM node:24-alpine@sha256:d9b23b3206260a9ea78be5cf62a4d04847e1ff965fb5b93d6dff61530ae9e3a6
  ```
  Mutable tags (e.g. `node:24-alpine` or `node:latest`) are strictly prohibited in assessment container production.
* **Docker Daemon Isolation & Zero Socket Mounting:** Mounting `/var/run/docker.sock` or exposing Docker/containerd management sockets inside the candidate container is **strictly prohibited**. Any attempt to mount the Docker socket is blocked at the orchestration layer and flagged as a critical security incident.
* **Minimal Toolchain Inclusion:** The image contains only the essential CLI utilities required for realistic fullstack engineering: Node.js 24, TypeScript (`tsc`), Git, PostgreSQL Client (`psql`), and cURL. Compilers (`gcc`, `clang`, `make`) and package managers beyond `npm` are excluded.

### 3. Disposable Single-Use Containers & External Host Watchdog
* **Single-Use Disposable Lifecycle:** Every candidate assessment run or behavioral security probe executes in a freshly initialized, disposable micro-container. At the conclusion of the session or upon test termination, the container is destroyed immediately; containers are never reused.
* **10-Second Hard Host Supervisor Watchdog:**
  - An independent host-level watchdog process (`timeout -k 2 10s` / Node child process supervisor) monitors every container lifecycle.
  - If a containerized process hangs, deadlocks, or attempts an escape loop, the host watchdog forcefully terminates the container via `SIGKILL` at T = 10 seconds.
  - Host supervisor monitors kernel cgroup v2 events (`pids.events` for fork bomb throttling, `memory.events` for OOM kills) outside the container's namespace.

### 4. Dual Acceptance Standard for Assessment Environments (Sub-Gates C1.1–C1.5)
An assessment environment cannot be validated merely by passing security containment checks while breaking candidate functionality. Validation requires satisfying both criteria:
1. **Positive Toolchain Verification:** Candidate must have verified, working access to required engineering tools:
   - `node --version` returns v24.x
   - `tsc --version` runs TypeScript compiler cleanly
   - `git --version` executes version control commands
   - `psql --version` confirms PostgreSQL client availability
   - `curl -s -I http://proxy.local/docs` retrieves whitelisted technical documentation
2. **Outcome-Based Behavioral Containment:** The container runtime must physically contain hostile actions:
   - Escalating privileges or executing `sudo` fails with permission denied
   - Writing to `/bin`, `/usr`, `/lib`, or root filesystem fails with read-only error (`EROFS`)
   - Creating unauthorized egress sockets to unlisted IP addresses or ports drops immediately
   - Executing recursive process fork bombs (`:(){ :|:& };:`) is strictly constrained by `pids.max=100`

---

## 6. 🔐 Candidate Assessment Data Privacy, Retention Schedule & Backup Lineage

PinitCareer implements data minimization and privacy protections designed to support global data-protection principles (e.g., GDPR / CCPA privacy frameworks; jurisdiction-specific legal compliance requires formal independent legal review):

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CANDIDATE ASSESSMENT DATA PRIVACY & RETENTION SCHEDULE                                                           │
├──────────────────────────┬──────────────────────┬────────────────────────┬───────────────────────────────────────┤
│ Data Category            │ Retention Period     │ Storage & Encryption   │ Access Authorization (RBAC)           │
├──────────────────────────┼──────────────────────┼────────────────────────┼───────────────────────────────────────┤
│ 1. Government Photo ID & │ Purged within        │ Encrypted AES-256 with │ Operations Identity Verification Team │
│    Biometric Match Data  │ 14 Calendar Days     │ ephemeral candidate DEK│ ONLY. Assessors NEVER receive access. │
│                          │ post-identity check  │ in isolated KMS vault  │                                       │
├──────────────────────────┼──────────────────────┼────────────────────────┼───────────────────────────────────────┤
│ 2. Video & Audio         │ 3 Years              │ Encrypted cold storage │ Chief Proctor, Formal Appeals Board,  │
│    Session Recordings    │ (Supports appeals)   │ (AES-256)              │ and Legal Audit Officers ONLY.        │
├──────────────────────────┼──────────────────────┼────────────────────────┼───────────────────────────────────────┤
│ 3. Terminal Shell Logs,  │ 3 Years              │ Immutable audit ledger │ Authorized Assessors, Audit Committee,│
│    Git Diffs, & Commits  │ (Supports appeals)   │ (AES-256)              │ and Appeals Review Panel.             │
├──────────────────────────┼──────────────────────┼────────────────────────┼───────────────────────────────────────┤
│ 4. Assessor Rubric Marks │ 7 Years              │ Encrypted database     │ Certification Board, Chief Assessor,  │
│    & Calibration Scores  │ (Accreditation audit)│ (AES-256)              │ and Research Psychometricians.        │
├──────────────────────────┼──────────────────────┼────────────────────────┼───────────────────────────────────────┤
│ 5. Public Credential     │ Indefinite           │ Public distributed     │ Public `/verify/[credentialId]` API.  │
│    Verification Record   │ (or until REVOKED)   │ cache / database       │ Discloses zero PII or raw exam marks. │
└──────────────────────────┴──────────────────────┴────────────────────────┴───────────────────────────────────────┘
```

### 1. Data Lineage & The 14-Day Backup Cryptographic Shredding Architecture
To solve the industry-standard backup retention flaw (where deleted records persist indefinitely in immutable backups, cold archives, and read replicas), PinitCareer enforces **Cryptographic Erasure (Crypto-Shredding)**:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DATA LINEAGE & CRYPTO-SHREDDING LIFECYCLE                                                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Step 1 (Ingress):  Candidate submits Government Photo ID & live biometric selfie.                                │
│ Step 2 (Keying):   System generates a unique, per-candidate Data Encryption Key (`DEK_CANDIDATE_<TOKEN>`).        │
│ Step 3 (Storage):  Raw image payloads are encrypted with `DEK` before writing to primary DB and backup storage.   │
│ Step 4 (Backups):  Routine automated database backups and read replicas inherit the ciphertext; keys remain in   │
│                    the centralized Hardware Security Module / KMS only.                                          │
│ Step 5 (Day 14):   Upon completion of the 14-day identity verification window, the candidate's `DEK` is          │
│                    permanently shredded and expunged from the KMS under two-person quorum authorization.          │
│ Step 6 (Result):   After verified destruction of the candidate-specific encryption key, retained ciphertext      │
│                    across all primary, secondary, replica, and cold backups is cryptographically unrecoverable   │
│                    under the stated cryptographic assumptions.                                                   │
│ Step 7 (Audit):    A cryptographic deletion verification record (`DEL_VERIF_<HASH>`) is permanently logged.      │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2. KMS Trust Boundary & Two-Person Quorum Authorization for Key Destruction
To prevent unauthorized or accidental deletion of candidate data encryption keys, and to ensure that keys cannot be unilaterally retained or destroyed by a rogue operator:
* **Two-Person Quorum Mandate:** Destruction of any candidate `DEK` requires simultaneous, cryptographically signed authorization from both the **Data Protection Officer (DPO)** and the **Academic Registrar**.
* **HSM Enforced Deletion:** Single-operator API calls attempting `kms:ScheduleKeyDeletion` or `kms:DeleteKey` are automatically blocked by KMS IAM boundary policy.
* **Deletion Audit Ledger:** The deletion operation generates an immutable deletion certificate (`DEL_VERIF_<HASH>`) signed by the KMS HSM, recording key ID, destroying principals, and hardware timestamp.

### 3. Biometric RAM-Only Non-Leakage Protocol & Zero-Persistence Architecture
To prevent any possibility of raw biometric leakage, identity theft, or permanent compromise:
* **Strict Ephemeral Ingress Processing:** Raw biometric vectors, facial embeddings, and matching landmark arrays are held exclusively in volatile RAM (`Buffer`) during active ingress matching.
* **Immediate Cryptographic Zeroing:** Immediately upon completion of identity verification, volatile memory buffers are overwritten with zeros (`Buffer.fill(0)`) and marked for garbage collection.
* **Categorical WORM Prohibition:** Direct ingestion or archiving of raw biometrics to S3 Object Lock Compliance WORM storage is strictly prohibited at the application layer (`ERR_PROHIBITED_DATA_CLASS`).
* **Multi-Vector Non-Leakage Verification:** The assessment runtime actively verifies non-presence of raw biometrics across:
  1. Application logs and structured logger payloads
  2. Distributed APM traces and telemetry spans
  3. Operating system core crash dumps (suppressed via `ulimit -c 0` and container `--no-addons`)
  4. Temporary file storage (`/tmp`, `/var/tmp`)
  5. Relational database persistence and replication streams

### 4. Role-Based Access Control (RBAC) & Double-Blind Assessment Guarantee
1. **Assessor Blindness:** Evaluating assessors receive only an anonymized candidate identifier (`CANDIDATE_<256-BIT-OPAQUE-TOKEN>`) and technical deliverables (shell logs, git diffs, architectural diagrams). Assessors **never** receive access to candidate government IDs, residential addresses, contact details, or demographic attributes.
2. **Identity Decoupling:** Identity verification is performed independently by the Operations Security Team prior to gate execution. The linkage token between legal identity and `CANDIDATE_<256-BIT-OPAQUE-TOKEN>` is encrypted and accessible only to the Registrar.

---

## 7. ♿ Accessibility & Reasonable Accommodations Standard

PinitCareer is firmly committed to universal access for qualified engineering candidates with disabilities. **Security controls must prevent unauthorized third-party or AI assistance without penalizing or treating legitimate assistive technologies as cheating.**

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ AUTHORITATIVE ACCESSIBILITY & ACCOMMODATION MATRIX                                                               │
├──────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┤
│ Accommodation Dimension  │ Operational Implementation & Security Protocol                                        │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Screen Reader Support │ Examination terminal and web interface support standard screen readers (NVDA, JAWS,  │
│    & Non-Visual Access   │ VoiceOver, Orca). Full keyboard navigation and semantic ARIA labeling mandated.       │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 2. Visual Enhancements   │ High-contrast monochrome palettes, custom font sizing, and screen magnification tools │
│                          │ permitted without triggering kiosk display-tampering flags.                           │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 3. Hearing Accommodations│ Live human CART (Communication Access Realtime Translation) or proctor-verified real- │
│                          │ time transcription provided for oral defenses (Gates A & E).                          │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 4. Motor / Input Device  │ Alternative ergonomic keyboards, switch access hardware, or approved voice-to-text    │
│    Adaptations           │ input utilities allowlisted in the kiosk profile prior to session launch.            │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 5. Extended Time Allow-  │ Candidates with documented neurodivergent or cognitive processing conditions receive  │
│    ance (1.5x / 2.0x)    │ 1.5x or 2.0x time adjustments; rubric criteria and technical depth remain unchanged.  │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 6. Medical Pauses        │ Stop-the-clock pauses permitted for blood glucose checks, medication, or physical     │
│    (Stop-the-Clock)      │ therapy without reducing allotted technical troubleshooting time.                     │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 7. Assistive Software    │ Authorized assistive software process IDs, pre-registered SHA-256 binary executable   │
│    Verification & Hash   │ hashes, and approved parent-child process tree signatures are allowlisted in the kiosk│
│    Allowlisting          │ so accessibility utilities cannot be Trojanized or replaced with unauthorized LLMs.   │
└──────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
```

### Accommodations Request Protocol
* Candidates submit documentation to the **Disability Accommodations Coordinator** at least 14 days prior to their scheduled assessment gate.
* Medical documentation is stored in an isolated, HIPAA/GDPR-compliant health record partition completely segregated from academic and certification records.
* Assessors receive zero disclosure of a candidate's accommodation status; candidates are evaluated strictly on their demonstrated technical outputs against standard rubric anchors.

---

## 8. 🚨 Candidate Incident, Outage & Interruption Standard Operating Procedure (SOP)

During live high-stakes examinations, unexpected technical, network, or proctor platform disruptions must be resolved transparently without penalizing the candidate:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CANDIDATE INCIDENT & INTERRUPTION REMEDIATION PROTOCOL                                                           │
├──────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┤
│ Incident Category        │ Operational Standard Operating Procedure (SOP)                                        │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Network Dropout       │ • Immediate "Stop-the-Clock": Assessment timer automatically freezes upon packet loss.│
│    (Candidate/Proctor)   │ • Terminal state and git working directory automatically checkpointed and hashed.    │
│                          │ • Outage < 15 min: Session resumes immediately upon reconnect; zero score penalty.    │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 2. Extended Interruption │ • If an oral viva (Gate A/E) or incident (Gate B/C) interruption exceeds 15 minutes:   │
│    (> 15 Minutes)        │ • Candidate is rescheduled within 24–48 hours at zero additional cost.                │
│                          │ • Retest uses an ALTERNATE randomized partition of the prompt/incident bank to prevent│
│                          │   unauthorized out-of-band research during the downtime. Completed gates stand.      │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 3. Hardware / Kiosk Crash│ • Candidate reboot permitted; session restored from latest verified remote snapshot.  │
│                          │ • Proctor re-authenticates identity via live video before unlocking terminal.         │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ 4. Platform Service Fault│ • If PinitCareer infrastructure fails, candidate receives immediate incident log, a  │
│                          │   formal apology, and priority re-scheduling with complimentary remediation support.  │
└──────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. ⚖️ Candidate Agreement & Violation Consequences

Prior to starting any examination gate, every candidate must digitally sign the following binding declaration:

> *"I certify that all code, designs, and answers presented during this assessment represent my own original technical work and first-principles understanding. I understand that using unauthorized AI tools, collaborating with other individuals, or attempting to compromise the examination environment will result in immediate disqualification, permanent credential revocation, and forfeiture of examination fees."*

---

## 📝 Document Change-Control & Governance Ledger

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DOCUMENT CHANGE-CONTROL & GOVERNANCE LEDGER                                                                      │
├──────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┤
│ Document Owner           │ PinitCareer Assessment Security & Operations Committee                                │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Authorized Approvers     │ Chief Proctor, Information Security Officer & Academic Registrar                      │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Current Version          │ 1.4.0 (Authoritative Operational & Container Hardening Standard)                      │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Effective Date           │ September 2026                                                                        │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Supersedes               │ Version 1.3.0 (Operational Container Hardening & Cryptographic Identity Standard)     │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Change Reason            │ Biometric RAM-Only Non-Leakage Protocol, core dump suppression, WORM prohibition,     │
│                          │ pure ASCII notation enforcement, and reproducible container toolchain validation.     │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Amendment Policy         │ Modifications require unanimous Certification Board quorum, version increment, and   │
│                          │ published impact assessment prior to cohort execution.                                │
└──────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
```
