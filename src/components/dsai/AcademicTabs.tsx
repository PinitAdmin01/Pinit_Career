import React, { useState, useEffect, useCallback } from 'react';
import { DB, FileStorage } from '@/lib/dsaiFirebase';
import { Btn, Input, Card, Spinner, EmptyState, Badge } from '../_legacy/dsai/UI.jsx';
import { toast } from '@/lib/store/useAppStore';
import { api } from '@/lib/api/client';
import { subscribeToDirectMessages } from '@/lib/supabaseService';

const SEM_TABS = ['All', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'];

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280, flexDirection: 'column', gap: 14 }}>
      <Spinner size={32} />
      <p style={{ color: 'var(--t3)', fontSize: 13, fontWeight: 500 }}>Loading…</p>
    </div>
  );
}

export function HomeTab({ student, onStartExam, examCheckLoading }: any) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [results, schedules, notifications, news] = await Promise.all([
        DB.getAll('exam_results'),
        DB.getAll('exam_schedule'),
        DB.getAll('notifications'),
        DB.getAll('news'),
      ]);
      if (cancelled) return;
      const now = new Date();
      const myResults = results.filter((r: any) => r.registerNumber === student.registerNumber);
      const activeExams = schedules.filter((s: any) => {
        const start = new Date(s.startDateTime), end = new Date(s.endDateTime);
        return now >= start && now <= end && (s.batch === student.batch || s.batch === 'All Batches');
      });
      const attemptedIds = myResults.map((r: any) => r.examScheduleId);
      const myNotifs = notifications.filter((n: any) => n.batch === student.batch || n.batch === 'All Batches');
      const avg = myResults.length
        ? (myResults.reduce((s: number, r: any) => s + parseFloat(r.percentage || 0), 0) / myResults.length).toFixed(1)
        : 0;
      setData({ myResults, activeExams, myNotifs, news, avg, attemptedIds });
    }
    load();
    return () => { cancelled = true; };
  }, [student.registerNumber, student.batch]);

  if (!data) return <PageLoader />;

  return (
    <div className="fade-in" style={{ color: 'var(--t1)' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>Welcome back, {(student?.name || 'Student').split(' ')[0]}! 👋</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13, marginTop: 4 }}>Here's your academic overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { value: data.activeExams.length, label: 'Active Exams', icon: '🔴', color: '#dc2626', bg: 'rgba(220,38,38,0.05)' },
          { value: data.myResults.length, label: 'Completed', icon: '✅', color: '#059669', bg: 'rgba(5,150,105,0.05)' },
          { value: `${data.avg}%`, label: 'Avg Score', icon: '📊', color: '#2563eb', bg: 'rgba(37,99,235,0.05)' },
          { value: data.myNotifs.length, label: 'Notifications', icon: '🔔', color: '#d97706', bg: 'rgba(217,119,6,0.05)' },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}20`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {data.activeExams.length > 0 && (
        <div style={{ marginBottom: 18, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
            <h3 style={{ fontWeight: 800, fontSize: 13, color: '#dc2626' }}>LIVE EXAMS AVAILABLE</h3>
          </div>
          {data.activeExams.map((exam: any) => {
            const attempted = data.attemptedIds.includes(exam.id);
            return (
              <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', background: 'var(--bg3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 3, fontSize: 13, color: 'var(--t1)' }}>{exam.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--t3)' }}>⏱ {exam.duration} min · Ends {new Date(exam.endDateTime).toLocaleTimeString()}</div>
                </div>
                {attempted ? <Badge type="success">✅ Completed</Badge> : (
                  <Btn variant="primary" size="sm" onClick={() => onStartExam(exam)} disabled={examCheckLoading}>
                    {examCheckLoading ? <><Spinner size={12} color="white" /> Checking…</> : 'Start →'}
                  </Btn>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {data.myNotifs.length > 0 && (
          <Card>
            <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--t1)' }}>🔔 Recent Notifications</h3>
            {data.myNotifs.slice(0, 3).map((n: any) => (
              <div key={n.id} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'flex-start' }}>
                <Badge type={n.type === 'Warning' ? 'warning' : n.type === 'Alert' ? 'danger' : 'info'}>{n.type || 'Info'}</Badge>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--t1)' }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>{n.message}</div>
                </div>
              </div>
            ))}
          </Card>
        )}
        {data.news.length > 0 && (
          <Card>
            <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'var(--t1)' }}>📰 Latest News</h3>
            {data.news.slice(0, 3).map((n: any) => (
              <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, color: 'var(--t1)' }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>{(n.content || '').slice(0, 100)}{(n.content || '').length > 100 ? '…' : ''}</div>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3 }}>{new Date(n.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

export function ExamsTab({ student, onStartExam, examCheckLoading }: any) {
  const [data, setData] = useState<any>(null);

  const load = useCallback(async () => {
    const [schedules, results] = await Promise.all([DB.getAll('exam_schedule'), DB.getAll('exam_results')]);
    const now = new Date();
    const attemptedIds = results.filter((r: any) => r.registerNumber === student.registerNumber).map((r: any) => r.examScheduleId);
    const myExams = schedules.filter((s: any) => s.batch === student.batch || s.batch === 'All Batches');
    setData({
      active:   myExams.filter((s: any) => now >= new Date(s.startDateTime) && now <= new Date(s.endDateTime)),
      upcoming: myExams.filter((s: any) => new Date(s.startDateTime) > now),
      past:     myExams.filter((s: any) => new Date(s.endDateTime) < now),
      attemptedIds,
    });
  }, [student.registerNumber, student.batch]);

  useEffect(() => { load(); }, [load]);

  if (!data) return <PageLoader />;

  return (
    <div className="fade-in" style={{ color: 'var(--t1)' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>📝 My Exams</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>{student.batch}</p>
      </div>

      <Card style={{ marginBottom: 14, border: '1px solid rgba(220,38,38,0.2)' }}>
        <h3 style={{ fontWeight: 700, fontSize: 13, color: '#dc2626', marginBottom: 12 }}>🔴 Active Exams</h3>
        {data.active.length === 0 ? <EmptyState icon="📝" text="No active exams right now" /> : data.active.map((exam: any) => {
          const attempted = data.attemptedIds.includes(exam.id);
          return (
            <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 3, fontSize: 13, color: 'var(--t1)' }}>{exam.title}</div>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>⏱ {exam.duration} min · Ends {new Date(exam.endDateTime).toLocaleString()}</div>
              </div>
              {attempted ? <Badge type="success">✅ Done</Badge> : (
                <Btn variant="primary" size="sm" onClick={() => onStartExam(exam)} disabled={examCheckLoading}>
                  {examCheckLoading ? <><Spinner size={12} color="white" /> Checking…</> : 'Start →'}
                </Btn>
              )}
            </div>
          );
        })}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <h3 style={{ fontWeight: 700, fontSize: 13, color: '#2563eb', marginBottom: 12 }}>⏳ Upcoming Exams</h3>
        {data.upcoming.length === 0 ? <EmptyState icon="📅" text="No upcoming exams" /> : data.upcoming.map((exam: any) => (
          <div key={exam.id} style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, marginBottom: 2, fontSize: 13, color: 'var(--t1)' }}>{exam.title}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>⏱ {exam.duration} min · Starts {new Date(exam.startDateTime).toLocaleString()}</div>
          </div>
        ))}
      </Card>

      <Card>
        <h3 style={{ fontWeight: 700, fontSize: 13, color: 'var(--t3)', marginBottom: 12 }}>✅ Past Exams</h3>
        {data.past.length === 0 ? <EmptyState icon="📋" text="No past exams" /> : data.past.map((exam: any) => (
          <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--t1)' }}>{exam.title}</div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>{new Date(exam.startDateTime).toLocaleDateString()}</div>
            </div>
            {data.attemptedIds.includes(exam.id) ? <Badge type="success">Submitted</Badge> : <Badge type="danger">Missed</Badge>}
          </div>
        ))}
      </Card>
    </div>
  );
}

export function ResultsTab({ student }: any) {
  const [results, setResults] = useState<any[] | null>(null);
  const [revealMap, setRevealMap] = useState<any>(null);

  const load = useCallback(async () => {
    const [all, vis] = await Promise.all([
      DB.getAll('exam_results'),
      DB.getAll('result_visibility'),
    ]);
    const map: any = {};
    vis.forEach((v: any) => { map[v.examScheduleId] = v.revealed === true; });
    setResults(all.filter((r: any) => r.registerNumber === student.registerNumber));
    setRevealMap(map);
  }, [student.registerNumber]);
  useEffect(() => { load(); }, [load]);

  if (!results || !revealMap) return <PageLoader />;

  const visible = results.filter(r => !!revealMap[r.examScheduleId]);
  const hidden = results.length - visible.length;
  const avg = visible.length ? (visible.reduce((s, r) => s + parseFloat(r.percentage || 0), 0) / visible.length).toFixed(1) : 0;
  const best = visible.length ? Math.max(...visible.map(r => parseFloat(r.percentage || 0))).toFixed(1) : 0;

  return (
    <div className="fade-in" style={{ color: 'var(--t1)' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>📊 My Results</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>{results.length} exam{results.length !== 1 ? 's' : ''} taken · {student.batch}</p>
      </div>

      {hidden > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 12, padding: '11px 14px', marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <p style={{ color: 'var(--amber)', fontWeight: 500, fontSize: 12, margin: 0 }}>
            <strong>{hidden}</strong> result{hidden !== 1 ? 's are' : ' is'} pending release by admin.
          </p>
        </div>
      )}

      {visible.length === 0 ? (
        <Card><EmptyState icon="📊" text={results.length > 0 ? 'Results not yet published by admin' : 'No results yet. Take your first exam!'} /></Card>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 18 }}>
            {[
              { label: 'Exams Taken', value: visible.length, icon: '📝', color: '#2563eb', bg: 'rgba(37,99,235,0.05)' },
              { label: 'Average Score', value: `${avg}%`, icon: '📊', color: '#059669', bg: 'rgba(5,150,105,0.05)' },
              { label: 'Best Score', value: `${best}%`, icon: '🏆', color: '#d97706', bg: 'rgba(217,119,6,0.05)' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}20`, borderRadius: 12, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
          <Card style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--t3)' }}>Exam</th>
                    <th style={{ padding: '12px 16px', color: 'var(--t3)' }}>Date</th>
                    <th style={{ padding: '12px 16px', color: 'var(--t3)' }}>Score</th>
                    <th style={{ padding: '12px 16px', color: 'var(--t3)' }}>%</th>
                    <th style={{ padding: '12px 16px', color: 'var(--t3)' }}>Grade</th>
                    <th style={{ padding: '12px 16px', color: 'var(--t3)' }}>Tab Switches</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r: any) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--t1)' }}>{r.examTitle || 'Exam'}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--t3)' }}>{new Date(r.submittedAt).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>{r.score}</td>
                      <td style={{ padding: '12px 16px' }}><Badge type={parseFloat(r.percentage) >= 50 ? 'success' : 'danger'}>{r.percentage}</Badge></td>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: parseFloat(r.percentage) >= 50 ? 'var(--green)' : 'var(--coral)', fontSize: 14 }}>{r.grade}</td>
                      <td style={{ padding: '12px 16px' }}><Badge type={r.tabSwitches > 0 ? 'warning' : 'success'}>{r.tabSwitches || 0}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export function NotesTab({ student }: any) {
  const [notes, setNotes] = useState<any[] | null>(null);
  const [activeSem, setActiveSem] = useState('All');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.get<any>(`/api/notes/stats?batch=${student.batch || 'CSE-2026'}`);
      setNotes(data.notes || []);
    } catch {
      // Fallback
      const all = await DB.getAll('notes');
      const filtered = all
        .filter((n: any) => n.batch === student.batch || n.batch === 'All Batches')
        .map(({ fileData, fileUrl, ...meta }: any) => meta);
      setNotes(filtered);
    }
  }, [student.batch]);

  useEffect(() => { load(); }, [load]);

  function fileIcon(n: string) {
    if (!n) return '📄';
    if (n.endsWith('.pdf')) return '📕';
    if (n.match(/\.pptx?$/)) return '📊';
    if (n.match(/\.docx?$/)) return '📝';
    if (n.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return '🖼️';
    return '📄';
  }

  function fmt(b: number) {
    if (!b) return '';
    return b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
  }

  if (!notes) return <PageLoader />;

  const bySem = activeSem === 'All' ? notes : notes.filter(n => n.semester === activeSem);
  const filtered = bySem.filter(n =>
    !search ||
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    n.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in" style={{ color: 'var(--t1)' }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>📚 Study Notes</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>Materials for {student.batch}</p>
      </div>

      <div style={{ display: 'flex', gap: 0, marginBottom: 12, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 3, width: 'fit-content', flexWrap: 'wrap' }}>
        {SEM_TABS.map(s => {
          const count = s === 'All' ? notes.length : notes.filter(n => n.semester === s).length;
          const active = activeSem === s;
          return (
            <button key={s} onClick={() => { setActiveSem(s); setSearch(''); }} style={{
              padding: '6px 12px', borderRadius: 7, border: 'none',
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'white' : count === 0 ? 'var(--t4)' : 'var(--t2)',
              fontWeight: active ? 700 : 500, fontSize: 12,
              cursor: count === 0 && s !== 'All' ? 'default' : 'pointer',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              {s} {count > 0 && <span style={{ marginLeft: 3, opacity: 0.6, fontSize: 10 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input placeholder="🔍 Search notes by title or subject..." value={search} onChange={(e: any) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? <Card><EmptyState icon="📚" text="No study materials found" /></Card> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(note => (
            <Card key={note.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>{fileIcon(note.fileName)}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{note.subject} · Sem {note.semester}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 14px 0', lineHeight: 1.4 }}>{note.description || 'No description provided.'}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>{fmt(note.fileSize)}</span>
                <Btn size="sm" onClick={async () => {
                  try {
                    let href = note.fileUrl || note.fileData;
                    if (!href) {
                      const full = await DB.getOne(`notes/${note.id}`);
                      href = full?.fileUrl || full?.fileData;
                    }
                    if (!href) { toast.error('File not found.'); return; }
                    FileStorage.download(href, note.fileName);
                  } catch (e: any) {
                    toast.error('Download failed: ' + e.message);
                  }
                }}>📥 Download</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function NotificationsTab({ student }: any) {
  const [notifs, setNotifs] = useState<any[] | null>(null);

  useEffect(() => {
    async function load() {
      const all = await DB.getAll('notifications');
      setNotifs(all.filter((n: any) => n.batch === student.batch || n.batch === 'All Batches'));
    }
    load();
  }, [student.batch]);

  if (!notifs) return <PageLoader />;

  return (
    <div className="fade-in" style={{ color: 'var(--t1)' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>🔔 Notifications</h1>
        <p style={{ color: 'var(--t3)', fontSize: 13 }}>Broadcast alerts for {student.batch}</p>
      </div>

      {notifs.length === 0 ? <Card><EmptyState icon="🔔" text="No notifications yet" /></Card> : (
        <Card style={{ padding: 0 }}>
          {notifs.map((n, i) => (
            <div key={n.id} style={{ display: 'flex', gap: 12, padding: 16, borderBottom: i < notifs.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
              <Badge type={n.type === 'Warning' ? 'warning' : n.type === 'Urgent' ? 'danger' : 'info'}>{n.type || 'Info'}</Badge>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>{n.title}</div>
                <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 4, margin: '4px 0 0 0', lineHeight: 1.5 }}>{n.message}</p>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>{new Date(n.createdAt || Date.now()).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

export function ContactTab({ student }: any) {
  const [subj, setSubj] = useState('');
  const [msg, setMsg] = useState('');
  const [recipient, setRecipient] = useState('priya');
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      const local = await DB.getAll('student_messages');
      const filteredLocal = local.filter((m: any) => m.studentId === student.registerNumber || m.studentName === student.name);

      const apiRes = await api.get<{ messages: any[] }>(`/api/messages/direct?with=${recipient}`).catch(() => ({ messages: [] }));
      const directMsgs = apiRes?.messages || [];

      // Map teacher replies from directMsgs back into local history
      const localMap = new Map<string, any>();
      filteredLocal.forEach((m: any) => localMap.set(m.id || m.subject, m));

      directMsgs.forEach((dm: any) => {
        if (dm.role === 'teacher' || dm.sender_id === recipient) {
          // Find matching query by subject or pick most recent pending query
          const rawSubj = dm.content?.split(']: ')?.[0]?.replace('[RE: ', '')?.replace('[', '');
          const matched = filteredLocal.find((m: any) => m.subject === rawSubj || m.status === 'Pending');
          if (matched) {
            matched.reply = dm.content?.split(']: ')[1] || dm.content;
            matched.status = 'Replied';
            localMap.set(matched.id || matched.subject, { ...matched });
          }
        }
      });

      const sorted = Array.from(localMap.values()).sort((a: any, b: any) => (b.sentAt || '').localeCompare(a.sentAt || ''));
      setHistory(sorted);
    } catch {
      const local = await DB.getAll('student_messages');
      setHistory(local.filter((m: any) => m.studentId === student.registerNumber || m.studentName === student.name));
    }
  }, [student.registerNumber, student.name, recipient]);

  useEffect(() => {
    loadHistory();
    const studentUid = student?.registerNumber || 'STUDENT_001';
    const sub = subscribeToDirectMessages(studentUid, () => {
      toast.info('New message received from your teacher!');
      loadHistory();
    });

    const timer = setInterval(() => {
      loadHistory();
    }, 4000);

    return () => {
      sub?.unsubscribe();
      clearInterval(timer);
    };
  }, [loadHistory, student?.registerNumber]);

  async function handleSend(e: any) {
    e.preventDefault();
    if (!subj.trim() || !msg.trim()) { toast.warning('Please fill all fields'); return; }
    setSending(true);
    try {
      const recipientName = recipient === 'priya' ? 'Ms. Priya' : recipient === 'anish' ? 'Mr. Anish' : 'Faculty Admin';
      const msgObj = {
        studentId: student.registerNumber || 'STUDENT_001',
        studentName: student.name || 'Student',
        batch: student.batch || 'Batch 1',
        recipientId: recipient,
        recipientName: recipientName,
        subject: subj.trim(),
        message: msg.trim(),
        status: 'Pending',
        sentAt: new Date().toISOString(),
      };
      await DB.save('student_messages', msgObj);
      await api.post('/api/messages/direct', {
        recipientId: recipient,
        recipientName: recipientName,
        senderName: student.name || 'Student',
        content: `[${subj.trim()}]: ${msg.trim()}`
      }).catch(() => {});

      toast.success(`Message sent to ${recipientName}!`);
      setSubj(''); setMsg('');
      loadHistory();
    } catch (err: any) {
      toast.error('Failed to send: ' + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, color: 'var(--t1)' }}>
      <div>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 3 }}>💬 Contact Faculty & Teachers</h1>
          <p style={{ color: 'var(--t3)', fontSize: 13 }}>Send questions directly to your assigned faculty & mentors</p>
        </div>

        <Card>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>Select Teacher / Faculty</label>
              <select
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 10,
                  color: 'var(--t1)',
                  fontSize: 13,
                  outline: 'none'
                }}
              >
                <option value="priya">👩‍💼 Ms. Priya (AI Lead Mentor & Faculty)</option>
                <option value="anish">👨‍💼 Mr. Anish (Systems Engineer & Mentor)</option>
                <option value="admin">🏢 Faculty Admin Desk</option>
              </select>
            </div>
            <Input label="Subject / Topic" value={subj} onChange={(e: any) => setSubj(e.target.value)} placeholder="e.g. Guidance for Assignment 2" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>Message</label>
              <textarea
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder="Explain your query in detail..."
                rows={5}
                style={{
                  width: '100%',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: 10,
                  color: 'var(--t1)',
                  fontSize: 13,
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <Btn type="submit" disabled={sending} style={{ width: '100%', justifyContent: 'center' }}>
              {sending ? 'Sending...' : '📨 Send Message to Teacher'}
            </Btn>
          </form>
        </Card>
      </div>

      <div>
        <h3 style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>📬 Conversation History</h3>
        {history.length === 0 ? <Card onClick={() => {}} hoverable={false}><EmptyState icon="💬" text="No previous queries" action={null} /></Card> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {history.map(m => (
              <Card key={m.id} style={{ padding: 14 }} onClick={() => {}} hoverable={false}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--t1)' }}>{m.subject}</div>
                  <Badge type={m.status === 'Replied' ? 'success' : 'warning'}>{m.status}</Badge>
                </div>
                <p style={{ fontSize: 12, color: 'var(--t2)', margin: '0 0 10px 0', lineHeight: 1.4 }}>{m.message}</p>
                {m.reply && (
                  <div style={{ background: 'var(--bg3)', borderLeft: '3px solid var(--accent)', padding: 10, borderRadius: '0 8px 8px 0', marginTop: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--accent)', marginBottom: 2 }}>Admin Response:</div>
                    <p style={{ fontSize: 12, color: 'var(--t1)', margin: 0, lineHeight: 1.4 }}>{m.reply}</p>
                  </div>
                )}
                <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>Sent: {new Date(m.sentAt).toLocaleString()}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
