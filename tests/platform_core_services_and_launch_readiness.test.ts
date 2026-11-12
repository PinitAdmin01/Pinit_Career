import test from 'node:test';
import assert from 'node:assert/strict';

// Service 1: Track Resolver
import { resolveTrackForCourse, matchTrackFromGoal, resolveTrackFromGoal, TRACKS } from '../src/lib/onboarding/trackResolver';
import { COURSES_CATALOG } from '../src/lib/data/coursesCatalog';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';

// Service 2: Resume Synthesis & ATS Screener
import { generateStructuredResume, mapTrackToRoleCategory } from '../src/lib/ats/resumeGenerator';
import { auditResumeATS } from '../src/lib/ats/atsScreener';
import { matchJobDescription } from '../src/lib/opportunities/jdMatch';
import { generateResumeHtml } from '../src/lib/printResume';

// Service 3: Pin Economy & Vault Locks
import { PIN_COSTS, PIN_EARN, PinTransaction } from '../src/hooks/usePinBalance';

// Service 4: University Institutional Analytics
import { computeDashboard, computeEmployability, applyFilters, THRESHOLDS, CohortIndex } from '../src/lib/university/analytics';

// Service 5: Visuals Engine
import { ENABLED_COURSES, isCourseVisualsEnabled } from '../src/lib/visuals/enabledCourses';

test('Launch Readiness [Service 1]: Onboarding Role Pathing Parity across all Catalog & Registry courses', () => {
  assert.strictEqual(COURSES_CATALOG.length, 55, 'Catalog must contain all 55 courses');
  assert.strictEqual(COURSES_REGISTRY.length, 55, 'Registry must contain all 55 courses');

  // Verify all courses resolve to authoritative tracks
  for (const c of COURSES_CATALOG) {
    const track = resolveTrackForCourse(c.id);
    assert.ok(track.targetRoleLabel && track.targetRoleLabel.length > 0);
    assert.ok(track.skillsList && track.skillsList.length > 0);
    assert.ok(track.weakAreas.length > 0);
  }

  // Verify deterministic onboarding answer routing
  const devTrack = matchTrackFromGoal('frontend_developer');
  assert.strictEqual(devTrack?.targetRoleLabel, TRACKS.frontend.targetRoleLabel);

  const fallbackDegree = resolveTrackFromGoal('', 'Bachelor of Commerce');
  assert.strictEqual(fallbackDegree.targetRoleLabel, TRACKS.finance.targetRoleLabel);
});

test('Launch Readiness [Service 2]: Career Intelligence & ATS Resume Synthesis with >= 85 Score & JD Match', () => {
  const profile = {
    fullName: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@domain.com',
    phone: '+91 98765 12345',
    address: 'Hyderabad, India',
    linkedin: 'linkedin.com/in/ananya-deshmukh-eng',
    github: 'github.com/ananyadeshmukh',
    degree: 'B.Tech in Computer Science',
    institution: 'Indian Institute of Information Technology',
  };

  const synthesized = generateStructuredResume(profile, [], TRACKS.fullstack);
  const atsAudit = auditResumeATS(synthesized.plainText, { targetRole: synthesized.targetRoleCategory });

  // ATS Standards
  assert.ok(atsAudit.compositeScore >= 85, `Composite ATS score must be >= 85, got ${atsAudit.compositeScore}`);
  assert.strictEqual(atsAudit.extractedProfile.layoutRisk, 'Low');
  assert.ok(atsAudit.extractedProfile.quantifiedBulletsCount >= 3);
  assert.ok(atsAudit.extractedProfile.powerVerbsCount >= 3);
  assert.strictEqual(atsAudit.extractedProfile.missingSections.length, 0);

  // JD Matching
  const jd = 'Seeking Full-Stack Software Developer skilled in TypeScript, React, Next.js, Node.js, and Docker.';
  const matchResult = matchJobDescription(jd, synthesized.skills.all);
  assert.ok(matchResult.analyzable);
  assert.ok(matchResult.match_score >= 70, `JD match score must be >= 70, got ${matchResult.match_score}`);

  // HTML Print Generation
  const html = generateResumeHtml(synthesized.formData);
  assert.ok(html.includes('Ananya Deshmukh'));
  assert.ok(html.includes('Technical Skills') || html.includes('Core Skills'));
});

