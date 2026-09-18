-- ============================================================================
-- MIGRATION: User Crash Course Enrollments, Milestones & Wallet Ledger
-- Filename: 20260924_user_crash_enrollments_and_wallet_schema.sql
-- Description:
--   1. Creates public.user_crash_enrollments table for 1M, 3M, 6M, and 9M programs.
--   2. Adds JSONB milestone progress and verifiable certificate fields (SHA-256).
--   3. Configures Row Level Security (RLS) policies for student access.
--   4. Ensures users table has pin_history and bonus_pins columns for wallet passbook.
-- ============================================================================

-- 1. Ensure pin_history and bonus_pins exist on users table
ALTER TABLE IF EXISTS public.users 
  ADD COLUMN IF NOT EXISTS pin_history JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS bonus_pins INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pins INT DEFAULT 50;

-- 2. Create the user_crash_enrollments table
CREATE TABLE IF NOT EXISTS public.user_crash_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL, -- UUID string or demo ID
  plan_id TEXT NOT NULL, -- 'plan-1m-sprint' | 'plan-3m-accelerator' | 'plan-6m-pro' | 'plan-9m-master'
  track TEXT NOT NULL DEFAULT 'web_fullstack', -- 'web_fullstack' | 'python_ai'
  amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_id TEXT NOT NULL DEFAULT '',
  order_id TEXT DEFAULT '',
  payment_method TEXT NOT NULL DEFAULT 'sandbox', -- 'razorpay' | 'pins' | 'sandbox'
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'completed' | 'paused'
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_sprint INT NOT NULL DEFAULT 1 CHECK (current_sprint BETWEEN 1 AND 4),
  daily_learning_hours_target INT NOT NULL DEFAULT 1,
  reward_pins_credited INT NOT NULL DEFAULT 0,
  pins_deducted INT NOT NULL DEFAULT 0,
  milestone_progress JSONB NOT NULL DEFAULT '{
    "sprint1Approved": false,
    "sprint2Approved": false,
    "sprint3RepoUrl": null,
    "sprint3LiveUrl": null,
    "sprint4DefenseScore": null
  }'::jsonb,
  certificates_issued JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create Performance & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_crash_enrollments_user_id 
  ON public.user_crash_enrollments(user_id);

CREATE INDEX IF NOT EXISTS idx_crash_enrollments_user_status 
  ON public.user_crash_enrollments(user_id, status);

CREATE INDEX IF NOT EXISTS idx_crash_enrollments_plan_id 
  ON public.user_crash_enrollments(plan_id);

CREATE INDEX IF NOT EXISTS idx_crash_enrollments_enrolled_at 
  ON public.user_crash_enrollments(enrolled_at DESC);

-- 4. Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_crash_enrollments_updated_at ON public.user_crash_enrollments;
CREATE TRIGGER trigger_set_crash_enrollments_updated_at
  BEFORE UPDATE ON public.user_crash_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at_timestamp();

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.user_crash_enrollments ENABLE ROW LEVEL SECURITY;

-- Allow students to read their own enrollments
DROP POLICY IF EXISTS "Students can view own crash enrollments" ON public.user_crash_enrollments;
CREATE POLICY "Students can view own crash enrollments"
  ON public.user_crash_enrollments
  FOR SELECT
  USING (
    auth.uid()::text = user_id 
    OR user_id = 'student-demo'
  );

-- Allow students to update milestone details (e.g. GitHub URL, Live URL)
DROP POLICY IF EXISTS "Students can update own milestone submissions" ON public.user_crash_enrollments;
CREATE POLICY "Students can update own milestone submissions"
  ON public.user_crash_enrollments
  FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id = 'student-demo')
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'student-demo');

-- Allow server backend / service role complete administrative authority
DROP POLICY IF EXISTS "Service role full access on crash enrollments" ON public.user_crash_enrollments;
CREATE POLICY "Service role full access on crash enrollments"
  ON public.user_crash_enrollments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 6. RPC Helper Function: Get Student Pin Wallet & History
CREATE OR REPLACE FUNCTION public.get_student_pin_wallet(p_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'pins', COALESCE(pins, 0),
    'bonus_pins', COALESCE(bonus_pins, 0),
    'pin_history', COALESCE(pin_history, '[]'::jsonb)
  )
  INTO v_result
  FROM public.users
  WHERE id::text = p_user_id;

  IF v_result IS NULL THEN
    v_result := jsonb_build_object(
      'pins', 50,
      'bonus_pins', 0,
      'pin_history', '[]'::jsonb
    );
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.user_crash_enrollments IS 'Industry Crash Certification & Real-Time Internship enrollments, sprint milestones, and dual certificate hashes.';
