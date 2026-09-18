'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 360, background: '#090d16', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
        Loading Monaco Code Engine...
      </div>
    )
  }
);

export interface Round2CodingProps {
  domainStream: 'tech' | 'non_tech';
  currentCodingProb: { title: string; description: string; starterCode: string };
  showHint: boolean;
  setShowHint: React.Dispatch<React.SetStateAction<boolean>>;
  onProceed: () => void;
  selectedLang: 'python' | 'javascript' | 'java' | 'sql';
  setSelectedLang: (lang: 'python' | 'javascript' | 'java' | 'sql') => void;
  runCodeAndTests: () => void;
  isRunning: boolean;
  codeContent: string;
  setCodeContent: (val: string) => void;
  codeModifiedRef: React.MutableRefObject<boolean>;
  activeTeacher: { id: string; name: string; emoji: string; title: string };
  animState: AnimState;
  isVoiceListening: boolean;
  startVoiceListening: () => void;
  terminalLogs: string[];
  setTerminalLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Round2Coding: React.FC<Round2CodingProps> = ({
  domainStream,
  currentCodingProb,
  showHint,
  setShowHint,
  onProceed,
  selectedLang,
  setSelectedLang,
  runCodeAndTests,
  isRunning,
  codeContent,
  setCodeContent,
  codeModifiedRef,
  activeTeacher,
  animState,
  isVoiceListening,
  startVoiceListening,
  terminalLogs,
  setTerminalLogs,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 16, alignItems: 'stretch' }}>
      {/* Left 70%: Code Workspace with Monaco Editor */}
      <div className="iv-panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--pink)' }}>ROUND 2 OF 4</span>
            <h2 style={{ fontSize: 14, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
              {domainStream === 'non_tech' ? 'Case Study & Analytics:' : 'Technical Problem:'} {currentCodingProb.title}
            </h2>
            <p style={{ fontSize: 11.5, color: 'var(--t2)', margin: '4px 0 0', lineHeight: 1.4 }}>
              {currentCodingProb.description}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setShowHint(h => !h)}
              style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', color: 'var(--amber-mid)', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
            >
              💡 {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            <button onClick={onProceed} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>
              Proceed to Round 3 ➔
            </button>
          </div>
        </div>

        {showHint && (
          <div style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', borderRadius: 8, padding: '8px 12px', fontSize: 11.5, color: 'var(--t1)' }}>
            💡 Hint: Focus on time/space complexity and verifying numerical boundary cases.
          </div>
        )}

        {/* Language Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['python', 'javascript', 'java', 'sql'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 800,
                  background: selectedLang === lang ? 'var(--accent)' : 'var(--bg3)',
                  color: selectedLang === lang ? 'var(--text)' : 'var(--t2)', border: 'none', cursor: 'pointer'
                }}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={runCodeAndTests}
            style={{ background: 'var(--green)', border: 'none', borderRadius: 8, padding: '7px 16px', color: 'var(--text)', fontWeight: 900, fontSize: 11.5, cursor: 'pointer' }}
          >
            {isRunning ? 'Executing...' : (domainStream === 'non_tech' ? '📊 Execute Business Calculation' : '▶️ Run Code & Tests')}
          </button>
        </div>

        {/* Full Monaco Code Editor Area */}
        <div style={{ height: 340, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <MonacoEditor
            height="100%"
            language={selectedLang === 'sql' ? 'sql' : selectedLang === 'python' ? 'python' : selectedLang === 'java' ? 'java' : 'javascript'}
            theme="vs-dark"
            value={codeContent}
            onChange={(val) => {
              setCodeContent(val || '');
              codeModifiedRef.current = true; // IV-03: candidate has typed — never overwrite their work
            }}
            options={{
              fontSize: 12.5,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              tabSize: 2,
              automaticLayout: true
            }}
          />
        </div>
      </div>

      {/* Right 30%: Avatar Viewport & Execution Terminal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 180, background: 'var(--bg3)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
          <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />
          <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.65)', color: 'var(--text)', fontSize: 10, fontWeight: 800 }}>
            {activeTeacher.emoji} {activeTeacher.name}
          </div>
        </div>

        <button
          onClick={startVoiceListening}
          style={{
            width: '100%',
            background: isVoiceListening ? 'var(--danger)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
            border: 'none', color: 'var(--text)', borderRadius: 10, padding: '9px 12px', fontSize: 11.5, fontWeight: 900, cursor: 'pointer',
            boxShadow: isVoiceListening ? '0 0 12px rgba(var(--danger-rgb),0.7)' : 'var(--shadow-sm)'
          }}
        >
          {isVoiceListening ? '🎙️ Listening... (Speak Now)' : '🎤 Speak to Interviewer'}
        </button>

        <div style={{ flex: 1, background: '#020617', borderRadius: 14, border: '1px solid var(--border)', padding: 12, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>EXECUTION CONSOLE</div>
            <button
              onClick={() => {
                console.log('[Interview] 🗑️ Terminal console cleared by candidate.');
                setTerminalLogs([]);
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 9.5,
                color: 'var(--t3)',
                cursor: 'pointer'
              }}
            >
              🗑️ Clear
            </button>
          </div>
          <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--success-bright)', overflowY: 'auto', maxHeight: 160 }}>
            {terminalLogs.length > 0 ? (
              terminalLogs.map((l, idx) => <div key={idx} style={{ marginBottom: 4 }}>{l}</div>)
            ) : (
              <div style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>Click &apos;Run Code &amp; Tests&apos; to verify solution...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Round2Coding;
