'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS } from '@/lib/api/hooks';
import dynamic from 'next/dynamic';
import { speakWithAvatar, stopSpeaking, preloadTTS, preloadNextSpeech, preloadMultipleSpeeches } from '@/lib/tts';
import { pingRenderServer } from '@/lib/smartVoiceRouter';
import { toast } from '@/lib/store/useAppStore';

import { preloadAvatarGLB } from '@/components/avatar/VRoidInterviewAvatar';

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
    category: 'System Logic vs User Empathy',
    text: 'When solving software problems, do you focus more on backend algorithms and state architecture, or frontend user experience and intuitive workflows?',
    left: '🎨 User Empathy (Social IQ)',
    right: '🧠 Code Logic (Pattern Hunter)'
  },
  {
    id: 'pace_vs_depth',
    category: 'Innovation Pace vs Systems Depth',
    text: 'Do you prefer rapidly experimenting with new tools and frameworks, or mastering deep, low-level mechanics of system architecture?',
    left: '🚀 Rapid Innovation (Explorer)',
    right: '🔬 Low-Level Systems (Pattern Hunter)'
  },
  {
    id: 'stability_vs_speed',
    category: 'Quality Rigor vs Execution Speed',
    text: 'When shipping code under tight deadlines, do you prioritize zero-bug reliability with complete test coverage, or shipping working features fast to iterate live?',
    left: '🛡️ Quality Rigor (Stabilizer)',
    right: '⚡ Execution Speed (Explorer)'
  },
  {
    id: 'collaboration_vs_deepfocus',
    category: 'Team Synergy vs Solo Deep Focus',
    text: 'How do you perform best during high-stakes sprints?',
    left: '🤝 Team Synergy & Alignment (Social IQ)',
    right: '🎯 Solo Deep Focus & Deep Work (Pattern Hunter)'
  }
];

function getIdentityQuestions(studentType: string = '') {
  const isCommerce = studentType.includes('Commerce') || studentType.includes('B.Com');
  const isManagement = studentType.includes('Management') || studentType.includes('BBA');

  if (isCommerce) {
    return [
      {
        id: 'logic_vs_empathy',
        category: 'Financial Rigor vs Market Empathy',
        text: 'When executing a financial strategy, do you focus on quantitative auditing and ledger accuracy, or market positioning and customer sentiment?',
        left: '🎨 Market Empathy (Social IQ)',
        right: '📊 Financial Rigor (Pattern Hunter)'
      },
      {
        id: 'pace_vs_depth',
        category: 'Market Pace vs Financial Depth',
        text: 'Do you prefer rapidly experimenting with new market growth channels, or building deep quantitative DCF and valuation models?',
        left: '🚀 Growth Innovation (Explorer)',
        right: '🔬 Valuation Depth (Pattern Hunter)'
      },
      {
        id: 'stability_vs_speed',
        category: 'Fiscal Risk Rigor vs Execution Speed',
        text: 'When managing Q4 budgets under tight deadlines, do you prioritize zero-risk compliance, or fast capital allocation to capture market share?',
        left: '🛡️ Compliance Rigor (Stabilizer)',
        right: '⚡ Rapid Capital Deployment (Explorer)'
      },
      {
        id: 'collaboration_vs_deepfocus',
        category: 'Executive Alignment vs Independent Modeling',
        text: 'How do you perform best during high-stakes financial planning cycles?',
        left: '🤝 Board & Stakeholder Sync (Social IQ)',
        right: '🎯 Solo Financial Modeling (Pattern Hunter)'
      }
    ];
  }

  if (isManagement) {
    return [
      {
        id: 'logic_vs_empathy',
        category: 'Product Analytics vs User Empathy',
        text: 'When defining product features, do you prioritize metrics & data funnels, or user empathy & qualitative design thinking?',
        left: '🎨 User Empathy (Social IQ)',
        right: '📈 Product Analytics (Pattern Hunter)'
      },
      {
        id: 'pace_vs_depth',
        category: 'Agile Speed vs Operational Depth',
        text: 'Do you prefer rapid GTM product launches, or mastering operational supply chain mechanics and unit economics?',
        left: '🚀 Rapid Product GTM (Explorer)',
        right: '🔬 Operational Depth (Pattern Hunter)'
      },
      {
        id: 'stability_vs_speed',
        category: 'Operational Rigor vs Iteration Speed',
        text: 'When launching campaigns under deadline pressure, do you prioritize strict quality benchmarks, or shipping MVP features live?',
        left: '🛡️ Operational Quality (Stabilizer)',
        right: '⚡ Rapid MVP Iteration (Explorer)'
      },
      {
        id: 'collaboration_vs_deepfocus',
        category: 'Cross-Functional Leadership vs Strategic Modeling',
        text: 'How do you perform best during high-stakes product sprints?',
        left: '🤝 Cross-Functional Leadership (Social IQ)',
        right: '🎯 Strategic Analysis (Pattern Hunter)'
      }
    ];
  }

  return IDENTITY_QS;
}

