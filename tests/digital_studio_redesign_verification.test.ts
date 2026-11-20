import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { STUDENT_NAV, ROUTE_TOOLTIPS, isPathActive } from '../src/components/ui/AppSidebar';

describe('Digital Studio Redesign & Architecture Verification Suite', () => {
  const rootDir = process.cwd();

  describe('1. Global Brand & Navigation Consistency', () => {
    it('1.1: STUDENT_NAV registers /mirror with label "Digital Studio" and icon "🪞"', () => {
      const primaryItems = STUDENT_NAV[0].items;
      const studioItem = primaryItems.find((it: any) => it.href === '/mirror') as any;
      assert.ok(studioItem, 'STUDENT_NAV must contain /mirror');
      assert.equal(studioItem.label, 'Digital Studio', 'Sidebar label must be "Digital Studio"');
      assert.equal(studioItem.icon, '🪞', 'Icon must be 🪞');
    });

    it('1.2: ROUTE_TOOLTIPS registers /mirror as "Digital Studio"', () => {
      const tooltip = ROUTE_TOOLTIPS['/mirror'];
      assert.ok(tooltip, 'ROUTE_TOOLTIPS must define /mirror');
      assert.equal(tooltip.label, 'Digital Studio');
      assert.ok(tooltip.tooltip.includes('Digital Studio'), 'Tooltip must reference Digital Studio');
      assert.ok(tooltip.tooltip.includes('ATS Resume Studio & Career Digital Twin'));
    });

    it('1.3: AppShell PAGE_TITLES registers /mirror as "Digital Studio"', () => {
      const appShellPath = path.join(rootDir, 'src/components/ui/AppShell.tsx');
      const content = fs.readFileSync(appShellPath, 'utf-8');
      assert.ok(
        content.includes("'/mirror':        'Digital Studio'"),
        "AppShell PAGE_TITLES must map '/mirror' to 'Digital Studio'"
      );
      assert.ok(content.includes("'/mirror'"), "allowedStudentTabs must include '/mirror'");
    });

    it('1.4: StoryTourModal registers /mirror as "Digital Studio"', () => {
      const tourPath = path.join(rootDir, 'src/components/ui/StoryTourModal.tsx');
      const content = fs.readFileSync(tourPath, 'utf-8');
      assert.ok(content.includes("title: 'Digital Studio'"), 'StoryTourModal must have Digital Studio title');
      assert.ok(content.includes("segmentLabel: 'TAB 7/12 · DIGITAL STUDIO'"), 'StoryTourModal segment label updated');
    });
  });

  describe('2. Dual-Pillar Architecture Diagram Fidelity (media_1794873772618_579d3112.png)', () => {
    const mirrorPagePath = path.join(rootDir, 'src/app/mirror/page.tsx');
    const content = fs.readFileSync(mirrorPagePath, 'utf-8');

    it('2.1: Page has digital-studio-header with telemetry HUD badges', () => {
      assert.ok(content.includes('data-testid="digital-studio-page"'), 'Must have root container testid');
      assert.ok(content.includes('data-testid="digital-studio-header"'), 'Must have header testid');
      assert.ok(content.includes('Target Track'), 'HUD must display Target Track');
      assert.ok(content.includes('Career DNA'), 'HUD must display Career DNA');
      assert.ok(content.includes('ATS Standard'), 'HUD must display ATS Standard');
    });

    it('2.2: Dual-Pillar master switcher contains Pillar 1 (ATS Resume & Studio)', () => {
      assert.ok(content.includes('data-testid="tab-career-builder"'), 'Must have testid for Pillar 1');
      assert.ok(content.includes('ATS Resume & Studio'), 'Pillar 1 must be titled ATS Resume & Studio');
      // Children of Pillar 1 in user diagram
      assert.ok(
        content.includes('Live Resume Builder & Harvard Template'),
        'Pillar 1 must feature Live Resume Builder & Harvard Template'
      );
      assert.ok(
        content.includes('ATS Keyword Matcher & Role Fit Scoring'),
        'Pillar 1 must feature ATS Keyword Matcher & Role Fit Scoring'
      );
    });

    it('2.3: Dual-Pillar master switcher contains Pillar 2 (Digital Career Twin & Skill Gaps)', () => {
      assert.ok(content.includes('data-testid="tab-digital-twin"'), 'Must have testid for Pillar 2');
      assert.ok(content.includes('Digital Career Twin & Skill Gaps'), 'Pillar 2 must be titled Digital Career Twin & Skill Gaps');
      // Children of Pillar 2 in user diagram
      assert.ok(
        content.includes('Competency Twin Radar (Current vs Target)'),
        'Pillar 2 must feature Competency Twin Radar'
      );
      assert.ok(
        content.includes('Consolidated Skill Gaps & Recommended Quests'),
        'Pillar 2 must feature Consolidated Skill Gaps & Recommended Quests'
      );
    });

    it('2.4: Sub-tabs and view mountings exist for both engines', () => {
      assert.ok(content.includes('data-testid="subtab-twin-radar"'), 'Must have subtab for twin radar');
      assert.ok(content.includes('data-testid="subtab-skill-gaps"'), 'Must have subtab for skill gaps');
      assert.ok(content.includes('data-testid="tab-growth-roadmap"'), 'Must preserve tab-growth-roadmap for backwards compatibility');
      assert.ok(content.includes('data-testid="mirror-view-career-builder"'), 'Must mount CareerBuilderPage view');
      assert.ok(content.includes('data-testid="mirror-view-learning-twin"'), 'Must mount LearningPage twin view');
      assert.ok(content.includes('data-testid="mirror-view-learning-roadmap"'), 'Must mount LearningPage roadmap view');
    });

    it('2.5: High quality CSS styling, keyframes and motion transitions are present', () => {
      assert.ok(content.includes('@keyframes studioFadeInUp'), 'Must include studioFadeInUp animation');
      assert.ok(content.includes('backdropFilter'), 'Must include glassmorphism blur');
      assert.ok(content.includes('studio-card-btn'), 'Must include interactive card button class');
    });
  });

  describe('3. Route Routing & Active State Intelligence', () => {
    it('3.1: isPathActive highlights Digital Studio across /mirror and deep aliases', () => {
      assert.ok(isPathActive('/mirror', '/mirror'), '/mirror activates /mirror');
      assert.ok(isPathActive('/mirror?tab=career-builder', '/mirror'), 'query params activate /mirror');
      assert.ok(isPathActive('/mirror?tab=twin', '/mirror'), 'twin query param activates /mirror');
      assert.ok(isPathActive('/career-builder', '/mirror'), 'legacy /career-builder activates /mirror');
      assert.ok(isPathActive('/career_builder', '/mirror'), 'legacy snake_case activates /mirror');
      assert.ok(isPathActive('/learning', '/mirror'), 'legacy /learning activates /mirror');
    });
  });
});
