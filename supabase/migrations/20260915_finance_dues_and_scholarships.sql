-- Migration: 20260915_finance_dues_and_scholarships.sql
-- Sub-Batch 2.7: Relational Student Fee Dues, Installments & Applied Scholarships Schema

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
-- 1. student_fee_dues: Authoritative aggregate student dues ledger
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_fee_dues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL UNIQUE,
  total_term_fees NUMERIC NOT NULL DEFAULT 65000,
  scholarship_waiver NUMERIC NOT NULL DEFAULT 0,
  fine_levied NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. fee_installments: Normalized installment breakdown per student
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fee_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  installment_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  deadline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  paid_on TIMESTAMPTZ,
  receipt_id TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_student_installment UNIQUE (student_id, installment_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. applied_scholarships: Academic cycle scholarship awards
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applied_scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  scholarship_id TEXT NOT NULL,
  academic_cycle TEXT NOT NULL DEFAULT '2026-2027',
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'APPLIED',
  applied_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_student_applied_scholarship_cycle UNIQUE (student_id, academic_cycle)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Row Level Security & Indexes
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.student_fee_dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applied_scholarships ENABLE ROW LEVEL SECURITY;

-- student_fee_dues policies
DROP POLICY IF EXISTS "student_fee_dues_read_own" ON public.student_fee_dues;
CREATE POLICY "student_fee_dues_read_own" ON public.student_fee_dues
  FOR SELECT TO authenticated
  USING (student_id = auth.uid()::text);

DROP POLICY IF EXISTS "student_fee_dues_service_all" ON public.student_fee_dues;
CREATE POLICY "student_fee_dues_service_all" ON public.student_fee_dues
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- fee_installments policies
DROP POLICY IF EXISTS "fee_installments_read_own" ON public.fee_installments;
CREATE POLICY "fee_installments_read_own" ON public.fee_installments
  FOR SELECT TO authenticated
  USING (student_id = auth.uid()::text);

DROP POLICY IF EXISTS "fee_installments_service_all" ON public.fee_installments;
CREATE POLICY "fee_installments_service_all" ON public.fee_installments
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- applied_scholarships policies
DROP POLICY IF EXISTS "applied_scholarships_read_own" ON public.applied_scholarships;
CREATE POLICY "applied_scholarships_read_own" ON public.applied_scholarships
  FOR SELECT TO authenticated
  USING (student_id = auth.uid()::text);

DROP POLICY IF EXISTS "applied_scholarships_service_all" ON public.applied_scholarships;
CREATE POLICY "applied_scholarships_service_all" ON public.applied_scholarships
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_fee_installments_student ON public.fee_installments(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_installments_status ON public.fee_installments(status);
CREATE INDEX IF NOT EXISTS idx_applied_scholarships_student ON public.applied_scholarships(student_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Stored Procedure: apply_student_scholarship_relational with Row Locking
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.apply_student_scholarship_relational(
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
  v_inst RECORD;
  v_remaining_waiver NUMERIC := p_amount;
  v_deduction NUMERIC;
BEGIN
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'INVALID_AMOUNT', 'message', 'Scholarship amount must be positive');
  END IF;

  -- 1. Check if scholarship was already applied for this student in this academic cycle
  SELECT id INTO v_existing_id
  FROM public.applied_scholarships
  WHERE student_id = p_student_id AND academic_cycle = p_academic_cycle
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ALREADY_APPLIED', 'already_applied', true, 'message', 'Scholarship already applied for this academic cycle');
  END IF;

  -- 2. Lock student_fee_dues row FOR UPDATE
  SELECT * INTO v_dues_record
  FROM public.student_fee_dues
  WHERE student_id = p_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.student_fee_dues (student_id, total_term_fees, scholarship_waiver, fine_levied)
    VALUES (p_student_id, 65000, 0, 0)
    RETURNING * INTO v_dues_record;
  END IF;

  IF v_dues_record.scholarship_waiver > 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ALREADY_APPLIED', 'already_applied', true, 'waiver', v_dues_record.scholarship_waiver, 'message', 'Scholarship waiver already applied to student dues');
  END IF;

  -- 3. Record in applied_scholarships table
  INSERT INTO public.applied_scholarships (student_id, scholarship_id, academic_cycle, amount, status, applied_at)
  VALUES (p_student_id, p_scholarship_id, p_academic_cycle, p_amount, 'APPLIED', timezone('utc'::text, now()));

  -- 4. Update student_fee_dues
  UPDATE public.student_fee_dues
  SET scholarship_waiver = p_amount,
      updated_at = timezone('utc'::text, now())
  WHERE student_id = p_student_id;

  -- 5. Deduct from pending installments with FOR UPDATE row locks
  FOR v_inst IN
    SELECT id, amount
    FROM public.fee_installments
    WHERE student_id = p_student_id AND status != 'Paid'
    ORDER BY deadline ASC
    FOR UPDATE
  LOOP
    IF v_remaining_waiver > 0 THEN
      v_deduction := LEAST(v_inst.amount, v_remaining_waiver);
      v_remaining_waiver := v_remaining_waiver - v_deduction;

      UPDATE public.fee_installments
      SET amount = amount - v_deduction,
          updated_at = timezone('utc'::text, now())
      WHERE id = v_inst.id;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'waiver', p_amount, 'academic_cycle', p_academic_cycle);
END;
$$;

GRANT EXECUTE ON FUNCTION public.apply_student_scholarship_relational(TEXT, TEXT, NUMERIC, TEXT) TO authenticated, service_role;
