-- Migration: 20260918_campus_student_read_only_status.sql
-- Sub-batch: C3 Campus Tables Self-Approval Lockdown & Vault Verified Immutability Guard

-- 1. Helper function to ensure campus_is_staff exists and is authoritative
CREATE OR REPLACE FUNCTION public.campus_is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
      AND u.role IN ('admin', 'superadmin', 'teacher', 'faculty')
  );
$$;

GRANT EXECUTE ON FUNCTION public.campus_is_staff() TO authenticated;

-- 2. Restrict personal campus tables so students can SELECT their rows and INSERT requests,
-- but CANNOT alter administrative status columns (only staff can approve/reject/update status).
CREATE OR REPLACE FUNCTION public.check_student_campus_status_immutable()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.campus_is_staff() THEN
    IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
      RAISE EXCEPTION 'Students cannot alter status on campus records';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to sensitive personal tables
DO $$
DECLARE
  t text;
  tables text[] := ARRAY['services_leaves', 'document_requests', 'admissions_applications', 'grievances_tickets', 'finance_dues'];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t AND table_schema = 'public') THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_guard_status_%I ON public.%I', t, t);
      EXECUTE format('CREATE TRIGGER trg_guard_status_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.check_student_campus_status_immutable()', t, t);
    END IF;
  END LOOP;
END $$;

-- 3. Prevent Direct Student Self-Endorsement of verified = true on vault_items
CREATE OR REPLACE FUNCTION public.check_vault_verified_immutable()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.verified IS DISTINCT FROM NEW.verified AND NEW.verified = true) THEN
    IF (current_user != 'service_role' AND NOT public.campus_is_staff()) THEN
      RAISE EXCEPTION 'Only administrative services or staff can verify vault items';
    END IF;
  END IF;
  IF (TG_OP = 'INSERT' AND NEW.verified = true) THEN
    IF (current_user != 'service_role' AND NOT public.campus_is_staff()) THEN
      NEW.verified := false;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vault_items' AND table_schema = 'public') THEN
    DROP TRIGGER IF EXISTS trg_guard_vault_verified ON public.vault_items;
    CREATE TRIGGER trg_guard_vault_verified 
      BEFORE INSERT OR UPDATE ON public.vault_items 
      FOR EACH ROW EXECUTE FUNCTION public.check_vault_verified_immutable();
  END IF;
END $$;
