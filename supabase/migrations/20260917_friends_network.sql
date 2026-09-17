-- ==============================================================================
-- PinIT Career OS — Friends & Student Collaboration Center (V1 - V6 Schema)
-- ==============================================================================

-- ── V1: Friendships Table ──────────────────────────────────────────────────────
create table if not exists public.friendships (
    id uuid primary key default gen_random_uuid(),
    requester_id uuid not null references public.profiles(id) on delete cascade,
    addressee_id uuid not null references public.profiles(id) on delete cascade,
    status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    responded_at timestamptz,
    check (requester_id <> addressee_id)
);

-- Unordered unique pair index: prevents A->B and B->A duplicate rows
create unique index if not exists friendships_unique_pair on public.friendships (
    least(requester_id, addressee_id),
    greatest(requester_id, addressee_id)
);

create index if not exists idx_friendships_requester on public.friendships (requester_id);
create index if not exists idx_friendships_addressee on public.friendships (addressee_id);
create index if not exists idx_friendships_status on public.friendships (status);

-- Enable RLS
alter table public.friendships enable row level security;

create policy "Users can view friendships involving them"
    on public.friendships for select
    using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Users can send friend requests as themselves"
    on public.friendships for insert
    with check (auth.uid() = requester_id);

create policy "Users can respond to received friend requests or cancel sent"
    on public.friendships for update
    using (auth.uid() = addressee_id or auth.uid() = requester_id);

create policy "Users can delete friendships involving them"
    on public.friendships for delete
    using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- ── V2: Direct Messages (1-to-1 Realtime Chat) ─────────────────────────────────
create table if not exists public.direct_messages (
    id uuid primary key default gen_random_uuid(),
    sender_id uuid not null references public.profiles(id) on delete cascade,
    receiver_id uuid not null references public.profiles(id) on delete cascade,
    message text not null,
    is_read boolean not null default false,
    created_at timestamptz not null default now(),
    check (sender_id <> receiver_id)
);

create index if not exists idx_direct_messages_convo on public.direct_messages (
    least(sender_id, receiver_id),
    greatest(sender_id, receiver_id),
    created_at
);

alter table public.direct_messages enable row level security;

create policy "Users can view messages sent to or from them"
    on public.direct_messages for select
    using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send direct messages"
    on public.direct_messages for insert
    with check (auth.uid() = sender_id);

-- ── V3: Arena Invitations (Challenging Arena 1v1 Duels) ─────────────────────────
create table if not exists public.arena_invitations (
    id uuid primary key default gen_random_uuid(),
    sender_id uuid not null references public.profiles(id) on delete cascade,
    receiver_id uuid not null references public.profiles(id) on delete cascade,
    topic text not null default 'JavaScript DSA',
    difficulty text not null default 'Intermediate',
    message text,
    status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired')),
    created_at timestamptz not null default now(),
    responded_at timestamptz,
    expires_at timestamptz default (now() + interval '24 hours')
);

alter table public.arena_invitations enable row level security;

create policy "Users can view their arena invitations"
    on public.arena_invitations for select
    using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- ── V4: Project Invitations (Squad Collaboration) ──────────────────────────────
create table if not exists public.project_invitations (
    id uuid primary key default gen_random_uuid(),
    sender_id uuid not null references public.profiles(id) on delete cascade,
    receiver_id uuid not null references public.profiles(id) on delete cascade,
    project_name text not null,
    role text not null default 'Frontend Developer',
    message text,
    status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired')),
    created_at timestamptz not null default now(),
    responded_at timestamptz,
    expires_at timestamptz default (now() + interval '7 days')
);

alter table public.project_invitations enable row level security;

create policy "Users can view their project invitations"
    on public.project_invitations for select
    using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- ── V6: User Blocks & Privacy Settings ─────────────────────────────────────────
create table if not exists public.user_blocks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    blocked_user_id uuid not null references public.profiles(id) on delete cascade,
    created_at timestamptz not null default now(),
    check (user_id <> blocked_user_id)
);

create unique index if not exists user_blocks_unique on public.user_blocks (user_id, blocked_user_id);
alter table public.user_blocks enable row level security;

create table if not exists public.user_reports (
    id uuid primary key default gen_random_uuid(),
    reporter_id uuid not null references public.profiles(id) on delete cascade,
    reported_user_id uuid not null references public.profiles(id) on delete cascade,
    reason text not null,
    details text,
    status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
    created_at timestamptz not null default now(),
    resolved_at timestamptz,
    check (reporter_id <> reported_user_id)
);

alter table public.user_reports enable row level security;
