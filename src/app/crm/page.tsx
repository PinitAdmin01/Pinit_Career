'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from '@/lib/store/useAppStore';

interface Company {
  name: string;
  industry: string;
  status: 'Active recruiter' | 'Partner' | 'Blacklisted';
}

interface HRContact {
  name: string;
  role: string;
  company: string;
  email: string;
}

interface Drive {
  date: string;
  company: string;
  profile: string;
  status: 'Scheduled' | 'Completed' | 'Ongoing';
}

export default function CompanyCRMPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('Companies');

  const isAdmin = user?.role === 'admin';

  // Mock CRM Datasets
  const companies: Company[] = [
    { name: 'Stripe Security', industry: 'FinTech / Payments', status: 'Active recruiter' },
    { name: 'Amazon Web Services', industry: 'Cloud Infrastructure', status: 'Active recruiter' },
    { name: 'Google Labs', industry: 'AI / Search', status: 'Partner' },
    { name: 'Infosys Systems', industry: 'Consulting / SDE Services', status: 'Partner' },
    { name: 'Spam Corp Inc.', industry: 'Unverified Marketing', status: 'Blacklisted' }
  ];

  const hrContacts: HRContact[] = [
    { name: 'Vikram Grover', role: 'Staff Recruitment Lead', company: 'Stripe Security', email: 'vikram.g@stripe.com' },
    { name: 'Sarah Jenkins', role: 'Campus Hiring Partner', company: 'Amazon', email: 's.jenkins@amazon.com' },
    { name: 'Anish Shenoy', role: 'Senior Talent Scout', company: 'Google Labs', email: 'a.shenoy@google.com' }
  ];

  const drives: Drive[] = [
    { date: 'Sep 12, 2026', company: 'Stripe Security', profile: 'Associate SDE - Cryptography', status: 'Scheduled' },
    { date: 'Aug 24, 2026', company: 'Amazon Core', profile: 'Cloud Support Interns', status: 'Scheduled' },
    { date: 'Jul 15, 2026', company: 'Infosys Systems', profile: 'Systems Developer Associate', status: 'Ongoing' }
  ];

  const visits = [
    { date: 'Sep 05, 2026', topic: 'Guest Lecture: Event-Driven systems scaling at scale', guest: 'Dr. Sarah (Google Tech Director)' },
    { date: 'Aug 18, 2026', topic: 'Campus Tech Hackathon Evaluation panel', guest: 'Recruiter Vikram (Stripe)' }
  ];

  const history = [
    { year: '2025', recruited: 14, avgSalary: '₹14 LPA', topRecruiter: 'Stripe Security' },
    { year: '2024', recruited: 38, avgSalary: '₹6.5 LPA', topRecruiter: 'Infosys Systems' }
  ];

  const feedbacks = [
    { company: 'Stripe Security', rating: '★★★★★', comment: 'Excellent whiteboard systems logic, but debugging speeds in code compiler could be faster.' },
    { company: 'Infosys Systems', rating: '★★★★☆', comment: 'Socratic communication index is highly polished. Candidates are ready for client calls.' }
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">

      {/* ──────────────────────────────────────────────────────── */}
      {/* 🧑‍🎓 ACCESS DENIED SHIELD (Strict Role Validation) */}
      {/* ──────────────────────────────────────────────────────── */}
      {!isAdmin && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
          <span style={{ fontSize: 64 }}>🛡️</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: 'var(--coral)', margin: 0 }}>
            Secure Portal: Access Prohibited
          </h2>
          <p style={{ color: 'var(--t3)', fontSize: 13, maxWidth: 450, lineHeight: 1.5, margin: 0 }}>
            This segment is exclusively restricted to verified Placement Officer staff. Candidates and student portals are blocked from CRM access to preserve recruiter contact integrity.
          </p>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 🎓 PORTAL: PLACEMENT OFFICER CRM */}
      {/* ──────────────────────────────────────────────────────── */}
      {isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>
          
          {/* Vertical CRM Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--bg2)', padding: 8, borderRadius: 14, border: '1px solid var(--border)' }}>
            {['Companies', 'HR Contacts', 'Drives', 'Internships', 'Visits', 'History', 'Feedback', 'Analytics'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: 8,
                  background: activeTab === t ? 'var(--accent-light)' : 'transparent',
                  color: activeTab === t ? 'var(--accent)' : 'var(--t2)',
                  fontSize: 12.5,
                  fontWeight: activeTab === t ? 800 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* CRM Tab Content */}
          <div style={card}>
            
            {/* COMPANIES TAB */}
            {activeTab === 'Companies' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Corporate Partnerships</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg3)' }}>
                      {['Corporate Name', 'Industry Sector', 'Recruiting Status'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--t3)', fontSize: 11, borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map(c => (
                      <tr key={c.name} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{c.name}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--t2)' }}>{c.industry}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 700,
                            background: c.status === 'Active recruiter' ? 'var(--green-light)' : c.status === 'Partner' ? 'var(--accent-light)' : 'var(--coral-light)',
                            color: c.status === 'Active recruiter' ? 'var(--green)' : c.status === 'Partner' ? 'var(--accent)' : 'var(--coral)'
                          }}>{c.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* HR CONTACTS TAB */}
            {activeTab === 'HR Contacts' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Corporate HR Directory</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg3)' }}>
                      {['HR Contact Name', 'Corporate Role', 'Assigned Company', 'Direct Email Address'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--t3)', fontSize: 11, borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hrContacts.map(hr => (
                      <tr key={hr.email} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{hr.name}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--t2)' }}>{hr.role}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--accent)', fontWeight: 600 }}>{hr.company}</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>{hr.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* DRIVES TAB */}
            {activeTab === 'Drives' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>SDE Campus Placements drive Schedules</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {drives.map(drive => (
                    <div key={drive.company} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div>
                        <span style={{ fontSize: 11, color: 'var(--t3)' }}>Drive Date: {drive.date}</span>
                        <h4 style={{ margin: '2px 0 0 0', fontSize: 13, fontWeight: 700 }}>{drive.company} · {drive.profile}</h4>
                      </div>
                      <span style={{
                        fontSize: 10.5, fontWeight: 800, padding: '4px 10px', borderRadius: 6,
                        background: drive.status === 'Scheduled' ? 'var(--accent-light)' : drive.status === 'Ongoing' ? 'var(--amber-light)' : 'var(--green-light)',
                        color: drive.status === 'Scheduled' ? 'var(--accent)' : drive.status === 'Ongoing' ? 'var(--amber)' : 'var(--green)'
                      }}>{drive.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INTERNSHIPS TAB */}
            {activeTab === 'Internships' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Corporate Interns Conversions Dashboard</h3>
                <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 14 }}>Track active conversions and conversions from summer internship programs.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>Total Active Placed Interns</span>
                    <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginTop: 4 }}>84 Students</div>
                  </div>
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>Offer Conversion PPO Ratio</span>
                    <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--green)', marginTop: 4 }}>68% Conversions</div>
                  </div>
                </div>
              </div>
            )}

            {/* VISITS TAB */}
            {activeTab === 'Visits' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Campus Guest Visits & tech Talks</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {visits.map(v => (
                    <div key={v.topic} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 12, borderRadius: 10 }}>
                      <span style={{ fontSize: 11, color: 'var(--t3)' }}>Visit Scheduled: {v.date}</span>
                      <h4 style={{ margin: '4px 0 2px 0', fontSize: 13, fontWeight: 700 }}>{v.topic}</h4>
                      <div style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 600 }}>Speaker: {v.guest}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'History' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Historical Campus Placements Audit</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg3)' }}>
                      {['Placement Season', 'Total Hired', 'Average Package (LPA)', 'Top Recruiting Partner'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--t3)', fontSize: 11, borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(row => (
                      <tr key={row.year} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 800 }}>Batch of {row.year}</td>
                        <td style={{ padding: '10px 12px' }}>{row.recruited} candidates</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--green)' }}>{row.avgSalary}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--accent)', fontWeight: 600 }}>{row.topRecruiter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* FEEDBACK TAB */}
            {activeTab === 'Feedback' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Corporate HR Feedback Logs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {feedbacks.map(f => (
                    <div key={f.company} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 12, borderRadius: 10 }}>
                      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 800 }}>{f.company}</span>
                        <span style={{ color: 'var(--amber)', fontSize: 12 }}>{f.rating}</span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--t2)', margin: 0, lineHeight: 1.4 }}>"{f.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'Analytics' && (
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>Recruiters Analytics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>Average Package Growth</span>
                    <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--green)', marginTop: 4 }}>+12.4% YoY</div>
                  </div>
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>Corporate Placement Index</span>
                    <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginTop: 4 }}>92 / 100</div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

const card: React.CSSProperties = {
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-xl)', padding: 20, boxShadow: 'var(--shadow-sm)'
};
const cardLabel: React.CSSProperties = {
  fontSize: 10.5, letterSpacing: '0.8px', textTransform: 'uppercase',
  color: 'var(--t3)', fontFamily: 'var(--font-mono)', fontWeight: 600,
  marginBottom: 14, display: 'block'
};
