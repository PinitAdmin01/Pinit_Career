-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE B4d — Study-abroad consultant fields on student profiles
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- What is broken in production today and fixed here:
--   • The consultant portal's pipeline is always empty and "add student" saves nothing: both use
--     8 profile columns that do not exist (phone, program_type, target_country,
--     target_universities, study_abroad_status, visa_status, tasks, documents).
--
-- Added protection: the consultant-managed fields (application stage, visa status, tasks,
-- documents) cannot be changed by the student on their own profile; the consultant routes
-- (server) and staff can. Same pattern as prevent_privilege_escalation: a student's change to
-- those fields is ignored, the rest of their profile save goes through.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

do $$
begin
  if to_regprocedure('public.campus_is_staff()') is null then
    raise exception 'public.campus_is_staff() missing — stop and tell Claude';
  end if;
end $$;

-- 1. Profile columns used by the consultant portal
alter table public.users
  add column if not exists phone               text,
  add column if not exists program_type        text,
  add column if not exists target_country      text,
  add column if not exists target_universities jsonb not null default '[]'::jsonb,
  add column if not exists study_abroad_status text,
  add column if not exists visa_status         text,
  add column if not exists tasks               jsonb not null default '[]'::jsonb,
  add column if not exists documents           jsonb not null default '[]'::jsonb;

-- 2. Students cannot change the consultant-managed fields on their own profile
create or replace function public.protect_consultant_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and auth.uid() = old.id and not public.campus_is_staff() then
    new.study_abroad_status := old.study_abroad_status;
    new.visa_status := old.visa_status;
    new.tasks := old.tasks;
    new.documents := old.documents;
  end if;
  return new;
end;
$$;
revoke execute on function public.protect_consultant_fields() from public, anon, authenticated;

drop trigger if exists trg_protect_consultant_fields on public.users;
create trigger trg_protect_consultant_fields
  before update on public.users
  for each row execute function public.protect_consultant_fields();

commit;

notify pgrst, 'reload schema';
