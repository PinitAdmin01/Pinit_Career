-- ==============================================================================
-- Migration: 20261121_pins_economy_120_cap_and_current_only.sql
-- Permanent Dual-Wallet Pins Economy Enforcement:
--   1. Daily 1:00 AM IST Reset (`perform_daily_pin_reset`):
--      Resets EVERY user's current `pins` strictly to 120 (even if > 120, e.g. 1000,
--      or < 120, e.g. 0). Preserves `bonus_pins` untouched (unlimited).
--   2. Capped Bonus Vault Refill (`claim_bonus_pins`):
--      Moves pins from `bonus_pins` into `pins` strictly up to the 120 daily cap.
--      Rejects with `CURRENT_PINS_FULL` when `pins >= 120`.
--   3. Capped Credit Split (`credit_pins`):
--      Fills `pins` up to 120 cap first and deposits any remainder into `bonus_pins`.
--   4. Current-Pins-Only Feature Spending (`create_arena_room_with_pin_fee` and
--      `start_solo_arena_match_with_pin_fee`, matching `spend_pins`):
--      Every feature deducts STRICTLY from `users.pins` and NEVER from `users.bonus_pins`.
-- Safe to re-run (idempotent).
-- ==============================================================================

BEGIN;

-- 1. Daily 1:00 AM IST reset: ALL users receive strictly 120 current pins; bonus_pins untouched.
CREATE OR REPLACE FUNCTION public.perform_daily_pin_reset()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reset_count INTEGER := 0;
BEGIN
  UPDATE public.users
    SET pins = 120,
        last_pin_reset = timezone('utc'::text, now())
    WHERE id IS NOT NULL;
  GET DIAGNOSTICS v_reset_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'ok', true,
    'daily_cap', 120,
    'reset_users_count', v_reset_count,
    'timestamp', timezone('utc'::text, now())
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.perform_daily_pin_reset() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.perform_daily_pin_reset() TO service_role;


-- 2. Refill Current Pins from Bonus Vault strictly up to 120 daily cap.
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
  v_daily_cap CONSTANT INTEGER := 120;
  v_current_pins INTEGER;
  v_current_bonus INTEGER;
  v_space INTEGER;
  v_to_claim INTEGER;
  v_new_pins INTEGER;
  v_new_bonus INTEGER;
  v_history JSONB;
  v_tx JSONB;
  v_new_history JSONB;
