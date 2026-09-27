// Adds the signed-in user's Supabase token to same-origin fetch('/api/*') calls that carry none.
//
// API routes accept only `Authorization: Bearer <token>` (requireUserFromRequest: "Cookie-only
// auth is not accepted"). Until 2026-09-18 this interceptor rerouted every plain /api/* fetch
// through the api client, which adds the token. When that rerouting was removed, the ~100 plain
// fetch('/api/…') calls in the app (quest completion, interview, TTS, friends, code runners, …)
// started reaching the routes without a token and failing with 401.
//
// This version only adds the header. It never reroutes, never changes the method, body or
// response (streams keep streaming), and leaves alone requests that already have an
// Authorization header, other origins (Supabase, CDNs) and non-API paths.
import { supabase } from './supabaseClient';

let installed = false;

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
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? '';
  } catch {
    return '';
  }
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
