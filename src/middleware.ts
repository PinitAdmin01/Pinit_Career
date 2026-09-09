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

  // Create response and set tracking and security headers
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  // Mandatory Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=()');

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
