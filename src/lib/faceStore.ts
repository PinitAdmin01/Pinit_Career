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

function getPersistentDbPath(): string {
  try {
    const dir = path.join(process.cwd(), 'src', 'lib', 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, 'face_biometrics_db.json');
  } catch {
    return '';
  }
}

interface FaceDiskRecord {
  vector: number[];
  updatedAt: number;
}

// Task 3.2: Bound disk and memory cache with LRU eviction policy
export const MAX_DISK_TEMPLATES = 500;
export const MAX_DISK_BYTES = 10 * 1024 * 1024; // 10MB limit

function parseDiskRecords(data: Record<string, any>): Record<string, FaceDiskRecord> {
  const records: Record<string, FaceDiskRecord> = {};
  if (!data || typeof data !== 'object') return records;
  for (const [k, v] of Object.entries(data)) {
    const cleanKey = k.trim().toLowerCase();
    if (Array.isArray(v)) {
      records[cleanKey] = { vector: v, updatedAt: Date.now() };
    } else if (v && typeof v === 'object' && Array.isArray((v as any).vector)) {
      records[cleanKey] = {
        vector: (v as any).vector,
        updatedAt: typeof (v as any).updatedAt === 'number' ? (v as any).updatedAt : Date.now(),
      };
    }
  }
  return records;
}

function readRawDiskCache(): Record<string, FaceDiskRecord> {
  try {
    const persistentPath = getPersistentDbPath();
    if (persistentPath && fs.existsSync(persistentPath)) {
      const raw = fs.readFileSync(persistentPath, 'utf-8');
      const data = JSON.parse(raw);
      if (typeof data === 'object' && data !== null) return parseDiskRecords(data);
    }
    const filePath = getDiskCachePath();
    if (filePath && fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (typeof data === 'object' && data !== null) return parseDiskRecords(data);
    }
  } catch {
    // Disk read failed gracefully
  }
  return {};
}

function readDiskCache(): Record<string, number[]> {
  const raw = readRawDiskCache();
  const result: Record<string, number[]> = {};
  for (const [k, v] of Object.entries(raw)) {
    result[k] = v.vector;
  }
  return result;
}

function writeDiskCache(key: string, vector: number[]) {
  try {
    const records = readRawDiskCache();
    const cleanKey = key.trim().toLowerCase();
    records[cleanKey] = { vector, updatedAt: Date.now() };

    // Task 3.2: LRU Eviction on entry capacity breach (> 500 templates)
    const entries = Object.entries(records);
    if (entries.length > MAX_DISK_TEMPLATES) {
      // Sort ascending by updatedAt: oldest accessed/updated first
      entries.sort((a, b) => a[1].updatedAt - b[1].updatedAt);
      const toRemove = entries.length - MAX_DISK_TEMPLATES;
      for (let i = 0; i < toRemove; i++) {
        delete records[entries[i][0]];
        memoryCache.delete(entries[i][0]);
      }
    }

    // Task 3.2: LRU Eviction on byte threshold breach (> 10MB)
    let jsonStr = JSON.stringify(records, null, 2);
    if (Buffer.byteLength(jsonStr, 'utf-8') > MAX_DISK_BYTES) {
      const sorted = Object.entries(records).sort((a, b) => a[1].updatedAt - b[1].updatedAt);
      while (sorted.length > 0 && Buffer.byteLength(jsonStr, 'utf-8') > MAX_DISK_BYTES) {
        const oldest = sorted.shift();
        if (oldest) {
          delete records[oldest[0]];
          memoryCache.delete(oldest[0]);
          jsonStr = JSON.stringify(records, null, 2);
        }
      }
    }

    const persistentPath = getPersistentDbPath();
    if (persistentPath) {
      fs.writeFileSync(persistentPath, jsonStr, 'utf-8');
    }

    const filePath = getDiskCachePath();
    if (filePath) {
      fs.writeFileSync(filePath, jsonStr, 'utf-8');
    }
  } catch (err) {
    console.warn('[FaceStore] Disk cache write failed gracefully:', err);
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

  // 1. Check L1 Memory Cache (touch for LRU order)
  if (memoryCache.has(cleanKey)) {
    const cached = memoryCache.get(cleanKey) || null;
    if (cached) {
      memoryCache.delete(cleanKey);
      memoryCache.set(cleanKey, cached);
    }
    return cached;
  }

  // 2. Check L2 Disk Cache
  const diskData = readDiskCache();
  if (diskData[cleanKey] && Array.isArray(diskData[cleanKey])) {
    const descriptor = diskData[cleanKey];
    if (memoryCache.size >= MAX_DISK_TEMPLATES) {
      const oldest = memoryCache.keys().next().value;
      if (oldest) memoryCache.delete(oldest);
    }
    memoryCache.set(cleanKey, descriptor);
    return descriptor;
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

  // 1. Set L1 Memory Cache (bounded LRU)
  if (memoryCache.has(cleanKey)) {
    memoryCache.delete(cleanKey);
  } else if (memoryCache.size >= MAX_DISK_TEMPLATES) {
    const oldest = memoryCache.keys().next().value;
    if (oldest) memoryCache.delete(oldest);
  }
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
