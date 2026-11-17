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
  toggleFocusMode?: () => void;
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
  toggleRightSidebar?: () => void;
  isRightSidebarOpen?: boolean;
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
  toggleRightSidebar,
  isRightSidebarOpen,
}) => {
  return (
    <header className="topbar" style={{ display: (isLessonOrDetail || isGroupDiscussionCall || isRoleplayActive) ? 'none' : 'flex' }}>
      {/* Mobile burger */}
      <button onClick={() => setMobileOpen(o => !o)}
        className="mobile-menu-btn"
        aria-label="Toggle navigation menu"
        aria-expanded={mobileOpen}
        style={{ background:'none', border:'none', cursor:'pointer', color:'var(--t2)', fontSize:20, padding:4, borderRadius:6, display:'none' }}>
        ☰
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="topbar-title">{pageTitle}</div>
      </div>

      <div className="topbar-spacer" />

      {/* Clean Topbar Right Utilities: Pins, Gear, Academic (A) */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Pin Balance */}
        <PinsBadge size="sm" showLink />

        {/* ⚙️ Universal Preferences & Ambience Hub */}
        <GearAudioHub theme={theme === 'light' ? 'light' : 'dark'} size="sm" />

        {/* 🎓 Academic Tabs Trigger Circle "A" */}
        {isStudent && toggleRightSidebar && (
          <button
            type="button"
            onClick={toggleRightSidebar}
            data-testid="academic-circle-btn"
            title={isRightSidebarOpen ? 'Close Academic Tabs (A)' : 'Open Academic Tabs (A)'}
            aria-label="Toggle Campus Academic Services"
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: isRightSidebarOpen
                ? 'linear-gradient(135deg, var(--accent), var(--purple))'
                : 'var(--bg3)',
              border: `1.5px solid ${isRightSidebarOpen ? 'var(--accent)' : 'var(--border)'}`,
              color: isRightSidebarOpen ? '#ffffff' : 'var(--accent)',
              fontWeight: 900,
              fontSize: 14,
              fontFamily: 'var(--font-display), sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: isRightSidebarOpen ? '0 0 12px rgba(99, 102, 241, 0.45)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              lineHeight: 1,
              padding: 0,
              flexShrink: 0,
            }}
          >
            A
          </button>
        )}
      </div>
      <FlyingPinsAnimation />
    </header>
  );
};
