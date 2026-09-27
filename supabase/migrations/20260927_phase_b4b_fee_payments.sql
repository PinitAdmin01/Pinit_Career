-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE B4b — Campus fee payments
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- What is broken in production today and fixed here:
--   • Paying a fee installment never completes: before recording a payment the server takes a
--     lock in payment_idempotency_keys, which does not exist, so it answers "payment already in
--     progress" — even after Razorpay has taken the money (the webhook fails the same way).
--   • A student can insert payment records for themselves in finance_transactions (they show up
--     as revenue on the finance dashboard).
--
-- Built from 20260913_subbatch_2_1 (payment_idempotency_keys only). NOT added: the relational fee
-- model (student_fee_dues / fee_installments / applied_scholarships / fee_payments and their
-- functions). Production data lives in finance_dues, and the app would stop using it for payments
-- as soon as those functions exist.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

do $$
begin
  if to_regprocedure('public.campus_is_staff()') is null or to_regclass('public.finance_transactions') is null
     or to_regprocedure('public.campus_is_self(text)') is null then
    raise exception 'campus_is_staff() / campus_is_self(text) / finance_transactions missing — stop and tell Claude';
  end if;
end $$;


-- 1. Payment locks (one payment at a time per installment, across server instances). Server only.
create table if not exists public.payment_idempotency_keys (
  key        text primary key,
  user_id    text,
  locked_at  timestamptz not null default now(),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 seconds')
);
create index if not exists idx_payment_idempotency_keys_expires on public.payment_idempotency_keys (expires_at);

alter table public.payment_idempotency_keys enable row level security;
drop policy if exists "Service role manages payment locks" on public.payment_idempotency_keys;
create policy "Service role manages payment locks" on public.payment_idempotency_keys
  for all to service_role using (true) with check (true);
revoke all on public.payment_idempotency_keys from anon, authenticated;


-- 2. Finance transactions: students read their own; only staff and the server write them.
alter table public.finance_transactions enable row level security;
drop policy if exists campus_own_or_staff on public.finance_transactions;
drop policy if exists "Students read own finance transactions" on public.finance_transactions;
create policy "Students read own finance transactions" on public.finance_transactions
  for select to authenticated
  using (public.campus_is_staff() or public.campus_is_self(student_id));
drop policy if exists "Staff manage finance transactions" on public.finance_transactions;
create policy "Staff manage finance transactions" on public.finance_transactions
  for all to authenticated
  using (public.campus_is_staff()) with check (public.campus_is_staff());
drop policy if exists "Service role manages finance transactions" on public.finance_transactions;
create policy "Service role manages finance transactions" on public.finance_transactions
  for all to service_role using (true) with check (true);
revoke all on public.finance_transactions from anon;

commit;

notify pgrst, 'reload schema';
