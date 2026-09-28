'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isOnboardingComplete, onboardingSignalsOf, readLocalOnboardingSignals } from '@/lib/onboarding/onboardingStatus';
import { useAuth } from '@/lib/context/AuthContext';
import { isDemoAuthEnabled } from '@/lib/demoAuth';

function getSafeRedirect(raw: string | null): string {
  if (!raw) return '/dashboard';
  try {
    // Relative path must strictly start with / and not //, /\, or \
    if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\') || raw.startsWith('\\')) {
      return '/dashboard';
    }
    // Validate that the URL resolves strictly to the same origin
    const parsed = new URL(raw, 'http://localhost');
    if (parsed.origin !== 'http://localhost') return '/dashboard';
    return parsed.pathname + parsed.search;
  } catch {
    return '/dashboard';
  }
}

function LoginContent() {
  const { user, login, loginWithVaultSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Primary Navigation Tab: 'vault' (QR) vs 'password' (Email/Password Login)
  // Default to 'password' so single-device mobile users and standard students have immediate access
  const initialMode = searchParams.get('mode') === 'vault' ? 'vault' : 'password';
  const [mainTab, setMainTab] = useState<'vault' | 'password'>(initialMode);

  // If query specifies mode=signup, direct cleanly to /signup
  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      router.replace('/signup');
    }
  }, [searchParams, router]);

  // Password Form State
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', role: 'student' });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessSplash, setIsSuccessSplash] = useState<boolean>(false);

  // 1. Session Check: If already authenticated, redirect to /onboarding for dev/new users or /dashboard
  useEffect(() => {
    if (user && !isSuccessSplash) {
      const onboardCompleted = isOnboardingComplete(onboardingSignalsOf(user), readLocalOnboardingSignals(user.id));

      const destination = getSafeRedirect(searchParams.get('redirect'));
      if (!onboardCompleted) {
        router.push('/onboarding');
      } else {
        router.push(destination);
      }
    }
  }, [user, isSuccessSplash, router, searchParams]);

  // Developer Mode Login
  const handleDevModeLogin = async () => {
    if (!isDemoAuthEnabled()) {
      setErrorMsg('Developer Mode is disabled in this environment.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const uniqueSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const devId = `usr_dev_${Date.now()}_${uniqueSuffix.toLowerCase()}`;
      const devUser = {
        id: devId,
        name: 'Vinay',
        email: `dev.${uniqueSuffix.toLowerCase()}@pinit.in`,
        role: 'student',
        identityStatus: 'Active',
        isDevUser: true
      };

      if (typeof window !== 'undefined') {
        localStorage.removeItem(`pinit_${devId}_onboarding_answers`);
        localStorage.removeItem(`pinit_${devId}_ob_step`);
        localStorage.removeItem(`pinit_${devId}_completed_quests`);
        localStorage.removeItem(`pinit_${devId}_completed_missions`);
        localStorage.setItem('pinit_current_user', JSON.stringify(devUser));
      }

      setIsSuccessSplash(true);
      setTimeout(() => {
        loginWithVaultSession({
          user: devUser,
          token: `jwt_dev_${Date.now()}`
        }, true).then(() => {
          router.replace('/onboarding');
        });
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Developer mode login failed');
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.identifier || !loginForm.password) {
      setErrorMsg('Please enter your email / username and password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const loggedInUser = await login(loginForm.identifier, loginForm.password);
      setIsSuccessSplash(true);

      const onboardCompleted = isOnboardingComplete(onboardingSignalsOf(loggedInUser), readLocalOnboardingSignals(loggedInUser?.id));

      const destination = getSafeRedirect(searchParams.get('redirect'));
      if (!onboardCompleted) {
        router.push('/onboarding');
      } else {
        router.push(destination);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // ── 1.0-Second Splash Screen Rendering ──────────────────────────────────
  if (isSuccessSplash) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary, #060813)',
        color: 'var(--text)',
        padding: 24
      }}>
        <div style={{
          maxWidth: 420,
          width: '100%',
          background: 'var(--bg-card, #0B0F1E)',
          border: '1px solid #10b981',
          borderRadius: 24,
          padding: 40,
          textAlign: 'center',
          boxShadow: '0 0 40px rgba(var(--success-rgb), 0.25)',
          animation: 'fadeInPop 0.3s ease-in-out'
        }}>
          <div style={{
            width: 64,
            height: 64,
            background: 'rgba(var(--success-rgb), 0.15)',
            color: 'var(--success)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 35,
            margin: '0 auto 20px',
            border: '2px solid #10b981'
          }}>✓</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
            Authentication Verified
          </h2>
          <p style={{ fontSize: 15.5, color: '#9ca3af', margin: 0 }}>
            Preparing your Sovereign Career Workspace...
          </p>
          <div style={{
            marginTop: 24,
            height: 4,
            background: '#1f2937',
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'var(--success)',
              width: '100%',
              transition: 'width 0.8s linear'
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary, #060813)',
      color: 'var(--text-primary, #f9fafb)',
      padding: '24px'
    }}>
      <div className="auth-card animate-fade-in" style={{
        maxWidth: 460,
        width: '100%',
        background: 'var(--bg-card, #0B0F1E)',
        border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
        borderRadius: 24,
        padding: 32,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}>
        
        {/* Brand Logo Header */}
        <div className="auth-logo" style={{ textAlign: 'center', marginBottom: 20 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
              <span className="lp-brand-lockup" style={{ height: 56, padding: '4px 10px' }}>
                <Image
                  src="/brand/pinit-career-logo.png"
                  alt="PINIT CAREER"
                  width={200}
                  height={48}
                  priority
                  className="lp-brand-logo"
                  style={{ height: 48, width: 'auto', maxWidth: 200, objectFit: 'contain' }}
                />
              </span>
            </div>
          </Link>
        </div>

        {/* 🔀 UNIFIED AUTH METHOD SWITCHER TABS */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-secondary, rgba(255,255,255,0.05))',
          padding: 4,
          borderRadius: 14,
          marginBottom: 20,
          border: '1px solid var(--border-color, rgba(255,255,255,0.1))'
        }}>
          <button
            type="button"
            onClick={() => { setMainTab('vault'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 750,
              border: 'none',
              cursor: 'pointer',
              background: mainTab === 'vault' ? 'var(--accent, #00A3FF)' : 'transparent',
              color: mainTab === 'vault' ? '#fff' : 'var(--text-secondary, #94A3B8)',
              transition: 'all 0.2s'
            }}
          >
            📱 PinIT Vault QR
          </button>
          <button
            type="button"
            onClick={() => { setMainTab('password'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 750,
              border: 'none',
              cursor: 'pointer',
              background: mainTab === 'password' ? 'var(--accent, #00A3FF)' : 'transparent',
              color: mainTab === 'password' ? '#fff' : 'var(--text-secondary, #94A3B8)',
              transition: 'all 0.2s'
            }}
          >
            🔑 Password Sign In
          </button>
          <Link
            href="/signup"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '9px 12px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 750,
              color: 'var(--text-secondary, #94A3B8)',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            📝 Sign Up →
          </Link>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div style={{
            background: 'rgba(var(--danger-rgb),  0.12)',
            border: '1px solid rgba(var(--danger-rgb),  0.35)',
            color: 'var(--danger-bright)',
            padding: '12px 16px',
            borderRadius: 14,
            fontSize: 14.5,
            marginBottom: 20
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 1: 📱 PINIT VAULT QR — COMING SOON                            */}
        {/* ================================================================= */}
        {mainTab === 'vault' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 21, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                PinIT Vault Login
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-tertiary)', margin: 0 }}>
                Secure cross-device QR authentication
              </p>
            </div>

            {/* Developer Mode Banner — gated, does not use QR flow */}
            {isDemoAuthEnabled() && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(var(--warning-rgb), 0.12) 0%, rgba(217, 119, 6, 0.12) 100%)',
                border: '1px solid rgba(var(--warning-rgb), 0.35)',
                borderRadius: 14,
                padding: '12px 14px',
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--warning-bright)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    ⚡ Developer Mode Enabled
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Skip Vault &amp; create a fresh unique user to test Onboarding.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDevModeLogin}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#000',
                    border: 'none',
                    padding: '7px 12px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(var(--warning-rgb), 0.3)'
                  }}
                >
                  {loading ? 'Creating...' : 'Test Onboarding'}
                </button>
              </div>
            )}

            {/* Coming Soon Panel */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: 20,
              padding: '32px 24px',
              textAlign: 'center',
              marginBottom: 18
            }}>
              <div style={{
                width: 64,
                height: 64,
                background: 'rgba(var(--accent-rgb, 0,163,255), 0.12)',
                border: '2px solid rgba(var(--accent-rgb, 0,163,255), 0.35)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 31,
                margin: '0 auto 16px'
              }}>📱</div>
              <div style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                PinIT Vault App Required
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                QR login requires the <strong>PinIT Vault</strong> mobile app to scan and approve the challenge on a second device.
                The app is not yet available — this feature is coming soon.
              </div>
              <button
                type="button"
                onClick={() => { setMainTab('password'); setErrorMsg(''); }}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 14.5,
                  fontWeight: 750,
                  cursor: 'pointer'
                }}
              >
                🔑 Sign In With Password Instead
              </button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              paddingTop: 14,
              borderTop: '1px solid var(--border-color)',
              fontSize: 14,
              color: 'var(--text-tertiary)'
            }}>
              <div>
                <span>Don&apos;t have an account? </span>
                <Link href="/signup" style={{ color: 'var(--accent, #00A3FF)', fontWeight: 750, textDecoration: 'underline' }}>
                  Create Student Account (Sign Up) →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: 🔑 PASSWORD SIGN IN                                        */}
        {/* ================================================================= */}
        {mainTab === 'password' && (
          <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <h2 style={{ fontSize: 21, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                Sign In With Password
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-tertiary)', margin: 0 }}>
                Unified Portal for Students, Faculty & Recruiters
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Email / Roll Number / Username
              </label>
              <input
                type="text"
                placeholder="you@college.edu or 21CS001"
                value={loginForm.identifier}
                onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: 10,
                background: 'var(--accent)',
                color: 'var(--text)',
                border: 'none',
                fontSize: 15,
                fontWeight: 750,
                cursor: 'pointer',
                marginTop: 6,
                boxShadow: '0 4px 14px var(--accent-glow)'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>
        )}

        {/* 🧭 Universal Footer Switcher */}
        <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: 14, color: 'var(--text-tertiary)' }}>
          {mainTab === 'vault' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span>
                Prefer password login?{' '}
                <button
                  type="button"
                  onClick={() => { setMainTab('password'); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Sign In With Password
                </button>
              </span>
              <span>•</span>
              <Link href="/signup" style={{ color: 'var(--accent)', fontWeight: 750, textDecoration: 'none' }}>
                Don&apos;t have an account? Sign Up →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span>
                Prefer QR login?{' '}
                <button
                  type="button"
                  onClick={() => { setMainTab('vault'); setErrorMsg(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  PinIT Vault QR
                </button>
              </span>
              <span>•</span>
              <Link href="/signup" style={{ color: 'var(--accent)', fontWeight: 750, textDecoration: 'none' }}>
                Don&apos;t have an account? Sign Up →
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-primary, #060813)' }} />}>
      <LoginContent />
    </Suspense>
  );
}
