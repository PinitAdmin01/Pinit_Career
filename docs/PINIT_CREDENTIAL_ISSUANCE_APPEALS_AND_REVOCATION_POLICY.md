# ⚖️ PinitCareer Credential Issuance, Appeals & Revocation Policy

> **Document Version:** 1.2.0 (Authoritative Operational Standard)  
> **Associated Standard:** [`docs/PINIT_CREDENTIAL_OPERATIONS_AND_GOVERNANCE_CHARTER.md`](file:///c:/Users/vinay/OneDrive/project/Present-Career-os/docs/PINIT_CREDENTIAL_OPERATIONS_AND_GOVERNANCE_CHARTER.md)  
> **Audience:** Certification Board, Operations Staff, Academic Appeal Committee, Candidate Engineers  
> **Effective Date:** September 2026  

---

## 1. 🎯 Purpose & Legal/Operational Basis

The **PinitCareer Professional Advanced Credential** is a legally protected, cryptographically verified microcredential. 

This policy establishes the strict criteria governing initial credential issuance, privacy-preserving public verification, formal academic appeals, retake restrictions, and post-award revocation procedures.

---

## 2. 📜 Credential Issuance Prerequisites

No credential may be minted, signed, or published until the candidate fulfills all five mandatory conditions:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ MANDATORY CREDENTIAL ISSUANCE PREREQUISITES                                                                      │
├─────┬──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────┤
│ No. │ Prerequisite                 │ Operational Verification Gate                                               │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 01  │ Curriculum Completion        │ 120 / 120 Days, 360 Blocks, and 240 Quests verified in candidate ledger.    │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 02  │ Independent Assessor Scoring │ Gates A through E scored $\ge 8.5 / 10.0$ by calibrated independent assessors.│
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 03  │ Zero Critical Failures       │ Verified zero Critical Failure Tripwires across all practical evaluations.  │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 04  │ Identity Ingress Check       │ Valid government photo ID verified and matched via live biometric check.    │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 05  │ Assessor Signature & Audit   │ Assessor signed evaluation token (`SIG_ED25519`) locked in immutable audit. │
└─────┴──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 🌐 Privacy-Preserving Public Verification Endpoint (`/verify/[credentialId]`)

PinitCareer provides an authoritative, publicly accessible verification endpoint to allow employers and institutions to authenticate credentials instantly without administrative overhead:
`https://pinitcareer.com/verify/[credentialId]`

### 1. High-Entropy, Non-Sequential Identifiers
To prevent automated enumeration attacks and credential harvesting, all Credential IDs must be **cryptographically generated UUIDv4 strings** (RFC 4122 / RFC 9562 compliant, containing 122 pseudo-random bits with fixed version and variant bits, formatted as `pc-cred-4f9b8c2d-7e1a-42c8-9d3f-58e612a94bc7`). Sequential integers, predictable serial numbers, or candidate-derived hashes are strictly prohibited.

### 2. Privacy-by-Design Data Minimization
The public verification API strictly adheres to the principle of data minimization, disclosing **only the information necessary to verify engineering competence**:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DATA DISCLOSURE MATRIX FOR PUBLIC VERIFICATION API                                                               │
├──────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────┤
│ 🟢 PUBLICLY DISCLOSED DATA               │ 🛑 STRICTLY CONFIDENTIAL & REDACTED (NEVER EXPOSED)                   │
├──────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
│ • Credential Status (ACTIVE, REVOKED)    │ • Government ID numbers (Passport, SSN, Tax ID)                      │
│ • Candidate Full Legal Name              │ • Full Date of Birth / Age / National Origin                          │
│ • Credential Title & Specialization      │ • Residential Address, Personal Email, or Phone Number                │
│ • Issuance Date & Review / Renewal Date  │ • Assessment Video Recordings & Audio Streams                         │
│ • Curriculum Baseline Version (v1.0.0)   │ • Raw Internal Assessor Comments & Debate Transcripts                 │
│ • Verified Competency Dimensions         │ • Individual Numerical Gate Scores (Only Pass Status Disclosed)       │
│ • Ed25519 Cryptographic Verification Sig │ • Employer-Confidential Work Samples & Internal Git Repositories      │
│ • Key Identifier (`kid`)                 │ • Internal Curriculum Construction Metrics (120/120, 25/25 gates)     │
│ • Immutable Assessment Snapshot Hash     │ • Candidate Accommodations / Medical Partition Information            │
└──────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Permanent Credential Metric Exclusion Invariant:**
> Under no circumstances shall curriculum construction tallies (`120/120 days complete`, `25/25 technical gates passed`) or cohort psychometric parameters (`ICC ≥ 0.75`) appear on candidate credentials. The credential attests strictly to the candidate's personal demonstration of engineering competence across Gates A–E before calibrated independent assessors.

### 3. Public JSON Payload Specification (`GET /api/verify/[credentialId]`)

```json
{
  "credentialId": "pc-cred-4f9b8c2d-7e1a-42c8-9d3f-58e612a94bc7",
  "status": "ACTIVE",
  "candidateName": "Alexander M. Rivera",
  "credentialTitle": "PinitCareer Professional Advanced Credential — Full-Stack Software Engineering",
  "curriculumSpecification": "v1.0.0 (120 Instructional Days / 24-Month Master Progression)",
  "temporalMetadata": {
    "issuedAt": "2026-09-15T00:00:00Z",
    "effectiveAt": "2026-09-15T00:00:00Z",
    "expiresAt": "2029-09-15T00:00:00Z",
    "reviewStartedAt": null,
    "reviewResolvedAt": null,
    "supersededAt": null,
    "revokedAt": null
  },
  "statusHistory": [
    { "status": "ACTIVE", "timestamp": "2026-09-15T00:00:00Z", "reason": "Initial Credential Award" }
  ],
  "competencyDomains": [
    "Systems Architecture & POSIX Process Mechanics",
    "High-Scale Distributed Consensus & PACELC Trade-Offs",
    "PostgreSQL 18.6 & pgvector Vector Storage Engineering",
    "RFC 9700 OAuth, RLS Multi-Tenancy & Cryptographic Security",
    "Concurrent Chaos Resilience & Disaster Recovery"
  ],
  "assessmentSnapshot": {
    "taskSetId": "TASK_SET_2026_Q3_B7",
    "rubricVersion": "v1.2.0",
    "containerImageHash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "policyVersion": "v1.2.0",
    "assessorIds": ["ASSESSOR_SENIOR_44", "ASSESSOR_SENIOR_12"],
    "snapshotHash": "sha256:7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b"
  },
  "verificationAuthority": {
    "issuer": "PinitCareer Certification Board",
    "assessorCohort": "CALIBRATED_EXTERNAL_SENIOR_PANEL_2026",
    "kid": "pinit-root-2026-q3",
    "canonicalizationAlgorithm": "RFC-8785-JCS",
    "signatureAlgorithm": "Ed25519",
    "cryptographicSignature": "4kZ2j7X...Base64URL_Ed25519_Sig..."
  }
}
```

### 4. Cryptographic Signature, Canonicalization & Key Lifecycle Protocol

1. **RFC 8785 JSON Canonicalization (JCS):** Before cryptographic signing, the credential JSON payload (with `cryptographicSignature` omitted) is canonicalized via RFC 8785 (JCS) to eliminate whitespace variability, ensure deterministic key ordering, and lock numeric representations.
2. **Ed25519 Digital Signing:** The resulting UTF-8 bytes are signed using the PinitCareer Certification Board's private Ed25519 signing key. The 64-byte binary signature is encoded as an unpadded **Base64URL** string (`[A-Za-z0-9_-]`).
3. **Public Key Discovery Endpoint (`/.well-known/pinitcareer-keys.json`):** Employers and verifiers authenticate signatures by querying the public JWK Set:
   ```json
   {
     "keys": [
       {
         "kty": "OKP",
         "crv": "Ed25519",
         "kid": "pinit-root-2026-q3",
         "x": "O2A48ogcQ2e5Eb3e3Wn0qW_mvOJem2nxo3A7750slDE",
         "status": "active",
         "validNotBefore": "2026-09-01T00:00:00Z",
         "validNotAfter": "2027-09-01T00:00:00Z"
       },
       {
         "kty": "OKP",
         "crv": "Ed25519",
         "kid": "pinit-root-2025-q3",
         "x": "V8mK10d9B3...retired_pub_key",
         "status": "retired",
         "validNotBefore": "2025-09-01T00:00:00Z",
         "validNotAfter": "2026-09-01T00:00:00Z"
       }
     ]
   }
   ```
4. **Key Rotation vs Key Compromise Disaster Recovery & Binding SLAs:**

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CRYPTOGRAPHIC KEY LIFECYCLE & INCIDENT SLA MATRIX                                                                │
├──────────────────────────┬──────────────────────┬────────────────────────────────────────────────────────────────┤
│ Incident / Event Tier    │ Response SLA         │ Operational Enforcement & Remediation Procedure                │
├──────────────────────────┼──────────────────────┼────────────────────────────────────────────────────────────────┤
│ SEV-1: Active Signing    │ Key Revoked: ≤ 1 Hr  │ • Public key status updated to `revoked` in discovery JWKS.    │
│ Key Suspected Compromise │ New Key Mints: ≤ 4 Hr│ • Verifiers enforce `Cache-Control: no-cache, must-revalidate`.│
│                          │ Batch Re-sign: ≤ 48 Hr│ • Emergency key pair (`pinit-emergency-2026`) activated.       │
│                          │                      │ • Automated batch re-signing & notifications dispatched.       │
├──────────────────────────┼──────────────────────┼────────────────────────────────────────────────────────────────┤
│ SEV-2: Annual Scheduled  │ 30-Day Overlap Cycle │ • Incoming key set to `active`; outgoing key set to `retired`. │
│ Key Rotation             │ Zero Service Outage  │ • Historical credentials signed under retired keys remain      │
│                          │                      │   permanently verifiable against the retired JWKS entry.       │
└──────────────────────────┴──────────────────────┴────────────────────────────────────────────────────────────────┘
```

5. **Point-in-Time Historical Verification (`?asOf=TIMESTAMP`):**
   * Employers querying historical validity (e.g. `GET /api/verify/[credentialId]?asOf=2028-05-14T00:00:00Z`) receive the exact state of the credential at that point in time, evaluated by replaying the chronological `statusHistory` ledger up to the `asOf` cutoff.

---

## 4. 🔄 Credential Lifecycle & State-Transition Matrix

A credential exists in one of six mutually exclusive lifecycle states. All state transitions must adhere strictly to the following state-transition matrix:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ FORMAL CREDENTIAL STATE-TRANSITION MATRIX                                                                                            │
├───────────────┬────────────────────────────┬───────────────────────────────────┬─────────────────────┬──────────────────┬────────────┤
│ Current State │ Allowed Next States        │ Trigger Event / Condition         │ Authorized Entity   │ Public API State │ Reversible │
├───────────────┼────────────────────────────┼───────────────────────────────────┼─────────────────────┼──────────────────┼────────────┤
│ 🟢 ACTIVE     │ • UNDER_REVIEW             │ Academic appeal or audit filed    │ Registrar / Board   │ Returns ACTIVE   │ N/A        │
│               │ • EXPIRED                  │ 3-year term reached without exam  │ Automated System    │ Returns EXPIRED  │ Yes (Exam) │
│               │ • SUPERSEDED               │ Candidate earns higher tier cert  │ Certification Board │ Returns SUPERSEDED│ No        │
│               │ • REVOKED                  │ Direct academic fraud substantiated│ Certification Board │ Returns REVOKED  │ No (Final) │
├───────────────┼────────────────────────────┼───────────────────────────────────┼─────────────────────┼──────────────────┼────────────┤
│ 🟡 UNDER_     │ • ACTIVE                   │ Appeal dismissed / audit cleared  │ Appeal Committee    │ Returns ACTIVE   │ Yes        │
│    REVIEW     │ • SUSPENDED                │ Formal ethics inquiry opened      │ Certification Board │ Returns SUSPENDED│ Yes        │
│               │ • REVOKED                  │ Uncontested evidence of fraud     │ Certification Board │ Returns REVOKED  │ No (Final) │
├───────────────┼────────────────────────────┼───────────────────────────────────┼─────────────────────┼──────────────────┼────────────┤
│ 🟠 SUSPENDED  │ • ACTIVE                   │ Investigation exonerates candidate│ Certification Board │ Returns ACTIVE   │ Yes        │
│               │ • REVOKED                  │ Ethics violation substantiated    │ Certification Board │ Returns REVOKED  │ No (Final) │
├───────────────┼────────────────────────────┼───────────────────────────────────┼─────────────────────┼──────────────────┼────────────┤
│ ⚪ EXPIRED    │ • ACTIVE                   │ Candidate completes re-attestation│ Chief Assessor      │ Returns ACTIVE   │ Yes        │
│               │ • SUPERSEDED               │ Candidate upgrades to higher cert │ Certification Board │ Returns SUPERSEDED│ No        │
├───────────────┼────────────────────────────┼───────────────────────────────────┼─────────────────────┼──────────────────┼────────────┤
│ 🔵 SUPERSEDED │ (Terminal State)           │ Replaced by higher specialization │ Historical Record   │ Returns SUPERSEDED│ No        │
├───────────────┼────────────────────────────┼───────────────────────────────────┼─────────────────────┼──────────────────┼────────────┤
│ 🔴 REVOKED    │ (Terminal State)           │ Final revocation for ethics breach │ Certification Board │ Returns REVOKED  │ No (Final) │
└───────────────┴────────────────────────────┴───────────────────────────────────┴─────────────────────┴──────────────────┴────────────┘
```

### Machine-Enforced State Machine Invariants
The credential verification engine programmatically validates state transitions and rejects illegal modifications with HTTP 409 Conflict:
1. **`REVOKED` is Strictly Terminal:** Any transition out of `REVOKED` (`REVOKED -> ACTIVE`, `REVOKED -> UNDER_REVIEW`, `REVOKED -> EXPIRED`) is **HARD-FORBIDDEN**. Once revoked, a credential ID can never be un-revoked.
2. **`SUPERSEDED` is Strictly Terminal:** A superseded credential cannot be reactivated; it permanently points to the successor credential ID.
3. **`EXPIRED -> ACTIVE` Requires Documented Re-Attestation:** Direct state modification without an accompanying re-attestation examination audit record (`STATUS_REATT_PASS_<UUID>`) is rejected by database constraints.
4. **Transition Audit Preservation:** Every valid transition appends to the immutable `statusHistory` array with UTC timestamp, authorizing actor, and verifiable rationale.

---

## 5. ⏳ Retake Cooldown & Remediation Policy

To prevent "brute-force" repeat examination attempts and ensure genuine learning:

1. **Mandatory 30-Day Cooldown:** A candidate who fails any gate (score $< 8.5$ or Critical Failure) must observe a **mandatory 30-calendar-day cooldown period** before re-attempting the gate.
2. **Supervised Remediation Practicum:** During the cooldown, the candidate must complete a targeted Socratic remediation module addressing the specific failure dimensions identified in the assessor audit.
3. **Maximum Annual Attempts:** A candidate is permitted a maximum of **two (2) examination attempts per gate within any 12-month rolling window**.
4. **Independent Reroll:** Re-examinations must utilize a freshly randomized question set and a different independent assessor panel.

---

## 6. ⚖️ Formal Academic Appeal Procedure & Binding Operational SLAs

Every candidate has the legal right to a fair, objective appeal of an adverse assessment determination:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ THREE-STAGE FORMAL APPEAL WORKFLOW & BINDING OPERATIONAL SLAs                                                    │
├──────────────────────────────────────┬───────────────────────────────────┬───────────────────────────────────────┤
│ Stage 1: Notice & Acknowledgment     │ Stage 2: Procedural Screening     │ Stage 3: Independent Re-Audit & Final │
│ SLA: ≤ 2 Business Days               │ SLA: ≤ 5 Business Days            │ SLA: ≤ 15 Business Days               │
├──────────────────────────────────────┼───────────────────────────────────┼───────────────────────────────────────┤
│ Candidate submits written petition.  │ Senior Lead Assessor reviews      │ Independent Senior Assessor (no prior │
│ Registrar logs appeal, locks status  │ petition for eligibility, records │ contact) performs blind re-audit of   │
│ to `UNDER_REVIEW`, and dispatches    │ technical evidence, and verifies  │ video, logs, and git diffs. Panel     │
│ formal receipt within 2 days.        │ procedural basis within 5 days.   │ issues binding written ruling (≤15d). │
└──────────────────────────────────────┴───────────────────────────────────┴───────────────────────────────────────┘
```

*Note: Disagreeing with an assessor's subjective professional judgment is not valid grounds for an appeal. Appeals must establish specific procedural error, factual error in code execution, or platform disruption.*

---

## 7. 🚫 Credential Revocation Protocol & Due Process

PinitCareer maintains an active commitment to credential integrity and will revoke credentials when warranted:

### 1. Grounds for Revocation
* Substantiated identity impersonation (someone else completed the assessment).
* Proven plagiary or submission of uncredited third-party code.
* Intentional security breach or distribution of proprietary examination prompts.
* Post-award conviction of major professional fraud or computer crime.

### 2. Revocation Due Process
1. **Notice of Investigation:** The credential holder is provided written notice and evidence of the alleged violation.
2. **Right to Respond:** The holder has 14 days to submit a written response and defense evidence.
3. **Independent Review Panel:** A 3-member panel of the Certification Board reviews the evidence.
4. **Public Registry Invalidation:** Upon a unanimous revocation determination, the credential status on `/verify/[credentialId]` is immediately updated to `REVOKED` with the revocation date and non-confidential cause (e.g. "Breach of Academic Integrity Standards").

---

## 📝 Document Change-Control & Governance Ledger

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DOCUMENT CHANGE-CONTROL & GOVERNANCE LEDGER                                                                      │
├──────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┤
│ Document Owner           │ PinitCareer Certification Board & Registrar                                           │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Authorized Approvers     │ Chief Executive Officer, Chief Cryptographer & Academic Registrar                     │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Current Version          │ 1.2.0 (Operational Governance Hardened Release)                                       │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Effective Date           │ September 2026                                                                        │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Supersedes               │ Version 1.1.0 (Hardened Pre-Pilot Release)                                            │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Change Reason            │ Machine-enforced state machine invariants, SEV-1 key compromise SLAs, immutable       │
│                          │ assessment snapshot hash, and binding appeals operational timelines.                 │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Amendment Policy         │ Modifications require unanimous Certification Board quorum, version increment, and   │
│                          │ published impact assessment prior to cohort execution.                                │
└──────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
```
