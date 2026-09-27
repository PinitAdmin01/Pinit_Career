/**
 * Career projects survive a reload (audit 4b.3).
 *
 *   node scripts/tests/test_projects_persist.cjs
 *   (from the sandbox: node dark-gracity/claude_sandbox/test_projects_persist.cjs)
 *   PROJECTS_SRC=src … runs the same checks against the current src/ files.
 *
 * saveCareerProjects (UserProgressContext) stores projects in onboarding_answers.portfolio_projects;
 * the Projects page read onboarding_answers.projects, which nothing writes. The provider runs for
 * real under a minimal hook runtime (same harness as test_onboarding_answers_integrity.cjs).
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
const USE_SRC = process.env.PROJECTS_SRC === 'src' || !fs.existsSync(path.join(__dirname, 'savedProjects.ts'));
const pick = (sandboxName, srcRel) => (USE_SRC || !fs.existsSync(path.join(__dirname, sandboxName)) ? path.join(ROOT, srcRel) : path.join(__dirname, sandboxName));
const FILES = {
  helper: pick('savedProjects.ts', 'src/lib/projects/savedProjects.ts'),
  page: pick('projects-page.tsx', 'src/app/projects/page.tsx'),
  timeline: pick('TimelineSection.tsx', 'src/app/profile/tabs/portfolio/TimelineSection.tsx'),
  provider: pick('UserProgressContext.tsx', 'src/lib/context/UserProgressContext.tsx'),
};
const USER_ID = '8f14e45f-ceea-467a-9f6e-5b7c1a2d3e4f';
const PROJECTS = [
  { id: 'proj_1', name: 'Realtime Chat', status: 'In Progress' },
  { id: 'proj_2', name: 'Expense Tracker', status: 'Not Started' },
];

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

/** Mounts the real provider. Pass the previous `store` to simulate a page reload in the same browser. */
function mountProvider(user, store = {}) {
  const localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
  globalThis.window = { localStorage, addEventListener() {}, removeEventListener() {} };
  globalThis.localStorage = localStorage;
  const profileWrites = [];
  const runtime = createRuntime();
  const mocks = {
    react: runtime.React,
    '@/lib/store/useAppStore': { toast: { success() {}, error() {}, info() {}, warning() {} } },
    '@/lib/context/AuthContext': { useAuth: () => ({ user }) },
    '@/lib/api/client': { api: { post: async () => ({ ok: true }), patch: async () => ({ ok: true }), get: async () => ({ ok: true }) } },
    '@/lib/missions/streak': { consecutiveCalendarStreak: () => 0 },
    '@/lib/supabaseClient': { supabase: {} },
    '@/lib/supabaseService': {
      persistQuestCompletion: async () => {},
      syncRewardsDB: async () => {},
      updateUserProfile: async (_uid, updates) => { profileWrites.push(JSON.parse(JSON.stringify(updates))); return null; },
    },
    '@/lib/storyTour': { markOnboardingStoryPending() {} },
    '@/lib/storage/careerStorage': { safeLocalStorageSetItem: (k, v) => { store[k] = v; return { success: true }; } },
    '@/lib/data/roadmapFuser': { generateDynamicStudentRoadmap: () => [] },
  };
  const { outputText } = ts.transpileModule(fs.readFileSync(FILES.provider, 'utf8'), {
    fileName: FILES.provider,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true },
  });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', outputText)((spec) => {
    if (spec in mocks) return mocks[spec];
    throw new Error(`Unexpected import "${spec}"`);
  }, mod, mod.exports);
  runtime.mount(() => mod.exports.UserProgressProvider({ children: null }));
  return { runtime, store, profileWrites };
}

function loadHelper() {
  if (!fs.existsSync(FILES.helper)) return null;
  const { outputText } = ts.transpileModule(fs.readFileSync(FILES.helper, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(() => ({}), mod, mod.exports);
  return mod.exports;
}

// ── Tests ────────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
async function test(name, fn) {
  const { warn, error, log } = console;
  console.warn = () => {}; console.error = () => {}; console.log = () => {};
  let why;
  try { why = await fn(); } catch (e) { why = `threw: ${e.message}`; }
  finally { console.warn = warn; console.error = error; console.log = log; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

(async () => {
  console.log(`Career projects persistence (page: ${path.relative(ROOT, FILES.page)})\n`);
  const helper = loadHelper();

  await test('helper reads portfolio_projects first, then the legacy key, ignores junk', async () => {
    if (!helper) return 'src/lib/projects/savedProjects.ts missing';
    const { getSavedCareerProjects: get, needsProjectKeyMigration: migrate } = helper;
    if (get({ portfolio_projects: PROJECTS, projects: [{ id: 'old' }] }).length !== 2) return 'portfolio_projects not preferred';
    if (get({ projects: PROJECTS }).length !== 2) return 'legacy key not read';
    if (get({ portfolio_projects: 'oops' }).length !== 0 || get(null).length !== 0 || get({ projects: [1, 2] }).length !== 0) return 'junk accepted';
    if (!migrate({ projects: PROJECTS }) || migrate({ portfolio_projects: PROJECTS, projects: PROJECTS })) return 'migration flag wrong';
    return true;
  });

  await test('saved projects are there after a reload (same browser)', async () => {
    if (!helper) return 'helper missing';
    const first = mountProvider({ id: USER_ID });
    await first.runtime.flush();
    first.runtime.latest().saveCareerProjects(PROJECTS);
    await first.runtime.flush();
    const reload = mountProvider({ id: USER_ID }, first.store);
    await reload.runtime.flush();
    const got = helper.getSavedCareerProjects(reload.runtime.latest().onboardingAnswers);
    return got.length === 2 && got[0].id === 'proj_1' ? true : `after reload: ${got.length} project(s)`;
  });

  await test('saved projects are there on another device (database copy only)', async () => {
    if (!helper) return 'helper missing';
    const first = mountProvider({ id: USER_ID });
    await first.runtime.flush();
    first.runtime.latest().saveCareerProjects(PROJECTS);
    await first.runtime.flush();
    const dbWrite = [...first.profileWrites].reverse().find((w) => w.onboarding_answers);
    if (!dbWrite) return 'projects never written to the database';
    const other = mountProvider({ id: USER_ID, onboardingAnswers: dbWrite.onboarding_answers });
    await other.runtime.flush();
    const got = helper.getSavedCareerProjects(other.runtime.latest().onboardingAnswers);
    return got.length === 2 ? true : `other device: ${got.length} project(s)`;
  });

  await test('Projects page reads the key projects are saved under', async () => {
    const src = fs.readFileSync(FILES.page, 'utf8');
    if (/setProjects\(\s*onboardingAnswers\.projects\s*\)/.test(src)) return 'page still loads only onboarding_answers.projects (never written)';
    return /getSavedCareerProjects\(/.test(src) ? true : 'page does not use getSavedCareerProjects';
  });

  await test('portfolio timeline counts the same saved projects', async () => {
    const src = fs.readFileSync(FILES.timeline, 'utf8');
    if (/onboardingAnswers\?\.projects\?\.length/.test(src)) return 'timeline still counts onboarding_answers.projects';
    return /getSavedCareerProjects\(/.test(src) ? true : 'timeline does not use getSavedCareerProjects';
  });

  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(fail ? 1 : 0);
})();
