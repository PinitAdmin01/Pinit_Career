/**
 * Sign-in and "onboarding complete" (audit 1.1 / 1.2, T14 / T15):
 * - a student signed out on a private page signs in and comes back to that page (only same-site paths);
 * - one rule decides whether onboarding is finished, everywhere: step 3, roadmap generated, or
 *   answers marked complete (on the profile, or this device's saved progress); some saved
 *   answers alone do not count.
 *
 *   node scripts/tests/test_login_onboarding_rules.cjs
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
const FILES = {
  status: path.join(ROOT, 'src/lib/onboarding/onboardingStatus.ts'),
  login: path.join(ROOT, 'src/app/login/page.tsx'),
  shell: path.join(ROOT, 'src/components/ui/AppShell.tsx'),
};
const read = (f) => fs.readFileSync(f, 'utf8');

function compile(source, fileName) {
  return ts.transpileModule(source, { fileName, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
}
function loadStatus(windowObj) {
  if (!fs.existsSync(FILES.status)) return null;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', 'window', compile(read(FILES.status), FILES.status))(() => ({}), mod, mod.exports, windowObj);
  return mod.exports;
}
/** getSafeRedirect from the login page, compiled on its own. */
function loadSafeRedirect() {
  const src = read(FILES.login).replace(/\r\n/g, '\n');
  const start = src.indexOf('function getSafeRedirect');
  const end = src.indexOf('\n}\n', start) + 2;
  const fn = new Function(`${compile(src.slice(start, end), 'safe.ts')}; return getSafeRedirect;`)();
  return fn;
}

let pass = 0, fail = 0;
function test(name, fn) {
  let why;
  try { why = fn(); } catch (e) { why = `threw: ${e.message}`; }
  if (why === true) { pass++; console.log(`  ✓ ${name}`); } else { fail++; console.log(`  ✗ ${name}${why ? ` — ${why}` : ''}`); }
}

console.log('Sign-in redirect and onboarding rule\n');

test('signed out on a private page → sign in, then back to that page', () => {
  const shell = read(FILES.shell);
  if (/\/\?login=true/.test(shell)) return 'still sends students to "/?login=true" (nothing reads it)';
  if (!/router\.push\(`\/login\?redirect=\$\{encodeURIComponent\(`\$\{pathname\}\$\{search\}`\)\}`\)/.test(shell)) return 'no /login?redirect=<page>';
  const anyLeft = [path.join(ROOT, 'src/app/admissions/page.tsx')].some((f) => /\?login=true/.test(read(f)));
  return anyLeft ? 'a link still uses ?login=true' : true;
});

test('the return page must be on this site (no open redirect)', () => {
  const safe = loadSafeRedirect();
  const cases = [
    ['/quests?tab=roadmap', '/quests?tab=roadmap'], ['/projects', '/projects'], [null, '/dashboard'],
    ['//evil.example', '/dashboard'], ['https://evil.example/x', '/dashboard'], ['/\\evil.example', '/dashboard'],
    ['javascript:alert(1)', '/dashboard'],
  ];
  const bad = cases.find(([raw, want]) => safe(raw) !== want);
  return bad ? `${bad[0]} → ${safe(bad[0])}` : true;
});

test('onboarding is finished only when the wizard reached the end', () => {
  const m = loadStatus(undefined);
  if (!m) return 'src/lib/onboarding/onboardingStatus.ts missing';
  const yes = [{ onboardingStep: 3 }, { onboardingStep: '3' }, { roadmapGenerated: true }, { roadmapGenerated: 'true' }, { hasCompleted: true }];
  const no = [null, {}, { onboardingStep: 2 }, { onboardingStep: 1, roadmapGenerated: false }, { hasCompleted: 'yes' }];
  const wrongYes = yes.find((s) => !m.isOnboardingComplete(s));
  const wrongNo = no.find((s) => m.isOnboardingComplete(s));
  if (wrongYes) return `not finished: ${JSON.stringify(wrongYes)}`;
  if (wrongNo) return `finished: ${JSON.stringify(wrongNo)}`;
  return m.isOnboardingComplete({ onboardingStep: 1 }, { onboardingStep: '3' }) ? true : 'this device\'s finished progress ignored';
});

test('profile fields are read in either naming (camelCase or database)', () => {
  const m = loadStatus(undefined);
  const ok = m.isOnboardingComplete(m.onboardingSignalsOf({ onboarding_step: 3 }))
    && m.isOnboardingComplete(m.onboardingSignalsOf({ roadmapGenerated: true }))
    && m.isOnboardingComplete(m.onboardingSignalsOf({ onboarding_answers: { hasCompleted: true } }))
    && !m.isOnboardingComplete(m.onboardingSignalsOf({ onboardingStep: 1, onboarding_answers: { role: 'SDE' } }));
  return ok ? true : 'profile signals misread';
});

test('this device: half-done answers are not "finished"; the wizard\'s end markers are', () => {
  const store = {};
  const win = { localStorage: { getItem: (k) => (k in store ? store[k] : null) } };
  const m = loadStatus(win);
  store['pinit_u1_onboarding_answers'] = JSON.stringify({ role: 'frontend_developer' });
  if (m.isOnboardingComplete(null, m.readLocalOnboardingSignals('u1'))) return 'some saved answers counted as finished';
  store['pinit_u1_ob_step'] = '3';
  if (!m.isOnboardingComplete(null, m.readLocalOnboardingSignals('u1'))) return 'ob_step 3 not counted';
  store['pinit_u2_onboarding_answers'] = '{broken json';
  return m.readLocalOnboardingSignals('u2') === null && m.readLocalOnboardingSignals(null) === null ? true : 'bad storage not handled';
});

test('login page and app shell both use the one rule', () => {
  const login = read(FILES.login);
  const shell = read(FILES.shell);
  if (/!!localStorage\.getItem\(`pinit_\$\{[^}]+\}_onboarding_answers`\)/.test(login)) return 'login still treats any saved answers as finished';
  if ((login.match(/isOnboardingComplete\(onboardingSignalsOf\(/g) || []).length !== 2) return 'login does not use the shared rule in both places';
  if (/_road_gen`\) === 'true'/.test(shell)) return 'app shell keeps its own copy of the rule';
  return /isOnboardingComplete\(/.test(shell) ? true : 'app shell does not use the shared rule';
});

test('"Start free" goes straight to sign-up (no /login?mode=signup hop)', () => {
  const files = ['src/app/page.tsx', 'src/components/landing/GrandFinaleCta.tsx'].map((p) => read(path.join(ROOT, p)));
  return files.some((t) => /\/login\?mode=signup/.test(t)) ? 'a Start free link still goes through /login' : true;
});

test('finishing onboarding navigates to the dashboard without a reload after 1.2s', () => {
  const wizard = read(path.join(ROOT, 'src/app/onboarding/hooks/useOnboardingWizard.ts')).replace(/\r\n/g, '\n');
  if (/window\.location\.href = '\/dashboard';\n\s*\}\n\s*\}, 1200\);/.test(wizard)) return 'early forced reload still present';
  if ((wizard.match(/goToDashboard\(\);/g) || []).length !== 4) return 'not every completion path uses the gentle navigation';
  const retry = /router\.replace\('\/dashboard'\); \}, 1500\)/.test(wizard);
  const lastResort = /window\.location\.href = '\/dashboard'; \}, 6000\)/.test(wizard);
  return retry && lastResort ? true : 'retry / last-resort timing missing';
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
