-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE A — Pins economy + course enrollments (needed by steps 1–3)
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- Built from the repo migrations production is missing, adjusted for production's state:
--   20260913_subbatch_2_1  spend_pins (functions unchanged)
--   20260913_subbatch_2_3  credit_pins, streak_claims (functions unchanged)
--   20260918 + 20260919    lock money/XP functions to the server; secure get_pin_balance
--                           (only the parts whose objects exist in production)
--   20260924               user_crash_enrollments — students may only READ their own rows
--                           (dropped: the student UPDATE policy, the 'student-demo' clause and
--                            the unused, unprotected get_student_pin_wallet function)
--   20260926               one purchase ⇒ one enrollment (unique indexes)
-- Not included (Phase B): fee payments, scholarships, campus ERP, arena, messaging, etc.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

-- 1. Pin columns on users (no-op where they already exist)
alter table public.users
  add column if not exists pin_history jsonb default '[]'::jsonb,
  add column if not exists bonus_pins  int   default 0,
  add column if not exists pins        int   default 50;


-- 2. spend_pins — atomic deduction with a row lock (20260913_subbatch_2_1)
create or replace function public.spend_pins(
    p_user_id uuid,
    p_amount integer,
    p_reason text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_current_pins integer;
    v_new_balance integer;
    v_tx_id text;
    v_new_tx jsonb;
begin
    if p_amount <= 0 then
        return jsonb_build_object('ok', false, 'reason', 'INVALID_AMOUNT');
    end if;

    select pins into v_current_pins
    from public.users
    where id = p_user_id
    for update;

    if not found then
        return jsonb_build_object('ok', false, 'reason', 'USER_NOT_FOUND');
    end if;

    if v_current_pins is null then
        v_current_pins := 120;
    end if;

    if v_current_pins < p_amount then
        return jsonb_build_object('ok', false, 'reason', 'INSUFFICIENT_PINS', 'current_balance', v_current_pins);
    end if;

    v_new_balance := v_current_pins - p_amount;
    v_tx_id := 'tx_' || floor(extract(epoch from now()) * 1000)::text || '_' || substr(md5(random()::text), 1, 6);
    v_new_tx := jsonb_build_object(
        'id', v_tx_id,
        'type', 'spend',
        'amount', p_amount,
        'reason', p_reason,
        'timestamp', floor(extract(epoch from now()) * 1000)
    );

    update public.users
    set pins = v_new_balance,
        pin_history = (
            select jsonb_agg(elem)
            from (
                select v_new_tx as elem
                union all
                select elem from jsonb_array_elements(coalesce(pin_history, '[]'::jsonb)) as elem
                limit 100
            ) s
        )
    where id = p_user_id;

    return jsonb_build_object('ok', true, 'new_balance', v_new_balance);
end;
$$;


-- 3. credit_pins — atomic credit with a row lock (20260913_subbatch_2_3)
create or replace function public.credit_pins(
  p_user_id uuid,
  p_amount integer,
  p_reason text default '',
  p_source text default 'admin_grant'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_pins integer;
  v_new_balance integer;
  v_tx_id text;
  v_new_tx jsonb;
begin
  if p_amount <= 0 then
    return jsonb_build_object('ok', false, 'reason', 'INVALID_AMOUNT');
  end if;

  select pins into v_current_pins
  from public.users
  where id = p_user_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'USER_NOT_FOUND');
  end if;

  if v_current_pins is null then
    v_current_pins := 120;
  end if;

  v_new_balance := v_current_pins + p_amount;
  v_tx_id := 'tx_earn_' || floor(extract(epoch from now()) * 1000)::text || '_' || substr(md5(random()::text), 1, 6);
  v_new_tx := jsonb_build_object(
    'id', v_tx_id,
    'type', 'earn',
    'amount', p_amount,
    'reason', p_reason,
    'source', p_source,
    'timestamp', floor(extract(epoch from now()) * 1000)
  );

  update public.users
  set pins = v_new_balance,
      pin_history = jsonb_path_query_array(
        jsonb_insert(coalesce(pin_history, '[]'::jsonb), '{0}', v_new_tx),
        '$[0 to 99]'
      )
  where id = p_user_id;

  return jsonb_build_object('ok', true, 'new_balance', v_new_balance, 'tx_id', v_tx_id);
end;
$$;


-- 4. Only the server (service_role) may move pins. Without this, any logged-in user
--    could call these from the browser with any user id and amount.
revoke execute on function public.spend_pins(uuid, integer, text) from public, anon, authenticated;
revoke execute on function public.credit_pins(uuid, integer, text, text) from public, anon, authenticated;
grant execute on function public.spend_pins(uuid, integer, text) to service_role;
grant execute on function public.credit_pins(uuid, integer, text, text) to service_role;

-- XP / badge / AI-minute / grace functions that exist: server only (20260919 §3).
do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.increment_xp(uuid, integer, text)',
    'public.award_prestige_badge(uuid, text, text)',
    'public.purchase_ai_minutes(uuid, integer, integer)',
    'public.apply_feature_grace_extension(uuid, text, integer)',
    'public.perform_daily_pin_reset()'
  ] loop
    if to_regprocedure(fn) is not null then
      execute format('revoke execute on function %s from public, anon, authenticated', fn);
      execute format('grant execute on function %s to service_role', fn);
    end if;
  end loop;
