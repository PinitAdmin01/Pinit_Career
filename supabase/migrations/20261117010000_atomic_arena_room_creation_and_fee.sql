-- A paid Arena room is created and charged in one transaction. The request UUID
-- makes retries return the original room without charging the learner twice.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS bonus_pins INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pin_history JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.arena_rooms
  ADD COLUMN IF NOT EXISTS host_device_id TEXT,
  ADD COLUMN IF NOT EXISTS host_language TEXT NOT NULL DEFAULT 'typescript',
  ADD COLUMN IF NOT EXISTS guest_device_id TEXT,
  ADD COLUMN IF NOT EXISTS guest_language TEXT NOT NULL DEFAULT 'typescript';

-- Older builds allowed the host to occupy the guest slot from another device.
-- Those unresolved self-matches cannot produce a fair two-profile rating result.
UPDATE public.arena_rooms
SET status = 'cancelled',
    winner_id = NULL,
    ended_at = COALESCE(ended_at, NOW()),
    elo_applied = TRUE,
    host_elo_delta = 0,
    guest_elo_delta = 0,
    host_arena_points_award = 0,
    guest_arena_points_award = 0,
    updated_at = NOW()
WHERE guest_id = host_id || '_challenger'
  AND status <> 'cancelled'
  AND NOT COALESCE(elo_applied, FALSE);

CREATE TABLE IF NOT EXISTS public.arena_room_create_requests (
  request_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  room_code VARCHAR(16) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.arena_room_create_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.arena_room_create_requests FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.arena_room_create_requests TO service_role;

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
  v_new_bonus INTEGER;
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

  -- Serialize a learner's room purchases and wallet updates.
  SELECT COALESCE(pins, 0), COALESCE(bonus_pins, 0), COALESCE(pin_history, '[]'::jsonb)
    INTO v_daily, v_bonus, v_history
    FROM public.users
    WHERE id = p_user_id
    FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'USER_NOT_FOUND');
  END IF;

  -- A completed prior request is returned as-is. Its original fee is never charged again.
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

  IF v_daily + v_bonus < v_pin_cost THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', 'INSUFFICIENT_PINS',
      'currentBalance', v_daily + v_bonus
    );
  END IF;

  -- Insert the idempotency key before mutations. A key collision from another
  -- account is rejected without charging either account.
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

  v_new_daily := v_daily - LEAST(v_daily, v_pin_cost);
  v_new_bonus := v_bonus - (v_pin_cost - LEAST(v_daily, v_pin_cost));
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
        bonus_pins = v_new_bonus,
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
    'newBonusBalance', v_new_bonus
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_arena_room_with_pin_fee(
  UUID, UUID, VARCHAR, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, JSONB, JSONB
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_arena_room_with_pin_fee(
  UUID, UUID, VARCHAR, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, JSONB, JSONB
) TO service_role;

-- Rated solo matches use the same 10 Pin entry fee and retry-safe billing.
ALTER TABLE public.arena_solo_matches
  ADD COLUMN IF NOT EXISTS create_request_id UUID;

CREATE UNIQUE INDEX IF NOT EXISTS arena_solo_matches_create_request_id_idx
  ON public.arena_solo_matches (create_request_id);

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

  SELECT COALESCE(pins, 0), COALESCE(bonus_pins, 0), COALESCE(pin_history, '[]'::jsonb)
    INTO v_daily, v_bonus, v_history
    FROM public.users
    WHERE id = p_user_id
    FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'USER_NOT_FOUND');
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
    'reason', 'Start Rated Arena Match',
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
