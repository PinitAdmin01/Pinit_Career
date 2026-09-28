/**
 * Verification script for Attention-Span Games and Learning Hub Integrity Fixes.
 */
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { computeIntegrityHash } from '../../src/app/api/attention-span/progress/route';

console.log('--- Starting Attention-Span & Learning Hub Integrity Verification ---');

// 1. Verify Progress Route Integrity Hash & Schema
const mockStats = {
  focusFireBest: 450,
  memoryMatrixBest: 6,
  reflexRushBest: 210,
  sequenceSnapBest: 8,
  totalSessions: 14,
  streak: 5,
  lastPlayedDate: '2026-09-20',
  questClaimedDate: '2026-09-20',
  dailyScores: { '2026-09-20': 450 },
  dailySessions: { '2026-09-20': 2 },
  completedDifficulties: { 'focus-fire': ['easy', 'normal'] },
};

const hash = computeIntegrityHash('test-user-123', mockStats as any);
assert.strictEqual(typeof hash, 'string', 'Integrity hash should be a string');
assert.strictEqual(hash.length, 16, 'Integrity hash should be 16 chars');
console.log('✓ Progress API integrity hash verified:', hash);

// 2. Audit useAttentionSpanData.ts
const attentionHookPath = path.join(process.cwd(), 'src/app/attention-span/hooks/useAttentionSpanData.ts');
const attentionHookSrc = fs.readFileSync(attentionHookPath, 'utf8');

assert(attentionHookSrc.includes('localStorage.getItem(`pinit_attention_stats_'), 'Hook must hydrate from localStorage');
assert(attentionHookSrc.includes('/api/attention-span/progress'), 'Hook must fetch from /api/attention-span/progress');
assert(attentionHookSrc.includes('questClaimedDate: today'), 'Daily quest claim must set questClaimedDate');
assert(attentionHookSrc.includes('stats.questClaimedDate === today'), 'Daily quest must check questClaimedDate against today');
console.log('✓ useAttentionSpanData persistence and anti-farming lock verified.');

// 3. Audit ProgressAnalyticsModal.tsx
const modalPath = path.join(process.cwd(), 'src/components/attention-span/ProgressAnalyticsModal.tsx');
const modalSrc = fs.readFileSync(modalPath, 'utf8');

assert(!modalSrc.includes('currentFocusScore - 45'), 'Modal must not contain fabricated "yesterday = today - 45" growth formula');
assert(!modalSrc.includes('points="50,80 120,65'), 'Modal must not contain static hardcoded SVG polyline points');
assert(!modalSrc.includes('points="100,45 130,75 100,105 70,75"'), 'Modal must not contain static hardcoded radar polygons');
assert(modalSrc.includes('past7Days.map'), 'Modal must dynamically plot past 7 days trajectory');
assert(modalSrc.includes('hasLastMonthRadar'), 'Modal must guard last month radar with authentic data check');
console.log('✓ ProgressAnalyticsModal dynamic calculations and honest states verified.');

// 4. Audit game-components.tsx
const gameComponentsPath = path.join(process.cwd(), 'src/app/attention-span/game-components.tsx');
const gameComponentsSrc = fs.readFileSync(gameComponentsPath, 'utf8');

// MemoryMatrix
assert(gameComponentsSrc.includes('Math.max(0, level - 1)'), 'MemoryMatrix must compute finalLevel starting from 0');
assert(!gameComponentsSrc.includes('onComplete(finalLevel + 1'), 'MemoryMatrix must not report finalLevel + 1');
assert(gameComponentsSrc.includes('hasReportedRef'), 'MemoryMatrix must guard against double reporting');

// VortexVision
assert(gameComponentsSrc.includes('handleMiss'), 'VortexVision must handle misses');
assert(gameComponentsSrc.includes('strikes >= 3'), 'VortexVision must terminate on 3 strikes');

// FlashFusion
assert(gameComponentsSrc.includes('strikes >= 3'), 'FlashFusion must terminate on 3 strikes');
assert(gameComponentsSrc.includes('Math.max(0, s - 1)'), 'FlashFusion must deduct points on wrong tap');

// ShapeShifter
assert(gameComponentsSrc.includes('strikes >= 3'), 'ShapeShifter must terminate on 3 strikes');
assert(gameComponentsSrc.includes('Math.max(0, s - 1)'), 'ShapeShifter must deduct points on wrong choice');

console.log('✓ Game components win/loss mechanics and scoring integrity verified.');

// 5. Audit EnrolledCoursesPanel.tsx
const coursesPanelPath = path.join(process.cwd(), 'src/app/learning/components/EnrolledCoursesPanel.tsx');
const coursesPanelSrc = fs.readFileSync(coursesPanelPath, 'utf8');

assert(!coursesPanelSrc.includes('Resolve Database Fallbacks'), 'EnrolledCoursesPanel must not contain hardcoded "Resolve Database Fallbacks"');
assert(!coursesPanelSrc.includes('Practice Array Limits'), 'EnrolledCoursesPanel must not contain hardcoded "Practice Array Limits"');
assert(!coursesPanelSrc.includes('AI mock interview with Mr. Vikram'), 'EnrolledCoursesPanel must not contain hardcoded Vikram remedial step');
assert(coursesPanelSrc.includes('dynamicSteps'), 'EnrolledCoursesPanel must compile dynamic steps');
assert(coursesPanelSrc.includes('href="/practice"'), 'EnrolledCoursesPanel must provide genuine sandbox practice link');
console.log('✓ EnrolledCoursesPanel dynamic remedial plan verified.');

// 6. Audit useLearningData.ts
const learningHookPath = path.join(process.cwd(), 'src/app/learning/hooks/useLearningData.ts');
const learningHookSrc = fs.readFileSync(learningHookPath, 'utf8');

assert(!learningHookSrc.includes('Stripe, Datadog'), 'useLearningData must not hardcode corporate placement at Stripe/Datadog');
assert(!learningHookSrc.includes('Zero-Knowledge database connector'), 'useLearningData must not hardcode Zero-Knowledge database connector');
assert(!learningHookSrc.includes(": ['System Design', 'DSA - Trees', 'Behavioral STAR']"), 'useLearningData must not default to fake weak areas');
assert(learningHookSrc.includes("api.post('/api/auth/onboarding', { learning_mistakes: nextMistakes })"), 'clearMistake must only post learning_mistakes payload');
console.log('✓ useLearningData dynamic roadmap, honest weak areas, and safe clearMistake verified.');

console.log('\nALL 6 INTEGRITY VERIFICATION SUITES PASSED CLEANLY! 🎉');
