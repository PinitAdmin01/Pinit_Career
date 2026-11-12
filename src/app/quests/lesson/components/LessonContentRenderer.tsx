import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { toast } from '@/lib/store/useAppStore';
import { speakWithAvatar } from '@/lib/tts';
import { CONCEPT_ANALOGIES_REGISTRY, findConceptAnalogy } from '@/lib/data/conceptAnalogies';
import { LessonCodeEditor } from './LessonCodeEditor';
import { LessonQuizBlock, getExplanationText } from './LessonQuizBlock';
import { LessonPuzzleStage } from '@/components/quests/puzzle/LessonPuzzleStage';
import { RapidFireBattleStage } from '@/components/quests/battle/RapidFireBattleStage';
import { generateLessonPuzzle, generateRapidFireBattle } from '@/lib/puzzles/lessonPuzzleEngine';
import { parseQuestId } from '@/lib/data/curriculumEnricher';
import { getLongLessonAsync } from '@/lib/data/longLessonClient';
import { VisualStage } from './visuals';
import type { LessonVisual } from '@/lib/types/lessonVisual';
import {
  getTappableLabelsForVisual,
  tokenizeParagraphWithUnderlines,
} from '@/lib/visuals/visualRules';

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
  audioProgress?: number;
  currentPieceAt?: string | null;
}

function renderWithTappableWords(
  text: string,
  labels: string[],
  highlightedLabel: string | null,
  onWordClick: (label: string) => void,
  onWordHover?: (label: string | null) => void,
  _isSpokenParagraph?: boolean,
  _audioProgress?: number
): React.ReactNode {
  if (!text) return text;
  const tokens = tokenizeParagraphWithUnderlines(text, labels);

  if (tokens.length <= 1 && (!tokens[0] || !tokens[0].isUnderlined)) {
    return text;
  }
  return tokens.map((token, idx) => {
    if (!token.isUnderlined || !token.matchedLabel) {
      return <React.Fragment key={idx}>{token.text}</React.Fragment>;
    }
    const lowerKey = token.matchedLabel.toLowerCase();
    const isHighlighted = highlightedLabel && highlightedLabel.toLowerCase() === lowerKey;

    return (
      <button
        key={idx}
        type="button"
        data-testid={`tappable-word-${lowerKey}`}
        onClick={(e) => {
          e.stopPropagation();
          onWordClick(token.matchedLabel!);
        }}
        onMouseEnter={() => onWordHover && onWordHover(token.matchedLabel!)}
        onMouseLeave={() => onWordHover && onWordHover(null)}
        style={{
          display: 'inline',
          background: isHighlighted ? 'color-mix(in srgb, var(--accent) 20%, transparent)' : 'transparent',
          border: 'none',
          borderBottom: isHighlighted ? '2px solid var(--accent)' : '1.5px solid var(--accent)',
          color: isHighlighted ? 'var(--accent)' : 'inherit',
          font: 'inherit',
          padding: '0 2px',
          margin: 0,
          cursor: 'pointer',
          borderRadius: 3,
          transition: 'all 0.15s ease',
        }}
        title={`Tap to highlight ${token.matchedLabel} in the visual`}
      >
        {token.text}
      </button>
    );
  });
}

