// apps/web/src/app/layout.tsx
// Self-hosted fonts via next/font/google — zero external DNS, no FOUT.

import { Suspense } from 'react';
import '../styles/globals.css';
import '../styles/portal-pages.css';
import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from 'next/font/google';
import Script                            from 'next/script';
import { AuthProvider }                  from '@/lib/context/AuthContext';
import { CareerOSProvider }              from '@/lib/context/CareerOSContext';
import AppShell                          from '@/components/ui/AppShell';
import ToastManager                      from '@/components/ui/ToastManager';
import { QueryProvider }                 from '@/lib/query/client';
import FetchInterceptorInstaller         from '@/components/ui/FetchInterceptorInstaller';
import { BatchProvider }                 from '@/lib/context/BatchContext';

// ── Self-hosted Google Fonts (no external DNS, no FOUT) ───────────────────────
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

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
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      className={`${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
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
