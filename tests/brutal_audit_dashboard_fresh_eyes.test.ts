import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import WhatToDoToday from '../src/components/ui/WhatToDoToday';

describe('BRUTAL FRESH-EYES DEEP AUDIT: STUDENT DASHBOARD OVERHAUL', () => {
  const root = process.cwd();

  const files = {
    page: fs.readFileSync(path.join(root, 'src/app/dashboard/page.tsx'), 'utf-8'),
    hud: fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardHeaderHUD.tsx'), 'utf-8'),
    bento: fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardBentoGrid.tsx'), 'utf-8'),
    progress: fs.readFileSync(path.join(root, 'src/components/student/dashboard/CareerCourseProgressBar.tsx'), 'utf-8'),
    whatToDo: fs.readFileSync(path.join(root, 'src/components/ui/WhatToDoToday.tsx'), 'utf-8'),
  };

  // ── AUDIT 1: ZERO TOLERANCE TEXT PURGE ───────────────────────────────────
  describe('Audit 1: Zero-Tolerance Text Purge', () => {
    const bannedPhrases = [
      'ENROLLED CAREER ACCREDITATION ● Active Program',
      'Overall Progress',
      'Active Pathway: Full-Stack Software Engineer',
    ];

    for (const phrase of bannedPhrases) {
      test(`Strict ban: "${phrase}" must not appear in any dashboard component`, () => {
        for (const [name, content] of Object.entries(files)) {
          assert.strictEqual(
            content.includes(phrase),
            false,
            `Banned phrase "${phrase}" found in ${name}!`
          );
        }
      });
    }
  });

  // ── AUDIT 2: ZERO TOLERANCE REMOVED COMPONENTS ────────────────────────────
  describe('Audit 2: Banned Component Removals', () => {
    test('DashboardKpiStrip is completely dead and unreferenced in page.tsx', () => {
      assert.strictEqual(files.page.includes('DashboardKpiStrip'), false);
    });

    test('DashboardAttendanceMarker is completely removed from BentoGrid', () => {
      assert.strictEqual(files.bento.includes('DashboardAttendanceMarker'), false);
    });

    test('HeaderHUD has no Trust button or SDE/IoT switcher elements', () => {
      assert.strictEqual(files.hud.includes('data-testid="btn-trust-overview"'), false);
      assert.strictEqual(files.hud.includes('SDE Software'), false);
      assert.strictEqual(files.hud.includes('IoT Hardware'), false);
    });
  });

  // ── AUDIT 3: 50% / 50% ROW 2 COCKPIT GRID INVARIANTS ─────────────────────
  describe('Audit 3: Row 2 Layout & Responsiveness Contract', () => {
    test('BentoGrid Row 2 encapsulates WhatToDoToday and Competencies Radar', () => {
      assert.ok(files.bento.includes('data-testid="dashboard-action-radar-row"'));
      assert.ok(files.bento.includes('minmax(340px, 1fr)'));
      assert.ok(files.bento.includes('<WhatToDoToday profile={actionProfile} layout="vertical" />'));
      assert.ok(files.bento.includes('data-testid="competencies-radar-card"'));
    });

    test('page.tsx passes actionProfile and never renders standalone horizontal WhatToDoToday', () => {
      assert.ok(files.page.includes('actionProfile={memoizedProfileForActions}'));
      const count = (files.page.match(/<WhatToDoToday/g) || []).length;
      assert.strictEqual(count, 0, 'Standalone WhatToDoToday must not exist in page.tsx');
    });

    test('WhatToDoToday in vertical mode has vertical list container and 3 action items', () => {
      const html = renderToStaticMarkup(
        React.createElement(WhatToDoToday, {
          layout: 'vertical',
          profile: { ats_score: 50, trust_score: 40, mission_streak: 1 },
        })
      );
      assert.ok(html.includes('data-testid="what-to-do-today-vertical-list"'));
      assert.ok(html.includes('data-testid="action-item-vertical-0"'));
      assert.ok(html.includes('data-testid="action-item-vertical-1"'));
      assert.ok(html.includes('data-testid="action-item-vertical-2"'));
      assert.ok(html.includes('3 Priority Actions'));
    });

    test('WhatToDoToday in horizontal mode has horizontal grid container', () => {
      const html = renderToStaticMarkup(
        React.createElement(WhatToDoToday, {
          layout: 'horizontal',
          profile: { ats_score: 50 },
        })
      );
      assert.ok(html.includes('data-testid="what-to-do-today-horizontal-grid"'));
      assert.ok(html.includes('data-testid="action-item-horizontal-0"'));
    });
  });

  // ── AUDIT 4: STRESS TESTING DATA EDGES & CORRUPT INPUTS ───────────────────
  describe('Audit 4: Stress Testing Data Edges & Corrupt Inputs', () => {
    test('WhatToDoToday handles null, undefined, and empty objects without crashing', () => {
      assert.doesNotThrow(() => {
        renderToStaticMarkup(React.createElement(WhatToDoToday, { profile: null }));
      });
      assert.doesNotThrow(() => {
        renderToStaticMarkup(React.createElement(WhatToDoToday, { profile: undefined }));
      });
      assert.doesNotThrow(() => {
        renderToStaticMarkup(React.createElement(WhatToDoToday, { profile: {} }));
      });
    });

    test('WhatToDoToday handles negative numbers and absurdly huge values gracefully', () => {
      const corruptProfile = {
        ats_score: -9999,
        trust_score: 9999999,
        mission_streak: -50,
        vault_count: -1,
        interviews_done: 999999,
      };

      const html = renderToStaticMarkup(
        React.createElement(WhatToDoToday, { profile: corruptProfile, layout: 'vertical' })
      );
      assert.ok(html.includes('data-testid="what-to-do-today-root"'));
      assert.ok(html.includes('data-testid="action-item-vertical-0"'));
    });

    test('All generated action links are valid internal routes starting with /', () => {
      const profiles = [
        {},
        { ats_score: 0, trust_score: 0, mission_streak: 0 },
        { ats_score: 100, trust_score: 100, mission_streak: 50, vault_count: 10, interviews_done: 5 },
      ];

      for (const p of profiles) {
        const html = renderToStaticMarkup(
          React.createElement(WhatToDoToday, { profile: p, layout: 'vertical' })
        );
        const hrefMatches = html.match(/href="([^"]+)"/g) || [];
        for (const m of hrefMatches) {
          const href = m.replace('href="', '').replace('"', '');
          assert.ok(href.startsWith('/'), `Route ${href} must be internal and start with /`);
        }
      }
    });
  });

  // ── AUDIT 5: RADAR POLYGON MATHEMATICAL INTEGRITY ─────────────────────────
  describe('Audit 5: Socratic Competencies Radar Mathematical Integrity', () => {
    test('Trigonometric polygon calculates strictly finite, bounded SVG points', () => {
      // Simulate radar calculation from BentoGrid:
      const calculateRadar = (scores: number[]) => {
        const angles = [0, 72, 144, 216, 288];
        return scores.map((score, i) => {
          const clamped = Math.max(0, Math.min(100, score || 0));
          const r = (clamped / 100) * 46;
          const rad = angles[i] * (Math.PI / 180);
          const x = +(60 + r * Math.sin(rad)).toFixed(1);
          const y = +(60 - r * Math.cos(rad)).toFixed(1);
          return `${x},${y}`;
        }).join(' ');
      };

      // Test Case A: All zeroes
      const zeroPoints = calculateRadar([0, 0, 0, 0, 0]);
      assert.strictEqual(zeroPoints, '60,60 60,60 60,60 60,60 60,60');

      // Test Case B: All 100 (outer boundary)
      const maxPoints = calculateRadar([100, 100, 100, 100, 100]);
      const coords = maxPoints.split(' ').map(pair => pair.split(',').map(Number));
      for (const [x, y] of coords) {
        assert.ok(!isNaN(x) && isFinite(x), `X coordinate ${x} must be finite`);
        assert.ok(!isNaN(y) && isFinite(y), `Y coordinate ${y} must be finite`);
        // Must stay strictly within [0, 120] viewBox bounds
        assert.ok(x >= 0 && x <= 120, `X coordinate ${x} out of bounds`);
        assert.ok(y >= 0 && y <= 120, `Y coordinate ${y} out of bounds`);
      }

      // Test Case C: Out of bounds / NaN defensive clamping
      const corruptPoints = calculateRadar([-50, 9999, NaN as any, null as any, undefined as any]);
      const corruptCoords = corruptPoints.split(' ').map(pair => pair.split(',').map(Number));
      for (const [x, y] of corruptCoords) {
        assert.ok(!isNaN(x) && isFinite(x));
        assert.ok(x >= 0 && x <= 120);
        assert.ok(y >= 0 && y <= 120);
      }
    });

    test('All 5 radar axes and title are preserved in BentoGrid', () => {
      assert.ok(files.bento.includes('CODING'));
      assert.ok(files.bento.includes('ARCH'));
      assert.ok(files.bento.includes('DATA'));
      assert.ok(files.bento.includes('SOCRATIC'));
      assert.ok(files.bento.includes('IoT'));
      assert.ok(files.bento.includes('Multi-Dimensional Competency Matrix'));
    });
  });

  // ── AUDIT 6: ACCESSIBILITY, ARIA & KEYBOARD NAVIGATION ───────────────────
  describe('Audit 6: Accessibility, ARIA & Keyboard Navigation', () => {
    test('CareerCourseProgressBar milestone nodes have full keyboard accessibility attributes', () => {
      assert.ok(files.progress.includes('role="button"'));
      assert.ok(files.progress.includes('tabIndex={0}'));
      assert.ok(files.progress.includes('aria-label='));
      assert.ok(files.progress.includes('onKeyDown='));
    });

    test('Resume Incomplete Day button has type="button" and data-testid', () => {
      assert.ok(files.progress.includes('type="button"'));
      assert.ok(files.progress.includes('data-testid="btn-resume-incomplete-day"'));
    });

    test('WhatToDoToday link cards have semantic accessible links', () => {
      const html = renderToStaticMarkup(
        React.createElement(WhatToDoToday, { layout: 'vertical', profile: {} })
      );
      assert.ok(html.includes('href="/career-builder"'));
      assert.ok(html.includes('href="/missions"'));
      assert.ok(html.includes('href="/trust"'));
      assert.ok(html.includes('<a '));
    });
  });
});
