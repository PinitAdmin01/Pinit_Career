-- League points split sprint learning XP from Arena points.
-- Arena ELO remains persistent and is not itself used as a league score.
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS weekly_arena_points INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS league_joined_at TIMESTAMPTZ;

ALTER TABLE public.users ALTER COLUMN arena_elo SET DEFAULT 100;

UPDATE public.users
SET arena_elo = 100
WHERE arena_elo IS NULL
   OR (arena_elo = 1200 AND COALESCE(arena_wins, 0) = 0);

ALTER TABLE public.arena_rooms
  ADD COLUMN IF NOT EXISTS elo_applied BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS host_elo_delta INTEGER,
  ADD COLUMN IF NOT EXISTS guest_elo_delta INTEGER,
  ADD COLUMN IF NOT EXISTS host_new_elo INTEGER,
  ADD COLUMN IF NOT EXISTS guest_new_elo INTEGER,
  ADD COLUMN IF NOT EXISTS host_arena_points_award INTEGER,
  ADD COLUMN IF NOT EXISTS guest_arena_points_award INTEGER;

-- Preserve existing qualified league members while distinguishing them from
-- profiles that only received the default Browns tier at account creation.
UPDATE public.users
SET league_joined_at = COALESCE(last_league_eval, league_cycle_start, NOW())
WHERE league_joined_at IS NULL
  AND COALESCE(xp_total, 0) >= 100
  AND LOWER(COALESCE(league_tier, 'browns')) IN ('browns', 'silver', 'gold', 'platinum', 'ruby');

CREATE INDEX IF NOT EXISTS users_league_membership_tier_idx
  ON public.users (league_tier)
  WHERE league_joined_at IS NOT NULL;

