-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE B1 — Student profile saves, XP, badges, AI minutes, grace extensions
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- Why this first: the users trigger prevent_privilege_escalation() (from 20260920, applied)
-- reads users.unlocked_items and users.badges, which production does not have. Every update a
-- student's own session makes to their users row fails with
--   record "new" has no field "unlocked_items"
-- Adding the columns fixes that. The rest is what the XP / badge / AI-minute routes call.
--
-- Built from 20260913_subbatch_2_5 and 20260913_subbatch_2_4 (function logic unchanged), plus:
--   • SET search_path = public on every SECURITY DEFINER function
--   • EXECUTE only for service_role (callers: api/xp/add, api/quest/complete,
--     api/user/award-badge, api/pins/buy-ai-minutes — all use the service key)
--   • an index for the daily XP cap query in api/xp/add
-- ─────────────────────────────────────────────────────────────────────────────

begin;

-- 1. users columns the trigger and the XP / unlock features need (no-op where present)
alter table public.users
  add column if not exists unlocked_items      jsonb   default '{}'::jsonb,
  add column if not exists badges              text[]  default '{}'::text[],
  add column if not exists xp_total            integer default 0,
  add column if not exists xp_level            integer default 1,
  add column if not exists career_dna_score    integer default 0,
  add column if not exists communication_score integer,
  add column if not exists interviews_done     integer default 0;


-- 2. If one of these functions already exists with a different return type,
--    CREATE OR REPLACE would fail. Drop only that exact signature.
do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.increment_xp(uuid, integer, text)',
    'public.award_prestige_badge(uuid, text, text)',
    'public.apply_feature_grace_extension(uuid, text, integer)',
    'public.purchase_ai_minutes(uuid, integer, integer)'
  ] loop
    if to_regprocedure(fn) is not null
       and (select prorettype from pg_proc where oid = to_regprocedure(fn)) <> 'jsonb'::regtype then
      execute format('drop function %s', fn);
    end if;
  end loop;
end $$;


-- 3. XP ledger + increment_xp (2_5, defect 048)
create table if not exists public.xp_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  amount integer not null,
  reason text not null,
  created_at timestamptz default timezone('utc'::text, now())
);

create index if not exists idx_xp_ledger_user_created on public.xp_ledger (user_id, created_at desc);

alter table public.xp_ledger enable row level security;

drop policy if exists "xp_ledger_read_own" on public.xp_ledger;
create policy "xp_ledger_read_own" on public.xp_ledger
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "xp_ledger_admin_all" on public.xp_ledger;
create policy "xp_ledger_admin_all" on public.xp_ledger
  for all to service_role
  using (true)
  with check (true);

revoke all on public.xp_ledger from anon;

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

  select coalesce(xp_total, 0) into v_current_xp
  from public.users
  where id = p_user_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'USER_NOT_FOUND');
  end if;

  v_new_xp := v_current_xp + p_amount;
  -- Level = floor(sqrt(xp / 100)) + 1
  v_new_level := greatest(1, floor(sqrt(v_new_xp::float / 100.0))::integer + 1);

  update public.users
  set xp_total = v_new_xp,
      xp_level = v_new_level
  where id = p_user_id;

  insert into public.xp_ledger (user_id, amount, reason, created_at)
  values (p_user_id, p_amount, v_reason, now());

  return jsonb_build_object(
    'ok', true,
    'new_xp', v_new_xp,
    'new_level', v_new_level,
    'amount_added', p_amount
  );
end;
$$;


-- 4. Milestones + award_prestige_badge (2_5, defect 049)
create table if not exists public.user_milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  milestone_key text not null,
  awarded_at timestamptz default timezone('utc'::text, now()),
  constraint uq_user_milestones_user_key unique (user_id, milestone_key)
);

alter table public.user_milestones enable row level security;

drop policy if exists "user_milestones_read_own" on public.user_milestones;
create policy "user_milestones_read_own" on public.user_milestones
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "user_milestones_admin_all" on public.user_milestones;
create policy "user_milestones_admin_all" on public.user_milestones
  for all to service_role
  using (true)
  with check (true);

revoke all on public.user_milestones from anon;

