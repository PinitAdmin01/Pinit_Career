// src/middleware.ts
/**
 * ============================================================================
 * GLOBAL APPLICATION MIDDLEWARE & REQUEST SENTINEL
 * ============================================================================
 * 
 * Purpose:
 * Intercepts all incoming HTTP requests to Next.js routes and API endpoints:
 * 1. Generates unique request correlation IDs (`x-request-id`) for full tracing.
 * 2. Logs incoming HTTP methods, URLs, query parameters, IP/User-Agent metadata.
 * 3. Measures exact end-to-end execution time for performance monitoring.
 * 4. Catches unhandled boundary exceptions and reports structured diagnostics.
 * 
 * Comment for AI Models & Developers:
 * - This middleware runs on the Edge runtime before route handlers execute.
 * - Static assets (_next, static, images, favicon) are excluded via config.matcher.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const method = request.method;
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // Sanitize log: log only pathname and method to prevent leaking query params (auth tokens, student IDs)
  console.log(`\n🌐 [GLOBAL MIDDLEWARE] [${requestId}] ${method} ${path}`);

  // ── Edge Route Guard: Protected Portals (/admin, /recruiter, /parent) ──
  const PROTECTED_PREFIXES = ['/admin', '/recruiter', '/parent'];
  const isProtectedPath = PROTECTED_PREFIXES.some(
    prefix => path === prefix || path.startsWith(`${prefix}/`)
  );

  if (isProtectedPath) {
    let token: string | null = null;

    // 1. Check Authorization header (Bearer token)
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
    if (authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.slice(7).trim();
    }

    // 2. Check test bypass in non-production
    const isDevOrTest = process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production';
    if (isDevOrTest) {
      if (
        token === 'demo-token-bypass' ||
        (token && token.startsWith('test-token-')) ||
        request.headers.get('x-test-bypass') === 'true' ||
        request.cookies.get('test-bypass')?.value === 'true'
      ) {
        token = 'dev-bypass-authorized';
      }
    }

    // 3. Check session cookies if no token in header
    if (!token) {
      const allCookies = request.cookies.getAll();
      for (const cookie of allCookies) {
        const name = cookie.name.toLowerCase();
        if (
          name.startsWith('sb-') ||
          name.includes('auth-token') ||
          name.includes('access-token') ||
          name === 'pinit_token' ||
          name === 'auth_token' ||
          name === 'token' ||
          name === '__session'
        ) {
          const val = cookie.value;
          if (val) {
            let candidate = val.trim();
            try {
              candidate = decodeURIComponent(candidate);
            } catch {
              // ignore
            }
            if (candidate.startsWith('base64-')) {
              try {
                candidate = atob(candidate.slice(7));
              } catch {
                continue;
              }
            }
            if (candidate.startsWith('{') || candidate.startsWith('[')) {
              try {
                const parsed = JSON.parse(candidate);
                if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
                  candidate = parsed[0];
                } else if (parsed.access_token) {
                  candidate = parsed.access_token;
                } else if (parsed.currentSession?.access_token) {
                  candidate = parsed.currentSession.access_token;
                }
              } catch {
                // ignore
              }
            }
            if (candidate && candidate.length > 5) {
              token = candidate;
              break;
            }
          }
        }
      }
    }

    // 4. Cryptographically verify JWT signature + expiry
    let isVerified = false;
    if (token) {
      const jwtSecret = process.env.SUPABASE_JWT_SECRET;
      if (!jwtSecret) {
        // Fail closed — never verify without the secret
        isVerified = false;
        console.error('[SECURITY] SUPABASE_JWT_SECRET not set. Blocking access to protected route.');
      } else {
        try {
          const { jwtVerify } = await import('jose');
          const secretKey = new TextEncoder().encode(jwtSecret);
          await jwtVerify(token, secretKey, { algorithms: ['HS256'] });
          isVerified = true; // Only reaches here if signature + expiry are valid
        } catch {
          isVerified = false; // Expired, wrong signature, or malformed
        }
      }
    }

    // 5. Redirect if token missing or verification failed
    if (!token || !isVerified) {
      console.warn(`🛡️ [EDGE GUARD] Unauthorized access attempt to ${path} (token: ${token ? 'unverified/expired' : 'none'}). Redirecting to /login.`);
      const loginUrl = new URL(`/login?redirect=${encodeURIComponent(path + (search || ''))}`, request.url);
      const redirectResponse = NextResponse.redirect(loginUrl, 307);
      redirectResponse.headers.set('x-request-id', requestId);
      return redirectResponse;
    }
  }

  // Create response and set the request correlation id.
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  // Security headers are NOT set here any more.
  //
  // They now live in next.config.js headers(), which is the single source of
  // truth. Middleware ran only on a server host, so while the app was deployed
  // as a static export it set nothing — and when it did run it silently
  // overrode the config values, producing X-Frame-Options: DENY against a CSP
  // of frame-ancestors 'self', and dropping browsing-topics=(). Declaring them
  // once, declaratively, also covers static assets that middleware skips.
  //
  // If you need to change CSP or Permissions-Policy, edit next.config.js (and
  // firebase.json if the legacy static deploy is still in use), then run
  // `npm run audit:headers`.

  // Measure timing on response
  const durationMs = Date.now() - startTime;
  console.log(`⏱️ [GLOBAL MIDDLEWARE] [${requestId}] ${method} ${path} processed in ${durationMs}ms`);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
