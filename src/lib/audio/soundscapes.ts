/**
 * PinIT Mindset Archetype Focus Soundscape Engine
 * Multi-mode Focus Audio: Supports Real Ambient Audio Tracks & Web Audio Synthesis with zero race conditions.
 */

let audioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let activeLfos: OscillatorNode[] = [];
let masterGain: GainNode | null = null;
let audioElement: HTMLAudioElement | null = null;
let audioSourceNode: MediaElementAudioSourceNode | null = null;
let isRunning: boolean = false;

const ARCHETYPE_FREQUENCIES: Record<string, number[]> = {
  'pattern hunter': [220, 277.18, 329.63, 440],     // A Major Alpha Synth
  'explorer': [261.63, 329.63, 392.00, 523.25],       // C Major Lofi Pulse
  'social iq': [293.66, 369.99, 440.00, 587.33],      // D Major Neo-Classical String
  'stabilizer': [196.00, 246.94, 293.66, 392.00]       // G Major Zen Drone Pad
};

// Suno/Ambient track URLs mapping per archetype (local public directory with fallback)
const ARCHETYPE_AUDIO_TRACKS: Record<string, string> = {
  'pattern hunter': '/audio/soundscapes/pattern-hunter.mp3',
  'explorer': '/audio/soundscapes/explorer.mp3',
  'social iq': '/audio/soundscapes/social-iq.mp3',
  'stabilizer': '/audio/soundscapes/stabilizer.mp3'
};

export function initAudioContext() {
  if (typeof window !== 'undefined' && !audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function startArchetypeSoundscape(archetype: string = 'Pattern Hunter', targetVolume: number = 0.12) {
  if (typeof window === 'undefined') return;
  initAudioContext();

  // Synchronous cleanup of previous session (No Race Conditions)
  stopArchetypeSoundscapeImmediately();

  const key = (archetype || 'pattern hunter').toLowerCase();
  const trackUrl = ARCHETYPE_AUDIO_TRACKS[key] || ARCHETYPE_AUDIO_TRACKS['pattern hunter'];

  try {
    // Attempt HTML5 Ambient Audio Track loading first
    if (!audioElement) {
      audioElement = new Audio();
      audioElement.loop = true;
      audioElement.crossOrigin = 'anonymous';
    }
    audioElement.src = trackUrl;
    audioElement.volume = targetVolume;

    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isRunning = true;
      }).catch(err => {
        console.warn('Audio track autoplay blocked, falling back to Web Audio Synthesis:', err);
        fallbackWebAudioSynthesis(key, targetVolume);
      });
    }
  } catch {
    fallbackWebAudioSynthesis(key, targetVolume);
  }
}

function fallbackWebAudioSynthesis(key: string, targetVolume: number) {
  if (!audioCtx) return;
  const freqs = ARCHETYPE_FREQUENCIES[key] || ARCHETYPE_FREQUENCIES['pattern hunter'];

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(targetVolume, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  activeOscillators = freqs.map((freq, idx) => {
    const osc = audioCtx!.createOscillator();
    const oscGain = audioCtx!.createGain();

    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq / (idx === 0 ? 2 : 1), audioCtx!.currentTime);

    const lfo = audioCtx!.createOscillator();
    lfo.frequency.setValueAtTime(0.1 + idx * 0.05, audioCtx!.currentTime);
    const lfoGain = audioCtx!.createGain();
    lfoGain.gain.setValueAtTime(1.5, audioCtx!.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();
    activeLfos.push(lfo);

    oscGain.gain.setValueAtTime(targetVolume, audioCtx!.currentTime);
    osc.connect(oscGain);
    oscGain.connect(masterGain!);
    osc.start();

    return osc;
  });

  isRunning = true;
}

export function stopArchetypeSoundscapeImmediately() {
  if (audioElement) {
    try {
      audioElement.pause();
      audioElement.currentTime = 0;
    } catch {}
  }
  if (activeLfos.length > 0) {
    activeLfos.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    activeLfos = [];
  }
  if (activeOscillators.length > 0) {
    activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    activeOscillators = [];
  }
  if (masterGain) {
    try {
      masterGain.disconnect();
    } catch {}
    masterGain = null;
  }
  isRunning = false;
}

export function stopArchetypeSoundscape() {
  stopArchetypeSoundscapeImmediately();
}

export function getUserSoundscapeVolume(): number {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('pinit_focus_music_volume');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
  }
  return 50;
}

export function setUserSoundscapeVolume(vol: number) {
  const clamped = Math.max(0, Math.min(100, vol));
  if (typeof window !== 'undefined') {
    localStorage.setItem('pinit_focus_music_volume', clamped.toString());
  }
  applyEffectiveVolume(false);
}

export function setSoundscapeDucking(isTeacherSpeaking: boolean) {
  applyEffectiveVolume(isTeacherSpeaking);
}

function applyEffectiveVolume(isTeacherSpeaking: boolean) {
  const userVolSetting = getUserSoundscapeVolume();
  const scale = userVolSetting / 100;
  const targetVol = isTeacherSpeaking ? (0.08 * scale) : (0.30 * scale);

  if (audioElement) {
    audioElement.volume = targetVol;
  }
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, targetVol), audioCtx.currentTime + 0.3);
    } catch {}
  }
}

export function isSoundscapeActive() {
  return isRunning;
}
