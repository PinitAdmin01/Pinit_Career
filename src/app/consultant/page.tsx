'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';

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

export default function ConsultantPage() {
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
  const [matchingStudent, setMatchingStudent] = useState<string>('Rahul Sharma');
  const [scholarshipSubTab, setScholarshipSubTab] = useState<string>('government');
  const [selectedDocStudent, setSelectedDocStudent] = useState<string>('Rahul Sharma');
  const [selectedVisaStudent, setSelectedVisaStudent] = useState<string>('Rahul Sharma');
  const [studyAbroadSubTab, setStudyAbroadSubTab] = useState<string>('visa');
  const [countryCompA, setCountryCompA] = useState<string>('Germany');
  const [countryCompB, setCountryCompB] = useState<string>('Canada');
  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, Record<string, boolean>>>({
    'Rahul Sharma': { s1: true, s2: false, s3: false, s4: false },
    'Priya Patel': { s1: true, s2: true, s3: false, s4: false },
    'Amit Kumar': { s1: true, s2: false, s3: false, s4: false }
  });
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
          ats: first.ats_score || 72,
          coding: first.trust_score || 80,
          comm: 'Verified',
          placement: '82%',
          dna: first.career_track ? `🤖 ${first.career_track}` : '🤖 Software Engineer',
          research: '1 Paper Submitted',
          projects: `${(first.vaultItems || []).length || 2} Verified Portfolios`,
          ielts: '7.5 Band',
          gre: '320 (Q168, V152)',
          cgpa: '8.5 / 10',
          scholarship: '85% (Eligible)',
          probability: '82% (TU Munich)'
        });
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
          
          {/* AI alerts summary board */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(99, 102, 241, 0.02) 100%)',
            border: '1.5px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 14, padding: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>Athena AI Command Alerts Summary</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--t2)' }}>
                <div>💡 <strong>Scholarships:</strong> Rahul qualifies for DAAD Scholarship.</div>
                <div>📈 <strong>Admissions:</strong> Priya has an 87% chance of admission to TU Munich.</div>
                <div>⚠️ <strong>Incompletes:</strong> Three students have incomplete SOPs.</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--t2)' }}>
                <div>⏰ <strong>Visa:</strong> Visa deadline in 5 days.</div>
                <div>💼 <strong>Career:</strong> Two students are internship-ready.</div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {[
              { label: "Today's Meetings", value: '4 Sessions', desc: 'Starting from 10:00 AM', color: 'var(--accent)' },
              { label: 'Requiring Attention', value: '3 Candidates', desc: 'Incomplete SOPs / low streak', color: 'var(--danger)' },
              { label: 'Visa Deadline', value: '5 days', desc: 'Rahul, Amit visa locks', color: 'var(--coral)' },
              { label: 'Application Deadline', value: 'July 31', desc: 'TU Munich & Stanford gates', color: 'var(--amber)' },
              { label: 'High Placement Candidates', value: '8 Students', desc: 'ATS resume > 80, coding active', color: 'var(--success)' },
              { label: 'High Scholarship Candidates', value: '5 Students', desc: 'DAAD, Erasmus eligible', color: 'var(--teal)' }
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

          {/* Details layout row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
            {/* Left: Today's Meetings */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: 'var(--bg3)', padding: '10px 14px', fontSize: 12, fontWeight: 800, color: 'var(--t3)', borderBottom: '1px solid var(--border)' }}>TODAY'S CONSULTATIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--card)' }}>
                {[
                  { title: 'Visa Mock Interview', student: 'Rahul Sharma', time: '10:00 AM', link: 'https://zoom.us/j/9082' },
                  { title: 'SOP Document Review', student: 'Priya Patel', time: '11:30 AM', link: 'https://zoom.us/j/4192' },
                  { title: 'University Choice Matching', student: 'Amit Kumar', time: '02:00 PM', link: 'https://zoom.us/j/7391' },
                  { title: 'Pre-Departure Briefing', student: 'Nisha Sen', time: '04:30 PM', link: 'https://zoom.us/j/1094' }
                ].map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderBottom: idx < 3 ? '1px solid var(--border)' : 'none', fontSize: 12.5 }}>
                    <div>
                      <strong style={{ color: 'var(--t1)' }}>{s.title}</strong>
                      <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Student: {s.student}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 700 }}>{s.time}</span>
                      <div style={{ marginTop: 2 }}><a href={s.link} target="_blank" rel="noreferrer" style={{ color: 'var(--success)', fontSize: 11, textDecoration: 'underline' }}>Join Room</a></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Urgent Action items */}
            <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: 'var(--bg3)', padding: '10px 14px', fontSize: 12, fontWeight: 800, color: 'var(--t3)', borderBottom: '1px solid var(--border)' }}>IMMEDIATE ACTION ITEMS</div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: 14, background: 'var(--card)', gap: 10 }}>
                <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: 10, fontSize: 12 }}>
                  🔴 <strong>Rahul Sharma</strong>: Visa deadline in 5 days. Documents verify log incomplete.
                </div>
                <div style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, padding: 10, fontSize: 12 }}>
                  🟡 <strong>Priya Patel</strong>: Statement of Purpose (SOP) draft has spelling/formatting flags.
                </div>
                <div style={{ background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10, padding: 10, fontSize: 12 }}>
                  🔵 <strong>Amit Kumar</strong>: Completed 4 coding quests. Eligible to connect with Microsoft recruiters.
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB: PIPELINE (KANBAN) ───────────────────────────────────────── */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedStudent ? '1fr 380px' : '1fr', gap: 16 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--t3)' }}>Refreshing student pipeline...</div>
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
                                    setActiveTab('sessions');
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
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11.5, alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)' }}>
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
                {[
                  {
                    name: 'Rahul Sharma',
                    ats: 68,
                    coding: 91,
                    comm: 'Needs Lab Revision',
                    placement: '74%',
                    dna: '🤖 AI Software Engineer',
                    research: '1 Paper (ACL Prep)',
                    projects: '4 Hosted Portfolios',
                    ielts: '7.5 Band',
                    gre: '320 (Q168, V152)',
                    cgpa: '8.4 / 10',
                    scholarship: '85% (DAAD Eligible)',
                    probability: '75% (TU Munich)'
                  },
                  {
                    name: 'Priya Patel',
                    ats: 84,
                    coding: 80,
                    comm: 'Excellent verbal',
                    placement: '87%',
                    dna: '☁️ Cloud Solutions Architect',
                    research: '2 Papers (IEEE, CVPR)',
                    projects: '6 Production Apps',
                    ielts: '8.0 Band',
                    gre: '328 (Q170, V158)',
                    cgpa: '9.2 / 10',
                    scholarship: '95% (Erasmus Eligible)',
                    probability: '91% (TU Munich)'
                  },
                  {
                    name: 'Amit Kumar',
                    ats: 72,
                    coding: 85,
                    comm: 'Average dialogs',
                    placement: '78%',
                    dna: '📊 Distributed Systems Dev',
                    research: 'No publications',
                    projects: '3 GitHub Portals',
                    ielts: '7.0 Band',
                    gre: '315 (Q164, V151)',
                    cgpa: '7.8 / 10',
                    scholarship: '65% (Partial Cover)',
                    probability: '68% (NUS Singapore)'
                  }
                ].map((stud, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedIntelStudent(stud)}
                    style={{
                      padding: 14,
                      borderBottom: idx < 2 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer',
                      background: selectedIntelStudent.name === stud.name ? 'rgba(99,102,241,0.06)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: selectedIntelStudent.name === stud.name ? 'var(--accent)' : 'var(--t1)', fontSize: 13.5 }}>{stud.name}</strong>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)' }}>{stud.placement} Ready</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
                      ATS: {stud.ats}/100 | Coding: {stud.coding}%
                    </div>
                  </div>
                ))}
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
              {[
                { name: 'Rahul Sharma', goal: 'AI Engineer', progress: '91% Skills Match' },
                { name: 'Priya Patel', goal: 'Cloud Architect', progress: '85% Skills Match' },
                { name: 'Amit Kumar', goal: 'Distributed Systems Dev', progress: '78% Skills Match' }
              ].map((mapItem, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderBottom: idx < 2 ? '1px solid var(--border)' : 'none', fontSize: 12.5 }}>
                  <div>
                    <strong style={{ color: 'var(--t1)' }}>{mapItem.name}</strong>
                    <span style={{ fontSize: 11, color: 'var(--t3)', marginLeft: 8 }}>Targeting: {mapItem.goal}</span>
                  </div>
                  <span style={{ color: 'var(--success)', fontWeight: 800 }}>{mapItem.progress}</span>
                </div>
              ))}
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
              {[
                { name: 'Rahul Sharma', country: 'Germany', program: 'MS in Computer Science', visa: 'Submitted' },
                { name: 'Priya Patel', country: 'Germany', program: 'MS in Data Science', visa: 'Approved' },
                { name: 'Amit Kumar', country: 'Singapore', program: 'M.Tech in AI', visa: 'Pending' }
              ].map((c, idx) => {
                const isSelected = selectedVisaStudent === c.name;
                return (
                  <div
                    key={idx}
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
                      background: c.visa === 'Approved' ? 'rgba(16,185,129,0.08)' : c.visa === 'Submitted' ? 'rgba(99,102,241,0.08)' : 'rgba(245,158,11,0.08)',
                      color: c.visa === 'Approved' ? 'var(--success)' : c.visa === 'Submitted' ? 'var(--accent)' : 'var(--amber)',
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

            {studyAbroadSubTab === 'visa' && (() => {
              const visaData: Record<string, {
                status: string;
                missing: string;
                probability: string;
                verified: string[];
                questions: string[];
              }> = {
                'Rahul Sharma': {
                  status: 'Visa Submitted / Under Review',
                  missing: 'German Blocked Account Bank Statement (Required for final verification stamp)',
                  probability: '93%',
                  verified: ['Valid International Passport', 'TU Munich Admit Letter', 'SOP Draft V2', 'IELTS 7.5 Band Certificate'],
                  questions: [
                    'Why did you choose TU Munich over local research universities in India?',
                    'How will you finance your living expenses of €12,180 per year in Munich?',
                    'What are your career plans after completing your MS in Computer Science?'
                  ]
                },
                'Priya Patel': {
                  status: 'Visa Approved & Stamped',
                  missing: 'None - All Documents Completed',
                  probability: '99%',
                  verified: ['Valid Passport', 'TU Munich MS Data Science Admit', 'German Blocked Account Confirmed', 'SOP V4 Locked', 'IELTS 8.0 Band Card'],
                  questions: [
                    'Can you explain the structure of the MS Data Science course at TUM?',
                    'Who is sponsoring your education in Germany?',
                    'Do you plan to return to India after completing the course?'
                  ]
                },
                'Amit Kumar': {
                  status: 'Pending Document Checklist',
                  missing: 'Financial Affidavit of Support & Bank Balance Certificate',
                  probability: '82%',
                  verified: ['Valid Passport', 'NUS Singapore Admit Offer', 'Academic Transcripts Verified'],
                  questions: [
                    'Why Singapore for your M.Tech in Artificial Intelligence?',
                    'Explain your funding source for the NUS tuition fee.',
                    'Where will you reside during your stay in Singapore?'
                  ]
                }
              };

              const selectedData = visaData[selectedVisaStudent] || visaData['Rahul Sharma'];

              return (
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
                  
                  {/* Title Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--accent)' }}>🌍 AI Visa Advisor: {selectedVisaStudent}</h4>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>Real-time compliance checks & interview training simulator.</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Approval Odds</div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--success)' }}>{selectedData.probability}</div>
                    </div>
                  </div>

                  {/* Sub layout */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    
                    {/* Left sub-column: Status & Missing/Verified */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase' }}>Current Embassy Status</span>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                          ⚡ {selectedData.status}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase' }}>⚠️ Missing / Pending Files</span>
                        <div style={{
                          marginTop: 4, padding: '8px 12px', borderRadius: 8, fontSize: 12,
                          background: selectedData.missing === 'None - All Documents Completed' ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                          border: selectedData.missing === 'None - All Documents Completed' ? '1px solid rgba(16,185,129,0.15)' : '1px solid rgba(239,68,68,0.15)',
                          color: selectedData.missing === 'None - All Documents Completed' ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {selectedData.missing}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>✓ Verified Documents</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {selectedData.verified.map((v, i) => (
                            <div key={i} style={{ fontSize: 12, color: 'var(--t2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ color: 'var(--success)' }}>✓</span> {v}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right sub-column: Generated Interview Questions */}
                    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase' }}>Mock Interview Simulator</span>
                        <span style={{ fontSize: 9.5, background: 'rgba(99,102,241,0.08)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>Generated</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {selectedData.questions.map((q, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)' }}>Practice Question {i + 1}</span>
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--t1)', lineHeight: 1.4 }}>"{q}"</p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          toastObj.success('Practice Session Booked', 'Mock Visa Interview slot booked for the student with advisor.');
                        }}
                        className="btn-primary btn-sm"
                        style={{ justifyContent: 'center', padding: '6px 0', fontSize: 11 }}
                      >
                        🗣️ Book Mock Practice Interview
                      </button>
                    </div>

                  </div>

                </div>
              );
            })()}

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
              <option value="Rahul Sharma">Rahul Sharma</option>
              <option value="Priya Patel">Priya Patel</option>
              <option value="Amit Kumar">Amit Kumar</option>
            </select>
          </div>

          {/* Matching Criteria Block */}
          {(() => {
            const criteria: Record<string, any> = {
              'Rahul Sharma': {
                dna: '🤖 AI Software Engineer',
                cgpa: '8.4 / 10',
                ielts: '7.5',
                gre: '320',
                budget: '€12,000 / yr',
                country: 'Germany, Canada',
                dream: { name: 'ETH Zurich (Switzerland)', rate: '25% Probability', reason: 'Strong AI Labs, Premium Placements' },
                reach: { name: 'TU Munich (Germany)', rate: '75% Probability', reason: 'Low Tuition, Excellent Industry Ties' },
                safe: { name: 'University of Twente (Netherlands)', rate: '88% Probability', reason: 'Favorable Visa, Good Placement' }
              },
              'Priya Patel': {
                dna: '☁️ Cloud Solutions Architect',
                cgpa: '9.2 / 10',
                ielts: '8.0',
                gre: '328',
                budget: '€20,000 / yr',
                country: 'Germany, USA',
                dream: { name: 'Stanford University (USA)', rate: '30% Probability', reason: 'Top-tier Cloud Labs, Silicon Valley placements' },
                reach: { name: 'TU Munich (Germany)', rate: '91% Probability', reason: 'Low Tuition, Top European Tech Partner' },
                safe: { name: 'RWTH Aachen (Germany)', rate: '95% Probability', reason: 'No Tuition, Favorable Visa' }
              },
              'Amit Kumar': {
                dna: '📊 Distributed Systems Dev',
                cgpa: '7.8 / 10',
                ielts: '7.0',
                gre: '315',
                budget: '€15,000 / yr',
                country: 'Singapore, Netherlands',
                dream: { name: 'NUS Singapore', rate: '20% Probability', reason: 'Top Asian Tech Hub, Premium Research' },
                reach: { name: 'TU Delft (Netherlands)', rate: '68% Probability', reason: 'Good Visa, High Placement' },
                safe: { name: 'University of Twente (Netherlands)', rate: '92% Probability', reason: 'Favorable Visa, Low Cost' }
              }
            };
            const current = criteria[matchingStudent] || criteria['Rahul Sharma'];

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* Inputs Summary panel */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                  <div>
                    <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Career DNA Goal</span>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--accent)', marginTop: 2 }}>{current.dna}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Scores Index</span>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)', marginTop: 2 }}>CGPA: {current.cgpa} | GRE: {current.gre}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>IELTS Band</span>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t1)', marginTop: 2 }}>{current.ielts} Band</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Budget Limit</span>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--success)', marginTop: 2 }}>{current.budget}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase' }}>Country Pref</span>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--teal)', marginTop: 2 }}>{current.country}</div>
                  </div>
                </div>

                {/* Dream, Reach, Safe classification blocks */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  
                  {/* DREAM card */}
                  <div style={{
                    background: 'rgba(99, 102, 241, 0.03)', border: '1.5px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 900, background: 'var(--accent)', color: 'white', padding: '3px 8px', borderRadius: 4 }}>DREAM</span>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--accent)' }}>{current.dream.rate}</span>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>{current.dream.name}</h4>
                      <p style={{ margin: '6px 0 0 0', fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>{current.dream.reason}</p>
                    </div>
                  </div>

                  {/* REACH card */}
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.03)', border: '1.5px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 900, background: 'var(--amber)', color: 'white', padding: '3px 8px', borderRadius: 4 }}>REACH</span>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--amber)' }}>{current.reach.rate}</span>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>{current.reach.name}</h4>
                      <p style={{ margin: '6px 0 0 0', fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>{current.reach.reason}</p>
                    </div>
                  </div>

                  {/* SAFE card */}
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.03)', border: '1.5px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 900, background: 'var(--success)', color: 'white', padding: '3px 8px', borderRadius: 4 }}>SAFE</span>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--success)' }}>{current.safe.rate}</span>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>{current.safe.name}</h4>
                      <p style={{ margin: '6px 0 0 0', fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>{current.safe.reason}</p>
                    </div>
                  </div>

                </div>

                {/* AI Admission Probability Tracker */}
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>📊 AI Admission Probability Tracker</h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--t3)' }}>Automated probability modeling across target applied universities with comprehensive analytical reasons.</p>
                  </div>

                  {(() => {
                    const probData: Record<string, Array<{ name: string; rate: number; reasons: string[] }>> = {
                      'Rahul Sharma': [
                        { name: 'TU Munich (Germany)', rate: 82, reasons: ['CGPA (8.4) exceeds standard mechanical engineering entry thresholds.', '4 hosted web projects demonstrates solid practical software construction credentials.', 'GRE quantitative score section of 168 aligns with advanced data course standards.'] },
                        { name: 'ETH Zurich (Switzerland)', rate: 34, reasons: ['Highly competitive baseline pool among international cohorts.', 'Needs additional research publications (currently 1 preparative NLP paper).', 'Target average IELTS expectation is slightly higher (8.0 preferred vs 7.5 current).'] },
                        { name: 'University of Alberta (Canada)', rate: 91, reasons: ['Exceeds standard entries requirements significantly.', 'Budget aligns perfectly with cost of living limits.', 'Academic reference letters locked in Document vault.'] }
                      ],
                      'Priya Patel': [
                        { name: 'TU Munich (Germany)', rate: 91, reasons: ['Top roster CGPA (9.2) fits TUM premium criteria perfectly.', 'Strong Quantitative score index (170 quant).', 'SOP locked with verified research adapter achievements.'] },
                        { name: 'Stanford University (USA)', rate: 30, reasons: ['Ultra-competitive admit pool.', 'Silicon Valley placements target aligns but requires publication index expansion.'] },
                        { name: 'RWTH Aachen (Germany)', rate: 95, reasons: ['Zero tuition budget fits perfect.', 'CGPA (9.2) is far above standard entries.'] }
                      ],
                      'Amit Kumar': [
                        { name: 'NUS Singapore', rate: 20, reasons: ['NUS competitive pool limits.', 'Needs higher Quantitative score (currently 315 total).'] },
                        { name: 'TU Delft (Netherlands)', rate: 68, reasons: ['Strong distributed system project portfolio.', 'Good visa path matching candidate profile.'] },
                        { name: 'University of Twente (Netherlands)', rate: 92, reasons: ['Fits safe admissions bracket.', 'Tuition cost aligns with budget.'] }
                      ]
                    };

                    const list = probData[matchingStudent] || probData['Rahul Sharma'];

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                        {list.map((u, i) => (
                          <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: 13, color: 'var(--t1)' }}>{u.name}</strong>
                              <span style={{
                                fontSize: 12, fontWeight: 900,
                                color: u.rate >= 80 ? 'var(--success)' : u.rate >= 50 ? 'var(--amber)' : 'var(--danger)',
                                background: u.rate >= 80 ? 'rgba(16,185,129,0.08)' : u.rate >= 50 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
                                padding: '3px 8px', borderRadius: 4
                              }}>
                                {u.rate}%
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <span style={{ fontSize: 9.5, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase' }}>Strategic Analysis</span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {u.reasons.map((r, idx) => (
                                  <div key={idx} style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.4 }}>
                                    • {r}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                </div>

              </div>
            );
          })()}
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
              <option value="Rahul Sharma">Rahul Sharma (CGPA: 8.4)</option>
              <option value="Priya Patel">Priya Patel (CGPA: 9.2)</option>
              <option value="Amit Kumar">Amit Kumar (CGPA: 7.8)</option>
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
            const cgpaVal = matchingStudent === 'Priya Patel' ? 9.2 : matchingStudent === 'Rahul Sharma' ? 8.4 : 7.8;

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
              <option value="Rahul Sharma">Rahul Sharma</option>
              <option value="Priya Patel">Priya Patel</option>
              <option value="Amit Kumar">Amit Kumar</option>
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
              <option value="Rahul Sharma">Rahul Sharma</option>
              <option value="Priya Patel">Priya Patel</option>
              <option value="Amit Kumar">Amit Kumar</option>
            </select>
          </div>

          {/* Timeline Cards Container */}
          {(() => {
            const placementStages: Record<string, Array<{ stage: string; state: string; date: string; title: string; desc: string }>> = {
              'Rahul Sharma': [
                { stage: 'Admission Offer', state: 'completed', date: 'Oct 2026', title: 'MS in Computer Science at TU Munich', desc: 'Official offer received. Visa approved.' },
                { stage: 'ML Research Internship', state: 'completed', date: 'May 2027', title: 'Internship at Siemens AI Lab', desc: 'Completed 6-month capstone internship on time.' },
                { stage: 'Resume ATS Audit', state: 'completed', date: 'Nov 2027', title: '92% ATS Grade Optimization', desc: 'Keywords aligned with Google SDE/ML profiles.' },
                { stage: 'Technical Interviews', state: 'current', date: 'Jan 2028', title: 'Mock Prep & Coding Quests', desc: 'Currently solving practice modules. 4 quests cleared.' },
                { stage: 'Full-time Placement', state: 'pending', date: 'Jul 2028', title: 'Target: Google Munich / SDE-I', desc: 'Admissions placement pipelines active.' },
                { stage: 'Career Timeline mapping', state: 'pending', date: 'Ongoing', title: '1:1 Global Mentorship tracking', desc: 'Karthik Rajan mapped as active supervisor.' }
              ],
              'Priya Patel': [
                { stage: 'Admission Offer', state: 'completed', date: 'Oct 2026', title: 'MS in Data Science at TU Munich', desc: 'Enrolled. German block account validated.' },
                { stage: 'Cloud Solutions Internship', state: 'completed', date: 'Apr 2027', title: 'Internship at BMW Cloud Group', desc: 'Designed Kubernetes cluster configs.' },
                { stage: 'Resume ATS Audit', state: 'completed', date: 'Oct 2027', title: '95% ATS Grade Optimization', desc: 'Targeting Amazon & Microsoft solutions architect.' },
                { stage: 'Technical Interviews', state: 'completed', date: 'Dec 2027', title: 'Full Mock Interview Rounds Passed', desc: 'Cleared 3 mock loops with alumni panels.' },
                { stage: 'Full-time Placement', state: 'current', date: 'Feb 2028', title: 'Target: Amazon Germany / Solutions Architect', desc: 'Final round loops scheduled.' },
                { stage: 'Career Timeline mapping', state: 'pending', date: 'Ongoing', title: '1:1 Global Mentorship tracking', desc: 'Divya Suresh mapped as active supervisor.' }
              ],
              'Amit Kumar': [
                { stage: 'Admission Offer', state: 'completed', date: 'Aug 2026', title: 'M.Tech in AI at NUS Singapore', desc: 'Enrolled under Singapore research fellowship.' },
                { stage: 'Software Dev Internship', state: 'completed', date: 'Jan 2027', title: 'Internship at Grab Tech Center', desc: 'Contributed to distributed booking APIs.' },
                { stage: 'Resume ATS Audit', state: 'current', date: 'Mar 2028', title: 'ATS Grade Optimization', desc: 'Aiming for 85%+ score on target registry.' },
                { stage: 'Technical Interviews', state: 'pending', date: 'May 2028', title: 'Coding Quests Prep', desc: 'Preparing distributed database quests.' },
                { stage: 'Full-time Placement', state: 'pending', date: 'Aug 2028', title: 'Target: NUS Research / System Engineer', desc: 'Internship placement pipelines active.' },
                { stage: 'Career Timeline mapping', state: 'pending', date: 'Ongoing', title: '1:1 Global Mentorship tracking', desc: 'Arun Murugan mapped as active supervisor.' }
              ]
            };

            const stages = placementStages[matchingStudent] || placementStages['Rahul Sharma'];

            return (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Admissions-to-Placement Lifecycle Tracker</span>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, position: 'relative' }}>
                  {stages.map((st, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 12, padding: 14,
                        display: 'flex', flexDirection: 'column', gap: 6, opacity: st.state === 'pending' ? 0.5 : 1,
                        borderTop: st.state === 'completed' ? '4px solid var(--success)' : st.state === 'current' ? '4px solid var(--accent)' : '1.5px solid var(--border)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Stage {i + 1}</span>
                        <span style={{ fontSize: 8.5, color: st.state === 'completed' ? 'var(--success)' : st.state === 'current' ? 'var(--accent)' : 'var(--t3)', fontWeight: 900 }}>
                          {st.state === 'completed' ? '✓ DONE' : st.state === 'current' ? '⚡ ACTIVE' : 'PENDING'}
                        </span>
                      </div>
                      
                      <strong style={{ fontSize: 11.5, color: 'var(--t1)', minHeight: 34 }}>{st.stage}</strong>
                      
                      <span style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700 }}>{st.date}</span>
                      <strong style={{ fontSize: 11, color: 'var(--accent)', minHeight: 30 }}>{st.title}</strong>
                      <p style={{ margin: 0, fontSize: 10.5, color: 'var(--t2)', lineHeight: 1.45 }}>{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Semester-by-Semester Academic Career Roadmap */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>🎓 Post-Admission Academic & Career Roadmap</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: 11, color: 'var(--t3)' }}>Follow and update candidate progress semester-by-semester inside their target master program.</p>
            </div>

            {(() => {
              const studentRoadmaps: Record<string, Array<{ sem: string; goal: string; details: string; key: string }>> = {
                'Rahul Sharma': [
                  { sem: 'Semester 1', goal: '🗣️ Learn German Language & Cultural Adapter', details: 'Targeting A2/B1 proficiency levels. Crucial for Munich SDE internships.', key: 's1' },
                  { sem: 'Semester 2', goal: '🔬 AI Research Publication Preparation', details: 'Coordinating with TUM Machine Learning Group. Aiming for adapter framework draft.', key: 's2' },
                  { sem: 'Semester 3', goal: '🏢 Industry AI Research Internship', details: 'Securing 6-month capstone placement at Siemens / BMW AI labs.', key: 's3' },
                  { sem: 'Semester 4', goal: '💼 Full-time placement loops', details: 'Filing SDE-I engineering applications to Google Germany and Amazon.', key: 's4' }
                ],
                'Priya Patel': [
                  { sem: 'Semester 1', goal: '🗣️ Learn German Language & Cultural Adapter', details: 'Targeting A1/A2 conversation levels.', key: 's1' },
                  { sem: 'Semester 2', goal: '🔬 Cloud Infrastructure Research', details: 'Coordinating Kubernetes cluster validation benchmarks.', key: 's2' },
                  { sem: 'Semester 3', goal: '🏢 Cloud Solutions Internship', details: 'Securing 6-month cloud architecture placement at BMW.', key: 's3' },
                  { sem: 'Semester 4', goal: '💼 Solutions Architect placement loops', details: 'Amazon Germany and Microsoft solutions architect pathways.', key: 's4' }
                ],
                'Amit Kumar': [
                  { sem: 'Semester 1', goal: '🇸🇬 Learn English & Technical Writing Adaptation', details: 'Completing technical communication credentials at NUS.', key: 's1' },
                  { sem: 'Semester 2', goal: '🔬 Distributed Database Research', details: 'Coordinating systems optimization in NUS research group.', key: 's2' },
                  { sem: 'Semester 3', goal: '🏢 Software Dev Internship', details: 'Grab Singapore backend developer internship.', key: 's3' },
                  { sem: 'Semester 4', goal: '💼 System Engineer placement loops', details: 'NUS Research Fellow / Systems Engineer positions.', key: 's4' }
                ]
              };

              const currentRoadmap = studentRoadmaps[matchingStudent] || studentRoadmaps['Rahul Sharma'];
              const currentProgress = roadmapProgress[matchingStudent] || { s1: false, s2: false, s3: false, s4: false };

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                  {currentRoadmap.map((item, idx) => {
                    const isDone = currentProgress[item.key];
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setRoadmapProgress(prev => {
                            const studentProg = prev[matchingStudent] || { s1: false, s2: false, s3: false, s4: false };
                            return {
                              ...prev,
                              [matchingStudent]: {
                                ...studentProg,
                                [item.key]: !studentProg[item.key]
                              }
                            };
                          });
                          triggerToast(`${item.sem} roadmap status updated!`);
                        }}
                        style={{
                          background: isDone ? 'rgba(16,185,129,0.02)' : 'var(--card)',
                          border: isDone ? '1.5px solid var(--success)' : '1px solid var(--border)',
                          borderRadius: 12, padding: 16, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8,
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: isDone ? 'var(--success)' : 'var(--t3)', textTransform: 'uppercase' }}>{item.sem}</span>
                          <input
                            type="checkbox"
                            checked={isDone}
                            readOnly
                            style={{ cursor: 'pointer', accentColor: 'var(--success)' }}
                          />
                        </div>
                        <strong style={{ fontSize: 12, color: 'var(--t1)' }}>{item.goal}</strong>
                        <p style={{ margin: 0, fontSize: 11, color: 'var(--t2)', lineHeight: 1.45 }}>{item.details}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
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
              <option value="Rahul Sharma">Rahul Sharma</option>
              <option value="Priya Patel">Priya Patel</option>
              <option value="Amit Kumar">Amit Kumar</option>
            </select>
          </div>

          {/* Matches List Grid */}
          {(() => {
            const matchesDb: Record<string, Array<{ name: string; type: string; desc: string }>> = {
              'Rahul Sharma': [
                { name: 'Google Summer of Code', type: 'International Internship / Open Source', desc: 'Highly aligned with Rahul\'s 4 coding quest accomplishments and system projects.' },
                { name: 'DAAD Research Internship', type: 'Research Assistant Position', desc: 'Aligned with target location Germany & CGPA 8.4 mechanical baseline matches.' },
                { name: 'Erasmus Exchange', type: 'Exchange Program', desc: 'Matches TU Munich MS CS academic tracks and global collaboration modules.' },
                { name: 'Microsoft Imagine Cup', type: 'Competition / Hackathon', desc: 'Matches AI/ML software engineering goal and decentralized systems portfolio.' },
                { name: 'ETH AI Summer School', type: 'Summer School / Fellowship', desc: 'Fits target research area in neural networks and transformer adaptation.' }
              ],
              'Priya Patel': [
                { name: 'AWS Cloud Graduate Trainee Program', type: 'Graduate Trainee Program', desc: 'Fits Priya\'s 95% Cloud Solutions architect readiness telemetry index.' },
                { name: 'TUM Merit Fellowship', type: 'Scholarship / Fellowship', desc: 'Highly aligned with Priya\'s top cohort CGPA (9.2/10).' },
                { name: 'BMW Autonomous Cloud Hackathon', type: 'Competition / Hackathon', desc: 'Matches Kubernetes target profiles and system construction streaks.' },
                { name: 'Erasmus exchange fellowship', type: 'Exchange Program', desc: 'Aligned with German block account and TUM admit metrics.' }
              ],
              'Amit Kumar': [
                { name: 'Grab Tech Trainee (Singapore)', type: 'Graduate Trainee Program', desc: 'Matches Amit\'s software dev internship experience in Grab Tech Center.' },
                { name: 'NUS Research Assistant Fellow', type: 'Research Assistant Position', desc: 'Fits Amit\'s Singapore student visa status and distributed systems focus.' },
                { name: 'Singapore CyberSecurity Hackathon', type: 'Competition / Hackathon', desc: 'Matches system engineering coding quests streaks.' }
              ]
            };

            const list = matchesDb[matchingStudent] || matchesDb['Rahul Sharma'];

            return (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                    Active Radar Matches for {matchingStudent}
                  </span>
                  <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.08)', color: 'var(--success)', padding: '2px 8px', borderRadius: 4, fontWeight: 800 }}>
                    {list.length} Matches Found
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {list.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.1s'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓</span>
                          <strong style={{ fontSize: 13, color: 'var(--t1)' }}>{m.name}</strong>
                          <span style={{ fontSize: 9.5, background: 'rgba(99,102,241,0.08)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                            {m.type}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: 11.5, color: 'var(--t2)', paddingLeft: 16 }}>{m.desc}</p>
                      </div>

                      <button
                        onClick={() => {
                          toastObj.success('Opportunity Shared', `Sent matching notification alert for "${m.name}" to candidate's mobile portal.`);
                        }}
                        className="btn-primary btn-sm"
                        style={{ padding: '6px 12px', fontSize: 11, borderRadius: 6 }}
                      >
                        ⚡ Share Alert
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      toastObj.success('All Shared', `All ${list.length} mapped opportunity channels shared with ${matchingStudent}.`);
                    }}
                    className="btn-primary"
                    style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 12.5, fontWeight: 700 }}
                  >
                    🚀 Share All Matched Radars
                  </button>
                </div>
              </div>
            );
          })()}
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
                { q: 'Who has incomplete documents?', a: 'Rahul Sharma (SOP is incomplete) and Amit Kumar (Financial affidavit pending).' },
                { q: 'Who qualifies for scholarships?', a: 'Rahul Sharma and Priya Patel qualify for the DAAD scholarship (Germany).' }
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
                label: '🎓 Suggest universities for Rahul',
                user: 'Suggest universities for Rahul.',
                reply: 'Based on CGPA 8.4 and GRE 320, here are Rahul\'s matches:\n1) ETH Zurich - Dream (25% odds)\n2) TU Munich - Reach (75% odds)\n3) University of Twente - Safe (88% odds).'
              },
              {
                label: '✍️ Generate SOP Draft',
                user: 'Generate SOP.',
                reply: 'AI has successfully generated a customized draft Statement of Purpose for Rahul Sharma in the documents builder vault.'
              },
              {
                label: '📊 Compare Canada & Germany',
                user: 'Compare Canada and Germany.',
                reply: 'Germany: Zero tuition fee, Blocked Account required (€11,900/yr), high tech labs.\nCanada: Higher tuition (~CAD 30K/yr), simpler PGWP work permits, fast visa loops.'
              },
              {
                label: '⚠️ What documents are missing?',
                user: 'What documents are missing?',
                reply: 'Rahul is missing the Blocked Account bank statement. Amit is missing the Financial Affidavit. Priya has 100% verified files.'
              },
              {
                label: '📅 Schedule next meeting',
                user: 'Schedule next meeting.',
                reply: 'Athena AI has successfully booked your next 1:1 consultation session with Rahul Sharma for tomorrow at 2:00 PM.'
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
  const [selectedMentee, setSelectedMentee] = useState<string>('Rahul Sharma');
  const [booking, setBooking] = useState<boolean>(false);

  // Mapped telemetry database for matches
  const matchData: Record<string, {
    country: string;
    role: string;
    company: string;
    mentorName: string;
    mentorBatch: string;
    status: 'Available' | 'Fully Booked' | 'On Leave';
  }> = {
    'Rahul Sharma': {
      country: 'Germany',
      role: 'AI Engineer',
      company: 'Google',
      mentorName: 'Karthik Rajan',
      mentorBatch: 'Batch of 2022',
      status: 'Available'
    },
    'Priya Patel': {
      country: 'Germany',
      role: 'Cloud Solutions Architect',
      company: 'Amazon',
      mentorName: 'Divya Suresh',
      mentorBatch: 'Batch of 2021',
      status: 'Available'
    },
    'Amit Kumar': {
      country: 'Singapore',
      role: 'Distributed Systems Dev',
      company: 'NUS Research Labs',
      mentorName: 'Arun Murugan',
      mentorBatch: 'Batch of 2020',
      status: 'Available'
    }
  };

  const currentMatch = matchData[selectedMentee] || matchData['Rahul Sharma'];

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Selector card */}
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🤝 Alumni Intelligence Matcher</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Auto-identify global alumni mentors currently positioned inside target candidate placements.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t2)' }}>Select Student Profile:</span>
          <select
            value={selectedMentee}
            onChange={e => setSelectedMentee(e.target.value)}
            className="form-input"
            style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, width: 200 }}
          >
            <option value="Rahul Sharma">Rahul Sharma</option>
            <option value="Priya Patel">Priya Patel</option>
            <option value="Amit Kumar">Amit Kumar</option>
          </select>
        </div>
      </div>

      {/* Alumni Flow Diagram Node Container */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        
        <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 20 }}>AI Recommended Mentorship Pipeline</span>
        
        {/* Flow Columns Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%', maxWidth: 460 }}>
          
          {/* Node 1: Target Country */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 20px', width: '100%', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 800 }}>Target Country Location</span>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent)', marginTop: 4 }}>🌍 {currentMatch.country}</div>
          </div>

          {/* Arrow */}
          <div style={{ fontSize: 18, color: 'var(--t3)', fontWeight: 900 }}>↓</div>

          {/* Node 2: Target Career */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 20px', width: '100%', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 800 }}>Target Career/Role Title</span>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', marginTop: 4 }}>🤖 {currentMatch.role}</div>
          </div>

          {/* Arrow */}
          <div style={{ fontSize: 18, color: 'var(--t3)', fontWeight: 900 }}>↓</div>

          {/* Node 3: Target Placement Company */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 20px', width: '100%', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <span style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 800 }}>Placement Target Corporation</span>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>🏢 {currentMatch.company}</div>
          </div>

          {/* Arrow */}
          <div style={{ fontSize: 18, color: 'var(--t3)', fontWeight: 900 }}>↓</div>

          {/* Node 4: Active Alumni Rec / Status */}
          <div style={{ background: 'rgba(99,102,241,0.03)', border: '1.5px solid var(--accent)', borderRadius: 14, padding: 18, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.08)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}></span>
                <span style={{ fontSize: 9.5, color: 'var(--success)', fontWeight: 900, textTransform: 'uppercase' }}>{currentMatch.status}</span>
              </div>
              <strong style={{ fontSize: 14.5, color: 'var(--t1)', display: 'block', marginTop: 4 }}>{currentMatch.mentorName}</strong>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>TUM Alumni · {currentMatch.mentorBatch}</span>
            </div>
            
            <button
              disabled={booking}
              onClick={() => {
                setBooking(true);
                setTimeout(() => {
                  setBooking(false);
                  triggerToast(`Consultation slot with ${currentMatch.mentorName} booked successfully!`, 'success');
                }, 1000);
              }}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: 12, fontWeight: 800 }}
            >
              {booking ? 'Scheduling...' : 'Book 1:1 Session'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
