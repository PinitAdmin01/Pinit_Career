import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { SKIP_TURN_REGEX } from '../src/lib/interview/postInterviewInsights';
import { computeDeterministicEvaluation } from '../src/app/interview/interviewEvaluator';

test('SKIP_TURN_REGEX excludes both skipped questions and skipped rounds from substantive counts', () => {
  assert.equal(SKIP_TURN_REGEX.test('[Candidate skipped question]'), true);
  assert.equal(SKIP_TURN_REGEX.test('[Candidate skipped round]'), true);
  assert.equal(SKIP_TURN_REGEX.test('I would like to skip this round'), true);
  assert.equal(SKIP_TURN_REGEX.test('I designed a Redis cache with PostgreSQL read replicas'), false);
});

test('Skipping all 4 rounds produces a valid, non-crashing honest scorecard', () => {
  const result = computeDeterministicEvaluation({
    messages: [
      { role: 'assistant', content: 'Welcome to Round 1.' },
      { role: 'user', content: '[Candidate skipped round]' },
      { role: 'assistant', content: 'Welcome to Round 2.' },
      { role: 'user', content: '[Candidate skipped round]' },
      { role: 'assistant', content: 'Welcome to Round 3.' },
      { role: 'user', content: '[Candidate skipped round]' },
      { role: 'assistant', content: 'Welcome to Round 4.' },
      { role: 'user', content: '[Candidate skipped round]' },
    ],
    codeSubmitted: false,
    latestTopology: null,
    starStep: 0,
    fillerWordCount: 0,
    eyeContactScore: null,
    wpmScore: null,
    activeTopicName: 'Full-Stack Software Developer',
    domainStream: 'tech',
    archetype: 'Pattern Hunter',
    tabSwitchCount: 0,
    selectedLang: 'python',
  });

  assert.ok(result && typeof result.score === 'number' && Number.isFinite(result.score));
  assert.ok(result.score < 50, `Skipping all 4 rounds must not inflate score, got ${result.score}`);
  assert.ok(typeof result.verdict === 'string' && result.verdict.length > 0);
});

test('All 4 interview rounds expose Skip Round controls wired to handleSkipRound', () => {
  const root = process.cwd();
  const pageSrc = fs.readFileSync(path.join(root, 'src/app/interview/page.tsx'), 'utf8');
  const r1Src = fs.readFileSync(path.join(root, 'src/app/interview/components/Round1Behavioral.tsx'), 'utf8');
  const r2CodeSrc = fs.readFileSync(path.join(root, 'src/app/interview/components/Round2Coding.tsx'), 'utf8');
  const r2CaseSrc = fs.readFileSync(path.join(root, 'src/app/interview/components/Round2CaseStudy.tsx'), 'utf8');
  const r3Src = fs.readFileSync(path.join(root, 'src/app/interview/components/Round3SystemDesign.tsx'), 'utf8');
  const r4Src = fs.readFileSync(path.join(root, 'src/app/interview/components/Round4StarDrill.tsx'), 'utf8');
  const chatSrc = fs.readFileSync(path.join(root, 'src/app/api/interview/chat/route.ts'), 'utf8');

  assert.match(r1Src, /data-testid="round1-skip-round-btn"/);
  assert.match(r2CodeSrc, /data-testid="round2-skip-challenge-btn"/);
  assert.match(r2CaseSrc, /data-testid="round2-skip-challenge-btn"/);
  assert.match(r3Src, /data-testid="round3-skip-round-btn"/);
  assert.match(r4Src, /data-testid="round4-skip-round-btn"/);

  // Page wires handleSkipRound to every single round
  assert.match(pageSrc, /const handleSkipRound = async/);
  assert.equal((pageSrc.match(/onSkipRound=\{handleSkipRound\}/g) || []).length, 3, 'Rounds 1, 3, and 4 must wire onSkipRound={handleSkipRound}');
  assert.equal((pageSrc.match(/onSkipChallenge=\{handleSkipRound\}/g) || []).length, 2, 'Round 2 Coding and Case Study must wire onSkipChallenge={handleSkipRound}');

  // Chat API never tells users they cannot skip the round/canvas
  assert.match(chatSrc, /NEVER say they cannot skip it/);
});
