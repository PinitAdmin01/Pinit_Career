'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameComponentProps, playSound } from './types';
import { DifficultyPicker, CompletionBanner } from './DifficultyPicker';
import { CountdownOverlay } from './CountdownOverlay';
import { GameShell } from './GameShell';

type ProductId =
  | 'tokens'
  | 'landing'
  | 'brand'
  | 'components'
  | 'audit'
  | 'pricing'
  | 'onboard'
  | 'theme'
  | 'portfolio'
  | 'pitch';

type PriceBand = 'low' | 'fair' | 'high';

interface Product {
  id: ProductId;
  name: string;
  line: string;
}

interface Buyer {
  name: string;
  role: string;
  color: string;
  need: ProductId;
  budget: PriceBand;
  quote: string;
}

const CATALOG: Product[] = [
  { id: 'tokens', name: 'Token Kit', line: 'Color, type, and space as CSS variables.' },
  { id: 'landing', name: 'Landing System', line: 'Hero, proof, and a single clear CTA.' },
  { id: 'brand', name: 'Brand Book', line: 'Voice, palette, and type rules.' },
  { id: 'components', name: 'Component Library', line: 'Buttons, forms, and cards that match.' },
  { id: 'audit', name: 'Conversion Audit', line: 'Find friction in the checkout path.' },
  { id: 'pricing', name: 'Pricing Page', line: 'Three tiers with a fair compare table.' },
  { id: 'onboard', name: 'Onboarding Flow', line: 'First-run screens and empty states.' },
  { id: 'theme', name: 'Storefront Theme', line: 'Product grid, cart, and receipt.' },
  { id: 'portfolio', name: 'Portfolio Site', line: 'Case studies with quiet layout.' },
  { id: 'pitch', name: 'Pitch Deck', line: 'Narrative slides for a buyer meeting.' },
];

const BUYERS: Buyer[] = [
  { name: 'Mira', role: 'Boutique founder', color: '#0d9488', need: 'theme', budget: 'fair', quote: 'I sell ceramics online. The shop looks flat. I need a storefront that feels like the studio.' },
  { name: 'Arun', role: 'SaaS PM', color: '#6366f1', need: 'onboard', budget: 'high', quote: 'Users drop after signup. I need a first-run flow, not another landing page.' },
  { name: 'Leah', role: 'Recruiter', color: '#d97706', need: 'portfolio', budget: 'low', quote: 'I review juniors all day. Show me a calm portfolio I can scan in thirty seconds.' },
  { name: 'Kenji', role: 'Design lead', color: '#7c3aed', need: 'tokens', budget: 'fair', quote: 'Two products, three hex dumps. I need a shared token kit before we ship another page.' },
  { name: 'Sofia', role: 'Cafe owner', color: '#db2777', need: 'landing', budget: 'low', quote: 'People find us on maps, then bounce. I want one page: story, hours, and a booking button.' },
  { name: 'Dev', role: 'Startup CEO', color: '#2563eb', need: 'pitch', budget: 'high', quote: 'Investor meeting Friday. I need a deck that sells the business, not a moodboard.' },
  { name: 'Priya', role: 'Brand director', color: '#059669', need: 'brand', budget: 'high', quote: 'We hired three freelancers. Nothing matches. I need a brand book the team can follow.' },
  { name: 'Omar', role: 'Checkout lead', color: '#dc2626', need: 'audit', budget: 'fair', quote: 'Cart to pay is leaking. Do not redesign the logo. Tell me where the funnel breaks.' },
  { name: 'Nina', role: 'Product designer', color: '#0891b2', need: 'components', budget: 'fair', quote: 'Every screen invents a new button. I need a small component library, CSS only.' },
  { name: 'Jules', role: 'Growth lead', color: '#d97706', need: 'pricing', budget: 'low', quote: 'People like the product and stall on price. I need a clearer pricing page, not a new brand.' },
];

function pickShelf(need: ProductId): Product[] {
  const hit = CATALOG.find(p => p.id === need)!;
  const rest = CATALOG.filter(p => p.id !== need).sort(() => Math.random() - 0.5);
  return [hit, ...rest.slice(0, 3)].sort(() => Math.random() - 0.5);
}

function shuffleBuyers(count: number): Buyer[] {
  return [...BUYERS].sort(() => Math.random() - 0.5).slice(0, count);
}

function priceLabel(band: PriceBand) {
  if (band === 'low') return 'Lean';
  if (band === 'high') return 'Premium';
  return 'Fair';
}