end $$;


-- 5. get_pin_balance — a student reads only their own balance (secure version, 20260919 §4).
--    Browser caller: src/hooks/usePinBalance.ts (always the logged-in user's id).
create or replace function public.get_pin_balance(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pins integer;
begin
  if auth.uid() is distinct from p_user_id
     and coalesce(auth.jwt() ->> 'role', '') <> 'service_role' then
    raise exception 'Not allowed to read another user''s pin balance' using errcode = '42501';
  end if;
  select pins into v_pins from public.users where id = p_user_id;
  return coalesce(v_pins, 0);
end;
$$;

revoke execute on function public.get_pin_balance(uuid) from public, anon;
grant execute on function public.get_pin_balance(uuid) to authenticated, service_role;


-- 6. streak_claims — one bonus per streak milestone (20260913_subbatch_2_3 §3)
create table if not exists public.streak_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  milestone integer not null,
  pins_granted integer not null default 50,
  claimed_at timestamptz default timezone('utc'::text, now()),
  constraint uq_user_milestone unique (user_id, milestone)
);

alter table public.streak_claims enable row level security;

drop policy if exists "streak_claims_read_own" on public.streak_claims;
create policy "streak_claims_read_own" on public.streak_claims
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "streak_claims_admin_all" on public.streak_claims;
create policy "streak_claims_admin_all" on public.streak_claims
  for all to service_role
  using (true)
  with check (true);


-- 7. user_crash_enrollments — course plan enrollments (20260924, tightened)
create table if not exists public.user_crash_enrollments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id text unique not null,
  user_id text not null,
  plan_id text not null,
  track text not null default 'web_fullstack',
  amount_paid numeric(10, 2) not null default 0.00,
  payment_id text not null default '',
  order_id text default '',
  payment_method text not null default 'sandbox',
  status text not null default 'active',
  enrolled_at timestamptz not null default now(),
  current_sprint int not null default 1 check (current_sprint between 1 and 4),
  daily_learning_hours_target int not null default 1,
  reward_pins_credited int not null default 0,
  pins_deducted int not null default 0,
  milestone_progress jsonb not null default '{
    "sprint1Approved": false,
    "sprint2Approved": false,
    "sprint3RepoUrl": null,
    "sprint3LiveUrl": null,
    "sprint4DefenseScore": null
  }'::jsonb,
  certificates_issued jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_crash_enrollments_user_id on public.user_crash_enrollments(user_id);
create index if not exists idx_crash_enrollments_user_status on public.user_crash_enrollments(user_id, status);
create index if not exists idx_crash_enrollments_plan_id on public.user_crash_enrollments(plan_id);
create index if not exists idx_crash_enrollments_enrolled_at on public.user_crash_enrollments(enrolled_at desc);

create or replace function public.set_updated_at_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_set_crash_enrollments_updated_at on public.user_crash_enrollments;
create trigger trigger_set_crash_enrollments_updated_at
  before update on public.user_crash_enrollments
  for each row
  execute function public.set_updated_at_timestamp();

alter table public.user_crash_enrollments enable row level security;

-- Students read their own enrollments; every write goes through the server (service_role).
drop policy if exists "Students can view own crash enrollments" on public.user_crash_enrollments;
create policy "Students can view own crash enrollments"
  on public.user_crash_enrollments
  for select to authenticated
  using (auth.uid()::text = user_id);

drop policy if exists "Students can update own milestone submissions" on public.user_crash_enrollments;

drop policy if exists "Service role full access on crash enrollments" on public.user_crash_enrollments;
create policy "Service role full access on crash enrollments"
  on public.user_crash_enrollments
  for all to service_role
  using (true)
  with check (true);

revoke all on public.user_crash_enrollments from anon;


-- 8. One purchase ⇒ one enrollment (20260926_course_enrollment_uniqueness)
create unique index if not exists uniq_active_crash_enrollment_per_plan
  on public.user_crash_enrollments (user_id, plan_id)
  where status = 'active';

create unique index if not exists uniq_crash_enrollment_card_payment
  on public.user_crash_enrollments (payment_id)
  where payment_method = 'razorpay';

commit;

-- Make the API see the new tables and functions immediately.
notify pgrst, 'reload schema';
