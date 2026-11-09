import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const leaderboardPagePath = path.join(ROOT, 'src/app/leaderboard/page.tsx');
const leaderboardPage = fs.readFileSync(leaderboardPagePath, 'utf8');

test('TASK 2 AUDIT: Redundant top lines are purged to free vertical space', () => {
  assert.strictEqual(
    leaderboardPage.includes('7-Day Duolingo-Style Sprints · Top 10% Promote'),
    false,
    'Redundant top sprint subtitle must be removed'
  );
  assert.strictEqual(
    leaderboardPage.includes('<h1 style={{ margin: 0, fontSize: 26.5'),
    false,
    'Bulky top h1 header bar must be removed to free up 120px+ of vertical space'
  );
});

test('TASK 2 AUDIT: Cockpit Telemetry banner is elevated to the top with data-testid', () => {
  assert.ok(
    leaderboardPage.includes('data-testid="cockpit-telemetry-hud"'),
    'Cockpit Telemetry HUD must have data-testid="cockpit-telemetry-hud"'
  );

  const returnIndex = leaderboardPage.indexOf('return (');
  const cockpitIndex = leaderboardPage.indexOf('data-testid="cockpit-telemetry-hud"');
  const tabsIndex = leaderboardPage.indexOf('subtab-${tab.id}');

  assert.ok(cockpitIndex > returnIndex, 'Cockpit must be inside the return JSX');
  assert.ok(tabsIndex > 0, 'Subtabs must exist in page');
  assert.ok(cockpitIndex < tabsIndex, 'Cockpit must be elevated ABOVE the sub-tabs at the top of the page');
});

test('TASK 2 AUDIT: Cockpit Telemetry HUD is scaled down by ~25% for high-density SaaS elegance', () => {
  assert.ok(
    leaderboardPage.includes("padding: '12px 18px'"),
    'Outer container padding must be reduced from 20px 24px to 12px 18px'
  );
  assert.ok(
    leaderboardPage.includes('borderRadius: 14'),
    'Outer border-radius must be refined to 14px'
  );
  assert.ok(
    leaderboardPage.includes('fontSize: 20'),
    'Rank number must be scaled down from 26.5px to 20px'
  );
  assert.ok(
    leaderboardPage.includes('fontSize: 18'),
    'Countdown timer font must be scaled down from 24px to 18px'
  );
  assert.ok(
    leaderboardPage.includes('fontSize: 16.5'),
    'League title font must be scaled down from 22px to 16.5px'
  );
});

test('TASK 2 AUDIT: Quick action buttons are integrated into the Cockpit HUD without layout bloat', () => {
  assert.ok(
    leaderboardPage.includes('⚔️ 1v1 Battle Arena'),
    'Must include 1v1 Battle Arena link'
  );
  assert.ok(
    leaderboardPage.includes('Pins Wallet'),
    'Must include Pins Wallet link'
  );
  assert.ok(
    leaderboardPage.includes('Card 4: Quick Telemetry Actions'),
    'Action buttons must be housed in dedicated telemetry column'
  );
});