export function StoreSimGame({
  gameId,
  difficulty,
  onDifficultyChange,
  completedDifficulties,
  soundMuted,
  onComplete,
  onExit,
}: GameComponentProps) {
  const rounds = difficulty === 'hard' ? 8 : difficulty === 'normal' ? 6 : 4;
  const patienceMax = difficulty === 'hard' ? 9 : difficulty === 'normal' ? 13 : 18;

  const [phase, setPhase] = useState<'ready' | 'countdown' | 'playing' | 'done'>('ready');
  const [queue, setQueue] = useState<Buyer[]>([]);
  const [shelf, setShelf] = useState<Product[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [sold, setSold] = useState(0);
  const [patience, setPatience] = useState(patienceMax);
  const [picked, setPicked] = useState<ProductId | null>(null);
  const [note, setNote] = useState('');
  const [locked, setLocked] = useState(false);

  const scoreRef = useRef(0);
  const soldRef = useRef(0);
  const roundRef = useRef(0);
  const queueRef = useRef<Buyer[]>([]);
  const lockedRef = useRef(false);

  const buyer = queue[round];

  const openShop = useCallback(() => {
    const nextQueue = shuffleBuyers(rounds);
    queueRef.current = nextQueue;
    roundRef.current = 0;
    scoreRef.current = 0;
    soldRef.current = 0;
    lockedRef.current = false;
    setQueue(nextQueue);
    setShelf(pickShelf(nextQueue[0].need));
    setRound(0);
    setScore(0);
    setSold(0);
    setPicked(null);
    setNote('');
    setLocked(false);
    setPatience(patienceMax);
    setPhase('playing');
  }, [patienceMax, rounds]);

  const advanceBuyer = useCallback(() => {
    const nextRound = roundRef.current + 1;
    if (nextRound >= queueRef.current.length) {
      setPhase('done');
      return;
    }
    roundRef.current = nextRound;
    lockedRef.current = false;
    setRound(nextRound);
    setShelf(pickShelf(queueRef.current[nextRound].need));
    setPicked(null);
    setNote('');
    setLocked(false);
    setPatience(patienceMax);
  }, [patienceMax]);

  useEffect(() => {
    if (phase !== 'playing' || locked) return;
    const t = setInterval(() => {
      setPatience(p => {
        if (p <= 1) {
          if (lockedRef.current) return 0;
          lockedRef.current = true;
          playSound('wrong', soundMuted);
          setNote('They left. Patience ran out.');
          setLocked(true);
          setTimeout(advanceBuyer, 900);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, locked, advanceBuyer, soundMuted]);

  const quotePrice = (band: PriceBand) => {
    if (!buyer || locked || !picked) return;
    lockedRef.current = true;
    setLocked(true);

    const match = picked === buyer.need;
    if (!match) {
      playSound('wrong', soundMuted);
      setNote('Wrong brief. They wanted something else.');
      setTimeout(advanceBuyer, 900);
      return;
    }
    if (band === 'high' && buyer.budget !== 'high') {
      playSound('wrong', soundMuted);
      setNote('Too expensive. They walked.');
      setTimeout(advanceBuyer, 900);
      return;
    }

    let gain = 0;
    if (band === buyer.budget) {
      gain = 40 + patience * 2;
      setNote(band === 'fair' ? 'Closed at a fair price.' : band === 'low' ? 'Closed on a lean quote.' : 'Closed at premium.');
    } else if (band === 'low') {
      gain = 18 + patience;
      setNote('Sold, but the margin is thin.');
    } else {
      gain = 28 + patience;
      setNote('They paid up. Close.');
    }

    playSound('correct', soundMuted);
    scoreRef.current += gain;
    soldRef.current += 1;
    setScore(scoreRef.current);
    setSold(soldRef.current);
    setTimeout(advanceBuyer, 850);
  };

  const accuracyEarned = Math.min(100, Math.round((sold / Math.max(1, rounds)) * 100));

  return (
    <GameShell
      accent="teal"
      mark="store"
      wide
      title="Studio Counter"
      description="An AI buyer walks in with a brief. Sell the CSS or business piece that fits, then quote a price they will actually pay."
      phase={phase}
      onExit={onExit}
      countdown={phase === 'countdown' ? <CountdownOverlay soundMuted={soundMuted} onComplete={openShop} /> : null}
      readyExtra={<DifficultyPicker gameId={gameId} difficulty={difficulty} onChange={onDifficultyChange} completedDifficulties={completedDifficulties} />}
      onStart={() => setPhase('countdown')}
      startLabel="Open the shop"
      doneTitle="Shop closed"
      doneScore={`${score} pts`}
      doneHint={`${sold} of ${rounds} buyers left with a piece.`}
      doneExtra={
        <CompletionBanner
          difficulty={difficulty}
          onNextChallenge={(next) => {
            onDifficultyChange(next);
            setPhase('countdown');
          }}
        />
      }
      onClaim={() => { onComplete(score, accuracyEarned); onExit(); }}
      onReplay={() => setPhase('countdown')}
    >
      {phase === 'playing' && buyer && (
        <>
          <div className="att-hud">
            <div className="att-hud-key">
              <span>Take</span>
              <b>{score}</b>
            </div>
            <div className="att-phase">Buyer {round + 1} / {rounds}</div>
            <div>
              <span>Patience</span>
              <b className={patience <= 4 ? 'att-warn' : undefined}>{patience}s</b>
            </div>
          </div>

          <div className="att-shop">
            <aside className="att-buyer" style={{ ['--bot' as string]: buyer.color }}>
              <div className="att-bot" aria-hidden>
                <div className="att-bot-head" />
                <div className="att-bot-body" />
              </div>
              <h4>{buyer.name}</h4>
              <em>{buyer.role}</em>
              <div className="att-quote">{buyer.quote}</div>
              <div className="att-patience" aria-label="Patience">
                <i style={{ width: `${(patience / patienceMax) * 100}%` }} />
              </div>
            </aside>

            <div className="att-counter">
              <div className="att-shelf">
                {shelf.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className={`att-sku${picked === item.id ? ' is-on' : ''}${locked && picked && picked !== item.id ? ' is-miss' : ''}`}
                    onClick={() => {
                      if (locked) return;
                      playSound('click', soundMuted);
                      setPicked(item.id);
                    }}
                  >
                    <b>{item.name}</b>
                    <span>{item.line}</span>
                  </button>
                ))}
              </div>

              <div className="att-prices">
                {(['low', 'fair', 'high'] as PriceBand[]).map(band => (
                  <button
                    key={band}
                    type="button"
                    className="att-btn att-btn-ghost"
                    disabled={!picked || locked}
                    onClick={() => quotePrice(band)}
                  >
                    {priceLabel(band)}
                  </button>
                ))}
              </div>

              <div className="att-result">
                {note || 'Pick the piece that matches the brief, then quote a price.'}
              </div>
            </div>
          </div>
        </>
      )}
    </GameShell>
  );
}
