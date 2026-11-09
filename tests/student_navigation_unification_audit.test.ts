import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.css'] = () => {};
}

import {
  STUDENT_NAV,
  BOTTOM_NAV,
  isPathActive,
  AppSidebar
} from '../src/components/ui/AppSidebar';

describe('BRUTAL 3RD-PERSON AUDIT: STUDENT NAVIGATION & HUB UNIFICATION', () => {
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
    user: { displayName: 'Aryan Sharma', email: 'aryan@pinit.os', role: 'student' },
    isStudent: true,
    pins: 120,
    unread: 2,
    logout: async () => {},
    router: { push: () => {} },
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Task 1: Zero Portal Shifting in Student Portal
  // ─────────────────────────────────────────────────────────────────────────
  describe('Task 1: Zero Portal Shifting in Student Portal', () => {
    it('completely suppresses Portal switcher for student users', () => {
      const html = renderToString(createWrapper(React.createElement(AppSidebar, defaultProps)));

      // Must never leak Admin or Teacher portal access buttons to students
      assert.ok(!html.includes('Portal:'), 'Must NOT contain "Portal:" text');
      assert.ok(!html.includes('href="/admin"'), 'Must NOT contain link to /admin');
      assert.ok(!html.includes('href="/teacher"'), 'Must NOT contain link to /teacher');
      assert.ok(!html.includes('title="Campus Administration Portal"'), 'Must NOT contain admin portal title');
      assert.ok(!html.includes('title="Faculty &amp; Teacher Portal"'), 'Must NOT contain teacher portal title');
    });

    it('renders student identity card cleanly without administrative distractions', () => {
      const html = renderToString(createWrapper(React.createElement(AppSidebar, defaultProps)));
      assert.ok(html.includes('Aryan Sharma'), 'Student display name is rendered');
      assert.ok(html.includes('student') && html.includes('Profile'), 'Student profile role badge is rendered');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Task 2 & 4: Unified Mirror Hub (Career Builder + Learning Twin)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Task 2 & 4: Unified Mirror Hub', () => {
    it('includes Mirror as a primary flagship item in STUDENT_NAV', () => {
      const primaryItems = STUDENT_NAV[0].items;
      const mirrorItem = primaryItems.find((it: any) => it.href === '/mirror');
      assert.ok(mirrorItem, 'Mirror item must exist in STUDENT_NAV');
      assert.equal(mirrorItem.label, 'Mirror');
      assert.equal(mirrorItem.icon, '🪞');
    });

    it('isPathActive highlights Mirror for /mirror, /career-builder, /career_builder, and /learning', () => {
      assert.ok(isPathActive('/mirror', '/mirror'), '/mirror must activate /mirror');
      assert.ok(isPathActive('/career-builder', '/mirror'), '/career-builder must activate /mirror');
      assert.ok(isPathActive('/career_builder', '/mirror'), '/career_builder must activate /mirror');
      assert.ok(isPathActive('/learning', '/mirror'), '/learning must activate /mirror');
    });

    it('resolves and exports valid default component for /mirror/page', async () => {
      const mirrorMod = await import('../src/app/mirror/page');
      assert.ok(mirrorMod.default, 'Mirror page must have default export');
      assert.ok(typeof mirrorMod.default === 'function', 'Mirror page default must be a function');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Task 3: Unified AI Interview Hub (1v1 Interview + GD Practice)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Task 3: Unified AI Interview Hub with GD Sub-Tab', () => {
    it('retains AI Interview in STUDENT_NAV and removes GD Practice from top-level', () => {
      const primaryItems = STUDENT_NAV[0].items;
      const interviewItem = primaryItems.find((it: any) => it.href === '/interview');
      const gdItem = primaryItems.find((it: any) => it.href === '/group-discussion');

      assert.ok(interviewItem, 'AI Interview must exist in STUDENT_NAV');
      assert.equal(gdItem, undefined, 'GD Practice must NOT exist as a separate top-level item');
    });

    it('isPathActive highlights AI Interview for both /interview and /group-discussion', () => {
      assert.ok(isPathActive('/interview', '/interview'), '/interview must activate /interview');
      assert.ok(isPathActive('/group-discussion', '/interview'), '/group-discussion must activate /interview');
    });

    it('resolves and exports valid default components for both Interview and GD pages', async () => {
      const interviewMod = await import('../src/app/interview/page');
      const gdMod = await import('../src/app/group-discussion/page');

      assert.ok(interviewMod.default, 'Interview page must have default export');
      assert.ok(gdMod.default, 'Group discussion page must have default export');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Master Architecture: Canonical Item Integrity
  // ─────────────────────────────────────────────────────────────────────────
  describe('Master Architecture: Canonical Student Navigation', () => {
    it('has all canonical flagship items in STUDENT_NAV', () => {
      assert.ok(STUDENT_NAV[0].items.length >= 9, 'STUDENT_NAV must have streamlined hubs');
      const hrefs = STUDENT_NAV[0].items.map((it: any) => it.href);
      assert.ok(hrefs.includes('/dashboard'));
      assert.ok(hrefs.includes('/quests'));
      assert.ok(hrefs.includes('/missions'));
      assert.ok(hrefs.includes('/arena'));
      assert.ok(hrefs.includes('/projects'));
      assert.ok(hrefs.includes('/leaderboard'));
      assert.ok(hrefs.includes('/interview'));
      assert.ok(hrefs.includes('/mirror'));
      assert.ok(hrefs.includes('/attention-span'));
      assert.ok(hrefs.includes('/vault'));
      assert.ok(hrefs.includes('/shop'));
    });

    it('has exactly 4 persistent bottom utility items in BOTTOM_NAV', () => {
      assert.equal(BOTTOM_NAV.length, 4);
      const bottomHrefs = BOTTOM_NAV.map((it: any) => it.href);
      assert.deepEqual(bottomHrefs, [
        '/friends',
        '/pins',
        '/notifications',
        '/profile'
      ]);
    });
  });
});
