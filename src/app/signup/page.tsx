'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import CollegeIdScanner from '@/components/auth/CollegeIdScanner';
import { CollegeMetadata } from '@/lib/utils/pinitIdGenerator';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  // ─── Theme State: 'dark' (Minimalist Precision) vs 'light' (Modern Clean SaaS) ───
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

  // ─── Form State ───
  const [form, setForm] = useState({ username: '', displayName: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [pinitId, setPinitId] = useState('PIN-BGS-BCA-726');
  const [idMode, setIdMode] = useState<'college' | 'global'>('college');
  const [collegeMeta, setCollegeMeta] = useState<CollegeMetadata | undefined>();
  const [uploadedCardFile, setUploadedCardFile] = useState<File | null>(null);
  const [uploadedCardStoragePath, setUploadedCardStoragePath] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ─── Active View Tab: 'form' vs 'vault' (from Screenshot 1 & 2) ───
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

  // ─── Quick Demo Presets (from Screenshot 1) ───
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

  // ─── Instant Launch Student Demo (from Screenshot 1) ───
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

  // ─── Developer Mode Test Onboarding (from Screenshot 2) ───
  const handleTestOnboarding = () => {
    const testId = `PIN-TEST-${Math.floor(100 + Math.random() * 900)}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinit_student_id', testId);
    }
    router.push('/onboarding');
  };

  // ─── Registration submission ───
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

  // ─── Theme Tokens & Colors ───
  const isDark = theme === 'dark';
  const colors = {
    pageBg: isDark ? '#121316' : '#f8fafc',
    gridColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
    cardBg: isDark ? '#14171d' : '#ffffff',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
    textPrimary: isDark ? '#f8fafc' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#475569',
    textMuted: isDark ? '#64748b' : '#94a3b8',
    inputBg: isDark ? '#0d0f14' : '#ffffff',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.12)' : '#e2e8f0',
    accentGreen: '#10b981',
    accentIndigo: '#4f46e5',
  };

  const activeIdString = pinitId || 'PIN-BGS-BCA-726';
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
        padding: '36px 20px',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        backgroundImage: isDark
          ? `linear-gradient(${colors.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${colors.gridColor} 1px, transparent 1px), radial-gradient(circle at 20% 25%, rgba(16, 185, 129, 0.07), transparent 45%), radial-gradient(circle at 85% 75%, rgba(6, 182, 212, 0.05), transparent 50%)`
          : `linear-gradient(${colors.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${colors.gridColor} 1px, transparent 1px), radial-gradient(circle at 15% 20%, rgba(79, 70, 229, 0.06), transparent 50%), radial-gradient(circle at 85% 85%, rgba(16, 185, 129, 0.05), transparent 50%)`,
        backgroundSize: '32px 32px, 32px 32px, 100% 100%, 100% 100%',
        transition: 'background-color 0.25s ease, color 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Laser HUD Border Accents (Dark Mode Only) */}
      {isDark && (
        <>
          <div style={{ position: 'fixed', top: 16, left: 16, width: 20, height: 20, borderTop: '2px solid rgba(16,185,129,0.4)', borderLeft: '2px solid rgba(16,185,129,0.4)', pointerEvents: 'none' }} />
          <div style={{ position: 'fixed', top: 16, right: 16, width: 20, height: 20, borderTop: '2px solid rgba(16,185,129,0.4)', borderRight: '2px solid rgba(16,185,129,0.4)', pointerEvents: 'none' }} />
          <div style={{ position: 'fixed', bottom: 16, left: 16, width: 20, height: 20, borderBottom: '2px solid rgba(16,185,129,0.4)', borderLeft: '2px solid rgba(16,185,129,0.4)', pointerEvents: 'none' }} />
          <div style={{ position: 'fixed', bottom: 16, right: 16, width: 20, height: 20, borderBottom: '2px solid rgba(16,185,129,0.4)', borderRight: '2px solid rgba(16,185,129,0.4)', pointerEvents: 'none' }} />
        </>
      )}

      <div
        style={{
          width: '100%',
          maxWidth: 1220,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: 44,
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {/* ═════════════════════════════════════════════════════════════════
            LEFT COLUMN (50%): High-Tech Visual Hero Lockup
            Dark Mode: Holographic Student ID + Fine-Line Telemetry
            Light Mode: Modern Clean SaaS 3D Stack + Upward Career Vector
            ═════════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, padding: '10px' }}>
          
          {/* Header Row: Brand Lockup & Theme Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Brand Logo & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {isDark ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="lp-brand-lockup" style={{ height: 38, padding: '2px 4px' }}>
                    <Image
                      src="/brand/pinit-career-logo-clear.png"
                      alt="PINIT CAREER"
                      width={150}
                      height={36}
                      className="lp-brand-logo"
                      style={{ height: 36, width: 'auto', objectFit: 'contain' }}
                      priority
                    />
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    OS v2.4
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: 20,
                      boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
                    }}
                  >
                    P
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
                    PinIT Career OS
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Theme Switcher (Dark Mode / Light Mode) */}
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
                  padding: '5px 12px',
                  borderRadius: 16,
                  border: 'none',
                  background: isDark ? '#1e293b' : 'transparent',
                  color: isDark ? '#10b981' : '#64748b',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <span>🌙</span> Dark
              </button>
              <button
                type="button"
                onClick={() => toggleTheme('light')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 16,
                  border: 'none',
                  background: !isDark ? '#ffffff' : 'transparent',
                  color: !isDark ? '#4f46e5' : '#64748b',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: !isDark ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <span>☀️</span> Light
              </button>
            </div>
          </div>

          {/* ─── CARD VARIANT: DARK MODE (Holographic Minimalist Precision) ─── */}
          {isDark ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Floating Holographic Card with Neon Border & Glow */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: 16,
                  padding: '24px 26px',
                  background: 'rgba(16, 20, 26, 0.88)',
                  border: '1.5px solid #10b981',
                  boxShadow: '0 0 30px -4px rgba(16, 185, 129, 0.35), inset 0 0 15px rgba(16, 185, 129, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* Circuit Grid Holographic Accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 140,
                    height: 140,
                    backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.18) 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                    pointerEvents: 'none',
                  }}
                />

                {/* Top Row: Student ID + Microchip Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>
                    Student ID
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#10b981', fontFamily: 'monospace' }}>
                      PinIT
                    </span>
                    {/* Microchip SVG */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.6">
                      <rect x="5" y="5" width="14" height="14" rx="2" />
                      <rect x="9" y="9" width="6" height="6" fill="#10b981" fillOpacity="0.2" />
                      <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
                    </svg>
                  </div>
                </div>

                {/* Center: Bright Glowing PinIT ID */}
                <div>
                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                      fontFamily: 'var(--font-mono, monospace)',
                      color: '#ffffff',
                      textShadow: '0 0 12px rgba(16, 185, 129, 0.65)',
                      letterSpacing: '1px',
                    }}
                  >
                    {activeIdString}
                  </div>
                </div>

                {/* Bottom Row: Verified Badge & Fingerprint Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    <span>✔</span> Verified Campus Linked
                  </div>

                  {/* Fingerprint SVG Icon */}
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5">
                    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                    <path d="M2 16h.01M22 16h.01" />
                    <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                    <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
                    <path d="M5.5 13A6 6 0 0 1 12 7" />
                    <path d="M8.6 19.5c.4.3.9.5 1.4.5a3 3 0 0 0 3-3" />
                  </svg>
                </div>
              </div>

              {/* High-Tech Typography & Telemetry */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h1
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    letterSpacing: '-0.8px',
                    color: '#ffffff',
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  PinIT Career OS
                </h1>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.5, maxWidth: 440 }}>
                  Fine-line career progression metrics for future deployment typography.
                </p>
              </div>

              {/* Telemetry Sparkline & Multi-Metric HUD */}
              <div
                style={{
                  borderRadius: 14,
                  padding: '16px 18px',
                  background: 'rgba(18, 22, 28, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Metric Indicators */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                  <span>Career Progression</span>
                  <span style={{ color: '#94a3b8' }}>18% College Student</span>
                  <span style={{ color: '#94a3b8' }}>50% Parent</span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>+8.931 60.20%</span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>+29.58%</span>
                </div>

                {/* Glowing Sparkline Chart */}
                <div style={{ position: 'relative', height: 48, width: '100%' }}>
                  <svg width="100%" height="48" viewBox="0 0 380 48" fill="none" preserveAspectRatio="none">
                    {/* Background Grid Lines */}
                    <line x1="0" y1="12" x2="380" y2="12" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="0" y1="24" x2="380" y2="24" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <line x1="0" y1="36" x2="380" y2="36" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    {/* Telemetry Green Path */}
                    <path
                      d="M0,42 Q30,38 60,34 T120,40 T180,24 T240,32 T300,16 T350,22 T380,8"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    {/* Gradient Glow Beneath */}
                    <path
                      d="M0,42 Q30,38 60,34 T120,40 T180,24 T240,32 T300,16 T350,22 T380,8 L380,48 L0,48 Z"
                      fill="url(#neonGreenGlow)"
                      opacity="0.25"
                    />
                    <defs>
                      <linearGradient id="neonGreenGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            /* ─── CARD VARIANT: LIGHT MODE (Modern Clean SaaS 3D Stack) ─── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Stacked 3D Card with Apple/Stripe-Grade Elevation */}
              <div style={{ position: 'relative', width: '100%', maxWidth: 440, margin: '10px 0' }}>
                {/* Layer 3 (Lowest Shadow Card) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 14,
                    right: 14,
                    height: '100%',
                    background: '#f1f5f9',
                    borderRadius: 20,
                    border: '1px solid #e2e8f0',
                    zIndex: 1,
                  }}
                />
                {/* Layer 2 (Middle Offset Card) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    right: 8,
                    height: '100%',
                    background: '#f8fafc',
                    borderRadius: 20,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    zIndex: 2,
                  }}
                />
                {/* Layer 1 (Top Hero Card) */}
                <div
                  style={{
                    position: 'relative',
                    background: '#ffffff',
                    borderRadius: 20,
                    padding: '28px 28px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px -15px rgba(79, 70, 229, 0.12), 0 8px 16px -6px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    zIndex: 3,
                  }}
                >
                  {/* PinIT ID Header */}
                  <div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 900,
                        fontFamily: 'var(--font-mono, monospace)',
                        color: '#0f172a',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {activeIdString}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 12px',
                          borderRadius: 20,
                          background: '#d1fae5',
                          color: '#065f46',
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        <span style={{ color: '#059669' }}>✔</span> Verified Campus Linked
                      </span>
                    </div>
                  </div>

                  {/* Career Progression Label & Ascending Arrow Vector Chart */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
                      Career progression
                    </div>

                    <div style={{ position: 'relative', height: 90, width: '100%' }}>
                      <svg width="100%" height="90" viewBox="0 0 340 90" fill="none" preserveAspectRatio="none">
                        {/* Blue Vector Line */}
                        <path
                          d="M10,80 L80,65 L130,75 L200,45 L250,55 L320,15"
                          stroke="#3b82f6"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Arrowhead Marker */}
                        <polygon points="320,8 335,16 324,28 322,20" fill="#3b82f6" />
                        {/* Soft Gradient Fill Beneath */}
                        <path
                          d="M10,80 L80,65 L130,75 L200,45 L250,55 L320,15 L320,90 L10,90 Z"
                          fill="url(#blueProgressionGlow)"
                          opacity="0.12"
                        />
                        <defs>
                          <linearGradient id="blueProgressionGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtitle description */}
              <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Unified institutional identity, automated credential OCR, and AI career acceleration for universities and students.
              </p>
            </div>
          )}

          {/* Quick Demo Cadet Launcher Button (Preserved from Screenshot 1) */}
          <button
            type="button"
            onClick={handleLaunchStudentDemo}
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              background: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.08)',
              border: isDark ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1.5px solid rgba(16, 185, 129, 0.35)',
              color: '#10b981',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
              <span style={{ fontSize: 20 }}>🚀</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900 }}>Launch Student Demo (Vinay — Cadet)</div>
                <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                  Instant evaluation access: preloaded student profile (Vinay), 85% attendance, Socratic radar & ₹6.5-12 LPA benchmark.
                </div>
              </div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 900 }}>&rarr;</span>
          </button>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            RIGHT COLUMN (50%): Sign-In / Sign-Up Form & Live Scanner Dock
            Matching Mockup 3 (Dark HUD) & Mockup 4 (Light SaaS)
            ═════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 22,
            padding: '28px 28px',
            boxShadow: isDark
              ? '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Top Multi-Tab Navigation (Preserved from Screenshot 1 & 2) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 6,
              padding: '4px',
              background: isDark ? '#0c0e12' : '#f1f5f9',
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
                background: activeTab === 'form' ? (isDark ? '#222630' : '#ffffff') : 'transparent',
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
                background: activeTab === 'vault' ? (isDark ? '#222630' : '#ffffff') : 'transparent',
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

          {/* ─── VIEW A: PinIT Vault QR Mode (Preserved from Screenshot 2) ─── */}
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

              {/* Developer Mode Onboarding Button (from Screenshot 2) */}
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

          {/* ─── VIEW B: Credentials & College ID Scanner (Matching Mockups 3 & 4) ─── */}
          {activeTab === 'form' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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

              {/* Demo Role Presets Bar (Preserved from Screenshot 1) */}
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

              {/* 🪪 College ID Scanner Integration with Dual Dark/Light Mode Theme */}
              <div style={{ marginTop: 2 }}>
                <CollegeIdScanner
                  displayName={form.displayName}
                  username={form.username}
                  onIdGenerated={handleIdGenerated}
                  onNameExtracted={handleNameExtracted}
                  onStoragePathExtracted={setUploadedCardStoragePath}
                  theme={theme}
                />
              </div>

              {/* Form Input 1: Email / Roll Number / Username */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 700, color: colors.textSecondary }}>
                Student ID or Campus Email
                <input
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="e.g. vinay@campus.edu or PIN-BGS-BCA-726"
                  autoComplete="username"
                  required
                  style={{
                    padding: '11px 16px',
                    borderRadius: 12,
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    color: colors.textPrimary,
                    fontSize: 13.5,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </label>

              {/* Form Input 2: Full Display Name */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 700, color: colors.textSecondary }}>
                Student Full Name
                <input
                  value={form.displayName}
                  onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                  placeholder="e.g. Vinay N"
                  autoComplete="name"
                  required
                  style={{
                    padding: '11px 16px',
                    borderRadius: 12,
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    color: colors.textPrimary,
                    fontSize: 13.5,
                    outline: 'none',
                  }}
                />
              </label>

              {/* Form Input 3: Password with Eye Toggle */}
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
                      padding: '11px 44px 11px 16px',
                      borderRadius: 12,
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
                      right: 14,
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

              {/* CTA Submit Button (Glowing Neon Emerald Pill) */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: 6,
                  padding: '13px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: isDark
                    ? '#00e58d'
                    : '#059669',
                  color: isDark ? '#000000' : '#ffffff',
                  fontSize: 14,
                  fontWeight: 900,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: isDark
                    ? '0 0 25px rgba(0, 229, 141, 0.45)'
                    : '0 4px 14px rgba(5, 150, 105, 0.3)',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.2px',
                }}
              >
                {loading ? 'Creating student profile...' : 'Sign In to Career OS'}
              </button>

              {/* Footer Switcher */}
              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 13, color: colors.textMuted }}>Already have an account? </span>
                <Link
                  href="/login"
                  style={{
                    fontSize: 13,
                    color: isDark ? '#10b981' : '#4f46e5',
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
