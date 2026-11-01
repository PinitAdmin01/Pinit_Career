import test from 'node:test';
import assert from 'node:assert/strict';
import { CANONICAL_TRAJECTORIES } from '../src/lib/data/careerTrajectories';
import { generateDynamicStudentRoadmap } from '../src/lib/data/roadmapFuser';
import { generateStructuredResume } from '../src/lib/ats/resumeGenerator';
import { auditResumeATS } from '../src/lib/ats/atsScreener';
import { matchJobDescription, requiredSkillsFromJd } from '../src/lib/opportunities/jdMatch';
import { generateResumeHtml } from '../src/lib/printResume';
import { TRACKS } from '../src/lib/onboarding/trackResolver';

test('Career Builder: CANONICAL_TRAJECTORIES contains diverse tracks and react zero-to-pro', () => {
  assert.ok(CANONICAL_TRAJECTORIES['fullstack-developer'], 'fullstack-developer must exist');
  assert.ok(CANONICAL_TRAJECTORIES['python-basic-to-advance'], 'python-basic-to-advance must exist');
  assert.ok(CANONICAL_TRAJECTORIES['react-basic-to-advance'], 'react-basic-to-advance must exist');
  assert.ok(CANONICAL_TRAJECTORIES['digital-accountant'], 'digital-accountant must exist');
  assert.ok(CANONICAL_TRAJECTORIES['ai-llm-engineer'], 'ai-llm-engineer must exist');

  const reactTraj = CANONICAL_TRAJECTORIES['react-basic-to-advance'];
  assert.strictEqual(reactTraj.roleId, 'react-basic-to-advance');
  assert.strictEqual(reactTraj.nodes[0].courseId, 'course-react-web');
  assert.ok(reactTraj.nodes.length >= 3, 'Must have at least 3 progressive nodes');
});

test('Career Builder: generateDynamicStudentRoadmap generates distinct milestone titles and non-duplicate descriptions', () => {
  const modules = generateDynamicStudentRoadmap({
    courseId: 'course-react-web',
    goal: 'React Frontend SDE',
    qt1: 65,
    qt2: 70,
    archetype: 'Pattern Hunter',
    durationDays: 30,
    dailyPace: 2,
  });

  assert.ok(modules.length >= 2, 'Should generate multiple phases');

  // Verify phase titles are NOT identical
  const titles = modules.map(m => m.title);
  const uniqueTitles = new Set(titles);
  assert.strictEqual(uniqueTitles.size, titles.length, 'Every stage phase title must be unique and distinct');

  // Verify Phase 1, Phase 2 have distinct milestone names
  assert.ok(titles[0].includes('Phase 1'), 'First module should be Phase 1');
  assert.ok(titles[0].includes('Foundations, Core Syntax & Mental Models'), 'Phase 1 should reflect foundation milestone');
  if (titles[1]) {
    assert.ok(titles[1].includes('Phase 2'), 'Second module should be Phase 2');
    assert.ok(titles[1].includes('Architecture, State Patterns & Deep Logic'), 'Phase 2 should reflect architecture milestone');
  }

  // Verify descriptions are unique and contain quest range details
  const descs = modules.map(m => m.desc);
  const uniqueDescs = new Set(descs);
  assert.strictEqual(uniqueDescs.size, descs.length, 'Descriptions must be unique and informative for each phase');
});

test('Career Builder ATS Studio: JD matching and ATS screening correctly evaluate real skills', () => {
  const sampleJd = `
    Looking for a Senior Full-Stack Engineer.
    Required skills: React, TypeScript, Next.js, Node.js, PostgreSQL, Docker, Redis.
  `;

  const candidateSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git'];
  const jdResult = matchJobDescription(sampleJd, candidateSkills);

  assert.ok(jdResult.analyzable, 'JD should be analyzable');
  assert.ok(jdResult.matched_skills.includes('React'), 'React should be matched');
  assert.ok(jdResult.matched_skills.includes('TypeScript'), 'TypeScript should be matched');
  assert.ok(jdResult.missing_skills.includes('Docker'), 'Docker should be detected as missing gap');

  const requiredFromJd = requiredSkillsFromJd(sampleJd);
  assert.ok(requiredFromJd.length >= 3, 'Must extract required skills from JD');
});

