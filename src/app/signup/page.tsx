'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ username: '', displayName: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.displayName || !form.password) {
      setError('Please fill out all credentials.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Signup always creates a student account (server/AuthContext enforce this).
      await signup({
        username: form.username,
        displayName: form.displayName,
        password: form.password,
        role: 'student',
      });
      router.push('/onboarding');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in">
        <div className="auth-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <span className="lp-brand-lockup" style={{ height: 56, padding: '4px 10px' }}>
              <img src="/brand/pinit-career-logo.png" alt="PINIT CAREER" className="lp-brand-logo" style={{ height: 48, maxWidth: 200 }} />
            </span>
          </div>
          <div className="auth-sub">Create your student account</div>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(239,68,68,0.1)',
              color: '#b91c1c',
              fontSize: 13,
              fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--t2)' }}>
            Email / Username
            <input
              className="form-input"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="you@college.edu"
              autoComplete="username"
              required
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--t2)' }}>
            Display name
            <input
              className="form-input"
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--t2)' }}>
            Password
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              required
            />
          </label>

          <p style={{ margin: 0, fontSize: 12, color: 'var(--t3)', lineHeight: 1.5 }}>
            New accounts are registered as <strong>students</strong>. Staff and recruiter access is granted by an administrator — it cannot be self-selected at signup.
          </p>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Creating account…' : 'Create student account'}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13, color: 'var(--t3)' }}>
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
