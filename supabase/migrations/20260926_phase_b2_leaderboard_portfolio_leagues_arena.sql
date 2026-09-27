-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE B2 — Leaderboard, weekly leagues, portfolio, quest history, internships,
--            focus games, arena, credential page
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- What is broken in production today and fixed here:
--   • Leaderboard shows fake students: its query asks for users.avatar_url / college / arena_elo,
--     which do not exist, so api/leaderboard falls back to a demo cohort.
--   • Credential verification page shows "Enrolled Student": api/verify asks for
--     users.department / branch / semester / batch_year.
--   • Vault upload name check never runs: api/vault/upload asks for users.full_name.
--   • Voice print cannot be saved: users.voice_print does not exist.
--   • Portfolio (projects, certificates, …) is not saved: portfolio_items does not exist.
--   • Weekly league reset fails: users.last_league_eval does not exist. B1 also restored an
--     older increment_xp that does not count weekly_xp; the league version is restored here.
--   • Quest history, internships, focus-game history, arena rooms: tables do not exist.
--
-- Built from 20260914_portfolio_persistence, 20260916_create_attention_span_sessions,
-- 20260920_block_privileged_insert, 20260921_weekly_leagues_system, 20260922_arena_pvp_rooms and
-- 20260921_schema_mismatches, changed where the repo file does not match the app code or is unsafe:
--   • quest_completions / internship_records use the columns the app actually writes
--   • arena: the repo file let anyone (even logged-out) create, edit and delete rooms; here only
--     the server writes and only the two players can read their room
--   • weekly XP, league tier and arena rating can no longer be edited by the student
--   • evaluate_weekly_leagues / increment_xp: server only
-- Not included (later): codewars_matches alignment (the route does not match the table either way),
-- leave_applications (unused), consultant / campus / finance / portal tables (B3, B4).
-- ─────────────────────────────────────────────────────────────────────────────

begin;

-- 1. users columns the app reads (no-op where present; no data changes)
alter table public.users
  add column if not exists avatar_url         text,
  add column if not exists college            text,
  add column if not exists college_name       text,
  add column if not exists department         text,
  add column if not exists branch             text,
  add column if not exists semester           text,
  add column if not exists batch_year         integer,
  add column if not exists full_name          text,
  add column if not exists voice_print        jsonb,
  add column if not exists arena_elo          integer default 1200,
  add column if not exists arena_wins         integer default 0,
  add column if not exists arena_losses       integer default 0,
  add column if not exists league_tier        text default 'browns',
  add column if not exists weekly_xp          integer default 0,
  add column if not exists league_cycle_start timestamptz default timezone('utc'::text, now()),
  add column if not exists league_history     jsonb default '[]'::jsonb,
  add column if not exists last_league_eval   timestamptz;

-- Valid league tiers for new writes (NOT VALID: existing rows are not re-checked).
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'check_valid_league_tier') then
    alter table public.users add constraint check_valid_league_tier
      check (league_tier in ('browns', 'silver', 'gold', 'platinum', 'ruby')) not valid;
  end if;
end $$;


