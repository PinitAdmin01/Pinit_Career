-- Migration: 20260914_portfolio_persistence.sql
-- Description: Persistent relational storage for student portfolio data (pitch, projects, certificates, timeline, achievements, recommendations, GitHub repos, research)

CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('pitch','project','projects','certificate','certificates','timeline','achievement','achievements','recommendation','recommendations','github_repo','github_repos','research')),
  item_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolio_type ON portfolio_items(user_id, item_type);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'portfolio_items' 
    AND policyname = 'Users own their portfolio'
  ) THEN
    CREATE POLICY "Users own their portfolio" ON portfolio_items FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
