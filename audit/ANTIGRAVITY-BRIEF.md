# Brief for Antigravity — verify schema assumptions against the live database

**Read this whole file before doing anything. Do not skim.**

You are executing a task that was designed by another agent (Claude) who has
already audited this codebase. That analysis is finished and correct as far as it
goes. Your job is **not** to redesign anything. Your job is to check one specific
class of assumption against reality and fix what does not match.

You have more tokens than the agent who wrote this. Use them on **thoroughness
and verification**, not on redesigning the approach.

---

## 1. The one-sentence job

> Several functions read and write Supabase tables using column names that
> **nobody has ever verified exist**. Find out which of those column names are
> wrong, and fix them.

That is the whole task. Everything below is detail to help you do it correctly.

---

## 2. Why this matters (read this, it explains the failure mode)

This application has a specific, recurring bug pattern. Understanding it is the
difference between doing this task well and doing it uselessly.

**The pattern:** code queries a database column that does not exist. Supabase
does not crash — it returns `undefined` for that field. The calling code has
`|| 0` or `?? null` fallbacks everywhere. So the UI renders **zeros and empty
lists**, and looks like a working feature with no data in it.

Nobody sees an error. Nobody sees red text. The page just quietly lies.

A concrete example already fixed in this repo: the app called
`getNotifications('guest_cmkt7d3t2')` against a `uuid` column. Postgres returned
`400 Bad Request` three times on every anonymous page load. It had been doing
that for a long time and nobody noticed, because the code caught the error and
carried on.

**Therefore:** "the page loads without an error" is **NOT** proof that anything
works. Do not report success on that basis. You must compare actual column names
against expected column names, character by character.

---

## 2b. ALREADY VERIFIED — results from a live probe run before you started

The author of this brief ran a read-only probe against the live database after
writing sections 4–8. **These results supersede any prediction below.** Do not
spend tokens re-deriving them, but DO re-confirm them cheaply as a sanity check
that your own script works.

### The probe technique is confirmed to work

`select(column).limit(0)` reliably distinguishes the three cases. **The error
codes are not the ones commonly assumed:**

| Situation | Actual code returned |
|---|---|
| Column does not exist | `42703` — *"column users.x does not exist"* |
| Table does not exist | **`PGRST205`** — not `PGRST204`, not `42P01` |
| Table exists, no read permission | **`42501`** — *"permission denied for table"* |

**`42501` is the case most likely to be mishandled.** It means the table EXISTS
and your key simply cannot read it. Treating it as "missing" would be wrong and
would produce a false report. Handle all three codes distinctly.

### Findings already established

| Question | Answer | Consequence |
|---|---|---|
| `notifications.is_read` — correct name? | **YES, `is_read` exists.** `read`, `isRead`, `read_at`, `seen` all do not. | The code is right. No change needed. The brief predicted this was the most likely bug — that prediction was **wrong**. |
| `attention_span_progress` exists? | **YES** (returns `42501`, not `PGRST205`) | Migration was applied. |
| `avatar_memory` exists? | **YES** (returns `42501`) | Migration was applied. |
| `users` readable with anon key? | **NO — returns 0 rows** (RLS) | See blocker below. |

## 2c. BLOCKER — read this before writing any code

**`SUPABASE_SERVICE_ROLE_KEY` is EMPTY in `.env`.** The variable name is present;
the value is a zero-length string. A `grep` for the name finds it and looks fine,
which is exactly how this was missed the first time.

Consequence: with only the anon key, row-level security returns **zero rows**
from `users`. That makes the single highest-risk check in this brief — the
distinct values of `users.role` — **impossible to perform.**

**Do not work around this.** Do not fabricate a role distribution, do not infer
it from code, and do not report the task complete without it.

What to do:

1. Ask the owner for the service role key from the Supabase dashboard
   (Project Settings → API → `service_role`, marked secret).
2. They should put it in `.env` locally **and** confirm it is set in the Vercel
   dashboard.
