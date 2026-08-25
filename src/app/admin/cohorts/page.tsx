'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CohortsApiService, CollegeOverviewStats } from '@/lib/api/cohortsApi';

export default function CollegeCohortsAdminPage() {
  const [stats, setStats] = useState<CollegeOverviewStats | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setStats(CohortsApiService.getCollegeOverview());
  }, []);

  if (!stats) return null;

  const filteredStudents = stats.students.filter(s => {
    const matchesDept = selectedDept === 'all' || s.department === selectedDept;
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #090d16)', color: '#f1f5f9', padding: '28px 36px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>🏫</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
                Institutional Cohort & Placement Analytics
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>
                Multi-Tenant Campus Telemetry · Departmental Readiness Funnel · Cryptographic Evidence Audit
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link
            href="/admin"
            style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: 13, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            ← Admin Console
          </Link>
          <Link
            href="/leaderboard"
            style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}
          >
            🏆 Campus Leaderboard
          </Link>
        </div>
      </div>

      {/* Top Level Metric HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Total Enrolled Students</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#f8fafc' }}>{stats.totalStudents}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Across {stats.departments.length} Engineering Departments</div>
        </div>

        <div style={{ padding: 20, borderRadius: 14, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
          <div style={{ fontSize: 11, color: '#34d399', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Interview Ready %</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#34d399' }}>{stats.overallPlacementReadyPct}%</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Passed 100% Gates + Oral Defense</div>
        </div>

        <div style={{ padding: 20, borderRadius: 14, background: 'rgba(79, 70, 229, 0.05)', border: '1px solid rgba(79, 70, 229, 0.15)' }}>
          <div style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Verified Skills Sealed</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#a5b4fc' }}>{stats.totalVerifiedCredentials}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>SHA-256 Verified Artifacts</div>
        </div>

        <div style={{ padding: 20, borderRadius: 14, background: 'rgba(251, 191, 36, 0.05)', border: '1px solid rgba(251, 191, 36, 0.15)' }}>
          <div style={{ fontSize: 11, color: '#facc15', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Avg Viva Defense Score</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#facc15' }}>🎙️ {stats.avgOralDefenseScore}/100</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Independent Panel / AI Evaluation</div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🏢</span> Departmental Placement & Readiness Breakdown
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Department</th>
                <th style={{ padding: '12px 16px' }}>Enrolled</th>
                <th style={{ padding: '12px 16px' }}>Interview Ready</th>
                <th style={{ padding: '12px 16px' }}>Internship Ready</th>
                <th style={{ padding: '12px 16px' }}>Avg Viva</th>
                <th style={{ padding: '12px 16px' }}>Placement Funnel</th>
              </tr>
            </thead>
            <tbody>
              {stats.departments.map(dept => (
                <tr key={dept.department} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#f8fafc' }}>{dept.department}</td>
                  <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{dept.totalStudents}</td>
                  <td style={{ padding: '14px 16px', color: '#34d399', fontWeight: 700 }}>{dept.interviewReadyCount} ({dept.placementReadyPct}%)</td>
                  <td style={{ padding: '14px 16px', color: '#60a5fa' }}>{dept.internshipReadyCount}</td>
                  <td style={{ padding: '14px 16px', color: '#facc15', fontWeight: 700 }}>{dept.avgDefenseScore > 0 ? `${dept.avgDefenseScore}/100` : '—'}</td>
                  <td style={{ padding: '14px 16px', width: 200 }}>
                    <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${dept.placementReadyPct}%`, height: '100%', background: '#10b981' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Telemetry Matrix */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>👥 Student Placement & Evidence Dossier</h3>

          <div style={{ display: 'flex', gap: 10 }}>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12 }}
            >
              <option value="all">All Departments</option>
              {stats.departments.map(d => (
                <option key={d.department} value={d.department}>{d.department}</option>
              ))}
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 Search student..."
              style={{ padding: '8px 12px', borderRadius: 8, background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, width: 180 }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 11, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Student</th>
                <th style={{ padding: '12px 16px' }}>Department</th>
                <th style={{ padding: '12px 16px' }}>Verified Skills</th>
                <th style={{ padding: '12px 16px' }}>Viva Defense</th>
                <th style={{ padding: '12px 16px' }}>Readiness Stage</th>
                <th style={{ padding: '12px 16px' }}>Public Proof</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.studentId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#f8fafc' }}>{student.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Batch of {student.batchYear}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{student.department}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', fontWeight: 700, fontSize: 11 }}>
                      🛡️ {student.verifiedCount} Verified
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {student.defenseScore > 0 ? (
                      <span style={{ color: '#34d399', fontWeight: 700 }}>🎙️ {student.defenseScore}/100</span>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: 12 }}>Pending</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: student.readinessStatus === 'ready_for_interview' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: student.readinessStatus === 'ready_for_interview' ? '#34d399' : '#60a5fa'
                    }}>
                      {student.readinessStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link
                      href={`/verify/${student.studentId}`}
                      style={{ fontSize: 12, color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Audit Proof ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
