import React from 'react';
import dynamic from 'next/dynamic';
import { toast } from '@/lib/store/useAppStore';
import { speakWithAvatar } from '@/lib/tts';
import { CONCEPT_ANALOGIES_REGISTRY } from '@/lib/data/conceptAnalogies';
import { LessonCodeEditor } from './LessonCodeEditor';
import { LessonQuizBlock } from './LessonQuizBlock';

const AvatarMentorWidget = dynamic(() => import('@/components/avatar/AvatarMentorWidget'), { ssr: false });

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
}: LessonContentRendererProps) {
  return (
    <div className="interactive-container">
      {/* Left Column: standing avatar */}
      <div className="interactive-left-col">
        <div className="avatar-spotlight" style={{ background: teacher.accent }} />
        <AvatarMentorWidget
          userId={userId}
          teacherId={teacherId}
          onlyAvatar={true}
          speaking={isPlaying}
          speechText={latestAIResponse || getSpeakerText()}
          activeQuest={questData}
        />
        {isPlaying && (
          <div className="speaking-pod">
            <span style={{ fontSize: 10.5, color: 'var(--text-muted)', marginRight: 6, fontFamily: 'var(--font-mono)' }}>Tutor Speaking</span>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: 16,
                  background: teacher.accent,
                  borderRadius: 2,
                  animation: `wave 1.2s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Dynamic Panel (either Socratic Chat or Slide Lecture) */}
      <div className="interactive-right-col">
        {isInteractive ? (
          <>
            {/* Chat Panel Header */}
            <div style={{
              padding: '10px 14px',
              borderBottom: '1.5px solid var(--border)',
              background: 'var(--bg2)',
              fontSize: 11,
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
                <div style={{ textAlign: 'center', color: 'var(--t3)', fontSize: 11, margin: '20px auto 0', maxWidth: 280, lineHeight: 1.45 }}>
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
                    fontSize: 12,
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
                    fontSize: 11.5,
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
                    fontSize: 11.5,
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
                    fontSize: 11.5,
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
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}>
            {currentSlide === 0 && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: 'var(--t1)' }}>Welcome to your Quest roadmap!</h3>
                <p style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 4, lineHeight: 1.45, maxWidth: 650, margin: '4px auto 0' }}>
                  We will step through each requirement of the course syllabus. Listen closely to each slide before unlocking your immediate coding test.
                </p>
              </div>
            )}

            {slidesLoading && currentSlide > 0 && currentSlide <= (slides.length || syllabus.length) && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="animate-spin" style={{ display: 'inline-block', animation: 'spin 1.5s linear infinite' }}>🌀</span> Generating customized Socratic lecture slides...
                </div>
              </div>
            )}

            {!slidesLoading && currentSlide > 0 && currentSlide <= slides.length && slides[currentSlide - 1] && (() => {
              const slide = slides[currentSlide - 1];
              const bulletPoints = Array.isArray(slide.bulletPoints) ? slide.bulletPoints : [];
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
                  <h4 data-testid="lesson-slide-title" style={{ fontSize: 15, fontWeight: 900, color: teacher.accent, margin: 0 }}>
                    {slide.title || 'Lesson Slide'}
                  </h4>

                  {/* 🏢 1ST: REAL-WORLD ANALOGY & PRODUCTION CASE STUDY CARD (Introductory Slide 1 Only) */}
                  {currentSlide === 1 && (() => {
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

                    const currentTopicKey = (slide.title || '').toLowerCase();
                    let matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-functions'];
                    if (currentTopicKey.includes('loop') || currentTopicKey.includes('iterat')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-loops'];
                    else if (currentTopicKey.includes('dict') || currentTopicKey.includes('hash') || currentTopicKey.includes('map')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-dicts'];
                    else if (currentTopicKey.includes('class') || currentTopicKey.includes('oop') || currentTopicKey.includes('object')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['python-classes'];
                    else if (currentTopicKey.includes('react') || currentTopicKey.includes('component')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['react-components'];
                    else if (currentTopicKey.includes('hook') || currentTopicKey.includes('state')) matchedAnalogy = CONCEPT_ANALOGIES_REGISTRY['react-hooks'];

                    return (
                      <div style={{
                        margin: '2px 0 6px 0',
                        padding: '12px 16px',
                        borderRadius: 14,
                        background: 'linear-gradient(135deg, rgba(var(--info-rgb), 0.12), rgba(var(--success-rgb), 0.08))',
                        border: '1px solid rgba(var(--info-rgb), 0.3)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                      }}>
                        <div style={{ fontSize: 10.5, fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                          🏢 1. Real-World Industry Story & Production Context
                        </div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.45, marginBottom: realWorldStory ? 0 : 8 }}>
                          {realWorldStory || matchedAnalogy.analogy}
                        </div>
                        {!realWorldStory && (
                          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--success-bright)' }}>
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
                      <div style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                        💡 2. Core Technical Rules & Execution Model
                      </div>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 8, margin: 0 }}>
                        {bulletPoints.map((bp: string, i: number) => (
                          <li key={i} style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.45 }}>{bp}</li>
                        ))}
                      </ul>
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
                      onRunCode={() => simulateCodeRun(currentSlide - 1, slide.mockOutput)}
                    />
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
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }}>
                      ❓ Did you understand this concept?
                    </span>
                    {understandingConfirmed[currentSlide - 1] ? (
                      <span style={{ color: 'var(--success)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
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
                            fontSize: 10.5,
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
                            fontSize: 10.5,
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
                dynamicQuestions={slides.map(s => s.mcq).filter(Boolean)}
                questTitle={questData.title}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
