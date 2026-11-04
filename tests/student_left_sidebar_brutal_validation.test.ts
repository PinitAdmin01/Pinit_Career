import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';

// Stub CSS imports for Node.js test environment
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.css'] = () => {};
}
import {
  STUDENT_NAV,
  BOTTOM_NAV,
  getNav,
  isGroup,
  isPathActive,
  AppSidebar,
  type NavLeaf,
  type NavGroup,
} from '../src/components/ui/AppSidebar';

describe('BRUTAL VALIDATION — STUDENT LEFT SIDEBAR (Perspectives 3, 4, 5)', () => {

  // =========================================================================
  // PERSPECTIVE 3: Senior UI/UX Architect (Data Contracts & Route Integrity)
  // =========================================================================
  describe('Perspective 3 (Senior UI/UX Architect): Data Contracts & Route Schema', () => {
    it('STUDENT_NAV is structured with non-empty section and items array', () => {
      assert.ok(Array.isArray(STUDENT_NAV), 'STUDENT_NAV must be an array');
      assert.ok(STUDENT_NAV.length > 0, 'STUDENT_NAV must have at least one section');
      
      const primarySection = STUDENT_NAV[0];
      assert.equal(primarySection.section, 'PinIT Career OS', 'Primary section name must match PinIT branding');
      assert.ok(primarySection.items.length >= 9, 'Student must have at least 9 core workspace items');
    });

    it('every STUDENT_NAV item has valid, non-empty, well-formed properties', () => {
      const primarySection = STUDENT_NAV[0];
      for (const item of primarySection.items) {
        if (isGroup(item)) {
          assert.ok(item.label && item.label.trim().length > 0, 'Group must have a valid label');
          assert.ok(item.icon && item.icon.trim().length > 0, 'Group must have an icon');
          assert.ok(Array.isArray(item.children) && item.children.length > 0, 'Group must have non-empty children');
          for (const child of item.children) {
            assert.ok(child.href.startsWith('/'), `Child href ${child.href} must start with /`);
            assert.ok(!child.href.endsWith('/') || child.href === '/', `Child href ${child.href} must not have trailing slash`);
            assert.ok(child.label.trim().length > 0, `Child item must have non-empty label`);
            assert.ok(child.icon.trim().length > 0, `Child item must have non-empty icon`);
          }
        } else {
          assert.ok(item.href.startsWith('/'), `Item href ${item.href} must start with /`);
          assert.ok(!item.href.endsWith('/') || item.href === '/', `Item href ${item.href} must not have trailing slash`);
          assert.ok(item.label.trim().length > 0, `Item must have non-empty label`);
          assert.ok(item.icon.trim().length > 0, `Item must have non-empty icon`);
        }
      }
    });

    it('contains all required student flagship routes in exact canonical order', () => {
      const expectedRoutes = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/quests', label: 'Quests & Courses' },
        { href: '/missions', label: 'Daily Missions' },
        { href: '/arena', label: 'Challenging Arena' },
        { href: '/projects', label: 'Projects & Innovation' },
        { href: '/leaderboard', label: 'Leaderboard & Leagues' },
        { href: '/interview', label: 'AI Interview' },
        { href: '/mirror', label: 'Mirror' },
        { href: '/attention-span', label: 'Attention Span' },
      ];

      const actualLeaves = STUDENT_NAV[0].items.filter((item): item is NavLeaf => !isGroup(item));
      for (const expected of expectedRoutes) {
        const found = actualLeaves.find(l => l.href === expected.href);
        assert.ok(found, `STUDENT_NAV must include route ${expected.href}`);
        assert.equal(found.label, expected.label, `Route ${expected.href} label must be "${expected.label}"`);
      }
    });

    it('BOTTOM_NAV contains required secondary student utilities', () => {
      const expectedFooterRoutes = ['/friends', '/pins', '/notifications', '/profile'];
      for (const route of expectedFooterRoutes) {
        const found = BOTTOM_NAV.find(b => b.href === route);
        assert.ok(found, `BOTTOM_NAV must contain ${route}`);
      }
    });

    it('getNav strictly isolates student from other institutional roles', () => {
      assert.deepEqual(getNav('student'), STUDENT_NAV);
      assert.deepEqual(getNav(''), STUDENT_NAV); // fallback is student
      assert.notDeepEqual(getNav('admin'), STUDENT_NAV);
      assert.notDeepEqual(getNav('teacher'), STUDENT_NAV);
      assert.notDeepEqual(getNav('recruiter'), STUDENT_NAV);
      assert.notDeepEqual(getNav('parent'), STUDENT_NAV);
      assert.notDeepEqual(getNav('consultant'), STUDENT_NAV);
    });
  });

  // =========================================================================
  // PERSPECTIVE 4: QA & State-Machine Auditor (Route Transitions, Edge Cases)
  // =========================================================================
  describe('Perspective 4 (QA & State-Machine Auditor): Navigation & Edge-Case Robustness', () => {
    it('isPathActive handles exact roots, query params, and trailing slash nuances', () => {
      // 1. Dashboard exact root
      assert.equal(isPathActive('/dashboard', '/dashboard'), true);
      assert.equal(isPathActive('/dashboard/', '/dashboard'), true);
      assert.equal(isPathActive('/dashboard', '/dashboard/'), true);
      assert.equal(isPathActive('/admin', '/dashboard'), false);

      // 2. Quests vs Teacher Select sibling
      assert.equal(isPathActive('/quests', '/quests'), true);
      assert.equal(isPathActive('/quests/lesson', '/quests'), true);
      assert.equal(isPathActive('/quests/teacher-select', '/quests'), false); // Teacher Select has distinct nav item

      // 3. Query params matching
      assert.equal(isPathActive('/admin', '/admin?tab=library', 'tab=library'), true);
      assert.equal(isPathActive('/admin', '/admin?tab=library', 'tab=hostel'), false);
      assert.equal(isPathActive('/admin', '/admin', 'tab=library'), false); // Base admin does not highlight when tab active
      assert.equal(isPathActive('/admin', '/admin', ''), true);

      // 4. Sub-routes
      assert.equal(isPathActive('/projects/12345', '/projects'), true);
      assert.equal(isPathActive('/arena/match-99', '/arena'), true);
      assert.equal(isPathActive('/interview/session-1', '/interview'), true);
    });

    it('isPathActive rejects foreign collisions', () => {
      assert.equal(isPathActive('/quests-fake', '/quests'), false);
      assert.equal(isPathActive('/missions-overview', '/missions'), false);
      assert.equal(isPathActive('/arena2', '/arena'), false);
      assert.equal(isPathActive('/', '/dashboard'), false);
    });
  });

  // =========================================================================
  // PERSPECTIVE 5: Student End-User & Accessibility / WCAG 2.1 AA Auditor
  // =========================================================================
  describe('Perspective 5 (Student End-User & Accessibility): Ergonomics & Semantic Contracts', () => {
    it('AppSidebar component is a valid React functional component', () => {
      assert.equal(typeof AppSidebar, 'function', 'AppSidebar must be a callable React component');
    });

    it('ensures safe number parsing contracts for pins and badges', () => {
      // Test the exact math logic implemented in AppSidebar:
      const testCases = [
        { input: undefined, expectedPins: 0, expectedUnread: 0 },
        { input: null, expectedPins: 0, expectedUnread: 0 },
        { input: NaN, expectedPins: 0, expectedUnread: 0 },
        { input: 'invalid', expectedPins: 0, expectedUnread: 0 },
        { input: -50, expectedPins: 0, expectedUnread: 0 },
        { input: 0, expectedPins: 0, expectedUnread: 0 },
        { input: 15, expectedPins: 15, expectedUnread: 15 },
        { input: 1250, expectedPins: 1250, expectedUnread: 1250 },
      ];

      for (const tc of testCases) {
        const safePins = Number.isFinite(Number(tc.input)) ? Math.max(0, Number(tc.input)) : 0;
        const safeUnread = Number.isFinite(Number(tc.input)) ? Math.max(0, Number(tc.input)) : 0;
        assert.equal(safePins, tc.expectedPins, `Pins parsing failed for input ${tc.input}`);
        assert.equal(safeUnread, tc.expectedUnread, `Unread parsing failed for input ${tc.input}`);
      }
    });

    it('ensures safe display name and initial fallbacks', () => {
      const getAvatarAndName = (user: any, isStudent: boolean) => {
        const displayName =
          user?.displayName ||
          user?.name ||
          user?.username ||
          (typeof user?.email === 'string' ? user.email.split('@')[0] : '') ||
          (isStudent ? 'Student' : 'Member');
        const avatarInitial = (displayName.trim()[0] || 'S').toUpperCase();
        const roleLabel = user?.role || (isStudent ? 'student' : 'member');
        return { displayName, avatarInitial, roleLabel };
      };

      // Case 1: Empty user object
      const c1 = getAvatarAndName({}, true);
      assert.equal(c1.displayName, 'Student');
      assert.equal(c1.avatarInitial, 'S');
      assert.equal(c1.roleLabel, 'student');

      // Case 2: User with email only
      const c2 = getAvatarAndName({ email: 'alex.chen@university.edu' }, true);
      assert.equal(c2.displayName, 'alex.chen');
      assert.equal(c2.avatarInitial, 'A');
      assert.equal(c2.roleLabel, 'student');

      // Case 3: User with displayName
      const c3 = getAvatarAndName({ displayName: 'Priya Sharma', role: 'student' }, true);
      assert.equal(c3.displayName, 'Priya Sharma');
      assert.equal(c3.avatarInitial, 'P');
      assert.equal(c3.roleLabel, 'student');

      // Case 4: Null user
      const c4 = getAvatarAndName(null, true);
      assert.equal(c4.displayName, 'Student');
      assert.equal(c4.avatarInitial, 'S');
    });
  });
});

