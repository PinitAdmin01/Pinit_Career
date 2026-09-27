'use client';
import { useEffect } from 'react';
import { installFetchInterceptor } from '@/lib/fetchInterceptor';

// Install as soon as this module loads in the browser, before any component effect can fetch.
// The effect is a no-op fallback (installFetchInterceptor is idempotent).
if (typeof window !== 'undefined') installFetchInterceptor();

export default function FetchInterceptorInstaller() {
  useEffect(() => { installFetchInterceptor(); }, []);
  return null;
}
