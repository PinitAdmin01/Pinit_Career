# Supabase Migration Order

## For a FRESH database (new deployment):
1. Run `PRODUCTION_CONSOLIDATED_MIGRATIONS.sql` (covers all base tables: `users`, `admissions`, `exams`, `courses`, `vault_items`, `client_telemetry`, etc.)
2. Run individual files in timestamp order (they contain post-production additions and feature schemas). All tables in consolidated migrations use `CREATE TABLE IF NOT EXISTS` to ensure idempotent re-runs.

## For an EXISTING database (production updates only):
Run only the NEW individual files not yet applied to the remote schema.

## Order of individual files (post-consolidated):
1. `20260913_subbatch_2_1_atomic_pins_and_locks.sql`
2. `20260913_subbatch_2_2_time_scholarships_analytics.sql`
3. `20260913_subbatch_2_3_payment_gateways_ledgers.sql`
4. `20260913_subbatch_2_4_feature_unlocks_grace.sql`
5. `20260913_subbatch_2_5_xp_progression_caps.sql`
6. `20260914_add_performance_indexes.sql`
7. `20260914_payroll_runs.sql`            ← NEW (Friend 1 Task 1.7)
8. `20260915_campus_erp_core.sql`
9. `20260915_finance_dues_and_scholarships.sql`
10. `20260914_interview_sessions.sql`     ← NEW (Friend 3 Task 3.2: Interview persistence & get_pin_balance RPC)
11. `20260916_create_recruiter_activity_logs.sql`

## Tables that exist in BOTH consolidated AND individual files:
Run consolidated first — individual files strictly utilize `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, and `CREATE OR REPLACE FUNCTION`, making sequential re-runs safe and non-destructive.
