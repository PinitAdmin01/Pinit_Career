-- Migration: create hostel_requests table
CREATE TABLE IF NOT EXISTS hostel_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  room_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  complaints JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_hostel_requests_user_id ON hostel_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_hostel_requests_status ON hostel_requests(status);

-- Enable RLS
ALTER TABLE hostel_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own hostel requests"
  ON hostel_requests FOR SELECT
  USING (auth.uid()::text = user_id OR user_id = 'demo-user');

CREATE POLICY "Users can insert their own hostel requests"
  ON hostel_requests FOR INSERT
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'demo-user');

CREATE POLICY "Users can update their own hostel requests"
  ON hostel_requests FOR UPDATE
  USING (auth.uid()::text = user_id OR user_id = 'demo-user');
