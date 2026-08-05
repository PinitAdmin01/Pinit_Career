-- 1. Create Vault Access Tokens table (for sharing 72-hour view links)
create table if not exists public.vault_access_tokens (
  id uuid default gen_random_uuid() primary key,
  token text unique not null,
  user_id uuid references public.users on delete cascade not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  used_at timestamp with time zone
);

alter table public.vault_access_tokens enable row level security;

create policy "Users can manage their own vault access tokens" 
  on public.vault_access_tokens 
  using (auth.uid() = user_id) 
  with check (auth.uid() = user_id);

create policy "Anyone can select a token for validation" 
  on public.vault_access_tokens 
  for select 
  using (true);

-- 2. Create Exam Events table (for logging tab-switches and cheating telemetry)
create table if not exists public.exam_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  exam_id text not null,
  event_type text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{}'::jsonb
);

alter table public.exam_events enable row level security;

create policy "Users can insert their own exam events" 
  on public.exam_events 
  for insert 
  with check (auth.uid() = user_id);

create policy "Admins can view all exam events" 
  on public.exam_events 
  for select 
  using (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- 3. Create AI Usage Log table (for token balance tracking)
create table if not exists public.ai_usage_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  model text not null,
  pins_spent int default 1,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_usage_log enable row level security;

create policy "Users can view their own ai usage logs" 
  on public.ai_usage_log 
  for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own ai usage logs" 
  on public.ai_usage_log 
  for insert 
  with check (auth.uid() = user_id);

-- 4. Create Contact Submissions table
create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contact_submissions enable row level security;

create policy "Anyone can submit contact requests" 
  on public.contact_submissions 
  for insert 
  with check (true);

create policy "Admins can view all contact submissions" 
  on public.contact_submissions 
  for select 
  using (
    exists (
      select 1 from public.users 
      where users.id = auth.uid() and users.role = 'admin'
    )
  );