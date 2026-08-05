'use client';
// PinsGate — wraps any feature button/action that requires pins.
// Supports item-specific 30-minute duration unlocks and active timer indicators.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCareerOS, PIN_COSTS } from '@/lib/context/CareerOSContext';
import './pins.css';

interface Props {
  featureKey?: string;
  itemKey?: string;
  category?: 'quest' | 'mission' | 'interview' | 'ai_interview' | 'gd' | 'group_discussion' | 'attention_span_game';
  onUnlocked: () => void;
  children: React.ReactNode;
  mode?: 'wrap' | 'button';
  buttonLabel?: string;
  buttonClass?: string;
  disabled?: boolean;
}

export default function PinsGate({
  featureKey,
  itemKey,
  category,
  onUnlocked,
  children,
  mode = 'wrap',
  buttonLabel,
  buttonClass,
  disabled
}: Props) {
  const { pins, spendPins, canAfford, isItemUnlocked, getItemRemainingSeconds, unlockItem } = useCareerOS();
  const [showConfirm, setShowConfirm] = useState(false);

  // Inferred category key for PIN_COSTS
  const targetCategory = category || (itemKey ? (itemKey.split(':')[0] as any) : featureKey) || 'quest';
  const targetKey = itemKey || featureKey || targetCategory;
  const meta = PIN_COSTS[targetCategory] || PIN_COSTS[featureKey || ''] || { cost: 20, label: 'Feature Access', icon: '⚡' };

  const [remainingSec, setRemainingSec] = useState<number>(0);
  const active = targetKey ? isItemUnlocked(targetKey) : false;

  useEffect(() => {
    if (!active || !targetKey) {
      setRemainingSec(0);
      return;
    }
    const updateTime = () => setRemainingSec(getItemRemainingSeconds(targetKey));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [active, targetKey, getItemRemainingSeconds]);

  const affordable = pins >= meta.cost;

  function handleClick() {
    if (disabled) return;
    if (active) {
      // Already unlocked within 30 min duration window
      onUnlocked();
      return;
    }
    setShowConfirm(true);
  }

  function handleConfirm() {
    setShowConfirm(false);
    if (targetKey && targetCategory) {
      const ok = unlockItem(targetKey, targetCategory as any);
      if (ok) onUnlocked();
    } else {
      const ok = spendPins(targetCategory);
      if (ok) onUnlocked();
    }
  }

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, width: mode === 'button' ? 'auto' : '100%' }}>
        {/* Cost / Active Duration Tag with Shimmer & Glow */}
        <div 
          className={active ? 'pins-badge-glow' : ''}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 10.5, fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: active ? '#10b981' : affordable ? '#6366f1' : '#ef4444',
            background: active 
              ? 'rgba(16,185,129,0.12)' 
              : affordable 
              ? 'rgba(99,102,241,0.12)' 
              : 'rgba(239,68,68,0.12)',
            border: `1px solid ${active ? 'rgba(16,185,129,0.3)' : affordable ? 'rgba(99,102,241,0.3)' : 'rgba(239,68,68,0.3)'}`,
            padding: '3px 10px', borderRadius: 12,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <span className="pins-icon-energy">⚡</span>
          {active ? (
            <span>Unlocked ({formatMinSec(remainingSec)})</span>
          ) : (
            <span>{meta.cost} pins{targetCategory !== 'attention_span_game' ? ' · 30m access' : ''}</span>
          )}
          {!active && !affordable && <span style={{ opacity: 0.8, fontSize: 9.5 }}>· Need {meta.cost - pins} more</span>}
        </div>

        {/* Action Trigger */}
        <div 
          onClick={handleClick} 
          style={{ 
            cursor: disabled ? 'not-allowed' : 'pointer', 
            opacity: disabled ? 0.5 : 1, 
            width: '100%',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1)'; }}
          onMouseLeave={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {children}
        </div>
      </div>

      {/* Glassmorphism Confirmation Modal */}
      {showConfirm && (
        <div 
          className="pins-modal-backdrop"
          onClick={e => { if (e.target === e.currentTarget) setShowConfirm(false); }}
        >
          <div className="pins-glass-card pins-modal-content" style={{ padding: '32px 36px' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ 
                fontSize: 48, 
                marginBottom: 12,
                display: 'inline-block',
                filter: 'drop-shadow(0 4px 12px rgba(99,102,241,0.3))'
              }}>
                {meta.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: 'var(--t1)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                {affordable ? `Unlock ${meta.label}?` : 'Insufficient Pins'}
              </h3>
              <p style={{ fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.6 }}>
                {affordable
                  ? targetCategory === 'attention_span_game'
                    ? `Use ${meta.cost} of your ${pins} pins to launch a focus training game.`
                    : `Use ${meta.cost} of your ${pins} pins to unlock 30 minutes of duration access to this ${meta.label}.`
                  : `You need ${meta.cost} pins for ${meta.label}. You currently have ${pins} pins. Pins refresh to 120 every day at 1:00 AM.`
                }
              </p>
            </div>

            {/* Pin balance bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 18px', background: 'rgba(255,255,255,0.05)', borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.1)', marginBottom: 22,
            }}>
              <span style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>Current Student Balance</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 15, color: affordable ? '#818cf8' : '#ef4444' }}>
                ⚡ {pins} pins
              </span>
            </div>

            {affordable ? (
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={handleConfirm} 
                  className="pins-shimmer-button"
                  style={{
                    flex: 1, padding: '14px 20px', borderRadius: 14, color: '#fff',
                    fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  <span>⚡ Confirm Unlock ({meta.cost} Pins)</span>
                </button>
                <button 
                  onClick={() => setShowConfirm(false)} 
                  className="btn-ghost" 
                  style={{ flexShrink: 0, padding: '14px 18px', borderRadius: 14 }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
                <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4, fontWeight: 600 }}>
                  Student Pin System Rules:
                </div>
                {[
                  { icon: '⏰', text: 'Daily Refresh: 120 Pins received every day at 1:00 AM' },
                  { icon: '💳', text: 'Buy Packs: Instantly top up your pin balance' },
                  { icon: '⏱', text: '30 Min Duration: Access remains active for 30 minutes per item' },
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12.5, color: 'var(--t2)' }}>
                    <span>{tip.icon}</span><span>{tip.text}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                  <Link href="/pricing" style={{ textDecoration: 'none', flex: 1 }}>
                    <button className="pins-shimmer-button" style={{ width: '100%', padding: '12px', borderRadius: 14, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', justifyContent: 'center' }}>
                      💳 Buy Pin Pack
                    </button>
                  </Link>
                  <button onClick={() => setShowConfirm(false)} className="btn-ghost" style={{ width: '100%', padding: '12px', borderRadius: 14, justifyContent: 'center', flex: 1 }}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
