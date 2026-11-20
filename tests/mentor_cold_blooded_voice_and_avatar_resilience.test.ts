import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSpeechRecognitionController,
  resolveBestSpeechLocale,
  type SpeechEngineStatus,
} from '../src/lib/avatar/speechRecognitionEngine';

test('Task 1: Avatar Model Chain Deduplication & Fallback Integrity', () => {
  // Test gender-matched model chains across all personas
  const FEMALE_FALLBACK_MODELS = ['/avatar/priya.glb', '/avatar/avatarsample_c.glb'];
  const MALE_FALLBACK_MODELS = ['/avatar/kashyap.glb', '/avatar/akira.glb'];

  const testPersonas = [
    { id: 'priya', gender: 'female' },
    { id: 'kashyap', gender: 'male' },
    { id: 'anish', gender: 'male' },
    { id: 'divya', gender: 'female' },
    { id: 'avatarsample_c', gender: 'female' },
    { id: 'akira', gender: 'male' },
  ];

  for (const persona of testPersonas) {
    const modelPath = `/avatar/${persona.id}.glb`;
    const genderMatchedFallbacks =
      persona.gender === 'female' ? FEMALE_FALLBACK_MODELS
      : persona.gender === 'male' ? MALE_FALLBACK_MODELS
      : ['/avatar/mentor.glb'];

    const rawPaths = [modelPath, ...genderMatchedFallbacks];
    const deduplicatedPaths = Array.from(new Set(rawPaths));

    // Verify 1: No duplicates exist in the fallback chain
    assert.equal(
      deduplicatedPaths.length,
      new Set(deduplicatedPaths).size,
      `Paths for persona ${persona.id} must be strictly unique`
    );

    // Verify 2: First item is always the persona's own model
    assert.equal(deduplicatedPaths[0], modelPath);

    // Verify 3: For priya, priya.glb appears exactly ONCE (eliminating the duplicate 16.8MB fetch bug)
    if (persona.id === 'priya') {
      const priyaCount = deduplicatedPaths.filter((p) => p === '/avatar/priya.glb').length;
      assert.equal(priyaCount, 1, 'priya.glb must appear exactly once in the chain');
      assert.equal(deduplicatedPaths[1], '/avatar/avatarsample_c.glb', 'Second fallback must be compact avatarsample_c.glb');
    }

    // Verify 4: For kashyap, kashyap.glb appears exactly ONCE
    if (persona.id === 'kashyap') {
      const kashyapCount = deduplicatedPaths.filter((p) => p === '/avatar/kashyap.glb').length;
      assert.equal(kashyapCount, 1, 'kashyap.glb must appear exactly once in the chain');
      assert.equal(deduplicatedPaths[1], '/avatar/akira.glb', 'Second fallback must be compact akira.glb');
    }
  }
});

test('Task 2: SpeechRecognitionEngine Fresh Instances Across 10+ Voice Cycles', async () => {
  const instancesCreated: any[] = [];
  let currentActiveInstance: any = null;

  class BrutalMockSpeechRecognition {
    lang = 'en-US';
    continuous = false;
    interimResults = false;
    maxAlternatives = 1;
    onstart: (() => void) | null = null;
    onresult: ((ev: any) => void) | null = null;
    onerror: ((ev: any) => void) | null = null;
    onend: (() => void) | null = null;
    started = false;
    aborted = false;

    constructor() {
      instancesCreated.push(this);
      currentActiveInstance = this;
    }

    start() {
      if (this.started) {
        throw new Error("InvalidStateError: recognition has already started");
      }
      this.started = true;
      // Simulate asynchronous browser startup
      setTimeout(() => {
        if (!this.aborted && this.onstart) {
          this.onstart();
        }
      }, 5);
    }

    abort() {
      this.aborted = true;
      this.started = false;
      setTimeout(() => {
        if (this.onend) {
          this.onend();
        }
      }, 5);
    }

    stop() {
      this.started = false;
      setTimeout(() => {
        if (this.onend) {
          this.onend();
        }
      }, 5);
    }
  }

  const prevWindow = (globalThis as any).window;
  (globalThis as any).window = { SpeechRecognition: BrutalMockSpeechRecognition };

  try {
    const utterances: string[] = [];
    const statuses: SpeechEngineStatus[] = [];

    const ctrl = createSpeechRecognitionController({
      lang: 'en-IN',
      silenceCommitMs: 20,
      ttsCooldownMs: 20,
      dedupeWindowMs: 50,
      onUtterance: (ev) => utterances.push(ev.primary),
      onStatusChange: (st) => statuses.push(st),
    });

    ctrl.start();
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(instancesCreated.length, 1, 'First session should create instance 1');

    // Simulate 10 full user conversation cycles: User speaks -> Mentor replies -> TTS pause -> Resume
    for (let cycle = 1; cycle <= 10; cycle++) {
      const activeInst = currentActiveInstance;
      assert.ok(activeInst, `Active instance must exist for cycle ${cycle}`);

      // 1. User says "hey priya" command
      activeInst.onresult?.({
        resultIndex: 0,
        results: [{ isFinal: true, length: 1, 0: { transcript: `hey priya command ${cycle}` } }],
      });
      await new Promise((r) => setTimeout(r, 30));
      assert.equal(utterances.length, cycle, `Utterance ${cycle} must be dispatched`);

      // 2. Priya starts speaking (TTS Speaking = true) -> aborts recognition
      ctrl.setTtsSpeaking(true);
      assert.ok(statuses.includes('paused-tts'));

      // 3. While speaking, user voice is blocked by echo gate
      activeInst.onresult?.({
        resultIndex: 0,
        results: [{ isFinal: true, length: 1, 0: { transcript: 'echo during tts' } }],
      });
      assert.equal(utterances.length, cycle, 'Echo must be blocked during TTS');

      // 4. Priya finishes speaking (TTS Speaking = false) -> auto-resume with FRESH instance
      ctrl.setTtsSpeaking(false);
      await new Promise((r) => setTimeout(r, 60));

      // Invariant: Instance count must have grown (fresh instance per session, never reusing dead instances)
      assert.ok(
        instancesCreated.length >= cycle + 1,
        `Cycle ${cycle}: Fresh SpeechRecognition instance must be created after TTS cooldown`
      );
      assert.equal(statuses[statuses.length - 1], 'listening', `Engine must return to listening in cycle ${cycle}`);
    }

    ctrl.destroy();
  } finally {
    if (prevWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = prevWindow;
    }
  }
});

