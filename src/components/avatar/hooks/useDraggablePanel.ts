// src/components/avatar/hooks/useDraggablePanel.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface PanelPosition {
  x: number;
  y: number;
}

export interface UseDraggablePanelOptions {
  storageKey?: string;
  viewportPadding?: number;
  disabled?: boolean;
  onPositionChange?: (pos: PanelPosition) => void;
}

export interface UseDraggablePanelReturn {
  position: PanelPosition | null;
  isDragging: boolean;
  isSettled: boolean;
  panelRef: React.RefObject<HTMLDivElement>;
  handleRef: React.RefObject<HTMLDivElement>;
  resetPosition: () => void;
  setPositionManually: (pos: PanelPosition) => void;
}

const DEFAULT_STORAGE_KEY = 'pinit_mentor_settled_pos_v1';
const DEFAULT_PADDING = 10;
const DRAG_THRESHOLD_PX = 4;

/**
 * Bounds-clamped, persistent draggable hook for the AI Mentor panel.
 * Invariants:
 * 1. Zero Reflow Lag: uses pointer events with client coordinate math and GPU compositing.
 * 2. 4px Drag Dead-Zone: distinguishes pure clicks/taps from intentional repositioning.
 * 3. Viewport Clamping: panel strictly stays within visible screen bounds (min padding).
 * 4. SSR Safe: never reads localStorage during initial render to prevent React hydration mismatch.
 * 5. Button Isolation: ignores pointerdown on buttons, links, or elements with [data-no-drag].
 * 6. Settle Persistence: stores custom coordinates in localStorage and stays settled across routes.
 */