3. Until then, run everything you *can* with the anon key (column existence
   works fine — PostgREST validates the select list before RLS filters rows) and
   report the role check as **BLOCKED**, not as passed.

### Five other environment variables are also empty

Names only — do not print values:

```
SUPABASE_SERVICE_ROLE_KEY   RAZORPAY_KEY_ID   RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID GITHUB_TOKEN      GITHUB_WEBHOOK_SECRET
```

This is a **local `.env`** finding. It does **not** prove the same is true in
Vercel, where variables are set in the dashboard. Report it; do not assume it.

If they are also empty in Vercel, then `payment/create-order`, `github/ingest`,
`gd/history` and `code/run-java` cannot work regardless of hosting — the secrets
they need do not exist. Flag this for the owner to check.

## 3. What is already true — do not re-verify these

These were checked. They pass. Do not spend tokens on them.

| Check | Command | Current result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | **0 errors** |
| Unit tests | `npm run audit:test` | **82 passing** |
| API contract audit | `npm run audit` | **13 broken** (10 need a server) |
| Header/CSP audit | `npm run audit:headers` | 3 findings, 1 broken |
| Production build | `npm run build` | **succeeds** |

If any of these change to a worse number after your work, **you broke something.
Stop and revert.** These are your regression guards. Run them before you start
and after you finish, and compare.

---

## 4. The exact assumptions to verify

Below is every table and column the unverified code touches. This list was
extracted mechanically from the source, not from memory.

**Critical context:** `users`, `notifications`, `applications` and
`opportunities` have **no migration file anywhere in this repository**. They
exist only in the live Supabase database. There is no schema file to check
against. This is precisely why the assumptions are unverified and why this task
exists.

### 4.1 `users` — read by `src/lib/university/analytics.ts`

Query used: `supabase.from('users').select('*').eq('role', 'student')`

Columns the code then reads off each row:

```
id                      role                    display_name
register_number         ats_score               trust_score
career_dna_score        recruiter_visibility    missions_completed
xp_total                career_readiness        certifications
vault_count             weak_areas
```

Two things to check here, not one:

1. **Do these columns exist?**
2. **Does `role` actually contain the literal string `'student'`?** If the value
   is `Student`, `STUDENT`, or if students have `role = null`, then
   `.eq('role','student')` returns **zero rows** and the entire university
   dashboard shows zeros. Check the distinct values of `role`.

### 4.2 `college_cohorts` and `student_cohort_enrollments`

```
college_cohorts:              id, college_name, department, batch_year
student_cohort_enrollments:   cohort_id, student_id
```

These DO have a migration:
`supabase/migrations/20260822_phase2_phase3_ecosystem.sql`. Verify the live
database actually matches that migration — migrations in a repo are not proof
they were applied.

Also report **how many rows** are in `student_cohort_enrollments`. If it is
zero, the department breakdown on the dashboard will be empty. **That is correct
behaviour, not a bug** — the code deliberately returns an empty list plus an
explanatory note rather than inventing departments. Do not "fix" it.

### 4.3 `ats_skill_gaps`

```
student_id, competency_id
```

Migration: `supabase/migrations/20260822_phase2_phase3_ecosystem.sql`.

If empty, the code falls back to aggregating `users.weak_areas`. Verify
`weak_areas` exists and note whether it is an array or a string — the code
assumes **array**.

### 4.4 `notifications` — `src/lib/supabaseService.ts`

```
id, user_id, is_read, created_at
```

`is_read` is the one to check hardest. If the real column is `read`, `isRead`,
`read_at` or `seen`, then marking a notification read **silently does nothing**.
The update returns success because Supabase does not error on an update that
matches zero rows.

### 4.4b `users.role` is also a SECURITY gate — widen the check

`src/lib/server/requireAuth.ts` reads `users.role` and compares it against:

