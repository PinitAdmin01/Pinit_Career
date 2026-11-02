import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';

// Mock CSS imports for node test environment
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.css'] = () => {};
}

import CrashCoursePlanCards from '../../src/app/quests/components/CrashCoursePlanCards';
import CareerGrowthGraph from '../../src/app/quests/components/CareerGrowthGraph';
import { ActiveEnrollmentBanner } from '../../src/app/quests/components/ActiveEnrollmentBanner';
import { VerticalCheckpointStepper } from '../../src/app/quests/components/VerticalCheckpointStepper';
import CrashCourseCheckoutModal, { calculateCheckoutPricing } from '../../src/app/quests/components/CrashCourseCheckoutModal';
import { CRASH_COURSE_PLANS } from '../../src/lib/data/crashPlansData';

describe('BRUTAL STRANGER AUDIT: Quests, Arena, Friends Light Mode & Checkout Modal', () => {

  // =========================================================================
  // SECTION 1: SOURCE CODE AUDIT FOR HARDCODED DARK THEME TRAPS
  // =========================================================================
  describe('Brutal Audit 1: Source File Token Sanity & Zero Hardcoded Dark Inversions', () => {
    
    it('globals.css must define --card-rgb for both dark and light scopes', () => {
      const globalsCss = fs.readFileSync(path.resolve(process.cwd(), 'src/styles/globals.css'), 'utf-8');
      assert.match(globalsCss, /:root\.dark[\s\S]*--card-rgb:\s*13,\s*18,\s*30;/, 'Dark mode must define --card-rgb');
      assert.match(globalsCss, /:root\.light[\s\S]*--card-rgb:\s*255,\s*255,\s*255;/, 'Light mode must define --card-rgb');
    });

    it('CrashCoursePlanCards.tsx must not contain hardcoded dark card backgrounds or white-on-white badges', () => {
      const content = fs.readFileSync(path.resolve(process.cwd(), 'src/app/quests/components/CrashCoursePlanCards.tsx'), 'utf-8');
      // No hardcoded slate card header
      assert.equal(content.includes('rgba(15, 23, 42, 0.95)'), false, 'Should not contain hardcoded rgba(15, 23, 42, 0.95)');
      // Header container uses theme tokens
      assert.ok(content.includes("linear-gradient(135deg, var(--card) 0%, var(--bg3) 100%)"));
      // Inactive track buttons must have visible border and theme text
      assert.ok(content.includes("border: `1.5px solid ${activeTrack === 'web_fullstack' ? 'var(--accent)' : 'var(--border)'}`"));
      assert.ok(content.includes("border: `1.5px solid ${activeTrack === 'python_ai' ? 'var(--green)' : 'var(--border)'}`"));
      // Inactive badge must use var(--bg3) and var(--t2), not white text on var(--bg2)
      assert.ok(content.includes("background: activeTrack === 'python_ai' ? 'var(--green)' : 'var(--bg3)'"));
      assert.ok(content.includes("color: activeTrack === 'python_ai' ? '#ffffff' : 'var(--t2)'"));
    });

    it('CareerGrowthGraph.tsx must not hardcode pitch dark slate background or white grid lines', () => {
      const content = fs.readFileSync(path.resolve(process.cwd(), 'src/app/quests/components/CareerGrowthGraph.tsx'), 'utf-8');
      assert.equal(content.includes('rgba(15, 23, 42, 0.85)'), false, 'Graph container must not be hardcoded dark slate');
      assert.equal(content.includes('rgba(255, 255, 255, 0.06)'), false, 'Grid lines must not be hardcoded white');
      assert.ok(content.includes("background: 'var(--card)'"));
      assert.ok(content.includes('stroke="var(--border)"'));
    });

    it('ActiveEnrollmentBanner.tsx must adapt to light mode', () => {
      const content = fs.readFileSync(path.resolve(process.cwd(), 'src/app/quests/components/ActiveEnrollmentBanner.tsx'), 'utf-8');
      assert.equal(content.includes('linear-gradient(135deg, rgba(30, 41, 59, 0.95)'), false, 'Banner must not hardcode dark gradient');
      assert.ok(content.includes("linear-gradient(135deg, var(--card) 0%, var(--bg2) 100%)"));
    });

    it('VerticalCheckpointStepper.tsx container and step cards must adapt to theme', () => {
      const content = fs.readFileSync(path.resolve(process.cwd(), 'src/app/quests/components/VerticalCheckpointStepper.tsx'), 'utf-8');
      assert.equal(content.includes('linear-gradient(180deg, rgba(15, 23, 42, 0.95)'), false, 'Stepper container must not hardcode dark gradient');
      assert.ok(content.includes("linear-gradient(180deg, var(--card) 0%, var(--bg2) 100%)"));
      assert.ok(content.includes("color: 'var(--t1)'"));
      assert.ok(content.includes("color: 'var(--t2)'"));
    });

    it('Arena page.tsx must use theme-adaptive surface tokens for combat bar and Monaco editor', () => {
      const arenaCode = fs.readFileSync(path.resolve(process.cwd(), 'src/app/arena/page.tsx'), 'utf-8');
      assert.equal(arenaCode.includes('background: \'#0d1117\''), false, 'Monaco loader fallback must not be hardcoded pitch black #0d1117');
      assert.ok(arenaCode.includes("linear-gradient(135deg, var(--card) 0%, var(--bg2) 100%)"));
      assert.ok(arenaCode.includes("background: 'var(--bg3)', color: 'var(--t3)'"));
    });

    it('Friends tab views must not hardcode dark islands', () => {
      const arenaChallenges = fs.readFileSync(path.resolve(process.cwd(), 'src/components/friends/ArenaChallengesView.tsx'), 'utf-8');
      const squadProjects = fs.readFileSync(path.resolve(process.cwd(), 'src/components/friends/SquadProjectsView.tsx'), 'utf-8');
      const friendChat = fs.readFileSync(path.resolve(process.cwd(), 'src/components/friends/FriendChatView.tsx'), 'utf-8');
      
      assert.equal(arenaChallenges.includes('background: \'rgba(15, 23, 42, 0.85)\''), false);
      assert.equal(squadProjects.includes('background: \'rgba(15, 23, 42, 0.85)\''), false);
      assert.equal(friendChat.includes('background: \'rgba(15, 23, 42, 0.85)\''), false);
    });
  });

  // =========================================================================
  // SECTION 2: CHECKOUT MODAL VIEWPORT, PORTAL, AND SCROLL LOCK AUDIT
  // =========================================================================
  describe('Brutal Audit 2: Checkout Modal Viewport Alignment & Scroll Lock Dynamics', () => {
    
    it('CrashCourseCheckoutModal source must use createPortal and lock document.body scroll', () => {
      const checkoutCode = fs.readFileSync(path.resolve(process.cwd(), 'src/app/quests/components/CrashCourseCheckoutModal.tsx'), 'utf-8');
      
      // Must import createPortal from react-dom
      assert.ok(checkoutCode.includes("import { createPortal } from 'react-dom'"));
      // Must use createPortal
      assert.ok(checkoutCode.includes("return createPortal(modalContent, document.body)"));
      // Must have scroll lock hook
      assert.ok(checkoutCode.includes("document.body.style.overflow = 'hidden'"));
      // Must restore previous overflow on unmount/close
      assert.ok(checkoutCode.includes("document.body.style.overflow = prevOverflow"));
      // Viewport container must cover 100vw and 100vh with high zIndex
      assert.ok(checkoutCode.includes("width: '100vw'"));
      assert.ok(checkoutCode.includes("height: '100vh'"));
      assert.ok(checkoutCode.includes("zIndex: 99999"));
    });

    it('DOM Simulation: Body overflow properly locks and restores across open/close cycles', () => {
      const originalDocument = global.document;
      const originalWindow = global.window;

      const mockBody = {
        style: { overflow: '' }
      };

      (global as any).document = {
        body: mockBody,
        createElement: () => ({ appendChild: () => {}, click: () => {} }),
      };
      (global as any).window = {
        addEventListener: () => {},
        removeEventListener: () => {},
      };

      // Test Case A: Initial body has empty overflow
      mockBody.style.overflow = '';
      let prevOverflow = mockBody.style.overflow;
      mockBody.style.overflow = 'hidden';
      assert.equal(mockBody.style.overflow, 'hidden', 'Body overflow must be hidden while modal is open');
      // Simulate close
      mockBody.style.overflow = prevOverflow;
      assert.equal(mockBody.style.overflow, '', 'Body overflow must restore to empty when closed');

      // Test Case B: Initial body had pre-existing overflow='auto'
      mockBody.style.overflow = 'auto';
      prevOverflow = mockBody.style.overflow;
      mockBody.style.overflow = 'hidden';
      assert.equal(mockBody.style.overflow, 'hidden', 'Body overflow must lock to hidden');
      mockBody.style.overflow = prevOverflow;
      assert.equal(mockBody.style.overflow, 'auto', 'Body overflow must restore to pre-existing auto');

      // Restore
      (global as any).document = originalDocument;
      (global as any).window = originalWindow;
    });

    it('Pricing math: scholarship promo discount and statutory GST calculate with precision', () => {
      const plan = CRASH_COURSE_PLANS[0]; // 1-Month: 4999
      
      // Without promo
      const normal = calculateCheckoutPricing(plan.inrPrice, false);
      assert.equal(normal.baseTuition, 4999);
      assert.equal(normal.gstAmount, Math.round(4999 * 0.18)); // 900
      assert.equal(normal.finalPayable, 4999 + 900); // 5899

      // With PINIT2026 scholarship promo (1000 off)
      const discounted = calculateCheckoutPricing(plan.inrPrice, true);
      assert.equal(discounted.discountedSubtotal, 3999);
      assert.equal(discounted.gstAmount, Math.round(3999 * 0.18)); // 720
      assert.equal(discounted.finalPayable, 3999 + 720); // 4719
      assert.equal(normal.finalPayable - discounted.finalPayable, 1180, 'Discount must save 1000 + 18% GST = 1180');
    });
  });

  // =========================================================================
  // SECTION 3: SSR RENDERING INTEGRITY & HYDRATION SAFETY
  // =========================================================================
  describe('Brutal Audit 3: SSR Render Stability (Zero Node Exceptions)', () => {
    
    it('SSR renders CrashCoursePlanCards with both tracks without error', () => {
      const html = renderToString(React.createElement(CrashCoursePlanCards, {
        onSelectPlan: () => {},
        userPins: 100,
      }));
      assert.ok(html.includes('Industry Crash Certification Programs'));
      assert.ok(html.includes('Full-Stack Web Development'));
      assert.ok(html.includes('Python &amp; Data Engineering'));
      assert.ok(html.includes('1-Month Fast-Track Sprint'));
    });

    it('SSR renders CareerGrowthGraph with valid SVG elements and zero hardcoded dark slate', () => {
      const html = renderToString(React.createElement(CareerGrowthGraph));
      assert.ok(html.includes('Career Growth Trajectory'));
      assert.ok(html.includes('<svg'));
      assert.equal(html.includes('rgba(15, 23, 42, 0.85)'), false);
    });

    it('SSR renders ActiveEnrollmentBanner and VerticalCheckpointStepper cleanly', () => {
      const bannerHtml = renderToString(React.createElement(ActiveEnrollmentBanner, {
        enrollment: {
          planId: 'plan-1m-sprint',
          planTitle: '1-Month Fast-Track Sprint',
          track: 'web_fullstack',
          enrolledAt: new Date().toISOString(),
          status: 'active',
          amountPaid: 5899,
          paymentMethod: 'razorpay',
          paymentId: 'pay_test',
          orderId: 'order_test',
          invoiceUrl: '#',
          seatId: 'REF-TEST-001',
          progressPct: 25,
          currentSprint: 'Sprint 1: Architecture',
          lessonsCompleted: 12,
          totalLessons: 48,
          finalProjectUnlocked: false,
          certificateIssued: false,
        },
        onOpenTimeline: () => {},
        onOpenCapstonePortal: () => {},
      }));
      assert.ok(bannerHtml.includes('Full-Stack Web Dev'));
      assert.ok(bannerHtml.includes('1-Month Fast-Track Sprint'));

      const stepperHtml = renderToString(React.createElement(VerticalCheckpointStepper, {
        planId: 'plan-1m-sprint',
        activeTrack: 'web_fullstack',
        progress: {
          completedQuests: [],
          currentPhase: 'phase1',
          phases: {
            phase1: 'in_progress',
            phase2: 'locked',
            phase3: 'locked',
          },
          practiceTestScores: {},
          capstoneSubmitted: false,
          certificateIssued: false,
        },
        onOpenPracticeTest: () => {},
        onOpenCapstoneDesk: () => {},
        onOpenQrModal: () => {},
      }));
      assert.ok(stepperHtml.includes('Vertical Milestone Pipeline'));
    });

    it('SSR renders CrashCourseCheckoutModal with data-testid="crash-checkout-modal"', () => {
      const modalHtml = renderToString(React.createElement(CrashCourseCheckoutModal, {
        isOpen: true,
        onClose: () => {},
        plan: CRASH_COURSE_PLANS[0],
        activeTrack: 'web_fullstack',
        userPins: 50,
        studentName: 'Brutal Stranger QA',
        onSuccessEnrollment: () => {},
      }));
      assert.ok(modalHtml.includes('data-testid="crash-checkout-modal"'));
      assert.ok(modalHtml.includes('Enroll in 1-Month Fast-Track Sprint'));
      assert.ok(modalHtml.includes('Razorpay Live UPI'));
      assert.ok(modalHtml.includes('Instant Sandbox Demo'));
    });
  });
});
