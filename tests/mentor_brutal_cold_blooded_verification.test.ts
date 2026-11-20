// tests/mentor_brutal_cold_blooded_verification.test.ts
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildMentorSystemPrompt } from '../src/lib/avatar/mentorPromptBuilder';
import {
  buildHyperActiveGreeting,
  buildHyperActivePromptDirective,
  buildHyperActiveFallbackReply,
} from '../src/lib/avatar/hyperActivePersona';

describe('BRUTAL COLD-BLOODED AUDIT: AI Avatar Mentor & Hyper-Active Systems', () => {
  // ── AUDITOR 1: SKELETON RIGGING & 3D BONE ACCURACY (No T-Pose) ──────────────
  describe('Auditor 1: VRoid Skeleton Rigging & Non-T-Pose Integrity', () => {
    const vroidSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/avatar/VRoidAvatarEngine.ts'),
      'utf8'
    );

    test('1.1: Uses robust isLeftBone / isRightBone regex isolating side prefixes without substring collisions', () => {
      assert.ok(vroidSource.includes('isLeftBone'), 'Must define isLeftBone helper function');
      assert.ok(vroidSource.includes('isRightBone'), 'Must define isRightBone helper function');
      assert.ok(!vroidSource.includes("nameLower.includes('_l') || nameLower.includes('bip_l')"),
        'Must NOT use naive nameLower.includes("_l") which incorrectly matches "_lowerarm"');
    });

    test('1.2: Confirms J_Bip_L_LowerArm maps to leftForearm and J_Bip_R_LowerArm to rightForearm', () => {
      const isLeftBone = (name: string): boolean => {
        const nl = (name || '').toLowerCase();
        return (
          nl.includes('left') ||
          nl.includes('_l_') ||
          nl.includes('.l.') ||
          nl.includes('bip_l_') ||
          nl.endsWith('_l') ||
          nl.endsWith('.l') ||
          /^l[_\.]/i.test(nl)
        );
      };
      const isRightBone = (name: string): boolean => {
        const nl = (name || '').toLowerCase();
        return (
          nl.includes('right') ||
          nl.includes('_r_') ||
          nl.includes('.r.') ||
          nl.includes('bip_r_') ||
          nl.endsWith('_r') ||
          nl.endsWith('.r') ||
          /^r[_\.]/i.test(nl)
        );
      };

      assert.strictEqual(isLeftBone('J_Bip_L_LowerArm'), true, 'J_Bip_L_LowerArm must be detected as Left');
      assert.strictEqual(isRightBone('J_Bip_L_LowerArm'), false, 'J_Bip_L_LowerArm must NOT be detected as Right');
      assert.strictEqual(isLeftBone('J_Bip_R_LowerArm'), false, 'J_Bip_R_LowerArm must NOT be detected as Left (no _l collision)');
      assert.strictEqual(isRightBone('J_Bip_R_LowerArm'), true, 'J_Bip_R_LowerArm must be detected as Right');
    });

    test('1.3: VRM rest angles enforce arms-down posture (-1.25 rad / +1.25 rad), banishing raw T-pose', () => {
      assert.ok(vroidSource.includes('this.leftArm.rotation.z = this.isVRM ? -1.25 : 0'),
        'Left arm must rest at -1.25 rad down along torso');
      assert.ok(vroidSource.includes('this.rightArm.rotation.z = this.isVRM ? 1.25 : 0'),
        'Right arm must rest at +1.25 rad down along torso');
      assert.ok(vroidSource.includes('this.applyRestPose()'),
        'applyRestPose must snap bones directly to rest on ready');
    });

    test('1.4: Increased timeout for reliable GLB delivery on standard broadband/mobile', () => {
      assert.ok(
        vroidSource.includes('15000') || vroidSource.includes('7500'),
        'Must use at least 7500ms (or adaptive 15000ms) timeout for large VRM downloads'
      );
    });
  });

  // ── AUDITOR 2: REAL-TIME DRAGGABLE ENGINE & PERSISTENCE ─────────────────────
  describe('Auditor 2: Draggable Panel Real-Time Responsiveness & Settle Engine', () => {
    const globalAvatarSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/ui/GlobalAvatar.tsx'),
      'utf8'
    );
    const hookSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/avatar/hooks/useDraggablePanel.ts'),
      'utf8'
    );

    test('2.1: Panel reflects coordinates during live drag movement on initial un-settled state', () => {
      assert.ok(
        globalAvatarSource.includes('(isSettled || isDragging) && settledPos'),
        'Active window style must check (isSettled || isDragging) so panel moves dynamically during the first drag'
      );
    });

    test('2.2: Pointer Events API utilizes setPointerCapture for tracking retention across 3D canvas and iframes', () => {
      assert.ok(hookSource.includes('handle.setPointerCapture(e.pointerId)'), 'Must call setPointerCapture');
      assert.ok(hookSource.includes('handle.releasePointerCapture(e.pointerId)'), 'Must call releasePointerCapture');
    });

    test('2.3: Enforces 4px dead-zone threshold to safeguard button taps from accidental drag triggers', () => {
      assert.ok(hookSource.includes('Math.hypot(dx, dy) >= DRAG_THRESHOLD_PX'), 'Must check Euclidean distance threshold');
      assert.ok(hookSource.includes("target?.closest('[data-no-drag], button, a, input"),
        'Must ignore pointerdown on interactive elements');
    });

    test('2.4: SSR Safe localStorage hydration prevents Next.js hydration error 418', () => {
      assert.ok(hookSource.includes("typeof window === 'undefined'"), 'Must guard window checks for SSR');
      assert.ok(hookSource.includes('localStorage.getItem(storageKey)'), 'Must read persistence key');
    });
  });

  // ── AUDITOR 3: APPLE FLUID DUO MORPH ANIMATION & ORIGIN ACCURACY ───────────
  describe('Auditor 3: Apple Dynamic Island / Fluid Duo Morph Transition', () => {
    const globalAvatarSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/ui/GlobalAvatar.tsx'),
      'utf8'
    );

    test('3.1: Calculates exact transform origin relative to modal dimensions for seamless blooming', () => {
      assert.ok(globalAvatarSource.includes('modalW = Math.min'), 'Must calculate exact modal width');
      assert.ok(globalAvatarSource.includes('modalH = Math.min'), 'Must calculate exact modal height');
      assert.ok(globalAvatarSource.includes('originX = ((panelCenterX - modalLeft) / modalW) * 100'),
        'Must compute origin percentage against modal bounds');
    });

    test('3.2: Fluid spring cubic-bezier(0.16, 1, 0.3, 1) and blur settling are applied', () => {
      assert.ok(globalAvatarSource.includes('cubic-bezier(0.16, 1, 0.3, 1)'), 'Must use Apple signature curve');
      assert.ok(globalAvatarSource.includes('@keyframes appleDuoExpand'), 'Must declare appleDuoExpand keyframe');
      assert.ok(globalAvatarSource.includes('@keyframes appleDuoCollapse'), 'Must declare appleDuoCollapse keyframe');
    });

    test('3.3: Enforces 240ms graceful collapse timeout on exit before state unmounting', () => {
      assert.ok(globalAvatarSource.includes('isExitingHyperActive'), 'Must track exit animation state');
      assert.ok(globalAvatarSource.includes('setTimeout(() => {'), 'Must delay unmount for collapse completion');
    });
  });

  // ── AUDITOR 4: HYPER-ACTIVE CONVERSATION & ANTI-REPETITION GUARDIAN ─────────
  describe('Auditor 4: Hyper-Active Prompt Precision & Anti-Repetition Guardian', () => {
    const routeSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/app/api/mentor/chat/route.ts'),
      'utf8'
    );

    test('4.1: Hyper-Active system prompt excludes legacy 3-paragraph instructions', () => {
      const prompt = buildMentorSystemPrompt({
        studentName: 'Ravana',
        targetRole: 'Full Stack Engineer',
        questTitle: 'Core Web Foundations',
        missingSkills: ['PostgreSQL'],
        atsScore: 78,
        hyperActive: true,
        completedQuestsCount: 3,
        completedMissionsCount: 1,
        missionStreak: 2,
      });

      assert.ok(!prompt.includes('Keep responses under 3 paragraphs'),
        'Hyper-Active prompt must NOT include legacy 3-paragraph instruction');
      assert.ok(prompt.includes('UNDER 30 WORDS TOTAL'),
        'Hyper-Active prompt must strictly instruct under 30 words total');
      assert.ok(prompt.includes('DO NOT repeat progress stats'),
        'Prompt must forbid repeating progress numbers');
    });

    test('4.2: Groq completion requests include frequency and presence penalties (0.6) for Hyper-Active mode', () => {
      assert.ok(routeSource.includes('frequency_penalty: isHyperActive ? 0.6 : 0'),
        'Must supply frequency penalty to inhibit sentence repetition');
      assert.ok(routeSource.includes('presence_penalty: isHyperActive ? 0.6 : 0'),
        'Must supply presence penalty to inhibit boilerplate repetition');
    });

    test('4.3: Anti-Repetition Guardian intercepts consecutive duplicate answers or progress loops', () => {
      assert.ok(routeSource.includes('Anti-Repetition & Anti-Looping Guardian'),
        'Must feature dedicated Anti-Repetition Guardian in chat route');
      assert.ok(routeSource.includes('buildHyperActiveFallbackReply'),
        'Guardian must fall back to dynamic persona engine when repetitive text is detected');
    });

    test('4.4: Fallback engine generates short, punchy responses (< 25 words) for user deferrals ("ur wish")', () => {
      const reply = buildHyperActiveFallbackReply('ur wish', {
        studentName: 'Ravana',
        teacherName: 'Ms. Priya',
        completedQuestsCount: 3,
      });

      const wordCount = reply.split(/\s+/).length;
      assert.ok(wordCount < 25, `Reply must be under 25 words, got ${wordCount}: "${reply}"`);
      assert.ok(!reply.includes('knocked out 3 lessons'), 'Deferral reply must NOT repeat progress stats');
    });

    test('4.5: Fallback engine generates direct guidance (< 25 words) for direction queries ("what is my next move")', () => {
      const reply = buildHyperActiveFallbackReply('what is my next move', {
        studentName: 'Ravana',
        teacherName: 'Ms. Priya',
        completedQuestsCount: 3,
      });

      const wordCount = reply.split(/\s+/).length;
      assert.ok(wordCount < 25, `Reply must be under 25 words, got ${wordCount}: "${reply}"`);
      assert.ok(reply.toLowerCase().includes('next move') || reply.toLowerCase().includes('course'),
        `Expected actionable next move, got: "${reply}"`);
    });
  });
});
