-- ============================================================================
-- Migration: 20260925_portal_real_data_and_permissions.sql
-- Description: Establishes parent_student_links, recruiter_interactions tables,
--              and RLS policies ensuring authentic data access for Parent,
--              Recruiter, Consultant, and Admin portals.
-- ============================================================================

-- 1. Parent-Student Relationship Table
CREATE TABLE IF NOT EXISTS public.parent_student_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'approved',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_parent_student_link UNIQUE (parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_parent_student_links_parent ON public.parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_links_student ON public.parent_student_links(student_id);

ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;

-- Parent Link RLS Policies
DROP POLICY IF EXISTS "Parents can view their own student links" ON public.parent_student_links;
CREATE POLICY "Parents can view their own student links" ON public.parent_student_links
    FOR SELECT
    USING (
        auth.uid() = parent_id
        OR auth.uid() = student_id
        OR public.is_staff_reader()
        OR campus_is_staff()
    );

DROP POLICY IF EXISTS "Parents can create student links" ON public.parent_student_links;
CREATE POLICY "Parents can create student links" ON public.parent_student_links
    FOR INSERT
    WITH CHECK (
        auth.uid() = parent_id
        OR public.is_staff_reader()
        OR campus_is_staff()
    );

DROP POLICY IF EXISTS "Parents or staff can delete student links" ON public.parent_student_links;
CREATE POLICY "Parents or staff can delete student links" ON public.parent_student_links
    FOR DELETE
    USING (
        auth.uid() = parent_id
        OR public.is_staff_reader()
        OR campus_is_staff()
    );

-- Helper function to check if parent is linked to student
CREATE OR REPLACE FUNCTION public.is_linked_parent(target_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.parent_student_links
        WHERE parent_id = auth.uid()
          AND student_id = target_student_id
          AND status = 'approved'
    );
$$;

-- Allow linked parents to read their linked student's user profile
DROP POLICY IF EXISTS "Linked parents can read student profiles" ON public.users;
CREATE POLICY "Linked parents can read student profiles" ON public.users
    FOR SELECT
    USING (
        public.is_linked_parent(id)
    );

-- 2. Recruiter Interactions Table
CREATE TABLE IF NOT EXISTS public.recruiter_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action_type VARCHAR(32) NOT NULL, -- 'shortlist', 'contact_request', 'interview_scheduled'
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    meta JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recruiter_interactions_recruiter ON public.recruiter_interactions(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_interactions_candidate ON public.recruiter_interactions(candidate_id);

ALTER TABLE public.recruiter_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Recruiters and candidates can view interactions" ON public.recruiter_interactions;
CREATE POLICY "Recruiters and candidates can view interactions" ON public.recruiter_interactions
    FOR SELECT
    USING (
        auth.uid() = recruiter_id
        OR auth.uid() = candidate_id
        OR public.is_staff_reader()
        OR campus_is_staff()
    );

DROP POLICY IF EXISTS "Recruiters can insert interactions" ON public.recruiter_interactions;
CREATE POLICY "Recruiters can insert interactions" ON public.recruiter_interactions
    FOR INSERT
    WITH CHECK (
        auth.uid() = recruiter_id
        OR public.is_staff_reader()
        OR campus_is_staff()
    );
