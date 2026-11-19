import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import WhatToDoToday from '../src/components/ui/WhatToDoToday';

describe('STUDENT DASHBOARD: UI/UX SHADES, ALIGNMENT & REAL DYNAMIC DATA AUDIT', () => {
  const root = process.cwd();

  const files = {
    page: fs.readFileSync(path.join(root, 'src/app/dashboard/page.tsx'), 'utf-8'),
    hud: fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardHeaderHUD.tsx'), 'utf-8'),
    progress: fs.readFileSync(path.join(root, 'src/components/student/dashboard/CareerCourseProgressBar.tsx'), 'utf-8'),
    whatToDo: fs.readFileSync(path.join(root, 'src/components/ui/WhatToDoToday.tsx'), 'utf-8'),
    bento: fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardBentoGrid.tsx'), 'utf-8'),
    trajectory: fs.readFileSync(path.join(root, 'src/components/student/dashboard/DashboardTrajectoryMap.tsx'), 'utf-8'),
    header: fs.readFileSync(path.join(root, 'src/components/ui/AppHeader.tsx'), 'utf-8'),
  };

  it('1. Live data integration in dashboard/page.tsx (leaderboard, independent projects, enrollment)', () => {
    assert.ok(files.page.includes('/api/leaderboard?'), 'Must fetch live leaderboard standing & ELO');
    assert.ok(files.page.includes('fetchIndependentProjectsFromDb'), 'Must fetch independent projects from DB/cache');
    assert.ok(files.page.includes('crashCourseEnrollmentService.getActiveEnrollment()'), 'Must fetch active crash-course enrollment');
    assert.ok(files.page.includes('pinit:user_profile_updated'), 'Must listen to live profile/ELO updates');
    assert.ok(files.page.includes('data-testid="dashboard-skeleton"'), 'Must render bento shimmer skeleton while loading');
  });

  it('2. Zero fake or static telemetry leftovers across dashboard components', () => {
    // WhatToDoToday honesty invariants
    assert.ok(!files.whatToDo.includes('>60%<') && !files.whatToDo.includes('60%'), 'Must NOT render hardcoded 60% pill');
    assert.ok(!files.whatToDo.includes('{ 0: true }'), 'Must NOT pre-check Priority Action item 0');
    assert.ok(!files.whatToDo.includes('+100 XP'), 'Must NOT stack duplicate +50/+100 XP badges');
    assert.ok(files.whatToDo.includes('data-testid="actions-done-pill"'), 'Must render dynamic actions-done pill');

    // BentoGrid honesty invariants
    assert.ok(!files.bento.includes('>50/50<') && !files.bento.includes('50/50'), 'Must NOT render leftover 50/50 pill');
    assert.ok(!files.bento.includes('hours: 2, minutes: 48, seconds: 10'), 'Must NOT hardcode static 02:48:10 countdown');
    assert.ok(!files.bento.includes("'#42'") && !files.bento.includes("'#118'") && !files.bento.includes("'#264'") && !files.bento.includes("'#480'"), 'Must NOT hardcode fake Arena rank numbers');
    assert.ok(!files.bento.includes('rgba(255,255,255,0.02)'), 'Must NOT hardcode dark-only white-alpha on populated project cards');
    assert.ok(!files.bento.includes('rgba(255,255,255,0.01)'), 'Must NOT hardcode dark-only white-alpha on AI mistakes rows');
    assert.ok(files.bento.includes('independentProjects'), 'Must merge independent projects with portfolio projects');
    assert.ok(files.bento.includes('data-testid="radar-axis-telemetry"'), 'Must display 5-axis competency numeric strip');

    // Course Runway real resolution
    assert.ok(files.progress.includes('resolvedProgress'), 'CareerCourseProgressBar must resolve track-specific quest completion');
    assert.ok(files.progress.includes("transform: 'translateY(-50%)'"), 'CareerCourseProgressBar rail must vertically center on nodes');
  });

  it('3. Zero broken CSS variable alpha concatenation & searchable trajectory catalog', () => {
    assert.ok(!files.trajectory.includes('${track.color}18'), 'Must NOT concatenate hex alpha 18 onto CSS variables');
    assert.ok(!files.trajectory.includes('${track.color}33'), 'Must NOT concatenate hex alpha 33 onto CSS variables');
    assert.ok(!files.trajectory.includes('${track.color}40'), 'Must NOT concatenate hex alpha 40 onto CSS variables');
    assert.ok(files.trajectory.includes('color-mix(in srgb, ${track.color}'), 'Must use valid CSS color-mix() for track tints');
    assert.ok(files.trajectory.includes('aria-label="Search career trajectories"'), 'Must provide trajectory search input');
    assert.ok(files.trajectory.includes('CATEGORIES.map'), 'Must provide domain category filter chips');
  });

  it('4. Grounded card depth CSS & bottom AI mentor clearance (88px)', () => {
    assert.ok(files.page.includes('padding: 4px 4px 88px;'), '.db-page must reserve 88px bottom clearance for floating AI mentor pill');
    const hoverMatch = files.page.match(/\.db-glass:hover\s*\{[^}]*\}/);
    assert.ok(hoverMatch, 'Must define .db-glass:hover rule');
    assert.ok(!hoverMatch[0].includes('translateY'), '.db-glass:hover must stay grounded without shifting entire containers');
    assert.ok(files.page.includes('.db-well-interactive:hover'), 'Interactive nested tiles must lift smoothly via .db-well-interactive');
  });

  it('5. Runtime SSR check: WhatToDoToday renders 0/3 Done and zero checked items on baseline', () => {
    const htmlBaseline = renderToStaticMarkup(
      React.createElement(WhatToDoToday, {
        layout: 'vertical',
        profile: { ats_score: 0, trust_score: 0, mission_streak: 0, vault_count: 0, interviews_done: 0 },
      })
    );
    assert.ok(htmlBaseline.includes('0/3 Done'), 'Baseline must report 0/3 Done honestly');
    assert.ok(!htmlBaseline.includes('line-through'), 'No baseline item may appear crossed out as pre-completed');
    assert.ok(!htmlBaseline.includes('+100 XP'), 'No duplicate +100 XP badge in rendered HTML');

    const htmlActive = renderToStaticMarkup(
      React.createElement(WhatToDoToday, {
        layout: 'vertical',
        profile: { ats_score: 78, trust_score: 95, mission_streak: 5, vault_count: 2, interviews_done: 1 },
      })
    );
    assert.ok(htmlActive.includes('0/3 Done'), 'Checkbox state must stay honest per user interaction');
    assert.ok(htmlActive.includes('data-testid="action-item-vertical-0"'), 'Priority items render for active students');
  });

  it('6. Universal zero-emoji scan across all 7 modified dashboard files', () => {
    const emojiRegex = /[\u{10000}-\u{10ffff}\u{2600}-\u{27bf}]/u;
    for (const [name, content] of Object.entries(files)) {
      const match = content.match(emojiRegex);
      assert.equal(
        match,
        null,
        `File ${name} MUST NOT contain emojis, found: ${match ? match[0] : ''}`
      );
    }
  });
});
