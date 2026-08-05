'use client';

import React, { useState } from 'react';

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
  const [batches] = useState<BatchMetric[]>([
    {
      id: 'b1',
      batchName: 'Batch 2024 - Computer Science A',
      department: 'CS & AI',
      totalStudents: 48,
      avgAttendance: 92,
      avgGrade: 84.5,
      topPerformer: 'Rahul Sharma',
      atRiskCount: 2
    },
    {
      id: 'b2',
      batchName: 'Batch 2025 - Data Science B',
      department: 'DS & Analytics',
      totalStudents: 42,
      avgAttendance: 87,
      avgGrade: 78.2,
      topPerformer: 'Ananya Gupta',
      atRiskCount: 5
    },
    {
      id: 'b3',
      batchName: 'Batch 2026 - AI & Robotics C',
      department: 'AI & Robotics',
      totalStudents: 38,
      avgAttendance: 95,
      avgGrade: 88.0,
      topPerformer: 'Vikram Mehta',
      atRiskCount: 1
    }
  ]);

  const [selectedBatchId, setSelectedBatchId] = useState<string>('b1');
  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

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
              border: `2px solid ${selectedBatchId === batch.id ? 'var(--primary, #3b82f6)' : 'var(--border, #e2e8f0)'}`,
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
      <div style={{ background: 'var(--bg1, #fff)', padding: 24, borderRadius: 12, border: '1px solid var(--border, #e2e8f0)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border, #f1f5f9)', paddingBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selectedBatch.batchName} - Deep Dive</h3>
            <span style={{ fontSize: 13, color: 'var(--t3, #64748b)' }}>Academic Semester 2026 • Top Student: {selectedBatch.topPerformer}</span>
          </div>
          <button style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            📥 Export Report (PDF)
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Average Attendance</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>{selectedBatch.avgAttendance}%</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Average Score</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>{selectedBatch.avgGrade}%</div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Students At Risk (&lt;60%)</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626', marginTop: 4 }}>{selectedBatch.atRiskCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