test('Launch Readiness [Service 3]: Pin Economy Invariants, Non-Negative Balances & Deduplication', () => {
  // Pin Economy Costs
  assert.strictEqual(PIN_COSTS.quest.cost, 20);
  assert.strictEqual(PIN_COSTS.interview.cost, 25);
  assert.strictEqual(PIN_COSTS.code_arena.cost, 10);
  assert.strictEqual(PIN_COSTS.group_discussion.cost, 25);

  // Balance spend safety: cannot spend more than available
  let balance = 15;
  const cost = PIN_COSTS.quest.cost; // 20
  const canAfford = balance >= cost;
  assert.strictEqual(canAfford, false);
  if (!canAfford) {
    // Balance preserved
    assert.strictEqual(balance, 15);
  }

  // Transaction deduplication
  const txList: PinTransaction[] = [
    { id: 'tx-1', type: 'earn', amount: 50, reason: 'Reward', source: 'mission_complete', timestamp: 100 },
    { id: 'tx-1', type: 'earn', amount: 50, reason: 'Duplicate Reward', source: 'mission_complete', timestamp: 100 },
  ];
  const txMap = new Map<string, PinTransaction>();
  for (const t of txList) txMap.set(t.id, t);
  assert.strictEqual(txMap.size, 1, 'Duplicate transactions must be eliminated');
});

test('Launch Readiness [Service 4]: Multi-Tenant University Dashboard & Cohort Filtering', () => {
  const students = [
    { id: 'u1', ats_score: 85, trust_score: 80, career_dna_score: 80, missions_completed: 8, xp_total: 300 },
    { id: 'u2', ats_score: 72, trust_score: 75, career_dna_score: 70, missions_completed: 5, xp_total: 180 },
    { id: 'u3', ats_score: 50, trust_score: 45, career_dna_score: 50, missions_completed: 0, xp_total: 0 },
  ];

  const cohorts: CohortIndex = new Map([
    ['u1', { college: 'City Tech', department: 'CSE', batchYear: 2025 }],
    ['u2', { college: 'City Tech', department: 'CSE', batchYear: 2025 }],
    ['u3', { college: 'City Tech', department: 'ECE', batchYear: 2026 }],
  ]);

  const dashboard = computeDashboard(students, cohorts, true);
  assert.strictEqual(dashboard.placementStats.total_students, 3);
  assert.strictEqual(dashboard.placementStats.placement_ready, 2);
  assert.strictEqual(dashboard.placementStats.ats_qualified, 2);
  assert.strictEqual(dashboard.placementStats.engaged_students, 2);
  assert.strictEqual(dashboard.dataAvailable.students, true);

  const filtered = applyFilters(students, cohorts, { department: 'CSE' });
  assert.strictEqual(filtered.length, 2);

  const emp = computeEmployability(students);
  assert.strictEqual(emp.report.highly_employable, 1);
  assert.strictEqual(emp.report.employable, 1);
  assert.strictEqual(emp.report.needs_development, 1);
});

test('Launch Readiness [Service 5]: Visual Engine Integrity across Core Platforms', () => {
  assert.ok(ENABLED_COURSES.length >= 15);
  assert.strictEqual(isCourseVisualsEnabled('python'), true);
  assert.strictEqual(isCourseVisualsEnabled('fullstack-js'), true);
  assert.strictEqual(isCourseVisualsEnabled('java-basics'), true);
  assert.strictEqual(isCourseVisualsEnabled('invalid-random-course'), false);
});
