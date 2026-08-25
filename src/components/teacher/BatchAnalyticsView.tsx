'use client';

import React, { useState, useEffect } from 'react';
import { portalService } from '@/lib/services/portalService';

interface BatchMetric {
  id: string;
  batchName: string;
  department: string;
  totalStudents: number;
  avgAttendance: number;
  avgGrade: number;
  topPerformer: string;
  atRiskCount: number;
}

export default function BatchAnalyticsView() {
  const [batches, setBatches] = useState<BatchMetric[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('b1');

  useEffect(() => {
    async function loadBatchAnalytics() {
      try {
        const students = await portalService.getEnrolledStudents();
        const batchAStudents = students.filter(s => s.batch === 'Batch 2024-A' || !s.batch);
        const batchBStudents = students.filter(s => s.batch === 'Batch 2024-B');

        const avgAttA = Math.round(batchAStudents.reduce((acc, s) => acc + (s.attendancePct || 90), 0) / Math.max(1, batchAStudents.length));
        const avgXpA = Math.round(batchAStudents.reduce((acc, s) => acc + (s.atsScore || 85), 0) / Math.max(1, batchAStudents.length));
        const topStudentA = [...batchAStudents].sort((a, b) => b.xp - a.xp)[0]?.name || 'Vinay Kumar';

        const dynamicBatches: BatchMetric[] = [
          {
            id: 'b1',
            batchName: 'Batch 2024 - Computer Science A',
            department: 'CS & Engineering',
            totalStudents: batchAStudents.length,
            avgAttendance: avgAttA,
            avgGrade: avgXpA,
            topPerformer: topStudentA,
            atRiskCount: batchAStudents.filter(s => (s.attendancePct || 90) < 85).length
          },
          {
            id: 'b2',
            batchName: 'Batch 2024 - Frontend & UI/UX B',
            department: 'Frontend Engineering',
            totalStudents: Math.max(1, batchBStudents.length),
            avgAttendance: 96,
            avgGrade: 92.5,
            topPerformer: batchBStudents[0]?.name || 'Ananya Mishra',
            atRiskCount: 0
          }
        ];
        setBatches(dynamicBatches);
      } catch (e) {
        console.error('Failed to load batch analytics', e);
      }
    }
    loadBatchAnalytics();
  }, []);

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0] || {
    id: 'b1',
    batchName: 'Batch 2024 - Computer Science A',
    department: 'CS & Engineering',
    totalStudents: 5,
    avgAttendance: 92,
    avgGrade: 88,
    topPerformer: 'Vinay Kumar',
    atRiskCount: 0
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--t1, #0f172a)' }}>📈 Batch & Class Analytics</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--t3, #64748b)' }}>Comprehensive performance tracking, attendance distribution, and student drop-off risk analysis.</p>
      </div>

      {/* Batch Cards Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {batches.map(batch => (
          <div
            key={batch.id}
            onClick={() => setSelectedBatchId(batch.id)}
            style={{
              padding: 20,
              borderRadius: 12,
              border: `2px solid ${selectedBatchId === batch.id ? 'var(--primary, #3b82f6)' : 'var(--border, var(--border))'}`,
              background: selectedBatchId === batch.id ? '#eff6ff' : 'var(--bg1, #fff)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--t3, #64748b)', fontWeight: 600 }}>{batch.department}</div>
            <h3 style={{ margin: '4px 0 12px', fontSize: 16, fontWeight: 700 }}>{batch.batchName}</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>Students: <strong>{batch.totalStudents}</strong></span>
              <span>Avg Grade: <strong style={{ color: '#16a34a' }}>{batch.avgGrade}%</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Batch Breakdown */}
      <div style={{ background: 'var(--bg1, #fff)', padding: 24, borderRadius: 12, border: '1px solid var(--border, var(--border))', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border, var(--border))', paddingBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selectedBatch.batchName} - Deep Dive</h3>
            <span style={{ fontSize: 13, color: 'var(--t3, #64748b)' }}>Academic Semester 2026 • Top Student: {selectedBatch.topPerformer}</span>
          </div>
          <button style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            📥 Export Report (PDF)
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Average Attendance</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>{selectedBatch.avgAttendance}%</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Average Score</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>{selectedBatch.avgGrade}%</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Students At Risk (&lt;60%)</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626', marginTop: 4 }}>{selectedBatch.atRiskCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
