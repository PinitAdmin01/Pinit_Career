'use client';
import Image from 'next/image';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { executeSecureLogout } from '@/lib/auth/secureLogout';

export type NavLeaf  = { href: string; icon: string; label: string; badge?: boolean; tooltip?: string; description?: string };
export type NavGroup = { label: string; icon: string; children: NavLeaf[] };
export type NavNode  = NavLeaf | NavGroup;
export type NavSection = { section: string; items: NavNode[] };

export const isGroup = (n: NavNode): n is NavGroup => 'children' in n;

export const ROUTE_TOOLTIPS: Record<string, { label: string; tooltip: string; description: string }> = {
  '/dashboard': {
    label: 'Dashboard',
    tooltip: 'Student Command Center & Academic Overview',
    description: 'Real-time overview of current quests, learning streak, attendance, and weekly milestones.'
  },
  '/quests': {
    label: 'Courses',
    tooltip: 'Industrial Certification & Learning Roadmaps',
    description: 'Guided 60-day industrial curriculum, hands-on lessons, and verified certification tracks.'
  },
  '/missions': {
    label: 'Daily Missions',
    tooltip: 'Hands-On Daily Coding Missions & Drills',
    description: 'Bite-sized algorithmic challenges, speed drills, and daily streak rewards.'
  },
  '/arena': {
    label: 'Arena',
    tooltip: 'Battle, track League Points, and browse divisions',
    description: 'Compete in coding duels, follow your sprint rank, and inspect Campus, Global, and Guild standings.'
  },
  '/projects': {
    label: 'Projects',
    tooltip: 'Projects: Course Capstones & Practical Development',
    description: 'Build individual GitHub-verified Capstones to earn accredited industry credential certifications.'
  },
  '/innovation-hub': {
    label: 'Innovation Hub',
    tooltip: 'Innovation Hub: Collaborative Hackathon Squads & Public Projects',
    description: 'Form or join 3-person hackathon squads, build live prototypes, and submit to jury evaluation.'
  },
  '/leaderboard': {
    label: 'Arena & Leaderboard',
    tooltip: 'Sprint standings and league divisions',
    description: 'Campus, global, and guild standings with weekly promotion and demotion by League Points rank.'
  },
  '/interview': {
    label: 'AI Interview',
    tooltip: 'Interview Prep: AI Technical & Behavioral Mock Simulator',
    description: 'Simulated voice and code screening interviews with instant rubric evaluation and feedback.'
  },
  '/group-discussion': {
    label: 'GD Practice',
    tooltip: 'Group Discussion: Real-Time AI Peer Discussion Rooms',
    description: 'Collaborative discussion rounds with AI peers evaluating articulation, leadership, and logic.'
  },
  '/learning': {
    label: 'Learning & Twin',
    tooltip: 'Adaptive Learning Pathways & Career Digital Twin',
    description: 'AI-driven personalized skill trees, knowledge gap analysis, and competency modeling.'
  },
  '/attention-span': {
    label: 'Attention Span',
    tooltip: 'Focus & Attention: Cognitive Focus Tracking & Calibration',
    description: 'Cognitive load assessments, pomodoro focus calibration, and attention span analytics.'
  },
  '/shop': {
    label: 'Pins & Shop',
    tooltip: 'Pins Economy & Item Shop: Power Passes, Avatars & Wallet Ledger',
    description: 'Recharge Pins, inspect ledger transactions, and equip avatar cosmetics & AI power passes.'
  },
  '/friends': {
    label: 'My Network',
    tooltip: 'Campus Network: Peer Directory, Study Groups & Network',
    description: 'Connect with classmates, form study squads, and follow peers across courses.'
  },
  '/pins': {
    label: 'Pins & Wallet',
    tooltip: 'Pins & Rewards: Vault Balance, Transactions & Grants',
    description: 'Track earned PinIT tokens, redeem course upgrades, and inspect ledger transactions.'
  },
  '/notifications': {
    label: 'Notifications',
    tooltip: 'Activity Alerts & Unread Notifications',
    description: 'Live updates on code reviews, mentor feedbacks, quest deadlines, and squad invites.'
  },
  '/profile': {
    label: 'Profile',
    tooltip: 'Student Identity, Verified Credentials & Preferences',
    description: 'Personal portfolio, cryptographically signed credentials, resume sync, and account settings.'
  },
  '/mirror': {
    label: 'Digital Studio',
    tooltip: 'Digital Studio: ATS Resume Studio & Career Digital Twin',
    description: 'Unified career reflection: AI resume builder, ATS score optimizer, and digital twin skill simulation.'
  },
  '/career-builder': {
    label: 'Career Builder',
    tooltip: 'Career Architect & ATS Resume Intelligence Studio',
    description: 'AI resume tailoring, ATS keyword optimization, and targeted role alignment scoring.'
  },
};

