-- ==============================================================================
-- PinIT Career OS — Friends & Student Collaboration Center (V1 - V6 Schema)
-- Comprehensive Production Supabase Migration
-- 100% Compatible with Existing Database Tables & Columns
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. V1: Friendships Table & Unordered Unique Pair Index
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.friendships (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    requester_id TEXT NOT NULL,
    addressee_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at TIMESTAMPTZ,
    CONSTRAINT chk_friendship_no_self CHECK (requester_id <> addressee_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS friendships_unique_pair ON public.friendships (
    least(requester_id, addressee_id),
    greatest(requester_id, addressee_id)
);

CREATE INDEX IF NOT EXISTS idx_friendships_requester ON public.friendships (requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON public.friendships (addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON public.friendships (status);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view friendships involving them" ON public.friendships;
CREATE POLICY "Users can view friendships involving them"
    ON public.friendships FOR SELECT
    TO authenticated, anon
    USING (auth.uid()::text = requester_id OR auth.uid()::text = addressee_id OR requester_id = 'current_user' OR addressee_id = 'current_user');

DROP POLICY IF EXISTS "Users can send friend requests as themselves" ON public.friendships;
CREATE POLICY "Users can send friend requests as themselves"
    ON public.friendships FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid()::text = requester_id OR requester_id = 'current_user');

DROP POLICY IF EXISTS "Users can respond to or cancel their friend requests" ON public.friendships;
CREATE POLICY "Users can respond to or cancel their friend requests"
    ON public.friendships FOR UPDATE
    TO authenticated, anon
    USING (auth.uid()::text = addressee_id OR auth.uid()::text = requester_id OR addressee_id = 'current_user' OR requester_id = 'current_user');

DROP POLICY IF EXISTS "Users can delete friendships involving them" ON public.friendships;
CREATE POLICY "Users can delete friendships involving them"
    ON public.friendships FOR DELETE
    TO authenticated, anon
    USING (auth.uid()::text = requester_id OR auth.uid()::text = addressee_id OR requester_id = 'current_user' OR addressee_id = 'current_user');

-- ==============================================================================
-- 2. V2: Direct Messages (1-to-1 Realtime Chat) - Compatible with Existing Schema
-- ==============================================================================
DO $$ 
BEGIN
    -- Create table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'direct_messages') THEN
        CREATE TABLE public.direct_messages (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
            sender_id TEXT NOT NULL,
            receiver_id TEXT NOT NULL,
            recipient_id TEXT,
            sender_name TEXT DEFAULT 'Student',
            recipient_name TEXT DEFAULT 'Student',
            message TEXT,
            content TEXT,
            role TEXT DEFAULT 'student',
            is_read BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    ELSE
        -- Table already exists: ensure both receiver_id and recipient_id exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'receiver_id') THEN
            ALTER TABLE public.direct_messages ADD COLUMN receiver_id TEXT;
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'recipient_id') THEN
                UPDATE public.direct_messages SET receiver_id = recipient_id WHERE receiver_id IS NULL;
            END IF;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'recipient_id') THEN
            ALTER TABLE public.direct_messages ADD COLUMN recipient_id TEXT;
            UPDATE public.direct_messages SET recipient_id = receiver_id WHERE recipient_id IS NULL;
        END IF;

        -- Ensure both message and content exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'message') THEN
            ALTER TABLE public.direct_messages ADD COLUMN message TEXT;
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'content') THEN
                UPDATE public.direct_messages SET message = content WHERE message IS NULL;
            END IF;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'content') THEN
            ALTER TABLE public.direct_messages ADD COLUMN content TEXT;
            UPDATE public.direct_messages SET content = message WHERE content IS NULL;
        END IF;
    END IF;
END $$;

