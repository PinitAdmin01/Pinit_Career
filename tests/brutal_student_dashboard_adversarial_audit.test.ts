import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

describe('BRUTAL ADVERSARIAL AUDIT: Student Dashboard Dynamic Perfection', () => {

  const hudPath = path.resolve(__dirname, '../src/components/student/dashboard/DashboardHeaderHUD.tsx');
  const progressBarPath = path.resolve(__dirname, '../src/components/student/dashboard/CareerCourseProgressBar.tsx');
  const bentoGridPath = path.resolve(__dirname, '../src/components/student/dashboard/DashboardBentoGrid.tsx');
  const trajectoryMapPath = path.resolve(__dirname, '../src/components/student/dashboard/DashboardTrajectoryMap.tsx');
  const whatToDoPath = path.resolve(__dirname, '../src/components/ui/WhatToDoToday.tsx');
  const dashboardPagePath = path.resolve(__dirname, '../src/app/dashboard/page.tsx');

  const hudContent = fs.readFileSync(hudPath, 'utf8');
  const progressBarContent = fs.readFileSync(progressBarPath, 'utf8');
  const bentoGridContent = fs.readFileSync(bentoGridPath, 'utf8');
  const trajectoryMapContent = fs.readFileSync(trajectoryMapPath, 'utf8');
  const whatToDoContent = fs.readFileSync(whatToDoPath, 'utf8');
  const dashboardPageContent = fs.readFileSync(dashboardPagePath, 'utf8');

  it('1. Hero HUD Telemetry is strictly right-aligned via 2-column grid and does not wrap below left content', () => {
    // Must define hero-main-layout with 2 columns
    assert.ok(
      hudContent.includes('gridTemplateColumns: \'minmax(0, 1fr) auto\'') ||
      hudContent.includes('grid-template-columns: minmax(0, 1fr) auto'),
      'Hero main layout must enforce 2-column grid (left flex minmax(0, 1fr), right auto)'
    );

    // Left greeting must have minWidth: 0 to allow clean flex shrinkage
    assert.ok(
      hudContent.includes('minWidth: 0'),
      'Greeting container must specify minWidth: 0 to prevent grid blowout'
    );

    // Right telemetry suite must exist and have 2x2 grid
    assert.ok(
      hudContent.includes('data-testid="header-telemetry-suite"'),
      'Must contain header-telemetry-suite'
    );
    assert.ok(
      /gridTemplateColumns:\s*'repeat\(2,\s*minmax\(\d+px,\s*1fr\)\)'/.test(hudContent),
      'Telemetry suite must arrange metrics in 2x2 grid'
    );
  });

  it('2. Telemetry baseline values are 100% honest: Trust=100, Career=0, ELO=100, WeeklyXP=0 (NO "/ 100")', () => {
    // Trust Score baseline must be 100 (or 100 - skipped * 5)
    assert.ok(
      hudContent.includes('return 100; // Honest baseline: 100') || hudContent.includes('return 100;'),
      'Trust score baseline must return 100'
    );

    // Career Score baseline must be 0
    assert.ok(
      hudContent.includes('return 0; // Honest baseline: 0') || hudContent.includes('return 0;'),
      'Career score baseline must return 0'
    );

    // Arena ELO baseline must be 100
    assert.ok(
      hudContent.includes('return 100; // Honest baseline: 100') || hudContent.includes('return 100;'),
      'Arena ELO baseline must return 100'
    );

    // Weekly EXP baseline must be 0
    assert.ok(
      hudContent.includes('return 0; // Honest baseline: 0') || hudContent.includes('return 0;'),
      'Weekly EXP baseline must return 0'
    );

    // Absolutely NO "/ 100" in HUD rendered JSX
    assert.ok(
      !hudContent.includes('{dynamicTrust} / 100'),
      'Must not render "{dynamicTrust} / 100"'
    );
    assert.ok(
      !hudContent.includes('{dynamicCareer} / 100'),
      'Must not render "{dynamicCareer} / 100"'
    );
    assert.ok(
      !hudContent.includes('/ 100</span>'),
      'Must not render "/ 100" span in HUD'
    );

    // Must not have fake 1,450 or fake 1,850 hardcoded fallbacks
    assert.ok(!hudContent.includes(': 1450'), 'Must not have 1450 fallback');
    assert.ok(!hudContent.includes('\'1,450 ELO\''), 'Must not render 1,450 ELO');
    assert.ok(!hudContent.includes('\'+1,850 XP\''), 'Must not render +1,850 XP');
    assert.ok(!hudContent.includes('Diamond League #42') || hudContent.includes('dynamicElo > 100'), 'Must not unconditionally render Diamond League #42');
  });

  it('3. CareerCourseProgressBar displays honest 0% un-enrolled state without fake 68% complete', () => {
    // When no enrollment, completedCount and percentComplete must evaluate to 0
    assert.ok(
      progressBarContent.includes('return 0; // Honest baseline: 0 when not enrolled') ||
      progressBarContent.includes('return 0; // Honest baseline: 0% when not enrolled'),
      'CareerCourseProgressBar must return 0% complete when un-enrolled'
    );

    // Must render honest title when !hasEnrollment
    assert.ok(
      progressBarContent.includes('Career Course: No Active Program Enrolled'),
      'Must render "Career Course: No Active Program Enrolled" when un-enrolled'
    );
    assert.ok(
      progressBarContent.includes('0% Complete'),
      'Must render "0% Complete" when un-enrolled'
    );

    // Must have CTA to explore career programs
    assert.ok(
      progressBarContent.includes('Explore Career Programs →'),
      'Must render CTA "Explore Career Programs →" when un-enrolled'
    );

    // Track line width must be 0% when un-enrolled
    assert.ok(
      progressBarContent.includes(': \'0%\''),
      'Track progress width must be 0% when un-enrolled'
    );
  });

  it('4. Engineering Growth Track progress is 0% when careerScore is 0 and fake beacon is removed', () => {
    // Width must be 0% if careerScore === 0
    assert.ok(
      bentoGridContent.includes('width: careerScore > 0 ?') && bentoGridContent.includes(': \'0%\''),
      'Engineering Growth Track line must be 0% when careerScore is 0'
    );

    // Fake beacon "💡 85%" must be eliminated
    assert.ok(
      !bentoGridContent.includes('💡 85%'),
      'Fake beacon "💡 85%" must be completely removed'
    );
    assert.ok(
      !bentoGridContent.includes('85% Complete'),
      'Fake "85% Complete" badge must be eliminated'
    );
  });

  it('5. Arena & League Telemetry shows Unranked • Placement when ELO is 100', () => {
    assert.ok(
      bentoGridContent.includes('tier: \'Unranked • Placement\'') ||
      bentoGridContent.includes('Unranked • Placement'),
      'Must display "Unranked • Placement" for baseline ELO 100'
    );
    assert.ok(
      bentoGridContent.includes('0 matches played'),
      'Must display "0 matches played" for unranked student'
    );
    assert.ok(
      !bentoGridContent.includes('💎'),
      'Must NOT use emoji 💎 for Arena'
    );
  });

  it('6. Proof Vault & Verified Credentials shows 0 of 3 Minted and 3 locked slots when empty', () => {
    assert.ok(
      bentoGridContent.includes('{vaultItems.length} of 3 Minted'),
      'Must dynamically render "{vaultItems.length} of 3 Minted"'
    );
    assert.ok(
      bentoGridContent.includes('Cryptographic badges ({vaultItems.length}/1)'),
      'Must dynamically render cryptographic badges count'
    );
    assert.ok(
      !bentoGridContent.includes('📜'),
      'Must NOT use emoji 📜'
    );
    assert.ok(
      !bentoGridContent.includes('🔒') || !bentoGridContent.includes('title="Cryptographic SHA-256 Vault Badge">'),
      'Must NOT use emoji 🔒'
    );
    assert.ok(
      !bentoGridContent.includes('🐙'),
      'Must NOT use emoji 🐙'
    );
  });

  it('7. Active & Capstone Projects displays high-tech Empty State when student has no projects', () => {
    // Must import getSavedCareerProjects
    assert.ok(
      bentoGridContent.includes('getSavedCareerProjects'),
      'Must import getSavedCareerProjects'
    );

    // Must check savedProjects.length === 0
    assert.ok(
      bentoGridContent.includes('savedProjects.length === 0'),
      'Must branch on savedProjects.length === 0'
    );

    // Empty state container text
    assert.ok(
      bentoGridContent.includes('No Active Project Workspaces'),
      'Must display "No Active Project Workspaces"'
    );
    assert.ok(
      bentoGridContent.includes('+ Initialize Project Workspace →') ||
      bentoGridContent.includes('+ Initialize Project Workspace &rarr;'),
      'Must render button "+ Initialize Project Workspace →"'
    );

    // Must not hardcode fake repositories like "Distributed Task Engine"
    assert.ok(
      !bentoGridContent.includes('\'Distributed Task Engine\''),
      'Must NOT hardcode fake project "Distributed Task Engine"'
    );
    assert.ok(
      !bentoGridContent.includes('\'FinTech Immutable Ledger\''),
      'Must NOT hardcode fake project "FinTech Immutable Ledger"'
    );
  });

  it('8. Universal Emoji Scan: ZERO emojis across all target dashboard source files', () => {
    const emojiRegex = /[\u{10000}-\u{10ffff}\u{2600}-\u{27bf}]/u;
    const files = [
      { name: 'DashboardHeaderHUD.tsx', content: hudContent },
      { name: 'CareerCourseProgressBar.tsx', content: progressBarContent },
      { name: 'DashboardBentoGrid.tsx', content: bentoGridContent },
      { name: 'DashboardTrajectoryMap.tsx', content: trajectoryMapContent },
      { name: 'WhatToDoToday.tsx', content: whatToDoContent },
      { name: 'DashboardPage (page.tsx)', content: dashboardPageContent },
    ];

    for (const f of files) {
      const match = f.content.match(emojiRegex);
      assert.equal(
        match,
        null,
        `File ${f.name} MUST NOT contain any emoji character, but found: ${match ? match[0] : ''}`
      );
    }
  });

});
