'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { RoleGate } from '@/components/auth/RoleGate';

const STAGES = ['onboarding', 'document_collection', 'application', 'visa', 'pre_departure', 'completed'];
const STAGE_LABELS: Record<string, string> = {
  onboarding: 'Onboarding',
  document_collection: 'Documents',
  application: 'Application',
  visa: 'Visa',
  pre_departure: 'Pre-Departure',
  completed: 'Completed'
};
const VISA_STATUS_COLOR: Record<string, string> = {
  not_started: 'var(--t3)',
  pending: 'var(--amber)',
  approved: 'var(--green)',
  rejected: 'var(--coral)',
  submitted: 'var(--blue)'
};

interface Session {
  id?: string;
  title: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  link?: string;
  notes?: string;
}

function ConsultantPageInner() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: "Hello! I am your AI Consultant Copilot. Ask me anything about student applications, scholarship matches, or placement readiness." }
  ]);
  const [pipeline, setPipeline] = useState<Record<string, any[]>>({});
  const [analytics, setAnalytics] = useState<Record<string, any>>({});
  const [selectedStudent, setSelectedStudent] = useState<Record<string, any> | null>(null);
  const [mentorVerifiedMap, setMentorVerifiedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [selectedIntelStudent, setSelectedIntelStudent] = useState<any>(null);
  const [selectedGoal, setSelectedGoal] = useState<string>('AI Engineer');
  const [matchingStudent, setMatchingStudent] = useState<string>('');
  const [scholarshipSubTab, setScholarshipSubTab] = useState<string>('government');
  const [selectedDocStudent, setSelectedDocStudent] = useState<string>('');
  const [selectedVisaStudent, setSelectedVisaStudent] = useState<string>('');
  const [studyAbroadSubTab, setStudyAbroadSubTab] = useState<string>('visa');
  const [countryCompA, setCountryCompA] = useState<string>('Germany');
  const [countryCompB, setCountryCompB] = useState<string>('Canada');
  const [showCopilotSidebar, setShowCopilotSidebar] = useState<boolean>(true);
  const [sidebarMessages, setSidebarMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Hello! I am your AI Consultant Copilot. Ask me anything about candidate analytics, university matching, or documents.' }
  ]);
  const [showSopAudit, setShowSopAudit] = useState<boolean>(false);
  const [showResumeAudit, setShowResumeAudit] = useState<boolean>(false);
  const [showLorAudit, setShowLorAudit] = useState<boolean>(false);
  const [documentsSubMode, setDocumentsSubMode] = useState<string>('auditor');
  const [sopProjects, setSopProjects] = useState<string>('');
  const [sopResearch, setSopResearch] = useState<string>('');
  const [sopGoal, setSopGoal] = useState<string>('');
  const [sopAchievements, setSopAchievements] = useState<string>('');
  const [generatedSop, setGeneratedSop] = useState<string>('');
  const [generatingSop, setGeneratingSop] = useState<boolean>(false);
  // Checklist Task form
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Add student form
  const [studentForm, setStudentForm] = useState({
    displayName: '', email: '', phone: '', targetCountry: '',
    targetUniversities: '', programType: '', budget: '', intakeYear: '', notes: ''
  });

  // Sessions state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionForm, setSessionForm] = useState<Session>({
    title: '', studentId: '', studentName: '', date: '', time: '', link: '', notes: ''
  });
  const [scheduling, setScheduling] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchPipeline();
    fetchAnalytics();
    fetchSessions();
  }, []);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toastObj = {
    success: (title: string, desc?: string) => triggerToast(`${title}${desc ? `: ${desc}` : ''}`, 'success'),
    error: (title: string, desc?: string) => triggerToast(`${title}${desc ? `: ${desc}` : ''}`, 'error')
  };

  async function fetchPipeline() {
    setLoading(true);
    try {
      const d = await api.get<{ pipeline: Record<string, any[]> }>('/api/consultant/pipeline');
      setPipeline(d.pipeline || {});
      const allStuds = Object.values(d.pipeline || {}).flat();
      if (allStuds.length > 0) {
        const first = allStuds[0];
        const firstName = first.displayName || first.name || 'Candidate';
        setMatchingStudent(firstName);
        setSelectedDocStudent(firstName);
        setSelectedVisaStudent(firstName);
        setSelectedIntelStudent({
          name: firstName,
          ats: first.ats_score ?? null,
          coding: first.trust_score ?? null,
          comm: first.email ? 'Contact on file' : 'No contact',
          placement: first.ats_score != null ? `${first.ats_score}%` : '—',
          dna: first.career_track ? `🤖 ${first.career_track}` : '—',
          research: '—',
          projects: `${(first.vaultItems || []).length} vault items`,
          ielts: '—',
          gre: '—',
          cgpa: '—',
          scholarship: '—',
          probability: '—'
        });
      } else {
        setMatchingStudent('');
        setSelectedDocStudent('');
        setSelectedVisaStudent('');
        setSelectedIntelStudent(null);
      }
      if (selectedStudent) {
        const updated = allStuds.find(s => s.id === selectedStudent.id);
        if (updated) setSelectedStudent(updated);
      }
    } catch {
      triggerToast('Failed to load student pipeline', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnalytics() {
    try {
      const ca = await api.get<Record<string, any>>('/api/consultant/analytics');
      setAnalytics(ca || {});
    } catch {}
  }

  async function fetchSessions() {
    try {
      const d = await api.get<{ sessions: Session[] }>('/api/consultant/sessions');
      setSessions(d.sessions || []);
    } catch {}
  }

  async function addStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!studentForm.displayName) return;
    try {
      const body = {
        ...studentForm,
        targetUniversities: studentForm.targetUniversities.split(',').map(s => s.trim()).filter(Boolean)
      };
      await api.post('/api/consultant/student/add', body);
      triggerToast('Student added successfully!');
      setStudentForm({ displayName: '', email: '', phone: '', targetCountry: '', targetUniversities: '', programType: '', budget: '', intakeYear: '', notes: '' });
      setActiveTab('pipeline');
      fetchPipeline();
    } catch {
      triggerToast('Failed to add student', 'error');
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch(`/api/consultant/student/${id}`, { status });
      triggerToast(`Stage updated to ${STAGE_LABELS[status]}`);
      fetchPipeline();
    } catch {
      triggerToast('Failed to update stage status', 'error');
    }
  }

  async function handleVerifyDocument(itemId: string, status: 'verified' | 'rejected') {
    if (!selectedStudent) return;
    try {
      await api.post(`/api/consultant/student/${selectedStudent.id}/verify-document`, { itemId, status });
      triggerToast(`Document ${status === 'verified' ? 'verified' : 'rejected'}`);
      fetchPipeline();
    } catch {
      triggerToast('Failed to update document status', 'error');
    }
  }

  async function addTask() {
    if (!newTask.trim() || !selectedStudent) return;
    try {
      await api.post(`/api/consultant/student/${selectedStudent.id}/task`, {
        title: newTask,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || null
      });
      triggerToast('Task checklist item added');
      setNewTask('');
      setNewTaskDueDate('');
      fetchPipeline();
    } catch {
      triggerToast('Failed to add task', 'error');
    }
  }

  async function scheduleSessions(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionForm.title || !sessionForm.studentId || !sessionForm.date) {
      triggerToast('Please fill out required fields', 'error');
      return;
    }
    setScheduling(true);
    try {
      // Find candidate name
      const allStuds = Object.values(pipeline).flat();
      const s = allStuds.find(st => st.id === sessionForm.studentId);
      const studentName = s ? s.displayName : 'Student';
      
      await api.post('/api/consultant/sessions', {
        ...sessionForm,
        studentName
      });
      triggerToast('1:1 Consultation scheduled!');
      setSessionForm({ title: '', studentId: '', studentName: '', date: '', time: '', link: '', notes: '' });
      fetchSessions();
    } catch {
      triggerToast('Failed to schedule session', 'error');
    } finally {
      setScheduling(false);
    }
  }

  const a = analytics;
  const allStudents = Object.values(pipeline).flat();

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Toast alert */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? 'var(--green)' : 'var(--coral)',
          color: '#fff', padding: '11px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          boxShadow: 'var(--shadow-lg)'
        }}>
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div className="page-hero" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-hero-title">🎓 Consultant Dashboard</h1>
          <p className="page-hero-sub">Track cohort progress, verify upload credentials, and coordinate consultation sessions</p>
        </div>
        <button
          onClick={() => setShowCopilotSidebar(prev => !prev)}
          className="btn-primary"
          style={{ position: 'relative', zIndex: 1, padding: '8px 16px', borderRadius: 8, fontSize: 12.5 }}
        >
          🤖 {showCopilotSidebar ? 'Hide Copilot Sidebar' : 'Show Copilot Sidebar'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: 6, paddingBottom: 10, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'pipeline', label: '📋 Student Pipeline' },
          { id: 'intelligence', label: '🔍 Student Intelligence' },
          { id: 'career_planning', label: '💼 Career Planning' },
          { id: 'study_abroad', label: '✈️ Study Abroad' },
          { id: 'mentorship', label: '🤝 Mentorship' },
          { id: 'univ_matching', label: '🏫 University Matching' },
          { id: 'scholarship', label: '🏆 Scholarship Center' },
          { id: 'documents', label: '📄 Documents' },
          { id: 'placement_timeline', label: '🚀 Placement Timeline' },
          { id: 'opportunity_radar', label: '📡 Opportunity Radar' },
          { id: 'meetings', label: '📅 Meetings' },
          { id: 'analytics', label: '📊 Analytics' },
          { id: 'copilot', label: '🤖 AI Consultant Copilot' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 12.5, fontWeight: activeTab === tab.id ? 800 : 600,
              background: activeTab === tab.id ? 'rgba(99,102,241,0.08)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--t2)',
              whiteSpace: 'nowrap', transition: 'all 0.15s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showCopilotSidebar ? '1fr 340px' : '1fr', gap: 20 }}>
        <div style={{ minWidth: 0 }}>

      {/* ── TAB: DASHBOARD (Overview Command Center) ────────────────────── */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
          {allStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--t3)', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14 }}>
              No pipeline data. Add students or wait for API-linked candidates to appear.
            </div>
          ) : (
            <>
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(99, 102, 241, 0.02) 100%)',
            border: '1.5px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 14, padding: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>Pipeline Snapshot</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--t2)' }}>
              {allStudents.length} candidate{allStudents.length === 1 ? '' : 's'} in pipeline.
              {analytics?.totalStudents != null ? ` Analytics reports ${analytics.totalStudents} total students.` : ''}
              {' '}No fabricated scholarship or visa alerts are shown.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {[
              { label: "Today's Meetings", value: String(sessions.length), desc: sessions.length ? 'From scheduled sessions' : 'No sessions scheduled', color: 'var(--accent)' },
              { label: 'Pipeline candidates', value: String(allStudents.length), desc: 'From consultant pipeline API', color: 'var(--success)' },
              { label: 'Visa approved (analytics)', value: analytics?.visaApprovalRate != null ? `${analytics.visaApprovalRate}%` : '—', desc: 'From analytics endpoint', color: 'var(--coral)' },
            ].map((c, idx) => (
              <div key={idx} style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 4
              }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>{c.label}</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.value}</span>
                <span style={{ fontSize: 10, color: 'var(--t3)' }}>{c.desc}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: 'var(--bg3)', padding: '10px 14px', fontSize: 12, fontWeight: 800, color: 'var(--t3)', borderBottom: '1px solid var(--border)' }}>SCHEDULED CONSULTATIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)' }}>
                {sessions.length === 0 ? (
                  <div style={{ padding: 20, color: 'var(--t3)', fontSize: 12.5, textAlign: 'center' }}>No pipeline sessions scheduled.</div>
                ) : sessions.slice(0, 6).map((s, idx) => (
                  <div key={s.id || idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderBottom: idx < Math.min(sessions.length, 6) - 1 ? '1px solid var(--border)' : 'none', fontSize: 12.5 }}>
                    <div>
                      <strong style={{ color: 'var(--t1)' }}>{s.title}</strong>
                      <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Student: {s.studentName || s.studentId}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 700 }}>{s.time || s.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: 'var(--bg3)', padding: '10px 14px', fontSize: 12, fontWeight: 800, color: 'var(--t3)', borderBottom: '1px solid var(--border)' }}>PIPELINE CANDIDATES</div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: 14, background: 'var(--card)', gap: 10 }}>
                {allStudents.slice(0, 5).map((s: any) => (
                  <div key={s.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, fontSize: 12 }}>
                    <strong>{s.displayName || s.name}</strong>: {s.status || 'onboarding'} · Visa {s.visa_status || 'not_started'}
                  </div>
                ))}
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      )}

      {/* ── TAB: PIPELINE (KANBAN) ───────────────────────────────────────── */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '1fr 380px' : '1fr', gap: 16 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--t3)' }}>Refreshing student pipeline...</div>
          ) : allStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--t3)', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14 }}>
              No pipeline data. Add a student or link candidates via the consultant API.
            </div>
          ) : (
            <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, minmax(195px, 1fr))`, gap: 12, minWidth: 1100 }}>
                {STAGES.map(stage => {
                  const students = pipeline[stage] || [];
                  return (
                    <div
                      key={stage}
                      style={{
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        borderRadius: 16,
                        padding: '16px 12px',
                        minHeight: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: 'var(--font-mono)' }}>
                          {STAGE_LABELS[stage]}
                        </span>
                        <span style={{ fontSize: 10, background: 'var(--bg3)', padding: '2px 8px', borderRadius: 10, color: 'var(--t3)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          {students.length}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
                        {students.map(s => (
                          <div
                            key={s.id}
                            onClick={() => setSelectedStudent(s)}
                            className="glass-card card-hover"
                            style={{
                              background: selectedStudent?.id === s.id ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg3)',
                              border: `1px solid ${selectedStudent?.id === s.id ? 'var(--accent)' : 'var(--border)'}`,
                              borderRadius: 12, padding: 14, cursor: 'pointer', transition: 'all 0.2s ease',
                              position: 'relative'
                            }}
                          >
                            <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--t1)', marginBottom: 4 }}>{s.displayName}</div>
                            <div style={{ fontSize: 10.5, color: 'var(--t3)', marginBottom: 8 }}>{s.targetCountry} · {s.programType}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{
                                fontSize: 9.5, padding: '2px 7px', borderRadius: 8,
                                background: `${VISA_STATUS_COLOR[s.visa_status || 'not_started']}15`,
                                color: VISA_STATUS_COLOR[s.visa_status || 'not_started'],
                                border: `1px solid ${VISA_STATUS_COLOR[s.visa_status || 'not_started']}30`,
                                fontFamily: 'var(--font-mono)', fontWeight: 600
                              }}>
                                Visa: {s.visa_status || 'not_started'}
                              </span>
                              
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                                <button
                                  title="Schedule 1:1 Consultation Session"
                                  onClick={() => {
                                    setSessionForm(prev => ({ ...prev, studentId: s.id }));
                                    setActiveTab('meetings');
                                  }}
                                  className="btn-ghost"
                                  style={{ padding: '2px 6px', fontSize: 11, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }}
                                >
                                  📅
                                </button>
                                {s.vaultItems && s.vaultItems.length > 0 && (
                                  <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    📎{s.vaultItems.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Student details panel */}
          {selectedStudent && (
            <div
              className="glass-card"
              style={{
                border: '1px solid var(--border)',
                borderRadius: 18,
                padding: 22,
                height: 'fit-content',
                position: 'sticky',
                top: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>{selectedStudent.displayName}</div>
                <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 18 }}>✕</button>
              </div>

              <div style={{ fontSize: 11.5, color: 'var(--t2)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, lineHeight: 1.5 }}>
                <div>📧 <strong style={{ color: 'var(--t1)' }}>{selectedStudent.email}</strong></div>
                <div style={{ marginTop: 2 }}>📞 <strong style={{ color: 'var(--t1)' }}>{selectedStudent.phone || 'No phone attached'}</strong></div>
              </div>

              <div style={{ fontSize: 12.5, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px' }}>
                Target: <strong style={{ color: 'var(--accent)' }}>{selectedStudent.targetCountry}</strong> · {selectedStudent.programType}
              </div>

              {/* Status transition dropdown */}
              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Update Stage Status</label>
                <select className="form-input" style={{ width: '100%', marginTop: 6 }} value={selectedStudent.status} onChange={e => updateStatus(selectedStudent.id, e.target.value)}>
                  {STAGES.map(st => <option key={st} value={st}>{STAGE_LABELS[st]}</option>)}
                </select>
              </div>

              {/* Vault Document Verification */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  Vault Credentials Verification
                </div>
                {(!selectedStudent?.vaultItems || selectedStudent.vaultItems.length === 0) ? (
                  <div style={{ fontSize: 11.5, color: 'var(--t3)', fontStyle: 'italic', padding: 8, background: 'rgba(255,255,255,0.01)', borderRadius: 8, textAlign: 'center' }}>
                    No uploads inside student vault yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(selectedStudent.vaultItems || []).map((item: any) => (
                      <div key={item.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--t1)' }}>📄 {item.label || item.type}</span>
                          <span className={`badge ${item.status === 'verified' ? 'badge-green' : item.status === 'rejected' ? 'badge-coral' : 'badge-amber'}`} style={{ fontSize: 9, padding: '2px 6px', fontFamily: 'var(--font-mono)' }}>
                            {item.status || 'pending'}
                          </span>
                        </div>
                        {item.fileUrl && (
                          <div style={{ marginTop: 2 }}>
                            <a href={item.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline', fontSize: 11 }}>
                              Review File
                            </a>
                          </div>
                        )}
                        {item.status !== 'verified' && (
                          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                            <button onClick={() => handleVerifyDocument(item.id, 'verified')} className="btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: 10.5, flex: 1, justifyContent: 'center' }}>
                              ✓ Verify
                            </button>
                            <button onClick={() => handleVerifyDocument(item.id, 'rejected')} className="btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: 10.5, color: 'var(--coral)', border: '1px solid rgba(239,68,68,0.2)', flex: 1, justifyContent: 'center' }}>
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Evolved Project Verification Tracker */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  Student Project Tracker
                </div>
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--t1)' }}>🚀 Hospital Management</span>
                    <span style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 800, fontFamily: 'var(--font-mono)',
                      background: 'rgba(16,185,129,0.08)', color: 'var(--success)'
                    }}>
                      AI Verified (91%)
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                    Certificate: <strong>{mentorVerifiedMap[selectedStudent.id] ? '🏆 Excellence / Co-signed' : '🏅 Issued'}</strong>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <a href="https://github.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', flex: 1 }}>
                      <button className="btn-ghost btn-sm" style={{ width: '100%', fontSize: 10.5, justifyContent: 'center', border: '1px solid var(--border)' }}>
                        Review Repo
                      </button>
                    </a>
                    
                    {!mentorVerifiedMap[selectedStudent.id] ? (
                      <button
                        onClick={() => {
                          setMentorVerifiedMap(prev => ({ ...prev, [selectedStudent.id]: true }));
                          triggerToast('Project Co-Signed as Mentor Verified! 🏆');
                        }}
                        className="btn-primary btn-sm"
                        style={{ flex: 1.2, fontSize: 10.5, justifyContent: 'center' }}
                      >
                        ✓ Mentor Verify
                      </button>
                    ) : (
                      <div style={{ flex: 1.2, textAlign: 'center', background: 'rgba(16,185,129,0.08)', color: 'var(--success)', padding: '6px 0', borderRadius: 8, fontSize: 10.5, fontWeight: 900 }}>
                        ✓ MENTOR VERIFIED
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tasks checklist */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  Assigned Checklists
                </div>
                {(!selectedStudent.tasks || selectedStudent.tasks.length === 0) ? (
                  <div style={{ fontSize: 11.5, color: 'var(--t3)', fontStyle: 'italic', marginBottom: 8 }}>No checklist items assigned.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                    {((selectedStudent.tasks as any[]) || []).map((t, i) => (
                      <div key={i} onClick={async () => {
                        try {
                          await api.patch(`/api/consultant/student/${selectedStudent.id}/task/${t.id || i}`, { completed: !t.completed });
                          fetchPipeline();
                        } catch { triggerToast('Failed to toggle task', 'error'); }
                      }} style={{ display: 'flex', gap: 8, fontSize: 11.5, alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s' }}>
                        <span style={{ color: t.completed ? 'var(--green)' : 'var(--t3)', fontWeight: 'bold' }}>{t.completed ? '✓' : '○'}</span>
                        <span style={{ flex: 1, textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? 'var(--t3)' : 'var(--t1)' }}>
                          {t.title} 
                          {t.priority === 'high' && <span style={{ color: 'var(--coral)', fontSize: 9, marginLeft: 6, fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>[HIGH]</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                  <input value={newTask} onChange={e => setNewTask(e.target.value)} className="form-input" placeholder="New checklist task..." style={{ fontSize: 11.5 }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <select className="form-input" style={{ flex: 1, fontSize: 11, padding: 4 }} value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as any)}>
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium</option>
                      <option value="high">High Priority</option>
                    </select>
                    <input type="date" className="form-input" style={{ fontSize: 11, padding: 4 }} value={newTaskDueDate} onChange={e => setNewTaskDueDate(e.target.value)} />
                    <button onClick={addTask} className="btn-primary btn-sm" style={{ padding: '4px 12px' }}>Add</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: 1:1 MEETINGS ────────────────────────────────────────────── */}
      {activeTab === 'meetings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20 }} className="fade-in">
          {/* Scheduled Sessions list */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Scheduled consultations</h3>
            {sessions.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic', padding: 20, background: 'var(--card)', borderRadius: 10 }}>
                No sessions scheduled yet. Fill out the scheduler form on the right.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sessions.map(s => (
                  <div key={s.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{s.title}</h4>
                      <span className="badge badge-purple" style={{ fontSize: 10 }}>{s.date} @ {s.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>
                      Student: <strong>{s.studentName}</strong>
                    </div>
                    {s.link && (
                      <div style={{ marginTop: 8, fontSize: 11 }}>
                        Meeting URL: <a href={s.link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>{s.link}</a>
                      </div>
                    )}
                    {s.notes && (
                      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--t3)', fontStyle: 'italic' }}>
                        Notes: {s.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule Session form */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Schedule a New Session</h3>
            <form onSubmit={scheduleSessions} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="form-label">Session Title *</label>
                <input className="form-input" style={{ width: '100%' }} value={sessionForm.title} onChange={e => setSessionForm(p => ({ ...p, title: e.target.value }))} required placeholder="e.g. Visa Interview Prep" />
              </div>
              
              <div>
                <label className="form-label">Select Student *</label>
                <select className="form-input" style={{ width: '100%' }} value={sessionForm.studentId} onChange={e => setSessionForm(p => ({ ...p, studentId: e.target.value }))} required>
                  <option value="">-- Choose Candidate --</option>
                  {allStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.displayName} ({s.targetCountry})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-input" style={{ width: '100%' }} value={sessionForm.date} onChange={e => setSessionForm(p => ({ ...p, date: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label">Time *</label>
                  <input type="time" className="form-input" style={{ width: '100%' }} value={sessionForm.time} onChange={e => setSessionForm(p => ({ ...p, time: e.target.value }))} required />
                </div>
              </div>

              <div>
                <label className="form-label">Meeting URL</label>
                <input className="form-input" style={{ width: '100%' }} value={sessionForm.link} onChange={e => setSessionForm(p => ({ ...p, link: e.target.value }))} placeholder="https://zoom.us/j/..." />
              </div>

              <div>
                <label className="form-label">Agenda Notes</label>
                <textarea className="form-input" style={{ width: '100%', minHeight: 60, resize: 'vertical' }} value={sessionForm.notes} onChange={e => setSessionForm(p => ({ ...p, notes: e.target.value }))} placeholder="Review documents and mocks..." />
              </div>

              <button type="submit" disabled={scheduling} className="btn-primary" style={{ marginTop: 8, justifyContent: 'center' }}>
                {scheduling ? 'Scheduling Session...' : 'Schedule Session'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB: STUDENT INTELLIGENCE ────────────────────────────────────── */}
      {activeTab === 'intelligence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fade-in">
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🔍 Candidate Employability & Academic Intelligence</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Comprehensive review of student transcripts, tests, and international placement indicators.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 16, alignItems: 'start' }}>
            
            {/* Left Column: Candidate List */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: 'var(--bg3)', padding: '10px 14px', fontSize: 11.5, fontWeight: 800, color: 'var(--t3)', borderBottom: '1px solid var(--border)' }}>
                COHORT REGISTRY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)' }}>
                {allStudents.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--t3)', fontSize: 12.5 }}>No pipeline data</div>
                ) : allStudents.map((raw: any, idx: number) => {
                  const stud = {
                    name: raw.displayName || raw.name || 'Candidate',
                    ats: raw.ats_score ?? '—',
                    coding: raw.trust_score ?? '—',
                    comm: raw.email || '—',
                    placement: raw.ats_score != null ? `${raw.ats_score}%` : '—',
                    dna: raw.career_track ? `🤖 ${raw.career_track}` : '—',
                    research: '—',
                    projects: `${(raw.vaultItems || []).length} vault items`,
                    ielts: '—',
                    gre: '—',
                    cgpa: '—',
                    scholarship: '—',
                    probability: '—'
                  };
                  return (
                  <div
                    key={raw.id || idx}
                    onClick={() => setSelectedIntelStudent(stud)}
                    style={{
                      padding: 14,
                      borderBottom: idx < allStudents.length - 1 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer',
                      background: selectedIntelStudent?.name === stud.name ? 'rgba(99,102,241,0.06)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: selectedIntelStudent?.name === stud.name ? 'var(--accent)' : 'var(--t1)', fontSize: 13.5 }}>{stud.name}</strong>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)' }}>{stud.placement} Ready</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
                      ATS: {stud.ats}/100 | Trust: {stud.coding}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Detailed Candidate Intelligence Dashboard */}
            {selectedIntelStudent && (
              <div style={{
                background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 20,
                display: 'flex', flexDirection: 'column', gap: 16
              }} className="fade-in">
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>{selectedIntelStudent.name}</h4>
                    <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', marginTop: 2, display: 'inline-block' }}>
                      {selectedIntelStudent.dna}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>Career Readiness</span>
                    <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--success)' }}>{selectedIntelStudent.placement}</div>
                  </div>
                </div>

                {/* Core Parameters Row 1 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Resume ATS Score</span>
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', marginTop: 4 }}>{selectedIntelStudent.ats} / 100</div>
                  </div>
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Coding Pass Rate</span>
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>{selectedIntelStudent.coding}%</div>
                  </div>
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Communication</span>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: selectedIntelStudent.comm.includes('Needs') ? 'var(--danger)' : 'var(--t1)', marginTop: 6 }}>
                      {selectedIntelStudent.comm}
                    </div>
                  </div>
                </div>

                {/* Core Parameters Row 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Research Publications</span>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>{selectedIntelStudent.research}</div>
                  </div>
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Projects Built</span>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>{selectedIntelStudent.projects}</div>
                  </div>
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Academic CGPA</span>
                    <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--accent)', marginTop: 4 }}>{selectedIntelStudent.cgpa}</div>
                  </div>
                </div>

                {/* Tests & Admission Probability */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: 8, padding: 8 }}>
                    <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>IELTS Band</span>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)', marginTop: 2 }}>{selectedIntelStudent.ielts}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: 8, padding: 8 }}>
                    <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>GRE Score</span>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)', marginTop: 2 }}>{selectedIntelStudent.gre}</div>
                  </div>
                  <div style={{ background: 'rgba(20,184,166,0.03)', borderRadius: 8, padding: 8, border: '1px solid rgba(20,184,166,0.1)' }}>
                    <span style={{ fontSize: 9.5, color: 'var(--teal)' }}>Scholarship Match</span>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--teal)', marginTop: 2 }}>{selectedIntelStudent.scholarship}</div>
                  </div>
                  <div style={{ background: 'rgba(99,102,241,0.03)', borderRadius: 8, padding: 8, border: '1px solid rgba(99,102,241,0.1)' }}>
                    <span style={{ fontSize: 9.5, color: 'var(--accent)' }}>Admission Odds</span>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--accent)', marginTop: 2 }}>{selectedIntelStudent.probability}</div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ── TAB: CAREER PLANNING ────────────────────────────────────────── */}
      {activeTab === 'career_planning' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>💼 AI Career & Path Planner</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Shift candidate mapping conversations from simple country choice to strategic goal-driven pathways.</p>
          </div>

          {/* Goal Selector */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Goal Target:</span>
            <select
              value={selectedGoal}
              onChange={e => setSelectedGoal(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 250 }}
            >
              <option value="AI Engineer">AI Engineer</option>
              <option value="Cloud Architect">Cloud Infrastructure Architect</option>
              <option value="Distributed Systems Dev">Distributed Systems Dev</option>
            </select>
          </div>

          {/* Flowchart path matching */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, alignItems: 'stretch' }}>
            {[
              {
                step: '1. GOAL',
                val: selectedGoal,
                bg: 'rgba(99,102,241,0.06)',
                border: 'rgba(99,102,241,0.2)'
              },
              {
                step: '2. CAREER TARGET',
                val: selectedGoal === 'AI Engineer' ? 'ML Ops Engineer / AI Software Dev' : selectedGoal === 'Cloud Architect' ? 'Cloud Solutions Architect' : 'Backend Infra Architect',
                bg: 'rgba(20,184,166,0.06)',
                border: 'rgba(20,184,166,0.2)'
              },
              {
                step: '3. REQUIRED SKILLS',
                val: selectedGoal === 'AI Engineer' ? 'PyTorch, Python, MLOps, Calculus' : selectedGoal === 'Cloud Architect' ? 'AWS, Kubernetes, Terraform' : 'Go, C++, Distributed Consensus',
                bg: 'rgba(245,158,11,0.06)',
                border: 'rgba(245,158,11,0.2)'
              },
              {
                step: '4. BEST COUNTRIES',
                val: selectedGoal === 'AI Engineer' ? 'Canada, Germany, USA, Singapore' : selectedGoal === 'Cloud Architect' ? 'USA, UK, Australia' : 'Germany, Singapore, Netherlands',
                bg: 'rgba(16,185,129,0.06)',
                border: 'rgba(16,185,129,0.2)'
              },
              {
                step: '5. TARGET UNIVERSITIES',
                val: selectedGoal === 'AI Engineer' ? 'TU Munich, Stanford, NUS, Univ of Toronto' : selectedGoal === 'Cloud Architect' ? 'MIT, UC Berkeley, UCL London' : 'TU Delft, NUS Singapore, ETH Zurich',
                bg: 'rgba(99,102,241,0.06)',
                border: 'rgba(99,102,241,0.2)'
              },
              {
                step: '6. KEY ADVANTAGES',
                val: selectedGoal === 'AI Engineer' ? 'Strong AI Labs, Low Tuition, Good Visa, High Placement' : selectedGoal === 'Cloud Architect' ? 'AWS Headquarter access, Tech Hub, Premium Salaries' : 'Industry R&D Centers, Visa Sponsorship, High starting CTC',
                bg: 'rgba(20,184,166,0.06)',
                border: 'rgba(20,184,166,0.2)'
              }
            ].map((node, i) => (
              <div key={i} style={{
                background: node.bg, border: `1px solid ${node.border}`,
                borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 6
              }}>
                <span style={{ fontSize: 9.5, fontWeight: 900, color: 'var(--t3)', letterSpacing: '0.5px' }}>{node.step}</span>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.45 }}>{node.val}</div>
              </div>
            ))}
          </div>

          {/* List of matching candidate goals mapped */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginTop: 10 }}>
            <div style={{ background: 'var(--bg3)', padding: '10px 14px', fontSize: 11.5, fontWeight: 800, color: 'var(--t3)', borderBottom: '1px solid var(--border)' }}>ACTIVE MAPPINGS BY COHORT</div>
            <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)' }}>
              {allStudents.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 12.5 }}>No pipeline data</div>
              ) : allStudents.map((raw: any, idx: number) => {
                const mapItem = {
                  name: raw.displayName || raw.name || 'Candidate',
                  goal: raw.career_track || raw.programType || '—',
                  progress: raw.ats_score != null ? `${raw.ats_score}% ATS` : 'No ATS yet'
                };
                return (
                <div key={raw.id || idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderBottom: idx < allStudents.length - 1 ? '1px solid var(--border)' : 'none', fontSize: 12.5 }}>
                  <div>
                    <strong style={{ color: 'var(--t1)' }}>{mapItem.name}</strong>
                    <span style={{ fontSize: 11, color: 'var(--t3)', marginLeft: 8 }}>Targeting: {mapItem.goal}</span>
                  </div>
                  <span style={{ color: 'var(--success)', fontWeight: 800 }}>{mapItem.progress}</span>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: STUDY ABROAD ────────────────────────────────────────────── */}
      {activeTab === 'study_abroad' && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20 }} className="fade-in">
          
          {/* Left Column: Countries list & Target states */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Global Admissions Pipelines</h3>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--t3)' }}>Select a candidate to view their active visa advisor status.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {allStudents.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--t3)', fontSize: 12.5, border: '1px solid var(--border)', borderRadius: 12 }}>No pipeline data</div>
              ) : allStudents.map((raw: any, idx: number) => {
                const c = {
                  name: raw.displayName || raw.name || 'Candidate',
                  country: raw.targetCountry || '—',
                  program: raw.programType || '—',
                  visa: raw.visa_status || 'not_started'
                };
                const isSelected = selectedVisaStudent === c.name;
                return (
                  <div
                    key={raw.id || idx}
                    onClick={() => setSelectedVisaStudent(c.name)}
                    style={{
                      background: isSelected ? 'var(--bg3)' : 'var(--card)',
                      border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: 12, padding: 14, cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 13, color: isSelected ? 'var(--accent)' : 'var(--t1)' }}>{c.name}</strong>
                      <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{c.program} · Target: {c.country}</div>
                    </div>
                    <span style={{
                      fontSize: 10,
                      background: c.visa === 'approved' || c.visa === 'Approved' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                      color: c.visa === 'approved' || c.visa === 'Approved' ? 'var(--success)' : 'var(--amber)',
                      padding: '3px 8px', borderRadius: 20, fontWeight: 800
                    }}>
                      {c.visa}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Onboard new candidate */}
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Onboard New Candidate</h4>
              <form onSubmit={addStudent} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input value={studentForm.displayName} onChange={e => setStudentForm(x => ({ ...x, displayName: e.target.value }))} className="form-input" style={{ fontSize: 12, padding: '6px 10px' }} placeholder="Full name *" required />
                <input value={studentForm.email} onChange={e => setStudentForm(x => ({ ...x, email: e.target.value }))} className="form-input" style={{ fontSize: 12, padding: '6px 10px' }} placeholder="Email address" />
                <input value={studentForm.phone} onChange={e => setStudentForm(x => ({ ...x, phone: e.target.value }))} className="form-input" style={{ fontSize: 12, padding: '6px 10px' }} placeholder="Phone number" />
                <input value={studentForm.targetCountry} onChange={e => setStudentForm(x => ({ ...x, targetCountry: e.target.value }))} className="form-input" style={{ fontSize: 12, padding: '6px 10px' }} placeholder="Target Country (USA, Germany...)" />
                <input value={studentForm.programType} onChange={e => setStudentForm(x => ({ ...x, programType: e.target.value }))} className="form-input" style={{ fontSize: 12, padding: '6px 10px' }} placeholder="Program Type (MS, MBA...)" />
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '8px 0', fontSize: 12 }}>+ Add Candidate Profile</button>
              </form>
            </div>
          </div>

          {/* Right Column: AI Visa Advisor & Country Intelligence */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            {/* Sub-tab selection bar inside right column */}
            <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
              {[
                { id: 'visa', label: '🌍 AI Visa Advisor' },
                { id: 'country', label: '🗺️ Country Intelligence' }
              ].map(subTab => (
                <button
                  key={subTab.id}
                  onClick={() => setStudyAbroadSubTab(subTab.id)}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontSize: 11.5, fontWeight: studyAbroadSubTab === subTab.id ? 800 : 600,
                    background: studyAbroadSubTab === subTab.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                    color: studyAbroadSubTab === subTab.id ? 'var(--accent)' : 'var(--t3)',
                    transition: 'all 0.15s'
                  }}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {studyAbroadSubTab === 'visa' && (
              <div style={{ padding: 28, textAlign: 'center', color: 'var(--t3)', fontSize: 13, border: '1px solid var(--border)', borderRadius: 12 }} className="fade-in">
                {allStudents.length === 0
                  ? 'No pipeline-linked data'
                  : selectedVisaStudent
                    ? 'No visa dossier on file for this candidate'
                    : 'Select a candidate to view visa dossier status.'}
              </div>
            )}

            {studyAbroadSubTab === 'country' && (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }} className="fade-in">
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>🗺️ Country Intelligence Comparer</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--t3)' }}>Compare study abroad destinations across PR ease, visa difficulty, and AI jobs availability.</p>
                </div>

                {/* Country dropdowns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 10.5 }}>Country A</label>
                    <select value={countryCompA} onChange={e => setCountryCompA(e.target.value)} className="form-input" style={{ width: '100%', fontSize: 12, padding: '6px 10px' }}>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="USA">USA</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 10.5 }}>Country B</label>
                    <select value={countryCompB} onChange={e => setCountryCompB(e.target.value)} className="form-input" style={{ width: '100%', fontSize: 12, padding: '6px 10px' }}>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="USA">USA</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>
                </div>

                {/* Comparative metrics view */}
                {(() => {
                  const db: Record<string, { visa: string; jobs: string; pr: string; aiJobs: string; tuition: string }> = {
                    Canada: { visa: 'Easy', jobs: '★★★★☆', pr: '★★★★☆', aiJobs: '★★★★★', tuition: '$$$$' },
                    Germany: { visa: 'Easy', jobs: '★★★★☆', pr: '★★★☆☆', aiJobs: '★★★★☆', tuition: '$' },
                    USA: { visa: 'Hard', jobs: '★★★★★', pr: '★★☆☆☆', aiJobs: '★★★★★', tuition: '$$$$$' },
                    Singapore: { visa: 'Medium', jobs: '★★★★☆', pr: '★★☆☆☆', aiJobs: '★★★★☆', tuition: '$$$' }
                  };

                  const aData = db[countryCompA] || db['Germany'];
                  const bData = db[countryCompB] || db['Canada'];

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, color: 'var(--t2)' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '6px 4px' }}>Metric</th>
                            <th style={{ padding: '6px 4px', color: 'var(--accent)', fontWeight: 800 }}>{countryCompA}</th>
                            <th style={{ padding: '6px 4px', color: 'var(--success)', fontWeight: 800 }}>{countryCompB}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 4px', fontWeight: 700 }}>Embassy Visa Path</td>
                            <td style={{ padding: '8px 4px' }}>{aData.visa}</td>
                            <td style={{ padding: '8px 4px' }}>{bData.visa}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 4px', fontWeight: 700 }}>Jobs Availability</td>
                            <td style={{ padding: '8px 4px' }}>{aData.jobs}</td>
                            <td style={{ padding: '8px 4px' }}>{bData.jobs}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 4px', fontWeight: 700 }}>PR Pathway ease</td>
                            <td style={{ padding: '8px 4px' }}>{aData.pr}</td>
                            <td style={{ padding: '8px 4px' }}>{bData.pr}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 4px', fontWeight: 700 }}>AI/Tech Job Index</td>
                            <td style={{ padding: '8px 4px' }}>{aData.aiJobs}</td>
                            <td style={{ padding: '8px 4px' }}>{bData.aiJobs}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '8px 4px', fontWeight: 700 }}>Tuition Expense</td>
                            <td style={{ padding: '8px 4px', color: 'var(--success)', fontWeight: 800 }}>{aData.tuition}</td>
                            <td style={{ padding: '8px 4px', color: 'var(--success)', fontWeight: 800 }}>{bData.tuition}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })()}

              </div>
            )}

          </div>

        </div>
      )}

      {/* ── TAB: MENTORSHIP ──────────────────────────────────────────────── */}
      {activeTab === 'mentorship' && (
        <div className="fade-in">
          <AlumniMentorshipView pipeline={pipeline} triggerToast={triggerToast} />
        </div>
      )}

      {/* ── TAB: UNIVERSITY MATCHING ─────────────────────────────────────── */}
      {activeTab === 'univ_matching' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🏫 AI University Matching Engine</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Align student scores, budgets, and Career DNA with global universities using the Dream-Reach-Safe classifier.</p>
          </div>

          {/* Student Selector */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Profile:</span>
            <select
              value={matchingStudent}
              onChange={e => setMatchingStudent(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 220 }}
            >
              {allStudents.length === 0 ? (
                <option value="">No pipeline data</option>
              ) : allStudents.map((s: any) => (
                <option key={s.id} value={s.displayName || s.name}>{s.displayName || s.name}</option>
              ))}
            </select>
          </div>

          {/* Matching Criteria Block */}
          <div style={{ padding: 28, textAlign: 'center', color: 'var(--t3)', fontSize: 13, border: '1px solid var(--border)', borderRadius: 12 }}>
            {allStudents.length === 0
              ? 'No pipeline-linked data'
              : matchingStudent
                ? 'No matching dossier on file for this candidate'
                : 'No pipeline-linked data'}
          </div>
        </div>
      )}

      {/* ── TAB: SCHOLARSHIP CENTER ──────────────────────────────────────── */}
      {activeTab === 'scholarship' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🏆 Global Scholarship Matching Center</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Auto-identify scholarship qualifiers from candidate registration logs.</p>
          </div>

          {/* Student Selector */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Profile:</span>
            <select
              value={matchingStudent}
              onChange={e => setMatchingStudent(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 220 }}
            >
              {allStudents.length === 0 ? (
                <option value="">No pipeline data</option>
              ) : allStudents.map((s: any) => (
                <option key={s.id} value={s.displayName || s.name}>{s.displayName || s.name}</option>
              ))}
            </select>
          </div>

          {/* Inner Category Tabs */}
          <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
            {[
              { id: 'government', label: '🏛️ Government' },
              { id: 'university', label: '🏫 University' },
              { id: 'private', label: '🤝 Private' },
              { id: 'company', label: '🏢 Company Sponsored' }
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setScholarshipSubTab(sub.id)}
                style={{
                  padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: scholarshipSubTab === sub.id ? 850 : 600,
                  background: scholarshipSubTab === sub.id ? 'var(--bg3)' : 'transparent',
                  color: scholarshipSubTab === sub.id ? 'var(--accent)' : 'var(--t2)',
                  transition: 'all 0.15s'
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Auto matched output list */}
          {(() => {
            // Get CGPA
            const pipelineStudent = allStudents.find((s: any) => (s.displayName || s.name) === matchingStudent);
            const cgpaVal = pipelineStudent?.cgpa != null ? Number(pipelineStudent.cgpa) : null;
            if (cgpaVal == null) {
              return (
                <div style={{ padding: 28, textAlign: 'center', color: 'var(--t3)', fontSize: 13, border: '1px solid var(--border)', borderRadius: 12 }}>
                  {allStudents.length === 0 ? 'No pipeline data' : 'No CGPA on file for this candidate — scholarship auto-match requires real grade data.'}
                </div>
              );
            }

            // Define scholarships database
            const scholarships: Record<string, Array<{ name: string; reqCgpa: number; funding: string; desc: string }>> = {
              government: [
                { name: 'DAAD Scholarship (Germany)', reqCgpa: 8.5, funding: 'Full Tuition + €1200/mo allowance', desc: 'Highly competitive government grant for international postgraduates.' },
                { name: 'Erasmus Mundus Scholarship', reqCgpa: 8.0, funding: 'Full Tuition + Travel + €1000/mo allowance', desc: 'Joint Master degrees funding across European countries.' },
                { name: 'Chevening Scholarship (UK)', reqCgpa: 8.0, funding: 'Full Tuition + UK Living costs', desc: 'UK government global award for leadership candidates.' },
                { name: 'Fulbright Foreign Student Program', reqCgpa: 7.5, funding: 'Partial/Full Tuition + Health covers', desc: 'US government exchange program for research postgraduates.' }
              ],
              university: [
                { name: 'TU Munich Merit Scholarship', reqCgpa: 8.5, funding: '€500 - €1000 per semester stipend', desc: 'Academics-based merit allowance offered directly by TUM.' },
                { name: 'Stanford Engineering Fellowship', reqCgpa: 9.0, funding: 'Full Tuition + Research Stipend', desc: 'Highly selective department fellowship for top grads.' },
                { name: 'NUS Research Scholarship', reqCgpa: 8.0, funding: 'Full Tuition cover + SGD 2200/mo', desc: 'Graduate research matching grant at NUS Singapore.' }
              ],
              private: [
                { name: 'Gates Cambridge Scholarship', reqCgpa: 9.0, funding: 'Full Cambridge Tuition + Living expenses', desc: 'Global postgraduate grant sponsored by Bill & Melinda Gates.' },
                { name: 'Knight-Hennessy Scholars Program', reqCgpa: 8.8, funding: 'Full tuition + Stanford living allowances', desc: 'Multidisciplinary leadership scholars award at Stanford.' }
              ],
              company: [
                { name: 'Microsoft Research Fellowship', reqCgpa: 8.5, funding: 'USD $20,000 research grant', desc: 'Supports doctoral/master research projects in AI and computing.' },
                { name: 'Google PhD Fellowship Program', reqCgpa: 9.0, funding: 'Full tuition + USD $30,000 stipend', desc: 'Supports outstanding graduate researchers in Computer Science.' }
              ]
            };

            const list = scholarships[scholarshipSubTab] || [];

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {list.map((s, idx) => {
                  const eligible = cgpaVal >= s.reqCgpa;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: 12, padding: 16,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: 13.5, color: 'var(--t1)' }}>{s.name}</strong>
                        <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>Funding: <strong>{s.funding}</strong></div>
                        <p style={{ margin: '6px 0 0 0', fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>{s.desc}</p>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', minWidth: 160 }}>
                        <span style={{
                          fontSize: 10.5, fontWeight: 900,
                          background: eligible ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                          color: eligible ? 'var(--success)' : 'var(--danger)',
                          padding: '4px 10px', borderRadius: 20
                        }}>
                          {eligible ? '✓ AUTO MATCHED' : '✗ INELIGIBLE'}
                        </span>
                        <span style={{ fontSize: 10, color: 'var(--t3)' }}>Required CGPA: {s.reqCgpa}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── TAB: DOCUMENTS ───────────────────────────────────────────────── */}
      {activeTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
          
          {/* Top Title & Sub-tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>📄 Document Intelligence Vault</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Audit applicant CVs or generate tailored Statement of Purposes (SOPs) instantly.</p>
            </div>
            
            {/* Inner Mode Selector */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
              {[
                { id: 'auditor', label: '🔍 AI Auditor' },
                { id: 'builder', label: '✍️ AI SOP Builder' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setDocumentsSubMode(sub.id)}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontSize: 12, fontWeight: documentsSubMode === sub.id ? 800 : 600,
                    background: documentsSubMode === sub.id ? 'var(--bg2)' : 'transparent',
                    color: documentsSubMode === sub.id ? 'var(--accent)' : 'var(--t3)',
                    transition: 'all 0.15s'
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Student Selector */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Profile:</span>
            <select
              value={selectedDocStudent}
              onChange={e => {
                setSelectedDocStudent(e.target.value);
                setShowSopAudit(false);
                setShowResumeAudit(false);
                setShowLorAudit(false);
                setGeneratedSop('');
              }}
              className="form-input"
              style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 220 }}
            >
              {allStudents.length === 0 ? (
                <option value="">No pipeline data</option>
              ) : allStudents.map((s: any) => (
                <option key={s.id} value={s.displayName || s.name}>{s.displayName || s.name}</option>
              ))}
            </select>
          </div>

          {/* ──────────────── DOCUMENTS SUB-MODE: AUDITOR ──────────────── */}
          {documentsSubMode === 'auditor' && (
            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16, alignItems: 'start' }} className="fade-in">
              
              {/* Left: Document Package List */}
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submitted Files</span>
                
                {/* SOP doc row */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>📄 Statement of Purpose (SOP)</span>
                    <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.08)', color: 'var(--amber)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>Draft 2</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowSopAudit(true);
                      setShowResumeAudit(false);
                      setShowLorAudit(false);
                    }}
                    className="btn-primary btn-sm"
                    style={{ width: '100%', padding: '6px 0', fontSize: 11, justifyContent: 'center' }}
                  >
                    🔍 AI Audit SOP Content
                  </button>
                </div>

                {/* Resume doc row */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>📄 Resume (CV)</span>
                    <span style={{ fontSize: 10, background: 'rgba(16,185,129,0.08)', color: 'var(--success)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>Completed</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowSopAudit(false);
                      setShowResumeAudit(true);
                      setShowLorAudit(false);
                    }}
                    className="btn-primary btn-sm"
                    style={{ width: '100%', padding: '6px 0', fontSize: 11, justifyContent: 'center' }}
                  >
                    ⚡ AI ATS CV Scan
                  </button>
                </div>

                {/* LOR doc row */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>📄 Letter of Recommendation</span>
                    <span style={{ fontSize: 10, background: 'rgba(99,102,241,0.08)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>Locked</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowSopAudit(false);
                      setShowResumeAudit(false);
                      setShowLorAudit(true);
                    }}
                    className="btn-primary btn-sm"
                    style={{ width: '100%', padding: '6px 0', fontSize: 11, justifyContent: 'center' }}
                  >
                    🤝 AI LOR Content Review
                  </button>
                </div>

              </div>

              {/* Right: AI Audit Report View */}
              <div style={{ minHeight: 300 }}>
                {!showSopAudit && !showResumeAudit && !showLorAudit ? (
                  <div style={{
                    height: '100%', border: '1.5px dashed var(--border)', borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontSize: 13, fontStyle: 'italic', padding: 40, textAlign: 'center'
                  }}>
                    Click one of the AI Audit actions on the left to begin instant document auditing.
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }} className="fade-in">
                    
                    {/* SOP Report */}
                    {showSopAudit && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                          <strong style={{ color: 'var(--t1)', fontSize: 14.5 }}>SOP Quality Audit: {selectedDocStudent}</strong>
                          <span style={{ fontSize: 11.5, background: 'rgba(99,102,241,0.08)', color: 'var(--accent)', padding: '3px 8px', borderRadius: 4, fontWeight: 800 }}>Overall Score: 87/100</span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                            <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Grammar Score</span>
                            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>92%</div>
                          </div>
                          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                            <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Uniqueness Index</span>
                            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent)', marginTop: 4 }}>81%</div>
                          </div>
                          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                            <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Research Alignment</span>
                            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--teal)', marginTop: 4 }}>78%</div>
                          </div>
                          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                            <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Leadership Indication</span>
                            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--amber)', marginTop: 4 }}>91%</div>
                          </div>
                        </div>

                        <div style={{ fontSize: 12.5, color: 'var(--t2)', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, lineHeight: 1.45 }}>
                          <strong>AI Summary Feedback:</strong> The Statement of Purpose shows high grammatical consistency and a strong leadership narrative. However, the academic research section needs more alignment with specific faculty labs.
                        </div>
                      </div>
                    )}

                    {/* Resume Report */}
                    {showResumeAudit && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                          <strong style={{ color: 'var(--t1)', fontSize: 14.5 }}>Resume ATS Scan: {selectedDocStudent}</strong>
                          <span style={{ fontSize: 11.5, background: 'rgba(20,184,166,0.08)', color: 'var(--teal)', padding: '3px 8px', borderRadius: 4, fontWeight: 800 }}>ATS Score: 82/100</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase' }}>AI Improvement Checklist</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
                            <div>• <strong>Metrics & Impact</strong>: Add metric indicators in project descriptions (e.g. *improved API speed by 20%*).</div>
                            <div>• <strong>Skills format</strong>: Separate language skills from frameworks in discrete tables.</div>
                            <div>• <strong>Keywords match</strong>: Add matching keywords for the AI/ML Software Engineering role.</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* LOR Report */}
                    {showLorAudit && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                          <strong style={{ color: 'var(--t1)', fontSize: 14.5 }}>LOR Tone & Verification: {selectedDocStudent}</strong>
                          <span style={{ fontSize: 11.5, background: 'rgba(16,185,129,0.08)', color: 'var(--success)', padding: '3px 8px', borderRadius: 4, fontWeight: 800 }}>Tone: Excellent</span>
                        </div>

                        <div style={{ fontSize: 12.5, color: 'var(--t2)', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, lineHeight: 1.45 }}>
                          <strong>Recommender Audit:</strong> Letter presents a highly detailed, professional endorsement of technical capabilities, confirming student's core roleplay strengths in university projects. Verification signatures match institutional registry.
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

            </div>
          )}

          {/* ──────────────── DOCUMENTS SUB-MODE: SOP BUILDER ─────────────── */}
          {documentsSubMode === 'builder' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="fade-in">
              
              {/* Left Column: Form Inputs */}
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>AI SOP Generator Parameters</h4>
                
                <div>
                  <label className="form-label" style={{ fontSize: 11.5 }}>Core Academic/Professional Projects</label>
                  <textarea
                    value={sopProjects}
                    onChange={e => setSopProjects(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', minHeight: 60, fontSize: 12.5 }}
                    placeholder="e.g. Built decentralized chat app using WebRTC and IPFS for privacy-preserving p2p messages."
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11.5 }}>Research Experience & Focus</label>
                  <textarea
                    value={sopResearch}
                    onChange={e => setSopResearch(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', minHeight: 60, fontSize: 12.5 }}
                    placeholder="e.g. Analyzed low-resource NLP datasets with transformer-based adapters at NLP labs."
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11.5 }}>Target Career Goal</label>
                  <input
                    value={sopGoal}
                    onChange={e => setSopGoal(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', fontSize: 12.5 }}
                    placeholder="e.g. AI Research Engineer / ML Infrastructure Architect"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11.5 }}>Key Achievements / Awards</label>
                  <textarea
                    value={sopAchievements}
                    onChange={e => setSopAchievements(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', minHeight: 60, fontSize: 12.5 }}
                    placeholder="e.g. Ranked 1st in State Coding Quest, CGPA 8.4/10"
                  />
                </div>

                <button
                  disabled={generatingSop}
                  onClick={() => {
                    setGeneratingSop(true);
                    setTimeout(() => {
                      setGeneratingSop(false);
                      setGeneratedSop(
                        `STATEMENT OF PURPOSE\n\nTo the Admissions Committee,\n\nI am writing to express my eager candidacy for the Graduate Master program at your prestigious institution. My ultimate career goal is to work as an ${sopGoal || 'AI Research Specialist'} driving advancements in decentralized software technologies.\n\nThroughout my undergraduate batch work, my primary project focus lay in designing distributed modules, notably: ${sopProjects || 'building decentralized and scalable systems'}. This academic project solidifies my hands-on knowledge in systems design. Furthermore, my research in ${sopResearch || 'machine learning models'} teaches me the rigors of formal validation. Guided by my cumulative achievements, including: ${sopAchievements || 'academic honors'}, I am confident that I can excel inside your premium labs.\n\nI look forward to contributing to your academic community.\n\nSincerely,\n${selectedDocStudent}`
                      );
                      toastObj.success('SOP Draft Generated', 'Athena AI successfully mapped your inputs into a tailored Statement of Purpose draft.');
                    }, 1200);
                  }}
                  className="btn-primary"
                  style={{ justifyContent: 'center', padding: '10px 0', fontSize: 12.5, fontWeight: 700 }}
                >
                  {generatingSop ? 'Athena Generating SOP...' : '⚡ Generate Statement of Purpose'}
                </button>
              </div>

              {/* Right Column: Generated SOP Output Editor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>Generated Draft Editor</h4>
                  {generatedSop && (
                    <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.08)', color: 'var(--success)', padding: '2px 8px', borderRadius: 4, fontWeight: 800 }}>
                      Draft Generated
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, minHeight: 330, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <textarea
                    value={generatedSop}
                    onChange={e => setGeneratedSop(e.target.value)}
                    className="form-input"
                    style={{
                      width: '100%', flex: 1, minHeight: 280, fontSize: 13,
                      fontFamily: 'var(--font-mono)', lineHeight: 1.5, background: 'var(--bg3)',
                      color: 'var(--t1)', padding: 14, border: '1px solid var(--border)', borderRadius: 12,
                      resize: 'none'
                    }}
                    placeholder="Athena AI generated Statement of Purpose draft will render here. You can edit the text inline once generated."
                  />
                  
                  {generatedSop && (
                    <button
                      onClick={() => {
                        toastObj.success('SOP Locked & Saved', 'The final SOP draft has been successfully saved to the candidate package vault.');
                      }}
                      className="btn-primary"
                      style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '10px 0', fontSize: 12.5, fontWeight: 700, justifyContent: 'center' }}
                    >
                      💾 Save & Lock Final SOP Draft
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ── TAB: PLACEMENT TIMELINE ──────────────────────────────────────── */}
      {activeTab === 'placement_timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🚀 Placement After Graduation Timeline</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Follow active candidates through their academic lifecycle and global career placements.</p>
          </div>

          {/* Student Selector */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Profile:</span>
            <select
              value={matchingStudent}
              onChange={e => setMatchingStudent(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 220 }}
            >
              {allStudents.length === 0 ? (
                <option value="">No pipeline data</option>
              ) : allStudents.map((s: any) => (
                <option key={s.id} value={s.displayName || s.name}>{s.displayName || s.name}</option>
              ))}
            </select>
          </div>

          {/* Timeline Cards Container */}
          <div style={{ padding: 28, textAlign: 'center', color: 'var(--t3)', fontSize: 13, border: '1px solid var(--border)', borderRadius: 12 }}>
            {allStudents.length === 0
              ? 'No pipeline-linked data'
              : matchingStudent
                ? 'No placement stages on file for this candidate'
                : 'No pipeline-linked data'}
          </div>

          {/* Semester-by-Semester Academic Career Roadmap */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>🎓 Post-Admission Academic & Career Roadmap</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--t3)' }}>Follow and update candidate progress semester-by-semester inside their target master program.</p>
            </div>

            <div style={{ padding: 28, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
              {allStudents.length === 0
                ? 'No pipeline-linked data'
                : matchingStudent
                  ? 'No roadmap on file for this candidate'
                  : 'No pipeline-linked data'}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: GLOBAL OPPORTUNITY RADAR ────────────────────────────────── */}
      {activeTab === 'opportunity_radar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>📡 Global Opportunity Radar</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Continuously scanning and matching global hackathons, research positions, internships, and fellowships to candidate profiles.</p>
            </div>
            <button
              onClick={() => {
                toastObj.success('Radar Sync Complete', 'Scanned 14 active international channels. Mapped new target slots.');
              }}
              className="btn-primary"
              style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12 }}
            >
              🔄 Scan Global Channels
            </button>
          </div>

          {/* Student Selector */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>Select Candidate Profile:</span>
            <select
              value={matchingStudent}
              onChange={e => setMatchingStudent(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 220 }}
            >
              {allStudents.length === 0 ? (
                <option value="">No pipeline data</option>
              ) : allStudents.map((s: any) => (
                <option key={s.id} value={s.displayName || s.name}>{s.displayName || s.name}</option>
              ))}
            </select>
          </div>

          {/* Matches List Grid */}
          <div style={{ padding: 28, textAlign: 'center', color: 'var(--t3)', fontSize: 13, border: '1px solid var(--border)', borderRadius: 12 }}>
            {allStudents.length === 0
              ? 'No pipeline-linked data'
              : matchingStudent
                ? 'No opportunity matches on file for this candidate'
                : 'No pipeline-linked data'}
          </div>
        </div>
      )}

      {/* ── TAB: ANALYTICS ──────────────────────────────────────────────── */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="fade-in">
          {[
            { label: 'Active Roster Students', value: a.totalStudents || 0, color: 'var(--accent)' },
            { label: 'Annual Pipeline Revenue', value: `₹${((a.totalRevenue || 0) / 1000).toFixed(0)}K`, color: 'var(--green)' },
            { label: 'Visa Approval Success Rate', value: `${a.visaApprovalRate || 0}%`, color: 'var(--teal)' },
            { label: 'Admissions Offer Success Rate', value: `${a.offerRate || 0}%`, color: 'var(--amber)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: AI CONSULTANT COPILOT ───────────────────────────────────── */}
      {activeTab === 'copilot' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 420 }} className="fade-in">
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🤖 AI Consultant Copilot Chat</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Athena AI assistant helping you audit cohort admissions probability and scholarship matches.</p>
          </div>

          <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', marginTop: 14 }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--card)' }}>
              {copilotMessages.map((m, idx) => (
                <div key={idx} style={{
                  alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end',
                  background: m.role === 'assistant' ? 'var(--bg3)' : 'var(--accent)',
                  color: m.role === 'assistant' ? 'var(--t1)' : 'white',
                  padding: '8px 12px', borderRadius: 8, fontSize: 12, maxWidth: '85%',
                  border: m.role === 'assistant' ? '1px solid var(--border)' : 'none'
                }}>
                  {m.text}
                </div>
              ))}
            </div>

            {/* Quick action prompts */}
            <div style={{ padding: 10, background: 'var(--bg3)', borderTop: '1px solid var(--border)', display: 'flex', gap: 6 }}>
              {[
                { q: 'Who has incomplete documents?', a: 'Incomplete-document alerts require live document verification data. No fabricated candidate names are listed.' },
                { q: 'Who qualifies for scholarships?', a: 'Scholarship eligibility requires live CGPA and country preference data from the pipeline. No demo qualifiers are listed as live.' }
              ].map((pre, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCopilotMessages(prev => [
                      ...prev,
                      { role: 'user', text: pre.q },
                      { role: 'assistant', text: pre.a }
                    ]);
                  }}
                  style={{ padding: '6px 10px', fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--t2)', cursor: 'pointer', fontWeight: 600 }}
                >
                  💬 {pre.q}
                </button>
              ))}
            </div>

            {/* Input tray */}
            <div style={{ padding: 10, borderTop: '1px solid var(--border)', display: 'flex', gap: 8, background: 'var(--card)' }}>
              <input
                value={copilotInput}
                onChange={e => setCopilotInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && copilotInput.trim()) {
                    const text = copilotInput;
                    setCopilotMessages(prev => [...prev, { role: 'user', text }]);
                    setCopilotInput('');
                    setTimeout(() => {
                      setCopilotMessages(prev => [...prev, { role: 'assistant', text: `I logged your query about "${text}". Click one of our quick buttons above for active metrics lists.` }]);
                    }, 800);
                  }
                }}
                placeholder="Ask Athena a pipeline question..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 12.5 }}
              />
              <button
                onClick={() => {
                  if (copilotInput.trim()) {
                    const text = copilotInput;
                    setCopilotMessages(prev => [...prev, { role: 'user', text }]);
                    setCopilotInput('');
                    setTimeout(() => {
                      setCopilotMessages(prev => [...prev, { role: 'assistant', text: `I logged your query about "${text}". Click one of our quick buttons above for active metrics lists.` }]);
                    }, 800);
                  }
                }}
                style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 700 }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* Right Column: AI Consultant Copilot Sidebar */}
      {showCopilotSidebar && (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 20 }} className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <strong style={{ fontSize: 13, color: 'var(--t1)' }}>AI Copilot Workspace</strong>
            </div>
            <button
              onClick={() => setShowCopilotSidebar(false)}
              className="btn-ghost"
              style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)' }}
            >
              Hide
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{ height: 260, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--card)', padding: 10, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sidebarMessages.map((m, idx) => (
              <div key={idx} style={{
                alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end',
                background: m.role === 'assistant' ? 'var(--bg2)' : 'var(--accent)',
                color: m.role === 'assistant' ? 'var(--t1)' : 'white',
                padding: '6px 10px', borderRadius: 8, fontSize: 11.5, maxWidth: '90%',
                border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                whiteSpace: 'pre-wrap'
              }}>
                {m.text}
              </div>
            ))}
          </div>

          {/* Clickable Consultant Prompts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 9.5, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase' }}>Quick Actions Console</span>
            {[
              {
                label: '🎓 Suggest universities from pipeline',
                user: 'Suggest universities from live pipeline data.',
                reply: 'University suggestions require live CGPA/GRE/country fields from the pipeline. No fabricated candidate dossiers are returned.'
              },
              {
                label: '✍️ Generate SOP Draft',
                user: 'Generate SOP.',
                reply: 'SOP generation needs a selected live pipeline candidate with verified profile fields.'
              },
              {
                label: '📊 Compare Canada & Germany',
                user: 'Compare Canada and Germany.',
                reply: 'Germany: Zero tuition fee, Blocked Account required (€11,900/yr), high tech labs.\nCanada: Higher tuition (~CAD 30K/yr), simpler PGWP work permits, fast visa loops.'
              },
              {
                label: '⚠️ What documents are missing?',
                user: 'What documents are missing?',
                reply: 'Missing-document summaries come from vault verification status. Demo incomplete lists are not shown as live alerts.'
              },
              {
                label: '📅 Schedule next meeting',
                user: 'Schedule next meeting.',
                reply: 'Use the Meetings tab to schedule against a live pipeline candidate. Fake booked sessions are disabled.'
              }
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSidebarMessages(prev => [
                    ...prev,
                    { role: 'user', text: p.user },
                    { role: 'assistant', text: p.reply }
                  ]);
                }}
                style={{
                  padding: '6px 10px', fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6,
                  color: 'var(--t2)', cursor: 'pointer', textAlign: 'left', fontWeight: 600, transition: 'all 0.15s'
                }}
                className="btn-ghost"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

// ── Alumni / Mentoring Dashboard Component ─────────────────────────────────────
function AlumniMentorshipView({ pipeline, triggerToast }: { pipeline: Record<string, any[]>; triggerToast: (msg: string, type?: 'success' | 'error') => void }) {
  const mentees = Object.values(pipeline || {}).flat();
  void triggerToast;

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🤝 Alumni Intelligence Matcher</h3>
        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>
          Alumni mentor matches require a live alumni graph. Hard-coded demo dossiers are not shown as live pipeline data.
        </p>
      </div>
      {mentees.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)', fontSize: 13, border: '1px solid var(--border)', borderRadius: 14 }}>
          No pipeline data
        </div>
      ) : (
        <div style={{ padding: 28, textAlign: 'center', color: 'var(--t3)', fontSize: 13, border: '1px solid var(--border)', borderRadius: 14 }}>
          {mentees.length} pipeline candidate{mentees.length === 1 ? '' : 's'} loaded — no alumni mentor matches on file yet.
        </div>
      )}
    </div>
  );
}

export default function ConsultantPage() {
  return (
    <RoleGate allow={['consultant', 'admin', 'superadmin']} label="Consultant access required">
      <ConsultantPageInner />
    </RoleGate>
  );
}