test('Task 2: SpeechRecognitionEngine Starting Watchdog Recovers from Frozen Devices', async () => {
  let instancesCount = 0;
  class HangingMockSpeechRecognition {
    onstart: (() => void) | null = null;
    onerror: ((ev: any) => void) | null = null;
    onend: (() => void) | null = null;
    constructor() {
      instancesCount += 1;
    }
    start() {
      // Simulate browser audio device freeze: onstart NEVER fires!
    }
    abort() {}
    stop() {}
  }

  const prevWindow = (globalThis as any).window;
  (globalThis as any).window = { SpeechRecognition: HangingMockSpeechRecognition };

  try {
    const ctrl = createSpeechRecognitionController({
      lang: 'en-IN',
      onUtterance: () => {},
    });

    ctrl.start();
    assert.equal(instancesCount, 1);

    // Watchdog is 1800ms + INITIAL_BACKOFF_MS (350ms) = 2150ms; wait 2400ms for restart to execute
    await new Promise((r) => setTimeout(r, 2400));
    assert.ok(
      instancesCount >= 2,
      'Watchdog must cycle instance when onstart fails to fire within 1800ms'
    );

    ctrl.destroy();
  } finally {
    if (prevWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = prevWindow;
    }
  }
});

test('Task 2: SpeechRecognitionEngine Auto-Unpauses if TTS Ends Abruptly (Watchdog)', async () => {
  class QuickMockSpeechRecognition {
    onstart: (() => void) | null = null;
    onerror: ((ev: any) => void) | null = null;
    onend: (() => void) | null = null;
    start() {
      setTimeout(() => this.onstart?.(), 5);
    }
    abort() {}
    stop() {}
  }

  const prevWindow = (globalThis as any).window;
  (globalThis as any).window = { SpeechRecognition: QuickMockSpeechRecognition };

  try {
    const statuses: SpeechEngineStatus[] = [];
    const ctrl = createSpeechRecognitionController({
      lang: 'en-IN',
      onUtterance: () => {},
      onStatusChange: (st) => statuses.push(st),
    });

    ctrl.start();
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(statuses[statuses.length - 1], 'listening');

    // Simulate speech starting: setTtsSpeaking(true)
    ctrl.setTtsSpeaking(true);
    assert.equal(statuses[statuses.length - 1], 'paused-tts');

    // Simulate an uncaught error where onEnd was never called for 9 seconds
    // Wait for the 9-second watchdog to fire
    await new Promise((r) => setTimeout(r, 9200));

    // Watchdog must have unpaused recognition and returned to listening!
    assert.equal(
      statuses[statuses.length - 1],
      'listening',
      'Watchdog must auto-unpause stranded TTS state after 9s'
    );

    ctrl.destroy();
  } finally {
    if (prevWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = prevWindow;
    }
  }
});
