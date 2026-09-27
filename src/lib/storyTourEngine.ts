/**
 * Story Tour timeline engine.
 *
 * Owns the ONLY clock that moves the tour forward: every slide gets a fixed slot
 * (`durationMs`) and the tour advances when that slot ends. Narration and
 * auto-scroll run inside the slot but can never advance the tour themselves —
 * the old design let a speech-end callback and a fallback timer both advance,
 * and a stale callback from the previous slide skipped the next one.
 *
 * Every slide activation gets a run id. Timers and callbacks that belong to an
 * older run are ignored, so nothing late can move a newer slide.
 *
 * Framework-agnostic on purpose (no React) so the timeline can be unit-tested
 * with a fake clock — see scripts/tests/test_story_mode_timeline.cjs.
 */

export interface TourTimelineSlide {
  /** Route the slide showcases. A query string is allowed; matching uses the path only. */
  route: string;
  /** Fixed slot length. The tour's total runtime is the sum of all slots. */
  durationMs: number;
}

export interface StoryTourEngineHost {
  /** Current pathname, without trailing slash. */
  getPath(): string;
  navigate(route: string): void;
  /** Slide became current. Its page may still be loading. */
  onSlideActivated(index: number): void;
  /**
   * The slide's page is on screen: start narration and scrolling here.
   * `remainingMs` is what is left of the slot. Returns a cleanup that stops both.
   */
  onSlideArmed(index: number, remainingMs: number): () => void;
  /** Auto-advance was withheld because the user navigated away from the slide's page. */
  onPausedChange(paused: boolean): void;
  /** The last slot ended, or Next was pressed on the last slide. */
  onFinished(): void;
}

/** How long to wait for a slide's route to load before narrating anyway. */
export const TOUR_ROUTE_WAIT_MS = 1500;

export function tourRoutePath(route: string): string {
  const path = route.split('?')[0].replace(/\/$/, '');
  return path || '/';
}

export function isOnTourRoute(path: string, route: string): boolean {
  const target = tourRoutePath(route);
  return path === target || path.startsWith(`${target}/`);
}

export class StoryTourEngine {
  private index = -1;
  private runId = 0;
  private activatedAt = 0;
  private armedPath: string | null = null;
  private disarm: (() => void) | null = null;
  private slotTimer: ReturnType<typeof setTimeout> | null = null;
  private routeWaitTimer: ReturnType<typeof setTimeout> | null = null;
  private visibilityRetry: (() => void) | null = null;
  private paused = false;

  constructor(
    private readonly slides: readonly TourTimelineSlide[],
    private readonly host: StoryTourEngineHost,
    private readonly routeWaitMs: number = TOUR_ROUTE_WAIT_MS,
  ) {}

  get currentIndex(): number {
    return this.index;
  }

  get isRunning(): boolean {
    return this.index >= 0;
  }

  start(index = 0): void {
    this.go(index);
  }

  next(): void {
    if (this.isRunning) this.go(this.index + 1);
  }

  prev(): void {
    if (this.index > 0) this.go(this.index - 1);
  }

  /** Restart the current slide's slot, narration and scroll. */
  replay(): void {
    if (this.isRunning) this.go(this.index);
  }

  /** Cancel everything without calling onFinished. */
  stop(): void {
    this.teardownSlide();
    this.runId++;
    this.index = -1;
  }

  /** Feed every pathname change here; it arms the slide once its page has loaded. */
  notifyPathChange(path: string): void {
    if (!this.isRunning || this.armedPath !== null) return;
    if (isOnTourRoute(path, this.slides[this.index].route)) this.arm(this.runId);
  }

  private go(index: number): void {
    this.teardownSlide();
    const runId = ++this.runId;
    if (index >= this.slides.length) {
      this.index = -1;
      this.host.onFinished();
      return;
    }

    this.index = Math.max(0, index);
    this.activatedAt = Date.now();
    const slide = this.slides[this.index];
    this.host.onSlideActivated(this.index);
    if (runId !== this.runId) return;

    // The slot clock starts at activation, so total runtime is exactly the sum of
    // the slots — independent of network, route or speech latency.
    this.slotTimer = setTimeout(() => this.handleSlotEnd(runId), slide.durationMs);

    if (isOnTourRoute(this.host.getPath(), slide.route)) {
      this.arm(runId);
      return;
    }
    this.host.navigate(slide.route);
    // Narrate anyway if the route never reports in (slow network, redirect).
    this.routeWaitTimer = setTimeout(() => this.arm(runId), this.routeWaitMs);
  }

  private arm(runId: number): void {
    if (runId !== this.runId || this.armedPath !== null) return;
    this.clearRouteWait();
    this.armedPath = this.host.getPath();
    const elapsed = Date.now() - this.activatedAt;
    const remainingMs = Math.max(0, this.slides[this.index].durationMs - elapsed);
    const disarm = this.host.onSlideArmed(this.index, remainingMs);
    if (runId === this.runId) {
      this.disarm = disarm;
    } else {
      disarm();
    }
  }

  private handleSlotEnd(runId: number): void {
    if (runId !== this.runId) return;
    this.slotTimer = null;

    // Don't march through tabs in a background browser tab; resume on return.
    if (typeof document !== 'undefined' && document.hidden) {
      if (this.visibilityRetry) return;
      const retry = () => {
        if (document.hidden) return;
        this.clearVisibilityRetry();
        this.handleSlotEnd(runId);
      };
      this.visibilityRetry = retry;
      document.addEventListener('visibilitychange', retry);
      return;
    }

    // Route guard: only auto-advance while the user is still on the slide's page
    // (or the page it was armed on, which covers redirects and slow loads).
    const path = this.host.getPath();
    if (isOnTourRoute(path, this.slides[this.index].route) || path === this.armedPath) {
      this.go(this.index + 1);
    } else {
      this.setPaused(true);
    }
  }

  private teardownSlide(): void {
    if (this.slotTimer) {
      clearTimeout(this.slotTimer);
      this.slotTimer = null;
    }
    this.clearRouteWait();
    this.clearVisibilityRetry();
    this.armedPath = null;
    const disarm = this.disarm;
    this.disarm = null;
    disarm?.();
    this.setPaused(false);
  }

  private clearRouteWait(): void {
    if (this.routeWaitTimer) {
      clearTimeout(this.routeWaitTimer);
      this.routeWaitTimer = null;
    }
  }

  private clearVisibilityRetry(): void {
    if (this.visibilityRetry && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityRetry);
    }
    this.visibilityRetry = null;
  }

  private setPaused(paused: boolean): void {
    if (this.paused === paused) return;
    this.paused = paused;
    this.host.onPausedChange(paused);
  }
}
