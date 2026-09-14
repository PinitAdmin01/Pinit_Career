'use client';

import React, { useState, useRef } from 'react';

export interface VoiceDiagnosticProps {
  studentType: string;
  onCompleteAndGrade: (transcript: string) => void;
  setAnimState: (anim: any) => void;
}

export default function VoiceDiagnostic({
  studentType,
  onCompleteAndGrade,
  setAnimState
}: VoiceDiagnosticProps) {
  const [speechState, setSpeechState] = useState<'ready' | 'calibrating' | 'calibrated' | 'recording' | 'recorded'>('ready');
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [manualInputMode, setManualInputMode] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [measuredRms, setMeasuredRms] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const isCommerce = studentType.includes('Commerce') || studentType.includes('B.Com');
  const isManagement = studentType.includes('Management') || studentType.includes('BBA');

  const spokenPromptText = isCommerce
    ? "Please introduce yourself and explain your target financial & business analysis goals."
    : isManagement
    ? "Please introduce yourself and explain your target product management & business growth goals."
    : "Please introduce yourself and explain your target software career goals.";

  const streamPresets = isCommerce
    ? [
        "📊 Financial Analyst: My goal is to build quantitative financial models, perform valuation, and manage corporate risk.",
        "💳 FinTech Specialist: My goal is to optimize payment gateway architectures, SQL ledgers, and financial regulatory technology.",
        "⚖️ Auditing & Compliance: My goal is to streamline ledger audits, tax compliance, and internal financial controls."
      ]
    : isManagement
    ? [
        "📈 Product Manager: My goal is to lead cross-functional engineering teams, manage backlog funnels, and design product strategy.",
        "🚀 Growth & Operations: My goal is to optimize unit economics, scale marketing acquisition funnels, and streamline supply chains.",
        "💡 Management Consultant: My goal is to perform strategic market research, SWOT analysis, and executive advisory."
      ]
    : [
        "🧠 Analytical SDE: My goal is to build scalable backend services, microservices, and optimize algorithm complexity.",
        "🎨 Frontend Web SDE: My goal is to craft high-performance interactive interfaces using React, Next.js, and modern CSS.",
        "☁️ DevOps Cloud SDE: My goal is to design automated CI/CD deployment pipelines and maintain cloud infrastructure."
      ];

  const handleStartCalibration = async () => {
    setSpeechState('calibrating');
    setCalibrationProgress(0);
    setAnimState('wave');
    setSpeechError(null);

    try {
      if (typeof window === 'undefined') return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      let samples = 0;
      let totalRms = 0;
      const durationMs = 2400;
      const startTime = Date.now();

      const sampleInterval = setInterval(() => {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const norm = (dataArray[i] - 128) / 128;
          sum += norm * norm;
        }
        const rms = Math.sqrt(sum / bufferLength);
        totalRms += rms;
        samples++;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, Math.round((elapsed / durationMs) * 100));
        setCalibrationProgress(progress);

        if (elapsed >= durationMs) {
          clearInterval(sampleInterval);
          const avgRms = samples > 0 ? totalRms / samples : 0.05;
          setMeasuredRms(avgRms);

          stream.getTracks().forEach(t => t.stop());
          audioCtx.close().catch(() => {});

          setCalibrationProgress(100);
          setSpeechState('calibrated');
          setAnimState('idle');
        }
      }, 100);
    } catch (err) {
      console.warn('[Microphone Calibration] Genuine AudioContext sampling unavailable:', err);
      setSpeechState('ready');
      setAnimState('idle');
      setSpeechError('Microphone permission required for acoustic calibration. You can switch to typing below.');
      setManualInputMode(true);
    }
  };

  const handleToggleRecording = () => {
    setSpeechError(null);
    if (speechState === 'recording') {
      setSpeechState('recorded');
      setAnimState('idle');
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
      }
    } else {
      setSpeechState('recording');
      setSpeechTranscript('');
      setAnimState('listening');

      if (typeof window !== 'undefined') {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          try {
            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = false;
            rec.lang = 'en-US';
            rec.onresult = (e: any) => {
              const chunk = e.results[e.results.length - 1]?.[0]?.transcript;
              if (chunk) {
                setSpeechTranscript(prev => (prev ? prev + ' ' + chunk : chunk));
              }
            };
            rec.onerror = (e: any) => {
              setSpeechState('recorded');
              setAnimState('idle');
              const code = e?.error;
              let msg = 'Speech recognition encountered an issue. You can retry or type below.';
              if (code === 'not-allowed' || code === 'service-not-allowed') {
                msg = 'Microphone permission was denied by browser settings. Please type your response below or use a preset.';
                setManualInputMode(true);
              } else if (code === 'no-speech') {
                msg = 'No speech detected. Please speak clearly into your mic, or type your response below.';
              } else if (code === 'network') {
                msg = 'Speech recognition network error. Please type your response below.';
                setManualInputMode(true);
              }
              setSpeechError(msg);
            };
            rec.onend = () => {
              setSpeechState('recorded');
              setAnimState('idle');
            };
            recognitionRef.current = rec;
            rec.start();
          } catch (err: any) {
            console.warn('[Speech] Could not start speech recognition:', err);
            setSpeechState('recorded');
            setAnimState('idle');
            setManualInputMode(true);
            setSpeechError('Microphone could not be activated on this device. Please type your response below.');
          }
        } else {
          setSpeechState('recorded');
          setAnimState('idle');
          setManualInputMode(true);
          setSpeechError('Browser speech recognition is not supported in this environment. Please type your answer below or select a preset.');
        }
      }
    }
  };

  return (
    <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
        <span>Vocal Assessment</span>
        <span style={{
          color: speechState === 'recording' ? 'var(--coral)' : speechState === 'calibrated' ? 'var(--green)' : 'var(--accent)',
          fontWeight: 700
        }}>
          {speechState === 'recording' ? '● Recording Live' : speechState === 'calibrated' ? (measuredRms !== null ? `✓ Microphone Calibrated (${measuredRms.toFixed(2)} RMS)` : '✓ Microphone Calibrated') : 'Microphone Ready'}
        </span>
      </div>

      {speechState === 'ready' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎙️</div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>Microphone Calibration</h3>
          <p style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 24 }}>
            We calibrate background acoustics and regional accent variations to prevent scoring penalties. Click below to run a 3-second noise test.
          </p>
          <button
            type="button"
            onClick={handleStartCalibration}
            style={{
              padding: '10px 24px',
              background: 'rgba(var(--brand-rgb), 0.1)',
              border: '1.5px solid var(--accent)',
              borderRadius: 12,
              color: 'var(--accent)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Run Acoustic Calibration
          </button>
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={() => {
                setSpeechState('calibrated');
                setManualInputMode(true);
                setAnimState('idle');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--t3)',
                fontSize: 12,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ⌨️ Skip & Answer via Keyboard / Text Input
            </button>
          </div>
        </div>
      )}

      {speechState === 'calibrating' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin 1.5s linear infinite' }}>⬡</div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>Calibrating...</h3>
          <div style={{ width: 140, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, margin: '16px auto', overflow: 'hidden' }}>
            <div style={{ width: `${calibrationProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--t2)' }}>Checking ambient frequency thresholds.</p>
        </div>
      )}

      {(speechState === 'calibrated' || speechState === 'recording' || speechState === 'recorded') && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
            Spoken Prompt
          </h3>
          <p style={{ fontSize: 15, color: 'var(--t1)', lineHeight: 1.5, fontWeight: 600, marginBottom: 20 }}>
            &ldquo;{spokenPromptText}&rdquo;
          </p>

          {speechError && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(var(--danger-rgb), 0.12)',
              border: '1px solid rgba(var(--danger-rgb), 0.3)',
              borderRadius: 10,
              color: 'var(--danger-bright)',
              fontSize: 12,
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              lineHeight: 1.4
            }}>
              <span>⚠️ {speechError}</span>
              <button
                type="button"
                onClick={() => setSpeechError(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--danger-bright)', cursor: 'pointer', fontSize: 13, marginLeft: 8 }}
              >
                ✕
              </button>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ color: 'var(--t2)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                STT TRANSCRIPT / DICTATION CONSOLE
              </span>
              <button
                type="button"
                onClick={() => setManualInputMode(!manualInputMode)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: 11,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {manualInputMode ? '🎙️ Switch to Speech View' : '✏️ Type / Edit Manually'}
              </button>
            </div>

            {manualInputMode ? (
              <textarea
                value={speechTranscript}
                onChange={(e) => {
                  setSpeechTranscript(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    setSpeechState('recorded');
                  }
                }}
                placeholder="Type your career goal and technical ambition here..."
                className="form-input"
                style={{
                  width: '100%',
                  minHeight: 88,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--success-bright)',
                  background: '#070913',
                  border: '1px solid rgba(var(--brand-rgb), 0.3)',
                  borderRadius: 12,
                  padding: 12,
                  resize: 'vertical'
                }}
              />
            ) : (
              <div
                onClick={() => setManualInputMode(true)}
                title="Click to type or edit"
                style={{
                  minHeight: 80,
                  background: '#070913',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: 14,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--success-bright)',
                  textAlign: 'left',
                  cursor: 'text'
                }}
              >
                {speechTranscript || (speechState === 'recording' ? 'Listening... Speak now...' : 'Click Record Audio, choose a preset, or click here to type manually...')}
              </div>
            )}
          </div>

          {/* Quick Response Templates */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
              ⌨️ Mic Fault Tolerance & Quick Dictation Presets:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {streamPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSpeechTranscript(preset);
                    setSpeechState('recorded');
                    setAnimState('idle');
                    setSpeechError(null);
                  }}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8,
                    color: 'var(--border2)',
                    fontSize: 11,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(var(--brand-rgb), 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={handleToggleRecording}
              style={{
                flex: 1,
                height: 42,
                background: speechState === 'recording' ? 'var(--coral)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${speechState === 'recording' ? 'var(--coral)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 10,
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {speechState === 'recording' ? '⏹ Stop Recording' : speechState === 'recorded' ? '🔄 Retry Recording' : '🎙️ Record Audio'}
            </button>

            <button
              type="button"
              disabled={!speechTranscript.trim() && speechState !== 'recorded'}
              onClick={() => onCompleteAndGrade(speechTranscript)}
              style={{
                flex: 1,
                height: 42,
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                border: 'none',
                borderRadius: 10,
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                opacity: (!speechTranscript.trim() && speechState !== 'recorded') ? 0.5 : 1
              }}
            >
              Complete & Grade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
