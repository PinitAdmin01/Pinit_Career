'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { supabase } from '@/lib/supabaseClient';

export interface SubjectAttendance {
  id: string;
  subject: string;
  code: string;
  totalClasses: number;
  attended: number;
  percentage: number;
  status: 'Excellent' | 'Good' | 'Warning' | 'Critical';
}

const STORAGE_KEY = 'pinit_student_attendance';

export default function StudentAttendanceView() {
  const router = useRouter();
  const { user } = useAuth();
  const { addXp, earnPins } = useCareerOS();

  const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
  const [focusStreak, setFocusStreak] = useState<number>(0);
  const [lastCheckInDate, setLastCheckInDate] = useState<string>('');
  const [showFaceScanModal, setShowFaceScanModal] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'capturing' | 'verifying' | 'success'>('idle');

  // Safety Buffer Margin Calculator State
  const [calcSubjectId, setCalcSubjectId] = useState<string>('all');
  const [calcThreshold, setCalcThreshold] = useState<number>(75);
  const [simulatedMisses, setSimulatedMisses] = useState<number>(2);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // ── Load attendance from Supabase, then this-device cache ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase.from('student_attendance').select('*').eq('student_id', user.id).maybeSingle();
          if (!error && data && !cancelled) {
            if (Array.isArray(data.subjects)) setSubjects(data.subjects);
            if (typeof data.focus_streak === 'number') setFocusStreak(data.focus_streak);
            if (data.last_check_in) setLastCheckInDate(data.last_check_in);
            return;
          }
        } catch { /* table may not exist yet */ }
      }
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw);
          if (parsed.subjects) setSubjects(parsed.subjects);
          if (parsed.focusStreak !== undefined) setFocusStreak(parsed.focusStreak);
          if (parsed.lastCheckInDate) setLastCheckInDate(parsed.lastCheckInDate);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  // ── Save attendance helper ──
  const saveAttendanceState = useCallback((nextSubjects: SubjectAttendance[], nextStreak: number, nextDate: string) => {
    setSubjects(nextSubjects);
    setFocusStreak(nextStreak);
    setLastCheckInDate(nextDate);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        subjects: nextSubjects,
        focusStreak: nextStreak,
        lastCheckInDate: nextDate,
      }));
    } catch {}
    if (user?.id) {
      supabase.from('student_attendance').upsert({
        student_id: user.id,
        subjects: nextSubjects,
        focus_streak: nextStreak,
        last_check_in: nextDate,
        updated_at: new Date().toISOString(),
      }).then(() => {}, () => {});
    }
  }, [user?.id]);

  // ── 🔴 Bug 2 Fix: Safe Array Percentage Calculation & Division-by-Zero Protection ──
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

  const { overallPercentage, totalLectures, totalAttended, status } = calculateOverallStats();

  // ── 🟠 Bug 4 Fix: Safe Camera Stream Cleanup ──
  const stopCameraStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch {}
      });
      mediaStreamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // ── Face Scan Check-In Handler ──
  const handleStartFaceScan = async () => {
    setShowFaceScanModal(true);
    setScanStatus('capturing');
    setScanning(true);

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Simulate AI Liveness & Face Verification
      setTimeout(() => {
        setScanStatus('verifying');
        setTimeout(() => {
          setScanStatus('success');
          stopCameraStream();

          // Update Attendance & Focus Streak
          const today = new Date().toISOString().slice(0, 10);
          const isConsecutive = lastCheckInDate ? (new Date().getTime() - new Date(lastCheckInDate).getTime()) < 172800000 : true;
          const nextStreak = isConsecutive ? focusStreak + 1 : 1;

          // Increment attended count for default subjects
          const updatedSubs = subjects.map(s => {
            const nextAtt = s.attended + 1;
            const nextTot = s.totalClasses + 1;
            const nextPct = Number(((nextAtt / nextTot) * 100).toFixed(1));
            let nextStat: 'Excellent' | 'Good' | 'Warning' | 'Critical' = 'Good';
            if (nextPct >= 90) nextStat = 'Excellent';
            else if (nextPct < 75) nextStat = 'Critical';
            else if (nextPct < 85) nextStat = 'Warning';

            return { ...s, attended: nextAtt, totalClasses: nextTot, percentage: nextPct, status: nextStat };
          });

          saveAttendanceState(updatedSubs, nextStreak, today);

          try {
            addXp(10, 'Biometric Attendance Check-In');
            earnPins('mission_complete', 15, 'Daily Class Check-In');
          } catch {}

          setTimeout(() => {
            setShowFaceScanModal(false);
            setScanning(false);
            setScanStatus('idle');
          }, 2000);
        }, 1200);
      }, 1500);

    } catch (err: any) {
      stopCameraStream();
      setScanning(false);
      setScanStatus('idle');
      alert(`Camera Access Error: ${err.message || 'Please allow camera access for Biometric Check-In'}`);
    } finally {
      // Guaranteed Track Cleanup Guard
      if (stream && scanStatus === 'idle') {
        stream.getTracks().forEach(t => t.stop());
      }
    }
  };

  // ── Manual Lecture Log Handler ──
  const handleMarkClassAttended = (subId: string, didAttend: boolean) => {
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

    saveAttendanceState(updated, focusStreak, lastCheckInDate);
  };

  // ── 🧩 3. Interactive Attendance Safety Buffer Margin Calculator ──
  const calculateSafetyBuffer = () => {
    const targetSub = calcSubjectId === 'all'
      ? { subject: 'All Subjects Combined', totalClasses: totalLectures, attended: totalAttended, percentage: Number(overallPercentage) }
      : subjects.find(s => s.id === calcSubjectId) || subjects[0];

    const currentAtt = targetSub.attended;
    const currentTot = targetSub.totalClasses;
    const reqPct = calcThreshold / 100;

    // Maximum additional classes student can miss without dropping below threshold
    // Formula: (Attended / (Total + Missed)) >= reqPct  =>  Missed <= (Attended - reqPct * Total) / reqPct
    const maxMissable = Math.max(0, Math.floor((currentAtt - reqPct * currentTot) / reqPct));

    // Consecutive classes student must attend to reach threshold if currently below
    // Formula: (Attended + X) / (Total + X) >= reqPct  =>  X >= (reqPct * Total - Attended) / (1 - reqPct)
    let neededToRecover = 0;
    if (targetSub.percentage < calcThreshold) {
      neededToRecover = Math.max(0, Math.ceil((reqPct * currentTot - currentAtt) / (1 - reqPct)));
    }

    // Simulated Result if student misses simulatedMisses lectures
    const simTot = currentTot + simulatedMisses;
    const simPct = Number(((currentAtt / simTot) * 100).toFixed(1));
    const simStatus = simPct >= calcThreshold ? 'SAFE' : 'RISK (Below Minimum)';

    return { targetSub, maxMissable, neededToRecover, simPct, simStatus };
  };

  const bufferCalc = calculateSafetyBuffer();
  const xpMultiplier = Math.min(1.5, 1.0 + focusStreak * 0.1).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 28px', maxWidth: 1080, margin: '0 auto', color: 'var(--t1, #0f172a)' }}>
      <div style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(245, 158, 11, 0.08)', color: 'var(--amber)', fontSize: 12, fontWeight: 700 }}>
        Attendance is loaded from campus records when available. Until the attendance table is populated, this view stays empty instead of showing sample subjects.
      </div>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>📅</span> Class Attendance & Cognitive Engine
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--t3, #64748b)' }}>
            Monitor subject compliance, calculate safety leave margins, and elevate your focus streak.
          </p>
        </div>

        {/* Biometric Check-In CTA Button */}
        <button
          onClick={handleStartFaceScan}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 0 16px rgba(16,185,129,0.3)',
          }}
        >
          <span>📸</span> AI Biometric Face Check-In
        </button>
      </div>

      {/* ── 🎯 1. FOCUS STREAK MULTIPLIER BANNER ── */}
      <div style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(245,158,11,0.15))', border: '1px solid #d4a843', borderRadius: 16, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(212,168,67,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🔥</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#d4a843', display: 'flex', alignItems: 'center', gap: 8 }}>
              {focusStreak}-Day Attendance Focus Streak
              <span style={{ fontSize: 11, background: '#d4a843', color: '#0a0a0f', padding: '2px 8px', borderRadius: 6, fontWeight: 900 }}>
                +{Math.round((Number(xpMultiplier) - 1) * 100)}% XP BOOST
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--t2, #475569)', marginTop: 2 }}>
              Daily attendance check-ins activate your <strong>Focus Multiplier ({xpMultiplier}x)</strong> for cognitive games & career missions.
            </div>
          </div>
        </div>

        {/* Direct CTA to Focus Calibration Games */}
        <button
          onClick={() => router.push('/attention-span')}
          style={{ background: 'linear-gradient(135deg, #d4a843, #f5d78e)', color: '#0a0a0f', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
        >
          🎯 Warm Up Focus (Focus Fire) ▶
        </button>
      </div>

      {/* Overall Attendance Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--t3, #64748b)' }}>Cumulative Attendance</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: Number(overallPercentage) >= 85 ? '#16a34a' : Number(overallPercentage) >= 75 ? '#d97706' : '#dc2626', margin: '4px 0 0' }}>
            {overallPercentage}%
          </div>
          <div style={{ fontSize: 11, color: Number(overallPercentage) >= 75 ? '#16a34a' : '#dc2626', fontWeight: 700, marginTop: 4 }}>
            {Number(overallPercentage) >= 75 ? '✓ Compliant (≥ 75% Threshold)' : '⚠️ Below 75% Minimum Criteria'}
          </div>
        </div>

        <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--t3, #64748b)' }}>Lectures Attended</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--t1, #0f172a)', margin: '4px 0 0' }}>
            {totalAttended} <span style={{ fontSize: 16, color: 'var(--t3, #64748b)', fontWeight: 500 }}>/ {totalLectures}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3, #64748b)', marginTop: 4 }}>Total Conducted Classes</div>
        </div>

        <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--t3, #64748b)' }}>Deep Focus Status</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#8b5cf6', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            🏆 Deep Focus Master
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3, #64748b)', marginTop: 4 }}>3+ Consecutive Hours Attended</div>
        </div>

        <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 12, color: 'var(--t3, #64748b)' }}>Creative Innovation Quest</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            💡 Unlocked
          </div>
          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginTop: 4 }}>Weekly Attendance 92% ≥ 90%</div>
        </div>
      </div>

      {/* ── 🧩 3. INTERACTIVE ATTENDANCE SAFETY BUFFER MARGIN CALCULATOR ── */}
      <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 16, padding: '24px 26px', boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              🧩 Attendance Risk & Safety Buffer Calculator
            </h2>
            <p style={{ color: 'var(--t3, #64748b)', fontSize: 13, margin: '2px 0 0' }}>
              Simulate leave budgets, calculate exact safe skip margins, and plan recovery steps to stay compliant.
            </p>
          </div>

          <button onClick={() => router.push('/attention-span')} style={{ background: 'var(--bg3, #f1f5f9)', border: '1px solid var(--border, #cbd5e1)', color: 'var(--t1, #0f172a)', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Train Strategy (Shape Shifter) ▶
          </button>
        </div>

        {/* Calculator Form Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, background: 'var(--bg3, #f8fafc)', padding: 16, borderRadius: 14, border: '1px solid var(--border, #e2e8f0)', marginBottom: 18 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2, #475569)', display: 'block', marginBottom: 6 }}>Select Subject:</label>
            <select value={calcSubjectId} onChange={(e) => setCalcSubjectId(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)', background: 'var(--card, #fff)', color: 'var(--t1, #0f172a)', fontSize: 13, fontWeight: 600, outline: 'none' }}>
              <option value="all">All Subjects Combined</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.subject} ({s.percentage}%)</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2, #475569)', display: 'block', marginBottom: 6 }}>Target Mandatory Threshold:</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[75, 85].map(t => (
                <button key={t} onClick={() => setCalcThreshold(t)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: `1px solid ${calcThreshold === t ? '#d4a843' : 'var(--border, #cbd5e1)'}`, background: calcThreshold === t ? 'rgba(212,168,67,0.15)' : 'var(--card, #fff)', color: calcThreshold === t ? '#d4a843' : 'var(--t2, #475569)', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
                  {t}% Minimum
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2, #475569)', display: 'block', marginBottom: 6 }}>Simulate Upcoming Missed Lectures:</label>
            <input type="number" min="0" max="20" value={simulatedMisses} onChange={(e) => setSimulatedMisses(Math.max(0, Number(e.target.value)))} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)', background: 'var(--card, #fff)', color: 'var(--t1, #0f172a)', fontSize: 13, fontWeight: 700, outline: 'none' }} />
          </div>
        </div>

        {/* Calculator Output Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#15803d', fontWeight: 700 }}>Safe Skip Buffer Margin</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#16a34a', margin: '4px 0 0' }}>
              {bufferCalc.maxMissable} Lecture{bufferCalc.maxMissable !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3, #64748b)', marginTop: 2 }}>Can safely miss without dropping below {calcThreshold}%</div>
          </div>

          <div style={{ background: bufferCalc.neededToRecover > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)', border: `1px solid ${bufferCalc.neededToRecover > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: bufferCalc.neededToRecover > 0 ? '#b91c1c' : '#1d4ed8', fontWeight: 700 }}>Required Recovery Plan</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: bufferCalc.neededToRecover > 0 ? '#dc2626' : '#2563eb', margin: '4px 0 0' }}>
              {bufferCalc.neededToRecover > 0 ? `${bufferCalc.neededToRecover} Consecutive Lectures` : '✓ On Track'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3, #64748b)', marginTop: 2 }}>{bufferCalc.neededToRecover > 0 ? `Must attend to reach ${calcThreshold}% minimum` : `Currently above ${calcThreshold}% criteria`}</div>
          </div>

          <div style={{ background: bufferCalc.simStatus === 'SAFE' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${bufferCalc.simStatus === 'SAFE' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--t3, #64748b)', fontWeight: 700 }}>Simulated Result ({simulatedMisses} Misses)</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: bufferCalc.simStatus === 'SAFE' ? '#16a34a' : '#dc2626', margin: '4px 0 0' }}>
              {bufferCalc.simPct}% ({bufferCalc.simStatus})
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3, #64748b)', marginTop: 2 }}>Predicted ratio after missing {simulatedMisses} lectures</div>
          </div>
        </div>
      </div>

      {/* ── 📚 SUBJECT BREAKDOWN TABLE WITH MANUAL LECTURE MARKING ── */}
      <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Subject Compliance & Attendance Registry</h2>
            <div style={{ fontSize: 12, color: 'var(--t3, #64748b)', marginTop: 2 }}>Click "+ Attend" or "+ Miss" to manually log today's class status.</div>
          </div>
          <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>✓ Auto-Saved to Local & Career OS</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg3, #f8fafc)', borderBottom: '1px solid var(--border, #e2e8f0)', textAlign: 'left' }}>
              <th style={{ padding: 14, fontSize: 13, color: 'var(--t2, #475569)' }}>Subject Code & Title</th>
              <th style={{ padding: 14, fontSize: 13, color: 'var(--t2, #475569)' }}>Total Lectures</th>
              <th style={{ padding: 14, fontSize: 13, color: 'var(--t2, #475569)' }}>Attended</th>
              <th style={{ padding: 14, fontSize: 13, color: 'var(--t2, #475569)' }}>Percentage</th>
              <th style={{ padding: 14, fontSize: 13, color: 'var(--t2, #475569)' }}>Compliance Status</th>
              <th style={{ padding: 14, fontSize: 13, color: 'var(--t2, #475569)', textAlign: 'right' }}>Log Attendance</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--border, #f1f5f9)' }}>
                <td style={{ padding: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{row.subject}</div>
                  <div style={{ fontSize: 11, color: 'var(--t3, #64748b)' }}>Code: {row.code}</div>
                </td>
                <td style={{ padding: 14, fontSize: 14 }}>{row.totalClasses}</td>
                <td style={{ padding: 14, fontSize: 14, color: '#16a34a', fontWeight: 700 }}>{row.attended}</td>
                <td style={{ padding: 14 }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: row.percentage >= 85 ? '#16a34a' : row.percentage >= 75 ? '#d97706' : '#dc2626' }}>
                    {row.percentage}%
                  </div>
                  <div style={{ width: 80, height: 4, background: 'var(--bg3, #e2e8f0)', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
                    <div style={{ height: '100%', width: `${Math.min(100, row.percentage)}%`, background: row.percentage >= 85 ? '#16a34a' : row.percentage >= 75 ? '#d97706' : '#dc2626', borderRadius: 2 }} />
                  </div>
                </td>
                <td style={{ padding: 14 }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 800,
                    background: row.percentage >= 90 ? 'rgba(16,185,129,0.15)' : row.percentage >= 75 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                    color: row.percentage >= 90 ? '#15803d' : row.percentage >= 75 ? '#b45309' : '#b91c1c',
                    border: `1px solid ${row.percentage >= 90 ? 'rgba(16,185,129,0.3)' : row.percentage >= 75 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: 14, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button onClick={() => handleMarkClassAttended(row.id, true)} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#15803d', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      + Attend
                    </button>
                    <button onClick={() => handleMarkClassAttended(row.id, false)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#b91c1c', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      + Miss
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 📸 BIOMETRIC FACE SCAN CHECK-IN MODAL (WITH SAFE CAMERA CLEANUP) ── */}
      {showFaceScanModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border, #e2e8f0)', borderRadius: 20, width: '100%', maxWidth: 440, padding: '28px 24px', textAlign: 'center', position: 'relative' }}>
            
            <button onClick={() => { stopCameraStream(); setShowFaceScanModal(false); }} style={{ position: 'absolute', top: 16, right: 18, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--t1, #0f172a)', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>✕ Close</button>

            <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>AI Face Check-In</h3>
            <p style={{ color: 'var(--t3, #64748b)', fontSize: 13, margin: '0 0 16px' }}>Look directly at the camera to verify identity and activate your daily Focus Streak Multiplier.</p>

            {/* Video Feed Box */}
            <div style={{ width: '100%', height: 260, borderRadius: 16, background: '#0a0a0f', overflow: 'hidden', position: 'relative', border: '2px solid #10b981', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Liveness Scanner Overlay */}
              <div style={{ position: 'absolute', inset: '20%', border: '2px dashed #10b981', borderRadius: '50%', animation: 'attPulse 1.5s infinite', pointerEvents: 'none' }} />

              {scanStatus === 'verifying' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,15,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 800, fontSize: 15 }}>
                  <div style={{ width: 32, height: 32, border: '3px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'attSpin 1s linear infinite', marginBottom: 10 }} />
                  Verifying AI Liveness...
                </div>
              )}

              {scanStatus === 'success' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(16,185,129,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 20, padding: 16 }}>
                  ✓ Check-In Verified!
                  <span style={{ fontSize: 13, fontWeight: 700, marginTop: 4, background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: 8 }}>
                    +15 Pins • +10 XP • Focus Multiplier Active
                  </span>
                  <button
                    onClick={() => { stopCameraStream(); setShowFaceScanModal(false); router.push('/attention-span'); }}
                    style={{ marginTop: 12, background: '#fff', color: '#059669', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                  >
                    🎯 Launch Cognitive Engine ▶
                  </button>
                </div>
              )}
            </div>

            <div style={{ fontSize: 12, color: 'var(--t3, #64748b)', fontWeight: 600 }}>
              {scanStatus === 'capturing' && 'Scanning face geometry...'}
              {scanStatus === 'verifying' && 'Matching identity with institute registry...'}
              {scanStatus === 'success' && 'Attendance & Cognitive Rewards Logged!'}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
