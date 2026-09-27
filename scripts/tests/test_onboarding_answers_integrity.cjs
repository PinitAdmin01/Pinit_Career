/**
 * Onboarding answers integrity (UserProgressContext).
 *
 *   node scripts/tests/test_onboarding_answers_integrity.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_onboarding_answers_integrity.cjs)
 *
 * Runs the real provider under a minimal hook runtime (useState / useRef / useMemo /
 * useCallback / useEffect with real re-render and closure semantics) — no DOM needed.
 * Callers hold on to an old context value exactly like the onboarding wizard does, which
 * is what used to write the pre-onboarding answers back over the new ones.
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

const PROVIDER = process.env.USER_PROGRESS_PATH
  ? path.resolve(process.env.USER_PROGRESS_PATH)
  : fs.existsSync(path.join(__dirname, 'UserProgressContext.tsx'))
    ? path.join(__dirname, 'UserProgressContext.tsx')
    : path.join(ROOT, 'src/lib/context/UserProgressContext.tsx');

const USER_ID = '8f14e45f-ceea-467a-9f6e-5b7c1a2d3e4f';
const ANSWERS_KEY = `pinit_${USER_ID}_onboarding_answers`;

// ── Minimal hook runtime ─────────────────────────────────────────────────────
function createRuntime() {
  const hooks = [];
  let index = 0;
  let pendingEffects = [];
  let scheduled = false;
  let renderFn = null;
  let latestElement = null;

  const depsEqual = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; render(); });
  };
  function render() {
    index = 0;
    pendingEffects = [];
    latestElement = renderFn();
    for (const e of pendingEffects) {
      const slot = hooks[e.i];
      if (slot.cleanup) slot.cleanup();
      const cleanup = e.fn();
      slot.cleanup = typeof cleanup === 'function' ? cleanup : null;
    }
  }

  const React = {
    createContext: (defaultValue) => ({ Provider: 'Provider', defaultValue }),
    useContext: (ctx) => ctx.defaultValue,
    createElement: (type, props, ...children) => ({ type, props: { ...(props || {}), children } }),
    useState(init) {
      const i = index++;
      if (!hooks[i]) {
        const slot = { value: typeof init === 'function' ? init() : init };
        slot.set = (v) => {
          const next = typeof v === 'function' ? v(slot.value) : v;
          if (Object.is(next, slot.value)) return;
          slot.value = next;
          schedule();
        };
        hooks[i] = slot;
      }
      return [hooks[i].value, hooks[i].set];
    },
    useRef(init) {
      const i = index++;
      if (!hooks[i]) hooks[i] = { current: init };
      return hooks[i];
    },
    useMemo(fn, deps) {
      const i = index++;
      if (hooks[i] && depsEqual(hooks[i].deps, deps)) return hooks[i].value;
      hooks[i] = { value: fn(), deps };
      return hooks[i].value;
    },
    useCallback(fn, deps) { return React.useMemo(() => fn, deps); },
    useEffect(fn, deps) {
      const i = index++;
      if (!hooks[i]) hooks[i] = { deps: undefined, cleanup: null };
      if (deps && depsEqual(hooks[i].deps, deps)) return;
      hooks[i].deps = deps;
      pendingEffects.push({ i, fn });
    },
  };
  React.default = React;
  React.__esModule = true;

  return {
    React,
    mount(fn) { renderFn = fn; render(); },
    latest: () => latestElement.props.value,
    async flush() { for (let i = 0; i < 10; i++) await new Promise((r) => setImmediate(r)); },
  };
}

// ── Environment + module mocks ───────────────────────────────────────────────
function setup(user) {
  const store = {};
  const localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
  globalThis.window = { localStorage, addEventListener() {}, removeEventListener() {} };
  globalThis.localStorage = localStorage;

  const apiCalls = [];
  const profileWrites = [];
  const runtime = createRuntime();
  const mocks = {
    react: runtime.React,
    '@/lib/store/useAppStore': { toast: { success() {}, error() {}, info() {}, warning() {} } },
    '@/lib/context/AuthContext': { useAuth: () => ({ user }) },
    '@/lib/api/client': {
      api: {
        post: async (p, body) => {
          apiCalls.push({ path: p, body });
          if (p === '/api/career-builder/generate') return { ok: true, modules: [{ id: 'mod-1', title: 'Module 1', quests: [] }] };
          return { ok: true };
        },
        patch: async () => ({ ok: true }),
        get: async () => ({ ok: true }),
      },
    },
    '@/lib/missions/streak': { consecutiveCalendarStreak: () => 0 },
    '@/lib/supabaseClient': { supabase: {} },
    '@/lib/supabaseService': {
      persistQuestCompletion: async () => {},
      syncRewardsDB: async () => {},
      updateUserProfile: async (_uid, updates) => { profileWrites.push(updates); return null; },
    },
    '@/lib/storyTour': { markOnboardingStoryPending() {} },
    '@/lib/storage/careerStorage': { safeLocalStorageSetItem: (k, v) => { store[k] = v; return { success: true }; } },
    '@/lib/data/roadmapFuser': { generateDynamicStudentRoadmap: () => [{ id: 'fallback', title: 'Fallback', quests: [] }] },
  };

  const { outputText } = ts.transpileModule(fs.readFileSync(PROVIDER, 'utf8'), {
    fileName: PROVIDER,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true },
  });
  const mod = { exports: {} };
  const req = (spec) => {
    if (spec in mocks) return mocks[spec];
    throw new Error(`Unexpected import "${spec}"`);
  };
  new Function('require', 'module', 'exports', outputText)(req, mod, mod.exports);

  runtime.mount(() => mod.exports.UserProgressProvider({ children: null }));
  return { runtime, store, apiCalls, profileWrites };
}

const ONBOARDING_RESULT = {
  role: 'React Frontend Web SDE',
  career_goal: 'Ship production React apps',
  education: 'B.Tech CSE',
  skills: 'React 18, TypeScript',
  experience: 'fresher',
  diagnosticProfile: { behaviorProfile: { dominantArchetype: 'Explorer' } },
  qt1_score: 42,
  qt2_score: 48,
  mindset_archetype: 'Explorer',
};

const results = [];
function assert(cond, msg) { if (!cond) throw new Error(msg); }
async function test(name, fn) {
  const { warn, error, log } = console;
  console.warn = () => {}; console.error = () => {}; console.log = () => {};
  try { await fn(); results.push({ ok: true, name }); }
  catch (err) { results.push({ ok: false, name, error: err.message }); }
  finally { console.warn = warn; console.error = error; console.log = log; }
}

async function completeOnboarding(env) {
  await env.runtime.flush();
  const staleCtx = env.runtime.latest(); // the wizard keeps using this value
  staleCtx.setOnboarding(ONBOARDING_RESULT, true);
  await staleCtx.generateFusedRoadmap(['React'], ['Testing'], 'course-react-web');
  await env.runtime.flush();
}

(async () => {
  await test('onboarding answers survive roadmap generation (state and storage)', async () => {
    const env = setup({ id: USER_ID });
    await completeOnboarding(env);
    const answers = env.runtime.latest().onboardingAnswers;
    const stored = JSON.parse(env.store[ANSWERS_KEY] || '{}');
    for (const [label, a] of [['state', answers], ['localStorage', stored]]) {
      assert(a.role === 'React Frontend Web SDE', `${label}: role is ${JSON.stringify(a.role)}`);
      assert(a.diagnosticProfile && a.qt1_score === 42 && a.mindset_archetype === 'Explorer', `${label}: persona/scores lost`);
      assert(Array.isArray(a.roadmap_modules) && a.roadmap_modules.length === 1, `${label}: roadmap missing`);
    }
  });

  await test('roadmap is generated for the onboarding role, not the default', async () => {
    const env = setup({ id: USER_ID });
    await completeOnboarding(env);
    const gen = env.apiCalls.find((c) => c.path === '/api/career-builder/generate');
    assert(gen, 'generate API not called');
    assert(gen.body.targetRole === 'React Frontend Web SDE', `targetRole sent: ${gen.body.targetRole}`);
  });

  await test('no database write replaces the answers with a copy missing the onboarding data', async () => {
    const env = setup({ id: USER_ID });
    await completeOnboarding(env);
    const bad = env.profileWrites.filter((w) => w.onboarding_answers &&
      (w.onboarding_answers.role !== ONBOARDING_RESULT.role || !w.onboarding_answers.diagnosticProfile));
    assert(bad.length === 0, `${bad.length} write(s) of onboarding_answers with the wrong role or no persona ` +
      `(e.g. role ${JSON.stringify(bad[0] && bad[0].onboarding_answers.role)})`);
  });

  await test('pre-onboarding placeholder answers are never saved as the student\'s', async () => {
    const env = setup({ id: USER_ID });
    await completeOnboarding(env);
    const stored = JSON.parse(env.store[ANSWERS_KEY] || '{}');
    const leaked = ['goal', 'weakAreas', 'targetCompanies'].filter((k) => k in stored);
    assert(leaked.length === 0, `placeholder field(s) saved: ${leaked.join(', ')}`);
    assert(stored.education === 'B.Tech CSE', `education is ${JSON.stringify(stored.education)}`);
  });

  await test('dashboard trajectory change keeps persona and scores (merge, not replace)', async () => {
    const env = setup({ id: USER_ID });
    await completeOnboarding(env);
    const ctx = env.runtime.latest();
    ctx.setOnboarding({ role: 'Cloud & DevOps Engineer', education: 'B.Tech CSE', skills: 'Docker', experience: 'None' });
    await ctx.generateFusedRoadmap(['Docker'], ['CI/CD'], 'course-devops-cicd');
    await env.runtime.flush();
    const a = env.runtime.latest().onboardingAnswers;
    assert(a.role === 'Cloud & DevOps Engineer', `role is ${a.role}`);
    assert(a.diagnosticProfile && a.qt1_score === 42, 'persona/scores wiped by trajectory change');
    const serverSync = env.apiCalls.filter((c) => c.path === '/api/auth/onboarding').map((c) => c.body);
    assert(serverSync.some((b) => b.onboardingAnswers && b.onboardingAnswers.role === 'Cloud & DevOps Engineer'),
      'server sync does not carry the new role inside onboardingAnswers');
  });

  await test('hydration restores a stripped career role from users.target_role', async () => {
    const env = setup({ id: USER_ID, targetRole: 'Data & Business Analytics Specialist', onboardingAnswers: { hasCompleted: true, qt1_score: 40 } });
    await env.runtime.flush();
    const a = env.runtime.latest().onboardingAnswers;
    assert(a.role === 'Data & Business Analytics Specialist', `role is ${JSON.stringify(a.role)}`);
  });

  console.log(`Onboarding answers integrity (provider: ${path.relative(ROOT, PROVIDER)})\n`);
  for (const r of results) console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : `\n        -> ${r.error}`}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
