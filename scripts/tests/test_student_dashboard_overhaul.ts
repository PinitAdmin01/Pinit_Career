import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../..');

test('Task 1 Verification: Student Dashboard Header Removals and Cleanup', () => {
  const hudPath = path.join(ROOT, 'src/components/student/dashboard/DashboardHeaderHUD.tsx');
  const hudCode = fs.readFileSync(hudPath, 'utf8');

  // Verify removed items from HUD
  assert.ok(!hudCode.includes('CAMPUS CAREER COMMAND COCKPIT'), 'CAMPUS CAREER COMMAND COCKPIT must be removed');
  assert.ok(!hudCode.includes('₹6.5 - ₹12.0 LPA'), '₹6.5 - ₹12.0 LPA must be removed');
  assert.ok(!hudCode.includes('Placement Readiness Index'), 'Placement Readiness Index must be removed');
  assert.ok(!hudCode.includes('STATUS:'), 'STATUS: must be removed');
  assert.ok(!hudCode.includes('9-Month Accelerated Curriculum'), '9-Month Accelerated Curriculum must be removed');
  assert.ok(!hudCode.includes('Zoho'), 'Zoho and company carousel must be removed');
  assert.ok(!hudCode.includes('COMPANY_SEEDS'), 'COMPANY_SEEDS must be removed');
  assert.ok(!hudCode.includes('Verified:'), 'Verified: count must be removed');
  assert.ok(!hudCode.includes('Demonstrated:'), 'Demonstrated: count must be removed');
  assert.ok(!hudCode.includes('Claimed:'), 'Claimed: count must be removed');
  assert.ok(!hudCode.includes('Skill Passport ➔') && !hudCode.includes('Skill Passport →'), 'Skill Passport link must be removed');

  // Verify Dashboard page removed screenshot 2, 3, 4
  const pagePath = path.join(ROOT, 'src/app/dashboard/page.tsx');
  const pageCode = fs.readFileSync(pagePath, 'utf8');
  assert.ok(!pageCode.includes('<DashboardStatsRow'), 'DashboardStatsRow must be removed from Dashboard page');
  assert.ok(!pageCode.includes('<DashboardMissionsPanel'), 'DashboardMissionsPanel must be removed from Dashboard page');
});

test('Task 2 Verification: Heatmap relocated to Student Profile Activity tab', () => {
  // Check LearningHeatmapCard exists
  const heatmapPath = path.join(ROOT, 'src/components/student/dashboard/LearningHeatmapCard.tsx');
  assert.ok(fs.existsSync(heatmapPath), 'LearningHeatmapCard.tsx must exist');
  const heatmapCode = fs.readFileSync(heatmapPath, 'utf8');
  assert.ok(heatmapCode.includes('84-Day Consistency Grid'), 'LearningHeatmapCard must contain 84-day grid');

  // Check ActivityTab.tsx includes LearningHeatmapCard
  const activityTabPath = path.join(ROOT, 'src/app/profile/tabs/ActivityTab.tsx');
  const activityCode = fs.readFileSync(activityTabPath, 'utf8');
  assert.ok(activityCode.includes('LearningHeatmapCard'), 'ActivityTab must import and render LearningHeatmapCard');

  // Check DashboardBentoGrid no longer duplicates the 84-day heatmap
  const bentoPath = path.join(ROOT, 'src/components/student/dashboard/DashboardBentoGrid.tsx');
  const bentoCode = fs.readFileSync(bentoPath, 'utf8');
  assert.ok(!bentoCode.includes('84-Day Consistency Grid'), 'DashboardBentoGrid must NOT contain 84-day heatmap');
});

test('Task 3 Verification: Auto Attendance, Top Trust Button, Dynamic Greetings & Concise WhatToDoToday', () => {
  const hudPath = path.join(ROOT, 'src/components/student/dashboard/DashboardHeaderHUD.tsx');
  const hudCode = fs.readFileSync(hudPath, 'utf8');

  // Top Trust button
  assert.ok(hudCode.includes('href="/trust"'), 'Top Trust button must link to /trust');
  assert.ok(hudCode.includes('btn-trust-top'), 'Top Trust button must have testid');

  // Dynamic greeting logic
  assert.ok(hudCode.includes('pinit_last_dashboard_visit'), 'Must check last dashboard visit');
  assert.ok(hudCode.includes('daysSinceLast >= 2'), 'Must handle 2+ days absence dynamically');

  // Attendance marker auto check-in
  const attPath = path.join(ROOT, 'src/components/student/dashboard/DashboardAttendanceMarker.tsx');
  const attCode = fs.readFileSync(attPath, 'utf8');
  assert.ok(attCode.includes("Today's Attendance Recorded") || attCode.includes("Today&apos;s Attendance Recorded"), 'Must show Today Attendance Recorded');
  assert.ok(attCode.includes('Auto-Recorded'), 'Must indicate Auto-Recorded');
  assert.ok(attCode.includes('markDailyCheckIn'), 'Must auto-trigger markDailyCheckIn');

  // WhatToDoToday concise dynamic actions
  const wtdPath = path.join(ROOT, 'src/components/ui/WhatToDoToday.tsx');
  const wtdCode = fs.readFileSync(wtdPath, 'utf8');
  assert.ok(wtdCode.includes('what-to-do-today-root'), 'WhatToDoToday must have root testid');
  assert.ok(wtdCode.includes('3 concise actions'), 'Must render concise actions subtitle');
});

test('Task 4 Verification: Career Course Progress Bar component and integration', () => {
  const barPath = path.join(ROOT, 'src/components/student/dashboard/CareerCourseProgressBar.tsx');
  assert.ok(fs.existsSync(barPath), 'CareerCourseProgressBar.tsx must exist');

  const barCode = fs.readFileSync(barPath, 'utf8');
  assert.ok(barCode.includes('timeline-pulse-node'), 'Must include pulse animation for active node');
  assert.ok(barCode.includes('Resume Incomplete Day'), 'Must include Resume Incomplete Day button');
  assert.ok(barCode.includes('btn-explore-career'), 'Must include Explore Career Programs button in empty state');

  // Check it is mounted in Dashboard page
  const pagePath = path.join(ROOT, 'src/app/dashboard/page.tsx');
  const pageCode = fs.readFileSync(pagePath, 'utf8');
  assert.ok(pageCode.includes('<CareerCourseProgressBar'), 'DashboardPage must mount CareerCourseProgressBar');
});
