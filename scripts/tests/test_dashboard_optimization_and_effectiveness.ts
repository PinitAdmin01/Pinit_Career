import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../..');

test('Optimization 1: DashboardKpiStrip exists and contains all 5 key student metrics', () => {
  const kpiPath = path.join(ROOT, 'src/components/student/dashboard/DashboardKpiStrip.tsx');
  assert.ok(fs.existsSync(kpiPath), 'DashboardKpiStrip.tsx must exist');

  const code = fs.readFileSync(kpiPath, 'utf8');
  assert.ok(code.includes('FOCUS STREAK'), 'Must track Focus Streak');
  assert.ok(code.includes('WALLET BALANCE'), 'Must track Wallet Balance');
  assert.ok(code.includes('STUDENT MASTERY'), 'Must track Mastery / Level');
  assert.ok(code.includes('TRUST QUOTIENT'), 'Must track Trust Quotient');
  assert.ok(code.includes('CAMPUS ATTENDANCE'), 'Must track Campus Attendance');

  // Verify responsive testid
  assert.ok(code.includes('dashboard-kpi-strip'), 'Must include root testid');
});

test('Optimization 2: Hologram battery/CPU performance throttling', () => {
  const hudPath = path.join(ROOT, 'src/components/student/dashboard/DashboardHeaderHUD.tsx');
  const code = fs.readFileSync(hudPath, 'utf8');

  // Must use IntersectionObserver to pause off-screen canvas loops
  assert.ok(code.includes('IntersectionObserver'), 'Hologram must implement IntersectionObserver');
  assert.ok(code.includes('visibilitychange'), 'Hologram must handle visibilitychange to pause on hidden tab');
  assert.ok(code.includes('Math.min(window.devicePixelRatio || 1, 2)'), 'Must clamp devicePixelRatio to 2 to prevent GPU memory bloat');
});

test('Optimization 3: Career Course Progress Bar graduation/completion handling', () => {
  const barPath = path.join(ROOT, 'src/components/student/dashboard/CareerCourseProgressBar.tsx');
  const code = fs.readFileSync(barPath, 'utf8');

  // Must handle 100% completion cleanly without displaying an incomplete day resume button
  assert.ok(code.includes('isAllComplete'), 'Must evaluate isAllComplete state');
  assert.ok(code.includes('View Capstone & Certificate'), 'Must offer Capstone & Certificate viewing on completion');
  assert.ok(code.includes('!isAllComplete &&'), 'Node glow must not pulse frantically when course is 100% complete');
});

test('Optimization 4: DashboardPage memoization and KPI integration', () => {
  const pagePath = path.join(ROOT, 'src/app/dashboard/page.tsx');
  const code = fs.readFileSync(pagePath, 'utf8');

  assert.ok(code.includes('<DashboardKpiStrip'), 'DashboardPage must mount DashboardKpiStrip');
  assert.ok(code.includes('memoizedProfileForActions'), 'Must use memoizedProfileForActions');
  assert.ok(code.includes('activeStageIndex = useMemo'), 'activeStageIndex must be memoized with useMemo');
});
