// src/app/onboarding/components/LifeQuestionsStep.tsx
'use client';

/**
 * The onboarding questions: 3 about you + 6 daily-life scenes (+1 tie-breaker only when needed).
 * One question per screen, big tap targets, sized to fit without scrolling.
 * Questions and scoring: src/lib/onboarding/lifeQuestions.ts
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  answerFor,
  isComplete,
  questionSequence,
  MAX_QUESTIONS,
  type LifeAnswer,
  type LifeOption,
  type LifeQuestion,
} from '@/lib/onboarding/lifeQuestions';

export interface LifeQuestionsStepProps {
  onComplete: (answers: LifeAnswer[]) => void;
  onBack: () => void;
  /** Called when a new question appears (the mentor reads it out). */
  onQuestion?: (question: LifeQuestion) => void;
}

/** Daily-life options are shown in a random order (kept for the visit, so Back shows the same order). */
function shuffled(options: LifeOption[]): LifeOption[] {
  const list = [...options];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export default function LifeQuestionsStep({ onComplete, onBack, onQuestion }: LifeQuestionsStepProps) {
  const [answers, setAnswers] = useState<LifeAnswer[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const shownAt = useRef(Date.now());
  const order = useRef<Record<string, string[]>>({});
  const onQuestionRef = useRef(onQuestion);
  onQuestionRef.current = onQuestion;

  const sequence = questionSequence(answers);
  const question = sequence[Math.min(index, sequence.length - 1)];
  if (question.section === 'life' && !order.current[question.id]) {
    order.current[question.id] = shuffled(question.options).map((o) => o.id);
  }
  const options = order.current[question.id]
    ? order.current[question.id].map((id) => question.options.find((o) => o.id === id)).filter((o): o is LifeOption => Boolean(o))
    : question.options;
  const current = answerFor(answers, question);
  const total = Math.max(sequence.length, index + 1);

  useEffect(() => {
    shownAt.current = Date.now();
    onQuestionRef.current?.(question);
  }, [question.id]); // eslint-disable-line react-hooks/exhaustive-deps -- announce each new question once

  const choose = useCallback((option: LifeOption) => {
    if (picked) return;
    setPicked(option.id);
    const next = [
      ...answers.filter((a) => a.questionId !== question.id),
      { questionId: question.id, optionId: option.id, timestamp: Date.now(), responseTimeMs: Date.now() - shownAt.current },
    ];
    window.setTimeout(() => {
      setAnswers(next);
      setPicked(null);
      const seq = questionSequence(next);
      if (isComplete(next) && index + 1 >= seq.length) {
        onComplete(next);
        return;
      }
      // Next unanswered question (normally the next one; after a changed answer, the first gap).
      const gap = seq.findIndex((q, i) => i > index && !answerFor(next, q));
      const firstGap = seq.findIndex((q) => !answerFor(next, q));
      setIndex(gap >= 0 ? gap : firstGap >= 0 ? firstGap : Math.min(index + 1, seq.length - 1));
    }, 260);
  }, [answers, index, onComplete, picked, question]);

  const goBack = useCallback(() => {
    if (picked) return;
    if (index === 0) onBack();
    else setIndex(index - 1);
  }, [index, onBack, picked]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) choose(options[n - 1]);
      else if (e.key === 'ArrowLeft' || e.key === 'Backspace') goBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, goBack, options]);

  const isTieBreaker = question.id.startsWith('T_');
  const sectionLabel = question.section === 'about' ? 'About you' : isTieBreaker ? 'One last question' : 'Your daily life';
  const two = options.length <= 2;

  return (
    <div className="lq-root">
      <div className="lq-top">
        <button type="button" className="lq-back" onClick={goBack} aria-label="Go back">
          ← Back
        </button>
        <span className="lq-count" aria-live="polite">
          Question {index + 1} of {Math.min(MAX_QUESTIONS, total)}
        </span>
      </div>
      <div className="lq-bar" aria-hidden="true">
        <div className="lq-bar-fill" style={{ width: `${((index + 1) / Math.min(MAX_QUESTIONS, total)) * 100}%` }} />
      </div>

      <div className="lq-body">
        <span className="lq-chip">{sectionLabel}</span>
        <h2 className="lq-question">{question.text}</h2>

        <div className={`lq-grid${two ? ' lq-grid-two' : ''}`} role="group" aria-label={question.text}>
          {options.map((option, i) => {
            const selected = picked === option.id || (!picked && current?.id === option.id);
            return (
              <button
                key={option.id}
                type="button"
                className={`lq-option${selected ? ' lq-option-on' : ''}`}
                onClick={() => choose(option)}
                disabled={Boolean(picked)}
                aria-pressed={selected}
              >
                <span className="lq-icon" aria-hidden="true">{option.icon}</span>
                <span className="lq-label">{option.label}</span>
                <span className="lq-key" aria-hidden="true">{i + 1}</span>
              </button>
            );
          })}
        </div>
        <p className="lq-hint">Tap the answer that feels most like you. There are no wrong answers.</p>
      </div>

      <style>{`
        .lq-root { height: 100%; min-height: 0; display: flex; flex-direction: column; overflow: hidden;
          padding: clamp(14px, 2.2vh, 26px) clamp(18px, 2.2vw, 36px); gap: clamp(8px, 1.4vh, 14px); color: #f8fafc; }
        .lq-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .lq-back { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); color: #f1f5f9;
          border-radius: 999px; padding: 8px 18px; font-size: 16px; font-weight: 700; cursor: pointer; }
        .lq-back:hover { background: rgba(255,255,255,0.14); }
        .lq-count { font-size: 16px; font-weight: 700; color: #cbd5e1; }
        .lq-bar { height: 8px; border-radius: 999px; background: rgba(255,255,255,0.1); overflow: hidden; flex-shrink: 0; }
        .lq-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--brand, #6366f1), var(--accent, #22d3ee)); transition: width 0.3s ease; }
        .lq-body { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; gap: clamp(10px, 2vh, 22px); }
        .lq-chip { align-self: flex-start; font-size: 15px; font-weight: 800; letter-spacing: 0.3px; color: #a5b4fc;
          background: rgba(99,102,241,0.16); border: 1px solid rgba(129,140,248,0.4); border-radius: 999px; padding: 5px 14px; }
        .lq-question { margin: 0; font-size: clamp(26px, 2.2vw + 1.2vh, 40px); line-height: 1.2; font-weight: 800; color: #ffffff; letter-spacing: -0.3px; }
        .lq-grid { flex: 0 1 auto; min-height: 0; max-height: 440px; display: grid; grid-template-columns: 1fr 1fr;
          grid-auto-rows: minmax(0, 1fr); gap: clamp(10px, 1.6vh, 18px); }
        .lq-grid-two { grid-template-columns: 1fr 1fr; max-height: 260px; }
        .lq-option { position: relative; min-height: clamp(84px, 13vh, 150px); display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: clamp(6px, 1vh, 10px); padding: 12px 14px; border-radius: 20px; cursor: pointer; text-align: center;
          background: rgba(255,255,255,0.07); border: 2px solid rgba(255,255,255,0.16); color: #f8fafc;
          transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease; }
        .lq-option:hover:not(:disabled) { background: rgba(99,102,241,0.2); border-color: rgba(129,140,248,0.75); transform: translateY(-2px); }
        .lq-option:focus-visible { outline: 3px solid #a5b4fc; outline-offset: 2px; }
        .lq-option:disabled { cursor: default; }
        .lq-option-on { background: linear-gradient(135deg, var(--brand, #6366f1), var(--accent, #22d3ee)); border-color: transparent; color: #ffffff; }
        .lq-icon { font-size: clamp(30px, 2.2vw + 1vh, 44px); line-height: 1; }
        .lq-label { font-size: clamp(18px, 1vw + 0.9vh, 24px); font-weight: 800; line-height: 1.25; }
        .lq-key { position: absolute; top: 8px; right: 12px; font-size: 13px; font-weight: 800; color: rgba(255,255,255,0.45); }
        .lq-hint { margin: 0; font-size: 16px; color: #cbd5e1; }
        @media (max-height: 640px) { .lq-hint { display: none; } }
      `}</style>
    </div>
  );
}
