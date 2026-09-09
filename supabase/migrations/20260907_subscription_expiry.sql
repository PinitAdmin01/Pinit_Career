-- supabase/migrations/20260907_subscription_expiry.sql
-- PinIT Career OS: Record a real subscription period instead of an imaginary one.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- WHY
-- ─────────────────────────────────────────────────────────────────────────────
-- public.users stores subscription_tier and nothing else. Once it is set to
-- 'pro' it never lapses: there is no start date, no end date and no status, so
-- a subscription cannot renew, expire, or be revoked on refund or chargeback,
-- and MRR / churn cannot be derived from the database at all.
--
-- Worse, the client currently INVENTS an expiry to display:
--
--     // src/lib/api/client.ts  (/api/payment/status)
--     endsAt: tier !== 'free'
--       ? new Date(Date.now() + 30 * 86400000).toISOString()   <-- recomputed
--       : null                                                      every call
--
-- That date slides forward forever, so the UI shows the user an expiry that is
-- always ~30 days away no matter when they paid. This migration provides a real
-- value for that field to read.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- SCOPE — deliberately NON-ENFORCING
-- ─────────────────────────────────────────────────────────────────────────────
-- This migration only RECORDS the subscription period. It does not gate any
-- feature on it. That is intentional: at the time of writing, nothing in the
-- codebase reads subscription_tier to grant access — no server route, no client
-- feature check — and /api/payment/status returns identical limits for 'free'
-- and 'pro'. Enforcing an expiry against an entitlement that does not yet exist
-- would gate nothing while risking locking out paying users.
--
-- When Pro genuinely unlocks something, enforce it with is_subscription_active()
-- below, in RLS and server routes — never in client code.
--
-- Every statement is additive and idempotent. No table, column, policy or row
-- is dropped.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Columns ─────────────────────────────────────────────────────────────────
alter table public.users
  add column if not exists subscription_started_at timestamptz,
  add column if not exists subscription_expires_at timestamptz,
  add column if not exists subscription_status text default 'none';

comment on column public.users.subscription_started_at is
  'UTC instant the current paid period began. Null for users who never paid.';
comment on column public.users.subscription_expires_at is
  'UTC instant the current paid period ends. Null means no active period. '
  'Treat a NULL expiry on a paid tier as legacy data, not as unlimited access.';
comment on column public.users.subscription_status is
  'none | active | expired | cancelled | refunded. Advisory; expires_at is authoritative.';

-- 2. Backfill legacy 'pro' rows ──────────────────────────────────────────────
-- Users who bought Pro before this migration have no dates at all. Give them a
-- generous forward-dated period so that IF enforcement is ever switched on they
-- are not immediately locked out of something they paid for. This runs first
-- and separately from any enforcement, exactly so that ordering can never
-- revoke access from an existing customer.
update public.users
   set subscription_started_at = coalesce(subscription_started_at, now()),
       subscription_expires_at = coalesce(subscription_expires_at, now() + interval '1 year'),
       subscription_status     = case
                                   when subscription_status is null or subscription_status = 'none'
                                     then 'active'
                                   else subscription_status
                                 end
 where coalesce(subscription_tier, 'free') <> 'free'
   and subscription_expires_at is null;

-- 3. Authoritative activity check ────────────────────────────────────────────
-- Single source of truth for "is this user actually a paying subscriber right
-- now". Use this from RLS and server routes when entitlements exist. Never
-- decide access from subscription_tier alone — that is the field that never
-- lapses. A NULL expiry returns false: absence of a period is not a licence.
create or replace function public.is_subscription_active(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users u
     where u.id = uid
       and coalesce(u.subscription_tier, 'free') <> 'free'
       and u.subscription_expires_at is not null
       and u.subscription_expires_at > now()
  );
$$;

grant execute on function public.is_subscription_active(uuid) to authenticated;

-- 4. Extend privilege-escalation protection ──────────────────────────────────
-- CRITICAL. The existing trigger blocks self-service edits to role, pins,
-- subscription_tier, ats_score and trust_score. The three new columns are NOT
-- covered by it, so without this change a user could simply UPDATE their own
-- row and push subscription_expires_at years into the future — granting
-- themselves a free subscription the moment enforcement is added.
--
-- This is CREATE OR REPLACE on the existing function: every original protection
-- is preserved verbatim and the new columns are added alongside them. Nothing
-- is removed. The trigger binding itself is untouched.
create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     or new.pins is distinct from old.pins
     or coalesce(new.subscription_tier, 'free') is distinct from coalesce(old.subscription_tier, 'free')
     or new.ats_score is distinct from old.ats_score
     or new.trust_score is distinct from old.trust_score
     -- added 2026-09-07: subscription period is server-owned
     or new.subscription_started_at is distinct from old.subscription_started_at
     or new.subscription_expires_at is distinct from old.subscription_expires_at
     or coalesce(new.subscription_status, 'none') is distinct from coalesce(old.subscription_status, 'none') then
    if auth.uid() is not null and auth.uid() = old.id then
      -- Block self-service privilege / economy / score / subscription forgery
      new.role                    := old.role;
      new.pins                    := old.pins;
      new.subscription_tier       := old.subscription_tier;
      new.ats_score               := old.ats_score;
      new.trust_score             := old.trust_score;
      new.subscription_started_at := old.subscription_started_at;
      new.subscription_expires_at := old.subscription_expires_at;
      new.subscription_status     := old.subscription_status;
    end if;
  end if;
  return new;
end;
$$;

-- 5. Index for expiry sweeps ─────────────────────────────────────────────────
-- Supports "which subscriptions lapse soon" queries for renewal reminders and
-- any future expiry cron, without a full table scan.
create index if not exists idx_users_subscription_expires_at
  on public.users (subscription_expires_at)
  where subscription_expires_at is not null;
