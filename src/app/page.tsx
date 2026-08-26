'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { isDemoAuthEnabled, DEMO_PASSWORD } from '@/lib/demoAuth';
import { supabase } from '@/lib/supabaseClient';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/landing/PublicFooter';
import DynamicSkyCanvas from '@/components/effects/DynamicSkyCanvas';
import AmbientAudioToggle from '@/components/effects/AmbientAudioToggle';
import { ambientAudio } from '@/lib/audio/ambientAudioEngine';
import '@/styles/landing.css';

function getRedirectPath(email: string | null | undefined, role: string | null | undefined): string {
  const emailLower = email?.toLowerCase() || '';
  const roleLower = role?.toLowerCase() || '';
  if (emailLower === 'admin@pinit.in' || roleLower === 'admin' || roleLower === 'superadmin') return '/admin';
  if (roleLower === 'teacher' || roleLower === 'faculty') return '/admin/teacher';
  if (emailLower === 'rec@pinit.in' || roleLower === 'recruiter') return '/recruiter';
  if (emailLower === 'con@pinit.in' || roleLower === 'consultant') return '/consultant';
  if (roleLower === 'parent') return '/parent';
  return '/dashboard';
}

type LoginMode = 'password' | 'qr';
type QRStatus = 'loading' | 'ready' | 'scanned' | 'confirmed' | 'expired';

