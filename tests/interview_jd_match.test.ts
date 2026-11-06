import test from 'node:test';
import assert from 'node:assert/strict';
import {
  matchJobDescription,
  candidateSkillsFromProfile,
  requiredSkillsFromJd,
  deriveInterviewFocusFromJd,
  generateJdInterviewContext,
} from '../src/lib/interview/jdMatch';

test('AI Interview Block 46 - Job Description Matcher Suite', async (t) => {
  const jdText = `We are seeking a Senior Full Stack Engineer.
  Requirements:
  - Strong proficiency in React, TypeScript, and Node.js.
  - Hands-on experience with PostgreSQL and Docker.
  - Familiarity with Redis and AWS cloud architecture.
  Bonus if you know Python and Kubernetes.`;

  await t.test('requiredSkillsFromJd extracts canonical skills accurately', () => {
    const skills = requiredSkillsFromJd(jdText);
    assert.ok(skills.includes('React'));
    assert.ok(skills.includes('TypeScript'));
    assert.ok(skills.includes('Node.js'));
    assert.ok(skills.includes('PostgreSQL'));
    assert.ok(skills.includes('Docker'));
    assert.ok(skills.includes('Redis'));
    assert.ok(skills.includes('Python'));
  });

  await t.test('candidateSkillsFromProfile extracts skills from array or comma-string', () => {
    const profile = {
      skills: ['React', 'TypeScript', 'Node.js'],
      onboarding_answers: { skills: 'PostgreSQL, Git' },
    };
    const extracted = candidateSkillsFromProfile(profile);
    assert.ok(extracted.includes('React'));
    assert.ok(extracted.includes('TypeScript'));
    assert.ok(extracted.includes('Node.js'));
    assert.ok(extracted.includes('PostgreSQL'));
  });

  await t.test('deriveInterviewFocusFromJd generates target focus, gap probing, and difficulty', () => {
    const candidateSkills = ['React', 'TypeScript', 'Node.js'];
    const match = matchJobDescription(jdText, candidateSkills);

    assert.ok(match.analyzable);
    assert.ok(match.match_score > 0 && match.match_score < 100);
    assert.ok(match.matched_skills.includes('React'));
    assert.ok(match.missing_skills.includes('Docker') || match.missing_skills.includes('PostgreSQL'));

    const focus = deriveInterviewFocusFromJd(match);
    assert.ok(focus.primaryTopic.startsWith('Target JD:'));
    assert.ok(focus.focusAreas.length >= 2);
    assert.ok(focus.sampleQuestions.length >= 2);
    assert.ok(['easy', 'normal', 'hard'].includes(focus.difficultyRecommendation));
  });

  await t.test('generateJdInterviewContext produces structured prompt context and question seeds', () => {
    const profile = { skills: 'React, Node.js, Python' };
    const context = generateJdInterviewContext(jdText, profile);

    assert.equal(typeof context.interviewTopic, 'string');
    assert.ok(context.promptContext.includes('TARGET JOB DESCRIPTION CONTEXT'));
    assert.ok(context.promptContext.includes('Candidate Profile Strengths:'));
    assert.ok(context.promptContext.includes('Identified Skill Gaps to Probe:'));
    assert.ok(context.focus.sampleQuestions.length > 0);
  });

  await t.test('handles non-analyzable / generic postings gracefully without throwing', () => {
    const context = generateJdInterviewContext('Looking for a rockstar guru with positive vibes!', {});
    assert.equal(context.matchResult.analyzable, false);
    assert.equal(context.matchResult.match_score, 0);
    assert.equal(context.matchResult.verdict, 'unknown');
    assert.equal(context.focus.difficultyRecommendation, 'normal');
    assert.ok(context.focus.sampleQuestions.length >= 2);
  });
});
