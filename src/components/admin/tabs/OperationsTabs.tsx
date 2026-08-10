'use client';

import React, { useState } from 'react';

export function AdmissionsTab() {
  const [applications] = useState<Array<{ id: string; name: string; course: string; status: string; score: string }>>([]);

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700 }}>🎓 Admissions & Seat Matrix</h2>
      <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 16px' }}>Manage incoming student applications, merit lists, and department quota allocations.</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
            <th style={{ padding: 10 }}>Applicant</th>
            <th style={{ padding: 10 }}>Course Applied</th>
            <th style={{ padding: 10 }}>Merit Score</th>
            <th style={{ padding: 10 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: 10, fontWeight: 600 }}>{app.name}</td>
              <td style={{ padding: 10 }}>{app.course}</td>
              <td style={{ padding: 10, color: '#16a34a', fontWeight: 700 }}>{app.score}</td>
              <td style={{ padding: 10 }}>
                <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>
                  {app.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FinanceTab() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700 }}>💰 University Finance & Dues Manager</h2>
      <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 16px' }}>Track tuition fee collections, pending semester dues, scholarship disbursements, and financial audits.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div style={{ padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Total Fee Collected</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>$1.42M</div>
        </div>
        <div style={{ padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>Pending Dues</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626', marginTop: 4 }}>$48,500</div>
        </div>
      </div>
    </div>
  );
}

export function LibraryTab() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700 }}>📚 Library Catalog & Digital Assets</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>Manage physical book inventory, digital research paper access, and student issue logs.</p>
    </div>
  );
}

export function HostelTab() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700 }}>🏢 Hostel & Residence Allotments</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>Oversee block room allocations, warden assignments, and maintenance requests.</p>
    </div>
  );
}

export function TransportTab() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700 }}>🚌 Campus Transit & Route Operations</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>Monitor shuttle bus schedules, driver allocations, and GPS transit routes.</p>
    </div>
  );
}
