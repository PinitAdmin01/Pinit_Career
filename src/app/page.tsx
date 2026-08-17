'use client';
import { useState, useEffect, useRef, useCallback, Suspense, type CSSProperties, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { isDemoAuthEnabled, DEMO_PASSWORD } from '@/lib/demoAuth';
import { supabase } from '@/lib/supabaseClient';
import PublicNavbar from '@/components/nav/PublicNavbar';
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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onStageMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: +(py * -14).toFixed(2), y: +(px * 16).toFixed(2) });
  };
  useEffect(() => {
    // Theme persistence
    const savedTheme = localStorage.getItem('pc_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeAppTab, setActiveAppTab] = useState<'dashboard' | 'attention' | 'missions' | 'gd' | 'interview' | 'vault'>('dashboard');
  const [activeAudienceTab, setActiveAudienceTab] = useState<'students' | 'universities' | 'recruiters'>('students');
  const [interactiveCrisisChoice, setInteractiveCrisisChoice] = useState<number | null>(0);
  const [interactiveReflexTime, setInteractiveReflexTime] = useState<number>(214);
  const [interactiveGameDiff, setInteractiveGameDiff] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    role: 'Placement Director / Principal',
    institution: '',
    message: ''
  });
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.email) return;
    setDemoLoading(true);
    setTimeout(() => {
      setDemoLoading(false);
      setDemoSubmitted(true);
      setDemoForm({ name: '', email: '', role: 'Placement Director / Principal', institution: '', message: '' });
    }, 800);
  };

  return (
    <div className="landing-page">
      <div className="bg-grid-pattern"></div>

      {/* 1. UNIVERSAL SHARED NAVBAR */}
      <PublicNavbar onLoginClick={handleLoginClick} />

      <main className="main-content">
        {/* 2. HERO SECTION */}
        <section className="hero-section section-padding">
          <div className="container hero-grid">
            <div className="hero-left">
              <div className="badge-pill">Discover · Connect · Grow</div>
              <h1 className="hero-title">
                We don&apos;t help students find jobs.<br />
                We help them <span className="text-gradient">discover who they are.</span>
              </h1>
              <p className="hero-subtitle">
                PinitCareer is an AI-powered career intelligence platform that understands every student&apos;s unique strength, interests, personality, skills, and potential — before they ever submit a resume.
              </p>
              <div className="hero-ctas">
                <button type="button" className="pc-btn-primary" onClick={handleLoginClick}>Start free</button>
                <button type="button" className="pc-btn-outline" onClick={() => document.getElementById('the-problem')?.scrollIntoView({ behavior: 'smooth' })}>
                  Why we exist
                </button>
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
            <div className="hero-right">
              <div
                ref={stageRef}
                className="lp-stage"
                onMouseMove={onStageMove}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                style={{ '--rx': `${tilt.x}deg`, '--ry': `${tilt.y}deg` } as CSSProperties}
              >
                <div className="lp-halo" aria-hidden />
                <div className="lp-rig">
                  <div className="lp-floor" aria-hidden />
                  <div className="lp-ring" aria-hidden />
                  <div className="lp-ring lp-ring-soft" aria-hidden />
                  <div className="lp-logo">
                    <div className="lp-badge lp-badge-official">
                      <img src="/brand/pinit-career-logo-clear.png" alt="PINIT CAREER" />
                    </div>
                  </div>
                  <ul className="lp-terms">
                    <li><em>01</em> Know yourself</li>
                    <li><em>02</em> Build yourself</li>
                    <li><em>03</em> Prove yourself</li>
                    <li><em>04</em> Grow</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="brief-manifesta" aria-label="Brand promise">
          <div className="container brief-manifesta-row">
            <span>Discover</span>
            <i className="brief-dot" aria-hidden />
            <span>Connect</span>
            <i className="brief-dot" aria-hidden />
            <span>Grow</span>
          </div>
        </section>

        <section id="the-problem" className="brief-problem section-padding">
          <div className="container brief-problem-grid">
            <div>
              <p className="badge-pill">The problem</p>
              <h2>Every year, millions of students graduate. Thousands of resumes look identical.</h2>
              <p className="section-desc">Most students don&apos;t know what career suits them, what skills companies need, or how to stand out. So they copy resumes, watch random videos, apply to hundreds of jobs, and hope for the best.</p>
              <p className="bold-line text-purple">Hope isn&apos;t a strategy.</p>
            </div>
            <ul className="brief-problem-list">
              <li>Don&apos;t know what career suits them</li>
              <li>Don&apos;t know what skills companies need</li>
              <li>Don&apos;t know how to stand out</li>
            </ul>
          </div>
          <div className="container brief-worlds">
            <h3>Education has changed. Career guidance hasn&apos;t.</h3>
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

        <section id="career-identity" className="brief-identity section-padding alt-bg">
          <div className="container">
            <p className="badge-pill">Career identity</p>
            <h2 className="section-title-lg">Every student has identity. Not just marks.</h2>
            <p className="section-desc brief-identity-lead">
              Not just certificates. Not just projects. PinitCareer analyzes personality, communication, technical skills, learning behavior, interests, problem solving, leadership, creativity, portfolio, experience, and career goals. Everything contributes to your Career Identity.
            </p>
            <ul className="brief-signals">
              {['Personality', 'Communication', 'Technical skills', 'Learning behavior', 'Interests', 'Problem solving', 'Leadership', 'Creativity', 'Portfolio', 'Experience', 'Career goals'].map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
            <div className="brief-os">
              <div>
                <h3>Your personal career operating system</h3>
                <p>One intelligent platform. One evolving profile. One career identity. Built from thousands of data points. Continuously improving. Uniquely yours.</p>
              </div>
              <ul className="brief-tools">
                {['Career assessment', 'AI resume builder', 'ATS optimizer', 'Portfolio builder', 'Mock interviews', 'AI mentor', 'Career roadmaps', 'Skill gap analysis', 'Job matching', 'Internship matching', 'Progress tracking'].map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="audiences" className="brief-audiences section-padding">
          <div className="container">
            <p className="badge-pill">Who it&apos;s for</p>
            <h2 className="section-title-lg">One platform. Three worlds, finally connected.</h2>
            <div className="brief-audience-grid">
              <article>
                <h3>For students</h3>
                <ul>
                  <li>Discover your strengths</li>
                  <li>Build real skills</li>
                  <li>Gain confidence</li>
                  <li>Get interview ready</li>
                  <li>Find opportunities</li>
                  <li>Launch your career</li>
                </ul>
              </article>
              <article>
                <h3>For universities</h3>
                <ul>
                  <li>Measure employability</li>
                  <li>Track student progress</li>
                  <li>Improve placements</li>
                  <li>Identify skill gaps</li>
                  <li>Increase recruiter confidence</li>
                  <li>Deliver better outcomes</li>
                </ul>
              </article>
              <article>
                <h3>For recruiters</h3>
                <ul>
                  <li>Move beyond resumes</li>
                  <li>Discover verified talent</li>
                  <li>Understand candidate potential</li>
                  <li>Hire with confidence</li>
                  <li>Reduce screening time</li>
                  <li>Find the right fit</li>
                </ul>
              </article>
            </div>

            {/* Interactive Persona Deep-Dive Tabs */}
            <div style={{ marginTop: '40px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '24px'
              }}>
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
                      background: activeAudienceTab === aud.id
                        ? 'linear-gradient(135deg, #5ad0ff, #0077cc)'
                        : 'var(--bg-card)',
                      color: activeAudienceTab === aud.id ? '#041018' : 'var(--text-primary)',
                      cursor: 'pointer',
                      boxShadow: activeAudienceTab === aud.id ? '0 4px 16px rgba(0, 163, 255, 0.28)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>

              <div className="glass-card" style={{ padding: '32px', border: '1px solid var(--border-color)', animation: 'fadeInUp 0.3s ease' }}>
                {activeAudienceTab === 'students' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>STUDENT CAREER TRANSFORMATION</span>
                      <h4 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 12px' }}>
                        Your Complete Career Operating System
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
                        <div key={feat.title} style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                          <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)', display: 'block' }}>✓ {feat.title}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{feat.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeAudienceTab === 'universities' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>INSTITUTIONAL ACCREDITATION &amp; PLACEMENTS</span>
                      <h4 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', margin: '6px 0 12px' }}>
                        Transform Campus Placement Outcomes &amp; NAAC Audits
                      </h4>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Equip your Placement Cell, Deans, and HODs with real-time student cohort employability intelligence, skill gap detection, automated NIRF exports, and direct corporate recruitment drives.
                      </p>
                      <button type="button" className="pc-btn-primary" style={{ marginTop: '16px' }} onClick={() => document.getElementById('campus-demo')?.scrollIntoView({ behavior: 'smooth' })}>
                        Schedule Campus Walkthrough →
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { title: '1-Click NAAC & NIRF Data Exports', desc: 'Automate accreditation documentation with verified student metrics.' },
                        { title: 'Batch Employability Heatmaps', desc: 'Instantly pinpoint department-level and branch-level technical skill gaps.' },
                        { title: 'Integrated Campus Drive Management', desc: 'Host custom coding battles and connect directly with hiring partners.' }
                      ].map((feat) => (
                        <div key={feat.title} style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                          <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)', display: 'block' }}>✓ {feat.title}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{feat.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeAudienceTab === 'recruiters' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>ENTERPRISE TALENT ACQUISITION</span>
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
                        <div key={feat.title} style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
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

        {/* 4 CORE FOUNDATIONAL PILLARS & 54 INTEGRATED ECOSYSTEM MODULES */}
        <section id="modules" className="about-pillars-section section-padding alt-bg">
          <div className="container">
            <div className="text-center mb-12">
              <span className="tag-pill-sub">FOUNDATIONAL ARCHITECTURE</span>
              <h2 className="section-title-lg mt-2 mb-4">Our 4 Core Ecosystem Pillars</h2>
              <p className="section-desc max-w-2xl">
                Built to replace fragmented learning management systems with a single unified Operating System.
              </p>
            </div>

            {/* 4 Core Pillars Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginBottom: '60px'
            }}>
              {/* Pillar 1 */}
              <div className="glass-card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(124, 58, 237, 0.15)', display: 'grid', placeItems: 'center', fontSize: '24px', marginBottom: '16px' }}>
                  🧠
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  1. AI-Powered Personalization
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                  Dynamic S-Curve roadmaps that continuously adapt to student progress, skill gaps, target companies, and daily learning velocities. Powered by AI Career Twins &amp; Neural DNA profiling.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <li>✓ Level 0 to Level 3 Stage Progression</li>
                  <li>✓ Real-Time Attention Span Tracking</li>
                  <li>✓ 24/7 AI Mentor Guidance &amp; Doubt Resolution</li>
                </ul>
              </div>

              {/* Pillar 2 */}
              <div className="glass-card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', display: 'grid', placeItems: 'center', fontSize: '24px', marginBottom: '16px' }}>
                  🔨
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  2. Skill-First Proof of Work
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                  We replace static text resumes with verified proof of work. Every line of code written in Quests, Code Wars, and Project Vaults is verified and scored.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <li>✓ Gamified Quests with WebAudio FX Engine</li>
                  <li>✓ GitHub Repository &amp; Code Audit Sync</li>
                  <li>✓ Shareable Candidate Skill Passports</li>
                </ul>
              </div>

              {/* Pillar 3 */}
              <div className="glass-card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0, 163, 255, 0.15)', display: 'grid', placeItems: 'center', fontSize: '24px', marginBottom: '16px' }}>
                  🌐
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  3. Ecosystem Connectivity
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                  Connecting all campus stakeholders in real-time. Students, Faculty, Placement Directors, Enterprise Recruiters, Parents, and Industry Consultants interact seamlessly.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <li>✓ Integrated Placement &amp; Candidate CRM</li>
                  <li>✓ Parent Progress &amp; Financial Transparency</li>
                  <li>✓ Consultant 1-on-1 Mentorship Booking</li>
                </ul>
              </div>

              {/* Pillar 4 */}
              <div className="glass-card" style={{ padding: '28px', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', display: 'grid', placeItems: 'center', fontSize: '24px', marginBottom: '16px' }}>
                  📈
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  4. Guaranteed Placement Readiness
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                  Real-time Career Readiness Scoring (0-100%) calculated dynamically using live coding rankings, project completion, and AI mock interview evaluations.
                </p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  <li>✓ 95%+ AI Candidate-to-Job Matching</li>
                  <li>✓ AI Speech &amp; Technical Mock Interview Studio</li>
                  <li>✓ Automated Campus Drive Workflows</li>
                </ul>
              </div>
            </div>

            {/* 54 ECOSYSTEM MODULES COMPLETE DIRECTORY */}
            <div style={{
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '36px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  COMPLETE PLATFORM DIRECTORY
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '6px' }}>
                  All 54 Integrated Ecosystem Modules
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  A unified infrastructure powering student learning, cognitive focus, campus administration, and corporate hiring.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
              }}>
                {[
                  {
                    category: 'Core Student Learning & Career OS (1-10)',
                    icon: '🌱',
                    items: [
                      '01. S-Curve Dynamic Roadmaps',
                      '02. Level 0-3 Stage Runner',
                      '03. Master Syllabus Explorer',
                      '04. WebAudio Sound FX Feedback',
                      '05. Daily AI Priority Queue',
                      '06. In-Browser Code IDE',
                      '07. AI Career Twin & DNA Profile',
                      '08. Attention Span Focus Meter',
                      '09. Cognitive Calibration Gym',
                      '10. Streak & XP Gamification Engine'
                    ]
                  },
                  {
                    category: 'AI Mentorship & Speech Intelligence (11-18)',
                    icon: '🎙️',
                    items: [
                      '11. 24/7 Voice AI Mentor (Ms. Priya)',
                      '12. Technical Grilling Avatar (Mr. Akash)',
                      '13. AI Group Discussion 5-Avatar Arena',
                      '14. Real-Time Turn-Taking Engine',
                      '15. Speech Cadence & Voice Waves',
                      '16. Candidate Intervention Detector',
                      '17. Real-Time GD Score Matrix',
                      '18. Filler Word & Pace Analyzer'
                    ]
                  },
                  {
                    category: 'Competitive Battles & Crisis Roleplay (19-26)',
                    icon: '⚔️',
                    items: [
                      '19. Global 1v1 Code Wars',
                      '20. Live XP Leaderboard Rankings',
                      '21. Weekly Tournament Hackathons',
                      '22. Live Bug Bounty Arena',
                      '23. Crisis Incident Roleplay Simulator',
                      '24. Real-Time QT2 Stress Score Engine',
                      '25. Mental Model Decision Evaluator',
                      '26. LinguaLab Professional English Coach'
                    ]
                  },
                  {
                    category: 'Proof of Work, Vault & Portfolios (27-34)',
                    icon: '🔒',
                    items: [
                      '27. Verifiable Proof-of-Work Vault',
                      '28. SHA-256 Signed Credential Hashes',
                      '29. Automated GitHub AST Code Audit',
                      '30. Live Project Deployment Sandboxes',
                      '31. AI ATS Resume Builder',
                      '32. ATS Keyword Gap Optimizer',
                      '33. Shareable Candidate Skill Passports',
                      '34. Verified Skill Badge System'
                    ]
                  },
                  {
                    category: 'Campus Administration & Logistics (35-44)',
                    icon: '🏛️',
                    items: [
                      '35. Placement Director Command Hub',
                      '36. 1-Click NAAC Grade A+ Exports',
                      '37. 1-Click NIRF Employability Reports',
                      '38. Faculty & Advisor Operations Desk',
                      '39. Batch Attendance & Roll-Call Portal',
                      '40. PinIT Examination Engine',
                      '41. Hostel Room Allocation Manager',
                      '42. Route-Based Transport Logistics',
                      '43. RFID Library Cataloguing Desk',
                      '44. Finance & Fee Transparency Ledger'
                    ]
                  },
                  {
                    category: 'Enterprise Hiring & Multi-Stakeholders (45-54)',
                    icon: '💼',
                    items: [
                      '45. Recruiter Candidate Search Engine',
                      '46. 95%+ AI Match Score Filtering',
                      '47. Zero-Resume Plagiarism Audit',
                      '48. 1-Click Interview Invitations',
                      '49. Integrated Placement CRM',
                      '50. Automated Offer Letter Delivery',
                      '51. Parent Progress & Finance Portal',
                      '52. Consultant 1-on-1 Advisory Desk',
                      '53. Alumni Mentorship Directory',
                      '54. Security Sentinel & Audit Log Trail'
                    ]
                  }
                ].map((cat) => (
                  <div
                    key={cat.category}
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      background: 'color-mix(in srgb, var(--bg-card) 60%, transparent)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {cat.category}
                      </h4>
                    </div>
                    <ul style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '7px',
                      fontSize: '12.5px',
                      color: 'var(--text-secondary)',
                      paddingLeft: '4px'
                    }}>
                      {cat.items.map((item) => (
                        <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: 'var(--accent)', fontSize: '10px' }}>▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHAT IS PINITCAREER? SECTION */}
        <section id="what-is" className="what-is-section section-padding">
          <div className="container what-is-grid">
            {/* Left Column: Platform Overview & Value Proposition */}
            <div className="what-is-left">
              <h2>What is PinitCareer?</h2>
              <p className="section-desc">
                The career operating system for the next generation. An AI mentor available 24/7 who knows your strengths, understands your weaknesses, tracks your goals, suggests the next step, prepares you for interviews, and keeps you accountable.
              </p>
              <p className="bold-line">It is not another job board.</p>
              <p className="bold-line text-purple">It is a career identity platform.</p>
              
              {/* 6 Capability Features Grid */}
              <div className="features-grid-2x3">
                <div className="feature-item">
                  <div className="icon-circ" aria-hidden />
                  <span>AI-driven personalized roadmaps</span>
                </div>
                <div className="feature-item">
                  <div className="icon-circ" aria-hidden />
                  <span>Skill-based learning & real projects</span>
                </div>
                <div className="feature-item">
                  <div className="icon-circ" aria-hidden />
                  <span>Code-in-portfolio & leaderboards</span>
                </div>
                <div className="feature-item">
                  <div className="icon-circ" aria-hidden />
                  <span>Peer collaboration & study groups</span>
                </div>
                <div className="feature-item">
                  <div className="icon-circ" aria-hidden />
                  <span>Verified portfolio & skill badges</span>
                </div>
                <div className="feature-item">
                  <div className="icon-circ" aria-hidden />
                  <span>Direct access to company requirements & hiring</span>
                </div>
              </div>

              {/* Journey Pipeline */}
              <div className="journey-steps-wrapper">
                <h4>One Platform. Every Step of Your Career Journey.</h4>
                <div className="journey-steps">
                  <div className="j-step"><div className="j-icon-bg" aria-hidden /><span>Learn</span></div>
                  <div className="j-arrow">→</div>
                  <div className="j-step"><div className="j-icon-bg" aria-hidden /><span>Build</span></div>
                  <div className="j-arrow">→</div>
                  <div className="j-step"><div className="j-icon-bg" aria-hidden /><span>Compete</span></div>
                  <div className="j-arrow">→</div>
                  <div className="j-step"><div className="j-icon-bg" aria-hidden /><span>Collaborate</span></div>
                  <div className="j-arrow">→</div>
                  <div className="j-step"><div className="j-icon-bg" aria-hidden /><span>Get Hired</span></div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Interactive Student Dashboard Mockup */}
            <div className="what-is-right">
              {/* Welcome Back Card with AI Mentor Chat & Career Score */}
              <div className="glass-card welcome-card">
                <div className="welcome-header">
                  <h3>Welcome back, Arjun</h3>
                </div>
                <div className="welcome-body-grid">
                  {/* AI Mentor Chat Bubble */}
                  <div className="ai-chat-box">
                    <div className="ai-avatar-small" aria-hidden />
                    <div className="ai-msg-content">
                      <strong className="ai-msg-title">Your AI Mentor</strong>
                      <p className="ai-msg-text">Based on your goals, I've created a personalized roadmap to become a Full Stack Developer in 24 weeks.</p>
                      <button className="pc-btn-purple-sm">View Roadmap</button>
                    </div>
                  </div>

                  {/* Career Readiness Score Circle */}
                  <div className="readiness-score-box">
                    <span className="score-heading">Career Readiness Score</span>
                    <div className="score-gauge">
                      <svg width="84" height="84" viewBox="0 0 84 84">
                        <circle cx="42" cy="42" r="36" stroke="currentColor" strokeOpacity="0.18" strokeWidth="8" fill="none" />
                        <circle cx="42" cy="42" r="36" stroke="#00a3ff" strokeWidth="8" fill="none" strokeDasharray="226" strokeDashoffset="50" strokeLinecap="round" transform="rotate(-90 42 42)" />
                      </svg>
                      <div className="score-center-val">78%</div>
                    </div>
                    <span className="score-subtext">You're on the right track!</span>
                  </div>
                </div>
              </div>

              {/* Your Personalized Roadmap Timeline */}
              <div className="roadmap-preview-card">
                <h4>Your Personalized Roadmap</h4>
                <div className="timeline-cards-grid">
                  <div className="t-card border-t-green">
                    <span className="week-label">Week 1-4</span>
                    <strong className="phase-title">Foundation</strong>
                    <span className="tech-stack-sub">HTML, CSS, JS, Git</span>
                    <span className="status-badge status-done">Completed</span>
                  </div>
                  <div className="t-card border-t-amber">
                    <span className="week-label">Week 5-10</span>
                    <strong className="phase-title">Frontend</strong>
                    <span className="tech-stack-sub">React, Tailwind, Redux</span>
                    <span className="status-badge status-prog">In Progress</span>
                  </div>
                  <div className="t-card border-t-amber">
                    <span className="week-label">Week 11-16</span>
                    <strong className="phase-title">Backend</strong>
                    <span className="tech-stack-sub">Node.js, Express, MongoDB</span>
                    <span className="status-badge status-prog">In Progress</span>
                  </div>
                  <div className="t-card border-t-purple">
                    <span className="week-label">Week 17-20</span>
                    <strong className="phase-title">Real Projects</strong>
                    <span className="tech-stack-sub">Build & Deploy</span>
                    <span className="status-badge status-next">Upcoming</span>
                  </div>
                  <div className="t-card border-t-purple">
                    <span className="week-label">Week 21-24</span>
                    <strong className="phase-title">Interview Ready</strong>
                    <span className="tech-stack-sub">DSA, System Design</span>
                    <span className="status-badge status-next">Upcoming</span>
                  </div>
                </div>
              </div>

              {/* Bottom Dual Action Cards */}
              <div className="action-cards-row">
                <div className="glass-card action-card">
                  <span className="action-lbl">Upcoming Milestone</span>
                  <strong className="action-title">Build a MERN E-commerce Project</strong>
                  <span className="action-meta">Due in 5 days</span>
                  <button className="pc-btn-primary btn-sm">Continue</button>
                </div>
                <div className="glass-card action-card">
                  <span className="action-lbl">Next Challenge</span>
                  <strong className="action-title">Code War: Array Battle</strong>
                  <span className="action-meta">Starts in 02:15:30</span>
                  <button className="pc-btn-purple-outline btn-sm">Join Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW STUDENTS GAIN SECTION */}
        <section id="how-it-works" className="how-gain-section section-padding alt-bg">
          <div className="container">
            <h2 className="text-center mb-10 section-title-lg">How Students Gain from PinitCareer</h2>
            <div className="gain-grid">
              <div className="gain-card">
                <div className="g-icon-illustration">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect width="64" height="64" rx="16" fill="#EFF6FF" />
                    <path d="M16 24H48M16 32H36M16 40H28" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="44" cy="36" r="8" fill="#3B82F6" opacity="0.2" />
                    <path d="M42 36L44 38L48 34" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Personalized AI Roadmaps</h3>
                <p>AI creates your unique roadmap based on your goals, skills, college, and target companies.</p>
              </div>

              <div className="gain-card">
                <div className="g-icon-illustration">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect width="64" height="64" rx="16" fill="#F0FDF4" />
                    <circle cx="32" cy="28" r="12" fill="#10B981" opacity="0.2" />
                    <path d="M26 28C26 24.6863 28.6863 22 32 22C35.3137 22 38 24.6863 38 28C38 31.3137 35.3137 34 32 34V38" stroke="var(--green)" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="32" cy="44" r="2" fill="var(--green)" />
                  </svg>
                </div>
                <h3>Learn with AI Mentor</h3>
                <p>Get 24/7 guidance, doubt solving, explanations, and feedback from your AI mentor.</p>
              </div>

              <div className="gain-card">
                <div className="g-icon-illustration">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect width="64" height="64" rx="16" fill="#FAF5FF" />
                    <rect x="18" y="22" width="28" height="18" rx="3" stroke="#9333EA" strokeWidth="2.5" />
                    <path d="M14 42H50" stroke="#9333EA" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Build Real Projects</h3>
                <p>Build industry projects, collaborate with peers, and create an impressive portfolio.</p>
              </div>

              <div className="gain-card">
                <div className="g-icon-illustration">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect width="64" height="64" rx="16" fill="#FEF3C7" opacity="0.5" />
                    <path d="M22 22H42V32C42 37.5228 37.5228 42 32 42C26.4772 42 22 37.5228 22 32V22Z" fill="#F59E0B" opacity="0.3" stroke="#D97706" strokeWidth="2.5" />
                    <path d="M32 42V48M24 48H40" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Compete & Rank</h3>
                <p>Participate in code wars, contests, and hackathons. Climb leaderboards.</p>
              </div>

              <div className="gain-card">
                <div className="g-icon-illustration">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect width="64" height="64" rx="16" fill="#FEE2E2" opacity="0.6" />
                    <circle cx="26" cy="28" r="6" fill="#EF4444" opacity="0.3" stroke="#DC2626" strokeWidth="2" />
                    <circle cx="38" cy="28" r="6" fill="#EF4444" opacity="0.3" stroke="#DC2626" strokeWidth="2" />
                    <path d="M18 42C18 37.5817 21.5817 34 26 34C30.4183 34 34 37.5817 34 42" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Collaborate in Communities</h3>
                <p>Join study groups, tech communities, voice rooms, and meet like-minded peers.</p>
              </div>

              <div className="gain-card">
                <div className="g-icon-illustration">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                    <rect width="64" height="64" rx="16" fill="#EEF2FF" />
                    <rect x="20" y="24" width="24" height="16" rx="3" stroke="#4F46E5" strokeWidth="2.5" />
                    <circle cx="44" cy="38" r="8" fill="#6366F1" />
                    <path d="M41 38L43 40L47 36" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3>Get Discovered & Hired</h3>
                <p>Companies find you based on your skills, projects, rankings, and performance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. COMPLETE APP FEATURE ARCHITECTURE & INTERACTIVE PRODUCT SANDBOX */}
        <section id="features" className="brief-identity section-padding">
          <div className="container">
            <div className="text-center mb-10">
              <span className="tag-pill-sub">Interactive Product Sandbox</span>
              <h2 className="section-title-lg mt-2 mb-4">Experience Every Engine Inside PinitCareer</h2>
              <p className="section-desc max-w-2xl">
                Click across the interactive tabs below to preview the exact working HUDs, simulators, AI arenas, and tools built into the platform.
              </p>
            </div>

            {/* Interactive Sandbox Tab Selector */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '32px',
              background: 'color-mix(in srgb, var(--bg-card-solid) 80%, transparent)',
              padding: '6px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)'
            }}>
              {[
                { id: 'dashboard', label: '📱 Student OS HUD', icon: '⚡' },
                { id: 'attention', label: '🧠 Focus & Attention Gym', icon: '🎯' },
                { id: 'missions', label: '🚨 Crisis Roleplay Terminal', icon: '🛡️' },
                { id: 'gd', label: '🎙️ Group Discussion Arena', icon: '🗣️' },
                { id: 'interview', label: '🤖 AI Avatar Interview Room', icon: '👔' },
                { id: 'vault', label: '🔒 Proof Vault & ATS Optimizer', icon: '📜' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveAppTab(tab.id as any)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 750,
                    border: 'none',
                    cursor: 'pointer',
                    background: activeAppTab === tab.id
                      ? 'linear-gradient(135deg, #5ad0ff, #0077cc)'
                      : 'transparent',
                    color: activeAppTab === tab.id ? '#041018' : 'var(--text-secondary)',
                    boxShadow: activeAppTab === tab.id ? '0 4px 16px rgba(0, 163, 255, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Active Sandbox Viewport Card */}
            <div className="glass-card" style={{ padding: '36px', border: '1px solid var(--border-color)', minHeight: '440px', marginBottom: '48px' }}>
              {activeAppTab === 'dashboard' && (
                <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                  {/* Dashboard Header HUD Preview */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        STUDENT CAREER HUD · LEVEL 4
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                        Arjun Sharma <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>(B.Tech CSE)</span>
                      </h3>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(0, 163, 255, 0.12)', color: 'var(--accent)', fontSize: '12px', fontWeight: 800 }}>
                        ⚡ 2,450 XP (Tier: Industry Ready)
                      </span>
                      <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', fontSize: '12px', fontWeight: 800 }}>
                        🔥 7-Day Streak Active
                      </span>
                      <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: '12px', fontWeight: 800 }}>
                        🪙 50 Pins Available
                      </span>
                    </div>
                  </div>

                  {/* 3 Interactive Daily Quest Actions */}
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '14px' }}>
                    ⚡ What To Do Today — AI Priority Queue
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '18px', borderRadius: '16px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)' }}>QUEST TRACK</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981' }}>+40 XP</span>
                      </div>
                      <strong style={{ fontSize: '15px', display: 'block', color: 'var(--text-primary)', marginBottom: '6px' }}>
                        Redis Distributed Cache Eviction
                      </strong>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                        Interactive code editor exercise with automated test validation.
                      </p>
                      <button type="button" className="pc-btn-outline" style={{ padding: '6px 14px', fontSize: '12px', width: '100%', justifyContent: 'center' }} onClick={handleLoginClick}>
                        Launch Quest in IDE →
                      </button>
                    </div>

                    <div style={{ padding: '18px', borderRadius: '16px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#F59E0B' }}>CRISIS MISSION</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981' }}>+10 PINS</span>
                      </div>
                      <strong style={{ fontSize: '15px', display: 'block', color: 'var(--text-primary)', marginBottom: '6px' }}>
                        UPI Double-Posting Incident
                      </strong>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                        Live high-pressure simulation: 40 minutes before RBI audit window closes.
                      </p>
                      <button type="button" className="pc-btn-primary" style={{ padding: '6px 14px', fontSize: '12px', width: '100%', justifyContent: 'center' }} onClick={() => setActiveAppTab('missions')}>
                        Enter Incident Terminal →
                      </button>
                    </div>

                    <div style={{ padding: '18px', borderRadius: '16px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#EC4899' }}>COGNITIVE GYM</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981' }}>+15 XP</span>
                      </div>
                      <strong style={{ fontSize: '15px', display: 'block', color: 'var(--text-primary)', marginBottom: '6px' }}>
                        LogicCircuit Attention Calibration
                      </strong>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                        3-minute neuro-reaction test to optimize focus and working memory.
                      </p>
                      <button type="button" className="pc-btn-outline" style={{ padding: '6px 14px', fontSize: '12px', width: '100%', justifyContent: 'center' }} onClick={() => setActiveAppTab('attention')}>
                        Test Cognitive Focus →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeAppTab === 'attention' && (
                <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        GAMIFIED ATTENTION &amp; NEURO-REFLEX ENGINE
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                        Cognitive Attention Span Gym
                      </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Difficulty:</span>
                      {(['easy', 'medium', 'hard'] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setInteractiveGameDiff(d)}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 800,
                            border: '1px solid var(--border-color)',
                            background: interactiveGameDiff === d ? 'var(--accent)' : 'transparent',
                            color: interactiveGameDiff === d ? '#041018' : 'var(--text-primary)',
                            cursor: 'pointer',
                            textTransform: 'uppercase'
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Realtime Attention Scoreboard */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Focus Score</span>
                      <div style={{ fontSize: '28px', fontWeight: 900, color: '#10B981', marginTop: '4px' }}>88 / 100</div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Peak Flow State</span>
                    </div>
                    <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Reaction Latency</span>
                      <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--accent)', marginTop: '4px' }}>{interactiveReflexTime} ms</div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Top 5% Reflexes</span>
                    </div>
                    <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Cognitive Endurance</span>
                      <div style={{ fontSize: '28px', fontWeight: 900, color: '#F59E0B', marginTop: '4px' }}>94.2%</div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Zero Attention Decay</span>
                    </div>
                  </div>

                  {/* Interactive Reaction Tester */}
                  <div style={{ padding: '24px', borderRadius: '18px', background: 'color-mix(in srgb, var(--accent) 8%, var(--bg-card-solid))', border: '1.5px dashed var(--accent)', textAlign: 'center' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      ⚡ Interactive Live Reflex Calibrator
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', maxWidth: '520px', margin: '0 auto 16px' }}>
                      Click the button below rapidly to test and recalibrate your real-time neural reaction latency!
                    </p>
                    <button
                      type="button"
                      className="pc-btn-primary"
                      onClick={() => setInteractiveReflexTime(Math.floor(180 + Math.random() * 45))}
                      style={{ padding: '12px 28px', fontSize: '14px' }}
                    >
                      ⚡ Tap to Measure Reflexes ({interactiveReflexTime}ms)
                    </button>
                  </div>
                </div>
              )}

              {activeAppTab === 'missions' && (
                <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        LIVE INCIDENT CRISIS SIMULATOR · SYSTEM ARCHITECTURE
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                        Incident #784: UPI Settlement Cascade Outage
                      </h3>
                    </div>
                    <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', fontSize: '12px', fontWeight: 800 }}>
                      ⏳ 40 Mins to RBI Audit Window
                    </span>
                  </div>

                  {/* Terminal Message Box */}
                  <div style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: '#040711',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '13px',
                    lineHeight: '1.7',
                    marginBottom: '20px',
                    color: '#94A3B8'
                  }}>
                    <div style={{ color: '#00A3FF', fontWeight: 700, marginBottom: '6px' }}>
                      [TERMINAL LOG] System Alert: 14,200 Double-Credit Webhooks Detected on Redis Queue #02
                    </div>
                    <p style={{ color: '#F1F5F9', marginBottom: '8px' }}>
                      <strong style={{ color: '#F59E0B' }}>Mr. Rajesh (Teammate):</strong> &quot;The settlement ledger is double-crediting accounts! If we force restart the container cluster, we risk losing in-flight transaction states. What is your call?!&quot;
                    </p>
                  </div>

                  {/* Interactive Branching Choices */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      {
                        idx: 0,
                        title: 'Option A: Drain downstream queues, isolate idempotency keys, and commit ledger snapshot',
                        delta: '+15 QT2 (Extreme Ownership)',
                        archetype: 'System 2 Analytical Thinking · High Agency'
                      },
                      {
                        idx: 1,
                        title: 'Option B: Hard-reboot cluster and restore from 2:00 AM database backup',
                        delta: '-10 QT2 (State Loss)',
                        archetype: 'Loss Aversion Trap · High Blast Radius'
                      },
                      {
                        idx: 2,
                        title: 'Option C: Escalate directly to VP of Engineering without log triage',
                        delta: '-20 QT2 (Panic Trap)',
                        archetype: 'Authority Bias · Diffused Responsibility'
                      }
                    ].map((opt) => (
                      <div
                        key={opt.idx}
                        onClick={() => setInteractiveCrisisChoice(opt.idx)}
                        style={{
                          padding: '14px 18px',
                          borderRadius: '14px',
                          background: interactiveCrisisChoice === opt.idx ? 'rgba(0, 163, 255, 0.12)' : 'var(--bg-card-solid)',
                          border: interactiveCrisisChoice === opt.idx ? '1.5px solid var(--accent)' : '1px solid var(--border-color)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            background: interactiveCrisisChoice === opt.idx ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                            color: interactiveCrisisChoice === opt.idx ? '#041018' : 'var(--text-secondary)',
                            fontWeight: 800,
                            fontSize: '11px'
                          }}>
                            {String.fromCharCode(65 + opt.idx)}
                          </span>
                          <span style={{ fontSize: '13.5px', fontWeight: 650, color: 'var(--text-primary)' }}>
                            {opt.title}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ fontSize: '11.5px', fontWeight: 800, color: opt.delta.startsWith('+') ? '#10B981' : '#EF4444' }}>
                            {opt.delta}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeAppTab === 'gd' && (
                <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        5-PERSON AI GROUP DISCUSSION ARENA
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                        Live GD Simulation: High-Frequency Algorithms vs Human Oversight
                      </h3>
                    </div>
                    <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(0, 163, 255, 0.12)', color: 'var(--accent)', fontSize: '12px', fontWeight: 800 }}>
                      🎙️ Turn Timer: 00:12s (Speaking)
                    </span>
                  </div>

                  {/* Meeting Room Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    {[
                      { name: 'Ms. Priya', role: 'Host & Moderator', status: 'Speaking Now...', color: '#7C3AED', isSpeaking: true },
                      { name: 'Mr. Akash', role: 'Panelist (Proactive)', status: 'Listening', color: '#0891B2', isSpeaking: false },
                      { name: 'Ms. Aisha', role: 'Panelist (Structured)', status: 'Listening', color: '#6366F1', isSpeaking: false },
                      { name: 'Mr. Rohan', role: 'Panelist (Technical)', status: 'Listening', color: '#EF4444', isSpeaking: false },
                      { name: 'You (Arjun)', role: 'Candidate', status: 'Mic Ready', color: '#10B981', isSpeaking: false }
                    ].map((user) => (
                      <div
                        key={user.name}
                        style={{
                          padding: '16px',
                          borderRadius: '16px',
                          background: 'var(--bg-card-solid)',
                          border: user.isSpeaking ? `2px solid ${user.color}` : '1px solid var(--border-color)',
                          textAlign: 'center',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: user.color,
                          color: '#FFF',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '18px',
                          fontWeight: 800,
                          margin: '0 auto 10px'
                        }}>
                          {user.name.slice(0, 2)}
                        </div>
                        <strong style={{ fontSize: '14px', display: 'block', color: 'var(--text-primary)' }}>{user.name}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>{user.role}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: user.isSpeaking ? 'var(--accent)' : 'var(--text-tertiary)', marginTop: '6px', display: 'block' }}>
                          {user.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Realtime GD Evaluation Matrix */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {[
                      { metric: 'Assertiveness', score: '85%', grade: 'High Leadership' },
                      { metric: 'Articulation', score: '90%', grade: 'Clear & Structured' },
                      { metric: 'Active Listening', score: '92%', grade: 'Synthesizes Points' },
                      { metric: 'Interruption Management', score: 'A+', grade: 'Zero Over-speaking' }
                    ].map((m) => (
                      <div key={m.metric} style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{m.metric}</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                          <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{m.score}</strong>
                          <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>{m.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeAppTab === 'interview' && (
                <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        1-ON-1 AI AVATAR MOCK INTERVIEW ROOM
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                        Technical System Design &amp; DSA Grilling
                      </h3>
                    </div>
                    <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: '12px', fontWeight: 800 }}>
                      Live AI Speech Griller Active
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
                    <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#7C3AED', color: '#FFF', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
                          P
                        </div>
                        <div>
                          <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Ms. Priya (AI Interviewer)</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Senior Technical Lead</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '14px' }}>
                        &quot;Let us discuss cache coherence. When scaling your write-heavy service to 50,000 requests/sec, how do you handle cache stampede and TTL eviction without degrading database connection pools?&quot;
                      </p>
                      <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0, 163, 255, 0.08)', border: '1px solid rgba(0, 163, 255, 0.2)', fontSize: '12.5px', color: 'var(--accent)' }}>
                        <strong>Live Speech Metric:</strong> 138 WPM Pace · 0 Filler Words · Strong Technical Confidence
                      </div>
                    </div>

                    <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Interview Scorecard</span>
                        <div style={{ fontSize: '32px', fontWeight: 900, color: '#10B981', margin: '8px 0 12px' }}>
                          9.2 <span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>/ 10</span>
                        </div>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                          <li>✓ System Architecture: 8.8/10</li>
                          <li>✓ Coding Edge Cases: 9.4/10</li>
                          <li>✓ Communication &amp; EQ: 9.5/10</li>
                        </ul>
                      </div>
                      <button type="button" className="pc-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }} onClick={handleLoginClick}>
                        Start AI Mock Session →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeAppTab === 'vault' && (
                <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        CRYPTOGRAPHIC PROOF VAULT &amp; ATS OPTIMIZER
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                        Verifiable Proof-of-Work &amp; Resume Intelligence
                      </h3>
                    </div>
                    <span style={{ padding: '6px 14px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', fontSize: '12px', fontWeight: 800 }}>
                      94% ATS Match Score (Top 2%)
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                    <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>SHA-256 Verified Credentials</span>
                      <strong style={{ fontSize: '16px', display: 'block', color: 'var(--text-primary)', margin: '8px 0 6px' }}>
                        Full-Stack Microservices Architecture
                      </strong>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Verified via automated GitHub test suites and code-audit AST parser.
                      </p>
                      <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#040711', fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#10B981', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Hash: 0x7F9B8A2C91D4E3F8...4C1E
                      </div>
                    </div>

                    <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>ATS Keyword Gap Optimizer</span>
                      <strong style={{ fontSize: '16px', display: 'block', color: 'var(--text-primary)', margin: '8px 0 6px' }}>
                        3 Missing High-Impact Keywords Identified
                      </strong>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Targeting Senior SDE Roles at Google, Microsoft, and Amazon.
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '11px', fontWeight: 700 }}>+ Distributed Systems</span>
                        <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '11px', fontWeight: 700 }}>+ gRPC &amp; Protobuf</span>
                        <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '11px', fontWeight: 700 }}>+ CI/CD Pipeline</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Complete 8-Module Feature Architecture Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px'
            }}>
              {[
                {
                  num: '01',
                  title: 'AI Dynamic Roadmaps & S-Curve Paths',
                  desc: 'Multi-roadmap tab builder, personalized weekly milestone timelines, skill gap detection, and real-time pacing adjustments.'
                },
                {
                  num: '02',
                  title: '24/7 Voice AI Avatar Mentorship',
                  desc: 'Real-time speech dialogue with Ms. Priya (EQ & Communication Coach) and Mr. Akash (Architecture & Technical Grilling).'
                },
                {
                  num: '03',
                  title: 'Interactive Coding Quests & Lessons',
                  desc: 'Granular chapter-by-chapter exercises, browser-based code verification, and persistent S-curve progress tracking.'
                },
                {
                  num: '04',
                  title: 'AI Group Discussion Debate Arena',
                  desc: 'Simulated 5-person multi-avatar roundtables, turn-taking speech cadence, and real-time leadership scoring.'
                },
                {
                  num: '05',
                  title: 'Roleplay Crisis Incident Simulators',
                  desc: 'High-pressure incident roleplay (UPI payment cascade, SSO lockout, PII leak) tested against top mental models.'
                },
                {
                  num: '06',
                  title: 'Global Code Wars & Tournaments',
                  desc: '1v1 algorithmic duels, daily streak multipliers, global XP ranking ladders, weekly hackathons, and bug bounties.'
                },
                {
                  num: '07',
                  title: 'Cryptographic Skill Passports & Vault',
                  desc: 'Verifiable proof-of-work project vault, GitHub repository audits, and tamper-proof skill credential hashes.'
                },
                {
                  num: '08',
                  title: 'Campus Placement & Recruiter OS',
                  desc: 'Placement director cohort dashboards, NAAC Grade A+ & NIRF 1-click reports, and 95% AI match candidate shortlisting.'
                }
              ].map((feature) => (
                <div
                  key={feature.num}
                  className="glass-card"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-color)',
                    transition: 'transform 0.25s ease, border-color 0.25s ease'
                  }}
                >
                  <div>
                    <div style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: 'var(--accent)',
                      marginBottom: '12px'
                    }}>
                      FEATURE {feature.num}
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: '1.3' }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. AI-POWERED ROADMAP EXPERIENCE SECTION */}
        <section id="ai-roadmap" className="ai-roadmap-section section-padding alt-bg">
          <div className="container">
            <h2 className="mb-8 text-left section-title-lg">AI-Powered Roadmap Experience</h2>
            <div className="roadmap-experience-grid">
              {/* Left Profile & AI Analysis Box */}
              <div className="re-left">
                <div className="profile-and-analysis-box">
                  <div className="profile-header">
                    <div className="avatar-photo-circle">
                      <span className="avatar-emoji" aria-hidden />
                    </div>
                    <div className="profile-details">
                      <span className="info-lbl-sm">Your Profile</span>
                      <h3 className="profile-name">Arjun Sharma</h3>
                      <p className="profile-sub">B.Tech CSE | 2nd Year</p>
                      <p className="profile-meta">Goal: Full Stack Developer</p>
                      <p className="profile-meta">Target Companies: Google, Microsoft</p>
                      <p className="profile-meta">Available Time: 2-3 hrs/day</p>
                    </div>
                  </div>

                  <div className="ai-analysis-part">
                    <h4 className="analytics-title">AI Analysis</h4>
                    <ul className="check-list">
                      <li><span className="check-icon">✓</span> Current Skills Assessment</li>
                      <li><span className="check-icon">✓</span> Aptitude & IQ Analysis</li>
                      <li><span className="check-icon">✓</span> Strengths & Weaknesses</li>
                      <li><span className="check-icon">✓</span> Learning Style Detection</li>
                      <li><span className="check-icon">✓</span> Career Interest Mapping</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right 4 Phases Horizontal Roadmap Pipeline */}
              <div className="re-right">
                <h3 className="rm-section-head">Your Personalized Roadmap</h3>
                <div className="phases-timeline-row">
                  <div className="phase-card">
                    <span className="phase-num-tag">Phase 1</span>
                    <h4 className="phase-head">Foundation</h4>
                    <span className="phase-dur">4 Weeks</span>
                    <ul className="phase-check-items">
                      <li><span className="chk">✓</span> Web Basics</li>
                      <li><span className="chk">✓</span> JavaScript</li>
                      <li><span className="chk">✓</span> Git & GitHub</li>
                    </ul>
                  </div>
                  <div className="phase-arrow-icon">→</div>

                  <div className="phase-card">
                    <span className="phase-num-tag">Phase 2</span>
                    <h4 className="phase-head">Frontend</h4>
                    <span className="phase-dur">6 Weeks</span>
                    <ul className="phase-check-items">
                      <li><span className="chk">✓</span> React</li>
                      <li><span className="chk">✓</span> Tailwind CSS</li>
                      <li><span className="chk">✓</span> State Management</li>
                    </ul>
                  </div>
                  <div className="phase-arrow-icon">→</div>

                  <div className="phase-card">
                    <span className="phase-num-tag">Phase 3</span>
                    <h4 className="phase-head">Backend</h4>
                    <span className="phase-dur">6 Weeks</span>
                    <ul className="phase-check-items">
                      <li><span className="chk">✓</span> Node.js</li>
                      <li><span className="chk">✓</span> Express</li>
                      <li><span className="chk">✓</span> Database</li>
                    </ul>
                  </div>
                  <div className="phase-arrow-icon">→</div>

                  <div className="phase-card">
                    <span className="phase-num-tag">Phase 4</span>
                    <h4 className="phase-head">Projects</h4>
                    <span className="phase-dur">6 Weeks</span>
                    <ul className="phase-check-items">
                      <li><span className="chk">✓</span> Industry Projects</li>
                      <li><span className="chk">✓</span> Deployment</li>
                      <li><span className="chk">✓</span> Portfolio</li>
                    </ul>
                  </div>
                </div>
                <p className="roadmap-footer-note">
                  AI continuously updates your roadmap based on your progress, performance, and company requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CODE WARS & COMPETITIONS SECTION */}
        <section id="code-wars" className="code-wars-section section-padding alt-bg">
          <div className="container code-wars-grid">
            <div className="cw-left">
              <h2>Code Wars & Competitions</h2>
              <p className="section-desc">
                Practice. Compete. Improve. Win. Daily challenges, weekly leagues, coding battles, and hackathons to test your skills and rank globally.
              </p>

              {/* Live Leaderboard Card */}
              <div className="glass-card leaderboard-card mb-6">
                <div className="lb-header-bar">
                  <span className="live-dot">●</span> Live Leaderboard
                </div>
                <table className="lb-table">
                  <tbody>
                    <tr>
                      <td className="rank-col">🥇 1</td>
                      <td className="user-col"><div className="user-avatar-tiny" aria-hidden /> Riya Singh</td>
                      <td className="xp-col">2450 XP</td>
                    </tr>
                    <tr>
                      <td className="rank-col">🥈 2</td>
                      <td className="user-col"><div className="user-avatar-tiny" aria-hidden /> Arjun Dev</td>
                      <td className="xp-col">2330 XP</td>
                    </tr>
                    <tr>
                      <td className="rank-col">🥉 3</td>
                      <td className="user-col"><div className="user-avatar-tiny" aria-hidden /> Karthik S.</td>
                      <td className="xp-col">2150 XP</td>
                    </tr>
                    <tr className="highlight-user-row">
                      <td className="rank-col">🏅 4</td>
                      <td className="user-col"><div className="user-avatar-tiny" aria-hidden /> <strong>You</strong></td>
                      <td className="xp-col"><strong>1980 XP</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button type="button" className="pc-btn-purple-outline pc-btn-wide" onClick={handleLoginClick}>Explore Code Wars</button>
              <div className="cw-tags-row">
                <span className="cw-tag">Algorithms</span>
                <span className="cw-tag">Data Structures</span>
                <span className="cw-tag">System Design</span>
                <span className="cw-tag">Debugging</span>
                <span className="cw-tag">AI Challenges</span>
                <span className="cw-tag">Company Challenges</span>
              </div>
            </div>

            {/* Right Side: Dual Student VS Illustration & Upcoming Events */}
            <div className="cw-right">
              {/* Dual Coders VS Graphic */}
              <div className="vs-illustration-box">
                <div className="coder-card left-coder">
                  <div className="coder-avatar-frame" aria-hidden />
                </div>
                <div className="vs-badge-glow">VS</div>
                <div className="coder-card right-coder">
                  <div className="coder-avatar-frame" aria-hidden />
                </div>
              </div>

              {/* Upcoming Events List */}
              <div className="upcoming-events-card">
                <h4 className="events-head">Upcoming Events</h4>
                
                <div className="event-row">
                  <div className="event-icon-badge bg-purple-light" aria-hidden />
                  <div className="event-info">
                    <strong>Array Battle</strong>
                    <span>Today, 8:00 PM</span>
                  </div>
                  <button className="pc-btn-purple-outline btn-xs">Join</button>
                </div>

                <div className="event-row">
                  <div className="event-icon-badge bg-green-light" aria-hidden />
                  <div className="event-info">
                    <strong>Weekly Contest</strong>
                    <span>Sat, 10:00 AM</span>
                  </div>
                  <button className="pc-btn-purple-outline btn-xs">Join</button>
                </div>

                <div className="event-row">
                  <div className="event-icon-badge bg-blue-light" aria-hidden />
                  <div className="event-info">
                    <strong>Hackathon</strong>
                    <span>Next Week</span>
                  </div>
                  <button className="pc-btn-purple-outline btn-xs">Register</button>
                </div>

                <div className="event-row">
                  <div className="event-icon-badge bg-amber-light" aria-hidden />
                  <div className="event-info">
                    <strong>Bug Bounty</strong>
                    <span>Ongoing</span>
                  </div>
                  <button className="pc-btn-purple-outline btn-xs">Participate</button>
                </div>

                <div className="view-events-footer">
                  <a href="#code-wars" className="view-all-link">View All Events →</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FOR COMPANIES SECTION */}
        <section id="for-companies" className="for-companies-section section-padding">
          <div className="container">
            <span className="tag-pill-sub">For Companies</span>
            <h2 className="section-title-lg mb-2">Hire Future-Ready Talent</h2>
            <p className="section-desc mb-6 max-w-2xl">
              Post your requirements and let our AI find, train, and recommend the right students for your roles.
            </p>
            <ul className="company-checklist mb-8">
              <li><span className="chk">✓</span> Post role requirements</li>
              <li><span className="chk">✓</span> Get AI-generated skill roadmap</li>
              <li><span className="chk">✓</span> Access pre-assessed talent pool</li>
              <li><span className="chk">✓</span> Conduct challenges & interviews</li>
              <li><span className="chk">✓</span> Hire interns & full-time talent</li>
            </ul>
            <button type="button" className="pc-btn-primary mb-12" onClick={handleLoginClick}>I'm a hiring manager</button>
            
            {/* 4-Step Recruitment Pipeline */}
            <div className="hiring-flow-grid">
              <div className="h-step-card">
                <span className="h-step-title">You Post Requirement</span>
                <div className="h-card-inner">
                  <strong className="role-head">React Developer</strong>
                  <p className="req-skills">Skills: React, Node.js, MongoDB, AWS</p>
                  <p className="req-exp">Experience: Fresher / Intern</p>
                </div>
              </div>
              <div className="h-arrow-sep">→</div>

              <div className="h-step-card">
                <span className="h-step-title">AI Creates Roadmap</span>
                <div className="h-card-inner">
                  <ul className="h-check-list">
                    <li><span className="chk">✓</span> Skills Gap Analysis</li>
                    <li><span className="chk">✓</span> Personalized Learning Path</li>
                    <li><span className="chk">✓</span> Projects & Challenges</li>
                    <li><span className="chk">✓</span> Interview Preparation</li>
                  </ul>
                </div>
              </div>
              <div className="h-arrow-sep">→</div>

              <div className="h-step-card">
                <span className="h-step-title">Students Get Trained</span>
                <div className="h-card-inner">
                  <ul className="h-badge-list">
                    <li><span className="b-icon">📚</span> Learn</li>
                    <li><span className="b-icon">🔨</span> Build</li>
                    <li><span className="b-icon">⚔️</span> Compete</li>
                    <li><span className="b-icon">Verified</span> Get Verified</li>
                  </ul>
                </div>
              </div>
              <div className="h-arrow-sep">→</div>

              <div className="h-step-card">
                <span className="h-step-title">You Hire Top Talent</span>
                <div className="h-card-inner">
                  <p className="shortlist-lbl">Shortlisted Candidates</p>
                  <p className="match-lbl">AI Match Score</p>
                  <div className="candidates-avatars-row">
                    <div className="c-avatar" aria-hidden />
                    <div className="c-avatar" aria-hidden />
                    <div className="c-avatar" aria-hidden />
                    <span className="match-badge">95% Match</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Logos Bar */}
            <div className="company-trust-footer mt-12 text-center">
              <p className="trust-companies-text">Recruiters move beyond resumes. Universities measure employability. Students finally know where they fit.</p>
            </div>
          </div>
        </section>

        {/* 8. TRANSPARENT PRICING & PIN ECONOMY SECTION */}
        <section id="pricing" className="pricing-section section-padding alt-bg">
          <div className="container">
            <div className="text-center mb-10">
              <span className="tag-pill-sub">Plans &amp; Pin Economy</span>
              <h2 className="section-title-lg mt-2 mb-4">Transparent Plans for Every Ambition</h2>
              <p className="section-desc max-w-2xl">
                Start completely free. Earn Pins by solving missions and building real projects, or unlock institutional power for your entire campus.
              </p>
            </div>

            {/* Pricing Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '48px'
            }}>
              {/* Student Free */}
              <div className="glass-card" style={{
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Student Free</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '12px 0 16px' }}>
                    <span style={{ fontSize: '40px', fontWeight: 900, color: 'var(--text-primary)' }}>₹0</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>/ forever</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                    Everything you need to discover your strengths, generate your personalized roadmap, and join student communities.
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {[
                      '50 Starter Pins upon signup',
                      'Full AI Career Identity Assessment',
                      'Personalized S-Curve Learning Roadmaps',
                      'Basic AI Mentor Doubt Solving',
                      'Peer Code Wars & Leaderboard Access'
                    ].map((item) => (
                      <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button type="button" className="pc-btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLoginClick}>
                  Start free forever
                </button>
              </div>

              {/* Pro Career Pass (Highlighted) */}
              <div className="glass-card" style={{
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1.5px solid var(--accent)',
                position: 'relative',
                boxShadow: '0 20px 48px rgba(0, 163, 255, 0.2)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  background: 'linear-gradient(135deg, #5ad0ff, #0077cc)',
                  color: '#041018',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Most popular
                </div>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pro Career Pass</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '12px 0 16px' }}>
                    <span style={{ fontSize: '40px', fontWeight: 900, color: 'var(--text-primary)' }}>₹499</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>/ month or ₹99 pin packs</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                    For ambitious students aiming for top-tier tech roles, high-paying placements, and 1-on-1 AI interview coaching.
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {[
                      'Unlimited AI Mock Interviews with Live Feedback',
                      '24/7 Voice AI Avatar Guidance (Priya & Akash)',
                      'ATS Resume Builder & Instant Gap Optimizer',
                      'Cryptographic Skill Passport Verification',
                      'Direct Recruiter Priority Matching'
                    ].map((item) => (
                      <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>
                        <span style={{ fontWeight: 600 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button type="button" className="pc-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLoginClick}>
                  Unlock Pro features →
                </button>
              </div>

              {/* Enterprise Campus */}
              <div className="glass-card" style={{
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Campus Operating System</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '12px 0 16px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)' }}>Institutional</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>/ custom</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
                    Empower your entire college or university with centralized employability tracking, automated NAAC/NIRF reporting, and recruiter drives.
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {[
                      'Full Campus Placement Director Dashboard',
                      'Real-time Cohort Skill & Employability Analytics',
                      '1-Click NAAC Grade A+ & NIRF Placement Exports',
                      'Custom Campus Hackathons & Code Battle Arenas',
                      'Dedicated Account Manager & Campus Integration'
                    ].map((item) => (
                      <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  className="pc-btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => document.getElementById('campus-demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Schedule campus demo
                </button>
              </div>
            </div>

            {/* How to Earn Free Pins Box */}
            <div className="glass-card" style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>⚡ Always Free to Earn: The Pin Economy</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Students don&apos;t have to pay. Earn Pins continuously by engaging in learning, challenges, and building real skills.
                  </p>
                </div>
                <span className="badge-pill" style={{ margin: 0 }}>No Paywall on Learning</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px'
              }}>
                {[
                  { icon: '⚡', label: 'Complete a Mission', amount: '+10 pins' },
                  { icon: '📝', label: 'Pass an Exam', amount: '+25 pins' },
                  { icon: '🎙️', label: 'Mock Interview', amount: '+15 pins' },
                  { icon: '📚', label: 'Study Session', amount: '+5 pins' },
                  { icon: '🧬', label: 'Career Onboarding', amount: '+50 pins' },
                  { icon: '✓', label: 'Vault Item Verified', amount: '+20 pins' },
                  { icon: '🔥', label: '7-Day Streak Bonus', amount: '+15 pins' },
                  { icon: '🌅', label: 'Daily Active Login', amount: '+3 pins' },
                ].map((way) => (
                  <div
                    key={way.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'color-mix(in srgb, var(--bg-card-solid) 80%, transparent)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{way.icon}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{way.label}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>{way.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 9. CAMPUS CONSULTATION & DEMO BOOKING SECTION */}
        <section id="campus-demo" className="campus-demo-section section-padding">
          <div className="container" style={{ maxWidth: '880px' }}>
            <div className="glass-card" style={{ padding: '40px', border: '1px solid var(--border-color)' }}>
              <div className="text-center mb-8">
                <span className="tag-pill-sub">Campus Consultation</span>
                <h2 className="section-title-lg mt-2 mb-2">Transform Your Campus Employability</h2>
                <p className="section-desc" style={{ maxWidth: '580px', margin: '0 auto' }}>
                  Are you a Placement Director, Principal, or Corporate Recruiter? Schedule an interactive walkthrough tailored to your institution.
                </p>
              </div>

              {demoSubmitted ? (
                <div style={{ textAlign: 'center', padding: '36px 0', animation: 'fadeInUp 0.4s ease' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Demo Request Confirmed!
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '460px', margin: '0 auto 24px' }}>
                    Thank you! Our Institutional Partnerships Team will contact you within 24 hours to schedule your live walkthrough.
                  </p>
                  <button
                    type="button"
                    className="pc-btn-outline"
                    onClick={() => setDemoSubmitted(false)}
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Your Name *</label>
                    <input
                      type="text"
                      required
                      value={demoForm.name}
                      onChange={(e) => setDemoForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Dr. Rajesh Kumar"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-card-solid)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Official Email *</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="rajesh.k@university.edu.in"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-card-solid)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Your Role / Persona</label>
                    <select
                      value={demoForm.role}
                      onChange={(e) => setDemoForm((prev) => ({ ...prev, role: e.target.value }))}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-card-solid)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    >
                      <option value="Placement Director / Principal">Placement Director / Head of Placements</option>
                      <option value="Principal / Dean / HOD">Principal / Dean / HOD</option>
                      <option value="Corporate Recruiter / HR">Corporate Recruiter / Talent Acquisition</option>
                      <option value="Student Placement Coordinator">Student Placement Coordinator</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Institution / Company Name</label>
                    <input
                      type="text"
                      value={demoForm.institution}
                      onChange={(e) => setDemoForm((prev) => ({ ...prev, institution: e.target.value }))}
                      placeholder="e.g. National Institute of Technology"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-card-solid)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Message or Specific Requirements</label>
                    <textarea
                      rows={3}
                      value={demoForm.message}
                      onChange={(e) => setDemoForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us about your batch size, branch, or hiring needs..."
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-card-solid)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '13.5px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                    <button
                      type="submit"
                      disabled={demoLoading}
                      className="pc-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '15px' }}
                    >
                      {demoLoading ? 'Submitting request...' : 'Book Campus Consultation & Demo →'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 10. IDENTITY BAR — signals from the brief, not invented metrics */}
        <section className="stats-bar-section brief-identity-bar">
          <div className="container">
            <p className="brief-identity-bar-kicker">What actually builds a career identity</p>
            <div className="stats-grid-6">
              {[
                ['01', 'Personality'],
                ['02', 'Communication'],
                ['03', 'Skills'],
                ['04', 'Portfolio'],
                ['05', 'Experience'],
                ['06', 'Goals'],
              ].map(([num, label]) => (
                <div className="stat-card" key={label}>
                  <div className="stat-num">{num}</div>
                  <div className="stat-lbl">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FINAL CTA SECTION WITH MASCOT */}
        <section className="final-cta-section section-padding">
          <div className="container final-cta-wrapper">
            <div className="cta-mascot-left">
              <div className="student-mascot-illustration">
                <div className="mascot-avatar-lg" aria-hidden />
              </div>
            </div>
            <div className="cta-content-right">
              <h2 className="cta-heading">
                Degrees will matter. Skills will matter more.<br />
                Understanding yourself will <span className="text-purple">matter the most.</span>
              </h2>
              <p className="cta-sub">
                PinitCareer prepares students not just for their first job — but for an entire lifetime of growth.
              </p>
              <div className="cta-buttons-row">
                <button type="button" className="pc-btn-primary pc-btn-glow-lg" onClick={handleLoginClick}>Start free</button>
                <button type="button" className="pc-btn-outline-lg" onClick={() => document.getElementById('ai-roadmap')?.scrollIntoView({ behavior: 'smooth' })}>Explore paths</button>
              </div>
              <div className="cta-guarantees-row">
                <span>✓ No Credit Card Required</span>
                <span>✓ Free Forever Plan Available</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. FOOTER */}
      <footer className="footer-section">
        <div className="container footer-grid">
          <div className="f-col brand-col">
            <div className="brand-logo mb-4">
              <span className="lp-brand-lockup">
                <img src="/brand/pinit-career-logo-clear.png" alt="PINIT CAREER" className="lp-brand-logo" />
              </span>
            </div>
            <p className="f-desc mb-4">We don&apos;t help students find jobs. We help them discover who they are. Discover · Connect · Grow.</p>
          </div>
          <div className="f-col">
            <h4>Platform</h4>
            <ul>
              <li><a href="#modules">54 Ecosystem Modules</a></li>
              <li><a href="#features">Interactive Sandbox</a></li>
              <li><a href="#career-identity">Career Identity</a></li>
              <li><a href="#how-it-works">How it works</a></li>
              <li><a href="#pricing">Pricing &amp; Pin Hub</a></li>
              <li><a href="#campus-demo">Campus Demo</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/recruiter">For recruiters</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/terms">Terms</a></li>
              <li><a href="/contact">Campus consult</a></li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© 2026 PinitCareer Technologies. All rights reserved.</p>
          <div className="social-icons">
            <span>𝕏</span><span>in</span><span>fb</span><span>ig</span>
          </div>
        </div>
      </footer>

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

      {/* ============================================================== */}
      {/* INLINE CSS WITH SUPPORT FOR BOTH DARK (DEFAULT) AND LIGHT MODE */}
      {/* ============================================================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

        :root {
          /* Dark mode variables (Default) */
          --bg-primary: #080A1A;
          --bg-secondary: #0F1225;
          --bg-card: rgba(15, 18, 40, 0.75);
          --bg-card-solid: #12152B;
          --text-primary: #FFFFFF;
          --text-secondary: #94A3B8;
          --text-tertiary: #64748B;
          --border-color: rgba(255, 255, 255, 0.08);
          --border-hover: rgba(0, 163, 255, 0.4);
          --accent: #00A3FF;
          --accent-hover: #0088D6;
          --accent-glow: rgba(0, 163, 255, 0.3);
          --accent-cyan: #00A3FF;
          --accent-green: #10B981;
          --accent-amber: #F59E0B;
          --accent-pink: #EC4899;
          --trust-bg: transparent;
          
          --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        [data-theme='light'] {
          --bg-primary: #FFFFFF;
          --bg-secondary: #F8FAFC;
          --bg-card: #FFFFFF;
          --bg-card-solid: #FFFFFF;
          --text-primary: #0F172A;
          --text-secondary: var(--t2);
          --text-tertiary: #94A3B8;
          --border-color: rgba(0, 0, 0, 0.08);
          --border-hover: rgba(0, 136, 214, 0.3);
          --accent: #0077CC;
          --accent-hover: #0062A8;
          --accent-glow: rgba(0, 163, 255, 0.15);
          --trust-bg: #F8FAFC;
        }

        /* GLOBAL RESETS */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { 
          width: 100%; min-height: 100vh; overflow-x: hidden; scroll-behavior: smooth; 
        }
        body {
          font-family: var(--font-body);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        a { text-decoration: none; color: inherit; }
        ul { list-style: none; }
        button { font-family: inherit; cursor: pointer; }
        
        .container {
          max-width: 1200px; margin: 0 auto; padding: 0 24px; width: 100%;
        }
        .section-padding { padding: 80px 0; }
        .alt-bg { background-color: var(--bg-secondary); }
        .mb-4 { margin-bottom: 16px; }
        .mb-6 { margin-bottom: 24px; }
        .mb-8 { margin-bottom: 32px; }
        .mb-10 { margin-bottom: 40px; }
        .mb-12 { margin-bottom: 48px; }
        .mt-2 { margin-top: 8px; }
        .mt-4 { margin-top: 16px; }
        .mt-8 { margin-top: 32px; }
        .mt-12 { margin-top: 48px; }
        .text-center { text-align: center; }
        .max-w-2xl { max-width: 42rem; margin-left: auto; margin-right: auto; }
        .flex-1 { flex: 1; }

        /* TYPOGRAPHY UTILS */
        .text-gradient {
          background: linear-gradient(135deg, #7C3AED, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-accent-green { color: var(--accent-green); }
        h2 { font-size: 36px; font-weight: 800; line-height: 1.2; }
        h3 { font-size: 24px; font-weight: 700; }
        h4 { font-size: 18px; font-weight: 700; }
        .section-desc { font-size: 16px; color: var(--text-secondary); line-height: 1.6; }

        /* BUTTONS */
        .pc-btn-primary {
          background: linear-gradient(135deg, var(--accent), #A855F7);
          color: #FFF; border: none; padding: 12px 24px; border-radius: 50px; font-weight: 700;
          transition: all 0.2s ease; display: inline-flex; align-items: center;
        }
        .pc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px var(--accent-glow); }
        .pc-btn-primary.btn-sm { padding: 8px 16px; font-size: 13px; }
        .pc-btn-primary.btn-lg { padding: 16px 32px; font-size: 18px; }
        .pc-btn-glow { box-shadow: 0 0 20px var(--accent-glow); }
        
        .pc-btn-outline {
          background: transparent; color: var(--text-primary); border: 1.5px solid var(--border-color);
          padding: 12px 24px; border-radius: 50px; font-weight: 600; transition: all 0.2s ease;
        }
        .pc-btn-outline:hover { border-color: var(--accent); color: var(--accent); }
        .pc-btn-outline.btn-sm { padding: 8px 16px; font-size: 13px; }

        /* GLASS CARD */
        .glass-card {
          background: var(--bg-card);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
          border-radius: 20px; padding: 24px;
        }

        /* ANIMATIONS */
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
          100% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(124, 58, 237, 0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }

        /* BACKGROUND ELEMENTS */
        .bg-grid-pattern {
          position: fixed; inset: 0; z-index: -2; pointer-events: none;
          background-image: linear-gradient(var(--border-color) 1px, transparent 1px),
                            linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
          background-size: 40px 40px; opacity: 0.3;
        }
        .floating-blob {
          position: fixed; border-radius: 50%; filter: blur(80px); z-index: -1; pointer-events: none; opacity: 0.4;
        }
        .blob-1 { width: 400px; height: 400px; background: rgba(124, 58, 237, 0.3); top: -100px; left: -100px; animation: float 15s infinite alternate ease-in-out; }
        .blob-2 { width: 300px; height: 300px; background: rgba(6, 182, 212, 0.2); bottom: 10%; right: 5%; animation: float 18s infinite alternate-reverse ease-in-out; }
        .blob-3 { width: 350px; height: 350px; background: rgba(236, 72, 153, 0.2); top: 40%; left: 30%; animation: float 20s infinite alternate ease-in-out; }

        /* 1. NAVBAR */
        .navbar {
          position: sticky; top: 0; z-index: 100; height: 64px;
          background: var(--bg-card); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-color);
        }
        .nav-container { display: flex; align-items: center; justify-content: space-between; height: 100%; max-width: 1400px; margin: 0 auto; padding: 0 24px; }
        .brand-logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 18px; letter-spacing: -0.5px; }
        .pi-icon { background: linear-gradient(135deg, #7C3AED, #A855F7); color: var(--card); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 16px; }
        
        .nav-center { display: flex; gap: 24px; align-items: center; }
        .nav-link { font-size: 13px; font-weight: 500; color: var(--text-secondary); transition: color 0.2s; }
        .nav-link:hover { color: var(--accent); }
        
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .theme-toggle-btn { background: none; border: none; font-size: 18px; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--bg-card-solid); border: 1px solid var(--border-color); width: 36px; height: 36px; }
        .nav-login-btn { background: transparent; color: var(--text-primary); border: none; font-size: 14px; font-weight: 600; }
        .nav-cta { padding: 8px 20px; font-size: 13px; }
        .mobile-menu-btn { display: none; background: none; border: none; font-size: 24px; color: var(--text-primary); }

        @media (max-width: 1024px) {
          .nav-center { display: none; position: absolute; top: 64px; left: 0; right: 0; background: var(--bg-primary); flex-direction: column; padding: 24px; border-bottom: 1px solid var(--border-color); }
          .nav-center.mobile-open { display: flex; }
          .mobile-menu-btn { display: block; }
          .nav-cta { display: none; }
        }

        /* 2. HERO SECTION */
        .hero-section { padding-top: 80px; padding-bottom: 60px; }
        .hero-grid { display: flex; align-items: center; gap: 40px; }
        .hero-left { flex: 0 0 55%; max-width: 55%; }
        .hero-right { flex: 0 0 45%; max-width: 45%; }
        
        .badge-pill { display: inline-block; background: rgba(124, 58, 237, 0.15); color: var(--accent); padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; margin-bottom: 24px; border: 1px solid rgba(124, 58, 237, 0.3); }
        .hero-title { font-size: 48px; font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 24px; }
        .hero-subtitle { font-size: 16px; color: var(--text-secondary); line-height: 1.7; max-width: 540px; margin-bottom: 32px; }
        
        .feature-chips { display: flex; gap: 16px; margin-bottom: 36px; flex-wrap: wrap; }
        .feature-chip { display: flex; align-items: center; gap: 12px; background: var(--bg-card); padding: 8px 16px 8px 8px; border-radius: 50px; border: 1px solid var(--border-color); }
        .chip-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(124,58,237,0.1); display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .chip-text { display: flex; flex-direction: column; font-size: 12px; }
        .chip-text strong { color: var(--text-primary); font-size: 13px; }
        .chip-text span { color: var(--text-tertiary); font-size: 11px; line-height: 1.2; }
        
        .hero-ctas { display: flex; gap: 12px; margin-bottom: 40px; flex-wrap: wrap; }
        .trust-text { font-size: 12px; color: var(--text-tertiary); margin-bottom: 12px; font-weight: 500; }
        .company-logos { display: flex; gap: 24px; flex-wrap: wrap; color: var(--text-primary); opacity: 0.6; font-weight: 700; font-size: 18px; font-family: var(--font-body); }

        .hub-diagram { position: relative; width: 100%; max-width: 580px; aspect-ratio: 1; margin: -20px auto 0; display: flex; align-items: center; justify-content: center; }
        .hub-center-hex { position: relative; display: flex; align-items: center; justify-content: center; z-index: 10; width: 220px; height: 220px; }
        .hub-center-labels { position: absolute; bottom: 32px; left: 0; right: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; pointer-events: none; z-index: 12; }
        .hub-brand-name { font-weight: 900; font-size: 13.5px; letter-spacing: 1px; color: #FFFFFF; text-shadow: 0 2px 6px rgba(0,0,0,0.4); line-height: 1; }
        .hub-sub-name { font-size: 9.5px; color: rgba(255,255,255,0.95); font-weight: 600; margin-top: 3px; }

        .hub-lines-svg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }

        .hub-node { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; z-index: 5; width: 130px; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
        .hub-node:hover { transform: scale(1.1) translateY(-2px); }
        .node-icon-circle { width: 52px; height: 52px; border-radius: 50%; background: #FFFFFF; border: 2px solid rgba(124, 58, 237, 0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 8px 24px rgba(124, 58, 237, 0.16); margin-bottom: 6px; transition: all 0.2s ease; }
        .hub-node:hover .node-icon-circle { border-color: #7C3AED; box-shadow: 0 10px 28px rgba(124, 58, 237, 0.25); }
        .node-title { font-size: 12.5px; color: #0F172A; font-weight: 800; line-height: 1.2; display: block; letter-spacing: -0.2px; }
        .node-desc { font-size: 10px; color: #64748B; font-weight: 600; display: block; margin-top: 2px; line-height: 1.3; }

        .node-top { top: -2%; left: 50%; transform: translateX(-50%); }
        .node-top-right { top: 8%; right: 4%; }
        .node-right { top: 50%; right: -5%; transform: translateY(-50%); }
        .node-bottom-right { bottom: 8%; right: 4%; }
        .node-bottom { bottom: -2%; left: 50%; transform: translateX(-50%); }
        .node-bottom-left { bottom: 8%; left: 4%; }
        .node-left { top: 50%; left: -5%; transform: translateY(-50%); }
        .node-top-left { top: 8%; left: 4%; }

        @media (max-width: 900px) {
          .hero-grid { flex-direction: column; text-align: center; gap: 32px; }
          .hero-left, .hero-right { flex: 0 0 100%; max-width: 100%; }
          .hero-title { font-size: 32px; line-height: 1.2; letter-spacing: -0.5px; margin-bottom: 16px; }
          .hero-subtitle { font-size: 14px; margin: 0 auto 24px auto; }
          .feature-chips { justify-content: center; }
          .hero-ctas { justify-content: center; width: 100%; }
          .hero-ctas a, .hero-ctas button { width: 100%; text-align: center; justify-content: center; }
          .company-logos { justify-content: center; font-size: 15px; gap: 16px; }
          
          /* Mobile Hub Diagram Optimization */
          .hub-diagram { aspect-ratio: auto; height: auto; display: flex; flex-direction: column; align-items: center; gap: 20px; margin: 0 auto; max-width: 100%; }
          .hub-center-hex { width: 160px; height: 160px; }
          .hub-center-hex svg { width: 160px; height: 160px; }
          .hub-brand-name { font-size: 11px; }
          .hub-sub-name { font-size: 8px; }
          .hub-lines-svg { display: none; }
          .hub-node { position: static; transform: none !important; width: 100%; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 12px; flex-direction: row; text-align: left; gap: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
          .node-icon-circle { margin-bottom: 0; width: 40px; height: 40px; font-size: 20px; flex-shrink: 0; }
          .node-text-wrap { display: flex; flex-direction: column; }
        }

        /* 3. WHAT IS PINITCAREER */
        .what-is-grid { display: flex; gap: 40px; align-items: flex-start; }
        .what-is-left { flex: 0 0 52%; max-width: 52%; }
        .what-is-right { flex: 0 0 48%; max-width: 48%; display: flex; flex-direction: column; gap: 20px; }
        
        .bold-line { font-size: 18px; font-weight: 800; margin-top: 10px; color: var(--text-primary); }
        .text-purple { color: #7C3AED; }
        
        .features-grid-2x3 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 28px 0; }
        .feature-item { display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .icon-circ { width: 36px; height: 36px; border-radius: 50%; background: rgba(124,58,237,0.08); border: 1px solid rgba(124,58,237,0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        
        .journey-steps-wrapper { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .journey-steps-wrapper h4 { margin-bottom: 20px; font-size: 15px; text-align: center; font-weight: 800; color: var(--text-primary); }
        .journey-steps { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
        .j-step { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--text-primary); }
        .j-icon-bg { width: 44px; height: 44px; border-radius: 50%; background: #F8FAFC; border: 1.5px solid #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .j-arrow { color: #94A3B8; font-weight: bold; font-size: 14px; margin-bottom: 22px; }

        /* Student Dashboard Preview Cards */
        .welcome-card { padding: 24px; border-radius: 24px; border: 1px solid var(--border-color); background: var(--bg-card); }
        .welcome-header h3 { font-size: 20px; font-weight: 800; color: var(--text-primary); margin-bottom: 18px; }
        .welcome-body-grid { display: flex; gap: 20px; align-items: center; }
        .ai-chat-box { flex: 1; display: flex; gap: 12px; background: rgba(124, 58, 237, 0.05); border: 1px solid rgba(124, 58, 237, 0.15); padding: 16px; border-radius: 16px; }
        .ai-avatar-small { font-size: 24px; flex-shrink: 0; }
        .ai-msg-content { display: flex; flex-direction: column; gap: 6px; }
        .ai-msg-title { font-size: 12px; font-weight: 800; color: #7C3AED; }
        .ai-msg-text { font-size: 12px; color: var(--text-secondary); line-height: 1.4; }
        .pc-btn-purple-sm { align-self: flex-start; padding: 6px 14px; border-radius: 50px; background: #7C3AED; color: #FFFFFF; font-size: 11px; font-weight: 700; border: none; cursor: pointer; margin-top: 4px; }
        
        .readiness-score-box { display: flex; flex-direction: column; align-items: center; text-align: center; width: 140px; flex-shrink: 0; background: #FFFFFF; padding: 14px; border-radius: 18px; border: 1px solid #E2E8F0; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
        .score-heading { font-size: 10.5px; font-weight: 800; color: var(--t2); margin-bottom: 8px; line-height: 1.2; text-transform: uppercase; letter-spacing: 0.3px; }
        .score-gauge { position: relative; width: 84px; height: 84px; display: flex; align-items: center; justify-content: center; }
        .score-center-val { position: absolute; font-size: 18px; font-weight: 900; color: #0F172A; }
        .score-subtext { font-size: 10px; color: #10B981; font-weight: 700; margin-top: 6px; }

        /* Timeline Cards (5 Phases) */
        .roadmap-preview-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; }
        .roadmap-preview-card h4 { margin-bottom: 16px; font-size: 16px; font-weight: 800; color: var(--text-primary); }
        .timeline-cards-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .t-card { background: #FFFFFF; padding: 12px 10px; border-radius: 14px; border: 1px solid #E2E8F0; border-top: 3px solid #CBD5E1; display: flex; flex-direction: column; text-align: left; position: relative; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .t-card.border-t-green { border-top-color: #10B981; }
        .t-card.border-t-amber { border-top-color: #F59E0B; }
        .t-card.border-t-purple { border-top-color: #7C3AED; }
        .week-label { font-size: 9.5px; font-weight: 700; color: #94A3B8; margin-bottom: 4px; }
        .phase-title { font-size: 12px; font-weight: 800; color: #0F172A; line-height: 1.2; }
        .tech-stack-sub { font-size: 9.5px; color: #64748B; margin: 4px 0 10px 0; line-height: 1.2; }
        .status-badge { font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 50px; display: inline-block; align-self: flex-start; text-transform: uppercase; letter-spacing: 0.3px; }
        .status-done { background: #ECFDF5; color: var(--green); }
        .status-prog { background: #FFFBEB; color: #D97706; }
        .status-next { background: #F3E8FF; color: #7C3AED; }

        /* Dual Action Cards Row */
        .action-cards-row { display: flex; gap: 16px; }
        .action-card { flex: 1; padding: 20px; border-radius: 20px; border: 1px solid var(--border-color); background: var(--bg-card); display: flex; flex-direction: column; justify-content: space-between; }
        .action-lbl { font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .action-title { font-size: 14px; font-weight: 800; color: var(--text-primary); line-height: 1.3; }
        .action-meta { font-size: 11.5px; font-weight: 700; color: #7C3AED; margin: 8px 0 14px 0; }
        .pc-btn-purple-outline { padding: 8px 18px; border-radius: 50px; border: 1.5px solid #7C3AED; background: transparent; color: #7C3AED; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .pc-btn-purple-outline:hover { background: #7C3AED; color: #FFFFFF; }

        @media (max-width: 900px) {
          .what-is-grid { flex-direction: column; }
          .what-is-left, .what-is-right { flex: 0 0 100%; max-width: 100%; }
          .features-grid-2x3 { grid-template-columns: 1fr; }
          .timeline-cards { grid-template-columns: 1fr 1fr; }
          .action-cards-row { flex-direction: column; }
        }

        /* 4. HOW STUDENTS GAIN */
        .how-gain-section { background: var(--bg-secondary); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); }
        .section-title-lg { font-size: 32px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; }
        .gain-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 18px; margin-top: 40px; }
        .gain-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 24px 18px; text-align: center; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .gain-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(124, 58, 237, 0.12); border-color: rgba(124, 58, 237, 0.3); }
        .g-icon-illustration { margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; }
        .gain-card h3 { font-size: 14.5px; font-weight: 800; color: #0F172A; margin-bottom: 10px; line-height: 1.3; }
        .gain-card p { font-size: 11.5px; color: #64748B; line-height: 1.5; font-weight: 500; }
        @media (max-width: 1200px) { .gain-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .gain-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .gain-grid { grid-template-columns: 1fr; } }

        /* 5. AI ROADMAP EXPERIENCE */
        .roadmap-experience-grid { display: flex; gap: 32px; margin-top: 24px; align-items: stretch; }
        .re-left { flex: 0 0 36%; max-width: 36%; display: flex; flex-direction: column; }
        .re-right { flex: 0 0 64%; max-width: 64%; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; padding: 28px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; overflow-x: auto; }
        
        .profile-and-analysis-box { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
        .profile-header { display: flex; gap: 14px; margin-bottom: 20px; align-items: flex-start; }
        .avatar-photo-circle { width: 56px; height: 56px; border-radius: 50%; background: #F3E8FF; border: 2px solid #7C3AED; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .avatar-emoji { font-size: 30px; }
        .info-lbl-sm { font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
        .profile-name { font-size: 17px; font-weight: 800; color: #0F172A; line-height: 1.2; }
        .profile-sub { font-size: 11.5px; color: #64748B; font-weight: 600; margin-bottom: 6px; }
        .profile-meta { font-size: 11px; color: #334155; font-weight: 600; line-height: 1.4; }
        
        .ai-analysis-part { border-top: 1px dashed #E2E8F0; padding-top: 18px; margin-top: 12px; }
        .analytics-title { font-size: 13.5px; font-weight: 800; color: #7C3AED; margin-bottom: 12px; }
        .check-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .check-list li { font-size: 12px; font-weight: 600; color: #334155; display: flex; align-items: center; gap: 8px; }
        .check-icon { color: #10B981; font-weight: 900; }

        .rm-section-head { font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 24px; }
        .phases-timeline-row { display: flex; align-items: stretch; justify-content: space-between; gap: 8px; overflow-x: auto; padding-bottom: 8px; }
        .phase-card { flex: 1; min-width: 140px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; flex-shrink: 0; }
        .phase-num-tag { font-size: 10px; font-weight: 800; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .phase-head { font-size: 14px; font-weight: 800; color: #0F172A; margin-bottom: 2px; }
        .phase-dur { font-size: 11px; color: #64748B; font-weight: 600; margin-bottom: 12px; }
        .phase-check-items { list-style: none; display: flex; flex-direction: column; gap: 6px; font-size: 11px; color: #334155; font-weight: 600; }
        .phase-check-items .chk { color: #10B981; font-weight: bold; }
        .phase-arrow-icon { color: #94A3B8; font-weight: bold; font-size: 16px; align-self: center; flex-shrink: 0; }
        .roadmap-footer-note { font-size: 11px; color: #64748B; font-style: italic; text-align: center; margin-top: 24px; }

        /* 6. CODE WARS */
        .code-wars-grid { display: flex; gap: 40px; align-items: flex-start; }
        .cw-left { flex: 0 0 45%; max-width: 45%; overflow: hidden; }
        .cw-right { flex: 0 0 55%; max-width: 55%; display: flex; flex-direction: column; gap: 20px; }
        
        .leaderboard-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); overflow-x: auto; }
        .lb-header-bar { font-size: 12px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; display: flex; align-items: center; gap: 6px; }
        .live-dot { color: #EF4444; font-size: 14px; }
        .lb-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
        .lb-table td { padding: 8px 10px; border-bottom: 1px solid #F1F5F9; white-space: nowrap; }
        .rank-col { font-weight: 800; color: #0F172A; width: 44px; }
        .user-col { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #334155; }
        .user-avatar-tiny { font-size: 16px; }
        .xp-col { text-align: right; font-family: var(--font-mono); font-weight: 800; color: #7C3AED; }
        .highlight-user-row { background: #F3E8FF; border-radius: 8px; }
        .pc-btn-wide { width: 100%; text-align: center; margin-bottom: 16px; }
        .cw-tags-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .cw-tag { background: #FFFFFF; border: 1px solid #E2E8F0; padding: 4px 10px; border-radius: 50px; font-size: 11px; font-weight: 700; color: #64748B; }

        @media (max-width: 900px) {
          .roadmap-experience-grid { flex-direction: column; }
          .re-left, .re-right { flex: 0 0 100%; max-width: 100%; }
          .code-wars-grid { flex-direction: column; }
          .cw-left, .cw-right { flex: 0 0 100%; max-width: 100%; }
          .hiring-flow-grid { flex-direction: column; gap: 16px; }
          .h-arrow-sep { transform: rotate(90deg); margin: 4px 0; }
        }

        /* Dual VS Graphic */
        .vs-illustration-box { position: relative; height: 180px; background: linear-gradient(135deg, #EEF2FF, #FAF5FF); border-radius: 24px; border: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-around; overflow: hidden; padding: 20px; }
        .coder-avatar-frame { font-size: 64px; filter: drop-shadow(0 8px 16px rgba(124, 58, 237, 0.2)); }
        .vs-badge-glow { background: linear-gradient(135deg, #EC4899, #8B5CF6); color: #FFFFFF; font-weight: 900; font-size: 22px; padding: 10px 20px; border-radius: 50px; box-shadow: 0 0 24px rgba(236, 72, 153, 0.5); font-family: var(--font-mono); letter-spacing: 1px; }

        .upcoming-events-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .events-head { font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 4px; }
        .event-row { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 12px; background: #F8FAFC; border: 1px solid #F1F5F9; }
        .event-icon-badge { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .bg-purple-light { background: #F3E8FF; }
        .bg-green-light { background: #ECFDF5; }
        .bg-blue-light { background: #EFF6FF; }
        .bg-amber-light { background: #FFFBEB; }
        .event-info { flex: 1; display: flex; flex-direction: column; }
        .event-info strong { font-size: 12.5px; color: #0F172A; }
        .event-info span { font-size: 10.5px; color: #64748B; }
        .btn-xs { padding: 4px 12px; font-size: 11px; }
        .view-events-footer { text-align: center; margin-top: 6px; }
        .view-all-link { font-size: 12px; font-weight: 800; color: #7C3AED; }

        /* 7. FOR COMPANIES */
        .tag-pill-sub { display: inline-block; background: #F3E8FF; color: #7C3AED; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 800; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .company-checklist { list-style: none; display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; font-weight: 700; color: #334155; }
        .company-checklist .chk { color: #10B981; font-weight: 900; }
        
        .hiring-flow-grid { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 24px; }
        .h-step-card { flex: 1; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 18px; padding: 18px 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); }
        .h-step-title { font-size: 11px; font-weight: 800; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 10px; }
        .h-card-inner { font-size: 11.5px; color: #334155; }
        .role-head { font-size: 13px; color: #0F172A; display: block; margin-bottom: 4px; }
        .req-skills { font-size: 10.5px; color: #64748B; margin-bottom: 4px; }
        .req-exp { font-size: 10.5px; color: #64748B; font-weight: 600; }
        .h-check-list { list-style: none; display: flex; flex-direction: column; gap: 4px; font-size: 11px; font-weight: 600; color: #334155; }
        .h-check-list .chk { color: #10B981; font-weight: bold; }
        .h-badge-list { list-style: none; display: flex; flex-direction: column; gap: 4px; font-size: 11px; font-weight: 700; color: #0F172A; }
        .b-icon { margin-right: 4px; }
        .shortlist-lbl { font-size: 11px; font-weight: 700; color: #0F172A; }
        .match-lbl { font-size: 10px; color: #64748B; margin-bottom: 8px; }
        .candidates-avatars-row { display: flex; align-items: center; gap: 6px; }
        .c-avatar { width: 26px; height: 26px; border-radius: 50%; background: #F1F5F9; border: 1px solid #CBD5E1; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .match-badge { background: #ECFDF5; color: var(--green); font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 50px; }
        .h-arrow-sep { color: #94A3B8; font-weight: bold; font-size: 16px; }

        .trust-companies-text { font-size: 12px; color: #64748B; font-weight: 600; margin-bottom: 12px; }
        .company-logos-row { display: flex; justify-content: center; gap: 32px; font-size: 18px; font-weight: 800; color: var(--t2); opacity: 0.75; }

        /* 8. STATS BAR */
        .stats-bar-section { background: linear-gradient(135deg, #7C3AED, #4F46E5); padding: 48px 0; color: #FFFFFF; }
        .stats-grid-6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; text-align: center; }
        .stat-card { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .stat-icon-badge { font-size: 28px; margin-bottom: 4px; }
        .stat-num { font-size: 32px; font-weight: 900; letter-spacing: -0.5px; }
        .stat-lbl { font-size: 12px; opacity: 0.85; font-weight: 600; }

        /* 9. FINAL CTA SECTION */
        .final-cta-section { background: #080A1A; color: #FFFFFF; padding: 80px 0; border-top: 1px solid rgba(255,255,255,0.08); }
        .final-cta-wrapper { display: flex; align-items: center; gap: 48px; max-width: 1000px; margin: 0 auto; }
        .cta-mascot-left { flex: 0 0 35%; display: flex; justify-content: center; }
        .student-mascot-illustration { width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%); display: flex; align-items: center; justify-content: center; border: 2px solid rgba(124,58,237,0.3); }
        .mascot-avatar-lg { font-size: 96px; filter: drop-shadow(0 12px 24px rgba(124, 58, 237, 0.4)); }
        .cta-content-right { flex: 1; display: flex; flex-direction: column; gap: 16px; }
        .cta-heading { font-size: 36px; font-weight: 900; line-height: 1.2; letter-spacing: -1px; color: #FFFFFF; }
        .cta-sub { font-size: 15px; color: #94A3B8; line-height: 1.6; max-width: 520px; }
        .cta-buttons-row { display: flex; gap: 16px; align-items: center; margin-top: 8px; }
        .pc-btn-glow-lg { padding: 14px 28px; font-size: 14px; font-weight: 800; border-radius: 50px; }
        .pc-btn-outline-lg { padding: 14px 28px; font-size: 14px; font-weight: 800; border-radius: 50px; background: transparent; border: 1.5px solid rgba(255,255,255,0.2); color: #FFFFFF; cursor: pointer; }
        .cta-guarantees-row { display: flex; gap: 20px; font-size: 12px; color: #64748B; font-weight: 700; }
        
        @media (max-width: 900px) {
          .roadmap-experience-grid { flex-direction: column; }
          .re-left, .re-right { flex: 0 0 100%; max-width: 100%; }
        }

        /* 6. CODE WARS */
        .code-wars-grid { display: flex; gap: 40px; align-items: center; }
        .cw-left, .cw-right { flex: 1; }
        
        .lb-header { padding: 16px 20px; font-weight: 800; font-size: 16px; border-bottom: 1px solid var(--border-color); background: rgba(0,0,0,0.2); border-radius: 20px 20px 0 0; }
        .lb-table { width: 100%; border-collapse: collapse; }
        .lb-table th { text-align: left; padding: 12px 20px; font-size: 12px; color: var(--text-tertiary); text-transform: uppercase; }
        .lb-table td { padding: 14px 20px; font-size: 14px; font-weight: 600; border-top: 1px solid var(--border-color); }
        .highlight-row { background: rgba(124,58,237,0.1); color: var(--accent); }
        .cw-tags { font-size: 13px; color: var(--text-tertiary); line-height: 1.8; font-weight: 500; }

        .vs-battle-illustration { display: flex; align-items: center; justify-content: center; gap: 20px; background: var(--bg-card); padding: 40px; border-radius: 24px; border: 1px solid var(--border-color); }
        .vs-avatar { width: 80px; height: 80px; border-radius: 16px; background: var(--bg-card-solid); border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 40px; }
        .vs-badge { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #EC4899, #7C3AED); color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; box-shadow: 0 0 20px rgba(236,72,153,0.4); z-index: 2; }
        
        .upcoming-events h3 { margin-bottom: 16px; font-size: 18px; }
        .event-card { display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 12px; }
        .event-card strong { font-size: 14px; display: block; margin-bottom: 4px; }
        .event-card p { font-size: 12px; color: var(--text-secondary); }
        .view-all-link { display: block; text-align: right; font-size: 13px; color: var(--accent); font-weight: 600; margin-top: 16px; }

        @media (max-width: 900px) {
          .code-wars-grid { flex-direction: column; }
        }

        /* 7. FOR COMPANIES */
        .tag-pill { display: inline-block; background: var(--bg-card); border: 1px solid var(--border-color); padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); }
        .company-benefits { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 15px; font-weight: 500; }
        
        .hiring-flow { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .h-step { flex: 1; min-width: 200px; padding: 24px; text-align: center; }
        .h-step h4 { font-size: 15px; margin-bottom: 16px; color: var(--text-primary); }
        .h-items { display: flex; flex-direction: column; gap: 8px; }
        .h-items span { background: var(--bg-card-solid); padding: 8px; border-radius: 8px; font-size: 12px; color: var(--text-secondary); }
        .h-arrow { color: var(--text-tertiary); font-size: 24px; font-weight: bold; }
        .highlight-step { border-color: var(--accent); box-shadow: 0 0 20px var(--accent-glow); }
        .match-tag { background: rgba(16, 185, 129, 0.1) !important; color: var(--accent-green) !important; font-weight: 700; }
        
        .trust-bar-companies { text-align: center; border-top: 1px solid var(--border-color); padding-top: 32px; }
        .trust-bar-companies p { font-size: 14px; color: var(--text-tertiary); margin-bottom: 20px; font-weight: 600; }
        .trust-bar-companies .company-logos { justify-content: center; }

        /* 8. STATS BAR */
        .stats-bar-section { background: linear-gradient(135deg, #7C3AED, #4F46E5); padding: 50px 0; color: white; }
        .stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; text-align: center; }
        .stat-num { font-size: 36px; font-weight: 900; margin-bottom: 8px; }
        .stat-lbl { font-size: 13px; opacity: 0.8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 40px 20px; } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

        /* 9. FINAL CTA */
        .final-cta-section { background: radial-gradient(circle at center, rgba(124,58,237,0.15) 0%, transparent 60%); }
        .cta-title { font-size: 40px; margin-bottom: 16px; }
        .explore-link { color: var(--text-secondary); font-size: 14px; font-weight: 600; transition: color 0.2s; border-bottom: 1px solid transparent; }
        .explore-link:hover { color: var(--text-primary); border-bottom-color: var(--text-primary); }
        .fine-print { font-size: 12px; color: var(--text-tertiary); display: flex; justify-content: center; gap: 16px; }

        /* 10. FOOTER */
        .footer-section { background: #05060F; padding: 60px 0 20px; border-top: 1px solid rgba(255,255,255,0.05); color: var(--card); }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 60px; }
        .f-col h4 { font-size: 16px; margin-bottom: 20px; color: var(--card); }
        .f-col ul { display: flex; flex-direction: column; gap: 12px; }
        .f-col a { color: #94A3B8; font-size: 14px; transition: color 0.2s; }
        .f-col a:hover { color: #7C3AED; }
        .f-desc { color: #94A3B8; font-size: 14px; line-height: 1.6; max-width: 300px; }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; font-size: 13px; color: #64748B; }
        .social-icons { display: flex; gap: 16px; }
        .social-icons span { width: 32px; height: 32px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; color: var(--card); }
        .social-icons span:hover { background: #7C3AED; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr; } .brand-col { grid-column: span 2; } }

        /* FLOATING CHAT WIDGET & VOICE AI ENGINE */
        .floating-chat-wrapper { position: fixed; bottom: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; align-items: flex-end; gap: 16px; }
        .chat-toggle-btn { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #A855F7); color: white; border: none; font-size: 24px; box-shadow: 0 4px 20px rgba(124,58,237,0.4); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; }
        .chat-toggle-btn:hover { transform: scale(1.05); }
        .chat-panel { width: 390px; height: 530px; display: flex; flex-direction: column; overflow: hidden; }
        .chat-header { padding: 16px; background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        .chat-h-left { display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .chat-bot-icon { background: var(--bg-card-solid); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .voice-active-badge { font-size: 10px; font-weight: 800; background: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3); padding: 2px 8px; border-radius: 50px; }
        .close-chat-btn { background: none; border: none; color: var(--text-tertiary); font-size: 16px; }
        .chat-body { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
        .chat-msg { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2); padding: 12px; border-radius: 12px; font-size: 13px; line-height: 1.5; align-self: flex-start; max-width: 85%; border-bottom-left-radius: 0; }
        .sandbox-queries { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
        .sq-btn { background: var(--bg-card-solid); border: 1px solid var(--border-color); color: var(--text-secondary); padding: 10px 16px; border-radius: 20px; font-size: 12px; text-align: left; transition: all 0.2s; }
        .sq-btn:hover { background: rgba(124,58,237,0.1); color: var(--accent); border-color: rgba(124,58,237,0.3); }
        .chat-footer { padding: 16px; border-top: 1px solid var(--border-color); display: flex; gap: 8px; }
        .chat-input { flex: 1; background: var(--bg-card-solid); border: 1px solid var(--border-color); padding: 10px 16px; border-radius: 20px; color: var(--text-primary); font-size: 13px; outline: none; }
        .chat-input:focus { border-color: var(--accent); }
        .chat-send-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--accent); color: white; border: none; font-size: 16px; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 480px) {
          .chat-panel { width: calc(100vw - 32px); height: 60vh; }
        }

        /* MODAL CLASSES & MORPH WIDGET STYLES (Provided in instructions) */
        .modal-mask-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; }
        .modal-body-container { background: var(--card); border-radius: 24px; padding: 36px; max-width: 420px; width: 90%; position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
        .modal-dismiss-btn { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 18px; cursor: pointer; color: var(--t2); }
        .modal-header-title { font-size: 24px; font-weight: 800; color: var(--t1); margin-bottom: 6px; }
        .modal-header-desc { font-size: 13px; color: var(--t2); margin-bottom: 20px; }
        .input-group-vertical { display: flex; flex-direction: column; gap: 6px; }
        .input-label { font-size: 12px; font-weight: 700; color: #334155; }
        .input-textbox { padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; outline: none; transition: border 0.2s; color: var(--t1); }
        .input-textbox:focus { border-color: #7C3AED; }
        .demo-shortcuts-box { background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
        .demo-shortcuts-title { font-size: 11px; font-weight: 800; color: var(--t2); margin-bottom: 8px; text-transform: uppercase; }
        .demo-buttons-layout { display: flex; flex-wrap: wrap; gap: 6px; }
        .demo-pill-btn { padding: 5px 12px; border-radius: 50px; border: 1px solid var(--border); background: white; font-size: 11px; font-weight: 700; cursor: pointer; color: #334155; transition: all 0.2s; }
        .demo-pill-btn:hover { background: #7C3AED; color: white; border-color: #7C3AED; }
        .error-alert-banner { background: #fef2f2; border: 1px solid #fecaca; color: var(--coral); padding: 10px 14px; border-radius: 10px; font-size: 12px; font-weight: 600; }
        
        .morph-widget-container { animation: fadeInUp 0.3s ease; }
        .morph-widget-card { background: var(--card); border-radius: 20px; padding: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.12); position: relative; text-align: center; border: 1px solid var(--border); }
        .face-hud-circle { width: 100px; height: 100px; margin: 0 auto 12px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: var(--bg3); }
        .face-hud-avatar { font-size: 36px; z-index: 2; }
        .hud-scan-laser { position: absolute; width: 100%; height: 3px; background: linear-gradient(90deg, transparent, #7C3AED, transparent); top: 0; animation: scan 1.5s infinite linear; z-index: 3; }
      `}</style>
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
