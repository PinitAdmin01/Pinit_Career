'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export type NavLeaf  = { href: string; icon: string; label: string; badge?: boolean };
export type NavGroup = { label: string; icon: string; children: NavLeaf[] };
export type NavNode  = NavLeaf | NavGroup;
export type NavSection = { section: string; items: NavNode[] };

export const isGroup = (n: NavNode): n is NavGroup => 'children' in n;

export const STUDENT_NAV: NavSection[] = [
  { section: 'PinIT Career OS', items: [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/quests', icon: '🗺', label: 'Quests & Courses' },
    { href: '/missions', icon: '⚡', label: 'Daily Missions' },
    { href: '/arena', icon: '⚔️', label: 'Challenging Arena' },
    { href: '/projects', icon: '🚀', label: 'Projects & Squads' },
    { href: '/leaderboard', icon: '🏆', label: 'Leaderboard & Leagues' },
    { href: '/interview', icon: '🎙', label: 'AI Interview' },
    { href: '/group-discussion', icon: '💬', label: 'GD Practice' },
    { href: '/learning', icon: '📖', label: 'Learning & Twin' },
    { href: '/attention-span', icon: '🧠', label: 'Attention Span' }
  ]}
];

export const RIGHT_NAV: { id: string; href?: string; icon: string; label: string }[] = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'exams', icon: '📝', label: 'My Exams' },
  { id: 'results', icon: '📊', label: 'My Results' },
  { id: 'notes', icon: '📚', label: 'Study Notes' },
  { id: 'notifications', href: '/notifications', icon: '🔔', label: 'Notifications' },
  { id: 'friends', href: '/friends', icon: '👥', label: 'Friends & Network' },
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
      { href: '/university', icon: '📋', label: 'Annual Reports' },
      { href: '/admin?tab=advisor', icon: '🧠', label: 'AI Advisor Logs' }
    ]},
    { label: 'Enterprise', icon: '🌐', children: [
      { href: '/integrations', icon: '🔌', label: 'API Integrations' },
      { href: '/admin/settings', icon: '⚡', label: 'Migration Wizard' },
      { href: '/admin/settings', icon: '🔑', label: 'API Gateway keys' }
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
    { href: '/internships', icon: '🏢', label: 'Internships Review' },
    { href: '/projects', icon: '💼', label: 'Industry Projects & Squads' },
    { href: '/quests?tab=passport', icon: '🎫', label: 'Skill Passport & Transcript' }
  ]}
];

