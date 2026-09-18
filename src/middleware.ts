// dark-gracity/csp_fix/middleware.ts
// ─────────────────────────────────────────────────────────────────────
// PROPOSED FIX: Razorpay CSP Policy Update
// ─────────────────────────────────────────────────────────────────────
//
// Problem:
//   Razorpay checkout fails to connect to 'https://lumberjack.razorpay.com'
//   because the Content-Security-Policy (CSP) connect-src directive was
//   missing the required Razorpay origins.
//
// Changes applied to the CSP connect-src directive:
//   - Added: https://*.razorpay.com  (wildcard for all razorpay subdomains)
//   - Added: https://lumberjack.razorpay.com  (explicit checkout endpoint)
//   - Kept:   https://api.razorpay.com  (existing API endpoint)
//
// Changes applied to script-src:
//   - Added: https://*.razorpay.com  (allows scripts from any razorpay host)
//   - Kept:  https://checkout.razorpay.com  (existing checkout script)
//
// Changes applied to frame-src:
//   - Added: https://checkout.razorpay.com  (Razorpay checkout iframe)
//   - Added: https://*.razorpay.com  (wildcard for all razorpay subdomains)
//   - Kept:  https://api.razorpay.com
//
// This file applies the updated CSP headers to every response, mirroring
// the pattern previously used before headers were moved to next.config.js.
// ─────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Updated Content-Security-Policy ──────────────────────────────────
// Every origin the browser is allowed to call is listed here.
// Anything missing here fails before the request leaves the page,
// with no network error to debug.
const CSP = [
  "default-src 'self'",

  // scripts: allow inline + wasm + eval + Supabase + ALL Razorpay hosts
  // (added https://*.razorpay.com alongside the existing checkout.razorpay.com)
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' 'unsafe-eval' https://*.supabase.co https://checkout.razorpay.com https://*.razorpay.com",

  // styles + fonts (unchanged)
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",

  // images (unchanged)
  "img-src 'self' data: blob: https://*.supabase.co https://api.dicebear.com https://avatars.githubusercontent.com https://images.unsplash.com",

  // media: blob: for Three.js textures + Supabase + voice service (unchanged)
  "media-src 'self' blob: data: https://*.supabase.co https://pinit-voice-service.onrender.com",

  // workers: blob: URLs for AudioWorklet + TTS worker (unchanged)
  "worker-src 'self' blob:",

  // ── UPDATED connect-src ──────────────────────────────────────────
  // Added: https://*.razorpay.com (wildcard for all razorpay subdomains)
  // Added: https://lumberjack.razorpay.com (explicit checkout endpoint)
  // Kept:  https://api.razorpay.com (existing API endpoint)
  [
    "connect-src 'self'",
    'blob:',
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://api.razorpay.com',
    'https://lumberjack.razorpay.com',
    'https://*.razorpay.com',
    'https://pinit-voice-service.onrender.com',
    'https://pinit-backend-v8pd.onrender.com',
    'https://api.github.com',
  ].join(' '),

  // ── UPDATED frame-src ──────────────────────────────────────────
  // Added: https://checkout.razorpay.com (Razorpay checkout iframe)
  // Added: https://*.razorpay.com (wildcard for all razorpay subdomains)
  // Kept:  https://api.razorpay.com
  "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com",

  // remaining directives (unchanged)
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ') + ';';

// ── Security Headers ─────────────────────────────────────────────────
const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=(), browsing-topics=()' },
  { key: 'Content-Security-Policy', value: CSP },
];

// ── Middleware Handler ────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const method = request.method;
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // Sanitize log: log only pathname and method to prevent leaking query params (auth tokens, student IDs)
  console.log(`\n🌐 [CSP-FIX MIDDLEWARE] [${requestId}] ${method} ${path}`);

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
        isVerified = false;
        console.error('[SECURITY] SUPABASE_JWT_SECRET not set. Blocking access to protected route.');
      } else {
        try {
          const { jwtVerify } = await import('jose');
          const secretKey = new TextEncoder().encode(jwtSecret);
          await jwtVerify(token, secretKey, { algorithms: ['HS256'] });
          isVerified = true;
        } catch {
          isVerified = false;
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

  // Create response and set the request correlation id + security headers
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  // Apply updated CSP and security headers to every response
  for (const { key, value } of SECURITY_HEADERS) {
    response.headers.set(key, value);
  }

  // Measure timing on response
  const durationMs = Date.now() - startTime;
  console.log(`⏱️ [CSP-FIX MIDDLEWARE] [${requestId}] ${method} ${path} processed in ${durationMs}ms`);

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
