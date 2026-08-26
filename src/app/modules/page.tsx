'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/landing/PublicFooter';
import DynamicSkyCanvas from '@/components/effects/DynamicSkyCanvas';
import '@/styles/landing.css';

interface ModuleItem {
  id: string;
  name: string;
  category: 'student' | 'faculty' | 'recruiter' | 'institution' | 'operations';
  icon: string;
  desc: string;
  route: string;
}

export default function ModulesDirectoryPage() {
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

  const [activeCat, setActiveCat] = useState<'all' | 'student' | 'faculty' | 'recruiter' | 'institution' | 'operations'>('all');
  const [search, setSearch] = useState('');

  const modulesList: ModuleItem[] = [
    // Student & Learning
    { id: '1', name: '36-Course S-Curve Curriculum', category: 'student', icon: '📚', desc: '1,080 handcrafted days across Software, Cloud, IoT, and B.Com tracks.', route: '/learning' },
    { id: '2', name: 'AI Socratic Voice Mentor', category: 'student', icon: '👩‍🏫', desc: '24/7 spoken tutoring with 0 jargon and empathetic recovery ladders.', route: '/quests/lesson' },
    { id: '3', name: 'Code Wars Multiplayer Arena', category: 'student', icon: '⚔️', desc: 'Real-time algorithmic battles with Elo ranking and global leaderboards.', route: '/arena?tab=code_wars' },
    { id: '4', name: 'AI Mock Interview Studio', category: 'student', icon: '🎙️', desc: 'Spoken technical mock interviews with speech confidence and BLUF analysis.', route: '/interview' },
    { id: '5', name: 'Verifiable Skill Passport', category: 'student', icon: '🛡️', desc: 'Cryptographic tamper-proof skill badges with SHA-256 hash proofs.', route: '/quests?tab=passport' },
    { id: '6', name: 'Career DNA & Psychometrics', category: 'student', icon: '🧬', desc: 'Multidimensional cognitive profiling for optimal career trajectory.', route: '/career-dna' },
    { id: '7', name: 'Attention Span & Focus Trainer', category: 'student', icon: '🎯', desc: 'Gamified cognitive reflex exercises to build deep technical focus.', route: '/attention-span' },
    { id: '8', name: 'AI Resume & Portfolio Builder', category: 'student', icon: '📄', desc: 'Auto-generate audited proof-of-work portfolios from completed quests.', route: '/portfolio' },
    { id: '9', name: 'Group Discussion AI Simulator', category: 'student', icon: '💬', desc: 'Multi-persona AI roundtable discussions with turn-taking analysis.', route: '/group-discussion' },
    { id: '10', name: 'Internship & Job Matchmaker', category: 'student', icon: '💼', desc: 'Direct algorithmic matching to live roles based on verified test assertions.', route: '/internships' },

    // Faculty & Teaching
    { id: '11', name: 'Teacher Quest Studio', category: 'faculty', icon: '📝', desc: 'Author custom curriculum, test cases, and Socratic recovery hints.', route: '/teacher' },
    { id: '12', name: 'Student Progress Analytics', category: 'faculty', icon: '📊', desc: 'Cohort-level AST code audits, submission timelines, and struggle hotspots.', route: '/admin/teacher' },
    { id: '13', name: 'Automated Examination Engine', category: 'faculty', icon: '✍️', desc: 'Proctored exams with randomized assertion suites and anti-cheat sandboxes.', route: '/exams' },
    { id: '14', name: 'Faculty Leave & Timetable System', category: 'faculty', icon: '📅', desc: 'Schedule management, attendance records, and workload distribution.', route: '/attendance' },
    { id: '15', name: 'Research Paper Grant Tracker', category: 'faculty', icon: '🔬', desc: 'Manage departmental publications, citation metrics, and research grants.', route: '/research' },

    // Recruiter & Enterprise
    { id: '16', name: 'Enterprise Talent Discovery', category: 'recruiter', icon: '🔍', desc: 'Filter candidates by verified code execution benchmark scores.', route: '/recruiter' },
    { id: '17', name: 'Campus Drive Scheduler', category: 'recruiter', icon: '🗓️', desc: 'Organize multi-round placement drives with automated round shortlisting.', route: '/recruiter' },
    { id: '18', name: 'Code Quality & Invariant Auditor', category: 'recruiter', icon: '⚙️', desc: 'Inspect candidate AST static analysis, Big-O complexity, and edge cases.', route: '/recruiter' },
    { id: '19', name: 'Direct Candidate Messenger', category: 'recruiter', icon: '✉️', desc: 'Send fast-track interview invites to Top 5% verified candidates.', route: '/recruiter' },

    // University & Institutions
    { id: '20', name: 'Placement Cell CRM', category: 'institution', icon: '🏛️', desc: 'End-to-end recruiter tracking, offer letter repository, and conversion metrics.', route: '/crm' },
    { id: '21', name: 'Campus-Wide Employability Index', category: 'institution', icon: '📈', desc: '0-100% real-time cohort readiness dashboard for Deans & Principals.', route: '/university' },
    { id: '22', name: 'NAAC / NBA Accreditation Audit Exporter', category: 'institution', icon: '📑', desc: 'Generate compliance reports with continuous student learning audit trails.', route: '/documents' },
    { id: '23', name: 'Alumni Network & Mentorship', category: 'institution', icon: '🤝', desc: 'Connect graduating students with alumni in top global engineering roles.', route: '/alumni' },
    { id: '24', name: 'Parent Communication Portal', category: 'institution', icon: '👨‍👩‍👧', desc: 'Transparent view into student learning consistency and placement milestones.', route: '/parent' },

    // Operations & Campus Infrastructure
    { id: '25', name: 'Campus Hostel Management', category: 'operations', icon: '🏢', desc: 'Room allocation, visitor passes, and student grievance tracking.', route: '/hostel' },
    { id: '26', name: 'Library Resource & Book Engine', category: 'operations', icon: '📖', desc: 'Digital library cataloging, RFID book checkout, and overdue alerts.', route: '/library' },
    { id: '27', name: 'Transport & Fleet Tracker', category: 'operations', icon: '🚌', desc: 'Campus bus routes, student passes, and GPS fleet monitoring.', route: '/transport' },
    { id: '28', name: 'Maintenance & Facility Ticket Desk', category: 'operations', icon: '🔧', desc: 'Lodge and resolve campus infrastructure maintenance work orders.', route: '/maintenance' },
    { id: '29', name: 'Finance & Fee Billing Ledger', category: 'operations', icon: '💳', desc: 'Tuition fees, scholarship disbursement, and automated payment receipts.', route: '/finance' },
  ];

  const filtered = useMemo(() => {
    return modulesList.filter((m) => {
      const matchCat = activeCat === 'all' || m.category === activeCat;
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.desc.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCat, search, modulesList]);

  return (
    <div className="landing-page" style={{ position: 'relative', overflowX: 'hidden' }}>
      <DynamicSkyCanvas theme={themeState.theme} lastToggleTime={themeState.lastToggleTime} opacity={0.65} />
      <PublicNavbar />

      <main style={{ padding: '60px 0 100px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          
          <div style={{ marginBottom: 32 }}>
            <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span>←</span> Back to Landing Page
            </Link>
          </div>

          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 50px' }}>
            <div className="badge-pill">COMPLETE ECOSYSTEM DIRECTORY</div>
            <h1 className="hero-title">
              54 Integrated Platform <span className="text-gradient">Modules &amp; Services</span>
            </h1>
            <p className="hero-subtitle" style={{ margin: '16px auto 0' }}>
              Explore the end-to-end OS uniting students, placement cells, faculty, recruiters, and parents under a single verified framework.
            </p>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All (29)' },
                { id: 'student', label: 'Student OS' },
                { id: 'faculty', label: 'Faculty OS' },
                { id: 'recruiter', label: 'Recruiter OS' },
                { id: 'institution', label: 'Placement Cell' },
                { id: 'operations', label: 'Operations' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCat(tab.id as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid var(--border-color)',
                    background: activeCat === tab.id ? 'var(--accent)' : 'var(--bg-card)',
                    color: activeCat === tab.id ? '#FFFFFF' : 'var(--text-primary)',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ minWidth: 260 }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 50 }}>
            {filtered.map((item) => (
              <div key={item.id} className="gain-card" style={{ padding: 24, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{item.name}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-color)', marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {item.category}
                  </span>
                  <Link href={item.route} style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>
                    Access →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/" className="pc-btn-primary">
              Return to Master Hub →
            </Link>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
