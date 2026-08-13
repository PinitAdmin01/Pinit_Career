'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { isDemoAuthEnabled } from '@/lib/demoAuth';
import { QRCodeSVG } from 'qrcode.react';
import {
  identityGateway,
  AuthenticationMethod,
  VaultChallenge,
  ChallengeStatus,
  getDeviceName
} from '@/lib/services/identityGateway';

export default function LoginPage() {
  const { user, loginWithVaultSession } = useAuth();
  const router = useRouter();

  // State Management
  const [isTrustedDevice, setIsTrustedDevice] = useState<boolean>(false);
  const [trustedDeviceName, setTrustedDeviceName] = useState<string>('');
  const [authMode, setAuthMode] = useState<'qr' | 'trusted' | 'face' | 'biometric'>('qr');

  // Challenge & Stream State
  const [challenge, setChallenge] = useState<VaultChallenge | null>(null);
  const [challengeStatus, setChallengeStatus] = useState<ChallengeStatus>('PENDING');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 4-Step Progress State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSuccessSplash, setIsSuccessSplash] = useState<boolean>(false);

  // 1. Session Check: If already authenticated, redirect to /onboarding for dev/new users or /dashboard for existing users
  useEffect(() => {
    if (user && !isSuccessSplash) {
      const onboardCompleted = typeof window !== 'undefined' && localStorage.getItem(`pinit_${user.id}_onboarding_answers`);
      if (!onboardCompleted || user.isDevUser) {
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
      setCurrentStep(2); // Step 2: Waiting for Vault
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate authentication QR code');
    }
  }, []);

  // Initialize Challenge when entering QR mode
  useEffect(() => {
    if (authMode === 'qr' && !challenge && !user) {
      requestNewChallenge();
    }
  }, [authMode, challenge, user, requestNewChallenge]);

  // 4. 60-Second Countdown Timer
  useEffect(() => {
    if (authMode !== 'qr' || !challenge || isSuccessSplash) return;
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
  }, [authMode, challenge, isSuccessSplash, requestNewChallenge]);

  // 5. Subscribe to Status Stream
  useEffect(() => {
    if (!challenge || authMode !== 'qr' || isSuccessSplash) return;

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
        // Step 3 & 4: Authenticating & Preparing Workspace
        setCurrentStep(3);
        try {
          const sessionData = await identityGateway.exchangeSession(
            challenge.challengeId,
            AuthenticationMethod.QR_SCAN
          );
          setCurrentStep(4);
          setIsSuccessSplash(true);

          // 1.0-Second Splash Transition Screen
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
  }, [challenge, authMode, isSuccessSplash, requestNewChallenge, loginWithVaultSession, router]);

  // Helper: Simulate Vault Mobile Scan & Approval for testing
  const handleSimulateVaultApproval = async () => {
    if (!challenge) return;
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
      // Create instant session for trusted device
      const mockSession = {
        user: {
          id: 'usr_vault_verified_student',
          name: 'Alex Vance',
          email: 'alex.vance@pinit.in',
          role: 'student',
          identityStatus: 'Active'
        },
        token: `jwt_trusted_${Date.now()}`
      };
      setIsSuccessSplash(true);
      setTimeout(() => {
        loginWithVaultSession(mockSession).then(() => {
          router.push('/dashboard');
        });
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Trusted device authentication failed');
    } finally {
      setLoading(false);
    }
  };
  // Developer Mode Login: Creates a brand-new unique user ID every time & skips directly to onboarding
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

      // Completely clear any previous onboarding data for this new unique user ID
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
          // Lands ONLY on onboarding process
          router.replace('/onboarding');
        });
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Developer mode login failed');
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
        background: 'var(--bg1, #030712)',
        color: '#fff',
        padding: 24
      }}>
        <div style={{
          maxWidth: 420,
          width: '100%',
          background: 'var(--bg2, #0b0f19)',
          border: '1px solid #10b981',
          borderRadius: 24,
          padding: 40,
          textAlign: 'center',
          boxShadow: '0 0 40px rgba(16,185,129,0.2)',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            width: 64,
            height: 64,
            background: 'rgba(16,185,129,0.15)',
            color: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            margin: '0 auto 20px',
            border: '2px solid #10b981'
          }}>✓</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: '#fff' }}>
            Login Successful
          </h2>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
            Loading Career Workspace...
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
              background: '#10b981',
              width: '100%',
              transition: 'width 1s linear'
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
      background: 'var(--bg1, #030712)',
      color: 'var(--t1, #f9fafb)',
      padding: '24px'
    }}>
      <div className="auth-card animate-fade-in" style={{
        maxWidth: 460,
        width: '100%',
        background: 'var(--bg2, #0b0f19)',
        border: '1px solid var(--border, #1f2937)',
        borderRadius: 24,
        padding: 32,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Brand Logo Header */}
        <div className="auth-logo" style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
            <span className="lp-brand-lockup" style={{ height: 56, padding: '4px 10px' }}>
              <img src="/brand/pinit-career-logo.png" alt="PINIT CAREER" className="lp-brand-logo" style={{ height: 48, maxWidth: 200 }} />
            </span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 4px', color: 'var(--t1)' }}>
            PinIT Vault Login
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3, #9ca3af)', margin: 0 }}>
            Secure identity verification powered by PinIT Vault
          </p>
        </div>
        {isDemoAuthEnabled() && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.12) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 6 }}>
              ⚡ Developer Mode Enabled
            </div>
            <div style={{ fontSize: 11, color: '#d1d5db', marginTop: 2 }}>
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
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}
          >
            {loading ? 'Creating...' : 'Test Onboarding'}
          </button>
        </div>
        )}

        {/* Error / Offline Alert Banner */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: 12,
            fontSize: 13,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8
          }}>
            <span>⚠️ {errorMsg}</span>
            <button
              onClick={() => requestNewChallenge()}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Trusted Device Action Selector */}
        {isTrustedDevice && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: 'flex',
              background: 'var(--bg3, #111827)',
              padding: 4,
              borderRadius: 14,
              marginBottom: 16,
              border: '1px solid var(--border, #1f2937)'
            }}>
              <button
                type="button"
                onClick={() => setAuthMode('trusted')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: authMode === 'trusted' ? 'var(--accent, #4f46e5)' : 'transparent',
                  color: authMode === 'trusted' ? '#fff' : 'var(--t3, #9ca3af)'
                }}
              >
                🔒 Trusted Options
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('qr'); requestNewChallenge(); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: authMode === 'qr' ? 'var(--accent, #4f46e5)' : 'transparent',
                  color: authMode === 'qr' ? '#fff' : 'var(--t3, #9ca3af)'
                }}
              >
                📱 Scan QR
              </button>
            </div>
          </div>
        )}

        {/* TRUSTED DEVICE OPTIONS VIEW */}
        {isTrustedDevice && authMode === 'trusted' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: 'rgba(79, 70, 229, 0.08)',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              borderRadius: 12,
              padding: 12,
              fontSize: 12,
              color: '#a5b4fc',
              marginBottom: 8
            }}>
              ✓ Trusted Device Verified: <strong>{trustedDeviceName}</strong>
            </div>

            {/* Option 1: Face Authentication */}
            <button
              onClick={() => handleTrustedDeviceLogin(AuthenticationMethod.FACE_AUTH)}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                width: '100%',
                padding: '14px 16px',
                background: 'var(--bg3, #111827)',
                border: '1px solid var(--border, #1f2937)',
                borderRadius: 14,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: 24 }}>👤</span>
              <div>
                <div>Continue With Face Authentication</div>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400 }}>
                  Fast verification via PinIT Vault face match
                </div>
              </div>
            </button>

            {/* Option 2: Device Biometrics */}
            <button
              onClick={() => handleTrustedDeviceLogin(AuthenticationMethod.DEVICE_BIOMETRIC)}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                width: '100%',
                padding: '14px 16px',
                background: 'var(--bg3, #111827)',
                border: '1px solid var(--border, #1f2937)',
                borderRadius: 14,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: 24 }}>👆</span>
              <div>
                <div>Continue With Device Biometrics</div>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400 }}>
                  Touch ID / Face ID / Platform Biometrics
                </div>
              </div>
            </button>

            {/* Option 3: Scan With Vault */}
            <button
              onClick={() => { setAuthMode('qr'); requestNewChallenge(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                width: '100%',
                padding: '14px 16px',
                background: 'var(--bg3, #111827)',
                border: '1px solid var(--border, #1f2937)',
                borderRadius: 14,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: 24 }}>📱</span>
              <div>
                <div>Continue With Scan With Vault</div>
                <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400 }}>
                  Display signed QR code to scan with Vault mobile app
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* UNTRUSTED / QR SCAN VIEW */
          <div>
            {/* 4-Step Progress UI Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 4,
              marginBottom: 20
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
                  background: currentStep >= s.step ? 'rgba(79,70,229,0.2)' : 'var(--bg3, #111827)',
                  border: `1px solid ${currentStep >= s.step ? 'var(--accent, #4f46e5)' : 'var(--border, #1f2937)'}`,
                  fontSize: 11,
                  fontWeight: 600,
                  color: currentStep >= s.step ? '#a5b4fc' : '#6b7280'
                }}>
                  {s.step < currentStep ? '✓' : s.icon} {s.title}
                </div>
              ))}
            </div>

            {/* QR Canvas Display */}
            <div style={{
              background: '#ffffff',
              padding: 20,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              margin: '0 auto 20px',
              maxWidth: 240,
              width: '100%',
              position: 'relative'
            }}>
              <QRCodeSVG
                value={qrPayloadString}
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>

            {/* Countdown Bar & Timer */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12,
                color: '#9ca3af',
                marginBottom: 6
              }}>
                <span>QR Expiry Timer</span>
                <span style={{ fontWeight: 700, color: secondsRemaining < 10 ? '#f87171' : '#a5b4fc' }}>
                  {secondsRemaining}s remaining
                </span>
              </div>
              <div style={{
                height: 4,
                background: 'var(--bg3, #111827)',
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: secondsRemaining < 10 ? '#ef4444' : 'var(--accent, #4f46e5)',
                  width: `${(secondsRemaining / 60) * 100}%`,
                  transition: 'width 1s linear'
                }} />
              </div>
            </div>

            {/* Status Indicator Message */}
            <div style={{
              textAlign: 'center',
              fontSize: 13,
              color: '#d1d5db',
              marginBottom: 20,
              padding: '10px 14px',
              background: 'var(--bg3, #111827)',
              borderRadius: 12,
              border: '1px solid var(--border, #1f2937)'
            }}>
              {challengeStatus === 'SCANNING' ? (
                <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                  📱 QR Scanned! Completing Vault biometric verification...
                </span>
              ) : (
                <span>
                  Waiting for approval... Please scan this QR using <strong>PinIT Vault</strong> app.
                </span>
              )}
            </div>

            {/* Local Simulator Button for Testing */}
            <button
              type="button"
              onClick={handleSimulateVaultApproval}
              disabled={loading || !challenge}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
              }}
            >
              {loading ? 'Approving...' : '📲 Simulate PinIT Vault App Scan & Approval'}
            </button>
          </div>
        )}

        {/* Footer Navigation Link */}
        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>
          Don't have the PinIT Vault mobile app?{' '}
          <Link href="/onboarding" style={{ color: 'var(--accent, #6366f1)', fontWeight: 600, textDecoration: 'none' }}>
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
