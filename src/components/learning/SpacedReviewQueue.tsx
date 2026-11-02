'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FSRSCard,
  Rating,
  State,
  createEmptyCard,
  scheduleNextReview,
  calculateRetention,
  DEFAULT_FSRS_PARAMS
} from '@/lib/learning/fsrsScheduler';
import { MULTI_TRACK_CONCEPT_DECKS } from '@/lib/learning/learningTwinIntelligence';

export interface ConceptCard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  course: string;
  category?: 'frontend' | 'backend' | 'commerce' | 'mistake' | 'general';
  fsrs: FSRSCard;
}

const INITIAL_CONCEPTS: Omit<ConceptCard, 'fsrs'>[] = [
  {
    id: 'c_react_hooks_rule',
    course: 'Full-Stack React Web Development',
    topic: 'React Hooks Invariant',
    question: 'Why must React Hooks only be called at the top level of a component?',
    answer: 'React relies on the call order of hooks across renders to preserve state indices in fiber nodes. Calling hooks inside loops or conditions alters the call sequence, causing state desynchronization.',
    category: 'frontend'
  },
  {
    id: 'c_rsc_boundary',
    course: 'Full-Stack React Web Development',
    topic: 'Server Components Boundary',
    question: 'What is the primary architectural purpose of the "use client" directive in Next.js 14?',
    answer: 'It defines the boundary between Server Components and Client Components in the component tree, allowing the child tree to use client-side interactive APIs, React hooks, and browser event listeners.',
    category: 'frontend'
  },
  {
    id: 'c_cap_theorem',
    course: 'Distributed Systems',
    topic: 'CAP Theorem Invariant',
    question: 'During a network partition in a distributed system, what trade-off must be chosen according to CAP?',
    answer: 'The system must choose between Consistency (returning an error/refusing writes when nodes are partitioned) or Availability (accepting writes on reachable nodes that may return stale data).',
    category: 'backend'
  },
  {
    id: 'c_db_b_tree',
    course: 'Database Engineering',
    topic: 'B-Tree Indexing',
    question: 'Why are B-Trees preferred over Binary Search Trees for on-disk database indexes?',
    answer: 'B-Trees have high branching factors (wide nodes matching disk block sizes), which drastically reduces tree height and disk I/O seek operations compared to deep binary search trees.',
    category: 'backend'
  },
  {
    id: 'c_dual_aspect_accounting',
    course: 'Accounting & Forensic Bookkeeping',
    topic: 'Dual Aspect Principle',
    question: 'What is the foundational invariant of the Dual Aspect Accounting equation?',
    answer: 'Assets = Liabilities + Equity. Every business transaction must have an equal and offsetting debit and credit entry so that the balance sheet remains in perpetual equilibrium.',
    category: 'commerce'
  },
  {
    id: 'c_pin_reset',
    course: 'PinIT Platform Architecture',
    topic: 'Economy Rules',
    question: 'What are the two valid mechanisms to increase Pin balance in Career OS?',
    answer: 'Direct Purchase and the daily 1:00 AM server-verified reset to 120 pins. Completing activities/quests grants 0 pins.',
    category: 'general'
  }
];

const DECK_STORAGE_KEY = 'pinit_fsrs_concept_deck';