export const STUDENT_NAV: NavSection[] = [
  { section: 'PinIT Career OS', items: [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/quests', icon: '🗺', label: 'Courses' },
    { href: '/missions', icon: '⚡', label: 'Daily Missions' },
    { href: '/projects', icon: '📁', label: 'Projects' },
    { href: '/innovation-hub', icon: '💡', label: 'Innovation Hub' },
    { href: '/interview', icon: '🎙', label: 'AI Interview' },
    { href: '/mirror', icon: '🪞', label: 'Digital Studio' },
    { href: '/attention-span', icon: '🧠', label: 'Attention Span' }
  ]}
];

export const RIGHT_NAV: { id: string; href?: string; icon: string; label: string }[] = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'exams', icon: '📝', label: 'My Exams' },
  { id: 'results', icon: '📊', label: 'My Results' },
  { id: 'notes', icon: '📚', label: 'Study Notes' },
  { id: 'notifications', href: '/notifications', icon: '🔔', label: 'Notifications' },
  { id: 'friends', href: '/friends', icon: '👥', label: 'My Network' },
  { id: 'services', href: '/services', icon: '💼', label: 'Student Services' },
  { id: 'library', href: '/library', icon: '📚', label: 'Library Center' },
  { id: 'hostel', href: '/hostel', icon: '🏢', label: 'Hostel Hub' },
  { id: 'transport', href: '/transport', icon: '🚌', label: 'Transit Desk' },
  { id: 'events', href: '/events', icon: '🎉', label: 'Campus Events' },
  { id: 'contact_admin', href: '/grievances', icon: '💬', label: 'Contact Admin' },
  { id: 'research', href: '/research', icon: '🔬', label: 'Research Desk' },
  { id: 'career_intel', href: '/career-intelligence', icon: '🎯', label: 'Career Intelligence' },
  { id: 'finance', href: '/finance', icon: '💳', label: 'Finance & Fees' },
  { id: 'infrastructure', href: '/maintenance', icon: '🔧', label: 'Infrastructure' },
  { id: 'advisor', href: '/advisor', icon: '🧠', label: 'AI Academic Advisor' }
];

export const RIGHT_NAV_SVG_ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  exams: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  results: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  notes: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  notifications: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  friends: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  services: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  library: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  hostel: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  ),
  transport: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="13" rx="2"/>
      <path d="M3 10h18"/>
      <circle cx="7.5" cy="19" r="1.5"/>
      <circle cx="16.5" cy="19" r="1.5"/>
      <path d="M6 17v2"/>
      <path d="M18 17v2"/>
    </svg>
  ),
  events: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  contact_admin: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  research: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6"/>
      <path d="M10 3v6.5L5.5 18a2 2 0 0 0 1.7 3h9.6a2 2 0 0 0 1.7-3L14 9.5V3"/>
      <path d="M8.5 14h7"/>
    </svg>
  ),
  career_intel: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  finance: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  infrastructure: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  advisor: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
};

