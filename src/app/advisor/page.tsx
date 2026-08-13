'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';

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

interface AtRiskStudent {
  id: string;
  name: string;
  attendance: number;
  cgpa: number;
  pendingAssignments?: number;
  riskLevel: string;
}

type AdvisorView = 'student' | 'faculty' | 'parent' | 'admin';

function viewFromRole(role?: string): AdvisorView {
  if (role === 'admin' || role === 'superadmin') return 'admin';
  if (role === 'teacher' || role === 'faculty') return 'faculty';
  if (role === 'parent') return 'parent';
  return 'student';
}

export default function AdvisorPage() {
  const { user } = useAuth();
  const activeRole = viewFromRole(user?.role);
  const [stats, setStats] = useState<AdvisorStats | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const [simAttendance, setSimAttendance] = useState(0);
  const [simQuests, setSimQuests] = useState(0);
  const [simStudyTime, setSimStudyTime] = useState(0);

  const [interventionMsg, setInterventionMsg] = useState<string | null>(null);
  const [riskStudents, setRiskStudents] = useState<AtRiskStudent[]>([]);
  const [risksLoading, setRisksLoading] = useState(false);

  const [linkedChild, setLinkedChild] = useState<{
    display_name?: string;
    register_number?: string;
    dept?: string;
  } | null>(null);
  const [linkedChildLoading, setLinkedChildLoading] = useState(false);

  useEffect(() => {
    loadAdvisorData();
  }, [user]); // eslint-disable-line

  useEffect(() => {
    if (activeRole !== 'faculty' && activeRole !== 'admin') return;
    let cancelled = false;
    (async () => {
      setRisksLoading(true);
      try {
        const data = await api.get<{ students: AtRiskStudent[] }>('/api/advisor/admin/risks');
        if (!cancelled) setRiskStudents(Array.isArray(data?.students) ? data.students : []);
      } catch {
        if (!cancelled) setRiskStudents([]);
      } finally {
        if (!cancelled) setRisksLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeRole]);

  useEffect(() => {
    if (activeRole !== 'parent') return;
    let cancelled = false;
    (async () => {
      setLinkedChildLoading(true);
      try {
        const data = await api.get<{ students: any[] }>('/api/parent/students');
        if (!cancelled) setLinkedChild(data?.students?.[0] || null);
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
    setLoadError('');
    try {
      const data = await api.get<AdvisorStats>('/api/advisor/performance');
      if (data && data.inputs && Array.isArray(data.subjects) && Array.isArray(data.recommendations)) {
        setStats(data);
        setSimAttendance(data.inputs.attendance ?? 0);
        setSimQuests(data.inputs.codingQuestsCompleted ?? 0);
        setSimStudyTime(data.inputs.studyTime ?? 0);
      } else {
        setStats(null);
        setLoadError('Advisor performance data is not available yet.');
      }
    } catch {
      setStats(null);
      setLoadError('Could not load advisor performance. Try again after signing in.');
    } finally {
      setLoading(false);
    }
  }

  const handleQuestAction = async (recId: string) => {
    try {
      const res = await api.post<{ ok: boolean; stats: AdvisorStats }>('/api/advisor/quest/complete', { recId });
      if (res && res.ok && res.stats && res.stats.inputs) {
        setStats(res.stats);
        setSimQuests(res.stats.inputs.codingQuestsCompleted ?? 0);
      }
    } catch {}
  };

  const triggerIntervention = async (studentId: string, studentName: string, actionType: string) => {
    try {
      await api.post('/api/advisor/admin/alert', { studentId, message: actionType });
      setInterventionMsg(`Intervention [${actionType}] sent for ${studentName}.`);
    } catch {
      setInterventionMsg(`Could not send intervention for ${studentName}.`);
    }
    setTimeout(() => setInterventionMsg(null), 4000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: '50%' }} />
      </div>
    );
  }

  const highRisk = riskStudents.filter(s => (s.riskLevel || '').toLowerCase() === 'high');
  const mediumRisk = riskStudents.filter(s => (s.riskLevel || '').toLowerCase() === 'medium');
  const lowRisk = riskStudents.filter(s => {
    const level = (s.riskLevel || '').toLowerCase();
    return level === 'low' || (!level && (s.attendance ?? 0) >= 75);
  });

  const calculatedBacklogRisk = stats ? Math.max(10, Math.round(
    (simAttendance < 75 ? 85 : 25) -
    (simQuests * 6) -
    (simStudyTime * 8) +
    25
  )) : 0;

  const calculatedCgpa = stats ? Math.min(10.0, parseFloat((
    (stats.currentCgpa ?? 0) +
    (simQuests * 0.05) +
    ((simStudyTime - (stats.inputs?.studyTime ?? 0)) * 0.1)
  ).toFixed(2))) : 0;

  const calculatedAttendanceRisk = simAttendance >= 80 ? 'Low' : simAttendance >= 75 ? 'Medium' : 'High';

  const emptyState = (
    <div style={{ ...card, textAlign: 'center', color: 'var(--t2)', fontSize: 13, padding: 32 }}>
      {loadError || 'No advisor records yet. Data appears after campus tables are connected.'}
    </div>
  );

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>
          AI Academic Advisor & Mentor
        </h1>
        <p style={{ color: 'var(--t2)', fontSize: 13.5, margin: 0 }}>
          {activeRole === 'student' && 'Predictive performance modeling from your recorded academic data.'}
          {activeRole === 'faculty' && 'Students flagged by recorded attendance and assignment risk — not demo identities.'}
          {activeRole === 'parent' && 'Insights for a linked child only. Nothing is invented when no child is linked.'}
          {activeRole === 'admin' && 'At-risk students from campus records. Empty until advisor data exists.'}
        </p>
      </div>

      {interventionMsg && (
        <div style={{
          background: 'var(--green-light)',
          border: '1px solid var(--green-light)',
          color: 'var(--green)',
          padding: '12px 18px',
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 16
        }}>
          {interventionMsg}
        </div>
      )}

      {activeRole === 'student' && !stats && emptyState}

      {activeRole === 'student' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 16,
              padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: 28 }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)', marginBottom: 6 }}>
                  AI Advisor snapshot
                </div>
                <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, margin: 0 }}>
                  Current CGPA <strong>{stats.currentCgpa}</strong>. Predicted CGPA <strong>{stats.predictedCgpa}</strong>.
                  Weakest recorded area: <strong>{stats.weakestSubject}</strong>. Backlog risk <strong>{stats.backlogRisk}%</strong>.
                </p>
              </div>
            </div>

            <div style={card}>
              <div style={cardLabel}>AI Risk Sandbox (What-If Predictor)</div>
              <p style={{ color: 'var(--t3)', fontSize: 11.5, marginBottom: 16 }}>
                Sliders start from your recorded values. They do not persist until you complete a quest.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Target Lecture Attendance</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{simAttendance}%</span>
                  </div>
                  <input type="range" min="50" max="100" step="1" style={{ width: '100%' }}
                    value={simAttendance} onChange={e => setSimAttendance(parseInt(e.target.value))} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Coding Quests Completed</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{simQuests} quests</span>
                  </div>
                  <input type="range" min="0" max="10" step="1" style={{ width: '100%' }}
                    value={simQuests} onChange={e => setSimQuests(parseInt(e.target.value))} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Daily Study / Revision Hours</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{simStudyTime} hrs/day</span>
                  </div>
                  <input type="range" min="1.0" max="8.0" step="0.5" style={{ width: '100%' }}
                    value={simStudyTime} onChange={e => setSimStudyTime(parseFloat(e.target.value))} />
                </div>
              </div>

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

            <div style={card}>
              <div style={cardLabel}>Subject-wise Attendance & Internal Marks</div>
              {stats.subjects.length === 0 ? (
                <p style={{ color: 'var(--t3)', fontSize: 13, margin: 0 }}>No subject rows recorded.</p>
              ) : (
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
                      {stats.subjects.map(s => (
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
              )}
            </div>

            <div style={card}>
              <div style={cardLabel}>Intervention Quests</div>
              {stats.recommendations.length === 0 ? (
                <p style={{ color: 'var(--t3)', fontSize: 13, margin: 0 }}>No recommended actions yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {stats.recommendations.map(r => (
                    <div key={r.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: r.completed ? 'var(--bg3)' : 'var(--glass)',
                      padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)',
                      opacity: r.completed ? 0.7 : 1
                    }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <input type="checkbox" checked={r.completed} disabled={r.completed}
                          onChange={() => handleQuestAction(r.id)} style={{ cursor: r.completed ? 'default' : 'pointer' }} />
                        <span style={{ fontSize: 13, textDecoration: r.completed ? 'line-through' : 'none', color: r.completed ? 'var(--t3)' : 'var(--t1)' }}>
                          {r.text}
                        </span>
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--green)', background: 'var(--green-light)', padding: '2px 8px', borderRadius: 6 }}>
                        -{r.impact}% Backlog Risk
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--t3)', fontWeight: 700, letterSpacing: 0.5, marginBottom: 14 }}>
                Predicted Backlog Risk
              </div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>{stats.backlogRisk}%</div>
              <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 8 }}>
                Attendance risk: <span style={{ fontWeight: 700 }}>{stats.attendanceRisk}</span>
              </div>
            </div>

            <div style={card}>
              <div style={cardLabel}>Recorded metrics</div>
              {[
                { label: 'Current Semester CGPA', value: stats.currentCgpa },
                { label: 'AI Predicted Sem CGPA', value: stats.predictedCgpa },
                { label: 'Expected Learning Speed', value: stats.learningSpeed },
                { label: 'Career Placement Readiness', value: stats.placementReadiness },
                { label: 'Student Burnout Risk', value: stats.burnoutRisk },
                { label: 'Target Study Hours / Day', value: `${stats.recommendedStudyHours} hrs` }
              ].map(kpi => (
                <div key={kpi.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--t2)' }}>{kpi.label}</span>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{kpi.value}</span>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={cardLabel}>Advisor Input Metrics</div>
              {[
                { label: 'Attendance Average', val: `${stats.inputs.attendance}%` },
                { label: 'Internal Test Average', val: `${stats.inputs.internalMarks}/30` },
                { label: 'Previous CGPA', val: stats.inputs.previousSemesterCgpa },
                { label: 'Completed Quests', val: `${stats.inputs.codingQuestsCompleted} completed` },
                { label: 'LMS Progress Ratio', val: `${stats.inputs.lmsProgress}%` }
              ].map(inp => (
                <div key={inp.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, padding: '4px 0' }}>
                  <span style={{ color: 'var(--t3)' }}>{inp.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--t2)' }}>{inp.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(activeRole === 'faculty' || activeRole === 'admin') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>
                {activeRole === 'admin' ? 'Campus at-risk roster' : 'Curriculum Intervention Desk'}
              </div>
              <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: 0 }}>
                Sourced from advisor_performance / campus store. No demo students.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 12, background: 'var(--coral-light)', color: 'var(--coral)', padding: '6px 12px', borderRadius: 8, fontWeight: 700 }}>
                {highRisk.length} High Risk
              </span>
              <span style={{ fontSize: 12, background: 'var(--amber-light)', color: 'var(--amber)', padding: '6px 12px', borderRadius: 8, fontWeight: 700 }}>
                {mediumRisk.length} Medium Risk
              </span>
            </div>
          </div>

          {risksLoading && <div style={{ color: 'var(--t2)', fontSize: 13 }}>Loading at-risk students…</div>}

          {!risksLoading && riskStudents.length === 0 && (
            <div style={{ ...card, textAlign: 'center', color: 'var(--t2)', fontSize: 13 }}>
              No at-risk students recorded. Run campus SQL and record attendance before this list fills.
            </div>
          )}

          {!risksLoading && riskStudents.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              {[
                { label: 'High Risk', color: 'var(--coral)', items: highRisk },
                { label: 'Medium Risk', color: 'var(--amber)', items: mediumRisk },
                { label: 'Low / Watch', color: 'var(--green)', items: lowRisk },
              ].map(col => (
                <div key={col.label} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 900, color: col.color, textTransform: 'uppercase' }}>
                    {col.label}
                  </div>
                  {col.items.length === 0 && (
                    <div style={{ ...card, fontSize: 12, color: 'var(--t3)' }}>None in this band.</div>
                  )}
                  {col.items.map(student => (
                    <div key={student.id} style={{
                      background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16
                    }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 800 }}>{student.name}</h4>
                      <div style={{ fontSize: 11.5, color: 'var(--t3)', marginBottom: 12 }}>ID: {student.id}</div>
                      <div style={{ display: 'flex', gap: 14, background: 'var(--bg3)', padding: '8px 12px', borderRadius: 8, fontSize: 11.5, marginBottom: 14 }}>
                        <div>GPA: <strong>{student.cgpa}</strong></div>
                        <div>Attendance: <strong>{student.attendance}%</strong></div>
                      </div>
                      {typeof student.pendingAssignments === 'number' && (
                        <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 12px 0' }}>
                          Pending assignments: {student.pendingAssignments}
                        </p>
                      )}
                      <button
                        onClick={() => triggerIntervention(student.id, student.name, 'Dashboard alert')}
                        style={{ width: '100%', padding: '8px 4px', fontSize: 10.5, fontWeight: 800, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                      >
                        Send alert
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeRole === 'parent' && (
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 11.5, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700 }}>Your Child</span>
              <h2 style={{ fontSize: 17, fontWeight: 900, margin: '2px 0 0 0' }}>
                {linkedChildLoading ? 'Loading…' : (linkedChild?.display_name || 'No linked child')}
              </h2>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                Register Number: {linkedChild?.register_number || 'Not available'}
                {linkedChild?.dept ? ` | Major: ${linkedChild.dept}` : ''}
              </span>
            </div>
            <div style={{
              background: linkedChild ? 'var(--green-light)' : 'var(--bg3)',
              color: linkedChild ? 'var(--green)' : 'var(--t3)',
              padding: '6px 14px', borderRadius: 30, fontSize: 12, fontWeight: 800
            }}>
              {linkedChild ? 'Linked' : 'No student linked'}
            </div>
          </div>

          {!linkedChild && !linkedChildLoading && (
            <div style={{ ...card, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
              Link a student from the Parent Portal to view recorded attendance and academics.
            </div>
          )}

          {linkedChild && !stats && emptyState}

          {linkedChild && stats && (
            <div style={card}>
              <div style={cardLabel}>Recorded child metrics</div>
              <p style={{ fontSize: 13, color: 'var(--t2)', margin: 0 }}>
                Attendance {stats.inputs.attendance}%. CGPA {stats.currentCgpa}. Attendance risk {stats.attendanceRisk}.
              </p>
            </div>
          )}
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
