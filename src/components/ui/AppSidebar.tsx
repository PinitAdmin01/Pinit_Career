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
    label: 'Quests & Courses',
    tooltip: 'Industrial Certification & Learning Roadmaps',
    description: 'Guided 60-day industrial curriculum, hands-on lessons, and verified certification tracks.'
  },
  '/missions': {
    label: 'Daily Missions',
    tooltip: 'Hands-On Daily Coding Missions & Drills',
    description: 'Bite-sized algorithmic challenges, speed drills, and daily streak rewards.'
  },
  '/arena': {
    label: 'Challenging Arena',
    tooltip: 'Competitive Coding Battles & Peer Arena',
    description: '1v1 coding duels, timed hackathons, and algorithmic skill matchmaking.'
  },
  '/projects': {
    label: 'Projects & Innovation',
    tooltip: 'Projects & Innovation Hub: Course Capstones & Collaborative Squads',
    description: 'Collaborative real-world repositories, squad work, and production deploy pipelines.'
  },
  '/leaderboard': {
    label: 'Leaderboard & Leagues',
    tooltip: 'Global Student Rankings & League Standings',
    description: 'Campus, regional, and global leaderboards with weekly promotion leagues.'
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
    label: 'Mirror',
    tooltip: 'Career Mirror: ATS Resume Studio, Digital Twin & Roadmaps',
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
    { href: '/quests', icon: '🗺', label: 'Quests & Courses' },
    { href: '/missions', icon: '⚡', label: 'Daily Missions' },
    { href: '/arena', icon: '⚔️', label: 'Challenging Arena' },
    { href: '/projects', icon: '🚀', label: 'Projects & Innovation' },
    { href: '/leaderboard', icon: '🏆', label: 'Leaderboard & Leagues' },
    { href: '/interview', icon: '🎙', label: 'AI Interview' },
    { href: '/mirror', icon: '🪞', label: 'Mirror' },
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
  { href: '/pins',          icon: '⚡', label: 'Pins & Wallet'              },
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

  const safePins = Number.isFinite(Number(pins)) ? Math.max(0, Number(pins)) : 0;
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

  function NavLink({ href, icon, label, badge, indent = false }: NavLeaf & { indent?: boolean }) {
    const active = isNavActive(href);
    const isTourSpotlight = Boolean(
      activeTourRoute && (
        href === activeTourRoute ||
        (activeTourRoute !== '/dashboard' && href.startsWith(activeTourRoute)) ||
        (href === '/interview' && activeTourRoute.startsWith('/group-discussion')) ||
        (href === '/mirror' && (activeTourRoute.startsWith('/learning') || activeTourRoute.startsWith('/career-builder') || activeTourRoute.startsWith('/career_builder')))
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
          style={isTourSpotlight ? { transform: 'scale(1.16)', color: 'var(--accent)', transition: 'transform 0.25s' } : undefined}
        >
          {icon}
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

  const pinsActive = isNavActive('/pins');
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
      <div className="sidebar-logo" style={isCompact ? { flexDirection: 'column', gap: 6, padding: '10px 6px' } : undefined}>
        <Link
          href={homeHref}
          onClick={() => handleNavSelect(homeHref)}
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}
          title={isCompact ? 'PinIT Career OS — Home' : undefined}
        >
          {isCompact || effectiveFocusMode ? (
            <span className="logo-mark logo-mark-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src="/brand/pinit-career-mark.png"
                alt="PINIT CAREER"
                width={32}
                height={32}
                priority
                style={{ width: 32, height: 32, objectFit: 'contain' }}
              />
            </span>
          ) : (
            <span className="lp-brand-lockup" style={{ height: 40, padding: '2px 4px', display: 'flex', alignItems: 'center' }}>
              <Image
                src="/brand/pinit-career-logo-clear.png"
                alt="PINIT CAREER"
                width={148}
                height={34}
                className="lp-brand-logo"
                style={{ height: 34, maxWidth: 148, width: 'auto', objectFit: 'contain' }}
                priority
              />
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
            {!isCompact && !effectiveFocusMode && <div className="nav-section-label">{sec.section}</div>}
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

        {/* 2. Pins & Wallet (Student Workspace with Live Balance) */}
        {isStudent && (
          isCompact ? (
            <Link
              href="/pins"
              title={`Pins & Wallet (${safePins.toLocaleString()} pins)`}
              onClick={() => handleNavSelect('/pins')}
              className={`nav-item${pinsActive ? ' active' : ''}`}
              style={{ position: 'relative' }}
            >
              <span className="nav-icon">⚡</span>
              {safePins < 20 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 8,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: 'var(--coral)',
                  }}
                />
              )}
            </Link>
          ) : (
            <Link
              href="/pins"
              onClick={() => handleNavSelect('/pins')}
              className={`nav-item${pinsActive ? ' active' : ''}`}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                padding: '7px 10px',
                borderRadius: 9,
                background: pinsActive
                  ? 'var(--accent-light)'
                  : safePins < 20
                    ? 'var(--coral-light)'
                    : 'var(--bg3)',
                border: `1px solid ${
                  pinsActive ? 'var(--accent)' : safePins < 20 ? 'var(--coral)' : 'var(--border)'
                }`,
                transition: 'all 0.18s ease',
                marginBottom: 3,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                <span className="nav-icon" style={{ fontSize: 16.5, color: pinsActive ? 'var(--accent)' : undefined }}>
                  ⚡
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: pinsActive ? 'var(--accent)' : 'var(--t1)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Pins &amp; Wallet
                </span>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '2px 7px',
                  borderRadius: 10,
                  background: safePins < 20 ? 'var(--coral-light)' : 'var(--accent-light)',
                  border: `1px solid ${safePins < 20 ? 'var(--coral)' : 'color-mix(in srgb, var(--accent) 40%, transparent)'}`,
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: safePins < 20 ? 'var(--coral)' : 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.2,
                  flexShrink: 0,
                }}
              >
                <span>{safePins.toLocaleString()}</span>
                <span style={{ fontSize: 10.5, opacity: 0.85 }}>+</span>
              </div>
            </Link>
          )
        )}

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
