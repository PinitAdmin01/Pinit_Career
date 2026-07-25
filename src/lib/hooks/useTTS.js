// hooks/useTTS.js — Kokoro TTS + KittenTTS + Browser Web Speech fallback
// Mirrors the logic of lib/tts.ts but as a React hook API.
// Used in components that need speak/stop as callbacks (interview, lesson, etc.)

import { useRef, useCallback } from 'react';
import { generateTTSAudio, detectVibe, stopSpeaking } from '@/lib/tts';

export function useTTS() {
  const audioCtxRef  = useRef(null);
  const sourceRef    = useRef(null);
  const synthRef     = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const speakingRef  = useRef(false);

  const stop = useCallback(() => {
    speakingRef.current = false;
    stopSpeaking();

    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch {}
      sourceRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
    synthRef.current?.cancel();
  }, []);

  const speak = useCallback(async (text, teacherId = 'priya') => {
    if (!text?.trim()) return;
    stop();
    speakingRef.current = true;

    // Strip markdown for TTS
    const plain = text
      .replace(/[*_`#>~✦🤖👋🎯💼🔐🔬⚡✨✓⬡\[\]()]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 600);

    if (!plain) return;

    const vibe = detectVibe(plain);

    // ── Tier 1: Kokoro / KittenTTS via Main Thread ──────────────────────
    try {
      const audioPromise = generateTTSAudio(plain, teacherId, vibe);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Local model download timeout')), 10000)
      );

      const { buffer, sampleRate } = await Promise.race([audioPromise, timeoutPromise]);
      if (!speakingRef.current) return;

      const ctx = new AudioContext({ sampleRate });
      audioCtxRef.current = ctx;

      const audioBuf = ctx.createBuffer(1, buffer.length, sampleRate);
      audioBuf.copyToChannel(buffer, 0);

      const source = ctx.createBufferSource();
      sourceRef.current = source;
      source.buffer = audioBuf;

      // Playback rate speed adjustments
      if (vibe === 'happy') {
        source.playbackRate.value = 1.08;
      } else if (vibe === 'motivational') {
        source.playbackRate.value = 0.94;
      } else {
        source.playbackRate.value = 1.00;
      }

      source.connect(ctx.destination);
      source.onended = () => { sourceRef.current = null; };
      source.start(0);
      return; // ✅ Success
    } catch (err) {
      console.warn('[useTTS] Main-thread generation fallback to Web Speech:', err.message);
    }

    // ── Tier 4: Browser Web Speech API fallback ───────────────────────────
    if (!speakingRef.current) return;

    const synth = synthRef.current;
    if (!synth) return;

    const utt = new SpeechSynthesisUtterance(plain);
    
    // Set base rate and pitch
    let rate = 0.92;
    let pitch = (teacherId === 'priya' || teacherId === 'aisha' || teacherId === 'maya' || teacherId === 'divya' || teacherId === 'shalini' || teacherId === 'sneha' || teacherId === 'neha') ? 1.1 : 0.88;

    if (vibe === 'happy') {
      rate = 1.00;
      pitch += 0.05;
    } else if (vibe === 'motivational') {
      rate = 0.86;
      pitch -= 0.02;
    }

    utt.rate   = rate;
    utt.pitch  = pitch;
    utt.lang   = 'en-US';
    utt.volume = 1;

    const voices = synth.getVoices();
    const isFemale = teacherId === 'priya' || teacherId === 'aisha' || teacherId === 'maya' || teacherId === 'divya' || teacherId === 'shalini' || teacherId === 'sneha' || teacherId === 'neha';
    const preferred = voices.find(v =>
      isFemale
        ? /female|woman|zira|samantha|karen|tessa/i.test(v.name)
        : /male|man|david|alex|daniel|rishi/i.test(v.name)
    );
    if (preferred) utt.voice = preferred;

    await new Promise((resolve) => {
      utt.onend   = resolve;
      utt.onerror = resolve;
      synth.speak(utt);
    });
  }, [stop]);

  return { speak, stop };
}
