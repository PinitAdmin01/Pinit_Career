'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Difficulty, GameId, IntelligenceScores } from './types';
import { CompletionBanner, DifficultyPicker } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';
import { GameShell } from './GameShell';
import { playSound } from './types';
import { useSprintClock } from './useSprintClock';
import {
  createMindMosaicSet,
  createIqPuzzleSet,
  scoreIqPuzzleSet,
  scoreMindMosaic,
  type MindScenario,
  type PuzzleArea,
} from './intelligenceGameData';

interface IntelligenceGameProps {
  gameId: GameId;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  completedDifficulties?: Record<string, Difficulty[]>;
  soundMuted: boolean;
  onComplete: (score: number, accuracy: number, dimensions: IntelligenceScores) => void;
  onExit: () => void;
}

type PlayPhase = 'ready' | 'countdown' | 'playing' | 'feedback' | 'done';

const AREA_LABELS: Record<PuzzleArea, string> = {
  logic: 'Logic', numerical: 'Numbers', pattern: 'Patterns', verbal: 'Verbal reasoning',
};

function useSafeTimeout() {
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clear = useCallback(() => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = null;
  }, []);
  useEffect(() => clear, [clear]);
  return { ref, clear };
}

function ProgressDots({ total, active, complete }: { total: number; active: number; complete: number }) {
  return (
    <div className="ci-progress" aria-label={`Challenge ${Math.min(active + 1, total)} of ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index < complete ? 'is-complete' : index === active ? 'is-active' : ''} />
      ))}
    </div>
  );
}

function DimensionBreakdown({ values }: { values: Partial<Record<string, number>> }) {
  return (
    <div className="ci-breakdown">
      {Object.entries(values).filter((entry): entry is [string, number] => typeof entry[1] === 'number').map(([label, value]) => (
        <div className="ci-breakdown-row" key={label}>
          <div><span>{label}</span><strong>{value}%</strong></div>
          <div className="ci-meter"><i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

export function IqPuzzleGame({ gameId, difficulty, onDifficultyChange, completedDifficulties, soundMuted, onComplete, onExit }: IntelligenceGameProps) {
  const [phase, setPhase] = useState<PlayPhase>('ready');
  const [questions, setQuestions] = useState(() => createIqPuzzleSet(difficulty));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const answersRef = useRef<Array<number | null>>([]);
  const hasReportedRef = useRef(false);
  const answerLockedRef = useRef(false);
  const advanceTimeout = useSafeTimeout();
  const question = questions[questionIndex];
  const result = useMemo(() => scoreIqPuzzleSet(questions, answers), [questions, answers]);
  const timeLeft = useSprintClock(phase === 'playing' || phase === 'feedback', () => {
    advanceTimeout.clear();
    setPhase('done');
  });

  const startRound = useCallback(() => {
    advanceTimeout.clear();
    const nextQuestions = createIqPuzzleSet(difficulty);
    setQuestions(nextQuestions);
    setQuestionIndex(0);
    setAnswers([]);
    answersRef.current = [];
    setSelectedAnswer(null);
    answerLockedRef.current = false;
    hasReportedRef.current = false;
    setPhase('playing');
  }, [advanceTimeout, difficulty]);

  const answer = useCallback((choice: number | null) => {
    if (phase !== 'playing' || answerLockedRef.current || !question) return;
    answerLockedRef.current = true;
    setSelectedAnswer(choice);
    const nextAnswers = [...answersRef.current, choice];
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    setPhase('feedback');
    if (choice === question.answer) playSound('correct', soundMuted);
    else playSound('wrong', soundMuted);

    advanceTimeout.ref.current = setTimeout(() => {
      if (questionIndex + 1 >= questions.length) {
        setPhase('done');
        return;
      }
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer(null);
      answerLockedRef.current = false;
      setPhase('playing');
    }, 1350);
  }, [advanceTimeout, phase, question, questionIndex, questions.length, soundMuted]);

  const reportResult = useCallback(() => {
    if (hasReportedRef.current) return;
    hasReportedRef.current = true;
    onComplete(result.score, result.score, { reasoning: result.score });
  }, [onComplete, result.score]);

  return (
    <GameShell
      accent="violet"
      mark="logic"
      title="IQ Puzzle Arena"
      description="Four quick puzzles—one each in logic, numbers, patterns, and words. Your score is practice, not an IQ measurement."
      phase={phase}
      onExit={onExit}
      wide
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={startRound} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      startLabel="Enter the arena"
      doneTitle={result.score >= 80 ? 'Sharp thinking' : result.score >= 50 ? 'Good work—keep stretching' : 'A useful first run'}
      doneScore={`${result.score}%`}
      doneHint={`${result.correct} correct across ${answers.filter((value) => value !== null).length} answered · practice reasoning score`}
      doneExtra={<DimensionBreakdown values={{ Logic: result.areaScores.logic, Numbers: result.areaScores.numerical, Patterns: result.areaScores.pattern, Verbal: result.areaScores.verbal }} />}
      onClaim={() => { reportResult(); onExit(); }}
      onReplay={() => { advanceTimeout.clear(); setPhase('ready'); }}
    >
      {phase === 'playing' || phase === 'feedback' ? (
        <section className="ci-challenge" aria-live="polite">
          <div className="ci-challenge-head">
            <div><span className="ci-eyebrow">{question ? AREA_LABELS[question.area] : 'Reasoning'}</span><strong>Question {questionIndex + 1}<small> / {questions.length}</small></strong></div>
            <div className={`ci-timer${timeLeft <= 7 ? ' is-urgent' : ''}`} aria-label={`${timeLeft} seconds remaining`}>{timeLeft}<small>s</small></div>
          </div>
          <ProgressDots total={questions.length} active={questionIndex} complete={answers.length} />
          <h2 className="ci-question">{question?.prompt}</h2>
          <div className="ci-options" role="group" aria-label="Answer choices">
            {question?.choices.map((choice, index) => {
              const isCorrect = phase === 'feedback' && index === question.answer;
              const isChosenWrong = phase === 'feedback' && index === selectedAnswer && index !== question.answer;
              return (
                <button
                  key={`${question.id}-${index}`}
                  type="button"
                  className={`ci-option${isCorrect ? ' is-correct' : ''}${isChosenWrong ? ' is-wrong' : ''}`}
                  onClick={() => answer(index)}
                  disabled={phase !== 'playing'}
                  aria-pressed={selectedAnswer === index}
                >
                  <span className="ci-option-key">{String.fromCharCode(65 + index)}</span><span>{choice}</span>
                </button>
              );
            })}
          </div>
          {phase === 'feedback' && (
            <div className={`ci-feedback${selectedAnswer === question?.answer ? ' is-positive' : ''}`} role="status">
              <strong>{selectedAnswer === null ? 'Time is up' : selectedAnswer === question?.answer ? 'That’s it' : 'Not quite'}</strong>
              <p>{question?.explanation}</p>
            </div>
          )}
          <div className="ci-challenge-foot"><span>Take a breath; accuracy matters more than speed.</span><span>{answers.filter((value) => value !== null).length} answered</span></div>
        </section>
      ) : null}
    </GameShell>
  );
}

export function MindMosaicGame({ gameId, difficulty, onDifficultyChange, completedDifficulties, soundMuted, onComplete, onExit }: IntelligenceGameProps) {
  const [phase, setPhase] = useState<PlayPhase>('ready');
  const [scenarios, setScenarios] = useState(() => createMindMosaicSet(difficulty));
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const answersRef = useRef<Array<number | null>>([]);
  const answerLockedRef = useRef(false);
  const hasReportedRef = useRef(false);
  const advanceTimeout = useSafeTimeout();
  const scenario: MindScenario | undefined = scenarios[scenarioIndex];
  const result = useMemo(() => scoreMindMosaic(scenarios, answers), [scenarios, answers]);
  const timeLeft = useSprintClock(phase === 'playing' || phase === 'feedback', () => {
    advanceTimeout.clear();
    setPhase('done');
  });

  const startRound = useCallback(() => {
    advanceTimeout.clear();
    const nextScenarios = createMindMosaicSet(difficulty);
    setScenarios(nextScenarios);
    setScenarioIndex(0);
    setAnswers([]);
    answersRef.current = [];
    setSelectedAnswer(null);
    answerLockedRef.current = false;
    hasReportedRef.current = false;
    setPhase('playing');
  }, [advanceTimeout, difficulty]);

  const resolveChoice = useCallback((choice: number | null) => {
    if (phase !== 'playing' || answerLockedRef.current || !scenario) return;
    answerLockedRef.current = true;
    setSelectedAnswer(choice);
    const nextAnswers = [...answersRef.current, choice];
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    setPhase('feedback');
    if (choice !== null && scenario.choices[choice]?.points === 2) playSound('correct', soundMuted);
    else playSound('click', soundMuted);
    advanceTimeout.ref.current = setTimeout(() => {
      if (scenarioIndex + 1 >= scenarios.length) {
        setPhase('done');
        return;
      }
      setScenarioIndex(scenarioIndex + 1);
      setSelectedAnswer(null);
      answerLockedRef.current = false;
      setPhase('playing');
    }, 1900);
  }, [advanceTimeout, phase, scenario, scenarioIndex, scenarios.length, soundMuted]);

  const reportResult = useCallback(() => {
    if (hasReportedRef.current) return;
    hasReportedRef.current = true;
    onComplete(result.score, result.score, result.dimensionScores);
  }, [onComplete, result.dimensionScores, result.score]);

  const dimensionLabels = { creative: 'Creative', executive: 'Executive', social: 'Social' };

  return (
    <GameShell
      accent="teal"
      mark="store"
      title="Mind Mosaic"
      description="Make one thoughtful call each in creativity, prioritization, and people sense—in a 15-second sprint."
      phase={phase}
      onExit={onExit}
      wide
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={startRound} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      startLabel="Start the story"
      doneTitle={result.score >= 80 ? 'A thoughtful run' : result.score >= 50 ? 'Good instincts to build on' : 'Every choice gives you something to learn'}
      doneScore={`${result.score}%`}
      doneHint={`${result.totalPoints} of ${result.maxPoints} decision-quality points · practice signal, not a fixed trait score`}
      doneExtra={<DimensionBreakdown values={{
        Creative: result.dimensionScores.creative,
        Executive: result.dimensionScores.executive,
        Social: result.dimensionScores.social,
      }} />}
      onClaim={() => { reportResult(); onExit(); }}
      onReplay={() => { advanceTimeout.clear(); setPhase('ready'); }}
    >
      {phase === 'playing' || phase === 'feedback' ? (
        <section className="ci-challenge ci-mosaic" aria-live="polite">
          <div className="ci-challenge-head">
          <div><span className="ci-eyebrow">{scenario ? dimensionLabels[scenario.dimension] : 'Decision lab'}</span><strong>Scenario {scenarioIndex + 1}<small> / {scenarios.length}</small></strong></div>
            <div className={`ci-timer${timeLeft <= 8 ? ' is-urgent' : ''}`} aria-label={`${timeLeft} seconds remaining`}>{timeLeft}<small>s</small></div>
          </div>
          <ProgressDots total={scenarios.length} active={scenarioIndex} complete={answers.length} />
          <div className="ci-scenario-card">
            <span className="ci-scenario-kicker">THE SITUATION</span>
            <h2>{scenario?.title}</h2>
            <p>{scenario?.context}</p>
            <div className="ci-constraint"><span>CONSTRAINT</span>{scenario?.constraint}</div>
          </div>
          <div className="ci-options ci-scenario-options" role="group" aria-label="Choose your approach">
            {scenario?.choices.map((choice, index) => {
              const isChosen = selectedAnswer === index;
              const isBest = phase === 'feedback' && choice.points === 2;
              return (
                <button
                  key={`${scenario.id}-${index}`}
                  type="button"
                  className={`ci-option${isChosen ? ' is-selected' : ''}${isBest ? ' is-correct' : ''}`}
                  onClick={() => resolveChoice(index)}
                  disabled={phase !== 'playing'}
                  aria-pressed={isChosen}
                >
                  <span className="ci-option-key">{String.fromCharCode(65 + index)}</span><span>{choice.label}</span>
                </button>
              );
            })}
          </div>
          {phase === 'feedback' && (
            <div className={`ci-feedback${selectedAnswer !== null && scenario?.choices[selectedAnswer]?.points === 2 ? ' is-positive' : ''}`} role="status">
              <strong>{selectedAnswer === null ? 'The clock ran out' : `${scenario?.choices[selectedAnswer]?.points || 0} / 2 · ${dimensionLabels[scenario?.dimension || 'creative']} lens`}</strong>
              <p>{selectedAnswer === null ? 'Pausing to gather more context can be a choice, but in this round the opportunity to act has passed.' : scenario?.choices[selectedAnswer]?.feedback}</p>
            </div>
          )}
          <div className="ci-challenge-foot"><span>Look for impact, evidence, and how people are affected.</span><span>{answers.filter((value) => value !== null).length} decided</span></div>
        </section>
      ) : null}
    </GameShell>
  );
}
