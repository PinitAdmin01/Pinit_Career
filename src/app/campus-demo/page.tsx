'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/landing/PublicFooter';
import DynamicSkyCanvas from '@/components/effects/DynamicSkyCanvas';
import '@/styles/landing.css';

export default function CampusDemoPage() {
  const [themeState, setThemeState] = useState<{ theme: 'dark' | 'light'; lastToggleTime: number }>({
    theme: 'light',
    lastToggleTime: 0
  });

  useEffect(() => {
    const saved = (localStorage.getItem('pc_theme') as 'dark' | 'light') || 'light';
    setThemeState(prev => ({ ...prev, theme: saved }));

    const handleThemeToggle = (e: any) => {
      if (e.detail) {
        setThemeState({
          theme: e.detail.theme,
          lastToggleTime: e.detail.time
        });
      }
    };
    window.addEventListener('pc_theme_toggled', handleThemeToggle);
    return () => window.removeEventListener('pc_theme_toggled', handleThemeToggle);
  }, []);

  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Placement Director / Head of Placements',
    institution: '',
    studentCount: '1,000 - 5,000 students',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.email || !demoForm.institution) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="landing-page" style={{ position: 'relative', overflowX: 'hidden' }}>
      <DynamicSkyCanvas theme={themeState.theme} lastToggleTime={themeState.lastToggleTime} opacity={0.65} />
      <PublicNavbar />

      <main style={{ padding: '60px 0 100px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          
          {/* Breadcrumb back to landing */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span>←</span> Back to Landing Page
            </Link>
          </div>

          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 60px' }}>
            <div className="badge-pill">INSTITUTIONAL PLACEMENT OS</div>
            <h1 className="hero-title">
              Transform Campus Employability &amp;{' '}
              <span className="text-gradient">NAAC Accreditation.</span>
            </h1>
            <p className="hero-subtitle" style={{ margin: '16px auto 0' }}>
              Equip your Placement Cell, Deans, and HODs with real-time student cohort employability intelligence, skill gap detection, automated NIRF exports, and direct corporate recruitment drives.
            </p>
          </div>

          {/* 3 Value Pillars for Campuses */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 60 }}>
            <div className="glass-card" style={{ padding: 28, borderRadius: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>📊</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Cohort Employability Heatmaps</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Real-time visibility into department-level technical proficiency, algorithmic struggle hotspots, and readiness percentiles.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 28, borderRadius: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>📑</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>1-Click NAAC &amp; NIRF Data Exports</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Eliminate months of manual accreditation compilation. Instantly generate continuous outcome-based student assessment logs.
              </p>
            </div>

            <div className="glass-card" style={{ padding: 28, borderRadius: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>🤝</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Direct Recruiter Drive Pipelines</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Connect your campus directly with hiring partners looking for verified, production-ready junior talent.
              </p>
            </div>
          </div>

          {/* Form & Consultation Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 40, alignItems: 'start' }}>
            
            {/* Left Column: Context & Guarantees */}
            <div>
              <span className="tag-pill-sub">INSTITUTIONAL PILOT PROGRAM</span>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', margin: '12px 0 16px' }}>
                Schedule a 30-Minute Institutional Demo
              </h2>
              <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 28 }}>
                See how top colleges use PinIT Career to elevate their NAAC Grade A+ ranking, accelerate median placement packages, and automate placement cell workflows.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { title: 'Zero Setup IT Friction', desc: 'Runs 100% in-browser with zero local server installations required.' },
                  { title: 'Cohort Pilot Included', desc: 'Test with a sample batch of 100 students before full-campus rollout.' },
                  { title: 'Dedicated Institutional Success Manager', desc: 'Custom curriculum alignment with your university syllabus.' }
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--badge-bg)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: 12, fontWeight: 900, flexShrink: 0, marginTop: 2 }}>✓</div>
                    <div>
                      <strong style={{ fontSize: 14, color: 'var(--text-primary)', display: 'block', marginBottom: 2 }}>{item.title}</strong>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Demo Booking Card */}
            <div className="glass-card" style={{ padding: '36px 30px', borderRadius: 24 }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>Demo Request Received!</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                    Thank you, {demoForm.name}. Our Institutional Partnerships Director will contact you at <strong>{demoForm.email}</strong> within 4 business hours to schedule your walkthrough.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setDemoForm({ name: '', email: '', phone: '', role: 'Placement Director / Head of Placements', institution: '', studentCount: '1,000 - 5,000 students', message: '' });
                    }}
                    className="pc-btn-outline"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Institutional Request Form</h3>
                  
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Rajesh Sharma"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm(prev => ({ ...prev, name: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Official Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="placement@college.edu.in"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm(prev => ({ ...prev, email: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm(prev => ({ ...prev, phone: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>College / University Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="National Institute of Technology"
                      value={demoForm.institution}
                      onChange={(e) => setDemoForm(prev => ({ ...prev, institution: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Your Role</label>
                      <select
                        value={demoForm.role}
                        onChange={(e) => setDemoForm(prev => ({ ...prev, role: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                      >
                        <option>Placement Director / TPO</option>
                        <option>Dean / Principal</option>
                        <option>Department Head (HOD)</option>
                        <option>Chancellor / Trustee</option>
                        <option>Corporate Recruiter</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Annual Cohort Size</label>
                      <select
                        value={demoForm.studentCount}
                        onChange={(e) => setDemoForm(prev => ({ ...prev, studentCount: e.target.value }))}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                      >
                        <option>Under 1,000 students</option>
                        <option>1,000 - 5,000 students</option>
                        <option>5,000 - 15,000 students</option>
                        <option>15,000+ students</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Specific Goals / Notes (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="We are looking to improve our 2026 CS & ECE placement rate and automate NAAC Criterion 5 metrics..."
                      value={demoForm.message}
                      onChange={(e) => setDemoForm(prev => ({ ...prev, message: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="pc-btn-primary"
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 14, marginTop: 6 }}
                  >
                    {loading ? 'Submitting Request...' : 'Schedule Campus Walkthrough →'}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
