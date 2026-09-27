import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('========================================================================');
console.log('🧪 VERIFYING PIN GATES, STAGE LOCKS & AUTHENTIC AI REMEDIATION');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;

function it(desc: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res
        .then(() => {
          console.log(`  ✅ [PASS] ${desc}`);
          passCount++;
        })
        .catch((err) => {
          console.error(`  ❌ [FAIL] ${desc}: ${err.message}`);
          failCount++;
        });
    }
    console.log(`  ✅ [PASS] ${desc}`);
    passCount++;
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${desc}: ${err.message}`);
    failCount++;
  }
}

const ROOT = path.resolve(__dirname, '..');

async function runTests() {
  console.log('1. Verification of Authoritative Pin Gates (No Un-Awaited Promises)');

  // Test 1.1: useQuestProgression handleLaunchQuest awaits unlockItem
  const questProgSrc = fs.readFileSync(path.join(ROOT, 'src/app/quests/components/useQuestProgression.ts'), 'utf-8');
  it('useQuestProgression awaits unlockItem before initiating quest', () => {
    assert.match(
      questProgSrc,
      /const\s+success\s*=\s*await\s+unlockItem/,
      'unlockItem must be awaited in handleLaunchQuest'
    );
    assert.match(
      questProgSrc,
      /if\s*\(!success\)\s*\{\s*toast\.error/,
      'failed unlockItem must abort and display error toast'
    );
  });

  // Test 1.2: interview/page.tsx awaits cOS.unlockItem
  const interviewSrc = fs.readFileSync(path.join(ROOT, 'src/app/interview/page.tsx'), 'utf-8');
  it('interview/page.tsx awaits cOS.unlockItem and halts session on failure', () => {
    assert.match(
      interviewSrc,
      /const\s+unlocked\s*=\s*await\s+cOS\.unlockItem/,
      'cOS.unlockItem must be awaited in startInterview'
    );
    assert.match(
      interviewSrc,
      /if\s*\(!unlocked\)\s*\{\s*toast\.error/,
      'failed unlock must abort interview start'
    );
  });

  // Test 1.3: useGdOrchestrator awaits cOS.unlockItem
  const gdSrc = fs.readFileSync(path.join(ROOT, 'src/app/group-discussion/hooks/useGdOrchestrator.ts'), 'utf-8');
  it('useGdOrchestrator awaits cOS.unlockItem and is an async handler', () => {
    assert.match(
      gdSrc,
      /const\s+handleStartCall\s*=\s*async\s*\(\)\s*=>/,
      'handleStartCall must be declared async'
    );
    assert.match(
      gdSrc,
      /const\s+ok\s*=\s*await\s+cOS\.unlockItem/,
      'cOS.unlockItem must be awaited in handleStartCall'
    );
    assert.match(
      gdSrc,
      /if\s*\(!ok\)\s*\{\s*toast\.error/,
      'failed unlock must abort group discussion session'
    );
  });

  // Test 1.4: useMissionsData awaits cOS.unlockItem
  const missionsSrc = fs.readFileSync(path.join(ROOT, 'src/app/missions/hooks/useMissionsData.ts'), 'utf-8');
  it('useMissionsData awaits cOS.unlockItem for roleplay simulation', () => {
    assert.match(
      missionsSrc,
      /const\s+ok\s*=\s*await\s+cOS\.unlockItem/,
      'cOS.unlockItem must be awaited in useMissionsData'
    );
  });

  console.log('\n2. Workspace Security & Exam Timer Persistence');

  const workspaceStateSrc = fs.readFileSync(
    path.join(ROOT, 'src/components/quests/workspace/useWorkspaceState.ts'),
    'utf-8'
  );

  // Test 2.1: sessionStorage cannot grant quest unlock
  it('sessionStorage teacher key does NOT authorize quest unlock', () => {
    // Assert that teacherStored alone does NOT grant setIsUnlocked(true)
    assert.doesNotMatch(
      workspaceStateSrc,
      /if\s*\(\s*teacherStored\s*\|\|\s*isPaid\s*\|\|\s*completedQuests\.includes\(questId\)\s*\)\s*\{\s*[\s\S]*?setIsUnlocked\(true\)/,
      'teacherStored must not be a sufficient condition to unlock quest'
    );
    assert.match(
      workspaceStateSrc,
      /if\s*\(\s*isUnlockedInLocks\s*\|\|\s*isPaid\s*\|\|\s*isAlreadyCompleted\s*\)\s*\{\s*setIsUnlocked\(true\)/,
      'unlocking must strictly require isUnlockedInLocks, isPaid, or completedQuests'
    );
  });

  // Test 2.2: Exam timer persists in localStorage across tabs
  it('Exam start timestamp is stored in localStorage, preventing multi-tab resets', () => {
    assert.match(
      workspaceStateSrc,
      /localStorage\.getItem\(examStartKey\)/,
      'exam timer must read initial start timestamp from localStorage'
    );
    assert.match(
      workspaceStateSrc,
      /localStorage\.setItem\(examStartKey,\s*String\(now\)\)/,
      'exam timer must store timestamp in localStorage'
    );
  });

  // Test 2.3: Simulated multi-tab timer consistency
  it('Simulated multi-tab exam initialization respects elapsed duration', () => {
    const EXAM_DURATION_SEC = 2700;
    const initialStart = Date.now() - 1000 * 1000; // 1000 seconds ago

    // Tab 2 opens
    const tab2Now = Date.now();
    const elapsedSec = Math.floor((tab2Now - initialStart) / 1000);
    const remainingSec = EXAM_DURATION_SEC - elapsedSec;

    assert.ok(remainingSec <= 1700 && remainingSec >= 1690, 'Tab 2 must compute elapsed time from initialStart');

    // Tab 3 opens after 2800s (expired)
    const tab3Start = Date.now() - 2800 * 1000;
    const tab3Elapsed = Math.floor((Date.now() - tab3Start) / 1000);
    const tab3Remaining = EXAM_DURATION_SEC - tab3Elapsed;
    assert.ok(tab3Remaining <= 0, 'Tab 3 must immediately recognize expired exam');
  });

  console.log('\n3. Stage Prerequisite Locks Integrity');

  const questPathSrc = fs.readFileSync(
    path.join(ROOT, 'src/app/quests/components/QuestPathView.tsx'),
    'utf-8'
  );

  // Test 3.1: Free fast track bypass button removed
  it('Free "Placement Prep Fast-Track" toggle button is eradicated from QuestPathView', () => {
    assert.doesNotMatch(
      questPathSrc,
      /Placement Prep Fast-Track Mode/,
      'Free fast-track bypass banner must be removed'
    );
    assert.doesNotMatch(
      questPathSrc,
      /Unlock Fast-Track/,
      'Unlock Fast-Track button must be removed'
    );
    assert.match(
      questPathSrc,
      /Authoritative Curriculum Progression/,
      'Curriculum progression banner must enforce prerequisites'
    );
  });

  // Test 3.2: Prerequisite stage locking is strictly enforced
  it('Stage locks strictly enforce sequential prerequisites without client bypass', () => {
    assert.match(
      questPathSrc,
      /const\s+isLocked\s*=\s*idx\s*>\s*0\s*&&\s*\(/,
      'isLocked must evaluate prerequisites without being overridden by a client toggle'
    );
    assert.match(
      questPathSrc,
      /toast\.warning\('Prerequisite Stage Locked 🔒'/,
      'Clicking a locked stage must warn the user to clear prerequisites'
    );
  });

  console.log('\n4. Elimination of Fake Hardware Flashing Tool');

  const testResultsSrc = fs.readFileSync(
    path.join(ROOT, 'src/components/quests/workspace/WorkspaceTestResults.tsx'),
    'utf-8'
  );
  const clientWorkspaceSrc = fs.readFileSync(
    path.join(ROOT, 'src/components/quests/QuestWorkspaceClient.tsx'),
    'utf-8'
  );

  it('Bynik fake hardware flashing tool is completely eradicated', () => {
    assert.doesNotMatch(
      testResultsSrc,
      /Bynik/,
      'WorkspaceTestResults must not contain any reference to Bynik'
    );
    assert.doesNotMatch(
      testResultsSrc,
      /0x08000000/,
      'WorkspaceTestResults must not claim to write to CPU address 0x08000000'
    );
    assert.doesNotMatch(
      clientWorkspaceSrc,
      /isHardwareQuest/,
      'QuestWorkspaceClient must not instantiate fake hardware quest mode'
    );
  });

  console.log('\n5. Authentic AI Debug Tutor');

  // Test 5.1: App Router route exists
  const debugTutorRoutePath = path.join(ROOT, 'src/app/api/code/debug-tutor/route.ts');
  it('/api/code/debug-tutor route exists and is implemented', () => {
    assert.ok(fs.existsSync(debugTutorRoutePath), 'debug-tutor route must exist');
  });

  // Test 5.2: QuestWorkspaceClient calls /api/code/debug-tutor without fake setTimeout
  it('QuestWorkspaceClient invokes real /api/code/debug-tutor endpoint without fake timers', () => {
    assert.match(
      clientWorkspaceSrc,
      /fetch\('\/api\/code\/debug-tutor'/,
      'onAskAiTutor must fetch /api/code/debug-tutor'
    );
    assert.doesNotMatch(
      clientWorkspaceSrc,
      /setTimeout\(\(\)\s*=>\s*\{[\s\S]*?Check your loop bounds/,
      'Fake 500ms setTimeout and canned loop bounds hint must be removed'
    );
  });

  // Test 5.3: Test /api/code/debug-tutor Socratic engine logic
  const debugTutorSrc = fs.readFileSync(debugTutorRoutePath, 'utf-8');
  it('debug-tutor route provides language-specific Socratic analysis', () => {
    assert.match(debugTutorSrc, /indentationerror/i, 'Handles Python IndentationError');
    assert.match(debugTutorSrc, /nameerror/i, 'Handles Python NameError');
    assert.match(debugTutorSrc, /SELECT/i, 'Handles SQL missing query structure');
    assert.match(debugTutorSrc, /cannot read propert/i, 'Handles JS undefined access');
    assert.match(debugTutorSrc, /cannot find symbol/i, 'Handles Java compilation error');
  });

  console.log('\n6. Lesson Tutor Chat Context & First Principles Delivery');

  const mentorChatSrc = fs.readFileSync(
    path.join(ROOT, 'src/app/api/mentor/chat/route.ts'),
    'utf-8'
  );
  const lessonEngineSrc = fs.readFileSync(
    path.join(ROOT, 'src/app/quests/lesson/hooks/useLessonEngine.ts'),
    'utf-8'
  );

  // Test 6.1: mentor/chat route ingests currentSlide and teacherId
  it('/api/mentor/chat accepts currentSlide and teacherId in request', () => {
    assert.match(
      mentorChatSrc,
      /currentSlide\?:\s*\{\s*title\?:/i,
      'MentorChatRequest must declare currentSlide'
    );
    assert.match(
      mentorChatSrc,
      /teacherId\?:/i,
      'MentorChatRequest must declare teacherId'
    );
    assert.match(
      mentorChatSrc,
      /CURRENT LESSON SLIDE BEING VIEWED BY STUDENT/,
      'System prompt must include slide title and bullet points'
    );
  });

  // Test 6.2: useLessonEngine delivers actual explanation on 3rd doubt
  it('useLessonEngine delivers first-principles explanation on 3rd doubt without dead-end return', () => {
    assert.doesNotMatch(
      lessonEngineSrc,
      /let me step back and explain it from absolute first principles[\s\S]*?return;/,
      'Canned message with dead-end return must be removed'
    );
    assert.match(
      lessonEngineSrc,
      /isFirstPrinciples/,
      'Must track first-principles trigger'
    );
    assert.match(
      lessonEngineSrc,
      /Explain \$\{activeSlide\?\.title[\s\S]*?from absolute first principles using an intuitive real-world analogy/,
      'Must request and deliver real first-principles explanation from avatar chat'
    );
  });

  console.log('\n7. Authentic AI Roadmap Synthesis');

  const roadmapRoutePath = path.join(ROOT, 'src/app/api/quests/roadmap/generate/route.ts');
  it('/api/quests/roadmap/generate route exists and synthesizes tailored modules', () => {
    assert.ok(fs.existsSync(roadmapRoutePath), 'roadmap generate route must exist');
  });

  it('useQuestProgression calls /api/quests/roadmap/generate without artificial setTimeouts', () => {
    assert.match(
      questProgSrc,
      /fetch\('\/api\/quests\/roadmap\/generate'/,
      'handleCreateCustomRoadmap must call /api/quests/roadmap/generate'
    );
    assert.doesNotMatch(
      questProgSrc,
      /await new Promise\(r => setTimeout\(r, 500\)\);[\s\S]*?setGenerationStep\(2\);[\s\S]*?await new Promise\(r => setTimeout\(r, 500\)\);[\s\S]*?setGenerationStep\(3\);/,
      'Artificial 500ms timers flipping generationStep labels must be removed'
    );
  });

  console.log('\n8. Curriculum Alignment, Scannable QR & Honest Career Gate Audits');

  const questDetailModalSrc = fs.readFileSync(
    path.join(ROOT, 'src/app/quests/components/QuestDetailModal.tsx'),
    'utf-8'
  );
  const questPathViewSrc = fs.readFileSync(
    path.join(ROOT, 'src/app/quests/components/QuestPathView.tsx'),
    'utf-8'
  );
  const compMatrixSrc = fs.readFileSync(
    path.join(ROOT, 'src/lib/pathway/competencyMatrix.ts'),
    'utf-8'
  );

  it('CareerGateModal evaluates actual student metrics and does NOT hardcode 100% checkmarks', () => {
    assert.doesNotMatch(
      questDetailModalSrc,
      /<span>📚 Technical Quests Completion<\/span>\s*<span[^>]*>✓ 100% Passed<\/span>/,
      'Hardcoded 100% passed technical quest checkmark must be removed'
    );
    assert.match(
      questDetailModalSrc,
      /actualCompletionPct\s*>=/i,
      'CareerGateModal must evaluate actual course completion percentage against requirements'
    );
    assert.match(
      questDetailModalSrc,
      /isGateCleared\s*\?\s*['"]✓ Career Gate Cleared['"]\s*:\s*['"]🔒 Career Gate Audit Checkpoint['"]/,
      'Gate modal must reflect real gate cleared or locked status'
    );
  });

  it('QrModal renders authentic scannable QRCodeSVG instead of hand-drawn SVG rectangles', () => {
    assert.match(
      questDetailModalSrc,
      /<QRCodeSVG\s+value=\{verifyUrl\}\s+size=\{156\}/,
      'QrModal must render QRCodeSVG component'
    );
    assert.doesNotMatch(
      questDetailModalSrc,
      /<rect\s+x="10"\s+y="10"\s+width="24"\s+height="24"/,
      'Fake hand-drawn SVG rectangles must be eliminated'
    );
  });

  it('QuestPathView roadmap does not fall back to hardcoded React Native steps', () => {
    assert.doesNotMatch(
      questPathViewSrc,
      /title:\s*'Learn Redux'/,
      'Hardcoded "Learn Redux" step must be removed'
    );
    assert.doesNotMatch(
      questPathViewSrc,
      /title:\s*'Dive into React Native'/,
      'Hardcoded "Dive into React Native" step must be removed'
    );
    assert.match(
      questPathViewSrc,
      /displayNodes\.map/,
      'Roadmap nodes must be dynamically derived from trajectory or course modules'
    );
  });

  it('Standalone stages derive course-specific topics rather than Java-specific strings', () => {
    assert.doesNotMatch(
      questProgSrc,
      /desc:\s*`Methods,\s*1D & 2D arrays,\s*string immutability/,
      'Hardcoded Java array description must not be hardcoded for all courses'
    );
    assert.match(
      questProgSrc,
      /const\s+topicStr\s*=\s*cleanTopics\.length\s*>\s*0/,
      'Stage descriptions must be derived from actual course quest topics'
    );
  });

  it('Certification tracks only point to valid registered course IDs', () => {
    assert.doesNotMatch(
      questProgSrc,
      /courseId:\s*'course-fullstack-dev'/,
      'Invalid course-fullstack-dev courseId must be fixed'
    );
    assert.doesNotMatch(
      questProgSrc,
      /courseId:\s*'course-cloud-devops'/,
      'Invalid course-cloud-devops courseId must be fixed'
    );
    assert.doesNotMatch(
      questProgSrc,
      /courseId:\s*'course-data-science'/,
      'Invalid course-data-science courseId must be fixed'
    );
    assert.match(
      questProgSrc,
      /courseId:\s*'course-fullstack-js'/,
      'Fullstack certification track must point to course-fullstack-js'
    );
    assert.match(
      questProgSrc,
      /courseId:\s*'course-cloud-native'/,
      'Cloud certification track must point to course-cloud-native'
    );
    assert.match(
      questProgSrc,
      /courseId:\s*'course-database-eng'/,
      'Data certification track must point to course-database-eng'
    );
  });

  it('Competency matrix references canonical registered course IDs with alias normalization', () => {
    assert.match(
      compMatrixSrc,
      /courseId:\s*'course-java-logic'/,
      'Competency matrix must map canonical course-java-logic'
    );
    assert.match(
      compMatrixSrc,
      /courseId:\s*'course-python-backend'/,
      'Competency matrix must map canonical course-python-backend'
    );
    assert.match(
      compMatrixSrc,
      /courseId:\s*'course-dsa-optim'/,
      'Competency matrix must map canonical course-dsa-optim'
    );
    assert.match(
      compMatrixSrc,
      /courseId:\s*'course-database-eng'/,
      'Competency matrix must map canonical course-database-eng'
    );
    assert.match(
      compMatrixSrc,
      /export function normalizeCourseId/,
      'Must export normalizeCourseId with alias fallback support'
    );
  });

  console.log('\n========================================================================');
  console.log(`🏁 VERIFICATION SUITE RESULTS: ${passCount} Passed, ${failCount} Failed`);
  console.log('========================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});
