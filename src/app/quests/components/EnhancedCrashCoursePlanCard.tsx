import React, { useState } from 'react';
import { CrashPlan } from '@/lib/data/crashPlansData';

export interface EnhancedCrashCoursePlanCardProps {
  plan: CrashPlan;
  activeTrack: 'web_fullstack' | 'python_ai';
  isSelected: boolean;
  onSelectPlan: (plan: CrashPlan) => void;
  onPreviewCredentials: (plan: CrashPlan) => void;
  onOpenDiagnosticReport?: (title: string) => void;
  userPins?: number;
}

const TAB_LABELS = ['📚 Curriculum', '🛠️ Capstone Spec', '📜 Credentials'] as const;
const tabs = ['curriculum', 'capstone', 'credentials'] as const;

const EnhancedCrashCoursePlanCard: React.FC<EnhancedCrashCoursePlanCardProps> = ({
  plan, activeTrack, isSelected, onSelectPlan, onPreviewCredentials, onOpenDiagnosticReport,
}) => {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'capstone' | 'credentials'>('curriculum');

  const modules = plan.modulesByTrack[activeTrack] || [];
  const flagship = plan.flagshipBuildByTrack[activeTrack];
  const steps = plan.journeySteps;
  const hc = plan.highlightColor;

  const wrap: React.CSSProperties = {
    borderRadius: 18, padding: '22px 20px',
    background: isSelected ? 'linear-gradient(180deg, rgba(20,29,50,0.92), rgba(13,20,36,0.98))' : 'rgba(15,23,42,0.85)',
    border: isSelected ? `2px solid ${hc}` : '1px solid rgba(255,255,255,0.08)',
    boxShadow: isSelected ? `0 10px 30px -5px ${hc}33` : '0 4px 16px rgba(0,0,0,0.25)',
    display: 'flex', flexDirection: 'column', gap: 14, position: 'relative',
    fontFamily: 'var(--font-display,"Inter",system-ui,sans-serif)', color: 'var(--t1,#f8fafc)',
  };

  const badgeLabel: React.CSSProperties = { fontSize: 11, fontWeight: 900, letterSpacing: '0.06em', color: hc as string };
  const rolePill: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px',
    borderRadius: 999, background: `${hc}18`, border: `1px solid ${hc}33`, fontSize: 11, fontWeight: 700, color: 'var(--t1)' };
  const pillBtn = (active: boolean): React.CSSProperties => ({ flex: 1, padding: '7px 10px', borderRadius: 9,
    border: 'none', background: active ? `${hc}25` : 'transparent', color: active ? 'var(--t1)' : 'var(--t3,#94a3b8)',
    fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' as const });
  const ctaBtn: React.CSSProperties = { padding: '10px 18px', borderRadius: 10, border: 'none',
    background: isSelected ? 'rgba(16,185,129,0.15)' : `linear-gradient(135deg, ${hc}, #6366f1)`,
    color: isSelected ? '#10b981' : '#fff', fontSize: 12.5, fontWeight: 800,
    cursor: isSelected ? 'default' : 'pointer', boxShadow: isSelected ? 'none' : `0 4px 14px ${hc}44`,
    transition: 'all 0.2s ease', letterSpacing: '0.01em' };

  const tabContentStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' as const, gap: 4, maxHeight: 180, overflow: 'auto' };
  const modRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8,
    padding: '6px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 11.5, color: 'var(--t2,#cbd5e1)' };
  const skillPillStyle = (c: string): React.CSSProperties => ({ display: 'inline-block' as const, padding: '1px 6px',
    borderRadius: 4, background: `${c}18`, fontSize: 9.5, fontWeight: 600, color: c, marginRight: 3 });

  const renderTab = () => {
    if (activeTab === 'curriculum') {
      return (
        <div style={tabContentStyle}>
          {modules.map((m) => (
            <div key={m.month} style={modRowStyle}>
              <span>{m.icon}</span>
              <span style={{ fontWeight: 700, flex: 1 }}>{m.title}</span>
              {m.skills.slice(0, 2).map((s) => <span key={s} style={skillPillStyle(hc)}>{s}</span>)}
            </div>
          ))}
          {onOpenDiagnosticReport && (
            <span style={{ color: 'var(--accent,#6366f1)', textDecoration: 'none', fontWeight: 700,
              fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}
              onClick={() => onOpenDiagnosticReport(`${plan.title} Diagnostic Assessment`)}>
              📊 View Diagnostic Assessment Report ➔
            </span>
          )}
        </div>
      );
    }
    if (activeTab === 'capstone') {
      return (
        <div style={tabContentStyle}>
          {[{ s: 'Sprint 1', d: 'Requirements & Architecture Design' }, { s: 'Sprint 2', d: 'Core Feature Implementation & Auth' },
            { s: 'Sprint 3', d: 'Integration, Testing & CI/CD Pipeline' }, { s: 'Sprint 4', d: 'Deploy & Oral Defense Review' }]
            .map((sp) => (
              <div key={sp.s} style={{ ...modRowStyle, fontSize: 11 }}>
                <span style={{ fontWeight: 900, color: hc }}>{sp.s}</span><span style={{ color: 'var(--t3,#94a3b8)' }}>{sp.d}</span>
              </div>
            ))}
          <p style={{ fontSize: 10.5, color: 'var(--t3,#94a3b8)', marginTop: 4 }}>
            <strong>Architecture:</strong> Microservices • <strong>DB:</strong> PostgreSQL/Supabase • <strong>CI/CD:</strong> GitHub Actions + Docker
          </p>
        </div>
      );
    }
    return (
      <div style={tabContentStyle}>
        {['✓ Industrial Project Certificate (ISO-Aligned, Cryptographically Signed)', '✓ PinIT Tech Labs Experience Letter (Engineering Fellow)',
          '✓ SHA-256 Tamper-Proof Hash & QR Verifiable', '✓ Live Verification at pinitcareer.vercel.app/verify/[id]']
          .map((c, i) => <div key={i} style={{ fontSize: 11, color: 'var(--t2,#cbd5e1)' }}>{c}</div>)}
        <button onClick={() => onPreviewCredentials(plan)} style={{
          marginTop: 6, padding: '8px 14px', borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          border: 'none', color: '#000', fontSize: 11.5, fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(245,158,11,0.35)' }}>
          🏆 Preview Sample Credentials ➔
        </button>
      </div>
    );
  };

  return (
    <div style={wrap}>
      {plan.badge && (
        <div style={{ position: 'absolute' as const, top: -11, right: 16, padding: '3px 10px', borderRadius: 20,
          fontSize: 9.5, fontWeight: 900, letterSpacing: '0.04em', background: `linear-gradient(135deg, ${hc}, #6366f1)`,
          color: '#fff', boxShadow: `0 4px 12px ${hc}66` }}>{plan.badge}</div>
      )}

      {/* Top Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={badgeLabel}>{plan.tier.toUpperCase()} INTENSIVE</span>
        <span style={rolePill}><span>{plan.targetRole}</span><span style={{ color: hc }}> • {plan.hireabilityBoost}</span></span>
      </div>

      {/* Title & Duration */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0 }}>{plan.title}</h3>
        <p style={{ fontSize: 12, color: 'var(--t3,#94a3b8)', margin: '3px 0 0', lineHeight: 1.4 }}>{plan.subtitle}</p>
        <span style={{ fontSize: 11, color: 'var(--t3,#94a3b8)', margin: '4px 0 0', fontWeight: 700 }}>{plan.totalProgramDuration}</span>
      </div>

      {/* Journey Pipeline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', padding: '10px 12px',
        background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
        {steps.map((step, i) => (
          <React.Fragment key={step.step}>
            {i > 0 && <span key="a" style={{ color: 'var(--t3,#94a3b8)', fontSize: 11, flexShrink: 0 }}>➔</span>}
            <span key={step.step} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
              borderRadius: 999, background: `${hc}15`, border: `1px solid ${hc}25`, fontSize: 10.5, fontWeight: 700, color: 'var(--t2,#cbd5e1)' }}>
              <span>{step.icon}</span><span>{step.title}</span>
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Flagship Build */}
      <div style={{ padding: '14px 16px', borderRadius: 14, background: `linear-gradient(135deg, ${hc}15, ${hc}08)`,
        border: `1px solid ${hc}25`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: hc, marginBottom: 4 }}>🚀 Flagship Build: {flagship.title}</div>
        <p style={{ fontSize: 11, color: 'var(--t3,#94a3b8)', lineHeight: 1.5, margin: '0 0 8px 0' }}>{flagship.desc}</p>
        <div>{flagship.tech.map((t) => (
          <span key={t} style={{ display: 'inline-block' as const, padding: '2px 8px', borderRadius: 6,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            fontSize: 10.5, fontWeight: 600, color: hc, marginRight: 4, marginBottom: 4 }}>{t}</span>
        ))}</div>
      </div>

      {/* 3-Tab Switcher */}
      <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 12, background: 'rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.05)' }}>
        {tabs.map((tab, idx) => (
          <button key={tab} onClick={() => setActiveTab(tabs[idx])} style={pillBtn(activeTab === tabs[idx])}>
            {TAB_LABELS[idx]}
          </button>
        ))}
      </div>
      {renderTab()}

      {/* Cashback & Savings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12,
        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
        fontSize: 11.5, fontWeight: 700, color: 'var(--t1)' }}>📦 +{plan.scholarCashbackPins || 350} Scholar Reward Coins included</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12,
        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
        fontSize: 11.5, fontWeight: 700, color: 'var(--t2,#cbd5e1)' }}>💡 {plan.competitorSavings}</div>

      {/* Pricing & CTA */}
      <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>⚡ {plan.pinsPrice}</span>
            <span style={{ fontSize: 12, color: 'var(--t3,#94a3b8)' }}>Pins · ₹{plan.inrPrice.toLocaleString('en-IN')}</span>
          </div>
          <span style={{ padding: '2px 8px', borderRadius: 6, background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            fontSize: 9.5, fontWeight: 900, color: '#000' }}>PINIT2026 (-₹1,000)</span>
        </div>
        <button onClick={() => onSelectPlan(plan)} disabled={isSelected} style={ctaBtn}
          onMouseOver={(e) => { if (!isSelected) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${hc}55`; } }}
          onMouseOut={(e) => { if (!isSelected) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${hc}44`; } }}>
          {isSelected ? '✓ Currently Active Plan' : 'Select & Unlock Program ➔'}
        </button>
      </div>
    </div>
  );
};

export default EnhancedCrashCoursePlanCard;