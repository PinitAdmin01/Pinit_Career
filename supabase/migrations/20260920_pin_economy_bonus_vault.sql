-- ==============================================================================
-- Migration: 20260920_pin_economy_bonus_vault.sql
-- Description: PinIT Career OS - 2-Section Jio/Airtel Pin Economy & Bonus Vault
-- Features:
--   1. Adds bonus_pins column to public.users (permanent vault for 500 bonus pins)
--   2. Sets initial pins default to 50 (instead of 100 or 120) for all new signups
--   3. Adds last_pin_reset column for 1:00 AM IST daily quota tracking
--   4. Creates processed_payments table with RLS & unique index for idempotency
--   5. Updates prevent_privilege_escalation() trigger to guard bonus_pins against client tampering
--   6. Creates atomic stored procedure public.claim_bonus_pins() to claim vault pins
-- ==============================================================================

-- 1. Ensure bonus_pins column exists on public.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bonus_pins INTEGER DEFAULT 0;

-- 2. Ensure initial pins default is 50 for all new signups
ALTER TABLE public.users ALTER COLUMN pins SET DEFAULT 50;

-- 3. Ensure last_pin_reset column exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_pin_reset TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 4. Ensure processed_payments table exists for idempotent checkout & anti-replay
CREATE TABLE IF NOT EXISTS public.processed_payments (
    payment_id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    pins_granted INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.processed_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own processed payments" ON public.processed_payments;
CREATE POLICY "Users can view own processed payments" ON public.processed_payments
    FOR SELECT TO authenticated USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Service role can insert processed payments" ON public.processed_payments;
CREATE POLICY "Service role can insert processed payments" ON public.processed_payments
    FOR INSERT TO service_role WITH CHECK (true);

-- 5. Update prevent_privilege_escalation() to guard bonus_pins against client tampering
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() = old.id THEN
    -- Economy / Roles / Subscriptions / Bonus Vault
    IF new.role IS DISTINCT FROM old.role
       OR new.pins IS DISTINCT FROM old.pins
       OR new.bonus_pins IS DISTINCT FROM old.bonus_pins
       OR coalesce(new.subscription_tier, 'free') IS DISTINCT FROM coalesce(old.subscription_tier, 'free')
       OR new.ats_score IS DISTINCT FROM old.ats_score
       OR new.trust_score IS DISTINCT FROM old.trust_score
       OR new.subscription_started_at IS DISTINCT FROM old.subscription_started_at
       OR new.subscription_expires_at IS DISTINCT FROM old.subscription_expires_at
       OR coalesce(new.subscription_status, 'none') IS DISTINCT FROM coalesce(old.subscription_status, 'none') THEN
      new.role := old.role;
      new.pins := old.pins;
      new.bonus_pins := old.bonus_pins;
      new.subscription_tier := old.subscription_tier;
      new.ats_score := old.ats_score;
      new.trust_score := old.trust_score;
      new.subscription_started_at := old.subscription_started_at;
      new.subscription_expires_at := old.subscription_expires_at;
      new.subscription_status := old.subscription_status;
    END IF;
  END IF;
  RETURN new;
END;
$$;

-- 6. Atomic RPC function to claim bonus pins from vault into active daily pins
CREATE OR REPLACE FUNCTION public.claim_bonus_pins(
  p_user_id UUID,
  p_amount INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_pins INTEGER;
  v_current_bonus INTEGER;
  v_to_claim INTEGER;
  v_new_pins INTEGER;
  v_new_bonus INTEGER;
BEGIN
  -- Row lock to prevent race conditions
  SELECT pins, bonus_pins INTO v_current_pins, v_current_bonus
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'USER_NOT_FOUND', 'message', 'User profile not found');
  END IF;

  v_current_pins := COALESCE(v_current_pins, 0);
  v_current_bonus := COALESCE(v_current_bonus, 0);

  IF v_current_bonus <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'NO_BONUS_PINS', 'message', 'No bonus pins available to claim.');
  END IF;

  IF p_amount IS NOT NULL AND p_amount > 0 THEN
    v_to_claim := LEAST(p_amount, v_current_bonus);
  ELSE
    v_to_claim := v_current_bonus;
  END IF;

  v_new_pins := v_current_pins + v_to_claim;
  v_new_bonus := v_current_bonus - v_to_claim;

  UPDATE public.users
  SET pins = v_new_pins,
      bonus_pins = v_new_bonus
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'ok', true,
    'claimed', v_to_claim,
    'new_pins', v_new_pins,
    'remaining_bonus', v_new_bonus
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_bonus_pins(UUID, INTEGER) TO authenticated, service_role;
