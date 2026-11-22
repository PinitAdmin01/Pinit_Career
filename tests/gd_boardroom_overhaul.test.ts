import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  GD_COMMON_RULES,
  GD_PERSONA_PROFILES,
  isAvatarEligibleAsGdHost,
  getEligibleGdHosts,
  resolveGdHostId,
  hostIntroScript,
  hostFiveMinuteWarningScript,
  hostOneMinuteWarningScript,
  clampSpeech,
  detectDirectQuestion,
  executeGdTurn,
} from '../src/lib/group-discussion/gdTurnEngine';
import { resolveGroqKeysForGdSlot } from '../src/app/api/group-discussion/bot-reply/route';
import { AVATARS, SUGGESTED_TOPICS } from '../src/app/group-discussion/constants';

describe('Group Discussion Overhaul — Complete Invariant & Realism Audit', () => {
  it('1. Common GD Room Rules exist and Host explains rules + 5m/1m checks during intro', () => {
    assert.ok(GD_COMMON_RULES.length >= 4, 'Must define structured common GD rules');
    const intro = hostIntroScript('Mr. Akash', '10-Minute Quick Commerce in India', 'Evaluate unit economics', 10);
    assert.ok(intro.includes('Mr. Akash'), 'Intro must include Host name');
    assert.ok(intro.toLowerCase().includes('rules'), 'Intro must explain room rules');
    assert.ok(intro.includes('5 minutes left') && intro.includes('1 minute left'), 'Intro must mention 5-min and 1-min Host checks');
    assert.ok(intro.includes('Candidate, you have the floor'), 'Intro must hand floor to Candidate');
  });

  it('2. Selected AI Mentor (e.g. Priya) is strictly excluded from being GD Host', () => {
    // Priya as AI Mentor -> cannot be GD Host
    assert.equal(isAvatarEligibleAsGdHost('priya', 'priya'), false);
    assert.equal(isAvatarEligibleAsGdHost('priya', undefined), false, 'Default AI mentor is Priya');
    assert.equal(getEligibleGdHosts('priya').includes('priya'), false);
    assert.notEqual(resolveGdHostId('priya', 'priya'), 'priya');

    // Selecting another eligible host when Priya is mentor succeeds
    assert.equal(resolveGdHostId('priya', 'akash'), 'akash');

    // If user changes their AI Mentor to Akash, Akash is blocked and Priya becomes eligible
    assert.equal(isAvatarEligibleAsGdHost('akash', 'akash'), false);
    assert.equal(isAvatarEligibleAsGdHost('priya', 'akash'), true);
    assert.notEqual(resolveGdHostId('akash', 'akash'), 'akash');
  });

  it('3. Host 5-minute and 1-minute warning scripts are concise and accurate', () => {
    const fiveMin = hostFiveMinuteWarningScript('Mr. Akash', 'Zero-Fee UPI');
    const oneMin = hostOneMinuteWarningScript('Mr. Akash', 'Zero-Fee UPI');

    assert.ok(fiveMin.includes('5 minutes remaining'), '5-min script must clearly state 5 minutes remaining');
    assert.ok(oneMin.includes('1 minute remaining'), '1-min script must clearly state 1 minute remaining');
    assert.ok(fiveMin.split(/\s+/).length <= 45, '5-min warning must stay crisp');
    assert.ok(oneMin.split(/\s+/).length <= 45, '1-min warning must stay crisp');
  });

  it('4. clampSpeech keeps avatar responses short (2-3.5 lines) without mid-sentence truncation', () => {
    const wallOfText =
      'First, I completely disagree with your point about zero-fee UPI because banks carry huge infrastructure and fraud monitoring bills every single month. ' +
      'Second, without a tiny transparent merchant fee on large enterprise transactions, innovation in payment reliability slows down sharply. ' +
      'Third, small kirana shops should stay free while large corporate retailers share fair network costs. ' +
      'Fourth, regulators must publish annual uptime benchmarks across all payment rails.';

    const clamped = clampSpeech(wallOfText);
    const words = clamped.split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 20 && words <= 58, `Expected 20-58 words (2-3.5 lines), got ${words}: "${clamped}"`);
    assert.match(clamped, /[.!?]$/, 'Clamped speech must terminate on clean sentence punctuation');
  });

  it('5. Avatar 1 (Challenger) answers direct user questions and argues without hallucinating', async () => {
    assert.equal(detectDirectQuestion('Why would a startup pick open-source AI over closed APIs?'), true);
    assert.equal(detectDirectQuestion('We should invest in open-source AI for privacy.'), false);

    let capturedSystem = '';
    const mockLlm = async (sys: string) => {
      capturedSystem = sys;
      return 'Open-source AI wins on privacy because sensitive customer records stay on your own servers. However, I challenge relying on it too early since fine-tuning and GPU ops can burn cash fast. Would a small team really absorb that maintenance overhead?';
    };

    const res = await executeGdTurn(
      {
        roleType: 'avatar_a',
        mentorId: 'kashyap',
        topic: 'Open-Source AI vs Closed Frontier Models',
        domain: 'technical',
        difficulty: 'medium',
        candidateName: 'Dev',
        history: [{ role: 'user', content: 'Why should startups choose open-source models over closed APIs?' }],
      },
      mockLlm
    );

    assert.ok(capturedSystem.includes('DIRECT QUESTION RULE'), 'Must inject direct question rule when user asks a question');
    assert.ok(capturedSystem.includes('ZERO HALLUCINATION RULE'), 'Must enforce zero hallucination rule');
    assert.ok(res.wordCount >= 20 && res.wordCount <= 58, `Avatar 1 reply should be 2-3.5 lines, got ${res.wordCount} words`);
  });

  it('6. Avatar 2 (Diplomat) addresses BOTH User and Avatar 1 and returns floor to User', async () => {
    let capturedSystem = '';
    const mockLlm = async (sys: string) => {
      capturedSystem = sys;
      throw new Error('Test offline fallback');
    };

    const res = await executeGdTurn(
      {
        roleType: 'avatar_b',
        mentorId: 'divya',
        topic: 'Zero-Fee UPI: Public Digital Miracle or Silent Margin Squeeze?',
        domain: 'commerce',
        difficulty: 'medium',
        candidateName: 'Dev',
        lastChallengerName: 'Mr. Vikram',
        lastChallengerText: 'Zero MDR squeezes bank server budgets and fraud monitoring margins.',
        history: [
          { role: 'user', content: 'UPI helps small merchants join digital banking and qualify for loans.' },
          { role: 'assistant', sender: 'Mr. Vikram', content: 'Zero MDR squeezes bank server budgets and fraud monitoring margins.' },
        ],
      },
      mockLlm
    );

    assert.ok(capturedSystem.includes('BOTH Dev\'s view AND Mr. Vikram\'s counter-argument'), 'Diplomat prompt must explicitly bridge BOTH speakers');
    assert.ok(res.reply.includes('Mr. Vikram'), 'Diplomat fallback must acknowledge Avatar 1 by name');
    assert.ok(res.reply.includes('Dev, you have the floor'), 'Diplomat must return floor to candidate');
    assert.ok(res.wordCount <= 58, `Diplomat reply must fit 2-3.5 lines, got ${res.wordCount} words`);
  });

  it('7. Dual Groq API Key routing strictly isolates Avatar 1 (Key 1) and Avatar 2 (Key 2)', () => {
    const env = {
      GROQ_GD_KEY_1: 'gsk_avatar1_primary',
      GROQ_GD_KEY_2: 'gsk_avatar2_primary',
      GROQ_API_KEY: 'gsk_shared_fallback',
    };

    const slotA = resolveGroqKeysForGdSlot('a', env);
    const slotB = resolveGroqKeysForGdSlot('b', env);

    assert.equal(slotA.keySlotLabel, 'key_1');
    assert.equal(slotB.keySlotLabel, 'key_2');
    assert.equal(slotA.keys[0], 'gsk_avatar1_primary', 'Avatar 1 must use Groq Key 1 first');
    assert.equal(slotB.keys[0], 'gsk_avatar2_primary', 'Avatar 2 must use Groq Key 2 first');
    assert.notEqual(slotA.keys[0], slotB.keys[0], 'Avatar 1 and Avatar 2 must not contend on the same primary key');

    // Also verify GROQ_API_KEYS CSV split fallback (key 0 -> Avatar 1, key 1 -> Avatar 2)
    const csvEnv = { GROQ_API_KEYS: 'gsk_csv_one,gsk_csv_two' };
    assert.equal(resolveGroqKeysForGdSlot('a', csvEnv).keys[0], 'gsk_csv_one');
    assert.equal(resolveGroqKeysForGdSlot('b', csvEnv).keys[0], 'gsk_csv_two');
  });

  it('8. Orchestrator implements strict loop, parallel Key-2 prefetch, 5m/1m checks, auth headers, and ZERO fake user speech', () => {
    const orchCode = fs.readFileSync(path.resolve('src/app/group-discussion/hooks/useGdOrchestrator.ts'), 'utf8');

    // Parallel Avatar 2 prefetch on Key 2 BEFORE Avatar 1 finishes speaking
    assert.ok(orchCode.includes("slot: 'a'"), 'Avatar 1 must call slot a');
    assert.ok(orchCode.includes("slot: 'b'"), 'Avatar 2 must call slot b');
    assert.ok(orchCode.includes('avatarBPromiseRef.current = fetchBotTurn'), 'Avatar 2 must be prefetched in parallel while Avatar 1 speaks');

    // 5-min & 1-min between-talk interruptions
    assert.ok(orchCode.includes('remaining <= 300 && remaining > 60'), 'Must trigger 5-minute remaining check');
    assert.ok(orchCode.includes('remaining <= 60 && remaining > 0'), 'Must trigger 1-minute remaining check');
    assert.ok(orchCode.includes('runWithBetweenTalkWarning'), 'Must deliver queued warnings cleanly between talks');

    // Zero fake fabricated candidate speech
    assert.ok(!orchCode.includes('I propose that our priority should be core reliability'), 'Must NEVER fabricate fake user arguments on silence');
    assert.ok(orchCode.includes('hostGentleNudgeScript'), 'Must gently nudge instead of inventing fake user text');

    // Authenticated evaluation request (fixes silent 401 bug)
    const evalIdx = orchCode.indexOf("'/api/group-discussion/evaluate'");
    assert.ok(evalIdx !== -1, 'Must call GD evaluate endpoint');
    const evalSlice = orchCode.slice(evalIdx, evalIdx + 260);
    assert.ok(evalSlice.includes('getAuthHeaders()'), 'GD evaluate request must pass Authorization headers');
  });

  it('9. Every avatar has a unique styleTag & persona voice, and all 4 domains have engaging starter topics', () => {
    const uniqueStyles = new Set(AVATARS.map(a => a.styleTag));
    assert.equal(uniqueStyles.size, AVATARS.length, 'Every GD avatar must have a unique styleTag');
    for (const a of AVATARS) {
      assert.ok(GD_PERSONA_PROFILES[a.id], `Missing persona voice profile for ${a.id}`);
    }

    const domains = new Set(SUGGESTED_TOPICS.map(t => t.domain));
    assert.ok(domains.has('technical') && domains.has('business') && domains.has('commerce') && domains.has('sales'), 'Must cover all 4 domains including commerce/B.Com');
    for (const t of SUGGESTED_TOPICS) {
      assert.ok(Array.isArray(t.starterPrompts) && t.starterPrompts.length >= 3, `Topic "${t.title}" must have >= 3 clickable starter prompts`);
    }
  });
});
