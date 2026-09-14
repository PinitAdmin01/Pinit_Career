-- Migration: 20260913_subbatch_2_3_payment_gateways_ledgers.sql
-- Sub-Batch 2.3: Payment Gateways & Transaction Logs (Issues 038 – 042)

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
-- 1. DEFECT 041: Append-Only Fee Payments Ledger & student_fees Table with Non-Negative Balance Check
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fee_payments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  installment_id TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  fine_paid NUMERIC NOT NULL DEFAULT 0,
  receipt_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fee_payments_read_own" ON public.fee_payments;
CREATE POLICY "fee_payments_read_own" ON public.fee_payments
  FOR SELECT TO authenticated
  USING (student_id = auth.uid()::text);

DROP POLICY IF EXISTS "fee_payments_admin_all" ON public.fee_payments;
CREATE POLICY "fee_payments_admin_all" ON public.fee_payments
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.student_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  balance NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  CONSTRAINT chk_student_fees_balance CHECK (balance >= 0)
);

ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_fees_read_own" ON public.student_fees;
CREATE POLICY "student_fees_read_own" ON public.student_fees
  FOR SELECT TO authenticated
  USING (student_id = auth.uid()::text);

DROP POLICY IF EXISTS "student_fees_admin_all" ON public.student_fees;
CREATE POLICY "student_fees_admin_all" ON public.student_fees
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Atomic SQL payment processor with row-level locking
CREATE OR REPLACE FUNCTION public.process_fee_installment_payment(
  p_student_id TEXT,
  p_student_name TEXT,
  p_student_email TEXT,
  p_installment_id TEXT,
  p_transaction_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_dues_record RECORD;
  v_inst RECORD;
  v_new_installments JSONB := '[]'::jsonb;
  v_found_inst BOOLEAN := false;
  v_paid_amount NUMERIC := 0;
  v_inst_name TEXT := 'Fee installment';
  v_existing_receipt TEXT;
BEGIN
  -- 1. Lock student dues row FOR UPDATE to eliminate concurrent write races
  SELECT * INTO v_dues_record
  FROM public.finance_dues
  WHERE student_id = p_student_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'DUES_NOT_FOUND', 'message', 'No finance dues record found for student');
  END IF;

  -- 2. Traverse installments
  IF v_dues_record.installments IS NOT NULL AND jsonb_array_length(v_dues_record.installments) > 0 THEN
    FOR v_inst IN SELECT * FROM jsonb_to_recordset(v_dues_record.installments) AS x(
      id TEXT, name TEXT, amount NUMERIC, deadline TEXT, status TEXT, "paidOn" TEXT, "receiptId" TEXT
    )
    LOOP
      IF v_inst.id = p_installment_id THEN
        v_found_inst := true;
        IF v_inst.status = 'Paid' THEN
          v_existing_receipt := COALESCE(v_inst."receiptId", p_transaction_id);
          RETURN jsonb_build_object('ok', true, 'already_paid', true, 'receipt_id', v_existing_receipt);
        END IF;
        v_paid_amount := COALESCE(v_inst.amount, 0);
        v_inst_name := COALESCE(v_inst.name, 'Fee installment');
        v_new_installments := v_new_installments || jsonb_build_array(
          jsonb_build_object(
            'id', v_inst.id,
            'name', v_inst_name,
            'amount', v_paid_amount,
            'deadline', v_inst.deadline,
            'status', 'Paid',
            'paidOn', timezone('utc'::text, now())::TEXT,
            'receiptId', p_transaction_id
          )
        );
      ELSE
        v_new_installments := v_new_installments || jsonb_build_array(
          jsonb_build_object(
            'id', v_inst.id,
            'name', v_inst.name,
            'amount', v_inst.amount,
            'deadline', v_inst.deadline,
            'status', v_inst.status,
            'paidOn', v_inst."paidOn",
            'receiptId', v_inst."receiptId"
          )
        );
      END IF;
    END LOOP;
  END IF;

  IF NOT v_found_inst THEN
    RETURN jsonb_build_object('ok', false, 'error', 'INSTALLMENT_NOT_FOUND', 'message', 'Installment not found on student record');
  END IF;

  -- 3. Update finance_dues
  UPDATE public.finance_dues
  SET installments = v_new_installments,
      fine_levied = 0
  WHERE student_id = p_student_id;

  -- 4. Record into finance_transactions
  INSERT INTO public.finance_transactions (
    id, student_id, student_name, student_email, amount, fine_paid, type, timestamp
  ) VALUES (
    p_transaction_id, p_student_id, p_student_name, p_student_email, v_paid_amount, COALESCE(v_dues_record.fine_levied, 0), v_inst_name, timezone('utc'::text, now())
  );

  -- 5. Record into append-only fee_payments ledger
  INSERT INTO public.fee_payments (
    id, student_id, installment_id, amount, fine_paid, receipt_id, created_at
  ) VALUES (
    p_transaction_id, p_student_id, p_installment_id, v_paid_amount, COALESCE(v_dues_record.fine_levied, 0), p_transaction_id, timezone('utc'::text, now())
  );

  -- 6. Update student_fees balance if record exists
  UPDATE public.student_fees
  SET paid_amount = paid_amount + v_paid_amount,
      balance = GREATEST(0, balance - v_paid_amount),
      updated_at = timezone('utc'::text, now())
  WHERE student_id = p_student_id;

  RETURN jsonb_build_object('ok', true, 'receipt_id', p_transaction_id, 'amount', v_paid_amount);
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. DEFECT 038 & 042: Atomic credit_pins Stored Procedure (With Row-Level Locking)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.credit_pins(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT '',
  p_source TEXT DEFAULT 'admin_grant'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_pins INTEGER;
  v_new_balance INTEGER;
  v_tx_id TEXT;
  v_new_tx JSONB;
BEGIN
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'INVALID_AMOUNT');
  END IF;

  -- Row-level exclusive lock on target user
  SELECT pins INTO v_current_pins
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'USER_NOT_FOUND');
  END IF;

  IF v_current_pins IS NULL THEN
    v_current_pins := 120;
  END IF;

  v_new_balance := v_current_pins + p_amount;
  v_tx_id := 'tx_earn_' || floor(extract(epoch from now()) * 1000)::text || '_' || substr(md5(random()::text), 1, 6);
  v_new_tx := jsonb_build_object(
    'id', v_tx_id,
    'type', 'earn',
    'amount', p_amount,
    'reason', p_reason,
    'source', p_source,
    'timestamp', floor(extract(epoch from now()) * 1000)
  );

  UPDATE public.users
  SET pins = v_new_balance,
      pin_history = jsonb_path_query_array(
        jsonb_insert(COALESCE(pin_history, '[]'::jsonb), '{0}', v_new_tx),
        '$[0 to 99]'
      )
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'ok', true,
    'new_balance', v_new_balance,
    'tx_id', v_tx_id
  );
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. DEFECT 042: Streak Milestone Claims Table
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.streak_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  milestone INTEGER NOT NULL,
  pins_granted INTEGER NOT NULL DEFAULT 50,
  claimed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_user_milestone UNIQUE(user_id, milestone)
);

ALTER TABLE public.streak_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "streak_claims_read_own" ON public.streak_claims;
CREATE POLICY "streak_claims_read_own" ON public.streak_claims
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "streak_claims_admin_all" ON public.streak_claims;
CREATE POLICY "streak_claims_admin_all" ON public.streak_claims
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant execution privileges
GRANT EXECUTE ON FUNCTION public.process_fee_installment_payment(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.credit_pins(UUID, INTEGER, TEXT, TEXT) TO authenticated, service_role;

