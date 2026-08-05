import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes — require explicit 'admin' role cookie
  if (pathname.startsWith('/admin')) {
    const roleCookie = request.cookies.get('pinit_role')?.value;

    if (!roleCookie || !['admin', 'superadmin', 'teacher'].includes(roleCookie)) {
      // Redirect unauthenticated or non-admin users to the dashboard
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

// Config to target only /admin routes for efficiency
export const config = {
  matcher: ['/admin/:path*'],
};
