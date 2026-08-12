import { supabase } from '@/lib/supabaseClient';

const cache = new Map<string, { ok: boolean; at: number }>();
const TTL_MS = 60_000;

/** Cached PostgREST probe so missing campus tables do not 404 on every click. */
export async function tableExists(tableName: string): Promise<boolean> {
  const hit = cache.get(tableName);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.ok;
  try {
    const { error } = await supabase.from(tableName).select('count', { count: 'exact', head: true });
    const ok = !error;
    cache.set(tableName, { ok, at: Date.now() });
    return ok;
  } catch {
    cache.set(tableName, { ok: false, at: Date.now() });
    return false;
  }
}

export function invalidateTableCache(tableName?: string) {
  if (tableName) cache.delete(tableName);
  else cache.clear();
}
