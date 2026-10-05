import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { toast } from '@/lib/store/useAppStore';
import { speakWithAvatar } from '@/lib/tts';
import { CONCEPT_ANALOGIES_REGISTRY, findConceptAnalogy } from '@/lib/data/conceptAnalogies';
import { LessonCodeEditor } from './LessonCodeEditor';
import { LessonQuizBlock } from './LessonQuizBlock';
import { VisualStage } from './visuals';
import { TeacherAvatarFrame } from './TeacherAvatarFrame';
import type { LessonVisual } from '@/lib/types/lessonVisual';

interface LessonContentRendererProps {
  userId: string;
  teacherId: string;
  teacher: any;
  questId: string;
  questData: any;
  currentSlide: number;
  slides: any[];
  slidesLoading: boolean;
  syllabus: string[];
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  latestAIResponse: string;
  getSpeakerText: () => string;
  isInteractive: boolean;
  setIsInteractive: (interactive: boolean) => void;
  chatMessages: { role: 'user' | 'assistant'; content: string }[];
  setChatMessages: React.Dispatch<React.SetStateAction<{ role: 'user' | 'assistant'; content: string }[]>>;
  chatLoading: boolean;
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
  chatBottomRef: any;
  isRecording: boolean;
  startVoiceInput: () => void;
  sendInteractiveMessage: (text?: string) => Promise<void>;
  understandingConfirmed: Record<number, boolean>;
  setUnderstandingConfirmed: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  handleNextSlide: () => void;
  codeRunning: Record<number, boolean>;
  codeOutputs: Record<number, string>;
  simulateCodeRun: (slideIdx: number, mockOutput?: string) => void;
  isLastSlide: boolean;
  examPassed: boolean;
  examFailed: boolean;
  setExamFailed: (val: boolean) => void;
  examCorrectCount: number;
  setExamCorrectCount: React.Dispatch<React.SetStateAction<number>>;
  setExamAnswers: React.Dispatch<React.SetStateAction<(number | null)[]>>;
  onReviewLesson: () => void;
  runSlideCode?: (slideIdx: number, rawCode?: string) => void;
  examQuestionIndex: number;
  setExamQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedMcqAnswer: number | null;
  setSelectedMcqAnswer: (val: number | null) => void;
  mcqChecked: boolean;
  setMcqChecked: (val: boolean) => void;
  mcqIsCorrect: boolean;
  setMcqIsCorrect: (val: boolean) => void;
  setExamPassed: (val: boolean) => void;
  playChime: () => void;
  launchConfetti: () => void;
  /** Questions of a course test; normal lessons use their slides' questions. */
  quizQuestions?: Array<{ question: string; options: string[]; answerIndex: number; explanation: string }> | null;
  currentVisualStepIndex?: number;
  isManualOverride?: boolean;
  onVisualStepChange?: (newStepIndex: number, manual: boolean) => void;
  onSyncWithVoice?: () => void;
}

function getTappableLabelsForVisual(visual?: LessonVisual | null): string[] {
  if (!visual) return [];
  if (visual.template === 'flow') {
    return visual.nodes.filter(n => n.tappable !== false).map(n => n.label);
  }
  if (visual.template === 'boxes') {
    return visual.boxes.filter(b => b.tappable !== false).map(b => b.label);
  }
  if (visual.template === 'compare') {
    return [visual.leftLabel, visual.rightLabel].filter(Boolean);
  }
  if (visual.template === 'table') {
    return visual.columns.filter(c => Boolean(c));
  }
  return [];
}

