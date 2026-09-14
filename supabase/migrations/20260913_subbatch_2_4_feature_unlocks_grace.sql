-- Migration: 20260913_subbatch_2_4_feature_unlocks_grace.sql
-- Sub-Batch 2.4: Feature Unlocks & Grace Periods (Issues 043 – 047)

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

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pins INTEGER DEFAULT 120,
  pin_history JSONB DEFAULT '[]'::jsonb,
  unlocked_items JSONB DEFAULT '{}'::jsonb
);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS unlocked_items JSONB DEFAULT '{}'::jsonb;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. DEFECT 044: Emergency Feature Grace Claims Table & Atomic Procedure
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.feature_grace_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_key TEXT NOT NULL,
  cycle_id TEXT NOT NULL,
  new_expires_at BIGINT NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.feature_grace_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feature_grace_claims_read_own" ON public.feature_grace_claims;
CREATE POLICY "feature_grace_claims_read_own" ON public.feature_grace_claims
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "feature_grace_claims_admin_all" ON public.feature_grace_claims;
CREATE POLICY "feature_grace_claims_admin_all" ON public.feature_grace_claims
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Atomic Stored Procedure: apply_feature_grace_extension
CREATE OR REPLACE FUNCTION public.apply_feature_grace_extension(
  p_user_id UUID,
  p_item_key TEXT,
  p_minutes INTEGER DEFAULT 15
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_unlocked JSONB;
  v_expires_val JSONB;
  v_expires_at BIGINT;
  v_cycle_id TEXT;
  v_clamped_minutes INTEGER;
  v_now_ms BIGINT;
  v_new_expires_at BIGINT;
  v_claim_exists BOOLEAN;
BEGIN
  -- Row-level lock on the user to prevent concurrent race condition on grace claims
  SELECT unlocked_items INTO v_unlocked
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'USER_NOT_FOUND');
  END IF;

  v_unlocked := COALESCE(v_unlocked, '{}'::jsonb);
  v_expires_val := v_unlocked -> p_item_key;

  IF v_expires_val IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'ITEM_NOT_ACTIVE');
  END IF;

  v_expires_at := (v_expires_val)::text::BIGINT;
  v_now_ms := (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT;

  -- Disallow grace extension if item expired more than 5 minutes (300,000 ms) ago
  IF v_expires_at < (v_now_ms - 300000) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'ITEM_EXPIRED_WINDOW_CLOSED');
  END IF;

  -- Check if grace was already claimed for this active unlock window
  SELECT EXISTS (
    SELECT 1 FROM public.feature_grace_claims
    WHERE user_id = p_user_id
      AND item_key = p_item_key
      AND new_expires_at >= v_expires_at
  ) INTO v_claim_exists;

  IF v_claim_exists THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'GRACE_ALREADY_CLAIMED');
  END IF;

  -- Clamp grace duration strictly between 5 and 15 minutes
  v_clamped_minutes := LEAST(15, GREATEST(5, COALESCE(p_minutes, 15)));
  v_new_expires_at := GREATEST(v_expires_at, v_now_ms) + (v_clamped_minutes * 60 * 1000)::BIGINT;
  v_cycle_id := 'cycle_' || v_new_expires_at::text;

  -- Record claim audit row
  INSERT INTO public.feature_grace_claims (user_id, item_key, cycle_id, new_expires_at, granted_at)
  VALUES (p_user_id, p_item_key, v_cycle_id, v_new_expires_at, now());

  -- Atomically update user's unlocked_items
  UPDATE public.users
  SET unlocked_items = jsonb_set(v_unlocked, ARRAY[p_item_key], to_jsonb(v_new_expires_at))
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'ok', true,
    'new_expires_at', v_new_expires_at,
    'minutes_granted', v_clamped_minutes
  );
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. DEFECT 046: AI Minutes Purchases Ledger & Daily Cap Procedure
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_minutes_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  minutes INTEGER NOT NULL DEFAULT 30,
  cost_pins INTEGER NOT NULL DEFAULT 100,
  purchased_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.ai_minutes_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_minutes_purchases_read_own" ON public.ai_minutes_purchases;
CREATE POLICY "ai_minutes_purchases_read_own" ON public.ai_minutes_purchases
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "ai_minutes_purchases_admin_all" ON public.ai_minutes_purchases;
CREATE POLICY "ai_minutes_purchases_admin_all" ON public.ai_minutes_purchases
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Atomic Stored Procedure: purchase_ai_minutes
CREATE OR REPLACE FUNCTION public.purchase_ai_minutes(
  p_user_id UUID,
  p_cost INTEGER DEFAULT 100,
  p_minutes INTEGER DEFAULT 30
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today_count INTEGER;
  v_pins INTEGER;
  v_new_balance INTEGER;
  v_history JSONB;
  v_tx_id TEXT;
  v_tx_record JSONB;
  v_cost INTEGER := COALESCE(p_cost, 100);
  v_minutes INTEGER := COALESCE(p_minutes, 30);
BEGIN
  -- 1. Check daily purchase count (strict maximum 2 purchases / 60 minutes per UTC calendar day)
  SELECT COUNT(*) INTO v_today_count
  FROM public.ai_minutes_purchases
  WHERE user_id = p_user_id
    AND purchased_at >= CURRENT_DATE;

  IF v_today_count >= 2 THEN
    RETURN jsonb_build_object(
      'ok', false,
      'reason', 'DAILY_AI_MINUTES_LIMIT_EXCEEDED',
      'purchases_today', v_today_count,
      'max_allowed', 2
    );
  END IF;

  -- 2. Lock user row and verify pins balance
  SELECT pins, COALESCE(pin_history, '[]'::jsonb) INTO v_pins, v_history
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'USER_NOT_FOUND');
  END IF;

  IF v_pins IS NULL OR v_pins < v_cost THEN
    RETURN jsonb_build_object(
      'ok', false,
      'reason', 'INSUFFICIENT_PINS',
      'current_balance', COALESCE(v_pins, 0),
      'required', v_cost
    );
  END IF;

  v_new_balance := v_pins - v_cost;
  v_tx_id := 'tx_' || gen_random_uuid()::text;

  v_tx_record := jsonb_build_object(
    'id', v_tx_id,
    'type', 'spend',
    'amount', v_cost,
    'reason', 'Extended daily AI by ' || v_minutes || ' mins',
    'source', 'ai_minutes_extend',
    'timestamp', (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
  );

  -- 3. Atomically deduct pins and prepend to transaction history
  UPDATE public.users
  SET pins = v_new_balance,
      pin_history = jsonb_path_query_array(
        jsonb_build_array(v_tx_record) || v_history,
        '$[0 to 99]'
      )
  WHERE id = p_user_id;

  -- 4. Record purchase into audit ledger
  INSERT INTO public.ai_minutes_purchases (user_id, minutes, cost_pins, purchased_at)
  VALUES (p_user_id, v_minutes, v_cost, now());

  RETURN jsonb_build_object(
    'ok', true,
    'new_balance', v_new_balance,
    'minutes_added', v_minutes,
    'purchases_today', v_today_count + 1,
    'remaining_today', 2 - (v_today_count + 1),
    'transaction_id', v_tx_id
  );
END;
$$;
