-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE B6a — Fee records: finance staff (admins) only, not every teacher
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- Today "campus staff" (campus_is_staff: admin, superadmin, teacher, faculty) decides who may read
-- and change fee records, so any teacher can read every student's fees, mark installments paid,
-- change amounts or add payment records. Fee records now follow the finance office: admins and the
-- server (payments, webhook). Teachers keep their other campus access unchanged.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

do $$
begin
  if to_regclass('public.finance_dues') is null or to_regclass('public.finance_transactions') is null
     or to_regprocedure('public.campus_is_self(text)') is null then
    raise exception 'finance tables / campus_is_self(text) missing — stop and tell Claude';
  end if;
end $$;

-- 1. Who counts as finance staff: admins (and the server)
create or replace function public.campus_is_finance_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select current_user = 'service_role'
    or (auth.jwt() ->> 'role') = 'service_role'
    or exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin', 'superadmin'));
$$;
revoke execute on function public.campus_is_finance_staff() from public, anon;
grant execute on function public.campus_is_finance_staff() to authenticated, service_role;

-- 2. Fee dues: students read their own; finance staff read and manage all
alter table public.finance_dues enable row level security;
drop policy if exists campus_dues_select_own on public.finance_dues;
create policy campus_dues_select_own on public.finance_dues
  for select to authenticated
  using (student_id = auth.uid()::text or public.campus_is_finance_staff());
drop policy if exists campus_dues_staff_all on public.finance_dues;
create policy campus_dues_staff_all on public.finance_dues
  for all to authenticated
  using (public.campus_is_finance_staff()) with check (public.campus_is_finance_staff());

-- The guard trigger on fee dues: only finance staff (and the server) may change or delete them
create or replace function public.check_finance_dues_immutable()
returns trigger
language plpgsql
as $$
begin
  if not public.campus_is_finance_staff() then
    raise exception 'Only the finance office can modify or delete finance dues records';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

-- 3. Payment records: students read their own; finance staff manage them; the server writes them
drop policy if exists "Students read own finance transactions" on public.finance_transactions;
create policy "Students read own finance transactions" on public.finance_transactions
  for select to authenticated
  using (public.campus_is_finance_staff() or public.campus_is_self(student_id));
drop policy if exists "Staff manage finance transactions" on public.finance_transactions;
create policy "Staff manage finance transactions" on public.finance_transactions
  for all to authenticated
  using (public.campus_is_finance_staff()) with check (public.campus_is_finance_staff());

commit;

notify pgrst, 'reload schema';
