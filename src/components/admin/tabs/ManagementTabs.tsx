'use client';

import React from 'react';

export function HRTab() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700 }}>👥 HR Payroll & Faculty Directory</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>Manage teaching staff profiles, monthly payroll processing, and leave approvals.</p>
    </div>
  );
}

export function GrievancesTab() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700 }}>⚖️ Student & Staff Grievance Redressal</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>Review anonymous complaint filings, committee reviews, and resolution timelines.</p>
    </div>
  );
}

export function EventsTab() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700 }}>🎉 Campus Events & Hackathons</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>Schedule university fests, guest lecture webinars, and technical symposiums.</p>
    </div>
  );
}

export function ResearchTab() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700 }}>🔬 Research Grants & Patent Registry</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>Track paper publications, NSF/R&D grant funding, and institutional patents.</p>
    </div>
  );
}

export function AIAdvisorTab() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid var(--border)' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700 }}>🤖 AI Academic Advisor Intelligence Logs</h2>
      <p style={{ color: '#64748b', fontSize: 14 }}>Review AI mentor interaction analytics, career roadmap suggestions, and student engagement scores.</p>
    </div>
  );
}
