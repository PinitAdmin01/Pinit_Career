import { supabase } from '@/lib/supabaseClient';

/** Server JSON files, or the signed-in user's vault_items row on Firebase. */

const memory = new Map<string, unknown>();

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

async function readVaultJson<T>(relativePath: string, fallback: T): Promise<T> {
  if (memory.has(relativePath)) return memory.get(relativePath) as T;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      memory.set(relativePath, fallback);
      return fallback;
    }
    const { data, error } = await supabase
      .from('vault_items')
      .select('description')
      .eq('user_id', user.id)
      .eq('item_type', 'campus_kv')
      .eq('title', campusTitle(relativePath))
      .maybeSingle();
    if (!error && data?.description) {
      const parsed = JSON.parse(data.description) as T;
      memory.set(relativePath, parsed);
      return parsed;
    }
  } catch {
    // vault row missing or RLS blocked
  }
  memory.set(relativePath, fallback);
  return fallback;
}

async function writeVaultJson(relativePath: string, data: unknown): Promise<void> {
  memory.set(relativePath, data);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
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
      await supabase.from('vault_items').update({ description }).eq('id', existing.id);
    } else {
      await supabase.from('vault_items').insert({
        user_id: user.id,
        title,
        item_type: 'campus_kv',
        description,
        organization_name: 'campus',
      });
    }
  } catch {
    // persist in memory for this session
  }
}

export async function readLocalJson<T>(relativePath: string, fallback: T): Promise<T> {
  const fs = nodeFs();
  const path = nodePath();
  if (fs && path) {
    try {
      const full = path.join(process.cwd(), relativePath);
      if (!fs.existsSync(full)) return fallback;
      return JSON.parse(fs.readFileSync(full, 'utf-8')) as T;
    } catch (err) {
      console.error('Error reading local database file:', relativePath, err);
      return fallback;
    }
  }
  return readVaultJson(relativePath, fallback);
}

export async function writeLocalJson(relativePath: string, data: unknown): Promise<void> {
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
  await writeVaultJson(relativePath, data);
}
