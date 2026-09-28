'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';

interface Question {
  id: string;
  type: 'mcq' | 'essay' | 'coding';
  text: string;
  marks: number;
  options?: string[];
  correctIndex?: number;
  functionName?: string;
  defaultLang?: string;
  testCases?: Array<{ input: string; output: string; hidden?: boolean }>;
}

interface ExamSchedule {
  id: string;
  title: string;
  course: string;
  code: string;
  batch: string;
  duration: number;
  durationMinutes: number;
  totalMarks: number;
  allowedSwitches: number;
  startDateTime: string;
  endDateTime: string;
  questionCount: number;
  questions?: Question[];
}

interface ExamAttempt {
  studentId: string;
  registerNumber?: string;
  examScheduleId: string;
  score: number;
  passed: boolean;
  tabSwitches?: number;
  timestamp?: number;
  created_at?: string;
}

function AdminExamsContent() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'schedules' | 'create' | 'submissions'>('schedules');
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [submissions, setSubmissions] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New Exam Form State
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [code, setCode] = useState('');
  const [batch, setBatch] = useState('All Batches');
  const [duration, setDuration] = useState(45);
  const [allowedSwitches, setAllowedSwitches] = useState(3);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 16));
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q1',
      type: 'mcq',
      text: 'What is the time complexity of quicksort in the average case?',
      options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
      correctIndex: 1,
      marks: 10
    },
    {
      id: 'q2',
      type: 'coding',
      text: 'Implement a function find_max(numbers) returning the maximum number in a list.',
      functionName: 'find_max',
      defaultLang: 'python',
      marks: 20,
      testCases: [
        { input: '[1, 9, 3, 7]', output: '9' },
        { input: '[-5, -2, -8]', output: '-2' },
        { input: '[42]', output: '42', hidden: true }
      ]
    }
  ]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/api/exams/admin-manage');
      const data = res?.data || res;
      setSchedules(data?.schedules || []);
      setSubmissions(data?.submissions || []);
    } catch (err: any) {
      toast.error('Failed to load exam admin data', err?.message || 'Please retry');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && ['admin', 'superadmin', 'staff', 'teacher'].includes(user.role)) {
      loadData();
    }
  }, [user, loadData]);

  if (authLoading) {
    return <div style={{ padding: 40, color: 'var(--t3)', textAlign: 'center' }}>Authenticating admin session...</div>;
  }

  if (!user || !['admin', 'superadmin', 'staff', 'teacher'].includes(user.role)) {
    return (
      <div style={{ padding: 40, color: 'var(--coral)', textAlign: 'center', maxWidth: 460, margin: '40px auto', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <h3>Access Denied</h3>
        <p style={{ fontSize: 14.5, color: 'var(--t3)' }}>Administrative credentials are required to access Exam Manager.</p>
      </div>
    );
  }

  // Handle Exam Creation
  async function handleCreateExam(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.warning('Title Required', 'Please provide an exam title.');
      return;
    }
    if (questions.length === 0) {
      toast.warning('Questions Required', 'Please configure at least one question.');
      return;
    }

    setSaving(true);
    try {
      const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
      const payload = {
        title,
        course: course || title,
        code: code || 'EXAM-101',
        batch,
        duration: Number(duration),
        durationMinutes: Number(duration),
        totalMarks,
        allowedSwitches: Number(allowedSwitches),
        startDateTime: new Date(startDate).toISOString(),
        endDateTime: new Date(endDate).toISOString(),
        questions
      };

      await api.post('/api/exams/admin-manage', payload);
      toast.success('Exam Published! 🎉', `${title} is now active and available for students.`);
      setTitle('');
      setCourse('');
      setCode('');
      setActiveTab('schedules');
      loadData();
    } catch (err: any) {
      toast.error('Publishing Failed', err?.message || 'Could not save exam schedule.');
    } finally {
      setSaving(false);
    }
  }

  // Handle Delete Schedule
  async function handleDelete(examId: string) {
    if (!confirm('Are you sure you want to remove this examination schedule?')) return;
    try {
      await api.delete(`/api/exams/admin-manage?id=${examId}`);
      toast.success('Exam Removed', 'The examination schedule has been deleted.');
      setSchedules(prev => prev.filter(s => s.id !== examId));
    } catch (err: any) {
      toast.error('Deletion Failed', err?.message || 'Could not remove schedule.');
    }
  }

  // Question manipulation
  function addMCQ() {
    setQuestions(prev => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        type: 'mcq',
        text: 'New Multiple Choice Question',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 0,
        marks: 5
      }
    ]);
  }

  function addCoding() {
    setQuestions(prev => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        type: 'coding',
        text: 'Write a function solution(n) that solves the problem.',
        functionName: 'solution',
        defaultLang: 'python',
        marks: 15,
        testCases: [{ input: '1', output: '1' }]
      }
    ]);
  }

  function removeQuestion(index: number) {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26.5, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>
            Exam Engine Administration
          </h1>
          <p style={{ color: 'var(--t3)', fontSize: 14.5, marginTop: 4 }}>
            Create papers, manage schedules, and audit proctored student submissions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--bg2)', padding: 4, borderRadius: 10, border: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('schedules')}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14.5, fontWeight: 600,
              background: activeTab === 'schedules' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'schedules' ? '#fff' : 'var(--t2)',
            }}
          >
            📋 Schedules ({schedules.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14.5, fontWeight: 600,
              background: activeTab === 'create' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'create' ? '#fff' : 'var(--t2)',
            }}
          >
            ➕ Create New Exam
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14.5, fontWeight: 600,
              background: activeTab === 'submissions' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'submissions' ? '#fff' : 'var(--t2)',
            }}
          >
            📊 Submissions ({submissions.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--t3)' }}>Loading exam management data...</div>
      ) : activeTab === 'schedules' ? (
        /* ── SCHEDULES TAB ── */
        <div>
          {schedules.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 35, marginBottom: 8 }}>📝</div>
              <h3>No Exam Schedules Active</h3>
              <p style={{ color: 'var(--t3)', fontSize: 14.5, marginBottom: 16 }}>Create your first examination paper to schedule exams for students.</p>
              <button onClick={() => setActiveTab('create')} className="btn-primary">Schedule New Exam →</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
              {schedules.map(exam => {
                const now = new Date();
                const start = new Date(exam.startDateTime);
                const end = new Date(exam.endDateTime);
                const isActive = now >= start && now <= end;
                const isEnded = now > end;

                return (
                  <div key={exam.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{
                        padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
                        background: isActive ? 'rgba(5, 150, 105, 0.12)' : isEnded ? 'var(--bg3)' : 'rgba(59, 130, 246, 0.12)',
                        color: isActive ? 'var(--green)' : isEnded ? 'var(--t3)' : 'var(--accent)'
                      }}>
                        {isActive ? '● ACTIVE NOW' : isEnded ? 'CLOSED' : 'UPCOMING'}
                      </span>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--t3)' }}>{exam.code || 'EXAM'}</span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: 17.5, fontWeight: 700, margin: '0 0 4px', color: 'var(--t1)' }}>{exam.title}</h3>
                      <div style={{ fontSize: 13, color: 'var(--t3)' }}>{exam.course} · Batch: <strong>{exam.batch}</strong></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8, fontSize: 13 }}>
                      <div>⏱ <strong>{exam.duration || exam.durationMinutes} mins</strong></div>
                      <div>🎯 <strong>{exam.totalMarks} Marks</strong></div>
                      <div>❓ <strong>{exam.questionCount || exam.questions?.length || 0} Questions</strong></div>
                      <div>🔒 <strong>{exam.allowedSwitches ?? 3} Tab Switches</strong></div>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                      Valid: {new Date(exam.startDateTime).toLocaleDateString()} – {new Date(exam.endDateTime).toLocaleDateString()}
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--coral)', fontSize: 13, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeTab === 'create' ? (
        /* ── CREATE TAB ── */
        <form onSubmit={handleCreateExam} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: 'var(--t1)' }}>Configure Examination Paper</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>EXAM TITLE *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Advanced Operating Systems Midterm"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>COURSE CODE</label>
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. CS-301"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>TARGET BATCH</label>
              <input
                value={batch}
                onChange={e => setBatch(e.target.value)}
                placeholder="All Batches or e.g. Batch 2026-A"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>DURATION (MINUTES)</label>
              <input
                type="number"
                min={5}
                max={240}
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>START DATE & TIME</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6 }}>END DATE & TIME</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)' }}
              />
            </div>
          </div>

          {/* Question Builder */}
          <div style={{ marginTop: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 17.5, fontWeight: 700, margin: 0, color: 'var(--t1)' }}>
                Questions ({questions.length}) · Total Marks: {questions.reduce((a, b) => a + (Number(b.marks) || 0), 0)}
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={addMCQ} className="btn-ghost btn-sm">+ Add MCQ</button>
                <button type="button" onClick={addCoding} className="btn-ghost btn-sm">+ Add Coding Task</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {questions.map((q, idx) => (
                <div key={q.id || idx} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      Q{idx + 1} · {q.type.toUpperCase()}
                    </span>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <label style={{ fontSize: 13, color: 'var(--t2)' }}>
                        Marks:{' '}
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={q.marks}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setQuestions(prev => prev.map((item, i) => i === idx ? { ...item, marks: val } : item));
                          }}
                          style={{ width: 60, padding: '4px 6px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)' }}
                        />
                      </label>
                      <button type="button" onClick={() => removeQuestion(idx)} style={{ color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 17.5 }}>×</button>
                    </div>
                  </div>

                  <input
                    value={q.text}
                    onChange={e => {
                      const val = e.target.value;
                      setQuestions(prev => prev.map((item, i) => i === idx ? { ...item, text: val } : item));
                    }}
                    placeholder="Enter question prompt..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', marginBottom: 10 }}
                  />

                  {q.type === 'mcq' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {(q.options || []).map((opt, optIdx) => (
                        <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="radio"
                            name={`correct_${q.id || idx}`}
                            checked={q.correctIndex === optIdx}
                            onChange={() => setQuestions(prev => prev.map((item, i) => i === idx ? { ...item, correctIndex: optIdx } : item))}
                          />
                          <input
                            value={opt}
                            onChange={e => {
                              const val = e.target.value;
                              setQuestions(prev => prev.map((item, i) => i === idx ? {
                                ...item,
                                options: (item.options || []).map((o, oi) => oi === optIdx ? val : o)
                              } : item));
                            }}
                            style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)', fontSize: 14.5 }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'coding' && (
                    <div style={{ fontSize: 13, color: 'var(--t3)' }}>
                      Function name: <code>{q.functionName || 'solution'}</code> · Language: {q.defaultLang || 'python'} · {q.testCases?.length || 0} test cases configured
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '12px 24px', fontSize: 15.5 }}>
            {saving ? 'Saving Exam...' : 'Publish Examination Schedule →'}
          </button>
        </form>
      ) : (
        /* ── SUBMISSIONS TAB ── */
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: 'var(--t1)' }}>Proctored Examination Records</h3>
            <button onClick={loadData} className="btn-ghost btn-sm">⟳ Refresh</button>
          </div>

          {submissions.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>No student submissions recorded yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14.5, textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--bg3)', color: 'var(--t3)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '10px 16px' }}>Student / Reg No</th>
                    <th style={{ padding: '10px 16px' }}>Exam ID</th>
                    <th style={{ padding: '10px 16px' }}>Score %</th>
                    <th style={{ padding: '10px 16px' }}>Result</th>
                    <th style={{ padding: '10px 16px' }}>Tab Switches</th>
                    <th style={{ padding: '10px 16px' }}>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, i) => {
                    const time = sub.created_at ? new Date(sub.created_at).toLocaleString() : sub.timestamp ? new Date(sub.timestamp).toLocaleString() : 'Recent';
                    const flagged = (sub.tabSwitches || 0) > 3;

                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--t1)' }}>
                          {sub.registerNumber || sub.studentId}
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--t2)' }}>
                          {sub.examScheduleId}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: sub.passed ? 'var(--green)' : 'var(--coral)' }}>
                          {sub.score}%
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                            background: sub.passed ? 'rgba(5, 150, 105, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: sub.passed ? 'var(--green)' : 'var(--coral)'
                          }}>
                            {sub.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ color: flagged ? 'var(--coral)' : 'var(--t2)', fontWeight: flagged ? 700 : 500 }}>
                            {sub.tabSwitches ?? 0} {flagged ? '⚠ Flagged' : ''}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--t3)', fontSize: 13 }}>
                          {time}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminExamsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--t3)', textAlign: 'center' }}>Loading Exam Admin...</div>}>
      <AdminExamsContent />
    </Suspense>
  );
}