-- 2. Students cannot edit their own economy, scores, XP, league or arena fields
--    (20260920 version + weekly_xp, league_*, arena_*).
create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and auth.uid() = old.id then
    -- Economy / Roles / Subscriptions / Bonus Vault
    if new.role is distinct from old.role
       or new.pins is distinct from old.pins
       or new.bonus_pins is distinct from old.bonus_pins
       or coalesce(new.subscription_tier, 'free') is distinct from coalesce(old.subscription_tier, 'free')
       or new.ats_score is distinct from old.ats_score
       or new.trust_score is distinct from old.trust_score
       or new.subscription_started_at is distinct from old.subscription_started_at
       or new.subscription_expires_at is distinct from old.subscription_expires_at
       or coalesce(new.subscription_status, 'none') is distinct from coalesce(old.subscription_status, 'none') then
      new.role := old.role;
      new.pins := old.pins;
      new.bonus_pins := old.bonus_pins;
      new.subscription_tier := old.subscription_tier;
      new.ats_score := old.ats_score;
      new.trust_score := old.trust_score;
      new.subscription_started_at := old.subscription_started_at;
      new.subscription_expires_at := old.subscription_expires_at;
      new.subscription_status := old.subscription_status;
    end if;

    -- XP, Quests, Scores, Certifications, Recruiter Ranking, Leagues, Arena
    if new.xp_total is distinct from old.xp_total
       or new.xp_level is distinct from old.xp_level
       or new.completed_quests is distinct from old.completed_quests
       or new.java_test_passed is distinct from old.java_test_passed
       or new.career_dna_score is distinct from old.career_dna_score
       or new.career_readiness is distinct from old.career_readiness
       or new.certifications is distinct from old.certifications
       or new.recruiter_visibility is distinct from old.recruiter_visibility
       or new.intelligence_score is distinct from old.intelligence_score
       or new.communication_score is distinct from old.communication_score
       or new.execution_score is distinct from old.execution_score
       or new.leadership_score is distinct from old.leadership_score
       or new.consistency_score is distinct from old.consistency_score
       or new.adaptability_score is distinct from old.adaptability_score
       or new.confidence_score is distinct from old.confidence_score
       or new.innovation_score is distinct from old.innovation_score
       or new.mission_streak is distinct from old.mission_streak
       or new.missions_completed is distinct from old.missions_completed
       or new.vault_count is distinct from old.vault_count
       or new.interviews_done is distinct from old.interviews_done
       or new.unlocked_items is distinct from old.unlocked_items
       or new.badges is distinct from old.badges
       or new.endorsed_skills is distinct from old.endorsed_skills
       or new.recruiter_visible is distinct from old.recruiter_visible
       or new.weekly_xp is distinct from old.weekly_xp
       or new.league_tier is distinct from old.league_tier
       or new.league_history is distinct from old.league_history
       or new.league_cycle_start is distinct from old.league_cycle_start
       or new.last_league_eval is distinct from old.last_league_eval
       or new.arena_elo is distinct from old.arena_elo
       or new.arena_wins is distinct from old.arena_wins
       or new.arena_losses is distinct from old.arena_losses then
      new.xp_total := old.xp_total;
      new.xp_level := old.xp_level;
      new.completed_quests := old.completed_quests;
      new.java_test_passed := old.java_test_passed;
      new.career_dna_score := old.career_dna_score;
      new.career_readiness := old.career_readiness;
      new.certifications := old.certifications;
      new.recruiter_visibility := old.recruiter_visibility;
      new.intelligence_score := old.intelligence_score;
      new.communication_score := old.communication_score;
      new.execution_score := old.execution_score;
      new.leadership_score := old.leadership_score;
      new.consistency_score := old.consistency_score;
      new.adaptability_score := old.adaptability_score;
      new.confidence_score := old.confidence_score;
      new.innovation_score := old.innovation_score;
      new.mission_streak := old.mission_streak;
      new.missions_completed := old.missions_completed;
      new.vault_count := old.vault_count;
      new.interviews_done := old.interviews_done;
      new.unlocked_items := old.unlocked_items;
      new.badges := old.badges;
      new.endorsed_skills := old.endorsed_skills;
      new.recruiter_visible := old.recruiter_visible;
      new.weekly_xp := old.weekly_xp;
      new.league_tier := old.league_tier;
      new.league_history := old.league_history;
      new.league_cycle_start := old.league_cycle_start;
      new.last_league_eval := old.last_league_eval;
      new.arena_elo := old.arena_elo;
      new.arena_wins := old.arena_wins;
      new.arena_losses := old.arena_losses;
    end if;
  end if;
  return new;
end;
$$;


