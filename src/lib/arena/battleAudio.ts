/**
 * Procedural Web Audio Synthesizer for PinIT Code War & 1v1 Arena
 * 
 * Provides dynamic audio feedback using the browser's native Web Audio API:
 * - Zero external mp3/wav files (no 404s, 0ms latency, 100% offline).
 * - Multi-oscillator harmonic synthesis for fanfares, chimes, and heartbeat pulses.
 * - Persistent mute preference in localStorage.
 * - SSR/Node safe (noop when running in non-browser environments).
 */

class BattleAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private lastSurgeSoundTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pinit_arena_audio_muted');
        // Default to enabled (unmuted) for competitive feel, unless explicitly muted
        this.muted = saved === 'true';
      } catch {
        this.muted = false;
      }
    } else {
      this.muted = true;
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pinit_arena_audio_muted', muted ? 'true' : 'false');
      } catch {}
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /**
   * Helper: Plays a synthesized tone with frequency, type, and envelope
   */
  private playTone(params: {
    freq: number;
    type?: OscillatorType;
    duration: number;
    gainStart?: number;
    gainEnd?: number;
    delay?: number;
  }) {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const { freq, type = 'sine', duration, gainStart = 0.15, gainEnd = 0.001, delay = 0 } = params;
    const startTime = ctx.currentTime + delay;
    const stopTime = startTime + duration;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(gainStart, startTime);
      gainNode.gain.exponentialRampToValueAtTime(gainEnd, stopTime);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(stopTime);
    } catch {
      // Audio playback suspended or disallowed by browser autoplay policy
    }
  }

  /**
   * 3-Tone Rising Fanfare: Match Start
   */
  public playBattleStart(): void {
    if (this.muted) return;
    // C4 (261.63Hz) -> E4 (329.63Hz) -> G4 (392.00Hz)
    this.playTone({ freq: 261.63, type: 'triangle', duration: 0.18, delay: 0.0, gainStart: 0.18 });
    this.playTone({ freq: 329.63, type: 'triangle', duration: 0.18, delay: 0.15, gainStart: 0.20 });
    this.playTone({ freq: 523.25, type: 'triangle', duration: 0.35, delay: 0.30, gainStart: 0.25 });
  }

  /**
   * High-pitch chime on test case pass. Scales pitch upward with higher streaks!
   */
  public playTestPassed(streakCount = 1): void {
    if (this.muted) return;
    const baseFreq = 587.33; // D5
    const pitchMultiplier = Math.min(1.8, 1 + (streakCount - 1) * 0.15);
    const primaryFreq = baseFreq * pitchMultiplier;

    this.playTone({ freq: primaryFreq, type: 'sine', duration: 0.15, delay: 0.0, gainStart: 0.18 });
    this.playTone({ freq: primaryFreq * 1.5, type: 'triangle', duration: 0.25, delay: 0.08, gainStart: 0.14 });
  }

  /**
   * Low discordant buzz on test case failure / syntax error
   */
  public playTestFailed(): void {
    if (this.muted) return;
    // Low dissonant interval (Eb3 and D3)
    this.playTone({ freq: 155.56, type: 'sawtooth', duration: 0.22, delay: 0.0, gainStart: 0.12 });
    this.playTone({ freq: 146.83, type: 'sawtooth', duration: 0.22, delay: 0.05, gainStart: 0.10 });
  }

  /**
   * Sub-bass heartbeat pulse when match timer enters <90s Pressure Surge
   */
  public playSurgePulse(): void {
    if (this.muted) return;
    const now = Date.now();
    // Throttle pulse to once every 1.5 seconds maximum
    if (now - this.lastSurgeSoundTime < 1400) return;
    this.lastSurgeSoundTime = now;

    // Double thump heartbeat (65Hz -> 50Hz)
    this.playTone({ freq: 65, type: 'sine', duration: 0.16, delay: 0.0, gainStart: 0.28 });
    this.playTone({ freq: 55, type: 'sine', duration: 0.20, delay: 0.22, gainStart: 0.22 });
  }

  /**
   * Dramatic fanfare when First Blood is claimed
   */
  public playFirstBlood(): void {
    if (this.muted) return;
    this.playTone({ freq: 392.00, type: 'sawtooth', duration: 0.2, delay: 0.0, gainStart: 0.22 });
    this.playTone({ freq: 523.25, type: 'sawtooth', duration: 0.2, delay: 0.15, gainStart: 0.25 });
    this.playTone({ freq: 659.25, type: 'triangle', duration: 0.45, delay: 0.30, gainStart: 0.28 });
    this.playTone({ freq: 783.99, type: 'sine', duration: 0.50, delay: 0.42, gainStart: 0.25 });
  }

  /**
   * Triumphant Victory Chime: Major Arpeggio
   */
  public playVictory(): void {
    if (this.muted) return;
    this.playTone({ freq: 261.63, type: 'triangle', duration: 0.20, delay: 0.0, gainStart: 0.20 });
    this.playTone({ freq: 329.63, type: 'triangle', duration: 0.20, delay: 0.12, gainStart: 0.22 });
    this.playTone({ freq: 392.00, type: 'triangle', duration: 0.20, delay: 0.24, gainStart: 0.24 });
    this.playTone({ freq: 523.25, type: 'triangle', duration: 0.45, delay: 0.36, gainStart: 0.28 });
    this.playTone({ freq: 659.25, type: 'sine', duration: 0.60, delay: 0.48, gainStart: 0.22 });
  }

  /**
   * Defeat resolving minor tone
   */
  public playDefeat(): void {
    if (this.muted) return;
    this.playTone({ freq: 392.00, type: 'triangle', duration: 0.25, delay: 0.0, gainStart: 0.15 });
    this.playTone({ freq: 349.23, type: 'triangle', duration: 0.25, delay: 0.18, gainStart: 0.15 });
    this.playTone({ freq: 293.66, type: 'sine', duration: 0.45, delay: 0.36, gainStart: 0.18 });
  }

  /**
   * Short tactical warning click when running on cooldown
   */
  public playCooldownWarning(): void {
    if (this.muted) return;
    this.playTone({ freq: 220.00, type: 'sawtooth', duration: 0.08, delay: 0.0, gainStart: 0.08 });
  }
}

export const BattleAudio = new BattleAudioSynthesizer();