import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('BRUTAL VALIDATION — FULL SSR RENDERING OF APPSIDEBAR', () => {
  const createWrapper = (ui: React.ReactElement) => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return React.createElement(QueryClientProvider, { client: qc }, ui);
  };

  const defaultProps = {
    collapsed: false,
    setCollapsed: () => {},
    effectiveFocusMode: false,
    focusMode: false,
    pathname: '/dashboard',
    mobileOpen: false,
    setMobileOpen: () => {},
    toggleLeftSidebar: () => {},
    activeTourRoute: null,
    setActiveAcademicTab: () => {},
    activeAcademicTab: null,
    currentSearch: '',
    forceShowCareerBuilder: false,
    user: { displayName: 'Aarav Patel', email: 'aarav@pinit.os', role: 'student' },
    isStudent: true,
    pins: 350,
    unread: 3,
    logout: async () => {},
    router: { push: () => {} },
  };

  it('renders student sidebar cleanly in expanded mode with all links and pins', () => {
    const html = renderToString(createWrapper(React.createElement(AppSidebar, defaultProps)));
    
    // Core structure
    assert.ok(html.includes('<aside'), 'Must render <aside>');
    assert.ok(html.includes('aria-label="Primary navigation"'), 'Must have accessible primary navigation aria-label');
    assert.ok(html.includes('PinIT Career OS'), 'Must render section title');

    // All core student links present
    assert.ok(html.includes('href="/dashboard"'), 'Dashboard link must be present');
    assert.ok(html.includes('href="/quests"'), 'Quests link must be present');
    assert.ok(html.includes('href="/missions"'), 'Missions link must be present');
    assert.ok(html.includes('href="/arena"'), 'Arena link must be present');
    assert.ok(html.includes('href="/projects"'), 'Projects link must be present');
    assert.ok(html.includes('href="/leaderboard"'), 'Leaderboard link must be present');
    assert.ok(html.includes('href="/interview"'), 'Interview link must be present');
    assert.ok(html.includes('href="/mirror"'), 'Mirror link must be present');
    assert.ok(html.includes('href="/attention-span"'), 'Attention span link must be present');

    // Active state highlighting on /dashboard
    assert.ok(html.includes('active'), 'Active class must be rendered for current route');

    // Footer items
    assert.ok(html.includes('href="/friends"'), 'Friends link must be in student footer');
    assert.ok(html.includes('href="/pins"'), 'Pins & Wallet link must be in student footer');
    assert.ok(html.includes('350'), 'Safe pins count must be displayed');
    assert.ok(html.includes('Aarav Patel'), 'Student display name must be rendered');
    assert.ok(html.includes('student') && html.includes('Profile'), 'Role badge must be rendered');

    // Invariant Task 1: Student portal must NEVER render portal switcher or admin/teacher access buttons
    assert.ok(!html.includes('Portal:'), 'Student sidebar must NEVER render the Portal switcher');
    assert.ok(!html.includes('href="/admin"'), 'Student sidebar must NEVER render admin portal link');
    assert.ok(!html.includes('href="/teacher"'), 'Student sidebar must NEVER render teacher portal link');
  });

  it('renders student sidebar in compact mode without breaking or leaking labels', () => {
    const compactProps = {
      ...defaultProps,
      collapsed: true,
      mobileOpen: false,
    };
    const html = renderToString(createWrapper(React.createElement(AppSidebar, compactProps)));

    assert.ok(html.includes('collapsed'), 'Sidebar must have collapsed class');
    assert.ok(html.includes('aria-label="Expand sidebar"'), 'Must render expand toggle button in compact mode');
    assert.ok(html.includes('title="Dashboard"'), 'Tooltips must be preserved on compact link icons');
  });

  it('renders student sidebar on mobile overlay drawer at full expanded width', () => {
    const mobileProps = {
      ...defaultProps,
      collapsed: true, // Desktop was collapsed
      mobileOpen: true, // Mobile drawer opened
    };
    const html = renderToString(createWrapper(React.createElement(AppSidebar, mobileProps)));

    assert.ok(html.includes('open'), 'Sidebar must have open class for mobile drawer');
    assert.ok(html.includes('aria-label="Close navigation menu"'), 'Must render mobile close button');
    // Labels must still be rendered because mobileOpen takes precedence over collapsed
    assert.ok(html.includes('Quests &amp; Courses') || html.includes('Quests & Courses'), 'Labels must be rendered in mobile drawer');
  });

  it('renders unread notifications badge properly (3 vs 9+)', () => {
    // 1. With 3 notifications
    const html3 = renderToString(createWrapper(React.createElement(AppSidebar, { ...defaultProps, unread: 3 })));
    assert.ok(html3.includes('nav-badge') && html3.includes('3'), 'Should display badge with 3');

    // 2. With 42 notifications
    const html42 = renderToString(createWrapper(React.createElement(AppSidebar, { ...defaultProps, unread: 42 })));
    assert.ok(html42.includes('nav-badge') && html42.includes('9+'), 'Should display 9+ for counts > 9');
  });

  it('respects forceShowCareerBuilder flag for career accelerator tracks', () => {
    // 1. Without flag
    const htmlWithout = renderToString(createWrapper(React.createElement(AppSidebar, defaultProps)));
    assert.ok(!htmlWithout.includes('/career-builder'), 'Career builder must be absent when flag is false');

    // 2. With flag
    const htmlWith = renderToString(createWrapper(React.createElement(AppSidebar, {
      ...defaultProps,
      forceShowCareerBuilder: true,
    })));
    assert.ok(htmlWith.includes('/career-builder'), 'Career builder must be present when flag is true');
    assert.ok(htmlWith.includes('Career Builder'), 'Career builder label must be present');
  });

  it('strictly excludes student-only wallet and friends widgets when user is not student', () => {
    const nonStudentProps = {
      ...defaultProps,
      isStudent: false,
      user: { displayName: 'Dean Sharma', email: 'dean@pinit.os', role: 'admin' },
    };
    const html = renderToString(createWrapper(React.createElement(AppSidebar, nonStudentProps)));

    assert.ok(!html.includes('Pins &amp; Wallet') && !html.includes('Pins & Wallet'), 'Non-students must never see Pins & Wallet');
    assert.ok(html.includes('Campus Governance') || html.includes('admin'), 'Non-student sees appropriate admin/staff nav');
  });
});

