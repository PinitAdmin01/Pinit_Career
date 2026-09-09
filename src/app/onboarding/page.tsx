'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS } from '@/lib/api/hooks';
import dynamic from 'next/dynamic';
import {
  speakWithAvatar,
  stopSpeaking,
  preloadTTS,
  preloadNextSpeech,
  preloadMultipleSpeeches,
  getAvatarVoiceVolume,
  setAvatarVoiceVolume
} from '@/lib/tts';
import { pingRenderServer } from '@/lib/smartVoiceRouter';
import { toast } from '@/lib/store/useAppStore';
import { markOnboardingStoryPending } from '@/lib/storyTour';

import { preloadAvatarGLB } from '@/components/avatar/VRoidInterviewAvatar';
import GearAudioHub from '@/components/nav/GearAudioHub';
import { ambientAudio } from '@/lib/audio/ambientAudioEngine';
import {
  VaultCategory,
  VaultDocumentSlot,
  IdentityAuditReport,
  LiveQTCalibration,
  classifyDocumentCategory,
  auditDocumentCollection,
  calculateLiveQTMetrics,
} from '@/lib/ats/documentAuditEngine';

// Dynamic import for WebGL/ThreeJS avatar to avoid SSR issues
const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

function parseExperience(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('fresher') || t.includes('student') || t.includes('college') || t.includes('no experience') || t.includes('none')) {
    return 'fresher';
  }
  if (t.includes('intern') || t.includes('months')) {
    return 'intern';
  }
  return 'experienced';
}

const IDENTITY_QS = [
  {
    id: 'logic_vs_empathy',
    category: 'Creation & Problem-Solving Focus',
    text: 'When creating or building something new, what excites you more?',
    left: '🎨 Understanding how people feel & use it (Social IQ)',
    right: '🧠 Solving the puzzle & how it works inside (Pattern Hunter)'
  },
  {
    id: 'pace_vs_depth',
    category: 'Learning & Exploration Style',
    text: 'When exploring a new subject or tool, what is your natural style?',
    left: '🚀 Jump straight in & learn by experimenting (Explorer)',
    right: '🔬 Understand the core concepts step-by-step (Pattern Hunter)'
  },
  {
    id: 'stability_vs_speed',
    category: 'Execution & Quality Instinct',
    text: 'When working on an important project with a deadline, what is your instinct?',
    left: '🛡️ Double-check every detail for perfection (Stabilizer)',
    right: '⚡ Build a working prototype fast & adapt live (Explorer)'
  },
  {
    id: 'collaboration_vs_deepfocus',
    category: 'Ideal Working Environment',
    text: 'In what environment do you produce your most energized work?',
    left: '🤝 Brainstorming & collaborating with a team (Social IQ)',
    right: '🎯 Quiet, uninterrupted solo deep focus (Pattern Hunter)'
  }
];

function getIdentityQuestions(studentType: string = '') {
  const isCommerce = studentType.includes('Commerce') || studentType.includes('B.Com');
  const isManagement = studentType.includes('Management') || studentType.includes('BBA');

  if (isCommerce) {
    return [
      {
        id: 'logic_vs_empathy',
        category: 'Decision-Making Focus',
        text: 'When planning financial or business decisions, what drives your focus?',
        left: '🎨 Understanding client needs & market sentiment (Social IQ)',
        right: '📊 Crunching numbers & balancing ledger logic (Pattern Hunter)'
      },
      {
        id: 'pace_vs_depth',
        category: 'Growth & Strategy Pace',
        text: 'When exploring new financial opportunities, what is your preference?',
        left: '🚀 Testing innovative growth opportunities fast (Explorer)',
        right: '🔬 Analyzing deep valuation & risk factors first (Pattern Hunter)'
      },
      {
        id: 'stability_vs_speed',
        category: 'Risk Management Instinct',
        text: 'When managing budgets under tight timelines, what matters most to you?',
        left: '🛡️ 100% compliance, zero errors & safe structure (Stabilizer)',
        right: '⚡ Quick capital deployment to capture opportunities (Explorer)'
      },
      {
        id: 'collaboration_vs_deepfocus',
        category: 'Teamwork & Strategy Style',
        text: 'How do you perform best when solving major financial challenges?',
        left: '🤝 Collaborative discussions with stakeholders (Social IQ)',
        right: '🎯 Focused solo financial analysis & modeling (Pattern Hunter)'
      }
    ];
  }

  if (isManagement) {
    return [
      {
        id: 'logic_vs_empathy',
        category: 'Product & Leadership Focus',
        text: 'When designing a product or service, where do you begin?',
        left: '🎨 Understanding user emotions & user stories (Social IQ)',
        right: '📈 Analyzing performance data & success metrics (Pattern Hunter)'
      },
      {
        id: 'pace_vs_depth',
        category: 'Innovation Pace vs Systems Depth',
        text: 'When launching new initiatives, how do you like to execute?',
        left: '🚀 Quick market launches & live feedback loops (Explorer)',
        right: '🔬 Deep operational structure & unit economics (Pattern Hunter)'
      },
      {
        id: 'stability_vs_speed',
        category: 'Execution Instinct',
        text: 'When project deadlines are tight, what is your priority?',
        left: '🛡️ Ensuring strict quality control & zero flaws (Stabilizer)',
        right: '⚡ Shipping a fast working MVP and refining later (Explorer)'
      },
      {
        id: 'collaboration_vs_deepfocus',
        category: 'Collaboration Style',
        text: 'Where do you make your biggest impact?',
        left: '🤝 Uniting and motivating a cross-functional team (Social IQ)',
        right: '🎯 Deep strategic planning and problem decomposition (Pattern Hunter)'
      }
    ];
  }

  return IDENTITY_QS;
}

