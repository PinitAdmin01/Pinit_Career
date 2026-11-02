import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { generateProgressiveFallbackQuestion } from '../src/app/api/interview/chat/route';
import { executeGdTurn, hostIntroScript } from '../src/lib/group-discussion/gdTurnEngine';
import { TEACHER_NAV, ADMIN_NAV, STUDENT_NAV, RIGHT_NAV, isPathActive, NavGroup } from '../src/components/ui/AppSidebar';

describe('BRUTAL STRANGER AUDIT: AI Interview & Conversational Fluidity', () => {
  test('Stranger Test 1: Complete gibberish/nonsense input gracefully handled without crash', () => {
    const res = generateProgressiveFallbackQuestion({
      stage: 'round1_behavioral',
      subTopic: 'System Reliability',
      history: [
        { role: 'assistant', content: 'Welcome. Tell me about your background.' },
        { role: 'user', content: 'asdfghjk qwerty uiop zxcvbnm' }
      ],
      difficulty: 'hard',
      interviewerName: 'Ms. Priya'
    });

    assert.ok(typeof res === 'string' && res.length > 20, 'Must produce a valid question string');
    assert.ok(!res.includes('undefined'), 'Must not contain undefined');
    assert.ok(res.includes('Ms. Priya'), 'Must sign off with interviewer name');
  });

  test('Stranger Test 2: High-density technical jargon and metric extraction', () => {
    const res = generateProgressiveFallbackQuestion({
      stage: 'round3_systems',
      subTopic: 'Distributed Storage',
      history: [
        { role: 'assistant', content: 'How do you handle storage scale?' },
        { role: 'user', content: 'We deployed Kafka and Redis caching, cutting latency by 45% latency drop across 10 nodes.' }
      ],
      difficulty: 'hard',
      interviewerName: 'Mr. Rohan'
    });

    const lower = res.toLowerCase();
    const containsContext = lower.includes('45% latency drop') || lower.includes('redis') || lower.includes('kafka');
    assert.ok(containsContext, `Expected question to reflect technical noun or metric. Got: "${res}"`);
    assert.ok(res.includes('Mr. Rohan'), 'Must sign off with Mr. Rohan');
  });

  test('Stranger Test 3: Empty user turn produces contextual welcome', () => {
    const res = generateProgressiveFallbackQuestion({
      stage: 'round1_behavioral',
      subTopic: 'API Design',
      history: [
        { role: 'user', content: '' }
      ],
      difficulty: 'medium',
      interviewerName: 'Ms. Aisha'
    });

    assert.ok(res.includes('Welcome to your interview'), 'Must provide welcome greeting');
    assert.ok(res.includes('API Design'), 'Must reference subtopic');
  });

  test('Stranger Test 4: Stage progression covers all 4 interview rounds', () => {
    const rounds = [
      { stage: 'round1_behavioral', keyword: 'roadblock' },
      { stage: 'round2_coding', keyword: 'complexity' },
      { stage: 'round3_systems', keyword: 'bottleneck' },
      { stage: 'round4_executive', keyword: 'evidence' }
    ];

    for (const r of rounds) {
      const res = generateProgressiveFallbackQuestion({
        stage: r.stage,
        subTopic: 'Cloud Infrastructure',
        history: [
          { role: 'assistant', content: 'Question' },
          { role: 'user', content: 'We optimized the database with postgresql indexes.' }
        ],
        difficulty: 'hard',
        interviewerName: 'Ms. Divya'
      });

      assert.ok(res.length > 30, `Round ${r.stage} must generate a complete question`);
      assert.ok(res.includes('Ms. Divya'), `Round ${r.stage} must have interviewer signoff`);
    }
  });
});

