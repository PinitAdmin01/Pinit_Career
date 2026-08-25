'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { toast } from '@/lib/store/useAppStore';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { InternshipRecord } from '@/lib/pathway/competencySchema';
import Link from 'next/link';

export default function InternshipsPage() {
  const { user } = useAuth();
  const userId = user?.id || 'guest_student';
  const cOS = useCareerOS();

  const [records, setRecords] = useState<InternshipRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [internshipType, setInternshipType] = useState<'external_employment' | 'campus_internship' | 'open_source_fellowship'>('external_employment');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrentlyActive, setIsCurrentlyActive] = useState(false);
  const [mentorName, setMentorName] = useState('');
  const [mentorContact, setMentorContact] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [skillsTaught, setSkillsTaught] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // Load existing records
  useEffect(() => {
    async function loadInternships() {
      try {
        const data = await PathwayApiService.getInternshipRecords(userId);
        setRecords(data);
      } catch (err) {
        console.warn('Failed to load internship records:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInternships();
  }, [userId]);

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim() || !startDate.trim() || !projectDescription.trim()) {
      toast.error('Missing Fields', 'Please fill in Company, Role, Start Date, and Description.');
      return;
    }

    setSaving(true);
    try {
      const skillsArray = skillsTaught.split(',').map(s => s.trim()).filter(Boolean);
      const saved = await PathwayApiService.logInternshipRecord({
        studentId: userId,
        companyName: companyName.trim(),
        role: role.trim(),
        type: internshipType === 'open_source_fellowship' ? 'external_employment' : internshipType,
        startDate,
        endDate: isCurrentlyActive ? undefined : endDate,
        mentorName: mentorName.trim() || undefined,
        performanceRating: 'Exceeds Expectations',
        projectDescription: projectDescription.trim(),
        skillsUsed: skillsArray,
        certificateUrl: certificateUrl.trim() || undefined,
        isVerified: true,
      });

      setRecords(prev => [saved, ...prev]);
      cOS.addXp(500, `Logged Internship at ${companyName}`);
      toast.success('Internship Record Sealed! 💼', `Logged ${companyName} experience into your cryptographic career record.`);
      
      // Reset
      setCompanyName('');
      setRole('');
      setStartDate('');
      setEndDate('');
      setIsCurrentlyActive(false);
      setMentorName('');
      setMentorContact('');
      setProjectDescription('');
      setSkillsTaught('');
      setCertificateUrl('');
      setShowLogModal(false);
    } catch (err: any) {
      toast.error('Failed to Save', err?.message || 'Could not log internship record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 80 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
              💼 External Internship & Industry Residency
            </h1>
            <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 800 }}>
              Career Booster
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--t3)', margin: '6px 0 0' }}>
            Document your real-world corporate or campus internships to reinforce your ATS resume and skill passport.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
          }}
        >
          + Log Internship Record
        </button>
      </div>

      {/* Info Notice */}
      <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
          <strong>Policy Notice:</strong> External internships provide valuable industry evidence, but are <strong>not a mandatory blocker</strong> for reaching <em>Interview Ready</em> status. Students who pass the P3 Project defense and core mastery gates reach Interview Readiness immediately.
        </div>
      </div>

      {/* Logged Internships List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>Loading internship ledger...</div>
        ) : records.length === 0 ? (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36 }}>🏢</span>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>No Internship Records Logged Yet</h3>
            <p style={{ fontSize: 12.5, color: 'var(--t3)', maxWidth: 450, margin: 0, lineHeight: 1.5 }}>
              Have you worked at a tech startup, corporate firm, or open-source fellowship? Log your experience to bolster your recruiter trust quotient.
            </p>
            <button
              onClick={() => setShowLogModal(true)}
              style={{
                marginTop: 8,
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid var(--accent)',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--accent)',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Log First Experience ➔
            </button>
          </div>
        ) : (
          records.map(record => (
            <div
              key={record.id}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderLeft: '4px solid #10b981',
                borderRadius: 14,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                      {record.role}
                    </h3>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6, color: 'var(--t2)', fontWeight: 700 }}>
                      @ {record.companyName}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                    📅 {record.startDate} &mdash; {record.endDate || 'Present'} &middot; <span style={{ textTransform: 'capitalize' }}>{record.type.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <span style={{ fontSize: 11, background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '3px 8px', borderRadius: 6, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {record.isVerified ? '✓ VERIFIED' : 'PENDING'}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                {record.projectDescription}
              </p>

              {record.skillsUsed && record.skillsUsed.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {record.skillsUsed.map((skill: string, i: number) => (
                    <span key={i} style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'var(--bg3)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 4, color: 'var(--t2)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {record.mentorName && (
                <div style={{ fontSize: 11, color: 'var(--t3)', borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
                  Mentor: <strong>{record.mentorName}</strong>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {showLogModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, width: 560, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', margin: 0 }}>
                💼 Log Internship Experience
              </h3>
              <button onClick={() => setShowLogModal(false)} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveRecord} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>COMPANY / ORGANIZATION NAME *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp, Google Summer of Code, Razorpay"
                  style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--t1)', fontSize: 12.5 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>ROLE / POSITION TITLE *</label>
                  <input
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="e.g. Software Engineering Intern"
                    style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--t1)', fontSize: 12.5 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>EXPERIENCE TYPE</label>
                  <select
                    value={internshipType}
                    onChange={e => setInternshipType(e.target.value as any)}
                    style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--t1)', fontSize: 12.5 }}
                  >
                    <option value="external_employment">External Corporate Employment</option>
                    <option value="campus_internship">Campus / Research Internship</option>
                    <option value="open_source_fellowship">Open Source Fellowship</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>START DATE *</label>
                  <input
                    type="month"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--t1)', fontSize: 12.5 }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>END DATE</label>
                  <input
                    type="month"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    disabled={isCurrentlyActive}
                    style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--t1)', fontSize: 12.5, opacity: isCurrentlyActive ? 0.5 : 1 }}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--t2)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isCurrentlyActive}
                  onChange={e => setIsCurrentlyActive(e.target.checked)}
                />
                Currently Working Here
              </label>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>PROJECT / DELIVERABLES DESCRIPTION *</label>
                <textarea
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                  placeholder="Describe the production services, APIs, features, or pipelines you contributed to..."
                  rows={3}
                  style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--t1)', fontSize: 12.5, resize: 'vertical' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>TECHNOLOGIES / SKILLS USED (comma separated)</label>
                <input
                  type="text"
                  value={skillsTaught}
                  onChange={e => setSkillsTaught(e.target.value)}
                  placeholder="e.g. React, Next.js, Node.js, PostgreSQL, Docker, AWS"
                  style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--t1)', fontSize: 12.5 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>MENTOR / MANAGER NAME</label>
                  <input
                    type="text"
                    value={mentorName}
                    onChange={e => setMentorName(e.target.value)}
                    placeholder="e.g. Alex Johnson (Tech Lead)"
                    style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--t1)', fontSize: 12.5 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>MENTOR EMAIL / LINKEDIN</label>
                  <input
                    type="text"
                    value={mentorContact}
                    onChange={e => setMentorContact(e.target.value)}
                    placeholder="e.g. alex@acme.com or linkedin.com/in/..."
                    style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--t1)', fontSize: 12.5 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>CERTIFICATE / OFFER LETTER URL (Optional)</label>
                <input
                  type="url"
                  value={certificateUrl}
                  onChange={e => setCertificateUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--t1)', fontSize: 12.5 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t2)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? 'Sealing Record...' : 'Save & Seal Record ➔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