export const BOTTOM_NAV: NavLeaf[] = [
  { href: '/friends',       icon: '👥', label: 'Friends'                    },
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

export function isPathActive(pathname: string, href: string) {
  if (href === '/') return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
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
  user: any;
  isStudent: boolean;
  pins: number;
  unread: number;
  logout: () => Promise<void>;
  router: any;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed,
  setCollapsed,
  effectiveFocusMode,
  focusMode,
  pathname,
  mobileOpen,
  toggleLeftSidebar,
  activeTourRoute,
  setActiveAcademicTab,
  user,
  isStudent,
  pins,
  unread,
  logout,
  router,
}) => {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const nav = getNav(user?.role || 'student');
  const toggleGroup = (label: string) => setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));

  function NavLink({ href, icon, label, badge, indent = false }: NavLeaf & { indent?: boolean }) {
    const active = isPathActive(pathname, href);
    const isTourSpotlight = activeTourRoute && (href === activeTourRoute || (activeTourRoute !== '/dashboard' && href.startsWith(activeTourRoute)));
    return (
      <Link
        href={href}
        title={collapsed ? label : undefined}
        onClick={() => {
          setActiveAcademicTab(null);
        }}
        className={`nav-item${active ? ' active' : ''}${isTourSpotlight ? ' pinit-tour-spotlight' : ''}`}
        style={{
          ...(indent && !collapsed ? { paddingLeft: 32 } : {}),
          ...(isTourSpotlight ? {
            background: 'rgba(var(--brand-rgb), 0.22)',
            border: '1.5px solid var(--accent)',
            boxShadow: '0 0 18px rgba(var(--brand-rgb), 0.6)',
            transform: 'scale(1.02)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 5,
          } : {})
        }}
      >
        <span className="nav-icon" style={isTourSpotlight ? { transform: 'scale(1.2)', filter: 'drop-shadow(0 0 6px rgba(var(--brand-rgb), 0.8))', transition: 'transform 0.3s' } : undefined}>{icon}</span>
        {!collapsed && <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight: isTourSpotlight ? 800 : undefined, color: isTourSpotlight ? '#fff' : undefined }}>{label}</span>}
        {!collapsed && isTourSpotlight && (
          <span style={{ fontSize: 9, fontWeight: 900, background: 'var(--accent)', color: 'var(--text)', padding: '2px 6px', borderRadius: 10, letterSpacing: '0.4px', animation: 'bounce 0.8s infinite alternate' }}>
            👈 HERE
          </span>
        )}
        {!collapsed && badge && unread > 0 && !isTourSpotlight && <span className="nav-badge">{unread > 9 ? '9+' : unread}</span>}
        {collapsed && badge && unread > 0 && (
          <span style={{ position:'absolute', top:5, right:5, width:7, height:7, borderRadius:'50%', background:'var(--coral)', border:'2px solid var(--bg2)' }} />
        )}
      </Link>
    );
  }

  function NavGroupHeader({ group }: { group: NavGroup }) {
    const open = !!openGroups[group.label];
    const hasActiveChild = group.children.some(c => isPathActive(pathname, c.href));

    if (collapsed) {
      return (
        <>
          {group.children.map(c => <NavLink key={c.href} {...c} />)}
        </>
      );
    }

    return (
      <>
        <button
          type="button"
          onClick={() => toggleGroup(group.label)}
          className={`nav-item${hasActiveChild ? ' active' : ''}`}
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <span className="nav-icon">{group.icon}</span>
          <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{group.label}</span>
          <span style={{ fontSize: 10, color: 'var(--t4)', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▸</span>
        </button>
        {open && group.children.map(c => <NavLink key={c.href} {...c} indent />)}
      </>
    );
  }

  return (
    <aside 
      className={`sidebar${collapsed || effectiveFocusMode || (pathname.startsWith('/admin/teacher') || pathname.startsWith('/teacher')) ? ' collapsed' : ''}${mobileOpen ? ' open' : ''}`}
      style={{
        display: (effectiveFocusMode || pathname.startsWith('/admin/teacher') || pathname.startsWith('/teacher')) ? 'none' : 'flex',
        width: effectiveFocusMode || (pathname.startsWith('/admin/teacher') || pathname.startsWith('/teacher')) ? 0 : (collapsed ? 'var(--sidebar-collapsed-w, 5vw)' : 'var(--sidebar-w, 15vw)'),
        borderRight: effectiveFocusMode || (pathname.startsWith('/admin/teacher') || pathname.startsWith('/teacher')) ? 'none' : '1px solid var(--border)',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), border 0.25s',
        overflow: 'hidden'
      }}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <Link
          href="/dashboard"
          onClick={() => setActiveAcademicTab(null)}
          style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}
        >
          {collapsed || effectiveFocusMode ? (
            <span className="logo-mark logo-mark-img">
              <Image src="/brand/pinit-career-logo.png" alt="PINIT CAREER" width={32} height={32} priority />
            </span>
          ) : (
            <span className="lp-brand-lockup" style={{ height: 40, padding: '2px 6px' }}>
              <Image src="/brand/pinit-career-logo.png" alt="PINIT CAREER" width={148} height={34} className="lp-brand-logo" style={{ height: 34, maxWidth: 148, width: 'auto', objectFit: 'contain' }} priority />
            </span>
          )}
        </Link>
        {!collapsed && !focusMode && (
          <button onClick={() => toggleLeftSidebar(true)} title="Collapse (⌘[)"
            style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'var(--t4)', fontSize:18, padding:'2px 6px', borderRadius:6, lineHeight:1 }}>
            ‹
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {nav.map(sec => {
          return (
            <div key={sec.section}>
              {!collapsed && !effectiveFocusMode && <div className="nav-section-label">{sec.section}</div>}
              {sec.items.map(item =>
                isGroup(item)
                  ? <NavGroupHeader key={item.label} group={item} />
                  : <NavLink key={item.href} {...item} />
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer - Merged Navigation */}
      <div className="sidebar-footer">
        {/* 1. Friends */}
        <NavLink href="/friends" icon="👥" label="Friends" />

        {/* 2. Pins & Wallet (Merged Concept with Live Balance) */}
        {collapsed ? (
          <Link
            href="/pins"
            title={`Pins & Wallet (${pins.toLocaleString()} pins)`}
            onClick={() => setActiveAcademicTab(null)}
            className={`nav-item${isPathActive(pathname, '/pins') ? ' active' : ''}`}
            style={{ position: 'relative' }}
          >
            <span className="nav-icon">⚡</span>
            {pins < 20 && (
              <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', background: 'var(--coral)' }} />
            )}
          </Link>
        ) : (
          <Link
            href="/pins"
            onClick={() => setActiveAcademicTab(null)}
            className={`nav-item${isPathActive(pathname, '/pins') ? ' active' : ''}`}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              padding: '7px 10px',
              borderRadius: 9,
              background: isPathActive(pathname, '/pins') ? 'rgba(99, 102, 241, 0.18)' : (pins < 20 ? 'rgba(220,38,38,0.08)' : 'rgba(255,255,255,0.03)'),
              border: `1px solid ${isPathActive(pathname, '/pins') ? 'var(--accent)' : (pins < 20 ? 'rgba(220,38,38,0.25)' : 'rgba(255,255,255,0.07)')}`,
              transition: 'all 0.2s ease',
              marginBottom: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span className="nav-icon" style={{ fontSize: 15 }}>⚡</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--t1)', whiteSpace: 'nowrap' }}>Pins & Wallet</span>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              padding: '2px 7px',
              borderRadius: 10,
              background: pins < 20 ? 'rgba(220,38,38,0.2)' : 'rgba(99, 102, 241, 0.2)',
              border: `1px solid ${pins < 20 ? 'var(--coral)' : 'rgba(99, 102, 241, 0.4)'}`,
              fontSize: 11,
              fontWeight: 800,
              color: pins < 20 ? 'var(--coral)' : 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.2
            }}>
              <span>{pins.toLocaleString()}</span>
              <span style={{ fontSize: 10, opacity: 0.85 }}>+</span>
            </div>
          </Link>
        )}

        {/* 3. Notifications */}
        <NavLink href="/notifications" icon="🔔" label="Notifications" badge={true} />

        {/* 4. Profile (Merged with User Card) */}
        {collapsed ? (
          <Link
            href="/profile"
            title={`${user?.displayName || 'Profile'} (${user?.role || 'Guest'})`}
            onClick={() => setActiveAcademicTab(null)}
            className={`nav-item${isPathActive(pathname, '/profile') ? ' active' : ''}`}
            style={{ justifyContent: 'center', marginTop: 4, padding: 0 }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: isPathActive(pathname, '/profile') ? 'linear-gradient(135deg, var(--accent), var(--purple))' : 'rgba(255,255,255,0.1)',
              border: `1.5px solid ${isPathActive(pathname, '/profile') ? 'var(--accent)' : 'var(--border)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 800,
              color: 'var(--text)'
            }}>
              {user?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
          </Link>
        ) : (
          <div
            className={`nav-item${isPathActive(pathname, '/profile') ? ' active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 9px',
              marginTop: 4,
              borderRadius: 9,
              border: `1px solid ${isPathActive(pathname, '/profile') ? 'var(--accent)' : 'var(--border)'}`,
              background: isPathActive(pathname, '/profile') ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg3)',
              transition: 'all 0.2s ease',
            }}
          >
            <Link
              href="/profile"
              onClick={() => setActiveAcademicTab(null)}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flex: 1,
                minWidth: 0,
                color: 'inherit'
              }}
              title="View Profile"
            >
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                flexShrink: 0,
                background: 'linear-gradient(135deg,var(--accent),var(--purple))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
                color: 'var(--text)',
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)'
              }}>
                {user?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.displayName || 'Faculty / Visitor'}
                </div>
                <div style={{ fontSize: 9.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)', textTransform: 'capitalize' }}>
                  {user?.role || 'Guest'} • Profile
                </div>
              </div>
            </Link>
            <button
              onClick={() => logout().then(() => router.push('/'))}
              title="Logout"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--t4)',
                fontSize: 14,
                padding: '4px 6px',
                borderRadius: 6,
                flexShrink: 0,
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--coral)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--t4)')}
            >
              ⏻
            </button>
          </div>
        )}

        {/* Expand toggle when collapsed */}
        {collapsed && !effectiveFocusMode && (
          <button onClick={() => setCollapsed(false)} className="nav-item" style={{ justifyContent:'center', marginTop:6 }} title="Expand (⌘[)">
            <span className="nav-icon">›</span>
          </button>
        )}
      </div>
    </aside>
  );
};