export default function SpacedReviewQueue() {
  const [isMounted, setIsMounted] = useState(false);
  const [deck, setDeck] = useState<ConceptCard[]>([]);
  const [activeDeckFilter, setActiveDeckFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize deck from storage or initial concept seed
  useEffect(() => {
    setIsMounted(true);
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

    // Seed initial multi-track deck
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

  // Filter deck by active category
  const filteredDeck = useMemo(() => {
    if (activeDeckFilter === 'all') return deck;
    if (activeDeckFilter === 'mistake') {
      return deck.filter(c => c.id.startsWith('fsrs_') || c.category === 'mistake');
    }
    return deck.filter(c => c.category === activeDeckFilter);
  }, [deck, activeDeckFilter]);

  const dueCards = filteredDeck.filter(c => c.fsrs.due <= Date.now() || c.fsrs.state === State.New);
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

  if (!isMounted) {
    return (
      <div
        style={{
          background: 'var(--bg2)',
          border: '1.5px solid var(--border)',
          borderRadius: 20,
          padding: 32,
          textAlign: 'center',
          color: 'var(--t3)',
          fontSize: 14
        }}
      >
        Loading Spaced Repetition Memory Engine...
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--bg2)',
        border: '1.5px solid var(--border)',
        borderRadius: 20,
        padding: 24,
        boxShadow: 'var(--shadow-md)',
        color: 'var(--t1)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: 'var(--t1)' }}>
              🧠 Spaced Repetition Memory Engine (FSRS-4.5)
            </h2>
            <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--accent)' }}>
              FSRS-4.5 Verified
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--t2)' }}>
            Mathematical forgetting-curve scheduler guaranteeing 90% retention for core system invariants and resolved mistakes.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)' }}>{dueCards.length} Cards Due Today</div>
          <div style={{ fontSize: 11, color: 'var(--t3)' }}>Target Retention: 90%</div>
        </div>
      </div>

      {/* Deck Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {[
          { id: 'all', label: `🌐 All Cards (${deck.length})` },
          { id: 'frontend', label: '⚛️ Frontend & React' },
          { id: 'backend', label: '⚙️ Backend & Systems' },
          { id: 'commerce', label: '📊 Commerce & Audit' },
          { id: 'mistake', label: `⚠️ Resolved Mistakes (${deck.filter(c => c.id.startsWith('fsrs_')).length})` }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveDeckFilter(cat.id);
              setCurrentIndex(0);
              setIsCompleted(false);
              setIsAnswerRevealed(false);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: `1px solid ${activeDeckFilter === cat.id ? 'var(--accent)' : 'var(--border)'}`,
              background: activeDeckFilter === cat.id ? 'var(--accent)' : 'var(--bg3)',
              color: activeDeckFilter === cat.id ? '#fff' : 'var(--t2)',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isCompleted || dueCards.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--bg3)', borderRadius: 16, border: '1px dashed var(--border)' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--green-light)', border: '1px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: 'var(--green)', fontSize: 24, fontWeight: 900 }}>
            ✓
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: 17, fontWeight: 900, color: 'var(--t1)' }}>
            All Scheduled Concept Reviews Complete!
          </h3>
          <p style={{ margin: '0 auto 16px auto', fontSize: 13, color: 'var(--t2)', maxWidth: 440, lineHeight: 1.5 }}>
            You have reviewed all due cards in this deck. The FSRS-4.5 engine will automatically calculate the next optimal review interval based on your memory stability.
          </p>
          <button
            onClick={() => {
              setIsCompleted(false);
              setCurrentIndex(0);
            }}
            style={{
              padding: '8px 18px',
              fontSize: 12.5,
              fontWeight: 800,
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            Review Entire Deck Again ➔
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Card Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--t3)' }}>
            <span style={{ padding: '3px 8px', background: 'var(--bg3)', borderRadius: 6, border: '1px solid var(--border)', fontWeight: 700, color: 'var(--t2)' }}>
              {currentCard.course}
            </span>
            <div style={{ display: 'flex', gap: 12 }}>
              <span>Reps: <strong style={{ color: 'var(--t1)' }}>{currentCard.fsrs.reps}</strong></span>
              <span>Stability: <strong style={{ color: 'var(--accent)' }}>{currentCard.fsrs.stability}d</strong></span>
              <span>Estimated Retention: <strong style={{ color: 'var(--green)' }}>{retentionPercent}%</strong></span>
            </div>
          </div>

          {/* Flashcard Box */}
          <div
            style={{
              background: 'var(--bg3)',
              border: '1.5px solid var(--border)',
              borderRadius: 16,
              padding: 24,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 8 }}>
                Concept #{currentIndex + 1} of {dueCards.length} · {currentCard.topic}
              </span>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--t1)', lineHeight: 1.5 }}>
                {currentCard.question}
              </h3>
            </div>

            {isAnswerRevealed && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }} className="animate-fade-in">
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: 6 }}>
                  💡 Core Mastery Invariant:
                </span>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--t1)', lineHeight: 1.6, fontWeight: 500 }}>
                  {currentCard.answer}
                </p>
              </div>
            )}
          </div>

          {/* Action Controls */}
          {!isAnswerRevealed ? (
            <button
              onClick={() => setIsAnswerRevealed(true)}
              style={{
                width: '100%',
                padding: 12,
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: 800,
                fontSize: 14,
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
                transition: 'all 0.15s'
              }}
            >
              Reveal Invariant &amp; Verify Memory →
            </button>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <button
                onClick={() => handleRate(Rating.Again)}
                style={{
                  padding: '10px 8px',
                  background: 'var(--coral-light)',
                  border: '1px solid var(--coral)',
                  color: 'var(--coral)',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <span>Again (1)</span>
                <span style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>Reset Interval</span>
              </button>
              <button
                onClick={() => handleRate(Rating.Hard)}
                style={{
                  padding: '10px 8px',
                  background: 'var(--amber-light)',
                  border: '1px solid var(--amber)',
                  color: 'var(--amber)',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <span>Hard (2)</span>
                <span style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>Short Interval</span>
              </button>
              <button
                onClick={() => handleRate(Rating.Good)}
                style={{
                  padding: '10px 8px',
                  background: 'var(--accent-light)',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <span>Good (3)</span>
                <span style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>Standard Interval</span>
              </button>
              <button
                onClick={() => handleRate(Rating.Easy)}
                style={{
                  padding: '10px 8px',
                  background: 'var(--green-light)',
                  border: '1px solid var(--green)',
                  color: 'var(--green)',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <span>Easy (4)</span>
                <span style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>Extended Interval</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
