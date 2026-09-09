// Server-side face template store with Supabase PostgreSQL persistence + in-memory L1 cache + disk L2 cache
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const memoryCache = new Map<string, number[]>();

function getDiskCachePath(): string {
  try {
    const dir = path.join(process.cwd(), '.cache');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, 'face_templates.json');
  } catch {
    return '';
  }
}

function readDiskCache(): Record<string, number[]> {
  try {
    const filePath = getDiskCachePath();
    if (filePath && fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    // Disk read failed gracefully
  }
  return {};
}

function writeDiskCache(key: string, vector: number[]) {
  try {
    const filePath = getDiskCachePath();
    if (!filePath) return;
    const current = readDiskCache();
    current[key] = vector;
    fs.writeFileSync(filePath, JSON.stringify(current), 'utf-8');
  } catch {
    // Disk write failed gracefully
  }
}

// Seed memory cache from disk cache on initialization
try {
  const diskData = readDiskCache();
  for (const [k, v] of Object.entries(diskData)) {
    if (Array.isArray(v)) {
      memoryCache.set(k.trim().toLowerCase(), v);
    }
  }
} catch {}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceRoleKey) {
    // Fail-safe: without SUPABASE_SERVICE_ROLE_KEY, do not instantiate with the anon key
    // because anonymous writes are blocked by PostgreSQL RLS. L1 memory and L2 persistent disk cache handle persistence.
    return null;
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

/**
 * Retrieve stored face descriptor vector for a user key (email or username).
 * Checks L1 in-memory cache first, then L2 disk cache, then falls back to Supabase `face_templates` table.
 */
export async function getFaceTemplate(userKey: string): Promise<number[] | null> {
  const cleanKey = String(userKey).trim().toLowerCase();
  if (!cleanKey) return null;

  // 1. Check L1 Memory Cache
  if (memoryCache.has(cleanKey)) {
    return memoryCache.get(cleanKey) || null;
  }

  // 2. Check L2 Disk Cache
  const diskData = readDiskCache();
  if (diskData[cleanKey] && Array.isArray(diskData[cleanKey])) {
    memoryCache.set(cleanKey, diskData[cleanKey]);
    return diskData[cleanKey];
  }

  // 3. Query Supabase `face_templates` table
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

  // 2. Persist to L2 Disk Cache
  writeDiskCache(cleanKey, vector);

  // 3. Persist to Supabase `face_templates`
  const supabase = getSupabaseAdmin();
  if (!supabase) return true; // Cached in memory and disk

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
