import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock CSS imports for node test environment
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.css'] = () => {};
}

import {
  STUDENT_NAV,
  BOTTOM_NAV,
  isPathActive,
  getNav,
  AppSidebar
} from '../../src/components/ui/AppSidebar';

describe('COLD-EYES BRUTAL AUDIT: ZERO-PRIOR-STAKE INDEPENDENT VERIFICATION', () => {
  const createWrapper = (ui: React.ReactElement) => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return React.createElement(QueryClientProvider, { client: qc }, ui);
  };

  const baseStudentProps = {
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
    user: { displayName: 'Stranger Test User', email: 'stranger@test.os', role: 'student' },
    isStudent: true,
    pins: 50,
    unread: 0,
    logout: async () => {},
    router: { push: () => {} },
  };

  // =========================================================================
  // CHECK 1: ZERO PORTAL SHIFTING LEAKS UNDER EXTREME/CORRUPTED USER STATES
  // =========================================================================
  describe('Brutal Check 1: Zero Portal Shifting Leaks in Student Portal', () => {
    const testCases = [
      { name: 'Standard Student', user: { role: 'student', displayName: 'Student A' }, isStudent: true },
      { name: 'Null User (Anonymous Visitor)', user: null, isStudent: true },
      { name: 'Empty Object User', user: {}, isStudent: true },
      { name: 'Corrupted Role ("hacker")', user: { role: 'hacker' }, isStudent: true },
      { name: 'Member Role ("member")', user: { role: 'member' }, isStudent: true },
      { name: 'Learner Role ("learner")', user: { role: 'learner' }, isStudent: true },
    ];

    for (const tc of testCases) {
      it(`strictly conceals portal switcher for: ${tc.name}`, () => {
        const props = { ...baseStudentProps, user: tc.user as any, isStudent: tc.isStudent };
        const html = renderToString(createWrapper(React.createElement(AppSidebar, props)));

        assert.equal(html.includes('Portal:'), false, `Must NOT contain "Portal:" for ${tc.name}`);
        assert.equal(html.includes('href="/admin"'), false, `Must NOT contain href="/admin" for ${tc.name}`);
        assert.equal(html.includes('href="/teacher"'), false, `Must NOT contain href="/teacher" for ${tc.name}`);
        assert.equal(html.includes('title="Campus Administration Portal"'), false, `Must NOT leak Admin title for ${tc.name}`);
      });
    }

    it('retains portal switcher ONLY when authenticated as genuine admin/faculty', () => {
      const adminProps = {
        ...baseStudentProps,
        isStudent: false,
        user: { role: 'admin', displayName: 'Admin Officer' },
      };
      const html = renderToString(createWrapper(React.createElement(AppSidebar, adminProps)));
      assert.ok(html.includes('href="/admin"'), 'Admin user must retain access to admin portal link');
    });
  });

  // =========================================================================
  // CHECK 2: THE UNIFIED MIRROR TAB & ZERO BROKEN ROUTE INTEGRITY
  // =========================================================================
  describe('Brutal Check 2: The Unified Mirror Hub (/mirror)', () => {
    it('STUDENT_NAV has Mirror at item index 7 with icon 🪞 and href /mirror', () => {
      const items = STUDENT_NAV[0].items;
      const mirror = items[7] as any;
      assert.ok(mirror, 'Item 7 must exist in STUDENT_NAV');
      assert.equal(mirror.href, '/mirror');
      assert.equal(mirror.label, 'Mirror');
      assert.equal(mirror.icon, '🪞');
    });

    it('isPathActive maps all 4 legacy and unified aliases to Mirror', () => {
      // 1. Canonical /mirror
      assert.equal(isPathActive('/mirror', '/mirror'), true);
      // 2. Direct /career-builder
      assert.equal(isPathActive('/career-builder', '/mirror'), true);
      // 3. Underscore alias /career_builder
      assert.equal(isPathActive('/career_builder', '/mirror'), true);
      // 4. Learning & Twin alias /learning
      assert.equal(isPathActive('/learning', '/mirror'), true);

      // Rejects unrelated paths
      assert.equal(isPathActive('/interview', '/mirror'), false);
      assert.equal(isPathActive('/quests', '/mirror'), false);
      assert.equal(isPathActive('/leaderboard', '/mirror'), false);
    });

    it('resolves and exports valid default component for /mirror, /career-builder, and /learning', async () => {
      const mirrorMod = await import('../../src/app/mirror/page');
      const careerMod = await import('../../src/app/career-builder/page');
      const learningMod = await import('../../src/app/learning/page');

      assert.ok(mirrorMod.default, 'Mirror must have default export');
      assert.ok(careerMod.default, 'Career Builder must have default export');
      assert.ok(learningMod.default, 'Learning must have default export');
    });
  });

  // =========================================================================
  // CHECK 3: THE UNIFIED AI INTERVIEW HUB WITH GD PRACTICE SUB-TAB
  // =========================================================================
  describe('Brutal Check 3: The Unified AI Interview Hub with GD Sub-Tab', () => {
    it('STUDENT_NAV contains AI Interview and strictly excludes GD Practice from top level', () => {
      const items = STUDENT_NAV[0].items;
      const interview = items.find((it: any) => it.href === '/interview');
      const gd = items.find((it: any) => it.href === '/group-discussion');

      assert.ok(interview, 'AI Interview must exist in primary nav');
      assert.equal(gd, undefined, 'GD Practice must NOT exist as a separate top-level item');
    });

    it('isPathActive maps both /interview and /group-discussion to AI Interview', () => {
      assert.equal(isPathActive('/interview', '/interview'), true);
      assert.equal(isPathActive('/group-discussion', '/interview'), true);

      // Foreign routes rejected
      assert.equal(isPathActive('/mirror', '/interview'), false);
      assert.equal(isPathActive('/arena', '/interview'), false);
    });

    it('resolves and exports valid default components for Interview and GD pages', async () => {
      const interviewMod = await import('../../src/app/interview/page');
      const gdMod = await import('../../src/app/group-discussion/page');

      assert.ok(interviewMod.default, 'Interview page must have default export');
      assert.ok(gdMod.default, 'Group discussion page must have default export');
    });
  });

  // =========================================================================
  // CHECK 4: EXACT CANONICAL SIDEBAR STRUCTURE & IMMUTABLE INVARIANTS
  // =========================================================================
  describe('Brutal Check 4: Exact Canonical Sidebar Structure', () => {
    it('STUDENT_NAV has exactly 9 flagship hubs in exact sequence', () => {
      assert.equal(STUDENT_NAV[0].items.length, 9);
      const expectedSequence = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/quests', label: 'Quests & Courses' },
        { href: '/missions', label: 'Daily Missions' },
        { href: '/arena', label: 'Challenging Arena' },
        { href: '/projects', label: 'Projects & Squads' },
        { href: '/leaderboard', label: 'Leaderboard & Leagues' },
        { href: '/interview', label: 'AI Interview' },
        { href: '/mirror', label: 'Mirror' },
        { href: '/attention-span', label: 'Attention Span' },
      ];

      for (let i = 0; i < expectedSequence.length; i++) {
        const item = STUDENT_NAV[0].items[i] as any;
        assert.equal(item.href, expectedSequence[i].href, `Index ${i} href must be ${expectedSequence[i].href}`);
        assert.equal(item.label, expectedSequence[i].label, `Index ${i} label must be ${expectedSequence[i].label}`);
      }
    });

    it('BOTTOM_NAV has exactly 4 items (Friends, Pins, Notifications, Profile)', () => {
      assert.equal(BOTTOM_NAV.length, 4);
      assert.equal(BOTTOM_NAV[0].href, '/friends');
      assert.equal(BOTTOM_NAV[1].href, '/pins');
      assert.equal(BOTTOM_NAV[2].href, '/notifications');
      assert.equal(BOTTOM_NAV[3].href, '/profile');
    });

    it('SSR render of student sidebar produces zero HTML errors or unescaped fragments', () => {
      const html = renderToString(createWrapper(React.createElement(AppSidebar, baseStudentProps)));
      assert.ok(html.includes('href="/mirror"'), 'Must render /mirror link');
      assert.ok(html.includes('href="/interview"'), 'Must render /interview link');
      assert.ok(html.includes('Stranger Test User'), 'Must render user display name');
      assert.ok(!html.includes('NaN'), 'Must not render NaN anywhere');
      assert.ok(!html.includes('undefined'), 'Must not render raw undefined anywhere');
    });
  });
});
