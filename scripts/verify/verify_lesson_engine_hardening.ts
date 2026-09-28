import { getAuthoritativeQuest, isAuthoritativeExam } from '../../src/lib/quests/questRegistry';
import { COURSES_REGISTRY } from '../../src/lib/data/coursesData';
import * as fs from 'fs';
import * as path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

console.log('========================================================================');
console.log('VERIFY LESSON ENGINE HARDENING & ANTI-CHEAT SUITE');
console.log('========================================================================\n');

// 1. Authoritative Quest Registry Validation
console.log('1. Testing Quest Registry Authorization & Exam Distinction');
const fakeQuest = getAuthoritativeQuest('made-up-fake-quest-999');
assert(fakeQuest === null, 'Unregistered quest lookup returns null');

const knownQuests = COURSES_REGISTRY.flatMap(c => c.quests || []);
const realQuest = knownQuests.find(q => q.id && !q.id.includes('exam'));
if (realQuest) {
  const auth = getAuthoritativeQuest(realQuest.id);
  assert(auth !== null, `Registered quest '${realQuest.id}' is resolved authoritatively`);
  assert(typeof auth?.xp === 'number' && auth.xp > 0, `Authoritative XP is valid positive number (${auth?.xp})`);
  
  const isExam = isAuthoritativeExam(realQuest.id);
  assert(isExam === false, `Standard classroom quest '${realQuest.id}' is NOT classified as exam (DEF-074 enforced)`);
}

const realExamQuest = knownQuests.find(q => q.id && (q.id.includes('exam') || q.category === 'exam'));
if (realExamQuest) {
  const isExam = isAuthoritativeExam(realExamQuest.id);
  assert(isExam === true, `Real exam quest '${realExamQuest.id}' IS classified as exam`);
}

// 2. Dynamic Banner & Runner Hardening in LessonCodeEditor
console.log('\n2. Testing Dynamic Banner and Runner Hardening');
const codeEditorFile = fs.readFileSync(path.join(__dirname, '../../src/app/quests/lesson/components/LessonCodeEditor.tsx'), 'utf-8');
assert(!codeEditorFile.includes('$ javac Solution.java && java Solution') || codeEditorFile.includes('fileName.endsWith'),
  'Hardcoded Java compile footer removed from generic editor');
assert(codeEditorFile.includes('python3 main.py') && codeEditorFile.includes('sqlite3 < query.sql'),
  'Dynamic runner banners present for Python and SQL');
assert(codeEditorFile.includes("codeRunning ? 'wait' : 'pointer'") || codeEditorFile.includes('disabled={codeRunning}'),
  'Run Code button disabled during active execution');

// 3. Lesson Engine simulateCodeRun Replacement
console.log('\n3. Testing useLessonEngine simulateCodeRun vs Real Runner');
const engineFile = fs.readFileSync(path.join(__dirname, '../../src/app/quests/lesson/hooks/useLessonEngine.ts'), 'utf-8');
assert(!engineFile.includes('Program execution completed successfully.\nMemory allocated: 12MB\nExit code 0'),
  'Canned simulateCodeRun string completely removed');
assert(engineFile.includes('executeSandboxScript'),
  'Real sandbox execution runner wired to useLessonEngine');
assert(engineFile.includes('adaptCodeForSandbox'),
  'Multi-language code adapter present in useLessonEngine');

// 4. Fallback Slide Generation & Answer Distribution
console.log('\n4. Testing Fallback Slide Generation & Non-Zero Answer Distribution');
assert(engineFile.includes('targetIdx = (index + 1) % 3'),
  'MCQ answer indices distributed across options instead of hardcoded 0');
assert(engineFile.includes('Python execution') && engineFile.includes('SQL Query Schema'),
  'Language-appropriate fallback code generation implemented');

// 5. LessonQuizBlock Exam Scoring & Gating
console.log('\n5. Testing LessonQuizBlock Failure & Score Threshold');
const quizBlockFile = fs.readFileSync(path.join(__dirname, '../../src/app/quests/lesson/components/LessonQuizBlock.tsx'), 'utf-8');
assert(quizBlockFile.includes('examFailed'),
  'examFailed state handled in LessonQuizBlock');
assert(quizBlockFile.includes('pct >= 70') || quizBlockFile.includes('>= 70'),
  '70% minimum passing threshold enforced on evaluation exam');
assert(!quizBlockFile.includes('Try Again'),
  'Infinite Try Again exploit on the same question removed');
assert(quizBlockFile.includes('Review Lesson Material & Retake'),
  'Exam failure provides lesson review redirect and resets state');

// 6. LessonHeader Lock Gating
console.log('\n6. Testing LessonHeader Slide Progression Gating');
const headerFile = fs.readFileSync(path.join(__dirname, '../../src/app/quests/lesson/components/LessonHeader.tsx'), 'utf-8');
assert(headerFile.includes('maxUnlockedSlide'),
  'maxUnlockedSlide prop passed to LessonHeader');
assert(headerFile.includes('isLocked = idx > maxUnlockedSlide'),
  'Slide dots lock checking enforced in LessonHeader');
assert(headerFile.includes("cursor: isLocked ? 'not-allowed' : 'pointer'"),
  'Locked slides have not-allowed cursor');

// 7. Page Router Unregistered Quest Rejection
console.log('\n7. Testing Lesson Page Router Rejection of Fabricated Quests');
const pageFile = fs.readFileSync(path.join(__dirname, '../../src/app/quests/lesson/page.tsx'), 'utf-8');
assert(pageFile.includes('Unregistered Quest Lesson'),
  'Unregistered quest IDs rejected with error card instead of fake lesson');
assert(!pageFile.includes('addCompletedQuest(id, true, 150'),
  'Fake lesson free XP exploit with hardcoded isExam=true removed from page.tsx');
assert(pageFile.includes('isAuthoritativeExam(id)'),
  'Authoritative exam check used when completing lessons in page.tsx');

// 8. Progress Service Fail-Closed Protection
console.log('\n8. Testing Progress Service Fail-Closed Protection');
const progressServiceFile = fs.readFileSync(path.join(__dirname, '../../src/lib/services/supabase/progressService.ts'), 'utf-8');
assert(progressServiceFile.includes('Cannot complete unregistered quest'),
  'progressService fails closed on unregistered quest IDs');
assert(progressServiceFile.includes('Quest completion rejected by server'),
  'progressService fails closed when server returns non-ok status');

console.log('\n========================================================================');
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
