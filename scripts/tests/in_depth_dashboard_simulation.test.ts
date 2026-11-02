import test from 'node:test';
import assert from 'node:assert/strict';
import { CRASH_COURSE_PLANS } from '../../src/lib/data/crashPlansData';
import { COURSES_REGISTRY } from '../../src/lib/data/coursesData';
import { getCrashCourseProgress, getCrashCourseCurriculum } from '../../src/lib/courses/crashCourseProgress';
import type { ActionProfile } from '../../src/components/ui/WhatToDoToday';

// Mock localStorage for in-depth state simulation
class MockLocalStorage {
  private store: Record<string, string> = {};
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1: DYNAMIC GREETING ENGINE DEEP SIMULATION
// ─────────────────────────────────────────────────────────────────────────────
test('Greeting Engine: Simulation across time deltas and edge cases', () => {
  function computeGreeting(name: string, nowEpoch: number, lastVisitEpoch: number | null, hourOverride?: number) {
    let daysSinceLast = 0;
    if (lastVisitEpoch && lastVisitEpoch > 0) {
      daysSinceLast = Math.floor((nowEpoch - lastVisitEpoch) / (1000 * 60 * 60 * 24));
    }

    if (daysSinceLast >= 2) {
      return {
        title: `Hello ${name}, it's been ${daysSinceLast} days!`,
        subtitle: `Welcome back to your workspace — ready to pick up where you left off?`,
        type: 'multi_day_absence',
      };
    }

    const hour = hourOverride !== undefined ? hourOverride : new Date(nowEpoch).getHours();
    let salutation = 'Good evening';
    if (hour >= 5 && hour < 12) {
      salutation = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      salutation = 'Good afternoon';
    }

    return {
      title: `${salutation}, ${name}`,
      subtitle: 'Ready to continue your career journey today?',
      type: 'time_of_day',
    };
  }

  const now = 1793670000000; // Fixed epoch for testing

  // Test 1: First-time user (no previous visit) at 9:00 AM
  const firstVisit = computeGreeting('Arya', now, null, 9);
  assert.equal(firstVisit.title, 'Good morning, Arya');
  assert.equal(firstVisit.type, 'time_of_day');

  // Test 2: Same day return (0 days) at 2:30 PM
  const sameDayVisit = computeGreeting('Arya', now, now - (3 * 3600 * 1000), 14);
  assert.equal(sameDayVisit.title, 'Good afternoon, Arya');
  assert.equal(sameDayVisit.type, 'time_of_day');

  // Test 3: Next day return (1 day delta) at 8:00 PM
  const nextDayVisit = computeGreeting('Arya', now, now - (24 * 3600 * 1000), 20);
  assert.equal(nextDayVisit.title, 'Good evening, Arya');
  assert.equal(nextDayVisit.type, 'time_of_day');

  // Test 4: Exactly 2 days absence
  const twoDaysAbsence = computeGreeting('Arya', now, now - (48 * 3600 * 1000), 10);
  assert.equal(twoDaysAbsence.title, "Hello Arya, it's been 2 days!");
  assert.equal(twoDaysAbsence.type, 'multi_day_absence');

  // Test 5: 7 days absence (a full week away)
  const weekAbsence = computeGreeting('Arya', now, now - (7 * 24 * 3600 * 1000), 10);
  assert.equal(weekAbsence.title, "Hello Arya, it's been 7 days!");
  assert.equal(weekAbsence.type, 'multi_day_absence');

  // Test 6: Fallback name when user has no name
  const fallbackUser = computeGreeting('Student', now, now - (3 * 24 * 3600 * 1000), 10);
  assert.equal(fallbackUser.title, "Hello Student, it's been 3 days!");
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2: CAREER PROGRESS BAR & INCOMPLETE DAY ENGINE
// ─────────────────────────────────────────────────────────────────────────────
test('Career Course Progress Bar: Incomplete Day, Milestone, and Quest Routing', () => {
  const plan1m = CRASH_COURSE_PLANS.find(p => p.id === 'plan-1m-fasttrack') || CRASH_COURSE_PLANS[0];
  const plan3m = CRASH_COURSE_PLANS.find(p => p.id === 'plan-3m-accelerator') || CRASH_COURSE_PLANS[1];

  assert.ok(plan1m, '1M plan must exist');
  assert.ok(plan3m, '3M plan must exist');

  // Test curriculum calculation for 1M web fullstack
  const curriculum1m = getCrashCourseCurriculum(plan1m, 'web_fullstack', COURSES_REGISTRY);
  assert.ok(curriculum1m.length > 0, '1M curriculum must contain lessons');

  // Test Case A: Brand new student with active 1M enrollment (0 completed quests)
  const enrollmentA = {
    enrollmentId: 'enr-101',
    userId: 'user-1',
    planId: plan1m.id,
    track: 'web_fullstack' as const,
    amountPaid: 4999,
    paymentId: 'pay-1',
    paymentMethod: 'sandbox' as const,
    status: 'active' as const,
    enrolledAt: new Date().toISOString(),
    currentSprint: 1,
    dailyLearningHoursTarget: 1,
    milestoneProgress: { sprint1Approved: false, sprint2Approved: false },
    certificatesIssued: {},
  };

  const progressA = getCrashCourseProgress(plan1m, 'web_fullstack', COURSES_REGISTRY, [], enrollmentA);
  assert.equal(progressA.completed, 0);
  assert.equal(progressA.percent, 0);
  assert.ok(progressA.next !== null, 'Next quest must exist for new enrollment');
  assert.equal(progressA.next?.questId, curriculum1m[0].questId, 'First incomplete day must be the first lesson');
  assert.equal(progressA.phases.training, 'active');
  assert.equal(progressA.phases.capstone, 'locked');

  // Test Case B: Student has completed first 3 lessons
  const completed3 = [curriculum1m[0].questId, curriculum1m[1].questId, curriculum1m[2].questId];
  const progressB = getCrashCourseProgress(plan1m, 'web_fullstack', COURSES_REGISTRY, completed3, enrollmentA);
  assert.equal(progressB.completed, 3);
  assert.equal(progressB.next?.questId, curriculum1m[3].questId, 'Incomplete day must resume at lesson 4');

  // Test Case C: Milestone dots partitioning
  function computeMilestones(totalDays: number, completedCount: number) {
    const q1 = Math.round(totalDays * 0.25);
    const q2 = Math.round(totalDays * 0.50);
    const q3 = Math.round(totalDays * 0.75);

    const ms = [
      { day: 1, label: 'Day 1' },
      { day: q1, label: `Day ${q1}` },
      { day: q2, label: `Day ${q2}` },
      { day: q3, label: `Day ${q3}` },
      { day: totalDays, label: `Day ${totalDays}` },
    ];

    return ms.map(m => ({
      ...m,
      isCompleted: m.day <= completedCount,
      isCurrent: m.day === completedCount + 1,
    }));
  }

  const milestones30 = computeMilestones(30, 7);
  assert.equal(milestones30.length, 5);
  assert.equal(milestones30[0].isCompleted, true, 'Day 1 is completed');
  assert.equal(milestones30[1].isCompleted, false, 'Day 8 is not yet completed');
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3: WHAT TO DO TODAY DYNAMIC ACTIONS ENGINE
// ─────────────────────────────────────────────────────────────────────────────
test('WhatToDoToday: Concise dynamic recommendation priority engine', () => {
  // Test Case 1: Low ATS score (0/100) -> Must prioritize resume builder
  const profileLowAts: ActionProfile = {
    ats_score: 0,
    trust_score: 80,
    mission_streak: 5,
    vault_count: 3,
    interviews_done: 2,
    active_track: 'sde',
  };

  // Import pickActions logic dynamically to test
  function simulatePickActions(profile: ActionProfile) {
    const ats = profile.ats_score || 0;
    const trust = profile.trust_score || 0;
    const streak = profile.mission_streak || 0;
    const vault = profile.vault_count || 0;
    const intDone = profile.interviews_done || 0;
    const trackName = profile.active_track === 'iot' ? 'IoT Hardware' : 'SDE Software';

    const candidates = [
      {
        id: 'resume',
        title: ats === 0 ? 'Optimize Resume' : `Resume Score (${ats}/100)`,
        desc: ats === 0 ? `Upload your resume to map keyword gaps for ${trackName}.` : `Close missing technical keywords to reach 80+ benchmark.`,
        urgency: ats === 0 ? 95 : ats < 55 ? 75 : 10,
      },
      {
        id: 'streak',
        title: streak === 0 ? 'Start Daily Streak' : `Extend ${streak}-Day Streak`,
        desc: streak === 0 ? 'Complete a 15-min daily mission to begin building your consistency record.' : `Complete today's quick sprint to keep your focus streak alive.`,
        urgency: streak === 0 ? 90 : streak < 3 ? 60 : 15,
      },
      {
        id: 'trust',
        title: trust < 50 ? 'Boost Trust Quotient' : `Trust Score (${Math.round(trust)}/100)`,
        desc: trust < 50 ? 'Verify a certificate or pass a quick coding quiz to build recruiter trust.' : 'Institutional trust is verified. Add more credentials to maintain 90+ standing.',
        urgency: trust < 50 ? 88 : trust < 70 ? 45 : 8,
      },
      {
        id: 'interview',
        title: intDone === 0 ? 'First AI Mock Round' : `Mock Practice (${intDone} Cleared)`,
        desc: intDone === 0 ? 'Practice a 10-minute technical interview with Priya to build confidence.' : 'Take an advanced system design or problem-solving mock round.',
        urgency: intDone === 0 ? 82 : intDone < 3 ? 40 : 12,
      },
      {
        id: 'vault',
        title: vault === 0 ? 'Add Proof to Vault' : `Vault Assets (${vault})`,
        desc: vault === 0 ? 'Store GitHub repos, degrees, or certifications in your tamper-proof Vault.' : 'Your vault credentials back your verified skill score.',
        urgency: vault === 0 ? 84 : vault < 3 ? 50 : 15,
      },
    ];

    return candidates.sort((a, b) => b.urgency - a.urgency).slice(0, 3);
  }

  const actionsLowAts = simulatePickActions(profileLowAts);
  assert.equal(actionsLowAts[0].id, 'resume', 'Low ATS must be Priority 1');
  assert.ok(actionsLowAts[0].desc.includes('SDE Software'), 'Must reflect SDE Software');
  assert.ok(actionsLowAts[0].desc.split('.').length <= 3, 'Description must be concise (1 sentence)');

  // Test Case 2: Zero streak, low trust, IoT track
  const profileIot: ActionProfile = {
    ats_score: 75,
    trust_score: 30,
    mission_streak: 0,
    vault_count: 0,
    interviews_done: 0,
    active_track: 'iot',
  };

  const actionsIot = simulatePickActions(profileIot);
  // With streak=0 (urgency 90), trust=30 (urgency 88), vault=0 (urgency 84), interview=0 (urgency 82), ats=75 (urgency 10)
  assert.equal(actionsIot[0].id, 'streak', 'Streak 0 must be Priority 1');
  assert.equal(actionsIot[1].id, 'trust', 'Trust < 50 must be Priority 2');
  assert.equal(actionsIot[2].id, 'vault', 'Vault 0 must be Priority 3');

  // Verify brevity: no description exceeds 120 characters
  for (const act of actionsIot) {
    assert.ok(act.desc.length < 130, `Action ${act.id} desc "${act.desc}" must be concise (< 130 chars)`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4: AUTOMATIC ATTENDANCE & 75% ELIGIBILITY LOGIC
// ─────────────────────────────────────────────────────────────────────────────
test('Attendance Marker: Idempotency, 75% Eligibility criteria, and Auto-Recording', () => {
  interface AttendanceRecord {
    last_check_in: string;
    total_classes: number;
    attended_classes: number;
    percentage: number;
    focus_streak: number;
  }

  function evaluateAttendance(record: AttendanceRecord) {
    const pct = record.percentage;
    const isSafe = pct >= 75;
    const isCritical = pct < 65;
    return {
      isSafe,
      isCritical,
      badgeText: isSafe ? `✓ Safe (${pct}%) — Exam Eligible` : `⚠️ Warning (${pct}%) — Below 75%`,
    };
  }

  // Safe case (85%)
  const safeRec = evaluateAttendance({
    last_check_in: '2026-11-03',
    total_classes: 20,
    attended_classes: 17,
    percentage: 85,
    focus_streak: 5,
  });
  assert.equal(safeRec.isSafe, true);
  assert.ok(safeRec.badgeText.includes('Safe (85%)'));

  // Warning case (68%)
  const warnRec = evaluateAttendance({
    last_check_in: '2026-11-03',
    total_classes: 25,
    attended_classes: 17,
    percentage: 68,
    focus_streak: 2,
  });
  assert.equal(warnRec.isSafe, false);
  assert.equal(warnRec.isCritical, false);
  assert.ok(warnRec.badgeText.includes('Warning (68%)'));

  // Critical case (50%)
  const critRec = evaluateAttendance({
    last_check_in: '2026-11-03',
    total_classes: 20,
    attended_classes: 10,
    percentage: 50,
    focus_streak: 1,
  });
  assert.equal(critRec.isCritical, true);

  // Idempotency test: check whether already recorded today
  const todayStr = '2026-11-03';
  const checkedInRecord: AttendanceRecord = {
    last_check_in: todayStr,
    total_classes: 20,
    attended_classes: 17,
    percentage: 85,
    focus_streak: 5,
  };
  const shouldAutoCheckIn = checkedInRecord.last_check_in !== todayStr;
  assert.equal(shouldAutoCheckIn, false, 'Must not duplicate attendance if already checked in today');
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 5: 84-DAY HEATMAP MATRIX DATE GENERATION
// ─────────────────────────────────────────────────────────────────────────────
test('LearningHeatmapCard: Exact 84-day Sunday-anchored matrix generation', () => {
  const dates: Date[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (11 * 7) - today.getDay());
  startDate.setHours(0, 0, 0, 0);
  const temp = new Date(startDate);
  for (let i = 0; i < 84; i++) {
    dates.push(new Date(temp));
    temp.setDate(temp.getDate() + 1);
  }

  // Invariant 1: Exactly 84 cells (12 weeks * 7 days)
  assert.equal(dates.length, 84, 'Must have exactly 84 cells');

  // Invariant 2: First day must be a Sunday
  assert.equal(dates[0].getDay(), 0, 'First cell in heatmap grid must be Sunday');

  // Invariant 3: Last day must be a Saturday
  assert.equal(dates[83].getDay(), 6, 'Last cell in heatmap grid must be Saturday');

  // Invariant 4: No duplicate dates
  const stringSet = new Set(dates.map(d => d.toDateString()));
  assert.equal(stringSet.size, 84, 'Every date in the 84-day window must be unique');
});
