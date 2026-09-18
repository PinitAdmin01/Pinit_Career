-- supabase/migrations/20260913_subbatch_2_1_atomic_pins_and_locks.sql
-- Sub-Batch 2.1: Atomic Pin Deductions & Distributed Concurrency Mutex Locks

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

-- 1. Distributed Payment Idempotency & Lock Table (Defect 029)
CREATE TABLE IF NOT EXISTS public.payment_idempotency_keys (
    key TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    locked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    expires_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.payment_idempotency_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage payment idempotency keys" ON public.payment_idempotency_keys;
CREATE POLICY "Service role can manage payment idempotency keys" ON public.payment_idempotency_keys
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read own payment locks" ON public.payment_idempotency_keys;
CREATE POLICY "Authenticated users can read own payment locks" ON public.payment_idempotency_keys
    FOR SELECT TO authenticated USING (user_id = auth.uid()::text);

-- 2. PostgreSQL Atomic spend_pins RPC Function (Defect 028)
CREATE OR REPLACE FUNCTION public.spend_pins(
    p_user_id UUID,
    p_amount INTEGER,
    p_reason TEXT DEFAULT ''
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

    -- Row-level exclusive lock on the target user
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

    IF v_current_pins < p_amount THEN
        RETURN jsonb_build_object(
            'ok', false,
            'reason', 'INSUFFICIENT_PINS',
            'current_balance', v_current_pins
        );
    END IF;

    v_new_balance := v_current_pins - p_amount;
    v_tx_id := 'tx_' || floor(extract(epoch from now()) * 1000)::text || '_' || substr(md5(random()::text), 1, 6);
    v_new_tx := jsonb_build_object(
        'id', v_tx_id,
        'type', 'spend',
        'amount', p_amount,
        'reason', p_reason,
        'timestamp', floor(extract(epoch from now()) * 1000)
    );

    UPDATE public.users
    SET pins = v_new_balance,
        pin_history = (
            SELECT jsonb_agg(elem)
            FROM (
                SELECT v_new_tx AS elem
                UNION ALL
                SELECT elem FROM jsonb_array_elements(COALESCE(pin_history, '[]'::jsonb)) AS elem
                LIMIT 100
            ) s
        )
    WHERE id = p_user_id;

    RETURN jsonb_build_object('ok', true, 'new_balance', v_new_balance);
END;
$$;

-- Grant execution to authenticated users and service_role
GRANT EXECUTE ON FUNCTION public.spend_pins(UUID, INTEGER, TEXT) TO authenticated, service_role;
