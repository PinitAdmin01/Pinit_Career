-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE B4c — Campus exams, course materials, exam integrity alerts, payroll runs
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- What is broken in production today and fixed here (the tables do not exist):
--   • Teachers' marks (teacher grading screen, api/teacher/submit-marks) are not saved, so
--     students and parents never see exam results.
--   • Course materials uploaded by faculty are not saved.
--   • Tab-switch alerts from online exams never reach the admin fraud inspector.
--   • HR payroll has no once-a-month guard (it can be run again and again).
--
-- Built from 20260915_campus_erp_core with the access rules of 20260919_lock_exam_results_
-- materials_and_money_functions, and 20260914_payroll_runs. NOT copied from 20260915:
--   • any signed-in user writing anyone's exam results or editing course materials
--   • logged-out visitors reading course materials
--   • every student reading every student's exam-integrity alerts
-- Added: each integrity alert is tied to the student who filed it (their own id and name are
-- set by the database), so a student cannot file an alert in someone else's name.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

do $$
begin
  if to_regprocedure('public.campus_is_staff()') is null or to_regprocedure('public.campus_is_self(text)') is null then
    raise exception 'campus_is_staff() / campus_is_self(text) missing — stop and tell Claude';
  end if;
end $$;


-- ═══ 1. EXAM RESULTS: students read their own, staff (teachers/admin) write ═══

create table if not exists public.campus_exam_results (
  id          text primary key default gen_random_uuid()::text,
  exam_id     text not null,
  student_id  text not null,
  score       numeric not null,
  total_marks numeric not null,
  graded_at   timestamptz default timezone('utc'::text, now()),
  constraint uq_campus_exam_results_exam_student unique (exam_id, student_id)
);
create index if not exists idx_exam_results_student on public.campus_exam_results(student_id);
create index if not exists idx_exam_results_exam on public.campus_exam_results(exam_id);

alter table public.campus_exam_results enable row level security;
drop policy if exists "Students can view their own exam results" on public.campus_exam_results;
drop policy if exists "Faculty can record exam results" on public.campus_exam_results;
drop policy if exists "exam_results_read_own_or_staff" on public.campus_exam_results;
create policy "exam_results_read_own_or_staff" on public.campus_exam_results
  for select to authenticated
  using (public.campus_is_self(student_id) or public.campus_is_staff());
drop policy if exists "exam_results_staff_write" on public.campus_exam_results;
create policy "exam_results_staff_write" on public.campus_exam_results
  for all to authenticated
  using (public.campus_is_staff()) with check (public.campus_is_staff());
drop policy if exists "exam_results_service_role" on public.campus_exam_results;
create policy "exam_results_service_role" on public.campus_exam_results
  for all to service_role using (true) with check (true);
revoke all on public.campus_exam_results from anon;


-- ═══ 2. COURSE MATERIALS: signed-in users read, staff write ═══

create table if not exists public.campus_course_materials (
  id              text primary key default gen_random_uuid()::text,
  title           text not null,
  subject         text not null,
  semester        text not null,
  type            text not null default 'pdf',
  file_url        text default '',
  uploaded_at     timestamptz default timezone('utc'::text, now()),
  size            text default '1.0 MB',
  downloads_count integer default 0,
  tags            text[] default array[]::text[]
);
create index if not exists idx_course_materials_subject_sem on public.campus_course_materials(subject, semester);
create index if not exists idx_course_materials_uploaded on public.campus_course_materials(uploaded_at desc);

alter table public.campus_course_materials enable row level security;
drop policy if exists "Public can view course materials" on public.campus_course_materials;
drop policy if exists "Authenticated users can manage course materials" on public.campus_course_materials;
drop policy if exists "course_materials_read_logged_in" on public.campus_course_materials;
create policy "course_materials_read_logged_in" on public.campus_course_materials
  for select to authenticated using (true);
drop policy if exists "course_materials_staff_write" on public.campus_course_materials;
create policy "course_materials_staff_write" on public.campus_course_materials
  for all to authenticated
  using (public.campus_is_staff()) with check (public.campus_is_staff());
drop policy if exists "course_materials_service_role" on public.campus_course_materials;
create policy "course_materials_service_role" on public.campus_course_materials
  for all to service_role using (true) with check (true);
revoke all on public.campus_course_materials from anon;


-- ═══ 3. EXAM INTEGRITY ALERTS (tab switches): filed by the student's exam page, read by staff ═══

create table if not exists public.campus_fraud_alerts (
  id                 text primary key default ('fraud_' || extract(epoch from now())::bigint || '_' || substring(md5(random()::text), 1, 6)),
  student_name       text not null,
  exam_title         text not null,
  tab_switches       integer default 0,
  ip_address         text default '127.0.0.1',
  trust_score_impact integer default 0,
  severity           text default 'medium',
  timestamp          timestamptz default timezone('utc'::text, now())
);
alter table public.campus_fraud_alerts add column if not exists student_id text;
create index if not exists idx_fraud_alerts_time on public.campus_fraud_alerts(timestamp desc);
create index if not exists idx_fraud_alerts_student on public.campus_fraud_alerts(student_id);

-- A student's alert always carries their own id and name, whatever the page sent.
create or replace function public.bind_fraud_alert_to_student()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  if public.campus_is_staff() then
    return new;
  end if;
  if auth.uid() is null then
    raise exception 'Sign in to file an exam integrity alert';
  end if;
  select coalesce(nullif(display_name, ''), email, 'Student') into v_name from public.users where id = auth.uid();
  new.student_id := auth.uid()::text;
  new.student_name := coalesce(v_name, 'Student');
  new.timestamp := timezone('utc'::text, now());
  return new;
end;
$$;
revoke execute on function public.bind_fraud_alert_to_student() from public, anon, authenticated;

drop trigger if exists trg_bind_fraud_alert_to_student on public.campus_fraud_alerts;
create trigger trg_bind_fraud_alert_to_student
  before insert on public.campus_fraud_alerts
  for each row execute function public.bind_fraud_alert_to_student();

alter table public.campus_fraud_alerts enable row level security;
drop policy if exists "Authenticated users can read fraud alerts" on public.campus_fraud_alerts;
drop policy if exists "Authenticated users can insert fraud alerts" on public.campus_fraud_alerts;
drop policy if exists "fraud_alerts_students_file_own" on public.campus_fraud_alerts;
create policy "fraud_alerts_students_file_own" on public.campus_fraud_alerts
  for insert to authenticated
  with check (public.campus_is_staff() or student_id = auth.uid()::text);
drop policy if exists "fraud_alerts_staff_all" on public.campus_fraud_alerts;
create policy "fraud_alerts_staff_all" on public.campus_fraud_alerts
  for all to authenticated
  using (public.campus_is_staff()) with check (public.campus_is_staff());
drop policy if exists "fraud_alerts_service_role" on public.campus_fraud_alerts;
create policy "fraud_alerts_service_role" on public.campus_fraud_alerts
  for all to service_role using (true) with check (true);
revoke all on public.campus_fraud_alerts from anon;


-- ═══ 4. PAYROLL RUNS: one per month, server only ═══

create table if not exists public.payroll_runs (
  id         uuid primary key default gen_random_uuid(),
  period_key text not null unique,
  run_at     timestamptz not null default now()
);
alter table public.payroll_runs enable row level security;
drop policy if exists "Service role full access on payroll_runs" on public.payroll_runs;
create policy "Service role full access on payroll_runs" on public.payroll_runs
  for all to service_role using (true) with check (true);
revoke all on public.payroll_runs from anon, authenticated;

commit;

notify pgrst, 'reload schema';
