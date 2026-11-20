import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {
  TOUR_SLIDES,
  TOUR_TOTAL_MS,
  TOUR_SPEECH_START_DEADLINE_MS,
  getTourSlideText,
  buildCongratMessage,
} from '../src/components/ui/StoryTourModal';
import {
  LEFT_SIDEBAR_ROUTES,
  getAllRoutes,
  matchNavigationIntent,
  matchBestAlternative,
} from '../src/components/avatar/hooks/useVoiceNavigation';
import {
  isPriorityDiagnosticQuery,
  buildPriorityDiagnosticReport,
} from '../src/lib/avatar/priorityBriefing';
import {
  LEFT_SIDEBAR_VOICE_ACTIONS,
  matchVoiceActionIntent,
  matchBestActionAlternative,
} from '../src/lib/avatar/voiceActionRouter';
import {
  resolveBestSpeechLocale,
  createSpeechRecognitionController,
  type SpeechEngineStatus,
} from '../src/lib/avatar/speechRecognitionEngine';
import { PriorityDiagnosticPanel } from '../src/components/avatar/PriorityDiagnosticPanel';

const ROOT = path.resolve(__dirname, '..');

const CANONICAL_12_LEFT_SIDEBAR_PATHS = [
  '/dashboard',
  '/quests',
  '/missions',
  '/projects',
  '/innovation-hub',
  '/interview',
  '/mirror',
  '/attention-span',
  '/friends',
  '/arena',
  '/notifications',
  '/profile',
];

test('Task 1: Story Mode matches all 12 canonical Left Sidebar tabs, fits 95s speech budget, and has honest congrats', () => {
  assert.equal(TOUR_SLIDES.length, 15, 'Must have 15 slides: intro + 12 left-sidebar tabs + campus academics + wrap-up');
  assert.equal(TOUR_TOTAL_MS, 95_000, 'Total tour runtime must equal exactly 95s');

  const tabSlides = TOUR_SLIDES.filter((s) => s.segmentLabel.startsWith('TAB '));
  assert.equal(tabSlides.length, 12, 'Must have exactly 12 tab slides matching STUDENT_NAV + BOTTOM_NAV');
  assert.deepEqual(
    tabSlides.map((s) => s.route),
    CANONICAL_12_LEFT_SIDEBAR_PATHS,
    'Story Mode tab order must match canonical Left Sidebar order'
  );

  // Every narration line must fit its slot at ~14 chars/sec with route+deadline+margin overhead
  const ctx = { name: 'Christopher', mentor: 'Ms. Priya' };
  for (const slide of TOUR_SLIDES) {
    const text = getTourSlideText(slide, ctx);
    const neededMs = 300 + TOUR_SPEECH_START_DEADLINE_MS + Math.round((text.length / 14) * 1000) + 200;
    assert.ok(
      neededMs <= slide.durationMs,
      `Slide "${slide.title}" needs ${neededMs}ms > ${slide.durationMs}ms (${text.length} chars)`
    );
  }

  // Honest congratulation message when score/weak_areas are absent (no fake 80%)
  const honestCongrats = buildCongratMessage({ passed: true }, {});
  assert.equal(honestCongrats.body.includes('80%'), false, 'Must not fabricate 80% score when omitted');
});