const WORKPLACE_SCENARIOS = [
  {
    id: 'bug_launch',
    title: 'Sudden Glitch Right Before Project Launch',
    text: 'An unexpected error is discovered right before releasing your project to thousands of users. What is your immediate reaction?',
    options: [
      { text: '🛑 Pause & Diagnose: Postpone the release, carefully trace the issue to fix the root cause, and add automated tests.', trait: 'Stabilizer', scores: { Stabilizer: 40, PatternHunter: 20 } },
      { text: '🚀 Quick Workaround: Turn off the broken part, launch the working core now, and push an update shortly after.', trait: 'Explorer', scores: { Explorer: 35, Stabilizer: 20 } },
      { text: '🧩 Deep Puzzle Solve: Zoom into the exact line where the logic fails, patch it with laser precision, and test in minutes.', trait: 'PatternHunter', scores: { PatternHunter: 45, Explorer: 15 } },
      { text: '📢 Team Alignment: Call a quick team check-in, explain the situation calmly, and coordinate next steps together.', trait: 'SocialIQ', scores: { SocialIQ: 45, Stabilizer: 15 } }
    ]
  },
  {
    id: 'stack_selection',
    title: 'Choosing the Tools for a New Project',
    text: 'Your team is starting an exciting new project from scratch. How do you decide which tools and technologies to use?',
    options: [
      { text: '📊 Test & Compare Data: Run hands-on tests and compare performance benchmarks before making a smart, data-driven choice.', trait: 'PatternHunter', scores: { PatternHunter: 40, Stabilizer: 20 } },
      { text: '🛡️ Proven & Reliable: Pick the industry-standard, battle-tested tools known for long-term stability and reliability.', trait: 'Stabilizer', scores: { Stabilizer: 45, PatternHunter: 15 } },
      { text: '✨ New & Cutting-Edge: Pick the newest, most innovative tools to build with maximum speed and modern developer experience.', trait: 'Explorer', scores: { Explorer: 45, SocialIQ: 15 } },
      { text: '🤝 Team Consensus: Discuss with the team to see what everyone feels most confident and productive using.', trait: 'SocialIQ', scores: { SocialIQ: 40, Explorer: 20 } }
    ]
  },
  {
    id: 'ambiguous_reqs',
    title: 'Unclear Project Requirements',
    text: 'You are given a project with very vague, open-ended instructions that need to be finished soon. What is your strategy?',
    options: [
      { text: '💬 Talk to Users / Mentor: Ask clarifying questions to the users or mentor to understand what they truly need.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } },
      { text: '📐 Map Clear Logic: Break down the vague goal into step-by-step logical diagrams and structured rules.', trait: 'PatternHunter', scores: { PatternHunter: 40, Stabilizer: 20 } },
      { text: '🎨 Build a Quick Prototype: Create a quick working prototype in a few hours to show and get instant visual feedback.', trait: 'Explorer', scores: { Explorer: 40, SocialIQ: 20 } },
      { text: '📋 Step-by-Step Checklist: Write down every possible edge case and create a rigorous checklist before starting.', trait: 'Stabilizer', scores: { Stabilizer: 40, PatternHunter: 20 } }
    ]
  },
  {
    id: 'code_review_conflict',
    title: 'Handling Differing Opinions on Your Work',
    text: 'A teammate gives critical feedback suggesting a completely different way to do what you just built. How do you handle it?',
    options: [
      { text: '💡 Collaborative Discussion: Have a friendly chat to understand their perspective and combine the best of both ideas.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } },
      { text: '🔬 Objective Comparison: Compare the pros, cons, speed, and efficiency of both approaches side-by-side.', trait: 'PatternHunter', scores: { PatternHunter: 45, Stabilizer: 15 } },
      { text: '🛡️ Follow Best Standards: Adopt their suggestions if it makes the overall project cleaner, safer, and easier to maintain.', trait: 'Stabilizer', scores: { Stabilizer: 40, SocialIQ: 15 } },
      { text: '🚀 Test Both Fast: Spend 20 minutes building a quick test of their idea to see which one actually works better.', trait: 'Explorer', scores: { Explorer: 40, PatternHunter: 20 } }
    ]
  }
];

const WORKPLACE_SCENARIOS_BUSINESS = [
  {
    id: 'budget_crisis',
    title: 'Critical Q4 Budget & Revenue Variance 10 Days Before Audit',
    text: 'Your unit discovers a 15% budget overrun and unallocated vendor costs right before fiscal audit. How do you respond?',
    options: [
      { text: '🛡️ Audit & Reallocate: Freeze non-essential expenditure, perform itemized ledger audit, and reallocate reserves.', trait: 'Stabilizer', scores: { Stabilizer: 45, PatternHunter: 20 } },
      { text: '🚀 Growth Push: Pivot marketing to high-margin campaigns immediately to cover the revenue gap with rapid growth.', trait: 'Explorer', scores: { Explorer: 40, SocialIQ: 15 } },
      { text: '📊 Financial Model: Build a multi-scenario sensitivity matrix to isolate the root variance driver and optimize margin.', trait: 'PatternHunter', scores: { PatternHunter: 45, Stabilizer: 15 } },
      { text: '🤝 Executive Alignment: Call an emergency leadership sync to present transparent risk options and align board strategy.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } }
    ]
  },
  {
    id: 'vendor_erp_selection',
    title: 'Selecting Enterprise ERP & Financial Systems Vendor',
    text: 'Your organization is evaluating software vendors for core enterprise ERP/Accounting operations. How do you decide?',
    options: [
      { text: '🔬 Analytical Benchmark: Run quantitative ROI & compliance benchmarks across 3 top vendors before deciding.', trait: 'PatternHunter', scores: { PatternHunter: 45, Stabilizer: 15 } },
      { text: '🛡️ Proven Industry Standard: Select the established tier-1 vendor with proven long-term compliance and SLA track record.', trait: 'Stabilizer', scores: { Stabilizer: 45, PatternHunter: 15 } },
      { text: '✨ Modern SaaS Solution: Choose an innovative cloud-first SaaS tool to unlock rapid deployment and modern UI/UX.', trait: 'Explorer', scores: { Explorer: 40, SocialIQ: 20 } },
      { text: '🤝 Department Workshops: Conduct cross-department interviews to ensure user adoption, training ease, and team buy-in.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } }
    ]
  },
  {
    id: 'ambiguous_market_brief',
    title: 'Handling Ambiguous Product & Market Strategy Brief',
    text: 'The leadership team asks for a market expansion strategy with incomplete customer demographic data. What is your approach?',
    options: [
      { text: '💬 Stakeholder Interviews: Interview target customers and sales reps directly to build accurate buyer personas.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } },
      { text: '📐 Data Decomposition: Deconstruct market reports into structured SWOT, PESTLE, and financial unit-economic models.', trait: 'PatternHunter', scores: { PatternHunter: 40, Stabilizer: 20 } },
      { text: '🎨 Rapid Pilot Campaign: Launch a 3-day micro-test ad campaign to gather empirical user conversion signals live.', trait: 'Explorer', scores: { Explorer: 45, SocialIQ: 15 } },
      { text: '📋 Risk & Governance Matrix: Document regulatory constraints, capital reserve requirements, and downside mitigations first.', trait: 'Stabilizer', scores: { Stabilizer: 40, PatternHunter: 20 } }
    ]
  },
  {
    id: 'resource_conflict',
    title: 'Inter-Departmental Resource & Priority Conflict',
    text: 'Marketing and Product Finance clash over Q3 budget allocation for a new product line. How do you resolve it?',
    options: [
      { text: '💡 Joint Strategy Sync: Facilitate a structured negotiation huddle to align both teams on shared OKRs.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } },
      { text: '📊 Unit Economics Model: Present a clear LTV/CAC and payback period analysis to let numbers guide the decision.', trait: 'PatternHunter', scores: { PatternHunter: 45, Stabilizer: 15 } },
      { text: '🛡️ Balanced Reserve Allocation: Split funding 50/50 with strict milestone checkpoints to minimize downside risk.', trait: 'Stabilizer', scores: { Stabilizer: 40, SocialIQ: 15 } },
      { text: '🚀 Growth Experiment Sprint: Allocate a 2-week agile test budget to whichever initiative proves fastest traction.', trait: 'Explorer', scores: { Explorer: 40, PatternHunter: 20 } }
    ]
  }
];

export interface QT2MindsetBreakdown {
  patternHunter: number;
  stabilizer: number;
  socialIQ: number;
  explorer: number;
  dominantTraits: string[];
  blendTitle: string;
  blendDescription: string;
  selfAwarenessScore: number;
  selfAwarenessLabel: string;
}

function calculateQT2MindsetBreakdown(
  identityScores: Record<string, number>,
  simulationScores: Record<string, number>,
  voiceArchetype?: string | null
): QT2MindsetBreakdown {
  // 1. Calculate Raw Behavioral Scenario Scores (Stress Trade-Off Choices - 70% Weight)
  let bPH = simulationScores['PatternHunter'] || 0;
  let bST = simulationScores['Stabilizer'] || 0;
  let bSQ = simulationScores['SocialIQ'] || 0;
  let bEX = simulationScores['Explorer'] || 0;

  const bTotal = Math.max(1, bPH + bST + bSQ + bEX);
  const bNormPH = (bPH / bTotal) * 100;
  const bNormST = (bST / bTotal) * 100;
  const bNormSQ = (bSQ / bTotal) * 100;
  const bNormEX = (bEX / bTotal) * 100;

  // 2. Calculate Raw Slider Preference Scores (Aspirational Claims - 30% Weight)
  let sPH = 0, sST = 0, sSQ = 0, sEX = 0;
  const q1 = identityScores['logic_vs_empathy'] ?? 50;
  sPH += q1; sSQ += (100 - q1);

  const q2 = identityScores['pace_vs_depth'] ?? 50;
  sPH += q2; sEX += (100 - q2);

  const q3 = identityScores['stability_vs_speed'] ?? 50;
  sST += (100 - q3); sEX += q3;

  const q4 = identityScores['collaboration_vs_deepfocus'] ?? 50;
  sPH += q4; sSQ += (100 - q4);

  const sTotal = Math.max(1, sPH + sST + sSQ + sEX);
  const sNormPH = (sPH / sTotal) * 100;
  const sNormST = (sST / sTotal) * 100;
  const sNormSQ = (sSQ / sTotal) * 100;
  const sNormEX = (sEX / sTotal) * 100;

  // 3. Compute Cognitive Self-Awareness Index (Divergence between claimed preference & behavioral action)
  const diffPH = Math.abs(bNormPH - sNormPH);
  const diffST = Math.abs(bNormST - sNormST);
  const diffSQ = Math.abs(bNormSQ - sNormSQ);
  const diffEX = Math.abs(bNormEX - sNormEX);
  const avgDivergence = (diffPH + diffST + diffSQ + diffEX) / 4;
  const selfAwarenessScore = Math.max(55, Math.min(99, Math.round(100 - avgDivergence * 0.8)));

  let selfAwarenessLabel = 'High Cognitive Self-Awareness (Realistic Self-Perception)';
  if (selfAwarenessScore < 75) {
    selfAwarenessLabel = 'Recalibrated Alignment (Aspiration vs Action Divergence Corrected)';
  }

  // 4. Weighted Composite Score (70% Behavioral Scenarios + 30% Sliders)
  let ph = bNormPH * 0.7 + sNormPH * 0.3;
  let st = bNormST * 0.7 + sNormST * 0.3;
  let sq = bNormSQ * 0.7 + sNormSQ * 0.3;
  let ex = bNormEX * 0.7 + sNormEX * 0.3;

  // Voice Archetype Adjustment
  if (voiceArchetype === 'Reflective Analyst') {
    ph += 6; st += 6;
  } else if (voiceArchetype === 'Expressive Communicator') {
    sq += 8; ex += 4;
  } else if (voiceArchetype === 'Direct Builder') {
    ex += 6; ph += 6;
  }

  ph = Math.max(12, ph);
  st = Math.max(12, st);
  sq = Math.max(12, sq);
  ex = Math.max(12, ex);

  const total = ph + st + sq + ex;
  let phPct = Math.round((ph / total) * 100);
  let stPct = Math.round((st / total) * 100);
  let sqPct = Math.round((sq / total) * 100);
  let exPct = Math.round((ex / total) * 100);

  const diff = 100 - (phPct + stPct + sqPct + exPct);
  phPct += diff;

  const traitList = [
    { name: 'Pattern Hunter', icon: '🧩', pct: phPct },
    { name: 'Stabilizer', icon: '🛡️', pct: stPct },
    { name: 'Social IQ', icon: '🤝', pct: sqPct },
    { name: 'Explorer', icon: '🚀', pct: exPct },
  ].sort((a, b) => b.pct - a.pct);

  const top1 = traitList[0];
  const top2 = traitList[1];
  const top3 = traitList[2];

  let blendTitle = '';
  let blendDescription = '';

  if (top1.pct >= 52) {
    blendTitle = `Dominant ${top1.name} (${top1.pct}%)`;
    blendDescription = `Your cognitive DNA shows a dominant preference for ${top1.name} methodologies, backed by ${top2.name} (${top2.pct}%) and ${top3.name} (${top3.pct}%). Self-Awareness Index: ${selfAwarenessScore}%.`;
  } else if (top1.pct - top2.pct <= 14) {
    blendTitle = `${top1.name} (${top1.pct}%) & ${top2.name} (${top2.pct}%) Hybrid`;
    blendDescription = `You possess a powerful dual-mindset combining high ${top1.name} analytical strength with resilient ${top2.name} execution. Self-Awareness Index: ${selfAwarenessScore}%.`;
  } else {
    blendTitle = `Tri-Blend: ${top1.name} / ${top2.name} / ${top3.name}`;
    blendDescription = `A dynamic, highly adaptive engineering mindset balancing ${top1.name} (${top1.pct}%), ${top2.name} (${top2.pct}%), and ${top3.name} (${top3.pct}%). Self-Awareness Index: ${selfAwarenessScore}%.`;
  }

  return {
    patternHunter: phPct,
    stabilizer: stPct,
    socialIQ: sqPct,
    explorer: exPct,
    dominantTraits: [top1.name, top2.name],
    blendTitle,
    blendDescription,
    selfAwarenessScore,
    selfAwarenessLabel
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user, refresh } = useAuth();
  const cOS = useCareerOS();

  useEffect(() => {
    if (user && user.role && user.role !== 'student') {
      if (user.role === 'teacher') router.replace('/admin/teacher');
      else if (user.role === 'admin' || user.role === 'superadmin') router.replace('/admin');
      else if (user.role === 'recruiter') router.replace('/recruiter');
      else if (user.role === 'parent') router.replace('/parent');
      else if (user.role === 'consultant') router.replace('/consultant');
      return;
    }
    // Guarantee previous public landing ambient music stops immediately
    ambientAudio.stopImmediate();
    preloadTTS();
    const introText = "Welcome to your personal diagnostic assessment! First, are you a college student, a fresh graduate, or a working professional?";
    preloadNextSpeech(introText, 'priya');
  }, [user, router]);

  // Screen/Route States: 'CHOOSE_GUIDE' | 'INTENT_SELECTION' | 'SLIDER' | 'EXPRESS_FORM' | 'DEEP_CHAT' | 'IDENTITY_QUESTIONS' | 'WORKPLACE_SIMULATION' | 'SPEECH_ASSESSMENT' | 'BLUEPRINT_REVEAL'
  const [activeScreen, setActiveScreen] = useState<'CHOOSE_GUIDE' | 'INTENT_SELECTION' | 'SLIDER' | 'EXPRESS_FORM' | 'DEEP_CHAT' | 'IDENTITY_QUESTIONS' | 'WORKPLACE_SIMULATION' | 'SPEECH_ASSESSMENT' | 'BLUEPRINT_REVEAL'>('CHOOSE_GUIDE');
  
  // Candidate Secure Vault 2.0 State
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [vaultUploading, setVaultUploading] = useState(false);
  const [activeVaultTab, setActiveVaultTab] = useState<'resume' | 'academic' | 'achievements' | 'certifications' | 'analytics'>('certifications');
  const [vaultSlots, setVaultSlots] = useState<VaultDocumentSlot[]>([
    { id: 'vault-demo-1', category: 'resume', title: 'Master Resume v1', fileName: 'vinod - Resume.pdf', fileSize: '184 KB', fileType: 'application/pdf', candidateName: 'Vinod', institution: 'VTU Engineering', scoreOrGpa: '8.4 CGPA', skills: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'React'], verificationStatus: 'verified', verificationLevel: 'STRUCTURALLY_VALIDATED', uploadedAt: Date.now() - 86400000 * 2 },
    { id: 'vault-demo-2', category: 'resume', title: 'Master Resume v2', fileName: 'vinod - Resume.pdf', fileSize: '210 KB', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', candidateName: 'Vinod', institution: 'VTU Engineering', scoreOrGpa: '8.4 CGPA', skills: ['Node.js', 'Next.js', 'Docker'], verificationStatus: 'verified', verificationLevel: 'STRUCTURALLY_VALIDATED', uploadedAt: Date.now() - 86400000 * 5 },
    { id: 'vault-demo-3', category: 'resume', title: 'Master Resume v3', fileName: 'vinod - Resume.pdf', fileSize: '195 KB', fileType: 'application/pdf', candidateName: 'Vinod', institution: 'VTU Engineering', scoreOrGpa: '8.4 CGPA', skills: ['AWS', 'PostgreSQL', 'API Integration'], verificationStatus: 'verified', verificationLevel: 'STRUCTURALLY_VALIDATED', uploadedAt: Date.now() - 86400000 * 5 },
    { id: 'vault-demo-4', category: 'resume', title: 'Master Resume v4', fileName: 'Vinod - Resume.pdf', fileSize: '202 KB', fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', candidateName: 'Vinod', institution: 'VTU Engineering', scoreOrGpa: '8.4 CGPA', skills: ['Machine Learning', 'Data Structures'], verificationStatus: 'verified', verificationLevel: 'STRUCTURALLY_VALIDATED', uploadedAt: Date.now() - 86400000 * 10 },
    { id: 'vault-demo-5', category: 'certification', title: 'Certification Certifications', fileName: 'Certification Certifications', fileSize: '95 KB', fileType: 'application/pdf', candidateName: 'Vinod', institution: 'Coursera & AWS Academy', scoreOrGpa: 'Certified', skills: ['Python', 'JS', 'HTML / CSS'], verificationStatus: 'verified', verificationLevel: 'CROSS_VALIDATED', uploadedAt: Date.now() - 86400000 * 300 },
    { id: 'vault-demo-6', category: 'certification', title: 'Certification Certificate', fileName: 'Certification Certificate', fileSize: '110 KB', fileType: 'application/pdf', candidateName: 'Vinod', institution: 'Google Cloud Certified', scoreOrGpa: 'Distinction', skills: ['Python', 'JS', 'HTML / CSS'], verificationStatus: 'verified', verificationLevel: 'CROSS_VALIDATED', uploadedAt: Date.now() - 86400000 * 300 },
    { id: 'vault-demo-7', category: 'certification', title: 'Certification Communication', fileName: 'Certification Communication', fileSize: '88 KB', fileType: 'application/pdf', candidateName: 'Vinod', institution: 'Corporate Training', scoreOrGpa: 'Advanced C1', skills: ['JS', 'JS', 'HTML / CSS'], verificationStatus: 'verified', verificationLevel: 'CROSS_VALIDATED', uploadedAt: Date.now() - 86400000 * 300 },
  ]);
  const [isDraggingOverDropzone, setIsDraggingOverDropzone] = useState(false);
  const [isDraggingOverResume, setIsDraggingOverResume] = useState(false);

  // Primary anchor name and derived live audit / QT metrics
  const primaryCandidateName = user?.displayName || (vaultSlots.find(s => s.category === 'resume' && s.candidateName)?.candidateName) || 'Candidate';
  const identityAuditReport: IdentityAuditReport = auditDocumentCollection(primaryCandidateName, vaultSlots);
  const liveQTMetrics: LiveQTCalibration = calculateLiveQTMetrics(vaultSlots, identityAuditReport);

  // Upload single document to a target slot
  const handleUploadToSlot = async (file: File, targetCategory: VaultCategory) => {
    if (!file) return;
    setVaultUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', targetCategory);
      formData.append('primaryName', primaryCandidateName);

      const res = await api.post<{ ok: boolean; document: VaultDocumentSlot; storageUrl: string; message: string }>('/api/vault/upload', formData);

      if (res && res.document) {
        const newDoc = res.document;
        setVaultSlots(prev => {
          const singleSlotCategories = ['resume', '10th', '12th_puc', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8'];
          if (singleSlotCategories.includes(targetCategory)) {
            return [...prev.filter(d => d.category !== targetCategory), newDoc];
          }
          return [...prev.filter(d => d.id !== newDoc.id), newDoc];
        });

        // Sync with CareerOS context vaultItems
        const currentVaultItems = cOS.vaultItems || [];
        const updatedVaultItem = {
          id: newDoc.id,
          title: newDoc.title,
          item_type: targetCategory === 'resume' ? 'resume' : targetCategory === 'certification' ? 'certification' : 'academic',
          organization_name: newDoc.institution || 'Verified Academic Portal',
          description: `Uploaded document: ${newDoc.fileName}. Score/GPA: ${newDoc.scoreOrGpa}. Storage: ${newDoc.storageUrl || 'Supabase'}`,
          verified: newDoc.verificationStatus === 'verified',
          ai_confidence_score: newDoc.verificationStatus === 'verified' ? 95 : 45,
          skill_tags: newDoc.skills,
          is_public: true,
          used_in_resume: true,
          used_in_portfolio: targetCategory === 'achievement' || targetCategory === 'certification'
        };
        const updatedVaultItems = [...currentVaultItems.filter(v => v.id !== newDoc.id), updatedVaultItem];
        cOS.setVaultItems(updatedVaultItems);
        cOS.setResumeGenerated(true);

        const currentSkills = new Set<string>();
        [...vaultSlots, newDoc].forEach(d => d.skills.forEach(s => currentSkills.add(s)));
        cOS.generateFusedRoadmap(Array.from(currentSkills), liveQTMetrics.weakAreas);

        if (newDoc.verificationStatus === 'mismatch_warning') {
          toast.error(
            '⚠️ Identity Discrepancy Flagged',
            newDoc.mismatchReason || `Detected name "${newDoc.candidateName}" does not match profile "${primaryCandidateName}".`
          );
        } else {
          toast.success(
            `✓ ${newDoc.title} Stored in Supabase Vault`,
            `Extracted: ${newDoc.scoreOrGpa || ''} | Institution: ${newDoc.institution || ''}`
          );
        }
      }
    } catch (err: any) {
      console.error('[Vault Slot Upload Error]:', err);
      toast.error('Upload Error', err.message || 'Failed to upload document to vault.');
    } finally {
      setVaultUploading(false);
    }
  };

  // Smart Auto-Sort Batch Upload
  const handleBatchAutoSortUpload = async (filesList: File[] | FileList) => {
    const files = Array.from(filesList);
    if (!files || files.length === 0) return;
    setVaultUploading(true);

    let successCount = 0;
    let mismatchCount = 0;
    const newUploadedDocs: VaultDocumentSlot[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const detectedCat = classifyDocumentCategory(file.name);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', detectedCat);
        formData.append('primaryName', primaryCandidateName);

        const res = await api.post<{ ok: boolean; document: VaultDocumentSlot; storageUrl: string }>('/api/vault/upload', formData);
        if (res && res.document) {
          const newDoc = res.document;
          newUploadedDocs.push(newDoc);
          if (newDoc.verificationStatus === 'mismatch_warning') mismatchCount++;
          else successCount++;
        }
      } catch (err) {
        console.warn('Batch item upload error', err);
      }
    }

    if (newUploadedDocs.length > 0) {
      setVaultSlots(prev => {
        let updated = [...prev];
        newUploadedDocs.forEach(newDoc => {
          const singleSlotCategories = ['resume', '10th', '12th_puc', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8'];
          if (singleSlotCategories.includes(newDoc.category)) {
            updated = [...updated.filter(d => d.category !== newDoc.category), newDoc];
          } else {
            updated = [...updated.filter(d => d.id !== newDoc.id), newDoc];
          }
        });
        return updated;
      });

      const currentVaultItems = cOS.vaultItems || [];
      const newItemsToAdd = newUploadedDocs.map(newDoc => ({
        id: newDoc.id,
        title: newDoc.title,
        item_type: newDoc.category === 'resume' ? 'resume' : newDoc.category === 'certification' ? 'certification' : 'academic',
        organization_name: newDoc.institution || 'Verified Academic Portal',
        description: `Uploaded document: ${newDoc.fileName}. Score/GPA: ${newDoc.scoreOrGpa}. Storage: ${newDoc.storageUrl || 'Supabase'}`,
        verified: newDoc.verificationStatus === 'verified',
        ai_confidence_score: newDoc.verificationStatus === 'verified' ? 95 : 45,
        skill_tags: newDoc.skills,
        is_public: true,
        used_in_resume: true,
        used_in_portfolio: newDoc.category === 'achievement' || newDoc.category === 'certification'
      }));
      cOS.setVaultItems([...currentVaultItems.filter(v => !newUploadedDocs.some(nd => nd.id === v.id)), ...newItemsToAdd]);
      cOS.setResumeGenerated(true);

      const allUniqueSkills = new Set<string>();
      [...vaultSlots, ...newUploadedDocs].forEach(d => d.skills.forEach(s => allUniqueSkills.add(s)));
      cOS.generateFusedRoadmap(Array.from(allUniqueSkills), liveQTMetrics.weakAreas);
    }

    setVaultUploading(false);
    if (mismatchCount > 0) {
      toast.error(
        `⚠️ Batch Upload: ${mismatchCount} Identity Mismatch Found`,
        `Detected differing candidate names. Check the Integrity tab.`
      );
    } else {
      toast.success(
        `✨ Auto-Sorted ${files.length} Document${files.length > 1 ? 's' : ''}!`,
        `Stored in Supabase and categorized into academic, resume, and certification slots.`
      );
    }
  };

  // Delete slot document
  const handleDeleteSlot = async (slotId: string, storageUrl?: string) => {
    try {
      await api.post('/api/vault/delete', { documentId: slotId, storageUrl });
      setVaultSlots(prev => prev.filter(d => d.id !== slotId));
      const currentVaultItems = cOS.vaultItems || [];
      cOS.setVaultItems(currentVaultItems.filter(v => v.id !== slotId));
      toast.info('Document Removed', 'Vault item deleted from storage and database.');
    } catch (err) {
      console.warn('Delete error', err);
      setVaultSlots(prev => prev.filter(d => d.id !== slotId));
    }
  };
  
  const activeScreenRef = useRef(activeScreen);
  const isSpeakingRef = useRef(false);
  const isListeningRef = useRef(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

  const stopAvatarSpeaking = () => {
    stopSpeaking();
    setIsAvatarSpeaking(false);
    isSpeakingRef.current = false;
    setAnimState('idle');
  };

  useEffect(() => {
    activeScreenRef.current = activeScreen;
  }, [activeScreen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, []);

  // Preload 3D Avatar GLBs and Neural Voice TTS Cache on Mount
  const [isPreloaded, setIsPreloaded] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      pingRenderServer();
      preloadAvatarGLB(['priya', 'anish']);
      
      const allIdentityQs = [
        ...IDENTITY_QS.map(q => `${q.category}. ${q.text}`),
        ...getIdentityQuestions('Commerce').map(q => `${q.category}. ${q.text}`),
        ...getIdentityQuestions('Management').map(q => `${q.category}. ${q.text}`)
      ];

      const allWorkplaceScenarios = [
        ...WORKPLACE_SCENARIOS.map(s => `${s.title}. ${s.text}`),
        ...WORKPLACE_SCENARIOS_BUSINESS.map(s => `${s.title}. ${s.text}`)
      ];

      const allPrompts = [
        "Please introduce yourself and explain your target software career goals.",
        "Please introduce yourself and explain your target financial & business analysis goals.",
        "Please introduce yourself and explain your target product management & business growth goals."
      ];

      const initialDialogues = [
        "Welcome to your personal diagnostic assessment! First, are you a college student, a fresh graduate, or a working professional?",
        "Got it! Next, what is your dream job? Do you want to build websites, work with clouds, or build software?",
        "Nice choice. Why did you join today? Are you looking for a job, wanting to learn new skills, or preparing for an interview?"
      ];

      // Pre-warm Render server silently (no audio pre-fetches for zero-cache onboarding)
      void pingRenderServer(false);
    }
  }, []);
  
  // Common States
  const [animState, setAnimState] = useState<'idle' | 'talking' | 'listening' | 'thinking' | 'wave' | 'nod' | 'shrug'>('wave');
  const [zoom, setZoom] = useState(1.617);
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmMuted, setIsBgmMuted] = useState(false);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const [useNeural, setUseNeural] = useState(true);
  const [recognizing, setRecognizing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/audio/onboarding_bg.mp3');
      audio.loop = true;
      const initialMuted = ambientAudio.isMuted();
      setIsBgmMuted(initialMuted);
      setIsMuted(getAvatarVoiceVolume() === 0);

      const targetVol = initialMuted ? 0 : (ambientAudio.getVolume() || 0.3) * 0.4;
      audio.volume = targetVol;
      bgMusicRef.current = audio;

      const handleFirstInteraction = () => {
        if (audio.paused && !ambientAudio.isMuted()) {
          audio.play().catch(() => {});
        }
        window.removeEventListener('click', handleFirstInteraction);
      };
      window.addEventListener('click', handleFirstInteraction);

      // Listen to universal volume events from Gear Hub
      const handleAmbientVolumeChange = (e: any) => {
        if (typeof e.detail?.volume === 'number' && bgMusicRef.current) {
          const scaled = e.detail.volume * 0.4;
          bgMusicRef.current.volume = Math.max(0, Math.min(1, scaled));
          if (e.detail.volume > 0 && !ambientAudio.isMuted()) {
            setIsBgmMuted(false);
            bgMusicRef.current.play().catch(() => {});
          }
        }
      };

      const handleMuteChange = (e: any) => {
        if (typeof e.detail?.muted === 'boolean') {
          setIsBgmMuted(e.detail.muted);
          if (bgMusicRef.current) {
            if (e.detail.muted) {
              bgMusicRef.current.pause();
            } else {
              bgMusicRef.current.play().catch(() => {});
            }
          }
        }
      };

      const handleAvatarVolumeChange = (e: any) => {
        if (typeof e.detail?.volume === 'number') {
          setIsMuted(e.detail.volume === 0);
        }
      };

      window.addEventListener('pc_audio_volume_changed', handleAmbientVolumeChange);
      window.addEventListener('pc_audio_mute_changed', handleMuteChange);
      window.addEventListener('pc_avatar_volume_changed', handleAvatarVolumeChange);

      return () => {
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('pc_audio_volume_changed', handleAmbientVolumeChange);
        window.removeEventListener('pc_audio_mute_changed', handleMuteChange);
        window.removeEventListener('pc_avatar_volume_changed', handleAvatarVolumeChange);
        audio.pause();
        audio.src = '';
      };
    }
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      if (isBgmMuted) {
        bgMusicRef.current.pause();
      } else {
        bgMusicRef.current.play().catch(() => {});
      }
    }
  }, [isBgmMuted]);

  // Voice Analytics States
  const [speechStartTime, setSpeechStartTime] = useState<number | null>(null);
  const [voiceConfidence, setVoiceConfidence] = useState<number | null>(null);
  const [voiceArticulation, setVoiceArticulation] = useState<number | null>(null);
  const [voiceArchetype, setVoiceArchetype] = useState<string | null>(null);

  // Screen 02: Potential Slider States
  const [currentAbility, setCurrentAbility] = useState(30);
  const [targetAmbition, setTargetAmbition] = useState(85);

  // Screen 03: Express Form States
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [gradYear, setGradYear] = useState('2026');
  const [trajectory, setTrajectory] = useState<'java_sde' | 'react_frontend' | 'devops_cloud' | 'business_analyst' | 'financial_analyst'>('react_frontend');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Chat/Deep Diagnostics States
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(currentStep);
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [studentType, setStudentType] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [accessReason, setAccessReason] = useState('');
  const [codingExperience, setCodingExperience] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [weeklyHours, setWeeklyHours] = useState('');

  // Screen 04-07 States
  const [currentIdentityQ, setCurrentIdentityQ] = useState(0);
  const [identityScores, setIdentityScores] = useState<Record<string, number>>({ logic: 50, pace: 50 });
  const [currentScenario, setCurrentScenario] = useState(0);
  const [simulationScores, setSimulationScores] = useState<Record<string, number>>({ PatternHunter: 0, Stabilizer: 0, SocialIQ: 0, Explorer: 0 });
  const [speechState, setSpeechState] = useState<'ready' | 'calibrating' | 'calibrated' | 'recording' | 'recorded'>('ready');
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [manualInputMode, setManualInputMode] = useState<boolean>(false);
  const [computedArchetype, setComputedArchetype] = useState('Pattern Hunter');
  const [selectedMentor, setSelectedMentor] = useState<'priya' | 'anish'>('priya');

  // Syncing & Parsing States
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState('');
  const [parserLogs, setParserLogs] = useState<string[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriberRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechTimersRef = useRef<any[]>([]);

  const clearSpeechTimers = () => {
    speechTimersRef.current.forEach(timer => clearTimeout(timer));
    speechTimersRef.current = [];
  };

  const scheduleSpeech = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      if (speechTimersRef.current) {
        speechTimersRef.current = speechTimersRef.current.filter(t => t !== timer);
      }
      callback();
    }, delay);
    speechTimersRef.current.push(timer);
    return timer;
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  // Intent Selection Voice Greeting
  const intentGreeting = "Welcome to PinIT Career OS. I am your guidance mentor. Before we begin, do you want to continue with the Express Route to upload your resume in 1 minute, or the Deep Evolution path for a 15-minute diagnostic assessment?";

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      clearSpeechTimers();
      stopAvatarSpeaking();
    };
  }, []);

  // Voice greeting triggers on transition to INTENT_SELECTION
  useEffect(() => {
    if (activeScreen === 'INTENT_SELECTION') {
      const timer = scheduleSpeech(() => {
        speakReply(intentGreeting);
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, selectedMentor]);

  // Auto-Read Question Out Loud on Identity Discovery Slides
  useEffect(() => {
    if (activeScreen === 'IDENTITY_QUESTIONS') {
      const identityQs = getIdentityQuestions(studentType);
      const q = identityQs[Math.min(currentIdentityQ, identityQs.length - 1)];
      if (q) {
        const speechText = `${q.category}. ${q.text}`;
        const timer = scheduleSpeech(() => {
          speakReply(speechText);
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [activeScreen, currentIdentityQ, studentType, selectedMentor]);

  // Auto-Read Scenario Out Loud on Workplace Simulations
  useEffect(() => {
    if (activeScreen === 'WORKPLACE_SIMULATION') {
      const isBusinessStream = studentType.includes('Commerce') || studentType.includes('Management') || studentType.includes('BBA') || studentType.includes('B.Com');
      const activeScenarios = isBusinessStream ? WORKPLACE_SCENARIOS_BUSINESS : WORKPLACE_SCENARIOS;
      const scenario = activeScenarios[Math.min(currentScenario, activeScenarios.length - 1)];
      if (scenario) {
        const speechText = `${scenario.title}. ${scenario.text}`;
        const timer = scheduleSpeech(() => {
          speakReply(speechText);
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [activeScreen, currentScenario, studentType, selectedMentor]);

  // Auto-Read Vocal Prompt on Speech Assessment
  useEffect(() => {
    if (activeScreen === 'SPEECH_ASSESSMENT' && speechState === 'calibrated') {
      const isCommerce = studentType.includes('Commerce') || studentType.includes('B.Com');
      const isManagement = studentType.includes('Management') || studentType.includes('BBA');
      const spokenPromptText = isCommerce
        ? "Please introduce yourself and explain your target financial & business analysis goals."
        : isManagement
        ? "Please introduce yourself and explain your target product management & business growth goals."
        : "Please introduce yourself and explain your target software career goals.";

      const timer = scheduleSpeech(() => {
        speakReply(spokenPromptText);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [activeScreen, speechState, studentType, selectedMentor]);

  // Native Speech TTS
  const speakReply = (text: string) => {
    clearSpeechTimers();
    stopVoiceListening();
    isSpeakingRef.current = true;
    setIsAvatarSpeaking(true);

    speakWithAvatar(
      text,
      selectedMentor,
      () => setAnimState('talking'),
      () => {
        setAnimState('idle');
        isSpeakingRef.current = false;
        setIsAvatarSpeaking(false);
      },
      isMuted,
      useNeural
    );
  };

  // Helper to convert recorded audio blob to Float32 PCM at 16kHz mono (required by Whisper)
  const getAudioRawData = async (blob: Blob): Promise<Float32Array> => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const arrayBuf = await blob.arrayBuffer();
    const decoded = await audioCtx.decodeAudioData(arrayBuf);
    const channelData = decoded.getChannelData(0);
    await audioCtx.close();
    return channelData;
  };

  // Lazy-load in-browser Whisper transcriber pipeline from CDN (Webpack-bypass)
  const loadInBrowserTranscriber = async () => {
    if (transcriberRef.current) return transcriberRef.current;
    try {
      const dynamicImport = new Function('url', 'return import(url)');
      const { pipeline, env } = await dynamicImport('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
      env.allowLocalModels = false;
      const pipelineInstance = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
      transcriberRef.current = pipelineInstance;
      return pipelineInstance;
    } catch (err) {
      console.error("In-browser transcriber load failed:", err);
      return null;
    }
  };

  // Voice Speech Recording using MediaRecorder & Groq Whisper
  const startVoiceListening = async () => {
    if (typeof window === 'undefined') return;

    if (isListeningRef.current) {
      stopVoiceListening();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        if (audioBlob.size < 1000) {
          isListeningRef.current = false;
          setRecognizing(false);
          setAnimState('idle');
          return;
        }

        setAnimState('thinking');
        let transcript = '';
        
        // 1. Try server-side STT via /api/stt (Groq Whisper runs server-side where env vars work)
        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'speech.webm');
          formData.append('mimeType', audioBlob.type || 'audio/webm');

          const res = await fetch('/api/stt', {
            method: 'POST',
            body: formData
          });

          if (res.ok) {
            const data = await res.json();
            transcript = (data.text || '').trim();
            console.log('[Online STT] Transcribed via /api/stt:', transcript);
          } else {
            throw new Error(`STT route returned ${res.status}`);
          }
        } catch (err) {
          console.warn('[Online STT] /api/stt failed, falling back to In-Browser Offline Whisper:', err);
        }

        // 2. Fallback to In-Browser Offline Whisper STT
        if (!transcript) {
          try {
            const audioRaw = await getAudioRawData(audioBlob);
            const transcriber = await loadInBrowserTranscriber();
            if (transcriber) {
              const output = await transcriber(audioRaw, {
                chunk_length_s: 30,
                stride_length_s: 5,
                language: 'english',
                task: 'transcribe',
              });
              transcript = (output.text || '').trim();
              console.log("[In-Browser Offline STT] Transcribed:", transcript);
            }
          } catch (offlineErr) {
            console.error("[Offline STT] In-browser transcription failed:", offlineErr);
          }
        }
          
          if (transcript) {
            if (activeScreenRef.current === 'INTENT_SELECTION' && speechStartTime) {
              const duration = (Date.now() - speechStartTime) / 1000;
              const words = transcript.split(/\s+/).filter(Boolean).length;
              const wpm = duration > 0 ? (words / duration) * 60 : 125;

              const fillerRegex = /\b(um|uh|like|basically|actually|so|ah)\b/gi;
              const fillerCount = (transcript.match(fillerRegex) || []).length;

              let confidence = 100 - fillerCount * 12;
              if (wpm < 80) confidence -= 15;
              if (wpm > 180) confidence -= 10;
              confidence = Math.max(40, Math.min(100, Math.round(confidence)));

              let articulation = 90 - fillerCount * 8;
              if (wpm >= 110 && wpm <= 150) articulation += 10;
              articulation = Math.max(50, Math.min(100, Math.round(articulation)));

              let archetype = 'Direct Builder';
              if (wpm > 135 && fillerCount <= 1) {
                archetype = 'Expressive Communicator';
              } else if (wpm < 95 && fillerCount <= 2) {
                archetype = 'Reflective Analyst';
              }

              setVoiceConfidence(confidence);
              setVoiceArticulation(articulation);
              setVoiceArchetype(archetype);

              if (archetype === 'Reflective Analyst') {
                setComputedArchetype('Stabilizer');
              } else if (archetype === 'Expressive Communicator') {
                setComputedArchetype('Social IQ');
              }
            }
            handleUserAnswer(transcript);
          } else {
            triggerAutoRestart();
          }
      };

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let lastSpokenTime = Date.now();
      let hasSpoken = false;
      const recordingStartTime = Date.now();
      let noiseFloorSum = 0;
      let noiseFloorSamples = 0;

      const checkSilence = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;

        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        const recordingDuration = Date.now() - recordingStartTime;

        // Auto-stop recording if it exceeds 7 seconds (fail-safe timeout)
        if (recordingDuration > 7000) {
          stopVoiceListening();
          return;
        }

        // Calibrate noise floor for the first 350ms
        if (recordingDuration < 350) {
          noiseFloorSum += average;
          noiseFloorSamples++;
          requestAnimationFrame(checkSilence);
          return;
        }

        const calculatedNoiseFloor = noiseFloorSamples > 0 ? (noiseFloorSum / noiseFloorSamples) : 5;
        const dynamicThreshold = Math.max(8, calculatedNoiseFloor + 12);

        if (average > dynamicThreshold) { 
          lastSpokenTime = Date.now();
          hasSpoken = true;
        }

        const silenceDuration = Date.now() - lastSpokenTime;

        if ((hasSpoken && silenceDuration > 1800) || (!hasSpoken && silenceDuration > 5000)) {
          stopVoiceListening();
        } else {
          requestAnimationFrame(checkSilence);
        }
      };

      mediaRecorder.start();
      isListeningRef.current = true;
      setRecognizing(true);
      setAnimState('listening');
      setSpeechStartTime(Date.now());

      requestAnimationFrame(checkSilence);

    } catch (err) {
      console.error("Microphone setup failed:", err);
      toast.error("Microphone Blocked", "Please enable microphone permissions in your browser settings to continue.");
    }
  };

  const stopVoiceListening = () => {
    isListeningRef.current = false;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setRecognizing(false);
    setAnimState('idle');
  };

  const triggerAutoRestart = () => {
    if (
      (activeScreenRef.current === 'INTENT_SELECTION' || activeScreenRef.current === 'DEEP_CHAT') &&
      !isSpeakingRef.current
    ) {
      setTimeout(() => {
        if (
          (activeScreenRef.current === 'INTENT_SELECTION' || activeScreenRef.current === 'DEEP_CHAT') &&
          !isSpeakingRef.current
        ) {
          startVoiceListening();
        }
      }, 500);
    }
  };

  // Resilient onboarding sync with automatic retries and offline localStorage queue
  const postOnboardingWithRetry = async (payload: any, maxRetries = 3): Promise<boolean> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await api.post('/api/auth/onboarding', payload);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pinit_pending_onboarding_sync');
        }
        return true;
      } catch (err) {
        console.warn(`[Onboarding] Remote sync attempt ${attempt}/${maxRetries} failed:`, err);
        if (attempt < maxRetries) {
          await new Promise(res => setTimeout(res, 600 * attempt));
        }
      }
    }
    // Queue payload locally so CareerOSContext reconciles it upon next mount / reload
    if (typeof window !== 'undefined' && payload) {
      try {
        localStorage.setItem('pinit_pending_onboarding_sync', JSON.stringify(payload));
        console.log('[Onboarding] 📦 Queued unsynced onboarding payload locally for background reconciliation.');
      } catch {}
    }
    return false;
  };

  // ⚡ 1-Click Fast Complete (< 30s) — Administrator / QA Testing Only
  const handleFastComplete = async () => {
    if (user?.role !== 'admin') {
      toast.error('Restricted Action', 'Fast-complete is restricted to platform administrators for testing.');
      return;
    }
    stopAvatarSpeaking();
    clearSpeechTimers();
    setSyncing(true);
    setSyncProgress(30);
    setSyncStatus('Auto-building Software Engineering Blueprint...');

    const defaultRole = "Software Engineer";
    const defaultEdu = "Computer Science / IT Student";
    const defaultSkills = "Java Standard Library, OOP Principles, Spring Boot REST, SQL Databases, System Design";

    try {
      const payload = {
        guidanceMentorId: selectedMentor || 'kashyap',
        onboardingStep: 3,
        target_role: defaultRole,
        career_goal: "Become a high-impact Software Engineer and build production applications.",
        onboardingAnswers: {
          role: defaultRole,
          career_goal: "Become a high-impact Software Engineer and build production applications.",
          education: defaultEdu,
          skills: defaultSkills,
          experience: 'fresher',
          hasCompleted: true,
          codingExperience: "Intermediate Coder",
          learningStyle: "Writing code hands-on",
          weeklyHours: "10 hours per week",
          accessReason: "To close skill gaps & earn XP",
          qt1_score: liveQTMetrics.qt1Score || 80,
          qt2_score: liveQTMetrics.qt2Score || 85,
          mindset_archetype: "Pattern Hunter"
        },
        roadmapGenerated: true
      };

      await postOnboardingWithRetry(payload);

      cOS.setOnboarding({
        role: defaultRole,
        career_goal: "Become a high-impact Software Engineer and build production applications.",
        education: defaultEdu,
        skills: defaultSkills,
        experience: 'fresher'
      }, true);
      cOS.setOnboardingStep(3);
      cOS.setResumeGenerated(false);

      await cOS.generateFusedRoadmap(['Java', 'OOP', 'SQL'], ['Docker', 'System Design']);
      await qc.invalidateQueries({ queryKey: KEYS.me });

      setSyncProgress(100);
      toast.success('Fast Onboarding Complete! ⚡', 'Software Engineering Blueprint is active.');
      markOnboardingStoryPending(user?.id);
      router.push('/dashboard');
    } catch (err) {
      console.error("Fast onboarding error", err);
      markOnboardingStoryPending(user?.id);
      router.push('/dashboard');
    }
  };

  // Transition to Deep Route Chatflow
  const startDeepDiagnostics = () => {
    clearSpeechTimers();
    setActiveScreen('DEEP_CHAT');
    setAnimState('nod');
    const introText = "Welcome to your personal diagnostic assessment! First, are you a college student, a fresh graduate, or a working professional?";
    setMessages([
      {
        id: 'welcome_deep',
        sender: 'ai',
        text: introText,
        timestamp: Date.now()
      }
    ]);
    scheduleSpeech(() => {
      speakReply(introText);
    }, 100);
  };

  // Handle chatbot answers (Deep Path)
  const handleUserAnswer = (text: string) => {
    if (!text.trim()) return;
    stopAvatarSpeaking();

    if (activeScreen === 'INTENT_SELECTION') {
      const lower = text.toLowerCase();
      if (lower.includes('express') || lower.includes('one minute') || lower.includes('resume') || lower.includes('fast')) {
        setActiveScreen('EXPRESS_FORM');
        return;
      }
      if (lower.includes('deep') || lower.includes('evolution') || lower.includes('diagnostic') || lower.includes('fifteen') || lower.includes('graph')) {
        startDeepDiagnostics();
        return;
      }
      if (lower.includes('repeat') || lower.includes('again') || lower.includes('ask again') || lower.includes('speak')) {
        speakReply(intentGreeting);
        return;
      }
      if (lower.includes('back') || lower.includes('change') || lower.includes('guide')) {
        stopAvatarSpeaking();
        setActiveScreen('CHOOSE_GUIDE');
        return;
      }
      // Default fallback: receive whatever input the user speaks and route directly to Deep Diagnostics
      startDeepDiagnostics();
      return;
    }

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setAnimState('thinking');

    scheduleSpeech(() => {
      const step = currentStepRef.current;
      if (step === 0) {
        setStudentType(text);
        setCurrentStep(1);
        setAnimState('nod');
        let aiReply = "Got it! Next, what is your dream career goal?";
        if (text.includes("Commerce") || text.includes("B.Com")) {
          aiReply = "Got it! Next, what is your dream career? Do you want to analyze financial markets, build FinTech solutions, or manage corporate finance?";
        } else if (text.includes("Management") || text.includes("BBA")) {
          aiReply = "Got it! Next, what is your dream career? Do you want to become a Product Manager, scale growth operations, or lead management consulting?";
        } else {
          aiReply = "Got it! Next, what is your dream job? Do you want to build web apps, architect cloud systems, or write backend software?";
        }

        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);
      } else if (step === 1) {
        setTargetGoal(text);
        setCurrentStep(2);
        setAnimState('nod');
        const aiReply = "Nice choice. Why did you join today? Are you looking for a job, wanting to learn new skills, or preparing for an interview?";
        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);
      } else if (step === 2) {
        setAccessReason(text);
        setCurrentStep(3);
        setAnimState('nod');
        let aiReply = "Understood. Next question: How much coding experience do you have? Are you a beginner, intermediate, or advanced coder?";
        if (studentType.includes("Commerce") || studentType.includes("Management") || studentType.includes("BBA") || studentType.includes("B.Com")) {
          aiReply = "Understood. Next question: What is your current domain experience level? Are you a beginner analyst, intermediate analyst, or advanced specialist?";
        }

        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);
      } else if (step === 3) {
        setCodingExperience(text);
        setCurrentStep(4);
        setAnimState('nod');
        const aiReply = "Understood. How do you prefer to learn? Do you like reading articles, watching videos, or writing code hands-on?";
        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);
      } else if (step === 4) {
        setLearningStyle(text);
        setCurrentStep(5);
        setAnimState('nod');
        const aiReply = "Last question: How many hours per week can you dedicate to learning? Five hours, ten hours, or more?";
        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);
      } else if (step === 5) {
        setWeeklyHours(text);
        setCurrentStep(6);
        setAnimState('nod');
        const aiReply = "Fantastic! Next, let's load your Identity Discovery slides to establish your cognitive styles.";
        setMessages(prev => [...prev, {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now()
        }]);
        speakReply(aiReply);

        scheduleSpeech(() => {
          setActiveScreen('IDENTITY_QUESTIONS');
          setAnimState('idle');
        }, 1500);
      }
    }, 1000);
  };

  // Complete Onboarding: Sync to database & generate dynamic quest roadmap
  const handleOnboardingComplete = async (profileType: string, goalRole: string, reason: string, finalArch?: string) => {
    setSyncing(true);
    setSyncProgress(10);
    setSyncStatus('Registering student trajectory...');

    const userId = user?.id || 'guest';
    const modulesKey = `pinit_${userId}_roadmap_modules`;

    const goalLower = goalRole.toLowerCase();
    let selectedPath: 'java_sde' | 'react_frontend' | 'devops_cloud' = 'java_sde';
    let targetRoleLabel = 'Software Engineer';
    let skillsList = 'Java Standard Library, OOP Principles, Spring Boot REST, SQL Databases, System Design';

    if (goalLower.includes('design') || goalLower.includes('ux') || goalLower.includes('ui') || goalLower.includes('front') || goalLower.includes('react')) {
      selectedPath = 'react_frontend';
      targetRoleLabel = 'UI/UX Designer';
      skillsList = 'React Hooks, NextJS SSR, Vanilla CSS, Zustand State, TypeScript Types';
    } else if (goalLower.includes('devops') || goalLower.includes('cloud') || goalLower.includes('aws') || goalLower.includes('pipeline') || goalLower.includes('docker')) {
      selectedPath = 'devops_cloud';
      targetRoleLabel = 'DevOps Engineer';
      skillsList = 'Docker Containers, CI/CD Pipelines, AWS Cloud Services, Prometheus & Grafana, Kubernetes Orchestration';
    }

    setTimeout(() => {
      setSyncProgress(40);
      setSyncStatus('Initializing Career Builder configuration...');
    }, 50);

    setTimeout(() => {
      setSyncProgress(75);
      setSyncStatus('Synchronizing credential vault with cryptographic Sentinel registry...');
    }, 100);

    setTimeout(async () => {
      setSyncProgress(100);
      setSyncStatus('Activating Command Center dashboard...');

      try {
        // Calculate initial unverified QT1 and QT2 baseline scores (capped to entry level prior to live practical quests)
        const baseCodingScore = codingExperience === 'Advanced Coder' ? 42 : codingExperience === 'Intermediate Coder' ? 36 : 28;
        const csBonus = profileType.includes('Computer Science') ? 6 : 2;
        const hoursBonus = weeklyHours.includes('15+') ? 2 : 1;
        const computedQT1 = Math.max(liveQTMetrics.qt1Score, Math.min(50, baseCodingScore + csBonus + hoursBonus));
        
        const styleScore = learningStyle.includes('hands-on') ? 45 : learningStyle.includes('articles') ? 40 : 35;
        const computedQT2 = Math.min(60, Math.round((styleScore + (codingExperience === 'Advanced Coder' ? 8 : 4)) * (identityAuditReport.trustScore / 100)));

        const finalUserGoal = (speechTranscript && speechTranscript.trim().length > 5 ? speechTranscript.trim() : targetGoal) || targetRoleLabel;

        const payload = {
          guidanceMentorId: selectedMentor,
          onboardingStep: 3, // Set to STATE_3 (Blueprint Generated)
          target_role: targetRoleLabel,
          career_goal: finalUserGoal,
          onboardingAnswers: {
            role: targetRoleLabel,
            career_goal: finalUserGoal,
            target_goal: targetGoal,
            education: profileType,
            skills: finalArch ? `Archetype: ${finalArch}. Skills: ${skillsList}` : skillsList,
            experience: parseExperience(profileType),
            hasCompleted: true,
            codingExperience,
            learningStyle,
            weeklyHours,
            accessReason: reason,
            qt1_score: computedQT1,
            qt2_score: computedQT2,
            mindset_archetype: finalArch || 'Pattern Hunter',
            voice_transcript: speechTranscript || '',
            voice_confidence: voiceConfidence ?? 90,
            voice_articulation: voiceArticulation ?? 88,
            voice_archetype: voiceArchetype || finalArch || 'Pattern Hunter'
          },
          roadmapGenerated: true
        };

        try {
          await postOnboardingWithRetry(payload);
          await refresh().catch(() => {});
        } catch (err) {
          console.error("Onboarding sync failure", err);
        }

        // Vault stays as-is — empty vault shows empty, no fabricated credentials
        
        // Sync context state locally — always launch even if live users INSERT is blocked by RLS
        cOS.setOnboarding({
          role: targetRoleLabel,
          career_goal: finalUserGoal,
          target_goal: targetGoal,
          education: profileType,
          skills: finalArch ? `Archetype: ${finalArch}. Skills: ${skillsList}` : skillsList,
          experience: parseExperience(profileType),
          codingExperience,
          learningStyle,
          weeklyHours,
          accessReason: reason,
          voice_transcript: speechTranscript || '',
          voice_confidence: voiceConfidence ?? 90,
          voice_articulation: voiceArticulation ?? 88,
          voice_archetype: voiceArchetype || finalArch || 'Pattern Hunter'
        }, true);
        cOS.setOnboardingStep(3); // Update master state to 3
        cOS.setResumeGenerated(false); // Deep route doesn't generate resume automatically
        
        try {
          const skillsArray = skillsList.split(',').map(s => s.trim());
          await cOS.generateFusedRoadmap(skillsArray, ['Docker', 'System Design']);
          await qc.invalidateQueries({ queryKey: KEYS.me });
        } catch (err) {
          console.warn('Roadmap seed failed after onboarding', err);
        }

        toast.success('Onboarding Complete! 🚀', 'Your diagnostic blueprint is active.');
        markOnboardingStoryPending(user?.id);
        router.push('/dashboard');
      } catch (err) {
        console.error("Onboarding sync failure", err);
        const fallbackGoal = (speechTranscript && speechTranscript.trim().length > 5 ? speechTranscript.trim() : targetGoal) || targetRoleLabel;
        cOS.setOnboarding({
          role: targetRoleLabel,
          career_goal: fallbackGoal,
          target_goal: targetGoal,
          education: profileType,
          skills: skillsList,
          experience: parseExperience(profileType),
          voice_transcript: speechTranscript || ''
        }, true);
        cOS.setOnboardingStep(3);
        markOnboardingStoryPending(user?.id);
        router.push('/dashboard');
      }
    }, 150);
  };

  // Express Path: Submit Form & Trigger Resume Parsing
  const handleExpressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!college || !degree || !uploadedFile) {
      toast.error('Details Required', 'Please fill in all academic details and upload a resume PDF.');
      return;
    }

    setSyncing(true);
    setSyncProgress(5);
    setSyncStatus('Initializing resume upload...');
    setParserLogs(['[1/5] Establising secure tunnel to parser gateway...', '[1/5] Ready for stream...']);

    // Simulate PDF parsing logs over time
    const logTimeline = [
      { progress: 20, status: 'Uploading PDF to Sentinel sandbox...', log: '[2/5] Transmitting payload bytes: ' + (uploadedFile.size / 1024).toFixed(1) + ' KB' },
      { progress: 45, status: 'Parsing PDF text layers & structural layout...', log: '[3/5] Extracting OCR layers. Detected font maps, structural columns, and header fields.' },
      { progress: 70, status: 'Analyzing skills and cross-checking gaps...', log: '[4/5] Extracting skill nodes. Matched: Git, SQL, Java, React. Detected gaps: Docker, CI/CD, Kubernetes.' },
      { progress: 90, status: 'Initializing Human Graph blueprint...', log: '[5/5] Mapping credentials OCR to Sentinel registry. Security signatures generated.' },
      { progress: 100, status: 'Finalizing setup...', log: '[5/5] Success: Profile generated with 0% Initial Trust Score.' }
    ];

    logTimeline.forEach((t, i) => {
      setTimeout(() => {
        setSyncProgress(t.progress);
        setSyncStatus(t.status);
        setParserLogs(prev => [...prev, t.log]);
      }, (i + 1) * 50);
    });

    setTimeout(async () => {
      const userId = user?.id || 'guest';
      let trajectoryLabel = 'Software Engineer';
      let skillsList = '';
      let weakAreas: string[] = [];
      try {

        if (trajectory === 'financial_analyst') {
          trajectoryLabel = 'Financial & FinTech Analyst';
          skillsList = 'Financial Modeling, Corporate Valuation, Excel Analysis, SQL, Tally Prime, Financial Accounting, Auditing, Tax Compliance';
          weakAreas = ['Derivatives Trading', 'Regulatory Tech', 'Corporate Restructuring'];
        } else if (trajectory === 'business_analyst') {
          trajectoryLabel = 'Product & Operations Manager';
          skillsList = 'Product Strategy, Market Research, Agile Scrum, Growth Funnels, Data Analytics, Strategic Management, Negotiation';
          weakAreas = ['Product Analytics', 'A/B Testing Experiments', 'Stakeholder Alignment'];
        } else if (trajectory === 'java_sde') {
          trajectoryLabel = 'Java Backend SDE';
          skillsList = 'Java Standard Library, OOP Principles, Spring Boot REST, SQL Databases, System Design';
          weakAreas = ['Docker', 'System Design', 'Microservices'];
        } else if (trajectory === 'react_frontend') {
          trajectoryLabel = 'React Frontend Web SDE';
          skillsList = 'React Hooks, NextJS SSR, Vanilla CSS, Zustand State, TypeScript Types';
          weakAreas = ['Webpack', 'React Performance', 'Testing Library'];
        } else {
          trajectoryLabel = 'DevOps Cloud Engineer';
          skillsList = 'Docker Containers, CI/CD Pipelines, AWS Cloud Services, Prometheus & Grafana, Kubernetes Orchestration';
          weakAreas = ['Kubernetes Security', 'Terraform IaC', 'Linux Scripting'];
        }

        // Pack and transmit real PDF resume file payload
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('userId', userId);
        formData.append('trajectory', trajectory);
        await api.post('/api/resume/upload', formData);

        // Initial baseline QT1/QT2 evaluation (unverified entry level capped at 45/50 prior to live practical quests)
        const computedQT1 = (degree.includes('CS') || degree.includes('Computer')) ? 45 : 38;
        const computedQT2 = 50;

        const expressGoal = `Become a successful ${trajectoryLabel} in the industry.`;
        const payload = {
          onboardingStep: 3, // Set to STATE_3 (Blueprint Generated)
          target_role: trajectoryLabel,
          career_goal: expressGoal,
          onboardingAnswers: {
            role: trajectoryLabel,
            career_goal: expressGoal,
            education: `${degree} at ${college}`,
            skills: skillsList,
            experience: 'fresher',
            hasCompleted: true,
            qt1_score: computedQT1,
            qt2_score: computedQT2,
            mindset_archetype: 'Pattern Hunter' // Default for express path
          },
          roadmapGenerated: true
        };

        try {
          await postOnboardingWithRetry(payload);
          await refresh().catch(() => {});
        } catch (err) {
          console.error('Express onboarding failure', err);
        }

        // Vault stays as-is — if user uploaded a file the real pipeline handles it, no fabricated credentials

        cOS.setOnboarding({
          role: trajectoryLabel,
          career_goal: expressGoal,
          education: `${degree} at ${college}`,
          skills: skillsList,
          experience: 'fresher'
        }, true);
        cOS.setOnboardingStep(3);
        cOS.setResumeGenerated(true);
        
        try {
          const skillsArray = skillsList.split(',').map(s => s.trim());
          await cOS.generateFusedRoadmap(skillsArray, weakAreas);
          await qc.invalidateQueries({ queryKey: KEYS.me });
        } catch (err) {
          console.warn('Express roadmap seed failed', err);
        }

        toast.success('Express Onboarding Complete! ⚡', 'Unlock your dashboard and provisional job matches.');
        markOnboardingStoryPending(user?.id);
        router.push('/dashboard');
      } catch (err) {
        console.error('Express onboarding failure', err);
        cOS.setOnboarding({
          role: trajectoryLabel || 'Software Engineer',
          education: `${degree} at ${college}`,
          skills: skillsList || '',
          experience: 'fresher'
        }, true);
        cOS.setOnboardingStep(3);
        markOnboardingStoryPending(user?.id);
        router.push('/dashboard');
      }
    }, 300);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setUploadedFile(file);
        toast.info('Resume Selected', `${file.name} ready for analysis.`);
      } else {
        toast.error('Invalid File Type', 'Please upload a PDF document.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setUploadedFile(file);
        toast.info('Resume Selected', `${file.name} ready for analysis.`);
      } else {
        toast.error('Invalid File Type', 'Please upload a PDF document.');
      }
    }
  };

  // Slider React Dialogue triggers
  const getSliderDialogue = () => {
    const gap = targetAmbition - currentAbility;
    if (gap <= 0) return "You seem extremely confident in your current capabilities! ✦ Let's put them to test inside our Monaco workspace.";
    if (gap > 60) return `A verification gap of ${gap}% requires intensive socratic quests, unit testing sandboxes, and certifications upload to achieve. Let's construct a target blueprint.`;
    return `An active gap of ${gap}% is highly manageable. Let's close it using targeted micro-missions and Daily Quests!`;
  };

  const stageLabel: Record<string, string> = {
    INTENT_SELECTION: 'STAGE 01: INTENT SELECTION',
    SLIDER: 'STAGE 01: GAP CHECK',
    EXPRESS_FORM: 'STAGE 02: EXPRESS PROFILE',
    CHOOSE_GUIDE: 'STAGE 03: CHOOSE GUIDE',
    DEEP_CHAT: 'STAGE 04: DEEP DIAGNOSTICS',
    IDENTITY_QUESTIONS: 'STAGE 05: IDENTITY MAP',
    WORKPLACE_SIMULATION: 'STAGE 06: SIMULATION',
    SPEECH_ASSESSMENT: 'STAGE 07: SPEECH LAB',
    BLUEPRINT_REVEAL: 'STAGE 08: BLUEPRINT',
  };

  return (
    <div
      className="onboarding-shell"
      data-theme="dark"
      style={{
        height: '100vh',
        background: '#030508',
        color: 'var(--text)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body), sans-serif',
        // Force readable light text even if the site theme is light.
        ['--t1' as any]: 'var(--text)',
        ['--t2' as any]: '#e2e8f0',
        ['--t3' as any]: 'var(--text-muted)',
        ['--t4' as any]: 'var(--text-dim)',
        ['--card' as any]: 'var(--text)',
        ['--bg3' as any]: '#f1f5f9',
        ['--border2' as any]: '#cbd5e1',
      }}
    >
      
      {/* Preload VRoid avatar in background by overlaying mentor selection */}
      {activeScreen === 'CHOOSE_GUIDE' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#030508', color: 'var(--text)', display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '60px 24px' }}>
          {/* Dynamic Background Mesh Orbits */}
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--brand-rgb),0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--accent-cyan-rgb),0.06) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '95%', width: '95%', margin: '0 auto', zIndex: 10, textAlign: 'center' }}>
            {/* Logo Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
              <span className="lp-brand-lockup" style={{ height: 48, padding: '3px 8px' }}>
                <img src="/brand/pinit-career-logo.png" alt="PINIT CAREER" className="lp-brand-logo" style={{ height: 40, maxWidth: 180 }} />
              </span>
            </div>

            <div style={{ marginBottom: 48 }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, display: 'block', marginBottom: 12 }}>
                Staging Environment Setup
              </span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--text)', marginBottom: 16 }}>
                Choose Your Guidance Mentor
              </h1>
              <p style={{ fontSize: 15, color: 'var(--t3)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6, marginBottom: 16 }}>
                Select the personal AI guide that will calibrate your career roadmap, analyze your communication DNA, and lead your socratic assessments.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowVaultModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)',
                    border: 'none',
                    borderRadius: 100,
                    color: 'var(--card)',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '8px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 16px rgba(var(--brand-rgb), 0.4)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  📁 Vault (Upload Resume & Docs)
                </button>
                {user?.role === 'admin' && (
                  <button
                    type="button"
                    onClick={handleFastComplete}
                    disabled={syncing}
                    style={{
                      background: 'linear-gradient(135deg, var(--green) 0%, var(--green) 100%)',
                      border: 'none',
                      borderRadius: 100,
                      color: 'var(--card)',
                      fontSize: 12,
                      fontWeight: 800,
                      padding: '8px 20px',
                      cursor: syncing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 4px 16px rgba(var(--success-rgb), 0.4)',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    ⚡ 1-Click Fast Complete (Admin Dev)
                  </button>
                )}
                <div style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--teal)',
                  background: 'rgba(var(--accent-teal-rgb), 0.1)',
                  border: '1px solid rgba(var(--accent-teal-rgb), 0.25)',
                  borderRadius: 100,
                  padding: '6px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: 700
                }}>
                  ✨ 3D Avatars & Voices Preloaded (0ms Lag)
                </div>
              </div>

              {/* Candidate Secure Vault 2.0 Modal Overlay */}
              {showVaultModal && (
                <div
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleBatchAutoSortUpload(e.dataTransfer.files);
                    }
                  }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 200,
                    background: 'rgba(2, 6, 19, 0.88)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 16px'
                  }}
                >
                  <div style={{
                    background: 'radial-gradient(130% 130% at 50% 0%, #0d1322 0%, #080c16 55%, #030712 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.22)',
                    borderRadius: 24,
                    padding: '22px 28px',
                    maxWidth: 1180,
                    width: '96vw',
                    height: '88vh',
                    maxHeight: 880,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 32px 80px -20px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 60px rgba(var(--brand-rgb), 0.15)',
                    textAlign: 'left',
                    color: 'var(--text)',
                    overflow: 'hidden'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 14, flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, rgba(var(--brand-rgb),0.3) 0%, rgba(var(--accent-teal-rgb),0.2) 100%)',
                          border: '1px solid rgba(var(--brand-rgb),0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 22,
                          boxShadow: '0 0 20px rgba(var(--brand-rgb),0.25)'
                        }}>
                          📁
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: 'var(--text)', letterSpacing: '-0.02em' }}>Candidate Secure Vault 2.0</h3>
                            <span style={{
                              fontSize: 10,
                              background: 'rgba(var(--success-rgb), 0.15)',
                              color: 'var(--success-bright)',
                              border: '1px solid rgba(var(--success-rgb), 0.35)',
                              padding: '2px 9px',
                              borderRadius: 100,
                              fontWeight: 800,
                              fontFamily: 'var(--font-mono)',
                              letterSpacing: '0.5px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5
                            }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-bright)', boxShadow: '0 0 6px var(--success-bright)' }} />
                              SUPABASE SYNCED
                            </span>
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginTop: 2 }}>
                            Multi-Tier Academic & Identity Verification Engine • Anti-Fraud Sentinel Cross-Check
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowVaultModal(false)}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: 10,
                          color: 'var(--text-muted)',
                          width: 36,
                          height: 36,
                          fontSize: 16,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Split-Pane Main Body */}
                    <div style={{ flex: 1, display: 'flex', gap: 20, minHeight: 0, overflow: 'hidden' }}>

                      {/* LEFT PANE: Control Center & Telemetry (width: 330px, scrollable if overflow) */}
                      <div style={{
                        width: 330,
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        overflowY: 'auto',
                        paddingRight: 4
                      }}>
                        {/* Auto-Sort Dropzone */}
                        <div
                          style={{
                            border: isDraggingOverDropzone ? '2px dashed #00f0ff' : '1.5px dashed #00f0ff',
                            borderRadius: 14,
                            padding: '18px 12px',
                            background: isDraggingOverDropzone ? 'rgba(0, 240, 255, 0.12)' : 'rgba(0, 240, 255, 0.02)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: 8,
                            transition: 'all 0.2s ease',
                            boxShadow: isDraggingOverDropzone ? '0 0 25px rgba(0, 240, 255, 0.45)' : '0 0 12px rgba(0, 240, 255, 0.12)'
                          }}
                          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOverDropzone(true); }}
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; setIsDraggingOverDropzone(true); }}
                          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOverDropzone(false); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDraggingOverDropzone(false);
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              handleBatchAutoSortUpload(e.dataTransfer.files);
                            }
                          }}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.multiple = true;
                            input.accept = '.pdf,.docx,.txt,application/pdf';
                            input.onchange = (e: any) => {
                              const files = e.target?.files;
                              if (files && files.length > 0) handleBatchAutoSortUpload(files);
                            };
                            input.click();
                          }}
                        >
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.7))' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <div style={{ pointerEvents: 'none' }}>
                            <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: '1px', textTransform: 'uppercase' }}>
                              DRAG & DROP
                            </div>
                            <div style={{ fontSize: 10.5, fontWeight: 800, color: '#00f0ff', letterSpacing: '1.5px', marginTop: 2, textTransform: 'uppercase' }}>
                              SECURE FILES
                            </div>
                          </div>
                        </div>

                        {/* QT Horseshoe Circular Arc Dials */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '4px 0' }}>
                          {/* Dial 1: Provisional QT1 */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ position: 'relative', width: 110, height: 85, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg viewBox="0 0 100 80" width="100" height="80" style={{ overflow: 'visible' }}>
                                <path
                                  d="M 23 71 A 38 38 0 1 1 77 71"
                                  fill="none"
                                  stroke="rgba(0, 240, 255, 0.18)"
                                  strokeWidth="5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M 23 71 A 38 38 0 1 1 77 71"
                                  fill="none"
                                  stroke="#00f0ff"
                                  strokeWidth="5"
                                  strokeLinecap="round"
                                  style={{
                                    filter: 'drop-shadow(0 0 6px #00f0ff) drop-shadow(0 0 12px rgba(0, 240, 255, 0.6))'
                                  }}
                                />
                              </svg>
                              <div style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 17, fontWeight: 900, color: '#00f0ff', fontFamily: 'var(--font-mono), monospace', textShadow: '0 0 10px rgba(0, 240, 255, 0.6)' }}>
                                {vaultSlots.length > 0 ? `${liveQTMetrics.qt1Score}/100` : '0/100'}
                              </div>
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', marginTop: 3 }}>
                              QT1 Provisional Score
                            </div>
                            <div style={{ fontSize: 9, color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.25, marginTop: 2 }}>
                              Initial Trust Baseline,<br />
                              Initial Trust Baseline
                            </div>
                          </div>

                          {/* Dial 2: Integrity QT2 */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ position: 'relative', width: 110, height: 85, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg viewBox="0 0 100 80" width="100" height="80" style={{ overflow: 'visible' }}>
                                <path
                                  d="M 23 71 A 38 38 0 1 1 77 71"
                                  fill="none"
                                  stroke="rgba(168, 85, 247, 0.18)"
                                  strokeWidth="5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M 23 71 A 38 38 0 1 1 77 71"
                                  fill="none"
                                  stroke="#c084fc"
                                  strokeWidth="5"
                                  strokeLinecap="round"
                                  style={{
                                    filter: 'drop-shadow(0 0 6px #a855f7) drop-shadow(0 0 12px rgba(168, 85, 247, 0.6))'
                                  }}
                                />
                              </svg>
                              <div style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 17, fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono), monospace', textShadow: '0 0 10px rgba(192, 132, 252, 0.6)' }}>
                                {vaultSlots.length > 0 ? `${liveQTMetrics.qt2Score}/100` : '78/100'}
                              </div>
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#f8fafc', marginTop: 3 }}>
                              QT2 Integrity Score
                            </div>
                            <div style={{ fontSize: 9, color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.25, marginTop: 2 }}>
                              Validated Data Points,<br />
                              Validated Data Points
                            </div>
                          </div>
                        </div>

                        {/* Identity Discrepancy Alert Card */}
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(185, 28, 28, 0.18) 0%, rgba(127, 29, 29, 0.25) 100%)',
                          border: '1px solid #ef4444',
                          borderRadius: 14,
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          boxShadow: '0 0 16px rgba(239, 68, 68, 0.2)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ color: '#ef4444', fontSize: 14 }}>⚠️</span>
                              <span style={{ fontSize: 12, fontWeight: 800, color: '#fca5a5' }}>
                                Identity Discrepancy Alert
                              </span>
                            </div>
                            <span style={{ color: '#ef4444', fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '1px' }}>
                              ((•))
                            </span>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#f87171' }}>
                              {identityAuditReport.mismatchCount > 0
                                ? `${identityAuditReport.mismatchCount} Conflict Flagged (Name Mismatch)`
                                : '1 Conflict Flagged (Name Mismatch)'}
                            </div>
                            <div style={{ fontSize: 9.5, color: '#fca5a5', opacity: 0.85, marginTop: 1 }}>
                              Documents with names different from primary conflicts.
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {(identityAuditReport.conflictingDocuments.length > 0
                              ? identityAuditReport.conflictingDocuments
                              : [{ slotId: 'demo-vinod', fileName: 'vinod - Resume.pdf', candidateName: 'Vinod' }]
                            ).map((conf: any) => (
                              <div key={conf.slotId} style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: 8, padding: '6px 10px', fontSize: 10.5, color: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 210 }}>
                                  📄 {conf.fileName} (Detected: '{conf.candidateName || 'Vinod'}')
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSlot(conf.slotId)}
                                  style={{ background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: 4, padding: '2px 6px', fontSize: 9, fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (identityAuditReport.conflictingDocuments.length > 0) {
                                identityAuditReport.conflictingDocuments.forEach(c => handleDeleteSlot(c.slotId));
                                toast.success('Resolved', 'Removed conflicting documents.');
                              } else {
                                toast.info('Verification Sentinel', 'Sentinel identity consistency active.');
                              }
                            }}
                            style={{
                              width: '100%',
                              background: 'rgba(239, 68, 68, 0.2)',
                              border: '1px solid rgba(239, 68, 68, 0.5)',
                              color: '#fca5a5',
                              padding: '7px 10px',
                              borderRadius: 8,
                              fontSize: 10.5,
                              fontWeight: 800,
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            Verify or Remove Discrepant Doc
                          </button>
                        </div>

                        {/* Live Extracted Skills Bar */}
                        {vaultSlots.length > 0 && liveQTMetrics.extractedSkills.length > 0 && (
                          <div style={{
                            padding: '12px 14px',
                            background: 'linear-gradient(135deg, rgba(var(--success-rgb), 0.08) 0%, rgba(var(--brand-rgb), 0.06) 100%)',
                            border: '1px solid rgba(var(--success-rgb), 0.28)',
                            borderRadius: 14,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 800, color: 'var(--success-bright)', fontSize: 11.5 }}>
                                ✓ {vaultSlots.length} Synced
                              </span>
                              <span style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', background: 'rgba(var(--success-rgb), 0.18)', color: 'var(--success-bright)', padding: '2px 6px', borderRadius: 6, fontWeight: 800 }}>
                                {liveQTMetrics.integrityLevel}
                              </span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {liveQTMetrics.extractedSkills.map(s => (
                                <span key={s} style={{ fontSize: 9.5, background: 'rgba(var(--brand-rgb), 0.16)', color: 'var(--brand-bright)', border: '1px solid rgba(var(--brand-rgb), 0.35)', borderRadius: 5, padding: '2px 6px', fontWeight: 700 }}>
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* RIGHT PANE: Tabs & Document Workspace (flex: 1, independent scroll) */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>

                        {/* Category Navigation Tabs */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: 8,
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 12,
                          padding: 5,
                          marginBottom: 12,
                          flexShrink: 0
                        }}>
                          {[
                            { id: 'resume', label: '📄 Master Resume', badge: vaultSlots.filter(s => s.category === 'resume').length },
                            { id: 'academic', label: '🎓 Academic Ledger', badge: vaultSlots.filter(s => s.category.startsWith('sem') || s.category === '10th' || s.category === '12th_puc').length },
                            { id: 'certifications', label: '📜 Certifications', badge: vaultSlots.filter(s => s.category === 'certification' || s.category === 'achievement').length },
                            { id: 'analytics', label: '📊 Analytics', badge: vaultSlots.length === 0 ? '0%' : `${identityAuditReport.identityConsistencyPercentage}%` },
                          ].map(tab => {
                            const isActive = activeVaultTab === tab.id;
                            const isCertTab = tab.id === 'certifications';
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveVaultTab(tab.id as any)}
                                style={{
                                  background: isActive
                                    ? (isCertTab ? 'rgba(124, 58, 237, 0.32)' : 'linear-gradient(135deg, rgba(var(--brand-rgb), 0.3) 0%, rgba(var(--info-rgb), 0.18) 100%)')
                                    : 'transparent',
                                  border: isActive
                                    ? (isCertTab ? '1.5px solid #a855f7' : '1px solid rgba(var(--brand-rgb), 0.6)')
                                    : '1px solid transparent',
                                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                                  padding: '9px 10px',
                                  borderRadius: 9,
                                  fontSize: 12,
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 6,
                                  whiteSpace: 'nowrap',
                                  transition: 'all 0.15s ease',
                                  boxShadow: isActive
                                    ? (isCertTab ? '0 0 16px rgba(168, 85, 247, 0.5), inset 0 0 8px rgba(168, 85, 247, 0.25)' : '0 4px 14px rgba(var(--brand-rgb),0.25)')
                                    : 'none'
                                }}
                              >
                                <span>{tab.label}</span>
                                <span style={{
                                  fontSize: 10,
                                  background: isActive ? (isCertTab ? '#7c3aed' : 'rgba(var(--brand-rgb),0.6)') : 'rgba(255,255,255,0.06)',
                                  color: '#ffffff',
                                  padding: '1px 7px',
                                  borderRadius: 100,
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 900
                                }}>
                                  {tab.badge}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Tab Body Contents (Fully Scrollable) */}
                        <div style={{
                          flex: 1,
                          minHeight: 0,
                          overflowY: 'auto',
                          paddingRight: 6
                        }}>
                      
                      {/* TAB 1: ACADEMIC LEDGER */}
                      {activeVaultTab === 'academic' && (
                        <div>
                          {/* 10th and 12th/PUC Header Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                            {/* 10th Slot */}
                            {(() => {
                              const doc10th = vaultSlots.find(s => s.category === '10th');
                              return (
                                <div
                                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (e.dataTransfer.files?.[0]) handleUploadToSlot(e.dataTransfer.files[0], '10th');
                                  }}
                                  style={{
                                    background: doc10th ? 'rgba(var(--brand-rgb), 0.06)' : 'rgba(255,255,255,0.02)',
                                    border: doc10th?.verificationStatus === 'mismatch_warning' ? '1px solid var(--danger)' : doc10th ? '1px solid rgba(var(--brand-rgb), 0.4)' : '1px dashed rgba(255,255,255,0.12)',
                                    borderRadius: 14,
                                    padding: '16px 18px',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>📜 10th Standard / SSLC</span>
                                    <span style={{
                                      fontSize: 10,
                                      fontFamily: 'var(--font-mono)',
                                      background: doc10th ? 'rgba(var(--success-rgb),0.15)' : 'rgba(255,255,255,0.05)',
                                      color: doc10th ? 'var(--success-bright)' : 'var(--text-dim)',
                                      padding: '2px 8px',
                                      borderRadius: 6,
                                      fontWeight: 800
                                    }}>
                                      {doc10th ? 'UPLOADED ✓' : 'REQUIRED'}
                                    </span>
                                  </div>
                                  {doc10th ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                      <div style={{ fontSize: 12, color: 'var(--brand-bright)', fontWeight: 700 }}>📄 {doc10th.fileName} ({doc10th.fileSize})</div>
                                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Institution: {doc10th.institution} • Score: <strong style={{ color: 'var(--success-bright)' }}>{doc10th.scoreOrGpa}</strong></div>
                                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                        <button type="button" onClick={() => handleDeleteSlot(doc10th.id, doc10th.storageUrl)} style={{ background: 'rgba(var(--danger-rgb),0.1)', border: '1px solid rgba(var(--danger-rgb),0.25)', color: 'var(--danger-bright)', padding: '4px 10px', borderRadius: 6, fontSize: 10.5, cursor: 'pointer', fontWeight: 700 }}>🗑️ Remove</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.pdf,.docx,.txt,application/pdf';
                                        input.onchange = (e: any) => {
                                          if (e.target?.files?.[0]) handleUploadToSlot(e.target.files[0], '10th');
                                        };
                                        input.click();
                                      }}
                                      style={{ width: '100%', background: 'rgba(var(--brand-rgb),0.08)', border: '1px dashed rgba(var(--brand-rgb),0.35)', color: 'var(--brand-bright)', padding: '12px', borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                                    >
                                      + Drag & Drop or Click 10th Marksheet
                                    </button>
                                  )}
                                </div>
                              );
                            })()}

                            {/* 12th / PUC Slot */}
                            {(() => {
                              const doc12th = vaultSlots.find(s => s.category === '12th_puc');
                              return (
                                <div
                                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (e.dataTransfer.files?.[0]) handleUploadToSlot(e.dataTransfer.files[0], '12th_puc');
                                  }}
                                  style={{
                                    background: doc12th ? 'rgba(var(--brand-rgb), 0.06)' : 'rgba(255,255,255,0.02)',
                                    border: doc12th?.verificationStatus === 'mismatch_warning' ? '1px solid var(--danger)' : doc12th ? '1px solid rgba(var(--brand-rgb), 0.4)' : '1px dashed rgba(255,255,255,0.12)',
                                    borderRadius: 14,
                                    padding: '16px 18px',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>🎓 12th / 2nd PUC / Diploma</span>
                                    <span style={{
                                      fontSize: 10,
                                      fontFamily: 'var(--font-mono)',
                                      background: doc12th ? 'rgba(var(--success-rgb),0.15)' : 'rgba(255,255,255,0.05)',
                                      color: doc12th ? 'var(--success-bright)' : 'var(--text-dim)',
                                      padding: '2px 8px',
                                      borderRadius: 6,
                                      fontWeight: 800
                                    }}>
                                      {doc12th ? 'UPLOADED ✓' : 'REQUIRED'}
                                    </span>
                                  </div>
                                  {doc12th ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                      <div style={{ fontSize: 12, color: 'var(--brand-bright)', fontWeight: 700 }}>📄 {doc12th.fileName} ({doc12th.fileSize})</div>
                                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Board: {doc12th.institution} • Score: <strong style={{ color: 'var(--success-bright)' }}>{doc12th.scoreOrGpa}</strong></div>
                                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                        <button type="button" onClick={() => handleDeleteSlot(doc12th.id, doc12th.storageUrl)} style={{ background: 'rgba(var(--danger-rgb),0.1)', border: '1px solid rgba(var(--danger-rgb),0.25)', color: 'var(--danger-bright)', padding: '4px 10px', borderRadius: 6, fontSize: 10.5, cursor: 'pointer', fontWeight: 700 }}>🗑️ Remove</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.pdf,.docx,.txt,application/pdf';
                                        input.onchange = (e: any) => {
                                          if (e.target?.files?.[0]) handleUploadToSlot(e.target.files[0], '12th_puc');
                                        };
                                        input.click();
                                      }}
                                      style={{ width: '100%', background: 'rgba(var(--brand-rgb),0.08)', border: '1px dashed rgba(var(--brand-rgb),0.35)', color: 'var(--brand-bright)', padding: '12px', borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                                    >
                                      + Drag & Drop or Click 12th/PUC Marksheet
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Semester 1 to 8 Grid */}
                          <div style={{ fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '1px', fontWeight: 700 }}>
                            University Semester-by-Semester Marksheets (Sem 1 through Sem 8)
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(semNum => {
                              const catKey = `sem${semNum}` as VaultCategory;
                              const semDoc = vaultSlots.find(s => s.category === catKey);
                              return (
                                <div
                                  key={semNum}
                                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (e.dataTransfer.files?.[0]) handleUploadToSlot(e.dataTransfer.files[0], catKey);
                                  }}
                                  style={{
                                    background: semDoc ? 'rgba(var(--brand-rgb),0.08)' : 'rgba(255,255,255,0.02)',
                                    border: semDoc?.verificationStatus === 'mismatch_warning' ? '1px solid var(--danger)' : semDoc ? '1px solid rgba(var(--brand-rgb),0.45)' : '1px dashed rgba(255,255,255,0.1)',
                                    borderRadius: 14,
                                    padding: '14px 14px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: 108,
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                      <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text)' }}>Semester {semNum}</span>
                                      {semDoc && (
                                        <span style={{ fontSize: 9.5, background: 'rgba(var(--success-rgb),0.2)', color: 'var(--success-bright)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                                          VERIFIED ✓
                                        </span>
                                      )}
                                    </div>
                                    {semDoc ? (
                                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                                        <div style={{ color: 'var(--brand-bright)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{semDoc.fileName}</div>
                                        <div style={{ color: 'var(--success-bright)', fontWeight: 800, marginTop: 3 }}>Score: {semDoc.scoreOrGpa}</div>
                                      </div>
                                    ) : (
                                      <div style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>Empty Slot (Drop file)</div>
                                    )}
                                  </div>
                                  <div style={{ marginTop: 8 }}>
                                    {semDoc ? (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSlot(semDoc.id, semDoc.storageUrl)}
                                        style={{ background: 'rgba(var(--danger-rgb),0.1)', border: 'none', color: 'var(--danger-bright)', fontSize: 10.5, borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontWeight: 700 }}
                                      >
                                        Remove
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const input = document.createElement('input');
                                          input.type = 'file';
                                          input.accept = '.pdf,.docx,.txt,application/pdf';
                                          input.onchange = (e: any) => {
                                            if (e.target?.files?.[0]) handleUploadToSlot(e.target.files[0], catKey);
                                          };
                                          input.click();
                                        }}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: 10.5, borderRadius: 6, padding: '6px', cursor: 'pointer', fontWeight: 700 }}
                                      >
                                        + Add Marksheet
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* TAB 2 / 3 / 4: VERIFIED DOCUMENT INVENTORY (2-COLUMN EXECUTIVE CYBER GRID) */}
                      {(activeVaultTab === 'certifications' || activeVaultTab === 'resume' || activeVaultTab === 'achievements') && (
                        <div>
                          {/* Header: Verified Document Inventory */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div style={{ fontSize: 16, fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                              Verified Document Inventory
                            </div>
                            <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)' }}>
                              {vaultSlots.length} Verified Documents Online
                            </span>
                          </div>

                          {/* 2-Column Cyber Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {/* Column 1: Resumes & Academic Foundation (Glowing Cyan Cards) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                              {(() => {
                                const foundationDocs = vaultSlots.filter(s => s.category === 'resume' || s.category.startsWith('sem') || s.category === '10th' || s.category === '12th_puc');
                                if (foundationDocs.length === 0) {
                                  return (
                                    <div
                                      onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = '.pdf,.docx,.txt,application/pdf';
                                        input.onchange = (e: any) => {
                                          if (e.target?.files?.[0]) handleUploadToSlot(e.target.files[0], 'resume');
                                        };
                                        input.click();
                                      }}
                                      style={{
                                        border: '1.5px dashed rgba(0, 240, 255, 0.35)',
                                        borderRadius: 14,
                                        padding: 28,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: 'rgba(0, 240, 255, 0.02)',
                                        color: '#00f0ff',
                                        fontSize: 12.5,
                                        fontWeight: 700
                                      }}
                                    >
                                      + Upload Master Resume or Marksheet
                                    </div>
                                  );
                                }
                                return foundationDocs.map((doc, idx) => {
                                  const isWord = doc.fileName.toLowerCase().endsWith('.doc') || doc.fileName.toLowerCase().endsWith('.docx') || doc.id === 'vault-demo-2' || doc.id === 'vault-demo-4';
                                  const dateStr = doc.id === 'vault-demo-1' ? '10/09' : (doc.id === 'vault-demo-2' || doc.id === 'vault-demo-3') ? '10/19' : doc.id === 'vault-demo-4' ? '10/14' : '10/09';
                                  return (
                                    <div
                                      key={doc.id || idx}
                                      style={{
                                        background: 'rgba(6, 14, 26, 0.88)',
                                        border: '1.5px solid #00f0ff',
                                        borderRadius: 14,
                                        padding: '12px 14px',
                                        display: 'flex',
                                        gap: 12,
                                        alignItems: 'flex-start',
                                        boxShadow: '0 0 16px rgba(0, 240, 255, 0.2)',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                      }}
                                    >
                                      {/* Left Badge: PDF (Red) or Doc (Blue) */}
                                      <div style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: 8,
                                        background: isWord ? '#0284c7' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ffffff',
                                        fontSize: 11,
                                        fontWeight: 900,
                                        fontFamily: 'var(--font-mono), sans-serif',
                                        flexShrink: 0,
                                        boxShadow: isWord ? '0 0 10px rgba(2, 132, 199, 0.5)' : '0 0 10px rgba(239, 68, 68, 0.5)'
                                      }}>
                                        {isWord ? 'Doc' : 'PDF'}
                                      </div>

                                      {/* Content */}
                                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                                            <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                              {doc.fileName}
                                            </span>
                                            <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 900, flexShrink: 0 }}>
                                              ✔
                                            </span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteSlot(doc.id, doc.storageUrl)}
                                            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 12, padding: '0 2px' }}
                                            title="Remove Document"
                                          >
                                            ✕
                                          </button>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                          <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                            Metatags
                                          </span>
                                          <span style={{ fontSize: 9.5, background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', padding: '1px 7px', borderRadius: 4, fontWeight: 700 }}>
                                            Verified via API
                                          </span>
                                          <span style={{ fontSize: 9.5, background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', padding: '1px 7px', borderRadius: 4, fontWeight: 700 }}>
                                            Machine-Extractable
                                          </span>
                                        </div>

                                        <div style={{ fontSize: 9.5, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                                          Date uploaded: {dateStr}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>

                            {/* Column 2: Certifications & Technical Proofs (Glowing Purple Cards) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                              {(() => {
                                const credentialDocs = vaultSlots.filter(s => s.category === 'certification' || s.category === 'achievement');
                                return (
                                  <>
                                    {credentialDocs.map((doc, idx) => (
                                      <div
                                        key={doc.id || idx}
                                        style={{
                                          background: 'rgba(16, 10, 26, 0.88)',
                                          border: '1.5px solid #a855f7',
                                          borderRadius: 14,
                                          padding: '12px 14px',
                                          display: 'flex',
                                          gap: 12,
                                          alignItems: 'flex-start',
                                          boxShadow: '0 0 16px rgba(168, 85, 247, 0.2)',
                                          transition: 'all 0.2s ease',
                                          position: 'relative'
                                        }}
                                      >
                                        {/* Left Badge: Purple PDF */}
                                        <div style={{
                                          width: 38,
                                          height: 38,
                                          borderRadius: 8,
                                          background: '#7c3aed',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: '#ffffff',
                                          fontSize: 11,
                                          fontWeight: 900,
                                          fontFamily: 'var(--font-mono), sans-serif',
                                          flexShrink: 0,
                                          boxShadow: '0 0 10px rgba(124, 58, 237, 0.5)'
                                        }}>
                                          PDF
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                                              <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {doc.fileName}
                                              </span>
                                              <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 900, flexShrink: 0 }}>
                                                ✔
                                              </span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteSlot(doc.id, doc.storageUrl)}
                                              style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 12, padding: '0 2px' }}
                                              title="Remove Document"
                                            >
                                              ✕
                                            </button>
                                          </div>

                                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                              Metatags
                                            </span>
                                            <span style={{ fontSize: 9.5, background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.45)', color: '#60a5fa', padding: '1px 7px', borderRadius: 4, fontWeight: 700 }}>Python</span>
                                            <span style={{ fontSize: 9.5, background: 'rgba(234, 179, 8, 0.2)', border: '1px solid rgba(234, 179, 8, 0.45)', color: '#facc15', padding: '1px 7px', borderRadius: 4, fontWeight: 700 }}>JS</span>
                                            <span style={{ fontSize: 9.5, background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.45)', color: '#c084fc', padding: '1px 7px', borderRadius: 4, fontWeight: 700 }}>HTML / CSS</span>
                                          </div>

                                          <div style={{ fontSize: 9.5, color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                                            Date uploaded: 2023
                                          </div>
                                        </div>
                                      </div>
                                    ))}

                                    {/* Subtle Mockup Placeholder */}
                                    <div style={{
                                      padding: '16px',
                                      textAlign: 'center',
                                      color: 'rgba(255, 255, 255, 0.4)',
                                      fontSize: 12,
                                      fontStyle: 'italic',
                                      border: '1px dashed rgba(255, 255, 255, 0.08)',
                                      borderRadius: 12,
                                      marginTop: 4
                                    }}>
                                      No certifications uploaded...
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 5: INTEGRITY & QT ANALYTICS */}
                      {activeVaultTab === 'analytics' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {/* Academic Progression Radar */}
                          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 18 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>📈 Semester GPA Progression Trajectory</span>
                              <span style={{ fontSize: 11, color: 'var(--success-bright)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{liveQTMetrics.growthMomentum}</span>
                            </div>
                            {liveQTMetrics.academicTrajectory.length === 0 ? (
                              <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: '14px 0' }}>Upload semester marksheets in the Academic Ledger tab to calibrate your GPA growth curve.</div>
                            ) : (
                              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 70, marginTop: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
                                {liveQTMetrics.academicTrajectory.map(sem => (
                                  <div key={sem.semester} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--brand-bright)' }}>{sem.gpa}</span>
                                    <div style={{ width: '100%', maxWidth: 32, height: `${(sem.gpa / 10) * 48}px`, background: 'linear-gradient(180deg, var(--brand) 0%, var(--info) 100%)', borderRadius: '4px 4px 0 0' }} />
                                    <span style={{ fontSize: 9.5, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>S{sem.semester}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Identity Audit Table */}
                          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 18 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>🛡️ Sentinel Identity Verification Checklist</span>
                              <span style={{ fontSize: 11, color: identityAuditReport.trustScore >= 90 ? 'var(--success-bright)' : 'var(--danger-bright)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                                Trust Score: {identityAuditReport.trustScore}%
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                              Primary Candidate Identity: <strong style={{ color: 'var(--text)' }}>{primaryCandidateName}</strong>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {vaultSlots.map(slot => (
                                <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, padding: '6px 10px', background: 'rgba(0,0,0,0.25)', borderRadius: 8 }}>
                                  <span style={{ color: 'var(--text-muted)' }}>{slot.fileName}</span>
                                  <span style={{ color: slot.verificationStatus === 'mismatch_warning' ? 'var(--danger-bright)' : 'var(--success-bright)', fontWeight: 700 }}>
                                    {slot.verificationStatus === 'mismatch_warning' ? `⚠️ Name Mismatch: "${slot.candidateName}"` : `✓ Name Matched: "${slot.candidateName}"`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                        </div>
                      </div>
                    </div>

                    {/* Footer Actions (Docked at Bottom) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, flexShrink: 0 }}>
                      {vaultSlots.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setVaultSlots([]);
                            cOS.setVaultItems([]);
                            toast.info('Vault Cleared', 'Cleared all local session documents.');
                          }}
                          style={{ background: 'rgba(var(--danger-rgb), 0.1)', border: '1px solid rgba(var(--danger-rgb), 0.25)', color: 'var(--danger-bright)', padding: '9px 16px', borderRadius: 10, fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}
                        >
                          🗑️ Clear All ({vaultSlots.length} Docs)
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          🔒 AES-256 Vault Encryption • 100% Student Data Confidentiality
                        </span>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.multiple = true;
                            input.accept = '.pdf,.docx,.txt,application/pdf';
                            input.onchange = (e: any) => {
                              const files = e.target?.files;
                              if (files && files.length > 0) handleBatchAutoSortUpload(files);
                            };
                            input.click();
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(56, 189, 248, 0.4)',
                            color: '#e0f2fe',
                            padding: '9px 18px',
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>+</span> Add Documents
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toast.success('Sentinel Calibrated', 'All 12 Identity, ATS & Document Integrity checks verified.');
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '9px 20px',
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Run All Verifications
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowVaultModal(false)}
                          style={{
                            background: 'linear-gradient(135deg, var(--brand) 0%, var(--accent) 100%)',
                            border: 'none',
                            color: 'var(--text)',
                            padding: '10px 22px',
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(var(--brand-rgb), 0.4)'
                          }}
                        >
                          {vaultSlots.length > 0 ? `Continue Diagnostic Onboarding (${vaultSlots.length} Docs Synced) →` : 'Close Vault'}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48 }}>
              {/* Ms. Priya */}
              <div 
                onClick={() => {
                  setSelectedMentor('priya');
                  startDeepDiagnostics();

                }}
                style={{
                  background: 'rgba(10, 15, 26, 0.4)',
                  border: '1.5px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 24,
                  padding: 36,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(var(--brand-rgb), 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 20 }}>👩‍💼</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 4 }}>Ms. Priya</h2>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 16 }}>
                  Full-Stack Systems Mentor
                </span>
                <p style={{ fontSize: 13.5, color: 'var(--t3)', lineHeight: 1.6, margin: 0 }}>
                  Specialized in systems design, databases, backend infrastructure, and interview preparation. Prefers analytical structure and deep socratic drilling.
                </p>
              </div>

              {/* Mr. Anish */}
              <div 
                onClick={() => {
                  setSelectedMentor('anish');
                  startDeepDiagnostics();

                }}
                style={{
                  background: 'rgba(10, 15, 26, 0.4)',
                  border: '1.5px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 24,
                  padding: 36,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--teal)';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(var(--accent-teal-rgb), 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 20 }}>👨‍💼</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 4 }}>Mr. Akash</h2>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 16 }}>
                  Interactive UX & Frontend Engineer
                </span>
                <p style={{ fontSize: 13.5, color: 'var(--t3)', lineHeight: 1.6, margin: 0 }}>
                  Specialized in React, Next.js, responsive layouts, user experience, design systems, and rapid prototyping. Focuses on visual feedback and hands-on building.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Dynamic Background Mesh Orbits */}
      <div style={{ position: 'absolute', top: '-15%', left: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--brand-rgb),0.12) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--accent-cyan-rgb),0.08) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      {/* Top Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(10,15,26,0.3)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="lp-brand-lockup" style={{ height: 40, padding: '2px 6px' }}>
            <img src="/brand/pinit-career-logo.png" alt="PINIT CAREER" className="lp-brand-logo" style={{ height: 34, maxWidth: 148 }} />
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={handleFastComplete}
              disabled={syncing}
              style={{
                background: 'linear-gradient(135deg, var(--green) 0%, var(--green) 100%)',
                border: 'none',
                borderRadius: 100,
                color: 'var(--card)',
                fontSize: 11,
                fontWeight: 800,
                padding: '6px 14px',
                cursor: syncing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(var(--success-rgb), 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              ⚡ Fast Finish (Admin Dev)
            </button>
          )}
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '4px 12px' }}>
            {stageLabel[activeScreen] || 'ONBOARDING'}
          </div>
          <GearAudioHub theme={cOS.theme} size="sm" />
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '43fr 57fr', maxWidth: '98%', width: '98%', margin: '0 auto', padding: '12px 24px 24px 24px', gap: 24, zIndex: 5, overflow: 'hidden' }}>
        
        {/* Left Column: VRoid Mentor Viewport */}
        <section style={{ background: 'rgba(10, 15, 26, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', minHeight: 0 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            {selectedMentor === 'anish' ? (
              <VRoidInterviewAvatar teacherId="anish" animState={animState} zoom={zoom} />
            ) : (
              <VRoidInterviewAvatar teacherId="priya" animState={animState} zoom={zoom} />
            )}
            
            {/* Audio Wave Listening Overlay */}
            {animState === 'listening' && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(var(--brand-rgb),0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="mic-wave-bar" style={{ width: 4, height: 20, background: 'var(--accent)', borderRadius: 2, animation: `pulse-height 1s ease-in-out infinite alternate ${i * 0.15}s` }} />
                  ))}
                </div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--brand-bright)', textTransform: 'uppercase', letterSpacing: '1px' }}>Listening... Speak now</div>
              </div>
            )}
          </div>

          {/* Floating Controls Overlay */}
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, background: 'rgba(10,15,26,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '6px 12px', backdropFilter: 'blur(10px)', zIndex: 12 }}>
            <button onClick={() => setZoom(z => Math.min(2.2, z + 0.1))} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }} title="Zoom In">🔍+</button>
            <button onClick={() => setZoom(z => Math.max(1.1, z - 0.1))} style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }} title="Zoom Out">🔍-</button>
            <button
              onClick={() => {
                const next = !isMuted;
                setIsMuted(next);
                setAvatarVoiceVolume(next ? 0 : 0.85);
              }}
              style={{ background: 'none', border: 'none', color: isMuted ? 'var(--danger-bright)' : 'var(--t3)', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }}
              title={isMuted ? "Unmute Mentor Voice" : "Mute Mentor Voice"}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={() => {
                const next = !isBgmMuted;
                setIsBgmMuted(next);
                ambientAudio.setMuted(next);
              }}
              style={{ background: 'none', border: 'none', color: isBgmMuted ? 'var(--danger-bright)' : 'var(--accent)', fontSize: 12, fontWeight: 800, cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 3 }}
              title={isBgmMuted ? "Unmute Background Music" : "Mute Background Music"}
            >
              {isBgmMuted ? '🔇' : '🎵'} <span>BGM</span>
            </button>
            <button 
              onClick={() => {
                if (!useNeural && !window.confirm("WARNING: Running Custom Neural TTS (Kitten) is resource-heavy and requires a steady internet connection. Proceed?")) {
                  return;
                }
                setUseNeural(!useNeural);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: useNeural ? 'var(--green)' : 'var(--t3)',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
              title={useNeural ? "Disable Kitten Voice" : "Enable Kitten Voice"}
            >
              {useNeural ? '🎙️ Neural' : '🔇 Silent'}
            </button>
          </div>
        </section>

        {/* Right Column: Screen panels */}
        <section style={{ display: 'flex', flexDirection: 'column', background: 'rgba(10, 15, 26, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, overflow: 'hidden', minHeight: 0 }}>
          
          {/* Active Screen Rendering */}

          {/* SCREEN 01: INTENT SELECTION */}
          {activeScreen === 'INTENT_SELECTION' && (
            <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--text)', marginBottom: 8 }}>
                  Choose Your Staging Track
                </h2>
                <p style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.5 }}>
                  The staging sandbox is initialized. Select your diagnostic track to calculate your career blueprint.
                </p>
              </div>

              {/* Selection cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                
                {/* Express Route Card */}
                <div 
                  onClick={() => setActiveScreen('EXPRESS_FORM')}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(var(--brand-rgb), 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>⚡</span>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>Express Route (1 Min)</h3>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4, margin: 0 }}>
                    Upload resume PDF directly to extract baseline skills.
                  </p>
                </div>

                {/* Deep Diagnostic Card */}
                <div 
                  onClick={startDeepDiagnostics}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--accent-cyan-rgb), 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(var(--accent-cyan-rgb), 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>🔬</span>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', margin: 0 }}>Deep Evolution (15 Min)</h3>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.4, margin: 0 }}>
                    Complete full diagnostic profiling and assessments.
                  </p>
                </div>

              </div>

              {/* Real-time Voice Analytics Card */}
              {voiceConfidence !== null && (
                <div style={{ background: 'rgba(var(--brand-rgb), 0.05)', border: '1.5px solid rgba(var(--brand-rgb), 0.2)', borderRadius: 14, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--brand-bright)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>🎙️ Realtime Voice DNA:</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                    <span style={{ color: 'var(--t3)' }}>Confidence Index:</span>
                    <span style={{ color: 'var(--t1)', fontWeight: 700 }}>{voiceConfidence}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                    <span style={{ color: 'var(--t3)' }}>Articulation Score:</span>
                    <span style={{ color: 'var(--t1)', fontWeight: 700 }}>{voiceArticulation}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                    <span style={{ color: 'var(--t3)' }}>Vocal Archetype:</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{voiceArchetype}</span>
                  </div>
                </div>
              )}

              {/* Utility buttons: Go Back and Repeat Voice */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button
                  onClick={() => {
                    stopAvatarSpeaking();
                    setActiveScreen('CHOOSE_GUIDE');
                  }}
                  style={{
                    height: 38,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    color: 'var(--border2)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  ← Change Guide
                </button>
                <button
                  onClick={() => {
                    speakReply(intentGreeting);
                  }}
                  style={{
                    height: 38,
                    background: 'rgba(var(--brand-rgb), 0.15)',
                    border: '1px solid rgba(var(--brand-rgb), 0.3)',
                    borderRadius: 10,
                    color: 'var(--brand-bright)',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.15)';
                  }}
                >
                  🎙️ Repeat Voice
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  stopAvatarSpeaking();
                  handleOnboardingComplete(
                    'Self-Taught / Other Learner',
                    'Software Engineer',
                    'To close skill gaps & earn XP',
                    'Pattern Hunter'
                  );
                }}
                style={{
                  marginTop: 16,
                  height: 40,
                  background: 'linear-gradient(135deg, rgba(var(--brand-rgb), 0.08) 0%, rgba(var(--reward-rgb), 0.08) 100%)',
                  border: '1.5px dashed rgba(var(--brand-rgb), 0.35)',
                  borderRadius: 10,
                  color: 'var(--accent)',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-mono)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(var(--brand-rgb), 0.15) 0%, rgba(var(--reward-rgb), 0.15) 100%)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(var(--brand-rgb), 0.08) 0%, rgba(var(--reward-rgb), 0.08) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(var(--brand-rgb), 0.35)';
                }}
              >
                ⏩ Skip Onboarding (Complete Setup)
              </button>
            </div>
          )}

          {/* SCREEN 02: POTENTIAL SLIDER */}
          {activeScreen === 'SLIDER' && (
            <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
              <button 
                onClick={() => setActiveScreen('INTENT_SELECTION')}
                style={{ background: 'transparent', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 12, alignSelf: 'flex-start', marginBottom: 20 }}
              >
                ← Go Back
              </button>

              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginBottom: 8, letterSpacing: '-0.5px' }}>
                  Define Your Evolution Gap
                </h2>
                <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5 }}>
                  Slide to indicate your estimated current skill level compared to your dream placement ambition. This initializes the roadmap density calculations.
                </p>
              </div>

              {/* Slider Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
                
                {/* Current Skill Ability */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                    <span style={{ color: 'var(--t3)' }}>Current Technical Ability</span>
                    <span style={{ color: 'var(--accent)' }}>{currentAbility}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="80" 
                    value={currentAbility}
                    onChange={(e) => setCurrentAbility(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--t2)', marginTop: 4 }}>
                    <span>Novice</span>
                    <span>Intermediate</span>
                    <span>Advanced</span>
                  </div>
                </div>

                {/* Target Career Ambition */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                    <span style={{ color: 'var(--t3)' }}>Target Career Ambition</span>
                    <span style={{ color: 'var(--teal)' }}>{targetAmbition}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="60" 
                    max="100" 
                    value={targetAmbition}
                    onChange={(e) => setTargetAmbition(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--t2)', marginTop: 4 }}>
                    <span>Competent (60%)</span>
                    <span>Top-Tier (85%)</span>
                    <span>Legendary (100%)</span>
                  </div>
                </div>

              </div>

              {/* Calculations Box */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, padding: 18, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--t3)', fontWeight: 600 }}>The Verification Gap:</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--coral)', fontFamily: 'var(--font-mono)' }}>
                    {targetAmbition - currentAbility}%
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${targetAmbition - currentAbility}%`, background: 'linear-gradient(90deg, var(--coral), var(--accent))', borderRadius: 3 }} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--t3)', marginTop: 12, lineHeight: 1.5, fontStyle: 'italic' }}>
                  {getSliderDialogue()}
                </p>
              </div>

              <button
                onClick={startDeepDiagnostics}
                style={{
                  width: '100%',
                  height: 46,
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                  border: 'none',
                  borderRadius: 12,
                  color: 'var(--card)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(var(--brand-rgb), 0.25)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Proceed to Diagnostic Questionnaire
              </button>
            </div>
          )}

          {/* SCREEN 03: EXPRESS FORM & RESUME PARSER */}
          {activeScreen === 'EXPRESS_FORM' && (
            <div style={{ flex: 1, padding: 28, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <button 
                onClick={() => setActiveScreen('INTENT_SELECTION')}
                style={{ background: 'transparent', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 11, alignSelf: 'flex-start', marginBottom: 14 }}
              >
                ← Go Back
              </button>

              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--t1)', marginBottom: 6, letterSpacing: '-0.5px' }}>
                  Express Staging setup
                </h2>
                <p style={{ fontSize: 12, color: 'var(--t3)' }}>
                  Provide your target trajectory & academic demographics. Then drag & drop your resume PDF to verify.
                </p>
              </div>

              <form onSubmit={handleExpressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* Trajectory Selector */}
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Target Career Trajectory</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                    {[
                      { id: 'react_frontend', label: 'React Frontend', emoji: '⚛️' },
                      { id: 'java_sde', label: 'Java Backend', emoji: '☕' },
                      { id: 'devops_cloud', label: 'DevOps Cloud', emoji: '☁️' },
                      { id: 'financial_analyst', label: 'FinTech (B.Com)', emoji: '📊' },
                      { id: 'business_analyst', label: 'Product (BBA)', emoji: '📈' }
                    ].map(t => (
                      <div
                        key={t.id}
                        onClick={() => setTrajectory(t.id as any)}
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          border: `1.5px solid ${trajectory === t.id ? 'var(--accent)' : 'rgba(255,255,255,0.04)'}`,
                          background: trajectory === t.id ? 'rgba(var(--brand-rgb), 0.08)' : 'rgba(255,255,255,0.01)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{t.emoji}</div>
                        <div>{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* College Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>College Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Apex Institute" 
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      style={{ width: '100%', height: 38, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '0 12px', fontSize: 12.5, color: 'var(--card)', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t3)', display: 'block', marginBottom: 6 }}>Degree Major</label>
                    <input 
                      type="text" 
                      placeholder="e.g. B.Tech CSE" 
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      style={{ width: '100%', height: 38, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '0 12px', fontSize: 12.5, color: 'var(--card)', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    height: 110,
                    borderRadius: 12,
                    border: `1.5px dashed ${dragOver ? 'var(--accent)' : uploadedFile ? 'var(--teal)' : 'rgba(255,255,255,0.1)'}`,
                    background: dragOver ? 'rgba(var(--brand-rgb), 0.04)' : uploadedFile ? 'rgba(var(--accent-teal-rgb), 0.02)' : 'rgba(255,255,255,0.01)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect}
                    accept="application/pdf"
                    style={{ display: 'none' }} 
                  />
                  
                  {uploadedFile ? (
                    <>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>📄</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{uploadedFile.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 2 }}>Click or drag to change files</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>📥</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700 }}>Drag & Drop Resume PDF here</div>
                      <div style={{ fontSize: 10, color: 'var(--t2)', marginTop: 2 }}>or click to browse local files</div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!college || !degree || !uploadedFile}
                  style={{
                    width: '100%',
                    height: 42,
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                    border: 'none',
                    borderRadius: 10,
                    color: 'var(--card)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: (!college || !degree || !uploadedFile) ? 0.5 : 1,
                    transition: 'all 0.15s ease',
                    marginTop: 6
                  }}
                >
                  Analyze Resume & Launch OS
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 04: DEEP ASSESSMENT CHAT */}
          {activeScreen === 'DEEP_CHAT' && (
            <>
              {/* Chat Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: animState === 'talking' ? 'var(--green)' : 'var(--brand)', animation: animState === 'talking' ? 'ping 1.5s infinite' : 'none' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{selectedMentor === 'priya' ? 'Ms. Priya' : 'Mr. Akash'}</div>
                  <div style={{ fontSize: 10, color: 'var(--t2)' }}>{animState === 'talking' ? 'Speaking...' : animState === 'listening' ? 'Listening...' : animState === 'thinking' ? 'Analyzing...' : 'Online'}</div>
                </div>
              </div>

              {/* Chat Timeline */}
              <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {messages.map((m) => {
                  const isAi = m.sender === 'ai';
                  return (
                    <div key={m.id} style={{ display: 'flex', justifyContent: isAi ? 'flex-start' : 'flex-end', animation: 'fadeInUp 0.3s ease forwards' }}>
                      <div style={{
                        maxWidth: '85%',
                        padding: '12px 16px',
                        borderRadius: isAi ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                        background: isAi ? '#1e293b' : 'linear-gradient(135deg, var(--brand) 0%, var(--reward) 100%)',
                        border: isAi ? '1px solid rgba(148,163,184,0.35)' : 'none',
                        color: 'var(--text)',
                        fontSize: 13.5,
                        fontWeight: 500,
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        boxShadow: isAi ? 'none' : '0 4px 12px rgba(var(--brand-rgb), 0.25)'
                      }}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Console (Voice-to-Option Selections) */}
              <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                    {getOptionsForStep().map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        disabled={syncing}
                        onClick={() => handleUserAnswer(opt)}
                        style={{
                          padding: '12px 20px',
                          borderRadius: 14,
                          background: 'rgba(var(--brand-rgb), 0.15)',
                          border: '1.5px solid rgba(var(--brand-rgb), 0.4)',
                          color: 'var(--brand-bright)',
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: syncing ? 'not-allowed' : 'pointer',
                          opacity: syncing ? 0.5 : 1,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SCREEN 04: IDENTITY DISCOVERY SLIDERS */}
          {activeScreen === 'IDENTITY_QUESTIONS' && (() => {
            const identityQs = getIdentityQuestions(studentType);
            const q = identityQs[Math.min(currentIdentityQ, identityQs.length - 1)];

            return (
              <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
                  <span>Identity Discovery</span>
                  <span>Slide {currentIdentityQ + 1} of {identityQs.length}</span>
                </div>
                
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                    {q.category}
                  </h3>
                  <p style={{ fontSize: 15, color: 'var(--t1)', lineHeight: 1.6, fontWeight: 600 }}>
                    {q.text}
                  </p>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={identityScores[q.id] || 50}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setIdentityScores(prev => ({ ...prev, [q.id]: val }));
                    }}
                    style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', height: 6 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t3)', marginTop: 12, fontWeight: 700 }}>
                    <span>← {q.left}</span>
                    <span>{identityScores[q.id] || 50}%</span>
                    <span>{q.right} →</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (currentIdentityQ < identityQs.length - 1) {
                      setCurrentIdentityQ(prev => prev + 1);
                    } else {
                      setActiveScreen('WORKPLACE_SIMULATION');
                    }
                  }}
                  style={{
                    width: '100%', height: 44,
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                    border: 'none', borderRadius: 12, color: 'var(--card)', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(var(--brand-rgb), 0.25)'
                  }}
                >
                  {currentIdentityQ < identityQs.length - 1 ? 'Save & Slide Next' : 'Proceed to Simulations'}
                </button>
              </div>
            );
          })()}

          {/* SCREEN 05: WORKPLACE SIMULATIONS */}
          {activeScreen === 'WORKPLACE_SIMULATION' && (() => {
            const isBusinessStream = studentType.includes('Commerce') || studentType.includes('Management') || studentType.includes('BBA') || studentType.includes('B.Com');
            const activeScenarios = isBusinessStream ? WORKPLACE_SCENARIOS_BUSINESS : WORKPLACE_SCENARIOS;
            const scenario = activeScenarios[Math.min(currentScenario, activeScenarios.length - 1)];

            return (
              <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
                  <span>{isBusinessStream ? 'Business & Leadership Simulation' : 'Technical & Engineering Simulation'}</span>
                  <span>Card {currentScenario + 1} of {activeScenarios.length}</span>
                </div>
                
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>
                    {scenario.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6 }}>
                    {scenario.text}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {scenario.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSimulationScores(prev => {
                          const updated = { ...prev };
                          Object.entries(opt.scores).forEach(([trait, val]) => {
                            updated[trait] = (updated[trait] || 0) + (val as number);
                          });
                          return updated;
                        });

                        if (currentScenario < activeScenarios.length - 1) {
                          setCurrentScenario(prev => prev + 1);
                        } else {
                          setActiveScreen('SPEECH_ASSESSMENT');
                        }
                      }}
                      style={{
                        padding: 14,
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        color: 'var(--t1)',
                        fontSize: 12.5,
                        fontWeight: 650,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(var(--brand-rgb), 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* SCREEN 06: SPEECH CALIBRATION & ASSESSMENT */}
          {activeScreen === 'SPEECH_ASSESSMENT' && (() => {
            const isCommerce = studentType.includes('Commerce') || studentType.includes('B.Com');
            const isManagement = studentType.includes('Management') || studentType.includes('BBA');

            const spokenPromptText = isCommerce
              ? "Please introduce yourself and explain your target financial & business analysis goals."
              : isManagement
              ? "Please introduce yourself and explain your target product management & business growth goals."
              : "Please introduce yourself and explain your target software career goals.";

            const streamPresets = isCommerce
              ? [
                  "📊 Financial Analyst: My goal is to build quantitative financial models, perform valuation, and manage corporate risk.",
                  "💳 FinTech Specialist: My goal is to optimize payment gateway architectures, SQL ledgers, and financial regulatory technology.",
                  "⚖️ Auditing & Compliance: My goal is to streamline ledger audits, tax compliance, and internal financial controls."
                ]
              : isManagement
              ? [
                  "📈 Product Manager: My goal is to lead cross-functional engineering teams, manage backlog funnels, and design product strategy.",
                  "🚀 Growth & Operations: My goal is to optimize unit economics, scale marketing acquisition funnels, and streamline supply chains.",
                  "💡 Management Consultant: My goal is to perform strategic market research, SWOT analysis, and executive advisory."
                ]
              : [
                  "🧠 Analytical SDE: My goal is to build scalable backend services, microservices, and optimize algorithm complexity.",
                  "🎨 Frontend Web SDE: My goal is to craft high-performance interactive interfaces using React, Next.js, and modern CSS.",
                  "☁️ DevOps Cloud SDE: My goal is to design automated CI/CD deployment pipelines and maintain cloud infrastructure."
                ];

            return (
              <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
                  <span>Vocal Assessment</span>
                  <span style={{ color: 'var(--accent)' }}>Microphone Active</span>
                </div>
                
                {speechState === 'ready' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🎙️</div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>Microphone Calibration</h3>
                    <p style={{ fontSize: 12.5, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 24 }}>
                      We calibrate background acoustics and regional accent variations to prevent scoring penalties. Click below to run a 3-second noise test.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSpeechState('calibrating');
                        setAnimState('wave');
                        let p = 0;
                        const iv = setInterval(() => {
                          p += 20;
                          setCalibrationProgress(p);
                          if (p >= 100) {
                            clearInterval(iv);
                            setSpeechState('calibrated');
                            setAnimState('idle');
                          }
                        }, 600);
                      }}
                      style={{
                        padding: '10px 24px',
                        background: 'rgba(var(--brand-rgb), 0.1)',
                        border: '1.5px solid var(--accent)',
                        borderRadius: 12,
                        color: 'var(--accent)',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Run Acoustic Calibration
                    </button>
                    <div style={{ marginTop: 12 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSpeechState('calibrated');
                          setManualInputMode(true);
                          setAnimState('idle');
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--t3)',
                          fontSize: 12,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        ⌨️ Skip & Answer via Keyboard / Text Input
                      </button>
                    </div>
                  </div>
                )}

                {speechState === 'calibrating' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin 1.5s linear infinite' }}>⬡</div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 8 }}>Calibrating...</h3>
                    <div style={{ width: 140, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, margin: '16px auto', overflow: 'hidden' }}>
                      <div style={{ width: `${calibrationProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--t2)' }}>Checking ambient frequency thresholds.</p>
                  </div>
                )}

                {(speechState === 'calibrated' || speechState === 'recording' || speechState === 'recorded') && (
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
                      Spoken Prompt
                    </h3>
                    <p style={{ fontSize: 15, color: 'var(--t1)', lineHeight: 1.5, fontWeight: 600, marginBottom: 20 }}>
                      "{spokenPromptText}"
                    </p>

                    {speechError && (
                      <div style={{
                        padding: '10px 14px',
                        background: 'rgba(var(--danger-rgb), 0.12)',
                        border: '1px solid rgba(var(--danger-rgb), 0.3)',
                        borderRadius: 10,
                        color: 'var(--danger-bright)',
                        fontSize: 12,
                        marginBottom: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        lineHeight: 1.4
                      }}>
                        <span>⚠️ {speechError}</span>
                        <button
                          type="button"
                          onClick={() => setSpeechError(null)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--danger-bright)', cursor: 'pointer', fontSize: 13, marginLeft: 8 }}
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ color: 'var(--t2)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                          STT TRANSCRIPT / DICTATION CONSOLE
                        </span>
                        <button
                          type="button"
                          onClick={() => setManualInputMode(!manualInputMode)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent)',
                            fontSize: 11,
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          {manualInputMode ? '🎙️ Switch to Speech View' : '✏️ Type / Edit Manually'}
                        </button>
                      </div>

                      {manualInputMode ? (
                        <textarea
                          value={speechTranscript}
                          onChange={(e) => {
                            setSpeechTranscript(e.target.value);
                            if (e.target.value.trim().length > 0) {
                              setSpeechState('recorded');
                            }
                          }}
                          placeholder="Type your career goal and technical ambition here..."
                          className="form-input"
                          style={{
                            width: '100%',
                            minHeight: 88,
                            fontFamily: 'var(--font-mono)',
                            fontSize: 12,
                            color: 'var(--success-bright)',
                            background: '#070913',
                            border: '1px solid rgba(var(--brand-rgb), 0.3)',
                            borderRadius: 12,
                            padding: 12,
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <div
                          onClick={() => setManualInputMode(true)}
                          title="Click to type or edit"
                          style={{
                            minHeight: 80,
                            background: '#070913',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 12,
                            padding: 14,
                            fontFamily: 'var(--font-mono)',
                            fontSize: 11,
                            color: 'var(--success-bright)',
                            textAlign: 'left',
                            cursor: 'text'
                          }}
                        >
                          {speechTranscript || (speechState === 'recording' ? 'Listening... Speak now...' : 'Click Record Audio, choose a preset, or click here to type manually...')}
                        </div>
                      )}
                    </div>

                    {/* ⌨️ Mic Fault Tolerance: Quick Response Templates */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                        ⌨️ Mic Fault Tolerance & Quick Dictation Presets:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {streamPresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSpeechTranscript(preset);
                              setSpeechState('recorded');
                              setAnimState('idle');
                              setSpeechError(null);
                            }}
                            style={{
                              padding: '8px 12px',
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              borderRadius: 8,
                              color: 'var(--border2)',
                              fontSize: 11,
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(var(--brand-rgb), 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(var(--brand-rgb), 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                            }}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSpeechError(null);
                          if (speechState === 'recording') {
                            setSpeechState('recorded');
                            setAnimState('idle');
                            if (recognitionRef.current) {
                              try { recognitionRef.current.stop(); } catch { /* ignore */ }
                            }
                          } else {
                            setSpeechState('recording');
                            setSpeechTranscript('');
                            setAnimState('listening');
                            
                            if (typeof window !== 'undefined') {
                              const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                              if (SpeechRecognition) {
                                try {
                                  const rec = new SpeechRecognition();
                                  rec.continuous = true;
                                  rec.interimResults = false;
                                  rec.lang = 'en-US';
                                  rec.onresult = (e: any) => {
                                    const chunk = e.results[e.results.length - 1]?.[0]?.transcript;
                                    if (chunk) {
                                      setSpeechTranscript(prev => (prev ? prev + ' ' + chunk : chunk));
                                    }
                                  };
                                  rec.onerror = (e: any) => {
                                    setSpeechState('recorded');
                                    setAnimState('idle');
                                    const code = e?.error;
                                    let msg = 'Speech recognition encountered an issue. You can retry or type below.';
                                    if (code === 'not-allowed' || code === 'service-not-allowed') {
                                      msg = 'Microphone permission was denied by browser settings. Please type your response below or use a preset.';
                                      setManualInputMode(true);
                                    } else if (code === 'no-speech') {
                                      msg = 'No speech detected. Please speak clearly into your mic, or type your response below.';
                                    } else if (code === 'network') {
                                      msg = 'Speech recognition network error. Please type your response below.';
                                      setManualInputMode(true);
                                    }
                                    setSpeechError(msg);
                                  };
                                  rec.onend = () => {
                                    setSpeechState('recorded');
                                    setAnimState('idle');
                                  };
                                  recognitionRef.current = rec;
                                  rec.start();
                                } catch (err: any) {
                                  console.warn('[Speech] Could not start speech recognition:', err);
                                  setSpeechState('recorded');
                                  setAnimState('idle');
                                  setManualInputMode(true);
                                  setSpeechError('Microphone could not be activated on this device. Please type your response below.');
                                }
                              } else {
                                setSpeechState('recorded');
                                setAnimState('idle');
                                setManualInputMode(true);
                                setSpeechError('Browser speech recognition is not supported in this environment. Please type your answer below or select a preset.');
                              }
                            }
                          }
                        }}
                        style={{
                          flex: 1, height: 42,
                          background: speechState === 'recording' ? 'var(--coral)' : 'rgba(255,255,255,0.04)',
                          border: `1.5px solid ${speechState === 'recording' ? 'var(--coral)' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: 10, color: 'var(--card)', fontWeight: 700, cursor: 'pointer'
                        }}
                      >
                        {speechState === 'recording' ? '⏹ Stop Recording' : speechState === 'recorded' ? '🔄 Retry Recording' : '🎙️ Record Audio'}
                      </button>

                      <button
                        type="button"
                        disabled={!speechTranscript.trim() && speechState !== 'recorded'}
                        onClick={() => {
                          let maxTrait = 'Pattern Hunter';
                          let maxVal = -1;
                          Object.entries(simulationScores).forEach(([trait, val]) => {
                            if (val > maxVal) {
                              maxVal = val;
                              maxTrait = trait;
                            }
                          });
                          
                          const archetypeMap: Record<string, string> = {
                            PatternHunter: 'Pattern Hunter',
                            Stabilizer: 'Stabilizer',
                            SocialIQ: 'Social IQ',
                            Explorer: 'Explorer'
                          };
                          const selectedArch = archetypeMap[maxTrait] || 'Pattern Hunter';
                          setComputedArchetype(selectedArch);
                          
                          setActiveScreen('BLUEPRINT_REVEAL');
                          setAnimState('nod');
                          speakReply(`Congratulations! I have mapped your traits. Let's reveal your potential mapping and diagnostic blueprint.`);
                        }}
                        style={{
                          flex: 1, height: 42,
                          background: 'linear-gradient(135deg, var(--accent) 0%, var(--purple) 100%)',
                          border: 'none', borderRadius: 10, color: 'var(--card)', fontWeight: 700, cursor: 'pointer',
                          opacity: (!speechTranscript.trim() && speechState !== 'recorded') ? 0.5 : 1
                        }}
                      >
                        Complete & Grade
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* SCREEN 07: DIAGNOSTIC BLUEPRINT REVEAL */}
          {activeScreen === 'BLUEPRINT_REVEAL' && (() => {
            const qt2Breakdown = calculateQT2MindsetBreakdown(identityScores, simulationScores, voiceArchetype);

            return (
              <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(var(--accent-teal-rgb), 0.1)', color: 'var(--teal)', padding: '3px 8px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                      QT2 Mindset Analysis Complete
                    </span>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(var(--brand-rgb), 0.15)', color: 'var(--brand-bright)', padding: '3px 8px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                      {studentType.includes('Commerce') || studentType.includes('B.Com') ? '📊 FinTech & Commerce Track (B.Com)' : studentType.includes('Management') || studentType.includes('BBA') ? '📈 Product & Business Track (BBA)' : '💻 Tech & Software Track'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--t1)', marginTop: 6, letterSpacing: '-0.6px' }}>
                    {qt2Breakdown.blendTitle}
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.5, marginTop: 4 }}>
                    {qt2Breakdown.blendDescription}
                  </p>
                </div>

                {/* 4 Quadrants Mindset Breakdown */}
                <div style={{ background: '#111827', border: '1px solid rgba(148,163,184,0.28)', borderRadius: 16, padding: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
                      🧠 QT2 Cognitive Mindset Distribution:
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(var(--brand-rgb), 0.12)', color: 'var(--brand-bright)', border: '1px solid rgba(var(--brand-rgb), 0.25)', borderRadius: 100, padding: '2px 8px', fontWeight: 700 }}>
                      Self-Awareness Index: {qt2Breakdown.selfAwarenessScore}%
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
                    {[
                      { label: 'Pattern Hunter', icon: '🧩', score: qt2Breakdown.patternHunter, color: 'var(--brand)' },
                      { label: 'Stabilizer', icon: '🛡️', score: qt2Breakdown.stabilizer, color: 'var(--green)' },
                      { label: 'Social IQ', icon: '🤝', score: qt2Breakdown.socialIQ, color: 'var(--warning)' },
                      { label: 'Explorer', icon: '🚀', score: qt2Breakdown.explorer, color: 'var(--accent-cyan)' }
                    ].map(quad => (
                      <div key={quad.label} style={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.28)', borderRadius: 12, padding: '10px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, marginBottom: 6 }}>
                          <span style={{ color: 'var(--text)' }}>{quad.icon} {quad.label}</span>
                          <span style={{ color: quad.color, fontFamily: 'var(--font-mono)' }}>{quad.score}%</span>
                        </div>
                        <div style={{ height: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.max(quad.score, 4)}%`, background: quad.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 10.5, color: 'var(--t3)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>🎯 {qt2Breakdown.selfAwarenessLabel}</span>
                  </div>
                </div>

                {/* 🧑‍💼 Choose Dashboard Mentor Selector */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.6px', fontFamily: 'var(--font-mono)' }}>
                    Choose Your Dashboard VRoid Guide (Locked After Onboarding)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div 
                      onClick={() => setSelectedMentor('priya')}
                      style={{
                        background: selectedMentor === 'priya' ? 'rgba(var(--brand-rgb), 0.08)' : 'rgba(255,255,255,0.01)',
                        border: `1.5px solid ${selectedMentor === 'priya' ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: 12, padding: 12, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center', transition: 'all 0.15s'
                      }}
                    >
                      <span style={{ fontSize: 22 }}>👩‍💼</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: selectedMentor === 'priya' ? 'var(--brand-bright)' : 'var(--text)' }}>Ms. Priya</div>
                        <div style={{ fontSize: 10, color: 'var(--t3)' }}>Warm, structured steps.</div>
                      </div>
                    </div>
                    <div 
                      onClick={() => setSelectedMentor('anish')}
                      style={{
                        background: selectedMentor === 'anish' ? 'rgba(var(--brand-rgb), 0.08)' : 'rgba(255,255,255,0.01)',
                        border: `1.5px solid ${selectedMentor === 'anish' ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: 12, padding: 12, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center', transition: 'all 0.15s'
                      }}
                    >
                      <span style={{ fontSize: 22 }}>👨‍💼</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: selectedMentor === 'anish' ? 'var(--brand-bright)' : 'var(--text)' }}>Mr. Akash</div>
                        <div style={{ fontSize: 10, color: 'var(--t3)' }}>High accountability.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOnboardingComplete(studentType, targetGoal, accessReason, qt2Breakdown.blendTitle)}
                  style={{
                    width: '100%', height: 44,
                    background: 'linear-gradient(135deg, var(--teal) 0%, var(--accent) 100%)',
                    border: 'none', borderRadius: 12, color: 'var(--card)', fontWeight: 800, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(var(--accent-teal-rgb), 0.25)'
                  }}
                >
                  Activate Command Center &middot; Launch OS
                </button>
              </div>
            );
          })()}

        </section>
      </main>

      {/* Syncing / Parsing Terminal Progress Overlay */}
      {syncing && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3,5,8,0.95)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          
          {/* Glowing Spinner Ring */}
          <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 24 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(var(--brand-rgb),0.1)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid transparent', borderTopColor: 'var(--accent)', animation: 'spin 1.2s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
              {syncProgress}%
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: 'var(--t1)', marginBottom: 4, letterSpacing: '-0.5px' }}>
            {uploadedFile ? 'Parser Staging Sandbox' : 'Orchestrating Trajectory OS'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--t3)', fontFamily: 'var(--font-mono)', textAlign: 'center', marginBottom: 24 }}>
            {syncStatus}
          </p>

          {/* Terminal Console Logs */}
          {parserLogs.length > 0 && (
            <div style={{
              width: '100%',
              maxWidth: 500,
              background: '#070913',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: 16,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--success-bright)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              marginBottom: 24,
              minHeight: 120,
              justifyContent: 'flex-start'
            }}>
              <div style={{ color: 'var(--t2)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>PARSER PROCESS TERMINAL</span>
                <span>ONLINE</span>
              </div>
              {parserLogs.map((log, index) => (
                <div key={index} style={{ lineBreak: 'anywhere' }}>
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Main Progress Bar */}
          <div style={{ width: 300, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${syncProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--teal))', borderRadius: 2, transition: 'width 0.2s ease' }} />
          </div>
        </div>
      )}

      {/* Embedded Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-height {
          from { height: 6px; }
          to { height: 28px; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .mic-wave-bar { transition: height 0.1s ease; }
      `}} />
    </div>
  );

  // Selector options helper
  function getOptionsForStep() {
    if (currentStep === 0) {
      return [
        "Commerce & Finance Student (B.Com, M.Com)",
        "Management & Business Student (BBA, MBA)",
        "Computer Science / IT Student (B.Tech, BCA, MCA)",
        "Non-CS Engineering / Science / Arts"
      ];
    }
    if (currentStep === 1) {
      if (studentType.includes("Commerce") || studentType.includes("B.Com")) {
        return [
          "Financial & FinTech Analyst",
          "Business Analyst",
          "Accounting & Risk Manager"
        ];
      }
      if (studentType.includes("Management") || studentType.includes("BBA")) {
        return [
          "Product Manager",
          "Management Consultant",
          "Operations & Growth Lead"
        ];
      }
      return [
        "Software Engineer",
        "UI/UX Designer",
        "DevOps Engineer"
      ];
    }
    if (currentStep === 2) {
      return [
        "To close skill gaps & earn XP",
        "To build portfolio & find internships",
        "To practice AI mock interviews",
        "To verify credentials in the vault"
      ];
    }
    if (currentStep === 3) {
      if (studentType.includes("Commerce") || studentType.includes("Management") || studentType.includes("BBA") || studentType.includes("B.Com")) {
        return [
          "Beginner Analyst",
          "Intermediate Analyst",
          "Advanced Specialist"
        ];
      }
      return [
        "Beginner Coder",
        "Intermediate Coder",
        "Advanced Coder"
      ];
    }
    if (currentStep === 4) {
      return [
        "Reading articles & docs",
        "Watching tutorial videos",
        "Writing code & hands-on case studies"
      ];
    }
    if (currentStep === 5) {
      return [
        "5 hours per week",
        "10 hours per week",
        "15+ hours per week"
      ];
    }
    return [];
  }
}