-- 3. increment_xp — league version (20260921): also counts weekly_xp. Server only.
create or replace function public.increment_xp(
  p_user_id uuid,
  p_amount integer,
  p_reason text default 'XP Award'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_xp integer;
  v_new_xp integer;
  v_current_weekly integer;
  v_new_weekly integer;
  v_new_level integer;
  v_reason text;
begin
  if p_amount is null or p_amount <= 0 or p_amount > 500 then
    return jsonb_build_object(
      'ok', false,
      'reason', 'INVALID_XP_AMOUNT',
      'message', 'XP amount must be a positive integer between 1 and 500.'
    );
  end if;

  v_reason := coalesce(nullif(trim(p_reason), ''), 'XP Award');

  select coalesce(xp_total, 0), coalesce(weekly_xp, 0)
  into v_current_xp, v_current_weekly
  from public.users
  where id = p_user_id
  for update;

  if not found then
    return jsonb_build_object(
      'ok', false,
      'reason', 'USER_NOT_FOUND',
      'message', 'User profile not found.'
    );
  end if;

  v_new_xp := v_current_xp + p_amount;
  v_new_weekly := v_current_weekly + p_amount;
  v_new_level := greatest(1, floor(v_new_xp / 1000) + 1);

  update public.users
  set xp_total = v_new_xp,
      weekly_xp = v_new_weekly,
      xp_level = v_new_level
  where id = p_user_id;

  insert into public.xp_ledger (user_id, amount, reason, created_at)
  values (p_user_id, p_amount, v_reason, timezone('utc'::text, now()));

  return jsonb_build_object(
    'ok', true,
    'new_xp', v_new_xp,
    'new_weekly_xp', v_new_weekly,
    'new_level', v_new_level,
    'amount_added', p_amount
  );
end;
$$;

revoke execute on function public.increment_xp(uuid, integer, text) from public, anon, authenticated;
grant execute on function public.increment_xp(uuid, integer, text) to service_role;


-- 4. evaluate_weekly_leagues — Monday promotion/demotion + weekly reset (20260921). Server only.
create or replace function public.evaluate_weekly_leagues()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tier text;
  v_next_tier text;
  v_prev_tier text;
  v_now timestamptz := timezone('utc'::text, now());
  v_total_promoted integer := 0;
  v_total_demoted integer := 0;
  v_count integer;
  v_prom_cutoff integer;
  v_dem_cutoff integer;
begin
  for v_tier in select unnest(array['ruby', 'platinum', 'gold', 'silver', 'browns'])
  loop
    v_next_tier := case v_tier
      when 'browns' then 'silver'
      when 'silver' then 'gold'
      when 'gold' then 'platinum'
      when 'platinum' then 'ruby'
      else 'ruby'
    end;

    v_prev_tier := case v_tier
      when 'ruby' then 'platinum'
      when 'platinum' then 'gold'
      when 'gold' then 'silver'
      when 'silver' then 'browns'
      else 'browns'
    end;

    select count(*) into v_count
    from public.users
    where league_tier = v_tier;

    if v_count >= 2 then
      v_prom_cutoff := greatest(1, ceil(v_count * 0.10));
      v_dem_cutoff := greatest(1, v_count - floor(v_count * 0.10) + 1);

      if v_next_tier <> v_tier then
        with ranked as (
          select id, row_number() over (order by weekly_xp desc, xp_total desc) as rk
          from public.users
          where league_tier = v_tier
        )
        update public.users u
        set league_tier = v_next_tier,
            league_history = jsonb_insert(
              coalesce(u.league_history, '[]'::jsonb),
              '{0}',
              jsonb_build_object(
                'timestamp', v_now,
                'outcome', 'promoted',
                'from', v_tier,
                'to', v_next_tier,
                'weekly_xp', u.weekly_xp
              )
            )
        from ranked r
        where u.id = r.id and r.rk <= v_prom_cutoff;

        v_total_promoted := v_total_promoted + v_prom_cutoff;
      end if;

      if v_prev_tier <> v_tier and v_dem_cutoff > v_prom_cutoff then
        with ranked as (
          select id, row_number() over (order by weekly_xp desc, xp_total desc) as rk
          from public.users
          where league_tier = v_tier
        )
        update public.users u
        set league_tier = v_prev_tier,
            league_history = jsonb_insert(
              coalesce(u.league_history, '[]'::jsonb),
              '{0}',
              jsonb_build_object(
                'timestamp', v_now,
                'outcome', 'demoted',
                'from', v_tier,
                'to', v_prev_tier,
                'weekly_xp', u.weekly_xp
              )
            )
        from ranked r
        where u.id = r.id and r.rk >= v_dem_cutoff;

        v_total_demoted := v_total_demoted + (v_count - v_dem_cutoff + 1);
      end if;
    end if;
  end loop;

  update public.users
  set weekly_xp = 0,
      league_cycle_start = v_now,
      last_league_eval = v_now;

  return jsonb_build_object(
    'ok', true,
    'total_promoted', v_total_promoted,
    'total_demoted', v_total_demoted,
    'timestamp', v_now
  );
end;
$$;

revoke execute on function public.evaluate_weekly_leagues() from public, anon, authenticated;
grant execute on function public.evaluate_weekly_leagues() to service_role;


-- 5. portfolio_items — the portfolio tab saves here (20260914_portfolio_persistence)
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  item_type text not null check (item_type in ('pitch','project','projects','certificate','certificates','timeline','achievement','achievements','recommendation','recommendations','github_repo','github_repos','research')),
  item_data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_portfolio_type on public.portfolio_items (user_id, item_type);

alter table public.portfolio_items enable row level security;

drop policy if exists "Users own their portfolio" on public.portfolio_items;
create policy "Users own their portfolio" on public.portfolio_items
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Service role full access on portfolio_items" on public.portfolio_items;
create policy "Service role full access on portfolio_items" on public.portfolio_items
  for all to service_role
  using (true)
  with check (true);

revoke all on public.portfolio_items from anon;


-- 6. quest_completions — shaped to what the app writes
--    (quests workspace: upsert user_id + quest_id; api/student/activity reads by user_id)
create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id text not null,
  quest_title text,
  xp integer,
  score numeric,
  passed boolean,
  language text,
  completed_at timestamptz not null default now()
);

