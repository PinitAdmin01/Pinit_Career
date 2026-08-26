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

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('pc_ambient_muted');
      this.isAudioMuted = savedMute === 'true';
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

  public isMuted(): boolean {
    return this.isAudioMuted;
  }

  public setMuted(muted: boolean) {
    this.isAudioMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pc_ambient_muted', String(muted));
    }
    if (muted) {
      this.stop();
    } else if (this.currentTheme) {
      this.play(this.currentTheme, 0);
    }
  }

  public play(theme: 'dark' | 'light', delayMs: number = 3000) {
    this.currentTheme = theme;
    this.stopImmediate();

    if (this.isAudioMuted) return;

    this.timerId = setTimeout(() => {
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
      if (audio) {
        audio.volume = currentVol;
      }
      if (currentVol >= targetVol) {
        if (this.fadeIntervalId) {
          clearInterval(this.fadeIntervalId);
          this.fadeIntervalId = null;
        }
      }
    }, stepTime);
  }

  private fadeOutHTMLAudio(audio: HTMLAudioElement, durationMs: number, onComplete: () => void) {
    if (this.fadeIntervalId) {
      clearInterval(this.fadeIntervalId);
    }
    const steps = 20;
    const stepTime = durationMs / steps;
    const startVol = audio.volume;
    const volDecrement = startVol / steps;
    let currentVol = startVol;

    this.fadeIntervalId = setInterval(() => {
      currentVol = Math.max(0, currentVol - volDecrement);
      if (audio) {
        audio.volume = currentVol;
      }
      if (currentVol <= 0) {
        if (this.fadeIntervalId) {
          clearInterval(this.fadeIntervalId);
          this.fadeIntervalId = null;
        }
        audio.pause();
        onComplete();
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
    const targetVol = theme === 'dark' ? 0.15 : 0.14;
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(targetVol, now + 2.5);
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
        chimeGain.gain.exponentialRampToValueAtTime(0.035, cNow + 0.4);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, cNow + 3.2);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(master);

        chimeOsc.start(cNow);
        chimeOsc.stop(cNow + 3.3);
      }, 3500);

    } else {
      // ☀️ 528Hz WARM MORNING SUNBEAM HARMONIC RESONANCE
      const freqs = [132, 198, 330, 396, 528, 594];

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(1100, now + 3.5);
      filter.Q.setValueAtTime(0.7, now);
      filter.connect(master);

      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.frequency.setValueAtTime(0.18, now);
      shimmerGain.gain.setValueAtTime(120, now);
      shimmer.connect(filter.frequency);
      shimmer.start();
      this.activeNodes.push(shimmer);

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        const oscGain = 0.24 / (idx + 1);
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
        const sparkGain = ctx.createGain();

        const sparkFreqs = [1056, 1188, 1320, 1584, 1760];
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

    // Fade out HTML audio if playing
    if (this.currentAudioElement) {
      const audio = this.currentAudioElement;
      this.currentAudioElement = null;
      this.fadeOutHTMLAudio(audio, 800, () => {
        audio.src = '';
      });
    }

    // Fade out Synthesized audio if playing
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        this.stopImmediate();
      }, 850);
    } else {
      this.stopImmediate();
    }
  }

  private stopImmediate() {
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
  }
}

export const ambientAudio = new AmbientAudioEngine();
