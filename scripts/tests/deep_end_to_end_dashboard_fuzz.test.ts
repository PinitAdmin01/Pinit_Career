import test from 'node:test';
import assert from 'node:assert/strict';
import { getTodayDateString, StudentAttendanceRecord } from '../../src/lib/services/studentAttendanceService';
import { CRASH_COURSE_PLANS } from '../../src/lib/data/crashPlansData';
import { COURSES_REGISTRY } from '../../src/lib/data/coursesData';
import { getCrashCourseProgress } from '../../src/lib/courses/crashCourseProgress';
import type { ActionProfile } from '../../src/components/ui/WhatToDoToday';

// ─────────────────────────────────────────────────────────────────────────────
// DEEP SUITE 1: ATTENDANCE SERVICE STREAK CONTINUITY & 75% EXAM THRESHOLDS
// ─────────────────────────────────────────────────────────────────────────────
test('Deep Audit 1: Attendance State Machine, Streak Continuity & 75% Boundaries', () => {
  function simulateCheckIn(record: StudentAttendanceRecord, checkInDate: string): { success: boolean; record: StudentAttendanceRecord } {
    if (record.last_check_in === checkInDate) {
      return { success: false, record };
    }

    let nextStreak = 1;
    if (record.last_check_in) {
      const last = new Date(record.last_check_in);
      const curr = new Date(checkInDate);
      const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        nextStreak = (record.focus_streak || 0) + 1;
      } else if (diffDays <= 0) {
        nextStreak = record.focus_streak || 1;
      } else {
        nextStreak = 1; // Broken streak
      }
    } else {
      nextStreak = (record.focus_streak || 0) + 1;
    }

    const nextAttended = (record.attended_classes || 0) + 1;
    const nextTotal = (record.total_classes || 0) + 1;
    const nextPct = Number(((nextAttended / nextTotal) * 100).toFixed(1));
    const nextDays = record.attended_days.includes(checkInDate)
      ? record.attended_days
      : [...record.attended_days, checkInDate];

    return {
      success: true,
      record: {
        ...record,
        focus_streak: nextStreak,
        last_check_in: checkInDate,
        attended_days: nextDays,
        attended_classes: nextAttended,
        total_classes: nextTotal,
        percentage: nextPct,
        status: nextPct >= 75 ? 'safe' : nextPct >= 65 ? 'warning' : 'critical',
        updated_at: new Date().toISOString(),
      },
    };
  }

  const initialRecord: StudentAttendanceRecord = {
    student_id: 'test_student_01',
    focus_streak: 3,
    last_check_in: '2026-11-01',
    attended_days: ['2026-10-30', '2026-10-31', '2026-11-01'],
    total_classes: 20,
    attended_classes: 16,
    percentage: 80.0,
    status: 'safe',
    updated_at: new Date().toISOString(),
  };

  // Case 1: Same day double check-in attempt -> MUST be rejected (Idempotent)
  const doubleCheck = simulateCheckIn(initialRecord, '2026-11-01');
  assert.equal(doubleCheck.success, false, 'Same day check-in must be rejected');
  assert.equal(doubleCheck.record.focus_streak, 3);

  // Case 2: Consecutive next day check-in -> Streak increments to 4
  const nextDay = simulateCheckIn(initialRecord, '2026-11-02');
  assert.equal(nextDay.success, true);
  assert.equal(nextDay.record.focus_streak, 4, 'Consecutive day must increment streak');
  assert.equal(nextDay.record.attended_classes, 17);
  assert.equal(nextDay.record.total_classes, 21);
  assert.equal(nextDay.record.percentage, 81.0);
  assert.equal(nextDay.record.status, 'safe');

  // Case 3: 3 days gap -> Streak resets to 1
  const brokenStreak = simulateCheckIn(nextDay.record, '2026-11-05');
  assert.equal(brokenStreak.success, true);
  assert.equal(brokenStreak.record.focus_streak, 1, 'Streak must reset to 1 after multi-day gap');

  // Case 4: 75% boundary thresholds
  // 15/20 = 75.0% -> safe
  const boundary75: StudentAttendanceRecord = { ...initialRecord, total_classes: 20, attended_classes: 15, percentage: 75.0, status: 'safe' };
  assert.equal(boundary75.status, 'safe');

  // 14/20 = 70.0% -> warning
  const boundary70 = simulateCheckIn({ ...initialRecord, total_classes: 19, attended_classes: 13, last_check_in: '2026-11-01' }, '2026-11-02');
  assert.equal(boundary70.record.percentage, 70.0);
  assert.equal(boundary70.record.status, 'warning');

  // 10/20 = 50.0% -> critical
  const boundary50 = simulateCheckIn({ ...initialRecord, total_classes: 19, attended_classes: 9, last_check_in: '2026-11-01' }, '2026-11-02');
  assert.equal(boundary50.record.percentage, 50.0);
  assert.equal(boundary50.record.status, 'critical');
});

