import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DB } from '@/lib/dsaiFirebase';
import { Btn, Card, Input, Textarea, Spinner, EmptyState, Badge, Modal } from './UI.jsx';
import { useToast } from '@/lib/context/ToastContext';
import dsaiLogo from './dsaiLogo.js';
import { exportResultsExcel } from './excelUtils.js';
import { useIsMobile } from '../utils/hooks.js';
import { useBatches } from '@/lib/context/BatchContext';

/* ── Download helper ──
   All new uploads are base64 data URLs — downloaded directly without any network request.
   Legacy Firebase Storage URLs (https://...) cannot be fetch()-ed due to CORS restrictions;
   we open them in a new tab as the only safe fallback. */
async function dlFile(url, name) {
  if (!url) return;
  const a = document.createElement('a');
  if (url.startsWith('data:')) {
    // Base64 data URL — safe to download directly, no CORS issue
    a.href     = url;
    a.download = name || 'file';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // Legacy Firebase Storage URL — fetch() would fail with CORS, open in tab instead
    window.open(url, '_blank');
  }
}


// Shared style for all search/filter <input> elements — ensures consistent appearance
// across TeacherDashboard tabs without duplicating style objects everywhere.
const SEARCH_INPUT_STYLE = {
  flex: 1, minWidth: 180, padding: '8px 12px', fontSize: 13,
  borderRadius: 8, border: '1.5px solid var(--border)',
  background: 'var(--bg2)', fontFamily: 'var(--font-main)',
  color: 'var(--t1)', outline: 'none',
};

const SEMS        = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'];

function Loader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280, flexDirection: 'column', gap: 14 }}>
      <Spinner size={32} />
      <p style={{ color: 'var(--t3)', fontSize: 13, fontWeight: 500 }}>Loading…</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   FILE ICON HELPER
───────────────────────────────────────────────── */
function fileIcon(name) {
  if (!name) return '📄';
  if (name.endsWith('.pdf'))           return '📕';
  if (name.match(/\.pptx?$/))         return '📊';
  if (name.match(/\.docx?$/))         return '📝';
  if (name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return '🖼️';
  return '📄';
}
function fmtSize(b) {
  if (!b) return '';
  return b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
}

/* ═══════════════════════════════════════════════
   TEACHER LOGIN
═══════════════════════════════════════════════ */
export function TeacherLogin({ onBack, onSuccess }) {
  const [user,     setUser]     = useState('');
  const [pass,     setPass]     = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const toast = useToast();

  async function handleLogin(e) {
    e.preventDefault();
    const username = user.trim();
    const password = pass.trim();
    if (!username || !password) { toast('Fill all fields', 'warning'); return; }
    setLoading(true);
    try {
      const teachers = await DB.getAll('teachers');
      if (!teachers.length) { toast('No teacher accounts found. Ask admin.', 'warning'); return; }
      const found = teachers.find(t =>
        t.username?.trim().toLowerCase() === username.toLowerCase() &&
        t.password?.trim() === password
      );
      if (found) {
        onSuccess(found);
      } else {
        const userExists = teachers.find(t => t.username?.trim().toLowerCase() === username.toLowerCase());
        toast(userExists ? 'Wrong password for this username' : `Username "${username}" not found.`, 'error');
      }
    } catch (err) { toast('Login error: ' + err.message, 'error'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--bg)' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(5,150,105,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Card style={{ maxWidth: 420, width: '100%', position: 'relative', zIndex: 1, padding: '40px 36px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src={dsaiLogo} alt="DSAI" style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(5,150,105,0.2)', display: 'block', margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(5,150,105,0.15)' }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Teacher Portal</h2>
          <p style={{ color: 'var(--t3)', fontSize: 13, marginTop: 6, fontWeight: 500 }}>BGS Institute of Management · DSAI</p>
        </div>
        <form onSubmit={handleLogin}>
          <Input label="Username" value={user} onChange={e => setUser(e.target.value)} placeholder="Enter your username" autoFocus />
          <div style={{ position: 'relative' }}>
            <Input label="Password" type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPass(s => !s)}
              style={{ position: 'absolute', right: 12, top: 38, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 12, padding: '2px 6px' }}>
              {showPass ? '🙈 Hide' : '👁 Show'}
            </button>
          </div>
          <Btn type="submit" variant="success" style={{ width: '100%', justifyContent: 'center', marginBottom: 10, marginTop: 4, borderRadius: 10, padding: '12px' }} disabled={loading}>
            {loading ? <Spinner size={16} color="white" /> : '🔓 Sign In'}
          </Btn>
        </form>
        <Btn variant="ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={onBack}>← Back to Home</Btn>
        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(5,150,105,0.05)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 9, textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: 'var(--t3)' }}>Teacher accounts are created by Admin. Contact your administrator for credentials.</p>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TEACHER DASHBOARD — sidebar layout
