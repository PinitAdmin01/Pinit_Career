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
import { CareerOSProvider } from '../src/lib/context/CareerOSContext';

describe('BRUTAL VALIDATION — CAREER COMMUNICATION LAB (Task 2)', () => {
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

  describe('1. Dynamic Scenario Catalog & Course-Aware Engine', () => {
    it('catalog contains comprehensive real-world scenarios across all required domains', () => {
      assert.ok(DYNAMIC_SCENARIO_CATALOG.length >= 10, 'Must have at least 10 rich scenarios');

      const domains = new Set(DYNAMIC_SCENARIO_CATALOG.map((s) => s.domain));
      assert.ok(domains.has('tech'), 'Must include tech scenarios');
      assert.ok(domains.has('product'), 'Must include product & scope scenarios');
      assert.ok(domains.has('client'), 'Must include client & stakeholder scenarios');
      assert.ok(domains.has('commerce'), 'Must include commerce & finance scenarios');
      assert.ok(domains.has('career'), 'Must include career negotiation scenarios');

      for (const sc of DYNAMIC_SCENARIO_CATALOG) {
        assert.ok(sc.id, 'Scenario must have an id');
        assert.ok(sc.title, 'Scenario must have a title');
        assert.ok(sc.situation, 'Scenario must have a situation description');
        assert.ok(sc.prompt, 'Scenario must have an objective prompt');
        assert.ok(sc.placeholder, 'Scenario must have a placeholder');
        assert.ok(sc.defaultRewrites.executive, 'Must have executive rewrite');
        assert.ok(sc.defaultRewrites.professional, 'Must have professional rewrite');
        assert.ok(sc.defaultRewrites.native, 'Must have native speaker rewrite');
      }
    });

    it('getScenariosForContext filters scenarios by domain correctly', () => {
      const techOnly = getScenariosForContext(undefined, 'tech');
      assert.ok(techOnly.length > 0, 'Must find tech scenarios');
      assert.ok(techOnly.every((s) => s.domain === 'tech'), 'All returned scenarios must be tech');

      const commerceOnly = getScenariosForContext(undefined, 'commerce');
      assert.ok(commerceOnly.length > 0, 'Must find commerce scenarios');
      assert.ok(commerceOnly.every((s) => s.domain === 'commerce'), 'All returned scenarios must be commerce');
    });

    it('getScenariosForContext prioritizes course-matched scenarios to the front', () => {
      const pythonScenarios = getScenariosForContext('python', 'all');
      assert.ok(pythonScenarios.length > 0);
      assert.ok(pythonScenarios[0].courseIds?.includes('python'), 'First scenario must be python-relevant');

      const commerceScenarios = getScenariosForContext('bcom_acc', 'all');
      assert.ok(commerceScenarios.length > 0);
      assert.ok(commerceScenarios[0].courseIds?.includes('bcom_acc'), 'First scenario must be accounting-relevant');
    });
  });

  describe('2. Evaluation API Route (/api/communication/evaluate)', () => {
    it('rejects empty submissions with HTTP 400', async () => {
      const req = new NextRequest('http://localhost:3000/api/communication/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission: '   ' }),
      });

      const res = await evaluateCommHandler(req);
      assert.equal(res.status, 400);
      const json = await res.json();
      assert.equal(json.error, 'EMPTY_SUBMISSION');
    });

    it('detects evasive slang ("Hi team ask claude for it") and returns low score and critique without template leaks', async () => {
      const req = new NextRequest('http://localhost:3000/api/communication/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission: 'Hi team ask claude for it',
          scenario: 'Production System Outage',
          track: 'Engineering / Tech',
        }),
      });

      const res = await evaluateCommHandler(req);
      assert.equal(res.status, 200);
      const json = await res.json();

      assert.equal(json.ok, true);
      assert.ok(json.scores.average <= 35, `Score must be low for evasive response, got: ${json.scores.average}`);
      assert.equal(json.ratingLabel, 'Unprofessional / Deflective');
      assert.ok(json.feedback.recommendation.includes('Never dismiss') || json.feedback.recommendation.includes('evasive'));

      // Crucial: Must NOT concatenate "Regarding ... Hi team ask claude for it. We have locked the root-cause..."
      assert.ok(
        !json.rewrites.executive.includes('Regarding Production System Outage: Hi team ask claude for it.'),
        'Must not concatenate evasive user text into an executive template'
      );
      assert.ok(json.rewrites.executive.length > 20, 'Must provide an authentic executive rewrite');
      assert.ok(json.rewrites.professional.length > 20, 'Must provide an authentic professional rewrite');
      assert.ok(json.rewrites.native.length > 20, 'Must provide an authentic native rewrite');
    });

    it('evaluates substantive corporate responses with realistic scores and nuanced rewrites', async () => {
      const req = new NextRequest('http://localhost:3000/api/communication/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission:
            'Hi team, we experienced a DB connection pool spike at 2:10 PM causing 504 timeouts. I have restarted stale connections, resized the pool, and will circulate an updated status report by 3:00 PM.',
          scenario: 'Production System Outage',
          track: 'Engineering / Tech',
        }),
      });

      const res = await evaluateCommHandler(req);
      assert.equal(res.status, 200);
      const json = await res.json();

      assert.equal(json.ok, true);
      assert.ok(json.scores.average >= 70, `Substantive response should score >= 70, got: ${json.scores.average}`);
      assert.ok(json.scores.clarity >= 65, 'Clarity should reflect concrete details');
      assert.ok(json.scores.structure >= 65, 'Structure should reflect timeline presence');
      assert.ok(json.rewrites.executive, 'Executive rewrite must exist');
      assert.ok(json.rewrites.professional, 'Professional rewrite must exist');
      assert.ok(json.rewrites.native, 'Native rewrite must exist');
      assert.ok(json.feedback.positive, 'Positive feedback must exist');
    });
  });

  describe('3. LinguaLab React Component UI/UX', () => {
    it('renders cleanly in SSR without errors and displays dynamic domain filters', () => {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          CareerOSProvider,
          null,
          React.createElement(LinguaLab, {
            streak: 4,
            theme,
            activeCourseId: 'python',
            role: 'Full-Stack Developer',
          })
        )
      );

      // Verify title & badges
      assert.ok(html.includes('Workplace Communication Simulator'), 'Must render simulator title');
      assert.ok(html.includes('Track: python'), 'Must display active course track badge');
      assert.ok(html.includes('4 Days'), 'Must display active streak');

      // Verify domain category buttons
      assert.ok(html.includes('Tech &amp; Engineering') || html.includes('Tech & Engineering'), 'Must include tech filter');
      assert.ok(html.includes('Scope &amp; Delivery') || html.includes('Scope & Delivery'), 'Must include delivery filter');
      assert.ok(html.includes('Stakeholders'), 'Must include stakeholder filter');
      assert.ok(html.includes('Commerce &amp; Audit') || html.includes('Commerce & Audit'), 'Must include commerce filter');
      assert.ok(html.includes('Career &amp; Growth') || html.includes('Career & Growth'), 'Must include career filter');

      // Verify dynamic controls
      assert.ok(html.includes('Next Scenario'), 'Must include Next Scenario button to prevent repetition');
      assert.ok(html.includes('Speak Your Answer'), 'Must include voice dictation action button');
      assert.ok(html.includes('Check Corporate Communication &amp; Get Executive Rewrites') || html.includes('Check Corporate Communication'), 'Must render action CTA');
    });
  });
});