test('Task 2: Voice Navigation covers strictly the 12 Left Sidebar tabs and rejects non-sidebar tabs', () => {
  const routes = getAllRoutes();
  assert.equal(routes.length, 12);
  assert.deepEqual(routes.map((r) => r.path), CANONICAL_12_LEFT_SIDEBAR_PATHS);
  assert.equal(LEFT_SIDEBAR_ROUTES.length, 12);

  const exactCases: Array<[string, string]> = [
    ['hey priya go to dashboard', '/dashboard'],
    ['hay priya go to quest', '/quests'],
    ['hey priya open courses', '/quests'],
    ['hey priya navigate me to mission tab', '/missions'],
    ['hey priya go to projects', '/projects'],
    ['hey priya open innovation hub', '/innovation-hub'],
    ['hey priya go to ai interview', '/interview'],
    ['hey priya open digital studio', '/mirror'],
    ['hey priya switch to attention span', '/attention-span'],
    ['hey priya go to my network', '/friends'],
    ['hey priya open arena', '/arena'],
    ['hey priya show notifications', '/notifications'],
    ['hey priya open my profile', '/profile'],
  ];

  for (const [phrase, expectedPath] of exactCases) {
    const res = matchNavigationIntent(phrase, { addressedMentor: true });
    assert.equal(res.matched, true, `Expected match for "${phrase}"`);
    assert.equal(res.path, expectedPath, `Expected "${phrase}" -> ${expectedPath}, got ${res.path}`);
  }

  // Non-left-sidebar tabs must NOT match
  for (const nonSidebar of ['hey priya go to hostel', 'hey priya open library', 'hey priya go to finance fees']) {
    const res = matchNavigationIntent(nonSidebar, { addressedMentor: true });
    assert.equal(res.matched, false, `Non-left-sidebar command "${nonSidebar}" must not match`);
  }
});

test('Task 3: Indian-English mispronunciations, elongated speech, and broken SOV sentences resolve accurately', () => {
  const accentCases: Array<[string, string]> = [
    ['hey priya quessst tab', '/quests'],
    ['hey priya i want to go to quest', '/quests'],
    ['hay priya korses', '/quests'],
    ['hey priya mishun tab', '/missions'],
    ['priya mission tab open', '/missions'],
    ['hey priya dajbord', '/dashboard'],
    ['hey priya intervyu tab', '/interview'],
    ['hey priya dijital studio', '/mirror'],
    ['hey priya inoveshan hub', '/innovation-hub'],
    ['hey priya atenshan span', '/attention-span'],
    ['hey priya notifikesan', '/notifications'],
    ['hey priya profayl tab', '/profile'],
    ['hey priya arenaa', '/arena'],
    ['hey priya frends tab', '/friends'],
    ['hey priya projekts open', '/projects'],
  ];

  for (const [phrase, expectedPath] of accentCases) {
    const res = matchNavigationIntent(phrase, { addressedMentor: true });
    assert.equal(res.matched, true, `Expected accent/broken match for "${phrase}"`);
    assert.equal(res.path, expectedPath, `Expected "${phrase}" -> ${expectedPath}, got ${res.path}`);
  }

  // Multi-alternative selection picks highest-confidence valid route
  const altRes = matchBestAlternative(
    ['hey priya go to guest book', 'hey priya go to quests'],
    { addressedMentor: true }
  );
  assert.equal(altRes.matched, true);
  assert.equal(altRes.path, '/quests');

  // Informational questions without nav verbs must not hijack into navigation
  assert.equal(matchNavigationIntent('hey priya what are my priorities', { addressedMentor: true }).matched, false);
  assert.equal(matchNavigationIntent('hey priya what i want to do', { addressedMentor: true }).matched, false);
  assert.equal(matchNavigationIntent('how does arena work').matched, false);
});

