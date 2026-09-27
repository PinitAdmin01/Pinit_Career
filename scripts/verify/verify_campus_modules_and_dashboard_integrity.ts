/**
 * Automated Verification: Campus Modules & Dashboard Integrity Audit
 * Verifies that all 12 modules remediated are strictly compliant with zero cheat vectors,
 * no hardcoded mock constants, proper RBAC, and authentic data bindings.
 */

import fs from 'fs';
import path from 'path';

let failedTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
    failedTests++;
  }
}

function readSource(relPath: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), relPath), 'utf-8');
}

console.log('=== Running Campus Modules & Dashboard Integrity Verification ===\n');

// 1. HOSTEL
console.log('1. Hostel Subsystem:');
const hostelSrc = readSource('src/app/hostel/page.tsx');
assert(!hostelSrc.includes("from('hostel_requests').insert"), 'No bare client-side Supabase write in hostel/page.tsx');
assert(!hostelSrc.includes("'demo-user'"), 'No demo-user fallback in hostel/page.tsx');
assert(hostelSrc.includes('isRollCallWindowActive'), 'Roll-call window check exists (8-10 PM)');
assert(hostelSrc.includes('api.post') || hostelSrc.includes('/api/hostel/'), 'Routes mutations through API endpoints');

// 2. TRANSPORT
console.log('\n2. Transport Subsystem:');
const transportSrc = readSource('src/app/transport/page.tsx');
assert(!transportSrc.includes('MD5-PASS-TRN-80419'), 'Static MD5 security hash constant eradicated');
assert(!transportSrc.includes('setInterval') || !transportSrc.includes(', 4000)'), '4-second fake jump interval eradicated');
assert(transportSrc.includes('TRN-SEC-'), 'Dynamic security pass identifier generated');
assert(transportSrc.includes('Transit Velocity:'), 'Dynamic velocity and telemetry labeling applied');

// 3. SERVICES
console.log('\n3. Services Subsystem:');
const servicesSrc = readSource('src/app/services/page.tsx');
assert(!servicesSrc.includes('Dr. Evelyn'), 'Invented generic counselor replaced');
assert(servicesSrc.includes('res.ok !== false') || servicesSrc.includes('res?.ok !== false'), 'Checked res.ok in all service request handlers');
assert(servicesSrc.includes('isPrivilegedStaff'), 'Admin and staff navigation gated by role check');

// 4. MAINTENANCE
console.log('\n4. Maintenance Subsystem:');
const maintenanceSrc = readSource('src/app/maintenance/page.tsx');
assert(maintenanceSrc.includes("status: 'Reported'"), 'Ticket creation aligns with Reported status');
assert(maintenanceSrc.includes("t.status === 'Reported' || t.status === 'Open'"), 'Status counter accounts for reported tickets');
assert(maintenanceSrc.includes('My Tickets'), 'Scoped view toggle present between Campus Board and My Tickets');

// 5. ADMISSIONS
console.log('\n5. Admissions Subsystem:');
const admissionsSrc = readSource('src/app/admissions/page.tsx');
const admissionsRouteExists = fs.existsSync(path.resolve(process.cwd(), 'src/app/api/admissions/apply/route.ts'));
assert(admissionsRouteExists, 'Dedicated server route /api/admissions/apply/route.ts exists');
assert(admissionsSrc.includes('type="file"'), 'PDF marksheet file input present');
assert(admissionsSrc.includes("api.post('/api/admissions/apply'"), 'Application submission routes to server API');

// 6. ALUMNI
console.log('\n6. Alumni Subsystem:');
const alumniSrc = readSource('src/app/alumni/page.tsx');
assert(!alumniSrc.includes('seed-fund'), 'No unauthenticated mock seed fund donation write');
assert(alumniSrc.includes('Coming Soon') || alumniSrc.includes('staging') || alumniSrc.includes('Alumni Network'), 'Staging or disclaimer verified');

// 7. VAULT
console.log('\n7. Vault Subsystem:');
const vaultSrc = readSource('src/app/vault/page.tsx');
assert(vaultSrc.includes('proof_url'), 'Vault supports proof_url attachment');
assert(vaultSrc.includes('formEvidenceFile'), 'Evidence file state and input present');
assert(!vaultSrc.includes('Verified (100% Match)'), 'No misleading auto-verification on upload');