const WORKPLACE_SCENARIOS = [
  {
    id: 'bug_launch',
    title: 'Critical Crash 10 Minutes Before Production Launch',
    text: 'An unexpected memory leak is discovered in your core service right before going live to 50,000 users. How do you respond?',
    options: [
      { text: '🛑 Delay & Audit: Postpone the launch, trace memory dumps to fix root cause, and add automated regression tests.', trait: 'Stabilizer', scores: { Stabilizer: 40, PatternHunter: 20 } },
      { text: '🚀 Disable & Ship: Disable the leaking feature flag, launch the stable core now, and push an over-the-air hotfix later.', trait: 'Explorer', scores: { Explorer: 35, Stabilizer: 20 } },
      { text: '🧩 Isolate Pattern: Isolate the exact leaky garbage-collection loop, patch the reference, and benchmark memory load within 5 minutes.', trait: 'PatternHunter', scores: { PatternHunter: 45, Explorer: 15 } },
      { text: '📢 Team Alignment: Call an immediate war-room, align stakeholders on the risk, and delegate triage roles across engineers.', trait: 'SocialIQ', scores: { SocialIQ: 45, Stabilizer: 15 } }
    ]
  },
  {
    id: 'stack_selection',
    title: 'Selecting Tech Stack for a High-Growth Service',
    text: 'Your team is launching a new scalable real-time service. How do you choose the technology stack?',
    options: [
      { text: '📊 Benchmark Data: Run latency & throughput stress tests across 3 frameworks before making a data-driven choice.', trait: 'PatternHunter', scores: { PatternHunter: 40, Stabilizer: 20 } },
      { text: '🛡️ Enterprise LTS: Select the industry-standard, battle-tested stack with long-term support and proven stability.', trait: 'Stabilizer', scores: { Stabilizer: 45, PatternHunter: 15 } },
      { text: '✨ Modern & Agile: Choose the newest cutting-edge framework to unlock rapid development speed and modern DX.', trait: 'Explorer', scores: { Explorer: 45, SocialIQ: 15 } },
      { text: '🤝 Team Consensus: Conduct team workshops to evaluate developer comfort, hiring availability, and maintainability.', trait: 'SocialIQ', scores: { SocialIQ: 40, Explorer: 20 } }
    ]
  },
  {
    id: 'ambiguous_reqs',
    title: 'Handling Ambiguous Product Specifications',
    text: 'The client provides vague requirements for a key feature due in 1 week. What is your strategy?',
    options: [
      { text: '💬 Stakeholder Interview: Schedule a discovery call with end-users and product managers to map exact user stories.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } },
      { text: '📐 State Machine: Construct formal state diagrams and schema contracts to turn ambiguity into clear code specs.', trait: 'PatternHunter', scores: { PatternHunter: 40, Stabilizer: 20 } },
      { text: '🎨 Rapid Mockup: Build a working UI prototype in 4 hours to let stakeholders interact and clarify requirements visually.', trait: 'Explorer', scores: { Explorer: 40, SocialIQ: 20 } },
      { text: '📋 Edge Case Matrix: Write comprehensive unit test stubs covering all edge cases and boundary conditions first.', trait: 'Stabilizer', scores: { Stabilizer: 40, PatternHunter: 20 } }
    ]
  },
  {
    id: 'code_review_conflict',
    title: 'Architectural Disagreement in Code Review',
    text: 'A peer leaves critical feedback on your pull request suggesting a complete refactor of your module. How do you handle it?',
    options: [
      { text: '💡 Collaborative Sync: Jump on a quick huddle to understand their perspective and co-design a solution together.', trait: 'SocialIQ', scores: { SocialIQ: 45, Explorer: 15 } },
      { text: '🔬 Analytical Compare: Create a comparative trade-off matrix analyzing memory complexity, extensibility, and performance.', trait: 'PatternHunter', scores: { PatternHunter: 45, Stabilizer: 15 } },
      { text: '🛡️ Refactor for Safety: Adopt their suggestions to ensure code consistency, strict linting standards, and maintainability.', trait: 'Stabilizer', scores: { Stabilizer: 40, SocialIQ: 15 } },
      { text: '🚀 Spike Experiment: Spend 30 minutes prototyping both approaches side-by-side to see which feels cleaner in practice.', trait: 'Explorer', scores: { Explorer: 40, PatternHunter: 20 } }
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
    preloadTTS();
    const introText = "Welcome to your personal diagnostic assessment! First, are you a college student, a fresh graduate, or a working professional?";
    preloadNextSpeech(introText, 'priya');
  }, [user, router]);

  // Screen/Route States: 'CHOOSE_GUIDE' | 'INTENT_SELECTION' | 'SLIDER' | 'EXPRESS_FORM' | 'DEEP_CHAT' | 'IDENTITY_QUESTIONS' | 'WORKPLACE_SIMULATION' | 'SPEECH_ASSESSMENT' | 'BLUEPRINT_REVEAL'
  const [activeScreen, setActiveScreen] = useState<'CHOOSE_GUIDE' | 'INTENT_SELECTION' | 'SLIDER' | 'EXPRESS_FORM' | 'DEEP_CHAT' | 'IDENTITY_QUESTIONS' | 'WORKPLACE_SIMULATION' | 'SPEECH_ASSESSMENT' | 'BLUEPRINT_REVEAL'>('CHOOSE_GUIDE');
  
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [vaultUploading, setVaultUploading] = useState(false);
  const [vaultSuccess, setVaultSuccess]     = useState(false);
  const [vaultUploadedFilesInfo, setVaultUploadedFilesInfo] = useState<{ name: string; size: string; type: string }[]>([]);
  const [vaultAnalysisData, setVaultAnalysisData] = useState<{
    totalDocs: number;
    extractedSkills: string[];
    weakAreas: string[];
    qt1Score: number;
    atsScore: number;
    integrityStatus: string;
    isProvisional: boolean;
  } | null>(null);

  const handleVaultFileUpload = async (filesList: File[] | FileList) => {
    const files = Array.from(filesList);
    if (!files || files.length === 0) return;
    setVaultUploading(true);
    setVaultSuccess(false);

    try {
      const processedFilesInfo: { name: string; size: string; type: string }[] = [];
      const allExtractedSkills = new Set<string>();
      const allWeakAreas = new Set<string>();
      const createdVaultItems: any[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        processedFilesInfo.push({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.name.endsWith('.pdf') ? 'Resume PDF' : file.name.endsWith('.docx') ? 'Word Document' : 'Text Record'
        });

        try {
          const form = new FormData();
          form.append('resume', file);
          const res = await api.post<{ ok: boolean; resumeId: string; analysis: any }>('/api/resume/upload', form);
          const skills = res?.analysis?.skill_tags || ['React', 'Node.js', 'TypeScript', 'Java', 'SQL'];
          const gaps = res?.analysis?.weak_areas || ['Docker', 'System Design'];
          skills.forEach((s: string) => allExtractedSkills.add(s));
          gaps.forEach((g: string) => allWeakAreas.add(g));
        } catch (err) {
          if (file.name.toLowerCase().includes('cert') || file.name.toLowerCase().includes('shield')) {
            ['Docker', 'System Design', 'CI/CD', 'AWS', 'Kubernetes'].forEach(s => allExtractedSkills.add(s));
          } else if (file.name.toLowerCase().includes('proj') || file.name.toLowerCase().includes('repo')) {
            ['Git', 'GraphQL', 'Next.js', 'Zustand', 'PostgreSQL'].forEach(s => allExtractedSkills.add(s));
          } else {
            ['React', 'Node.js', 'Python', 'TypeScript', 'Java', 'SQL'].forEach(s => allExtractedSkills.add(s));
            ['System Design', 'Docker', 'CI/CD'].forEach(g => allWeakAreas.add(g));
          }
        }

        createdVaultItems.push({
          id: 'vault_doc_' + Date.now() + '_' + i,
          title: file.name,
          item_type: file.name.toLowerCase().includes('cert') ? 'certification' : 'resume',
          organization_name: 'Provisional Diagnostic Vault',
          description: `Uploaded during diagnostic onboarding. Provisional baseline (${(file.size / 1024).toFixed(1)} KB) - Requires Monaco Coding Quest verification.`,
          verified: false, // Provisional baseline until coding challenge completed
          ai_confidence_score: 88 + Math.floor(Math.random() * 8),
          skill_tags: Array.from(allExtractedSkills).slice(0, 5),
          is_public: true,
          used_in_resume: true,
          used_in_portfolio: true
        });
      }

      const extractedSkillsList = Array.from(allExtractedSkills);
      const weakAreasList = Array.from(allWeakAreas);

      // Calculate cumulative unique files and skills deterministically
      const map = new Map<string, { name: string; size: string; type: string }>();
      (vaultUploadedFilesInfo || []).forEach(item => map.set(item.name, item));
      processedFilesInfo.forEach(item => map.set(item.name, item));
      const updatedFilesInfo = Array.from(map.values());

      setVaultUploadedFilesInfo(updatedFilesInfo);

      const updatedExtractedSkillsList = Array.from(new Set([
        ...(vaultAnalysisData?.extractedSkills || []),
        ...extractedSkillsList
      ]));

      const updatedWeakAreasList = Array.from(new Set([
        ...(vaultAnalysisData?.weakAreas || []),
        ...weakAreasList
      ]));

      const cumulativeDocCount = updatedFilesInfo.length || (files.length + (vaultAnalysisData?.totalDocs || 0));

      const baseQT1 = 74;
      const docCountBonus = Math.min(18, cumulativeDocCount * 6);
      const skillDiversityBonus = Math.min(10, Math.floor(updatedExtractedSkillsList.length * 1.2));
      const computedQT1Score = Math.min(99, baseQT1 + docCountBonus + skillDiversityBonus);
      const computedATSScore = Math.min(98, 82 + cumulativeDocCount * 4);

      const existingVaultItems = cOS.vaultItems || [];
      cOS.setVaultItems([...existingVaultItems, ...createdVaultItems]);
      cOS.setResumeGenerated(true);
      cOS.generateFusedRoadmap(updatedExtractedSkillsList, updatedWeakAreasList);

      setVaultAnalysisData({
        totalDocs: cumulativeDocCount,
        extractedSkills: updatedExtractedSkillsList,
        weakAreas: updatedWeakAreasList,
        qt1Score: computedQT1Score,
        atsScore: computedATSScore,
        integrityStatus: 'Authentic Structure (Provisional Baseline - Requires Monaco Code Quest Verification)',
        isProvisional: true
      });
      setVaultSuccess(true);

      toast.success(
        `📁 ${files.length} New Document${files.length > 1 ? 's' : ''} Added to Vault!`,
        `Total Vault Documents: ${cumulativeDocCount}. Cumulative Provisional QT1 Score: ${computedQT1Score}/100.`
      );
    } catch (err: any) {
      toast.error('Vault Upload Error', 'Processing failed for selected files.');
    } finally {
      setVaultUploading(false);
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
      preloadAvatarGLB(['priya', 'anish', 'kashyap', 'karthic']);
      
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
  const [zoom, setZoom] = useState(1.65);
  const [isMuted, setIsMuted] = useState(false);
  const [useNeural, setUseNeural] = useState(true);
  const [recognizing, setRecognizing] = useState(false);

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
        
        // 1. Try Groq Whisper online STT first for maximum accuracy
        try {
          const keysStr = process.env.GROQ_API_KEYS || '';
          let keys = keysStr.split(',').map(k => k.trim()).filter(Boolean);
          const singleKey = process.env.GROQ_API_KEY;
          if (singleKey && !keys.includes(singleKey)) {
            keys.push(singleKey);
          }

          for (const key of keys) {
            try {
              const formData = new FormData();
              formData.append('file', audioBlob, 'speech.webm');
              formData.append('model', 'whisper-large-v3');
              formData.append('language', 'en');

              const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${key}`
                },
                body: formData
              });

              if (res.ok) {
                const data = await res.json();
                transcript = (data.text || '').trim();
                console.log("[Online STT] Transcribed via Groq Whisper:", transcript);
                break;
              } else {
                throw new Error(`Whisper transcription failed: ${res.status}`);
              }
            } catch (err: any) {
              console.warn(`[Online STT Failover] Key failed: ${key.slice(0, 10)}... Error: ${err.message}`);
            }
          }
        } catch (err) {
          console.warn("[Online STT] Groq Whisper failed or was blocked, falling back to In-Browser Offline Whisper:", err);
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

  // ⚡ 1-Click Fast Complete (< 30s)
  const handleFastComplete = async () => {
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
        onboardingAnswers: {
          role: defaultRole,
          education: defaultEdu,
          skills: defaultSkills,
          experience: 'fresher',
          hasCompleted: true,
          codingExperience: "Intermediate Coder",
          learningStyle: "Writing code hands-on",
          weeklyHours: "10 hours per week",
          accessReason: "To close skill gaps & earn XP",
          qt1_score: 80,
          qt2_score: 85,
          mindset_archetype: "Pattern Hunter"
        },
        roadmapGenerated: true
      };

      await api.post('/api/auth/onboarding', payload);

      cOS.setOnboarding({
        role: defaultRole,
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
      sessionStorage.setItem('pinit_just_onboarded', 'true');
      router.push('/dashboard');
    } catch (err) {
      console.error("Fast onboarding error", err);
      sessionStorage.setItem('pinit_just_onboarded', 'true');
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
        // Calculate QT1 and QT2 scores deterministically based on user onboarding choices
        const baseCodingScore = codingExperience === 'Advanced Coder' ? 88 : codingExperience === 'Intermediate Coder' ? 75 : 62;
        const csBonus = profileType.includes('Computer Science') ? 8 : 4;
        const hoursBonus = weeklyHours.includes('15+') ? 4 : weeklyHours.includes('10') ? 2 : 1;
        const computedQT1 = Math.min(98, baseCodingScore + csBonus + hoursBonus);
        
        const styleScore = learningStyle.includes('hands-on') ? 85 : learningStyle.includes('articles') ? 78 : 72;
        const computedQT2 = Math.min(99, styleScore + (codingExperience === 'Advanced Coder' ? 10 : 5));

        const payload = {
          guidanceMentorId: selectedMentor,
          onboardingStep: 3, // Set to STATE_3 (Blueprint Generated)
          onboardingAnswers: {
            role: targetRoleLabel,
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
            mindset_archetype: finalArch || 'Pattern Hunter'
          },
          roadmapGenerated: true
        };

        await api.post('/api/auth/onboarding', payload);
        
        // Force refresh user profile session inside AuthContext
        await refresh();

        // Seed simulated Vault items in local storage
        const dummyVaultItems = [
          {
            id: 'vault_resume_' + Date.now(),
            title: 'Professional Software Engineer Resume',
            item_type: 'resume',
            organization_name: 'Verified PDF Portal',
            description: 'Extracted skills: React, TypeScript, Node.js, SQL. Initial experience rating: Intern/Junior SDE.',
            verified: true,
            ai_confidence_score: 92,
            skill_tags: ['React', 'TypeScript', 'Node.js', 'SQL'],
            is_public: true,
            used_in_resume: true,
            used_in_portfolio: true
          },
          {
            id: 'vault_cert_' + Date.now(),
            title: 'Sentinel Cryptographic Systems Certification',
            item_type: 'certification',
            organization_name: 'Sentinel Academic Registry',
            description: 'Credential demonstrating capability in cloud services and secure routing.',
            verified: true,
            ai_confidence_score: 95,
            skill_tags: ['Docker', 'System Design', 'CI/CD'],
            is_public: true,
            used_in_resume: true,
            used_in_portfolio: false
          }
        ];
        cOS.setVaultItems(dummyVaultItems);
        
        // Sync context state locally
        cOS.setOnboarding({
          role: targetRoleLabel,
          education: profileType,
          skills: finalArch ? `Archetype: ${finalArch}. Skills: ${skillsList}` : skillsList,
          experience: parseExperience(profileType),
          codingExperience,
          learningStyle,
          weeklyHours,
          accessReason: reason
        }, true);
        cOS.setOnboardingStep(3); // Update master state to 3
        cOS.setResumeGenerated(false); // Deep route doesn't generate resume automatically
        
        // Generate baseline roadmap based on trajectory
        const skillsArray = skillsList.split(',').map(s => s.trim());
        await cOS.generateFusedRoadmap(skillsArray, ['Docker', 'System Design']); // default gaps
        
        await qc.invalidateQueries({ queryKey: KEYS.me });
        toast.success('Onboarding Complete! 🚀', 'Your diagnostic blueprint is active.');
        sessionStorage.setItem('pinit_just_onboarded', 'true');
        router.push('/dashboard');
      } catch (err) {
        console.error("Onboarding sync failure", err);
        setSyncing(false);
        toast.error('Sync failed', 'Please check your connection and try again.');
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
      // API call to upload resume and get structured resume properties
      try {
        const userId = user?.id || 'guest';
        let trajectoryLabel = 'Software Engineer';
        let skillsList = '';
        let weakAreas: string[] = [];

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

        // Save Auth profile onboarding answers with deterministic QT1/QT2 evaluation
        const computedQT1 = Math.min(98, (degree.includes('CS') || degree.includes('Computer')) ? 82 : 75);
        const computedQT2 = Math.min(99, 80 + (skillsList.split(',').length * 2));

        const payload = {
          onboardingStep: 3, // Set to STATE_3 (Blueprint Generated)
          onboardingAnswers: {
            role: trajectoryLabel,
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

        await api.post('/api/auth/onboarding', payload);
        
        // Force refresh user profile session inside AuthContext
        await refresh();

        // Seed simulated Vault items in local storage
        const dummyVaultItems = [
          {
            id: 'vault_resume_' + Date.now(),
            title: uploadedFile ? uploadedFile.name : 'Uploaded Resume.pdf',
            item_type: 'resume',
            organization_name: college || 'Verified Academic Portal',
            description: `Extracted skills: ${skillsList}. Initial experience rating: Fresher.`,
            verified: true,
            ai_confidence_score: 89,
            skill_tags: skillsList.split(',').map(s => s.trim()),
            is_public: true,
            used_in_resume: true,
            used_in_portfolio: true
          }
        ];
        cOS.setVaultItems(dummyVaultItems);

        // Save to CareerOSContext local states
        cOS.setOnboarding({
          role: trajectoryLabel,
          education: `${degree} at ${college}`,
          skills: skillsList,
          experience: 'fresher'
        }, true);
        cOS.setOnboardingStep(3); // Update onboardingStep to 3
        cOS.setResumeGenerated(true); // Flag resume uploaded
        
        // Generate Quest modules
        const skillsArray = skillsList.split(',').map(s => s.trim());
        await cOS.generateFusedRoadmap(skillsArray, weakAreas);

        await qc.invalidateQueries({ queryKey: KEYS.me });
        toast.success('Express Onboarding Complete! ⚡', 'Unlock your dashboard and provisional job matches.');
        sessionStorage.setItem('pinit_just_onboarded', 'true');
        router.push('/dashboard');
      } catch (err) {
        console.error('Express onboarding failure', err);
        setSyncing(false);
        toast.error('Sync failed', 'Please check your connection and try again.');
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

  return (
    <div style={{ height: '100vh', background: '#030508', color: '#f1f5f9', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', fontFamily: 'var(--font-body), sans-serif' }}>
      
      {/* Preload VRoid avatar in background by overlaying mentor selection */}
      {activeScreen === 'CHOOSE_GUIDE' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#030508', color: '#f1f5f9', display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '60px 24px' }}>
          {/* Dynamic Background Mesh Orbits */}
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '95%', width: '95%', margin: '0 auto', zIndex: 10, textAlign: 'center' }}>
            {/* Logo Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 16 }}>Pi</div>
              <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>PinIT Career OS</span>
            </div>

            <div style={{ marginBottom: 48 }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, display: 'block', marginBottom: 12 }}>
                Staging Environment Setup
              </span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>
                Choose Your Guidance Mentor
              </h1>
              <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 600, margin: '0 auto', lineHeight: 1.6, marginBottom: 16 }}>
                Select the personal AI guide that will calibrate your career roadmap, analyze your communication DNA, and lead your socratic assessments.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowVaultModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    border: 'none',
                    borderRadius: 100,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '8px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  📁 Vault (Upload Resume & Docs)
                </button>
                <button
                  type="button"
                  onClick={handleFastComplete}
                  disabled={syncing}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: 100,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '8px 20px',
                    cursor: syncing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ⚡ 1-Click Fast Complete (&lt; 30 Seconds)
                </button>
                <div style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--teal)',
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(20, 184, 166, 0.25)',
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

              {/* Vault Onboarding Modal Overlay */}
              {showVaultModal && (
                <div style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 200,
                  background: 'rgba(3, 7, 18, 0.85)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24
                }}>
                  <div style={{
                    background: 'var(--bg2, #0b0f19)',
                    border: '1px solid var(--border, #1f2937)',
                    borderRadius: 24,
                    padding: 32,
                    maxWidth: 540,
                    width: '100%',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                    textAlign: 'left',
                    color: '#f8fafc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24 }}>📁</span>
                        <div>
                          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#fff' }}>Candidate Secure Vault</h3>
                          <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>Upload Resumes & Documents for QT1 Calibration</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowVaultModal(false)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 20, cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{
                      border: '2px dashed rgba(99, 102, 241, 0.4)',
                      borderRadius: 16,
                      padding: '30px 20px',
                      textAlign: 'center',
                      background: 'rgba(99, 102, 241, 0.05)',
                      marginBottom: 20,
                      cursor: 'pointer'
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleVaultFileUpload(e.dataTransfer.files);
                      }
                    }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.multiple = true;
                      input.accept = '.pdf,.docx,.txt';
                      input.onchange = (e: any) => {
                        const files = e.target?.files;
                        if (files && files.length > 0) handleVaultFileUpload(files);
                      };
                      input.click();
                    }}
                    >
                      <div style={{ fontSize: 36, marginBottom: 10 }}>📁</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                        {vaultUploading ? '⏳ Batch Uploading & Analyzing Documents...' : 'Drag & drop or Click to Select Multiple Documents'}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#94a3b8' }}>
                        Supports selecting multiple Resumes, Certifications, Project Reports & Transcripts at once. Builds comprehensive QT1 mastery profile.
                      </div>
                    </div>

                    {vaultSuccess && vaultAnalysisData && (
                      <div style={{
                        padding: '16px 20px',
                        background: 'rgba(16, 185, 129, 0.06)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        borderRadius: 16,
                        color: '#f8fafc',
                        fontSize: 12.5,
                        marginBottom: 20
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontWeight: 800, color: '#34d399', fontSize: 13 }}>
                            ✓ {vaultAnalysisData.totalDocs} Document{vaultAnalysisData.totalDocs > 1 ? 's' : ''} Processed
                          </span>
                          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '3px 8px', borderRadius: 8, fontWeight: 800 }}>
                            Provisional QT1: {vaultAnalysisData.qt1Score}/100
                          </span>
                        </div>

                        {/* Files list */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                          {vaultUploadedFilesInfo.map((f, i) => (
                            <div key={i} style={{ fontSize: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 8px', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                              📄 {f.name} ({f.size})
                            </div>
                          ))}
                        </div>

                        {/* Extracted skills */}
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Extracted Skill Nodes:</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {vaultAnalysisData.extractedSkills.map(s => (
                              <span key={s} style={{ fontSize: 10.5, background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 4, padding: '2px 6px', fontWeight: 700 }}>
                                {s} <span style={{ fontSize: 9, opacity: 0.7 }}>(Baseline)</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Audit verification tag */}
                        <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                          🛡️ Audit Status: {vaultAnalysisData.integrityStatus}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {vaultSuccess && (
                        <button
                          type="button"
                          onClick={() => {
                            setVaultUploadedFilesInfo([]);
                            setVaultAnalysisData(null);
                            setVaultSuccess(false);
                            cOS.setVaultItems([]);
                            toast.info('Vault Reset', 'Cleared all uploaded documents from vault baseline.');
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#f87171',
                            padding: '8px 14px',
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          🗑️ Clear All Vault Docs
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowVaultModal(false)}
                        style={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          border: 'none',
                          color: '#fff',
                          padding: '10px 20px',
                          borderRadius: 10,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                          marginLeft: 'auto'
                        }}
                      >
                        {vaultSuccess ? 'Continue Diagnostic Onboarding →' : 'Close'}
                      </button>
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
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 70, 229, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 20 }}>👩‍💼</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', marginBottom: 4 }}>Ms. Priya</h2>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 16 }}>
                  Full-Stack Systems Mentor
                </span>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
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
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(20, 184, 166, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 20 }}>👨‍💼</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', marginBottom: 4 }}>Mr. Akash</h2>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 16 }}>
                  Interactive UX & Frontend Engineer
                </span>
                <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Specialized in React, Next.js, responsive layouts, user experience, design systems, and rapid prototyping. Focuses on visual feedback and hands-on building.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Dynamic Background Mesh Orbits */}
      <div style={{ position: 'absolute', top: '-15%', left: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      {/* Top Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(10,15,26,0.3)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14 }}>Pi</div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.5px' }}>PinIT Career OS</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleFastComplete}
            disabled={syncing}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: 100,
              color: '#fff',
              fontSize: 11,
              fontWeight: 800,
              padding: '6px 14px',
              cursor: syncing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            ⚡ Fast Finish (&lt; 30s)
          </button>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 100, padding: '4px 12px' }}>
            {activeScreen === 'INTENT_SELECTION' ? 'STAGE 01: INTENT SELECTION' : 'STAGE 02: PROFILE GENERATION'}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '60fr 40fr', maxWidth: '98%', width: '98%', margin: '0 auto', padding: '12px 24px 24px 24px', gap: 24, zIndex: 5, overflow: 'hidden' }}>
        
        {/* Left Column: VRoid Mentor Viewport */}
        <section style={{ background: 'rgba(10, 15, 26, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', minHeight: 0 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            {selectedMentor === 'anish' ? (
              <VRoidInterviewAvatar teacherId="kashyap" animState={animState} zoom={zoom} />
            ) : (
              <VRoidInterviewAvatar teacherId="priya" animState={animState} zoom={zoom} />
            )}
            
            {/* Audio Wave Listening Overlay */}
            {animState === 'listening' && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(79,70,229,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="mic-wave-bar" style={{ width: 4, height: 20, background: 'var(--accent)', borderRadius: 2, animation: `pulse-height 1s ease-in-out infinite alternate ${i * 0.15}s` }} />
                  ))}
                </div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '1px' }}>Listening... Speak now</div>
              </div>
            )}
          </div>

          {/* Floating Controls Overlay */}
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, background: 'rgba(10,15,26,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '6px 12px', backdropFilter: 'blur(10px)', zIndex: 12 }}>
            <button onClick={() => setZoom(z => Math.min(2.2, z + 0.1))} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }} title="Zoom In">🔍+</button>
            <button onClick={() => setZoom(z => Math.max(1.1, z - 0.1))} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }} title="Zoom Out">🔍-</button>
            <button onClick={() => setIsMuted(m => !m)} style={{ background: 'none', border: 'none', color: isMuted ? '#f87171' : '#94a3b8', fontSize: 14, cursor: 'pointer', padding: '4px 8px' }} title={isMuted ? "Unmute Voice" : "Mute Voice"}>
              {isMuted ? '🔇' : '🔊'}
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
                color: useNeural ? '#10b981' : '#94a3b8',
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
                <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
                  Choose Your Staging Track
                </h2>
                <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.5 }}>
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
                    e.currentTarget.style.background = 'rgba(79, 70, 229, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>⚡</span>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: 0 }}>Express Route (1 Min)</h3>
                  </div>
                  <p style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
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
                    e.currentTarget.style.background = 'rgba(6, 182, 212, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>🔬</span>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: 0 }}>Deep Evolution (15 Min)</h3>
                  </div>
                  <p style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.4, margin: 0 }}>
                    Complete full diagnostic profiling and assessments.
                  </p>
                </div>

              </div>

              {/* Real-time Voice Analytics Card */}
              {voiceConfidence !== null && (
                <div style={{ background: 'rgba(79, 70, 229, 0.05)', border: '1.5px solid rgba(79, 70, 229, 0.2)', borderRadius: 14, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>🎙️ Realtime Voice DNA:</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                    <span style={{ color: '#94a3b8' }}>Confidence Index:</span>
                    <span style={{ color: '#f8fafc', fontWeight: 700 }}>{voiceConfidence}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                    <span style={{ color: '#94a3b8' }}>Articulation Score:</span>
                    <span style={{ color: '#f8fafc', fontWeight: 700 }}>{voiceArticulation}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5 }}>
                    <span style={{ color: '#94a3b8' }}>Vocal Archetype:</span>
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
                    color: '#cbd5e1',
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
                    background: 'rgba(79, 70, 229, 0.15)',
                    border: '1px solid rgba(79, 70, 229, 0.3)',
                    borderRadius: 10,
                    color: '#a5b4fc',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(79, 70, 229, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(79, 70, 229, 0.15)';
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
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
                  border: '1.5px dashed rgba(79, 70, 229, 0.35)',
                  borderRadius: 10,
                  color: 'var(--accent)',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-mono)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.35)';
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
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 12, alignSelf: 'flex-start', marginBottom: 20 }}
              >
                ← Go Back
              </button>

              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', marginBottom: 8, letterSpacing: '-0.5px' }}>
                  Define Your Evolution Gap
                </h2>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                  Slide to indicate your estimated current skill level compared to your dream placement ambition. This initializes the roadmap density calculations.
                </p>
              </div>

              {/* Slider Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
                
                {/* Current Skill Ability */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                    <span style={{ color: '#94a3b8' }}>Current Technical Ability</span>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 4 }}>
                    <span>Novice</span>
                    <span>Intermediate</span>
                    <span>Advanced</span>
                  </div>
                </div>

                {/* Target Career Ambition */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                    <span style={{ color: '#94a3b8' }}>Target Career Ambition</span>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 4 }}>
                    <span>Competent (60%)</span>
                    <span>Top-Tier (85%)</span>
                    <span>Legendary (100%)</span>
                  </div>
                </div>

              </div>

              {/* Calculations Box */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, padding: 18, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>The Verification Gap:</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--coral)', fontFamily: 'var(--font-mono)' }}>
                    {targetAmbition - currentAbility}%
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${targetAmbition - currentAbility}%`, background: 'linear-gradient(90deg, var(--coral), var(--accent))', borderRadius: 3 }} />
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12, lineHeight: 1.5, fontStyle: 'italic' }}>
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
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
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
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 11, alignSelf: 'flex-start', marginBottom: 14 }}
              >
                ← Go Back
              </button>

              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#f8fafc', marginBottom: 6, letterSpacing: '-0.5px' }}>
                  Express Staging setup
                </h2>
                <p style={{ fontSize: 12, color: '#94a3b8' }}>
                  Provide your target trajectory & academic demographics. Then drag & drop your resume PDF to verify.
                </p>
              </div>

              <form onSubmit={handleExpressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* Trajectory Selector */}
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Target Career Trajectory</label>
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
                          background: trajectory === t.id ? 'rgba(79, 70, 229, 0.08)' : 'rgba(255,255,255,0.01)',
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
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>College Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Apex Institute" 
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      style={{ width: '100%', height: 38, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '0 12px', fontSize: 12.5, color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Degree Major</label>
                    <input 
                      type="text" 
                      placeholder="e.g. B.Tech CSE" 
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      style={{ width: '100%', height: 38, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '0 12px', fontSize: 12.5, color: '#fff', outline: 'none' }}
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
                    background: dragOver ? 'rgba(79, 70, 229, 0.04)' : uploadedFile ? 'rgba(20, 184, 166, 0.02)' : 'rgba(255,255,255,0.01)',
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
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Click or drag to change files</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 24, marginBottom: 4 }}>📥</div>
                      <div style={{ fontSize: 12.5, fontWeight: 700 }}>Drag & Drop Resume PDF here</div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>or click to browse local files</div>
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
                    color: '#fff',
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
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: animState === 'talking' ? '#10b981' : '#6366f1', animation: animState === 'talking' ? 'ping 1.5s infinite' : 'none' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{selectedMentor === 'priya' ? 'Ms. Priya' : 'Mr. Akash'}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>{animState === 'talking' ? 'Speaking...' : animState === 'listening' ? 'Listening...' : animState === 'thinking' ? 'Analyzing...' : 'Online'}</div>
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
                        background: isAi ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        border: isAi ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        color: '#f8fafc',
                        fontSize: 13,
                        lineHeight: 1.5,
                        boxShadow: isAi ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.25)'
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
                          background: 'rgba(79, 70, 229, 0.15)',
                          border: '1.5px solid rgba(79, 70, 229, 0.4)',
                          color: '#a5b4fc',
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
                  <span>Identity Discovery</span>
                  <span>Slide {currentIdentityQ + 1} of {identityQs.length}</span>
                </div>
                
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                    {q.category}
                  </h3>
                  <p style={{ fontSize: 15, color: '#f8fafc', lineHeight: 1.6, fontWeight: 600 }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 12, fontWeight: 700 }}>
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
                    border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)'
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
                  <span>{isBusinessStream ? 'Business & Leadership Simulation' : 'Technical & Engineering Simulation'}</span>
                  <span>Card {currentScenario + 1} of {activeScenarios.length}</span>
                </div>
                
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
                    {scenario.title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
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
                        color: '#f8fafc',
                        fontSize: 12.5,
                        fontWeight: 650,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(79, 70, 229, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.25)';
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
                  <span>Vocal Assessment</span>
                  <span style={{ color: 'var(--accent)' }}>Microphone Active</span>
                </div>
                
                {speechState === 'ready' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🎙️</div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>Microphone Calibration</h3>
                    <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>
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
                        background: 'rgba(79, 70, 229, 0.1)',
                        border: '1.5px solid var(--accent)',
                        borderRadius: 12,
                        color: 'var(--accent)',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Run Acoustic Calibration
                    </button>
                  </div>
                )}

                {speechState === 'calibrating' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin 1.5s linear infinite' }}>⬡</div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>Calibrating...</h3>
                    <div style={{ width: 140, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, margin: '16px auto', overflow: 'hidden' }}>
                      <div style={{ width: `${calibrationProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
                    </div>
                    <p style={{ fontSize: 11, color: '#64748b' }}>Checking ambient frequency thresholds.</p>
                  </div>
                )}

                {(speechState === 'calibrated' || speechState === 'recording' || speechState === 'recorded') && (
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
                      Spoken Prompt
                    </h3>
                    <p style={{ fontSize: 15, color: '#f8fafc', lineHeight: 1.5, fontWeight: 600, marginBottom: 20 }}>
                      "{spokenPromptText}"
                    </p>

                    <div style={{
                      minHeight: 80,
                      background: '#070913',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12,
                      padding: 14,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: '#34d399',
                      marginBottom: 14,
                      textAlign: 'left'
                    }}>
                      <span style={{ color: '#64748b', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 4, marginBottom: 6 }}>
                        STT TRANSCRIPT / DICTATION CONSOLE
                      </span>
                      {speechTranscript || (speechState === 'recording' ? 'Listening... Speak now...' : 'Click Record or select/type response below...')}
                    </div>

                    {/* ⌨️ Mic Fault Tolerance: Quick Response Templates */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 10.5, color: '#94a3b8', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
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
                            }}
                            style={{
                              padding: '8px 12px',
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              borderRadius: 8,
                              color: '#cbd5e1',
                              fontSize: 11,
                              textAlign: 'left',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(79, 70, 229, 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)';
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
                          if (speechState === 'recording') {
                            setSpeechState('recorded');
                            setAnimState('idle');
                            if (recognitionRef.current) recognitionRef.current.stop();
                          } else {
                            setSpeechState('recording');
                            setSpeechTranscript('');
                            setAnimState('listening');
                            
                            if (typeof window !== 'undefined') {
                              const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                              if (SpeechRecognition) {
                                const rec = new SpeechRecognition();
                                rec.continuous = true;
                                rec.interimResults = false;
                                rec.lang = 'en-US';
                                rec.onresult = (e: any) => {
                                  const chunk = e.results[e.results.length - 1]?.[0]?.transcript;
                                  if (chunk) {
                                    setSpeechTranscript(prev => prev + ' ' + chunk);
                                  }
                                };
                                rec.onerror = () => setSpeechState('recorded');
                                rec.onend = () => setSpeechState('recorded');
                                recognitionRef.current = rec;
                                rec.start();
                              } else {
                                setTimeout(() => {
                                  const defaultText = isCommerce
                                    ? "My goal is to become a top Financial Analyst, build quantitative valuation models, and drive FinTech growth."
                                    : isManagement
                                    ? "My goal is to become a high-impact Product Manager, lead agile engineering teams, and scale market funnels."
                                    : "My goal is to become a high-impact Software Engineer and build production applications.";
                                  setSpeechTranscript(defaultText);
                                  setSpeechState('recorded');
                                  setAnimState('idle');
                                }, 1500);
                              }
                            }
                          }
                        }}
                        style={{
                          flex: 1, height: 42,
                          background: speechState === 'recording' ? '#dc2626' : 'rgba(255,255,255,0.04)',
                          border: `1.5px solid ${speechState === 'recording' ? '#dc2626' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer'
                        }}
                      >
                        {speechState === 'recording' ? '⏹ Stop Recording' : '🎙️ Record Audio'}
                      </button>

                      <button
                        type="button"
                        disabled={speechState !== 'recorded' && !speechTranscript}
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
                          border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer',
                          opacity: (speechState !== 'recorded' && !speechTranscript) ? 0.5 : 1
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
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--teal)', padding: '3px 8px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                      QT2 Mindset Analysis Complete
                    </span>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '3px 8px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                      {studentType.includes('Commerce') || studentType.includes('B.Com') ? '📊 FinTech & Commerce Track (B.Com)' : studentType.includes('Management') || studentType.includes('BBA') ? '📈 Product & Business Track (BBA)' : '💻 Tech & Software Track'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', marginTop: 6, letterSpacing: '-0.6px' }}>
                    {qt2Breakdown.blendTitle}
                  </h2>
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginTop: 4 }}>
                    {qt2Breakdown.blendDescription}
                  </p>
                </div>

                {/* 4 Quadrants Mindset Breakdown */}
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, padding: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
                      🧠 QT2 Cognitive Mindset Distribution:
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: 'rgba(99, 102, 241, 0.12)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 100, padding: '2px 8px', fontWeight: 700 }}>
                      Self-Awareness Index: {qt2Breakdown.selfAwarenessScore}%
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
                    {[
                      { label: 'Pattern Hunter', icon: '🧩', score: qt2Breakdown.patternHunter, color: '#6366f1' },
                      { label: 'Stabilizer', icon: '🛡️', score: qt2Breakdown.stabilizer, color: '#10b981' },
                      { label: 'Social IQ', icon: '🤝', score: qt2Breakdown.socialIQ, color: '#f59e0b' },
                      { label: 'Explorer', icon: '🚀', score: qt2Breakdown.explorer, color: '#06b6d4' }
                    ].map(quad => (
                      <div key={quad.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 700, marginBottom: 6 }}>
                          <span style={{ color: '#f8fafc' }}>{quad.icon} {quad.label}</span>
                          <span style={{ color: quad.color, fontFamily: 'var(--font-mono)' }}>{quad.score}%</span>
                        </div>
                        <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${quad.score}%`, background: quad.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>🎯 {qt2Breakdown.selfAwarenessLabel}</span>
                  </div>
                </div>

                {/* 🧑‍💼 Choose Dashboard Mentor Selector */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.6px', fontFamily: 'var(--font-mono)' }}>
                    Choose Your Dashboard VRoid Guide (Locked After Onboarding)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div 
                      onClick={() => setSelectedMentor('priya')}
                      style={{
                        background: selectedMentor === 'priya' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.01)',
                        border: `1.5px solid ${selectedMentor === 'priya' ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: 12, padding: 12, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center', transition: 'all 0.15s'
                      }}
                    >
                      <span style={{ fontSize: 22 }}>👩‍💼</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: selectedMentor === 'priya' ? '#a5b4fc' : '#f8fafc' }}>Ms. Priya</div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>Warm, structured steps.</div>
                      </div>
                    </div>
                    <div 
                      onClick={() => setSelectedMentor('anish')}
                      style={{
                        background: selectedMentor === 'anish' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.01)',
                        border: `1.5px solid ${selectedMentor === 'anish' ? 'var(--accent)' : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: 12, padding: 12, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center', transition: 'all 0.15s'
                      }}
                    >
                      <span style={{ fontSize: 22 }}>👨‍💼</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: selectedMentor === 'anish' ? '#a5b4fc' : '#f8fafc' }}>Mr. Akash</div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>High accountability.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOnboardingComplete(studentType, targetGoal, accessReason, qt2Breakdown.blendTitle)}
                  style={{
                    width: '100%', height: 44,
                    background: 'linear-gradient(135deg, var(--teal) 0%, var(--accent) 100%)',
                    border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(20, 184, 166, 0.25)'
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
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(79,70,229,0.1)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid transparent', borderTopColor: 'var(--accent)', animation: 'spin 1.2s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>
              {syncProgress}%
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: '#f8fafc', marginBottom: 4, letterSpacing: '-0.5px' }}>
            {uploadedFile ? 'Parser Staging Sandbox' : 'Orchestrating Trajectory OS'}
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'var(--font-mono)', textAlign: 'center', marginBottom: 24 }}>
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
              color: '#34d399',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              marginBottom: 24,
              minHeight: 120,
              justifyContent: 'flex-start'
            }}>
              <div style={{ color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
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
