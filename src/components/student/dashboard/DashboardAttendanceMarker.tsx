'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import {
  studentAttendanceService,
  StudentAttendanceRecord,
  getTodayDateString,
} from '@/lib/services/studentAttendanceService';

interface Props {
  onCheckInSuccess?: (record: StudentAttendanceRecord) => void;
}

export default function DashboardAttendanceMarker({ onCheckInSuccess }: Props) {
  const { user } = useAuth();
  const cOS = useCareerOS();
  const [record, setRecord] = useState<StudentAttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const autoCheckInAttempted = useRef(false);

  const studentId = user?.id || 'guest_student';
  const todayStr = getTodayDateString();

  // Load attendance record and auto-record if not yet checked in today
  useEffect(() => {
    let isMounted = true;

    async function syncAttendance() {
      try {
        const data = await studentAttendanceService.getAttendance(studentId);
        if (!isMounted) return;
        setRecord(data);

        // Auto-mark check-in upon dashboard load / student activity
        if (!autoCheckInAttempted.current && data.last_check_in !== todayStr) {
          autoCheckInAttempted.current = true;
          const res = await studentAttendanceService.markDailyCheckIn(studentId, data);
          if (isMounted && res.success && res.record) {
            setRecord(res.record);
            try {
              if (typeof cOS.earnPins === 'function') {
                cOS.earnPins('daily_login', 10, 'Daily Campus Attendance Auto-Check');
              }
              if (typeof cOS.addXp === 'function') {
                cOS.addXp(25, 'Daily Attendance Verification');
              }
            } catch {}
            if (onCheckInSuccess) onCheckInSuccess(res.record);
          }
        }
      } catch (err) {
        console.warn('Attendance auto-sync notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    syncAttendance();

    // Listen for external activity events (e.g. quest or mission completions)
    const handleActivity = () => {
      syncAttendance();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('pinit:attendance_checked_in', handleActivity);
      window.addEventListener('pinit:quest_completed', handleActivity);
      window.addEventListener('pinit:mission_completed', handleActivity);
      return () => {
        isMounted = false;
        window.removeEventListener('pinit:attendance_checked_in', handleActivity);
        window.removeEventListener('pinit:quest_completed', handleActivity);
        window.removeEventListener('pinit:mission_completed', handleActivity);
      };
    }
    return () => { isMounted = false; };
  }, [studentId, todayStr]);

  const isCheckedInToday = record?.last_check_in === todayStr;
  const pct = record?.percentage || 85;
  const isSafe = pct >= 75;
  const isCritical = pct < 65;

  return (
    <div
      data-testid="attendance-marker-root"
      className="db-glass"
      style={{
        padding: '16px 22px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(10,14,23,0.55) 100%)',
        border: '1.5px solid rgba(16,185,129,0.3)',
        boxShadow: '0 8px 24px -4px rgba(16,185,129,0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>✅</span>
          <div>
            <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              CAMPUS ATTENDANCE &amp; 75% ELIGIBILITY
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 900, color: 'var(--t1)', margin: '2px 0 0', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8 }}>
              Today&apos;s Attendance Recorded
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.18)', color: '#10b981', border: '1px solid rgba(16,185,129,0.35)' }}>
                ✓ Auto-Recorded
              </span>
            </h4>
          </div>
        </div>

        {/* 75% Criteria Status Badge + Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 11.5,
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              background: isSafe ? 'rgba(16,185,129,0.15)' : isCritical ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
              color: isSafe ? '#10b981' : isCritical ? '#ef4444' : '#f59e0b',
              border: `1px solid ${isSafe ? 'rgba(16,185,129,0.3)' : isCritical ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
            }}
          >
            {isSafe ? `✓ Safe (${pct}%) — Exam Eligible` : `⚠️ Warning (${pct}%) — Below 75%`}
          </span>

          <span
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: 11.5,
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg3)',
              color: 'var(--t2)',
              border: '1px solid var(--border)',
            }}
          >
            🔥 {record?.focus_streak || 1} Day Streak
          </span>
        </div>
      </div>

      {/* Verification details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.45, maxWidth: 640 }}>
          <span>
            Institutional attendance is automatically confirmed for <strong style={{ color: 'var(--t1)' }}>{todayStr}</strong>. Your cumulative record is <strong style={{ color: '#10b981' }}>{pct}%</strong> ({record?.attended_classes ?? 17} of {record?.total_classes ?? 20} sessions). Complete daily learning quests and missions to maintain your streak.
          </span>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 8, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: 12.5, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          <span>✓</span> Attendance Present &middot; +10 Pins
        </div>
      </div>
    </div>
  );
}