export function useDraggablePanel(options: UseDraggablePanelOptions = {}): UseDraggablePanelReturn {
  const {
    storageKey = DEFAULT_STORAGE_KEY,
    viewportPadding = DEFAULT_PADDING,
    disabled = false,
    onPositionChange,
  } = options;

  const panelRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<PanelPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  // Drag interaction tracking state in refs to prevent unnecessary re-renders during 60fps movement
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialLeft: number;
    initialTop: number;
    panelWidth: number;
    panelHeight: number;
    hasMovedPastThreshold: boolean;
    pointerId: number | null;
    currentX: number;
    currentY: number;
  }>({
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0,
    panelWidth: 256,
    panelHeight: 296,
    hasMovedPastThreshold: false,
    pointerId: null,
    currentX: 0,
    currentY: 0,
  });

  const rafRef = useRef<number | null>(null);

  // ── 1. SSR Safe Hydration from LocalStorage ─────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number' && !Number.isNaN(parsed.x) && !Number.isNaN(parsed.y)) {
          const panel = panelRef.current;
          const w = panel?.offsetWidth || 256;
          const h = panel?.offsetHeight || 296;

          const clampedX = Math.min(Math.max(viewportPadding, parsed.x), Math.max(viewportPadding, window.innerWidth - w - viewportPadding));
          const clampedY = Math.min(Math.max(viewportPadding, parsed.y), Math.max(viewportPadding, window.innerHeight - h - viewportPadding));

          const safePos = { x: Math.round(clampedX), y: Math.round(clampedY) };
          setPosition(safePos);
          setIsSettled(true);
          onPositionChange?.(safePos);
        }
      }
    } catch {
      // LocalStorage access may fail in private mode or quota exhaustion
    }
  }, [storageKey, viewportPadding, onPositionChange]);

  // ── 2. Viewport Resize Re-Clamping ──────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null;
        const panel = panelRef.current;
        const w = panel?.offsetWidth || 256;
        const h = panel?.offsetHeight || 296;

        const clampedX = Math.min(Math.max(viewportPadding, prev.x), Math.max(viewportPadding, window.innerWidth - w - viewportPadding));
        const clampedY = Math.min(Math.max(viewportPadding, prev.y), Math.max(viewportPadding, window.innerHeight - h - viewportPadding));

        if (clampedX !== prev.x || clampedY !== prev.y) {
          const updated = { x: Math.round(clampedX), y: Math.round(clampedY) };
          try {
            localStorage.setItem(storageKey, JSON.stringify(updated));
          } catch {}
          return updated;
        }
        return prev;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [storageKey, viewportPadding]);

  // ── 3. Reset Position to Default Dock ───────────────────────────────────────
  const resetPosition = useCallback(() => {
    setPosition(null);
    setIsSettled(false);
    setIsDragging(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
  }, [storageKey]);

  // ── 4. Set Position Manually ────────────────────────────────────────────────
  const setPositionManually = useCallback((pos: PanelPosition) => {
    if (typeof window === 'undefined') return;
    const panel = panelRef.current;
    const w = panel?.offsetWidth || 256;
    const h = panel?.offsetHeight || 296;

    const clampedX = Math.min(Math.max(viewportPadding, pos.x), Math.max(viewportPadding, window.innerWidth - w - viewportPadding));
    const clampedY = Math.min(Math.max(viewportPadding, pos.y), Math.max(viewportPadding, window.innerHeight - h - viewportPadding));
    const safePos = { x: Math.round(clampedX), y: Math.round(clampedY) };

    setPosition(safePos);
    setIsSettled(true);
    try {
      localStorage.setItem(storageKey, JSON.stringify(safePos));
    } catch {}
    onPositionChange?.(safePos);
  }, [storageKey, viewportPadding, onPositionChange]);

  // ── 5. Pointer Event Handlers Bound to Handle Ref ───────────────────────────
  useEffect(() => {
    const handle = handleRef.current;
    if (!handle || disabled) return;

    const onPointerDown = (e: PointerEvent) => {
      // Accept only primary mouse button or touch
      if (e.button !== 0) return;

      // Ignore interactive controls inside the header bar
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-no-drag], button, a, input, textarea, select')) {
        return;
      }

      const panel = panelRef.current;
      if (!panel) return;

      const rect = panel.getBoundingClientRect();
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        initialLeft: rect.left,
        initialTop: rect.top,
        panelWidth: rect.width || 256,
        panelHeight: rect.height || 296,
        hasMovedPastThreshold: false,
        pointerId: e.pointerId,
        currentX: rect.left,
        currentY: rect.top,
      };

      try {
        handle.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragRef.current.pointerId !== e.pointerId) return;

      const state = dragRef.current;
      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;

      // 4px dead-zone check to prevent small clicks from dragging
      if (!state.hasMovedPastThreshold) {
        if (Math.hypot(dx, dy) >= DRAG_THRESHOLD_PX) {
          state.hasMovedPastThreshold = true;
          setIsDragging(true);
        } else {
          return;
        }
      }

      const rawX = state.initialLeft + dx;
      const rawY = state.initialTop + dy;

      const maxX = Math.max(viewportPadding, window.innerWidth - state.panelWidth - viewportPadding);
      const maxY = Math.max(viewportPadding, window.innerHeight - state.panelHeight - viewportPadding);

      const clampedX = Math.min(Math.max(viewportPadding, rawX), maxX);
      const clampedY = Math.min(Math.max(viewportPadding, rawY), maxY);

      state.currentX = clampedX;
      state.currentY = clampedY;

      // Throttle render via requestAnimationFrame for silky 60/120fps motion
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: Math.round(clampedX), y: Math.round(clampedY) });
      });
    };

    const onPointerEnd = (e: PointerEvent) => {
      if (dragRef.current.pointerId !== e.pointerId) return;

      try {
        handle.releasePointerCapture(e.pointerId);
      } catch {}

      const state = dragRef.current;
      const wasDragging = state.hasMovedPastThreshold;

      dragRef.current.pointerId = null;
      dragRef.current.hasMovedPastThreshold = false;
      setIsDragging(false);

      if (wasDragging) {
        const finalPos = { x: Math.round(state.currentX), y: Math.round(state.currentY) };
        setPosition(finalPos);
        setIsSettled(true);
        try {
          localStorage.setItem(storageKey, JSON.stringify(finalPos));
        } catch {}
        onPositionChange?.(finalPos);
      }
    };

    const onDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-no-drag], button, a, input')) return;
      resetPosition();
    };

    handle.addEventListener('pointerdown', onPointerDown);
    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', onPointerEnd);
    handle.addEventListener('pointercancel', onPointerEnd);
    handle.addEventListener('dblclick', onDoubleClick);

    return () => {
      handle.removeEventListener('pointerdown', onPointerDown);
      handle.removeEventListener('pointermove', onPointerMove);
      handle.removeEventListener('pointerup', onPointerEnd);
      handle.removeEventListener('pointercancel', onPointerEnd);
      handle.removeEventListener('dblclick', onDoubleClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [disabled, storageKey, viewportPadding, resetPosition, onPositionChange]);

  return {
    position,
    isDragging,
    isSettled,
    panelRef,
    handleRef,
    resetPosition,
    setPositionManually,
  };
}
