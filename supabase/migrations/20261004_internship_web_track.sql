-- ============================================================================
-- MIGRATION: Support Web Full-Stack Track in Internship Program
-- Filename: 20261004_internship_web_track.sql
-- Description:
--   1. Widens the internship_tasks.language check constraint to allow
--      'python', 'sql', 'typescript', 'tsx'.
--   2. Removes the 'python_ai' default value from internship_enrollments.track.
-- ============================================================================

-- 1. Remove the 'python_ai' default from internship_enrollments.track
ALTER TABLE IF EXISTS public.internship_enrollments
  ALTER COLUMN track DROP DEFAULT;

-- 2. Drop existing check constraint on internship_tasks.language
ALTER TABLE IF EXISTS public.internship_tasks
  DROP CONSTRAINT IF EXISTS internship_tasks_language_check;

-- 3. Add widened check constraint on internship_tasks.language
ALTER TABLE IF EXISTS public.internship_tasks
  ADD CONSTRAINT internship_tasks_language_check
  CHECK (language IN ('python', 'sql', 'typescript', 'tsx'));
