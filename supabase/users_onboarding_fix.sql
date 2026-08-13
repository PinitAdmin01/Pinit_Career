-- Run this on the live Supabase project so onboarding can create a public.users row.
-- Without an INSERT policy, Launch OS POSTs 403: "new row violates row-level security policy".

drop policy if exists "Users can insert own profile" on public.users;
create policy "Users can insert own profile" on public.users
  for insert
  with check (
    auth.uid() = id
    and coalesce(role, 'student') = 'student'
  );

-- Auto-create a student profile when auth.users gets a new account.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, ''), '@', 1)),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
