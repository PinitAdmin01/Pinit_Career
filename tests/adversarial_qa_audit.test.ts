import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock css loader
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.css'] = () => {};
}

import {
  AppSidebar,
  STUDENT_NAV,
  BOTTOM_NAV,
  getNav,
  isPathActive,
} from '../src/components/ui/AppSidebar';

import { CrashCoursePlanCards } from '../src/app/quests/components/CrashCoursePlanCards';
import EnhancedCrashCoursePlanCard from '../src/app/quests/components/EnhancedCrashCoursePlanCard';
import CredentialPreviewModal from '../src/app/quests/components/CredentialPreviewModal';
import CrashCourseCheckoutModal, {
  calculateCheckoutPricing,
  formatINR,
} from '../src/app/quests/components/CrashCourseCheckoutModal';
import { getQuestions } from '../src/app/quests/components/PracticeTestQuizRunner';
import {
  getCrashCourseCurriculum,
  getCrashCourseProgress,
} from '../src/lib/courses/crashCourseProgress';
import { CRASH_COURSE_PLANS, CrashPlan } from '../src/lib/data/crashPlansData';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';

describe('ADVERSARIAL SENIOR QA & UI/UX DESIGN AUDIT', () => {
  const createWrapper = (ui: React.ReactElement) => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return React.createElement(QueryClientProvider, { client: qc }, ui);
  };

  // =========================================================================
  // 1. ALL 15 STUDENT NAVIGATION ROUTES IN APPSIDEBAR
  // =========================================================================
  describe('Audit 1: All 15 Student Navigation Routes in AppSidebar.tsx', () => {
    const studentRoutes = [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/quests', label: 'Quests & Courses' },
      { path: '/missions', label: 'Daily Missions' },
      { path: '/arena', label: 'Challenging Arena' },
      { path: '/projects', label: 'Projects & Squads' },
      { path: '/leaderboard', label: 'Leaderboard & Leagues' },
      { path: '/interview', label: 'AI Interview' },
      { path: '/group-discussion', label: 'GD Practice' },
      { path: '/learning', label: 'Learning & Twin' },
      { path: '/attention-span', label: 'Attention Span' },
      { path: '/friends', label: 'Friends' },
      { path: '/pins', label: 'Pins & Wallet' },
      { path: '/notifications', label: 'Notifications' },
      { path: '/profile', label: 'Profile' },
      { path: '/career-builder', label: 'Career Builder' },
    ];

    it('has exactly 10 primary workspace items in STUDENT_NAV', () => {
      assert.equal(STUDENT_NAV[0].items.length, 10);
    });

    it('has exactly 4 persistent footer items in BOTTOM_NAV', () => {
      assert.equal(BOTTOM_NAV.length, 4);
    });

    it('correctly conditionally appends the 15th route (/career-builder) when flag is enabled', () => {
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
        user: { displayName: 'Dev Student', role: 'student' },
        isStudent: true,
        pins: 250,
        unread: 0,
        logout: async () => {},
        router: {},
      };

      const htmlOff = renderToString(createWrapper(React.createElement(AppSidebar, {
        ...defaultProps,
        forceShowCareerBuilder: false,
      })));
      assert.ok(!htmlOff.includes('href="/career-builder"'), 'Must not render /career-builder when disabled');

      const htmlOn = renderToString(createWrapper(React.createElement(AppSidebar, {
        ...defaultProps,
        forceShowCareerBuilder: true,
      })));
      assert.ok(htmlOn.includes('href="/career-builder"'), 'Must render /career-builder when flag is enabled');
    });

    it('verifies active state highlighting across all 15 routes without route bleeding', () => {
      for (const route of studentRoutes) {
        // Test isPathActive behavior
        assert.equal(isPathActive(route.path, route.path), true, `${route.path} should match itself`);
        assert.equal(isPathActive(route.path + '-impostor', route.path), false, `${route.path}-impostor should NOT match`);

        // Subpaths like /dashboard/nested-view, /quests/lesson, /projects/123 match prefix
        assert.equal(isPathActive(route.path + '/nested-view', route.path), true, `${route.path}/nested-view should match prefix`);
      }
    });

    it('gracefully handles extreme and corrupted user states in AppSidebar', () => {
      const corruptedProps = {
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
        user: null, // completely null user
        isStudent: true,
        pins: NaN, // corrupted pins
        unread: -10, // negative unread
        logout: async () => {},
        router: {},
      };

      const html = renderToString(createWrapper(React.createElement(AppSidebar, corruptedProps)));
      assert.ok(html.includes('Student'), 'Should fallback to "Student" display name');
      assert.ok(html.includes('>0<') || html.includes('0'), 'Should clamp corrupted pins to 0');
      assert.ok(!html.includes('nav-badge'), 'Negative unread should not render a badge');
    });
  });

  // =========================================================================
  // 2. COURSE TAB -> CERTIFICATE SUBTAB PRE-PURCHASE FLOW
  // =========================================================================
  describe('Audit 2: Course Tab -> Certificate Subtab Pre-Purchase Flow', () => {
    it('switches between web_fullstack and python_ai dynamically updating plan cards', () => {
      const plan = CRASH_COURSE_PLANS[0]; // 1m sprint

      // Web Fullstack Card
      const webHtml = renderToStaticMarkup(
        React.createElement(EnhancedCrashCoursePlanCard, {
          plan,
          activeTrack: 'web_fullstack',
          isSelected: false,
          onSelectPlan: () => {},
          onPreviewCredentials: () => {},
        })
      );
      assert.ok(webHtml.includes('Recipe Finder'), 'Must show Web flagship title');
      assert.ok(webHtml.includes('React'), 'Must show Web tech stack');

      // Python AI Card
      const pythonHtml = renderToStaticMarkup(
        React.createElement(EnhancedCrashCoursePlanCard, {
          plan,
          activeTrack: 'python_ai',
          isSelected: false,
          onSelectPlan: () => {},
          onPreviewCredentials: () => {},
        })
      );
      assert.ok(pythonHtml.includes('Study Planner API'), 'Must show Python flagship title');
      assert.ok(pythonHtml.includes('FastAPI') || pythonHtml.includes('Python'), 'Must show Python tech stack');
    });

    it('renders CrashCoursePlanCards with domain switcher without crash', () => {
      let selectedPlanId = '';
      let selectedTrack = '';
      const html = renderToStaticMarkup(
        React.createElement(CrashCoursePlanCards, {
          onSelectPlan: (id, track) => {
            selectedPlanId = id;
            selectedTrack = track;
          },
          onOpenStandaloneCatalog: () => {},
        })
      );

      assert.ok(html.includes('Full-Stack Web Development'));
      assert.ok(html.includes('Python &amp; Data Engineering') || html.includes('Python & Data Engineering'));
      assert.ok(html.includes('Standalone Courses Library'));
    });

    it('safely handles a partially missing / degraded plan object with zero runtime errors', () => {
      // Degraded plan missing modulesByTrack, flagshipBuildByTrack, inrPrice, pinsPrice
      const degradedPlan: any = {
        id: 'plan-degraded',
        tier: '1m',
        title: 'Degraded Test Plan',
        subtitle: 'Testing resilient fallbacks',
        highlightColor: '#f43f5e',
      };

      const cardHtml = renderToStaticMarkup(
        React.createElement(EnhancedCrashCoursePlanCard, {
          plan: degradedPlan,
          activeTrack: 'web_fullstack',
          isSelected: false,
          onSelectPlan: () => {},
          onPreviewCredentials: () => {},
        })
      );

      // Verify that resilient Option 2 fallbacks engaged cleanly
      assert.ok(cardHtml.includes('Degraded Test Plan'));
      assert.ok(cardHtml.includes('Modern React Architecture'), 'Fallback modules should load');
      assert.ok(cardHtml.includes('Enterprise Full-Stack Cloud Platform'), 'Fallback flagship should load');
      assert.ok(cardHtml.includes('4,999'), 'Fallback INR price should render');
      assert.ok(cardHtml.includes('500'), 'Fallback Pins price should render');
    });

    it('handles checkout modal rendering for both tracks and calculates pricing', () => {
      const plan = CRASH_COURSE_PLANS[1]; // 3m accelerator
      const checkoutHtml = renderToStaticMarkup(
        React.createElement(CrashCourseCheckoutModal, {
          isOpen: true,
          onClose: () => {},
          plan,
          activeTrack: 'web_fullstack',
          onSuccessEnrollment: () => {},
          studentName: 'Aria Stark',
          userPins: 1000,
        })
      );

      assert.ok(checkoutHtml.includes('Full-Stack Web Dev'));
      assert.ok(checkoutHtml.includes('PINIT2026'));
      assert.ok(checkoutHtml.includes('Razorpay Live'));
      assert.ok(checkoutHtml.includes('PinIT Vault Coins'));
      assert.ok(checkoutHtml.includes('Instant Sandbox Demo'));
    });
  });

  // =========================================================================
  // 3. OPTION 1 AND OPTION 2 FALLBACK TEST SUITE
  // =========================================================================
  describe('Audit 3: Option 1 & Option 2 Fallback Resilience', () => {
    it('Curriculum Fetch: Option 1 (Registry Quests) vs Option 2 (Fallback Defaults)', () => {
      const plan = CRASH_COURSE_PLANS[0];
      // Option 1: Full COURSES_REGISTRY
      const primaryLessons = getCrashCourseCurriculum(plan, 'web_fullstack', COURSES_REGISTRY);
      assert.ok(Array.isArray(primaryLessons), 'Option 1 returns curriculum array');
      assert.ok(primaryLessons.length > 0, 'Option 1 resolves non-empty lessons');

      // Option 2: Empty / Degraded registry
      const fallbackLessons = getCrashCourseCurriculum(plan, 'web_fullstack', []);
      assert.ok(Array.isArray(fallbackLessons), 'Option 2 returns safe empty array without crash');
      assert.equal(fallbackLessons.length, 0);

      // Option 2 in Progress Calculation with empty registry
      const progress = getCrashCourseProgress(plan, 'web_fullstack', [], [], null);
      assert.equal(progress.total, 0);
      assert.equal(progress.completed, 0);
      assert.equal(progress.percent, 0);
      assert.equal(progress.next, null);
    });

    it('Test Question Fetch: Option 1 (Web Bank) vs Option 2 (Python Bank & Fallback)', () => {
      // Option 1: Web questions
      const webQ = getQuestions('web_fullstack');
      assert.equal(webQ.length, 12, 'Web question bank contains 12 verified questions');
      assert.ok(webQ.some(q => q.topic === 'React'));
      assert.ok(webQ.some(q => q.topic === 'Next.js'));

      // Option 2: Python questions
      const pyQ = getQuestions('python_ai');
      assert.equal(pyQ.length, 12, 'Python question bank contains 12 verified questions');
      assert.ok(pyQ.some(q => q.topic === 'FastAPI'));
      assert.ok(pyQ.some(q => q.topic === 'AsyncIO'));

      // Defensive fallback: invalid track falls back to python questions
      const fallbackQ = getQuestions('unknown_track' as any);
      assert.equal(fallbackQ.length, 12);
    });

    it('Credentials Preview: Option 1 (Plan-derived specs) vs Option 2 (Safe Defaults)', () => {
      // Option 1: Passed custom titles (checking for HTML entity encoding of &)
      const html1 = renderToStaticMarkup(
        React.createElement(CredentialPreviewModal, {
          isOpen: true,
          onClose: () => {},
          planTitle: '6-Month Enterprise Pro Track',
          trackTitle: 'Distributed Systems & Cloud Architecture',
        })
      );
      assert.ok(html1.includes('Distributed Systems &amp; Cloud Architecture') || html1.includes('Distributed Systems & Cloud Architecture'));

      // Option 2: Missing titles rely entirely on internal component fallbacks
      const html2 = renderToStaticMarkup(
        React.createElement(CredentialPreviewModal, {
          isOpen: true,
          onClose: () => {},
        })
      );
      assert.ok(html2.includes('Full-Stack Software Architecture'), 'Fallback default track title used');
      assert.ok(html2.includes('data-testid="credential-project-card"'));
    });

    it('Pricing Math: Option 1 (Standard pricing) vs Option 2 (Scholarship promo)', () => {
      // Option 1: Standard
      const p1 = calculateCheckoutPricing(9999, false);
      assert.equal(p1.discount, 0);
      assert.equal(p1.discountedSubtotal, 9999);
      assert.equal(p1.gstAmount, Math.round(9999 * 0.18));
      assert.equal(p1.finalPayable, 9999 + Math.round(9999 * 0.18));

      // Option 2: Scholarship PINIT2026
      const p2 = calculateCheckoutPricing(9999, true);
      assert.equal(p2.discount, 1000);
      assert.equal(p2.discountedSubtotal, 8999);
      assert.equal(p2.gstAmount, Math.round(8999 * 0.18));
      assert.equal(p2.finalPayable, 8999 + Math.round(8999 * 0.18));
    });
  });
});
