-- ─────────────────────────────────────────────────────────────────────────────
-- T7 — Verifiable certificates (roadmap journey: roadmap → capstone → interview)
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once. Safe to re-run.
--
-- /api/certificates/roadmap (patch 17) issues a certificate only after the server has checked the
-- roadmap (server-recorded quests), the capstone project and the server-signed interview result.
-- Each certificate is HMAC-signed and publicly verifiable at /verify/PIN-RC-….
-- Students can read their own certificates; only the server can create, change or revoke them.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

create table if not exists public.issued_certificates (
  id text primary key,
  student_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  title text not null,
  role text,
  course_id text,
  project_id text,
  project_name text,
  interview_score integer,
  interview_verdict text,
  issued_at timestamptz not null default now(),
  signature text not null,
  revoked boolean not null default false,
  constraint uq_issued_certificates_student_kind_course unique (student_id, kind, course_id)
);

create index if not exists idx_issued_certificates_student on public.issued_certificates (student_id);

alter table public.issued_certificates enable row level security;

drop policy if exists "issued_certificates_read_own" on public.issued_certificates;
create policy "issued_certificates_read_own" on public.issued_certificates
  for select to authenticated
  using (student_id = auth.uid());

drop policy if exists "issued_certificates_service_all" on public.issued_certificates;
create policy "issued_certificates_service_all" on public.issued_certificates
  for all to service_role
  using (true)
  with check (true);

revoke all on public.issued_certificates from anon;
revoke insert, update, delete, truncate on public.issued_certificates from authenticated;
grant select on public.issued_certificates to authenticated;
grant all on public.issued_certificates to service_role;

commit;

notify pgrst, 'reload schema';
