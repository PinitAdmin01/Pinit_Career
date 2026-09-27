-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE B4a — Parent links + recruiter activity
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- What is broken in production today and fixed here (the tables do not exist):
--   • Parent portal: linking a child by register number "succeeds" but nothing is saved
--     (api/parent/link-student), so the parent's student list and the student overview stay empty.
--   • Recruiter shortlist / contact request / interview scheduling record nothing
--     (api/recruiter/*), and the recruiter activity log is never saved.
--
-- Built from 20260925_portal_real_data_and_permissions and 20260916_create_recruiter_activity_logs.
-- NOT copied from them:
--   • any signed-in user creating a parent link for any student (status defaulted to 'approved',
--     which also let them read that student's whole profile): links are written only by the
--     server route; a new link defaults to 'pending'
--   • any signed-in user inserting recruiter interactions as themselves: written only by the
--     recruiter routes (service role)
-- Kept: parent / student / staff can read their links; recruiter / candidate / staff can read
-- their interactions; recruiters write and read their own activity log.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

do $$
begin
  if to_regprocedure('public.campus_is_staff()') is null or to_regprocedure('public.is_staff_reader()') is null then
    raise exception 'public.campus_is_staff() / public.is_staff_reader() missing — stop and tell Claude';
  end if;
end $$;


-- ═══ 1. PARENT ↔ STUDENT LINKS ═══

create table if not exists public.parent_student_links (
  id         uuid primary key default gen_random_uuid(),
  parent_id  uuid not null references public.users(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  status     varchar(32) not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_parent_student_link unique (parent_id, student_id),
  constraint parent_student_links_status_check check (status in ('pending', 'approved', 'revoked'))
);
create index if not exists idx_parent_student_links_parent on public.parent_student_links(parent_id);
create index if not exists idx_parent_student_links_student on public.parent_student_links(student_id);

alter table public.parent_student_links enable row level security;
drop policy if exists "Parents can view their own student links" on public.parent_student_links;
create policy "Parents can view their own student links" on public.parent_student_links
  for select to authenticated
  using (auth.uid() = parent_id or auth.uid() = student_id or public.is_staff_reader() or public.campus_is_staff());
drop policy if exists "Parents can create student links" on public.parent_student_links;
drop policy if exists "Parents or staff can delete student links" on public.parent_student_links;
drop policy if exists "Service role manages parent links" on public.parent_student_links;
create policy "Service role manages parent links" on public.parent_student_links
  for all to service_role using (true) with check (true);
revoke all on public.parent_student_links from anon;
revoke insert, update, delete on public.parent_student_links from authenticated;

-- A parent with an approved link may read that student's profile row.
create or replace function public.is_linked_parent(target_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.parent_student_links
    where parent_id = auth.uid() and student_id = target_student_id and status = 'approved'
  );
$$;
revoke execute on function public.is_linked_parent(uuid) from public, anon;
grant execute on function public.is_linked_parent(uuid) to authenticated, service_role;

drop policy if exists "Linked parents can read student profiles" on public.users;
create policy "Linked parents can read student profiles" on public.users
  for select to authenticated
  using (public.is_linked_parent(id));


-- ═══ 2. RECRUITER INTERACTIONS (shortlist, contact request, interview) ═══

create table if not exists public.recruiter_interactions (
  id           uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null references public.users(id) on delete cascade,
  candidate_id uuid not null references public.users(id) on delete cascade,
  action_type  varchar(32) not null,
  status       varchar(32) not null default 'active',
  meta         jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists idx_recruiter_interactions_recruiter on public.recruiter_interactions(recruiter_id);
create index if not exists idx_recruiter_interactions_candidate on public.recruiter_interactions(candidate_id);

alter table public.recruiter_interactions enable row level security;
drop policy if exists "Recruiters and candidates can view interactions" on public.recruiter_interactions;
create policy "Recruiters and candidates can view interactions" on public.recruiter_interactions
  for select to authenticated
  using (auth.uid() = recruiter_id or auth.uid() = candidate_id or public.is_staff_reader() or public.campus_is_staff());
drop policy if exists "Recruiters can insert interactions" on public.recruiter_interactions;
drop policy if exists "Service role manages recruiter interactions" on public.recruiter_interactions;
create policy "Service role manages recruiter interactions" on public.recruiter_interactions
  for all to service_role using (true) with check (true);
revoke all on public.recruiter_interactions from anon;
revoke insert, update, delete on public.recruiter_interactions from authenticated;


-- ═══ 3. RECRUITER ACTIVITY LOG (written by the recruiter's own browser) ═══

create table if not exists public.recruiter_activity_logs (
  id           uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null,
  action       text not null,
  metadata     jsonb default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists idx_recruiter_activity_logs_recruiter_created
  on public.recruiter_activity_logs (recruiter_id, created_at desc);

alter table public.recruiter_activity_logs enable row level security;
drop policy if exists "Recruiters can view their own activity logs" on public.recruiter_activity_logs;
create policy "Recruiters can view their own activity logs" on public.recruiter_activity_logs
  for select to authenticated using (auth.uid() = recruiter_id);
drop policy if exists "Recruiters can insert their own activity logs" on public.recruiter_activity_logs;
create policy "Recruiters can insert their own activity logs" on public.recruiter_activity_logs
  for insert to authenticated with check (auth.uid() = recruiter_id);
drop policy if exists "Service role has full access to recruiter_activity_logs" on public.recruiter_activity_logs;
create policy "Service role has full access to recruiter_activity_logs" on public.recruiter_activity_logs
  for all to service_role using (true) with check (true);
revoke all on public.recruiter_activity_logs from anon;
revoke update, delete on public.recruiter_activity_logs from authenticated;

commit;

notify pgrst, 'reload schema';