create or replace function public.award_prestige_badge(
  p_user_id uuid,
  p_badge_id text,
  p_milestone_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exists boolean;
  v_xp_res jsonb;
begin
  if p_badge_id is null or trim(p_badge_id) = '' or p_milestone_key is null or trim(p_milestone_key) = '' then
    return jsonb_build_object('ok', false, 'reason', 'INVALID_BADGE_PARAMS');
  end if;

  select exists (
    select 1 from public.user_milestones
    where user_id = p_user_id and milestone_key = p_milestone_key
  ) into v_exists;

  if v_exists then
    return jsonb_build_object(
      'ok', true,
      'newly_awarded', false,
      'message', 'Prestige milestone has already been claimed.'
    );
  end if;

  insert into public.user_milestones (user_id, milestone_key, awarded_at)
  values (p_user_id, p_milestone_key, now());

  update public.users
  set badges = array_append(coalesce(badges, '{}'::text[]), p_badge_id)
  where id = p_user_id
    and not (p_badge_id = any(coalesce(badges, '{}'::text[])));

  v_xp_res := public.increment_xp(p_user_id, 500, 'Prestige Milestone: ' || p_badge_id);

  return jsonb_build_object(
    'ok', true,
    'newly_awarded', true,
    'xp_granted', 500,
    'badge_id', p_badge_id,
    'new_xp', v_xp_res -> 'new_xp',
    'new_level', v_xp_res -> 'new_level'
  );
end;
$$;


-- 5. Grace claims + apply_feature_grace_extension (2_4, defect 044)
create table if not exists public.feature_grace_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  item_key text not null,
  cycle_id text not null,
  new_expires_at bigint not null,
  granted_at timestamptz default timezone('utc'::text, now())
);

alter table public.feature_grace_claims enable row level security;

drop policy if exists "feature_grace_claims_read_own" on public.feature_grace_claims;
create policy "feature_grace_claims_read_own" on public.feature_grace_claims
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "feature_grace_claims_admin_all" on public.feature_grace_claims;
create policy "feature_grace_claims_admin_all" on public.feature_grace_claims
  for all to service_role
  using (true)
  with check (true);

revoke all on public.feature_grace_claims from anon;

create or replace function public.apply_feature_grace_extension(
  p_user_id uuid,
  p_item_key text,
  p_minutes integer default 15
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_unlocked jsonb;
  v_expires_val jsonb;
  v_expires_at bigint;
  v_cycle_id text;
  v_clamped_minutes integer;
  v_now_ms bigint;
  v_new_expires_at bigint;
  v_claim_exists boolean;
begin
  select unlocked_items into v_unlocked
  from public.users
  where id = p_user_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'USER_NOT_FOUND');
  end if;

  v_unlocked := coalesce(v_unlocked, '{}'::jsonb);
  v_expires_val := v_unlocked -> p_item_key;

  if v_expires_val is null then
    return jsonb_build_object('ok', false, 'reason', 'ITEM_NOT_ACTIVE');
  end if;

  v_expires_at := (v_expires_val)::text::bigint;
  v_now_ms := (extract(epoch from now()) * 1000)::bigint;

  -- No grace if the item expired more than 5 minutes ago
  if v_expires_at < (v_now_ms - 300000) then
    return jsonb_build_object('ok', false, 'reason', 'ITEM_EXPIRED_WINDOW_CLOSED');
  end if;

  select exists (
    select 1 from public.feature_grace_claims
    where user_id = p_user_id
      and item_key = p_item_key
      and new_expires_at >= v_expires_at
  ) into v_claim_exists;

  if v_claim_exists then
    return jsonb_build_object('ok', false, 'reason', 'GRACE_ALREADY_CLAIMED');
  end if;

  v_clamped_minutes := least(15, greatest(5, coalesce(p_minutes, 15)));
  v_new_expires_at := greatest(v_expires_at, v_now_ms) + (v_clamped_minutes * 60 * 1000)::bigint;
  v_cycle_id := 'cycle_' || v_new_expires_at::text;

  insert into public.feature_grace_claims (user_id, item_key, cycle_id, new_expires_at, granted_at)
  values (p_user_id, p_item_key, v_cycle_id, v_new_expires_at, now());

  update public.users
  set unlocked_items = jsonb_set(v_unlocked, array[p_item_key], to_jsonb(v_new_expires_at))
  where id = p_user_id;

  return jsonb_build_object(
    'ok', true,
    'new_expires_at', v_new_expires_at,
    'minutes_granted', v_clamped_minutes
  );
