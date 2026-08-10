-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clean wipe: Drop all existing tables and data cascade-style (drops dependent constraints automatically)
drop table if exists public.qr_login_sessions cascade;
drop table if exists public.audit_logs cascade;
drop table if exists public.sessions cascade;
drop table if exists public.interview_sessions cascade;
drop table if exists public.notifications cascade;
drop table if exists public.applications cascade;
drop table if exists public.jobs cascade;
drop table if exists public.opportunities cascade;
drop table if exists public.missions cascade;
drop table if exists public.vault_items cascade;
drop table if exists public.users cascade;

-- 1. Create Profiles table (linked to auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  username text,
  email text,
  display_name text,
  role text default 'student',
  subscription_tier text default 'free',
  register_number text,
  selected_teacher_id text default 'priya',
  guidance_mentor_id text default 'priya',
  
  -- Scores and Competencies
  ats_score int default 0,
  trust_score int default 40,
  career_dna_score int default 0,
  career_readiness int default 0,
  intelligence_score int default 0,
  communication_score int default 60,
  execution_score int default 60,
  leadership_score int default 60,
  consistency_score int default 60,
  adaptability_score int default 60,
  confidence_score int default 60,
  innovation_score int default 60,
  
  -- Progression & Streaks
  mission_streak int default 0,
  missions_completed int default 0,
  interviews_done int default 0,
  vault_count int default 0,
  xp_total int default 0,
  xp_level int default 1,
  target_role text default '',
  career_goal text default '',
  career_dna_archetype text default 'explorer',
  
  -- Onboarding & Gaps
  onboarding_step int default 0,
  onboarding_answers jsonb default '{"role": "", "education": "", "skills": "", "experience": "", "hasCompleted": false}'::jsonb,
  jd_missing_skills text[] default '{}'::text[],
  weak_areas text[] default '{}'::text[],
  skill_tags text[] default '{}'::text[],
  certifications text[] default '{}'::text[],
  structured_resume jsonb default null,
  
  -- Pins Currency System
  pins int default 100,
  pin_history jsonb default '[]'::jsonb,
  
  -- UI & Bypass flags
  resume_generated boolean default false,
  roadmap_generated boolean default false,
  completed_quests text[] default '{}'::text[],
  java_test_passed boolean default false,
  recruiter_visible boolean default false,
  recruiter_visibility int default 0,
  force_show_career_builder boolean default false,
  demo_tabs_unlocked boolean default false,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Vault Items table
create table public.vault_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  item_type text default 'resume',       -- e.g. 'resume', 'certification', 'project'
  organization_name text default '',
  description text default '',
  verified boolean default false,
  ai_confidence_score numeric default 0.0,
  skill_tags text[] default '{}'::text[],
  is_public boolean default false,
  used_in_resume boolean default false,
  used_in_portfolio boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Missions table
create table public.missions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  description text,
  type text,
  status text default 'pending',
  proof_type text,
  due_date text,
  trust_reward int default 8,
  source_weakness text,
  estimated_minutes int default 20,
  learn_url text,
  ai_evaluation jsonb default null,
  proof jsonb default null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  submitted_at timestamp with time zone
);

-- 4. Create Opportunities table
create table public.opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company text not null,
  location text,
  type text,
  salary text,
  match_score int,
  skills text[] default '{}'::text[],
  posted_at text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Jobs table (recruiter job postings)
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  recruiter_id uuid references public.users on delete cascade not null,
  title text not null,
  company text default '',
  location text default '',
  type text default 'Full-time',
  salary text default '',
  description text default '',
  skills text[] default '{}'::text[],
  is_deleted boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create Applications table
create table public.applications (
  id text primary key, -- composite: user_id + opportunity_id
  user_id uuid references public.users on delete cascade not null,
  opportunity_id uuid references public.opportunities on delete cascade not null,
  status text default 'applied',
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone
);

-- 7. Create Notifications table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  type text,
  title text,
  message text,
  source text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Create Interview Sessions table
create table public.interview_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users on delete cascade not null,
  mode text,
  domain text,
  pressure_mode text,
  persona text,
  status text default 'active',
  overall_score int default 0,
  transcript jsonb default '[]'::jsonb,
  evaluation jsonb default null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- 9. Create Sessions (CRM meetings) table
