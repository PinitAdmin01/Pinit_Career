'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { AnimState } from '@/components/avatar/VRoidAvatarEngine';
import type { RoundDefenseState } from '@/lib/interview/roundDefenseEngine';
import { AssistModeDrawer } from './AssistModeDrawer';
import { DefenseProgressStrip } from './DefenseProgressStrip';

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
  defenseState?: RoundDefenseState | null;
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
  isAssistModeActive?: boolean;
  setIsAssistModeActive?: React.Dispatch<React.SetStateAction<boolean>>;
  assistData?: any;
  isFetchingAssist?: boolean;
  assistTab?: 'script' | 'bullets' | 'delivery';
  setAssistTab?: React.Dispatch<React.SetStateAction<'script' | 'bullets' | 'delivery'>>;
  assistScriptLevel?: 'standard' | 'advanced';
  setAssistScriptLevel?: React.Dispatch<React.SetStateAction<'standard' | 'advanced'>>;
  fetchAssistScript?: (q: string) => void;
  liveSpeechTranscript?: string;
  messages?: any[];
  difficulty?: string;
  speakWithAvatarRaw?: any;
  setAnimState?: (state: 'idle' | 'talking' | 'thinking') => void;
  /** Optional custom labels so Proof Vault Defense can reuse Round2Coding cleanly without duplicating Monaco/Runner UI */
  stageBadgeLabel?: string;
  proceedLabel?: string;
  reviewLabel?: string;
  skipLabel?: string;
  bannerOverride?: string;
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
  defenseState,
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
  isAssistModeActive = false,
  setIsAssistModeActive,
  assistData,
  isFetchingAssist = false,
  assistTab = 'script',
  setAssistTab,
  assistScriptLevel = 'standard',
  setAssistScriptLevel,
  fetchAssistScript,
  liveSpeechTranscript = '',
  messages = [],
  difficulty = 'normal',
  speakWithAvatarRaw,
  setAnimState,
  stageBadgeLabel,
  proceedLabel,
  reviewLabel,
  skipLabel,
  bannerOverride,
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
            <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--pink)' }}>{stageBadgeLabel || 'ROUND 2 OF 4'}</span>
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
                {proceedLabel || 'Continue to architecture ➔'}
              </button>
            ) : codeRunFailed ? (
              <button onClick={onRetryChallenge} style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', color: 'var(--amber-mid)', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                Try a different challenge
              </button>
            ) : codeSubmitted && (
              <button onClick={onReviewSolution} disabled={isSendingInterviewMessage || codeReviewStarted} className="iv-btn-primary" style={{ borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: isSendingInterviewMessage || codeReviewStarted ? 'wait' : 'pointer', opacity: isSendingInterviewMessage || codeReviewStarted ? 0.7 : 1 }}>
                {isSendingInterviewMessage || codeReviewStarted ? 'Waiting for interviewer…' : (reviewLabel || 'Submit solution for review')}
              </button>
            )}
            {!canProceed && defenseState?.status !== 'eliminated' && onSkipChallenge && (
              <button
                type="button"
                data-testid="round2-skip-challenge-btn"
                onClick={onSkipChallenge}
                title="Skip this coding challenge"
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
                {skipLabel || '⏭ Skip Challenge'}
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
            color: 'var(--t1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap'
          }}
        >
          <span style={{ flex: 1, minWidth: 200 }}>
            {bannerOverride
              ? bannerOverride
              : defenseState?.status === 'eliminated'
              ? `⛔ Defense Concluded (${defenseState.passedCount}/${defenseState.totalQuestions} cleared) — You did not qualify for Round 3. Generating final scorecard…`
              : canProceed
              ? `✅ Code & Defense Cleared (${defenseState?.passedCount ?? 3}/${defenseState?.requiredToPass ?? 3}) — Click "Continue to architecture ➔" to proceed!`
              : codeRunFailed
              ? `⚠️ Some test cases failed. Check the execution output below to see expected vs actual values, refine your logic, or try a different challenge.`
              : codeSubmitted && (codeReviewQuestionReady || defenseState?.status === 'in_progress')
              ? `🎯 Step 2 of 2: Answer Question ${defenseState?.currentQuestionNumber || 1} of ${defenseState?.totalQuestions || 5} from ${activeTeacher.name} in the Interviewer panel. Clear ${defenseState?.requiredToPass || 3} of 5 correctly to unlock Round 3.`
              : codeSubmitted && codeReviewStarted
              ? `⏳ Submitting solution to ${activeTeacher.name} to start the code defense...`
              : codeSubmitted
              ? '✅ Step 1 of 2 Complete: All 5 boundary tiers passed! Submit your solution to start the code defense (3 of 5 correct unlocks Round 3), or try another challenge.'
              : '🧪 Step 1 of 2: Implement your solution and pass all 5 boundary test tiers (Ctrl+↵), then clear 3 of 5 live defense questions to unlock Round 3.'}
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
            {canProceed ? (
              <button
                type="button"
                data-testid="round2-banner-proceed-btn"
                onClick={onProceed}
                className="iv-btn-primary"
                style={{ borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 900 }}
              >
                {proceedLabel || 'Continue to architecture ➔'}
              </button>
            ) : codeSubmitted && !codeRunFailed && !codeReviewStarted && defenseState?.status !== 'in_progress' && defenseState?.status !== 'eliminated' ? (
              <>
                <button
                  type="button"
                  data-testid="round2-banner-submit-btn"
                  onClick={onReviewSolution}
                  disabled={isSendingInterviewMessage}
                  className="iv-btn-primary"
                  style={{ borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 900, cursor: isSendingInterviewMessage ? 'wait' : 'pointer' }}
                >
                  {isSendingInterviewMessage ? 'Starting defense…' : (reviewLabel || '🚀 Submit & Start 5-Q Defense →')}
                </button>
                <button
                  type="button"
                  data-testid="round2-banner-next-challenge-btn"
                  onClick={onRetryChallenge}
                  disabled={isRunning || isSendingInterviewMessage}
                  style={{
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    borderRadius: 8,
                    padding: '7px 12px',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  🔄 Next Challenge
                </button>
              </>
            ) : codeRunFailed ? (
              <button
                type="button"
                data-testid="round2-banner-retry-btn"
                onClick={onRetryChallenge}
                disabled={isRunning}
                style={{
                  background: 'var(--amber-light)',
                  border: '1px solid var(--amber)',
                  color: 'var(--amber-mid)',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🔄 Try a different challenge
              </button>
            ) : null}
          </div>
        </div>

        {/* Language Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
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
            {codeSubmitted && !codeRunFailed && !codeReviewStarted && !canProceed && defenseState?.status !== 'in_progress' && defenseState?.status !== 'eliminated' && (
              <button
                type="button"
                data-testid="round2-toolbar-submit-btn"
                onClick={onReviewSolution}
                disabled={isSendingInterviewMessage}
                className="iv-btn-primary"
                style={{ borderRadius: 8, padding: '7px 14px', fontSize: 12.5, fontWeight: 900 }}
              >
                {reviewLabel || '🚀 Submit & Defend →'}
              </button>
            )}
            {canProceed && (
              <button
                type="button"
                onClick={onProceed}
                className="iv-btn-primary"
                style={{ borderRadius: 8, padding: '7px 14px', fontSize: 12.5, fontWeight: 900 }}
              >
                {proceedLabel || 'Continue ➔'}
              </button>
            )}
          </div>
        </div>

        {/* Full Monaco Code Editor Area */}
        <div style={{ flex: 1, minHeight: 280, height: '100%', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%', minHeight: 0, overflowY: 'auto' }}>
        <div style={{ height: 130, flexShrink: 0, background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
          <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />
          <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '2px 7px', borderRadius: 5, background: 'rgba(10, 14, 26, 0.78)', color: '#f8fafc', fontSize: 10.5, fontWeight: 800 }}>
            {activeTeacher.emoji} {activeTeacher.name}
          </div>
        </div>

        {isAssistModeActive && (
          <div style={{ flexShrink: 0, maxHeight: 180, overflowY: 'auto' }}>
            <AssistModeDrawer
              compact
              isScoredStage={false}
              isCodingRound
              activeStage="round2_coding"
              activeTopicName={currentCodingProb.title}
              questionText={`${currentCodingProb.title}: ${currentCodingProb.description}`}
              isAssistModeActive={isAssistModeActive}
              setIsAssistModeActive={setIsAssistModeActive || (() => {})}
              assistScriptLevel={assistScriptLevel}
              setAssistScriptLevel={setAssistScriptLevel || (() => {})}
              assistTab={assistTab}
              setAssistTab={setAssistTab || (() => {})}
              isFetchingAssist={isFetchingAssist}
              assistData={assistData ?? null}
              liveSpeechTranscript={liveSpeechTranscript}
              messages={messages as any}
              activeTeacher={activeTeacher as any}
              difficulty={difficulty}
              fetchAssistScript={fetchAssistScript || (() => {})}
              speakWithAvatarRaw={speakWithAvatarRaw}
              setAnimState={setAnimState}
            />
          </div>
        )}

        <div className="iv-panel" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, maxHeight: 220, overflowY: 'auto' }} aria-live="polite">
          <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>Interviewer</div>
          <DefenseProgressStrip defenseState={defenseState} />
          <div style={{ fontSize: 12, color: 'var(--t1)', lineHeight: 1.4 }}>{lastInterviewerSpeech}</div>
          {(codeReviewQuestionReady || defenseState?.status === 'in_progress') && !canProceed && !codeRunFailed && defenseState?.status !== 'eliminated' && (
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
                placeholder="Explain your approach… (Ctrl+↵ to send)"
                style={{ flex: 1, minWidth: 0, padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--t1)', fontSize: 11.5 }}
              />
              <button type="submit" disabled={!manualTextInput.trim() || isSendingInterviewMessage} style={{ padding: '6px 10px', borderRadius: 6, border: 0, background: 'var(--accent)', color: '#ffffff', fontSize: 11, fontWeight: 800, cursor: isSendingInterviewMessage ? 'wait' : 'pointer' }}>
                {isSendingInterviewMessage ? '...' : 'Send'}
              </button>
            </form>
          )}
        </div>

        <div style={{ flex: 1, minHeight: 100, background: '#020617', borderRadius: 10, border: '1px solid var(--border)', padding: 10, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>EXECUTION CONSOLE</div>
            <button
              onClick={() => {
                console.log('[Interview] Terminal console cleared by candidate.');
                setTerminalLogs([]);
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 4,
                padding: '1px 5px',
                fontSize: 10,
                color: 'var(--t3)',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--success-bright)', overflowY: 'auto' }}>
            {terminalLogs.length > 0 ? (
              terminalLogs.map((l, idx) => <div key={idx} style={{ marginBottom: 3 }}>{l}</div>)
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
