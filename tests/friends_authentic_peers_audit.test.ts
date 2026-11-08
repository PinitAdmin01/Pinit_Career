import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { computeStudentMatch, CURRENT_STUDENT_PROFILE } from '../src/lib/friends/matching';

test('Brutal Audit: Friends Hub Zero Dummy Data, Non-Clone Identity & Light Mode CSS', async (t) => {
  const suggestionsRoute = fs.readFileSync(path.join(__dirname, '../src/app/api/friends/suggestions/route.ts'), 'utf8');
  const searchRoute = fs.readFileSync(path.join(__dirname, '../src/app/api/friends/search/route.ts'), 'utf8');
  const friendsCss = fs.readFileSync(path.join(__dirname, '../src/styles/friends.css'), 'utf8');

  await t.test('1. formatStudentName prevents clone "Student" cards and resolves distinct peer identities', () => {
    assert.ok(suggestionsRoute.includes('function formatStudentName'), 'suggestions route must define formatStudentName');
    assert.ok(suggestionsRoute.includes('Full-Stack Peer #'), 'Must distinguish Full-Stack peers by ID snippet');
    assert.ok(suggestionsRoute.includes('AI/ML Peer #'), 'Must distinguish AI/ML peers by ID snippet');
    assert.ok(searchRoute.includes('function formatStudentName'), 'search route must define formatStudentName');
  });

  await t.test('2. resolveStudentEducation fixes discipline vs institution separation', () => {
    assert.ok(suggestionsRoute.includes('B.Tech CS / Engineering'), 'Must format CS discipline to B.Tech CS / Engineering');
    assert.ok(suggestionsRoute.includes('Campus Directory'), 'Must assign Campus Directory when college is unspecified');
  });

  await t.test('3. ZERO fake library lists injected (never fake TypeScript, Next.js, Node.js arrays)', () => {
    assert.strictEqual(suggestionsRoute.includes("['TypeScript', 'Next.js', 'Node.js REST APIs', 'PostgreSQL']"), false);
    assert.strictEqual(suggestionsRoute.includes("['PyTorch', 'LangChain', 'RAG Architecture', 'LLM Prompt Engineering']"), false);
    assert.ok(suggestionsRoute.includes('Full-Stack Track'), 'Declares honest track focus tag when skills are empty');
  });

  await t.test('4. Dynamic affinity scoring produces varied, realistic match percentages', () => {
    const fullStackCandidate = {
      id: '87437a72-b72a-45ff-bd9c-5790f536307b',
      name: 'Full-Stack Peer #8743',
      college: 'Campus Directory',
      course: 'B.Tech CS / Engineering',
      skills: ['Full-Stack Track'],
      careerGoal: 'full_stack_developer'
    };

    const aiCandidate = {
      id: 'c615ea57-ffae-4c4a-84b3-62864de73e71',
      name: 'AI/ML Peer #C615',
      college: 'Campus Directory',
      course: 'B.Tech CS / Engineering',
      skills: ['AI/ML Track'],
      careerGoal: 'ai_ml_engineer'
    };

    const match1 = computeStudentMatch(CURRENT_STUDENT_PROFILE, fullStackCandidate);
    const match2 = computeStudentMatch(CURRENT_STUDENT_PROFILE, aiCandidate);

    assert.ok(match1.overallMatch >= 68 && match1.overallMatch <= 96, 'Match 1 must be within realistic bounds');
    assert.ok(match2.overallMatch >= 68 && match2.overallMatch <= 96, 'Match 2 must be within realistic bounds');
    // Scores must not be identical clones
    assert.notStrictEqual(match1.overallMatch, match2.overallMatch, 'Full-Stack vs AI candidates must have distinct synergy scores');
  });

  await t.test('5. Conversational icebreakers never output "Hey Student"', () => {
    const genericCandidate = {
      id: 'dummy-id',
      name: 'Student',
      college: 'Campus Directory',
      course: 'B.Tech CS',
      skills: []
    };
    const namedCandidate = {
      id: 'named-id',
      name: 'Priya Sharma',
      college: 'Campus Directory',
      course: 'B.Tech CS',
      skills: ['React']
    };

    const matchGeneric = computeStudentMatch(CURRENT_STUDENT_PROFILE, genericCandidate);
    const matchNamed = computeStudentMatch(CURRENT_STUDENT_PROFILE, namedCandidate);

    assert.strictEqual(matchGeneric.icebreakers[0].includes('Hey Student'), false, 'Must not say "Hey Student"');
    assert.ok(matchGeneric.icebreakers[0].includes('Hey there'), 'Must fall back to natural greeting "Hey there"');
    assert.ok(matchNamed.icebreakers[0].includes('Hey Priya'), 'Must greet by first name');
  });

  await t.test('6. Task 1 CSS: Light mode empty state renders with pure white card and zero dark blocks', () => {
    assert.ok(friendsCss.includes('var(--card, rgba(15, 23, 42, 0.6))'), 'CSS must use semantic card token');
    assert.ok(friendsCss.includes('var(--border, rgba(255, 255, 255, 0.14))'), 'CSS must use semantic border token');
    assert.ok(friendsCss.includes("background: #ffffff !important"), 'Light mode must explicitly enforce pure white background');
    assert.ok(friendsCss.includes("color: #0f172a !important"), 'Light mode must explicitly enforce dark slate text');
  });
});
