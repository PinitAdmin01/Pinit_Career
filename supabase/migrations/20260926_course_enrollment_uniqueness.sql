-- Migration: one purchase ⇒ one enrollment
-- Backs the idempotency checks in /api/quests/enrollment and /api/payment/verify so that
-- concurrent requests (double-click, verify + webhook racing) cannot create two enrollments.
-- Requires 20260924_user_crash_enrollments_and_wallet_schema.sql.

-- At most one ACTIVE enrollment per student per plan (Pins double-purchase guard).
CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_crash_enrollment_per_plan
  ON public.user_crash_enrollments (user_id, plan_id)
  WHERE status = 'active';

-- A card payment can fulfil exactly one enrollment (verify/webhook race guard).
CREATE UNIQUE INDEX IF NOT EXISTS uniq_crash_enrollment_card_payment
  ON public.user_crash_enrollments (payment_id)
  WHERE payment_method = 'razorpay';
