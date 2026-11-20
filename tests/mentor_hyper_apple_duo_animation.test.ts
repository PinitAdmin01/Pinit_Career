// tests/mentor_hyper_apple_duo_animation.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Task 2: AI Avatar Mentor Apple Fluid Duo Morph Animation', () => {
  const globalAvatarPath = path.resolve(process.cwd(), 'src/components/ui/GlobalAvatar.tsx');
  const globalAvatarCode = fs.readFileSync(globalAvatarPath, 'utf8');

  // ── AUDIT 1: Apple Duo Spring Physics & Keyframes ──
  describe('Auditor 1 (Persona 3: Zero-Reflow GPU Animation & Keyframes)', () => {
    it('1.1: appleDuoExpand keyframe uses liquid spring scaling and blur settling', () => {
      assert.ok(globalAvatarCode.includes('@keyframes appleDuoExpand'), 'Must declare @keyframes appleDuoExpand');
      assert.ok(globalAvatarCode.includes('scale(0.36)'), 'Must start expansion from compact scale(0.36)');
      assert.ok(globalAvatarCode.includes('scale(1.015)'), 'Must include fluid spring overshoot scale(1.015)');
      assert.ok(globalAvatarCode.includes('scale(1)'), 'Must settle into scale(1) at 100%');
    });

    it('1.2: appleDuoCollapse keyframe contracts smoothly back toward origin', () => {
      assert.ok(globalAvatarCode.includes('@keyframes appleDuoCollapse'), 'Must declare @keyframes appleDuoCollapse');
      assert.ok(globalAvatarCode.includes('scale(0.32)'), 'Must collapse back to compact scale(0.32)');
      assert.ok(globalAvatarCode.includes('filter: blur(6px)'), 'Must apply blur dissolution on collapse');
    });

    it('1.3: Uses Apple signature fluid spring curve cubic-bezier(0.16, 1, 0.3, 1)', () => {
      assert.ok(globalAvatarCode.includes('cubic-bezier(0.16, 1, 0.3, 1)'), 'Must use Apple signature spring curve');
      assert.ok(globalAvatarCode.includes('willChange: \'transform, opacity, border-radius\''), 'Must hint GPU compositor via willChange');
    });
  });

  // ── AUDIT 2: Origin-Aware Math & Visual Fidelity ──
  describe('Auditor 2 (Persona 4: Origin-Aware Blooming & Tactile Polish)', () => {
    it('2.1: Computes dynamic transform-origin from active mentor panel screen rect', () => {
      assert.ok(globalAvatarCode.includes('activePanelRef.current?.getBoundingClientRect()'), 'Must read panel bounding rect');
      assert.ok(globalAvatarCode.includes('setHyperTransformOrigin'), 'Must update hyperTransformOrigin dynamically');
      assert.ok(globalAvatarCode.includes('transformOrigin: hyperTransformOrigin'), 'Must apply computed transformOrigin to modal');
    });

    it('2.2: Modal backdrop smoothly fades and blurs using appleBackdropFadeIn / appleBackdropFadeOut', () => {
      assert.ok(globalAvatarCode.includes('@keyframes appleBackdropFadeIn'), 'Must declare appleBackdropFadeIn');
      assert.ok(globalAvatarCode.includes('@keyframes appleBackdropFadeOut'), 'Must declare appleBackdropFadeOut');
      assert.ok(globalAvatarCode.includes('backdropFilter: \'blur(6px)\''), 'Must apply luxury glass backdrop blur');
    });

    it('2.3: Staggers inner content reveal to shield 3D VRM canvas from aspect ratio glitches during scale', () => {
      assert.ok(globalAvatarCode.includes('@keyframes appleContentReveal'), 'Must declare appleContentReveal');
      assert.ok(globalAvatarCode.includes('appleContentReveal 0.26s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both'), 'Must apply 80ms staggered reveal on content');
    });
  });

  // ── AUDIT 3: Reversible Exit Sequence & Accessibility Guard ──
  describe('Auditor 3 (Persona 5: Exit Lifecycle, Accessibility & No-Jank Invariants)', () => {
    it('3.1: Enforces 240ms graceful collapse timeout on exit before state unmount', () => {
      assert.ok(globalAvatarCode.includes('isExitingHyperActiveRef.current = true'), 'Must lock exit state against double-triggers');
      assert.ok(globalAvatarCode.includes('setTimeout('), 'Must delay unmount to allow collapse animation to finish');
      assert.ok(globalAvatarCode.includes('240'), 'Timeout must match collapse animation duration (240ms)');
    });

    it('3.2: Exposes data-animating attribute ("expand" vs "collapse") for automated testing and CSS hooks', () => {
      assert.ok(globalAvatarCode.includes('data-animating={isExitingHyperActive ? \'collapse\' : \'expand\'}'), 'Must expose data-animating attribute');
    });

    it('3.3: Respects prefers-reduced-motion: reduce by eliminating scale distortion for motion-sensitive users', () => {
      assert.ok(globalAvatarCode.includes('@media (prefers-reduced-motion: reduce)'), 'Must include prefers-reduced-motion media query');
      assert.ok(globalAvatarCode.includes('from { opacity: 0; }'), 'Must fallback to simple opacity fade on reduced motion');
    });
  });
});
