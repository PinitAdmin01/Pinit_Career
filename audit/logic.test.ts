/**
 * Regression guards for the pure decision logic added while fixing stubbed
 * handlers. Everything here runs without a database.
 *
 * The database-backed fixes (university analytics, attention-span progress,
 * avatar memory) are NOT covered — they need a live Supabase, and the pages
 * that exercise them redirect to '/' when signed out, so a browser walk cannot
 * reach them either. Those are type-checked and build, nothing more.
 *
 * Run: npx tsx audit/logic.test.ts
 */
import { buildAvatarRecommendations } from '@/lib/avatar/recommendations';
import { isPrivilegedRole, verifyItemDecision, buildRecommendation } from '@/lib/portfolio/endorsements';

let fails = 0;
const out: string[] = [];
const eq = (name: string, got: unknown, want: unknown) => {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  const ok = g === w;
  if (!ok) fails++;
  out.push((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : `\n   got  ${g}\n   want ${w}`));
};

// ── avatar recommendations ─────────────────────────────────────────────────
// Was: every student saw 'Improve DSA fit' and 'Scan your Resume', always.
{
  const strong = buildAvatarRecommendations({
    ats_score: 85, trust_score: 90, career_dna_score: 88,
    vault_count: 3, interviews_done: 4, missions_completed: 10, mission_streak: 5,
  });
  eq('a strong profile gets no nagging', strong, []);

  const weak = buildAvatarRecommendations({
    ats_score: 20, trust_score: 30, career_dna_score: 25,
    vault_count: 0, interviews_done: 0, missions_completed: 0, mission_streak: 0,
  });
  eq('a weak profile gets suggestions', weak.length > 0, true);
  eq('suggestions are capped', weak.length <= 6, true);
  eq('sorted by urgency', weak.every((r, i) => i === 0 || weak[i - 1].relevance >= r.relevance), true);
  eq('every suggestion cites a real field', weak.every((r) => !!r.basis), true);

  const named = buildAvatarRecommendations({
    ats_score: 80, trust_score: 80, career_dna_score: 80,
    vault_count: 1, interviews_done: 1, missions_completed: 1,
    weak_areas: ['System Design'],
  });
  eq('a named gap becomes a suggestion',
    named.map((r) => r.label), ['Close your gap in System Design']);

  eq('two different profiles differ',
    JSON.stringify(strong) !== JSON.stringify(weak), true);
  eq('empty profile does not crash', buildAvatarRecommendations(null).length > 0, true);
}

// ── portfolio endorsements ─────────────────────────────────────────────────
// The security-sensitive one: verification must stay refused for students.
{
  eq('teacher is privileged', isPrivilegedRole('teacher'), true);
  eq('admin is privileged', isPrivilegedRole('admin'), true);
  eq('student is not', isPrivilegedRole('student'), false);
  eq('undefined role is not', isPrivilegedRole(undefined), false);
  eq('empty string is not', isPrivilegedRole(''), false);

  const asStudent = verifyItemDecision({ type: 'project', id: 'p1' }, { id: 'u1', role: 'student' });
  eq('a student cannot verify', asStudent.allowed, false);
  eq('refusal is a 403', (asStudent as any).status, 403);

  const noRole = verifyItemDecision({ type: 'project', id: 'p1' }, { id: 'u1' });
  eq('a missing role cannot verify', noRole.allowed, false);

  const asFaculty = verifyItemDecision({ type: 'project', id: 'p1' }, { id: 'u9', role: 'faculty' });
  eq('faculty can verify', asFaculty.allowed, true);
  eq('records who verified', (asFaculty as any).verifiedBy, 'u9');

  const studentRec = buildRecommendation({ author: 'A', text: 'good' }, { id: 'u1', role: 'student' });
  eq('a student recommendation is unverified', studentRec.recommendation.verified, false);
  eq('and goes to pending review', studentRec.recommendation.pendingReview, true);

  const facultyRec = buildRecommendation({ author: 'B', text: 'great' }, { id: 'u9', role: 'teacher' });
  eq('a faculty recommendation is verified', facultyRec.recommendation.verified, true);
  eq('and is not pending', facultyRec.recommendation.pendingReview, false);
  eq('default role when none given', facultyRec.recommendation.role, 'Academic / Industry Mentor');
}

console.log('\n' + out.join('\n'));
console.log(fails === 0 ? `\nALL ${out.length} PASSED` : `\n${fails} of ${out.length} FAILED`);
process.exit(fails === 0 ? 0 : 1);
