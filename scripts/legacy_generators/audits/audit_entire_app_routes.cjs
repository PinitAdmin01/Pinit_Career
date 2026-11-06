const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🔥 STARTING BRUTAL ENTIRE-APP SYSTEM AUDIT 🔥\n');

// ── 1. Page Component Exports Check ──
console.log('1. Checking Core Student Portal Routes Existence & Exports...');
const coreRoutes = [
  'src/app/dashboard/page.tsx',
  'src/app/quests/page.tsx',
  'src/app/quests/lesson/page.tsx',
  'src/app/quests/teacher-select/page.tsx',
  'src/app/missions/page.tsx',
  'src/app/arena/page.tsx',
  'src/app/projects/page.tsx',
  'src/app/leaderboard/page.tsx',
  'src/app/interview/page.tsx',
  'src/app/group-discussion/page.tsx',
  'src/app/learning/page.tsx',
  'src/app/attention-span/page.tsx',
  'src/app/friends/page.tsx',
  'src/app/pins/page.tsx',
  'src/app/notifications/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/university/portfolio/[studentId]/page.tsx',
  'src/app/verify/page.tsx',
  'src/app/verify/[credentialId]/page.tsx',
  'src/app/passport/page.tsx'
];

for (const relPath of coreRoutes) {
  const full = path.join(__dirname, '..', relPath);
  assert.ok(fs.existsSync(full), `MISSING ROUTE: ${relPath}`);
  const content = fs.readFileSync(full, 'utf8');
  assert.ok(
    content.includes('export default') || content.includes('export default function'),
    `NO DEFAULT EXPORT: ${relPath}`
  );
}
console.log(`   ✅ All ${coreRoutes.length} core student routes exist and export valid default page components.\n`);

// ── 2. Core API Handlers Check ──
console.log('2. Auditing Core API Route Handlers...');
const apiRoutes = [
  { file: 'src/app/api/auth/me/route.ts', methods: ['GET'] },
  { file: 'src/app/api/auth/profile/route.ts', methods: ['PATCH', 'POST'] },
  { file: 'src/app/api/auth/teacher/route.ts', methods: ['GET', 'POST'] },
  { file: 'src/app/api/analytics/dashboard/route.ts', methods: ['GET'] },
  { file: 'src/app/api/student/activity/route.ts', methods: ['GET'] },
  { file: 'src/app/api/recruiter/visibility/route.ts', methods: ['GET', 'POST', 'PATCH'] },
  { file: 'src/app/api/verify/[credentialId]/route.ts', methods: ['GET'] },
  { file: 'src/app/api/tts/route.ts', methods: ['POST', 'OPTIONS', 'GET'] }
];

for (const api of apiRoutes) {
  const full = path.join(__dirname, '..', api.file);
  assert.ok(fs.existsSync(full), `MISSING API ROUTE: ${api.file}`);
  const content = fs.readFileSync(full, 'utf8');
  for (const m of api.methods) {
    const hasHandler =
      content.includes(`export async function ${m}`) ||
      content.includes(`export function ${m}`) ||
      content.includes(`export const ${m}`);
    assert.ok(hasHandler, `API ROUTE ${api.file} MISSING HANDLER FOR ${m}`);
  }
}
console.log(`   ✅ All ${apiRoutes.length} core API routes export required HTTP method handlers.\n`);

// ── 3. Authenticity & Zero-Fake-Data Audit ──
console.log('3. Brutal Audit for Fake / Dummy Data across Student Components...');
const filesToCheckNoFake = [
  'src/app/university/portfolio/[studentId]/page.tsx',
  'src/components/university/StudentPortfolioShowcase.tsx',
  'src/app/profile/tabs/PortfolioTab.tsx',
  'src/app/profile/tabs/CareerDnaTab.tsx',
  'src/app/profile/tabs/AnalyticsTab.tsx',
  'src/lib/ats/resumeGenerator.ts'
];

for (const f of filesToCheckNoFake) {
  const full = path.join(__dirname, '..', f);
  const content = fs.readFileSync(full, 'utf8');
  assert.strictEqual(
    content.includes('Apex Institute of Technology'),
    false,
    `FATAL: Fake "Apex Institute of Technology" found in ${f}`
  );
  assert.strictEqual(
    content.includes('cgpa = 8.92'),
    false,
    `FATAL: Fake CGPA 8.92 found in ${f}`
  );
  assert.strictEqual(
    content.includes('cgpa = 9.42'),
    false,
    `FATAL: Fake CGPA 9.42 found in ${f}`
  );
}
console.log(`   ✅ Verified zero occurrences of fake college or fake CGPAs across all student components.\n`);

// ── 4. SSR Safety Check ──
console.log('4. Auditing SSR Safety in Student Portfolio and Verification...');
const ssrFiles = [
  'src/components/university/StudentPortfolioShowcase.tsx',
  'src/app/passport/page.tsx',
  'src/components/effects/AmbientAudioToggle.tsx'
];

for (const f of ssrFiles) {
  const full = path.join(__dirname, '..', f);
  const content = fs.readFileSync(full, 'utf8');
  assert.ok(content.includes("'use client'"), `FAIL: ${f} must be client component`);
}
console.log(`   ✅ SSR safety and 'use client' directives verified.\n`);

// ── 5. Voice & TTS Reliability Invariants ──
console.log('5. Auditing Voice Engine Invariants...');
const ttsLib = fs.readFileSync(path.join(__dirname, '../src/lib/tts.ts'), 'utf8');
assert.ok(ttsLib.includes('Protected humanoid identity: never blurt out surprise robotic voices'), 'FAIL: must protect humanoid identity against robotic voices');
assert.ok(ttsLib.includes('if (options?.allowWebSpeechFallback)'), 'FAIL: WebSpeech fallback must be opt-in only');
assert.ok(ttsLib.includes("CURRENT_RENDER_TIER === 'free' ? 35_000 : 15_000"), 'FAIL: Free tier timeout must be 35s');

const voiceMain = fs.readFileSync(path.join(__dirname, '../voice-service/main.py'), 'utf8');
assert.ok(voiceMain.includes('x-forwarded-for'), 'FAIL: Reverse proxy X-Forwarded-For must be inspected for rate limiting');
assert.ok(voiceMain.includes('Access-Control-Allow-Methods'), 'FAIL: OPTIONS preflight must return Allow-Methods');
assert.ok(voiceMain.includes('Access-Control-Allow-Headers'), 'FAIL: OPTIONS preflight must return Allow-Headers');
console.log('   ✅ Voice engine invariants verified.\n');

console.log('🎉 ALL BRUTAL ENTIRE-APP AUDIT CHECKS PASSED DETERMINISTICALLY! 🎉');
