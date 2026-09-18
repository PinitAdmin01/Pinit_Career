-- supabase/migrations/20260915_finance_dues_and_scholarships.down.sql
-- Rollback Migration for Sub-Batch 2.7: Relational Student Fee Dues, Installments & Scholarships

-- 1. Revoke and drop stored procedure
REVOKE EXECUTE ON FUNCTION public.apply_student_scholarship_relational(TEXT, TEXT, NUMERIC, TEXT) FROM authenticated, service_role;
DROP FUNCTION IF EXISTS public.apply_student_scholarship_relational(TEXT, TEXT, NUMERIC, TEXT);

-- 2. Drop RLS policies
DROP POLICY IF EXISTS "applied_scholarships_read_own" ON public.applied_scholarships;
DROP POLICY IF EXISTS "applied_scholarships_service_all" ON public.applied_scholarships;
DROP POLICY IF EXISTS "fee_installments_read_own" ON public.fee_installments;
DROP POLICY IF EXISTS "fee_installments_service_all" ON public.fee_installments;
DROP POLICY IF EXISTS "student_fee_dues_read_own" ON public.student_fee_dues;
DROP POLICY IF EXISTS "student_fee_dues_service_all" ON public.student_fee_dues;

-- 3. Drop tables in dependency order
DROP TABLE IF EXISTS public.applied_scholarships CASCADE;
DROP TABLE IF EXISTS public.fee_installments CASCADE;
DROP TABLE IF EXISTS public.student_fee_dues CASCADE;