function LoginModal({ 
  onClose, 
  preselectRole, 
  loginFn 
}: { 
  onClose: () => void; 
  preselectRole: 'student' | 'teacher' | 'admin' | 'recruiter' | 'consultant' | 'parent' | null;
  loginFn: (username: string, password: string) => Promise<any>;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>('password');
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrStatus, setQrStatus] = useState<QRStatus>('loading');
  const [timeLeft, setTimeLeft] = useState(300);
  const [qrMessage, setQrMessage] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [isLocalSimulation, setIsLocalSimulation] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const pwd = isDemoAuthEnabled() ? DEMO_PASSWORD : '';
    if (preselectRole === 'student') setForm({ username: 'student@pinit.in', password: pwd });
    else if (preselectRole === 'teacher') setForm({ username: 'teacher@pinit.in', password: pwd });
    else if (preselectRole === 'admin') setForm({ username: 'admin@pinit.in', password: pwd });
    else if (preselectRole === 'recruiter') setForm({ username: 'rec@pinit.in', password: pwd });
    else if (preselectRole === 'consultant') setForm({ username: 'con@pinit.in', password: pwd });
    else if (preselectRole === 'parent') setForm({ username: 'parent@pinit.in', password: pwd });
  }, [preselectRole]);

  const createQRSession = useCallback(async () => {
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    setQrStatus('loading'); setTimeLeft(300); setQrToken(null); setQrUrl(null); setQrMessage(''); setIsLocalSimulation(false);
    try {
      const { data, error: err } = await supabase.from('qr_login_sessions').insert({ status: 'ready', expires_at: new Date(Date.now() + 300 * 1000).toISOString() }).select().single();
      if (err) throw err;
      const token = data.id;
      setQrToken(token);
      const phoneUrl = `${window.location.origin}/qr-confirm?token=${token}`;
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(phoneUrl)}&bgcolor=ffffff&color=2563eb&margin=10&format=svg`);
      setQrStatus('ready');
      const channel = supabase.channel(`qr-login-${token}`).on('postgres_changes', { event: '*', schema: 'public', table: 'qr_login_sessions', filter: `id=eq.${token}` }, async (payload) => {
        const row = payload.new as any;
        if (!row) return;
        if (row.status === 'scanned') { setQrStatus('scanned'); setQrMessage('Phone scanned — verifying biometrics...'); }
        else if (row.status === 'confirmed') {
          setQrStatus('confirmed'); setQrMessage('Biometrics Confirmed! Logging in...');
          try {
            if (row.access_token && row.refresh_token) {
              await supabase.auth.setSession({ access_token: row.access_token, refresh_token: row.refresh_token });
              const { data: { user: authedUser } } = await supabase.auth.getUser();
              if (!authedUser) throw new Error('Auth session sync failed');
              await supabase.from('qr_login_sessions').delete().eq('id', token);
              router.push(getRedirectPath(authedUser.email, authedUser.user_metadata?.role || 'student'));
            } else if (row.email && row.password) {
              const appUser = await loginFn(row.email, row.password);
              await supabase.from('qr_login_sessions').delete().eq('id', token);
              router.push(getRedirectPath(appUser?.email, appUser?.role));
            }
          } catch (authErr: any) { setQrStatus('expired'); setQrMessage('Authentication failed: ' + authErr.message); }
        } else if (row.status === 'expired') { setQrStatus('expired'); setQrMessage('Session expired.'); }
      }).subscribe();
      unsubRef.current = () => { supabase.removeChannel(channel); };
    } catch {
      const mockToken = 'mock-sim-' + Math.random().toString(36).substring(2, 11);
      setQrToken(mockToken); setIsLocalSimulation(true);
      const phoneUrl = `${window.location.origin}/qr-confirm?token=${mockToken}`;
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(phoneUrl)}&bgcolor=ffffff&color=2563eb&margin=10&format=svg`);
      setQrStatus('ready'); setQrMessage('Local simulator mode (Offline Broker)');
      localStorage.setItem(`qr_session_${mockToken}`, JSON.stringify({ status: 'ready', createdAt: Date.now(), expiresAt: Date.now() + 300 * 1000 }));
    }
  }, [loginFn, router]);

  useEffect(() => { if (mode === 'qr') createQRSession(); return () => { if (unsubRef.current) unsubRef.current(); }; }, [mode, createQRSession]);
  useEffect(() => { if (mode !== 'qr' || (qrStatus !== 'ready' && qrStatus !== 'scanned')) return; const t = setInterval(() => { setTimeLeft(l => { if (l <= 1) { setQrStatus('expired'); clearInterval(t); return 0; } return l - 1; }); }, 1000); return () => clearInterval(t); }, [mode, qrStatus]);
  useEffect(() => { if (!qrToken || !isLocalSimulation) return; const interval = setInterval(async () => { const valStr = localStorage.getItem(`qr_session_${qrToken}`); if (!valStr) return; try { const val = JSON.parse(valStr); if (val.status === 'scanned' && qrStatus === 'ready') { setQrStatus('scanned'); setQrMessage('Phone scanned — verifying biometrics...'); } else if (val.status === 'confirmed' && qrStatus !== 'confirmed') { if (val.email && val.password) { setQrStatus('confirmed'); setQrMessage('Biometrics Confirmed! Logging in...'); const appUser = await loginFn(val.email, val.password); localStorage.removeItem(`qr_session_${qrToken}`); clearInterval(interval); router.push(getRedirectPath(appUser?.email, appUser?.role)); } } } catch {} }, 1000); return () => clearInterval(interval); }, [qrToken, isLocalSimulation, qrStatus, loginFn, router]);

  const handleSimulateMobileScan = () => {
    if (!qrToken) return;
    setSimulating(true); setQrStatus('scanned'); setQrMessage('Biometric scanner active on mobile phone...');
    const email = form.username || 'student@pinit.in';
    const pwd = form.password || (isDemoAuthEnabled() ? DEMO_PASSWORD : '');
    setTimeout(async () => {
      if (isLocalSimulation) {
        localStorage.setItem(`qr_session_${qrToken}`, JSON.stringify({ status: 'confirmed', email, password: pwd }));
        setQrStatus('confirmed');
        const appUser = await loginFn(email, pwd);
        localStorage.removeItem(`qr_session_${qrToken}`);
        router.push(getRedirectPath(appUser?.email, appUser?.role));
      } else {
        await supabase.from('qr_login_sessions').update({ status: 'confirmed', email, password: pwd }).eq('id', qrToken);
      }
      setSimulating(false);
    }, 1200);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try { const appUser = await loginFn(form.username, form.password); router.push(getRedirectPath(appUser?.email, appUser?.role)); }
    catch (err: any) { setError(err?.message || 'Invalid username or password.'); }
    finally { setLoading(false); }
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="modal-mask-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-body-container">
        <button onClick={onClose} className="modal-dismiss-btn">✕</button>
        <h2 className="modal-header-title">Sign In</h2>
        <p className="modal-header-desc">Log in to access your dashboard workspace</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 10, marginBottom: 20 }}>
          {['password', 'qr'].map(m => (
            <button key={m} onClick={() => setMode(m as any)} style={{ padding: '8px 10px', borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', border: 'none', background: mode === m ? 'var(--card)' : 'transparent', color: mode === m ? 'var(--t1)' : 'var(--t2)', boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.06)' : 'none', transition: 'all 0.2s' }}>
              {m === 'password' ? 'Password' : 'Scan QR'}
            </button>
          ))}
        </div>
        {mode === 'password' ? (
          <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="input-group-vertical">
              <label className="input-label">Username / Email</label>
              <input type="text" value={form.username} onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))} className="input-textbox" placeholder="admin@pinit.in" required />
            </div>
            <div className="input-group-vertical">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Password</label>
                <Link href="/reset-password" style={{ fontSize: 11, color: '#7C3AED', textDecoration: 'none', fontWeight: 600 }}>Forgot?</Link>
              </div>
              <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} className="input-textbox" placeholder="••••••••" required />
            </div>
            {isDemoAuthEnabled() && (
            <div className="demo-shortcuts-box">
              <div className="demo-shortcuts-title">Quick Demo Shortcuts</div>
              <div className="demo-buttons-layout">
                {[{ label: 'Admin', email: 'admin@pinit.in' }, { label: 'Teacher', email: 'teacher@pinit.in' }, { label: 'Recruiter', email: 'rec@pinit.in' }, { label: 'Consultant', email: 'con@pinit.in' }, { label: 'Parent', email: 'parent@pinit.in' }, { label: 'Student', email: 'student@pinit.in' }].map(demo => (
                  <button key={demo.label} type="button" onClick={() => setForm({ username: demo.email, password: DEMO_PASSWORD })} className="demo-pill-btn">{demo.label}</button>
                ))}
              </div>
            </div>
            )}
            {error && <div className="error-alert-banner">⚠️ {error}</div>}
            <button type="submit" className="pc-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In →'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 180, height: 180, margin: '0 auto 16px', border: '1.5px solid var(--border)', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg3)' }}>
              {qrStatus === 'loading' ? <div style={{ fontSize: 12, color: 'var(--t2)' }}>Generating QR...</div> : qrUrl ? <img src={qrUrl} alt="QR Code" style={{ width: '100%', height: '100%' }} /> : null}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--t2)', fontFamily: 'monospace', marginBottom: 16 }}>
              {qrStatus === 'ready' && `Scan with phone · Expiring: ${minutes}:${secs}`}
              {qrStatus !== 'ready' && qrMessage}
            </div>
            {(qrStatus === 'ready' || qrStatus === 'scanned') && (
              <button type="button" onClick={handleSimulateMobileScan} disabled={simulating} className="pc-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                📱 Simulate Biometrics Scan
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LandingContent() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // 60fps Hardware Accelerated Direct DOM Transform (Option 3 Orbital Stage)
  const onStageMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const rx = (py * -14).toFixed(2);
    const ry = (px * 16).toFixed(2);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${rx}deg`);
      el.style.setProperty('--ry', `${ry}deg`);
    });
  }, []);

  const onStageLeave = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `0deg`);
      el.style.setProperty('--ry', `0deg`);
    });
  }, []);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeAudienceTab, setActiveAudienceTab] = useState<'students' | 'universities' | 'recruiters'>('students');
  const [themeState, setThemeState] = useState<{ theme: 'dark' | 'light'; lastToggleTime: number }>({
    theme: 'light',
    lastToggleTime: 0
  });
  const { login } = useAuth();

  useEffect(() => {
    const saved = (localStorage.getItem('pc_theme') as 'dark' | 'light') || 'light';
    setThemeState(prev => ({ ...prev, theme: saved }));

    const handleThemeToggle = (e: any) => {
      if (e.detail) {
        setThemeState({
          theme: e.detail.theme,
          lastToggleTime: e.detail.time
        });
        ambientAudio.play(e.detail.theme, 3000);
      }
    };
    window.addEventListener('pc_theme_toggled', handleThemeToggle);
    return () => window.removeEventListener('pc_theme_toggled', handleThemeToggle);
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="landing-page" style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* BACKGROUND METEOR / SUNLIGHT DYNAMIC SKY ENGINE */}
      <DynamicSkyCanvas theme={themeState.theme} lastToggleTime={themeState.lastToggleTime} />

      {/* FLOATING AMBIENT AUDIO CONTROLLER */}
      <AmbientAudioToggle />

      {/* 1. UNIVERSAL SHARED NAVBAR */}
      <PublicNavbar onLoginClick={handleLoginClick} />

      <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
        {/* 2. HERO COCKPIT */}
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-left">
              <div className="badge-pill">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 10px #10B981' }}></span>
                <span>36 Tracks Live · 330+ Test Assertions</span>
              </div>
              
              <h1 className="hero-title">
                We don&apos;t help students find jobs.<br />
                We help them <span className="text-gradient">discover who they are.</span>
              </h1>
              
              <p className="hero-subtitle">
                PinitCareer is an AI-powered career intelligence platform that understands every student&apos;s unique strength, interests, personality, skills, and potential — before they ever submit a resume.
              </p>
              
              <div className="hero-ctas">
                <button type="button" className="pc-btn-primary" onClick={handleLoginClick}>Start free</button>
                <Link href="/problem" className="pc-btn-outline">
                  Why we exist →
                </Link>
              </div>

              <ol className="hero-path">
                <li><span>01</span> Know yourself</li>
                <li><span>02</span> Build yourself</li>
                <li><span>03</span> Prove yourself</li>
                <li><span>04</span> Grow without limits</li>
              </ol>

              <div className="trust-section">
                <p className="trust-text">The future doesn&apos;t belong to people with degrees. It belongs to people who know where they fit.</p>
              </div>
            </div>

            {/* HERO RIGHT: OPTION 3 3D STAGE & SLEEK ORBITAL SATELLITE NODES */}
            <div className="hero-right">
              <div
                ref={stageRef}
                className="lp-stage"
                onMouseMove={onStageMove}
                onMouseLeave={onStageLeave}
              >
                <div className="lp-halo" aria-hidden />
                <div className="lp-rig">
                  <div className="lp-floor" aria-hidden />
                  <div className="lp-ring" aria-hidden />
                  <div className="lp-ring lp-ring-soft" aria-hidden />
                  
                  {/* UNOBSTRUCTED CENTRAL METALLIC LOGO (CLICK FOR SHOCKWAVE) */}
                  <div
                    className="lp-logo"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = rect.left + rect.width / 2;
                      const y = rect.top + rect.height / 2;
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('pc_sky_shockwave', { detail: { x, y } }));
                      }
                    }}
                    title="Click to trigger kinetic pulse"
                  >
                    <div className="lp-badge-official">
                      <img src="/brand/pinit-career-logo-clear.png" alt="PINIT CAREER" />
                    </div>
                  </div>

                  {/* 4 SLEEK ORBITAL SATELLITE PILLS WITH EXPANDABLE TOOLTIPS */}
                  <ul className="lp-terms">
                    <li>
                      <em>01</em> 🧬 Know yourself
                      <div className="lp-node-tooltip">
                        <span className="lp-node-tooltip-title">Phase 01 · Career DNA</span>
                        <p className="lp-node-tooltip-desc">
                          11-Signal Cognitive Analysis measuring strengths, learning agility, and potential before writing a resume.
                        </p>
                      </div>
                    </li>
                    <li>
                      <em>02</em> ⚡ Build yourself
                      <div className="lp-node-tooltip">
                        <span className="lp-node-tooltip-title">Phase 02 · S-Curve Roadmaps</span>
                        <p className="lp-node-tooltip-desc">
                          36 live career tracks with 24/7 Voice AI tutoring and empathetic 3-step recovery coaching.
                        </p>
                      </div>
                    </li>
                    <li>
                      <em>03</em> 🛡️ Prove yourself
                      <div className="lp-node-tooltip">
                        <span className="lp-node-tooltip-title">Phase 03 · Proof Vault</span>
                        <p className="lp-node-tooltip-desc">
                          Direct GitHub commit verification and SHA-256 tamper-proof cryptographic skill credentials.
                        </p>
                      </div>
                    </li>
                    <li>
                      <em>04</em> 🚀 Grow
                      <div className="lp-node-tooltip">
                        <span className="lp-node-tooltip-title">Phase 04 · Recruiter Match</span>
                        <p className="lp-node-tooltip-desc">
                          95%+ AI match precision connecting verified student profiles directly to enterprise hiring partners.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRAND PROMISE MARQUEE */}
        <section className="brief-manifesta" aria-label="Brand promise">
          <div className="container brief-manifesta-row">
            <span>Discover</span>
            <i className="brief-dot" aria-hidden />
            <span>Connect</span>
            <i className="brief-dot" aria-hidden />
            <span>Grow</span>
          </div>
        </section>

        {/* 3. THE PROBLEM TEASER */}
        <section id="the-problem" className="brief-problem section-padding">
          <div className="container brief-problem-grid">
            <div>
              <div className="badge-pill">The structural crisis</div>
              <h2>Every year, millions of students graduate. Thousands of resumes look identical.</h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, marginTop: 12 }}>
                Most students don&apos;t know what career suits them, what skills companies need, or how to stand out. 95% of PDF resumes are filtered by automated ATS parsers before a human ever looks at them.
              </p>
              <div style={{ marginTop: 24 }}>
                <Link href="/problem" className="pc-btn-primary btn-sm">
                  Read The Full Problem Analysis →
                </Link>
              </div>
            </div>
            <ul className="brief-problem-list">
              <li>Don&apos;t know what career suits them</li>
              <li>Don&apos;t know what skills companies need</li>
              <li>Don&apos;t know how to stand out</li>
            </ul>
          </div>
          <div className="container" style={{ marginTop: 48 }}>
            <h3 style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Education has changed. Career guidance hasn&apos;t.</h3>
            <div className="brief-worlds-row">
              <article>
                <strong>Schools</strong>
                <span>teach subjects</span>
              </article>
              <article>
                <strong>Universities</strong>
                <span>teach degrees</span>
              </article>
              <article>
                <strong>Recruiters</strong>
                <span>hire skills</span>
              </article>
            </div>
            <p className="brief-worlds-end">No one connects these three worlds. Until now.</p>
          </div>
        </section>

        {/* 4. CAREER IDENTITY TEASER */}
        <section id="career-identity" className="brief-identity section-padding alt-bg">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
              <div>
                <div className="badge-pill">Career identity</div>
                <h2 className="section-title-lg">Every student has identity. Not just marks.</h2>
              </div>
              <Link href="/identity" className="pc-btn-outline btn-sm">
                Explore Career DNA &amp; Passports →
              </Link>
            </div>
            <p className="brief-identity-lead">
              PinitCareer analyzes personality, communication, technical skills, learning behavior, interests, problem solving, leadership, creativity, portfolio, experience, and career goals.
            </p>
            <ul className="brief-signals">
              {['Personality', 'Communication', 'Technical skills', 'Learning behavior', 'Interests', 'Problem solving', 'Leadership', 'Creativity', 'Portfolio', 'Experience', 'Career goals'].map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. WHO IT'S FOR & THREE WORLDS PORTAL */}
        <section id="audiences" className="brief-audiences section-padding">
          <div className="container">
            <div className="text-center" style={{ marginBottom: 32 }}>
              <div className="badge-pill" style={{ margin: '0 auto 12px' }}>Who it&apos;s for</div>
              <h2 className="section-title-lg">One platform. Three worlds, finally connected.</h2>
            </div>
            
            <div className="brief-audience-grid" style={{ marginBottom: 36 }}>
              <article>
                <h3>For students</h3>
                <ul>
                  <li>Discover your strengths</li>
                  <li>Build real skills with AI mentor</li>
                  <li>Tamper-proof skill passports</li>
                </ul>
              </article>
              <article>
                <h3>For universities</h3>
                <ul>
                  <li>Measure cohort employability</li>
                  <li>1-Click NAAC &amp; NIRF exports</li>
                  <li>Automate campus placement drives</li>
                </ul>
              </article>
              <article>
                <h3>For recruiters</h3>
                <ul>
                  <li>Discover pre-assessed verified talent</li>
                  <li>95%+ AI Match Score precision</li>
                  <li>Zero resume keyword fatigue</li>
                </ul>
              </article>
            </div>

            {/* Interactive Persona Deep-Dive Tabs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {[
                  { id: 'students', label: '🎓 For 100,000+ Students' },
                  { id: 'universities', label: '🏛️ For Colleges & Placement Cells' },
                  { id: 'recruiters', label: '💼 For Enterprise Recruiters' }
                ].map((aud) => (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setActiveAudienceTab(aud.id as any)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 750,
                      border: '1px solid var(--border-color)',
                      background: activeAudienceTab === aud.id ? 'var(--accent)' : 'var(--bg-card)',
                      color: activeAudienceTab === aud.id ? '#FFFFFF' : 'var(--text-primary)',
                      cursor: 'pointer',
                      boxShadow: activeAudienceTab === aud.id ? '0 4px 16px var(--accent-glow)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>

              <div className="glass-card" style={{ padding: '32px' }}>
                {activeAudienceTab === 'students' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>STUDENT TRANSFORMATION</span>
                      <h4 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 12px' }}>
                        Your Sovereign Career Operating System
                      </h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Stop copying resumes and hoping for replies. PinitCareer guides you with 24/7 Voice AI mentors, real-world crisis incident simulations, cognitive attention training, and verifiable cryptographic skill credentials.
                      </p>
                      <button type="button" className="pc-btn-primary" style={{ marginTop: '16px' }} onClick={handleLoginClick}>
                        Start Free Student Journey →
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { title: 'Zero Paywall Learning', desc: 'Core S-Curve roadmaps and daily missions are 100% free to earn.' },
                        { title: 'AI Avatar Mentors', desc: 'Real-time speech feedback from Ms. Priya and Mr. Akash.' },
                        { title: 'Cryptographic Proof Vault', desc: 'Direct GitHub commit verification and SHA-256 signed skill credentials.' }
                      ].map((feat) => (
                        <div key={feat.title} style={{ padding: '14px 18px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                          <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)', display: 'block' }}>✓ {feat.title}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{feat.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeAudienceTab === 'universities' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>INSTITUTIONAL ACCREDITATION</span>
                      <h4 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 12px' }}>
                        Transform Campus Placements &amp; NAAC Audits
                      </h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Equip your Placement Cell, Deans, and HODs with real-time student cohort employability intelligence, skill gap detection, automated NIRF exports, and direct corporate recruitment drives.
                      </p>
                      <Link href="/campus-demo" className="pc-btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
                        Schedule Campus Walkthrough →
                      </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { title: '1-Click NAAC & NIRF Data Exports', desc: 'Automate accreditation documentation with verified student metrics.' },
                        { title: 'Batch Employability Heatmaps', desc: 'Instantly pinpoint department-level technical skill gaps.' },
                        { title: 'Integrated Campus Drive Management', desc: 'Connect directly with hiring partners for accelerated placements.' }
                      ].map((feat) => (
                        <div key={feat.title} style={{ padding: '14px 18px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                          <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)', display: 'block' }}>✓ {feat.title}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{feat.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeAudienceTab === 'recruiters' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>ENTERPRISE HIRING</span>
                      <h4 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 12px' }}>
                        Hire Pre-Assessed, Production-Ready Engineers
                      </h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Bypass the resume screening bottleneck. Discover verified students based on algorithmic duels, real crisis roleplay decision scores, and verified GitHub repository audits with a 95%+ AI match score.
                      </p>
                      <button type="button" className="pc-btn-primary" style={{ marginTop: '16px' }} onClick={handleLoginClick}>
                        Access Pre-Assessed Talent Pool →
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { title: '4-Day Average Time-to-Hire', desc: 'Pre-screened candidate profiles with verified system architecture scores.' },
                        { title: 'Zero Fake Resumes', desc: 'Proof-of-work project code audits and verified S-curve milestones.' },
                        { title: '95%+ Role Matching Precision', desc: 'Custom AI roadmaps built directly from your job description criteria.' }
                      ].map((feat) => (
                        <div key={feat.title} style={{ padding: '14px 18px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                          <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)', display: 'block' }}>✓ {feat.title}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{feat.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 6. 54 ECOSYSTEM MODULES HIGHLIGHTS */}
        <section id="modules" className="about-pillars-section section-padding alt-bg">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
              <div>
                <div className="tag-pill-sub">COMPLETE PLATFORM DIRECTORY</div>
                <h2 className="section-title-lg">54 Integrated Ecosystem Modules</h2>
                <p className="section-desc max-w-2xl" style={{ margin: '8px 0 0' }}>
                  A unified infrastructure powering student learning, cognitive focus, campus administration, and corporate hiring.
                </p>
              </div>
              <Link href="/modules" className="pc-btn-primary btn-sm">
                Browse Full 54 Modules Directory →
              </Link>
            </div>

            {/* 4 Core Pillars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>🧠</div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  1. AI-Powered Personalization
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Dynamic S-Curve roadmaps that adapt to progress, skill gaps, and target companies.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>🔨</div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  2. Skill-First Proof of Work
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Replacing text claims with audited test assertions, code commits, and verified capstones.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>🌐</div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  3. Ecosystem Connectivity
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Connecting Students, Faculty, Placement Cells, Enterprise Recruiters, and Parents.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>📈</div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  4. Guaranteed Readiness
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Real-time 0-100% readiness score with 95%+ AI candidate-to-job matching precision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. HOW IT WORKS & GAIN PILLARS */}
        <section id="how-it-works" className="how-gain-section section-padding">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
              <div>
                <div className="tag-pill-sub">PEDAGOGICAL METHOD</div>
                <h2 className="section-title-lg">How Students Gain from PinIT Career</h2>
              </div>
              <Link href="/how-it-works" className="pc-btn-outline btn-sm">
                Explore The S-Curve Method →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🗺️</div>
                <h3>Personalized AI Roadmaps</h3>
                <p>AI creates your unique roadmap based on your goals, college, and target companies.</p>
              </div>

              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>👩‍🏫</div>
                <h3>Learn with AI Mentor</h3>
                <p>24/7 spoken tutoring with 0 jargon and empathetic 3-step recovery ladders.</p>
              </div>

              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>💻</div>
                <h3>Build Real Projects</h3>
                <p>Build enterprise systems, collaborate with peers, and deploy audited capstones.</p>
              </div>

              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚔️</div>
                <h3>Compete &amp; Rank</h3>
                <p>Climb global Elo leaderboards in Code Wars and weekly hackathons.</p>
              </div>

              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>👥</div>
                <h3>Peer Communities</h3>
                <p>Study groups, voice rooms, and multi-avatar AI group discussions.</p>
              </div>

              <div className="gain-card">
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🚀</div>
                <h3>Get Discovered</h3>
                <p>Companies find you based on verified code execution and skill passports.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. PRICING TEASER */}
        <section id="pricing" className="pricing-section section-padding alt-bg">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
              <div>
                <div className="tag-pill-sub">PLANS &amp; PIN ECONOMY</div>
                <h2 className="section-title-lg">Transparent Plans for Every Ambition</h2>
              </div>
              <Link href="/pricing" className="pc-btn-primary btn-sm">
                View Full Pricing &amp; Pin Economy →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Student Free</span>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 12px' }}>₹0 <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>/ forever</span></div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                    Full AI Career DNA assessment, 36 foundation roadmaps, 1,080 daily quests, and Code Wars.
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {['50 Starter Pins upon signup', 'Full Career DNA Assessment', 'Daily Coding Quests', 'Peer Code Wars Access'].map((item) => (
                      <li key={item} style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/signup" className="pc-btn-outline" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                  Start Free Forever
                </Link>
              </div>

              <div className="glass-card" style={{ padding: '32px 28px', border: '2px solid var(--accent)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Pro Career Pass</span>
                    <span style={{ fontSize: '10px', fontWeight: 800, background: 'var(--accent)', color: '#FFFFFF', padding: '2px 8px', borderRadius: 999 }}>POPULAR</span>
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 12px' }}>₹499 <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>/ mo</span></div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                    24/7 Voice AI Avatar coaching, full technical mock interview studio, and cryptographic passports.
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {['Unlimited Voice AI Coaching', 'Full Mock Interviews', 'ATS Resume Optimizer', 'SHA-256 Skill Passport'].map((item) => (
                      <li key={item} style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/pricing" className="pc-btn-primary" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                  View Pro Features →
                </Link>
              </div>

              <div className="glass-card" style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>Campus Operating System</span>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0 12px' }}>Institutional</div>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                    Centralized placement cell OS, cohort employability heatmaps, and 1-click NAAC/NIRF exports.
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {['Placement Director Command Hub', 'Batch Skill Heatmaps', '1-Click NAAC & NIRF Exports', 'Dedicated Recruiter Drives'].map((item) => (
                      <li key={item} style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#F59E0B', fontWeight: 800 }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/campus-demo" className="pc-btn-outline" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                  Schedule Campus Walkthrough
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FINAL GRAND CTA WITH MASCOT */}
        <section className="final-cta-section section-padding">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap' }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '68px', boxShadow: '0 0 36px var(--accent-glow)' }}>
                👨‍🎓
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 900, lineHeight: '1.25', marginBottom: '12px' }}>
                Degrees will matter. Skills will matter more.<br />
                Understanding yourself will <span className="text-gradient">matter the most.</span>
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                PinitCareer prepares students not just for their first job — but for an entire lifetime of growth.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <button type="button" className="pc-btn-primary" style={{ padding: '14px 28px', fontSize: '15px' }} onClick={handleLoginClick}>Start free</button>
                <Link href="/campus-demo" className="pc-btn-outline" style={{ padding: '14px 28px', fontSize: '15px' }}>
                  Schedule Campus Demo
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '18px', fontSize: '12.5px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                <span>✓ No Credit Card Required</span>
                <span>✓ Free Forever Plan Available</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. UNIVERSAL FOOTER */}
      <PublicFooter />

      {/* FLOATING CHAT WIDGET */}
      <div className="floating-chat-wrapper">
        {isChatOpen && (
          <div className="chat-panel glass-card morph-widget-container">
            <div className="chat-header">
              <div className="chat-h-left">
                <span className="chat-bot-icon">🤖</span>
                <strong>AI Career Mentor</strong>
              </div>
              <button className="close-chat-btn" onClick={() => setIsChatOpen(false)}>✕</button>
            </div>
            <div className="chat-body">
              <div className="chat-msg bot-msg">Hello! I'm your PinitCareer AI Mentor. How can I help you map out your future today?</div>
              <div className="sandbox-queries">
                <button className="sq-btn">Create a frontend roadmap</button>
                <button className="sq-btn">How do I prepare for FAANG?</button>
                <button className="sq-btn">What projects should I build?</button>
              </div>
            </div>
            <div className="chat-footer">
              <input type="text" placeholder="Ask me anything..." className="chat-input" />
              <button className="chat-send-btn">➔</button>
            </div>
          </div>
        )}
        <button className="chat-toggle-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
          {isChatOpen ? '✕' : '🤖'}
        </button>
      </div>

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          preselectRole={null} 
          loginFn={login || (async () => ({}))} 
        />
      )}
    </div>
  );
}

export default function PinitCareerLanding() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#000' }} />}>
      <LandingContent />
    </Suspense>
  );
}
