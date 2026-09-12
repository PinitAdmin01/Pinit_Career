/** Demo / Dev Mode auth is strictly disabled in production. */
export function isDemoAuthEnabled(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === 'true'
  );
}

export const DEMO_PASSWORD = '111111';
export const DEMO_PASSWORDS = ['111111', 'password123'];

export function isDemoPassword(password: string): boolean {
  return DEMO_PASSWORDS.includes(password);
}

export const DEMO_ROLE_BY_EMAIL: Record<string, string> = {
  'admin@pinit.in': 'admin',
  'teacher@pinit.in': 'teacher',
  'rec@pinit.in': 'recruiter',
  'con@pinit.in': 'consultant',
  'parent@pinit.in': 'parent',
  'student@pinit.in': 'student',
};
