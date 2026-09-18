'use client';

import React from 'react';

interface PracticeTestReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  testTitle?: string;
}

export const PracticeTestReportModal: React.FC<PracticeTestReportModalProps> = ({
  isOpen,
  onClose,
  testTitle = 'Comprehensive Industry Practice Assessment'
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        width: '100%',
        maxWidth: 620,
        background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)',
        border: '1.5px solid rgba(99, 102, 241, 0.4)',
        borderRadius: 20,
        padding: '24px 26px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 18,
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: 18,
            cursor: 'pointer',
            padding: 4
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20 }}>📊</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Immediate Diagnostic Assessment Report
            </span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: 0 }}>
            {testTitle}
          </h3>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }}>
            Instant evaluation generated against industry role benchmarks.
          </p>
        </div>

        {/* Score Quad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 10,
          padding: '14px 16px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 14,
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Overall Score</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981', marginTop: 2 }}>88 / 100</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Percentile</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#38bdf8', marginTop: 2 }}>Top 8%</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Speed / Accuracy</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#818cf8', marginTop: 2 }}>94%</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Readiness</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#f59e0b', marginTop: 6 }}>Placement Ready</div>
          </div>
        </div>

        {/* Topic Breakdown */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', marginBottom: 10 }}>
            Topic Competency Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { topic: 'Core Logic & Algorithmic Problem Solving', score: 95, color: '#10b981' },
              { topic: 'RESTful API Construction & JWT Security', score: 88, color: '#38bdf8' },
              { topic: 'Database Schema Modeling & Query Optimization', score: 78, color: '#f59e0b' },
              { topic: 'Cloud Deployment, Docker & DevOps Automation', score: 85, color: '#6366f1' }
            ].map((t, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4 }}>
                  <span style={{ color: '#cbd5e1' }}>{t.topic}</span>
                  <span style={{ color: t.color, fontWeight: 800 }}>{t.score}%</span>
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${t.score}%`, height: '100%', background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis */}
        <div style={{
          padding: '12px 14px',
          borderRadius: 12,
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase' }}>
            ⚡ Detected Skill Gap & Recommended Quests:
          </div>
          <p style={{ fontSize: 11.5, color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
            Your database query indexing accuracy is at 78%. We recommend completing <strong>"Quest 18: Index Tuning & B-Tree Explain Plans"</strong> to reach 90%+ readiness.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Continue Program Roadmap →
          </button>
        </div>
      </div>
    </div>
  );
};