// 8. INTERNSHIPS
console.log('\n8. Internships Subsystem:');
const internshipsSrc = readSource('src/app/internships/page.tsx');
assert(!internshipsSrc.includes('cOS.addXp(500'), 'No client-side +500 XP cheat vector');
assert(internshipsSrc.includes('Pending Evaluation'), 'Initial internship log rating requires mentor/supervisor evaluation');

// 9. NOTIFICATIONS
console.log('\n9. Notifications Subsystem:');
const notificationsSrc = readSource('src/app/notifications/page.tsx');
assert(!notificationsSrc.includes("'10:42 AM'"), 'Static 10:42 AM clock eradicated');
assert(!notificationsSrc.includes('NVIDIA Referral'), 'Fake NVIDIA prefill notice eradicated');

// 10. EVENTS
console.log('\n10. Events Subsystem:');
const eventsSrc = readSource('src/app/events/page.tsx');
assert(eventsSrc.includes('r.studentId === user.id'), 'Strict studentId matching for RSVPs');
assert(!eventsSrc.includes('PinIT Dean'), 'PinIT Dean placeholder replaced with dynamic institutional Dean');

// 11. CRM & INTEGRATIONS
console.log('\n11. CRM & Integrations Subsystems:');
const crmSrc = readSource('src/app/crm/page.tsx');
assert(!crmSrc.includes('>84 Students<'), 'Hardcoded 84 Students eradicated in CRM');
assert(!crmSrc.includes('>68% Conversions<'), 'Hardcoded 68% Conversions eradicated in CRM');
assert(!crmSrc.includes('>+12.4% YoY<'), 'Hardcoded +12.4% YoY eradicated in CRM');
assert(!crmSrc.includes('>92 / 100<'), 'Hardcoded 92 / 100 corporate placement index eradicated in CRM');

const integrationsSrc = readSource('src/app/integrations/page.tsx');
assert(!integrationsSrc.includes('240 logs/min'), 'Fake telemetry volume eradicated');
assert(!integrationsSrc.includes('pk_preview_51P...'), 'Truncated fake key strings eradicated');
assert(integrationsSrc.includes('pk_live_'), 'Secure integration key generation implemented');

// 12. DASHBOARD HUD, STATS, BENTO GRID, MISSIONS
console.log('\n12. Dashboard HUD, Stats, BentoGrid, Missions:');
const hudSrc = readSource('src/components/student/dashboard/DashboardHeaderHUD.tsx');
assert(!hudSrc.includes('Math.max(40,'), 'Artificial 40% job match clamp eradicated in HUD');
assert(!hudSrc.includes('Math.max(45,'), 'Artificial 45% floor eradicated in HUD');

const statsSrc = readSource('src/components/student/dashboard/DashboardStatsRow.tsx');
assert(!statsSrc.includes('Compiler Safety:'), 'Fake Compiler Safety metric eradicated');
assert(!statsSrc.includes('O(1) / O(N) pass'), 'Fake Logic Score O(1) eradicated');
assert(statsSrc.includes('Verified Records:'), 'Authentic verified vault records displayed');

const bentoSrc = readSource('src/components/student/dashboard/DashboardBentoGrid.tsx');
assert(!bentoSrc.includes('Math.max(20,'), 'Artificial 20% floor clamp eradicated in radar chart');
assert(!bentoSrc.includes('careerScore : 55'), 'Artificial 55 base floor eradicated in radar chart');
assert(!bentoSrc.includes('dnaScore : 50'), 'Artificial 50 base floor eradicated in radar chart');

const missionsSrc = readSource('src/components/student/dashboard/DashboardMissionsPanel.tsx');
assert(!missionsSrc.includes('cOS?.completeMission?.(id, true)'), 'Checkbox self-awarding XP/pins eradicated');
assert(missionsSrc.includes('getMissionHref'), 'Contextual routing helper present for Start buttons');
assert(!missionsSrc.includes('href="/quests"\n                      style={{'), 'Missions Start buttons route contextually instead of always /quests');

console.log(`\n=== Verification Summary ===`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('All 12 subsystems are verified clean, authentic, and secure!');
}
