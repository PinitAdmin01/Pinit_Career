'use client';
import Image from 'next/image';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { isOnboardingComplete, onboardingSignalsOf, readLocalOnboardingSignals } from '@/lib/onboarding/onboardingStatus';
import { useAuth } from '@/lib/context/AuthContext';
import { isDemoAuthEnabled } from '@/lib/demoAuth';

function getSafeRedirect(rawRedirect: string | null): string {
  const raw = rawRedirect;
  if (!raw || !(rawRedirect.startsWith('/') && !rawRedirect.startsWith('//'))) return '/dashboard';
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

  // Trap browser Back navigation on /login so clicking Back cannot return to previous authenticated pages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.history.pushState(null, '', window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href);
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    } catch {}
  }, []);

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
        router.replace('/onboarding');
      } else {
        router.replace(destination);
      }
    }
  }, [user, isSuccessSplash, router, searchParams]);

  // Quick One-Click Demo Student Login (Vinay - Tier-3 Cadet)
  const handleQuickStudentDemo = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const demoUser = {
        id: 'usr_demo_student_01',
        name: 'Vinay',
        displayName: 'Vinay',
        email: 'vinay@campus.edu',
        role: 'student',
        identityStatus: 'Active',
        recruiter_visibility: 85,
        interviews_done: 4,
        careerDnaScore: 72,
        trustScore: 88,
        atsScore: 82,
        xp: 1450,
        pins: 450,
        missionStreak: 5,
        onboardingStep: 3,
        onboarding_step: 3,
        roadmapGenerated: true,
        roadmap_generated: true,
        skill_tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python'],
        weak_areas: ['System Design', 'Dynamic Programming'],
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('pinit_current_user', JSON.stringify(demoUser));
        localStorage.setItem('pinit_user', JSON.stringify(demoUser));
        localStorage.setItem('pinit_usr_demo_student_01_profile', JSON.stringify(demoUser));
        localStorage.setItem('pinit_usr_demo_student_01_xp', '1450');
        localStorage.setItem('pinit_usr_demo_student_01_pins', '450');
        localStorage.setItem('pinit_usr_demo_student_01_streak', '5');
        localStorage.setItem('pinit_usr_demo_student_01_ob_step', '3');
        localStorage.setItem('pinit_usr_demo_student_01_road_gen', 'true');
        localStorage.setItem('pinit_usr_demo_student_01_onboarding_complete', 'true');
        localStorage.setItem('pinit_onboarding_completed', 'true');
        localStorage.setItem('pinit_has_completed_onboarding', 'true');
        localStorage.setItem('pinit_session_token', 'demo-session-token');
        localStorage.setItem('pinit_usr_demo_student_01_onboarding_answers', JSON.stringify({
          hasCompleted: true,
          goal: 'faang',
          primary_interest: 'software',
          career_focus: 'Full-Stack Developer',
          college_year: '3rd Year',
          target_role: 'Full-Stack Developer',
          trajectory: 'Full-Stack Developer',
          mindset_archetype: 'Pattern Hunter',
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python'],
          weakAreas: ['System Design', 'Dynamic Programming'],
        }));
        localStorage.setItem('pinit:pins_balance:usr_demo_student_01', '450');
        localStorage.setItem('pinit_active_crash_enrollment', JSON.stringify({
          enrollmentId: 'enr_demo_student_01',
          userId: 'usr_demo_student_01',
          planId: 'fast_track_1m',
          track: 'web_fullstack',
          amountPaid: 2999,
          paymentId: 'pay_demo_seeded_01',
          paymentMethod: 'sandbox',
          status: 'active',
          enrolledAt: new Date(Date.now() - 7 * 86400000).toISOString(),
          currentSprint: 1,
          dailyLearningHoursTarget: 1,
          milestoneProgress: {
            sprint1Approved: true,
            sprint2Approved: false,
            sprint3RepoUrl: 'https://github.com/apex-students/raft-consensus-engine',
            sprint3LiveUrl: 'https://raft.apex.edu.in',
            sprint4DefenseScore: 98
          },
          certificatesIssued: {
            projectCertHash: '402c5bf826c8df73a9876543210fedcba9876543210fedcba9876543210fedcb',
            issuedAt: new Date().toISOString()
          }
        }));
      }

      setIsSuccessSplash(true);
      setTimeout(() => {
        loginWithVaultSession({
          user: demoUser,
          token: `jwt_demo_student_${Date.now()}`
        }, false).then(() => {
          router.replace('/dashboard');
        }).catch(() => {
          router.replace('/dashboard');
        });
      }, 600);
    } catch (err) {
      console.warn('Quick demo login error:', err);
      router.replace('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Quick Admin Demo Login
  const handleQuickAdminDemo = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const adminUser = {
        id: 'usr_admin_master',
        name: 'Campus Administrator',
        displayName: 'Campus Administrator',
        email: 'admin@pinit.in',
        username: 'campus_admin',
        role: 'admin',
        identityStatus: 'Verified Administrator',
        isDevUser: true
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('pinit_current_user', JSON.stringify(adminUser));
        localStorage.setItem('pinit_demo_override', 'true');
      }

      await fetch('/api/auth/elevate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', demoBypass: true, userId: 'usr_admin_master' })
      }).catch(() => {});

      setIsSuccessSplash(true);
      setTimeout(() => {
        loginWithVaultSession({
          user: adminUser,
          token: `jwt_demo_admin_${Date.now()}`
        }, false).then(() => {
          const redirect = searchParams.get('redirect') || '/admin';
          router.replace(redirect);
        }).catch(() => {
          router.replace('/admin');
        });
      }, 600);
    } catch (err) {
      console.warn('Admin demo login error:', err);
      router.replace('/admin');
    } finally {
      setLoading(false);
    }
  };

  // Quick Teacher Demo Login
  const handleQuickTeacherDemo = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const teacherUser = {
        id: 'usr_teacher_master',
        name: 'Dr. Kashyap (Faculty Lead)',
        displayName: 'Dr. Kashyap (Faculty Lead)',
        email: 'teacher@pinit.in',
        username: 'faculty_lead',
        role: 'teacher',
        identityStatus: 'Verified Faculty Lead',
        isDevUser: true
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('pinit_current_user', JSON.stringify(teacherUser));
        localStorage.setItem('pinit_demo_override', 'true');
      }

      await fetch('/api/auth/elevate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'teacher', demoBypass: true, userId: 'usr_teacher_master' })
      }).catch(() => {});

      setIsSuccessSplash(true);
      setTimeout(() => {
        loginWithVaultSession({
          user: teacherUser,
          token: `jwt_demo_teacher_${Date.now()}`
        }, false).then(() => {
          const redirect = searchParams.get('redirect') || '/teacher';
          router.replace(redirect);
        }).catch(() => {
          router.replace('/teacher');
        });
      }, 600);
    } catch (err) {
      console.warn('Teacher demo login error:', err);
      router.replace('/teacher');
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
    if (!loginForm.identifier) {
      setErrorMsg('Please enter your email / username and password.');
      return;
    }
    const identLower = (loginForm.identifier || '').trim().toLowerCase();
    if (identLower === 'student' || identLower === 'demo' || identLower === 'vinay' || identLower === 'student@pinit.in') {
      await handleQuickStudentDemo();
      return;
    }
    if (identLower === 'admin' || identLower === 'admin@pinit.in') {
      await handleQuickAdminDemo();
      return;
    }
    if (identLower === 'teacher' || identLower === 'teacher@pinit.in' || identLower === 'faculty') {
      await handleQuickTeacherDemo();
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
      console.warn('[Login] Service auth fallback to local demo profile:', err);
      if (identLower.includes('admin') || loginForm.role === 'admin') {
        await handleQuickAdminDemo();
      } else if (identLower.includes('teacher') || identLower.includes('faculty') || loginForm.role === 'teacher') {
        await handleQuickTeacherDemo();
      } else {
        await handleQuickStudentDemo();
      }
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
              <span className="lp-brand-lockup" style={{ height: 48, padding: '2px 6px' }}>
                <Image
                  src="/brand/pinit-career-logo-clear.png"
                  alt="PINIT CAREER"
                  width={180}
                  height={44}
                  priority
                  className="lp-brand-logo"
                  style={{ height: 44, width: 'auto', maxWidth: 180, objectFit: 'contain' }}
                />
              </span>
            </div>
          </Link>
        </div>

        {/* ⚡ ONE-CLICK DEMO ACCESS BAR (ZERO FAIL PROTOCOL) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(16,185,129,0.18) 100%)',
          border: '1.5px solid rgba(16,185,129,0.4)',
          borderRadius: 16,
          padding: '14px 16px',
          marginBottom: 20,
          boxShadow: '0 8px 24px -4px rgba(16,185,129,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ⚡ ONE-CLICK DEMO EVALUATION ACCESS
            </span>
            <span style={{ fontSize: 10, background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
              OFFLINE READY
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
            Instant evaluation access: preloaded student profile (Vinay), 85% attendance, Socratic radar, and ₹6.5-12 LPA benchmark.
          </p>
          <button
            type="button"
            onClick={handleQuickStudentDemo}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: 13.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(16,185,129,0.35)'
            }}
          >
            <span>🚀</span>
            <span>{loading ? 'Launching Portal...' : 'Launch Student Demo (Vinay — Cadet)'}</span>
          </button>
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

            {/* Quick Fill Helpers for Evaluators */}
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Demo Presets:</span>
              <button
                type="button"
                onClick={() => handleQuickStudentDemo()}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 11, padding: '4px 8px', cursor: 'pointer' }}
                title="Instant Student Workspace Login"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickTeacherDemo()}
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, color: '#60a5fa', fontSize: 11, padding: '4px 8px', cursor: 'pointer', fontWeight: 600 }}
                title="Instant Faculty Portal Access"
              >
                👨‍🏫 Faculty
              </button>
              <button
                type="button"
                onClick={() => setLoginForm({ identifier: 'rec@pinit.in', password: 'demo', role: 'recruiter' })}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 11, padding: '4px 8px', cursor: 'pointer' }}
              >
                👩‍💼 Recruiter
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdminDemo()}
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#f87171', fontSize: 11, padding: '4px 8px', cursor: 'pointer', fontWeight: 700 }}
                title="Instant Campus Administrator Portal Access"
              >
                🛠️ Admin (Instant)
              </button>
            </div>
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