```js
PRIVILEGED_FACULTY_ROLES = new Set(['admin', 'superadmin', 'teacher', 'faculty'])
```

This gate decides who may verify a student's portfolio credentials. If the live
`role` values do not match these strings exactly, one of two things is true and
both matter:

- No value matches → **no faculty member can ever verify anything** (fails closed,
  safe but broken)
- Values differ in case only → depends on the comparison, and must be checked

`users` is read by nine files, not the four listed in section 5. If `role` turns
out to be wrong, report it — **do not** fix it across nine files unprompted.

### 4.5 `applications` and `opportunities` — `getApplicationsForUser`

**Correction to any plan that says otherwise:** `getApplicationsForUser` is
defined in **`src/lib/supabaseService.ts` (line ~781)**, NOT in
`src/lib/api/client.ts`. client.ts only calls it. Edit supabaseService.ts.

```
applications:    id, user_id, opportunity_id, status, applied_at,
                 updated_at, cover_letter

opportunities:   id, title, description, required_skills, stipend_min,
                 stipend_max, duration_weeks, location_type, deadline,
                 status, org_name   (code falls back to `company` if
                                     `org_name` is absent)
```

### 4.6 `attention_span_progress` and `avatar_memory`

```
attention_span_progress:  user_id, display_name, total_accuracy,
                          daily_logs, monthly_summaries, updated_at

avatar_memory:            user_id, persona, memories,
                          relationship_state, updated_at
```

Migrations exist:
- `supabase/migrations/20260909_create_attention_span.sql`
- `supabase/migrations/20260909_create_avatar_memory.sql`

**These may or may not have been applied.** A previous session claimed they were
run in the Supabase SQL editor. Verify rather than trust. If the tables are
absent, the code returns `{ ok: false, error: 'TABLE_MISSING' }` and degrades
quietly — which again **looks like a working feature that just never saves**.

---

## 5. How to do it — exact steps

### Step 0 — Record the baseline

Run these four and **write the numbers down**. You will compare against them at
the end.

```bash
npx tsc --noEmit
npm run audit:test
npm run audit
npm run audit:headers
```

### Step 1 — Write the verification script

Create a **new file** at `audit/verify-schema.mjs`. Do not modify any existing
file in this step.

It must:

1. Read `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` from `.env`
   (the file is in the project root and is gitignored — do **not** commit it, do
   **not** print the key values to the console, do **not** paste them into any
   report).
2. For each table listed in section 4, run a query that returns **at most one
   row**, and read `Object.keys(row)` to get the real column list.
3. If a table is empty, a `select('*').limit(1)` returns `[]` and gives you no
   column names. In that case, query one expected column at a time
   (`select('column_name').limit(0)`) — Supabase returns a **specific error**
   naming the column if it does not exist. That distinguishes "table is empty"
   from "column is missing". **This distinction is the entire point of the task.
   Do not skip it.**
4. Print, per table: `EXISTS / MISSING`, row count, columns found, **expected
   columns that are missing**, and columns present that the code does not use
   (informational only).
5. Additionally print the **distinct values of `users.role`** and their counts.
6. Exit with code `1` if any expected column is missing, `0` if all present.

Use `@supabase/supabase-js`, which is already a dependency. Use the service role
key so row-level security does not hide rows from you.

**This script must be read-only. `SELECT` only. No `INSERT`, `UPDATE`, `DELETE`,
`ALTER`, `DROP`, `TRUNCATE`. Not even on a test row. This runs against the
production database.**

### Step 2 — Run it and read the output carefully

```bash
node audit/verify-schema.mjs
```

Do not summarise it as "it worked". Read every line.

### Step 3 — Fix only genuine mismatches

For each **missing** column, decide which case it is:

