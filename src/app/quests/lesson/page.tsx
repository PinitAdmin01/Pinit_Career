'use client';

import { Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';
import { stopSpeaking } from '@/lib/tts';
import { useAuth } from '@/lib/context/AuthContext';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { toast } from '@/lib/store/useAppStore';

import { useLessonState } from './hooks/useLessonState';
import { useLessonEngine } from './hooks/useLessonEngine';
import { LessonHeader } from './components/LessonHeader';
import { LessonContentRenderer } from './components/LessonContentRenderer';
import { LessonNavigationBar } from './components/LessonNavigationBar';
import { LessonCompletionModal } from './components/LessonCompletionModal';

const QuestWorkspaceClient = dynamic(() => import('@/components/quests/QuestWorkspaceClient'), { ssr: false });

interface Teacher {
  name: string;
  avatar: string;
  color: string;
  accent: string;
  role: string;
}

const TEACHER_METADATA: Record<string, Teacher> = {
  kashyap: { name: 'Kashyap Sir', avatar: '👩‍🎨', color: 'rgba(var(--info-rgb),  0.1)', accent: 'var(--accent)', role: 'Staff Systems Architect' },
  karthic: { name: 'Karthic Sir "Nega"', avatar: '👨‍🏫', color: 'rgba(var(--warning-rgb),  0.1)', accent: 'var(--amber)', role: 'Algorithmic Lead Tutor' },
  maya: { name: 'Ms. Maya', avatar: '👩‍💼', color: 'rgba(var(--danger-rgb),  0.1)', accent: 'var(--coral)', role: 'Principal Security Auditor' },
  divya: { name: 'Ms. Divya', avatar: '👨‍💼', color: 'rgba(var(--success-rgb),  0.1)', accent: 'var(--green)', role: 'Lead UX Engineer' }
};

const lessonStyles = `
  @keyframes wave {
    0% { transform: scaleY(0.3); }
    100% { transform: scaleY(1.5); }
  }
  @keyframes hologramPulse {
    0% { opacity: 0.15; transform: scale(0.95); }
    100% { opacity: 0.35; transform: scale(1.05); }
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(0px); }
  }
  @keyframes micPulse {
    0% { box-shadow: 0 0 0 0 rgba(var(--danger-rgb),  0.5); }
    70% { box-shadow: 0 0 0 8px rgba(var(--danger-rgb),  0); }
    100% { box-shadow: 0 0 0 0 rgba(var(--danger-rgb),  0); }
  }

  .lesson-card {
    width: 85vw;
    height: 85vh;
    max-width: 1440px;
    max-height: 850px;
    padding: 24px 32px;
    border-radius: 24px;
    border: 1.5px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: linear-gradient(135deg, var(--bg2), var(--bg3));
    box-shadow: var(--shadow-xl);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .avatar-spotlight {
    position: absolute;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.2;
    z-index: 0;
    pointer-events: none;
    animation: hologramPulse 4s ease-in-out infinite alternate;
  }

  .mcq-option-btn {
    text-align: left;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 11.5px;
    font-weight: 500;
    background: var(--bg2);
    border: 1px solid var(--border);
    color: var(--t2);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }
  .mcq-option-btn:hover:not(:disabled) {
    color: var(--t1);
    border-color: var(--border2);
    background: var(--bg3);
    transform: translateY(-1px);
  }
  .mcq-option-btn:disabled {
    cursor: not-allowed;
  }
  .mcq-option-btn.selected {
    background: var(--accent-light);
    border-color: var(--accent);
    color: var(--t1);
  }
  .mcq-option-btn.correct {
    background: var(--green-light);
    border-color: var(--green);
    color: var(--t1);
  }
  .mcq-option-btn.incorrect {
    background: var(--coral-light);
    border-color: var(--coral);
    color: var(--t1);
  }

  .chat-bubble {
    padding: 8px 12px;
    border-radius: 14px;
    font-size: 12px;
    line-height: 1.45;
    max-width: 85%;
    box-shadow: var(--shadow-sm);
  }
  .chat-bubble.user {
    background: var(--accent);
    color: #ffffff;
    border-bottom-right-radius: 4px;
    align-self: flex-end;
  }
  .chat-bubble.assistant {
    background: var(--bg2);
    color: var(--t1);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    align-self: flex-start;
  }

  .suggestion-pill {
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: var(--bg1);
    color: var(--t2);
    font-size: 10.5px;
    fontWeight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .suggestion-pill:hover {
    color: var(--t1);
    border-color: var(--accent);
    background: var(--accent-light);
    transform: scale(1.02);
  }

  .speaking-pod {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 3px;
    z-index: 10;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(4px);
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid var(--border);
    animation: float 3s ease-in-out infinite;
  }

  .interactive-container {
    display: flex;
    gap: 20px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    align-items: stretch;
    width: 100%;
  }

  .interactive-left-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 480px;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .interactive-right-col {
    flex: 1.1;
    display: flex;
    flex-direction: column;
    background: var(--bg1);
    border-radius: 18px;
    border: 1.5px solid var(--border);
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .interactive-container {
      flex-direction: column;
      overflow-y: auto;
      align-items: center;
    }
    .interactive-left-col {
      width: 100%;
      min-height: 220px !important;
      height: 220px !important;
      flex: none !important;
    }
    .interactive-right-col {
      width: 100%;
      flex: none !important;
      min-height: 380px !important;
      height: 380px !important;
    }
  }
`;

export default function LessonPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--t1)' }}>Loading Quest Lesson...</div>}>
      <LessonPageRouter />
    </Suspense>
  );
}

