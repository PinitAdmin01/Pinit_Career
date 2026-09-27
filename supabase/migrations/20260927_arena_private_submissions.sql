-- ─────────────────────────────────────────────────────────────────────────────
-- T3 — Arena: keep each player's code private until the match ends
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once. Safe to re-run.
--
-- The arena room row (arena_rooms) is sent to both players through live updates, and it held each
-- player's code while they typed, so the opponent could read it. With patch 13 the server keeps code
-- here instead, readable only by the server, and copies both players' code into the room once the
-- match is over (for the side-by-side review).
-- ─────────────────────────────────────────────────────────────────────────────

begin;

create table if not exists public.arena_room_submissions (
  room_code varchar(16) not null,
  player_id text not null,
  code text not null default '',
  logs text,
  submitted boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (room_code, player_id)
);

alter table public.arena_room_submissions enable row level security;

drop policy if exists "arena_submissions_service_all" on public.arena_room_submissions;
create policy "arena_submissions_service_all" on public.arena_room_submissions
  for all to service_role
  using (true)
  with check (true);

revoke all on public.arena_room_submissions from anon, authenticated;
grant all on public.arena_room_submissions to service_role;

-- Rooms still in play: remove code already sitting in the shared row.
update public.arena_rooms
set host_progress = (coalesce(host_progress, '{}'::jsonb) || '{"code": ""}'::jsonb) - 'logs',
    guest_progress = (coalesce(guest_progress, '{}'::jsonb) || '{"code": ""}'::jsonb) - 'logs'
where status <> 'completed'
  and (coalesce(host_progress ->> 'code', '') <> '' or coalesce(guest_progress ->> 'code', '') <> ''
       or host_progress ? 'logs' or guest_progress ? 'logs');

commit;

notify pgrst, 'reload schema';
