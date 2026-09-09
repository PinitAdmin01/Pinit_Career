/**
 * Regression guard for the /api/opportunities/match fix.
 *
 * Before: client.ts returned a fixed object to every user for every job —
 * score 78, matched ['React','Node.js','TypeScript'], missing ['Docker',
 * 'System Design']. The page rendered it, so nothing looked broken.
 *
 * Run: npx tsx audit/jdMatch.test.ts
 */
import {
  matchJobDescription,
  candidateSkillsFromProfile,
  requiredSkillsFromJd,
} from '@/lib/opportunities/jdMatch';

let fails = 0;
const results: string[] = [];
const eq = (name: string, got: unknown, want: unknown) => {
  const g = JSON.stringify(got);
  const w = JSON.stringify(want);
  const ok = g === w;
  if (!ok) fails++;
  results.push((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : `\n   got  ${g}\n   want ${w}`));
};

const jd = `We need a Senior Engineer.
Required: React, TypeScript, Docker and PostgreSQL.
You will build web apps with Node.js.`;

// Note: the ontology resolves "Node.js" to both Node.js and JavaScript. That is
// intended — Node implies the language — and it applies to both sides of the
// comparison, so it does not skew the score.
eq('extracts JD skills', requiredSkillsFromJd(jd).sort(),
  ['Docker', 'JavaScript', 'Node.js', 'PostgreSQL', 'React', 'TypeScript']);

const profile = { onboarding_answers: { skills: 'React, Node.js, Python' } };
eq('extracts candidate skills', candidateSkillsFromProfile(profile).sort(),
  ['JavaScript', 'Node.js', 'Python', 'React']);

const m = matchJobDescription(jd, candidateSkillsFromProfile(profile));
eq('matched', m.matched_skills.sort(), ['JavaScript', 'Node.js', 'React']);
eq('missing', m.missing_skills.sort(), ['Docker', 'PostgreSQL', 'TypeScript']);
eq('score is 3 of 6', m.match_score, 50);
eq('verdict', m.verdict, 'possible');
eq('is analyzable', m.analyzable, true);
eq('prep weeks scale with gaps', m.estimated_preparation_weeks, 6);

// The actual defect: the old handler gave every candidate the same answer.
const strong = matchJobDescription(jd,
  candidateSkillsFromProfile({ skills: ['Docker', 'PostgreSQL', 'TypeScript', 'React', 'Node.js'] }));
eq('a stronger candidate scores higher', strong.match_score, 100);
eq('full match verdict', strong.verdict, 'strong');
eq('no prep needed', strong.estimated_preparation_weeks, 0);
eq('scores differ between candidates', strong.match_score !== m.match_score, true);

const weak = matchJobDescription(jd, candidateSkillsFromProfile({ skills: 'Python' }));
eq('a weaker candidate scores lower', weak.match_score, 0);
eq('weak verdict', weak.verdict, 'stretch');

// Honesty: an unparseable posting must not produce a confident number.
const vague = matchJobDescription('Great culture, free snacks, join us!', ['React']);
eq('unrecognisable JD is not analyzable', vague.analyzable, false);
eq('unrecognisable JD scores 0', vague.match_score, 0);
eq('unrecognisable JD verdict', vague.verdict, 'unknown');

// Empty profile must not crash or invent skills.
eq('empty profile yields no skills', candidateSkillsFromProfile(null), []);
eq('empty profile still analyses the JD', matchJobDescription(jd, []).missing_skills.length, 6);

// Word-boundary traps the ontology exists to prevent.
eq('"s3" is not TypeScript', requiredSkillsFromJd('bucket s3 storage').includes('TypeScript'), false);
eq('no skills in empty JD', requiredSkillsFromJd(''), []);

console.log('\n' + results.join('\n'));
console.log(fails === 0 ? `\nALL ${results.length} PASSED` : `\n${fails} of ${results.length} FAILED`);
process.exit(fails === 0 ? 0 : 1);
