const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('========================================================================');
console.log('🛡️ PIN-IT CAREER OS: FRIENDS TAB & CAMPUS NETWORK 10/10 VERIFICATION');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name} - ${err.message}`);
    failed++;
  }
}

// ───────────────────────────────────────────────────────────────────────────
// SECTION 1: CSS & DESIGN SYSTEM INTEGRITY
// ───────────────────────────────────────────────────────────────────────────
console.log('── SECTION 1: CSS & Design System Integrity (friends.css) ──');

const cssPath = path.resolve('src/styles/friends.css');
const css = fs.readFileSync(cssPath, 'utf8');

test('CSS contains complete modal dialog system', () => {
  assert.ok(css.includes('.friends-modal-overlay'), 'Missing .friends-modal-overlay');
  assert.ok(css.includes('.friends-modal-dialog'), 'Missing .friends-modal-dialog');
  assert.ok(css.includes('.modal-header'), 'Missing .modal-header');
  assert.ok(css.includes('.modal-body'), 'Missing .modal-body');
  assert.ok(css.includes('.modal-footer'), 'Missing .modal-footer');
});

test('CSS contains complete slide-over drawer design system', () => {
  assert.ok(css.includes('.friends-drawer-backdrop'), 'Missing .friends-drawer-backdrop');
  assert.ok(css.includes('.friends-profile-drawer'), 'Missing .friends-profile-drawer');
  assert.ok(css.includes('.drawer-hero-card'), 'Missing .drawer-hero-card');
  assert.ok(css.includes('.drawer-scroll-content'), 'Missing .drawer-scroll-content');
  assert.ok(css.includes('.drawer-topbar'), 'Missing .drawer-topbar');
  assert.ok(css.includes('.drawer-close-btn'), 'Missing .drawer-close-btn');
});

test('CSS contains online beacon with keyframe animation', () => {
  assert.ok(css.includes('.online-beacon'), 'Missing .online-beacon');
  assert.ok(css.includes('@keyframes beacon-pulse'), 'Missing @keyframes beacon-pulse');
});

test('CSS contains view mode toggle and list view components', () => {
  assert.ok(css.includes('.view-mode-toggle-group'), 'Missing .view-mode-toggle-group');
  assert.ok(css.includes('.view-mode-btn'), 'Missing .view-mode-btn');
  assert.ok(css.includes('.student-list-item-row'), 'Missing .student-list-item-row');
  assert.ok(css.includes('.student-list-identity'), 'Missing .student-list-identity');
});

// ───────────────────────────────────────────────────────────────────────────
// SECTION 2: SERVERLESS COMPATIBILITY & EPHEMERAL SAFETY
// ───────────────────────────────────────────────────────────────────────────
console.log('\n── SECTION 2: Serverless Compatibility & Ephemeral Disk Safety ──');

const apiRouteFiles = [
  'src/app/api/friends/route.ts',
  'src/app/api/friends/[id]/route.ts',
  'src/app/api/friends/challenges/route.ts',
  'src/app/api/friends/messages/route.ts',
  'src/app/api/friends/privacy/route.ts',
  'src/app/api/friends/projects/route.ts',
  'src/app/api/friends/report/route.ts',
  'src/app/api/friends/respond/route.ts',
  'src/app/api/friends/search/route.ts',
  'src/app/api/friends/suggestions/route.ts'
];

test('Zero serverless disk writes (writeFileSync/writeFile) across all friends API routes', () => {
  apiRouteFiles.forEach(relPath => {
    const content = fs.readFileSync(path.resolve(relPath), 'utf8');
    assert.ok(!content.includes('fs.writeFileSync'), `${relPath} contains fs.writeFileSync`);
    assert.ok(!content.includes('fs.promises.writeFile'), `${relPath} contains fs.promises.writeFile`);
  });
});

test('In-memory cache structures implemented for serverless fallback resilience', () => {
  const routesWithFallback = [
    'src/app/api/friends/route.ts',
    'src/app/api/friends/messages/route.ts',
    'src/app/api/friends/challenges/route.ts',
    'src/app/api/friends/projects/route.ts',
    'src/app/api/friends/privacy/route.ts',
    'src/app/api/friends/report/route.ts'
  ];
  routesWithFallback.forEach(relPath => {
    const content = fs.readFileSync(path.resolve(relPath), 'utf8');
    assert.ok(content.includes('memory') || content.includes('readDb') || content.includes('writeDb'), `${relPath} lacks memory fallback mechanism`);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// SECTION 3: AUTHENTICATION, AUTHORIZATION & IDOR PREVENTION
// ───────────────────────────────────────────────────────────────────────────
console.log('\n── SECTION 3: Auth Verification, Tenant Isolation & IDOR Guards ──');

test('Mutation endpoints enforce requireUserFromRequest or secure token resolution', () => {
  const mutationRoutes = [
    'src/app/api/friends/route.ts',
    'src/app/api/friends/messages/route.ts',
    'src/app/api/friends/challenges/route.ts',
    'src/app/api/friends/projects/route.ts',
    'src/app/api/friends/privacy/route.ts',
    'src/app/api/friends/report/route.ts',
    'src/app/api/friends/respond/route.ts'
  ];
  mutationRoutes.forEach(relPath => {
    const content = fs.readFileSync(path.resolve(relPath), 'utf8');
    assert.ok(
      content.includes('requireUserFromRequest') || content.includes('resolveUserId'),
      `${relPath} does not verify caller auth`
    );
  });
});

test('Zero hardcoded mock identities (rahul_shetty) anywhere in friends system', () => {
  const allFriendsFiles = [
    ...apiRouteFiles,
    'src/app/friends/page.tsx',
    'src/app/friends/[id]/page.tsx',
    'src/components/friends/FriendChatView.tsx',
    'src/components/friends/FriendProfileDrawer.tsx',
    'src/components/friends/ArenaChallengesView.tsx',
    'src/components/friends/SquadProjectsView.tsx'
  ];
  allFriendsFiles.forEach(relPath => {
    const content = fs.readFileSync(path.resolve(relPath), 'utf8');
    assert.ok(!content.includes("'rahul_shetty'") && !content.includes('"rahul_shetty"'), `${relPath} contains hardcoded rahul_shetty`);
  });
});

test('Self-action restrictions enforced on direct messaging and reporting', () => {
  const msgContent = fs.readFileSync(path.resolve('src/app/api/friends/messages/route.ts'), 'utf8');
  assert.ok(msgContent.includes('receiverId === userId'), 'messages route does not prevent messaging oneself');

  const reportContent = fs.readFileSync(path.resolve('src/app/api/friends/report/route.ts'), 'utf8');
  assert.ok(reportContent.includes('reportedStudentId === userId'), 'report route does not prevent self-reporting');

  const friendRouteContent = fs.readFileSync(path.resolve('src/app/api/friends/route.ts'), 'utf8');
  assert.ok(friendRouteContent.includes('targetStudentId === userId'), 'friend request route does not prevent adding oneself');
});

// ───────────────────────────────────────────────────────────────────────────
// SECTION 4: FRONTEND PAGE, CHAT & DRAWER INTEGRATION
// ───────────────────────────────────────────────────────────────────────────
console.log('\n── SECTION 4: Frontend Deep-linking, Real-time Chat & Profile Drawer ──');

test('FriendsPage wraps content in Suspense for useSearchParams safety', () => {
  const pageContent = fs.readFileSync(path.resolve('src/app/friends/page.tsx'), 'utf8');
  assert.ok(pageContent.includes('<Suspense'), 'FriendsPage missing Suspense wrapper');
  assert.ok(pageContent.includes('useSearchParams()'), 'FriendsPage missing useSearchParams');
  assert.ok(pageContent.includes("searchParams.get('tab')"), 'FriendsPage does not sync tab searchParam');
  assert.ok(pageContent.includes("searchParams.get('friendId')"), 'FriendsPage does not sync friendId searchParam');
});

test('FriendChatView implements realtime polling (setInterval 4s) and mark-as-read', () => {
  const chatContent = fs.readFileSync(path.resolve('src/components/friends/FriendChatView.tsx'), 'utf8');
  assert.ok(chatContent.includes('setInterval'), 'FriendChatView missing polling interval');
  assert.ok(chatContent.includes('4000'), 'FriendChatView missing 4s polling timer');
  assert.ok(chatContent.includes('markAsRead'), 'FriendChatView missing markAsRead');
  assert.ok(chatContent.includes('PATCH'), 'FriendChatView markAsRead does not call PATCH');
  assert.ok(chatContent.includes('data.message || data.messageRecord'), 'FriendChatView does not support both message and messageRecord');
});

test('FriendProfileDrawer renders dynamic actions based on friendship relationship', () => {
  const drawerContent = fs.readFileSync(path.resolve('src/components/friends/FriendProfileDrawer.tsx'), 'utf8');
  assert.ok(drawerContent.includes("student.relationship === 'friends'"), 'FriendProfileDrawer missing friends state branch');
  assert.ok(drawerContent.includes('Unfriend'), 'FriendProfileDrawer missing Unfriend button');
  assert.ok(drawerContent.includes('onRemoveFriend'), 'FriendProfileDrawer missing onRemoveFriend handler');
  assert.ok(drawerContent.includes('onOpenMessage'), 'FriendProfileDrawer missing onOpenMessage handler');
  assert.ok(drawerContent.includes('onOpenChallenge'), 'FriendProfileDrawer missing onOpenChallenge handler');
});

test('StudentProfilePage (/friends/[id]) handles live connection status and dueling', () => {
  const profileContent = fs.readFileSync(path.resolve('src/app/friends/[id]/page.tsx'), 'utf8');
  assert.ok(profileContent.includes('/api/friends/challenges'), 'Student profile missing arena duel endpoint call');
  assert.ok(profileContent.includes('/friends?tab=messages&friendId='), 'Student profile missing deep-linked message redirect');
  assert.ok(profileContent.includes('student.relationship === \'friends\''), 'Student profile does not check relationship status');
  assert.ok(profileContent.includes('student.isSelf'), 'Student profile does not handle self-profile view');
});

// ───────────────────────────────────────────────────────────────────────────
// SECTION 5: STRICT CODE QUALITY STANDARDS
// ───────────────────────────────────────────────────────────────────────────
console.log('\n── SECTION 5: Strict Code Quality & Lint Standards ──');

test('Zero forbidden @typescript-eslint comments in any friends files', () => {
  const tsFiles = [
    ...apiRouteFiles,
    'src/app/friends/page.tsx',
    'src/app/friends/[id]/page.tsx',
    'src/components/friends/FriendChatView.tsx',
    'src/components/friends/FriendProfileDrawer.tsx',
    'src/components/friends/ArenaChallengeModal.tsx',
    'src/components/friends/ArenaChallengesView.tsx',
    'src/components/friends/PrivacySettingsModal.tsx',
    'src/components/friends/ProjectInviteModal.tsx',
    'src/components/friends/ReportStudentModal.tsx',
    'src/components/friends/SmartMatchModal.tsx',
    'src/components/friends/SquadProjectsView.tsx',
    'src/components/friends/StudentCard.tsx',
    'src/lib/friends/matching.ts'
  ];
  tsFiles.forEach(f => {
    const code = fs.readFileSync(path.resolve(f), 'utf8');
    assert.ok(!code.includes('@typescript-eslint/'), `${f} contains forbidden @typescript-eslint comment`);
  });
});

console.log('\n========================================================================');
console.log(`🏁 VERIFICATION SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================================');

if (failed > 0) {
  process.exit(1);
}
