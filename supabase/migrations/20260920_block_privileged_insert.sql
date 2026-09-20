-- Migration: Block privileged role assignment on INSERT from the anon (unauthenticated) role
-- Date: 2026-09-20
--
-- Context:
--   The existing 'prevent_privilege_escalation' trigger (BEFORE UPDATE) prevents role elevation
--   on UPDATE of public.users. The INSERT RLS policy already requires coalesce(role, 'student') = 'student'
--   for the anon and authenticated roles.
--   This migration adds an explicit BEFORE INSERT trigger on public.users to enforce the same rule at the
--   trigger level for defense-in-depth.
--
-- IMPORTANT: Only the anon and authenticated Postgres roles are blocked.
--   - 'postgres' / service_role / test harness / migration scripts: allowed (they need to create staff accounts)
--   - 'anon' role: any INSERT with a non-student role is rejected (this is how Supabase client-side code runs)
--   - 'authenticated' role: any INSERT with a non-student role is rejected (logged-in user self-registration)
--
-- This closes the code-path previously exploited by AuthContext.tsx's createUserProfile
--   call with { allowPrivileged: true }.

CREATE OR REPLACE FUNCTION public.prevent_privileged_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_pg_role text := current_setting('role', true);
BEGIN
  -- Only enforce for client-facing roles (anon = unauthenticated, authenticated = logged-in user).
  -- Service role, postgres, and migration scripts are permitted to insert any role.
  IF current_pg_role IN ('anon', 'authenticated') THEN
    IF NEW.role IS NOT NULL AND NEW.role != 'student' THEN
      RAISE EXCEPTION
        'INSERT rejected: role "%" cannot be self-assigned via client. Privileged roles must be granted by an administrator.',
        NEW.role;
    END IF;
    -- Always coerce to 'student' for client-originating inserts
    NEW.role := COALESCE(NEW.role, 'student');
  END IF;

  RETURN NEW;
END;
$$;

-- Drop the trigger if it already exists (idempotent migration)
DROP TRIGGER IF EXISTS trg_prevent_privileged_insert ON public.users;

CREATE TRIGGER trg_prevent_privileged_insert
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_privileged_insert();

-- Comment documenting intent
COMMENT ON FUNCTION public.prevent_privileged_insert() IS
  'Blocks any INSERT from the anon or authenticated role that attempts to assign a privileged role (non-student) to public.users. '
  'Service role, postgres, and migration scripts are permitted. '
  'Privileged role assignment must go through administrator action only. '
  'See: trg_prevent_privilege_escalation trigger for UPDATE protection.';