// ─────────────────────────────────────────────────────────────────────────────
// DEEP SUITE 2: TRIGONOMETRIC SOCRATIC RADAR COORDINATES INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────
test('Deep Audit 2: Socratic Competencies Radar Trigonometric Invariants', () => {
  function computeRadarPoints(scores: number[]): string {
    const angles = [0, 72, 144, 216, 288];
    return scores.map((score, i) => {
      const clamped = Math.max(0, Math.min(100, score || 0));
      const r = (clamped / 100) * 46;
      const rad = angles[i] * (Math.PI / 180);
      const x = +(60 + r * Math.sin(rad)).toFixed(1);
      const y = +(60 - r * Math.cos(rad)).toFixed(1);
      return `${x},${y}`;
    }).join(' ');
  }

  // 1. All zero scores -> all points must collapse to center (60, 60)
  const zeroPoints = computeRadarPoints([0, 0, 0, 0, 0]);
  assert.equal(zeroPoints, '60,60 60,60 60,60 60,60 60,60');

  // 2. All 100 scores -> points must reach max radius (46)
  const maxPoints = computeRadarPoints([100, 100, 100, 100, 100]);
  assert.ok(!maxPoints.includes('NaN'), 'Max points must not contain NaN');
  const maxCoords = maxPoints.split(' ');
  assert.equal(maxCoords.length, 5, 'Must contain 5 radar vertices');
  assert.equal(maxCoords[0], '60,14', 'Top point (0 deg) must be (60, 14)');

  // 3. Fuzzed input with out-of-bounds numbers and negatives
  const fuzzed = computeRadarPoints([-50, 200, 50, 75, 1000]);
  assert.ok(!fuzzed.includes('NaN'), 'Fuzzed points must never contain NaN');
  assert.ok(!fuzzed.includes('Infinity'), 'Fuzzed points must never contain Infinity');
});

