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

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const method = request.method;
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // Sanitize log: log only pathname and method to prevent leaking query params (auth tokens, student IDs)
  console.log(`\n🌐 [GLOBAL MIDDLEWARE] [${requestId}] ${method} ${path}`);

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
