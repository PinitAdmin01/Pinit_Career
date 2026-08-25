// apps/web/src/components/pathway/CompetencyRadarView.tsx
// Granular Multi-Class Competency Evidence Matrix & Cryptographic Transcript Viewer

import React, { useState } from 'react';
import { COMPETENCY_CATALOG_V1 } from '@/lib/pathway/competencyCatalog';
import {
  CompetencyDefinition,
  CompetencyDomain,
  CompetencyMasteryStatus,
  EvidenceClass,
  MasteryState,
} from '@/lib/pathway/competencySchema';

interface CompetencyRadarViewProps {
  masteryMap?: Map<string, CompetencyMasteryStatus>;
  selectedCompetencyId?: string;
  onSelectCompetency?: (id: string) => void;
}

export default function CompetencyRadarView({
  masteryMap = new Map(),
  selectedCompetencyId,
  onSelectCompetency,
}: CompetencyRadarViewProps) {
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const domains: { id: string; label: string }[] = [
    { id: 'all', label: 'All Domains' },
    { id: 'tech', label: '💻 Engineering' },
    { id: 'data', label: '📊 Data Analytics' },
    { id: 'ai', label: '🤖 AI & ML' },
    { id: 'communication', label: '🗣️ Soft Skills' },
  ];

  const levels: string[] = ['all', 'L0', 'L1', 'L2', 'L3', 'L4', 'L5'];

  const filteredCompetencies = COMPETENCY_CATALOG_V1.filter(comp => {
    if (domainFilter !== 'all' && comp.domain !== domainFilter) return false;
    if (levelFilter !== 'all' && comp.level !== levelFilter) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return comp.title.toLowerCase().includes(q) || comp.id.toLowerCase().includes(q) || comp.description.toLowerCase().includes(q);
    }
    return true;
  });

  const getStateBadge = (state: MasteryState = 'locked') => {
    switch (state) {
      case 'verified':
        return { label: 'Verified ✓', bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: '#10b981' };
      case 'verified_needs_review':
        return { label: 'Review Due ⏳', bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: '#f59e0b' };
      case 'demonstrated':
        return { label: 'Demonstrated', bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: '#3b82f6' };
      case 'provisional':
        return { label: 'Provisional', bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6', border: '#8b5cf6' };
      case 'practice':
        return { label: 'Practice', bg: 'rgba(99, 102, 241, 0.15)', text: '#6366f1', border: '#6366f1' };
      case 'learning':
        return { label: 'Learning', bg: 'rgba(236, 72, 153, 0.15)', text: '#ec4899', border: '#ec4899' };
      case 'diagnostic':
        return { label: 'Diagnostic', bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308', border: '#eab308' };
      case 'locked':
      default:
        return { label: 'Locked 🔒', bg: 'rgba(255, 255, 255, 0.05)', text: 'var(--t3)', border: 'var(--border)' };
    }
  };

  const getEvidenceClassIcon = (ec: EvidenceClass) => {
    switch (ec) {
      case 'knowledge': return '🧠';
      case 'application': return '⚡';
      case 'debugging': return '🐛';
      case 'architecture': return '🏛️';
      case 'production': return '🚀';
      case 'defense': return '🛡️';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. Filters & Search Bar ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        background: 'var(--bg2)',
        padding: 14,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}>
        {/* Domain Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {domains.map(d => (
            <button
              key={d.id}
              onClick={() => setDomainFilter(d.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: domainFilter === d.id ? 'var(--accent)' : 'transparent',
                color: domainFilter === d.id ? '#fff' : 'var(--t2)',
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Level Filter & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--bg3)',
              color: 'var(--t1)',
              border: '1px solid var(--border)',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {levels.map(lvl => (
              <option key={lvl} value={lvl}>
                {lvl === 'all' ? 'All Levels (L0–L5)' : `Level ${lvl}`}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search competencies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              color: 'var(--t1)',
              fontSize: 11.5,
              outline: 'none',
              width: 180,
            }}
          />
        </div>
      </div>

      {/* ── 2. Competencies Grid ──────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 16,
      }}>
        {filteredCompetencies.map(comp => {
          const status = masteryMap.get(comp.id);
          const state = status?.state || 'locked';
          const score = status?.compositeScore || 0;
          const badge = getStateBadge(state);
          const isSelected = selectedCompetencyId === comp.id;

          return (
            <div
              key={comp.id}
              onClick={() => onSelectCompetency?.(comp.id)}
              style={{
                background: 'var(--card)',
                border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                cursor: onSelectCompetency ? 'pointer' : 'default',
                boxShadow: isSelected ? '0 0 0 2px var(--accent-light)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Header: Title, Level & State Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      background: 'rgba(255, 255, 255, 0.08)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      color: 'var(--t2)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {comp.level}
                    </span>
                    <span style={{ fontSize: 10.5, color: 'var(--t3)', textTransform: 'uppercase', fontWeight: 700 }}>
                      {comp.domain}
                    </span>
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>
                    {comp.title}
                  </h4>
                </div>

                <span style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: badge.bg,
                  color: badge.text,
                  border: `1px solid ${badge.border}`,
                  whiteSpace: 'nowrap',
                }}>
                  {badge.label}
                </span>
              </div>

              {/* Description */}
              <p style={{ fontSize: 12, color: 'var(--t3)', margin: 0, lineHeight: 1.4 }}>
                {comp.description}
              </p>

              {/* Multi-Class Gated Evidence Matrix HUD */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 6,
                background: 'var(--bg2)',
                padding: 10,
                borderRadius: 10,
                border: '1px solid var(--border)',
              }}>
                {comp.evidenceRequirements.map(req => {
                  const classData = status?.classBreakdown?.[req.evidenceClass];
                  const isPassed = classData?.gateSatisfied ?? false;
                  const currentScore = classData?.averageScore ?? 0;
                  const currentCount = classData?.evidenceCount ?? 0;

                  return (
                    <div
                      key={req.evidenceClass}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 6,
                        background: isPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isPassed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.04)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: isPassed ? '#10b981' : 'var(--t3)', textTransform: 'capitalize' }}>
                          {getEvidenceClassIcon(req.evidenceClass)} {req.evidenceClass.slice(0, 5)}
                        </span>
                        <span style={{ fontSize: 9.5, fontWeight: 800, color: isPassed ? '#10b981' : 'var(--t3)' }}>
                          {isPassed ? '✓' : `${currentScore}/${req.minScore}`}
                        </span>
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--t3)' }}>
                        {currentCount}/{req.minCount} tasks ({req.minimumDifficulty})
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Provenance & Composite Score Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 10,
                borderTop: '1px solid var(--border)',
                fontSize: 11,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--t3)' }}>
                  <span>🛡️ Evidence: <strong>{status?.independentEvidenceCount || 0}</strong></span>
                  <span>•</span>
                  <span>Families: <strong>{status?.distinctFamilyCount || 0}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--t3)' }}>Score:</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: score >= 75 ? '#10b981' : 'var(--t1)' }}>
                    {score}/100
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