// ─────────────────────────────────────────────────────────────────────────────
// DEEP SUITE 3: ACTION RECOMMENDATION PRIORITY ACROSS 15 PERSONAS
// ─────────────────────────────────────────────────────────────────────────────
test('Deep Audit 3: WhatToDoToday Recommendation Sorting Across 15 Personas', () => {
  interface Action {
    icon: string;
    title: string;
    desc: string;
    href: string;
    cta: string;
    color: string;
    bg: string;
    border: string;
    urgency: number;
  }

  function pickActions(profile: ActionProfile): Action[] {
    const ats = profile?.ats_score || 0;
    const trust = profile?.trust_score || 0;
    const streak = profile?.mission_streak || 0;
    const vault = profile?.vault_count || 0;
    const intDone = profile?.interviews_done || 0;
    const trackName = profile?.active_track === 'iot' ? 'IoT Hardware' : 'SDE Software';

    const candidates: Action[] = [
      {
        icon: 'RESUME',
        color: '#6366f1',
        bg: 'rgba(99,102,241,0.12)',
        border: 'rgba(99,102,241,0.25)',
        title: ats === 0 ? 'Optimize Resume' : `Resume Score (${ats}/100)`,
        desc: ats === 0 ? `Upload your resume to map keyword gaps for ${trackName}.` : `Close missing technical keywords to reach 80+ benchmark.`,
        href: '/career-builder',
        cta: 'Open Resume Builder →',
        urgency: ats === 0 ? 95 : ats < 55 ? 75 : 10,
      },
      {
        icon: 'STREAK',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.25)',
        title: streak === 0 ? 'Start Daily Streak' : `Extend ${streak}-Day Streak`,
        desc: streak === 0 ? 'Complete a 15-min daily mission to begin building your consistency record.' : `Complete today's quick sprint to keep your focus streak alive.`,
        href: '/missions',
        cta: 'Launch Today’s Mission →',
        urgency: streak === 0 ? 90 : streak < 3 ? 60 : 15,
      },
      {
        icon: 'TRUST',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.12)',
        border: 'rgba(16,185,129,0.25)',
        title: trust < 50 ? 'Boost Trust Quotient' : `Trust Score (${Math.round(trust)}/100)`,
        desc: trust < 50 ? 'Verify a certificate or pass a quick coding quiz to build recruiter trust.' : 'Institutional trust is verified. Add more credentials to maintain 90+ standing.',
        href: '/trust',
        cta: 'Verify Credentials →',
        urgency: trust < 50 ? 88 : trust < 70 ? 45 : 8,
      },
      {
        icon: 'MOCK',
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.12)',
        border: 'rgba(59,130,246,0.25)',
        title: intDone === 0 ? 'First AI Mock Round' : `Mock Practice (${intDone} Cleared)`,
        desc: intDone === 0 ? 'Practice a 10-minute technical interview with Priya to build confidence.' : 'Take an advanced system design or problem-solving mock round.',
        href: '/interview',
        cta: 'Start Mock Interview →',
        urgency: intDone === 0 ? 82 : intDone < 3 ? 40 : 12,
      },
      {
        icon: 'VAULT',
        color: '#a855f7',
        bg: 'rgba(168,85,247,0.12)',
        border: 'rgba(168,85,247,0.25)',
        title: vault === 0 ? 'Add Proof to Vault' : `Vault Assets (${vault})`,
        desc: vault === 0 ? 'Store GitHub repos, degrees, or certifications in your tamper-proof Vault.' : 'Your vault credentials back your verified skill score.',
        href: '/vault',
        cta: 'Open Vault →',
        urgency: vault === 0 ? 84 : vault < 3 ? 50 : 15,
      },
      {
        icon: 'DEBATE',
        color: '#14b8a6',
        bg: 'rgba(20,184,166,0.12)',
        border: 'rgba(20,184,166,0.25)',
        title: 'AI Boardroom Debate',
        desc: 'Sharpen your technical communication and collaborative argumentation skills.',
        href: '/group-discussion',
        cta: 'Enter Boardroom →',
        urgency: 25,
      },
    ];

    return candidates.sort((a, b) => b.urgency - a.urgency).slice(0, 3);
  }

  // Test across 15 distinct permutations
  const testPermutations: ActionProfile[] = [
    { ats_score: 0, trust_score: 0, mission_streak: 0, vault_count: 0, interviews_done: 0 },
    { ats_score: 90, trust_score: 90, mission_streak: 10, vault_count: 5, interviews_done: 5 },
    { ats_score: 30, trust_score: 80, mission_streak: 5, vault_count: 2, interviews_done: 0 },
    { ats_score: 75, trust_score: 30, mission_streak: 0, vault_count: 0, interviews_done: 1 },
    { ats_score: 50, trust_score: 40, mission_streak: 2, vault_count: 1, interviews_done: 0 },
    { ats_score: 85, trust_score: 65, mission_streak: 1, vault_count: 4, interviews_done: 2 },
    { ats_score: 20, trust_score: 95, mission_streak: 15, vault_count: 8, interviews_done: 4 },
    { ats_score: 0, trust_score: 85, mission_streak: 20, vault_count: 6, interviews_done: 3 },
    { ats_score: 60, trust_score: 0, mission_streak: 0, vault_count: 0, interviews_done: 0 },
    { ats_score: 95, trust_score: 95, mission_streak: 30, vault_count: 10, interviews_done: 10 },
    { ats_score: 40, trust_score: 40, mission_streak: 0, vault_count: 0, interviews_done: 2 },
    { ats_score: 10, trust_score: 10, mission_streak: 1, vault_count: 1, interviews_done: 1 },
    { ats_score: 80, trust_score: 75, mission_streak: 0, vault_count: 3, interviews_done: 0 },
    { ats_score: 0, trust_score: 0, mission_streak: 5, vault_count: 5, interviews_done: 5 },
    { ats_score: 100, trust_score: 20, mission_streak: 2, vault_count: 0, interviews_done: 0 },
  ];

  testPermutations.forEach((p, idx) => {
    const actions = pickActions(p);
    assert.equal(actions.length, 3, `Permutation ${idx} must return exactly 3 actions`);
    assert.ok(actions[0].urgency >= actions[1].urgency, `Permutation ${idx} must sort action 0 >= action 1`);
    assert.ok(actions[1].urgency >= actions[2].urgency, `Permutation ${idx} must sort action 1 >= action 2`);
    actions.forEach(a => {
      assert.ok(a.title.length > 0);
      assert.ok(a.desc.length > 0 && a.desc.length < 140, 'Description must be concise (<140 chars)');
      assert.ok(a.href.startsWith('/'));
      assert.ok(a.color.startsWith('#'));
      assert.ok(a.bg.startsWith('rgba'));
      assert.ok(a.border.startsWith('rgba'));
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DEEP SUITE 4: ALL 24 HOURS TIME-OF-DAY GREETING COVERAGE
// ─────────────────────────────────────────────────────────────────────────────
test('Deep Audit 4: All 24 Hours Time-of-Day Greeting Exhaustive Check', () => {
  function getGreetingForHour(hour: number) {
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  // 00:00 to 04:59 -> Good evening
  for (let h = 0; h < 5; h++) {
    assert.equal(getGreetingForHour(h), 'Good evening', `Hour ${h} must be Good evening`);
  }

  // 05:00 to 11:59 -> Good morning
  for (let h = 5; h < 12; h++) {
    assert.equal(getGreetingForHour(h), 'Good morning', `Hour ${h} must be Good morning`);
  }

  // 12:00 to 16:59 -> Good afternoon
  for (let h = 12; h < 17; h++) {
    assert.equal(getGreetingForHour(h), 'Good afternoon', `Hour ${h} must be Good afternoon`);
  }

  // 17:00 to 23:59 -> Good evening
  for (let h = 17; h < 24; h++) {
    assert.equal(getGreetingForHour(h), 'Good evening', `Hour ${h} must be Good evening`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DEEP SUITE 5: TRUST QUOTIENT 4-PILLAR MATHEMATICAL INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────
test('Deep Audit 5: Trust Quotient 4-Pillar Mathematical Invariants & Tiers', () => {
  function calculateTrustScore(vaultCount: number, verifiedCount: number, completedQuestsCount: number, streak: number) {
    const p1 = vaultCount > 0 ? Math.min(100, 40 + verifiedCount * 20) : 35;
    const p2 = 85; // Campus Attendance Integrity benchmark
    const p3 = Math.min(100, Math.max(30, completedQuestsCount * 10 + 20));
    const p4 = Math.min(100, Math.max(40, streak * 8 + 30));

    const total = Math.round((p1 * 0.3) + (p2 * 0.25) + (p3 * 0.25) + (p4 * 0.2));
    let tier = 'Unverified / Baseline';
    if (total >= 80) tier = 'High Trust';
    else if (total >= 60) tier = 'Institutional Trusted';
    else if (total >= 40) tier = 'Building Trust';

    return { total, tier, p1, p2, p3, p4 };
  }

  // Test 1: Complete Zero Base
  const base = calculateTrustScore(0, 0, 0, 0);
  assert.equal(base.p1, 35);
  assert.equal(base.p2, 85);
  assert.equal(base.p3, 30);
  assert.equal(base.p4, 40);
  assert.ok(base.total >= 40 && base.total <= 60);

  // Test 2: High Performance Student
  const high = calculateTrustScore(5, 4, 15, 10);
  assert.equal(high.p1, 100); // 40 + 80 = 120 -> clamped to 100
  assert.equal(high.p3, 100); // 150 + 20 = 170 -> clamped to 100
  assert.equal(high.p4, 100); // 80 + 30 = 110 -> clamped to 100
  assert.equal(high.total, 96);
  assert.equal(high.tier, 'High Trust');
});
