/**
 * Story Mode timeline & TTS contract tests.
 *
 *   node scripts/tests/test_story_mode_timeline.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_story_mode_timeline.cjs)
 *
 * Guards the root causes behind skipped / cut-off tour tabs:
 *  1. Stopped or superseded speech must never fire its onEnd (fake completion).
 *  2. The tour advances only on its own slot clock; nothing late can move a newer slide.
 *  3. Budget: 8s intro + 14 tabs x 5s + 12s academics overview + 5s wrap-up = 95s, and every line fits its slot.
 *
 * Runs the real TypeScript sources (transpiled in-memory) against a fake clock
 * and fake Web Audio / WebSpeech, so it needs `typescript` from node_modules only.
 */
const fs = require('fs');
const path = require('path');

function findRoot(dir) {
  while (!(fs.existsSync(path.join(dir, 'package.json')) && fs.existsSync(path.join(dir, 'src')))) {
    const up = path.dirname(dir);
    if (up === dir) throw new Error('Project root (package.json + src/) not found');
    dir = up;
  }
  return dir;
}

const ROOT = findRoot(__dirname);
const ts = require(require.resolve('typescript', { paths: [ROOT] }));

// Sandbox drafts sit next to this file; after merge the sources live in src/.
function source(localName, srcRel, envVar) {
  if (envVar && process.env[envVar]) return path.resolve(process.env[envVar]);
  const local = path.join(__dirname, localName);
  return fs.existsSync(local) ? local : path.join(ROOT, srcRel);
}

const SOURCES = {
  tts: source('tts.ts', 'src/lib/tts.ts', 'STORY_TTS_PATH'),
  engine: source('storyTourEngine.ts', 'src/lib/storyTourEngine.ts'),
  slides: source('StoryTourModal.tsx', 'src/components/ui/StoryTourModal.tsx'),
};

// Conservative neural speaking rate (smartVoiceRouter.estimateDuration uses the same).
const CHARS_PER_SEC = 14;
const speechMs = (text) => Math.round((text.length / CHARS_PER_SEC) * 1000);

// ── Module loading ───────────────────────────────────────────────────────────
const transpiled = new Map();
function loadTs(file, mocks = {}) {
  if (!transpiled.has(file)) {
    const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      fileName: file,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.React,
        esModuleInterop: true,
      },
    });
    transpiled.set(file, outputText);
  }
  const mod = { exports: {} };
  const req = (spec) => {
    if (Object.prototype.hasOwnProperty.call(mocks, spec)) return mocks[spec];
    throw new Error(`Unexpected import "${spec}" from ${path.basename(file)}`);
  };
  new Function('require', 'module', 'exports', transpiled.get(file))(req, mod, mod.exports);
  return mod.exports;
}

// ── Fake clock (drives setTimeout + Date.now; promises flushed between timers) ─
function createClock() {
  const realSetImmediate = setImmediate;
  const timers = new Map();
  let now = 0;
  let seq = 0;
  const clock = {
    now: () => now,
    setTimeout: (fn, ms = 0, ...args) => {
      const id = ++seq;
      timers.set(id, { at: now + Math.max(0, Number(ms) || 0), fn: () => fn(...args) });
      return id;
    },
    clearTimeout: (id) => { timers.delete(id); },
    async flush() {
      for (let i = 0; i < 8; i++) await new Promise((r) => realSetImmediate(r));
    },
    async advance(ms) {
      const target = now + ms;
      await clock.flush();
      for (;;) {
        let nextId = null;
        let next = null;
        for (const [id, t] of timers) {
          if (t.at <= target && (!next || t.at < next.at)) { next = t; nextId = id; }
        }
        if (!next) break;
        timers.delete(nextId);
        now = next.at;
        next.fn();
        await clock.flush();
      }
      now = target;
    },
  };
  globalThis.setTimeout = clock.setTimeout;
  globalThis.clearTimeout = clock.clearTimeout;
  Date.now = clock.now;
  return clock;
}