test('Task 4: Executive Priority Diagnostic Briefing compiles honest telemetry, mistakes, and SSR panel cleanly', () => {
  // Intent detection (including broken English)
  for (const q of [
    'what are my priority',
    'what are my priorities',
    'what i want to do',
    'what should i do next',
    'show my mistakes',
    'where am i weak',
    'review my performance',
  ]) {
    assert.equal(isPriorityDiagnosticQuery(q), true, `Expected priority query match for "${q}"`);
  }
  assert.equal(isPriorityDiagnosticQuery('hey priya go to dashboard'), false);

  // Populated report check
  const report = buildPriorityDiagnosticReport({
    studentName: 'suraj c',
    targetRole: 'Full Stack Engineer',
    activeCourseTitle: 'Python Backend Engineering',
    completedQuests: ['py-day-1', 'py-day-2', 'py-day-3'],
    completedMissions: ['m-1'],
    missionStreak: 4,
    careerScore: 42,
    trustScore: 95,
    xp: 450,
    atsScore: 52,
    vaultCount: 1,
    skillTags: ['Python', 'REST APIs'],
    weakAreas: ['System Design', 'SQL Indexing'],
    learningMistakes: [
      { id: 'mk-1', type: 'SQL', module: 'Composite Indexes', description: 'Missed leftmost prefix order' },
    ],
  });

  assert.equal(report.studentName, 'Suraj');
  assert.equal(report.metrics.completedLessons, 3);
  assert.equal(report.metrics.completedMissions, 1);
  assert.equal(report.mistakes.length, 1);
  assert.ok(report.strongAreas.includes('Python'));
  assert.ok(report.weakAreas.includes('System Design'));
  assert.ok(report.spokenBriefing.includes('executive performance briefing, Suraj'));
  assert.ok(report.spokenBriefing.includes('3 lessons'));
  assert.ok(report.spokenBriefing.includes('Composite Indexes'));

  // SSR render of PriorityDiagnosticPanel (zero emojis, renders mistakes & priorities)
  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(PriorityDiagnosticPanel, {
      report,
      onNavigate: () => {},
      onSwitchToChat: () => {},
    })
  );
  assert.ok(html.includes('Executive Performance Diagnostic'));
  assert.ok(html.includes('Composite Indexes'));
  assert.ok(html.includes('Verified Strong Areas'));
  assert.ok(html.includes('Weak Areas &amp; Skill Gaps'));
  assert.ok(html.includes('priority-mistakes-section'));
  assert.ok(html.includes('priority-actions-section'));

  const panelSrc = fs.readFileSync(path.join(ROOT, 'src/components/avatar/PriorityDiagnosticPanel.tsx'), 'utf8');
  assert.equal(/[\u{10000}-\u{10ffff}\u{2600}-\u{27bf}]/u.test(panelSrc), false, 'PriorityDiagnosticPanel must have zero emojis');
});

test('Task 5: Voice Action Router covers all 12 Left Sidebar tabs and gates strictly on action verbs', () => {
  const coveredBasePaths = new Set(LEFT_SIDEBAR_VOICE_ACTIONS.map((a) => a.basePath));
  for (const p of CANONICAL_12_LEFT_SIDEBAR_PATHS) {
    assert.ok(coveredBasePaths.has(p), `LEFT_SIDEBAR_VOICE_ACTIONS must cover ${p}`);
  }

  const actionCases: Array<[string, string]> = [
    ['hey priya start mission', '/missions?roleplay=true'],
    ['hey priya mission start', '/missions?roleplay=true'],
    ['hey priya start mishun', '/missions?roleplay=true'],
    ['hey priya start lesson', '/quests?autostart=lesson'],
    ['hey priya start quessst', '/quests?autostart=lesson'],
    ['hey priya start project', '/projects?autostart=new'],
    ['hey priya create squad', '/innovation-hub?autostart=squad'],
    ['hey priya start interview', '/interview?autostart=interview'],
    ['interview start karo', '/interview?autostart=interview'],
    ['hey priya start gd', '/interview?tab=gd&autostart=gd'],
    ['hey priya scan skill gap', '/mirror?tab=twin&autostart=scan'],
    ['hey priya build resume', '/mirror?tab=career-builder'],
    ['hey priya start focus', '/attention-span?autostart=focus'],
    ['hey priya start duel', '/arena?autostart=duel'],
    ['hey priya find friends', '/friends?autostart=find'],
    ['hey priya check notifications', '/notifications?autostart=unread'],
    ['hey priya setup voice', '/profile?autostart=voice'],
  ];

  for (const [phrase, expectedPath] of actionCases) {
    const res = matchVoiceActionIntent(phrase, { addressedMentor: true });
    assert.equal(res.matched, true, `Expected action match for "${phrase}"`);
    assert.equal(res.path, expectedPath, `Expected "${phrase}" -> ${expectedPath}, got ${res.path}`);
  }

  // Must NOT hijack plain navigation or priority questions
  for (const negative of [
    'hey priya go to mission tab',
    'hey priya open quests',
    'hey priya what are my priorities',
    'hey priya what should i do',
    'how do i start a project',
  ]) {
    const res = matchVoiceActionIntent(negative, { addressedMentor: true });
    assert.equal(res.matched, false, `Must NOT trigger action on "${negative}"`);
  }

  const altAction = matchBestActionAlternative(['hey priya star machine', 'hey priya start mission'], { addressedMentor: true });
  assert.equal(altAction.matched, true);
  assert.equal(altAction.path, '/missions?roleplay=true');
});

