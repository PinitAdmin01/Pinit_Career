// Server-side face template store with Supabase PostgreSQL persistence + in-memory L1 cache
import { createClient } from '@supabase/supabase-js';

const memoryCache = new Map<string, number[]>();

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

/**
 * Retrieve stored face descriptor vector for a user key (email or username).
 * Checks L1 in-memory cache first, then falls back to Supabase `face_templates` table.
 */
export async function getFaceTemplate(userKey: string): Promise<number[] | null> {
  const cleanKey = String(userKey).trim().toLowerCase();
  if (!cleanKey) return null;

  // 1. Check L1 Memory Cache
  if (memoryCache.has(cleanKey)) {
    return memoryCache.get(cleanKey) || null;
  }

  // 2. Query Supabase `face_templates` table
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('face_templates')
      .select('descriptor')
      .eq('user_key', cleanKey)
      .maybeSingle();

    if (error || !data?.descriptor) {
      return null;
    }

    const descriptor: number[] = Array.isArray(data.descriptor)
      ? data.descriptor
      : typeof data.descriptor === 'string'
        ? JSON.parse(data.descriptor)
        : null;

    if (descriptor && Array.isArray(descriptor)) {
      memoryCache.set(cleanKey, descriptor);
      return descriptor;
    }
  } catch (err) {
    console.warn('[FaceStore] Failed to fetch face template from Supabase:', err);
  }

  return null;
}

/**
 * Persist face descriptor vector to both L1 in-memory cache and Supabase `face_templates` table.
 */
export async function setFaceTemplate(userKey: string, vector: number[]): Promise<boolean> {
  const cleanKey = String(userKey).trim().toLowerCase();
  if (!cleanKey || !Array.isArray(vector)) return false;

  // 1. Set L1 Memory Cache
  memoryCache.set(cleanKey, vector);

  // 2. Persist to Supabase `face_templates`
  const supabase = getSupabaseAdmin();
  if (!supabase) return true; // Cached in memory at least

  try {
    const { error } = await supabase
      .from('face_templates')
      .upsert({
        user_key: cleanKey,
        descriptor: vector,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_key' });

    if (error) {
      console.warn('[FaceStore] Supabase face template upsert warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[FaceStore] Error saving face template to Supabase:', err);
    return false;
  }
}

// Backward compatibility map wrapper
const faceTemplateStore = {
  get: (key: string) => memoryCache.get(String(key).trim().toLowerCase()),
  set: (key: string, val: number[]) => {
    const cleanKey = String(key).trim().toLowerCase();
    memoryCache.set(cleanKey, val);
    setFaceTemplate(cleanKey, val).catch(() => {});
    return faceTemplateStore;
  },
  has: (key: string) => memoryCache.has(String(key).trim().toLowerCase()),
  delete: (key: string) => memoryCache.delete(String(key).trim().toLowerCase()),
};

export default faceTemplateStore;
