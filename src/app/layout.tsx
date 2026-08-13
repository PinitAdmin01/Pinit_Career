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
  title:       { default: 'PINIT CAREER', template: '%s · PINIT CAREER' },
  description: "We don't help students find jobs. We help them discover who they are. AI-powered career intelligence for students, universities, and recruiters.",
  keywords:    ['career identity','AI mentor','career OS','student employability','verified talent'],
  openGraph:   { type:'website', siteName:'PINIT CAREER', title:'PINIT CAREER — Discover · Connect · Grow' },
  twitter:     { card:'summary_large_image', title:'PINIT CAREER — Discover · Connect · Grow' },
  icons:       { icon: '/brand/pinit-career-logo.png' },
};
export const viewport: Viewport = { width:'device-width', initialScale:1, themeColor:'#000000' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" href="/brand/pinit-career-logo.png" />
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