test('Task 6: SpeechRecognitionEngine handles en-IN locale, silence-commit, TTS echo gate, and auto-restart', async () => {
  assert.equal(resolveBestSpeechLocale('en-IN'), 'en-IN');
  assert.equal(resolveBestSpeechLocale('hi-IN'), 'en-IN');
  assert.equal(resolveBestSpeechLocale(''), 'en-IN');

  // Mock browser window with controllable SpeechRecognition
  let latestInstance: any = null;
  let startCount = 0;

  class MockSpeechRecognition {
    lang = '';
    continuous = false;
    interimResults = false;
    maxAlternatives = 1;
    onstart: (() => void) | null = null;
    onresult: ((ev: any) => void) | null = null;
    onerror: ((ev: any) => void) | null = null;
    onend: (() => void) | null = null;
    constructor() {
      latestInstance = this;
    }
    start() {
      startCount += 1;
      this.onstart?.();
    }
    stop() {
      this.onend?.();
    }
    abort() {
      this.onend?.();
    }
  }

  const prevWindow = (globalThis as any).window;
  (globalThis as any).window = { SpeechRecognition: MockSpeechRecognition };

  try {
    const utterances: Array<{ primary: string; alternatives: string[]; isFinal: boolean }> = [];
    const statuses: SpeechEngineStatus[] = [];
    let deniedCalled = 0;

    const ctrl = createSpeechRecognitionController({
      lang: 'en-IN',
      silenceCommitMs: 40,
      ttsCooldownMs: 40,
      dedupeWindowMs: 500,
      onUtterance: (ev) => utterances.push(ev),
      onStatusChange: (st) => statuses.push(st),
      onPermissionDenied: () => {
        deniedCalled += 1;
      },
    });

    ctrl.start();
    assert.equal(latestInstance.lang, 'en-IN');
    assert.equal(latestInstance.maxAlternatives, 5);
    assert.equal(latestInstance.continuous, true);
    assert.ok(statuses.includes('listening'));

    // 1. Interim silence-commit + multi-alternative extraction strictly from resultIndex
    latestInstance.onresult?.({
      resultIndex: 1,
      results: [
        { isFinal: true, length: 1, 0: { transcript: 'stale old phrase' } },
        {
          isFinal: false,
          length: 2,
          0: { transcript: 'hey priya start mishun' },
          1: { transcript: 'hey priya start mission' },
        },
      ],
    });
    await new Promise((r) => setTimeout(r, 80));
    assert.equal(utterances.length, 1);
    assert.deepEqual(utterances[0].alternatives, ['hey priya start mishun', 'hey priya start mission']);

    // 2. TTS Echo Gate suppresses recognition while speaking
    ctrl.setTtsSpeaking(true);
    assert.ok(statuses.includes('paused-tts'));
    latestInstance.onresult?.({
      resultIndex: 0,
      results: [{ isFinal: true, length: 1, 0: { transcript: 'echo from priya' } }],
    });
    assert.equal(utterances.length, 1, 'TTS echo must be suppressed while speaking');

    // Resume after cooldown
    ctrl.setTtsSpeaking(false);
    await new Promise((r) => setTimeout(r, 80));
    assert.ok(startCount >= 2, 'Controller must auto-resume after TTS cooldown');

    // 3. Permission denied stops cleanly without infinite restart
    latestInstance.onerror?.({ error: 'not-allowed' });
    assert.equal(deniedCalled, 1);
    assert.equal(statuses[statuses.length - 1], 'denied');

    ctrl.destroy();
  } finally {
    if (prevWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = prevWindow;
    }
  }
});
