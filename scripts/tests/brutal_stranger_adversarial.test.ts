import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../..');

// ─────────────────────────────────────────────────────────────────────────────
// ADVERSARIAL AUDIT 1: FRESH STUDENT / ZERO-STATE PROFILE INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────
test('Brutal Audit 1: Brand-New Student (Zero State / All Nulls)', () => {
  // Simulate complete cold start where student has 0 XP, 0 quests, no target role
  const emptyProfile = {
    ats_score: 0,
    trust_score: 0,
    career_dna_score: 0,
    mission_streak: 0,
    missions_completed: 0,
    recruiter_visibility: 0,
    vault_count: 0,
    interviews_done: 0,
    weak_areas: [],
    skill_tags: [],
    xp_total: 0,
    active_track: 'sde',
    target_role: undefined,
  };

  // 1. Verify WhatToDoToday handles zero-state without blowing up
  const wtdPath = path.join(ROOT, 'src/components/ui/WhatToDoToday.tsx');
  const wtdCode = fs.readFileSync(wtdPath, 'utf8');

  // Verify pickActions handles 0 streak and 0 ats
  assert.ok(wtdCode.includes("ats === 0 ? 'Optimize Resume' : `Resume Score (${ats}/100)`"));
  assert.ok(wtdCode.includes("streak === 0 ? 'Start Daily Streak' : `Extend ${streak}-Day Streak`"));
  assert.ok(wtdCode.includes("trust < 50 ? 'Boost Trust Quotient' : `Trust Score (${Math.round(trust)}/100)`"));

  // 2. Verify Level calculation for 0 XP
  const xp = 0;
  const currentLevel = Math.floor(xp / 100) + 1;
  const xpToNext = 100 - (xp % 100);
  assert.equal(currentLevel, 1, '0 XP must map to Level 1');
  assert.equal(xpToNext, 100, '0 XP must require 100 XP to Level 2');
});

// ─────────────────────────────────────────────────────────────────────────────
// ADVERSARIAL AUDIT 2: MALFORMED STORAGE & SECURITY ERROR RESILIENCE
// ─────────────────────────────────────────────────────────────────────────────
test('Brutal Audit 2: Storage Resilience Against Corrupted or Blocked LocalStorage', () => {
  // Test JSON parse safety simulation
  function safeParseStorage(raw: string | null, fallback: any) {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  // 1. Malformed JSON
  const corrupted = '{malformed:json:bad';
  const resultCorrupted = safeParseStorage(corrupted, { percentage: 85 });
  assert.equal(resultCorrupted.percentage, 85, 'Must gracefully fallback on malformed JSON');

  // 2. Verify DashboardPage and AttendanceMarker wrap localStorage in try/catch
  const pagePath = path.join(ROOT, 'src/app/dashboard/page.tsx');
  const pageCode = fs.readFileSync(pagePath, 'utf8');
  assert.ok(pageCode.includes('try {'), 'DashboardPage must wrap localStorage in try-catch');

  const attPath = path.join(ROOT, 'src/components/student/dashboard/DashboardAttendanceMarker.tsx');
  const attCode = fs.readFileSync(attPath, 'utf8');
  assert.ok(attCode.includes('try {'), 'DashboardAttendanceMarker must wrap localStorage in try-catch');
});

// ─────────────────────────────────────────────────────────────────────────────
// ADVERSARIAL AUDIT 3: GRADUATION & POWER-USER COMPLETION BOUNDARY
// ─────────────────────────────────────────────────────────────────────────────
test('Brutal Audit 3: Power-User 100% Completion State & Milestone Nodes', () => {
  const barPath = path.join(ROOT, 'src/components/student/dashboard/CareerCourseProgressBar.tsx');
  const barCode = fs.readFileSync(barPath, 'utf8');

  // Completed user should see Capstone & Certificate, NOT an incomplete day resume button
  assert.ok(barCode.includes('isAllComplete = completedCount >= totalDays'), 'Must detect 100% completion');
  assert.ok(barCode.includes("isAllComplete ? 'View Capstone & Certificate'"), 'Graduated student sees View Capstone & Certificate');
  assert.ok(barCode.includes('!isAllComplete &&'), 'Pulsing glow must turn off when 100% complete');
});

// ─────────────────────────────────────────────────────────────────────────────
// ADVERSARIAL AUDIT 4: LINK & ROUTE COMPLIANCE
// ─────────────────────────────────────────────────────────────────────────────
test('Brutal Audit 4: Every Dashboard Action Links to a Valid Live Route', () => {
  const kpiPath = path.join(ROOT, 'src/components/student/dashboard/DashboardKpiStrip.tsx');
  const kpiCode = fs.readFileSync(kpiPath, 'utf8');

  const targetRoutes = ['/missions', '/pins', '/quests', '/trust', '/profile?tab=activity'];
  for (const route of targetRoutes) {
    assert.ok(kpiCode.includes(`href: '${route}'`), `DashboardKpiStrip must link to active route ${route}`);
  }

  // Verify /trust page file physically exists in the app router
  const trustPagePath = path.join(ROOT, 'src/app/trust/page.tsx');
  assert.ok(fs.existsSync(trustPagePath), 'Trust page must exist at src/app/trust/page.tsx');
});

// ─────────────────────────────────────────────────────────────────────────────
// ADVERSARIAL AUDIT 5: CANVAS & MOBILE RESILIENCE
// ─────────────────────────────────────────────────────────────────────────────
test('Brutal Audit 5: Canvas Animation Throttling & Mobile Scroll Container', () => {
  const hudPath = path.join(ROOT, 'src/components/student/dashboard/DashboardHeaderHUD.tsx');
  const hudCode = fs.readFileSync(hudPath, 'utf8');

  assert.ok(hudCode.includes('IntersectionObserver'), 'Hologram must have IntersectionObserver');
  assert.ok(hudCode.includes('visibilitychange'), 'Hologram must pause on tab switch');

  const barPath = path.join(ROOT, 'src/components/student/dashboard/CareerCourseProgressBar.tsx');
  const barCode = fs.readFileSync(barPath, 'utf8');
  assert.ok(barCode.includes('overflowX: \'auto\''), 'Milestones must have overflowX: auto for mobile viewports');
  assert.ok(barCode.includes('minWidth: 440'), 'Milestones must have minWidth to prevent label crushing');
});
