'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { api } from '@/lib/api/client';
import { portalService, EnrolledStudent } from '@/lib/services/portalService';

export interface SubjectAttendance {
  id: string;
  subject: string;
  code: string;
  totalClasses: number;
  attended: number;
  percentage: number;
  status: 'Excellent' | 'Good' | 'Warning' | 'Critical';
}

interface SubmittedLeave {
  id: string;
  category: string;
  reason: string;
  dates: string;
  status: string;
}

const STORAGE_KEY = 'pinit_student_attendance';

export default function StudentAttendanceView() {
  const router = useRouter();
  const { user } = useAuth();
  const isFacultyOrAdmin = Boolean(user?.role && ['admin', 'superadmin', 'teacher', 'faculty'].includes(user.role));

  // State for faculty student picker
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [loadingStudent, setLoadingStudent] = useState<boolean>(false);

  // Student Attendance State
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
  const [focusStreak, setFocusStreak] = useState<number>(0);
  const [lastCheckInDate, setLastCheckInDate] = useState<string>('');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Safety Buffer Margin Calculator State
  const [calcSubjectId, setCalcSubjectId] = useState<string>('all');
  const [calcThreshold, setCalcThreshold] = useState<number>(75);
  const [simulatedMisses, setSimulatedMisses] = useState<number>(2);

  // Leave Request Submission State (Backed by services_leaves and /api/services/apply-leave)
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [leaveReason, setLeaveReason] = useState<string>('');
  const [leaveCategory, setLeaveCategory] = useState<'Medical' | 'Academic' | 'Personal'>('Medical');
  const [leaveStartDate, setLeaveStartDate] = useState<string>('');
  const [leaveEndDate, setLeaveEndDate] = useState<string>('');
  const [isSubmittingLeave, setIsSubmittingLeave] = useState<boolean>(false);
  const [submittedLeaves, setSubmittedLeaves] = useState<SubmittedLeave[]>([]);

  // ── Load faculty roster if user is staff/teacher ──
  useEffect(() => {
    if (!isFacultyOrAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await portalService.getEnrolledStudents();
        if (!cancelled && Array.isArray(list) && list.length > 0) {
          setEnrolledStudents(list);
          setSelectedStudentId(list[0].id);
        }
      } catch (err) {
        console.warn('[Attendance] Failed to load student roster for faculty:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [isFacultyOrAdmin]);

  // Determine effective student whose records are being viewed/managed
  const effectiveStudentId = isFacultyOrAdmin ? selectedStudentId : (user?.id || '');

  // ── Load attendance and leaves from Supabase ──
  const loadAttendanceForStudent = useCallback(async (targetId: string) => {
    if (!targetId) {
      setSubjects([]);
      setFocusStreak(0);
      setLastCheckInDate('');
      return;
    }
    setLoadingStudent(true);
    try {
      const { data, error } = await supabase
        .from('student_attendance')
        .select('*')
        .eq('student_id', targetId)
        .maybeSingle();

      if (!error && data) {
        if (Array.isArray(data.subjects)) setSubjects(data.subjects);
        else setSubjects([]);
        if (typeof data.focus_streak === 'number') setFocusStreak(data.focus_streak);
        if (data.last_check_in) setLastCheckInDate(data.last_check_in);
      } else {
        // Check local storage fallback for non-production / offline testing
        try {
          const raw = localStorage.getItem(`${STORAGE_KEY}_${targetId}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed.subjects)) setSubjects(parsed.subjects);
            else setSubjects([]);
            if (typeof parsed.focusStreak === 'number') setFocusStreak(parsed.focusStreak);
            if (parsed.lastCheckInDate) setLastCheckInDate(parsed.lastCheckInDate);
          } else {
            setSubjects([]);
            setFocusStreak(0);
            setLastCheckInDate('');
          }
        } catch {
          setSubjects([]);
        }
      }
    } catch (err) {
      console.warn('[Attendance] Query notice:', err);
      setSubjects([]);
    } finally {
      setLoadingStudent(false);
    }
  }, []);

  // ── Load leave applications from authoritative services_leaves via /api/services/stats ──
  const loadLeaves = useCallback(async (targetId: string) => {
    if (!targetId) return;
    try {
      const d = await api.get<{ leaves: Array<{ id: string; startDate: string; endDate: string; reason: string; type: string; status: string }> }>(
        `/api/services/stats?studentId=${encodeURIComponent(targetId)}`
      );
      if (d && Array.isArray(d.leaves)) {
        setSubmittedLeaves(
          d.leaves.map(l => ({
            id: l.id,
            category: l.type || 'General',
            reason: l.reason,
            dates: `${l.startDate} to ${l.endDate || l.startDate}`,
            status: l.status || 'Pending Review'
          }))
        );
      }
    } catch {
      // Direct query fallback on services_leaves
      try {
        const { data: leavesData } = await supabase
          .from('services_leaves')
          .select('*')
          .eq('student_id', targetId);
        if (leavesData && leavesData.length > 0) {
          setSubmittedLeaves(
            leavesData.map((l: any) => ({
              id: l.id,
              category: l.type || 'General',
              reason: l.reason || '',
              dates: `${l.start_date || ''} to ${l.end_date || l.start_date || ''}`,
              status: l.status || 'Pending'
            }))
          );
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (effectiveStudentId) {
      loadAttendanceForStudent(effectiveStudentId);
      loadLeaves(effectiveStudentId);
    }
  }, [effectiveStudentId, loadAttendanceForStudent, loadLeaves]);

  // ── Leave Application Handler (Submits to /api/services/apply-leave -> services_leaves) ──
  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason || !leaveStartDate) return;
    setIsSubmittingLeave(true);

    try {
      await api.post('/api/services/apply-leave', {
        startDate: leaveStartDate,
        endDate: leaveEndDate || leaveStartDate,
        reason: leaveReason,
        type: leaveCategory
      });

      // Insert notification for the student confirming submission
      if (user?.id) {
        const { error: notifErr } = await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'info',
          title: 'Class Leave Application Filed',
          message: `Leave application for ${leaveStartDate} to ${leaveEndDate || leaveStartDate} submitted. Sent to faculty mentors for formal approval.`,
          source: 'attendance',
          is_read: false,
          created_at: new Date().toISOString()
        });
        if (notifErr) {
          console.warn('[Attendance] Notification insert notice:', notifErr.message);
        }
      }

      alert('Leave application submitted successfully! It has been recorded in the campus registry and routed to your faculty mentor.');
      setShowLeaveModal(false);
      setLeaveReason('');
      setLeaveStartDate('');
      setLeaveEndDate('');
      if (effectiveStudentId) {
        loadLeaves(effectiveStudentId);
      }
    } catch (err: any) {
      alert(`Failed to file leave application: ${err.message || 'Server error'}`);
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  // ── Safe Percentage Calculation ──
  const calculateOverallStats = () => {
    if (!subjects || subjects.length === 0) {
      return { overallPercentage: '0.0', totalLectures: 0, totalAttended: 0, status: 'No Data' };
    }
    const totalLectures = subjects.reduce((acc, curr) => acc + (curr.totalClasses || 0), 0);
    const totalAttended = subjects.reduce((acc, curr) => acc + (curr.attended || 0), 0);
    const safeTotalLectures = totalLectures || 1;
    const safeLen = subjects.length || 1;
    const avgPercentage = totalLectures > 0
      ? (totalAttended / safeTotalLectures) * 100
      : (subjects.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / safeLen);
    const overallPercentage = isNaN(avgPercentage) ? '0.0' : avgPercentage.toFixed(1);

    let status = 'Good';
    if (Number(overallPercentage) >= 90) status = 'Excellent';
    else if (Number(overallPercentage) < 75) status = 'Critical';
    else if (Number(overallPercentage) < 85) status = 'Warning';

    return { overallPercentage, totalLectures, totalAttended, status };
  };

  const { overallPercentage, totalLectures, totalAttended } = calculateOverallStats();

  // ── Faculty Attendance Update Handler (Strictly Role-Gated) ──
  const handleMarkClassAttended = async (subId: string, didAttend: boolean) => {
    if (!isFacultyOrAdmin) {
      alert('Permission Denied: Official subject attendance records can only be updated by verified faculty mentors or campus administrators.');
      return;
    }
    if (!effectiveStudentId) {
      alert('Please select a student from the roster above before recording attendance.');
      return;
    }

    const updated = subjects.map(s => {
      if (s.id !== subId) return s;
      const nextAtt = didAttend ? s.attended + 1 : s.attended;
      const nextTot = s.totalClasses + 1;
      const nextPct = Number(((nextAtt / nextTot) * 100).toFixed(1));
      let nextStat: 'Excellent' | 'Good' | 'Warning' | 'Critical' = 'Good';
      if (nextPct >= 90) nextStat = 'Excellent';
      else if (nextPct < 75) nextStat = 'Critical';
      else if (nextPct < 85) nextStat = 'Warning';

      return { ...s, attended: nextAtt, totalClasses: nextTot, percentage: nextPct, status: nextStat };
    });

    setSubjects(updated);

    // Persist to Supabase student_attendance using authorized faculty credentials
    const { error: upsertErr } = await supabase.from('student_attendance').upsert({
      student_id: effectiveStudentId,
      subjects: updated,
      focus_streak: focusStreak,
      last_check_in: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    });

    if (upsertErr) {
      console.warn('[Attendance] Supabase upsert notice:', upsertErr.message);
      setSaveFeedback('⚠️ Offline Mode: Saved to browser cache.');
    } else {
      setSaveFeedback('✓ Saved to Authoritative Database');
    }

    try {
      localStorage.setItem(`${STORAGE_KEY}_${effectiveStudentId}`, JSON.stringify({
        subjects: updated,
        focusStreak,
        lastCheckInDate: new Date().toISOString().split('T')[0],
      }));
    } catch {}

    setTimeout(() => setSaveFeedback(null), 3500);
  };

  // ── Safety Buffer Margin Calculator ──
  const calculateSafetyBuffer = () => {
    const targetSub = calcSubjectId === 'all'
      ? { subject: 'All Subjects Combined', totalClasses: totalLectures, attended: totalAttended, percentage: Number(overallPercentage) }
      : subjects.find(s => s.id === calcSubjectId) || { subject: 'No Subjects', totalClasses: 0, attended: 0, percentage: 0 };

    const currentAtt = targetSub.attended;
    const currentTot = targetSub.totalClasses;
    const reqPct = calcThreshold / 100;

    const maxMissable = Math.max(0, Math.floor((currentAtt - reqPct * currentTot) / (reqPct || 1)));

    let neededToRecover = 0;
    if (targetSub.percentage < calcThreshold) {
      neededToRecover = Math.max(0, Math.ceil((reqPct * currentTot - currentAtt) / Math.max(0.01, 1 - reqPct)));
    }

    const simTot = currentTot + simulatedMisses;
    const simPct = simTot > 0 ? Number(((currentAtt / simTot) * 100).toFixed(1)) : 0;
    const simStatus = simPct >= calcThreshold ? 'SAFE' : 'RISK (Below Minimum)';

    return { targetSub, maxMissable, neededToRecover, simPct, simStatus };
  };

  const bufferCalc = calculateSafetyBuffer();
  const selectedStudentObj = enrolledStudents.find(s => s.id === selectedStudentId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 28px', maxWidth: 1080, margin: '0 auto', color: 'var(--t1, #0f172a)' }}>
      
      {/* Institutional Attendance Invariant Notice */}
      <div style={{
        padding: '14px 18px',
        borderRadius: 12,
        border: '1px solid var(--border)',
        background: 'var(--bg2)',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <span style={{ fontSize: 20 }}>🏛️</span>
        <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--t1)' }}>Official Campus Attendance Registry:</strong> Official classroom attendance is recorded exclusively by faculty mentors during lecture sessions and verified campus biometric hardware. Student self-marking is not permitted.
        </div>
      </div>

      {/* Faculty Mode: Student Selector Card */}
      {isFacultyOrAdmin && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.08))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 16,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>👨‍🏫</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>
                Faculty Attendance Control Desk
              </span>
              <span style={{ fontSize: 11, background: 'rgba(59, 130, 246, 0.2)', color: '#2563eb', padding: '2px 8px', borderRadius: 6, fontWeight: 800 }}>
                STAFF OVERRIDE ACTIVE
              </span>
            </div>
            {saveFeedback && (
              <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 800 }}>
                {saveFeedback}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)' }}>
              Select Student to View & Manage Records:
            </label>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              style={{
                flex: 1,
                minWidth: 260,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                color: 'var(--t1)',
                fontSize: 13,
                fontWeight: 600,
                outline: 'none'
              }}
            >
              {enrolledStudents.map(st => (
                <option key={st.id} value={st.id}>
                  {st.name} {st.rollNo ? `(${st.rollNo})` : ''} - {st.email}
                </option>
              ))}
            </select>
          </div>

          {selectedStudentObj && (
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>
              Currently managing attendance for: <strong>{selectedStudentObj.name}</strong> ({selectedStudentObj.rollNo || selectedStudentObj.id})
            </div>
          )}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>📅</span> Class Attendance & Academic Compliance
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--t3)' }}>
            Monitor curricular threshold compliance, calculate safety leave margins, and track official faculty endorsements.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowLeaveModal(true)}
            style={{
              background: 'var(--card)', color: 'var(--t1)', border: '1px solid var(--border)',
              padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            <span>📄</span> Apply for Class Leave
          </button>
        </div>
      </div>

      {/* ── 🎯 1. ATTENDANCE CADENCE BANNER ── */}
      <div style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.12), rgba(var(--warning-rgb), 0.12))', border: '1px solid #d4a843', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(212,168,67,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📅</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#d4a843', display: 'flex', alignItems: 'center', gap: 8 }}>
              {focusStreak > 0 ? `${focusStreak}-Day Lecture Attendance Continuity` : 'Official Academic Session Active'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--t2)', marginTop: 2 }}>
              {lastCheckInDate ? `Last lecture attendance recorded on ${lastCheckInDate}.` : 'Attendance is synchronized with the institutional lecture timetable.'}
            </div>
          </div>
        </div>
      </div>

      {/* ── 📊 2. DYNAMIC ATTENDANCE STAT CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {/* Cumulative Attendance */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Cumulative Attendance</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: Number(overallPercentage) >= 85 ? '#16a34a' : Number(overallPercentage) >= 75 ? '#d97706' : 'var(--danger-deep)', margin: '4px 0 0' }}>
            {overallPercentage}%
          </div>
          <div style={{ fontSize: 11, color: Number(overallPercentage) >= 75 ? '#16a34a' : 'var(--danger-deep)', fontWeight: 700, marginTop: 4 }}>
            {Number(overallPercentage) >= 75 ? '✓ Compliant (≥ 75% Threshold)' : '⚠️ Below 75% Minimum Criteria'}
          </div>
        </div>

        {/* Lectures Attended */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Lectures Attended</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--t1)', margin: '4px 0 0' }}>
            {totalAttended} <span style={{ fontSize: 16, color: 'var(--t3)', fontWeight: 500 }}>/ {totalLectures}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>Total Conducted Classes</div>
        </div>

        {/* Attendance Continuity (Dynamic) */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Attendance Streak</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: focusStreak >= 3 ? '#d97706' : 'var(--t1)', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            {focusStreak >= 3 ? '🔥 Consistent Learner' : '📚 Standard Cadence'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 4 }}>
            {focusStreak > 0 ? `${focusStreak} consecutive days attended` : 'No active streak'}
          </div>
        </div>

        {/* Curricular Status (Dynamic) */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Curricular Status</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: Number(overallPercentage) >= 85 ? '#16a34a' : Number(overallPercentage) >= 75 ? '#d97706' : '#dc2626', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            {Number(overallPercentage) >= 85 ? '✅ Honors Eligible' : Number(overallPercentage) >= 75 ? '⚠️ Standard Eligible' : '🚨 Shortage Risk'}
          </div>
          <div style={{ fontSize: 11, color: Number(overallPercentage) >= 75 ? '#16a34a' : '#dc2626', fontWeight: 700, marginTop: 4 }}>
            {Number(overallPercentage) >= 75 ? 'Meets Hall Ticket Clearance' : 'Condonation Approval Required'}
          </div>
        </div>
      </div>

      {/* ── 🧩 3. ATTENDANCE SAFETY BUFFER MARGIN CALCULATOR ── */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              🧩 Attendance Risk & Safety Buffer Calculator
            </h2>
            <p style={{ color: 'var(--t3)', fontSize: 13, margin: '2px 0 0' }}>
              Simulate leave budgets, calculate exact safe skip margins, and plan recovery steps to maintain examination eligibility.
            </p>
          </div>
          <button onClick={() => router.push('/attention-span')} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Attention Training ▶
          </button>
        </div>

        {/* Calculator Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, background: 'var(--bg3)', padding: 16, borderRadius: 14, border: '1px solid var(--border)', marginBottom: 18 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>Select Subject:</label>
            <select value={calcSubjectId} onChange={(e) => setCalcSubjectId(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--t1)', fontSize: 13, fontWeight: 600, outline: 'none' }}>
              <option value="all">All Subjects Combined</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.subject} ({s.percentage}%)</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>Mandatory Criteria:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[75, 85].map(t => (
                <button key={t} onClick={() => setCalcThreshold(t)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${calcThreshold === t ? '#d4a843' : 'var(--border)'}`, background: calcThreshold === t ? 'rgba(212,168,67,0.15)' : 'var(--card)', color: calcThreshold === t ? '#d4a843' : 'var(--t2)', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
                  {t}% Minimum
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', display: 'block', marginBottom: 6 }}>Simulate Upcoming Missed Lectures:</label>
            <input type="number" min="0" max="20" value={simulatedMisses} onChange={(e) => setSimulatedMisses(Math.max(0, Number(e.target.value)))} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--t1)', fontSize: 13, fontWeight: 700, outline: 'none' }} />
          </div>
        </div>

        {/* Output Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <div style={{ background: 'rgba(var(--success-rgb), 0.08)', border: '1px solid rgba(var(--success-rgb), 0.3)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#15803d', fontWeight: 700 }}>Safe Skip Buffer Margin</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#16a34a', margin: '4px 0 0' }}>
              {bufferCalc.maxMissable} Lecture{bufferCalc.maxMissable !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>Can safely miss without dropping below {calcThreshold}%</div>
          </div>

          <div style={{ background: bufferCalc.neededToRecover > 0 ? 'rgba(var(--danger-rgb), 0.08)' : 'rgba(var(--info-rgb), 0.08)', border: `1px solid ${bufferCalc.neededToRecover > 0 ? 'rgba(var(--danger-rgb), 0.3)' : 'rgba(var(--info-rgb), 0.3)'}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: bufferCalc.neededToRecover > 0 ? '#b91c1c' : '#1d4ed8', fontWeight: 700 }}>Required Recovery Plan</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: bufferCalc.neededToRecover > 0 ? 'var(--danger-deep)' : '#2563eb', margin: '4px 0 0' }}>
              {bufferCalc.neededToRecover > 0 ? `${bufferCalc.neededToRecover} Consecutive Lectures` : '✓ On Track'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{bufferCalc.neededToRecover > 0 ? `Must attend to reach ${calcThreshold}% minimum` : `Currently above ${calcThreshold}% criteria`}</div>
          </div>

          <div style={{ background: bufferCalc.simStatus === 'SAFE' ? 'rgba(var(--success-rgb), 0.08)' : 'rgba(var(--danger-rgb), 0.08)', border: `1px solid ${bufferCalc.simStatus === 'SAFE' ? 'rgba(var(--success-rgb), 0.3)' : 'rgba(var(--danger-rgb), 0.3)'}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700 }}>Simulated Result ({simulatedMisses} Misses)</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: bufferCalc.simStatus === 'SAFE' ? '#16a34a' : 'var(--danger-deep)', margin: '4px 0 0' }}>
              {bufferCalc.simPct}% ({bufferCalc.simStatus})
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>Predicted ratio after missing {simulatedMisses} lectures</div>
          </div>
        </div>
      </div>

      {/* ── 📚 4. SUBJECT BREAKDOWN TABLE ── */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Subject Compliance & Attendance Registry</h2>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
              {isFacultyOrAdmin
                ? "Faculty Mode: Use '+ Attend' or '+ Miss' to record official academic registry updates."
                : "Official subject attendance records maintained by faculty mentors."}
            </div>
          </div>
          {loadingStudent && <span style={{ fontSize: 12, color: 'var(--t2)' }}>Loading student records...</span>}
        </div>

        {subjects.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>
            No subject attendance records found for this student. Records appear once faculty conducts lecture sessions.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: 14, fontSize: 13, color: 'var(--t2)' }}>Subject Code & Title</th>
                <th style={{ padding: 14, fontSize: 13, color: 'var(--t2)' }}>Total Lectures</th>
                <th style={{ padding: 14, fontSize: 13, color: 'var(--t2)' }}>Attended</th>
                <th style={{ padding: 14, fontSize: 13, color: 'var(--t2)' }}>Percentage</th>
                <th style={{ padding: 14, fontSize: 13, color: 'var(--t2)' }}>Compliance Status</th>
                <th style={{ padding: 14, fontSize: 13, color: 'var(--t2)', textAlign: 'right' }}>
                  {isFacultyOrAdmin ? 'Faculty Action' : 'Verification'}
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{row.subject}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>Code: {row.code}</div>
                  </td>
                  <td style={{ padding: 14, fontSize: 14 }}>{row.totalClasses}</td>
                  <td style={{ padding: 14, fontSize: 14, color: '#16a34a', fontWeight: 700 }}>{row.attended}</td>
                  <td style={{ padding: 14 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: row.percentage >= 85 ? '#16a34a' : row.percentage >= 75 ? '#d97706' : 'var(--danger-deep)' }}>
                      {row.percentage}%
                    </div>
                    <div style={{ width: 80, height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
                      <div style={{ height: '100%', width: `${Math.min(100, row.percentage)}%`, background: row.percentage >= 85 ? '#16a34a' : row.percentage >= 75 ? '#d97706' : 'var(--danger-deep)', borderRadius: 2 }} />
                    </div>
                  </td>
                  <td style={{ padding: 14 }}>
                    <span
                      aria-label={`Attendance compliance: ${row.status}, ${row.percentage}% attended`}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        background: row.percentage >= 90 ? 'rgba(var(--success-rgb), 0.15)' : row.percentage >= 75 ? 'rgba(var(--warning-rgb), 0.15)' : 'rgba(var(--danger-rgb), 0.15)',
                        color: row.percentage >= 90 ? '#15803d' : row.percentage >= 75 ? '#b45309' : '#b91c1c',
                        border: `1px solid ${row.percentage >= 90 ? 'rgba(var(--success-rgb), 0.3)' : row.percentage >= 75 ? 'rgba(var(--warning-rgb), 0.3)' : 'rgba(var(--danger-rgb), 0.3)'}`,
                      }}
                    >
                      <span>{row.percentage >= 90 ? '✓' : row.percentage >= 75 ? '⚡' : '⛔'}</span>
                      <span>{row.percentage >= 90 ? 'Safe: Excellent' : row.percentage >= 75 ? 'Safe: Good' : 'Critical Shortage'}</span>
                    </span>
                  </td>
                  <td style={{ padding: 14, textAlign: 'right' }}>
                    {isFacultyOrAdmin ? (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button onClick={() => handleMarkClassAttended(row.id, true)} style={{ background: 'rgba(var(--success-rgb), 0.15)', border: '1px solid #10b981', color: '#15803d', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          + Attend
                        </button>
                        <button onClick={() => handleMarkClassAttended(row.id, false)} style={{ background: 'rgba(var(--danger-rgb), 0.15)', border: '1px solid #ef4444', color: '#b91c1c', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          + Miss
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          🔒 Faculty Verified
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── 📄 5. SUBMITTED LEAVE APPLICATIONS (FROM services_leaves) ── */}
      {submittedLeaves.length > 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Submitted Leave Applications</h2>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>Official record of student leave requests recorded in the campus registry.</div>
            </div>
            <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 700 }}>{submittedLeaves.length} Application{submittedLeaves.length !== 1 ? 's' : ''}</span>
          </div>

          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {submittedLeaves.map(leave => (
              <div key={leave.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--t1)' }}>{leave.id}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>{leave.category}</span>
                    <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600 }}>• {leave.dates}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>Reason: {leave.reason}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: 'rgba(234, 179, 8, 0.12)', color: '#b45309', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                    ⏳ {leave.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 📄 STUDENT LEAVE APPLICATION MODAL ── */}
      {showLeaveModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, width: '100%', maxWidth: 480, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>📄 Apply for Class Leave</h3>
              <button onClick={() => setShowLeaveModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--t1)' }}>✕</button>
            </div>

            <form onSubmit={handleApplyLeave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4, color: 'var(--t2)' }}>Leave Category</label>
                <select
                  value={leaveCategory}
                  onChange={(e) => setLeaveCategory(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 }}
                >
                  <option value="Medical">Medical Leave (Requires Doctor Note)</option>
                  <option value="Academic">Academic / Hackathon / Conference</option>
                  <option value="Personal">Personal / Family Emergency</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4, color: 'var(--t2)' }}>Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4, color: 'var(--t2)' }}>End Date (Optional)</label>
                  <input
                    type="date"
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4, color: 'var(--t2)' }}>Reason & Justification</label>
                <textarea
                  required
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="State the reason for absence for your faculty mentor's review..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--t2)', cursor: 'pointer', fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLeave}
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: 13 }}
                >
                  {isSubmittingLeave ? 'Submitting...' : 'Submit to Faculty Mentor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
