# Document 08 — Security and Exclusions Audit

**Workspace Root**: `<repo-root>` (`Present-Career-os`)  
**Inspection Date**: 2026-11-13T12:30:00+05:30  
**Verification Method**: Automated Static Regular-Expression Content Scanner & Path Whitelist Auditor  
**Audit Status**: **Zero Secrets Detected in Staged Documents — Sanitized Paths Enforced**  

---

## 1. Database Boundaries & Schema Authority

Source files:
- Production Schema: [`supabase/schema.sql`](file:///./supabase/schema.sql) & [`supabase/migrations/`](file:///./supabase/migrations/) (70+ migration files).
- Educational Lab Schema: [`prisma/schema.prisma`](file:///./prisma/schema.prisma).
- Client SQL Sandbox: [`src/lib/code/runners/sqlRunner.ts`](file:///./src/lib/code/runners/sqlRunner.ts) (`@electric-sql/pglite`).
- Legacy Firebase Scaffold: [`src/lib/firebase.ts`](file:///./src/lib/firebase.ts).

### A. Authoritative Production Boundary (Supabase PostgreSQL)
- **Role**: All persistent platform operations (student enrollment, course progress, quest verification, grading ledgers, payment transactions, and exam proctoring) operate exclusively against Supabase PostgreSQL.
- **Security Invariant**: Enforces strict PostgreSQL Row Level Security (RLS) policies. Direct mutations from unauthenticated client contexts are blocked.
- **Contract Source of Truth**: Generated TypeScript types in `src/types/database.ts` (>5,000 lines).
- **CRITICAL DESTRUCTIVE SQL WARNING (`supabase/schema.sql`)**:
  Lines 4–15 of `supabase/schema.sql` contain unconditional `DROP TABLE IF EXISTS public.<table_name> CASCADE;` for 11 core production tables:
  ```sql
  drop table if exists public.users cascade;
  drop table if exists public.vault_items cascade;
  drop table if exists public.missions cascade;
  drop table if exists public.opportunities cascade;
  drop table if exists public.jobs cascade;
  drop table if exists public.applications cascade;
  drop table if exists public.notifications cascade;
  drop table if exists public.interview_sessions cascade;
  drop table if exists public.sessions cascade;
  drop table if exists public.audit_logs cascade;
  drop table if exists public.qr_login_sessions cascade;
  ```
  **Operational Rule**: `supabase/schema.sql` is strictly a bootstrapping template for brand-new, empty databases. **Executing this file against any live, staging, or production database will result in total data destruction.**
- **Sole Authoritative Migration Mechanism**: All live database migrations must strictly use the chronological scripts in [`supabase/migrations/`](file:///./supabase/migrations/).

### B. Educational Lab Boundary (Prisma Lab)
- **Role**: `prisma/schema.prisma` defines models mapped strictly to `prisma_lab_customers`, `prisma_lab_orders`, and `prisma_lab_order_items`.
- **Scope**: Used exclusively in educational backend lab exercises (`server/prisma_lab/real_prisma_server_lab.js`) where students practice writing Prisma queries. It contains no student records or live platform data.

### C. Client-Side In-Browser SQL Runner (PGlite)
- **Role**: Pure WebAssembly embedded PostgreSQL running inside the student's browser sandbox via `@electric-sql/pglite`.
- **Scope**: All student-written SQL queries in interactive lessons execute entirely in browser memory or local IndexedDB, with zero connection to the production Supabase database.

### D. Dormant Legacy Firebase Scaffold
- **Role**: [`src/lib/firebase.ts`](file:///./src/lib/firebase.ts) contains legacy Firebase initialization.
- **Audit Verification**: A full-text grep across the codebase proves there are **0 active consumers** in `src/`. All identity, authentication, and database calls route through Supabase.

---

## 2. Staging Exclusion Boundaries

To protect confidential infrastructure, prevent data leakage into AI models, and keep payload sizes manageable, the following path exclusions are enforced:

### A. Secret & Credential Exclusions (Zero Tolerance)
- `.env`, `.env.local`, `.env.production`, `.env.*`
- Firebase service account keys (`serviceAccountKey.json`, `firebase-admin-*.json`)
- Private cryptographic keys (`*.pem`, `*.key`, `id_rsa`)
- Supabase service role secrets and database passwords
- Biometric face databases (`src/lib/data/face_biometrics_db.json`)

### B. Heavy Build & Binary Artifacts (Payload Control)
- `node_modules/` (~600 MB)
- `.next/` (~450 MB)
- `public/pyodide/` (~120 MB WebAssembly wheels)
- `public/draco/`, `raw_avatars_source/` (3D models, audio buffers)
- `graphify-out/graph.json` (**32.36 MB raw AST graph**)

---

## 3. Evidence-Based Content Inspection of `CLOUD/` Documents

An automated heuristic content scanner was executed across all generated documents in [`CLOUD/`](file:///./CLOUD):

```python
# Evaluated Heuristic Signature Patterns:
PATTERNS = {
  'OpenAI / Anthropic API Key': r'\b(?:sk-[a-zA-Z0-9_-]{20,})\b',
  'GitHub Personal Access Token': r'\b(?:ghp_[a-zA-Z0-9]{20,}|gho_[a-zA-Z0-9]{20,})\b',
  'AWS Access Key': r'\b(?:AKIA[0-9A-Z]{16})\b',
  'Database Connection String': r'(?:postgres|postgresql|mysql|mongodb|redis):\/\/[^\s]+',
  'Supabase Service Key': r'\beyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b',
  'Private Key Header': r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
  'Generic Secret Assignment': r'(?:password|secret|api_key|apikey|private_key)\s*[:=]\s*[\'\"][^\'\"]{8,}[\'\"]',
  'Local User Path Leak': r'(?:[a-zA-Z]:[\\\/]Users[\\\/][a-zA-Z0-9_-]+)'
}
```

### Scan Execution Output:
```
Scanning 10 documents in CLOUD/ for sensitive patterns and local paths...
Content Inspection Result: 0 sensitive tokens, secrets, or local user paths detected across all CLOUD documents.
```

**Masking Policy**:  
In the event that future scans encounter matched tokens, matches will be masked (e.g. `sk-ab***9xYz`), and raw credentials will never be printed in logs or reports.

---

## 4. Disclosure of Residual Risks (No "Zero-Risk" Claim)

While the regex scanner detected zero secret matches across the staged documents, **absolute zero risk cannot be claimed in software security**. The following residual risks are acknowledged:
1. **Domain-Specific or Obfuscated Secrets**: Non-standard tokens, salted hashes, or proprietary internal API keys that do not follow recognized vendor entropy patterns might evade static regex signatures.
2. **Mock PII in Educational Tests**: Test fixtures (such as mock student names, test emails like `student@example.com`, or synthetic grading records) are present in test suites and must not be confused with real personal data.
3. **Environment Variable Propagation**: If scratch scripts inadvertently print runtime environment configurations, credentials could be exposed in log streams. Strict non-execution of external scripts is required.
