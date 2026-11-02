import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as fs from 'fs';
import * as path from 'path';

if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.css'] = () => {};
}

import {
  STUDENT_NAV,
  BOTTOM_NAV,
  isPathActive,
  AppSidebar
} from '../src/components/ui/AppSidebar';

describe('STRANGER\'S BRUTAL INDEPENDENT VERIFICATION AUDIT', () => {
  const rootDir = process.cwd();

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
    user: { displayName: 'Kavya Raman', email: 'kavya@pinit.os', role: 'student' },
    isStudent: true,
    pins: 250,
    unread: 1,
    logout: async () => {},
    router: { push: () => {} },
  };

  // ──────────────────────────────────────────────────────────────────────────
  // AUDIT SECTION 1: Zero Portal Shifting for Students (Hostile QA Perspective)
  // ──────────────────────────────────────────────────────────────────────────
  describe('Auditor 1 (Adversarial Security & Role Isolation): Portal Switcher Elimination', () => {
    it('S1.1: Rejects portal switcher for authenticated student with explicit student role', () => {
      const html = renderToString(createWrapper(React.createElement(AppSidebar, baseStudentProps)));
      assert.ok(!html.includes('Portal:'), 'Hostile check: "Portal:" text leaked in student view');
      assert.ok(!html.includes('/admin'), 'Hostile check: /admin link leaked in student view');
      assert.ok(!html.includes('/teacher'), 'Hostile check: /teacher link leaked in student view');
      assert.ok(!html.includes('/internship-demo'), 'Hostile check: /internship-demo link leaked in student view');
    });

    it('S1.2: Rejects portal switcher for guest/anonymous session with null user', () => {
      const guestProps = {
        ...baseStudentProps,
        user: null,
        isStudent: true,
      };
      const html = renderToString(createWrapper(React.createElement(AppSidebar, guestProps)));
      assert.ok(!html.includes('Portal:'), 'Guest session leaked portal switcher');
      assert.ok(!html.includes('/admin'), 'Guest session leaked admin portal');
      assert.ok(!html.includes('/teacher'), 'Guest session leaked teacher portal');
    });

    it('S1.3: Rejects portal switcher for alumni or member role', () => {
      const memberProps = {
        ...baseStudentProps,
        user: { displayName: 'Alum Ravi', email: 'ravi@alumni.os', role: 'member' },
        isStudent: false,
      };
      const html = renderToString(createWrapper(React.createElement(AppSidebar, memberProps)));
      assert.ok(!html.includes('Portal:'), 'Member session leaked portal switcher');
      assert.ok(!html.includes('href="/admin"'), 'Member session leaked admin portal href');
    });

    it('S1.4: Allows portal switcher only for staff/faculty (admin, superadmin, teacher)', () => {
      const adminProps = {
        ...baseStudentProps,
        user: { displayName: 'Director Rao', email: 'rao@admin.os', role: 'admin' },
        isStudent: false,
      };
      const html = renderToString(createWrapper(React.createElement(AppSidebar, adminProps)));
      assert.ok(html.includes('Portal:'), 'Admin staff must see portal switcher');
      assert.ok(html.includes('/admin'), 'Admin staff must see /admin');
      assert.ok(html.includes('/teacher'), 'Admin staff must see /teacher');
      assert.ok(!html.includes('Pins &amp; Wallet') && !html.includes('Pins & Wallet'), 'Admin must not see student wallet');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // AUDIT SECTION 2: Career Builder & Mirror Hub Unification (/mirror)
  // ──────────────────────────────────────────────────────────────────────────
  describe('Auditor 2 (Senior Product Architect): Career Builder & Mirror Hub Unification', () => {
    it('S2.1: Primary student navigation contains Mirror and removes loose learning/career-builder items', () => {
      const studentHrefs = STUDENT_NAV[0].items.map(it => ('href' in it ? it.href : ''));
      assert.ok(studentHrefs.includes('/mirror'), 'STUDENT_NAV must include /mirror');
      assert.ok(!studentHrefs.includes('/career-builder'), 'STUDENT_NAV must NOT have top-level /career-builder');
      assert.ok(!studentHrefs.includes('/learning'), 'STUDENT_NAV must NOT have top-level /learning');

      const mirrorItem = STUDENT_NAV[0].items.find(it => 'href' in it && it.href === '/mirror') as any;
      assert.equal(mirrorItem.label, 'Mirror');
      assert.equal(mirrorItem.icon, '🪞');
    });

    it('S2.2: isPathActive highlights Mirror across all aliases (/mirror, /career-builder, /career_builder, /learning)', () => {
      // isPathActive signature: isPathActive(pathname, href, currentSearch)
      assert.ok(isPathActive('/mirror', '/mirror'), 'Must match /mirror exactly');
      assert.ok(isPathActive('/mirror?tab=career-builder', '/mirror'), 'Must match /mirror with tab');
      assert.ok(isPathActive('/mirror?tab=twin', '/mirror'), 'Must match /mirror twin');
      assert.ok(isPathActive('/career-builder', '/mirror'), 'Must activate on bookmarked /career-builder');
      assert.ok(isPathActive('/career_builder', '/mirror'), 'Must activate on snake_case /career_builder');
      assert.ok(isPathActive('/learning', '/mirror'), 'Must activate on legacy /learning');
      assert.ok(!isPathActive('/quests', '/mirror'), 'Must NOT activate on /quests');
      assert.ok(!isPathActive('/interview', '/mirror'), 'Must NOT activate on /interview');
    });

    it('S2.3: AppShell.tsx registers /mirror in PAGE_TITLES and allowedStudentTabs', () => {
      const appShellSource = fs.readFileSync(path.join(rootDir, 'src/components/ui/AppShell.tsx'), 'utf-8');
      
      // PAGE_TITLES verification
      assert.ok(appShellSource.includes("'/mirror':"), "AppShell PAGE_TITLES must register '/mirror'");
      assert.ok(appShellSource.includes("'/mirror':        'Mirror'"), "AppShell PAGE_TITLES must map '/mirror' to 'Mirror'");

      // allowedStudentTabs verification (prevents redirect trap)
      assert.ok(appShellSource.includes("'/mirror'"), "AppShell allowedStudentTabs must whitelist '/mirror'");
    });

    it('S2.4: /mirror/page.tsx exports valid component with 3 unified sub-tabs', async () => {
      const mirrorModule = await import('../src/app/mirror/page');
      assert.ok(typeof mirrorModule.default === 'function', 'MirrorPage must export a valid default React component');

      const fileSource = fs.readFileSync(path.join(rootDir, 'src/app/mirror/page.tsx'), 'utf-8');
      assert.ok(fileSource.includes('data-testid="tab-career-builder"'), 'Must have Career Builder subtab');
      assert.ok(fileSource.includes('data-testid="tab-digital-twin"'), 'Must have Digital Twin subtab');
      assert.ok(fileSource.includes('data-testid="tab-growth-roadmap"'), 'Must have Growth Roadmap subtab');
      assert.ok(fileSource.includes('embedded={true}'), 'Must pass embedded={true} to embedded sub-pages');
    });

    it('S2.5: useLearningData.ts retains /mirror pathname when changing sub-tabs', () => {
      const hookSource = fs.readFileSync(path.join(rootDir, 'src/app/learning/hooks/useLearningData.ts'), 'utf-8');
      assert.ok(hookSource.includes("window.location.pathname.startsWith('/mirror')"), 'useLearningData must check /mirror prefix');
      assert.ok(hookSource.includes("router.replace(`/mirror?tab=${nextTab}`)"), 'useLearningData must keep student on /mirror');
    });

    it('S2.6: LearningFilters.tsx suppresses redundant H1 title when embedded', () => {
      const filtersSource = fs.readFileSync(path.join(rootDir, 'src/app/learning/components/LearningFilters.tsx'), 'utf-8');
      assert.ok(filtersSource.includes('embedded = false'), 'LearningFilters must accept embedded prop');
      assert.ok(filtersSource.includes('{!embedded && ('), 'LearningFilters must conditionally render page-header');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // AUDIT SECTION 3: AI Interview Hub & GD Practice Sub-Tab Unification
  // ──────────────────────────────────────────────────────────────────────────
  describe('Auditor 3 (Staff Systems Engineer): AI Interview & GD Practice Unification', () => {
    it('S3.1: STUDENT_NAV contains AI Interview and removes GD Practice from top-level', () => {
      const studentHrefs = STUDENT_NAV[0].items.map(it => ('href' in it ? it.href : ''));
      assert.ok(studentHrefs.includes('/interview'), 'STUDENT_NAV must retain /interview');
      assert.ok(!studentHrefs.includes('/group-discussion'), 'STUDENT_NAV must purge top-level /group-discussion');

      const interviewItem = STUDENT_NAV[0].items.find(it => 'href' in it && it.href === '/interview') as any;
      assert.equal(interviewItem.label, 'AI Interview');
      assert.equal(interviewItem.icon, '🎙');
    });

    it('S3.2: isPathActive highlights AI Interview for /interview and bookmarked /group-discussion', () => {
      // isPathActive signature: isPathActive(pathname, href, currentSearch)
      assert.ok(isPathActive('/interview', '/interview'), 'Must match /interview exactly');
      assert.ok(isPathActive('/interview?tab=gd', '/interview'), 'Must match /interview with GD tab');
      assert.ok(isPathActive('/group-discussion', '/interview'), 'Must highlight on legacy /group-discussion');
      assert.ok(!isPathActive('/mirror', '/interview'), 'Must NOT activate on /mirror');
    });

    it('S3.3: /interview/page.tsx renders sub-tab switcher for 1v1 Mock and GD Practice', () => {
      const interviewSource = fs.readFileSync(path.join(rootDir, 'src/app/interview/page.tsx'), 'utf-8');
      assert.ok(interviewSource.includes('data-testid="interview-hub-subtabs"'), 'Must have hub subtabs bar');
      assert.ok(interviewSource.includes('data-testid="tab-1v1-interview"'), 'Must have 1v1 interview subtab');
      assert.ok(interviewSource.includes('data-testid="tab-gd-practice"'), 'Must have GD practice subtab');
      assert.ok(interviewSource.includes('GroupDiscussionPage embedded={true}'), 'Must embed GroupDiscussionPage');
    });

    it('S3.4: AppShell.tsx activates isGdCall focus mode inside /interview?tab=gd&call=true', () => {
      const shellSource = fs.readFileSync(path.join(rootDir, 'src/components/ui/AppShell.tsx'), 'utf-8');
      assert.ok(
        shellSource.includes("pathname.startsWith('/interview') && window.location.search.includes('tab=gd')"),
        'AppShell must recognize GD call within interview hub'
      );
    });

    it('S3.5: Legacy /group-discussion/page.tsx retains standalone compatibility', () => {
      const gdSource = fs.readFileSync(path.join(rootDir, 'src/app/group-discussion/page.tsx'), 'utf-8');
      assert.ok(gdSource.includes('embedded = false'), 'GroupDiscussionPage must accept embedded prop');
      assert.ok(gdSource.includes('export default function GroupDiscussionPage'), 'Must export GroupDiscussionPage');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // AUDIT SECTION 4: Defensive Coding & Runtime Crash Prevention
  // ──────────────────────────────────────────────────────────────────────────
  describe('Auditor 4 (Chaos & Robustness Engineer): Defensive Coding & Crash Resilience', () => {
    it('S4.1: ActiveEnrollmentBanner safely guards enrollmentId against undefined', () => {
      const bannerSource = fs.readFileSync(path.join(rootDir, 'src/app/quests/components/ActiveEnrollmentBanner.tsx'), 'utf-8');
      assert.ok(
        bannerSource.includes("(enrollment.enrollmentId || enrollment.paymentId || 'ACTIVE').slice(-8)"),
        'Must guard enrollmentId slice against undefined'
      );
    });

    it('S4.2: CrashCourseCheckoutModal has SSR-safe portal fallback', () => {
      const modalSource = fs.readFileSync(path.join(rootDir, 'src/app/quests/components/CrashCourseCheckoutModal.tsx'), 'utf-8');
      assert.ok(
        modalSource.includes("if (typeof document === 'undefined' || !isMounted)"),
        'Must guard createPortal against SSR undefined document'
      );
    });

    it('S4.3: CrashCoursePlanCards provides visible border on inactive track buttons in light mode', () => {
      const cardsSource = fs.readFileSync(path.join(rootDir, 'src/app/quests/components/CrashCoursePlanCards.tsx'), 'utf-8');
      assert.ok(
        cardsSource.includes("border: `1.5px solid ${activeTrack === 'web_fullstack' ? 'var(--accent)' : 'var(--border)'}`"),
        'Web fullstack button must have var(--border) when inactive'
      );
      assert.ok(
        cardsSource.includes("border: `1.5px solid ${activeTrack === 'python_ai' ? 'var(--green)' : 'var(--border)'}`"),
        'Python AI button must have var(--border) when inactive'
      );
    });
  });
});