alter table public.quest_completions
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists quest_title text,
  add column if not exists xp integer;

create unique index if not exists uq_quest_completions_user_quest on public.quest_completions (user_id, quest_id);
create index if not exists idx_quest_completions_user_time on public.quest_completions (user_id, completed_at desc);

alter table public.quest_completions enable row level security;

drop policy if exists "quest_completions_select_own" on public.quest_completions;
create policy "quest_completions_select_own" on public.quest_completions
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "quest_completions_insert_own" on public.quest_completions;
create policy "quest_completions_insert_own" on public.quest_completions
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "quest_completions_update_own" on public.quest_completions;
create policy "quest_completions_update_own" on public.quest_completions
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "quest_completions_service_all" on public.quest_completions;
create policy "quest_completions_service_all" on public.quest_completions
  for all to service_role
  using (true)
  with check (true);

revoke all on public.quest_completions from anon;


-- 7. internship_records — shaped to api/internships (server writes; ids look like 'internship_<uuid>')
create table if not exists public.internship_records (
  id text primary key,
  student_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  role text not null,
  start_date date,
  end_date date,
  stipend numeric not null default 0 check (stipend >= 0),
  status text not null default 'active',
  description text,
  skills_used jsonb not null default '[]'::jsonb,
  verified boolean not null default false,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.internship_records
  add column if not exists skills_used jsonb not null default '[]'::jsonb;

create index if not exists idx_internship_records_student_id on public.internship_records (student_id);

alter table public.internship_records enable row level security;

drop policy if exists "internship_records_select_own" on public.internship_records;
create policy "internship_records_select_own" on public.internship_records
  for select to authenticated
  using (auth.uid() = student_id);

drop policy if exists "internship_records_service_all" on public.internship_records;
create policy "internship_records_service_all" on public.internship_records
  for all to service_role
  using (true)
  with check (true);

revoke all on public.internship_records from anon;


-- 8. attention_span_sessions — focus-game history (20260916, unchanged)
create table if not exists public.attention_span_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null,
  game_name text not null,
  game_icon text not null,
  score_display text not null,
  accuracy_earned numeric not null default 0,
  difficulty text not null default 'easy',
  xp_earned int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_attention_span_sessions_user_created
  on public.attention_span_sessions (user_id, created_at desc);

alter table public.attention_span_sessions enable row level security;
revoke all on public.attention_span_sessions from anon;

drop policy if exists "Students can view their own attention span sessions" on public.attention_span_sessions;
create policy "Students can view their own attention span sessions"
  on public.attention_span_sessions for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Students can insert their own attention span sessions" on public.attention_span_sessions;
create policy "Students can insert their own attention span sessions"
  on public.attention_span_sessions for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Students can delete their own attention span sessions" on public.attention_span_sessions;
create policy "Students can delete their own attention span sessions"
  on public.attention_span_sessions for delete to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Service role has full access to attention_span_sessions" on public.attention_span_sessions;
create policy "Service role has full access to attention_span_sessions"
  on public.attention_span_sessions for all to service_role
  using (true)
  with check (true);


-- 9. Arena rooms + matchmaking queue (20260922, secured)
--    Writes: server only (lib/services/arenaPvPStore.ts uses the service key).
--    Reads: the two players of a room (live updates in lib/services/arenaPvPService.ts).
create table if not exists public.arena_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code varchar(16) unique not null,
  problem_id text not null,
  difficulty varchar(32) not null default 'intermediate',
  time_limit_seconds integer not null default 600,
  status varchar(32) not null default 'waiting' check (status in ('waiting', 'ready', 'in_progress', 'completed', 'cancelled')),
  host_id text not null,
  host_name text not null,
  host_avatar text,
  host_ready boolean default false,
  host_progress jsonb default '{"testsPassed": 0, "totalTests": 0, "score": 0, "submitted": false, "code": ""}'::jsonb,
  guest_id text,
  guest_name text,
  guest_avatar text,
  guest_ready boolean default false,
  guest_progress jsonb default '{"testsPassed": 0, "totalTests": 0, "score": 0, "submitted": false, "code": ""}'::jsonb,
  winner_id text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_arena_rooms_code on public.arena_rooms (room_code);
create index if not exists idx_arena_rooms_status on public.arena_rooms (status);
create index if not exists idx_arena_rooms_host_guest on public.arena_rooms (host_id, guest_id);

create table if not exists public.arena_matchmaking_queue (
  id uuid primary key default gen_random_uuid(),
  student_id text not null unique,
  student_name text not null,
  student_avatar text,
  difficulty varchar(32) default 'any',
  elo_rating integer default 1200,
  status varchar(32) default 'searching' check (status in ('searching', 'matched', 'cancelled')),
  matched_room_code varchar(16),
  created_at timestamptz default now()
);

create index if not exists idx_arena_queue_status_diff on public.arena_matchmaking_queue (status, difficulty, created_at);

alter table public.arena_rooms enable row level security;
alter table public.arena_matchmaking_queue enable row level security;

-- Remove the open policies from the repo file if they were ever applied.
drop policy if exists "Allow read arena rooms" on public.arena_rooms;
drop policy if exists "Allow create arena rooms" on public.arena_rooms;
drop policy if exists "Allow update arena rooms" on public.arena_rooms;
drop policy if exists "Allow read arena queue" on public.arena_matchmaking_queue;
drop policy if exists "Allow insert arena queue" on public.arena_matchmaking_queue;
drop policy if exists "Allow update arena queue" on public.arena_matchmaking_queue;
drop policy if exists "Allow delete arena queue" on public.arena_matchmaking_queue;

drop policy if exists "arena_rooms_players_read" on public.arena_rooms;
create policy "arena_rooms_players_read" on public.arena_rooms
  for select to authenticated
  using (host_id = auth.uid()::text or guest_id = auth.uid()::text);

drop policy if exists "arena_rooms_service_all" on public.arena_rooms;
create policy "arena_rooms_service_all" on public.arena_rooms
  for all to service_role
  using (true)
  with check (true);

drop policy if exists "arena_queue_service_all" on public.arena_matchmaking_queue;
create policy "arena_queue_service_all" on public.arena_matchmaking_queue
  for all to service_role
  using (true)
  with check (true);

revoke all on public.arena_rooms from anon;
revoke all on public.arena_matchmaking_queue from anon;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'arena_rooms'
     ) then
    alter publication supabase_realtime add table public.arena_rooms;
  end if;
end $$;


-- 10. Block self-assigned privileged roles on sign-up (20260920_block_privileged_insert)
create or replace function public.prevent_privileged_insert()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  current_pg_role text := current_setting('role', true);
begin
  -- Only client-facing roles are checked; service_role / postgres may create staff accounts.
  if current_pg_role in ('anon', 'authenticated') then
    if new.role is not null and new.role <> 'student' then
      raise exception
        'INSERT rejected: role "%" cannot be self-assigned via client. Privileged roles must be granted by an administrator.',
        new.role
        using errcode = '42501';
    end if;
    new.role := coalesce(new.role, 'student');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_privileged_insert on public.users;
create trigger trg_prevent_privileged_insert
  before insert on public.users
  for each row
  execute function public.prevent_privileged_insert();

commit;

notify pgrst, 'reload schema';
