-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE B6b — Weekly leagues: rank students only, decide every move from one snapshot
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- evaluate_weekly_leagues() (the Monday cron) had four problems:
--   1. Staff (teachers, admins, …) were ranked with students and could take promotion places.
--      Now only students (role 'student' or not set) are ranked and moved; staff are left alone.
--   2. Tiers were processed one after another, so a player demoted from ruby was ranked again in
--      platinum the same night (and could be promoted straight back, taking a platinum player's place).
--      Now every move is decided from one snapshot of the week and applied in one statement.
--   3. After promoting the top of a tier, the demotion step re-ranked the rest against a cutoff
--      computed for the whole tier, so platinum, gold and silver never demoted anyone (the result
--      still counted them). The totals returned are now the players actually moved.
--   4. A player whose weekly_xp was empty (NULL) ranked first. It now counts as 0.
-- The rules are otherwise unchanged: in a tier of 2+ players the top 10% (at least 1) move up;
-- in a tier of 10+ players the bottom 10% move down; everyone's weekly XP resets to 0.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

do $$
begin
  if to_regprocedure('public.evaluate_weekly_leagues()') is null then
    raise exception 'evaluate_weekly_leagues() missing — stop and tell Claude';
  end if;
  if not exists (select 1 from information_schema.columns
                 where table_schema = 'public' and table_name = 'users' and column_name = 'last_league_eval') then
    raise exception 'users.last_league_eval missing — stop and tell Claude';
  end if;
end $$;

create or replace function public.evaluate_weekly_leagues()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tiers constant text[] := array['browns', 'silver', 'gold', 'platinum', 'ruby'];
  v_now timestamptz := timezone('utc'::text, now());
  v_promoted integer := 0;
  v_demoted integer := 0;
begin
  -- Two runs at the same time (a retry, a manual run) wait for each other.
  perform pg_advisory_xact_lock(hashtext('public.evaluate_weekly_leagues'));

  with ranked as (
    select u.id,
           u.league_tier,
           array_position(v_tiers, u.league_tier) as ti,
           row_number() over (partition by u.league_tier
                              order by coalesce(u.weekly_xp, 0) desc, coalesce(u.xp_total, 0) desc, u.id) as rk,
           count(*) over (partition by u.league_tier) as n
    from public.users u
    where (u.role = 'student' or u.role is null)
      and u.league_tier = any (v_tiers)
  ),
  moves as (
    select r.id,
           r.league_tier as from_tier,
           case
             when r.n >= 2 and r.ti < 5
                  and r.rk <= greatest(1, ceil(r.n / 10.0)) then r.ti + 1
             when r.n >= 2 and r.ti > 1
                  and (r.n - floor(r.n / 10.0) + 1) > greatest(1, ceil(r.n / 10.0))
                  and r.rk >= (r.n - floor(r.n / 10.0) + 1) then r.ti - 1
           end as to_ti,
           r.ti
    from ranked r
  ),
  applied as (
    update public.users u
    set league_tier = v_tiers[m.to_ti],
        league_history = jsonb_insert(
          coalesce(u.league_history, '[]'::jsonb),
          '{0}',
          jsonb_build_object(
            'timestamp', v_now,
            'outcome', case when m.to_ti > m.ti then 'promoted' else 'demoted' end,
            'from', m.from_tier,
            'to', v_tiers[m.to_ti],
            'weekly_xp', coalesce(u.weekly_xp, 0)
          )
        )
    from moves m
    where u.id = m.id and m.to_ti is not null
    returning m.to_ti > m.ti as promoted
  )
  select count(*) filter (where promoted), count(*) filter (where not promoted)
    into v_promoted, v_demoted
  from applied;

  update public.users
  set weekly_xp = 0,
      league_cycle_start = v_now,
      last_league_eval = v_now
  where id is not null;

  return jsonb_build_object(
    'ok', true,
    'total_promoted', v_promoted,
    'total_demoted', v_demoted,
    'timestamp', v_now
  );
end;
$$;

revoke execute on function public.evaluate_weekly_leagues() from public, anon, authenticated;
grant execute on function public.evaluate_weekly_leagues() to service_role;

commit;