-- Safe indexes on direct_messages
CREATE INDEX IF NOT EXISTS idx_direct_messages_thread ON public.direct_messages (
    least(sender_id, COALESCE(receiver_id, recipient_id, '')),
    greatest(sender_id, COALESCE(receiver_id, recipient_id, '')),
    created_at
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_unread ON public.direct_messages (
    receiver_id,
    is_read
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages sent to or from them" ON public.direct_messages;
CREATE POLICY "Users can view messages sent to or from them"
    ON public.direct_messages FOR SELECT
    TO authenticated, anon
    USING (
        auth.uid()::text = sender_id OR 
        auth.uid()::text = receiver_id OR 
        auth.uid()::text = recipient_id OR
        sender_id = 'current_user' OR 
        receiver_id = 'current_user' OR 
        recipient_id = 'current_user'
    );

DROP POLICY IF EXISTS "Users can send direct messages" ON public.direct_messages;
CREATE POLICY "Users can send direct messages"
    ON public.direct_messages FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid()::text = sender_id OR sender_id = 'current_user');

DROP POLICY IF EXISTS "Receivers can mark messages as read" ON public.direct_messages;
CREATE POLICY "Receivers can mark messages as read"
    ON public.direct_messages FOR UPDATE
    TO authenticated, anon
    USING (auth.uid()::text = receiver_id OR auth.uid()::text = recipient_id OR receiver_id = 'current_user' OR recipient_id = 'current_user');

-- ==============================================================================
-- 3. V3: Arena Invitations (Challenging Arena 1v1 Duels)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.arena_invitations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    topic TEXT NOT NULL DEFAULT 'JavaScript DSA',
    difficulty TEXT NOT NULL DEFAULT 'Medium',
    time_limit INTEGER NOT NULL DEFAULT 20,
    wager_xp INTEGER NOT NULL DEFAULT 100,
    message TEXT DEFAULT 'I challenge you to a 1v1 battle in the Challenging Arena!',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    battle_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '24 hours'),
    CONSTRAINT chk_arena_no_self CHECK (sender_id <> receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_arena_inv_receiver ON public.arena_invitations (receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_arena_inv_sender ON public.arena_invitations (sender_id);

ALTER TABLE public.arena_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their arena invitations" ON public.arena_invitations;
CREATE POLICY "Users can view their arena invitations"
    ON public.arena_invitations FOR SELECT
    TO authenticated, anon
    USING (auth.uid()::text = sender_id OR auth.uid()::text = receiver_id OR sender_id = 'current_user' OR receiver_id = 'current_user');

DROP POLICY IF EXISTS "Users can dispatch arena challenges" ON public.arena_invitations;
CREATE POLICY "Users can dispatch arena challenges"
    ON public.arena_invitations FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid()::text = sender_id OR sender_id = 'current_user');

DROP POLICY IF EXISTS "Receivers can accept or decline arena challenges" ON public.arena_invitations;
CREATE POLICY "Receivers can accept or decline arena challenges"
    ON public.arena_invitations FOR UPDATE
    TO authenticated, anon
    USING (auth.uid()::text = receiver_id OR auth.uid()::text = sender_id OR receiver_id = 'current_user' OR sender_id = 'current_user');

-- ==============================================================================
-- 4. V4: Project Invitations (Squad Collaboration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.project_invitations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    project_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Frontend Developer',
    commitment_hours INTEGER NOT NULL DEFAULT 5,
    message TEXT DEFAULT 'Join our squad!',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '7 days'),
    CONSTRAINT chk_project_no_self CHECK (sender_id <> receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_proj_inv_receiver ON public.project_invitations (receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_proj_inv_sender ON public.project_invitations (sender_id);

ALTER TABLE public.project_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their project invitations" ON public.project_invitations;
CREATE POLICY "Users can view their project invitations"
    ON public.project_invitations FOR SELECT
    TO authenticated, anon
    USING (auth.uid()::text = sender_id OR auth.uid()::text = receiver_id OR sender_id = 'current_user' OR receiver_id = 'current_user');

DROP POLICY IF EXISTS "Users can dispatch project invitations" ON public.project_invitations;
CREATE POLICY "Users can dispatch project invitations"
    ON public.project_invitations FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid()::text = sender_id OR sender_id = 'current_user');

DROP POLICY IF EXISTS "Receivers can accept or decline project invitations" ON public.project_invitations;
CREATE POLICY "Receivers can accept or decline project invitations"
    ON public.project_invitations FOR UPDATE
    TO authenticated, anon
    USING (auth.uid()::text = receiver_id OR auth.uid()::text = sender_id OR receiver_id = 'current_user' OR sender_id = 'current_user');

-- ==============================================================================
-- 5. V5: User Privacy & Affinity Configuration
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_privacy_settings (
    user_id TEXT PRIMARY KEY,
    who_can_send_requests TEXT NOT NULL DEFAULT 'everyone',
    profile_visibility TEXT NOT NULL DEFAULT 'public',
    show_online_beacon BOOLEAN NOT NULL DEFAULT true,
    show_in_suggestions BOOLEAN NOT NULL DEFAULT true,
    allow_challenges BOOLEAN NOT NULL DEFAULT true,
    allow_squad_invites BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view anyone's public privacy toggles" ON public.user_privacy_settings;
CREATE POLICY "Users can view anyone's public privacy toggles"
    ON public.user_privacy_settings FOR SELECT
    TO authenticated, anon
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own privacy settings" ON public.user_privacy_settings;
CREATE POLICY "Users can insert their own privacy settings"
    ON public.user_privacy_settings FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid()::text = user_id OR user_id = 'current_user');

DROP POLICY IF EXISTS "Users can update their own privacy settings" ON public.user_privacy_settings;
CREATE POLICY "Users can update their own privacy settings"
    ON public.user_privacy_settings FOR UPDATE
    TO authenticated, anon
    USING (auth.uid()::text = user_id OR user_id = 'current_user');

-- ==============================================================================
-- 6. V6: User Blocks & Moderation Reports (Safety Center)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_blocks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL,
    blocked_user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_block_no_self CHECK (user_id <> blocked_user_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS user_blocks_unique ON public.user_blocks (user_id, blocked_user_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_user ON public.user_blocks (user_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_target ON public.user_blocks (blocked_user_id);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own block list" ON public.user_blocks;
CREATE POLICY "Users can view their own block list"
    ON public.user_blocks FOR SELECT
    TO authenticated, anon
    USING (auth.uid()::text = user_id OR user_id = 'current_user');

DROP POLICY IF EXISTS "Users can block others" ON public.user_blocks;
CREATE POLICY "Users can block others"
    ON public.user_blocks FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid()::text = user_id OR user_id = 'current_user');

DROP POLICY IF EXISTS "Users can unblock others" ON public.user_blocks;
CREATE POLICY "Users can unblock others"
    ON public.user_blocks FOR DELETE
    TO authenticated, anon
    USING (auth.uid()::text = user_id OR user_id = 'current_user');

-- Moderation Incident Reports
CREATE TABLE IF NOT EXISTS public.user_reports (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    reporter_id TEXT NOT NULL,
    reported_user_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'investigating', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    CONSTRAINT chk_report_no_self CHECK (reporter_id <> reported_user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_reports_status ON public.user_reports (status, created_at);

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own submitted reports" ON public.user_reports;
CREATE POLICY "Users can view their own submitted reports"
    ON public.user_reports FOR SELECT
    TO authenticated, anon
    USING (auth.uid()::text = reporter_id OR reporter_id = 'current_user');

DROP POLICY IF EXISTS "Users can file moderation reports" ON public.user_reports;
CREATE POLICY "Users can file moderation reports"
    ON public.user_reports FOR INSERT
    TO authenticated, anon
    WITH CHECK (auth.uid()::text = reporter_id OR reporter_id = 'current_user');

-- ==============================================================================
-- 7. Automated Safety Trigger: Sever friendships & pending invites on block
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_user_block_sever_connections()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.friendships
    WHERE (requester_id = NEW.user_id AND addressee_id = NEW.blocked_user_id)
       OR (requester_id = NEW.blocked_user_id AND addressee_id = NEW.user_id);

    DELETE FROM public.arena_invitations
    WHERE ((sender_id = NEW.user_id AND receiver_id = NEW.blocked_user_id)
       OR  (sender_id = NEW.blocked_user_id AND receiver_id = NEW.user_id))
      AND status = 'pending';

    DELETE FROM public.project_invitations
    WHERE ((sender_id = NEW.user_id AND receiver_id = NEW.blocked_user_id)
       OR  (sender_id = NEW.blocked_user_id AND receiver_id = NEW.user_id))
      AND status = 'pending';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_on_user_block ON public.user_blocks;
CREATE TRIGGER trigger_on_user_block
    AFTER INSERT ON public.user_blocks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_block_sever_connections();

-- ==============================================================================
-- 8. Grant Table Permissions to Authenticated, Anon & Service Roles
-- ==============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.friendships TO authenticated, anon, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.direct_messages TO authenticated, anon, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.arena_invitations TO authenticated, anon, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_invitations TO authenticated, anon, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_privacy_settings TO authenticated, anon, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_blocks TO authenticated, anon, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_reports TO authenticated, anon, service_role;