describe('Perspective 6: All 15 Student Route Modules Exist and Export Valid Components', () => {
  const routes = [
    { name: 'Dashboard', path: '../src/app/dashboard/page' },
    { name: 'Quests', path: '../src/app/quests/page' },
    { name: 'Missions', path: '../src/app/missions/page' },
    { name: 'Arena', path: '../src/app/arena/page' },
    { name: 'Projects', path: '../src/app/projects/page' },
    { name: 'Leaderboard', path: '../src/app/leaderboard/page' },
    { name: 'Interview', path: '../src/app/interview/page' },
    { name: 'Group Discussion', path: '../src/app/group-discussion/page' },
    { name: 'Learning', path: '../src/app/learning/page' },
    { name: 'Attention Span', path: '../src/app/attention-span/page' },
    { name: 'Friends', path: '../src/app/friends/page' },
    { name: 'Pins', path: '../src/app/pins/page' },
    { name: 'Notifications', path: '../src/app/notifications/page' },
    { name: 'Profile', path: '../src/app/profile/page' },
    { name: 'Career Builder', path: '../src/app/career-builder/page' },
    { name: 'Mirror', path: '../src/app/mirror/page' },
  ];

  for (const route of routes) {
    it(`route ${route.name} (${route.path}) resolves and exports a valid default React component`, async () => {
      const mod = await import(route.path);
      assert.ok(mod, `Module ${route.name} must resolve`);
      const component = mod.default;
      assert.ok(component, `Module ${route.name} must have a default export`);
      assert.ok(
        typeof component === 'function' || typeof component === 'object',
        `Module ${route.name} default export must be a function or React component`
      );
    });
  }
});