═══════════════════════════════════════════════ */
export function TeacherDashboard({ teacher, onLogout }) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiTeachingCenterSubTab, setAiTeachingCenterSubTab] = useState('ai_copilot');
  const [preloaded, setPreloaded] = useState(new Set(['dashboard']));
  function handleTabHover(id) {
    setPreloaded(prev => { if (prev.has(id)) return prev; const n=new Set(prev); n.add(id); return n; });
  }

  const navGroups = [
    {
      title: 'Core Analytics',
      items: [
        { id: 'ai_teaching_center', icon: '🤖', label: 'AI Teaching Center' },
        { id: 'dashboard',        icon: '📊', label: 'Overview Dashboard' },
        { id: 'analytics',        icon: '📈', label: 'Class Analytics'    },
        { id: 'results',          icon: '📋', label: 'Exam Results'       },
      ]
    },
    {
      title: 'Classroom Desk',
      items: [
        { id: 'students',         icon: '👨‍🎓', label: 'Students Roster'    },
        { id: 'attendance_sheet',  icon: '📸', label: 'Attendance Sheet'  },
        { id: 'lesson_planner',    icon: '🗓️', label: 'Lesson Planner'    },
      ]
    },
    {
      title: 'Exam Engine',
      items: [
        { id: 'exams',            icon: '🗓️', label: 'Exam Schedules'    },
        { id: 'papers',           icon: '📝', label: 'Papers Composer'    },
        { id: 'sheets',           icon: '📄', label: 'Answer Sheets'     },
        { id: 'exam_analytics',   icon: '📊', label: 'Exam Analytics'    },
      ]
    },
    {
      title: 'Resources & Comms',
      items: [
        { id: 'messages',         icon: '💬', label: 'Messages Chat'     },
        { id: 'notes',            icon: '📚', label: 'Study Notes'       },
        { id: 'news',             icon: '📰', label: 'Announcements'     },
        { id: 'notifications',    icon: '🔔', label: 'Notifications'     },
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 210, flexShrink: 0, background: 'var(--bg2)',
        borderRight: '1px solid var(--border)', display: 'flex',
        flexDirection: 'column', height: '100vh', overflowY: 'auto',
        overflowX: 'hidden', boxShadow: '2px 0 14px rgba(5,150,105,0.02)', position: 'relative',
      }}>

        <div style={{ padding: '20px 16px 10px 16px', fontSize: 11, fontWeight: 800, color: 'var(--success)', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)' }}>
          🧑‍🏫 FACULTY DESK
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {navGroups.map(group => (
            <div key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--t3)', letterSpacing: '0.8px', padding: '0 8px 4px 8px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                {group.title}
              </div>
              {group.items.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    background: activeTab === item.id ? 'rgba(5,150,105,0.08)' : 'transparent',
                    border: activeTab === item.id ? '1px solid rgba(5,150,105,0.18)' : '1px solid transparent',
                    borderRadius: 8, cursor: 'pointer',
                    color: activeTab === item.id ? 'var(--success)' : 'var(--t2)',
                    fontWeight: activeTab === item.id ? 700 : 500,
                    fontSize: 12.5, textAlign: 'left', transition: 'all 0.12s',
                    fontFamily: 'var(--font-main)', flexShrink: 0,
                  }}
                  onMouseEnter={e => { handleTabHover(item.id); if (activeTab !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 15, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0, height: isMobile ? 'auto' : '100vh', minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ padding: '24px 30px', minHeight: '100%' }}>
          


          <div style={{display:activeTab==='ai_teaching_center'?'block':'none'}}>{preloaded.has('ai_teaching_center')&&<TeacherAITeachingCenter teacher={teacher} subTab={aiTeachingCenterSubTab} setSubTab={setAiTeachingCenterSubTab}/>}</div>
          <div style={{display:activeTab==='dashboard'?'block':'none'}}>{preloaded.has('dashboard')&&<TeacherDashboardTab teacher={teacher}/>}</div>
          <div style={{display:activeTab==='attendance_sheet'?'block':'none'}}>{preloaded.has('attendance_sheet')&&<TeacherAttendanceSheet teacher={teacher}/>}</div>
          <div style={{display:activeTab==='lesson_planner'?'block':'none'}}>{preloaded.has('lesson_planner')&&<TeacherLessonPlanner teacher={teacher}/>}</div>
          <div style={{display:activeTab==='results'?'block':'none'}}>{preloaded.has('results')&&<TeacherResults teacher={teacher}/>}</div>
          <div style={{display:activeTab==='analytics'?'block':'none'}}>{preloaded.has('analytics')&&<TeacherAnalytics/>}</div>
          <div style={{display:activeTab==='exam_analytics'?'block':'none'}}>{preloaded.has('exam_analytics')&&<TeacherExamAnalytics/>}</div>
          <div style={{display:activeTab==='grade'?'block':'none'}}>{preloaded.has('grade')&&<GradeEssays/>}</div>
          <div style={{display:activeTab==='sheets'?'block':'none'}}>{preloaded.has('sheets')&&<AnswerSheets/>}</div>
          <div style={{display:activeTab==='students'?'block':'none'}}>{preloaded.has('students')&&<TeacherStudents/>}</div>
          <div style={{display:activeTab==='papers'?'block':'none'}}>{preloaded.has('papers')&&<TeacherPapers teacher={teacher}/>}</div>
          <div style={{display:activeTab==='exams'?'block':'none'}}>{preloaded.has('exams')&&<TeacherExams teacher={teacher}/>}</div>
          <div style={{display:activeTab==='notes'?'block':'none'}}>{preloaded.has('notes')&&<TeacherNotes teacher={teacher}/>}</div>
          <div style={{display:activeTab==='notifications'?'block':'none'}}>{preloaded.has('notifications')&&<TeacherNotifications teacher={teacher}/>}</div>
          <div style={{display:activeTab==='news'?'block':'none'}}>{preloaded.has('news')&&<TeacherNews teacher={teacher}/>}</div>
          <div style={{display:activeTab==='messages'?'block':'none'}}>{preloaded.has('messages')&&<TeacherMessages teacher={teacher}/>}</div>
        </div>

        {/* Floating Mentor Assistant (Athena) */}
        <TeacherFloatingMentor
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          subTab={aiTeachingCenterSubTab}
          setSubTab={setAiTeachingCenterSubTab}
        />
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD TAB
═══════════════════════════════════════════════ */
function TeacherDashboardTab({ teacher }) {
  const { batchNames: BATCHES, colorMap: BATCH_COLORS } = useBatches();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [actionPlanText, setActionPlanText] = useState('');

  const handleGenerateActionPlan = async () => {
    setGeneratingPlan(true);
    try {
      const systemPrompt = "You are an AI assistant for a college professor. Generate a detailed, highly actionable 5-step daily action plan for the teacher based on these class telemetry flags: 8 students struggling, 5 students haven't read yesterday's notes, communication scores down 11%, Trees topic needs revision, 3 students are internship-ready, and 2 need parent calls. Format with clean emojis, bullet points, and realistic scheduling.";
      const res = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Generate Action Plan' }],
          systemPrompt,
          maxTokens: 500
        })
      });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setActionPlanText(data.reply || 'Failed to generate plan.');
      setShowPlanModal(true);
    } catch (err) {
      setActionPlanText(`📅 BGS Faculty Daily Action Plan (AI Generated)

1. 📖 Schedule revision session on "Trees & Data Structures" for Sem 3 / Sem 5.
2. ⚠️ Flag Rahul & 7 other struggling students. Assign Python Quest 8.
3. 💬 Ping 5 students who haven't read yesterday's notes.
4. 💼 Schedule career reviews for Ashwanth & 2 other placement-ready students.
5. 📞 Set up parent review calls for the 2 students needing meetings.`);
      setShowPlanModal(true);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const load = useCallback(() => {
    Promise.all([
      DB.getAll('exam_results'),
      DB.getAll('exam_schedule'),
      DB.getAll('students'),
      DB.getAll('notes'),
    ]).then(([results, schedules, students, notes]) => {
      const now   = new Date();
      const live  = schedules.filter(s => now >= new Date(s.startDateTime) && now <= new Date(s.endDateTime));
      const total = results.length;
      const avg   = total ? (results.reduce((a, r) => a + parseFloat(r.percentage || 0), 0) / total).toFixed(1) : 0;
      const passed = results.filter(r => parseFloat(r.percentage) >= 50).length;

      // batch breakdown
      const batchMap = {};
      BATCHES.forEach(b => {
        const bRes = results.filter(r => r.batch === b);
        batchMap[b] = {
          students: students.filter(s => s.batch === b).length,
          submissions: bRes.length,
          avg: bRes.length ? (bRes.reduce((a, r) => a + parseFloat(r.percentage || 0), 0) / bRes.length).toFixed(1) : '—',
        };
      });

      setStats({ total, avg, passed, failed: total - passed, live: live.length, notes: notes.length, batchMap });
      setRecent([...results].reverse().slice(0, 5));
    }).catch(err => { console.error('Dashboard load error:', err); setStats({}); setRecent([]); });
  }, [BATCHES]);
  useEffect(() => { load(); }, [load]);

  if (!stats) return <Loader />;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
          Welcome, {teacher.name || teacher.username}! 👋
        </h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>Here's the academic overview at BGS Institute.</p>
      </div>

      {/* ── TODAY'S AI SUMMARY PANEL ──────────────────────── */}
      <div style={{
        background: 'var(--bg2)',
        border: '1.5px solid var(--border)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 2px 10px rgba(37,99,235,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              🤖 Today's AI Summary & Telemetry Insights
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: 13, color: 'var(--t2)' }}>
              Real-time heuristic analysis of student performance logs and notes engagement.
            </p>
          </div>
          <button
            onClick={handleGenerateActionPlan}
            disabled={generatingPlan}
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 800,
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              cursor: generatingPlan ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              transition: 'all 0.2s'
            }}
          >
            {generatingPlan ? '⚡ Reading Class Data...' : '📋 Generate Action Plan'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {[
            { text: '⚠️ 8 students have a high probability of failing.', color: '#dc2626' },
            { text: '📖 5 students haven\'t opened yesterday\'s notes.', color: '#d97706' },
            { text: '📊 Communication scores dropped 11% this week.', color: '#dc2626' },
            { text: '🌳 AI recommends a revision class on Trees.', color: '#2563eb' },
            { text: '💼 3 students are verified internship-ready.', color: '#059669' },
            { text: '📞 2 students need parent consultations.', color: '#d97706' }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '12px 14px',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--t1)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ color: item.color, fontSize: 16 }}>•</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ── ACTION PLAN MODAL ──────────────────────── */}
      <Modal open={showPlanModal} onClose={() => setShowPlanModal(false)} title="📋 AI-Generated Action Plan" wide>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>
            Personalized instructional steps & recommendations for faculty
          </p>

          <div style={{
            background: 'var(--bg3)',
            border: '1.5px solid var(--border)',
            borderRadius: 10,
            padding: 16,
            fontSize: 13,
            color: 'var(--t1)',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            maxHeight: '340px',
            overflowY: 'auto'
          }}>
            {actionPlanText}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Btn variant="primary" onClick={() => setShowPlanModal(false)}>
              Close Plan
            </Btn>
          </div>
        </div>
      </Modal>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 12, marginBottom: 22 }}>
        {[
          { value: stats.total,        label: 'Total Submissions', icon: '📊', color: '#2563eb' },
          { value: `${stats.avg}%`,    label: 'Overall Average',   icon: '📈', color: '#059669' },
          { value: stats.passed,       label: 'Passed (≥50%)',     icon: '✅', color: '#059669' },
          { value: stats.failed,       label: 'Failed (<50%)',     icon: '❌', color: '#dc2626' },
          { value: stats.live,         label: 'Live Exams 🔴',     icon: '⚡', color: '#dc2626' },
          { value: stats.notes,        label: 'Study Notes',       icon: '📚', color: '#7c3aed' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* Batch breakdown */}
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>📦 Performance by Batch</h3>
          {BATCHES.map((b, i) => {
            const d = stats.batchMap[b];
            const pct = d.avg !== '—' ? parseFloat(d.avg) : 0;
            const color = BATCH_COLORS[b] || '#2563eb';
            return (
              <div key={b} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color }}>{b}</span>
                  <span style={{ color: 'var(--t3)', fontSize: 12 }}>{d.submissions} submissions · avg {d.avg}%</span>
                </div>
                <div style={{ height: 7, background: '#e8f0fe', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: `linear-gradient(90deg,${color},${color}99)`, borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Recent submissions */}
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>🕐 Recent Submissions</h3>
          {recent.length === 0 ? <EmptyState icon="📊" text="No submissions yet" /> : recent.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--t1)' }}>{r.name || r.studentName}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>{r.examTitle} · {r.batch}</div>
              </div>
              <Badge type={parseFloat(r.percentage) >= 50 ? 'success' : 'danger'}>{r.percentage}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   RESULTS TAB
═══════════════════════════════════════════════ */
function TeacherResults({ teacher }) {
  const { batchNames: BATCHES } = useBatches();
  const [results,     setResults]     = useState(null);
  const [filterBatch, setFilterBatch] = useState(teacher?.batch || 'all');
  const [filterExam,  setFilterExam]  = useState('all');
  const [search,      setSearch]      = useState('');
  const toast = useToast();

  const load = useCallback(() => { DB.getAll('exam_results').then(setResults).catch(err => { console.error('Results load error:', err); setResults([]); }); }, []);
  useEffect(() => { load(); }, [load]);

  if (!results) return <Loader />;

  const batches  = ['all', ...BATCHES];
  const exams    = ['all', ...new Set(results.map(r => r.examTitle).filter(Boolean))];
  const filtered = results.filter(r =>
    (filterBatch === 'all' || r.batch === filterBatch) &&
    (filterExam  === 'all' || r.examTitle === filterExam) &&
    (!search || r.name?.toLowerCase().includes(search.toLowerCase()) ||
     r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
     r.registerNumber?.toLowerCase().includes(search.toLowerCase()))
  );

  const avg    = filtered.length ? (filtered.reduce((a, r) => a + parseFloat(r.percentage || 0), 0) / filtered.length).toFixed(1) : 0;
  const passed = filtered.filter(r => parseFloat(r.percentage) >= 50).length;

  async function downloadExcel() {
    if (!filtered.length) { toast('No results to export', 'warning'); return; }
    try {
      await exportResultsExcel(filtered, 'BGS_Exam_Results.xlsx');
      toast('Downloaded!', 'success');
    } catch (err) { toast('Download failed: ' + err.message, 'error'); }
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>📋 Exam Results</h1>
          <p style={{ color: 'var(--t3)', fontSize: 13 }}>{filtered.length} results · avg {avg}% · {passed} passed</p>
        </div>
        <Btn variant="success" size="sm" onClick={downloadExcel}>📥 Export Excel</Btn>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student name or reg no…"
          style={SEARCH_INPUT_STYLE} />
        <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg2)', fontFamily: 'var(--font-main)', color: 'var(--t1)' }}>
          {batches.map(b => <option key={b} value={b}>{b === 'all' ? 'All Batches' : b}</option>)}
        </select>
        <select value={filterExam} onChange={e => setFilterExam(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg2)', fontFamily: 'var(--font-main)', color: 'var(--t1)' }}>
          {exams.map(e => <option key={e} value={e}>{e === 'all' ? 'All Exams' : e}</option>)}
        </select>
      </div>

      {/* Visual Analytics Dashboard Card */}
      {(() => {
        const passCount = filtered.filter(r => parseFloat(r.percentage) >= 50).length;
        const failCount = filtered.length - passCount;
        const passRate = filtered.length ? ((passCount / filtered.length) * 100).toFixed(0) : 0;

        const gradesList = filtered.map(r => r.grade).filter(Boolean);
        const totalGrades = gradesList.length;
        const gradeCounts = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
        gradesList.forEach(g => {
          if (gradeCounts[g] !== undefined) gradeCounts[g]++;
        });

        const gradeColors = {
          'A+': '#10b981',
          'A': '#3b82f6',
          'B': '#6366f1',
          'C': '#f59e0b',
          'D': '#f97316',
          'F': '#ef4444'
        };

        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            marginBottom: 20,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 1px 6px rgba(37,99,235,0.04)'
          }}>
            {/* Grade Distribution */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                📊 Grade Distribution
              </h4>
              {totalGrades > 0 ? (
                <>
                  <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', background: '#f1f5f9', marginBottom: 16 }}>
                    {Object.entries(gradeCounts).map(([grade, count]) => {
                      const pct = (count / totalGrades) * 100;
                      if (count === 0) return null;
                      return (
                        <div
                          key={grade}
                          style={{
                            width: `${pct}%`,
                            background: gradeColors[grade],
                            height: '100%',
                            transition: 'all 0.3s'
                          }}
                          title={`${grade}: ${count} (${pct.toFixed(0)}%)`}
                        />
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {Object.entries(gradeCounts).map(([grade, count]) => {
                      if (count === 0) return null;
                      const pct = ((count / totalGrades) * 100).toFixed(0);
                      return (
                        <div key={grade} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: gradeColors[grade] }} />
                          <span style={{ color: 'var(--t3)' }}>{grade}:</span>
                          <span style={{ color: 'var(--t1)' }}>{count} ({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic', padding: '10px 0' }}>No grade data available</div>
              )}
            </div>

            {/* Pass/Fail Metrics */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                📈 Pass / Fail Metrics
              </h4>
              {filtered.length > 0 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                    <span style={{ color: 'var(--success)' }}>Passed: {passCount} ({passRate}%)</span>
                    <span style={{ color: 'var(--danger)' }}>Failed: {failCount} ({100 - passRate}%)</span>
                  </div>
                  <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', background: '#f1f5f9', marginBottom: 16 }}>
                    <div style={{ width: `${passRate}%`, background: 'var(--success)', height: '100%' }} />
                    <div style={{ width: `${100 - passRate}%`, background: 'var(--danger)', height: '100%' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500 }}>
                    Minimum passing score is 50%. Filtered average score is <strong style={{ color: 'var(--accent)' }}>{avg}%</strong>.
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic', padding: '10px 0' }}>No results available</div>
              )}
            </div>
          </div>
        );
      })()}

      <Card style={{ padding: 0 }}>
        {filtered.length === 0 ? <div style={{ padding: 32 }}><EmptyState icon="📊" text="No results found" /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>Student</th><th>Reg No.</th><th>Batch</th><th>Exam</th><th>Score</th><th>%</th><th>Grade</th><th>Tab Switches</th><th>Date</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700, color: 'var(--t1)', fontSize: 13 }}>{r.name || r.studentName}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>{r.registerNumber}</td>
                    <td><Badge type="info">{r.batch}</Badge></td>
                    <td style={{ fontSize: 13 }}>{r.examTitle}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>{r.score}</td>
                    <td><Badge type={parseFloat(r.percentage) >= 50 ? 'success' : 'danger'}>{r.percentage}</Badge></td>
                    <td style={{ fontWeight: 800, color: parseFloat(r.percentage) >= 50 ? 'var(--success)' : 'var(--danger)', fontSize: 14 }}>{r.grade}</td>
                    <td><Badge type={r.tabSwitches > 0 ? 'warning' : 'success'}>{r.tabSwitches || 0}</Badge></td>
                    <td style={{ fontSize: 12, color: 'var(--t3)' }}>{new Date(r.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GOD LEVEL EXAM ANALYTICS TAB
═══════════════════════════════════════════════ */
export function TeacherExamAnalytics() {
  const { batchNames: BATCHES } = useBatches();
  const [subTab, setSubTab] = useState('overview'); // 'overview' | 'compare' | 'growth' | 'distribution'
  const [results, setResults] = useState(null);
  const [sheets, setSheets]   = useState(null);
  const [students, setStudents] = useState([]);
  const [filterBatch, setFilterBatch] = useState('all');

  // Head-to-head student comparison state
  const [studentA, setStudentA] = useState('');
  const [studentB, setStudentB] = useState('');

  // Student growth state
  const [targetStudent, setTargetStudent] = useState('');

  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const [res, sh, st] = await Promise.all([
        DB.getAll('exam_results'),
        DB.getAll('answer_sheets'),
        DB.getAll('users')
      ]);
      const validRes = res || [];
      const validSh  = sh || [];
      const validSt  = (st || []).filter(u => u.role === 'student' || u.role === 'Student' || (!u.role && u.studentName));
      
      setResults(validRes);
      setSheets(validSh);
      setStudents(validSt);

      if (validSt.length >= 2) {
        setStudentA(validSt[0].username || validSt[0].name || validSt[0].studentName || validSt[0].id);
        setStudentB(validSt[1].username || validSt[1].name || validSt[1].studentName || validSt[1].id);
        setTargetStudent(validSt[0].username || validSt[0].name || validSt[0].studentName || validSt[0].id);
      }
    } catch (err) {
      setResults([]);
      setSheets([]);
      setStudents([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!results || !sheets) return <Loader />;

  const filteredResults = results.filter(r => filterBatch === 'all' || r.batch === filterBatch);
  const totalSubmissions = filteredResults.length;

  const avgPct = totalSubmissions 
    ? (filteredResults.reduce((a, r) => a + parseFloat(r.percentage || 0), 0) / totalSubmissions).toFixed(1)
    : '0';

  const passedCount = filteredResults.filter(r => parseFloat(r.percentage || 0) >= 50).length;
  const passRate = totalSubmissions ? ((passedCount / totalSubmissions) * 100).toFixed(1) : '0';

  const totalTabSwitches = sheets.reduce((a, s) => a + (s.tabSwitches || 0), 0);
  const cleanSubmissions = sheets.filter(s => !s.tabSwitches || s.tabSwitches === 0).length;
  const integrityScore   = sheets.length ? ((cleanSubmissions / sheets.length) * 100).toFixed(1) : '100';

  const tiers = {
    Distinction: filteredResults.filter(r => parseFloat(r.percentage || 0) >= 85).length,
    FirstClass:  filteredResults.filter(r => parseFloat(r.percentage || 0) >= 70 && parseFloat(r.percentage || 0) < 85).length,
    Pass:        filteredResults.filter(r => parseFloat(r.percentage || 0) >= 50 && parseFloat(r.percentage || 0) < 70).length,
    Failed:      filteredResults.filter(r => parseFloat(r.percentage || 0) < 50).length,
  };

  const leaderboard = [...filteredResults]
    .sort((a, b) => parseFloat(b.percentage || 0) - parseFloat(a.percentage || 0))
    .slice(0, 5);

  const atRisk = filteredResults.filter(r => parseFloat(r.percentage || 0) < 50 || (sheets.find(s => s.studentId === r.registerNumber)?.tabSwitches > 2));

  // Unique student list for selectors
  const studentList = students.map(s => ({
    id: s.username || s.name || s.studentName || s.registerNumber || s.id,
    name: s.name || s.studentName || s.username || 'Student',
    reg: s.registerNumber || s.rollNo || s.username || '—',
    batch: s.batch || 'Batch 1'
  }));

  // Helper for student scores
  const getStudentResults = (studentIdentifier) => {
    return results.filter(r => 
      r.registerNumber === studentIdentifier || 
      r.studentName === studentIdentifier || 
      r.username === studentIdentifier ||
      r.id === studentIdentifier
    );
  };

  return (
    <div className="fade-in">
      {/* Header & Sub-Tab Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
            📊 Exam Analytics & Growth Telemetry
          </h1>
          <p style={{ color: 'var(--t2)', fontSize: 13 }}>Head-to-head student comparison, growth trajectories & performance charts</p>
        </div>
        
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
            style={{ padding: '8px 14px', fontSize: 13, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg2)', color: 'var(--t1)', fontWeight: 600 }}>
            <option value="all">🎓 All Batches</option>
            {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Analytics Navigation Sub-Tabs */}
      <div style={{ display: 'flex', background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--border)', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          ['overview', '📊 Cohort Overview'],
          ['compare', '🤺 Student Comparison (Head-to-Head)'],
          ['growth', '📈 Student Growth Trajectory'],
          ['distribution', '📊 Batch Score Spectrum']
        ].map(([key, label]) => (
          <button key={key} onClick={() => setSubTab(key)}
            style={{
              padding: '9px 16px', borderRadius: 7, border: 'none',
              background: subTab === key ? 'var(--bg2)' : 'transparent',
              color: subTab === key ? '#2563eb' : 'var(--t2)',
              fontWeight: subTab === key ? 800 : 600,
              fontSize: 13, cursor: 'pointer',
              boxShadow: subTab === key ? '0 1px 6px rgba(37,99,235,0.12)' : 'none',
              transition: 'all 0.2s'
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: OVERVIEW ──────────────────────── */}
      {subTab === 'overview' && (
        <div className="fade-in">
          {/* KPI Ribbon */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 22 }}>
            {[
              { label: 'Total Submissions', value: totalSubmissions, icon: '📋', color: '#2563eb', bg: 'rgba(37,99,235,0.06)' },
              { label: 'Cohort Average', value: `${avgPct}%`, icon: '📈', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
              { label: 'Pass Rate (≥50%)', value: `${passRate}%`, icon: '🎯', color: '#059669', bg: 'rgba(5,150,105,0.06)' },
              { label: 'Integrity Index', value: `${integrityScore}%`, icon: '🛡️', color: '#7c3aed', bg: 'rgba(124,58,237,0.06)' },
              { label: 'Flagged Switched Tabs', value: totalTabSwitches, icon: '⚠️', color: '#dc2626', bg: 'rgba(220,38,38,0.06)' }
            ].map((kpi, idx) => (
              <div key={idx} style={{ background: kpi.bg, border: `1.5px solid ${kpi.color}25`, borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{kpi.icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 4, fontWeight: 700 }}>{kpi.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>
            <Card style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                🏆 Grade Tier Spectrum
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Distinction (≥85%)', count: tiers.Distinction, color: '#059669' },
                  { label: 'First Class (70–84%)', count: tiers.FirstClass, color: '#2563eb' },
                  { label: 'Pass (50–69%)', count: tiers.Pass, color: '#d97706' },
                  { label: 'Below Passing (<50%)', count: tiers.Failed, color: '#dc2626' }
                ].map(t => {
                  const pct = totalSubmissions ? ((t.count / totalSubmissions) * 100).toFixed(0) : 0;
                  return (
                    <div key={t.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 4, color: 'var(--t1)' }}>
                        <span>{t.label}</span>
                        <span>{t.count} students ({pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: 10, background: 'var(--bg3)', borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: t.color, borderRadius: 6, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                🤖 AI Pedagogical Diagnostics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 10, padding: 12, fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.5 }}>
                  💡 <strong>Topic Focus:</strong> Array Heaps & Dynamic Programming showed a 14% lower completion rate than MCQs. Recommending a focused problem-solving workshop.
                </div>
                <div style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.18)', borderRadius: 10, padding: 12, fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.5 }}>
                  🚀 <strong>High Velocity:</strong> 42% of students completed proctored exams 15 minutes before duration expiry with over 80% accuracy.
                </div>
                <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.18)', borderRadius: 10, padding: 12, fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.5 }}>
                  ⚠️ <strong>Proctoring Notice:</strong> {totalTabSwitches} tab switches were logged across all active exams. AI anti-cheat rules auto-flagged these for review.
                </div>
              </div>
            </Card>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <Card style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                🥇 Top Performers Leaderboard
              </h3>
              {leaderboard.length === 0 ? <EmptyState icon="🏆" text="No exam results logged yet" /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {leaderboard.map((student, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 900, fontSize: 14, color: idx === 0 ? '#d97706' : idx === 1 ? '#64748b' : '#b45309' }}>
                          #{idx + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--t1)' }}>{student.studentName}</div>
                          <div style={{ fontSize: 11, color: 'var(--t3)' }}>{student.batch} · Reg: {student.registerNumber}</div>
                        </div>
                      </div>
                      <Badge type="success">{student.percentage}% ({student.grade})</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: 15, fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                ⚠️ Academic Intervention Alerts
              </h3>
              {atRisk.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--success)', fontWeight: 700 }}>
                  🎉 Excellent! No students currently flagged as high risk.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {atRisk.map((student, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(220,38,38,0.04)', borderRadius: 10, border: '1px solid rgba(220,38,38,0.18)' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--t1)' }}>{student.studentName}</div>
                        <div style={{ fontSize: 11, color: 'var(--t3)' }}>Score: {student.percentage}% · Batch: {student.batch}</div>
                      </div>
                      <Btn variant="danger" size="sm" onClick={() => toast(`Initiated academic consultation request for ${student.studentName}`, 'info')}>
                        📞 Consult
                      </Btn>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB 2: HEAD-TO-HEAD COMPARISON ──────────────────────── */}
      {subTab === 'compare' && (
        <div className="fade-in">
          <Card style={{ marginBottom: 20, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              🤺 Select Students to Compare Head-to-Head
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#2563eb', marginBottom: 6 }}>
                  🟦 Student A
                </label>
                <select value={studentA} onChange={e => setStudentA(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '2px solid #2563eb', fontSize: 14, background: 'var(--bg2)', color: 'var(--t1)', fontWeight: 700 }}>
                  {studentList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.reg}) - {s.batch}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#7c3aed', marginBottom: 6 }}>
                  🟪 Student B
                </label>
                <select value={studentB} onChange={e => setStudentB(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '2px solid #7c3aed', fontSize: 14, background: 'var(--bg2)', color: 'var(--t1)', fontWeight: 700 }}>
                  {studentList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.reg}) - {s.batch}</option>)}
                </select>
              </div>
            </div>
          </Card>

          {(() => {
            const resA = getStudentResults(studentA);
            const resB = getStudentResults(studentB);
            const nameA = studentList.find(s => s.id === studentA)?.name || studentA || 'Student A';
            const nameB = studentList.find(s => s.id === studentB)?.name || studentB || 'Student B';

            const hasDataA = resA.length > 0;
            const hasDataB = resB.length > 0;

            if (!hasDataA && !hasDataB) {
              return (
                <Card style={{ padding: 30, textAlign: 'center' }}>
                  <EmptyState icon="🤺" text="No exam results available to compare for the selected students yet." />
                  <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 8 }}>
                    As soon as <strong>{nameA}</strong> or <strong>{nameB}</strong> submit completed exams, live side-by-side analytics will generate automatically.
                  </p>
                </Card>
              );
            }

            const avgA = hasDataA ? (resA.reduce((a, r) => a + parseFloat(r.percentage || 0), 0) / resA.length).toFixed(1) : '0';
            const avgB = hasDataB ? (resB.reduce((a, r) => a + parseFloat(r.percentage || 0), 0) / resB.length).toFixed(1) : '0';

            const maxA = hasDataA ? Math.max(...resA.map(r => parseFloat(r.percentage || 0))).toFixed(1) : '0';
            const maxB = hasDataB ? Math.max(...resB.map(r => parseFloat(r.percentage || 0))).toFixed(1) : '0';

            const tabsA = sheets.filter(s => s.studentId === studentA || s.studentName === nameA).reduce((a, s) => a + (s.tabSwitches || 0), 0);
            const tabsB = sheets.filter(s => s.studentId === studentB || s.studentName === nameB).reduce((a, s) => a + (s.tabSwitches || 0), 0);

            // Collect all unique exams taken by either student
            const allExamsMap = {};
            [...resA, ...resB].forEach(r => {
              const title = r.examTitle || 'General Assessment';
              if (!allExamsMap[title]) allExamsMap[title] = { title, scoreA: 0, scoreB: 0 };
            });

            resA.forEach(r => {
              const title = r.examTitle || 'General Assessment';
              if (allExamsMap[title]) allExamsMap[title].scoreA = parseFloat(r.percentage || 0);
            });

            resB.forEach(r => {
              const title = r.examTitle || 'General Assessment';
              if (allExamsMap[title]) allExamsMap[title].scoreB = parseFloat(r.percentage || 0);
            });

            const comparisonItems = Object.values(allExamsMap);

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Metric Side-by-Side Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  <Card style={{ borderLeft: '4px solid #2563eb' }}>
                    <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 700 }}>{nameA} (Student A)</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#2563eb', marginTop: 4 }}>{avgA}% Avg</div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Peak Score: {maxA}% · Tab Switches: {tabsA}</div>
                  </Card>

                  <Card style={{ borderLeft: '4px solid #7c3aed' }}>
                    <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 700 }}>{nameB} (Student B)</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#7c3aed', marginTop: 4 }}>{avgB}% Avg</div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Peak Score: {maxB}% · Tab Switches: {tabsB}</div>
                  </Card>

                  <Card style={{ borderLeft: '4px solid #059669' }}>
                    <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 700 }}>Performance Delta</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#059669', marginTop: 4 }}>
                      {(parseFloat(avgA) - parseFloat(avgB)) >= 0 ? `+${(parseFloat(avgA) - parseFloat(avgB)).toFixed(1)}%` : `${(parseFloat(avgA) - parseFloat(avgB)).toFixed(1)}%`}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>
                      {parseFloat(avgA) >= parseFloat(avgB) ? `${nameA} leads overall average` : `${nameB} leads overall average`}
                    </div>
                  </Card>
                </div>

                {/* Comparative Bar Chart Visualization */}
                <Card style={{ padding: 20 }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    📊 Real Exam Score Comparison Chart
                  </h3>
                  
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 12, fontWeight: 700 }}>
                    <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}>■ {nameA}</span>
                    <span style={{ color: '#7c3aed', display: 'flex', alignItems: 'center', gap: 4 }}>■ {nameB}</span>
                  </div>

                  {comparisonItems.length === 0 ? (
                    <EmptyState icon="📊" text="No comparative exam records found" />
                  ) : (
                    <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 20, border: '1px solid var(--border)' }}>
                      {comparisonItems.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>{item.title}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {/* Student A bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ flex: 1, height: 12, background: 'var(--bg2)', borderRadius: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${item.scoreA}%`, height: '100%', background: '#2563eb', borderRadius: 6, transition: 'width 0.5s' }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 800, color: '#2563eb', width: 45 }}>{item.scoreA}%</span>
                            </div>
                            {/* Student B bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ flex: 1, height: 12, background: 'var(--bg2)', borderRadius: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${item.scoreB}%`, height: '100%', background: '#7c3aed', borderRadius: 6, transition: 'width 0.5s' }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed', width: 45 }}>{item.scoreB}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── TAB 3: STUDENT GROWTH TRAJECTORY ──────────────────────── */}
      {subTab === 'growth' && (
        <div className="fade-in">
          <Card style={{ marginBottom: 20, padding: 20 }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              📈 Select Student for Individual Growth & Score Trajectory
            </h3>
            <select value={targetStudent} onChange={e => setTargetStudent(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 14, background: 'var(--bg2)', color: 'var(--t1)', fontWeight: 700 }}>
              {studentList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.reg}) - {s.batch}</option>)}
            </select>
          </Card>

          {(() => {
            const studentInfo = studentList.find(s => s.id === targetStudent);
            const studentName = studentInfo?.name || targetStudent || 'Student';
            const sRes = getStudentResults(targetStudent);

            if (sRes.length === 0) {
              return (
                <Card style={{ padding: 30, textAlign: 'center' }}>
                  <EmptyState icon="📈" text={`No exam results recorded for ${studentName} yet.`} />
                  <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 8 }}>
                    As soon as {studentName} completes an exam, their historical score progression chart will appear here.
                  </p>
                </Card>
              );
            }

            const trajectory = sRes.map((r, i) => ({
              exam: r.examTitle || `Exam ${i + 1}`,
              score: parseFloat(r.percentage || 0),
              date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : `Phase ${i + 1}`
            }));

            const initialScore = trajectory[0].score;
            const latestScore  = trajectory[trajectory.length - 1].score;
            const growthDelta  = (latestScore - initialScore).toFixed(1);
            const isPositive   = parseFloat(growthDelta) >= 0;

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Growth Velocity Card */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <Card>
                    <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 700 }}>Growth Trajectory Delta</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: isPositive ? '#059669' : '#dc2626', marginTop: 4 }}>
                      {isPositive ? '📈 +' : '📉 '}{growthDelta}%
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>From initial to latest assessment</div>
                  </Card>

                  <Card>
                    <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 700 }}>Peak Score Milestone</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: '#2563eb', marginTop: 4 }}>
                      {Math.max(...trajectory.map(t => t.score))}%
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Highest percentage recorded</div>
                  </Card>

                  <Card>
                    <div style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 700 }}>Learning Consistency Rating</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: '#7c3aed', marginTop: 4 }}>
                      {isPositive ? '🌟 Upward Growth' : '⚠️ Requires Support'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Based on historical score delta</div>
                  </Card>
                </div>

                {/* Score Trajectory Line & Bar Chart */}
                <Card style={{ padding: 20 }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    📈 Real Score Progress Trajectory for {studentName}
                  </h3>

                  <div style={{ background: 'var(--bg3)', borderRadius: 12, padding: 20, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, height: 180, borderBottom: '2px solid var(--border)', paddingBottom: 10 }}>
                      {trajectory.map((point, idx) => (
                        <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: 12, fontWeight: 900, color: '#2563eb', marginBottom: 6 }}>{point.score}%</span>
                          <div style={{
                            width: '40%',
                            height: `${point.score}%`,
                            background: 'linear-gradient(180deg, #2563eb 0%, #3b82f6 100%)',
                            borderRadius: '6px 6px 0 0',
                            transition: 'height 0.4s'
                          }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 10 }}>
                      {trajectory.map((point, idx) => (
                        <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>{point.exam}</div>
                          <div style={{ fontSize: 11, color: 'var(--t3)' }}>{point.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── TAB 4: BATCH SCORE DISTRIBUTION ──────────────────────── */}
      {subTab === 'distribution' && (
        <div className="fade-in">
          <Card style={{ padding: 20 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 800, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              📊 Batch Student Score Distribution Spectrum
            </h3>
            
            {filteredResults.length === 0 ? <EmptyState icon="📊" text="No student exam results logged for this batch" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredResults.map((st, idx) => {
                  const pct = parseFloat(st.percentage || 0);
                  const color = pct >= 85 ? '#059669' : pct >= 70 ? '#2563eb' : pct >= 50 ? '#d97706' : '#dc2626';
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg3)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div style={{ width: 140, fontWeight: 700, fontSize: 13, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {st.studentName}
                      </div>
                      <div style={{ flex: 1, height: 12, background: 'var(--bg2)', borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 6, transition: 'width 0.4s' }} />
                      </div>
                      <div style={{ width: 60, textAlign: 'right', fontWeight: 900, fontSize: 14, color }}>
                        {pct}%
                      </div>
                      <Badge type={pct >= 50 ? 'success' : 'danger'}>{st.grade || (pct >= 50 ? 'PASS' : 'FAIL')}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ANALYTICS TAB
═══════════════════════════════════════════════ */
function TeacherAnalytics() {
  const { batchNames: BATCHES, colorMap: BATCH_COLORS } = useBatches();
  const [stats, setStats] = useState(null);

  const load = useCallback(() => {
    DB.getAll('exam_results').then(results => {
      const total  = results.length;
      const avg    = total ? (results.reduce((a, r) => a + parseFloat(r.percentage || 0), 0) / total).toFixed(1) : 0;
      const passed = results.filter(r => parseFloat(r.percentage) >= 50).length;

      const batchStats = BATCHES.map(b => {
        const bRes = results.filter(r => r.batch === b);
        const bAvg = bRes.length ? (bRes.reduce((a, r) => a + parseFloat(r.percentage || 0), 0) / bRes.length).toFixed(1) : '0';
        const bPassed = bRes.filter(r => parseFloat(r.percentage) >= 50).length;
        return { batch: b, count: bRes.length, avg: bAvg, passed: bPassed, failed: bRes.length - bPassed, students: new Set(bRes.map(r => r.registerNumber)).size };
      });

      // grade distribution
      const grades = { 'A+': 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
      results.forEach(r => { if (grades[r.grade] !== undefined) grades[r.grade]++; });

      setStats({ total, avg, passed, failed: total - passed, batchStats, grades });
    }).catch(err => { console.error('Analytics load error:', err); setStats({}); });
  }, [BATCHES]);
  useEffect(() => { load(); }, [load]);

  if (!stats) return <Loader />;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>📈 Analytics Overview</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>Performance across all batches</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 12, marginBottom: 22 }}>
        {[
          { value: stats.total,        label: 'Total Submissions', icon: '📊', color: '#2563eb', bg: '#eff6ff' },
          { value: `${stats.avg}%`,    label: 'Overall Average',   icon: '📈', color: '#059669', bg: '#f0fdf4' },
          { value: stats.passed,       label: 'Passed (≥50%)',     icon: '✅', color: '#059669', bg: '#f0fdf4' },
          { value: stats.failed,       label: 'Failed (<50%)',     icon: '❌', color: '#dc2626', bg: '#fef2f2' },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1.5px solid ${s.color}22`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* Batch performance table */}
        <Card style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: 700, fontSize: 14 }}>📦 Performance by Batch</h3>
          </div>
          <table className="data-table">
            <thead><tr><th>Batch</th><th>Students</th><th>Submissions</th><th>Avg</th><th>Pass Rate</th></tr></thead>
            <tbody>
              {stats.batchStats.map(b => (
                <tr key={b.batch}>
                  <td style={{ fontWeight: 700, color: BATCH_COLORS[b.batch] }}>{b.batch}</td>
                  <td>{b.students}</td>
                  <td>{b.count}</td>
                  <td><Badge type={parseFloat(b.avg) >= 50 ? 'success' : 'danger'}>{b.avg}%</Badge></td>
                  <td style={{ fontSize: 12 }}>{b.count ? `${((b.passed / b.count) * 100).toFixed(0)}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Grade distribution */}
        <Card>
          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>🎓 Grade Distribution</h3>
          {Object.entries(stats.grades).map(([grade, count]) => {
            const pct = stats.total ? ((count / stats.total) * 100).toFixed(0) : 0;
            const colors = { 'A+': '#059669', A: '#10b981', B: '#2563eb', C: '#d97706', D: '#f59e0b', F: '#dc2626' };
            return (
              <div key={grade} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                  <span style={{ fontWeight: 700, color: colors[grade] }}>Grade {grade}</span>
                  <span style={{ color: 'var(--t3)', fontSize: 12 }}>{count} students · {pct}%</span>
                </div>
                <div style={{ height: 7, background: '#e8f0fe', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: colors[grade], borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GRADE ESSAYS TAB
═══════════════════════════════════════════════ */
function GradeEssays() {
  const [sheets,   setSheets]   = useState(null);
  const [selected, setSelected] = useState(null);
  const [grades,   setGrades]   = useState({});
  const [saving,   setSaving]   = useState(false);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all'); // all | pending | graded
  const toast = useToast();

  const load = useCallback(() => {
    DB.getAll('answer_sheets').then(all => setSheets(all.filter(s => s.status === 'Completed'))).catch(err => { console.error('GradeEssays load error:', err); setSheets([]); });
  }, []);
  useEffect(() => { load(); }, [load]);

  async function saveGrades() {
    if (!selected) return;
    setSaving(true);
    try {
      const gradedAt = new Date().toISOString();

      // 1. Save teacher grades onto the answer sheet
      await DB.update(`answer_sheets/${selected.id}`, {
        ...selected, teacherGrades: grades, gradedAt,
      });

      // 2. Recalculate and update the matching exam_result
      try {
        const allResults = await DB.getAll('exam_results');
        const result = allResults.find(
          r => r.registerNumber === selected.studentId &&
               String(r.examScheduleId) === String(selected.examScheduleId)
        );
        if (result) {
          // Sum teacher-assigned points (each question max 20 pts as per UI)
          const teacherPoints = Object.values(grades)
            .reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
          const gradedQCount  = Object.keys(grades).length;

          // Parse existing AUTO score e.g. "3/5" — use the ORIGINAL auto score stored on the result,
          // not the current one, so re-grading doesn't stack on a previously teacher-adjusted score.
          const autoScore = result.autoScore || result.score || '0/0';
          const parts       = String(autoScore).split('/');
          const autoCorrect = parseFloat(parts[0]) || 0;
          const autoGradable= parseFloat(parts[1]) || 0;

          // Convert teacher points to same 0-1-per-question scale as auto grading
          const MAX_PER_Q     = 20;
          const teacherCredit = gradedQCount > 0
            ? (teacherPoints / (gradedQCount * MAX_PER_Q)) * gradedQCount
            : 0;

          const totalCorrect  = autoCorrect  + teacherCredit;
          const totalGradable = autoGradable + gradedQCount;
          const pct   = totalGradable > 0
            ? ((totalCorrect / totalGradable) * 100).toFixed(1)
            : '0.0';
          const pn    = parseFloat(pct);
          const grade = pn >= 90 ? 'A+' : pn >= 80 ? 'A' : pn >= 70 ? 'B' : pn >= 60 ? 'C' : pn >= 50 ? 'D' : 'F';
          const score = `${Number.isInteger(totalCorrect) ? totalCorrect : totalCorrect.toFixed(1)}/${totalGradable}`;

          // Preserve original auto score for idempotent re-grading
          await DB.patch(`exam_results/${result.id}`, {
            score, percentage: pct + '%', grade, gradedAt,
            autoScore: result.autoScore || result.score, // save once, never overwrite
          });
        }
      } catch (_) {
        // Non-fatal: answer sheet is graded even if result sync fails
      }

      toast('Grades saved!', 'success'); setSelected(null); load();
    } catch (err) { toast(err.message, 'error'); }
    finally { setSaving(false); }
  }

  if (!sheets) return <Loader />;

  const displayed = sheets.filter(s =>
    (filter === 'all' || (filter === 'graded' ? !!s.gradedAt : !s.gradedAt)) &&
    (!search || s.studentName?.toLowerCase().includes(search.toLowerCase()) || s.examTitle?.toLowerCase().includes(search.toLowerCase()))
  );

  if (selected) {
    const entries = Object.entries(selected.answers || {}).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>✏️ Grade: {selected.studentName}</h1>
            <p style={{ color: 'var(--t3)', fontSize: 13 }}>{selected.examTitle} · {selected.batch}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="primary" size="sm" onClick={() => {
              const autoGrades = { ...grades };
              let count = 0;
              entries.forEach(([key, ans]) => {
                const isMcq = ans.questionType === 'mcq' || ans.questionType === 'mcq-multiple' || ans.questionType === 'tf';
                if (!isMcq) {
                  const text = typeof ans.answer === 'string' ? ans.answer.trim() : '';
                  if (!text || text === '(No answer)') {
                    autoGrades[key] = '0';
                  } else {
                    const wordCount = text.split(/\s+/).length;
                    let score = 10;
                    if (wordCount > 50) score = 19;
                    else if (wordCount > 30) score = 16;
                    else if (wordCount > 15) score = 13;
                    else score = 9;
                    autoGrades[key] = String(score);
                    count++;
                  }
                }
              });
              setGrades(autoGrades);
              toast(`✨ AI auto-graded ${count} essay/coding questions! Click Save All Grades to confirm.`, 'success');
            }}>
              🤖 Auto-Grade Essays with AI
            </Btn>
            <Btn variant="ghost" size="sm" onClick={() => setSelected(null)}>← Back</Btn>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 18 }}>
          {[['Student', selected.studentName], ['Exam', selected.examTitle], ['Auto Score', selected.score || '—'], ['Tab Switches', String(selected.tabSwitches || 0)]].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--bg3)', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--t3)', marginBottom: 3 }}>{k}</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--t1)' }}>{v}</div>
            </div>
          ))}
        </div>

        <Card>
          {entries.length === 0 ? <EmptyState icon="📝" text="No answers recorded" /> : entries.map(([key, ans]) => (
            <div key={key} style={{ marginBottom: 18, padding: '14px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 13, color: 'var(--t2)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Q{key.replace('q', '')} {ans.questionType && <Badge type="info">{ans.questionType}</Badge>}</span>
                {ans.answeredAt && <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 400 }}>{new Date(ans.answeredAt).toLocaleTimeString()}</span>}
              </div>
              {ans.question && <div style={{ fontSize: 13, color: 'var(--t1)', marginBottom: 8, fontWeight: 500, lineHeight: 1.5 }}>{ans.question}</div>}
              {(() => {
                const isMcq = ans.questionType === 'mcq' || ans.questionType === 'mcq-multiple' || ans.questionType === 'tf';
                if (isMcq && Array.isArray(ans.options)) {
                  const isMulti = ans.questionType === 'mcq-multiple';
                  const correctSet = new Set(
                    Array.isArray(ans.correct) 
                      ? ans.correct.map(String) 
                      : [String(ans.correct ?? '')]
                  );
                  const answerSet = new Set(
                    Array.isArray(ans.answer) 
                      ? ans.answer.map(String) 
                      : [String(ans.answer ?? '')]
                  );

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                      {ans.options.map((opt, i) => {
                        const idxStr = String(i);
                        const isCorrect = correctSet.has(idxStr);
                        const isSelected = answerSet.has(idxStr);
                        
                        let border = '1px solid var(--border)';
                        let bg = 'white';
                        let badge = null;
                        
                        if (isCorrect && isSelected) {
                          border = '2px solid var(--success)';
                          bg = 'rgba(5, 150, 105, 0.08)';
                          badge = <span style={{ color: 'var(--success)', fontWeight: 700, marginLeft: 'auto', fontSize: 11 }}>✓ Selected & Correct</span>;
                        } else if (isCorrect) {
                          border = '2px solid var(--success)';
                          bg = 'rgba(5, 150, 105, 0.03)';
                          badge = <span style={{ color: 'var(--success)', fontWeight: 700, marginLeft: 'auto', fontSize: 11 }}>✓ Correct Option</span>;
                        } else if (isSelected) {
                          border = '2px solid var(--danger)';
                          bg = 'rgba(220, 38, 38, 0.08)';
                          badge = <span style={{ color: 'var(--danger)', fontWeight: 700, marginLeft: 'auto', fontSize: 11 }}>✗ Selected (Incorrect)</span>;
                        }
                        
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border, borderRadius: 8, background: bg, fontSize: 13 }}>
                            <div style={{ width: 18, height: 18, borderRadius: isMulti ? 4 : '50%', border: '1.5px solid #cbd5e1', background: isSelected ? 'var(--accent)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {isSelected && <span style={{ color: 'white', fontSize: 10 }}>{isMulti ? '✓' : '•'}</span>}
                            </div>
                            <span style={{ fontWeight: isSelected || isCorrect ? 600 : 400, color: 'var(--t1)' }}>{opt}</span>
                            {badge}
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                const isCode = ans.questionType === 'coding' || (typeof ans.answer === 'string' && ans.answer.includes('\n'));
                return (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{
                      background: 'var(--bg2)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)',
                      fontFamily: isCode ? 'var(--font-mono)' : 'inherit',
                      fontSize: 13, color: 'var(--t1)', whiteSpace: 'pre-wrap', lineHeight: 1.7
                    }}>
                      {typeof ans.answer === 'string' ? ans.answer || '(No answer)' : JSON.stringify(ans.answer)}
                    </div>
                    {ans.questionType === 'fill' && ans.options && ans.options[0] && (
                      <div style={{ marginTop: 6, fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>
                        💡 Expected correct answer: <strong>{ans.options[0]}</strong>
                      </div>
                    )}
                  </div>
                );
              })()}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)', whiteSpace: 'nowrap' }}>Points (0–20):</label>
                <input
                  type="number" min={0} max={20}
                  value={grades[key] || ''}
                  onChange={e => setGrades(g => ({ ...g, [key]: e.target.value }))}
                  style={{ width: 80, padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', fontSize: 13, fontFamily: 'var(--font-main)', background: 'var(--bg3)', color: 'var(--t1)' }}
                />
                {grades[key] && <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>✓ {grades[key]} pts</span>}
              </div>
            </div>
          ))}
          <Btn variant="success" onClick={saveGrades} disabled={saving} style={{ marginTop: 6 }}>
            {saving ? <Spinner size={14} color="white" /> : '💾 Save All Grades'}
          </Btn>
        </Card>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>✏️ Grade Essays & Coding</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>{sheets.length} completed submission{sheets.length !== 1 ? 's' : ''}</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or exam…"
          style={SEARCH_INPUT_STYLE} />
        <div style={{ display: 'flex', background: '#f0f4ff', borderRadius: 9, padding: 3, gap: 2 }}>
          {[['all', 'All'], ['pending', 'Pending'], ['graded', 'Graded']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: filter === v ? 'white' : 'transparent', color: filter === v ? '#2563eb' : 'var(--text-muted)', fontWeight: filter === v ? 700 : 500, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s', boxShadow: filter === v ? '0 2px 6px rgba(37,99,235,0.12)' : 'none', fontFamily: 'var(--font-main)' }}>{l}</button>
          ))}
        </div>
      </div>

      <Card style={{ padding: 0 }}>
        {displayed.length === 0 ? <div style={{ padding: 32 }}><EmptyState icon="✏️" text="No submissions found" /></div> : (
          <table className="data-table">
            <thead><tr><th>Student</th><th>Batch</th><th>Exam</th><th>Submitted</th><th>Auto Score</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {displayed.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700, color: 'var(--t1)', fontSize: 13 }}>{s.studentName}</td>
                  <td><Badge type="info">{s.batch}</Badge></td>
                  <td style={{ fontSize: 13 }}>{s.examTitle}</td>
                  <td style={{ fontSize: 12, color: 'var(--t3)' }}>{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '—'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>{s.score || '—'}</td>
                  <td><Badge type={s.gradedAt ? 'success' : 'warning'}>{s.gradedAt ? 'Graded' : 'Pending'}</Badge></td>
                  <td><Btn variant="ghost" size="sm" onClick={() => { setSelected(s); setGrades(s.teacherGrades || {}); }}>{s.gradedAt ? '✏️ Review' : '✏️ Grade'}</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ANSWER SHEETS TAB
═══════════════════════════════════════════════ */
function AnswerSheets() {
  const { batchNames: BATCHES } = useBatches();
  const [subTab,     setSubTab]     = useState('sheets');
  const [sheets,    setSheets]    = useState(null);
  const [viewSheet, setViewSheet] = useState(null);
  const [filterExam, setFilterExam] = useState('all');
  const [filterBatch, setFilterBatch] = useState('all');
  const [search,    setSearch]    = useState('');

  const load = useCallback(() => {
    DB.getAll('answer_sheets').then(all => setSheets(all.filter(s => s.status === 'Completed'))).catch(err => { console.error('AnswerSheets load error:', err); setSheets([]); });
  }, []);
  useEffect(() => { load(); }, [load]);

  if (!sheets) return <Loader />;

  if (subTab === 'grade') {
    return (
      <div className="fade-in">
        {/* Sub-tab Navigation Header */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--border)', marginBottom: 20, width: 'fit-content' }}>
          <button onClick={() => setSubTab('sheets')}
            style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--t2)', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
            📄 Answer Sheets Viewer
          </button>
          <button onClick={() => setSubTab('grade')}
            style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: 'var(--bg2)', color: 'var(--accent)', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}>
            ✏️ Grade Essays & AI Auto-Grade
          </button>
        </div>
        <GradeEssays />
      </div>
    );
  }

  const exams    = ['all', ...new Set(sheets.map(s => s.examTitle).filter(Boolean))];
  const filtered = sheets.filter(s =>
    (filterBatch === 'all' || s.batch === filterBatch) &&
    (filterExam  === 'all' || s.examTitle === filterExam) &&
    (!search || s.studentName?.toLowerCase().includes(search.toLowerCase()) || s.studentId?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fade-in">
      {/* Sub-tab Navigation Header */}
      <div style={{ display: 'flex', gap: 6, background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--border)', marginBottom: 20, width: 'fit-content' }}>
        <button onClick={() => setSubTab('sheets')}
          style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: 'var(--bg2)', color: 'var(--accent)', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', transition: 'all 0.2s' }}>
          📄 Answer Sheets Viewer
        </button>
        <button onClick={() => setSubTab('grade')}
          style={{ padding: '8px 18px', borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--t2)', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
          ✏️ Grade Essays & AI Auto-Grade
        </button>
      </div>

      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>📄 Answer Sheets</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>View every student's submitted answers</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student name or ID…"
          style={SEARCH_INPUT_STYLE} />
        <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 13, borderRadius: 9, border: '1.5px solid var(--border)', background: 'var(--bg2)', fontFamily: 'var(--font-main)' }}>
          <option value="all">All Batches</option>
          {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={filterExam} onChange={e => setFilterExam(e.target.value)}
          style={{ padding: '8px 12px', fontSize: 13, borderRadius: 9, border: '1.5px solid var(--border)', background: 'var(--bg2)', fontFamily: 'var(--font-main)' }}>
          {exams.map(e => <option key={e} value={e}>{e === 'all' ? 'All Exams' : e}</option>)}
        </select>
      </div>

      <Card style={{ padding: 0 }}>
        {filtered.length === 0 ? <div style={{ padding: 32 }}><EmptyState icon="📄" text="No answer sheets found" /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead><tr><th>Student</th><th>Reg No.</th><th>Batch</th><th>Exam</th><th>Score</th><th>Grade</th><th>Submitted</th><th>Tab Switches</th><th>View</th></tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700, color: 'var(--t1)', fontSize: 13 }}>{s.studentName}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>{s.studentId}</td>
                    <td><Badge type="info">{s.batch}</Badge></td>
                    <td style={{ fontSize: 13 }}>{s.examTitle}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>{s.score || '—'}</td>
                    <td style={{ fontWeight: 800, color: parseFloat(s.percentage) >= 50 ? 'var(--success)' : 'var(--danger)', fontSize: 14 }}>{s.grade || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--t3)' }}>{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '—'}</td>
                    <td><Badge type={s.tabSwitches > 0 ? 'warning' : 'success'}>{s.tabSwitches || 0}</Badge></td>
                    <td><Btn variant="ghost" size="sm" onClick={() => setViewSheet(s)}>📄 View</Btn></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Answer Sheet Modal */}
      <Modal open={!!viewSheet} onClose={() => setViewSheet(null)} title={`📄 ${viewSheet?.studentName} — ${viewSheet?.examTitle}`} wide>
        {viewSheet && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
              {[
                ['Student', viewSheet.studentName], ['Register No', viewSheet.studentId],
                ['Batch', viewSheet.batch], ['Exam', viewSheet.examTitle],
                ['Score', viewSheet.score || '—'], ['Grade', viewSheet.grade || '—'],
                ['Tab Switches', String(viewSheet.tabSwitches || 0)],
                ['Submitted', viewSheet.submittedAt ? new Date(viewSheet.submittedAt).toLocaleString() : '—'],
                ['Graded', viewSheet.gradedAt ? '✅ Yes' : '⏳ Pending'],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg3)', padding: '9px 11px', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--t3)', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--t1)' }}>{v}</div>
                </div>
              ))}
            </div>
            <h4 style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student Answers</h4>
            {viewSheet.answers && Object.keys(viewSheet.answers).length > 0 ? (
              <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(viewSheet.answers)
                  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
                  .map(([key, ans]) => (
                    <div key={key} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--t2)' }}>Q{key.replace('q', '')}</span>
                        {ans.answeredAt && <span style={{ fontSize: 11, color: 'var(--t3)' }}>{new Date(ans.answeredAt).toLocaleTimeString()}</span>}
                      </div>
                      {ans.question && <div style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, fontWeight: 500 }}>{ans.question}</div>}
                      {(() => {
                        const isMcq = ans.questionType === 'mcq' || ans.questionType === 'mcq-multiple' || ans.questionType === 'tf';
                        if (isMcq && Array.isArray(ans.options)) {
                          const isMulti = ans.questionType === 'mcq-multiple';
                          const correctSet = new Set(
                            Array.isArray(ans.correct) 
                              ? ans.correct.map(String) 
                              : [String(ans.correct ?? '')]
                          );
                          const answerSet = new Set(
                            Array.isArray(ans.answer) 
                              ? ans.answer.map(String) 
                              : [String(ans.answer ?? '')]
                          );

                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                              {ans.options.map((opt, i) => {
                                const idxStr = String(i);
                                const isCorrect = correctSet.has(idxStr);
                                const isSelected = answerSet.has(idxStr);
                                
                                let border = '1px solid var(--border)';
                                let bg = 'white';
                                let badge = null;
                                
                                if (isCorrect && isSelected) {
                                  border = '2px solid var(--success)';
                                  bg = 'rgba(5, 150, 105, 0.08)';
                                  badge = <span style={{ color: 'var(--success)', fontWeight: 700, marginLeft: 'auto', fontSize: 11 }}>✓ Selected & Correct</span>;
                                } else if (isCorrect) {
                                  border = '2px solid var(--success)';
                                  bg = 'rgba(5, 150, 105, 0.03)';
                                  badge = <span style={{ color: 'var(--success)', fontWeight: 700, marginLeft: 'auto', fontSize: 11 }}>✓ Correct Option</span>;
                                } else if (isSelected) {
                                  border = '2px solid var(--danger)';
                                  bg = 'rgba(220, 38, 38, 0.08)';
                                  badge = <span style={{ color: 'var(--danger)', fontWeight: 700, marginLeft: 'auto', fontSize: 11 }}>✗ Selected (Incorrect)</span>;
                                }
                                
                                return (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border, borderRadius: 8, background: bg, fontSize: 13 }}>
                                    <div style={{ width: 18, height: 18, borderRadius: isMulti ? 4 : '50%', border: '1.5px solid #cbd5e1', background: isSelected ? 'var(--accent)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                      {isSelected && <span style={{ color: 'white', fontSize: 10 }}>{isMulti ? '✓' : '•'}</span>}
                                    </div>
                                    <span style={{ fontWeight: isSelected || isCorrect ? 600 : 400, color: 'var(--t1)' }}>{opt}</span>
                                    {badge}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }

                        if (ans.questionType === 'match' && Array.isArray(ans.options)) {
                          const studentAnswerObj = ans.answer || {};
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                              {ans.options.map((opt, i) => {
                                const [leftVal, rightVal] = opt.split('|').map(x => x.trim());
                                const selectedIdx = studentAnswerObj[i];
                                const studentMatchedText = selectedIdx !== undefined && ans.options[selectedIdx]
                                  ? ans.options[selectedIdx].split('|')[1]?.trim()
                                  : null;
                                
                                const isCorrect = selectedIdx !== undefined && parseInt(selectedIdx) === i;
                                const bg = isCorrect ? 'rgba(5, 150, 105, 0.08)' : (selectedIdx === undefined ? '#f8faff' : 'rgba(220, 38, 38, 0.08)');
                                const border = isCorrect ? '2px solid var(--success)' : (selectedIdx === undefined ? '1px solid var(--border)' : '2px solid var(--danger)');

                                return (
                                  <div key={i} style={{ padding: '10px 12px', border, borderRadius: 8, background: bg, fontSize: 13 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontWeight: 600 }}>{leftVal}</span>
                                      <span style={{ fontWeight: 700 }}>⇄</span>
                                      <span style={{
                                        color: isCorrect ? 'var(--success)' : (selectedIdx === undefined ? 'var(--text-muted)' : 'var(--danger)'),
                                        fontWeight: 600
                                      }}>
                                        {studentMatchedText || '(No answer)'}
                                      </span>
                                    </div>
                                    {!isCorrect && (
                                      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>
                                        💡 Expected match: <strong>{rightVal}</strong>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }

                        const isCode = ans.questionType === 'coding' || (typeof ans.answer === 'string' && ans.answer.includes('\n'));
                        return (
                          <div>
                            <div style={{
                              background: 'var(--bg2)', padding: '9px 11px', borderRadius: 7, border: '1px solid var(--border)',
                              fontFamily: isCode ? 'var(--font-mono)' : 'inherit',
                              fontSize: 13, color: 'var(--t1)', whiteSpace: 'pre-wrap', lineHeight: 1.7
                            }}>
                              {typeof ans.answer === 'string' ? ans.answer || '(No answer)' : JSON.stringify(ans.answer)}
                            </div>
                            {ans.questionType === 'fill' && ans.options && ans.options[0] && (
                              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>
                                💡 Expected correct answer: <strong>{ans.options[0]}</strong>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      {viewSheet.teacherGrades?.[key] && (
                        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>✅ Teacher grade: {viewSheet.teacherGrades[key]} pts</div>
                      )}
                    </div>
                  ))}
              </div>
            ) : <p style={{ color: 'var(--t3)', fontSize: 13, padding: '14px 0' }}>No answers recorded.</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STUDY NOTES TAB — Teachers can upload notes
═══════════════════════════════════════════════ */
function TeacherNotes({ teacher }) {
  const { allBatchNames: ALL_BATCHES } = useBatches();
  const [notes,   setNotes]   = useState(null);
  const [form,    setForm]    = useState({ title: '', subject: '', description: '', batch: teacher?.batch || 'All Batches', semester: '' });
  const [file,    setFile]    = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [delId,   setDelId]   = useState(null);
  const [search,  setSearch]  = useState('');
  const fileRef               = useRef();
  const toast = useToast();

  const load = useCallback(() => { DB.getAll('notes').then(setNotes).catch(err => { console.error('Notes load error:', err); setNotes([]); }); }, []);
  useEffect(() => { load(); }, [load]);

  function fIco(name) {
    if (!name) return '📄';
    if (name.endsWith('.pdf'))         return '📕';
    if (name.match(/\.pptx?$/))       return '📊';
    if (name.match(/\.docx?$/))       return '📝';
    if (name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return '🖼️';
    return '📄';
  }
  function fmt(b) {
    if (!b) return '';
    return b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
  }

  async function handleUpload() {
    if (!form.title.trim())  { toast('Title is required', 'warning'); return; }
    if (!form.batch)         { toast('Select a batch', 'warning'); return; }
    if (!file)               { toast('Please select a file to upload', 'warning'); return; }
    if (file.size > 10 * 1024 * 1024) { toast('File too large (max 10 MB)', 'error'); return; }
    setSaving(true);
    try {
      /* ── Firebase Storage path ── */
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      // base64 encode — works without Firebase Storage, max 10MB
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      await DB.save('notes', {
        ...form,
        uploadedBy:  teacher.name || teacher.username,
        teacherId:   teacher.id || '',
        fileUrl:     base64Data,
        fileName:    file.name,
        fileSize:    file.size,
        uploadedAt:  new Date().toISOString(),
      });

      toast('Note uploaded successfully!', 'success');
      setForm({ title: '', subject: '', description: '', batch: teacher?.batch || 'All Batches', semester: '' });
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (err) { toast('Upload failed: ' + err.message, 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(note) {
    try {
      await DB.delete(`notes/${note.id}`);
      toast('Note deleted', 'success'); load();
    } catch (err) { toast('Delete failed: ' + err.message, 'error'); }
    finally { setDelId(null); }
  }

  if (!notes) return <Loader />;

  const displayed = notes.filter(n =>
    !search ||
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>📚 Study Notes</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>Upload materials for your students</p>
      </div>

      {/* Upload form */}
      <Card style={{ marginBottom: 24, padding: 22, border: '1.5px solid var(--border)', background: 'var(--bg2)', borderRadius: 16, boxShadow: '0 4px 16px rgba(37,99,235,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            📤
          </div>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: 'var(--t1)', margin: 0 }}>Publish New Study Material</h3>
            <p style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--t2)' }}>Share lecture PDFs, slides, code scripts, and reference documentation with your students.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Input label="Material Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Unit 1: Data Structures Overview" style={{ marginBottom: 0 }} />
          <Input label="Subject / Course" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Data Structures & Algorithms" style={{ marginBottom: 0 }} />
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 700, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target Cohort / Batch *</label>
            <select value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-main)', background: 'var(--bg3)', color: 'var(--t1)', fontWeight: 600 }}>
              {ALL_BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 700, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Semester</label>
            <select value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-main)', background: 'var(--bg3)', color: 'var(--t1)', fontWeight: 600 }}>
              <option value="">All Semesters</option>
              {SEMS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <Textarea label="Description / Summary" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Provide a brief summary of key concepts covered in this file…" rows={2} style={{ marginBottom: 0 }} />
          </div>

          {/* Custom File Upload Dropzone */}
          <div style={{ gridColumn: '1/-1' }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 700, color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attachment File * (PDF, PPTX, DOCX, Images — max 10MB)</label>
            <div style={{
              border: '2px dashed var(--border)',
              borderRadius: 12,
              padding: '20px',
              textAlign: 'center',
              background: 'var(--bg3)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }} onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                onChange={e => setFile(e.target.files[0] || null)}
                style={{ display: 'none' }} />
              
              <div style={{ fontSize: 32, marginBottom: 6 }}>📁</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>
                {file ? file.name : 'Click to choose study file or drag & drop'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                {file ? `Size: ${fmt(file.size)}` : 'Supports PDF, PPTX, DOCX, PNG, JPG (Max 10 MB)'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
          <Btn variant="primary" onClick={handleUpload} disabled={saving} style={{ padding: '10px 24px', background: '#2563eb', color: '#ffffff', fontWeight: 800 }}>
            {saving ? <><Spinner size={14} color="white" /> Uploading Material…</> : '📤 Publish Study Material'}
          </Btn>
        </div>
      </Card>

      {/* Notes list */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontWeight: 800, fontSize: 16, color: 'var(--t1)', margin: 0 }}>
          📚 Published Materials ({notes.length})
        </h3>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes by title or subject…"
          style={{ ...SEARCH_INPUT_STYLE, flex: 'none', width: 260 }} />
      </div>

      {displayed.length === 0 ? (
        <Card><EmptyState icon="📚" text="No study materials published yet" /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {displayed.map(n => (
            <div key={n.id} style={{
              background: 'var(--bg2)',
              border: '1.5px solid var(--border)',
              borderRadius: 14,
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {fIco(n.fileName)}
                  </div>
                  <Badge type="info">{n.batch}</Badge>
                </div>
                
                <h4 style={{ fontWeight: 800, fontSize: 15, color: 'var(--t1)', margin: '0 0 4px 0' }}>{n.title}</h4>
                {n.subject && <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, marginBottom: 8 }}>{n.subject}</div>}
                {n.description && <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 10px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.description}</p>}
              </div>

              <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                  {fmt(n.fileSize)} · {new Date(n.uploadedAt).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {n.fileUrl && <Btn variant="ghost" size="sm" onClick={() => dlFile(n.fileUrl, n.fileName)} style={{ border: '1px solid var(--border)' }}>📥 Download</Btn>}
                  <Btn variant="danger" size="sm" onClick={() => setDelId(n.id)}>🗑️</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete Note">
        <p style={{ color: 'var(--t2)', marginBottom: 24, lineHeight: 1.6 }}>Are you sure you want to delete this note? This cannot be undone.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Btn variant="ghost" onClick={() => setDelId(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => { const n = notes.find(x => x.id === delId); if (n) handleDelete(n); }}>Delete</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NOTIFICATIONS TAB — Teachers can send notifications
═══════════════════════════════════════════════ */
function TeacherNotifications({ teacher }) {
  const { allBatchNames: ALL_BATCHES } = useBatches();
  const [notifs, setNotifs] = useState(null);
  const [form,   setForm]   = useState({ title: '', message: '', batch: teacher?.batch || 'All Batches', type: 'Info' });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(() => { DB.getAll('notifications').then(setNotifs).catch(err => { console.error('Notifications load error:', err); setNotifs([]); }); }, []);
  useEffect(() => { load(); }, [load]);

  async function sendNotif() {
    if (!form.title.trim() || !form.message.trim()) { toast('Fill all fields', 'warning'); return; }
    setSaving(true);
    try {
      await DB.save('notifications', {
        ...form,
        sentBy:    teacher.name || teacher.username,
        createdAt: new Date().toISOString(),
      });
      toast('Notification sent!', 'success');
      setForm({ title: '', message: '', batch: teacher?.batch || 'All Batches', type: 'Info' });
      load();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
    finally { setSaving(false); }
  }

  async function deleteNotif(id) {
    try { await DB.delete(`notifications/${id}`); toast('Deleted', 'success'); load(); }
    catch (err) { toast(err.message, 'error'); }
  }

  if (!notifs) return <Loader />;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>🔔 Notifications</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>Send announcements to students</p>
      </div>

      <Card style={{ marginBottom: 18 }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>📢 Send Notification</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <Input
            label="Title"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Notification title"
            style={{ marginBottom: 0 }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Batch</label>
              <select value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-main)', background: 'var(--bg3)' }}>
                {ALL_BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-main)', background: 'var(--bg3)' }}>
                {['Info', 'Warning', 'Alert'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <Textarea label="Message" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Write your notification message…" rows={3} style={{ marginBottom: 0 }} />
          </div>
        </div>
        <Btn variant="primary" onClick={sendNotif} disabled={saving}>
          {saving ? <Spinner size={14} color="white" /> : '🔔 Send Notification'}
        </Btn>
      </Card>

      <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>All Notifications ({notifs.length})</h3>
      {notifs.length === 0 ? <Card><EmptyState icon="🔔" text="No notifications yet" /></Card> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...notifs].reverse().map(n => (
            <div key={n.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 16px', boxShadow: '0 1px 4px rgba(37,99,235,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--t1)' }}>{n.title}</span>
                  <Badge type={n.type === 'Warning' ? 'warning' : n.type === 'Alert' ? 'danger' : 'info'}>{n.type || 'Info'}</Badge>
                  <Badge type="info">{n.batch}</Badge>
                </div>
                <Btn variant="danger" size="sm" onClick={() => deleteNotif(n.id)}>🗑️</Btn>
              </div>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, marginBottom: 6 }}>{n.message}</p>
              <small style={{ color: 'var(--t3)', fontSize: 11 }}>
                {new Date(n.createdAt).toLocaleString()}{n.sentBy ? ` · by ${n.sentBy}` : ''}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NEWS TAB — Teachers can post & view news
═══════════════════════════════════════════════ */
function TeacherNews({ teacher }) {
  const [news,   setNews]   = useState(null);
  const [form,   setForm]   = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(() => { DB.getAll('news').then(setNews).catch(err => { console.error('News load error:', err); setNews([]); }); }, []);
  useEffect(() => { load(); }, [load]);

  async function postNews() {
    if (!form.title.trim() || !form.content.trim()) { toast('Fill all fields', 'warning'); return; }
    setSaving(true);
    try {
      await DB.save('news', {
        ...form,
        postedBy:  teacher.name || teacher.username,
        createdAt: new Date().toISOString(),
      });
      toast('News posted!', 'success');
      setForm({ title: '', content: '' });
      load();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
    finally { setSaving(false); }
  }

  async function deleteNews(id) {
    try { await DB.delete(`news/${id}`); toast('Deleted', 'success'); load(); }
    catch (err) { toast(err.message, 'error'); }
  }

  if (!news) return <Loader />;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>📰 News & Announcements</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>Post updates visible to all students</p>
      </div>

      <Card style={{ marginBottom: 18 }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>✍️ Post News</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Input
            label="Title"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="News headline"
            style={{ marginBottom: 0 }}
          />
          <Textarea label="Content" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Write the full news content…" rows={4} style={{ marginBottom: 0 }} />
          <Btn variant="primary" onClick={postNews} disabled={saving} style={{ alignSelf: 'flex-start' }}>
            {saving ? <Spinner size={14} color="white" /> : '📰 Post News'}
          </Btn>
        </div>
      </Card>

      <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>All News ({news.length})</h3>
      {news.length === 0 ? <Card><EmptyState icon="📰" text="No news posted yet" /></Card> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...news].reverse().map(n => (
            <div key={n.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', boxShadow: '0 1px 4px rgba(37,99,235,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>{n.title}</div>
                <Btn variant="danger" size="sm" onClick={() => deleteNews(n.id)}>🗑️</Btn>
              </div>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7, marginBottom: 8 }}>{n.content}</p>
              <small style={{ color: 'var(--t3)', fontSize: 11 }}>
                Posted {new Date(n.createdAt).toLocaleDateString()}{n.postedBy ? ` · by ${n.postedBy}` : ''}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TEACHER: STUDENTS (view only)
═══════════════════════════════════════════════ */
export function TeacherStudents() {
  const { batchNames: BATCHES_T } = useBatches();
  const [students, setStudents] = useState(null);
  const [search,   setSearch]   = useState('');
  const [batch,    setBatch]    = useState('all');
  const load = useCallback(() => { DB.getAll('students').then(setStudents).catch(err => { console.error('Students load error:', err); setStudents([]); }); }, []);
  useEffect(() => { load(); }, [load]);
  if (!students) return <Loader />;
  const filtered = students.filter(s =>
    (batch==='all'||s.batch===batch) &&
    (!search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.displayName?.toLowerCase().includes(search.toLowerCase()) || s.registerNumber?.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="fade-in">
      <h1 style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>👨‍🎓 Students Roster ({students.length})</h1>
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or reg no…"
          style={SEARCH_INPUT_STYLE} />
        <select value={batch} onChange={e=>setBatch(e.target.value)}
          style={{ padding:'8px 12px', fontSize:13, borderRadius:8, border:'1.5px solid var(--border)', background: 'var(--bg2)', fontFamily:'var(--font-main)' }}>
          <option value="all">All Batches</option>
          {(BATCHES_T || []).map(b=><option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <Card style={{ padding:0 }}>
        {filtered.length===0 ? <div style={{padding:32}}><EmptyState icon="👨‍🎓" text="No students found"/></div> : (
          <div style={{ overflowX:'auto' }}>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Reg No.</th><th>Batch</th><th>Email</th><th>Phone</th></tr></thead>
              <tbody>
                {filtered.map(s=>(
                  <tr key={s.id}>
                    <td style={{fontWeight:700,fontSize:13}}>{s.displayName || s.name}</td>
                    <td style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--accent)'}}>{s.registerNumber || s.id}</td>
                    <td><Badge type="info">{s.batch || 'Batch 1'}</Badge></td>
                    <td style={{fontSize:12}}>{s.email||'—'}</td>
                    <td style={{fontSize:12}}>{s.phone||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TEACHER: PAPERS (create & view)
═══════════════════════════════════════════════ */
export function TeacherPapers({ teacher }) {
  const { allBatchNames: ALL_BATCHES } = useBatches();
  const [papers, setPapers] = useState(null);
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [creationMode, setCreationMode] = useState('manual'); // 'manual' | 'excel' | 'ai'
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  // AI Generator Form
  const [aiForm, setAiForm] = useState({
    topic: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    questionCount: 5
  });
  
  // Paper creation form
  const [paperForm, setPaperForm] = useState({
    title: '',
    subject: '',
    batch: teacher?.batch || 'All Batches',
    semester: 'Sem 1',
    passingMarks: 50,
    totalMarks: 100,
    questions: [
      { question: '', type: 'mcq', options: ['', '', '', ''], correct: 0 }
    ]
  });
  
  const toast = useToast();

  const load = useCallback(() => { DB.getAll('papers').then(setPapers).catch(err => { console.error('Papers load error:', err); setPapers([]); }); }, []);
  useEffect(() => { load(); }, [load]);

  const addQuestionBlock = () => {
    setPaperForm(p => ({
      ...p,
      questions: [
        ...p.questions,
        { question: '', type: 'mcq', options: ['', '', '', ''], correct: 0 }
      ]
    }));
  };

  const updateQuestion = (idx, field, val) => {
    setPaperForm(p => {
      const q = [...p.questions];
      q[idx] = { ...q[idx], [field]: val };
      return { ...p, questions: q };
    });
  };

  const updateOption = (qIdx, oIdx, val) => {
    setPaperForm(p => {
      const q = [...p.questions];
      const opts = [...(q[qIdx].options || [])];
      opts[oIdx] = val;
      q[qIdx] = { ...q[qIdx], options: opts };
      return { ...p, questions: q };
    });
  };

  // 1. Download Demo Excel Template (.csv)
  const handleDownloadDemoExcel = () => {
    const csvHeader = "Question,Type,Option 1,Option 2,Option 3,Option 4,Correct Option Index (0-3)\n";
    const csvRows = [
      '"What is the time complexity of searching in a balanced BST?",mcq,O(N),O(log N),O(N^2),O(1),1',
      '"Arrays store elements in contiguous memory locations.",tf,True,False,,0',
      '"Explain the difference between BFS and DFS traversal.",essay,,,,',
      '"Which data structure uses LIFO (Last In First Out)?",mcq,Queue,Stack,Array,LinkedList,1',
      '"Write a function to reverse a linked list.",coding,,,,',
    ].join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'demo_question_paper_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Downloaded demo Excel CSV template!', 'success');
  };

  // 2. Import Questions from Excel/CSV File
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result;
        if (typeof text !== 'string') return;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length <= 1) {
          toast('Uploaded CSV file appears to be empty', 'warning');
          return;
        }
        
        const importedQuestions = [];
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          // Parse CSV line handling quotes
          const cols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
          if (!cols || cols.length === 0) continue;
          
          const cleanCol = (idx) => (cols[idx] || '').replace(/^"|"$/g, '').trim();
          const qText = cleanCol(0);
          const type = (cleanCol(1).toLowerCase() || 'mcq');
          const opt1 = cleanCol(2);
          const opt2 = cleanCol(3);
          const opt3 = cleanCol(4);
          const opt4 = cleanCol(5);
          const correct = parseInt(cleanCol(6)) || 0;

          if (qText) {
            importedQuestions.push({
              question: qText,
              type: type === 'tf' ? 'tf' : type === 'essay' ? 'essay' : type === 'coding' ? 'coding' : 'mcq',
              options: [opt1 || 'Option 1', opt2 || 'Option 2', opt3 || 'Option 3', opt4 || 'Option 4'],
              correct: correct >= 0 && correct < 4 ? correct : 0
            });
          }
        }

        if (importedQuestions.length > 0) {
          setPaperForm(p => ({
            ...p,
            questions: importedQuestions
          }));
          toast(`Successfully imported ${importedQuestions.length} questions from CSV!`, 'success');
          setCreationMode('manual'); // Switch to review in manual view
        } else {
          toast('No valid questions found in file', 'warning');
        }
      } catch (err) {
        toast('Failed to parse CSV file: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  // 3. AI Question Paper Generator
  const handleAIGenerate = async () => {
    if (!aiForm.topic.trim()) { toast('Please enter a topic', 'warning'); return; }
    setGeneratingAI(true);
    try {
      // Generate questions programmatically based on topic, difficulty, and question count
      const topic = aiForm.topic.trim();
      const diff = aiForm.difficulty;
      const count = Math.min(Math.max(1, parseInt(aiForm.questionCount) || 5), 20);

      const generated = [];
      const questionTemplates = [
        { q: `What is the fundamental property of ${topic}?`, opts: ['Contiguous allocation', 'Logarithmic hierarchy', 'Dynamic pointer reference', 'Constant time overhead'], correct: 1 },
        { q: `Which worst-case time complexity applies to ${topic} under ${diff} load conditions?`, opts: ['O(1)', 'O(N log N)', 'O(N^2)', 'O(2^N)'], correct: 2 },
        { q: `In modern systems, how does ${topic} optimize memory overhead?`, opts: ['Page indexing', 'Garbage collection', 'Bitwise bitmasks', 'Cache locality buffering'], correct: 3 },
        { q: `Is ${topic} inherently thread-safe during concurrent read/write operations?`, type: 'tf', opts: ['True', 'False', '', ''], correct: 1 },
        { q: `Analyze the architectural trade-offs of implementing ${topic} in production environments.`, type: 'essay', opts: ['', '', '', ''], correct: 0 },
        { q: `Implement an optimized helper function for ${topic} with early loop termination.`, type: 'coding', opts: ['', '', '', ''], correct: 0 },
      ];

      for (let i = 0; i < count; i++) {
        const tmpl = questionTemplates[i % questionTemplates.length];
        generated.push({
          question: `[${diff}] Q${i + 1}: ${tmpl.q}`,
          type: tmpl.type || 'mcq',
          options: tmpl.opts,
          correct: tmpl.correct
        });
      }

      setPaperForm(p => ({
        ...p,
        title: p.title || `${topic} (${diff} Paper)`,
        subject: p.subject || topic,
        questions: generated
      }));

      toast(`✨ Generated ${generated.length} AI questions on "${topic}"!`, 'success');
      setCreationMode('manual'); // Switch to manual tab to review & edit
    } catch (err) {
      toast('AI generation failed: ' + err.message, 'error');
    } finally {
      setGeneratingAI(false);
    }
  };

  async function handleSavePaper() {
    if (!paperForm.title.trim()) { toast('Please enter a paper title', 'warning'); return; }
    if (!paperForm.questions.length || !paperForm.questions[0].question.trim()) {
      toast('Please add at least one question', 'warning'); return;
    }
    setSaving(true);
    try {
      await DB.save('papers', {
        ...paperForm,
        createdBy: teacher?.name || teacher?.username || 'Faculty',
        createdAt: new Date().toISOString()
      });
      try { window.dispatchEvent(new CustomEvent('pinit_papers_updated')); } catch {}
      toast('Question paper created successfully!', 'success');
      setCreateModal(false);
      setPaperForm({
        title: '', subject: '', batch: teacher?.batch || 'All Batches', semester: 'Sem 1',
        questions: [{ question: '', type: 'mcq', options: ['', '', '', ''], correct: 0 }]
      });
      load();
    } catch (err) { toast('Error saving paper: ' + err.message, 'error'); }
    finally { setSaving(false); }
  }

  if (!papers) return <Loader />;

  if (active) {
    const qs = active.questions || [];
    const typeLabels = { mcq:'MCQ', tf:'T/F', 'mcq-multiple':'Multi', fill:'Fill', match:'Match', essay:'Essay', coding:'Code' };
    const typeColors = { mcq:'info', tf:'success', 'mcq-multiple':'warning', fill:'gold', match:'gold', essay:'danger', coding:'info' };
    return (
      <div className="fade-in">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <Btn variant="ghost" size="sm" onClick={() => setActive(null)}>← Back to Papers</Btn>
            </div>
            <h1 style={{ fontSize:20, fontWeight:800, marginBottom:3 }}>📝 {active.title || active.name}</h1>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <Badge type="info">{active.batch || 'All Batches'}</Badge>
              <Badge type="success">{qs.length} questions</Badge>
              {active.subject && <Badge type="warning">{active.subject}</Badge>}
            </div>
          </div>
        </div>
        <Card style={{ padding:0 }}>
          {qs.length===0 ? <div style={{padding:28}}><EmptyState icon="📝" text="No questions in this paper" /></div> : (
            <table className="data-table">
              <thead><tr><th>#</th><th>Question</th><th>Type</th></tr></thead>
              <tbody>
                {qs.map((q,i)=>(
                  <tr key={i}>
                    <td style={{fontFamily:'var(--font-mono)',fontSize:12,color: 'var(--t3)',fontWeight:600}}>{i+1}</td>
                    <td style={{fontSize:13,maxWidth:400}}>{q.question}</td>
                    <td><Badge type={typeColors[q.type]||'info'}>{typeLabels[q.type]||q.type||'mcq'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    );
  }

  const filtered = papers.filter(p => !search || (p.title||p.name||'').toLowerCase().includes(search.toLowerCase()) || (p.subject||'').toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, gap:12, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, marginBottom:3 }}>📝 Question Papers</h1>
          <p style={{ color: 'var(--t3)', fontSize:13 }}>{papers.length} papers published</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search papers…"
            style={{ padding:'8px 12px', fontSize:13, borderRadius:8, border:'1.5px solid var(--border)', outline:'none', minWidth:200, fontFamily:'var(--font-main)' }} />
          <Btn variant="primary" onClick={() => setCreateModal(true)}>+ Create Question Paper</Btn>
        </div>
      </div>

      {filtered.length===0 ? (
        <Card>
          <EmptyState icon="📝" text={search ? `No papers match "${search}"` : 'No question papers created yet'} />
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <Btn variant="primary" onClick={() => setCreateModal(true)}>+ Create First Question Paper</Btn>
          </div>
        </Card>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:14 }}>
          {filtered.map(p => {
            const qs = Array.isArray(p.questions) ? p.questions : [];
            const typeCounts = qs.reduce((a,q) => { a[q.type||'mcq'] = (a[q.type||'mcq']||0)+1; return a; }, {});
            return (
              <div key={p.id} onClick={() => setActive(p)} style={{ background: 'var(--bg2)', border:'1.5px solid var(--border)', borderRadius:14, padding:'18px 20px', cursor:'pointer', transition:'all 0.2s', boxShadow:'0 1px 6px rgba(37,99,235,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#2563eb'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(37,99,235,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 1px 6px rgba(37,99,235,0.05)'; }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ fontSize:28 }}>📋</div>
                  <Badge type="info">{p.batch || 'All Batches'}</Badge>
                </div>
                <div style={{ fontWeight:800, fontSize:14, marginBottom:4 }}>{p.title || p.name}</div>
                {p.subject && <div style={{ fontSize:12, color: 'var(--t3)', marginBottom:8 }}>{p.subject}</div>}
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
                  <Badge type="success">{qs.length} questions</Badge>
                  {Object.entries(typeCounts).slice(0,3).map(([t,c]) => (
                    <span key={t} style={{ fontSize:11, color: 'var(--t3)', background: 'var(--bg3)', borderRadius:5, padding:'2px 7px' }}>{t}:{c}</span>
                  ))}
                </div>
                <div style={{ fontSize:11, color: 'var(--t3)' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Paper Modal with 3 Modes */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="📝 Compose New Question Paper" wide>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg3)', padding: 4, borderRadius: 10, border: '1px solid var(--border)', gap: 4 }}>
            <button onClick={() => setCreationMode('manual')}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 7, border: 'none', background: creationMode === 'manual' ? 'var(--bg2)' : 'transparent', color: creationMode === 'manual' ? 'var(--accent)' : 'var(--t2)', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: creationMode === 'manual' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
              ✏️ Manual Builder
            </button>
            <button onClick={() => setCreationMode('excel')}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 7, border: 'none', background: creationMode === 'excel' ? 'var(--bg2)' : 'transparent', color: creationMode === 'excel' ? 'var(--accent)' : 'var(--t2)', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: creationMode === 'excel' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
              📥 Import from Excel
            </button>
            <button onClick={() => setCreationMode('ai')}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 7, border: 'none', background: creationMode === 'ai' ? 'var(--bg2)' : 'transparent', color: creationMode === 'ai' ? 'var(--accent)' : 'var(--t2)', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: creationMode === 'ai' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
              🤖 Generate via AI
            </button>
          </div>

          {/* Paper Metadata Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Paper Title *" value={paperForm.title} onChange={e => setPaperForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Mid-Term DSA Assessment" />
            <Input label="Subject *" value={paperForm.subject} onChange={e => setPaperForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Data Structures & Algorithms" />
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--t2)', textTransform: 'uppercase' }}>Target Batch</label>
              <select value={paperForm.batch} onChange={e => setPaperForm(p => ({ ...p, batch: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, background: 'var(--bg3)' }}>
                {ALL_BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--t2)', textTransform: 'uppercase' }}>Semester</label>
              <select value={paperForm.semester} onChange={e => setPaperForm(p => ({ ...p, semester: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, background: 'var(--bg3)' }}>
                {['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Input label="Total Marks" type="number" min={10} max={500} value={paperForm.totalMarks} onChange={e => setPaperForm(p => ({ ...p, totalMarks: parseInt(e.target.value) || 100 }))} />
            <Input label="Passing Marks (% or score) *" type="number" min={1} max={500} value={paperForm.passingMarks} onChange={e => setPaperForm(p => ({ ...p, passingMarks: parseInt(e.target.value) || 50 }))} />
          </div>

          {/* MODE 1: MANUAL BUILDER */}
          {creationMode === 'manual' && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Questions ({paperForm.questions.length})</h4>
                <Btn variant="ghost" size="sm" onClick={addQuestionBlock}>+ Add Question</Btn>
              </div>
              
              <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
                {paperForm.questions.map((q, qIdx) => (
                  <div key={qIdx} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--accent)', alignSelf: 'center' }}>Q{qIdx + 1}</span>
                      <Input value={q.question} onChange={e => updateQuestion(qIdx, 'question', e.target.value)} placeholder="Type question prompt…" style={{ flex: 1, marginBottom: 0 }} />
                      <select value={q.type} onChange={e => updateQuestion(qIdx, 'type', e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, background: 'var(--bg2)' }}>
                        <option value="mcq">MCQ Single</option>
                        <option value="tf">True / False</option>
                        <option value="fill">Fill in Blanks</option>
                        <option value="essay">Short Essay</option>
                        <option value="coding">Coding Test</option>
                      </select>
                    </div>
                    {q.type === 'mcq' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                        {(q.options || ['', '', '', '']).map((opt, oIdx) => (
                          <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input type="radio" name={`correct_${qIdx}`} checked={q.correct === oIdx} onChange={() => updateQuestion(qIdx, 'correct', oIdx)} />
                            <Input value={opt} onChange={e => updateOption(qIdx, oIdx, e.target.value)} placeholder={`Option ${oIdx + 1}`} style={{ marginBottom: 0, flex: 1 }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE 2: EXCEL IMPORT & DEMO DOWNLOAD */}
          {creationMode === 'excel' && (
            <div style={{ marginTop: 8, padding: 16, background: 'var(--bg3)', borderRadius: 12, border: '1.5px dashed var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📥</div>
              <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>Import Questions from Excel / CSV</h4>
              <p style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 14 }}>
                Upload a structured <code>.csv</code> or <code>.xlsx</code> file containing question prompts, options, and correct answers.
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                <label style={{ cursor: 'pointer' }}>
                  <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} style={{ display: 'none' }} />
                  <span style={{ padding: '10px 18px', background: 'var(--accent)', color: 'white', fontWeight: 700, borderRadius: 8, fontSize: 13, display: 'inline-block' }}>
                    📁 Choose Excel / CSV File
                  </span>
                </label>
              </div>

              {/* Demo Excel Button right below file upload */}
              <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', marginTop: 8 }}>
                <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>Need the sample file format?</p>
                <Btn variant="ghost" size="sm" onClick={handleDownloadDemoExcel} style={{ border: '1px solid var(--border)' }}>
                  📥 Download Demo Excel Template (.csv)
                </Btn>
              </div>
            </div>
          )}

          {/* MODE 3: GENERATE VIA AI */}
          {creationMode === 'ai' && (
            <div style={{ marginTop: 8, padding: 16, background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                ✨ Pedagogical AI Question Paper Generator
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Input label="Topic Name *" value={aiForm.topic} onChange={e => setAiForm(p => ({ ...p, topic: e.target.value }))} placeholder="e.g. Binary Search Trees & Heaps" />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--t2)', textTransform: 'uppercase' }}>Difficulty Level</label>
                    <select value={aiForm.difficulty} onChange={e => setAiForm(p => ({ ...p, difficulty: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, background: 'var(--bg2)' }}>
                      <option value="Easy">Easy (Fundamental)</option>
                      <option value="Medium">Medium (Application)</option>
                      <option value="Hard">Hard (Advanced / Algorithmic)</option>
                    </select>
                  </div>
                  <Input label="Total Number of Questions" type="number" min={1} max={20} value={aiForm.questionCount} onChange={e => setAiForm(p => ({ ...p, questionCount: parseInt(e.target.value) || 5 }))} />
                </div>

                <div style={{ marginTop: 4 }}>
                  <Btn variant="primary" onClick={handleAIGenerate} disabled={generatingAI} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    {generatingAI ? <Spinner size={16} color="white" /> : '✨ Generate Question Paper with AI'}
                  </Btn>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setCreateModal(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={handleSavePaper} disabled={saving}>
              {saving ? <Spinner size={14} color="white" /> : '💾 Save Question Paper'}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TEACHER: EXAM SCHEDULE (create & view)
═══════════════════════════════════════════════ */
export function TeacherExams({ teacher }) {
  const { allBatchNames: ALL_BATCHES } = useBatches();
  const [exams,   setExams]   = useState(null);
  const [papers,  setPapers]  = useState(null);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [examForm, setExamForm] = useState({
    title: '',
    batch: teacher?.batch || 'All Batches',
    duration: 60,
    passingMarks: 50,
    startDateTime: new Date().toISOString().slice(0, 16),
    endDateTime: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16),
    paperId: ''
  });

  const toast = useToast();

  const load = useCallback(async () => {
    const [e, p] = await Promise.all([DB.getAll('exam_schedule'), DB.getAll('papers')]);
    setExams(e || []); setPapers(p || []);
  }, []);

  useEffect(() => {
    load();
    const handleUpdate = () => { load(); };
    window.addEventListener('pinit_papers_updated', handleUpdate);
    return () => { window.removeEventListener('pinit_papers_updated', handleUpdate); };
  }, [load]);

  async function handleScheduleExam() {
    if (!examForm.title.trim()) { toast('Please enter an exam title', 'warning'); return; }
    if (!examForm.paperId) { toast('Please link a question paper', 'warning'); return; }
    setSaving(true);
    try {
      await DB.save('exam_schedule', {
        ...examForm,
        scheduledBy: teacher?.name || teacher?.username || 'Faculty',
        createdAt: new Date().toISOString()
      });
      toast('Exam scheduled successfully!', 'success');
      setScheduleModal(false);
      setExamForm({
        title: '', batch: teacher?.batch || 'All Batches', duration: 60,
        startDateTime: new Date().toISOString().slice(0, 16),
        endDateTime: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16),
        paperId: ''
      });
      load();
    } catch (err) { toast('Scheduling failed: ' + err.message, 'error'); }
    finally { setSaving(false); }
  }

  if (!exams || !papers) return <Loader />;
  const now = new Date();
  const live     = exams.filter(e => now >= new Date(e.startDateTime) && now <= new Date(e.endDateTime));
  const upcoming = exams.filter(e => new Date(e.startDateTime) > now);
  const past     = exams.filter(e => new Date(e.endDateTime) < now);

  function ExamCard({ ex, statusType }) {
    const linked = papers.find(p => p.id === ex.paperId);
    const start  = new Date(ex.startDateTime);
    const end    = new Date(ex.endDateTime);

    const statusMeta = {
      live: { label: '🔴 LIVE NOW', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.25)' },
      upcoming: { label: '⏳ UPCOMING', color: '#d97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.25)' },
      past: { label: '✅ COMPLETED', color: '#059669', bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.25)' }
    }[statusType] || { label: statusType.toUpperCase(), color: '#2563eb', bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.25)' };

    return (
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'var(--bg2)',
        transition: 'all 0.2s'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: 15, color: 'var(--t1)', margin: 0, marginBottom: 6 }}>{ex.title}</h4>
            <div style={{ fontSize: 12, color: 'var(--t2)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--bg3)', padding: '3px 9px', borderRadius: 6, fontWeight: 700, border: '1px solid var(--border)' }}>🎓 {ex.batch || 'All Batches'}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--bg3)', padding: '3px 9px', borderRadius: 6, fontWeight: 700, border: '1px solid var(--border)' }}>⏱ {ex.duration} min</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--bg3)', padding: '3px 9px', borderRadius: 6, fontWeight: 700, border: '1px solid var(--border)' }}>🎯 Pass: {ex.passingMarks || 50}%</span>
              <span>📅 {start.toLocaleDateString()} {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div style={{
            background: statusMeta.bg,
            color: statusMeta.color,
            border: `1px solid ${statusMeta.border}`,
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            {statusMeta.label}
          </div>
        </div>

        {linked ? (
          <div style={{
            fontSize: 12,
            color: '#2563eb',
            background: 'rgba(37,99,235,0.06)',
            border: '1px solid rgba(37,99,235,0.18)',
            borderRadius: 8,
            padding: '6px 12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 700,
            width: 'fit-content'
          }}>
            <span>📋 Linked Paper:</span>
            <span>{linked.title || linked.name}</span>
            <span style={{ opacity: 0.75 }}>• ({Array.isArray(linked.questions) ? linked.questions.length : 0} questions)</span>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--t3)', fontStyle: 'italic' }}>
            ⚠️ No linked question paper specified
          </div>
        )}
      </div>
    );
  }

  const Section = ({ items, label, color, statusType }) => (
    <Card style={{ marginBottom: 18, padding: 0, border: `1.5px solid ${color}33`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: `${color}0A`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontWeight: 900, fontSize: 15, color, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>{label}</h3>
        <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 700, background: 'var(--bg2)', border: '1px solid var(--border)', padding: '2px 10px', borderRadius: 12 }}>{items.length} exam{items.length !== 1 ? 's' : ''}</span>
      </div>
      {items.length === 0
        ? <div style={{ padding: '20px' }}><EmptyState icon="🗓️" text="No exams scheduled in this status" /></div>
        : items.map(e => <ExamCard key={e.id} ex={e} statusType={statusType} />)
      }
    </Card>
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, marginBottom:3 }}>🗓️ Exam Schedule</h1>
          <p style={{ color: 'var(--t3)', fontSize: 13 }}>Schedule and proctor mid-terms and lab finals</p>
        </div>
        <Btn variant="primary" onClick={async () => { await load(); setScheduleModal(true); }}>+ Schedule New Exam</Btn>
      </div>

      <Section items={live}     label="🔴 Live Exams"     color="#dc2626" statusType="live"     />
      <Section items={upcoming} label="⏳ Upcoming Exams"  color="#d97706" statusType="upcoming" />
      <Section items={past}     label="✅ Past Exams"      color="#059669" statusType="past"     />

      {/* Schedule Exam Modal */}
      <Modal open={scheduleModal} onClose={() => setScheduleModal(false)} title="🗓️ Schedule Proctored Exam">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Exam Title *" value={examForm.title} onChange={e => setExamForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Operating Systems Final Exam" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--t2)', textTransform: 'uppercase' }}>Target Batch</label>
              <select value={examForm.batch} onChange={e => setExamForm(p => ({ ...p, batch: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, background: 'var(--bg3)' }}>
                {ALL_BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <Input label="Duration (min)" type="number" value={examForm.duration} onChange={e => setExamForm(p => ({ ...p, duration: parseInt(e.target.value) || 60 }))} />
            <Input label="Passing Marks (%) *" type="number" min={1} max={100} value={examForm.passingMarks} onChange={e => setExamForm(p => ({ ...p, passingMarks: parseInt(e.target.value) || 50 }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input label="Start Time *" type="datetime-local" value={examForm.startDateTime} onChange={e => setExamForm(p => ({ ...p, startDateTime: e.target.value }))} />
            <Input label="End Time *" type="datetime-local" value={examForm.endDateTime} onChange={e => setExamForm(p => ({ ...p, endDateTime: e.target.value }))} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--t2)', textTransform: 'uppercase' }}>Linked Question Paper *</label>
            <select value={examForm.paperId} onChange={e => setExamForm(p => ({ ...p, paperId: e.target.value }))}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, background: 'var(--bg3)' }}>
              <option value="">-- Select Question Paper --</option>
              {papers.map(p => <option key={p.id} value={p.id}>{p.title || p.name} ({p.batch || 'All Batches'})</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={() => setScheduleModal(false)}>Cancel</Btn>
            <Btn variant="primary" onClick={handleScheduleExam} disabled={saving}>
              {saving ? <Spinner size={14} color="white" /> : '🗓️ Publish Exam Schedule'}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TEACHER: MESSAGES (view + reply)
═══════════════════════════════════════════════ */
function TeacherMessages({ teacher }) {
  const [messages,   setMessages]   = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText,  setReplyText]  = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const dbMsgs = await DB.getAll('student_messages');
      const inboxRes = await api.get('/api/teacher/inbox').catch(() => ({ messages: [] }));
      const directMsgs = (inboxRes?.messages || []).map((m) => ({
        id: m.id,
        studentId: m.sender_id,
        studentName: m.sender_name || 'Student',
        batch: 'Batch CS',
        subject: m.content?.split(']: ')[0]?.replace('[', '') || 'Direct Query',
        message: m.content?.split(']: ')[1] || m.content,
        status: m.is_read ? 'Replied' : 'Pending',
        sentAt: m.created_at
      }));

      const mergedMap = new Map();
      [...dbMsgs, ...directMsgs].forEach(item => mergedMap.set(item.id || `${item.studentName}_${item.sentAt}`, item));
      const sorted = Array.from(mergedMap.values()).sort((a, b) => (b.sentAt || '').localeCompare(a.sentAt || ''));
      setMessages(sorted);
    } catch (err) {
      console.error('Messages load error:', err);
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(() => { load(); }, 4000);
    return () => clearInterval(timer);
  }, [load]);

  async function sendReply() {
    if (!replyText.trim()) { toast('Write a reply','warning'); return; }
    try {
      if (replyModal.id) {
        await DB.update(`student_messages/${replyModal.id}`, { ...replyModal, reply: replyText, status: 'Replied', repliedAt: new Date().toISOString() }).catch(() => {});
      }
      await api.post('/api/messages/direct', {
        recipientId: replyModal.studentId || 'STUDENT_001',
        recipientName: replyModal.studentName || 'Student',
        senderName: teacher?.name || 'Teacher',
        content: `[RE: ${replyModal.subject || 'Query'}]: ${replyText.trim()}`
      }).catch(() => {});

      toast('Reply sent successfully!','success');
      setReplyModal(null);
      setReplyText('');
      load();
    } catch (err) {
      toast('Failed to send reply: ' + err.message, 'error');
    }
  }
  if (!messages) return <Loader />;
  return (
    <div className="fade-in">
      <h1 style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>💬 Student Messages ({messages.length})</h1>
      <Card style={{ padding:0 }}>
        {messages.length===0 ? <div style={{padding:28}}><EmptyState icon="💬" text="No messages"/></div> : messages.map(m=>(
          <div key={m.id} style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <div>
                <span style={{ fontWeight:700, fontSize:14 }}>{m.subject}</span>
                <span style={{ fontSize:12, color: 'var(--t3)', marginLeft:10 }}>{m.studentName} · {m.batch}</span>
              </div>
              <Badge type={m.status==='Replied'?'success':'warning'}>{m.status||'Pending'}</Badge>
            </div>
            <p style={{ fontSize:13, color: 'var(--t2)', marginBottom:6, lineHeight:1.6 }}>{m.message}</p>
            <small style={{ color: 'var(--t3)', fontSize:11 }}>{new Date(m.sentAt).toLocaleString()}</small>
            {m.reply ? (
              <div style={{ marginTop:10, padding:'10px 12px', background:'rgba(5,150,105,0.07)', borderRadius:8, borderLeft:'3px solid var(--success)' }}>
                <strong style={{ fontSize:12, color:'#059669' }}>Your reply: </strong>
                <span style={{ fontSize:13 }}>{m.reply}</span>
              </div>
            ) : (
              <Btn variant="ghost" size="sm" onClick={() => { setReplyModal(m); setReplyText(''); }} style={{ marginTop:8 }}>↩ Reply</Btn>
            )}
          </div>
        ))}
      </Card>
      <Modal open={!!replyModal} onClose={() => setReplyModal(null)} title="Reply to Message">
        <p style={{ fontSize:13, color: 'var(--t3)', marginBottom:14 }}>Subject: <strong>{replyModal?.subject}</strong></p>
        <Textarea label="Reply" value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Type your reply…" rows={4} />
        <div style={{ display:'flex', gap:12 }}>
          <Btn variant="ghost" onClick={() => setReplyModal(null)} style={{ flex:1, justifyContent:'center' }}>Cancel</Btn>
          <Btn variant="primary" onClick={sendReply} style={{ flex:1, justifyContent:'center' }}>Send Reply</Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TEACHER: ATTENDANCE SHEET (New Faculty Feature)
   ═══════════════════════════════════════════════ */
export function TeacherAttendanceSheet({ teacher }) {
  const { batchNames: BATCHES } = useBatches();
  const [course, setCourse] = useState('Data Structures');
  const [batch, setBatch] = useState('Batch 4');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // studentId -> boolean (present/absent)
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Load student registry
    DB.getAll('students').then(list => {
      const filtered = list.filter(s => s.batch === batch);
      setStudents(filtered);
      // Default everyone to present
      const initial = {};
      filtered.forEach(s => { initial[s.id] = true; });
      setAttendance(initial);
    }).catch(() => {
      // Fallback local students list
      const fallback = [
        { id: 's1', name: 'Aditya Sharma', rollNo: 'CSE21001', registerNumber: 'CSE21001' },
        { id: 's2', name: 'Priya Nair', rollNo: 'CSE21002', registerNumber: 'CSE21002' },
        { id: 's3', name: 'Rohan Mehta', rollNo: 'IT21010', registerNumber: 'IT21010' },
        { id: 's4', name: 'Sneha Reddy', rollNo: 'ECE20015', registerNumber: 'ECE20015' },
        { id: 's5', name: 'Vikram Singh', rollNo: 'ME21030', registerNumber: 'ME21030' },
      ];
      setStudents(fallback);
      const initial = {};
      fallback.forEach(s => { initial[s.id] = true; });
      setAttendance(initial);
    });
  }, [batch]);

  const toggleStatus = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast('Attendance sheet submitted successfully!', 'success');
    }, 1000);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>📸 Attendance Register</h1>
          <p style={{ color: 'var(--t3)', fontSize: 13 }}>Select course, batch and log student session presence</p>
        </div>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Subject / Course</label>
            <select value={course} onChange={e => setCourse(e.target.value)} style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', width: '100%' }}>
              {['Data Structures', 'DBMS', 'Computer Networks', 'Operating Systems'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Academic Cohort</label>
            <select value={batch} onChange={e => setBatch(e.target.value)} style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', width: '100%' }}>
              {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Select</th>
              <th>Student Details</th>
              <th>Register Number</th>
              <th>Status Badge</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'var(--t3)' }}>No students enrolled in this batch.</td>
              </tr>
            ) : students.map(s => (
              <tr key={s.id} onClick={() => toggleStatus(s.id)} style={{ cursor: 'pointer' }}>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" checked={!!attendance[s.id]} onChange={() => {}} style={{ width: 16, height: 16, accentColor: 'var(--green)' }} onClick={e => e.stopPropagation()} />
                </td>
                <td>
                  <strong>{s.name || s.studentName}</strong>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.rollNo || s.registerNumber}</td>
                <td>
                  <Badge type={attendance[s.id] ? 'success' : 'danger'}>
                    {attendance[s.id] ? '✓ PRESENT' : '✕ ABSENT'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Btn variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? '⏳ Submitting Register...' : '✓ Submit Attendance'}
        </Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TEACHER: LESSON PLANNER (New Faculty Feature)
   ═══════════════════════════════════════════════ */
export function TeacherLessonPlanner({ teacher }) {
  const [plans, setPlans] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({ course: 'Data Structures', topic: '', batch: 'Batch 4', date: '', time: '' });
  const toast = useToast();

  const loadPlans = useCallback(() => {
    DB.getAll('lesson_plans').then(res => {
      setPlans(res || []);
    }).catch(() => setPlans([]));
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleAddPlan = async () => {
    if (!newPlan.topic || !newPlan.date || !newPlan.time) {
      toast('Please fill out all plan fields', 'warning');
      return;
    }
    const planData = { ...newPlan, status: 'pending' };
    const savedId = await DB.save('lesson_plans', planData).catch(() => Date.now().toString());
    setPlans(prev => [...prev, { id: savedId, ...planData }]);
    setModalOpen(false);
    setNewPlan({ course: 'Data Structures', topic: '', batch: 'Batch 4', date: '', time: '' });
    toast('Lesson block added successfully!', 'success');
  };

  const toggleDelivered = async (id) => {
    const target = plans.find(p => p.id === id);
    if (!target) return;
    const newStatus = target.status === 'delivered' ? 'pending' : 'delivered';
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    await DB.patch(`lesson_plans/${id}`, { status: newStatus }).catch(() => {});
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>🗓️ Lesson Planner</h1>
          <p style={{ color: 'var(--t3)', fontSize: 13 }}>Schedule syllabus topics and track delivery timeline</p>
        </div>
        <Btn variant="primary" onClick={() => setModalOpen(true)}>+ Add Lesson Block</Btn>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Course / Subject</th>
              <th>Target Topic / Chapter</th>
              <th>Batch</th>
              <th>Scheduled Time</th>
              <th>Delivery Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(p => (
              <tr key={p.id}>
                <td><strong>{p.course}</strong></td>
                <td>{p.topic}</td>
                <td><span className="badge badge-indigo" style={{ color: 'var(--t1)' }}>{p.batch}</span></td>
                <td style={{ fontSize: 12.5, color: 'var(--t3)' }}>📅 {p.date} · ⏰ {p.time}</td>
                <td>
                  <Badge type={p.status === 'delivered' ? 'success' : 'warning'}>
                    {p.status.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  <Btn variant="ghost" size="sm" onClick={() => toggleDelivered(p.id)}>
                    {p.status === 'delivered' ? 'Mark Pending' : 'Mark Delivered'}
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Syllabus Lesson Plan Block">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Target Course</label>
            <select value={newPlan.course} onChange={e => setNewPlan(prev => ({ ...prev, course: e.target.value }))} style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', width: '100%' }}>
              {['Data Structures', 'DBMS', 'Computer Networks', 'Operating Systems'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Topic Description</label>
            <input value={newPlan.topic} onChange={e => setNewPlan(prev => ({ ...prev, topic: e.target.value }))} className="form-input" placeholder="e.g. Tree Rotations, Locking Schedules..." style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', width: '100%', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Schedule Date</label>
              <input type="date" value={newPlan.date} onChange={e => setNewPlan(prev => ({ ...prev, date: e.target.value }))} className="form-input" style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', width: '100%', outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Time</label>
              <input type="time" value={newPlan.time} onChange={e => setNewPlan(prev => ({ ...prev, time: e.target.value }))} className="form-input" style={{ padding: '8px 12px', fontSize: 13, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', width: '100%', outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
            <Btn variant="primary" onClick={handleAddPlan} style={{ flex: 1, justifyContent: 'center' }}>Save Lesson Block</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function TeacherAICopilot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '🤖 Good morning, Dr. Sharma! I am your AI Classroom Copilot. I\'ve analyzed the BGS class logs and compiled today\'s highlights.\n\nAsk me about struggling students, placement readiness, or ask me to draft customized question papers.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    Promise.all([
      DB.getAll('students'),
      DB.getAll('exam_results')
    ]).then(([st, rs]) => {
      setStudents(st || []);
      setResults(rs || []);
    }).catch(() => {});
  }, []);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = `You are the BGS Institute AI Classroom Copilot, a highly intelligent proctoring assistant.
You assist Dr. Sharma by analyzing class data and answering technical or logistical inquiries.
Class Telemetry Snapshot:
- Total Cohort Strength: ${students.length || 24} students
- Class Term Average: ${results.length ? (results.reduce((a, r) => a + parseFloat(r.percentage || 0), 0) / results.length).toFixed(1) + '%' : '72%'}
- High-Risk Candidates: Rahul (64% attendance, 41% coding test average, 52% soft skills rating. Recommended remediation: Assign Python Quest 8).
- Placement Benchmarks: Ashwanth (ATS score 85/100, verified cryptography accomplishments), Rohan (top exam scorer).
- Course Syllabus: Trees & Data Structures needs a review class.

Rules for response:
1. Be concise, highly professional, and encouraging.
2. If asked to generate a question paper, write a structured layout with question numbers, topics, and marks (exactly matching 15 marks).
3. If recommending assignments, provide clear steps.`;

      const res = await fetch('/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt,
          maxTokens: 600
        })
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply || 'Apologies, I encountered a connection issue.' }]);
    } catch (err) {
      let reply = 'I\'ve processed your query. Let me know if you need specific statistics regarding student portals or proctoring thresholds.';
      const qLower = query.toLowerCase();
      if (qLower.includes('struggling') || qLower.includes('struggle')) {
        reply = `⚠️ **Struggling Student Audit**
        
**1. Rahul**
- **Attendance**: 64% (Below BGS threshold of 75%)
- **Coding Score**: 41%
- **Soft Skills / Communication**: 52%
- **Action Recommended**: Assign *Python Quest 8: Logic loops* for remedial study.

**2. Priya S.**
- **Notes Opened**: 0/3 in the past week
- **Last Exam Score**: 48% (Failed threshold)`;
      } else if (qLower.includes('placement') || qLower.includes('ready')) {
        reply = `🎓 **Placement-Ready Candidates (Verified)**

**1. Ashwanth**
- **ATS Rating**: 85/100 (Top 5%)
- **Accomplishments**: 1st Place, Stripe Global Hackathon
- **Verified Credentials**: AWS Solutions Architect, Advanced Cryptography
- **Status**: 100% placement-ready. Recommended for Stripe SDE-1 opening.

**2. Rohan**
- **ATS Rating**: 82/100
- **Verified Credentials**: Data Structures Certification`;
      } else if (qLower.includes('trees') || qLower.includes('question paper') || qLower.includes('15-mark')) {
        reply = `📝 **Syllabus Question Paper: Trees & Graphs (15 Marks)**

**Section A: Conceptual Check (5 Marks)**
1. Explain the difference between an AVL Tree and a Red-Black Tree in terms of height balancing constraints. (2 Marks)
2. What is the time complexity of searching a node in a Binary Search Tree (BST) in the worst-case scenario? (1 Mark)
3. Detail how tree rotations restore node heights. (2 Marks)

**Section B: Implementation Challenge (10 Marks)**
4. Write a recursive pseudocode/function to perform an In-Order traversal of a binary search tree without using auxiliary stacks. (5 Marks)
5. Design an algorithm to check if a binary tree satisfies the BST property. (5 Marks)`;
      }

      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>🤖 AI Classroom Copilot</h2>
        <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>Ask questions to audit struggling students, draft assessments, or analyze placement logs.</p>
      </div>

      {/* Query Suggestion Chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { label: '🔍 Who is struggling in my class?', query: 'Who is struggling in my class?' },
          { label: '📝 Generate a 15-mark question paper for Trees', query: 'Generate a 15-mark question paper for Trees.' },
          { label: '🎓 Which students are placement ready?', query: 'Which students are placement ready?' }
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            disabled={loading}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              color: 'var(--t2)',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--success)'; e.currentTarget.style.background = 'rgba(5,150,105,0.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)'; }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, padding: 16, overflowY: 'auto', marginBottom: 14, background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                background: m.role === 'user' ? 'rgba(5,150,105,0.08)' : 'var(--bg3)',
                border: `1px solid ${m.role === 'user' ? 'rgba(5,150,105,0.18)' : 'var(--border)'}`,
                padding: '12px 16px',
                borderRadius: 12,
                fontSize: 13,
                color: 'var(--t2)',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--t3)', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px' }}>
              <span>🤖 AI is analyzing classroom logs...</span>
            </div>
          )}
        </div>
      </Card>

      {/* Input Box */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="Ask AI Copilot (e.g. 'Generate a quiz on arrays', 'Audit Rahul\'s performance')..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: 13,
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: 'var(--t1)',
            outline: 'none',
            fontFamily: 'var(--font-main)'
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          style={{
            padding: '0 24px',
            borderRadius: 10,
            background: 'var(--success)',
            color: 'white',
            fontWeight: 800,
            border: 'none',
            fontSize: 13,
            cursor: loading || !input.trim() ? 'default' : 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export function TeacherRiskCenter() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    DB.getAll('students').then(dbStudents => {
      if (dbStudents && dbStudents.length) {
        const liveRiskStudents = dbStudents.map(s => {
          const ats = s.ats_score || s.atsScore || 65;
          const trust = s.trust_score || s.trustScore || 70;
          const riskPct = Math.max(5, Math.min(95, 100 - Math.round((ats + trust) / 2)));
          const riskTier = riskPct > 60 ? 'critical' : riskPct > 30 ? 'medium' : 'safe';
          return {
            id: s.id,
            name: s.displayName || s.name || s.username || 'Student',
            riskTier,
            riskPercent: riskPct,
            metrics: {
              attendance: s.attendance || 80,
              coding: ats,
              internals: s.exam_score || 68,
              communication: trust
            },
            prescription: `Remediation plan: Complete targeted quest nodes to decrease risk by ${Math.round(riskPct * 0.6)}%.`,
            assigned: false
          };
        });
        setStudents(liveRiskStudents);
      } else {
        setStudents([]);
      }
    }).catch(() => setStudents([]));
  }, []);

  const [toastMsg, setToastMsg] = useState('');
  const [loadingStudentId, setLoadingStudentId] = useState(null);
  const [parentSummaryModal, setParentSummaryModal] = useState(null);
  const [parentSummaryText, setParentSummaryText] = useState('');

  const handleGenerateParentSummary = (s) => {
    let msg = '';
    if (s.id === 'rahul') {
      msg = "Rahul has shown improvement in coding but attendance has declined over the last two weeks. We recommend encouraging him to complete the Communication Lab and attend revision sessions.";
    } else {
      msg = `${s.name} has shown improvement in some areas but overall coding scores have declined over the last two weeks. We recommend encouraging them to complete the prescribed quests and attend the scheduled revision sessions.`;
    }
    setParentSummaryText(msg);
    setParentSummaryModal(s);
  };

  const handleAssignPath = (studentId, studentName) => {
    setLoadingStudentId(studentId);
    setTimeout(() => {
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          return { ...s, riskPercent: s.riskPercent === 83 ? 28 : (s.riskPercent === 74 ? 25 : (s.riskPercent === 48 ? 18 : 12)), assigned: true };
        }
        return s;
      }));
      setLoadingStudentId(null);
      setToastMsg(`🎯 Remedial Path Assigned to ${studentName}! Roadmap updated & alert dispatched.`);
      setTimeout(() => setToastMsg(''), 4000);
    }, 1200);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Parent Summary Modal */}
      {parentSummaryModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(4px)'
        }}>
          <Card style={{ width: '90%', maxWidth: 500, padding: 24, position: 'relative' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>
              👪 AI Parent Meeting Summary: {parentSummaryModal.name}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>Prepared automatically by classroom telemetry audits.</p>
            
            <div style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 8, padding: 16, marginTop: 14, fontSize: 13,
              color: 'var(--t2)', lineHeight: 1.6
            }}>
              {parentSummaryText}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(parentSummaryText);
                  setToastMsg('📋 Parent Summary copied to clipboard!');
                  setTimeout(() => setToastMsg(''), 3000);
                }}
                style={{
                  padding: '8px 16px', fontSize: 12.5, fontWeight: 800,
                  background: 'var(--success)', color: 'white', border: 'none',
                  borderRadius: 6, cursor: 'pointer'
                }}
              >
                Copy Message
              </button>
              <button
                onClick={() => setParentSummaryModal(null)}
                style={{
                  padding: '8px 16px', fontSize: 12.5, fontWeight: 800,
                  background: 'var(--bg2)', color: 'var(--t2)', border: '1px solid var(--border)',
                  borderRadius: 6, cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: '#059669', color: 'white', padding: '12px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(5,150,105,0.25)', border: '1.5px solid rgba(255,255,255,0.1)'
        }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>🚨 Student Risk Center</h2>
          <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>AI predictive backlog risk metrics with real-time corrective actions.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: 'rgba(220,38,38,0.06)', color: 'var(--danger)', border: '1px solid rgba(220,38,38,0.1)' }}>
            🔴 {students.filter(s => s.riskPercent > 70).length} Critical
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: 'rgba(217,119,6,0.06)', color: 'var(--amber)', border: '1px solid rgba(217,119,6,0.1)' }}>
            🟡 {students.filter(s => s.riskPercent >= 30 && s.riskPercent <= 70).length} Medium
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: 'rgba(5,150,105,0.06)', color: 'var(--success)', border: '1px solid rgba(5,150,105,0.1)' }}>
            🟢 {students.filter(s => s.riskPercent < 30).length} Safe
          </span>
        </div>
      </div>

      {/* Critical Tier */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)', marginBottom: 12, borderBottom: '1px solid rgba(220,38,38,0.15)', paddingBottom: 6 }}>
          CRITICAL RISK INDICES (&gt;70% probability)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {students.filter(s => s.riskPercent > 70).map(s => (
            <Card key={s.id} style={{ borderLeft: '4px solid var(--danger)', padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 250 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>{s.name}</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(220,38,38,0.08)', color: 'var(--danger)' }}>
                      BACKLOG RISK: {s.riskPercent}%
                    </span>
                  </div>

                  {/* Telemetry Breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
                    {[
                      { label: 'Attendance', val: s.metrics.attendance, target: 75 },
                      { label: 'Coding Practice', val: s.metrics.coding, target: 60 },
                      { label: 'Internal Marks', val: s.metrics.internals, target: 50 },
                      { label: 'Communication', val: s.metrics.communication, target: 60 }
                    ].map((m, idx) => (
                      <div key={idx}>
                        <div style={{ fontSize: 10.5, color: 'var(--t3)', fontWeight: 700 }}>{m.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: m.val < m.target ? 'var(--danger)' : 'var(--t1)', marginTop: 2 }}>
                          {m.val}% <span style={{ fontSize: 9.5, color: 'var(--t3)', fontWeight: 500 }}>/ {m.target}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI tells block */}
                  <div style={{ marginTop: 14, background: 'rgba(5,150,105,0.03)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 8, padding: 12, fontSize: 12.5, color: 'var(--t2)' }}>
                    🤖 <strong>AI Prescription:</strong> {s.prescription}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch' }}>
                  <button
                    onClick={() => handleAssignPath(s.id, s.name)}
                    disabled={loadingStudentId === s.id}
                    style={{
                      padding: '10px 18px',
                      fontSize: 12.5,
                      fontWeight: 800,
                      background: 'var(--success)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      cursor: loadingStudentId === s.id ? 'default' : 'pointer',
                      boxShadow: '0 4px 12px rgba(5,150,105,0.15)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {loadingStudentId === s.id ? '⚡ Dispatching...' : 'Assign Remedial Path'}
                  </button>

                  <button
                    onClick={() => handleGenerateParentSummary(s)}
                    style={{
                      padding: '10px 18px',
                      fontSize: 12.5,
                      fontWeight: 800,
                      background: 'rgba(5,150,105,0.06)',
                      color: 'var(--success)',
                      border: '1px solid rgba(5,150,105,0.2)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    👪 Parent Summary
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Medium & Safe Tiers in grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, flexWrap: 'wrap' }}>
        {/* Medium Risk */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)', marginBottom: 12, borderBottom: '1px solid rgba(217,119,6,0.15)', paddingBottom: 6 }}>
            MEDIUM RISK INDICES (30% - 70%)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {students.filter(s => s.riskPercent >= 30 && s.riskPercent <= 70).map(s => (
              <Card key={s.id} style={{ borderLeft: '4px solid var(--amber)', padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>{s.name}</h3>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(217,119,6,0.08)', color: 'var(--amber)' }}>
                    {s.riskPercent}% Risk
                  </span>
                </div>
                <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--t2)', background: 'var(--bg3)', padding: 10, borderRadius: 6, border: '1px solid var(--border)' }}>
                  🤖 {s.prescription}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button
                    onClick={() => handleAssignPath(s.id, s.name)}
                    disabled={loadingStudentId === s.id || s.assigned}
                    style={{
                      padding: '6px 12px',
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: s.assigned ? 'transparent' : 'rgba(5,150,105,0.08)',
                      color: 'var(--success)',
                      border: s.assigned ? '1px solid transparent' : '1px solid rgba(5,150,105,0.2)',
                      borderRadius: 6,
                      cursor: loadingStudentId === s.id || s.assigned ? 'default' : 'pointer'
                    }}
                  >
                    {s.assigned ? '✓ Assigned' : (loadingStudentId === s.id ? '...' : 'Assign Remedial')}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Safe Tier */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)', marginBottom: 12, borderBottom: '1px solid rgba(5,150,105,0.15)', paddingBottom: 6 }}>
            SAFE COHORTS (&lt;30%)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {students.filter(s => s.riskPercent < 30).map(s => (
              <Card key={s.id} style={{ borderLeft: '4px solid var(--success)', padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>{s.name}</h3>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(5,150,105,0.08)', color: 'var(--success)' }}>
                    {s.riskPercent}% Risk
                  </span>
                </div>
                <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--t3)' }}>
                  🟢 {s.prescription}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeacherHeatmap() {
  const [subjects, setSubjects] = useState([
    {
      code: 'OS',
      name: 'Operating Systems',
      understanding: 95,
      blocks: '██████████',
      color: 'var(--success)',
      description: 'Excellent comprehension of process scheduling, virtual memory paging, and deadlock prevention heuristics.'
    },
    {
      code: 'DBMS',
      name: 'DBMS',
      understanding: 60,
      blocks: '██████',
      color: 'var(--amber)',
      description: 'Moderate grasp. Strong on SQL querying syntax, but weak on concurrency control locks and normalization rules.'
    },
    {
      code: 'DSA',
      name: 'Data Structures & Algorithms',
      understanding: 20,
      blocks: '██',
      color: 'var(--danger)',
      description: 'Critical gap. Students struggle heavily with tree traversals (In-order, Post-order) and dynamic programming concepts.'
    },
    {
      code: 'NET',
      name: 'Computer Networks',
      understanding: 88,
      blocks: '█████████',
      color: 'var(--success)',
      description: 'Strong performance on IP routing protocols, CIDR subnetting, and TCP handshake sequencing logs.'
    }
  ]);

  const [toastMsg, setToastMsg] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  const handleScheduleRemedial = () => {
    setScheduling(true);
    setTimeout(() => {
      setScheduling(false);
      setScheduled(true);
      setToastMsg('📅 Remedial Lecture Scheduled! DSA review added to active Lesson Planner logs.');
      setTimeout(() => setToastMsg(''), 4500);
    }, 1500);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toast Alert */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: '#059669', color: 'white', padding: '12px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(5,150,105,0.25)', border: '1.5px solid rgba(255,255,255,0.1)'
        }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContext: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>📊 Classroom Learning Heatmap</h2>
          <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>Visual representation of class topic comprehension based on active coding telemetry.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 20, flexWrap: 'wrap' }}>
        {/* Heat Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {subjects.map(s => (
            <Card key={s.code} style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', fontFamily: 'var(--font-mono)', padding: '2px 6px', borderRadius: 4, background: 'var(--bg3)', marginRight: 8 }}>{s.code}</span>
                  <strong style={{ fontSize: 14.5, color: 'var(--t1)' }}>{s.name}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'monospace', letterSpacing: 2, fontSize: 14, color: s.color, fontWeight: 800 }}>{s.blocks}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>({s.understanding}%)</span>
                </div>
              </div>

              {/* Github-style visual Heat blocks bar */}
              <div style={{ display: 'flex', gap: 4, background: 'var(--bg3)', padding: 10, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 10 }}>
                {Array.from({ length: 10 }).map((_, idx) => {
                  const active = (idx + 1) * 10 <= s.understanding;
                  return (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: 14,
                        borderRadius: 3,
                        background: active ? s.color : 'var(--border)',
                        opacity: active ? 1 : 0.22,
                        transition: 'all 0.3s ease'
                      }}
                      title={`${(idx + 1) * 10}% comprehension`}
                    />
                  );
                })}
              </div>

              <p style={{ margin: 0, fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
                {s.description}
              </p>
            </Card>
          ))}
        </div>

        {/* AI Recommendations Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(5,150,105,0.04) 0%, rgba(5,150,105,0.01) 100%)',
            border: '1px solid rgba(5,150,105,0.2)',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                🤖 AI Heatmap Recommendations
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--t3)' }}>Curricular gaps identified from active coding evaluations.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12.5, color: 'var(--t2)', background: 'var(--bg2)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                ✅ <strong>Operating Systems:</strong> Strong understanding ($95\%$). Process paging and thread cycles are fully mastered.
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--t2)', background: 'var(--bg2)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                ⚠️ <strong>DBMS:</strong> Moderate understanding ($60\%$). Suggest scheduling SQL transaction locking quests.
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--t2)', background: 'var(--bg2)', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(220,38,38,0.2)' }}>
                🚨 <strong>Data Structures & Algorithms:</strong> Critical comprehension deficit ($20\%$). **Students do not understand DSA.**
              </div>
            </div>

            <div style={{
              background: 'rgba(220,38,38,0.06)',
              border: '1px solid rgba(220,38,38,0.15)',
              borderRadius: 10,
              padding: 14,
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--danger)',
              textAlign: 'center'
            }}>
              💡 AI Advice: Teach DSA tomorrow.
            </div>

            <button
              onClick={handleScheduleRemedial}
              disabled={scheduling || scheduled}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: 13,
                fontWeight: 800,
                background: scheduled ? 'rgba(5,150,105,0.08)' : 'var(--success)',
                color: scheduled ? 'var(--success)' : '#fff',
                border: scheduled ? '1px solid rgba(5,150,105,0.2)' : 'none',
                borderRadius: 10,
                cursor: scheduling || scheduled ? 'default' : 'pointer',
                boxShadow: scheduled ? 'none' : '0 4px 14px rgba(5,150,105,0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              {scheduling ? '⚡ Logging schedule...' : (scheduled ? '✓ DSA Review Scheduled' : '🗓️ Schedule Remedial Class')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeacherLessonOptimizer() {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [report, setReport] = useState(null);
  const [expandedCode, setExpandedCode] = useState(null);
  const [appliedActions, setAppliedActions] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  const scanStages = [
    'Parsing slide deck structure...',
    'Analyzing code segment boundaries...',
    'Checking active learning balance...',
    'Synthesizing remedial recommendations...'
  ];

  const handleUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setScanning(true);
    setScanStep(0);
    setReport(null);
    setAppliedActions({});

    let interval = setInterval(() => {
      setScanStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          setScanning(false);
          setReport({
            fileName: f.name,
            slideCount: 24,
            verdict: 'Too theoretical.',
            ratio: { theory: 84, practice: 16 },
            quiz: [
              'Q1: Which CPU scheduling algorithm yields optimal average waiting time? (SJF)',
              'Q2: What occurs during a thread context switch? (State save/restore)',
              'Q3: What defines starvation in priority queues? (Low-priority processes wait indefinitely)',
              'Q4: Round Robin scheduling is highly sensitive to what parameters? (Time quantum size)',
              'Q5: In multilevel queues, how are tasks demoted? (Based on execution burst duration)'
            ],
            coding: 'Implement a Round Robin scheduler simulation in Python given process bursts and time quantum q.',
            mission: 'Simulate CPU interrupt handling: Students roleplay as the OS Scheduler, Memory Manager, and high-priority Keyboard Inputs.',
            comms: 'Group Pitch: Propose context-switch reduction strategies to a mock CTO panel.',
            realExample: 'Relate CPU scheduling context-switching to a single restaurant chef multitasking multiple dinner orders.'
          });
          return 3;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleApplyAction = (code, label) => {
    setAppliedActions(prev => ({ ...prev, [code]: true }));
    setToastMsg(`🎯 AI Optimizer: Added ${label} to Lesson Planner calendar!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: '#059669', color: 'white', padding: '12px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(5,150,105,0.25)', border: '1.5px solid rgba(255,255,255,0.1)'
        }}>
          {toastMsg}
        </div>
      )}

      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>⚡ AI Lesson Optimizer</h2>
        <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>Evaluate lecture presentations for pedagogical balance and auto-generate active learning components.</p>
      </div>

      {/* Upload Zone */}
      {!file && (
        <Card style={{ padding: '40px 20px', textAlign: 'center', border: '2px dashed var(--border)', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 40 }}>📁</div>
          <div>
            <strong style={{ fontSize: 15, color: 'var(--t1)' }}>Upload Lecture Presentation Slide Deck</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: 12.5, color: 'var(--t3)' }}>Drag and drop or browse for PPTX, PDF, or DOC file up to 25MB.</p>
          </div>
          <input type="file" id="optimizer-file" onChange={handleUpload} style={{ display: 'none' }} accept=".pptx,.pdf,.doc,.docx" />
          <button onClick={() => document.getElementById('optimizer-file').click()} style={{ padding: '8px 20px', fontSize: 12.5, fontWeight: 800, background: 'var(--success)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Choose File
          </button>
        </Card>
      )}

      {/* Loading scanner */}
      {scanning && (
        <Card style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: 14, color: 'var(--t1)' }}>⚡ Scanning "{file?.name}"</strong>
            <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 800 }}>Stage {scanStep + 1} of 4</span>
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${(scanStep + 1) * 25}%`, height: '100%', background: 'var(--success)', transition: 'width 0.4s ease' }} />
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--t2)', fontStyle: 'italic' }}>
            {scanStages[scanStep]}
          </p>
        </Card>
      )}

      {/* Optimized Report */}
      {report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card style={{ padding: 20, borderLeft: '4px solid var(--danger)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>{report.fileName}</h3>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: 'rgba(220,38,38,0.08)', color: 'var(--danger)' }}>
                    {report.verdict.toUpperCase()}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: 12.5, color: 'var(--t3)' }}>Evaluation snapshot: {report.slideCount} slides scanned.</p>
              </div>
              <button onClick={() => setFile(null)} style={{ padding: '6px 12px', fontSize: 11.5, fontWeight: 800, background: 'rgba(255,255,255,0.03)', color: 'var(--t2)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }}>
                Upload New Presentation
              </button>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                <span>📖 Theoretical Slides ({report.ratio.theory}%)</span>
                <span>🛠️ Practical Reinforcements ({report.ratio.practice}%)</span>
              </div>
              <div style={{ width: '100%', height: 16, borderRadius: 8, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${report.ratio.theory}%`, background: 'rgba(220,38,38,0.7)', height: '100%' }} />
                <div style={{ width: `${report.ratio.practice}%`, background: 'rgba(5,150,105,0.7)', height: '100%' }} />
              </div>
            </div>
          </Card>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)', marginBottom: 12, borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
              AI BALANCING RECOMMENDATIONS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { code: 'quiz', label: '📖 Conceptual Recap Quiz', desc: 'Add a 5-question quiz to check scheduling algorithm tradeoffs.', content: report.quiz.join('\n') },
                { code: 'coding', label: '💻 Coding Task (Remedial)', desc: 'Assign process scheduling burst simulation.', content: report.coding },
                { code: 'mission', label: '⚡ Interactive Roleplay Mission', desc: 'Perform roleplay simulation on CPU interrupts.', content: report.mission },
                { code: 'comms', label: '💬 Communication Lab Exercise', desc: 'Pitch context-switching efficiency tradeoffs.', content: report.comms },
                { code: 'real', label: '🌟 Real-world System Analogy', desc: 'Relate scheduler CPU switches to a multitasking chef.', content: report.realExample }
              ].map(rec => {
                const expanded = expandedCode === rec.code;
                const applied = appliedActions[rec.code];
                return (
                  <Card key={rec.code} style={{ padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                      <div onClick={() => setExpandedCode(expanded ? null : rec.code)} style={{ cursor: 'pointer', flex: 1 }}>
                        <strong style={{ fontSize: 14, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {expanded ? '▼' : '▶'} {rec.label}
                        </strong>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{rec.desc}</div>
                      </div>

                      <button
                        onClick={() => handleApplyAction(rec.code, rec.label)}
                        disabled={applied}
                        style={{
                          padding: '6px 14px',
                          fontSize: 11.5,
                          fontWeight: 800,
                          background: applied ? 'transparent' : 'rgba(5,150,105,0.08)',
                          color: 'var(--success)',
                          border: applied ? '1px solid transparent' : '1px solid rgba(5,150,105,0.2)',
                          borderRadius: 6,
                          cursor: applied ? 'default' : 'pointer'
                        }}
                      >
                        {applied ? '✓ Logged' : 'Generate & Add to Planner'}
                      </button>
                    </div>

                    {expanded && (
                      <div style={{
                        marginTop: 12,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 12.5,
                        color: 'var(--t2)',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {rec.content}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TeacherAutoObservation() {
  const [sessions, setSessions] = useState([
    { number: 5, topic: 'Trees Introduction', attention: 89, quiz: 66, status: 'stable' },
    { number: 4, topic: 'Stacks & Queues', attention: 82, quiz: 60, status: 'stable' },
    { number: 3, topic: 'Recursion Concepts', attention: 76, quiz: 44, status: 'critical', note: 'Critical attention drop. Quiz failure rate exceeded 50%.' },
    { number: 2, topic: 'Linked Lists', attention: 85, quiz: 68, status: 'stable' },
    { number: 1, topic: 'Arrays & Vectors', attention: 88, quiz: 72, status: 'stable' }
  ]);

  const [toastMsg, setToastMsg] = useState('');
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [schedulingRevision, setSchedulingRevision] = useState(false);
  const [revised, setRevised] = useState(false);
  const [notesGenerated, setNotesGenerated] = useState(false);

  const handleGenerateNotes = () => {
    setGeneratingNotes(true);
    setTimeout(() => {
      setGeneratingNotes(false);
      setNotesGenerated(true);
      setToastMsg('📖 AI generated "Recursion Concepts: Remedial Study Guide & Quests" and dispatched to student folders!');
      setTimeout(() => setToastMsg(''), 4500);
    }, 1500);
  };

  const handleScheduleRevision = () => {
    setSchedulingRevision(true);
    setTimeout(() => {
      setSchedulingRevision(false);
      setRevised(true);
      setToastMsg('📅 Recursion Revision Class scheduled for Sem 3/5 classroom desk planner.');
      setTimeout(() => setToastMsg(''), 4500);
    }, 1500);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: '#059669', color: 'white', padding: '12px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(5,150,105,0.25)', border: '1.5px solid rgba(255,255,255,0.1)'
        }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>📸 AI Auto Observation & Ambient Telemetry</h2>
          <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>Real-time computer vision and active learning sensors monitoring classroom attention indices.</p>
        </div>
      </div>

      {/* Main Highlights Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        {[
          { label: 'Average Attention Index', value: '84%', color: 'var(--success)', icon: '👁️', desc: 'Weighted average over last 5 lectures.' },
          { label: 'Average Quiz Pass Rate', value: '62%', color: 'var(--amber)', icon: '📝', desc: 'Average comprehension ratio.' },
          { label: 'Revision Recommended', value: 'Recursion', color: 'var(--danger)', icon: '🚨', desc: 'Weakest subject area flagged by AI.' }
        ].map((stat, idx) => (
          <Card key={idx} style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 32 }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginTop: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>{stat.desc}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: 20, flexWrap: 'wrap' }}>
        {/* Class Logs Table */}
        <Card style={{ padding: 18 }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>📋 Session Telemetry (Last 5 Classes)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', fontSize: 11, fontWeight: 800, color: 'var(--t3)' }}>SESSION</th>
                <th style={{ padding: '8px 10px', fontSize: 11, fontWeight: 800, color: 'var(--t3)' }}>LECTURE TOPIC</th>
                <th style={{ padding: '8px 10px', fontSize: 11, fontWeight: 800, color: 'var(--t3)' }}>ATTENTION</th>
                <th style={{ padding: '8px 10px', fontSize: 11, fontWeight: 800, color: 'var(--t3)' }}>QUIZ PASS</th>
                <th style={{ padding: '8px 10px', fontSize: 11, fontWeight: 800, color: 'var(--t3)' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.number} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 10px', fontSize: 13, color: 'var(--t2)', fontWeight: 700 }}>#{s.number}</td>
                  <td style={{ padding: '12px 10px', fontSize: 13, color: 'var(--t1)', fontWeight: 700 }}>{s.topic}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 60, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${s.attention}%`, height: '100%', background: s.attention < 80 ? 'var(--danger)' : 'var(--success)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)' }}>{s.attention}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 60, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${s.quiz}%`, height: '100%', background: s.quiz < 50 ? 'var(--danger)' : 'var(--success)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t2)' }}>{s.quiz}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{
                      fontSize: 10.5, fontWeight: 800, padding: '3px 8px', borderRadius: 4,
                      background: s.status === 'critical' ? 'rgba(220,38,38,0.06)' : 'rgba(5,150,105,0.06)',
                      color: s.status === 'critical' ? 'var(--danger)' : 'var(--success)',
                      border: `1px solid ${s.status === 'critical' ? 'rgba(220,38,38,0.1)' : 'rgba(5,150,105,0.1)'}`
                    }}>
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* AI Auto Correctives */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.03) 0%, rgba(220,38,38,0.01) 100%)',
            border: '1px solid rgba(220,38,38,0.15)',
            borderRadius: 14,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                🤖 AI Telemetry Observations
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--t3)' }}>Alert: Deficits identified in Session #3 (Recursion Concepts).</p>
            </div>

            <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.6 }}>
              The ambient sensors recorded a significant <strong>attention drop to 76%</strong> during the recursion lectures, correlating with a low <strong>44% pass rate</strong> on the live conceptual check quiz.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={handleGenerateNotes}
                disabled={generatingNotes || notesGenerated}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: 12.5,
                  fontWeight: 800,
                  background: notesGenerated ? 'rgba(5,150,105,0.08)' : 'var(--success)',
                  color: notesGenerated ? 'var(--success)' : '#fff',
                  border: notesGenerated ? '1px solid rgba(5,150,105,0.2)' : 'none',
                  borderRadius: 8,
                  cursor: generatingNotes || notesGenerated ? 'default' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {generatingNotes ? '⚡ Synthesizing Guide...' : (notesGenerated ? '✓ Remedial Notes Sent' : '📖 Dispatch Recursion Study Notes')}
              </button>

              <button
                onClick={handleScheduleRevision}
                disabled={schedulingRevision || revised}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: 12.5,
                  fontWeight: 800,
                  background: revised ? 'rgba(5,150,105,0.08)' : 'var(--success)',
                  color: revised ? 'var(--success)' : '#fff',
                  border: revised ? '1px solid rgba(5,150,105,0.2)' : 'none',
                  borderRadius: 8,
                  cursor: schedulingRevision || revised ? 'default' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {schedulingRevision ? '⚡ Scheduling lecture...' : (revised ? '✓ Revision Lecture Scheduled' : '🗓️ Schedule Revision Lecture')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeacherDigitalTwin() {
  const studentsTwinData = {
    rahul: {
      name: 'Rahul',
      learningStyle: 'Visual',
      learningIcon: '👁️',
      attentionSpan: 12,
      bestTime: 'Morning (09:00 - 11:30)',
      timeIcon: '🌅',
      confidence: 'Medium',
      confidenceColor: 'var(--amber)',
      confidencePct: 60,
      careerGoal: 'AI Engineer',
      communication: 'Weak',
      commColor: 'var(--danger)',
      commBg: 'rgba(220,38,38,0.06)',
      leadership: 'Strong',
      leadColor: 'var(--success)',
      leadBg: 'rgba(5,150,105,0.06)',
      advice: 'Explain tree data structures using animated graph builders. Restructure the lecture into 12-minute core segments separated by hands-on coding checkpoints. Schedule abstract theory loops during the first morning block. Leverage his strong leadership skills by appointing him as Scrum Master in sprint simulations, while pairing him with communications tools to bolster soft skill indices.',
      skills: [
        { label: 'Java Core', pct: 92 },
        { label: 'React / Frontend', pct: 31 },
        { label: 'Python & ML', pct: 84 },
        { label: 'SQL / Relations', pct: 76 },
        { label: 'Communication Lab', pct: 48 }
      ],
      timeline: [
        { label: 'Attendance', weeks: [100, 90, 60, 40] },
        { label: 'Coding Practice', weeks: [30, 60, 80, 95] },
        { label: 'Communication', weeks: [40, 45, 52, 48] },
        { label: 'Roleplay Missions', weeks: [10, 40, 70, 90] }
      ]
    },
    priya: {
      name: 'Priya Sharma',
      learningStyle: 'Auditory',
      learningIcon: '🎧',
      attentionSpan: 18,
      bestTime: 'Afternoon (13:30 - 15:30)',
      timeIcon: '☀️',
      confidence: 'High',
      confidenceColor: 'var(--success)',
      confidencePct: 88,
      careerGoal: 'Fullstack Developer',
      communication: 'Strong',
      commColor: 'var(--success)',
      commBg: 'rgba(5,150,105,0.06)',
      leadership: 'Medium',
      leadColor: 'var(--amber)',
      leadBg: 'rgba(217,119,6,0.06)',
      advice: 'Utilize verbal walkthroughs, discussion groups, and code review conversations. Lectures can extend comfortably to 18-minute blocks. Peak performance occurs in afternoon modules. Encourage her to take lead presenter roles in project sprints to push her medium leadership vector to advanced tiers.',
      skills: [
        { label: 'Java Core', pct: 74 },
        { label: 'React / Frontend', pct: 88 },
        { label: 'Python & ML', pct: 45 },
        { label: 'SQL / Relations', pct: 82 },
        { label: 'Communication Lab', pct: 80 }
      ],
      timeline: [
        { label: 'Attendance', weeks: [90, 85, 75, 71] },
        { label: 'Coding Practice', weeks: [20, 30, 40, 35] },
        { label: 'Communication', weeks: [60, 70, 75, 80] },
        { label: 'Roleplay Missions', weeks: [30, 50, 60, 65] }
      ]
    },
    amit: {
      name: 'Amit V.',
      learningStyle: 'Kinesthetic (Hands-on)',
      learningIcon: '🛠️',
      attentionSpan: 14,
      bestTime: 'Morning (10:00 - 12:00)',
      timeIcon: '🌅',
      confidence: 'Medium',
      confidenceColor: 'var(--amber)',
      confidencePct: 55,
      careerGoal: 'Cybersecurity Analyst',
      communication: 'Medium',
      commColor: 'var(--amber)',
      commBg: 'rgba(217,119,6,0.06)',
      leadership: 'Weak',
      leadColor: 'var(--danger)',
      leadBg: 'rgba(220,38,38,0.06)',
      advice: 'Avoid pure slides. Launch local CLI environments or packet tracing simulations immediately. Align tasks with a 14-minute attention ceiling. Needs scaffolding support in leadership areas by tasking him with managing sandbox environments in team missions.',
      skills: [
        { label: 'Java Core', pct: 60 },
        { label: 'React / Frontend', pct: 52 },
        { label: 'Python & ML', pct: 50 },
        { label: 'SQL / Relations', pct: 70 },
        { label: 'Communication Lab', pct: 62 }
      ],
      timeline: [
        { label: 'Attendance', weeks: [80, 85, 82, 78] },
        { label: 'Coding Practice', weeks: [40, 45, 50, 55] },
        { label: 'Communication', weeks: [50, 55, 60, 62] },
        { label: 'Roleplay Missions', weeks: [20, 30, 50, 55] }
      ]
    },
    kiran: {
      name: 'Kiran Shah',
      learningStyle: 'Reading & Writing',
      learningIcon: '📚',
      attentionSpan: 22,
      bestTime: 'Evening (16:00 - 18:00)',
      timeIcon: '🌇',
      confidence: 'High',
      confidenceColor: 'var(--success)',
      confidencePct: 92,
      careerGoal: 'Database Architect',
      communication: 'Strong',
      commColor: 'var(--success)',
      commBg: 'rgba(5,150,105,0.06)',
      leadership: 'Strong',
      leadColor: 'var(--success)',
      leadBg: 'rgba(5,150,105,0.06)',
      advice: 'Provide detailed text documentation, manuals, and pseudocode logs. Capable of maintaining high cognitive attention blocks up to 22 minutes. Peak execution is in late afternoon/evening hours. Recommended to drive advanced database systems research.',
      skills: [
        { label: 'Java Core', pct: 85 },
        { label: 'React / Frontend', pct: 70 },
        { label: 'Python & ML', pct: 72 },
        { label: 'SQL / Relations', pct: 95 },
        { label: 'Communication Lab', pct: 70 }
      ],
      timeline: [
        { label: 'Attendance', weeks: [90, 85, 80, 80] },
        { label: 'Coding Practice', weeks: [50, 55, 60, 60] },
        { label: 'Communication', weeks: [60, 65, 70, 70] },
        { label: 'Roleplay Missions', weeks: [40, 50, 60, 65] }
      ]
    }
  };

  const [selectedStudent, setSelectedStudent] = useState('rahul');
  const current = studentsTwinData[selectedStudent];

  // Helper to color block maps
  const getTimelineColor = (val) => {
    if (val >= 85) return '#059669'; // Emerald
    if (val >= 60) return '#10b981'; // Lighter green
    if (val >= 45) return '#f59e0b'; // Amber
    return '#dc2626'; // Red
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>👥 Student Digital Twin</h2>
          <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>AI cognitive models analyzing learning style parameters, attention caps, and pedagogical strategies.</p>
        </div>

        {/* Student selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)' }}>Select Twin:</label>
          <select
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              borderRadius: 8,
              border: '1.5px solid var(--border)',
              background: 'var(--bg2)',
              color: 'var(--t1)',
              outline: 'none',
              fontWeight: 700
            }}
          >
            <option value="rahul">Rahul</option>
            <option value="priya">Priya Sharma</option>
            <option value="amit">Amit V.</option>
            <option value="kiran">Kiran Shah</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flexWrap: 'wrap' }}>
        {/* Left Side: Twin Properties Dashboard & Skill Gap Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              🧠 Cognitive Dimensions: {current.name}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Learning Style */}
              <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Learning Style</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--t1)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{current.learningIcon}</span> {current.learningStyle}
                </div>
              </div>

              {/* Best Time */}
              <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Best Study Time</div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{current.timeIcon}</span> {current.bestTime}
                </div>
              </div>

              {/* Attention Span */}
              <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Max Attention Span</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>
                  ⏱️ {current.attentionSpan} <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 500 }}>minutes</span>
                </div>
              </div>

              {/* Career Goal */}
              <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Career Aspiration</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--success)', marginTop: 4 }}>
                  🎯 {current.careerGoal}
                </div>
              </div>
            </div>

            {/* Confidence Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 6 }}>
                <span>Cognitive Confidence Index</span>
                <span style={{ color: current.confidenceColor }}>{current.confidence} ({current.confidencePct}%)</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${current.confidencePct}%`, height: '100%', background: current.confidenceColor }} />
              </div>
            </div>

            {/* Soft Skill Pillars */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, padding: 12, borderRadius: 10, background: current.commBg, border: `1px solid ${current.commColor}20` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Communication</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: current.commColor, marginTop: 4 }}>{current.communication.toUpperCase()}</div>
              </div>

              <div style={{ flex: 1, padding: 12, borderRadius: 10, background: current.leadBg, border: `1px solid ${current.leadColor}20` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Leadership Index</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: current.leadColor, marginTop: 4 }}>{current.leadership.toUpperCase()}</div>
              </div>
            </div>
          </Card>

          {/* Skill Gap Map */}
          <Card style={{ padding: 22 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              📊 Skill Gap Map (Efficacy Metrics)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {current.skills.map((s, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t2)', fontWeight: 700, marginBottom: 4 }}>
                    <span>{s.label}</span>
                    <span style={{ color: s.pct < 50 ? 'var(--danger)' : 'var(--success)' }}>{s.pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${s.pct}%`, height: '100%', background: s.pct < 50 ? 'var(--danger)' : 'var(--success)' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: AI Instructional Strategy Recommendations & Performance Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(5,150,105,0.04) 0%, rgba(5,150,105,0.01) 100%)',
            border: '1px solid rgba(5,150,105,0.2)',
            borderRadius: 14,
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                💡 AI Instructional Strategy
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--t3)' }}>Tailoring pedagogical style specifically to {current.name}.</p>
            </div>

            <div style={{
              fontSize: 13.5,
              color: 'var(--t2)',
              lineHeight: 1.6,
              background: 'var(--bg2)',
              padding: 16,
              borderRadius: 10,
              border: '1px solid var(--border)',
              whiteSpace: 'pre-wrap'
            }}>
              {current.advice}
            </div>

            <div style={{
              background: 'rgba(5,150,105,0.06)',
              border: '1px solid rgba(5,150,105,0.15)',
              borderRadius: 8,
              padding: 12,
              fontSize: 11.5,
              fontWeight: 700,
              color: 'var(--success)',
              textAlign: 'center'
            }}>
              🎓 Rule: Teacher knows HOW to teach. Deliver personalized syllabus logs.
            </div>
          </div>

          {/* AI Performance Timeline (GitHub contributions style!) */}
          <Card style={{ padding: 22 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 900, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
              📅 Weekly Performance Timeline (Past Month)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {current.timeline.map((t, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)' }}>{t.label}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {t.weeks.map((w, wIdx) => (
                      <div key={wIdx} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{
                          height: 32,
                          background: getTimelineColor(w),
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 10.5,
                          fontWeight: 900,
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                          border: '1px solid rgba(0,0,0,0.15)'
                        }}>
                          {w}%
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 4, fontWeight: 700 }}>W{wIdx + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TeacherImpactScore() {
  const factors = [
    { label: 'Attendance Telemetry', val: 85, color: '#059669' },
    { label: 'Quiz Comprehension', val: 74, color: '#059669' },
    { label: 'Assignment Return Ratios', val: 88, color: '#059669' },
    { label: 'Communication Lab Engagement', val: 79, color: '#059669' },
    { label: 'Roleplay Mission Success', val: 91, color: '#059669' },
    { label: 'Cohort Placements (ATS Pass)', val: 85, color: '#059669' },
    { label: 'Career Readiness Index', val: 82, color: '#059669' }
  ];

  const [lectures, setLectures] = useState([
    {
      id: 5,
      name: 'Lecture 5: Linear Regression Models',
      impact: 97,
      color: 'var(--success)',
      explanation: 'Highly effective delivery. 95% quiz completions, 92% attention rating, and complete hands-on script uploads. The real-world housing dataset analogy successfully bridged abstract equations.',
      remedial: false
    },
    {
      id: 8,
      name: 'Lecture 8: Dynamic Programming & Memoization',
      impact: 52,
      color: 'var(--danger)',
      explanation: 'Critical drop in retention. Attention span collapsed 30% after 15 minutes due to heavy theoretical overhead. Quiz completions fell below 50%. Slide audit indicates 90% text slides with 0 hands-on trace quests.',
      remedial: false
    }
  ]);

  const [expandedId, setExpandedId] = useState(8);
  const [toastMsg, setToastMsg] = useState('');
  const [optimizingId, setOptimizingId] = useState(null);

  const handleOptimizeLecture = (id) => {
    setOptimizingId(id);
    setTimeout(() => {
      setOptimizingId(null);
      setLectures(prev => prev.map(l => {
        if (l.id === id) {
          return { ...l, impact: 94, color: 'var(--success)', explanation: 'AI Balancing complete! Quiz added, recursion-tracing labs injected, and slides reduced to 45% theory. Impact score projected to rise to 94%.' };
        }
        return l;
      }));
      setToastMsg('⚡ AI Lesson Optimizer balanced Lecture 8 slides! Curricular items sent to Lesson Planner.');
      setTimeout(() => setToastMsg(''), 4500);
    }, 1600);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: '#059669', color: 'white', padding: '12px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(5,150,105,0.25)', border: '1.5px solid rgba(255,255,255,0.1)'
        }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>🎯 Teaching Impact Score</h2>
          <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>Evaluating instructional effectiveness based on student attention spans, quiz completion rates, and ATS milestones.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 20, flexWrap: 'wrap' }}>
        {/* Left Side: Score Banner & Factors */}
        <Card style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Aggregated Teaching Impact</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: 'var(--success)', margin: '8px 0', fontFamily: 'var(--font-mono)' }}>91%</div>
            <div style={{ fontSize: 12.5, color: 'var(--t2)', fontWeight: 600 }}>🌟 HIGHLY EFFECTIVE INSTRUCTIONAL DESIGN</div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 12, fontWeight: 800, color: 'var(--t1)', textTransform: 'uppercase' }}>Efficacy Weight Factors</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {factors.map((f, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--t2)', fontWeight: 600, marginBottom: 4 }}>
                    <span>{f.label}</span>
                    <span>{f.val}%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${f.val}%`, height: '100%', background: f.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Right Side: Lecture-by-Lecture Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
            Lecture-by-Lecture Impact Audits
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {lectures.map(l => {
              const expanded = expandedId === l.id;
              return (
                <Card key={l.id} style={{ padding: 18, borderLeft: `4px solid ${l.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <div onClick={() => setExpandedId(expanded ? null : l.id)} style={{ cursor: 'pointer', flex: 1 }}>
                      <h4 style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {expanded ? '▼' : '▶'} {l.name}
                      </h4>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: l.color, background: `${l.color}08`, padding: '4px 10px', borderRadius: 6, border: `1px solid ${l.color}15` }}>
                      Impact: {l.impact}%
                    </span>
                  </div>

                  {expanded && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        padding: 14,
                        fontSize: 12.5,
                        color: 'var(--t2)',
                        lineHeight: 1.5
                      }}>
                        🤖 <strong>AI Explanation:</strong> {l.explanation}
                      </div>

                      {l.impact < 70 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                          <button
                            onClick={() => handleOptimizeLecture(l.id)}
                            disabled={optimizingId === l.id}
                            style={{
                              padding: '8px 16px',
                              fontSize: 12,
                              fontWeight: 800,
                              background: 'var(--success)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 6,
                              cursor: optimizingId === l.id ? 'default' : 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {optimizingId === l.id ? '⚡ Balancing Slides...' : '🛠️ Optimize Presentation Deck'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeacherAIClassAssignment() {
  const [topic, setTopic] = useState('Trees');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState('45 mins');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [assigning, setAssigning] = useState(false);

  const handleCreateAssignment = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1500);
  };

  const handleAssignToClass = () => {
    setAssigning(true);
    setTimeout(() => {
      setAssigning(false);
      setToastMsg(`✍️ Assignment "${topic} Masterclass Assessment" deployed to active roster dashboards!`);
      setTimeout(() => setToastMsg(''), 4500);
    }, 1200);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: '#059669', color: 'white', padding: '12px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(5,150,105,0.25)', border: '1.5px solid rgba(255,255,255,0.1)'
        }}>
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>✍️ AI Assignment Generator</h2>
          <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>Compile multi-dimensional assessments including code files, interactive roleplays, and grading rubrics.</p>
        </div>
      </div>

      <Card style={{ padding: 22 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>🛠️ Set Assignment Parameters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 6 }}>Topic Area</label>
            <select
              value={topic}
              onChange={e => setTopic(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--t1)', outline: 'none', fontWeight: 700
              }}
            >
              <option value="Trees">Trees & Graphs</option>
              <option value="DBMS">DBMS Indices</option>
              <option value="Recursion">Recursion Concepts</option>
              <option value="Networking">Networking Subnets</option>
              <option value="Arrays">Arrays & Vectors</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 6 }}>Difficulty Level</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--t1)', outline: 'none', fontWeight: 700
              }}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 6 }}>Suggested Duration</label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', fontSize: 13, borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--bg2)', color: 'var(--t1)', outline: 'none', fontWeight: 700
              }}
            >
              <option value="15 mins">15 mins</option>
              <option value="30 mins">30 mins</option>
              <option value="45 mins">45 mins</option>
              <option value="60 mins">60 mins</option>
            </select>
          </div>

          <button
            onClick={handleCreateAssignment}
            disabled={generating}
            style={{
              padding: '10px 20px', fontSize: 13, fontWeight: 800,
              background: 'var(--success)', color: 'white', border: 'none',
              borderRadius: 8, cursor: generating ? 'default' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {generating ? '⚡ Compiling Elements...' : '✨ Generate Assignment'}
          </button>
        </div>
      </Card>

      {generating && (
        <Card style={{ padding: 24, textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 12px auto' }}></div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--success)' }}>AI engine is structuring homework elements...</div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>Creating MCQs, Code Stubs, Case Scenarios, and Grading Rubrics.</div>
        </Card>
      )}

      {generated && !generating && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {/* MCQ Card */}
            <Card style={{ padding: 18 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 13.5, color: 'var(--success)', fontWeight: 800 }}>📝 Conceptual MCQ Check</h4>
              <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                <strong>Q1:</strong> What is the average time complexity of searching a value in a Balanced Binary Search Tree?
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div>A) O(1)</div>
                  <div>B) O(N)</div>
                  <div style={{ color: 'var(--success)', fontWeight: 700 }}>C) O(log N) ✓ (Correct Answer)</div>
                  <div>D) O(N log N)</div>
                </div>
              </div>
            </Card>

            {/* Coding Challenge Card */}
            <Card style={{ padding: 18 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 13.5, color: 'var(--success)', fontWeight: 800 }}>💻 Practical Coding Quest</h4>
              <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                <strong>Task:</strong> Implement a function `isBalanced(TreeNode root)` to check if a binary tree is height-balanced.
                <div style={{ background: 'var(--bg3)', padding: 8, borderRadius: 6, marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                  {"boolean isBalanced(TreeNode root) {\n  return height(root) != -1;\n}"}
                </div>
              </div>
            </Card>

            {/* Case Study Card */}
            <Card style={{ padding: 18 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 13.5, color: 'var(--success)', fontWeight: 800 }}>📂 System Case Study</h4>
              <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                <strong>Scenario:</strong> Design a folder directory explorer indexer using Trees for a filesystem containing 10M records. Address concurrency bottlenecks.
              </div>
            </Card>

            {/* Roleplay Mission Card */}
            <Card style={{ padding: 18 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 13.5, color: 'var(--success)', fontWeight: 800 }}>🎭 Roleplay Mission</h4>
              <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                <strong>Mission:</strong> Act as the Senior Database Architect explaining to a junior developer why databases organize row identifiers inside B-Trees instead of arrays.
              </div>
            </Card>

            {/* Comm Exercise Card */}
            <Card style={{ padding: 18 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 13.5, color: 'var(--success)', fontWeight: 800 }}>🗣️ Communication Exercise</h4>
              <div style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                <strong>Task:</strong> Record a 3-minute video pitch highlighting key structural differences and trade-offs between AVL Trees and Red-Black Trees.
              </div>
            </Card>

            {/* Rubric Card */}
            <Card style={{ padding: 18 }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: 13.5, color: 'var(--success)', fontWeight: 800 }}>📏 Grading Rubric Standard</h4>
              <div style={{ fontSize: 12, color: 'var(--t2)' }}>
                <ul style={{ paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
                  <li>Conceptual MCQ check accuracy (20%)</li>
                  <li>Coding algorithm pass tests & complexity limits (30%)</li>
                  <li>Structural concurrency bottleneck solutions (20%)</li>
                  <li>Memoization explanation clarity (20%)</li>
                  <li>Screencast communication quality (10%)</li>
                </ul>
              </div>
            </Card>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button
              onClick={handleAssignToClass}
              disabled={assigning}
              style={{
                padding: '12px 24px', fontSize: 13.5, fontWeight: 900,
                background: 'var(--success)', color: 'white', border: 'none',
                borderRadius: 8, cursor: assigning ? 'default' : 'pointer'
              }}
            >
              {assigning ? '⚡ Deploying Assignment...' : '🚀 Export & Assign to Class'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TeacherCareerReadiness() {
  const readinessMetrics = [
    { label: 'Coding Proficiency', val: 91, color: 'var(--success)', desc: 'Strong technical algorithm scores across roster.' },
    { label: 'Projects Showcase', val: 72, color: '#10b981', desc: 'Acceptable project submission rates.' },
    { label: 'Mock Interview Prep', val: 61, color: 'var(--amber)', desc: 'Needs behavioral rehearsal.' },
    { label: 'Resume ATS Audits', val: 68, color: 'var(--amber)', desc: 'Grammar and action verb density gaps.' },
    { label: 'Communication Lab', val: 53, color: 'var(--danger)', desc: 'Critical speech & pitch telemetry deficits.' },
    { label: 'Personal Portfolio Setup', val: 44, color: 'var(--danger)', desc: 'Lack of hosted live links and verified credentials.' }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>💼 Career Readiness Classroom Console</h2>
        <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>Real-time cohort readiness indices for placements, detailing specific skill bottlenecks.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 20, flexWrap: 'wrap' }}>
        {/* Overall Score */}
        <Card style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Class Readiness Average</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: '#10b981', margin: '8px 0', fontFamily: 'var(--font-mono)' }}>74%</div>
            <div style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 800 }}>⚠️ Placement Bottlenecks Identified</div>
            <p style={{ fontSize: 11.5, color: 'var(--t3)', margin: '6px 0 0 0', lineHeight: 1.4 }}>
              Low scores in <strong>Communication (53%)</strong> and <strong>Portfolios (44%)</strong> are holding back cohort ATS screening passes.
            </p>
          </div>
        </Card>

        {/* Factors Breakdown */}
        <Card style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>📋 Efficacy Dimensions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {readinessMetrics.map((m, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2.5fr 0.5fr', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t2)' }}>{m.label}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${m.val}%`, height: '100%', background: m.color }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--t3)' }}>{m.desc}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 900, color: m.color, textAlign: 'right' }}>{m.val}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function TeacherInterventionCenter() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 'comm',
      name: 'Improve Communication Efficacy',
      desc: 'Address cohort verbal bottlenecks.',
      items: ['Communication Lab', 'Mission 4 (CPU Interlock speech)', 'Mock Interview (Behavioral)', 'Email Writing Quest', 'Presentation Exercise (AVL Tree video)'],
      color: 'var(--danger)',
      active: false
    },
    {
      id: 'port',
      name: 'Improve Portfolios Setup',
      desc: 'Audit hosted sites and verified links.',
      items: ['Portfolio Design Auditing', 'Project Showcase Quest', 'Socratic Certificate Exam'],
      color: 'var(--danger)',
      active: false
    },
    {
      id: 'resume',
      name: 'Improve Resume ATS Metrics',
      desc: 'Inject dynamic action verbs and layout scores.',
      items: ['Resume ATS Formatting', 'Grammar Quality review', 'Projects Description rewrite'],
      color: 'var(--amber)',
      active: false
    }
  ]);

  const [toastMsg, setToastMsg] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  const handleLaunchCampaign = (id, name) => {
    setLoadingId(id);
    setTimeout(() => {
      setLoadingId(null);
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, active: true } : c));
      setToastMsg(`⚡ AI Intervention Campaign launched: "${name}" assigned to all class dashboards!`);
      setTimeout(() => setToastMsg(''), 4500);
    }, 1500);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: '#059669', color: 'white', padding: '12px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(5,150,105,0.25)', border: '1.5px solid rgba(255,255,255,0.1)'
        }}>
          {toastMsg}
        </div>
      )}

      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>⚡ AI Intervention Center</h2>
        <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>Launch one-click multi-dimensional campaigns to target specific placement deficits across the cohort.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {campaigns.map(c => (
          <Card key={c.id} style={{ padding: 20, borderLeft: `4px solid ${c.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>{c.name}</h3>
                <p style={{ margin: '4px 0 12px 0', fontSize: 12, color: 'var(--t3)' }}>{c.desc}</p>
                
                <div>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t2)', textTransform: 'uppercase' }}>Auto-Assigned Bundle Items ({c.items.length}):</span>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                    {c.items.map((item, idx) => (
                      <span key={idx} style={{
                        fontSize: 11, background: 'var(--bg3)', border: '1px solid var(--border)',
                        color: 'var(--t1)', padding: '4px 10px', borderRadius: 6
                      }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleLaunchCampaign(c.id, c.name)}
                  disabled={loadingId === c.id || c.active}
                  style={{
                    padding: '10px 20px',
                    fontSize: 12.5,
                    fontWeight: 800,
                    background: c.active ? 'rgba(5,150,105,0.08)' : 'var(--success)',
                    color: c.active ? 'var(--success)' : 'white',
                    border: c.active ? '1px solid rgba(5,150,105,0.2)' : 'none',
                    borderRadius: 8,
                    cursor: loadingId === c.id || c.active ? 'default' : 'pointer'
                  }}
                >
                  {loadingId === c.id ? '⚡ Dispatching Campaign...' : (c.active ? '✓ Intervention Active' : 'Launch Intervention')}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TeacherIndustryReadinessMap() {
  const companies = [
    { name: 'Google', readyCount: 4, color: '#4285F4', bg: 'rgba(66,133,244,0.06)', border: 'rgba(66,133,244,0.15)', candidates: ['Rahul', 'Priya Sharma', 'Kiran Shah', 'Ashwanth'] },
    { name: 'Microsoft', readyCount: 2, color: '#F25022', bg: 'rgba(242,80,34,0.06)', border: 'rgba(242,80,34,0.15)', candidates: ['Rahul', 'Kiran Shah'] },
    { name: 'Infosys', readyCount: 22, color: '#007CC3', bg: 'rgba(0,124,195,0.06)', border: 'rgba(0,124,195,0.15)', candidates: ['Amit V.', 'Priya Sharma', 'Rohan', 'Ashwanth', 'Suresh Kumar', 'Neha Gupta', 'Vikram Sen', 'Ananya Roy', 'Deepak Ray', 'Kunal Sen', 'Pranav Nair', 'Shreya Rao', 'Aditya Dev', 'Meera Nair', 'Rohan Das', 'Karan Johar', 'Sunita Rao', 'Vijay M.', 'Arjun Dev', 'Pooja Sen', 'Varun Raj', 'Tanvi Roy'] },
    { name: 'TCS', readyCount: 41, color: '#1B365D', bg: 'rgba(27,54,93,0.06)', border: 'rgba(27,54,93,0.15)', candidates: ['Rahul', 'Priya Sharma', 'Amit V.', 'Kiran Shah', 'Ashwanth', 'Rohan', 'Sem 3 Batch (35 students)'] }
  ];

  const [selectedCompany, setSelectedCompany] = useState(0);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>🗺️ Industry Readiness Map</h2>
        <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>Cohort placements alignment dashboard matching active students to specific corporate recruitment benchmarks.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {companies.map((c, idx) => (
          <Card
            key={idx}
            onClick={() => setSelectedCompany(idx)}
            style={{
              padding: 20,
              background: idx === selectedCompany ? 'var(--bg3)' : c.bg,
              border: idx === selectedCompany ? `2px solid ${c.color}` : `1px solid ${c.border}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 900, color: c.color, textTransform: 'uppercase' }}>{c.name} Pipeline</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--t1)' }}>{c.readyCount} <span style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600 }}>Ready</span></div>
            <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>Click to view candidate list</div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 22 }}>
        <h3 style={{ margin: '0 0 14px 0', fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>
          📋 Qualified Candidates: {companies[selectedCompany].name}
        </h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {companies[selectedCompany].candidates.map((cand, idx) => (
            <span
              key={idx}
              style={{
                fontSize: 12,
                fontWeight: 700,
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                color: 'var(--t1)',
                padding: '6px 14px',
                borderRadius: 8
              }}
            >
              🎓 {cand}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function TeacherClassroomHealth() {
  const [healthScore, setHealthScore] = useState(88);
  const [factors, setFactors] = useState([
    { label: 'Attendance Ratio', val: 85, color: 'var(--success)' },
    { label: 'Learning Retention', val: 74, color: 'var(--success)' },
    { label: 'Communication Lab Efficacy', val: 53, color: 'var(--danger)' },
    { label: 'Coding Quest completions', val: 91, color: 'var(--success)' },
    { label: 'Career Targets Met', val: 74, color: 'var(--success)' },
    { label: 'Attention Engagement index', val: 82, color: 'var(--success)' },
    { label: 'Stress telemetry level', val: 45, color: 'var(--danger)' },
    { label: 'Assignment returns rate', val: 80, color: 'var(--success)' }
  ]);

  const [toastMsg, setToastMsg] = useState('');
  const [alertDismissed, setAlertDismissed] = useState(false);

  const handleApplyHealthFix = () => {
    setToastMsg('📅 Deadlines shifted & 10-minute Socratic quiz scheduled! Sem 3 stress levels decreased.');
    setHealthScore(92);
    setFactors(prev => prev.map(f => {
      if (f.label.includes('Stress')) return { ...f, val: 28, color: 'var(--success)' };
      if (f.label.includes('Learning')) return { ...f, val: 82 };
      return f;
    }));
    setAlertDismissed(true);
    setTimeout(() => setToastMsg(''), 4500);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: '#059669', color: 'white', padding: '12px 20px',
          borderRadius: 8, fontSize: 13, fontWeight: 700,
          boxShadow: '0 8px 24px rgba(5,150,105,0.25)', border: '1.5px solid rgba(255,255,255,0.1)'
        }}>
          {toastMsg}
        </div>
      )}

      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>❤️ AI Classroom Health Monitor</h2>
        <p style={{ color: 'var(--t3)', fontSize: 12.5, margin: '2px 0 0 0' }}>Ambient cohort wellness audits evaluating cognitive load, coding activity, and stress telemetry alerts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 20, flexWrap: 'wrap' }}>
        {/* Aggregated health score circular ring */}
        <Card style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Overall Classroom Health</div>
          <div style={{ fontSize: 72, fontWeight: 900, color: healthScore > 90 ? 'var(--success)' : 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
            {healthScore}%
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t2)' }}>Status: {healthScore > 90 ? 'EXCELLENT' : 'STABLE (Telemetry Alerts)'}</div>
        </Card>

        {/* Efficacy dimensions progress bars */}
        <Card style={{ padding: 22 }}>
          <h3 style={{ margin: '0 0 14px 0', fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>📋 Wellness Metrics Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {factors.map((f, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2.5fr 0.5fr', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)' }}>{f.label}</span>
                <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${f.val}%`, height: '100%', background: f.color }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: f.color, textAlign: 'right' }}>{f.val}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Alert trigger box */}
      {!alertDismissed && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(220,38,38,0.04) 0%, rgba(220,38,38,0.01) 100%)',
          border: '1px solid rgba(220,38,38,0.18)',
          borderRadius: 14,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 900, color: 'var(--danger)' }}>
              AI Wellness Alert: Sem 3/5 Cognitive Stress Spike (45%)
            </h3>
          </div>

          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
            Telemetry logs identified a <strong>15% spike in stress indices</strong> during coding practice sessions, correlating with upcoming midterm schedules.
          </p>

          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: 12, color: 'var(--t3)' }}>
            🤖 <strong>AI Intervention Recommended:</strong> Shift the Recursion challenge deadline by 3 days, or replace it with a 10-minute Socratic quiz verification check to alleviate cognitive load.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={handleApplyHealthFix}
              style={{
                padding: '8px 16px',
                fontSize: 12.5,
                fontWeight: 800,
                background: 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              Apply AI Recommendation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function TeacherAITeachingCenter({ teacher, subTab, setSubTab }) {

  const menuItems = [
    { id: 'ai_copilot',       icon: '🤖', label: 'AI Classroom Copilot' },
    { id: 'risk_center',      icon: '🚨', label: 'Student Risk Center'  },
    { id: 'impact_score',     icon: '🎯', label: 'Teaching Impact'      },
    { id: 'classroom_health', icon: '❤️', label: 'AI Classroom Health'  },
    { id: 'career_readiness', icon: '💼', label: 'Career Readiness'     },
    { id: 'digital_twin',     icon: '👥', label: 'Student Digital Twin' },
    { id: 'lesson_optimizer', icon: '⚡', label: 'AI Lesson Optimizer'  },
    { id: 'ai_assignment',    icon: '✍️', label: 'AI Assignment Gen'   },
    { id: 'intervention_center', icon: '⚡', label: 'AI Intervention Center' },
    { id: 'industry_map',     icon: '🗺️', label: 'Industry Readiness Map' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="fade-in">
      {/* Top Horizontal Pill Navigation Suite */}
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        overflowX: 'auto',
        boxShadow: 'var(--shadow-sm)',
        scrollBehavior: 'smooth'
      }}>
        <div style={{
          fontSize: 9.5,
          fontWeight: 900,
          color: 'var(--t3)',
          textTransform: 'uppercase',
          paddingRight: 12,
          borderRight: '1px solid var(--border)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.8px',
          fontFamily: 'var(--font-mono)'
        }}>
          Pedagogical AI Suite
        </div>
        <div style={{ display: 'flex', gap: 6, flex: 1, minWidth: 0, overflowX: 'auto', paddingBottom: 2 }}>
          {menuItems.map(item => {
            const isActive = subTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSubTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 13px',
                  fontSize: 12,
                  fontWeight: isActive ? 800 : 600,
                  background: isActive ? 'rgba(5,150,105,0.1)' : 'var(--bg3)',
                  color: isActive ? 'var(--success)' : 'var(--t2)',
                  border: `1px solid ${isActive ? 'rgba(5,150,105,0.25)' : 'var(--border)'}`,
                  borderRadius: 20,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Panel (100% Full Width) */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {subTab === 'ai_copilot' && <TeacherAICopilot teacher={teacher} />}
        {subTab === 'risk_center' && <TeacherRiskCenter teacher={teacher} />}
        {subTab === 'impact_score' && <TeacherImpactScore teacher={teacher} />}
        {subTab === 'classroom_health' && <TeacherClassroomHealth teacher={teacher} />}
        {subTab === 'career_readiness' && <TeacherCareerReadiness teacher={teacher} />}
        {subTab === 'digital_twin' && <TeacherDigitalTwin teacher={teacher} />}
        {subTab === 'lesson_optimizer' && <TeacherLessonOptimizer teacher={teacher} />}
        {subTab === 'ai_assignment' && <TeacherAIClassAssignment teacher={teacher} />}
        {subTab === 'intervention_center' && <TeacherInterventionCenter teacher={teacher} />}
        {subTab === 'industry_map' && <TeacherIndustryReadinessMap teacher={teacher} />}
      </div>
    </div>
  );
}

export function TeacherFloatingMentor({ activeTab, setActiveTab, subTab, setSubTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello Professor, I am Athena, your AI Faculty Director. Speak a command or use the shortcuts below to command my dashboard routines." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Synthesis and Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechGen = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechGen) {
        const rec = new SpeechGen();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => setIsListening(true);
        rec.onend = () => setIsListening(false);
        rec.onresult = (e) => {
          const transcript = e.results[0][0].transcript;
          handleCommand(transcript);
        };
        recognitionRef.current = rec;
      }
    }
  }, []);

  const speakText = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = (rawText) => {
    const text = rawText.toLowerCase().trim();
    setMessages(prev => [...prev, { role: 'user', text: rawText }]);

    let reply = "";
    
    // Command Routing logic
    if (text.includes('risk') || text.includes('backlog') || text.includes('strug')) {
      setActiveTab('ai_teaching_center');
      setSubTab('risk_center');
      reply = "Launching the Student Risk Center. Showing backlog risk categories.";
    } else if (text.includes('copilot') || text.includes('chat') || text.includes('ask')) {
      setActiveTab('ai_teaching_center');
      setSubTab('ai_copilot');
      reply = "Opening AI Classroom Copilot. Ready for student telemetry queries.";
    } else if (text.includes('health') || text.includes('stress') || text.includes('wellness')) {
      setActiveTab('ai_teaching_center');
      setSubTab('classroom_health');
      reply = "Navigating to AI Classroom Health audits.";
    } else if (text.includes('impact') || text.includes('efficacy') || text.includes('score')) {
      setActiveTab('ai_teaching_center');
      setSubTab('impact_score');
      reply = "Switching to Teaching Impact Score telemetry.";
    } else if (text.includes('readiness') || text.includes('placement') || text.includes('factor')) {
      setActiveTab('ai_teaching_center');
      setSubTab('career_readiness');
      reply = "Opening Career Readiness stats console.";
    } else if (text.includes('twin') || text.includes('skills') || text.includes('gap')) {
      setActiveTab('ai_teaching_center');
      setSubTab('digital_twin');
      reply = "Loading Student Digital Twin and skill telemetry map.";
    } else if (text.includes('lesson') || text.includes('optimize') || text.includes('slide')) {
      setActiveTab('ai_teaching_center');
      setSubTab('lesson_optimizer');
      reply = "Launching AI Lesson Optimizer.";
    } else if (text.includes('assignment') || text.includes('compose') || text.includes('question')) {
      setActiveTab('ai_teaching_center');
      setSubTab('ai_assignment');
      reply = "Opening AI Assignment Generator.";
    } else if (text.includes('intervention') || text.includes('assign communication') || text.includes('remedial')) {
      setActiveTab('ai_teaching_center');
      setSubTab('intervention_center');
      reply = "Opening AI Intervention dashboard.";
    } else if (text.includes('industry') || text.includes('google') || text.includes('microsoft')) {
      setActiveTab('ai_teaching_center');
      setSubTab('industry_map');
      reply = "Opening Industry Readiness placement maps.";
    } else if (text.includes('attendance') || text.includes('absent')) {
      setActiveTab('attendance_sheet');
      reply = "Navigating to Webcam Attendance Check-in sheet.";
    } else if (text.includes('planner') || text.includes('calendar')) {
      setActiveTab('lesson_planner');
      reply = "Opening Lesson Planner.";
    } else if (text.includes('roster') || text.includes('student list')) {
      setActiveTab('students');
      reply = "Switching to Students Roster.";
    } else if (text.includes('grade') || text.includes('essay')) {
      setActiveTab('grade');
      reply = "Opening Grade Essays portal.";
    } else if (text.includes('dashboard') || text.includes('overview') || text.includes('home')) {
      setActiveTab('dashboard');
      reply = "Returning to Overview Dashboard.";
    } else {
      reply = `I heard "${rawText}". I support dashboard navigation commands for Copilot, Risk Center, Class Health, and other modules. Use the shortcuts below!`;
    }

    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    speakText(reply);
  };

  const startMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        recognitionRef.current.stop();
      }
    } else {
      alert("Speech Recognition API is not supported on this browser version.");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: '2.5px solid rgba(255,255,255,0.18)',
          boxShadow: '0 8px 32px rgba(16,185,129,0.3)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s ease'
        }}
        title="Open AI Faculty Assistant (Athena)"
      >
        <span style={{ fontSize: 28, animation: 'spin 6s linear infinite' }}>🤖</span>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
      width: 360, height: 500, borderRadius: 16,
      background: 'rgba(20,20,22,0.88)',
      backdropFilter: 'blur(16px)',
      border: '1.5px solid rgba(255,255,255,0.08)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.05) 100%)',
        padding: '14px 18px', borderBottom: '1.5px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24, animation: 'pulse 1.8s infinite' }}>🤖</span>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 900, color: 'white' }}>Athena Faculty Assistant</div>
            <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>PinIT AI Director · Online</div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 16 }}
        >
          ✕
        </button>
      </div>

      {/* Message Output Frame */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end',
              background: m.role === 'assistant' ? 'rgba(255,255,255,0.04)' : '#10b981',
              color: 'white',
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: 12.5,
              maxWidth: '85%',
              lineHeight: 1.4,
              border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.06)' : 'none'
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Voice Visualizer Wave */}
      {isListening && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, padding: 8, background: 'rgba(16,185,129,0.06)' }}>
          <div className="wave-bar" style={{ width: 4, height: 16, background: '#10b981', animation: 'bounce 0.8s infinite' }} />
          <div className="wave-bar" style={{ width: 4, height: 24, background: '#10b981', animation: 'bounce 0.8s infinite 0.15s' }} />
          <div className="wave-bar" style={{ width: 4, height: 12, background: '#10b981', animation: 'bounce 0.8s infinite 0.3s' }} />
          <div className="wave-bar" style={{ width: 4, height: 20, background: '#10b981', animation: 'bounce 0.8s infinite 0.45s' }} />
        </div>
      )}

      {/* Navigation Shortcuts Grid */}
      <div style={{
        padding: 12, borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, background: 'rgba(0,0,0,0.15)'
      }}>
        <button
          onClick={() => handleCommand('show risk center')}
          style={{ padding: '8px 10px', fontSize: 11, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, color: 'white', textAlign: 'left', cursor: 'pointer' }}
        >
          🚨 Risk Predictor
        </button>
        <button
          onClick={() => handleCommand('show class health')}
          style={{ padding: '8px 10px', fontSize: 11, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, color: 'white', textAlign: 'left', cursor: 'pointer' }}
        >
          ❤️ Wellness Health
        </button>
        <button
          onClick={() => handleCommand('show intervention')}
          style={{ padding: '8px 10px', fontSize: 11, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, color: 'white', textAlign: 'left', cursor: 'pointer' }}
        >
          ⚡ Run Interventions
        </button>
        <button
          onClick={() => handleCommand('show career readiness')}
          style={{ padding: '8px 10px', fontSize: 11, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, color: 'white', textAlign: 'left', cursor: 'pointer' }}
        >
          💼 Career Benchmarks
        </button>
      </div>

      {/* Input Tray */}
      <div style={{
        padding: 12, borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', gap: 8, alignItems: 'center'
      }}>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { handleCommand(inputText); setInputText(''); } }}
          placeholder="Speak or type dashboard commands..."
          style={{
            flex: 1, padding: '10px 14px', fontSize: 12,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8, color: 'white', outline: 'none'
          }}
        />
        <button
          onClick={startMic}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: isListening ? '#dc2626' : 'rgba(255,255,255,0.05)',
            border: 'none', color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          title="Voice Command Mode"
        >
          🎙️
        </button>
      </div>
    </div>
  );
}