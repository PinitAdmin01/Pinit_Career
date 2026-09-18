'use client';

import React, { useState } from 'react';
import { useApply } from '@/lib/api/hooks';
import { card, cardLabel } from './constants';

const TYPE_ICONS: Record<string, string> = { 
  job: '💼', 
  internship: '🏢', 
  scholarship: '🎓', 
  competition: '🏆', 
  certification: '📜', 
  networking: '🤝' 
};

function ApplyButton({ opportunityId, title }: { opportunityId: string; title: string }) {
  const applyMutation = useApply();
  const [applied, setApplied] = useState(false);

  if (applied || applyMutation.isSuccess) {
    return (
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
        ✓ Applied
      </span>
    );
  }

  return (
    <button
      onClick={() => { applyMutation.mutate({ opportunityId }); setApplied(true); }}
      disabled={applyMutation.isPending}
      style={{
        padding: '5px 14px', borderRadius: 8, border: 'none',
        background: 'var(--accent)', color: 'white',
        fontSize: 11, fontWeight: 700, cursor: 'pointer',
        fontFamily: 'var(--font-body)', transition: 'all 0.15s',
        opacity: applyMutation.isPending ? 0.7 : 1,
      }}
    >
      {applyMutation.isPending ? 'Applying...' : '→ Apply Now'}
    </button>
  );
}

interface OpportunitiesTabProps {
  opps: Record<string, any>[];
  oppsLoading: boolean;
  oppsFilter: string;
  setOppsFilter: (val: string) => void;
  jd: string;
  setJD: (val: string) => void;
  matching: boolean;
  matchResult: Record<string, any> | null;
  matchJD: () => void;
}

export function OpportunitiesTab({
  opps,
  oppsLoading,
  oppsFilter,
  setOppsFilter,
  jd,
  setJD,
  matching,
  matchResult,
  matchJD
}: OpportunitiesTabProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, alignItems: 'start' }}>
      <div style={card}>
        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={cardLabel}>🔍 Opportunity Radar</div>
          <select
            value={oppsFilter}
            onChange={e => setOppsFilter(e.target.value)}
            style={{ padding: '6px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--t1)', fontSize: 12 }}
          >
            <option value="all">All Gaps</option>
            <option value="job">Jobs</option>
            <option value="internship">Internships</option>
          </select>
        </div>

        {oppsLoading ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--t3)' }}>Scanning network openings...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {opps.map(opp => (
              <div key={opp.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: 14, borderRadius: 12 }}>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div>
                    <span style={{ marginRight: 6 }}>{TYPE_ICONS[opp.type] || '💼'}</span>
                    <strong style={{ fontSize: 14 }}>{opp.title}</strong>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)' }}>{opp.match_score}% Match</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 8 }}>{opp.company} · {opp.location} · {opp.salary || 'Salary Undisclosed'}</div>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--t4)' }}>Deadline: {opp.deadline || 'Ongoing'}</span>
                  <ApplyButton opportunityId={opp.id} title={opp.title} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={card}>
        <div style={cardLabel}>📄 Socratic JD Analyzer</div>
        <p style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 14 }}>
          Paste a job description below to parse missing skills and broadcast target roadmap nodes.
        </p>
        <textarea
          value={jd}
          onChange={e => setJD(e.target.value)}
          placeholder="Paste job details here..."
          style={{ width: '100%', height: 120, padding: 12, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--t1)', fontSize: 12.5, marginBottom: 12, fontFamily: 'var(--font-mono)' }}
        />
        <button onClick={matchJD} disabled={matching} className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: 12.5, fontWeight: 800 }}>
          {matching ? 'Analyzing gaps...' : 'Run Socratic Scan'}
        </button>

        {matchResult && (
          <div style={{ marginTop: 16, background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--accent)', marginBottom: 10 }}>Score: {matchResult.match_score}%</div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--coral)', marginBottom: 4 }}>MISSING SKILLS:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {matchResult.missing_skills?.map((s: string) => (
                <span key={s} style={{ fontSize: 10.5, padding: '3px 8px', borderRadius: 4, background: 'var(--coral-light)', color: 'var(--coral)' }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
