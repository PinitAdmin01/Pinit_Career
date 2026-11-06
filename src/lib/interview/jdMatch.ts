// src/lib/interview/jdMatch.ts
/**
 * Job Description (JD) Matcher for AI Mock Interview Setup.
 *
 * Integrates the deterministic canonical skill ontology to parse real job descriptions,
 * compute candidate skill match coverage against their profile, identify skill gaps,
 * and synthesize customized technical interview topics and interview context.
 *
 * Replaces hardcoded assumptions with real keyword parsing and exact ontology mapping.
 */

import {
  matchJobDescription,
  candidateSkillsFromProfile,
  requiredSkillsFromJd,
  type JdMatchResult,
  type JdVerdict,
} from '@/lib/opportunities/jdMatch';

export {
  matchJobDescription,
  candidateSkillsFromProfile,
  requiredSkillsFromJd,
  type JdMatchResult,
  type JdVerdict,
};

export interface InterviewJdFocus {
  primaryTopic: string;
  focusAreas: string[];
  matchedSkills: string[];
  missingSkills: string[];
  sampleQuestions: string[];
  difficultyRecommendation: 'easy' | 'normal' | 'hard';
}

export interface JdInterviewContext {
  matchResult: JdMatchResult;
  interviewTopic: string;
  promptContext: string;
  focus: InterviewJdFocus;
}

/**
 * Derives tailored interview focus areas and difficulty recommendation
 * based on the candidate's JD match analysis.
 */
export function deriveInterviewFocusFromJd(match: JdMatchResult): InterviewJdFocus {
  if (!match.analyzable || match.required_skills.length === 0) {
    return {
      primaryTopic: 'General Corporate & Technical Interview',
      focusAreas: ['Core Fundamentals', 'Communication & Problem Solving', 'Engineering Best Practices'],
      matchedSkills: match.matched_skills,
      missingSkills: match.missing_skills,
      sampleQuestions: [
        'Walk me through a challenging technical problem you solved recently.',
        'How do you prioritize trade-offs between code quality, scalability, and delivery speed?',
        'Describe how you diagnose and resolve a critical bug in production.'
      ],
      difficultyRecommendation: 'normal',
    };
  }

  const topSkills = match.required_skills.slice(0, 4);
  const primaryTopic = `Target JD: ${topSkills.join(', ')}`;

  // Focus areas prioritize gap skills (missing) to probe depth, followed by matched strengths
  const focusAreas: string[] = [];
  if (match.missing_skills.length > 0) {
    focusAreas.push(`Skill Gap Probing: ${match.missing_skills.slice(0, 3).join(', ')}`);
  }
  if (match.matched_skills.length > 0) {
    focusAreas.push(`Core Strengths Verification: ${match.matched_skills.slice(0, 3).join(', ')}`);
  }
  focusAreas.push('Production Architecture & Real-World Trade-Offs');

  // Generate deterministic questions mapped to skills
  const sampleQuestions: string[] = [];
  for (const skill of match.missing_skills.slice(0, 2)) {
    sampleQuestions.push(`The role requires ${skill}. How would you design a scalable service utilizing ${skill} and handle failure recovery?`);
  }
  for (const skill of match.matched_skills.slice(0, 2)) {
    sampleQuestions.push(`In your experience with ${skill}, what performance bottlenecks have you encountered and how did you resolve them?`);
  }
  if (sampleQuestions.length < 3) {
    sampleQuestions.push('How do you approach end-to-end testing and continuous delivery in a distributed environment?');
  }

  // Recommended difficulty based on match score
  let difficultyRecommendation: 'easy' | 'normal' | 'hard' = 'normal';
  if (match.match_score >= 75) {
    difficultyRecommendation = 'hard';
  } else if (match.match_score < 40) {
    difficultyRecommendation = 'easy';
  }

  return {
    primaryTopic,
    focusAreas,
    matchedSkills: match.matched_skills,
    missingSkills: match.missing_skills,
    sampleQuestions,
    difficultyRecommendation,
  };
}

/**
 * Creates full interview context and system prompt additions from a raw Job Description
 * and candidate profile.
 */
export function generateJdInterviewContext(jd: string, candidateProfile: unknown): JdInterviewContext {
  const candidateSkills = candidateSkillsFromProfile(candidateProfile);
  const matchResult = matchJobDescription(jd, candidateSkills);
  const focus = deriveInterviewFocusFromJd(matchResult);

  const promptContext = [
    `--- TARGET JOB DESCRIPTION CONTEXT ---`,
    `Match Score: ${matchResult.match_score}% (${matchResult.verdict.toUpperCase()})`,
    `Required Skills in Posting: ${matchResult.required_skills.join(', ') || 'None explicitly detected'}`,
    `Candidate Profile Strengths: ${matchResult.matched_skills.join(', ') || 'None matched'}`,
    `Identified Skill Gaps to Probe: ${matchResult.missing_skills.join(', ') || 'None identified'}`,
    `Recommended Panel Difficulty: ${focus.difficultyRecommendation.toUpperCase()}`,
    `--- FOCUS GUIDELINES ---`,
    `Probe the candidate thoroughly on both their verified strengths and their identified skill gaps. Require concrete architecture and code examples.`,
  ].join('\n');

  return {
    matchResult,
    interviewTopic: focus.primaryTopic,
    promptContext,
    focus,
  };
}
