import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  createSpeechRecognitionController,
  resolveBestSpeechLocale,
  type SpeechEngineStatus,
} from '../src/lib/avatar/speechRecognitionEngine';
import {
  resolveAvatarModelPaths,
} from '../src/components/avatar/VRoidAvatarEngine';

test('Task 1: Avatar Model Chain Deduplication, Gender Parity & Priya Isolation', () => {
  const publicDir = path.resolve(process.cwd(), 'public');

  const expectedFastHead: Record<string, string> = {
    priya: '/avatar/avatarsample_u.glb',
    sneha: '/avatar/avatarsample_j.glb',
    rohan: '/avatar/avatarsample_v.glb',
    vikram: '/avatar/avatarsample_x.glb',
    kashyap: '/avatar/avatarsample_r.glb',
    anish: '/avatar/avatarsample_c.glb',
    karthic: '/avatar/akira.glb',
    aditya: '/avatar/mika.glb',
    divya: '/avatar/yuki.glb',
  };

  for (const [id, expectedFast] of Object.entries(expectedFastHead)) {
    const chain = resolveAvatarModelPaths(id, true);
    assert.equal(chain.length, new Set(chain).size, `Paths for persona ${id} must be strictly unique`);
    assert.equal(chain[0], expectedFast, `Fast binary twin for ${id} must load first`);
    for (const modelUrl of chain) {
      const diskPath = path.join(publicDir, modelUrl.replace(/^\//, ''));
      assert.ok(fs.existsSync(diskPath), `Model asset ${modelUrl} for ${id} must exist on disk`);
    }
  }

  for (const maleId of ['rohan', 'vikram', 'kashyap', 'anish']) {
    const chain = resolveAvatarModelPaths(maleId, true);
    assert.ok(!chain.includes('/avatar/avatarsample_m.glb'), `Male persona ${maleId} must NEVER use female avatarsample_m.glb`);
    assert.ok(!chain.includes('/avatar/avatarsample_u.glb'), `Male persona ${maleId} must NEVER use Priya rig`);
    assert.ok(!chain.includes('/avatar/priya.glb'), `Male persona ${maleId} must NEVER use priya.glb`);
  }

  for (const femInterviewId of ['sneha', 'aisha', 'divya']) {
    const chain = resolveAvatarModelPaths(femInterviewId, true);
    assert.ok(!chain.includes('/avatar/avatarsample_u.glb'), `Female persona ${femInterviewId} must NEVER fall back to Priya rig`);
    assert.ok(!chain.includes('/avatar/priya.glb'), `Female persona ${femInterviewId} must NEVER fall back to priya.glb`);
    assert.ok(!chain.includes('/avatar/mika.glb'), `Female persona ${femInterviewId} must NEVER use male aditya twin mika.glb`);
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
