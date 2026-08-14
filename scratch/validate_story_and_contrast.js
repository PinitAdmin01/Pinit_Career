/**
 * Static + behavioral validation for onboarding contrast + 3-segment story tour.
 * Run: node scratch/validate_story_and_contrast.js
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const fail = [];
const pass = [];
const ok = (name) => { pass.push(name); console.log('  PASS  ' + name); };
const bad = (name, detail) => { fail.push(name); console.log('  FAIL  ' + name + (detail ? ' — ' + detail : '')); };

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

console.log('\n=== 1. Story flag state machine ===');
{
  const src = read('src/lib/storyTour.ts');
  const { outputText } = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
  });

  let ls = {};
  let ss = {};
  const prevWindow = global.window;
  const prevLS = global.localStorage;
  const prevSS = global.sessionStorage;
  global.window = {};
  global.localStorage = {
    getItem: (k) => (k in ls ? ls[k] : null),
    setItem: (k, v) => { ls[k] = String(v); },
    removeItem: (k) => { delete ls[k]; },
  };
  global.sessionStorage = {
    getItem: (k) => (k in ss ? ss[k] : null),
    setItem: (k, v) => { ss[k] = String(v); },
    removeItem: (k) => { delete ss[k]; },
  };

  const mod = { exports: {} };
  new Function('exports', 'module', 'require', outputText)(mod.exports, mod, require);
  const api = mod.exports;

  // A) first onboarding → pending, not completed
  api.markOnboardingStoryPending('user-a');
  if (api.isStoryTourPending('user-a') !== true) bad('pending after mark', 'expected true');
  else ok('pending after mark');
  if (ss.pinit_just_onboarded !== 'true') bad('session just_onboarded set');
  else ok('session just_onboarded set');

  // B) consume on dashboard (uid may differ from guest)
  api.consumeJustOnboarded('user-a');
  if (ss.pinit_just_onboarded) bad('just_onboarded consumed', 'still present');
  else ok('just_onboarded consumed');
  if (api.isStoryTourPending('user-a') !== true) bad('still pending after consume');
  else ok('still pending after consume');

  // C) uid mismatch: onboarding saved guest, dashboard has real id
  ls = {}; ss = {};
  api.markOnboardingStoryPending(undefined); // guest
  api.consumeJustOnboarded('real-uid');
  if (api.isStoryTourPending('real-uid') !== true) bad('pending_any covers uid mismatch');
  else ok('pending_any covers uid mismatch');

  // D) complete → never again
  api.completeStoryTour('real-uid');
  if (api.isStoryTourPending('real-uid') !== false) bad('not pending after complete');
  else ok('not pending after complete');
  if (ls.pinit_story_pending_any) bad('pending_any cleared on complete');
  else ok('pending_any cleared on complete');

  // E) re-onboard forces tour even if previously completed
  api.markOnboardingStoryPending('real-uid');
  if (api.isStoryTourPending('real-uid') !== true) bad('re-onboard reopens tour');
  else ok('re-onboard reopens tour');

  // F) completed user without pending stays quiet
  api.completeStoryTour('real-uid');
  ls = { ...ls };
  delete ls.pinit_story_pending_any;
  delete ls['pinit_real-uid_story_pending'];
  ls['pinit_real-uid_story_completed'] = 'true';
  ss = {};
  if (api.isStoryTourPending('real-uid') !== false) bad('returning user no tour');
  else ok('returning user no tour');

  global.window = prevWindow;
  global.localStorage = prevLS;
  global.sessionStorage = prevSS;
}

console.log('\n=== 2. Tour slides vs left nav ===');
{
  const shell = read('src/components/ui/AppShell.tsx');
  const titles = [...shell.matchAll(/title: '([^']+)'/g)].map((m) => m[1]);
  const expected = ['Dashboard', 'Quests', 'Missions', 'Projects', 'AI Interview', 'GD Practice', 'Learning & Twin', 'Attention Span', 'Right Sidebar'];
  if (JSON.stringify(titles.slice(0, 9)) === JSON.stringify(expected)) ok('9 slides match left nav + right sidebar');
  else bad('slide titles', JSON.stringify(titles.slice(0, 9)));

  const twoLiners = (shell.match(/text: "[^"]+\\n[^"]+"/g) || []).length;
  if (twoLiners >= 9) ok('each slide is a 2-line explanation (' + twoLiners + ')');
  else bad('2-line slide texts', 'found ' + twoLiners);

  const routes = {
    0: '/dashboard', 1: '/quests', 2: '/missions', 3: '/projects',
    4: '/interview', 5: '/group-discussion', 6: '/learning',
    7: '/attention-span', 8: '/attention-span',
  };
  let routesOk = true;
  for (const [k, v] of Object.entries(routes)) {
    const re = new RegExp(k + ": '" + v.replace('/', '\\/') + "'");
    if (!re.test(shell)) { routesOk = false; bad('route ' + k, v); }
  }
  if (routesOk) ok('TOUR_STEP_ROUTES cover all 9 steps');

  const navHrefs = ['/dashboard', '/quests', '/missions', '/projects', '/interview', '/group-discussion', '/learning', '/attention-span'];
  const navBlock = shell.slice(shell.indexOf('const STUDENT_NAV'), shell.indexOf('const RIGHT_NAV'));
  const missingNav = navHrefs.filter((h) => !navBlock.includes("href: '" + h + "'"));
  if (missingNav.length === 0) ok('STUDENT_NAV has every left-sidebar tab');
  else bad('STUDENT_NAV missing', missingNav.join(', '));

  if (shell.includes("cleanPath !== '/dashboard'")) ok('trigger uses cleanPath (trailingSlash)');
  else bad('trigger still uses raw pathname');
  if (shell.includes('if (onboardingStep < 3) return')) bad('still gated on onboardingStep >= 3');
  else ok('no onboardingStep >= 3 gate');
  if (shell.includes('tourStep === 8') && shell.includes('onOpenRightSidebar')) ok('segment 2 opens right sidebar at step 8');
  else bad('segment 2 right sidebar hook missing');
  if (shell.includes('setShowVoiceRegModal(true)') && shell.includes('<VoiceRegistrationModal')) ok('segment 3 opens voice modal');
  else bad('segment 3 voice modal missing');
  if (shell.includes("!showVoiceRegModal && !storyLocked")) ok('avatar stays mounted during tour + voice');
  else bad('avatar hide would unmount voice modal');
  if (shell.includes('onExpandLeftNav={() => setCollapsed(false)}')) ok('left nav expands when tour starts');
  else bad('left nav not expanded');
}

console.log('\n=== 3. Onboarding complete → pending flag ===');
{
  const ob = read('src/app/onboarding/page.tsx');
  const marks = (ob.match(/markOnboardingStoryPending\(user\?\.id\)/g) || []).length;
  if (marks >= 6) ok('all onboarding exits call markOnboardingStoryPending (' + marks + ')');
  else bad('onboarding pending calls', 'only ' + marks);
  if (ob.includes("sessionStorage.setItem('pinit_just_onboarded'")) bad('legacy sessionStorage-only flag still used');
  else ok('onboarding uses shared storyTour helper');

  const cos = read('src/lib/context/CareerOSContext.tsx');
  if (cos.includes('markOnboardingStoryPending(userId)')) ok('CareerOS.setOnboarding also marks pending');
  else bad('CareerOS setOnboarding missing pending mark');
}

console.log('\n=== 4. Onboarding contrast ===');
{
  const ob = read('src/app/onboarding/page.tsx');
  if (ob.includes("['--t1' as any]: '#f8fafc'")) ok('shell forces light --t1');
  else bad('missing --t1 override');
  if (ob.includes("['--card' as any]: '#f8fafc'")) ok('shell forces light --card (button/input text)');
  else bad('missing --card override');
  if (ob.includes("background: isAi ? '#1e293b'") && ob.includes("color: '#f8fafc'")) ok('AI chat bubbles are high-contrast');
  else bad('AI chat bubbles still use theme tokens');
  if (ob.includes('WebkitTextFillColor')) bad('invisible gradient headings still present');
  else ok('no transparent gradient headings');
  if (/color: selectedMentor === 'priya' \? '#a5b4fc' : '#f8fafc'/.test(ob)) ok('unselected mentor names are light');
  else bad('mentor names may still use --bg3');
  if (ob.includes("height: 8") && ob.includes('Math.max(quad.score, 4)')) ok('blueprint bars have visible height');
  else bad('blueprint bars still 5px / 0-width');
}

console.log('\n=== 5. Voice segment copy ===');
{
  const voice = read('src/components/avatar/VoiceRegistrationModal.tsx');
  if (voice.includes('SEGMENT 3/3')) ok('voice modal labeled segment 3');
  else bad('voice modal missing segment badge');
  if (voice.includes('15 seconds') || voice.includes('15s')) ok('15s continuous registration');
  else bad('15s duration missing');
  if (voice.includes('go to Quest') && voice.includes('Start Quest')) ok('why-voice mentions quest commands');
  else bad('quest command copy missing');
  if (voice.includes('completeStoryTour(userId)')) ok('voice finish marks story complete');
  else bad('voice finish does not complete story');
}

console.log('\n=== 6. Export config ===');
{
  const cfg = read('next.config.js');
  if (cfg.includes("output: 'export'") && cfg.includes('trailingSlash: true')) ok('static export + trailingSlash');
  else bad('next.config export/trailingSlash');
}

console.log('\n----------------------------------------');
console.log('Passed: ' + pass.length + '   Failed: ' + fail.length);
if (fail.length) {
  console.log('Failures:\n - ' + fail.join('\n - '));
  process.exit(1);
}
console.log('All static/story checks passed.');