function getSlideMcqExplanation(explanation: any): string {
  return getExplanationText(explanation);
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
  audioProgress = 0,
  currentPieceAt = null,
}: LessonContentRendererProps) {
  const safeTeacher = teacher || {
    name: 'Kashyap Sir',
    avatar: '👩‍🎨',
    color: 'rgba(var(--info-rgb), 0.1)',
    accent: 'var(--accent)',
    role: 'Staff Systems Architect',
  };
  const currentSlideData = currentSlide > 0 && currentSlide <= slides.length ? slides[currentSlide - 1] : null;
  const currentVisual: LessonVisual | null = currentSlideData?.visual || null;
  const tappableLabels = getTappableLabelsForVisual(currentVisual);

  const [highlightedLabel, setHighlightedLabel] = useState<string | null>(null);

  // Parse quest identity for 2.5D puzzle & rapid-fire battle synthesis
  const parsedQuest = useMemo(() => parseQuestId(questId || ''), [questId]);
  const [longLesson, setLongLesson] = useState<import('@/lib/data/longLessonTypes').LongLesson | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!parsedQuest) { setLongLesson(null); return; }
    getLongLessonAsync(parsedQuest.prefix, parsedQuest.dayNum).then(lesson => {
      if (!cancelled) setLongLesson(lesson);
    });
    return () => { cancelled = true; };
  }, [parsedQuest]);

  const puzzleSpec = useMemo(() => {
    const prefix = parsedQuest?.prefix || '';
    const dayNum = parsedQuest?.dayNum || 1;
    return generateLessonPuzzle(questId, prefix, dayNum, longLesson || questData);
  }, [questId, parsedQuest, longLesson, questData]);

  const battleSpec = useMemo(() => {
    const prefix = parsedQuest?.prefix || '';
    const dayNum = parsedQuest?.dayNum || 1;
    return generateRapidFireBattle(questId, prefix, dayNum, longLesson || questData);
  }, [questId, parsedQuest, longLesson, questData]);
  const [selectedSlideAnswers, setSelectedSlideAnswers] = useState<Record<number, number>>({});
  const [slideAnswerFeedback, setSlideAnswerFeedback] = useState<Record<number, { isCorrect: boolean; feedback: string }>>({});
  const highlightTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const userScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleUserScroll = useCallback(() => {
    userScrolledRef.current = true;
    if (userScrollTimerRef.current) {
      clearTimeout(userScrollTimerRef.current);
    }
    userScrollTimerRef.current = setTimeout(() => {
      userScrolledRef.current = false;
    }, 4000);
  }, []);

  // Smooth Auto-scroll to topic currently being explained by the teacher
  useEffect(() => {
    if (userScrolledRef.current || !scrollAreaRef.current) return;

    if (!currentPieceAt || currentPieceAt === 'intro' || currentPieceAt === 'say1' || currentPieceAt === 'say2') {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentPieceAt === 'example') {
      const el = scrollAreaRef.current.querySelector('[data-testid="lesson-everyday-example"]');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }
    }

    if (currentPieceAt === 'code' || currentPieceAt === 'notes') {
      const el = scrollAreaRef.current.querySelector('[data-testid="lesson-code-notes"]') ||
                 scrollAreaRef.current.querySelector('[data-testid="lesson-code-editor-root"]');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }
    }

    if (currentPieceAt === 'tryIt') {
      const el = scrollAreaRef.current.querySelector('[data-testid="lesson-try-it"]');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }
    }
  }, [currentPieceAt, currentSlide]);

  // When teacher explanation finishes, gently scroll down so user can answer the Quick Check
  const prevPlayingRef = useRef(isPlaying);
  useEffect(() => {
    const wasPlaying = prevPlayingRef.current;
    prevPlayingRef.current = isPlaying;

    if (wasPlaying && !isPlaying && !userScrolledRef.current && scrollAreaRef.current) {
      if (currentSlide > 0 && !understandingConfirmed[currentSlide - 1]) {
        const checkEl = scrollAreaRef.current.querySelector('[data-testid="inline-socratic-check"]');
        if (checkEl) {
          checkEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }, [isPlaying, currentSlide, understandingConfirmed]);

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
      if (userScrollTimerRef.current) {
        clearTimeout(userScrollTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`interactive-container ${!currentVisual ? 'no-visual' : ''}`}>
      {/* Left Column: Visual Stage (when slide has a visual) */}
      {currentVisual && (
        <div
          className="interactive-left-col"
          data-visual-key={currentSlideData?.visualKey}
          data-part-key={currentSlideData?.visualKey}
        >
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
          <div data-testid="socratic-chat-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
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
              <span>{safeTeacher.avatar}</span>
              <span>Socratic Chat: {safeTeacher.name}</span>
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
                    data-testid={`socratic-chat-msg-${idx}`}
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
                  type="button"
                  data-testid="socratic-suggestion-0"
                  onClick={() => setChatInput("Explain as simple as you can")}
                  className="suggestion-pill"
                >
                  💡 explain as simple as you can
                </button>
                <button
                  type="button"
                  data-testid="socratic-suggestion-1"
                  onClick={() => setChatInput("Give me a real-world analogy")}
                  className="suggestion-pill"
                >
                  💡 Give me a real-world analogy
                </button>
                <button
                  type="button"
                  data-testid="socratic-suggestion-2"
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
                  data-testid="socratic-voice-btn"
                  onClick={startVoiceInput}
                  style={{
                    background: isRecording ? 'rgba(var(--danger-rgb),  0.15)' : 'var(--bg3)',
                    border: isRecording ? '1px solid var(--coral)' : '1px solid var(--border)',
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
                  data-testid="socratic-chat-input"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder={`Ask ${safeTeacher.name}...`}
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
                  data-testid="socratic-chat-send"
                  disabled={!chatInput.trim() || chatLoading}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 10,
                    background: chatInput.trim() && !chatLoading ? (safeTeacher.accent || 'var(--accent)') : 'var(--bg3)',
                    color: chatInput.trim() && !chatLoading ? 'var(--t1)' : 'var(--t3)',
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
          </div>
        ) : (
          <div
            className="interactive-right-scroll-area"
            ref={scrollAreaRef}
            onWheel={handleUserScroll}
            onTouchMove={handleUserScroll}
          >
            {currentSlide === 0 && (
              <div data-testid="lesson-intro-card" style={{ textAlign: 'center', padding: '12px 0' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <h4 data-testid="lesson-slide-title" style={{ fontSize: 16.5, fontWeight: 900, color: safeTeacher.accent || 'var(--accent)', margin: 0 }}>
                      {renderWithTappableWords(slide.title || 'Lesson Slide', tappableLabels, highlightedLabel, handleTriggerHighlight, handleWordHover, isPlaying && currentPieceAt === 'intro', audioProgress)}
                    </h4>
                    <button
                      type="button"
                      data-testid="btn-read-slide"
                      onClick={() => {
                        const text = getSpeakerText();
                        if (text) {
                          speakWithAvatar(
                            text,
                            teacherId,
                            () => setIsPlaying(true),
                            () => setIsPlaying(false)
                          );
                        }
                      }}
                      title="Listen to teacher explanation"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid var(--border)',
                        borderRadius: 999,
                        padding: '3px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--t2)',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {isPlaying ? '🔊 Speaking…' : '🔊 Listen'}
                    </button>
                  </div>

                  {/* Long-format lesson: the teacher's explanation, in plain words */}
                  {Array.isArray(slide.explain) && slide.explain.length > 0 && (
                    <div data-testid="lesson-explain" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {slide.explain.map((para: string, i: number) => (
                        <p key={i} style={{ fontSize: 14, color: 'var(--t1)', lineHeight: 1.6, margin: 0 }}>
                          {renderWithTappableWords(para, tappableLabels, highlightedLabel, handleTriggerHighlight, handleWordHover, isPlaying && currentPieceAt === `say${i + 1}`, audioProgress)}
                        </p>
                      ))}
                    </div>
                  )}

                  {slide.example && (
                    <div data-testid="lesson-everyday-example" style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(var(--info-rgb), 0.08)', border: '1px solid rgba(var(--info-rgb), 0.3)' }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--info)', marginBottom: 4 }}>🌍 Everyday example</div>
                      <div style={{ fontSize: 13.5, color: 'var(--t1)', lineHeight: 1.55 }}>
                        {renderWithTappableWords(slide.example, tappableLabels, highlightedLabel, handleTriggerHighlight, handleWordHover, isPlaying && currentPieceAt === 'example', audioProgress)}
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
                        <div style={{ fontSize: 11.5, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
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
                      <div style={{ background: 'var(--bg2)', padding: '6px 12px', borderTopLeftRadius: 12, borderTopRightRadius: 12, fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        💻 {slide.projectCode.label}
                      </div>
                      <pre style={{ margin: 0, background: 'var(--bg3)', padding: '14px 18px', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, fontSize: 12.5, lineHeight: 1.55, fontFamily: 'var(--font-mono)', color: 'var(--t1)', overflowX: 'auto', border: '1px solid var(--border)', borderTop: 'none' }}>
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
                    // [FIX-STAGE: CodeNotes Union Normalization] Support both { line, note } objects
                    // and plain string entries from LongLessonPart.codeNotes without rendering "Line undefined:".
                    <div data-testid="lesson-code-notes" style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--t2)', marginBottom: 6 }}>🔎 What the code does</div>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {slide.codeNotes.map((rawNote: unknown, i: number) => {
                          let lineNum: number | undefined;
                          let noteText = '';
                          if (typeof rawNote === 'string') {
                            noteText = rawNote.trim();
                          } else if (rawNote && typeof rawNote === 'object') {
                            const obj = rawNote as { line?: unknown; note?: unknown; text?: unknown };
                            if (typeof obj.line === 'number' && Number.isFinite(obj.line)) {
                              lineNum = obj.line;
                            }
                            if (typeof obj.note === 'string') {
                              noteText = obj.note;
                            } else if (typeof obj.text === 'string') {
                              noteText = obj.text;
                            }
                          }
                          if (!noteText) {
                            console.warn('[PinIT][Fix:LessonRenderer] Skipping empty or malformed codeNote at index', i, rawNote);
                            return null;
                          }
                          return (
                            <li key={i} style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.5 }}>
                              {lineNum !== undefined && (
                                <span style={{ fontFamily: 'var(--font-mono)', color: safeTeacher.accent || 'var(--accent)', fontWeight: 800 }}>
                                  Line {lineNum}:{' '}
                                </span>
                              )}
                              {renderWithTappableWords(noteText, tappableLabels, highlightedLabel, handleTriggerHighlight, handleWordHover)}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {slide.tryIt && (
                    <div data-testid="lesson-try-it" style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(var(--success-rgb), 0.08)', border: '1px solid rgba(var(--success-rgb), 0.3)' }}>
                      <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--success)', marginBottom: 4 }}>✍️ Your turn</div>
                      <div style={{ fontSize: 13.5, color: 'var(--t1)', lineHeight: 1.55 }}>
                        {renderWithTappableWords(slide.tryIt, tappableLabels, highlightedLabel, handleTriggerHighlight, handleWordHover, isPlaying && currentPieceAt === 'tryIt', audioProgress)}
                      </div>
                    </div>
                  )}

                  {/* Inline Socratic Understanding Check on content slides */}
                  {slide.mcq && Array.isArray(slide.mcq.options) && slide.mcq.options.length > 0 ? (
                    <div
                      data-testid="inline-socratic-check"
                      style={{
                        marginTop: 14,
                        background: 'rgba(var(--brand-rgb), 0.04)',
                        border: '1.5px solid var(--border)',
                        borderRadius: 14,
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 900, color: safeTeacher.accent || 'var(--accent)' }}>
                            🧠 Quick Check
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>
                            (Select the correct answer to unlock next slide)
                          </span>
                        </div>
                        {understandingConfirmed[currentSlide - 1] && (
                          <span
                            data-testid="btn-confirm-understanding"
                            style={{
                              color: 'var(--success)',
                              fontSize: 11.5,
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              background: 'rgba(var(--success-rgb), 0.1)',
                              padding: '2px 8px',
                              borderRadius: 6,
                              border: '1px solid rgba(var(--success-rgb), 0.3)',
                            }}
                          >
                            ✓ Unlocked
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', margin: 0, lineHeight: 1.45 }}>
                        {slide.mcq.question}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {slide.mcq.options.map((option: string, oIdx: number) => {
                          const slideIdx = currentSlide - 1;
                          const selected = selectedSlideAnswers[slideIdx] === oIdx;
                          const feedback = slideAnswerFeedback[slideIdx];
                          const isAnswered = selectedSlideAnswers[slideIdx] !== undefined;
                          const isRightOption = oIdx === slide.mcq.answerIndex;

                          let bg = 'rgba(var(--brand-rgb), 0.02)';
                          let border = '1px solid var(--border)';
                          let color = 'var(--t1)';

                          if (isAnswered) {
                            if (isRightOption && (selected || feedback?.isCorrect)) {
                              bg = 'rgba(var(--success-rgb), 0.12)';
                              border = '1px solid var(--success)';
                              color = 'var(--success)';
                            } else if (selected && !feedback?.isCorrect) {
                              bg = 'rgba(var(--danger-rgb), 0.1)';
                              border = '1px solid var(--danger)';
                              color = 'var(--danger)';
                            }
                          }

                          const handleOptionClick = () => {
                            setSelectedSlideAnswers(prev => ({ ...prev, [slideIdx]: oIdx }));
                            const isCorrect = oIdx === slide.mcq.answerIndex;
                            if (isCorrect) {
                              setSlideAnswerFeedback(prev => ({
                                ...prev,
                                [slideIdx]: {
                                  isCorrect: true,
                                  feedback: getSlideMcqExplanation(slide.mcq.explanation) || 'Correct! Well done.'
                                }
                              }));
                              setUnderstandingConfirmed(prev => ({ ...prev, [slideIdx]: true }));
                              playChime();
                              toast.success("Correct! 🎯", "Understanding confirmed. Next slide unlocked!");
                            } else {
                              let targeted = '';
                              if (slide.mcq.diagnosisMap) {
                                const candidate = slide.mcq.diagnosisMap[String(oIdx)] ||
                                  slide.mcq.diagnosisMap[option] ||
                                  Object.values(slide.mcq.diagnosisMap)[0];
                                targeted = getSlideMcqExplanation(candidate);
                              }
                              const errorMsg = targeted || "Not quite right. Try again or ask the teacher for help!";
                              setSlideAnswerFeedback(prev => ({
                                ...prev,
                                [slideIdx]: {
                                  isCorrect: false,
                                  feedback: errorMsg
                                }
                              }));
                              toast.error("Not quite!", errorMsg);
                            }
                          };

                          return (
                            <button
                              key={oIdx}
                              type="button"
                              data-testid={`slide-check-option-${oIdx}`}
                              onClick={handleOptionClick}
                              style={{
                                padding: '8px 12px',
                                borderRadius: 8,
                                border,
                                background: bg,
                                color,
                                fontSize: 12.5,
                                fontWeight: selected ? 700 : 500,
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 8,
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <span style={{
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 10,
                                fontWeight: 800,
                                background: selected ? (feedback?.isCorrect ? 'var(--success)' : 'var(--danger)') : 'rgba(var(--brand-rgb), 0.1)',
                                color: selected ? '#ffffff' : 'var(--t2)',
                                flexShrink: 0,
                                marginTop: 1,
                              }}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span style={{ flex: 1, lineHeight: 1.4 }}>{option}</span>
                            </button>
                          );
                        })}
                      </div>

                      {slideAnswerFeedback[currentSlide - 1] && (
                        <div style={{
                          padding: '8px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          lineHeight: 1.45,
                          background: slideAnswerFeedback[currentSlide - 1].isCorrect
                            ? 'rgba(var(--success-rgb), 0.08)'
                            : 'rgba(var(--danger-rgb), 0.08)',
                          border: `1px solid ${slideAnswerFeedback[currentSlide - 1].isCorrect ? 'var(--success)' : 'var(--danger)'}`,
                          color: slideAnswerFeedback[currentSlide - 1].isCorrect ? 'var(--success)' : 'var(--danger)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 8
                        }}>
                          <span>
                            {slideAnswerFeedback[currentSlide - 1].isCorrect ? '✓ ' : '⚠️ '}
                            {slideAnswerFeedback[currentSlide - 1].feedback}
                          </span>
                          {!slideAnswerFeedback[currentSlide - 1].isCorrect && (
                            <button
                              type="button"
                              onClick={async () => {
                                setIsInteractive(true);
                                setChatMessages([{
                                  role: 'assistant',
                                  content: `Let's break down this question: "${slide.mcq.question}". What part feels confusing?`
                                }]);
                                speakWithAvatar(
                                  "Let's break down this question.",
                                  teacherId,
                                  () => setIsPlaying(true),
                                  () => setIsPlaying(false)
                                );
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--danger)',
                                textDecoration: 'underline',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Ask Teacher
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Fallback confirmation for slides lacking an explicit MCQ */
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
                              toast.success("Awesome!", "Concept confirmed.");
                              handleNextSlide();
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
                  )}
                </div>
              );
            })()}

            {/* 🧩 1. The 2.5D Tactile Puzzle Stage (Slide N + 1) */}
            {!slidesLoading && currentSlide === slides.length + 1 && (
              <LessonPuzzleStage
                puzzle={puzzleSpec}
                teacherAccent={safeTeacher.accent || 'var(--accent)'}
                onPuzzleSolved={() => {
                  handleNextSlide();
                }}
                playChime={playChime}
                launchConfetti={launchConfetti}
              />
            )}

            {/* ⚔️ 2. The 60-Second Rapid-Fire MCQ Battle (Slide N + 2) */}
            {!slidesLoading && currentSlide === slides.length + 2 && (
              <RapidFireBattleStage
                battle={battleSpec}
                teacherAccent={safeTeacher.accent || 'var(--accent)'}
                onBattleCleared={(score) => {
                  setExamPassed(true);
                  playChime();
                  launchConfetti();
                }}
                playChime={playChime}
                launchConfetti={launchConfetti}
              />
            )}

            {isLastSlide && quizQuestions && (
              <LessonQuizBlock
                teacherAccent={safeTeacher.accent || 'var(--accent)'}
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
  );
}
