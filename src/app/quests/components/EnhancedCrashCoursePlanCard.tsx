'use client';

import React, { useState } from 'react';
import type { CrashPlan, CrashPlanCourseModule } from '@/lib/data/crashPlansData';

export interface EnhancedCrashCoursePlanCardProps {
  plan: CrashPlan;
  activeTrack: 'web_fullstack' | 'python_ai';
  isSelected: boolean;
  onSelectPlan: (plan: CrashPlan) => void;
  onPreviewCredentials: (plan: CrashPlan) => void;
  onOpenDiagnosticReport?: (title: string) => void;
  userPins?: number;
}

const TABS = [
  { key: 'curriculum', label: 'Curriculum' },
  { key: 'capstone', label: 'Capstone Spec' },
  { key: 'credentials', label: 'Credentials' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

// Fallback blueprints if API or static metadata is partially unavailable (Option 2)
const FALLBACK_MODULES: Record<'web_fullstack' | 'python_ai', CrashPlanCourseModule[]> = {
  web_fullstack: [
    { month: 1, courseId: 'course-react-web', title: 'Modern React Architecture', desc: 'Component lifecycle, hooks, and state.', icon: '', skills: ['React', 'TypeScript'] },
    { month: 2, courseId: 'course-node-web', title: 'Backend APIs & Microservices', desc: 'REST, PostgreSQL, and auth.', icon: '', skills: ['Node.js', 'PostgreSQL'] },
  ],
  python_ai: [
    { month: 1, courseId: 'course-python', title: 'Python Core & Data Systems', desc: 'OOP, algorithms, and test automation.', icon: '', skills: ['Python', 'pytest'] },
    { month: 2, courseId: 'course-ai-py', title: 'Machine Learning & Neural Nets', desc: 'Model architectures and inference.', icon: '', skills: ['PyTorch', 'FastAPI'] },
  ],
};

const FALLBACK_FLAGSHIP = {
  web_fullstack: {
    title: 'Enterprise Full-Stack Cloud Platform',
    desc: 'Production full-stack SaaS with verified auth, database relations, and automated CI/CD.',
    tech: ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
  },
  python_ai: {
    title: 'High-Throughput AI Agent Pipeline',
    desc: 'Autonomous AI API service with vector search, embeddings, and FastAPI backend.',
    tech: ['Python', 'FastAPI', 'PyTorch', 'Vector DB'],
  },
};

export const EnhancedCrashCoursePlanCard: React.FC<EnhancedCrashCoursePlanCardProps> = ({
  plan,
  activeTrack,
  isSelected,
  onSelectPlan,
  onPreviewCredentials,
  onOpenDiagnosticReport,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('curriculum');

  // Option 1 (Primary track data) -> Option 2 (Defensive fallback defaults)
  const trackKey = activeTrack === 'python_ai' ? 'python_ai' : 'web_fullstack';
  const trackModules = plan?.modulesByTrack?.[trackKey];
  const modules = Array.isArray(trackModules) && trackModules.length > 0 ? trackModules : FALLBACK_MODULES[trackKey];

  const flagshipTrack = plan?.flagshipBuildByTrack?.[trackKey];
  const flagship = flagshipTrack?.title ? flagshipTrack : FALLBACK_FLAGSHIP[trackKey];
  const flagshipTech = Array.isArray(flagship.tech) && flagship.tech.length > 0 ? flagship.tech : ['TypeScript', 'Architecture'];

  const hc = plan?.highlightColor || 'var(--accent)';
  const inr = typeof plan?.inrPrice === 'number' ? plan.inrPrice.toLocaleString('en-IN') : '4,999';
  const pins = typeof plan?.pinsPrice === 'number' ? plan.pinsPrice : 500;
  const cashback = typeof plan?.scholarCashbackPins === 'number' ? plan.scholarCashbackPins : 150;
  const savings = plan?.competitorSavings || 'Save ₹50,000+ vs traditional bootcamps';

  return (
    <div
      data-testid={`crash-plan-card-${plan.id}`}
      style={{
        borderRadius: 'var(--radius-xl)',
        padding: '22px 20px',
        background: 'linear-gradient(180deg, color-mix(in srgb, var(--card) 96%, ' + hc + ' 4%) 0%, var(--card) 100%)',
        border: isSelected ? `2px solid ${hc}` : '1px solid color-mix(in srgb, var(--border) 80%, ' + hc + ' 20%)',
        boxShadow: isSelected
          ? `0 12px 32px -4px color-mix(in srgb, ${hc} 30%, transparent), 0 0 0 1px ${hc} inset`
          : 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Featured Tier Badge */}
      {plan?.badge && (
        <div
          style={{
            position: 'absolute',
            top: -11,
            right: 18,
            padding: '3px 12px',
            borderRadius: 999,
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: '0.05em',
            background: `linear-gradient(135deg, ${hc}, var(--accent))`,
            color: '#ffffff',
            boxShadow: `0 4px 14px color-mix(in srgb, ${hc} 40%, transparent)`,
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          {plan.badge}
        </div>
      )}

      {/* Header Row: Tier & Career Outcome */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: hc,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {(plan?.tier || 'track').toUpperCase()} INTENSIVE
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 10px',
            borderRadius: 999,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            fontSize: 11.5,
            fontWeight: 700,
            color: 'var(--t1)',
          }}
        >
          <span>{plan?.targetRole || 'Software Engineer'}</span>
          <span style={{ color: 'var(--green)', fontWeight: 800 }}>• {plan?.hireabilityBoost || '+35%'}</span>
        </span>
      </div>

      {/* Title & Program Duration */}
      <div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: 'var(--t1)',
            margin: '0 0 3px 0',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.3px',
          }}
        >
          {plan?.title || 'Certification Track'}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--t2)', margin: '0 0 6px 0', lineHeight: 1.4 }}>
          {plan?.subtitle || 'Full-cycle engineering curriculum with verified credentials.'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11.5, color: 'var(--t2)', fontWeight: 700, fontFamily: 'var(--font-mono)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
            {plan?.totalProgramDuration || '3-4 Months Total'}
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)', background: 'var(--accent-light)', padding: '2px 8px', borderRadius: 6, border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
            {plan?.dailyCommitment || 'Daily 1-Hr Micro-Learning'}
          </span>
        </div>
      </div>

      {/* Flagship Build Card */}
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 12,
          background: 'var(--bg2)',
          border: `1px solid color-mix(in srgb, var(--border) 70%, ${hc} 30%)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, color: hc, display: 'flex', alignItems: 'center', gap: 6 }}>
          Flagship Project: {flagship.title}
        </div>
        <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4, margin: 0 }}>
          {flagship.desc}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
          {flagshipTech.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10.5,
                padding: '2px 7px',
                borderRadius: 5,
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                fontWeight: 700,
                color: 'var(--t1)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 3-Tab Switcher (Curriculum / Capstone / Credentials) */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: 4,
          borderRadius: 10,
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
        }}
      >
        {TABS.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              data-testid={`plan-tab-${t.key}`}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: 7,
                border: 'none',
                background: active ? 'var(--card)' : 'transparent',
                color: active ? 'var(--t1)' : 'var(--t3)',
                fontSize: 11.5,
                fontWeight: active ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: active ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 125 }}>
        {activeTab === 'curriculum' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {modules.map((m) => (
              <div
                key={m.month}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  padding: '8px 10px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: hc, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontWeight: 800, flex: 1, color: 'var(--t1)', fontSize: 12 }}>{m.title}</span>
                  {Array.isArray(m.skills) && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {m.skills.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 4,
                            background: 'var(--accent-light)',
                            color: 'var(--accent)',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {m.desc && (
                  <p style={{ fontSize: 11, color: 'var(--t3)', margin: 0, lineHeight: 1.35 }}>
                    {m.desc}
                  </p>
                )}
              </div>
            ))}
            {onOpenDiagnosticReport && (
              <button
                type="button"
                onClick={() => onOpenDiagnosticReport(`${plan.title} Diagnostic Assessment`)}
                style={{
                  alignSelf: 'flex-start',
                  background: 'none',
                  border: 'none',
                  padding: '2px 0',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 2,
                }}
              >
                View Diagnostic Assessment Report ➔
              </button>
            )}
          </div>
        )}

        {activeTab === 'capstone' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              { s: 'Sprint 1', d: 'Requirements & Architecture Specification' },
              { s: 'Sprint 2', d: 'Core Feature Engineering & Auth Gate' },
              { s: 'Sprint 3', d: 'Automated CI/CD Pipeline & Integration Tests' },
              { s: 'Sprint 4', d: 'Live Cloud Deploy & Oral Defense Review' },
            ].map((sp) => (
              <div
                key={sp.s}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 7,
                  fontSize: 11.5,
                }}
              >
                <span style={{ fontWeight: 800, color: hc, minWidth: 54 }}>{sp.s}</span>
                <span style={{ color: 'var(--t2)' }}>{sp.d}</span>
              </div>
            ))}
            <p style={{ fontSize: 11, color: 'var(--t3)', margin: '4px 0 0 0' }}>
              <strong>Production Tech Stack:</strong> Microservices • PostgreSQL/Supabase • GitHub Actions + Docker
            </p>
          </div>
        )}

        {activeTab === 'credentials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              '✓ Industrial Project Certificate (ISO-Aligned, Signed)',
              '✓ PinIT Tech Labs Experience Letter (Engineering Fellow)',
              '✓ SHA-256 Tamper-Proof Cryptographic Hash',
              '✓ Live Public Verification at /verify/[id]',
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  fontSize: 11.5,
                  color: 'var(--t2)',
                  lineHeight: 1.35,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{c}</span>
              </div>
            ))}
            <button
              type="button"
              data-testid="btn-preview-credentials"
              onClick={() => onPreviewCredentials(plan)}
              style={{
                alignSelf: 'flex-start',
                marginTop: 4,
                padding: '6px 12px',
                borderRadius: 7,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                color: '#000000',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
                transition: 'transform 0.15s ease',
              }}
            >
              Preview Sample Credentials ➔
            </button>
          </div>
        )}
      </div>

      {/* Rewards & Savings Footnote */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 12px',
          borderRadius: 8,
          background: 'var(--accent-light)',
          border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
          fontSize: 11.5,
          fontWeight: 700,
          color: 'var(--accent)',
        }}
      >
        <span>+{cashback} Reward Coins</span>
        <span style={{ color: 'var(--green)', fontWeight: 800 }}>{savings}</span>
      </div>

      {/* Pricing & CTA */}
      <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', fontFamily: 'var(--font-display)' }}>
              {pins} Pins
            </span>
            <span style={{ fontSize: 13, color: 'var(--t2)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              Pins · ₹{inr}
            </span>
          </div>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 6,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              fontSize: 10.5,
              fontWeight: 900,
              color: '#000000',
              boxShadow: '0 2px 6px rgba(245,158,11,0.25)',
            }}
          >
            PINIT2026 (-₹1,000)
          </span>
        </div>

        <button
          type="button"
          data-testid={`btn-select-plan-${plan.id}`}
          onClick={() => onSelectPlan(plan)}
          disabled={isSelected}
          style={{
            padding: '11px 18px',
            borderRadius: 9,
            border: 'none',
            background: isSelected ? 'var(--bg3)' : `linear-gradient(135deg, ${hc}, var(--accent))`,
            color: isSelected ? 'var(--t3)' : '#ffffff',
            fontSize: 13.5,
            fontWeight: 800,
            cursor: isSelected ? 'default' : 'pointer',
            boxShadow: isSelected ? 'none' : `0 4px 14px color-mix(in srgb, ${hc} 40%, transparent)`,
            transition: 'all 0.18s ease',
            width: '100%',
            letterSpacing: '0.01em',
          }}
        >
          {isSelected ? '✓ Currently Active Plan' : 'Select & Unlock Program ➔'}
        </button>
      </div>
    </div>
  );
};

export default EnhancedCrashCoursePlanCard;
