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
  isCollegeConnected?: boolean;
  onOpenConnectCollege?: () => void;
  activeTourTabKey?: string | null;
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
  isCollegeConnected = false,
  onOpenConnectCollege,
  activeTourTabKey = null,
}) => {
  return (
    <header className="topbar" style={{ display: (isLessonOrDetail || isGroupDiscussionCall || isRoleplayActive) ? 'none' : 'flex' }}>
      {/* Mobile burger */}
      <button onClick={() => setMobileOpen(o => !o)}
        className="mobile-menu-btn"
        aria-label="Toggle navigation menu"
        aria-expanded={mobileOpen}
        style={{ background:'none', border:'none', cursor:'pointer', color:'var(--t2)', padding:4, borderRadius:6, display:'none', alignItems:'center', justifyContent:'center' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="topbar-title">{pageTitle}</div>
      </div>

      <div className="topbar-spacer" />

      {/* Clean Topbar Right Utilities: Pins, Gear, Academic (A) */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Pin Balance */}
        <PinsBadge size="sm" showLink />

        {/* Universal Preferences & Ambience Hub */}
        <GearAudioHub theme={theme === 'light' ? 'light' : 'dark'} size="sm" />

        {/* Academic Tabs Trigger Circle "A" */}
        {isStudent && (toggleRightSidebar || onOpenConnectCollege) && (
          <button
            type="button"
            onClick={() => {
              if (!isCollegeConnected) {
                onOpenConnectCollege?.();
              } else {
                toggleRightSidebar?.();
              }
            }}
            data-testid="academic-circle-btn"
            title={
              !isCollegeConnected
                ? 'Campus Academic — Connect to College (A)'
                : isRightSidebarOpen
                ? 'Close Academic Tabs (A)'
                : 'Open Academic Tabs (A)'
            }
            aria-label={!isCollegeConnected ? 'Connect to College' : 'Toggle Campus Academic Services'}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: isRightSidebarOpen || activeTourTabKey === 'academic-sidebar'
                ? 'linear-gradient(135deg, var(--accent), var(--purple))'
                : 'var(--bg3)',
              border: activeTourTabKey === 'academic-sidebar'
                ? '2px solid #38bdf8'
                : `1.5px solid ${isRightSidebarOpen ? 'var(--accent)' : 'var(--border)'}`,
              color: isRightSidebarOpen || activeTourTabKey === 'academic-sidebar' ? '#ffffff' : 'var(--accent)',
              fontWeight: 900,
              fontSize: 14,
              fontFamily: 'var(--font-display), sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: activeTourTabKey === 'academic-sidebar'
                ? '0 0 18px rgba(56, 189, 248, 0.8), 0 0 30px rgba(99, 102, 241, 0.5)'
                : isRightSidebarOpen ? '0 0 12px rgba(99, 102, 241, 0.45)' : 'none',
              transform: activeTourTabKey === 'academic-sidebar' ? 'scale(1.18)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              lineHeight: 1,
              padding: 0,
              flexShrink: 0,
              zIndex: activeTourTabKey === 'academic-sidebar' ? 10 : 1,
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
