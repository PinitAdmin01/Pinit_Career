import { createClient } from '@supabase/supabase-js';

const supabaseUrl      = process.env.NEXT_PUBLIC_SUPABASE_URL      || '';
const supabaseAnonKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const msg = '[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Check your .env.local file.';
  if (isLocalhost) {
    console.warn(msg);
  } else {
    // In production, log clearly — all DB operations will fail
    console.error(msg);
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
);
