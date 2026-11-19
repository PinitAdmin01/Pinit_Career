-- Turing AI sparring is practice: the 10 Pin entry fee is charged atomically
-- when the match starts, while finishing it must not alter the user's profile.
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
  v_current_elo INTEGER;
  v_wins INTEGER;
  v_losses INTEGER;
  v_weekly_arena_points INTEGER;
  v_xp INTEGER;
  v_pins INTEGER;
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

  SELECT CASE
           WHEN COALESCE(arena_elo, 100) = 1200 AND COALESCE(arena_wins, 0) = 0 THEN 100
           ELSE GREATEST(0, COALESCE(arena_elo, 100))
         END,
         COALESCE(arena_wins, 0),
         COALESCE(arena_losses, 0),
         COALESCE(weekly_arena_points, 0),
         COALESCE(xp_total, 0),
         COALESCE(pins, 0)
  INTO v_current_elo, v_wins, v_losses, v_weekly_arena_points, v_xp, v_pins
  FROM public.users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Student profile not found';
  END IF;

  v_passed := COALESCE(p_passed, FALSE) AND NOW() <= v_match.deadline_at;

  v_result := jsonb_build_object(
    'ok', TRUE,
    'passed', v_passed,
    'oldElo', v_current_elo,
    'newElo', v_current_elo,
    'eloDelta', 0,
    'arenaPointsAwarded', 0,
    'newArenaPoints', v_weekly_arena_points,
    'newXp', v_xp,
    'problemId', v_match.problem_id,
    'pinsAwarded', 0,
    'newPins', v_pins,
    'arenaWins', v_wins,
    'arenaLosses', v_losses
  );

  -- Record the outcome for replay protection and history; never update public.users.
  UPDATE public.arena_solo_matches
  SET status = 'settled', passed = v_passed, settlement = v_result, settled_at = NOW()
  WHERE match_id = p_match_id;

  RETURN v_result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.settle_solo_arena_match(UUID, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.settle_solo_arena_match(UUID, TEXT, BOOLEAN) TO service_role;

-- Return the original problem with an idempotent replay. The browser must
-- resume the exact match created by the first request, even after a reload.
CREATE OR REPLACE FUNCTION public.start_solo_arena_match_with_pin_fee(
  p_request_id UUID,
  p_user_id UUID,
  p_match_id TEXT,
  p_problem_id TEXT,
  p_started_at TIMESTAMPTZ,
  p_deadline_at TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_user UUID;
  v_daily INTEGER;
  v_bonus INTEGER;
  v_new_daily INTEGER;
  v_new_bonus INTEGER;
  v_history JSONB;
  v_new_history JSONB;
  v_transaction JSONB;
  v_inserted INTEGER;
  v_match public.arena_solo_matches%ROWTYPE;
  v_pin_cost CONSTANT INTEGER := 10;
BEGIN
  IF p_request_id IS NULL OR p_user_id IS NULL OR p_match_id IS NULL
     OR length(trim(p_match_id)) = 0 OR p_problem_id IS NULL
     OR length(trim(p_problem_id)) = 0 OR p_started_at IS NULL
     OR p_deadline_at IS NULL OR p_deadline_at <= p_started_at
     OR p_deadline_at > p_started_at + INTERVAL '1 hour' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'INVALID_MATCH');
  END IF;

  SELECT GREATEST(0, COALESCE(pins, 0)),
         GREATEST(0, COALESCE(bonus_pins, 0)),
         COALESCE(pin_history, '[]'::jsonb)
    INTO v_daily, v_bonus, v_history
    FROM public.users
    WHERE id = p_user_id
    FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'USER_NOT_FOUND');
  END IF;

  -- Older or manually repaired profiles may contain a malformed history value.
  -- Keep the wallet fee atomic and preserve a valid history array in that case.
  IF jsonb_typeof(v_history) IS DISTINCT FROM 'array' THEN
    v_history := '[]'::jsonb;
  END IF;

  SELECT user_id INTO v_existing_user
    FROM public.arena_solo_matches
    WHERE create_request_id = p_request_id;
  IF FOUND THEN
    IF v_existing_user <> p_user_id THEN
      RETURN jsonb_build_object('ok', false, 'error', 'IDEMPOTENCY_KEY_CONFLICT');
    END IF;
    SELECT * INTO v_match
      FROM public.arena_solo_matches
      WHERE create_request_id = p_request_id;
    RETURN jsonb_build_object(
      'ok', true,
      'replayed', true,
      'matchId', v_match.match_id,
      'problemId', v_match.problem_id,
      'startedAt', v_match.started_at,
      'deadlineAt', v_match.deadline_at,
      'newBalance', v_daily,
      'newBonusBalance', v_bonus
    );
  END IF;

  IF v_daily + v_bonus < v_pin_cost THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', 'INSUFFICIENT_PINS',
      'currentBalance', v_daily + v_bonus
    );
  END IF;

  INSERT INTO public.arena_solo_matches (
    match_id, user_id, problem_id, started_at, deadline_at, status, create_request_id
  ) VALUES (
    p_match_id, p_user_id, p_problem_id, p_started_at, p_deadline_at, 'active', p_request_id
  ) ON CONFLICT (create_request_id) DO NOTHING;
  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  IF v_inserted = 0 THEN
    SELECT * INTO v_match
      FROM public.arena_solo_matches
      WHERE create_request_id = p_request_id;
    IF v_match.user_id <> p_user_id THEN
      RETURN jsonb_build_object('ok', false, 'error', 'IDEMPOTENCY_KEY_CONFLICT');
    END IF;
    RETURN jsonb_build_object(
      'ok', true,
      'replayed', true,
      'matchId', v_match.match_id,
      'problemId', v_match.problem_id,
      'startedAt', v_match.started_at,
      'deadlineAt', v_match.deadline_at,
      'newBalance', v_daily,
      'newBonusBalance', v_bonus
    );
  END IF;

  v_new_daily := v_daily - LEAST(v_daily, v_pin_cost);
  v_new_bonus := v_bonus - (v_pin_cost - LEAST(v_daily, v_pin_cost));
  v_transaction := jsonb_build_object(
    'id', 'arena_solo_' || p_request_id::text,
    'type', 'spend',
    'amount', v_pin_cost,
    'reason', 'Start AI Practice Match',
    'source', 'code_arena',
    'timestamp', floor(extract(epoch FROM clock_timestamp()) * 1000)::BIGINT
  );
  v_history := jsonb_build_array(v_transaction) || v_history;
  SELECT COALESCE(jsonb_agg(entry ORDER BY ordinal), '[]'::jsonb)
    INTO v_new_history
    FROM jsonb_array_elements(v_history) WITH ORDINALITY AS history(entry, ordinal)
    WHERE ordinal <= 100;

  UPDATE public.users
    SET pins = v_new_daily,
        bonus_pins = v_new_bonus,
        pin_history = v_new_history
    WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'ok', true,
    'replayed', false,
    'matchId', p_match_id,
    'problemId', p_problem_id,
    'startedAt', p_started_at,
    'deadlineAt', p_deadline_at,
    'newBalance', v_new_daily,
    'newBonusBalance', v_new_bonus
  );
END;
$$;

REVOKE ALL ON FUNCTION public.start_solo_arena_match_with_pin_fee(
  UUID, UUID, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.start_solo_arena_match_with_pin_fee(
  UUID, UUID, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ
) TO service_role;