// ── Fake browser audio: Web Audio source nodes + speechSynthesis ─────────────
function createTtsEnv({ synthDelayMs = 50, latencyFor } = {}) {
  const clock = createClock();
  const env = { clock, sources: [], utterances: [], synthRequests: [], synthFails: false };

  const ctx = {
    state: 'running',
    resume: async () => {},
    decodeAudioData: async (buf) => ({ durationMs: new Float64Array(buf)[0] }),
    createBufferSource() {
      const src = {
        buffer: null, onended: null, stopped: false, endTimer: null,
        connect() {}, disconnect() {},
        start() {
          src.endTimer = clock.setTimeout(() => {
            src.endTimer = null;
            if (src.stopped) return;
            src.stopped = true;
            if (src.onended) src.onended();
          }, src.buffer.durationMs);
        },
        stop() {
          if (src.stopped) return;
          src.stopped = true;
          if (src.endTimer) clock.clearTimeout(src.endTimer);
          // Browsers still dispatch 'ended' after stop().
          clock.setTimeout(() => { if (src.onended) src.onended(); }, 0);
        },
      };
      env.sources.push(src);
      return src;
    },
  };

  const synth = {
    current: null,
    getVoices: () => [{ name: 'Google US English', lang: 'en-US' }],
    addEventListener() {}, removeEventListener() {}, resume() {},
    speak(u) {
      synth.current = u;
      env.utterances.push(u);
      u.timer = clock.setTimeout(() => {
        if (u.onstart) u.onstart();
        u.timer = clock.setTimeout(() => {
          u.timer = null;
          u.done = true;
          if (synth.current === u) synth.current = null;
          if (u.onend) u.onend();
        }, speechMs(u.text));
      }, 10);
    },
    cancel() {
      const u = synth.current;
      synth.current = null;
      if (!u || u.done) return;
      u.done = true;
      u.cancelled = true;
      if (u.timer) clock.clearTimeout(u.timer);
      // Chrome reports the interruption asynchronously, often after the next utterance is queued.
      clock.setTimeout(() => { if (u.onerror) u.onerror({ error: 'interrupted' }); }, 50);
    },
  };

  globalThis.window = {
    _sharedAudioCtx: ctx,
    speechSynthesis: synth,
    addEventListener() {}, removeEventListener() {},
  };
  globalThis.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) { this.text = text; };

  const mocks = {
    './smartVoiceRouter': {
      synthesizeVoice: ({ text }) => new Promise((resolve, reject) => {
        env.synthRequests.push(text);
        const delay = latencyFor ? latencyFor(text) : synthDelayMs;
        clock.setTimeout(() => {
          if (env.synthFails) return reject(new Error('neural unavailable'));
          const audioBuffer = new ArrayBuffer(1024);
          new Float64Array(audioBuffer)[0] = speechMs(text);
          resolve({ audioBuffer });
        }, delay);
      }),
    },
    './sanitizeLLM': { sanitizeForSpeech: (t) => String(t || '').trim(), SANITIZER_VERSION: 'test' },
    './audio/streamingAudioQueue': {
      splitIntoSentences: (t) => [t],
      getGlobalAudioQueue: () => ({ stopAll() {}, playSentenceStream: () => Promise.reject(new Error('stream path not expected')) }),
      getAvatarVoiceVolume: () => 1,
      setAvatarVoiceVolume() {},
      getAvatarGainNode: () => ({}),
    },
  };
  env.tts = loadTs(SOURCES.tts, mocks);
  return env;
}

function loadSlides() {
  return loadTs(SOURCES.slides, {
    react: { createElement: () => null, useEffect() {}, useRef: () => ({ current: null }) },
    '@/lib/store/useAppStore': { useAppStore: (select) => select({ theme: 'dark' }) },
  });
}

// Host that mimics GlobalAvatar + AppShell: navigation renders after a latency.
function createEngineHarness(slides, { navLatencyMs = 250, renderRoutes = true, onArm } = {}) {
  const clock = createClock();
  const { StoryTourEngine, tourRoutePath } = loadTs(SOURCES.engine);
  const log = [];
  let pathNow = '/dashboard';
  let engine = null;
  const host = {
    getPath: () => pathNow,
    navigate: (route) => {
      log.push({ t: clock.now(), type: 'navigate', route });
      if (!renderRoutes) return;
      clock.setTimeout(() => { pathNow = tourRoutePath(route); engine.notifyPathChange(pathNow); }, navLatencyMs);
    },
    onSlideActivated: (index) => log.push({ t: clock.now(), type: 'activate', index }),
    onSlideArmed: (index, remainingMs) => {
      log.push({ t: clock.now(), type: 'arm', index, remainingMs });
      const cleanup = onArm ? onArm(index, remainingMs) : null;
      return () => { log.push({ t: clock.now(), type: 'disarm', index }); if (cleanup) cleanup(); };
    },
    onPausedChange: (paused) => log.push({ t: clock.now(), type: 'paused', paused }),
    onFinished: () => log.push({ t: clock.now(), type: 'finished' }),
  };
  engine = new StoryTourEngine(slides, host);
  return {
    clock, engine, log,
    setPath: (p) => { pathNow = p; engine.notifyPathChange(p); },
    of: (type) => log.filter((e) => e.type === type),
  };
}

