'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { isDemoAuthEnabled, DEMO_PASSWORD } from '@/lib/demoAuth';
import { QRCodeSVG } from 'qrcode.react';
import {
  identityGateway,
  AuthenticationMethod,
  VaultChallenge,
  ChallengeStatus,
  getDeviceName
} from '@/lib/services/identityGateway';

function LoginContent() {
  const { user, login, signup, loginWithVaultSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Primary Navigation Tab: 'vault' (QR) vs 'password' (Email/Password Login) vs 'signup' (Create Student Account)
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : searchParams.get('mode') === 'password' ? 'password' : 'vault';
  const [mainTab, setMainTab] = useState<'vault' | 'password' | 'signup'>(initialMode);

  // Vault QR & Trusted Device State
  const [isTrustedDevice, setIsTrustedDevice] = useState<boolean>(false);
  const [trustedDeviceName, setTrustedDeviceName] = useState<string>('');
  const [authMode, setAuthMode] = useState<'qr' | 'trusted' | 'face' | 'biometric'>('qr');
  const [challenge, setChallenge] = useState<VaultChallenge | null>(null);
  const [challengeStatus, setChallengeStatus] = useState<ChallengeStatus>('PENDING');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Password / Signup Form State
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', role: 'student' });
  const [signupForm, setSignupForm] = useState({ username: '', displayName: '', password: '' });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessSplash, setIsSuccessSplash] = useState<boolean>(false);

  // 1. Session Check: If already authenticated, redirect to /onboarding for dev/new users or /dashboard
  useEffect(() => {
    if (user && !isSuccessSplash) {
      // Check DB-sourced flag first — works across all devices.
      // localStorage is secondary fallback only (same device, already onboarded session).
      const dbSaysComplete = !!(user as any).roadmapGenerated;
      const localSaysComplete = typeof window !== 'undefined' &&
        !!localStorage.getItem(`pinit_${user.id}_onboarding_answers`);
      const onboardCompleted = dbSaysComplete || localSaysComplete;

      if (!onboardCompleted || (user as any).isDevUser) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isSuccessSplash, router]);

  // 2. Check Trusted Device Status on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const devName = getDeviceName();
      setTrustedDeviceName(devName);
      const devices = JSON.parse(localStorage.getItem('pinit_trusted_devices_db') || '[]');
      if (devices.length > 0) {
        setIsTrustedDevice(true);
        setAuthMode('trusted');
      }
    }
  }, []);

  // 3. Challenge Generation Callback
  const requestNewChallenge = useCallback(async () => {
    setErrorMsg('');
    setCurrentStep(1);
    setChallengeStatus('PENDING');
    setSecondsRemaining(60);
    try {
      const newCh = await identityGateway.generateLoginChallenge('careers', 'login');
      setChallenge(newCh);
      setCurrentStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate authentication QR code');
    }
  }, []);

  // Initialize Challenge when entering QR mode
  useEffect(() => {
    if (mainTab === 'vault' && authMode === 'qr' && !challenge && !user) {
      requestNewChallenge();
    }
  }, [mainTab, authMode, challenge, user, requestNewChallenge]);

  // 4. 60-Second Countdown Timer
  useEffect(() => {
    if (mainTab !== 'vault' || authMode !== 'qr' || !challenge || isSuccessSplash) return;
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          requestNewChallenge();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mainTab, authMode, challenge, isSuccessSplash, requestNewChallenge]);

  // 5. Subscribe to Status Stream
  useEffect(() => {
    if (mainTab !== 'vault' || !challenge || authMode !== 'qr' || isSuccessSplash) return;

    const unsubscribe = identityGateway.subscribeStatusStream(challenge.challengeId, async (status) => {
      setChallengeStatus(status);

      if (status === 'SCANNING') {
        setCurrentStep(2);
      } else if (status === 'EXPIRED') {
        setErrorMsg('QR Challenge expired. Generating a new QR code...');
        requestNewChallenge();
      } else if (status === 'REJECTED') {
        setErrorMsg('Authentication rejected by PinIT Vault.');
        requestNewChallenge();
      } else if (status === 'APPROVED') {
        setCurrentStep(3);
        try {
          const sessionData = await identityGateway.exchangeSession(
            challenge.challengeId,
            AuthenticationMethod.QR_SCAN
          );
          setCurrentStep(4);
          setIsSuccessSplash(true);

          setTimeout(() => {
            loginWithVaultSession(sessionData).then(() => {
              router.push('/dashboard');
            });
          }, 1000);
        } catch (err: any) {
          setErrorMsg(err.message || 'Session exchange failed');
          setCurrentStep(2);
        }
      }
    });

    return () => unsubscribe();
  }, [mainTab, challenge, authMode, isSuccessSplash, requestNewChallenge, loginWithVaultSession, router]);

  // Helper: Simulate Vault Mobile Scan & Approval for testing (Demo Mode Only)
  const handleSimulateVaultApproval = async () => {
    if (!isDemoAuthEnabled() || !challenge) return;
    setLoading(true);
    try {
      await identityGateway.approveChallengeFromVault(challenge.challengeId);
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trusted Device Authentication Handler
  const handleTrustedDeviceLogin = async (method: AuthenticationMethod) => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Trusted device / biometric auth requires server-side verification which is not yet implemented.
      // Do NOT log users in with a hardcoded mock identity — that is a security hole.
      // TODO: implement real device attestation via /api/v1/auth/trusted-device
      throw new Error('Trusted device login is not yet available. Please use your password or QR code to sign in.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Trusted device authentication failed');
    } finally {
      setLoading(false);
    }
  };

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
      await login(loginForm.identifier, loginForm.password);
      setIsSuccessSplash(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Student Account Registration Handler
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.username || !signupForm.displayName || !signupForm.password) {
      setErrorMsg('Please fill out all registration fields.');
      return;
    }
    if (signupForm.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await signup({
        username: signupForm.username,
        displayName: signupForm.displayName,
        password: signupForm.password,
        role: 'student'
      });
      setIsSuccessSplash(true);
      setTimeout(() => {
        router.replace('/onboarding');
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  // QR Payload String for SVG generator
  const qrPayloadString = challenge ? JSON.stringify({
    challengeId: challenge.challengeId,
    app: challenge.app,
    purpose: challenge.purpose,
    identityVersion: challenge.identityVersion,
    nonce: challenge.nonce,
    exp: challenge.exp,
    v: challenge.v,
    sig: challenge.sig
  }) : 'pinit-vault://auth/pending';

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
            fontSize: 32,
            margin: '0 auto 20px',
            border: '2px solid #10b981'
          }}>✓</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
            Authentication Verified
          </h2>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
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
                <img src="/brand/pinit-career-logo.png" alt="PINIT CAREER" className="lp-brand-logo" style={{ height: 48, maxWidth: 200 }} />
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
              fontSize: 12.5,
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
              fontSize: 12.5,
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
          <button
            type="button"
            onClick={() => { setMainTab('signup'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 750,
              border: 'none',
              cursor: 'pointer',
              background: mainTab === 'signup' ? 'var(--accent, #00A3FF)' : 'transparent',
              color: mainTab === 'signup' ? '#fff' : 'var(--text-secondary, #94A3B8)',
              transition: 'all 0.2s'
            }}
          >
            📝 Sign Up
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div style={{
            background: 'rgba(var(--danger-rgb),  0.12)',
            border: '1px solid rgba(var(--danger-rgb),  0.35)',
            color: 'var(--danger-bright)',
            padding: '12px 16px',
            borderRadius: 14,
            fontSize: 13,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span>⚠️ {errorMsg}</span>
              {mainTab === 'vault' && (
                <button
                  type="button"
                  onClick={() => requestNewChallenge()}
                  style={{
                    background: 'var(--danger)',
                    color: 'var(--text)',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Retry QR
                </button>
              )}
            </div>
            {mainTab === 'vault' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => { setMainTab('signup'); setErrorMsg(''); }}
                  style={{
                    flex: 1,
                    background: 'var(--accent, #00A3FF)',
                    color: 'var(--text)',
                    border: 'none',
                    padding: '7px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  📝 Create Account (Sign Up)
                </button>
                <button
                  type="button"
                  onClick={() => { setMainTab('password'); setErrorMsg(''); }}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.1)',
                    color: 'var(--text)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '7px 12px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  🔑 Password Login
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 1: 📱 PINIT VAULT QR LOGIN (SCREENSHOT 1)                     */}
        {/* ================================================================= */}
        {mainTab === 'vault' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                PinIT Vault Login
              </h2>
              <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', margin: 0 }}>
                Secure identity verification powered by PinIT Vault
              </p>
            </div>

            {/* Developer Mode Banner */}
            {isDemoAuthEnabled() && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(var(--warning-rgb),  0.12) 0%, rgba(217, 119, 6, 0.12) 100%)',
                border: '1px solid rgba(var(--warning-rgb),  0.35)',
                borderRadius: 14,
                padding: '12px 14px',
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--warning-bright)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    ⚡ Developer Mode Enabled
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Skip Vault & create a fresh unique user to test Onboarding.
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
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(var(--warning-rgb),  0.3)'
                  }}
                >
                  {loading ? 'Creating...' : 'Test Onboarding'}
                </button>
              </div>
            )}

            {/* 4-Step Progress UI Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 4,
              marginBottom: 16
            }}>
              {[
                { step: 1, title: 'QR Gen', icon: '✓' },
                { step: 2, title: 'Vault', icon: currentStep >= 2 ? '⏳' : '2' },
                { step: 3, title: 'AuthN', icon: currentStep >= 3 ? '...' : '3' },
                { step: 4, title: 'Ready', icon: '4' }
              ].map(s => (
                <div key={s.step} style={{
                  padding: '6px 4px',
                  borderRadius: 8,
                  textAlign: 'center',
                  background: currentStep >= s.step ? 'rgba(0, 163, 255, 0.15)' : 'var(--bg-secondary)',
                  border: `1px solid ${currentStep >= s.step ? 'var(--accent)' : 'var(--border-color)'}`,
                  fontSize: 11,
                  fontWeight: 650,
                  color: currentStep >= s.step ? 'var(--accent)' : 'var(--text-tertiary)'
                }}>
                  {s.step < currentStep ? '✓' : s.icon} {s.title}
                </div>
              ))}
            </div>

            {/* QR Canvas Display */}
            <div style={{
              background: '#ffffff',
              padding: 18,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              margin: '0 auto 16px',
              maxWidth: 230,
              width: '100%',
              position: 'relative'
            }}>
              <QRCodeSVG
                value={qrPayloadString}
                size={190}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* Countdown Bar & Timer */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12,
                color: 'var(--text-tertiary)',
                marginBottom: 6
              }}>
                <span>QR Expiry Timer</span>
                <span style={{ fontWeight: 700, color: secondsRemaining < 10 ? 'var(--danger-bright)' : 'var(--accent)' }}>
                  {secondsRemaining}s remaining
                </span>
              </div>
              <div style={{
                height: 4,
                background: 'var(--bg-secondary)',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: secondsRemaining < 10 ? 'var(--danger)' : 'var(--accent)',
                  width: `${(secondsRemaining / 60) * 100}%`,
                  transition: 'width 1s linear'
                }} />
              </div>
            </div>

            {/* Status Indicator Message */}
            <div style={{
              textAlign: 'center',
              fontSize: 12.5,
              color: 'var(--text-secondary)',
              marginBottom: 16,
              padding: '10px 14px',
              background: 'var(--bg-secondary)',
              borderRadius: 12,
              border: '1px solid var(--border-color)'
            }}>
              {challengeStatus === 'SCANNING' ? (
                <span style={{ color: 'var(--warning)', fontWeight: 600 }}>
                  📱 QR Scanned! Completing Vault biometric verification...
                </span>
              ) : (
                <span>
                  Waiting for approval... Please scan this QR using <strong>PinIT Vault</strong> app.
                </span>
              )}
            </div>

            {/* Local Simulator Button for Testing (Demo Mode Only) */}
            {isDemoAuthEnabled() && (
              <button
                type="button"
                onClick={handleSimulateVaultApproval}
                disabled={loading || !challenge}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, var(--success-deep) 0%, var(--success) 100%)',
                  color: 'var(--text)',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 750,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(var(--success-rgb), 0.3)'
                }}
              >
                {loading ? 'Approving...' : '📲 Simulate PinIT Vault App Scan & Approval (Demo Only)'}
              </button>
            )}

            {/* Quick Switch Alternative Actions */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              marginTop: 18,
              paddingTop: 14,
              borderTop: '1px solid var(--border-color)',
              fontSize: 12.5,
              color: 'var(--text-tertiary)'
            }}>
              <div>
                <span>Don&apos;t have the Vault app? </span>
                <button
                  type="button"
                  onClick={() => { setMainTab('signup'); setErrorMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent, #00A3FF)',
                    fontWeight: 750,
                    cursor: 'pointer',
                    padding: '0 2px',
                    fontSize: 12.5,
                    textDecoration: 'underline'
                  }}
                >
                  Create Student Account (Sign Up) →
                </button>
              </div>
              <div>
                <span>Prefer email &amp; password? </span>
                <button
                  type="button"
                  onClick={() => { setMainTab('password'); setErrorMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary, #94A3B8)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '0 2px',
                    fontSize: 12
                  }}
                >
                  Password Sign In →
                </button>
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
              <h2 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                Sign In With Password
              </h2>
              <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', margin: 0 }}>
                Unified Portal for Students, Faculty & Recruiters
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 6 }}>
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
                  fontSize: 13.5,
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 6 }}>
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
                  fontSize: 13.5,
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
                fontSize: 13.5,
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

        {/* ================================================================= */}
        {/* TAB 3: 📝 CREATE STUDENT ACCOUNT (SCREENSHOT 2)                   */}
        {/* ================================================================= */}
        {mainTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <h2 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                Create Student Account
              </h2>
              <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', margin: 0 }}>
                Join thousands of verified students mastering industry skills
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Email / Username
              </label>
              <input
                type="text"
                placeholder="you@college.edu"
                value={signupForm.username}
                onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: 13.5,
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Display Name
              </label>
              <input
                type="text"
                placeholder="Your Full Name"
                value={signupForm.displayName}
                onChange={(e) => setSignupForm({ ...signupForm, displayName: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: 13.5,
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 650, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: 13.5,
                  outline: 'none'
                }}
              />
            </div>

            <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)', margin: '4px 0 0', lineHeight: 1.4 }}>
              New accounts are registered as <strong>students</strong>. Staff and recruiter access is granted by institutional administrators.
            </p>

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
                fontSize: 13.5,
                fontWeight: 750,
                cursor: 'pointer',
                marginTop: 4,
                boxShadow: '0 4px 14px var(--accent-glow)'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Student Account'}
            </button>
          </form>
        )}

        {/* 🧭 Universal Footer Switcher */}
        <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: 12.5, color: 'var(--text-tertiary)' }}>
          {mainTab === 'vault' ? (
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
          ) : mainTab === 'password' ? (
            <span>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => { setMainTab('signup'); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Create Student Account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMainTab('password'); setErrorMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </span>
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
