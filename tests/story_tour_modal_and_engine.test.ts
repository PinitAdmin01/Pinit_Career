import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  TOUR_SLIDES,
  TOUR_INTRO_MS,
  TOUR_TAB_MS,
  getTourSlideText,
} from '../src/components/ui/StoryTourModal';
import {
  StoryTourEngine,
  tourRoutePath,
  isOnTourRoute,
} from '../src/lib/storyTourEngine';
import {
  storyCompletedKey,
  storySessionTokenKey,
  markOnboardingStoryPending,
  isStoryTourPending,
  completeStoryTour,
  resetStoryTour,
} from '../src/lib/storyTour';

// Mock browser Storage for deterministic tests
class MockStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  clear(): void {
    this.store.clear();
  }
}

describe('BLOCK 14: STORY TOUR MODAL, ENGINE & LOCALSTORAGE DISMISSAL AUDIT', () => {
  beforeEach(() => {
    (globalThis as any).window = {
      dispatchEvent: () => {},
    };
    (globalThis as any).localStorage = new MockStorage();
    (globalThis as any).sessionStorage = new MockStorage();
  });

  test('Tour slides have valid step sequence and required properties', () => {
    assert.ok(TOUR_SLIDES.length >= 10, 'Must have at least 10 slides');
    assert.strictEqual(TOUR_SLIDES[0].segmentLabel, 'INTRO');
    assert.strictEqual(TOUR_SLIDES[0].durationMs, TOUR_INTRO_MS);

    TOUR_SLIDES.forEach((slide, index) => {
      assert.ok(slide.title, `Slide ${index} missing title`);
      assert.ok(slide.emoji, `Slide ${index} missing emoji`);
      assert.ok(slide.route.startsWith('/'), `Slide ${index} route must start with '/'`);
      assert.ok(slide.durationMs >= 4000, `Slide ${index} duration must be >= 4s`);
      assert.ok(slide.text.length > 0, `Slide ${index} text cannot be empty`);
    });
  });

  test('getTourSlideText correctly interpolates name and mentor variables', () => {
    const slide = TOUR_SLIDES[0];
    const text = getTourSlideText(slide, { name: 'Aditya', mentor: 'Aisha' });
    assert.ok(text.includes('Aditya'), 'Must interpolate {name}');
    assert.ok(text.includes('Aisha'), 'Must interpolate {mentor}');
    assert.ok(!text.includes('{name}'), 'Must not have leftover {name} placeholder');
    assert.ok(!text.includes('{mentor}'), 'Must not have leftover {mentor} placeholder');
  });

  test('tourRoutePath and isOnTourRoute normalize query params and trailing slashes', () => {
    assert.strictEqual(tourRoutePath('/quests?track=sde'), '/quests');
    assert.strictEqual(tourRoutePath('/dashboard/'), '/dashboard');
    assert.strictEqual(tourRoutePath('/'), '/');

    assert.strictEqual(isOnTourRoute('/dashboard', '/dashboard'), true);
    assert.strictEqual(isOnTourRoute('/quests', '/quests?tab=all'), true);
    assert.strictEqual(isOnTourRoute('/missions', '/quests'), false);
  });

  test('StoryTourEngine step navigation advances correctly', () => {
    const activated: number[] = [];
    let finished = false;

    const dummySlides = [
      { route: '/dashboard', durationMs: 5000 },
      { route: '/quests', durationMs: 5000 },
      { route: '/arena', durationMs: 5000 },
    ];

    const host = {
      getPath: () => '/dashboard',
      navigate: () => {},
      onSlideActivated: (idx: number) => activated.push(idx),
      onSlideArmed: () => () => {},
      onPausedChange: () => {},
      onFinished: () => { finished = true; },
    };

    const engine = new StoryTourEngine(dummySlides, host);
    engine.start();

    assert.strictEqual(engine.currentIndex, 0);
    assert.deepStrictEqual(activated, [0]);

    engine.next();
    assert.strictEqual(engine.currentIndex, 1);
    assert.deepStrictEqual(activated, [0, 1]);

    engine.next();
    assert.strictEqual(engine.currentIndex, 2);
    assert.deepStrictEqual(activated, [0, 1, 2]);

    engine.next(); // At end, finishes tour
    assert.strictEqual(finished, true);
  });

  test('localStorage dismissal & lifecycle: markOnboardingStoryPending -> isStoryTourPending -> completeStoryTour', () => {
    const userId = 'usr_test_123';
    
    // Initially not pending because no onboarding token
    assert.strictEqual(isStoryTourPending(userId), false);

    // Onboarding completes: arms session token
    markOnboardingStoryPending(userId);
    assert.strictEqual(isStoryTourPending(userId), true);

    // User completes or dismisses tour
    completeStoryTour(userId);
    assert.strictEqual(localStorage.getItem(storyCompletedKey(userId)), 'true');
    assert.strictEqual(isStoryTourPending(userId), false);

    // If profile has storyTourCompleted, always returns false
    assert.strictEqual(isStoryTourPending(userId, { onboardingAnswers: { storyTourCompleted: true } }), false);

    // Resetting tour clears localStorage completion
    resetStoryTour(userId);
    assert.strictEqual(localStorage.getItem(storyCompletedKey(userId)), null);
  });
});
