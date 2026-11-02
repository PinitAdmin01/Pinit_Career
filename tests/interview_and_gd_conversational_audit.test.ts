import { describe, it } from 'node:test';
import assert from 'node:assert';

import { generateProgressiveFallbackQuestion } from '../src/app/api/interview/chat/route';
import {
  hostIntroScript,
  executeGdTurn,
  gdDisplayName,
  normalizeMentorId
} from '../src/lib/group-discussion/gdTurnEngine';
import { TEACHER_NAV, ADMIN_NAV, isPathActive } from '../src/components/ui/AppSidebar';
import { ALL_FACULTY_STUDIOS } from '../src/components/teacher/TeacherDashboard';

describe('AI Interview Conversational Fluidity Audit', () => {
  it('extracts technical nouns and actively reflects candidate context in Round 1', () => {
    const history = [
      { role: 'assistant', content: 'Welcome to your interview. Tell me about your background.' },
      { role: 'user', content: 'I have been leading a team of 4 engineers building high-throughput microservices with Kafka and PostgreSQL.' }
    ];

    const reply = generateProgressiveFallbackQuestion({
      stage: 'round1_behavioral',
      subTopic: 'SOFTWARE ENGINEERING',
      history,
      difficulty: 'normal',
      interviewerName: 'Ms. Priya'
    });

    // Must NOT be a canned static question
    assert.ok(reply.includes('Ms. Priya'), 'Must include interviewer name');
    // Must actively reflect either kafka, postgresql, microservices, or leading
    const lowerReply = reply.toLowerCase();
    const hasReflection = lowerReply.includes('kafka') || lowerReply.includes('postgresql') || lowerReply.includes('microservices') || lowerReply.includes('leading');
    assert.ok(hasReflection, `Expected reflection of candidate input, but got: "${reply}"`);
    assert.ok(reply.includes('?'), 'Must ask a follow-up question');
  });

  it('probes complexity and edge cases in Round 2 coding based on user input', () => {
    const history = [
      { role: 'assistant', content: 'Let us discuss your solution.' },
      { role: 'user', content: 'I implemented a two-pointer approach caching prefix sums in an array to reduce lookups.' }
    ];

    const reply = generateProgressiveFallbackQuestion({
      stage: 'round2_coding',
      subTopic: 'ALGORITHMS',
      history,
      difficulty: 'hard',
      interviewerName: 'Mr. Rohan'
    });

    assert.ok(reply.includes('Mr. Rohan'), 'Must include interviewer name');
    const lowerReply = reply.toLowerCase();
    const hasReflection = lowerReply.includes('caching') || lowerReply.includes('prefix') || lowerReply.includes('approach') || lowerReply.includes('pointer');
    assert.ok(hasReflection, `Expected reflection of coding approach, but got: "${reply}"`);
    assert.ok(lowerReply.includes('complexity') || lowerReply.includes('boundary') || lowerReply.includes('concurrent') || lowerReply.includes('unit test'), 'Must probe coding invariants');
  });

  it('probes system bottlenecks and failover in Round 3 architecture', () => {
    const history = [
      { role: 'assistant', content: 'Explain your system architecture.' },
      { role: 'user', content: 'We put a Redis cluster in front of MongoDB with rate limiting via token bucket.' }
    ];

    const reply = generateProgressiveFallbackQuestion({
      stage: 'round3_systems',
      subTopic: 'DISTRIBUTED SYSTEMS',
      history,
      difficulty: 'normal',
      interviewerName: 'Mr. Vikram'
    });

    assert.ok(reply.includes('Mr. Vikram'), 'Must include interviewer name');
    const lowerReply = reply.toLowerCase();
    const hasReflection = lowerReply.includes('redis') || lowerReply.includes('mongodb') || lowerReply.includes('rate limit');
    assert.ok(hasReflection, `Expected reflection of systems architecture, but got: "${reply}"`);
  });

  it('probes empirical evidence and SLAs in Round 4 executive deep dive', () => {
    const history = [
      { role: 'assistant', content: 'How does your solution scale?' },
      { role: 'user', content: 'We achieved a 45% latency reduction across all checkout endpoints.' }
    ];

    const reply = generateProgressiveFallbackQuestion({
      stage: 'round4_star',
      subTopic: 'SOFTWARE ARCHITECTURE',
      history,
      difficulty: 'normal',
      interviewerName: 'Ms. Aisha'
    });

    assert.ok(reply.includes('Ms. Aisha'), 'Must include interviewer name');
    const lowerReply = reply.toLowerCase();
    const hasMetricOrImpact = lowerReply.includes('45%') || lowerReply.includes('metric') || lowerReply.includes('benchmark') || lowerReply.includes('sla');
    assert.ok(hasMetricOrImpact, `Expected reflection of metric or executive follow-up, but got: "${reply}"`);
  });
});

