-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE B3 — Direct messages + notifications
-- Supabase Dashboard → SQL Editor → PRODUCTION project. Paste the WHOLE file, Run once.
-- One transaction: either everything applies or nothing does. Safe to re-run.
--
-- What is broken in production today and fixed here:
--   • Friends chat (api/friends/messages) never saves: direct_messages.id has no default and
--     recipient_name is required, the route sends neither → messages go to a temp file and are lost.
--   • Browser messaging writes receiver_name / read, which do not exist (works only via a fallback).
--   • Students never get "recruiter shortlisted you", "interview scheduled", "parent linked"
--     notifications: those server inserts write notifications.sender_id / read, which do not exist.
--   • "Mark as read" fails everywhere: it writes notifications.read.
--   • Demo holes: logged-out visitors can read and send messages as 'current_user'.
--
-- Built from 20260923_direct_messages_unified_schema_and_rls and
-- 20260924_notifications_unified_schema_and_rls (column sync triggers unchanged). NOT copied from them:
--   • direct messages readable by anyone (even logged out) when sent to 'priya' / 'anish'
--   • sending a message as any sender (`sender_id IS NOT NULL`)
--   • any staff member reading every student's private messages
--   • any logged-in user creating notifications for any other user
-- Kept: the shared faculty inbox ('priya','anish','faculty','teacher','admin') for staff only.
-- ─────────────────────────────────────────────────────────────────────────────

begin;

do $$
begin
  if to_regprocedure('public.campus_is_staff()') is null then
    raise exception 'public.campus_is_staff() is missing — stop and tell Claude';
  end if;
end $$;


-- ═══ DIRECT MESSAGES ═══

-- 1. Columns the app writes, and defaults the server route relies on
alter table public.direct_messages
  add column if not exists receiver_id   text,
  add column if not exists recipient_id  text,
  add column if not exists receiver_name text default 'Recipient',
  add column if not exists content       text,
  add column if not exists message       text,
  add column if not exists role          text default 'student',
  add column if not exists is_read       boolean not null default false,
  add column if not exists read          boolean not null default false;

alter table public.direct_messages
  alter column id set default gen_random_uuid()::text,
  alter column sender_name set default 'User',
  alter column recipient_name set default 'Recipient';

-- 2. Keep the alias columns in step (receiver/recipient, message/content, read/is_read)
create or replace function public.sync_direct_messages_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.recipient_id is null and new.receiver_id is not null then
    new.recipient_id := new.receiver_id;
  elsif new.receiver_id is null and new.recipient_id is not null then
    new.receiver_id := new.recipient_id;
  end if;

  if new.content is null and new.message is not null then
    new.content := new.message;
  elsif new.message is null and new.content is not null then
    new.message := new.content;
  end if;

  if new.recipient_name is null and new.receiver_name is not null then
    new.recipient_name := new.receiver_name;
  elsif new.receiver_name is null and new.recipient_name is not null then
    new.receiver_name := new.recipient_name;
  end if;

  if new.is_read is not null and new.read is null then
    new.read := new.is_read;
  elsif new.read is not null and new.is_read is null then
    new.is_read := new.read;
  elsif new.is_read is not null and new.read is not null then
    new.is_read := (new.is_read or new.read);
    new.read := new.is_read;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_sync_direct_messages_columns on public.direct_messages;
create trigger trg_sync_direct_messages_columns
  before insert or update on public.direct_messages
  for each row execute function public.sync_direct_messages_columns();

-- Backfill existing rows (the trigger fills the aliases)
update public.direct_messages
set receiver_id = coalesce(receiver_id, recipient_id),
    message = coalesce(message, content),
    receiver_name = coalesce(receiver_name, recipient_name),
    read = coalesce(read, false) or coalesce(is_read, false)
where receiver_id is null or message is null or receiver_name is null
   or read is distinct from coalesce(is_read, false);

create index if not exists idx_direct_messages_receiver_unread
  on public.direct_messages (receiver_id, is_read, created_at desc);
create index if not exists idx_direct_messages_sender_receiver
  on public.direct_messages (sender_id, receiver_id, created_at);

-- 3. Access: participants only; staff also see the shared faculty inbox
alter table public.direct_messages enable row level security;