test('Career Builder Resume Studio: Generates structured resume and printable HTML without layout errors', () => {
  const profile = {
    fullName: 'Arya Dev',
    email: 'arya@pinit.os',
    phone: '+91 98765 43210',
    degree: 'B.Tech Computer Science',
    institution: 'National Institute of Technology',
    graduationYear: '2023 - 2027',
    gpa: '9.1 / 10.0 CGPA',
    targetRole: 'Full-Stack Software Developer',
  };

  const synthesized = generateStructuredResume(profile, [], TRACKS.frontend);
  assert.ok(synthesized.plainText.toLowerCase().includes('arya dev'), 'Plain text must contain candidate name');
  assert.ok(synthesized.formData.fullName === 'Arya Dev');
  assert.ok(synthesized.formData.skills.technical.length > 0, 'Must have technical skills');

  const report = auditResumeATS(synthesized.plainText, {
    targetRole: synthesized.targetRoleCategory,
  });

  assert.ok(report.compositeScore >= 80, `Expected ATS score >= 80, got ${report.compositeScore}`);
  assert.strictEqual(report.extractedProfile.layoutRisk, 'Low');

  const html = generateResumeHtml(synthesized.formData);
  assert.ok(html.includes('Arya Dev'), 'HTML output must contain candidate name');
  assert.ok(html.includes('<!DOCTYPE html>'), 'HTML output must be valid document');
});


test('Career Builder: Custom candidate details override and 6-vendor ATS simulation profiles reflect accurately', () => {
  const customProfile = {
    fullName: 'Priya Sharma',
    email: 'priya.sharma@iitb.ac.in',
    phone: '+91 99887 76655',
    address: 'Mumbai, Maharashtra, India',
    linkedin: 'linkedin.com/in/priyasharma',
    github: 'github.com/priyasharma',
    portfolio: 'https://priyasharma.tech',
    degree: 'B.Tech Electrical & Computer Engineering',
    institution: 'Indian Institute of Technology Bombay',
    graduationYear: '2024 - 2028',
    gpa: '9.6 / 10.0 CGPA',
    targetRole: 'React Frontend SDE (Basic to Advance)',
  };

  const synthesized = generateStructuredResume(customProfile, [], TRACKS.frontend);
  assert.ok(synthesized.plainText.toLowerCase().includes('priya sharma'), 'Must reflect custom candidate name');
  assert.ok(synthesized.plainText.includes('Indian Institute of Technology Bombay'), 'Must reflect custom college');
  assert.ok(synthesized.plainText.includes('9.6 / 10.0 CGPA'), 'Must reflect custom GPA');

  const report = auditResumeATS(synthesized.plainText, {
    targetRole: synthesized.targetRoleCategory,
  });

  assert.ok(report.vendorProfiles, 'Must generate vendor profiles');
  assert.ok(typeof report.vendorProfiles.greenhouseInspired === 'number', 'Greenhouse simulation required');
  assert.ok(typeof report.vendorProfiles.workdayInspired === 'number', 'Workday simulation required');
  assert.ok(typeof report.vendorProfiles.leverInspired === 'number', 'Lever simulation required');
  assert.ok(typeof report.vendorProfiles.taleoInspired === 'number', 'Taleo simulation required');
  assert.ok(typeof report.vendorProfiles.icimsInspired === 'number', 'iCIMS simulation required');
  assert.ok(typeof report.vendorProfiles.ashbyInspired === 'number', 'Ashby simulation required');

  const reactTraj = CANONICAL_TRAJECTORIES['react-basic-to-advance'];
  assert.ok(reactTraj, 'react-basic-to-advance must exist');
  assert.strictEqual(reactTraj.nodes[0].courseId, 'course-react-web', 'Primary course must be course-react-web');
});