function renderWithTappableWords(
  text: string,
  labels: string[],
  highlightedLabel: string | null,
  onWordClick: (label: string) => void,
  onWordHover?: (label: string | null) => void
): React.ReactNode {
  if (!text || !labels || labels.length === 0) return text;

  const validLabels = labels.filter(l => Boolean(l && l.trim()));
  if (validLabels.length === 0) return text;

  const sortedLabels = [...validLabels].sort((a, b) => b.length - a.length);
  const pattern = sortedLabels.map(l => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

  const parts = text.split(regex);
  if (parts.length <= 1) return text;

  return parts.map((part, idx) => {
    const matchedLabel = validLabels.find(l => l.toLowerCase() === part.toLowerCase());
    if (!matchedLabel) {
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    }

    const isHighlighted = highlightedLabel && highlightedLabel.toLowerCase() === matchedLabel.toLowerCase();

    return (
      <button
        key={idx}
        type="button"
        data-testid={`tappable-word-${matchedLabel.toLowerCase()}`}
        onClick={(e) => {
          e.stopPropagation();
          onWordClick(matchedLabel);
        }}
        onMouseEnter={() => onWordHover && onWordHover(matchedLabel)}
        onMouseLeave={() => onWordHover && onWordHover(null)}
        style={{
          display: 'inline',
          background: isHighlighted ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
          border: 'none',
          borderBottom: isHighlighted ? '2px solid var(--accent)' : '1px dashed var(--accent)',
          color: isHighlighted ? 'var(--accent)' : 'inherit',
          font: 'inherit',
          padding: '0 2px',
          margin: 0,
          cursor: 'pointer',
          borderRadius: 2,
          transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
        }}
        title={`Tap to highlight ${matchedLabel} in the visual`}
      >
        {part}
      </button>
    );
  });
}

export function LessonContentRenderer({
  userId,
  teacherId,
  teacher,
  questId,
  questData,
  currentSlide,
  slides,
  slidesLoading,
  syllabus,
  isPlaying,
  setIsPlaying,
  latestAIResponse,
  getSpeakerText,
  isInteractive,
  setIsInteractive,
  chatMessages,
  setChatMessages,
  chatLoading,
  chatInput,
  setChatInput,
  chatBottomRef,
  isRecording,
  startVoiceInput,
  sendInteractiveMessage,
  understandingConfirmed,
  setUnderstandingConfirmed,
  handleNextSlide,
  codeRunning,
  codeOutputs,
  simulateCodeRun,
  isLastSlide,
  examPassed,
  examFailed,
  setExamFailed,
  examCorrectCount,
  setExamCorrectCount,
  setExamAnswers,
  onReviewLesson,
  runSlideCode,
  examQuestionIndex,
  setExamQuestionIndex,
  selectedMcqAnswer,
  setSelectedMcqAnswer,
  mcqChecked,
  setMcqChecked,
  mcqIsCorrect,
  setMcqIsCorrect,
  setExamPassed,
  playChime,
  launchConfetti,
  quizQuestions,
  currentVisualStepIndex = 0,
  isManualOverride = false,
  onVisualStepChange,
  onSyncWithVoice,
}: LessonContentRendererProps) {
  const currentSlideData = currentSlide > 0 && currentSlide <= slides.length ? slides[currentSlide - 1] : null;
  const currentVisual: LessonVisual | null = currentSlideData?.visual || null;
  const tappableLabels = getTappableLabelsForVisual(currentVisual);

  const [highlightedLabel, setHighlightedLabel] = useState<string | null>(null);
  const highlightTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTriggerHighlight = useCallback((label: string) => {
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }
    setHighlightedLabel(label);
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedLabel(null);
    }, 2000);
  }, []);

  const handleWordHover = useCallback((label: string | null) => {
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }
    setHighlightedLabel(label);
  }, []);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className={`interactive-container ${!currentVisual ? 'no-visual' : ''}`}>
        {/* Left Column: Visual Stage (when slide has a visual) */}
        {currentVisual && (
          <div className="interactive-left-col">
            <VisualStage
              visual={currentVisual}
              currentStepIndex={currentVisualStepIndex}
              onStepChange={onVisualStepChange || (() => {})}
              isManualOverride={isManualOverride}
              onSyncWithVoice={onSyncWithVoice || (() => {})}
              highlightedLabel={highlightedLabel}
              onShapeTap={handleTriggerHighlight}
            />
          </div>
        )}

        {/* Right Column: Dynamic Panel (either Socratic Chat or Slide Lecture) */}
        <div className="interactive-right-col">
        {isInteractive ? (
          <>
            {/* Chat Panel Header */}
            <div style={{
              padding: '10px 14px',
              borderBottom: '1.5px solid var(--border)',
              background: 'var(--bg2)',
              fontSize: 12,
              fontWeight: 900,
              color: 'var(--t2)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0
            }}>
              <span>{teacher.avatar}</span>
              <span>Socratic Chat: {teacher.name}</span>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              {chatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--t3)', fontSize: 12, margin: '20px auto 0', maxWidth: 280, lineHeight: 1.45 }}>
                  Type a question below or use a quick suggestion chip to explore this slide.
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`chat-bubble ${msg.role}`}
                  >
                    {msg.content}
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="chat-bubble assistant" style={{ fontStyle: 'italic', color: 'var(--t3)' }}>
                  Thinking... ⏳
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input controls container at bottom of chat panel */}
            <div style={{
              padding: '10px 14px',
              borderTop: '1.5px solid var(--border)',
              background: 'var(--bg2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              flexShrink: 0
            }}>
              {/* Quick suggestion chips */}
              <div style={{
                display: 'flex',
                gap: 6,
                overflowX: 'auto',
                paddingBottom: 2,
                width: '100%'
              }}>
                <button
                  onClick={() => setChatInput("Explain as simple as you can")}
                  className="suggestion-pill"
                >
                  💡 explain as simple as you can
                </button>
                <button
                  onClick={() => setChatInput("Give me a real-world analogy")}
                  className="suggestion-pill"
                >
                  💡 Give me a real-world analogy
                </button>
                <button
                  onClick={() => setChatInput("Show me another code example")}
                  className="suggestion-pill"
                >
                  💡 Show me another code example
                </button>
              </div>

              {/* Chat Text Input / Speech Recognition Input */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (chatInput.trim() && !chatLoading) {
                    sendInteractiveMessage(chatInput.trim());
                  }
                }}
                style={{ display: 'flex', gap: 6, width: '100%' }}
              >
                <button
                  type="button"
                  onClick={startVoiceInput}
                  style={{
                    background: isRecording ? 'rgba(var(--danger-rgb),  0.15)' : 'var(--bg3)',
                    border: isRecording ? '1px solid #ef4444' : '1px solid var(--border)',
                    borderRadius: 10,
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: isRecording ? 'var(--danger)' : 'var(--t2)',
                    animation: isRecording ? 'micPulse 1.5s infinite' : 'none',
                    outline: 'none'
                  }}
                  title={isRecording ? "Listening... Click to stop" : "Use voice dictation"}
                >
                  🎤
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder={`Ask ${teacher.name}...`}
                  disabled={chatLoading}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg1)',
                    color: 'var(--t1)',
                    fontSize: 12.5,
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 10,
                    background: chatInput.trim() && !chatLoading ? teacher.accent : 'var(--bg3)',
                    color: chatInput.trim() && !chatLoading ? '#fff' : 'var(--t3)',
                    border: 'none',
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'not-allowed'
                  }}
                >
                  Send
                </button>
              </form>

              {/* Confirm understanding button to proceed to next slide */}
              {!understandingConfirmed[currentSlide - 1] && (
                <button
                  type="button"
                  data-testid="btn-confirm-understanding"
                  onClick={() => {
                    setUnderstandingConfirmed(prev => ({ ...prev, [currentSlide - 1]: true }));
                    setIsInteractive(false);
                    toast.success("Awesome!", "Understanding confirmed.");
                    handleNextSlide();
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--success)',
                    border: 'none',
                    color: 'var(--text)',
                    padding: '8px 12px',
                    borderRadius: 10,
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'background 0.2s',
                    marginTop: 4
                  }}
                >
                  👍 I understand now, proceed to next slide
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="interactive-right-scroll-area">
            {currentSlide === 0 && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 900, color: 'var(--t1)' }}>{questData?.title || 'Today\'s lesson'}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 4, lineHeight: 1.45, maxWidth: 650, margin: '4px auto 0' }}>
                  {questData?.desc && questData.desc.length < 220
                    ? questData.desc
                    : 'Listen to your teacher, try the code, and answer one small question after each part.'}
                </p>
                {Array.isArray(questData?.testDays) && questData.testDays.length > 0 && (
                  <ul style={{ textAlign: 'left', maxWidth: 520, margin: '14px auto 0', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {questData.testDays.map((day: string, i: number) => (
                      <li key={i} style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>{day}</li>
                    ))}
                  </ul>
                )}
                {syllabus.length > 0 && (
                  <ol style={{ textAlign: 'left', maxWidth: 520, margin: '14px auto 0', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {syllabus.map((topic, i) => (
                      <li key={i} style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.4 }}>{topic.length > 60 ? topic.split(':')[0] : topic}</li>
                    ))}
                  </ol>
                )}
              </div>
            )}

            {slidesLoading && currentSlide > 0 && currentSlide <= (slides.length || syllabus.length) && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--t3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="animate-spin" style={{ display: 'inline-block', animation: 'spin 1.5s linear infinite' }}>🌀</span> Generating customized Socratic lecture slides...
                </div>
              </div>
            )}

            {!slidesLoading && currentSlide > 0 && currentSlide <= slides.length && slides[currentSlide - 1] && (() => {
              const slide = slides[currentSlide - 1];
              const bulletPoints = Array.isArray(slide.bulletPoints) ? slide.bulletPoints : [];
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
                  <h4 data-testid="lesson-slide-title" style={{ fontSize: 16.5, fontWeight: 900, color: teacher.accent, margin: 0 }}>
                    {renderWithTappableWords(slide.title || 'Lesson Slide', tappableLabels, highlightedLabel, handleTriggerHighlight, handleWordHover)}
                  </h4>

                  {/* Long-format lesson: the teacher's explanation, in plain words */}
                  {Array.isArray(slide.explain) && slide.explain.length > 0 && (
                    <div data-testid="lesson-explain" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {slide.explain.map((para: string, i: number) => (
                        <p key={i} style={{ fontSize: 14, color: 'var(--t1)', lineHeight: 1.6, margin: 0 }}>
                          {renderWithTappableWords(para, tappableLabels, highlightedLabel, handleTriggerHighlight, handleWordHover)}
                        </p>
                      ))}
                    </div>
                  )}

                  {slide.example && (
                    <div style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(var(--info-rgb), 0.08)', border: '1px solid rgba(var(--info-rgb), 0.3)' }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--info)', marginBottom: 4 }}>🌍 Everyday example</div>
                      <div style={{ fontSize: 13.5, color: 'var(--t1)', lineHeight: 1.55 }}>
                        {renderWithTappableWords(slide.example, tappableLabels, highlightedLabel, handleTriggerHighlight, handleWordHover)}
                      </div>
                    </div>
                  )}

                  {/* 🏢 1ST: REAL-WORLD ANALOGY & PRODUCTION CASE STUDY CARD (Introductory Slide 1 Only) */}
                  {currentSlide === 1 && !slide.explain && (() => {
                    const desc = questData?.desc || '';
                    let realWorldStory = '';
                    if (desc.includes('(Real world:')) {
                      const match = desc.match(/\(Real world:\s*([^)]+)\)/i);
                      if (match && match[1]) {
                        realWorldStory = match[1].trim();
                      }
                    } else if (desc.length > 50) {
                      realWorldStory = desc;
                    }

                    const matchedAnalogy = findConceptAnalogy(slide.title || '', questId);

                    return (
                      <div style={{
                        margin: '2px 0 6px 0',
                        padding: '12px 16px',
                        borderRadius: 14,
                        background: 'linear-gradient(135deg, rgba(var(--info-rgb), 0.12), rgba(var(--success-rgb), 0.08))',
                        border: '1px solid rgba(var(--info-rgb), 0.3)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                      }}>
                        <div style={{ fontSize: 11.5, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                          🏢 Real-life example
                        </div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.45, marginBottom: realWorldStory ? 0 : 8 }}>
                          {realWorldStory || matchedAnalogy.analogy}
                        </div>
                        {!realWorldStory && (
                          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--success-bright)' }}>
                            {matchedAnalogy.realWorldUseCase}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* 💡 2ND: THE CORE TECHNICAL CONCEPT & MECHANICS (SECOND) */}
                  {bulletPoints.length > 0 && (
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ fontSize: 11.5, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                        💡 Key points
                      </div>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 8, margin: 0 }}>
                        {bulletPoints.map((bp: string, i: number) => (
                          <li key={i} style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>{bp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {slide.projectCode && (
                    <div data-testid="lesson-project-code">
                      <div style={{ background: '#1e293b', padding: '6px 12px', borderTopLeftRadius: 12, borderTopRightRadius: 12, fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        💻 {slide.projectCode.label}
                      </div>
                      <pre style={{ margin: 0, background: '#0e1420', padding: '14px 18px', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, fontSize: 12.5, lineHeight: 1.55, fontFamily: 'var(--font-mono)', color: '#e2e8f0', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderTop: 'none' }}>
                        <code>{slide.projectCode.code}</code>
                      </pre>
                    </div>
                  )}

                  {slide.codeExample && (
                    <LessonCodeEditor
                      questId={questId}
                      slideIdx={currentSlide - 1}
                      codeExample={slide.codeExample}
                      mockOutput={slide.mockOutput}
                      codeRunning={codeRunning[currentSlide - 1]}
                      codeOutput={codeOutputs[currentSlide - 1]}
                      onRunCode={(code: string) => {
                        if (runSlideCode) {
                          runSlideCode(currentSlide - 1, code || slide.codeExample);
                        } else {
                          simulateCodeRun(currentSlide - 1, slide.mockOutput);
                        }
                      }}
                    />
                  )}

                  {Array.isArray(slide.codeNotes) && slide.codeNotes.length > 0 && (
                    <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--t2)', marginBottom: 6 }}>🔎 What the code does</div>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {slide.codeNotes.map((n: { line: number; note: string }, i: number) => (
                          <li key={i} style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.5 }}>
                            <span style={{ fontFamily: 'var(--font-mono)', color: teacher.accent, fontWeight: 800 }}>Line {n.line}:</span>{' '}
                            {renderWithTappableWords(n.note, tappableLabels, highlightedLabel, handleTriggerHighlight, handleWordHover)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {slide.tryIt && (
                    <div style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(var(--success-rgb), 0.08)', border: '1px solid rgba(var(--success-rgb), 0.3)' }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--success)', marginBottom: 4 }}>✍️ Your turn</div>
                      <div style={{ fontSize: 13.5, color: 'var(--t1)', lineHeight: 1.55 }}>
                        {renderWithTappableWords(slide.tryIt, tappableLabels, highlightedLabel, handleTriggerHighlight, handleWordHover)}
                      </div>
                    </div>
                  )}

                  {/* Interactive Understanding Check on content slides */}
                  <div style={{
                    marginTop: 12,
                    background: 'rgba(var(--brand-rgb),  0.03)',
                    border: '1px dashed var(--border)',
                    borderRadius: 12,
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>
                      ❓ Did you understand this concept?
                    </span>
                    {understandingConfirmed[currentSlide - 1] ? (
                      <span style={{ color: 'var(--success)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        ✓ Concept Confirmed
                      </span>
                    ) : (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          data-testid="btn-confirm-understanding"
                          onClick={() => {
                            setUnderstandingConfirmed(prev => ({ ...prev, [currentSlide - 1]: true }));
                            toast.success("Great!", "Understanding confirmed. Click 'Next Slide' to continue.");
                          }}
                          style={{
                            background: 'var(--success)',
                            border: 'none',
                            color: 'var(--text)',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                        >
                          👍 Yes
                        </button>
                        <button
                          onClick={async () => {
                            setIsInteractive(true);
                            setChatMessages([{
                              role: 'assistant',
                              content: "What did you not understand about this topic? Ask me for a real-world analogy, or let me know what was confusing."
                            }]);
                            
                            speakWithAvatar(
                              "What did you not understand?",
                              teacherId,
                              () => setIsPlaying(true),
                              () => setIsPlaying(false)
                            );
                          }}
                          style={{
                            background: 'rgba(var(--danger-rgb),  0.08)',
                            border: '1px solid rgba(var(--danger-rgb),  0.2)',
                            color: 'var(--danger)',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                        >
                          👎 No, explain further
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {isLastSlide && (
              <LessonQuizBlock
                teacherAccent={teacher.accent}
                examPassed={examPassed}
                examFailed={examFailed}
                setExamFailed={setExamFailed}
                examCorrectCount={examCorrectCount}
                setExamCorrectCount={setExamCorrectCount}
                setExamAnswers={setExamAnswers}
                onReviewLesson={onReviewLesson}
                examQuestionIndex={examQuestionIndex}
                setExamQuestionIndex={setExamQuestionIndex}
                selectedMcqAnswer={selectedMcqAnswer}
                setSelectedMcqAnswer={setSelectedMcqAnswer}
                mcqChecked={mcqChecked}
                setMcqChecked={setMcqChecked}
                mcqIsCorrect={mcqIsCorrect}
                setMcqIsCorrect={setMcqIsCorrect}
                setExamPassed={setExamPassed}
                playChime={playChime}
                launchConfetti={launchConfetti}
                dynamicQuestions={quizQuestions ?? slides.map(s => s.mcq).filter(Boolean)}
                questTitle={questData.title}
                quizTitle={quizQuestions ? questData.title : 'Quick check'}
              />
            )}
          </div>
        )}
      </div>
    </div>

    {/* Bottom-right Teacher Avatar Picture-in-Picture */}
    <TeacherAvatarFrame
      userId={userId}
      teacherId={teacherId}
      teacher={teacher}
      isPlaying={isPlaying}
      speechText={latestAIResponse || getSpeakerText()}
      questData={questData}
    />
  </>
  );
}
