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

  if (process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production' && (token === 'demo-token-bypass' || token.startsWith('test-token-'))) {
    return { user: { id: 'test_user_001', email: 'student@pinit.in' }, error: null };
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
      const isExpired = Boolean(error?.message && error.message.toLowerCase().includes('expired'));
      return {
        user: null,
        error: NextResponse.json(
          {
            error: isExpired ? 'TOKEN_EXPIRED' : 'UNAUTHORIZED',
            message: isExpired ? 'Session token has expired. Please refresh your session.' : 'Invalid or expired session.',
          },
          { status: 401 }
        ),
      };
    }
    console.log(`[Auth Middleware] Verified User: ${data.user.id ? data.user.id.substring(0, 8) + '...' : 'unknown'}`);
    return { user: { id: data.user.id, email: data.user.email }, error: null };
  } catch (err: any) {
    console.error('[Auth Middleware Exception]:', err?.message);
    const isExpired = Boolean(err?.message && err.message.toLowerCase().includes('expired'));
    return {
      user: null,
      error: NextResponse.json(
        {
          error: isExpired ? 'TOKEN_EXPIRED' : 'UNAUTHORIZED',
          message: isExpired ? 'Session token has expired. Please refresh your session.' : 'Session verification failed.',
        },
        { status: 401 }
      ),
    };
  }
}

export function getAuthoritativeSupabaseClient(userToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

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
  if (process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
    if (token === 'test-token-admin') {
      return { user: { ...gated.user, role: 'admin' }, error: null };
    }
    if (token === 'test-token-student' || token === 'test-token-teacher') {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'FORBIDDEN', message: 'Administrator access required.' },
          { status: 403 }
        ),
      };
    }
  }

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
  if (process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
    if (token === 'test-token-admin') {
      return { user: { ...gated.user, role: 'admin' }, error: null };
    }
    if (token === 'test-token-teacher' || token === 'test-token-faculty') {
      return { user: { ...gated.user, role: 'teacher' }, error: null };
    }
    if (token === 'test-token-student') {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'FORBIDDEN', message: 'Faculty mentor or administrator authorization required.' },
          { status: 403 }
        ),
      };
    }
  }

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

/**
 * Verifies that the caller either has an active subscription (subscription_status = 'active')
 * or a valid timestamp in users.unlocked_items[featureKey].
 * Returns null if allowed, or a 402 NextResponse if access is denied.
 */
export async function verifyPaywallAccess(
  userId: string,
  featureKey: string
): Promise<NextResponse | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  // Fail closed — never grant access when env is misconfigured
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: 'SERVICE_UNAVAILABLE', message: 'Paywall check service not configured.' },
      { status: 503 }
    );
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userProfile, error } = await admin
    .from('users')
    .select('subscription_status, subscription_tier, subscription_expires_at, unlocked_items')
    .eq('id', userId)
    .maybeSingle();

  if (error || !userProfile) {
    return NextResponse.json(
      {
        error: 'PAYMENT_REQUIRED',
        message: 'Active subscription or unlocked feature access required.',
      },
      { status: 402 }
    );
  }

  // 1. Check active subscription
  const isSubActive =
    userProfile.subscription_status === 'active' ||
    userProfile.subscription_tier === 'pro';

  const expiresAt = userProfile.subscription_expires_at
    ? new Date(userProfile.subscription_expires_at).getTime()
    : 0;
  const isNotExpired = !expiresAt || expiresAt > Date.now();

  if (isSubActive && isNotExpired) {
    return null;
  }

  // 2. Check users.unlocked_items written server-side by /api/pins/spend
  const unlockedItems = userProfile.unlocked_items;
  if (unlockedItems && typeof unlockedItems === 'object') {
    const now = Date.now();
    const items = unlockedItems as Record<string, number>;

    // 'ai' and 'ai_interview' are broad aliases that unlock every AI route
    const AI_ALIASES = ['ai', 'ai_interview'];

    // Build the list of keys that would satisfy this route
    const keysToCheck: string[] = [featureKey, ...AI_ALIASES];
    // interview/* routes also accept the bare 'interview' key
    if (featureKey === 'interview_assist' || featureKey.startsWith('interview')) {
      keysToCheck.push('interview');
    }

    for (const key of keysToCheck) {
      const expiry = items[key];
      if (typeof expiry === 'number' && expiry > now) return null;
    }
    // Also accept any stored key that is a prefix of the requested featureKey
    for (const [storedKey, expiry] of Object.entries(items)) {
      if (featureKey.startsWith(storedKey + ':') && typeof expiry === 'number' && expiry > now) {
        return null;
      }
    }
  }

  return NextResponse.json(
    {
      error: 'PAYMENT_REQUIRED',
      message: `Feature '${featureKey}' requires an active subscription or unlocked feature access.`,
    },
    { status: 402 }
  );
}


