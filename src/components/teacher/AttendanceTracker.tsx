'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { portalService, AttendanceRecord } from '@/lib/services/portalService';

export default function AttendanceTracker() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [batch, setBatch] = useState<string>('Batch 2024-A');
  const [students, setStudents] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadAttendance = useCallback(async () => {
    setLoading(true);
    const records = await portalService.getAttendanceByDateAndBatch(date, batch);
    setStudents(Array.isArray(records) ? records : []);
    setLoading(false);
    setIsDirty(false);
  }, [date, batch]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  // Cleanup saved timer on unmount
  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  function handleDateChange(newDate: string) {
    if (isDirty && !window.confirm('You have unsaved attendance changes. Discard and switch date?')) return;
    setDate(newDate);
  }

  function handleBatchChange(newBatch: string) {
    if (isDirty && !window.confirm('You have unsaved attendance changes. Discard and switch batch?')) return;
    setBatch(newBatch);
  }

  function setStatus(id: string, status: 'present' | 'absent' | 'late') {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
    setSaved(false);
    setIsDirty(true);
  }

  function markAllPresent() {
    setStudents(students.map(s => ({ ...s, status: 'present' })));
    setSaved(false);
    setIsDirty(true);
  }

  async function handleSave() {
    await portalService.saveAttendance(students);
    setSaved(true);
    setIsDirty(false);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setSaved(false), 3000);
  }

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--t1, #0f172a)' }}>📋 Persistent Attendance Tracker</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--t3, #64748b)' }}>Record and query student presence across dates and assigned batches.</p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="date"
            value={date}
            onChange={e => handleDateChange(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)' }}
          />

          <select
            value={batch}
            onChange={e => handleBatchChange(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border, #cbd5e1)' }}
          >
            <option value="Batch 2024-A">Batch 2024-A (CS & AI)</option>
            <option value="Batch 2025-B">Batch 2025-B (Data Science)</option>
          </select>
        </div>
      </div>

      {/* Summary Pills */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ padding: '6px 14px', borderRadius: 20, background: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: 13 }}>
          Present: {presentCount}
        </span>
        <span style={{ padding: '6px 14px', borderRadius: 20, background: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: 13 }}>
          Absent: {absentCount}
        </span>
        <span style={{ padding: '6px 14px', borderRadius: 20, background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: 13 }}>
          Late: {lateCount}
        </span>

        <button
          onClick={markAllPresent}
          style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff' }}
        >
          ✓ Mark All Present
        </button>
      </div>

      {/* Student List Table */}
      <div style={{ background: 'var(--bg1, #fff)', border: '1px solid var(--border, var(--border))', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading records for {date}...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg2, var(--bg3))', borderBottom: '1px solid var(--border, var(--border))', textAlign: 'left' }}>
                <th style={{ padding: 12, fontSize: 13 }}>Roll No</th>
                <th style={{ padding: 12, fontSize: 13 }}>Student Name</th>
                <th style={{ padding: 12, fontSize: 13, textAlign: 'right' }}>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border, var(--border))' }}>
                  <td style={{ padding: 12, fontWeight: 600, fontSize: 13 }}>{s.rollNo}</td>
                  <td style={{ padding: 12, fontSize: 14 }}>{s.studentName}</td>
                  <td style={{ padding: 12, textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => setStatus(s.id, 'present')}
                        style={{
                          padding: '4px 12px',
                          fontSize: 12,
                          borderRadius: 6,
                          border: 'none',
                          background: s.status === 'present' ? '#16a34a' : 'var(--border)',
                          color: s.status === 'present' ? '#fff' : '#475569',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => setStatus(s.id, 'late')}
                        style={{
                          padding: '4px 12px',
                          fontSize: 12,
                          borderRadius: 6,
                          border: 'none',
                          background: s.status === 'late' ? '#d97706' : 'var(--border)',
                          color: s.status === 'late' ? '#fff' : '#475569',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => setStatus(s.id, 'absent')}
                        style={{
                          padding: '4px 12px',
                          fontSize: 12,
                          borderRadius: 6,
                          border: 'none',
                          background: s.status === 'absent' ? '#dc2626' : 'var(--border)',
                          color: s.status === 'absent' ? '#fff' : '#475569',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 24px',
            background: 'var(--primary, #3b82f6)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          💾 Save Attendance Record
        </button>
        {saved && <span style={{ color: '#16a34a', fontWeight: 600, fontSize: 14 }}>✓ Saved permanently for {date}!</span>}
      </div>
    </div>
  );
}
