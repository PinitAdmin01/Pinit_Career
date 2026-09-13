-- Migration: 20260914_interview_sessions.sql
-- Description: Relational persistence for AI mock interview sessions, telemetry, and evaluations

CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mode text NOT NULL DEFAULT 'technical',
  domain text,
  pressure_mode text DEFAULT 'normal',
  persona text DEFAULT 'professional',
  status text DEFAULT 'completed',
  overall_score integer DEFAULT 0,
  transcript jsonb DEFAULT '[]'::jsonb,
  evaluation jsonb DEFAULT '{}'::jsonb,
  session_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for keyset pagination and recent session lookups
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_created 
  ON public.interview_sessions(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users own their interview sessions" ON public.interview_sessions;
CREATE POLICY "Users own their interview sessions"
  ON public.interview_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Staff/Admin review access
DROP POLICY IF EXISTS "Staff can review interview sessions" ON public.interview_sessions;
CREATE POLICY "Staff can review interview sessions"
  ON public.interview_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin', 'teacher', 'recruiter')
    )
  );


-- Task 3.4: Authoritative RPC for pin balance lookup
CREATE OR REPLACE FUNCTION public.get_pin_balance(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pins INTEGER;
BEGIN
  SELECT pins INTO v_pins FROM public.users WHERE id = p_user_id;
  RETURN COALESCE(v_pins, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_pin_balance(UUID) TO authenticated, service_role, anon;
