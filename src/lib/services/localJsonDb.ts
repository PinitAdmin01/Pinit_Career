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
    return eval('require')('fs') as typeof import('fs');
  } catch {
    return null;
  }
}

function nodePath(): typeof import('path') | null {
  if (typeof window !== 'undefined') return null;
  try {
    return eval('require')('path') as typeof import('path');
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

function writeBrowserStorage(relativePath: string, data: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(relativePath), JSON.stringify(data));
  } catch {
    // quota / private mode
  }
}

async function readCampusKv<T>(relativePath: string): Promise<T | null> {
  if (!(await tableExists('campus_kv'))) return null;
  const { data, error } = await supabase
    .from('campus_kv')
    .select('value')
    .eq('key', relativePath)
    .maybeSingle();
  if (error || data?.value == null) return null;
  return (typeof data.value === 'string' ? JSON.parse(data.value) : data.value) as T;
}

async function writeCampusKv(relativePath: string, data: unknown): Promise<boolean> {
  if (!(await tableExists('campus_kv'))) return false;
  const { error } = await supabase.from('campus_kv').upsert({
    key: relativePath,
    value: data,
    updated_at: new Date().toISOString(),
  });
  return !error;
}

async function readVaultJson<T>(relativePath: string): Promise<T | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('vault_items')
      .select('description')
      .eq('user_id', user.id)
      .eq('item_type', 'campus_kv')
      .eq('title', campusTitle(relativePath))
      .maybeSingle();
    if (error || !data?.description) return null;
    return JSON.parse(data.description) as T;
  } catch {
    return null;
  }
}

async function writeVaultJson(relativePath: string, data: unknown): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const title = campusTitle(relativePath);
    const description = JSON.stringify(data);
    const { data: existing } = await supabase
      .from('vault_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_type', 'campus_kv')
      .eq('title', title)
      .maybeSingle();
    if (existing?.id) {
      const { error } = await supabase.from('vault_items').update({ description }).eq('id', existing.id);
      return !error;
    }
    const { error } = await supabase.from('vault_items').insert({
      user_id: user.id,
      title,
      item_type: 'campus_kv',
      description,
      organization_name: 'campus',
    });
    return !error;
  } catch {
    return false;
  }
}

export async function readLocalJson<T>(
  relativePath: string,
  fallback: T,
  scope: 'shared' | 'personal' = 'shared'
): Promise<T> {
  const cacheKey = `${scope}:${relativePath}`;
  const cached = memGet<T>(cacheKey);
  if (cached !== undefined) return cached;

  const fs = nodeFs();
  const path = nodePath();
  if (fs && path) {
    try {
      const full = path.join(process.cwd(), relativePath);
      if (!fs.existsSync(full)) return fallback;
      const parsed = JSON.parse(fs.readFileSync(full, 'utf-8')) as T;
      memSet(cacheKey, parsed);
      return parsed;
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
  }

  const vault = await readVaultJson<T>(relativePath);
  if (vault != null) {
    memSet(cacheKey, vault);
    return vault;
  }

  const local = readBrowserStorage(relativePath, fallback);
  memSet(cacheKey, local);
  return local;
}

export async function writeLocalJson(
  relativePath: string,
  data: unknown,
  scope: 'shared' | 'personal' = 'shared'
): Promise<void> {
  memSet(`${scope}:${relativePath}`, data);

  const fs = nodeFs();
  const path = nodePath();
  if (fs && path) {
    try {
      const full = path.join(process.cwd(), relativePath);
      fs.writeFileSync(full, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing local database file:', relativePath, err);
    }
    return;
  }

  if (scope === 'shared') {
    const wroteShared = await writeCampusKv(relativePath, data);
    if (wroteShared) return;
  }

  const wroteVault = await writeVaultJson(relativePath, data);
  if (wroteVault) return;

  writeBrowserStorage(relativePath, data);
}
