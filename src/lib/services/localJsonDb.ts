import { supabase } from '@/lib/supabaseClient';
import { tableExists } from '@/lib/services/supabaseTable';

/**
 * Campus JSON store, in order:
 * 1. Node JSON files (next dev)
 * 2. Shared public.campus_kv (all signed-in users see the same hostel/library)
 * 3. Per-user vault_items (if campus_kv is not created yet)
 * 4. Browser localStorage (demo session with no Supabase user — never seeded with fake people)
 *
 * Face / personal blobs must use scope: 'personal' so they never land in shared campus_kv.
 */

const memory = new Map<string, { value: unknown; at: number }>();
const MEMORY_MS = 1500;

function nodeFs(): typeof import('fs') | null {
  if (typeof window !== 'undefined') return null;
  try {
    if (typeof require !== 'undefined') { return require('fs') as typeof import('fs'); }
    throw new Error('localJsonDb: fs not available in this runtime (serverless/edge)');
  } catch {
    return null;
  }
}

function nodePath(): typeof import('path') | null {
  if (typeof window !== 'undefined') return null;
  try {
    if (typeof require !== 'undefined') { return require('path') as typeof import('path'); }
    throw new Error('localJsonDb: path not available in this runtime (serverless/edge)');
  } catch {
    return null;
  }
}

function campusTitle(relativePath: string): string {
  return `campus:${relativePath}`;
}

function storageKey(relativePath: string): string {
  return `pinit_campus:${relativePath}`;
}

function memGet<T>(key: string): T | undefined {
  const hit = memory.get(key);
  if (!hit) return undefined;
  if (Date.now() - hit.at > MEMORY_MS) {
    memory.delete(key);
    return undefined;
  }
  return hit.value as T;
}

function memSet(key: string, value: unknown) {
  memory.set(key, { value, at: Date.now() });
}

function readBrowserStorage<T>(relativePath: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(storageKey(relativePath));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function getDbClient() {
  if (typeof window === 'undefined') {
    try {
      const { getSupabaseAdmin } = await import('@/lib/server/supabaseAdmin');
      return getSupabaseAdmin();
    } catch {
      return supabase;
    }
  }
  return supabase;
}

function writeBrowserStorage(relativePath: string, data: unknown): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(storageKey(relativePath), JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

async function readCampusKv<T>(relativePath: string): Promise<T | null> {
  if (!(await tableExists('campus_kv'))) return null;
  const client = await getDbClient();
  const { data, error } = await client
    .from('campus_kv')
    .select('value')
    .eq('key', relativePath)
    .maybeSingle();
  if (error || data?.value == null) return null;
  return (typeof data.value === 'string' ? JSON.parse(data.value) : data.value) as T;
}

async function writeCampusKv(relativePath: string, data: unknown): Promise<boolean> {
  if (!(await tableExists('campus_kv'))) return false;
  const client = await getDbClient();
  const { error } = await client.from('campus_kv').upsert({
    key: relativePath,
    value: data,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

function getScopedKey(relativePath: string, scope: 'shared' | 'personal', userId?: string): string {
  if (scope === 'personal' && userId) {
    return `${relativePath}::${userId}`;
  }
  return relativePath;
}

function getScopedFilePath(relativePath: string, scope: 'shared' | 'personal', userId?: string): string {
  if (scope === 'personal' && userId) {
    if (relativePath.endsWith('.json')) {
      return relativePath.replace(/\.json$/, `.${userId}.json`);
    }
    return `${relativePath}.${userId}`;
  }
  return relativePath;
}

export async function readLocalJson<T>(
  relativePath: string,
  fallback: T,
  scope: 'shared' | 'personal' = 'shared',
  userId?: string
): Promise<T> {
  const scopedKey = getScopedKey(relativePath, scope, userId);
  const cacheKey = `${scope}:${scopedKey}`;
  const cached = memGet<T>(cacheKey);
  if (cached !== undefined) return cached;

  const fs = nodeFs();
  const path = nodePath();
  if (fs && path) {
    try {
      const scopedPath = getScopedFilePath(relativePath, scope, userId);
      const full = path.join(process.cwd(), scopedPath);
      if (fs.existsSync(full)) {
        const parsed = JSON.parse(fs.readFileSync(full, 'utf-8')) as T;
        memSet(cacheKey, parsed);
        return parsed;
      }
    } catch (err) {
      console.error('Error reading local database file:', relativePath, err);
      return fallback;
    }
  }

  if (scope === 'shared') {
    try {
      const shared = await readCampusKv<T>(relativePath);
      if (shared != null) {
        memSet(cacheKey, shared);
        return shared;
      }
    } catch {
      // table missing or RLS
    }
  } else if (scope === 'personal') {
    try {
      const personal = await readCampusKv<T>(scopedKey);
      if (personal != null) {
        memSet(cacheKey, personal);
        return personal;
      }
    } catch {
      // table missing or RLS
    }
  }

  const local = readBrowserStorage(scopedKey, fallback);
  memSet(cacheKey, local);
  return local;
}

export type StorageTarget = 'db' | 'fs' | 'local' | 'none';

export interface StorageWriteResult {
  success: boolean;
  stored: StorageTarget;
  error?: string;
}

export async function writeLocalJson(
  relativePath: string,
  data: unknown,
  scope: 'shared' | 'personal' = 'shared',
  userId?: string
): Promise<StorageWriteResult> {
  const scopedKey = getScopedKey(relativePath, scope, userId);
  memSet(`${scope}:${scopedKey}`, data);

  let nodeWriteSucceeded = false;
  const fs = nodeFs();
  const path = nodePath();
  if (fs && path) {
    try {
      const scopedPath = getScopedFilePath(relativePath, scope, userId);
      const full = path.join(process.cwd(), scopedPath);
      const dir = path.dirname(full);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(full, JSON.stringify(data, null, 2), 'utf-8');
      nodeWriteSucceeded = true;
    } catch (err) {
      console.warn('Local filesystem write failed (serverless/read-only), falling back to database store:', relativePath, err);
    }
  }

  if (nodeWriteSucceeded && process.env.NODE_ENV === 'development') {
    return { success: true, stored: 'fs' };
  }

  if (scope === 'shared') {
    const wroteShared = await writeCampusKv(relativePath, data);
    if (wroteShared) return { success: true, stored: 'db' };
  } else if (scope === 'personal') {
    const wrotePersonal = await writeCampusKv(scopedKey, data);
    if (wrotePersonal) return { success: true, stored: 'db' };
  }

  if (typeof window !== 'undefined') {
    const wroteLocal = writeBrowserStorage(scopedKey, data);
    if (wroteLocal) return { success: true, stored: 'local' };
  }

  if (nodeWriteSucceeded) {
    return { success: true, stored: 'fs' };
  }

  return {
    success: false,
    stored: 'none',
    error: 'STORAGE_UNAVAILABLE: Filesystem is read-only, database table unavailable, and browser storage is unavailable.',
  };
}
