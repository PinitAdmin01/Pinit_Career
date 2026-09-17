-- ==============================================================================
-- PinIT Career OS — Friends & Student Collaboration Center (V1 - V6 Schema)
-- Comprehensive Production Supabase Migration
-- Idempotent: Can be safely run multiple times in Supabase SQL Editor
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. V1: Friendships Table & Unordered Unique Pair Index
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at TIMESTAMPTZ,
    CONSTRAINT chk_friendship_no_self CHECK (requester_id <> addressee_id)
);

-- Unordered unique pair index: guarantees (A, B) and (B, A) are treated as the same unique relationship
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
    TO authenticated
    USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

DROP POLICY IF EXISTS "Users can send friend requests as themselves" ON public.friendships;
CREATE POLICY "Users can send friend requests as themselves"
    ON public.friendships FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can respond to or cancel their friend requests" ON public.friendships;
CREATE POLICY "Users can respond to or cancel their friend requests"
    ON public.friendships FOR UPDATE
    TO authenticated
    USING (auth.uid() = addressee_id OR auth.uid() = requester_id);

DROP POLICY IF EXISTS "Users can delete friendships involving them" ON public.friendships;
CREATE POLICY "Users can delete friendships involving them"
    ON public.friendships FOR DELETE
    TO authenticated
    USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- ==============================================================================
-- 2. V2: Direct Messages (1-to-1 Realtime Chat)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL CHECK (char_length(trim(message)) > 0 AND char_length(message) <= 2000),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_message_no_self CHECK (sender_id <> receiver_id)
);

-- Compound conversation thread index ordered chronologically
CREATE INDEX IF NOT EXISTS idx_direct_messages_thread ON public.direct_messages (
    least(sender_id, receiver_id),
    greatest(sender_id, receiver_id),
    created_at
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_unread ON public.direct_messages (receiver_id, is_read);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages sent to or from them" ON public.direct_messages;
CREATE POLICY "Users can view messages sent to or from them"
    ON public.direct_messages FOR SELECT
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send direct messages" ON public.direct_messages;
CREATE POLICY "Users can send direct messages"
    ON public.direct_messages FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Receivers can mark messages as read" ON public.direct_messages;
CREATE POLICY "Receivers can mark messages as read"
    ON public.direct_messages FOR UPDATE
    TO authenticated
    USING (auth.uid() = receiver_id);

-- ==============================================================================
-- 3. V3: Arena Invitations (Challenging Arena 1v1 Duels)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.arena_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL DEFAULT 'JavaScript DSA',
    difficulty TEXT NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    time_limit INTEGER NOT NULL DEFAULT 20 CHECK (time_limit >= 5 AND time_limit <= 120),
    wager_xp INTEGER NOT NULL DEFAULT 100 CHECK (wager_xp >= 0 AND wager_xp <= 1000),
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
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can dispatch arena challenges" ON public.arena_invitations;
CREATE POLICY "Users can dispatch arena challenges"
    ON public.arena_invitations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Receivers can accept or decline arena challenges" ON public.arena_invitations;
CREATE POLICY "Receivers can accept or decline arena challenges"
    ON public.arena_invitations FOR UPDATE
    TO authenticated
    USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

-- ==============================================================================
-- 4. V4: Project Invitations (Squad Collaboration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.project_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Frontend Developer',
    commitment_hours INTEGER NOT NULL DEFAULT 5 CHECK (commitment_hours >= 1 AND commitment_hours <= 60),
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
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can dispatch project invitations" ON public.project_invitations;
CREATE POLICY "Users can dispatch project invitations"
    ON public.project_invitations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Receivers can accept or decline project invitations" ON public.project_invitations;
CREATE POLICY "Receivers can accept or decline project invitations"
    ON public.project_invitations FOR UPDATE
    TO authenticated
    USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

-- ==============================================================================
-- 5. V5: User Privacy & Affinity Configuration
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_privacy_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    who_can_send_requests TEXT NOT NULL DEFAULT 'everyone' CHECK (who_can_send_requests IN ('everyone', 'campus_only', 'mutual_only')),
    profile_visibility TEXT NOT NULL DEFAULT 'public' CHECK (profile_visibility IN ('public', 'campus', 'private')),
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
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can insert their own privacy settings" ON public.user_privacy_settings;
CREATE POLICY "Users can insert their own privacy settings"
    ON public.user_privacy_settings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own privacy settings" ON public.user_privacy_settings;
CREATE POLICY "Users can update their own privacy settings"
    ON public.user_privacy_settings FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 6. V6: User Blocks & Moderation Reports (Safety Center)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    blocked_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can block others" ON public.user_blocks;
CREATE POLICY "Users can block others"
    ON public.user_blocks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unblock others" ON public.user_blocks;
CREATE POLICY "Users can unblock others"
    ON public.user_blocks FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Moderation Incident Reports
CREATE TABLE IF NOT EXISTS public.user_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (char_length(trim(reason)) > 0 AND char_length(reason) <= 100),
    details TEXT CHECK (char_length(details) <= 2000),
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
    TO authenticated
    USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can file moderation reports" ON public.user_reports;
CREATE POLICY "Users can file moderation reports"
    ON public.user_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = reporter_id);

-- ==============================================================================
-- 7. Automated Safety Trigger: Sever friendships & pending invites on block
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_user_block_sever_connections()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete existing friendships between the two users
    DELETE FROM public.friendships
    WHERE (requester_id = NEW.user_id AND addressee_id = NEW.blocked_user_id)
       OR (requester_id = NEW.blocked_user_id AND addressee_id = NEW.user_id);

    -- Cancel any pending arena duel invitations between them
    DELETE FROM public.arena_invitations
    WHERE ((sender_id = NEW.user_id AND receiver_id = NEW.blocked_user_id)
       OR  (sender_id = NEW.blocked_user_id AND receiver_id = NEW.user_id))
      AND status = 'pending';

    -- Cancel any pending squad project invitations between them
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
-- 8. Grant Table Permissions to Authenticated & Service Roles
-- ==============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.friendships TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.direct_messages TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.arena_invitations TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_invitations TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_privacy_settings TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_blocks TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_reports TO authenticated, service_role;
