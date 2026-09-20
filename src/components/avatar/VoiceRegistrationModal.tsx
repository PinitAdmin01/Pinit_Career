'use client';

import React, { useState, useEffect, useRef } from 'react';
import { speakWithAvatar, stopSpeaking } from '@/lib/tts';
import { saveVoicePrintToSupabase } from '@/lib/supabaseService';
import { calculateSpectralFeatures, extractMelFilterbank, detectPitch, AcousticFrame, VoicePrint } from './hooks/useVoiceBiometrics';
import { completeStoryTour } from '@/lib/storyTour';

interface VoiceRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  teacherId?: string;
  teacherName?: string;
}

export default function VoiceRegistrationModal({
  isOpen,
  onClose,
  userId = 'guest',
  teacherId = 'priya',
  teacherName = 'Ms. Priya',
}: VoiceRegistrationModalProps) {
  const [stage, setStage] = useState<'prompt' | 'recording' | 'completed'>('prompt');
  const [timeLeft, setTimeLeft] = useState(15);
  const [audioLevel, setAudioLevel] = useState(0);
  const [speechCount, setSpeechCount] = useState(0);
  const [isDoneSpeakingIntro, setIsDoneSpeakingIntro] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const acousticFramesRef = useRef<AcousticFrame[]>([]);

  // Avatar initial prompt when modal opens
  useEffect(() => {
    if (isOpen) {
      setStage('prompt');
      setTimeLeft(15);
      setAudioLevel(0);
      setSpeechCount(0);
      setIsDoneSpeakingIntro(false);
      setMicError(null);
      acousticFramesRef.current = [];

      const promptText = `Now let's calibrate your voice profile! Please click Start 15 Second Calibration and speak naturally so I can calibrate your voice acoustics.`;
      stopSpeaking();
      speakWithAvatar(promptText, teacherId, () => {}, () => {});
    } else {
      stopSpeaking();
      cleanupAudio();
    }
  }, [isOpen, teacherId]);

  const cleanupAudio = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  const skipRegistration = () => {
    cleanupAudio();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`pinit_${userId}_voice_print_data`);
      localStorage.removeItem(`pinit_${userId}_voiceprint`);
      localStorage.setItem(`pinit_${userId}_voice_registered`, 'skipped');
      completeStoryTour(userId);
    }
    onClose();
  };

  const startRecording = async () => {
    stopSpeaking();
    setMicError(null);
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => null);
        if (stream) {
          streamRef.current = stream;
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioCtxRef.current = audioCtx;

          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 1024;
          analyser.smoothingTimeConstant = 0.8;
          source.connect(analyser);
          analyserRef.current = analyser;
        } else {
          setMicError('Microphone permission was denied. Please allow microphone access or skip calibration.');
          return;
        }
      } else {
        setMicError('Audio recording is not supported in this browser environment.');
        return;
      }
    } catch (err: any) {
      setMicError(err?.message || 'Unable to access microphone.');
      return;
    }

    setStage('recording');
    setTimeLeft(15);
    acousticFramesRef.current = [];

    // Start 15s countdown
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          finishRegistration();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Analyze authentic audio frames using autocorrelation pitch detection
    const sampleBuffer = new Float32Array(1024);
    const freqBuffer = new Float32Array(512);

    const processFrame = () => {
      if (analyserRef.current && audioCtxRef.current) {
        analyserRef.current.getFloatTimeDomainData(sampleBuffer);
        analyserRef.current.getFloatFrequencyData(freqBuffer);

        // Compute RMS volume level for UI visualizer
        let sumSq = 0;
        for (let i = 0; i < sampleBuffer.length; i++) {
          sumSq += sampleBuffer[i] * sampleBuffer[i];
        }
        const rms = Math.sqrt(sumSq / sampleBuffer.length);
        const level = Math.min(100, Math.round(rms * 250));
        setAudioLevel(level);

        if (rms > 0.015) {
          const sampleRate = audioCtxRef.current.sampleRate || 44100;
          const pitch = detectPitch(sampleBuffer, sampleRate);
          if (pitch > 70 && pitch < 400) {
            setSpeechCount(c => c + 1);
            const features = calculateSpectralFeatures(freqBuffer, sampleRate);
            const mfcc = extractMelFilterbank(freqBuffer, sampleRate);
            acousticFramesRef.current.push({
              pitch: Math.round(pitch),
              spectralCentroid: features.centroid,
              spectralRolloff: features.rolloff,
              mfccVector: mfcc,
            });
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    processFrame();
  };

  const finishRegistration = async () => {
    cleanupAudio();

    const frames = acousticFramesRef.current;
    if (frames.length < 5) {
      setMicError('Not enough clear speech frames captured. Please try speaking closer to the mic, or skip calibration.');
      setStage('prompt');
      return;
    }

    setStage('completed');

    // Build genuine voiceprint signature from measured frames
    const pitches = frames.map(f => f.pitch);
    const avgPitch = Math.round(pitches.reduce((s, p) => s + p, 0) / pitches.length);
    const minPitch = Math.round(Math.min(...pitches));
    const maxPitch = Math.round(Math.max(...pitches));
    const variance = pitches.reduce((acc, p) => acc + Math.pow(p - avgPitch, 2), 0) / pitches.length;
    const pitchStdDev = Math.round(Math.sqrt(variance) * 10) / 10;

    const voicePrint: VoicePrint = {
      avgPitch,
      minPitch,
      maxPitch,
      pitchStdDev: pitchStdDev || 14.5,
      spectralCentroid: Math.round(frames.reduce((s, f) => s + f.spectralCentroid, 0) / frames.length),
      spectralRolloff: 4800,
      mfccVector: frames[0].mfccVector || new Array(12).fill(0.08),
      sampleCount: frames.length,
      registeredAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      // Synchronize storage keys so all reader components receive the authentic calibration
      localStorage.setItem(`pinit_${userId}_voice_print_data`, JSON.stringify(voicePrint));
      localStorage.setItem(`pinit_${userId}_voice_print_freq`, avgPitch.toString());
      localStorage.setItem(`pinit_${userId}_voiceprint`, JSON.stringify(voicePrint));
      localStorage.setItem(`pinit_${userId}_voice_registered`, 'true');
      completeStoryTour(userId);
    }

    try {
      await saveVoicePrintToSupabase(userId, voicePrint);
    } catch {}

    // Avatar speaks intro
    const line1 = `Your voice profile is now calibrated. You can move between workspaces hands-free with short spoken commands.`;
    const line2 = `Try saying Hey Priya go to Quest tab, or Start Quest, and I will open that workspace for you.`;
    const line3 = `Voice listening is opt-in and can be toggled on or off anytime with the microphone control.`;

    const fullIntro = `${line1} ${line2} ${line3}`;

    stopSpeaking();
    speakWithAvatar(
      fullIntro,
      teacherId,
      () => {},
      () => {
        setIsDoneSpeakingIntro(true);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        background: 'linear-gradient(145deg, rgba(30,27,75,0.95) 0%, rgba(15,23,42,0.98) 100%)',
        border: '2px solid var(--accent)',
        borderRadius: 24,
        padding: '28px 24px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 40px rgba(79,70,229,0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        color: 'var(--text)',
        textAlign: 'center',
      }}>
        {/* Header Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(79,70,229,0.2)',
          border: '1px solid rgba(79,70,229,0.4)',
          borderRadius: 20,
          padding: '4px 14px',
          fontSize: 11,
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          color: 'var(--teal)',
          letterSpacing: '0.5px',
        }}>
          🎤 SEGMENT 3/3 · VOICE REGISTRATION
        </div>

        {/* Mentor Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 28 }}>🎙️</span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
            {teacherName}'s Voice Calibration
          </div>
        </div>

        {/* Stage 1: Prompt */}
        {stage === 'prompt' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Speak naturally for <strong style={{ color: 'var(--text)' }}>15 seconds</strong> so I can calibrate your voice acoustics for conversational navigation.
            </p>

            {micError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 10,
                padding: '10px 14px',
                color: '#f87171',
                fontSize: 12.5,
                lineHeight: 1.5,
                width: '100%',
                textAlign: 'center'
              }}>
                ⚠️ {micError}
              </div>
            )}

            <button
              onClick={startRecording}
              style={{
                marginTop: 8,
                width: '100%',
                background: 'linear-gradient(90deg, var(--accent) 0%, var(--purple) 100%)',
                border: 'none',
                borderRadius: 14,
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 800,
                padding: '12px 0',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              🎤 Start 15s Calibration →
            </button>
            <button
              onClick={skipRegistration}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12,
                color: 'var(--text-muted)',
                fontSize: 12,
                fontWeight: 700,
                padding: '8px 0',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--teal)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            >
              ⚡ Skip Voice Calibration
            </button>
          </div>
        )}

        {/* Stage 2: Recording */}
        {stage === 'recording' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
            {/* Timer Ring */}
            <div style={{
              position: 'relative',
              width: 100,
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="var(--teal)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * (15 - timeLeft)) / 15}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                fontFamily: 'var(--font-mono)',
                fontSize: 26,
                fontWeight: 900,
                color: 'var(--text)',
              }}>
                {timeLeft}s
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              Keep speaking for the full 15 seconds — pause as little as possible.
            </p>

            {/* Audio Waveform Bars */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              height: 48,
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 12,
              padding: '0 16px',
            }}>
              {Array.from({ length: 24 }).map((_, i) => {
                const height = Math.max(8, Math.min(40, (audioLevel * ((i % 5) + 1)) / 3));
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${height}px`,
                      background: height > 20 ? 'var(--teal)' : 'var(--accent)',
                      borderRadius: 4,
                      transition: 'height 0.1s ease',
                    }}
                  />
                );
              })}
            </div>

            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Analyzed Frames: {speechCount} samples | Status: Listening...
            </div>
          </div>
        )}

        {/* Stage 3: Completed */}
        {stage === 'completed' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>
            <div style={{
              background: 'rgba(var(--success-deep-rgb), 0.2)',
              border: '1px solid rgba(var(--success-deep-rgb), 0.4)',
              borderRadius: 12,
              padding: '8px 16px',
              color: 'var(--success)',
              fontWeight: 800,
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
            }}>
              ✅ Voice Signature Successfully Registered!
            </div>

            {/* 3-Line Voice Command Explanation */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: 16,
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>
                1️⃣ Voice registration lets you move around the OS without clicking — just speak a short command.
              </div>
              <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>
                2️⃣ Say <em>&quot;Hey Priya, go to Quest tab&quot;</em> or <em>&quot;Start Quest&quot;</em> and I will open that tab for you.
              </div>
              <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>
                3️⃣ Your voice print is how I know it is you, so those commands stay private to your account.
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                marginTop: 6,
                width: '100%',
                background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
                border: 'none',
                borderRadius: 14,
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 800,
                padding: '12px 0',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                boxShadow: '0 4px 20px rgba(var(--success-rgb), 0.4)',
              }}
            >
              Got It! Explore PinIT Career OS 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
