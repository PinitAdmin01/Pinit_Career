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
  currentCodingProb: {
    title: string;
    description: string;
    starterCode: string;
    testCases?: Array<{ name?: string; tier?: string; tierLabel?: string; input?: string; expectedOutput?: string }>;
  };
  testOutcomes?: Array<{ index: number; testCaseName?: string; passed: boolean; expectedOutput: string; actualOutput?: string; error?: string }>;
  onProceed: () => void;
  onReviewSolution: () => void;
  onRetryChallenge: () => void;
  canProceed: boolean;
  codeSubmitted: boolean;
  codeRunFailed: boolean;
  codeReviewStarted: boolean;
  codeReviewQuestionReady: boolean;
  isSendingInterviewMessage: boolean;
  lastInterviewerSpeech: string;
  manualTextInput: string;
  setManualTextInput: (value: string) => void;
  onSendMessage: (value: string) => void;
  selectedLang: 'python' | 'javascript' | 'java' | 'sql' | 'cpp';
  setSelectedLang: (lang: 'python' | 'javascript' | 'java' | 'sql' | 'cpp') => void;
  runCodeAndTests: () => void;
  isRunning: boolean;
  codeContent: string;
  setCodeContent: (val: string) => void;
  codeModifiedRef: React.MutableRefObject<boolean>;
  activeTeacher: { id: string; name: string; emoji: string; title: string };
  animState: AnimState;
  terminalLogs: string[];
  setTerminalLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Round2Coding: React.FC<Round2CodingProps> = ({
  domainStream,
  currentCodingProb,
  testOutcomes,
  onProceed,
  onReviewSolution,
  onRetryChallenge,
  canProceed,
  codeSubmitted,
  codeRunFailed,
  codeReviewStarted,
  codeReviewQuestionReady,
  isSendingInterviewMessage,
  lastInterviewerSpeech,
  manualTextInput,
  setManualTextInput,
  onSendMessage,
  selectedLang,
  setSelectedLang,
  runCodeAndTests,
  isRunning,
  codeContent,
  setCodeContent,
  codeModifiedRef,
  activeTeacher,
  animState,
  terminalLogs,
  setTerminalLogs,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isRunning && !isSendingInterviewMessage) {
          e.preventDefault();
          runCodeAndTests();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, isSendingInterviewMessage, runCodeAndTests]);

  return (
    <div className="iv-round-layout iv-round2-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 16, alignItems: 'stretch' }}>
      {/* Left 70%: Code Workspace with Monaco Editor */}
      <div className="iv-panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--pink)' }}>ROUND 2 OF 4</span>
            <h2 style={{ fontSize: 15.5, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
              {domainStream === 'non_tech' ? 'Case Study & Analytics:' : 'Technical Problem:'} {currentCodingProb.title}
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: '4px 0 0', lineHeight: 1.4 }}>
              {currentCodingProb.description}
            </p>
            {/* 5-Tier Boundary Testing Status Strip */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', letterSpacing: '0.5px' }}>5-TIER BATTERY:</span>
              {(() => {
                const defaultTiers = [
                  { label: 'T1: Standard', name: 'Standard Case' },
                  { label: 'T2: Scale', name: 'Scale / Burst' },
                  { label: 'T3: Zero/Empty', name: 'Zero / Empty' },
                  { label: 'T4: Edge/Negative', name: 'Edge Case' },
                  { label: 'T5: Complexity', name: 'Complexity Bounds' }
                ];
                const tiers = (currentCodingProb.testCases && currentCodingProb.testCases.length >= 5)
                  ? currentCodingProb.testCases.map((tc, i) => ({
                      label: tc.tierLabel || defaultTiers[i]?.label || `T${i + 1}`,
                      name: tc.name || defaultTiers[i]?.name || `Test ${i + 1}`
                    }))
                  : defaultTiers;

                return tiers.map((t, idx) => {
                  const outcome = testOutcomes && testOutcomes[idx];
                  const isPassed = outcome?.passed === true;
                  const isFailed = outcome && outcome.passed === false;
                  return (
                    <div
                      key={idx}
                      title={outcome ? (isPassed ? `${t.name}: Passed` : `${t.name}: Failed`) : `${t.name}: Pending execution`}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 10.5,
                        fontWeight: 700,
                        background: isPassed ? 'rgba(34, 197, 94, 0.15)' : isFailed ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg3)',
                        color: isPassed ? 'var(--success-bright)' : isFailed ? 'var(--red)' : 'var(--t2)',
                        border: isPassed ? '1px solid rgba(34, 197, 94, 0.4)' : isFailed ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <span>{isPassed ? '✅' : isFailed ? '❌' : '⚪'}</span>
                      <span>{t.label}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {canProceed ? <button onClick={onProceed} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
              Continue to architecture ➔
            </button> : codeRunFailed ? (
              <button onClick={onRetryChallenge} style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', color: 'var(--amber-mid)', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                Try a different challenge
              </button>
            ) : codeSubmitted && (
              <button onClick={onReviewSolution} disabled={isSendingInterviewMessage || codeReviewStarted} style={{ background: 'var(--accent)', border: 'none', color: 'var(--text)', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 800, cursor: isSendingInterviewMessage || codeReviewStarted ? 'wait' : 'pointer', opacity: isSendingInterviewMessage || codeReviewStarted ? 0.7 : 1 }}>
                {isSendingInterviewMessage || codeReviewStarted ? 'Waiting for interviewer…' : 'Submit solution for review'}
              </button>
            )}
          </div>
        </div>

        <div
          data-testid="round2-progress-banner"
          style={{
            background: canProceed || (codeSubmitted && !codeRunFailed)
              ? 'rgba(var(--success-rgb),0.12)'
              : codeRunFailed
              ? 'rgba(245, 158, 11, 0.12)'
              : 'rgba(var(--brand-rgb),0.08)',
            border: canProceed || (codeSubmitted && !codeRunFailed)
              ? '1px solid var(--success)'
              : codeRunFailed
              ? '1px solid rgba(245, 158, 11, 0.45)'
              : '1px solid rgba(var(--brand-rgb),0.22)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--t1)'
          }}
        >
          {canProceed
            ? '✅ Code & Review Defense Verified — Click "Continue to architecture ➔" above!'
            : codeRunFailed
            ? '⚠️ The interviewer wants stronger reasoning or all 5 boundary tiers passing. Refine your solution or try a different challenge.'
            : codeSubmitted && codeReviewQuestionReady
            ? `💬 Step 2 of 2: Answer ${activeTeacher.name}'s code review question in the Interviewer panel on the right to unlock Round 3.`
            : codeSubmitted && codeReviewStarted
            ? `⏳ Submitting solution to ${activeTeacher.name} for code review...`
            : codeSubmitted
            ? '✅ Step 1 of 2 Complete: All 5 boundary tiers passed! Click "Submit solution for review" above so the interviewer can ask about your approach.'
            : '🧪 Step 1 of 2: Implement your solution and pass all 5 boundary test tiers (Ctrl+↵), then defend your approach in code review.'}
        </div>

        {/* Language Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['python', 'javascript', 'java', 'cpp', 'sql'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 800,
                  background: selectedLang === lang ? 'var(--accent)' : 'var(--bg3)',
                  color: selectedLang === lang ? 'var(--text)' : 'var(--t2)', border: 'none', cursor: 'pointer'
                }}
              >
                {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={runCodeAndTests}
            disabled={isRunning || isSendingInterviewMessage}
            title="Run Code & Tests (Ctrl+Enter / ⌘+Enter)"
            style={{ background: 'var(--green)', border: 'none', borderRadius: 8, padding: '7px 16px', color: 'var(--text)', fontWeight: 900, fontSize: 12.5, cursor: 'pointer' }}
          >
            {isRunning ? 'Executing...' : (domainStream === 'non_tech' ? 'Run Calculation (Ctrl+↵)' : '▶️ Run Code & Tests (Ctrl+↵)')}
          </button>
        </div>

        {/* Full Monaco Code Editor Area */}
        <div style={{ height: 340, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <MonacoEditor
            height="100%"
            language={selectedLang === 'sql' ? 'sql' : selectedLang === 'python' ? 'python' : selectedLang === 'java' ? 'java' : selectedLang === 'cpp' ? 'cpp' : 'javascript'}
            theme="vs-dark"
            value={codeContent}
            onMount={(editor: any, monaco: any) => {
              if (editor && monaco) {
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                  if (!isRunning && !isSendingInterviewMessage) {
                    runCodeAndTests();
                  }
                });
              }
            }}
            onChange={(val) => {
              setCodeContent(val || '');
              codeModifiedRef.current = true; // IV-03: candidate has typed — never overwrite their work
            }}
            options={{
              fontSize: 14,
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
          <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.65)', color: 'var(--text)', fontSize: 11, fontWeight: 800 }}>
            {activeTeacher.emoji} {activeTeacher.name}
          </div>
        </div>

        <div className="iv-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }} aria-live="polite">
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Interviewer</div>
          <div style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.45 }}>{lastInterviewerSpeech}</div>
          {codeReviewQuestionReady && !canProceed && !codeRunFailed && (
            <form onSubmit={(event) => {
              event.preventDefault();
              const answer = manualTextInput.trim();
              if (!answer || isSendingInterviewMessage) return;
              setManualTextInput('');
              onSendMessage(answer);
            }} style={{ display: 'flex', gap: 6 }}>
              <input
                value={manualTextInput}
                onChange={(event) => setManualTextInput(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                    event.preventDefault();
                    const answer = manualTextInput.trim();
                    if (!answer || isSendingInterviewMessage) return;
                    setManualTextInput('');
                    onSendMessage(answer);
                  }
                }}
                disabled={isSendingInterviewMessage}
                aria-label="Your code review answer"
                placeholder="Explain your approach or answer the reviewer… (Enter or Ctrl+↵ to send)"
                style={{ flex: 1, minWidth: 0, padding: '8px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 12 }}
              />
              <button type="submit" disabled={!manualTextInput.trim() || isSendingInterviewMessage} style={{ padding: '8px 10px', borderRadius: 7, border: 0, background: 'var(--accent)', color: 'var(--text)', fontSize: 11, fontWeight: 800, cursor: isSendingInterviewMessage ? 'wait' : 'pointer' }}>
                {isSendingInterviewMessage ? 'Sending…' : 'Send'}
              </button>
            </form>
          )}
        </div>

        <div style={{ flex: 1, background: '#020617', borderRadius: 14, border: '1px solid var(--border)', padding: 12, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>EXECUTION CONSOLE</div>
            <button
              onClick={() => {
                console.log('[Interview] Terminal console cleared by candidate.');
                setTerminalLogs([]);
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 10.5,
                color: 'var(--t3)',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--success-bright)', overflowY: 'auto', maxHeight: 160 }}>
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
