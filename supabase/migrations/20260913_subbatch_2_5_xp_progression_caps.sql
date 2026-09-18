-- Migration: 20260913_subbatch_2_5_xp_progression_caps.sql
-- Sub-Batch 2.5: XP Exploits & Progression Caps (Issues 048 – 052)

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
-- 1. Ensure users table and columns
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pins INTEGER DEFAULT 120,
  pin_history JSONB DEFAULT '[]'::jsonb,
  unlocked_items JSONB DEFAULT '{}'::jsonb,
  xp_total INTEGER DEFAULT 0,
  xp_level INTEGER DEFAULT 1,
  badges TEXT[] DEFAULT '{}'::text[],
  career_dna_score INTEGER DEFAULT 0,
  communication_score INTEGER,
  interviews_done INTEGER DEFAULT 0
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS xp_total INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS xp_level INTEGER DEFAULT 1;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}'::text[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS career_dna_score INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS communication_score INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS interviews_done INTEGER DEFAULT 0;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. DEFECT 048: Server-Authoritative XP Ledger & Atomic increment_xp RPC
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.xp_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.xp_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "xp_ledger_read_own" ON public.xp_ledger;
CREATE POLICY "xp_ledger_read_own" ON public.xp_ledger
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "xp_ledger_admin_all" ON public.xp_ledger;
CREATE POLICY "xp_ledger_admin_all" ON public.xp_ledger
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Atomic RPC: increment_xp
CREATE OR REPLACE FUNCTION public.increment_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'XP Award'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_xp INTEGER;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_reason TEXT;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 OR p_amount > 500 THEN
    RETURN jsonb_build_object(
      'ok', false,
      'reason', 'INVALID_XP_AMOUNT',
      'message', 'XP amount must be a positive integer between 1 and 500.'
    );
  END IF;

  v_reason := COALESCE(NULLIF(TRIM(p_reason), ''), 'XP Award');

  SELECT COALESCE(xp_total, 0) INTO v_current_xp
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'USER_NOT_FOUND');
  END IF;

  v_new_xp := v_current_xp + p_amount;
  -- Standard level curve: Level = floor(sqrt(xp / 100)) + 1
  v_new_level := GREATEST(1, FLOOR(SQRT(v_new_xp::FLOAT / 100.0))::INTEGER + 1);

  UPDATE public.users
  SET xp_total = v_new_xp,
      xp_level = v_new_level
  WHERE id = p_user_id;

  INSERT INTO public.xp_ledger (user_id, amount, reason, created_at)
  VALUES (p_user_id, p_amount, v_reason, now());

  RETURN jsonb_build_object(
    'ok', true,
    'new_xp', v_new_xp,
    'new_level', v_new_level,
    'amount_added', p_amount
  );
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. DEFECT 049: Prestige Milestone Registry & Anti-Replay Badge Awarding
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  milestone_key TEXT NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  -- Named uq_user_milestone before; streak_claims (subbatch 2.3) already uses that name,
  -- so this whole file failed to apply and the badges column was never created.
  CONSTRAINT uq_user_milestones_user_key UNIQUE(user_id, milestone_key)
);

ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_milestones_read_own" ON public.user_milestones;
CREATE POLICY "user_milestones_read_own" ON public.user_milestones
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_milestones_admin_all" ON public.user_milestones;
CREATE POLICY "user_milestones_admin_all" ON public.user_milestones
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Atomic RPC: award_prestige_badge
CREATE OR REPLACE FUNCTION public.award_prestige_badge(
  p_user_id UUID,
  p_badge_id TEXT,
  p_milestone_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_exists BOOLEAN;
  v_xp_res JSONB;
BEGIN
  IF p_badge_id IS NULL OR TRIM(p_badge_id) = '' OR p_milestone_key IS NULL OR TRIM(p_milestone_key) = '' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'INVALID_BADGE_PARAMS');
  END IF;

  -- 1. Check if milestone was already recorded
  SELECT EXISTS (
    SELECT 1 FROM public.user_milestones
    WHERE user_id = p_user_id AND milestone_key = p_milestone_key
  ) INTO v_exists;

  IF v_exists THEN
    RETURN jsonb_build_object(
      'ok', true,
      'newly_awarded', false,
      'message', 'Prestige milestone has already been claimed.'
    );
  END IF;

  -- 2. Record milestone claim
  INSERT INTO public.user_milestones (user_id, milestone_key, awarded_at)
  VALUES (p_user_id, p_milestone_key, now());

  -- 3. Append badge to users.badges array if not present
  UPDATE public.users
  SET badges = ARRAY_APPEND(COALESCE(badges, '{}'::text[]), p_badge_id)
  WHERE id = p_user_id
    AND NOT (p_badge_id = ANY(COALESCE(badges, '{}'::text[])));

  -- 4. Atomically credit 500 XP prestige bonus
  v_xp_res := public.increment_xp(p_user_id, 500, 'Prestige Milestone: ' || p_badge_id);

  RETURN jsonb_build_object(
    'ok', true,
    'newly_awarded', true,
    'xp_granted', 500,
    'badge_id', p_badge_id,
    'new_xp', v_xp_res -> 'new_xp',
    'new_level', v_xp_res -> 'new_level'
  );
END;
$$;