create table public.sessions (
  id uuid default gen_random_uuid() primary key,
  consultant_id uuid references public.users on delete cascade not null,
  student_id uuid references public.users on delete cascade not null,
  title text not null,
  date text,
  time text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Create Audit Logs table
create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references public.users on delete cascade not null,
  action text not null,
  target_id text,
  meta jsonb default '{}'::jsonb,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Create QR Login Sessions table (Realtime enabled)
create table public.qr_login_sessions (
  id uuid default gen_random_uuid() primary key,
  status text default 'ready',
  email text,
  password text,
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null
);

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.vault_items enable row level security;
alter table public.missions enable row level security;
alter table public.opportunities enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.notifications enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.sessions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.qr_login_sessions enable row level security;

-- Add Strict Row Level Security Policies
-- 1. Users Table
-- Profiles: users may read/update only their own row. Role/pins/tier changes must go through service role / admin APIs.
drop policy if exists "Users can read all profiles" on public.users;
drop policy if exists "Users can update their own profile" on public.users;

create or replace function public.is_staff_reader()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid()
      and role in ('admin', 'superadmin', 'recruiter', 'teacher', 'consultant')
  );
$$;

create policy "Users can read own profile" on public.users for select using (auth.uid() = id);
create policy "Staff can read profiles" on public.users for select using (public.is_staff_reader());
create policy "Users can update own non-privileged profile" on public.users
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select u.role from public.users u where u.id = auth.uid())
    and coalesce(pins, 0) = coalesce((select u.pins from public.users u where u.id = auth.uid()), 0)
    and coalesce(subscription_tier, 'free') = coalesce((select u.subscription_tier from public.users u where u.id = auth.uid()), 'free')
  );

-- Protect role column even if a client bypasses with_check (defense in depth)
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
     or new.trust_score is distinct from old.trust_score then
    if auth.uid() is not null and auth.uid() = old.id then
      -- Block self-service privilege / economy / score forgery
      new.role := old.role;
      new.pins := old.pins;
      new.subscription_tier := old.subscription_tier;
      new.ats_score := old.ats_score;
      new.trust_score := old.trust_score;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_privilege_escalation on public.users;
create trigger trg_prevent_privilege_escalation
  before update on public.users
  for each row execute function public.prevent_privilege_escalation();

-- 2. Vault Items Table
create policy "Users can view their own vault items" on public.vault_items for select using (auth.uid() = user_id);
create policy "Users can insert their own vault items" on public.vault_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own vault items" on public.vault_items for update using (auth.uid() = user_id);
create policy "Users can delete their own vault items" on public.vault_items for delete using (auth.uid() = user_id);

-- 3. Missions Table
create policy "Users can view their own missions" on public.missions for select using (auth.uid() = user_id);
create policy "Users can update their own missions" on public.missions for update using (auth.uid() = user_id);
create policy "Users can insert their own missions" on public.missions for insert with check (auth.uid() = user_id);

-- 4. Opportunities Table
create policy "Anyone can view opportunities" on public.opportunities for select using (true);
drop policy if exists "Anyone can insert opportunities" on public.opportunities;
create policy "Authenticated users can insert opportunities" on public.opportunities
  for insert with check (auth.uid() is not null);

-- 5. Jobs Table
create policy "Anyone can view jobs" on public.jobs for select using (true);
create policy "Recruiters can manage their own jobs" on public.jobs for all using (auth.uid() = recruiter_id);

-- 6. Applications Table
create policy "Users can view their own applications" on public.applications for select using (auth.uid() = user_id);
create policy "Users can manage their own applications" on public.applications for all using (auth.uid() = user_id);

-- 7. Notifications Table
create policy "Users can view their own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their own notifications" on public.notifications for update using (auth.uid() = user_id);

-- 8. Interview Sessions Table
create policy "Users can view their own interview sessions" on public.interview_sessions for select using (auth.uid() = user_id);
create policy "Users can manage their own interview sessions" on public.interview_sessions for all using (auth.uid() = user_id);

-- 9. Sessions Table
create policy "Users can view their own sessions" on public.sessions for select using (auth.uid() = student_id or auth.uid() = consultant_id);

-- 10. Audit Logs Table
create policy "Admins can view audit logs" on public.audit_logs for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 11. QR Login Sessions Table
create policy "Authenticated users can manage own QR login sessions" on public.qr_login_sessions
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- Enable Supabase Realtime for QR Login
alter publication supabase_realtime add table public.qr_login_sessions;
