-- supabase/migrations/20260918_revoke_dangerous_functions.sql
-- =============================================================================
-- DEF-C1 FIX: Revoke public and authenticated execution on money-moving functions
-- All pin transactions, fee processing, and scholarship disbursements MUST be
-- executed authoritatively by backend server routes using the service_role key.
-- =============================================================================

-- Revoke public, anon, and authenticated execution on money-moving functions
REVOKE EXECUTE ON FUNCTION public.spend_pins(UUID, INTEGER, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.credit_pins(UUID, INTEGER, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.process_fee_installment_payment(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.apply_student_scholarship(TEXT, TEXT, NUMERIC, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.perform_daily_pin_reset() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_finance_dashboard_aggregates() FROM PUBLIC, anon, authenticated;

-- If relational scholarship function exists, revoke from public as well
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'apply_student_scholarship_relational'
    ) THEN
        EXECUTE 'REVOKE EXECUTE ON FUNCTION public.apply_student_scholarship_relational(TEXT, TEXT, NUMERIC, TEXT) FROM PUBLIC, anon, authenticated';
        EXECUTE 'GRANT EXECUTE ON FUNCTION public.apply_student_scholarship_relational(TEXT, TEXT, NUMERIC, TEXT) TO service_role';
    END IF;
END $$;

-- Allow ONLY service_role (backend server routes) to call them
GRANT EXECUTE ON FUNCTION public.spend_pins(UUID, INTEGER, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.credit_pins(UUID, INTEGER, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.process_fee_installment_payment(TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.apply_student_scholarship(TEXT, TEXT, NUMERIC, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.perform_daily_pin_reset() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_finance_dashboard_aggregates() TO service_role;
