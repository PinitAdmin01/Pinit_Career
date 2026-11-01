import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { getCompatibilityDetails } from '../src/components/friends/FriendProfileDrawer';

console.log('🧪 RUNNING RIGOROUS FRESH-EYES BRUTAL AUDIT FOR FRIENDS HUB & PROFILE UX\n');

const pageSource = fs.readFileSync(path.join(__dirname, '../src/app/friends/page.tsx'), 'utf8');
const cssSource = fs.readFileSync(path.join(__dirname, '../src/styles/friends.css'), 'utf8');
const drawerSource = fs.readFileSync(path.join(__dirname, '../src/components/friends/FriendProfileDrawer.tsx'), 'utf8');

// ── 1. ZERO FAKE DATA & ZERO MOCK FALLBACKS AUDIT ───────────────────────────
console.log('Checking Invariant 1: Zero fake numbers & zero mock projects...');
// Must not have hardcoded fake stats
assert.strictEqual(drawerSource.includes('student.careerScore || 85'), false, 'FAIL: Fake 85 career score fallback found!');
assert.strictEqual(drawerSource.includes('student.xp || 2400'), false, 'FAIL: Fake 2400 XP fallback found!');
assert.strictEqual(drawerSource.includes('student.arenaWins || 12'), false, 'FAIL: Fake 12 arena wins fallback found!');
assert.strictEqual(drawerSource.includes('student.projectsCount || 3'), false, 'FAIL: Fake 3 projects fallback found!');

// Must not have hardcoded mock capstones
assert.strictEqual(drawerSource.includes('Distributed AI Evaluation System'), false, 'FAIL: Fake project Distributed AI Evaluation System found!');
assert.strictEqual(drawerSource.includes('Cloud Transit Automation Desk'), false, 'FAIL: Fake project Cloud Transit Automation Desk found!');

// Must not have hardcoded 1,640 Elo
assert.strictEqual(drawerSource.includes('1,640 Elo</div>'), false, 'FAIL: Hardcoded 1,640 Elo found!');
assert.strictEqual(drawerSource.includes('74.2%</div>'), false, 'FAIL: Hardcoded 74.2% win rate found!');

console.log('✓ Invariant 1 Passed: Zero mock stats, zero fake capstone projects, zero hardcoded Elo.');

// ── 2. MOBILE RESPONSIVENESS INVARIANTS ──────────────────────────────────────
console.log('\nChecking Invariant 2: Mobile responsive layout (360px - 560px)...');
assert.strictEqual(cssSource.includes('@media (max-width: 560px)'), true, 'FAIL: Missing mobile 560px breakpoint for profile modal');
assert.strictEqual(cssSource.includes('grid-template-columns: repeat(2, 1fr) !important'), true, 'FAIL: Stats grid must adapt to 2 columns on mobile');
assert.strictEqual(cssSource.includes('flex-direction: column !important'), true, 'FAIL: Compatibility card must adapt to vertical stack on mobile');
console.log('✓ Invariant 2 Passed: Stats grid and compatibility card adapt responsively on small phones.');

// ── 3. ALL TABS LIGHT MODE AUDIT (Discover, Network, Requests) ───────────────
console.log('\nChecking Invariant 3: Multi-tab Light Mode Coverage...');
assert.strictEqual(cssSource.includes(':root.light .friends-network-header-box'), true, 'FAIL: Light mode missing for My Friends header');
assert.strictEqual(cssSource.includes(':root.light .friends-network-card'), true, 'FAIL: Light mode missing for Network cards');
assert.strictEqual(cssSource.includes(':root.light .friends-request-card'), true, 'FAIL: Light mode missing for Request cards');
assert.strictEqual(cssSource.includes(':root.light .friends-profile-drawer'), true, 'FAIL: Light mode missing for Profile Modal');
console.log('✓ Invariant 3 Passed: Tabs 1, 2, 3 and the Profile Modal have comprehensive light mode styling.');

// ── 4. TASK 3 COMPATIBILITY THRESHOLDS AUDIT ────────────────────────────────
console.log('\nChecking Invariant 4: Compatibility Logic Edge Cases...');
assert.strictEqual(getCompatibilityDetails(100).label, 'Subordinate Level');
assert.strictEqual(getCompatibilityDetails(90.1).label, 'Best Compatible');
assert.strictEqual(getCompatibilityDetails(90).label, 'Good');
assert.strictEqual(getCompatibilityDetails(70.1).label, 'Good');
assert.strictEqual(getCompatibilityDetails(70).label, 'Likely');
assert.strictEqual(getCompatibilityDetails(50.1).label, 'Likely');
assert.strictEqual(getCompatibilityDetails(50).label, 'OK');
assert.strictEqual(getCompatibilityDetails(30.1).label, 'OK');
assert.strictEqual(getCompatibilityDetails(30).label, 'Basic Match');
assert.strictEqual(getCompatibilityDetails(0).label, 'Basic Match');
console.log('✓ Invariant 4 Passed: All strict mathematical boundary thresholds verified.');

// ── 5. SCROLL RESET ON OPEN AUDIT ───────────────────────────────────────────
console.log('\nChecking Invariant 5: Scroll restoration and instant scrollTop = 0...');
assert.strictEqual(drawerSource.includes('scrollContainerRef.current.scrollTop = 0'), true, 'FAIL: scrollTop = 0 missing');
assert.strictEqual(drawerSource.includes("ref={scrollContainerRef}"), true, 'FAIL: ref not attached to scroll container');
console.log('✓ Invariant 5 Passed: Modal resets scroll position to top on every profile open.');

console.log('\n🎉 ALL BRUTAL FRESH-EYES INVARIANTS VERIFIED AND PASSING 100%!');
