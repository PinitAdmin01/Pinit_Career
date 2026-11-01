/** Demo / Dev Mode auth is enabled on localhost, demo queries, vercel preview/prod, or via environment flag. */
export function isDemoAuthEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === 'true') return true;
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || '';
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isVercel = hostname.includes('vercel.app');
    const hasDemoParam = window.location.search.includes('demo=true') || window.location.search.includes('demo=1');
    const hasEvaluatorFlag = window.localStorage.getItem('pinit_demo_override') === 'true';
    if (isLocalhost || isVercel || hasDemoParam || hasEvaluatorFlag) return true;
  }
  return process.env.NODE_ENV !== 'production';
}

export const DEMO_ROLE_BY_EMAIL: Record<string, string> = {
  'admin@pinit.in': 'admin',
  'teacher@pinit.in': 'teacher',
  'rec@pinit.in': 'recruiter',
  'con@pinit.in': 'consultant',
  'parent@pinit.in': 'parent',
  'student@pinit.in': 'student',
};
