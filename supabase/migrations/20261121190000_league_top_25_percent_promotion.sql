-- Promote the top quarter of each eligible league at the weekly reset.
-- Demotions remain in the bottom 10% for divisions with at least 10 members.
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
      GREATEST(1, CEIL(tier_size * 0.25))::INTEGER AS promotion_cutoff,
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