| Case | What you see | What to do |
|---|---|---|
| **A. Wrong name** | Code wants `is_read`, DB has `read` | Change the code to the real column name. Cheapest, safest fix. |
| **B. Column genuinely absent** | Neither name exists anywhere | Do **not** invent a migration to add it. Make the code degrade honestly — return empty/null and a stated reason. Report it. |
| **C. Table absent** | Table itself missing | If a migration for it exists in `supabase/migrations/`, report that it needs applying. **Do not apply it yourself.** |
| **D. Type mismatch** | `weak_areas` is `text`, code expects array | Handle both shapes defensively in the code. Report it. |

For case A, the files to edit are exactly:
- `src/lib/university/analytics.ts`
- `src/lib/supabaseService.ts`
- `src/lib/attention/progress.ts`
- `src/lib/avatar/memoryStore.ts`

### Step 4 — Prove the fix

After every change:

```bash
npx tsc --noEmit          # must stay 0 errors
npm run audit:test        # must stay 82 passing
npm run audit             # broken count must NOT rise above 13
node audit/verify-schema.mjs   # must now exit 0
npm run build             # must succeed
```

If `npm run audit:test` drops below 82, you changed behaviour the tests pin
down. Read the failing assertion — the test names describe the intended
behaviour in plain English.

---

## 6. Hard rules — violating any of these makes the work worse than not doing it

1. **Never run a write query against the database.** Read-only. Always.
2. **Never print, log, commit or paste the contents of `.env`.** It contains a
   service role key with full database access. Reference variable *names* only.
3. **Do not touch `next.config.js` or `firebase.json`.** Their CSP was carefully
   fixed — a wrong edit there silently breaks the 3D avatar and the audio worker.
   They are out of scope.
4. **Do not "fix" the 10 endpoints listed as needing a server.** They require
   secrets the browser must never hold (Razorpay signing, the exam HMAC key,
   Groq/OpenRouter keys). Moving them client-side would be a security hole, not a
   fix.
5. **Do not delete or modify anything under `src/app/_legacy/`.** It is dead code
   and the audit already ignores it. Leave it.
6. **Do not add a migration for a missing column without being asked.** Report
   it and stop. Schema changes are the owner's decision.
7. **Do not reformat, reorganise or "clean up" files you are editing.** Change
   only the lines that are wrong. A large diff hides the real change.
8. **If empty results are the correct answer, say so.** Zero cohort enrolments
   means an empty department chart, and that is intended. Do not manufacture data
   to make a chart look populated. Inventing plausible-looking numbers is the
   original sin this entire audit exists to undo.

---

## 7. What to report back

Give a table, not prose:

| Table | Exists | Rows | Missing columns | Action taken |
|---|---|---|---|---|
| users | ✅ | 412 | none | none |
| notifications | ✅ | 1,203 | `is_read` (real name: `read`) | renamed in supabaseService.ts:761 |
| avatar_memory | ❌ | — | — | migration not applied — needs owner |

Then state plainly:

- The distinct values of `users.role` and their counts
- Whether `.eq('role','student')` returns any rows at all
- Every file you changed and why, one line each
- The before/after numbers for all five checks in Step 4
- Anything you found that this brief did not anticipate

**If you found nothing wrong, say so clearly.** "All 9 tables and every expected
column exist" is a valuable, complete result. Do not invent work to look busy.

---

## 8. The most likely outcome, so you know what to expect

Best guess from the agent who wrote this brief, stated as a prediction you should
test rather than assume:

- `users` exists with most columns present. **`role` values are the highest risk**
  — if they are not exactly `'student'`, the whole dashboard reads zero.
- `notifications.is_read` is the single most likely wrong column name.
- `attention_span_progress` and `avatar_memory` probably exist (a previous
  session says the migrations were run) but **verify, do not trust**.
- `student_cohort_enrollments` is probably **empty**, which is fine and expected.
- `applications` and `opportunities` are the least examined and could differ most.

If reality contradicts these predictions, **reality is right**. Report what you
actually found. The agent who wrote this brief has been wrong six times during
this audit — every single time, checking against the real code or the real system
is what caught it. Do the same.