-- XP is a league input. Preserve the atomic weekly increment while making
-- quest awards idempotent if a request is retried after a network timeout.
CREATE OR REPLACE FUNCTION public.increment_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'XP Award'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    RETURN jsonb_build_object('ok', FALSE, 'reason', 'INVALID_XP_AMOUNT');
  END IF;

  v_reason := COALESCE(NULLIF(TRIM(p_reason), ''), 'XP Award');

  SELECT COALESCE(xp_total, 0), COALESCE(weekly_xp, 0)
  INTO v_current_xp, v_current_weekly
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', FALSE, 'reason', 'USER_NOT_FOUND');
  END IF;

  IF v_reason LIKE 'quest:%' AND EXISTS (
    SELECT 1 FROM public.xp_ledger WHERE user_id = p_user_id AND reason = v_reason
  ) THEN
    RETURN jsonb_build_object(
      'ok', TRUE,
      'already_granted', TRUE,
      'new_xp', v_current_xp,
      'new_weekly_xp', v_current_weekly,
      'new_level', GREATEST(1, FLOOR(v_current_xp / 1000) + 1),
      'amount_added', 0
    );
  END IF;

  v_new_xp := v_current_xp + p_amount;
  v_new_weekly := v_current_weekly + p_amount;
  v_new_level := GREATEST(1, FLOOR(v_new_xp / 1000) + 1);

  UPDATE public.users
  SET xp_total = v_new_xp,
      weekly_xp = v_new_weekly,
      xp_level = v_new_level
  WHERE id = p_user_id;

  INSERT INTO public.xp_ledger (user_id, amount, reason, created_at)
  VALUES (p_user_id, p_amount, v_reason, TIMEZONE('utc'::TEXT, NOW()));

  RETURN jsonb_build_object(
    'ok', TRUE,
    'new_xp', v_new_xp,
    'new_weekly_xp', v_new_weekly,
    'new_level', v_new_level,
    'amount_added', p_amount
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_xp(UUID, INTEGER, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_xp(UUID, INTEGER, TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.evaluate_weekly_leagues()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now TIMESTAMPTZ := NOW();
  v_sprint_start TIMESTAMPTZ := ((date_trunc('week', NOW() AT TIME ZONE 'Asia/Kolkata') + INTERVAL '1 hour') AT TIME ZONE 'Asia/Kolkata');
  v_promoted INTEGER := 0;
  v_demoted INTEGER := 0;
BEGIN
  -- A retry or manual invocation in the same weekly cycle must not rank the
  -- zeroed scores again and move tied players a second time.
  PERFORM pg_advisory_xact_lock(hashtext('public.evaluate_weekly_leagues'));

  IF EXISTS (
    SELECT 1 FROM public.users
    WHERE last_league_eval >= v_sprint_start
  ) THEN
    RETURN jsonb_build_object(
      'ok', TRUE,
      'alreadyEvaluated', TRUE,
      'timestamp', (SELECT MAX(last_league_eval) FROM public.users)
    );
  END IF;

  DROP TABLE IF EXISTS pg_temp.weekly_league_move_snapshot;
  CREATE TEMP TABLE weekly_league_move_snapshot (
    user_id UUID PRIMARY KEY,
    from_tier TEXT NOT NULL,
    to_tier TEXT NOT NULL,
    outcome TEXT NOT NULL,
    learning_xp INTEGER NOT NULL,
    arena_points INTEGER NOT NULL,
    league_points INTEGER NOT NULL
  ) ON COMMIT DROP;

  INSERT INTO weekly_league_move_snapshot
    (user_id, from_tier, to_tier, outcome, learning_xp, arena_points, league_points)
  WITH tier_rankings AS (
    SELECT
      u.id,
      LOWER(u.league_tier) AS tier,
      GREATEST(0, COALESCE(u.weekly_xp, 0))::INTEGER AS learning_xp,
      GREATEST(0, COALESCE(u.weekly_arena_points, 0))::INTEGER AS arena_points,
      GREATEST(0, COALESCE(u.weekly_xp, 0))::INTEGER + GREATEST(0, COALESCE(u.weekly_arena_points, 0))::INTEGER AS league_points,
      ROW_NUMBER() OVER (
        PARTITION BY LOWER(u.league_tier)
        ORDER BY
          GREATEST(0, COALESCE(u.weekly_xp, 0)) + GREATEST(0, COALESCE(u.weekly_arena_points, 0)) DESC,
          GREATEST(0, COALESCE(u.weekly_xp, 0)) DESC,
          COALESCE(u.xp_total, 0) DESC,
          u.id ASC
      ) AS rank_in_tier,
      COUNT(*) OVER (PARTITION BY LOWER(u.league_tier)) AS tier_size
    FROM public.users u
    WHERE u.league_joined_at IS NOT NULL
      AND COALESCE(u.xp_total, 0) >= 100
      AND (u.role IS NULL OR LOWER(u.role) = 'student')
      AND LOWER(COALESCE(u.league_tier, '')) IN ('browns', 'silver', 'gold', 'platinum', 'ruby')
  ), ranked_zones AS (
    SELECT *,
      GREATEST(1, CEIL(tier_size * 0.10))::INTEGER AS promotion_cutoff,
      CASE WHEN tier_size >= 10
        THEN (tier_size - FLOOR(tier_size * 0.10) + 1)::INTEGER
        ELSE 0
      END AS demotion_cutoff
    FROM tier_rankings
    WHERE tier_size >= 2
  )
  SELECT
    id,
    tier,
    CASE
      WHEN tier = 'browns' THEN 'silver'
      WHEN tier = 'silver' THEN 'gold'
      WHEN tier = 'gold' THEN 'platinum'
      WHEN tier = 'platinum' THEN 'ruby'
      WHEN tier = 'ruby' THEN 'ruby'
    END,
    'promoted', learning_xp, arena_points, league_points
  FROM ranked_zones
  WHERE tier <> 'ruby' AND rank_in_tier <= promotion_cutoff
  UNION ALL
  SELECT
    id,
    tier,
    CASE
      WHEN tier = 'silver' THEN 'browns'
      WHEN tier = 'gold' THEN 'silver'
      WHEN tier = 'platinum' THEN 'gold'
      WHEN tier = 'ruby' THEN 'platinum'
    END,
    'demoted', learning_xp, arena_points, league_points
  FROM ranked_zones
  WHERE tier <> 'browns'
    AND demotion_cutoff > promotion_cutoff
    AND rank_in_tier >= demotion_cutoff;

  SELECT COUNT(*) FILTER (WHERE outcome = 'promoted')::INTEGER,
         COUNT(*) FILTER (WHERE outcome = 'demoted')::INTEGER
  INTO v_promoted, v_demoted
  FROM weekly_league_move_snapshot;

  UPDATE public.users u
  SET league_tier = m.to_tier,
      league_history = jsonb_insert(
        COALESCE(u.league_history, '[]'::JSONB),
        '{0}',
        jsonb_build_object(
          'timestamp', v_now,
          'outcome', m.outcome,
          'from', m.from_tier,
          'to', m.to_tier,
          'learning_xp', m.learning_xp,
          'arena_points', m.arena_points,
          'league_points', m.league_points
        )
      )
  FROM weekly_league_move_snapshot m
  WHERE u.id = m.user_id;

  UPDATE public.users
  SET weekly_xp = 0,
      weekly_arena_points = 0,
      league_cycle_start = v_now,
      last_league_eval = v_now;

  RETURN jsonb_build_object(
    'ok', TRUE,
    'total_promoted', v_promoted,
    'total_demoted', v_demoted,
    'timestamp', v_now
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.evaluate_weekly_leagues() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.evaluate_weekly_leagues() TO service_role;

-- Server-created solo matches prevent clients from inventing reward claims.
CREATE TABLE IF NOT EXISTS public.arena_solo_matches (
  match_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deadline_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'settled')),
  passed BOOLEAN,
  settlement JSONB,
  settled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS arena_solo_matches_user_started_idx
  ON public.arena_solo_matches (user_id, started_at DESC);

ALTER TABLE public.arena_solo_matches ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.arena_solo_matches FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.arena_solo_matches TO service_role;

-- Apply a solo Arena result once, under row locks, using only a server-judged
-- pass result. The user's ELO and sprint Arena Points move in the same transaction.
CREATE OR REPLACE FUNCTION public.settle_solo_arena_match(
  p_user_id UUID,
  p_match_id TEXT,
  p_passed BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_match public.arena_solo_matches%ROWTYPE;
  v_elo INTEGER;
  v_wins INTEGER;
  v_losses INTEGER;
  v_current_elo INTEGER;
  v_new_elo INTEGER;
  v_delta INTEGER;
  v_arena_points INTEGER;
  v_weekly_arena_points INTEGER;
  v_passed BOOLEAN;
  v_result JSONB;
BEGIN
  SELECT * INTO v_match
  FROM public.arena_solo_matches
  WHERE match_id = p_match_id AND user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Solo Arena match not found';
  END IF;

  IF v_match.status = 'settled' THEN
    RETURN COALESCE(v_match.settlement, jsonb_build_object('ok', TRUE, 'alreadySettled', TRUE));
  END IF;

  SELECT COALESCE(arena_elo, 100), COALESCE(arena_wins, 0), COALESCE(arena_losses, 0),
         COALESCE(weekly_arena_points, 0)
  INTO v_elo, v_wins, v_losses, v_weekly_arena_points
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student profile not found';
  END IF;

  v_current_elo := CASE WHEN v_elo = 1200 AND v_wins = 0 THEN 100 ELSE GREATEST(0, v_elo) END;
  v_passed := COALESCE(p_passed, FALSE) AND NOW() <= v_match.deadline_at;
  v_delta := CASE WHEN v_passed THEN 20 ELSE -20 END;
  v_new_elo := GREATEST(0, v_current_elo + v_delta);
  v_delta := v_new_elo - v_current_elo;
  v_arena_points := CASE WHEN v_passed THEN LEAST(250, ROUND(v_current_elo * 0.5)::INTEGER) ELSE 0 END;
  v_weekly_arena_points := v_weekly_arena_points + v_arena_points;

  UPDATE public.users
  SET arena_elo = v_new_elo,
      arena_wins = v_wins + CASE WHEN v_passed THEN 1 ELSE 0 END,
      arena_losses = v_losses + CASE WHEN v_passed THEN 0 ELSE 1 END,
      weekly_arena_points = v_weekly_arena_points
  WHERE id = p_user_id;

  v_result := jsonb_build_object(
    'ok', TRUE,
    'passed', v_passed,
    'oldElo', v_current_elo,
    'newElo', v_new_elo,
    'eloDelta', v_delta,
    'arenaPointsAwarded', v_arena_points,
    'newArenaPoints', v_weekly_arena_points,
    'newXp', (SELECT xp_total FROM public.users WHERE id = p_user_id),
    'problemId', v_match.problem_id,
    'pinsAwarded', 0,
    'newPins', (SELECT pins FROM public.users WHERE id = p_user_id),
    'arenaWins', v_wins + CASE WHEN v_passed THEN 1 ELSE 0 END,
    'arenaLosses', v_losses + CASE WHEN v_passed THEN 0 ELSE 1 END
  );

  UPDATE public.arena_solo_matches
  SET status = 'settled', passed = v_passed, settlement = v_result, settled_at = NOW()
  WHERE match_id = p_match_id;

  RETURN v_result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.settle_solo_arena_match(UUID, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.settle_solo_arena_match(UUID, TEXT, BOOLEAN) TO service_role;

-- Settle a completed PvP room exactly once. Locking the room and both player
-- rows prevents double awards and lost updates when matches finish together.
CREATE OR REPLACE FUNCTION public.settle_arena_match_rewards(p_room_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room public.arena_rooms%ROWTYPE;
  v_host_elo INTEGER := 100;
  v_guest_elo INTEGER := 100;
  v_host_wins INTEGER := 0;
  v_host_losses INTEGER := 0;
  v_guest_wins INTEGER := 0;
  v_guest_losses INTEGER := 0;
  v_host_weekly_points INTEGER := 0;
  v_guest_weekly_points INTEGER := 0;
  v_host_exists BOOLEAN := FALSE;
  v_guest_exists BOOLEAN := FALSE;
  v_host_new_elo INTEGER;
  v_guest_new_elo INTEGER;
  v_host_delta INTEGER := 0;
  v_guest_delta INTEGER := 0;
  v_host_points INTEGER := 0;
  v_guest_points INTEGER := 0;
  v_result JSONB;
BEGIN
  SELECT * INTO v_room
  FROM public.arena_rooms
  WHERE room_code = UPPER(TRIM(p_room_code))
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Arena room not found';
  END IF;

  IF v_room.elo_applied THEN
    RETURN jsonb_build_object(
      'ok', TRUE, 'alreadySettled', TRUE,
      'host_elo_delta', v_room.host_elo_delta,
      'guest_elo_delta', v_room.guest_elo_delta,
      'host_new_elo', v_room.host_new_elo,
      'guest_new_elo', v_room.guest_new_elo,
      'host_arena_points_award', v_room.host_arena_points_award,
      'guest_arena_points_award', v_room.guest_arena_points_award
    );
  END IF;

  IF v_room.status <> 'completed' OR v_room.winner_id IS NULL OR v_room.guest_id IS NULL THEN
    RAISE EXCEPTION 'Arena room is not ready for settlement';
  END IF;
  IF v_room.host_id = v_room.guest_id THEN
    RAISE EXCEPTION 'Arena players must be distinct';
  END IF;
  IF v_room.winner_id NOT IN (v_room.host_id, v_room.guest_id, 'draw') THEN
    RAISE EXCEPTION 'Arena winner is not a room participant';
  END IF;

  PERFORM u.id
  FROM public.users u
  WHERE u.id::TEXT IN (v_room.host_id, v_room.guest_id)
  ORDER BY u.id
  FOR UPDATE;

  SELECT COALESCE(arena_elo, 100), COALESCE(arena_wins, 0), COALESCE(arena_losses, 0),
         COALESCE(weekly_arena_points, 0)
  INTO v_host_elo, v_host_wins, v_host_losses, v_host_weekly_points
  FROM public.users WHERE id::TEXT = v_room.host_id;
  v_host_exists := FOUND;
  IF NOT v_host_exists THEN v_host_elo := 100; END IF;

  SELECT COALESCE(arena_elo, 100), COALESCE(arena_wins, 0), COALESCE(arena_losses, 0),
         COALESCE(weekly_arena_points, 0)
  INTO v_guest_elo, v_guest_wins, v_guest_losses, v_guest_weekly_points
  FROM public.users WHERE id::TEXT = v_room.guest_id;
  v_guest_exists := FOUND;
  IF NOT v_guest_exists THEN v_guest_elo := 100; END IF;

  IF v_host_elo = 1200 AND v_host_wins = 0 THEN v_host_elo := 100; END IF;
  IF v_guest_elo = 1200 AND v_guest_wins = 0 THEN v_guest_elo := 100; END IF;
  v_host_elo := GREATEST(0, v_host_elo);
  v_guest_elo := GREATEST(0, v_guest_elo);

  IF v_room.winner_id = v_room.host_id THEN
    v_host_delta := 20;
    v_guest_delta := -20;
    v_host_points := LEAST(250, ROUND(v_host_elo * 0.5)::INTEGER);
  ELSIF v_room.winner_id = v_room.guest_id THEN
    v_host_delta := -20;
    v_guest_delta := 20;
    v_guest_points := LEAST(250, ROUND(v_guest_elo * 0.5)::INTEGER);
  END IF;

  v_host_new_elo := GREATEST(0, v_host_elo + v_host_delta);
  v_guest_new_elo := GREATEST(0, v_guest_elo + v_guest_delta);
  v_host_delta := v_host_new_elo - v_host_elo;
  v_guest_delta := v_guest_new_elo - v_guest_elo;

  IF v_host_exists THEN
    UPDATE public.users
    SET arena_elo = v_host_new_elo,
        arena_wins = v_host_wins + CASE WHEN v_room.winner_id = v_room.host_id THEN 1 ELSE 0 END,
        arena_losses = v_host_losses + CASE WHEN v_room.winner_id = v_room.guest_id THEN 1 ELSE 0 END,
        weekly_arena_points = v_host_weekly_points + v_host_points
    WHERE id::TEXT = v_room.host_id;
  END IF;
  IF v_guest_exists THEN
    UPDATE public.users
    SET arena_elo = v_guest_new_elo,
        arena_wins = v_guest_wins + CASE WHEN v_room.winner_id = v_room.guest_id THEN 1 ELSE 0 END,
        arena_losses = v_guest_losses + CASE WHEN v_room.winner_id = v_room.host_id THEN 1 ELSE 0 END,
        weekly_arena_points = v_guest_weekly_points + v_guest_points
    WHERE id::TEXT = v_room.guest_id;
  END IF;

  UPDATE public.arena_rooms
  SET elo_applied = TRUE,
      host_elo_delta = v_host_delta,
      guest_elo_delta = v_guest_delta,
      host_new_elo = v_host_new_elo,
      guest_new_elo = v_guest_new_elo,
      host_arena_points_award = v_host_points,
      guest_arena_points_award = v_guest_points,
      updated_at = NOW()
  WHERE room_code = v_room.room_code;

  v_result := jsonb_build_object(
    'ok', TRUE,
    'host_elo_delta', v_host_delta,
    'guest_elo_delta', v_guest_delta,
    'host_new_elo', v_host_new_elo,
    'guest_new_elo', v_guest_new_elo,
    'host_arena_points_award', v_host_points,
    'guest_arena_points_award', v_guest_points
  );
  RETURN v_result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.settle_arena_match_rewards(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.settle_arena_match_rewards(TEXT) TO service_role;
