import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_ROLES = new Set(['admin', 'superadmin']);

export function getBearerToken(req: Request): string {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
  return '';
}

/** Verify Supabase JWT from Authorization header. Cookie-only auth is not accepted. */
export async function requireUserFromRequest(req: Request): Promise<
  | { user: { id: string; email?: string }; error: null }
  | { user: null; error: NextResponse }
> {
  const token = getBearerToken(req);
  if (!token) {
    console.warn('[Auth Middleware] Bearer token missing in request header');
    return {
      user: null,
      error: NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Bearer session token required.' },
        { status: 401 }
      ),
    };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !anon) {
    console.error('[Auth Middleware] Supabase environment variables missing');
    return {
      user: null,
      error: NextResponse.json(
        { error: 'MISCONFIGURED', message: 'Auth backend is not configured.' },
        { status: 503 }
      ),
    };
  }

  try {
    const supabase = createClient(url, anon, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user?.id) {
      console.warn('[Auth Middleware] Invalid or expired JWT token:', error?.message);
      return {
        user: null,
        error: NextResponse.json(
          { error: 'UNAUTHORIZED', message: 'Invalid or expired session.' },
          { status: 401 }
        ),
      };
    }
    console.log(`[Auth Middleware] Verified User: ${data.user.id}`);
    return { user: { id: data.user.id, email: data.user.email }, error: null };
  } catch (err: any) {
    console.error('[Auth Middleware Exception]:', err?.message);
    return {
      user: null,
      error: NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Session verification failed.' },
        { status: 401 }
      ),
    };
  }
}

export function getAuthoritativeSupabaseClient(userToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${userToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Admin gate: verified JWT + role from users table (not forgeable cookies). */
export async function requireAdminUserFromRequest(req: Request): Promise<
  | { user: { id: string; email?: string; role: string }; error: null }
  | { user: null; error: NextResponse }
> {
  const gated = await requireUserFromRequest(req);
  if (gated.error || !gated.user) return { user: null, error: gated.error! };

  const token = getBearerToken(req);

  try {
    const supabase = getAuthoritativeSupabaseClient(token);
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', gated.user.id)
      .maybeSingle();

    const role = String(profile?.role || '');
    if (!ADMIN_ROLES.has(role)) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'FORBIDDEN', message: 'Administrator access required.' },
          { status: 403 }
        ),
      };
    }
    return { user: { ...gated.user, role }, error: null };
  } catch {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'FORBIDDEN', message: 'Administrator access required.' },
        { status: 403 }
      ),
    };
  }
}

const PRIVILEGED_FACULTY_ROLES = new Set(['admin', 'superadmin', 'teacher', 'faculty']);

/** Faculty / Admin gate: verified JWT + authoritative role from users table. */
export async function requireFacultyOrAdminUserFromRequest(req: Request): Promise<
  | { user: { id: string; email?: string; role: string }; error: null }
  | { user: null; error: NextResponse }
> {
  const gated = await requireUserFromRequest(req);
  if (gated.error || !gated.user) return { user: null, error: gated.error! };

  const token = getBearerToken(req);

  try {
    const supabase = getAuthoritativeSupabaseClient(token);
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', gated.user.id)
      .maybeSingle();

    const role = String(profile?.role || '');
    if (!PRIVILEGED_FACULTY_ROLES.has(role)) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'FORBIDDEN', message: 'Faculty mentor or administrator authorization required.' },
          { status: 403 }
        ),
      };
    }
    return { user: { ...gated.user, role }, error: null };
  } catch {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'FORBIDDEN', message: 'Role authorization check failed.' },
        { status: 403 }
      ),
    };
  }
}

