'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';

interface AdvisorInputs {
  attendance: number;
  internalMarks: number;
  previousSemesterCgpa: number;
  codingQuestsCompleted: number;
  aiInterviewScore: number;
  lmsProgress: number;
  studyTime: number;
}

interface SubjectItem {
  name: string;
  attendance: number;
  internals: number;
  minInternals: number;
  risk: string;
}

interface RecommendationItem {
  id: string;
  text: string;
  completed: boolean;
  impact: number;
}

interface AdvisorStats {
  currentCgpa: number;
  predictedCgpa: number;
  backlogRisk: number;
  attendanceRisk: string;
  weakestSubject: string;
  learningSpeed: string;
  placementReadiness: string;
  burnoutRisk: string;
  recommendedStudyHours: number;
  inputs: AdvisorInputs;
  subjects: SubjectItem[];
  recommendations: RecommendationItem[];
}

export default function AdvisorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdvisorStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Portal view switcher: 'student' | 'faculty' | 'parent' | 'admin'
  const [activeRole, setActiveRole] = useState<'student' | 'faculty' | 'parent' | 'admin'>('student');

  // Interactive Predictor Inputs (Student Sandbox)
  const [simAttendance, setSimAttendance] = useState(68);
  const [simQuests, setSimQuests] = useState(4);
  const [simStudyTime, setSimStudyTime] = useState(2.5);

  // Intervention feedback banner
  const [interventionMsg, setInterventionMsg] = useState<string | null>(null);

  // Parent portal: linked child from API (no hard-coded identity)
  const [linkedChild, setLinkedChild] = useState<{
    display_name?: string;
    register_number?: string;
    dept?: string;
  } | null>(null);
  const [linkedChildLoading, setLinkedChildLoading] = useState(false);

  const defaultStats: AdvisorStats = {
    currentCgpa: 7.8,
    predictedCgpa: 8.2,
    backlogRisk: 82,
    attendanceRisk: 'High',
    weakestSubject: 'Data Structures',
    learningSpeed: 'Normal',
    placementReadiness: 'Medium',
    burnoutRisk: 'Low',
    recommendedStudyHours: 3.5,
    inputs: {
      attendance: 68,
      internalMarks: 14,
      previousSemesterCgpa: 7.5,
      codingQuestsCompleted: 4,
      aiInterviewScore: 65,
      lmsProgress: 52,
      studyTime: 2.5
    },
    subjects: [
      { name: 'Data Structures', attendance: 68, internals: 14, minInternals: 18, risk: 'High' },
      { name: 'Operating Systems', attendance: 75, internals: 16, minInternals: 18, risk: 'Medium' },
      { name: 'Database Management', attendance: 85, internals: 24, minInternals: 18, risk: 'Low' },
      { name: 'Discrete Mathematics', attendance: 82, internals: 20, minInternals: 18, risk: 'Low' }
    ],
    recommendations: [
      { id: 'REC-01', text: 'Complete Day 12 Python Quest', completed: false, impact: 20 },
      { id: 'REC-02', text: 'Revise Trees & Graph Traversals', completed: false, impact: 15 },
      { id: 'REC-03', text: "Attend tomorrow's Data Structures lecture", completed: false, impact: 10 },
      { id: 'REC-04', text: 'Take a practice AI Mock Interview', completed: false, impact: 12 }
    ]
  };

  useEffect(() => {
    loadAdvisorData();
    if (user && ['teacher', 'faculty'].includes(user.role || '')) {
      setActiveRole('faculty');
    } else if (user && user.role === 'admin') {
      setActiveRole('admin');
    }
  }, [user]); // eslint-disable-line

  useEffect(() => {
    if (activeRole !== 'parent') return;
    let cancelled = false;
    (async () => {
      setLinkedChildLoading(true);
      try {
        const data = await api.get<{ students: any[] }>('/api/parent/students');
        if (!cancelled) {
          setLinkedChild(data?.students?.[0] || null);
        }
      } catch {
        if (!cancelled) setLinkedChild(null);
      } finally {
        if (!cancelled) setLinkedChildLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeRole]);

  async function loadAdvisorData() {
    setLoading(true);
    try {
      const data = await api.get<AdvisorStats>('/api/advisor/performance');
      if (data && data.inputs && Array.isArray(data.subjects) && Array.isArray(data.recommendations)) {
        setStats(data);
        setSimAttendance(data.inputs.attendance ?? 68);
        setSimQuests(data.inputs.codingQuestsCompleted ?? 4);
        setSimStudyTime(data.inputs.studyTime ?? 2.5);
      } else {
        setStats(defaultStats);
        setSimAttendance(defaultStats.inputs.attendance);
        setSimQuests(defaultStats.inputs.codingQuestsCompleted);
        setSimStudyTime(defaultStats.inputs.studyTime);
      }
    } catch {
      setStats(defaultStats);
    } finally {
      setLoading(false);
    }
  }

  const handleQuestAction = async (recId: string) => {
    try {
      const res = await api.post<{ ok: boolean; stats: AdvisorStats }>('/api/advisor/quest/complete', { recId });
      if (res && res.ok && res.stats && res.stats.inputs) {
        setStats(res.stats);
        setSimQuests(res.stats.inputs.codingQuestsCompleted ?? 4);
      }
    } catch {}
  };

  const triggerIntervention = (studentName: string, actionType: string) => {
    setInterventionMsg(`Successfully sent intervention trigger [${actionType}] to ${studentName}!`);
    setTimeout(() => {
      setInterventionMsg(null);
    }, 4000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%' }} />
      </div>
    );
  }

  const safeStats = stats || defaultStats;

  // Calculate simulated parameters (Student View)
  const calculatedBacklogRisk = Math.max(10, Math.round(
    (simAttendance < 75 ? 85 : 25) -
    (simQuests * 6) -
    (simStudyTime * 8) +
    25
  ));

  const calculatedCgpa = Math.min(10.0, parseFloat((
    (safeStats.currentCgpa ?? 7.8) +
    (simQuests * 0.05) +
    ((simStudyTime - 2.5) * 0.1)
  ).toFixed(2)));

  const calculatedAttendanceRisk = simAttendance >= 80 ? 'Low' : simAttendance >= 75 ? 'Medium' : 'High';

  // Mock Faculty Portal Data (Students At Risk)
  const riskStudents = {
    high: [
      { id: 's1', name: 'Rajesh Kumar', reg: 'PIN-2026-1049', class: 'CS-A', cgpa: 6.2, attendance: 64, risk: 85, reason: 'Critically low attendance and incomplete logic labs.' },
      { id: 's2', name: 'Aisha Khan', reg: 'PIN-2026-2184', class: 'CS-B', cgpa: 6.8, attendance: 71, risk: 62, reason: 'Failed mid-semester internal assessments in Data Structures.' }
    ],
    medium: [
      { id: 's3', name: 'Neha Patel', reg: 'PIN-2026-9041', class: 'CS-A', cgpa: 7.3, attendance: 76, risk: 42, reason: 'Sluggish debugging speeds on Binary Trees Quests.' },
      { id: 's4', name: 'Abhijit Sen', reg: 'PIN-2026-3024', class: 'CS-C', cgpa: 7.1, attendance: 78, risk: 35, reason: 'Inconsistent study logs and missing lab assignments.' }
    ],
    low: [
      { id: 's5', name: 'Vikram Rao', reg: 'PIN-2026-4402', class: 'CS-A', cgpa: 8.5, attendance: 92, risk: 12, reason: 'Exceptional quest completion rate and high coding metrics.' }
    ]
  };

  // Mock Admin Portal Data (Dean View)
  const departmentStats = [
    { name: 'Computer Science & Engineering', risk: 12, studentsCount: 420, activeMissions: 92 },
    { name: 'Mechanical Engineering', risk: 28, studentsCount: 310, activeMissions: 44 },
    { name: 'Civil Engineering', risk: 18, studentsCount: 250, activeMissions: 51 },
    { name: 'Electronics & Communication', risk: 15, studentsCount: 380, activeMissions: 82 },
    { name: 'Electrical Engineering', risk: 22, studentsCount: 290, activeMissions: 58 }
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      
      {/* Dynamic Header */}
      <div className="page-header" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
            🧠 AI Academic Advisor & Mentor
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 13.5, margin: 0 }}>
            {activeRole === 'student' && "Predictive performance modeling, early backlog warning indicators, and custom study intervention recommendations."}
            {activeRole === 'faculty' && "Segment students dynamically by academic risk levels to intervene proactively before examinations."}
            {activeRole === 'parent' && "Actionable performance indicators and clear recommendations for your child's learning journey."}
            {activeRole === 'admin' && "Dean's executive dashboard mapping backlog probabilities and curriculum trends across departments."}
          </p>
        </div>

        {/* Demo Switcher */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--border)' }}>
          {[
            { id: 'student', label: '🧑‍🎓 Student', desc: 'Student Portal' },
            { id: 'faculty', label: '👩‍🏫 Faculty', desc: 'Faculty Portal' },
            { id: 'parent', label: '👪 Parent', desc: 'Parent Portal' },
            { id: 'admin', label: '🏫 Dean', desc: 'Dean Admin' }
          ].map(role => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id as any)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: activeRole === role.id ? 'var(--accent)' : 'transparent',
                color: activeRole === role.id ? '#fff' : 'var(--t2)',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title={role.desc}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Intervention Toast Alert */}
      {interventionMsg && (
        <div style={{
          background: 'rgba(16,185,129,0.15)',
          border: '1px solid rgba(16,185,129,0.4)',
          color: '#34d399',
          padding: '12px 18px',
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 16,
          animation: 'slideUp 0.3s ease'
        }}>
          ✅ {interventionMsg}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 🧑‍🎓 PORTAL: STUDENT VIEW */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeRole === 'student' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
          
          {/* Left Column: Metrics & Sandbox */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Actionable Advice Voice Synthesis Banner */}
            <div style={{
              background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 16,
              padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 8px 24px rgba(99,102,241,0.06)'
            }}>
              <span style={{ fontSize: 28 }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)', marginBottom: 6 }}>
                  AI Advisor: "What will happen if I continue like this?"
                </div>
                <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>
                  "If you maintain your current learning consistency, your CGPA is projected to rise to <strong>8.2</strong>. However, due to your attendance in <strong>Data Structures (68%)</strong> and your lower quest score in Operating Systems, you have a <strong>82% risk of backlog</strong> in upcoming examinations. Complete your intervention tasks to secure your profile."
                </p>
              </div>
            </div>

            {/* Sandbox Predictor Sliders */}
            <div style={card}>
              <div style={cardLabel}>🔮 AI Risk Sandbox (What-If Predictor)</div>
              <p style={{ color: 'var(--t3)', fontSize: 11.5, marginBottom: 16 }}>
                Adjust indicators below to see how increasing study hours, quest completions, and lecture attendance affects your predicted metrics:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Target Lecture Attendance</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{simAttendance}%</span>
                  </div>
                  <input
                    type="range" min="50" max="100" step="1" style={{ width: '100%' }}
                    value={simAttendance} onChange={e => setSimAttendance(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Coding Quests Completed</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{simQuests} quests</span>
                  </div>
                  <input
                    type="range" min="0" max="10" step="1" style={{ width: '100%' }}
                    value={simQuests} onChange={e => setSimQuests(parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Daily Study / Revision Hours</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{simStudyTime} hrs/day</span>
                  </div>
                  <input
                    type="range" min="1.0" max="8.0" step="0.5" style={{ width: '100%' }}
                    value={simStudyTime} onChange={e => setSimStudyTime(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {/* Sandbox Outputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, background: 'var(--bg3)', padding: 12, borderRadius: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9.5, textTransform: 'uppercase', color: 'var(--t3)' }}>Simulated CGPA</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent)' }}>{calculatedCgpa}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9.5, textTransform: 'uppercase', color: 'var(--t3)' }}>Backlog Risk</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: calculatedBacklogRisk > 50 ? 'var(--coral)' : calculatedBacklogRisk > 25 ? 'var(--amber)' : 'var(--green)' }}>
                    {calculatedBacklogRisk}%
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9.5, textTransform: 'uppercase', color: 'var(--t3)' }}>Attendance Risk</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: calculatedAttendanceRisk === 'High' ? 'var(--coral)' : 'var(--t1)' }}>
                    {calculatedAttendanceRisk}
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Registry */}
            <div style={card}>
              <div style={cardLabel}>Subject-wise Attendance & Internal Marks Registry</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg3)' }}>
                      {['Subject Course', 'Current Attendance', 'Internals Score', 'Min Passing Internals', 'Academic Risk Status'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--t3)', fontSize: 11, fontWeight: 700, borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(safeStats.subjects || []).map(s => (
                      <tr key={s.name} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{s.name}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ color: s.attendance < 75 ? 'var(--coral)' : 'var(--t1)', fontWeight: s.attendance < 75 ? 700 : 500 }}>
                            {s.attendance}% {s.attendance < 75 && '⚠️'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>{s.internals}/30</td>
                        <td style={{ padding: '10px 12px', color: 'var(--t3)' }}>{s.minInternals}/30</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 700,
                            background: s.risk === 'High' ? 'var(--coral-light)' : s.risk === 'Medium' ? 'var(--amber-light)' : 'var(--green-light)',
                            color: s.risk === 'High' ? 'var(--coral)' : s.risk === 'Medium' ? 'var(--amber)' : 'var(--green)'
                          }}>
                            {s.risk} Risk
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Checklist */}
            <div style={card}>
              <div style={cardLabel}>🎯 Intervention Quests (Recommended Action checklist)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(safeStats.recommendations || []).map(r => (
                  <div key={r.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: r.completed ? 'var(--bg3)' : 'var(--glass)',
                    padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)',
                    opacity: r.completed ? 0.7 : 1, transition: 'all 0.15s'
                  }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input
                        type="checkbox" checked={r.completed} disabled={r.completed}
                        onChange={() => handleQuestAction(r.id)} style={{ cursor: r.completed ? 'default' : 'pointer' }}
                      />
                      <span style={{ fontSize: 13, textDecoration: r.completed ? 'line-through' : 'none', color: r.completed ? 'var(--t3)' : 'var(--t1)' }}>
                        {r.text}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 11.5, fontWeight: 700, color: 'var(--green)',
                      background: 'var(--green-light)', padding: '2px 8px', borderRadius: 6
                    }}>
                      -{r.impact}% Backlog Risk
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: KPIs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16,
              padding: 20, textAlign: 'center', boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--t3)', fontWeight: 700, letterSpacing: 0.5, marginBottom: 14 }}>
                Predicted Backlog Risk Indicator
              </div>
              <div style={{ display: 'flex', position: 'relative', justifyContent: 'center', alignItems: 'center', marginBottom: 14 }}>
                <svg width="120" height="120" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="var(--border)" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="50" cy="50" r="40"
                    stroke={(safeStats.backlogRisk ?? 0) > 50 ? 'var(--coral)' : (safeStats.backlogRisk ?? 0) > 30 ? 'var(--amber)' : 'var(--green)'}
                    strokeWidth="6" fill="transparent"
                    strokeDasharray={`${(safeStats.backlogRisk ?? 0) * 2.51} 251`}
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', fontSize: 24, fontWeight: 900 }}>
                  {safeStats.backlogRisk}%
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>
                Academic Risk status is currently <span style={{ fontWeight: 700, color: (safeStats.backlogRisk ?? 0) > 50 ? 'var(--coral)' : 'var(--t1)' }}>{safeStats.attendanceRisk}</span>.
              </div>
            </div>

            <div style={card}>
              <div style={cardLabel}>AI Academic Prognosis Metrics</div>
              {[
                { label: 'Current Semester CGPA', value: safeStats.currentCgpa, icon: '📊', color: 'var(--blue)' },
                { label: 'AI Predicted Sem CGPA', value: safeStats.predictedCgpa, icon: '📈', color: 'var(--green)' },
                { label: 'Expected Learning Speed', value: safeStats.learningSpeed, icon: '⚡', color: 'var(--amber)' },
                { label: 'Career Placement Readiness', value: safeStats.placementReadiness, icon: '🎯', color: 'var(--teal)' },
                { label: 'Student Burnout Risk Quotient', value: safeStats.burnoutRisk, icon: '🔥', color: 'var(--purple)' },
                { label: 'Target Study Hours / Day', value: `${safeStats.recommendedStudyHours} hrs`, icon: '⏳', color: 'var(--accent)' }
              ].map(kpi => (
                <div key={kpi.label} style={{
                  display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 14 }}>{kpi.icon}</span>
                    <span style={{ fontSize: 12, color: 'var(--t2)' }}>{kpi.label}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: kpi.color }}>
                    {kpi.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={cardLabel}>Advisor Input Metrics</div>
              {[
                { label: 'Attendance Average', val: `${safeStats.inputs?.attendance ?? 68}%` },
                { label: 'Internal Test Average', val: `${safeStats.inputs?.internalMarks ?? 14}/30` },
                { label: 'Previous CGPA', val: safeStats.inputs?.previousSemesterCgpa ?? 7.5 },
                { label: 'Completed Quests', val: `${safeStats.inputs?.codingQuestsCompleted ?? 4} completed` },
                { label: 'LMS Progress Ratio', val: `${safeStats.inputs?.lmsProgress ?? 52}%` }
              ].map(inp => (
                <div key={inp.label} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: 11.5, padding: '4px 0' }}>
                  <span style={{ color: 'var(--t3)' }}>{inp.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--t2)' }}>{inp.val}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 👩‍🏫 PORTAL: FACULTY VIEW */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeRole === 'faculty' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Curriculum Intervention Desk</div>
              <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: 0 }}>Select a student card below to trigger direct academic intervention messages before final exams.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 12, background: 'var(--coral-light)', color: 'var(--coral)', padding: '6px 12px', borderRadius: 8, fontWeight: 700 }}>
                🔴 {riskStudents.high.length} High Risk
              </span>
              <span style={{ fontSize: 12, background: 'var(--amber-light)', color: 'var(--amber)', padding: '6px 12px', borderRadius: 8, fontWeight: 700 }}>
                🟡 {riskStudents.medium.length} Medium Risk
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            {/* COLUMN A: HIGH RISK */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12.5, fontWeight: 900, color: 'var(--coral)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--coral)' }} />
                High Risk Students (&gt;50% backlog risk)
              </div>

              {riskStudents.high.map(student => (
                <div key={student.id} style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16,
                  boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--coral-light)', color: 'var(--coral)', padding: '4px 10px', fontSize: 11, fontWeight: 800, borderBottomLeftRadius: 10 }}>
                    {student.risk}% Risk
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 800 }}>{student.name}</h4>
                  <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 12 }}>Reg: {student.reg} | Class: {student.class}</div>
                  
                  <div style={{ display: 'flex', gap: 14, background: 'var(--bg3)', padding: '8px 12px', borderRadius: 8, fontSize: 11.5, marginBottom: 14 }}>
                    <div>GPA: <strong style={{ color: 'var(--t1)' }}>{student.cgpa}</strong></div>
                    <div>Attendance: <strong style={{ color: 'var(--coral)' }}>{student.attendance}%</strong></div>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 16px 0', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "Reason: {student.reason}"
                  </p>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => triggerIntervention(student.name, 'Send Study Materials')}
                      style={{ flex: 1, padding: '8px 4px', fontSize: 10.5, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                    >
                      📚 Send Notes
                    </button>
                    <button
                      onClick={() => triggerIntervention(student.name, 'Schedule Extra Lab Session')}
                      style={{ flex: 1, padding: '8px 4px', fontSize: 10.5, fontWeight: 800, background: 'var(--coral)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                    >
                      🔬 Extra Lab
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* COLUMN B: MEDIUM RISK */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12.5, fontWeight: 900, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)' }} />
                Medium Risk Students (25% - 50%)
              </div>

              {riskStudents.medium.map(student => (
                <div key={student.id} style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16,
                  boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--amber-light)', color: 'var(--amber)', padding: '4px 10px', fontSize: 11, fontWeight: 800, borderBottomLeftRadius: 10 }}>
                    {student.risk}% Risk
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 800 }}>{student.name}</h4>
                  <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 12 }}>Reg: {student.reg} | Class: {student.class}</div>
                  
                  <div style={{ display: 'flex', gap: 14, background: 'var(--bg3)', padding: '8px 12px', borderRadius: 8, fontSize: 11.5, marginBottom: 14 }}>
                    <div>GPA: <strong style={{ color: 'var(--t1)' }}>{student.cgpa}</strong></div>
                    <div>Attendance: <strong style={{ color: 'var(--t1)' }}>{student.attendance}%</strong></div>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 16px 0', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "Reason: {student.reason}"
                  </p>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => triggerIntervention(student.name, 'Assign Custom Python Quest')}
                      style={{ flex: 1, padding: '8px 4px', fontSize: 10.5, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                    >
                      🗺️ Assign Quest
                    </button>
                    <button
                      onClick={() => triggerIntervention(student.name, 'Alert Student on Dashboard')}
                      style={{ flex: 1, padding: '8px 4px', fontSize: 10.5, fontWeight: 800, background: 'var(--amber)', color: 'var(--t1)', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                    >
                      🔔 Alert
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* COLUMN C: LOW RISK */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12.5, fontWeight: 900, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
                Low Risk Students (&lt;25%)
              </div>

              {riskStudents.low.map(student => (
                <div key={student.id} style={{
                  background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16,
                  boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--green-light)', color: 'var(--green)', padding: '4px 10px', fontSize: 11, fontWeight: 800, borderBottomLeftRadius: 10 }}>
                    {student.risk}% Risk
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 800 }}>{student.name}</h4>
                  <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 12 }}>Reg: {student.reg} | Class: {student.class}</div>
                  
                  <div style={{ display: 'flex', gap: 14, background: 'var(--bg3)', padding: '8px 12px', borderRadius: 8, fontSize: 11.5, marginBottom: 14 }}>
                    <div>GPA: <strong style={{ color: 'var(--t1)' }}>{student.cgpa}</strong></div>
                    <div>Attendance: <strong style={{ color: 'var(--green)' }}>{student.attendance}%</strong></div>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 16px 0', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "Reason: {student.reason}"
                  </p>

                  <button
                    onClick={() => triggerIntervention(student.name, 'Send Placement Invitation')}
                    style={{ width: '100%', padding: '8px 0', fontSize: 11, fontWeight: 800, background: 'rgba(255,255,255,0.02)', color: 'var(--green)', border: '1px solid var(--green)', borderRadius: 8, cursor: 'pointer' }}
                  >
                    ⭐ Recommend for Placement
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 👪 PORTAL: PARENT VIEW */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeRole === 'parent' && (
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Child Selection Indicator */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white', fontWeight: 900 }}>
                {linkedChild?.display_name
                  ? linkedChild.display_name.split(/\s+/).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
                  : '?'}
              </div>
              <div>
                <span style={{ fontSize: 11.5, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Your Child</span>
                <h2 style={{ fontSize: 17, fontWeight: 900, margin: '2px 0 0 0' }}>
                  {linkedChildLoading ? 'Loading…' : (linkedChild?.display_name || 'No linked child')}
                </h2>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                  Register Number: {linkedChild?.register_number || 'Not available'}
                  {linkedChild?.dept ? ` | Major: ${linkedChild.dept}` : ''}
                </span>
              </div>
            </div>
            <div style={{
              background: linkedChild ? 'var(--green-light)' : 'var(--bg3)',
              color: linkedChild ? 'var(--green)' : 'var(--t3)',
              padding: '6px 14px', borderRadius: 30, fontSize: 12, fontWeight: 800
            }}>
              {linkedChild ? 'Status: Active Enrollment' : 'No student linked'}
            </div>
          </div>

          {!linkedChild && !linkedChildLoading && (
            <div style={{ ...card, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
              Link a student register number from the Parent Portal to view attendance and academic insights.
            </div>
          )}

          {linkedChild && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
            {/* Risk Badges Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* Attendance Risk card */}
              <div style={card}>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Attendance Risk</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--t3)' }}>Lecture participation tracker</p>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 900, background: 'var(--green-light)', color: 'var(--green)',
                    padding: '8px 18px', borderRadius: 100, border: '1px solid rgba(16,185,129,0.2)'
                  }}>
                    LOW RISK
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 14, paddingTop: 12, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.4 }}>
                  "{linkedChild.display_name} has attended <strong>{stats?.inputs?.attendance ?? '—'}%</strong> of lectures. Review the attendance tracker for the latest status."
                </div>
              </div>

              {/* Academic Risk card */}
              <div style={card}>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Academic Risk</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--t3)' }}>Grades & internal exam assessments</p>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 900, background: 'var(--amber-light)', color: 'var(--amber)',
                    padding: '8px 18px', borderRadius: 100, border: '1px solid rgba(245,158,11,0.2)'
                  }}>
                    MEDIUM RISK
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 14, paddingTop: 12, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.4 }}>
                  "Grades are stable overall (CGPA 7.8), but internal tests in <strong>Operating Systems</strong> show a sliding trend."
                </div>
              </div>

            </div>

            {/* Recommendation Column */}
            <div style={card}>
              <div style={cardLabel}>📋 Parental Guidance & Actions</div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--bg3)', padding: 18, borderRadius: 14, border: '1px solid var(--border)', marginBottom: 20 }}>
                <span style={{ fontSize: 24 }}>💡</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13.5, marginBottom: 4 }}>Tutoring Recommendation</div>
                  <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, margin: 0 }}>
                    "Your child is showing great coding performance but requires additional practice and focus on **Operating Systems**, specifically **Memory Management** and **Page Replacement Algorithms**, to avoid exam backlogs."
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12.5, color: 'var(--t2)' }}>
                  <span>✓</span>
                  <span>Review study logs on Operating Systems daily.</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12.5, color: 'var(--t2)' }}>
                  <span>✓</span>
                  <span>Ensure 2 hours of daily revision time before mid-semester tests.</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12.5, color: 'var(--t2)' }}>
                  <span>✓</span>
                  <span>Math practice recommended on weekends.</span>
                </div>
              </div>
            </div>
          </div>
          )}

        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 🏫 PORTAL: DEAN ADMIN VIEW */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeRole === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Department Backlog Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'start' }}>
            
            {/* Table */}
            <div style={card}>
              <div style={cardLabel}>Dean Dashboard: Campus Backlog Prediction Matrix</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: 'var(--bg3)' }}>
                    {['Department Code', 'Student Density', 'Active Missions', 'Predicted Backlog Risk'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--t3)', fontSize: 11, fontWeight: 700, borderBottom: '1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map(dept => (
                    <tr key={dept.name} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{dept.name}</td>
                      <td style={{ padding: '12px 14px' }}>{dept.studentsCount} Students</td>
                      <td style={{ padding: '12px 14px', color: 'var(--t2)' }}>{dept.activeMissions} active</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontWeight: 900,
                          color: dept.risk > 25 ? 'var(--coral)' : dept.risk > 15 ? 'var(--amber)' : 'var(--green)'
                        }}>
                          {dept.risk}% Risk
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual Bar chart comparing risks */}
            <div style={card}>
              <div style={cardLabel}>Curriculum Performance Graph (Risk ratios)</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 10 }}>
                {departmentStats.map(dept => (
                  <div key={dept.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--t2)', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{dept.name.split(' ')[0]} dept</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{dept.risk}% backlog likelihood</span>
                    </div>
                    {/* Bar Wrapper */}
                    <div style={{ width: '100%', height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{
                        width: `${dept.risk * 3}%`, // Scale to graph space
                        maxWidth: '100%',
                        height: '100%',
                        background: dept.risk > 25 ? 'linear-gradient(90deg, #f87171, #ef4444)' : dept.risk > 15 ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, #34d399, #10b981)',
                        transition: 'width 1s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 16, fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4, display: 'flex', gap: 8 }}>
                <span>💡</span>
                <span><strong>Mechanical</strong> department shows higher predicted backlog likelihood (28%) due to lower LMS engagement levels in thermal labs. Recommended dean audit in week 8.</span>
              </div>
            </div>

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
