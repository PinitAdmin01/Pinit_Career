'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import FaceAnalyzer from '@/components/auth/FaceAnalyzer';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [authMode, setAuthMode] = useState<'password' | 'face'>('password');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  function handleFaceLoginSuccess(userObj: any) {
    const role = userObj?.role || 'student';
    if (role === 'parent') router.push('/parent');
    else if (role === 'consultant') router.push('/consultant');
    else if (role === 'teacher') router.push('/admin/teacher');
    else if (role === 'recruiter') router.push('/recruiter');
    else if (role === 'admin' || role === 'superadmin') router.push('/admin');
    else router.push('/dashboard');
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username/email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userObj = await login(username, password);
      handleFaceLoginSuccess(userObj);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg1, #030712)',
      color: 'var(--t1, #f9fafb)',
      padding: '24px'
    }}>
      <div className="auth-card animate-fade-in" style={{
        maxWidth: 440,
        width: '100%',
        background: 'var(--bg2, #0b0f19)',
        border: '1px solid var(--border, #1f2937)',
        borderRadius: 24,
        padding: 32,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Brand Logo */}
        <div className="auth-logo" style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, var(--accent, #4f46e5) 0%, var(--purple, #7c3aed) 100%)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 800,
              color: 'white',
              boxShadow: '0 6px 16px rgba(79,70,229,0.3)',
            }}>Pi</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--t1, #fff)', letterSpacing: '-0.5px' }}>
              PinIT Career OS
            </span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 4px', color: 'var(--t1)' }}>Welcome Back</h2>
          <p style={{ fontSize: 13, color: 'var(--t3, #9ca3af)', margin: 0 }}>Sign in to continue your career journey</p>
        </div>

        {/* Tabbed Auth Selector */}
        <div style={{
          display: 'flex',
          background: 'var(--bg3, #111827)',
          padding: 4,
          borderRadius: 14,
          marginBottom: 20,
          border: '1px solid var(--border, #1f2937)'
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('password')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: authMode === 'password' ? 'var(--accent, #4f46e5)' : 'transparent',
              color: authMode === 'password' ? '#fff' : 'var(--t3, #9ca3af)',
              transition: 'all 0.2s ease'
            }}
          >
            🔑 Password Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('face')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: authMode === 'face' ? 'var(--accent, #4f46e5)' : 'transparent',
              color: authMode === 'face' ? '#fff' : 'var(--t3, #9ca3af)',
              transition: 'all 0.2s ease'
            }}
          >
            📸 Face AI Login
          </button>
        </div>

        {/* Auth Forms */}
        {authMode === 'password' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--t2)' }}>
                Username or Email
              </label>
              <input 
                className="form-input" 
                placeholder="e.g. student@pinit.in" 
                value={username}
                onChange={e => setUsername(e.target.value)} 
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'var(--bg3, #111827)',
                  border: '1px solid var(--border, #374151)',
                  color: 'var(--t1, #fff)',
                  fontSize: 13.5
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>
                  Password
                </label>
                <Link href="/reset-password" style={{ fontSize: 11.5, color: 'var(--accent, #6366f1)', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </div>
              <input 
                className="form-input" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)} 
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'var(--bg3, #111827)',
                  border: '1px solid var(--border, #374151)',
                  color: 'var(--t1, #fff)',
                  fontSize: 13.5
                }}
              />
            </div>

            {error && (
              <div className="alert alert-danger" style={{
                marginBottom: 16,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: 12.5
              }}>
                ⚠️ {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                transition: 'transform 0.15s ease'
              }}
              disabled={loading}
            >
              {loading ? '⏳ Signing In...' : 'Sign In →'}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', marginBottom: 14 }}>
              <label className="form-label" style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--t2)' }}>
                Target Username or Email (Optional)
              </label>
              <input 
                className="form-input" 
                placeholder="student@pinit.in" 
                value={username}
                onChange={e => setUsername(e.target.value)} 
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: 'var(--bg3, #111827)',
                  border: '1px solid var(--border, #374151)',
                  color: 'var(--t1, #fff)',
                  fontSize: 13
                }}
              />
            </div>

            <FaceAnalyzer
              mode="login"
              username={username || 'student@pinit.in'}
              onSuccess={handleFaceLoginSuccess}
            />
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--t3)', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--accent, #6366f1)', fontWeight: 600, textDecoration: 'none' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