describe('Group Discussion Turn Engine Audit', () => {
  it('generates clear host intro script with room name and objective', () => {
    const intro = hostIntroScript('Ms. Priya', 'Cloud Infrastructure Outage', 'Determine failover sequence', 10);
    assert.ok(intro.includes('Ms. Priya'), 'Host name included');
    assert.ok(intro.includes('Cloud Infrastructure Outage'), 'Topic included');
    assert.ok(intro.includes('10 minutes'), 'Duration included');
    assert.ok(intro.includes('Candidate, you have the floor'), 'Handoff to candidate included');
  });

  it('Avatar A adopts aggressive challenger tone attacking candidate assumptions', async () => {
    const mockLlm = async () => { throw new Error('Simulate offline LLM'); };
    const turnResult = await executeGdTurn({
      roleType: 'avatar_a',
      mentorId: 'kashyap',
      topic: 'Database Sharding Strategy',
      domain: 'technical',
      difficulty: 'hard',
      candidateName: 'Alex',
      history: [
        { role: 'user', content: 'We should shard the primary database by customer geographic region immediately.' }
      ]
    }, mockLlm);

    assert.equal(turnResult.roleType, 'avatar_a');
    const reply = turnResult.reply;
    assert.ok(reply.toLowerCase().includes('challenge'), 'Avatar A must challenge the assertion');
    assert.ok(reply.toLowerCase().includes('risk') || reply.toLowerCase().includes('flaw'), 'Avatar A must probe risks/flaws');
  });

  it('Avatar B adopts balancing synthesis tone and passes floor back to candidate', async () => {
    const mockLlm = async () => { throw new Error('Simulate offline LLM'); };
    const turnResult = await executeGdTurn({
      roleType: 'avatar_b',
      mentorId: 'divya',
      topic: 'Database Sharding Strategy',
      domain: 'technical',
      difficulty: 'medium',
      candidateName: 'Alex',
      history: [
        { role: 'user', content: 'We should shard the database by customer geographic region.' },
        { role: 'assistant', content: 'I challenge that assertion because geographic sharding creates hotspot imbalances.' }
      ]
    }, mockLlm);

    assert.equal(turnResult.roleType, 'avatar_b');
    const reply = turnResult.reply;
    assert.ok(reply.includes('Alex, you have the floor'), 'Avatar B must return the floor to the Candidate');
  });
});

describe('Portal & Navigation Accessibility Audit', () => {
  it('TEACHER_NAV contains AI Interview Studio and GD Boardroom links', () => {
    const mentoringSection = TEACHER_NAV.find(s => s.section === 'Academic Mentoring');
    assert.ok(mentoringSection, 'Academic Mentoring section must exist in TEACHER_NAV');
    
    const interviewItem = mentoringSection.items.find(i => i.href === '/interview');
    assert.ok(interviewItem, 'TEACHER_NAV must contain /interview link');
    
    const gdItem = mentoringSection.items.find(i => i.href === '/interview?tab=gd');
    assert.ok(gdItem, 'TEACHER_NAV must contain /interview?tab=gd link');
  });

  it('ADMIN_NAV contains both AI Interview and GD Boardroom links', () => {
    const allAdminLinks = ADMIN_NAV.flatMap(s => s.items.flatMap(i => i.children ? i.children : [i]));
    const hasInterview = allAdminLinks.some(i => i.href === '/interview');
    const hasGd = allAdminLinks.some(i => i.href === '/interview?tab=gd');
    assert.ok(hasInterview, 'ADMIN_NAV must contain /interview link');
    assert.ok(hasGd, 'ADMIN_NAV must contain /interview?tab=gd link');
  });

  it('isPathActive correctly highlights GD tab and does not false-positive for 1v1 interview', () => {
    // GD Tab active:
    assert.strictEqual(isPathActive('/interview', '/interview?tab=gd', 'tab=gd'), true, 'Should highlight GD tab when tab=gd');
    assert.strictEqual(isPathActive('/interview', '/interview', 'tab=gd'), false, 'Should not highlight 1v1 interview when tab=gd');

    // 1v1 Interview active:
    assert.strictEqual(isPathActive('/interview', '/interview', ''), true, 'Should highlight 1v1 interview when no tab query');
    assert.strictEqual(isPathActive('/interview', '/interview?tab=gd', ''), false, 'Should not highlight GD tab when on 1v1 interview');
  });

  it('ALL_FACULTY_STUDIOS includes AI Interview and Boardroom GD entries', () => {
    const hasInterviewStudio = ALL_FACULTY_STUDIOS.some(s => s.id === 'ai-interview');
    const hasGdStudio = ALL_FACULTY_STUDIOS.some(s => s.id === 'group-discussion');
    assert.ok(hasInterviewStudio, 'ALL_FACULTY_STUDIOS must include ai-interview');
    assert.ok(hasGdStudio, 'ALL_FACULTY_STUDIOS must include group-discussion');
  });
});
