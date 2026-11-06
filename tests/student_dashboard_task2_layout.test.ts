import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import WhatToDoToday from '../src/components/ui/WhatToDoToday';

describe('STUDENT DASHBOARD: TASK 2 RADAR & WHAT TO DO TODAY LAYOUT AUDIT', () => {
  const root = process.cwd();
  const whatToDoFile = fs.readFileSync(path.join(root, 'src/components/ui/WhatToDoToday.tsx'), 'utf-8');
  const bentoGridFile = fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardBentoGrid.tsx'), 'utf-8');
  const dashboardPageFile = fs.readFileSync(path.join(root, 'src/app/dashboard/page.tsx'), 'utf-8');

  test('Task 2.1: DashboardBentoGrid groups WhatToDoToday and Competencies Radar in a 50/50 responsive grid', () => {
    assert.ok(
      bentoGridFile.includes('data-testid="dashboard-action-radar-row"'),
      'DashboardBentoGrid must contain dashboard-action-radar-row container'
    );
    assert.ok(
      bentoGridFile.includes('gridTemplateColumns: \'repeat(auto-fit, minmax(340px, 1fr))\'') ||
      bentoGridFile.includes('minmax(340px, 1fr)'),
      'Row 2 must use responsive 2-column split (50% on desktop)'
    );
    assert.ok(
      bentoGridFile.includes('<WhatToDoToday profile={actionProfile} layout="vertical" />'),
      'WhatToDoToday must be rendered in left column with layout="vertical"'
    );
    assert.ok(
      bentoGridFile.includes('data-testid="competencies-radar-card"'),
      'Right column must contain competencies-radar-card'
    );
  });

  test('Task 2.2: WhatToDoToday supports vertical layout with vertical list testid and compact cards', () => {
    assert.ok(
      whatToDoFile.includes('what-to-do-today-vertical-list'),
      'WhatToDoToday must render what-to-do-today-vertical-list when layout is vertical'
    );
    assert.ok(
      whatToDoFile.includes('what-to-do-today-horizontal-grid'),
      'WhatToDoToday must retain horizontal grid option for backward compatibility'
    );
    assert.ok(
      whatToDoFile.includes('safeProfile = profile || ({} as ActionProfile)'),
      'WhatToDoToday must handle null/undefined profile defensively without crashing'
    );
  });

  test('Task 2.3: DashboardPage wires actionProfile to BentoGrid and eliminates duplicate WhatToDoToday component', () => {
    assert.ok(
      dashboardPageFile.includes('actionProfile={memoizedProfileForActions}'),
      'DashboardPage must pass memoizedProfileForActions to DashboardBentoGrid'
    );
    // Ensure WhatToDoToday is NOT rendered as a standalone root component in page.tsx
    const matches = dashboardPageFile.match(/<WhatToDoToday/g) || [];
    assert.strictEqual(
      matches.length,
      0,
      'Standalone <WhatToDoToday /> must be removed from page.tsx (it is now embedded inside BentoGrid)'
    );
  });

  test('Task 2.4: Socratic Competencies Radar retains all 5 axis labels and SVG calculation', () => {
    assert.ok(bentoGridFile.includes('CODING'), 'Radar chart must retain CODING axis');
    assert.ok(bentoGridFile.includes('ARCH'), 'Radar chart must retain ARCH axis');
    assert.ok(bentoGridFile.includes('DATA'), 'Radar chart must retain DATA axis');
    assert.ok(bentoGridFile.includes('SOCRATIC'), 'Radar chart must retain SOCRATIC axis');
    assert.ok(bentoGridFile.includes('IoT'), 'Radar chart must retain IoT axis');
    assert.ok(bentoGridFile.includes('Multi-Dimensional Competency Matrix'), 'Header title must be preserved');
  });

  test('Task 2.5: Runtime rendering of WhatToDoToday in vertical mode', () => {
    const mockProfile = {
      ats_score: 45,
      trust_score: 60,
      career_dna_score: 50,
      mission_streak: 2,
      missions_completed: 4,
      recruiter_visibility: 70,
      vault_count: 2,
      interviews_done: 1,
      weak_areas: ['Algorithms'],
      skill_tags: ['TypeScript', 'React'],
      xp_total: 150,
      active_track: 'sde',
      target_role: 'Full-Stack Software Engineer',
    };

    const html = renderToStaticMarkup(
      React.createElement(WhatToDoToday, { profile: mockProfile, layout: 'vertical' })
    );

    assert.ok(html.includes('data-testid="what-to-do-today-root"'), 'Root element must have testid');
    assert.ok(html.includes('data-testid="what-to-do-today-vertical-list"'), 'Vertical list must render');
    assert.ok(html.includes('data-testid="action-item-vertical-0"'), 'Action item 0 must render');
    assert.ok(html.includes('data-testid="action-item-vertical-1"'), 'Action item 1 must render');
    assert.ok(html.includes('data-testid="action-item-vertical-2"'), 'Action item 2 must render');
    assert.ok(html.includes('3 Priority Actions'), 'Vertical title must render');
  });

  test('Task 2.6: Runtime rendering of WhatToDoToday with null profile falls back cleanly', () => {
    const html = renderToStaticMarkup(
      React.createElement(WhatToDoToday, { profile: null, layout: 'vertical' })
    );

    assert.ok(html.includes('data-testid="what-to-do-today-root"'), 'Root element must render even with null profile');
    assert.ok(html.includes('data-testid="action-item-vertical-0"'), 'Default action 0 must render');
    assert.ok(html.includes('Optimize Resume'), 'Default action must include Optimize Resume');
  });

  test('Task 2.7: Runtime rendering of WhatToDoToday in horizontal mode', () => {
    const html = renderToStaticMarkup(
      React.createElement(WhatToDoToday, { profile: {}, layout: 'horizontal' })
    );

    assert.ok(html.includes('data-testid="what-to-do-today-horizontal-grid"'), 'Horizontal grid must render');
    assert.ok(html.includes('data-testid="action-item-horizontal-0"'), 'Horizontal action 0 must render');
  });
});
