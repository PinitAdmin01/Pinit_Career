import { useState, useRef } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConfettiParticle {
  id: number;
  size: number;
  color: string;
  transform: string;
  transition: string;
}

export function useLessonState(teacherId: string = 'kashyap') {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentSlideRef = useRef(currentSlide);
  currentSlideRef.current = currentSlide;

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const codeRunIntervalsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

  const getSpeakerTextRef = useRef<() => string>(() => '');
  const teacherIdRef = useRef(teacherId);
  teacherIdRef.current = teacherId;

  // Dynamic slides state
  const [slides, setSlides] = useState<any[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const slidesLengthRef = useRef(0);

  // Understanding checkpoints per slide
  const [understandingConfirmed, setUnderstandingConfirmed] = useState<Record<number, boolean>>({});
  const [teachingCompleted, setTeachingCompleted] = useState(false);

  // Final Exam slide states
  const [examQuestionIndex, setExamQuestionIndex] = useState(0);
  const [selectedMcqAnswer, setSelectedMcqAnswer] = useState<number | null>(null);
  const [mcqChecked, setMcqChecked] = useState(false);
  const [mcqIsCorrect, setMcqIsCorrect] = useState(false);
  const [examPassed, setExamPassed] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);

  const [codeRunning, setCodeRunning] = useState<Record<number, boolean>>({});
  const [codeOutputs, setCodeOutputs] = useState<Record<number, string>>({});

  const [isHydrated, setIsHydrated] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [isFocusMusicEnabled, setIsFocusMusicEnabled] = useState(false);
  const [soundscapeVol, setSoundscapeVol] = useState<number>(50);

  const [isInteractive, setIsInteractive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [latestAIResponse, setLatestAIResponse] = useState('');
  const [doubtCount, setDoubtCount] = useState(0);

  const returningRef = useRef(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  return {
    currentSlide, setCurrentSlide, currentSlideRef,
    isPlaying, setIsPlaying,
    audioProgress, setAudioProgress,
    timerRef, codeRunIntervalsRef,
    getSpeakerTextRef, teacherIdRef,
    slides, setSlides, slidesLoading, setSlidesLoading, slidesLengthRef,
    understandingConfirmed, setUnderstandingConfirmed,
    teachingCompleted, setTeachingCompleted,
    examQuestionIndex, setExamQuestionIndex,
    selectedMcqAnswer, setSelectedMcqAnswer,
    mcqChecked, setMcqChecked,
    mcqIsCorrect, setMcqIsCorrect,
    examPassed, setExamPassed,
    isRecording, setIsRecording,
    confettiParticles, setConfettiParticles,
    codeRunning, setCodeRunning,
    codeOutputs, setCodeOutputs,
    isHydrated, setIsHydrated,
    isAudioUnlocked, setIsAudioUnlocked,
    isFocusMusicEnabled, setIsFocusMusicEnabled,
    soundscapeVol, setSoundscapeVol,
    isInteractive, setIsInteractive,
    chatMessages, setChatMessages,
    chatInput, setChatInput,
    chatLoading, setChatLoading,
    latestAIResponse, setLatestAIResponse,
    doubtCount, setDoubtCount,
    returningRef, chatBottomRef,
  };
}

export type LessonState = ReturnType<typeof useLessonState>;