function LessonPageRouter() {
  const searchParams = useSearchParams();
  const questId = searchParams.get('questId') || '';
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // Check COURSES_REGISTRY first for authoritative course curriculum
  let questData: any = null;
  for (const course of COURSES_REGISTRY) {
    const found = (course.quests || []).find(q => q.id === questId);
    if (found) {
      questData = found;
      break;
    }
  }

  // Fallback to custom AI-generated roadmap modules in localStorage if not in standard registry
  if (!questData && typeof window !== 'undefined' && userId) {
    try {
      const moduleKeys = Object.keys(localStorage).filter(k => k.startsWith(`pinit_${userId}_roadmap_modules`));
      for (const key of moduleKeys) {
        const saved = localStorage.getItem(key);
        if (saved) {
          const mods = JSON.parse(saved);
          if (Array.isArray(mods)) {
            for (const mod of mods) {
              const found = (mod.quests || []).find((q: any) => q.id === questId);
              if (found) {
                questData = found;
                break;
              }
            }
          }
        }
        if (questData) break;
      }
    } catch (e) {
      console.error('Failed to load quest from roadmap modules:', e);
    }
  }

  // Final fallback if not found anywhere
  if (!questData) {
    questData = {
      id: questId || 'java-basics-lecture',
      title: 'Quest Class Lesson',
      desc: 'Review core concepts and syllabus requirements with your digital teacher.',
      syllabus: [
        'Understand foundational syntax structures',
        'Verify edge case conditions and loops',
        'Review architecture patterns and optimizations'
      ]
    };
  }

  if (questData?.type === 'coding' || (questId && (questId.includes('-exam-') || questId.includes('-assign-')))) {
    return <QuestWorkspaceClient questId={questId} />;
  }

  return <LessonPageContent questId={questId} questData={questData} />;
}

