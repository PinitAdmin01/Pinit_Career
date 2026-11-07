'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import CollegeIdScanner from '@/components/auth/CollegeIdScanner';
import { CollegeMetadata } from '@/lib/utils/pinitIdGenerator';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  // Theme state: 'dark' (Minimalist Precision) vs 'light' (Modern Clean SaaS)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('pinit_signup_theme') as 'dark' | 'light';
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch {}
  }, []);

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('pinit_signup_theme', newTheme);
    } catch {}
  };

  // Form State
  const [form, setForm] = useState({ username: '', displayName: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [pinitId, setPinitId] = useState('');
  const [idMode, setIdMode] = useState<'college' | 'global'>('college');
  const [collegeMeta, setCollegeMeta] = useState<CollegeMetadata | undefined>();
  const [uploadedCardFile, setUploadedCardFile] = useState<File | null>(null);
  const [uploadedCardStoragePath, setUploadedCardStoragePath] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Active view tab: 'form' vs 'vault' (from screenshot 1 & 2)
  const [activeTab, setActiveTab] = useState<'form' | 'vault'>('form');

  const handleIdGenerated = useCallback((id: string, mode: 'college' | 'global', meta?: CollegeMetadata, file?: File | null) => {
    setPinitId(id);
    setIdMode(mode);
    setCollegeMeta(meta);
    if (file !== undefined) setUploadedCardFile(file);
  }, []);

  const handleNameExtracted = useCallback((extractedName: string) => {
    setForm((prev) => ({
      ...prev,
      displayName: extractedName === 'Student' ? '' : extractedName,
    }));
  }, []);

  // Quick Demo Presets (from screenshot 1)
  const applyPreset = (preset: 'student' | 'faculty' | 'recruiter' | 'admin') => {
    setError('');
    if (preset === 'student') {
      setForm({
        username: 'vinay@campus.edu',
        displayName: 'Vinay N',
        password: 'password123',
      });
      setPinitId('PIN-BGS-BCA-726');
    } else if (preset === 'faculty') {
      setForm({
        username: 'dr.sharma@campus.edu',
        displayName: 'Dr. R. K. Sharma',
        password: 'password123',
      });
      setPinitId('PIN-BGS-FAC-014');
    } else if (preset === 'recruiter') {
      setForm({
        username: 'talent@google.com',
        displayName: 'Google Campus Talent',
        password: 'password123',
      });
      setPinitId('PIN-GLB-GOOGLE-101');
    } else if (preset === 'admin') {
      setForm({
        username: 'admin@pinit.os',
        displayName: 'System Admin',
        password: 'password123',
      });
      setPinitId('PIN-GLB-ADMIN-001');
    }
  };

  // Instant Launch Student Demo (from screenshot 1)
  const handleLaunchStudentDemo = async () => {
    setLoading(true);
    setError('');
    try {
      const demoUser = {
        id: 'usr_demo_student_01',
        name: 'Vinay',
        displayName: 'Vinay N',
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
        pinitId: 'PIN-BGS-BCA-726',
        registerNumber: 'PIN-BGS-BCA-726',
        skill_tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python'],
        weak_areas: ['System Design', 'Dynamic Programming'],
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('pinit_current_user', JSON.stringify(demoUser));
        localStorage.setItem('pinit_user', JSON.stringify(demoUser));
        localStorage.setItem('pinit_student_id', 'PIN-BGS-BCA-726');
        localStorage.setItem('pinit_session_token', 'demo-session-token');
      }
      router.push('/dashboard');
    } catch {
      setError('Could not launch demo profile');
    } finally {
      setLoading(false);
    }
  };

  // Developer Mode Test Onboarding (from screenshot 2)
  const handleTestOnboarding = () => {
    const testId = `PIN-TEST-${Math.floor(100 + Math.random() * 900)}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinit_student_id', testId);
    }
    router.push('/onboarding');
  };

  // Registration submission
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.displayName || !form.password) {
      setError('Please fill out all credentials.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (idMode === 'college' && pinitId) {
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select('id, register_number')
            .or(`register_number.ilike.${pinitId},roll_number.ilike.${pinitId}`)
            .maybeSingle();

          if (existingUser) {
            setError(`Institutional ID ${pinitId} has already been claimed by an existing student account. If this is your ID card, please sign in or contact campus support.`);
            setLoading(false);
            return;
          }
        } catch (checkErr) {
          console.warn('[Signup] Duplicate check exception:', checkErr);
        }
      }

      await signup({
        username: form.username,
        displayName: form.displayName,
        password: form.password,
        role: 'student',
        registerNumber: pinitId,
        pinitId: pinitId,
        collegeInfo: collegeMeta,
      });

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData?.session?.user?.id;
        const finalPath = uploadedCardStoragePath || (uploadedCardFile && pinitId ? `${pinitId}/card_${Date.now()}.${uploadedCardFile.name.split('.').pop() || 'png'}` : '');

        if (uploadedCardFile && pinitId && !uploadedCardStoragePath) {
          try {
            await supabase.storage
              .from('student-id-cards')
              .upload(finalPath, uploadedCardFile, {
                cacheControl: '3600',
                upsert: true,
              });
          } catch (uploadErr) {
            console.warn('[Signup] College ID card bucket upload notice:', uploadErr);
          }
        }

        if (currentUserId && finalPath) {
          try {
            await supabase.from('student_id_card_verifications').insert({
              user_id: currentUserId,
              pinit_id: pinitId,
              card_storage_path: finalPath,
              verification_status: 'pending',
              extracted_usn: collegeMeta?.rollNumber || '',
              extracted_college: collegeMeta?.collegeName || '',
            });
          } catch (verifErr) {
            console.warn('[Signup] Verification tracking notice:', verifErr);
          }
        }
      } catch (postRegErr) {
        console.warn('[Signup] Post-registration processing notice:', postRegErr);
      }

      try {
        if (typeof window !== 'undefined') {
          if (pinitId) localStorage.setItem('pinit_student_id', pinitId);
          if (collegeMeta) localStorage.setItem('pinit_college_meta', JSON.stringify(collegeMeta));
          localStorage.setItem('pinit_id_mode', idMode);
        }
      } catch {}

      router.push('/onboarding');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  // Theme-dependent design tokens
  const isDark = theme === 'dark';
  const colors = {
    pageBg: isDark ? '#0c0e12' : '#f8fafc',
    cardBg: isDark ? '#12141a' : '#ffffff',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
    textPrimary: isDark ? '#f8fafc' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#475569',
    textMuted: isDark ? '#64748b' : '#94a3b8',
    inputBg: isDark ? '#0a0c10' : '#ffffff',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.12)' : '#cbd5e1',
    accentGreen: '#10b981',
    accentIndigo: '#4f46e5',
    telemetryBg: isDark ? '#0a0d13' : '#ffffff',
    telemetryBorder: isDark ? 'rgba(16, 185, 129, 0.2)' : '#e2e8f0',
  };

  const activeIdString = pinitId || (form.displayName ? `PIN-BGS-BCA-726` : 'PIN-COL-GEN-001');
  const activeStudentName = form.displayName || 'Vinay N';
  const activeCollegeName = collegeMeta?.collegeName || 'BGS Institute of Management';
  const activeDept = collegeMeta?.departmentCode || 'BCA';
  const activeRoll = collegeMeta?.rollNumber || '726';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: colors.pageBg,
        color: colors.textPrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        backgroundImage: isDark
          ? 'radial-gradient(ellipse 70% 50% at 30% 10%, rgba(16, 185, 129, 0.06), transparent 70%), radial-gradient(ellipse 50% 40% at 85% 85%, rgba(6, 182, 212, 0.04), transparent 60%)'
          : 'radial-gradient(ellipse 60% 45% at 20% 15%, rgba(79, 70, 229, 0.04), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(16, 185, 129, 0.04), transparent 60%)',
        transition: 'background-color 0.25s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1200,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 36,
          alignItems: 'center',
        }}
      >
        {/* ═════════════════════════════════════════════════════════════════
            LEFT COLUMN (50%): High-Tech Branding, Holographic Card & Telemetry
            ═════════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '12px' }}>
          {/* Header Brand Lockup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="lp-brand-lockup" style={{ height: 42, padding: '2px 4px' }}>
                  <Image
                    src="/brand/pinit-career-logo-clear.png"
                    alt="PINIT CAREER"
                    width={160}
                    height={38}
                    className="lp-brand-logo"
                    style={{ height: 38, width: 'auto', objectFit: 'contain' }}
                    priority
                  />
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(79, 70, 229, 0.1)',
                    color: isDark ? colors.accentGreen : colors.accentIndigo,
                    letterSpacing: '0.5px',
                  }}
                >
                  v2.4 HYBRID
                </span>
              </div>

              {/* Theme Toggle Pill (Dark / Light) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0',
                  padding: '3px',
                  borderRadius: 20,
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleTheme('dark')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 16,
                    border: 'none',
                    background: isDark ? '#1e293b' : 'transparent',
                    color: isDark ? '#10b981' : '#64748b',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.2s',
                  }}
                >
                  <span>🌙</span> Dark
                </button>
                <button
                  type="button"
                  onClick={() => toggleTheme('light')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 16,
                    border: 'none',
                    background: !isDark ? '#ffffff' : 'transparent',
                    color: !isDark ? '#4f46e5' : '#64748b',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    boxShadow: !isDark ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>☀️</span> Light
                </button>
              </div>
            </div>

            <h1
              style={{
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: '-0.8px',
                color: colors.textPrimary,
                margin: '8px 0 0',
                lineHeight: 1.15,
              }}
            >
              PinIT Career OS
            </h1>
            <p
              style={{
                fontSize: 14.5,
                color: colors.textSecondary,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Unified institutional identity, automated credential OCR, and AI career acceleration for universities and students.
            </p>
          </div>

          {/* Floating Holographic Student ID Card (Mockup 2 & 3 fidelity) */}
          <div
            style={{
              position: 'relative',
              borderRadius: 18,
              padding: '24px 26px',
              background: isDark
                ? 'linear-gradient(135deg, rgba(16, 24, 39, 0.95) 0%, rgba(10, 14, 23, 0.98) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: isDark
                ? '1.5px solid rgba(16, 185, 129, 0.45)'
                : '1.5px solid rgba(79, 70, 229, 0.25)',
              boxShadow: isDark
                ? '0 0 30px -5px rgba(16, 185, 129, 0.25), 0 20px 30px -15px rgba(0, 0, 0, 0.7)'
                : '0 20px 40px -10px rgba(79, 70, 229, 0.14), 0 8px 16px -6px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              overflow: 'hidden',
            }}
          >
            {/* Hologram Circuit Overlay Background */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 140,
                height: 140,
                backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.12) 1px, transparent 1px)',
                backgroundSize: '12px 12px',
                opacity: 0.6,
                pointerEvents: 'none',
              }}
            />

            {/* Card Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🪪</span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'monospace',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    color: colors.textMuted,
                    textTransform: 'uppercase',
                  }}
                >
                  Student Identity Card
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  color: isDark ? colors.accentGreen : colors.accentIndigo,
                  letterSpacing: '1.2px',
                }}
              >
                PinIT
              </span>
            </div>

            {/* Generated PinIT ID Display */}
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  letterSpacing: '1px',
                  color: isDark ? '#34d399' : '#4f46e5',
                }}
              >
                {activeIdString}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '3px 8px',
                    borderRadius: 12,
                    fontSize: 10.5,
                    fontWeight: 800,
                    background: isDark ? 'rgba(16, 185, 129, 0.16)' : 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <span>✓</span> Verified Campus Linked
                </span>
              </div>
            </div>

            {/* Student Credential Snippet */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: 12,
                paddingTop: 12,
                borderTop: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                fontSize: 12,
              }}
            >
              <div>
                <div style={{ color: colors.textMuted, fontSize: 10.5, fontWeight: 700 }}>STUDENT</div>
                <div style={{ fontWeight: 800, color: colors.textPrimary, marginTop: 2 }}>{activeStudentName}</div>
                <div style={{ color: colors.textSecondary, fontSize: 11, marginTop: 1 }}>{activeCollegeName}</div>
              </div>
              <div>
                <div style={{ color: colors.textMuted, fontSize: 10.5, fontWeight: 700 }}>COURSE / USN</div>
                <div style={{ fontWeight: 800, color: colors.textPrimary, marginTop: 2 }}>{activeDept}</div>
                <div style={{ color: colors.textSecondary, fontSize: 11, marginTop: 1 }}>Roll #{activeRoll}</div>
              </div>
            </div>
          </div>

          {/* Telemetry Progression Card (from Mockups) */}
          <div
            style={{
              borderRadius: 14,
              padding: '16px 18px',
              background: colors.telemetryBg,
              border: `1px solid ${colors.telemetryBorder}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800 }}>
                <span style={{ color: '#10b981' }}>📈</span>
                <span style={{ color: colors.textPrimary }}>Career Progression Telemetry</span>
              </div>
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 800, fontFamily: 'monospace' }}>
                +89% Placement Ready
              </span>
            </div>

            {/* Sparkline Graph */}
            <div style={{ position: 'relative', height: 44, width: '100%', overflow: 'hidden' }}>
              <svg width="100%" height="44" viewBox="0 0 380 44" fill="none" preserveAspectRatio="none">
                <path
                  d="M0,38 Q40,32 80,35 T160,22 T240,28 T320,12 T380,6"
                  stroke={isDark ? '#10b981' : '#4f46e5'}
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M0,38 Q40,32 80,35 T160,22 T240,28 T320,12 T380,6 L380,44 L0,44 Z"
                  fill={isDark ? 'url(#emeraldGlow)' : 'url(#indigoGlow)'}
                  opacity="0.3"
                />
                <defs>
                  <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="indigoGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: colors.textMuted }}>
              <span>Step 1: ID Verified</span>
              <span>Step 2: AI Roadmap</span>
              <span>Step 3: Campus Placed</span>
            </div>
          </div>

          {/* Quick Demo Cadet Launcher Button (from screenshot 1) */}
          <button
            type="button"
            onClick={handleLaunchStudentDemo}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              color: '#10b981',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
              <span style={{ fontSize: 18 }}>🚀</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>Launch Student Demo (Vinay — Cadet)</div>
                <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                  Preloaded profile: 85% attendance, Socratic radar & ₹6.5-12 LPA benchmark
                </div>
              </div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 900 }}>&rarr;</span>
          </button>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            RIGHT COLUMN (50%): Clean Sign-In / Sign-Up & ID Scanner Dock
            ═════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 20,
            padding: '28px 28px',
            boxShadow: isDark
              ? '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Dual Navigation Tabs: [Form / Scanner] vs [PinIT Vault QR] (from screenshot 1 & 2) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 6,
              padding: '4px',
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
              borderRadius: 12,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'form' ? (isDark ? '#1e293b' : '#ffffff') : 'transparent',
                color: activeTab === 'form' ? (isDark ? '#38bdf8' : '#0284c7') : colors.textMuted,
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: activeTab === 'form' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              <span>🔑</span> Credentials
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'vault' ? (isDark ? '#1e293b' : '#ffffff') : 'transparent',
                color: activeTab === 'vault' ? (isDark ? '#38bdf8' : '#0284c7') : colors.textMuted,
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: activeTab === 'vault' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              <span>📲</span> PinIT Vault QR
            </button>
            <Link
              href="/login"
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                background: 'transparent',
                color: colors.textMuted,
                fontWeight: 800,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                textDecoration: 'none',
              }}
            >
              <span>🚪</span> Sign In &rarr;
            </Link>
          </div>

          {/* VIEW A: PinIT Vault QR Mode (Screenshot 2 fidelity) */}
          {activeTab === 'vault' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'center', padding: '16px 8px' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: colors.textPrimary, margin: '0 0 4px' }}>
                  PinIT Vault Login
                </h3>
                <p style={{ fontSize: 12, color: colors.textMuted, margin: 0 }}>
                  Secure cross-device QR code biometric authentication
                </p>
              </div>

              {/* Developer Mode Onboarding Button (from screenshot 2) */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#f59e0b' }}>
                    ⚡ Developer Mode Enabled
                  </div>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                    Skip Vault & create a fresh unique user to test onboarding
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTestOnboarding}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: '#f59e0b',
                    color: '#000000',
                    border: 'none',
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Test Onboarding
                </button>
              </div>

              <div
                style={{
                  padding: '24px 16px',
                  borderRadius: 14,
                  background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                  border: `1px solid ${colors.cardBorder}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 36 }}>📱</span>
                <div style={{ fontSize: 13, fontWeight: 800, color: colors.textPrimary }}>
                  PinIT Vault App Required
                </div>
                <div style={{ fontSize: 11.5, color: colors.textMuted, maxWidth: 280 }}>
                  QR login requires the PinIT Vault mobile app to scan and approve the challenge on a second device.
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  style={{
                    marginTop: 8,
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: isDark ? 'rgba(56, 189, 248, 0.15)' : '#38bdf8',
                    color: isDark ? '#38bdf8' : '#000000',
                    border: 'none',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  🔑 Sign In / Sign Up With Credentials Instead
                </button>
              </div>
            </div>
          )}

          {/* VIEW B: Standard Credentials & College ID Scanner (Screenshot 1 & Mockups) */}
          {activeTab === 'form' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {error && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#ef4444',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Demo Role Presets Bar (from screenshot 1) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexWrap: 'wrap',
                  padding: '6px 8px',
                  borderRadius: 8,
                  background: isDark ? 'rgba(255,255,255,0.02)' : '#f1f5f9',
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                <span style={{ fontSize: 10.5, fontWeight: 800, color: colors.textMuted }}>Demo Presets:</span>
                <button
                  type="button"
                  onClick={() => applyPreset('student')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: 4,
                    background: isDark ? '#1e293b' : '#ffffff',
                    border: `1px solid ${colors.cardBorder}`,
                    color: colors.textPrimary,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('faculty')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: 4,
                    background: isDark ? '#1e293b' : '#ffffff',
                    border: `1px solid ${colors.cardBorder}`,
                    color: colors.textPrimary,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  👔 Faculty
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('recruiter')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: 4,
                    background: isDark ? '#1e293b' : '#ffffff',
                    border: `1px solid ${colors.cardBorder}`,
                    color: colors.textPrimary,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  💼 Recruiter
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('admin')}
                  style={{
                    padding: '3px 7px',
                    borderRadius: 4,
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ⚡ Admin (Instant)
                </button>
              </div>

              {/* Form Input 1: Email / Username */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 700, color: colors.textSecondary }}>
                Email / Roll Number / Username
                <input
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="e.g. vinay@campus.edu or 22BCA726"
                  autoComplete="username"
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    color: colors.textPrimary,
                    fontSize: 13.5,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </label>

              {/* Form Input 2: Display Name */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 700, color: colors.textSecondary }}>
                Student Full Name
                <input
                  value={form.displayName}
                  onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                  placeholder="e.g. Vinay N"
                  autoComplete="name"
                  required
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    color: colors.textPrimary,
                    fontSize: 13.5,
                    outline: 'none',
                  }}
                />
              </label>

              {/* Form Input 3: Password with Show/Hide Toggle */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 700, color: colors.textSecondary }}>
                Password
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 42px 10px 14px',
                      borderRadius: 10,
                      background: colors.inputBg,
                      border: `1px solid ${colors.inputBorder}`,
                      color: colors.textPrimary,
                      fontSize: 13.5,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: colors.textMuted,
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
              </label>

              {/* 🪪 College ID Scanner Integration with Option 2 + Groq Hybrid */}
              <div style={{ marginTop: 2 }}>
                <CollegeIdScanner
                  displayName={form.displayName}
                  username={form.username}
                  onIdGenerated={handleIdGenerated}
                  onNameExtracted={handleNameExtracted}
                  onStoragePathExtracted={setUploadedCardStoragePath}
                />
              </div>

              {/* CTA Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: 6,
                  padding: '12px 18px',
                  borderRadius: 10,
                  border: 'none',
                  background: isDark
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                  color: '#000000',
                  fontSize: 14,
                  fontWeight: 900,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: isDark
                    ? '0 0 20px -3px rgba(16, 185, 129, 0.45)'
                    : '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                {loading ? 'Creating student profile...' : 'Sign Up for Career OS →'}
              </button>

              {/* Footer Switcher */}
              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 13, color: colors.textMuted }}>Already have an account? </span>
                <Link
                  href="/login"
                  style={{
                    fontSize: 13,
                    color: isDark ? colors.accentGreen : colors.accentIndigo,
                    fontWeight: 800,
                    textDecoration: 'none',
                  }}
                >
                  Sign in &rarr;
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
