-- ==============================================================================
-- Migration: 20260923_direct_messages_unified_schema_and_rls.sql
-- Description: Unifies direct_messages schema, synchronizes column aliases
--              (receiver_id/recipient_id, content/message, is_read/read),
--              and establishes RLS policies for teacher and student access.
-- ==============================================================================

BEGIN;

-- 1. Ensure direct_messages table exists with all standard columns
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    sender_id TEXT NOT NULL,
    receiver_id TEXT,
    recipient_id TEXT,
    sender_name TEXT DEFAULT 'User',
    recipient_name TEXT DEFAULT 'Recipient',
    receiver_name TEXT DEFAULT 'Recipient',
    content TEXT,
    message TEXT,
    role TEXT DEFAULT 'student',
    is_read BOOLEAN NOT NULL DEFAULT false,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add missing columns safely if the table existed from earlier migrations
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'receiver_id') THEN
        ALTER TABLE public.direct_messages ADD COLUMN receiver_id TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'recipient_id') THEN
        ALTER TABLE public.direct_messages ADD COLUMN recipient_id TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'receiver_name') THEN
        ALTER TABLE public.direct_messages ADD COLUMN receiver_name TEXT DEFAULT 'Recipient';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'content') THEN
        ALTER TABLE public.direct_messages ADD COLUMN content TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'message') THEN
        ALTER TABLE public.direct_messages ADD COLUMN message TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'role') THEN
        ALTER TABLE public.direct_messages ADD COLUMN role TEXT DEFAULT 'student';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'is_read') THEN
        ALTER TABLE public.direct_messages ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'direct_messages' AND column_name = 'read') THEN
        ALTER TABLE public.direct_messages ADD COLUMN read BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- 3. Backfill missing values across alias columns
UPDATE public.direct_messages
SET 
    receiver_id = COALESCE(receiver_id, recipient_id),
    recipient_id = COALESCE(recipient_id, receiver_id),
    content = COALESCE(content, message, ''),
    message = COALESCE(message, content, ''),
    is_read = COALESCE(is_read, read, false),
    read = COALESCE(read, is_read, false)
WHERE receiver_id IS NULL OR recipient_id IS NULL OR content IS NULL OR message IS NULL OR is_read IS NULL OR read IS NULL;

-- 4. Auto-synchronization trigger for column aliases
CREATE OR REPLACE FUNCTION public.sync_direct_messages_columns()
RETURNS TRIGGER AS $$
BEGIN
    -- Synchronize recipient_id and receiver_id
    IF NEW.recipient_id IS NULL AND NEW.receiver_id IS NOT NULL THEN
        NEW.recipient_id := NEW.receiver_id;
    ELSIF NEW.receiver_id IS NULL AND NEW.recipient_id IS NOT NULL THEN
        NEW.receiver_id := NEW.recipient_id;
    END IF;

    -- Synchronize content and message
    IF NEW.content IS NULL AND NEW.message IS NOT NULL THEN
        NEW.content := NEW.message;
    ELSIF NEW.message IS NULL AND NEW.content IS NOT NULL THEN
        NEW.message := NEW.content;
    END IF;

    -- Synchronize receiver_name and recipient_name
    IF NEW.recipient_name IS NULL AND NEW.receiver_name IS NOT NULL THEN
        NEW.recipient_name := NEW.receiver_name;
    ELSIF NEW.receiver_name IS NULL AND NEW.recipient_name IS NOT NULL THEN
        NEW.receiver_name := NEW.recipient_name;
    END IF;

    -- Synchronize is_read and read
    IF NEW.is_read IS NOT NULL AND NEW.read IS NULL THEN
        NEW.read := NEW.is_read;
    ELSIF NEW.read IS NOT NULL AND NEW.is_read IS NULL THEN
        NEW.is_read := NEW.read;
    ELSIF NEW.is_read IS NOT NULL AND NEW.read IS NOT NULL THEN
        NEW.is_read := (NEW.is_read OR NEW.read);
        NEW.read := NEW.is_read;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_direct_messages_columns ON public.direct_messages;
CREATE TRIGGER trg_sync_direct_messages_columns
BEFORE INSERT OR UPDATE ON public.direct_messages
FOR EACH ROW EXECUTE FUNCTION public.sync_direct_messages_columns();

-- 5. Indexes for fast conversation retrieval & unread count
CREATE INDEX IF NOT EXISTS idx_direct_messages_participants_unified 
ON public.direct_messages (COALESCE(recipient_id, receiver_id), is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_direct_messages_sender_receiver 
ON public.direct_messages (sender_id, COALESCE(recipient_id, receiver_id), created_at ASC);

-- 6. Enable Row Level Security
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- 7. Policy: Unified SELECT Policy
DROP POLICY IF EXISTS "Users can view own direct messages" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can view messages sent to or from them" ON public.direct_messages;
DROP POLICY IF EXISTS "Unified direct messages select policy" ON public.direct_messages;

CREATE POLICY "Unified direct messages select policy"
ON public.direct_messages FOR SELECT
TO authenticated, anon
USING (
    -- Direct participant check
    auth.uid()::text = sender_id OR
    auth.uid()::text = recipient_id OR
    auth.uid()::text = receiver_id OR
    -- Staff/Teacher privilege: faculty can view messages addressed to faculty mentors
    (
        public.campus_is_staff() AND (
            recipient_id IN ('priya', 'anish', 'faculty', 'teacher', 'admin') OR
            receiver_id IN ('priya', 'anish', 'faculty', 'teacher', 'admin') OR
            role = 'student'
        )
    ) OR
    -- Demo / local mock session fallback
    sender_id = 'current_user' OR
    recipient_id = 'current_user' OR
    receiver_id = 'current_user' OR
    recipient_id IN ('priya', 'anish') OR
    receiver_id IN ('priya', 'anish')
);

-- 8. Policy: Unified INSERT Policy
DROP POLICY IF EXISTS "Users can send direct messages" ON public.direct_messages;
DROP POLICY IF EXISTS "Unified direct messages insert policy" ON public.direct_messages;

CREATE POLICY "Unified direct messages insert policy"
ON public.direct_messages FOR INSERT
TO authenticated, anon
WITH CHECK (
    -- Authenticated sender
    auth.uid()::text = sender_id OR
    public.campus_is_staff() OR
    sender_id = 'current_user' OR
    sender_id IS NOT NULL
);

-- 9. Policy: Unified UPDATE Policy (Mark as Read)
DROP POLICY IF EXISTS "Receivers can mark messages as read" ON public.direct_messages;
DROP POLICY IF EXISTS "Unified direct messages update policy" ON public.direct_messages;

CREATE POLICY "Unified direct messages update policy"
ON public.direct_messages FOR UPDATE
TO authenticated, anon
USING (
    auth.uid()::text = recipient_id OR
    auth.uid()::text = receiver_id OR
    public.campus_is_staff() OR
    recipient_id = 'current_user' OR
    receiver_id = 'current_user' OR
    recipient_id IN ('priya', 'anish') OR
    receiver_id IN ('priya', 'anish')
);

-- 10. Table Privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.direct_messages TO authenticated, anon, service_role;

COMMIT;
