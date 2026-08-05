'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { toast } from '@/lib/store/useAppStore';

interface ChatMessage {
  id: string;
  sender: 'priya' | 'user';
  text: string;
  timestamp: number;
  actions?: { label: string; onClick: () => void }[];
}

export default function LiteChatInterface() {
  const router = useRouter();
  const cOS = useCareerOS();
  const { onboardingStep, onboardingAnswers, completedQuests, generateFusedRoadmap } = cOS;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Model training state
  const [modelStats, setModelStats] = useState({
    xp: 0,
    level: 1,
    queryCount: 0,
    academicFocus: 0,
    codingFocus: 0,
    placementFocus: 0,
    stressedScore: 0,
    ambitiousScore: 0,
    inquisitiveScore: 0
  });

  const [showStatsMenu, setShowStatsMenu] = useState(false);

  const completedQuestsCount = completedQuests?.length || 0;
  const totalXp = modelStats.xp + (completedQuestsCount * 50);
  const currentLevel = totalXp >= 500 ? 4 : totalXp >= 250 ? 3 : totalXp >= 100 ? 2 : 1;
  const levelName = currentLevel === 4 ? 'Synchronized Twin' : currentLevel === 3 ? 'Adaptive Coach' : currentLevel === 2 ? 'Inquisitive Guide' : 'Novice Companion';
  const syncPercent = Math.min(100, Math.round((totalXp / 500) * 100));

  // Load model stats from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('priya_model_profile');
      if (saved) {
        try {
          setModelStats(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const updateModelStats = (newStats: typeof modelStats) => {
    setModelStats(newStats);
    if (typeof window !== 'undefined') {
      localStorage.setItem('priya_model_profile', JSON.stringify(newStats));
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Load conversational greetings based on onboarding step and model level
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      
      let greeting = "Hi there! I'm Ms. Priya, your Career OS guide. Let's work together to unlock your software engineering potential.";
      let actions: { label: string; onClick: () => void }[] = [];

      // Determine focus area based on weights
      const maxFocus = Math.max(modelStats.academicFocus, modelStats.codingFocus, modelStats.placementFocus);
      let focusArea = 'Software Development';
      if (maxFocus > 0) {
        if (modelStats.codingFocus === maxFocus) focusArea = 'Coding Sandbox Quests';
        else if (modelStats.academicFocus === maxFocus) focusArea = 'Academics & Exam Cells';
        else if (modelStats.placementFocus === maxFocus) focusArea = 'Recruiter Placements';
      }

      if (currentLevel === 2) {
        greeting = `Welcome back! I have initialized custom modeling. I am adapting my guidance style to focus on your interest in ${focusArea}. Ready to continue?`;
      } else if (currentLevel === 3) {
        greeting = `Great to see you! I am now in Adaptive Coach mode (Level 3). Analyzing your active quest streaks (${completedQuestsCount} cleared) and interest: ${focusArea}. Let's close your remaining gaps.`;
      } else if (currentLevel === 4) {
        greeting = `Our models are fully synchronized (Level 4)! I understand your behavioral patterns and targets intimately. Let's optimize your ATS placements pipeline.`;
      }

      // Onboarding step fallbacks if level is 1
      if (currentLevel === 1) {
        if (onboardingStep === 3) {
          greeting = "Welcome back! You have completed your diagnostics. Now, we must synthesize your career roadmap. Which trajectory track do you want to unlock?";
          actions = [
            {
              label: '⚛️ React Frontend SDE',
              onClick: () => handleGeneratePath('react_frontend', ['React Hooks', 'NextJS SSR', 'Vanilla CSS', 'Zustand State', 'TypeScript Types'])
            },
            {
              label: '☕ Java Backend SDE',
              onClick: () => handleGeneratePath('java_sde', ['Java Core', 'Spring Boot REST', 'SQL Tables', 'SOLID Principles', 'Unit Testing'])
            },
            {
              label: '☁️ DevOps Cloud SDE',
              onClick: () => handleGeneratePath('devops_cloud', ['Docker Containers', 'CI/CD Pipelines', 'AWS S3/EC2', 'Kubernetes', 'Process Telemetry'])
            }
          ];
        } else if (onboardingStep === 4) {
          greeting = "Your Quest Roadmap is active! Let's clear your first technical coding challenge. Ready to launch the sandbox?";
          actions = [
            {
              label: '🚀 Start FizzBuzz Quest',
              onClick: () => {
                toast.info('Loading Quest...', 'Redirecting to FizzBuzz sandbox.');
                router.push('/quests/fizzbuzz');
              }
            },
            {
              label: '🗂️ Visit Vault',
              onClick: () => router.push('/vault')
            }
          ];
        }
      }

      if (actions.length === 0) {
        actions = [
          {
            label: '🧬 View Career DNA Graph',
            onClick: () => router.push('/career-dna')
          },
          {
            label: '🎙️ AI Interview Practice',
            onClick: () => router.push('/interview')
          },
          {
            label: '⚡ Open Active Quests',
            onClick: () => router.push('/quests')
          }
        ];
      }

      setMessages([
        {
          id: 'welcome',
          sender: 'priya',
          text: greeting,
          timestamp: Date.now(),
          actions
        }
      ]);
    }, 800);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingStep, currentLevel]);

  const handleGeneratePath = async (trackId: string, skills: string[]) => {
    setIsTyping(true);
    
    setMessages(prev => [
      ...prev,
      {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: `Initialize ${trackId === 'react_frontend' ? 'React Frontend' : trackId === 'java_sde' ? 'Java Backend' : 'DevOps Cloud'} Trajectory.`,
        timestamp: Date.now()
      }
    ]);

    try {
      const res = await generateFusedRoadmap(skills, ['System Design', 'Docker']);
      setIsTyping(false);
      
      if (res) {
        setMessages(prev => [
          ...prev,
          {
            id: `priya_${Date.now()}`,
            sender: 'priya',
            text: "Roadmap synthesized successfully! 🗺️ I have customized your quest nodes. Let's launch your first coding task.",
            timestamp: Date.now(),
            actions: [
              {
                label: '🚀 Launch Quest Sandbox',
                onClick: () => router.push('/quests')
              }
            ]
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `priya_${Date.now()}`,
            sender: 'priya',
            text: "I encountered a minor lag synthesizing your roadmap. Let's try again or view the Career Builder directly.",
            timestamp: Date.now(),
            actions: [
              {
                label: '🗺️ Open Career Builder',
                onClick: () => router.push('/career-builder')
              }
            ]
          }
        ]);
      }
    } catch {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');

    setMessages(prev => [
      ...prev,
      {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: Date.now()
      }
    ]);

    setIsTyping(true);

    // Parse training metadata
    const lower = userText.toLowerCase();

    const academicWords = ['exam', 'grade', 'results', 'attendance', 'syllabus', 'marks', 'passing'];
    const codingWords = ['code', 'quest', 'sandbox', 'python', 'js', 'programming', 'fizzbuzz', 'arrays'];
    const placementWords = ['recruiter', 'job', 'career', 'ats', 'resume', 'placement', 'interview'];

    const stressWords = ['stressed', 'hard', 'difficult', 'struggling', 'scared', 'fail', 'backlog', 'help', 'stuck', 'worry'];
    const ambitiousWords = ['succeed', 'ready', 'jobs', 'placement', 'recruiter', 'salary', 'ambition', 'win', 'best'];
    const inquisitiveWords = ['explore', 'what is', 'learn', 'how to', 'why', 'explain', 'show me', 'understand'];

    const incAcademic = academicWords.some(w => lower.includes(w)) ? 1 : 0;
    const incCoding = codingWords.some(w => lower.includes(w)) ? 1 : 0;
    const incPlacement = placementWords.some(w => lower.includes(w)) ? 1 : 0;

    const incStress = stressWords.some(w => lower.includes(w)) ? 1 : 0;
    const incAmbitious = ambitiousWords.some(w => lower.includes(w)) ? 1 : 0;
    const incInquisitive = inquisitiveWords.some(w => lower.includes(w)) ? 1 : 0;

    const newStats = {
      xp: modelStats.xp + 10,
      level: currentLevel,
      queryCount: modelStats.queryCount + 1,
      academicFocus: modelStats.academicFocus + incAcademic,
      codingFocus: modelStats.codingFocus + incCoding,
      placementFocus: modelStats.placementFocus + incPlacement,
      stressedScore: modelStats.stressedScore + incStress,
      ambitiousScore: modelStats.ambitiousScore + incAmbitious,
      inquisitiveScore: modelStats.inquisitiveScore + incInquisitive
    };
    updateModelStats(newStats);

    setTimeout(() => {
      setIsTyping(false);
      
      let reply = "I understand. Let's focus on completing your active quests. Closing your active engineering gaps is the fastest way to recruiter matching.";

      if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        reply = "Hello! I am here. Tell me, how can I help you navigate your Career OS targets today?";
      } else if (lower.includes('quest') || lower.includes('code') || lower.includes('task')) {
        reply = "Your active quests are listed in the Quests hub. You compile them client-side in our WebAssembly sandbox. Would you like to open it now?";
      } else if (lower.includes('vault') || lower.includes('certificate') || lower.includes('proof')) {
        reply = "To raise your Trust Score, upload physical proofs (PDFs, certificates, badges) to the secure Evidence Vault. Do you want to go to the Vault?";
      } else if (lower.includes('interview') || lower.includes('practice') || lower.includes('talk')) {
        reply = "Mock interviews with Ms. Aisha or Mr. Vikram assess your communications and technical vocabulary. You can route to '/interview' to practice.";
      }

      // Inject behavior sentiment prefixes for Level 3 and 4
      if (currentLevel >= 3) {
        const maxSentiment = Math.max(newStats.stressedScore, newStats.ambitiousScore, newStats.inquisitiveScore);
        if (maxSentiment > 0) {
          if (newStats.stressedScore === maxSentiment) {
            reply = "I sense that you've been feeling a bit stressed or stuck lately. Don't worry, we can simplify this path: " + reply;
          } else if (newStats.ambitiousScore === maxSentiment) {
            reply = "Love the goal-oriented drive! Let's accelerate this right now: " + reply;
          } else if (newStats.inquisitiveScore === maxSentiment) {
            reply = "Excellent question. Let's analyze the core mechanics of this area: " + reply;
          }
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: `priya_${Date.now()}`,
          sender: 'priya',
          text: reply,
          timestamp: Date.now(),
          actions: [
            { label: '🗺️ Quests Hub', onClick: () => router.push('/quests') },
            { label: '🗂️ Evidence Vault', onClick: () => router.push('/vault') }
          ]
        }
      ]);
    }, 1000);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 140px)',
      background: 'rgba(10, 15, 30, 0.4)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      overflow: 'hidden',
      maxWidth: 800,
      margin: '0 auto',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--teal))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18
          }}>
            👩‍💼
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>Ms. Priya</div>
            <div style={{ fontSize: 11, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              Active Mentor Guide
            </div>
          </div>
        </div>
      </div>

      {/* Model Evolution Level Progress Bar */}
      <div style={{
        padding: '10px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(255, 255, 255, 0.01)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12,
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, color: 'var(--teal)' }}>🧠 Evolution: {levelName}</span>
          <span style={{ fontSize: 11, color: 'var(--t3)' }}>({totalXp} XP)</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Progress bar */}
          <div style={{ width: 120, height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ width: `${syncPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--teal), var(--accent))', transition: 'width 0.3s' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--t2)' }}>{syncPercent}% Synced</span>
          
          <button 
            onClick={() => setShowStatsMenu(!showStatsMenu)}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', color: 'var(--t2)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            📊 Training Stats {showStatsMenu ? '▲' : '▼'}
          </button>
        </div>

        {/* Dropdown Menu */}
        {showStatsMenu && (
          <div style={{
            position: 'absolute', top: 40, right: 20, width: 260, background: 'var(--bg2)',
            border: '1px solid var(--border)', borderRadius: 12, padding: 14, zIndex: 10,
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)', color: 'var(--t1)'
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 8, letterSpacing: '0.5px', textAlign: 'left' }}>
              Model Weight Vectors:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11.5, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--t3)' }}>Completed Quests (+50 XP):</span>
                <span style={{ fontWeight: 700, color: 'var(--teal)' }}>{completedQuestsCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--t3)' }}>Messages Sent (+10 XP):</span>
                <span style={{ fontWeight: 700, color: 'var(--teal)' }}>{modelStats.queryCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 4 }}>
                <span style={{ color: 'var(--t3)' }}>Academics Weight:</span>
                <span style={{ fontWeight: 600 }}>{modelStats.academicFocus} queries</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--t3)' }}>Coding Weight:</span>
                <span style={{ fontWeight: 600 }}>{modelStats.codingFocus} queries</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--t3)' }}>Placement Weight:</span>
                <span style={{ fontWeight: 600 }}>{modelStats.placementFocus} queries</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 4 }}>
                <span style={{ color: 'var(--t3)' }}>Emotion Matcher:</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                  {modelStats.stressedScore > Math.max(modelStats.ambitiousScore, modelStats.inquisitiveScore) ? 'Empathetic / Stressed' :
                   modelStats.ambitiousScore > Math.max(modelStats.stressedScore, modelStats.inquisitiveScore) ? 'Goal-oriented' :
                   modelStats.inquisitiveScore > Math.max(modelStats.stressedScore, modelStats.ambitiousScore) ? 'Socratic' : 'Balanced'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                if(confirm("Reset training data back to Level 1?")) {
                  const reset = {
                    xp: 0,
                    level: 1,
                    queryCount: 0,
                    academicFocus: 0,
                    codingFocus: 0,
                    placementFocus: 0,
                    stressedScore: 0,
                    ambitiousScore: 0,
                    inquisitiveScore: 0
                  };
                  updateModelStats(reset);
                  setShowStatsMenu(false);
                }
              }}
              style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 0', color: '#f87171', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              Reset Mentor Training Data
            </button>
          </div>
        )}
      </div>

      {/* Messages Staging Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        {messages.map((m) => {
          const isPriya = m.sender === 'priya';
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: isPriya ? 'flex-start' : 'flex-end' }}>
              <div style={{ display: 'flex', gap: 10, maxWidth: '85%' }}>
                {isPriya && (
                  <span style={{ fontSize: 20, alignSelf: 'flex-start', marginTop: 4 }}>👩‍💼</span>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: isPriya ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    background: isPriya ? 'var(--bg3)' : 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                    border: isPriya ? '1px solid var(--border)' : 'none',
                    color: isPriya ? 'var(--t1)' : '#fff',
                    fontSize: 13,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {m.text}
                  </div>
                  
                  {/* Actions (Buttons in Chat bubble) */}
                  {isPriya && m.actions && m.actions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                      {m.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={act.onClick}
                          style={{
                            background: 'rgba(79, 70, 229, 0.08)',
                            border: '1px solid rgba(79, 70, 229, 0.25)',
                            borderRadius: 12,
                            padding: '8px 14px',
                            color: 'var(--accent)',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(79, 70, 229, 0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(79, 70, 229, 0.08)';
                          }}
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 20 }}>👩‍💼</span>
            <div style={{
              padding: '12px 18px',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: '16px 16px 16px 4px',
              display: 'flex',
              gap: 4
            }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--t3)',
                    animation: 'pulse 1.2s infinite',
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Workspace */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        background: 'rgba(255, 255, 255, 0.01)',
        display: 'flex',
        gap: 10
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Priya about your active quests or vault proof..."
          style={{
            flex: 1,
            height: 42,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '0 16px',
            color: 'var(--t1)',
            fontSize: 13,
            outline: 'none'
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            height: 42,
            padding: '0 20px',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
            border: 'none',
            borderRadius: 12,
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            opacity: !input.trim() ? 0.5 : 1,
            transition: 'opacity 0.15s'
          }}
        >
          Send
        </button>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
