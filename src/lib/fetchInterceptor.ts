// Adds the signed-in user's Supabase or Vault session token to same-origin fetch('/api/*') calls that carry none.
import { supabase, isSupabaseConfigured } from './supabaseClient';

let installed = false;
let cachedToken: string = '';
let tokenCachedAt: number = 0;
const TOKEN_CACHE_TTL = 10_000;

if (typeof window !== 'undefined' && isSupabaseConfigured()) {
  try {
    supabase.auth.onAuthStateChange((_event, session) => {
      cachedToken = session?.access_token ?? '';
      tokenCachedAt = Date.now();
    });
  } catch {}
}

export function clearCachedAccessToken() {
  cachedToken = '';
  tokenCachedAt = 0;
}

function isSameOriginApi(input: RequestInfo | URL): boolean {
  try {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(raw, window.location.origin);
    return url.origin === window.location.origin && url.pathname.startsWith('/api/');
  } catch {
    return false;
  }
}

async function currentAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && (now - tokenCachedAt < TOKEN_CACHE_TTL)) {
    return cachedToken;
  }
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        cachedToken = data.session.access_token;
        tokenCachedAt = now;
        return cachedToken;
      }
    } catch {}
  }
  if (typeof window !== 'undefined') {
    try {
      const vaultJwt = localStorage.getItem('pinit_vault_jwt') || '';
      if (vaultJwt) {
        cachedToken = vaultJwt;
        tokenCachedAt = now;
        return vaultJwt;
      }
    } catch {}
  }
  return '';
}

export function installFetchInterceptor() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (!isSameOriginApi(input)) return originalFetch(input, init);

    const isRequest = typeof Request !== 'undefined' && input instanceof Request;
    const headers = new Headers(init?.headers ?? (isRequest ? (input as Request).headers : undefined));
    if (headers.has('Authorization')) return originalFetch(input, init);

    const token = await currentAccessToken();
    if (!token) return originalFetch(input, init);

    headers.set('Authorization', `Bearer ${token}`);
    return originalFetch(input, { ...init, headers });
  };
}
