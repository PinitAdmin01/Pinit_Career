'use client';

import React, { useState, useEffect } from 'react';
import {
  FSRSCard,
  Rating,
  State,
  createEmptyCard,
  scheduleNextReview,
  calculateRetention,
  getDueCards,
  DEFAULT_FSRS_PARAMS
} from '@/lib/learning/fsrsScheduler';

export interface ConceptCard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  course: string;
  fsrs: FSRSCard;
}

const INITIAL_CONCEPTS: Omit<ConceptCard, 'fsrs'>[] = [
  {
    id: 'c_react_hooks_rule',
    course: 'Full-Stack React Web Development',
    topic: 'React Hooks Invariant',
    question: 'Why must React Hooks only be called at the top level of a component?',
    answer: 'React relies on the call order of hooks across renders to preserve state indices in fiber nodes. Calling hooks inside loops or conditions alters the call sequence, causing state desynchronization.'
  },
  {
    id: 'c_rsc_boundary',
    course: 'Full-Stack React Web Development',
    topic: 'Server Components Boundary',
    question: 'What is the primary architectural purpose of the "use client" directive in Next.js 14?',
    answer: 'It defines the boundary between Server Components and Client Components in the component tree, allowing the child tree to use client-side interactive APIs, React hooks, and browser event listeners.'
  },
  {
    id: 'c_cap_theorem',
    course: 'Distributed Systems',
    topic: 'CAP Theorem Invariant',
    question: 'During a network partition in a distributed system, what trade-off must be chosen according to CAP?',
    answer: 'The system must choose between Consistency (returning an error/refusing writes when nodes are partitioned) or Availability (accepting writes on reachable nodes that may return stale data).'
  },
  {
    id: 'c_db_b_tree',
    course: 'Database Engineering',
    topic: 'B-Tree Indexing',
    question: 'Why are B-Trees preferred over Binary Search Trees for on-disk database indexes?',
    answer: 'B-Trees have high branching factors (wide nodes matching disk block sizes), which drastically reduces tree height and disk I/O seek operations compared to deep binary search trees.'
  },
  {
    id: 'c_pin_reset',
    course: 'PinIT Platform Architecture',
    topic: 'Economy Rules',
    question: 'What are the two valid mechanisms to increase Pin balance in Career OS?',
    answer: 'Direct Purchase and the daily 1:00 AM server-verified reset to 120 pins. Completing activities/quests grants 0 pins.'
  }
];

const DECK_STORAGE_KEY = 'pinit_fsrs_concept_deck';

export default function SpacedReviewQueue() {
  const [deck, setDeck] = useState<ConceptCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize deck from storage or initial concept seed
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DECK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validated = parsed.map((card: any) => ({
            ...card,
            fsrs: card.fsrs?.due ? card.fsrs : createEmptyCard(card.id || 'card')
          }));
          setDeck(validated);
          return;
        }
      }
    } catch {}

    // Seed initial deck
    const seeded = INITIAL_CONCEPTS.map(c => ({
      ...c,
      fsrs: createEmptyCard(c.id)
    }));
    setDeck(seeded);
    try {
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(seeded));
    } catch {}
  }, []);

  const saveDeck = (updated: ConceptCard[]) => {
    setDeck(updated);
    try {
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const dueCards = deck.filter(c => c.fsrs.due <= Date.now() || c.fsrs.state === State.New);
  const currentCard = dueCards[currentIndex];

  const handleRate = (rating: Rating) => {
    if (!currentCard) return;

    const nextFsrs = scheduleNextReview(currentCard.fsrs, rating, DEFAULT_FSRS_PARAMS, Date.now());
    const updatedDeck = deck.map(c => (c.id === currentCard.id ? { ...c, fsrs: nextFsrs } : c));

    saveDeck(updatedDeck);
    setIsAnswerRevealed(false);

    if (currentIndex + 1 < dueCards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const retentionPercent = currentCard
    ? Math.round(calculateRetention(currentCard.fsrs, Date.now()) * 100)
    : 0;

  return (
    <div className="w-full bg-[#0F172A] border border-cyan-500/30 rounded-2xl p-6 shadow-xl text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-wide">🧠 Spaced Repetition Memory Engine</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
              FSRS-4.5
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Optimizes long-term memory retention using mathematical forgetting curve scheduling.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-cyan-400">{dueCards.length} Due Today</div>
          <div className="text-[11px] text-slate-500">Target Retention: 90%</div>
        </div>
      </div>

      {isCompleted || dueCards.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl font-bold shadow-lg shadow-emerald-950/50">
            ✓
          </div>
          <h3 className="text-lg font-bold text-white">All Concept Reviews Complete!</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            You have reviewed all scheduled concepts. The FSRS-4.5 engine will calculate the next optimal review interval based on your memory stability.
          </p>
          <button
            onClick={() => {
              setIsCompleted(false);
              setCurrentIndex(0);
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 rounded-xl hover:bg-cyan-600/30 transition-all"
          >
            Review Entire Deck Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card Meta */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-medium">
              {currentCard.course}
            </span>
            <div className="flex items-center gap-3">
              <span>Reps: <strong className="text-white">{currentCard.fsrs.reps}</strong></span>
              <span>Stability: <strong className="text-cyan-400">{currentCard.fsrs.stability}d</strong></span>
              <span>Estimated Retention: <strong className="text-emerald-400">{retentionPercent}%</strong></span>
            </div>
          </div>

          {/* Flashcard Box */}
          <div className="bg-[#1E293B]/70 border border-slate-700/80 rounded-xl p-6 min-h-[220px] flex flex-col justify-between shadow-inner">
            <div>
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                Concept #{currentIndex + 1}: {currentCard.topic}
              </span>
              <h3 className="text-base font-semibold text-white leading-relaxed">
                {currentCard.question}
              </h3>
            </div>

            {isAnswerRevealed && (
              <div className="mt-4 pt-4 border-t border-slate-700/60 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Mastery Explanation
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {currentCard.answer}
                </p>
              </div>
            )}
          </div>

          {/* Action Controls */}
          {!isAnswerRevealed ? (
            <button
              onClick={() => setIsAnswerRevealed(true)}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-950/40 transition-all"
            >
              Reveal Answer & Verify Memory
            </button>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => handleRate(Rating.Again)}
                className="py-2.5 px-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold transition-all flex flex-col items-center"
              >
                <span>Again (1)</span>
                <span className="text-[10px] text-red-400/70 mt-0.5">Lapse (Reset)</span>
              </button>
              <button
                onClick={() => handleRate(Rating.Hard)}
                className="py-2.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold transition-all flex flex-col items-center"
              >
                <span>Hard (2)</span>
                <span className="text-[10px] text-amber-400/70 mt-0.5">Short Interval</span>
              </button>
              <button
                onClick={() => handleRate(Rating.Good)}
                className="py-2.5 px-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold transition-all flex flex-col items-center"
              >
                <span>Good (3)</span>
                <span className="text-[10px] text-cyan-400/70 mt-0.5">Standard Interval</span>
              </button>
              <button
                onClick={() => handleRate(Rating.Easy)}
                className="py-2.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold transition-all flex flex-col items-center"
              >
                <span>Easy (4)</span>
                <span className="text-[10px] text-emerald-400/70 mt-0.5">Extended Interval</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
