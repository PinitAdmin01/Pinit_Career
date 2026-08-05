'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { stopSpeaking } from '@/lib/tts';

interface LinguaLabProps {
  streak: number;
  theme: any;
}

// Real-world corporate situations faced in actual tech & business jobs
const REAL_WORLD_SCENARIOS = [
  {
    id: 'outage',
    title: '🚨 Production System Outage',
    role: 'Engineering / Tech',
    badge: 'Critical Incident',
    situation: 'The primary database collapsed during peak traffic. Your Tech Lead and Manager want an immediate status update on Slack.',
    prompt: 'How would you inform your lead about what went wrong, what you are doing to fix it, and when service will be restored?',
    placeholder: 'e.g. Hi team, we experienced a DB connection pool exhaustion at 2 PM. I have initiated a rollback and hotfix deployment...'
  },
  {
    id: 'delay',
    title: '⏳ Project Deadline & Scope Delay',
    role: 'Product / Management',
    badge: 'Timeline Risk',
    situation: 'You realized a key API requirement was missing, making it impossible to finish the sprint deliverables by Friday.',
    prompt: 'How would you communicate this delay to your Product Manager while maintaining confidence and offering realistic solutions?',
    placeholder: 'e.g. Hi Sarah, due to an unannounced API schema update, completing feature X by Friday will risk code instability. I recommend...'
  },
  {
    id: 'pr_review',
    title: '💬 Code Review / PR Pushback',
    role: 'Software Developer',
    badge: 'Technical Debate',
    situation: 'A Senior Architect left harsh feedback on your Pull Request, calling your nested loop design inefficient.',
    prompt: 'How do you respond professionally without taking it personally, explaining your initial constraints while accepting valid feedback?',
    placeholder: 'e.g. Thanks for reviewing the PR! I used nested loops due to legacy payload format constraints, but I agree a hash map lookup is better...'
  },
  {
    id: 'client_apology',
    title: '🤝 Client Escalation & SLA Breach',
    role: 'Client / Business Advisory',
    badge: 'Executive Advisory',
    situation: 'An enterprise client is furious because your software was offline for 3 hours during their business pitch.',
    prompt: 'Draft an email to the client CEO explaining the issue, taking ownership without making weak excuses, and reassuring them of SLA terms.',
    placeholder: 'e.g. Dear Mark, I am writing to sincerely apologize for the service disruption today. Our infrastructure team identified the root cause...'
  },
  {
    id: 'negotiation',
    title: '💼 Salary & Level Negotiation',
    role: 'Career Readiness',
    badge: 'Offer Negotiation',
    situation: 'The recruiter offered $80,000 for a role, but based on market data and your technical skills, your target is $95,000.',
    prompt: 'How do you professionally counter-offer via email or call without sounding greedy or risking the job offer?',
    placeholder: 'e.g. Thank you for extending this offer! I am very excited about joining the team. Based on my experience with cloud architecture...'
  }
];