describe('BRUTAL STRANGER AUDIT: Group Discussion Turn-Taking Loop', () => {
  test('Stranger Test 5: Host room introduction frames topic and session rules', () => {
    const intro = hostIntroScript('Ms. Priya', 'Microservices Resilience', 'Fault tolerance and circuit breakers', 10);
    assert.ok(intro.includes('Ms. Priya'), 'Intro must name the host');
    assert.ok(intro.includes('Microservices Resilience'), 'Intro must state the room name');
    assert.ok(intro.includes('10 minutes'), 'Intro must state session duration');
  });

  test('Stranger Test 6: Round-Robin Cycle — Candidate -> Avatar A (Attack) -> Avatar B (Synthesis)', async () => {
    const mockOfflineLlm = async () => { throw new Error('Simulate offline/timeout fallback'); };

    const candidateUtterance = 'I propose we migrate to microservices with distributed event queues for maximum scale.';

    const resA = await executeGdTurn({
      roleType: 'avatar_a',
      mentorId: 'kashyap',
      topic: 'Microservices vs Monolith',
      domain: 'technical',
      difficulty: 'hard',
      candidateName: 'Alex',
      history: [{ role: 'user', content: candidateUtterance }]
    }, mockOfflineLlm);

    assert.ok(
      resA.reply.toLowerCase().includes('challenge') ||
      resA.reply.toLowerCase().includes('risk') ||
      resA.reply.toLowerCase().includes('failure') ||
      resA.reply.toLowerCase().includes('assumption'),
      `Avatar A must aggressively challenge candidate assumptions. Got: "${resA.reply}"`
    );

    const resB = await executeGdTurn({
      roleType: 'avatar_b',
      mentorId: 'divya',
      topic: 'Microservices vs Monolith',
      domain: 'technical',
      difficulty: 'medium',
      candidateName: 'Alex',
      history: [
        { role: 'user', content: candidateUtterance },
        { role: 'assistant', content: resA.reply }
      ]
    }, mockOfflineLlm);

    assert.ok(
      resB.reply.toLowerCase().includes('alex') &&
      (resB.reply.toLowerCase().includes('floor') || resB.reply.toLowerCase().includes('plan') || resB.reply.toLowerCase().includes('mitigate')),
      `Avatar B must synthesize and return floor to candidate Alex. Got: "${resB.reply}"`
    );
  });

  test('Stranger Test 7: TTS Mute Safety — speakWithAvatar invokes onEnd even when muted or audio locked', () => {
    const ttsCode = fs.readFileSync(path.join(process.cwd(), 'src/lib/tts.ts'), 'utf8');
    assert.ok(ttsCode.includes('if (isMuted)'), 'Must have isMuted handling');
    assert.ok(ttsCode.includes('try { onEnd(); } catch {}'), 'Must safely invoke onEnd when muted or audio locked');
  });

  test('Stranger Test 8: Candidate turn window is strictly 10 seconds', () => {
    const orchCode = fs.readFileSync(path.join(process.cwd(), 'src/app/group-discussion/hooks/useGdOrchestrator.ts'), 'utf8');
    assert.ok(orchCode.includes('setCandidateTurnTimer(10)'), 'Candidate speaking window must be initialized to 10 seconds');
  });
});

describe('BRUTAL STRANGER AUDIT: Admin & Teacher Portal Access', () => {
  test('Stranger Test 9: Admin Navigation exposes both AI Interview and GD Boardroom', () => {
    const adminItems = ADMIN_NAV[0].items;
    const careerGroup = adminItems.find(g => 'children' in g && g.label === 'Career Intelligence') as NavGroup | undefined;
    assert.ok(careerGroup && 'children' in careerGroup, 'Career Intelligence group must exist in ADMIN_NAV');
    
    const interviewLink = careerGroup.children.find(c => c.href === '/interview');
    const gdLink = careerGroup.children.find(c => c.href === '/interview?tab=gd');
    assert.ok(interviewLink, 'ADMIN_NAV must contain /interview');
    assert.ok(gdLink, 'ADMIN_NAV must contain /interview?tab=gd');
  });

  test('Stranger Test 10: Teacher Navigation exposes both AI Interview and GD Boardroom', () => {
    const teacherItems = TEACHER_NAV.flatMap(s => s.items);
    const interviewLink = teacherItems.find(c => 'href' in c && c.href === '/interview');
    const gdLink = teacherItems.find(c => 'href' in c && c.href === '/interview?tab=gd');
    assert.ok(interviewLink, 'TEACHER_NAV must contain /interview');
    assert.ok(gdLink, 'TEACHER_NAV must contain /interview?tab=gd');
  });

  test('Stranger Test 11: isPathActive does not confuse /interview with /interview?tab=gd', () => {
    assert.strictEqual(isPathActive('/interview', '/interview'), true);
    assert.strictEqual(isPathActive('/interview', '/interview?tab=gd'), false, '/interview should not highlight when query is ?tab=gd');
    assert.strictEqual(isPathActive('/interview?tab=gd', '/interview?tab=gd'), true, '/interview?tab=gd should highlight when query is ?tab=gd');
  });
});

describe('BRUTAL STRANGER AUDIT: Student Portal Emoji & Visual Purity', () => {
  test('Stranger Test 12: QuestPathView has no decorative emojis in roadmap headers or tabs', () => {
    const code = fs.readFileSync(path.join(process.cwd(), 'src/app/quests/components/QuestPathView.tsx'), 'utf8');
    assert.ok(!code.includes('🧭 Dynamic Career Roadmap'), 'Must not have 🧭 in title');
    assert.ok(!code.includes('🗺️ Fused Career Trajectory'), 'Must not have 🗺️ in fused trajectory');
    assert.ok(!code.includes('🗺️ Visual Roadmap Chart'), 'Must not have 🗺️ in chart title');
    assert.ok(!code.includes('⚡ Synchronize Roadmap'), 'Must not have ⚡ in button');
  });

  test('Stranger Test 13: Sidebar navigation strictly preserves navigation emojis', () => {
    const studentIcons = STUDENT_NAV[0].items.map(n => n.icon);
    assert.ok(studentIcons.includes('🏠'), 'Dashboard must have 🏠');
    assert.ok(studentIcons.includes('🗺'), 'Quests must have 🗺');
    assert.ok(studentIcons.includes('⚡'), 'Missions must have ⚡');
    assert.ok(studentIcons.includes('🎙'), 'Interview must have 🎙');

    const rightIcons = RIGHT_NAV.map(n => n.icon);
    assert.ok(rightIcons.includes('📝'), 'Exams must have 📝');
    assert.ok(rightIcons.includes('📊'), 'Results must have 📊');
  });
});
