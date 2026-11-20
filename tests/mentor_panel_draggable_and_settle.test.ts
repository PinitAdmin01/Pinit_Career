// tests/mentor_panel_draggable_and_settle.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Task 1: AI Avatar Mentor Free Drag & Permanent Settle Engine', () => {
  const hookPath = path.resolve(process.cwd(), 'src/components/avatar/hooks/useDraggablePanel.ts');
  const globalAvatarPath = path.resolve(process.cwd(), 'src/components/ui/GlobalAvatar.tsx');

  const hookCode = fs.readFileSync(hookPath, 'utf8');
  const globalAvatarCode = fs.readFileSync(globalAvatarPath, 'utf8');

  // ── AUDIT 1: Hook Architecture & Clean Design ──
  describe('Auditor 1 (Persona 3: Systems Architecture & Zero-Reflow)', () => {
    it('1.1: Hook source file exists and exports useDraggablePanel cleanly', () => {
      assert.ok(fs.existsSync(hookPath), 'useDraggablePanel.ts must exist');
      assert.ok(hookCode.includes('export function useDraggablePanel'), 'Must export useDraggablePanel hook');
      assert.ok(hookCode.includes('storageKey = DEFAULT_STORAGE_KEY'), 'Must support customizable storage key');
    });

    it('1.2: Uses requestAnimationFrame to prevent layout reflow during drag movement', () => {
      assert.ok(hookCode.includes('requestAnimationFrame'), 'Must use requestAnimationFrame for 60/120fps smooth renders');
      assert.ok(hookCode.includes('cancelAnimationFrame'), 'Must cancel previous pending RAF frame to avoid queue pileup');
    });

    it('1.3: Uses Pointer Events API with setPointerCapture to prevent losing tracking over canvas/iframes', () => {
      assert.ok(hookCode.includes('setPointerCapture'), 'Must lock pointer capture to handle element on pointerdown');
      assert.ok(hookCode.includes('releasePointerCapture'), 'Must release pointer capture on pointerup/cancel');
      assert.ok(hookCode.includes('pointerdown'), 'Must attach pointerdown listener');
      assert.ok(hookCode.includes('pointermove'), 'Must attach pointermove listener');
      assert.ok(hookCode.includes('pointerup'), 'Must attach pointerup listener');
    });
  });

  // ── AUDIT 2: Ergonomics, Dead-Zone & Button Isolation ──
  describe('Auditor 2 (Persona 4: Ergonomics, Tactile Settle & Button Guards)', () => {
    it('2.1: Enforces 4px drag dead-zone to distinguish clicks/taps from intentional drags', () => {
      assert.ok(hookCode.includes('DRAG_THRESHOLD_PX = 4') || hookCode.includes('DRAG_THRESHOLD_PX'), 'Must define drag threshold');
      assert.ok(hookCode.includes('Math.hypot'), 'Must compute Euclidean displacement distance for dead-zone check');
    });

    it('2.2: Isolates interactive controls (buttons, links, inputs, [data-no-drag]) from dragging', () => {
      assert.ok(hookCode.includes("target?.closest('[data-no-drag], button, a, input"), 'Must filter out buttons and interactive elements');
    });

    it('2.3: Slim header in GlobalAvatar is designated as the drag handle with visual grip affordance', () => {
      assert.ok(globalAvatarCode.includes('ref={dragHandleRef}'), 'GlobalAvatar slim header must attach dragHandleRef');
      assert.ok(globalAvatarCode.includes('touchAction: \'none\''), 'Must set touchAction: none to allow touch dragging without page scroll');
      assert.ok(globalAvatarCode.includes('cursor: isDragging ? \'grabbing\' : \'grab\''), 'Must provide grab/grabbing cursor affordance');
      assert.ok(globalAvatarCode.includes('<circle cx='), 'Must render grip SVG dots affordance');
    });

    it('2.4: Buttons in slim header explicitly stop pointerdown propagation', () => {
      assert.ok(globalAvatarCode.includes('data-testid="global-avatar-priority-btn"'), 'Priority button exists');
      assert.ok(globalAvatarCode.includes('onPointerDown={(e) => e.stopPropagation()}'), 'Buttons must stop pointerdown propagation');
    });
  });

  // ── AUDIT 3: Cold-Blooded Bounds Clamping, SSR & Settle Persistence ──
  describe('Auditor 3 (Persona 5: Viewport Clamping, SSR Safety & Re-Dock Invariants)', () => {
    it('3.1: Enforces viewport boundary clamping so panel can NEVER be lost off-screen', () => {
      assert.ok(hookCode.includes('window.innerWidth - state.panelWidth - viewportPadding') || hookCode.includes('window.innerWidth - w - viewportPadding'), 'Must clamp X to window width');
      assert.ok(hookCode.includes('window.innerHeight - state.panelHeight - viewportPadding') || hookCode.includes('window.innerHeight - h - viewportPadding'), 'Must clamp Y to window height');
      assert.ok(hookCode.includes('Math.max(viewportPadding,'), 'Must clamp minimum X and Y to viewportPadding');
    });

    it('3.2: SSR Safe — never reads localStorage on initial render (prevents Next.js Hydration Error 418)', () => {
      assert.ok(hookCode.includes('typeof window === \'undefined\''), 'Must guard window check for SSR safety');
      assert.ok(!hookCode.includes('const [position, setPosition] = useState(localStorage'), 'Must NOT read localStorage synchronously in initial state');
    });

    it('3.3: Attaches window resize listener to re-clamp panel if viewport shrinks (e.g. laptop undocking)', () => {
      assert.ok(hookCode.includes('window.addEventListener(\'resize\''), 'Must listen to window resize events');
      assert.ok(hookCode.includes('window.removeEventListener(\'resize\''), 'Must clean up window resize listener on unmount');
    });

    it('3.4: Settle persistence saves coordinates to localStorage and restores on mount', () => {
      assert.ok(hookCode.includes("localStorage.setItem(storageKey"), 'Must persist settled position on drag completion');
      assert.ok(hookCode.includes("localStorage.getItem(storageKey)"), 'Must read settled position on mount in useEffect');
    });

    it('3.5: Provides two distinct reset mechanisms (double-click header and 1-click "Dock" button)', () => {
      assert.ok(hookCode.includes('dblclick'), 'Must listen to double click on drag handle for reset');
      assert.ok(hookCode.includes('resetPosition'), 'Must export resetPosition callback');
      assert.ok(globalAvatarCode.includes('data-testid="global-avatar-reset-dock-btn"'), 'GlobalAvatar must render Dock button when isSettled is true');
      assert.ok(globalAvatarCode.includes('resetMentorPosition()'), 'Dock button must call resetMentorPosition');
    });

    it('3.6: Mode Guard — disables dragging during Story Tour, Hyper-Active, or Minimized states', () => {
      assert.ok(globalAvatarCode.includes('disabled: tourActive || hyperActive || minimized'), 'Must disable custom dragging during tourActive, hyperActive, or minimized');
    });

    it('3.7: Active window reflects isSettled and isDragging states via data attributes and styles', () => {
      assert.ok(globalAvatarCode.includes('data-settled={isSettled ? \'true\' : undefined}'), 'Must set data-settled attribute');
      assert.ok(globalAvatarCode.includes('data-dragging={isDragging ? \'true\' : undefined}'), 'Must set data-dragging attribute');
      assert.ok(globalAvatarCode.includes('settledPos.x'), 'Must use settledPos.x for left coordinate');
      assert.ok(globalAvatarCode.includes('settledPos.y'), 'Must use settledPos.y for top coordinate');
    });
  });
});
