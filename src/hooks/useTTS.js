// hooks/useTTS.js — Kokoro TTS + KittenTTS + Browser Web Speech fallback
// Mirrors the logic of lib/tts.ts but as a React hook API.
// Used in components that need speak/stop as callbacks (interview, lesson, etc.)

import { useRef, useCallback } from 'react';
import { generateTTSAudio, detectVibe, stopSpeaking, getCleanCacheKey } from '@/lib/tts';

function getSharedAudioContext(sampleRate = 24000) {
  if (typeof window === 'undefined') return null;
  const win = window;
  if (!win._useTTSSharedCtx || win._useTTSSharedCtx.state === 'closed') {
    win._useTTSSharedCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
  }
  if (win._useTTSSharedCtx.state === 'suspended') {
    win._useTTSSharedCtx.resume().catch(() => {});
  }
  return win._useTTSSharedCtx;
}

export function useTTS() {
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
    synthRef.current?.cancel();
  }, []);

  const speak = useCallback(async (text, teacherId = 'priya') => {
    if (!text?.trim()) return;
    stop();
    speakingRef.current = true;

    // Strip markdown for TTS while preserving words
    const plain = getCleanCacheKey(text).slice(0, 600);

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

      const ctx = getSharedAudioContext(sampleRate);
      if (!ctx) return;

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
      console.warn('[useTTS] Main-thread generation failed:', err.message);
    }
  }, [stop]);

  return { speak, stop };
}

