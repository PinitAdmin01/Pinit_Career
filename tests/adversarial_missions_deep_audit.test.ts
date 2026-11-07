import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { NextRequest } from 'next/server';

import {
  DYNAMIC_SCENARIO_CATALOG,
  getScenariosForContext,
} from '../src/lib/missions/communicationScenarios';
import { POST as evaluateCommHandler } from '../src/app/api/communication/evaluate/route';
import LinguaLab from '../src/components/missions/LinguaLab';
import { MissionsGrowthRadar } from '../src/components/missions/MissionsGrowthRadar';
import MissionsArchetypeMatrix from '../src/components/missions/MissionsArchetypeMatrix';
import MissionsEvolveBanner from '../src/app/missions/components/MissionsEvolveBanner';
import MissionsStreakPanel from '../src/app/missions/components/MissionsStreakPanel';
import { CareerOSProvider } from '../src/lib/context/CareerOSContext';

describe('BRUTAL ADVERSARIAL AUDIT — MISSIONS SYSTEM (FIRST-TIME TESTER DEEP DRILL)', () => {
  const theme = {
    bg: '#0b0f19',
    bgCard: '#111827',
    bgInside: '#1f2937',
    border: '#374151',
    tPrimary: '#f9fafb',
    tSecondary: '#d1d5db',
    tTertiary: '#9ca3af',
    accentLight: 'rgba(99, 102, 241, 0.1)',
  };

  const sampleTeacher = { name: 'Ms. Priya', emoji: '👩‍💼' };

  describe('1. Adversarial API Edge Cases & Security Gate (/api/communication/evaluate)', () => {
    it('handles empty body gracefully', async () => {
      const req = new NextRequest('http://localhost:3000/api/communication/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const res = await evaluateCommHandler(req);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error, 'EMPTY_SUBMISSION');
    });

    it('handles whitespace-only and punctuation-only submissions', async () => {
      const req = new NextRequest('http://localhost:3000/api/communication/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission: '   \n\t  ...   ' }),
      });
      const res = await evaluateCommHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(data.scores.average <= 35, 'Punctuation/whitespace should receive low score');
      assert.equal(data.ratingLabel, 'Unprofessional / Deflective');
    });

    it('strips malicious script tags and XSS attempts without throwing', async () => {
      const maliciousPayload = '<script>alert("XSS")</script><img src=x onerror=alert(1)> Production is down.';
      const req = new NextRequest('http://localhost:3000/api/communication/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission: maliciousPayload,
          scenario: 'Production System Outage',
          track: 'Tech',
        }),
      });
      const res = await evaluateCommHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(!JSON.stringify(data).includes('<script>'), 'Must strip <script> tag');
      assert.ok(!JSON.stringify(data).includes('<img'), 'Must strip <img> tag');
    });

    it('clamps massive 50,000-character payload without memory crash or timeout', async () => {
      const giantText = 'The server crashed due to buffer exhaustion. '.repeat(1200); // ~54,000 chars
      const req = new NextRequest('http://localhost:3000/api/communication/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission: giantText,
          scenario: 'Production System Outage',
        }),
      });
      const res = await evaluateCommHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(data.ok, 'Must return ok');
      assert.ok(data.scores.average > 0, 'Must produce valid score');
    });

    it('brutally rejects all variations of corporate evasion and deflection with score <= 35', async () => {
      const evasivePhrases = [
        'Hi team ask claude for it',
        'ask chatgpt to fix this',
        'idk not my job',
        'whatever figure it out',
        'who cares google it',
        'testing 123',
        'blah blah blah',
      ];

      for (const phrase of evasivePhrases) {
        const req = new NextRequest('http://localhost:3000/api/communication/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submission: phrase, scenario: 'Production Database Connection Spike' }),
        });
        const res = await evaluateCommHandler(req);
        const data = await res.json();
        assert.ok(
          data.scores.average <= 35,
          `Phrase "${phrase}" must score <= 35, got ${data.scores.average}`
        );
        assert.equal(data.ratingLabel, 'Unprofessional / Deflective');
        assert.ok(data.rewrites.executive.length > 20, 'Must provide genuine executive rewrite');
        // Verify no string concat echoing
        assert.ok(
          !data.rewrites.executive.includes(phrase),
          `Must NOT echo evasive phrase "${phrase}" into executive rewrite`
        );
      }
    });

    it('handles totally unknown scenario title without falling over', async () => {
      const req = new NextRequest('http://localhost:3000/api/communication/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission: 'We experienced an outage and I am rolling back now. Expected ETA is 15 minutes.',
          scenario: 'NON_EXISTENT_ALIEN_SCENARIO_XYZ',
        }),
      });
      const res = await evaluateCommHandler(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(data.ok);
      assert.ok(data.scores.average >= 70);
    });
  });

  describe('2. Scenario Catalog & Dynamic Context Engine Resilience', () => {
    it('handles foreign or non-existent courseIds safely without crashing', () => {
      const scenarios = getScenariosForContext('UNKNOWN_COURSE_SPECIALTY_999', 'all');
      assert.ok(scenarios.length > 0, 'Must fall back to full catalog');
      assert.ok(scenarios[0].id, 'Items must be intact');
    });

    it('handles invalid domain filter safely without crashing', () => {
      const scenarios = getScenariosForContext(undefined, 'INVALID_DOMAIN_FILTER' as any);
      assert.deepEqual(scenarios, [], 'Invalid domain filter returns empty array');
    });

    it('every catalog scenario has robust non-empty rewrites and etiquette guidance', () => {
      for (const s of DYNAMIC_SCENARIO_CATALOG) {
        assert.ok(s.defaultRewrites.executive.length >= 30);
        assert.ok(s.defaultRewrites.professional.length >= 30);
        assert.ok(s.defaultRewrites.native.length >= 30);
        assert.ok(s.etiquetteTip.length >= 20);
      }
    });
  });

  describe('3. Zero Missions Completed (Uncalibrated Integrity) Deep Audit', () => {
    it('MissionsGrowthRadar: zero missions completed shows absolute nulls across all spokes', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsGrowthRadar, {
          theme,
          onboardingAnswers: { qt2_score: 85 }, // Even if onboarding has numbers, uncalibrated user must show null
          user: { missions_completed: 0, mission_streak: 0 },
          hoveredRadarMetric: null,
          setHoveredRadarMetric: () => {},
          setActiveTab: () => {},
          hasCompletedAnyMission: false,
        })
      );

      // Must show null uncalibrated badge
      assert.ok(html.includes('null (Uncalibrated)'));
      // Center SVG must be uncalibrated
      assert.ok(html.includes('UNCALIBRATED'));
      assert.ok(html.includes('0 Missions Done'));
      // Must NOT contain user growth polygon web
      assert.ok(!html.includes('fill="rgba(99,102,241,0.25)"'), 'User growth polygon web must be completely absent when uncalibrated');
      // All metric values must say null
      assert.ok(html.includes('>null<'), 'Must render null values for metric pills');
      // Baseline prompt must be present
      assert.ok(html.includes('Baseline Calibration Pending'));
    });

    it('MissionsArchetypeMatrix: zero missions completed pins to center with CALIBRATION PENDING', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsArchetypeMatrix, {
          theme,
          onboardingAnswers: { mindset_archetype: 'Pattern Hunter', qt2_score: 90 },
          user: { missions_completed: 0 },
          hoveredQuadrant: null,
          setHoveredQuadrant: () => {},
          selectedQuadrant: null,
          setSelectedQuadrant: () => {},
          hasCompletedAnyMission: false,
        })
      );

      assert.ok(html.includes('Pending Baseline'));
      assert.ok(html.includes('CALIBRATION PENDING'));
      assert.ok(html.includes('left:50%') || html.includes('left: 50%'));
      assert.ok(html.includes('top:50%') || html.includes('top: 50%'));
      assert.ok(html.includes('Mindset Archetype: null (Uncalibrated)'));
      assert.ok(html.includes('QT2: null'));
      // Checkmarks must be suppressed
      assert.ok(!html.includes('Pattern Hunter ✓'));
      assert.ok(!html.includes('Social ✓'));
    });

    it('MissionsEvolveBanner: uncalibrated user sees null Archetype and null QT2', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(MissionsEvolveBanner, {
          theme,
          onboardingAnswers: { mindset_archetype: 'Architect', qt2_score: 80 },
          roleplayLoading: false,
          isUnlocking: false,
          initiateRoleplay: () => {},
          showTraditionalMissions: false,
          setShowTraditionalMissions: () => {},
          tab: 'today',
          setTab: () => {},
          generating: false,
          handleTriggerRegenerate: () => {},
          pending: [],
          completedMissions: [],
          allTodayMissions: [],
          pastCompleted: [],
          completeMission: () => {},
          customSkill: '',
          setCustomSkill: () => {},
          handleGenerateCustomQuests: () => {},
          generatingSkill: false,
          hasCompletedAnyMission: false,
        })
      );

      assert.ok(html.includes('Pending Baseline'));
      assert.ok(html.includes('null (Uncalibrated)'));
      assert.ok(html.includes('🧠 null'));
      assert.ok(html.includes('Calibration Session Ready'));
    });
  });

  describe('4. LinguaLab UI Under Extreme Props', () => {
    it('renders cleanly with streak = 0 and no active course without crashing', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          CareerOSProvider,
          null,
          React.createElement(LinguaLab, {
            streak: 0,
            theme,
          })
        )
      );

      assert.ok(html.includes('0 Days'));
      assert.ok(html.includes('Workplace Communication Simulator'));
      assert.ok(html.includes('Choose Workplace Issue to Solve:'));
    });

    it('renders cleanly with streak = 1000 and commerce courseId without crashing', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          CareerOSProvider,
          null,
          React.createElement(LinguaLab, {
            streak: 1000,
            theme,
            activeCourseId: 'bcom_acc',
            role: 'Forensic Accountant',
          })
        )
      );

      assert.ok(html.includes('1000 Days'));
      assert.ok(html.includes('Track: bcom_acc'));
      assert.ok(html.includes('Commerce &amp; Audit') || html.includes('Commerce & Audit'));
    });
  });
});
