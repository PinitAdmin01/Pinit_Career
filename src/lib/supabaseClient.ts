import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl      = process.env.NEXT_PUBLIC_SUPABASE_URL      || '';
const supabaseAnonKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('127.0.0.1') &&
    !supabaseUrl.includes('localhost') &&
    supabaseUrl.startsWith('http')
  );
}

/**
 * High-performance offline proxy: when Supabase environment variables are missing
 * (such as in local preview or standalone demo deployments), immediately resolves
 * queries with a safe offline result without initiating failed HTTP connections to
 * 127.0.0.1 that produce net::ERR_CONNECTION_REFUSED and delay UI rendering.
 */
function createOfflineSupabaseProxy(): any {
  const chainHandler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'then') {
        return (resolve: (val: any) => void) =>
          resolve({ data: null, error: { message: 'Offline mode: Supabase is not configured' } });
      }
      if (prop === 'catch') {
        return () => Promise.resolve({ data: null, error: { message: 'Offline mode: Supabase is not configured' } });
      }
      return (..._args: any[]) => new Proxy(() => {}, chainHandler);
    },
    apply() {
      return new Proxy(() => {}, chainHandler);
    }
  };

  return new Proxy({}, {
    get(_target, prop) {
      if (prop === 'auth') {
        return {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        };
      }
      if (prop === 'channel') {
        return () => ({
          on: function() { return this; },
          subscribe: () => ({ unsubscribe: () => {} }),
        });
      }
      return (..._args: any[]) => new Proxy(() => {}, chainHandler);
    }
  });
}

export const supabase: SupabaseClient = (isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createOfflineSupabaseProxy()) as SupabaseClient;
