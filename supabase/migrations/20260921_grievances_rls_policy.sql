-- Migration: 20260921_grievances_rls_policy.sql
-- Enforce strict RLS policies on public.grievances_tickets:
-- 1. Students can ONLY select their own tickets (matching student_id or reporter_id).
-- 2. Staff/faculty can select and manage all tickets.
-- 3. Students cannot tamper with status/resolution.

ALTER TABLE IF EXISTS public.grievances_tickets 
  ADD COLUMN IF NOT EXISTS reporter_id text;

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.grievances_tickets ENABLE ROW LEVEL SECURITY;

-- Drop obsolete or overly permissive policies
DROP POLICY IF EXISTS campus_own_or_staff ON public.grievances_tickets;
DROP POLICY IF EXISTS campus_auth_all ON public.grievances_tickets;
DROP POLICY IF EXISTS grievances_select_own_or_staff ON public.grievances_tickets;
DROP POLICY IF EXISTS grievances_insert_authenticated ON public.grievances_tickets;
DROP POLICY IF EXISTS grievances_update_staff_only ON public.grievances_tickets;
DROP POLICY IF EXISTS grievances_delete_staff_only ON public.grievances_tickets;

-- 1. SELECT: Students see ONLY their own grievances; staff/admin see all.
CREATE POLICY grievances_select_own_or_staff ON public.grievances_tickets
  FOR SELECT TO authenticated
  USING (
    public.campus_is_staff() 
    OR student_id = auth.uid()::text 
    OR reporter_id = auth.uid()::text
  );

-- 2. INSERT: Authenticated users can insert grievances for themselves.
CREATE POLICY grievances_insert_authenticated ON public.grievances_tickets
  FOR INSERT TO authenticated
  WITH CHECK (
    public.campus_is_staff()
    OR student_id = auth.uid()::text
    OR reporter_id = auth.uid()::text
  );

-- 3. UPDATE: Only staff/admin can update ticket status or resolution.
CREATE POLICY grievances_update_staff_only ON public.grievances_tickets
  FOR UPDATE TO authenticated
  USING (public.campus_is_staff())
  WITH CHECK (public.campus_is_staff());

-- 4. DELETE: Only staff/admin can delete tickets.
CREATE POLICY grievances_delete_staff_only ON public.grievances_tickets
  FOR DELETE TO authenticated
  USING (public.campus_is_staff());
