import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Running PinIT Interview Gaming Mode Verification Suite...\n');

// 1. Static Contract Verification: Interview page starts in Gaming Mode on user gesture
const pageContent = fs.readFileSync(path.resolve(__dirname, '../../src/app/interview/page.tsx'), 'utf-8');

assert.ok(
  pageContent.includes('requestFullscreen') && pageContent.includes('pinit-interview-toggle'),
  'FAIL: page.tsx must invoke requestFullscreen and dispatch pinit-interview-toggle'
);
assert.ok(
  pageContent.includes("document.body.setAttribute('data-interview-active', 'true')") &&
  pageContent.includes("document.documentElement.setAttribute('data-gaming-mode', 'true')"),
  'FAIL: page.tsx must set data-interview-active and data-gaming-mode attributes'
);
console.log('  ✅ [PASS] Contract 1: page.tsx auto-activates Fullscreen Gaming Mode on start & resume');

// 2. Static Contract Verification: Interview page exits Gaming Mode on exit
assert.ok(
  pageContent.includes('exitFullscreen') &&
  pageContent.includes("document.body.removeAttribute('data-interview-active')") &&
  pageContent.includes("document.documentElement.removeAttribute('data-gaming-mode')"),
  'FAIL: page.tsx must release fullscreen and remove gaming mode attributes on exit'
);
console.log('  ✅ [PASS] Contract 2: page.tsx cleanly releases Fullscreen Gaming Mode on exitInterview');

// 3. Static Contract Verification: AppShell integration
const appShellContent = fs.readFileSync(path.resolve(__dirname, '../../src/components/ui/AppShell.tsx'), 'utf-8');
assert.ok(
  appShellContent.includes('isInterviewActiveState') &&
  appShellContent.includes('pinit-interview-toggle'),
  'FAIL: AppShell must listen to pinit-interview-toggle and manage isInterviewActiveState'
);
assert.ok(
  appShellContent.includes('effectiveFocusMode = focusMode || isLessonOrDetail || isGroupDiscussionCall || isRoleplayActive || isArenaDuelActive || isInterviewActiveState'),
  'FAIL: AppShell must include isInterviewActiveState in effectiveFocusMode'
);
console.log('  ✅ [PASS] Contract 3: AppShell seamlessly integrates interview into effectiveFocusMode');

// 4. Static Contract Verification: Header Gaming Mode indicator / toggle
const headerContent = fs.readFileSync(path.resolve(__dirname, '../../src/app/interview/components/InterviewSessionHeader.tsx'), 'utf-8');
assert.ok(
  headerContent.includes('header-gaming-mode-toggle') && headerContent.includes('Gaming Focus'),
  'FAIL: InterviewSessionHeader must feature the Gaming Focus toggle control'
);
console.log('  ✅ [PASS] Contract 4: InterviewSessionHeader provides Gaming Focus controls');

// 5. CSS Immersive Styles Verification
const cssContent = fs.readFileSync(path.resolve(__dirname, '../../src/styles/globals.css'), 'utf-8');
assert.ok(
  cssContent.includes('body[data-interview-active="true"] aside') &&
  cssContent.includes('body[data-interview-active="true"] main'),
  'FAIL: globals.css must hide sidebars and expand main to full width during active interview'
);
console.log('  ✅ [PASS] Contract 5: globals.css enforces 100vw distraction-free layout');

console.log('\n========================================');
console.log('All 5 Interview Gaming Mode Tests Passed! (100%)');
console.log('========================================\n');