drop policy if exists "Users can view own direct messages" on public.direct_messages;
drop policy if exists "Users can view messages sent to or from them" on public.direct_messages;
drop policy if exists "Unified direct messages select policy" on public.direct_messages;
drop policy if exists "Users can send direct messages" on public.direct_messages;
drop policy if exists "Unified direct messages insert policy" on public.direct_messages;
drop policy if exists "Receivers can mark messages as read" on public.direct_messages;
drop policy if exists "Unified direct messages update policy" on public.direct_messages;

drop policy if exists "dm_select_participants" on public.direct_messages;
create policy "dm_select_participants" on public.direct_messages
  for select to authenticated
  using (
    sender_id = auth.uid()::text
    or recipient_id = auth.uid()::text
    or receiver_id = auth.uid()::text
    or (
      public.campus_is_staff() and (
        sender_id in ('priya', 'anish', 'faculty', 'teacher', 'admin')
        or recipient_id in ('priya', 'anish', 'faculty', 'teacher', 'admin')
        or receiver_id in ('priya', 'anish', 'faculty', 'teacher', 'admin')
      )
    )
  );

drop policy if exists "dm_insert_as_self" on public.direct_messages;
create policy "dm_insert_as_self" on public.direct_messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()::text
    or (public.campus_is_staff() and sender_id in ('priya', 'anish', 'faculty', 'teacher', 'admin'))
  );

drop policy if exists "dm_recipient_mark_read" on public.direct_messages;
create policy "dm_recipient_mark_read" on public.direct_messages
  for update to authenticated
  using (
    recipient_id = auth.uid()::text
    or receiver_id = auth.uid()::text
    or (public.campus_is_staff() and (
          recipient_id in ('priya', 'anish', 'faculty', 'teacher', 'admin')
          or receiver_id in ('priya', 'anish', 'faculty', 'teacher', 'admin')))
  )
  with check (
    recipient_id = auth.uid()::text
    or receiver_id = auth.uid()::text
    or (public.campus_is_staff() and (
          recipient_id in ('priya', 'anish', 'faculty', 'teacher', 'admin')
          or receiver_id in ('priya', 'anish', 'faculty', 'teacher', 'admin')))
  );

-- Recipients may only flip the read flags, never edit a message.
revoke all on public.direct_messages from anon;
revoke update, delete, truncate on public.direct_messages from authenticated;
grant select, insert on public.direct_messages to authenticated;
grant update (is_read, read) on public.direct_messages to authenticated;
grant all on public.direct_messages to service_role;


-- ═══ NOTIFICATIONS ═══

-- 4. Columns the server routes and the app write
alter table public.notifications
  add column if not exists read      boolean default false,
  add column if not exists sender_id uuid references public.users(id) on delete set null;

update public.notifications
set read = coalesce(is_read, false)
where read is distinct from coalesce(is_read, false);

-- 5. Keep read / is_read in step (20260924, unchanged)
create or replace function public.sync_notifications_read_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.is_read is not null and new.read is null then
      new.read := new.is_read;
    elsif new.read is not null and new.is_read is null then
      new.is_read := new.read;
    elsif new.is_read is null and new.read is null then
      new.is_read := false;
      new.read := false;
    else
      new.read := coalesce(new.is_read, new.read, false);
      new.is_read := new.read;
    end if;
  elsif tg_op = 'UPDATE' then
    if new.is_read is distinct from old.is_read then
      new.read := new.is_read;
    elsif new.read is distinct from old.read then
      new.is_read := new.read;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sync_notifications_read on public.notifications;
create trigger trg_sync_notifications_read
  before insert or update on public.notifications
  for each row execute function public.sync_notifications_read_column();

create index if not exists idx_notifications_user_created on public.notifications (user_id, created_at desc);

-- 6. Access: own notifications; students may add their own reminders; staff may broadcast.
--    Nobody can put someone else's id in sender_id.
alter table public.notifications enable row level security;

drop policy if exists "Users can view their own notifications" on public.notifications;
create policy "Users can view their own notifications" on public.notifications
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can update their own notifications" on public.notifications;
create policy "Users can update their own notifications" on public.notifications
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users and staff can insert notifications" on public.notifications;
create policy "Users and staff can insert notifications" on public.notifications
  for insert to authenticated
  with check (
    (auth.uid() = user_id or public.campus_is_staff())
    and (sender_id is null or sender_id = auth.uid())
  );

drop policy if exists "Users can delete their own notifications" on public.notifications;
create policy "Users can delete their own notifications" on public.notifications
  for delete to authenticated
  using (auth.uid() = user_id);

revoke all on public.notifications from anon;
grant select, insert, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;

commit;

notify pgrst, 'reload schema';
