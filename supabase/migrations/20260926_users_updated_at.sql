-- Migration: add users.updated_at
-- The app writes users.updated_at on every profile/onboarding save
-- (src/app/api/auth/onboarding/route.ts, src/lib/services/supabase/userService.ts),
-- but no migration in the repo defines it (supabase/schema.sql does not either).

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
