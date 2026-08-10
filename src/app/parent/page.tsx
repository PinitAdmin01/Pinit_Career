'use client';
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { openRazorpayCheckout } from '@/lib/razorpay';

export default function ParentPage() {
  const qc = useQueryClient();
  const [registerNumber, setRegisterNumber] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [advisorInput, setAdvisorInput] = useState('');
  const [advisorMessages, setAdvisorMessages] = useState<Array<{ role: 'assistant' | 'user'; text: string }>>([
    { role: 'assistant', text: "Hello! I am your AI Parent Advisor. Ask me anything about your child's career progress or recent metrics." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'teacher' | 'parent'; text: string }>>([
    { role: 'teacher', text: "Hello! Prof. Vikram Sen here. I reviewed your child's coding assignments. Excellent work on Python recursion! However, please ask them to attend the Networking lab sessions." }
  ]);

  const { data: students, isLoading } = useQuery({
    queryKey: ['parent', 'students'],
    queryFn:  () => api.get<{ students: Student[] }>('/api/parent/students').then(r => r.students),
  });

  const { data: overview } = useQuery({
    queryKey: ['parent', 'overview', selectedStudent],
    queryFn:  () => api.get<StudentOverview>(`/api/parent/student/${selectedStudent}/overview`),
    enabled:  !!selectedStudent,
  });

  // Dynamic chat message update when student changes (not on background refetch)
  const prevStudentRef = React.useRef(selectedStudent);
  useEffect(() => {
    // Only reset tab when user explicitly switches student, not on background refetch
    if (prevStudentRef.current !== selectedStudent) {
      setActiveTab('dashboard');
      prevStudentRef.current = selectedStudent;
    }
    if (students && selectedStudent) {
      const activeChild = students.find(s => s.id === selectedStudent);
      const name = activeChild?.display_name || (activeChild as any)?.full_name || (activeChild as any)?.name || 'your child';
      setChatMessages([
        { role: 'teacher', text: `Hello! Prof. Vikram Sen here. I reviewed ${name}'s coding assignments. Excellent work on Python recursion! However, please ask them to attend the Networking lab sessions.` }
      ]);
    }
  }, [selectedStudent, students]);

  const linkMutation = useMutation({
    mutationFn: (rn: string) => api.post('/api/parent/link-student', { registerNumber: rn }),
    onSuccess: () => {
      toast.success('Request Sent', 'Student will be notified to approve your request');
      setRegisterNumber('');
      qc.invalidateQueries({ queryKey: ['parent'] });
    },
    onError: (e: any) => toast.error('Failed', e.message),
  });

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerNumber) linkMutation.mutate(registerNumber);
  };

  const tabs = [
    { id: 'dashboard',      label: '📊 Dashboard' },
    { id: 'academic',       label: '📈 Academic Progress' },
    { id: 'career',         label: '💼 Career Progress' },
    { id: 'attendance',     label: '📸 Attendance' },
    { id: 'advisor',        label: '🤖 AI Parent Copilot' },
    { id: 'communication',  label: '💬 Communication' },
    { id: 'documents',      label: '📄 Documents' },
    { id: 'finance',        label: '💰 Fee & Finance' },
    { id: 'notifications',  label: '🔔 Notifications' },
    { id: 'profile',        label: '👤 Child Profile' },
    { id: 'monthly_report', label: '📅 Monthly AI Report' }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 40px 20px' }}>
      <div className="page-hero" style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-hero-title">👨‍👩‍👧 Parent Portal</h1>
          <p className="page-hero-sub">Monitor your child's career development, academic progress, and skill milestones in real-time</p>
        </div>
      </div>

      {/* Link Student Section */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--t1)' }}>Link a Student</div>
        <form onSubmit={handleLinkSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            value={registerNumber}
            onChange={e => setRegisterNumber(e.target.value)}
            placeholder="Enter student register number (e.g. REG-001)..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 }}
          />
          <button
            type="submit"
            disabled={!registerNumber || linkMutation.isPending}
            style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
          >
            {linkMutation.isPending ? 'Sending...' : 'Send Request'}
          </button>
        </form>
        <p style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8 }}>
          The student must approve your request before you can view their progress.
        </p>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--t3)' }}>Loading linked students...</div>
      ) : !students?.length ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--t3)', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14 }}>
          No linked students yet. Enter a register number above to get started.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Sidebar - Linked Students List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.8px', paddingLeft: 4 }}>Linked Children</div>
            {students.map(s => (
              <div key={s.id}
                onClick={() => setSelectedStudent(s.id)}
                style={{
                  padding: '16px', borderRadius: 12, cursor: 'pointer',
                  background: selectedStudent === s.id ? 'rgba(16,185,129,0.08)' : 'var(--card)',
                  border: `1.5px solid ${selectedStudent === s.id ? 'var(--success)' : 'var(--border)'}`,
                  transition: 'all 0.15s ease'
                }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>{s.display_name || (s as any).name || 'Student'}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{s.register_number || s.id}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <span style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700 }}>ATS: {s.ats_score || 0}</span>
                  <span style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 700 }}>🔥 {s.mission_streak || 0}d streak</span>
                </div>
              </div>
            ))}
          </div>

          {/* Child Workspace Panels */}
          <div>
            {!selectedStudent ? (
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 60, textAlign: 'center', color: 'var(--t3)' }}>
                Select a student from the left panel to open the Child Career workspace
              </div>
            ) : !overview ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--t3)', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14 }}>Loading overview analytics...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Horizontal Workspace Navigation Tabs */}
                <div style={{
                  display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6,
                  borderBottom: '1px solid var(--border)'
                }}>
                  {tabs.map(t => {
                    const isActive = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        style={{
                          padding: '8px 16px', borderRadius: 8, fontSize: 12.5, fontWeight: isActive ? 800 : 600,
                          background: isActive ? 'rgba(16,185,129,0.08)' : 'transparent',
                          color: isActive ? 'var(--success)' : 'var(--t2)',
                          border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Views */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, minHeight: 450 }}>
                  
                  {/* 1. DASHBOARD VIEW */}
                  {activeTab === 'dashboard' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
                      
                      {/* Emergency Alerts Container */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div style={{
                          background: 'rgba(239,68,68,0.04)',
                          border: '1.5px solid var(--danger)',
                          borderRadius: 12, padding: 16
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--danger)', textTransform: 'uppercase' }}>🚨 Critical Alert</span>
                            <span style={{ fontSize: 10, color: 'var(--t3)' }}>Action Required</span>
                          </div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>Attendance Below 70%</h4>
                          <p style={{ margin: 0, fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>
                            Backlog Risk: <strong style={{ color: 'var(--danger)' }}>High</strong>. Immediate teacher meeting recommended.
                          </p>
                        </div>

                        <div style={{
                          background: 'rgba(16,185,129,0.04)',
                          border: '1.5px solid var(--success)',
                          borderRadius: 12, padding: 16
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--success)', textTransform: 'uppercase' }}>🎉 Congratulations!</span>
                            <span style={{ fontSize: 10, color: 'var(--t3)' }}>Milestone Met</span>
                          </div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>Career Readiness Reached 90%</h4>
                          <p style={{ margin: 0, fontSize: 12, color: 'var(--t2)', lineHeight: 1.4 }}>
                            Eligible for premium internships. Recommended: Apply to early campus recruiter list.
                          </p>
                        </div>
                      </div>

                      {/* AI Summary Banner */}
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,150,105,0.02) 100%)',
                        border: '1px solid rgba(16,185,129,0.18)',
                        borderRadius: 12, padding: 18
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 18 }}>🤖</span>
                          <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--success)' }}>Athena Parent Summary Alert</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>
                          Your child is progressing well. Career Readiness increased by 8% this month. Attendance dropped last week. Communication skills improved.
                        </p>
                        <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--t3)' }}>
                          💡 <strong>Action Recommended:</strong> Encourage completion of the Communication Lab this weekend.
                        </div>
                      </div>

                      {/* Score Cards Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                        {[
                          { label: 'Career Readiness', value: `${overview.profile?.career_readiness || 74}%`, desc: 'Overall placement readiness index', color: 'var(--success)' },
                          { label: 'Academic Performance', value: '82%', desc: 'Roster exam performance', color: 'var(--accent)' },
                          { label: 'Attendance', value: '88%', desc: 'Check-in log ratio', color: 'var(--teal)' },
                          { label: 'Communication Lab', value: '53%', desc: 'Speech and dialogue metric', color: 'var(--danger)' },
                          { label: 'Placement Eligibility', value: '72%', desc: 'Corporate hiring score', color: '#10b981' },
                          { label: 'Current CGPA', value: '8.4', desc: 'Cumulative grade average', color: 'var(--accent)' },
                          { label: 'Mission Streak', value: `${overview.profile?.mission_streak || 0} days`, desc: 'Continuous study index', color: 'var(--amber)' },
                          { label: 'AI Health Status', value: 'Stable', desc: 'Overall wellness telemetry', color: 'var(--success)' }
                        ].map((card, idx) => (
                          <div key={idx} style={{
                            background: 'var(--bg3)', border: '1px solid var(--border)',
                            borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 4
                          }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>{card.label}</span>
                            <span style={{ fontSize: 24, fontWeight: 900, color: card.color, fontFamily: 'var(--font-mono)' }}>{card.value}</span>
                            <span style={{ fontSize: 10, color: 'var(--t3)' }}>{card.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. ACADEMIC PROGRESS VIEW */}
                  {activeTab === 'academic' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }} className="fade-in">
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>📈 Academic Performance & Semester Progress</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Visual trackers of exam performance, subject grades, and concept comprehension trends.</p>
                      </div>

                      {/* Semester Progress indicator */}
                      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--t2)' }}>Current Semester Progress</span>
                          <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>78% Complete</span>
                        </div>
                        <div style={{ width: '100%', height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                          <div style={{ width: '78%', height: '100%', background: 'var(--success)' }} />
                        </div>
                      </div>

                      {/* Performance Bar Charts Graph */}
                      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }}>
                        <h4 style={{ margin: '0 0 14px 0', fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>📊 Subject Score Graph</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {[
                            { name: 'Database Systems', val: 100, color: '#10b981' },
                            { name: 'Mathematics', val: 80, color: 'var(--success)' },
                            { name: 'Programming Foundations', val: 60, color: 'var(--amber)' },
                            { name: 'Computer Networking', val: 40, color: 'var(--danger)' }
                          ].map((g, idx) => (
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2.5fr 0.5fr', alignItems: 'center', gap: 12 }}>
                              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t2)' }}>{g.name}</span>
                              <div style={{ width: '100%', height: 12, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${g.val}%`, height: '100%', background: g.color }} />
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 900, color: g.color, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{g.val}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subjects & Marks breakdown */}
                      <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ background: 'var(--bg3)', padding: '10px 14px', fontSize: 11.5, fontWeight: 800, color: 'var(--t3)', borderBottom: '1px solid var(--border)' }}>SUBJECT DETAILS & ASSIGNMENT RETURNS</div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {[
                            { name: 'Database Systems', internals: '24 / 25', assignments: '10 / 10', attend: '100%', exam: 'Project review (Aug 02)' },
                            { name: 'Mathematics', internals: '21 / 25', assignments: '9 / 10', attend: '96%', exam: 'Midterm exam (July 25)' },
                            { name: 'Programming Foundations', internals: '16 / 25', assignments: '6 / 10', attend: '90%', exam: 'Lab Check (July 28)' },
                            { name: 'Computer Networking', internals: '11 / 25', assignments: '4 / 10', attend: '76%', exam: 'Theory Quiz (July 30)' }
                          ].map((sub, idx) => (
                            <div key={idx} style={{
                              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', padding: '12px 14px',
                              borderBottom: idx < 3 ? '1px solid var(--border)' : 'none', fontSize: 12.5
                            }}>
                              <strong style={{ color: 'var(--t1)' }}>{sub.name}</strong>
                              <span>Int: {sub.internals}</span>
                              <span>Assig: {sub.assignments}</span>
                              <span>Att: {sub.attend}</span>
                              <span style={{ color: 'var(--t3)', textAlign: 'right' }}>📅 {sub.exam}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Diagnosis trends */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ background: 'rgba(5,150,105,0.03)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--success)', marginBottom: 8 }}>🚀 Improving Subjects</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--t2)' }}>
                            <div>• <strong>Mathematics</strong>: +12% improvement this month</div>
                            <div>• <strong>Database Systems</strong>: Consistent high test scores</div>
                          </div>
                        </div>

                        <div style={{ background: 'rgba(220,38,38,0.03)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 10, padding: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--danger)', marginBottom: 8 }}>⚠️ Weak Subjects (Revision Gaps)</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--t2)' }}>
                            <div>• <strong>Computer Networking</strong>: Needs urgent notes audit</div>
                            <div>• <strong>Programming Foundations</strong>: Focus on mock labs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. CAREER PROGRESS VIEW */}
                  {activeTab === 'career' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>💼 Employability & Career Milestones</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Visual indicators mapping real-world hiring benchmarks, helping you track your child's placement ready status.</p>
                      </div>

                      {/* Career DNA Matching */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Target Career Profile</span>
                          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--success)', marginTop: 4 }}>🤖 AI Software Engineer</div>
                          <p style={{ margin: '8px 0 0 0', fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4 }}>
                            Strengths: Algorithm logic, backend routing systems. Gaps identified in technical presentation deliveries.
                          </p>
                        </div>

                        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Employability Rating</span>
                          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--success)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>74%</div>
                          <span style={{ fontSize: 11, color: 'var(--t3)' }}>Meets standard recruitment benchmarks.</span>
                        </div>
                      </div>

                      {/* Employability Factor Progress bars */}
                      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>📋 Corporate Hiring Pillars</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                          {[
                            { label: 'Coding Test Score', val: 91, color: 'var(--success)', desc: 'Excellent compiler pass rate' },
                            { label: 'Verified Certificates', val: 75, color: 'var(--accent)', desc: '3 credentials issued' },
                            { label: 'Projects Showcase', val: 72, color: 'var(--accent)', desc: '3 active repos, 72% complete' },
                            { label: 'Resume ATS Score', val: 68, color: 'var(--amber)', desc: '68/100 (needs layout tweaks)' },
                            { label: 'Interview Readiness', val: 61, color: 'var(--amber)', desc: 'Needs behavioral mock prep' },
                            { label: 'Communication Index', val: 53, color: 'var(--danger)', desc: 'Speech and pitching gaps' },
                            { label: 'Portfolio Completeness', val: 44, color: 'var(--danger)', desc: '44% (missing live hosted links)' },
                            { label: 'Internships Applied', val: 30, color: 'var(--t3)', desc: 'Applied to 3, 2 pending review' }
                          ].map((f, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                                <span style={{ color: 'var(--t2)' }}>{f.label}</span>
                                <span style={{ color: f.color, fontWeight: 800 }}>{f.val}%</span>
                              </div>
                              <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${f.val}%`, height: '100%', background: f.color }} />
                              </div>
                              <span style={{ fontSize: 10, color: 'var(--t3)' }}>{f.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. ATTENDANCE VIEW */}
                  {activeTab === 'attendance' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>📸 Attendance & Ambient Telemetry Logs</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Check monthly averages, today's class check-ins, late logs, and approved leaves.</p>
                      </div>

                      {/* Score cards grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                        {[
                          { label: "Today's Attendance", value: 'Present', desc: 'Checked-in: 08:45 AM', color: 'var(--success)' },
                          { label: 'Monthly Average', value: '88%', desc: 'Roster target is 85%', color: 'var(--success)' },
                          { label: 'Late Entries', value: '2', desc: 'Arrived after 08:30 AM', color: 'var(--amber)' },
                          { label: 'Approved Leaves', value: '1', desc: 'Medical excuse logged', color: 'var(--teal)' }
                        ].map((c, idx) => (
                          <div key={idx} style={{
                            background: 'var(--bg3)', border: '1px solid var(--border)',
                            borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 4
                          }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>{c.label}</span>
                            <span style={{ fontSize: 20, fontWeight: 900, color: c.color }}>{c.value}</span>
                            <span style={{ fontSize: 10, color: 'var(--t3)' }}>{c.desc}</span>
                          </div>
                        ))}
                      </div>

                      {/* Attendance Alerts */}
                      <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--danger)', marginBottom: 10 }}>⚠️ Attendance Alerts & Warning Warnings</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ fontSize: 12.5, color: 'var(--t2)' }}>
                            • <strong>Unexcused Absence (July 14)</strong>: Missed classes without prior leave submission. Action required.
                          </div>
                          <div style={{ fontSize: 12.5, color: 'var(--t2)' }}>
                            • <strong>Late Arrival (July 16)</strong>: Checked-in at 09:12 AM (Webcam registered 42 mins delay).
                          </div>
                        </div>
                      </div>

                      {/* Attendance Trend list */}
                      <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                        <div style={{ background: 'var(--bg3)', padding: '10px 14px', fontSize: 11.5, fontWeight: 800, color: 'var(--t3)', borderBottom: '1px solid var(--border)' }}>WEEKLY ATTENDANCE TREND</div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {[
                            { week: 'Week 1', ratio: '95%', status: 'Regular' },
                            { week: 'Week 2', ratio: '92%', status: 'Regular' },
                            { week: 'Week 3', ratio: '80%', status: 'Dropped last week (3 absences, alert generated)' },
                            { week: 'Week 4', ratio: '90%', status: 'Regular' }
                          ].map((w, idx) => (
                            <div key={idx} style={{
                              display: 'flex', justifyContent: 'space-between', padding: '12px 14px',
                              borderBottom: idx < 3 ? '1px solid var(--border)' : 'none', fontSize: 12.5
                            }}>
                              <span style={{ fontWeight: 700 }}>{w.week}</span>
                              <span>Check-in Rate: <strong style={{ color: idx === 2 ? 'var(--danger)' : 'var(--success)' }}>{w.ratio}</strong> ({w.status})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. AI PARENT ADVISOR VIEW */}
                  {activeTab === 'advisor' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
                      {/* Coach Banner */}
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,150,105,0.02) 100%)',
                        border: '1.5px solid rgba(16,185,129,0.2)',
                        borderRadius: 12, padding: 18
                      }}>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: 13.5, fontWeight: 900, color: 'var(--success)' }}>📋 AI Faculty Advisor Diagnostic Report</h4>
                        <p style={{ margin: 0, fontSize: 13, color: 'var(--t2)', lineHeight: 1.45 }}>
                          Rahul's attendance has decreased during the last two weeks. However, coding performance has improved.
                        </p>
                        <div style={{ marginTop: 10, borderTop: '1px solid rgba(16,185,129,0.1)', paddingTop: 10, fontSize: 12.5, color: 'var(--t2)' }}>
                          💡 <strong>Recommendation:</strong> Encourage Rahul to attend classes regularly. He is likely to improve his Career Readiness by completing Python Module 6.
                        </div>
                      </div>

                      {/* Interactive Chat Console */}
                      <div style={{ display: 'flex', flexDirection: 'column', height: 350, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                        <div style={{ background: 'var(--bg3)', padding: '10px 14px', fontSize: 11.5, fontWeight: 800, color: 'var(--t3)', borderBottom: '1px solid var(--border)' }}>CHAT CONSOLE WITH ATHENA</div>
                        
                        {/* Messages logs */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--card)' }}>
                          {advisorMessages.map((m, idx) => (
                            <div key={idx} style={{
                              alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end',
                              background: m.role === 'assistant' ? 'var(--bg3)' : 'var(--success)',
                              color: m.role === 'assistant' ? 'var(--t1)' : 'white',
                              padding: '10px 14px', borderRadius: 10, fontSize: 12.5, maxWidth: '85%',
                              border: m.role === 'assistant' ? '1px solid var(--border)' : 'none'
                            }}>
                              {m.role === 'assistant' ? '🤖 ' : '👤 '}
                              {m.text}
                            </div>
                          ))}
                        </div>

                        {/* Presets grid */}
                        <div style={{ padding: 10, background: 'var(--bg3)', borderTop: '1px solid var(--border)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {[
                            {
                              q: 'How is my son doing?',
                              a: 'Overall Progress: Excellent | Attendance: 88% | Coding: Very Good | Communication: Needs Improvement | Career Readiness: 81%\n\nRecommendation: Encourage participation in Communication Lab and upcoming mock interview.'
                            },
                            {
                              q: 'Will my child likely get placed?',
                              a: 'Current Placement Readiness: 76% | Strengths: Programming, Projects | Weaknesses: Communication, Interview Confidence\n\nRecommended Actions: Communication Lab, Mock Interview, Resume Review'
                            },
                            {
                              q: 'What should I focus on this month?',
                              a: 'Priority checklist for this month:\n1. Improve attendance\n2. Complete 4 coding quests\n3. Practice communication exercises\n4. Finish internship application'
                            }
                          ].map((pre, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setAdvisorMessages(prev => [
                                  ...prev,
                                  { role: 'user', text: pre.q },
                                  { role: 'assistant', text: pre.a }
                                ]);
                              }}
                              style={{
                                padding: '6px 10px', fontSize: 11, background: 'var(--card)',
                                border: '1px solid var(--border)', borderRadius: 6,
                                color: 'var(--t2)', cursor: 'pointer', fontWeight: 600
                              }}
                            >
                              💬 {pre.q}
                            </button>
                          ))}
                        </div>

                        {/* Send tray */}
                        <div style={{ padding: 10, borderTop: '1px solid var(--border)', display: 'flex', gap: 8, background: 'var(--card)' }}>
                          <input
                            value={advisorInput}
                            onChange={e => setAdvisorInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && advisorInput.trim()) {
                                const inputVal = advisorInput;
                                setAdvisorMessages(prev => [...prev, { role: 'user', text: inputVal }]);
                                setAdvisorInput('');
                                setTimeout(() => {
                                  setAdvisorMessages(prev => [...prev, { role: 'assistant', text: `I received your question about "${inputVal}". Click one of our telemetry quick buttons above to get detailed metrics alerts.` }]);
                                }, 800);
                              }
                            }}
                            placeholder="Type a question for Athena..."
                            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 12.5 }}
                          />
                          <button
                            onClick={() => {
                              if (advisorInput.trim()) {
                                const inputVal = advisorInput;
                                setAdvisorMessages(prev => [...prev, { role: 'user', text: inputVal }]);
                                setAdvisorInput('');
                                setTimeout(() => {
                                  setAdvisorMessages(prev => [...prev, { role: 'assistant', text: `I received your question about "${inputVal}". Click one of our telemetry quick buttons above to get detailed metrics alerts.` }]);
                                }, 800);
                              }
                            }}
                            style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--success)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 700 }}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. COMMUNICATION VIEW */}
                  {activeTab === 'communication' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>💬 Institution & Faculty Communication</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Chat with advisors, book Parent-Teacher Meetings (PTM), and view general announcements.</p>
                      </div>

                      {/* Main two-column block */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                        
                        {/* Left: Chat with Prof. Vikram Sen */}
                        <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 320 }}>
                          <div style={{ background: 'var(--bg3)', padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ fontSize: 12.5, color: 'var(--t1)' }}>Prof. Vikram Sen</strong>
                              <div style={{ fontSize: 10, color: 'var(--t3)' }}>Course Director / Placement Advisor</div>
                            </div>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
                          </div>

                          {/* Chat body */}
                          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--card)' }}>
                            {chatMessages.map((m, idx) => (
                              <div key={idx} style={{
                                alignSelf: m.role === 'teacher' ? 'flex-start' : 'flex-end',
                                background: m.role === 'teacher' ? 'var(--bg3)' : 'var(--accent)',
                                color: m.role === 'teacher' ? 'var(--t1)' : 'white',
                                padding: '8px 12px', borderRadius: 8, fontSize: 12, maxWidth: '85%',
                                border: m.role === 'teacher' ? '1px solid var(--border)' : 'none'
                              }}>
                                {m.text}
                              </div>
                            ))}
                          </div>

                          {/* Chat input */}
                          <div style={{ padding: 8, borderTop: '1px solid var(--border)', display: 'flex', gap: 8, background: 'var(--bg3)' }}>
                            <input
                              value={chatInput}
                              onChange={e => setChatInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && chatInput.trim()) {
                                  const text = chatInput;
                                  setChatMessages(prev => [...prev, { role: 'parent', text }]);
                                  setChatInput('');
                                  setTimeout(() => {
                                    setChatMessages(prev => [...prev, { role: 'teacher', text: "Thank you for the message. I will review Rahul's logs and respond during our scheduled advising hours tomorrow." }]);
                                  }, 1000);
                                }
                              }}
                              placeholder="Type message to teacher..."
                              style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--t1)', fontSize: 12 }}
                            />
                            <button
                              onClick={() => {
                                if (chatInput.trim()) {
                                  const text = chatInput;
                                  setChatMessages(prev => [...prev, { role: 'parent', text }]);
                                  setChatInput('');
                                  setTimeout(() => {
                                    setChatMessages(prev => [...prev, { role: 'teacher', text: "Thank you for the message. I will review Rahul's logs and respond during our advising hours tomorrow." }]);
                                  }, 1000);
                                }
                              }}
                              style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                            >
                              Send
                            </button>
                          </div>
                        </div>

                        {/* Right: PTM and Announcements */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          
                          {/* PTM card */}
                          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>Upcoming Virtual PTM</span>
                            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)', marginTop: 4 }}>July 29, 04:00 PM</div>
                            <p style={{ margin: '4px 0 8px 0', fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4 }}>
                              Agenda: Pre-placement eligibility and communication lab checkups.
                            </p>
                            <button
                              onClick={() => {
                                toast.success('PTM Scheduler', 'The virtual PTM room link will become active 10 minutes before the scheduled time.');
                              }}
                              style={{ width: '100%', padding: '8px 0', background: 'var(--border)', color: 'var(--t2)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                            >
                              Join Video Meeting
                            </button>
                          </div>

                          {/* Announcements */}
                          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Institutional Announcements</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                              <div style={{ fontSize: 11.5, color: 'var(--t2)', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                                📢 <strong>Placement Drive</strong> starting Aug 10. Direct resume screening schedules have been locked.
                              </div>
                              <div style={{ fontSize: 11.5, color: 'var(--t2)' }}>
                                📢 <strong>Summer Internships</strong> details are now downloadable in the Documents tab.
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Footer Actions Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        
                        {/* Meeting request */}
                        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>📞 Request 1-on-1 Callback Advisor Call</h4>
                          <p style={{ margin: '0 0 12px 0', fontSize: 11, color: 'var(--t3)' }}>Select a preferred slot to request a phone advisor callback from Prof Vikram Sen.</p>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => toast.success('Request Callback', 'Morning advisory session requested successfully.')}
                              style={{ flex: 1, padding: '8px 10px', fontSize: 11.5, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', color: 'var(--t1)' }}
                            >
                              🌅 Morning (10:00 AM - 12:00 PM)
                            </button>
                            <button
                              onClick={() => toast.success('Request Callback', 'Evening advisory session requested successfully.')}
                              style={{ flex: 1, padding: '8px 10px', fontSize: 11.5, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', color: 'var(--t1)' }}
                            >
                              🌇 Evening (03:00 PM - 05:00 PM)
                            </button>
                          </div>
                        </div>

                        {/* Support helpdesk */}
                        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>🛠️ Institute Support Ticket</h4>
                          <p style={{ margin: '0 0 10px 0', fontSize: 11, color: 'var(--t3)' }}>Submit a concern to general student support advisors.</p>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input
                              placeholder="Describe your issue or query..."
                              style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--card)', color: 'var(--t1)', fontSize: 11.5 }}
                            />
                            <button
                              onClick={() => {
                                toast.success('Support Helpdesk', 'Your query has been logged. Support ticket ref #7492.');
                              }}
                              style={{ padding: '8px 14px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11.5, fontWeight: 700 }}
                            >
                              Submit
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* 7. DOCUMENTS VIEW */}
                  {activeTab === 'documents' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>📄 verified Credentials & Documents Vault</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Download bonafides, marks cards, fee receipts, and transfer certificates anytime with cryptographic verification seals.</p>
                      </div>

                      {/* Documents Vault list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                          { name: 'Bonafide Enrollment Certificate', type: 'Bonafide', size: '180 KB', stamp: 'Verified Oct 2025' },
                          { name: 'Student Digital Identity Card', type: 'ID Card', size: '1.2 MB', stamp: 'Active Smart Card' },
                          { name: 'Semester 1 Official Marks Card', type: 'Marks Card', size: '420 KB', stamp: 'Signed by Registrar' },
                          { name: 'Python Recursion Quest Certificate', type: 'Certificates', size: '350 KB', stamp: 'Gold Badge Credential' },
                          { name: 'Term 1 Installment Fee Receipt', type: 'Fee Receipts', size: '95 KB', stamp: 'Transaction ref #9284' },
                          { name: 'Transfer Certificate (TC)', type: 'Transfer Certificate', size: '510 KB', stamp: 'Conditional release draft' }
                        ].map((doc, idx) => (
                          <div key={idx} style={{
                            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', alignItems: 'center', padding: 14,
                            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12.5
                          }}>
                            <div>
                              <strong style={{ color: 'var(--t1)' }}>📄 {doc.name}</strong>
                              <div style={{ fontSize: 10.5, color: 'var(--t3)', marginTop: 2 }}>{doc.stamp}</div>
                            </div>
                            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{doc.type}</span>
                            <span style={{ color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{doc.size}</span>
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => {
                                  toast.success('Document Downloaded', `Successfully compiled and downloaded ${doc.name}.pdf`);
                                }}
                                style={{ padding: '6px 12px', fontSize: 11, background: 'var(--success)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}
                              >
                                Download PDF
                              </button>
                              <button
                                onClick={() => {
                                  toast.success('Print Requested', `A physical copy of ${doc.name} will be dispatched to your registered address.`);
                                }}
                                style={{ padding: '6px 12px', fontSize: 11, background: 'var(--card)', color: 'var(--t2)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                              >
                                Request Print
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 8. FEE & FINANCE VIEW */}
                  {activeTab === 'finance' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fade-in">
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>💰 Fees & Payments Portal</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Audit college dues and pay pending fee installments online securely via Razorpay.</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          { id: 'inst_1', term: 'Term 1 Tuition Fees', amt: '₹45,000', amountNum: 45000, status: 'PAID' },
                          { id: 'inst_2', term: 'Term 2 Hostel & Mess Fees', amt: '₹12,000', amountNum: 12000, status: 'PENDING' }
                        ].map((pay, idx) => (
                          <div key={idx} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14,
                            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13
                          }}>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--t1)' }}>{pay.term}</div>
                              <span style={{ fontSize: 11, color: 'var(--t3)' }}>Amount: {pay.amt}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{
                                fontWeight: 800, fontSize: 12,
                                color: pay.status === 'PAID' ? 'var(--success)' : 'var(--danger)'
                              }}>{pay.status}</span>

                              {pay.status === 'PENDING' && (
                                <button
                                  onClick={async () => {
                                    try {
                                      const orderRes = await api.post<{ orderId: string; amount: number; keyId: string }>('/api/payment/create-order', {
                                        planId: pay.id,
                                        amount: pay.amountNum * 100
                                      });
                                      await openRazorpayCheckout({
                                        key: orderRes.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_pinit_demo',
                                        amount: orderRes.amount || (pay.amountNum * 100),
                                        currency: 'INR',
                                        name: 'PinIT Parent Fee Payment',
                                        description: `Payment for ${pay.term}`,
                                        order_id: orderRes.orderId,
                                        handler: (res) => {
                                          toast.success('Payment Successful! 🎉', `Transaction ID: ${res.razorpay_payment_id}. Receipt issued.`);
                                          qc.invalidateQueries({ queryKey: ['parent'] });
                                        },
                                        theme: { color: '#10b981' }
                                      });
                                    } catch (e: any) {
                                      toast.error('Payment Error', e.message);
                                    }
                                  }}
                                  style={{
                                    padding: '6px 14px', borderRadius: 8, border: 'none',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(16,185,129,0.25)'
                                  }}
                                  className="btn-glow"
                                >
                                  💳 Pay via Razorpay ➔
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 9. NOTIFICATIONS VIEW */}
                  {activeTab === 'notifications' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="fade-in">
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>🔔 Centralized Notifications Hub</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Important institution advisories, exam timelines, assignment reminders, and placement news alerts.</p>
                      </div>

                      {/* Notifications stream */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                          {
                            type: 'Attendance Alert',
                            title: 'Unexcused Absence Recorded',
                            desc: 'Absent on July 14 without prior leave submission. Please verify and submit excuse note.',
                            color: 'var(--danger)',
                            bg: 'rgba(220,38,38,0.03)',
                            border: 'rgba(220,38,38,0.15)',
                            time: '1 day ago'
                          },
                          {
                            type: 'Exam Alert',
                            title: 'Midterm Theory Examination Schedule',
                            desc: 'Mathematics Midterm exam is locked for July 25, 09:30 AM in Examination Hall-C.',
                            color: 'var(--success)',
                            bg: 'rgba(16,185,129,0.03)',
                            border: 'rgba(16,185,129,0.15)',
                            time: '2 days ago'
                          },
                          {
                            type: 'Assignment Reminder',
                            title: 'Programming Foundations Submission',
                            desc: 'Assignment 3: Recursion and DSA structures due tomorrow at 11:59 PM. Current status: Unsubmitted.',
                            color: 'var(--amber)',
                            bg: 'rgba(245,158,11,0.03)',
                            border: 'rgba(245,158,11,0.15)',
                            time: '3 hours ago'
                          },
                          {
                            type: 'Placement News',
                            title: 'Microsoft Campus Recruitment Registrations',
                            desc: 'Microsoft placement register window opens on Aug 01. Mapped matching profiles (AI Engineers) are eligible.',
                            color: 'var(--accent)',
                            bg: 'rgba(59,130,246,0.03)',
                            border: 'rgba(59,130,246,0.15)',
                            time: '3 days ago'
                          },
                          {
                            type: 'Holiday Notice',
                            title: 'Independence Day Campus Closure',
                            desc: 'The institute and hostel administrative blocks will remain closed on Aug 15 for Independence Day.',
                            color: 'var(--t2)',
                            bg: 'var(--bg3)',
                            border: 'var(--border)',
                            time: '4 days ago'
                          },
                          {
                            type: 'Meeting Reminder',
                            title: 'Virtual Parent-Teacher Meeting (PTM)',
                            desc: 'Virtual advising slot with Prof Vikram Sen scheduled for July 29, 04:00 PM. Launch links available in Communication.',
                            color: 'var(--teal)',
                            bg: 'rgba(20,184,166,0.03)',
                            border: 'rgba(20,184,166,0.15)',
                            time: '5 days ago'
                          }
                        ].map((n, idx) => (
                          <div key={idx} style={{
                            background: n.bg, border: `1.5px solid ${n.border}`,
                            borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 6
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 10, fontWeight: 900, color: n.color, textTransform: 'uppercase', background: 'var(--card)', padding: '2px 8px', borderRadius: 4, border: `1px solid ${n.border}` }}>
                                {n.type}
                              </span>
                              <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>{n.time}</span>
                            </div>
                            <h4 style={{ margin: '4px 0 0 0', fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>{n.title}</h4>
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>{n.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 10. CHILD PROFILE VIEW */}
                  {activeTab === 'profile' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="fade-in">
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>👤 Student Registry Profile</h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Verified institutional registration details, emergency contact indexes, and parent credentials.</p>
                      </div>

                      {/* Header overview card */}
                      <div style={{
                        background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 18,
                        display: 'flex', gap: 16, alignItems: 'center'
                      }}>
                        <div style={{
                          width: 60, height: 60, borderRadius: 30, background: 'var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                        }}>
                          👨‍💻
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--t1)' }}>Rahul Sharma</h4>
                          <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2 }}>
                            Registration ID: <strong style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>PinIT-90284</strong> | Status: <span style={{ color: 'var(--success)', fontWeight: 800 }}>Active Student</span>
                          </div>
                        </div>
                      </div>

                      {/* Profile details grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        
                        {/* Left column: Academic parameters */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Department</span>
                            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>Computer Science & Engineering</div>
                          </div>

                          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Current Semester</span>
                            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>Semester 4 (CS-A cohort)</div>
                          </div>

                          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Academic Batch</span>
                            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginTop: 4 }}>Batch of 2026</div>
                          </div>

                          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Roll Number</span>
                            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t1)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>CS-2023-0842</div>
                          </div>
                        </div>

                        {/* Right column: Guardianship parameters */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Emergency Contact</span>
                            <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--danger)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>+91 98765 43210</div>
                            <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>Relation: Priya Sharma (Mother)</span>
                          </div>

                          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Parent Details</span>
                            <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 700, marginTop: 4 }}>
                              Father: Ashok Sharma
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 700, marginTop: 2 }}>
                              Mother: Priya Sharma
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                              Email: ashok.priya@gmail.com
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Action banner */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                        <button
                          onClick={() => {
                            toast.success('Update Request Sent', 'A verification request to update child registry credentials was sent to the administration office.');
                          }}
                          style={{ padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                        >
                          ✏️ Request Profile Record Update
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 11. MONTHLY AI REPORT VIEW */}
                  {activeTab === 'monthly_report' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }} className="fade-in">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: 'var(--t1)' }}>📅 Monthly AI Parent Summary Report</h3>
                          <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--t3)' }}>Comprehensive monthly student performance report compiled by Athena AI.</p>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 900, background: 'var(--bg3)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 20, color: 'var(--t2)' }}>
                          Report Month: July 2026
                        </span>
                      </div>

                      {/* Summary Blocks Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        
                        {/* Block 1: Academic & Career Progress */}
                        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
                          <h4 style={{ margin: '0 0 12px 0', fontSize: 13, fontWeight: 900, color: 'var(--accent)' }}>📈 Performance Summary</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: 'var(--t2)' }}>
                            <div>
                              <strong>Academic Progress:</strong> Current CGPA is 8.4. Strong command in Database Systems (100%) and Mathematics (80%), but Networking (40%) requires focused revision.
                            </div>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                              <strong>Career Development:</strong> Mapped as an <em>AI Software Engineer</em> target profile with an overall placement readiness rating of 74%.
                            </div>
                          </div>
                        </div>

                        {/* Block 2: Attendance Trends & Achievements */}
                        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 18 }}>
                          <h4 style={{ margin: '0 0 12px 0', fontSize: 13, fontWeight: 900, color: 'var(--teal)' }}>🏆 Achievements & Attendance Trends</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: 'var(--t2)' }}>
                            <div>
                              <strong>Attendance Trends:</strong> Monthly check-in rate is 88%. Encountered an absence spike during Week 3, but recovered to 90% last week.
                            </div>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                              <strong>New Achievements:</strong> Successfully completed Python Recursion coding quest, earning the institutional Gold Badge Credential.
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Milestones, Support & Action advice */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                        
                        {/* Left: Support Needs & Upcoming Milestones */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>⚠️ Areas Needing Support</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
                              <div>• <strong>Computer Networking</strong>: Focus on routing theory and mock quiz tests.</div>
                              <div>• <strong>Communication Skills</strong>: Speech pitching metrics are at 53% (Needs lab rehearsal).</div>
                              <div>• <strong>Interview Rehearsal</strong>: Practice behavioral mock question lists.</div>
                            </div>
                          </div>

                          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: 12.5, fontWeight: 800, color: 'var(--t1)' }}>📅 Upcoming Milestones</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--t2)' }}>
                              <div>• <strong>Microsoft Registrations</strong>: Campus register opens on Aug 01.</div>
                              <div>• <strong>Virtual PTM Review</strong>: Advisory session locked for July 29, 04:00 PM.</div>
                              <div>• <strong>Campus Placement Drive</strong>: Official recruitment round starts Aug 10.</div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Home Action Plan */}
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,150,105,0.02) 100%)',
                          border: '1.5px solid rgba(16,185,129,0.2)',
                          borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', justifyItems: 'center'
                        }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 900, color: 'var(--success)' }}>💡 Action Plan for Home</h4>
                          <p style={{ margin: '0 0 12px 0', fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>
                            Practical tips to help you support your child's placement preparation:
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--t2)' }}>
                            <div>1. <strong>Encourage regular class attendance</strong> to prevent backlog drops.</div>
                            <div>2. <strong>Monitor communication quest progress</strong> inside the Comm Lab console this weekend.</div>
                            <div>3. <strong>Verify hosted portfolio setup</strong> is updated with latest project credentials.</div>
                          </div>
                          
                          <div style={{ marginTop: 'auto', paddingTop: 14 }}>
                            <button
                              onClick={() => toast.success('Report Saved', 'Monthly AI Parent Report downloaded successfully.')}
                              style={{ width: '100%', padding: '10px 0', background: 'var(--success)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12.5, fontWeight: 700 }}
                            >
                              Download Monthly PDF Report
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface Student {
  id: string; display_name: string; register_number: string;
  ats_score: number; trust_score: number; mission_streak: number;
  career_readiness: number;
}
interface StudentOverview {
  profile: Record<string, any>;
  recentExams: Array<{ exam_name: string; pct: string }>;
  missionSummary: any[];
}