export default function LinguaLab({ streak, theme }: LinguaLabProps) {
  const { onboardingAnswers, setOnboarding, addXp, earnPins } = useCareerOS();

  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [userText, setUserText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [activeRewriteTab, setActiveRewriteTab] = useState<'executive' | 'professional' | 'native'>('executive');
  const [copiedRewrite, setCopiedRewrite] = useState(false);

  // Dictation Recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(3);
  const recordingIntervalRef = useRef<any>(null);

  const scenario = REAL_WORLD_SCENARIOS[selectedScenarioIdx];

  const handleStartDictation = () => {
    setIsRecording(true);
    setRecordingTimer(3);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTimer((prev) => {
        if (prev <= 1) {
          clearInterval(recordingIntervalRef.current);
          setIsRecording(false);
          const realWorldVoiceSamples: Record<string, string> = {
            outage: "Basically, the server crashed because of DB locks around 2 PM. I did a quick rollback and we are deploying the hotfix right now.",
            delay: "Hi Sarah, actually we hit a blocker with the third-party API. I think we need to delay the sprint release by two days to ensure stability.",
            pr_review: "Thanks for checking my code. Basically, I wrote nested loops because of the old schema, but I can refactor it to a hash map lookup today.",
            client_apology: "Dear Mark, I am writing to apologize for the downtime today. Our team fixed the issue and we are upgrading our failover servers.",
            negotiation: "Thank you for the offer letter! I am excited about the role. Based on my cloud certification and market standards, I was hoping for $95k."
          };
          setUserText(realWorldVoiceSamples[scenario.id] || realWorldVoiceSamples.outage);
          toast.success("Voice dictation transcribed!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(recordingIntervalRef.current);
  }, []);

  const handleEvaluateCorporateComm = async () => {
    if (!userText.trim()) {
      toast.error("Input Required", "Please type or speak your response first.");
      return;
    }

    setIsEvaluating(true);
    setEvaluationResult(null);
    setCopiedRewrite(false);

    try {
      const data = await api.post<any>('/api/communication/evaluate', {
        submission: userText,
        scenario: scenario.title,
        category: 'speaking',
        difficulty: 'Corporate',
        track: scenario.role
      });

      setEvaluationResult(data);
      toast.success("Corporate Evaluation Complete! 💼", "+150 XP & +10 Pins awarded.");

      // Reward XP & Pins
      addXp(150, "Real-World Corporate Communication Session");
      earnPins('communication_session', 10, "Corporate Communication Practice");

      const sessionScore = data.scores?.average || 85;

      // ── Supabase & Context Data Persistence ──
      const history = onboardingAnswers.communication_history || [];
      const newSession = {
        id: `sess_${Date.now()}`,
        scenario: scenario.title,
        category: 'speaking' as const,
        score: sessionScore,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        userSubmission: userText,
        scores: data.scores,
        rewrites: data.rewrites,
        feedback: data.feedback
      };

      const updatedHistory = [newSession, ...history];
      const latestTen = updatedHistory.slice(0, 10);
      const movingAvgScore = Math.round(latestTen.reduce((sum, item) => sum + item.score, 0) / latestTen.length);

      // Save to CareerOS context
      setOnboarding({
        ...onboardingAnswers,
        communication_history: updatedHistory
      });

      // Patch score to Supabase database profile
      api.patch('/api/auth/profile', {
        communication_score: movingAvgScore
      }).catch(() => {});

      // Sync record into LocalStorage history so 3rd Sub-Tab (Conclusion History) shows it instantly
      try {
        const rawSocratic = localStorage.getItem('pinit_socratic_history');
        const socraticArr = rawSocratic ? JSON.parse(rawSocratic) : [];
        const newHistoryRecord = {
          id: 'comm_' + Date.now(),
          type: 'corporate_comm',
          title: `Corporate Comm: ${scenario.title}`,
          date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          avatar: 'priya',
          avatarName: 'Ms. Priya (Comm Coach)',
          qt2Delta: sessionScore >= 85 ? 5 : 2,
          mindsetArchetype: 'Corporate Diplomat',
          score: sessionScore,
          userSubmission: userText,
          rewrites: data.rewrites,
          report: `### Real-World Corporate Rating: ${sessionScore}/100\n\n**Candidate Submission:**\n"${userText}"\n\n### Executive Rewrites:\n* **Executive Level:** "${data.rewrites?.executive}"\n* **Professional Tone:** "${data.rewrites?.professional}"\n* **Native Speaker:** "${data.rewrites?.native}"\n\n### Feedback & Rules:\n* **Strong Points:** ${data.feedback?.positive || 'Good direct ownership.'}\n* **Workplace Tip:** ${data.feedback?.recommendation || 'Eliminate filler words to project authority.'}`
        };
        socraticArr.unshift(newHistoryRecord);
        localStorage.setItem('pinit_socratic_history', JSON.stringify(socraticArr));
      } catch (err) {
        console.warn("Failed to write to Socratic history:", err);
      }

    } catch (err: any) {
      toast.error("Evaluation Failed", err.message || "Could not evaluate corporate communication.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyRewrite = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedRewrite(true);
    toast.success("Rewrite Copied! 📋", "Copied Executive Rewrite to clipboard.");
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  return (
    <div style={{
      background: theme.bgCard,
      border: `1.5px solid ${theme.border}`,
      borderRadius: 24,
      padding: '28px',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.border}`,
        paddingBottom: 16,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              color: 'var(--accent)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              background: 'rgba(99,102,241,0.1)',
              padding: '3px 9px',
              borderRadius: 6,
              border: '1px solid rgba(99,102,241,0.2)'
            }}>
              ✨ Real-World Corporate Communication Lab
            </span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: theme.tPrimary, margin: '6px 0 0', fontFamily: 'var(--font-display)' }}>
            Workplace Communication Simulator 🎙️
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 100%)',
            border: '1px solid rgba(245,158,11,0.25)',
            padding: '8px 16px',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 8px rgba(245,158,11,0.1)'
          }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--amber)', fontWeight: 800 }}>STREAK</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: theme.tPrimary }}>{streak} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-World Scenario Pills */}
      <div>
        <label style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', color: theme.tTertiary, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 10, letterSpacing: '0.6px' }}>
          Choose Workplace Issue to Solve:
        </label>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
          {REAL_WORLD_SCENARIOS.map((sc, idx) => {
            const isSelected = selectedScenarioIdx === idx;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  stopSpeaking();
                  setSelectedScenarioIdx(idx);
                  setUserText('');
                  setEvaluationResult(null);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 14,
                  border: `1.5px solid ${isSelected ? 'var(--accent)' : theme.border}`,
                  background: isSelected ? 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.04) 100%)' : theme.bgInside,
                  color: isSelected ? 'var(--accent)' : theme.tSecondary,
                  fontSize: 12,
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 12px rgba(99,102,241,0.15)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {sc.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Situation Glassmorphic Card */}
      <div style={{
        background: theme.bgInside,
        border: `1.5px solid ${theme.border}`,
        borderRadius: 18,
        padding: 20,
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Domain Context: {scenario.role}
          </span>
          <span style={{ fontSize: 9.5, fontWeight: 800, background: 'rgba(20,184,166,0.1)', color: 'var(--teal)', border: '1px solid rgba(20,184,166,0.2)', padding: '2px 8px', borderRadius: 6, fontFamily: 'var(--font-mono)' }}>
            {scenario.badge}
          </span>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: theme.tPrimary, margin: 0 }}>{scenario.title}</h3>
        <p style={{ fontSize: 13, color: theme.tSecondary, margin: 0, lineHeight: 1.55 }}>{scenario.situation}</p>
        
        <div style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: 'var(--teal)',
          background: 'rgba(20,184,166,0.06)',
          padding: '10px 14px',
          borderRadius: 12,
          border: '1px solid rgba(20,184,166,0.18)',
          marginTop: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <span>👉</span>
          <span><strong>Your Objective:</strong> {scenario.prompt}</span>
        </div>
      </div>

      {/* Input Box & Voice Dictation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 12, fontWeight: 800, color: theme.tPrimary }}>
            How would you communicate in real life? (Type or Speak)
          </label>

          <button
            onClick={handleStartDictation}
            disabled={isRecording}
            style={{
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: isRecording ? 'var(--red)' : 'var(--accent)',
              fontSize: 11.5,
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
          >
            🎙️ {isRecording ? `Recording... (${recordingTimer}s)` : 'Speak Your Answer (Voice Dictation)'}
          </button>
        </div>

        {isRecording && (
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>🔴 AUDIO WAVE TRANSCRIPTION ACTIVE</span>
          </div>
        )}

        <textarea
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder={scenario.placeholder}
          rows={4}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 16,
            background: theme.bgInside,
            border: `1.5px solid ${theme.border}`,
            color: theme.tPrimary,
            fontSize: 13.5,
            outline: 'none',
            resize: 'vertical',
            lineHeight: 1.6,
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Primary Action Button */}
      <button
        onClick={handleEvaluateCorporateComm}
        disabled={isEvaluating || !userText.trim()}
        style={{
          width: '100%',
          padding: '16px 0',
          borderRadius: 16,
          border: 'none',
          background: userText.trim() ? 'linear-gradient(90deg, var(--accent) 0%, var(--teal) 100%)' : theme.bgInside,
          color: userText.trim() ? '#fff' : theme.tTertiary,
          fontSize: 14,
          fontWeight: 900,
          cursor: userText.trim() ? 'pointer' : 'not-allowed',
          boxShadow: userText.trim() ? '0 6px 20px rgba(99,102,241,0.3)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {isEvaluating ? '🤖 Analyzing Real-World Impact & Generating Executive Rewrites...' : '💼 Check Corporate Communication & Get Executive Rewrites ➔'}
      </button>

      {/* AI Evaluation Results Card */}
      {evaluationResult && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(20,184,166,0.04) 0%, rgba(99,102,241,0.02) 100%)',
          border: '1.5px solid rgba(20,184,166,0.22)',
          borderRadius: 20,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: 'var(--shadow-md)'
        }} className="animate-fade-in">
          
          {/* Rating Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: 14 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--teal)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Real-World Corporate Rating
              </span>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: theme.tPrimary, margin: '2px 0 0' }}>
                {evaluationResult.scores?.average >= 88 ? '🌟 Executive C-Suite Ready' : evaluationResult.scores?.average >= 75 ? '👍 Corporate Ready' : '✏️ Needs Professional Polish'}
              </h3>
            </div>
            <div style={{ background: 'rgba(20,184,166,0.12)', border: '2.5px solid var(--teal)', width: 58, height: 58, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: 'var(--teal)', boxShadow: '0 0 16px rgba(20,184,166,0.2)' }}>
              {evaluationResult.scores?.average || 85}
            </div>
          </div>

          {/* Multi-Tier Executive Rewording System */}
          <div style={{ background: theme.bgInside, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: 10, marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setActiveRewriteTab('executive')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeRewriteTab === 'executive' ? 'var(--accent)' : 'transparent',
                    color: activeRewriteTab === 'executive' ? '#fff' : theme.tSecondary,
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  👑 EXECUTIVE C-SUITE
                </button>
                <button
                  onClick={() => setActiveRewriteTab('professional')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeRewriteTab === 'professional' ? 'var(--accent)' : 'transparent',
                    color: activeRewriteTab === 'professional' ? '#fff' : theme.tSecondary,
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  💼 PROFESSIONAL
                </button>
                <button
                  onClick={() => setActiveRewriteTab('native')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: activeRewriteTab === 'native' ? 'var(--accent)' : 'transparent',
                    color: activeRewriteTab === 'native' ? '#fff' : theme.tSecondary,
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  🗣️ NATIVE SPEAKER
                </button>
              </div>

              <button
                onClick={() => {
                  const targetText = 
                    activeRewriteTab === 'executive' ? evaluationResult.rewrites?.executive :
                    activeRewriteTab === 'professional' ? evaluationResult.rewrites?.professional :
                    evaluationResult.rewrites?.native;
                  handleCopyRewrite(targetText);
                }}
                style={{
                  background: copiedRewrite ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${copiedRewrite ? 'var(--teal)' : theme.border}`,
                  color: copiedRewrite ? 'var(--teal)' : theme.tSecondary,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                {copiedRewrite ? '✓ Copied to Clipboard!' : '📋 Copy Rewrite'}
              </button>
            </div>

            <p style={{ fontSize: 13.5, color: theme.tPrimary, fontWeight: 600, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
              "{activeRewriteTab === 'executive' ? evaluationResult.rewrites?.executive : activeRewriteTab === 'professional' ? evaluationResult.rewrites?.professional : evaluationResult.rewrites?.native}"
            </p>
          </div>

          {/* Feedback & Etiquette Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', padding: 14, borderRadius: 14 }}>
              <strong style={{ color: '#22c55e', fontSize: 11, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 4 }}>✓ Strong Points</strong>
              <p style={{ fontSize: 12, color: theme.tPrimary, margin: 0, lineHeight: 1.5 }}>{evaluationResult.feedback?.positive || "Direct ownership and clear problem breakdown."}</p>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', padding: 14, borderRadius: 14 }}>
              <strong style={{ color: 'var(--amber)', fontSize: 11, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 4 }}>⚠️ Real-World Etiquette Rule</strong>
              <p style={{ fontSize: 12, color: theme.tPrimary, margin: 0, lineHeight: 1.5 }}>{evaluationResult.feedback?.recommendation || "Eliminate filler words to project executive authority."}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
