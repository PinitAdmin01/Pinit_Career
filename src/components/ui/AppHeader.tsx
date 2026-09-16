'use client';

import React from 'react';
import Link from 'next/link';
import PinsBadge from '@/components/pins/PinsBadge';
import CoinStreamOverlay from '@/components/pins/CoinStreamOverlay';
import FlyingPinsAnimation from '@/components/pins/FlyingPinsAnimation';
import GearAudioHub from '@/components/nav/GearAudioHub';
import { toast } from '@/lib/store/useAppStore';

export interface AppHeaderProps {
  isLessonOrDetail: boolean;
  isGroupDiscussionCall: boolean;
  isRoleplayActive: boolean;
  effectiveFocusMode: boolean;
  toggleFocusMode: () => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pageTitle: string;
  isStudent: boolean;
  careerScore: number;
  dnaScore: number;
  trustScore: number;
  missionOnlyStreak: number;
  liteUiMode: boolean;
  setLiteUiMode: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string;
  toggleTheme: () => void;
  wsConnected: boolean;
  unread: number;
  userId?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isLessonOrDetail,
  isGroupDiscussionCall,
  isRoleplayActive,
  effectiveFocusMode,
  toggleFocusMode,
  mobileOpen,
  setMobileOpen,
  pageTitle,
  isStudent,
  careerScore,
  dnaScore,
  trustScore,
  missionOnlyStreak,
  liteUiMode,
  setLiteUiMode,
  theme,
  toggleTheme,
  wsConnected,
  unread,
  userId,
}) => {
  return (
    <header className="topbar" style={{ display: (isLessonOrDetail || isGroupDiscussionCall || isRoleplayActive) ? 'none' : 'flex' }}>
      {/* Mobile burger */}
      <button onClick={() => setMobileOpen(o => !o)}
        className="mobile-menu-btn"
        aria-label="Toggle navigation menu"
        aria-expanded={mobileOpen}
        style={{ background:'none', border:'none', cursor:'pointer', color:'var(--t2)', fontSize:18, padding:4, borderRadius:6, display:'none' }}>
        ☰
      </button>

      {/* If focusMode is active, allow returning with a floating action bar brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {effectiveFocusMode && (
          <div
            onClick={toggleFocusMode}
            title="Exit Focus Mode"
            aria-label="Exit Focus Mode"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleFocusMode(); }}
            style={{
              width: 24, height: 24, borderRadius: 6,
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, color: 'white', cursor: 'pointer',
              fontFamily: 'var(--font-display)', marginRight: 6
            }}
          >
            Pi
          </div>
        )}
        <div className="topbar-title">{pageTitle}</div>
      </div>

      <div className="topbar-spacer" />

      {/* Score pills — connected to live CareerOSContext (simpler view in Focus mode) */}
      {isStudent && !effectiveFocusMode && (
        <div className="topbar-scores" role="region" aria-label="Live Telemetry Scores">
          {[
            { label:'Career Score', icon:'Career', val:careerScore, color:'var(--teal)' },
            { label:'Career DNA Score', icon:'DNA', val:dnaScore,    color:'var(--purple)' },
            { label:'Trust Score', icon:'🛡',  val:trustScore,  color:'var(--green)'  },
          ].map(p => (
            <div key={p.icon} className="ts-pill" role="meter" aria-label={`${p.label}: ${Math.round(p.val)} out of 100`} aria-valuenow={Math.round(p.val)} aria-valuemin={0} aria-valuemax={100}>
              <span className="ts-dot" style={{ background:p.color }} aria-hidden="true" />
              <span aria-hidden="true">{p.icon}</span> <span style={{ color:p.color }}>{Math.round(p.val)}</span>
            </div>
          ))}

          {/* Vault Quick-link Icon */}
          <Link href="/vault" title="Vault Secure Area" aria-label="Navigate to Career Vault" className="ts-pill" style={{
            textDecoration:'none', borderColor:'var(--accent)'
          }}>
            Vault
          </Link>

          {missionOnlyStreak > 0 && (
            <div className="ts-pill" role="status" aria-label={`Current Mission Streak: ${missionOnlyStreak} days`} style={{
              background:'var(--amber-light)', borderColor:'var(--amber-light)', color:'var(--amber)',
            }}>
              {missionOnlyStreak}d
            </div>
          )}

          {/* Pin Balance */}
          <PinsBadge size="sm" showLink />
        </div>
      )}

      {/* Theme Switcher & Focus Mode Toggles Control Group */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 8 }}>
        {/* Lite UI Mode Toggle Button */}
        {isStudent && (
          <button
            onClick={() => setLiteUiMode(prev => {
              const next = !prev;
              if (typeof window !== 'undefined') {
                localStorage.setItem(`pinit_${userId || 'guest'}_lite_ui_mode`, JSON.stringify(next));
              }
              toast.info(next ? 'Lite Mode Active 💬' : 'Cockpit Mode Active 🖥️', next ? 'Guided conversational UI loaded.' : 'Standard telemetry graphs restored.');
              return next;
            })}
            title={liteUiMode ? 'Switch to Cockpit Dashboard' : 'Switch to Conversational Lite UI'}
            className="topbar-icon-btn"
            style={{
              background: liteUiMode ? 'var(--teal-light)' : 'var(--bg3)',
              borderColor: liteUiMode ? 'var(--teal)' : 'var(--border)',
            }}
          >
            {liteUiMode ? '💬' : '🖥️'}
          </button>
        )}

        {/* ⚙️ Universal Preferences & Ambience Hub */}
        <GearAudioHub theme={theme === 'light' ? 'light' : 'dark'} size="sm" />

        {/* Focus Mode Toggle Button (Invisible Mode) - Only for students */}
        {isStudent && (
          <button
            onClick={toggleFocusMode}
            title={effectiveFocusMode ? 'Deactivate Focus Mode' : 'Activate Focus Mode'}
            aria-label={effectiveFocusMode ? 'Deactivate Focus Mode' : 'Activate Focus Mode'}
            style={{
              background: effectiveFocusMode ? 'rgba(220,38,38,0.1)' : 'var(--bg3)',
              border: effectiveFocusMode ? '1px solid rgba(220,38,38,0.3)' : '1px solid var(--border)',
              borderRadius: 20, padding: '3px 12px', display: 'flex',
              alignItems: 'center', gap: 4, cursor: 'pointer',
              fontSize: 10.5, fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: effectiveFocusMode ? 'var(--coral)' : 'var(--t2)', outline: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span aria-hidden="true">🤫</span> {!effectiveFocusMode && <span style={{ fontSize: 10 }}>Focus</span>}
          </button>
        )}
      </div>

      {/* WS dot */}
      <div title={wsConnected ? 'Live data connected' : 'Connecting to live service...'} aria-label={wsConnected ? 'Live data connected' : 'Connecting to live service'} role="status" style={{ display:'flex', alignItems:'center', gap:4 }}>
        <span aria-hidden="true" style={{
          width:6, height:6, borderRadius:'50%',
          background: 'var(--green)',
          display:'inline-block',
          boxShadow: '0 0 0 2px rgba(var(--success-deep-rgb), 0.25)',
          transition:'all 0.3s',
        }} />
      </div>

      {/* Bell */}
      <Link href="/notifications" aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`} style={{ position:'relative', color:'var(--t2)', textDecoration:'none', padding:6, borderRadius:8, display:'flex', alignItems:'center' }}>
        <span aria-hidden="true">🔔</span>
        {unread > 0 && (
          <span aria-hidden="true" style={{
            position:'absolute', top:2, right:2,
            minWidth:14, height:14, borderRadius:7,
            background:'var(--coral)', color:'white',
            fontSize:9, fontWeight:700, fontFamily:'var(--font-mono)',
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'2px solid var(--bg2)', padding:'0 3px',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Link>
      <FlyingPinsAnimation />
    </header>
  );
};
