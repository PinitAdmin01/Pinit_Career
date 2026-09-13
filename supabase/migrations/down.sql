-- supabase/migrations/down.sql
-- Master Rollback Migration for Financial & Concurrency RPCs and Tables

-- 1. Revoke permissions and drop spend_pins RPC function (Defect 028 rollback)
REVOKE EXECUTE ON FUNCTION public.spend_pins(UUID, INTEGER, TEXT) FROM authenticated, service_role;
DROP FUNCTION IF EXISTS public.spend_pins(UUID, INTEGER, TEXT);

-- 2. Drop Row Level Security policies on payment_idempotency_keys (Defect 029 rollback)
DROP POLICY IF EXISTS "Authenticated users can read own payment locks" ON public.payment_idempotency_keys;
DROP POLICY IF EXISTS "Service role can manage payment idempotency keys" ON public.payment_idempotency_keys;

-- 3. Drop distributed payment idempotency keys table
DROP TABLE IF EXISTS public.payment_idempotency_keys CASCADE;
