-- ============================================================================
-- Migration: 20260924_notifications_unified_schema_and_rls.sql
-- Description: Unified notifications schema (read/is_read, sender_id),
--              bidirectional column sync trigger, and complete RLS policies.
-- ============================================================================

-- 1. Ensure columns exist on public.notifications
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Backfill read from is_read or vice versa if existing
UPDATE public.notifications
SET read = COALESCE(is_read, false)
WHERE read IS NULL;

UPDATE public.notifications
SET is_read = COALESCE(read, false)
WHERE is_read IS NULL;

-- 2. Trigger function to synchronize read and is_read columns automatically
CREATE OR REPLACE FUNCTION public.sync_notifications_read_column()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_read IS NOT NULL AND NEW.read IS NULL THEN
      NEW.read := NEW.is_read;
    ELSIF NEW.read IS NOT NULL AND NEW.is_read IS NULL THEN
      NEW.is_read := NEW.read;
    ELSIF NEW.is_read IS NULL AND NEW.read IS NULL THEN
      NEW.is_read := false;
      NEW.read := false;
    ELSE
      NEW.read := COALESCE(NEW.is_read, NEW.read, false);
      NEW.is_read := NEW.read;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.is_read IS DISTINCT FROM OLD.is_read THEN
      NEW.read := NEW.is_read;
    ELSIF NEW.read IS DISTINCT FROM OLD.read THEN
      NEW.is_read := NEW.read;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_notifications_read ON public.notifications;

CREATE TRIGGER trg_sync_notifications_read
  BEFORE INSERT OR UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_notifications_read_column();

-- 3. Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. Re-create robust policies for SELECT, UPDATE, INSERT, DELETE
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR (auth.uid() IS NOT NULL AND (public.is_staff_reader() OR campus_is_staff()))
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR (auth.uid() IS NOT NULL AND (public.is_staff_reader() OR campus_is_staff()))
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "Users and staff can insert notifications" ON public.notifications;
CREATE POLICY "Users and staff can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR auth.uid() = sender_id
    OR (auth.uid() IS NOT NULL AND (public.is_staff_reader() OR campus_is_staff()))
    OR auth.role() = 'service_role'
    OR auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  USING (
    auth.uid() = user_id
    OR (auth.uid() IS NOT NULL AND (public.is_staff_reader() OR campus_is_staff()))
    OR auth.role() = 'service_role'
  );

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated, service_role;
GRANT SELECT ON public.notifications TO anon;