function LessonPageContent({ questId, questData }: { questId: string; questData: any }) {
  const searchParams = useSearchParams();
  const teacherId = searchParams.get('teacherId') || 'kashyap';
  const { user } = useAuth();
  const { addCompletedQuest } = useCareerOS();

  const teacher = TEACHER_METADATA[teacherId] || TEACHER_METADATA.kashyap;
  const state = useLessonState(teacherId);

  const resolveQuestId = useCallback(() => {
    if (questId) return questId;
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('questId') || '';
  }, [questId]);

  const finishLessonAndReturn = useCallback(() => {
    if (state.returningRef.current) return;
    state.returningRef.current = true;
    const id = resolveQuestId();
    if (id) {
      const course = COURSES_REGISTRY.find(c => (c.quests || []).some(q => q.id === id));
      addCompletedQuest(id, true, 150, course?.id);
    }
    toast.success('Stage Completed!', 'Heading back to the quest roadmap.');
    stopSpeaking();
    window.location.assign('/quests/');
  }, [resolveQuestId, addCompletedQuest, state.returningRef]);

  const engine = useLessonEngine({
    questId,
    questData,
    teacherId,
    user,
    addCompletedQuest,
    state,
    finishLessonAndReturn,
  });

  const syllabus: string[] = Array.isArray(questData?.syllabus) ? questData.syllabus : [];
  const totalSlides = (state.slides.length || syllabus.length) + 2;
  const isLastSlide = state.currentSlide === (state.slides.length || syllabus.length) + 1;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: '0',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'relative'
    }} className="animate-fade-in">
      <style>{lessonStyles}</style>

      {/* Return Button */}
      <button
        onClick={() => window.location.assign('/quests/')}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '8px 16px',
          color: 'var(--t2)',
          cursor: 'pointer',
          fontSize: 11.5,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          zIndex: 10,
          transition: 'all 0.2s'
        }}
      >
        ⏮ Return to Quest Roadmap
      </button>

      {/* Main lesson content */}
      {!state.isHydrated ? (
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t2)', fontSize: 13, fontWeight: 700, gap: 8 }}>
          ⚡ Synchronizing Classroom Environment...
        </div>
      ) : (
        <div className="lesson-card">
          <LessonHeader
            questTitle={questData.title}
            isFocusMusicEnabled={state.isFocusMusicEnabled}
            setIsFocusMusicEnabled={state.setIsFocusMusicEnabled}
            soundscapeVol={state.soundscapeVol}
            setSoundscapeVol={state.setSoundscapeVol}
            isAudioUnlocked={state.isAudioUnlocked}
            setIsAudioUnlocked={state.setIsAudioUnlocked}
            playSpeech={engine.playSpeech}
            stopSpeaking={stopSpeaking}
            setIsPlaying={state.setIsPlaying}
            setIsInteractive={state.setIsInteractive}
            currentSlide={state.currentSlide}
            setCurrentSlide={state.setCurrentSlide}
            totalSlides={totalSlides}
            isInteractive={state.isInteractive}
            examPassed={state.examPassed}
          />

          <LessonContentRenderer
            userId={user?.id || 'guest'}
            teacherId={teacherId}
            teacher={teacher}
            questId={questId}
            questData={questData}
            currentSlide={state.currentSlide}
            slides={state.slides}
            slidesLoading={state.slidesLoading}
            syllabus={syllabus}
            isPlaying={state.isPlaying}
            setIsPlaying={state.setIsPlaying}
            latestAIResponse={state.latestAIResponse}
            getSpeakerText={engine.getSpeakerText}
            isInteractive={state.isInteractive}
            setIsInteractive={state.setIsInteractive}
            chatMessages={state.chatMessages}
            setChatMessages={state.setChatMessages}
            chatLoading={state.chatLoading}
            chatInput={state.chatInput}
            setChatInput={state.setChatInput}
            chatBottomRef={state.chatBottomRef}
            isRecording={state.isRecording}
            startVoiceInput={engine.startVoiceInput}
            sendInteractiveMessage={engine.sendInteractiveMessage}
            understandingConfirmed={state.understandingConfirmed}
            setUnderstandingConfirmed={state.setUnderstandingConfirmed}
            handleNextSlide={engine.handleNextSlide}
            codeRunning={state.codeRunning}
            codeOutputs={state.codeOutputs}
            simulateCodeRun={engine.simulateCodeRun}
            isLastSlide={isLastSlide}
            examPassed={state.examPassed}
            examQuestionIndex={state.examQuestionIndex}
            setExamQuestionIndex={state.setExamQuestionIndex}
            selectedMcqAnswer={state.selectedMcqAnswer}
            setSelectedMcqAnswer={state.setSelectedMcqAnswer}
            mcqChecked={state.mcqChecked}
            setMcqChecked={state.setMcqChecked}
            mcqIsCorrect={state.mcqIsCorrect}
            setMcqIsCorrect={state.setMcqIsCorrect}
            setExamPassed={state.setExamPassed}
            playChime={engine.playChime}
            launchConfetti={engine.launchConfetti}
          />

          <LessonNavigationBar
            currentSlide={state.currentSlide}
            handlePrevSlide={engine.handlePrevSlide}
            handleNextSlide={engine.handleNextSlide}
            stopSpeaking={stopSpeaking}
            setIsPlaying={state.setIsPlaying}
            isInteractive={state.isInteractive}
            setIsInteractive={state.setIsInteractive}
            teacher={teacher}
            isLastSlide={isLastSlide}
            examPassed={state.examPassed}
            finishLessonAndReturn={finishLessonAndReturn}
            slidesLength={state.slides.length || syllabus.length}
            understandingConfirmed={state.understandingConfirmed}
          />
        </div>
      )}

      <LessonCompletionModal
        examPassed={state.examPassed}
        confettiParticles={state.confettiParticles}
        finishLessonAndReturn={finishLessonAndReturn}
      />
    </div>
  );
}
