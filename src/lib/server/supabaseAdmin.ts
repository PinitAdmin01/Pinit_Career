import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedAdmin: SupabaseClient | null = null;
let mockAdmin: SupabaseClient | null = null;

export function setSupabaseAdminForTests(client: any): void {
  mockAdmin = client;
}

/**
 * Authoritative server Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * Bypasses RLS to allow server-authoritative reads and writes.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (mockAdmin) return mockAdmin;
  if (cachedAdmin) return cachedAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-service-key';

  cachedAdmin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedAdmin;
}

/**
 * User-scoped server Supabase client that forwards the caller's JWT token.
 * Respects RLS policies matching the authenticated caller.
 */
export function getSupabaseUserClient(token?: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !anonKey) {
    throw new Error('[SupabaseUserClient] Supabase URL or Anon key missing.');
  }

  return createClient(url, anonKey, {
    global: token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