// ── Tiny runner ──────────────────────────────────────────────────────────────
const results = [];
function assert(cond, msg) { if (!cond) throw new Error(msg); }
async function test(name, fn) {
  const { log, warn } = console;
  console.log = () => {};
  console.warn = () => {};
  try {
    await fn();
    results.push({ ok: true, name });
  } catch (err) {
    results.push({ ok: false, name, error: err && err.message ? err.message : String(err) });
  } finally {
    console.log = log;
    console.warn = warn;
  }
}

async function run() {
  // ── 1. Slide budget ────────────────────────────────────────────────────────
  const slidesMod = loadSlides();
  const { TOUR_SLIDES, TOUR_TOTAL_MS, TOUR_SPEECH_START_DEADLINE_MS, getTourSlideText } = slidesMod;
  const ctxLongName = { name: 'Christopher', mentor: 'Ms. Priya' };

  await test('budget: tour totals exactly 95s', async () => {
    const sum = TOUR_SLIDES.reduce((t, s) => t + s.durationMs, 0);
    assert(sum === 95000, `slots sum to ${sum}ms`);
    assert(TOUR_TOTAL_MS === 95000, `TOUR_TOTAL_MS is ${TOUR_TOTAL_MS}`);
  });

  await test('budget: 8s intro, 14 left-sidebar tabs x 5s, one 10-15s academics overview, 5s wrap-up', async () => {
    const tabs = TOUR_SLIDES.filter((s) => s.segmentLabel.startsWith('TAB '));
    assert(tabs.length === 14, `${tabs.length} tab slides`);
    assert(tabs.every((s) => s.durationMs === 5000 && s.segment !== 3), 'every left-sidebar tab slide must be 5000ms');
    const academics = TOUR_SLIDES.filter((s) => s.segment === 3);
    assert(academics.length === 1, `right sidebar must be ONE overview slide, found ${academics.length}`);
    assert(academics[0].durationMs >= 10000 && academics[0].durationMs <= 15000, 'academics overview must be 10-15s');
    assert(TOUR_SLIDES[0].segmentLabel === 'INTRO' && TOUR_SLIDES[0].durationMs === 8000, 'intro must be first, 8s');
    const last = TOUR_SLIDES[TOUR_SLIDES.length - 1];
    assert(last.segmentLabel === 'WRAP-UP' && last.durationMs === 5000, 'wrap-up must be last, 5s');
  });

  await test('budget: every narration line fits its slot (route + deadline + speech + margin)', async () => {
    const worstRouteMs = 300;
    const marginMs = 200;
    const over = TOUR_SLIDES
      .map((s) => ({ s, text: getTourSlideText(s, ctxLongName) }))
      .filter(({ s, text }) => worstRouteMs + TOUR_SPEECH_START_DEADLINE_MS + speechMs(text) + marginMs > s.durationMs)
      .map(({ s, text }) => `"${s.title}" needs ${worstRouteMs + TOUR_SPEECH_START_DEADLINE_MS + speechMs(text) + marginMs}ms of ${s.durationMs}ms (${text.length} chars)`);
    assert(over.length === 0, over.join('; '));
  });

  await test('budget: every tour route has a page', async () => {
    const missing = [...new Set(TOUR_SLIDES.map((s) => s.route.split('?')[0]))]
      .filter((r) => !fs.existsSync(path.join(ROOT, 'src/app', r, 'page.tsx')));
    assert(missing.length === 0, `missing pages: ${missing.join(', ')}`);
  });

  await test('progress line: runs 0% to 100% with no gaps or jumps between slides', async () => {
    const { getTourProgressRange } = slidesMod;
    assert(typeof getTourProgressRange === 'function', 'getTourProgressRange() is missing');
    const ranges = TOUR_SLIDES.map((_, i) => getTourProgressRange(i));
    assert(ranges[0].from === 0, `starts at ${ranges[0].from}`);
    assert(Math.abs(ranges[ranges.length - 1].to - 1) < 1e-9, `ends at ${ranges[ranges.length - 1].to}`);
    ranges.forEach((r, i) => {
      assert(r.to > r.from, `slide ${i} does not grow`);
      if (i > 0) assert(Math.abs(r.from - ranges[i - 1].to) < 1e-9, `gap/jump before slide ${i}`);
      assert(Math.abs((r.to - r.from) * TOUR_TOTAL_MS - TOUR_SLIDES[i].durationMs) < 1e-6, `slide ${i} share != its duration`);
    });
  });

  await test('text: {name} is filled, or dropped cleanly when unknown', async () => {
    const intro = TOUR_SLIDES[0];
    const outro = TOUR_SLIDES[TOUR_SLIDES.length - 1];
    assert(getTourSlideText(intro, { name: 'rammuu', mentor: 'Ms. Priya' }).startsWith("Hi rammuu! I'm Ms. Priya,"), 'intro personalisation');
    assert(getTourSlideText(intro, { name: '', mentor: 'Ms. Priya' }).startsWith("Hi! I'm Ms. Priya,"), 'intro without name');
    assert(getTourSlideText(outro, { name: '' }).startsWith("That's the tour!"), 'outro without name');
    assert(!/\{(name|mentor)\}/.test(TOUR_SLIDES.map((s) => getTourSlideText(s, ctxLongName)).join(' ')), 'unfilled placeholder');
  });

  // ── 2. TTS contract ────────────────────────────────────────────────────────
  const LINE = 'Quests and Courses: guided lessons that earn Pins.';

  await test('tts: stopSpeaking() during neural playback never fires the old onEnd', async () => {
    const { clock, tts } = createTtsEnv();
    let starts = 0;
    let ends = 0;
    tts.speakWithAvatar(LINE, 'priya', () => starts++, () => ends++);
    await clock.advance(1000);
    assert(starts === 1, 'speech should be playing');
    tts.stopSpeaking(true);
    await clock.advance(8000);
    assert(ends === 0, `onEnd fired ${ends}x after stopSpeaking() (fake completion)`);
  });

  await test('tts: natural neural end fires onEnd exactly once', async () => {
    const { clock, tts } = createTtsEnv();
    let ends = 0;
    tts.speakWithAvatar(LINE, 'priya', () => {}, () => ends++);
    await clock.advance(8000);
    assert(ends === 1, `onEnd fired ${ends}x`);
  });

  await test('tts: superseded neural speech stays silent; only the new one completes', async () => {
    const { clock, tts } = createTtsEnv();
    let oldEnds = 0;
    let newEnds = 0;
    tts.speakWithAvatar(LINE, 'priya', () => {}, () => oldEnds++);
    await clock.advance(1500);
    tts.speakWithAvatar('Daily Missions: five quick challenges on your gaps.', 'priya', () => {}, () => newEnds++);
    await clock.advance(8000);
    assert(oldEnds === 0, `superseded onEnd fired ${oldEnds}x`);
    assert(newEnds === 1, `new onEnd fired ${newEnds}x`);
  });

  await test('tts: stopSpeaking() during WebSpeech never fires the old onEnd', async () => {
    const { clock, tts } = createTtsEnv();
    let ends = 0;
    tts.speakWithAvatar(LINE, 'priya', () => {}, () => ends++, false, false);
    await clock.advance(1000);
    tts.stopSpeaking(true);
    await clock.advance(8000);
    assert(ends === 0, `onEnd fired ${ends}x after stopSpeaking() (fake completion)`);
  });

  await test("tts: a stale utterance's interruption error does not cancel the next utterance", async () => {
    const { clock, tts, utterances } = createTtsEnv();
    let oldEnds = 0;
    let newEnds = 0;
    tts.speakWithAvatar(LINE, 'priya', () => {}, () => oldEnds++, false, false);
    await clock.advance(1000);
    tts.speakWithAvatar('Arena: live one-on-one coding duels against peers.', 'priya', () => {}, () => newEnds++, false, false);
    await clock.advance(8000);
    const second = utterances[utterances.length - 1];
    assert(!second.cancelled, 'second utterance was cancelled by the first one\'s error handler');
    assert(oldEnds === 0 && newEnds === 1, `onEnd counts old=${oldEnds} new=${newEnds}`);
  });

  await test('tts: tour lock suppresses non-forced speech instead of cutting the tour off', async () => {
    const { clock, tts, synthRequests } = createTtsEnv();
    assert(typeof tts.setStoryTourAudioLock === 'function', 'setStoryTourAudioLock() is missing');
    tts.setStoryTourAudioLock(true);
    let tourEnds = 0;
    tts.speakWithAvatar(LINE, 'priya', () => {}, () => tourEnds++, false, true, undefined, 1, 5000, { force: true });
    await clock.advance(500);
    tts.speakWithAvatar('Welcome to your interview!', 'vikram', () => {}, () => {});
    tts.stopSpeaking();
    await clock.advance(8000);
    tts.setStoryTourAudioLock(false);
    assert(!synthRequests.includes('Welcome to your interview!'), 'page speech was not suppressed');
    assert(tourEnds === 1, `tour narration onEnd fired ${tourEnds}x (expected a natural end)`);
  });

  await test('tts: startDeadlineMs hands slow neural audio to WebSpeech and drops the late result', async () => {
    const { clock, tts, sources, utterances } = createTtsEnv({ synthDelayMs: 3000 });
    let ends = 0;
    tts.speakWithAvatar(LINE, 'priya', () => {}, () => ends++, false, true, undefined, 1, 5000,
      { force: true, singleShot: true, startDeadlineMs: 700 });
    await clock.advance(760);
    assert(utterances.length === 1, 'WebSpeech should have taken over at the deadline');
    await clock.advance(8000);
    assert(sources.length === 0, 'late neural audio must not play on top of WebSpeech');
    assert(ends === 1, `onEnd fired ${ends}x`);
  });

  await test('tts: preloadTTS requests exactly what speakWithAvatar will synthesize', async () => {
    const { clock, tts, synthRequests } = createTtsEnv();
    const text = 'You must keep your streak.';
    const preload = tts.preloadTTS(text, 'priya', 1.0);
    await clock.advance(200);
    await preload;
    tts.speakWithAvatar(text, 'priya', () => {}, () => {}, false, true, undefined, 1.0, 5000, { singleShot: true });
    await clock.advance(5000);
    assert(synthRequests.length === 2 && synthRequests[0] === synthRequests[1],
      `cache keys differ: ${JSON.stringify(synthRequests)}`);
  });

  // ── 3. Engine timeline ─────────────────────────────────────────────────────
  await test('engine: full tour visits every slide once, in order, and finishes at 95s', async () => {
    const h = createEngineHarness(TOUR_SLIDES);
    h.engine.start(0);
    await h.clock.advance(100000);
    const order = TOUR_SLIDES.map((_, i) => i).join(',');
    assert(h.of('activate').map((e) => e.index).join(',') === order, 'activation order');
    assert(h.of('arm').map((e) => e.index).join(',') === order, 'every slide armed exactly once');
    let t = 0;
    h.of('activate').forEach((e, i) => {
      assert(e.t === t, `slide ${i} activated at ${e.t}ms, expected ${t}ms`);
      t += TOUR_SLIDES[i].durationMs;
    });
    const fin = h.of('finished');
    assert(fin.length === 1 && fin[0].t === 95000, `finished at ${fin.map((e) => e.t)}`);
    assert(h.of('arm').every((e) => e.remainingMs >= TOUR_SLIDES[e.index].durationMs - 300), 'slides armed late');
  });

  await test('engine: Next mid-slide restarts the clock; the old slot timer cannot skip the new slide', async () => {
    const h = createEngineHarness(TOUR_SLIDES);
    h.engine.start(1);
    await h.clock.advance(2000);
    h.engine.next();
    await h.clock.advance(9000);
    const acts = h.of('activate');
    assert(acts[1].index === 2 && acts[1].t === 2000, 'Next should activate slide 2 at 2000ms');
    assert(acts[2].index === 3 && acts[2].t === 7000, `slide 3 activated at ${acts[2] && acts[2].t}ms, expected 7000ms`);
  });

  await test('engine: route guard pauses when the user leaves the slide page; Next resumes', async () => {
    const h = createEngineHarness(TOUR_SLIDES);
    h.engine.start(2);
    await h.clock.advance(1000);
    h.setPath('/friends');
    await h.clock.advance(6000);
    assert(h.of('activate').length === 1, 'must not auto-advance off-route');
    assert(h.of('paused').some((e) => e.paused), 'should report paused');
    h.engine.next();
    await h.clock.advance(100);
    assert(h.of('activate')[1].index === 3, 'Next resumes with the following slide');
    assert(h.of('paused').slice(-1)[0].paused === false, 'pause cleared');
  });

  await test('engine: a route that never renders still narrates and advances on time', async () => {
    const h = createEngineHarness(TOUR_SLIDES, { renderRoutes: false });
    const { TOUR_ROUTE_WAIT_MS } = loadTs(SOURCES.engine);
    h.engine.start(2);
    await h.clock.advance(5000);
    const arm = h.of('arm')[0];
    assert(arm && arm.t === TOUR_ROUTE_WAIT_MS, `armed at ${arm && arm.t}ms`);
    assert(h.of('activate').length === 2, 'should advance at slot end');
  });

  await test('engine: stop() cancels everything without finishing', async () => {
    const h = createEngineHarness(TOUR_SLIDES);
    h.engine.start(0);
    await h.clock.advance(3000);
    h.engine.stop();
    const before = h.log.length;
    await h.clock.advance(100000);
    assert(h.log.length === before, 'events after stop()');
    assert(h.of('finished').length === 0, 'stop() must not finish the tour');
  });

  await test('engine: Next on the last slide finishes the tour', async () => {
    const h = createEngineHarness(TOUR_SLIDES);
    h.engine.start(TOUR_SLIDES.length - 1);
    h.engine.next();
    await h.clock.advance(10);
    assert(h.of('finished').length === 1, 'finished once');
  });

  // ── 4. Engine + TTS together, under mixed network latency ──────────────────
  await test('integration: every tab is narrated inside its slot with mixed TTS latency', async () => {
    // Cold / uncached / cached mix: first two slides slow, then alternating.
    const latencyFor = (text) => {
      const i = TOUR_SLIDES.findIndex((s) => getTourSlideText(s, ctxLongName) === text);
      if (i <= 1) return 20000;
      return i % 2 ? 1200 : 60;
    };
    const env = createTtsEnv({ latencyFor });
    const started = new Map();
    const endedAt = new Map();
    const staleEnds = [];
    const { StoryTourEngine, tourRoutePath } = loadTs(SOURCES.engine);
    let pathNow = '/dashboard';
    let activeIndex = -1;
    const activatedAt = new Map();
    let finishedAt = null;
    const engine = new StoryTourEngine(TOUR_SLIDES, {
      getPath: () => pathNow,
      navigate: (route) => { env.clock.setTimeout(() => { pathNow = tourRoutePath(route); engine.notifyPathChange(pathNow); }, 250); },
      onSlideActivated: (i) => { activeIndex = i; activatedAt.set(i, env.clock.now()); },
      onSlideArmed: (i) => {
        const slide = TOUR_SLIDES[i];
        env.tts.speakWithAvatar(getTourSlideText(slide, ctxLongName), 'priya',
          () => started.set(i, env.clock.now()),
          () => {
            // Recorded, not thrown: tts swallows errors raised inside onEnd.
            if (activeIndex !== i) staleEnds.push(`slide ${i} ended while slide ${activeIndex} was showing`);
            endedAt.set(i, env.clock.now());
          },
          false, true, undefined, 1.0, slide.durationMs,
          { force: true, singleShot: true, startDeadlineMs: TOUR_SPEECH_START_DEADLINE_MS });
        return () => env.tts.stopSpeaking(true);
      },
      onPausedChange: () => {},
      onFinished: () => { finishedAt = env.clock.now(); },
    });
    env.tts.setStoryTourAudioLock(true);
    engine.start(0);
    await env.clock.advance(100000);
    const silent = TOUR_SLIDES.map((_, i) => i).filter((i) => !started.has(i));
    assert(silent.length === 0, `slides never narrated: ${silent.join(', ')}`);
    assert(staleEnds.length === 0, staleEnds.join('; '));
    const cut = TOUR_SLIDES.map((s, i) => i).filter((i) => !endedAt.has(i) || endedAt.get(i) > activatedAt.get(i) + TOUR_SLIDES[i].durationMs);
    assert(cut.length === 0, `narration cut off on slides: ${cut.join(', ')}`);
    assert(finishedAt === 95000, `finished at ${finishedAt}ms`);
  });

  // ── Report ─────────────────────────────────────────────────────────────────
  const rel = (p) => path.relative(ROOT, p);
  console.log('Story Mode timeline tests');
  console.log(`  tts: ${rel(SOURCES.tts)}\n  engine: ${rel(SOURCES.engine)}\n  slides: ${rel(SOURCES.slides)}\n`);
  for (const r of results) {
    console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : `\n        -> ${r.error}`}`);
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
}

module.exports = { loadTs, createClock, createTtsEnv, loadSlides, SOURCES, speechMs };

if (require.main === module) {
  // Fake timers don't keep Node alive: a test awaiting one would exit silently.
  process.on('beforeExit', () => {
    const last = results.length ? results[results.length - 1].name : '(none)';
    console.error(`Test run stalled on a promise that never settled (last finished: ${last}).`);
    process.exit(1);
  });
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
