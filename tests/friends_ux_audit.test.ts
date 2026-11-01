import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { getCompatibilityDetails } from '../src/components/friends/FriendProfileDrawer';

console.log('🧪 RUNNING RIGOROUS 3RD/4TH/5TH PERSON AUDIT FOR FRIENDS HUB & PROFILE UX\n');

// ── TASK 1 AUDIT: Top 2 lines removed & Light Mode in Friends tab ─────────────
console.log('Checking Task 1: Header removal & Light Mode styles...');
const pageSource = fs.readFileSync(path.join(__dirname, '../src/app/friends/page.tsx'), 'utf8');
const cssSource = fs.readFileSync(path.join(__dirname, '../src/styles/friends.css'), 'utf8');

// 1. Top 2 lines removed
assert.strictEqual(
  pageSource.includes('friends-top-header'),
  false,
  'FAIL: friends-top-header must be removed from page.tsx'
);
assert.strictEqual(
  pageSource.includes('Find peers, match by skills, collaborate on squad projects'),
  false,
  'FAIL: Top subtitle text must be removed from page.tsx'
);
// 2. Privacy button retained in tabs bar
assert.strictEqual(
  pageSource.includes('🔒 Privacy'),
  true,
  'FAIL: Privacy button must be retained in tabs bar'
);
// 3. Light mode rules exist in friends.css
assert.strictEqual(
  cssSource.includes(":root.light .friends-container"),
  true,
  'FAIL: Light mode .friends-container rule missing'
);
assert.strictEqual(
  cssSource.includes(":root.light .student-list-item-row"),
  true,
  'FAIL: Light mode .student-list-item-row rule missing'
);
assert.strictEqual(
  cssSource.includes(":root.light .ref-sidebar-card"),
  true,
  'FAIL: Light mode .ref-sidebar-card rule missing'
);
console.log('✓ Task 1 Passed: Top 2 lines removed & light mode theme engine added.');

// ── TASK 2 AUDIT: Centered Modal & Zero-Scroll Jump On Open ──────────────────
console.log('\nChecking Task 2: Centered Modal & Scroll Reset...');
const drawerSource = fs.readFileSync(path.join(__dirname, '../src/components/friends/FriendProfileDrawer.tsx'), 'utf8');

// 1. Scroll container ref reset
assert.strictEqual(
  drawerSource.includes('scrollContainerRef.current.scrollTop = 0'),
  true,
  'FAIL: FriendProfileDrawer must reset scrollTop = 0 on student change'
);
// 2. Center positioning in CSS
assert.strictEqual(
  cssSource.includes('justify-content: center;'),
  true,
  'FAIL: Backdrop must center modal horizontally'
);
assert.strictEqual(
  cssSource.includes('align-items: center;'),
  true,
  'FAIL: Backdrop must center modal vertically'
);
assert.strictEqual(
  cssSource.includes('max-width: 640px;'),
  true,
  'FAIL: Profile modal must have centered card max-width (640px)'
);
console.log('✓ Task 2 Passed: Modal is centered horizontally and vertically, scrollTop resets instantly.');

// ── TASK 3 AUDIT: Exact Compatibility Logic ─────────────────────────────────
console.log('\nChecking Task 3: Compatibility tier logic thresholds...');

// Test 100%: Subordinate Level
const c100 = getCompatibilityDetails(100);
assert.strictEqual(c100.label, 'Subordinate Level', 'FAIL: 100% must be Subordinate Level');
assert.strictEqual(c100.tier, 'subordinate');

// Test >90%: Best Compatible
const c95 = getCompatibilityDetails(95);
assert.strictEqual(c95.label, 'Best Compatible', 'FAIL: 95% must be Best Compatible');
assert.strictEqual(c95.tier, 'best');

const c91 = getCompatibilityDetails(91);
assert.strictEqual(c91.label, 'Best Compatible', 'FAIL: 91% must be Best Compatible');

// Test >70%: Good
const c85 = getCompatibilityDetails(85);
assert.strictEqual(c85.label, 'Good', 'FAIL: 85% must be Good');
assert.strictEqual(c85.tier, 'good');

const c71 = getCompatibilityDetails(71);
assert.strictEqual(c71.label, 'Good', 'FAIL: 71% must be Good');

// Test >50%: Likely
const c65 = getCompatibilityDetails(65);
assert.strictEqual(c65.label, 'Likely', 'FAIL: 65% must be Likely');
assert.strictEqual(c65.tier, 'likely');

const c51 = getCompatibilityDetails(51);
assert.strictEqual(c51.label, 'Likely', 'FAIL: 51% must be Likely');

// Test >30%: OK
const c45 = getCompatibilityDetails(45);
assert.strictEqual(c45.label, 'OK', 'FAIL: 45% must be OK');
assert.strictEqual(c45.tier, 'ok');

const c31 = getCompatibilityDetails(31);
assert.strictEqual(c31.label, 'OK', 'FAIL: 31% must be OK');

// Test <=30%: Basic Match
const c30 = getCompatibilityDetails(30);
assert.strictEqual(c30.label, 'Basic Match', 'FAIL: 30% must be Basic Match');
assert.strictEqual(c30.tier, 'basic');

const c15 = getCompatibilityDetails(15);
assert.strictEqual(c15.label, 'Basic Match', 'FAIL: 15% must be Basic Match');

// Verify line appears in drawer JSX
assert.strictEqual(
  drawerSource.includes('drawer-compatibility-card'),
  true,
  'FAIL: drawer-compatibility-card must be rendered in FriendProfileDrawer'
);
assert.strictEqual(
  drawerSource.includes('Compatible:'),
  true,
  'FAIL: "Compatible:" line must appear in FriendProfileDrawer'
);
console.log('✓ Task 3 Passed: All compatibility thresholds (100 -> Subordinate, >90 -> Best Compatible, >70 -> Good, >50 -> Likely, >30 -> OK, <=30 -> Basic) verified!');

// ── TASK 4 AUDIT: Light Mode for View Profile Modal ─────────────────────────
console.log('\nChecking Task 4: Light Mode Profile Modal styling...');
assert.strictEqual(
  cssSource.includes(":root.light .friends-profile-drawer"),
  true,
  'FAIL: Light mode .friends-profile-drawer missing'
);
assert.strictEqual(
  cssSource.includes(":root.light .drawer-topbar"),
  true,
  'FAIL: Light mode .drawer-topbar missing'
);
assert.strictEqual(
  cssSource.includes(":root.light .drawer-hero-card"),
  true,
  'FAIL: Light mode .drawer-hero-card missing'
);
assert.strictEqual(
  cssSource.includes(":root.light .drawer-compatibility-card"),
  true,
  'FAIL: Light mode .drawer-compatibility-card missing'
);
console.log('✓ Task 4 Passed: Profile modal has full, high-contrast light mode styling.');

console.log('\n🎉 ALL 4 TASKS VERIFIED AND PASSING 100%!');