BEGIN
  SELECT GREATEST(0, COALESCE(pins, 0)),
         GREATEST(0, COALESCE(bonus_pins, 0)),
         COALESCE(pin_history, '[]'::jsonb)
    INTO v_current_pins, v_current_bonus, v_history
    FROM public.users
    WHERE id = p_user_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'USER_NOT_FOUND', 'message', 'User profile not found');
  END IF;

  IF jsonb_typeof(v_history) IS DISTINCT FROM 'array' THEN
    v_history := '[]'::jsonb;
  END IF;

  IF v_current_bonus <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'NO_BONUS_PINS', 'message', 'No bonus pins available to claim.');
  END IF;

  v_space := GREATEST(0, v_daily_cap - v_current_pins);
  IF v_space <= 0 THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', 'CURRENT_PINS_FULL',
      'message', 'Current pins are already at the daily limit of 120/120.'
    );
  END IF;

  IF p_amount IS NOT NULL AND p_amount > 0 THEN
    v_to_claim := LEAST(p_amount, v_space, v_current_bonus);
  ELSE
    v_to_claim := LEAST(v_space, v_current_bonus);
  END IF;

  v_new_pins := v_current_pins + v_to_claim;
  v_new_bonus := v_current_bonus - v_to_claim;

  v_tx := jsonb_build_object(
    'id', 'tx_claim_' || floor(extract(epoch FROM now()) * 1000)::text || '_' || substr(md5(random()::text), 1, 6),
    'type', 'earn',
    'amount', v_to_claim,
    'reason', format('Refilled +%s Current Pins from Bonus Vault', v_to_claim),
    'source', 'bonus_claim',
    'timestamp', floor(extract(epoch FROM now()) * 1000)::bigint
  );

  SELECT COALESCE(jsonb_agg(entry ORDER BY ordinal), '[]'::jsonb)
    INTO v_new_history
    FROM jsonb_array_elements(jsonb_build_array(v_tx) || v_history) WITH ORDINALITY AS h(entry, ordinal)
    WHERE ordinal <= 100;

  UPDATE public.users
    SET pins = v_new_pins,
        bonus_pins = v_new_bonus,
        pin_history = v_new_history
    WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'ok', true,
    'claimed', v_to_claim,
    'new_pins', v_new_pins,
    'remaining_bonus', v_new_bonus
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_bonus_pins(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_bonus_pins(UUID, INTEGER) TO service_role;


-- 3. Atomic credit_pins: fills Current Pins up to 120 cap first, overflow to Bonus Vault.
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
  v_daily_cap CONSTANT INTEGER := 120;
  v_current_pins INTEGER;
  v_current_bonus INTEGER;
  v_to_current INTEGER;
  v_to_bonus INTEGER;
  v_new_pins INTEGER;
  v_new_bonus INTEGER;
  v_tx_id TEXT;
  v_new_tx JSONB;
  v_history JSONB;
  v_new_history JSONB;
BEGIN
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'INVALID_AMOUNT');
  END IF;

  SELECT GREATEST(0, COALESCE(pins, 0)),
         GREATEST(0, COALESCE(bonus_pins, 0)),
         COALESCE(pin_history, '[]'::jsonb)
    INTO v_current_pins, v_current_bonus, v_history
    FROM public.users
    WHERE id = p_user_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'USER_NOT_FOUND');
  END IF;

  IF jsonb_typeof(v_history) IS DISTINCT FROM 'array' THEN
    v_history := '[]'::jsonb;
  END IF;

  v_to_current := LEAST(p_amount, GREATEST(0, v_daily_cap - v_current_pins));
  v_to_bonus := p_amount - v_to_current;
  v_new_pins := v_current_pins + v_to_current;
  v_new_bonus := v_current_bonus + v_to_bonus;

  v_tx_id := 'tx_earn_' || floor(extract(epoch FROM now()) * 1000)::text || '_' || substr(md5(random()::text), 1, 6);
  v_new_tx := jsonb_build_object(
    'id', v_tx_id,
    'type', 'earn',
    'amount', p_amount,
    'reason', p_reason,
    'source', p_source,
    'timestamp', floor(extract(epoch FROM now()) * 1000)::bigint
  );

  SELECT COALESCE(jsonb_agg(entry ORDER BY ordinal), '[]'::jsonb)
    INTO v_new_history
    FROM jsonb_array_elements(jsonb_build_array(v_new_tx) || v_history) WITH ORDINALITY AS h(entry, ordinal)
    WHERE ordinal <= 100;

  UPDATE public.users
    SET pins = v_new_pins,
        bonus_pins = v_new_bonus,
        pin_history = v_new_history
    WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'ok', true,
    'new_balance', v_new_pins,
    'new_bonus_balance', v_new_bonus,
    'to_current', v_to_current,
    'to_bonus', v_to_bonus,
    'tx_id', v_tx_id
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.credit_pins(UUID, INTEGER, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.credit_pins(UUID, INTEGER, TEXT, TEXT) TO service_role;


-- 4. Arena PvP Room Creation: strictly deducts from Current Pins (`pins`), NEVER `bonus_pins`.
CREATE OR REPLACE FUNCTION public.create_arena_room_with_pin_fee(
  p_request_id UUID,
  p_user_id UUID,
  p_room_code VARCHAR,
  p_host_name TEXT,
  p_host_avatar TEXT,
  p_host_device_id TEXT,
  p_host_language TEXT,
  p_problem_id TEXT,
  p_difficulty TEXT,
  p_time_limit_seconds INTEGER,
  p_host_progress JSONB,
  p_guest_progress JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_user UUID;
  v_existing_code VARCHAR(16);
  v_daily INTEGER;
  v_bonus INTEGER;
  v_new_daily INTEGER;
  v_history JSONB;
  v_new_history JSONB;
  v_transaction JSONB;
  v_inserted INTEGER;
  v_room JSONB;
  v_room_row public.arena_rooms%ROWTYPE;
  v_pin_cost CONSTANT INTEGER := 10;
BEGIN
  IF p_request_id IS NULL OR p_user_id IS NULL OR p_room_code IS NULL
     OR length(trim(p_room_code)) = 0 OR length(p_room_code) > 16
     OR p_host_name IS NULL OR length(trim(p_host_name)) = 0
     OR p_problem_id IS NULL OR length(trim(p_problem_id)) = 0
     OR p_difficulty NOT IN ('basic', 'intermediate', 'advanced', 'production')
     OR p_time_limit_seconds < 60 OR p_time_limit_seconds > 3600 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'INVALID_ROOM');
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

  IF jsonb_typeof(v_history) IS DISTINCT FROM 'array' THEN
    v_history := '[]'::jsonb;
  END IF;

  SELECT user_id, room_code INTO v_existing_user, v_existing_code
    FROM public.arena_room_create_requests
    WHERE request_id = p_request_id;
  IF FOUND THEN
    IF v_existing_user <> p_user_id THEN
      RETURN jsonb_build_object('ok', false, 'error', 'IDEMPOTENCY_KEY_CONFLICT');
    END IF;
    SELECT to_jsonb(r) INTO v_room
      FROM public.arena_rooms AS r
      WHERE r.room_code = v_existing_code;
    IF v_room IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'error', 'ROOM_CREATION_INCOMPLETE');
    END IF;
    RETURN jsonb_build_object(
      'ok', true,
      'replayed', true,
      'room', v_room,
      'newBalance', v_daily,
      'newBonusBalance', v_bonus
    );
  END IF;

  -- STRICT RULE: Feature fee uses Current Pins (`pins`) ONLY, NEVER `bonus_pins`.
  IF v_daily < v_pin_cost THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', 'INSUFFICIENT_PINS',
      'currentBalance', v_daily,
      'bonusBalance', v_bonus
    );
  END IF;

  INSERT INTO public.arena_room_create_requests (request_id, user_id, room_code)
    VALUES (p_request_id, p_user_id, p_room_code)
    ON CONFLICT (request_id) DO NOTHING;
  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  IF v_inserted = 0 THEN
    SELECT user_id, room_code INTO v_existing_user, v_existing_code
      FROM public.arena_room_create_requests
      WHERE request_id = p_request_id;
    IF v_existing_user <> p_user_id THEN
      RETURN jsonb_build_object('ok', false, 'error', 'IDEMPOTENCY_KEY_CONFLICT');
    END IF;
    SELECT to_jsonb(r) INTO v_room
      FROM public.arena_rooms AS r
      WHERE r.room_code = v_existing_code;
    IF v_room IS NULL THEN
      RETURN jsonb_build_object('ok', false, 'error', 'ROOM_CREATION_INCOMPLETE');
    END IF;
    RETURN jsonb_build_object(
      'ok', true,
      'replayed', true,
      'room', v_room,
      'newBalance', v_daily,
      'newBonusBalance', v_bonus
    );
  END IF;

  v_new_daily := v_daily - v_pin_cost;
  v_transaction := jsonb_build_object(
    'id', 'arena_room_' || p_request_id::text,
    'type', 'spend',
    'amount', v_pin_cost,
    'reason', 'Create Arena Battle Room',
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
        pin_history = v_new_history
    WHERE id = p_user_id;

  INSERT INTO public.arena_rooms (
    room_code, problem_id, difficulty, time_limit_seconds, status,
    host_id, host_name, host_avatar, host_device_id, host_language,
    host_ready, host_progress, guest_device_id, guest_language,
    guest_ready, guest_progress
  ) VALUES (
    p_room_code, p_problem_id, p_difficulty, p_time_limit_seconds, 'waiting',
    p_user_id::text, left(trim(p_host_name), 60), p_host_avatar, p_host_device_id,
    COALESCE(NULLIF(trim(p_host_language), ''), 'typescript'), false,
    COALESCE(p_host_progress, '{}'::jsonb), NULL, 'typescript', false,
    COALESCE(p_guest_progress, '{}'::jsonb)
  ) RETURNING * INTO v_room_row;

  RETURN jsonb_build_object(
    'ok', true,
    'replayed', false,
    'room', to_jsonb(v_room_row),
    'newBalance', v_new_daily,
    'newBonusBalance', v_bonus
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_arena_room_with_pin_fee(
  UUID, UUID, VARCHAR, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, JSONB, JSONB
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_arena_room_with_pin_fee(
  UUID, UUID, VARCHAR, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, JSONB, JSONB
) TO service_role;


-- 5. Arena Solo Practice Match: strictly deducts from Current Pins (`pins`), NEVER `bonus_pins`.
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

  -- STRICT RULE: Feature fee uses Current Pins (`pins`) ONLY, NEVER `bonus_pins`.
  IF v_daily < v_pin_cost THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', 'INSUFFICIENT_PINS',
      'currentBalance', v_daily,
      'bonusBalance', v_bonus
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

  v_new_daily := v_daily - v_pin_cost;
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
    'newBonusBalance', v_bonus
  );
END;
$$;

REVOKE ALL ON FUNCTION public.start_solo_arena_match_with_pin_fee(
  UUID, UUID, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.start_solo_arena_match_with_pin_fee(
  UUID, UUID, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ
) TO service_role;

COMMIT;

NOTIFY pgrst, 'reload schema';
