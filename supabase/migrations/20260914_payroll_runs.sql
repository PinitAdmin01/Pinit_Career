-- Migration: 20260914_payroll_runs.sql
-- Table to ensure idempotent HR payroll execution and prevent double-runs per calendar month

CREATE TABLE IF NOT EXISTS payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_key text NOT NULL UNIQUE,  -- e.g. '2026-09'
  run_at timestamptz NOT NULL DEFAULT now()
);

-- RLS Policy: Only service role and staff/admin can access
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on payroll_runs"
  ON payroll_runs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
