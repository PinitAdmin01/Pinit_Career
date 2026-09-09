-- Avatar mentor memory: what the mentor remembers about a student between
-- sessions.
--
-- Why this table exists: AvatarMentorWidget PATCHes /api/avatar/memory on every
-- profile change, and reads it back through /api/avatar/context. Neither had a
-- handler that stored anything — the PATCH fell through to a catch-all that
-- returned { ok: true } without writing, and context always replied with an
-- empty memory. The mentor therefore met every student as a stranger, every
-- time, while appearing to save.
--
-- Note on contents: usePersonalAvatarMemory.exportMemory deliberately excludes
-- conversation transcripts (it filters out the 'conversation' memory type and
-- sends an empty conversationHistory). This table follows that: it holds the
-- persona, durable non-conversation memories and relationship state only. Do
-- not start storing transcripts here without revisiting consent.

CREATE TABLE IF NOT EXISTS public.avatar_memory (
    user_id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    persona            JSONB NOT NULL DEFAULT '{}'::jsonb,
    memories           JSONB NOT NULL DEFAULT '[]'::jsonb,
    relationship_state JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.avatar_memory ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.avatar_memory FROM anon;

-- Strictly private. Unlike the attention leaderboard there is no reason for one
-- student to read another's mentor memory.
DROP POLICY IF EXISTS "Students can read their own avatar memory" ON public.avatar_memory;
CREATE POLICY "Students can read their own avatar memory"
    ON public.avatar_memory FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can insert their own avatar memory" ON public.avatar_memory;
CREATE POLICY "Students can insert their own avatar memory"
    ON public.avatar_memory FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can update their own avatar memory" ON public.avatar_memory;
CREATE POLICY "Students can update their own avatar memory"
    ON public.avatar_memory FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
