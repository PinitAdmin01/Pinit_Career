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
  onRequestHint?: (level: 1 | 2 | 3) => void;
  onSkipChallenge?: () => void;
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
  onRequestHint,
  onSkipChallenge,
}) => {
  const [hintLevel, setHintLevel] = React.useState<0 | 1 | 2 | 3>(0);
  const runCodeAndTestsRef = React.useRef(runCodeAndTests);
  runCodeAndTestsRef.current = runCodeAndTests;
  const isRunningRef = React.useRef(isRunning);
  isRunningRef.current = isRunning;
  const isSendingRef = React.useRef(isSendingInterviewMessage);
  isSendingRef.current = isSendingInterviewMessage;

  React.useEffect(() => {
    setHintLevel(0);
  }, [currentCodingProb.title]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const target = e.target as HTMLElement | null;
        const isFormInputOutsideMonaco = Boolean(
          target &&
          (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') &&
          !target.closest('.monaco-editor')
        );
        if (isFormInputOutsideMonaco) return;
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
    <div className="iv-round-layout iv-round2-layout iv-stage-viewport" style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 12, alignItems: 'stretch' }}>
      {/* Left 70%: Code Workspace with Monaco Editor */}
      <div className="iv-panel" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, height: '100%', minHeight: 0, overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--pink)' }}>ROUND 2 OF 4</span>
            <h2 style={{ fontSize: 15.5, fontWeight: 900, margin: 0, color: 'var(--t1)' }}>
              {domainStream === 'non_tech' ? 'Case Study & Analytics:' : 'Technical Problem:'} {currentCodingProb.title}
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: '4px 0 0', lineHeight: 1.4 }}>
              {currentCodingProb.description}
            </p>
            {/* Friendly Test Case Results */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t3)', letterSpacing: '0.5px' }}>
                TEST CASES {testOutcomes ? `(${testOutcomes.filter(o => o.passed).length}/5 Passed):` : ':'}
              </span>
              {(() => {
                const defaultTiers = [
                  { label: '1. Standard Case', name: 'Standard Case' },
                  { label: '2. Large Scale', name: 'Scale / Burst' },
                  { label: '3. Zero/Empty', name: 'Zero / Empty' },
                  { label: '4. Edge Values', name: 'Edge Case' },
                  { label: '5. Complexity', name: 'Complexity Bounds' }
                ];
                const tiers = (currentCodingProb.testCases && currentCodingProb.testCases.length >= 5)
                  ? currentCodingProb.testCases.map((tc, i) => ({
                      label: tc.tierLabel ? `${i + 1}. ${tc.tierLabel.replace(/^T\d+:\s*/, '')}` : defaultTiers[i]?.label || `Test ${i + 1}`,
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
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {canProceed ? (
              <button onClick={onProceed} className="iv-btn-primary" style={{ borderRadius: 8, padding: '7px 14px', fontSize: 12 }}>
                Continue to architecture ➔
              </button>
            ) : codeRunFailed ? (
              <button onClick={onRetryChallenge} style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', color: 'var(--amber-mid)', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                Try a different challenge
              </button>
            ) : codeSubmitted && (
              <button onClick={onReviewSolution} disabled={isSendingInterviewMessage || codeReviewStarted} className="iv-btn-primary" style={{ borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: isSendingInterviewMessage || codeReviewStarted ? 'wait' : 'pointer', opacity: isSendingInterviewMessage || codeReviewStarted ? 0.7 : 1 }}>
                {isSendingInterviewMessage || codeReviewStarted ? 'Waiting for interviewer…' : 'Submit solution for review'}
              </button>
            )}
            {!canProceed && onSkipChallenge && (
              <button
                type="button"
                data-testid="round2-skip-challenge-btn"
                onClick={onSkipChallenge}
                title="Skip this coding challenge (allows advancing to Round 3 with a skip recorded)"
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--t2)',
                  borderRadius: 8,
                  padding: '7px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ⏭ Skip Challenge
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
            ? '✅ Code Verified & Approved — Click "Continue to architecture ➔" above to proceed!'
            : codeRunFailed
            ? `⚠️ Some test cases failed. Check the execution output below to see expected vs actual values, refine your logic, or click "Skip Challenge" to move on.`
            : codeSubmitted && codeReviewQuestionReady
            ? `💬 Step 2 of 2: Answer ${activeTeacher.name}'s code review question in the Interviewer panel on the right to unlock Round 3.`
            : codeSubmitted && codeReviewStarted
            ? `⏳ Submitting solution to ${activeTeacher.name} for code review...`
            : codeSubmitted
            ? '✅ Step 1 of 2 Complete: All test cases passed! Click "Submit solution for review" above so the interviewer can ask about your approach.'
            : '🧪 Step 1 of 2: Write your solution and pass all test cases (Ctrl+↵), then defend your approach in code review.'}
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
                  color: selectedLang === lang ? '#ffffff' : 'var(--t2)', border: selectedLang === lang ? 'none' : '1px solid var(--border)', cursor: 'pointer'
                }}
              >
                {lang === 'cpp' ? 'C++' : lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {onRequestHint && (
              <button
                data-testid="coding-hint-btn"
                type="button"
                disabled={isSendingInterviewMessage || hintLevel >= 3}
                onClick={() => {
                  const next = Math.min(3, hintLevel + 1) as 1 | 2 | 3;
                  setHintLevel(next);
                  onRequestHint(next);
                }}
                title={
                  hintLevel === 0
                    ? 'Tier 1: Ask for subtle structural direction'
                    : hintLevel === 1
                    ? 'Tier 2: Ask for complexity / data-structure hint'
                    : hintLevel === 2
                    ? 'Tier 3: Ask for invariant / edge-case walkthrough'
                    : 'All 3 hint tiers used'
                }
                style={{
                  background: 'rgba(var(--reward-rgb), 0.14)',
                  border: '1px solid var(--reward)',
                  borderRadius: 8,
                  padding: '7px 12px',
                  color: 'var(--reward-bright)',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: hintLevel >= 3 || isSendingInterviewMessage ? 'not-allowed' : 'pointer',
                  opacity: hintLevel >= 3 ? 0.55 : 1
                }}
              >
                💡 {hintLevel >= 3 ? 'Hints (3/3)' : `Hint (${hintLevel}/3)`}
              </button>
            )}
            <button
              onClick={runCodeAndTests}
              disabled={isRunning || isSendingInterviewMessage}
              title="Run Code & Tests (Ctrl+Enter / ⌘+Enter)"
              className="iv-btn-success"
              style={{ borderRadius: 8, padding: '7px 16px', fontSize: 12.5 }}
            >
              {isRunning ? 'Executing...' : (domainStream === 'non_tech' ? 'Run Calculation (Ctrl+↵)' : '▶️ Run Code & Tests (Ctrl+↵)')}
            </button>
          </div>
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
                  if (!isRunningRef.current && !isSendingRef.current) {
                    runCodeAndTestsRef.current();
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', minHeight: 0, overflow: 'hidden' }}>
        <div style={{ height: 160, flexShrink: 0, background: 'var(--bg3)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
          <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />
          <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 6, background: 'rgba(10, 14, 26, 0.78)', color: '#f8fafc', fontSize: 11, fontWeight: 800 }}>
            {activeTeacher.emoji} {activeTeacher.name}
          </div>
        </div>

        <div className="iv-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, overflowY: 'auto' }} aria-live="polite">
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
              <button type="submit" disabled={!manualTextInput.trim() || isSendingInterviewMessage} style={{ padding: '8px 10px', borderRadius: 7, border: 0, background: 'var(--accent)', color: '#ffffff', fontSize: 11, fontWeight: 800, cursor: isSendingInterviewMessage ? 'wait' : 'pointer' }}>
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