end;
$$;


-- 6. AI minute purchases + purchase_ai_minutes (2_4, defect 046)
create table if not exists public.ai_minutes_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  minutes integer not null default 30,
  cost_pins integer not null default 100,
  purchased_at timestamptz default timezone('utc'::text, now())
);

create index if not exists idx_ai_minutes_purchases_user_time on public.ai_minutes_purchases (user_id, purchased_at desc);

alter table public.ai_minutes_purchases enable row level security;

drop policy if exists "ai_minutes_purchases_read_own" on public.ai_minutes_purchases;
create policy "ai_minutes_purchases_read_own" on public.ai_minutes_purchases
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "ai_minutes_purchases_admin_all" on public.ai_minutes_purchases;
create policy "ai_minutes_purchases_admin_all" on public.ai_minutes_purchases
  for all to service_role
  using (true)
  with check (true);

revoke all on public.ai_minutes_purchases from anon;

create or replace function public.purchase_ai_minutes(
  p_user_id uuid,
  p_cost integer default 100,
  p_minutes integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today_count integer;
  v_pins integer;
  v_new_balance integer;
  v_history jsonb;
  v_tx_id text;
  v_tx_record jsonb;
  v_cost integer := coalesce(p_cost, 100);
  v_minutes integer := coalesce(p_minutes, 30);
begin
  -- At most 2 purchases per UTC day
  select count(*) into v_today_count
  from public.ai_minutes_purchases
  where user_id = p_user_id
    and purchased_at >= current_date;

  if v_today_count >= 2 then
    return jsonb_build_object(
      'ok', false,
      'reason', 'DAILY_AI_MINUTES_LIMIT_EXCEEDED',
      'purchases_today', v_today_count,
      'max_allowed', 2
    );
  end if;

  select pins, coalesce(pin_history, '[]'::jsonb) into v_pins, v_history
  from public.users
  where id = p_user_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'USER_NOT_FOUND');
  end if;

  if v_pins is null or v_pins < v_cost then
    return jsonb_build_object(
      'ok', false,
      'reason', 'INSUFFICIENT_PINS',
      'current_balance', coalesce(v_pins, 0),
      'required', v_cost
    );
  end if;

  v_new_balance := v_pins - v_cost;
  v_tx_id := 'tx_' || gen_random_uuid()::text;

  v_tx_record := jsonb_build_object(
    'id', v_tx_id,
    'type', 'spend',
    'amount', v_cost,
    'reason', 'Extended daily AI by ' || v_minutes || ' mins',
    'source', 'ai_minutes_extend',
    'timestamp', (extract(epoch from now()) * 1000)::bigint
  );

  update public.users
  set pins = v_new_balance,
      pin_history = jsonb_path_query_array(
        jsonb_build_array(v_tx_record) || v_history,
        '$[0 to 99]'
      )
  where id = p_user_id;

  insert into public.ai_minutes_purchases (user_id, minutes, cost_pins, purchased_at)
  values (p_user_id, v_minutes, v_cost, now());

  return jsonb_build_object(
    'ok', true,
    'new_balance', v_new_balance,
    'minutes_added', v_minutes,
    'purchases_today', v_today_count + 1,
    'remaining_today', 2 - (v_today_count + 1),
    'transaction_id', v_tx_id
  );
end;
$$;


-- 7. Only the server (service_role) may award XP, badges, AI minutes or grace.
revoke execute on function public.increment_xp(uuid, integer, text) from public, anon, authenticated;
revoke execute on function public.award_prestige_badge(uuid, text, text) from public, anon, authenticated;
revoke execute on function public.apply_feature_grace_extension(uuid, text, integer) from public, anon, authenticated;
revoke execute on function public.purchase_ai_minutes(uuid, integer, integer) from public, anon, authenticated;
grant execute on function public.increment_xp(uuid, integer, text) to service_role;
grant execute on function public.award_prestige_badge(uuid, text, text) to service_role;
grant execute on function public.apply_feature_grace_extension(uuid, text, integer) to service_role;
grant execute on function public.purchase_ai_minutes(uuid, integer, integer) to service_role;

commit;

notify pgrst, 'reload schema';
