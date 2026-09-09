// src/lib/avatar/memoryStore.ts
/**
 * Persistence for the avatar mentor's memory of a student.
 *
 * Previously /api/avatar/memory fell through to a catch-all returning
 * { ok: true } without writing anything, so the mentor forgot everything
 * between sessions while appearing to save.
 *
 * Shape matches usePersonalAvatarMemory.exportMemory(), which sends persona,
 * durable memories and relationship state — and deliberately omits
 * conversation transcripts. Nothing here should start storing transcripts.
 *
 * Returns { ok: false } rather than throwing when the table is absent, so a
 * project that has not run the migration degrades to "remembers nothing"
 * instead of erroring on every profile change.
 */
import { supabase } from '@/lib/supabaseClient';
import { tableExists } from '@/lib/services/supabaseTable';

const TABLE = 'avatar_memory';

export interface AvatarMemory {
  userId: string;
  persona: Record<string, any>;
  memories: unknown[];
  conversationHistory: unknown[];
  relationshipState: Record<string, any>;
}

const NOT_MIGRATED = {
  ok: false as const,
  error: 'TABLE_MISSING',
  message: 'avatar_memory does not exist. Apply supabase/migrations/20260909_create_avatar_memory.sql.',
};

const empty = (userId: string): AvatarMemory => ({
  userId, persona: {}, memories: [], conversationHistory: [], relationshipState: {},
});

export async function loadAvatarMemory(userId: string): Promise<AvatarMemory> {
  if (!userId || !(await tableExists(TABLE))) return empty(userId);
  const { data, error } = await supabase
    .from(TABLE)
    .select('persona, memories, relationship_state')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return empty(userId);
  return {
    userId,
    persona: data.persona || {},
    memories: Array.isArray(data.memories) ? data.memories : [],
    // Never restored from storage — transcripts are not persisted by design.
    conversationHistory: [],
    relationshipState: data.relationship_state || {},
  };
}

export async function saveAvatarMemory(userId: string, incoming: unknown) {
  if (!userId) return { ok: false as const, error: 'NO_USER', message: 'Not signed in.' };
  if (!(await tableExists(TABLE))) return NOT_MIGRATED;

  const m = (incoming || {}) as Record<string, any>;
  const { error } = await supabase.from(TABLE).upsert({
    user_id: userId,
    persona: m.persona && typeof m.persona === 'object' ? m.persona : {},
    memories: Array.isArray(m.memories) ? m.memories : [],
    relationship_state: m.relationshipState && typeof m.relationshipState === 'object' ? m.relationshipState : {},
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) throw error;

  return { ok: true as const };
}
