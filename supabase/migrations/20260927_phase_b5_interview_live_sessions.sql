-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE B5 — Server-recorded AI interviews (T22)
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- Why: the interview score was computed on the server, but from the conversation the browser sent
-- at the end, so a scripted client could send any conversation for any topic. With this table the
-- server records the interview itself (each question it asked and each answer it received) and
-- scores that record, once. Only server-recorded interviews get XP and a signed result (needed
-- by the capstone defenses and certificates).
--
-- Students can read their own interview records; only the server writes them.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

create table if not exists public.interview_live_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  topic         text not null,
  domain_stream text not null default 'tech',
  status        text not null default 'active',
  transcript    jsonb not null default '[]'::jsonb,
  evaluation    jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  evaluated_at  timestamptz,
  constraint interview_live_sessions_status_check check (status in ('active', 'evaluated', 'abandoned')),
  constraint interview_live_sessions_stream_check check (domain_stream in ('tech', 'non_tech'))
);
create index if not exists idx_interview_live_sessions_user on public.interview_live_sessions (user_id, created_at desc);

alter table public.interview_live_sessions enable row level security;
drop policy if exists "Students read their own interview records" on public.interview_live_sessions;
create policy "Students read their own interview records" on public.interview_live_sessions
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Server manages interview records" on public.interview_live_sessions;
create policy "Server manages interview records" on public.interview_live_sessions
  for all to service_role using (true) with check (true);
revoke all on public.interview_live_sessions from anon;
revoke insert, update, delete on public.interview_live_sessions from authenticated;

commit;

notify pgrst, 'reload schema';
