-- Migration: 20260913_subbatch_2_2_time_scholarships_analytics.sql
-- Sub-Batch 2.2: Time Integrity, Scholarships & Financial Analytics (Issues 033 – 037)

-- Safe schema and role check for testing environments (PGlite / Supabase)
CREATE SCHEMA IF NOT EXISTS auth;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN;
  END IF;
END;
$$;

-- auth.uid() belongs to Supabase and must never be redefined in a migration. The version that
-- used to be here read request.jwt.claim.sub, which Supabase no longer sets, so every
-- "own row" rule saw no logged-in user. Test databases get auth.uid() from tests/helpers/db.ts.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. DEFECT 033: Daily 1:00 AM Pin Reset Database Schema & RPC
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS last_pin_reset TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

CREATE OR REPLACE FUNCTION public.perform_daily_pin_reset()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INT := 0;
BEGIN
  WITH updated AS (
    UPDATE public.users
    SET pins = 120,
        last_pin_reset = timezone('utc'::text, now())
    WHERE pins < 120
    RETURNING id
  )
  SELECT COUNT(*) INTO v_count FROM updated;

  RETURN jsonb_build_object(
    'ok', true,
    'reset_count', v_count,
    'timestamp', timezone('utc'::text, now())
  );
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. DEFECT 035: Scholarships Table with Unique Academic Cycle Constraint & Stored Procedure
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  scholarship_id TEXT NOT NULL,
  academic_cycle TEXT NOT NULL DEFAULT '2026-2027',
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DISBURSED',
  disbursed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_student_scholarship_cycle UNIQUE (student_id, academic_cycle)
);

ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scholarships_read_own" ON public.scholarships;
CREATE POLICY "scholarships_read_own" ON public.scholarships
  FOR SELECT TO authenticated
  USING (student_id = auth.uid()::text);

DROP POLICY IF EXISTS "scholarships_admin_all" ON public.scholarships;
CREATE POLICY "scholarships_admin_all" ON public.scholarships
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.apply_student_scholarship(
  p_student_id TEXT,
  p_scholarship_id TEXT,
  p_amount NUMERIC,
  p_academic_cycle TEXT DEFAULT '2026-2027'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_existing_id UUID;
  v_dues_record RECORD;
  v_new_installments JSONB := '[]'::jsonb;
  v_inst RECORD;
  v_remaining_waiver NUMERIC := p_amount;
  v_curr_amount NUMERIC;
  v_deduction NUMERIC;
BEGIN
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'INVALID_AMOUNT', 'message', 'Scholarship amount must be positive');
  END IF;

  -- 1. Check existing scholarship in scholarships table
  SELECT id INTO v_existing_id
  FROM public.scholarships
  WHERE student_id = p_student_id AND academic_cycle = p_academic_cycle
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ALREADY_APPLIED', 'already_applied', true, 'message', 'Scholarship already disbursed for this academic cycle');
  END IF;

  -- 2. Lock finance_dues row FOR UPDATE to serialize concurrent mutations
  SELECT * INTO v_dues_record
  FROM public.finance_dues
  WHERE student_id = p_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'DUES_NOT_FOUND', 'message', 'No finance dues record found for student');
  END IF;

  IF v_dues_record.scholarship_waiver IS NOT NULL AND v_dues_record.scholarship_waiver > 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ALREADY_APPLIED', 'already_applied', true, 'waiver', v_dues_record.scholarship_waiver, 'message', 'Scholarship waiver already applied to student dues');
  END IF;

  -- 3. Calculate updated installments deducting from pending amounts
  IF v_dues_record.installments IS NOT NULL AND jsonb_array_length(v_dues_record.installments) > 0 THEN
    FOR v_inst IN SELECT * FROM jsonb_to_recordset(v_dues_record.installments) AS x(
      id TEXT, name TEXT, amount NUMERIC, deadline TEXT, status TEXT, paidOn TEXT, receiptId TEXT
    )
    LOOP
      IF v_inst.status = 'Paid' OR v_remaining_waiver <= 0 THEN
        v_new_installments := v_new_installments || jsonb_build_array(to_jsonb(v_inst));
      ELSE
        v_curr_amount := COALESCE(v_inst.amount, 0);
        v_deduction := LEAST(v_curr_amount, v_remaining_waiver);
        v_remaining_waiver := v_remaining_waiver - v_deduction;
        v_inst.amount := v_curr_amount - v_deduction;
        v_new_installments := v_new_installments || jsonb_build_array(to_jsonb(v_inst));
      END IF;
    END LOOP;
  ELSE
    v_new_installments := '[]'::jsonb;
  END IF;

  -- 4. Record disbursement in scholarships table (enforced by UNIQUE constraint)
  INSERT INTO public.scholarships (student_id, scholarship_id, academic_cycle, amount, status, disbursed_at)
  VALUES (p_student_id, p_scholarship_id, p_academic_cycle, p_amount, 'DISBURSED', timezone('utc'::text, now()));

  -- 5. Update finance_dues atomically
  UPDATE public.finance_dues
  SET scholarship_waiver = p_amount,
      installments = v_new_installments
  WHERE student_id = p_student_id;

  RETURN jsonb_build_object('ok', true, 'waiver', p_amount, 'academic_cycle', p_academic_cycle);
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. DEFECT 036: Finance Dashboard SQL Aggregations (O(1) Memory Engine)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_finance_dashboard_aggregates()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_collected NUMERIC := 0;
  v_fines NUMERIC := 0;
  v_total_dues NUMERIC := 0;
  v_total_waivers NUMERIC := 0;
  v_outstanding NUMERIC := 0;
  v_tx_count BIGINT := 0;
BEGIN
  -- Aggregate transactions directly in DB using SQL SUM/COUNT without loading rows into server memory
  SELECT 
    COALESCE(SUM(amount), 0),
    COALESCE(SUM(fine_paid), 0),
    COUNT(*)
  INTO v_collected, v_fines, v_tx_count
  FROM public.finance_transactions;

  -- Aggregate total dues and waivers
  SELECT
    COALESCE(SUM(total_term_fees), 0),
    COALESCE(SUM(scholarship_waiver), 0)
  INTO v_total_dues, v_total_waivers
  FROM public.finance_dues;

  v_outstanding := GREATEST(0, (v_total_dues - v_total_waivers) - v_collected);

  RETURN jsonb_build_object(
    'collected', v_collected + v_fines,
    'fines_collected', v_fines,
    'projected', v_collected + v_fines,
    'dues_outstanding', v_outstanding,
    'transaction_count', v_tx_count
  );
END;
$$;

-- Grant execution privileges
GRANT EXECUTE ON FUNCTION public.perform_daily_pin_reset() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.apply_student_scholarship(TEXT, TEXT, NUMERIC, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_finance_dashboard_aggregates() TO authenticated, service_role;
