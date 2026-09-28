// src/app/onboarding/components/RoadmapPreview.tsx
'use client';

/**
 * The onboarding result: the student's persona in plain words, what they picked, one tip, their
 * mentor, and the button that saves everything. Sized to fit the panel without scrolling.
 */

import React from 'react';
import type { CompleteDiagnosticProfile } from '@/lib/onboarding/diagnosticEngine';
import type { BehavioralDimension } from '@/lib/onboarding/diagnosticRegistry';
import { BALANCED_TIP, DIMENSIONS, PLAIN_TIPS, PLAIN_TRAITS, workLabelFor } from '@/lib/onboarding/lifeQuestions';
import { QT2MindsetBreakdown } from '../types';

export interface RoadmapPreviewProps {
  studentType: string;
  targetGoal: string;
  accessReason: string;
  diagnosticProfile?: CompleteDiagnosticProfile | null;
  qt2Breakdown?: QT2MindsetBreakdown;
  selectedMentor: string;
  setSelectedMentor: (mentor: string) => void;
  onActivateCommandCenter: (studentType: string, targetGoal: string, accessReason: string, blendTitle: string) => void;
  syncing?: boolean;
}

const MENTOR_NAMES: Record<string, string> = { priya: 'Ms. Priya', anish: 'Mr. Anish' };

export default function RoadmapPreview({
  studentType,
  targetGoal,
  accessReason,
  diagnosticProfile,
  qt2Breakdown,
  selectedMentor,
  setSelectedMentor,
  onActivateCommandCenter,
  syncing = false,
}: RoadmapPreviewProps) {
  const bp = diagnosticProfile?.behaviorProfile;
  // 0–100 per trait: the profile's scores, or (older voice route) the mindset percentages.
  const scores: Record<BehavioralDimension, number> = bp
    ? { PH: bp.PH.normalizedScore, EX: bp.EX.normalizedScore, ST: bp.ST.normalizedScore, SIQ: bp.SIQ.normalizedScore }
    : { PH: qt2Breakdown?.patternHunter ?? 25, EX: qt2Breakdown?.explorer ?? 25, ST: qt2Breakdown?.stabilizer ?? 25, SIQ: qt2Breakdown?.socialIQ ?? 25 };
  const evidence = (d: BehavioralDimension) => (bp ? bp[d].evidence : scores[d]);
  const order = [...DIMENSIONS].sort((a, b) => evidence(b) - evidence(a));
  const top = PLAIN_TRAITS[order[0]];
  const second = PLAIN_TRAITS[order[1]];

  const picked = workLabelFor(diagnosticProfile?.goal?.role) || workLabelFor(targetGoal);
  const tip = PLAIN_TIPS[diagnosticProfile?.tradeoffs?.[0]?.type || ''] || BALANCED_TIP;
  // Saved with the onboarding answers (kept in the original archetype wording).
  const blendTitle = bp?.blendTitle || qt2Breakdown?.blendTitle || 'Career Profile';
  const otherMentor = selectedMentor === 'priya' ? 'anish' : 'priya';

  return (
    <div className="rp-root">
      <span className="rp-chip">Your result</span>
      <h2 className="rp-title">
        <span aria-hidden="true">{top.icon}</span> You are a {top.name}
      </h2>
      <p className="rp-sub">
        {top.line} With a bit of {second.name} {second.icon}.
      </p>

      <div className="rp-bars" aria-label="Your traits">
        {order.map((d) => (
          <div key={d} className="rp-bar-row">
            <span className="rp-bar-name">
              <span aria-hidden="true">{PLAIN_TRAITS[d].icon}</span> {PLAIN_TRAITS[d].name}
            </span>
            <span className="rp-bar-track" role="progressbar" aria-valuenow={Math.round(scores[d])} aria-valuemin={0} aria-valuemax={100} aria-label={PLAIN_TRAITS[d].name}>
              <span className="rp-bar-fill" style={{ width: `${Math.max(6, Math.min(100, scores[d]))}%` }} />
            </span>
          </div>
        ))}
      </div>

      <div className="rp-cards">
        {picked && (
          <div className="rp-card">
            <span className="rp-card-label">You picked</span>
            <span className="rp-card-text">{picked}</span>
          </div>
        )}
        <div className="rp-card">
          <span className="rp-card-label">Tip for you</span>
          <span className="rp-card-text">{tip}</span>
        </div>
      </div>

      <div className="rp-mentor">
        <span>
          Your mentor: <strong>{MENTOR_NAMES[selectedMentor] || selectedMentor}</strong>
        </span>
        <button type="button" className="rp-switch" onClick={() => setSelectedMentor(otherMentor)} disabled={syncing}>
          Switch to {MENTOR_NAMES[otherMentor]}
        </button>
      </div>

      <button
        type="button"
        className="rp-start"
        disabled={syncing}
        onClick={() => onActivateCommandCenter(studentType, targetGoal, accessReason, blendTitle)}
      >
        {syncing ? 'Saving your plan…' : 'Start my plan ➔'}
      </button>

      <style>{`
        .rp-root { height: 100%; min-height: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: center;
          gap: clamp(8px, 1.5vh, 16px); padding: clamp(14px, 2.2vh, 28px) clamp(18px, 2.2vw, 36px); color: #f8fafc; }
        .rp-chip { align-self: flex-start; font-size: 15px; font-weight: 800; color: #a5b4fc; background: rgba(99,102,241,0.16);
          border: 1px solid rgba(129,140,248,0.4); border-radius: 999px; padding: 5px 14px; }
        .rp-title { margin: 0; font-size: clamp(28px, 2.2vw + 1.2vh, 42px); font-weight: 900; line-height: 1.15; color: #fff; }
        .rp-sub { margin: 0; font-size: clamp(17px, 0.8vw + 0.8vh, 21px); color: #e2e8f0; line-height: 1.4; }
        .rp-bars { display: flex; flex-direction: column; gap: clamp(6px, 1vh, 10px); }
        .rp-bar-row { display: grid; grid-template-columns: minmax(150px, 34%) 1fr; align-items: center; gap: 12px; }
        .rp-bar-name { font-size: 17px; font-weight: 700; color: #f1f5f9; white-space: nowrap; }
        .rp-bar-track { height: 14px; border-radius: 999px; background: rgba(255,255,255,0.1); overflow: hidden; display: block; }
        .rp-bar-fill { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--brand, #6366f1), var(--accent, #22d3ee)); }
        .rp-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
        .rp-card { display: flex; flex-direction: column; gap: 4px; padding: 12px 16px; border-radius: 16px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); }
        .rp-card-label { font-size: 14px; font-weight: 800; color: #a5b4fc; }
        .rp-card-text { font-size: 17px; font-weight: 700; color: #f8fafc; line-height: 1.35; }
        .rp-mentor { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; font-size: 17px; color: #e2e8f0; }
        .rp-switch { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); color: #f1f5f9; border-radius: 999px;
          padding: 8px 16px; font-size: 15px; font-weight: 700; cursor: pointer; }
        .rp-start { height: clamp(50px, 7vh, 60px); border: none; border-radius: 16px; font-size: 20px; font-weight: 900; color: #fff; cursor: pointer;
          background: linear-gradient(135deg, var(--teal, #14b8a6) 0%, var(--accent, #22d3ee) 100%); box-shadow: 0 8px 24px rgba(20,184,166,0.3); }
        .rp-start:disabled, .rp-switch:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