export const ADMIN_NAV: NavSection[] = [
  { section: 'PinIT Career OS', items: [
    { href: '/admin', icon: '🏠', label: 'Dashboard' },
    { href: '/campus-admin', icon: '🏛️', label: 'Campus Governance (All 34)' },
    { label: 'Campus Core', icon: '🎓', children: [
      { href: '/admin/cohorts', icon: '📊', label: 'Cohort Placement Funnel' },
      { href: '/admissions', icon: '🎟️', label: 'Admissions' },
      { href: '/admin/students', icon: '🧑‍🎓', label: 'Students Directory' },
      { href: '/admin/exams', icon: '📝', label: 'Exam Manager' },
      { href: '/admin?tab=documents', icon: '📄', label: 'Document Vault' },
      { href: '/admin?tab=services', icon: '💼', label: 'Student Services' }
    ]},
    { label: 'Student Experience', icon: '🎒', children: [
      { href: '/admin?tab=library', icon: '📚', label: 'Library' },
      { href: '/admin?tab=hostel', icon: '🏢', label: 'Hostel Desk' },
      { href: '/admin?tab=transport', icon: '🚌', label: 'Transport' },
      { href: '/admin?tab=events', icon: '🎉', label: 'Events Registry' },
      { href: '/admin?tab=broadcast', icon: '🔔', label: 'Broadcast Admin' },
      { href: '/admin?tab=grievances', icon: '⚖️', label: 'Grievance Review' }
    ]},
    { label: 'Faculty Studio', icon: '👨‍🏫', children: [
      { href: '/admin/teacher', icon: '👩‍🏫', label: 'Faculty Manager' },
      { href: '/admin?tab=research', icon: '🔬', label: 'Research Projects' },
      { href: '/quests/teacher-select', icon: '🗺', label: 'Quest Selector' }
    ]},
    { label: 'Career Intelligence', icon: '🚀', children: [
      { href: '/career-dna', icon: '🧬', label: 'Career DNA' },
      { href: '/career-builder', icon: '🛠️', label: 'Resume Builder' },
      { href: '/recruiter', icon: '🔍', label: 'ATS Pipelines' },
      { href: '/interview', icon: '🎙', label: 'AI Interview' },
      { href: '/interview?tab=gd', icon: '🗣️', label: 'GD Boardroom' },
      { href: '/missions', icon: '⚡', label: 'Coding Missions' },
      { href: '/quests', icon: '🗺', label: 'Coding Quests' },
      { href: '/crm', icon: '💼', label: 'Company CRM' }
    ]},
    { label: 'Campus Operations', icon: '🏢', children: [
      { href: '/admin?tab=finance', icon: '💳', label: 'Finance Console' },
      { href: '/admin?tab=maintenance', icon: '🔧', label: 'Infrastructure Maintenance' }
    ]},
    { label: 'Administration', icon: '⚙', children: [
      { href: '/admin?tab=users', icon: '👥', label: 'Users & Roles' },
      { href: '/university', icon: '🏫', label: 'Multi-campus Select' }
    ]},
    { label: 'Intelligence Center', icon: '📊', children: [
      { href: '/analytics', icon: '📊', label: 'Analytics' },
      { href: '/university?tab=reports', icon: '📋', label: 'Annual Reports' },
      { href: '/admin?tab=advisor', icon: '🧠', label: 'AI Advisor Logs' }
    ]},
    { label: 'Enterprise', icon: '🌐', children: [
      { href: '/integrations', icon: '🔌', label: 'API Integrations' },
      { href: '/admin/settings?tab=migration', icon: '⚡', label: 'Migration Wizard' },
      { href: '/admin/settings?tab=erp', icon: '🔑', label: 'API Gateway keys' }
    ]}
  ]}
];

export const RECRUITER_NAV: NavSection[] = [
  { section: 'Hiring', items: [
    { href: '/recruiter', icon: '🔍', label: 'Candidates' },
    { href: '/analytics', icon: '📊', label: 'Analytics'  },
  ]},
];

export const PARENT_NAV: NavSection[] = [
  { section: 'Family', items: [
    { href: '/parent', icon: '👨‍👩‍👧', label: 'My Children' },
  ]},
];

export const CONSULTANT_NAV: NavSection[] = [
  { section: 'CRM', items: [
    { href: '/consultant', icon: '🗂', label: 'Student CRM' },
    { href: '/analytics',  icon: '📊', label: 'Analytics'   },
  ]},
];

export const TEACHER_NAV: NavSection[] = [
  { section: 'Faculty Workspace', items: [
    { href: '/admin/teacher', icon: '👩‍🏫', label: 'Teacher Panel' },
    { href: '/quests/teacher-select', icon: '🗺', label: 'Quest Selector' },
    { href: '/quests', icon: '⚔️', label: 'Coding Quests' },
    { href: '/learning', icon: '📖', label: 'Learning Roadmaps' },
  ]},
  { section: 'Academic Mentoring', items: [
    { href: '/advisor', icon: '🧠', label: 'AI Advisor Logs' },
    { href: '/portfolio', icon: '👤', label: 'Student Portfolio' },
    { href: '/interview', icon: '🎙', label: 'AI Interview Studio' },
    { href: '/interview?tab=gd', icon: '🗣️', label: 'GD Boardroom' },
    { href: '/internships', icon: '🏢', label: 'Internships Review' },
    { href: '/projects', icon: '💼', label: 'Projects & Innovation' },
    { href: '/passport', icon: '🎫', label: 'Skill Passport & Transcript' }
  ]}
];

