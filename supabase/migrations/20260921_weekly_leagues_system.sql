-- ==============================================================================
-- Migration: 20260921_weekly_leagues_system.sql
-- Description: PinIT Career OS - 5-Tier Weekly Leagues (Duolingo Model)
-- Features:
--   1. Adds league_tier column ('browns', 'silver', 'gold', 'platinum', 'ruby')
--   2. Adds weekly_xp column (resets every Monday at 1:00 AM IST)
--   3. Adds league_history column to record promotions/demotions
--   4. Updates increment_xp RPC to atomically update both xp_total and weekly_xp
--   5. Creates atomic stored procedure evaluate_weekly_leagues() for Monday 1:00 AM IST
-- ==============================================================================

-- 1. Ensure league columns exist on public.users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS league_tier TEXT DEFAULT 'browns';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS weekly_xp INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS league_cycle_start TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS league_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_league_eval TIMESTAMPTZ;

-- 2. Validate league_tier values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_valid_league_tier'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT check_valid_league_tier
      CHECK (league_tier IN ('browns', 'silver', 'gold', 'platinum', 'ruby'));
  END IF;
END $$;

-- 3. Update increment_xp RPC to atomically update weekly_xp alongside xp_total
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
  v_current_weekly INTEGER;
  v_new_weekly INTEGER;
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

  -- Fetch current XP with row lock
  SELECT COALESCE(xp_total, 0), COALESCE(weekly_xp, 0)
  INTO v_current_xp, v_current_weekly
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'ok', false,
      'reason', 'USER_NOT_FOUND',
      'message', 'User profile not found.'
    );
  END IF;

  v_new_xp := v_current_xp + p_amount;
  v_new_weekly := v_current_weekly + p_amount;
  v_new_level := GREATEST(1, FLOOR(v_new_xp / 1000) + 1);

  -- Update users table
  UPDATE public.users
  SET xp_total = v_new_xp,
      weekly_xp = v_new_weekly,
      xp_level = v_new_level
  WHERE id = p_user_id;

  -- Append to xp_ledger
  INSERT INTO public.xp_ledger (user_id, amount, reason, created_at)
  VALUES (p_user_id, p_amount, v_reason, TIMEZONE('utc'::text, NOW()));

  RETURN jsonb_build_object(
    'ok', true,
    'new_xp', v_new_xp,
    'new_weekly_xp', v_new_weekly,
    'new_level', v_new_level,
    'amount_added', p_amount
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_xp(UUID, INTEGER, TEXT) TO service_role;

-- 4. Stored procedure: evaluate_weekly_leagues()
-- Runs every Monday at 1:00 AM IST (20:00 UTC Sunday)
CREATE OR REPLACE FUNCTION public.evaluate_weekly_leagues()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier TEXT;
  v_next_tier TEXT;
  v_prev_tier TEXT;
  v_now TIMESTAMPTZ := TIMEZONE('utc'::text, NOW());
  v_total_promoted INTEGER := 0;
  v_total_demoted INTEGER := 0;
  v_tier_users RECORD;
  v_count INTEGER;
  v_prom_cutoff INTEGER;
  v_dem_cutoff INTEGER;
BEGIN
  -- Evaluate leagues in order
  FOR v_tier IN SELECT unnest(ARRAY['ruby', 'platinum', 'gold', 'silver', 'browns'])
  LOOP
    -- Next & previous league definitions
    v_next_tier := CASE v_tier
      WHEN 'browns' THEN 'silver'
      WHEN 'silver' THEN 'gold'
      WHEN 'gold' THEN 'platinum'
      WHEN 'platinum' THEN 'ruby'
      ELSE 'ruby' -- Ruby cannot promote
    END;

    v_prev_tier := CASE v_tier
      WHEN 'ruby' THEN 'platinum'
      WHEN 'platinum' THEN 'gold'
      WHEN 'gold' THEN 'silver'
      WHEN 'silver' THEN 'browns'
      ELSE 'browns' -- Browns cannot demote
    END;

    -- Count active users in this tier
    SELECT COUNT(*) INTO v_count
    FROM public.users
    WHERE league_tier = v_tier;

    IF v_count >= 2 THEN
      -- Top 10% (at least 1 user)
      v_prom_cutoff := GREATEST(1, CEIL(v_count * 0.10));
      -- Bottom 10% (at least 1 user)
      v_dem_cutoff := GREATEST(1, v_count - FLOOR(v_count * 0.10) + 1);

      -- Apply Promotions (if not ruby)
      IF v_next_tier <> v_tier THEN
        WITH ranked AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY weekly_xp DESC, xp_total DESC) as rk
          FROM public.users
          WHERE league_tier = v_tier
        )
        UPDATE public.users u
        SET league_tier = v_next_tier,
            league_history = jsonb_insert(
              COALESCE(u.league_history, '[]'::jsonb),
              '{0}',
              jsonb_build_object(
                'timestamp', v_now,
                'outcome', 'promoted',
                'from', v_tier,
                'to', v_next_tier,
                'weekly_xp', u.weekly_xp
              )
            )
        FROM ranked r
        WHERE u.id = r.id AND r.rk <= v_prom_cutoff;

        v_total_promoted := v_total_promoted + v_prom_cutoff;
      END IF;

      -- Apply Demotions (if not browns and not promoted)
      IF v_prev_tier <> v_tier AND v_dem_cutoff > v_prom_cutoff THEN
        WITH ranked AS (
          SELECT id, ROW_NUMBER() OVER (ORDER BY weekly_xp DESC, xp_total DESC) as rk
          FROM public.users
          WHERE league_tier = v_tier
        )
        UPDATE public.users u
        SET league_tier = v_prev_tier,
            league_history = jsonb_insert(
              COALESCE(u.league_history, '[]'::jsonb),
              '{0}',
              jsonb_build_object(
                'timestamp', v_now,
                'outcome', 'demoted',
                'from', v_tier,
                'to', v_prev_tier,
                'weekly_xp', u.weekly_xp
              )
            )
        FROM ranked r
        WHERE u.id = r.id AND r.rk >= v_dem_cutoff;

        v_total_demoted := v_total_demoted + (v_count - v_dem_cutoff + 1);
      END IF;
    END IF;
  END LOOP;

  -- Finally, reset weekly_xp = 0 and update cycle start for everyone
  UPDATE public.users
  SET weekly_xp = 0,
      league_cycle_start = v_now,
      last_league_eval = v_now;

  RETURN jsonb_build_object(
    'ok', true,
    'total_promoted', v_total_promoted,
    'total_demoted', v_total_demoted,
    'timestamp', v_now
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.evaluate_weekly_leagues() TO service_role;
