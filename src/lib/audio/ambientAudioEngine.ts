'use client';

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private currentTheme: 'dark' | 'light' | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isAudioMuted: boolean = false;
  private timerId: NodeJS.Timeout | null = null;
  private chimeIntervalId: NodeJS.Timeout | null = null;
  private fadeIntervalId: NodeJS.Timeout | null = null;
  private targetVolume: number = 0.18;
  private userVolumeLevel: number = 0.5; // 0.0 to 1.0

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('pc_ambient_muted');
      this.isAudioMuted = savedMute === 'true';
      const savedVol = localStorage.getItem('pc_ambient_volume');
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.userVolumeLevel = parsed;
          this.targetVolume = 0.36 * parsed;
        }
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getVolume(): number {
    return this.userVolumeLevel;
  }

  public setVolume(level: number) {
    const clamped = Math.max(0, Math.min(1, level));
    this.userVolumeLevel = clamped;
    this.targetVolume = 0.36 * clamped;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pc_ambient_volume', String(clamped));
      window.dispatchEvent(new CustomEvent('pc_audio_volume_changed', { detail: { volume: clamped } }));
    }
    // Update active HTML audio element in real-time
    if (this.currentAudioElement && !this.isAudioMuted) {
      this.currentAudioElement.volume = Math.max(0.0001, this.targetVolume);
    }
    // Update active Web Audio master gain in real-time
    if (this.masterGain && this.ctx && !this.isAudioMuted) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, this.targetVolume), now + 0.08);
    }
  }

  public isMuted(): boolean {
    return this.isAudioMuted;
  }

  public setMuted(muted: boolean) {
    this.isAudioMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pc_ambient_muted', String(muted));
      window.dispatchEvent(new CustomEvent('pc_audio_mute_changed', { detail: { muted } }));
    }
    if (muted) {
      this.stop();
    } else if (this.currentTheme) {
      this.play(this.currentTheme, 0);
    }
  }

  public play(theme: 'dark' | 'light', delayMs: number = 3000) {
    if (this.currentTheme === theme && (this.currentAudioElement || this.activeNodes.length > 0 || this.timerId !== null)) {
      // Audio is already active or scheduled to play this theme uninterrupted.
      return;
    }
    this.currentTheme = theme;
    this.stopImmediate();

    if (this.isAudioMuted) return;

    this.timerId = setTimeout(() => {
      this.timerId = null;
      this.startPlayback(theme);
    }, delayMs);
  }

  private startPlayback(theme: 'dark' | 'light') {
    if (typeof window === 'undefined') return;

    const mp3Src = theme === 'dark' ? '/audio/landing_dark.mp3' : '/audio/landing_light.mp3';

    // Try playing the MP3 track
    const audio = new Audio();
    audio.src = mp3Src;
    audio.loop = true;
    audio.volume = 0.001;

    let hasStartedMP3 = false;

    audio.addEventListener('canplaythrough', () => {
      if (this.isAudioMuted || this.currentTheme !== theme) {
        audio.pause();
        return;
      }
      hasStartedMP3 = true;
      this.currentAudioElement = audio;
      audio.play().then(() => {
        this.fadeInHTMLAudio(audio, this.targetVolume, 2500);
      }).catch(() => {
        // Autoplay policy or play error -> Fallback to synthesized audio
        this.startSynthesizedSoundscape(theme);
      });
    }, { once: true });

    audio.addEventListener('error', () => {
      // If MP3 does not exist (404) or failed -> fallback to synthesized Web Audio
      if (!hasStartedMP3 && this.currentTheme === theme && !this.isAudioMuted) {
        this.startSynthesizedSoundscape(theme);
      }
    }, { once: true });

    // Trigger load
    audio.load();
  }

  private fadeInHTMLAudio(audio: HTMLAudioElement, targetVol: number, durationMs: number) {
    if (this.fadeIntervalId) {
      clearInterval(this.fadeIntervalId);
    }
    const steps = 30;
    const stepTime = durationMs / steps;
    const volIncrement = targetVol / steps;
    let currentVol = 0.001;

    this.fadeIntervalId = setInterval(() => {
      currentVol = Math.min(targetVol, currentVol + volIncrement);
      if (audio && !this.isAudioMuted) {
        audio.volume = currentVol;
      }
      if (currentVol >= targetVol || this.isAudioMuted) {
        if (this.fadeIntervalId) {
          clearInterval(this.fadeIntervalId);
          this.fadeIntervalId = null;
        }
      }
    }, stepTime);
  }

  private startSynthesizedSoundscape(theme: 'dark' | 'light') {
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master Gain with gentle 2.5s Fade-In
    const master = ctx.createGain();
    const effectiveVol = this.targetVolume || (theme === 'dark' ? 0.15 : 0.14);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(Math.max(0.0001, effectiveVol), now + 2.5);
    master.connect(ctx.destination);
    this.masterGain = master;

    if (theme === 'dark') {
      // 🌌 432Hz DEEP MEDITATIVE COSMIC CALM
      const root = 432;
      const freqs = [
        root / 8, // 54Hz Deep Earth Sub
        root / 4, // 108Hz Warm Bass
        root / 2.666, // 162Hz Fifth
        root / 2, // 216Hz Mid Body
        root * 0.75, // 324Hz Soft Fifth
        root // 432Hz Pure Harmonic
      ];

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, now);
      filter.Q.setValueAtTime(1.2, now);
      filter.connect(master);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, now);
      lfoGain.gain.setValueAtTime(80, now);
      lfo.connect(filter.frequency);
      lfo.start();
      this.activeNodes.push(lfo);

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        if (idx === 3) {
          osc.frequency.setValueAtTime(f + 4, now);
        }

        const oscGain = 0.28 / (idx + 1);
        gain.gain.setValueAtTime(oscGain, now);

        osc.connect(gain);
        gain.connect(filter);
        osc.start();
        this.activeNodes.push(osc);
      });

      this.chimeIntervalId = setInterval(() => {
        if (!this.ctx || this.isAudioMuted || this.currentTheme !== 'dark') return;
        const cNow = this.ctx.currentTime;
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();

        const chimeFreqs = [432, 648, 864, 1080];
        const randomFreq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(randomFreq, cNow);

        chimeGain.gain.setValueAtTime(0.0001, cNow);
        chimeGain.gain.exponentialRampToValueAtTime(0.03, cNow + 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, cNow + 3.2);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(master);

        chimeOsc.start(cNow);
        chimeOsc.stop(cNow + 3.3);
      }, 4200);

    } else {
      // ☀️ WARM 528Hz GOLDEN SOLAR VIBRATION
      const root = 528;
      const freqs = [
        root / 8, // 66Hz Warm Ground
        root / 4, // 132Hz Solar Center
        root / 2, // 264Hz Mid Heart
        root * 0.75, // 396Hz Liberation
        root, // 528Hz Transformation / Miracles
        root * 1.25 // 660Hz Bright Halo
      ];

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(528, now);
      filter.Q.setValueAtTime(0.85, now);
      filter.connect(master);

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        if (idx === 4) {
          osc.frequency.setValueAtTime(f + 2.5, now);
        }

        const oscGain = 0.22 / (idx + 1);
        gain.gain.setValueAtTime(oscGain, now);

        osc.connect(gain);
        gain.connect(filter);
        osc.start();
        this.activeNodes.push(osc);
      });

      this.chimeIntervalId = setInterval(() => {
        if (!this.ctx || this.isAudioMuted || this.currentTheme !== 'light') return;
        const cNow = this.ctx.currentTime;
        const sparkOsc = this.ctx.createOscillator();
        const sparkGain = this.ctx.createGain();

        const sparkFreqs = [528, 792, 1056, 1320];
        const randomFreq = sparkFreqs[Math.floor(Math.random() * sparkFreqs.length)];

        sparkOsc.type = 'sine';
        sparkOsc.frequency.setValueAtTime(randomFreq, cNow);

        sparkGain.gain.setValueAtTime(0.0001, cNow);
        sparkGain.gain.exponentialRampToValueAtTime(0.025, cNow + 0.15);
        sparkGain.gain.exponentialRampToValueAtTime(0.0001, cNow + 1.6);

        sparkOsc.connect(sparkGain);
        sparkGain.connect(master);

        sparkOsc.start(cNow);
        sparkOsc.stop(cNow + 1.65);
      }, 2400);
    }
  }

  public stop() {
    this.stopImmediate();
  }

  public stopImmediate() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.chimeIntervalId) {
      clearInterval(this.chimeIntervalId);
      this.chimeIntervalId = null;
    }
    if (this.fadeIntervalId) {
      clearInterval(this.fadeIntervalId);
      this.fadeIntervalId = null;
    }
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.volume = 0;
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement.src = '';
      } catch {}
      this.currentAudioElement = null;
    }
    this.activeNodes.forEach((node) => {
      if (typeof node !== 'number') {
        try {
          (node as any).stop?.();
          (node as any).disconnect?.();
        } catch {}
      }
    });
    this.activeNodes = [];
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {}
      this.masterGain = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.suspend?.();
      } catch {}
    }
  }
}

export const ambientAudio = new AmbientAudioEngine();