export const BOTTOM_NAV: NavLeaf[] = [
  { href: '/friends',       icon: '👥', label: 'My Network'                 },
  { href: '/arena',         icon: '⚔️', label: 'Arena'                      },
  { href: '/notifications', icon: '🔔', label: 'Notifications', badge: true },
  { href: '/profile',       icon: '👤', label: 'Profile'                    },
];

export function getNav(role: string): NavSection[] {
  if (role === 'teacher') return TEACHER_NAV;
  if (['admin', 'superadmin'].includes(role)) return ADMIN_NAV;
  if (role === 'recruiter') return RECRUITER_NAV;
  if (role === 'parent') return PARENT_NAV;
  if (role === 'consultant') return CONSULTANT_NAV;
  return STUDENT_NAV;
}

export function isPathActive(pathname: string, href: string, currentSearch = ''): boolean {
  const cleanPathname = (pathname || '').split('?')[0].replace(/\/$/, '') || '/';
  const [rawHrefPath, hrefQuery] = (href || '').split('?');
  const hrefPath = rawHrefPath.replace(/\/$/, '') || '/';

  // Arena and leaderboard share one sidebar destination.
  if (hrefPath === '/arena' && cleanPathname === '/leaderboard') return true;

  if (hrefPath === '/') return cleanPathname === '/';

  const rawSearch = currentSearch || (pathname && pathname.includes('?') ? pathname.split('?')[1] : '');
  const searchStr = rawSearch.startsWith('?') ? rawSearch.slice(1) : rawSearch;

  if (hrefQuery) {
    if (cleanPathname !== hrefPath) return false;
    const expected = new URLSearchParams(hrefQuery);
    const actual = new URLSearchParams(searchStr);
    for (const [k, v] of Array.from(expected.entries())) {
      if (actual.get(k) !== v) return false;
    }
    return true;
  }

  // Exact hub roots that have sibling sub-routes or query-tab children in the same menu
  if (hrefPath === '/admin' || hrefPath === '/university') {
    if (cleanPathname !== hrefPath) return false;
    const actualTab = new URLSearchParams(searchStr).get('tab');
    if (actualTab) return false;
    return true;
  }

  // `/quests/teacher-select` has its own menu item; don't double-highlight `/quests`
  if (hrefPath === '/quests' && cleanPathname === '/quests/teacher-select') return false;

  // Unified AI Interview and GD tab routing
  if (href === '/interview?tab=gd' && (cleanPathname === '/group-discussion' || (cleanPathname === '/interview' && new URLSearchParams(searchStr).get('tab') === 'gd'))) return true;
  if (href === '/interview' && cleanPathname === '/interview') {
    const tab = new URLSearchParams(searchStr).get('tab');
    if (tab === 'gd' && currentSearch === 'tab=gd') return false;
    return true;
  }
  if (hrefPath === '/interview' && cleanPathname === '/group-discussion') return true;

  // Unified Mirror hub: /mirror also activates on /learning, /career-builder, /career_builder
  if (hrefPath === '/mirror' && (cleanPathname === '/learning' || cleanPathname === '/career-builder' || cleanPathname === '/career_builder')) return true;

  // Unified Pins & Shop hub: /shop and /pins activate each other
  if (hrefPath === '/shop' && cleanPathname === '/pins') return true;
  if (hrefPath === '/pins' && cleanPathname === '/shop') return true;

  return cleanPathname === hrefPath || cleanPathname.startsWith(hrefPath + '/');
}

export interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  effectiveFocusMode: boolean;
  focusMode: boolean;
  pathname: string;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  toggleLeftSidebar: (val?: boolean) => void;
  activeTourRoute: string | null;
  activeTourTabKey?: string | null;
  setActiveAcademicTab: (tab: string | null) => void;
  activeAcademicTab?: string | null;
  currentSearch?: string;
  forceShowCareerBuilder?: boolean;
  user: any;
  isStudent: boolean;
  pins: number;
  unread: number;
  logout: () => Promise<void>;
  router: any;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed,
  effectiveFocusMode,
  focusMode,
  pathname,
  mobileOpen,
  setMobileOpen,
  toggleLeftSidebar,
  activeTourRoute,
  activeTourTabKey = null,
  setActiveAcademicTab,
  activeAcademicTab = null,
  currentSearch = '',
  forceShowCareerBuilder = false,
  user,
  isStudent,
  pins,
  unread,
  logout,
}) => {
  const qc = useQueryClient();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [loggingOut, setLoggingOut] = useState(false);

  // On mobile overlay drawer, always show expanded labels & footer regardless of desktop collapsed state
  const isCompact = collapsed && !mobileOpen;
  const isHiddenByRoute = effectiveFocusMode || pathname.startsWith('/admin/teacher') || pathname.startsWith('/teacher');

  const safeUnread = Number.isFinite(Number(unread)) ? Math.max(0, Number(unread)) : 0;

  const rawDisp = typeof user?.displayName === 'string' ? user.displayName : (typeof user?.name === 'string' ? user.name : '');
  const rawReal =
    (user as any)?.fullName ||
    (user as any)?.full_name ||
    (user as any)?.candidateName ||
    (user as any)?.onboardingAnswers?.candidateName ||
    (user as any)?.onboardingAnswers?.fullName ||
    (user as any)?.onboardingAnswers?.name;
  const realName = typeof rawReal === 'string' ? rawReal : '';
  const rawUsername = typeof user?.username === 'string' ? user.username : '';

  const displayName =
    (rawDisp && !rawDisp.startsWith('usr_') && rawDisp.toLowerCase() !== 'student')
      ? rawDisp
      : (realName || rawDisp || (rawUsername && !rawUsername.startsWith('usr_') ? rawUsername : '') || (typeof user?.email === 'string' ? user.email.split('@')[0] : '') || (isStudent ? 'Student' : 'Member'));
  const avatarInitial = (displayName.trim()[0] || 'S').toUpperCase();
  const roleLabel = user?.role || (isStudent ? 'student' : 'member');

  const nav = useMemo<NavSection[]>(() => {
    const base = getNav(user?.role || 'student');
    const shouldShowCareer = isStudent && (forceShowCareerBuilder || (typeof pathname === 'string' && pathname.startsWith('/career-builder')));
    if (!shouldShowCareer) return base;
    return base.map((sec, idx) => {
      if (idx !== 0) return sec;
      const alreadyHas = sec.items.some((it) => !isGroup(it) && it.href === '/career-builder');
      if (alreadyHas) return sec;
      return {
        ...sec,
        items: [
          ...sec.items,
          { href: '/career-builder', icon: '🛠️', label: 'Career Builder' },
        ],
      };
    });
  }, [user?.role, isStudent, forceShowCareerBuilder, pathname]);

  const toggleGroup = (label: string) => setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  const handleNavSelect = (targetHref: string) => {
    setActiveAcademicTab(null);
    setMobileOpen(false);
    if (typeof window !== 'undefined' && !targetHref.includes('?')) {
      try {
        const url = new URL(window.location.href);
        const targetPath = targetHref.split('?')[0];
        if (url.pathname === targetPath && url.searchParams.has('tab') && activeAcademicTab) {
          url.searchParams.delete('tab');
          window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
        }
      } catch {
        // Ignore URL parsing errors in non-standard environments
      }
    }
  };

  const isNavActive = (href: string): boolean => {
    // When an academic right-sidebar overlay tab is overriding <main>, left-sidebar routes are not active
    if (isStudent && activeAcademicTab && pathname !== '/profile') return false;
    // In teacher nav, `/quests` should not highlight when `/quests?tab=passport` is active
    if (!isStudent && href === '/quests' && currentSearch.includes('tab=passport')) return false;
    return isPathActive(pathname, href, currentSearch);
  };

const NAV_SVG_ICONS: Record<string, React.ReactNode> = {
  '/dashboard': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  '/quests': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="9" y1="7" x2="15" y2="7"/>
      <line x1="9" y1="11" x2="13" y2="11"/>
    </svg>
  ),
  '/missions': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="22" y1="12" x2="18" y2="12"/>
      <line x1="6" y1="12" x2="2" y2="12"/>
      <line x1="12" y1="6" x2="12" y2="2"/>
      <line x1="12" y1="22" x2="12" y2="18"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  '/projects': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  '/innovation-hub': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  ),
  '/interview': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  ),
  '/mirror': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  '/attention-span': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  '/friends': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  '/arena': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
      <line x1="13" y1="19" x2="19" y2="13"/>
      <line x1="16" y1="16" x2="20" y2="20"/>
      <line x1="19" y1="21" x2="21" y2="19"/>
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/>
      <line x1="5" y1="14" x2="9" y2="18"/>
      <line x1="7" y1="17" x2="4" y2="20"/>
      <line x1="3" y1="19" x2="5" y2="21"/>
    </svg>
  ),
  '/notifications': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  '/profile': (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

  function NavLink({ href, icon, label, badge, indent = false }: NavLeaf & { indent?: boolean }) {
    const active = isNavActive(href);
    const navIcon = NAV_SVG_ICONS[href] || icon;
    const isTourSpotlight = Boolean(
      activeTourRoute && (
        activeTourTabKey === 'academic-sidebar' || activeTourTabKey === 'intro' || activeTourTabKey === 'outro'
          ? false
          : activeTourTabKey === 'dashboard'
            ? href === '/dashboard'
            : (
                href === activeTourRoute ||
                (activeTourRoute !== '/dashboard' && href.startsWith(activeTourRoute)) ||
                (href === '/interview' && activeTourRoute.startsWith('/group-discussion')) ||
                (href === '/mirror' && (activeTourRoute.startsWith('/learning') || activeTourRoute.startsWith('/career-builder') || activeTourRoute.startsWith('/career_builder')))
              )
      )
    );

    const tooltipInfo = ROUTE_TOOLTIPS[href];
    const tooltipText = isCompact
      ? label
      : tooltipInfo
        ? `${label} — ${tooltipInfo.tooltip}`
        : label;

    return (
      <Link
        href={href}
        title={tooltipText}
        aria-label={tooltipInfo ? `${label} (${tooltipInfo.tooltip})` : label}
        onClick={() => handleNavSelect(href)}
        className={`nav-item${active ? ' active' : ''}${isTourSpotlight ? ' pinit-tour-spotlight' : ''}`}
        style={{
          ...(indent && !isCompact ? { paddingLeft: 32 } : {}),
          ...(isTourSpotlight ? {
            background: 'var(--accent-light)',
            border: '1.5px solid var(--accent)',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.35)',
            transform: 'scale(1.01)',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 5,
          } : {})
        }}
      >
        <span
          className="nav-icon"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            flexShrink: 0,
            ...(isTourSpotlight ? { transform: 'scale(1.16)', color: 'var(--accent)', transition: 'transform 0.25s' } : {}),
          }}
        >
          {navIcon}
        </span>
        {!isCompact && (
          <span
            style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: isTourSpotlight ? 800 : undefined,
              color: isTourSpotlight ? 'var(--accent)' : undefined,
            }}
          >
            {label}
          </span>
        )}
        {!isCompact && isTourSpotlight && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              background: 'var(--accent)',
              color: '#ffffff',
              padding: '2px 6px',
              borderRadius: 10,
              letterSpacing: '0.4px',
              flexShrink: 0,
            }}
          >
            👈 HERE
          </span>
        )}
        {!isCompact && badge && safeUnread > 0 && !isTourSpotlight && (
          <span className="nav-badge">{safeUnread > 9 ? '9+' : safeUnread}</span>
        )}
        {isCompact && badge && safeUnread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 5,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--coral)',
              border: '2px solid var(--bg2)',
            }}
          />
        )}
      </Link>
    );
  }

  function NavGroupHeader({ group }: { group: NavGroup }) {
    const hasActiveChild = group.children.some((c) => isNavActive(c.href));
    const open = openGroups[group.label] ?? hasActiveChild;

    if (isCompact) {
      return (
        <>
          {group.children.map((c) => (
            <NavLink key={`${c.href}_${c.label}`} {...c} />
          ))}
        </>
      );
    }

    return (
      <>
        <button
          type="button"
          onClick={() => toggleGroup(group.label)}
          aria-expanded={open}
          className={`nav-item${hasActiveChild ? ' active' : ''}`}
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <span className="nav-icon">{group.icon}</span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.label}</span>
          <span
            style={{
              fontSize: 11,
              color: 'var(--t3)',
              transition: 'transform 0.2s',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          >
            ▸
          </span>
        </button>
        {open && group.children.map((c) => <NavLink key={`${c.href}_${c.label}`} {...c} indent />)}
      </>
    );
  }

  const profileActive = isNavActive('/profile');
  const homeHref = isStudent || roleLabel === 'student' || roleLabel === 'member' || roleLabel === 'alumni'
    ? '/dashboard'
    : roleLabel === 'recruiter'
      ? '/recruiter'
      : roleLabel === 'parent'
        ? '/parent'
        : roleLabel === 'consultant'
          ? '/consultant'
          : ['admin', 'superadmin', 'teacher', 'faculty'].includes(roleLabel)
            ? '/admin'
            : '/dashboard';

  return (
    <aside
      aria-label="Primary navigation"
      className={`sidebar${isCompact || isHiddenByRoute ? ' collapsed' : ''}${mobileOpen ? ' open' : ''}`}
      style={{
        display: isHiddenByRoute ? 'none' : 'flex',
        width: isHiddenByRoute
          ? 0
          : mobileOpen
            ? 272
            : isCompact
              ? 'var(--sidebar-collapsed-w, 64px)'
              : 'var(--sidebar-w, clamp(220px, 15.7vw, 247px))',
        borderRight: isHiddenByRoute ? 'none' : '1px solid var(--border)',
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1), border 0.22s',
        overflow: 'hidden',
      }}
    >
      {/* Logo & Collapse/Expand Header */}
      <div className="sidebar-logo" style={isCompact ? { flexDirection: 'column', gap: 6, padding: '10px 6px' } : { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px' }}>
        <Link
          href={homeHref}
          onClick={() => handleNavSelect(homeHref)}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}
          title={isCompact ? 'PinIT Career OS — Home' : undefined}
        >
          <span className="logo-mark logo-mark-img" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Image
              src="/brand/pinit-career-mark.png"
              alt="PinIT Career OS"
              width={30}
              height={30}
              priority
              style={{ width: 30, height: 30, objectFit: 'contain', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.35))' }}
            />
          </span>
          {!isCompact && !effectiveFocusMode && (
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 12.5,
                fontWeight: 900,
                letterSpacing: '0.07em',
                color: 'var(--t1)',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                display: 'inline-block',
                lineHeight: 1,
              }}
            >
              PINIT CAREER OS
            </span>
          )}
        </Link>

        {mobileOpen ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            title="Close menu"
            style={{
              marginLeft: 'auto',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              color: 'var(--t2)',
              fontSize: 14,
              width: 28,
              height: 28,
              borderRadius: 7,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        ) : !isCompact && !focusMode ? (
          <button
            type="button"
            onClick={() => toggleLeftSidebar(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar (⌘[)"
            style={{
              marginLeft: 'auto',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              color: 'var(--t2)',
              fontSize: 16,
              width: 26,
              height: 26,
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ‹
          </button>
        ) : isCompact && !effectiveFocusMode ? (
          <button
            type="button"
            onClick={() => toggleLeftSidebar(false)}
            aria-label="Expand sidebar"
            title="Expand sidebar (⌘[)"
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              color: 'var(--t2)',
              fontSize: 14,
              width: 34,
              height: 22,
              borderRadius: 6,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ›
          </button>
        ) : null}
      </div>

      {/* Primary Navigation */}
      <nav className="sidebar-nav">
        {nav.map((sec) => (
          <div key={sec.section}>
            {!isCompact && !effectiveFocusMode && sec.section !== 'PinIT Career OS' && (
              <div className="nav-section-label">{sec.section}</div>
            )}
            {sec.items.map((item) =>
              isGroup(item) ? <NavGroupHeader key={item.label} group={item} /> : <NavLink key={item.href} {...item} />
            )}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {/* 1. Friends (Student Workspace) */}
        {isStudent && <NavLink href="/friends" icon="👥" label="My Network" />}

        {/* 2. Arena & Leaderboard (Relocated under My Network) */}
        {isStudent && <NavLink href="/arena" icon="⚔️" label="Arena" />}

        {/* 3. Notifications */}
        <NavLink href="/notifications" icon="🔔" label="Notifications" badge={true} />

        {/* 4. Profile & Session Card */}
        {isCompact ? (
          <Link
            href="/profile"
            title={`${displayName} (${roleLabel})`}
            onClick={() => handleNavSelect('/profile')}
            className={`nav-item${profileActive ? ' active' : ''}`}
            style={{ justifyContent: 'center', marginTop: 4, padding: '6px 0' }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                border: `2px solid ${profileActive ? 'var(--accent)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13.5,
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              {avatarInitial}
            </div>
          </Link>
        ) : (
          <div
            className={`nav-item${profileActive ? ' active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 9px',
              marginTop: 4,
              borderRadius: 9,
              border: `1px solid ${profileActive ? 'var(--accent)' : 'var(--border)'}`,
              background: profileActive ? 'var(--accent-light)' : 'var(--bg3)',
              transition: 'all 0.18s ease',
            }}
          >
            <Link
              href="/profile"
              onClick={() => handleNavSelect('/profile')}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flex: 1,
                minWidth: 0,
                color: 'inherit',
              }}
              title="Open Profile & Settings"
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent), var(--purple))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.28)',
                }}
              >
                {avatarInitial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--t1)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayName}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: 'var(--t3)',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'capitalize',
                  }}
                >
                  {roleLabel} • Profile
                </div>
              </div>
            </Link>
            <button
              type="button"
              disabled={loggingOut}
              onClick={() => {
                if (loggingOut) return;
                setLoggingOut(true);
                setMobileOpen(false);
                executeSecureLogout({
                  queryClient: qc,
                  authLogout: logout,
                  redirectTo: '/login',
                });
              }}
              aria-label="Sign out"
              title="Sign out"
              style={{
                background: 'none',
                border: 'none',
                cursor: loggingOut ? 'not-allowed' : 'pointer',
                color: 'var(--t3)',
                fontSize: 15.5,
                padding: '4px 6px',
                borderRadius: 6,
                flexShrink: 0,
                transition: 'color 0.18s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--coral)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--t3)')}
            >
              ⏻
            </button>
          </div>
        )}

        {/* Quick Portal Switcher: Strictly hidden in Student Portal */}
        {!isCompact && !isStudent && roleLabel !== 'student' && ['admin', 'superadmin', 'teacher', 'faculty'].includes(roleLabel) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 8px',
              marginTop: 4,
              borderRadius: 6,
              background: 'var(--bg2, rgba(255, 255, 255, 0.03))',
              border: '1px solid var(--border)',
              fontSize: 11,
              color: 'var(--t3)',
            }}
          >
            <span style={{ fontWeight: 650, color: 'var(--t3)' }}>Portal:</span>
            <Link
              href="/admin"
              style={{
                color: roleLabel === 'admin' ? 'var(--accent)' : 'var(--t2)',
                textDecoration: 'none',
                fontWeight: roleLabel === 'admin' ? 700 : 500,
                padding: '2px 4px',
                borderRadius: 4,
              }}
              title="Campus Administration Portal"
            >
              🏛️ Admin
            </Link>
            <span style={{ opacity: 0.4 }}>•</span>
            <Link
              href="/teacher"
              style={{
                color: roleLabel === 'teacher' ? 'var(--accent)' : 'var(--t2)',
                textDecoration: 'none',
                fontWeight: roleLabel === 'teacher' ? 700 : 500,
                padding: '2px 4px',
                borderRadius: 4,
              }}
              title="Faculty & Teacher Portal"
            >
              👨‍🏫 Teacher
            </Link>
            <span style={{ opacity: 0.4 }}>•</span>
            <Link
              href="/internship-demo"
              style={{
                color: 'var(--t2)',
                textDecoration: 'none',
                fontWeight: 600,
                padding: '2px 4px',
                borderRadius: 4,
              }}
              title="Job Simulation Interactive Demo"
            >
              🧪 Demo
            </Link>
            {roleLabel !== 'student' && (
              <>
                <span style={{ opacity: 0.4 }}>•</span>
                <Link
                  href="/dashboard"
                  style={{
                    color: 'var(--t2)',
                    textDecoration: 'none',
                    padding: '2px 4px',
                    borderRadius: 4,
                  }}
                  title="Student Workspace"
                >
                  🎓 Student
                </Link>
              </>
            )}
          </div>
        )}

        {/* Expand toggle when collapsed */}
        {isCompact && !effectiveFocusMode && (
          <button
            type="button"
            onClick={() => toggleLeftSidebar(false)}
            className="nav-item"
            style={{ justifyContent: 'center', marginTop: 4 }}
            aria-label="Expand sidebar"
            title="Expand sidebar (⌘[)"
          >
            <span className="nav-icon">›</span>
          </button>
        )}
      </div>
    </aside>
  );
};
