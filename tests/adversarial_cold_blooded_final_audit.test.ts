import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TOUR_SLIDES, TOUR_TOTAL_MS, TOUR_TAB_MS, TOUR_INTRO_MS, TOUR_ACADEMICS_MS, TOUR_OUTRO_MS } from '../src/components/ui/StoryTourModal';
import { STUDENT_NAV, BOTTOM_NAV, ROUTE_TOOLTIPS } from '../src/components/ui/AppSidebar';
import { matchBestAlternative, matchNavigationIntent, LEFT_SIDEBAR_ROUTES } from '../src/components/avatar/hooks/useVoiceNavigation';
import { matchBestActionAlternative } from '../src/lib/avatar/voiceActionRouter';
import {
  buildHyperActiveGreeting,
  buildHyperActiveFallbackReply,
  buildHyperActivePromptDirective,
  formatHonestProgressClause,
} from '../src/lib/avatar/hyperActivePersona';

describe('BRUTAL COLD-BLOODED ADVERSARIAL FINAL AUDIT', () => {
  // ── AUDIT BLOCK 1: Story Tour Architecture & Precision Spotlights ──
  describe('Auditor A: Story Tour Invariants & Canonical 12-Tab Synchronization', () => {
    it('1.1: Exactly 15 slides matching the unified student architecture', () => {
      assert.strictEqual(TOUR_SLIDES.length, 15, 'Story tour must have exactly 15 slides');
      assert.strictEqual(TOUR_TOTAL_MS, 95_000, 'Total runtime must be exactly 95,000ms (95 seconds)');
    });

    it('1.2: Slide 0 is "intro" and Slide 14 is "outro" to prevent false dashboard spotlights', () => {
      assert.strictEqual(TOUR_SLIDES[0].tabKey, 'intro', 'Slide 0 must use tabKey "intro"');
      assert.strictEqual(TOUR_SLIDES[0].segmentLabel, 'INTRO');
      assert.strictEqual(TOUR_SLIDES[14].tabKey, 'outro', 'Slide 14 must use tabKey "outro"');
      assert.strictEqual(TOUR_SLIDES[14].segmentLabel, 'WRAP-UP');
    });

    it('1.3: Slides 1 to 12 match the Left Sidebar top-to-bottom layout 1-to-1', () => {
      const primaryItems = STUDENT_NAV[0].items.filter((it): it is any => 'href' in it);
      const bottomItems = BOTTOM_NAV;

      const expectedSidebarOrder = [
        ...primaryItems.map((it) => ({ href: it.href, label: it.label })),
        ...bottomItems.map((it) => ({ href: it.href, label: it.label })),
      ];

      assert.strictEqual(expectedSidebarOrder.length, 12, 'Sidebar must have 12 canonical items (8 primary + 4 bottom)');

      for (let i = 0; i < 12; i++) {
        const slide = TOUR_SLIDES[i + 1]; // Slides 1..12
        const expected = expectedSidebarOrder[i];
        assert.strictEqual(
          slide.route,
          expected.href,
          `Slide ${i + 1} route (${slide.route}) must match sidebar item ${i + 1} (${expected.href})`
        );
        assert.strictEqual(slide.durationMs, TOUR_TAB_MS, `Tab slide ${i + 1} duration must be exactly 6000ms`);
      }
    });

    it('1.4: Slide 13 is dedicated Campus Academics circle (A) with 10s budget', () => {
      const slide13 = TOUR_SLIDES[13];
      assert.strictEqual(slide13.tabKey, 'academic-sidebar', 'Slide 13 must target academic-sidebar');
      assert.strictEqual(slide13.durationMs, TOUR_ACADEMICS_MS, 'Academics slide must be 10,000ms');
      assert.strictEqual(slide13.segment, 3, 'Academics slide must be in segment 3');
      assert.ok(slide13.text.includes('Campus Academics'));
    });
  });

  // ── AUDIT BLOCK 2: Voice Navigation & Accent Tolerance ──
  describe('Auditor B: Voice Navigation Engine & Exhaustive Tab Routing', () => {
    it('2.1: Resolves every canonical Left Sidebar route with wake word', () => {
      for (const route of LEFT_SIDEBAR_ROUTES) {
        const query = `hey priya go to ${route.displayName.toLowerCase()}`;
        const match = matchBestAlternative([query], { addressedMentor: true });
        assert.strictEqual(match.matched, true, `Failed to match query: ${query}`);
        assert.strictEqual(match.path, route.path, `Incorrect route matched for query: ${query}`);
        assert.strictEqual(match.confidence, 1, `Confidence must be 1.0 for exact route: ${query}`);
      }
    });

    it('2.2: Resolves direct navigation without wake word for explicit commands', () => {
      const testCases = [
        { spoken: 'go to course', expected: '/quests' },
        { spoken: 'open missions', expected: '/missions' },
        { spoken: 'navigate to arena', expected: '/arena' },
        { spoken: 'switch to projects', expected: '/projects' },
        { spoken: 'take me to digital studio', expected: '/mirror' },
        { spoken: 'open interview studio', expected: '/interview' },
        { spoken: 'show attention span', expected: '/attention-span' },
      ];

      for (const { spoken, expected } of testCases) {
        const match = matchBestAlternative([spoken], { addressedMentor: false });
        assert.strictEqual(match.matched, true, `Failed to match direct command: ${spoken}`);
        assert.strictEqual(match.path, expected, `Wrong path for direct command: ${spoken}`);
        assert.ok(match.confidence >= 0.7, `Confidence should be >= 0.7 for direct command: ${spoken}`);
      }
    });

    it('2.3: Handles heavy Indian-English accents and phonetic mistranscriptions', () => {
      const dialectPhrases = [
        { phrase: 'hey priya quessst tab', expected: '/quests' },
        { phrase: 'hey priya go to korses', expected: '/quests' },
        { phrase: 'priya mishun tab open', expected: '/missions' },
        { phrase: 'hey priya dajbord', expected: '/dashboard' },
        { phrase: 'hey priya intervyu studio', expected: '/interview' },
        { phrase: 'priya inoveshan hub', expected: '/innovation-hub' },
        { phrase: 'hey priya atenshan span', expected: '/attention-span' },
        { phrase: 'priya notifikesan', expected: '/notifications' },
      ];

      for (const { phrase, expected } of dialectPhrases) {
        const match = matchBestAlternative([phrase], { addressedMentor: true });
        assert.strictEqual(match.matched, true, `Phonetic match failed for: ${phrase}`);
        assert.strictEqual(match.path, expected, `Wrong path for dialect phrase: ${phrase}`);
        assert.strictEqual(match.confidence, 1, `Phonetic match should yield 1.0 confidence: ${phrase}`);
      }
    });

    it('2.4: Voice Action Router maps action verbs to safe confirmation modals across all 12 tabs', () => {
      const actions = [
        { utterance: 'hey priya start mission', path: '/missions?roleplay=true' },
        { utterance: 'hey priya start lesson', path: '/quests?autostart=lesson' },
        { utterance: 'hey priya start interview', path: '/interview?autostart=interview' },
        { utterance: 'hey priya start duel', path: '/arena?autostart=duel' },
        { utterance: 'hey priya start project', path: '/projects?autostart=new' },
        { utterance: 'hey priya pitch prototype', path: '/innovation-hub?autostart=squad' },
        { utterance: 'hey priya review mistakes', path: '/mirror?tab=mistakes' },
        { utterance: 'hey priya start focus drill', path: '/attention-span?autostart=focus' },
      ];

      for (const { utterance, path } of actions) {
        const actionMatch = matchBestActionAlternative([utterance], { addressedMentor: true });
        assert.strictEqual(actionMatch.matched, true, `Action failed to match: ${utterance}`);
        assert.strictEqual(actionMatch.path, path, `Action matched wrong path: ${utterance}`);
        assert.ok(actionMatch.spokenReply.length > 10, 'Action must have a spoken confirmation reply');
      }
    });
  });

  // ── AUDIT BLOCK 3: Hyper-Active Dialogue Quality & Anti-Repetition ──
  describe('Auditor C: Hyper-Active Mode Realism, Conciseness & Anti-Looping', () => {
    const mockContext = {
      studentName: 'Ravana',
      teacherName: 'Ms. Priya',
      completedQuestsCount: 3,
      completedMissionsCount: 1,
      missionStreak: 2,
      careerScore: 65,
    };

    it('3.1: Hyper-Active greeting is concise (< 35 words) and empathetic', () => {
      const greeting = buildHyperActiveGreeting(mockContext, new Date(2026, 10, 20, 15, 0));
      const wordCount = greeting.split(/\s+/).length;
      assert.ok(wordCount <= 35, `Greeting word count must be <= 35 words (was ${wordCount})`);
      assert.match(greeting, /Hey Ravana!/i);
      assert.match(greeting, /how was your day|are you doing okay/i);
    });

    it('3.2: Casual acknowledgments ("ok", "cool", "hmm", "yes") are short, punchy, and NEVER repeat progress stats', () => {
      const casuals = ['ok', 'cool', 'hmm', 'hmmm', 'yes', 'yup', 'got it', 'sure'];
      for (const phrase of casuals) {
        const reply = buildHyperActiveFallbackReply(phrase, mockContext);
        const wordCount = reply.split(/\s+/).length;
        assert.ok(wordCount <= 25, `"${phrase}" reply must be <= 25 words (was ${wordCount}): "${reply}"`);
        assert.ok(!reply.includes('3 lessons'), 'Casual reply must NOT repeat progress numbers');
        assert.ok(!reply.includes('knocked out'), 'Casual reply must NOT repeat progress clause');
      }
    });

    it('3.3: User deferral ("ur wish", "u choose", "you say") makes mentor playfully take initiative', () => {
      const deferrals = ['ur wish', 'u wish', 'you choose', 'u choose', 'you decide', 'up to you'];
      for (const phrase of deferrals) {
        const reply = buildHyperActiveFallbackReply(phrase, mockContext);
        const wordCount = reply.split(/\s+/).length;
        assert.ok(wordCount <= 25, `"${phrase}" reply must be <= 25 words (was ${wordCount}): "${reply}"`);
        assert.match(reply, /my wish|up to me|i pick/i);
        assert.ok(!reply.includes('I hear you, Ravana — and honestly I love that you came straight to me'), 'Must NOT give stale canned paragraph');
      }
    });

    it('3.4: Direction queries ("what is my next move", "what to do", "what should i study") give immediate actionable guidance', () => {
      const directionQueries = ['what is my next move', 'what next', 'what to do', 'what should i study', 'what do you suggest'];
      for (const query of directionQueries) {
        const reply = buildHyperActiveFallbackReply(query, mockContext);
        const wordCount = reply.split(/\s+/).length;
        assert.ok(wordCount <= 25, `"${query}" reply must be <= 25 words (was ${wordCount}): "${reply}"`);
        assert.match(reply, /courses/i);
      }
    });

    it('3.5: Anti-Repetition Guard dynamically alternates replies when the same input is repeated', () => {
      const firstOk = buildHyperActiveFallbackReply('ok', mockContext);
      const secondOk = buildHyperActiveFallbackReply('ok', mockContext, [
        { role: 'assistant', content: firstOk }
      ]);
      assert.notStrictEqual(firstOk, secondOk, 'Consecutive replies to "ok" must NEVER be identical');

      const firstWish = buildHyperActiveFallbackReply('ur wish', mockContext);
      const secondWish = buildHyperActiveFallbackReply('ur wish', mockContext, [
        { role: 'assistant', content: firstWish }
      ]);
      assert.notStrictEqual(firstWish, secondWish, 'Consecutive replies to "ur wish" must NEVER be identical');
    });

    it('3.6: System prompt directive strictly instructs LLM to stay under 30 words and avoid paragraphs', () => {
      const directive = buildHyperActivePromptDirective(mockContext);
      assert.ok(directive.includes('UNDER 30 WORDS TOTAL'), 'Directive must enforce under 30 words limit');
      assert.ok(directive.includes('NEVER output multiple paragraphs'), 'Directive must ban multiple paragraphs');
      assert.ok(directive.includes('DO NOT repeat progress stats'), 'Directive must ban repeating stats');
    });
  });
});
