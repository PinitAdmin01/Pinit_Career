-- supabase/migrations/20260908_create_processed_payments.sql
-- PinIT Career OS: Payment Idempotency & Replay Protection Table

CREATE TABLE IF NOT EXISTS public.processed_payments (
    payment_id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    pins_granted INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.processed_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own processed payments" ON public.processed_payments;
CREATE POLICY "Users can view own processed payments" ON public.processed_payments
    FOR SELECT TO authenticated USING (user_id = auth.uid()::text);

-- Only trusted backend service_role can insert processed payment records
DROP POLICY IF EXISTS "Service role can insert processed payments" ON public.processed_payments;
CREATE POLICY "Service role can insert processed payments" ON public.processed_payments
    FOR INSERT TO service_role WITH CHECK (true);
