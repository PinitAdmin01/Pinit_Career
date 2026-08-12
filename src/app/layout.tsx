// apps/web/src/app/layout.tsx
// Self-hosted fonts via next/font/google — zero external DNS, no FOUT.

import { Suspense } from 'react';
import '../styles/globals.css';
import '../styles/portal-pages.css';
import type { Metadata, Viewport } from 'next';
import Script                            from 'next/script';
import { AuthProvider }                  from '@/lib/context/AuthContext';
import { CareerOSProvider }              from '@/lib/context/CareerOSContext';
import AppShell                          from '@/components/ui/AppShell';
import ToastManager                      from '@/components/ui/ToastManager';
import { QueryProvider }                 from '@/lib/query/client';
import FetchInterceptorInstaller         from '@/components/ui/FetchInterceptorInstaller';
import { BatchProvider }                 from '@/lib/context/BatchContext';

export const metadata: Metadata = {
  title:       { default: 'PinIT Career OS', template: '%s · PinIT' },
  description: 'AI-powered career intelligence. Build your Career DNA, ace ATS, complete missions, and get hired faster.',
  keywords:    ['career','AI resume','ATS score','career DNA','job matching','interview prep'],
  openGraph:   { type:'website', siteName:'PinIT Career OS', title:'PinIT — The AI Career Operating System' },
  twitter:     { card:'summary_large_image', title:'PinIT — The AI Career Operating System' },
};
export const viewport: Viewport = { width:'device-width', initialScale:1, themeColor:'#4f46e5' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%234f46e5'/><text y='.9em' font-size='60' x='15' fill='white' font-family='sans-serif' font-weight='800'>Pi</text></svg>" />
      </head>
      <body>
        <FetchInterceptorInstaller />
        <QueryProvider>
          <AuthProvider>
            <CareerOSProvider>
              <BatchProvider>
                <Suspense fallback={null}>
                  <AppShell>{children}</AppShell>
                </Suspense>
                <ToastManager />
              </BatchProvider>
            </CareerOSProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
